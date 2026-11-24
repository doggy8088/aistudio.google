# Gemini Embedding 2 預覽模型


!!! note " "

      Gemini Embedding 2 Preview（`gemini-embedding-2-preview`）已[淘汰](/docs/deprecations/#embedding-deprecated-models)。自 2026 年 11 月 6 日起，傳送至 `gemini-embedding-2-preview` 的 API 要求會改導向 [Gemini Embedding 2（`gemini-embedding-2`）](/docs/models/gemini-embedding-2/)，並按 [Gemini Embedding 2 費率](/docs/pricing/#gemini-embedding-2)計費。請將你的模型字串更新為 `gemini-embedding-2`。`gemini-embedding-2` 使用相同的 API 架構、定價與嵌入空間，因此不需要其他程式碼變更或向量重新索引。


這是我們的首款多模態嵌入模型，能有效率地將文字、圖片、影片、音訊與 PDF 對應到單一統一的嵌入空間。Gemini Embedding 2 模型最適合跨模態語意搜尋、文件檢索與推薦系統，這類應用需要在大型多模態資料集上進行快速且可擴充的相似度計算。

## 文件 {#documentation}

如需功能與能力的完整說明，請參閱 [Embeddings](/docs/embeddings/) 頁面。

## gemini-embedding-2-preview {#gemini-embedding-2-preview}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | **Gemini API** `gemini-embedding-2-preview` |
| 支援的資料類型 | **輸入** 文字、圖片、影片、音訊、PDF **輸出** 文字嵌入向量 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 8,192 **輸出維度大小** 彈性，支援：128 - 3072，建議：768、1536、3072 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 已淘汰：`gemini-embedding-2-preview`（自 2026 年 11 月 6 日起，改導向 `gemini-embedding-2`） |
| 最近更新 | 2026 年 3 月 |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-embedding-2-preview/#pricing)。 |


## 定價 {#pricing}


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 文字輸入價格 | 免費 | $0.20 |
    | 圖片輸入價格 | 免費 | $0.45（每張圖片 $0.00012） |
    | 音訊輸入價格 | 免費 | $6.50（每秒 $0.00016） |
    | 影片輸入價格 | 免費 | $12.00（每影格 $0.00079） |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "批次"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 文字輸入價格 | 不提供 | $0.10 |
    | 圖片輸入價格 | 不提供 | $0.225（每張圖片 $0.00006） |
    | 音訊輸入價格 | 不提供 | $3.25（每秒 $0.00008） |
    | 影片輸入價格 | 不提供 | $6.00（每影格 $0.000395） |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |
