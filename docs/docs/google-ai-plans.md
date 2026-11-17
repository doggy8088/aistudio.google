# Google AI 方案

在 AI Studio 中使用你的 Google AI 訂閱方案。

Google AI Pro 與 Ultra 訂閱方案可在 AI Studio 中提供更高的模型存取權限與更高的速率限制。相較於免費方案，這些方案提供更多資源，可用於原型開發與程式開發。

如要註冊 Google AI 方案，請在 Google AI Studio 中升級。點選左側選單中的 **Upgrade**。你也可以在 [Google AI 方案頁面](https://one.google.com/about/google-ai-plans/)註冊。

## 總覽 {#overview}

Google AI Pro 與 Ultra 訂閱可解鎖付費模型與更高的速率限制。這些權益適用於 Google AI Studio Playground，以及 [Build 模式](/docs/aistudio-build-mode/)中的 Code Assistant 等功能，方便快速進行原型開發。訂閱者可獲得高於免費方案的每日基本配額，可在 [Playground](https://aistudio.google.com/prompts/new_chat) 與 [Build](https://aistudio.google.com/apps) 介面中使用。每日上限採用重置制，而非滾動時間視窗。這能提供一致的開發體驗，讓你在透過 Cloud Billing 轉入正式環境之前先行開發。

| 方案 | AI Studio 用量 | 模型存取與權益 |
| :--- | :--- | :--- |
| **Free** | 配額較低 | 基本上限與存取權限，包含 [Gemini 4 Hydrogen](/docs/models/gemini-4-hydrogen/)，並可升級以取得更多資源。 |
| **AI Pro** | 配額較高 | 可存取高階模型，例如 [Gemini 4 Argon](/docs/models/gemini-4-argon/)、Gemini Pro、[Gemini Nano Banana 2.1](/docs/models/gemini-nano-banana-2.1/) 與 [Lyria 3.5](/docs/models/lyria-3.5/)。 |
| **AI Ultra** | 配額最高 | 原型開發與程式開發的最高上限，以及 [Gemini 4 Carbon](/docs/models/gemini-4-carbon/) 與 [Gemini 4 Argon](/docs/models/gemini-4-argon/) 等最先進的前沿模型。 |

## Gemini API 用量 {#gemini-api-usage}

當你在 AI Studio 中達到每日訂閱配額時，可以改用 Gemini API 金鑰繼續工作。啟用 Cloud Billing 後，Gemini API 用量將依每次要求計費。你可以在 [AI Studio Dashboard](https://aistudio.google.com/projects) 中追蹤各專案與 API 金鑰的 Gemini API 用量。

擁有 Google Cloud 專案並啟用 Cloud Billing 的訂閱者，可以透過 [Google Developer Program](https://developers.google.com/program) 取得每月 Cloud 點數。這些點數適用於 Cloud 服務，包括 Gemini API。預付與後付的用量與計費方式維持不變。採用預付計費時，你在 AI Studio 中需要有大於 $0 的已付餘額，才能啟用促銷點數。Google 會優先套用符合資格的 Google Cloud 點數。[瞭解詳情](/docs/billing/#billing-plans)。

Google AI 訂閱能協助你展開進階實驗、學習與開發。如要大規模建構應用程式與製作原型，請使用 [Starter Tier 專案](https://docs.cloud.google.com/docs/starter-tier)（如符合資格），或搭配 Gemini API 金鑰的 Google Cloud 專案。

## 限制與相容性 {#limitations}

*   **僅限 AI Studio 介面**：Google AI 方案針對開發用途的權益，僅適用於 Google AI Studio 網頁介面。Gemini API 的用量（例如使用 API 金鑰或外部應用程式）由 Google 另外計費與管理。不過，你可以在其他 Google 產品中使用你的訂閱（參見 [Google AI 方案](https://one.google.com/about/google-ai-plans/)）。
*   **與 API 計費不同**：AI Studio 的 Google AI 方案與 [Gemini API 用量級別](/docs/billing/)是分開的，後者涵蓋開發與正式環境的 API 用量。
*   **Google One 點數**：[Google One AI 點數](https://support.google.com/googleone/answer/16287445)是獨立的點數系統，AI Studio 不支援，也不會與 Google Cloud 點數重疊。
*   **Gemini 4 存取權限**：[Gemini 4 Hydrogen](/docs/models/gemini-4-hydrogen/)適用於所有方案，包括免費方案。[Gemini 4 Carbon](/docs/models/gemini-4-carbon/)在 AI Studio 中需要 AI Ultra 方案（免費與 AI Pro 方案不提供）。[Gemini 4 Argon](/docs/models/gemini-4-argon/)適用於 AI Pro 與 AI Ultra（免費方案不提供）。
*   **代理存取權限**：Google AI 方案不包含 Deep Research 或 Antigravity Preview 等代理的存取權限。這些功能需要[付費 API 金鑰](/docs/billing/#setup-billing)。

## 後續步驟 {#whats-next}

*   瞭解 [AI Studio Build 模式](/docs/aistudio-build-mode/)。
*   瞭解 [Starter Tier](https://docs.cloud.google.com/docs/starter-tier)。
*   瞭解 [Gemini API 計費與用量級別](/docs/billing/)。
*   探索可用的 [Gemini 模型](/docs/models/)。
