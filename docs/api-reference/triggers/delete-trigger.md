# 刪除觸發器


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 下。


`DELETE` `https://generativelanguage.googleapis.com/v1beta/triggers/{id}`

刪除觸發器。



## 參數 {#parameters}


  **id**: required `string`

  觸發器的資源名稱。






  **範例要求**



=== "REST"

      ```sh
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/triggers/$TRIGGER_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```





## 回應 {#response}

