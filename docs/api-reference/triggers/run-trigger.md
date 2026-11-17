# 執行觸發器


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 之下。


`POST` `https://generativelanguage.googleapis.com/v1beta/triggers/{triggerId}/executions`

立即執行觸發器。


  
## 參數 {#parameters}

  
  **triggerId**: required `string`

  觸發器的資源名稱。

  

  

  
  **範例要求** 

  

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/triggers/$TRIGGER_ID/executions" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


  
## 回應 {#response}

  
  **id**: required `string`

  僅供輸出。識別碼。觸發器執行的 ID。

  

---


  **trigger_id**: required `string`

  僅供輸出。識別碼。建立此執行的觸發器 ID。

  

---


  **scheduled_time**: `string`

  僅供輸出。執行排定執行的時間。

  

---


  **start_time**: `string`

  僅供輸出。執行開始的時間。

  

---


  **end_time**: `string`

  僅供輸出。執行完成的時間。

  

---


  

<details>
<summary>**status**: `string enum` 僅供輸出。執行的狀態。</summary>

  

  可能的值：

  - `in_progress`: 執行目前正在進行中。
  - `completed`: 執行已成功完成。
  - `failed`: 執行失敗。
  - `skipped`: 執行已略過（例如前一次執行仍在進行中）。
  - `timed_out`: 執行逾時。

  

</details>


  

---


  **interaction_id**: `string`

  僅供輸出。此執行所建立的互動 ID（如有）。

  

---


  **environment_id**: `string`

  僅供輸出。執行所使用的環境 ID。

  

---


  **error**: `string`

  僅供輸出。執行失敗時的錯誤訊息。

  

  

  
  **範例回應** 

  ```json
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
  ```

  
