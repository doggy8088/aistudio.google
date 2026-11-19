# 如何透過 Gemini API 使用 Deep Research

Gemini Deep Research 代理能自主規劃、搜尋並綜整長程研究任務，產出附引用來源的詳細報告。

![Philipp Schmid](https://www.gstatic.com/aistudio-static/editorial/authors/6Rob36HABNTobLBfUOv5.webp)

- `deep-research-preview-04-2026`：為速度與效率設計，適合串流回傳至用戶端 UI
- `deep-research-max-preview-04-2026`：最大程度的全面性，適合自動化的上下文蒐集與綜整

## 設定

安裝 Python SDK：

```
pip install google-genai
```

```
export GEMINI_API_KEY="your-api-key"
```

## 執行你的第一個 Deep Research 任務

以 background=True 啟動研究任務，並輪詢取得結果。Deep Research 採非同步運作，因為任務可能需要數分鐘才能完成。

```
import time
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    input="Research the history of Google TPUs.",
    agent="deep-research-preview-04-2026",
    background=True,
)

while True:
    interaction = client.interactions.get(interaction.id)
    if interaction.status == "completed":
        print(interaction.outputs[-1].text)
        break
    elif interaction.status == "failed":
        print(f"Research failed: {interaction.error}")
        break
    time.sleep(10)
```

### 協作規劃

### 步驟 1：請求一份計畫

```
import time
from google import genai

client = genai.Client()

plan = client.interactions.create(
    agent="deep-research-preview-04-2026",
    input="Research Google TPUs vs competitor hardware.",
    agent_config={"type": "deep-research", "collaborative_planning": True},
    background=True,
)

while (result := client.interactions.get(id=plan.id)).status != "completed":
    time.sleep(5)

print(result.outputs[-1].text)
```

### 微調計畫

```
refined = client.interactions.create(
    agent="deep-research-preview-04-2026",
    input="Add a section comparing power efficiency.",
    agent_config={"type": "deep-research", "collaborative_planning": True},
    previous_interaction_id=plan.id,
    background=True,
)

while (result := client.interactions.get(id=refined.id)).status != "completed":
    time.sleep(5)

print(result.outputs[-1].text)
```

### 核准並執行

```
report = client.interactions.create(
    agent="deep-research-preview-04-2026",
    input="Plan looks good!",
    agent_config={"type": "deep-research", "collaborative_planning": False},
    previous_interaction_id=refined.id,
    background=True,
)

while (result := client.interactions.get(id=report.id)).status != "completed":
    time.sleep(5)

print(result.outputs[-1].text)
```

## 原生圖表與資訊圖表

將 visualization="auto"，並在提示詞中要求視覺內容。代理會生成圖表與資訊圖表，以 base64 編碼的圖片回傳。

```
import base64
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    agent="deep-research-preview-04-2026",
    input="Analyze global semiconductor market trends. Include charts showing market share changes.",
    agent_config={"type": "deep-research", "visualization": "auto"},
    background=True,
)

while (result := client.interactions.get(id=interaction.id)).status != "completed":
    time.sleep(5)

for output in result.outputs:
    if output.type == "text":
        print(output.text)
    elif output.type == "image" and output.data:
        image_bytes = base64.b64decode(output.data)
        # display(Image(data=image_bytes))  # Jupyter
```

## 遠端 MCP 伺服器

連接遠端 MCP 伺服器，讓代理能存取外部工具。傳入伺服器名稱、url，以及選擇性的驗證標頭。

```
interaction = client.interactions.create(
    agent="deep-research-preview-04-2026",
    input="Research how recent geopolitical events influenced USD interest rates",
    tools=[
        {
            "type": "mcp_server",
            "name": "Finance Data Provider",
            "url": "https://finance.example.com/mcp",
            "headers": {"Authorization": "Bearer my-token"},
        }
    ],
    background=True,
)
```

---

## 工具設定

代理預設使用 Google Search、URL Context 與 Code Execution。你可以提供工具清單，自訂代理可使用的工具，方式與模型類似。舉例來說，你可以只搜尋網路（透過 google_search 與 url_context）、只搜尋私人來源（透過 file_search 與自訂 MCP 伺服器），或混用兩者。

| Tool | Type | Default | Description |
| --- | --- | --- | --- |
| Google Search | google_search | ✅ | 搜尋公開網路 |
| URL Context | url_context | ✅ | 讀取並摘要網頁 |
| Code Execution | code_execution | ✅ | 執行程式碼進行**計算**與資料分析。 |
| MCP Server | mcp_server | - | 連接遠端 MCP 伺服器。詳情請參閱[文件](/docs/deep-research/)。 |
| File Search | file_search | - | 搜尋已上傳的文件語料庫 |

```
# Only web search allowed
interaction = client.interactions.create(
    agent="deep-research-preview-04-2026",
    input="Latest developments in quantum computing.",
    tools=[{"type": "google_search"}],
    background=True,
)
```

## 多模態研究接地

在文字提示詞之外一併傳入圖片、PDF 與文件，為研究提供接地依據。

```
interaction = client.interactions.create(
    agent="deep-research-preview-04-2026",
    input=[
        {"type": "text", "text": "What has been the impact of this research paper?"},
        {"type": "document", "uri": "https://arxiv.org/pdf/1706.03762", "mime_type": "application/pdf"},
    ],
    background=True,
)
```

## 含視覺內容與思考摘要的即時串流

即時串流研究進度。啟用 thinking_summaries="auto"，即可在文字與生成的圖片之外，一併接收代理的中間推理過程。

```
import base64
from google import genai
from IPython.display import Image, display

client = genai.Client()

interaction_id = None
last_event_id = None
is_complete = False

def process_stream(stream):
    global interaction_id, last_event_id, is_complete
    for chunk in stream:
        if chunk.event_type == "interaction.start":
            interaction_id = chunk.interaction.id
        if chunk.event_id:
            last_event_id = chunk.event_id
        if chunk.event_type == "content.delta":
            if chunk.delta.type == "text":
                print(chunk.delta.text, end="", flush=True)
            elif chunk.delta.type == "thought_summary":
                print(f"
💭 {chunk.delta.content.text}", flush=True)
            elif chunk.delta.type == "image" and chunk.delta.data:
                image_bytes = base64.b64decode(chunk.delta.data)
                display(Image(data=image_bytes))
        elif chunk.event_type in ("interaction.complete", "error"):
            is_complete = True
            if chunk.event_type == "interaction.complete":
                print("
✅ Research Complete")

stream = client.interactions.create(
    input="Research AI chip market trends. Include charts comparing vendors.",
    agent="deep-research-preview-04-2026",
    background=True,
    stream=True,
    agent_config={
        "type": "deep-research",
        "thinking_summaries": "auto",
        "visualization": "auto",
    },
)
process_stream(stream)

# Reconnect if the connection drops
while not is_complete and interaction_id:
    status = client.interactions.get(interaction_id)
    if status.status != "in_progress":
        break
    stream = client.interactions.get(
        id=interaction_id, stream=True, last_event_id=last_event_id,
    )
    process_stream(stream)
```
