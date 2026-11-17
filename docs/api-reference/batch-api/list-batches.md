# 列出批次

`GET` `https://generativelanguage.googleapis.com/v1beta/batches`

列出符合請求中指定篩選條件的作業。若伺服器不支援此方法，會傳回 `UNIMPLEMENTED`。


  
## 參數 {#parameters}

  
  **filter**: `string`

  標準清單篩選條件。

  

---


  **pageSize**: `integer`

  標準清單頁面大小。

  

---


  **pageToken**: `string`

  標準清單頁面權杖。

  

---


  **returnPartialSuccess**: `boolean`

  設為 `true` 時，可連線的作業會正常傳回，無法連線的作業則會傳回至 ListOperationsResponse.unreachable 欄位。此設定僅能在跨集合讀取時設為 `true`。例如，當 `parent` 設為 `"projects/example/locations/-"` 時。依預設不支援此欄位，除非服務或產品專屬文件另有明確說明，否則設定後會導致 `UNIMPLEMENTED` 錯誤。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/batches" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


  
## 回應 {#response}

  
  

<details>
<summary>**operations**: `Operation array` 符合請求中指定篩選條件的作業清單。</summary>

  

  

<details>
<summary>**error**: `Status` 作業失敗或取消時的錯誤結果。</summary>

  

  **code**: `integer`

  狀態碼，應為 google.rpc.Code 的列舉值。

  **message**: `string`

  面向開發人員的錯誤訊息，應以英文撰寫。任何面向使用者的錯誤訊息都應本地化，並透過 google.rpc.Status.details 欄位傳送，或由用戶端本地化。

  **details**: `object array`

  承載錯誤詳細資訊的訊息清單。API 可使用一組通用的訊息類型。

  

</details>


  **response**: `object`

  作業正常且成功的回應。如果原始方法在成功時不傳回資料（例如 `Delete`），回應為 `google.protobuf.Empty`。如果原始方法是標準的 `Get`/`Create`/`Update`，回應應為該資源。對於其他方法，回應的類型應為 `XxxResponse`，其中 `Xxx` 是原始方法名稱。例如，如果原始方法名稱為 `TakeSnapshot()`，推斷的回應類型即為 `TakeSnapshotResponse`。

  **name**: `string`

  由伺服器指派的名稱，僅在最初傳回它的同一個服務內具唯一性。如果使用預設的 HTTP 對應，`name` 應為以 `operations/{unique_id}` 結尾的資源名稱。

  **metadata**: `object`

  與作業相關聯的服務專屬中繼資料。通常包含進度資訊，以及建立時間等常見中繼資料。有些服務可能不提供這類中繼資料。任何傳回長時間執行作業的方法，都應記錄其中繼資料類型（如有）。

  **done**: `boolean`

  如果值為 `false`，表示作業仍在進行中。如果為 `true`，表示作業已完成，且可取得 `error` 或 `response`。

  

</details>


  

---


  **nextPageToken**: `string`

  標準 List 下一頁權杖。

  

---


  **unreachable**: `string array`

  未排序的清單。無法連線的資源。當請求設定 `ListOperationsRequest.return_partial_success` 並跨集合讀取時填入。例如，嘗試列出所有支援位置中的所有資源時。

  

  

  
  **範例回應** 

  ```json
  {
    "operations": [
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
    ],
    "nextPageToken": "string",
    "unreachable": [
      "string"
    ]
  }
  ```

  
