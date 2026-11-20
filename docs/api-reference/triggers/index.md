# Gemini Triggers API


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 下。


Trigger 可讓你依 cron 排程排定代理執行的時間，實現自動化與週期性任務。

## 方法 {#methods}


| 方法 | HTTP 請求 |
| --- | --- |
| [建立 trigger](/api-reference/triggers/create-trigger/) | `POST` `/v1beta/triggers` 建立新的 trigger，依指定的 cron 排程呼叫指定的代理。 |
| [執行 trigger](/api-reference/triggers/run-trigger/) | `POST` `/v1beta/triggers/{triggerId}/executions` 立即執行 trigger。 |
| [列出 trigger](/api-reference/triggers/list-triggers/) | `GET` `/v1beta/triggers` 列出專案的 trigger。 |
| [取得 trigger](/api-reference/triggers/get-trigger/) | `GET` `/v1beta/triggers/{id}` 取得單一 trigger 的詳細資訊。 |
| [列出 trigger 執行記錄](/api-reference/triggers/list-trigger-executions/) | `GET` `/v1beta/triggers/{triggerId}/executions` 列出 trigger 的執行記錄。 |
| [更新 trigger](/api-reference/triggers/update-trigger/) | `PATCH` `/v1beta/triggers/{id}` 更新 trigger。 |
| [刪除 trigger](/api-reference/triggers/delete-trigger/) | `DELETE` `/v1beta/triggers/{id}` 刪除 trigger。 |


## 資源 {#resources}

### Trigger {#Resource:Trigger}

排定要執行代理的 trigger 設定。

**屬性**：


  **schedule**: required `string`

  trigger 應執行的 cron 排程。採用標準 cron 格式。

  

---


  **time_zone**: required `string`

  解讀排程時所依據的時區。

  

---


  

??? note "**interaction**: required `CreateAgentInteractionParams` 要執行的互動請求範本。"

    ??? note "**agent**: required `AgentOption` 用來產生互動的 `Agent` 名稱。"

        可能的值：

        - `deep-research-preview-04-2026`: Gemini Deep Research Agent
        - `deep-research-max-preview-04-2026`: Gemini Deep Research Max Agent
        - `antigravity-preview-05-2026`: 使用 Antigravity 受管理代理執行需要推理、檔案操作與工具使用的多步驟任務。
        - `antigravity-preview-09-2026`: 使用 Antigravity 受管理代理執行需要推理、檔案操作與工具使用的多步驟任務。



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

            代理執行期間的 token 總數上限。





        ??? note "**DeepResearchAgentConfig**"

              Deep Research 代理的設定。

              **type**: required `object`

              值：`deep-research`



            ??? note "**thinking_summaries**: `ThinkingSummaries` 是否在回應中包含思考摘要。"

                可能的值：

                - `auto`: 自動產生思考摘要。
                - `none`: 不產生思考摘要。





            ??? note "**visualization**: `string enum` 是否在回應中包含視覺化內容。"

                可能的值：

                - `off`: 不包含視覺化內容。
                - `auto`: 自動包含視覺化內容。



              **collaborative_planning**: `boolean`

              為 Deep Research 代理啟用人機協作規劃。設為 true 時，Deep Research 代理會在回應中提供研究計畫；只有在使用者於下一輪確認該計畫後，代理才會繼續執行。





        ??? note "**DynamicAgentConfig**"

            動態代理的設定。

            **type**: required `object`

            值：`dynamic`



      **id**: `string`

      必填。僅供輸出。互動完成結果的唯一識別碼。



    ??? note "**status**: `string enum` 必填。僅供輸出。互動的狀態。"

        可能的值：

        - `in_progress`: 互動進行中。
        - `requires_action`: 互動需要使用者採取行動或提供輸入。
        - `completed`: 互動已完成。
        - `failed`: 互動失敗。
        - `cancelled`: 互動已取消。
        - `incomplete`: 互動已完成，但結果不完整（例如達到 max_tokens）。
        - `requires_continuation`: 互動至少還需要一次請求才能完成。下一個請求應將 continuation_token 設為此請求回傳的值。



      **created**: `string`

      必填。僅供輸出。回應建立的時間，採用 ISO 8601 格式 (YYYY-MM-DDThh:mm:ssZ)。

      **updated**: `string`

      必填。僅供輸出。回應最後更新的時間，採用 ISO 8601 格式 (YYYY-MM-DDThh:mm:ssZ)。

      **system_instruction**: `string`

      互動的系統指令。



    ??? note "**tools**: `Tool array` 模型在互動期間可呼叫的工具宣告清單。"

          **可能的類型**： 



        ??? note "**CodeExecution**"

            模型可用來執行程式碼的工具。

            **type**: required `object`

            值：`code_execution`





        ??? note "**ComputerUse**"

              模型可用來與電腦互動的工具。

              **type**: required `object`

              值：`computer_use`



            ??? note "**environment**: `string enum` 所操作的環境。"

                可能的值：

                - `browser`: 在網頁瀏覽器中操作。
                - `mobile`: 在行動環境中操作。
                - `desktop`: 在桌面環境中操作。



              **excluded_predefined_functions**: `string array`

              從模型呼叫中排除的預先定義函式清單。

              **enable_prompt_injection_detection**: `boolean`

              是否對 computer-use 請求啟用提示詞注入偵測檢查。



            ??? note "**disabled_safety_policies**: `string enum array` 選填。已停用的 computer use 安全政策。"

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

            要搜尋的 File Search store 名稱。

            **top_k**: `integer`

            要擷取的語意檢索區塊數量。

            **metadata_filter**: `string`

            套用於語意檢索文件與區塊的中繼資料篩選條件。





        ??? note "**Function**"

            模型可使用的工具。

            **type**: required `object`

            值：`function`

            **name**: `string`

            函式的名稱。

            **description**: `string`

            函式的說明。

            **parameters**: `object`

            函式參數的 JSON Schema。僅支援 JSON Schema 的子集。`minLength`、`maxLength`、`minProperties`、`maxProperties`、`uniqueItems`、`contains`、`minContains` 與 `maxContains` 會被忽略且不強制執行。

            **defer_loading**: `boolean`

            若為 true，系統會延遲載入此函式。

            **short_description**: `string`

            函式的簡短描述；對於設定了 `defer_loading` 的函式，模型會看到這段摘要。





        ??? note "**GoogleMaps**"

            模型可用來呼叫 Google Maps 的工具。

            **type**: required `object`

            值：`google_maps`

            **enable_widget**: `boolean`

            是否在回應的工具呼叫結果中回傳 widget 上下文 token。

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

                - `web_search`: 設定此欄位可啟用網路搜尋。僅回傳文字結果。
                - `image_search`: 設定此欄位可啟用圖片搜尋。回傳圖片位元組。





        ??? note "**McpServer**"

              MCPServer 是可由模型呼叫以執行動作的伺服器。

              **type**: required `object`

              值：`mcp_server`

              **name**: `string`

              MCPServer 的名稱。

              **url**: `string`

              MCPServer 端點的完整 URL。範例："https://api.example.com/mcp"

              **headers**: `object`

              選填：如有需要，可填入驗證標頭、逾時等欄位。



            ??? note "**allowed_tools**: `AllowedTools array` 允許使用的工具。"

                ??? note "**mode**: `string enum` 工具選擇的模式。"

                    可能的值：

                    - `auto`: 自動選擇工具。
                    - `any`: 任一工具選擇。
                    - `none`: 不選擇工具。
                    - `validated`: 經驗證的工具選擇。



                  **tools**: `string array`

                  允許使用的工具名稱。

                  **defer_loading**: `boolean`

                  若為 true，系統會延遲載入此 MCP 伺服器上的工具。


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





            ??? note "**delivery**: `string enum` 音訊輸出的傳遞模式。"

                可能的值：

                - `inline`: 音訊資料直接內嵌於回應中回傳。
                - `uri`: 音訊資料以 URI 形式回傳。



              **sample_rate**: `integer`

              取樣率，單位為 Hz。

              **bit_rate**: `integer`

              位元率，單位為每秒位元數 (bps)。僅適用於壓縮格式 (MP3, Opus)。





        ??? note "**ImageResponseFormat**"

              圖片輸出格式的設定。

              **type**: required `object`

              值：`image`



            ??? note "**mime_type**: `string enum` 圖片輸出的 MIME 類型。"

                可能的值：

                - `image/jpeg`: JPEG 圖片格式。





            ??? note "**delivery**: `string enum` 圖片輸出的傳遞模式。"

                可能的值：

                - `inline`: 圖片資料直接內嵌於回應中回傳。
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

              **type**: required `object`

              值：`text`



            ??? note "**mime_type**: `string enum` 文字輸出的 MIME 類型。"

                可能的值：

                - `application/json`: JSON 輸出格式。
                - `text/plain`: 純文字輸出格式。



              **schema**: `object`

              輸出應符合的 JSON schema。僅在 mime_type 為 application/json 時適用。僅支援 JSON Schema 的子集。`minLength`、`maxLength`、`minProperties`、`maxProperties`、`uniqueItems`、`contains`、`minContains` 與 `maxContains` 會被忽略且不強制執行；請在你的應用程式中自行驗證這些項目。`minItems` 與 `maxItems` 會強制執行。過於複雜而無法強制執行的 schema（例如巢狀陣列上的大型 `maxItems`）會回傳 400 INVALID_ARGUMENT 錯誤。





        ??? note "**VideoResponseFormat**"

              影片輸出格式的設定。

              **type**: required `object`

              值：`video`



            ??? note "**delivery**: `string enum` 影片輸出的傳遞模式。"

                可能的值：

                - `inline`: 影片資料直接內嵌於回應中回傳。
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

            清單中的每個項目為下列其中之一：`AudioResponseFormat`、`ImageResponseFormat`、`TextResponseFormat`、`VideoResponseFormat`。




      **previous_interaction_id**: `string`

      前一次互動的 ID（如有）。



    ??? note "**environment**: `EnvironmentConfig` or `string` 互動的環境設定。可以是指定遠端環境來源的物件，或是參照現有環境 ID 的字串。"

          **可能的類型**： 



        ??? note "**EnvironmentConfig**"

              自訂環境的設定。

              **type**: required `object`

              值：`remote`



            ??? note "**sources**: `Source array`"

                ??? note "**type**: `string enum`"

                    可能的值：

                    - `gcs`: Cloud Storage 儲存桶。
                    - `inline`: 內嵌內容。
                    - `repository`: 一般儲存庫。來源 URL 中的通訊協定前綴可識別提供者（例如 github://、gcs://）。



                  **source**: `string`

                  環境的來源。對於 Cloud Storage，這是 Cloud Storage 路徑；對於 GitHub，這是 GitHub 路徑。

                  **target**: `string`

                  來源應出現在環境中的位置。

                  **content**: `string`

                  當 `type` 為 `INLINE` 時的內嵌內容。

                  **encoding**: `string`

                  內嵌內容的選填編碼（例如 `base64`）。





            ??? note "**network**: `EnvironmentNetworkEgressAllowlist` or `string enum` 環境的網路設定。"

                  **可能的類型**： 



                ??? note "**EnvironmentNetworkEgressAllowlist**"

                      環境的網路輸出設定。



                    ??? note "**allowlist**: `EgressRule array` or `string enum` 允許的網域及其設定清單。設為 `"disabled"` 可封鎖所有網路輸出。"

                          **可能的類型**： 



                        ??? note "**EgressRule array**"

                            單一網域允許清單規則，可選擇性注入標頭。

                            **domain**: required `string`

                            允許傳出請求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

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

              選填。互動的環境 ID。若有指定，請求將更新現有環境，而非建立新環境。



            ??? note "**env**: `object` or `string` 要在沙箱環境中設定的環境變數。"

                  **可能的類型**： 



                ??? note "**string**"

                    直接的字串值。





            ??? note "**mode**: `string enum` 此環境的運算生命週期模式。"

                可能的值：

                - `on_demand`: 此環境的運算生命週期模式。
                - `self_hosted`: 此環境的運算生命週期模式。



              **custom_config**: `object`

              選填。由客戶自訂的任意 JSON 設定，會原樣傳遞給自行託管環境的輪詢器。僅在 `mode` 為 `SELF_HOSTED` 時支援。





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

        選填。若有設定，webhook 事件將使用這些 webhook URI，而非已註冊的 webhook。

        **user_metadata**: `object`

        選填。每次向 webhook 發送事件時一併回傳的使用者中繼資料。





    ??? note "**safety_settings**: `SafetySetting array` 互動的安全設定。"

        ??? note "**type**: required `HarmCategory` 要封鎖的危害類別類型。"

            可能的值：

            - `hate_speech`: 基於特定屬性，宣揚暴力或煽動對個人或群體仇恨的內容。
            - `dangerous_content`: 宣揚、協助或促成危險活動的內容。
            - `harassment`: 辱罵、威脅，或意圖霸凌、折磨或嘲弄他人的內容。
            - `sexually_explicit`: 包含色情露骨素材的內容。
            - `jailbreak`: 旨在繞過安全篩選機制的提示詞。





        ??? note "**threshold**: required `string enum` 封鎖內容的門檻。若危害機率超過此門檻，內容將被封鎖。"

            可能的值：

            - `block_low_and_above`: 封鎖危害機率為低或更高的內容。
            - `block_medium_and_above`: 封鎖危害機率為中或更高的內容。
            - `block_only_high`: 僅封鎖危害機率為高的內容。
            - `off`: 完全關閉安全篩選機制。





        ??? note "**method**: `string enum` 選填。封鎖內容的方法。若未指定，預設行為是使用機率分數。"

            可能的值：

            - `severity`: 危害封鎖方法同時使用機率與嚴重程度分數。
            - `probability`: 危害封鎖方法使用機率分數。



      **labels**: `object`

      附有使用者自訂中繼資料的請求標籤。標籤鍵與值的長度不得超過 63 個字元（Unicode 字碼點），且只能包含小寫字母、數字字元、底線與連字號。允許使用國際字元。標籤值為選填。標籤鍵必須以字母開頭。

      **continuation_token**: `string`

      用於繼續長時間解碼的不透明 token。輸出：當狀態為 REQUIRES_CONTINUATION 且可繼續解碼時設定。輸入：在 CreateInteraction 中原樣傳回最新的 token 以繼續解碼。

      **stream**: `boolean`

      僅供輸入。互動是否以串流方式傳輸。

      **store**: `boolean`

      僅供輸入。是否儲存回應與請求以供日後擷取。

      **background**: `boolean`

      僅供輸入。是否在背景執行模型互動。



  

---


  **id**: required `string`

  僅供輸出。識別碼。trigger 的 ID。

  

---


  **display_name**: `string`

  選填。trigger 的顯示名稱。

  

---


  **environment_id**: `string`

  選填。trigger 執行所用的環境 ID。

  

---


  **max_consecutive_failures**: `integer`

  選填。trigger 自動暫停（狀態變為 ERROR）前允許的連續失敗次數上限。

  

---


  **execution_timeout_seconds**: `integer`

  選填。被觸發互動的執行逾時時間。

  

---


  **consecutive_failure_count**: `integer`

  僅供輸出。自上次成功執行以來發生的連續失敗次數。

  

---


  **create_time**: `string`

  僅供輸出。trigger 的建立時間。

  

---


  **update_time**: `string`

  僅供輸出。trigger 的最後更新時間。

  

---


  **last_run_time**: `string`

  僅供輸出。trigger 的上次執行時間。

  

---


  **next_run_time**: `string`

  僅供輸出。trigger 的下次預定執行時間。

  

---


  **last_pause_time**: `string`

  僅供輸出。trigger 的上次暫停時間。

  

---


  **last_resume_time**: `string`

  僅供輸出。trigger 的上次恢復時間。

  

---


  **previous_interaction_id**: `string`

  僅供輸出。此 trigger 所建立的上一次互動 ID。

  

---


  

??? note "**status**: `string enum` 僅供輸出。trigger 的目前狀態。"

    可能的值：

    - `active`: trigger 處於啟用狀態，將依排程觸發。
    - `paused`: trigger 已暫停，不會觸發。
    - `error`: trigger 因連續失敗而進入錯誤狀態。
