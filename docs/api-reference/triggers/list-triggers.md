# 列出觸發器


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 之下。


`GET` `https://generativelanguage.googleapis.com/v1beta/triggers`

列出專案的觸發器。


  
## 參數 {#parameters}

  
  **filter**: `string`

  選填。篩選運算式（例如依狀態篩選）。

  

---


  **page_size**: `integer`

  選填。每頁要傳回的觸發器數量上限。

  

---


  **page_token**: `string`

  選填。先前 ListTriggers 呼叫所傳回的分頁權杖。

  

  

  
  **範例要求** 

  

=== "REST"

      ```sh
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/triggers" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


  
## 回應 {#response}

  
  **triggers**: [`Trigger`](/api-reference/triggers/list-triggers/#Resource:Trigger) `array`

  觸發器清單。

  

---


  **next_page_token**: `string`

  先前 `ListTriggers` 呼叫所傳回的分頁權杖。提供此權杖即可擷取下一頁。

  

  

  
  **範例回應** 

  ```json
  {
    "triggers": [
      {
        "schedule": "string",
        "time_zone": "string",
        "interaction": {
          "agent": "deep-research-preview-04-2026",
          "input": {
            "type": "...",
            "data": "...",
            "uri": "...",
            "channels": "...",
            "sample_rate": "...",
            "mime_type": "..."
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
              "type": "..."
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
              "..."
            ],
            "network": {
              "allowlist": "..."
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
              "type": "...",
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
    ],
    "next_page_token": "string"
  }
  ```

  


## 資源 {#resources}

### Trigger {#Resource:Trigger}

排定用來執行代理的觸發器設定。

**Properties：**


  **schedule**: required `string`

  觸發器應執行的 cron 排程。採用標準 cron 格式。

  

---


  **time_zone**: required `string`

  解讀排程時所依據的時區。

  

---


  

<details>
<summary>**interaction**: required `CreateAgentInteractionParams` 要執行的互動要求範本。</summary>

  

  

<details>
<summary>**agent**: required `AgentOption` 用來產生互動的 `Agent` 名稱。</summary>

  

  可能的值：

  - `deep-research-preview-04-2026`: Gemini Deep Research Agent
  - `deep-research-max-preview-04-2026`: Gemini Deep Research Max Agent
  - `antigravity-preview-05-2026`: 使用 Antigravity 受管理代理執行需要推理、檔案操作與工具使用的多步驟工作。
  - `antigravity-preview-09-2026`: 使用 Antigravity 受管理代理執行需要推理、檔案操作與工具使用的多步驟工作。

  

</details>


  **input**: required `Content` or `Content array` or `Step array` or `string`

  互動的輸入內容。

  

<details>
<summary>**agent_config**: `AntigravityAgentConfig` or `DeepResearchAgentConfig` or `DynamicAgentConfig` 代理互動的設定參數。</summary>

  

  **Possible Types：** 

  

<details>
<summary>**AntigravityAgentConfig**</summary>

  

  Antigravity 代理執行階段的設定。提供伺服器端對代理執行環境與工具設定的控制。

  **type**: required `object`

  值： `antigravity`

  **model**: `string`

  供代理推理使用的模型。

  **max_total_tokens**: `string`

  代理執行時的權杖總數上限。

  

</details>


  

<details>
<summary>**DeepResearchAgentConfig**</summary>

  

  Deep Research 代理的設定。

  **type**: required `object`

  值： `deep-research`

  

<details>
<summary>**thinking_summaries**: `ThinkingSummaries` 是否在回應中納入思考摘要。</summary>

  

  可能的值：

  - `auto`: 自動思考摘要。
  - `none`: 不提供思考摘要。

  

</details>


  

<details>
<summary>**visualization**: `string enum` 是否在回應中納入視覺化內容。</summary>

  

  可能的值：

  - `off`: 不納入視覺化內容。
  - `auto`: 自動納入視覺化內容。

  

</details>


  **collaborative_planning**: `boolean`

  為 Deep Research 代理啟用由人參與的規劃流程。設為 true 時，Deep Research 代理會在回應中提供研究計畫；只有在使用者於下一輪確認該計畫後，代理才會繼續執行。

  

</details>


  

<details>
<summary>**DynamicAgentConfig**</summary>

  

  動態代理的設定。

  **type**: required `object`

  值： `dynamic`

  

</details>


  

</details>


  **id**: `string`

  必填。僅供輸出。互動完成的唯一識別碼。

  

<details>
<summary>**status**: `string enum` 必填。僅供輸出。互動的狀態。</summary>

  

  可能的值：

  - `in_progress`: 互動正在進行中。
  - `requires_action`: 互動需要使用者採取動作或提供輸入。
  - `completed`: 互動已完成。
  - `failed`: 互動失敗。
  - `cancelled`: 互動已取消。
  - `incomplete`: 互動已完成，但結果不完整（例如達到 max_tokens 上限）。
  - `requires_continuation`: 互動至少還需要一次要求才能完成。下一個要求應將 continuation_token 設為本次要求所傳回的權杖。

  

</details>


  **created**: `string`

  必填。僅供輸出。回應建立的時間，格式為 ISO 8601（YYYY-MM-DDThh:mm:ssZ）。

  **updated**: `string`

  必填。僅供輸出。回應最後更新的時間，格式為 ISO 8601（YYYY-MM-DDThh:mm:ssZ）。

  **system_instruction**: `string`

  互動的系統指令。

  

<details>
<summary>**tools**: `Tool array` 模型在互動期間可呼叫的工具宣告清單。</summary>

  

  **Possible Types：** 

  

<details>
<summary>**CodeExecution**</summary>

  

  模型可用來執行程式碼的工具。

  **type**: required `object`

  值： `code_execution`

  

</details>


  

<details>
<summary>**ComputerUse**</summary>

  

  模型可用來與電腦互動的工具。

  **type**: required `object`

  值： `computer_use`

  

<details>
<summary>**environment**: `string enum` 正在操作的環境。</summary>

  

  可能的值：

  - `browser`: 在網頁瀏覽器中操作。
  - `mobile`: 在行動環境中操作。
  - `desktop`: 在桌面環境中操作。

  

</details>


  **excluded_predefined_functions**: `string array`

  從模型呼叫中排除的預先定義函式清單。

  **enable_prompt_injection_detection**: `boolean`

  是否對 computer-use 要求啟用提示詞注入偵測檢查。

  

<details>
<summary>**disabled_safety_policies**: `string enum array` 選填。已停用的 computer use 安全政策。</summary>

  

  可能的值：

  - `financial_transactions`: 金融交易的安全政策。
  - `sensitive_data_modification`: 敏感資料修改的安全政策。
  - `communication_tool`: 通訊工具的安全政策（例如 Gmail、Chat、Meet）。
  - `account_creation`: 帳號建立的安全政策。
  - `data_modification`: 資料修改的安全政策。
  - `user_consent_management`: 使用者同意管理的安全政策。
  - `legal_terms_and_agreements`: 法律條款與協議的安全政策。

  

</details>


  

</details>


  

<details>
<summary>**FileSearch**</summary>

  

  模型可用來搜尋檔案的工具。

  **type**: required `object`

  值： `file_search`

  **file_search_store_names**: `string array`

  要搜尋的 file search store 名稱。

  **top_k**: `integer`

  要擷取的語意檢索區塊數量。

  **metadata_filter**: `string`

  要套用到語意檢索文件與區塊的中繼資料篩選條件。

  

</details>


  

<details>
<summary>**Function**</summary>

  

  模型可使用的工具。

  **type**: required `object`

  值： `function`

  **name**: `string`

  函式的名稱。

  **description**: `string`

  函式的說明。

  **parameters**: `object`

  函式參數的 JSON Schema。支援 JSON Schema 的子集。`minLength`、`maxLength`、`minProperties`、`maxProperties`、`uniqueItems`、`contains`、`minContains` 與 `maxContains` 會被忽略且不強制執行。

  

</details>


  

<details>
<summary>**GoogleMaps**</summary>

  

  模型可用來呼叫 Google Maps 的工具。

  **type**: required `object`

  值： `google_maps`

  **enable_widget**: `boolean`

  是否在回應的工具呼叫結果中傳回 widget 上下文權杖。

  **latitude**: `number`

  使用者所在位置的緯度。

  **longitude**: `number`

  使用者所在位置的經度。

  

</details>


  

<details>
<summary>**GoogleSearch**</summary>

  

  模型可用來搜尋 Google 的工具。

  **type**: required `object`

  值： `google_search`

  

<details>
<summary>**search_types**: `string enum array` 要啟用的搜尋接地類型。</summary>

  

  可能的值：

  - `web_search`: 設定此欄位可啟用網頁搜尋。只傳回文字結果。
  - `image_search`: 設定此欄位可啟用圖片搜尋。會傳回圖片位元組。

  

</details>


  

</details>


  

<details>
<summary>**McpServer**</summary>

  

  MCPServer 是模型可呼叫來執行動作的伺服器。

  **type**: required `object`

  值： `mcp_server`

  **name**: `string`

  MCPServer 的名稱。

  **url**: `string`

  MCPServer 端點的完整 URL。範例："https://api.example.com/mcp"

  **headers**: `object`

  選填：視需要提供驗證標頭、逾時等欄位。

  

<details>
<summary>**allowed_tools**: `AllowedTools array` 允許使用的工具。</summary>

  

  

<details>
<summary>**mode**: `string enum` 工具選擇的模式。</summary>

  

  可能的值：

  - `auto`: 自動工具選擇。
  - `any`: 任意工具選擇。
  - `none`: 不選擇工具。
  - `validated`: 已驗證的工具選擇。

  

</details>


  **tools**: `string array`

  允許使用的工具名稱。

  

</details>


  

</details>


  

<details>
<summary>**UrlContext**</summary>

  

  模型可用來擷取 URL 上下文的工具。

  **type**: required `object`

  值： `url_context`

  

</details>


  

</details>


  

<details>
<summary>**response_format**: `ResponseFormat` or `ResponseFormat array` 強制產生的回應為符合此欄位所指定 JSON schema 的 JSON 物件。</summary>

  

  **Possible Types：** 

  

<details>
<summary>**AudioResponseFormat**</summary>

  

  音訊輸出格式的設定。

  **type**: required `object`

  值： `audio`

  

<details>
<summary>**mime_type**: `string enum` 音訊輸出的 MIME 類型。</summary>

  

  可能的值：

  - `audio/mp3`: MP3 音訊格式。
  - `audio/ogg_opus`: OGG Opus 音訊格式。
  - `audio/l16`: 原始 PCM（L16）音訊格式。
  - `audio/wav`: WAV 音訊格式。
  - `audio/alaw`: A-law 音訊格式。
  - `audio/mulaw`: Mu-law 音訊格式。

  

</details>


  

<details>
<summary>**delivery**: `string enum` 音訊輸出的傳遞模式。</summary>

  

  可能的值：

  - `inline`: 音訊資料會在回應中以行內方式傳回。
  - `uri`: 音訊資料會以 URI 形式傳回。

  

</details>


  **sample_rate**: `integer`

  取樣率，單位為 Hz。

  **bit_rate**: `integer`

  位元率，單位為每秒位元數（bps）。只適用於壓縮格式（MP3、Opus）。

  

</details>


  

<details>
<summary>**ImageResponseFormat**</summary>

  

  圖片輸出格式的設定。

  **type**: required `object`

  值： `image`

  

<details>
<summary>**mime_type**: `string enum` 圖片輸出的 MIME 類型。</summary>

  

  可能的值：

  - `image/jpeg`: JPEG 圖片格式。

  

</details>


  

<details>
<summary>**delivery**: `string enum` 圖片輸出的傳遞模式。</summary>

  

  可能的值：

  - `inline`: 圖片資料會在回應中以行內方式傳回。
  - `uri`: 圖片資料會以 URI 形式傳回。

  

</details>


  

<details>
<summary>**aspect_ratio**: `string enum` 圖片輸出的長寬比。</summary>

  

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

  

</details>


  

<details>
<summary>**image_size**: `string enum` 圖片輸出的大小。</summary>

  

  可能的值：

  - `512`: 512px 圖片大小。
  - `1K`: 1K 圖片大小。
  - `2K`: 2K 圖片大小。
  - `4K`: 4K 圖片大小。

  

</details>


  

</details>


  

<details>
<summary>**TextResponseFormat**</summary>

  

  文字輸出格式的設定。

  **type**: required `object`

  值： `text`

  

<details>
<summary>**mime_type**: `string enum` 文字輸出的 MIME 類型。</summary>

  

  可能的值：

  - `application/json`: JSON 輸出格式。
  - `text/plain`: 純文字輸出格式。

  

</details>


  **schema**: `object`

  輸出應符合的 JSON schema。只在 mime_type 為 application/json 時適用。支援 JSON Schema 的子集。`minLength`、`maxLength`、`minProperties`、`maxProperties`、`uniqueItems`、`contains`、`minContains` 與 `maxContains` 會被忽略且不強制執行；請在您的應用程式中自行驗證這些項目。`minItems` 與 `maxItems` 會強制執行。過於複雜而無法強制執行的 schema（例如巢狀陣列上的大型 `maxItems`）會傳回 400 INVALID_ARGUMENT 錯誤。

  

</details>


  

<details>
<summary>**VideoResponseFormat**</summary>

  

  影片輸出格式的設定。

  **type**: required `object`

  值： `video`

  

<details>
<summary>**delivery**: `string enum` 影片輸出的傳遞模式。</summary>

  

  可能的值：

  - `inline`: 影片資料會在回應中以行內方式傳回。
  - `uri`: 影片資料會以 URI 形式傳回。

  

</details>


  

<details>
<summary>**aspect_ratio**: `string enum` 影片輸出的長寬比。</summary>

  

  可能的值：

  - `16:9`: 16:9 長寬比。
  - `9:16`: 9:16 長寬比。

  

</details>


  **duration**: `string`

  影片輸出的長度。

  

<details>
<summary>**resolution**: `string enum` 影片輸出解析度。預設為 720p。</summary>

  

  可能的值：

  - `360p`: 360p 解析度。
  - `720p`: 720p 解析度。
  - `1080p`: 1080p 解析度。
  - `4k`: 4K 解析度。

  

</details>


  

</details>


  

<details>
<summary>**ResponseFormat array**</summary>

  

  清單中的每個項目為下列其中之一：`AudioResponseFormat`、`ImageResponseFormat`、`TextResponseFormat`、`VideoResponseFormat`。

  

</details>


  

</details>


  **previous_interaction_id**: `string`

  先前互動的 ID（如有）。

  

<details>
<summary>**environment**: `EnvironmentConfig` or `string` 互動的環境設定。可以是指定遠端環境來源的物件，也可以是參照既有環境 ID 的字串。</summary>

  

  **Possible Types：** 

  

<details>
<summary>**EnvironmentConfig**</summary>

  

  自訂環境的設定。

  **type**: required `object`

  值： `remote`

  

<details>
<summary>**sources**: `Source array`</summary>

  

  

<details>
<summary>**type**: `string enum`</summary>

  

  可能的值：

  - `gcs`: Cloud Storage 值區。
  - `inline`: 行內內容。
  - `repository`: 一般存放區。來源 URL 中的通訊協定前綴可識別提供者（例如 github://、gcs://）。

  

</details>


  **source**: `string`

  環境的來源。對於 Cloud Storage，這是 Cloud Storage 路徑；對於 GitHub，這是 GitHub 路徑。

  **target**: `string`

  來源在環境中應出現的位置。

  **content**: `string`

  當 `type` 為 `INLINE` 時的行內內容。

  **encoding**: `string`

  行內內容的選用編碼（例如 `base64`）。

  

</details>


  

<details>
<summary>**network**: `EnvironmentNetworkEgressAllowlist` or `string enum` 環境的網路設定。</summary>

  

  **Possible Types：** 

  

<details>
<summary>**EnvironmentNetworkEgressAllowlist**</summary>

  

  環境的網路輸出設定。

  

<details>
<summary>**allowlist**: `EgressRule array` or `string enum` 允許的網域及其設定清單。設為 `"disabled"` 可封鎖所有網路輸出。</summary>

  

  **Possible Types：** 

  

<details>
<summary>**EgressRule array**</summary>

  

  單一網域允許清單規則，可選擇性注入標頭。

  **domain**: required `string`

  允許對外要求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

  **transform**: `object`

  要注入符合此規則之要求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

  **credential**: `string`

  選填。以 ID 參照伺服器管理的 Credential 資源。

  

</details>


  

<details>
<summary>**string enum**</summary>

  

  可能的值：

  - `disabled`: 所有網路輸出均遭封鎖。

  

</details>


  

</details>


  

</details>


  

<details>
<summary>**string enum**</summary>

  

  可能的值：

  - `disabled`: 所有網路輸出均遭封鎖。

  

</details>


  

</details>


  **environment_id**: `string`

  選填。互動的環境 ID。若有指定，要求會更新既有環境，而不是建立新環境。

  

<details>
<summary>**env**: `object` or `string` 要在沙箱環境中設定的環境變數。</summary>

  

  **Possible Types：** 

  

<details>
<summary>**string**</summary>

  

  直接字串值。

  

</details>


  

</details>


  

<details>
<summary>**mode**: `string enum` 此環境的運算生命週期模式。</summary>

  

  可能的值：

  - `on_demand`: 此環境的運算生命週期模式。
  - `self_hosted`: 此環境的運算生命週期模式。

  

</details>


  **custom_config**: `object`

  選填。傳遞給自託管環境輪詢器的任意客戶自訂 JSON 設定。只在 `mode` 為 `SELF_HOSTED` 時支援。

  

</details>


  

<details>
<summary>**string**</summary>

  

  直接字串值。

  

</details>


  

</details>


  **environment_id**: `string`

  僅供輸出。互動的環境 ID。只有在要求中設定了環境設定時才會填入。

  

<details>
<summary>**service_tier**: `ServiceTier` 互動的服務層級。</summary>

  

  可能的值：

  - `flex`: Flex 服務層級。
  - `standard`: Standard 服務層級。
  - `priority`: Priority 服務層級。

  

</details>


  

<details>
<summary>**webhook_config**: `WebhookConfig` 選填。用來在互動完成時接收通知的 Webhook 設定。</summary>

  

  **uris**: `string array`

  選填。若有設定，這些 webhook URI 會用於 webhook 事件，而不是已註冊的 webhook。

  **user_metadata**: `object`

  選填。每次事件發送至 webhook 時會一併傳回的使用者中繼資料。

  

</details>


  

<details>
<summary>**safety_settings**: `SafetySetting array` 互動的安全設定。</summary>

  

  

<details>
<summary>**type**: required `HarmCategory` 要封鎖的危害類別類型。</summary>

  

  可能的值：

  - `hate_speech`: 根據特定屬性，宣揚暴力或煽動對個人或群體仇恨的內容。
  - `dangerous_content`: 宣揚、協助或促成危險活動的內容。
  - `harassment`: 辱罵、威脅，或意圖霸凌、折磨或嘲弄的內容。
  - `sexually_explicit`: 含有露骨性內容的內容。
  - `jailbreak`: 旨在繞過安全篩選器的提示詞。

  

</details>


  

<details>
<summary>**threshold**: required `string enum` 封鎖內容的門檻。若危害機率超過此門檻，內容將被封鎖。</summary>

  

  可能的值：

  - `block_low_and_above`: 封鎖危害機率為低或更高的內容。
  - `block_medium_and_above`: 封鎖危害機率為中或更高的內容。
  - `block_only_high`: 只封鎖危害機率為高的內容。
  - `off`: 完全關閉安全篩選器。

  

</details>


  

<details>
<summary>**method**: `string enum` 選填。封鎖內容的方法。若未指定，預設行為是使用機率分數。</summary>

  

  可能的值：

  - `severity`: 危害封鎖方法同時使用機率與嚴重程度分數。
  - `probability`: 危害封鎖方法使用機率分數。

  

</details>


  

</details>


  **labels**: `object`

  要求中由使用者定義中繼資料的標籤。標籤鍵與值的長度不得超過 63 個字元（Unicode 碼點），且只能包含小寫字母、數字字元、底線與連字號。允許使用國際字元。標籤值為選填。標籤鍵必須以字母開頭。

  **continuation_token**: `string`

  用來繼續長時間解碼的不透明權杖。輸出：當 status 為 REQUIRES_CONTINUATION 且可繼續解碼時設定。輸入：在 CreateInteraction 中原封不動傳回最新權杖，以繼續解碼。

  **stream**: `boolean`

  僅供輸入。互動是否以串流方式傳送。

  **store**: `boolean`

  僅供輸入。是否儲存回應與要求，供日後擷取。

  **background**: `boolean`

  僅供輸入。是否在背景執行模型互動。

  

</details>


  

---


  **id**: required `string`

  僅供輸出。識別碼。觸發器的 ID。

  

---


  **display_name**: `string`

  選填。觸發器的顯示名稱。

  

---


  **environment_id**: `string`

  選填。觸發器執行所用的環境 ID。

  

---


  **max_consecutive_failures**: `integer`

  選填。觸發器自動暫停（status 變為 ERROR）前，允許的連續失敗次數上限。

  

---


  **execution_timeout_seconds**: `integer`

  選填。觸發互動的執行逾時。

  

---


  **consecutive_failure_count**: `integer`

  僅供輸出。自上次成功執行以來，已發生的連續失敗次數。

  

---


  **create_time**: `string`

  僅供輸出。觸發器建立的時間。

  

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

  僅供輸出。此觸發器所建立的上一個互動 ID。

  

---


  

<details>
<summary>**status**: `string enum` 僅供輸出。觸發器目前的狀態。</summary>

  

  可能的值：

  - `active`: 觸發器已啟用，會依排程觸發。
  - `paused`: 觸發器已暫停，不會觸發。
  - `error`: 觸發器因連續失敗而進入錯誤狀態。

  

</details>

