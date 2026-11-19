# 使用 Gemini Live API 即時翻譯

Gemini Live API 支援以
[`gemini-3.5-live-translate-preview`](/docs/models/gemini-3.5-live-translate-preview/)
模型，在 70 多種語言之間進行低延遲的即時語音對語音翻譯。只要為 Live API 設定翻譯參數，你就能串流輸入一種語言的音訊，並收到另一種語言的翻譯音訊輸出，實現流暢的即時語音對語音翻譯。

[在 Google AI Studio 中試用 Live Translate](https://aistudio.google.com/live?model=gemini-3.5-live-translate-preview)

[從 GitHub 複製範例應用程式](https://github.com/google-gemini/gemini-live-api-examples)

[使用程式設計代理技能](/docs/coding-agents/#gemini-live-api-dev)

## Live 代理與 Live 翻譯的差異 {#live-agent-vs-live-translation}

兩者都使用 Live API，但 Live Translation 的心智模型與對話式即時代理互動不同。

| Live 代理 | Live 翻譯 |
| :--- | :--- |
| **模型扮演助理的角色。** 它會聆聽、推理，並代替你執行動作。 | **模型扮演口譯員的角色。** 它如同即時翻譯管線般運作。 |
| **採用輪流互動。** 仰賴停頓、意圖偵測，並處理插話。 | **採用連續串流處理。** 說話者講話時即同步翻譯，不等待輪次。 |
| **支援工具與代理。** 原生支援函式呼叫、Google 搜尋與指令。 | **僅支援翻譯。** 純粹的低延遲翻譯；支援以系統指令引導翻譯，但不支援工具。 |
| **完整多模態。** 支援文字、音訊、影片與圖片輸入。 | **音訊受限。** 輸入僅限音訊，以確保嚴格的即時延遲門檻。 |
| **細緻的設定。** 使用生成、語音、工具與系統指令等設定。 | **簡化的設定。** 設定 `target_language_code`、如 `echo_target_language` 等開關，以及選用的 `system_instruction`。 |

## 開始使用 {#get-started}

以下範例示範如何初始化用戶端，並以翻譯設定連線至 Live API。


=== "Python"

      ```python
      import asyncio
      from google import genai
      from google.genai import types

      client = genai.Client(http_options={"api_version": "v1beta"})

      model = "gemini-3.5-live-translate-preview"
      config = types.LiveConnectConfig(
          response_modalities=["AUDIO"],
          input_audio_transcription=types.AudioTranscriptionConfig(),
          output_audio_transcription=types.AudioTranscriptionConfig(),
          translation_config=types.TranslationConfig(
              target_language_code="pl",
              echo_target_language=True
          )
      )

      async def main():
          async with client.aio.live.connect(model=model, config=config) as session:
              print("Session started with translation")
              # Start receiving the translated audio stream
              async for response in session.receive():
                  if response.server_content:
                      if response.server_content.input_transcription:
                          print(f"Input transcript: {response.server_content.input_transcription.text}")
                      if response.server_content.output_transcription:
                          print(f"Output transcript: {response.server_content.output_transcription.text}")
                      if response.server_content.model_turn:
                          for part in response.server_content.model_turn.parts:
                              if part.inline_data:
                                  audio_data = part.inline_data.data
                                  # Play or process the translated audio chunk
                                  print(f"Received audio chunk ({len(audio_data)} bytes)")

      if __name__ == "__main__":
          asyncio.run(main())
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI, Modality } from '@google/genai';

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });
      const model = 'gemini-3.5-live-translate-preview';
      const config = {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          translationConfig: {
              targetLanguageCode: 'pl',
              echoTargetLanguage: true
          }
      };

      async function main() {
        const session = await ai.live.connect({
          model: model,
          config: config,
          callbacks: {
            onopen: () => console.debug('Opened'),
            onmessage: (message) => {
              const content = message.serverContent;
              if (content?.inputTranscription) {
                console.log('Input transcript:', content.inputTranscription.text);
              }
              if (content?.outputTranscription) {
                console.log('Output transcript:', content.outputTranscription.text);
              }
              if (content?.modelTurn?.parts) {
                for (const part of content.modelTurn.parts) {
                  if (part.inlineData) {
                    const audioData = part.inlineData.data;
                    // Play or process the translated audio chunk (base64 encoded)
                    console.debug(`Received audio chunk (${audioData.length} bytes)`);
                  }
                }
              }
            },
            onerror: (e) => console.debug('Error:', e.message),
            onclose: (e) => console.debug('Close:', e.reason),
          },
        });

        console.debug("Session started with translation");
      }

      await main();
      ```

=== "WebSockets"

      ```javascript
      const API_KEY = "YOUR_API_KEY";
      const MODEL_NAME = "gemini-3.5-live-translate-preview";
      const WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${API_KEY}`;

      const websocket = new WebSocket(WS_URL);

      websocket.onopen = () => {
        console.log('WebSocket Connected');

        const setupMessage = {
          setup: {
            model: `models/${MODEL_NAME}`,
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            generationConfig: {
              responseModalities: ['AUDIO'],
              translationConfig: {
                targetLanguageCode: 'pl',
                echoTargetLanguage: true
              }
            }
          }
        };
        websocket.send(JSON.stringify(setupMessage));
      };

      websocket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.serverContent) {
          const content = response.serverContent;
          if (content.inputTranscription) {
            console.log('Input transcript:', content.inputTranscription.text, `(${content.inputTranscription.languageCode})`);
          }
          if (content.outputTranscription) {
            console.log('Output transcript:', content.outputTranscription.text, `(${content.outputTranscription.languageCode})`);
          }
          if (content.modelTurn?.parts) {
            for (const part of content.modelTurn.parts) {
              if (part.inlineData) {
                const audioData = part.inlineData.data;
                // Play or process the translated audio chunk (base64 encoded)
                console.debug(`Received audio chunk (${audioData.length} bytes)`);
              }
            }
          }
        }
      };
      ```


## 傳送音訊 {#sending-audio}

若要串流語音輸入進行翻譯，請傳送原始、小端序的 16 位元 PCM 音訊。

* **輸入音訊格式**：原始 16 位元 PCM、16kHz（單聲道、小端序）。
* **輸出音訊格式**：原始 16 位元 PCM、24kHz（單聲道、小端序）。
* **區塊大小與延遲**：以 100ms 為單位傳送音訊。


!!! note " "

      翻譯僅支援音訊輸入，不支援文字輸入。


以下範例示範如何將音訊區塊傳送至工作階段。


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

=== "WebSockets"

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
        }
      }
      ```


## 設定 {#configuration}

若要啟用翻譯，必須在工作階段設定期間，於 `generationConfig` 中指定 `translationConfig`。

### Setup 訊息設定 {#setup-message-configuration}

`setup` 訊息支援 [`systemInstruction`](/docs/live-api/live-translate/#system-instructions)，可在工作階段開始時提供自訂的翻譯上下文（例如詞彙表、術語與語體）。

`setup` 訊息也支援下列欄位，用來啟用轉錄：

* **`inputAudioTranscription`**：一個物件，存在時可讓模型送出輸入音訊的文字轉錄。
* **`outputAudioTranscription`**：一個物件，存在時可讓模型送出輸出（翻譯後）音訊的文字轉錄。

`translationConfig` 支援下列欄位：

* **`targetLanguageCode`**：你希望模型翻譯成的語言的 [BCP-47 語言代碼](/docs/live-api/live-translate/#supported-languages)（例如波蘭語為 `"pl"`、西班牙語為 `"es"`）。預設為 `"en"`。
* **`echoTargetLanguage`**：一個布林值，指出輸入音訊本身已是目標語言時應如何處理。設為 `true` 時，模型會回放（鸚鵡式重述）已是目標語言的輸入音訊；設為 `false` 時，當輸入語音已是目標語言，模型會保持靜默。預設為 `false`。

以下是 setup 訊息結構的範例：

```json
{
  "setup": {
    "model": "models/gemini-3.5-live-translate-preview",
    "systemInstruction": {
      "parts": [
        {
          "text": "Translate for a conference audience using formal Spanish (usted/ustedes). Always translate 'deployment pipeline' as 'canalización de despliegue' and keep product names like 'Cloud Run' untranslated."
        }
      ]
    },
    "inputAudioTranscription": {},
    "outputAudioTranscription": {},
    "generationConfig": {
      "responseModalities": [
        "AUDIO"
      ],
      "translationConfig": {
        "targetLanguageCode": "es",
        "echoTargetLanguage": false
      }
    }
  }
}
```

### 系統指令 {#system-instructions}

你可以在工作階段設定時傳入 `system_instruction`（在 WebSockets 中為 `systemInstruction`），引導模型如何翻譯語音。使用系統指令來指定：

* **自訂術語與詞彙表**：定義特定產業術語、品牌名稱或技術行話應如何翻譯（例如將 `"deployment pipeline"` 譯為 `"canalización de despliegue"`，或讓 `"Cloud Run"` 等產品名稱保持不譯）。
* **正式程度與語體**：指定目標語氣、人稱形式或聽眾情境（例如在簡報中使用正式的單數或複數稱謂）。
* **說話者與受話者上下文**：提供情境與參與者的背景資訊，讓模型準確保留直接稱謂。


!!! note " "

      系統指令只能在初始的 `setup` 訊息中設定。不支援在工作階段中途更新系統指令（包括透過 `clientContent` 或 `realtimeInput` 文字訊息）；若要變更系統指令，請開啟新的工作階段。此外，僅支援引導翻譯行為且與 `target_language_code` 相符的指令——與 `target_language_code` 衝突、改變輸出格式，或要求模型執行非翻譯工作的指令不受支援，可能被忽略或降低翻譯輸出品質。


=== "Python"

      ```python
      config = types.LiveConnectConfig(
          response_modalities=["AUDIO"],
          system_instruction=(
              "You are translating a live conference presentation into Spanish. "
              "Use formal address (usted/ustedes), always translate "
              "'deployment pipeline' as 'canalización de despliegue', and keep "
              "product names like 'Cloud Run' untranslated."
          ),
          input_audio_transcription=types.AudioTranscriptionConfig(),
          output_audio_transcription=types.AudioTranscriptionConfig(),
          translation_config=types.TranslationConfig(
              target_language_code="es",
              echo_target_language=False,
          ),
      )
      ```

=== "JavaScript"

      ```javascript
      const config = {
        responseModalities: [Modality.AUDIO],
        systemInstruction:
          "You are translating a live conference presentation into Spanish. " +
          "Use formal address (usted/ustedes), always translate " +
          "'deployment pipeline' as 'canalización de despliegue', and keep " +
          "product names like 'Cloud Run' untranslated.",
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        translationConfig: {
          targetLanguageCode: 'es',
          echoTargetLanguage: false,
        },
      };
      ```

=== "WebSockets"

      ```javascript
      const setupMessage = {
        setup: {
          model: `models/${MODEL_NAME}`,
          systemInstruction: {
            parts: [
              {
                text:
                  "You are translating a live conference presentation into Spanish. " +
                  "Use formal address (usted/ustedes), always translate " +
                  "'deployment pipeline' as 'canalización de despliegue', and keep " +
                  "product names like 'Cloud Run' untranslated.",
              },
            ],
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          generationConfig: {
            responseModalities: ['AUDIO'],
            translationConfig: {
              targetLanguageCode: 'es',
              echoTargetLanguage: false,
            },
          },
        },
      };
      websocket.send(JSON.stringify(setupMessage));
      ```


## 在用戶端應用程式中使用臨時 token {#ephemeral-tokens-for-client-side-applications}

對於用戶端對伺服器的應用程式，你可以使用[臨時 token](/docs/live-api/ephemeral-tokens/)（目前為 `v1beta`），避免暴露你的 API 金鑰。

將臨時 token 用於 Live Translation 時：

1. 你必須使用 `v1beta` 端點。
2. **鎖定設定**：預設情況下，你應在伺服器上的 token 建立限制中指定
   `translationConfig`（以及選用的 `systemInstruction`）。當設定了
   `live_connect_constraints` 但未設定
   `lock_additional_fields` 時，伺服器會鎖定整個 `setup` 設定，並忽略用戶端在連線時傳入的任何 `system_instruction` 或 `translationConfig` 欄位。
3. **解除鎖定設定**：若你想在用戶端設定 `translationConfig` 或
   `system_instruction`（例如讓使用者自行選擇目標語言或自訂術語），請在 token 建立要求中省略這些欄位，改為設定 `"lock_additional_fields": []`。如此只會鎖定伺服器上指定的欄位，其餘欄位則開放由用戶端設定。

### 建立受限制的臨時 token {#creating-a-constrained-ephemeral-token}

以下範例示範如何建立附帶翻譯限制的臨時 token。


=== "Python"

      ```python
      import datetime
      from google import genai

      now = datetime.datetime.now(tz=datetime.timezone.utc)

      client = genai.Client(http_options={"api_version": "v1beta"})

      token = client.auth_tokens.create(
          config = {
              'uses': 1,
              'expire_time': now + datetime.timedelta(minutes=30),
              'live_connect_constraints': {
                  'model': 'gemini-3.5-live-translate-preview',
                  'config': {
                      'translation_config': {
                          'target_language_code': 'pl',
                          'echo_target_language': True
                      }
                  }
              },
          }
      )
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });
      const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      const token = await client.authTokens.create({
          config: {
              uses: 1,
              expireTime: expireTime,
              liveConnectConstraints: {
                  model: 'gemini-3.5-live-translate-preview',
                  config: {
                      responseModalities: ['AUDIO'],
                      inputAudioTranscription: {},
                      outputAudioTranscription: {},
                      translationConfig: {
                          targetLanguageCode: 'pl',
                          echoTargetLanguage: true
                      }
                  }
              },
          },
      });
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/auth_tokens" \
        -H "x-goog-api-key: ${GEMINI_API_KEY}" \
        -H "Content-Type: application/json" \
        -d '{
          "uses": 1,
          "expireTime": "YYYY-MM-DDTHH:MM:SSZ",
          "bidiGenerateContentSetup": {
            "model": "models/gemini-3.5-live-translate-preview",
            "inputAudioTranscription": {},
            "outputAudioTranscription": {},
            "generationConfig": {
              "responseModalities": ["AUDIO"],
              "translationConfig": {
                "targetLanguageCode": "pl",
                "echoTargetLanguage": true
              }
            }
          }
        }'
      ```


## 限制 {#limitations}

* **輸入型態**：翻譯僅支援音訊輸入，不支援文字
  輸入。
* **系統指令**：系統指令只能在初始
  `setup` 訊息中設定。不支援在工作階段中途更新系統指令（包括透過
  `clientContent` 或 `realtimeInput` 文字訊息）；若要變更指令，請開啟新的工作階段。僅支援引導翻譯
  行為且與 `target_language_code` 相符的指令——與
  `target_language_code` 衝突、改變輸出格式，或要求
  非翻譯工作的指令不受支援，可能被忽略或降低
  翻譯輸出品質。
* **聲音複製**：聲音複製的結果可能不一致。聲音可能
  在長時間停頓後偏移、依語音開頭的方式指派錯誤的性別，或在多人快速對話時卡在單一聲音上。


!!! note " "

      提醒：開發者有責任在必要時取得所有相關方的同意。開發者不得以違反適用法律、法規或第三方權利的方式使用本 API。


* **語言偵測**：語言偵測在口音濃重、
  語言相近（例如西班牙語與葡萄牙語），或快速切換語言時表現較差。
  **注意**：這只會影響輸入轉錄。語言代碼與
  最終翻譯仍應準確。
* **背景音訊**：模型設計上會過濾噪音與音樂以
  產生乾淨的語音，但並非所有背景音訊都能被忽略。
* **回放目標語言**：當 `echoTargetLanguage: true` 時，若輸入音訊
  本身已是目標語言，背景噪音
  或音樂可能在翻譯音訊中引入雜訊。

## 支援的語言 {#supported-languages}

Live Translation 支援下列語言。

| 語言 | BCP-47 代碼 | 語言 | BCP-47 代碼 |
| :--- | :--- | :--- | :--- |
| 南非荷蘭語 | af | 哈薩克語 | kk |
| 阿坎語 | ak | 高棉語 | km |
| 阿爾巴尼亞語 | sq | 盧安達語 | rw |
| 阿姆哈拉語 | am | 韓語 | ko |
| 阿拉伯語 | ar | 寮語 | lo |
| 亞美尼亞語 | hy | 拉脫維亞語 | lv |
| 亞塞拜然語 | az | 立陶宛語 | lt |
| 巴斯克語 | eu | 馬其頓語 | mk |
| 白俄羅斯語 | be | 馬來語 | ms |
| 孟加拉語 | bn | 馬拉雅拉姆語 | ml |
| 保加利亞語 | bg | 馬拉提語 | mr |
| 緬甸語 | my | 蒙古語 | mn |
| 加泰隆尼亞語 | ca | 尼泊爾語 | ne |
| 中文（簡體） | zh-Hans | 挪威語 | no, nb |
| 中文（繁體） | zh-Hant | 波斯語 | fa |
| 克羅埃西亞語 | hr | 波蘭語 | pl |
| 捷克語 | cs | 葡萄牙語（巴西） | pt-BR |
| 丹麥語 | da | 葡萄牙語（葡萄牙） | pt-PT |
| 荷蘭語 | nl | 旁遮普語 | pa |
| 英語 | en | 羅馬尼亞語 | ro |
| 愛沙尼亞語 | et | 俄語 | ru |
| 菲律賓語 | fil | 塞爾維亞語 | sr |
| 芬蘭語 | fi | 信德語 | sd |
| 法語 | fr | 僧伽羅語 | si |
| 加利西亞語 | gl | 斯洛伐克語 | sk |
| 喬治亞語 | ka | 斯洛維尼亞語 | sl |
| 德語 | de | 西班牙語 | es |
| 希臘語 | el | 巽他語 | su |
| 古吉拉特語 | gu | 斯瓦希里語 | sw |
| 豪薩語 | ha | 瑞典語 | sv |
| 希伯來語 | he | 坦米爾語 | ta |
| 印地語 | hi | 泰盧固語 | te |
| 匈牙利語 | hu | 泰語 | th |
| 冰島語 | is | 土耳其語 | tr |
| 印尼語 | id | 烏克蘭語 | uk |
| 義大利語 | it | 烏爾都語 | ur |
| 日語 | ja | 烏茲別克語 | uz |
| 爪哇語 | jv | 越南語 | vi |
| 卡納達語 | kn | 祖魯語 | zu |

## 後續步驟 {#whats-next}

* 閱讀完整的 Live API [功能](/docs/live-api/capabilities/)指南。
* 閱讀[使用 SDK 開始使用](/docs/live-api/get-started-sdk/)指南。
* 閱讀[使用 WebSockets 開始使用](/docs/live-api/get-started-websocket/)
  指南。
* 閱讀[臨時 token](/docs/live-api/ephemeral-tokens/)指南，了解用戶端對伺服器應用程式的安全驗證方式。
* 從 GitHub 複製
  [Live API 範例](https://github.com/google-gemini/gemini-live-api-examples)。
