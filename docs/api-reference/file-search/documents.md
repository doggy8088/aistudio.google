# 文件

File Search API 將您的原始來源檔案（即文件）參照為暫時的 File 物件。

## 方法 {#methods}


| 方法 | HTTP 要求 |
| --- | --- |
| [刪除文件](/api-reference/file-search/documents/delete-document/) | `DELETE` `/v1beta/fileSearchStores/{fileSearchStore}/documents/{document}` 刪除 [`Document`](/api-reference/file-search/documents/#Resource:Document)。 |
| [取得文件](/api-reference/file-search/documents/get-document/) | `GET` `/v1beta/fileSearchStores/{fileSearchStore}/documents/{document}` 取得特定 [`Document`](/api-reference/file-search/documents/#Resource:Document) 的資訊。 |
| [列出文件](/api-reference/file-search/documents/list-documents/) | `GET` `/v1beta/fileSearchStores/{fileSearchStore}/documents` 列出所有 [`Document`](/api-reference/file-search/documents/#Resource:Document)（`Corpus` 內的全部文件）。 |


## 資源 {#resources}

### Document {#Resource:Document}

[`Document`](/api-reference/file-search/documents/#Resource:Document) 是 `Chunk` 的集合。

**屬性**：


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
