# Gemini 3.5 Transcribe

Gemini 3.5 Transcribe 是以 Gemini 音訊理解能力為基礎的語音轉文字模型。它提供低延遲、準確的轉錄功能，具備依語句偵測語言、說話者分離、單字層級時間戳記、智慧轉錄（包含語音編輯），以及自訂詞彙的語音偏置等能力。

[在 Google AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-3.5-transcribe)

## 文件 {#documentation}

Gemini 3.5 Transcribe 可將音訊檔案中的語音轉換為文字。它能自動偵測 85 種以上的語言、處理多語言混雜切換、辨識個別說話者、輸出單字層級的時間戳記，並透過自訂詞彙偏置來適應特定領域的術語。

非串流功能的完整說明請參閱[音訊轉錄](/docs/transcribe/)指南。如需透過 WebSocket 進行即時、低延遲的串流轉錄，請參閱使用 `gemini-3.5-transcribe-live` 的[即時轉錄](/docs/live-api/live-transcribe/)指南。詳細定價請參閱[定價頁面](/docs/pricing/#gemini-3.5-transcribe)。

## gemini-3.5-transcribe {#gemini-35-transcribe}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-3.5-transcribe` |
| 支援的資料類型 | **輸入** 音訊（最長 1 小時）**輸出** 文字、單字標註 |
| 音訊限制 | **單次音訊上限** 每個要求最長 1 小時（啟用說話者分離或單字層級時間戳記時，最長 30 分鐘） |
| 功能 | [**音訊轉錄**](/docs/transcribe/) 支援 [**說話者分離**](/docs/transcribe/#speaker-diarization) 支援 [**單字層級時間戳記**](/docs/transcribe/#word-timestamps) 支援 [**自訂詞彙**](/docs/transcribe/#custom-vocabulary) 支援 [**智慧轉錄**](/docs/transcribe/#transcription-modes) 支援 [**程式碼執行**](/docs/code-execution/) 不支援 [**上下文快取**](/docs/caching/) 不支援 [**檔案搜尋**](/docs/file-search/) 不支援 [**函式呼叫**](/docs/function-calling/) 不支援 [**圖片生成**](/docs/image-generation/) 不支援 [**推理**](/docs/thinking/) 不支援 |
| 使用方式 | [**Batch API**](/docs/batch-api/) 不支援 [**Flex 推論**](/docs/flex-inference/) 不支援 [**Priority 推論**](/docs/priority-inference/) 不支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | `gemini-3.5-transcribe`（單次） | `gemini-3.5-transcribe-live`（Live API） |
| 最近更新 | 2026 年 8 月 |
| 定價 | [Gemini 3.5 Transcribe](/docs/pricing/#gemini-3.5-transcribe) [Gemini 3.5 Transcribe Live](/docs/pricing/#gemini-3.5-transcribe-live) |


## 功能支援與限制 {#feature-support-and-limitations}

Gemini 3.5 Transcribe 的兩個端點支援下列功能：

| 功能 | 即時串流（`gemini-3.5-transcribe-live`） | 音訊檔案處理（`gemini-3.5-transcribe`） | 備註／限制 |
| :--- | :--- | :--- | :--- |
| **語言自動偵測** | 支援（85 種以上語言） | 支援（85 種以上語言） | 包含工作階段中途的語言混雜切換。 |
| **單字層級時間戳記** | 不支援 | 支援 | 會降低轉錄準確度。與自訂詞彙不相容。 |
| **自訂詞彙偏置** | 支援（最多 1,000 個詞彙） | 支援（最多 1,000 個詞彙） | 使用者通常以最多 100 個詞彙獲得最佳效果。與說話者分離及時間戳記不相容。 |
| **智慧聽寫與格式設定** | 支援 | 支援 | 包含去除填充詞、依意圖處理英數字元的格式設定，以及預設啟用的語音編輯。 |
| **語音編輯（`source_text`）** | 支援 | 支援 | 在 `SMART` 模式中預設啟用；支援選用的 `source_text`（最多 64 KiB），用於編輯既有文字。 |
| **說話者分離** | 不支援 | 支援（最多 8 位說話者） | 3 位以上說話者的歸屬判定仍屬實驗性質。與自訂詞彙不相容。 |
| **音訊長度上限** | 每個工作階段 10 分鐘。 | 最長 1 小時 | 啟用說話者分離或時間戳記等功能時，檔案處理限制為 30 分鐘。 |

## 支援的語言 {#supported-languages}

Gemini 3.5 Transcribe 支援下列語言及其 BCP-47 語言代碼：

| 語言 | BCP-47 代碼 | 語言 | BCP-47 代碼 |
| :--- | :--- | :--- | :--- |
| 南非荷蘭語 | `af-ZA` | 日語 | `ja-JP` |
| 阿姆哈拉語 | `am-ET` | 爪哇語 | `jv-ID` |
| 阿拉伯語（埃及） | `ar-EG` | 卡布佛得魯語 | `kea-CV` |
| 亞美尼亞語 | `hy-AM` | 康納達語 | `kn-IN` |
| 阿薩姆語 | `as-IN` | 哈薩克語 | `kk-KZ` |
| 亞塞拜然語 | `az-AZ` | 韓語 | `ko-KR` |
| 白俄羅斯語 | `be-BY` | 吉爾吉斯語 | `ky-KG` |
| 孟加拉語（孟加拉） | `bn-BD` | 拉脫維亞語 | `lv-LV` |
| 孟加拉語（印度） | `bn-IN` | 林加拉語 | `ln-CD` |
| 波士尼亞語 | `bs-BA` | 立陶宛語 | `lt-LT` |
| 保加利亞語 | `bg-BG` | 馬其頓語 | `mk-MK` |
| 保加利亞語（阿羅馬尼亞語） | `rup-BG` | 馬來語 | `ms-MY` |
| 緬甸語 | `my-MM` | 馬拉雅拉姆語 | `ml-IN` |
| 粵語（繁體） | `yue-Hant-HK` | 馬爾他語 | `mt-MT` |
| 加泰隆尼亞語 | `ca-ES` | 華語（簡體） | `cmn-Hans-CN` |
| 宿霧語 | `ceb` | 馬拉地語 | `mr-IN` |
| 中部高棉語 | `km-KH` | 蒙古語 | `mn-MN` |
| 克羅埃西亞語 | `hr-HR` | 尼泊爾語 | `ne-NP` |
| 捷克語 | `cs-CZ` | 挪威語 | `nb-NO` |
| 丹麥語 | `da-DK` | 奧里亞語 | `or-IN` |
| 荷蘭語 | `nl-NL` | 波蘭語 | `pl-PL` |
| 英語（英國） | `en-GB` | 葡萄牙語（巴西） | `pt-BR` |
| 英語（印度） | `en-IN` | 葡萄牙語（葡萄牙） | `pt-PT` |
| 英語（美國） | `en-US` | 旁遮普語 | `pa-IN` |
| 愛沙尼亞語 | `et-EE` | 旁遮普語（古木基文字） | `pa-Guru-IN` |
| 波斯語 | `fa-IR` | 羅馬尼亞語 | `ro-RO` |
| 菲律賓語 | `fil-PH` | 俄語 | `ru-RU` |
| 芬蘭語 | `fi-FI` | 塞爾維亞語 | `sr-RS` |
| 法語 | `fr-FR` | 信德語（阿拉伯文字） | `sd-Arab-IN` |
| 加利西亞語 | `gl-ES` | 斯洛伐克語 | `sk-SK` |
| 喬治亞語 | `ka-GE` | 斯洛維尼亞語 | `sl-SI` |
| 德語 | `de-DE` | 西班牙語（拉丁美洲） | `es-419` |
| 希臘語 | `el-GR` | 西班牙語（美國） | `es-US` |
| 古吉拉特語 | `gu-IN` | 斯瓦希里語（肯亞） | `sw-KE` |
| 豪薩語 | `ha-NG` | 瑞典語 | `sv-SE` |
| 希伯來語 | `he-IL` | 塔吉克語 | `tg-TJ` |
| 印地語 | `hi-IN` | 泰盧固語 | `te-IN` |
| 匈牙利語 | `hu-HU` | 泰語 | `th-TH` |
| 冰島語 | `is-IS` | 土耳其語 | `tr-TR` |
| 印度英語 | `en-IN` | 烏克蘭語 | `uk-UA` |
| 印尼語 | `id-ID` | 烏茲別克語 | `uz-UZ` |
| 義大利語 | `it-IT` | 越南語 | `vi-VN` |
