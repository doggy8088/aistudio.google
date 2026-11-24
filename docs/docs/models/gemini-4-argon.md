# Gemini 4 Argon

Gemini 4 Argon（`gemini-4-argon`）是我們高效的 Gemini 4 前沿推理模型。相較於 [Gemini 4 Carbon](/docs/models/gemini-4-carbon/)，它在複雜的程式設計、代理、數學與科學任務上，能以更快的回應速度與更低的每輪 token 消耗，提供 Gemini 4 等級的智慧。與 Carbon 相同，它支援統一的 100 萬 tokens 上下文視窗，以及最高 100 萬 tokens 的 [long decode](/docs/long-decode/)。

[Try in Google AI Studio](https://aistudio.google.com/prompts/new_chat?model=gemini-4-argon)

## 文件 {#documentation}

如需功能與 API 變更的完整說明，請參閱 [What's new in Gemini 4 Argon](/docs/whats-new-gemini-4-argon/) 頁面；如需比較最新的 Gemini 模型，請參閱[選擇模型](/docs/choosing-a-model/)。

## gemini-4-argon {#gemini-4-argon}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-4-argon` |
| 支援的資料類型 | **輸入** 文字、圖片、影片、音訊與 PDF **輸出** 文字 |
| token 上限[[*]](/docs/tokens/) | **上下文視窗（輸入與輸出 tokens 共用上限）** 1,048,576 **輸出上限** 65,536（預設同步）/ 最高 1,048,576（搭配 [long decode](/docs/long-decode/)） |
| 功能 | [**代理式影片理解**](/docs/video-understanding/#agentic-video-understanding) 支援 [**音訊生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 支援 [**電腦使用**](/docs/computer-use/) 支援 [**上下文快取**](/docs/caching/) 支援 附註：不支援顯式快取。 [**File search**](/docs/file-search/) 支援 [**函式呼叫**](/docs/function-calling/) 支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 支援 [**推理**](/docs/thinking/) 支援 [**工具擷取**](/docs/tool-retrieval/) 支援 [**URL 上下文**](/docs/url-context/) 支援 |
| 使用選項 | [**Batch API**](/docs/batch-api/) 支援 [**Flex 推論**](/docs/flex-inference/) 支援 [**Priority 推論**](/docs/priority-inference/) 支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 穩定版：`gemini-4-argon` |
| 最近更新 | 2026 年 10 月 |
| 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-4-argon/) |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-4-argon/#pricing)。 |


## 定價 {#pricing}


!!! note " "

      Gemini 4 Argon 不提供免費級。模型處理的每一個 token 都會計算並收費，包括思考 token，以及使用接地時的內部工具系統指令與函式宣告。


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $2.00 至 2026 年 11 月 30 日止。$4.00 自 2026 年 12 月 1 日起。 |
    | 輸出價格（含思考 token） | 不提供 | $10.00 至 2026 年 11 月 30 日止。$20.00 自 2026 年 12 月 1 日起。 |
    | 上下文快取價格 | 不提供 | $0.10 至 2026 年 11 月 30 日止。$0.20 自 2026 年 12 月 1 日起。僅支援隱含快取（不支援明確快取）。 |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | 不提供 | [否](/docs/terms/) |


      * 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

=== "批次"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $1.00 至 2026 年 11 月 30 日止。$2.00 自 2026 年 12 月 1 日起。 |
    | 輸出價格（含思考 token） | 不提供 | $5.00 至 2026 年 11 月 30 日止。$10.00 自 2026 年 12 月 1 日起。 |
    | 上下文快取價格 | 不提供 | $0.05 至 2026 年 11 月 30 日止。$0.10 自 2026 年 12 月 1 日起。僅支援隱含快取（不支援明確快取）。 |
    | 用於改善我們的產品 | 不提供 | [否](/docs/terms/) |

=== "彈性"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $1.00 至 2026 年 11 月 30 日止。$2.00 自 2026 年 12 月 1 日起。 |
    | 輸出價格（含思考 token） | 不提供 | $5.00 至 2026 年 11 月 30 日止。$10.00 自 2026 年 12 月 1 日起。 |
    | 上下文快取價格 | 不提供 | $0.05 至 2026 年 11 月 30 日止。$0.10 自 2026 年 12 月 1 日起。僅支援隱含快取（不支援明確快取）。 |
    | 用於改善我們的產品 | 不提供 | [否](/docs/terms/) |

=== "優先"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $3.60 至 2026 年 11 月 30 日止。$7.20 自 2026 年 12 月 1 日起。 |
    | 輸出價格（含思考 token） | 不提供 | $18.00 至 2026 年 11 月 30 日止。$36.00 自 2026 年 12 月 1 日起。 |
    | 上下文快取價格 | 不提供 | $0.18 至 2026 年 11 月 30 日止。$0.36 自 2026 年 12 月 1 日起。僅支援隱含快取（不支援明確快取）。 |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | 不提供 | [否](/docs/terms/) |


      * 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

=== "貢獻者"


    !!! note " "

          Gemini API Contributor Tier 以非公開預覽形式提供，僅限受邀者。速度與可靠性與 [Standard Tier 推論](/docs/optimization/) 相同。符合資格的使用者將收到電子郵件邀請，並在 AI Studio 中看到提示。


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元）* |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $1.00 |
    | 輸出價格（含思考 token） | 不提供 | $5.00 |
    | 上下文快取價格 | 不提供 | $0.05 僅支援隱含快取（不支援明確快取）。 |
    | 用於改善我們的產品 | 不提供 | [是](/docs/logs-policy/#contributor-tier) |


      * 折扣與模型供應情況可能變更。
