# 使用 Live API 的工具功能

工具功能讓 Live API 不再侷限於對話：它能在維持即時連線的同時，於現實世界中執行動作並引入外部上下文。你可以為 Live API 定義[函式呼叫](/docs/function-calling/)與 [Google 搜尋](/docs/google-search/)等工具。

## 支援工具總覽 {#tools-overview}


| 工具 | Gemini 3.8 Live | Gemini 3.8 Live Extended Thinking | Gemini 3.1 Flash Live Preview | Gemini 2.5 Flash Live Preview |
| --- | --- | --- | --- | --- |
| **搜尋** | 支援 | 支援 | 支援 | 支援 |
| **函式呼叫** | 支援（同步與[非同步](/docs/live-api/tools/#async-function-calling)） | 支援（[僅非同步](/docs/live-api/tools/#async-function-calling)） | 支援（僅同步） | 支援（同步與[非同步](/docs/live-api/tools/#async-function-calling)） |
| **Google Maps** | 不支援 | 不支援 | 不支援 | 不支援 |
| **程式碼執行** | 不支援 | 不支援 | 不支援 | 不支援 |
| **URL 上下文** | 不支援 | 不支援 | 不支援 | 不支援 |


## 函式呼叫 {#function-calling}

Live API 支援函式呼叫，與一般內容生成要求相同。函式呼叫讓 Live API 能與外部資料和程式互動，大幅擴展你的應用程式所能完成的事。

你可以將函式宣告定義為工作階段設定的一部分。收到工具呼叫後，用戶端應以 `FunctionResponse` 物件的清單回應，做法是使用 `session.send_tool_response` 方法。

如需進一步了解，請參閱[函式呼叫教學](/docs/function-calling/)。


!!! note " "

      與 `generateContent` API 不同，Live API 不支援自動處理工具回應。你必須在用戶端程式碼中手動處理工具回應。


=== "Python"

      ```python
      import asyncio
      import wave
      from google import genai
      from google.genai import types

      client = genai.Client(http_options={"api_version": "v1beta"})

      model = "gemini-3.8-live"

      # Simple function definitions
      turn_on_the_lights = {"name": "turn_on_the_lights"}
      turn_off_the_lights = {"name": "turn_off_the_lights"}

      tools = [{"function_declarations": [turn_on_the_lights, turn_off_the_lights]}]
      config = {"response_modalities": ["AUDIO"], "tools": tools}

      async def main():
          async with client.aio.live.connect(model=model, config=config) as session:
              prompt = "Turn on the lights please"
              await session.send_client_content(turns={"parts": [{"text": prompt}]})

              wf = wave.open("audio.wav", "wb")
              wf.setnchannels(1)
              wf.setsampwidth(2)
              wf.setframerate(24000) # Output is 24kHz

              async for response in session.receive():
                  if response.data is not None:
                      wf.writeframes(response.data)
                  elif response.tool_call:
                      print("The tool was called")
                      function_responses = []
                      for fc in response.tool_call.function_calls:
                          function_response = types.FunctionResponse(
                              id=fc.id,
                              name=fc.name,
                              response={ "result": "ok" } # simple, hard-coded function response
                          )
                          function_responses.append(function_response)

                      await session.send_tool_response(function_responses=function_responses)

              wf.close()

      if __name__ == "__main__":
          asyncio.run(main())
      ```

=== "JavaScript"

      ```js
      import { GoogleGenAI, Modality } from '@google/genai';
      import * as fs from "node:fs";
      import pkg from 'wavefile'; // npm install wavefile
      const { WaveFile } = pkg;

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });
      const model = 'gemini-3.8-live';

      // Simple function definitions
      const turn_on_the_lights = { name: "turn_on_the_lights" } // , description: '...', parameters: { ... }
      const turn_off_the_lights = { name: "turn_off_the_lights" }

      const tools = [{ functionDeclarations: [turn_on_the_lights, turn_off_the_lights] }]

      const config = {
        responseModalities: [Modality.AUDIO],
        tools: tools
      }

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
            } else if (message.toolCall) {
              done = true;
            }
          }
          return turns;
        }

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
          config: config,
        });

        const inputTurns = 'Turn on the lights please';
        session.sendClientContent({ turns: inputTurns });

        let turns = await handleTurn();

        for (const turn of turns) {
          if (turn.toolCall) {
            console.debug('A tool was called');
            const functionResponses = [];
            for (const fc of turn.toolCall.functionCalls) {
              functionResponses.push({
                id: fc.id,
                name: fc.name,
                response: { result: "ok" } // simple, hard-coded function response
              });
            }

            console.debug('Sending tool response...\n');
            session.sendToolResponse({ functionResponses: functionResponses });
          }
        }

        // Check again for new messages
        turns = await handleTurn();

        // Combine audio data strings and save as wave file
        const combinedAudio = turns.reduce((acc, turn) => {
            if (turn.data) {
                const buffer = Buffer.from(turn.data, 'base64');
                const intArray = new Int16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Int16Array.BYTES_PER_ELEMENT);
                return acc.concat(Array.from(intArray));
            }
            return acc;
        }, []);

        const audioBuffer = new Int16Array(combinedAudio);

        const wf = new WaveFile();
        wf.fromScratch(1, 24000, '16', audioBuffer); // output is 24kHz
        fs.writeFileSync('audio.wav', wf.toBuffer());

        session.close();
      }

      async function main() {
        await live().catch((e) => console.error('got error', e));
      }

      await main();
      ```


模型可以從單一提示詞產生多個函式呼叫，以及串連其輸出所需的程式碼。這段程式碼會在沙箱環境中執行，並產生後續的 [BidiGenerateContentToolCall](/api-reference/live/#BidiGenerateContentToolCall) 訊息。


## 非同步函式呼叫 {#async-function-calling}

函式呼叫預設會依序執行，也就是說，在每個函式呼叫的結果出爐前，執行都會暫停。這確保了循序處理，但也意味著在函式執行期間，你無法繼續與模型互動。


!!! note " "

       `gemini-3.8-live` 支援非同步函式呼叫，`gemini-3.8-live-extended-thinking` 則要求使用非同步函式呼叫。`gemini-3.1-flash-live-preview` 不支援；在該模型上，執行會暫停，直到你送出工具回應為止。


如果你不想阻斷對話，可以指示模型以非同步方式執行函式。為此，你必須先在函式定義中加入 `behavior`：


=== "Python"

      ```python
      # Non-blocking function definitions
      turn_on_the_lights = {"name": "turn_on_the_lights", "behavior": "NON_BLOCKING"} # turn_on_the_lights will run asynchronously
      turn_off_the_lights = {"name": "turn_off_the_lights"} # turn_off_the_lights will still pause all interactions with the model
      ```

=== "JavaScript"

      ```js
      import { GoogleGenAI, Modality, Behavior } from '@google/genai';

      // Non-blocking function definitions
      const turn_on_the_lights = {name: "turn_on_the_lights", behavior: Behavior.NON_BLOCKING}

      // Blocking function definitions
      const turn_off_the_lights = {name: "turn_off_the_lights"}

      const tools = [{ functionDeclarations: [turn_on_the_lights, turn_off_the_lights] }]
      ```


`NON-BLOCKING` 可確保函式以非同步方式執行，同時你能繼續與模型互動。

接著，你需要告訴模型在收到 `FunctionResponse` 時該如何應對，做法是透過 `scheduling` 參數。它可以：

* 中斷手邊的事，立即告訴你剛收到的回應（`scheduling="INTERRUPT"`），

* 等到目前的事情完成後再處理（`scheduling="WHEN_IDLE"`），

* 或者什麼都不做，留待之後的討論再運用這項資訊（`scheduling="SILENT"`）


=== "Python"

      ```python
      # for a non-blocking function definition, apply scheduling in the function response:
        function_response = types.FunctionResponse(
            id=fc.id,
            name=fc.name,
            response={
                "result": "ok",
                "scheduling": "INTERRUPT" # Can also be WHEN_IDLE or SILENT
            }
        )
      ```

=== "JavaScript"

      ```js
      import { GoogleGenAI, Modality, Behavior, FunctionResponseScheduling } from '@google/genai';

      // for a non-blocking function definition, apply scheduling in the function response:
      const functionResponse = {
        id: fc.id,
        name: fc.name,
        response: {
          result: "ok",
          scheduling: FunctionResponseScheduling.INTERRUPT // Can also be WHEN_IDLE or SILENT
        }
      }
      ```


## 使用 Google 搜尋接地 {#google-search}

你可以將使用 Google 搜尋接地啟用為工作階段設定的一部分。這能提升 Live API 的準確度並防止幻覺。如需進一步了解，請參閱[接地教學](/docs/google-search/)。


=== "Python"

      ```python
      import asyncio
      import wave
      from google import genai
      from google.genai import types

      client = genai.Client(http_options={"api_version": "v1beta"})

      model = "gemini-3.8-live"

      tools = [{'google_search': {}}]
      config = {"response_modalities": ["AUDIO"], "tools": tools}

      async def main():
          async with client.aio.live.connect(model=model, config=config) as session:
              prompt = "When did the last Brazil vs. Argentina soccer match happen?"
              await session.send_client_content(turns={"parts": [{"text": prompt}]})

              wf = wave.open("audio.wav", "wb")
              wf.setnchannels(1)
              wf.setsampwidth(2)
              wf.setframerate(24000) # Output is 24kHz

              async for chunk in session.receive():
                  if chunk.server_content:
                      if chunk.data is not None:
                          wf.writeframes(chunk.data)

                      # The model might generate and execute Python code to use Search
                      model_turn = chunk.server_content.model_turn
                      if model_turn:
                          for part in model_turn.parts:
                              if part.executable_code is not None:
                                  print(part.executable_code.code)

                              if part.code_execution_result is not None:
                                  print(part.code_execution_result.output)

              wf.close()

      if __name__ == "__main__":
          asyncio.run(main())
      ```

=== "JavaScript"

      ```js
      import { GoogleGenAI, Modality } from '@google/genai';
      import * as fs from "node:fs";
      import pkg from 'wavefile'; // npm install wavefile
      const { WaveFile } = pkg;

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });
      const model = 'gemini-3.8-live';

      const tools = [{ googleSearch: {} }]
      const config = {
        responseModalities: [Modality.AUDIO],
        tools: tools
      }

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
            } else if (message.toolCall) {
              done = true;
            }
          }
          return turns;
        }

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
          config: config,
        });

        const inputTurns = 'When did the last Brazil vs. Argentina soccer match happen?';
        session.sendClientContent({ turns: inputTurns });

        let turns = await handleTurn();

        let combinedData = '';
        for (const turn of turns) {
          if (turn.serverContent && turn.serverContent.modelTurn && turn.serverContent.modelTurn.parts) {
            for (const part of turn.serverContent.modelTurn.parts) {
              if (part.executableCode) {
                console.debug('executableCode: %s\n', part.executableCode.code);
              }
              else if (part.codeExecutionResult) {
                console.debug('codeExecutionResult: %s\n', part.codeExecutionResult.output);
              }
              else if (part.inlineData && typeof part.inlineData.data === 'string') {
                combinedData += atob(part.inlineData.data);
              }
            }
          }
        }

        // Convert the base64-encoded string of bytes into a Buffer.
        const buffer = Buffer.from(combinedData, 'binary');

        // The buffer contains raw bytes. For 16-bit audio, we need to interpret every 2 bytes as a single sample.
        const intArray = new Int16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Int16Array.BYTES_PER_ELEMENT);

        const wf = new WaveFile();
        // The API returns 16-bit PCM audio at a 24kHz sample rate.
        wf.fromScratch(1, 24000, '16', intArray);
        fs.writeFileSync('audio.wav', wf.toBuffer());

        session.close();
      }

      async function main() {
        await live().catch((e) => console.error('got error', e));
      }

      await main();
      ```


## 組合多個工具 {#combine-tools}

你可以在 Live API 中組合多個工具，進一步提升應用程式的能力：


=== "Python"

      ```python
      prompt = """
      Hey, I need you to do two things for me.

      1. Use Google Search to look up information about the largest earthquake in California the week of Dec 5 2024?
      2. Then turn on the lights

      Thanks!
      """

      tools = [
          {"google_search": {}},
          {"function_declarations": [turn_on_the_lights, turn_off_the_lights]},
      ]

      config = {"response_modalities": ["AUDIO"], "tools": tools}

      # ... remaining model call
      ```

=== "JavaScript"

      ```js
      const prompt = `Hey, I need you to do two things for me.

      1. Use Google Search to look up information about the largest earthquake in California the week of Dec 5 2024?
      2. Then turn on the lights

      Thanks!
      `

      const tools = [
        { googleSearch: {} },
        { functionDeclarations: [turn_on_the_lights, turn_off_the_lights] }
      ]

      const config = {
        responseModalities: [Modality.AUDIO],
        tools: tools
      }

      // ... remaining model call
      ```


## 後續步驟 {#whats-next}

* 在 [Live API 工具食譜](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI_tools.ipynb)中查看更多搭配 Live API 使用工具的範例。

* 在 [Live API 功能指南](/docs/live-api/capabilities/)中了解功能與設定的完整說明。
