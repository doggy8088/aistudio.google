# Gemini Embedding 模型

這是專為高維度向量表示打造的引擎，能有效率地將文字與圖片對應為數值。Gemini Embedding 模型最適合語意搜尋、文件檢索與推薦系統，這類應用需要在大型資料集上進行快速且可擴充的相似度計算。

## 文件 {#documentation}

如需功能與能力的完整說明，請參閱 [Embeddings](/docs/embeddings/) 頁面。

## gemini-embedding-001 {#gemini-embedding-001}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | **Gemini API** `gemini-embedding-001` |
| 支援的資料類型 | **輸入** 文字 **輸出** 文字嵌入向量 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 2,048 **輸出維度大小** 彈性，支援：128 - 3072，建議：768、1536、3072 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 穩定版：`gemini-embedding-001` |
| 最近更新 | 2025 年 6 月 |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-embedding-001/#pricing)。 |


## 定價 {#pricing}


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.15 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "批次"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $0.075 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |
