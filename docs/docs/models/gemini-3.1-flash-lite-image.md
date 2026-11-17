# Gemini 3.1 Flash Lite image

**Nano Banana 2 Lite** 是圖片生成系列中的效率專家，提供超低延遲且具成本效益的圖片生成與編輯。此模型以低於 2 秒的端到端延遲與大幅降低的 TPU 運算成本為目標，適用於大量的互動式開發者使用情境與即時消費者應用程式。

**主要功能**：

*   **端到端延遲低於 2 秒**
*   **交錯生成與編輯**，原生支援 Text -> Text + Image(s) 與 Image + Text -> Text + Image(s)。
*   **針對較低解析度最佳化**：1K (1024x1024px)。
*   支援一組 **14 種長寬比**，包含標準格式。
*   **快速的多輪本機編輯**（更換顏色、製作貼圖、調整背景）。
*   維持與原始 Nano Banana 標準一致的高字元對齊度。
*   新增 `1:1`、`3:2`、`2:3`、`3:4`、`4:3`、`4:5`、`5:4`、`9:16`、`16:9`、`21:9` 長寬比。
*   支援的 `image_size` 值：`1024px` (1K)。*(註：不支援 2K 與 4K)。*
*   **SynthID 浮水印（永遠開啟）+ C2PA**。

[在 Google AI Studio 中試用](https://aistudio.google.com?model=gemini-3.1-flash-lite-image)

## 文件 {#documentation}

請參閱 [圖片生成](/docs/image-generation/) 頁面，瞭解功能與能力的完整說明。

## gemini-3.1-flash-lite-image {#gemini-31-flash-lite-image}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-3.1-flash-lite-image` |
| 支援的資料類型 | **輸入** 文字、圖片、影片與 PDF **輸出** 圖片與文字 |
| 權杖上限[[*]](/docs/tokens/) | **輸入權杖上限** 65,536 **輸出權杖上限** 4,096 |
| 功能 | [**語音生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 不支援 [**上下文快取**](/docs/caching/) 不支援 [**檔案搜尋**](/docs/file-search/) 不支援 [**函式呼叫**](/docs/function-calling/) 不支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 不支援 [**使用 Google 搜尋接地**](/docs/google-search/) 不支援 [**圖片生成**](/docs/image-generation/) 支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 不支援 [**思考**](/docs/thinking/) 支援（minimal 與 high） [**URL 上下文**](/docs/url-context/) 不支援 |
| 使用選項 | [**Batch API**](/docs/batch-api/) 支援 [**Flex 推論**](/docs/flex-inference/) 不支援 [**優先推論**](/docs/priority-inference/) 不支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 穩定版：`gemini-3.1-flash-lite-image` |
| 最近更新 | 2026 年 6 月 |
| 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-3-1-flash-lite-image/) |
| 定價 | [定價](/docs/pricing/#gemini-3.1-flash-lite-image) |
