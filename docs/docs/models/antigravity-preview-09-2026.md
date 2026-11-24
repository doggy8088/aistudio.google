# Antigravity 預覽版

功能強大的通用型代管代理，專為自主、多步驟的工作流程設計。此模型可在 Google 代管的安全隔離 Linux 沙箱中進行規劃、推理、執行程式碼、管理檔案並搜尋網路。

2026 年 9 月發布的版本（`antigravity-preview-09-2026`）升級了執行階段框架，改善提示詞快取、加入原生程式碼搜尋工具，並提供高效率的行範圍檔案編輯功能。

## 文件 {#documentation}

請造訪 [Antigravity Agent](/docs/antigravity-agent/) 頁面，查看功能、能力與程式碼範例的完整說明。

## antigravity-preview-09-2026 {#antigravity-preview-09-2026}


| 屬性 | 說明 |
| --- | --- |
| 代理代碼 | **Interactions API** `antigravity-preview-09-2026` |
| 支援的資料類型 | **輸入**文字、圖片 **輸出**文字 |
| token 上限[[*]](/docs/tokens/) | **輸入上下文視窗** 1,048,576（約 135k 時壓縮） **輸出 token 上限** 65,536 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。預覽版：`antigravity-preview-09-2026` |
| 最近更新 | 2026 年 9 月 |
| 定價 | 請參閱下方的[定價](/docs/models/antigravity-preview-09-2026/#pricing)。 |


## 定價 {#pricing}


| 功能 | 模型 | 工具 |
| --- | --- | --- |
| [Gemini Deep Research 代理](/docs/deep-research/) | 所有模型推論均按 Gemini 標準牌價收費，包括代理迴圈期間產生的輸入、輸出與中間輸入／推理 token。 | 工具使用費依現行定價結構收取，並維持標準區別：Search Grounding（不含擷取的 token）與 Url_context／File Search（其他所有工具均包含擷取的 token）。 |
| [Gemini API 中的代管代理](/docs/agents/) | 所有模型推論均按 Gemini 標準牌價收費，包括代理迴圈期間產生的輸入、輸出與中間輸入／推理 token。 | 預覽期間不收取環境運算（CPU、記憶體、沙箱執行）費用。 |
| [Antigravity Agent](/docs/antigravity-agent/) | 所有模型推論均按 Gemini 標準牌價收費，包括代理迴圈期間產生的輸入、輸出與中間輸入／推理 token。 | 預覽期間不收取環境運算（CPU、記憶體、沙箱執行）費用。 |
