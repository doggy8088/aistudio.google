# Gemini Nano Banana 2.1

**Gemini Nano Banana 2.1**（`gemini-nano-banana-2.1`）是最新的高效圖片生成與對話式編輯模型。它是 Nano Banana 2（[Gemini 3.1 Flash Image](/docs/models/gemini-3.1-flash-image/)）的更新版本，在維持 Flash 等級速度與成本效率的同時，大幅提升了視覺品質、提示詞遵循度、多輪角色一致性與文字渲染表現。它是 [Gemini 3 Pro Image](/docs/models/gemini-3-pro-image/)（Nano Banana Pro）更具效率的對應版本。

**主要更新：**

* 在 `1K`、`2K` 與 `4K` 輸出解析度下，全面提升視覺品質與真實感（預設 `1K`）
* 修正寬幅與全景長寬比（`1:4`、`4:1`、`1:8`、`8:1`）在 `2K` 與 `4K` 解析度下的拼接瑕疵
* 強化文字渲染與資訊圖表版面準確度
* 多圖融合最多支援 14 張參考圖片（最多 4 個角色的角色一致性，以及最多 10 個物件的物件還原度）
* 使用 Google Web 與圖片搜尋接地
* 可設定的推理等級（`minimal`、`medium`（預設）與 `high`）

[Try in Google AI Studio](https://aistudio.google.com?model=gemini-nano-banana-2.1)

## 文件 {#documentation}

如需功能與能力的完整說明，請參閱 [Image generation](/docs/image-generation/) 頁面。

## gemini-nano-banana-2.1 {#gemini-nano-banana-2-1}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-nano-banana-2.1` |
| 支援的資料類型 | **輸入** 文字、圖片、影片與 PDF **輸出** 圖片與文字 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 131,072 **輸出 token 上限** 32,768 |
| 功能 | [**音訊生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 不支援 [**上下文快取**](/docs/caching/) 不支援 [**File search**](/docs/file-search/) 不支援 [**函式呼叫**](/docs/function-calling/) 不支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 不支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 不支援 [**推理**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 不支援 |
| 使用選項 | [**Batch API**](/docs/batch-api/) 支援 [**Flex 推論**](/docs/flex-inference/) 不支援 [**Priority 推論**](/docs/priority-inference/) 不支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 穩定版：`gemini-nano-banana-2.1` |
| 最近更新 | 2026 年 10 月 |
| 定價 | [定價](/docs/pricing/#gemini-nano-banana-2.1) |




