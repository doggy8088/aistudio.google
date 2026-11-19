# Gemini 3.1 Flash image

**Nano Banana 2** 提供高品質的圖片生成與對話式編輯，價格定位主流且延遲低。它是 [Gemini 3 Pro Image](/docs/models/gemini-3-pro-image/) 的高效能對應版本，針對速度與大量開發者使用情境最佳化。

**主要更新**：

* 新的輸出解析度選項：
  * 新增支援 0.5K、2K 與 4K，預設為 1K

* 新的圖片搜尋接地：
  * 整合文字與圖片搜尋結果，以即時網路資料輔助生成

  * 思考開啟或關閉時皆支援


* 新增 1:4、4:1、1:8 與 8:1 長寬比
* 長寬比遵循度提升
* 圖片品質與一致性提升
* i18n 文字算繪改善

[在 Google AI Studio 中試用](https://aistudio.google.com?model=gemini-3.1-flash-image)

## 文件 {#documentation}

請參閱 [圖片生成](/docs/image-generation/) 頁面，瞭解功能與能力的完整說明。

## gemini-3.1-flash-image {#gemini-31-flash-image}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-3.1-flash-image` |
| 支援的資料類型 | **輸入** 文字、圖片、影片與 PDF **輸出** 圖片與文字 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 131,072 **輸出 token 上限** 32,768 |
| 功能 | [**語音生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 不支援 [**上下文快取**](/docs/caching/) 不支援 [**檔案搜尋**](/docs/file-search/) 不支援 [**函式呼叫**](/docs/function-calling/) 不支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 不支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 不支援 [**思考**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 不支援 |
| 使用選項 | [**Batch API**](/docs/batch-api/) 支援 [**Flex 推論**](/docs/flex-inference/) 不支援 [**優先推論**](/docs/priority-inference/) 不支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 穩定版：`gemini-3.1-flash-image` |
| 最近更新 | 2026 年 2 月 |
| 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-3-1-flash-image/) |
| 定價 | [定價](/docs/pricing/#gemini-3.1-flash-image) |
