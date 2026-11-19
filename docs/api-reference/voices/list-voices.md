# 列出語音


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 之下。


`GET` `https://generativelanguage.googleapis.com/v1beta/voices`

列出呼叫者擁有的自訂已儲存語音（由新到舊排序），
其後接著 Google 語音目錄中的預建系統語音。


  
## 參數 {#parameters}

  
  **accent**: `string array`

  選填。依口音描述篩選（例如 "American"、"British"）。不區分大小寫的完全比對。若指定多個值，會比對具有任一指定口音的語音（OR）。

  

---


  **context**: `string array`

  選填。依預期情境或領域篩選（例如 "News, Commercial"）。不區分大小寫的完全比對。若指定多個值，會比對具有任一指定情境的語音（OR）。

  

---


  **gender**: `string array`

  選填。依性別呈現篩選（例如 "female"、"male"、"neutral"）。不區分大小寫的完全比對。若指定多個值，會比對具有任一指定性別的語音（OR）。

  

---


  **language_code**: `string array`

  選填。依 BCP-47 語言代碼篩選（例如 "en-US"）。不區分大小寫的完全比對。若指定多個值，會比對具有任一指定語言代碼的語音（OR）。

  

---


  **page_size**: `integer`

  選填。每頁傳回的語音數量上限。服務傳回的數量可能少於此值。未指定時，最多傳回 50 個語音。最大值為 1000；超過 1000 的值會強制設為 1000。

  

---


  **page_token**: `string`

  選填。從先前的 `ListVoices` 呼叫收到的分頁 token。提供此 token 以擷取下一頁。分頁時，所有篩選查詢參數（`language_code`、`region_code`、`accent`、`persona`、`context`、`gender`、`pitch`、`type` 與 `search`）都必須與傳回此 token 的呼叫一致；否則要求會以 `INVALID_ARGUMENT` 失敗。各頁之間的 `page_size` 可以變更。

  

---


  **persona**: `string array`

  選填。依語音人設篩選（例如 "Warm, Friendly"）。不區分大小寫的完全比對。若指定多個值，會比對具有任一指定人設的語音（OR）。

  

---


  **pitch**: `string array`

  選填。依語音音高篩選。接受 `"low"`、`"medium"`、`"high"`（不區分大小寫）。若指定多個值，會比對具有任一指定音高的語音（OR）。

  

---


  **region_code**: `string array`

  選填。依 ISO 3166-1 alpha-2 或 UN M.49 區域代碼篩選（例如 "US"、"001"）。不區分大小寫的完全比對。若指定多個值，會比對具有任一指定區域代碼的語音（OR）。

  

---


  **search**: `string`

  選填。自由文字子字串搜尋查詢，會不區分大小寫地比對 `display_name` 與 `description`。上限為 2048 位元組。

  

---


  **type**: `string array`

  選填。依語音類型篩選。接受 `"prebuilt"`、`"replicated"`、`"prompted"`（不區分大小寫）。若指定多個值，會比對具有任一指定類型的語音（OR）。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl -X GET https://generativelanguage.googleapis.com/v1beta/voices \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})
      response = client.voices.list()
      for voice in response.voices or []:
        print(voice.id, voice.display_name)
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({apiVersion: 'v1beta'});
      const response = await ai.voices.list();
      for (const voice of response.voices ?? []) {
        console.log(voice.id, voice.display_name);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "google.golang.org/genai"
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

          res, err := client.Voices.List(ctx, operations.ListVoicesRequest{})
          if err != nil {
              log.Fatal(err)
          }

          if res.ListVoicesResponse != nil {
              for _, voice := range res.ListVoicesResponse.Voices {
                  if voice.ID != nil && voice.DisplayName != nil {
                      fmt.Println(*voice.ID, *voice.DisplayName)
                  }
              }
          }
      }
      ```


  


## 回應 {#response}


  **voices**: [`Voice`](/api-reference/voices/list-voices/#Resource:Voice) `array`

  來自指定集合的語音。

  

---


  **next_page_token**: `string`

  可作為 `page_token` 傳送以擷取下一頁的 token。若為空，表示沒有後續頁面。


## 資源 {#resources}

### Voice {#Resource:Voice}

代表自訂語音（透過
`CreateVoice` 建立）或預建系統語音（由 `ListVoices` 傳回）的語音資源。

**屬性：**


  

??? note "**type**: required `VoiceType` 語音的類型。在 `CreateVoice` 中，必須是 `"replicated"` 或 `"prompted"`。在 `ListVoices` 回應中，也可以是 `"prebuilt"`。"

    可能的值：

    - `replicated`：根據參考音訊範本與說話者同意錄音複製出的自訂語音。
    - `prompted`：根據自然語言文字提示詞產生的自訂語音（可選擇編輯或混音 `base_voice`）。
    - `prebuilt`：Google 語音目錄中的內建系統語音（例如 `Puck`、`Charon`）。會在回應中傳回；無法在 `CreateVoice` 中指定為類型。



  

---


  **id**: `string`

  僅供輸出。語音的唯一識別碼。

  - 對於 Google 管理的自訂語音（`store = true`），這是產生的 ID，前綴為 `voice_`（例如 `voice_abc123def456`）。將 `voices/{id}` 作為 `name`，在 `GetVoice` 與 `DeleteVoice` 中傳入；在語音合成時，將 `{id}` 直接傳給 `SpeechConfig.voice_config.voice`（或 `SpeechConfig.voice`）。
  - 對於預建目錄語音（`"prebuilt"`，由 `ListVoices` 傳回），這是說話者名稱（例如 `Puck` 或 `Charon`）。
  - 當 `CreateVoice` 以 `store = false` 呼叫時不會設定。

  

---


  **model**: `string`

  選填。用於設計或複製語音的模型。在 `CreateVoice` 中省略時，預設使用最新支援的語音設計模型。會在 `CreateVoice`、`GetVoice` 與 `ListVoices` 回應中針對自訂語音（`"prompted"` 與 `"replicated"`）傳回；`"prebuilt"` 語音則不會設定。建立的語音可透過任何支援的 TTS 合成模型進行合成。

  

---


  **key**: `string`

  僅供輸出。由用戶端管理的語音複製金鑰（前綴為 `voicekey_`）。僅由 `CreateVoice` 在 `type` 為 `"replicated"` 且 `store` 為 `false` 時傳回。在語音合成時，將此金鑰傳給 `SpeechConfig.voice_config.voice`（或 `SpeechConfig.voice`）。

  

---


  

??? note "**replicated**: `ReplicatedVoice` 僅供輸入。複製語音產生的參數。輸入時，當 `type` 為 `"replicated"` 時必填。不會在回應中傳回。"

    ??? note "**source_audio**: required `AudioData` 要複製的說話者語音的參考音訊範本。必須是成人聲音的未經修改錄音。"

        **mime_type**: required `string`

        音訊資料的 IANA MIME 類型（例如 `audio/wav` 或 `audio/mpeg`）。

        **data**: required `string`

        原始音訊位元組。





    ??? note "**consent_audio**: required `AudioData` 同一位說話者朗讀必要同意詞句的音訊錄音，確認已授權複製該語音。"

        **mime_type**: required `string`

        音訊資料的 IANA MIME 類型（例如 `audio/wav` 或 `audio/mpeg`）。

        **data**: required `string`

        原始音訊位元組。



  

---


  **expire_time**: `string`

  僅供輸出。自訂已儲存語音（`store = true`）或複製語音金鑰（`store = false`）到期的時間戳記。對於自訂已儲存語音（`store = true`），當語音用於語音合成，或作為 `base_voice` 在 `CreateVoice` 中使用時，此到期時間會延長。預建目錄語音（`"prebuilt"`）不會設定，因為這類語音不會到期。

  

---


  **display_name**: `string`

  選填。使用者為已儲存語音（`store = true`）提供的顯示名稱，或預建語音的目錄名稱。

  

---


  

??? note "**prompted**: `PromptedVoice` 提示詞語音產生的參數。在 `CreateVoice` 中，當 `type` 為 `"prompted"` 時必填。會在 `CreateVoice`、`GetVoice` 與 `ListVoices` 回應中針對提示詞語音傳回。"

    **input**: required `string`

    描述目標語音的自然語言提示詞，例如 "A deep, booming male voice of a massive evil ogre in his middle years."

    **base_voice**: `string`

    選填。要編輯或混音的既有基礎語音的名稱或 ID。預建語音使用語音名稱（例如 `Puck`），先前建立的語音使用語音 ID（例如 `voice_abc123`）。可以是使用者有權存取的任何提示詞語音或複製語音。設定此欄位時，`input` 描述要對基礎語音做的相對調整。



  

---


  **language_code**: `string`

  選填。主要的 BCP-47 語言標籤（例如 "en-US"、"fr-FR"）。

  

---


  **region_code**: `string`

  選填。ISO 3166-1 alpha-2 或 UN M.49 地理區域代碼（例如 "US"、"GB"、"001"）。

  

---


  **accent**: `string`

  選填。地區口音描述（例如 "American"、"British"）。

  

---


  **persona**: `string`

  選填。預期的人設或角色原型（例如 "Warm, Friendly"、"Narrator"）。

  

---


  **context**: `string`

  選填。最佳使用情境或領域（例如 "Conversational"、"Audiobook"、"News"）。

  

---


  **gender**: `string`

  選填。感知到的語音性別呈現（例如 "female"、"male"、"neutral"）。

  

---


  

??? note "**pitch**: `Pitch` 選填。語音音高分類。"

    可能的值：

    - `low`：音高較低的語音。
    - `medium`：音高適中的語音。
    - `high`：音高較高的語音。



  

---


  **description**: `string`

  選填。聲音音色、個性與語調的描述性摘要。

  

---


  

??? note "**usage**: `Usage` 僅供輸出。語音建立請求的 token 用量統計。僅在 `CreateVoice` 的回應中，當 `type` 為 `"prompted"` 時填入；`"replicated"` 以及 `GetVoice` 與 `ListVoices` 回應中不會設定。"

      **total_input_tokens**: `integer`

      提示詞（上下文）中的 token 數量。

      **initial_input_tokens**: `integer`

      此互動第一輪使用的輸入 token 數量。



    ??? note "**input_tokens_by_modality**: `ModalityTokens array` 依模態區分的輸入 token 用量明細。"

        ??? note "**modality**: `ResponseModality` 與 token 數量相關聯的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**: `integer`

          該模態的 token 數量。



      **total_cached_tokens**: `integer`

      提示詞中已快取部分的 token 數量（快取內容）。



    ??? note "**cached_tokens_by_modality**: `ModalityTokens array` 依模態區分的快取 token 用量明細。"

        ??? note "**modality**: `ResponseModality` 與 token 數量相關聯的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**: `integer`

          該模態的 token 數量。



      **total_output_tokens**: `integer`

      所有產生回應的 token 總數。



    ??? note "**output_tokens_by_modality**: `ModalityTokens array` 依模態區分的輸出 token 用量明細。"

        ??? note "**modality**: `ResponseModality` 與 token 數量相關聯的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**: `integer`

          該模態的 token 數量。



      **total_tool_use_tokens**: `integer`

      工具使用提示詞中存在的 token 數量。



    ??? note "**tool_use_tokens_by_modality**: `ModalityTokens array` 依模態區分的工具使用 token 用量明細。"

        ??? note "**modality**: `ResponseModality` 與 token 數量相關聯的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**: `integer`

          該模態的 token 數量。



      **total_thought_tokens**: `integer`

      思考模型的思考 token 數量。

      **total_tokens**: `integer`

      互動請求的 token 總數（提示詞 + 回應 + 其他內部 token）。



    ??? note "**grounding_tool_count**: `GroundingToolCount array` 接地工具計數。"

        ??? note "**type**: `string enum` 與計數相關聯的接地工具類型。"

            可能的值：

            - `google_search`：使用 Google Web Search 與 Image Search 接地，以及 Web Grounding for Enterprise。
            - `google_maps`：使用 Google Maps 接地。



          **count**: `integer`

          接地工具計數的數量。



  

---


  

??? note "**sample_audio**: `AudioData` 僅供輸出。為提示詞語音產生的範例音訊（合成器提示詞音訊）。僅在 `CreateVoice` 與 `GetVoice` 回應中，當 `type` 為 `"prompted"` 時填入；`ListVoices` 回應以及 `"replicated"` 或 `"prebuilt"` 語音不會設定。"

    **mime_type**: required `string`

    音訊資料的 IANA MIME 類型（例如 `audio/wav` 或 `audio/mpeg`）。

    **data**: required `string`

    原始音訊位元組。


