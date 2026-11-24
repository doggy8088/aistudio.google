# Gemini 3.5 Live translate

Gemini 3.5 Live Translate 是我們的低延遲音訊轉音訊模型，針對口語對話的即時翻譯最佳化。它能實現流暢的雙向翻譯，準確度高且語音輸出自然。

[在 Google AI Studio 中試用](https://aistudio.google.com/live?model=gemini-3.5-live-translate-preview)

## 文件 {#documentation}

請參閱 [即時翻譯](/docs/live-api/live-translate/) 指南，瞭解功能與能力的完整說明。

## gemini-3.5-live-translate-preview {#gemini-35-live-translate-preview}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-3.5-live-translate-preview` |
| 支援的資料類型 | **輸入** 音訊（語音） **輸出** 音訊（翻譯後的語音）與文字（轉錄稿） |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 131,072 **輸出 token 上限** 65,536 |
| 功能 | [**語音生成**](/docs/speech-generation/) 支援 [**程式碼執行**](/docs/code-execution/) 不支援 [**上下文快取**](/docs/caching/) 不支援 [**檔案搜尋**](/docs/file-search/) 不支援 [**函式呼叫**](/docs/function-calling/) 不支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 不支援 [**使用 Google 搜尋接地**](/docs/google-search/) 不支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 支援 [**即時翻譯**](/docs/live-api/live-translate/) 支援 [**結構化輸出**](/docs/structured-output/) 不支援 [**思考**](/docs/thinking/) 不支援 [**URL 上下文**](/docs/url-context/) 不支援 |
| 使用選項 | [**Batch API**](/docs/batch-api/) 不支援 [**Flex 推論**](/docs/flex-inference/) 不支援 [**優先推論**](/docs/priority-inference/) 不支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 預覽版：`gemini-3.5-live-translate-preview` |
| 最近更新 | 2026 年 6 月 |
| 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-3-5-audio/) |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-3.5-live-translate-preview/#pricing)。 |


## 定價 {#pricing}


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $3.50 或 $0.0053/分鐘* （音訊） |
    | 輸出價格（含思考 token） | 免費 | $21.00 或 $0.0315/分鐘* （音訊） |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


* 計費以輸入與輸出音訊 token 的總消耗量為準，以每秒音訊 25 tokens 計算，相當於每分鐘約 $0.0368 的有效價格。
