# 取得文件

`GET` `https://generativelanguage.googleapis.com/v1beta/fileSearchStores/{fileSearchStore}/documents/{document}`

取得特定 [`Document`](/api-reference/file-search/documents/#Resource:Document) 的資訊。


  
## 參數 {#parameters}

  
  **document**: required `string`

  文件 ID。組成資源名稱 `fileSearchStores/{fileSearchStore}/documents/{document}`。

  

---


  **fileSearchStore**: required `string`

  file search store ID。組成資源名稱 `fileSearchStores/{fileSearchStore}`。

  

  

  
  **範例要求** 

  

=== "REST"

      ```sh
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/fileSearchStores/$FILE_SEARCH_STORE_ID/documents/$DOCUMENT_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


  
## 回應 {#response}

  
  **name**: `string`

  不可變更。識別碼。[`Document`](/api-reference/file-search/documents/#Resource:Document) 資源名稱。ID（名稱去除 "fileSearchStores/*/documents/" 前綴的部分）最多可包含 40 個字元，限小寫英數字元或連字號 (-)。ID 不得以連字號開頭或結尾。若建立時名稱為空，將從 `display_name` 衍生出唯一名稱，並加上 12 個字元的隨機後綴。範例：`fileSearchStores/{file_search_store_id}/documents/my-awesome-doc-123a456b789c`

  

---


  **displayName**: `string`

  選填。[`Document`](/api-reference/file-search/documents/#Resource:Document) 方便閱讀的顯示名稱。顯示名稱長度不得超過 512 個字元（含空格）。範例："Semantic Retriever Documentation"

  

---


  

<details>
<summary>**customMetadata**: `CustomMetadata array` 選填。使用者提供的自訂中繼資料，以鍵值對形式儲存，用於查詢。一個 [`Document`](/api-reference/file-search/documents/#Resource:Document) 最多可有 20 個 `CustomMetadata`。</summary>

  

  **key**: required `string`

  要儲存的中繼資料的鍵。

  

<details>
<summary>**value**: `Union type`</summary>

  

  聯集欄位 `value` 只能是下列其中之一：

  **stringValue**: `string`

  要儲存的中繼資料的字串值。

  

<details>
<summary>**stringListValue**: `StringList` 要儲存的中繼資料的 StringList 值。</summary>

  

  **values**: `string array`

  要儲存的中繼資料的字串值。

  

</details>


  **numericValue**: `number`

  要儲存的中繼資料的數值。

  

</details>


  

</details>


  

---


  **updateTime**: `string`

  僅供輸出。[`Document`](/api-reference/file-search/documents/#Resource:Document) 最後更新的時間戳記。

  

---


  **createTime**: `string`

  僅供輸出。[`Document`](/api-reference/file-search/documents/#Resource:Document) 建立的時間戳記。

  

---


  

<details>
<summary>**state**: `string enum` 僅供輸出。[`Document`](/api-reference/file-search/documents/#Resource:Document) 目前的狀態。</summary>

  

  可能的值：

  - `STATE_UNSPECIFIED`：預設值。省略狀態時使用此值。
  - `STATE_PENDING`：`Chunks` 有部分正在處理中（嵌入與向量儲存），屬於該 [`Document`](/api-reference/file-search/documents/#Resource:Document)。
  - `STATE_ACTIVE`：`Chunks` 全部已處理完成，該 [`Document`](/api-reference/file-search/documents/#Resource:Document) 可供查詢。
  - `STATE_FAILED`：`Chunks` 有部分處理失敗，屬於該 [`Document`](/api-reference/file-search/documents/#Resource:Document)。

  

</details>


  

---


  **sizeBytes**: `string`

  僅供輸出。匯入 Document 的原始位元組大小。

  

---


  **mimeType**: `string`

  僅供輸出。Document 的 mime 類型。

  

  

  
  **範例回應** 

  ```json
  {
    "name": "string",
    "displayName": "string",
    "customMetadata": [
      {
        "key": "string",
        "stringValue": "string",
        "stringListValue": {
          "values": [
            "string"
          ]
        },
        "numericValue": 0.0
      }
    ],
    "updateTime": "string",
    "createTime": "string",
    "state": "STATE_UNSPECIFIED",
    "sizeBytes": "string",
    "mimeType": "string"
  }
  ```

  
