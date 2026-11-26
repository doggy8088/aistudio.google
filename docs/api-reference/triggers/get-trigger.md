# 取得觸發器


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 下。


`GET` `https://generativelanguage.googleapis.com/v1beta/triggers/{id}`

取得單一觸發器的詳細資訊。



## 參數 {#parameters}


  **id**: required `string`

  觸發器的資源名稱。






  **範例要求**



=== "REST"

      ```sh
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/triggers/$TRIGGER_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```







## 回應 {#response}


  **schedule**: required `string`

  觸發器應執行的 cron 排程。採用標準 cron 格式。



---


  **time_zone**: required `string`

  解讀排程時所依據的時區。



---




??? note "**interaction**: required `CreateAgentInteractionParams` 要執行的互動要求範本。"

    ??? note "**agent**: required `AgentOption` 用來產生互動的 `Agent` 名稱。"

        可能的值：

        - `deep-research-preview-04-2026`: Gemini Deep Research Agent
        - `deep-research-max-preview-04-2026`: Gemini Deep Research Max Agent
        - `antigravity-preview-05-2026`: 使用 Antigravity 受管理的代理，執行需要推理、檔案操作與工具使用的多步驟工作。
        - `antigravity-preview-09-2026`: 使用 Antigravity 受管理的代理，執行需要推理、檔案操作與工具使用的多步驟工作。



      **input**: required `Content` or `Content array` or `Step array` or `string`

      互動的輸入內容。



    ??? note "**agent_config**: `AntigravityAgentConfig` or `DeepResearchAgentConfig` or `DynamicAgentConfig` 代理互動的設定參數。"

          **可能的類型**：



        ??? note "**AntigravityAgentConfig**"

            Antigravity 代理執行階段的設定。提供伺服器端對代理執行環境與工具設定的控制。

            **type**: required `object`

            值：`antigravity`

            **model**: `string`

            用於代理推理的模型。

            **max_total_tokens**: `string`

            代理執行可使用的 token 總數上限。





        ??? note "**DeepResearchAgentConfig**"

              Deep Research 代理的設定。

              **type**: required `object`

              值：`deep-research`



            ??? note "**thinking_summaries**: `ThinkingSummaries` 是否在回應中加入思考摘要。"

                可能的值：

                - `auto`: 自動加入思考摘要。
                - `none`: 不加入思考摘要。





            ??? note "**visualization**: `string enum` 是否在回應中加入視覺化呈現。"

                可能的值：

                - `off`: 不加入視覺化呈現。
                - `auto`: 自動加入視覺化呈現。



              **collaborative_planning**: `boolean`

              為 Deep Research 代理啟用人機協作規劃。若設為 true，Deep Research 代理會在回應中提供一份研究計畫；之後只有在使用者於下一輪確認該計畫時，代理才會繼續進行。





        ??? note "**DynamicAgentConfig**"

            動態代理的設定。

            **type**: required `object`

            值：`dynamic`



      **id**: `string`

      必要。僅供輸出。互動完成的專屬識別碼。



    ??? note "**status**: `string enum` 必要。僅供輸出。互動的狀態。"

        可能的值：

        - `in_progress`: 互動正在進行中。
        - `requires_action`: 互動需要使用者採取行動或提供輸入。
        - `completed`: 互動已完成。
        - `failed`: 互動失敗。
        - `cancelled`: 互動已取消。
        - `incomplete`: 互動已完成，但結果不完整（例如達到 max_tokens 上限）。
        - `requires_continuation`: 互動至少還需要一次要求才能完成。下一次要求應將 continuation_token 設為本次要求傳回的 token。



      **created**: `string`

      必要。僅供輸出。回應建立的時間，格式為 ISO 8601（YYYY-MM-DDThh:mm:ssZ）。

      **updated**: `string`

      必要。僅供輸出。回應最後更新的時間，格式為 ISO 8601（YYYY-MM-DDThh:mm:ssZ）。

      **system_instruction**: `string`

      互動的系統指令。




    ??? note "**tools**: `Tool array` 模型在互動期間可能呼叫的工具宣告清單。"

          **可能的類型**：



        ??? note "**CodeExecution**"

            模型可用來執行程式碼的工具。

            **type**: required `object`

            值：`code_execution`





        ??? note "**ComputerUse**"

              模型可用來與電腦互動的工具。

              **type**: required `object`

              值：`computer_use`



            ??? note "**environment**: `string enum` 正在操作的環境。"

                可能的值：

                - `browser`: 在網頁瀏覽器中操作。
                - `mobile`: 在行動環境中操作。
                - `desktop`: 在桌面環境中操作。



              **excluded_predefined_functions**: `string array`

              從模型呼叫中排除的預先定義函式清單。

              **enable_prompt_injection_detection**: `boolean`

              是否對 computer-use 要求啟用提示詞注入偵測檢查。



            ??? note "**disabled_safety_policies**: `string enum array` 選用。電腦使用功能已停用的安全政策。"

                可能的值：

                - `financial_transactions`: 金融交易的安全政策。
                - `sensitive_data_modification`: 敏感資料修改的安全政策。
                - `communication_tool`: 通訊工具的安全政策（例如 Gmail、Chat、Meet）。
                - `account_creation`: 帳號建立的安全政策。
                - `data_modification`: 資料修改的安全政策。
                - `user_consent_management`: 使用者同意管理的安全政策。
                - `legal_terms_and_agreements`: 法律條款與協議的安全政策。





        ??? note "**FileSearch**"

            模型可用來搜尋檔案的工具。

            **type**: required `object`

            值：`file_search`

            **file_search_store_names**: `string array`

            要搜尋的檔案搜尋存放區名稱。

            **top_k**: `integer`

            要擷取的語意檢索區塊數量。

            **metadata_filter**: `string`

            要套用到語意檢索文件與區塊的中繼資料篩選條件。





        ??? note "**Function**"

            模型可使用的工具。

            **type**: required `object`

            值：`function`

            **name**: `string`

            函式的名稱。

            **description**: `string`

            函式的說明。

            **parameters**: `object`

            函式參數的 JSON Schema。支援 JSON Schema 的一部分。`minLength`、`maxLength`、`minProperties`、`maxProperties`、`uniqueItems`、`contains`、`minContains` 與 `maxContains` 會被忽略，不會強制執行。

            **defer_loading**: `boolean`

            若為 true，系統會延遲載入此函式。

            **short_description**: `string`

            函式的簡短描述；對於設定了 `defer_loading` 的函式，模型會看到這段摘要。





        ??? note "**GoogleMaps**"

            模型可用來呼叫 Google Maps 的工具。

            **type**: required `object`

            值：`google_maps`

            **enable_widget**: `boolean`

            是否在回應的工具呼叫結果中傳回 widget 上下文 token。

            **latitude**: `number`

            使用者所在位置的緯度。

            **longitude**: `number`

            使用者所在位置的經度。





        ??? note "**GoogleSearch**"

              模型可用來搜尋 Google 的工具。

              **type**: required `object`

              值：`google_search`



            ??? note "**search_types**: `string enum array` 要啟用的搜尋接地類型。"

                可能的值：

                - `web_search`: 設定此欄位即可啟用網路搜尋。僅傳回文字結果。
                - `image_search`: 設定此欄位即可啟用圖片搜尋。傳回圖片位元組。





        ??? note "**McpServer**"

              MCPServer 是模型可呼叫來執行動作的伺服器。

              **type**: required `object`

              值：`mcp_server`

              **name**: `string`

              MCPServer 的名稱。

              **url**: `string`

              MCPServer 端點的完整 URL。範例："https://api.example.com/mcp"

              **headers**: `object`

              選用：驗證標頭、逾時等欄位（如有需要）。



            ??? note "**allowed_tools**: `AllowedTools array` 允許使用的工具。"

                ??? note "**mode**: `string enum` 工具選擇的模式。"

                    可能的值：

                    - `auto`: 自動選擇工具。
                    - `any`: 任意工具選擇。
                    - `none`: 不選擇工具。
                    - `validated`: 經驗證的工具選擇。



                  **tools**: `string array`

                  允許使用的工具名稱。

                  **defer_loading**: `boolean`

                  若為 true，系統會延遲載入此 MCP 伺服器上的工具。

                  **credential**: `string`

                  選用。透過 ID 參照由伺服器管理的 Credential 資源。

        ??? note "**ToolSearch**"


              一種工具，可讓模型動態進行工具擷取，按需將工具載入模型的上下文中。如此一來，用戶端無需預先載入所有工具定義，並有助於降低整體 token 用量與成本。

              **type**: required `object`

              值：`tool_search`

              **name**: `string`

              函式名稱。僅供用戶端執行時設定。

              **description**: `string`

              函式描述。僅供用戶端執行時設定。

              **parameters**: `object`

              函式參數的 JSON Schema。僅供用戶端執行時設定。


            ??? note "**execution**: `string enum` 工具擷取的執行模式。"


                可能的值：

                - `server`: 伺服器端執行模式。預設。
                - `client`: 用戶端執行模式。






        ??? note "**UrlContext**"

            模型可用來擷取 URL 上下文的工具。

            **type**: required `object`

            值：`url_context`





    ??? note "**response_format**: `ResponseFormat` or `ResponseFormat array` 強制產生的回應為符合此欄位所指定 JSON schema 的 JSON 物件。"

          **可能的類型**：



        ??? note "**AudioResponseFormat**"

              音訊輸出格式的設定。

              **type**: required `object`

              值：`audio`



            ??? note "**mime_type**: `string enum` 音訊輸出的 MIME 類型。"

                可能的值：

                - `audio/mp3`: MP3 音訊格式。
                - `audio/ogg_opus`: OGG Opus 音訊格式。
                - `audio/l16`: 原始 PCM (L16) 音訊格式。
                - `audio/wav`: WAV 音訊格式。
                - `audio/alaw`: A-law 音訊格式。
                - `audio/mulaw`: Mu-law 音訊格式。





            ??? note "**delivery**: `string enum` 音訊輸出的傳送方式。"

                可能的值：

                - `inline`: 音訊資料以內嵌方式在回應中傳回。
                - `uri`: 音訊資料以 URI 形式傳回。



              **sample_rate**: `integer`

              取樣率，單位為 Hz。

              **bit_rate**: `integer`

              位元率，單位為每秒位元數 (bps)。僅適用於壓縮格式（MP3、Opus）。





        ??? note "**ImageResponseFormat**"

              圖片輸出格式的設定。

              **type**: required `object`

              值：`image`



            ??? note "**mime_type**: `string enum` 圖片輸出的 MIME 類型。"

                可能的值：

                - `image/jpeg`: JPEG 圖片格式。





            ??? note "**delivery**: `string enum` 圖片輸出的傳送方式。"

                可能的值：

                - `inline`: 圖片資料以內嵌方式在回應中傳回。
                - `uri`: 圖片資料以 URI 形式傳回。





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





            ??? note "**image_size**: `string enum` 圖片輸出的尺寸。"

                可能的值：

                - `512`: 512px 圖片尺寸。
                - `1K`: 1K 圖片尺寸。
                - `2K`: 2K 圖片尺寸。
                - `4K`: 4K 圖片尺寸。





        ??? note "**TextResponseFormat**"

              文字輸出格式的設定。

              **type**: required `object`

              值：`text`



            ??? note "**mime_type**: `string enum` 文字輸出的 MIME 類型。"

                可能的值：

                - `application/json`: JSON 輸出格式。
                - `text/plain`: 純文字輸出格式。



              **schema**: `object`

              輸出應符合的 JSON schema。僅在 mime_type 為 application/json 時適用。支援 JSON Schema 的一部分。`minLength`、`maxLength`、`minProperties`、`maxProperties`、`uniqueItems`、`contains`、`minContains` 與 `maxContains` 會被忽略，不會強制執行；這些請在你的應用程式中自行驗證。`minItems` 與 `maxItems` 會強制執行。複雜到無法強制執行的 schema（例如巢狀陣列上設定過大的 `maxItems`）會傳回 400 INVALID_ARGUMENT 錯誤。





        ??? note "**VideoResponseFormat**"

              影片輸出格式的設定。

              **type**: required `object`

              值：`video`



            ??? note "**delivery**: `string enum` 影片輸出的傳送方式。"

                可能的值：

                - `inline`: 影片資料以內嵌方式在回應中傳回。
                - `uri`: 影片資料以 URI 形式傳回。





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

            清單中每個項目為下列其中之一：`AudioResponseFormat`、`ImageResponseFormat`、`TextResponseFormat`、`VideoResponseFormat`。





      **previous_interaction_id**: `string`

      先前互動的 ID（如有）。



    ??? note "**environment**: `EnvironmentConfig` or `string` 互動的環境設定。可以是指定遠端環境來源的物件，也可以是參照現有環境 ID 的字串。"

          **可能的類型**：



        ??? note "**EnvironmentConfig**"

              自訂環境的設定。

              **type**: required `object`

              值：`remote`



            ??? note "**sources**: `Source array`"

                ??? note "**type**: `string enum`"

                    可能的值：

                    - `gcs`: Cloud Storage 值區。
                    - `inline`: 內嵌內容。
                    - `repository`: 一般存放庫。來源 URL 中的通訊協定前置字元可識別供應商（例如 github://、gcs://）。



                  **source**: `string`

                  環境的來源。對於 Cloud Storage，這是 Cloud Storage 路徑。對於 GitHub，這是 GitHub 路徑。

                  **target**: `string`

                  來源應出現在環境中的位置。

                  **content**: `string`

                  當 `type` 為 `INLINE` 時的內嵌內容。

                  **encoding**: `string`

                  內嵌內容的選用編碼（例如 `base64`）。





            ??? note "**network**: `EnvironmentNetworkEgressAllowlist` or `string enum` 環境的網路設定。"

                  **可能的類型**：



                ??? note "**EnvironmentNetworkEgressAllowlist**"

                      環境的網路輸出設定。



                    ??? note "**allowlist**: `EgressRule array` or `string enum` 允許的網域及其設定清單。設為 `"disabled"` 即可封鎖所有網路輸出。"

                          **可能的類型**：



                        ??? note "**EgressRule array**"

                            單一網域的允許清單規則，可選擇性注入標頭。

                            **domain**: required `string`

                            允許向外傳送要求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

                            **transform**: `object`

                            要注入符合此規則之要求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

                            **credential**: `string`

                            選用。以 ID 參照伺服器管理的 Credential 資源。





                        ??? note "**string enum**"

                            可能的值：

                            - `disabled`: 所有網路輸出均已封鎖。





                ??? note "**string enum**"

                    可能的值：

                    - `disabled`: 所有網路輸出均已封鎖。



              **environment_id**: `string`

              選用。互動的環境 ID。若有指定，此要求會更新現有的環境，而非建立新環境；建立時專用的欄位（`env` 和 `sources`）在恢復既有環境時無法更新。



            ??? note "**env**: `object` or `string` 要在沙箱環境中設定的環境變數。"

                  **可能的類型**：



                ??? note "**string**"

                    直接的字串值。





            ??? note "**mode**: `string enum` 此環境的運算生命週期模式。"

                可能的值：

                - `on_demand`: 此環境的運算生命週期模式。
                - `self_hosted`: 此環境的運算生命週期模式。



              **custom_config**: `object`

              選用。由客戶自訂、直接傳遞給自行託管環境輪詢器的任意 JSON 設定。僅在 `mode` 為 `SELF_HOSTED` 時支援。





        ??? note "**string**"

            直接的字串值。



      **environment_id**: `string`

      僅供輸出。互動的環境 ID。僅在要求中設定了環境設定時才會填入。



    ??? note "**service_tier**: `ServiceTier` 互動的服務層級。"

        可能的值：

        - `flex`: Flex 服務層級。
        - `standard`: Standard 服務層級。
        - `priority`: Priority 服務層級。





    ??? note "**webhook_config**: `WebhookConfig` 選用。在互動完成時接收通知的 Webhook 設定。"

        **uris**: `string array`

        選用。若有設定，這些 webhook URI 將用於 webhook 事件，而非已註冊的 webhook。

        **user_metadata**: `object`

        選用。每次向 webhook 發出事件時一併傳回的使用者中繼資料。





    ??? note "**safety_settings**: `SafetySetting array` 互動的安全設定。"

        ??? note "**type**: required `HarmCategory` 要封鎖的危害類別類型。"

            可能的值：

            - `hate_speech`: 根據某些屬性，宣揚暴力或煽動對個人或群體仇恨的內容。
            - `dangerous_content`: 宣揚、協助或助長危險活動的內容。
            - `harassment`: 辱罵、威脅，或意圖霸凌、折磨或嘲弄他人的內容。
            - `sexually_explicit`: 含有性露骨資料的內容。
            - `jailbreak`: 旨在繞過安全篩選器的提示詞。





        ??? note "**threshold**: required `string enum` 封鎖內容的門檻。若危害機率超過此門檻，內容將被封鎖。"

            可能的值：

            - `block_low_and_above`: 封鎖危害機率為低或更高的內容。
            - `block_medium_and_above`: 封鎖危害機率為中或更高的內容。
            - `block_only_high`: 僅封鎖危害機率為高的內容。
            - `off`: 完全關閉安全篩選器。





        ??? note "**method**: `string enum` 選用。封鎖內容的方法。若未指定，預設行為是使用機率分數。"

            可能的值：

            - `severity`: 危害封鎖方法同時使用機率與嚴重程度分數。
            - `probability`: 危害封鎖方法使用機率分數。



      **labels**: `object`

      要求中由使用者定義的中繼資料標籤。標籤鍵與值的長度不得超過 63 個字元（Unicode 碼點），且只能包含小寫字母、數字字元、底線與連字號。允許使用國際字元。標籤值為選用。標籤鍵必須以字母開頭。

      **continuation_token**: `string`

      用來恢復長時間解碼的不透明 token。輸出：當 status 為 REQUIRES_CONTINUATION 且可恢復解碼時設定。輸入：在建立下一個互動時原封不動地傳回最新 token，以繼續解碼。

      **stream**: `boolean`

      僅供輸入。互動是否以串流方式進行。

      **store**: `boolean`

      僅供輸入。是否儲存回應與要求，以供日後擷取。

      **background**: `boolean`

      僅供輸入。是否在背景執行模型互動。





---


  **id**: required `string`

  僅供輸出。識別碼。觸發器的 ID。



---


  **display_name**: `string`

  選用。觸發器的顯示名稱。



---


  **environment_id**: `string`

  選用。觸發器執行所用的環境 ID。



---


  **max_consecutive_failures**: `integer`

  選用。觸發器自動暫停（status 變為 ERROR）之前，允許連續失敗的次數上限。



---


  **execution_timeout_seconds**: `integer`

  選用。被觸發之互動的執行逾時時間。



---


  **consecutive_failure_count**: `integer`

  僅供輸出。自上次成功執行以來，連續失敗的次數。



---


  **create_time**: `string`

  僅供輸出。觸發器建立的時間。



---


  **update_time**: `string`

  僅供輸出。觸發器最後更新的時間。



---


  **last_run_time**: `string`

  僅供輸出。觸發器最後執行的時間。



---


  **next_run_time**: `string`

  僅供輸出。觸發器排定下次執行的時間。



---


  **last_pause_time**: `string`

  僅供輸出。觸發器最後暫停的時間。



---


  **last_resume_time**: `string`

  僅供輸出。觸發器最後恢復執行的時間。



---


  **previous_interaction_id**: `string`

  僅供輸出。此觸發器建立的上一個互動 ID。



---




??? note "**status**: `string enum` 僅供輸出。觸發器目前的狀態。"

    可能的值：

    - `active`: 觸發器已啟用，會依排程觸發。
    - `paused`: 觸發器已暫停，不會觸發。
    - `error`: 觸發器因連續失敗而進入錯誤狀態。







  **範例回應**

  ```json
  {
    "schedule": "string",
    "time_zone": "string",
    "interaction": {
      "agent": "deep-research-preview-04-2026",
      "input": {
        "type": "audio",
        "data": "string",
        "uri": "string",
        "channels": 0,
        "sample_rate": 0,
        "processing": {
          "type": "static",
          "start_offset": "string",
          "end_offset": "string"
        },
        "mime_type": "audio/wav"
      },
      "agent_config": {
        "type": "antigravity",
        "model": "string",
        "max_total_tokens": "string"
      },
      "id": "string",
      "status": "in_progress",
      "created": "string",
      "updated": "string",
      "system_instruction": "string",
      "tools": [
        {
          "type": "code_execution"
        }
      ],
      "response_format": {
        "type": "audio",
        "mime_type": "audio/mp3",
        "delivery": "inline",
        "sample_rate": 0,
        "bit_rate": 0
      },
      "previous_interaction_id": "string",
      "environment": {
        "type": "remote",
        "sources": [
          {
            "type": "gcs",
            "source": "string",
            "target": "string",
            "content": "string",
            "encoding": "string"
          }
        ],
        "network": {
          "allowlist": [
            {
              "domain": "...",
              "transform": "...",
              "credential": "..."
            }
          ]
        },
        "environment_id": "string",
        "env": {},
        "mode": "on_demand",
        "custom_config": {}
      },
      "environment_id": "string",
      "service_tier": "flex",
      "webhook_config": {
        "uris": [
          "string"
        ],
        "user_metadata": {}
      },
      "safety_settings": [
        {
          "type": "hate_speech",
          "threshold": "block_low_and_above",
          "method": "severity"
        }
      ],
      "labels": {},
      "continuation_token": "string",
      "stream": true,
      "store": true,
      "background": true
    },
    "id": "string",
    "display_name": "string",
    "environment_id": "string",
    "max_consecutive_failures": 0,
    "execution_timeout_seconds": 0,
    "consecutive_failure_count": 0,
    "create_time": "string",
    "update_time": "string",
    "last_run_time": "string",
    "next_run_time": "string",
    "last_pause_time": "string",
    "last_resume_time": "string",
    "previous_interaction_id": "string",
    "status": "active"
  }
  ```
