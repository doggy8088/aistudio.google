# 在 Google AI Studio 發布你的應用程式

Google AI Studio 讓你能直接從 Build mode 發布全端網頁應用程式。發布應用程式後，AI Studio 會將其託管在受管理、可擴展的 Cloud Run 服務上，並提供可分享的網址。

## 發布選項 {#deployment-options}

從 AI Studio Build mode 發布應用程式時，需求取決於你使用的專案方案：

* [**Google Cloud Starter Tier**](https://docs.cloud.google.com/docs/starter-tier)：讓符合資格的帳號無需設定 Google Cloud 專案或計費帳戶，即可發布最多 2 個全端應用程式。

* **付費 Google Cloud 專案**：需要將已啟用 Cloud Billing 的 Google Cloud 專案連結至你的 AI Studio 帳號。


## Starter Tier 總覽 {#about-the-starter-tier}

[Starter Tier](https://docs.cloud.google.com/docs/starter-tier) 提供一條無需設定 Google Cloud 專案或計費帳戶即可發布應用程式的路徑。符合資格的使用者會獲得由 Google 管理的 Starter Tier 專案，可存取[受支援的 Google Cloud 與 Google 服務](https://docs.cloud.google.com/docs/starter-tier#supported-products)。如果你的應用程式需要不受支援的服務，請改用標準 Google Cloud 專案，或升級你的 Starter Tier 專案。

每個已發布的應用程式都會以 Cloud Run 中的一項服務執行。Starter Tier 應用程式在你的專案中有以下限制：

* 總共最多發布兩個應用程式。
* 將應用程式託管在[單一 Cloud Run 區域](https://docs.cloud.google.com/run/docs/locations)。

### Starter Tier 資格 {#starter-tier-eligibility}

並非所有帳號都符合 Google Cloud Starter Tier 的資格。若符合以下任一情況，你的帳號可能不符合資格：

* 你使用 Google Workspace 帳號登入（包括付費或免費的 Google Workspace、Google Workspace for Education 或 Google for Nonprofits）。
* 你擁有有效或曾經使用過的付費 Google Cloud 計費帳戶。
* 我們目前從你的帳號活動中獲得的證據還不足以授予 Starter Tier 存取權。

Google AI Studio 支援團隊無法變更 Starter Tier 的資格判定。如果你的帳號不符合資格，請連結計費帳戶，並[使用付費 Google Cloud 專案發布](/docs/aistudio-deploying/#standard-deployment)。

## 使用 Starter Tier 發布 {#starter-tier-deployment-steps}

在 Build mode 中建置好應用程式後，即可使用 Starter Tier 發布：

1. 點選右上角的 **Publish**。
2. 點選 **Get started**（若有顯示），然後確認你的專案並點選 **Continue**。
3. 點選 **Continue with free URL**（若有顯示），然後點選 **Publish your app**。

發布完成後，AI Studio 會提供一個公開網址，任何人都能開啟你上線中的應用程式。


!!! note " "

      如果你的 Starter Tier 上已有 2 個已發布的應用程式，請先取消發布其中一個，或升級至付費 Google Cloud 專案，再發布另一個應用程式。


## AI Studio 的自訂網址 {#custom-urls}

發布網頁應用程式時，Google AI Studio 提供兩種自訂網址選項：

* **`ai.studio` 子網域**：免費的內建子網域（例如 `https://your-app-name.ai.studio`），Google Cloud Starter Tier 與付費 Google Cloud 專案皆可使用。
* **自訂網域**：你自行註冊的網域（例如 `https://example.com`），付費 Google Cloud 專案可使用。

以下各節說明如何設定各個選項，以及如何回報商標問題。

### ai.studio 子網域 {#set-custom-url}

每個 `ai.studio` 子網域在 AI Studio 中都是唯一的，並採先到先得的方式提供。若某個名稱無法使用，請在 **Publish** 面板中選擇其他名稱。取消發布或刪除應用程式後，其子網域將釋出，任何人都能申請使用。

發布時設定 `ai.studio` 子網域的方法如下：

1. 在 Google AI Studio **Build** mode 中開啟你的應用程式，並點選右上角的 **Publish**。
2. 確認你的專案並點選 **Continue**（若出現提示）。展開 **Free .ai.studio URL**，並輸入你偏好的子網域，或保留建議的網址。
3. 點選 **Continue with free URL**（若有顯示），然後點選 **Publish your app**。

若要將 `ai.studio` 子網域移至另一個應用程式，請先取消發布或刪除目前的應用程式，然後再使用該子網域發布新應用程式。

### 自訂網域 {#custom-domains}

在付費 Google Cloud 專案中，你可以從 **Publish** 面板購買並連接網域（例如 `example.com`）。你也可以重複使用在 AI Studio 中購買的網域。我們也計畫在未來支援轉移既有網域。

AI Studio 會在 Cloud Domains 中註冊網域、設定 Cloud DNS 路由，並建立受管理的 SSL 憑證。你的應用程式也會保留其 `ai.studio` 子網域網址。定價、設定步驟、訂閱管理與配額申請，請參閱 [Custom domains in Google AI Studio](/docs/aistudio-custom-domains/)。

### 回報商標或著作權問題 {#report-issues}

自訂子網域必須遵守 [Google Terms of Service](https://policies.google.com/terms)。若要回報未經授權使用商標或受著作權保護名稱的自訂網址，請透過 [Google Legal Troubleshooter](https://support.google.com/legal/troubleshooter/1114905) 回報。

## 使用付費 Google Cloud 專案發布 {#standard-deployment}

隨著應用程式成長，你可能需要 Starter Tier 以外的功能，包括[自訂網域](/docs/aistudio-custom-domains/)、更高的配額、更多的運算資源，以及其他 Google Cloud 產品。若要使用這些功能，請將你的 Starter Tier 專案轉換為標準 Google Cloud 專案。

升級會保留你已發布的應用程式與專案資源。請依照步驟[建立 Cloud Billing 帳戶](https://docs.cloud.google.com/billing/docs/how-to/create-billing-account#create-new-billing-account)、接受 Google Cloud Terms of Service，並[升級至標準 Google Cloud 專案](https://docs.cloud.google.com/docs/starter-tier#upgrade)。詳情請參閱 [Setup for Paid accounts](https://docs.cloud.google.com/billing/docs/in-product-billing-setup#paid-setup)。

若要進一步了解計費方案，請參閱[計費](/docs/billing/)。

## 刪除你的應用程式 {#delete-application}

若要在 Google AI Studio 中刪除應用程式：

1. 在 Google AI Studio 中開啟你的 [Apps page](https://aistudio.google.com/apps)。
2. 將指標停留在要刪除的應用程式上，並點選右側的垃圾桶圖示。
3. 確認刪除。如果已連接[自訂網域](/docs/aistudio-custom-domains/#manage-domain)，請先選擇要取消或保留你的網域訂閱。

## 保護你已發布應用程式的安全 {#keep-app-secure}

從 AI Studio 發布的應用程式，其安全性是共同責任。Google 會管理並保護託管你應用程式的 Cloud Run 基礎架構。你則負責你的應用程式程式碼及其相依性，包括 AI Studio 為你產生的程式碼與套件。

安全研究人員會定期發現開放原始碼套件中的新漏洞。若要保護你的應用程式免受已知漏洞影響，請執行以下事項：

* 定期將應用程式的相依性（例如 npm 套件）更新至包含最新安全修正的版本。
* 更新相依性後，重新發布你的應用程式，讓上線版本包含這些修正。
* 迅速回應與你的應用程式或其相依性相關的安全通知。

若要進一步了解你與 Google 之間的責任劃分，請參閱 [Shared responsibilities and shared fate on Google Cloud](https://docs.cloud.google.com/architecture/framework/security/shared-responsibility-shared-fate)。

## 後續步驟 {#whats-next}

* 在 [Custom domains in Google AI Studio](/docs/aistudio-custom-domains/) 購買並連接你自己的網域。
* 進一步了解 [Google Cloud Starter Tier](https://docs.cloud.google.com/docs/starter-tier)。
* 閱讀 Gemini API 的[計費](/docs/billing/)說明。
* 了解 [shared responsibilities and shared fate on Google Cloud](https://docs.cloud.google.com/architecture/framework/security/shared-responsibility-shared-fate)。
