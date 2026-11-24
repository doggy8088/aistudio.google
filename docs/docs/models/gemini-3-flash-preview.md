# Gemini 3 Flash 預覽版

全球多模態理解最強的模型，也是我們至今最強大的代理與 vibe-coding 模型，能呈現更豐富的視覺效果與更深度的互動性，一切都建立在頂尖推理能力的基礎之上。

[在 Google AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-3-flash-preview)

## 文件 {#documentation}

請造訪 [Gemini 3 開發人員指南](/docs/latest-model/) 頁面，查看功能與能力的完整說明。

## gemini-3-flash-preview {#gemini-3-flash-preview}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-3-flash-preview` |
| 支援的資料類型 | **輸入**文字、圖片、影片、音訊和 PDF **輸出**文字 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 1,048,576 **輸出 token 上限** 65,536 |
| 功能 | [**音訊生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 支援 [**電腦操作**](/docs/computer-use/) 支援 [**上下文快取**](/docs/caching/) 支援 [**File search**](/docs/file-search/) 支援 [**函式呼叫**](/docs/function-calling/) 支援 [**使用 Google 地圖接地**](/docs/maps-grounding/) 支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 支援 [**思考**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 支援 |
| 使用方式 | [**Batch API**](/docs/batch-api/) 支援 [**Flex inference**](/docs/flex-inference/) 支援 [**Priority inference**](/docs/priority-inference/) 支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | `Preview: gemini-3-flash-preview` |
| 最近更新 | 2025 年 12 月 |
| 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-3-flash/) |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-3-flash-preview/#pricing)。 |


## 定價 {#pricing}


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.50（文字 / 圖片 / 影片） $1.00（音訊） |
    | 輸出價格（含思考 token） | 免費 | $3.00 |
    | 上下文快取價格 | 免費 | $0.05（文字 / 圖片 / 影片） $0.10（音訊） $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "批次"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $0.25（文字 / 圖片 / 影片） $0.50（音訊） |
    | 輸出價格（含思考 token） | 不提供 | $1.50 |
    | 上下文快取價格 | 不提供 | *與 Standard 相同* $0.05（文字 / 圖片 / 影片） $0.10（音訊） $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "彈性"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $0.25（文字 / 圖片 / 影片） $0.50（音訊） |
    | 輸出價格（含思考 token） | 不提供 | $1.50 |
    | 上下文快取價格 | 不提供 | *與 Standard 相同* $0.05（文字 / 圖片 / 影片） $0.10（音訊） $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "優先"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.90（文字 / 圖片 / 影片） $1.80（音訊） |
    | 輸出價格（含思考 token） | 免費 | $5.40 |
    | 上下文快取價格 | 免費 | $0.09（文字 / 圖片 / 影片） $0.18（音訊） $1.80 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


* 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

\*\* 可在 Google AI Studio 中測試。
