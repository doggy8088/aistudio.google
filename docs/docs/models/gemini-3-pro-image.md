# Gemini 3 Pro 圖片

**Nano Banana Pro** 是由推理驅動的精密引擎，專為專業級圖片編輯與生成設計，提供錄音室級的精準度與進階創意控制。Nano Banana Pro 最適合複雜的平面設計、高傳真產品模型，以及需要精確文字渲染並透過 Google 搜尋進行真實世界接地的事實性資料視覺化。

[在 Google AI Studio 中試用](https://aistudio.google.com?model=gemini-3-pro-image)

## 文件 {#documentation}

請造訪[圖片生成](/docs/image-generation/)頁面，查看功能與能力的完整說明。

## gemini-3-pro-image {#gemini-3-pro-image}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-3-pro-image` |
| 支援的資料類型 | **輸入**圖片和文字 **輸出**圖片和文字 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 65,536 **輸出 token 上限** 32,768 |
| 功能 | [**音訊生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 不支援 [**上下文快取**](/docs/caching/) 不支援 [**File search**](/docs/file-search/) 不支援 [**函式呼叫**](/docs/function-calling/) 不支援 [**使用 Google 地圖接地**](/docs/maps-grounding/) 不支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 不支援 [**思考**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 不支援 |
| 使用方式 | [**Batch API**](/docs/batch-api/) 不支援 [**Flex inference**](/docs/flex-inference/) 不支援 [**Priority inference**](/docs/priority-inference/) 不支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 穩定版：`gemini-3-pro-image` |
| 最近更新 | 2025 年 11 月 |
| 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-3-pro-image/) |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-3-pro-image/#pricing)。 |


## 定價 {#pricing}


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $2.00（文字/圖片）, 相當於每張圖片 $0.0011* |
    | 輸出價格 | 不提供 | $12.00（文字與思考）$120.00（圖片），相當於每張 1K/2K 圖片 $0.134 與每張 4K 圖片 $0.24 |
    | 使用 Google 搜尋接地 | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 用於改善我們的產品 | N/A | [否](/docs/terms/) |


* 圖片輸入定為 560 tokens，即每張圖片 $0.0011。

\*\* 圖片輸出價格為每 1,000,000 tokens $120。1024x1024px（1K）至 2048x2048px（2K）的輸出圖片消耗 1120 tokens，相當於每張圖片 $0.134。最大 4096x4096px（4K）的輸出圖片消耗 2000 tokens，相當於每張圖片 $0.24。

\*\*\* 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

\*\*\*\* 可在 Google AI Studio 中測試。
