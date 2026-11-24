# Gemini 2.5 Flash 圖片（Nano Banana）

我們最適合高速視覺創作的引擎，具備頂尖的速度與效率。Gemini 2.5 Flash Image 又稱為 Nano Banana，最適合大量生成、對話式圖片編輯，以及需要原生多模態理解的低延遲創意工作流程。

[在 Google AI Studio 中試用](https://aistudio.google.com?model=gemini-2.5-flash-image)

## 文件 {#documentation}

請參閱[圖片生成](/docs/image-generation/)指南，查看功能與能力的完整說明。

## gemini-2.5-flash-image {#gemini-25-flash-image}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-2.5-flash-image` |
| 支援的資料類型 | **輸入**圖片和文字 **輸出**圖片和文字 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 65,536 **輸出 token 上限** 32,768 |
| 功能 | [**音訊生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 不支援 [**上下文快取**](/docs/caching/) 不支援 [**File search**](/docs/file-search/) 不支援 [**函式呼叫**](/docs/function-calling/) 不支援 [**使用 Google 地圖接地**](/docs/maps-grounding/) 不支援 [**使用 Google 搜尋接地**](/docs/google-search/) 不支援 [**圖片生成**](/docs/image-generation/) 支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 不支援 [**思考**](/docs/thinking/) 不支援 [**URL 上下文**](/docs/url-context/) 不支援 |
| 使用方式 | [**Batch API**](/docs/batch-api/) 支援 [**Flex inference**](/docs/flex-inference/) 不支援 [**Priority inference**](/docs/priority-inference/) 不支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 穩定版：`gemini-2.5-flash-image` | 已淘汰：`gemini-2.5-flash-image-preview` |
| 最近更新 | 2025 年 10 月 |
| 知識截止日期 | 2025 年 6 月 |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-2.5-flash-image/#pricing)。 |


## 定價 {#pricing}

文字輸入與輸出的定價與 [Gemini 2.5 Flash](/docs/pricing/#gemini-2.5-flash) 相同。


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $0.30（文字 / 圖片） |
    | 輸出價格 | 不提供 | 每張圖片 $0.039* |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "批次"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $0.15（文字 / 圖片） |
    | 輸出價格 | 不提供 | 每張圖片 $0.0195* |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "彈性"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $0.15（文字 / 圖片） |
    | 輸出價格 | 不提供 | 每張圖片 $0.0195* |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "優先"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $0.54（文字 / 圖片） |
    | 輸出價格 | 不提供 | 每張圖片 $0.0702* |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


* 圖片輸出價格為每 1,000,000 tokens $30。最大 1024x1024px 的輸出圖片消耗 1290 tokens，相當於每張圖片 $0.039。
