# Google AI Studio 疑難排解

本頁提供 Google AI Studio 疑難排解建議，協助你處理使用時遇到的問題。

## 瞭解 403 Access Restricted 錯誤 {#understand-403-errors}

如果你看到 403 Access Restricted 錯誤，表示你使用 Google AI Studio 的方式不符合[服務條款](/docs/terms/)。常見原因之一是你不在[支援地區](/docs/available-regions/)內。

## 確認 Google 帳戶的年齡要求 {#age-requirements}

你必須年滿 18 歲才能使用 Google AI Studio。在嘗試開啟 [Google AI Studio](https://aistudio.google.com/) 時，你可能會被導向本節。如果發生這種情況，請確認你的 Google 帳戶符合年齡要求：

* **Check your birthday**：確認你的出生日期在[生日設定](https://myaccount.google.com/birthday)中設定為 18 歲以上。
* **Verify your age**：在 Google 帳戶上完成[年齡驗證](https://myaccount.google.com/age-verification)。如需瞭解驗證選項，請參閱[在 Google 帳戶上驗證年齡](https://support.google.com/accounts/answer/10071085)。
* **Match your ID date of birth**：如果你使用身分證件驗證年齡，請檢查帳戶設定。確認你的[生日](https://myaccount.google.com/birthday)與證件上的日期相符。
* **Google Workspace accounts**：如果是 Google Workspace for Education 帳戶，請聯絡你的管理員。他們可以確認你的帳戶是否已標示為 18 歲以上。詳情請參閱[使用 Workspace 帳戶存取 Google AI Studio](/docs/workspace/)。

## 解決 Google AI Studio 上的 No Content 回應 {#resolve-no-content}


!!! warning " "

      如果內容因任何原因遭到封鎖，Google AI Studio 會顯示 **No Content** 訊息。如需查看更多詳情，請將指標停留在 **No Content** 上，然後點選 **Safety**。


如果回應是因[安全設定](/docs/safety-settings/)而遭封鎖，且你已考量使用情境的[安全風險](/docs/safety-guidance/)，你可以修改[安全設定](/docs/safety-settings/#safety-settings-ai-studio)，以影響傳回的回應。

如果回應遭到封鎖但並非出於安全設定，則查詢或回應可能違反[服務條款](/docs/terms/)，或屬於其他不支援的情況。

## 查看權杖用量與上限 {#check-token-usage}

開啟提示詞時，畫面底部的 **Text Preview** 按鈕會顯示提示詞內容目前使用的權杖數量，以及所用模型的權杖數量上限。

## Google AI Studio 的 Google Cloud IAM 權限 {#iam-permissions}

Google Cloud 專案的成員需要特定的 Identity and Access Management（IAM）權限，才能在 Google AI Studio 中執行動作。如需瞭解這些身分的詳細資訊，請參閱 [IAM 主體總覽](https://docs.cloud.google.com/iam/docs/principals-overview)。

在相關聯的 Google Cloud 專案中具有 **Editor** 或 **Owner** 角色的使用者，擁有查看資訊主頁及管理 Gemini API 金鑰的完整權限。具有 **Viewer** 角色的使用者可以查看資訊主頁和 API 金鑰，但無法建立、更新或刪除。

如需更精細的控管，請參閱下表，瞭解各項 AI Studio 功能所需的特定權限。如需瞭解如何授予這些權限，請參閱 Google Cloud 文件中的[授予、變更及撤銷資源存取權](https://cloud.google.com/iam/docs/granting-changing-revoking-access)。


| AI Studio 功能 | 所需 IAM 權限 | 其他要求 |
| --- | --- | --- |
| **Search project**（匯入專案） | `resourcemanager.projects.get` |  |
| **Rename project** | `resourcemanager.projects.update` |  |
| **Verify project** | `resourcemanager.projects.get` `resourcemanager.projects.update` | 適用於免費層級專案。請參閱[專案與帳戶驗證](/docs/verification/#verify-project)。 |
| **Display quota tier** | N/A |  |
| **Create API key** | 需具備 **Search project** 權限，以及： `apikeys.keys.create` `serviceusage.services.enable` `iam.serviceAccountApiKeyBindings.create` `iam.serviceAccounts.create` |  |
| **List API keys** | 需具備 **Search project** 權限，以及： `apikeys.keys.list` `serviceusage.services.get` | Google Cloud 專案必須已啟用 [Generative Language API](https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com)。 |
| **Rename API keys** | `apikeys.keys.update` |  |
| **Delete API keys** | `apikeys.keys.delete` |  |
| **Usage dashboard** | 需具備 **Search project** 權限，以及： `monitoring.timeSeries.list` |  |
| **Rate limit dashboard** | 需具備 **Usage dashboard** 權限，以及： `cloudquotas.quotas.get` |  |
| **Spend (Billing cap)** | `billing.resourceCosts.get`（查看支出） `billing.resourcebudgets.read`（查看上限） `billing.resourcebudgets.write`（設定上限） |  |
| **Billing dashboard** | `billing.accounts.get` |  |
| **Custom domains** | `roles/owner` 或 `roles/editor`，或以下全部： `roles/domains.admin` `roles/dns.admin` `roles/run.admin` `serviceusage.services.get` 與 `serviceusage.services.enable`（如果 Cloud Domains、Cloud DNS 與 Cloud Run API 尚未啟用） | 需要有效的 Cloud Billing 帳戶。請參閱 [Google AI Studio 中的自訂網域](/docs/aistudio-custom-domains/)。 |
| **Custom domain quota increases** | `serviceusage.quotas.update` 或 `cloudquotas.quotas.update` | 需要有效的 Cloud Billing 帳戶。請參閱[申請額外網域](/docs/aistudio-custom-domains/#request-additional-domains)。 |


### 其他存取檢查 {#other-access-checks}

除了 Google Cloud IAM 權限之外，AI Studio 也會執行安全與法規遵循檢查。如果你不符合下列要求，可能會在 AI Studio 介面或 API 回應中遇到 `PERMISSION_DENIED` 或存取受限錯誤：

* **Security checks**：你的要求必須通過自動化安全檢查。
* **Mobile device verification**：部分免費層級專案，以及有異常活動的帳戶，必須完成[專案或帳戶驗證](/docs/verification/)。
* **Terms of Service**：你必須接受 Google 服務條款與生成式 AI 附加服務條款。
* **Supported region**：你必須位於[支援地區](/docs/available-regions/)內。
* **Age requirements**：你的 Google 帳戶必須符合[年齡要求](/docs/troubleshoot-ai-studio/#age-requirements)（18 歲以上）。
* **Trust & Safety**：Google Cloud 專案不得被標示為濫用。
