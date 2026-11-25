# 使用 Gemini 與 Cua Driver 操作電腦

使用 Antigravity MCP 或 Interactions API，建立一個 Gemini 代理，在您繼續打字的同時於背景操作真正的桌面應用程式。

作者：[Mark McDonald](https://linktr.ee/markmcd)、[Francesco Bonacci](https://cua.ai/)
發布於 2026 年 11 月 2 日
閱讀時間 8 分鐘

## 總覽

本指南說明如何建立一個 Gemini 代理，在您繼續工作的同時，於電腦上操作真正的桌面應用程式。[Cua Driver](https://cua.ai/docs/cua-driver) 會透過各應用程式的無障礙樹狀結構與螢幕截圖讀取應用程式，並在背景將點擊與按鍵傳送給該應用程式，因此您的鍵盤、指標與焦點都仍屬於您。

### 選擇要如何將 Gemini 連接至 Cua Driver：

#### 在 Antigravity 中連接

將 Cua Driver 新增為本機 MCP 伺服器，讓 Antigravity 代理無須撰寫任何應用程式程式碼即可操作桌面應用程式。

[前往 Antigravity 設定 →](/learn/partner-cua-computer-use-gemini/#connect-cua-driver-in-antigravity)

#### 建立自訂 SDK 迴圈

使用 `google-genai` SDK 與 Cua Driver 的型別化工具，搭配 Interactions API，以約 100 行程式碼完成。

[前往自訂 SDK 迴圈 →](/learn/partner-cua-computer-use-gemini/#build-a-custom-loop-with-the-interactions-api)

## 您將建立的內容

一個能以一般語言接受任務的代理，例如「將這個 PDF 中的人員加入通訊錄」，並在背景於原生應用程式中完成任務。在它工作時，您可以繼續在另一個應用程式中打字。沒有任何視窗會跳到前方，您的按鍵也不會傳送到代理操作的應用程式。相同做法適用於任何具有無障礙樹狀結構的應用程式：macOS、Windows 與 Linux 上的原生應用程式、Electron 應用程式與瀏覽器。

## 設定 Cua Driver

### 匯出您的 Gemini API 金鑰

### 安裝 Cua Driver

### 授予 macOS 無障礙與螢幕權限

### 檢查權限狀態

## 在 Antigravity 中連接 Cua Driver

### 安裝 Antigravity CLI

### 將 Cua Driver 註冊為本機 MCP 伺服器

### 自動允許 Cua Driver 工具呼叫

### 啟動 Antigravity 並指派背景任務

## 使用 Interactions API 建立自訂迴圈

### 安裝 Gemini 與 Cua Driver SDK

### 儲存下方的桌面代理指令碼

- **工具宣告：**`list_tools_json()` 會回傳每個 Cua Driver 工具及其 JSON Schema，Gemini 可直接將其作為函式宣告使用，無須修改。
- **工具呼叫：**`call_tool(name, arguments_json)` 會執行一個工具，並回傳文字摘要、結構化詳細資料（視窗 ID 與元素 token）以及螢幕截圖。
- **結果：**每個結果都會以 `function_result` 的形式回傳給 Gemini，包含文字、結構化 JSON 與圖片部分，讓模型在下一次呼叫時擁有最新的元素 token。

### 在桌面任務上執行指令碼

```
"""Save as `gemini_cua_agent.py`.

A minimal Gemini agent that operates desktop apps in the background with Cua Driver.

Gemini plans through the Interactions API; Cua Driver's typed Python SDK runs
each tool call in this process. The user can keep working while it runs.

    pip install google-genai cua-driver
    export GEMINI_API_KEY=...            # from https://aistudio.google.com/apikey
    python gemini_cua_agent.py "Add each person in signups.pdf (open in Preview) to Contacts"
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import time

from cua_driver import CuaDriver
from google import genai

MODEL = os.environ.get("GEMINI_MODEL", "gemini-4-argon")

# A focused subset of Cua Driver's tools. Fewer tools means shorter prompts
# and fewer wrong turns. This example expects its apps to be open already; add
# "launch_app" if the agent should open apps itself. Batch tools are added
# automatically when the installed Cua Driver offers them.
TOOLS = [
    "list_apps",
    "list_windows",
    "get_window_state",
    "click",
    "type_text",
    "set_value",
    "press_key",
    "hotkey",
    "scroll",
    "invoke_menu",
    "verify_state",
]
OPTIONAL_TOOLS = ["run_steps", "run_script"]

SYSTEM_INSTRUCTION = """\
You operate macOS apps through Cua Driver tools while the user keeps working
on the same computer.

- Stay in the background. Don't bring windows to the front, and keep the
  default background delivery for every action.
- Find the apps you need with list_apps and list_windows.
- Before acting on a window, call get_window_state(pid, window_id) and use the
  element_token values from that snapshot. Take a fresh snapshot after any
  change; old tokens go stale.
- Prefer accessibility actions (element_token, set_value, invoke_menu) over
  pixel coordinates.
- Check the result of each change in a fresh snapshot before moving on.
- When the task is done, reply with a short summary and call no more tools.
"""

TIMEOUT_S = 20 * 60  # Thinking plus long outputs can take minutes per call.


def to_function(tool: dict) -> dict:
    """Map one Cua Driver tool to a Gemini function declaration."""
    return {
        "type": "function",
        "name": tool["name"],
        "description": tool["description"],
        "parameters": tool["inputSchema"],
    }


def to_result(call, result) -> dict:
    """Map a Cua Driver ToolResult to a Gemini function_result input."""
    content = [{"type": "text", "text": result.text or "ok"}]
    if result.structured_json:  # IDs, element tokens and other details
        content.append({"type": "text", "text": result.structured_json})
    content += [
        {"type": "image", "mime_type": image.mime_type, "data": image.data_base64}
        for image in result.images
    ]
    return {
        "type": "function_result",
        "name": call.name,
        "call_id": call.id,
        "result": content,
        "is_error": result.is_error,
    }


async def run(task: str, max_turns: int, thinking_level: str) -> str:
    client = genai.Client()
    driver = CuaDriver.create()
    try:
        catalog = json.loads(await driver.list_tools_json())["tools"]
        wanted = set(TOOLS + OPTIONAL_TOOLS)
        tools = [to_function(t) for t in catalog if t["name"] in wanted]

        request = dict(
            model=MODEL,
            tools=tools,
            system_instruction=SYSTEM_INSTRUCTION,
            generation_config={"thinking_level": thinking_level},
            timeout=TIMEOUT_S,
        )
        interaction = await client.aio.interactions.create(input=task, **request)

        for turn in range(1, max_turns + 1):
            calls = [s for s in interaction.steps or [] if s.type == "function_call"]
            if not calls:
                return interaction.output_text or ""

            results = []
            for call in calls:
                started = time.monotonic()
                result = await driver.call_tool(call.name, json.dumps(call.arguments))
                status = "error" if result.is_error else "ok"
                args = json.dumps(call.arguments)[:100]
                print(f"[{turn}] {call.name} {args} -> {status} ({time.monotonic() - started:.1f}s)")
                results.append(to_result(call, result))

            interaction = await client.aio.interactions.create(
                input=results, previous_interaction_id=interaction.id, **request
            )
        return f"Stopped after {max_turns} turns."
    finally:
        await driver.shutdown()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("task")
    parser.add_argument("--max-turns", type=int, default=100)
    parser.add_argument(
        "--thinking-level",
        default="low",
        choices=["minimal", "low", "medium", "high"],
    )
    args = parser.parse_args()
    print(asyncio.run(run(args.task, args.max_turns, args.thinking_level)))


if __name__ == "__main__":
    main()
```

## 範例：在您打字的同時將報名者加入通訊錄

### 開啟「預覽程式」與「通訊錄」

### 啟動背景通訊錄任務

### 繼續在「文字編輯」中打字並查看摘要

## Gemini 桌面代理的使用訣竅

**給每次呼叫留出空間。**開啟思考功能時，單次 Gemini 呼叫可能需要一段時間，較長的計畫或較大的輸出可能需要數分鐘。請將請求逾時設為至少 20 分鐘（Python 中為 `timeout=20 * 60`），並為整個任務設定專屬的實際時間預算，而非較短的單次呼叫限制。**依步驟調整思考強度。**大多數 UI 步驟都屬於例行操作，因此 `thinking_level: "low"` 能讓迴圈保持靈敏。當任務需要真正的規劃時（例如比對兩份文件），再提高至 `"high"`。**保持觀察結果精簡。**`get_window_state` 會回傳視窗的無障礙樹狀結構（包含結構化元素與精簡的 Markdown 樹狀結構）以及一張螢幕截圖。當代理只需要新的元素 token 時，請傳入 `include_screenshot: false` 以略過圖片。**優先使用無障礙操作。**`set_value`、`invoke_menu` 以及透過 `element_token` 進行的點擊，都能在背景視窗上運作，且不依賴像素座標。**批次執行步驟以減少往返次數。**自 0.35 版起，`run_steps` 與 `run_script` 預設為啟用，可在一次工具呼叫中執行多個動作。**只傳送新的內容。**使用 `previous_interaction_id` 時，Gemini 會在伺服器端保留對話狀態，因此每個回合只需傳送新的函式結果。**提供聚焦的工具組合。**Cua Driver 擁有 50 多種工具（請參閱 [MCP 工具參考文件](https://cua.ai/docs/reference/cua-driver/mcp-tools)）。提供約十幾種桌面工具可讓提示詞保持簡短、選擇保持明確；當任務在網頁中進行時，再加入 `browser_*` 工具。**讓高風險操作保持有人監督。**請在獨立的作業系統使用者帳號或虛擬機器中執行無人值守的代理，並將購買、訊息、刪除與憑證排除在無人值守的任務之外。

## 後續步驟：Windows、Linux 與共用電腦

Cua Driver 同樣可在 Windows 10 與 11，以及 x86_64 Linux 桌面（X11 或搭配 AT-SPI 2 的 XWayland）上執行，使用相同的 MCP 伺服器與 SDK；平台詳細資訊請參閱 [Cua Driver 快速入門](https://cua.ai/docs/cua-driver/quickstart)。使用自訂 SDK 指令碼時，請將 `SYSTEM_INSTRUCTION` 中的 "macOS apps" 更新為符合您平台的內容。對於團隊工作流程，[Cua Spaces](https://cua.ai/spaces) 提供團隊成員與代理可共同觀察的共用虛擬電腦。在 Windows（PowerShell）上，請使用下列指令安裝並啟動 Cua Driver：`irm https://cua.ai/driver/install.ps1 | iex cua-driver autostart kick` 在 Linux（Bash）上，請使用下列指令安裝並啟動本機伺服器：

```
/bin/bash -c "$(curl -fsSL https://cua.ai/driver/install.sh)"
cua-driver serve
```
