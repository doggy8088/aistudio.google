# 刪除 file search store

`DELETE` `https://generativelanguage.googleapis.com/v1beta/fileSearchStores/{fileSearchStore}`

刪除 [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore)。


  
## 參數 {#parameters}

  
  **fileSearchStore**: required `string`

  file search store ID。組成資源名稱 `fileSearchStores/{fileSearchStore}`。

  

---


  **force**: `boolean`

  選填。若設為 true，任何 `Document` 和與此 [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 相關的物件也會一併刪除。若為 false（預設值），將傳回 `FAILED_PRECONDITION` 錯誤（若 [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 含有任何 `Document`）。

  

  

  
  **範例要求** 

  

=== "REST"

      ```sh
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/fileSearchStores/$FILE_SEARCH_STORE_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


## 回應 {#response}

