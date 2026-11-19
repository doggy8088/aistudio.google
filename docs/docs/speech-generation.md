# 文字轉語音生成（TTS）

Gemini API 能運用 Gemini 的文字轉語音（TTS）生成功能，將文字輸入轉換為單一講者或多位講者的音訊。文字轉語音生成具備*[可控性](/docs/speech-generation/#controllable)*，也就是說，你可以結合結構化的輪次中繼資料（`speech_metadata`）與行內聲音標籤，引導音訊的*風格*、*口音*、*語速*與*語氣*。

這項 TTS 功能不同於 [Live API](/docs/live-api/) 提供的語音生成：Live API 是為互動式、非結構化的音訊以及多模態輸入與輸出所設計。Live API 擅長動態對話情境，而透過 Gemini API 的 TTS 則專為需要精確朗讀文字、並能細緻控制風格與聲音的場景量身打造，例如 Podcast 或有聲書的製作。

本指南說明如何使用 [Gemini 3.8 Flash TTS](/docs/models/gemini-3.8-flash-tts/)（`gemini-3.8-flash-tts`）與 [Gemini 3.8 Flash-Lite TTS](/docs/models/gemini-3.8-flash-lite-tts/)（`gemini-3.8-flash-lite-tts`），從文字生成單一講者與多位講者的音訊。

## 開始之前 {#before-you-begin}

請確認你使用的是[支援的模型](/docs/speech-generation/#supported-models)一節所列的 Gemini TTS 模型，並升級至最新版 Google GenAI SDK（Python 版為 `google-genai >= 2.25.0`，JavaScript/TypeScript 版為 `@google/genai >= 2.24.0`），或改用 REST API。為獲得最佳效果，建議先參閱[何時該用哪個模型](/docs/speech-generation/#when-to-use-which-model)，為你的工作負載挑選最合適的模型。

在動手開發之前，你可能會想先[在 AI Studio 中測試 Gemini TTS 模型](https://aistudio.google.com/generate-speech)。

!!! note " "

      TTS 模型僅接受文字輸入，並僅產生音訊輸出。如需 TTS 模型專屬限制的完整清單，請參閱[限制](/docs/speech-generation/#limitations)一節。


## 單一講者 TTS {#single-speaker}

若要使用 Gemini 3.8 TTS 模型將文字轉換為單一講者音訊，請在 `input` 中傳入逐字稿，透過 `speech_metadata` 註記附加輪次層級的風格設定，並在 `generation_config.speech_config` 中設定你的聲音。你可以從預建的[聲音選項](/docs/speech-generation/#voices)、Extended Voice Library（`GET /v1beta/voices`）、自訂的 [Voice design](/docs/voice-design/) 或 [Voice remixing](/docs/voice-remixing/) ID（`voice_...`），或是 [Voice replication](/docs/voice-replication/) ID（`voice_...`，或選用的無狀態 `voicekey_...`）中挑選聲音。

以下範例會將模型輸出的音訊儲存為 WAV 檔案：

=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          model="gemini-3.8-flash-tts",
          input=[{
              "type": "user_input",
              "content": [{
                  "type": "text",
                  "text": "Have a wonderful day!",
                  "annotations": [{
                      "type": "speech_metadata",
                      "style": "cheerful and friendly",
                  }],
              }],
          }],
          response_format={"type": "audio"},
          generation_config={
              "speech_config": [
                  {"voice": "Kore"},
              ]
          },
      )

      with open("out.wav", "wb") as f:
          f.write(base64.b64decode(interaction.output_audio.data))
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';
      import * as fs from 'node:fs';

      async function main() {
         const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

         const interaction = await client.interactions.create({
            model: 'gemini-3.8-flash-tts',
            input: [{
               type: 'user_input',
               content: [{
                  type: 'text',
                  text: 'Have a wonderful day!',
                  annotations: [{
                     type: 'speech_metadata',
                     style: 'cheerful and friendly',
                  }],
               }],
            }],
            response_format: { type: 'audio' },
            generation_config: {
               speech_config: [
                  { voice: 'Kore' },
               ],
            },
         });

         if (interaction.output_audio?.data) {
            const audioBuffer = Buffer.from(interaction.output_audio.data, 'base64');
            fs.writeFileSync('out.wav', audioBuffer);
         }
      }
      await main();
      ```

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-3.8-flash-tts",
          "input": [{
            "type": "user_input",
            "content": [{
              "type": "text",
              "text": "Have a wonderful day!",
              "annotations": [{
                "type": "speech_metadata",
                "style": "cheerful and friendly"
              }]
            }]
          }],
          "response_format": {
             "type": "audio"
           },
          "generation_config": {
            "speech_config": [
              { "voice": "Kore" }
            ]
          }
        }' | jq -r '[.steps[] | select(.type=="model_output") | .content[] | select(.type=="audio")] | last | .data' | base64 --decode > out.wav
      ```

=== "CLI"

      ```bash
      # Note: tts does not send speech_metadata style annotations.
      gemini-api tts 'Have a wonderful day!' --voice Kore --out out.wav
      ```


在 Python 與 JavaScript SDK 中，你可以透過 `interaction.output_audio` 這個便利屬性取得生成的音訊資料，它會回傳最後一個生成的音訊區塊（在原始 REST JSON 回應中，base64 編碼的音訊儲存在 `steps[].content[].data`）。

## 多位講者 TTS {#multi-speaker}

若要生成多位講者的對話，請在 `speech_config.speakers` 中設定兩位講者，並將每個輪次作為獨立的文字項目傳入，各自附上 `speech_metadata` 註記，指定 `speaker` 以及選用的輪次層級 `style`。請注意，`speech_config` 在單一講者生成時接受陣列（`[{"voice": "..."}]`），在多位講者生成時則接受物件（`{"speakers": [...]}`）：

=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          model="gemini-3.8-flash-tts",
          input=[{
              "type": "user_input",
              "content": [
                  {
                      "type": "text",
                      "text": "How's it going today Jane?",
                      "annotations": [{
                          "type": "speech_metadata",
                          "speaker": "Joe",
                          "style": "cheerful and friendly",
                      }],
                  },
                  {
                      "type": "text",
                      "text": "Not too bad, how about you? Ready to test these new voices?",
                      "annotations": [{
                          "type": "speech_metadata",
                          "speaker": "Jane",
                          "style": "calm and relaxed",
                      }],
                  },
              ],
          }],
          response_format={"type": "audio"},
          generation_config={
              "speech_config": {
                  "speakers": [
                      {"speaker": "Joe", "voice": "Puck"},
                      {"speaker": "Jane", "voice": "Kore"},
                  ],
              }
          },
      )

      with open("out.wav", "wb") as f:
          f.write(base64.b64decode(interaction.output_audio.data))
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';
      import * as fs from 'node:fs';

      async function main() {
         const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

         const interaction = await client.interactions.create({
            model: 'gemini-3.8-flash-tts',
            input: [{
               type: 'user_input',
               content: [
                  {
                     type: 'text',
                     text: "How's it going today Jane?",
                     annotations: [{
                        type: 'speech_metadata',
                        speaker: 'Joe',
                        style: 'cheerful and friendly',
                     }],
                  },
                  {
                     type: 'text',
                     text: 'Not too bad, how about you? Ready to test these new voices?',
                     annotations: [{
                        type: 'speech_metadata',
                        speaker: 'Jane',
                        style: 'calm and relaxed',
                     }],
                  },
               ],
            }],
            response_format: { type: 'audio' },
            generation_config: {
               speech_config: {
                  speakers: [
                     { speaker: 'Joe', voice: 'Puck' },
                     { speaker: 'Jane', voice: 'Kore' },
                  ],
               },
            },
         });

         if (interaction.output_audio?.data) {
            const audioBuffer = Buffer.from(interaction.output_audio.data, 'base64');
            fs.writeFileSync('out.wav', audioBuffer);
         }
      }

      await main();
      ```

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
        "model": "gemini-3.8-flash-tts",
        "input": [{
          "type": "user_input",
          "content": [
            {
              "type": "text",
              "text": "How'\''s it going today Jane?",
              "annotations": [{
                "type": "speech_metadata",
                "speaker": "Joe",
                "style": "cheerful and friendly"
              }]
            },
            {
              "type": "text",
              "text": "Not too bad, how about you? Ready to test these new voices?",
              "annotations": [{
                "type": "speech_metadata",
                "speaker": "Jane",
                "style": "calm and relaxed"
              }]
            }
          ]
        }],
        "response_format": {
             "type": "audio"
           },
        "generation_config": {
          "speech_config": {
            "speakers": [
              { "speaker": "Joe", "voice": "Puck" },
              { "speaker": "Jane", "voice": "Kore" }
            ]
          }
        }
      }'
      ```

=== "CLI"

      ```bash
      # Note: tts does not send per-turn speech_metadata style annotations.
      gemini-api tts "Joe: How's it going today Jane? Jane: Not too bad, how about you? Ready to test these new voices?" \
        --multi-speaker "Joe=Puck,Jane=Kore" --out out.wav
      ```


## 透過中繼資料與標籤控制語音風格 {#controllable}

Gemini 3.8 TTS 嚴格將 `text` 欄位視為逐字稿。若想控制朗讀方式、又不想讓舞台指示被唸出來，請依作用範圍拆分你的指示：

*   **持續性的輪次層級朗讀方式（`speech_metadata.style`）**：將適用於整個輪次的情緒、朗讀風格、韻律、語速與音量放入 `style` 欄位（例如 `"style": "whispered urgently"`、`"style": "out of breath"`，或 `"style": "warm and enthusiastic"`）。
*   **特定時間點的事件（行內標籤）**：使用角括號，將瞬間的非語音聲音或停頓直接放進逐字稿中（例如 `"Wait... <short pause> did you hear that? <sigh>"` 或 `"Excuse me <cough> as I was saying..."`）。

完整的最佳實務請參閱[提示詞指南](/docs/speech-generation/#prompting-guide)。

=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          model="gemini-3.8-flash-tts",
          input=[{
              "type": "user_input",
              "content": [
                  {
                      "type": "text",
                      "text": "Wait... <short pause> look under that fallen log! Is that a blue-spotted salamander?",
                      "annotations": [{
                          "type": "speech_metadata",
                          "speaker": "Dr. Anya",
                          "style": "whispered urgently",
                      }],
                  },
                  {
                      "type": "text",
                      "text": "<gasp> No way! <laugh> We've been searching for this species all season!",
                      "annotations": [{
                          "type": "speech_metadata",
                          "speaker": "Liam",
                          "style": "warm and enthusiastic",
                      }],
                  },
              ],
          }],
          response_format={"type": "audio"},
          generation_config={
              "speech_config": {
                  "speakers": [
                      {"speaker": "Dr. Anya", "voice": "Kore"},
                      {"speaker": "Liam", "voice": "Puck"},
                  ],
              }
          },
      )

      with open("out.wav", "wb") as f:
          f.write(base64.b64decode(interaction.output_audio.data))
      ```

=== "JavaScript"

      ```javascript
      import * as fs from 'node:fs';
      import {GoogleGenAI} from '@google/genai';

      async function main() {
         const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

         const interaction = await client.interactions.create({
            model: 'gemini-3.8-flash-tts',
            input: [{
               type: 'user_input',
               content: [
                  {
                     type: 'text',
                     text: 'Wait... <short pause> look under that fallen log! Is that a blue-spotted salamander?',
                     annotations: [{
                        type: 'speech_metadata',
                        speaker: 'Dr. Anya',
                        style: 'whispered urgently',
                     }],
                  },
                  {
                     type: 'text',
                     text: "<gasp> No way! <laugh> We've been searching for this species all season!",
                     annotations: [{
                        type: 'speech_metadata',
                        speaker: 'Liam',
                        style: 'warm and enthusiastic',
                     }],
                  },
               ],
            }],
            response_format: { type: 'audio' },
            generation_config: {
               speech_config: {
                  speakers: [
                     { speaker: 'Dr. Anya', voice: 'Kore' },
                     { speaker: 'Liam', voice: 'Puck' },
                  ],
               },
            },
         });

         if (interaction.output_audio?.data) {
            const audioBuffer = Buffer.from(interaction.output_audio.data, 'base64');
            fs.writeFileSync('out.wav', audioBuffer);
         }
      }

      await main();
      ```

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-3.8-flash-tts",
          "input": [{
            "type": "user_input",
            "content": [
              {
                "type": "text",
                "text": "Wait... <short pause> look under that fallen log! Is that a blue-spotted salamander?",
                "annotations": [{
                  "type": "speech_metadata",
                  "speaker": "Dr. Anya",
                  "style": "whispered urgently"
                }]
              },
              {
                "type": "text",
                "text": "<gasp> No way! <laugh> We'\''ve been searching for this species all season!",
                "annotations": [{
                  "type": "speech_metadata",
                  "speaker": "Liam",
                  "style": "warm and enthusiastic"
                }]
              }
            ]
          }],
          "response_format": {
            "type": "audio"
          },
          "generation_config": {
            "speech_config": {
              "speakers": [
                { "speaker": "Dr. Anya", "voice": "Kore" },
                { "speaker": "Liam", "voice": "Puck" }
              ]
            }
          }
        }'
      ```


## 串流語音生成 {#streaming}

只要設定 `stream: true`，就能在音訊合成的同時串流傳輸生成的音訊。與一元請求（回傳帶有 RIFF 標頭的完整 WAV 檔案）不同，**串流請求預設回傳無標頭的原始 16 位元有符號小端序線性 PCM（`audio/l16`、24 kHz、單聲道）區塊**，讓音訊區塊能連續播放或串接，無需容器標頭。

=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      stream = client.interactions.create(
          model="gemini-3.8-flash-tts",
          input=[{
              "type": "user_input",
              "content": [{
                  "type": "text",
                  "text": "Have a wonderful day!",
                  "annotations": [{
                      "type": "speech_metadata",
                      "style": "cheerful and friendly",
                  }],
              }],
          }],
          response_format={"type": "audio"},
          generation_config={
              "speech_config": [
                  {"voice": "Kore"},
              ]
          },
          stream=True,
      )

      for event in stream:
          if event.event_type == "step.delta":
              if event.delta.type == "audio":
                  audio_data = base64.b64decode(event.delta.data)
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      async function main() {
         const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

         const stream = await client.interactions.create({
            model: 'gemini-3.8-flash-tts',
            input: [{
               type: 'user_input',
               content: [{
                  type: 'text',
                  text: 'Have a wonderful day!',
                  annotations: [{
                     type: 'speech_metadata',
                     style: 'cheerful and friendly',
                  }],
               }],
            }],
            response_format: { type: 'audio' },
            generation_config: {
               speech_config: [
                  { voice: 'Kore' },
               ],
            },
            stream: true,
         });

         for await (const event of stream) {
            if (event.event_type === 'step.delta') {
               if (event.delta.type === 'audio' && event.delta.data) {
                  const audioBuffer = Buffer.from(event.delta.data, 'base64');
                  // Process the audio buffer
               }
            }
         }
      }
      await main();
      ```

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        --no-buffer \
        -d '{
          "model": "gemini-3.8-flash-tts",
          "input": [{
            "type": "user_input",
            "content": [{
              "type": "text",
              "text": "Have a wonderful day!",
              "annotations": [{
                "type": "speech_metadata",
                "style": "cheerful and friendly"
              }]
            }]
          }],
          "response_format": {
            "type": "audio"
          },
          "generation_config": {
            "speech_config": [
              { "voice": "Kore" }
            ]
          },
          "stream": true
        }'
      ```


## 音訊輸出格式 {#audio-output-formats}

Gemini 3.8 TTS 模型會依請求是一元還是串流，採用不同的預設音訊格式：

*   **一元請求（`stream=False`）**：回傳帶有 RIFF 標頭的完整 **WAV（`audio/wav`）**音訊（24 kHz、單聲道、16 位元有符號小端序 PCM）。你可以直接將解碼後的 base64 位元組寫入 `.wav` 檔案，無需手動加上 WAV 容器。
*   **串流請求（`stream=True`）**：預設回傳**無標頭的原始線性 PCM（`audio/l16`）**區塊（24 kHz、單聲道、16 位元有符號小端序 PCM），讓區塊能連續串流或串接，每個區塊都無需容器標頭。

你可以在 `response_format` 中覆寫輸出音訊的編碼與取樣率：

| `mime_type` 值 | 格式 | 說明 |
| :--- | :--- | :--- |
| `"audio/wav"` *(unary default)* | WAV | 帶有 RIFF 標頭的完整 WAV 檔案（24 kHz、單聲道、16 位元 PCM）。 |
| `"audio/l16"` *(streaming default)* | Linear PCM | 無標頭的原始 16 位元有符號小端序線性 PCM（24 kHz、單聲道）。串流請求的預設格式。 |
| `"audio/mulaw"` | μ-law | G.711 μ-law 壓擴音訊。常用於北美與日本的電話系統（8 kHz）。 |
| `"audio/alaw"` | A-law | G.711 A-law 壓擴音訊。常用於歐洲與國際電話系統（8 kHz）。 |

你也可以選擇性地指定 `sample_rate`（例如 `24000`、`16000` 或 `8000` Hz；預設為 `24000` Hz）。

以下範例要求以 24 kHz 輸出無標頭的原始 16 位元 PCM（`audio/l16`）：

=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          model="gemini-3.8-flash-tts",
          input=[{
              "type": "user_input",
              "content": [{
                  "type": "text",
                  "text": "Have a wonderful day!",
                  "annotations": [{
                      "type": "speech_metadata",
                      "style": "cheerful and friendly",
                  }],
              }],
          }],
          response_format={
              "type": "audio",
              "mime_type": "audio/l16",
              "sample_rate": 24000,
          },
          generation_config={
              "speech_config": [
                  {"voice": "Kore"},
              ]
          },
      )

      with open("out.pcm", "wb") as f:
          f.write(base64.b64decode(interaction.output_audio.data))
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';
      import * as fs from 'node:fs';

      async function main() {
         const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

         const interaction = await client.interactions.create({
            model: 'gemini-3.8-flash-tts',
            input: [{
               type: 'user_input',
               content: [{
                  type: 'text',
                  text: 'Have a wonderful day!',
                  annotations: [{
                     type: 'speech_metadata',
                     style: 'cheerful and friendly',
                  }],
               }],
            }],
            response_format: {
               type: 'audio',
               mime_type: 'audio/l16',
               sample_rate: 24000,
            },
            generation_config: {
               speech_config: [
                  { voice: 'Kore' },
               ],
            },
         });

         if (interaction.output_audio?.data) {
            const audioBuffer = Buffer.from(interaction.output_audio.data, 'base64');
            fs.writeFileSync('out.pcm', audioBuffer);
         }
      }
      await main();
      ```

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-3.8-flash-tts",
          "input": [{
            "type": "user_input",
            "content": [{
              "type": "text",
              "text": "Have a wonderful day!",
              "annotations": [{
                "type": "speech_metadata",
                "style": "cheerful and friendly"
              }]
            }]
          }],
          "response_format": {
            "type": "audio",
            "mime_type": "audio/l16",
            "sample_rate": 24000
          },
          "generation_config": {
            "speech_config": [
              { "voice": "Kore" }
            ]
          }
        }'
      ```


## 聲音選項 {#voices}

Gemini 3.8 TTS 支援五種挑選或建立聲音的方式：

1.  **預建工作室聲音**：下表所列的 30 個精選聲音。
2.  **Extended Voice Library**：涵蓋多種語言、口音與角色原型的數百個額外聲音，可透過 `client.voices.list()`（`GET /v1beta/voices`）取用。
3.  **[Voice design](/docs/voice-design/)**：在 [Google AI Studio](https://aistudio.google.com/generate-speech) 中，或透過 `POST /v1beta/voices`（`type="prompted"`，會回傳持久性的 `voice_...` ID 與 `sample_audio` WAV 預覽，見 `CreateVoice` 與 `GetVoice`），以自然語言描述生成自訂的聲音角色。
4.  **[Voice replication](/docs/voice-replication/)**：在 [Google AI Studio](https://aistudio.google.com/generate-speech) 中，或透過 `POST /v1beta/voices`（`type="replicated"`，預設為持久性的 `store=True`，或可選用無狀態的 `store=False`），從參考音訊與同意音訊複製講者的聲音。
5.  **[Voice remixing](/docs/voice-remixing/)**：以自然語言指示修改預建或設計好的 `base_voice`，可在 [Google AI Studio](https://aistudio.google.com/generate-speech) 中進行，或透過 `POST /v1beta/voices`（`type="prompted"`、`prompted.base_voice`，會儲存一個新的獨立 `voice_...` 資源，並回傳 `sample_audio` WAV 預覽）。

### 自訂聲音的限制與 TTL {#custom-voice-limits}

| 聲音類型 | 儲存模式 | 配額／限制 | 保留期限（TTL） |
| :--- | :--- | :--- | :--- |
| **有狀態聲音**（`voice_...`，prompted 或 replicated） | `store=True` | **每個專案 200 個聲音**（prompted 與 replicated 聲音共用） | **自最後一次使用起 1 年*** |
| **無狀態聲音金鑰**（`voicekey_...`，replicated） | `store=False` | 由用戶端管理 | **7 天** |

* **TTL 延長**：每當聲音被實際使用（無論是用該聲音合成語音，或將其作為混音的基礎聲音），1 年的保留期限就會重新起算。閒置滿 1 年的聲音會自動刪除。

### 預建聲音 {#prebuilt-voices}


| **Zephyr** -- *Bright* | **Puck** -- *Upbeat* | **Charon** -- *Informative* |
| --- | --- | --- |
| **Kore** -- *Firm* | **Fenrir** -- *Excitable* | **Leda** -- *Youthful* |
| **Orus** -- *Firm* | **Aoede** -- *Breezy* | **Callirrhoe** -- *Easy-going* |
| **Autonoe** -- *Bright* | **Enceladus** -- *Breathy* | **Iapetus** -- *Clear* |
| **Umbriel** -- *Easy-going* | **Algieba** -- *Smooth* | **Despina** -- *Smooth* |
| **Erinome** -- *Clear* | **Algenib** -- *Gravelly* | **Rasalgethi** -- *Informative* |
| **Laomedeia** -- *Upbeat* | **Achernar** -- *Soft* | **Alnilam** -- *Firm* |
| **Schedar** -- *Even* | **Gacrux** -- *Mature* | **Pulcherrima** -- *Forward* |
| **Achird** -- *Friendly* | **Zubenelgenubi** -- *Casual* | **Vindemiatrix** -- *Gentle* |
| **Sadachbia** -- *Lively* | **Sadaltager** -- *Knowledgeable* | **Sulafat** -- *Warm* |


### Extended Voice Library 與篩選 {#voice-library}

除了上表精選的 30 個工作室聲音之外，**Extended Voice Library** 還提供數百個涵蓋不同語言、地區口音、角色形象與應用領域的額外聲音。你可以在 [Google AI Studio](https://aistudio.google.com/generate-speech) 中以互動方式瀏覽、篩選並試聽完整的 Voice Library，也能透過 `client.voices.list()`（`GET /v1beta/voices`，使用 `google-genai` 2.25.0+ / `@google/genai` 2.24.0+）以程式方式查詢。

`ListVoices` 會先回傳你儲存的自訂聲音（由新到舊排序），接著回傳符合篩選條件的預建目錄聲音。當某個清單型篩選條件傳入多個值時，符合該條件中**任一**值的聲音都會被回傳（`OR`），而不同的篩選參數之間則以 `AND` 組合：

| 參數 | 類型 | 說明 |
| :--- | :--- | :--- |
| `language_code` | `list[str]` | BCP-47 語言標籤（例如 `["en-US", "en-GB"]`）。不區分大小寫的完全比對。 |
| `region_code` | `list[str]` | ISO 3166-1 alpha-2 或 UN M.49 地區代碼（例如 `["US", "GB"]`）。 |
| `accent` | `list[str]` | 地區口音描述（例如 `["American", "British"]`）。 |
| `gender` | `list[str]` | 感知上的性別呈現（`"female"`、`"male"` 或 `"neutral"`）。 |
| `pitch` | `list[str]` | 音高分類（`"low"`、`"medium"` 或 `"high"`）。 |
| `persona` | `list[str]` | 聲音角色或人物原型（例如 `["Warm, Friendly"]`、`["Narrator"]`）。 |
| `contexts`（REST 中為 `context`） | `list[str]` | 最適合的使用領域（例如 `["Audiobook", "Conversational", "News"]`）。 |
| `type`（Python 中為 `type_`） | `list[str]` | 依聲音來源篩選：`"prebuilt"`、`"prompted"`（[Voice design](/docs/voice-design/) 與 [Voice remixing](/docs/voice-remixing/)），或 `"replicated"`（[Voice replication](/docs/voice-replication/)）。 |
| `search` | `str` | 自由文字子字串搜尋，不區分大小寫地比對 `display_name` 與 `description`。 |
| `page_size` | `int` | 每頁回傳的聲音數量上限（預設 `50`，最大 `1000`）。 |
| `page_token` | `str` | 來自 `response.next_page_token` 的權杖，用於取得下一頁結果。 |

=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # Filter the Voice Library by language, gender, pitch, domain context, and keyword
      response = client.voices.list(
          language_code=["en-US", "en-GB"],
          gender=["female"],
          pitch=["medium", "low"],
          contexts=["Audiobook", "Conversational"],
          type_=["prebuilt"],
          search="warm",
          page_size=50,
      )

      for voice in response.voices or []:
          print(
              f"{voice.id} | {voice.display_name} ({voice.language_code},"
              f" {voice.accent}, {voice.gender}, pitch={voice.pitch}):"
              f" {voice.description}"
          )
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      // Filter the Voice Library by language, gender, pitch, domain context, and keyword
      const response = await ai.voices.list({
        language_code: ["en-US", "en-GB"],
        gender: ["female"],
        pitch: ["medium", "low"],
        contexts: ["Audiobook", "Conversational"],
        type: ["prebuilt"],
        search: "warm",
        page_size: 50,
      });

      for (const voice of response.voices ?? []) {
        console.log(
          `${voice.id} | ${voice.display_name} (${voice.language_code}, ${voice.accent}, ${voice.gender}, pitch=${voice.pitch}): ${voice.description}`
        );
      }
      ```

=== "REST"

      ```sh
      curl -G "https://generativelanguage.googleapis.com/v1beta/voices" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        --data-urlencode "language_code=en-US" \
        --data-urlencode "language_code=en-GB" \
        --data-urlencode "gender=female" \
        --data-urlencode "pitch=medium" \
        --data-urlencode "context=Audiobook" \
        --data-urlencode "type=prebuilt" \
        --data-urlencode "search=warm" \
        --data-urlencode "page_size=50"
      ```


## 支援的語言 {#languages}

TTS 模型會自動偵測輸入語言。[Gemini 3.8 Flash TTS](/docs/models/gemini-3.8-flash-tts/)（`gemini-3.8-flash-tts`）支援 **130 多種語言**，[Gemini 3.8 Flash-Lite TTS](/docs/models/gemini-3.8-flash-lite-tts/)（`gemini-3.8-flash-lite-tts`）則支援 **100 多種語言**：

| 語言 | Gemini 3.8 Flash TTS | Gemini 3.8 Flash-Lite TTS |
| :--- | :--- | :--- |
| Acehnese (Arab script) | ✔️ | ✔️ |
| Afrikaans | ✔️ | ✔️ |
| Akan | ✔️ | ✔️ |
| Amharic | ✔️ | ✔️ |
| Armenian | ✔️ | ✔️ |
| Assamese | ✔️ | ✔️ |
| Awadhi | ✔️ | ✔️ |
| Balinese | ✔️ | ✔️ |
| Bangla | ✔️ | ✔️ |
| Banjar (Arab script) | ✔️ | — |
| Banjar (Latn script) | ✔️ | ✔️ |
| Bashkir | ✔️ | — |
| Basque | ✔️ | ✔️ |
| Belarusian | ✔️ | ✔️ |
| Bemba | ✔️ | — |
| Bhojpuri | ✔️ | ✔️ |
| Bosnian | ✔️ | ✔️ |
| Buginese | ✔️ | ✔️ |
| Bulgarian | ✔️ | ✔️ |
| Burmese | ✔️ | — |
| Cantonese | ✔️ | ✔️ |
| Catalan | ✔️ | ✔️ |
| Cebuano | ✔️ | ✔️ |
| Central Kurdish | ✔️ | ✔️ |
| Chhattisgarhi | ✔️ | ✔️ |
| Chinese (Hans script) | ✔️ | ✔️ |
| Chinese (Hant script) | ✔️ | ✔️ |
| Crimean Tatar | ✔️ | — |
| Croatian | ✔️ | ✔️ |
| Czech | ✔️ | ✔️ |
| Danish | ✔️ | ✔️ |
| Dutch | ✔️ | ✔️ |
| Dyula | ✔️ | — |
| Dzongkha | ✔️ | — |
| Egyptian Arabic | ✔️ | ✔️ |
| English | ✔️ | ✔️ |
| Estonian | ✔️ | ✔️ |
| Filipino | ✔️ | ✔️ |
| Finnish | ✔️ | — |
| French | ✔️ | ✔️ |
| Galician | ✔️ | ✔️ |
| Ganda | ✔️ | ✔️ |
| Georgian | ✔️ | ✔️ |
| German | ✔️ | ✔️ |
| Greek | ✔️ | ✔️ |
| Guarani | ✔️ | — |
| Gujarati | ✔️ | ✔️ |
| Haitian Creole | ✔️ | ✔️ |
| Halh Mongolian | ✔️ | ✔️ |
| Hausa | ✔️ | ✔️ |
| Hebrew | ✔️ | ✔️ |
| Hindi | ✔️ | ✔️ |
| Hungarian | ✔️ | ✔️ |
| Icelandic | ✔️ | ✔️ |
| Igbo | ✔️ | — |
| Iloko | ✔️ | ✔️ |
| Indonesian | ✔️ | ✔️ |
| Iranian Persian | ✔️ | ✔️ |
| Italian | ✔️ | ✔️ |
| Japanese | ✔️ | ✔️ |
| Javanese | ✔️ | ✔️ |
| Kabyle | ✔️ | — |
| Kamba | ✔️ | ✔️ |
| Kannada | ✔️ | ✔️ |
| Kashmiri (Arab script) | ✔️ | ✔️ |
| Kashmiri (Deva script) | ✔️ | ✔️ |
| Kazakh | ✔️ | ✔️ |
| Khmer | ✔️ | ✔️ |
| Kikuyu | ✔️ | ✔️ |
| Kinyarwanda | ✔️ | ✔️ |
| Kongo | ✔️ | ✔️ |
| Korean | ✔️ | ✔️ |
| Kyrgyz | ✔️ | ✔️ |
| Lao | ✔️ | ✔️ |
| Latgalian | ✔️ | — |
| Lingala | ✔️ | ✔️ |
| Lithuanian | ✔️ | — |
| Luxembourgish | ✔️ | — |
| Macedonian | ✔️ | ✔️ |
| Magahi | ✔️ | ✔️ |
| Maithili | ✔️ | ✔️ |
| Malayalam | ✔️ | ✔️ |
| Maltese | ✔️ | ✔️ |
| Manipuri | ✔️ | ✔️ |
| Marathi | ✔️ | ✔️ |
| Minangkabau (Arab script) | ✔️ | ✔️ |
| Minangkabau (Latn script) | ✔️ | — |
| Mizo | ✔️ | ✔️ |
| Nepali (individual language) | ✔️ | ✔️ |
| Nigerian Fulfulde | ✔️ | ✔️ |
| North Azerbaijani | ✔️ | ✔️ |
| Northern Sotho | ✔️ | ✔️ |
| Northern Uzbek | ✔️ | ✔️ |
| Norwegian Bokmål | ✔️ | ✔️ |
| Norwegian Nynorsk | ✔️ | ✔️ |
| Nyanja | ✔️ | ✔️ |
| Occitan | ✔️ | — |
| Odia (individual language) | ✔️ | ✔️ |
| Pangasinan | ✔️ | — |
| Persian (Afghanistan) | ✔️ | ✔️ |
| Polish | ✔️ | ✔️ |
| Portuguese | ✔️ | ✔️ |
| Punjabi | ✔️ | ✔️ |
| Romanian | ✔️ | ✔️ |
| Russian | ✔️ | ✔️ |
| Santali | ✔️ | ✔️ |
| Serbian | ✔️ | ✔️ |
| Sindhi | ✔️ | — |
| Sinhala | ✔️ | ✔️ |
| Slovak | ✔️ | ✔️ |
| Slovenian | ✔️ | — |
| Somali | ✔️ | — |
| South Azerbaijani | ✔️ | ✔️ |
| Southern Pashto | ✔️ | ✔️ |
| Southern Sotho | ✔️ | — |
| Spanish | ✔️ | ✔️ |
| Standard Arabic (Arab script) | ✔️ | ✔️ |
| Standard Arabic (Latn script) | ✔️ | ✔️ |
| Standard Latvian | ✔️ | ✔️ |
| Standard Malay | ✔️ | ✔️ |
| Swahili (individual language) | ✔️ | — |
| Swati | ✔️ | — |
| Swedish | ✔️ | — |
| Tajik | ✔️ | — |
| Tamil | ✔️ | ✔️ |
| Telugu | ✔️ | ✔️ |
| Thai | ✔️ | — |
| Tigrinya | ✔️ | — |
| Tosk Albanian | ✔️ | — |
| Turkish | ✔️ | ✔️ |
| Uyghur | ✔️ | — |
| Vietnamese | ✔️ | ✔️ |

## 支援的模型 {#supported-models}

| 模型 | 單一講者 | 多位講者 | Voice design | Voice replication | Voice remixing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [Gemini 3.8 Flash TTS](/docs/models/gemini-3.8-flash-tts/) (`gemini-3.8-flash-tts`) | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| [Gemini 3.8 Flash-Lite TTS](/docs/models/gemini-3.8-flash-lite-tts/) (`gemini-3.8-flash-lite-tts`) | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| [Gemini 3.1 Flash TTS Preview](/docs/models/gemini-3.1-flash-tts-preview/) | ✔️ | ✔️ | — | — | — |
| [Gemini 2.5 Pro Preview TTS](/docs/models/gemini-2.5-pro-preview-tts/) | ✔️ | ✔️ | — | — | — |

### 何時該用哪個模型 {#when-to-use-which-model}

兩個 Gemini 3.8 TTS 模型共用完全相同的 API 結構定義與提示詞格式，只需更改一個參數就能互相切換：

*   **使用 [Gemini 3.8 Flash TTS](/docs/models/gemini-3.8-flash-tts/)（`gemini-3.8-flash-tts`）**：當最高音質保真度、細膩的演繹與豐富的表現控制是首要考量時。它非常適合錄音室等級的創意作品、複雜的多位講者對話、大量聲音爆發標籤、困難的發音、地區或少數方言，以及需要極為穩定的聲音與環境音調的長篇旁白。
*   **使用 [Gemini 3.8 Flash-Lite TTS](/docs/models/gemini-3.8-flash-lite-tts/)（`gemini-3.8-flash-lite-tts`）**：作為快速且具成本效益的主力，取代 `gemini-3.1-flash-tts-preview`。它針對大批量製作、對話式語音代理串接、朗讀功能、可靠的聲音複製，以及主要語言的日常單一講者語音進行了最佳化。

### 遷移指南 {#migration}

從早期的預覽模型（`gemini-3.1-flash-tts-preview` 或 `gemini-2.5-pro-preview-tts`）升級至 Gemini 3.8 TTS（`gemini-3.8-flash-tts` 或 `gemini-3.8-flash-lite-tts`）時，請留意以下五項關鍵變更：

1.  **將風格與逐字稿分開**：把持續性的演繹、語氣、韻律與語速指示（例如 `"whispering"`、`"out of breath"` 或 `"speaking slowly"`）從純文字中移出，放入 `speech_metadata.style`。`text` 應嚴格只保留逐字稿加上行內聲音標籤。
2.  **先用 Voice design 設計角色**：以在 [Voice design](/docs/voice-design/) 中建立的自訂聲音，取代多段落的 `"Audio Profile"` 或 `"Director's Notes"` 區塊，然後在你的 TTS 請求中沿用該 `voice_...` ID，並將 `style` 字串保持在最少或留空。
3.  **使用結構化的對話輪次**：對於多位講者對話，每位講者的每個輪次傳入一個 `content` 項目並附上 `speech_metadata.speaker`，不要再把 `Speaker: ...` 前綴嵌入單一文字區塊中。
4.  **行內聲音標籤使用角括號**：以角括號（`<laugh>`、`<sigh>`、`<cough>`、`<breath>`、`<short pause>`）標示特定時間點的人聲與停頓。避免使用非人聲的音效標籤（例如掌聲或重擊聲）。
5.  **留意一元請求預設輸出 WAV（`audio/wav`）**：與 `gemini-3.1-flash-tts-preview`（預設回傳無標頭的原始 PCM `audio/l16`）不同，Gemini 3.8 TTS 模型在一元請求時回傳帶有 RIFF 標頭的完整 **WAV（`audio/wav`）**音訊（24 kHz、單聲道、16 位元 PCM）。你可以直接將解碼後的音訊位元組寫入 `.wav` 檔案，無需再用 Python 的 `wave` 模組或 Node 的 `wav` 套件手動包裝。如果既有的管線預期的是無標頭原始 PCM、mu-law 或 A-law 音訊，請明確將 `response_format.mime_type` 設為 `"audio/l16"`、`"audio/mulaw"` 或 `"audio/alaw"`（例如在 Interactions API 中使用 `{"response_format":
    {"type": "audio", "mime_type": "audio/l16"}}`，或 `AUDIO_L16`（用於
    `generateContent`）；請參閱
    [音訊輸出格式](/docs/speech-generation/#audio-output-formats)）。

## 提示詞指南 {#prompting-guide}

Gemini 3.8 TTS 模型嚴格將輸入文字視為**逐字稿**。與早期預覽模型將舞台指示嵌入純文字的做法不同，Gemini 3.8 TTS 將持續性的輪次層級指示（`speech_metadata`）與特定時間點的行內聲音標籤分開處理。

### style 欄位與行內標籤的區別 {#style-vs-inline-tags}

請依作用範圍拆分你的演繹指示：

*   **輪次層級的朗讀方式（`speech_metadata.style`）**：將持續性的朗讀屬性，例如情緒、韻律、整體語速或朗讀風格（如 `"whispering"`、`"out of breath"`、`"muttering"` 或 `"sarcastic"`），放入 `style` 欄位（屬於 `speech_metadata`）。若要讓角色與演繹在各輪次間保持穩定，請先在 [Voice design](/docs/voice-design/) 中設計好角色，`style` 僅用於選用的輪次層級微調。
*   **特定時間點的事件（行內標籤）**：使用角括號（`<cough>`、`<breath>`、`<sigh>`、`<short pause>`），將瞬間的非語音聲音、呼吸或停頓直接放進逐字稿中。使用角括號（`<...>`）能獲得最佳音質，且應以人聲為主，不要使用非人聲的音效。

| 作用範圍 | 放置位置 | 範例 |
| :--- | :--- | :--- |
| **輪次層級**（在整個輪次中持續） | `speech_metadata.style` | `"angry tone"`, `"speaking rapidly"`, `"out of breath"`, `"whispers"`, `"sarcastic"` |
| **特定時間點**（發生在某個特定字詞處） | 行內放入 `text`（`<...>`） | `"<cough> Thank you all for coming tonight! <throat-clearing> As I was saying..."` |

### 語速與停頓 {#pacing-and-pauses}

你可以在三個層次上控制節奏與靜默：

*   **標點與刪節號**：使用逗號、破折號（`--`）與刪節號（`...`），營造自然的對話式遲疑。

*   **行內停頓標籤**：在腳本中需要停頓的確切位置插入 `<short pause>` 或 `<long pause>`：


    ```text
    Hold on, let me think... <short pause> Alright, I've got it.
    ```

*   **輪次層級語速**：設定 `"style": "speaking rapidly"` 或 `"style": "speaking slowly"` 於 `speech_metadata` 中，控制整個輪次的說話速度。


### 韻律與音高 {#prosody-and-pitch}

使用 **`speech_metadata.style`** 控制整個輪次的韻律、音高與語調（例如 `"style": "high pitch, cheerful and excited inflection"` 或 `"style": "monotone and flat"`）。如果情緒或韻律在對話中途發生變化，請將腳本拆成多個輪次，為每個輪次設定不同的 `style` 值。

### 強調 {#emphasis}

將逐字稿中的特定字詞大寫，再搭配標點與行內聲音標籤，就能為關鍵字詞加上自然的語音重音：


```text
This is a VERY important point!
It was a VERY long day <sigh> ... nobody listens anymore.
```

### 聲音爆發與非語音聲音 {#vocal-bursts}

使用角括號（`<...>`），將非語音的人聲直接放進逐字稿中聲音應出現的確切位置。建議使用的聲音標籤包括：


| `<argh>` | `<breath>` | `<heavy breath>` | `<exhales>` |
| --- | --- | --- | --- |
| `<cackle>` | `<cheer>` | `<chuckle>` / `<chuckles>` | `<cough>` |
| `<cry>` | `<gasp>` | `<giggle>` | `<groan>` |
| `<growl>` | `<grunt>` | `<grr>` | `<hiss>` |
| `<laugh>` / `<laughter>` | `<moan>` | `<pant>` | `<pff>` / `<phew>` |
| `<scream>` | `<shout>` | `<shriek>` | `<sigh>` / `<sighs>` |
| `<sneeze>` | `<snicker>` | `<snort>` | `<sob>` |
| `<throat-clearing>` | `<tsk>` | `<whimper>` | `<whispers>` / `<whispering>` |
| `<yawn>` | `<short pause>` | `<long pause>` |  |


!!! note " "

      如果你的逐字稿使用非英文語言，為獲得最佳效果，請繼續使用英文的行內標籤。


### 附和反應與重疊語音 {#backchannels}

在多位講者的對話中，將聽者的反應以直線字元包起來（`|reaction|`），放進某位講者的輪次裡，就能營造自然的附和反應或重疊語音，不必為每個反應另開一個輪次。

*   **簡短的附和交流**：將簡短的聽者反應（`|oh hmm|`、`|oh really?|`、`|absolutely|`）疊加在正在說話的講者輪次中：
    *   **輪次 1（講者 A）**：`"So the launch is Thursday |oh hmm| Are we actually ready?"`
    *   **輪次 2（講者 B）**：`"Ready enough |oh really?| The last blocker cleared this morning."`
    *   **輪次 3（講者 A）**：`"Then let's ship it |absolutely| and watch the dashboards."`

*   **重疊與交錯語音**：使用多個直線片段，模擬兩位講者同時或交錯說話（搭配 `gemini-3.8-flash-tts` 效果最佳）：
    *   **同時倒數／齊聲**：`"Let's surprise him on three |ok| ready?"` 接著 `"one. two. three. |happy| happy |birthday| birthday!"`
    *   **完全重疊的講者**：`"Hello |oh| there |my| it |goodness| must |gracious| be |would| almost |you| time |look| for |at that| dinner"`


### 跨次生成的一致性與應避免事項 {#consistency-and-what-to-avoid}

請遵循以下準則，讓聲音身分在各輪次間保持穩定：

*   **先在 Voice design 中設計角色，不要使用冗長的 style 區塊**：從早期模型沿用的長篇 `"Audio Profile"` 段落與多點條列的 `"Director's Notes"`，是造成聲音漂移最常見的原因。請先將同樣的創意直覺運用在 [Voice design](/docs/voice-design/) 中，生成持久性的自訂 `voice_...` 角色，然後在你的 TTS 呼叫中沿用該聲音 ID。
*   **仰賴聲音參考維持穩定（省略後設指示）**：Gemini 3.8 TTS 模型經過訓練，會優先以音訊參考為錨點。不要加入要求模型保持聲音穩定的指示（例如 `"do not switch speaker identity"` 或 `"maintain identical timbre"`），額外的提示詞文字反而會增加漂移。拿掉不必要的 style 指示，讓模型圍繞聲音參考提供的穩定點自然變化。
*   **不要試圖在 `style` 中改變不可變的講者特質**：避免在 `speech_metadata.style` 中放入年齡、性別、姓名或永久性的口音變更。改從 Extended Voice Library 挑選符合地區的聲音，或用 [Voice design](/docs/voice-design/) 建立一個。

### 建議的工作流程 {#recommended-workflow}

1.  **角色只建立一次**：在 [Voice design](/docs/voice-design/) 中建立你的角色，或從 Extended Voice Library 挑選符合目標語言與角色形象的地區聲音。
2.  **撰寫帶有不流暢語句的自然口語逐字稿**：為了達到最自然的效果，請將 `text` 寫成真實的口語逐字稿，包含自然的對話式不流暢與遲疑（例如 `"Oh uh yeah I think... hm, so that's interesting"`）。
3.  **先測試純 TTS**：先以空白的 `style` 欄位合成你的逐字稿，多數請求根本不需要任何 `style` 指示。
4.  **只在微調時加入簡短的 `style` 提示詞**：僅針對需要特定朗讀調整的輪次，加入簡潔的 `style` 字串（例如 `"casual, friendly"` 或 `"muttering, then reassuring"`）；若想維持一致的基調，請在各輪次間重複使用完全相同的簡短字串。

### 多輪對話與語音代理 {#multi-turn-and-voice-agents}

建構即時對話式語音代理或多輪應用程式時：

*   隨著 LLM 的文字區塊送達，**每個輪次呼叫一次 TTS**。
*   讓設定好的 `voice`（預建、設計好的 `voice_...`，或複製的 `voice_...` / `voicekey_...`）在各輪次間承載講者的身分，不要在每個輪次都重送冗長的角色描述。
*   將每輪的 `style` 欄位留空，或在整段對話中傳送同一個簡短的固定字串（例如 `"casual, friendly"`）。
*   將冗長的代理回應拆成較短的輪次，而不是訴諸更強烈的 style 提示詞。

## 限制 {#limitations}

*   TTS 模型僅接受文字輸入，並僅產生音訊輸出。
*   單一請求的多位講者生成（`speech_config.speakers`）最多支援 2 位使用預建聲音的講者。若要在多角色對話中結合自訂設計（`voice_...`）或複製（`voice_...` / `voicekey_...`）的聲音，請逐一合成每位講者的輪次。由於一元請求預設回傳帶有 44 位元組 RIFF 標頭的 `audio/wav`，在串接 24kHz PCM 音訊幀之前，請要求原始 PCM（`{"type": "audio", "mime_type": "audio/l16"}`），或先去除每個輪次的 WAV 標頭。
*   **自訂聲音的儲存限制與 TTL**：
    *   **有狀態聲音（`store=True`，prompted 或 replicated）**：每個專案最多 **200 個聲音**，**TTL**（存活時間）為 **1 年**。
    *   **無狀態聲音金鑰（`store=False`，`voicekey_...`）**：**TTL**（存活時間）為 **7 天**。

*   語言涵蓋範圍請參閱[支援的語言](/docs/speech-generation/#languages)一節。

## 後續步驟 {#whats-next}

*   運用 [Voice design](/docs/voice-design/)，以自然語言建立自訂的聲音角色。
*   在 [Voice replication](/docs/voice-replication/) 中複製既有講者的聲音。
*   運用 [Voice remixing](/docs/voice-remixing/)，編輯並精修預建或自訂聲音。
*   在 [Gemini 3.8 Flash TTS](/docs/models/gemini-3.8-flash-tts/) 與 [Gemini 3.8 Flash-Lite TTS](/docs/models/gemini-3.8-flash-lite-tts/) 模型頁面上比較模型規格。
*   透過 [Live API](/docs/live-api/) 探索互動式雙向音訊。
