# Deep Research 預覽版

功能強大的代理型研究工具，專為自主、多步驟的調查設計，能將複雜資訊綜整為附引用的完整報告。此模型支援協作規劃、視覺化、MCP 伺服器與 File Search，並提供兩個版本：著重速度與效率的 Deep Research，以及追求極致完整度的 Deep Research Max。

## 文件 {#documentation}

請造訪 [Deep Research](/docs/deep-research/) 頁面，查看功能與能力的完整說明。

## deep-research-preview-04-2026 {#deep-research-preview-04-2026}


| 屬性 | 說明 |
| --- | --- |
| 代理代碼 | **Interactions API** `deep-research-preview-04-2026` |
| 支援的資料類型 | **輸入**文字、圖片、PDF、音訊、影片 **輸出**文字（附引用報告）、圖片 |
| token 上限[[*]](/docs/tokens/) | **輸入上下文視窗** 1,048,576 **輸出 token 上限** 65,536 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。預覽版：`deep-research-preview-04-2026` Max：`deep-research-max-preview-04-2026` |
| 最近更新 | 2026 年 4 月 |
| 定價 | 請參閱下方的[定價](/docs/models/deep-research-preview-04-2026/#pricing)。 |


## 定價 {#pricing}


| 功能 | 模型 | 工具 |
| --- | --- | --- |
| [Gemini Deep Research 代理](/docs/deep-research/) | 所有模型推論均按 Gemini 標準牌價收費，包括代理迴圈期間產生的輸入、輸出與中間輸入／推理 token。 | 工具使用費依現行定價結構收取，並維持標準區別：Search Grounding（不含擷取的 token）與 Url_context／File Search（其他所有工具均包含擷取的 token）。 |
| [Gemini API 中的代管代理](/docs/agents/) | 所有模型推論均按 Gemini 標準牌價收費，包括代理迴圈期間產生的輸入、輸出與中間輸入／推理 token。 | 預覽期間不收取環境運算（CPU、記憶體、沙箱執行）費用。 |
| [Antigravity Agent](/docs/antigravity-agent/) | 所有模型推論均按 Gemini 標準牌價收費，包括代理迴圈期間產生的輸入、輸出與中間輸入／推理 token。 | 預覽期間不收取環境運算（CPU、記憶體、沙箱執行）費用。 |
