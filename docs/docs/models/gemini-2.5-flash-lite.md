# Gemini 2.5 Flash-Lite


!!! note " "

      為確保所有人都能獲得可靠的效能，我們將 2.5 系列模型的存取權限，限於過去曾實際使用過的使用者。`gemini-2.5-flash-lite` 並未淘汰，在另行通知前仍會透過 API 持續提供服務。新專案請使用我們的最新模型：3.5 Flash-Lite 或 3.8 Flash。如此有助於我們為持續運作的舊有工作流程與新應用維持充足容量。


我們最具成本效益的多模態模型，為高頻率、輕量任務提供最快的效能。Gemini 2.5 Flash-Lite 最適合大量分類、簡單的資料擷取，以及以預算和速度為首要考量的極低延遲應用。

[在 Google AI Studio 中試用](https://aistudio.google.com?model=gemini-2.5-flash-lite)

## gemini-2.5-flash-lite {#gemini-25-flash-lite}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-2.5-flash-lite` |
| 支援的資料類型 | **輸入**文字、圖片、影片、音訊、PDF **輸出**文字 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 1,048,576 **輸出 token 上限** 65,536 |
| 功能 | [**音訊生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 支援 [**上下文快取**](/docs/caching/) 支援 [**File search**](/docs/file-search/) 支援 [**函式呼叫**](/docs/function-calling/) 支援 [**使用 Google 地圖接地**](/docs/maps-grounding/) 支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 支援 [**思考**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 支援 |
| 使用方式 | [**Batch API**](/docs/batch-api/) 支援 [**Flex inference**](/docs/flex-inference/) 支援 [**Priority inference**](/docs/priority-inference/) 支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 穩定版：`gemini-2.5-flash-lite` | 已關閉：[gemini-2.5-flash-lite-preview-09-2025](/docs/models/gemini-2.5-flash-lite-preview-09-2025/) |
| 最近更新 | 2025 年 7 月 |
| 知識截止日期 | 2025 年 1 月 |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-2.5-flash-lite/#pricing)。 |


## 定價 {#pricing}


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格（文字、圖片、影片） | 免費 | $0.10（文字 / 圖片 / 影片） $0.30（音訊） |
    | 輸出價格（含思考 token） | 免費 | $0.40 |
    | 上下文快取價格 | 不提供 | $0.01（文字 / 圖片 / 影片） $0.03（音訊） $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地 | 免費，最多 500 RPD（與 Flash 共用 RPD 上限） | 1,500 RPD（免費，與 Flash 共用 RPD 上限），其後每 1,000 次接地提示詞 $35 |
    | 使用 Google 地圖接地 | 500 RPD | 1,500 RPD（免費），其後每 1,000 次接地提示詞 $25 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "批次"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格（文字、圖片、影片） | 不提供 | $0.05（文字 / 圖片 / 影片） $0.15（音訊） |
    | 輸出價格（含思考 token） | 不提供 | $0.20 |
    | 上下文快取價格 | 不提供 | $0.01（文字 / 圖片 / 影片） $0.03（音訊） $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地 | 不提供 | 1,500 RPD（免費，與 Flash 共用 RPD 上限），其後每 1,000 次接地提示詞 $35 |
    | 使用 Google 地圖接地 | 不提供 | 不提供 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "彈性"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格（文字、圖片、影片） | 不提供 | $0.05（文字 / 圖片 / 影片） $0.15（音訊） |
    | 輸出價格（含思考 token） | 不提供 | $0.20 |
    | 上下文快取價格 | 不提供 | $0.01（文字 / 圖片 / 影片） $0.03（音訊） $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地 | 不提供 | 1,500 RPD（免費，與 Flash 共用 RPD 上限），其後每 1,000 次接地提示詞 $35 |
    | 使用 Google 地圖接地 | 不提供 | 不提供 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "優先"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格（文字、圖片、影片） | 免費 | $0.18（文字 / 圖片 / 影片） $0.54（音訊） |
    | 輸出價格（含思考 token） | 免費 | $0.72 |
    | 上下文快取價格 | 不提供 | $0.018（文字 / 圖片 / 影片） $0.054（音訊） $1.80 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地 | 免費，最多 500 RPD（與 Flash 共用 RPD 上限） | 1,500 RPD（免費，與 Flash 共用 RPD 上限），其後每 1,000 次接地提示詞 $35 |
    | 使用 Google 地圖接地 | 500 RPD | 1,500 RPD（免費），其後每 1,000 次接地提示詞 $25 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |
