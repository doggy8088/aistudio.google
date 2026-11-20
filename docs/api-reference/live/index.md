# Live API - WebSockets API 參考文件


!!! note " "

      **Preview:** Live API 目前為預覽版。


Live API 是一個有狀態的 API，使用 [WebSockets](https://en.wikipedia.org/wiki/WebSocket)。本節提供 WebSockets API 的進一步細節。

## 方法 {#methods}


| Method | Endpoint |
| --- | --- |
| [啟動 Live 工作階段](/api-reference/live/bidi-generate-content/) | `WSS` `/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent` 開啟有狀態的 WebSocket 工作階段，與模型交換文字、音訊與影片。 |
| [建立臨時驗證 token](/api-reference/generate-content/create-token/) | `POST` `/v1beta/auth_tokens` 建立可用於限制 BidiGenerateContent 工作階段行為的 token。 |


## 資料模型 {#data-models}

### ActivityEnd {#BidiGenerateContentRealtimeInput.ActivityEnd}

標記使用者活動結束。

此類型沒有欄位。

### ActivityHandling {#ActivityHandling}

處理使用者活動的不同方式。


| Value | Description |
| --- | --- |
| `ACTIVITY_HANDLING_UNSPECIFIED` | 若未指定，預設行為為 `START_OF_ACTIVITY_INTERRUPTS`。 |
| `START_OF_ACTIVITY_INTERRUPTS` | 若為 true，活動開始時會中斷模型的回應（也稱為「插話」）。模型目前的回應會在中斷當下被截斷。此為預設行為。 |
| `NO_INTERRUPTION` | 模型的回應不會被中斷。 |


### ActivityStart {#BidiGenerateContentRealtimeInput.ActivityStart}

標記使用者活動開始。

此類型沒有欄位。

### AudioTranscriptionConfig {#AudioTranscriptionConfig}

音訊轉錄設定。


| Field | Type | Description |
| --- | --- | --- |
| `languageCodes[]` | `string` | 選用。BCP-47 語言代碼，提供音訊中所含語言的提示。若省略或留空，預設為自動偵測語言。 |
| `customVocabulary[]` | `string` | 選用。自訂詞彙片語清單，讓語音辨識模型偏向辨識特定詞彙（產品名稱、專有名詞、術語）。 |
| `wordTimestamp` | `bool` | 選用。設定是否產生逐字時間戳記。 |
| `diarization` | `bool` | 選用。設定是否進行說話者分離。 |
| `sourceText` | `string` | 選用。要透過語音指令編輯或改寫的來源文字。在 `SMART` 模式下提供此欄位時，模型會以此文字為基準評估音訊輸入，並在候選回應中輸出完整的替代文字，而非附加於其後。 |
| `mode` | [`Mode`](/api-reference/live/#AudioTranscriptionConfig.Mode) | 選用。設定轉錄模式。支援的值：`VERBATIM`、`SMART`。若未指定，預設為 `VERBATIM` 轉錄。在 `SMART` 模式下，模型會進行去贅字處理（移除填充詞、重複與錯誤起頭）、輕度文法清理、自動格式化（段落、項目符號、編號清單），以及輕微的使用者編輯（行內自我修正）。時間戳記與說話者分離與 `SMART` 模式不相容。 |


### Mode {#AudioTranscriptionConfig.Mode}

轉錄模式。


| Value | Description |
| --- | --- |
| `MODE_UNSPECIFIED` | 未指定的轉錄模式。 |
| `VERBATIM` | 逐字轉錄模式。 |
| `SMART` | 智慧轉錄模式。 |


### AutomaticActivityDetection {#RealtimeInputConfig.AutomaticActivityDetection}

設定活動的自動偵測。


| Field | Type | Description |
| --- | --- | --- |
| `disabled` | `bool` | 選用。若啟用（預設），偵測到的語音與文字輸入會視為活動。若停用，用戶端必須傳送活動訊號。 |
| `startOfSpeechSensitivity` | [`StartSensitivity`](/api-reference/live/#RealtimeInputConfig.AutomaticActivityDetection.StartSensitivity) | 選用。決定偵測到語音的可能性高低。 |
| `prefixPaddingMs` | `int32` | 選用。確認語音開始前所需的偵測語音長度。此值越低，語音開始的偵測越靈敏，能辨識的語音越短；不過，這也會提高誤判的機率。 |
| `endOfSpeechSensitivity` | [`EndSensitivity`](/api-reference/live/#RealtimeInputConfig.AutomaticActivityDetection.EndSensitivity) | 選用。決定偵測到的語音結束的可能性高低。 |
| `silenceDurationMs` | `int32` | 選用。確認語音結束前所需的偵測非語音（例如靜音）長度。此值越大，語音間隔可以越長而不中斷使用者活動，但會增加模型的延遲。 |


### BidiGenerateContentClientContent {#BidiGenerateContentClientContent}

用戶端傳遞的目前對話增量更新。此處的所有內容都會無條件附加至對話記錄，並作為提示詞的一部分供模型生成內容。

對於對話式 Live 模型，此處的訊息會中斷目前進行中的任何模型生成。對於 TTS 模型，`turn_complete = false` 會將文字、風格與速度排入佇列，而不會中斷進行中的音訊生成；`turn_complete = true` 則會將該回合送出。


| Field | Type | Description |
| --- | --- | --- |
| `turns[]` | [`Content`](/api-reference/generate-content/#Resource:Content) | 選用。附加至與模型目前對話的內容。單輪查詢時為單一執行個體；多輪查詢時為重複欄位，包含對話記錄與最新要求。 |
| `turnComplete` | `bool` | 選用。若為 true，表示伺服器應以目前累積的提示詞開始生成內容。否則，伺服器會等待更多訊息後才開始生成。 |


### BidiGenerateContentRealtimeInput {#BidiGenerateContentRealtimeInput}

即時傳送的使用者輸入。

不同的模態（音訊、影片與文字）以並行串流方式處理，這些串流之間的順序不保證。

此類型與 [`BidiGenerateContentClientContent`](/api-reference/live/#BidiGenerateContentClientContent) 有幾點不同：

- 可以持續傳送而不中斷模型生成。
- 若需要在 [`BidiGenerateContentClientContent`](/api-reference/live/#BidiGenerateContentClientContent) 與 [`BidiGenerateContentRealtimeInput`](/api-reference/live/#BidiGenerateContentRealtimeInput) 之間交錯混合資料，伺服器會嘗試最佳化以獲得最佳回應，但不保證結果。
- 回合結束並非明確指定，而是由使用者活動推導而來（例如語音結束）。
- 即使在回合結束之前，資料也會增量處理，以最佳化模型回應的快速啟動。


| Field | Type | Description |
| --- | --- | --- |
| `mediaChunks[]` | [`Blob`](/api-reference/generate-content/) | 選用。媒體輸入的行內位元組資料。不支援多個 `mediaChunks`，除第一個以外都會被忽略。已淘汰：請改用 `audio`、`video` 或 `text` 其中之一。 |
| `audio` | [`Blob`](/api-reference/generate-content/) | 選用。構成即時音訊輸入串流。 |
| `video` | [`Blob`](/api-reference/generate-content/) | 選用。構成即時影片輸入串流。 |
| `activityStart` | [`ActivityStart`](/api-reference/live/#BidiGenerateContentRealtimeInput.ActivityStart) | 選用。標記使用者活動開始。僅在自動（即伺服器端）活動偵測停用時才能傳送。 |
| `activityEnd` | [`ActivityEnd`](/api-reference/live/#BidiGenerateContentRealtimeInput.ActivityEnd) | 選用。標記使用者活動結束。僅在自動（即伺服器端）活動偵測停用時才能傳送。 |
| `mediaResolution` | [`MediaResolution`](/api-reference/generate-content/) | 選用。要使用的媒體解析度。若未指定，則使用 `setup.generationConfig.mediaResolution`，或在未提供設定時使用預設值。 |
| `audioStreamEnd` | `bool` | 選用。表示音訊串流已結束，例如麥克風已關閉。僅應在自動活動偵測啟用時（預設即為啟用）傳送。用戶端可以傳送音訊訊息來重新開啟串流。 |
| `text` | `string` | 選用。構成即時文字輸入串流。 |


### BidiGenerateContentServerContent {#BidiGenerateContentServerContent}

模型回應用戶端訊息所生成的增量伺服器更新。

內容會以最快速度生成，而非即時生成。用戶端可以選擇將內容緩衝後再即時播放。


| Field | Type | Description |
| --- | --- | --- |
| `generationComplete` | `bool` | 僅輸出。若為 true，表示模型已完成生成。當模型在生成過程中被中斷時，被中斷的回合不會出現 'generation_complete' 訊息，而是走 'interrupted > turn_complete' 的流程。當模型假定即時播放時，generation_complete 與 turn_complete 之間會有延遲，這是因為模型在等待播放結束。 |
| `turnComplete` | `bool` | 僅輸出。若為 true，表示模型已完成其回合。生成只會在回應額外的用戶端訊息時才開始。請注意，啟用播放狀態回報時，此欄位僅在播放狀態顯示播放完成時才發出。同一生成的後續播放狀態會被忽略。 |
| `interrupted` | `bool` | 僅輸出。若為 true，表示用戶端訊息已中斷目前的模型生成。若用戶端正在即時播放內容，這是一個停止並清空目前播放佇列的好時機。 |
| `groundingMetadata` | [`GroundingMetadata`](/api-reference/generate-content/) | 僅輸出。生成內容的接地中繼資料。 |
| `inputTranscription` | [`BidiGenerateContentTranscription`](/api-reference/live/#BidiGenerateContentTranscription) | 僅輸出。輸入音訊的轉錄。轉錄的傳送獨立於其他伺服器訊息，且不保證順序。 |
| `interimInputTranscription` | [`BidiGenerateContentTranscription`](/api-reference/live/#BidiGenerateContentTranscription) | 僅輸出。使用者說話時更新的低延遲轉錄。此欄位會頻繁更新。 |
| `outputTranscription` | [`BidiGenerateContentTranscription`](/api-reference/live/#BidiGenerateContentTranscription) | 僅輸出。輸出音訊的轉錄。這些轉錄是伺服器生成輸出的一部分。此回合最後一個輸出轉錄會在 `generationComplete` 或 `interrupted` 之前傳送，其後再接 `turnComplete`。轉錄與其他 `modelTurn` 輸出之間不保證確切順序，但伺服器會嘗試將轉錄稿傳送至接近對應音訊輸出的位置。 |
| `urlContextMetadata` | [`UrlContextMetadata`](/api-reference/live/#UrlContextMetadata) |  |
| `waitingForInput` | `bool` | 僅輸出。若為 true，表示模型並未生成內容，因為它正在等待使用者提供更多輸入，例如預期使用者會繼續說話。 |
| `interactionStatus` | [`InteractionStatus`](/api-reference/live/#BidiGenerateContentServerContent.InteractionStatus) | 僅輸出。Live 工作階段目前的活動狀態。一律與 `turnComplete` 一同傳送。 |
| `modelTurn` | [`Content`](/api-reference/generate-content/#Resource:Content) | 僅輸出。模型在與使用者的目前對話中所生成的內容。 |


### BidiGenerateContentServerMessage {#BidiGenerateContentServerMessage}

BidiGenerateContent 呼叫的回應訊息。


| Field | Type | Description |
| --- | --- | --- |
| `usageMetadata` | [`UsageMetadata`](/api-reference/live/#UsageMetadata) | 僅輸出。回應的使用中繼資料。 |
| `voiceActivity` | [`VoiceActivity`](/api-reference/live/#VoiceActivity) | 僅輸出。在音訊串流中偵測到的語音活動。 |


聯集欄位 `messageType`。訊息的類型。`messageType` 只能是下列其中一項：


| Field | Type | Description |
| --- | --- | --- |
| `setupComplete` | [`BidiGenerateContentSetupComplete`](/api-reference/live/#BidiGenerateContentSetupComplete) | 僅輸出。當設定完成時，回應用戶端的 `BidiGenerateContentSetup` 訊息而傳送。 |
| `serverContent` | [`BidiGenerateContentServerContent`](/api-reference/live/#BidiGenerateContentServerContent) | 僅輸出。模型回應用戶端訊息所生成的內容。 |
| `toolCall` | [`BidiGenerateContentToolCall`](/api-reference/live/#BidiGenerateContentToolCall) | 僅輸出。要求用戶端執行 `functionCalls`，並以相符的 `id` 回傳回應。 |
| `toolCallCancellation` | [`BidiGenerateContentToolCallCancellation`](/api-reference/live/#BidiGenerateContentToolCallCancellation) | 僅輸出。通知用戶端，先前發出的 `ToolCallMessage`（具有指定的 `id`）應予取消。 |
| `goAway` | [`GoAway`](/api-reference/live/#GoAway) | 僅輸出。伺服器即將中斷連線的通知。 |
| `sessionResumptionUpdate` | [`SessionResumptionUpdate`](/api-reference/live/#SessionResumptionUpdate) | 僅輸出。工作階段恢復狀態的更新。 |


### BidiGenerateContentSetup {#BidiGenerateContentSetup}

要在第一則（且僅第一則）`BidiGenerateContentClientMessage` 中傳送的訊息。包含在串流 RPC 期間適用的設定。

用戶端應等到收到 `BidiGenerateContentSetupComplete` 訊息後，再傳送其他訊息。


| Field | Type | Description |
| --- | --- | --- |
| `model` | `string` | 必要。模型的資源名稱，作為所用模型的 ID。格式：`models/{model}` |
| `generationConfig` | [`GenerationConfig`](/api-reference/generate-content/) | 選用。生成設定。以下欄位不支援： - `responseLogprobs` - `responseMimeType` - `logprobs` - `responseSchema` - `responseJsonSchema` - `stopSequence` - `skipResponseCache` - `routingConfig` - `audioTimestamp` |
| `systemInstruction` | [`Content`](/api-reference/generate-content/#Resource:Content) | 選用。使用者提供給模型的系統指令。注意：parts 中應僅使用文字，且每個 part 中的內容會放在各自獨立的段落。 |
| `tools[]` | [`Tool`](/api-reference/generate-content/#Resource:Tool) | 選用。模型可用來生成下一個回應的 `Tools` 清單。`Tool` 是一段程式碼，讓系統能與外部系統互動，以執行模型知識與範圍之外的動作（一項或一組動作）。 |
| `realtimeInputConfig` | [`RealtimeInputConfig`](/api-reference/live/#RealtimeInputConfig) | 選用。設定即時輸入的處理方式。 |
| `sessionResumption` | [`SessionResumptionConfig`](/api-reference/live/#SessionResumptionConfig) | 選用。設定工作階段恢復機制。若包含此欄位，伺服器會傳送 `SessionResumptionUpdate` 訊息。 |
| `contextWindowCompression` | [`ContextWindowCompressionConfig`](/api-reference/live/#ContextWindowCompressionConfig) | 選用。設定上下文視窗壓縮機制。若包含此欄位，當上下文超過設定的長度時，伺服器會自動縮小其大小。 |
| `inputAudioTranscription` | [`AudioTranscriptionConfig`](/api-reference/live/#AudioTranscriptionConfig) | 選用。若設定，會啟用語音輸入的轉錄。若已設定，轉錄會與輸入音訊的語言一致。 |
| `outputAudioTranscription` | [`AudioTranscriptionConfig`](/api-reference/live/#AudioTranscriptionConfig) | 選用。若設定，會啟用模型音訊輸出的轉錄。若已設定，轉錄會與輸出音訊所指定的語言代碼一致。 |
| `proactivity` | [`ProactivityConfig`](/api-reference/live/#ProactivityConfig) | 選用。設定模型的主動程度。這讓模型能主動回應輸入，並忽略不相關的輸入。 |
| `historyConfig` | [`HistoryConfig`](/api-reference/live/#HistoryConfig) | 選用。設定用戶端與伺服器之間的記錄交換。 |
| `labels` | `map<string, string>` | 選用。帶有使用者自訂中繼資料的要求標籤。選用。標籤必須符合標準的統一 Cloud 標籤要求： - 標籤鍵必須以字母開頭。 - 標籤鍵與值不得超過 63 個字元（Unicode 碼點），且只能包含小寫字母、數字字元、底線與連字號。 - 允許國際字元。使用方式： - 來自彙整者的安全識別碼：使用鍵 `safety_identifier`（例如 `{"safety_identifier": "user_session_123"}`） |


### BidiGenerateContentSetupComplete {#BidiGenerateContentSetupComplete}

回應用戶端的 `BidiGenerateContentSetup` 訊息而傳送。

此類型沒有欄位。

### BidiGenerateContentToolCall {#BidiGenerateContentToolCall}

要求用戶端執行 `functionCalls`，並以相符的 `id` 回傳回應。


| Field | Type | Description |
| --- | --- | --- |
| `functionCalls[]` | [`FunctionCall`](/api-reference/generate-content/) | 僅輸出。要執行的函式呼叫。 |


### BidiGenerateContentToolCallCancellation {#BidiGenerateContentToolCallCancellation}

通知用戶端，先前發出的 `ToolCallMessage`（具有指定的 `id`）本不應執行，應予取消。若這些工具呼叫已產生副作用，用戶端可以嘗試還原。此訊息僅在用戶端中斷伺服器回合時出現。


| Field | Type | Description |
| --- | --- | --- |
| `ids[]` | `string` | 僅輸出。要取消的工具呼叫的 id。 |


### BidiGenerateContentToolResponse {#BidiGenerateContentToolResponse}

用戶端針對從伺服器收到的 `ToolCall` 所產生的回應。各個 `FunctionResponse` 物件會與對應的 `FunctionCall` 物件配對，配對依據為 `id` 欄位。

請注意，在單元式與伺服器串流的 GenerateContent API 中，函式呼叫是透過交換 `Content` parts 進行；而在雙向 GenerateContent API 中，函式呼叫則透過這組專用訊息進行。


| Field | Type | Description |
| --- | --- | --- |
| `functionResponses[]` | [`FunctionResponse`](/api-reference/generate-content/) | 選用。對函式呼叫的回應。 |


### BidiGenerateContentTranscription {#BidiGenerateContentTranscription}

音訊（輸入或輸出）的轉錄。


| Field | Type | Description |
| --- | --- | --- |
| `text` | `string` | 轉錄文字。 |
| `languageCode` | `string` | 轉錄的 BCP-47 語言代碼。 |
| `startOffset` | [`Duration`](https://protobuf.dev/reference/protobuf/google.protobuf/#duration) | 選用。轉錄相對於音訊開頭的開始時間偏移。 |
| `endOffset` | [`Duration`](https://protobuf.dev/reference/protobuf/google.protobuf/#duration) | 選用。轉錄相對於音訊開頭的結束時間偏移。 |


### ContextWindowCompressionConfig {#ContextWindowCompressionConfig}

啟用上下文視窗壓縮——這是一種管理模型上下文視窗的機制，使其不超過給定的長度。

聯集欄位 `compressionMechanism`。所使用的上下文視窗壓縮機制。`compressionMechanism` 只能是下列其中一項：


| Field | Type | Description |
| --- | --- | --- |
| `slidingWindow` | [`SlidingWindow`](/api-reference/live/#ContextWindowCompressionConfig.SlidingWindow) | 滑動視窗機制。 |
| `triggerTokens` | `int64` | 觸發上下文視窗壓縮所需的 token 數量（在執行一個回合之前計算）。這可用來在品質與延遲之間取得平衡，因為較短的上下文視窗可能帶來更快的模型回應。不過，任何壓縮操作都會造成暫時的延遲增加，因此不應頻繁觸發。若未設定，預設值為模型上下文視窗上限的 80%。如此可保留 20% 供下一個使用者要求／模型回應使用。 |


### EndSensitivity {#RealtimeInputConfig.AutomaticActivityDetection.EndSensitivity}

決定語音結束的偵測方式。


| Value | Description |
| --- | --- |
| `END_SENSITIVITY_UNSPECIFIED` | 預設值為 END_SENSITIVITY_HIGH。 |
| `END_SENSITIVITY_HIGH` | 自動偵測較常判定語音結束。 |
| `END_SENSITIVITY_LOW` | 自動偵測較少判定語音結束。 |


### GoAway {#GoAway}

伺服器即將中斷連線的通知。


| Field | Type | Description |
| --- | --- | --- |
| `timeLeft` | [`Duration`](https://protobuf.dev/reference/protobuf/google.protobuf/#duration) | 連線將以 ABORTED 終止前的剩餘時間。此時間長度永遠不會小於模型專屬的最小值，該最小值會連同模型的速率限制一併說明。 |


### HistoryConfig {#HistoryConfig}

記錄設定。

此訊息包含在工作階段設定的 `BidiGenerateContentSetup.historyConfig` 中，用來設定記錄訊息的交換。


| Field | Type | Description |
| --- | --- | --- |
| `initialHistoryInClientContent` | `bool` | 選用。若為 true，在傳送 `setupComplete` 後，伺服器會先等待並處理 `clientContent` 訊息，直到 `turnComplete` 為 `true` 為止。這段初始記錄不會觸發模型呼叫，且可以以角色 `MODEL` 結尾。在 `turnComplete` 為 `true` 後，用戶端可以透過 `realtimeInput` 開始即時對話。 |


### InteractionStatus {#BidiGenerateContentServerContent.InteractionStatus}

Live 工作階段的不同活動狀態。此欄位一律與 `turnComplete` 一同傳送，表示伺服器是否已完成所有處理。


| Value | Description |
| --- | --- |
| `INTERACTION_STATUS_UNSPECIFIED` | 未指定的互動狀態。 |
| `IN_PROGRESS` | 伺服器仍在積極處理使用者輸入或執行背景推理。後續可能還有更多模型輸出。 |
| `REQUIRES_ACTION` | 已淘汰：請改用 IDLE。 |
| `IDLE` | 伺服器已完成所有處理與背景推理。 |


### ProactivityConfig {#ProactivityConfig}

主動功能的設定。


| Field | Type | Description |
| --- | --- | --- |
| `proactiveAudio` | `bool` | 選用。若啟用，模型可以拒絕回應最後一個提示詞。例如，這讓模型能忽略離題的語音，或在使用者尚未提出要求時保持沉默。 |
| `proactiveVideo` | `bool` | 選用。若啟用，系統可能會在收到每張圖片時觸發一次生成。這需要啟用 `proactiveAudio`。生成速率取決於傳入圖片的速率，可能大幅增加成本。 |


### RealtimeInputConfig {#RealtimeInputConfig}

設定 `BidiGenerateContent` 中的即時輸入行為。


| Field | Type | Description |
| --- | --- | --- |
| `automaticActivityDetection` | [`AutomaticActivityDetection`](/api-reference/live/#RealtimeInputConfig.AutomaticActivityDetection) | 選用。若未設定，預設啟用自動活動偵測。若自動語音偵測停用，用戶端必須傳送活動訊號。 |
| `activityHandling` | [`ActivityHandling`](/api-reference/live/#ActivityHandling) | 選用。定義活動產生的效果。 |
| `turnCoverage` | [`TurnCoverage`](/api-reference/live/#RealtimeInputConfig.TurnCoverage) | 選用。定義哪些輸入會納入使用者的回合。 |
| `interimTranscriptTimestampEnabled` | `bool` | 選用。設定是否啟用暫時轉錄稿的時間戳記。 |


### SessionResumptionConfig {#SessionResumptionConfig}

工作階段恢復設定。

此訊息包含在工作階段設定的 `BidiGenerateContentSetup.sessionResumption` 中。若已設定，伺服器會傳送 `SessionResumptionUpdate` 訊息。


| Field | Type | Description |
| --- | --- | --- |
| `handle` | `string` | 先前工作階段的 handle。若未提供，則建立新的工作階段。工作階段 handle 來自先前連線中的 `SessionResumptionUpdate.token` 值。 |


### SessionResumptionUpdate {#SessionResumptionUpdate}

工作階段恢復狀態的更新。

僅在已設定 `BidiGenerateContentSetup.sessionResumption` 時傳送。


| Field | Type | Description |
| --- | --- | --- |
| `newHandle` | `string` | 代表可恢復狀態的新 handle。若 `resumable`=false，則為空。 |
| `resumable` | `bool` | 若目前工作階段在此時點可以恢復，則為 true。工作階段在某些時點無法恢復，例如模型正在執行函式呼叫或生成時。在這種狀態下恢復工作階段（使用先前的工作階段 token）會導致部分資料遺失。此時 `newHandle` 會為空，且 `resumable` 會為 false。 |


### SlidingWindow {#ContextWindowCompressionConfig.SlidingWindow}

SlidingWindow 方法的運作方式是捨棄上下文視窗開頭的內容。產生的上下文一律會從 USER 角色回合的開頭開始。系統指令與任何 `BidiGenerateContentSetup.prefixTurns` 一律會保留在結果的開頭。


| Field | Type | Description |
| --- | --- | --- |
| `targetTokens` | `int64` | 要保留的目標 token 數量。預設值為 trigger_tokens/2。捨棄上下文視窗的部分內容會造成暫時的延遲增加，因此此值應經過校準，避免頻繁的壓縮操作。 |


### StartSensitivity {#RealtimeInputConfig.AutomaticActivityDetection.StartSensitivity}

決定語音開始的偵測方式。


| Value | Description |
| --- | --- |
| `START_SENSITIVITY_UNSPECIFIED` | 預設值為 START_SENSITIVITY_HIGH。 |
| `START_SENSITIVITY_HIGH` | 自動偵測較常偵測到語音開始。 |
| `START_SENSITIVITY_LOW` | 自動偵測較少偵測到語音開始。 |


### TurnCoverage {#RealtimeInputConfig.TurnCoverage}

關於哪些輸入會納入使用者回合的選項。


| Value | Description |
| --- | --- |
| `TURN_COVERAGE_UNSPECIFIED` | 若未指定，會依模型選取預設行為。例如，Gemini 2.5 的預設值為 `TURN_INCLUDES_ONLY_ACTIVITY`，而 Gemini 3.1 起則為 `TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO`。 |
| `TURN_INCLUDES_ONLY_ACTIVITY` | 包含自上一個回合以來的活動，排除非活動（例如音訊串流上的靜音）。 |
| `TURN_INCLUDES_ALL_INPUT` | 包含自上一個回合以來的所有即時輸入，包括非活動（例如音訊串流上的靜音）。 |
| `TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO` | 包含自上一個回合以來的音訊活動與所有影片。在自動活動偵測下，音訊活動指的是語音，排除靜音。 |


### TranslationConfig {#TranslationConfig}

翻譯功能的設定。


| Field | Type | Description |
| --- | --- | --- |
| `targetLanguageCode` | `string` | 必要。翻譯的目標語言。支援的值為 BCP-47 語言代碼（例如 "en"、"es"、"fr"）。 |
| `echoTargetLanguage` | `bool` | 選用。若為 true，當有人說出目標語言時，模型會生成音訊，實質上等於覆述輸入。若為 false，則不會為目標語言產生音訊。 |


### UrlContextMetadata {#UrlContextMetadata}

與 url 上下文擷取工具相關的中繼資料。


| Field | Type | Description |
| --- | --- | --- |
| `urlMetadata[]` | [`UrlMetadata`](/api-reference/generate-content/) | url 上下文清單。 |


### UsageMetadata {#UsageMetadata}

回應的使用中繼資料。


| Field | Type | Description |
| --- | --- | --- |
| `promptTokenCount` | `int32` | 僅輸出。提示詞中的 token 數量。當設定了 `cachedContent` 時，這仍是提示詞的總有效大小，也就是包含快取內容中的 token 數量。 |
| `cachedContentTokenCount` | `int32` | 提示詞快取部分（快取內容）中的 token 數量 |
| `responseTokenCount` | `int32` | 僅輸出。所有生成的回應候選的 token 總數。 |
| `toolUsePromptTokenCount` | `int32` | 僅輸出。工具使用提示詞中存在的 token 數量。 |
| `thoughtsTokenCount` | `int32` | 僅輸出。思考模型思考內容的 token 數量。 |
| `totalTokenCount` | `int32` | 僅輸出。生成要求的 token 總數（提示詞＋回應候選）。 |
| `promptTokensDetails[]` | [`ModalityTokenCount`](/api-reference/generate-content/#Resource:ModalityTokenCount) | 僅輸出。要求輸入中所處理的模態清單。 |
| `cacheTokensDetails[]` | [`ModalityTokenCount`](/api-reference/generate-content/#Resource:ModalityTokenCount) | 僅輸出。要求輸入中快取內容的模態清單。 |
| `responseTokensDetails[]` | [`ModalityTokenCount`](/api-reference/generate-content/#Resource:ModalityTokenCount) | 僅輸出。回應中所回傳的模態清單。 |
| `toolUsePromptTokensDetails[]` | [`ModalityTokenCount`](/api-reference/generate-content/#Resource:ModalityTokenCount) | 僅輸出。工具使用要求輸入中所處理的模態清單。 |


### VoiceActivity {#VoiceActivity}

在音訊串流中偵測到的語音活動。


| Field | Type | Description |
| --- | --- | --- |
| `type` | [`Type`](/api-reference/live/#VoiceActivity.Type) | 僅輸出。VAD（語音活動偵測）訊號的類型。 |
| `audioOffset` | [`Duration`](https://protobuf.dev/reference/protobuf/google.protobuf/#duration) | 僅輸出。在音訊時間中偵測到語音活動的時間，相對於音訊串流的開頭。 |


### Type {#VoiceActivity.Type}

VAD 訊號的類型。


| Value | Description |
| --- | --- |
| `TYPE_UNSPECIFIED` | 預設值為 UNSPECIFIED。 |
| `ACTIVITY_START` | 句子開始訊號。 |
| `ACTIVITY_END` | 句子結束訊號。 |


## 臨時驗證 token {#ephemeral-auth-tokens}

臨時驗證 token 可以呼叫 `AuthTokenService.CreateToken` 取得，然後用於 `GenerativeService.BidiGenerateContentConstrained`：可以將 token 以 `access_token` 查詢參數傳入，或放在 HTTP `Authorization` 標頭中，並在 token 前加上「`Token `」前綴。

### CreateAuthTokenRequest {#CreateAuthTokenRequest}

建立臨時驗證 token。


| Field | Type | Description |
| --- | --- | --- |
| `authToken` | [`AuthToken`](/api-reference/live/#AuthToken) | 必要。要建立的 token。 |


### AuthToken {#AuthToken}

建立臨時驗證 token 的要求。


| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | 僅輸出。識別碼。token 本身。 |
| `expireTime` | [`Timestamp`](https://protobuf.dev/reference/protobuf/google.protobuf/#timestamp) | 選用。僅輸入。不可變。選用的時間；超過此時間後，使用產生的 token 時，BidiGenerateContent 工作階段中的訊息會被拒絕。（Gemini 可能會在此時間後預先關閉工作階段。）若未設定，預設為 30 分鐘後。若有設定，此值必須小於未來 20 小時。 |
| `newSessionExpireTime` | [`Timestamp`](https://protobuf.dev/reference/protobuf/google.protobuf/#timestamp) | 選用。僅輸入。不可變。超過此時間後，使用此要求產生的 token 建立的新 Live API 工作階段會被拒絕。若未設定，預設為 60 秒後。若有設定，此值必須小於未來 20 小時。 |
| `fieldMask` | [`FieldMask`](https://protobuf.dev/reference/protobuf/google.protobuf/#field-mask) | 選用。僅輸入。不可變。若 field_mask 為空，且 `bidiGenerateContentSetup` 不存在，則有效的 `BidiGenerateContentSetup` 訊息取自 Live API 連線。若 field_mask 為空，且 `bidiGenerateContentSetup` *確實* 存在，則有效的 `BidiGenerateContentSetup` 訊息完全取自此要求中的 `bidiGenerateContentSetup`，Live API 連線的設定訊息會被忽略。若 field_mask 不為空，則 `bidiGenerateContentSetup` 中的對應欄位會覆寫 Live API 連線設定訊息中的欄位。 |


聯集欄位 `config`。產生的 token 所專屬的方法設定。`config` 只能是下列其中一項：


| Field | Type | Description |
| --- | --- | --- |
| `bidiGenerateContentSetup` | [`BidiGenerateContentSetup`](/api-reference/live/#BidiGenerateContentSetup) | 選用。僅輸入。不可變。`BidiGenerateContent` 專屬的設定。 |
| `uses` | `int32` | 選用。僅輸入。不可變。token 可使用的次數。若此值為零，則不設上限。恢復 Live API 工作階段不計為一次使用。若未指定，預設值為 1。 |


## 常見類型詳細資訊 {#more-info}

常用 API 資源類型 `Blob`、`Content`、`FunctionCall`、`FunctionResponse`、`GenerationConfig`、`GroundingMetadata`、`ModalityTokenCount` 與 `Tool` 的詳細資訊，請參閱
[生成內容](/api-reference/generate-content/)。
