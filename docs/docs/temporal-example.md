# 使用 Gemini 與 Temporal 打造耐久的 AI 代理

本教學將帶你打造一個耐久的 AI 代理：以 Gemini API 進行推理，並以 [Temporal](https://temporal.io/) 提供耐久性。它使用 Temporal 內建的 [Gemini SDK 整合](https://github.com/temporalio/sdk-python/tree/main/temporalio/contrib/google_genai)。

這個代理能呼叫工具，例如查詢天氣警報或對 IP 位址進行地理定位，並會持續迴圈，直到蒐集到足夠資訊來回應為止。

這個範例與一般代理展示的不同之處，在於**耐久性**。每一次 LLM 呼叫與每一次工具調用，都會由 Temporal 持久化保存。若行程當機、網路中斷或 API 逾時，Temporal 會自動重試，並從最後一個完成的步驟繼續執行。對話紀錄不會遺失，工具呼叫也不會被錯誤地重複執行。

## 架構 {#architecture}

架構由三個部分組成：

*   **Workflow**：單次 `generate_content` 呼叫。Gemini SDK 的自動函式呼叫（AFC）迴圈會在 Workflow *內部*執行，而 Temporal 讓它的每個步驟都具備耐久性。
*   **Activities**：個別的工作單元，由 Temporal 賦予耐久性。Gemini API 呼叫會自動成為 Activities。
*   **Worker**：執行 Workflows 與 Activities 的行程，也是唯一存放你的 API 金鑰的地方。

在本範例中，你會把這三個部分都放在同一個檔案（`durable_agent_worker.py`）裡。在實際的實作中，你通常會將它們拆開，以取得不同的部署與擴展優勢。你將透過 Temporal CLI 向代理提供提示詞，因此不需要撰寫任何用戶端程式碼。

## 前置條件 {#prerequisites}

要完成本指南，你需要：

*   一把 Gemini API 金鑰。你可以在 [Google AI Studio](https://aistudio.google.com/apikey) 免費建立。
*   [Python](https://www.python.org/downloads/) 3.10 版或更新版本。
*   用於管理相依性的 [uv](https://docs.astral.sh/uv/getting-started/installation/)。
*   用於執行本機開發伺服器與啟動 Workflows 的 [Temporal CLI](https://docs.temporal.io/cli)。

## 設定 {#setup}

開始之前，請先確認本機已執行 [Temporal 開發伺服器](https://docs.temporal.io/cli#start-dev-server)：

```posix-terminal
temporal server start-dev
```

接著，建立專案並安裝所需的相依性：

```posix-terminal
uv init durable-gemini-agent

cd durable-gemini-agent

uv add "temporalio[google-genai]" httpx python-dotenv
```

uv 會為你建立並管理虛擬環境，因此本教學後續的每個 Python 指令都透過 `uv run` 執行。

在專案目錄中建立一個 `.env` 檔案，放入你的 Gemini API 金鑰。你可以從 [Google AI Studio](https://aistudio.google.com/apikey) 取得 API 金鑰。

```posix-terminal
echo "GOOGLE_API_KEY=your-api-key-here" > .env
```


!!! note " "

      注意：只有 worker 行程需要 API 金鑰。啟動 Workflow 的一方不需要，Workflow 本身也不需要——真正的 `genai.Client` 是在 worker 上建構的，永遠不會進入 Workflow 程式碼，因此任何驗證資料都不可能出現在 Temporal 的事件歷史中。


## 實作 {#implementation}

本教學的其餘部分將從上到下走讀 `durable_agent_worker.py`，逐步拼湊出這個代理。請建立該檔案並跟著操作。


!!! note " "

      注意：`temporalio.contrib.google_genai` 整合目前為實驗性功能，其 API 可能會在 Temporal Python SDK 的未來版本中變更。


### 匯入與沙箱設定 {#imports}

先從必須在最前面定義的匯入開始。`workflow.unsafe.imports_passed_through()` 區塊告訴 Temporal 的 Workflow 沙箱，讓 `httpx` 不受限制地穿透匯入。匯入 `httpx` 時會執行 `class _CookieCompatRequest(urllib.request.Request)`，而沙箱會阻止對該標準函式庫類別的子類別化。

你的工具會使用 `httpx`，而 `activity_as_tool()` 需要 Workflow 匯入這些工具函式，Gemini 才能從它們的簽名推導出 schema。因此無論你如何拆分檔案，`httpx` 都會進入沙箱——把工具移到獨立模組也無法避開這一點。

```python
from temporalio import workflow

with workflow.unsafe.imports_passed_through():
    import httpx
```

你不需要在這裡列出 `google.genai`。你稍後設定的 Temporal 外掛會自動將它——連同 `pydantic_core` 與 `annotated_types`——加入沙箱的穿透集合。

### 系統指令 {#system-instructions}

接著，定義代理的性格。系統指令告訴模型該如何行事。這個代理被指示在不需要工具時以俳句回應。

```python
SYSTEM_INSTRUCTIONS = """
You are a helpful agent that can use tools to help the user.
You will be given an input from the user and a list of tools to use.
You may or may not need to use the tools to satisfy the user ask.
If no tools are needed, respond in haikus.
"""
```

### 工具定義 {#tool-definitions}

現在定義代理可以使用的工具。每個工具都是一般的 Temporal Activity：一個以 `@activity.defn` 裝飾、參數帶有型別標註並附有說明性 docstring 的非同步函式。Gemini 會根據該簽名與 docstring 建立函式宣告，因此請在 `Args` 區段中為每個參數撰寫說明。

```python
import json

from temporalio import activity

NWS_API_BASE = "https://api.weather.gov"
USER_AGENT = "weather-app/1.0"

@activity.defn
async def get_weather_alerts(state: str) -> str:
    """Get weather alerts for a US state.

    Args:
        state: Two-letter US state code (e.g. CA, NY)
    """
    headers = {"User-Agent": USER_AGENT, "Accept": "application/geo+json"}
    url = f"{NWS_API_BASE}/alerts/active/area/{state}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, timeout=5.0)
        response.raise_for_status()
        return json.dumps(response.json())
```

接著，定義用於 IP 位址地理定位的工具：

```python
@activity.defn
async def get_ip_address() -> str:
    """Get the public IP address of the current machine."""
    async with httpx.AsyncClient() as client:
        response = await client.get("https://icanhazip.com")
        response.raise_for_status()
        return response.text.strip()

@activity.defn
async def get_location_info(ipaddress: str) -> str:
    """Get the location information for an IP address including city, state, and country.

    Args:
        ipaddress: An IP address to look up
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(f"http://ip-api.com/json/{ipaddress}")
        response.raise_for_status()
        result = response.json()
        return f"{result['city']}, {result['regionName']}, {result['country']}"
```

整個工具層就是這樣。沒有工具登錄表、沒有 `FunctionDeclaration` 的建構、也沒有分派表——下一節會以 `activity_as_tool()` 包裝這些 Activities，它會把每個參數依位置傳遞給 Activity。參數數量為零、一個或多個的工具都能運作。

### 代理 Workflow {#agent-workflow}

現在你已備齊所有零件，可以完成代理的建構。`AgentWorkflow` 類別只發出一次 `generate_content` 呼叫。`TemporalAsyncClient` 是可直接替代 `AsyncClient` 的版本，它的每個 API 呼叫都會以 Temporal Activity 的形式執行；`activity_as_tool()` 則把你的每個 Activity 轉換成 Gemini 工具。

當模型要求使用工具時，SDK 的 AFC 迴圈——在 Workflow 內部執行——會透過 `workflow.execute_activity` 分派該工具，將結果附加到對話中，再次呼叫模型。這個迴圈就是代理本身，而且它具備耐久性，因為每個步驟都是記錄在 Temporal 事件歷史中的 Activity。

```python
from datetime import timedelta

from google.genai import types
from temporalio.contrib.google_genai import TemporalAsyncClient, activity_as_tool
from temporalio.workflow import ActivityConfig

TOOL_CONFIG = ActivityConfig(start_to_close_timeout=timedelta(seconds=30))

@workflow.defn
class AgentWorkflow:
    """Agent workflow that uses Gemini for LLM calls and executes tools."""

    @workflow.run
    async def run(self, prompt: str) -> str:
        client = TemporalAsyncClient()

        response = await client.models.generate_content(
            model="gemini-4-hydrogen",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTIONS,
                tools=[
                    activity_as_tool(get_weather_alerts, activity_config=TOOL_CONFIG),
                    activity_as_tool(get_ip_address, activity_config=TOOL_CONFIG),
                    activity_as_tool(get_location_info, activity_config=TOOL_CONFIG),
                ],
            ),
        )

        # Leave this in place. You will un-comment it during a durability
        # test later on.
        # await workflow.sleep(timedelta(seconds=10))

        return response.text or ""
```

有幾點需要注意：

*   在 Workflow **內部**建構 `TemporalAsyncClient`。它不攜帶任何憑證；它只知道如何把 API 呼叫轉換成 Activity 調用。
*   `activity_config` 必須設定 `start_to_close_timeout` 或 `schedule_to_close_timeout`。Temporal 要求設定逾時，而工具 Activities 沒有預設值。
*   Gemini API Activities 預設使用 60 秒的 `start_to_close_timeout`。如果你的模型呼叫需要更長的時間，可透過 `TemporalAsyncClient(activity_config=...)` 覆寫。

這個代理完全具備耐久性。如果 worker 在經過數輪對話後當機，Temporal 會從中斷處精確接續，不會重新調用已經執行過的 LLM 呼叫或工具呼叫。

### 重試 {#retries}

重試由 Temporal 負責，因此不要啟用 Gemini SDK 自身的重試迴圈。改為在 Activity 設定上以 `retry_policy` 設定重試行為：

```python
from temporalio.common import RetryPolicy

TOOL_CONFIG = ActivityConfig(
    start_to_close_timeout=timedelta(seconds=30),
    retry_policy=RetryPolicy(maximum_attempts=3),
)
```

API 失敗也會自動為你分類。暫時性狀態（408、429、5xx）保持可重試，讓 Activity 的重試政策得以適用；其他狀態（例如格式錯誤的請求所回傳的 400）則不可重試，因此 Workflow 會快速失敗，而不是把嘗試次數浪費在不會自行解決的錯誤上。

你可以擴充這套分類方式。此整合會把每個 API 失敗呈現為一個 `ApplicationError`，其型別即為 Gemini 例外類別的名稱——4xx 為 `ClientError`、5xx 為 `ServerError`——因此只要把某個名稱列入 `non_retryable_error_types`，就能將它移出暫時性集合。例如，若要停止重試 Gemini 端的服務中斷，並在第一次出現 5xx 時就讓 Workflow 失敗，可透過 `TemporalAsyncClient` 將政策套用到 Gemini API Activities：

```python
from temporalio.common import RetryPolicy

client = TemporalAsyncClient(
    activity_config=ActivityConfig(
        start_to_close_timeout=timedelta(seconds=60),
        retry_policy=RetryPolicy(
            maximum_attempts=5,
            non_retryable_error_types=["ServerError"],
        ),
    ),
)
```

### Worker 啟動 {#worker-startup}

最後，把所有零件串接起來。Temporal worker 會連線到 Temporal 服務，並扮演 Workflow 與 Activity 任務的排程器。

真正的 `genai.Client` 就在這裡建立，使用的是你的 API 金鑰。`GoogleGenAIPlugin` 會接收該用戶端並註冊 Gemini API Activities、安裝 Pydantic 資料轉換器，並設定 Workflow 沙箱。

```python
import asyncio
import os

from dotenv import load_dotenv
from google import genai
from temporalio.client import Client
from temporalio.contrib.google_genai import GoogleGenAIPlugin
from temporalio.envconfig import ClientConfig
from temporalio.worker import Worker

async def main():
    gemini = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])
    plugin = GoogleGenAIPlugin(gemini)

    config = ClientConfig.load_client_connect_config()
    config.setdefault("target_host", "localhost:7233")
    client = await Client.connect(**config, plugins=[plugin])

    worker = Worker(
        client,
        task_queue="gemini-agent",
        workflows=[
            AgentWorkflow,
        ],
        activities=[
            get_weather_alerts,
            get_ip_address,
            get_location_info,
        ],
    )
    await worker.run()

if __name__ == "__main__":
    load_dotenv()
    asyncio.run(main())
```

這個外掛替你省去了三段原本需要自行撰寫的樣板程式碼：

*   不需要 `data_converter=pydantic_data_converter`——外掛會自行安裝 Pydantic 酬載轉換器。
*   不需要 `activity_executor=ThreadPoolExecutor`——每個 Activity 都是非同步的。
*   不需要在 `activities` 清單中列出 Gemini Activities——外掛會註冊它們。你只需要註冊自己的工具。

## 執行代理 {#run-agent}

這就是完整的代理。你不需要撰寫用戶端——Temporal CLI 就能為你啟動 Workflow。

如果你還沒啟動 Temporal 開發伺服器，請先啟動：

```posix-terminal
temporal server start-dev
```

在新的終端機視窗中，啟動代理 worker：

```posix-terminal
uv run durable_agent_worker.py
```

在第三個終端機視窗中，向你的代理提交一個查詢：

```posix-terminal
temporal workflow execute --type AgentWorkflow --task-queue gemini-agent \
    --input '"are there any weather alerts for where I am?"'
```

請注意任務佇列：它與 worker 輪詢的是同一個。啟動 Workflow 會把一個攜帶使用者提示詞的 Workflow 任務分派到該佇列，這正是啟動代理的動作。`execute` 會阻塞直到 Workflow 完成並印出結果。如果你不想等待，可改用 `temporal workflow start` 並明確指定 `--workflow-id`，稍後再以 `temporal workflow result -w your-workflow-id` 取得結果。省略 `--workflow-id` 時，Temporal 會為你產生 Workflow ID。

`--input` 接受 JSON，因此純字串提示詞需要在 shell 引號內再加上自己的引號。CLI 不需要 Gemini API 金鑰，也不需要任何資料轉換器設定：Workflow 的引數與回傳值都是純字串，預設的 JSON 酬載轉換器即可處理。

在 `http://localhost:8233/namespaces/default/workflows` 開啟 Temporal UI，觀看代理迴圈的展開。你會看到 `gemini_api_client_async_request` Activities——每個模型回合一個——與工具呼叫的 Activities 交錯出現，每個都標示著 `tool_call` 摘要。這種交錯正是 AFC 迴圈，而且它同時具備耐久性與可觀察性。

試著用幾個不同的提示詞，看看代理如何推理並呼叫工具。每個指令都與上方的指令相同，只是換上新的 `--input`：

```posix-terminal
temporal workflow execute --type AgentWorkflow --task-queue gemini-agent \
    --input '"are there any weather alerts for New York?"'

temporal workflow execute --type AgentWorkflow --task-queue gemini-agent \
    --input '"where am I?"'

temporal workflow execute --type AgentWorkflow --task-queue gemini-agent \
    --input '"what is my ip address?"'

temporal workflow execute --type AgentWorkflow --task-queue gemini-agent \
    --input '"tell me a joke"'
```

最後一個提示詞不需要任何工具，因此代理會依據 `SYSTEM_INSTRUCTIONS` 以俳句回應。

## 測試耐久性 {#test-durability}

以 Temporal 建構，能確保你的代理在故障時無縫存續。你可以透過兩個不同的實驗來測試這一點。

### 模擬網路中斷 {#network-outage}

在這個測試中，你將暫時停用電腦的網際網路連線，提交一個 Workflow，觀看 Temporal 自動重試，然後恢復網路，看看它如何復原。

1.  讓你的機器中斷網際網路連線（例如關閉 Wi-Fi）。

2.  提交一個 Workflow：

    ```posix-terminal
    temporal workflow execute --type AgentWorkflow --task-queue gemini-agent \
        --input '"tell me a joke"'
    ```

3.  查看 Temporal UI（`http://localhost:8233`）。你會看到 Gemini API Activity 失敗，而 Temporal 在背景自動管理重試。

4.  重新連上網際網路。

5.  下一次自動重試將成功連上 Gemini API，你的終端機便會印出最終結果。


### 在 worker 當機後存續 {#worker-crash}

在這個測試中，你會在執行途中終止 worker 並重新啟動它。Temporal 會重播 Workflow 歷史（事件溯源），並從最後一個完成的 Activity 繼續——已經完成的 LLM 調用與工具呼叫不會重複執行。

1.  為了爭取終止 worker 的時間，請開啟 `durable_agent_worker.py`，取消 `AgentWorkflow.run` 中耐久計時器的註解：

    ```python
    await workflow.sleep(timedelta(seconds=10))
    ```

    `workflow.sleep` 是 Temporal 計時器，不是本機計時器。它會記錄在歷史中，並在重新啟動後存續，這正是這個測試可靠的原因。

2.  重新啟動 worker：

    ```posix-terminal
    uv run durable_agent_worker.py
    ```

3.  提交一個會觸發多個工具的查詢：

    ```posix-terminal
    temporal workflow execute --type AgentWorkflow --task-queue gemini-agent \
        --input '"are there any weather alerts where I am?"'
    ```

4.  待工具呼叫完成且計時器開始運行後，終止 worker 行程（在 worker 終端機按 `Ctrl-C`，若在背景執行則使用 `kill %1`）。

5.  重新啟動 worker：

    ```posix-terminal
    uv run durable_agent_worker.py
    ```


Temporal 會重播 Workflow 歷史。已經完成的 LLM 呼叫與工具調用**不會**重新執行——它們的結果會立即從歷史（事件日誌）重播，計時器繼續運行，Workflow 也會成功完成。

## 深入探索 {#going-further}

此整合支援的功能比本教學涵蓋的更多。詳情請參閱[外掛文件](https://github.com/temporalio/sdk-python/tree/main/temporalio/contrib/google_genai)：

*   **串流**：照常使用 `generate_content_stream`。若要讓外部消費者（例如聊天 UI）在 Workflow 耐久執行的同時即時觀察資料塊，請設定 `TemporalAsyncClient(streaming_topic=...)`，並在 Workflow 中託管一個 `WorkflowStream`。
*   **MCP**：在 worker 上以 `GoogleGenAIPlugin(mcp_servers={...})` 註冊用戶端 MCP 伺服器，並在 Workflow 中以 `TemporalMcpClientSession` 依名稱引用它。工具探索與呼叫會以 Activities 的形式，透過 worker 端的共用連線執行。
*   **Vertex AI**：將 `vertexai=True` 同時傳給 worker 端的 `genai.Client` 與 Workflow 端的 `TemporalAsyncClient`，並在 Workflow 端明確設定 `project` 與 `location`，讓重播保持確定性。

## 延伸資源 {#further-resources}

*   [Temporal 文件](https://docs.temporal.io/)
*   [Temporal Python SDK](https://docs.temporal.io/develop/python)
*   [Temporal Gemini SDK 整合](https://docs.temporal.io/develop/python/integrations/google-genai)
*   [Google GenAI SDK](https://googleapis.github.io/python-genai/)
