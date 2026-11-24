# Gemini 3.5 Flash-Lite

Gemini 3.5 Flash-Lite 是一款低延遲、具成本效益的多模態模型，針對子代理任務與文件解析的高輸送量、低成本執行最佳化。此模型支援文字、圖片、影片、音訊與 PDF 輸入，專為大量代理工作流程、簡單的資料擷取，以及以延遲與 API 成本為主要考量的應用程式而設計。

[在 Google AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-3.5-flash-lite)

## 文件 {#documentation}

請參閱
[Gemini 3.6 Flash 與 3.5 Flash-Lite 的新功能](/docs/whats-new-gemini-3.6/)
頁面，瞭解功能與能力的完整說明。

## gemini-3.5-flash-lite {#gemini-35-flash-lite}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-3.5-flash-lite` |
| 支援的資料類型 | **輸入** 文字、圖片、影片、音訊與 PDF **輸出** 文字 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 1,048,576 **輸出 token 上限** 65,536 |
| 功能 | [**語音生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 支援 [**電腦操作**](/docs/computer-use/) 支援 [**上下文快取**](/docs/caching/) 支援 [**檔案搜尋**](/docs/file-search/) 支援 [**函式呼叫**](/docs/function-calling/) 支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 支援 [**思考**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 支援 |
| 使用選項 | [**Batch API**](/docs/batch-api/) 支援 [**Flex 推論**](/docs/flex-inference/) 支援 [**優先推論**](/docs/priority-inference/) 支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 穩定版：`gemini-3.5-flash-lite` |
| 最近更新 | 2026 年 7 月 |
| 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-3-5-flash-lite/) |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-3.5-flash-lite/#pricing)。 |


## 定價 {#pricing}


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.30（文字 / 圖片 / 影片 / 音訊） |
    | 輸出價格（含思考 token） | 免費 | $2.50 |
    | 上下文快取價格 | 不提供 | $0.03 $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


      * 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

      \*\* 可在 Google AI Studio 中測試。

=== "批次"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.15（文字 / 圖片 / 影片 / 音訊） |
    | 輸出價格（含思考 token） | 免費 | $1.25 |
    | 上下文快取價格 | 不提供 | $0.015 $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


      * 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

      \*\* 可在 Google AI Studio 中測試。

=== "彈性"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $0.15（文字 / 圖片 / 影片 / 音訊） |
    | 輸出價格（含思考 token） | 不提供 | $1.25 |
    | 上下文快取價格 | 不提供 | $0.02 $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


      * 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

      \*\* 可在 Google AI Studio 中測試。

=== "優先"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.54（文字 / 圖片 / 影片 / 音訊） |
    | 輸出價格（含思考 token） | 免費 | $4.50 |
    | 上下文快取價格 | 不提供 | $0.05 $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


      * 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

      \*\* 可在 Google AI Studio 中測試。
