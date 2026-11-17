# 建立 file search store

`POST` `https://generativelanguage.googleapis.com/v1beta/fileSearchStores`

建立空的 [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore)。


  
## 要求主體 {#request-body}

  
  **displayName**: `string`

  選填。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 方便閱讀的顯示名稱。顯示名稱長度不得超過 512 個字元（含空格）。範例："Docs on Semantic Retriever"

  

---


  **embeddingModel**: `string`

  選填。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 要使用的嵌入模型，即模型的資源名稱，作為要使用之 Model 的 ID。格式：`models/{model}`。若未指定，將使用預設的嵌入模型。

  

  

  
  **範例要求** 

  

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/fileSearchStores" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


  
## 回應 {#response}

  
  **name**: `string`

  僅供輸出。不可變更。識別碼。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 資源名稱。這是 ID（名稱去除 "fileSearchStores/" 前綴的部分），最多可包含 40 個字元，限小寫英數字元或連字號 (-)。此欄位僅供輸出。唯一名稱將從 `display_name` 衍生，並加上 12 個字元的隨機後綴。範例：`fileSearchStores/my-awesome-file-search-store-123a456b789c` 若未提供 `display_name`，名稱將隨機產生。

  

---


  **displayName**: `string`

  選填。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 方便閱讀的顯示名稱。顯示名稱長度不得超過 512 個字元（含空格）。範例："Docs on Semantic Retriever"

  

---


  **createTime**: `string`

  僅供輸出。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 建立的時間戳記。

  

---


  **updateTime**: `string`

  僅供輸出。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 最後更新的時間戳記。

  

---


  **activeDocumentsCount**: `string`

  僅供輸出。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 中處於有效狀態且可供擷取的文件數量。

  

---


  **pendingDocumentsCount**: `string`

  僅供輸出。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 中正在處理的文件數量。

  

---


  **failedDocumentsCount**: `string`

  僅供輸出。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 中處理失敗的文件數量。

  

---


  **sizeBytes**: `string`

  僅供輸出。匯入 [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 的原始位元組大小，即 [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 中所有文件的總大小。

  

---


  **embeddingModel**: `string`

  選填。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 要使用的嵌入模型，即模型的資源名稱，作為要使用之 Model 的 ID。格式：`models/{model}`。若未指定，將使用預設的嵌入模型。

  

  

  
  **範例回應** 

  ```json
  {
    "name": "string",
    "displayName": "string",
    "createTime": "string",
    "updateTime": "string",
    "activeDocumentsCount": "string",
    "pendingDocumentsCount": "string",
    "failedDocumentsCount": "string",
    "sizeBytes": "string",
    "embeddingModel": "string"
  }
  ```

  
