# 列出檔案搜尋儲存庫

`GET` `https://generativelanguage.googleapis.com/v1beta/fileSearchStores`

列出使用者擁有的所有 `FileSearchStores`。


  
## 參數 {#parameters}

  
  **pageSize**: `integer`

  選填。每頁最多傳回的 `FileSearchStores` 數量。服務實際傳回的 `FileSearchStores` 數量可能較少。若未指定，最多傳回 10 個 `FileSearchStores`。每頁的數量上限為 20 個 `FileSearchStores`。

  

---


  **pageToken**: `string`

  選填。從先前的 `ListFileSearchStores` 呼叫取得的分頁權杖。將回應中傳回的 `next_page_token` 作為引數傳入下一個要求，即可擷取下一頁。分頁時，提供給 `ListFileSearchStores` 的所有其他參數，都必須與提供該分頁權杖的那次呼叫相同。

  

  

  
  **範例要求** 

  

=== "REST"

      ```sh
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/fileSearchStores" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


  
## 回應 {#response}

  
  **fileSearchStores**: [`FileSearchStore`](/api-reference/file-search/file-search-stores/list-file-search-stores/#Resource:FileSearchStore) `array`

  傳回的 rag_stores。

  

---


  **nextPageToken**: `string`

  可作為 `page_token` 傳送以擷取下一頁的權杖。若省略此欄位，表示沒有更多頁面。

  

  

  
  **範例回應** 

  ```json
  {
    "fileSearchStores": [
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
    ],
    "nextPageToken": "string"
  }
  ```

  


## 資源 {#resources}

### FileSearchStore {#Resource:FileSearchStore}

[`FileSearchStore`](/api-reference/file-search/file-search-stores/list-file-search-stores/#Resource:FileSearchStore) 是 `Document` 的集合。

**屬性**：


  **name**: `string`

  僅供輸出。不可變動。識別碼。[`FileSearchStore`](/api-reference/file-search/file-search-stores/list-file-search-stores/#Resource:FileSearchStore) 的資源名稱。這是 ID（名稱不含 "fileSearchStores/" 前置字串），最多可包含 40 個字元，限小寫英數字元或連字號 (-)。僅供輸出。唯一名稱會由 `display_name` 加上 12 個字元的隨機後置字串衍生而來。範例：`fileSearchStores/my-awesome-file-search-store-123a456b789c`。若未提供 `display_name`，名稱將隨機產生。

  

---


  **displayName**: `string`

  選填。[`FileSearchStore`](/api-reference/file-search/file-search-stores/list-file-search-stores/#Resource:FileSearchStore) 的人類可讀顯示名稱。顯示名稱的長度不得超過 512 個字元（含空格）。範例："Docs on Semantic Retriever"

  

---


  **createTime**: `string`

  僅供輸出。[`FileSearchStore`](/api-reference/file-search/file-search-stores/list-file-search-stores/#Resource:FileSearchStore) 建立時間的時間戳記。

  

---


  **updateTime**: `string`

  僅供輸出。[`FileSearchStore`](/api-reference/file-search/file-search-stores/list-file-search-stores/#Resource:FileSearchStore) 上次更新的時間戳記。

  

---


  **activeDocumentsCount**: `string`

  僅供輸出。[`FileSearchStore`](/api-reference/file-search/file-search-stores/list-file-search-stores/#Resource:FileSearchStore) 中處於有效狀態、可供擷取的文件數量。

  

---


  **pendingDocumentsCount**: `string`

  僅供輸出。[`FileSearchStore`](/api-reference/file-search/file-search-stores/list-file-search-stores/#Resource:FileSearchStore) 中正在處理的文件數量。

  

---


  **failedDocumentsCount**: `string`

  僅供輸出。[`FileSearchStore`](/api-reference/file-search/file-search-stores/list-file-search-stores/#Resource:FileSearchStore) 中處理失敗的文件數量。

  

---


  **sizeBytes**: `string`

  僅供輸出。匯入 [`FileSearchStore`](/api-reference/file-search/file-search-stores/list-file-search-stores/#Resource:FileSearchStore) 的原始位元組大小。這是 [`FileSearchStore`](/api-reference/file-search/file-search-stores/list-file-search-stores/#Resource:FileSearchStore) 中所有文件的總大小。

  

---


  **embeddingModel**: `string`

  選填。用於 [`FileSearchStore`](/api-reference/file-search/file-search-stores/list-file-search-stores/#Resource:FileSearchStore) 的嵌入模型。模型的資源名稱，作為要使用的 Model 的 ID。格式：`models/{model}`。若未指定，將使用預設的嵌入模型。
