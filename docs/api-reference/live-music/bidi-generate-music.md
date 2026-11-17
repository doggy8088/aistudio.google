# 啟動 Live Music 工作階段


!!! note " "

      **Preview:** Live Music API 目前為預覽版。


`WSS` `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateMusic`

WebSocket 連線會建立一個工作階段，讓用戶端與模型進行即時通訊。用戶端建立新連線後，工作階段即可與伺服器交換訊息，以：

*   傳送提示詞與控制訊號，引導音樂生成。
*   傳送音樂播放控制訊號。
*   接收音訊區塊。


!!! note " "

      此 URL 對應的版本為 `v1beta`。


## 工作階段設定 {#session-configuration}

連線建立後傳送的第一則訊息，用來設定工作階段所使用的模型。

以下為設定範例。請注意，不同 SDK 的名稱大小寫可能有所差異。Python SDK 的設定選項可參閱
[此處](https://github.com/googleapis/python-genai/blob/main/google/genai/live_music.py)。

```json
{
  "model": string
}
```

## 傳送訊息 {#send-messages}

若要透過 WebSocket 連線交換訊息，用戶端必須在已開啟的 WebSocket 連線上傳送 JSON 物件。該 JSON 物件必須包含以下物件集合中**恰好一個**欄位：

```json
{
  "setup": BidiGenerateMusicSetup,
  "client_content": BidiGenerateMusicClientContent,
  "music_generation_config": BidiGenerateMusicGenerationConfig,
  "playback_control": BidiGenerateMusicPlaybackControl
}
```

### 支援的用戶端訊息 {#client-messages}

支援的用戶端訊息如下表所示：

| Message | Description |
| --- | --- |
| [`BidiGenerateMusicSetup`](/api-reference/live-music/#BidiGenerateMusicSetup) | 僅在第一則訊息中傳送的工作階段設定 |
| [`BidiGenerateMusicClientContent`](/api-reference/live-music/#BidiGenerateMusicClientContent) | 作為模型輸入的加權提示詞 |
| [`BidiGenerateMusicGenerationConfig`](/api-reference/live-music/#BidiGenerateMusicGenerationConfig) | 音樂生成的設定 |
| [`BidiGenerateMusicPlaybackControl`](/api-reference/live-music/#BidiGenerateMusicPlaybackControl) | 模型生成的播放控制訊號 |

## 接收訊息 {#receive-messages}

若要接收伺服器的訊息，請監聽 WebSocket 的 'message' 事件，再依照支援的伺服器訊息定義解析結果。

範例如下：

```python
async def receive_audio(session):
  """Example background task to process incoming audio."""
  while True:
    async for message in session.receive():
      audio_data = message.server_content.audio_chunks[0].data
      # Process audio...
      await asyncio.sleep(10**-12)

async with (
  client.aio.live.music.connect(model='models/lyria-realtime-exp') as session,
  asyncio.TaskGroup() as tg,
):
  # Set up task to receive server messages.
  tg.create_task(receive_audio(session))

  # Send initial prompts and config
  await session.set_weighted_prompts(
    prompts=[
      types.WeightedPrompt(text='minimal techno', weight=1.0),
    ]
  )
  await session.set_music_generation_config(
    config=types.LiveMusicGenerationConfig(bpm=90, temperature=1.0)
  )

  # Start streaming music
  await session.play()
```

伺服器訊息包含 [`BidiGenerateMusicServerMessage`](/api-reference/live-music/#BidiGenerateMusicServerMessage) 訊息中其他欄位的**恰好一個**。（`messageType` 聯集在 JSON 中不以欄位形式呈現，因此該欄位會出現在訊息的最上層。）
