# 使用 Gemini Live API 即時轉錄

Gemini Live API 支援以 [`gemini-3.5-transcribe-live`](/docs/models/gemini-3.5-transcribe/) 模型進行低延遲的即時語音轉文字轉錄。你可以透過 WebSockets 連線至 Live API，或使用 Google Gen AI SDK，串流連續的音訊輸入，並在語音發生的同時即時收到逐步更新的文字轉錄結果。

[在 Google AI Studio 中試用 Live Transcription](https://aistudio.google.com/live?model=gemini-3.5-transcribe-live)

[開啟 Colab cookbook](https://github.com/google-gemini/cookbook)

[使用程式設計代理技能](/docs/coding-agents/#gemini-live-api-dev)

借助 Gemini Live API，
[Agora](https://docs.agora.io/en/ai/models/asr/gemini)、
[Fishjam](https://docs.fishjam.io/tutorials/gemini-live-integration)、
[LiveKit](https://docs.livekit.io/agents/models/stt/gemini/)、
[Pipecat](https://docs.pipecat.ai/api-reference/server/services/stt/google)、
[Vercel](https://vercel.com/docs/ai-gateway/modalities/speech-to-text) 與
[Vision Agents](https://visionagents.ai/integrations/stt/gemini)
等開發者平台，讓開發者能輕鬆建置並部署高效能的語音驅動介面。這些平台在幕後管理複雜的即時媒體串流基礎架構，讓開發者能全心專注於打造使用者體驗。

## Live 代理與 Live 轉錄的差異 {#live-agent-versus-live-transcription}

兩者都使用 Live API 的雙向串流連線，但 Live Transcription 是專用的低延遲語音辨識管線，而非對話式代理。

| 功能 | Live 代理 | Live 轉錄 |
| :--- | :--- | :--- |
| **主要角色** | 會聆聽、推理並回話的對話助理。 | 即時將輸入音訊轉成文字的語音轉文字管線。 |
| **回應型態** | 語音與文字（`response_modalities=["AUDIO"]`）。 | 串流文字轉錄（`response_modalities=["TEXT"]`）。 |
| **互動方式** | 輪流對話，具備停頓偵測與插話處理。 | 說話者講話時即連續處理串流。 |
| **支援的功能** | 函式呼叫、Google 搜尋、系統指令、在 `gemini-3.8-live` 上支援語音偏置（`custom_vocabulary`）的輸入音訊轉錄。 | 語音偏置（`custom_vocabulary`）、語言偵測、手動與混合 VAD、智慧轉錄。 |
| **輸入串流** | 多模態：音訊、影片、圖片、文字。 | 音訊輸入（原始 16 位元 PCM）。 |

## 開始使用 {#get-started}

以下範例示範如何以 `gemini-3.5-transcribe-live` 開啟雙向串流工作階段，並接收即時轉錄結果。


=== "Python"

      ```python
      import asyncio
      from google import genai
      from google.genai import types

      client = genai.Client(http_options={"api_version": "v1beta"})
      model = "gemini-3.5-transcribe-live"

      config = types.LiveConnectConfig(
          response_modalities=["TEXT"],
          input_audio_transcription=types.AudioTranscriptionConfig(
              language_codes=[],  # Automatic language detection
          ),
      )

      async def main():
          async with client.aio.live.connect(model=model, config=config) as session:
              print("Session established with Live Transcription")

              # Receive transcription events
              async for response in session.receive():
                  server_content = response.server_content
                  if server_content and server_content.input_transcription:
                      print("Transcript:", server_content.input_transcription.text)

      if __name__ == "__main__":
          asyncio.run(main())
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI, Modality } from '@google/genai';

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });
      const model = 'gemini-3.5-transcribe-live';

      const config = {
        responseModalities: [Modality.TEXT],
        inputAudioTranscription: {
          languageCodes: [], // Automatic language detection
        },
      };

      async function main() {
        const session = await ai.live.connect({
          model: model,
          config: config,
          callbacks: {
            onopen: () => console.log('Connected to Live Transcription'),
            onmessage: (message) => {
              const content = message.serverContent;
              if (content?.inputTranscription) {
                console.log('Transcript:', content.inputTranscription.text);
              }
            },
            onerror: (e) => console.error('Error:', e.message),
            onclose: (e) => console.log('Connection closed:', e.reason),
          },
        });
      }

      await main();
      ```

=== "WebSockets"

      ```javascript
      const API_KEY = "YOUR_API_KEY";
      const MODEL_NAME = "gemini-3.5-transcribe-live";
      const WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${API_KEY}`;

      const websocket = new WebSocket(WS_URL);

      websocket.onopen = () => {
        console.log('WebSocket connected');

        const setupMessage = {
          setup: {
            model: `models/${MODEL_NAME}`,
            generationConfig: {
              responseModalities: ['TEXT'],
            },
            inputAudioTranscription: {
              languageCodes: []
            }
          }
        };
        websocket.send(JSON.stringify(setupMessage));
      };

      websocket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        const content = response.serverContent;
        if (content?.inputTranscription) {
          console.log('Transcript:', content.inputTranscription.text);
        }
      };
      ```


## 暫時與定稿轉錄 {#interim-transcriptions}

音訊串流進入 Live API 時，伺服器會在 `server_content` 中送出兩個互補的轉錄欄位：

*   **`interim_input_transcription`**：低延遲的推測性部分假設，會在說話者持續講話時不斷更新。這些部分更新送出得非常快速、延遲極低。可用 `interim_input_transcription` 呈現反應靈敏的即時 UI 字幕或預覽字幕。
*   **`input_transcription`**：在說話者停頓、該輪結束或語音定稿時送出的最終轉錄。送出後，這段文字即為模型對該語音片段的權威轉錄結果。在智慧轉錄模式下，這裡會包含清理並格式化後的回應。

以下範例示範如何顯示串流中的暫時部分結果，並提交最終轉錄：


=== "Python"

      ```python
      async def receive_transcripts(session):
          async for response in session.receive():
              server_content = response.server_content
              if not server_content:
                  continue

              # Real-time interim hypothesis (updates dynamically as user speaks)
              if server_content.interim_input_transcription:
                  interim_text = server_content.interim_input_transcription.text
                  print(f"\r[Interim] {interim_text}", end="", flush=True)

              # Finalized transcript (emitted on speech completion)
              if server_content.input_transcription:
                  final_text = server_content.input_transcription.text
                  print(f"\n[Final] {final_text}")
      ```

=== "JavaScript"

      ```javascript
      onmessage: (message) => {
        const content = message.serverContent;
        if (!content) return;

        if (content.interimInputTranscription) {
          // Update live subtitle preview on screen
          renderInterimPreview(content.interimInputTranscription.text);
        }

        if (content.inputTranscription) {
          // Append final committed transcript to chat history
          commitFinalTranscript(content.inputTranscription.text);
        }
      };
      ```

=== "WebSockets"

      ```javascript
      websocket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        const content = response.serverContent;
        if (content?.interimInputTranscription) {
          console.log('[Interim]:', content.interimInputTranscription.text);
        }
        if (content?.inputTranscription) {
          console.log('[Final]:', content.inputTranscription.text);
        }
      };
      ```


## 傳送音訊 {#sending-audio}

透過作用中的連線串流音訊區塊，格式為原始 16 位元 PCM 音訊。

*   **音訊格式**：原始 16 位元 PCM、16kHz（單聲道、小端序）。
*   **區塊大小**：以 100ms 為單位傳送音訊（1,024 至 2,048 個影格）。
*   **MIME 類型**：`audio/pcm;rate=16000`（或相符的取樣率）。


=== "Python"

      ```python
      # Stream a raw PCM audio chunk
      await session.send_realtime_input(
          audio=types.Blob(
              data=audio_chunk_bytes,
              mime_type="audio/pcm;rate=16000"
          )
      )

      # Signal the end of the audio stream when finished
      await session.send_realtime_input(audio_stream_end=True)
      ```

=== "JavaScript"

      ```javascript
      // Send base64-encoded PCM audio chunk
      session.sendRealtimeInput({
        audio: {
          data: audioChunkBase64,
          mimeType: 'audio/pcm;rate=16000'
        }
      });

      // Signal stream end
      session.sendRealtimeInput({
        audioStreamEnd: true
      });
      ```

=== "WebSockets"

      ```javascript
      // Send base64-encoded PCM audio chunk
      websocket.send(JSON.stringify({
        realtimeInput: {
          audio: {
            data: audioChunkBase64,
            mimeType: 'audio/pcm;rate=16000'
          }
        }
      }));

      // Signal stream end
      websocket.send(JSON.stringify({
        realtimeInput: {
          audioStreamEnd: true
        }
      }));
      ```


## 轉錄功能 {#transcription-features}

### 自動語言偵測 {#automatic-language-detection}

預設情況下，省略 `language_codes` 或將 `language_codes=[]` 設為空，即可啟用自動語言識別。模型會在各段語音之間動態偵測所說的語言，包括多語言對話與語碼轉換的情境。


=== "Python"

      ```python
      config = types.LiveConnectConfig(
          response_modalities=["TEXT"],
          input_audio_transcription=types.AudioTranscriptionConfig(
              language_codes=[],
          ),
      )
      ```

=== "JavaScript"

      ```javascript
      const config = {
        responseModalities: [Modality.TEXT],
        inputAudioTranscription: {
          languageCodes: [],
        },
      };
      ```

=== "WebSockets"

      ```javascript
      const setupMessage = {
        setup: {
          model: 'models/gemini-3.5-transcribe-live',
          generationConfig: {
            responseModalities: ['TEXT'],
          },
          inputAudioTranscription: {
            languageCodes: [],
          },
        },
      };
      websocket.send(JSON.stringify(setupMessage));
      ```


### 指定語言提示 {#specific-language-hint}

提供明確的 BCP-47 語言代碼（例如西班牙語用 `["es-ES"]`、法語用 `["fr-FR"]`），讓辨識偏向特定語言（請參閱[支援的語言](/docs/live-api/live-transcribe/#supported-languages)）。


=== "Python"

      ```python
      config = types.LiveConnectConfig(
          response_modalities=["TEXT"],
          input_audio_transcription=types.AudioTranscriptionConfig(
              language_codes=["es-ES"],
          ),
      )
      ```

=== "JavaScript"

      ```javascript
      const config = {
        responseModalities: [Modality.TEXT],
        inputAudioTranscription: {
          languageCodes: ['es-ES'],
        },
      };
      ```

=== "WebSockets"

      ```javascript
      const setupMessage = {
        setup: {
          model: 'models/gemini-3.5-transcribe-live',
          generationConfig: {
            responseModalities: ['TEXT'],
          },
          inputAudioTranscription: {
            languageCodes: ['es-ES'],
          },
        },
      };
      websocket.send(JSON.stringify(setupMessage));
      ```


### 自訂詞彙偏置 {#custom-vocabulary-biasing}

在 `custom_vocabulary` 中提供最多 1,000 個片語、專有名詞、品牌名稱或技術術語，讓語音辨識偏向特定用語（通常以最多 100 個詞彙時效果最佳）。


=== "Python"

      ```python
      config = types.LiveConnectConfig(
          response_modalities=["TEXT"],
          input_audio_transcription=types.AudioTranscriptionConfig(
              language_codes=[],
              custom_vocabulary=["Gemini", "Kubernetes", "BigQuery"],
          ),
      )
      ```

=== "JavaScript"

      ```javascript
      const config = {
        responseModalities: [Modality.TEXT],
        inputAudioTranscription: {
          languageCodes: [],
          customVocabulary: ['Gemini', 'Kubernetes', 'BigQuery'],
        },
      };
      ```

=== "WebSockets"

      ```javascript
      const setupMessage = {
        setup: {
          model: 'models/gemini-3.5-transcribe-live',
          generationConfig: {
            responseModalities: ['TEXT'],
          },
          inputAudioTranscription: {
            languageCodes: [],
            customVocabulary: ['Gemini', 'Kubernetes', 'BigQuery'],
          },
        },
      };
      websocket.send(JSON.stringify(setupMessage));
      ```


### 智慧轉錄 {#smart-transcription}

使用 `input_audio_transcription` 中的 `mode` 參數設定轉錄輸出的格式：

*   **`VERBATIM`（預設）**：產生逐字精確的轉錄，保留原始的填充詞（「um」、「uh」、「like」）、重複與錯誤起頭。
*   **`SMART`（智慧轉錄）**：清理並整理轉錄，提升可讀性：
    *   **去除不流暢處**：移除填充詞、口吃與錯誤起頭。
    *   **行內自我修正**：自然地處理口頭修正。
    *   **結構化格式**：自動格式化清單、項目符號、數字、日期與段落分隔。
    *   **文法與大小寫**：套用自然的大小寫與標點潤飾。


=== "Python"

      ```python
      config = types.LiveConnectConfig(
          response_modalities=["TEXT"],
          input_audio_transcription=types.AudioTranscriptionConfig(
              mode="SMART",
          ),
      )
      ```

=== "JavaScript"

      ```javascript
      const config = {
        responseModalities: [Modality.TEXT],
        inputAudioTranscription: {
          mode: 'SMART',
        },
      };
      ```

=== "WebSockets"

      ```javascript
      const setupMessage = {
        setup: {
          model: 'models/gemini-3.5-transcribe-live',
          generationConfig: {
            responseModalities: ['TEXT'],
          },
          inputAudioTranscription: {
            mode: 'SMART',
          },
        },
      };
      websocket.send(JSON.stringify(setupMessage));
      ```


## 語音活動偵測（VAD）策略 {#voice-activity-detection-vad-strategies}

### 自動 VAD（預設） {#automatic-vad-default}

預設情況下，伺服器端的自動語音活動偵測會偵測說話者開始與停止說話的時機。

### 混合 VAD {#hybrid-vad}

[混合 VAD](/docs/live-api/capabilities/#hybrid-vad) 結合伺服器端的自動語音開始偵測與用戶端的語音結束偵測，實現零延遲的輪次定稿：

1.  **伺服器端自動 VAD 保持啟用**：搭配前綴音訊填充，精確偵測語音開頭，避免開頭字詞被截斷。
2.  **用戶端 VAD 偵測靜音**：當本機裝置上的 VAD 偵測到說話者已停止說話時，用戶端會立即送出 `audio_stream_end` 訊號。
3.  **快速定稿**：伺服器將 `audio_stream_end` 視為立即定稿該輪的提示，略過預設的伺服器端靜音等待時間，以最低延遲回傳定稿的轉錄。
4.  **備援機制**：若用戶端 VAD 未能觸發，伺服器端 VAD 會自動作為備援。


=== "Python"

      ```python
      config = types.LiveConnectConfig(
          response_modalities=["TEXT"],
          input_audio_transcription=types.AudioTranscriptionConfig(),
      )

      async with client.aio.live.connect(model=model, config=config) as session:
          # Stream audio chunks...
          await session.send_realtime_input(
              audio=types.Blob(data=chunk, mime_type="audio/pcm;rate=16000")
          )

          # When client-side VAD detects end of speech, send audio_stream_end:
          await session.send_realtime_input(audio_stream_end=True)
      ```

=== "JavaScript"

      ```javascript
      const config = {
        responseModalities: [Modality.TEXT],
        inputAudioTranscription: {},
      };

      // Stream audio...
      session.sendRealtimeInput({
        audio: { data: chunkBase64, mimeType: 'audio/pcm;rate=16000' }
      });

      // When client VAD detects end of speech, send audioStreamEnd:
      session.sendRealtimeInput({
        audioStreamEnd: true
      });
      ```

=== "WebSockets"

      ```javascript
      const setupMessage = {
        setup: {
          model: 'models/gemini-3.5-transcribe-live',
          generationConfig: {
            responseModalities: ['TEXT'],
          },
          inputAudioTranscription: {},
        },
      };
      websocket.send(JSON.stringify(setupMessage));

      // Stream audio...
      websocket.send(JSON.stringify({
        realtimeInput: {
          audio: { data: chunkBase64, mimeType: 'audio/pcm;rate=16000' }
        }
      }));

      // When client VAD detects end of speech, send audioStreamEnd:
      websocket.send(JSON.stringify({
        realtimeInput: {
          audioStreamEnd: true
        }
      }));
      ```


### 手動 VAD（按鍵通話） {#manual-vad-push-to-talk}

若是對講機介面或按鍵通話按鈕，可完全停用自動 VAD，改用 `activity_start` 與 `activity_end` 明確控制輪次邊界：


=== "Python"

      ```python
      config = types.LiveConnectConfig(
          response_modalities=["TEXT"],
          realtime_input_config=types.RealtimeInputConfig(
              automatic_activity_detection=types.AutomaticActivityDetection(
                  disabled=True
              )
          ),
          input_audio_transcription=types.AudioTranscriptionConfig(),
      )

      async with client.aio.live.connect(model=model, config=config) as session:
          # Button pressed: signal speech start
          await session.send_realtime_input(activity_start=types.ActivityStart())

          # Stream audio chunks...
          await session.send_realtime_input(audio=types.Blob(data=chunk, mime_type="audio/pcm;rate=16000"))

          # Button released: signal speech end
          await session.send_realtime_input(activity_end=types.ActivityEnd())
      ```

=== "JavaScript"

      ```javascript
      const config = {
        responseModalities: [Modality.TEXT],
        realtimeInputConfig: {
          automaticActivityDetection: {
            disabled: true,
          },
        },
        inputAudioTranscription: {},
      };

      // Signal speech start
      session.sendRealtimeInput({ activityStart: {} });

      // Stream audio...

      // Signal speech end
      session.sendRealtimeInput({ activityEnd: {} });
      ```

=== "WebSockets"

      ```javascript
      const setupMessage = {
        setup: {
          model: 'models/gemini-3.5-transcribe-live',
          generationConfig: {
            responseModalities: ['TEXT'],
          },
          realtimeInputConfig: {
            automaticActivityDetection: {
              disabled: true,
            },
          },
          inputAudioTranscription: {},
        },
      };
      websocket.send(JSON.stringify(setupMessage));

      // Button pressed: signal speech start
      websocket.send(JSON.stringify({
        realtimeInput: {
          activityStart: {},
        },
      }));

      // Stream audio...
      websocket.send(JSON.stringify({
        realtimeInput: {
          audio: { data: chunkBase64, mimeType: 'audio/pcm;rate=16000' },
        },
      }));

      // Button released: signal speech end
      websocket.send(JSON.stringify({
        realtimeInput: {
          activityEnd: {},
        },
      }));
      ```


## 在用戶端應用程式中使用臨時權杖 {#ephemeral-tokens-in-client-applications}

對於用戶端對伺服器的應用程式（例如直接從麥克風串流的行動或網頁應用程式），請使用[臨時權杖](/docs/live-api/ephemeral-tokens/)，避免在用戶端程式碼中暴露你的 API 金鑰。

在發起用戶端連線之前，先在伺服器上建立一個受限制的臨時權杖：


=== "Python"

      ```python
      import datetime
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})
      expire_time = datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(minutes=30)

      token = client.auth_tokens.create(
          config={
              "uses": 1,
              "expire_time": expire_time,
              "live_connect_constraints": {
                  "model": "gemini-3.5-transcribe-live",
                  "config": {
                      "response_modalities": ["TEXT"],
                      "input_audio_transcription": {
                          "language_codes": [],
                      },
                  },
              },
          }
      )
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });
      const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      const token = await client.authTokens.create({
        config: {
          uses: 1,
          expireTime: expireTime,
          liveConnectConstraints: {
            model: 'gemini-3.5-transcribe-live',
            config: {
              responseModalities: ['TEXT'],
              inputAudioTranscription: {
                languageCodes: [],
              },
            },
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
          "liveConnectConstraints": {
            "model": "models/gemini-3.5-transcribe-live",
            "config": {
              "responseModalities": ["TEXT"],
              "inputAudioTranscription": {
                "languageCodes": []
              }
            }
          }
        }'
      ```


## 支援的語言 {#supported-languages}

Gemini 3.5 Transcribe Live 支援下列語言與 BCP-47 語言代碼：

| 語言 | BCP-47 代碼 | 語言 | BCP-47 代碼 |
| :--- | :--- | :--- | :--- |
| 南非荷蘭語 | `af-ZA` | 日語 | `ja-JP` |
| 阿姆哈拉語 | `am-ET` | 爪哇語 | `jv-ID` |
| 阿拉伯語（埃及） | `ar-EG` | 佛得角克里奧爾語 | `kea-CV` |
| 亞美尼亞語 | `hy-AM` | 卡納達語 | `kn-IN` |
| 阿薩姆語 | `as-IN` | 哈薩克語 | `kk-KZ` |
| 亞塞拜然語 | `az-AZ` | 韓語 | `ko-KR` |
| 白俄羅斯語 | `be-BY` | 吉爾吉斯語 | `ky-KG` |
| 孟加拉語（孟加拉） | `bn-BD` | 拉脫維亞語 | `lv-LV` |
| 孟加拉語（印度） | `bn-IN` | 林加拉語 | `ln-CD` |
| 波士尼亞語 | `bs-BA` | 立陶宛語 | `lt-LT` |
| 保加利亞語 | `bg-BG` | 馬其頓語 | `mk-MK` |
| 保加利亞語（阿羅馬尼亞語） | `rup-BG` | 馬來語 | `ms-MY` |
| 緬甸語 | `my-MM` | 馬拉雅拉姆語 | `ml-IN` |
| 粵語（繁體） | `yue-Hant-HK` | 馬爾他語 | `mt-MT` |
| 加泰隆尼亞語 | `ca-ES` | 華語（簡體） | `cmn-Hans-CN` |
| 宿霧語 | `ceb` | 馬拉提語 | `mr-IN` |
| 高棉語 | `km-KH` | 蒙古語 | `mn-MN` |
| 克羅埃西亞語 | `hr-HR` | 尼泊爾語 | `ne-NP` |
| 捷克語 | `cs-CZ` | 挪威語 | `nb-NO` |
| 丹麥語 | `da-DK` | 奧里亞語 | `or-IN` |
| 荷蘭語 | `nl-NL` | 波蘭語 | `pl-PL` |
| 英語（英國） | `en-GB` | 葡萄牙語（巴西） | `pt-BR` |
| 英語（印度） | `en-IN` | 葡萄牙語（葡萄牙） | `pt-PT` |
| 英語（美國） | `en-US` | 旁遮普語 | `pa-IN` |
| 愛沙尼亞語 | `et-EE` | 旁遮普語（古木基文） | `pa-Guru-IN` |
| 波斯語 | `fa-IR` | 羅馬尼亞語 | `ro-RO` |
| 菲律賓語 | `fil-PH` | 俄語 | `ru-RU` |
| 芬蘭語 | `fi-FI` | 塞爾維亞語 | `sr-RS` |
| 法語 | `fr-FR` | 信德語（阿拉伯文） | `sd-Arab-IN` |
| 加利西亞語 | `gl-ES` | 斯洛伐克語 | `sk-SK` |
| 喬治亞語 | `ka-GE` | 斯洛維尼亞語 | `sl-SI` |
| 德語 | `de-DE` | 西班牙語（拉丁美洲） | `es-419` |
| 希臘語 | `el-GR` | 西班牙語（美國） | `es-US` |
| 古吉拉特語 | `gu-IN` | 斯瓦希里語（肯亞） | `sw-KE` |
| 豪薩語 | `ha-NG` | 瑞典語 | `sv-SE` |
| 希伯來語 | `he-IL` | 塔吉克語 | `tg-TJ` |
| 印地語 | `hi-IN` | 泰盧固語 | `te-IN` |
| 匈牙利語 | `hu-HU` | 泰語 | `th-TH` |
| 冰島語 | `is-IS` | 土耳其語 | `tr-TR` |
| 印度英語 | `en-IN` | 烏克蘭語 | `uk-UA` |
| 印尼語 | `id-ID` | 烏茲別克語 | `uz-UZ` |
| 義大利語 | `it-IT` | 越南語 | `vi-VN` |

## 參數參考 {#parameter-reference}

使用 `input_audio_transcription` 與 `realtime_input_config` 中的欄位設定即時轉錄：

| 參數 | 類型 | 說明 |
| :--- | :--- | :--- |
| `language_codes` | 字串陣列 | BCP-47 語言代碼（例如 `["en-US"]`）。若省略或為空（`[]`），模型會自動偵測語言並處理多語言語音。 |
| `custom_vocabulary` | 字串陣列 | 最多 1,000 個自訂詞彙、縮寫、品牌名稱或專有名詞，用來讓語音辨識產生偏置。 |
| `mode` | 字串 | 轉錄模式：`"VERBATIM"`（預設）或 `"SMART"`（智慧轉錄）。設為 `"SMART"` 時，模型會移除填充詞、格式化清單並修正不流暢處。 |
| `automatic_activity_detection.disabled` | 布林值 | 設為 `true` 可停用自動語音活動偵測，改為手動送出 `activityStart` 與 `activityEnd` 訊號。 |

### 伺服器回應欄位 {#server-response-fields}

| 欄位 | 說明 |
| :--- | :--- |
| `server_content.interim_input_transcription` | 低延遲的暫時部分轉錄假設，會在使用者持續說話時不斷送出。 |
| `server_content.input_transcription` | 定稿的權威輸入轉錄，會在一輪語音結束時送出。 |

## 限制 {#limitations}

*   **工作階段時長**：即時轉錄工作階段支援最長 10 分鐘的連續串流。
*   **說話者分離**：即時串流工作階段不支援說話者分離。如需說話者分離，請使用非串流的[音訊轉錄](/docs/transcribe/#speaker-diarization)端點。
*   **單字層級時間戳記**：Live API 不支援單字層級時間戳記。Live API 送出的是語句層級時間戳記（`interim_input_transcription` 與 `input_transcription`）。
*   **自訂詞彙**：你可以在 `custom_vocabulary` 中提供最多 1,000 個詞彙，但通常以最多 100 個詞彙時效果最佳。
*   **模式相容性**：智慧轉錄（`"mode": "SMART"`）會移除填充詞並格式化具意圖感知的文字，但無法與單字註記併用。

## 後續步驟 {#whats-next}

*   閱讀 [Gemini Transcribe 文件](/docs/transcribe/)，了解非串流音訊檔案的轉錄方式。
*   閱讀 [Live API 總覽](/docs/live-api/)，了解對話式語音代理。
*   閱讀[即時翻譯指南](/docs/live-api/live-translate/)，了解即時語音對語音翻譯。
*   查看[定價頁面](/docs/pricing/#gemini-3.5-transcribe-live)，了解 Live API 串流定價。
*   探索 [Live API 功能指南](/docs/live-api/capabilities/)。
