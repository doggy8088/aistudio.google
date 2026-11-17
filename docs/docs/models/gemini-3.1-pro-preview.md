# Gemini 3.1 Pro preview

Gemini 3.1 Pro Preview 旨在提升 Gemini 3 Pro 系列的效能與可靠性，提供更佳的思考能力、更高的權杖效率，以及更扎實、事實一致性更高的體驗。它針對軟體工程行為與易用性最佳化，也適用於需要精確使用工具、並能在真實世界各領域可靠執行多步驟任務的代理工作流程。

[在 Google AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-3.1-pro-preview)

## 文件 {#documentation}

請參閱 [Gemini 3 開發者指南](/docs/latest-model/) 頁面，瞭解功能與能力的完整說明。

## gemini-3.1-pro-preview {#gemini-31-pro-preview}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-3.1-pro-preview` |
| 支援的資料類型 | **輸入** 文字、圖片、影片、音訊與 PDF **輸出** 文字 |
| 權杖上限[[*]](/docs/tokens/) | **輸入權杖上限** 1,048,576 **輸出權杖上限** 65,536 |
| 功能 | [**語音生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 支援 [**上下文快取**](/docs/caching/) 支援 [**檔案搜尋**](/docs/file-search/) 支援 [**函式呼叫**](/docs/function-calling/) 支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 支援 [**思考**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 支援 |
| 使用選項 | [**Batch API**](/docs/batch-api/) 支援 [**Flex 推論**](/docs/flex-inference/) 支援 [**優先推論**](/docs/priority-inference/) 支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 預覽版：`gemini-3.1-pro-preview` | 預覽版：[`gemini-3.1-pro-preview-customtools`](/docs/models/gemini-3.1-pro-preview/#gemini-31-pro-preview-customtools) |
| 最近更新 | 2026 年 2 月 |
| 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-3-1-pro/) |
| 定價 | [定價](/docs/pricing/#gemini-3.1-pro-preview) |


#### gemini-3.1-pro-preview-customtools {#gemini-31-pro-preview-customtools}

對於混合使用 bash 與自訂工具進行開發的使用者，Gemini 3.1 Pro
Preview 透過 API 提供另一個端點，稱為
`gemini-3.1-pro-preview-customtools`。這個端點更擅長優先處理你的自訂工具（例如 `view_file` 或 `search_code`）。

請注意，雖然 `gemini-3.1-pro-preview-customtools` 針對使用自訂工具與 bash 的代理工作流程最佳化，但在某些無法受惠於這類工具的使用情境中，你可能會看到品質波動。
