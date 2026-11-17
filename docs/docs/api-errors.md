# API 錯誤

本頁提供所有 Interactions API 錯誤代碼的參考，說明錯誤回應格式，並解釋 API 如何針對不同類型的請求傳遞錯誤。

## 標準 API 錯誤代碼 {#api-error-codes}

這些一般性的請求層級錯誤代碼對應標準 HTTP 狀態碼。請在應用程式邏輯中使用 `code` 欄位，以程式化方式處理錯誤。

| 代碼 | HTTP 狀態 | 說明 | 建議作法 |
| :--- | :--- | :--- | :--- |
| `invalid_request` | 400 Bad Request | 請求內容格式不正確，或包含無效參數。 | 對照 [API 參考文件](/api-reference/interactions-api/)，檢查請求語法與參數。 |
| `failed_precondition` | 400 Bad Request | 前置條件未滿足，導致請求無法處理（例如計費已停用）。 | 確認專案計費狀態或帳號前置條件。 |
| `out_of_range` | 416 Requested Range Not Satisfiable | 請求參數超出有效範圍。 | 檢查參數值與上限。 |
| `parameter_unknown` | 400 Bad Request | 請求包含未知參數。 | 移除無法識別的參數後重試。 |
| `authentication` | 401 Unauthorized | API 金鑰遺失、無效或已過期。 | 檢查您的 [API 金鑰](/docs/api-key/)。 |
| `payment_required` | 402 Payment Required | 您的預付（Prepay）額度餘額已耗盡。 | 為您的計費帳戶 [新增額度](/docs/billing/#buy-credits)，或開啟 [自動儲值](/docs/billing/#auto-reload)。請勿重試：在額度補充之前，請求不會成功。 |
| `permission_denied` | 403 Forbidden | 您的 API 金鑰沒有存取此資源的權限，或您的專案受到限制、需要驗證或計費變更。 | 檢查 API 金鑰權限、[驗證狀態](/docs/verification/)與計費狀態。另請參閱 [Project restricted or unavailable](/docs/troubleshooting/#project-unavailable)。 |
| `not_found` | 404 Not Found | 找不到所請求的資源。 | 確認資源路徑與參數。 |
| `model_not_found` | 404 Not Found | 找不到指定的模型。 | 確認模型名稱，或改用其他模型。 |
| `already_exists` | 409 Conflict | 您嘗試建立的實體已存在。 | 重新建立前，先確認資源是否已存在。 |
| `aborted` | 409 Conflict | 作業因衝突或並行檢查失敗而中止。 | 在較高的應用程式層級重試請求。 |
| `rate_limit_exceeded` | 429 Too Many Requests | 您已超過每分鐘或每秒的請求或權杖上限。 | 等待後以指數退避方式重試。 |
| `quota_exceeded` | 429 Too Many Requests | 您已超過每日配額。 | 等待配額重設，或申請提高配額。 |
| `too_many_requests` | 429 Too Many Requests | 您在短時間內發出過多請求。 | 等待後以指數退避方式重試。 |
| `cancelled` | 499 Client Closed Request | 用戶端在請求完成前取消了請求。 | 無需採取任何動作。這通常表示用戶端已中斷連線。 |
| `api_error` | 500 Internal Server Error | 伺服器發生未預期的錯誤。 | 重試請求。若問題持續發生，請聯絡支援團隊。 |
| `unimplemented` | 501 Not Implemented | 該作業或功能尚未實作或不受支援。 | 檢查 API 功能，或改用受支援的功能。 |
| `service_unavailable` | 503 Service Unavailable | 服務暫時過載或無法使用。 | 等待後以指數退避方式重試。 |
| `deadline_exceeded` | 504 Gateway Timeout | 請求未在期限內完成。 | 移除或提高用戶端的期限設定，改用伺服器預設值。 |


!!! note " "

      未列於上表的任何錯誤代碼，都會退回使用 HTTP 狀態碼的 `snake_case` 版本。


## 生成遭封鎖代碼 {#generation-blocked-codes}

這些錯誤代碼表示政策、安全或內容限制封鎖了模型的輸出。收到這類代碼時，請修改輸入後再重試。

| 代碼 | 說明 |
| :--- | :--- |
| `safety` | 安全違規（有害內容）封鎖了請求。 |
| `recitation` | 著作權或覆誦限制封鎖了請求。 |
| `language` | 不受支援的語言封鎖了請求。 |
| `prohibited_content` | 禁止內容規範封鎖了請求。 |
| `spii` | 敏感個人識別資訊限制封鎖了請求。 |
| `blocklist` | 封鎖清單上的禁止詞彙封鎖了請求。 |
| `image_safety` | 安全違規封鎖了圖片生成。 |
| `image_prohibited_content` | 禁止內容規範封鎖了圖片生成。 |
| `image_recitation` | 著作權或覆誦限制封鎖了圖片生成。 |
| `image_other` | 未明示的原因封鎖了圖片生成。 |
| `content_blocked` | 未明示的政策原因封鎖了請求。 |

## 生成錯誤代碼 {#generation-error-codes}

這些錯誤代碼表示模型生成的輸出存在結構性問題（例如格式不正確的函式呼叫，或未宣告的工具呼叫）。

| 代碼 | 說明 |
| :--- | :--- |
| `malformed_function_call` | 模型產生的函式呼叫無法解析。 |
| `malformed_tool_call` | 模型產生的工具呼叫無法解析。 |
| `unexpected_tool_call` | 模型呼叫了請求中未宣告的工具。 |
| `no_image` | 模型無法產生圖片。 |
| `too_many_tool_calls` | 模型產生的工具呼叫超過允許數量。 |
| `missing_thought_signature` | 回應缺少必要的思考簽章。 |

## 錯誤回應格式 {#error-schema}

Interactions API 的所有錯誤都會回傳一個 `error` 物件，其中包含 `code` 與 `message`。例如，傳入不受支援的工具類型時會回傳：

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The value 'invalid_tool_type_xyz' is not supported for 'type' at 'tools[0]'. Supported values: 'function', 'code_execution', 'mcp_server', 'filesystem', 'google_maps', 'google_search', 'bash', 'computer_use', 'file_search', 'url_context'."
  }
}
```

| 欄位 | 類型 | 說明 |
| :--- | :--- | :--- |
| `code` | string | 以 `snake_case` 表示的機器可讀錯誤代碼。 |
| `message` | string | 說明問題所在的人類可讀描述。 |

## 錯誤的傳遞方式 {#error-delivery}

API 傳遞錯誤的方式會因您發出的是標準 HTTP 請求還是串流（SSE）請求而不同。

### 標準 HTTP 請求 {#http-errors}

對於標準（非串流）請求，API 會設定 HTTP 回應狀態碼（例如 `400 Bad Request`、`401 Unauthorized` 或 `429 Too Many Requests`），並在 JSON 回應主體中回傳 `error` 物件：

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The value 'invalid_tool_type_xyz' is not supported for 'type' at 'tools[0]'."
  }
}
```

### 串流（SSE）請求 {#sse-errors}

對於串流請求（`stream: true`），API 會透過 Server-Sent Events（SSE）串流傳送錯誤事件，將 `event_type` 設為 `"error"`。`error` 欄位包含相同的 `code` 與 `message` 結構：

```json
{
  "event_type": "error",
  "error": {
    "code": "not_found",
    "message": "Failed to get completed interaction: Result not found."
  }
}
```

完整的 SSE 事件結構請參閱 [Interactions API Reference](/api-reference/interactions-api/)。

## 下一步 {#whats-next}

* [API troubleshooting](/docs/troubleshooting/)：解決常見問題與錯誤情境。
* [Rate limits](/docs/rate-limits/)：了解請求上限與配額處理方式。
