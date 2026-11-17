# 取得憑證


!!! note " "

      此 API 處於 Beta 階段。端點位於 `/v1beta/` 之下。


`GET` `https://generativelanguage.googleapis.com/v1beta/credentials/{id}`

依 ID 取得憑證。



## 參數 {#parameters}


  **id**：必填 `string`

  構成資源 `name` 的資源 ID 區段。依 https://google.aip.dev/122 所述，此區段用於在其父集合中識別該資源。





  **範例要求**



=== "REST"

      ```sh
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/credentials/$CREDENTIAL_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```






## 回應 {#response}


  **id**：必填 `string`

  僅供輸出。識別碼。此憑證的唯一識別碼。



---



??? note "**type**：必填 `string enum` 僅供輸出。憑證的類型。"

    可能的值：

    - `bearer_token`：以標頭形式注入的靜態權杖。無更新邏輯。
    - `oauth2`：使用儲存的更新權杖，自動更新已過期的存取權杖。
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
