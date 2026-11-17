# 上傳至檔案搜尋儲存庫

`POST` `https://generativelanguage.googleapis.com/v1beta/fileSearchStores/{fileSearchStore}:uploadToFileSearchStore`

將資料上傳至 FileSearchStore，經過預處理與分塊後，儲存至 FileSearchStore Document 中。


  
## 參數 {#parameters}

  
  **fileSearchStore**: 必填 `string`

  檔案搜尋儲存庫的 ID，組成資源名稱 `fileSearchStores/{fileSearchStore}`。

  

## 要求主體 {#request-body}

  
  **displayName**: `string`

  選填。所建立文件的顯示名稱。

  

---


  

<details>
<summary>**customMetadata**: `CustomMetadata array` 要與資料建立關聯的自訂中繼資料。</summary>

  

  **key**: 必填 `string`

  要儲存的中繼資料鍵。

  

<details>
<summary>**value**: `Union type`</summary>

  

  聯合欄位 `value` 只能是下列其中之一：

  **stringValue**: `string`

  要儲存的中繼資料字串值。

  

<details>
<summary>**stringListValue**: `StringList` 要儲存的中繼資料 StringList 值。</summary>

  

  **values**: `string array`

  要儲存的中繼資料字串值。

  

</details>


  **numericValue**: `number`

  要儲存的中繼資料數值。

  

</details>


  

</details>


  

---


  

<details>
<summary>**chunkingConfig**: `ChunkingConfig` 選填。告訴服務如何分塊資料的設定。若未提供，服務將使用預設參數。</summary>

  

  

<details>
<summary>**config**: `Union type` 要使用的分塊設定。</summary>

  

  聯合欄位 `config` 只能是下列其中之一：

  

<details>
<summary>**whiteSpaceConfig**: `WhiteSpaceConfig` 空白字元分塊設定。</summary>

  

  **maxTokensPerChunk**: `integer`

  每個分塊的權杖數量上限。在此分塊演算法中，權杖定義為單字。注意：這裡將權杖定義為以空白字元切分的單字，而非分詞器的輸出結果。截至 2025-04-17，最新 Gemini 嵌入模型的上下文視窗目前為 8192 個權杖。我們假設平均每個單字為 5 個字元，因此將上限設為 2**9，即 512 個單字，或 2560 個權杖（以最壞情況估算，即每個字元一個權杖）。這是為了防止上下文視窗溢位的保守估計。

  **maxOverlapTokens**: `integer`

  兩個相鄰分塊之間重疊權杖數量的上限。

  

</details>


  

</details>


  

</details>


  

---


  **mimeType**: `string`

  選填。資料的 MIME 類型。若未提供，將從上傳的內容推斷。

  

  

  
  **範例要求** 

  

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/fileSearchStores/$FILE_SEARCH_STORE_ID:uploadToFileSearchStore" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


  
## 回應 {#response}

  
  

<details>
<summary>**error**: `Status` 作業失敗或取消時的錯誤結果。</summary>

  

  **code**: `integer`

  狀態碼，應為 google.rpc.Code 的列舉值。

  **message**: `string`

  供開發人員參考的錯誤訊息，應以英文撰寫。任何要給使用者看的錯誤訊息都應本地化，並放在 google.rpc.Status.details 欄位中傳送，或由用戶端本地化。

  **details**: `object array`

  承載錯誤詳細資訊的訊息清單。API 有一組通用的訊息類型可供使用。

  

</details>


  

---


  

<details>
<summary>**response**: `UploadToFileSearchStoreResponse`</summary>

  

  **parent**: `string`

  [`FileSearchStore`](/api-reference/file-search/file-search-stores/#Resource:FileSearchStore) 的名稱，該儲存庫包含 `Document`。範例：`fileSearchStores/my-file-search-store-123`

  **documentName**: `string`

  不可變動。識別碼。所匯入 `Document` 的識別碼。範例：`fileSearchStores/my-file-search-store-123a456b789c`

  **mimeType**: `string`

  檔案的 MIME 類型。

  **sizeBytes**: `string`

  檔案大小（以位元組計）。

  

</details>


  

---


  **name**: `string`

  由伺服器指派的名稱，僅在最初傳回它的同一服務內唯一。若使用預設的 HTTP 對應，`name` 應為以 `operations/{unique_id}` 結尾的資源名稱。

  

---


  

<details>
<summary>**metadata**: `UploadToFileSearchStoreMetadata`</summary>

  

  

</details>


  

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
      "documentName": "string",
      "mimeType": "string",
      "sizeBytes": "string"
    },
    "name": "string",
    "metadata": {},
    "done": true
  }
  ```

  
