# 刪除批次

`DELETE` `https://generativelanguage.googleapis.com/v1beta/batches/{generateContentBatch}`

刪除長時間執行的作業。此方法表示用戶端已不再需要該作業的結果，但不會取消該作業。若伺服器不支援此方法，會傳回
`google.rpc.Code.UNIMPLEMENTED`。


  
## 參數 {#parameters}

  
  **generateContentBatch**: required `string`

  批次 ID。組成資源名稱 `batches/{generateContentBatch}`。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/batches/$BATCH_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


## 回應 {#response}

