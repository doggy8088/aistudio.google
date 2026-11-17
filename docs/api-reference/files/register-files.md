# 註冊檔案

`POST` `https://generativelanguage.googleapis.com/v1beta/files:register`

向 FileService 註冊 Google Cloud Storage 檔案。使用者需提供
Google Cloud Storage URI，系統會為每個 URI 傳回一個 File
資源。請注意，檔案並不會被複製，只是向 File API 註冊。若有任一檔案註冊失敗，整個要求即告失敗。


  
## 要求主體 {#request-body}

  
  **uris**：必填，`string array`

  要註冊的 Google Cloud Storage URI。範例：`gs://bucket/object`。

  

  

  
  **範例要求** 

  

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/files:register" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
        "uris": [
          "string"
        ]
      }'
      ```


  


  
## 回應 {#response}

  
  **files**: [`File`](/api-reference/files/register-files/#Resource:File) `array`

  已註冊的檔案，呼叫 GenerateContent 時使用。

  

  

  
  **範例回應** 

  ```json
  {
    "files": [
      {
        "videoMetadata": {
          "videoDuration": "string"
        },
        "name": "string",
        "displayName": "string",
        "mimeType": "string",
        "sizeBytes": "string",
        "createTime": "string",
        "updateTime": "string",
        "expirationTime": "string",
        "sha256Hash": "string",
        "uri": "string",
        "downloadUri": "string",
        "state": "STATE_UNSPECIFIED",
        "source": "SOURCE_UNSPECIFIED",
        "error": {
          "code": 0,
          "message": "string",
          "details": [
            {}
          ]
        }
      }
    ]
  }
  ```

  


## 資源 {#resources}

### File {#Resource:File}

上傳至 API 的檔案。

**屬性**：


  

??? note "**metadata**: `Union type` 檔案的後設資料。"

      `metadata` 聯合欄位只能是下列其中之一：



    ??? note "**videoMetadata**: `VideoFileMetadata` 僅供輸出。影片的後設資料。"

        **videoDuration**: `string`

        影片的長度。



  

---


  **name**: `string`

  不可變。識別碼。此為 [`File`](/api-reference/files/register-files/#Resource:File) 資源名稱。ID（即扣除 "files/" 前綴後的名稱）最多可包含 40 個字元，限小寫英數字元或連字號（-）。ID 不得以連字號開頭或結尾。若建立時名稱為空，系統將產生不重複的名稱。範例：`files/123-456`

  

---


  **displayName**: `string`

  選填。此為 [`File`](/api-reference/files/register-files/#Resource:File) 易讀的顯示名稱。顯示名稱長度不得超過 512 個字元（含空格）。範例："Welcome Image"

  

---


  **mimeType**: `string`

  僅供輸出。檔案的 MIME 類型。

  

---


  **sizeBytes**: `string`

  僅供輸出。檔案大小（以位元組為單位）。

  

---


  **createTime**: `string`

  僅供輸出。[`File`](/api-reference/files/register-files/#Resource:File) 的建立時間戳記。

  

---


  **updateTime**: `string`

  僅供輸出。[`File`](/api-reference/files/register-files/#Resource:File) 的最後更新時間戳記。

  

---


  **expirationTime**: `string`

  僅供輸出。[`File`](/api-reference/files/register-files/#Resource:File) 將被刪除的時間戳記。僅在 [`File`](/api-reference/files/register-files/#Resource:File) 已排定到期時才會設定。

  

---


  **sha256Hash**: `string`

  僅供輸出。所上傳位元組的 SHA-256 雜湊值。

  

---


  **uri**: `string`

  僅供輸出。[`File`](/api-reference/files/register-files/#Resource:File) 的 uri。

  

---


  **downloadUri**: `string`

  僅供輸出。[`File`](/api-reference/files/register-files/#Resource:File) 的下載 uri。

  

---


  

??? note "**state**: `string enum` 僅供輸出。檔案的處理狀態。"

    可能的值：

    - `STATE_UNSPECIFIED`：預設值。省略狀態時即使用此值。
    - `PROCESSING`：檔案正在處理中，尚無法用於推論。
    - `ACTIVE`：檔案已處理完成，可用於推論。
    - `FAILED`：檔案處理失敗。



  

---


  

??? note "**source**: `string enum` 檔案的來源。"

    可能的值：

    - `SOURCE_UNSPECIFIED`：未指定來源時使用。
    - `UPLOADED`：表示檔案由使用者上傳。
    - `GENERATED`：表示檔案由 Google 產生。
    - `REGISTERED`：表示檔案為已註冊的檔案，即 Google Cloud Storage 檔案。



  

---


  **error**: [`Status`](/api-reference/files/register-files/#Resource:Status)

  僅供輸出。檔案處理失敗時的錯誤狀態。


## 資料模型 {#data-models}

### Status {#Resource:Status}

[`Status`](/api-reference/files/register-files/#Resource:Status) 類型定義了一套邏輯錯誤模型，適用於不同的程式設計環境，包括 REST API 與 RPC API，並由 [gRPC](https://github.com/grpc) 採用。每個 [`Status`](/api-reference/files/register-files/#Resource:Status) 訊息包含三項資料：錯誤代碼、錯誤訊息與錯誤詳細資訊。

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

