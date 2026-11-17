# 匯入檔案

`POST` `https://generativelanguage.googleapis.com/v1beta/fileSearchStores/{fileSearchStore}:importFile`

將 `File` 從 File Service 匯入 [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore)。


  
## 參數 {#parameters}

  
  **fileSearchStore**: required `string`

  file search store ID。組成資源名稱 `fileSearchStores/{fileSearchStore}`。

  

## 要求主體 {#request-body}

  
  **fileName**: required `string`

  要匯入的 `File` 名稱。範例：`files/abc-123`

  

---


  

??? note "**customMetadata**: `CustomMetadata array` 要與檔案相關聯的自訂中繼資料。"

      **key**: required `string`

      要儲存的中繼資料的鍵。



    ??? note "**value**: `Union type`"

          聯集欄位 `value` 只能是下列其中之一：

          **stringValue**: `string`

          要儲存的中繼資料的字串值。



        ??? note "**stringListValue**: `StringList` 要儲存的中繼資料的 StringList 值。"

            **values**: `string array`

            要儲存的中繼資料的字串值。



          **numericValue**: `number`

          要儲存的中繼資料的數值。



  

---


  

??? note "**chunkingConfig**: `ChunkingConfig` 選填。告訴服務如何將檔案分塊的設定。若未提供，服務將使用預設參數。"

    ??? note "**config**: `Union type` 要使用的分塊設定。"

          聯集欄位 `config` 只能是下列其中之一：



        ??? note "**whiteSpaceConfig**: `WhiteSpaceConfig` 空白分塊設定。"

            **maxTokensPerChunk**: `integer`

            每個區塊的權杖數量上限。在這個分塊演算法中，權杖定義為單字。注意：這裡將權杖定義為以空白分隔的單字，而非權杖化工具的輸出。截至 2025-04-17，最新 gemini 嵌入模型的上下文視窗目前為 8192 個權杖。我們假設平均每個單字為 5 個字元，因此將上限設為 2**9，即 512 個單字，或 2560 個權杖（假設最壞情況下每個字元為一個權杖）。這是保守的估計，目的是防止上下文視窗溢位。

            **maxOverlapTokens**: `integer`

            兩個相鄰區塊之間重疊權杖數量的上限。



  

  

  
  **範例要求** 

  

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/fileSearchStores/$FILE_SEARCH_STORE_ID:importFile" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
        "fileName": "string"
      }'
      ```


  


  
## 回應 {#response}

  
  

??? note "**error**: `Status` 作業失敗或取消時的錯誤結果。"

    **code**: `integer`

    狀態碼，應為 google.rpc.Code 的列舉值。

    **message**: `string`

    給開發人員看的錯誤訊息，應以英文撰寫。任何給使用者看的錯誤訊息都應本地化，並放在 google.rpc.Status.details 欄位中傳送，或由用戶端本地化。

    **details**: `object array`

    承載錯誤詳細資訊的訊息清單。API 可使用一組通用的訊息類型。



  

---


  

??? note "**response**: `ImportFileResponse`"

    **parent**: `string`

    [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 的名稱，該存放區包含 `Document`。範例：`fileSearchStores/my-file-search-store-123`

    **documentName**: `string`

    不可變更。識別碼。所匯入 `Document` 的識別碼。範例：`fileSearchStores/my-file-search-store-123/documents/my-awesome-doc-123a456b789c`



  

---


  **name**: `string`

  由伺服器指派的名稱，僅在最初傳回它的同一個服務內具唯一性。如果使用預設的 HTTP 對應，`name` 應為以 `operations/{unique_id}` 結尾的資源名稱。

  

---


  

??? note "**metadata**: `ImportFileMetadata`"




  

---


  **done**: `boolean`

  若值為 `false`，表示作業仍在進行中。若為 `true`，表示作業已完成，且 `error` 或 `response` 其中之一可供使用。

  

  

  
  **範例回應** 

  ```json
  {
    "error": {
      "code": 0,
      "message": "string",
      "details": [
        {}
      ]
    },
    "response": {
      "parent": "string",
      "documentName": "string"
    },
    "name": "string",
    "metadata": {},
    "done": true
  }
  ```

  