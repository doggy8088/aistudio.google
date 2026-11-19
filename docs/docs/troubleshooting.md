# 疑難排解指南

本指南協助你診斷並解決呼叫 Gemini API 時常見的問題。你遇到的問題可能來自 Gemini API 後端服務，或來自用戶端 SDK。我們的用戶端 SDK 已在下列存放區開源：

* [python-genai](https://github.com/googleapis/python-genai)
* [js-genai](https://github.com/googleapis/js-genai)
* [go-genai](https://github.com/googleapis/go-genai)

如果你遇到 API 金鑰問題，請確認你已依照 [API 金鑰設定指南](/docs/api-key/)正確設定 API 金鑰。

## 錯誤代碼 {#error-codes}

如需所有錯誤代碼的完整參考文件，包括 HTTP 狀態碼、生成封鎖代碼及內容錯誤代碼，請參閱 [API 錯誤](/docs/api-errors/)頁面。

## 重試策略 {#retry-strategy}

如果你收到表示應重試要求的錯誤（例如 `429 RESOURCE_EXHAUSTED` 或 `503 UNAVAILABLE`），建議採用指數退避策略。也就是在第一次重試前先短暫等待，然後逐漸增加後續重試之間的等待時間。

Gemini API 的官方用戶端 SDK（例如 [Python SDK](https://github.com/googleapis/python-genai)），預設包含具備指數退避的自動重試邏輯，可處理逾時、網路問題及速率限制（`429` 與 `5xx` 狀態碼）等暫時性錯誤。例如，Python SDK 會自動重試暫時性錯誤最多四次，初始延遲約為 1 秒，最大延遲為 60 秒。

如果你直接發出 REST API 要求，或自訂重試邏輯，請遵循下列最佳做法，以提高要求成功的機率，並避免讓服務不堪負荷：

* **Use exponential backoff**：在第一次重試前短暫等待（例如 1 秒），然後以指數方式增加延遲（例如 2 秒、4 秒、8 秒）。
* **Add jitter**：在延遲中加入隨機的「抖動」，避免所有用戶端在完全相同的時間重試。
* **Retry on specific errors**：僅針對暫時性錯誤重試（例如 `429`、`408` 或 `5xx`）。不要針對用戶端錯誤重試（例如 `400`、`402` 或 `403`），因為這類錯誤表示 API 金鑰無效、預付額度耗盡或語法錯誤等問題。
* **Set maximum retries**：定義重試次數上限，避免無限迴圈。

## 檢查 API 呼叫是否有模型參數錯誤 {#check-api}

請確認你的模型參數位於下列數值範圍內：

| **Model parameter** | **Values (range)** |
| :--- | :--- |
| 候選數量 | 1-8（整數，Gemini 3 與 4 不支援） |
| Temperature | 0.0-1.0（Gemini 3.6+ 與 4 會忽略；在舊版 Gemini 3 模型上保持預設值） |
| 輸出 token 數量上限 | 使用[模型頁面](/docs/models/)確認你所用模型的 token 數量上限。 |
| TopP | 0.0-1.0（Gemini 3.6+ 與 4 會忽略；在舊版 Gemini 3 模型上保持預設值） |

除了檢查參數值之外，也請確認你使用的是正確的 [API 版本](/api-reference/api-versions/)（例如 `/v1` 或 `/v1beta`），以及支援所需功能的模型。例如，如果某項功能處於 Beta 版，則僅能在 `/v1beta` API 版本中使用。

## 檢查你是否使用正確的模型 {#check-if}

請確認你使用的是[模型頁面](/docs/models/)所列的支援模型。

## 思考模型的延遲或 token 用量較高 {#high-latency-or-token-usage}

延遲或 token 用量較高，通常是因為 Gemini 3.x 模型預設啟用思考功能。已淘汰的 Gemini 2.5 模型也使用預設思考。

思考模型會生成內部推理 token 以提升品質。這個推理過程會同時增加回應延遲與 token 總消耗量。

如果你更重視低延遲，或需要盡量降低成本，可以調低思考層級或關閉思考。

如需設定詳情與程式碼範例，請參閱[思考指南](/docs/thinking/#thinking-levels)。

## 安全問題 {#safety-issues}

如果你的 API 呼叫中，提示詞因安全設定而遭到封鎖，請依據你在 API 呼叫中設定的篩選條件，重新檢視該提示詞。

如果你看到 `BlockedReason.OTHER`，表示查詢或回應可能違反[服務條款](/docs/terms/)，或屬於其他不支援的情況。

## 引用問題 {#recitation-issue}

如果你看到模型因 RECITATION 原因停止生成輸出，表示模型輸出可能與某些資料相似。若要修正這個問題，請盡量讓提示詞／上下文保持獨特。對於支援取樣參數的舊版模型，你也可以使用較高的溫度。


!!! note " "

      `temperature`、`top_p` 與 `top_k` 參數控制舊版模型生成回應的方式。Gemini 4 與 Gemini 3.6+ 模型會忽略 `temperature`、`top_p` 與 `top_k` 的自訂值，並傳回淘汰警告標頭（且在未來版本中將傳回 `400` 錯誤）。請從你的要求設定中移除 `temperature`、`top_p` 與 `top_k`。對於舊版 Gemini 3 模型，請將這些參數保持為預設值，以避免推理效能下降。


## 重複 token 問題 {#repetitive-tokens}

如果你看到輸出 tokens 重複出現，請嘗試下列建議，以協助減少或消除此現象。溫度調整僅適用於支援取樣參數的舊版模型；對於 Gemini 3 與 Gemini 4 模型，請改用提示詞與系統指令的因應方式。

| 描述 | 原因 | 建議因應方式 |
| :--- | :--- | :--- |
| Markdown 表格中連字號重複 | 當表格內容較長，模型試圖建立視覺上對齊的 Markdown 表格時，可能發生此情況。不過，Markdown 中的對齊並非正確算繪的必要條件。 | 在提示詞中加入指示，為模型提供生成 Markdown 表格的具體準則。提供遵循這些準則的範例。對於支援取樣參數的舊版模型，你也可以嘗試調整溫度（>= 0.8）。以下是你可以加入提示詞以避免此問題的一組範例準則： # Markdown Table Format * Separator line: Markdown tables must include a separator line below the header row. The separator line must use only 3 hyphens per column, for example: \|---\|---\|---\|. Using more hypens like ----, -----, ------ can result in errors. Always use \|:---\|, \|---:\|, or \|---\| in these separator strings. For example: \| Date \| Description \| Attendees \| \|---\|---\|---\| \| 2024-10-26 \| Annual Conference \| 500 \| \| 2025-01-15 \| Q1 Planning Session \| 25 \| * Alignment: Do not align columns. Always use \|---\|. For three columns, use \|---\|---\|---\| as the separator line. For four columns use \|---\|---\|---\|---\| and so on. * Conciseness: Keep cell content brief and to the point. * Never pad column headers or other cells with lots of spaces to match with width of other content. Only a single space on each side is needed. For example, always do "\| column name \|" instead of "\| column name \|". Extra spaces are wasteful. A markdown renderer will automatically take care displaying the content in a visually appealing form. |
| Markdown 表格中 token 重複 | 與連字號重複類似，當模型試圖在視覺上對齊表格內容時會發生此情況。Markdown 中的對齊並非正確算繪的必要條件。 | 嘗試在系統提示詞中加入如下指示： FOR TABLE HEADINGS, IMMEDIATELY ADD ' \|' AFTER THE TABLE HEADING. 對於支援取樣參數的舊版模型，請嘗試較高的溫度（>= 0.8），以減少輸出中的重複。 |
| 結構化輸出中換行字元（`\n`）重複 | 當模型輸入包含 Unicode 或逸出序列（例如 `\u` 或 `\t`）時，可能導致換行重複。 | 檢查提示詞中禁止的逸出序列，並將其替換為 UTF-8 字元。例如，JSON 範例中的 `\u` 逸出序列可能導致模型在輸出中也使用這些序列。請指示模型允許的逸出方式。加入如下系統指令： In quoted strings, the only allowed escape sequences are \\, \n, and \". Instead of \u escapes, use UTF-8. |
| 使用結構化輸出時文字重複 | 當模型輸出的欄位順序與已定義的結構化結構定義不同時，可能導致文字重複。 | 不要在提示詞中指定欄位順序。將所有輸出欄位設為必填。 |
| 工具呼叫重複 | 如果模型遺失先前思考的上下文，和／或被迫呼叫無法使用的端點，就可能發生此情況。 | 指示模型在思考過程中維持狀態。在系統指令末尾加入： When thinking silently: ALWAYS start the thought with a brief (one sentence) recap of the current progress on the task. In particular, consider whether the task is already done. |
| 非結構化輸出部分的文字重複 | 如果模型卡在無法解決的要求上，就可能發生此情況。 | 如果已開啟思考，請避免在指令中明確要求如何思考問題。僅要求最終輸出即可。對於支援取樣參數的舊版模型，請嘗試較高的溫度 >= 0.8。加入如下指示："Be concise"、"Don't repeat yourself" 或 "Provide the answer once"。 |

## 專案受限或無法使用 {#project-unavailable}

你的 API 要求可能會傳回 `403 PERMISSION_DENIED`（「Your project has been denied access」）。你在 [Google AI Studio](https://aistudio.google.com/) 中的專案狀態也可能顯示 **Verification needed**、**Restricted**、**Free tier unavailable**、**Payment needed** 或 **Unavailable**。下列各節說明如何排解每種類型。請參閱適用於你專案的章節：

### 需要專案或帳戶驗證 {#verification-required}

如果你的專案顯示 **Verification needed**，或傳回 `403 PERMISSION_DENIED` 且帶有 `FREE_TIER_VERIFICATION_REQUIRED`，或者 Google AI Studio 因異常活動要求你驗證帳戶，請執行下列其中一項：

*   依照[專案與帳戶驗證](/docs/verification/)，在 Google AI Studio 中使用行動裝置進行驗證。
*   [設定計費](/docs/billing/#setup-billing)，以使用付費層級，無需驗證裝置。

### Gemini API 免費層級無法使用 {#free-tier-unavailable}

並非所有 Google Cloud 專案或帳戶都有資格使用 Gemini API 免費層級。如果你的專案被限制無法使用免費層級：

*   **Creating a new API key in the same project won't resolve the error.** Google 會在 Google Cloud 專案層級評估資格。
*   **To use the Gemini API with this project, you must upgrade to the paid tier**，方法是連結有效的 [Cloud Billing account](https://aistudio.google.com/billing)。
*   注意：將專案升級至付費層級並不會解鎖免費層級配額。Google 會依照 [Gemini API 定價](/docs/pricing/)收取付費層級用量費用，或從符合資格的 Google Cloud 抵免額中扣除。

### Cloud Billing 帳戶需要付款 {#payment-needed}

如果你的專案已連結 Cloud Billing 帳戶，且顯示 **Payment needed**（或傳回提及未結清餘額的 `403 PERMISSION_DENIED`）：

*   請造訪 [AI Studio Billing page](https://aistudio.google.com/billing) 或 [Google Cloud Billing Console](https://console.cloud.google.com/billing)，以解決任何逾期餘額或更新付款方式。
*   計費帳戶恢復正常狀態後，你的專案將自動重新取得 API 存取權。

### API 金鑰外洩或遭封鎖 {#api-key-leaked-or-blocked}

如果 `403 PERMISSION_DENIED` 錯誤表示你的 API 金鑰被回報為外洩或遭封鎖：

*   前往 [AI Studio API Keys page](https://aistudio.google.com/apikeys) 生成新的 API 金鑰，並更新你的應用程式憑證。
*   切勿將 API 金鑰直接嵌入用戶端程式碼或公開存放區。

### 專案或計費帳戶因政策遭停權 {#policy-suspension}

如果 Google 因違反政策而停用你的 Google Cloud 專案或 Cloud Billing 帳戶，請查看相關聯的電子郵件地址。請造訪 [Google Cloud Console](https://console.cloud.google.com/) 查看任何停權通知，並遵循[專案停權指南](https://cloud.google.com/resource-manager/docs/project-suspension-guidelines)。


!!! note " "

      唯讀的中繼資料端點，例如 `models.list`（`GET /v1beta/models`），僅驗證你的 API 金鑰是否存在，不會檢查專案層級資格或計費狀態。`200 OK` 回應若來自 `models.list`，並不保證你的專案已啟用推論呼叫（`generateContent`、`streamGenerateContent` 或 `interactions`）。


## API 金鑰遭封鎖或無法運作 {#api-keys-not-working}

本節說明如何檢查你的 Gemini API 金鑰是否遭到封鎖，以及該如何處理。

### 瞭解金鑰遭封鎖的原因

我們發現一個漏洞，部分 API 金鑰可能已被公開曝光。為了保護你的資料並防止未經授權的存取，我們已主動封鎖這些已知外洩的金鑰，使其無法存取 Gemini API。

### 確認你的金鑰是否受影響

如果你的金鑰已知外洩，你將無法再使用該金鑰搭配 Gemini API。你可以使用 [Google AI Studio](/docs/api-key/) 查看你的 API 金鑰中是否有任何一把遭到封鎖、無法呼叫 Gemini API，並生成新的金鑰。當你嘗試使用這些金鑰時，也可能會看到傳回下列錯誤：

```none
Your API key was reported as leaked. Please use another API key.
```

### 封鎖 API 金鑰的處理方式

你應使用 [Google AI Studio](/docs/api-key/) 為 Gemini API 整合生成新的 API 金鑰。我們強烈建議你檢視 API 金鑰管理做法，確保新金鑰獲得妥善保護，且不會公開曝光。

### 因漏洞導致的意外費用

[提交計費支援案件](https://console.cloud.google.com/support/chat)。我們的計費團隊正在處理此事，我們會盡快傳達最新進展。

### Google 針對外洩金鑰的安全措施

**如果我的 API 金鑰外洩，Google 會如何協助保護我的帳戶，避免費用超支與濫用？**

- 我們正朝向以下方向邁進：當你使用 [Google AI Studio](/docs/api-key/) 要求新金鑰時，核發的 API 金鑰預設僅限於 Google AI Studio，且不接受來自其他服務的金鑰。這將有助於防止任何非預期的跨金鑰使用。
- 我們預設封鎖已外洩且與 Gemini API 一同使用的 API 金鑰，有助於防止費用濫用及應用程式資料遭濫用。
- 你將能在 [Google AI Studio](/docs/api-key/) 中查看 API 金鑰的狀態，當我們發現你的 API 金鑰外洩時，我們會主動通知你，以便立即採取行動。

## 提升模型輸出 {#improve-model}

如需更高品質的模型輸出，請探索撰寫更具結構的提示詞。[提示詞工程指南](/docs/prompting-strategies/)頁面介紹了一些基本概念、策略與最佳做法，協助你入門。

## 瞭解 token 上限 {#understand-token}

請閱讀我們的[token 指南](/docs/tokens/)，以更深入瞭解如何計算 token 及其上限。

## 已知問題 {#known-issues}

* API 僅支援少數特定語言。以不支援的語言提交提示詞，可能產生非預期或甚至遭到封鎖的回應。請參閱[模型詳細頁面](/docs/models/)以取得最新資訊。

## 回報錯誤 {#file-bug}

如果你有任何問題，歡迎加入 [Google AI 開發人員論壇](https://discuss.ai.google.dev)的討論。
