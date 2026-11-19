# Gemini 4 Carbon

Gemini 4 Carbon（`gemini-4-carbon`）是我們能力最強的推理模型，專為複雜的軟體工程、數學與科學問題求解、高事實正確性、自主多步驟代理，以及最高 100 萬 tokens 的 long decode 而打造。

[Try in Google AI Studio](https://aistudio.google.com/prompts/new_chat?model=gemini-4-carbon)

## 文件 {#documentation}

如需功能、API 變更與遷移指南的完整說明，請參閱 [What's new in Gemini 4 Carbon](/docs/whats-new-gemini-4-carbon/) 頁面；如需比較 Carbon 與 Neon、Hydrogen 及 Flash-Lite，請參閱[選擇模型](/docs/choosing-a-model/)。

## gemini-4-carbon {#gemini-4-carbon}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-4-carbon` |
| 支援的資料類型 | **輸入** 文字、圖片、影片、音訊與 PDF **輸出** 文字 |
| token 上限[[*]](/docs/tokens/) | **上下文視窗（輸入與輸出 tokens 共用上限）** 1,048,576 **輸出上限** 65,536（預設同步）/ 最高 1,048,576（搭配 [long decode](/docs/long-decode/)） |
| 功能 | [**代理式影片理解**](/docs/video-understanding/#agentic-video-understanding) 支援 [**音訊生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 支援 [**電腦使用**](/docs/computer-use/) 支援 [**上下文快取**](/docs/caching/) 支援 附註：不支援顯式快取。 [**File search**](/docs/file-search/) 支援 [**函式呼叫**](/docs/function-calling/) 支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 支援 [**推理**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 支援 |
| 使用選項 | [**Batch API**](/docs/batch-api/) 支援 [**Flex 推論**](/docs/flex-inference/) 支援 [**Priority 推論**](/docs/priority-inference/) 支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 穩定版：`gemini-4-carbon` |
| 最近更新 | 2026 年 11 月 |
| 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-4-carbon/) |
| 定價 | [定價](/docs/pricing/#gemini-4-carbon) |




