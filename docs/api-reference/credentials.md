# Gemini Credentials API


!!! note " "

      此 API 處於 Beta 階段。端點位於 `/v1beta/` 之下。


Credentials API 可讓你建立、擷取、更新、列出及刪除由伺服器管理的憑證（例如 API 金鑰、OAuth2 權杖、HTTP Bearer 權杖與環境變數），用來驗證工具呼叫與 MCP 伺服器。

## 方法 {#methods}


| 方法 | HTTP 要求 |
| --- | --- |
| [建立憑證](/api-reference/credentials/create-credential/) | `POST` `/v1beta/credentials` 建立新的憑證。 |
| [列出憑證](/api-reference/credentials/list-credentials/) | `GET` `/v1beta/credentials` 列出憑證。 |
| [取得憑證](/api-reference/credentials/get-credential/) | `GET` `/v1beta/credentials/{id}` 依 ID 取得憑證。 |
| [更新憑證](/api-reference/credentials/update-credential/) | `PATCH` `/v1beta/credentials/{id}` 更新憑證。 |
| [刪除憑證](/api-reference/credentials/delete-credential/) | `DELETE` `/v1beta/credentials/{id}` 刪除憑證。 |


## 資源 {#resources}

### Credential {#Resource:Credential}

儲存在 Secret Manager 中、由伺服器管理的憑證資源。

**屬性**：


  **id**：必填 `string`

  僅供輸出。識別碼。此憑證的唯一識別碼。



---



<details>
<summary>**type**：必填 `string enum` 僅供輸出。憑證的類型。</summary>



  可能的值：

  - `bearer_token`：以標頭形式注入的靜態權杖。無更新邏輯。
  - `oauth2`：使用儲存的更新權杖，自動更新已過期的存取權杖。
  - `environment_variable`：注入沙箱容器的環境變數。



</details>




---


<details>
<summary>**status**：`string enum` 僅供輸出。憑證目前的狀態。</summary>



  可能的值：

  - `active`：憑證處於啟用狀態，可供使用。
  - `revoked`：憑證已遭撤銷，不再有效。



</details>




---


  **create_time**：`string`

  僅供輸出。憑證建立的時間戳記。



---


  **update_time**：`string`

  僅供輸出。憑證上次更新的時間戳記。
