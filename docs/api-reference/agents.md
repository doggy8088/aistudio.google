# Gemini Agents API


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/`。


代理是運用 Gemini 模型、一組工具與推理能力的系統，能執行複雜的多步驟任務並達成特定目標。與單次模型呼叫不同，代理可以規劃、執行一連串動作、與外部系統互動，並彙整資訊以完成使用者的請求。

## 方法 {#methods}


| 方法 | HTTP 要求 |
| --- | --- |
| [建立代理](/api-reference/agents/create-agent/) | `POST` `/v1beta/agents` 建立新的代理（SDK 的具型別版本）。 |
| [列出代理](/api-reference/agents/list-agents/) | `GET` `/v1beta/agents` 列出所有代理。 |
| [取得代理](/api-reference/agents/get-agent/) | `GET` `/v1beta/agents/{agentsId}` 取得特定的代理。 |
| [刪除代理](/api-reference/agents/delete-agent/) | `DELETE` `/v1beta/agents/{agentsId}` 刪除代理。 |


## 資源 {#resources}

### Agent {#Resource:Agent}

CreateAgent API 的代理定義。
此訊息是以註解剖析器為基礎的 JSON 剖析目標。
新格式：

```json
{
  "id": "customer-sentinel",
  "base_agent": "",
  "system_instruction": "...",
  "base_environment": { "type": "remote", "sources": [...] },
  "tools": [ {"type": "code_execution"} ]
}
```

**屬性：**


  **id**: `string`

  代理的唯一識別碼。

  

---


  **base_agent**: `string`

  要擴充的基礎代理。

  

---


  **system_instruction**: `string`

  代理的系統指令。

  

---


  **description**: `string`

  供開發人員快速閱讀與理解的代理說明。

  

---


  

<details>
<summary>**agent_config**: `AntigravityAgentConfig` 代理的設定參數。</summary>

  

  **type**: required `object`

  值： `antigravity`

  **model**: `string`

  代理推理所使用的模型。

  **max_total_tokens**: `string`

  代理執行期間的權杖總數上限。

  

</details>


  

---


  

<details>
<summary>**base_environment**: `EnvironmentConfig` or `string` 代理的環境設定。</summary>

  

  **可能的類型：** 

  

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
  - `repository`: 一般儲存庫。來源 URL 中的通訊協定前置字元可識別提供者（例如 github://、gcs://）。

  

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

  

  **可能的類型：** 

  

<details>
<summary>**EnvironmentNetworkEgressAllowlist**</summary>

  

  環境的網路輸出設定。

  

<details>
<summary>**allowlist**: `EgressRule array` or `string enum` 允許的網域及其設定清單。設為 `"disabled"` 即可封鎖所有網路輸出。</summary>

  

  **可能的類型：** 

  

<details>
<summary>**EgressRule array**</summary>

  

  單一網域允許清單規則，可選擇性注入標頭。

  **domain**: required `string`

  允許送出請求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

  **transform**: `object`

  要注入至符合此規則之請求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

  **credential**: `string`

  選用。透過 ID 參照由伺服器管理的 Credential 資源。

  

</details>


  

<details>
<summary>**string enum**</summary>

  

  可能的值：

  - `disabled`: 所有網路輸出皆被封鎖。

  

</details>


  

</details>


  

</details>


  

<details>
<summary>**string enum**</summary>

  

  可能的值：

  - `disabled`: 所有網路輸出皆被封鎖。

  

</details>


  

</details>


  **environment_id**: `string`

  選用。互動的環境 ID。若有指定，請求將更新現有環境，而非建立新環境。

  

<details>
<summary>**env**: `object` or `string` 要在沙箱環境中設定的環境變數。</summary>

  

  **可能的類型：** 

  

<details>
<summary>**string**</summary>

  

  直接的字串值。

  

</details>


  

</details>


  

<details>
<summary>**mode**: `string enum` 此環境的運算生命週期模式。</summary>

  

  可能的值：

  - `on_demand`: 此環境的運算生命週期模式。
  - `self_hosted`: 此環境的運算生命週期模式。

  

</details>


  **custom_config**: `object`

  選用。傳遞至自行託管環境輪詢器的任意客戶自訂 JSON 設定。僅在 `mode` 為 `SELF_HOSTED` 時支援。

  

</details>


  

<details>
<summary>**string**</summary>

  

  直接的字串值。

  

</details>


  

</details>


  

---


  

<details>
<summary>**tools**: `AgentTool array` 代理可使用的工具。</summary>

  

  **可能的類型：** 

  

<details>
<summary>**CodeExecution**</summary>

  

  模型可用來執行程式碼的工具。

  **type**: required `object`

  值： `code_execution`

  

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

  函式參數的 JSON Schema。支援 JSON Schema 的子集。 `minLength`, `maxLength`, `minProperties`, `maxProperties`, `uniqueItems`, `contains`, `minContains`, and `maxContains` 會被忽略且不強制執行。

  

</details>


  

<details>
<summary>**GoogleSearch**</summary>

  

  模型可用來搜尋 Google 的工具。

  **type**: required `object`

  值： `google_search`

  

<details>
<summary>**search_types**: `string enum array` 要啟用的搜尋接地類型。</summary>

  

  可能的值：

  - `web_search`: 設定此欄位可啟用網路搜尋。僅傳回文字結果。
  - `image_search`: 設定此欄位可啟用圖片搜尋。傳回圖片位元組。

  

</details>


  

</details>


  

<details>
<summary>**McpServer**</summary>

  

  MCPServer 是模型可呼叫以執行動作的伺服器。

  **type**: required `object`

  值： `mcp_server`

  **name**: `string`

  MCPServer 的名稱。

  **url**: `string`

  MCPServer 端點的完整 URL。範例： "https://api.example.com/mcp"

  **headers**: `object`

  選用：視需要提供驗證標頭、逾時等欄位。

  

<details>
<summary>**allowed_tools**: `AllowedTools array` 允許的工具。</summary>

  

  

<details>
<summary>**mode**: `string enum` 工具選擇的模式。</summary>

  

  可能的值：

  - `auto`: 自動選擇工具。
  - `any`: 任一工具選擇。
  - `none`: 不選擇工具。
  - `validated`: 經驗證的工具選擇。

  

</details>


  **tools**: `string array`

  允許的工具名稱。

  

</details>


  

</details>


  

<details>
<summary>**UrlContext**</summary>

  

  模型可用來取得 URL 內容脈絡的工具。

  **type**: required `object`

  值： `url_context`

  

</details>


  

</details>


