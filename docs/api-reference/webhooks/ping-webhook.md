# Ping webhook


!!! note " "

      此 API 目前為 Beta 版。端點位於 `/v1beta/` 之下。


`POST` `https://generativelanguage.googleapis.com/v1beta/webhooks/{id}:ping`

將 ping 事件傳送至 Webhook。


  
## 參數 {#parameters}

  
  **id**: required `string`

  要 ping 的 webhook ID。

  

  

  
  **請求範例** 

  

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/webhooks/$WEBHOOK_ID:ping" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


## 回應 {#response}

