# 更新 webhook


!!! note " "

      此 API 目前為 Beta 版。端點位於 `/v1beta/` 之下。


`PATCH` `https://generativelanguage.googleapis.com/v1beta/webhooks/{id}`

更新現有的 Webhook。


  
## 參數 {#parameters}

  
  **id**: required `string`

  要更新的 webhook ID。

  

## 請求主體 {#request-body}

  
  

<details>
<summary>**webhook**: required `WebhookUpdate` 要更新的 webhook。</summary>

  

  **name**: `string`

  選用。使用者提供的 webhook 名稱。

  **uri**: `string`

  選用。webhook 事件要傳送到的 URI。

  **subscribed_events**: `string array`

  選用。此 webhook 所訂閱的事件。可用事件：

  - batch.succeeded
  - batch.expired
  - batch.failed
  - interaction.requires_action
  - interaction.completed
  - interaction.failed
  - video.generated

  

<details>
<summary>**state**: `string enum` 選用。webhook 的狀態。</summary>

  

  可能的值：

  - `enabled`：webhook 已啟用。
  - `disabled`：webhook 已由使用者停用。
  - `disabled_due_to_failed_deliveries`：webhook 因傳送失敗而停用。

  

</details>


  

</details>


  

---


  **id**: required `string`

  要更新的 webhook ID。

  

---


  **update_mask**: `string`

  選用。要更新的欄位清單。

  

  

  
  **請求範例** 

  

=== "REST"

      ```sh
      curl -X PATCH "https://generativelanguage.googleapis.com/v1beta/webhooks/$WEBHOOK_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
        "webhook": {
          "name": "string"
        },
        "id": "string"
      }'
      ```


  


  
## 回應 {#response}

  
  **uri**: required `string`

  webhook 事件要傳送到的 URI。

  

---


  **subscribed_events**: required `string array`

  此 webhook 所訂閱的事件。可用事件：

  - batch.succeeded
  - batch.expired
  - batch.failed
  - interaction.requires_action
  - interaction.completed
  - interaction.failed
  - video.generated

  

---


  **name**: `string`

  選用。使用者提供的 webhook 名稱。

  

---


  **create_time**: `string`

  僅供輸出。webhook 建立時的時間戳記。

  

---


  **update_time**: `string`

  僅供輸出。webhook 上次更新時的時間戳記。

  

---


  

<details>
<summary>**signing_secrets**: `SigningSecret array` 僅供輸出。與此 webhook 關聯的簽章密鑰。</summary>

  

  **truncated_secret**: `string`

  僅供輸出。簽章密鑰的截斷版本。

  **expire_time**: `string`

  僅供輸出。簽章密鑰的到期日。

  

</details>


  

---


  

<details>
<summary>**state**: `string enum` 僅供輸出。webhook 的狀態。</summary>

  

  可能的值：

  - `enabled`：webhook 已啟用。
  - `disabled`：webhook 已由使用者停用。
  - `disabled_due_to_failed_deliveries`：webhook 因傳送失敗而停用。

  

</details>


  

---


  **new_signing_secret**: `string`

  僅供輸出。webhook 的新簽章密鑰。僅在建立時填入。

  

---


  **id**: `string`

  僅供輸出。webhook 的 ID。

  

  

  
  **回應範例** 

  ```json
  {
    "uri": "string",
    "subscribed_events": [
      "string"
    ],
    "name": "string",
    "create_time": "string",
    "update_time": "string",
    "signing_secrets": [
      {
        "truncated_secret": "string",
        "expire_time": "string"
      }
    ],
    "state": "enabled",
    "new_signing_secret": "string",
    "id": "string"
  }
  ```

  
