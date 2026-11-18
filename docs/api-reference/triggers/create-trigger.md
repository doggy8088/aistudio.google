# 建立觸發器


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 之下。


`POST` `https://generativelanguage.googleapis.com/v1beta/triggers`

建立新的觸發器，依指定的 cron 排程呼叫指定的代理。


  
## 請求主體 {#request-body}

  
  **schedule**：必填 `string`

  觸發器應執行的 cron 排程。使用標準 cron 格式。

  

---


  **time_zone**：必填 `string`

  解讀排程時所依據的時區。

  

---


  

??? note "**interaction**：必填 `CreateAgentInteractionParams` 要執行的互動請求範本。"

    ??? note "**agent**：必填 `AgentOption` 用來產生互動的 `Agent` 名稱。"

        可能的值：

        - `deep-research-preview-04-2026`: Gemini Deep Research Agent
        - `deep-research-max-preview-04-2026`: Gemini Deep Research Max Agent
        - `antigravity-preview-05-2026`: 使用 Antigravity 受管理代理執行需要推理、檔案操作與工具使用的多步驟工作。
        - `antigravity-preview-09-2026`: 使用 Antigravity 受管理代理執行需要推理、檔案操作與工具使用的多步驟工作。



      **input**：必填 `Content` or `Content array` or `Step array` or `string`

      互動的輸入內容。



    ??? note "**agent_config**: `AntigravityAgentConfig` or `DeepResearchAgentConfig` or `DynamicAgentConfig` 代理互動的設定參數。"

          **可能類型**： 



        ??? note "**AntigravityAgentConfig**"

            Antigravity 代理執行階段的設定。可在伺服器端控制代理的執行環境與工具設定。

            **type**：必填 `object`

            值：`antigravity`

            **model**: `string`

            代理推理所使用的模型。

            **max_total_tokens**: `string`

            代理執行期間的權杖總數上限。





        ??? note "**DeepResearchAgentConfig**"

              Deep Research 代理的設定。

              **type**：必填 `object`

              值：`deep-research`



            ??? note "**thinking_summaries**: `ThinkingSummaries` 是否在回應中納入思考摘要。"

                可能的值：

                - `auto`: 自動產生思考摘要。
                - `none`: 不產生思考摘要。





            ??? note "**visualization**: `string enum` 是否在回應中納入視覺化內容。"

                可能的值：

                - `off`: 不納入視覺化內容。
                - `auto`: 自動納入視覺化內容。



              **collaborative_planning**: `boolean`

              為 Deep Research 代理啟用人機協作規劃。設為 true 時，Deep Research 代理會在回應中提供研究計畫；只有使用者在下一輪確認該計畫後，代理才會繼續執行。





        ??? note "**DynamicAgentConfig**"

            動態代理的設定。

            **type**：必填 `object`

            值：`dynamic`



      **id**: `string`

      必填。僅供輸出。互動完成的唯一識別碼。



    ??? note "**status**: `string enum` 必填。僅供輸出。互動的狀態。"

        可能的值：

        - `in_progress`: 互動進行中。
        - `requires_action`: 互動需要使用者採取動作或提供輸入。
        - `completed`: 互動已完成。
        - `failed`: 互動失敗。
        - `cancelled`: 互動已取消。
        - `incomplete`: 互動已完成，但結果不完整（例如達到 max_tokens 上限）。
        - `requires_continuation`: 互動至少還需要一次請求才能完成。下一個請求應將 continuation_token 設為此請求回傳的值。



      **created**: `string`

      必填。僅供輸出。回應建立的時間，採用 ISO 8601 格式（YYYY-MM-DDThh:mm:ssZ）。

      **updated**: `string`

      必填。僅供輸出。回應最後更新的時間，採用 ISO 8601 格式（YYYY-MM-DDThh:mm:ssZ）。

      **system_instruction**: `string`

      互動的系統指令。



    ??? note "**tools**: `Tool array` 模型在互動期間可呼叫的工具宣告清單。"

          **可能類型**： 



        ??? note "**CodeExecution**"

            模型可用來執行程式碼的工具。

            **type**：必填 `object`

            值：`code_execution`





        ??? note "**ComputerUse**"

              模型可用來與電腦互動的工具。

              **type**：必填 `object`

              值：`computer_use`



            ??? note "**environment**: `string enum` 所操作的環境。"

                可能的值：

                - `browser`: 在網頁瀏覽器中操作。
                - `mobile`: 在行動環境中操作。
                - `desktop`: 在桌面環境中操作。



              **excluded_predefined_functions**: `string array`

              從模型呼叫中排除的預先定義函式清單。

              **enable_prompt_injection_detection**: `boolean`

              是否對電腦使用請求啟用提示詞注入偵測檢查。



            ??? note "**disabled_safety_policies**: `string enum array` 選填。電腦使用已停用的安全政策。"

                可能的值：

                - `financial_transactions`: 金融交易的安全政策。
                - `sensitive_data_modification`: 敏感資料修改的安全政策。
                - `communication_tool`: 通訊工具（例如 Gmail、Chat、Meet）的安全政策。
                - `account_creation`: 帳號建立的安全政策。
                - `data_modification`: 資料修改的安全政策。
                - `user_consent_management`: 使用者同意管理的安全政策。
                - `legal_terms_and_agreements`: 法律條款與協議的安全政策。





        ??? note "**FileSearch**"

            模型可用來搜尋檔案的工具。

            **type**：必填 `object`

            值：`file_search`

            **file_search_store_names**: `string array`

            要搜尋的檔案搜尋儲存庫名稱。

            **top_k**: `integer`

            要擷取的語意擷取區塊數量。

            **metadata_filter**: `string`

            套用於語意擷取文件與區塊的中繼資料篩選條件。





        ??? note "**Function**"

            模型可使用的工具。

            **type**：必填 `object`

            值：`function`

            **name**: `string`

            函式的名稱。

            **description**: `string`

            函式的說明。

            **parameters**: `object`

            函式參數的 JSON Schema。僅支援 JSON Schema 的子集。`minLength`、`maxLength`、`minProperties`、`maxProperties`、`uniqueItems`、`contains`、`minContains` 與 `maxContains` 會被忽略且不強制執行。





        ??? note "**GoogleMaps**"

            模型可用來呼叫 Google Maps 的工具。

            **type**：必填 `object`

            值：`google_maps`

            **enable_widget**: `boolean`

            是否在回應的工具呼叫結果中回傳 widget 上下文權杖。

            **latitude**: `number`

            使用者所在位置的緯度。

            **longitude**: `number`

            使用者所在位置的經度。





        ??? note "**GoogleSearch**"

              模型可用來搜尋 Google 的工具。

              **type**：必填 `object`

              值：`google_search`



            ??? note "**search_types**: `string enum array` 要啟用的搜尋接地類型。"

                可能的值：

                - `web_search`: 設定此欄位可啟用網頁搜尋。僅回傳文字結果。
                - `image_search`: 設定此欄位可啟用圖片搜尋。會回傳圖片位元組。





        ??? note "**McpServer**"

              MCPServer 是可由模型呼叫以執行動作的伺服器。

              **type**：必填 `object`

              值：`mcp_server`

              **name**: `string`

              MCPServer 的名稱。

              **url**: `string`

              MCPServer 端點的完整 URL。範例："https://api.example.com/mcp"

              **headers**: `object`

              選填：如有需要，可填入驗證標頭、逾時等欄位。



            ??? note "**allowed_tools**: `AllowedTools array` 允許的工具。"

                ??? note "**mode**: `string enum` 工具選擇的模式。"

                    可能的值：

                    - `auto`: 自動工具選擇。
                    - `any`: 任一工具選擇。
                    - `none`: 不選擇工具。
                    - `validated`: 已驗證的工具選擇。



                  **tools**: `string array`

                  允許的工具名稱。





        ??? note "**UrlContext**"

            模型可用來擷取 URL 上下文的工具。

            **type**：必填 `object`

            值：`url_context`





    ??? note "**response_format**: `ResponseFormat` or `ResponseFormat array` 強制產生的回應為符合此欄位所指定 JSON schema 的 JSON 物件。"

          **可能類型**： 



        ??? note "**AudioResponseFormat**"

              音訊輸出格式的設定。

              **type**：必填 `object`

              值：`audio`



            ??? note "**mime_type**: `string enum` 音訊輸出的 MIME 類型。"

                可能的值：

                - `audio/mp3`: MP3 音訊格式。
                - `audio/ogg_opus`: OGG Opus 音訊格式。
                - `audio/l16`: 原始 PCM（L16）音訊格式。
                - `audio/wav`: WAV 音訊格式。
                - `audio/alaw`: A-law 音訊格式。
                - `audio/mulaw`: Mu-law 音訊格式。





            ??? note "**delivery**: `string enum` 音訊輸出的傳遞模式。"

                可能的值：

                - `inline`: 音訊資料以行內方式在回應中回傳。
                - `uri`: 音訊資料以 URI 形式回傳。



              **sample_rate**: `integer`

              取樣率，單位為 Hz。

              **bit_rate**: `integer`

              位元率，單位為每秒位元數（bps）。僅適用於壓縮格式（MP3、Opus）。





        ??? note "**ImageResponseFormat**"

              圖片輸出格式的設定。

              **type**：必填 `object`

              值：`image`



            ??? note "**mime_type**: `string enum` 圖片輸出的 MIME 類型。"

                可能的值：

                - `image/jpeg`: JPEG 圖片格式。





            ??? note "**delivery**: `string enum` 圖片輸出的傳遞模式。"

                可能的值：

                - `inline`: 圖片資料以行內方式在回應中回傳。
                - `uri`: 圖片資料以 URI 形式回傳。





            ??? note "**aspect_ratio**: `string enum` 圖片輸出的長寬比。"

                可能的值：

                - `1:1`: 1:1 長寬比。
                - `2:3`: 2:3 長寬比。
                - `3:2`: 3:2 長寬比。
                - `3:4`: 3:4 長寬比。
                - `4:3`: 4:3 長寬比。
                - `4:5`: 4:5 長寬比。
                - `5:4`: 5:4 長寬比。
                - `9:16`: 9:16 長寬比。
                - `16:9`: 16:9 長寬比。
                - `21:9`: 21:9 長寬比。
                - `1:8`: 1:8 長寬比。
                - `8:1`: 8:1 長寬比。
                - `1:4`: 1:4 長寬比。
                - `4:1`: 4:1 長寬比。





            ??? note "**image_size**: `string enum` 圖片輸出的大小。"

                可能的值：

                - `512`: 512px 圖片大小。
                - `1K`: 1K 圖片大小。
                - `2K`: 2K 圖片大小。
                - `4K`: 4K 圖片大小。





        ??? note "**TextResponseFormat**"

              文字輸出格式的設定。

              **type**：必填 `object`

              值：`text`



            ??? note "**mime_type**: `string enum` 文字輸出的 MIME 類型。"

                可能的值：

                - `application/json`: JSON 輸出格式。
                - `text/plain`: 純文字輸出格式。



              **schema**: `object`

              輸出應符合的 JSON schema。僅在 mime_type 為 application/json 時適用。僅支援 JSON Schema 的子集。`minLength`、`maxLength`、`minProperties`、`maxProperties`、`uniqueItems`、`contains`、`minContains` 與 `maxContains` 會被忽略且不強制執行；請在您的應用程式中自行驗證。`minItems` 與 `maxItems` 會強制執行。過於複雜而無法強制執行的 schema（例如巢狀陣列上的大型 `maxItems`）會回傳 400 INVALID_ARGUMENT 錯誤。





        ??? note "**VideoResponseFormat**"

              影片輸出格式的設定。

              **type**：必填 `object`

              值：`video`



            ??? note "**delivery**: `string enum` 影片輸出的傳遞模式。"

                可能的值：

                - `inline`: 影片資料以行內方式在回應中回傳。
                - `uri`: 影片資料以 URI 形式回傳。





            ??? note "**aspect_ratio**: `string enum` 影片輸出的長寬比。"

                可能的值：

                - `16:9`: 16:9 長寬比。
                - `9:16`: 9:16 長寬比。



              **duration**: `string`

              影片輸出的長度。



            ??? note "**resolution**: `string enum` 影片輸出的解析度。預設為 720p。"

                可能的值：

                - `360p`: 360p 解析度。
                - `720p`: 720p 解析度。
                - `1080p`: 1080p 解析度。
                - `4k`: 4K 解析度。





        ??? note "**ResponseFormat array**"

            清單中的每個項目為下列其中之一： `AudioResponseFormat`, `ImageResponseFormat`, `TextResponseFormat`, `VideoResponseFormat`.



      **previous_interaction_id**: `string`

      前一次互動的 ID（如有）。



    ??? note "**environment**: `EnvironmentConfig` or `string` 互動的環境設定。可以是指定遠端環境來源的物件，或是參照既有環境 ID 的字串。"

          **可能類型**： 



        ??? note "**EnvironmentConfig**"

              自訂環境的設定。

              **type**：必填 `object`

              值：`remote`



            ??? note "**sources**: `Source array`"

                ??? note "**type**: `string enum`"

                    可能的值：

                    - `gcs`: Cloud Storage 值區。
                    - `inline`: 行內內容。
                    - `repository`: 一般儲存庫。來源 URL 中的通訊協定前綴可識別提供者（例如 github://、gcs://）。



                  **source**: `string`

                  環境的來源。對 Cloud Storage 而言，這是 Cloud Storage 路徑；對 GitHub 而言，這是 GitHub 路徑。

                  **target**: `string`

                  來源在環境中應出現的位置。

                  **content**: `string`

                  當 `type` 為 `INLINE` 時的行內內容。

                  **encoding**: `string`

                  行內內容的選填編碼（例如 `base64`）。





            ??? note "**network**: `EnvironmentNetworkEgressAllowlist` or `string enum` 環境的網路設定。"

                  **可能類型**： 



                ??? note "**EnvironmentNetworkEgressAllowlist**"

                      環境的網路輸出設定。



                    ??? note "**allowlist**: `EgressRule array` or `string enum` 允許的網域及其設定清單。設為 `"disabled"` 可封鎖所有網路輸出。"

                          **可能類型**： 



                        ??? note "**EgressRule array**"

                            單一網域允許清單規則，可選擇性注入標頭。

                            **domain**：必填 `string`

                            允許傳送輸出請求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

                            **transform**: `object`

                            要注入符合此規則之請求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

                            **credential**: `string`

                            選填。以 ID 參照伺服器管理的 Credential 資源。





                        ??? note "**string enum**"

                            可能的值：

                            - `disabled`: 所有網路輸出皆被封鎖。





                ??? note "**string enum**"

                    可能的值：

                    - `disabled`: 所有網路輸出皆被封鎖。



              **environment_id**: `string`

              選填。互動的環境 ID。指定後，請求會更新既有環境，而非建立新環境。



            ??? note "**env**: `object` or `string` 要在沙箱環境中設定的環境變數。"

                  **可能類型**： 



                ??? note "**string**"

                    直接的字串值。





            ??? note "**mode**: `string enum` 此環境的運算生命週期模式。"

                可能的值：

                - `on_demand`: 此環境的運算生命週期模式。
                - `self_hosted`: 此環境的運算生命週期模式。



              **custom_config**: `object`

              選填。由客戶自訂的任意 JSON 設定，會直接傳遞給自行託管環境的輪詢器。僅在 `mode` 為 `SELF_HOSTED` 時支援。





        ??? note "**string**"

            直接的字串值。



      **environment_id**: `string`

      僅供輸出。互動的環境 ID。僅在請求中設定了環境設定時才會填入。



    ??? note "**service_tier**: `ServiceTier` 互動的服務層級。"

        可能的值：

        - `flex`: Flex 服務層級。
        - `standard`: Standard 服務層級。
        - `priority`: Priority 服務層級。





    ??? note "**webhook_config**: `WebhookConfig` 選填。用於在互動完成時接收通知的 webhook 設定。"

        **uris**: `string array`

        選填。設定後，webhook 事件將使用這些 webhook URI，而非已註冊的 webhook。

        **user_metadata**: `object`

        選填。每次向 webhook 發送事件時一併回傳的使用者中繼資料。





    ??? note "**safety_settings**: `SafetySetting array` 互動的安全設定。"

        ??? note "**type**：必填 `HarmCategory` 要封鎖的危害類別類型。"

            可能的值：

            - `hate_speech`: 基於特定屬性宣揚暴力或煽動對個人或群體仇恨的內容。
            - `dangerous_content`: 宣揚、協助或促成危險活動的內容。
            - `harassment`: 辱罵、威脅，或意圖霸凌、折磨或嘲弄他人的內容。
            - `sexually_explicit`: 含有露骨性內容的資料。
            - `jailbreak`: 旨在繞過安全篩選器的提示詞。





        ??? note "**threshold**：必填 `string enum` 封鎖內容的閾值。若危害機率超過此閾值，內容將被封鎖。"

            可能的值：

            - `block_low_and_above`: 封鎖危害機率為低或更高的內容。
            - `block_medium_and_above`: 封鎖危害機率為中或更高的內容。
            - `block_only_high`: 封鎖危害機率為高的內容。
            - `off`: 完全關閉安全篩選器。





        ??? note "**method**: `string enum` 選填。封鎖內容的方法。未指定時，預設行為是使用機率分數。"

            可能的值：

            - `severity`: 危害封鎖方法同時使用機率與嚴重程度分數。
            - `probability`: 危害封鎖方法使用機率分數。



      **labels**: `object`

      請求的標籤，含有使用者定義的中繼資料。標籤鍵與值的長度不得超過 63 個字元（Unicode 字碼點），且只能包含小寫字母、數字字元、底線與連字號。允許使用國際字元。標籤值為選填。標籤鍵必須以字母開頭。

      **continuation_token**: `string`

      用於繼續長時間解碼的不透明權杖。輸出：當狀態為 REQUIRES_CONTINUATION 且可繼續解碼時設定。輸入：在 CreateInteraction 中原封不動地傳回最新權杖，以繼續解碼。

      **stream**: `boolean`

      僅供輸入。互動是否以串流方式傳輸。

      **store**: `boolean`

      僅供輸入。是否儲存回應與請求以供日後擷取。

      **background**: `boolean`

      僅供輸入。是否在背景執行模型互動。



  

---


  **display_name**: `string`

  選填。觸發器的顯示名稱。

  

---


  **environment_id**: `string`

  選填。觸發器執行所用的環境 ID。

  

---


  **max_consecutive_failures**: `integer`

  選填。觸發器自動暫停（狀態變為 ERROR）之前允許的連續失敗次數上限。

  

---


  **execution_timeout_seconds**: `integer`

  選填。觸發之互動的執行逾時。

  

  

  
  **請求範例** 

  

=== "REST"

      ```sh
      curl -X POST https://generativelanguage.googleapis.com/v1beta/triggers \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "schedule": "0 9 * * *",
          "time_zone": "America/New_York",
          "interaction": {
            "agent": "antigravity-preview-09-2026",
            "input": "Summarize top news stories.",
            "environment": "remote"
          }
        }'
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})
      trigger = client.triggers.create(
          schedule="0 9 * * *",
          time_zone="America/New_York",
          interaction={
              "agent": "antigravity-preview-09-2026",
              "input": "Summarize top news stories.",
              "environment": "remote",
          },
      )
      print(trigger.id, trigger.interaction.agent)
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({apiVersion: 'v1beta'});
      const trigger = await ai.triggers.create({
        schedule: '0 9 * * *',
        time_zone: 'America/New_York',
        interaction: {
          agent: 'antigravity-preview-09-2026',
          input: 'Summarize top news stories.',
          environment: 'remote',
        },
      });
      console.log(trigger.id, trigger.interaction.agent);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateTriggerResponse;
      import com.google.genai.gaos.models.triggers.Trigger;
      import com.google.genai.gaos.models.triggers.TriggerCreateParams;
      import com.google.genai.types.HttpOptions;

      Client client =
          Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
      CreateAgentInteraction interaction =
          CreateAgentInteraction.builder()
              .agent(AgentOption.of("antigravity-preview-09-2026"))
              .input(InteractionsInput.of("Summarize top news stories."))
              .environment(CreateAgentInteractionEnvironment.of("remote"))
              .build();
      TriggerCreateParams params =
          TriggerCreateParams.builder()
              .schedule("0 9 * * *")
              .timeZone("America/New_York")
              .interaction(interaction)
              .build();
      CreateTriggerResponse response = client.triggers.create(params);
      Trigger trigger =
          response.trigger().orElseThrow(() -> new RuntimeException("No trigger returned"));
      System.out.println(
          trigger.id().orElse("")
              + " "
              + trigger.interaction().flatMap(CreateAgentInteraction::agent).orElse(null));
      ```


  


## 回應 {#response}


  **schedule**：必填 `string`

  觸發器應執行的 cron 排程。使用標準 cron 格式。

  

---


  **time_zone**：必填 `string`

  解讀排程時所依據的時區。

  

---


  

??? note "**interaction**：必填 `CreateAgentInteractionParams` 要執行的互動請求範本。"

    ??? note "**agent**：必填 `AgentOption` 用來產生互動的 `Agent` 名稱。"

        可能的值：

        - `deep-research-preview-04-2026`: Gemini Deep Research Agent
        - `deep-research-max-preview-04-2026`: Gemini Deep Research Max Agent
        - `antigravity-preview-05-2026`: 使用 Antigravity 受管理代理執行需要推理、檔案操作與工具使用的多步驟工作。
        - `antigravity-preview-09-2026`: 使用 Antigravity 受管理代理執行需要推理、檔案操作與工具使用的多步驟工作。



      **input**：必填 `Content` or `Content array` or `Step array` or `string`

      互動的輸入內容。



    ??? note "**agent_config**: `AntigravityAgentConfig` or `DeepResearchAgentConfig` or `DynamicAgentConfig` 代理互動的設定參數。"

          **可能類型**： 



        ??? note "**AntigravityAgentConfig**"

            Antigravity 代理執行階段的設定。可在伺服器端控制代理的執行環境與工具設定。

            **type**：必填 `object`

            值：`antigravity`

            **model**: `string`

            代理推理所使用的模型。

            **max_total_tokens**: `string`

            代理執行期間的權杖總數上限。





        ??? note "**DeepResearchAgentConfig**"

              Deep Research 代理的設定。

              **type**：必填 `object`

              值：`deep-research`



            ??? note "**thinking_summaries**: `ThinkingSummaries` 是否在回應中納入思考摘要。"

                可能的值：

                - `auto`: 自動產生思考摘要。
                - `none`: 不產生思考摘要。





            ??? note "**visualization**: `string enum` 是否在回應中納入視覺化內容。"

                可能的值：

                - `off`: 不納入視覺化內容。
                - `auto`: 自動納入視覺化內容。



              **collaborative_planning**: `boolean`

              為 Deep Research 代理啟用人機協作規劃。設為 true 時，Deep Research 代理會在回應中提供研究計畫；只有使用者在下一輪確認該計畫後，代理才會繼續執行。





        ??? note "**DynamicAgentConfig**"

            動態代理的設定。

            **type**：必填 `object`

            值：`dynamic`



      **id**: `string`

      必填。僅供輸出。互動完成的唯一識別碼。



    ??? note "**status**: `string enum` 必填。僅供輸出。互動的狀態。"

        可能的值：

        - `in_progress`: 互動進行中。
        - `requires_action`: 互動需要使用者採取動作或提供輸入。
        - `completed`: 互動已完成。
        - `failed`: 互動失敗。
        - `cancelled`: 互動已取消。
        - `incomplete`: 互動已完成，但結果不完整（例如達到 max_tokens 上限）。
        - `requires_continuation`: 互動至少還需要一次請求才能完成。下一個請求應將 continuation_token 設為此請求回傳的值。



      **created**: `string`

      必填。僅供輸出。回應建立的時間，採用 ISO 8601 格式（YYYY-MM-DDThh:mm:ssZ）。

      **updated**: `string`

      必填。僅供輸出。回應最後更新的時間，採用 ISO 8601 格式（YYYY-MM-DDThh:mm:ssZ）。

      **system_instruction**: `string`

      互動的系統指令。



    ??? note "**tools**: `Tool array` 模型在互動期間可呼叫的工具宣告清單。"

          **可能類型**： 



        ??? note "**CodeExecution**"

            模型可用來執行程式碼的工具。

            **type**：必填 `object`

            值：`code_execution`





        ??? note "**ComputerUse**"

              模型可用來與電腦互動的工具。

              **type**：必填 `object`

              值：`computer_use`



            ??? note "**environment**: `string enum` 所操作的環境。"

                可能的值：

                - `browser`: 在網頁瀏覽器中操作。
                - `mobile`: 在行動環境中操作。
                - `desktop`: 在桌面環境中操作。



              **excluded_predefined_functions**: `string array`

              從模型呼叫中排除的預先定義函式清單。

              **enable_prompt_injection_detection**: `boolean`

              是否對電腦使用請求啟用提示詞注入偵測檢查。



            ??? note "**disabled_safety_policies**: `string enum array` 選填。電腦使用已停用的安全政策。"

                可能的值：

                - `financial_transactions`: 金融交易的安全政策。
                - `sensitive_data_modification`: 敏感資料修改的安全政策。
                - `communication_tool`: 通訊工具（例如 Gmail、Chat、Meet）的安全政策。
                - `account_creation`: 帳號建立的安全政策。
                - `data_modification`: 資料修改的安全政策。
                - `user_consent_management`: 使用者同意管理的安全政策。
                - `legal_terms_and_agreements`: 法律條款與協議的安全政策。





        ??? note "**FileSearch**"

            模型可用來搜尋檔案的工具。

            **type**：必填 `object`

            值：`file_search`

            **file_search_store_names**: `string array`

            要搜尋的檔案搜尋儲存庫名稱。

            **top_k**: `integer`

            要擷取的語意擷取區塊數量。

            **metadata_filter**: `string`

            套用於語意擷取文件與區塊的中繼資料篩選條件。





        ??? note "**Function**"

            模型可使用的工具。

            **type**：必填 `object`

            值：`function`

            **name**: `string`

            函式的名稱。

            **description**: `string`

            函式的說明。

            **parameters**: `object`

            函式參數的 JSON Schema。僅支援 JSON Schema 的子集。`minLength`、`maxLength`、`minProperties`、`maxProperties`、`uniqueItems`、`contains`、`minContains` 與 `maxContains` 會被忽略且不強制執行。





        ??? note "**GoogleMaps**"

            模型可用來呼叫 Google Maps 的工具。

            **type**：必填 `object`

            值：`google_maps`

            **enable_widget**: `boolean`

            是否在回應的工具呼叫結果中回傳 widget 上下文權杖。

            **latitude**: `number`

            使用者所在位置的緯度。

            **longitude**: `number`

            使用者所在位置的經度。





        ??? note "**GoogleSearch**"

              模型可用來搜尋 Google 的工具。

              **type**：必填 `object`

              值：`google_search`



            ??? note "**search_types**: `string enum array` 要啟用的搜尋接地類型。"

                可能的值：

                - `web_search`: 設定此欄位可啟用網頁搜尋。僅回傳文字結果。
                - `image_search`: 設定此欄位可啟用圖片搜尋。會回傳圖片位元組。





        ??? note "**McpServer**"

              MCPServer 是可由模型呼叫以執行動作的伺服器。

              **type**：必填 `object`

              值：`mcp_server`

              **name**: `string`

              MCPServer 的名稱。

              **url**: `string`

              MCPServer 端點的完整 URL。範例："https://api.example.com/mcp"

              **headers**: `object`

              選填：如有需要，可填入驗證標頭、逾時等欄位。



            ??? note "**allowed_tools**: `AllowedTools array` 允許的工具。"

                ??? note "**mode**: `string enum` 工具選擇的模式。"

                    可能的值：

                    - `auto`: 自動工具選擇。
                    - `any`: 任一工具選擇。
                    - `none`: 不選擇工具。
                    - `validated`: 已驗證的工具選擇。



                  **tools**: `string array`

                  允許的工具名稱。





        ??? note "**UrlContext**"

            模型可用來擷取 URL 上下文的工具。

            **type**：必填 `object`

            值：`url_context`





    ??? note "**response_format**: `ResponseFormat` or `ResponseFormat array` 強制產生的回應為符合此欄位所指定 JSON schema 的 JSON 物件。"

          **可能類型**： 



        ??? note "**AudioResponseFormat**"

              音訊輸出格式的設定。

              **type**：必填 `object`

              值：`audio`



            ??? note "**mime_type**: `string enum` 音訊輸出的 MIME 類型。"

                可能的值：

                - `audio/mp3`: MP3 音訊格式。
                - `audio/ogg_opus`: OGG Opus 音訊格式。
                - `audio/l16`: 原始 PCM（L16）音訊格式。
                - `audio/wav`: WAV 音訊格式。
                - `audio/alaw`: A-law 音訊格式。
                - `audio/mulaw`: Mu-law 音訊格式。





            ??? note "**delivery**: `string enum` 音訊輸出的傳遞模式。"

                可能的值：

                - `inline`: 音訊資料以行內方式在回應中回傳。
                - `uri`: 音訊資料以 URI 形式回傳。



              **sample_rate**: `integer`

              取樣率，單位為 Hz。

              **bit_rate**: `integer`

              位元率，單位為每秒位元數（bps）。僅適用於壓縮格式（MP3、Opus）。





        ??? note "**ImageResponseFormat**"

              圖片輸出格式的設定。

              **type**：必填 `object`

              值：`image`



            ??? note "**mime_type**: `string enum` 圖片輸出的 MIME 類型。"

                可能的值：

                - `image/jpeg`: JPEG 圖片格式。





            ??? note "**delivery**: `string enum` 圖片輸出的傳遞模式。"

                可能的值：

                - `inline`: 圖片資料以行內方式在回應中回傳。
                - `uri`: 圖片資料以 URI 形式回傳。





            ??? note "**aspect_ratio**: `string enum` 圖片輸出的長寬比。"

                可能的值：

                - `1:1`: 1:1 長寬比。
                - `2:3`: 2:3 長寬比。
                - `3:2`: 3:2 長寬比。
                - `3:4`: 3:4 長寬比。
                - `4:3`: 4:3 長寬比。
                - `4:5`: 4:5 長寬比。
                - `5:4`: 5:4 長寬比。
                - `9:16`: 9:16 長寬比。
                - `16:9`: 16:9 長寬比。
                - `21:9`: 21:9 長寬比。
                - `1:8`: 1:8 長寬比。
                - `8:1`: 8:1 長寬比。
                - `1:4`: 1:4 長寬比。
                - `4:1`: 4:1 長寬比。





            ??? note "**image_size**: `string enum` 圖片輸出的大小。"

                可能的值：

                - `512`: 512px 圖片大小。
                - `1K`: 1K 圖片大小。
                - `2K`: 2K 圖片大小。
                - `4K`: 4K 圖片大小。





        ??? note "**TextResponseFormat**"

              文字輸出格式的設定。

              **type**：必填 `object`

              值：`text`



            ??? note "**mime_type**: `string enum` 文字輸出的 MIME 類型。"

                可能的值：

                - `application/json`: JSON 輸出格式。
                - `text/plain`: 純文字輸出格式。



              **schema**: `object`

              輸出應符合的 JSON schema。僅在 mime_type 為 application/json 時適用。僅支援 JSON Schema 的子集。`minLength`、`maxLength`、`minProperties`、`maxProperties`、`uniqueItems`、`contains`、`minContains` 與 `maxContains` 會被忽略且不強制執行；請在您的應用程式中自行驗證。`minItems` 與 `maxItems` 會強制執行。過於複雜而無法強制執行的 schema（例如巢狀陣列上的大型 `maxItems`）會回傳 400 INVALID_ARGUMENT 錯誤。





        ??? note "**VideoResponseFormat**"

              影片輸出格式的設定。

              **type**：必填 `object`

              值：`video`



            ??? note "**delivery**: `string enum` 影片輸出的傳遞模式。"

                可能的值：

                - `inline`: 影片資料以行內方式在回應中回傳。
                - `uri`: 影片資料以 URI 形式回傳。





            ??? note "**aspect_ratio**: `string enum` 影片輸出的長寬比。"

                可能的值：

                - `16:9`: 16:9 長寬比。
                - `9:16`: 9:16 長寬比。



              **duration**: `string`

              影片輸出的長度。



            ??? note "**resolution**: `string enum` 影片輸出的解析度。預設為 720p。"

                可能的值：

                - `360p`: 360p 解析度。
                - `720p`: 720p 解析度。
                - `1080p`: 1080p 解析度。
                - `4k`: 4K 解析度。





        ??? note "**ResponseFormat array**"

            清單中的每個項目為下列其中之一： `AudioResponseFormat`, `ImageResponseFormat`, `TextResponseFormat`, `VideoResponseFormat`.



      **previous_interaction_id**: `string`

      前一次互動的 ID（如有）。



    ??? note "**environment**: `EnvironmentConfig` or `string` 互動的環境設定。可以是指定遠端環境來源的物件，或是參照既有環境 ID 的字串。"

          **可能類型**： 



        ??? note "**EnvironmentConfig**"

              自訂環境的設定。

              **type**：必填 `object`

              值：`remote`



            ??? note "**sources**: `Source array`"

                ??? note "**type**: `string enum`"

                    可能的值：

                    - `gcs`: Cloud Storage 值區。
                    - `inline`: 行內內容。
                    - `repository`: 一般儲存庫。來源 URL 中的通訊協定前綴可識別提供者（例如 github://、gcs://）。



                  **source**: `string`

                  環境的來源。對 Cloud Storage 而言，這是 Cloud Storage 路徑；對 GitHub 而言，這是 GitHub 路徑。

                  **target**: `string`

                  來源在環境中應出現的位置。

                  **content**: `string`

                  當 `type` 為 `INLINE` 時的行內內容。

                  **encoding**: `string`

                  行內內容的選填編碼（例如 `base64`）。





            ??? note "**network**: `EnvironmentNetworkEgressAllowlist` or `string enum` 環境的網路設定。"

                  **可能類型**： 



                ??? note "**EnvironmentNetworkEgressAllowlist**"

                      環境的網路輸出設定。



                    ??? note "**allowlist**: `EgressRule array` or `string enum` 允許的網域及其設定清單。設為 `"disabled"` 可封鎖所有網路輸出。"

                          **可能類型**： 



                        ??? note "**EgressRule array**"

                            單一網域允許清單規則，可選擇性注入標頭。

                            **domain**：必填 `string`

                            允許傳送輸出請求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

                            **transform**: `object`

                            要注入符合此規則之請求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

                            **credential**: `string`

                            選填。以 ID 參照伺服器管理的 Credential 資源。





                        ??? note "**string enum**"

                            可能的值：

                            - `disabled`: 所有網路輸出皆被封鎖。





                ??? note "**string enum**"

                    可能的值：

                    - `disabled`: 所有網路輸出皆被封鎖。



              **environment_id**: `string`

              選填。互動的環境 ID。指定後，請求會更新既有環境，而非建立新環境。



            ??? note "**env**: `object` or `string` 要在沙箱環境中設定的環境變數。"

                  **可能類型**： 



                ??? note "**string**"

                    直接的字串值。





            ??? note "**mode**: `string enum` 此環境的運算生命週期模式。"

                可能的值：

                - `on_demand`: 此環境的運算生命週期模式。
                - `self_hosted`: 此環境的運算生命週期模式。



              **custom_config**: `object`

              選填。由客戶自訂的任意 JSON 設定，會直接傳遞給自行託管環境的輪詢器。僅在 `mode` 為 `SELF_HOSTED` 時支援。





        ??? note "**string**"

            直接的字串值。



      **environment_id**: `string`

      僅供輸出。互動的環境 ID。僅在請求中設定了環境設定時才會填入。



    ??? note "**service_tier**: `ServiceTier` 互動的服務層級。"

        可能的值：

        - `flex`: Flex 服務層級。
        - `standard`: Standard 服務層級。
        - `priority`: Priority 服務層級。





    ??? note "**webhook_config**: `WebhookConfig` 選填。用於在互動完成時接收通知的 webhook 設定。"

        **uris**: `string array`

        選填。設定後，webhook 事件將使用這些 webhook URI，而非已註冊的 webhook。

        **user_metadata**: `object`

        選填。每次向 webhook 發送事件時一併回傳的使用者中繼資料。





    ??? note "**safety_settings**: `SafetySetting array` 互動的安全設定。"

        ??? note "**type**：必填 `HarmCategory` 要封鎖的危害類別類型。"

            可能的值：

            - `hate_speech`: 基於特定屬性宣揚暴力或煽動對個人或群體仇恨的內容。
            - `dangerous_content`: 宣揚、協助或促成危險活動的內容。
            - `harassment`: 辱罵、威脅，或意圖霸凌、折磨或嘲弄他人的內容。
            - `sexually_explicit`: 含有露骨性內容的資料。
            - `jailbreak`: 旨在繞過安全篩選器的提示詞。





        ??? note "**threshold**：必填 `string enum` 封鎖內容的閾值。若危害機率超過此閾值，內容將被封鎖。"

            可能的值：

            - `block_low_and_above`: 封鎖危害機率為低或更高的內容。
            - `block_medium_and_above`: 封鎖危害機率為中或更高的內容。
            - `block_only_high`: 封鎖危害機率為高的內容。
            - `off`: 完全關閉安全篩選器。





        ??? note "**method**: `string enum` 選填。封鎖內容的方法。未指定時，預設行為是使用機率分數。"

            可能的值：

            - `severity`: 危害封鎖方法同時使用機率與嚴重程度分數。
            - `probability`: 危害封鎖方法使用機率分數。



      **labels**: `object`

      請求的標籤，含有使用者定義的中繼資料。標籤鍵與值的長度不得超過 63 個字元（Unicode 字碼點），且只能包含小寫字母、數字字元、底線與連字號。允許使用國際字元。標籤值為選填。標籤鍵必須以字母開頭。

      **continuation_token**: `string`

      用於繼續長時間解碼的不透明權杖。輸出：當狀態為 REQUIRES_CONTINUATION 且可繼續解碼時設定。輸入：在 CreateInteraction 中原封不動地傳回最新權杖，以繼續解碼。

      **stream**: `boolean`

      僅供輸入。互動是否以串流方式傳輸。

      **store**: `boolean`

      僅供輸入。是否儲存回應與請求以供日後擷取。

      **background**: `boolean`

      僅供輸入。是否在背景執行模型互動。



  

---


  **id**：必填 `string`

  僅供輸出。識別碼。觸發器的 ID。

  

---


  **display_name**: `string`

  選填。觸發器的顯示名稱。

  

---


  **environment_id**: `string`

  選填。觸發器執行所用的環境 ID。

  

---


  **max_consecutive_failures**: `integer`

  選填。觸發器自動暫停（狀態變為 ERROR）之前允許的連續失敗次數上限。

  

---


  **execution_timeout_seconds**: `integer`

  選填。觸發之互動的執行逾時。

  

---


  **consecutive_failure_count**: `integer`

  僅供輸出。自上次成功執行以來發生的連續失敗次數。

  

---


  **create_time**: `string`

  僅供輸出。觸發器的建立時間。

  

---


  **update_time**: `string`

  僅供輸出。觸發器最後更新的時間。

  

---


  **last_run_time**: `string`

  僅供輸出。觸發器上次執行的時間。

  

---


  **next_run_time**: `string`

  僅供輸出。觸發器下次排定執行的時間。

  

---


  **last_pause_time**: `string`

  僅供輸出。觸發器上次暫停的時間。

  

---


  **last_resume_time**: `string`

  僅供輸出。觸發器上次恢復的時間。

  

---


  **previous_interaction_id**: `string`

  僅供輸出。此觸發器所建立的最後一次互動的 ID。

  

---


  

??? note "**status**: `string enum` 僅供輸出。觸發器目前的狀態。"

    可能的值：

    - `active`: 觸發器處於啟用狀態，將依排程觸發。
    - `paused`: 觸發器已暫停，不會觸發。
    - `error`: 觸發器因連續失敗而進入錯誤狀態。


