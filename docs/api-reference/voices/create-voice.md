# 建立語音


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 下。


`POST` `https://generativelanguage.googleapis.com/v1beta/voices`

透過自然語言提示詞（`VOICE_TYPE_PROMPTED`），或透過參考錄音與同意錄音（`VOICE_TYPE_REPLICATED`），建立自訂語音。


  
## 請求主體 {#request-body}

  
  **voice**: required [`Voice`](/api-reference/voices/create-voice/#Resource:Voice)

  要建立的語音。`voice.model` 為選填；若省略，服務會選取預設的語音建立模型。若設定了 [`Voice`](/api-reference/voices/create-voice/#Resource:Voice) 上的僅供輸出欄位（`id`、`key`、`expire_time`、`usage`），將會被忽略。

  

---


  **store**: `boolean`

  選填。建立的語音是否由 Google 持久保存並管理。

  - 當為 `true` 時，Google 會儲存該語音並回傳 `Voice.id`（例如 `voice_abc123def456`），可透過 `GetVoice`、`ListVoices` 與 `DeleteVoice` 管理，並在合成請求中以 ID 參照。已儲存的語音在 1 年未使用後到期；在語音合成中使用已儲存的語音，或作為 `base_voice` 在 `CreateVoice` 中使用，都會延長其 `expire_time`。每個專案都有使用中已儲存語音的配額上限；超過配額會回傳 `RESOURCE_EXHAUSTED`。
  - 當為 `false`（預設）時，Google 不會儲存該語音，而是回傳 `Voice.key`（例如 `voicekey_...`）供用戶端儲存與合成使用。`voice` 上的選填探索中繼資料欄位，在 `store` 為 `false` 時不會被持久保存，也不會回傳。
  - 必須為 `true`：當 `voice.type` 為 `"prompted"` 時（否則會以 `INVALID_ARGUMENT` 失敗）。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl -X POST https://generativelanguage.googleapis.com/v1beta/voices \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "store": true,
          "voice": {
            "type": "prompted",
            "display_name": "Warm Narrator",
            "language_code": "en-US",
            "prompted": {
              "input": "A warm, friendly narrator voice with a calm pace."
            }
          }
        }'
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})
      voice = client.voices.create(
          store=True,
          voice={
              "type": "prompted",
              "display_name": "Warm Narrator",
              "language_code": "en-US",
              "prompted": {
                  "input": "A warm, friendly narrator voice with a calm pace.",
              },
          },
      )
      print(voice.id)
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({apiVersion: 'v1beta'});
      const voice = await ai.voices.create({
        store: true,
        voice: {
          type: 'prompted',
          display_name: 'Warm Narrator',
          language_code: 'en-US',
          prompted: {
            input: 'A warm, friendly narrator voice with a calm pace.',
          },
        },
      });
      console.log(voice.id);
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "google.golang.org/genai"
          gaos_voices "google.golang.org/genai/interactions/models/voices"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{
              HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
          })
          if err != nil {
              log.Fatal(err)
          }

          req := operations.CreateVoiceRequest{
              Body: gaos_voices.CreateVoiceRequest{
                  Store: genai.Ptr(true),
                  Voice: gaos_voices.VoiceInput{
                      Type:         gaos_voices.VoiceTypePrompted,
                      DisplayName:  genai.Ptr("Warm Narrator"),
                      LanguageCode: genai.Ptr("en-US"),
                      Prompted: &gaos_voices.PromptedVoice{
                          Input: "A warm, friendly narrator voice with a calm pace.",
                      },
                  },
              },
          }

          res, err := client.Voices.Create(ctx, req)
          if err != nil {
              log.Fatal(err)
          }

          if res.Voice != nil && res.Voice.ID != nil {
              fmt.Println(*res.Voice.ID)
          }
      }
      ```


  


## 回應 {#response}


  

??? note "**type**: required `VoiceType` 語音的類型。在 `CreateVoice` 中，必須為 `"replicated"` 或 `"prompted"`。在 `ListVoices` 回應中，也可以是 `"prebuilt"`。"

    可能的值：

    - `replicated`: 透過參考音訊範本與說話者同意錄音複製出的自訂語音。
    - `prompted`: 透過自然語言文字提示詞產生的自訂語音（可選擇編輯或混音 `base_voice`）。
    - `prebuilt`: Google 語音目錄中的內建系統語音（例如 `Puck`、`Charon`）。會在回應中回傳；無法在 `CreateVoice` 中指定為類型。



  

---


  **id**: `string`

  僅供輸出。語音的唯一識別碼。

  - 對於 Google 管理的自訂語音（`store = true`），這是產生的 ID，帶有 `voice_` 前綴（例如 `voice_abc123def456`）。將 `voices/{id}` 作為 `name`，在 `GetVoice` 與 `DeleteVoice` 中傳入；在語音合成期間，將 `{id}` 直接傳入 `SpeechConfig.voice_config.voice`（或 `SpeechConfig.voice`）。
  - 對於預建目錄語音（`"prebuilt"`，由 `ListVoices` 回傳），這是說話者名稱（例如 `Puck` 或 `Charon`）。
  - `CreateVoice` 以 `store = false` 呼叫時不會設定。

  

---


  **model**: `string`

  選填。用來設計或複製語音的模型。若在 `CreateVoice` 中省略，預設為最新支援的語音設計模型。對於自訂語音，會在 `CreateVoice`、`GetVoice` 與 `ListVoices` 回應中回傳（`"prompted"` 與 `"replicated"`）；對於 `"prebuilt"` 語音則不會設定。建立的語音可在任何支援的 TTS 合成模型間合成。

  

---


  **key**: `string`

  僅供輸出。由用戶端管理的語音複製金鑰（帶有 `voicekey_` 前綴）。僅由 `CreateVoice` 回傳，條件為 `type` 為 `"replicated"` 且 `store` 為 `false`。在語音合成期間，將此金鑰傳入 `SpeechConfig.voice_config.voice`（或 `SpeechConfig.voice`）。

  

---


  **expire_time**: `string`

  僅供輸出。自訂已儲存語音（`store = true`）或複製語音金鑰（`store = false`）到期的時間戳記。對於自訂已儲存語音（`store = true`），當語音用於語音合成，或作為 `base_voice` 在 `CreateVoice` 中使用時，此到期時間會延長。預建目錄語音（`"prebuilt"`）不會設定，因為它們不會到期。

  

---


  **display_name**: `string`

  選填。使用者為已儲存語音（`store = true`）提供的顯示名稱，或預建語音的目錄名稱。

  

---


  

??? note "**prompted**: `PromptedVoice` 提示詞語音產生的參數。在 `CreateVoice` 中，當 `type` 為 `"prompted"` 時必填。對於提示詞語音，會在 `CreateVoice`、`GetVoice` 與 `ListVoices` 回應中回傳。"

    **input**: required `string`

    描述目標語音的自然語言提示詞，例如 "A deep, booming male voice of a massive evil ogre in his middle years."

    **base_voice**: `string`

    選填。要編輯或混音的現有基礎語音的名稱或 ID。預建語音使用語音名稱（例如 `Puck`），先前建立的語音使用語音 ID（例如 `voice_abc123`）。可以是使用者有權存取的任何提示詞語音或複製語音。若有提供，`input` 描述要對基礎語音做的相對調整。



  

---


  **language_code**: `string`

  選填。主要的 BCP-47 語言標籤（例如 "en-US"、"fr-FR"）。

  

---


  **region_code**: `string`

  選填。ISO 3166-1 alpha-2 或 UN M.49 地理區碼（例如 "US"、"GB"、"001"）。

  

---


  **accent**: `string`

  選填。地區口音描述（例如 "American"、"British"）。

  

---


  **persona**: `string`

  選填。目標人設或角色原型（例如 "Warm, Friendly"、"Narrator"）。

  

---


  **context**: `string`

  選填。最佳使用情境或領域（例如 "Conversational"、"Audiobook"、"News"）。

  

---


  **gender**: `string`

  選填。感知到的語音性別呈現（例如 "female"、"male"、"neutral"）。

  

---


  

??? note "**pitch**: `Pitch` 選填。語音音高分類。"

    可能的值：

    - `low`: 音高較低的語音。
    - `medium`: 音高中等的語音。
    - `high`: 音高較高的語音。



  

---


  **description**: `string`

  選填。聲音音色、個性與語氣的描述摘要。

  

---

  

??? note "**usage**: `Usage` 僅供輸出。語音建立請求的權杖使用統計。僅在 `CreateVoice` 的回應中填入，條件為 `type` 為 `"prompted"`；對於 `"replicated"`，以及在 `GetVoice` 與 `ListVoices` 回應中，則不會設定。"

      **total_input_tokens**: `integer`

      提示詞（上下文）中的權杖數量。

      **initial_input_tokens**: `integer`

      此互動第一輪使用的輸入權杖數量。



    ??? note "**input_tokens_by_modality**: `ModalityTokens array` 依模態區分的輸入權杖使用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`: 表示模型應回傳文字。
            - `image`: 表示模型應回傳圖片。
            - `audio`: 表示模型應回傳音訊。
            - `video`: 表示模型應回傳影片。
            - `document`: 表示模型應回傳文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_cached_tokens**: `integer`

      提示詞中已快取部分的權杖數量（快取內容）。



    ??? note "**cached_tokens_by_modality**: `ModalityTokens array` 依模態區分的快取權杖使用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`: 表示模型應回傳文字。
            - `image`: 表示模型應回傳圖片。
            - `audio`: 表示模型應回傳音訊。
            - `video`: 表示模型應回傳影片。
            - `document`: 表示模型應回傳文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_output_tokens**: `integer`

      所有產生的回應的權杖總數。



    ??? note "**output_tokens_by_modality**: `ModalityTokens array` 依模態區分的輸出權杖使用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`: 表示模型應回傳文字。
            - `image`: 表示模型應回傳圖片。
            - `audio`: 表示模型應回傳音訊。
            - `video`: 表示模型應回傳影片。
            - `document`: 表示模型應回傳文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_tool_use_tokens**: `integer`

      工具使用提示詞中存在的權杖數量。



    ??? note "**tool_use_tokens_by_modality**: `ModalityTokens array` 依模態區分的工具使用權杖使用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`: 表示模型應回傳文字。
            - `image`: 表示模型應回傳圖片。
            - `audio`: 表示模型應回傳音訊。
            - `video`: 表示模型應回傳影片。
            - `document`: 表示模型應回傳文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_thought_tokens**: `integer`

      思考模型的思考權杖數量。

      **total_tokens**: `integer`

      互動請求的權杖總數（提示詞 + 回應 + 其他內部權杖）。



    ??? note "**grounding_tool_count**: `GroundingToolCount array` 接地工具數量。"

        ??? note "**type**: `string enum` 與數量相關聯的接地工具類型。"

            可能的值：

            - `google_search`: 使用 Google 網路搜尋與圖片搜尋接地，以及 Web Grounding for Enterprise。
            - `google_maps`: 使用 Google Maps 接地。



          **count**: `integer`

          接地工具的數量。



  

---


  

??? note "**sample_audio**: `AudioData` 僅供輸出。為提示詞語音產生的範例音訊（合成器提示詞音訊）。僅在 `CreateVoice` 與 `GetVoice` 回應中填入，條件為 `type` 為 `"prompted"`；在 `ListVoices` 回應中，以及對於 `"replicated"` 或 `"prebuilt"` 語音，則不會設定。"

    **mime_type**: required `string`

    音訊資料的 IANA MIME 類型（例如 `audio/wav` 或 `audio/mpeg`）。

    **data**: required `string`

    原始音訊位元組。



## 資源 {#resources}

### Voice {#Resource:Voice}

語音資源，表示自訂語音（透過 `CreateVoice` 建立）或預建系統語音（由 `ListVoices` 回傳）。

**屬性**：


  

??? note "**type**: required `VoiceType` 語音的類型。在 `CreateVoice` 中，必須為 `"replicated"` 或 `"prompted"`。在 `ListVoices` 回應中，也可以是 `"prebuilt"`。"

    可能的值：

    - `replicated`: 透過參考音訊範本與說話者同意錄音複製出的自訂語音。
    - `prompted`: 透過自然語言文字提示詞產生的自訂語音（可選擇編輯或混音 `base_voice`）。
    - `prebuilt`: Google 語音目錄中的內建系統語音（例如 `Puck`、`Charon`）。會在回應中回傳；無法在 `CreateVoice` 中指定為類型。



  

---


  **id**: `string`

  僅供輸出。語音的唯一識別碼。

  - 對於 Google 管理的自訂語音（`store = true`），這是產生的 ID，帶有 `voice_` 前綴（例如 `voice_abc123def456`）。將 `voices/{id}` 作為 `name`，在 `GetVoice` 與 `DeleteVoice` 中傳入；在語音合成期間，將 `{id}` 直接傳入 `SpeechConfig.voice_config.voice`（或 `SpeechConfig.voice`）。
  - 對於預建目錄語音（`"prebuilt"`，由 `ListVoices` 回傳），這是說話者名稱（例如 `Puck` 或 `Charon`）。
  - `CreateVoice` 以 `store = false` 呼叫時不會設定。

  

---


  **model**: `string`

  選填。用來設計或複製語音的模型。若在 `CreateVoice` 中省略，預設為最新支援的語音設計模型。對於自訂語音，會在 `CreateVoice`、`GetVoice` 與 `ListVoices` 回應中回傳（`"prompted"` 與 `"replicated"`）；對於 `"prebuilt"` 語音則不會設定。建立的語音可在任何支援的 TTS 合成模型間合成。

  

---


  **key**: `string`

  僅供輸出。由用戶端管理的語音複製金鑰（帶有 `voicekey_` 前綴）。僅由 `CreateVoice` 回傳，條件為 `type` 為 `"replicated"` 且 `store` 為 `false`。在語音合成期間，將此金鑰傳入 `SpeechConfig.voice_config.voice`（或 `SpeechConfig.voice`）。

  

---


  

??? note "**replicated**: `ReplicatedVoice` 僅供輸入。複製語音產生的參數。當 `type` 為 `"replicated"` 時，輸入中必填。不會在回應中回傳。"

    ??? note "**source_audio**: required `AudioData` 要複製的說話者語音參考音訊範本。必須是成人聲音的未修改錄音。"

        **mime_type**: required `string`

        音訊資料的 IANA MIME 類型（例如 `audio/wav` 或 `audio/mpeg`）。

        **data**: required `string`

        原始音訊位元組。





    ??? note "**consent_audio**: required `AudioData` 同一位說話者朗讀必要同意詞句的錄音，確認授權複製其語音。"

        **mime_type**: required `string`

        音訊資料的 IANA MIME 類型（例如 `audio/wav` 或 `audio/mpeg`）。

        **data**: required `string`

        原始音訊位元組。



  

---


  **expire_time**: `string`

  僅供輸出。自訂已儲存語音（`store = true`）或複製語音金鑰（`store = false`）到期的時間戳記。對於自訂已儲存語音（`store = true`），當語音用於語音合成，或作為 `base_voice` 在 `CreateVoice` 中使用時，此到期時間會延長。預建目錄語音（`"prebuilt"`）不會設定，因為它們不會到期。

  

---


  **display_name**: `string`

  選填。使用者為已儲存語音（`store = true`）提供的顯示名稱，或預建語音的目錄名稱。

  

---


  

??? note "**prompted**: `PromptedVoice` 提示詞語音產生的參數。在 `CreateVoice` 中，當 `type` 為 `"prompted"` 時必填。對於提示詞語音，會在 `CreateVoice`、`GetVoice` 與 `ListVoices` 回應中回傳。"

    **input**: required `string`

    描述目標語音的自然語言提示詞，例如 "A deep, booming male voice of a massive evil ogre in his middle years."

    **base_voice**: `string`

    選填。要編輯或混音的現有基礎語音的名稱或 ID。預建語音使用語音名稱（例如 `Puck`），先前建立的語音使用語音 ID（例如 `voice_abc123`）。可以是使用者有權存取的任何提示詞語音或複製語音。若有提供，`input` 描述要對基礎語音做的相對調整。



  

---


  **language_code**: `string`

  選填。主要的 BCP-47 語言標籤（例如 "en-US"、"fr-FR"）。

  

---


  **region_code**: `string`

  選填。ISO 3166-1 alpha-2 或 UN M.49 地理區碼（例如 "US"、"GB"、"001"）。

  

---


  **accent**: `string`

  選填。地區口音描述（例如 "American"、"British"）。

  

---


  **persona**: `string`

  選填。目標人設或角色原型（例如 "Warm, Friendly"、"Narrator"）。

  

---


  **context**: `string`

  選填。最佳使用情境或領域（例如 "Conversational"、"Audiobook"、"News"）。

  

---


  **gender**: `string`

  選填。感知到的語音性別呈現（例如 "female"、"male"、"neutral"）。

  

---


  

??? note "**pitch**: `Pitch` 選填。語音音高分類。"

    可能的值：

    - `low`: 音高較低的語音。
    - `medium`: 音高中等的語音。
    - `high`: 音高較高的語音。



  

---


  **description**: `string`

  選填。聲音音色、個性與語氣的描述摘要。

  

---

  

??? note "**usage**: `Usage` 僅供輸出。語音建立請求的權杖使用統計。僅在 `CreateVoice` 的回應中填入，條件為 `type` 為 `"prompted"`；對於 `"replicated"`，以及在 `GetVoice` 與 `ListVoices` 回應中，則不會設定。"

      **total_input_tokens**: `integer`

      提示詞（上下文）中的權杖數量。

      **initial_input_tokens**: `integer`

      此互動第一輪使用的輸入權杖數量。



    ??? note "**input_tokens_by_modality**: `ModalityTokens array` 依模態區分的輸入權杖使用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`: 表示模型應回傳文字。
            - `image`: 表示模型應回傳圖片。
            - `audio`: 表示模型應回傳音訊。
            - `video`: 表示模型應回傳影片。
            - `document`: 表示模型應回傳文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_cached_tokens**: `integer`

      提示詞中已快取部分的權杖數量（快取內容）。



    ??? note "**cached_tokens_by_modality**: `ModalityTokens array` 依模態區分的快取權杖使用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`: 表示模型應回傳文字。
            - `image`: 表示模型應回傳圖片。
            - `audio`: 表示模型應回傳音訊。
            - `video`: 表示模型應回傳影片。
            - `document`: 表示模型應回傳文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_output_tokens**: `integer`

      所有產生的回應的權杖總數。



    ??? note "**output_tokens_by_modality**: `ModalityTokens array` 依模態區分的輸出權杖使用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`: 表示模型應回傳文字。
            - `image`: 表示模型應回傳圖片。
            - `audio`: 表示模型應回傳音訊。
            - `video`: 表示模型應回傳影片。
            - `document`: 表示模型應回傳文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_tool_use_tokens**: `integer`

      工具使用提示詞中存在的權杖數量。



    ??? note "**tool_use_tokens_by_modality**: `ModalityTokens array` 依模態區分的工具使用權杖使用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`: 表示模型應回傳文字。
            - `image`: 表示模型應回傳圖片。
            - `audio`: 表示模型應回傳音訊。
            - `video`: 表示模型應回傳影片。
            - `document`: 表示模型應回傳文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_thought_tokens**: `integer`

      思考模型的思考權杖數量。

      **total_tokens**: `integer`

      互動請求的權杖總數（提示詞 + 回應 + 其他內部權杖）。



    ??? note "**grounding_tool_count**: `GroundingToolCount array` 接地工具數量。"

        ??? note "**type**: `string enum` 與數量相關聯的接地工具類型。"

            可能的值：

            - `google_search`: 使用 Google 網路搜尋與圖片搜尋接地，以及 Web Grounding for Enterprise。
            - `google_maps`: 使用 Google Maps 接地。



          **count**: `integer`

          接地工具的數量。



  

---


  

??? note "**sample_audio**: `AudioData` 僅供輸出。為提示詞語音產生的範例音訊（合成器提示詞音訊）。僅在 `CreateVoice` 與 `GetVoice` 回應中填入，條件為 `type` 為 `"prompted"`；在 `ListVoices` 回應中，以及對於 `"replicated"` 或 `"prebuilt"` 語音，則不會設定。"

    **mime_type**: required `string`

    音訊資料的 IANA MIME 類型（例如 `audio/wav` 或 `audio/mpeg`）。

    **data**: required `string`

    原始音訊位元組。
