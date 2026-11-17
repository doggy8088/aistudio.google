# 上傳環境檔案


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 之下。


`PUT` `https://generativelanguage.googleapis.com/upload/v1beta/environments/{environment}/files/{path}`

為環境工作區中的檔案啟動可續傳的上傳工作階段。
請將檔案位元組上傳至 `X-Goog-Upload-URL`
回應標頭所傳回的 URL，並使用可續傳上傳通訊協定。


  
## 參數 {#parameters}

  
  **X-Goog-Upload-Command**: required `string`

  啟動可續傳上傳工作階段的指令。

  預設值：`start`

  

---


  **X-Goog-Upload-Header-Content-Length**: required `integer`

  將上傳至工作階段 URL 的檔案位元組總數。

  

---


  **X-Goog-Upload-Header-Content-Type**: required `string`

  將上傳至工作階段 URL 的檔案 MIME 類型。

  

---


  **X-Goog-Upload-Protocol**: required `string`

  可續傳上傳通訊協定選擇器。

  預設值：`resumable`

  

---


  **extract**: `boolean`

  選填。若為 true，會將上傳的檔案視為 tar/tar.gz 封存檔，並解壓縮至 `path`。

  

---


  **overwrite**: `boolean`

  選填。若目的地檔案已存在，是否覆寫該檔案。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl -i -X PUT \
        'https://generativelanguage.googleapis.com/upload/v1beta/environments/env_abc123/files/main.py?overwrite=true' \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'X-Goog-Upload-Protocol: resumable' \
        -H 'X-Goog-Upload-Command: start' \
        -H "X-Goog-Upload-Header-Content-Length: $(wc -c < main.py)" \
        -H 'X-Goog-Upload-Header-Content-Type: text/x-python'
      ```


  


## 回應 {#response}

空回應。

