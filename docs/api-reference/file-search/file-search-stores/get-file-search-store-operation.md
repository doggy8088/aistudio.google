# 取得作業

`GET` `https://generativelanguage.googleapis.com/v1beta/fileSearchStores/{fileSearchStore}/operations/{operation}`

取得長時間執行作業的最新狀態。用戶端可以使用此方法，依 API 服務建議的間隔輪詢作業結果。


  
## 參數 {#parameters}

  
  **fileSearchStore**: required `string`

  file search store ID。組成資源名稱 `fileSearchStores/{fileSearchStore}`。

  

---


  **operation**: required `string`

  作業 ID。

  

  

  
  **範例要求** 

  

=== "REST"

      ```sh
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/fileSearchStores/$FILE_SEARCH_STORE_ID/operations/$OPERATION_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
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


  **response**: `object`

  作業正常成功的回應。如果原始方法成功時不傳回資料（例如 `Delete`），回應為 `google.protobuf.Empty`。如果原始方法是標準的 `Get`/`Create`/`Update`，回應應為該資源。對於其他方法，回應的類型應為 `XxxResponse`，其中 `Xxx` 是原始方法名稱。例如，若原始方法名稱為 `TakeSnapshot()`，推斷的回應類型即為 `TakeSnapshotResponse`。

  

---


  **name**: `string`

  由伺服器指派的名稱，僅在最初傳回它的同一個服務內具唯一性。如果使用預設的 HTTP 對應，`name` 應為以 `operations/{unique_id}` 結尾的資源名稱。

  

---


  **metadata**: `object`

  與作業相關聯的服務專屬中繼資料，通常包含進度資訊和建立時間等一般中繼資料。有些服務可能不提供這類中繼資料。任何傳回長時間執行作業的方法，都應記錄其中繼資料類型（如有）。

  

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
    "response": {},
    "name": "string",
    "metadata": {},
    "done": true
  }
  ```

  