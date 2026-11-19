# Live API 功能指南


!!! note " "

      Live API 目前為預覽版。


本指南完整說明 Live API 提供的各項功能與設定。
如需總覽與常見使用情境的範例程式碼，請參閱[開始使用 Live API](/docs/live-api/) 頁面。

## 開始之前 {#before-you-begin}

- **先熟悉核心概念：** 如果尚未讀過，請先閱讀[開始使用 Live API](/docs/live-api/) 頁面。
  該頁面會介紹 Live API 的基本原理、運作方式，以及不同的[實作方式](/docs/live-api/#implementation-approach)。
-   **在 AI Studio 中試用 Live API：** 在開始開發之前，先在
    [Google AI Studio](https://aistudio.google.com/app/live-api) 試用 Multimodal Live API
    會很有幫助。如要在 Google AI Studio 中使用 Live API，請選取 **Stream**。

## 模型比較 {#model-comparison}

下表彙整了
[Gemini 3.8 Live](/docs/models/gemini-3.8-live/)、
[Gemini 3.8 Live Extended Thinking](/docs/models/gemini-3.8-live-extended-thinking/)、
[Gemini 3.1 Flash Live Preview](/docs/models/gemini-3.1-flash-live-preview/) 與
[Gemini 2.5 Flash Live Preview](/docs/models/gemini-2.5-flash-native-audio-preview-12-2025/) 之間的主要差異：


| 功能 | Gemini 3.8 Live | Gemini 3.8 Live Extended Thinking | Gemini 3.1 Flash Live Preview | Gemini 2.5 Flash Live Preview |
| --- | --- | --- | --- | --- |
| **[Thinking](/docs/live-api/thinking/)** | 支援（交錯推理）。不支援 `thinkingLevel`；請勿在設定中加入。 | 支援（可設定的背景推理：`low`、`medium`、`high`；不支援 `minimal`）。支援思考摘要（`includeThoughts`）。 | 使用 `thinkingLevel`（`minimal`、`low`、`medium`、`high`）。預設為 `minimal`，以達到最低延遲。 | 使用 `thinkingBudget` 設定思考權杖預算。 |
| **[接收回應](/api-reference/live/#BidiGenerateContentServerContent)** | 單一伺服器事件可同時包含多個內容部分（例如 `inlineData` 與轉錄文字）。請確保你的程式碼會處理每個事件中的所有部分，以免遺漏內容。 | 單一伺服器事件可同時包含多個內容部分。當非同步推理進行中時，`turnComplete: true` 並不表示工作階段處於閒置狀態；請檢查 `interaction_status`（`IN_PROGRESS` 與 `IDLE`）。 | 單一伺服器事件可同時包含多個內容部分（例如 `inlineData` 與轉錄文字）。請確保你的程式碼會處理每個事件中的所有部分，以免遺漏內容。 | 每個伺服器事件只包含一個內容部分。各部分會以個別事件傳遞。 |
| **[用戶端內容](/docs/live-api/capabilities/#incremental-updates)** | 在整個工作階段生命週期內都支援 `send_client_content`，並可使用明確的角色（`user` 或 `model`）。`turn_complete=true` 會無條件中斷生成。 | 在整個工作階段生命週期內都支援 `send_client_content`，並可使用明確的角色（`user` 或 `model`）。`turn_complete=true` 會無條件中斷生成。 | 在整個工作階段生命週期內都支援 `send_client_content`，並可使用明確的角色（`user` 或 `model`）。`turn_complete=true` 會無條件中斷生成。 | 在整個對話過程中都支援 `send_client_content`，可用於傳送漸進式內容更新並建立上下文。 |
| **[輪次涵蓋範圍](/api-reference/live/#RealtimeInputConfig.TurnCoverage)** | 預設為 `TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO`。模型的輪次包含偵測到的音訊活動與所有影片影格。 | 預設為 `TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO`。模型的輪次包含偵測到的音訊活動與所有影片影格。 | 預設為 `TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO`。模型的輪次包含偵測到的音訊活動與所有影片影格。 | 預設為 `TURN_INCLUDES_ONLY_ACTIVITY`。模型的輪次只包含偵測到的活動。 |
| **[自訂 VAD](/docs/live-api/capabilities/#disable-automatic-vad)** (`activity_start`/`activity_end`) | 支援。停用自動 VAD，並手動傳送 `activityStart` 與 `activityEnd` 訊息來控制輪次邊界。 | 支援。停用自動 VAD，並手動傳送 `activityStart` 與 `activityEnd` 訊息來控制輪次邊界。 | 支援。停用自動 VAD，並手動傳送 `activityStart` 與 `activityEnd` 訊息來控制輪次邊界。 | 支援。停用自動 VAD，並手動傳送 `activityStart` 與 `activityEnd` 訊息來控制輪次邊界。 |
| **[自動 VAD 設定](/docs/live-api/capabilities/#configure-automatic-vad)** | 支援。可設定 `start_of_speech_sensitivity`、`end_of_speech_sensitivity`、`prefix_padding_ms` 與 `silence_duration_ms` 等參數。 | 支援。可設定 `start_of_speech_sensitivity`、`end_of_speech_sensitivity`、`prefix_padding_ms` 與 `silence_duration_ms` 等參數。 | 支援。可設定 `start_of_speech_sensitivity`、`end_of_speech_sensitivity`、`prefix_padding_ms` 與 `silence_duration_ms` 等參數。 | 支援。可設定 `start_of_speech_sensitivity`、`end_of_speech_sensitivity`、`prefix_padding_ms` 與 `silence_duration_ms` 等參數。 |
| **[非同步函式呼叫](/docs/live-api/tools/#async-function-calling)** (`behavior: NON_BLOCKING`) | 支援（預設）。設定 `behavior: NON_BLOCKING`，或使用回溯相容的阻塞模式（`behavior: BLOCKING`）。支援函式排程（`SILENT`、`WHEN_IDLE`、`INTERRUPTED`）。 | 支援（僅非同步）。僅支援 `NON_BLOCKING` 執行。不支援阻塞模式與函式排程。 | 不支援。函式呼叫僅為同步模式。模型會等待工具回應後才做出回應。 | 支援（同步與非同步皆可）。 |
| **[主動式音訊](/docs/live-api/capabilities/#proactive-audio)** | 永久啟用（`proactive_audio: false` 會傳回錯誤）。 | 永久啟用（`proactive_audio: false` 會傳回錯誤）。 | 不支援 | 支援（可設定）。將 `proactive_audio` 設為 `true`（於 `proactivity` 設定中）。 |
| **[情感對話](/docs/live-api/capabilities/#affective-dialog)** | 不支援（已移除；請勿加入 `enable_affective_dialog`）。 | 不支援（已移除；請勿加入 `enable_affective_dialog`）。 | 不支援 | 支援。在工作階段設定中將 `enable_affective_dialog` 設為 `true`。 |


如要從 Gemini 3.1 Flash Live Preview 遷移至 Gemini 3.8 Live，請參閱
[遷移指南](/docs/models/gemini-3.8-live/#migrating)。如要進一步了解
Thinking，請參閱 [Live API 中的 Thinking](/docs/live-api/thinking/) 與
[升級至 Gemini 3.8 Live Extended Thinking](/docs/models/gemini-3.8-live-extended-thinking/#upgrading)。

## 建立連線 {#establish-connection}

以下範例示範如何使用 API 金鑰建立連線：


=== "Python"

      ```python
      import asyncio
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

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

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });
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


## 互動模態 {#modalities}

以下各節提供 Live API 各種輸入與輸出模態的範例與相關說明。

### 傳送音訊 {#send-receive-audio}

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


### 音訊格式 {#audio-formats}

Multimodal Live API 中的音訊資料一律為原始、小端序的
16 位元 PCM。音訊輸出的取樣率一律為 24kHz。輸入音訊
原生為 16kHz，但 Multimodal Live API 會在需要時重新取樣，
因此可以傳送任何取樣率。如要表明輸入音訊的取樣率，請將每個包含音訊的 [Blob](/api-reference/generate-content/#Resource:Content) 的 MIME 類型設為
`audio/pcm;rate=16000` 之類的值。

### 接收音訊 {#receive-audio}

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


### 傳送文字 {#send-text}

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


### 傳送影片 {#send-video}

影片影格會以個別圖片（例如 JPEG 或 PNG）的形式，以特定影格率傳送（每秒最多 1 個影格）。


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


#### 漸進式內容更新 {#incremental-updates}

使用漸進式更新來傳送文字輸入、建立工作階段上下文，或
還原工作階段上下文。對於較短的上下文，你可以逐輪傳送
互動內容，精確呈現事件發生的順序：


!!! note " "

       對於 Gemini 3.8 與 3.1 模型，如果你想在開始即時串流之前，先使用 `send_client_content` 植入
      初始對話記錄，請將
      [`initial_history_in_client_content`](/api-reference/live/#HistoryConfig)
      設為 `true`（此設定位於工作階段設定的 `history_config` 中）。你也可以在工作階段進行中途使用
      `send_client_content` 附加結構化的文字輪次。


=== "Python"

      ```python
      turns = [
          {"role": "user", "parts": [{"text": "What is the capital of France?"}]},
          {"role": "model", "parts": [{"text": "Paris"}]},
      ]

      await session.send_client_content(turns=turns, turn_complete=False)

      turns = [{"role": "user", "parts": [{"text": "What is the capital of Germany?"}]}]

      await session.send_client_content(turns=turns, turn_complete=True)
      ```

=== "JavaScript"

      ```javascript
      let inputTurns = [
        { "role": "user", "parts": [{ "text": "What is the capital of France?" }] },
        { "role": "model", "parts": [{ "text": "Paris" }] },
      ]

      session.sendClientContent({ turns: inputTurns, turnComplete: false })

      inputTurns = [{ "role": "user", "parts": [{ "text": "What is the capital of Germany?" }] }]

      session.sendClientContent({ turns: inputTurns, turnComplete: true })
      ```


對於較長的上下文，建議提供單一訊息摘要，以釋放
上下文視窗供後續互動使用。另一種載入工作階段上下文的方法，請參閱
[工作階段恢復](/docs/live-api/session-management/#session-resumption)。

### 音訊轉錄 {#audio-transcription}

除了模型回應之外，你也可以接收音訊輸出與
音訊輸入的轉錄文字。

如要啟用模型音訊輸出的轉錄功能，請在設定組態中傳送
`output_audio_transcription`。轉錄語言會從模型的回應推斷。


=== "Python"

      ```python
      import asyncio
      from google import genai
      from google.genai import types

      client = genai.Client(http_options={"api_version": "v1beta"})
      model = "gemini-3.8-live"

      config = {
          "response_modalities": ["AUDIO"],
          "output_audio_transcription": {}
      }

      async def main():
          async with client.aio.live.connect(model=model, config=config) as session:
              message = "Hello? Gemini are you there?"

              await session.send_client_content(
                  turns={"role": "user", "parts": [{"text": message}]}, turn_complete=True
              )

              async for response in session.receive():
                  if response.server_content.model_turn:
                      print("Model turn:", response.server_content.model_turn)
                  if response.server_content.output_transcription:
                      print("Transcript:", response.server_content.output_transcription.text)

      if __name__ == "__main__":
          asyncio.run(main())
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI, Modality } from '@google/genai';

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });
      const model = 'gemini-3.8-live';

      const config = {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {}
      };

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

        const inputTurns = 'Hello how are you?';
        session.sendClientContent({ turns: inputTurns });

        const turns = await handleTurn();

        for (const turn of turns) {
          if (turn.serverContent && turn.serverContent.outputTranscription) {
            console.debug('Received output transcription: %s\n', turn.serverContent.outputTranscription.text);
          }
        }

        session.close();
      }

      async function main() {
        await live().catch((e) => console.error('got error', e));
      }

      await main();
      ```


如要啟用模型音訊輸入的轉錄功能，請在設定組態中傳送
`input_audio_transcription`。


=== "Python"

      ```python
      import asyncio
      from pathlib import Path
      from google import genai
      from google.genai import types

      client = genai.Client(http_options={"api_version": "v1beta"})
      model = "gemini-3.8-live"

      config = {
          "response_modalities": ["AUDIO"],
          "input_audio_transcription": {},
      }

      async def main():
          async with client.aio.live.connect(model=model, config=config) as session:
              audio_data = Path("16000.pcm").read_bytes()

              await session.send_realtime_input(
                  audio=types.Blob(data=audio_data, mime_type='audio/pcm;rate=16000')
              )

              async for msg in session.receive():
                  if msg.server_content.input_transcription:
                      print('Transcript:', msg.server_content.input_transcription.text)

      if __name__ == "__main__":
          asyncio.run(main())
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI, Modality } from '@google/genai';
      import * as fs from "node:fs";
      import pkg from 'wavefile';
      const { WaveFile } = pkg;

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });
      const model = 'gemini-3.8-live';

      const config = {
        responseModalities: [Modality.AUDIO],
        inputAudioTranscription: {}
      };

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

        // Send Audio Chunk
        const fileBuffer = fs.readFileSync("16000.wav");

        // Ensure audio conforms to API requirements (16-bit PCM, 16kHz, mono)
        const wav = new WaveFile();
        wav.fromBuffer(fileBuffer);
        wav.toSampleRate(16000);
        wav.toBitDepth("16");
        const base64Audio = wav.toBase64();

        // If already in correct format, you can use this:
        // const fileBuffer = fs.readFileSync("sample.pcm");
        // const base64Audio = Buffer.from(fileBuffer).toString('base64');

        session.sendRealtimeInput(
          {
            audio: {
              data: base64Audio,
              mimeType: "audio/pcm;rate=16000"
            }
          }
        );

        const turns = await handleTurn();
        for (const turn of turns) {
          if (turn.text) {
            console.debug('Received text: %s\n', turn.text);
          }
          else if (turn.data) {
            console.debug('Received inline data: %s\n', turn.data);
          }
          else if (turn.serverContent && turn.serverContent.inputTranscription) {
            console.debug('Received input transcription: %s\n', turn.serverContent.inputTranscription.text);
          }
        }

        session.close();
      }

      async function main() {
        await live().catch((e) => console.error('got error', e));
      }

      await main();
      ```


如要改善輸入轉錄對特定詞彙（例如專有名詞、品牌名稱或技術術語）的辨識效果，請將 `custom_vocabulary` 清單加入
`input_audio_transcription` 中。你最多可以提供 1,000 個詞彙，但通常使用
最多 100 個詞彙即可獲得最佳效果。詳情請參閱
[自訂詞彙偏置](/docs/live-api/live-transcribe/#custom-vocabulary-biasing)。


=== "Python"

      ```python
      config = {
          "response_modalities": ["AUDIO"],
          "input_audio_transcription": {
              "custom_vocabulary": ["Gemini", "Kubernetes", "BigQuery"],
          },
      }
      ```

=== "JavaScript"

      ```javascript
      const config = {
        responseModalities: [Modality.AUDIO],
        inputAudioTranscription: {
          customVocabulary: ['Gemini', 'Kubernetes', 'BigQuery'],
        },
      };
      ```


### 變更語音與語言 {#change-voice-and-language}

[原生音訊輸出](/docs/live-api/capabilities/#native-audio-output) 模型支援我們 [文字轉語音（TTS）](/docs/speech-generation/#voices)
模型提供的所有語音。你可以在 [AI Studio](https://aistudio.google.com/app/live-api) 試聽所有語音。

如要指定語音，請在工作階段設定中，將語音名稱設定於 `speechConfig` 物件內：


=== "Python"

      ```python
      config = {
          "response_modalities": ["AUDIO"],
          "speech_config": {
              "voice_config": {"prebuilt_voice_config": {"voice_name": "Kore"}}
          },
      }
      ```

=== "JavaScript"

      ```javascript
      const config = {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
      };
      ```


    !!! note " "

          如果你使用的是 `generateContent` API，可用的語音集合


      略有不同。`generateContent` 音訊生成的可用語音，請參閱[語音生成指南](/docs/speech-generation/#voices)。

      Multimodal Live API 支援[多種語言](/docs/live-api/capabilities/#supported-languages)。
        [原生音訊輸出](/docs/live-api/capabilities/#native-audio-output) 模型會自動選擇
        合適的語言，不支援明確設定語言
        代碼。


## 原生音訊功能 {#native-audio-output}

我們最新的模型具備[原生音訊輸出](/docs/models/gemini-3.8-live/)，
能提供自然、逼真的語音，以及更佳的多語言表現。

### Thinking {#native-audio-output-thinking}

Gemini 3.8 Live Extended Thinking 與 Gemini 3.1 模型使用 `thinkingLevel` 來
控制思考深度。對於 `gemini-3.8-live`，不支援 `thinkingLevel`，
且在設定時必須省略。Gemini 3.8 Live Extended Thinking 支援 `low`、
`medium` 與 `high`（不支援 `minimal`）。Gemini 3.1 模型支援
`minimal`、`low`、`medium` 與 `high`。完整詳情與程式碼範例，
請參閱 [Live API 中的 Thinking](/docs/live-api/thinking/)。


=== "Python"

      ```python
      model = "gemini-3.8-live-extended-thinking"

      config = types.LiveConnectConfig(
          response_modalities=["AUDIO"],
          thinking_config=types.ThinkingConfig(
              thinking_level="MEDIUM",
          )
      )

      async with client.aio.live.connect(model=model, config=config) as session:
          # Send audio input and receive audio
      ```

=== "JavaScript"

      ```javascript
      const model = 'gemini-3.8-live-extended-thinking';
      const config = {
        responseModalities: [Modality.AUDIO],
        thinkingConfig: {
          thinkingLevel: 'MEDIUM',
        },
      };

      async function main() {

        const session = await ai.live.connect({
          model: model,
          config: config,
          callbacks: ...,
        });

        // Send audio input and receive audio

        session.close();
      }

      await main();
      ```


此外，你也可以在設定中將 `includeThoughts` 設為
`true` 來啟用思考摘要。詳情請參閱
[接收思考摘要](/docs/thinking/#summaries)：


=== "Python"

      ```python
      model = "gemini-3.8-live-extended-thinking"

      config = types.LiveConnectConfig(
          response_modalities=["AUDIO"],
          thinking_config=types.ThinkingConfig(
              thinking_level="HIGH",
              include_thoughts=True
          )
      )
      ```

=== "JavaScript"

      ```javascript
      const model = 'gemini-3.8-live-extended-thinking';
      const config = {
        responseModalities: [Modality.AUDIO],
        thinkingConfig: {
          thinkingLevel: 'HIGH',
          includeThoughts: true,
        },
      };
      ```


### 情感對話 {#affective-dialog}

這項功能讓 Gemini 能依據輸入的表達方式與語氣調整回應風格。


!!! note " "

      僅 Gemini 2.5 Flash Live 支援。已在 Gemini 3.8 Live 與 Gemini
      3.8 Live Extended Thinking 中移除（請勿加入 `enable_affective_dialog`），且 Gemini 3.1 Flash Live Preview 不支援。


如要使用情感對話，請將 API 版本設為 `v1beta`，並在設定訊息中將
`enable_affective_dialog` 設為 `true`：


=== "Python"

      ```python
      client = genai.Client(http_options={"api_version": "v1beta"})

      config = types.LiveConnectConfig(
          response_modalities=["AUDIO"],
          enable_affective_dialog=True
      )
      ```

=== "JavaScript"

      ```javascript
      const ai = new GoogleGenAI({ httpOptions: {"apiVersion": "v1beta"} });

      const config = {
        responseModalities: [Modality.AUDIO],
        enableAffectiveDialog: true
      };
      ```


### 主動式音訊 {#proactive-audio}

啟用這項功能後，如果內容不相關，Gemini 可以主動決定不回應。


!!! note " "

      在 Gemini 3.8 Live 與 Gemini 3.8 Live Extended Thinking 上永久啟用
      （將 `proactive_audio: false` 會傳回錯誤）。在 Gemini 2.5
      Flash Live 上可設定，Gemini 3.1 Flash Live Preview 則不支援。


如要使用這項功能，請將 API 版本設為 `v1beta`，並在設定訊息中設定 `proactivity`
欄位，將 `proactive_audio` 設為 `true`：


=== "Python"

      ```python
      client = genai.Client(http_options={"api_version": "v1beta"})

      config = types.LiveConnectConfig(
          response_modalities=["AUDIO"],
          proactivity={'proactive_audio': True}
      )
      ```

=== "JavaScript"

      ```javascript
      const ai = new GoogleGenAI({ httpOptions: {"apiVersion": "v1beta"} });

      const config = {
        responseModalities: [Modality.AUDIO],
        proactivity: { proactiveAudio: true }
      }
      ```


## 即時翻譯 {#live-translate}

Live API 支援即時、低延遲的口語對話翻譯。這項功能讓你能打造即時的語音對語音翻譯應用程式。

詳情與範例請參閱 [即時翻譯指南](/docs/live-api/live-translate/)。

## 語音活動偵測（VAD） {#interruptions}

語音活動偵測（VAD）讓模型能辨識使用者何時在說話。這對於打造自然的對話至關重要，因為它讓
使用者可以隨時打斷模型。

當 VAD 偵測到打斷時，正在進行的生成會被取消並
捨棄。只有已經傳送至用戶端的資訊會保留在
工作階段記錄中。伺服器接著會傳送一則
[`BidiGenerateContentServerContent`](/api-reference/live/#BidiGenerateContentServerContent)
訊息來回報這次打斷。

Gemini 伺服器接著會捨棄所有待處理的函式呼叫，並傳送一則
帶有已取消呼叫 ID 的 `BidiGenerateContentServerContent` 訊息。


=== "Python"

      ```python
      async for response in session.receive():
          if response.server_content.interrupted is True:
              # The generation was interrupted

              # If realtime playback is implemented in your application,
              # you should stop playing audio and clear queued playback here.
      ```

=== "JavaScript"

      ```javascript
      const turns = await handleTurn();

      for (const turn of turns) {
        if (turn.serverContent && turn.serverContent.interrupted) {
          // The generation was interrupted

          // If realtime playback is implemented in your application,
          // you should stop playing audio and clear queued playback here.
        }
      }
      ```


### 自動 VAD {#use-automatic-vad}

依預設，模型會對連續的音訊輸入串流自動執行 VAD。VAD 可以透過
[設定組態](/api-reference/live/#BidiGenerateContentSetup) 的
[`realtimeInputConfig.automaticActivityDetection`](/api-reference/live/#RealtimeInputConfig.AutomaticActivityDetection)
欄位來設定。

當音訊串流暫停超過一秒時（例如
因為使用者關閉了麥克風），應傳送
[`audioStreamEnd`](/api-reference/live/#BidiGenerateContentRealtimeInput)
事件來清除所有快取的音訊。用戶端可以隨時恢復傳送
音訊資料。


=== "Python"

      ```python
      # example audio file to try:
      # URL = "https://storage.googleapis.com/generativeai-downloads/data/hello_are_you_there.pcm"
      # !wget -q $URL -O sample.pcm
      import asyncio
      from pathlib import Path
      from google import genai
      from google.genai import types

      client = genai.Client(http_options={"api_version": "v1beta"})
      model = "gemini-3.8-live"

      config = {"response_modalities": ["AUDIO"]}

      async def main():
          async with client.aio.live.connect(model=model, config=config) as session:
              audio_bytes = Path("sample.pcm").read_bytes()

              await session.send_realtime_input(
                  audio=types.Blob(data=audio_bytes, mime_type="audio/pcm;rate=16000")
              )

              # if stream gets paused, send:
              # await session.send_realtime_input(audio_stream_end=True)

              async for response in session.receive():
                  if response.text is not None:
                      print(response.text)

      if __name__ == "__main__":
          asyncio.run(main())
      ```

=== "JavaScript"

      ```javascript
      // example audio file to try:
      // URL = "https://storage.googleapis.com/generativeai-downloads/data/hello_are_you_there.pcm"
      // !wget -q $URL -O sample.pcm
      import { GoogleGenAI, Modality } from '@google/genai';
      import * as fs from "node:fs";

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });
      const model = 'gemini-3.8-live';
      const config = { responseModalities: [Modality.AUDIO] };

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

        // Send Audio Chunk
        const fileBuffer = fs.readFileSync("sample.pcm");
        const base64Audio = Buffer.from(fileBuffer).toString('base64');

        session.sendRealtimeInput(
          {
            audio: {
              data: base64Audio,
              mimeType: "audio/pcm;rate=16000"
            }
          }

        );

        // if stream gets paused, send:
        // session.sendRealtimeInput({ audioStreamEnd: true })

        const turns = await handleTurn();
        for (const turn of turns) {
          if (turn.text) {
            console.debug('Received text: %s\n', turn.text);
          }
          else if (turn.data) {
            console.debug('Received inline data: %s\n', turn.data);
          }
        }

        session.close();
      }

      async function main() {
        await live().catch((e) => console.error('got error', e));
      }

      await main();
      ```

      使用 `send_realtime_input` 時，API 會依據
        VAD 自動回應音訊。而 `send_client_content` 會依序將訊息加入模型上下文，
        `send_realtime_input` 則以犧牲確定性排序為代價，換取最佳化的回應速度。


### 自動 VAD 設定 {#configure-automatic-vad}

如要更精細地控制 VAD 活動，你可以設定以下
參數。詳情請參閱 [API 參考文件](/api-reference/live/#RealtimeInputConfig.AutomaticActivityDetection)。


=== "Python"

      ```python
      from google.genai import types

      config = {
          "response_modalities": ["AUDIO"],
          "realtime_input_config": {
              "automatic_activity_detection": {
                  "disabled": False, # default
                  "start_of_speech_sensitivity": types.StartSensitivity.START_SENSITIVITY_LOW,
                  "end_of_speech_sensitivity": types.EndSensitivity.END_SENSITIVITY_LOW,
                  "prefix_padding_ms": 20,
                  "silence_duration_ms": 100,
              }
          }
      }
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI, Modality, StartSensitivity, EndSensitivity } from '@google/genai';

      const config = {
        responseModalities: [Modality.AUDIO],
        realtimeInputConfig: {
          automaticActivityDetection: {
            disabled: false, // default
            startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_LOW,
            endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
            prefixPaddingMs: 20,
            silenceDurationMs: 100,
          }
        }
      };
      ```


### 混合式 VAD {#hybrid-vad}

混合式 VAD 結合了自動 VAD（穩健的語音開始偵測）與手動 VAD（低延遲的回應定稿）的優點。

在此設定下：

1. **伺服器上的自動 VAD 保持啟用**。伺服器會自動
   偵測使用者語音的開始，並使用前置填充來避免截斷
   話語的開頭。
2. 用戶端使用**用戶端 VAD** 來偵測使用者何時
   停止說話。
3. 當用戶端 VAD 偵測到語音結束時，會向伺服器傳送
   [`audio_stream_end`](/api-reference/live/#BidiGenerateContentRealtimeInput)
   訊號。
4. 伺服器將 `audio_stream_end` 訊號視為立即
   定稿的提示，繞過預設的伺服器端靜音偵測
   延遲，並以最低延遲傳回轉錄文字與模型回應。
5. 如果用戶端 VAD 未能觸發，伺服器端 VAD 會作為
   備援，偵測語音結束。

請注意，如果用戶端 VAD 閾值設定得太積極，可能會導致
語音被截斷。不過，這種方式能避免手動 VAD 可能發生的
開頭截斷問題。


=== "Python"

      ```python
      # Set up with automatic VAD enabled (default)
      config = {
          "response_modalities": ["AUDIO"],
      }

      async with client.aio.live.connect(model=model, config=config) as session:
          # Send audio data normally
          await session.send_realtime_input(
              audio=types.Blob(data=audio_bytes, mime_type="audio/pcm;rate=16000")
          )

          # When client-side VAD detects the end of speech, send:
          await session.send_realtime_input(audio_stream_end=True)
      ```

=== "JavaScript"

      ```javascript
      // Set up with automatic VAD enabled (default)
      const config = {
        responseModalities: [Modality.AUDIO],
      };

      // Send audio data normally
      session.sendRealtimeInput({
        audio: {
          data: base64Audio,
          mimeType: "audio/pcm;rate=16000"
        }
      });

      // When client-side VAD detects the end of speech, send:
      session.sendRealtimeInput({ audioStreamEnd: true });
      ```


### 停用自動 VAD {#disable-automatic-vad}

或者，你也可以在設定訊息中將
`realtimeInputConfig.automaticActivityDetection.disabled` 設為 `true` 來停用自動 VAD。在此設定下，用戶端負責偵測使用者
語音，並在適當時機傳送
[`activityStart`](/api-reference/live/#BidiGenerateContentRealtimeInput)
與 [`activityEnd`](/api-reference/live/#BidiGenerateContentRealtimeInput)
訊息。在此設定下不會傳送 `audioStreamEnd`。串流的任何中斷
都會以 `activityEnd` 訊息標示。


=== "Python"

      ```python
      config = {
          "response_modalities": ["AUDIO"],
          "realtime_input_config": {"automatic_activity_detection": {"disabled": True}},
      }

      async with client.aio.live.connect(model=model, config=config) as session:
          # ...
          await session.send_realtime_input(activity_start=types.ActivityStart())
          await session.send_realtime_input(
              audio=types.Blob(data=audio_bytes, mime_type="audio/pcm;rate=16000")
          )
          await session.send_realtime_input(activity_end=types.ActivityEnd())
          # ...
      ```

=== "JavaScript"

      ```javascript
      const config = {
        responseModalities: [Modality.AUDIO],
        realtimeInputConfig: {
          automaticActivityDetection: {
            disabled: true,
          }
        }
      };

      session.sendRealtimeInput({ activityStart: {} })

      session.sendRealtimeInput(
        {
          audio: {
            data: base64Audio,
            mimeType: "audio/pcm;rate=16000"
          }
        }

      );

      session.sendRealtimeInput({ activityEnd: {} })
      ```


### 了解 VAD 參數及其對品質的影響 {#vad-quality-best-practices}

使用自動 VAD 時，有兩個關鍵參數控制音訊在傳送至模型之前
如何被切分為語音輪次：

- **`prefixPaddingMs`**：在偵測到語音*之前*要納入的音訊量。
  這段「回溯」能確保模型擷取到語音完整的
  起始部分，包括可能在 VAD 觸發前就開始的第一個音節。值為 `0` 可能會導致
  字詞的開頭被截斷。
- **`silenceDurationMs`**：伺服器在結束語音輪次之前，等待靜音持續的
  時間。這決定了系統對句中自然停頓（例如思考、呼吸或
  子句邊界）的容忍程度。

#### `silenceDurationMs` 對音訊品質的影響

`silenceDurationMs` 的值會直接影響模型接收處理的音訊區塊大小與完整性：

- **建議值（500ms–800ms）：** 兼顧良好的平衡——模型
  接收到完整、上下文豐富的音訊區塊，同時延遲保持在
  合理範圍。伺服器的內部預設值約為 800ms。
- **太低（例如 100ms–200ms）：** 系統會在自然停頓時結束語音輪次，
  將單一話語切成多個小型音訊
  片段。模型會逐一接收這些片段，因而失去
  跨片段的上下文，導致轉錄與回應
  品質降低。
- **太高（例如 2000ms 以上）：** 系統會在使用者停止說話後等待很長
  時間，增加模型回應前使用者感受到的延遲。

#### 手動（用戶端）VAD 的最佳做法

當你停用自動 VAD，並透過自己的用戶端語音偵測管理 `activityStart`/`activityEnd`
訊號時，請注意伺服器內建的音訊緩衝機制會被繞過。這表示：

1. **沒有語音前緩衝：** 伺服器不再於偵測到的語音開始之前
   前置音訊。你的用戶端應在傳送 `activityStart` 之前納入足夠的音訊
   上下文。
2. **沒有靜音容忍：** 伺服器會立即依你的
   `activityEnd` 訊號行動，不再額外等待。如果你的用戶端 VAD
   使用積極的語音結束閾值（例如 200ms 的靜音），
   語音可能會在自然停頓時於句中被截斷。

如要以手動 VAD 維持音訊品質，請在用戶端的語音活動偵測器中使用至少 **500ms** 的語音結束靜音
閾值。低於此值的閾值常會導致音訊片段化，進而降低
轉錄與模型回應品質。

## 權杖數量 {#token-count}

你可以在傳回的伺服器訊息的
[usageMetadata](/api-reference/live/#UsageMetadata) 欄位中找到已消耗的權杖總數。


=== "Python"

      ```python
      async for message in session.receive():
          # The server will periodically send messages that include UsageMetadata.
          if message.usage_metadata:
              usage = message.usage_metadata
              print(
                  f"Used {usage.total_token_count} tokens in total. Response token breakdown:"
              )
              for detail in usage.response_tokens_details:
                  match detail:
                      case types.ModalityTokenCount(modality=modality, token_count=count):
                          print(f"{modality}: {count}")
      ```

=== "JavaScript"

      ```javascript
      const turns = await handleTurn();

      for (const turn of turns) {
        if (turn.usageMetadata) {
          console.debug('Used %s tokens in total. Response token breakdown:\n', turn.usageMetadata.totalTokenCount);

          for (const detail of turn.usageMetadata.responseTokensDetails) {
            console.debug('%s\n', detail);
          }
        }
      }
      ```


## 媒體解析度 {#media-resolution}

你可以將 `mediaResolution` 欄位設為工作階段設定的一部分，來指定輸入媒體的媒體解析度：


=== "Python"

      ```python
      from google.genai import types

      config = {
          "response_modalities": ["AUDIO"],
          "media_resolution": types.MediaResolution.MEDIA_RESOLUTION_LOW,
      }
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI, Modality, MediaResolution } from '@google/genai';

      const config = {
          responseModalities: [Modality.AUDIO],
          mediaResolution: MediaResolution.MEDIA_RESOLUTION_LOW,
      };
      ```


你可以為包含音訊、影片或圖片輸入的多模態工作階段設定 `mediaResolution`。`mediaResolution` 會調整視覺輸入每一影格的權杖
配置，而音訊串流在所有解析度設定下都以每秒固定速率進行權杖化。詳情請參閱
[媒體解析度](/docs/media-resolution/) 指南。

## 限制 {#limitations}

在規劃專案時，請留意 Multimodal Live API 的以下限制。

### 回應模態 {#response-modalities}

原生音訊模型僅支援 `AUDIO 回應模態。如果你需要
以文字形式取得模型回應，請使用[輸出音訊轉錄](/docs/live-api/capabilities/#audio-transcription)
功能。

### 用戶端驗證 {#client-authentication}

Multimodal Live API 依預設僅提供伺服器對伺服器驗證。如果你採用
[用戶端對伺服器方式](/docs/live-api/#implementation-approach) 實作 Multimodal Live API 應用程式，你需要
使用[臨時權杖](/docs/live-api/ephemeral-tokens/) 來降低安全性
風險。

### 工作階段時長 {#maximum-session-duration}

僅音訊的工作階段上限為 15 分鐘，音訊加影片的工作階段
上限為 2 分鐘。不過，你可以設定不同的
[工作階段管理技術](/docs/live-api/session-management/)，讓工作階段時長不受限制地延長。

### 上下文視窗 {#context-window}

每個工作階段的上下文視窗上限為：

- [原生音訊輸出](/docs/live-api/capabilities/#native-audio-output) 模型為 128k 權杖
- 其他 Multimodal Live API 模型為 32k 權杖

## 支援的語言 {#supported-languages}

Multimodal Live API 支援以下 99 種語言。


!!! note " "

      [原生音訊輸出](/docs/live-api/capabilities/#native-audio-output) 模型可以在對話過程中自然地在
      語言之間切換。你也可以在系統指令中指定，來限制
      它使用的語言。


| 語言 | BCP-47 代碼 | 語言 | BCP-47 代碼 |
| :--- | :--- | :--- | :--- |
| 南非荷蘭語 | `af` | 拉脫維亞語 | `lv` |
| 阿坎語 | `ak` | 立陶宛語 | `lt` |
| 阿爾巴尼亞語 | `sq` | 馬其頓語 | `mk` |
| 阿姆哈拉語 | `am` | 馬來語 | `ms` |
| 阿拉伯語 | `ar` | 馬拉雅拉姆語 | `ml` |
| 亞美尼亞語 | `hy` | 馬爾他語 | `mt` |
| 阿薩姆語 | `as` | 毛利語 | `mi` |
| 亞塞拜然語 | `az` | 馬拉提語 | `mr` |
| 巴斯克語 | `eu` | 蒙古語 | `mn` |
| 白俄羅斯語 | `be` | 尼泊爾語 | `ne` |
| 孟加拉語 | `bn` | 挪威語 | `no`, `nb` |
| 波士尼亞語 | `bs` | 奧迪亞語 | `or` |
| 保加利亞語 | `bg` | 奧羅莫語 | `om` |
| 緬甸語 | `my` | 普什圖語 | `ps` |
| 加泰隆尼亞語 | `ca` | 波斯語 | `fa` |
| 宿霧語 | `ceb` | 波蘭語 | `pl` |
| 簡體中文 | `zh-Hans` | 巴西葡萄牙語 | `pt-BR` |
| 繁體中文 | `zh-Hant` | 葡萄牙葡萄牙語 | `pt-PT` |
| 克羅埃西亞語 | `hr` | 旁遮普語 | `pa` |
| 捷克語 | `cs` | 克丘亞語 | `qu` |
| 丹麥語 | `da` | 羅馬尼亞語 | `ro` |
| 荷蘭語 | `nl` | 羅曼什語 | `rm` |
| 英語 | `en` | 俄語 | `ru` |
| 愛沙尼亞語 | `et` | 塞爾維亞語 | `sr` |
| 法羅語 | `fo` | 信德語 | `sd` |
| 菲律賓語 | `fil` | 僧伽羅語 | `si` |
| 芬蘭語 | `fi` | 斯洛伐克語 | `sk` |
| 法語 | `fr` | 斯洛維尼亞語 | `sl` |
| 加利西亞語 | `gl` | 索馬利語 | `so` |
| 喬治亞語 | `ka` | 南索托語 | `st` |
| 德語 | `de` | 西班牙語 | `es` |
| 希臘語 | `el` | 斯瓦希里語 | `sw` |
| 古吉拉特語 | `gu` | 瑞典語 | `sv` |
| 豪薩語 | `ha` | 塔吉克語 | `tg` |
| 希伯來語 | `he` | 坦米爾語 | `ta` |
| 印地語 | `hi` | 泰盧固語 | `te` |
| 匈牙利語 | `hu` | 泰語 | `th` |
| 冰島語 | `is` | 札那語 | `tn` |
| 印尼語 | `id` | 土耳其語 | `tr` |
| 愛爾蘭語 | `ga` | 土庫曼語 | `tk` |
| 義大利語 | `it` | 烏克蘭語 | `uk` |
| 日語 | `ja` | 烏爾都語 | `ur` |
| 卡納達語 | `kn` | 烏茲別克語 | `uz` |
| 哈薩克語 | `kk` | 越南語 | `vi` |
| 高棉語 | `km` | 威爾斯語 | `cy` |
| 盧安達語 | `rw` | 西弗里西亞語 | `fy` |
| 韓語 | `ko` | 沃洛夫語 | `wo` |
| 庫德語 | `ku` | 約魯巴語 | `yo` |
| 吉爾吉斯語 | `ky` | 祖魯語 | `zu` |
| 寮語 | `lo` |  |  |

## 後續步驟 {#whats-next}

-   閱讀 [Live API 中的 Thinking](/docs/live-api/thinking/)、
    [工具使用](/docs/live-api/tools/) 與
    [工作階段管理](/docs/live-api/session-management/) 指南，掌握有效使用 Live API 的
    重要資訊。
- 在 [Google AI Studio](https://aistudio.google.com/app/live) 中試用 Multimodal Live API。
-   如要進一步了解 Live API 模型，請參閱 Models 頁面上的
    [Gemini 3.8 Live](/docs/models/gemini-3.8-live/) 與
    [Gemini 3.8 Live Extended Thinking](/docs/models/gemini-3.8-live-extended-thinking/)。
- 在 [Live API cookbook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI.ipynb)、
  [Live API Tools cookbook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI_tools.ipynb)
  與 [Live API Get Started 指令碼](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI.py) 中試用更多範例。
