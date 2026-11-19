# 使用 Google GenAI SDK 開始使用 Gemini Live API

Gemini Live API 支援與 Gemini 模型進行即時、雙向互動，支援音訊、影片和文字輸入，以及原生音訊輸出。本指南說明如何使用 Google GenAI SDK 在你的伺服器上與 API 整合。

[在 Google AI Studio 中試用 Live API](https://aistudio.google.com/live)

[從 GitHub 複製範例應用程式](https://github.com/google-gemini/gemini-live-api-examples/tree/main/gemini-live-genai-python-sdk)

[使用程式設計代理技能](/docs/coding-agents/)

## 總覽 {#overview}

Gemini Live API 使用 WebSockets 進行即時通訊。`google-genai` SDK 提供高階的非同步介面，用於管理這些連線。

核心概念：

* **工作階段**：與模型的持續連線。
* **設定**：設定模態（音訊／文字）、語音和系統指令。
* **即時輸入**：將音訊和影片影格以 blob 形式傳送。

## 連線至 Live API {#connecting-to-the-live-api}

使用 API 金鑰啟動 Live API 工作階段：


=== "Python"

      ```python
      import asyncio
      from google import genai

      client = genai.Client(api_key="YOUR_API_KEY", http_options={"api_version": "v1beta"})

      model = "gemini-3.8-live"
      config = {"response_modalities": ["AUDIO"]}

      async def main():
          async with client.aio.live.connect(model=model, config=config) as session:
              print("Session started")
              # Send content...

      if __name__ == "__main__":
          asyncio.run(main())
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI, Modality } from '@google/genai';

      const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY", httpOptions: { apiVersion: "v1beta" } });
      const model = 'gemini-3.8-live';
      const config = { responseModalities: [Modality.AUDIO] };

      async function main() {

        const session = await ai.live.connect({
          model: model,
          callbacks: {
            onopen: function () {
              console.debug('Opened');
            },
            onmessage: function (message) {
              console.debug(message);
            },
            onerror: function (e) {
              console.debug('Error:', e.message);
            },
            onclose: function (e) {
              console.debug('Close:', e.reason);
            },
          },
          config: config,
        });

        console.debug("Session started");
        // Send content...

        session.close();
      }

      await main();
      ```


## 傳送文字 {#sending-text}

文字可以使用 `send_realtime_input`（Python）或 `sendRealtimeInput`（JavaScript）傳送。


=== "Python"

      ```python
      await session.send_realtime_input(text="Hello, how are you?")
      ```

=== "JavaScript"

      ```javascript
      session.sendRealtimeInput({
        text: 'Hello, how are you?'
      });
      ```


## 傳送音訊 {#sending-audio}

音訊必須以原始 PCM 資料傳送（原始 16 位元 PCM 音訊、16kHz、小端序）。


=== "Python"

      ```python
      # Assuming 'chunk' is your raw PCM audio bytes
      await session.send_realtime_input(
          audio=types.Blob(
              data=chunk,
              mime_type="audio/pcm;rate=16000"
          )
      )
      ```

=== "JavaScript"

      ```javascript
      // Assuming 'chunk' is a Buffer of raw PCM audio
      session.sendRealtimeInput({
        audio: {
          data: chunk.toString('base64'),
          mimeType: 'audio/pcm;rate=16000'
        }
      });
      ```


如需了解如何從用戶端裝置（例如瀏覽器）取得音訊，請參閱 [GitHub](https://github.com/google-gemini/gemini-live-api-examples/blob/main/gemini-live-genai-python-sdk/frontend/media-handler.js#L31-L70) 上的端到端範例。

## 傳送影片 {#sending-video}

影片影格會以個別圖片（例如 JPEG 或 PNG）的形式，以特定的影格速率傳送（最高每秒 1 個影格）。


=== "Python"

      ```python
      # Assuming 'frame' is your JPEG-encoded image bytes
      await session.send_realtime_input(
          video=types.Blob(
              data=frame,
              mime_type="image/jpeg"
          )
      )
      ```

=== "JavaScript"

      ```javascript
      // Assuming 'frame' is a Buffer of JPEG-encoded image data
      session.sendRealtimeInput({
        video: {
          data: frame.toString('base64'),
          mimeType: 'image/jpeg'
        }
      });
      ```


如需了解如何從用戶端裝置（例如瀏覽器）取得影片，請參閱 [GitHub](https://github.com/google-gemini/gemini-live-api-examples/blob/main/gemini-live-genai-python-sdk/frontend/media-handler.js#L84-L120) 上的端到端範例。

## 接收音訊 {#receiving-audio}

模型的音訊回應會以資料區塊的形式接收。


=== "Python"

      ```python
      async for response in session.receive():
          if response.server_content and response.server_content.model_turn:
              for part in response.server_content.model_turn.parts:
                  if part.inline_data:
                      audio_data = part.inline_data.data
                      # Process or play the audio data
      ```

=== "JavaScript"

      ```javascript
      // Inside the onmessage callback
      const content = response.serverContent;
      if (content?.modelTurn?.parts) {
        for (const part of content.modelTurn.parts) {
          if (part.inlineData) {
            const audioData = part.inlineData.data;
            // Process or play audioData (base64 encoded string)
          }
        }
      }
      ```


參閱 GitHub 上的範例應用程式，了解如何[在伺服器上接收音訊](https://github.com/google-gemini/gemini-live-api-examples/blob/main/gemini-live-genai-python-sdk/gemini_live.py#L86-L98)，以及如何[在瀏覽器中播放音訊](https://github.com/google-gemini/gemini-live-api-examples/blob/main/gemini-live-genai-python-sdk/frontend/media-handler.js#L145-L174)。

## 接收文字 {#receiving-text}

使用者輸入和模型輸出的轉錄內容都包含在伺服器內容中。


=== "Python"

      ```python
      async for response in session.receive():
          content = response.server_content
          if content:
              if content.input_transcription:
                  print(f"User: {content.input_transcription.text}")
              if content.output_transcription:
                  print(f"Gemini: {content.output_transcription.text}")
      ```

=== "JavaScript"

      ```javascript
      // Inside the onmessage callback
      const content = response.serverContent;
      if (content?.inputTranscription) {
        console.log('User:', content.inputTranscription.text);
      }
      if (content?.outputTranscription) {
        console.log('Gemini:', content.outputTranscription.text);
      }
      ```


## 處理工具呼叫 {#handling-tool-calls}

此 API 支援工具呼叫（函式呼叫）。當模型要求進行工具呼叫時，你必須執行該函式，並將回應傳回。


=== "Python"

      ```python
      async for response in session.receive():
          if response.tool_call:
              function_responses = []
              for fc in response.tool_call.function_calls:
                  # 1. Execute the function locally
                  result = my_tool_function(**fc.args)

                  # 2. Prepare the response
                  function_responses.append(types.FunctionResponse(
                      name=fc.name,
                      id=fc.id,
                      response={"result": result}
                  ))

              # 3. Send the tool response back to the session
              await session.send_tool_response(function_responses=function_responses)
      ```

=== "JavaScript"

      ```javascript
      // Inside the onmessage callback
      if (response.toolCall) {
        const functionResponses = [];
        for (const fc of response.toolCall.functionCalls) {
          const result = myToolFunction(fc.args);
          functionResponses.push({
            name: fc.name,
            id: fc.id,
            response: { result }
          });
        }
        session.sendToolResponse({ functionResponses });
      }
      ```


## 後續步驟 {#whats-next}

* 閱讀完整的 Live API [功能](/docs/live-api/capabilities/)指南，了解主要功能與設定；包括語音活動偵測和原生音訊功能。
* 閱讀[工具使用](/docs/live-api/tools/)指南，了解如何將 Live API 與工具和函式呼叫整合。
* 閱讀[工作階段管理](/docs/live-api/session-management/)指南，了解如何管理長時間執行的對話。
* 閱讀[短期 token](/docs/live-api/ephemeral-tokens/)指南，了解如何在[用戶端到伺服器](/docs/live-api/#implementation-approach)應用程式中進行安全驗證。
* 如需了解底層 WebSockets API 的更多資訊，請參閱 [WebSockets API 參考文件](/api-reference/live/)。
