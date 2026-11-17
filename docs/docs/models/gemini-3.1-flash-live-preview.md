# Gemini 3.1 Flash live preview

Gemini 3.1 Flash Live Preview 是我們舊版的預覽音訊轉音訊模型，適用於即時對話與語音優先的 AI 應用程式。


!!! note " "

       對於新應用程式與正式環境工作負載，建議遷移至 [Gemini 3.8 Live](/docs/models/gemini-3.8-live/)
      (`gemini-3.8-live`) 或
      [Gemini 3.8 Live Extended Thinking](/docs/models/gemini-3.8-live-extended-thinking/)
      (`gemini-3.8-live-extended-thinking`)。


[在 Google AI Studio 中試用](https://aistudio.google.com/live?model=gemini-3.1-flash-live-preview)

## 文件 {#documentation}

請參閱 [Live API](/docs/live-api/) 指南，瞭解功能與能力的完整說明。

## gemini-3.1-flash-live-preview {#gemini-31-flash-live-preview}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-3.1-flash-live-preview` |
| 支援的資料類型 | **輸入** 文字、圖片、音訊 **輸出** 文字與音訊 |
| 權杖上限[[*]](/docs/tokens/) | **輸入權杖上限** 131,072 **輸出權杖上限** 65,536 |
| 功能 | [**語音生成**](/docs/speech-generation/) 支援 [**程式碼執行**](/docs/code-execution/) 不支援 [**上下文快取**](/docs/caching/) 不支援 [**檔案搜尋**](/docs/file-search/) 不支援 [**函式呼叫**](/docs/function-calling/) 支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 不支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 支援 [**結構化輸出**](/docs/structured-output/) 不支援 [**思考**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 不支援 |
| 使用選項 | [**Batch API**](/docs/batch-api/) 不支援 [**Flex 推論**](/docs/flex-inference/) 不支援 [**優先推論**](/docs/priority-inference/) 不支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 預覽版：`gemini-3.1-flash-live-preview` |
| 最近更新 | 2026 年 3 月 |
| 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-3-1-flash-audio/) |
| 定價 | [定價](/docs/pricing/#gemini-3.8-live) |


## 從 Gemini 2.5 Flash Live 遷移 {#migrating}

Gemini 3.1 Flash Live Preview 針對低延遲、即時對話最佳化。從 `gemini-2.5-flash-native-audio-preview-12-2025` 遷移時，請注意以下事項：

- **模型字串**：將模型字串從
  `gemini-2.5-flash-native-audio-preview-12-2025` 更新為
  `gemini-3.1-flash-live-preview`。

- **思考設定**：Gemini 3.1 使用 `thinkingLevel`（設定如
  `minimal`、`low`、`medium` 與 `high`），而非 `thinkingBudget`。
  預設值為 `minimal`，以最佳化至最低延遲。請參閱
  [思考等級與預算](/docs/thinking/?generate-content=true#levels-budgets)。

- **伺服器事件**：單一
  [`BidiGenerateContentServerContent`](/api-reference/live/#BidiGenerateContentServerContent)
  事件現在可同時包含多個內容部分（例如
  音訊區塊與轉錄稿）。請更新程式碼，處理每個事件中的所有部分，以免遺漏內容。

-   **用戶端內容**：支援 `send_client_content`，可在工作階段中途附加文字或
    結構化上下文回合，也可植入初始歷史紀錄（設定
    [`initial_history_in_client_content`](/api-reference/live/#HistoryConfig)，
    位於
    [`history_config`](/api-reference/live/#BidiGenerateContentSetup) 中）。你也可以使用
    [`send_realtime_input`](/api-reference/live/#BidiGenerateContentRealtimeInput)
    串流即時文字、音訊或影片區塊。請參閱
    [增量內容更新](/docs/live-api/capabilities/#incremental-updates)。

- **回合涵蓋範圍**：預設為
  [`TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO`](/api-reference/live/#RealtimeInputConfig.TurnCoverage)，
  而非 `TURN_INCLUDES_ONLY_ACTIVITY`。模型的回合現在包含偵測到的
  音訊活動與所有影片影格。如果你的應用程式目前持續傳送影片影格串流，建議改為僅在有音訊活動時傳送影片影格，以避免產生額外費用。

- **非同步函式呼叫**：尚不支援。函式呼叫僅支援同步模式。在你傳送工具回應之前，模型不會開始回應。請參閱
  [非同步函式呼叫](/docs/live-api/tools/#async-function-calling)。

- **主動式音訊與情感對話**：Gemini 3.1 Flash Live 尚不支援這些功能。請從程式碼中移除這些功能的相關設定。請參閱
  [主動式音訊](/docs/live-api/capabilities/#proactive-audio) 與
  [情感對話](/docs/live-api/capabilities/#affective-dialog)。


詳細的功能比較，請參閱功能指南中的
[模型比較](/docs/live-api/capabilities/#model-comparison) 表格。
