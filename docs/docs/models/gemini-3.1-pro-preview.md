# Gemini 3.1 Pro preview

Gemini 3.1 Pro Preview 旨在提升 Gemini 3 Pro 系列的效能與可靠性，提供更佳的思考能力、更高的 token 效率，以及更扎實、事實一致性更高的體驗。它針對軟體工程行為與易用性最佳化，也適用於需要精確使用工具、並能在真實世界各領域可靠執行多步驟任務的代理工作流程。

[在 Google AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-3.1-pro-preview)

## 文件 {#documentation}

請參閱 [Gemini 3 開發者指南](/docs/latest-model/) 頁面，瞭解功能與能力的完整說明。

## gemini-3.1-pro-preview {#gemini-31-pro-preview}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-3.1-pro-preview` |
| 支援的資料類型 | **輸入** 文字、圖片、影片、音訊與 PDF **輸出** 文字 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 1,048,576 **輸出 token 上限** 65,536 |
| 功能 | [**語音生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 支援 [**上下文快取**](/docs/caching/) 支援 [**檔案搜尋**](/docs/file-search/) 支援 [**函式呼叫**](/docs/function-calling/) 支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 支援 [**思考**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 支援 |
| 使用選項 | [**Batch API**](/docs/batch-api/) 支援 [**Flex 推論**](/docs/flex-inference/) 支援 [**優先推論**](/docs/priority-inference/) 支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 預覽版：`gemini-3.1-pro-preview` | 預覽版：[`gemini-3.1-pro-preview-customtools`](/docs/models/gemini-3.1-pro-preview/#gemini-31-pro-preview-customtools) |
| 最近更新 | 2026 年 2 月 |
| 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-3-1-pro/) |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-3.1-pro-preview/#pricing)。 |


### gemini-3.1-pro-preview-customtools {#gemini-31-pro-preview-customtools}

對於混合使用 bash 與自訂工具進行開發的使用者，Gemini 3.1 Pro
Preview 透過 API 提供另一個端點，稱為
`gemini-3.1-pro-preview-customtools`。這個端點更擅長優先處理你的自訂工具（例如 `view_file` 或 `search_code`）。

請注意，雖然 `gemini-3.1-pro-preview-customtools` 針對使用自訂工具與 bash 的代理工作流程最佳化，但在某些無法受惠於這類工具的使用情境中，你可能會看到品質波動。

## 定價 {#pricing}


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $2.00, 提示詞 <= 200k token $4.00, 提示詞 > 200k token |
    | 輸出價格（含思考 token） | 不提供 | $12.00, 提示詞 <= 200k token $18.00, 提示詞 > 200k |
    | 上下文快取價格 | 不提供 | $0.20, 提示詞 <= 200k token $0.40, 提示詞 > 200k $4.50 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | 不提供 | [否](/docs/terms/) |


      * 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

      \*\* 可在 Google AI Studio 中測試。

=== "批次"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $1.00, 提示詞 <= 200k token $2.00, 提示詞 > 200k token |
    | 輸出價格（含思考 token） | 不提供 | $6.00, 提示詞 <= 200k token $9.00, 提示詞 > 200k |
    | 上下文快取價格 | 不提供 | *與 Standard 相同* $0.20, 提示詞 <= 200k token $0.40, 提示詞 > 200k $4.50 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | 不提供 | [否](/docs/terms/) |


      * 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

      \*\* 可在 Google AI Studio 中測試。

=== "彈性"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $1.00, 提示詞 <= 200k token $2.00, 提示詞 > 200k token |
    | 輸出價格（含思考 token） | 不提供 | $6.00, 提示詞 <= 200k token $9.00, 提示詞 > 200k |
    | 上下文快取價格 | 不提供 | *與 Standard 相同* $0.20, 提示詞 <= 200k token $0.40, 提示詞 > 200k $4.50 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | 不提供 | [否](/docs/terms/) |


      * 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

      \*\* 可在 Google AI Studio 中測試。

=== "優先"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $3.60, 提示詞 <= 200k token $7.20, 提示詞 > 200k token |
    | 輸出價格（含思考 token） | 不提供 | $21.60, 提示詞 <= 200k token $32.40, 提示詞 > 200k |
    | 上下文快取價格 | 不提供 | $0.36, 提示詞 <= 200k token $0.72, 提示詞 > 200k $8.10 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | 不提供 | [否](/docs/terms/) |


      * 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

      \*\* 可在 Google AI Studio 中測試。
