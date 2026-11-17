# 透過串流進行機器人控制


!!! note " "

      透過串流進行機器人控制需要 `gemini-robotics-er-2-streaming-preview`。
      ER 1.6 與標準的 `gemini-robotics-er-2-preview`
      模型端點皆不提供此功能。


`gemini-robotics-er-2-streaming-preview` 模型端點提供專用的
串流端點，可與 [Live API](/docs/live-api/get-started-sdk/) 整合，
讓您的應用程式與機器人之間能即時雙向互動。
這使其特別適合需要快速回饋迴圈，以及
對環境做出即時反應的代理。

[在 Google AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-robotics-er-2-streaming-preview)

[從 GitHub 複製範例應用程式](https://github.com/google-gemini/robotics-samples/tree/main/live-api)

## 使用案例 {#use-cases}

*   **多機器人協調**：多台機器人透過共用工作階段溝通任務狀態
    並委派子任務。
*   **持續監控**：機器人觀察場景，並在特定事件發生時觸發動作，
    例如容器達到裝滿程度時。
*   **倉儲與物流**：揀貨與包裝代理可目視驗證物品、
    追蹤包裝進度，並從錯誤中復原。

## 技術規格 {#technical-specifications}

下表列出 Live API 的技術規格：

| 類別 | 詳細資料 |
| :--- | :--- |
| 輸入模態 | 音訊 (raw 16-bit PCM audio, 16kHz, little-endian)、圖片 (JPEG <= 1FPS)、文字 |
| 輸出模態 | 文字 |
| 通訊協定 | 具狀態的 WebSocket 連線 (WSS) |

## 建構代理式設定 {#how-it-works}

每個建構於 Live API 之上的機器人代理都遵循三個步驟：

1.  **將機器人能力宣告為工具。** 機器人可執行的每個動作 —
    導航、抓取、說話 — 都會成為具有名稱、
    說明與參數結構定義的函式宣告。實體動作必須使用
    `"behavior": "BLOCKING"`，讓模型等待機器人完成後，
    再決定下一步。
2.  **將多模態輸入串流至持續性工作階段。** 開啟 `live.connect`
    工作階段，並在任務期間保持開啟。將來自機器人感測器的影片影格、音訊
    或文字，隨到隨傳送。
3.  **在接收迴圈中處理工具呼叫。** 每當模型選取
    一個動作時，就會傳送 `tool_call` 訊息。您的接收迴圈會
    透過機器人 SDK 執行該函式，並回傳 `tool_response`。工作階段
    保持開啟，模型再根據結果挑選下一個動作。


!!! note " "

      使用 Live API 進行機器人控制時，僅支援阻斷式函式呼叫。
      詳情請參閱 [Live API 工具指南](/docs/live-api/tools/)。


以下各節說明如何將這些步驟套用到三種常見模式：
基本代理迴圈、搭配心跳的主動場景監控，以及
透過 TTS 工具路由語音。

## 透過函式呼叫協調機器人 {#orchestrate-robot}

以下範例在單一 Python 指令碼中串連全部三個步驟。

步驟 1 — 工具定義 — 將機器人能力宣告為函式
宣告。`navigate` 函式使用 `"behavior": "BLOCKING"`，讓
模型等待機器人抵達航點後，再呼叫其他工具。
在同一個清單中加入更多函式宣告，即可公開更多機器人
能力。

步驟 2 — 輸入輔助函式 — 展示三個將不同模態
輸入串流至工作階段的函式：用於指令的 `send_text`、用於相機
影格並可附帶文字提示詞的 `send_image`，以及用於來自
麥克風原始 PCM 音訊的 `send_audio`。

步驟 3 — 接收迴圈 — 會同時執行並處理兩種訊息：
`server_content` 訊息（模型的文字輸出）與 `tool_call` 訊息
（模型要求執行機器人動作）。當工具呼叫到達時，迴圈會呼叫
`execute_tool` — 這是您需以實際機器人 SDK 取代的 stub — 然後回傳
`tool_response`，讓模型選取下一個動作。

```python
import asyncio
from google import genai
from google.genai import types

MODEL = "gemini-robotics-er-2-streaming-preview"

# ── Tool definitions ─────────────────────────────────────────────────────────
tools = [
   {
       "function_declarations": [
           {
               "name": "navigate",
               "description": "Navigate the robot to a named waypoint.",
               "behavior": "BLOCKING",
               "parameters": {
                   "type": "OBJECT",
                   "properties": {"name": {"type": "STRING"}},
                   "required": ["name"],
               },
           },
           # Add more function definitions here
       ]
   }
]

# ── Stub tool executor (replace with real robot SDK calls) ───────────────────
def execute_tool(name: str, args: dict) -> dict:
   print(f"  [Tool] {name}({args})")
   return {"status": "success"}

# ── Input helpers ────────────────────────────────────────────────────────────
def send_text(session, text: str):
   """Send a text turn."""
   return session.send_client_content(
       turns=types.Content(role="user", parts=[types.Part(text=text)]),
       turn_complete=True,
   )

def send_image(session, image_bytes: bytes, prompt: str = ""):
   """Send a JPEG image with an optional text prompt."""
   parts = [
       types.Part(
           inline_data=types.Blob(data=image_bytes, mime_type="image/jpeg")
       )
   ]
   if prompt:
       parts.append(types.Part(text=prompt))
   return session.send_client_content(
       turns=types.Content(role="user", parts=parts),
       turn_complete=True,
   )

def send_audio(session, audio_chunk: bytes):
   """Stream a chunk of raw PCM audio (16-bit, 16 kHz, mono)."""
   return session.send_realtime_input(
       media=types.Blob(data=audio_chunk, mime_type="audio/pcm;rate=16000")
   )

# ── Receive loop ─────────────────────────────────────────────────────────────
async def receive_loop(session):
   """Print model text and handle tool calls until the session ends."""
   async for message in session.receive():
       if message.server_content:
           sc = message.server_content
           if sc.model_turn and sc.model_turn.parts:
               for part in sc.model_turn.parts:
                   if part.text:
                       print(f"Model: {part.text}", end="", flush=True)
           if sc.turn_complete:
               print("\n[Turn Complete]")
       elif message.tool_call:
           responses = []
           for call in message.tool_call.function_calls:
               print(f"\n[Tool Call] {call.name}({call.args})")
               result = execute_tool(call.name, call.args)
               responses.append(
                   types.FunctionResponse(
                       name=call.name,
                       response=result,
                       id=call.id,
                   )
               )
           await session.send_tool_response(function_responses=responses)

# ── Main ─────────────────────────────────────────────────────────────────────
async def main():
   client = genai.Client(api_key=os.environ["GEMINI_API_KEY"], http_options={"api_version": "v1beta"})
   config = types.LiveConnectConfig(
       response_modalities=["TEXT"],
       tools=tools,
       system_instruction=types.Content(
           parts=[types.Part(text="You are a robot controller. Use tools to execute commands.")]
       ),
   )
   async with client.aio.live.connect(model=MODEL, config=config) as session:
       recv_task = asyncio.create_task(receive_loop(session))
       # Connect robot perception callbacks and user inputs to the helpers above.
       recv_task.cancel()

asyncio.run(main())
```

接收迴圈在每次工具回應後仍保持作用中。模型會建構
並修訂長時程計畫，您無須事先編碼完整的動作序列。

## 主動式時空推理 {#heartbeat}

Live API 會串流輸入影片，但僅有影片影格
並不會觸發新的推理回合。影片影格必須搭配
文字或音訊提示詞，才能觸發模型回應。詳情請參閱
[Live API 功能](/docs/live-api/capabilities/)。

若要啟用主動推理，請實作 **heartbeat**：定期傳送
最新相機影格，後接簡短的文字提示詞，迫使模型
檢視場景並做出明確決策。影片輸入的速率限制為
每秒一個影格。

### 實作心跳

心跳協程會在同一個工作階段中，以獨立的 `asyncio` 工作執行。
它會把握機會以 1 Hz 節奏執行（與影片輸入速率限制相符），
同時等待每個回合完成 (`er_turn_done`)，以避免中斷
進行中的推理：

```python
async def heartbeat(session, camera, er_turn_done: asyncio.Event):
    TARGET_INTERVAL_SEC = 1.0

    while True:
        start_time = asyncio.get_running_loop().time()

        frame = await camera.latest_jpeg()
        await session.send_realtime_input(
            video=types.Blob(data=frame, mime_type="image/jpeg")
        )
        await session.send_realtime_input(
            text=(
                "[HEARTBEAT] If no task is active, call 'ack' and wait for user"
                " input. If a task is active: observe the scene. If the current"
                " step is progressing correctly, call 'ack'. If the current step"
                " is complete, call 'run_instruction' with the next step. If the"
                " overall goal is achieved, call 'reset' and inform the user."
            )
        )

        # Wait for the model to finish responding before sending the next heartbeat
        await er_turn_done.wait()
        er_turn_done.clear()

        # Sleep only the remaining time to maintain ~1 Hz cadence
        elapsed = asyncio.get_running_loop().time() - start_time
        remaining = TARGET_INTERVAL_SEC - elapsed
        if remaining > 0:
            await asyncio.sleep(remaining)
```


!!! warning " "

      在模型產生內容時傳送新的提示詞，會構成中斷
      (barge-in)，進而取消進行中的推理與工具呼叫。若您在
      未等待前一個回合完成的情況下，以盲設定時器觸發心跳，
      可能會讓模型陷入取消迴圈，看起來毫無回應。
      詳情請參閱 [Live API 中斷指南](/docs/live-api/capabilities/#interruptions)。


### 更新接收迴圈

若要發出模型已完成回合的訊號，請更新您的 `receive_loop`，
使其設定 `er_turn_done`：

```python
# In receive_loop: signal when the model finishes its turn
if sc.turn_complete:
    er_turn_done.set()
```

## 透過外部 TTS 輸出音訊 {#audio-tts}

Gemini Robotics ER 2 會回傳文字。您的應用程式會透過注入的回呼，將完成的回應
路由至獨立的 TTS 供應商（例如
[Gemini TTS](/docs/speech-generation/))。
這讓語音延遲、聲音選擇與中斷行為都由您
掌控，也讓您無須變更代理邏輯即可更換 TTS 後端。

您也可以將 TTS 宣告為工具，讓模型將「說些什麼」視同
「移動手臂」。請將以下函式宣告加入第一節的 `tools` 清單：

```python
TOOLS = [
    {
        "name": "send_message",
        "description": (
            "Speak a message aloud via TTS, then deliver it to the"
            " specified target. Use target='user' to speak directly"
            " to the user, or a peer agent name (e.g., 'duo') to"
            " communicate with another robot."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "target": {
                    "type": "string",
                    "description": "Recipient: 'user' or a peer agent name.",
                },
                "message": {
                    "type": "string",
                    "description": "The message to speak and deliver.",
                },
            },
            "required": ["target", "message"],
        },
    },
]
```

將 TTS 包裝為函式宣告後，模型會透過
與其他機器人動作相同的工具呼叫路徑處理語音。您的應用程式會以
注入的回呼來完成該呼叫。

## GitHub 上的範例 {#full-examples}

如需完整可運作的範例，包括 Spot 機器人取零食展示與 Tinybot
雲台 hello world，請參閱
[Robotics Live API 範例](https://github.com/google-gemini/robotics-samples/tree/main/live-api)。

## 後續步驟 {#whats-next}

*   [影片理解](/docs/robotics-video-progress/) — 時刻搜尋與進度分類。
*   [任務協調](/docs/robotics-orchestration/) — 不使用串流的長時程任務。
*   [Live API 總覽](/docs/live-api/get-started-sdk/) — 完整的 Live API 文件。
