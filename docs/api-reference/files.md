# 使用檔案

Gemini API 支援將媒體檔案與提示詞輸入分開上傳，讓媒體檔案能在多個要求與多個提示詞之間重複使用。詳情請參閱[使用媒體進行提示](/docs/file-input-methods/)指南。

## 方法 {#methods}


| 方法 | HTTP 要求 |
| --- | --- |
| [取得檔案](/api-reference/files/get-file/) | `GET` `/v1beta/files/{file}` 取得指定 [`File`](/api-reference/files/#Resource:File) 的後設資料。 |
| [列出檔案](/api-reference/files/list-files/) | `GET` `/v1beta/files` 列出提出要求的專案所擁有的 [`File`](/api-reference/files/#Resource:File) 後設資料。 |
| [刪除檔案](/api-reference/files/delete-file/) | `DELETE` `/v1beta/files/{file}` 刪除 [`File`](/api-reference/files/#Resource:File)。 |
| [註冊檔案](/api-reference/files/register-files/) | `POST` `/v1beta/files:register` 向 FileService 註冊 Google Cloud Storage 檔案。 |
| [建立檔案](/api-reference/files/create-file/) | `POST` `/v1beta/files` 建立 [`File`](/api-reference/files/#Resource:File)。 |


## 資源 {#resources}

### File {#Resource:File}

上傳至 API 的檔案。

**屬性**：


  

<details>
<summary>**metadata**: `Union type` 檔案的後設資料。</summary>

  

  `metadata` 聯合欄位只能是下列其中之一：

  

<details>
<summary>**videoMetadata**: `VideoFileMetadata` 僅供輸出。影片的後設資料。</summary>

  

  **videoDuration**: `string`

  影片的長度。

  

</details>


  

</details>


  

---


  **name**: `string`

  不可變。識別碼。此為 [`File`](/api-reference/files/#Resource:File) 資源名稱。ID（即扣除 "files/" 前綴後的名稱）最多可包含 40 個字元，限小寫英數字元或連字號（-）。ID 不得以連字號開頭或結尾。若建立時名稱為空，系統將產生不重複的名稱。範例：`files/123-456`

  

---


  **displayName**: `string`

  選填。此為 [`File`](/api-reference/files/#Resource:File) 易讀的顯示名稱。顯示名稱長度不得超過 512 個字元（含空格）。範例："Welcome Image"

  

---


  **mimeType**: `string`

  僅供輸出。檔案的 MIME 類型。

  

---


  **sizeBytes**: `string`

  僅供輸出。檔案大小（以位元組為單位）。

  

---


  **createTime**: `string`

  僅供輸出。[`File`](/api-reference/files/#Resource:File) 的建立時間戳記。

  

---


  **updateTime**: `string`

  僅供輸出。[`File`](/api-reference/files/#Resource:File) 的最後更新時間戳記。

  

---


  **expirationTime**: `string`

  僅供輸出。[`File`](/api-reference/files/#Resource:File) 將被刪除的時間戳記。僅在 [`File`](/api-reference/files/#Resource:File) 已排定到期時才會設定。

  

---


  **sha256Hash**: `string`

  僅供輸出。所上傳位元組的 SHA-256 雜湊值。

  

---


  **uri**: `string`

  僅供輸出。[`File`](/api-reference/files/#Resource:File) 的 uri。

  

---


  **downloadUri**: `string`

  僅供輸出。[`File`](/api-reference/files/#Resource:File) 的下載 uri。

  

---


  

<details>
<summary>**state**: `string enum` 僅供輸出。檔案的處理狀態。</summary>

  

  可能的值：

  - `STATE_UNSPECIFIED`：預設值。省略狀態時即使用此值。
  - `PROCESSING`：檔案正在處理中，尚無法用於推論。
  - `ACTIVE`：檔案已處理完成，可用於推論。
  - `FAILED`：檔案處理失敗。

  

</details>


  

---


  

<details>
<summary>**source**: `string enum` 檔案的來源。</summary>

  

  可能的值：

  - `SOURCE_UNSPECIFIED`：未指定來源時使用。
  - `UPLOADED`：表示檔案由使用者上傳。
  - `GENERATED`：表示檔案由 Google 產生。
  - `REGISTERED`：表示檔案為已註冊的檔案，即 Google Cloud Storage 檔案。

  

</details>


  

---


  **error**: [`Status`](/api-reference/files/#Resource:Status)

  僅供輸出。檔案處理失敗時的錯誤狀態。


## 資料模型 {#data-models}

### Status {#Resource:Status}

[`Status`](/api-reference/files/#Resource:Status) 類型定義了一套邏輯錯誤模型，適用於不同的程式設計環境，包括 REST API 與 RPC API，並由 [gRPC](https://github.com/grpc) 採用。每個 [`Status`](/api-reference/files/#Resource:Status) 訊息包含三項資料：錯誤代碼、錯誤訊息與錯誤詳細資訊。

如需進一步瞭解此錯誤模型及其使用方式，請參閱
[API Design Guide](https://cloud.google.com/apis/design/errors)。

**屬性**：


  **code**: `integer`

  狀態碼，應為 google.rpc.Code 的列舉值。

  

---


  **message**: `string`

  供開發人員閱讀的錯誤訊息，應以英文撰寫。任何供使用者閱讀的錯誤訊息都應在地化，並透過 google.rpc.Status.details 欄位傳送，或由用戶端進行在地化。

  

---


  **details**: `object array`

  承載錯誤詳細資訊的訊息清單。API 可使用一組通用的訊息類型。


