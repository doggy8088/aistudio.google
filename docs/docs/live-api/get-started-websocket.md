# 使用 WebSockets 開始使用 Gemini Live API

Gemini Live API 支援與 Gemini 模型進行即時、雙向互動，支援音訊、影片和文字輸入，以及原生音訊輸出。本指南說明如何使用原始 WebSockets 直接與 API 整合。

[在 Google AI Studio 中試用 Live API](https://aistudio.google.com/live)

[從 GitHub 複製範例應用程式](https://github.com/google-gemini/gemini-live-api-examples/tree/main/gemini-live-ephemeral-tokens-websocket)

[使用程式設計代理技能](/docs/coding-agents/)

## 總覽 {#overview}

Gemini Live API 使用 WebSockets 進行即時通訊。與使用 SDK 不同，這種方式需要直接管理 WebSocket 連線，並以 API 定義的特定 JSON 格式傳送／接收訊息。

核心概念：

* **WebSocket 端點**：要連線的特定 URL。
* **訊息格式**：所有通訊都透過符合 [`BidiGenerateContentClientMessage`](/api-reference/live/bidi-generate-content/#client-messages) 和 [`BidiGenerateContentServerMessage`](/api-reference/live/#BidiGenerateContentServerMessage) 結構的 JSON 訊息進行。
* **工作階段管理**：你需要自行負責維護 WebSocket 連線。

## 驗證 {#authentication}

驗證方式是將你的 API 金鑰以查詢參數的形式包含在 WebSocket URL 中。

端點格式如下：

```none
wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=YOUR_API_KEY
```

將 `YOUR_API_KEY` 替換為你實際的 API 金鑰。

## 使用短期 token 進行驗證 {#authentication-with-ephemeral-tokens}

若你使用[短期 token](/docs/live-api/ephemeral-tokens/)，則需要連線至 `v1beta` 端點。短期 token 需要以 `access_token` 查詢參數的形式傳入。

短期金鑰的端點格式如下：

```none
wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token={short-lived-token}
```

將 `{short-lived-token}` 替換為實際的短期 token。

## 連線至 Live API {#connecting-to-the-live-api}

若要啟動即時工作階段，請建立與已驗證端點的 WebSocket 連線。透過 WebSocket 傳送的第一則訊息，必須是 [`BidiGenerateContentSetup`](/api-reference/live/#BidiGenerateContentSetup)，其中包含 `config`。如需完整的設定選項，請參閱 [Live API - WebSockets API 參考文件](/api-reference/live/)。


=== "Python"

      ```python
      import asyncio
      import websockets
      import json

      API_KEY = "YOUR_API_KEY"
      MODEL_NAME = "gemini-3.8-live"
      WS_URL = f"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key={API_KEY}"

      async def connect_and_configure():
          async with websockets.connect(WS_URL) as websocket:
              print("WebSocket Connected")

              # 1. Send the initial configuration
              setup_message = {
                  "setup": {
                      "model": f"models/{MODEL_NAME}",
                      "responseModalities": ["AUDIO"],
                      "systemInstruction": {
                          "parts": [{"text": "You are a helpful assistant."}]
                      }
                  }
              }
              await websocket.send(json.dumps(setup_message))
              print("Configuration sent")

              # Keep the session alive for further interactions
              await asyncio.sleep(3600) # Example: keep open for an hour

      async def main():
          await connect_and_configure()

      if __name__ == "__main__":
          asyncio.run(main())
      ```

=== "JavaScript"

      ```javascript
      const API_KEY = "YOUR_API_KEY";
      const MODEL_NAME = "gemini-3.8-live";
      const WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${API_KEY}`;

      const websocket = new WebSocket(WS_URL);

      websocket.onopen = () => {
        console.log('WebSocket Connected');

        // 1. Send the initial configuration
        const setupMessage = {
          setup: {
            model: `models/${MODEL_NAME}`,
            responseModalities: ['AUDIO'],
            systemInstruction: {
              parts: [{ text: 'You are a helpful assistant.' }]
            }
          }
        };
        websocket.send(JSON.stringify(setupMessage));
        console.log('Configuration sent');
      };

      websocket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log('Received:', response);
        // Handle different types of responses here
      };

      websocket.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      websocket.onclose = () => {
        console.log('WebSocket Closed');
      };
      ```


## 傳送文字 {#sending-text}

若要傳送文字輸入，請建構 [`BidiGenerateContentRealtimeInput`](/api-reference/live/#BidiGenerateContentRealtimeInput) 訊息，並在其中設定 `text` 欄位。


=== "Python"

      ```python
      # Inside the websocket context
      async def send_text(websocket, text):
          text_message = {
              "realtimeInput": {
                  "text": text
              }
          }
          await websocket.send(json.dumps(text_message))
          print(f"Sent text: {text}")

      # Example usage: await send_text(websocket, "Hello, how are you?")
      ```

=== "JavaScript"

      ```javascript
      function sendTextMessage(text) {
        if (websocket.readyState === WebSocket.OPEN) {
          const textMessage = {
            realtimeInput: {
              text: text
            }
          };
          websocket.send(JSON.stringify(textMessage));
          console.log('Text message sent:', text);
        } else {
          console.warn('WebSocket not open.');
        }
      }

      // Example usage:
      sendTextMessage("Hello, how are you?");
      ```


## 傳送音訊 {#sending-audio}

音訊必須以原始 PCM 資料傳送（原始 16 位元 PCM 音訊、16kHz、小端序）。請建構一則包含音訊資料的 [`BidiGenerateContentRealtimeInput`](/api-reference/live/#BidiGenerateContentRealtimeInput) 訊息。`mimeType` 至關重要。


=== "Python"

      ```python
      # Inside the websocket context
      async def send_audio_chunk(websocket, chunk_bytes):
          import base64
          encoded_data = base64.b64encode(chunk_bytes).decode('utf-8')
          audio_message = {
              "realtimeInput": {
                  "audio": {
                      "data": encoded_data,
                      "mimeType": "audio/pcm;rate=16000"
                  }
              }
          }
          await websocket.send(json.dumps(audio_message))
          # print("Sent audio chunk") # Avoid excessive logging

      # Assuming 'chunk' is your raw PCM audio bytes
      # await send_audio_chunk(websocket, chunk)
      ```

=== "JavaScript"

      ```javascript
      // Assuming 'chunk' is a Buffer of raw PCM audio
      function sendAudioChunk(chunk) {
        if (websocket.readyState === WebSocket.OPEN) {
          const audioMessage = {
            realtimeInput: {
              audio: {
                data: chunk.toString('base64'),
                mimeType: 'audio/pcm;rate=16000'
              }
            }
          };
          websocket.send(JSON.stringify(audioMessage));
          // console.log('Sent audio chunk');
        }
      }
      // Example usage: sendAudioChunk(audioBuffer);
      ```


如需了解如何從用戶端裝置（例如瀏覽器）取得音訊，請參閱 [GitHub](https://github.com/google-gemini/gemini-live-api-examples/blob/main/gemini-live-ephemeral-tokens-websocket/frontend/mediaUtils.js#L38-L74) 上的端到端範例。

## 傳送影片 {#sending-video}

影片影格會以個別圖片（例如 JPEG 或 PNG）的形式傳送。與音訊類似，請使用 `realtimeInput` 搭配 `Blob`，並指定正確的 `mimeType`。


=== "Python"

      ```python
      # Inside the websocket context
      async def send_video_frame(websocket, frame_bytes, mime_type="image/jpeg"):
          import base64
          encoded_data = base64.b64encode(frame_bytes).decode('utf-8')
          video_message = {
              "realtimeInput": {
                  "video": {
                      "data": encoded_data,
                      "mimeType": mime_type
                  }
              }
          }
          await websocket.send(json.dumps(video_message))
          # print("Sent video frame")

      # Assuming 'frame' is your JPEG-encoded image bytes
      # await send_video_frame(websocket, frame)
      ```

=== "JavaScript"

      ```javascript
      // Assuming 'frame' is a Buffer of JPEG-encoded image data
      function sendVideoFrame(frame, mimeType = 'image/jpeg') {
        if (websocket.readyState === WebSocket.OPEN) {
          const videoMessage = {
            realtimeInput: {
              video: {
                data: frame.toString('base64'),
                mimeType: mimeType
              }
            }
          };
          websocket.send(JSON.stringify(videoMessage));
          // console.log('Sent video frame');
        }
      }
      // Example usage: sendVideoFrame(jpegBuffer);
      ```


如需了解如何從用戶端裝置（例如瀏覽器）取得影片，請參閱 [GitHub](https://github.com/google-gemini/gemini-live-api-examples/blob/main/gemini-live-ephemeral-tokens-websocket/frontend/mediaUtils.js#L185-L222) 上的端到端範例。

## 接收回應 {#receiving-responses}

WebSocket 會傳回 [`BidiGenerateContentServerMessage`](/api-reference/live/#BidiGenerateContentServerMessage) 訊息。你需要剖析這些 JSON 訊息，並處理不同類型的內容。


=== "Python"

      ```python
      # Inside the websocket context, in a receive loop
      async def receive_loop(websocket):
          async for message in websocket:
              response = json.loads(message)
              print("Received:", response)

              if "serverContent" in response:
                  server_content = response["serverContent"]
                  # Receiving Audio
                  if "modelTurn" in server_content and "parts" in server_content["modelTurn"]:
                      for part in server_content["modelTurn"]["parts"]:
                          if "inlineData" in part:
                              audio_data_b64 = part["inlineData"]["data"]
                              # Process or play the base64 encoded audio data
                              # audio_data = base64.b64decode(audio_data_b64)
                              print(f"Received audio data (base64 len: {len(audio_data_b64)})")

                  # Receiving Text Transcriptions
                  if "inputTranscription" in server_content:
                      print(f"User: {server_content['inputTranscription']['text']}")
                  if "outputTranscription" in server_content:
                      print(f"Gemini: {server_content['outputTranscription']['text']}")

              # Handling Tool Calls
              if "toolCall" in response:
                  await handle_tool_call(websocket, response["toolCall"])

      # Example usage: await receive_loop(websocket)
      ```

=== "JavaScript"

      ```javascript
      websocket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log('Received:', response);

        if (response.serverContent) {
          const serverContent = response.serverContent;
          // Receiving Audio
          if (serverContent.modelTurn?.parts) {
            for (const part of serverContent.modelTurn.parts) {
              if (part.inlineData) {
                const audioData = part.inlineData.data; // Base64 encoded string
                // Process or play audioData
                console.log(`Received audio data (base64 len: ${audioData.length})`);
              }
            }
          }

          // Receiving Text Transcriptions
          if (serverContent.inputTranscription) {
            console.log('User:', serverContent.inputTranscription.text);
          }
          if (serverContent.outputTranscription) {
            console.log('Gemini:', serverContent.outputTranscription.text);
          }
        }

        // Handling Tool Calls
        if (response.toolCall) {
          handleToolCall(response.toolCall);
        }
      };
      ```


如需了解如何處理回應，請參閱 [GitHub](https://github.com/google-gemini/gemini-live-api-examples/blob/main/gemini-live-ephemeral-tokens-websocket/frontend/geminilive.js#L22-L75) 上的端到端範例。

## 處理工具呼叫 {#handling-tool-calls}

當模型要求進行工具呼叫時，[`BidiGenerateContentServerMessage`](/api-reference/live/#BidiGenerateContentServerMessage) 會包含 `toolCall` 欄位。你必須在本機執行該函式，並使用 [`BidiGenerateContentToolResponse`](/api-reference/live/#BidiGenerateContentToolResponse) 訊息將結果傳回 WebSocket。


=== "Python"

      ```python
      # Placeholder for your tool function
      def my_tool_function(args):
          print(f"Executing tool with args: {args}")
          # Implement your tool logic here
          return {"status": "success", "data": "some result"}

      async def handle_tool_call(websocket, tool_call):
          function_responses = []
          for fc in tool_call["functionCalls"]:
              # 1. Execute the function locally
              try:
                  result = my_tool_function(fc.get("args", {}))
                  response_data = {"result": result}
              except Exception as e:
                  print(f"Error executing tool {fc['name']}: {e}")
                  response_data = {"error": str(e)}

              # 2. Prepare the response
              function_responses.append({
                  "name": fc["name"],
                  "id": fc["id"],
                  "response": response_data
              })

          # 3. Send the tool response back to the session
          tool_response_message = {
              "toolResponse": {
                  "functionResponses": function_responses
              }
          }
          await websocket.send(json.dumps(tool_response_message))
          print("Sent tool response")

      # This function is called within the receive_loop when a toolCall is detected.
      ```

=== "JavaScript"

      ```javascript
      // Placeholder for your tool function
      function myToolFunction(args) {
        console.log(`Executing tool with args:`, args);
        // Implement your tool logic here
        return { status: 'success', data: 'some result' };
      }

      function handleToolCall(toolCall) {
        const functionResponses = [];
        for (const fc of toolCall.functionCalls) {
          // 1. Execute the function locally
          let result;
          try {
            result = myToolFunction(fc.args || {});
          } catch (e) {
            console.error(`Error executing tool ${fc.name}:`, e);
            result = { error: e.message };
          }

          // 2. Prepare the response
          functionResponses.push({
            name: fc.name,
            id: fc.id,
            response: { result }
          });
        }

        // 3. Send the tool response back to the session
        if (websocket.readyState === WebSocket.OPEN) {
          const toolResponseMessage = {
            toolResponse: {
              functionResponses: functionResponses
            }
          };
          websocket.send(JSON.stringify(toolResponseMessage));
          console.log('Sent tool response');
        } else {
          console.warn('WebSocket not open to send tool response.');
        }
      }
      // This function is called within websocket.onmessage when a toolCall is detected.
      ```


## 後續步驟 {#whats-next}

* 閱讀完整的 Live API [功能](/docs/live-api/capabilities/)指南，了解主要功能與設定；包括語音活動偵測和原生音訊功能。
* 閱讀[工具使用](/docs/live-api/tools/)指南，了解如何將 Live API 與工具和函式呼叫整合。
* 閱讀[工作階段管理](/docs/live-api/session-management/)指南，了解如何管理長時間執行的對話。
* 閱讀[短期 token](/docs/live-api/ephemeral-tokens/)指南，了解如何在[用戶端到伺服器](/docs/live-api/#implementation-approach)應用程式中進行安全驗證。
* 如需了解底層 WebSockets API 的更多資訊，請參閱 [WebSockets API 參考文件](/api-reference/live/)。
