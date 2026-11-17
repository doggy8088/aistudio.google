# 輪換 webhook 簽章密鑰


!!! note " "

      此 API 目前為 Beta 版。端點位於 `/v1beta/` 之下。


`POST` `https://generativelanguage.googleapis.com/v1beta/webhooks/{id}:rotateSigningSecret`

為 Webhook 產生新的簽章密鑰。


  
## 參數 {#parameters}

  
  **id**: required `string`

  要為其產生簽章密鑰的 webhook ID。

  

  

  
  **請求範例** 

  

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/webhooks/$WEBHOOK_ID:rotateSigningSecret" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


  
## 回應 {#response}

  
  **secret**: `string`

  僅供輸出。新產生的簽章密鑰。

  

  

  
  **回應範例** 

  ```json
  {
    "secret": "string"
  }
  ```

  
