# Gemini 3.8 Live Extended Thinking

Gemini 3.8 Live Extended Thinking（`gemini-3.8-live-extended-thinking`）是我們
具備高度推理能力的音訊對音訊 Live API 模型，專為即時語音互動中複雜的多步驟問題
求解而設計。它能在串流連續音訊回應的同時，處理可設定的
背景推理（`low`、`medium`、`high`）、思考摘要與
非同步工具呼叫。

若需要不含背景推理延遲的低延遲對話式語音體驗，請參閱 [Gemini 3.8 Live](/docs/models/gemini-3.8-live/)。

[在 Google AI Studio 中試用](https://aistudio.google.com/live?model=gemini-3.8-live-extended-thinking)

## 文件 {#documentation}

推理設定與非同步工具整合的完整說明，請參閱 [Live API](/docs/live-api/) 與
[Live API 中的推理](/docs/live-api/thinking/) 指南。

## gemini-3.8-live-extended-thinking {#gemini-38-live-extended-thinking}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-3.8-live-extended-thinking` |
| 支援的資料類型 | **輸入** 文字、圖片、音訊 **輸出** 文字與音訊 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 131,072 **輸出 token 上限** 65,536 |
| 功能 | [**音訊生成**](/docs/speech-generation/) 支援 [**程式碼執行**](/docs/code-execution/) 不支援 [**上下文快取**](/docs/caching/) 不支援 [**檔案搜尋**](/docs/file-search/) 不支援 [**函式呼叫**](/docs/function-calling/) 支援 [**使用 Google 地圖接地**](/docs/maps-grounding/) 不支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 支援 [**結構化輸出**](/docs/structured-output/) 不支援 [**推理**](/docs/thinking/) 支援 [**網址上下文**](/docs/url-context/) 不支援 |
| 使用方式 | [**Batch API**](/docs/batch-api/) 不支援 [**Flex 推論**](/docs/flex-inference/) 不支援 [**Priority 推論**](/docs/priority-inference/) 不支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 穩定版：`gemini-3.8-live-extended-thinking` |
| 最近更新 | 2026 年 9 月 |
| 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-3-8-audio/) |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-3.8-live-extended-thinking/#pricing)。 |


## 定價 {#pricing}


| 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
| --- | --- | --- |
| 輸入價格 | 免費 | $0.75（文字） $3.00 或 $0.005/分鐘 （音訊） $1.00 或 $0.002/分鐘 （圖片/影片） |
| 輸出價格（含思考 token） | 免費 | $4.50（文字） $12.00 或 $0.018/分鐘 （音訊） |
| 使用 Google 搜尋接地* | 支援 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
| 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


* 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。



## 升級至 Gemini 3.8 Live Extended Thinking {#upgrading}

Gemini 3.8 Live Extended Thinking 在即時
音訊工作階段中引入了背景推理。整合這個模型時，請更新你的用戶端狀態管理
以處理非同步推理訊號：

*   **非同步推理通訊協定**：與使用
    非同步推理的模型互動時，`turnComplete: true` 不再表示
    模型已完全閒置。伺服器可能會繼續處理背景
    推理或工具呼叫。在 `turnComplete: true`
    抵達後，請讓用戶端持續監聽後續的伺服器
    訊息（例如工具呼叫或音訊影格）。
*   **監控 `interaction_status`**：在關閉工作階段前，檢查傳入
    訊息上的 `server_content.interaction_status`（訊息類型為
    [`BidiGenerateContentServerContent`](/api-reference/live/#BidiGenerateContentServerContent)），
    以判斷目前的伺服器狀態：
    *   `IN_PROGRESS`：伺服器正在積極處理使用者輸入、執行
        背景推理，或等待非同步工具呼叫的回應。
        後續可能還有其他模型輸出或工具呼叫。
    *   `IDLE`：伺服器已完成所有處理、推理與工具
        呼叫。工作階段處於閒置狀態，等待使用者輸入。

*   **函式呼叫**：函式呼叫一律為非同步
    （`behavior: NON_BLOCKING`）。同步封鎖模式會傳回錯誤，
    函式排程選項（`SILENT`、`WHEN_IDLE` 與 `INTERRUPTED`）
    也不受支援。請參閱
    [非同步函式呼叫](/docs/live-api/tools/#async-function-calling)。
*   **推理設定**：在工作階段設定中使用
    `thinking_config` 來設定背景推理，其 `thinking_level` 值可為 `low`、
    `medium` 或 `high`。請注意，不支援 `MINIMAL`。請參閱
    [Live API 中的推理](/docs/live-api/thinking/)。
*   **用戶端內容更新**：在整個工作階段生命週期中（包括初始歷史種子植入與回合中途的
    上下文更新）都支援 `send_client_content`，並使用明確的角色（`user` 或 `model`）。設定
    `turn_complete=true` 會立即中斷正在進行的生成。請參閱
    [增量內容更新](/docs/live-api/capabilities/#incremental-updates)。
*   **主動式音訊**：永久啟用。設定 `proactive_audio: false`
    會傳回錯誤。
*   **情感對話**：已從 API 中移除。請從你的設定中移除所有
    `enable_affective_dialog` 設定。

所有 Live API 模型的功能比較，請參閱
功能指南中的[模型比較](/docs/live-api/capabilities/#model-comparison)表格。
