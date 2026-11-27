# 計費

本指南說明 Gemini API 的各種計費方式，介紹如何啟用計費與監控用量，並解答計費方面的常見問題（FAQ）。

## 計費與級別 {#about-billing}

Gemini API 的計費級別取決於你的付款紀錄。

| 使用級別 | 資格條件 | [計費級別上限](/docs/billing/#spend-caps) |
| :--- | :--- | :--- |
| **Free** | [有效專案](/docs/api-key/#google-cloud-projects)或免費試用；部分專案需要[驗證](/docs/verification/) | 不適用 |
| **Tier 1** | [設定並連結有效的計費帳戶](/docs/billing/#setup-billing) | $250 |
| **Tier 2** | 已付款 $100，且自首次成功付款起滿 3 天 | $2,000 |
| **Tier 3** | 已付款 $1,000，且自首次成功付款起滿 30 天 | $20,000 - $100,000+ |

新帳號一開始屬於 Free Tier，可在 Gemini API 與 AI Studio 中使用[特定模型](/docs/pricing/)，上限為各模型的免費級別[速率限制](https://aistudio.google.com/rate-limit)。

若要直接從 Build mode 發布應用程式，符合資格的帳號可使用 **Google Cloud Starter Tier**。這個級別可讓你發布最多 2 個全端應用程式，無須設定 Google Cloud 專案或計費帳戶。資格詳情請參閱[在 Google AI Studio 中發布應用程式](/docs/aistudio-deploying/#starter-tier-eligibility)，更多資訊請參閱 [Google Cloud Starter Tier 文件](https://docs.cloud.google.com/docs/starter-tier)。

若要取得更高的速率限制、使用進階模型，並確保你的提示詞與回應**不會**被用來改善 Google 產品*，你可以[連結計費帳戶](/docs/billing/#setup-billing)並透過 [Prepay](/docs/billing/#prepay) 進入付費級別。之後，系統會依累計消費與帳號年齡，將你逐步升級到更高的級別。

級別、速率限制與計費帳戶上限，皆以[計費帳戶](/docs/billing/#cloud-billing)為單位判定。

* *企業級資料隱私：付費服務的資料使用方式詳情，請參閱[服務條款](/docs/terms/#data-use-paid)。*

## 設定計費以使用付費級別 {#setup-billing}

你可以在 [Google AI Studio](https://aistudio.google.com/projects) 中建立專案並設定計費，或匯入既有專案，以升級至付費級別。從 Free Tier 升級至付費級別，指的是連結計費帳戶並[預付](/docs/billing/#prepay)，為帳號加入至少 $5（或其他幣別的等值金額）的點數。

1. 前往 AI Studio 的 [API keys](https://aistudio.google.com/api-keys) 頁面、[Projects](https://aistudio.google.com/projects) 頁面，或 AI Studio 中任何顯示 **Set up billing** 按鈕的位置。

   * 新使用者預設會取得一個已建立的[專案與 API 金鑰](/docs/api-key/#google-cloud-projects)。

   * 如果你需要新的金鑰，請點選 [**Create API key**](https://aistudio.google.com/api-keys)，並依對話框指示，將金鑰與專案的配對加入表格。


2. 找到你想升級至付費級別的 Free Tier 專案，在 *Billing Tier* 欄位下方點選 **Set up billing**。

3. 如果你從未設定過 Google 計費帳戶：

   * 系統會要求你選擇國家或地區，以同意服務條款。
   * 接著，填寫或確認你的聯絡資訊與付款方式，即可繼續。

4. 如果你過去曾設定過 Google 計費帳戶：

   * 系統會要求你從既有的計費帳戶中選擇。
   * 如果你不想使用任何既有帳戶，請點選 **Add new billing account**，填寫或確認你的聯絡資訊與付款方式，即可繼續。

5. 接下來，你會遇到以下其中一種情況：

   * 系統要求你預付至少 $5 以完成計費設定（表示你的帳號會自動指派至 [Prepay](/docs/billing/#prepay) 計費方案），

   * 系統讓你在 [Prepay](/docs/billing/#prepay) 與 [Postpay](/docs/billing/#postpay) 兩種計費方案之間選擇。

   * 在新的 Prepay 系統推廣至所有使用者之前（自 2026 年 3 月 23 日起），你的帳號會先被指派至 [Postpay](/docs/billing/#postpay) 計費方案作為過渡安排。


6. 完成預付或選擇 Postpay 後，帳號設定即告完成。


### 升級至下一個付費級別 {#request-an-upgrade}

如果你已使用付費級別，且符合方案變更的[條件](/docs/billing/#about-billing)，系統會自動將你升級至下一個級別（仍須視[處理時間](/docs/billing/#processing-times)而定）。

## 驗證計費狀態 {#verify-billing}

將[計費帳戶連結](/docs/billing/#setup-billing)至專案後，你可以在 [AI Studio Billing 頁面](https://aistudio.google.com/billing)監控其狀態。與免費級別不同，付費級別的狀態是動態的；你的使用級別雖取決於帳號紀錄，但 Gemini API 僅在你擁有正數的 [Prepay](/docs/billing/#prepay) 點數餘額時，才會處理請求。

在 [Projects](https://aistudio.google.com/projects) 頁面上，你可以在 *Billing Tier* 欄位下方查看專案的級別與計費方案。你可能需要為專案採取的任何計費狀態動作，會顯示在 *Billing Tier* 或 *Status* 欄位中：

* 專案尚未連結計費帳戶時，顯示「***Set up billing***」。

* 專案已連結計費帳戶，但必須使用尚未設定的 [Prepay](/docs/billing/#prepay) 計費方案時，顯示「***Set up Prepay***」。

* 計費帳戶必須購買點數，但 Prepay 付款帳戶尚未設定，或可用點數餘額已耗盡時，顯示「***No credits***」。


點選任一訊息，即可進行必要的操作。

## 監控用量 {#monitor-usage}

你可以在 [Google AI Studio](https://aistudio.google.com/usage) 的 **Dashboard** > **Usage** 中監控 Gemini API 的用量。

## 計費方案 {#billing-plans}

Gemini API 與 AI Studio 的計費方案分為兩類，決定你何時為用量付款：Prepay 與 Postpay。你可以在 [AI Studio Billing](https://aistudio.google.com/billing) 頁面查看已指派的計費方案，並管理付款方式。

重要：Prepay 與 Postpay 計費方案自 **2026 年 3 月 23 日**起生效。

*  在 Prepay 與 Postpay 計費方案推出前就已建立的帳號，將經過評估後被指派方案，或可自行在兩種方案之間選擇。

*  在生效日之後建立的帳號，可能不會立即受影響；你一開始可能會被指派 Postpay 帳號，待新的計費方案系統全面推出後，再轉換至 Prepay。詳情請參閱[遷移至 Prepay](/docs/billing/#migrate-to-prepay)。

*  如果你使用 Prepay 計費帳戶，必須先為帳號加入資金，才能使用促銷 Cloud Credits。加入資金後，系統會先消耗你的促銷點數，再消耗預付資金。


### Prepay {#prepay}

在 Prepay 計費方案中，你會在 Gemini API 用量產生前，預先購買點數存入 Prepay 餘額，而 API 用量費用會以[近乎即時](/docs/billing/#processing-times)的方式，從你的 Prepay 點數餘額中扣除。你可以透過[加入點數](/docs/billing/#buy-credits)至帳號來預付，或設定[自動儲值](/docs/billing/#auto-reload)。點數購買後，未使用的點數會在 12 個月後到期且[不可退款](/docs/billing/#refunds)，但[轉換至 Postpay 帳號](/docs/billing/#postpay)後不在此限。

當計費帳戶的 Prepay 點數餘額歸零時，所有連結至該計費帳戶的專案中的所有 API 金鑰，都會同時停止運作。在你加入點數之前，請求會以 [HTTP 402 Payment Required](/docs/api-errors/) 錯誤失敗。Prepay 點數僅適用於 Gemini API 的用量費用；你無法用它來支付其他 Google Cloud 服務的費用。


!!! note " "

      注意：由於計費管線約有 10 分鐘的延遲，Prepay 計費可能產生超額費用。像[批次模式](/docs/batch-api/)與代理這類長時間執行的任務，可能會在系統處理並停止用量之前，持續消耗超出你餘額的點數。


新使用者預設使用 Prepay 計費方案。在 Prepay 與 Postpay 計費方案推出前就已建立的專案，可能需要先[更新專案的計費詳情](/docs/billing/#verify-billing)，才能繼續使用 Gemini API。

*請注意，Prepay 不適用於 [Invoiced (or Offline)](https://docs.cloud.google.com/billing/docs/concepts#billing_account_types) 帳戶。*

#### 為既有的 Postpay 帳號加入 Prepay {#adding-prepay-to-postpay}

如果你的既有 Cloud Billing 帳戶使用 **Postpay** 方案，你可以為其加入 **Prepay** 功能，以便預先購買點數。這些 Prepay 點數可讓你使用 Gemini API，無須建立新的 Cloud Billing 帳戶。

在為既有帳號加入 **Prepay** 的設定過程中，系統會顯示一個強制確認畫面，說明你所選的 Cloud Billing 帳戶將被修改。

系統必須在你提交預付款*之前*就修改你的帳戶狀態。因此，如果你在確認修改後、完成預付設定前取消流程，可能會導致已連結至該 Cloud Billing 帳戶的專案暫時中斷服務。請確保你已準備好完成預付流程，再確認轉換。如果遇到問題，請參閱[取消 **Prepay** 設定後服務中斷](https://docs.cloud.google.com/billing/docs/in-product-billing-setup#prepay-issue)。

如果你符合資格，並手動從 **Prepay** 週期切換至 **Postpay** 週期，任何剩餘的 Prepay 點數餘額都會自動退回至預付時使用的原始付款方式。不過，如果你基於其他任何原因關閉 Cloud Billing 帳戶，任何剩餘的 Prepay 點數都會被沒收且不予退款。

#### 購買點數 {#buy-credits}

你可以在 Gemini API 用量產生前，手動購買點數並存入 Prepay 帳戶的點數餘額。

如要購買點數，請前往 [AI Studio Billing](https://aistudio.google.com/billing) 頁面並選擇 **Buy credits**。最低購買金額為 $5。你可預付的點數金額上限為 $5,000。


!!! note " "

      注意：Prepay 使用者必須先[購買 Prepaid 點數](/docs/billing/#buy-credits)，才能使用任何適用於 Gemini API 的 Google Cloud 點數。當你擁有有效的 Prepay 點數餘額後，符合資格的 Google Cloud 點數會在你的 Prepay 點數餘額之前被消耗。當計費帳戶的 Prepay 點數餘額歸零時，Google Cloud 點數將不再被消耗。


#### 自動儲值 {#auto-reload}

自動儲值是一項選用功能，當你的 Prepay 點數餘額偏低時，會自動為其補充。這有助於避免服務中斷。

你可以在 [AI Studio Billing](https://aistudio.google.com/billing) 頁面的 *Available credits* 卡片中設定自動儲值，並查看自動儲值狀態。點選 **Setup auto-reload** 或 **Manage auto-reload**，即可設定付款方式、儲值金額，以及觸發儲值付款的最低餘額。

#### 每月自動扣款上限 {#monthly-auto-charge-limit}

每月自動扣款上限適用於 Prepay 使用者，有助於避免頻繁自動儲值點數而產生非預期費用。你可以使用這項功能，為單一計費週期內的自動儲值點數設定金額上限。當某個計費週期內的自動儲值總金額達到此上限時，系統會停用自動儲值，直到下個月開始為止。你手動發起的一次性付款，不會計入此上限。

在啟用自動儲值的情況下，設定每月自動扣款上限的步驟如下：

1. 前往 [AI Studio Billing](https://aistudio.google.com/billing) 頁面。
2. 點選 **Manage auto-reload**。
3. 展開 **Monthly Limit** 區段，輸入自動儲值的每月金額上限。
4. 點選 **Save**。

### Postpay {#postpay}

在 Postpay 計費方案中，你的 Cloud Billing 帳戶會累積費用，而你會在月底自動被扣款，或在費用達到依帳號級別[自動指派的消費上限](/docs/billing/#tier-spend-caps)時被扣款。款項會向你 Postpay 付款帳戶所連結的付款方式收取，你可以在 [AI Studio Billing](https://aistudio.google.com/billing) 頁面管理該付款方式。在 **Billing** 頁面上，你可以查看餘額、到期日與過往付款紀錄，也可以進行付款並管理付款方式。

為新專案[設定計費](/docs/billing/#setup-billing)時，如果你符合 Postpay 資格，你可以在[計費設定](/docs/billing/#setup-billing)對話框中，在 Prepay 與 Postpay 之間選擇。

將 Cloud Billing 帳戶切換至 Postpay 計費方案後，所有連結至該計費帳戶的專案都會切換至 Postpay 方案。你可以依[遷移至 Prepay](/docs/billing/#migrate-to-prepay)中的步驟，將符合資格的帳號移至 Prepay。你也可以將專案移至使用不同計費方案的計費帳戶，以變更該專案的扣款週期；詳情請參閱 Cloud 文件中關於[管理專案計費](https://docs.cloud.google.com/billing/docs/how-to/modify-project)的說明。

你可以在 [Cloud Billing 指南](https://docs.cloud.google.com/billing/docs/how-to/billing-cycle)中進一步了解 Postpay 的扣款週期。

### 遷移至 Prepay {#migrate-to-prepay}

Google AI Studio 正在將開發者帳號的 Gemini API 用量計費，從 Postpay 轉換為 Prepay。此變更僅適用於 Gemini API；連結至你計費帳戶的其他 Google Cloud 服務仍維持 Postpay。

請在帳號通知中的截止日期前切換至 Prepay 並加入點數，以避免服務中斷。僅使用 Free Tier 功能的帳號無須採取任何行動。

將既有的 Postpay 帳號切換至 Prepay 的步驟如下：

1. 前往 [AI Studio Billing](https://aistudio.google.com/billing) 頁面。

2. 為你的計費帳戶選擇 **Switch to Prepay**。

3. [購買點數](/docs/billing/#buy-credits)（至少 $5），以存入起始餘額。


切換後，為避免服務中斷，請設定[自動儲值](/docs/billing/#auto-reload)，在點數餘額偏低時自動補充。

## 消費上限 {#spend-caps}

Gemini API 同時支援計費帳戶級別與專案層級的每月消費上限。這些控制措施旨在保護你的帳號免於非預期的超額費用，並維護生態系以確保服務可用性。

*請注意，消費上限不適用於 [Invoiced (or Offline)](https://docs.cloud.google.com/billing/docs/concepts#billing_account_types) 帳戶。*

### 專案消費上限 {#project-spend-caps}

實驗性功能：此功能為實驗性質且範圍有限。在約 10 分鐘的延遲期間內，你仍可能產生超額費用。

你可以在 AI Studio 中設定自己的[專案層級](/docs/api-key/#google-cloud-projects)消費上限。如果你同一個計費帳戶下有多個專案，並希望確保每個專案都能使用足夠的累計消費額度，這項功能會很有幫助。

擁有專案編輯者、擁有者或管理員[角色](https://docs.cloud.google.com/iam/docs/roles-overview)的帳號，可以在 AI Studio 的 [Spend](https://aistudio.google.com/spend) 頁面中，於 **Monthly spend cap** > **Edit spend cap** 下方，為每個專案設定消費上限。

如需在 AI Studio 中查看或編輯消費上限與計費資訊所需的特定 Google Cloud IAM 權限詳情，請參閱 [AI Studio 疑難排解指南](/docs/troubleshoot-ai-studio/#iam-permissions)。

如果你[將專案移至不同的計費帳戶](https://docs.cloud.google.com/billing/docs/how-to/modify-project#change_the_billing_account_for_a_project)，你已為該專案設定的任何消費上限都會保留，但任何已累計的消費都會在新的計費週期重置為 $0。

像[批次模式](/docs/batch-api/)完成作業與代理工作階段這類長時間執行的任務，可能會產生超出你專案消費上限的超額費用。

AI Studio 中的計費資料處理時間可能延遲，最長約 10 分鐘。如果計費資料尚未處理完畢就產生更多費用，你可能會遇到超出專案上限的超額費用。

### 計費帳戶級別消費上限 {#tier-spend-caps}

每個[級別](/docs/billing/#about-billing)都有每月消費金額上限：

| 使用級別 | 消費上限 |
| :--- | :--- |
| **Free** | 不適用 |
| **Tier 1** | $250 |
| **Tier 2** | $2,000 |
| **Tier 3** | $20,000 - $100,000 |

每月的用量上限會在 Gemini API 的[計費帳戶](/docs/billing/#cloud-billing)層級強制執行。雖然預設上限已預先設定，你可以[申請提高上限](https://docs.google.com/forms/d/e/1FAIpQLSdiP6BWJyNNN65lnwnlOr-5Kv0MOFp0jLQyqi_ixVCfddqWBw/viewform)，以因應更高的用量。總消費會彙總所有已啟用 Gemini API 服務的連結專案。當帳戶累計總額達到級別上限時，所有連結至該計費帳戶的專案服務都會暫停，直到下一個計費週期開始（每月 1 日）為止。

#### 評估你的計費帳戶消費 {#evaluate-spend}

如要評估你過去的每月消費，以判斷新的[計費帳戶級別消費上限](/docs/billing/#tier-spend-caps)是否會影響你進行中的專案，請依下列步驟操作：

1. 在 Google Cloud 控制台中，查看你的 [Cloud Billing 帳戶報表](https://console.cloud.google.com/billing/reports)頁面。

   * 如果你有多個計費帳戶，系統提示時，請選擇你想查看費用報表的 Cloud Billing 帳戶。

2. 報表預設為「當月」並依「服務」分組。你會在 **Service** 欄位中看到 **Gemini API**，並在表格的 **Usage cost** 欄位中看到總消費。

3. 如要查看僅限 Gemini API 用量的細部費用，請將 **Group by** 篩選條件設為依 **SKU** 分組，並將 **Services** 篩選條件設為 **Gemini API**。

4. 調整**依用量日期的時間範圍**篩選條件至你想要的範圍，以評估該期間內的歷史消費。


## 處理時間 {#processing-times}

計費訊號與更新並非總是即時發生。

* **點數用量**：用量費用通常會在數分鐘內從你的餘額中扣除。

* **付款確認**：雖然大多數信用卡付款都是即時的，但某些付款方式（例如銀行轉帳）可能需要數天才能結清。服務僅在點數購買正式確認後，才會恢復或升級。

* **級別升級**：付款成功後，或當你符合[升級條件](/docs/billing/#about-billing)時，級別升級通常會在 10 分鐘內反映。

* **總費用明細圖表**：[Billing](https://aistudio.google.com/billing) 頁面與 [Spend](https://aistudio.google.com/spend) 頁面上顯示總費用明細的圖表，最長可能需要 24 小時才會更新。


如要進一步了解潛在的計費延遲，請參閱 Cloud Billing 指南中有關[扣款週期](https://docs.cloud.google.com/billing/docs/how-to/billing-cycle#delayed-billing)與[交易](https://docs.cloud.google.com/billing/docs/how-to/view-history#missing-transactions)延遲的說明。

## 退款 {#refunds}

**Prepay** 計費帳戶不允許退款，但切換帳戶類型時不在此限。

**當 Prepay 帳戶切換至 Postpay 帳戶類型時**（在你符合[條件](/docs/billing/#about-billing)並[手動升級](/docs/billing/#postpay)帳戶後），Prepay 帳戶會被關閉，任何剩餘的預付點數都會自動退回至帳戶中登記的付款方式。

如果你基於升級至 Postpay 以外的任何原因[關閉](https://docs.cloud.google.com/billing/docs/how-to/close-or-reopen-billing-account#close-a-billing-account)你的 Prepay 帳戶，任何剩餘的預付點數都會被沒收。

購買的點數會在 1 年後到期。到期後，點數會被沒收且無法取回。

**Postpay** 帳戶遵循 [Google Cloud 退款政策](https://docs.cloud.google.com/billing/docs/how-to/resolve-issues#request_a_refund)。

## Cloud Billing 帳戶 {#cloud-billing}

Gemini API 使用 [Cloud Billing 帳戶](https://cloud.google.com/billing/docs/concepts)來處理服務計費，你可以[直接在 AI Studio 中設定](/docs/billing/#setup-billing)。你可以使用 AI Studio 來追蹤消費、了解費用並進行付款。


!!! note " "

      注意：新使用者可能會在其新的 Google Cloud Billing 帳戶中獲得 [$300 Welcome credit](https://docs.cloud.google.com/billing/docs/in-product-billing-setup#welcome-credits)。如果你是在 **2026 年 3 月 2 日之後**開立帳戶，你無法使用這些點數來支付 Gemini API 與 AI Studio 的用量，但你可以在 [Google Cloud 控制台](https://console.cloud.google.com/)中，將它們用於[其他 Google Cloud 產品](https://docs.cloud.google.com/free/docs/free-cloud-features)。


級別、速率限制與計費帳戶上限，皆以計費帳戶為單位判定。

### 專案與 API 金鑰 {#projects-api-keys}

所有連結至 Cloud Billing 帳戶的[專案](/docs/api-key/#google-cloud-projects)，都會繼承該計費帳戶的使用級別，以及相關的速率限制與帳戶上限。如果你[將專案從一個計費帳戶變更至另一個計費帳戶](https://docs.cloud.google.com/billing/docs/how-to/modify-project#change_the_billing_account_for_a_project)，其級別，以及隨之而來的速率限制與帳戶上限，都會切換為新計費帳戶的級別。

連結至某個計費帳戶的所有專案，其累計消費（涵蓋所有 Google Cloud 產品）與帳號年齡，都會計入該計費帳戶的[級別資格](/docs/billing/#about-billing)。

你可以[將專案與其計費帳戶解除連結](https://docs.cloud.google.com/billing/docs/how-to/modify-project#disable_billing_for_a_project)，以回到免費級別。

[API 金鑰](/docs/api-key/)是在專案內產生的憑證。它們沒有獨立的計費設定；它們會繼承專案的級別限制與計費狀態。專案內所有金鑰的累計用量，都會計入該專案的消費上限與計費帳戶的總消費。

## 常見問題 {#faq}

以下各節提供常見問題的解答。

### 我會為哪些項目付費？ {#what-am-i-billed-for}

Gemini API 的定價依據如下：

- 輸入 token 數量
- 輸出 token 數量
- 快取 token 數量
- 快取 tokens 儲存時間

定價資訊請參閱[定價頁面](/docs/pricing/)。

### 我在哪裡可以查看我的配額？ {#where-can-i-view-my-quota}

你可以在 [AI Studio](https://aistudio.google.com/usage) 中查看你的配額與系統限制。

### 如何移至更高的速率限制級別，或申請更多配額？ {#how-do-i-request-more-quota}

當你的帳號達到下一個[級別要求](/docs/rate-limits/#usage-tiers)時，系統會自動授予你更多配額。

### 我可以在 EEA（包括 EU）、英國與瑞士免費使用 Gemini API 嗎？ {#is-Gemini-free-in-EEA-UK-CH}

可以，我們在[許多地區](/docs/available-regions/)提供免費級別與付費級別。

### 如果我為 Gemini API 設定計費，我的 Google AI Studio 用量會被收費嗎？ {#is-AI-Studio-free}

AI Studio 的用量維持免費，除非使用者連結付費 API 金鑰以存取付費功能。一旦你在 AI Studio 中將付費 API 金鑰連結為付費專案的一部分，你就會為該金鑰的 AI Studio 用量付費。你可以視需要，透過使用分別連結至各類型的 API 金鑰，在付費級別專案與 Free Tier 專案之間切換。

### 如果我使用 Free Tier，如何升級至更高的級別？ {#how-do-i-upgrade}

如要存取更高的級別，你必須為專案設定計費。在 Google AI Studio 中點選 [**Set up billing**](/docs/billing/#setup-billing)。這會引導你選擇或建立 Cloud Billing 帳戶。如果你必須使用預付計費模式，**Set up billing** 流程會引導你建立連結至 Cloud Billing 帳戶的 Prepay 帳戶。

### 我可以在免費級別中使用 1Mtokens嗎？ {#can-i-use-1m-tokens-for-free}

Gemini API 的免費級別會依所選模型而有所不同。目前，你可以透過以下方式試用 1Mtokens上下文視窗：

- 在 Google AI Studio 中
- 使用特定模型的免費方案
- 使用後付方案

### 我可以在升級至更高（付費）級別後，再回到 Free Tier 嗎？ {#revert-to-free}

如要降級至 Free Tier，你可以對你想降級的每個專案[停用計費](https://docs.cloud.google.com/billing/docs/how-to/modify-project#disable_billing_for_a_project)。部分專案可能需要先完成[專案驗證](/docs/verification/)，才能使用 Free Tier。

### 如何計算我正在使用的 token 數量？ {#count-tokens}

使用 [`countTokens`](/api-reference/tokens/count-tokens/) 方法來計算 token 數量。如要進一步了解 token，請參閱[token 指南](/docs/tokens/)。

### 如果我透過 AI Studio 註冊我的第一個 Cloud Billing 帳戶，我還能獲得 Google Cloud 免費試用嗎？ {#free-trial-through-ais}

當你註冊有史以來第一個 Cloud Billing 帳戶時，你的 [Google Cloud 免費試用](https://docs.cloud.google.com/free/docs/free-cloud-features#free-trial)就會開始，而你會獲得 $300 的 [Welcome credit](https://docs.cloud.google.com/billing/docs/in-product-billing-setup#welcome-credits)。不過，這些點數無法用來支付 AI Studio 的用量。你可以使用 Welcome credit 來支付 Google Cloud 內其他符合資格的服務（請注意，一旦這些點數被消耗完畢或到期（90 天內），任何額外的用量費用都會自動向你已建立的付款方式收費）。

### 我可以將 Google Cloud Welcome credit 用於 Gemini API 嗎？ {#cloud-credits}

不行，Google Cloud 的 [Welcome credit](https://docs.cloud.google.com/billing/docs/in-product-billing-setup#welcome-credits) 或免費試用點數，無法用於 Gemini API 或 AI Studio。

如果你是在 Welcome credit 變得不符合資格之前就獲得該點數，你可以在點數到期前（90 天後），將剩餘點數用於 Gemini API 與 AI Studio。

### Google Cloud 免費試用適用於 Gemini API 用量嗎？ {#cloud-free-trial}

不適用，自 2026 年 3 月起，Gemini API 的用量費用已明確排除在 [$300 Google Cloud 免費試用](https://docs.cloud.google.com/free/docs/free-cloud-features#free-trial) 方案之外。

### Google Cloud 點數如何與 Prepay 搭配運作？ {#cloud-credits-prepay}

Prepay 使用者必須先[購買 Prepaid 點數](/docs/billing/#buy-credits)，任何符合資格的 Google Cloud 點數才能套用至 Gemini API 用量。當你擁有有效的 Prepay 點數餘額後，適用於 Gemini API 的 Google Cloud 點數會在你的 Prepay 點數餘額之前被消耗。當計費帳戶的 Prepay 點數餘額歸零時，Google Cloud 點數將不再被消耗。

並非所有 Google Cloud 點數（例如 [Google Cloud Welcome credit](/docs/billing/#cloud-credits)）都能用於 Gemini API 與 AI Studio。

### 計費如何處理？ {#how-is-billing-handled}

Gemini API 的計費由 [Cloud billing](https://cloud.google.com/billing/docs/concepts) 系統處理。如要了解產品內的 Cloud Billing 設定，請參閱 [Cloud Billing 文件](https://docs.cloud.google.com/billing/docs/in-product-billing-setup)。

### 失敗、遭拒或取消的請求會被收費嗎？ {#am-i-charged-for-failed-requests}

收費方式取決於請求的結束方式。

| 情境 | 輸入 token | 輸出與思考 token |
| :--- | :--- | :--- |
| HTTP 4xx 或 5xx 錯誤（請求仍會計入配額） | 不收費 | 不收費 |
| HTTP 200，但提示詞遭拒（`promptFeedback.blockReason`，無候選內容） | 不收費 | 不收費 |
| HTTP 200，`finishReason: SAFETY` | 收費（快取 token 按快取費率計費） | 不收費（或僅收取先前已串流的片段） |
| HTTP 200，其他非標準 `finishReason`（單次回應或第一個串流片段） | 不收費 | 不收費 |
| HTTP 200，其他非標準 `finishReason`（在先前串流片段之後） | 收費（快取 token 按快取費率計費） | 僅收取先前串流片段的 token |
| 在第一個片段前取消串流 | 不收費 | 不收費 |
| 在一個或多個片段後取消串流 | 可能收費 | 最多收取至最後一個已傳送片段的 token |

除 `STOP`、`MAX_TOKENS`、`CONTINUATION` 或 `SAFETY` 之外的任何 `finishReason`，皆適用上述非標準列。範例包括 `PROHIBITED_CONTENT`、`RECITATION`、`MALFORMED_FUNCTION_CALL`、`MALFORMED_RESPONSE` 與 `OTHER`。

串流停止時，你需為截止前已傳送片段的 `candidatesTokenCount` 與 `thoughtsTokenCount` 付費。最後一個已停止片段中的 token 不收費。當你為輸入 token 付費時，`cachedContentTokenCount` 仍維持快取輸入費率。


!!! note " "

      注意：在 HTTP 200 回應中，即使輸入未收費，API 仍可能填入 `usageMetadata`，包括 `promptTokenCount`。回應中沒有欄位會顯示輸入 token 未收費。


### `GetTokens` 會被計費嗎？ {#is-gettokens-billed}

對 `GetTokens` API 的請求不會被計費，也不會計入推論配額。

### 如果我有付費 API 帳戶，我的 Google AI Studio 資料會如何處理？ {#paid-api-ai-studio}

有關啟用 Cloud 計費時資料的處理方式詳情，請參閱[服務條款](/docs/terms/#paid-services)（請見「Paid Services」下方的「How Google Uses Your Data」）。請注意，只要至少有 1 個 API 專案已啟用計費，你的 Google AI Studio 提示詞就會依相同的「Paid Services」條款處理；你可以在 [Gemini API 金鑰頁面](https://aistudio.google.com/api-keys)上驗證這一點，如果你看到任何專案在「Plan」下方被標示為「Paid」，即表示如此。

### 什麼是 Prepaid 計費，誰必須使用預付計費模式？ {#what-is-prepaid}

Prepaid 計費可讓 AI Studio 中的 Gemini API 使用者預先購買點數。自 2026 年 3 月 23 日起，AI Studio 的新使用者可能會被要求使用 Prepaid 計費方案。在 AI Studio 的 [Set up Billing](/docs/billing/#setup-billing) 流程中，介面會引導你完成計費設定流程，並指出你是否必須預付。

### 如何購買 Prepay 點數，是否有最低或最高金額？ {#purchase-prepay}

你可以在 AI Studio Billing 頁面上[購買點數](/docs/billing/#buy-credits)。在購買過程中，介面會提供你的地區與級別所需的最低預購金額，以及你的帳戶一次可持有的最高金額。

### 我可以將 Prepay 帳戶設定為依需要自動購買更多點數嗎？ {#configure-auto-purchase}

可以，我們建議你在 AI Studio Billing 設定中設定 [auto-reload](/docs/billing/#auto-reload)。你可以指定一個「觸發」點數餘額（例如「當我的餘額低於 $30 時」）與一個「儲值金額」（例如「加入 $100」）。

### 我可以限制自動儲值扣款的金額嗎？ {#limit-auto-reload-charges}

可以，Prepay 使用者可以在 **Auto-Reload** 小工具內設定 [Monthly Auto-Charge Limit](/docs/billing/#monthly-auto-charge-limit)。當某個計費週期內的自動儲值總金額達到此上限時，系統會停用自動儲值，直到下個月為止。手動購買點數不會計入此上限。

### 我可以為未使用的點數申請退款嗎？ {#refund-unused-credits}

所有 Prepaid API 點數都會在 1 年後到期且無法退款。請參閱 [Prepay 帳戶的退款政策](/docs/billing/#refunds)。

### 我的預付點數會到期嗎？ {#prepay-credits-expire}

會，點數會在購買日期後 12 個月到期。

### 當我的預付點數餘額歸零時會發生什麼事？ {#zero-balance}

由該 Cloud Billing Prepay 帳戶付費的所有專案中的所有 Gemini API 服務，都會立即停止，以避免產生更多費用。你的專案不會自動降級至 Free Tier。

如要以你目前的付費級別恢復服務，你必須[購買額外的點數](/docs/billing/#buy-credits)。購買點數後，你應該就能使用 Gemini API。請注意，在我們的系統更新以反映你的點數餘額之前，可能會有[延遲](/docs/billing/#processing-times)。

你也可以選擇對你想降級的專案[停用計費](https://docs.cloud.google.com/billing/docs/how-to/modify-project#disable_billing_for_a_project)，以將其降級至 Free Tier。

### 為什麼我的 Prepay 點數餘額大於 $0，用量卻停止了？ {#usage-stop}

你可能已達到目前級別的[用量上限](/docs/billing/#tier-spend-caps)。當你晉升至更高的級別時，用量上限會自動提高。你的 Gemini API AI Studio 用量也可能因你的 [Cloud Billing 帳戶狀態](/docs/billing/#missed-payment)而受到影響。

### 為什麼我的 Prepay 帳戶點數餘額是負數？ {#negative-balance}

由於我們的計費與處理系統相當複雜，在你消耗完所有點數後，我們停止用量的能力可能會有[延遲](/docs/billing/#processing-times)。這筆超額用量可能會在你的 AI Studio 計費資訊主頁中顯示為負數的點數餘額。如果發生這種情況，你的服務會被暫停，而你的負數餘額會從你下次購買的點數中扣除。

為避免 Gemini API 服務暫停，我們建議你設定 [auto-reload](/docs/billing/#auto-reload)，在你的點數餘額低於你指定的數值時，自動購買更多點數。

### 我可以將 Prepay 點數用於其他 Google Cloud 服務嗎，例如 Gemini Enterprise Agent Platform？ {#other-prepay}

不行，Prepay 點數嚴格限定用於 Gemini API 用量。你使用的任何其他 Google Cloud 服務（Compute、Storage、Gemini Enterprise Agent Platform），都會使用標準的 [Cloud 扣款週期](https://docs.cloud.google.com/billing/docs/how-to/billing-cycle)計費。

### 我可以從 Prepay 計費切換至 Postpay 計費嗎？ {#switch-to-postpaid}

不行，不支援從 Prepay 計費方案切換至 Postpay 計費方案。

### 我可以從 Postpay 計費切換至 Prepay 計費嗎？ {#switch-to-prepay}

可以，你可以在 [AI Studio Billing](https://aistudio.google.com/billing) 頁面上轉換既有的 Postpay 帳戶。操作說明請參閱[遷移至 Prepay](/docs/billing/#migrate-to-prepay)。

### 如果我切換至 Postpay，我的 Prepaid 點數會如何處理？ {#credits-in-postpaid}

當你升級至 [Postpay](/docs/billing/#postpay) 時，Cloud Billing 會關閉你的 Prepay 付款帳戶、關閉 [auto-reload](/docs/billing/#auto-reload)，並自動將任何未使用的 Prepay 點數退還給你（仍須視標準退款處理時間而定）。

### 我在哪裡可以查看目前的 Prepay 點數餘額與交易紀錄？ {#balance-history}

Gemini API 的所有餘額管理與交易紀錄，都必須直接在 Google AI Studio Billing 分頁中進行。

### 為什麼我會看到「The billing account type is inactive or unsupported」？ {#eligible-accounts}

如果你的所選計費帳戶類型或計費帳戶狀態不符合 AI Studio 付費級別的資格，[AI Studio Billing 頁面](https://aistudio.google.com/billing)上的付款互動可能會被封鎖，並改為顯示訊息「The billing account type is inactive or unsupported」。

請查看 [Cloud Console](https://console.cloud.google.com/billing/) 以了解你的計費帳戶狀態。一種不符合資格的類型可能是 *Free trial account*，在這種情況下，你可以在 AI Studio 中[啟用計費](/docs/billing/#setup-billing)以取得資格。一種非有效狀態可能是 *Closed*，在這種情況下，你可以[重新開啟帳戶](https://docs.cloud.google.com/billing/docs/how-to/close-or-reopen-billing-account)。

### 我的 Gemini API 用量費用會顯示在 Google Cloud 控制台中嗎？ {#cloud-console}

會，Gemini API 費用，以及由你的 Cloud Billing 帳戶付費的任何其他 Google Cloud 服務相關費用，都可以在 [Cloud Billing 控制台](https://console.cloud.google.com/billing) 的[費用管理頁面](https://docs.cloud.google.com/billing/docs/how-to/split-charging-cycle#cost-reports)中查看。請注意，你只能在 AI Studio 中管理你的 Prepay 點數餘額。

### 為什麼我的 Gemini API 用量沒有顯示在 Cloud Billing 控制台中，但我可以在 AI Studio Billing 中看到它以及點數的消耗情況？ {#delayed-billing}

Google Cloud 與 AI Studio 會以不同的間隔向 Cloud Billing 回報用量資料。由於我們的計費與處理系統相當複雜，你可能會在服務使用與用量及費用可在 Cloud Billing 中查看之間，遇到延遲。通常，你的費用詳情會在一天內提供，但有時可能需要超過 24 小時。如要進一步了解延遲計費，請參閱 [Cloud Billing 文件](https://docs.cloud.google.com/billing/docs/how-to/billing-cycle#delayed-billing)。

### 如果我使用其他採用 Postpay 扣款週期的 Google Cloud 服務，但我漏繳付款，會發生什麼事？ {#missed-payment}

漏繳其他 Google Cloud 服務的款項，可能會暫停你在 AI Studio 中的 Gemini API 存取權，**無論你有多少可用的 Prepaid 點數**。AI Studio 的用量由 Google Cloud Billing 帳戶提供支援，該帳戶可以同時共用 AI Studio 的 Prepay 計費與其他 Cloud 服務的 Postpay 計費。你的 Postpay 餘額出現問題，會導致連結至該帳戶的所有服務停止。如果你的 Cloud Billing 帳戶因下列問題被標記，你的 Gemini API 用量將被暫停：

* 欠款或逾期餘額
* 付款被拒
* 付款方式無效或已到期

如要恢復服務，你必須在 Google Cloud Billing 控制台中[解決 Postpay 帳戶問題](https://docs.cloud.google.com/billing/docs/how-to/resolve-issues#resolving-declined-payments)。解決問題後，你將重新取得 Prepaid Gemini API 點數與服務的存取權。

### 為什麼我在取消 Prepay 設定後，我的專案會中斷？ {#prepay-issue}

**問題**：你已開始將 Prepay 功能加入既有 Postpay 計費帳戶的流程，但在完成預付設定前關閉視窗或取消流程。連結至該計費帳戶的其他專案失去了 Gemini API 的存取權。

**原因**：在轉換流程中，支援 Prepay 的基礎架構會在你接受確認對話框後，立即在你的計費帳戶上建立。如果你未完成預付步驟，設定會停留在無法收費的狀態。由於此狀態適用於計費帳戶層級，它會限制所有連結至該計費帳戶且依賴 Prepay 服務的專案的存取權。

**解決方法**：由於帳戶狀態已變更，如果你放棄付款流程，將沒有自動方式可還原狀態。如要為你連結的專案恢復服務，請執行下列其中一項：

* **完成設定**：返回 Google AI Studio，重新啟動計費設定流程，並完成預付流程。付款處理完畢後，Prepay 計費方案即會啟用，服務也會恢復。
* **聯絡支援**：如果你不想使用 Prepay 計費方案，並想將計費帳戶還原回 Postpay，請[聯絡 Cloud Billing 支援](https://cloud.google.com/support/billing)，以手動重設你的帳戶狀態。

### 我可以在哪裡取得計費方面的協助？ {#get-help}

如要取得計費方面的協助，請參閱[取得 Cloud 計費支援](https://cloud.google.com/support/billing)。
