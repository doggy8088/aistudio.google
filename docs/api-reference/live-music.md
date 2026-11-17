# Live Music API - WebSockets API 參考文件


!!! note " "

      **Preview:** Live Music API 目前為預覽版。


Lyria RealTime 音樂生成使用 [WebSockets](https://en.wikipedia.org/wiki/WebSocket) 建立持續、雙向、低延遲的串流連線。本節提供 WebSockets API 的進一步細節。

## 方法 {#methods}


| Method | Endpoint |
| --- | --- |
| [啟動 Live Music 工作階段](/api-reference/live-music/bidi-generate-music/) | `WSS` `/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateMusic` 開啟 WebSocket 工作階段，依你的提示詞與播放控制即時串流生成的音樂。 |


## 資料模型 {#data-models}

### AudioChunk {#AudioChunk}

音訊區塊的表示方式。

聯集欄位 `content`。`content` 只能是下列其中一項：


| Field | Type | Description |
| --- | --- | --- |
| `data` | `bytes` | 音訊區塊的原始位元組。 |
| `mimeType` | `string` | 音訊區塊內容的 MIME 類型，例如 "audio/wav"。 |
| `sourceMetadata` | [`SourceMetadata`](/api-reference/live-music/#AudioChunk.SourceMetadata) | 僅輸出。用於生成此音訊區塊的提示詞與設定。 |


### SourceMetadata {#AudioChunk.SourceMetadata}

用於生成此音訊區塊的輸入來源中繼資料。


| Field | Type | Description |
| --- | --- | --- |
| `clientContent` | [`BidiGenerateMusicClientContent`](/api-reference/live-music/#BidiGenerateMusicClientContent) | 用於生成此音訊區塊的加權提示詞。 |
| `musicGenerationConfig` | [`BidiGenerateMusicGenerationConfig`](/api-reference/live-music/#BidiGenerateMusicGenerationConfig) | 用於生成此音訊區塊的音樂生成設定。 |


### BidiGenerateMusicClientContent {#BidiGenerateMusicClientContent}

使用者用來啟動或引導音樂的輸入。


| Field | Type | Description |
| --- | --- | --- |
| `weightedPrompts[]` | [`WeightedPrompt`](/api-reference/live-music/#WeightedPrompt) | 必要。作為模型輸入的加權提示詞。 |


### BidiGenerateMusicClientMessage {#BidiGenerateMusicClientMessage}

用戶端在 BidiGenerateMusic 呼叫中傳送的訊息。

聯集欄位 `messageType`。`messageType` 只能是下列其中一項：


| Field | Type | Description |
| --- | --- | --- |
| `setup` | [`BidiGenerateMusicSetup`](/api-reference/live-music/#BidiGenerateMusicSetup) | 選用。在第一則（且僅第一則）用戶端訊息中傳送的工作階段設定。 |
| `clientContent` | [`BidiGenerateMusicClientContent`](/api-reference/live-music/#BidiGenerateMusicClientContent) | 選用。作為音樂生成輸入的加權提示詞與音樂生成設定。 |
| `musicGenerationConfig` | [`BidiGenerateMusicGenerationConfig`](/api-reference/live-music/#BidiGenerateMusicGenerationConfig) | 選用。音樂生成的設定。 |
| `playbackControl` | [`BidiGenerateMusicPlaybackControl`](/api-reference/live-music/#BidiGenerateMusicPlaybackControl) | 選用。音樂生成的播放控制訊號。 |


### BidiGenerateMusicFilteredPrompt {#BidiGenerateMusicFilteredPrompt}

被篩除的提示詞及其原因。


| Field | Type | Description |
| --- | --- | --- |
| `filteredReason` | `string` | 僅輸出。提示詞被篩除的原因。 |


聯集欄位 `prompt`。被篩除的提示詞。`prompt` 只能是下列其中一項：


| Field | Type | Description |
| --- | --- | --- |
| `text` | `string` | 選用。文字提示詞。 |


### BidiGenerateMusicGenerationConfig {#BidiGenerateMusicGenerationConfig}

音樂生成的設定。


| Field | Type | Description |
| --- | --- | --- |
| `temperature` | `float` | 選用。控制音訊生成的變異程度。值越高，變異越大。範圍為 [0.0, 3.0]。預設值為 1.1。 |
| `topK` | `int32` | 選用。控制模型如何選取輸出的權杖。從機率最高的 topK 個權杖中取樣。範圍為 [1, 1000]。預設值為 40。 |
| `seed` | `int32` | 選用。音訊生成的種子。若未設定，要求會使用隨機產生的種子。 |
| `guidance` | `float` | 選用。控制模型遵循提示詞的緊密程度。guidance 越高，遵循程度越高，但段落轉換會更為突兀。範圍為 [0.0, 6.0]。預設值為 4.0。 |
| `bpm` | `int32` | 選用。每分鐘節拍數。範圍為 [60, 200]。 |
| `density` | `float` | 選用。聲音的密度。範圍為 [0.0, 1.0]。 |
| `brightness` | `float` | 選用。值越高，音訊越明亮。範圍為 [0.0, 1.0]。 |
| `scale` | [`Scale`](/api-reference/live-music/#BidiGenerateMusicGenerationConfig.Scale) | 選用。生成音樂的音階。 |
| `muteBass` | `bool` | 選用。音訊輸出不應包含貝斯。 |
| `muteDrums` | `bool` | 選用。音訊輸出不應包含鼓聲。 |
| `onlyBassAndDrums` | `bool` | 選用。音訊輸出應僅包含貝斯與鼓聲。 |
| `musicGenerationMode` | [`MusicGenerationMode`](/api-reference/live-music/#BidiGenerateMusicGenerationConfig.MusicGenerationMode) | 選用。音樂生成的模式。預設值為 QUALITY。 |


### MusicGenerationMode {#BidiGenerateMusicGenerationConfig.MusicGenerationMode}


| Value | Description |
| --- | --- |
| `MUSIC_GENERATION_MODE_UNSPECIFIED` | 此值不使用。 |
| `QUALITY` | 此模式會將文字提示詞引導至潛在空間中音樂品質較高的區域。 |
| `DIVERSITY` | 此模式會將文字提示詞引導至潛在空間中音樂多樣性較高的區域。 |
| `VOCALIZATION` | 此模式會將文字提示詞引導至潛在空間中較容易生成人聲音樂的區域。 |


### Scale {#BidiGenerateMusicGenerationConfig.Scale}

生成音樂的音階。


| Value | Description |
| --- | --- |
| `SCALE_UNSPECIFIED` | 預設值。此值不使用。 |
| `C_MAJOR_A_MINOR` | C 大調或 A 小調 |
| `D_FLAT_MAJOR_B_FLAT_MINOR` | 降 D 大調或降 B 小調 |
| `D_MAJOR_B_MINOR` | D 大調或 B 小調 |
| `E_FLAT_MAJOR_C_MINOR` | 降 E 大調或 C 小調 |
| `E_MAJOR_D_FLAT_MINOR` | E 大調或降 D 小調 |
| `F_MAJOR_D_MINOR` | F 大調或 D 小調 |
| `G_FLAT_MAJOR_E_FLAT_MINOR` | 降 G 大調或降 E 小調 |
| `G_MAJOR_E_MINOR` | G 大調或 E 小調 |
| `A_FLAT_MAJOR_F_MINOR` | 降 A 大調或 F 小調 |
| `A_MAJOR_G_FLAT_MINOR` | A 大調或降 G 小調 |
| `B_FLAT_MAJOR_G_MINOR` | 降 B 大調或 G 小調 |
| `B_MAJOR_A_FLAT_MINOR` | B 大調或降 A 小調 |


### BidiGenerateMusicPlaybackControl {#BidiGenerateMusicPlaybackControl}

音樂生成的播放控制。


| Value | Description |
| --- | --- |
| `PLAYBACK_CONTROL_UNSPECIFIED` | 此值不使用。 |
| `PLAY` | 開始生成音樂。 |
| `PAUSE` | 暫停音樂生成。使用 PLAY 可從目前位置繼續。 |
| `STOP` | 停止音樂生成並重設上下文（提示詞會保留）。使用 PLAY 可重新開始音樂生成。 |
| `RESET_CONTEXT` | 重設上下文（提示詞會保留），但不停止音樂生成。 |


### BidiGenerateMusicServerContent {#BidiGenerateMusicServerContent}

模型回應用戶端訊息所生成的增量伺服器更新。

內容會以最快速度生成，而非即時生成。用戶端可以選擇將內容緩衝後再即時播放。


| Field | Type | Description |
| --- | --- | --- |
| `audioChunks[]` | [`AudioChunk`](/api-reference/live-music/#AudioChunk) | 僅輸出。模型已生成的音訊區塊。 |


### BidiGenerateMusicServerMessage {#BidiGenerateMusicServerMessage}

BidiGenerateMusic 呼叫的回應訊息。

聯集欄位 `messageType`。訊息的類型。`messageType` 只能是下列其中一項：


| Field | Type | Description |
| --- | --- | --- |
| `setupComplete` | [`BidiGenerateMusicSetupComplete`](/api-reference/live-music/#BidiGenerateMusicSetupComplete) | 僅輸出。當設定完成時，回應用戶端的 `BidiGenerateMusicSetup` 訊息而傳送。 |
| `serverContent` | [`BidiGenerateMusicServerContent`](/api-reference/live-music/#BidiGenerateMusicServerContent) | 僅輸出。模型回應用戶端訊息所生成的內容。 |
| `filteredPrompt` | [`BidiGenerateMusicFilteredPrompt`](/api-reference/live-music/#BidiGenerateMusicFilteredPrompt) | 僅輸出。被篩除的提示詞及其原因。 |
| `warning` | `string` | 僅輸出。伺服器傳送的警告訊息。警告不會終止串流。 |


### BidiGenerateMusicSetup {#BidiGenerateMusicSetup}

要在第一則（且僅第一則）`BidiGenerateMusicClientMessage` 中傳送的訊息。

用戶端應等到收到 `BidiGenerateMusicSetupComplete` 訊息後，再傳送其他訊息。


| Field | Type | Description |
| --- | --- | --- |
| `model` | `string` | 必要。模型的資源名稱，作為所用模型的 ID。格式：`models/{model}` |


### BidiGenerateMusicSetupComplete {#BidiGenerateMusicSetupComplete}

回應用戶端的 `BidiGenerateMusicSetup` 訊息而傳送。

此類型沒有欄位。

### WeightedPrompt {#WeightedPrompt}

作為模型輸入的加權提示詞。


| Field | Type | Description |
| --- | --- | --- |
| `weight` | `float` | 必要。提示詞的權重。權重用來控制提示詞的相對重要性，權重越高越重要。此 BidiGenerateMusicClientContent 中所有 weighted_prompts 的權重不得全為 0，且會經過正規化。 |


聯集欄位 `prompt`。`prompt` 只能是下列其中一項：


| Field | Type | Description |
| --- | --- | --- |
| `text` | `string` | 文字提示詞。 |


## 類型詳細資訊 {#more-info}

API 所使用類型的詳細資訊，請參閱
[Python SDK](https://github.com/googleapis/python-genai/blob/main/google/genai/types.py)。
