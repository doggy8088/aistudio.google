# Gemini 淘汰時程

本頁列出 Gemini API 中[穩定版（GA）](/docs/models/#stable)與[預覽版](/docs/models/#preview)模型，以及受管代理的已知淘汰時程。所謂「**淘汰**」，是指我們宣布不再支援某個模型，且該模型將於近期「**關閉**」。模型一旦「**關閉**」，即會完全停止運作，其端點也不再提供服務。

淘汰公告會發布在[版本說明](/docs/changelog/)頁面，而本頁會追蹤公告中最早的關閉日期。要為你的工作負載挑選升級目標，請參閱[選擇模型](/docs/choosing-a-model/#upgrade-paths)。已關閉的模型與代理，則分別列於 **Deprecated models** 與 **Deprecated agents** 區段之下。


!!! note " "

      注意：**表格中所列的關閉日期，為模型可能淘汰的*最早可能日期***。我們會提前通知使用者確切的關閉日期，確保能順利轉換至替代模型。


## Gemini 4 模型 {#gemini-4-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-4-neon` | 2026 年 11 月 18 日 | 尚未公布關閉日期 |  |
| `gemini-4-hydrogen` | 2026 年 11 月 12 日 | 尚未公布關閉日期 |  |
| `gemini-4-carbon` | 2026 年 11 月 10 日 | 尚未公布關閉日期 |  |
| `gemini-4-argon` | 2026 年 10 月 13 日 | 尚未公布關閉日期 |  |


## Gemini 3 模型 {#gemini-3-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-3.8-flash-tts` | 2026 年 9 月 22 日 | 尚未公布關閉日期 |  |
| `gemini-3.8-flash-lite-tts` | 2026 年 9 月 22 日 | 尚未公布關閉日期 |  |
| `gemini-3.8-live` | 2026 年 9 月 15 日 | 尚未公布關閉日期 |  |
| `gemini-3.8-live-extended-thinking` | 2026 年 9 月 15 日 | 尚未公布關閉日期 |  |
| `gemini-3.8-flash` | 2026 年 9 月 2 日 | 尚未公布關閉日期 |  |
| `gemini-3.7-flash` | 2026 年 8 月 13 日 | N/A | `gemini-3.8-flash`（`gemini-3.7-flash` 已無法在 Google AI Studio 中選用；端點並未關閉，API 要求會自動導向 `gemini-3.8-flash`） |
| `gemini-3.6-flash` | 2026 年 7 月 21 日 | 尚未公布關閉日期 |  |
| `gemini-3.5-flash-lite` | 2026 年 7 月 21 日 | 尚未公布關閉日期 |  |
| `gemini-3.5-flash` | 2026 年 5 月 19 日 | N/A | `gemini-3.6-flash`（`gemini-3.5-flash` 已無法在 Google AI Studio 中選用；端點並未關閉，API 要求會自動導向 `gemini-3.6-flash`） |
| `gemini-3.1-flash-lite` | 2026 年 5 月 7 日 | 2027 年 5 月 7 日 | `gemini-3.5-flash-lite` |


### 預覽模型 {#gemini-3-preview-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-3.1-flash-tts-preview` | 2026 年 2 月 26 日 | 2026 年 12 月 18 日 | `gemini-3.8-flash-tts` 或 `gemini-3.8-flash-lite-tts` |
| `gemini-3.1-pro-preview` | 2026 年 2 月 19 日 | 尚未公布關閉日期 |  |
| `gemini-3-flash-preview` | 2025 年 12 月 17 日 | 尚未公布關閉日期 | `gemini-3.6-flash` |


### 已淘汰模型 {#gemini-3-deprecated-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-3-pro-preview` | 2025 年 11 月 18 日 | 2026 年 3 月 9 日 | `gemini-3.1-pro-preview` |
| `gemini-3.1-flash-lite-preview` | 2026 年 3 月 3 日 | 2026 年 5 月 25 日 | `gemini-3.1-flash-lite` |


## Gemini 2.5 Pro 模型 {#gemini-2.5-pro-models}


!!! note " "

      `gemini-2.5-pro` 已淘汰，已無法在 Google AI Studio 中選用。透過 API 的存取僅限於過去曾實際使用過的既有使用者。自 2026 年 12 月 1 日起，所有傳送至 `gemini-2.5-pro` 的 API 要求將自動導向 [`gemini-3.8-flash`](/docs/models/gemini-3.8-flash/)，並依 [Gemini 3.8 Flash 費率](/docs/pricing/#gemini-3.8-flash) 計費。請在 2026 年 12 月 1 日之前，詳閱 [Gemini 3.8 Flash 遷移指南](/docs/whats-new-gemini-3.8/#migrate-to-gemini-3-8-flash) 中不相容的 API 變更。


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-2.5-pro` | 2025 年 6 月 17 日 | 2026 年 12 月 1 日 | `gemini-3.8-flash`（`gemini-2.5-pro` 已無法在 Google AI Studio 中選用；自 2026 年 12 月 1 日起，傳送至 `gemini-2.5-pro` 的 API 要求將自動導向 `gemini-3.8-flash`） |


### 已淘汰模型 {#gemini-2.5-pro-deprecated-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-2.5-computer-use-preview-10-2025` | 2025 年 10 月 7 日 | 2026 年 7 月 28 日 | `gemini-3.8-flash` |
| `gemini-2.5-pro-preview-03-25` | 2025 年 3 月 3 日 | 2025 年 12 月 2 日 | `gemini-3.8-flash` |
| `gemini-2.5-pro-preview-05-06` | 2025 年 5 月 6 日 | 2025 年 12 月 2 日 | `gemini-3.8-flash` |
| `gemini-2.5-pro-preview-06-05` | 2025 年 6 月 5 日 | 2025 年 12 月 2 日 | `gemini-3.8-flash` |


## Gemini 2.5 Flash 模型 {#gemini-2.5-flash-models}


!!! note " "

      `gemini-2.5-flash` 已淘汰，已無法在 Google AI Studio 中選用。自 2026 年 12 月 1 日起，所有傳送至 `gemini-2.5-flash` 的 API 要求將自動導向 [`gemini-3.5-flash-lite`](/docs/models/gemini-3.5-flash-lite/)，並依 [Gemini 3.5 Flash-Lite 費率](/docs/pricing/#gemini-3.5-flash-lite) 計費。請在 2026 年 12 月 1 日之前，詳閱 [Gemini 3.5 Flash-Lite 遷移指南](/docs/whats-new-gemini-3.6/#migrate-to-gemini-3-5-flash-lite) 中不相容的 API 變更。2.5 系列模型的存取僅限於過去曾實際使用過的使用者。`gemini-2.5-flash-lite` 並未淘汰，在另行通知之前仍可透過 API 使用。


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-2.5-flash` | 2025 年 6 月 17 日 | 2026 年 12 月 1 日 | `gemini-3.5-flash-lite`（`gemini-2.5-flash` 已無法在 Google AI Studio 中選用；自 2026 年 12 月 1 日起，傳送至 `gemini-2.5-flash` 的 API 要求將自動導向 `gemini-3.5-flash-lite`） |
| `gemini-2.5-flash-lite` | 2025 年 7 月 22 日 | 尚未公布關閉日期 |  |


### 已淘汰模型 {#gemini-2.5-flash-deprecated-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-2.5-flash-lite-preview-09-2025` | 2025 年 9 月 25 日 | 2026 年 3 月 31 日 | `gemini-3.1-flash-lite` |
| `gemini-2.5-flash-preview-05-20` | 2025 年 5 月 20 日 | 2025 年 11 月 18 日 | `gemini-3.6-flash` |
| `gemini-2.5-flash-preview-09-2025` | 2025 年 9 月 25 日 | 2026 年 2 月 17 日 | `gemini-3.6-flash` |


## Gemini 2.0 模型 {#gemini-2.0-models}

### 已淘汰模型 {#gemini-2.0-deprecated-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-2.0-flash` | 2025 年 2 月 5 日 | 2026 年 6 月 1 日 | `gemini-3.6-flash` |
| `gemini-2.0-flash-001` | 2025 年 2 月 5 日 | 2026 年 6 月 1 日 | `gemini-3.6-flash` |
| `gemini-2.0-flash-lite` | 2025 年 2 月 25 日 | 2026 年 6 月 1 日 | `gemini-3.1-flash-lite` |
| `gemini-2.0-flash-lite-001` | 2025 年 2 月 25 日 | 2026 年 6 月 1 日 | `gemini-3.1-flash-lite` |
| `gemini-2.0-flash-lite-preview` | 2025 年 2 月 5 日 | 2025 年 12 月 9 日 | `gemini-3.1-flash-lite` |
| `gemini-2.0-flash-lite-preview-02-05` | 2025 年 2 月 5 日 | 2025 年 12 月 9 日 | `gemini-3.1-flash-lite` |


## Live API 模型 {#live-api-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-3.8-live` | 2026 年 9 月 15 日 | 尚未公布關閉日期 |  |
| `gemini-3.8-live-extended-thinking` | 2026 年 9 月 15 日 | 尚未公布關閉日期 |  |
| `gemini-3.5-transcribe-live` | 2026 年 8 月 | 尚未公布關閉日期 |  |


### 預覽模型 {#live-api-preview-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-3.5-live-translate-preview` | 2026 年 6 月 | 尚未公布關閉日期 |  |
| `gemini-3.1-flash-live-preview` | 2026 年 3 月 11 日 | 尚未公布關閉日期 | `gemini-3.8-live` |
| `gemini-2.5-flash-native-audio-preview-12-2025` | 2025 年 12 月 12 日 | 2027 年 3 月 31 日 | `gemini-3.8-live` |


### 已淘汰模型 {#live-api-deprecated-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-live-2.5-flash-preview` | 2025 年 6 月 17 日 | 2025 年 12 月 9 日 | `gemini-3.8-live` |
| `gemini-2.0-flash-live-001` | 2025 年 4 月 9 日 | 2025 年 12 月 9 日 | `gemini-3.8-live` |


## 音訊模型 {#audio-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-3.5-transcribe` | 2026 年 8 月 | 尚未公布關閉日期 |  |


### 預覽模型 {#audio-preview-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-2.5-flash-preview-tts` | 2025 年 5 月 20 日 | 2026 年 12 月 18 日 | `gemini-3.8-flash-tts` 或 `gemini-3.8-flash-lite-tts` |
| `gemini-2.5-pro-preview-tts` | 2025 年 5 月 20 日 | 2026 年 12 月 18 日 | `gemini-3.8-flash-tts` 或 `gemini-3.8-flash-lite-tts` |


## 嵌入模型 {#embedding-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-embedding-2` | 2026 年 4 月 22 日 | 尚未公布關閉日期 |  |
| `gemini-embedding-001` | 2025 年 7 月 14 日 | 2028 年 5 月 14 日 | `gemini-embedding-2` |


### 已淘汰模型 {#embedding-deprecated-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-embedding-2-preview` | 2026 年 3 月 10 日 | 2026 年 11 月 6 日 | `gemini-embedding-2`（自 2026 年 11 月 6 日起，傳送至 `gemini-embedding-2-preview` 的 API 要求將導向 `gemini-embedding-2`） |
| `text-embedding-004` | 2024 年 4 月 9 日 | 2026 年 1 月 14 日 | `gemini-embedding-2` |
| `embedding-001` | 2024 年 4 月 9 日 | 2025 年 10 月 30 日 | `gemini-embedding-2` |
| `embedding-gecko-001` |  | 2025 年 10 月 30 日 | `gemini-embedding-2` |
| `gemini-embedding-exp` |  | 2025 年 10 月 30 日 | `gemini-embedding-2` |
| `gemini-embedding-exp-03-07` |  | 2025 年 10 月 30 日 | `gemini-embedding-2` |


## Nano Banana 模型 {#nano-banana-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-nano-banana-2.1` | 2026 年 10 月 6 日 | 尚未公布關閉日期 |  |
| `gemini-3.1-flash-lite-image` | 2026 年 6 月 30 日 | 尚未公布關閉日期 |  |
| `gemini-3.1-flash-image` | 2026 年 5 月 28 日 | 尚未公布關閉日期 | `gemini-nano-banana-2.1` |
| `gemini-3-pro-image` | 2026 年 5 月 28 日 | 尚未公布關閉日期 |  |
| `gemini-2.5-flash-image` | 2025 年 10 月 2 日 | 2027 年 3 月 15 日 | `gemini-3.1-flash-lite-image` |


### 已淘汰模型 {#nano-banana-deprecated-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-3.1-flash-image-preview` | 2026 年 2 月 26 日 | 2026 年 6 月 25 日 | `gemini-nano-banana-2.1` |
| `gemini-3-pro-image-preview` | 2025 年 11 月 20 日 | 2026 年 6 月 25 日 | `gemini-3-pro-image` |
| `gemini-2.5-flash-image-preview` | 2025 年 5 月 7 日 | 2026 年 1 月 15 日 | `gemini-nano-banana-2.1` |
| `gemini-2.0-flash-preview-image-generation` | 2025 年 5 月 7 日 | 2025 年 11 月 14 日 | `gemini-nano-banana-2.1` |


## Imagen 模型 {#imagen-models}

### 已淘汰模型 {#imagen-deprecated-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `imagen-4.0-generate-001` | 2025 年 6 月 24 日 | 2026 年 8 月 17 日 | `gemini-nano-banana-2.1` |
| `imagen-4.0-ultra-generate-001` | 2025 年 6 月 24 日 | 2026 年 8 月 17 日 | `gemini-nano-banana-2.1` |
| `imagen-4.0-fast-generate-001` | 2025 年 6 月 24 日 | 2026 年 8 月 17 日 | `gemini-nano-banana-2.1` |
| `imagen-4.0-generate-preview-06-06` | 2025 年 6 月 24 日 | 2026 年 2 月 17 日 | `gemini-nano-banana-2.1` |
| `imagen-4.0-ultra-generate-preview-06-06` | 2025 年 6 月 24 日 | 2026 年 2 月 17 日 | `gemini-nano-banana-2.1` |
| `imagen-3.0-generate-002` | 2025 年 2 月 6 日 | 2025 年 11 月 10 日 | `gemini-nano-banana-2.1` |


## Veo 模型 {#veo-models}

### 已淘汰模型 {#veo-deprecated-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `veo-3.1-lite-generate-preview` | 2026 年 3 月 31 日 | 2026 年 10 月 22 日 | `gemini-omni-1.2-flash` |
| `veo-3.1-generate-preview` | 2025 年 10 月 15 日 | 2026 年 10 月 22 日 | `gemini-omni-1.2-flash` |
| `veo-3.1-fast-generate-preview` | 2025 年 10 月 15 日 | 2026 年 10 月 22 日 | `gemini-omni-1.2-flash` |
| `veo-3.0-generate-001` | 2025 年 9 月 9 日 | 2026 年 6 月 30 日 | `gemini-omni-1.2-flash` 或 [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate) 上的 GA 模型 |
| `veo-3.0-fast-generate-001` | 2025 年 9 月 9 日 | 2026 年 6 月 30 日 | `gemini-omni-1.2-flash` 或 [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate) 上的 GA 模型 |
| `veo-2.0-generate-001` | 2025 年 4 月 9 日 | 2026 年 6 月 30 日 | `gemini-omni-1.2-flash` 或 [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate) 上的 GA 模型 |
| `veo-3.0-generate-preview` | 2025 年 7 月 31 日 | 2025 年 11 月 12 日 | `gemini-omni-1.2-flash` |
| `veo-3.0-fast-generate-preview` | 2025 年 7 月 31 日 | 2025 年 11 月 12 日 | `gemini-omni-1.2-flash` |


## Gemini Omni Flash 模型 {#gemini-omni-flash-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-omni-1.2-flash` | 2026 年 11 月 5 日 | 尚未公布關閉日期 |  |
| `gemini-omni-1.1-flash` | 2026 年 8 月 27 日 | 2026 年 12 月 3 日 | `gemini-omni-1.2-flash`（自 2026 年 12 月 3 日起，端點會自動將 API 要求導向 `gemini-omni-1.2-flash`） |


### 已淘汰模型 {#gemini-omni-flash-deprecated-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-omni-flash-preview` | 2026 年 6 月 30 日 | 2026 年 10 月 22 日 | `gemini-omni-1.2-flash` |


## Genie 模型 {#genie-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| [`genie-4`](/docs/models/genie-4/) | 2026 年 11 月 19 日 | 尚未公布關閉日期 |  |


## Lyria 模型 {#lyria-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `lyria-3.5` | 2026 年 9 月 3 日 | 尚未公布關閉日期 |  |


### 預覽模型 {#lyria-preview-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `lyria-3-clip-preview` | 2026 年 3 月 25 日 | 尚未公布關閉日期 |  |
| `lyria-3-pro-preview` | 2026 年 3 月 25 日 | 尚未公布關閉日期 | `lyria-3.5` |
| `lyria-realtime-exp` | 2025 年 5 月 20 日 | 尚未公布關閉日期 |  |


## 機器人模型 {#robotics-models}

### 預覽模型 {#robotics-preview-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-robotics-er-2-preview` | 2026 年 7 月 30 日 | 尚未公布關閉日期 |  |
| `gemini-robotics-er-2-streaming-preview` | 2026 年 7 月 30 日 | 尚未公布關閉日期 |  |


### 已淘汰模型 {#robotics-deprecated-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| `gemini-robotics-er-1.6-preview` | 2026 年 4 月 14 日 | 2026 年 8 月 31 日 | `gemini-robotics-er-2-preview` |
| `gemini-robotics-er-1.5-preview` | 2025 年 9 月 25 日 | 2026 年 4 月 30 日 | `gemini-robotics-er-2-preview` |


## Gemini Decision 模型 {#gemini-decision-models}


| 模型 | 發布日期 | 關閉日期 | 建議替代模型 |
| --- | --- | --- | --- |
| [`gemini-decision-1`](/docs/models/gemini-decision-1/) | 2026 年 11 月 11 日 | 尚未公布關閉日期 |  |


## 受管代理 {#managed-agents}

### 預覽代理 {#managed-agents-preview-agents}


| 代理 | 發布日期 | 關閉日期 | 建議替代代理 |
| --- | --- | --- | --- |
| `antigravity-preview-09-2026` | 2026 年 9 月 17 日 | 尚未公布關閉日期 |  |
| `deep-research-preview-04-2026` | 2026 年 4 月 21 日 | 尚未公布關閉日期 |  |
| `deep-research-max-preview-04-2026` | 2026 年 4 月 21 日 | 尚未公布關閉日期 |  |


### 已淘汰代理 {#managed-agents-deprecated-agents}


| 代理 | 發布日期 | 關閉日期 | 建議替代代理 |
| --- | --- | --- | --- |
| `deep-research-pro-preview-12-2025` | 2025 年 12 月 11 日 | 2026 年 10 月 23 日 | `deep-research-preview-04-2026` |
| `antigravity-preview-05-2026` | 2026 年 5 月 19 日 | 2026 年 10 月 5 日 | `antigravity-preview-09-2026` |
