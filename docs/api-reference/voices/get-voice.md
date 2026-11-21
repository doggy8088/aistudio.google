# 取得語音


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 之下。


`GET` `https://generativelanguage.googleapis.com/v1beta/voices/{voicesId}`

依資源名稱取得自訂的已儲存語音（`store = true`）。
預建目錄語音（`VOICE_TYPE_PREBUILT`）無法以這種方式取得；請改為列出語音。


  
## 參數 {#parameters}

  
  **voicesId**: required `string`

  要取得的自訂已儲存語音的資源名稱（例如 `voices/voice_abc123def456`）。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl -X GET https://generativelanguage.googleapis.com/v1beta/voices/voice_abc123 \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})
      voice = client.voices.get(id="voice_abc123")
      print(voice.id, voice.display_name)
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({apiVersion: 'v1beta'});
      const voice = await ai.voices.get('voice_abc123');
      console.log(voice.id, voice.display_name);
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

          res, err := client.Voices.Get(ctx, operations.GetVoiceRequest{
              ID: "voice_abc123",
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Voice != nil && res.Voice.ID != nil && res.Voice.DisplayName != nil {
              fmt.Println(*res.Voice.ID, *res.Voice.DisplayName)
          }
      }
      ```


  


## 回應 {#response}


  

??? note "**type**: required `VoiceType` 語音的類型。建立語音時，必須是 `"replicated"` 或 `"prompted"`。列出語音時，也可以是 `"prebuilt"`。"

    可能的值：

    - `replicated`：根據參考音訊範本與說話者同意錄音複製出的自訂語音。
    - `prompted`：根據自然語言文字提示詞產生的自訂語音（可選擇編輯或混音 `base_voice`）。
    - `prebuilt`：Google 語音目錄中的內建系統語音（例如 `Puck`、`Charon`）。會在回應中傳回；建立語音時無法指定為類型。



  

---


  **id**: `string`

  僅供輸出。語音的唯一識別碼。

  - 對於 Google 管理的自訂語音（`store = true`），這是產生的 ID，前綴為 `voice_`（例如 `voice_abc123def456`）。將 `voices/{id}` 作為 `name`，在取得或刪除語音時傳入；在語音合成時，將 `{id}` 直接傳給 `SpeechConfig.voice_config.voice`（或 `SpeechConfig.voice`）。
  - 對於預建目錄語音（`"prebuilt"`，列出語音時傳回），這是說話者名稱（例如 `Puck` 或 `Charon`）。
  - 建立語音時若 `store = false`，不會設定。

  

---


  **model**: `string`

  選填。用於設計或複製語音的模型。建立語音時若省略，預設使用最新支援的語音設計模型。會在建立、取得或列出語音的回應中針對自訂語音（`"prompted"` 與 `"replicated"`）傳回；`"prebuilt"` 語音則不會設定。建立的語音可透過任何支援的 TTS 合成模型進行合成。

  

---


  **key**: `string`

  僅供輸出。由用戶端管理的語音複製金鑰（前綴為 `voicekey_`）。僅在建立語音時，於 `type` 為 `"replicated"` 且 `store` 為 `false` 的情況下傳回。在語音合成時，將此金鑰傳給 `SpeechConfig.voice_config.voice`（或 `SpeechConfig.voice`）。

  

---


  **expire_time**: `string`

  僅供輸出。自訂已儲存語音（`store = true`）或複製語音金鑰（`store = false`）到期的時間戳記。對於自訂已儲存語音（`store = true`），當語音用於語音合成，或作為 `base_voice` 在建立另一個語音時使用，此到期時間會延長。預建目錄語音（`"prebuilt"`）不會設定，因為這類語音不會到期。

  

---


  **display_name**: `string`

  選填。使用者為已儲存語音（`store = true`）提供的顯示名稱，或預建語音的目錄名稱。

  

---


  

??? note "**prompted**: `PromptedVoice` 提示詞語音產生的參數。建立語音時，當 `type` 為 `"prompted"` 時必填。建立、取得或列出提示詞語音時，會在回應中針對提示詞語音傳回。"

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


  

??? note "**usage**: `Usage` 僅供輸出。語音建立請求的 token 用量統計。僅在建立語音的回應中，當 `type` 為 `"prompted"` 時填入；`"replicated"` 以及取得或列出語音時不會設定。"

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


  

??? note "**sample_audio**: `AudioData` 僅供輸出。為提示詞語音產生的範例音訊（合成器提示詞音訊）。僅在建立或取得語音時，當 `type` 為 `"prompted"` 時填入；列出語音時以及 `"replicated"` 或 `"prebuilt"` 語音不會設定。"

    **mime_type**: required `string`

    音訊資料的 IANA MIME 類型（例如 `audio/wav` 或 `audio/mpeg`）。

    **data**: required `string`

    原始音訊位元組。
