# 列出 webhook


!!! note " "

      此 API 目前為 Beta 版。端點位於 `/v1beta/` 之下。


`GET` `https://generativelanguage.googleapis.com/v1beta/webhooks`

列出所有 Webhook。


  
## 參數 {#parameters}

  
  **page_size**: `integer`

  選用。要傳回的 webhook 數量上限。服務傳回的數量可能少於此值。若未指定，最多傳回 50 個 webhook。最大值為 1000。

  

---


  **page_token**: `string`

  選用。從先前的 `ListWebhooks` 呼叫取得的分頁權杖。提供此值即可擷取下一頁。

  

  

  
  **請求範例** 

  

=== "REST"

      ```sh
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/webhooks" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


  
## 回應 {#response}

  
  **webhooks**: [`Webhook`](/api-reference/webhooks/list-webhooks/#Resource:Webhook) `array`

  webhook 清單。

  

---


  **next_page_token**: `string`

  可做為 `page_token` 傳送以擷取下一頁的權杖。若省略此欄位，表示後面沒有其他頁面。

  

  

  
  **回應範例** 

  ```json
  {
    "webhooks": [
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
    ],
    "next_page_token": "string"
  }
  ```

  


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
