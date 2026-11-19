# Gemini 3.7 Flash：開發者指南

為開發者而打造，Gemini 3.7 Flash 是我們迄今最聰明的主力模型，專為程式設計與代理而生。

![Jack Wotherspoon](https://www.gstatic.com/aistudio-static/editorial/page-msrgq2u0/jack-wotherspoon.webp)

![Geneviève Huskens](https://www.gstatic.com/aistudio-static/editorial/page-msrgq2u0/genevieve-huskens.webp)

![Omar Sanseviero](https://www.gstatic.com/aistudio-static/editorial/page-msrgq2u0/omar-sanseviero.webp)

今天，我們推出 [Gemini 3.7 Flash](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/)，這是我們迄今最聰明的主力模型，適用於 Google Antigravity、透過 Google AI Studio 提供的 Gemini API，以及 Gemini Enterprise Agent Platform 中的程式設計與代理應用。Gemini 3.7 Flash 專為開發者打造、作為聰明的日常主力，在軟體工程上帶來一大進步，用起來感覺明顯更好。本次發布為你的日常工作流程帶來更強的智慧，適用於複雜任務、指令遵循與工具呼叫。Gemini 3.7 Flash 的上市優惠價為輸入權杖 **$0.75/1M**、輸出權杖 **$3.75/1M**。優惠價至 2026 年 12 月 31 日截止；屆時將適用輸入權杖 $1.50/1M、輸出權杖 $7.50/1M。我們迫不及待想看你把程式設計任務丟給它，讓 3.7 Flash 證明自己。

為開發者帶來的重點包括：**更強的智慧，適用於程式設計與多步驟代理任務**：在問題解決與除錯方面有大幅提升，在真實世界軟體工程基準與多步驟執行上的準確率也顯著提高，減少代理迴圈失敗與手動除錯的額外負擔。**網頁開發與 UI 設計**：直接從設計稿生成更高擬真度的桌面與網頁應用程式碼，在設計還原度方面有顯著提升，也能稽核現有程式碼庫與設計稿的對照，驗證 1:1 設計一致性。**新的預設模型**：正逐步在 *Google Antigravity*（新使用者）、*Google AI Studio Build* 與 *Gemini API 中的 Managed Agents* 推出為預設模型。

![Gemini 3.7 Flash 在程式設計與代理評測中的基準結果](https://www.gstatic.com/aistudio-static/editorial/page-msrgq2u0/5fa519bb.png)

## 日常開發者工作流程

Gemini 3.7 Flash 為日常工程工作流程帶來明顯的改進與紀律。

## 程式設計與終端機執行

在 Google Antigravity 或其他程式設計框架等代理環境中運作時：**編輯前徹底調查**：在修改程式碼之前，先探索存放庫、檢查設定並執行測試，避免浪費回合與表面修復。這意味著這個模型用起來非常順手。它能可靠地在單一提示詞內處理複雜任務，呼叫正確的工具，成功完成任務。**自主錯誤復原**：更準確地解析編譯器錯誤、測試失敗與終端機輸出，以更少的嘗試次數解決問題，徹底調查根本原因，而不是過於急切地亂改。3.7 Flash 達到更高的首次通過程式碼準確率，在生成可投入生產的程式碼方面表現也有提升，如 DeepSWE v1.1（**65.3%**，3.6 Flash 為 49.0%）與 FrontierCode 1.1 Main（**43.6%**，3.6 Flash 為 34.4%）所示。這些可靠性提升直接帶來更好的複雜多輪任務處理、更少的建置失敗，以及更少監督代理程式設計工作階段所花的時間。

## 網頁開發與 UI 設計

在 LMArena 的 WebDev Arena 上，Gemini 3.7 Flash 取得 1588 的 Elo 分數（3.6 Flash 為 1538）。除了標準的前端生成之外，開發者將 3.7 Flash 連接到 Google Stitch 等設計工具時，在設計還原度與一致性方面看到顯著提升。這個模型擅長雙向設計工作流程：直接從設計工具取得 UI 設計稿，生成桌面與網頁應用程式碼；也能稽核現有程式碼庫與設計稿的對照，驗證 1:1 設計一致性。

## 了解思考等級

Gemini 3.7 Flash 讓開發者能透過調整模型的思考等級 `(thinking_level= “low”|”medium”|”high”)”`，靈活控制延遲與智慧。**低思考投入**：為延遲敏感的任務縮短回答時間，例如事件應變管線、即時聊天、撰寫草稿與快速資料分析。**中（預設）**：推薦用於大多數任務與代理使用案例，首次通過準確率更高。**高思考投入**：最大化模型思考與使用工具的能力。最適合複雜推理、困難數學，以及棘手的程式設計或代理任務。允許延伸思考與函式呼叫，但權杖消耗與成本較高。

```
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-3.7-flash",
    input="Triage the /logs folder and categorize each incident as P0|P1|P2 ",
    generation_config={
        "thinking_level": "low"       
    }
)
print(interaction.output_text)
```

視你的工作流程而定，你可以相應調整思考等級。

## 驅動代理平台

Gemini 3.7 Flash 旨在作為 Google 開發者產品的日常主力：[**Google Antigravity**](https://antigravity.google/)：3.7 Flash 現在是 Antigravity 各介面新使用者的預設模型，包括 Antigravity 2.0、CLI 與 [SDK](https://github.com/google-antigravity/antigravity-sdk-python)。你可以將 3.7 Flash 作為主要模型，用於均衡的推理、程式碼編輯與終端機執行；也可以將它以 `model: flash` 的設定產生為子代理，來執行工作、調查錯誤或修復程式碼。**Gemini API 中的 Managed Agents**：Gemini Managed Agents 現在使用 Gemini 3.7 Flash 作為 [Antigravity 代理](https://ai.google.dev/gemini-api/docs/antigravity-agent) 的預設模型。**Interactions API**：在打造自訂代理時，在用戶端維護多輪上下文往往很脆弱。[Interactions API](https://ai.google.dev/gemini-api/docs/interactions-overview) 在伺服器端管理對話狀態與工具歷史，讓強健的代理迴圈無需用戶端的任何額外工作。以下是 Antigravity 中設計稽核代理的[子代理](https://antigravity.google/docs/subagents)範例：`~/.gemini/config/agents/design_auditor.md`

```
---
name: design-auditor
description: Audits UI code against design mocks to enforce 1:1 design parity.
model: flash
---

You are a specialized design auditing subagent for frontend React components.

### Workflow
1. Search /designs folder to fetch layout and visual specs for the target frame.
2. Inspect the local component implementation in `src/components/`.
3. Compare typography, padding, design tokens and layout flex properties.
4. Report any visual discrepancies and propose code edits to align pixel-perfect with the design.
```

## 開始使用

你今天就可以在 Google 的開發者平台上開始使用 Gemini 3.7 Flash 打造產品：**Google AI Studio**：在 [Google AI Studio](https://aistudio.google.com/) 取得 API 金鑰並測試提示詞。**Google Antigravity**：在 [Google Antigravity](https://antigravity.google/) 中將 `gemini-3.7-flash` 設為使用中的模型，或為自訂子代理設定 flash。**開發者生態系**：將 Gemini 3.7 Flash 直接放入你現有的工作流程，上市首日即支援許多第三方開發者框架與平台，例如 LangChain、OpenCode、Eigent.ai 與 LiteLLM 等。**開發者文件**：在 [Google AI Dev](https://ai.google.dev/gemini-api/docs/latest-model) 閱讀最新指南與 API 規格。
