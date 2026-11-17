# 刪除憑證


!!! note " "

      此 API 處於 Beta 階段。端點位於 `/v1beta/` 之下。


`DELETE` `https://generativelanguage.googleapis.com/v1beta/credentials/{id}`

刪除憑證。



## 參數 {#parameters}


  **id**：必填 `string`

  構成資源 `name` 的資源 ID 區段。依 https://google.aip.dev/122 所述，此區段用於在其父集合中識別該資源。





  **範例要求**



=== "REST"

      ```sh
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/credentials/$CREDENTIAL_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```






## 回應 {#response}

