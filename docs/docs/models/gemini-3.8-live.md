# Gemini 3.8 Live

Gemini 3.8 Live（`gemini-3.8-live`）是低延遲、音訊對音訊語音代理體驗與即時對話的預設選項，不會有推理造成的延遲。它支援交錯推理、非同步與同步函式呼叫、整個工作階段的用戶端內容更新，以及內建的主動式音訊。

若是需要多步驟推理與可設定思考預算的複雜代理任務，請參閱
[Gemini 3.8 Live Extended Thinking](/docs/models/gemini-3.8-live-extended-thinking/)。

[在 Google AI Studio 中試用](https://aistudio.google.com/live?model=gemini-3.8-live)

## 文件 {#documentation}

請造訪 [Live API](/docs/live-api/) 指南，瞭解功能、串流設定與工具整合的完整說明。

## gemini-3.8-live {#gemini-38-live}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-3.8-live` |
| 支援的資料類型 | **輸入** 文字、圖片、音訊 **輸出** 文字與音訊 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 131,072 **輸出 token 上限** 65,536 |
| 功能 | [**語音生成**](/docs/speech-generation/) 支援 [**程式碼執行**](/docs/code-execution/) 不支援 [**上下文快取**](/docs/caching/) 不支援 [**檔案搜尋**](/docs/file-search/) 不支援 [**函式呼叫**](/docs/function-calling/) 支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 不支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 支援 [**結構化輸出**](/docs/structured-output/) 不支援 [**思考**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 不支援 |
| 使用選項 | [**Batch API**](/docs/batch-api/) 不支援 [**Flex 推論**](/docs/flex-inference/) 不支援 [**優先推論**](/docs/priority-inference/) 不支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 穩定版：`gemini-3.8-live` |
| 最近更新 | 2026 年 9 月 |
| 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-3-8-audio/) |
| 定價 | [定價](/docs/pricing/#gemini-3.8-live) |


## 從 Gemini 3.1 Flash Live 移轉 {#migrating}

Gemini 3.8 Live 提供超低延遲的音訊對音訊互動，並擴大對非同步工作流程的支援。從
`gemini-3.1-flash-live-preview` 移轉時，請檢視以下更新：

*   **模型字串**：將模型字串從
    `gemini-3.1-flash-live-preview` 更新為 `gemini-3.8-live`。
*   **思考設定**：`gemini-3.8-live` 不支援
    `thinking_level`，因為交錯推理已內建。請從工作階段設定中省略
    `thinking_level` 與 `thinking_config`。若應用程式需要可設定的背景推理（`low`、`medium` 或
    `high`），請使用
    [`gemini-3.8-live-extended-thinking`](/docs/models/gemini-3.8-live-extended-thinking/)。
    請參閱 [Live API 中的思考](/docs/live-api/thinking/)。
*   **非同步函式呼叫**：非同步執行（`behavior:
    NON_BLOCKING`）是預設的函式呼叫模式。你仍可在工具宣告中設定 `behavior: BLOCKING`，
    使用同步阻擋模式以保持向後相容。函式排程選項（`SILENT`、
    `WHEN_IDLE` 與 `INTERRUPTED`）也受支援。請參閱
    [非同步函式呼叫](/docs/live-api/tools/#async-function-calling)。
*   **用戶端內容更新**：`send_client_content` 在整個工作階段生命週期中都受支援
    （包括初始歷史紀錄植入與輪次中途的上下文更新），並可明確指定角色（`user` 或 `model`）。設定
    `turn_complete=true` 會無條件中斷進行中的模型生成。若傳送內容時未設定
    `turn_complete`，伺服器會等待後續訊息再回應。請參閱
    [增量內容更新](/docs/live-api/capabilities/#incremental-updates)。
*   **主動式音訊**：主動式音訊已永久啟用。設定
    `proactive_audio: false` 會傳回錯誤，因此若移轉的程式碼有停用此功能，請省略 `proactive_audio`。
*   **情感對話**：情感對話已從 API 移除。請從設定中移除所有 `enable_affective_dialog` 設定。
*   **輪次涵蓋範圍**：預設為
    [`TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO`](/api-reference/live/#RealtimeInputConfig.TurnCoverage)。
    影片影格會預設傳送給模型，因此請只在需要時傳送影格，以管理上下文與成本。
*   **回應模態**：音訊是唯一支援的回應模態
    （`response_modalities=["AUDIO"]`）。若應用程式需要文字轉錄稿，請啟用 `output_audio_transcription`。請參閱
    [音訊轉錄](/docs/live-api/capabilities/#audio-transcription)。

如需所有 Live API 模型的功能比較，請參閱能力指南中的
[模型比較](/docs/live-api/capabilities/#model-comparison)表格。
