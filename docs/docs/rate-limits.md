# 速率限制

速率限制規範了你在一定時間範圍內可向 Gemini API 發出的要求數量。這些限制有助於維持公平使用、防範濫用，並確保所有使用者都能享有穩定的系統效能。

[在 AI Studio 中查看你目前的速率限制](https://aistudio.google.com/rate-limit?timeRange=last-28-days)

## 速率限制的運作方式 {#how-rate-limits-work}

速率限制通常從三個面向衡量：

* 每分鐘要求數（**RPM**）
* 每分鐘權杖數（輸入）（**TPM**）
* 每日要求數（**RPD**）

你的使用量會逐一與各項限制比對，超過任何一項都會觸發速率限制錯誤。舉例來說，若你的 RPM 上限為 20，在一分鐘內發出 21 次要求就會出錯，即使你尚未超過 TPM 或其他限制也一樣。

速率限制以專案為單位套用，而非以 API 金鑰為單位。每日要求數（**RPD**）配額於太平洋時間午夜重置。

限制會因所使用的模型而異，有些限制只適用於特定模型。例如每分鐘圖片數（IPM）僅針對能生成圖片的模型（Nano Banana）計算，但概念上與 TPM 類似。其他模型可能設有每日權杖上限（TPD）。內建工具也有各自的速率限制，例如 Gemini 3 與更新模型的使用 Google 搜尋接地，在 Gemini Developer API 上預設每個專案每天上限 1,500 次要求（RPD）（詳見[使用 Google 搜尋接地](/docs/google-search/#pricing)）。

實驗版與預覽版模型的速率限制更為嚴格。

### 以支出為基礎的速率限制 {#spend-rate-limits}

除了每分鐘要求數（RPM）與每分鐘權杖數（TPM）限制外，Gemini API 還會施行以支出為基礎的速率限制，以防範非預期的費用。此類限制是否適用於你的帳戶，取決於你的計費紀錄與[使用層級](/docs/rate-limits/#usage-tiers)。

下表列出各[使用層級](/docs/rate-limits/#usage-tiers)的支出型速率限制。這些限制以滾動式 10 分鐘視窗評估。此類限制是否適用於你的帳戶，取決於你的計費紀錄與帳戶狀態。

| 使用層級 | 支出速率限制（每 10 分鐘） |
| :--- | :--- |
| **Free** | N/A |
| **Tier 1** | $10 |
| **Tier 2** | $200 |
| **Tier 3** | $200 |

若你觸及支出型速率限制，API 會傳回 `429 RESOURCE_EXHAUSTED` 錯誤。解決方式如下：

* 稍候片刻後重試。
* 降低昂貴要求的發出速率，例如改用較小的上下文視窗或較短的輸出。
* 若你在正常使用下仍經常觸及此限制，可[申請提高速率限制](/docs/rate-limits/#request-rate-limit-increase)。

## 使用層級 {#usage-tiers}

速率限制與專案的使用層級連動。隨著你的 API 使用量與支出增加，你會自動升級至更高的層級，享有更高的速率限制。

Tier 2 與 Tier 3 的資格，取決於與你專案連結的計費帳戶在 Google Cloud 服務（包括但不限於 Gemini API）上的累計總支出。

| 使用層級 | 資格 | [計費層級上限](/docs/billing/#tier-spend-caps) |
| :--- | :--- | :--- |
| **Free** | [有效專案](/docs/api-key/#google-cloud-projects)或免費試用；部分專案需要[驗證](/docs/verification/) | N/A |
| **Tier 1** | [設定並連結有效的計費帳戶](/docs/billing/#setup-billing) | $250 |
| **Tier 2** | 已付款 $100，且自首次成功付款起滿 3 天 | $2,000 |
| **Tier 3** | 已付款 $1,000，且自首次成功付款起滿 30 天 | $20,000 - $100,000+ |

符合所列資格條件通常即足以獲准，但在極少數情況下，升級申請仍可能因審查過程中發現的其他因素而被拒絕。

這套制度有助於維護 Gemini API 平台的安全與完整，讓所有使用者受惠。

## Gemini API 速率限制 {#current-rate-limits}

速率限制取決於多種因素（例如你的使用層級），可於 Google AI Studio 中查看。隨著你的層級與帳戶狀態隨時間變動，速率限制也會自動更新。

[在 AI Studio 中查看你目前的速率限制](https://aistudio.google.com/rate-limit?timeRange=last-28-days)

所列速率限制不保證實際容量，實際容量可能有所差異。

### Gemini Omni Flash 速率限制 {#gemini-omni-flash-rate-limits}

以下標準互動式速率限制適用於 [`gemini-omni-1.2-flash`](/docs/models/gemini-omni-flash/)：


| 使用層級 | 每分鐘要求數（RPM） | 每日要求數（RPD） |
| --- | --- | --- |
| Free | Not supported | Not supported |
| Tier 1 | 8 | 40 |
| Tier 2 | 16 | 200 |
| Tier 3 | 40 | 2,000 |


### Gemini Decision 1 速率限制 {#gemini-decision}

以下標準互動式速率限制適用於 [Decisions API](/docs/decisions-api/) 上的 [Gemini Decision 1](/docs/models/gemini-decision-1/)：


| 使用層級 | 每分鐘要求數（RPM） | 每分鐘權杖數（TPM） | 每日要求數（RPD） |
| --- | --- | --- | --- |
| Free | 200 | 50,000 | 10,000 |
| Tier 1 | 1,500 | 1,000,000 | 50,000 |
| Tier 2 | 5,000 | 4,000,000 | Unlimited |
| Tier 3 | 15,000 | 10,000,000 | Unlimited |


Gemini Decision 1 不支援 [Batch API](/docs/batch-api/)。

## 優先推論速率限制 {#priority}

[優先推論](/docs/priority-inference/)的用量有其專屬的速率限制，不過用量仍會計入整體互動流量的速率限制。**預設速率限制為：每個模型與層級[標準速率限制](https://aistudio.google.com/rate-limit)的 0.3 倍**

## Batch API 速率限制 {#batch-api}

[Batch API](/docs/batch-api/) 要求有其專屬的速率限制，與非批次 API 呼叫分開計算。

* **並行批次要求：** 100
* **輸入檔案大小上限：** 2GB
* **檔案儲存上限：** 20GB
* **每個模型排入佇列的權杖數：** **Batch enqueued tokens** 表格列出在指定模型下，你所有進行中的批次工作合計可排入批次處理佇列的權杖數上限。


=== "Tier 1"


    | 模型 | 批次排入佇列的權杖數 |
    | --- | --- |
    | Gemini 4 Carbon | 5,000,000 |
    | Gemini 4 Argon | 5,000,000 |
    | Gemini 4 Neon | 5,000,000 |
    | Gemini 4 Hydrogen | 3,000,000 |
    | Gemini 3.1 Pro Preview | 5,000,000 |
    | Gemini 3.8 Flash | 3,000,000 |
    | Gemini 3.6 Flash | 3,000,000 |
    | Gemini 3.5 Flash-Lite | 10,000,000 |
    | Gemini 3.1 Flash Lite | 10,000,000 |
    | Gemini 3.1 Flash Lite Preview | 10,000,000 |
    | Gemini 2.5 Pro | 5,000,000 |
    | Gemini 2.5 Pro TTS | 25,000 |
    | Gemini 2.5 Flash | 3,000,000 |
    | Gemini 2.5 Flash Preview | 3,000,000 |
    | Gemini 2.5 Flash Image Preview | 3,000,000 |
    | Gemini 2.5 Flash TTS | 100,000 |
    | Gemini 2.5 Flash Lite | 10,000,000 |
    | Gemini 2.5 Flash Lite Preview | 10,000,000 |
    | Gemini 2.0 Flash | 10,000,000 |
    | Gemini 2.0 Flash Image | 3,000,000 |
    | Gemini 2.0 Flash Lite | 10,000,000 |
    | Gemini 3.1 Flash Image Preview 🍌 | 1,000,000 |
    | Gemini 3.1 Flash Lite Image 🍌 | 2,000,000 |
    | Gemini 3 Pro Image Preview 🍌 | 2,000,000 |
    | Gemini Embedding | 500,000 |

=== "Tier 2"


    | 模型 | 批次排入佇列的權杖數 |
    | --- | --- |
    | Gemini 4 Carbon | 500,000,000 |
    | Gemini 4 Argon | 500,000,000 |
    | Gemini 4 Neon | 500,000,000 |
    | Gemini 4 Hydrogen | 400,000,000 |
    | Gemini 3.1 Pro Preview | 500,000,000 |
    | Gemini 3.5 Flash-Lite | 500,000,000 |
    | Gemini 3.1 Flash Lite | 500,000,000 |
    | Gemini 3.1 Flash Lite Preview | 500,000,000 |
    | Gemini 3.8 Flash | 400,000,000 |
    | Gemini 3.6 Flash | 400,000,000 |
    | Gemini 2.5 Pro | 500,000,000 |
    | Gemini 2.5 Pro TTS | 100,000 |
    | Gemini 2.5 Flash | 400,000,000 |
    | Gemini 2.5 Flash Preview | 400,000,000 |
    | Gemini 2.5 Flash Image Preview | 400,000,000 |
    | Gemini 2.5 Flash TTS | 100,000 |
    | Gemini 2.5 Flash Lite | 500,000,000 |
    | Gemini 2.5 Flash Lite Preview | 500,000,000 |
    | Gemini 2.0 Flash | 1,000,000,000 |
    | Gemini 2.0 Flash Image | 400,000,000 |
    | Gemini 2.0 Flash Lite | 1,000,000,000 |
    | Gemini 3.1 Flash Image Preview 🍌 | 250,000,000 |
    | Gemini 3.1 Flash Lite Image 🍌 | 270,000,000 |
    | Gemini 3 Pro Image Preview 🍌 | 270,000,000 |
    | Gemini Embedding | 5,000,000 |

=== "Tier 3"


    | 模型 | 批次排入佇列的權杖數 |
    | --- | --- |
    | Gemini 4 Carbon | 1,000,000,000 |
    | Gemini 4 Argon | 1,000,000,000 |
    | Gemini 4 Neon | 1,000,000,000 |
    | Gemini 4 Hydrogen | 1,000,000,000 |
    | Gemini 3.1 Pro Preview | 1,000,000,000 |
    | Gemini 3.5 Flash-Lite | 1,000,000,000 |
    | Gemini 3.1 Flash Lite | 1,000,000,000 |
    | Gemini 3.1 Flash Lite Preview | 1,000,000,000 |
    | Gemini 3.8 Flash | 1,000,000,000 |
    | Gemini 3.6 Flash | 1,000,000,000 |
    | Gemini 2.5 Pro | 1,000,000,000 |
    | Gemini 2.5 Pro TTS | 1,000,000 |
    | Gemini 2.5 Flash | 1,000,000,000 |
    | Gemini 2.5 Flash Preview | 1,000,000,000 |
    | Gemini 2.5 Flash Image Preview | 1,000,000,000 |
    | Gemini 2.5 Flash TTS | 4,000,000 |
    | Gemini 2.5 Flash Lite | 1,000,000,000 |
    | Gemini 2.5 Flash Lite Preview | 1,000,000,000 |
    | Gemini 2.0 Flash | 5,000,000,000 |
    | Gemini 2.0 Flash Image | 1,000,000,000 |
    | Gemini 2.0 Flash Lite | 5,000,000,000 |
    | Gemini 3.1 Flash Image Preview 🍌 | 750,000,000 |
    | Gemini 3.1 Flash Lite Image 🍌 | 1,000,000,000 |
    | Gemini 3 Pro Image Preview 🍌 | 1,000,000,000 |
    | Gemini Embedding | 10,000,000 |


## 如何升級至下一層級 {#how-to-upgrade-to-the-next-tier}

若要從 Free 層級轉換為付費層級，你必須先[在 AI Studio 中設定計費](/docs/billing/)。

當你的專案符合[所列條件](/docs/rate-limits/#usage-tiers)後，系統會自動將其升級至下一層級。從 Free 升級至 Tier 1 通常立即生效，後續的層級升級則會在 10 分鐘內生效。前往 AI Studio 的 [Projects page](https://aistudio.google.com/projects) 即可查看你的層級。

## 申請提高速率限制 {#request-rate-limit-increase}

每個模型變體都有對應的速率限制（每分鐘要求數，RPM）。如需各速率限制的詳細資訊，請參閱 [AI Studio Rate Limit](https://aistudio.google.com/rate-limit) 頁面。

[申請提高付費層級速率限制](https://forms.gle/ETzX94k8jf7iSotH9)

我們不保證能提高你的速率限制，但會盡力審查你的申請。
