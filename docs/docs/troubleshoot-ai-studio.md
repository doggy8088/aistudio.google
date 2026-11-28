# Google AI Studio 疑難排解

使用本指南診斷 Google AI Studio 中的存取封鎖、帳戶與年齡驗證錯誤、配額或方案不符、遭封鎖的回應、Build 共用錯誤，以及 Google Cloud IAM 權限問題。如需 Gemini API SDK 或 HTTP 錯誤代碼，請參閱 [API 疑難排解指南](/docs/troubleshooting/)與 [API 錯誤](/docs/api-errors/)。

## 快速症狀查詢 {#symptom-lookup}

將你在 Google AI Studio 中看到的錯誤訊息或症狀，對照其原因與修正方法。

| 症狀或錯誤 | 可能原因 | 解決方法 |
| :--- | :--- | :--- |
| 開啟 AI Studio 時被導向年齡要求 | Google 帳戶未滿 18 歲或未經驗證 | [確認年齡要求](/docs/troubleshoot-ai-studio/#age-requirements) |
| 在 AI Studio 上出現 `403 Access Restricted` | 不支援的地區、VPN／Proxy 路由、服務條款問題或瀏覽器帳戶衝突 | [瞭解 403 Access Restricted 錯誤](/docs/troubleshoot-ai-studio/#understand-403-errors) |
| 在共用的 Build 應用程式網址上出現 `403 Access Restricted` | 隱私瀏覽器擴充功能或應用程式建置損壞 | [修正共用 Build 應用程式上的 403 錯誤](/docs/troubleshoot-ai-studio/#build-sharing-403) |
| `We are sorry, but you do not have access to Google AI Studio` | Google Workspace 管理員已停用你帳戶的 AI Studio | [解決 Workspace 存取封鎖](/docs/troubleshoot-ai-studio/#workspace-and-verification) |
| `403`（`FREE_TIER_VERIFICATION_REQUIRED`）或帳戶驗證提示 | 免費層級專案或帳戶需要行動裝置驗證 | [完成驗證或升級至付費方案](/docs/troubleshoot-ai-studio/#workspace-and-verification) |
| `429` 速率限制、找不到模型或達到每日配額 | 已達免費層級或 Google AI 方案上限，或模型需要付費 API 金鑰 | [解決配額、方案與計費問題](/docs/troubleshoot-ai-studio/#quota-and-billing) |
| 在 Playground 中出現 `No Content` 回應 | 安全設定封鎖了回應，或內容違反服務條款 | [解決 No Content 回應](/docs/troubleshoot-ai-studio/#resolve-no-content) |
| 在 Projects、Keys、Usage 或 Billing 上出現 `PERMISSION_DENIED` 或按鈕停用 | 缺少 Google Cloud IAM 角色或專案權限 | [檢查 Google Cloud IAM 權限](/docs/troubleshoot-ai-studio/#iam-permissions) |

## 瞭解 403 Access Restricted 錯誤 {#understand-403-errors}

如果你在開啟 Google AI Studio 時看到 `403 Access Restricted` 錯誤，表示你的工作階段不符合其中一項存取要求：

* **Unsupported region or VPN**：確認你位於[支援地區](/docs/available-regions/)，並關閉任何會將流量經由不支援地區路由的 VPN 或 Proxy。
* **Terms of Service**：確認你的帳戶已接受並遵守[服務條款](/docs/terms/)。
* **Multiple signed-in Google Accounts**：在僅登入你要使用的單一 Google 帳戶的私人或無痕視窗中開啟 [Google AI Studio](https://aistudio.google.com/)。

### 修正共用 Build 應用程式上的 403 錯誤 {#build-sharing-403}

如果終端使用者在開啟共用的 [Build mode](/docs/aistudio-build-mode/) 應用程式網址時收到 `403 Access Restricted` 錯誤，請檢查以下兩個原因：

* **Browser extensions**：Privacy Badger 等隱私擴充功能可能會封鎖共用應用程式的框架。請針對 `aistudio.google.com` 停用該擴充功能，然後重新載入。
* **Build errors in app code**：在 Build mode 中，提示代理修正目前程式碼中的任何建置問題，然後重新共用應用程式網址。

## 確認 Google 帳戶的年齡要求 {#age-requirements}

你必須年滿 18 歲才能使用 Google AI Studio。如果 AI Studio 在你嘗試登入時將你導向本節，請確認你的 Google 帳戶符合年齡要求：

* **Check your birthday**：確認你的出生日期在[生日設定](https://myaccount.google.com/birthday)中設定為 18 歲以上。
* **Verify your age**：在 Google 帳戶上完成[年齡驗證](https://myaccount.google.com/age-verification)。如需瞭解驗證選項，請參閱[在 Google 帳戶上驗證年齡](https://support.google.com/accounts/answer/10071085)。
* **Match your ID date of birth**：如果你使用身分證件驗證年齡，請確認你的[生日](https://myaccount.google.com/birthday)與證件上的日期相符。
* **Google Workspace accounts**：如果是 Google Workspace for Education 帳戶，請聯絡你的管理員，確認你的帳戶已標示為 18 歲以上。詳情請參閱[使用 Workspace 帳戶存取 Google AI Studio](/docs/workspace/)。

## 解決 Workspace 與驗證封鎖 {#workspace-and-verification}

* **Google Workspace disabled**：如果你看到 `We are sorry, but you do not have access to Google AI Studio. Please contact your Organization Administrator for access.`，表示你的 Workspace 管理員已關閉 AI Studio 服務。請將 [Google Workspace 存取指南](/docs/workspace/)分享給管理員，以便他們為你的機構單位或計費群組啟用 AI Studio。
* **Project or account verification (`FREE_TIER_VERIFICATION_REQUIRED`)**：部分免費層級專案與有異常活動的帳戶需要透過 QR code 進行行動裝置驗證。請按照[專案與帳號驗證](/docs/verification/)，使用 Android 手機或 iPhone 完成驗證，或[設定計費](/docs/billing/#setup-billing)以使用付費層級，無需驗證。

## 解決配額、方案與計費問題 {#quota-and-billing}

如果要求因 `429` 配額錯誤而失敗、模型無法使用，或你在 AI Studio 中達到每日上限：

* **Subscription quota vs. paid API key**：[Google AI Pro 與 Ultra 方案](/docs/google-ai-plans/)僅在個人 Google 帳戶上提供 AI Studio 內的每日網頁配額。這些方案不會改變 [Gemini API 用量層級](/docs/billing/)，也不涵蓋受管理代理或 Workspace 帳戶。當你達到每日訂閱上限，或需要僅限付費的模型與代理時，請連結付費的 [Gemini API 金鑰](/docs/api-key/)。
* **Prepay balance required for credits**：在 [Prepay](/docs/billing/#prepay) 計費帳戶上，你的付費點數餘額必須維持在 $0 以上，促銷 Google Cloud 點數才會生效。
* **Starter Tier publishing unavailable**：Google Cloud Starter Tier 不適用於 Google Workspace 帳戶、擁有有效或曾有付費 Cloud Billing 帳戶的帳戶，或活動記錄不足的帳戶。請連結計費帳戶，並[使用付費 Google Cloud 專案發佈](/docs/aistudio-deploying/#standard-deployment)。
* **Check service status and limits**：請查看 [AI Studio 狀態頁面](https://aistudio.google.com/status)瞭解目前的服務中斷情形，並參閱[速率限制](/docs/rate-limits/)瞭解各模型的上限。

## 解決 Google AI Studio 上的 No Content 回應 {#resolve-no-content}


!!! warning " "

      如果回應因任何原因遭到封鎖，Google AI Studio 會顯示 **No Content** 訊息。請將指標停留在 **No Content** 上，然後點選 **Safety** 查看詳情。


如果回應是因[安全設定](/docs/safety-settings/)而遭封鎖，且你已檢視使用情境的[安全風險](/docs/safety-guidance/)，請調整你的[安全設定](/docs/safety-settings/#safety-settings-ai-studio)後重試。

如果回應遭到封鎖的原因並非安全設定，則提示詞或回應可能違反[服務條款](/docs/terms/)，或屬於不支援的情況。

## 查看 token 用量與上限 {#check-token-usage}

在 Playground 中開啟提示詞時，請查看提示詞列或 **Text Preview** 按鈕上顯示的 token 數量，將目前提示詞的長度與模型的最大上下文視窗進行比較。詳情請參閱 [Token 計算](/docs/tokens/)。

## Google AI Studio 的 Google Cloud IAM 權限 {#iam-permissions}

Google Cloud 專案的成員需要特定的 Identity and Access Management（IAM）權限，才能在 Google AI Studio 中執行動作。如需瞭解 IAM 身分的背景資訊，請參閱 [IAM 主體總覽](https://docs.cloud.google.com/iam/docs/principals-overview)。

在相關聯的 Google Cloud 專案中具有 **Editor**（`roles/editor`）或 **Owner**（`roles/owner`）角色的使用者，擁有查看資訊主頁及管理 Gemini API 金鑰的完整權限。具有 **Viewer**（`roles/viewer`）角色的使用者可以查看資訊主頁和 API 金鑰，但無法建立、更新或刪除。

如需精細的存取控管，請授予下方所列的確切權限。如需瞭解如何授予角色，請參閱[授予、變更及撤銷資源存取權](https://cloud.google.com/iam/docs/granting-changing-revoking-access)。


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
* **Terms of Service**：你必須接受 Google 服務條款與 [Gemini API 附加服務條款](/docs/terms/)。
* **Supported region**：你必須位於[支援地區](/docs/available-regions/)內。
* **Age requirements**：你的 Google 帳戶必須符合[年齡要求](/docs/troubleshoot-ai-studio/#age-requirements)（18 歲以上）。
* **Trust & Safety**：Google Cloud 專案不得被標示為濫用。
