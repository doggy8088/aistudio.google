# 啟動 Live 工作階段


!!! note " "

      **Preview:** Live API 目前為預覽版。


`WSS` `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent`

WebSocket 連線會在用戶端與 Gemini 伺服器之間建立一個工作階段。用戶端建立新連線後，工作階段即可與伺服器交換訊息，以：

* 將文字、音訊或影片傳送到 Gemini 伺服器。
* 從 Gemini 伺服器接收音訊、文字或函式呼叫要求。


!!! note " "

      此 URL 對應的版本為 `v1beta`。


## 工作階段設定 {#session-configuration}

建立 WebSocket 連線後傳送的第一則訊息用來設定工作階段，內容包括模型、生成參數、系統指令與工具。

連線開啟期間無法更新設定。不過，透過[工作階段恢復機制](/api-reference/live/#SessionResumptionConfig)暫停並恢復工作階段時，可以變更除模型以外的設定參數。

以下為設定範例。請注意，不同 SDK 的名稱大小寫可能有所差異。Python SDK 的設定選項可參閱[此處](https://github.com/googleapis/python-genai/blob/main/google/genai/types.py)。

```json
{
  "model": string,
  "generationConfig": {
    "candidateCount": integer,
    "maxOutputTokens": integer,
    "temperature": number,
    "topP": number,
    "topK": integer,
    "presencePenalty": number,
    "frequencyPenalty": number,
    "responseModalities": [string],
    "speechConfig": object,
    "mediaResolution": object,
    "translationConfig": object
  },
  "systemInstruction": string,
  "tools": [object]
}
```

API 欄位的詳細資訊請參閱 [generationConfig](/api-reference/generate-content/)。

## 傳送訊息 {#send-messages}

若要透過 WebSocket 連線交換訊息，用戶端必須在已開啟的 WebSocket 連線上傳送 JSON 物件。該 JSON 物件必須包含以下物件集合中**恰好一個**欄位：

```json
{
  "setup": BidiGenerateContentSetup,
  "clientContent": BidiGenerateContentClientContent,
  "realtimeInput": BidiGenerateContentRealtimeInput,
  "toolResponse": BidiGenerateContentToolResponse
}
```

### 支援的用戶端訊息 {#client-messages}

支援的用戶端訊息如下表所示：

| Message | Description |
| --- | --- |
| [`BidiGenerateContentSetup`](/api-reference/live/#BidiGenerateContentSetup) | 要在第一則訊息中傳送的工作階段設定 |
| [`BidiGenerateContentClientContent`](/api-reference/live/#BidiGenerateContentClientContent) | 用戶端傳遞的目前對話增量內容更新 |
| [`BidiGenerateContentRealtimeInput`](/api-reference/live/#BidiGenerateContentRealtimeInput) | 即時音訊、影片或文字輸入 |
| [`BidiGenerateContentToolResponse`](/api-reference/live/#BidiGenerateContentToolResponse) | 回應從伺服器收到的 `ToolCallMessage` |

## 接收訊息 {#receive-messages}

若要接收 Gemini 的訊息，請監聽 WebSocket 的 'message' 事件，再依照支援的伺服器訊息定義解析結果。

範例如下：

```python
async with client.aio.live.connect(model='...', config=config) as session:
    await session.send(input='Hello world!', end_of_turn=True)
    async for message in session.receive():
        print(message)
```

伺服器訊息可能包含 [`usageMetadata`](/api-reference/live/#UsageMetadata) 欄位，除此之外則包含 [`BidiGenerateContentServerMessage`](/api-reference/live/#BidiGenerateContentServerMessage) 訊息中其他欄位的**恰好一個**。（`messageType` 聯集在 JSON 中不以欄位形式呈現，因此該欄位會出現在訊息的最上層。）
