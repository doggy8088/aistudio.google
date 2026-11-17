# 取消批次

`POST` `https://generativelanguage.googleapis.com/v1beta/batches/{generateContentBatch}:cancel`

對長時間執行的作業啟動非同步取消。伺服器會盡力取消該作業，但不保證一定成功。若伺服器不支援此方法，會傳回
`google.rpc.Code.UNIMPLEMENTED`。用戶端可以使用
Operations.GetOperation 或
其他方法，檢查取消是否成功，或作業是否在取消後仍已完成。成功取消後，
作業不會被刪除，而是會變成一個作業，其
Operation.error 值中的 google.rpc.Status.code 為 `1`，
對應 `Code.CANCELLED`。


  
## 參數 {#parameters}

  
  **generateContentBatch**: required `string`

  批次 ID。組成資源名稱 `batches/{generateContentBatch}`。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/batches/$BATCH_ID:cancel" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


## 回應 {#response}

