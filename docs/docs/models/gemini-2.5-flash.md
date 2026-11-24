# Gemini 2.5 Flash


!!! note " "

      Gemini 2.5 Flash（`gemini-2.5-flash`）已
      [淘汰](/docs/deprecations/#gemini-2.5-flash-models)，無法再於 Google AI Studio 中選取
      （API 存取僅限既有使用者，至 2026 年 12 月 1 日止）。自 2026 年 12 月 1 日起，所有對
      `gemini-2.5-flash` 的 API 要求都會自動轉向
      [Gemini 3.5 Flash-Lite（`gemini-3.5-flash-lite`）](/docs/models/gemini-3.5-flash-lite/)，並依
      [Gemini 3.5 Flash-Lite 費率](/docs/pricing/#gemini-3.5-flash-lite)計費。請在
      2026 年 12 月 1 日前，將模型字串更新為 `gemini-3.5-flash-lite`，並參閱
      [Gemini 3.5 Flash-Lite 遷移指南](/docs/whats-new-gemini-3.6/#migrate-to-gemini-3-5-flash-lite)。
      不相容的 API 變更包括函式呼叫與 `thought_signature`
      驗證、`thinking_level` 取代 `thinking_budget`，以及移除取樣
      參數與預填的模型回合。


我們性價比最佳的模型，能力全面均衡。2.5 Flash 最適合大規模處理、低延遲且大量的思考型任務，以及代理式使用案例。

## gemini-2.5-flash {#gemini-25-flash}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-2.5-flash` |
| 支援的資料類型 | **輸入**文字、圖片、影片、音訊 **輸出**文字 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 1,048,576 **輸出 token 上限** 65,536 |
| 功能 | [**音訊生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 支援 [**上下文快取**](/docs/caching/) 支援 [**File search**](/docs/file-search/) 支援 [**函式呼叫**](/docs/function-calling/) 支援 [**使用 Google 地圖接地**](/docs/maps-grounding/) 支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 支援 [**思考**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 支援 |
| 使用方式 | [**Batch API**](/docs/batch-api/) 支援 [**Flex inference**](/docs/flex-inference/) 支援 [**Priority inference**](/docs/priority-inference/) 支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 已淘汰：`gemini-2.5-flash`（自 2026 年 12 月 1 日起生效，自動轉向 `gemini-3.5-flash-lite`） | 已關閉：[gemini-2.5-flash-preview-09-2025](/docs/models/gemini-2.5-flash-preview-09-2025/) |
| 最近更新 | 2025 年 6 月 |
| 知識截止日期 | 2025 年 1 月 |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-2.5-flash/#pricing)。 |


## 定價 {#pricing}


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.30（文字 / 圖片 / 影片） $1.00（音訊） |
    | 輸出價格（含思考 token） | 免費 | $2.50 |
    | 上下文快取價格 | 不提供 | $0.03（文字 / 圖片 / 影片） $0.1（音訊） $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地 | 免費，最多 500 RPD（與 Flash-Lite 共用 RPD 上限） | 1,500 RPD（免費，與 Flash-Lite 共用 RPD 上限），其後每 1,000 次接地提示詞 $35 |
    | 使用 Google 地圖接地 | 500 RPD | 1,500 RPD（免費），其後每 1,000 次接地提示詞 $25 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "批次"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $0.15（文字 / 圖片 / 影片） $0.50（音訊） |
    | 輸出價格（含思考 token） | 不提供 | $1.25 |
    | 上下文快取價格 | 不提供 | $0.03（文字 / 圖片 / 影片） $0.1（音訊） $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地 | 不提供 | 1,500 RPD（免費，與 Flash-Lite 共用 RPD 上限），其後每 1,000 次接地提示詞 $35 |
    | 使用 Google 地圖接地 | 不提供 | 不提供 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "彈性"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $0.15（文字 / 圖片 / 影片） $0.50（音訊） |
    | 輸出價格（含思考 token） | 不提供 | $1.25 |
    | 上下文快取價格 | 不提供 | $0.03（文字 / 圖片 / 影片） $0.1（音訊） $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地 | 不提供 | 1,500 RPD（免費，與 Flash-Lite 共用 RPD 上限），其後每 1,000 次接地提示詞 $35 |
    | 使用 Google 地圖接地 | 不提供 | 不提供 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "優先"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.54（文字 / 圖片 / 影片） $1.80（音訊） |
    | 輸出價格（含思考 token） | 免費 | $4.50 |
    | 上下文快取價格 | 不提供 | $0.054（文字 / 圖片 / 影片） $0.18（音訊） $1.80 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地 | 免費，最多 500 RPD（與 Flash-Lite 共用 RPD 上限） | 1,500 RPD（免費，與 Flash-Lite 共用 RPD 上限），其後每 1,000 次接地提示詞 $35 |
    | 使用 Google 地圖接地 | 500 RPD | 1,500 RPD（免費），其後每 1,000 次接地提示詞 $25 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |
