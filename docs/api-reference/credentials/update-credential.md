# 更新憑證


!!! note " "

      此 API 處於 Beta 階段。端點位於 `/v1beta/` 之下。


`PATCH` `https://generativelanguage.googleapis.com/v1beta/credentials/{id}`

更新憑證。



## 參數 {#parameters}


  **id**：必填 `string`

  構成資源 `name` 的資源 ID 區段。依 https://google.aip.dev/122 所述，此區段用於在其父集合中識別該資源。



---


  **update_mask**：`string`

  選填。要更新的欄位清單。

## 要求主體 {#request-body}


  要求主體的結構取決於互動模式：



??? note "**EnvironmentVariableUpdateConfig**"

      用於更新環境變數憑證的設定。

      **type**：必填 `object`

      值：`environment_variable`



    ---


      **value**：`string`

      選填。僅供輸入。環境變數的機密值。僅供寫入；不會在回應中傳回。



    ---


      **trusted_domains**：`string array`

      選填。允許在 HTTP 要求中接收此環境變數值的網域清單。



    ---



    ??? note "**injection_location**：`InjectionLocation` 或 `InjectionLocation array` 選填。可將環境變數注入外送 HTTP 要求的位置。可接受單一位置（例如 'header'）或位置陣列。"

          **可能的類型**：



        ??? note "**InjectionLocation**"

            可能的值：

            - `header`：注入 HTTP 要求標頭。
            - `query`：注入 HTTP URL 查詢參數。
            - `body`：注入 HTTP 要求主體。





        ??? note "**InjectionLocation array**"

            可能的值：

            - `header`：注入 HTTP 要求標頭。
            - `query`：注入 HTTP URL 查詢參數。
            - `body`：注入 HTTP 要求主體。





??? note "**HttpBearerUpdateConfig**"

      用於更新 HTTP Bearer token 憑證的設定。

      **type**：必填 `object`

      值：`bearer_token`



    ---


      **token**：`string`

      選填。僅供輸入。靜態 Bearer token。僅供寫入；不會在回應中傳回。



    ---


      **header_name**：`string`

      選填。要注入 token 的標頭名稱。預設為 'Authorization'。



    ---


      **prefix**：`string`

      選填。要加在 token 前面的前綴。預設為 'Bearer'。設為 '' 表示不加前綴。





??? note "**OAuth2UpdateConfig**"

      用於更新 OAuth2 憑證的設定。

      **type**：必填 `object`

      值：`oauth2`



    ---


      **client_id**：`string`

      選填。OAuth2 用戶端 ID。



    ---


      **client_secret**：`string`

      選填。僅供輸入。OAuth2 用戶端密鑰。僅供寫入；不會在回應中傳回。



    ---


      **refresh_token**：`string`

      選填。僅供輸入。OAuth2 更新 token。僅供寫入；不會在回應中傳回。



    ---


      **token_url**：`string`

      選填。用於更新存取 token 的 OAuth2tokens 端點 URL。



    ---


      **scopes**：`string array`

      選填。OAuth2 範圍清單。







  **範例要求**



=== "REST"

      ```sh
      curl -X PATCH "https://generativelanguage.googleapis.com/v1beta/credentials/$CREDENTIAL_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
        "type": "environment_variable"
      }'
      ```






## 回應 {#response}


  **id**：必填 `string`

  僅供輸出。識別碼。此憑證的唯一識別碼。



---



??? note "**type**：必填 `string enum` 僅供輸出。憑證的類型。"

    可能的值：

    - `bearer_token`：以標頭形式注入的靜態 token。無更新邏輯。
    - `oauth2`：使用儲存的更新 token，自動更新已過期的存取 token。
    - `environment_variable`：注入沙箱容器的環境變數。





---


??? note "**status**：`string enum` 僅供輸出。憑證目前的狀態。"

    可能的值：

    - `active`：憑證處於啟用狀態，可供使用。
    - `revoked`：憑證已遭撤銷，不再有效。





---


  **create_time**：`string`

  僅供輸出。憑證建立的時間戳記。



---


  **update_time**：`string`

  僅供輸出。憑證上次更新的時間戳記。




  **範例回應**

  ```json
  {
    "id": "string",
    "type": "bearer_token",
    "status": "active",
    "create_time": "string",
    "update_time": "string"
  }
  ```
