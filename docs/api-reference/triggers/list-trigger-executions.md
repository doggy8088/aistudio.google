# 列出觸發器的執行記錄


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 下。


`GET` `https://generativelanguage.googleapis.com/v1beta/triggers/{triggerId}/executions`

列出某個觸發器的執行記錄。



## 參數 {#parameters}


  **triggerId**: required `string`

  要列出其執行記錄的觸發器 ID。



---


  **filter**: `string`

  選用。篩選運算式。



---


  **page_size**: `integer`

  每頁傳回的執行記錄數量上限。



---


  **page_token**: `string`

  先前 ListTriggerExecutions 呼叫所傳回的分頁權杖。






  **範例要求**



=== "REST"

      ```sh
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/triggers/$TRIGGER_ID/executions" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```







## 回應 {#response}




<details>
<summary>**trigger_executions**: `TriggerExecution array` 觸發器執行記錄的清單。</summary>



  **id**: required `string`

  僅供輸出。識別碼。此觸發器執行記錄的 ID。

  **trigger_id**: required `string`

  僅供輸出。識別碼。建立此執行記錄的觸發器 ID。

  **scheduled_time**: `string`

  僅供輸出。此執行記錄排定執行的時間。

  **start_time**: `string`

  僅供輸出。此執行記錄開始執行的時間。

  **end_time**: `string`

  僅供輸出。此執行記錄結束的時間。



<details>
<summary>**status**: `string enum` 僅供輸出。此執行記錄的狀態。</summary>



  可能的值：

  - `in_progress`: 此執行記錄目前正在進行中。
  - `completed`: 此執行記錄已成功完成。
  - `failed`: 此執行記錄失敗。
  - `skipped`: 此執行記錄已略過（例如前一次執行仍在進行中）。
  - `timed_out`: 此執行記錄已逾時。



</details>


  **interaction_id**: `string`

  僅供輸出。此執行記錄建立的互動 ID（如有）。

  **environment_id**: `string`

  僅供輸出。此執行記錄所使用的環境 ID。

  **error**: `string`

  僅供輸出。此執行記錄失敗時的錯誤訊息。



</details>




---


  **next_page_token**: `string`

  從先前的 `ListTriggerExecutions` 呼叫收到的分頁權杖。提供此權杖即可擷取下一頁。






  **範例回應**

  ```json
  {
    "trigger_executions": [
      {
        "id": "string",
        "trigger_id": "string",
        "scheduled_time": "string",
        "start_time": "string",
        "end_time": "string",
        "status": "in_progress",
        "interaction_id": "string",
        "environment_id": "string",
        "error": "string"
      }
    ],
    "next_page_token": "string"
  }
  ```

