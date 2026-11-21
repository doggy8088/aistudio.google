# Google AI 方案

在 Google AI Studio 中使用你的 Google AI 訂閱方案，並在應用程式內直接領取每月的 Gemini API 點數，不必離開應用程式。

Google AI Pro 與 Ultra 方案提供更高的每日用量上限、可存取更多模型，以及每月 Gemini API 專用的 Google Cloud 點數。如要在 Google AI Studio 中註冊或升級，請點選左側選單中的 **Upgrade**，或造訪 [Google AI 方案頁面](https://one.google.com/about/google-ai-plans/)。

## 方案權益 {#overview}

Google AI Pro 與 Ultra 訂閱可解鎖付費模型與更高的每日速率限制，適用於 [Playground](https://aistudio.google.com/prompts/new_chat) 與 [Build](https://aistudio.google.com/apps) 介面，包括 [Build 模式](/docs/aistudio-build-mode/)中的 Code Assistant。每日額度會每天重置，而非使用滾動時間視窗。

這兩個方案也包含來自 [Google Developer Program](https://developers.google.com/program) 的每月促銷 Google Cloud 點數。你可以在 AI Studio 中領取這些點數，並套用至任何付費 Gemini API 金鑰。

| 方案 | AI Studio 每日配額 | 模型存取權限 | 每月 API 點數 |
| :--- | :--- | :--- | :--- |
| **Free** | 配額較低 | 基本存取權限，包含 [Gemini 4 Hydrogen](/docs/models/gemini-4-hydrogen/)。 | 無 |
| **AI Pro** | 配額較高 | 可存取 [Gemini 4 Neon](/docs/models/gemini-4-neon/)、Gemini Pro、[Gemini Nano Banana 2.1](/docs/models/gemini-nano-banana-2.1/) 與 [Lyria 3.5](/docs/models/lyria-3.5/)。 | 每月 $10 |
| **AI Ultra** | 配額最高 | 最高上限與前沿模型，包含 [Gemini 4 Carbon](/docs/models/gemini-4-carbon/) 與 [Gemini 4 Neon](/docs/models/gemini-4-neon/)。 | 每月 $40（Ultra 5x）或 $100（Ultra 20x） |

## 在 AI Studio 中領取每月 API 點數 {#claim-api-credits}

Google AI Pro 與 Ultra 訂閱者可以透過 AI Studio 內的引導流程領取每月 Google Cloud 點數。每筆每月補助的有效期為 12 個月，可搭配你在 Playground、Build 模式、外部應用程式與其他 Google Cloud 服務中使用的付費 Gemini API 金鑰。

開始之前，請確認你已具備：

* 主要訂閱者帳號上有效的 Google AI Pro 或 Google AI Ultra 方案。
* 以同一個 `@gmail.com` Google 帳號登入 [Google AI Studio](https://aistudio.google.com/)。
* 若你要設定新的 Prepay Cloud Billing 帳號，需有付款方式可支付 $5 的最低 [Prepay](/docs/billing/#prepay) 儲值金。


![在 Google AI Studio 中顯示「領取點數」步驟的「領取 Google Cloud 點數」對話方塊](https://www.gstatic.com/cloud-cms/4290d23d482411fbc878465380262ca1.png)

如要領取並開始使用點數，請依下列步驟操作：

1. 在 [Google AI Studio](https://aistudio.google.com/) 中，點選左側選單中的 **Claim free API credits**（若你已有開發人員設定檔與帳單帳戶，則點選 **Redeem** 點數卡片）。
2. 選擇現有的 Google Cloud 專案與 API 金鑰，或保留自動建立的 **Default Gemini Project** 與金鑰。
3. 點選 **Set up billing**，連結或建立 Cloud Billing 帳戶。採用 Prepay 帳戶時，請至少購買 $5 的點數，以啟用你的已付餘額。
4. 詳閱 Google Developer Program 服務條款，然後點選 **Redeem and Continue**（或 **Redeem**／**Redeem all**）。保持勾選 **Auto-apply future Google Developer Program credits to this billing account**，讓日後的每月補助自動套用至此帳單帳戶。
5. 點選 **Select key**，在 AI Studio 中連結你的付費 API 金鑰。在 Playground 中，提示詞方塊裡的金鑰圖示會確認你的付費金鑰已啟用。在 Build 模式中，請在出現提示時連結金鑰，或在應用程式的 **Secrets** 分頁中設定 `GEMINI_API_KEY`。


!!! note " "

      採用 Prepay 計費的帳戶，必須先有大於 $0 的已付餘額，促銷 Google Cloud 點數才能套用。Google 會先從你符合資格的促銷點數扣抵，再使用你的 $5 已付餘額。如果你的 Prepay 已付餘額降至 $0，促銷點數會暫停使用，直到你儲值為止。詳情請參閱[計費方案](/docs/billing/#billing-plans)。


你也可以查看[領取 Google AI 方案點數的逐步圖解指南](/learn/claim-google-ai-plan-credits-in-ai-studio/)。

## Gemini API 用量與支出控管 {#gemini-api-usage}

連結付費 API 金鑰後，你可以隨時在訂閱額度與隨用隨付的 API 用量之間切換。當你達到每日 AI Studio 訂閱上限、建構外部應用程式，或需要必須使用 API 計費的模型與[代理](/docs/agents/)時，請使用付費金鑰。

* **查看點數餘額**：在 [AI Studio Billing](https://aistudio.google.com/billing) 頁面、AI Studio 帳戶選單，或你的 [Google Developer Program](https://me.developers.google.com/) 個人檔案中，查看剩餘的促銷點數、到期日與已付餘額。
* **監控用量**：在 [AI Studio Usage](https://aistudio.google.com/usage) 與 [Projects](https://aistudio.google.com/projects) 頁面上，按專案或 API 金鑰追蹤要求量與費用。
* **設定支出上限**：在 [AI Studio Spend](https://aistudio.google.com/spend) 頁面上新增[每月專案支出上限](/docs/billing/#project-spend-caps)，在達到你設定的預算後停止付費 API 要求。

如果你想在不先設定 Cloud Billing 的情況下建構並部署全端應用程式，請確認你是否符合 [Starter Tier 專案](https://docs.cloud.google.com/docs/starter-tier)的資格。

## 限制 {#limitations}

* **訂閱配額與 API 點數的差異**：你的 Google AI 方案每日配額僅適用於 Google AI Studio 網頁介面。已領取的 Google Cloud 點數適用於使用付費 API 金鑰發出的 Gemini API 要求，無論是在 AI Studio 內或外部應用程式中皆然。
* **與 API 計費不同**：AI Studio 的 Google AI 方案與 [Gemini API 用量級別](/docs/billing/)是分開的，後者規範 API 速率限制與支出上限。
* **僅限主要訂閱者**：每月 API 點數僅發放給主要訂閱者的 Google 帳號，且只能套用至單一 Cloud Billing 帳戶。家庭方案成員與 Google AI Plus 方案不符合 Google Developer Program API 點數的領取資格。
* **Google One AI 點數**：[Google One AI 點數](https://support.google.com/googleone/answer/16287445)是獨立的消費者點數系統。它們無法在 AI Studio 中使用，也不會與 Google Cloud 點數重疊。
* **Gemini 4 存取權限**：[Gemini 4 Hydrogen](/docs/models/gemini-4-hydrogen/)適用於所有方案，包括免費方案。[Gemini 4 Neon](/docs/models/gemini-4-neon/)適用於 AI Pro 與 AI Ultra。[Gemini 4 Carbon](/docs/models/gemini-4-carbon/)在 AI Studio 中需要 AI Ultra，或使用[付費 API 金鑰](/docs/billing/#setup-billing)。
* **代理存取權限**：Google AI 方案不包含 Deep Research 或 Antigravity Preview 等代理的訂閱配額。這些功能需要[付費 API 金鑰](/docs/billing/#setup-billing)，可從你已領取的 API 點數扣抵。

## 後續步驟 {#whats-next}

* 依循圖解指南，在 AI Studio 中[領取 Google AI 方案點數](/learn/claim-google-ai-plan-credits-in-ai-studio/)。
* 瞭解 [Gemini API 計費、Prepay 與支出上限](/docs/billing/)。
* 瞭解 [AI Studio Build 模式](/docs/aistudio-build-mode/)。
* 瞭解 [Starter Tier](https://docs.cloud.google.com/docs/starter-tier)。
* 探索可用的 [Gemini 模型](/docs/models/)。
