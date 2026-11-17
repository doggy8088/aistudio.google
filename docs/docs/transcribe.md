# 音訊轉錄

Gemini API 運用 Gemini 3.5 Transcribe 模型（`gemini-3.5-transcribe`），將音訊檔案中的語音轉換為文字。此模型以 Gemini 的音訊理解能力為基礎，能提供精確的轉錄，並具備自動語言識別、說話者分離、單字層級時間戳記與自訂詞彙提示等功能。它還提供[智慧轉錄](/docs/transcribe/#transcription-modes)模式，具備去除不流暢語句與智慧格式設定等特色。

如要轉錄音訊檔案，請上傳音訊並將其傳給 `gemini-3.5-transcribe`：


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      audio_file = client.files.upload(file="path/to/sample.mp3")

      response = client.interactions.create(
          model="gemini-3.5-transcribe",
          input=[audio_file],
      )

      print(response.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const audioFile = await ai.files.upload({
        file: "path/to/sample.mp3",
        config: { mimeType: "audio/mp3" },
      });

      const response = await ai.interactions.create({
        model: "gemini-3.5-transcribe",
        input: [
          {
            type: "audio",
            uri: audioFile.uri,
            mime_type: audioFile.mimeType,
          },
        ],
      });

      console.log(response.output_text);
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          audioFile, err := client.Files.UploadFromPath(ctx, "path/to/sample.mp3", nil)
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-3.5-transcribe"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.AudioContent{
                          URI:      genai.Ptr(audioFile.URI),
                          MimeType: interactions.AudioContentMimeType(audioFile.MIMEType).ToPointer(),
                      }),
                  }),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(res.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```bash
      # First upload the file via the Files API, then pass its URI:
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "models/gemini-3.5-transcribe",
          "input": [
            {
              "type": "file",
              "file_uri": "YOUR_FILE_URI"
            }
          ]
        }'
      ```


!!! note " "

      如需透過麥克風或即時音訊串流進行即時、低延遲的串流語音辨識，請參閱使用 Live API 與 `gemini-3.5-transcribe-live` 的[即時轉錄](/docs/live-api/live-transcribe/)。


## 總覽 {#overview}

Gemini 3.5 Transcribe 專為語音轉文字工作最佳化，能處理多元口音、背景噪音與多語言對話。

主要功能包括：

*   **自動語音辨識（ASR）**：自動偵測 [85 多種地區語言](/docs/transcribe/#supported-languages)的語言。無需手動設定，即可處理句內與句間的語碼轉換。
*   **自訂詞彙**：可傳入多達 1,000 個片語，讓辨識偏向特定領域的術語、縮寫與專有名詞。
*   **說話者分離**：區分多位說話者，並將說話片段歸屬到不同的標籤。
*   **單字層級時間戳記**：為每個辨識出的單字產生精確的開始與結束時間偏移。
*   **智慧轉錄**：清除不流暢語句、填充詞與重複內容，並套用結構化格式。
*   **格式設定與正規化**：套用大小寫、標點符號與反文字正規化，例如將「twenty six million dollars」轉換為「$26M」。

如需針對音訊內容進行一般音訊推理或問答，請使用[音訊理解](/docs/audio/)。如需文字轉語音的音訊合成，請使用[文字轉語音](/docs/speech-generation/)。

## 語言偵測與提示 {#language-detection}

模型預設會自動偵測所說的語言。當說話者進行語碼轉換時，它會動態切換語言。

如要使用自動偵測，請省略 `language_codes`，或提供空清單：


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      response = client.interactions.create(
          model="gemini-3.5-transcribe",
          input=[audio_file],
          generation_config={
              "transcription_config": {
                  "language_codes": [],
              }
          },
      )
      ```

=== "JavaScript"

      ```javascript
      const response = await ai.interactions.create({
        model: "gemini-3.5-transcribe",
        input: [audioFile],
        generationConfig: {
          transcriptionConfig: {
            languageCodes: [],
          },
        },
      });
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          audioFile, err := client.Files.UploadFromPath(ctx, "path/to/sample.mp3", nil)
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-3.5-transcribe"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.AudioContent{
                          URI:      genai.Ptr(audioFile.URI),
                          MimeType: interactions.AudioContentMimeType(audioFile.MIMEType).ToPointer(),
                      }),
                  }),
                  GenerationConfig: &interactions.GenerationConfig{
                      TranscriptionConfig: &interactions.TranscriptionConfig{
                          LanguageCodes: []string{},
                      },
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(res.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "models/gemini-3.5-transcribe",
          "input": [
            {
              "type": "file",
              "file_uri": "YOUR_FILE_URI"
            }
          ],
          "generation_config": {
            "transcription_config": {
              "language_codes": []
            }
          }
        }'
      ```


若你事先知道語言，可在 `language_codes` 中指定 BCP-47 語言代碼，以提升轉錄準確度（請參閱[支援的語言](/docs/transcribe/#supported-languages)）：


=== "Python"

      ```python
      generation_config = {
          "transcription_config": {
              "language_codes": ["es-ES"],
          }
      }
      ```

=== "JavaScript"

      ```javascript
      const generationConfig = {
        transcriptionConfig: {
          languageCodes: ["es-ES"],
        },
      };
      ```

=== "Go"

      ```go
      package main

      import (
          "google.golang.org/genai/interactions/models/interactions"
      )

      func main() {
          generationConfig := &interactions.GenerationConfig{
              TranscriptionConfig: &interactions.TranscriptionConfig{
                  LanguageCodes: []string{"es-ES"},
              },
          }
          _ = generationConfig
      }
      ```

=== "REST"

      ```json
      {
        "generation_config": {
          "transcription_config": {
            "language_codes": ["es-ES"]
          }
        }
      }
      ```


## 自訂詞彙 {#custom-vocabulary}

你可以引導語音模型偏向不常見的詞彙、技術術語、品牌名稱或專有名詞。在 `custom_vocabulary` 陣列中提供多達 1,000 個詞彙（通常以不超過 100 個詞彙時效果最佳）：


!!! note " "

      `custom_vocabulary` 無法與說話者分離或單字層級時間戳記併用。若請求同時包含 `custom_vocabulary` 與其中任一功能，API 會拒絕該請求。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      response = client.interactions.create(
          model="gemini-3.5-transcribe",
          input=[audio_file],
          generation_config={
              "transcription_config": {
                  "custom_vocabulary": ["Gemini", "Kubernetes", "BigQuery"],
              }
          },
      )
      ```

=== "JavaScript"

      ```javascript
      const response = await ai.interactions.create({
        model: "gemini-3.5-transcribe",
        input: [audioFile],
        generationConfig: {
          transcriptionConfig: {
            customVocabulary: ["Gemini", "Kubernetes", "BigQuery"],
          },
        },
      });
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          audioFile, err := client.Files.UploadFromPath(ctx, "path/to/sample.mp3", nil)
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-3.5-transcribe"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.AudioContent{
                          URI:      genai.Ptr(audioFile.URI),
                          MimeType: interactions.AudioContentMimeType(audioFile.MIMEType).ToPointer(),
                      }),
                  }),
                  GenerationConfig: &interactions.GenerationConfig{
                      TranscriptionConfig: &interactions.TranscriptionConfig{
                          CustomVocabulary: []string{"Gemini", "Kubernetes", "BigQuery"},
                      },
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(res.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "models/gemini-3.5-transcribe",
          "input": [
            {
              "type": "file",
              "file_uri": "YOUR_FILE_URI"
            }
          ],
          "generation_config": {
            "transcription_config": {
              "custom_vocabulary": ["Gemini", "Kubernetes", "BigQuery"]
            }
          }
        }'
      ```


## 說話者分離 {#speaker-diarization}

說話者分離能識別錄音中不同的聲音，並為每個片段標上 `spk_1` 或 `spk_2` 之類的說話者識別碼。最多支援 8 位說話者（3 位以上說話者的歸屬判定仍屬實驗性質）。

如要啟用說話者分離，請將 `diarization_mode` 設為 `"speaker"`（位於 `mode` 內）：


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      response = client.interactions.create(
          model="gemini-3.5-transcribe",
          input=[audio_file],
          generation_config={
              "transcription_config": {
                  "mode": {
                      "type": "verbatim",
                      "diarization_mode": "speaker",
                  }
              }
          },
      )
      ```

=== "JavaScript"

      ```javascript
      const response = await ai.interactions.create({
        model: "gemini-3.5-transcribe",
        input: [audioFile],
        generationConfig: {
          transcriptionConfig: {
            mode: {
              type: "verbatim",
              diarizationMode: "speaker",
            },
          },
        },
      });
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          audioFile, err := client.Files.UploadFromPath(ctx, "path/to/sample.mp3", nil)
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-3.5-transcribe"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.AudioContent{
                          URI:      genai.Ptr(audioFile.URI),
                          MimeType: interactions.AudioContentMimeType(audioFile.MIMEType).ToPointer(),
                      }),
                  }),
                  GenerationConfig: &interactions.GenerationConfig{
                      TranscriptionConfig: &interactions.TranscriptionConfig{
                          Mode: genai.Ptr(interactions.NewTranscriptionConfigMode(interactions.NewTranscriptionMode(interactions.VerbatimTranscriptionMode{
                              DiarizationMode: genai.Ptr("speaker"),
                          }))),
                      },
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(res.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "models/gemini-3.5-transcribe",
          "input": [
            {
              "type": "file",
              "file_uri": "YOUR_FILE_URI"
            }
          ],
          "generation_config": {
            "transcription_config": {
              "mode": {
                "type": "verbatim",
                "diarization_mode": "speaker"
              }
            }
          }
        }'
      ```


## 單字層級時間戳記 {#word-timestamps}

單字層級時間戳記能為音訊串流中每個辨識出的單字，提供精確的開始與結束偏移。


!!! note " "

      啟用單字層級時間戳記可能會降低整體轉錄準確度。


如要啟用時間戳記，請將 `timestamp_granularities` 設為 `["word"]`（位於 `mode` 內）：


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      response = client.interactions.create(
          model="gemini-3.5-transcribe",
          input=[audio_file],
          generation_config={
              "transcription_config": {
                  "mode": {
                      "type": "verbatim",
                      "timestamp_granularities": ["word"],
                  }
              }
          },
      )
      ```

=== "JavaScript"

      ```javascript
      const response = await ai.interactions.create({
        model: "gemini-3.5-transcribe",
        input: [audioFile],
        generationConfig: {
          transcriptionConfig: {
            mode: {
              type: "verbatim",
              timestampGranularities: ["word"],
            },
          },
        },
      });
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          audioFile, err := client.Files.UploadFromPath(ctx, "path/to/sample.mp3", nil)
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-3.5-transcribe"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.AudioContent{
                          URI:      genai.Ptr(audioFile.URI),
                          MimeType: interactions.AudioContentMimeType(audioFile.MIMEType).ToPointer(),
                      }),
                  }),
                  GenerationConfig: &interactions.GenerationConfig{
                      TranscriptionConfig: &interactions.TranscriptionConfig{
                          Mode: genai.Ptr(interactions.NewTranscriptionConfigMode(interactions.NewTranscriptionMode(interactions.VerbatimTranscriptionMode{
                              TimestampGranularities: []string{"word"},
                          }))),
                      },
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(res.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "models/gemini-3.5-transcribe",
          "input": [
            {
              "type": "file",
              "file_uri": "YOUR_FILE_URI"
            }
          ],
          "generation_config": {
            "transcription_config": {
              "mode": {
                "type": "verbatim",
                "timestamp_granularities": ["word"]
              }
            }
          }
        }'
      ```


你可以在單一請求中同時結合 `diarization_mode` 與 `timestamp_granularities`，一併取得說話者標籤與單字時間戳記：


=== "Python"

      ```python
      generation_config = {
          "transcription_config": {
              "mode": {
                  "type": "verbatim",
                  "diarization_mode": "speaker",
                  "timestamp_granularities": ["word"],
              },
          }
      }
      ```

=== "JavaScript"

      ```javascript
      const generationConfig = {
        transcriptionConfig: {
          mode: {
            type: "verbatim",
            diarizationMode: "speaker",
            timestampGranularities: ["word"],
          },
        },
      };
      ```

=== "Go"

      ```go
      package main

      import (
          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
      )

      func main() {
          generationConfig := &interactions.GenerationConfig{
              TranscriptionConfig: &interactions.TranscriptionConfig{
                  Mode: genai.Ptr(interactions.NewTranscriptionConfigMode(interactions.NewTranscriptionMode(interactions.VerbatimTranscriptionMode{
                      DiarizationMode:        genai.Ptr("speaker"),
                      TimestampGranularities: []string{"word"},
                  }))),
              },
          }
          _ = generationConfig
      }
      ```

=== "REST"

      ```json
      {
        "generation_config": {
          "transcription_config": {
            "mode": {
              "type": "verbatim",
              "diarization_mode": "speaker",
              "timestamp_granularities": ["word"]
            }
          }
        }
      }
      ```


## 轉錄模式 {#transcription-modes}

Gemini 3.5 Transcribe 透過 `mode` 參數支援兩種轉錄模式：

*   **`verbatim`（預設）**：逐字回傳所說內容的精確轉錄，保留原始的填充詞（「um」、「uh」、「like」、「you know」）、重複、停頓與誤起句。使用時間戳記或說話者分離時必須採用此模式。
*   **`smart`（智慧轉錄）**：透過智慧後處理，讓轉錄內容更易於閱讀：
    *   **去除不流暢語句**：移除對話中的填充詞、口吃與誤起句。
    *   **行內自我修正**：直接消解口頭修正（例如 *「Let's meet on Tuesday, actually no, Wednesday at two」* 會變成 *「Let's meet on Wednesday at 2:00 PM」*）。
    *   **自動結構化格式**：自動將口述想法整理成段落、編號清單、項目符號，以及格式化的日期、貨幣與數字。
    *   **文法清理**：套用自然的標點符號、句首大寫與流暢度。


| 口述音訊 | `verbatim` 輸出 | `smart`（智慧轉錄）輸出 |
| --- | --- | --- |
| "Um, so for the meeting, I think we should, uh, invite Alice and, wait no, Bob and Carol." | "Um so for the meeting I think we should uh invite Alice and wait no Bob and Carol." | "For the meeting, I think we should invite Bob and Carol." |
| "First item review budget second item finalize timeline third item send recap" | "first item review budget second item finalize timeline third item send recap" | 1. Review budget 2. Finalize timeline 3. Send recap |


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      response = client.interactions.create(
          model="gemini-3.5-transcribe",
          input=[audio_file],
          generation_config={
              "transcription_config": {
                  "mode": "smart",
              }
          },
      )
      print(response.output_text)
      ```

=== "JavaScript"

      ```javascript
      const response = await ai.interactions.create({
        model: "gemini-3.5-transcribe",
        input: [audioFile],
        generationConfig: {
          transcriptionConfig: {
            mode: "smart",
          },
        },
      });
      console.log(response.outputText);
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          audioFile, err := client.Files.UploadFromPath(ctx, "path/to/sample.mp3", nil)
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-3.5-transcribe"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.AudioContent{
                          URI:      genai.Ptr(audioFile.URI),
                          MimeType: interactions.AudioContentMimeType(audioFile.MIMEType).ToPointer(),
                      }),
                  }),
                  GenerationConfig: &interactions.GenerationConfig{
                      TranscriptionConfig: &interactions.TranscriptionConfig{
                          Mode: genai.Ptr(interactions.NewTranscriptionConfigMode(interactions.TranscriptionConfigModeEnumSmart)),
                      },
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(res.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "models/gemini-3.5-transcribe",
          "input": [
            {
              "type": "file",
              "file_uri": "YOUR_FILE_URI"
            }
          ],
          "generation_config": {
            "transcription_config": {
              "mode": "smart"
            }
          }
        }'
      ```


!!! note " "

      智慧轉錄（`"smart"`）與 `timestamp_granularities` 及 `diarization_mode` 不相容。若你需要單字時間戳記或說話者分離，請使用逐字模式（預設）。


## 解析轉錄輸出 {#parsing-output}

完整的轉錄文字會在 `response.output_text` 中回傳。

啟用 `timestamp_granularities` 或 `diarization_mode` 時，API 也會回傳附加在互動內容上的詳細單字層級註解。

以下示範如何擷取並逐一處理單字時間戳記與說話者回合：


=== "Python"

      ```python
      def extract_word_annotations(response):
          words = []
          for step in getattr(response, "steps", []) or []:
              for content in getattr(step, "content", []) or []:
                  for annotation in getattr(content, "annotations", []) or []:
                      if getattr(annotation, "type", None) == "word_info":
                          words.append(annotation)
          return words

      words = extract_word_annotations(response)

      for w in words:
          speaker = f"[{w.speaker}] " if getattr(w, "speaker", None) else ""
          start = getattr(w, "start_offset", "")
          end = getattr(w, "end_offset", "")
          timing = f"({start} -> {end}) " if start and end else ""
          print(f"{speaker}{timing}{w.text}")
      ```

=== "JavaScript"

      ```javascript
      function extractWordAnnotations(response) {
        const words = [];
        for (const step of response.steps ?? []) {
          for (const content of step.content ?? []) {
            for (const annotation of content.annotations ?? []) {
              if (annotation.type === "word_info") {
                words.push(annotation);
              }
            }
          }
        }
        return words;
      }

      const words = extractWordAnnotations(response);

      for (const w of words) {
        const speaker = w.speaker ? `[${w.speaker}] ` : "";
        const timing = (w.start_offset && w.end_offset) ? `(${w.start_offset} -> ${w.end_offset}) ` : "";
        console.log(`${speaker}${timing}${w.text}`);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "fmt"

          "google.golang.org/genai/interactions/models/interactions"
      )

      func extractWordAnnotations(interaction *interactions.Interaction) []*interactions.WordInfo {
          var words []*interactions.WordInfo
          if interaction == nil {
              return words
          }
          for _, step := range interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, content := range step.ModelOutputStep.Content {
                      if content.TextContent != nil {
                          for _, annotation := range content.TextContent.Annotations {
                              if annotation.WordInfo != nil {
                                  words = append(words, annotation.WordInfo)
                              }
                          }
                      }
                  }
              }
          }
          return words
      }

      func main() {
          var interaction *interactions.Interaction
          words := extractWordAnnotations(interaction)

          for _, w := range words {
              speaker := ""
              if w.Speaker != nil && *w.Speaker != "" {
                  speaker = fmt.Sprintf("[%s] ", *w.Speaker)
              }
              timing := ""
              if w.StartOffset != nil && w.EndOffset != nil {
                  timing = fmt.Sprintf("(%s -> %s) ", *w.StartOffset, *w.EndOffset)
              }
              fmt.Printf("%s%s%s\n", speaker, timing, w.GetText())
          }
      }
      ```

=== "REST"

      ```json
      {
        "id": "interactions/abc123xyz",
        "status": "completed",
        "steps": [
          {
            "id": "step_001",
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "Hello world",
                "annotations": [
                  {
                    "type": "word_info",
                    "text": "Hello",
                    "speaker": "spk_1",
                    "start_offset": "0.100s",
                    "end_offset": "0.400s"
                  },
                  {
                    "type": "word_info",
                    "text": "world",
                    "speaker": "spk_1",
                    "start_offset": "0.500s",
                    "end_offset": "0.800s"
                  }
                ]
              }
            ]
          }
        ]
      }
      ```


## 支援的語言 {#supported-languages}

Gemini 3.5 Transcribe 支援下列語言與 BCP-47 語言代碼：

| Language | BCP-47 Code | Language | BCP-47 Code |
| :--- | :--- | :--- | :--- |
| Afrikaans | `af-ZA` | Japanese | `ja-JP` |
| Amharic | `am-ET` | Javanese | `jv-ID` |
| Arabic (Egypt) | `ar-EG` | Kabuverdianu | `kea-CV` |
| Armenian | `hy-AM` | Kannada | `kn-IN` |
| Assamese | `as-IN` | Kazakh | `kk-KZ` |
| Azerbaijani | `az-AZ` | Korean | `ko-KR` |
| Belarusian | `be-BY` | Kyrgyz | `ky-KG` |
| Bengali (Bangladesh) | `bn-BD` | Latvian | `lv-LV` |
| Bengali (India) | `bn-IN` | Lingala | `ln-CD` |
| Bosnian | `bs-BA` | Lithuanian | `lt-LT` |
| Bulgarian | `bg-BG` | Macedonian | `mk-MK` |
| Bulgarian (Aromanian) | `rup-BG` | Malay | `ms-MY` |
| Burmese | `my-MM` | Malayalam | `ml-IN` |
| Cantonese (Traditional) | `yue-Hant-HK` | Maltese | `mt-MT` |
| Catalan | `ca-ES` | Mandarin Chinese (Simplified) | `cmn-Hans-CN` |
| Cebuano | `ceb` | Marathi | `mr-IN` |
| Central Khmer | `km-KH` | Mongolian | `mn-MN` |
| Croatian | `hr-HR` | Nepali | `ne-NP` |
| Czech | `cs-CZ` | Norwegian | `nb-NO` |
| Danish | `da-DK` | Oriya | `or-IN` |
| Dutch | `nl-NL` | Polish | `pl-PL` |
| English (Great Britain) | `en-GB` | Portuguese (Brazil) | `pt-BR` |
| English (India) | `en-IN` | Portuguese (Portugal) | `pt-PT` |
| English (United States) | `en-US` | Punjabi | `pa-IN` |
| Estonian | `et-EE` | Punjabi (Gurmukhi script) | `pa-Guru-IN` |
| Farsi | `fa-IR` | Romanian | `ro-RO` |
| Filipino | `fil-PH` | Russian | `ru-RU` |
| Finnish | `fi-FI` | Serbian | `sr-RS` |
| French | `fr-FR` | Sindhi (Arabic script) | `sd-Arab-IN` |
| Galician | `gl-ES` | Slovak | `sk-SK` |
| Georgian | `ka-GE` | Slovenian | `sl-SI` |
| German | `de-DE` | Spanish (Latin America) | `es-419` |
| Greek | `el-GR` | Spanish (United States) | `es-US` |
| Gujarati | `gu-IN` | Swahili (Kenya) | `sw-KE` |
| Hausa | `ha-NG` | Swedish | `sv-SE` |
| Hebrew | `he-IL` | Tajik | `tg-TJ` |
| Hindi | `hi-IN` | Telugu | `te-IN` |
| Hungarian | `hu-HU` | Thai | `th-TH` |
| Icelandic | `is-IS` | Turkish | `tr-TR` |
| Indian English | `en-IN` | Ukrainian | `uk-UA` |
| Indonesian | `id-ID` | Uzbek | `uz-UZ` |
| Italian | `it-IT` | Vietnamese | `vi-VN` |

## 支援的音訊格式 {#supported-formats}

Gemini 3.5 Transcribe 支援下列音訊格式 MIME 類型：

* WAV - `audio/wav`
* MP3 - `audio/mp3`
* AIFF - `audio/aiff`
* AAC - `audio/aac`
* OGG - `audio/ogg`
* FLAC - `audio/flac`
* MPEG - `audio/mpeg`
* M4A - `audio/m4a`
* L16 - `audio/l16`
* Opus - `audio/opus`
* ALAW - `audio/alaw`
* MULAW - `audio/mulaw`
* WebM - `audio/webm`

支援的 MIME 類型與參數結構定義的完整清單，請參閱 [Interactions API 參考文件](/api-reference/interactions-api/#Resource:Content)。

## 參數參考 {#parameter-reference}

在 `transcription_config` 物件（位於 `generation_config` 內）中設定欄位，即可調整轉錄行為：

| 欄位 | 類型 | 說明 |
| :--- | :--- | :--- |
| `language_codes` | 字串陣列 | BCP-47 語言代碼（例如 `["en-US"]`）。若省略或為空（`[]`），模型會自動偵測語言並處理語碼轉換。 |
| `custom_vocabulary` | 字串陣列 | 多達 1,000 個自訂詞彙、縮寫或專有名詞，用來引導語音辨識的偏向。與說話者分離及單字層級時間戳記不相容。 |
| `mode` | 物件或字串 | 轉錄模式設定。可接受 `"smart"`，或逐字模式物件（`{"type": "verbatim", ...}`）。預設為逐字轉錄。 |
| `mode.type` | 字串 | *（僅限逐字模式）*模式識別碼。一律設為 `"verbatim"`。 |
| `mode.timestamp_granularities` | 字串陣列 | *（僅限逐字模式）*要回傳的時間戳記精細程度。傳入 `["word"]` 即可啟用單字的開始與結束偏移。與自訂詞彙不相容。 |
| `mode.diarization_mode` | 字串 | *（僅限逐字模式）*分離模式。傳入 `"speaker"` 即可識別並標示不同的說話者。與自訂詞彙不相容。 |

## 最佳做法 {#best-practices}

*   **提供乾淨的音訊**：確保錄音中人聲區分清晰，並避免嚴重的削波失真。
*   **已知語言時提供語言提示**：若你事先知道音訊的語言，請指定 `language_codes` 以獲得最高的準確度。
*   **自訂詞彙要精準鎖定**：`custom_vocabulary` 中只放入明確的領域術語、品牌名稱或專有名詞，不要放入日常常見詞彙。
*   **選擇正確的檔案輸入方式**：使用 `client.files.upload` 上傳本機錄音，或略過上傳步驟，直接傳入[外部 HTTP 或已簽署的 URL](/docs/file-input-methods/#external-urls)（上限 15 MB）、[已註冊的 Google Cloud Storage URI](/docs/file-input-methods/#registration)（上限 2 GB），或[行內 base64 音訊](/docs/file-input-methods/#inline-data)。詳情請參閱[檔案輸入方式](/docs/file-input-methods/)。

## 限制 {#limitations}

*   **音訊長度**：標準的單次請求支援最長 1 小時的音訊檔案。啟用說話者分離或單字層級時間戳記等功能時，音訊處理上限為 30 分鐘。超過這些上限的音訊會在上限處截斷，但仍回傳 `status: "completed"`，因此送出請求前，請先將較長的錄音切成 30 分鐘或更短的片段。
*   **單字層級時間戳記**：啟用單字層級時間戳記可能會降低整體轉錄準確度。
*   **說話者分離**：說話者分離最多支援 8 位說話者。3 位以上說話者的歸屬判定仍屬實驗性質。
*   **自訂詞彙**：你可以在 `custom_vocabulary` 中提供多達 1,000 個詞彙，但通常以不超過 100 個詞彙時效果最佳。`custom_vocabulary` 無法與說話者分離或單字層級時間戳記併用；若請求同時指定 `custom_vocabulary` 與其中任一功能，API 會拒絕該請求。
*   **模式相容性**：智慧轉錄（`"smart"`）無法與 `timestamp_granularities` 或 `diarization_mode` 併用。

## 後續步驟 {#whats-next}

*   運用 Live API，透過[即時轉錄指南](/docs/live-api/live-transcribe/)串流即時音訊。
*   探索[音訊理解](/docs/audio/)，分析、摘要或查詢音訊內容。
*   瞭解如何使用[文字轉語音](/docs/speech-generation/)，將文字合成為音訊。
*   查看[定價頁面](/docs/pricing/#gemini-3.5-transcribe)，瞭解模型定價與權杖上限。
*   比較[檔案輸入方式](/docs/file-input-methods/)與 [Files API](/docs/files/) 指南，瞭解如何傳遞與管理音訊檔案。
