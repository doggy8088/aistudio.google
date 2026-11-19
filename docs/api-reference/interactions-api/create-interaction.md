# 建立互動


!!! note " "

      您目前檢視的是 Interactions API 的 beta 版本。端點位於 `/v1beta/` 之下。另有穩定的 [v1 版本](/api-reference/interactions-api/create-interaction/?api-version=v1) 可供使用。


`POST` `https://generativelanguage.googleapis.com/v1beta/interactions`

建立新的互動。


  
## 請求主體 {#request-body}

  
  

??? note "**model**：`ModelOption` 用於產生互動的 `Model` 名稱。**未提供 `agent` 時為必填。**"

    可能的值：

    - `gemma-4-26b-a4b-it`：Gemma 4 26B A4B IT
    - `gemma-4-31b-it`：Gemma 4 31B IT
    - `gemini-flash-latest`：Gemini Flash 的最新版本
    - `gemini-flash-lite-latest`：Gemini Flash-Lite 的最新版本
    - `gemini-pro-latest`：Gemini Pro 的最新版本
    - `gemini-2.5-flash`：我們的第一個混合推理模型，支援 100 萬個權杖的上下文視窗，並具備思考預算。
    - `gemini-2.5-pro`：我們最先進的多用途模型，擅長程式設計與複雜推理任務。
    - `gemini-2.5-flash-lite`：我們最小、最具成本效益的模型，為大規模使用而打造。
    - `gemini-3.5-flash-lite`：Gemini 3.5 Flash-Lite——我們最快速、最具成本效益的 3.5 模型，適合高輸送量執行。
    - `gemini-2.5-flash-image`：我們的原生圖片生成模型，針對速度、彈性與上下文理解最佳化。文字輸入與輸出的計價與 2.5 Flash 相同。
    - `gemini-3-flash-preview`：我們為速度打造的最聰明模型，結合前沿智慧與卓越的搜尋及接地能力。
    - `gemini-3.1-pro-preview`：我們最新的 SOTA 推理模型，具備前所未有的深度與細膩度，以及強大的多模態理解與程式設計能力。
    - `gemini-3.1-pro-preview-customtools`：Gemini 3.1 Pro Preview，針對自訂工具使用最佳化
    - `gemini-3.1-flash-lite`：我們最具成本效益的模型，針對大量代理任務、翻譯與簡單資料處理最佳化。
    - `gemini-3.1-flash-lite-image`：Gemini 3.1 Flash Lite Image。
    - `gemini-3-pro-image`：Gemini 3 Pro Image
    - `nano-banana-pro-preview`：Gemini 3 Pro Image Preview
    - `gemini-3.1-flash-image`：Gemini 3.1 Flash Image。
    - `gemini-nano-banana-2.1`：Gemini Nano Banana 2.1。
    - `gemini-3.1-flash-tts-preview`：Gemini 3.1 Flash TTS：強大、低延遲的語音生成。享有自然的輸出、可引導的提示詞，以及全新的富表現力音訊標籤，精確掌控旁白。
    - `gemini-3.5-flash`：Gemini 3.5 Flash——我們較早的 Flash 模型，為日常、高輸送量工作負載的速度與基礎效能而打造。
    - `gemini-3.6-flash`：Gemini 3.6 Flash——我們前一代的 Flash 模型，在一般代理與日常任務中兼顧速度與多模態能力。
    - `gemini-3.7-flash`：Gemini 3.7 Flash——我們高速、高效率的 Flash 模型，為日常程式設計、代理工具使用與可靠的多步驟執行而打造。
    - `gemini-3.8-flash`：Gemini 3.8 Flash——我們最聰明的 Flash 模型，為長程軟體工程、自主代理與複雜的企業工作流程而設計。
    - `gemini-4-argon`：Gemini 4 Argon——我們全新的前沿模型，為以深度與精確度解決最困難的問題而打造，涵蓋真實世界的軟體工程與知識工作。
    - `gemini-4-carbon`：Gemini 4 Carbon——我們能力最強的推理模型，為持續的代理程式設計、多模態知識工作、科學發現與網路安全防禦而打造。
    - `gemini-4-hydrogen`：Gemini 4 Hydrogen——具備前沿級智慧的模型，為程式設計、代理工作流程與多模態知識工作的快速、可靠執行而打造。
    - `gemini-3.8-flash-tts`：Gemini 3.8 Flash TTS——旗艦 TTS 模型，支援 Voice Design 與雙講者劇本控制。可提示自訂聲音角色、逐行指導語音呈現，並加入聲音爆發效果。
    - `gemini-3.8-flash-lite-tts`：Gemini 3.8 Flash Lite TTS——高速且具成本效益，適合快速配音、媒體在地化與高輸送量語音代理。可直接取代 gemini-3.1-flash-tts-preview。
    - `gemini-3.5-transcribe`：Gemini 3.5 Transcribe——低延遲的語音轉文字模型，具備以語句為單位的語言偵測、講者分離、單字級時間戳記與自訂詞彙偏置。
    - `lyria-3-clip-preview`：我們的低延遲音樂生成模型，針對高傳真音訊片段與精確的節奏控制最佳化。
    - `lyria-3-pro-preview`：我們先進的完整歌曲生成模型，具備深厚的作曲理解力，針對精確的結構控制與多樣音樂風格間的複雜轉場最佳化。
    - `gemini-robotics-er-1.6-preview`：Gemini Robotics-ER 1.6 Preview
    - `gemini-robotics-er-2-preview`：Gemini Robotics Embodied Reasoning 2 Preview
    - `lyria-3.5`：我們的旗艦音樂生成模型，針對具複雜結構連貫性的完整長度歌曲最佳化。
    - `gemini-omni-1.2-flash`：Gemini Omni 1.2 Flash——我們最新的多模態模型，支援快速、對話式的影片生成、編輯與電影級控制。
    - `gemini-omni-1.1-flash`：Gemini Omni 1.1 Flash——我們的高效能多模態模型，專為快速、對話式的影片生成、編輯與電影級控制而設計。
    - `gemini-omni-flash-preview`：我們多模態模型的預覽版，支援對話式影片生成、編輯與電影級控制。



  

---


  

??? note "**agent**：`AgentOption` 用於產生互動的 `Agent` 名稱。**未提供 `model` 時為必填。**"

    可能的值：

    - `deep-research-preview-04-2026`：Gemini Deep Research Agent
    - `deep-research-max-preview-04-2026`：Gemini Deep Research Max Agent
    - `antigravity-preview-05-2026`：使用 Antigravity 受管理代理執行需要推理、檔案操作與工具使用的多步驟任務。
    - `antigravity-preview-09-2026`：使用 Antigravity 受管理代理執行需要推理、檔案操作與工具使用的多步驟任務。



  

---


  **input**：必填 [`Content`](/api-reference/interactions-api/create-interaction/#Resource:Content) 或 [`Content`](/api-reference/interactions-api/create-interaction/#Resource:Content) `array` 或 [`Step`](/api-reference/interactions-api/create-interaction/#Resource:Step) `array` 或 `string`

  互動的輸入（Model 與 Agent 共用）。

  

---


  

??? note "**generation_config**：`GenerationConfig` **模型設定** 模型互動的設定參數。*為 `agent_config` 的替代選項。僅在設定 `model` 時適用。*"

      **seed**：`integer`

      解碼時使用的種子，以確保可重現性。

      **stop_sequences**：`string array`

      會停止輸出互動的字元序列清單。



    ??? note "**tool_choice**：[`ToolChoiceConfig`](/api-reference/interactions-api/create-interaction/#Resource:ToolChoiceConfig) 或 `string enum` 工具選擇設定。"

          **可能的類型**： 



        ??? note "**[ToolChoiceConfig](/api-reference/interactions-api/create-interaction/#Resource:ToolChoiceConfig)**"

              包含允許工具的工具選擇設定。



            ??? note "**allowed_tools**：`AllowedTools` 允許的工具。"

                ??? note "**mode**：`string enum` 工具選擇的模式。"

                    可能的值：

                    - `auto`：自動工具選擇。
                    - `any`：任意工具選擇。
                    - `none`：不使用工具選擇。
                    - `validated`：經驗證的工具選擇。



                  **tools**：`string array`

                  允許工具的名稱。





        ??? note "**string enum**"

            可能的值：

            - `auto`：自動工具選擇。
            - `any`：任意工具選擇。
            - `none`：不使用工具選擇。
            - `validated`：經驗證的工具選擇。





    ??? note "**thinking_level**：`ThinkingLevel` 模型應產生的思考權杖層級。"

        可能的值：

        - `minimal`：幾乎不進行思考。
        - `low`：低思考層級。
        - `medium`：中思考層級。
        - `high`：高思考層級。
        - `xhigh`：超高思考層級，高於 `high`。





    ??? note "**thinking_summaries**：`ThinkingSummaries` 是否在回應中包含思考摘要。"

        可能的值：

        - `auto`：自動思考摘要。
        - `none`：不含思考摘要。



      **max_output_tokens**：`integer`

      回應中包含的權杖數量上限。



    ??? note "**video_config**：`VideoConfig` 影片生成設定。"

        ??? note "**task**：`string enum` 影片生成的選用任務模式。若未指定，模型會根據提供的文字提示詞與輸入媒體自動決定適當的模式。"

            可能的值：

            - `text_to_video`：僅從文字提示詞生成影片。
            - `image_to_video`：從一或兩張來源圖片生成影片。第一張圖片定義起始影格，選用的第二張圖片定義結束影格。
            - `reference_to_video`：使用參考媒體（例如圖片、音訊或影片）生成影片。
            - `edit`：修改既有的輸入影片。
            - `extend`：延伸既有的輸入影片。





    ??? note "**transcription_config**：`TranscriptionConfig` 選用。語音辨識（轉錄）設定。若提供此設定，將啟用 ASR。"

          **language_codes**：`string array`

          選用。BCP-47 語言代碼，提供音訊中所含語言的提示。若省略或留空，預設為自動語言偵測。

          **custom_vocabulary**：`string array`

          選用。自訂詞彙片語清單，用於引導語音辨識模型偏向辨識特定詞彙。



        ??? note "**mode**：`TranscriptionMode` 或 `string enum` 具判別性的轉錄模式選項或列舉。"

              **可能的類型**： 



            ??? note "**SmartTranscriptionMode**"

                智慧轉錄模式的設定。

                **type**：必填 `object`

                值：`smart`

                **source_text**：`string`

                要透過語音指令編輯或改寫的來源文字。提供時，模型會執行語音驅動的編輯，並輸出最終定稿的替代文字。





            ??? note "**VerbatimTranscriptionMode**"

                逐字轉錄模式的設定。

                **type**：必填 `object`

                值：`verbatim`

                **timestamp_granularities**：`string array`

                選用。轉錄輸出中要包含的時間戳記粒度。支援的值："word"。若留空，則不產生時間戳記。

                **diarization_mode**：`string`

                選用。設定講者分離。支援的值："speaker"。





            ??? note "**string enum**"

                可能的值：

                - `verbatim`：逐字轉錄模式。
                - `smart`：智慧轉錄模式。





    ??? note "**structured_speech_config**：`SpeakerConfig` 或 `SpeechConfig array` 語音與多講者設定。"

          **可能的類型**： 



        ??? note "**SpeakerConfig**"

              多講者與語音生成的設定。



            ??? note "**speakers**：`SpeechConfig array` 個別講者的設定。"

                **voice**：`string`

                講者的聲音。

                **language**：`string`

                語音的語言。

                **speaker**：`string`

                講者的名稱，應與提示詞中給出的講者名稱相符。





        ??? note "**SpeechConfig array**"

            語音互動的設定。

            **voice**：`string`

            講者的聲音。

            **language**：`string`

            語音的語言。

            **speaker**：`string`

            講者的名稱，應與提示詞中給出的講者名稱相符。



  

---


  

??? note "**agent_config**：`AntigravityAgentConfig` 或 `DeepResearchAgentConfig` 或 `DynamicAgentConfig` **代理設定** 代理的設定。*為 `generation_config` 的替代選項。僅在設定 `agent` 時適用。*"

      **可能的類型**： 



    ??? note "**AntigravityAgentConfig**"

        Antigravity 代理執行階段的設定。提供伺服器端對代理執行環境與工具設定的控制。

        **type**：必填 `object`

        值：`antigravity`

        **model**：`string`

        用於代理推理的模型。

        **max_total_tokens**：`string`

        代理執行的權杖總數上限。





    ??? note "**DeepResearchAgentConfig**"

          Deep Research 代理的設定。

          **type**：必填 `object`

          值：`deep-research`



        ??? note "**thinking_summaries**：`ThinkingSummaries` 是否在回應中包含思考摘要。"

            可能的值：

            - `auto`：自動思考摘要。
            - `none`：不含思考摘要。





        ??? note "**visualization**：`string enum` 是否在回應中包含視覺化內容。"

            可能的值：

            - `off`：不包含視覺化內容。
            - `auto`：自動包含視覺化內容。



          **collaborative_planning**：`boolean`

          為 Deep Research 代理啟用人機協作規劃。設為 true 時，Deep Research 代理會在回應中提供研究計畫。代理只有在使用者於下一輪確認計畫後才會繼續執行。





    ??? note "**DynamicAgentConfig**"

        動態代理的設定。

        **type**：必填 `object`

        值：`dynamic`



  

---


  **system_instruction**：`string`

  互動的系統指令。

  

---


  **tools**：[`Tool`](/api-reference/interactions-api/create-interaction/#Resource:Tool) `array`

  模型在互動期間可呼叫的工具宣告清單。

  

---


  

??? note "**response_format**：[`ResponseFormat`](/api-reference/interactions-api/create-interaction/#Resource:ResponseFormat) 或 [`ResponseFormat`](/api-reference/interactions-api/create-interaction/#Resource:ResponseFormat) `array` 強制產生的回應為符合此欄位所指定 JSON 架構的 JSON 物件。"

      **可能的類型**： 



    ??? note "**[ResponseFormat](/api-reference/interactions-api/create-interaction/#Resource:ResponseFormat)**"






    ??? note "**[ResponseFormat](/api-reference/interactions-api/create-interaction/#Resource:ResponseFormat) array**"

        每個項目為下列其中之一的清單：`AudioResponseFormat`、`ImageResponseFormat`、`TextResponseFormat`、`VideoResponseFormat`。



  

---


  **previous_interaction_id**：`string`

  前一次互動的 ID（如有）。

  

---


  

??? note "**environment**：[`EnvironmentConfig`](/api-reference/interactions-api/create-interaction/#Resource:EnvironmentConfig) 或 `string` 互動的環境設定。可以是指定遠端環境來源的物件，或是參照既有環境 ID 的字串。"

      **可能的類型**： 



    ??? note "**[EnvironmentConfig](/api-reference/interactions-api/create-interaction/#Resource:EnvironmentConfig)**"

          自訂環境的設定。

          **type**：必填 `object`

          值：`remote`



        ??? note "**sources**：`Source array`"

            ??? note "**type**：`string enum`"

                可能的值：

                - `gcs`：Cloud Storage 值區。
                - `inline`：行內內容。
                - `repository`：一般儲存庫。來源 URL 中的通訊協定前綴可識別提供者（例如 github://、gcs://）。



              **source**：`string`

              環境的來源。對 Cloud Storage 而言，這是 Cloud Storage 路徑；對 GitHub 而言，這是 GitHub 路徑。

              **target**：`string`

              來源在環境中應出現的位置。

              **content**：`string`

              當 `type` 為 `INLINE` 時的行內內容。

              **encoding**：`string`

              行內內容的選用編碼（例如 `base64`）。





        ??? note "**network**：[`EnvironmentNetworkEgressAllowlist`](/api-reference/interactions-api/create-interaction/#Resource:EnvironmentNetworkEgressAllowlist) 或 `string enum` 環境的網路設定。"

              **可能的類型**： 



            ??? note "**[EnvironmentNetworkEgressAllowlist](/api-reference/interactions-api/create-interaction/#Resource:EnvironmentNetworkEgressAllowlist)**"

                  環境的網路輸出設定。



                ??? note "**allowlist**：`EgressRule array` 或 `string enum` 允許的網域及其設定清單。設為 `"disabled"` 可封鎖所有網路輸出。"

                      **可能的類型**： 



                    ??? note "**EgressRule array**"

                        單一網域允許清單規則，可選用標頭注入。

                        **domain**：必填 `string`

                        允許向外請求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

                        **transform**：`object`

                        要注入符合此規則之請求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

                        **credential**：`string`

                        選用。以 ID 參照伺服器管理的 Credential 資源。





                    ??? note "**string enum**"

                        可能的值：

                        - `disabled`：所有網路輸出皆被封鎖。





            ??? note "**string enum**"

                可能的值：

                - `disabled`：所有網路輸出皆被封鎖。



          **environment_id**：`string`

          選用。互動的環境 ID。若指定，請求將更新既有環境，而非建立新環境。



        ??? note "**env**：`object` 或 `string` 要在沙箱環境中設定的環境變數。"

              **可能的類型**： 



            ??? note "**string**"

                直接的字串值。





        ??? note "**mode**：`string enum` 此環境的運算生命週期模式。"

            可能的值：

            - `on_demand`：此環境的運算生命週期模式。
            - `self_hosted`：此環境的運算生命週期模式。



          **custom_config**：`object`

          選用。任意由客戶定義的 JSON 設定，會透傳至自行託管環境的輪詢器。僅在 `mode` 為 `SELF_HOSTED` 時支援。





    ??? note "**string**"

        直接的字串值。



  

---


  

??? note "**service_tier**：`ServiceTier` 互動的服務層級。"

    可能的值：

    - `flex`：Flex 服務層級。
    - `standard`：Standard 服務層級。
    - `priority`：Priority 服務層級。



  

---


  

??? note "**webhook_config**：`WebhookConfig` 選用。用於在互動完成時接收通知的 webhook 設定。"

    **uris**：`string array`

    選用。若設定，這些 webhook URI 將用於 webhook 事件，以取代已註冊的 webhook。

    **user_metadata**：`object`

    選用。每次向 webhook 發送事件時會一併傳回的使用者中繼資料。



  

---


  

??? note "**safety_settings**：`SafetySetting array` 互動的安全設定。"

    ??? note "**type**：必填 `HarmCategory` 要封鎖的危害類別類型。"

        可能的值：

        - `hate_speech`：基於特定屬性宣揚暴力或煽動對個人或群體仇恨的內容。
        - `dangerous_content`：宣揚、助長或促成危險活動的內容。
        - `harassment`：辱罵、威脅，或意圖霸凌、折磨或嘲弄的內容。
        - `sexually_explicit`：含有露骨性內容的內容。
        - `jailbreak`：旨在繞過安全篩選器的提示詞。





    ??? note "**threshold**：必填 `string enum` 封鎖內容的門檻。若危害機率超過此門檻，內容將被封鎖。"

        可能的值：

        - `block_low_and_above`：封鎖危害機率為低或更高的內容。
        - `block_medium_and_above`：封鎖危害機率為中或更高的內容。
        - `block_only_high`：僅封鎖危害機率為高的內容。
        - `off`：完全關閉安全篩選器。



    ??? note "**method**：`string enum` 選用。封鎖內容的方法。若未指定，預設行為是使用機率分數。"

        可能的值：

        - `severity`：危害封鎖方法同時使用機率與嚴重程度分數。
        - `probability`：危害封鎖方法使用機率分數。



  

---


  **labels**：`object`

  帶有使用者自訂中繼資料的請求標籤。標籤鍵與值的長度不得超過 63 個字元（Unicode 碼位），且只能包含小寫字母、數字字元、底線與連字號。允許國際字元。標籤值為選用。標籤鍵必須以字母開頭。

  

---


  **continuation_token**：`string`

  用於恢復長時間解碼的不透明權杖。輸出：當狀態為 REQUIRES_CONTINUATION 且可恢復解碼時設定。輸入：在 CreateInteraction 中原封不動地傳回最新權杖，以繼續解碼。

  

---


  **stream**：`boolean`

  僅供輸入。互動是否以串流方式傳輸。

  

---


  **store**：`boolean`

  僅供輸入。是否儲存回應與請求以供日後擷取。

  

---


  **background**：`boolean`

  僅供輸入。是否在背景執行模型互動。

  

  

  
  **範例請求** 

  

  

=== "簡單請求"


    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-3.8-flash",
              "input": "Hello, how are you?"
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          interaction = client.interactions.create(
              model="gemini-3.8-flash",
              input="Hello, how are you?",
          )
          print(interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({});
          const interaction = await ai.interactions.create({
            model: 'gemini-3.8-flash',
            input: 'Hello, how are you?',
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;

          Client client = new Client();
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-3.8-flash")
                  .input(InteractionsInput.of("Hello, how are you?"))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "Go"

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

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-3.8-flash"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput("Hello, how are you?")),
              })

              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{Body: body})
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```

=== "多輪對話"


    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-3.8-flash",
              "input": [
                { "type": "user_input", "content": [{ "type": "text", "text": "Hello!" }] },
                { "type": "model_output", "content": [{ "type": "text", "text": "Hi there! How can I help you today?" }] },
                { "type": "user_input", "content": [{ "type": "text", "text": "What is the capital of France?" }] }
              ]
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          response = client.interactions.create(
              model="gemini-3.8-flash",
              input=[
                  {
                      "type": "user_input",
                      "content": [{"type": "text", "text": "Hello!"}],
                  },
                  {
                      "type": "model_output",
                      "content": [{
                          "type": "text",
                          "text": "Hi there! How can I help you today?",
                      }],
                  },
                  {
                      "type": "user_input",
                      "content": [
                          {"type": "text", "text": "What is the capital of France?"}
                      ],
                  },
              ],
          )
          print(response.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({});
          const interaction = await ai.interactions.create({
            model: 'gemini-3.8-flash',
            input: [
              {type: 'user_input', content: [{type: 'text', text: 'Hello'}]},
              {
                type: 'model_output',
                content: [
                  {type: 'text', text: 'Hi there! How can I help you today?'},
                ],
              },
              {
                type: 'user_input',
                content: [{type: 'text', text: 'What is the capital of France?'}],
              },
            ],
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.ModelOutputStep;
          import com.google.genai.gaos.models.interactions.Step;
          import com.google.genai.gaos.models.interactions.TextContent;
          import com.google.genai.gaos.models.interactions.UserInputStep;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import java.util.List;

          Client client = new Client();
          List<Step> conversation =
              List.of(
                  UserInputStep.builder()
                      .content(List.of(TextContent.builder().text("Hello!").build()))
                      .build(),
                  ModelOutputStep.builder()
                      .content(
                          List.of(
                              TextContent.builder().text("Hi there! How can I help you today?").build()))
                      .build(),
                  UserInputStep.builder()
                      .content(
                          List.of(TextContent.builder().text("What is the capital of France?").build()))
                      .build());
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-3.8-flash")
                  .input(InteractionsInput.ofStep(conversation))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "Go"

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

              history := []gaos_interactions.Step{
                  gaos_interactions.NewStep(gaos_interactions.UserInputStep{
                      Content: []gaos_interactions.Content{
                          gaos_interactions.NewContent(gaos_interactions.TextContent{
                              Text: "Hello!",
                          }),
                      },
                  }),
                  gaos_interactions.NewStep(gaos_interactions.ModelOutputStep{
                      Content: []gaos_interactions.Content{
                          gaos_interactions.NewContent(gaos_interactions.TextContent{
                              Text: "Hi there! How can I help you today?",
                          }),
                      },
                  }),
                  gaos_interactions.NewStep(gaos_interactions.UserInputStep{
                      Content: []gaos_interactions.Content{
                          gaos_interactions.NewContent(gaos_interactions.TextContent{
                              Text: "What is the capital of France?",
                          }),
                      },
                  }),
              }

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-3.8-flash"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput(history)),
              })

              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{Body: body})
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```

=== "圖片輸入"


    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-3.8-flash",
              "input": [
                {
                  "type": "text",
                  "text": "What is in this picture?"
                },
                {
                  "type": "image",
                  "data": "BASE64_ENCODED_IMAGE",
                  "mime_type": "image/png"
                }
              ]
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          response = client.interactions.create(
              model="gemini-3.8-flash",
              input=[
                  {"type": "text", "text": "What is in this picture?"},
                  {
                      "type": "image",
                      "data": "BASE64_ENCODED_IMAGE",
                      "mime_type": "image/png",
                  },
              ],
          )
          print(response.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({});
          const interaction = await ai.interactions.create({
            model: 'gemini-3.8-flash',
            input: [
              {type: 'text', text: 'What is in this picture?'},
              {type: 'image', data: 'BASE64_ENCODED_IMAGE', mime_type: 'image/png'},
            ],
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.Content;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.ImageContent;
          import com.google.genai.gaos.models.interactions.ImageContentMimeType;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.TextContent;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import java.util.List;

          Client client = new Client();
          List<Content> content =
              List.of(
                  TextContent.builder().text("What is in this picture?").build(),
                  ImageContent.builder()
                      .data("BASE64_ENCODED_IMAGE")
                      .mimeType(ImageContentMimeType.IMAGE_PNG)
                      .build());
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-3.8-flash")
                  .input(InteractionsInput.ofContent(content))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "Go"

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

              contents := []gaos_interactions.Content{
                  gaos_interactions.NewContent(gaos_interactions.TextContent{
                      Text: "What is in this picture?",
                  }),
                  gaos_interactions.NewContent(gaos_interactions.ImageContent{
                      Data:     genai.Ptr("BASE64_ENCODED_IMAGE"),
                      MimeType: gaos_interactions.ImageContentMimeTypeImagePng.ToPointer(),
                  }),
              }

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-3.8-flash"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput(contents)),
              })

              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{Body: body})
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```

=== "函式呼叫"


    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-3.8-flash",
              "tools": [
                {
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
                    "required": [
                      "location"
                    ]
                  }
                }
              ],
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
              input="What is the weather like in Boston, MA?",
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
            input: 'What is the weather like in Boston, MA?',
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
                  .input(InteractionsInput.of("What is the weather like in Boston, MA?"))
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

    === "Go"

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

              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{Body: body})
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

=== "Deep Research"


    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "agent": "deep-research-preview-04-2026",
              "input": "Find a cure to cancer",
              "background": true
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          interaction = client.interactions.create(
              agent="deep-research-preview-04-2026",
              input="find a cure to cancer",
              background=True,
          )
          print(interaction.status)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({});
          const interaction = await ai.interactions.create({
            agent: 'deep-research-preview-04-2026',
            input: 'find a cure to cancer',
            background: true,
          });
          console.log(interaction.status);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.AgentOption;
          import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionStatus;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;

          Client client = new Client();
          CreateAgentInteraction params =
              CreateAgentInteraction.builder()
                  .agent(AgentOption.of("deep-research-preview-04-2026"))
                  .input(InteractionsInput.of("find a cure to cancer"))
                  .background(true)
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
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
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, nil)
              if err != nil {
                  log.Fatal(err)
              }

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateAgentInteraction{
                  Agent:      gaos_interactions.AgentOption("deep-research-preview-04-2026"),
                  Input:      genai.Ptr(gaos_interactions.NewInteractionsInput("find a cure to cancer")),
                  Background: genai.Ptr(true),
              })

              req := operations.CreateInteractionRequest{
                  Body: body,
              }

              res, err := client.Interactions.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil {
                  fmt.Println(res.Interaction.Status)
              }
          }
          ```

=== "Antigravity Agent"


    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "agent": "antigravity-preview-09-2026",
              "input": "Read Hacker News, summarize the top 5 stories, and save results as a markdown file.",
              "environment": "remote"
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})
          interaction = client.interactions.create(
              agent="antigravity-preview-09-2026",
              input=(
                  "Read Hacker News, summarize the top 5 stories, and save results as"
                  " a markdown file."
              ),
              environment="remote",
          )
          print(interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});
          const interaction = await ai.interactions.create({
            agent: 'antigravity-preview-09-2026',
            input:
              'Read Hacker News, summarize the top 5 stories, and save results as a markdown file.',
            environment: 'remote',
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.AgentOption;
          import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
          import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import com.google.genai.types.HttpOptions;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
          CreateAgentInteraction params =
              CreateAgentInteraction.builder()
                  .agent(AgentOption.of("antigravity-preview-09-2026"))
                  .input(
                      InteractionsInput.of(
                          "Read Hacker News, summarize the top 5 stories, and save results as a markdown"
                              + " file."))
                  .environment(CreateAgentInteractionEnvironment.of("remote"))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "Go"

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
              client, err := genai.NewClient(ctx, &genai.ClientConfig{
                  HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
              })
              if err != nil {
                  log.Fatal(err)
              }

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateAgentInteraction{
                  Agent:       gaos_interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       genai.Ptr(gaos_interactions.NewInteractionsInput("Read Hacker News, summarize the top 5 stories, and save results as a markdown file.")),
                  Environment: genai.Ptr(gaos_interactions.NewCreateAgentInteractionEnvironment("remote")),
              })

              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{Body: body})
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```

=== "重複使用環境"


    === "REST"

          ```sh
          # Step 1: Create an interaction with a fresh remote environment.
          RESPONSE=$(curl -s -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "agent": "antigravity-preview-09-2026",
              "input": "Write a hello world script at /workspace/hello.py.",
              "environment": "remote"
            }')
          INTERACTION_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
          ENV_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['environment_id'])")

          # Step 2: Reuse the same environment in a follow-up interaction.
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d "{
              \"agent\": \"antigravity-preview-09-2026\",
              \"input\": \"Modify the script to accept a name argument and greet the user.\",
              \"environment\": \"$ENV_ID\",
              \"previous_interaction_id\": \"$INTERACTION_ID\"
            }"
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})

          # Step 1: Create an interaction with a fresh remote environment.
          interaction = client.interactions.create(
              agent="antigravity-preview-09-2026",
              input="Write a hello world script at /workspace/hello.py.",
              environment="remote",
          )
          print(f"Environment ID: {interaction.environment_id}")

          # Step 2: Reuse the same environment in a follow-up interaction.
          interaction_2 = client.interactions.create(
              agent="antigravity-preview-09-2026",
              input="Modify the script to accept a name argument and greet the user.",
              environment=interaction.environment_id,
              previous_interaction_id=interaction.id,
          )
          print(interaction_2.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});

          // Step 1: Create an interaction with a fresh remote environment.
          const interaction = await ai.interactions.create({
            agent: 'antigravity-preview-09-2026',
            input: 'Write a hello world script at /workspace/hello.py.',
            environment: 'remote',
          });
          console.log(`Environment ID: ${interaction.environment_id}`);

          // Step 2: Reuse the same environment in a follow-up interaction.
          const interaction2 = await ai.interactions.create({
            agent: 'antigravity-preview-09-2026',
            input: 'Modify the script to accept a name argument and greet the user.',
            environment: interaction.environment_id,
            previous_interaction_id: interaction.id,
          });
          console.log(interaction2.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.environments.Environment;
          import com.google.genai.gaos.models.interactions.AgentOption;
          import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
          import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.Step;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import com.google.genai.types.HttpOptions;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

          // Step 1: Create an interaction with a fresh remote environment.
          CreateAgentInteraction params1 =
              CreateAgentInteraction.builder()
                  .agent(AgentOption.of("antigravity-preview-09-2026"))
                  .input(InteractionsInput.of("Write a hello world script at /workspace/hello.py."))
                  .environment(CreateAgentInteractionEnvironment.of("remote"))
                  .build();
          CreateInteractionResponse response1 =
              client.interactions.create(CreateInteractionRequestBody.of(params1));
          Interaction interaction1 =
              response1.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println("Environment ID: " + interaction1.environmentId().orElse(""));

          // Step 2: Reuse the same environment in a follow-up interaction.
          CreateAgentInteraction params2 =
              CreateAgentInteraction.builder()
                  .agent(AgentOption.of("antigravity-preview-09-2026"))
                  .input(
                      InteractionsInput.of(
                          "Modify the script to accept a name argument and greet the user."))
                  .environment(
                      CreateAgentInteractionEnvironment.of(interaction1.environmentId().orElse("")))
                  .previousInteractionId(interaction1.id().orElse(null))
                  .build();
          CreateInteractionResponse response2 =
              client.interactions.create(CreateInteractionRequestBody.of(params2));
          Interaction interaction2 =
              response2.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction2.outputText().orElse(""));
          ```

    === "Go"

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
              client, err := genai.NewClient(ctx, &genai.ClientConfig{
                  HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
              })
              if err != nil {
                  log.Fatal(err)
              }

              // Step 1: Create an interaction with a fresh remote environment.
              body1 := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateAgentInteraction{
                  Agent:       gaos_interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       genai.Ptr(gaos_interactions.NewInteractionsInput("Write a hello world script at /workspace/hello.py.")),
                  Environment: genai.Ptr(gaos_interactions.NewCreateAgentInteractionEnvironment("remote")),
              })

              res1, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{Body: body1})
              if err != nil {
                  log.Fatal(err)
              }

              if res1.Interaction == nil || res1.Interaction.EnvironmentID == nil {
                  log.Fatal("No environment ID returned")
              }
              fmt.Printf("Environment ID: %s\n", *res1.Interaction.EnvironmentID)

              // Step 2: Reuse the same environment in a follow-up interaction.
              body2 := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateAgentInteraction{
                  Agent:                 gaos_interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:                 genai.Ptr(gaos_interactions.NewInteractionsInput("Modify the script to accept a name argument and greet the user.")),
                  Environment:           genai.Ptr(gaos_interactions.NewCreateAgentInteractionEnvironment(*res1.Interaction.EnvironmentID)),
                  PreviousInteractionID: res1.Interaction.ID,
              })

              res2, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{Body: body2})
              if err != nil {
                  log.Fatal(err)
              }

              if res2.Interaction != nil && res2.Interaction.OutputText != nil {
                  fmt.Println(*res2.Interaction.OutputText)
              }
          }
          ```

=== "含有來源"


    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "agent": "antigravity-preview-09-2026",
              "input": "List all files under /workspace and summarize what you find.",
              "environment": {
                "type": "remote",
                "sources": [
                  {
                    "type": "repository",
                    "source": "https://github.com/octocat/Spoon-Knife",
                    "target": "/workspace/repo"
                  },
                  {
                    "type": "inline",
                    "content": "Focus on Python files only.",
                    "target": "/workspace/notes.txt"
                  }
                ]
              }
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})
          interaction = client.interactions.create(
              agent="antigravity-preview-09-2026",
              input="List all files under /workspace and summarize what you find.",
              environment={
                  "type": "remote",
                  "sources": [
                      {
                          "type": "repository",
                          "source": "https://github.com/octocat/Spoon-Knife",
                          "target": "/workspace/repo",
                      },
                      {
                          "type": "inline",
                          "content": "Focus on Python files only.",
                          "target": "/workspace/notes.txt",
                      },
                  ],
              },
          )
          print(interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});
          const interaction = await ai.interactions.create({
            agent: 'antigravity-preview-09-2026',
            input: 'List all files under /workspace and summarize what you find.',
            environment: {
              type: 'remote',
              sources: [
                {
                  type: 'repository',
                  source: 'https://github.com/octocat/Spoon-Knife',
                  target: '/workspace/repo',
                },
                {
                  type: 'inline',
                  content: 'Focus on Python files only.',
                  target: '/workspace/notes.txt',
                },
              ],
            },
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.environments.Environment;
          import com.google.genai.gaos.models.interactions.AgentOption;
          import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
          import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.Source;
          import com.google.genai.gaos.models.interactions.SourceType;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import com.google.genai.types.HttpOptions;
          import java.util.List;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
          com.google.genai.gaos.models.interactions.Environment env =
              com.google.genai.gaos.models.interactions.Environment.builder()
                  .sources(
                      List.of(
                          Source.builder()
                              .type(SourceType.REPOSITORY)
                              .source("https://github.com/octocat/Spoon-Knife")
                              .target("/workspace/repo")
                              .build(),
                          Source.builder()
                              .type(SourceType.INLINE)
                              .content("Focus on Python files only.")
                              .target("/workspace/notes.txt")
                              .build()))
                  .build();
          CreateAgentInteraction params =
              CreateAgentInteraction.builder()
                  .agent(AgentOption.of("antigravity-preview-09-2026"))
                  .input(
                      InteractionsInput.of(
                          "List all files under /workspace and summarize what you find."))
                  .environment(CreateAgentInteractionEnvironment.of(env))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "Go"

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
              client, err := genai.NewClient(ctx, &genai.ClientConfig{
                  HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
              })
              if err != nil {
                  log.Fatal(err)
              }

              env := gaos_interactions.Environment{
                  Sources: []gaos_interactions.Source{
                      {
                          Type:   genai.Ptr(gaos_interactions.SourceTypeRepository),
                          Source: genai.Ptr("https://github.com/octocat/Spoon-Knife"),
                          Target: genai.Ptr("/workspace/repo"),
                      },
                      {
                          Type:    genai.Ptr(gaos_interactions.SourceTypeInline),
                          Content: genai.Ptr("Focus on Python files only."),
                          Target:  genai.Ptr("/workspace/notes.txt"),
                      },
                  },
              }

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateAgentInteraction{
                  Agent:       gaos_interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       genai.Ptr(gaos_interactions.NewInteractionsInput("List all files under /workspace and summarize what you find.")),
                  Environment: genai.Ptr(gaos_interactions.NewCreateAgentInteractionEnvironment(env)),
              })

              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{Body: body})
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```

=== "自訂代理"


    === "REST"

          ```sh
          # Step 1: Create a custom agent.
          curl -X POST https://generativelanguage.googleapis.com/v1beta/agents \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "id": "code-reviewer",
              "base_agent": "antigravity-preview-09-2026",
              "system_instruction": "You are a senior code reviewer. Check every file for bugs, style issues, and security vulnerabilities.",
              "base_environment": {
                "type": "remote",
                "sources": [{
                  "type": "repository",
                  "source": "https://github.com/octocat/Spoon-Knife",
                  "target": "/workspace/repo"
                }]
              }
            }'

          # Step 2: Use the custom agent.
          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "agent": "code-reviewer",
              "input": "Review the latest changes in /workspace/repo/src and file a summary.",
              "environment": "remote"
            }'
          ```

    === "Python"

          ```python
          import uuid
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})

          # Step 1: Create a custom agent.
          agent_id = f"code-reviewer-{uuid.uuid4().hex[:8]}"
          client.agents.create(
              id=agent_id,
              base_agent="antigravity-preview-09-2026",
              system_instruction=(
                  "You are a senior code reviewer. Check every file for bugs, style"
                  " issues, and security vulnerabilities."
              ),
              base_environment={
                  "type": "remote",
                  "sources": [{
                      "type": "repository",
                      "source": "https://github.com/octocat/Spoon-Knife",
                      "target": "/workspace/repo",
                  }],
              },
          )

          # Step 2: Use the custom agent.
          result = client.interactions.create(
              agent=agent_id,
              input=(
                  "Review the latest changes in /workspace/repo/src and file a"
                  " summary."
              ),
              environment="remote",
          )
          print(result.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});

          // Step 1: Create a custom agent.
          const agentId = `code-reviewer-${crypto.randomUUID().slice(0, 8)}`;
          await ai.agents.create({
            id: agentId,
            base_agent: 'antigravity-preview-09-2026',
            system_instruction:
              'You are a senior code reviewer. Check every file for bugs, style issues, and security vulnerabilities.',
            base_environment: {
              type: 'remote',
              sources: [
                {
                  type: 'repository',
                  source: 'https://github.com/octocat/Spoon-Knife',
                  target: '/workspace/repo',
                },
              ],
            },
          });

          // Step 2: Use the custom agent.
          const result = await ai.interactions.create({
            agent: agentId,
            input:
              'Review the latest changes in /workspace/repo/src and file a summary.',
            environment: 'remote',
          });
          console.log(result.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.agents.Agent;
          import com.google.genai.gaos.models.agents.BaseEnvironment;
          import com.google.genai.gaos.models.environments.Environment;
          import com.google.genai.gaos.models.interactions.AgentOption;
          import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
          import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.Source;
          import com.google.genai.gaos.models.interactions.SourceType;
          import com.google.genai.gaos.models.interactions.Step;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import com.google.genai.types.HttpOptions;
          import java.util.List;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

          // Step 1: Create a custom agent.
          String agentId = "code-reviewer-" + UUID.randomUUID().toString().substring(0, 8);
          com.google.genai.gaos.models.interactions.Environment baseEnv =
              com.google.genai.gaos.models.interactions.Environment.builder()
                  .sources(
                      List.of(
                          Source.builder()
                              .type(SourceType.REPOSITORY)
                              .source("https://github.com/octocat/Spoon-Knife")
                              .target("/workspace/repo")
                              .build()))
                  .build();
          Agent customAgent =
              Agent.builder()
                  .id(agentId)
                  .baseAgent("antigravity-preview-09-2026")
                  .systemInstruction(
                      "You are a senior code reviewer. Check every file for bugs, style issues, and"
                          + " security vulnerabilities.")
                  .baseEnvironment(BaseEnvironment.of(baseEnv))
                  .build();
          client.agents.create(customAgent);

          // Step 2: Use the custom agent.
          CreateAgentInteraction params =
              CreateAgentInteraction.builder()
                  .agent(AgentOption.of(agentId))
                  .input(
                      InteractionsInput.of(
                          "Review the latest changes in /workspace/repo/src and file a summary."))
                  .environment(CreateAgentInteractionEnvironment.of("remote"))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "Go"

          ```go
          package main

          import (
              "context"
              "fmt"
              "log"
              "time"
              "google.golang.org/genai"
              gaos_agents "google.golang.org/genai/interactions/models/agents"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
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

              // Step 1: Create a custom agent.
              agentID := fmt.Sprintf("code-reviewer-%d", time.Now().UnixNano())
              baseEnv := gaos_interactions.Environment{
                  Sources: []gaos_interactions.Source{
                      {
                          Type:   genai.Ptr(gaos_interactions.SourceTypeRepository),
                          Source: genai.Ptr("https://github.com/octocat/Spoon-Knife"),
                          Target: genai.Ptr("/workspace/repo"),
                      },
                  },
              }

              _, err = client.Agents.Create(ctx, operations.CreateAgentRequest{
                  Body: gaos_agents.Agent{
                      ID:                genai.Ptr(agentID),
                      BaseAgent:         genai.Ptr("antigravity-preview-09-2026"),
                      SystemInstruction: genai.Ptr("You are a senior code reviewer. Check every file for bugs, style issues, and security vulnerabilities."),
                      BaseEnvironment:   genai.Ptr(gaos_agents.NewBaseEnvironment(baseEnv)),
                  },
              })
              if err != nil {
                  log.Fatal(err)
              }

              // Step 2: Use the custom agent.
              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateAgentInteraction{
                  Agent:       gaos_interactions.AgentOption(agentID),
                  Input:       genai.Ptr(gaos_interactions.NewInteractionsInput("Review the latest changes in /workspace/repo/src and file a summary.")),
                  Environment: genai.Ptr(gaos_interactions.NewCreateAgentInteractionEnvironment("remote")),
              })

              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{Body: body})
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```

=== "文件"


    === "REST"

          ```sh
          # Write the request to a file: inline base64 data can exceed the shell's
          # argument size limit.
          cat > request.json <<EOF
          {
            "model": "gemini-4-hydrogen",
            "input": [
              {"type": "text", "text": "Summarize this document."},
              {
                "type": "document",
                "mime_type": "application/pdf",
                "data": "$(base64 -w0 report.pdf)"
              }
            ]
          }
          EOF

          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d @request.json
          ```

    === "Python"

          ```python
          import pathlib
          from google import genai


          client = genai.Client()
          interaction = client.interactions.create(
              model="gemini-4-hydrogen",
              input=[
                  {"type": "text", "text": "Summarize this document."},
                  {
                      "type": "document",
                      "data": pathlib.Path("report.pdf"),
                      "mime_type": "application/pdf",
                  },
              ],
          )
          print(interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';
          import * as fs from 'fs';

          const ai = new GoogleGenAI({});
          const interaction = await ai.interactions.create({
            model: 'gemini-4-hydrogen',
            input: [
              {type: 'text', text: 'Summarize this document.'},
              {
                type: 'document',
                data: fs.readFileSync('report.pdf', 'base64'),
                mime_type: 'application/pdf',
              },
            ],
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.Content;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.DocumentContent;
          import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.TextContent;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import java.nio.file.Files;
          import java.nio.file.Path;
          import java.util.Base64;
          import java.util.List;

          Client client = new Client();
          Path path = Path.of("report.pdf");


          String data = Base64.getEncoder().encodeToString(Files.readAllBytes(path));
          List<Content> content =
              List.of(
                  TextContent.builder().text("Summarize this document.").build(),
                  DocumentContent.builder()
                      .data(data)
                      .mimeType(DocumentContentMimeType.APPLICATION_PDF)
                      .build());
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-4-hydrogen")
                  .input(InteractionsInput.ofContent(content))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "Go"

          ```go
          package main

          import (
              "context"
              "encoding/base64"
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


              data, err := os.ReadFile("report.pdf")
              if err != nil {
                  log.Fatal(err)
              }

              contents := []gaos_interactions.Content{
                  gaos_interactions.NewContent(gaos_interactions.TextContent{
                      Text: "Summarize this document.",
                  }),
                  gaos_interactions.NewContent(gaos_interactions.DocumentContent{
                      Data:     genai.Ptr(base64.StdEncoding.EncodeToString(data)),
                      MimeType: gaos_interactions.DocumentContentMimeTypeApplicationPdf.ToPointer(),
                  }),
              }

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-4-hydrogen"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput(contents)),
              })

              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{Body: body})
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```

=== "文件頁面範圍"


    === "REST"

          ```sh
          # Only send pages 2 through 3 (1-indexed, inclusive).
          cat > request.json <<EOF
          {
            "model": "gemini-4-hydrogen",
            "input": [
              {"type": "text", "text": "Summarize these pages."},
              {
                "type": "document",
                "mime_type": "application/pdf",
                "data": "$(base64 -w0 report.pdf)",
                "processing": {
                  "type": "static",
                  "page_options": {"start_page": 2, "end_page": 3}
                }
              }
            ]
          }
          EOF

          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d @request.json
          ```

    === "Python"

          ```python
          import pathlib
          from google import genai


          client = genai.Client(http_options={"api_version": "v1beta"})
          interaction = client.interactions.create(
              model="gemini-4-hydrogen",
              input=[
                  {"type": "text", "text": "Summarize these pages."},
                  {
                      "type": "document",
                      "data": pathlib.Path("report.pdf"),
                      "mime_type": "application/pdf",
                      # Only send pages 2 through 3 (1-indexed, inclusive).
                      "processing": {
                          "type": "static",
                          "page_options": {"start_page": 2, "end_page": 3},
                      },
                  },
              ],
          )
          print(interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';
          import * as fs from 'fs';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});
          const interaction = await ai.interactions.create({
            model: 'gemini-4-hydrogen',
            input: [
              {type: 'text', text: 'Summarize these pages.'},
              {
                type: 'document',
                data: fs.readFileSync('report.pdf', 'base64'),
                mime_type: 'application/pdf',
                // Only send pages 2 through 3 (1-indexed, inclusive).
                processing: {
                  type: 'static',
                  page_options: {start_page: 2, end_page: 3},
                },
              },
            ],
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.Content;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.DocumentContent;
          import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
          import com.google.genai.gaos.models.interactions.DocumentMediaProcessing;
          import com.google.genai.gaos.models.interactions.DocumentProcessing;
          import com.google.genai.gaos.models.interactions.DocumentStaticMediaProcessing;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.PageProcessingOptions;
          import com.google.genai.gaos.models.interactions.TextContent;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import com.google.genai.types.HttpOptions;
          import java.nio.file.Files;
          import java.nio.file.Path;
          import java.util.Base64;
          import java.util.List;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
          Path path = Path.of("report.pdf");


          String data = Base64.getEncoder().encodeToString(Files.readAllBytes(path));
          List<Content> content =
              List.of(
                  TextContent.builder().text("Summarize these pages.").build(),
                  DocumentContent.builder()
                      .data(data)
                      .mimeType(DocumentContentMimeType.APPLICATION_PDF)
                      // Only send pages 2 through 3 (1-indexed, inclusive).
                      .processing(
                          DocumentProcessing.of(
                              DocumentMediaProcessing.of(
                                  DocumentStaticMediaProcessing.builder()
                                      .pageOptions(
                                          PageProcessingOptions.builder().startPage(2).endPage(3).build())
                                      .build())))
                      .build());
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-4-hydrogen")
                  .input(InteractionsInput.ofContent(content))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "Go"

          ```go
          package main

          import (
              "context"
              "encoding/base64"
              "fmt"
              "log"
              "os"
              "google.golang.org/genai"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
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


              data, err := os.ReadFile("report.pdf")
              if err != nil {
                  log.Fatal(err)
              }

              contents := []gaos_interactions.Content{
                  gaos_interactions.NewContent(gaos_interactions.TextContent{
                      Text: "Summarize these pages.",
                  }),
                  gaos_interactions.NewContent(gaos_interactions.DocumentContent{
                      Data:     genai.Ptr(base64.StdEncoding.EncodeToString(data)),
                      MimeType: gaos_interactions.DocumentContentMimeTypeApplicationPdf.ToPointer(),
                      // Only send pages 2 through 3 (1-indexed, inclusive).
                      Processing: genai.Ptr(gaos_interactions.NewDocumentProcessing(
                          gaos_interactions.NewDocumentMediaProcessing(gaos_interactions.DocumentStaticMediaProcessing{
                              PageOptions: &gaos_interactions.PageProcessingOptions{
                                  StartPage: genai.Ptr(2),
                                  EndPage:   genai.Ptr(3),
                              },
                          }),
                      )),
                  }),
              }

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-4-hydrogen"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput(contents)),
              })

              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{Body: body})
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```

=== "僅文件文字"


    === "REST"

          ```sh
          # Send the extracted page text, without page images.
          cat > request.json <<EOF
          {
            "model": "gemini-4-hydrogen",
            "input": [
              {"type": "text", "text": "List the section headings."},
              {
                "type": "document",
                "mime_type": "application/pdf",
                "data": "$(base64 -w0 report.pdf)",
                "processing": {
                  "type": "static",
                  "page_options": {"content_layers": ["page_text"]}
                }
              }
            ]
          }
          EOF

          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d @request.json
          ```

    === "Python"

          ```python
          import pathlib
          from google import genai


          client = genai.Client(http_options={"api_version": "v1beta"})
          interaction = client.interactions.create(
              model="gemini-4-hydrogen",
              input=[
                  {"type": "text", "text": "List the section headings."},
                  {
                      "type": "document",
                      "data": pathlib.Path("report.pdf"),
                      "mime_type": "application/pdf",
                      # Send the extracted page text, without page images.
                      "processing": {
                          "type": "static",
                          "page_options": {"content_layers": ["page_text"]},
                      },
                  },
              ],
          )
          print(interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';
          import * as fs from 'fs';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});
          const interaction = await ai.interactions.create({
            model: 'gemini-4-hydrogen',
            input: [
              {type: 'text', text: 'List the section headings.'},
              {
                type: 'document',
                data: fs.readFileSync('report.pdf', 'base64'),
                mime_type: 'application/pdf',
                // Send the extracted page text, without page images.
                processing: {
                  type: 'static',
                  page_options: {content_layers: ['page_text']},
                },
              },
            ],
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.Content;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.DocumentContent;
          import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
          import com.google.genai.gaos.models.interactions.DocumentMediaProcessing;
          import com.google.genai.gaos.models.interactions.DocumentProcessing;
          import com.google.genai.gaos.models.interactions.DocumentStaticMediaProcessing;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.PageProcessingOptions;
          import com.google.genai.gaos.models.interactions.PageProcessingOptionsContentLayer;
          import com.google.genai.gaos.models.interactions.TextContent;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import com.google.genai.types.HttpOptions;
          import java.nio.file.Files;
          import java.nio.file.Path;
          import java.util.Base64;
          import java.util.List;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
          Path path = Path.of("report.pdf");


          String data = Base64.getEncoder().encodeToString(Files.readAllBytes(path));
          List<Content> content =
              List.of(
                  TextContent.builder().text("List the section headings.").build(),
                  DocumentContent.builder()
                      .data(data)
                      .mimeType(DocumentContentMimeType.APPLICATION_PDF)
                      // Send the extracted page text, without page images.
                      .processing(
                          DocumentProcessing.of(
                              DocumentMediaProcessing.of(
                                  DocumentStaticMediaProcessing.builder()
                                      .pageOptions(
                                          PageProcessingOptions.builder()
                                              .contentLayers(
                                                  List.of(PageProcessingOptionsContentLayer.PAGE_TEXT))
                                              .build())
                                      .build())))
                      .build());
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-4-hydrogen")
                  .input(InteractionsInput.ofContent(content))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "Go"

          ```go
          package main

          import (
              "context"
              "encoding/base64"
              "fmt"
              "log"
              "os"
              "google.golang.org/genai"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
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


              data, err := os.ReadFile("report.pdf")
              if err != nil {
                  log.Fatal(err)
              }

              contents := []gaos_interactions.Content{
                  gaos_interactions.NewContent(gaos_interactions.TextContent{
                      Text: "List the section headings.",
                  }),
                  gaos_interactions.NewContent(gaos_interactions.DocumentContent{
                      Data:     genai.Ptr(base64.StdEncoding.EncodeToString(data)),
                      MimeType: gaos_interactions.DocumentContentMimeTypeApplicationPdf.ToPointer(),
                      // Send the extracted page text, without page images.
                      Processing: genai.Ptr(gaos_interactions.NewDocumentProcessing(
                          gaos_interactions.NewDocumentMediaProcessing(gaos_interactions.DocumentStaticMediaProcessing{
                              PageOptions: &gaos_interactions.PageProcessingOptions{
                                  ContentLayers: []gaos_interactions.PageProcessingOptionsContentLayer{
                                      gaos_interactions.PageProcessingOptionsContentLayerPageText,
                                  },
                              },
                          }),
                      )),
                  }),
              }

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-4-hydrogen"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput(contents)),
              })

              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{Body: body})
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```

=== "文件解析度"


    === "REST"

          ```sh
          # Skim the page images at low resolution.
          cat > request.json <<EOF
          {
            "model": "gemini-4-hydrogen",
            "input": [
              {"type": "text", "text": "Which pages contain tables?"},
              {
                "type": "document",
                "mime_type": "application/pdf",
                "data": "$(base64 -w0 report.pdf)",
                "resolution": "low",
                "processing": {
                  "type": "static",
                  "page_options": {"content_layers": ["page_image"]}
                }
              }
            ]
          }
          EOF

          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d @request.json
          ```

    === "Python"

          ```python
          import pathlib
          from google import genai


          client = genai.Client(http_options={"api_version": "v1beta"})
          interaction = client.interactions.create(
              model="gemini-4-hydrogen",
              input=[
                  {"type": "text", "text": "Which pages contain tables?"},
                  {
                      "type": "document",
                      "data": pathlib.Path("report.pdf"),
                      "mime_type": "application/pdf",
                      # Skim the page images at low resolution.
                      "resolution": "low",
                      "processing": {
                          "type": "static",
                          "page_options": {"content_layers": ["page_image"]},
                      },
                  },
              ],
          )
          print(interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';
          import * as fs from 'fs';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});
          const interaction = await ai.interactions.create({
            model: 'gemini-4-hydrogen',
            input: [
              {type: 'text', text: 'Which pages contain tables?'},
              {
                type: 'document',
                data: fs.readFileSync('report.pdf', 'base64'),
                mime_type: 'application/pdf',
                // Skim the page images at low resolution.
                resolution: 'low',
                processing: {
                  type: 'static',
                  page_options: {content_layers: ['page_image']},
                },
              },
            ],
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.Content;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.DocumentContent;
          import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
          import com.google.genai.gaos.models.interactions.DocumentMediaProcessing;
          import com.google.genai.gaos.models.interactions.DocumentProcessing;
          import com.google.genai.gaos.models.interactions.DocumentStaticMediaProcessing;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.MediaResolution;
          import com.google.genai.gaos.models.interactions.PageProcessingOptions;
          import com.google.genai.gaos.models.interactions.PageProcessingOptionsContentLayer;
          import com.google.genai.gaos.models.interactions.TextContent;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import com.google.genai.types.HttpOptions;
          import java.nio.file.Files;
          import java.nio.file.Path;
          import java.util.Base64;
          import java.util.List;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
          Path path = Path.of("report.pdf");


          String data = Base64.getEncoder().encodeToString(Files.readAllBytes(path));
          List<Content> content =
              List.of(
                  TextContent.builder().text("Which pages contain tables?").build(),
                  DocumentContent.builder()
                      .data(data)
                      .mimeType(DocumentContentMimeType.APPLICATION_PDF)
                      // Skim the page images at low resolution.
                      .resolution(MediaResolution.LOW)
                      .processing(
                          DocumentProcessing.of(
                              DocumentMediaProcessing.of(
                                  DocumentStaticMediaProcessing.builder()
                                      .pageOptions(
                                          PageProcessingOptions.builder()
                                              .contentLayers(
                                                  List.of(PageProcessingOptionsContentLayer.PAGE_IMAGE))
                                              .build())
                                      .build())))
                      .build());
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-4-hydrogen")
                  .input(InteractionsInput.ofContent(content))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "Go"

          ```go
          package main

          import (
              "context"
              "encoding/base64"
              "fmt"
              "log"
              "os"
              "google.golang.org/genai"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
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


              data, err := os.ReadFile("report.pdf")
              if err != nil {
                  log.Fatal(err)
              }

              contents := []gaos_interactions.Content{
                  gaos_interactions.NewContent(gaos_interactions.TextContent{
                      Text: "Which pages contain tables?",
                  }),
                  gaos_interactions.NewContent(gaos_interactions.DocumentContent{
                      Data:     genai.Ptr(base64.StdEncoding.EncodeToString(data)),
                      MimeType: gaos_interactions.DocumentContentMimeTypeApplicationPdf.ToPointer(),
                      // Skim the page images at low resolution.
                      Resolution: gaos_interactions.MediaResolutionLow.ToPointer(),
                      Processing: genai.Ptr(gaos_interactions.NewDocumentProcessing(
                          gaos_interactions.NewDocumentMediaProcessing(gaos_interactions.DocumentStaticMediaProcessing{
                              PageOptions: &gaos_interactions.PageProcessingOptions{
                                  ContentLayers: []gaos_interactions.PageProcessingOptionsContentLayer{
                                      gaos_interactions.PageProcessingOptionsContentLayerPageImage,
                                  },
                              },
                          }),
                      )),
                  }),
              }

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-4-hydrogen"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput(contents)),
              })

              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{Body: body})
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```

=== "Office 文件"


    === "REST"

          ```sh
          cat > request.json <<EOF
          {
            "model": "gemini-4-hydrogen",
            "input": [
              {"type": "text", "text": "Summarize the first page."},
              {
                "type": "document",
                "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "data": "$(base64 -w0 demo.docx)",
                "processing": {
                  "type": "static",
                  "page_options": {"start_page": 1, "end_page": 1}
                }
              }
            ]
          }
          EOF

          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d @request.json
          ```

    === "Python"

          ```python
          import pathlib
          from google import genai


          client = genai.Client(http_options={"api_version": "v1beta"})
          interaction = client.interactions.create(
              model="gemini-4-hydrogen",
              input=[
                  {"type": "text", "text": "Summarize the first page."},
                  {
                      "type": "document",
                      "data": pathlib.Path("demo.docx"),
                      "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      "processing": {
                          "type": "static",
                          "page_options": {"start_page": 1, "end_page": 1},
                      },
                  },
              ],
          )
          print(interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';
          import * as fs from 'fs';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});
          const interaction = await ai.interactions.create({
            model: 'gemini-4-hydrogen',
            input: [
              {type: 'text', text: 'Summarize the first page.'},
              {
                type: 'document',
                data: fs.readFileSync('demo.docx', 'base64'),
                mime_type:
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                processing: {
                  type: 'static',
                  page_options: {start_page: 1, end_page: 1},
                },
              },
            ],
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.Content;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.DocumentContent;
          import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
          import com.google.genai.gaos.models.interactions.DocumentMediaProcessing;
          import com.google.genai.gaos.models.interactions.DocumentProcessing;
          import com.google.genai.gaos.models.interactions.DocumentStaticMediaProcessing;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.PageProcessingOptions;
          import com.google.genai.gaos.models.interactions.TextContent;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import com.google.genai.types.HttpOptions;
          import java.nio.file.Files;
          import java.nio.file.Path;
          import java.util.Base64;
          import java.util.List;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
          Path path = Path.of("demo.docx");


          String data = Base64.getEncoder().encodeToString(Files.readAllBytes(path));
          List<Content> content =
              List.of(
                  TextContent.builder().text("Summarize the first page.").build(),
                  DocumentContent.builder()
                      .data(data)
                      .mimeType(
                          DocumentContentMimeType
                              .APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_WORDPROCESSINGML_DOCUMENT)
                      .processing(
                          DocumentProcessing.of(
                              DocumentMediaProcessing.of(
                                  DocumentStaticMediaProcessing.builder()
                                      .pageOptions(
                                          PageProcessingOptions.builder().startPage(1).endPage(1).build())
                                      .build())))
                      .build());
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-4-hydrogen")
                  .input(InteractionsInput.ofContent(content))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "Go"

          ```go
          package main

          import (
              "context"
              "encoding/base64"
              "fmt"
              "log"
              "os"
              "google.golang.org/genai"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
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


              data, err := os.ReadFile("demo.docx")
              if err != nil {
                  log.Fatal(err)
              }

              contents := []gaos_interactions.Content{
                  gaos_interactions.NewContent(gaos_interactions.TextContent{
                      Text: "Summarize the first page.",
                  }),
                  gaos_interactions.NewContent(gaos_interactions.DocumentContent{
                      Data:     genai.Ptr(base64.StdEncoding.EncodeToString(data)),
                      MimeType: gaos_interactions.DocumentContentMimeTypeApplicationVndOpenxmlformatsOfficedocumentWordprocessingmlDocument.ToPointer(),
                      Processing: genai.Ptr(gaos_interactions.NewDocumentProcessing(
                          gaos_interactions.NewDocumentMediaProcessing(gaos_interactions.DocumentStaticMediaProcessing{
                              PageOptions: &gaos_interactions.PageProcessingOptions{
                                  StartPage: genai.Ptr(1),
                                  EndPage:   genai.Ptr(1),
                              },
                          }),
                      )),
                  }),
              }

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-4-hydrogen"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput(contents)),
              })

              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{Body: body})
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```

=== "試算表文件"


    === "REST"

          ```sh
          cat > request.json <<EOF
          {
            "model": "gemini-4-hydrogen",
            "input": [
              {"type": "text", "text": "Which country has the highest sales?"},
              {
                "type": "document",
                "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "data": "$(base64 -w0 financials.xlsx)",
                "processing": {
                  "type": "static",
                  "spreadsheet_options": {
                    "sheet_index": 1,
                    "visible_cells": "A1:P50",
                    "content_layers": ["data", "formulas"]
                  }
                }
              }
            ]
          }
          EOF

          curl -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d @request.json
          ```

    === "Python"

          ```python
          import pathlib
          from google import genai


          client = genai.Client(http_options={"api_version": "v1beta"})
          interaction = client.interactions.create(
              model="gemini-4-hydrogen",
              input=[
                  {"type": "text", "text": "Which country has the highest sales?"},
                  {
                      "type": "document",
                      "data": pathlib.Path("financials.xlsx"),
                      "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                      "processing": {
                          "type": "static",
                          "spreadsheet_options": {
                              "sheet_index": 1,
                              "visible_cells": "A1:P50",
                              "content_layers": ["data", "formulas"],
                          },
                      },
                  },
              ],
          )
          print(interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';
          import * as fs from 'fs';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});
          const interaction = await ai.interactions.create({
            model: 'gemini-4-hydrogen',
            input: [
              {type: 'text', text: 'Which country has the highest sales?'},
              {
                type: 'document',
                data: fs.readFileSync('financials.xlsx', 'base64'),
                mime_type:
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                processing: {
                  type: 'static',
                  spreadsheet_options: {
                    sheet_index: 1,
                    visible_cells: 'A1:P50',
                    content_layers: ['data', 'formulas'],
                  },
                },
              },
            ],
          });
          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.Content;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.DocumentContent;
          import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
          import com.google.genai.gaos.models.interactions.DocumentMediaProcessing;
          import com.google.genai.gaos.models.interactions.DocumentProcessing;
          import com.google.genai.gaos.models.interactions.DocumentStaticMediaProcessing;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.SpreadsheetProcessingOptions;
          import com.google.genai.gaos.models.interactions.SpreadsheetProcessingOptionsContentLayer;
          import com.google.genai.gaos.models.interactions.TextContent;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import com.google.genai.types.HttpOptions;
          import java.nio.file.Files;
          import java.nio.file.Path;
          import java.util.Base64;
          import java.util.List;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
          Path path = Path.of("financials.xlsx");


          String data = Base64.getEncoder().encodeToString(Files.readAllBytes(path));
          List<Content> content =
              List.of(
                  TextContent.builder().text("Which country has the highest sales?").build(),
                  DocumentContent.builder()
                      .data(data)
                      .mimeType(
                          DocumentContentMimeType
                              .APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_SPREADSHEETML_SHEET)
                      .processing(
                          DocumentProcessing.of(
                              DocumentMediaProcessing.of(
                                  DocumentStaticMediaProcessing.builder()
                                      .spreadsheetOptions(
                                          SpreadsheetProcessingOptions.builder()
                                              .sheetIndex(1)
                                              .visibleCells("A1:P50")
                                              .contentLayers(
                                                  List.of(
                                                      SpreadsheetProcessingOptionsContentLayer.DATA,
                                                      SpreadsheetProcessingOptionsContentLayer.FORMULAS))
                                              .build())
                                      .build())))
                      .build());
          CreateModelInteraction params =
              CreateModelInteraction.builder()
                  .model("gemini-4-hydrogen")
                  .input(InteractionsInput.ofContent(content))
                  .build();
          CreateInteractionResponse response =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              response.interaction().orElseThrow(() -> new RuntimeException("No interaction returned"));
          System.out.println(interaction.outputText().orElse(""));
          ```

    === "Go"

          ```go
          package main

          import (
              "context"
              "encoding/base64"
              "fmt"
              "log"
              "os"
              "google.golang.org/genai"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
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


              data, err := os.ReadFile("financials.xlsx")
              if err != nil {
                  log.Fatal(err)
              }

              contents := []gaos_interactions.Content{
                  gaos_interactions.NewContent(gaos_interactions.TextContent{
                      Text: "Which country has the highest sales?",
                  }),
                  gaos_interactions.NewContent(gaos_interactions.DocumentContent{
                      Data:     genai.Ptr(base64.StdEncoding.EncodeToString(data)),
                      MimeType: gaos_interactions.DocumentContentMimeTypeApplicationVndOpenxmlformatsOfficedocumentSpreadsheetmlSheet.ToPointer(),
                      Processing: genai.Ptr(gaos_interactions.NewDocumentProcessing(
                          gaos_interactions.NewDocumentMediaProcessing(gaos_interactions.DocumentStaticMediaProcessing{
                              SpreadsheetOptions: &gaos_interactions.SpreadsheetProcessingOptions{
                                  SheetIndex:   genai.Ptr(1),
                                  VisibleCells: genai.Ptr("A1:P50"),
                                  ContentLayers: []gaos_interactions.SpreadsheetProcessingOptionsContentLayer{
                                      gaos_interactions.SpreadsheetProcessingOptionsContentLayerData,
                                      gaos_interactions.SpreadsheetProcessingOptionsContentLayerFormulas,
                                  },
                              },
                          }),
                      )),
                  }),
              }

              body := operations.NewCreateInteractionRequestBody(gaos_interactions.CreateModelInteraction{
                  Model: gaos_interactions.Model("gemini-4-hydrogen"),
                  Input: genai.Ptr(gaos_interactions.NewInteractionsInput(contents)),
              })

              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{Body: body})
              if err != nil {
                  log.Fatal(err)
              }

              if res.Interaction != nil && res.Interaction.OutputText != nil {
                  fmt.Println(*res.Interaction.OutputText)
              }
          }
          ```


  


  


## 回應 {#response}

  傳回 [`Interaction`](/api-reference/interactions-api/create-interaction/#Resource:Interaction) 資源。

  串流時，改為傳回 [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) (`text/event-stream`) 串流，其中每個事件都以 [`InteractionSseEvent`](/api-reference/interactions-api/create-interaction/#Resource:InteractionSseEvent) 作為其 `data`。

  

  
  **範例回應** 

  
=== "簡單請求"

      ```json
      {
        "created": "2025-11-26T12:25:15Z",
        "id": "v1_ChdPU0F4YWFtNkFwS2kxZThQZ05lbXdROBIXT1NBeGFhbTZBcEtpMWU4UGdOZW13UTg",
        "model": "gemini-3.8-flash",
        "object": "interaction",
        "status": "completed",
        "steps": [
          {
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "Hello! I'm functioning perfectly and ready to assist you.\n\nHow are you doing today?"
              }
            ]
          }
        ],
        "updated": "2025-11-26T12:25:15Z",
        "usage": {
          "input_tokens_by_modality": [
            {
              "modality": "text",
              "tokens": 7
            }
          ],
          "total_cached_tokens": 0,
          "total_input_tokens": 7,
          "total_output_tokens": 20,
          "total_thought_tokens": 22,
          "total_tokens": 49,
          "total_tool_use_tokens": 0
        }
      }
      ```

=== "多輪對話"

      ```json
      {
        "created": "2025-11-26T12:22:47Z",
        "id": "v1_ChdPU0F4YWFtNkFwS2kxZThQZ05lbXdROBIXT1NBeGFhbTZBcEtpMWU4UGdOZW13UTg",
        "model": "gemini-3.8-flash",
        "object": "interaction",
        "status": "completed",
        "steps": [
          {
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "The capital of France is Paris."
              }
            ]
          }
        ],
        "updated": "2025-11-26T12:22:47Z",
        "usage": {
          "input_tokens_by_modality": [
            {
              "modality": "text",
              "tokens": 50
            }
          ],
          "total_cached_tokens": 0,
          "total_input_tokens": 50,
          "total_output_tokens": 10,
          "total_thought_tokens": 0,
          "total_tokens": 60,
          "total_tool_use_tokens": 0
        }
      }
      ```

=== "圖片輸入"

      ```json
      {
        "created": "2025-11-26T12:22:47Z",
        "id": "v1_ChdPU0F4YWFtNkFwS2kxZThQZ05lbXdROBIXT1NBeGFhbTZBcEtpMWU4UGdOZW13UTg",
        "model": "gemini-3.8-flash",
        "object": "interaction",
        "status": "completed",
        "steps": [
          {
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "A white humanoid robot with glowing blue eyes stands holding a red skateboard."
              }
            ]
          }
        ],
        "updated": "2025-11-26T12:22:47Z",
        "usage": {
          "input_tokens_by_modality": [
            {
              "modality": "text",
              "tokens": 10
            },
            {
              "modality": "image",
              "tokens": 258
            }
          ],
          "total_cached_tokens": 0,
          "total_input_tokens": 268,
          "total_output_tokens": 20,
          "total_thought_tokens": 0,
          "total_tokens": 288,
          "total_tool_use_tokens": 0
        }
      }
      ```

=== "函式呼叫"

      ```json
      {
        "created": "2025-11-26T12:22:47Z",
        "id": "v1_ChdPU0F4YWFtNkFwS2kxZThQZ05lbXdROBIXT1NBeGFhbTZBcEtpMWU4UGdOZW13UTg",
        "model": "gemini-3.8-flash",
        "object": "interaction",
        "status": "requires_action",
        "steps": [
          {
            "name": "get_weather",
            "type": "function_call",
            "arguments": {
              "location": "Boston, MA"
            },
            "id": "gth23981"
          }
        ],
        "updated": "2025-11-26T12:22:47Z",
        "usage": {
          "input_tokens_by_modality": [
            {
              "modality": "text",
              "tokens": 100
            }
          ],
          "total_cached_tokens": 0,
          "total_input_tokens": 100,
          "total_output_tokens": 25,
          "total_thought_tokens": 0,
          "total_tokens": 125,
          "total_tool_use_tokens": 50
        }
      }
      ```

=== "Deep Research"

      ```json
      {
        "agent": "deep-research-preview-04-2026",
        "created": "2025-11-26T12:22:47Z",
        "id": "v1_ChdPU0F4YWFtNkFwS2kxZThQZ05lbXdROBIXT1NBeGFhbTZBcEtpMWU4UGdOZW13UTg",
        "object": "interaction",
        "status": "completed",
        "steps": [
          {
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "Here is a comprehensive research report on the current state of cancer research..."
              }
            ]
          }
        ],
        "updated": "2025-11-26T12:22:47Z",
        "usage": {
          "input_tokens_by_modality": [
            {
              "modality": "text",
              "tokens": 20
            }
          ],
          "total_cached_tokens": 0,
          "total_input_tokens": 20,
          "total_output_tokens": 1000,
          "total_thought_tokens": 500,
          "total_tokens": 1520,
          "total_tool_use_tokens": 0
        }
      }
      ```

=== "Antigravity Agent"

      ```json
      {
        "agent": "antigravity-preview-09-2026",
        "created": "2025-11-26T12:22:47Z",
        "environment_id": "env_abc123",
        "id": "v1_ChdPU0F4YWFtNkFwS2kxZThQZ05lbXdROBIXT1NBeGFhbTZBcEtpMWU4UGdOZW13UTg",
        "object": "interaction",
        "status": "completed",
        "steps": [
          {
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "I've summarized the top 5 Hacker News stories and saved the results to /workspace/summary.md."
              }
            ]
          }
        ],
        "updated": "2025-11-26T12:22:47Z",
        "usage": {
          "input_tokens_by_modality": [
            {
              "modality": "text",
              "tokens": 50
            }
          ],
          "total_cached_tokens": 0,
          "total_input_tokens": 50,
          "total_output_tokens": 500,
          "total_thought_tokens": 200,
          "total_tokens": 750,
          "total_tool_use_tokens": 0
        }
      }
      ```

=== "重複使用環境"

      ```json
      {
        "agent": "antigravity-preview-09-2026",
        "created": "2025-11-26T12:23:00Z",
        "environment_id": "env_abc123",
        "id": "v1_Chd2ZTJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkwMTIzNDU2Nzg",
        "object": "interaction",
        "status": "completed",
        "steps": [
          {
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "I've updated /workspace/hello.py to accept a name argument and greet the user."
              }
            ]
          }
        ],
        "updated": "2025-11-26T12:23:00Z",
        "usage": {
          "input_tokens_by_modality": [
            {
              "modality": "text",
              "tokens": 80
            }
          ],
          "total_cached_tokens": 0,
          "total_input_tokens": 80,
          "total_output_tokens": 200,
          "total_thought_tokens": 100,
          "total_tokens": 380,
          "total_tool_use_tokens": 0
        }
      }
      ```


  




## 資源 {#resources}

### Interaction {#Resource:Interaction}

Interaction 資源。


  
  **屬性**：

  
  **id**：必填 `string`

  僅供輸出。互動完成的唯一識別碼。

  

---


  

??? note "**status**：必填 `string enum` 僅供輸出。互動的狀態。"

    可能的值：

    - `in_progress`：互動正在進行中。
    - `requires_action`：互動需要使用者採取動作／提供輸入。
    - `completed`：互動已完成。
    - `failed`：互動失敗。
    - `cancelled`：互動已取消。
    - `incomplete`：互動已完成，但包含不完整的結果（例如達到 max_tokens）。
    - `requires_continuation`：互動至少還需要一次請求才能完成。下一個請求應將 continuation_token 設為此請求傳回的權杖。



  

---


  **created**：必填 `string`

  僅供輸出。回應的建立時間，採 ISO 8601 格式（YYYY-MM-DDThh:mm:ssZ）。

  

---


  **updated**：必填 `string`

  僅供輸出。回應的最後更新時間，採 ISO 8601 格式（YYYY-MM-DDThh:mm:ssZ）。

  

---


  **steps**：必填 [`Step`](/api-reference/interactions-api/create-interaction/#Resource:Step) `array`

  僅供輸出。組成互動的步驟（包含於回應中時）。

  

---


  

??? note "**model**：`ModelOption` 用於產生互動的 `Model` 名稱。"

    可能的值：

    - `gemma-4-26b-a4b-it`：Gemma 4 26B A4B IT
    - `gemma-4-31b-it`：Gemma 4 31B IT
    - `gemini-flash-latest`：Gemini Flash 的最新版本
    - `gemini-flash-lite-latest`：Gemini Flash-Lite 的最新版本
    - `gemini-pro-latest`：Gemini Pro 的最新版本
    - `gemini-2.5-flash`：我們的第一個混合推理模型，支援 100 萬個權杖的上下文視窗，並具備思考預算。
    - `gemini-2.5-pro`：我們最先進的多用途模型，擅長程式設計與複雜推理任務。
    - `gemini-2.5-flash-lite`：我們最小、最具成本效益的模型，為大規模使用而打造。
    - `gemini-3.5-flash-lite`：Gemini 3.5 Flash-Lite——我們最快速、最具成本效益的 3.5 模型，適合高輸送量執行。
    - `gemini-2.5-flash-image`：我們的原生圖片生成模型，針對速度、彈性與上下文理解最佳化。文字輸入與輸出的計價與 2.5 Flash 相同。
    - `gemini-3-flash-preview`：我們為速度打造的最聰明模型，結合前沿智慧與卓越的搜尋及接地能力。
    - `gemini-3.1-pro-preview`：我們最新的 SOTA 推理模型，具備前所未有的深度與細膩度，以及強大的多模態理解與程式設計能力。
    - `gemini-3.1-pro-preview-customtools`：Gemini 3.1 Pro Preview，針對自訂工具使用最佳化
    - `gemini-3.1-flash-lite`：我們最具成本效益的模型，針對大量代理任務、翻譯與簡單資料處理最佳化。
    - `gemini-3.1-flash-lite-image`：Gemini 3.1 Flash Lite Image。
    - `gemini-3-pro-image`：Gemini 3 Pro Image
    - `nano-banana-pro-preview`：Gemini 3 Pro Image Preview
    - `gemini-3.1-flash-image`：Gemini 3.1 Flash Image。
    - `gemini-nano-banana-2.1`：Gemini Nano Banana 2.1。
    - `gemini-3.1-flash-tts-preview`：Gemini 3.1 Flash TTS：強大、低延遲的語音生成。享有自然的輸出、可引導的提示詞，以及全新的富表現力音訊標籤，精確掌控旁白。
    - `gemini-3.5-flash`：Gemini 3.5 Flash——我們較早的 Flash 模型，為日常、高輸送量工作負載的速度與基礎效能而打造。
    - `gemini-3.6-flash`：Gemini 3.6 Flash——我們前一代的 Flash 模型，在一般代理與日常任務中兼顧速度與多模態能力。
    - `gemini-3.7-flash`：Gemini 3.7 Flash——我們高速、高效率的 Flash 模型，為日常程式設計、代理工具使用與可靠的多步驟執行而打造。
    - `gemini-3.8-flash`：Gemini 3.8 Flash——我們最聰明的 Flash 模型，為長程軟體工程、自主代理與複雜的企業工作流程而設計。
    - `gemini-4-argon`：Gemini 4 Argon——我們全新的前沿模型，為以深度與精確度解決最困難的問題而打造，涵蓋真實世界的軟體工程與知識工作。
    - `gemini-4-carbon`：Gemini 4 Carbon——我們能力最強的推理模型，為持續的代理程式設計、多模態知識工作、科學發現與網路安全防禦而打造。
    - `gemini-4-hydrogen`：Gemini 4 Hydrogen——具備前沿級智慧的模型，為程式設計、代理工作流程與多模態知識工作的快速、可靠執行而打造。
    - `gemini-3.8-flash-tts`：Gemini 3.8 Flash TTS——旗艦 TTS 模型，支援 Voice Design 與雙講者劇本控制。可提示自訂聲音角色、逐行指導語音呈現，並加入聲音爆發效果。
    - `gemini-3.8-flash-lite-tts`：Gemini 3.8 Flash Lite TTS——高速且具成本效益，適合快速配音、媒體在地化與高輸送量語音代理。可直接取代 gemini-3.1-flash-tts-preview。
    - `gemini-3.5-transcribe`：Gemini 3.5 Transcribe——低延遲的語音轉文字模型，具備以語句為單位的語言偵測、講者分離、單字級時間戳記與自訂詞彙偏置。
    - `lyria-3-clip-preview`：我們的低延遲音樂生成模型，針對高傳真音訊片段與精確的節奏控制最佳化。
    - `lyria-3-pro-preview`：我們先進的完整歌曲生成模型，具備深厚的作曲理解力，針對精確的結構控制與多樣音樂風格間的複雜轉場最佳化。
    - `gemini-robotics-er-1.6-preview`：Gemini Robotics-ER 1.6 Preview
    - `gemini-robotics-er-2-preview`：Gemini Robotics Embodied Reasoning 2 Preview
    - `lyria-3.5`：我們的旗艦音樂生成模型，針對具複雜結構連貫性的完整長度歌曲最佳化。
    - `gemini-omni-1.2-flash`：Gemini Omni 1.2 Flash——我們最新的多模態模型，支援快速、對話式的影片生成、編輯與電影級控制。
    - `gemini-omni-1.1-flash`：Gemini Omni 1.1 Flash——我們的高效能多模態模型，專為快速、對話式的影片生成、編輯與電影級控制而設計。
    - `gemini-omni-flash-preview`：我們多模態模型的預覽版，支援對話式影片生成、編輯與電影級控制。



  

---


  

??? note "**generation_config**：`GenerationConfig` 僅供輸入。模型互動的設定參數。"

      **seed**：`integer`

      解碼時使用的種子，以確保可重現性。

      **stop_sequences**：`string array`

      會停止輸出互動的字元序列清單。



    ??? note "**tool_choice**：[`ToolChoiceConfig`](/api-reference/interactions-api/create-interaction/#Resource:ToolChoiceConfig) 或 `string enum` 工具選擇設定。"

          **可能的類型**： 



        ??? note "**[ToolChoiceConfig](/api-reference/interactions-api/create-interaction/#Resource:ToolChoiceConfig)**"

              包含允許工具的工具選擇設定。



            ??? note "**allowed_tools**：`AllowedTools` 允許的工具。"

                ??? note "**mode**：`string enum` 工具選擇的模式。"

                    可能的值：

                    - `auto`：自動工具選擇。
                    - `any`：任意工具選擇。
                    - `none`：不使用工具選擇。
                    - `validated`：經驗證的工具選擇。



                  **tools**：`string array`

                  允許工具的名稱。





        ??? note "**string enum**"

            可能的值：

            - `auto`：自動工具選擇。
            - `any`：任意工具選擇。
            - `none`：不使用工具選擇。
            - `validated`：經驗證的工具選擇。





    ??? note "**thinking_level**：`ThinkingLevel` 模型應產生的思考權杖層級。"

        可能的值：

        - `minimal`：幾乎不進行思考。
        - `low`：低思考層級。
        - `medium`：中思考層級。
        - `high`：高思考層級。
        - `xhigh`：超高思考層級，高於 `high`。





    ??? note "**thinking_summaries**：`ThinkingSummaries` 是否在回應中包含思考摘要。"

        可能的值：

        - `auto`：自動思考摘要。
        - `none`：不含思考摘要。



      **max_output_tokens**：`integer`

      回應中包含的權杖數量上限。



    ??? note "**video_config**：`VideoConfig` 影片生成設定。"

        ??? note "**task**：`string enum` 影片生成的選用任務模式。若未指定，模型會根據提供的文字提示詞與輸入媒體自動決定適當的模式。"

            可能的值：

            - `text_to_video`：僅從文字提示詞生成影片。
            - `image_to_video`：從一或兩張來源圖片生成影片。第一張圖片定義起始影格，選用的第二張圖片定義結束影格。
            - `reference_to_video`：使用參考媒體（例如圖片、音訊或影片）生成影片。
            - `edit`：修改既有的輸入影片。
            - `extend`：延伸既有的輸入影片。





    ??? note "**transcription_config**：`TranscriptionConfig` 選用。語音辨識（轉錄）設定。若提供此設定，將啟用 ASR。"

          **language_codes**：`string array`

          選用。BCP-47 語言代碼，提供音訊中所含語言的提示。若省略或留空，預設為自動語言偵測。

          **custom_vocabulary**：`string array`

          選用。自訂詞彙片語清單，用於引導語音辨識模型偏向辨識特定詞彙。



        ??? note "**mode**：`TranscriptionMode` 或 `string enum` 具判別性的轉錄模式選項或列舉。"

              **可能的類型**： 



            ??? note "**SmartTranscriptionMode**"

                智慧轉錄模式的設定。

                **type**：必填 `object`

                值：`smart`

                **source_text**：`string`

                要透過語音指令編輯或改寫的來源文字。提供時，模型會執行語音驅動的編輯，並輸出最終定稿的替代文字。





            ??? note "**VerbatimTranscriptionMode**"

                逐字轉錄模式的設定。

                **type**：必填 `object`

                值：`verbatim`

                **timestamp_granularities**：`string array`

                選用。轉錄輸出中要包含的時間戳記粒度。支援的值："word"。若留空，則不產生時間戳記。

                **diarization_mode**：`string`

                選用。設定講者分離。支援的值："speaker"。





            ??? note "**string enum**"

                可能的值：

                - `verbatim`：逐字轉錄模式。
                - `smart`：智慧轉錄模式。





    ??? note "**structured_speech_config**：`SpeakerConfig` 或 `SpeechConfig array` 語音與多講者設定。"

          **可能的類型**： 



        ??? note "**SpeakerConfig**"

              多講者與語音生成的設定。



            ??? note "**speakers**：`SpeechConfig array` 個別講者的設定。"

                **voice**：`string`

                講者的聲音。

                **language**：`string`

                語音的語言。

                **speaker**：`string`

                講者的名稱，應與提示詞中給出的講者名稱相符。





        ??? note "**SpeechConfig array**"

            語音互動的設定。

            **voice**：`string`

            講者的聲音。

            **language**：`string`

            語音的語言。

            **speaker**：`string`

            講者的名稱，應與提示詞中給出的講者名稱相符。



  

---


  **system_instruction**：`string`

  互動的系統指令。

  

---


  **tools**：[`Tool`](/api-reference/interactions-api/create-interaction/#Resource:Tool) `array`

  模型在互動期間可呼叫的工具宣告清單。

  

---


  **input**：[`Content`](/api-reference/interactions-api/create-interaction/#Resource:Content) 或 [`Content`](/api-reference/interactions-api/create-interaction/#Resource:Content) `array` 或 [`Step`](/api-reference/interactions-api/create-interaction/#Resource:Step) `array` 或 `string`

  互動的輸入。

  

---


  

??? note "**usage**：`Usage` 僅供輸出。互動請求的權杖用量統計。"

      **total_input_tokens**：`integer`

      提示詞（上下文）中的權杖數量。

      **initial_input_tokens**：`integer`

      此次互動第一輪使用的輸入權杖數量。



    ??? note "**input_tokens_by_modality**：`ModalityTokens array` 依模態細分的輸入權杖用量。"

        ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**：`integer`

          該模態的權杖數量。



      **total_cached_tokens**：`integer`

      提示詞中快取部分（快取內容）的權杖數量。



    ??? note "**cached_tokens_by_modality**：`ModalityTokens array` 依模態細分的快取權杖用量。"

        ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**：`integer`

          該模態的權杖數量。



      **total_output_tokens**：`integer`

      所有產生的回應的權杖總數。



    ??? note "**output_tokens_by_modality**：`ModalityTokens array` 依模態細分的輸出權杖用量。"

        ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**：`integer`

          該模態的權杖數量。



      **total_tool_use_tokens**：`integer`

      工具使用提示詞中存在的權杖數量。



    ??? note "**tool_use_tokens_by_modality**：`ModalityTokens array` 依模態細分的工具使用權杖用量。"

        ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**：`integer`

          該模態的權杖數量。



      **total_thought_tokens**：`integer`

      思考模型的思考權杖數量。

      **total_tokens**：`integer`

      互動請求的權杖總數（提示詞 + 回應 + 其他內部權杖）。



    ??? note "**grounding_tool_count**：`GroundingToolCount array` 接地工具計數。"

        ??? note "**type**：`string enum` 與計數相關聯的接地工具類型。"

            可能的值：

            - `google_search`：使用 Google 網頁搜尋與圖片搜尋接地，以及 Web Grounding for Enterprise。
            - `google_maps`：使用 Google 地圖接地。



          **count**：`integer`


          接地工具計數的數量。



  

---


  

??? note "**response_format**：[`ResponseFormat`](/api-reference/interactions-api/create-interaction/#Resource:ResponseFormat) 或 [`ResponseFormat`](/api-reference/interactions-api/create-interaction/#Resource:ResponseFormat) `array` 強制產生的回應為符合此欄位所指定 JSON 架構的 JSON 物件。"

      **可能的類型**： 



    ??? note "**[ResponseFormat](/api-reference/interactions-api/create-interaction/#Resource:ResponseFormat)**"






    ??? note "**[ResponseFormat](/api-reference/interactions-api/create-interaction/#Resource:ResponseFormat) array**"

        每個項目為下列其中之一的清單：`AudioResponseFormat`、`ImageResponseFormat`、`TextResponseFormat`、`VideoResponseFormat`。



  

---


  **previous_interaction_id**：`string`

  前一次互動的 ID（如有）。

  

---


  

??? note "**environment**：[`EnvironmentConfig`](/api-reference/interactions-api/create-interaction/#Resource:EnvironmentConfig) 或 `string` 互動的環境設定。可以是指定遠端環境來源的物件，或是參照既有環境 ID 的字串。"

      **可能的類型**： 



    ??? note "**[EnvironmentConfig](/api-reference/interactions-api/create-interaction/#Resource:EnvironmentConfig)**"

          自訂環境的設定。

          **type**：必填 `object`

          值：`remote`



        ??? note "**sources**：`Source array`"

            ??? note "**type**：`string enum`"

                可能的值：

                - `gcs`：Cloud Storage 值區。
                - `inline`：行內內容。
                - `repository`：一般儲存庫。來源 URL 中的通訊協定前綴可識別提供者（例如 github://、gcs://）。



              **source**：`string`

              環境的來源。對 Cloud Storage 而言，這是 Cloud Storage 路徑；對 GitHub 而言，這是 GitHub 路徑。

              **target**：`string`

              來源在環境中應出現的位置。

              **content**：`string`

              當 `type` 為 `INLINE` 時的行內內容。

              **encoding**：`string`

              行內內容的選用編碼（例如 `base64`）。





        ??? note "**network**：[`EnvironmentNetworkEgressAllowlist`](/api-reference/interactions-api/create-interaction/#Resource:EnvironmentNetworkEgressAllowlist) 或 `string enum` 環境的網路設定。"

              **可能的類型**： 



            ??? note "**[EnvironmentNetworkEgressAllowlist](/api-reference/interactions-api/create-interaction/#Resource:EnvironmentNetworkEgressAllowlist)**"

                  環境的網路輸出設定。



                ??? note "**allowlist**：`EgressRule array` 或 `string enum` 允許的網域及其設定清單。設為 `"disabled"` 可封鎖所有網路輸出。"

                      **可能的類型**： 



                    ??? note "**EgressRule array**"

                        單一網域允許清單規則，可選用標頭注入。

                        **domain**：必填 `string`

                        允許向外請求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

                        **transform**：`object`

                        要注入符合此規則之請求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

                        **credential**：`string`

                        選用。以 ID 參照伺服器管理的 Credential 資源。





                    ??? note "**string enum**"

                        可能的值：

                        - `disabled`：所有網路輸出皆被封鎖。





            ??? note "**string enum**"

                可能的值：

                - `disabled`：所有網路輸出皆被封鎖。



          **environment_id**：`string`

          選用。互動的環境 ID。若指定，請求將更新既有環境，而非建立新環境。



        ??? note "**env**：`object` 或 `string` 要在沙箱環境中設定的環境變數。"

              **可能的類型**： 



            ??? note "**string**"

                直接的字串值。





        ??? note "**mode**：`string enum` 此環境的運算生命週期模式。"

            可能的值：

            - `on_demand`：此環境的運算生命週期模式。
            - `self_hosted`：此環境的運算生命週期模式。



          **custom_config**：`object`

          選用。任意由客戶定義的 JSON 設定，會透傳至自行託管環境的輪詢器。僅在 `mode` 為 `SELF_HOSTED` 時支援。





    ??? note "**string**"

        直接的字串值。



  

---


  **environment_id**：`string`

  僅供輸出。互動的環境 ID。僅在請求中設定了環境設定時才會填入。

  

---


  

??? note "**service_tier**：`ServiceTier` 互動的服務層級。"

    可能的值：

    - `flex`：Flex 服務層級。
    - `standard`：Standard 服務層級。
    - `priority`：Priority 服務層級。



  

---


  

??? note "**webhook_config**：`WebhookConfig` 選用。用於在互動完成時接收通知的 webhook 設定。"

    **uris**：`string array`

    選用。若設定，這些 webhook URI 將用於 webhook 事件，以取代已註冊的 webhook。

    **user_metadata**：`object`

    選用。每次向 webhook 發送事件時會一併傳回的使用者中繼資料。



  

---


  

??? note "**safety_settings**：`SafetySetting array` 互動的安全設定。"

    ??? note "**type**：必填 `HarmCategory` 要封鎖的危害類別類型。"

        可能的值：

        - `hate_speech`：基於特定屬性宣揚暴力或煽動對個人或群體仇恨的內容。
        - `dangerous_content`：宣揚、助長或促成危險活動的內容。
        - `harassment`：辱罵、威脅，或意圖霸凌、折磨或嘲弄的內容。
        - `sexually_explicit`：含有露骨性內容的內容。
        - `jailbreak`：旨在繞過安全篩選器的提示詞。





    ??? note "**threshold**：必填 `string enum` 封鎖內容的門檻。若危害機率超過此門檻，內容將被封鎖。"

        可能的值：

        - `block_low_and_above`：封鎖危害機率為低或更高的內容。
        - `block_medium_and_above`：封鎖危害機率為中或更高的內容。
        - `block_only_high`：僅封鎖危害機率為高的內容。
        - `off`：完全關閉安全篩選器。





    ??? note "**method**：`string enum` 選用。封鎖內容的方法。若未指定，預設行為是使用機率分數。"

        可能的值：

        - `severity`：危害封鎖方法同時使用機率與嚴重程度分數。
        - `probability`：危害封鎖方法使用機率分數。



  

---


  **labels**：`object`

  帶有使用者自訂中繼資料的請求標籤。標籤鍵與值的長度不得超過 63 個字元（Unicode 碼位），且只能包含小寫字母、數字字元、底線與連字號。允許國際字元。標籤值為選用。標籤鍵必須以字母開頭。

  

---


  

??? note "**errors**：`Error array` 僅供輸出。記錄於互動上的診斷錯誤／平台錯誤。"

    **code**：`string`

    識別錯誤類型的 URI。

    **message**：`string`

    人類可讀的錯誤訊息。



  

---


  **continuation_token**：`string`

  用於恢復長時間解碼的不透明權杖。輸出：當狀態為 REQUIRES_CONTINUATION 且可恢復解碼時設定。輸入：在 CreateInteraction 中原封不動地傳回最新權杖，以繼續解碼。

  

---


  **stream**：`boolean`

  僅供輸入。互動是否以串流方式傳輸。

  

---


  **store**：`boolean`

  僅供輸入。是否儲存回應與請求以供日後擷取。

  

---


  **background**：`boolean`

  僅供輸入。是否在背景執行模型互動。

  

---


  

??? note "**agent**：`AgentOption` 用於產生互動的 `Agent` 名稱。"

    可能的值：

    - `deep-research-preview-04-2026`：Gemini Deep Research Agent
    - `deep-research-max-preview-04-2026`：Gemini Deep Research Max Agent
    - `antigravity-preview-05-2026`：使用 Antigravity 受管理代理執行需要推理、檔案操作與工具使用的多步驟任務。
    - `antigravity-preview-09-2026`：使用 Antigravity 受管理代理執行需要推理、檔案操作與工具使用的多步驟任務。



  

---


  

??? note "**agent_config**：`AntigravityAgentConfig` 或 `DeepResearchAgentConfig` 或 `DynamicAgentConfig` 代理互動的設定參數。"

      **可能的類型**： 



    ??? note "**AntigravityAgentConfig**"

        Antigravity 代理執行階段的設定。提供伺服器端對代理執行環境與工具設定的控制。

        **type**：必填 `object`

        值：`antigravity`

        **model**：`string`

        用於代理推理的模型。

        **max_total_tokens**：`string`

        代理執行的權杖總數上限。





    ??? note "**DeepResearchAgentConfig**"

          Deep Research 代理的設定。

          **type**：必填 `object`

          值：`deep-research`



        ??? note "**thinking_summaries**：`ThinkingSummaries` 是否在回應中包含思考摘要。"

            可能的值：

            - `auto`：自動思考摘要。
            - `none`：不含思考摘要。





        ??? note "**visualization**：`string enum` 是否在回應中包含視覺化內容。"

            可能的值：

            - `off`：不包含視覺化內容。
            - `auto`：自動包含視覺化內容。



          **collaborative_planning**：`boolean`

          為 Deep Research 代理啟用人機協作規劃。設為 true 時，Deep Research 代理會在回應中提供研究計畫。代理只有在使用者於下一輪確認計畫後才會繼續執行。





    ??? note "**DynamicAgentConfig**"

        動態代理的設定。

        **type**：必填 `object`

        值：`dynamic`



  

---


  **max_total_tokens**：`string`

  代理執行的權杖總數上限。

  

  

  

  
  **範例**


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




      **type**：必填 `object`

      值：`audio`



    ---


      **data**：`string`

      音訊內容。



    ---


      **uri**：`string`

      音訊的 URI。



    ---


      **channels**：`integer`

      音訊聲道數量。



    ---


      **sample_rate**：`integer`

      音訊的取樣率。



    ---




    ??? note "**processing**：`AudioMediaProcessing` 或 `string enum` 模型如何處理此音訊以進行理解。"


          **可能的類型**：


        ??? note "**AudioMediaProcessing**"


              **type**：必填 `object`

              值：`static`

              **start_offset**：`string`

              選用。區段起始時間，相對於音訊串流的開頭。以十進位秒數加上 's' 後綴指定，例如 "10.5s"。必須為非負數。

              **end_offset**：`string`

              選用。區段結束時間，相對於音訊串流的開頭。以十進位秒數加上 's' 後綴指定，例如 "30s"。必須為正數，且在設定 `start_offset` 時須大於 `start_offset`。


        ??? note "**string enum**"


              可能的值：

              - `static`：所有音訊皆置於上下文中。


    ---


    ??? note "**mime_type**：`string enum` 音訊的 MIME 類型。"

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

      ```json
      {
        "type": "audio",
        "data": "BASE64_ENCODED_AUDIO",
        "mime_type": "audio/wav"
      }
      ```



??? note "**DocumentContent**"

      文件內容區塊。




      **type**：必填 `object`

      值：`document`



    ---


      **data**：`string`

      文件內容。



    ---


      **uri**：`string`

      文件的 URI。



    ---




    ??? note "**resolution**：`MediaResolution` 媒體的解析度。當在 content_layers 中選取 PAGE_IMAGE 時適用。"


          可能的值：

          - `low`：低解析度。
          - `medium`：中解析度。
          - `high`：高解析度。
          - `ultra_high`：超高解析度。


    ---


    ??? note "**processing**：`DocumentMediaProcessing` 或 `string enum` 模型如何處理此文件以進行理解。"


          **可能的類型**：


        ??? note "**DocumentMediaProcessing**"


              **type**：必填 `object`

              值：`static`


            ??? note "**page_options**：`PageProcessingOptions` 分頁文件的選項。僅適用於分頁文件 MIME 類型（例如 PDF、Office 文件與簡報）。"


                  **start_page**：`integer`

                  選用。起始頁，以 1 起算，包含起始頁。

                  **end_page**：`integer`

                  選用。結束頁，以 1 起算，包含結束頁。若設定了 `start_page`，必須大於或等於 `start_page`。


                ??? note "**content_layers**：`string enum array` 選用。要從分頁文件中擷取的內容層。"


                      可能的值：

                      - `page_image`：頁面的轉譯影像。
                      - `page_text`：頁面的文字。


            ??? note "**spreadsheet_options**：`SpreadsheetProcessingOptions` 試算表的選項。僅適用於試算表 MIME 類型（.xlsx、.xls、.ods）。"


                  **visible_cells**：`string`

                  選用。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                  **sheet_index**：`integer`

                  選用。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                ??? note "**content_layers**：`string enum array` 選用。要從試算表中擷取的內容層。"


                      可能的值：

                      - `visual`：工作表的轉譯影像。
                      - `data`：儲存格值、合併儲存格與格式。
                      - `formulas`：公式運算式及其計算結果。


        ??? note "**string enum**"


              可能的值：

              - `static`：已擷取的所有頁面皆置於上下文中。


    ---


    ??? note "**mime_type**：`string enum` 文件的 MIME 類型。"

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

      ```json
      {
        "type": "document",
        "data": "BASE64_ENCODED_DOCUMENT",
        "mime_type": "application/pdf"
      }
      ```



??? note "**[ImageContent](/api-reference/interactions-api/create-interaction/#Resource:ImageContent)**"

      圖片內容區塊。




      **type**：必填 `object`

      值：`image`



    ---


      **data**：`string`

      圖片內容。



    ---


      **uri**：`string`

      圖片的 URI。



    ---




    ??? note "**resolution**：`MediaResolution` 媒體的解析度。"

        可能的值：

        - `low`：低解析度。
        - `medium`：中解析度。
        - `high`：高解析度。
        - `ultra_high`：超高解析度。





    ---




    ??? note "**mime_type**：`string enum` 圖片的 MIME 類型。"

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

      ```json
      {
        "type": "image",
        "data": "BASE64_ENCODED_IMAGE",
        "mime_type": "image/png"
      }
      ```



??? note "**[TextContent](/api-reference/interactions-api/create-interaction/#Resource:TextContent)**"

      文字內容區塊。




      **text**：必填 `string`

      文字內容。



    ---


      **type**：必填 `object`

      值：`text`



    ---




    ??? note "**annotations**：`Annotation array` 模型產生內容的引用資訊。"

          **可能的類型**： 



        ??? note "**FileCitation**"

            檔案引用註釋。

            **type**：必填 `object`

            值：`file_citation`

            **document_uri**：`string`

            檔案的 URI。

            **file_name**：`string`

            檔案的名稱。

            **source**：`string`

            文字某部分所歸屬的來源。

            **custom_metadata**：`object`

            使用者提供的、關於擷取上下文的中繼資料。

            **page_number**：`integer`

            被引用文件的頁碼（如適用）。

            **media_id**：`string`

            圖片引用時的媒體 ID（如適用）。

            **start_index**：`integer`

            回應中歸屬此來源之區段的起始位置。索引表示區段的起始，以位元組為單位。

            **end_index**：`integer`

            歸屬區段的結束位置（不含該位置）。





        ??? note "**PlaceCitation**"

              地點引用註釋。

              **type**：必填 `object`

              值：`place_citation`

              **place_id**：`string`

              地點的 ID，格式為 `places/{place_id}`。

              **name**：`string`

              地點的標題。

              **url**：`string`

              地點的 URI 參照。



            ??? note "**review_snippets**：`ReviewSnippet array` 用於產生 Google 地圖中特定地點特色相關回答的評論片段。"

                **title**：`string`

                評論的標題。

                **url**：`string`

                對應至 Google 地圖上使用者評論的連結。

                **review_id**：`string`

                評論片段的 ID。



              **start_index**：`integer`

              回應中歸屬此來源之區段的起始位置。索引表示區段的起始，以位元組為單位。

              **end_index**：`integer`

              歸屬區段的結束位置（不含該位置）。





        ??? note "**SpeechAnnotation**"

            文字內容的語音註釋。

            **type**：必填 `object`

            值：`speech_metadata`

            **speaker**：`string`

            要與此輪次關聯的講者。

            **style**：`string`

            語音合成的風格指令。

            **start_index**：`integer`

            回應中歸屬此來源之區段的起始位置。索引表示區段的起始，以位元組為單位。

            **end_index**：`integer`

            歸屬區段的結束位置（不含該位置）。





        ??? note "**UrlCitation**"

            URL 引用註釋。

            **type**：必填 `object`

            值：`url_citation`

            **url**：`string`

            URL。

            **title**：`string`

            URL 的標題。

            **start_index**：`integer`

            回應中歸屬此來源之區段的起始位置。索引表示區段的起始，以位元組為單位。

            **end_index**：`integer`

            歸屬區段的結束位置（不含該位置）。





        ??? note "**WordInfo**"

            轉錄輸出的單字級 ASR 註釋。包含單字文字、選用的時間資訊與選用的講者歸屬。

            **type**：必填 `object`

            值：`word_info`

            **text**：`string`

            轉錄出的單字。

            **start_offset**：`string`

            單字相對於音訊起始的時間起始偏移。當 timestamp_granularities 包含 "word" 時出現。

            **end_offset**：`string`

            單字相對於音訊起始的時間結束偏移。當 timestamp_granularities 包含 "word" 時出現。

            **speaker**：`string`

            選用。此單字的講者標籤（例如 "spk_1"、"spk_2"）。當 TranscriptionConfig 中設定了 diarization_mode 時出現。

            **start_index**：`integer`

            回應中歸屬此來源之區段的起始位置。索引表示區段的起始，以位元組為單位。

            **end_index**：`integer`

            歸屬區段的結束位置（不含該位置）。








      **範例**

      **文字**

      ```json
      {
        "type": "text",
        "text": "Hello, how are you?"
      }
      ```



??? note "**VideoContent**"

      影片內容區塊。




      **type**：必填 `object`

      值：`video`



    ---


      **data**：`string`

      影片內容。



    ---


      **uri**：`string`

      影片的 URI。



    ---




    ??? note "**resolution**：`MediaResolution` 媒體的解析度。"

        可能的值：

        - `low`：低解析度。
        - `medium`：中解析度。
        - `high`：高解析度。
        - `ultra_high`：超高解析度。





    ---




    ??? note "**processing**：`MediaProcessing` 或 `string enum` 模型如何處理此影片以進行理解。"

          **可能的類型**： 



        ??? note "**MediaProcessing**"

            **type**：必填 `object`

            值：`static`

            **start_offset**：`string`

            選用。區段起始時間。以十進位秒數加上 's' 後綴指定，例如 "10.5s"。必須為非負數。

            **end_offset**：`string`

            選用。區段結束時間。以十進位秒數加上 's' 後綴指定，例如 "30s"。必須為非負數，且在設定 `start_offset` 時須大於 `start_offset`。

            **fps**：`number`

            選用。影片影格率取樣密度。





            ??? note "**content_layers**：`string enum array` 選用。要從影片中擷取的內容層。"


                  可能的值：

                  - `frames`：影片的影格。
                  - `audio`：影片的音訊。
                  - `transcript`：音軌的逐字稿。


        ??? note "**string enum**"

            可能的值：

            - `static`：固定速率的影格擷取。所有影格皆置於上下文中。
            - `agentic`：由模型驅動的動態導覽。





    ---


      **name**：`string`

      使用者為此內容區塊定義的名稱。模型可在最終回應中參照此名稱。



    ---




    ??? note "**mime_type**：`string enum` 影片的 MIME 類型。"

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




      **type**：必填 `object`

      值：`code_execution`






      **範例**


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




      **type**：必填 `object`

      值：`computer_use`



    ---




    ??? note "**environment**：`string enum` 正在操作的環境。"

        可能的值：

        - `browser`：在網頁瀏覽器中操作。
        - `mobile`：在行動環境中操作。
        - `desktop`：在桌面環境中操作。





    ---


      **excluded_predefined_functions**：`string array`

      從模型呼叫中排除的預先定義函式清單。



    ---


      **enable_prompt_injection_detection**：`boolean`

      是否對 computer-use 請求啟用提示詞注入偵測檢查。



    ---




    ??? note "**disabled_safety_policies**：`string enum array` 選用。computer use 停用的安全政策。"

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




      **type**：必填 `object`

      值：`file_search`



    ---


      **file_search_store_names**：`string array`

      要搜尋的 File Search 儲存庫名稱。



    ---


      **top_k**：`integer`

      要擷取的語意檢索區塊數量。



    ---


      **metadata_filter**：`string`

      要套用至語意檢索文件與區塊的中繼資料篩選條件。






      **範例**


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




      **type**：必填 `object`

      值：`function`



    ---


      **name**：`string`

      函式的名稱。



    ---


      **description**：`string`

      函式的說明。



    ---


      **parameters**：`object`

      函式參數的 JSON Schema。支援 JSON Schema 的子集。`minLength`、`maxLength`、`minProperties`、`maxProperties`、`uniqueItems`、`contains`、`minContains` 與 `maxContains` 會被忽略且不強制執行。






      **範例**


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

      模型可用來呼叫 Google 地圖的工具。




      **type**：必填 `object`

      值：`google_maps`



    ---


      **enable_widget**：`boolean`

      是否在回應的工具呼叫結果中傳回 widget 上下文權杖。



    ---


      **latitude**：`number`

      使用者位置的緯度。



    ---


      **longitude**：`number`

      使用者位置的經度。






      **範例**


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




      **type**：必填 `object`

      值：`google_search`



    ---




    ??? note "**search_types**：`string enum array` 要啟用的搜尋接地類型。"

        可能的值：

        - `web_search`：設定此欄位可啟用網頁搜尋。僅傳回文字結果。
        - `image_search`：設定此欄位可啟用圖片搜尋。傳回圖片位元組。








      **範例**


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

      MCPServer 是可由模型呼叫以執行動作的伺服器。




      **type**：必填 `object`

      值：`mcp_server`



    ---


      **name**：`string`

      MCPServer 的名稱。



    ---


      **url**：`string`

      MCPServer 端點的完整 URL。範例："https://api.example.com/mcp"



    ---


      **headers**：`object`

      選用：如有需要，用於驗證標頭、逾時等欄位。



    ---




    ??? note "**allowed_tools**：`AllowedTools array` 允許的工具。"

        ??? note "**mode**：`string enum` 工具選擇的模式。"

            可能的值：

            - `auto`：自動工具選擇。
            - `any`：任意工具選擇。
            - `none`：不使用工具選擇。
            - `validated`：經驗證的工具選擇。



          **tools**：`string array`

          允許工具的名稱。








      **範例**


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




      **type**：必填 `object`

      值：`url_context`






      **範例**


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


### InteractionSseEvent {#Resource:InteractionSseEvent}

**多型類型**：


??? note "**ErrorEvent**"


      **event_type**：必填 `object`

      值：`error`


    ---


    ??? note "**error**：`Error`"


          **code**：`string`

          識別錯誤類型的 URI。

          **message**：`string`

          人類可讀的錯誤訊息。


    ---


      **event_id**：`string`

      要用於從此事件恢復互動串流的 event_id 權杖。


      **範例**

      **錯誤事件**

      ```json
      {
        "error": {
          "code": "not_found",
          "message": "Failed to get completed interaction: Result not found."
        },
        "event_type": "error"
      }
      ```


??? note "**InteractionCompletedEvent**"


      表示互動已完成。在互動收到 Complete/Cancel 或自然結束時發送。此後無法再向互動傳送輸入。


    ??? note "**interaction**：必填 `InteractionSseEventInteraction` 在串流結束時發出的部分已完成互動資源。"


          **id**：必填 `string`

          僅供輸出。互動完成的唯一識別碼。


        ??? note "**status**：必填 `string enum` 僅供輸出。互動的狀態。"


              可能的值：

              - `in_progress`：互動正在進行中。
              - `requires_action`：互動需要使用者採取動作／提供輸入。
              - `completed`：互動已完成。
              - `failed`：互動失敗。
              - `cancelled`：互動已取消。
              - `incomplete`：互動已完成，但包含不完整的結果（例如達到 max_tokens）。


          **model**：`string`

          將完成您提示詞的模型。

          **created**：`string`

          僅供輸出。回應的建立時間，採 ISO 8601 格式。

          **updated**：`string`

          僅供輸出。回應的最後更新時間，採 ISO 8601 格式。


        ??? note "**usage**：`Usage` 僅供輸出。互動請求的權杖用量統計。"


              **total_input_tokens**：`integer`

              提示詞（上下文）中的權杖數量。

              **initial_input_tokens**：`integer`

              此次互動第一輪使用的輸入權杖數量。


            ??? note "**input_tokens_by_modality**：`ModalityTokens array` 依模態細分的輸入權杖用量。"


                ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                      可能的值：

                      - `text`：表示模型應傳回文字。
                      - `image`：表示模型應傳回圖片。
                      - `audio`：表示模型應傳回音訊。
                      - `video`：表示模型應傳回影片。
                      - `document`：表示模型應傳回文件。


                  **tokens**：`integer`

                  該模態的權杖數量。


              **total_cached_tokens**：`integer`

              提示詞中快取部分（快取內容）的權杖數量。


            ??? note "**cached_tokens_by_modality**：`ModalityTokens array` 依模態細分的快取權杖用量。"


                ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                      可能的值：

                      - `text`：表示模型應傳回文字。
                      - `image`：表示模型應傳回圖片。
                      - `audio`：表示模型應傳回音訊。
                      - `video`：表示模型應傳回影片。
                      - `document`：表示模型應傳回文件。


                  **tokens**：`integer`

                  該模態的權杖數量。


              **total_output_tokens**：`integer`

              所有產生的回應的權杖總數。


            ??? note "**output_tokens_by_modality**：`ModalityTokens array` 依模態細分的輸出權杖用量。"


                ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                      可能的值：

                      - `text`：表示模型應傳回文字。
                      - `image`：表示模型應傳回圖片。
                      - `audio`：表示模型應傳回音訊。
                      - `video`：表示模型應傳回影片。
                      - `document`：表示模型應傳回文件。


                  **tokens**：`integer`

                  該模態的權杖數量。


              **total_tool_use_tokens**：`integer`

              工具使用提示詞中存在的權杖數量。


            ??? note "**tool_use_tokens_by_modality**：`ModalityTokens array` 依模態細分的工具使用權杖用量。"


                ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                      可能的值：

                      - `text`：表示模型應傳回文字。
                      - `image`：表示模型應傳回圖片。
                      - `audio`：表示模型應傳回音訊。
                      - `video`：表示模型應傳回影片。
                      - `document`：表示模型應傳回文件。


                  **tokens**：`integer`

                  該模態的權杖數量。


              **total_thought_tokens**：`integer`

              思考模型的思考權杖數量。

              **total_tokens**：`integer`

              互動請求的權杖總數（提示詞 + 回應 + 其他內部權杖）。


            ??? note "**grounding_tool_count**：`GroundingToolCount array` 接地工具計數。"


                ??? note "**type**：`string enum` 與計數相關聯的接地工具類型。"


                      可能的值：

                      - `google_search`：使用 Google 網頁搜尋與圖片搜尋接地，以及 Web Grounding for Enterprise。
                      - `google_maps`：使用 Google 地圖接地。


                  **count**：`integer`

                  接地工具計數的數量。


        ??? note "**service_tier**：`ServiceTier` 互動的服務層級。"


              可能的值：

              - `flex`：Flex 服務層級。
              - `standard`：Standard 服務層級。
              - `priority`：Priority 服務層級。


          **steps**：[`Step`](/api-reference/interactions-api/create-interaction/#Resource:Step) `array`

          僅供輸出。組成互動的步驟（若此事件包含）。

          **continuation_token**：`string`

          用於恢復長時間解碼的不透明權杖。輸出：當狀態為 INCOMPLETE 且可恢復解碼時設定。輸入：在 CreateInteraction 中原封不動地傳回最新權杖，以繼續解碼。

          **agent**：`string`

          要互動的代理。

          **object**：`string`

          僅供輸出。資源類型。


    ---


      **event_type**：必填 `object`

      值：`interaction.completed`


    ---


      **event_id**：`string`

      要用於從此事件恢復互動串流的 event_id 權杖。


      **範例**

      **互動已完成**

      ```json
      {
        "event_id": "evt_123",
        "event_type": "interaction.completed",
        "interaction": {
          "created": "2025-12-04T15:01:45Z",
          "id": "v1_ChdXS0l4YWZXTk9xbk0xZThQczhEcmlROBIXV0tJeGFmV05PcW5NMWU4UHM4RHJpUTg",
          "model": "gemini-3.8-flash",
          "status": "completed",
          "updated": "2025-12-04T15:01:45Z"
        }
      }
      ```


??? note "**InteractionCreatedEvent**"


      確認已建立新互動的伺服器回應。


    ??? note "**interaction**：必填 `InteractionSseEventInteraction` 在串流建立時發出的部分互動資源。"


          **id**：必填 `string`

          僅供輸出。互動完成的唯一識別碼。


        ??? note "**status**：必填 `string enum` 僅供輸出。互動的狀態。"


              可能的值：

              - `in_progress`：互動正在進行中。
              - `requires_action`：互動需要使用者採取動作／提供輸入。
              - `completed`：互動已完成。
              - `failed`：互動失敗。
              - `cancelled`：互動已取消。
              - `incomplete`：互動已完成，但包含不完整的結果（例如達到 max_tokens）。


          **model**：`string`

          將完成您提示詞的模型。

          **created**：`string`

          僅供輸出。回應的建立時間，採 ISO 8601 格式。

          **updated**：`string`

          僅供輸出。回應的最後更新時間，採 ISO 8601 格式。


        ??? note "**usage**：`Usage` 僅供輸出。互動請求的權杖用量統計。"


              **total_input_tokens**：`integer`

              提示詞（上下文）中的權杖數量。

              **initial_input_tokens**：`integer`

              此次互動第一輪使用的輸入權杖數量。


            ??? note "**input_tokens_by_modality**：`ModalityTokens array` 依模態細分的輸入權杖用量。"


                ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                      可能的值：

                      - `text`：表示模型應傳回文字。
                      - `image`：表示模型應傳回圖片。
                      - `audio`：表示模型應傳回音訊。
                      - `video`：表示模型應傳回影片。
                      - `document`：表示模型應傳回文件。


                  **tokens**：`integer`

                  該模態的權杖數量。


              **total_cached_tokens**：`integer`

              提示詞中快取部分（快取內容）的權杖數量。


            ??? note "**cached_tokens_by_modality**：`ModalityTokens array` 依模態細分的快取權杖用量。"


                ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                      可能的值：

                      - `text`：表示模型應傳回文字。
                      - `image`：表示模型應傳回圖片。
                      - `audio`：表示模型應傳回音訊。
                      - `video`：表示模型應傳回影片。
                      - `document`：表示模型應傳回文件。


                  **tokens**：`integer`

                  該模態的權杖數量。


              **total_output_tokens**：`integer`

              所有產生的回應的權杖總數。


            ??? note "**output_tokens_by_modality**：`ModalityTokens array` 依模態細分的輸出權杖用量。"


                ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                      可能的值：

                      - `text`：表示模型應傳回文字。
                      - `image`：表示模型應傳回圖片。
                      - `audio`：表示模型應傳回音訊。
                      - `video`：表示模型應傳回影片。
                      - `document`：表示模型應傳回文件。


                  **tokens**：`integer`

                  該模態的權杖數量。


              **total_tool_use_tokens**：`integer`

              工具使用提示詞中存在的權杖數量。


            ??? note "**tool_use_tokens_by_modality**：`ModalityTokens array` 依模態細分的工具使用權杖用量。"


                ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                      可能的值：

                      - `text`：表示模型應傳回文字。
                      - `image`：表示模型應傳回圖片。
                      - `audio`：表示模型應傳回音訊。
                      - `video`：表示模型應傳回影片。
                      - `document`：表示模型應傳回文件。


                  **tokens**：`integer`

                  該模態的權杖數量。


              **total_thought_tokens**：`integer`

              思考模型的思考權杖數量。

              **total_tokens**：`integer`

              互動請求的權杖總數（提示詞 + 回應 + 其他內部權杖）。


            ??? note "**grounding_tool_count**：`GroundingToolCount array` 接地工具計數。"


                ??? note "**type**：`string enum` 與計數相關聯的接地工具類型。"


                      可能的值：

                      - `google_search`：使用 Google 網頁搜尋與圖片搜尋接地，以及 Web Grounding for Enterprise。
                      - `google_maps`：使用 Google 地圖接地。


                  **count**：`integer`

                  接地工具計數的數量。


        ??? note "**service_tier**：`ServiceTier` 互動的服務層級。"


              可能的值：

              - `flex`：Flex 服務層級。
              - `standard`：Standard 服務層級。
              - `priority`：Priority 服務層級。


          **steps**：[`Step`](/api-reference/interactions-api/create-interaction/#Resource:Step) `array`

          僅供輸出。組成互動的步驟（若此事件包含）。

          **continuation_token**：`string`

          用於恢復長時間解碼的不透明權杖。輸出：當狀態為 INCOMPLETE 且可恢復解碼時設定。輸入：在 CreateInteraction 中原封不動地傳回最新權杖，以繼續解碼。

          **agent**：`string`

          要互動的代理。

          **object**：`string`

          僅供輸出。資源類型。


    ---


      **event_type**：必填 `object`

      值：`interaction.created`


    ---


      **event_id**：`string`

      要用於從此事件恢復互動串流的 event_id 權杖。


      **範例**

      **互動已建立**

      ```json
      {
        "event_id": "evt_123",
        "event_type": "interaction.created",
        "interaction": {
          "created": "2025-12-04T15:01:45Z",
          "id": "v1_ChdXS0l4YWZXTk9xbk0xZThQczhEcmlROBIXV0tJeGFmV05PcW5NMWU4UHM4RHJpUTg",
          "model": "gemini-3.8-flash",
          "status": "in_progress",
          "updated": "2025-12-04T15:01:45Z"
        }
      }
      ```


??? note "**InteractionStatusUpdate**"


      **interaction_id**：必填 `string`


    ---


    ??? note "**status**：必填 `string enum`"


          可能的值：

          - `in_progress`：互動正在進行中。
          - `requires_action`：互動需要使用者採取動作／提供輸入。
          - `completed`：互動已完成。
          - `failed`：互動失敗。
          - `cancelled`：互動已取消。
          - `incomplete`：互動已完成，但包含不完整的結果（例如達到 max_tokens）。
          - `requires_continuation`：互動至少還需要一次請求才能完成。下一個請求應將 continuation_token 設為此請求傳回的權杖。


    ---


      **event_type**：必填 `object`

      值：`interaction.status_update`


    ---


      **continuation_token**：`string`

      選用的不透明接續權杖，用於在串流中斷後從最新檢查點恢復解碼。


    ---


    ??? note "**usage**：`Usage` 截至此檢查點的模型用量統計。"


          **total_input_tokens**：`integer`

          提示詞（上下文）中的權杖數量。

          **initial_input_tokens**：`integer`

          此次互動第一輪使用的輸入權杖數量。


        ??? note "**input_tokens_by_modality**：`ModalityTokens array` 依模態細分的輸入權杖用量。"


            ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                  可能的值：

                  - `text`：表示模型應傳回文字。
                  - `image`：表示模型應傳回圖片。
                  - `audio`：表示模型應傳回音訊。
                  - `video`：表示模型應傳回影片。
                  - `document`：表示模型應傳回文件。


              **tokens**：`integer`

              該模態的權杖數量。


          **total_cached_tokens**：`integer`

          提示詞中快取部分（快取內容）的權杖數量。


        ??? note "**cached_tokens_by_modality**：`ModalityTokens array` 依模態細分的快取權杖用量。"


            ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                  可能的值：

                  - `text`：表示模型應傳回文字。
                  - `image`：表示模型應傳回圖片。
                  - `audio`：表示模型應傳回音訊。
                  - `video`：表示模型應傳回影片。
                  - `document`：表示模型應傳回文件。


              **tokens**：`integer`

              該模態的權杖數量。


          **total_output_tokens**：`integer`

          所有產生的回應的權杖總數。


        ??? note "**output_tokens_by_modality**：`ModalityTokens array` 依模態細分的輸出權杖用量。"


            ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                  可能的值：

                  - `text`：表示模型應傳回文字。
                  - `image`：表示模型應傳回圖片。
                  - `audio`：表示模型應傳回音訊。
                  - `video`：表示模型應傳回影片。
                  - `document`：表示模型應傳回文件。


              **tokens**：`integer`

              該模態的權杖數量。


          **total_tool_use_tokens**：`integer`

          工具使用提示詞中存在的權杖數量。


        ??? note "**tool_use_tokens_by_modality**：`ModalityTokens array` 依模態細分的工具使用權杖用量。"


            ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                  可能的值：

                  - `text`：表示模型應傳回文字。
                  - `image`：表示模型應傳回圖片。
                  - `audio`：表示模型應傳回音訊。
                  - `video`：表示模型應傳回影片。
                  - `document`：表示模型應傳回文件。


              **tokens**：`integer`

              該模態的權杖數量。


          **total_thought_tokens**：`integer`

          思考模型的思考權杖數量。

          **total_tokens**：`integer`

          互動請求的權杖總數（提示詞 + 回應 + 其他內部權杖）。


        ??? note "**grounding_tool_count**：`GroundingToolCount array` 接地工具計數。"


            ??? note "**type**：`string enum` 與計數相關聯的接地工具類型。"


                  可能的值：

                  - `google_search`：使用 Google 網頁搜尋與圖片搜尋接地，以及 Web Grounding for Enterprise。
                  - `google_maps`：使用 Google 地圖接地。


              **count**：`integer`

              接地工具計數的數量。


    ---


      **event_id**：`string`

      要用於從此事件恢復互動串流的 event_id 權杖。


      **範例**

      **互動狀態更新**

      ```json
      {
        "event_type": "interaction.status_update",
        "interaction_id": "v1_ChdTMjQ0YWJ5TUF1TzcxZThQdjRpcnFRcxIXUzI0NGFieU1BdU83MWU4UHY0aXJxUXM",
        "status": "in_progress"
      }
      ```


??? note "**StepDelta**"


      **index**：必填 `integer`


    ---


    ??? note "**delta**：必填 `StepDeltaData`"


          **可能的類型**： 


        ??? note "**ArgumentsDelta**"


              **type**：必填 `object`

              值：`arguments_delta`

              **arguments**：`string`


        ??? note "**AudioDelta**"


              **type**：必填 `object`

              值：`audio`


            ??? note "**mime_type**：`string enum`"


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


              **data**：`string`

              **uri**：`string`

              **sample_rate**：`integer`

              音訊的取樣率。

              **channels**：`integer`

              音訊聲道數量。


        ??? note "**CodeExecutionCallDelta**"


            ??? note "**arguments**：必填 `CodeExecutionCallArguments`"


                ??? note "**language**：`string enum` `code` 的程式語言。"


                      可能的值：

                      - `python`：Python >= 3.10，可使用 numpy 與 simpy。
                      - `bash`：Bash。僅適用於 Gemini 3.0 以上模型。


                  **code**：`string`

                  要執行的程式碼。


              **type**：必填 `object`

              值：`code_execution_call`

              **signature**：`string`

              用於後端驗證的簽章雜湊。


        ??? note "**CodeExecutionResultDelta**"


              **result**：必填 `string`

              **type**：必填 `object`

              值：`code_execution_result`

              **is_error**：`boolean`

              **signature**：`string`

              用於後端驗證的簽章雜湊。


        ??? note "**DocumentDelta**"


              **type**：必填 `object`

              值：`document`


            ??? note "**mime_type**：`string enum`"


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


              **data**：`string`

              **uri**：`string`


        ??? note "**FileSearchCallDelta**"


              **type**：必填 `object`

              值：`file_search_call`

              **signature**：`string`

              用於後端驗證的簽章雜湊。


        ??? note "**FileSearchResultDelta**"


            ??? note "**result**：必填 `FileSearchResult array`"


              **type**：必填 `object`

              值：`file_search_result`

              **signature**：`string`

              用於後端驗證的簽章雜湊。


        ??? note "**FunctionResultDelta**"


            ??? note "**result**：必填 `(`[`ImageContent`](/api-reference/interactions-api/create-interaction/#Resource:ImageContent) or [`TextContent`](/api-reference/interactions-api/create-interaction/#Resource:TextContent)`) array` or `object` or `string`"


                  **可能的類型**： 


                ??? note "**([ImageContent](/api-reference/interactions-api/create-interaction/#Resource:ImageContent) 或 [TextContent](/api-reference/interactions-api/create-interaction/#Resource:TextContent)) array**"


                      每個項目為下列其中之一的清單：[`ImageContent`](/api-reference/interactions-api/create-interaction/#Resource:ImageContent)、[`TextContent`](/api-reference/interactions-api/create-interaction/#Resource:TextContent)。


                ??? note "**string**"


                      直接的字串值。


              **type**：必填 `object`

              值：`function_result`

              **name**：`string`

              **is_error**：`boolean`


        ??? note "**GoogleMapsCallDelta**"


              **type**：必填 `object`

              值：`google_maps_call`


            ??? note "**arguments**：`GoogleMapsCallArguments` 要傳遞給 Google 地圖工具的引數。"


                  **queries**：`string array`

                  要執行的查詢。


              **signature**：`string`

              用於後端驗證的簽章雜湊。


        ??? note "**GoogleMapsResultDelta**"


              **type**：必填 `object`

              值：`google_maps_result`


            ??? note "**result**：`GoogleMapsResult array` Google Maps 的結果。"


                ??? note "**places**：`Places array` 找到的地點。"


                      **place_id**：`string`

                      地點的 ID，格式為 `places/{place_id}`。

                      **name**：`string`

                      地點的標題。

                      **url**：`string`

                      地點的 URI 參照。


                    ??? note "**review_snippets**：`ReviewSnippet array` 用於產生 Google 地圖中特定地點特色相關回答的評論片段。"


                          **title**：`string`

                          評論的標題。

                          **url**：`string`

                          對應至 Google 地圖上使用者評論的連結。

                          **review_id**：`string`

                          評論片段的 ID。


                  **widget_context_token**：`string`

                  Google Maps widget 內容權杖的資源名稱。


              **signature**：`string`

              用於後端驗證的簽章雜湊。


        ??? note "**GoogleSearchCallDelta**"


            ??? note "**arguments**：必填 `GoogleSearchCallArguments`"


                  **queries**：`string array`

                  後續網頁搜尋的網頁搜尋查詢。


              **type**：必填 `object`

              值：`google_search_call`

              **signature**：`string`

              用於後端驗證的簽章雜湊。


        ??? note "**GoogleSearchResultDelta**"


            ??? note "**result**：必填 `GoogleSearchResult array`"


                  **search_suggestions**：`string`

                  可嵌入網頁或應用程式 webview 的網頁內容片段。


              **type**：必填 `object`

              值：`google_search_result`

              **is_error**：`boolean`

              **signature**：`string`

              用於後端驗證的簽章雜湊。


        ??? note "**ImageDelta**"


              **type**：必填 `object`

              值：`image`


            ??? note "**mime_type**：`string enum`"


                  可能的值：

                  - `image/png`：PNG 圖片格式
                  - `image/jpeg`：JPEG 圖片格式
                  - `image/webp`：WebP 圖片格式
                  - `image/heic`：HEIC 圖片格式
                  - `image/heif`：HEIF 圖片格式
                  - `image/gif`：GIF 圖片格式
                  - `image/bmp`：BMP 圖片格式
                  - `image/tiff`：TIFF 圖片格式


              **data**：`string`

              **uri**：`string`


            ??? note "**resolution**：`MediaResolution` 媒體的解析度。"


                  可能的值：

                  - `low`：低解析度。
                  - `medium`：中解析度。
                  - `high`：高解析度。
                  - `ultra_high`：超高解析度。


        ??? note "**McpServerToolCallDelta**"


              **name**：必填 `string`

              **server_name**：必填 `string`

              **arguments**：必填 `object`

              **type**：必填 `object`

              值：`mcp_server_tool_call`


        ??? note "**McpServerToolResultDelta**"


            ??? note "**result**：必填 `(`[`ImageContent`](/api-reference/interactions-api/create-interaction/#Resource:ImageContent) or [`TextContent`](/api-reference/interactions-api/create-interaction/#Resource:TextContent)`) array` or `object` or `string`"


                  **可能的類型**： 


                ??? note "**([ImageContent](/api-reference/interactions-api/create-interaction/#Resource:ImageContent) 或 [TextContent](/api-reference/interactions-api/create-interaction/#Resource:TextContent)) array**"


                      每個項目為下列其中之一的清單：[`ImageContent`](/api-reference/interactions-api/create-interaction/#Resource:ImageContent)、[`TextContent`](/api-reference/interactions-api/create-interaction/#Resource:TextContent)。


                ??? note "**string**"


                      直接的字串值。


              **type**：必填 `object`

              值：`mcp_server_tool_result`

              **name**：`string`

              **server_name**：`string`


        ??? note "**ProcessingCallDelta**"


              伺服器發起的媒體處理步驟的串流差異。

              **type**：必填 `object`

              值：`processing_call`

              **signature**：`string`

              用於後端驗證的簽章雜湊。


        ??? note "**ProcessingResultDelta**"


              伺服器發起的媒體處理步驟之結果的串流差異。

              **type**：必填 `object`

              值：`processing_result`

              **signature**：`string`

              用於後端驗證的簽章雜湊。


        ??? note "**TextAnnotationDelta**"


              **type**：必填 `object`

              值：`text_annotation_delta`


            ??? note "**annotations**：`Annotation array` 模型產生內容的引用資訊。"


                  **可能的類型**： 


                ??? note "**FileCitation**"


                      檔案引用註釋。

                      **type**：必填 `object`

                      值：`file_citation`

                      **document_uri**：`string`

                      檔案的 URI。

                      **file_name**：`string`

                      檔案的名稱。

                      **source**：`string`

                      文字某部分所歸屬的來源。

                      **custom_metadata**：`object`

                      使用者提供的、關於擷取上下文的中繼資料。

                      **page_number**：`integer`

                      被引用文件的頁碼（如適用）。

                      **media_id**：`string`

                      圖片引用時的媒體 ID（如適用）。

                      **start_index**：`integer`

                      回應中歸屬此來源之區段的起始位置。索引表示區段的起始，以位元組為單位。

                      **end_index**：`integer`

                      歸屬區段的結束位置（不含該位置）。


                ??? note "**PlaceCitation**"


                      地點引用註釋。

                      **type**：必填 `object`

                      值：`place_citation`

                      **place_id**：`string`

                      地點的 ID，格式為 `places/{place_id}`。

                      **name**：`string`

                      地點的標題。

                      **url**：`string`

                      地點的 URI 參照。


                    ??? note "**review_snippets**：`ReviewSnippet array` 用於產生 Google 地圖中特定地點特色相關回答的評論片段。"


                          **title**：`string`

                          評論的標題。

                          **url**：`string`

                          對應至 Google 地圖上使用者評論的連結。

                          **review_id**：`string`

                          評論片段的 ID。


                      **start_index**：`integer`

                      回應中歸屬此來源之區段的起始位置。索引表示區段的起始，以位元組為單位。

                      **end_index**：`integer`

                      歸屬區段的結束位置（不含該位置）。


                ??? note "**SpeechAnnotation**"


                      文字內容的語音註釋。

                      **type**：必填 `object`

                      值：`speech_metadata`

                      **speaker**：`string`

                      要與此輪次關聯的講者。

                      **style**：`string`

                      語音合成的風格指令。

                      **start_index**：`integer`

                      回應中歸屬此來源之區段的起始位置。索引表示區段的起始，以位元組為單位。

                      **end_index**：`integer`

                      歸屬區段的結束位置（不含該位置）。


                ??? note "**UrlCitation**"


                      URL 引用註釋。

                      **type**：必填 `object`

                      值：`url_citation`

                      **url**：`string`

                      URL。

                      **title**：`string`

                      URL 的標題。

                      **start_index**：`integer`

                      回應中歸屬此來源之區段的起始位置。索引表示區段的起始，以位元組為單位。

                      **end_index**：`integer`

                      歸屬區段的結束位置（不含該位置）。


                ??? note "**WordInfo**"


                      轉錄輸出的單字級 ASR 註釋。包含單字文字、選用的時間資訊與選用的講者歸屬。

                      **type**：必填 `object`

                      值：`word_info`

                      **text**：`string`

                      轉錄出的單字。

                      **start_offset**：`string`

                      單字相對於音訊起始的時間起始偏移。當 timestamp_granularities 包含 "word" 時出現。

                      **end_offset**：`string`

                      單字相對於音訊起始的時間結束偏移。當 timestamp_granularities 包含 "word" 時出現。

                      **speaker**：`string`

                      選用。此單字的講者標籤（例如 "spk_1"、"spk_2"）。當 TranscriptionConfig 中設定了 diarization_mode 時出現。

                      **start_index**：`integer`

                      回應中歸屬此來源之區段的起始位置。索引表示區段的起始，以位元組為單位。

                      **end_index**：`integer`

                      歸屬區段的結束位置（不含該位置）。


        ??? note "**TextDelta**"


              **text**：必填 `string`

              **type**：必填 `object`

              值：`text`


        ??? note "**ThoughtSignatureDelta**"


              **type**：必填 `object`

              值：`thought_signature`

              **signature**：`string`

              用以比對後端來源、將其納入生成內容的簽章。


        ??? note "**ThoughtSummaryDelta**"


              **type**：必填 `object`

              值：`thought_summary`

              **content**：[`Content`](/api-reference/interactions-api/create-interaction/#Resource:Content)

              要加入思考內容的新摘要項目。


        ??? note "**UrlContextCallDelta**"


            ??? note "**arguments**：必填 `UrlContextCallArguments`"


                  **urls**：`string array`

                  要擷取的 URL。


              **type**：必填 `object`

              值：`url_context_call`

              **signature**：`string`

              用於後端驗證的簽章雜湊。


        ??? note "**UrlContextResultDelta**"


            ??? note "**result**：必填 `UrlContextResult array`"


                  **url**：`string`

                  已擷取的 URL。


                ??? note "**status**：`string enum` URL 擷取的狀態。"


                      可能的值：

                      - `success`：URL 擷取成功。
                      - `error`：URL 擷取因錯誤而失敗。
                      - `paywall`：URL 擷取失敗，因為內容位於付費牆之後。
                      - `unsafe`：URL 擷取失敗，因為內容不安全。


              **type**：必填 `object`

              值：`url_context_result`

              **is_error**：`boolean`

              **signature**：`string`

              用於後端驗證的簽章雜湊。


        ??? note "**VideoDelta**"


              **type**：必填 `object`

              值：`video`


            ??? note "**mime_type**：`string enum`"


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
                  - `video/jpeg2000`：JPEG 2000 影片格式


              **data**：`string`

              **uri**：`string`


            ??? note "**resolution**：`MediaResolution` 媒體的解析度。"


                  可能的值：

                  - `low`：低解析度。
                  - `medium`：中解析度。
                  - `high`：高解析度。
                  - `ultra_high`：超高解析度。


    ---


      **event_type**：必填 `object`

      值：`step.delta`


    ---


      **event_id**：`string`

      要用於從此事件恢復互動串流的 event_id 權杖。


    ---


    ??? note "**metadata**：`StepDeltaMetadata`"


        ??? note "**total_usage**：`Usage` 互動請求的權杖用量統計。"


              **total_input_tokens**：`integer`

              提示詞（上下文）中的權杖數量。

              **initial_input_tokens**：`integer`

              此次互動第一輪使用的輸入權杖數量。


            ??? note "**input_tokens_by_modality**：`ModalityTokens array` 依模態細分的輸入權杖用量。"


                ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                      可能的值：

                      - `text`：表示模型應傳回文字。
                      - `image`：表示模型應傳回圖片。
                      - `audio`：表示模型應傳回音訊。
                      - `video`：表示模型應傳回影片。
                      - `document`：表示模型應傳回文件。


                  **tokens**：`integer`

                  該模態的權杖數量。


              **total_cached_tokens**：`integer`

              提示詞中快取部分（快取內容）的權杖數量。


            ??? note "**cached_tokens_by_modality**：`ModalityTokens array` 依模態細分的快取權杖用量。"


                ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                      可能的值：

                      - `text`：表示模型應傳回文字。
                      - `image`：表示模型應傳回圖片。
                      - `audio`：表示模型應傳回音訊。
                      - `video`：表示模型應傳回影片。
                      - `document`：表示模型應傳回文件。


                  **tokens**：`integer`

                  該模態的權杖數量。


              **total_output_tokens**：`integer`

              所有產生的回應的權杖總數。


            ??? note "**output_tokens_by_modality**：`ModalityTokens array` 依模態細分的輸出權杖用量。"


                ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                      可能的值：

                      - `text`：表示模型應傳回文字。
                      - `image`：表示模型應傳回圖片。
                      - `audio`：表示模型應傳回音訊。
                      - `video`：表示模型應傳回影片。
                      - `document`：表示模型應傳回文件。


                  **tokens**：`integer`

                  該模態的權杖數量。


              **total_tool_use_tokens**：`integer`

              工具使用提示詞中存在的權杖數量。


            ??? note "**tool_use_tokens_by_modality**：`ModalityTokens array` 依模態細分的工具使用權杖用量。"


                ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                      可能的值：

                      - `text`：表示模型應傳回文字。
                      - `image`：表示模型應傳回圖片。
                      - `audio`：表示模型應傳回音訊。
                      - `video`：表示模型應傳回影片。
                      - `document`：表示模型應傳回文件。


                  **tokens**：`integer`

                  該模態的權杖數量。


              **total_thought_tokens**：`integer`

              思考模型的思考權杖數量。

              **total_tokens**：`integer`

              互動請求的權杖總數（提示詞 + 回應 + 其他內部權杖）。


            ??? note "**grounding_tool_count**：`GroundingToolCount array` 接地工具計數。"


                ??? note "**type**：`string enum` 與計數相關聯的接地工具類型。"


                      可能的值：

                      - `google_search`：使用 Google 網頁搜尋與圖片搜尋接地，以及 Web Grounding for Enterprise。
                      - `google_maps`：使用 Google 地圖接地。


                  **count**：`integer`

                  接地工具計數的數量。


      **範例**

      **步驟差異**

      ```json
      {
        "delta": {
          "type": "text",
          "text": "Hello"
        },
        "event_type": "step.delta",
        "index": 0
      }
      ```


??? note "**StepStart**"


      **index**：必填 `integer`


    ---


      **step**：必填 [`Step`](/api-reference/interactions-api/create-interaction/#Resource:Step)


    ---


      **event_type**：必填 `object`

      值：`step.start`


    ---


      **event_id**：`string`

      要用於從此事件恢復互動串流的 event_id 權杖。


      **範例**

      **步驟開始**

      ```json
      {
        "event_type": "step.start",
        "index": 0,
        "step": {
          "type": "model_output"
        }
      }
      ```


??? note "**StepStop**"


      **index**：必填 `integer`


    ---


      **event_type**：必填 `object`

      值：`step.stop`


    ---


    ??? note "**usage**：`Usage` 自工作階段開始以來的累計模型用量統計。"


          **total_input_tokens**：`integer`

          提示詞（上下文）中的權杖數量。

          **initial_input_tokens**：`integer`

          此次互動第一輪使用的輸入權杖數量。


        ??? note "**input_tokens_by_modality**：`ModalityTokens array` 依模態細分的輸入權杖用量。"


            ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                  可能的值：

                  - `text`：表示模型應傳回文字。
                  - `image`：表示模型應傳回圖片。
                  - `audio`：表示模型應傳回音訊。
                  - `video`：表示模型應傳回影片。
                  - `document`：表示模型應傳回文件。


              **tokens**：`integer`

              該模態的權杖數量。


          **total_cached_tokens**：`integer`

          提示詞中快取部分（快取內容）的權杖數量。


        ??? note "**cached_tokens_by_modality**：`ModalityTokens array` 依模態細分的快取權杖用量。"


            ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                  可能的值：

                  - `text`：表示模型應傳回文字。
                  - `image`：表示模型應傳回圖片。
                  - `audio`：表示模型應傳回音訊。
                  - `video`：表示模型應傳回影片。
                  - `document`：表示模型應傳回文件。


              **tokens**：`integer`

              該模態的權杖數量。


          **total_output_tokens**：`integer`

          所有產生的回應的權杖總數。


        ??? note "**output_tokens_by_modality**：`ModalityTokens array` 依模態細分的輸出權杖用量。"


            ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                  可能的值：

                  - `text`：表示模型應傳回文字。
                  - `image`：表示模型應傳回圖片。
                  - `audio`：表示模型應傳回音訊。
                  - `video`：表示模型應傳回影片。
                  - `document`：表示模型應傳回文件。


              **tokens**：`integer`

              該模態的權杖數量。


          **total_tool_use_tokens**：`integer`

          工具使用提示詞中存在的權杖數量。


        ??? note "**tool_use_tokens_by_modality**：`ModalityTokens array` 依模態細分的工具使用權杖用量。"


            ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                  可能的值：

                  - `text`：表示模型應傳回文字。
                  - `image`：表示模型應傳回圖片。
                  - `audio`：表示模型應傳回音訊。
                  - `video`：表示模型應傳回影片。
                  - `document`：表示模型應傳回文件。


              **tokens**：`integer`

              該模態的權杖數量。


          **total_thought_tokens**：`integer`

          思考模型的思考權杖數量。

          **total_tokens**：`integer`

          互動請求的權杖總數（提示詞 + 回應 + 其他內部權杖）。


        ??? note "**grounding_tool_count**：`GroundingToolCount array` 接地工具計數。"


            ??? note "**type**：`string enum` 與計數相關聯的接地工具類型。"


                  可能的值：

                  - `google_search`：使用 Google 網頁搜尋與圖片搜尋接地，以及 Web Grounding for Enterprise。
                  - `google_maps`：使用 Google 地圖接地。


              **count**：`integer`

              接地工具計數的數量。


    ---


    ??? note "**step_usage**：`Usage` 此特定步驟的模型用量統計。"


          **total_input_tokens**：`integer`

          提示詞（上下文）中的權杖數量。

          **initial_input_tokens**：`integer`

          此次互動第一輪使用的輸入權杖數量。


        ??? note "**input_tokens_by_modality**：`ModalityTokens array` 依模態細分的輸入權杖用量。"


            ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                  可能的值：

                  - `text`：表示模型應傳回文字。
                  - `image`：表示模型應傳回圖片。
                  - `audio`：表示模型應傳回音訊。
                  - `video`：表示模型應傳回影片。
                  - `document`：表示模型應傳回文件。


              **tokens**：`integer`

              該模態的權杖數量。


          **total_cached_tokens**：`integer`

          提示詞中快取部分（快取內容）的權杖數量。


        ??? note "**cached_tokens_by_modality**：`ModalityTokens array` 依模態細分的快取權杖用量。"


            ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                  可能的值：

                  - `text`：表示模型應傳回文字。
                  - `image`：表示模型應傳回圖片。
                  - `audio`：表示模型應傳回音訊。
                  - `video`：表示模型應傳回影片。
                  - `document`：表示模型應傳回文件。


              **tokens**：`integer`

              該模態的權杖數量。


          **total_output_tokens**：`integer`

          所有產生的回應的權杖總數。


        ??? note "**output_tokens_by_modality**：`ModalityTokens array` 依模態細分的輸出權杖用量。"


            ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                  可能的值：

                  - `text`：表示模型應傳回文字。
                  - `image`：表示模型應傳回圖片。
                  - `audio`：表示模型應傳回音訊。
                  - `video`：表示模型應傳回影片。
                  - `document`：表示模型應傳回文件。


              **tokens**：`integer`

              該模態的權杖數量。


          **total_tool_use_tokens**：`integer`

          工具使用提示詞中存在的權杖數量。


        ??? note "**tool_use_tokens_by_modality**：`ModalityTokens array` 依模態細分的工具使用權杖用量。"


            ??? note "**modality**：`ResponseModality` 與權杖數量相關聯的模態。"


                  可能的值：

                  - `text`：表示模型應傳回文字。
                  - `image`：表示模型應傳回圖片。
                  - `audio`：表示模型應傳回音訊。
                  - `video`：表示模型應傳回影片。
                  - `document`：表示模型應傳回文件。


              **tokens**：`integer`

              該模態的權杖數量。


          **total_thought_tokens**：`integer`

          思考模型的思考權杖數量。

          **total_tokens**：`integer`

          互動請求的權杖總數（提示詞 + 回應 + 其他內部權杖）。


        ??? note "**grounding_tool_count**：`GroundingToolCount array` 接地工具計數。"


            ??? note "**type**：`string enum` 與計數相關聯的接地工具類型。"


                  可能的值：

                  - `google_search`：使用 Google 網頁搜尋與圖片搜尋接地，以及 Web Grounding for Enterprise。
                  - `google_maps`：使用 Google 地圖接地。


              **count**：`integer`

              接地工具計數的數量。


    ---


      **event_id**：`string`

      要用於從此事件恢復互動串流的 event_id 權杖。


      **範例**

      **步驟停止**

      ```json
      {
        "event_type": "step.stop",
        "index": 0
      }
      ```





### ResponseFormat {#Resource:ResponseFormat}

**多型類型**：


??? note "**AudioResponseFormat**"

      音訊輸出格式的設定。




      **type**：必填 `object`

      值：`audio`



    ---




    ??? note "**mime_type**：`string enum` 音訊輸出的 MIME 類型。"

        可能的值：

        - `audio/mp3`：MP3 音訊格式。
        - `audio/ogg_opus`：OGG Opus 音訊格式。
        - `audio/l16`：原始 PCM（L16）音訊格式。
        - `audio/wav`：WAV 音訊格式。
        - `audio/alaw`：A-law 音訊格式。
        - `audio/mulaw`：Mu-law 音訊格式。





    ---




    ??? note "**delivery**：`string enum` 音訊輸出的傳遞模式。"

        可能的值：

        - `inline`：音訊資料以行內方式在回應中傳回。
        - `uri`：音訊資料以 URI 形式傳回。





    ---


      **sample_rate**：`integer`

      取樣率（Hz）。



    ---


      **bit_rate**：`integer`

      位元率（位元/秒，bps）。僅適用於壓縮格式（MP3、Opus）。






      **範例**

      **音訊輸出**

      ```json
      {
        "type": "audio",
        "sample_rate": 24000
      }
      ```



??? note "**ImageResponseFormat**"

      圖片輸出格式的設定。




      **type**：必填 `object`

      值：`image`



    ---




    ??? note "**mime_type**：`string enum` 圖片輸出的 MIME 類型。"

        可能的值：

        - `image/jpeg`：JPEG 圖片格式。





    ---




    ??? note "**delivery**：`string enum` 圖片輸出的傳遞模式。"

        可能的值：

        - `inline`：圖片資料以行內方式在回應中傳回。
        - `uri`：圖片資料以 URI 形式傳回。





    ---




    ??? note "**aspect_ratio**：`string enum` 圖片輸出的長寬比。"

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




    ??? note "**image_size**：`string enum` 圖片輸出的大小。"

        可能的值：

        - `512`：512px 圖片大小。
        - `1K`：1K 圖片大小。
        - `2K`：2K 圖片大小。
        - `4K`：4K 圖片大小。








      **範例**

      **圖片輸出**

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




      **type**：必填 `object`

      值：`text`



    ---




    ??? note "**mime_type**：`string enum` 文字輸出的 MIME 類型。"

        可能的值：

        - `application/json`：JSON 輸出格式。
        - `text/plain`：純文字輸出格式。





    ---


      **schema**：`object`

      輸出應符合的 JSON 架構。僅在 mime_type 為 application/json 時適用。支援 JSON Schema 的子集。`minLength`、`maxLength`、`minProperties`、`maxProperties`、`uniqueItems`、`contains`、`minContains` 與 `maxContains` 會被忽略且不強制執行；請在您的應用程式中驗證這些項目。`minItems` 與 `maxItems` 會強制執行。過於複雜而無法強制執行的架構（例如巢狀陣列上的大型 `maxItems`）會傳回 400 INVALID_ARGUMENT 錯誤。






      **範例**

      **文字輸出（JSON Schema）**

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




      **type**：必填 `object`

      值：`video`



    ---




    ??? note "**delivery**：`string enum` 影片輸出的傳遞模式。"

        可能的值：

        - `inline`：影片資料以行內方式在回應中傳回。
        - `uri`：影片資料以 URI 形式傳回。





    ---




    ??? note "**aspect_ratio**：`string enum` 影片輸出的長寬比。"

        可能的值：

        - `16:9`：16:9 長寬比。
        - `9:16`：9:16 長寬比。





    ---


      **duration**：`string`

      影片輸出的長度。



    ---




    ??? note "**resolution**：`string enum` 影片輸出解析度。預設為 720p。"

        可能的值：

        - `360p`：360p 解析度。
        - `720p`：720p 解析度。
        - `1080p`：1080p 解析度。
        - `4k`：4K 解析度。








      **範例**

      **影片輸出**

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






    ??? note "**arguments**：必填 `CodeExecutionCallStepArguments` 要傳遞給程式碼執行的引數。"

        ??? note "**language**：`string enum` `code` 的程式語言。"

            可能的值：

            - `python`：Python >= 3.10，可使用 numpy 與 simpy。
            - `bash`：Bash。僅適用於 Gemini 3.0 以上模型。



          **code**：`string`

          要執行的程式碼。





    ---


      **id**：必填 `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**：必填 `object`

      值：`code_execution_call`



    ---


      **signature**：`string`

      用於後端驗證的簽章雜湊。






      **範例**

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






    ??? note "**result**：必填 [`Content`](/api-reference/interactions-api/create-interaction/#Resource:Content) `array` 或 `string` 程式碼執行的輸出。"

          **可能的類型**： 



        ??? note "**[Content](/api-reference/interactions-api/create-interaction/#Resource:Content) array**"

            清單的內容。





        ??? note "**string**"

            直接的字串值。





    ---


      **call_id**：必填 `string`

      用於對應函式呼叫區塊中 ID 的 ID。



    ---


      **type**：必填 `object`

      值：`code_execution_result`



    ---


      **is_error**：`boolean`

      程式碼執行是否產生錯誤。



    ---


      **signature**：`string`

      用於後端驗證的簽章雜湊。






      **範例**

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




      **id**：必填 `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**：必填 `object`

      值：`file_search_call`



    ---


      **signature**：`string`

      用於後端驗證的簽章雜湊。






      **範例**

      **FileSearchCallStep**

      ```json
      {
        "type": "file_search_call",
        "id": "file_call_88192"
      }
      ```



??? note "**FileSearchResultStep**"

      File Search 結果步驟。




      **call_id**：必填 `string`

      用於對應函式呼叫區塊中 ID 的 ID。



    ---


      **type**：必填 `object`

      值：`file_search_result`



    ---


      **signature**：`string`

      用於後端驗證的簽章雜湊。






      **範例**

      **FileSearchResultStep**

      ```json
      {
        "type": "file_search_result",
        "call_id": "file_call_88192"
      }
      ```



??? note "**FunctionCallStep**"

      函式工具呼叫步驟。




      **name**：必填 `string`

      要呼叫的工具名稱。



    ---


      **arguments**：必填 `object`

      要傳遞給函式的引數。



    ---


      **id**：必填 `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**：必填 `object`

      值：`function_call`






      **範例**

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






    ??? note "**result**：必填 `(`[`ImageContent`](/api-reference/interactions-api/create-interaction/#Resource:ImageContent) 或 [`TextContent`](/api-reference/interactions-api/create-interaction/#Resource:TextContent)`) array` 或 `object` 或 `string` 工具呼叫的結果。"

          **可能的類型**： 



        ??? note "**([ImageContent](/api-reference/interactions-api/create-interaction/#Resource:ImageContent) 或 [TextContent](/api-reference/interactions-api/create-interaction/#Resource:TextContent)) array**"

            每個項目為下列其中之一的清單：[`ImageContent`](/api-reference/interactions-api/create-interaction/#Resource:ImageContent)、[`TextContent`](/api-reference/interactions-api/create-interaction/#Resource:TextContent)。





        ??? note "**string**"

            直接的字串值。





    ---


      **call_id**：必填 `string`

      用於對應函式呼叫區塊中 ID 的 ID。



    ---


      **type**：必填 `object`

      值：`function_result`



    ---


      **name**：`string`

      被呼叫的工具名稱。



    ---


      **is_error**：`boolean`

      工具呼叫是否產生錯誤。






      **範例**

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

      Google 地圖呼叫步驟。




      **id**：必填 `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**：必填 `object`

      值：`google_maps_call`



    ---




    ??? note "**arguments**：`GoogleMapsCallStepArguments` 要傳遞給 Google 地圖工具的引數。"

        **queries**：`string array`

        要執行的查詢。





    ---


      **signature**：`string`

      用於後端驗證的簽章雜湊。






      **範例**

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

      Google 地圖結果步驟。






    ??? note "**result**：必填 `GoogleMapsResultItem array`"

        ??? note "**places**：`GoogleMapsResultPlaces array`"

              **place_id**：`string`

              **name**：`string`

              **url**：`string`



            ??? note "**review_snippets**：`ReviewSnippet array`"

                **title**：`string`

                評論的標題。

                **url**：`string`

                對應至 Google 地圖上使用者評論的連結。

                **review_id**：`string`

                評論片段的 ID。



          **widget_context_token**：`string`





    ---


      **call_id**：必填 `string`

      用於對應函式呼叫區塊中 ID 的 ID。



    ---


      **type**：必填 `object`

      值：`google_maps_result`



    ---


      **signature**：`string`

      用於後端驗證的簽章雜湊。






      **範例**

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

      Google 搜尋呼叫步驟。






    ??? note "**arguments**：必填 `GoogleSearchCallStepArguments` 要傳遞給 Google 搜尋的引數。"

        **queries**：`string array`

        後續網頁搜尋的網頁搜尋查詢。





    ---


      **id**：必填 `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**：必填 `object`

      值：`google_search_call`



    ---




    ??? note "**search_type**：`string enum` 啟用的搜尋接地類型。"

        可能的值：

        - `web_search`：設定此欄位可啟用網頁搜尋。僅傳回文字結果。
        - `image_search`：設定此欄位可啟用圖片搜尋。傳回圖片位元組。





    ---


      **signature**：`string`

      用於後端驗證的簽章雜湊。






      **範例**

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

      Google 搜尋結果步驟。






    ??? note "**result**：必填 `GoogleSearchResultItem array` Google 搜尋的結果。"

        **search_suggestions**：`string`

        可嵌入網頁或應用程式 webview 的網頁內容片段。





    ---


      **call_id**：必填 `string`

      用於對應函式呼叫區塊中 ID 的 ID。



    ---


      **type**：必填 `object`

      值：`google_search_result`



    ---


      **is_error**：`boolean`

      Google 搜尋是否產生錯誤。



    ---


      **signature**：`string`

      用於後端驗證的簽章雜湊。






      **範例**

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




      **name**：必填 `string`

      被呼叫的工具名稱。



    ---


      **server_name**：必填 `string`

      所使用的 MCP 伺服器名稱。



    ---


      **arguments**：必填 `object`

      函式引數的 JSON 物件。



    ---


      **id**：必填 `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**：必填 `object`

      值：`mcp_server_tool_call`






      **範例**

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






    ??? note "**result**：必填 `(`[`ImageContent`](/api-reference/interactions-api/create-interaction/#Resource:ImageContent) 或 [`TextContent`](/api-reference/interactions-api/create-interaction/#Resource:TextContent)`) array` 或 `object` 或 `string` MCP 伺服器呼叫的輸出。可以是簡單文字或豐富內容。"

          **可能的類型**： 



        ??? note "**([ImageContent](/api-reference/interactions-api/create-interaction/#Resource:ImageContent) 或 [TextContent](/api-reference/interactions-api/create-interaction/#Resource:TextContent)) array**"

            每個項目為下列其中之一的清單：[`ImageContent`](/api-reference/interactions-api/create-interaction/#Resource:ImageContent)、[`TextContent`](/api-reference/interactions-api/create-interaction/#Resource:TextContent)。





        ??? note "**string**"

            直接的字串值。





    ---


      **call_id**：必填 `string`

      用於對應函式呼叫區塊中 ID 的 ID。



    ---


      **type**：必填 `object`

      值：`mcp_server_tool_result`



    ---


      **name**：`string`

      此特定工具呼叫所呼叫的工具名稱。



    ---


      **server_name**：`string`

      所使用的 MCP 伺服器名稱。






      **範例**

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

      模型產生的輸出。




      **type**：必填 `object`

      值：`model_output`



    ---


      **content**：[`Content`](/api-reference/interactions-api/create-interaction/#Resource:Content) `array`






      **範例**

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

      由伺服器發起、用於媒體分析（例如影片理解）的處理步驟。


      **id**：必填 `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**：必填 `object`

      值：`processing_call`



    ---


      **signature**：`string`

      用於後端驗證的簽章雜湊。



??? note "**ProcessingResultStep**"

      由伺服器發起之媒體處理步驟的結果。


      **call_id**：必填 `string`

      用於對應函式呼叫區塊中 ID 的 ID。



    ---


      **type**：必填 `object`

      值：`processing_result`



    ---


      **signature**：`string`

      用於後端驗證的簽章雜湊。



??? note "**ThoughtStep**"

      思考步驟。




      **type**：必填 `object`

      值：`thought`



    ---


      **signature**：`string`

      用於後端驗證的簽章雜湊。



    ---


      **summary**：[`Content`](/api-reference/interactions-api/create-interaction/#Resource:Content) `array`

      思考的摘要。






      **範例**

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






    ??? note "**arguments**：必填 `UrlContextCallArguments` 要傳遞給 URL 上下文的引數。"

        **urls**：`string array`

        要擷取的 URL。





    ---


      **id**：必填 `string`

      此特定工具呼叫的唯一 ID。



    ---


      **type**：必填 `object`

      值：`url_context_call`



    ---


      **signature**：`string`

      用於後端驗證的簽章雜湊。






      **範例**

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






    ??? note "**result**：必填 `UrlContextResult array` URL 上下文的結果。"

          **url**：`string`

          已擷取的 URL。



        ??? note "**status**：`string enum` URL 擷取的狀態。"

            可能的值：

            - `success`：URL 擷取成功。
            - `error`：URL 擷取因錯誤而失敗。
            - `paywall`：URL 擷取失敗，因為內容位於付費牆之後。
            - `unsafe`：URL 擷取失敗，因為內容不安全。





    ---


      **call_id**：必填 `string`

      用於對應函式呼叫區塊中 ID 的 ID。



    ---


      **type**：必填 `object`

      值：`url_context_result`



    ---


      **is_error**：`boolean`

      URL 上下文是否產生錯誤。



    ---


      **signature**：`string`

      用於後端驗證的簽章雜湊。






      **範例**

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




      **type**：必填 `object`

      值：`user_input`



    ---


      **content**：[`Content`](/api-reference/interactions-api/create-interaction/#Resource:Content) `array`






      **範例**

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

  
  **type**：必填 `object`

  值：`remote`

  

---


  

??? note "**sources**：`Source array`"

    ??? note "**type**：`string enum`"

        可能的值：

        - `gcs`：Cloud Storage 值區。
        - `inline`：行內內容。
        - `repository`：一般儲存庫。來源 URL 中的通訊協定前綴可識別提供者（例如 github://、gcs://）。



      **source**：`string`

      環境的來源。對 Cloud Storage 而言，這是 Cloud Storage 路徑；對 GitHub 而言，這是 GitHub 路徑。

      **target**：`string`

      來源在環境中應出現的位置。

      **content**：`string`

      當 `type` 為 `INLINE` 時的行內內容。

      **encoding**：`string`

      行內內容的選用編碼（例如 `base64`）。



  

---


  

??? note "**network**：[`EnvironmentNetworkEgressAllowlist`](/api-reference/interactions-api/create-interaction/#Resource:EnvironmentNetworkEgressAllowlist) 或 `string enum` 環境的網路設定。"

      **可能的類型**： 



    ??? note "**[EnvironmentNetworkEgressAllowlist](/api-reference/interactions-api/create-interaction/#Resource:EnvironmentNetworkEgressAllowlist)**"

          環境的網路輸出設定。



        ??? note "**allowlist**：`EgressRule array` 或 `string enum` 允許的網域及其設定清單。設為 `"disabled"` 可封鎖所有網路輸出。"

              **可能的類型**： 



            ??? note "**EgressRule array**"

                單一網域允許清單規則，可選用標頭注入。

                **domain**：必填 `string`

                允許向外請求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

                **transform**：`object`

                要注入符合此規則之請求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

                **credential**：`string`

                選用。以 ID 參照伺服器管理的 Credential 資源。





            ??? note "**string enum**"

                可能的值：

                - `disabled`：所有網路輸出皆被封鎖。





    ??? note "**string enum**"

        可能的值：

        - `disabled`：所有網路輸出皆被封鎖。



  

---


  **environment_id**：`string`

  選用。互動的環境 ID。若指定，請求將更新既有環境，而非建立新環境。

  

---


  

??? note "**env**：`object` 或 `string` 要在沙箱環境中設定的環境變數。"

      **可能的類型**： 



    ??? note "**string**"

        直接的字串值。



  

---


  

??? note "**mode**：`string enum` 此環境的運算生命週期模式。"

    可能的值：

    - `on_demand`：此環境的運算生命週期模式。
    - `self_hosted`：此環境的運算生命週期模式。



  

---


  **custom_config**：`object`

  選用。任意由客戶定義的 JSON 設定，會透傳至自行託管環境的輪詢器。僅在 `mode` 為 `SELF_HOSTED` 時支援。

  

  

  
  **範例**

  
=== "行內來源"

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

=== "網路允許清單"

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

  
  

??? note "**allowlist**：`EgressRule array` 或 `string enum` 允許的網域及其設定清單。設為 `"disabled"` 可封鎖所有網路輸出。"

      **可能的類型**： 



    ??? note "**EgressRule array**"

        單一網域允許清單規則，可選用標頭注入。

        **domain**：必填 `string`

        允許向外請求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

        **transform**：`object`

        要注入符合此規則之請求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

        **credential**：`string`

        選用。以 ID 參照伺服器管理的 Credential 資源。





    ??? note "**string enum**"

        可能的值：

        - `disabled`：所有網路輸出皆被封鎖。



  

  

  
  **範例**

  **網路允許清單**

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

  
  

??? note "**allowed_tools**：`AllowedTools` 允許的工具。"

    ??? note "**mode**：`string enum` 工具選擇的模式。"

        可能的值：

        - `auto`：自動工具選擇。
        - `any`：任意工具選擇。
        - `none`：不使用工具選擇。
        - `validated`：經驗證的工具選擇。



      **tools**：`string array`

      允許工具的名稱。



  

  

  
  **範例**

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

  
  **type**：必填 `object`

  值：`image`

  

---


  **data**：`string`

  圖片內容。

  

---


  **uri**：`string`

  圖片的 URI。

  

---


  

??? note "**resolution**：`MediaResolution` 媒體的解析度。"

    可能的值：

    - `low`：低解析度。
    - `medium`：中解析度。
    - `high`：高解析度。
    - `ultra_high`：超高解析度。



  

---


  

??? note "**mime_type**：`string enum` 圖片的 MIME 類型。"

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

  
  **text**：必填 `string`

  文字內容。

  

---


  **type**：必填 `object`

  值：`text`

  

---


  

??? note "**annotations**：`Annotation array` 模型產生內容的引用資訊。"

      **可能的類型**： 



    ??? note "**FileCitation**"

        檔案引用註釋。

        **type**：必填 `object`

        值：`file_citation`

        **document_uri**：`string`

        檔案的 URI。

        **file_name**：`string`

        檔案的名稱。

        **source**：`string`

        文字某部分所歸屬的來源。

        **custom_metadata**：`object`

        使用者提供的、關於擷取上下文的中繼資料。

        **page_number**：`integer`

        被引用文件的頁碼（如適用）。

        **media_id**：`string`

        圖片引用時的媒體 ID（如適用）。

        **start_index**：`integer`

        回應中歸屬此來源之區段的起始位置。索引表示區段的起始，以位元組為單位。

        **end_index**：`integer`

        歸屬區段的結束位置（不含該位置）。





    ??? note "**PlaceCitation**"

          地點引用註釋。

          **type**：必填 `object`

          值：`place_citation`

          **place_id**：`string`

          地點的 ID，格式為 `places/{place_id}`。

          **name**：`string`

          地點的標題。

          **url**：`string`

          地點的 URI 參照。



        ??? note "**review_snippets**：`ReviewSnippet array` 用於產生 Google 地圖中特定地點特色相關回答的評論片段。"

            **title**：`string`

            評論的標題。

            **url**：`string`

            對應至 Google 地圖上使用者評論的連結。

            **review_id**：`string`

            評論片段的 ID。



          **start_index**：`integer`

          回應中歸屬此來源之區段的起始位置。索引表示區段的起始，以位元組為單位。

          **end_index**：`integer`

          歸屬區段的結束位置（不含該位置）。





    ??? note "**SpeechAnnotation**"

        文字內容的語音註釋。

        **type**：必填 `object`

        值：`speech_metadata`

        **speaker**：`string`

        要與此輪次關聯的講者。

        **style**：`string`

        語音合成的風格指令。

        **start_index**：`integer`

        回應中歸屬此來源之區段的起始位置。索引表示區段的起始，以位元組為單位。

        **end_index**：`integer`

        歸屬區段的結束位置（不含該位置）。





    ??? note "**UrlCitation**"

        URL 引用註釋。

        **type**：必填 `object`

        值：`url_citation`

        **url**：`string`

        URL。

        **title**：`string`

        URL 的標題。

        **start_index**：`integer`

        回應中歸屬此來源之區段的起始位置。索引表示區段的起始，以位元組為單位。

        **end_index**：`integer`

        歸屬區段的結束位置（不含該位置）。





    ??? note "**WordInfo**"

        轉錄輸出的單字級 ASR 註釋。包含單字文字、選用的時間資訊與選用的講者歸屬。

        **type**：必填 `object`

        值：`word_info`

        **text**：`string`

        轉錄出的單字。

        **start_offset**：`string`

        單字相對於音訊起始的時間起始偏移。當 timestamp_granularities 包含 "word" 時出現。

        **end_offset**：`string`

        單字相對於音訊起始的時間結束偏移。當 timestamp_granularities 包含 "word" 時出現。

        **speaker**：`string`

        選用。此單字的講者標籤（例如 "spk_1"、"spk_2"）。當 TranscriptionConfig 中設定了 diarization_mode 時出現。

        **start_index**：`integer`

        回應中歸屬此來源之區段的起始位置。索引表示區段的起始，以位元組為單位。

        **end_index**：`integer`

        歸屬區段的結束位置（不含該位置）。



  

  

  
  **範例**

  **文字**

  ```json
  {
    "type": "text",
    "text": "Hello, how are you?"
  }
  ```
