# Gemini Webhooks API


!!! note " "

      此 API 目前為 Beta 版。端點位於 `/v1beta/` 之下。


Webhook 讓 Gemini API 能在非同步作業或長時間執行作業（LRO）完成時，將即時通知推送到您的伺服器。這省去了輪詢 API 以取得狀態更新的需要，可降低延遲與額外負擔。

## 方法 {#methods}


| 方法 | HTTP 請求 |
| --- | --- |
| [建立 webhook](/api-reference/webhooks/create-webhook/) | `POST` `/v1beta/webhooks` 建立新的 Webhook。 |
| [Ping webhook](/api-reference/webhooks/ping-webhook/) | `POST` `/v1beta/webhooks/{id}:ping` 將 ping 事件傳送至 Webhook。 |
| [輪換 webhook 簽章密鑰](/api-reference/webhooks/rotate-signing-secret/) | `POST` `/v1beta/webhooks/{id}:rotateSigningSecret` 為 Webhook 產生新的簽章密鑰。 |
| [列出 webhook](/api-reference/webhooks/list-webhooks/) | `GET` `/v1beta/webhooks` 列出所有 Webhook。 |
| [取得 webhook](/api-reference/webhooks/get-webhook/) | `GET` `/v1beta/webhooks/{id}` 取得特定的 Webhook。 |
| [更新 webhook](/api-reference/webhooks/update-webhook/) | `PATCH` `/v1beta/webhooks/{id}` 更新現有的 Webhook。 |
| [刪除 webhook](/api-reference/webhooks/delete-webhook/) | `DELETE` `/v1beta/webhooks/{id}` 刪除 Webhook。 |


## 資源 {#resources}

### Webhook {#Resource:Webhook}

Webhook 資源。

**屬性：**


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
