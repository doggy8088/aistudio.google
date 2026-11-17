# 刪除文件

`DELETE` `https://generativelanguage.googleapis.com/v1beta/fileSearchStores/{fileSearchStore}/documents/{document}`

刪除 [`Document`](/api-reference/file-search/documents/#Resource:Document)。


  
## 參數 {#parameters}

  
  **document**: required `string`

  文件 ID。組成資源名稱 `fileSearchStores/{fileSearchStore}/documents/{document}`。

  

---


  **fileSearchStore**: required `string`

  file search store ID。組成資源名稱 `fileSearchStores/{fileSearchStore}`。

  

---


  **force**: `boolean`

  選填。若設為 true，任何 `Chunk` 和與此 [`Document`](/api-reference/file-search/documents/#Resource:Document) 相關的物件也會一併刪除。若為 false（預設值），將傳回 `FAILED_PRECONDITION` 錯誤（若 [`Document`](/api-reference/file-search/documents/#Resource:Document) 含有任何 `Chunk`）。

  

  

  
  **範例要求** 

  

=== "REST"

      ```sh
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/fileSearchStores/$FILE_SEARCH_STORE_ID/documents/$DOCUMENT_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


## 回應 {#response}

