# 使用 Live API 管理工作階段

在 Live API 中，工作階段指的是一條持續性的連線，輸入與輸出會在同一條連線上不斷串流（進一步了解[其運作方式](/docs/live-api/)）。這種獨特的工作階段設計帶來了低延遲，並支援多項獨有功能，但同時也伴隨一些挑戰，例如工作階段的時間上限與提前終止。本指南說明如何克服使用 Live API 時可能遇到的工作階段管理挑戰。

## 工作階段存續時間 {#maximum-session-duration}

未啟用壓縮時，僅音訊的工作階段上限為 15 分鐘，音訊加視訊的工作階段上限為 2 分鐘。超過這些上限，工作階段（連同連線）將被終止；不過，你可以透過[上下文視窗壓縮](/docs/live-api/session-management/#context-window-compression)，將工作階段延長至不限時間。

連線的存續時間同樣有限，約為 10 分鐘。連線終止時，工作階段也會隨之結束。此時，你可以透過[工作階段恢復](/docs/live-api/session-management/#session-resumption)，讓單一工作階段跨越多條連線持續運作。你也會在連線結束前收到一則 [GoAway 訊息](/docs/live-api/session-management/#goaway-message)，以便採取後續行動。

## 上下文視窗壓縮 {#context-window-compression}

若要延長工作階段並避免連線突然終止，可以在工作階段設定中設定 [contextWindowCompression](/api-reference/live/#BidiGenerateContentSetup) 欄位，啟用上下文視窗壓縮。

在 [ContextWindowCompressionConfig](/api-reference/live/#ContextWindowCompressionConfig) 中，你可以設定[滑動視窗機制](/api-reference/live/#ContextWindowCompressionConfig)，以及觸發壓縮的[權杖數量](/api-reference/live/#ContextWindowCompressionConfig)。


=== "Python"

      ```python
      from google.genai import types

      config = types.LiveConnectConfig(
          response_modalities=["AUDIO"],
          context_window_compression=(
              # Configures compression with default parameters.
              types.ContextWindowCompressionConfig(
                  sliding_window=types.SlidingWindow(),
              )
          ),
      )
      ```

=== "JavaScript"

      ```javascript
      const config = {
        responseModalities: [Modality.AUDIO],
        contextWindowCompression: { slidingWindow: {} }
      };
      ```


## 工作階段恢復 {#session-resumption}

為了避免伺服器定期重設 WebSocket 連線時工作階段被終止，請在[設定組態](/api-reference/live/#BidiGenerateContentSetup)中設定 [sessionResumption](/api-reference/live/#BidiGenerateContentSetup) 欄位。

傳入這項設定後，伺服器會傳送 [SessionResumptionUpdate](/api-reference/live/#SessionResumptionUpdate) 訊息；你可以將最後一個恢復權杖傳入後續連線的 [`SessionResumptionConfig.handle`](/api-reference/live/#SessionResumptionConfig)，藉此恢復工作階段。

恢復權杖在最後一個工作階段終止後 2 小時內有效。


=== "Python"

      ```python
      import asyncio
      from google import genai
      from google.genai import types

      client = genai.Client(http_options={"api_version": "v1beta"})
      model = "gemini-3.8-live"

      async def main():
          print(f"Connecting to the service with handle {previous_session_handle}...")
          async with client.aio.live.connect(
              model=model,
              config=types.LiveConnectConfig(
                  response_modalities=["AUDIO"],
                  session_resumption=types.SessionResumptionConfig(
                      # The handle of the session to resume is passed here,
                      # or else None to start a new session.
                      handle=previous_session_handle
                  ),
              ),
          ) as session:
              while True:
                  await session.send_client_content(
                      turns=types.Content(
                          role="user", parts=[types.Part(text="Hello world!")]
                      )
                  )
                  async for message in session.receive():
                      # Periodically, the server will send update messages that may
                      # contain a handle for the current state of the session.
                      if message.session_resumption_update:
                          update = message.session_resumption_update
                          if update.resumable and update.new_handle:
                              # The handle should be retained and linked to the session.
                              return update.new_handle

                      # For the purposes of this example, placeholder input is continually fed
                      # to the model. In non-sample code, the model inputs would come from
                      # the user.
                      if message.server_content and message.server_content.turn_complete:
                          break

      if __name__ == "__main__":
          asyncio.run(main())
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI, Modality } from '@google/genai';

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });
      const model = 'gemini-3.8-live';

      async function live() {
        const responseQueue = [];

        async function waitMessage() {
          let done = false;
          let message = undefined;
          while (!done) {
            message = responseQueue.shift();
            if (message) {
              done = true;
            } else {
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          }
          return message;
        }

        async function handleTurn() {
          const turns = [];
          let done = false;
          while (!done) {
            const message = await waitMessage();
            turns.push(message);
            if (message.serverContent && message.serverContent.turnComplete) {
              done = true;
            }
          }
          return turns;
        }

      console.debug('Connecting to the service with handle %s...', previousSessionHandle)
      const session = await ai.live.connect({
        model: model,
        callbacks: {
          onopen: function () {
            console.debug('Opened');
          },
          onmessage: function (message) {
            responseQueue.push(message);
          },
          onerror: function (e) {
            console.debug('Error:', e.message);
          },
          onclose: function (e) {
            console.debug('Close:', e.reason);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          sessionResumption: { handle: previousSessionHandle }
          // The handle of the session to resume is passed here, or else null to start a new session.
        }
      });

      const inputTurns = 'Hello how are you?';
      session.sendClientContent({ turns: inputTurns });

      const turns = await handleTurn();
      for (const turn of turns) {
        if (turn.sessionResumptionUpdate) {
          if (turn.sessionResumptionUpdate.resumable && turn.sessionResumptionUpdate.newHandle) {
            let newHandle = turn.sessionResumptionUpdate.newHandle
            // ...Store newHandle and start new session with this handle here
          }
        }
      }

        session.close();
      }

      async function main() {
        await live().catch((e) => console.error('got error', e));
      }

      await main();
      ```


## 在工作階段中斷前接收訊息 {#goaway-message}

伺服器會傳送一則 [GoAway](/api-reference/live/#GoAway) 訊息，表示目前的連線即將終止。這則訊息包含 [timeLeft](/api-reference/live/#GoAway)，指出剩餘時間，讓你能在連線以 ABORTED 終止前採取進一步行動。


=== "Python"

      ```python
      async for response in session.receive():
          if response.go_away is not None:
              # The connection will soon be terminated
              print(response.go_away.time_left)
      ```

=== "JavaScript"

      ```javascript
      const turns = await handleTurn();

      for (const turn of turns) {
        if (turn.goAway) {
          console.debug('Time left: %s\n', turn.goAway.timeLeft);
        }
      }
      ```


## 在生成完成時接收訊息 {#generation-complete-message}

伺服器會傳送一則 [generationComplete](/api-reference/live/#BidiGenerateContentServerContent) 訊息，表示模型已完成回應的生成。


=== "Python"

      ```python
      async for response in session.receive():
          if response.server_content.generation_complete is True:
              # The generation is complete
      ```

=== "JavaScript"

      ```javascript
      const turns = await handleTurn();

      for (const turn of turns) {
        if (turn.serverContent && turn.serverContent.generationComplete) {
          // The generation is complete
        }
      }
      ```


## 後續步驟 {#whats-next}

在完整的[功能](/docs/live-api/)指南、[工具使用](/docs/live-api/tools/)頁面或 [Live API 食譜](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI.ipynb)中，探索更多使用 Live API 的方式。
