# 刪除 webhook


!!! note " "

      此 API 目前為 Beta 版。端點位於 `/v1beta/` 之下。


`DELETE` `https://generativelanguage.googleapis.com/v1beta/webhooks/{id}`

刪除 Webhook。


  
## 參數 {#parameters}

  
  **id**: required `string`

  要刪除的 webhook ID。

  

  

  
  **請求範例** 

  

=== "REST"

      ```sh
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/webhooks/$WEBHOOK_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


## 回應 {#response}

