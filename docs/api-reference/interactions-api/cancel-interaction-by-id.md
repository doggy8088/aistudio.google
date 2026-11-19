# 取消互動


!!! note " "

      您目前查看的是 Interactions API 的 beta 版本。端點位於 `/v1beta/` 之下。另提供穩定的 [v1 版本](/api-reference/interactions-api/cancel-interaction-by-id/?api-version=v1)。


`POST` `https://generativelanguage.googleapis.com/v1beta/interactions/{id}/cancel`

依 ID 取消互動。此功能僅適用於仍在執行中的背景互動。


  
## 參數 {#parameters}

  
  **api_version**: required `string`

  用於要求路由的 API 版本。

  

---


  **id**: required `string`

  要取消的互動的唯一識別碼。

  

  

  
  **要求範例**

  

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions/$INTERACTION_ID/cancel" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      # Start a background interaction so it stays in-progress.
      created = client.interactions.create(
          model="gemini-3.8-flash",
          input="Write a long essay about the history of computing.",
          tools=[{"type": "computer_use"}],
          background=True,
      )

      # Cancel the in-progress interaction.
      interaction = client.interactions.cancel(id=created.id)
      print(interaction.status)
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({});

      // Start a background interaction so it stays in-progress.
      const created = await ai.interactions.create({
        model: 'gemini-3.8-flash',
        input: 'Write a long essay about the history of computing.',
        tools: [{type: 'computer_use'}],
        background: true,
      });

      // Cancel the in-progress interaction.
      const interaction = await ai.interactions.cancel(created.id);
      console.log(interaction.status);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.ComputerUse;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionStatus;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CancelInteractionByIdResponse;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.CreateInteractionResponse;
      import java.util.List;

      Client client = new Client();

      // Start a background interaction so it stays in-progress.
      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model("gemini-3.8-flash")
              .input(InteractionsInput.of("Write a long essay about the history of computing."))
              .tools(List.of(new ComputerUse()))
              .background(true)
              .build();
      CreateInteractionResponse created =
          client.interactions.create(CreateInteractionRequestBody.of(params));
      String interactionId = created.interaction().flatMap(Interaction::id).orElseThrow();

      // Cancel the in-progress interaction.
      CancelInteractionByIdResponse cancelResponse = client.interactions.cancel(interactionId);
      Interaction interaction =
          cancelResponse
              .interaction()
              .orElseThrow(() -> new RuntimeException("No interaction returned"));
      System.out.println(interaction.status().map(InteractionStatus::value).orElse(""));
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
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }


          req := operations.CancelInteractionByIDRequest{
              ID: interactionID,
          }

          res, err := client.Interactions.Cancel(
              ctx,
              req,
          )
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction != nil {
              fmt.Println(res.Interaction.Status)
          }
      }
      ```


  


  
## 回應 {#response}

  傳回 [`Interaction`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:Interaction) 資源。

  

  
  **回應範例**

  ```json
  {
    "created": "2025-11-26T12:25:15Z",
    "id": "v1_ChdPU0F4YWFtNkFwS2kxZThQZ05lbXdROBIXT1NBeGFhbTZBcEtpMWU4UGdOZW13UTg",
    "model": "gemini-3.8-flash",
    "object": "interaction",
    "status": "cancelled",
    "updated": "2025-11-26T12:25:15Z"
  }
  ```

  


## 資源 {#resources}

### Interaction {#Resource:Interaction}

Interaction 資源。


  
  **屬性**：

  
  **id**: required `string`

  僅供輸出。互動完成的唯一識別碼。

  

---


  

??? note "**status**: required `string enum` 僅供輸出。互動的狀態。"

    可能的值：

    - `in_progress`：互動正在進行中。
    - `requires_action`：互動需要使用者採取動作或提供輸入。
    - `completed`：互動已完成。
    - `failed`：互動失敗。
    - `cancelled`：互動已取消。
    - `incomplete`：互動已完成，但結果不完整（例如達到 max_tokens）。
    - `requires_continuation`：互動至少還需要一次要求才能完成。下一個要求應將 continuation_token 設為本次要求所傳回的值。



  

---


  **created**: required `string`

  僅供輸出。回應建立的時間，採 ISO 8601 格式（YYYY-MM-DDThh:mm:ssZ）。

  

---


  **updated**: required `string`

  僅供輸出。回應最後更新的時間，採 ISO 8601 格式（YYYY-MM-DDThh:mm:ssZ）。

  

---


  **steps**: required [`Step`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:Step) `array`

  僅供輸出。組成互動的步驟（包含於回應中時）。

  

---


  

??? note "**model**: `ModelOption` 用於產生互動的 `Model` 名稱。"

    可能的值：

    - `gemma-4-26b-a4b-it`: Gemma 4 26B A4B IT
    - `gemma-4-31b-it`: Gemma 4 31B IT
    - `gemini-flash-latest`：Gemini Flash 的最新版本
    - `gemini-flash-lite-latest`：Gemini Flash-Lite 的最新版本
    - `gemini-pro-latest`：Gemini Pro 的最新版本
    - `gemini-2.5-flash`：我們第一款混合推理模型，支援 1M 權杖上下文視窗，並具備思考預算。
    - `gemini-2.5-pro`：我們最先進的多用途模型，擅長程式設計與複雜推理任務。
    - `gemini-2.5-flash-lite`：我們最小、最具成本效益的模型，專為大規模使用而打造。
    - `gemini-3.5-flash-lite`：Gemini 3.5 Flash-Lite——我們最快速、最具成本效益的 3.5 模型，適合高輸送量執行。
    - `gemini-2.5-flash-image`：我們的原生圖片生成模型，針對速度、彈性與上下文理解最佳化。文字輸入與輸出的計價與 2.5 Flash 相同。
    - `gemini-3-flash-preview`：我們為速度打造的最智慧模型，結合前沿智慧與卓越的搜尋及接地能力。
    - `gemini-3.1-pro-preview`：我們最新的 SOTA 推理模型，具備前所未有的深度與細膩度，以及強大的多模態理解與程式設計能力。
    - `gemini-3.1-pro-preview-customtools`：Gemini 3.1 Pro Preview，針對自訂工具使用最佳化
    - `gemini-3.1-flash-lite`：我們最具成本效益的模型，針對大量代理任務、翻譯與簡單資料處理最佳化。
    - `gemini-3.1-flash-lite-image`: Gemini 3.1 Flash Lite Image.
    - `gemini-3-pro-image`: Gemini 3 Pro Image
    - `nano-banana-pro-preview`: Gemini 3 Pro Image Preview
    - `gemini-3.1-flash-image`: Gemini 3.1 Flash Image.
    - `gemini-nano-banana-2.1`: Gemini Nano Banana 2.1.
    - `gemini-3.1-flash-tts-preview`：Gemini 3.1 Flash TTS：強大、低延遲的語音生成。提供自然的輸出、可引導的提示詞，以及全新的表現力音訊標記，實現精準的旁白控制。
    - `gemini-3.5-flash`：Gemini 3.5 Flash——我們較早期的 Flash 模型，專為速度與基礎效能打造，適合日常的高輸送量工作負載。
    - `gemini-3.6-flash`：Gemini 3.6 Flash——我們的上一代 Flash 模型，在一般代理與日常任務中兼顧速度與多模態能力。
    - `gemini-3.7-flash`：Gemini 3.7 Flash——我們的高速高效 Flash 模型，專為日常程式設計、代理工具使用與可靠的多步驟執行打造。
    - `gemini-3.8-flash`：Gemini 3.8 Flash——我們最智慧的 Flash 模型，專為長周期軟體工程、自主代理與複雜的企業工作流程設計。
    - `gemini-4-argon`：Gemini 4 Argon——我們全新的前沿模型，旨在以深度與精準度解決真實世界軟體工程與知識工作中最困難的問題。
    - `gemini-4-carbon`：Gemini 4 Carbon——我們能力最強的推理模型，專為持續的代理程式設計、多模態知識工作、科學發現與資安防禦打造。
    - `gemini-4-hydrogen`：Gemini 4 Hydrogen——具備前沿級智慧的模型，專為在程式設計、代理工作流程與多模態知識工作中快速、可靠地執行而打造。
    - `gemini-3.8-flash-tts`：Gemini 3.8 Flash TTS——旗艦 TTS 模型，支援 Voice Design 與雙講者劇本控制。可提示自訂聲音角色、逐行引導台詞呈現，並加入聲音爆發效果。
    - `gemini-3.8-flash-lite-tts`：Gemini 3.8 Flash Lite TTS——高速且具成本效益，適合快速配音、媒體在地化與高輸送量語音代理。是 gemini-3.1-flash-tts-preview 的直接替代品。
    - `gemini-3.5-transcribe`：Gemini 3.5 Transcribe——低延遲語音轉文字模型，具備依語句進行的語言偵測、講者分離、逐字時間戳記與自訂詞彙偏置。
    - `lyria-3-clip-preview`：我們的低延遲音樂生成模型，針對高傳真音訊片段與精準的節奏控制最佳化。
    - `lyria-3-pro-preview`：我們先進的完整歌曲生成模型，具備深厚的作曲理解能力，針對跨多元音樂風格的精準結構控制與複雜轉場最佳化。
    - `gemini-robotics-er-1.6-preview`: Gemini Robotics-ER 1.6 Preview
    - `gemini-robotics-er-2-preview`: Gemini Robotics Embodied Reasoning 2 Preview
    - `lyria-3.5`：我們的旗艦音樂生成模型，針對結構連貫複雜的完整長度歌曲最佳化。
    - `gemini-omni-1.2-flash`：Gemini Omni 1.2 Flash——我們最新的多模態模型，支援快速、對話式的影片生成、編輯與電影級控制。
    - `gemini-omni-1.1-flash`：Gemini Omni 1.1 Flash——我們的高效能多模態模型，專為快速、對話式的影片生成、編輯與電影級控制設計。
    - `gemini-omni-flash-preview`：我們多模態模型的預覽版本，支援對話式影片生成、編輯與電影級控制。



  

---


  

??? note "**generation_config**: `GenerationConfig` 僅供輸入。模型互動的設定參數。"

      **seed**: `integer`

      解碼時用於重現結果的種子。

      **stop_sequences**: `string array`

      會停止互動輸出的字元序列清單。



    ??? note "**tool_choice**: [`ToolChoiceConfig`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:ToolChoiceConfig) or `string enum` 工具選擇設定。"

          **可能類型**：



        ??? note "**[ToolChoiceConfig](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:ToolChoiceConfig)**"

              包含允許工具的工具選擇設定。



            ??? note "**allowed_tools**: `AllowedTools` 允許使用的工具。"

                ??? note "**mode**: `string enum` 工具選擇的模式。"

                    可能的值：

                    - `auto`：自動工具選擇。
                    - `any`：任一工具選擇。
                    - `none`：不選擇工具。
                    - `validated`：經驗證的工具選擇。



                  **tools**: `string array`

                  允許工具的名稱。





        ??? note "**string enum**"

            可能的值：

            - `auto`：自動工具選擇。
            - `any`：任一工具選擇。
            - `none`：不選擇工具。
            - `validated`：經驗證的工具選擇。





    ??? note "**thinking_level**: `ThinkingLevel` 模型應產生的思考權杖等級。"

        可能的值：

        - `minimal`：幾乎不思考。
        - `low`：低思考等級。
        - `medium`：中思考等級。
        - `high`：高思考等級。
        - `xhigh`：超高思考等級，高於 `high`。





    ??? note "**thinking_summaries**: `ThinkingSummaries` 是否在回應中包含思考摘要。"

        可能的值：

        - `auto`：自動思考摘要。
        - `none`：不含思考摘要。



      **max_output_tokens**: `integer`

      回應中要包含的權杖數量上限。



    ??? note "**video_config**: `VideoConfig` 影片生成設定。"

        ??? note "**task**: `string enum` 影片生成的選用工作模式。若未指定，模型會依提供的文字提示詞與輸入媒體自動決定適當的模式。"

            可能的值：

            - `text_to_video`：僅依文字提示詞生成影片。
            - `image_to_video`：依一或兩張來源圖片生成影片。第一張圖片定義起始畫面，選用的第二張圖片定義結束畫面。
            - `reference_to_video`：使用參考媒體（例如圖片、音訊或影片）生成影片。
            - `edit`：修改既有的輸入影片。
            - `extend`：延伸既有的輸入影片。





    ??? note "**transcription_config**: `TranscriptionConfig` 選用。語音辨識（轉錄）設定。若有提供，將啟用 ASR。"

          **language_codes**: `string array`

          選用。BCP-47 語言代碼，提供音訊中所含語言的提示。若省略或留空，預設為自動語言偵測。

          **custom_vocabulary**: `string array`

          選用。自訂詞彙片語清單，用來使語音辨識模型偏向辨識特定詞彙。



        ??? note "**mode**: `TranscriptionMode` or `string enum` 區分式轉錄模式選項或列舉。"

              **可能類型**：



            ??? note "**SmartTranscriptionMode**"

                智慧轉錄模式的設定。

                **type**: required `object`

                Value: `smart`

                **source_text**: `string`

                要透過語音指令編輯或改寫的來源文字。提供時，模型會執行語音驅動的編輯，並輸出最終定稿的替換文字。





            ??? note "**VerbatimTranscriptionMode**"

                逐字轉錄模式的設定。

                **type**: required `object`

                Value: `verbatim`

                **timestamp_granularities**: `string array`

                選用。要包含在轉錄輸出中的時間戳記精細程度。支援的值："word"。若留空，不會產生時間戳記。

                **diarization_mode**: `string`

                選用。設定講者分離。支援的值："speaker"。





            ??? note "**string enum**"

                可能的值：

                - `verbatim`：逐字轉錄模式。
                - `smart`：智慧轉錄模式。





    ??? note "**structured_speech_config**: `SpeakerConfig` or `SpeechConfig array` 語音與多講者設定。"

          **可能類型**：



        ??? note "**SpeakerConfig**"

              多講者與語音生成的設定。



            ??? note "**speakers**: `SpeechConfig array` 各講者的個別設定。"

                **voice**: `string`

                講者的聲音。

                **language**: `string`

                語音的語言。

                **speaker**: `string`

                講者的名稱，應與提示詞中給定的講者名稱相符。





        ??? note "**SpeechConfig array**"

            語音互動的設定。

            **voice**: `string`

            講者的聲音。

            **language**: `string`

            語音的語言。

            **speaker**: `string`

            講者的名稱，應與提示詞中給定的講者名稱相符。



  

---


  **system_instruction**: `string`

  互動的系統指令。

  

---


  **tools**: [`Tool`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:Tool) `array`

  模型在互動期間可呼叫的工具宣告清單。

  

---


  **input**: [`Content`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:Content) or [`Content`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:Content) `array` or [`Step`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:Step) `array` or `string`

  互動的輸入。

  

---


  

??? note "**usage**: `Usage` 僅供輸出。互動要求的權杖使用統計。"

      **total_input_tokens**: `integer`

      提示詞（上下文）中的權杖數量。

      **initial_input_tokens**: `integer`

      此互動第一輪使用的輸入權杖數量。



    ??? note "**input_tokens_by_modality**: `ModalityTokens array` 依模態區分的輸入權杖用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_cached_tokens**: `integer`

      提示詞快取部分（快取內容）中的權杖數量。



    ??? note "**cached_tokens_by_modality**: `ModalityTokens array` 依模態區分的快取權杖用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_output_tokens**: `integer`

      所有生成回應的權杖總數。



    ??? note "**output_tokens_by_modality**: `ModalityTokens array` 依模態區分的輸出權杖用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_tool_use_tokens**: `integer`

      工具使用提示詞中存在的權杖數量。



    ??? note "**tool_use_tokens_by_modality**: `ModalityTokens array` 依模態區分的工具使用權杖用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_thought_tokens**: `integer`

      思考模型的思考權杖數量。

      **total_tokens**: `integer`

      互動要求的權杖總數（提示詞 + 回應 + 其他內部權杖）。



    ??? note "**grounding_tool_count**: `GroundingToolCount array` 接地工具計數。"

        ??? note "**type**: `string enum` 與計數相關聯的接地工具類型。"

            可能的值：

            - `google_search`：使用 Google 網路搜尋與圖片搜尋接地，以及 Web Grounding for Enterprise。
            - `google_maps`：使用 Google Maps 接地。



          **count**: `integer`

          接地工具計數的數目。



  

---


  

??? note "**response_format**: [`ResponseFormat`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:ResponseFormat) or [`ResponseFormat`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:ResponseFormat) `array` 強制生成的回應必須是符合此欄位所指定 JSON 架構的 JSON 物件。"

      **可能類型**：



    ??? note "**[ResponseFormat](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:ResponseFormat)**"






    ??? note "**[ResponseFormat](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:ResponseFormat) array**"

        每個項目為以下其中之一的清單：`AudioResponseFormat`、`ImageResponseFormat`、`TextResponseFormat`、`VideoResponseFormat`。



  

---


  **previous_interaction_id**: `string`

  前一個互動的 ID（如有）。

  

---


  

??? note "**environment**: [`EnvironmentConfig`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:EnvironmentConfig) or `string` 互動的環境設定。可以是指定遠端環境來源的物件，或是參照既有環境 ID 的字串。"

      **可能類型**：



    ??? note "**[EnvironmentConfig](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:EnvironmentConfig)**"

          自訂環境的設定。

          **type**: required `object`

          Value: `remote`



        ??? note "**sources**: `Source array`"

            ??? note "**type**: `string enum`"

                可能的值：

                - `gcs`：Cloud Storage 儲存桶。
                - `inline`：行內內容。
                - `repository`：一般儲存庫。來源 URL 中的通訊協定前綴可識別提供者（例如 github://、gcs://）。



              **source**: `string`

              環境的來源。對 Cloud Storage 而言，這是 Cloud Storage 路徑；對 GitHub 而言，這是 GitHub 路徑。

              **target**: `string`

              來源在環境中應出現的位置。

              **content**: `string`

              當 `type` 為 `INLINE` 時的行內內容。

              **encoding**: `string`

              行內內容的選用編碼（例如 `base64`）。





        ??? note "**network**: [`EnvironmentNetworkEgressAllowlist`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:EnvironmentNetworkEgressAllowlist) or `string enum` 環境的網路設定。"

              **可能類型**：



            ??? note "**[EnvironmentNetworkEgressAllowlist](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:EnvironmentNetworkEgressAllowlist)**"

                  環境的網路輸出設定。



                ??? note "**allowlist**: `EgressRule array` or `string enum` 允許的網域及其設定清單。設為 `"disabled"` 可封鎖所有網路輸出。"

                      **可能類型**：



                    ??? note "**EgressRule array**"

                        單一網域許可清單規則，可選用標頭注入。

                        **domain**: required `string`

                        允許送出要求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

                        **transform**: `object`

                        要注入符合此規則之要求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

                        **credential**: `string`

                        選用。以 ID 參照伺服器管理的 Credential 資源。





                    ??? note "**string enum**"

                        可能的值：

                        - `disabled`：所有網路輸出都會被封鎖。





            ??? note "**string enum**"

                可能的值：

                - `disabled`：所有網路輸出都會被封鎖。



          **environment_id**: `string`

          選用。互動的環境 ID。若有指定，要求會更新既有環境，而非建立新環境。



        ??? note "**env**: `object` or `string` 要在沙箱環境中設定的環境變數。"

              **可能類型**：



            ??? note "**string**"

                直接的字串值。





        ??? note "**mode**: `string enum` 此環境的運算生命週期模式。"

            可能的值：

            - `on_demand`：此環境的運算生命週期模式。
            - `self_hosted`：此環境的運算生命週期模式。



          **custom_config**: `object`

          選用。任意的客戶自訂 JSON 設定，會原樣傳遞給自我託管環境輪詢器。僅在 `mode` 為 `SELF_HOSTED` 時支援。





    ??? note "**string**"

        直接的字串值。



  

---


  **environment_id**: `string`

  僅供輸出。互動的環境 ID。僅在要求中設定了環境設定時才會填入。

  

---


  

??? note "**service_tier**: `ServiceTier` 互動的服務層級。"

    可能的值：

    - `flex`：Flex 服務層級。
    - `standard`：Standard 服務層級。
    - `priority`：Priority 服務層級。



  

---


  

??? note "**webhook_config**: `WebhookConfig` 選用。在互動完成時接收通知的 Webhook 設定。"

    **uris**: `string array`

    選用。若有設定，這些 webhook URI 將用於 webhook 事件，而非已註冊的 webhook。

    **user_metadata**: `object`

    選用。每次向 webhook 發送事件時都會一併傳回的使用者中繼資料。



  

---


  

??? note "**safety_settings**: `SafetySetting array` 互動的安全設定。"

    ??? note "**type**: required `HarmCategory` 要封鎖的危害類別類型。"

        可能的值：

        - `hate_speech`：宣揚暴力，或基於特定屬性煽動對個人或群體仇恨的內容。
        - `dangerous_content`：宣揚、促進或助長危險活動的內容。
        - `harassment`：辱罵、威脅，或意圖霸凌、折磨或嘲笑他人的內容。
        - `sexually_explicit`：含有露骨性內容的內容。
        - `jailbreak`：旨在繞過安全篩選的提示詞。





    ??? note "**threshold**: required `string enum` 封鎖內容的門檻。若危害機率超過此門檻，內容將被封鎖。"

        可能的值：

        - `block_low_and_above`：封鎖危害機率為低或更高的內容。
        - `block_medium_and_above`：封鎖危害機率為中或更高的內容。
        - `block_only_high`：封鎖危害機率為高的內容。
        - `off`：完全關閉安全篩選。





    ??? note "**method**: `string enum` 選用。封鎖內容的方法。若未指定，預設行為是使用機率分數。"

        可能的值：

        - `severity`：危害封鎖方法同時使用機率與嚴重程度分數。
        - `probability`：危害封鎖方法使用機率分數。



  

---


  **labels**: `object`

  要求的使用者自訂中繼資料標籤。標籤鍵與值的長度不得超過 63 個字元（Unicode 字碼點），且只能包含小寫字母、數字字元、底線與連字號。允許國際字元。標籤值為選用。標籤鍵必須以字母開頭。

  

---


  

??? note "**errors**: `Error array` 僅供輸出。記錄在互動上的診斷錯誤／平台錯誤。"

    **code**: `string`

    識別錯誤類型的 URI。

    **message**: `string`

    人類可讀的錯誤訊息。



  

---


  **continuation_token**: `string`

  用於繼續長時間解碼的不透明權杖。輸出：當狀態為 REQUIRES_CONTINUATION 且可繼續解碼時設定。輸入：在 CreateInteraction 中原樣傳回最新權杖，以繼續解碼。

  

---


  **stream**: `boolean`

  僅供輸入。互動是否以串流方式進行。

  

---


  **store**: `boolean`

  僅供輸入。是否儲存回應與要求，供日後擷取。

  

---


  **background**: `boolean`

  僅供輸入。是否在背景執行模型互動。

  

---


  

??? note "**agent**: `AgentOption` 用於產生互動的 `Agent` 名稱。"

    可能的值：

    - `deep-research-preview-04-2026`: Gemini Deep Research Agent
    - `deep-research-max-preview-04-2026`: Gemini Deep Research Max Agent
    - `antigravity-preview-05-2026`：使用 Antigravity 託管代理執行需要推理、檔案操作與工具使用的多步驟工作。
    - `antigravity-preview-09-2026`：使用 Antigravity 託管代理執行需要推理、檔案操作與工具使用的多步驟工作。



  

---


  

??? note "**agent_config**: `AntigravityAgentConfig` or `DeepResearchAgentConfig` or `DynamicAgentConfig` 代理互動的設定參數。"

      **可能類型**：



    ??? note "**AntigravityAgentConfig**"

        Antigravity 代理執行階段的設定。提供伺服器端對代理執行環境與工具設定的控制。

        **type**: required `object`

        Value: `antigravity`

        **model**: `string`

        用於代理推理的模型。

        **max_total_tokens**: `string`

        代理執行的權杖總數上限。





    ??? note "**DeepResearchAgentConfig**"

          Deep Research 代理的設定。

          **type**: required `object`

          Value: `deep-research`



        ??? note "**thinking_summaries**: `ThinkingSummaries` 是否在回應中包含思考摘要。"

            可能的值：

            - `auto`：自動思考摘要。
            - `none`：不含思考摘要。





        ??? note "**visualization**: `string enum` 是否在回應中包含視覺化內容。"

            可能的值：

            - `off`：不包含視覺化內容。
            - `auto`：自動包含視覺化內容。



          **collaborative_planning**: `boolean`

          為 Deep Research 代理啟用人機協作規劃。設為 true 時，Deep Research 代理會在回應中提供研究計畫。之後只有在使用者於下一輪確認該計畫時，代理才會繼續執行。





    ??? note "**DynamicAgentConfig**"

        動態代理的設定。

        **type**: required `object`

        Value: `dynamic`



  

---


  **max_total_tokens**: `string`

  代理執行的權杖總數上限。

  

  

  
  **範例**

  **Example**

  ```json
  {
    "created": "2025-12-04T15:01:45Z",
    "id": "v1_ChdXS0l4YWZXTk9xbk0xZThQczhEcmlROBIXV0tJeGFmV05PcW5NMWU4UHM4RHJpUTg",
    "model": "gemini-3.8-flash",
    "object": "interaction",
    "status": "completed",
    "steps": [
      {
        "type": "model_output",
        "content": [
          {
            "type": "text",
            "text": "Hello! I'm doing well, functioning as expected. Thank you for asking! How are you doing today?"
          }
        ]
      }
    ],
    "updated": "2025-12-04T15:01:45Z",
    "usage": {
      "input_tokens_by_modality": [
        {
          "modality": "text",
          "tokens": 7
        }
      ],
      "total_cached_tokens": 0,
      "total_input_tokens": 7,
      "total_output_tokens": 23,
      "total_thought_tokens": 49,
      "total_tokens": 79,
      "total_tool_use_tokens": 0
    }
  }
  ```

  


## 資料模型 {#data-models}

### Content {#Resource:Content}

回應的內容。

**多型類型**：


??? note "**AudioContent**"

      音訊內容區塊。




      **type**: required `object`

      Value: `audio`



    ---


      **data**: `string`

      音訊內容。



    ---


      **uri**: `string`

      音訊的 URI。



    ---


      **channels**: `integer`

      音訊聲道數量。



    ---


      **sample_rate**: `integer`

      音訊的取樣率。



    ---




    ??? note "**processing**: `AudioMediaProcessing` or `string enum` 模型如何處理此音訊以進行理解。"


          **可能類型**：


        ??? note "**AudioMediaProcessing**"


              **type**: required `object`

              Value: `static`

              **start_offset**: `string`

              選用。區段開始時間，相對於音訊串流的開頭。以小數秒數加上 's' 後綴指定，例如 "10.5s"。必須為非負數。

              **end_offset**: `string`

              選用。區段結束時間，相對於音訊串流的開頭。以小數秒數加上 's' 後綴指定，例如 "30s"。必須為正數，且在有設定 `start_offset` 時必須大於 `start_offset`。


        ??? note "**string enum**"


              可能的值：

              - `static`：所有音訊都放入上下文。


    ---


    ??? note "**mime_type**: `string enum` 音訊的 MIME 類型。"

        可能的值：

        - `audio/wav`：WAV 音訊格式
        - `audio/mp3`：MP3 音訊格式
        - `audio/aiff`：AIFF 音訊格式
        - `audio/aac`：AAC 音訊格式
        - `audio/ogg`：OGG 音訊格式
        - `audio/flac`：FLAC 音訊格式
        - `audio/mpeg`：MPEG 音訊格式
        - `audio/m4a`：M4A 音訊格式
        - `audio/l16`：L16 音訊格式
        - `audio/opus`：OPUS 音訊格式
        - `audio/alaw`：ALAW 音訊格式
        - `audio/mulaw`：MULAW 音訊格式
        - `audio/webm`：WEBM 音訊格式








      **範例**

      **音訊**

      **Example**

      **Audio**

      ```json
      {
        "type": "audio",
        "data": "BASE64_ENCODED_AUDIO",
        "mime_type": "audio/wav"
      }
      ```



??? note "**DocumentContent**"

      文件內容區塊。




      **type**: required `object`

      Value: `document`



    ---


      **data**: `string`

      文件內容。



    ---


      **uri**: `string`

      文件的 URI。



    ---




    ??? note "**resolution**: `MediaResolution` 媒體的解析度。當在 content_layers 中選取 PAGE_IMAGE 時適用。"


          可能的值：

          - `low`：低解析度。
          - `medium`：中解析度。
          - `high`：高解析度。
          - `ultra_high`：超高解析度。


    ---


    ??? note "**processing**: `DocumentMediaProcessing` or `string enum` 模型如何處理此文件以進行理解。"


          **可能類型**：


        ??? note "**DocumentMediaProcessing**"


              **type**: required `object`

              Value: `static`


            ??? note "**page_options**: `PageProcessingOptions` 分頁文件的選項。僅適用於分頁文件 MIME 類型（例如 PDF、Office 文件與簡報）。"


                  **start_page**: `integer`

                  選用。起始頁，以 1 起算，包含起始頁。

                  **end_page**: `integer`

                  選用。結束頁，以 1 起算，包含結束頁。若設定了 `start_page`，必須大於或等於 `start_page`。


                ??? note "**content_layers**: `string enum array` 選用。要從分頁文件中擷取的內容層。"


                      可能的值：

                      - `page_image`：頁面的轉譯影像。
                      - `page_text`：頁面的文字。


            ??? note "**spreadsheet_options**: `SpreadsheetProcessingOptions` 試算表的選項。僅適用於試算表 MIME 類型（.xlsx、.xls、.ods）。"


                  **visible_cells**: `string`

                  選用。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                  **sheet_index**: `integer`

                  選用。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                ??? note "**content_layers**: `string enum array` 選用。要從試算表中擷取的內容層。"


                      可能的值：

                      - `visual`：工作表的轉譯影像。
                      - `data`：儲存格值、合併儲存格與格式。
                      - `formulas`：公式運算式及其計算結果。


        ??? note "**string enum**"


              可能的值：

              - `static`：已擷取的所有頁面都放入上下文。


    ---


    ??? note "**mime_type**: `string enum` 文件的 MIME 類型。"

        可能的值：

        - `application/pdf`：PDF 文件格式
        - `text/csv`：CSV 文件格式
        - `application/vnd.openxmlformats-officedocument.presentationml.presentation`：PPTX 簡報格式
        - `application/vnd.ms-powerpoint`：PPT 簡報格式
        - `application/vnd.oasis.opendocument.presentation`：ODP 簡報格式
        - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`：DOCX 文件格式
        - `application/msword`：DOC 文件格式
        - `application/vnd.openxmlformats-officedocument.wordprocessingml.template`：DOTX 文件範本格式
        - `application/vnd.oasis.opendocument.text`：ODT 文件格式
        - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`：XLSX 試算表格式
        - `application/vnd.ms-excel`：XLS 試算表格式
        - `application/vnd.oasis.opendocument.spreadsheet`：ODS 試算表格式








      **範例**

      **文件**

      **Example**

      **Document**

      ```json
      {
        "type": "document",
        "data": "BASE64_ENCODED_DOCUMENT",
        "mime_type": "application/pdf"
      }
      ```



??? note "**[ImageContent](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:ImageContent)**"

      圖片內容區塊。




      **type**: required `object`

      Value: `image`



    ---


      **data**: `string`

      圖片內容。



    ---


      **uri**: `string`

      圖片的 URI。



    ---




    ??? note "**resolution**: `MediaResolution` 媒體的解析度。"

        可能的值：

        - `low`：低解析度。
        - `medium`：中解析度。
        - `high`：高解析度。
        - `ultra_high`：超高解析度。





    ---




    ??? note "**mime_type**: `string enum` 圖片的 MIME 類型。"

        可能的值：

        - `image/png`：PNG 圖片格式
        - `image/jpeg`：JPEG 圖片格式
        - `image/webp`：WebP 圖片格式
        - `image/heic`：HEIC 圖片格式
        - `image/heif`：HEIF 圖片格式
        - `image/gif`：GIF 圖片格式
        - `image/bmp`：BMP 圖片格式
        - `image/tiff`：TIFF 圖片格式








      **範例**

      **圖片**

      **Example**

      **Image**

      ```json
      {
        "type": "image",
        "data": "BASE64_ENCODED_IMAGE",
        "mime_type": "image/png"
      }
      ```



??? note "**[TextContent](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:TextContent)**"

      文字內容區塊。




      **text**: required `string`

      文字內容。



    ---


      **type**: required `object`

      Value: `text`



    ---




    ??? note "**annotations**: `Annotation array` 模型生成內容的引用資訊。"

          **可能類型**：



        ??? note "**FileCitation**"

            檔案引用註解。

            **type**: required `object`

            Value: `file_citation`

            **document_uri**: `string`

            檔案的 URI。

            **file_name**: `string`

            檔案的名稱。

            **source**: `string`

            文字某部分所歸因的來源。

            **custom_metadata**: `object`

            使用者提供的擷取上下文相關中繼資料。

            **page_number**: `integer`

            所引用文件的頁碼（如適用）。

            **media_id**: `string`

            圖片引用時的媒體 ID（如適用）。

            **start_index**: `integer`

            歸因於此來源的回應區段起點。索引表示區段的起始位置，以位元組為單位。

            **end_index**: `integer`

            歸因區段的終點（不含該點）。





        ??? note "**PlaceCitation**"

              地點引用註解。

              **type**: required `object`

              Value: `place_citation`

              **place_id**: `string`

              地點的 ID，格式為 `places/{place_id}`。

              **name**: `string`

              地點的標題。

              **url**: `string`

              地點的 URI 參照。



            ??? note "**review_snippets**: `ReviewSnippet array` 用於生成 Google Maps 中某地點特色相關回答的評論片段。"

                **title**: `string`

                評論的標題。

                **url**: `string`

                對應到 Google Maps 上使用者評論的連結。

                **review_id**: `string`

                評論片段的 ID。



              **start_index**: `integer`

              歸因於此來源的回應區段起點。索引表示區段的起始位置，以位元組為單位。

              **end_index**: `integer`

              歸因區段的終點（不含該點）。





        ??? note "**SpeechAnnotation**"

            文字內容的語音註解。

            **type**: required `object`

            Value: `speech_metadata`

            **speaker**: `string`

            要與此輪對話關聯的講者。

            **style**: `string`

            語音合成的風格指令。

            **start_index**: `integer`

            歸因於此來源的回應區段起點。索引表示區段的起始位置，以位元組為單位。

            **end_index**: `integer`

            歸因區段的終點（不含該點）。





        ??? note "**UrlCitation**"

            URL 引用註解。

            **type**: required `object`

            Value: `url_citation`

            **url**: `string`

            URL。

            **title**: `string`

            URL 的標題。

            **start_index**: `integer`

            歸因於此來源的回應區段起點。索引表示區段的起始位置，以位元組為單位。

            **end_index**: `integer`

            歸因區段的終點（不含該點）。





        ??? note "**WordInfo**"

            轉錄輸出的逐字 ASR 註解。包含單字文字、選用的時間資訊，以及選用的講者歸因。

            **type**: required `object`

            Value: `word_info`

            **text**: `string`

            轉錄出的單字。

            **start_offset**: `string`

            單字相對於音訊開頭的起始時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

            **end_offset**: `string`

            單字相對於音訊開頭的結束時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

            **speaker**: `string`

            選用。此單字的講者標籤（例如 "spk_1"、"spk_2"）。當 TranscriptionConfig 中設定了 diarization_mode 時才會出現。

            **start_index**: `integer`

            歸因於此來源的回應區段起點。索引表示區段的起始位置，以位元組為單位。

            **end_index**: `integer`

            歸因區段的終點（不含該點）。








      **範例**

      **文字**

      **Example**

      **Text**

      ```json
      {
        "type": "text",
        "text": "Hello, how are you?"
      }
      ```



??? note "**VideoContent**"

      影片內容區塊。




      **type**: required `object`

      Value: `video`



    ---


      **data**: `string`

      影片內容。



    ---


      **uri**: `string`

      影片的 URI。



    ---




    ??? note "**resolution**: `MediaResolution` 媒體的解析度。"

        可能的值：

        - `low`：低解析度。
        - `medium`：中解析度。
        - `high`：高解析度。
        - `ultra_high`：超高解析度。





    ---




    ??? note "**processing**: `MediaProcessing` or `string enum` 模型如何處理此影片以進行理解。"

          **可能類型**：



        ??? note "**MediaProcessing**"

            **type**: required `object`

            Value: `static`

            **start_offset**: `string`

            選用。區段開始時間。以小數秒數加上 's' 後綴指定，例如 "10.5s"。必須為非負數。

            **end_offset**: `string`

            選用。區段結束時間。以小數秒數加上 's' 後綴指定，例如 "30s"。必須為非負數，且在有設定 `start_offset` 時必須大於 `start_offset`。

            **fps**: `number`

            選用。影片影格率取樣密度。





            ??? note "**content_layers**: `string enum array` 選用。要從影片中擷取的內容層。"


                  可能的值：

                  - `frames`：影片的影格。
                  - `audio`：影片的音訊。
                  - `transcript`：音軌的逐字稿。


        ??? note "**string enum**"

            可能的值：

            - `static`：固定速率影格擷取。所有影格都放入上下文。
            - `agentic`：模型驅動的動態導覽。





    ---


      **name**: `string`

      此內容區塊的使用者自訂名稱。模型可在最終回應中參照。



    ---




    ??? note "**mime_type**: `string enum` 影片的 MIME 類型。"

        可能的值：

        - `video/mp4`：MP4 影片格式
        - `video/mpeg`：MPEG 影片格式
        - `video/mpg`：MPG 影片格式
        - `video/mov`：MOV 影片格式
        - `video/avi`：AVI 影片格式
        - `video/x-flv`：FLV 影片格式
        - `video/webm`：WebM 影片格式
        - `video/wmv`：WMV 影片格式
        - `video/3gpp`：3GPP 影片格式








      **範例**

      **影片**

      **Example**

      **Video**

      ```json
      {
        "type": "video",
        "uri": "https://www.youtube.com/watch?v=9hE5-98ZeCg"
      }
      ```



### Tool {#Resource:Tool}

模型可使用的工具。

**多型類型**：


??? note "**CodeExecution**"

      模型可用來執行程式碼的工具。




      **type**: required `object`

      Value: `code_execution`






      **範例**



    === "REST"

      **Example**

    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-3.8-flash",
              "tools": [{
                "type": "code_execution"
              }],
              "input": "Calculate the first 10 Fibonacci numbers"
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          response = client.interactions.create(
              model="gemini-3.8-flash",
              tools=[{"type": "code_execution"}],
              input="Calculate the first 10 Fibonacci numbers",
          )
          print(response.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({});
          const interaction = await ai.interactions.create({
            model: 'gemini-3.8-flash',
            tools: [{type: 'code_execution'}],
            input: 'Calculate the first 10 Fibonacci numbers',
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.CodeExecution;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import java.util.List;

          Client client = new Client();
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-3.8-flash")
                  .tools(List.of(new CodeExecution()))
                  .input(InteractionsInput.of("Calculate the first 10 Fibonacci numbers"))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "code_execution"

          ```go
          package main

          import (
              "context"
              "fmt"
              "log"
              "google.golang.org/genai"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, nil)
              if err != nil {
                  log.Fatal(err)
              }

              tool := gaos_interactions.NewTool(gaos_interactions.CodeExecution{})

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-3.8-flash"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput("Calculate the first 10 Fibonacci numbers")),
                  Tools: []gaos_interactions.Tool{tool},
              })

              req := operations.CreateInteractionRequest{
                  Body: body,
              }

              res, err := client.Interactions.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```



??? note "**ComputerUse**"

      模型可用來與電腦互動的工具。




      **type**: required `object`

      Value: `computer_use`



    ---




    ??? note "**environment**: `string enum` 正在操作的環境。"

        可能的值：

        - `browser`：在網頁瀏覽器中操作。
        - `mobile`：在行動環境中操作。
        - `desktop`：在桌面環境中操作。





    ---


      **excluded_predefined_functions**: `string array`

      從模型呼叫中排除的預定義函式清單。



    ---


      **enable_prompt_injection_detection**: `boolean`

      是否對電腦使用要求啟用提示詞注入偵測檢查。



    ---




    ??? note "**disabled_safety_policies**: `string enum array` 選用。電腦使用已停用的安全政策。"

        可能的值：

        - `financial_transactions`：金融交易的安全政策。
        - `sensitive_data_modification`：敏感資料修改的安全政策。
        - `communication_tool`：通訊工具（例如 Gmail、Chat、Meet）的安全政策。
        - `account_creation`：帳號建立的安全政策。
        - `data_modification`：資料修改的安全政策。
        - `user_consent_management`：使用者同意管理的安全政策。
        - `legal_terms_and_agreements`：法律條款與協議的安全政策。








      **範例**



    === "REST"

      **Example**

    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-3.8-flash",
              "tools": [{
                "type": "computer_use"
              }],
              "input": "Find a flight to Tokyo"
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          response = client.interactions.create(
              model="gemini-3.8-flash",
              tools=[{"type": "computer_use"}],
              input="Find a flight to Tokyo",
          )
          print(response.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({});
          const interaction = await ai.interactions.create({
            model: 'gemini-3.8-flash',
            tools: [{type: 'computer_use'}],
            input: 'Find a flight to Tokyo',
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.ComputerUse;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import java.util.List;

          Client client = new Client();
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-3.8-flash")
                  .tools(List.of(new ComputerUse()))
                  .input(InteractionsInput.of("Find a flight to Tokyo"))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "computer_use"

          ```go
          package main

          import (
              "context"
              "fmt"
              "log"
              "google.golang.org/genai"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, nil)
              if err != nil {
                  log.Fatal(err)
              }

              tool := gaos_interactions.NewTool(gaos_interactions.ComputerUse{})

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-3.8-flash"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput("Find a flight to Tokyo")),
                  Tools: []gaos_interactions.Tool{tool},
              })

              req := operations.CreateInteractionRequest{
                  Body: body,
              }

              res, err := client.Interactions.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```



??? note "**FileSearch**"

      模型可用來搜尋檔案的工具。




      **type**: required `object`

      Value: `file_search`



    ---


      **file_search_store_names**: `string array`

      要搜尋的 File Search 存放區名稱。



    ---


      **top_k**: `integer`

      要擷取的語意擷取區塊數量。



    ---


      **metadata_filter**: `string`

      要套用到語意擷取文件與區塊的中繼資料篩選條件。






      **範例**



    === "REST"

      **Example**

    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-3.8-flash",
              "tools": [{
                "type": "file_search",
                "file_search_store_names": ["fileSearchStores/m64d1sevsr4y-xfyawui3fxqg"]
              }],
              "input": "Who is the author of the book?"
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()

          # Create a file search store so we have a valid one to use.
          store = client.file_search_stores.create()

          response = client.interactions.create(
              model="gemini-3.8-flash",
              tools=[
                  {"type": "file_search", "file_search_store_names": [store.name]}
              ],
              input="What documents are available?",
          )
          print(response.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({});

          // Create a file search store so we have a valid one to use.
          const store = await ai.fileSearchStores.create({});
          if (!store.name) {
            throw new Error('Store creation failed: Name is undefined');
          }

          const interaction = await ai.interactions.create({
            model: 'gemini-3.8-flash',
            tools: [
              {
                type: 'file_search',
                file_search_store_names: [store.name],
              },
            ],
            input: 'What documents are available?',
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.FileSearch;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import com.google.genai.types.CreateFileSearchStoreConfig;
          import com.google.genai.types.FileSearchStore;
          import java.util.List;

          Client client = new Client();

          // Create a file search store so we have a valid one to use.
          FileSearchStore store =
              client.fileSearchStores.create(CreateFileSearchStoreConfig.builder().build());
          String storeName = store.name().orElseThrow();

          FileSearch tool = FileSearch.builder().fileSearchStoreNames(List.of(storeName)).build();
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-3.8-flash")
                  .tools(List.of(tool))
                  .input(InteractionsInput.of("What documents are available?"))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "file_search"

          ```go
          package main

          import (
              "context"
              "fmt"
              "log"
              "google.golang.org/genai"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, nil)
              if err != nil {
                  log.Fatal(err)
              }


              tool := gaos_interactions.NewTool(gaos_interactions.FileSearch{
                  FileSearchStoreNames: []string{store.Name},
              })

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-3.8-flash"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput("What documents are available?")),
                  Tools: []gaos_interactions.Tool{tool},
              })

              req := operations.CreateInteractionRequest{
                  Body: body,
              }

              res, err := client.Interactions.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```



??? note "**Function**"

      模型可使用的工具。




      **type**: required `object`

      Value: `function`



    ---


      **name**: `string`

      函式的名稱。



    ---


      **description**: `string`

      函式的說明。



    ---


      **parameters**: `object`

      函式參數的 JSON Schema。支援 JSON Schema 的子集。`minLength`、`maxLength`、`minProperties`、`maxProperties`、`uniqueItems`、`contains`、`minContains` 與 `maxContains` 會被忽略且不強制執行。






      **範例**



    === "REST"

      **Example**

    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-3.8-flash",
              "tools": [{
                "type": "function",
                "name": "get_weather",
                "description": "Get the current weather in a given location",
                "parameters": {
                  "type": "object",
                  "properties": {
                    "location": {
                      "type": "string",
                      "description": "The city and state, e.g. San Francisco, CA"
                    }
                  },
                  "required": ["location"]
                }
              }],
              "input": "What is the weather like in Boston, MA?"
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          response = client.interactions.create(
              model="gemini-3.8-flash",
              tools=[{
                  "type": "function",
                  "name": "get_weather",
                  "description": "Get the current weather in a given location",
                  "parameters": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": (
                                  "The city and state, e.g. San Francisco, CA"
                              ),
                          }
                      },
                      "required": ["location"],
                  },
              }],
              input="What is the weather like in Boston?",
          )
          print(response.steps[-1])
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({});
          const interaction = await ai.interactions.create({
            model: 'gemini-3.8-flash',
            tools: [
              {
                type: 'function',
                name: 'get_weather',
                description: 'Get the current weather in a given location',
                parameters: {
                  type: 'object',
                  properties: {
                    location: {
                      type: 'string',
                      description: 'The city and state, e.g. San Francisco, CA',
                    },
                  },
                  required: ['location'],
                },
              },
            ],
            input: 'What is the weather like in Boston?',
          });
          console.log(interaction.steps.at(-1));
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.Function;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.Step;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import java.util.List;

          Client client = new Client();
          Map<String, Object> parameters =
              Map.of(
                  "type", "object",
                  "properties",
                      Map.of(
                          "location",
                          Map.of(
                              "type", "string",
                              "description", "The city and state, e.g. San Francisco, CA")),
                  "required", List.of("location"));
          Function functionTool =
              Function.builder()
                  .name("get_weather")
                  .description("Get the current weather in a given location")
                  .parameters(parameters)
                  .build();
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-3.8-flash")
                  .tools(List.of(functionTool))
                  .input(InteractionsInput.of("What is the weather like in Boston?"))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          List<Step> steps = interaction.steps().orElse(List.of());
          if (!steps.isEmpty()) {
            System.out.println(steps.get(steps.size() - 1));
          }
          ```

    === "function_calling"

          ```go
          package main

          import (
              "context"
              "fmt"
              "log"
              "google.golang.org/genai"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, nil)
              if err != nil {
                  log.Fatal(err)
              }

              function := gaos_interactions.Function{
                  Name:        genai.Ptr("get_weather"),
                  Description: genai.Ptr("Get the current weather in a given location"),
                  Parameters: map[string]any{
                      "type": "object",
                      "properties": map[string]any{
                          "location": map[string]any{
                              "type":        "string",
                              "description": "The city and state, e.g. San Francisco, CA",
                          },
                      },
                      "required": []string{"location"},
                  },
              }

              tool := gaos_interactions.NewTool(function)

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-3.8-flash"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput("What is the weather like in Boston, MA?")),
                  Tools: []gaos_interactions.Tool{tool},
              })

              req := operations.CreateInteractionRequest{
                  Body: body,
              }

              res, err := client.Interactions.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil {
                  for _, step := range res.Interaction.Steps {
                      if step.FunctionCallStep != nil {
                          fmt.Println("Function Call:", step.FunctionCallStep.Name)
                          fmt.Println("Arguments:", step.FunctionCallStep.Arguments)
                      }
                  }
              }
          }
          ```



??? note "**GoogleMaps**"

      模型可用來呼叫 Google Maps 的工具。




      **type**: required `object`

      Value: `google_maps`



    ---


      **enable_widget**: `boolean`

      是否在回應的工具呼叫結果中傳回 widget 上下文權杖。



    ---


      **latitude**: `number`

      使用者所在位置的緯度。



    ---


      **longitude**: `number`

      使用者所在位置的經度。






      **範例**



    === "REST"

      **Example**

    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-3.8-flash",
              "tools": [{
                "type": "google_maps",
                "latitude": 37.7749,
                "longitude": -122.4194
              }],
              "input": "What is the best food near me?"
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          response = client.interactions.create(
              model="gemini-3.8-flash",
              tools=[
                  {"type": "google_maps", "latitude": 37.7749, "longitude": -122.4194}
              ],
              input="What is the best food near me?",
          )
          print(response.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({});
          const interaction = await ai.interactions.create({
            model: 'gemini-3.8-flash',
            tools: [
              {
                type: 'google_maps',
                latitude: 37.7749,
                longitude: -122.4194,
              },
            ],
            input: 'What is the best food near me?',
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.GoogleMaps;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import java.util.List;

          Client client = new Client();
          GoogleMaps tool = GoogleMaps.builder().latitude(37.7749).longitude(-122.4194).build();
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-3.8-flash")
                  .tools(List.of(tool))
                  .input(InteractionsInput.of("What is the best food near me?"))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "google_maps"

          ```go
          package main

          import (
              "context"
              "fmt"
              "log"
              "google.golang.org/genai"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, nil)
              if err != nil {
                  log.Fatal(err)
              }

              tool := gaos_interactions.NewTool(gaos_interactions.GoogleMaps{
                  Latitude:  genai.Ptr(37.7749),
                  Longitude: genai.Ptr(-122.4194),
              })

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-3.8-flash"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput("What is the best food near me?")),
                  Tools: []gaos_interactions.Tool{tool},
              })

              req := operations.CreateInteractionRequest{
                  Body: body,
              }

              res, err := client.Interactions.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```



??? note "**GoogleSearch**"

      模型可用來搜尋 Google 的工具。




      **type**: required `object`

      Value: `google_search`



    ---




    ??? note "**search_types**: `string enum array` 要啟用的搜尋接地類型。"

        可能的值：

        - `web_search`：設定此欄位可啟用網路搜尋。僅傳回文字結果。
        - `image_search`：設定此欄位可啟用圖片搜尋。傳回圖片位元組。








      **範例**



    === "REST"

      **Example**

    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-3.8-flash",
              "tools": [{
                "type": "google_search"
              }],
              "input": "Who is the current president of France?"
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          response = client.interactions.create(
              model="gemini-3.8-flash",
              tools=[{"type": "google_search"}],
              input="Who is the current president of France?",
          )
          print(response.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({});
          const interaction = await ai.interactions.create({
            model: 'gemini-3.8-flash',
            tools: [{type: 'google_search'}],
            input: 'Who is the current president of France?',
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.GoogleSearch;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import java.util.List;

          Client client = new Client();
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-3.8-flash")
                  .tools(List.of(new GoogleSearch()))
                  .input(InteractionsInput.of("Who is the current president of France?"))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "google_search"

          ```go
          package main

          import (
              "context"
              "fmt"
              "log"
              "google.golang.org/genai"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, nil)
              if err != nil {
                  log.Fatal(err)
              }

              tool := gaos_interactions.NewTool(gaos_interactions.GoogleSearch{})

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-3.8-flash"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput("Who is the current president of France?")),
                  Tools: []gaos_interactions.Tool{tool},
              })

              req := operations.CreateInteractionRequest{
                  Body: body,
              }

              res, err := client.Interactions.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```



??? note "**McpServer**"

      MCPServer 是模型可呼叫來執行動作的伺服器。




      **type**: required `object`

      Value: `mcp_server`



    ---


      **name**: `string`

      MCPServer 的名稱。



    ---


      **url**: `string`

      MCPServer 端點的完整 URL。範例："https://api.example.com/mcp"



    ---


      **headers**: `object`

      選用：驗證標頭、逾時等欄位（如有需要）。



    ---




    ??? note "**allowed_tools**: `AllowedTools array` 允許使用的工具。"

        ??? note "**mode**: `string enum` 工具選擇的模式。"

            可能的值：

            - `auto`：自動工具選擇。
            - `any`：任一工具選擇。
            - `none`：不選擇工具。
            - `validated`：經驗證的工具選擇。



          **tools**: `string array`

          允許工具的名稱。








      **範例**



    === "REST"

      **Example**

    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-3.8-flash",
              "tools": [{
                "type": "mcp_server",
                "name": "weather_service",
                "url": "https://gemini-api-demos.uc.r.appspot.com/mcp"
              }],
              "input": "Today is 12-05-2025, what is the temperature today in London?"
            }'
          ```

    === "Python"

          ```python
          import os

          from google import genai

          client = genai.Client()
          response = client.interactions.create(
              model="gemini-3.8-flash",
              tools=[{
                  "type": "mcp_server",
                  "name": "weather_service",
                  "url": "https://gemini-api-demos.uc.r.appspot.com/mcp",
              }],
              input="Today is 12-05-2025, what is the temperature today in London?",
          )
          print(response.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({});
          const interaction = await ai.interactions.create({
            model: 'gemini-3.8-flash',
            tools: [
              {
                type: 'mcp_server',
                name: 'weather_service',
                url: 'https://gemini-api-demos.uc.r.appspot.com/mcp',
              },
            ],
            input: 'Today is 12-05-2025, what is the temperature today in London?',
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.MCPServer;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import java.util.List;

          Client client = new Client();
          MCPServer mcpTool =
              MCPServer.builder()
                  .name("weather_service")
                  .url("https://gemini-api-demos.uc.r.appspot.com/mcp")
                  .build();
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-3.8-flash")
                  .tools(List.of(mcpTool))
                  .input(
                      InteractionsInput.of(
                          "Today is 12-05-2025, what is the temperature today in London?"))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "mcp_server"

          ```go
          package main

          import (
              "context"
              "fmt"
              "log"
              "os"
              "google.golang.org/genai"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, nil)
              if err != nil {
                  log.Fatal(err)
              }

              mcpServer := gaos_interactions.MCPServer{
                  Name: genai.Ptr("weather_service"),
                  URL:  genai.Ptr("https://gemini-api-demos.uc.r.appspot.com/mcp"),
              }
              tool := gaos_interactions.NewTool(mcpServer)

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-3.8-flash"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput("Today is 12-05-2025, what is the temperature today in London?")),
                  Tools: []gaos_interactions.Tool{tool},
              })

              req := operations.CreateInteractionRequest{
                  Body: body,
              }

              res, err := client.Interactions.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```



??? note "**UrlContext**"

      模型可用來擷取 URL 上下文的工具。




      **type**: required `object`

      Value: `url_context`






      **範例**



    === "REST"

      **Example**

    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-3.8-flash",
              "tools": [{
                "type": "url_context"
              }],
              "input": "Summarize https://www.example.com"
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          response = client.interactions.create(
              model="gemini-3.8-flash",
              tools=[{"type": "url_context"}],
              input="Summarize https://www.example.com",
          )
          print(response.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({});
          const interaction = await ai.interactions.create({
            model: 'gemini-3.8-flash',
            tools: [{type: 'url_context'}],
            input: 'Summarize https://www.example.com',
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.URLContext;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import java.util.List;

          Client client = new Client();
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-3.8-flash")
                  .tools(List.of(new URLContext()))
                  .input(InteractionsInput.of("Summarize https://www.example.com"))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "url_context"

          ```go
          package main

          import (
              "context"
              "fmt"
              "log"
              "google.golang.org/genai"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, nil)
              if err != nil {
                  log.Fatal(err)
              }

              tool := gaos_interactions.NewTool(gaos_interactions.URLContext{})

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-3.8-flash"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput("Summarize https://www.example.com")),
                  Tools: []gaos_interactions.Tool{tool},
              })

              req := operations.CreateInteractionRequest{
                  Body: body,
              }

              res, err := client.Interactions.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```



### ResponseFormat {#Resource:ResponseFormat}

**多型類型**：


??? note "**AudioResponseFormat**"

      音訊輸出格式的設定。




      **type**: required `object`

      Value: `audio`



    ---




    ??? note "**mime_type**: `string enum` 音訊輸出的 MIME 類型。"

        可能的值：

        - `audio/mp3`：MP3 音訊格式。
        - `audio/ogg_opus`：OGG Opus 音訊格式。
        - `audio/l16`：原始 PCM（L16）音訊格式。
        - `audio/wav`：WAV 音訊格式。
        - `audio/alaw`：A-law 音訊格式。
        - `audio/mulaw`：Mu-law 音訊格式。





    ---




    ??? note "**delivery**: `string enum` 音訊輸出的傳遞模式。"

        可能的值：

        - `inline`：音訊資料在回應中以行內方式傳回。
        - `uri`：音訊資料以 URI 形式傳回。





    ---


      **sample_rate**: `integer`

      取樣率（Hz）。



    ---


      **bit_rate**: `integer`

      位元率，單位為每秒位元數（bps）。僅適用於壓縮格式（MP3、Opus）。






      **範例**

      **音訊輸出**

      **Example**

      **Audio Output**

      ```json
      {
        "type": "audio",
        "sample_rate": 24000
      }
      ```



??? note "**ImageResponseFormat**"

      圖片輸出格式的設定。




      **type**: required `object`

      Value: `image`



    ---




    ??? note "**mime_type**: `string enum` 圖片輸出的 MIME 類型。"

        可能的值：

        - `image/jpeg`：JPEG 圖片格式。





    ---




    ??? note "**delivery**: `string enum` 圖片輸出的傳遞模式。"

        可能的值：

        - `inline`：圖片資料在回應中以行內方式傳回。
        - `uri`：圖片資料以 URI 形式傳回。





    ---




    ??? note "**aspect_ratio**: `string enum` 圖片輸出的長寬比。"

        可能的值：

        - `1:1`：1:1 長寬比。
        - `2:3`：2:3 長寬比。
        - `3:2`：3:2 長寬比。
        - `3:4`：3:4 長寬比。
        - `4:3`：4:3 長寬比。
        - `4:5`：4:5 長寬比。
        - `5:4`：5:4 長寬比。
        - `9:16`：9:16 長寬比。
        - `16:9`：16:9 長寬比。
        - `21:9`：21:9 長寬比。
        - `1:8`：1:8 長寬比。
        - `8:1`：8:1 長寬比。
        - `1:4`：1:4 長寬比。
        - `4:1`：4:1 長寬比。





    ---




    ??? note "**image_size**: `string enum` 圖片輸出的大小。"

        可能的值：

        - `512`：512px 圖片大小。
        - `1K`：1K 圖片大小。
        - `2K`：2K 圖片大小。
        - `4K`：4K 圖片大小。








      **範例**

      **圖片輸出**

      **Example**

      **Image Output**

      ```json
      {
        "type": "image",
        "aspect_ratio": "16:9",
        "image_size": "1K",
        "mime_type": "image/jpeg"
      }
      ```



??? note "**TextResponseFormat**"

      文字輸出格式的設定。




      **type**: required `object`

      Value: `text`



    ---




    ??? note "**mime_type**: `string enum` 文字輸出的 MIME 類型。"

        可能的值：

        - `application/json`：JSON 輸出格式。
        - `text/plain`：純文字輸出格式。





    ---


      **schema**: `object`

      輸出應符合的 JSON 架構。僅在 mime_type 為 application/json 時適用。支援 JSON Schema 的子集。`minLength`、`maxLength`、`minProperties`、`maxProperties`、`uniqueItems`、`contains`、`minContains` 與 `maxContains` 會被忽略且不強制執行；請在您的應用程式中驗證這些項目。`minItems` 與 `maxItems` 會強制執行。過於複雜而無法強制執行的架構（例如巢狀陣列上的大型 `maxItems`）會傳回 400 INVALID_ARGUMENT 錯誤。






      **範例**

      **文字輸出（JSON Schema）**

      **Example**

      **Text Output (JSON Schema)**

      ```json
      {
        "type": "text",
        "mime_type": "application/json",
        "schema": {
          "type": "object",
          "properties": {
            "ingredients": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "recipe_name": {
              "type": "string"
            }
          },
          "required": [
            "ingredients",
            "recipe_name"
          ]
        }
      }
      ```



??? note "**VideoResponseFormat**"

      影片輸出格式的設定。




      **type**: required `object`

      Value: `video`



    ---




    ??? note "**delivery**: `string enum` 影片輸出的傳遞模式。"

        可能的值：

        - `inline`：影片資料在回應中以行內方式傳回。
        - `uri`：影片資料以 URI 形式傳回。





    ---




    ??? note "**aspect_ratio**: `string enum` 影片輸出的長寬比。"

        可能的值：

        - `16:9`：16:9 長寬比。
        - `9:16`：9:16 長寬比。





    ---


      **duration**: `string`

      影片輸出的時長。



    ---




    ??? note "**resolution**: `string enum` 影片輸出解析度。預設為 720p。"

        可能的值：

        - `360p`：360p 解析度。
        - `720p`：720p 解析度。
        - `1080p`：1080p 解析度。
        - `4k`：4K 解析度。








      **範例**

      **影片輸出**

      **Example**

      **Video Output**

      ```json
      {
        "type": "video",
        "aspect_ratio": "16:9",
        "delivery": "inline"
      }
      ```



### Step {#Resource:Step}

互動中的一個步驟。

**多型類型**：


??? note "**CodeExecutionCallStep**"

      程式碼執行呼叫步驟。






    ??? note "**arguments**: required `CodeExecutionCallStepArguments` 要傳遞給程式碼執行的引數。"

        ??? note "**language**: `string enum` `code` 的程式語言。"

            可能的值：

            - `python`：Python >= 3.10，可使用 numpy 與 simpy。
            - `bash`：Bash。僅適用於 Gemini 3.0 以上版本模型。



          **code**: `string`

          要執行的程式碼。





    ---


      **id**: required `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**: required `object`

      Value: `code_execution_call`



    ---


      **signature**: `string`

      供後端驗證的簽章雜湊。






      **範例**

      **CodeExecutionCallStep**

      **Example**

      **CodeExecutionCallStep**

      ```json
      {
        "type": "code_execution_call",
        "arguments": {
          "code": "print(sum(range(1, 11)))"
        },
        "id": "code_call_71021"
      }
      ```



??? note "**CodeExecutionResultStep**"

      程式碼執行結果步驟。






    ??? note "**result**: required [`Content`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:Content) `array` or `string` 程式碼執行的輸出。"

          **可能類型**：



        ??? note "**[Content](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:Content) array**"

            清單的內容。





        ??? note "**string**"

            直接的字串值。





    ---


      **call_id**: required `string`

      用來對應函式呼叫區塊中 ID 的識別碼。



    ---


      **type**: required `object`

      Value: `code_execution_result`



    ---


      **is_error**: `boolean`

      程式碼執行是否發生錯誤。



    ---


      **signature**: `string`

      供後端驗證的簽章雜湊。






      **範例**

      **CodeExecutionResultStep**

      **Example**

      **CodeExecutionResultStep**

      ```json
      {
        "type": "code_execution_result",
        "call_id": "code_call_71021",
        "result": "55\n"
      }
      ```



??? note "**FileSearchCallStep**"

      File Search 呼叫步驟。




      **id**: required `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**: required `object`

      Value: `file_search_call`



    ---


      **signature**: `string`

      供後端驗證的簽章雜湊。






      **範例**

      **FileSearchCallStep**

      **Example**

      **FileSearchCallStep**

      ```json
      {
        "type": "file_search_call",
        "id": "file_call_88192"
      }
      ```



??? note "**FileSearchResultStep**"

      File Search 結果步驟。




      **call_id**: required `string`

      用來對應函式呼叫區塊中 ID 的識別碼。



    ---


      **type**: required `object`

      Value: `file_search_result`



    ---


      **signature**: `string`

      供後端驗證的簽章雜湊。






      **範例**

      **FileSearchResultStep**

      **Example**

      **FileSearchResultStep**

      ```json
      {
        "type": "file_search_result",
        "call_id": "file_call_88192"
      }
      ```



??? note "**FunctionCallStep**"

      函式工具呼叫步驟。




      **name**: required `string`

      要呼叫的工具名稱。



    ---


      **arguments**: required `object`

      要傳遞給函式的引數。



    ---


      **id**: required `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**: required `object`

      Value: `function_call`






      **範例**

      **FunctionCallStep**

      **Example**

      **FunctionCallStep**

      ```json
      {
        "name": "get_weather",
        "type": "function_call",
        "arguments": {
          "location": "Boston, MA"
        },
        "id": "call_98231"
      }
      ```



??? note "**FunctionResultStep**"

      函式工具呼叫的結果。






    ??? note "**result**: required `(`[`ImageContent`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:ImageContent) or [`TextContent`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:TextContent)`) array` or `object` or `string` 工具呼叫的結果。"

          **可能類型**：



        ??? note "**([ImageContent](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:ImageContent) or [TextContent](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:TextContent)) array**"

            每個項目為以下其中之一的清單：[`ImageContent`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:ImageContent)、[`TextContent`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:TextContent)。





        ??? note "**string**"

            直接的字串值。





    ---


      **call_id**: required `string`

      用來對應函式呼叫區塊中 ID 的識別碼。



    ---


      **type**: required `object`

      Value: `function_result`



    ---


      **name**: `string`

      被呼叫的工具名稱。



    ---


      **is_error**: `boolean`

      工具呼叫是否發生錯誤。






      **範例**

      **FunctionResultStep**

      **Example**

      **FunctionResultStep**

      ```json
      {
        "name": "get_weather",
        "type": "function_result",
        "call_id": "call_98231",
        "result": [
          {
            "type": "text",
            "text": "{\"weather\":\"sunny\"}"
          }
        ]
      }
      ```



??? note "**GoogleMapsCallStep**"

      Google Maps 呼叫步驟。




      **id**: required `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**: required `object`

      Value: `google_maps_call`



    ---




    ??? note "**arguments**: `GoogleMapsCallStepArguments` 要傳遞給 Google Maps 工具的引數。"

        **queries**: `string array`

        要執行的查詢。





    ---


      **signature**: `string`

      供後端驗證的簽章雜湊。






      **範例**

      **GoogleMapsCallStep**

      **Example**

      **GoogleMapsCallStep**

      ```json
      {
        "type": "google_maps_call",
        "arguments": {
          "latitude": 37.7749,
          "longitude": -122.4194
        },
        "id": "maps_call_39201"
      }
      ```



??? note "**GoogleMapsResultStep**"

      Google Maps 結果步驟。






    ??? note "**result**: required `GoogleMapsResultItem array`"

        ??? note "**places**: `GoogleMapsResultPlaces array`"

              **place_id**: `string`

              **name**: `string`

              **url**: `string`



            ??? note "**review_snippets**: `ReviewSnippet array`"

                **title**: `string`

                評論的標題。

                **url**: `string`

                對應到 Google Maps 上使用者評論的連結。

                **review_id**: `string`

                評論片段的 ID。



          **widget_context_token**: `string`





    ---


      **call_id**: required `string`

      用來對應函式呼叫區塊中 ID 的識別碼。



    ---


      **type**: required `object`

      Value: `google_maps_result`



    ---


      **signature**: `string`

      供後端驗證的簽章雜湊。






      **範例**

      **GoogleMapsResultStep**

      **Example**

      **GoogleMapsResultStep**

      ```json
      {
        "type": "google_maps_result",
        "call_id": "maps_call_39201",
        "result": [
          {
            "name": "Golden Gate Park",
            "place_id": "ChIJIQBpAG2ahYAR9R7bNdTLg8M",
            "rating": 4.8
          }
        ]
      }
      ```



??? note "**GoogleSearchCallStep**"

      Google Search 呼叫步驟。






    ??? note "**arguments**: required `GoogleSearchCallStepArguments` 要傳遞給 Google Search 的引數。"

        **queries**: `string array`

        後續網路搜尋的網路搜尋查詢。





    ---


      **id**: required `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**: required `object`

      Value: `google_search_call`



    ---




    ??? note "**search_type**: `string enum` 已啟用的搜尋接地類型。"

        可能的值：

        - `web_search`：設定此欄位可啟用網路搜尋。僅傳回文字結果。
        - `image_search`：設定此欄位可啟用圖片搜尋。傳回圖片位元組。





    ---


      **signature**: `string`

      供後端驗證的簽章雜湊。






      **範例**

      **GoogleSearchCallStep**

      **Example**

      **GoogleSearchCallStep**

      ```json
      {
        "type": "google_search_call",
        "arguments": {
          "query": "Who won the men's 100m in Paris 2024?"
        },
        "id": "search_call_19201"
      }
      ```



??? note "**GoogleSearchResultStep**"

      Google Search 結果步驟。






    ??? note "**result**: required `GoogleSearchResultItem array` Google Search 的結果。"

        **search_suggestions**: `string`

        可嵌入網頁或應用程式 webview 的網路內容片段。





    ---


      **call_id**: required `string`

      用來對應函式呼叫區塊中 ID 的識別碼。



    ---


      **type**: required `object`

      Value: `google_search_result`



    ---


      **is_error**: `boolean`

      Google Search 是否發生錯誤。



    ---


      **signature**: `string`

      供後端驗證的簽章雜湊。






      **範例**

      **GoogleSearchResultStep**

      **Example**

      **GoogleSearchResultStep**

      ```json
      {
        "type": "google_search_result",
        "call_id": "search_call_19201",
        "result": [
          {
            "title": "Paris 2024 Olympics: Noah Lyles wins men's 100m gold",
            "url": "https://olympics.com/en/news/paris-2024-noah-lyles-wins-mens-100m-gold",
            "snippet": "American Noah Lyles won the Olympic men's 100m gold medal in a photo finish."
          }
        ]
      }
      ```



??? note "**McpServerToolCallStep**"

      MCPServer 工具呼叫步驟。




      **name**: required `string`

      被呼叫的工具名稱。



    ---


      **server_name**: required `string`

      所使用的 MCP 伺服器名稱。



    ---


      **arguments**: required `object`

      函式引數的 JSON 物件。



    ---


      **id**: required `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**: required `object`

      Value: `mcp_server_tool_call`






      **範例**

      **McpServerToolCallStep**

      **Example**

      **McpServerToolCallStep**

      ```json
      {
        "name": "calculate_tax",
        "type": "mcp_server_tool_call",
        "arguments": {
          "income": 120000,
          "state": "CA"
        },
        "id": "mcp_call_29012",
        "server_name": "financial_mcp_server"
      }
      ```



??? note "**McpServerToolResultStep**"

      MCPServer 工具結果步驟。






    ??? note "**result**: required `(`[`ImageContent`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:ImageContent) or [`TextContent`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:TextContent)`) array` or `object` or `string` MCP 伺服器呼叫的輸出。可以是簡單文字或豐富內容。"

          **可能類型**：



        ??? note "**([ImageContent](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:ImageContent) or [TextContent](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:TextContent)) array**"

            每個項目為以下其中之一的清單：[`ImageContent`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:ImageContent)、[`TextContent`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:TextContent)。





        ??? note "**string**"

            直接的字串值。





    ---


      **call_id**: required `string`

      用來對應函式呼叫區塊中 ID 的識別碼。



    ---


      **type**: required `object`

      Value: `mcp_server_tool_result`



    ---


      **name**: `string`

      此特定工具呼叫所呼叫的工具名稱。



    ---


      **server_name**: `string`

      所使用的 MCP 伺服器名稱。






      **範例**

      **McpServerToolResultStep**

      **Example**

      **McpServerToolResultStep**

      ```json
      {
        "name": "calculate_tax",
        "type": "mcp_server_tool_result",
        "call_id": "mcp_call_29012",
        "result": {
          "tax_due": 32400
        },
        "server_name": "financial_mcp_server"
      }
      ```



??? note "**ModelOutputStep**"

      模型生成的輸出。




      **type**: required `object`

      Value: `model_output`



    ---


      **content**: [`Content`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:Content) `array`






      **範例**

      **ModelOutputStep**

      **Example**

      **ModelOutputStep**

      ```json
      {
        "type": "model_output",
        "content": [
          {
            "type": "text",
            "text": "The capital of France is Paris."
          }
        ]
      }
      ```



??? note "**ProcessingCallStep**"

      由伺服器發起、用於媒體分析的處理步驟（例如影片
      理解）。


      **id**: required `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**: required `object`

      Value: `processing_call`



    ---


      **signature**: `string`

      供後端驗證的簽章雜湊。



??? note "**ProcessingResultStep**"

      伺服器發起之媒體處理步驟的結果。


      **call_id**: required `string`

      用來對應函式呼叫區塊中 ID 的識別碼。



    ---


      **type**: required `object`

      Value: `processing_result`



    ---


      **signature**: `string`

      供後端驗證的簽章雜湊。



??? note "**ThoughtStep**"

      思考步驟。




      **type**: required `object`

      Value: `thought`



    ---


      **signature**: `string`

      供後端驗證的簽章雜湊。



    ---


      **summary**: [`Content`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:Content) `array`

      思考的摘要。






      **範例**

      **ThoughtStep**

      **Example**

      **ThoughtStep**

      ```json
      {
        "type": "thought",
        "signature": "thought_sig_abcd1234",
        "summary": [
          {
            "type": "text",
            "text": "The model is searching Google for the capital of France."
          }
        ]
      }
      ```



??? note "**UrlContextCallStep**"

      URL 上下文呼叫步驟。






    ??? note "**arguments**: required `UrlContextCallArguments` 要傳遞給 URL 上下文的引數。"

        **urls**: `string array`

        要擷取的 URL。





    ---


      **id**: required `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**: required `object`

      Value: `url_context_call`



    ---


      **signature**: `string`

      供後端驗證的簽章雜湊。






      **範例**

      **UrlContextCallStep**

      **Example**

      **UrlContextCallStep**

      ```json
      {
        "type": "url_context_call",
        "arguments": {
          "urls": [
            "https://www.example.com"
          ]
        },
        "id": "url_call_10219"
      }
      ```



??? note "**UrlContextResultStep**"

      URL 上下文結果步驟。






    ??? note "**result**: required `UrlContextResult array` URL 上下文的結果。"

          **url**: `string`

          已擷取的 URL。



        ??? note "**status**: `string enum` URL 擷取的狀態。"

            可能的值：

            - `success`：URL 擷取成功。
            - `error`：URL 擷取因錯誤而失敗。
            - `paywall`：URL 擷取失敗，因為內容位於付費牆之後。
            - `unsafe`：URL 擷取失敗，因為內容不安全。





    ---


      **call_id**: required `string`

      用來對應函式呼叫區塊中 ID 的識別碼。



    ---


      **type**: required `object`

      Value: `url_context_result`



    ---


      **is_error**: `boolean`

      URL 上下文是否發生錯誤。



    ---


      **signature**: `string`

      供後端驗證的簽章雜湊。






      **範例**

      **UrlContextResultStep**

      **Example**

      **UrlContextResultStep**

      ```json
      {
        "type": "url_context_result",
        "call_id": "url_call_10219",
        "result": [
          {
            "title": "Example Domain",
            "url": "https://www.example.com",
            "snippet": "This domain is for use in illustrative examples in documents."
          }
        ]
      }
      ```



??? note "**UserInputStep**"

      使用者提供的輸入。




      **type**: required `object`

      Value: `user_input`



    ---


      **content**: [`Content`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:Content) `array`






      **範例**

      **UserInputStep**

      **Example**

      **UserInputStep**

      ```json
      {
        "type": "user_input",
        "content": [
          {
            "type": "text",
            "text": "What is the capital of France?"
          }
        ]
      }
      ```



### EnvironmentConfig {#Resource:EnvironmentConfig}

自訂環境的設定。


  
  **屬性**：

  
  **type**: required `object`

  Value: `remote`

  

---


  

??? note "**sources**: `Source array`"

    ??? note "**type**: `string enum`"

        可能的值：

        - `gcs`：Cloud Storage 儲存桶。
        - `inline`：行內內容。
        - `repository`：一般儲存庫。來源 URL 中的通訊協定前綴可識別提供者（例如 github://、gcs://）。



      **source**: `string`

      環境的來源。對 Cloud Storage 而言，這是 Cloud Storage 路徑；對 GitHub 而言，這是 GitHub 路徑。

      **target**: `string`

      來源在環境中應出現的位置。

      **content**: `string`

      當 `type` 為 `INLINE` 時的行內內容。

      **encoding**: `string`

      行內內容的選用編碼（例如 `base64`）。



  

---


  

??? note "**network**: [`EnvironmentNetworkEgressAllowlist`](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:EnvironmentNetworkEgressAllowlist) or `string enum` 環境的網路設定。"

      **可能類型**：



    ??? note "**[EnvironmentNetworkEgressAllowlist](/api-reference/interactions-api/cancel-interaction-by-id/#Resource:EnvironmentNetworkEgressAllowlist)**"

          環境的網路輸出設定。



        ??? note "**allowlist**: `EgressRule array` or `string enum` 允許的網域及其設定清單。設為 `"disabled"` 可封鎖所有網路輸出。"

              **可能類型**：



            ??? note "**EgressRule array**"

                單一網域許可清單規則，可選用標頭注入。

                **domain**: required `string`

                允許送出要求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

                **transform**: `object`

                要注入符合此規則之要求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

                **credential**: `string`

                選用。以 ID 參照伺服器管理的 Credential 資源。





            ??? note "**string enum**"

                可能的值：

                - `disabled`：所有網路輸出都會被封鎖。





    ??? note "**string enum**"

        可能的值：

        - `disabled`：所有網路輸出都會被封鎖。



  

---


  **environment_id**: `string`

  選用。互動的環境 ID。若有指定，要求會更新既有環境，而非建立新環境。

  

---


  

??? note "**env**: `object` or `string` 要在沙箱環境中設定的環境變數。"

      **可能類型**：



    ??? note "**string**"

        直接的字串值。



  

---


  

??? note "**mode**: `string enum` 此環境的運算生命週期模式。"

    可能的值：

    - `on_demand`：此環境的運算生命週期模式。
    - `self_hosted`：此環境的運算生命週期模式。



  

---


  **custom_config**: `object`

  選用。任意的客戶自訂 JSON 設定，會原樣傳遞給自我託管環境輪詢器。僅在 `mode` 為 `SELF_HOSTED` 時支援。

  

  

  
  **範例**

  

=== "行內來源"

  **Example**

=== "Inline Sources"

      ```json
      {
        "type": "remote",
        "sources": [
          {
            "type": "inline",
            "content": "You are a data analyst. Always include visualizations and export results as PDF.",
            "target": ".agents/AGENTS.md"
          },
          {
            "type": "inline",
            "content": "---\nname: slide-maker\ndescription: Create HTML slide decks\n---\n# Slide Maker\n\nWhen asked to create a presentation:\n1. Analyze the input data\n2. Create an HTML slide deck with reveal.js\n3. Save to /workspace/output/slides.html",
            "target": ".agents/skills/slide-maker/SKILL.md"
          }
        ]
      }
      ```

=== "外部來源"

      ```json
      {
        "type": "remote",
        "sources": [
          {
            "type": "repository",
            "source": "https://github.com/my-org/my-skills.git",
            "target": ".agents/skills"
          },
          {
            "type": "gcs",
            "source": "gs://my-bucket/my-folder",
            "target": "/workspace/data"
          }
        ]
      }
      ```

=== "網路許可清單"

      ```json
      {
        "type": "remote",
        "network": {
          "allowlist": [
            {
              "domain": "pypi.org"
            },
            {
              "domain": "*.github.com"
            }
          ]
        }
      }
      ```

=== "Proxy 憑證"

      ```json
      {
        "type": "remote",
        "network": {
          "allowlist": [
            {
              "domain": "api.github.com",
              "transform": {
                "Authorization": "Bearer YOUR_GITHUB_TOKEN"
              }
            }
          ]
        }
      }
      ```


  


### EnvironmentNetworkEgressAllowlist {#Resource:EnvironmentNetworkEgressAllowlist}

環境的網路輸出設定。


  
  **屬性**：

  
  

??? note "**allowlist**: `EgressRule array` or `string enum` 允許的網域及其設定清單。設為 `"disabled"` 可封鎖所有網路輸出。"

      **可能類型**：



    ??? note "**EgressRule array**"

        單一網域許可清單規則，可選用標頭注入。

        **domain**: required `string`

        允許送出要求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

        **transform**: `object`

        要注入符合此規則之要求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

        **credential**: `string`

        選用。以 ID 參照伺服器管理的 Credential 資源。





    ??? note "**string enum**"

        可能的值：

        - `disabled`：所有網路輸出都會被封鎖。



  

  

  
  **範例**

  **網路許可清單**

  **Example**

  **Network Allowlist**

  ```json
  {
    "allowlist": [
      {
        "domain": "github.com",
        "transform": [
          {
            "Authorization": "Bearer your-token"
          }
        ]
      },
      {
        "domain": "*.googleapis.com"
      }
    ]
  }
  ```

  


### ToolChoiceConfig {#Resource:ToolChoiceConfig}

包含允許工具的工具選擇設定。


  
  **屬性**：

  
  

??? note "**allowed_tools**: `AllowedTools` 允許使用的工具。"

    ??? note "**mode**: `string enum` 工具選擇的模式。"

        可能的值：

        - `auto`：自動工具選擇。
        - `any`：任一工具選擇。
        - `none`：不選擇工具。
        - `validated`：經驗證的工具選擇。



      **tools**: `string array`

      允許工具的名稱。



  

  

  
  **範例**

  **Example**

  ```json
  {
    "allowed_tools": {
      "mode": "any",
      "tools": [
        "my_tool"
      ]
    }
  }
  ```

  


### ImageContent {#Resource:ImageContent}

圖片內容區塊。


  
  **屬性**：

  
  **type**: required `object`

  Value: `image`

  

---


  **data**: `string`

  圖片內容。

  

---


  **uri**: `string`

  圖片的 URI。

  

---


  

??? note "**resolution**: `MediaResolution` 媒體的解析度。"

    可能的值：

    - `low`：低解析度。
    - `medium`：中解析度。
    - `high`：高解析度。
    - `ultra_high`：超高解析度。



  

---


  

??? note "**mime_type**: `string enum` 圖片的 MIME 類型。"

    可能的值：

    - `image/png`：PNG 圖片格式
    - `image/jpeg`：JPEG 圖片格式
    - `image/webp`：WebP 圖片格式
    - `image/heic`：HEIC 圖片格式
    - `image/heif`：HEIF 圖片格式
    - `image/gif`：GIF 圖片格式
    - `image/bmp`：BMP 圖片格式
    - `image/tiff`：TIFF 圖片格式



  

  

  
  **範例**

  **圖片**

  **Example**

  **Image**

  ```json
  {
    "type": "image",
    "data": "BASE64_ENCODED_IMAGE",
    "mime_type": "image/png"
  }
  ```

  


### TextContent {#Resource:TextContent}

文字內容區塊。


  
  **屬性**：

  
  **text**: required `string`

  文字內容。

  

---


  **type**: required `object`

  Value: `text`

  

---


  

??? note "**annotations**: `Annotation array` 模型生成內容的引用資訊。"

      **可能類型**：



    ??? note "**FileCitation**"

        檔案引用註解。

        **type**: required `object`

        Value: `file_citation`

        **document_uri**: `string`

        檔案的 URI。

        **file_name**: `string`

        檔案的名稱。

        **source**: `string`

        文字某部分所歸因的來源。

        **custom_metadata**: `object`

        使用者提供的擷取上下文相關中繼資料。

        **page_number**: `integer`

        所引用文件的頁碼（如適用）。

        **media_id**: `string`

        圖片引用時的媒體 ID（如適用）。

        **start_index**: `integer`

        歸因於此來源的回應區段起點。索引表示區段的起始位置，以位元組為單位。

        **end_index**: `integer`

        歸因區段的終點（不含該點）。





    ??? note "**PlaceCitation**"

          地點引用註解。

          **type**: required `object`

          Value: `place_citation`

          **place_id**: `string`

          地點的 ID，格式為 `places/{place_id}`。

          **name**: `string`

          地點的標題。

          **url**: `string`

          地點的 URI 參照。



        ??? note "**review_snippets**: `ReviewSnippet array` 用於生成 Google Maps 中某地點特色相關回答的評論片段。"

            **title**: `string`

            評論的標題。

            **url**: `string`

            對應到 Google Maps 上使用者評論的連結。

            **review_id**: `string`

            評論片段的 ID。



          **start_index**: `integer`

          歸因於此來源的回應區段起點。索引表示區段的起始位置，以位元組為單位。

          **end_index**: `integer`

          歸因區段的終點（不含該點）。





    ??? note "**SpeechAnnotation**"

        文字內容的語音註解。

        **type**: required `object`

        Value: `speech_metadata`

        **speaker**: `string`

        要與此輪對話關聯的講者。

        **style**: `string`

        語音合成的風格指令。

        **start_index**: `integer`

        歸因於此來源的回應區段起點。索引表示區段的起始位置，以位元組為單位。

        **end_index**: `integer`

        歸因區段的終點（不含該點）。





    ??? note "**UrlCitation**"

        URL 引用註解。

        **type**: required `object`

        Value: `url_citation`

        **url**: `string`

        URL。

        **title**: `string`

        URL 的標題。

        **start_index**: `integer`

        歸因於此來源的回應區段起點。索引表示區段的起始位置，以位元組為單位。

        **end_index**: `integer`

        歸因區段的終點（不含該點）。





    ??? note "**WordInfo**"

        轉錄輸出的逐字 ASR 註解。包含單字文字、選用的時間資訊，以及選用的講者歸因。

        **type**: required `object`

        Value: `word_info`

        **text**: `string`

        轉錄出的單字。

        **start_offset**: `string`

        單字相對於音訊開頭的起始時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

        **end_offset**: `string`

        單字相對於音訊開頭的結束時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

        **speaker**: `string`

        選用。此單字的講者標籤（例如 "spk_1"、"spk_2"）。當 TranscriptionConfig 中設定了 diarization_mode 時才會出現。

        **start_index**: `integer`

        歸因於此來源的回應區段起點。索引表示區段的起始位置，以位元組為單位。

        **end_index**: `integer`

        歸因區段的終點（不含該點）。



  

  

  
  **範例**

  **文字**

  **Example**

  **Text**

  ```json
  {
    "type": "text",
    "text": "Hello, how are you?"
  }
  ```

  

