# 檔案搜尋儲存庫

File Search API 提供代管問答服務，讓你使用 Google 的基礎架構建構檢索增強生成（RAG）系統。

## 方法 {#methods}


| 方法 | HTTP 要求 |
| --- | --- |
| [建立檔案搜尋儲存庫](/api-reference/file-search/file-search-stores/create-file-search-store/) | `POST` `/v1beta/fileSearchStores` 建立一個空的 [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore)。 |
| [刪除檔案搜尋儲存庫](/api-reference/file-search/file-search-stores/delete-file-search-store/) | `DELETE` `/v1beta/fileSearchStores/{fileSearchStore}` 刪除 [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore)。 |
| [取得檔案搜尋儲存庫](/api-reference/file-search/file-search-stores/get-file-search-store/) | `GET` `/v1beta/fileSearchStores/{fileSearchStore}` 取得特定 [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 的資訊。 |
| [列出檔案搜尋儲存庫](/api-reference/file-search/file-search-stores/list-file-search-stores/) | `GET` `/v1beta/fileSearchStores` 列出使用者擁有的所有 `FileSearchStores`。 |
| [匯入檔案](/api-reference/file-search/file-search-stores/import-file/) | `POST` `/v1beta/fileSearchStores/{fileSearchStore}:importFile` 將 `File` 從 File Service 匯入 [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore)。 |
| [取得作業](/api-reference/file-search/file-search-stores/get-file-search-store-operation/) | `GET` `/v1beta/fileSearchStores/{fileSearchStore}/operations/{operation}` 取得長時間執行作業的最新狀態。 |
| [取得上傳作業](/api-reference/file-search/file-search-stores/get-file-search-store-upload-operation/) | `GET` `/v1beta/fileSearchStores/{fileSearchStoresId}/upload/operations/{operationsId}` 取得長時間執行作業的最新狀態。 |
| [上傳至檔案搜尋儲存庫](/api-reference/file-search/file-search-stores/upload-to-file-search-store/) | `POST` `/v1beta/fileSearchStores/{fileSearchStore}:uploadToFileSearchStore` 將資料上傳至 FileSearchStore，經過預處理與分塊後，儲存至 FileSearchStore Document 中。 |


## 資源 {#resources}

### FileSearchStore {#Resource:FileSearchStore}

[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 是 `Document` 的集合。

**屬性**：


  **name**: `string`

  僅供輸出。不可變動。識別碼。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 的資源名稱。這是 ID（名稱不含 "fileSearchStores/" 前置字串），最多可包含 40 個字元，限小寫英數字元或連字號 (-)。僅供輸出。唯一名稱會由 `display_name` 加上 12 個字元的隨機後置字串衍生而來。範例：`fileSearchStores/my-awesome-file-search-store-123a456b789c`。若未提供 `display_name`，名稱將隨機產生。

  

---


  **displayName**: `string`

  選填。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 的人類可讀顯示名稱。顯示名稱的長度不得超過 512 個字元（含空格）。範例："Docs on Semantic Retriever"

  

---


  **createTime**: `string`

  僅供輸出。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 建立時間的時間戳記。

  

---


  **updateTime**: `string`

  僅供輸出。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 上次更新的時間戳記。

  

---


  **activeDocumentsCount**: `string`

  僅供輸出。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 中處於有效狀態、可供擷取的文件數量。

  

---


  **pendingDocumentsCount**: `string`

  僅供輸出。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 中正在處理的文件數量。

  

---


  **failedDocumentsCount**: `string`

  僅供輸出。[`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 中處理失敗的文件數量。

  

---


  **sizeBytes**: `string`

  僅供輸出。匯入 [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 的原始位元組大小。這是 [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 中所有文件的總大小。

  

---


  **embeddingModel**: `string`

  選填。用於 [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 的嵌入模型。模型的資源名稱，作為要使用的 Model 的 ID。格式：`models/{model}`。若未指定，將使用預設的嵌入模型。
