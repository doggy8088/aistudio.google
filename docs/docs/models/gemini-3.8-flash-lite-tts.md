# Gemini 3.8 Flash-Lite TTS

Gemini 3.8 Flash-Lite TTS（`gemini-3.8-flash-lite-tts`）是 Google 快速且具成本效益的主力文字轉語音模型，專為高輸送量的正式環境工作負載打造，用以取代 `gemini-3.1-flash-tts-preview`。

[在 Google AI Studio 中試用](https://aistudio.google.com?model=gemini-3.8-flash-lite-tts)

## 總覽與功能 {#overview-and-capabilities}

Gemini 3.8 Flash-Lite TTS 結合了低延遲與生動自然的語音表現：

*   **高輸送量效率**：針對大量生產、對話式語音代理的串聯、朗讀功能，以及各主要語言的日常單一說話者語音生成最佳化。
*   **可直接沿用的結構定義相容性**：與 `gemini-3.8-flash-tts` 共用完全相同的 API 結構定義與結構化提示格式，只需變更一個參數即可切換模型。
*   **完整的語音生態系支援**：支援預建語音、擴充語音庫（`GET /v1beta/voices`）、自訂的[語音設計](/docs/voice-design/)角色、[語音複製](/docs/voice-replication/)（預設為持久儲存的語音，另可選用無狀態金鑰），以及[語音混音](/docs/voice-remixing/)。你也可以在 [Google AI Studio](https://aistudio.google.com/generate-speech) 中互動式地設計、複製與混製語音。

功能、提示最佳實務與程式碼範例的完整說明，請參閱[文字轉語音](/docs/speech-generation/)指南。


!!! note " "

      **必須使用 `v1beta`：** 這個模型使用的語音生成功能
      目前僅在 `v1beta` API 中提供。最新版的 Google Gen AI SDK 預設使用
      `v1`，因此在建立用戶端或呼叫 REST API 時，請將 API 版本設為 `v1beta`。請參閱
      [設定 API 版本](/docs/api-versions/#configure-api-version)。


## 如何選擇 TTS 模型 {#when-to-use-which-tts-model}

兩個 Gemini 3.8 TTS 模型共用相同的 API 結構定義與提示結構。請依你的工作負載選擇合適的模型：

| 功能／工作負載 | Gemini 3.8 Flash-Lite TTS（`gemini-3.8-flash-lite-tts`） | Gemini 3.8 Flash TTS（`gemini-3.8-flash-tts`） |
| :--- | :--- | :--- |
| **主要優勢** | 高輸送量、低延遲與成本效益 | 最高的語音逼真度、演繹細膩度與方言涵蓋範圍 |
| **最適合的使用情境** | 大量生產、即時語音代理串聯、朗讀功能、語音複製、日常單一說話者生成 | 有聲書、錄音室旁白、複雜的多說話者對話、大量爆發式人聲演繹、困難發音、地區方言 |
| **支援的語言** | 101 種語言 | 130 種語言 |
| **建議取代的模型** | `gemini-3.1-flash-tts-preview` | 全新的旗艦創意層級 |

## 遷移指南 {#migration-guide}

如果你要從 `gemini-3.1-flash-tts-preview` 升級至
`gemini-3.8-flash-lite-tts`，請依 Gemini 3.8 TTS 結構定義更新你的要求：

1.  **將回合層級的指示移入 `speech_metadata`：** Gemini 3.8 TTS 會將
    輸入文字嚴格視為逐字稿。像
    `"Say cheerfully: Hello!"` 或 `"Speaker 1: Hello!"` 這類行內文字指示可能會被唸出來。
    請將持續性的表達指示（`style`）與說話者標籤
    （`speaker`）移入結構化中繼資料：
    *   **Interactions API：** 在每個文字內容區塊上附加一個註解，內容包含 `"type":
        "speech_metadata"`、`"speaker"` 與 `"style"`。
    *   **GenerateContent API：** 將 `"speech_metadata": {"speaker": "...",
        "style": "..."}` 附加至每個 `part`。

2.  **角括號行內標籤僅用於即時的人聲事件：** 將
    轉瞬即逝的非語音發聲與停頓，以角括號形式保留在逐字稿中
    （例如 `<laugh>`、`<sigh>`、`<cough>`、`<breath>` 或
    `<short pause>`）。耳語之類的表達風格則放入
    `speech_metadata.style`。
3.  **在多說話者要求中為每個回合指定 `speaker`：** 多說話者要求中的每個回合
    都必須明確包含 `speaker`，並將其置於 `speech_metadata` 中，且須與已設定的說話者之一相符。
4.  **預先以語音設計建立角色：** 以在
    [語音設計](/docs/voice-design/) 中建立的自訂語音，取代冗長的舊版 Audio
    Profile／Director's Notes 區塊，再將該 `voice_...` ID 帶入
    你的 TTS 要求中，並使用最少或空白的 `style` 字串。
5.  **留意單次要求預設輸出 WAV（`audio/wav`）：** 與
    `gemini-3.1-flash-tts-preview` 及更早的 TTS 模型不同（它們預設傳回
    無標頭的原始 PCM `audio/l16`），Gemini 3.8 TTS 在單次要求時預設傳回帶有
    標準 RIFF 標頭的 WAV 音訊（`audio/wav`／`AUDIO_WAV`）。
    *   如果你的程式碼先前會將原始 PCM 位元組包上 WAV 標頭（例如
        使用 Python 的 `wave` 模組或 `ffmpeg`），請移除手動加標頭的包裝，直接將傳回的位元組寫入 `.wav` 檔案。
    *   如果你的管線需要無標頭的原始 PCM、mu-law 或 A-law 音訊，
        請明確將 `response_format.mime_type` 設為 `"audio/l16"`、
        `"audio/mulaw"` 或 `"audio/alaw"`（例如在 Interactions API 中使用 `{"response_format":
        {"type": "audio", "mime_type": "audio/l16"}}`，
        或 `AUDIO_L16`、`AUDIO_MULAW` 或 `AUDIO_ALAW`（用於 `generateContent`）。
        請參閱
        [音訊輸出格式](/docs/speech-generation/#audio-output-formats)。


## gemini-3.8-flash-lite-tts {#gemini-38-flash-lite-tts}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-3.8-flash-lite-tts` |
| 支援的資料類型 | **輸入** 文字 **輸出** 音訊 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 8,192 **輸出 token 上限** 16,384（Gemini API 服務上限） |
| 功能 | [**音訊生成**](/docs/speech-generation/) 支援 [**程式碼執行**](/docs/code-execution/) 不支援 [**上下文快取**](/docs/caching/) 不支援 [**檔案搜尋**](/docs/file-search/) 不支援 [**函式呼叫**](/docs/function-calling/) 不支援 [**使用 Google 地圖接地**](/docs/maps-grounding/) 不支援 [**使用 Google 搜尋接地**](/docs/google-search/) 不支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 不支援 [**推理**](/docs/thinking/) 不支援 [**網址上下文**](/docs/url-context/) 不支援 |
| 使用方式 | [**Batch API**](/docs/batch-api/) 支援 [**Flex 推論**](/docs/flex-inference/) 支援 [**Priority 推論**](/docs/priority-inference/) 支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | `gemini-3.8-flash-lite-tts` |
| 最近更新 | 2026 年 9 月 |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-3.8-flash-lite-tts/#pricing)。 |


## 定價 {#pricing}


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.50（文字）至 2026 年 12 月 31 日止。$1.00（文字）自 2027 年 1 月 1 日起。 |
    | 輸出價格 | 免費 | $6.00（音訊）至 2026 年 12 月 31 日止。$12.00（音訊）自 2027 年 1 月 1 日起。相當於每 10 秒音訊 $0.0015 至 2026 年 12 月 31 日止。相當於每 10 秒音訊 $0.003 自 2027 年 1 月 1 日起。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "批次"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $0.25（文字）至 2026 年 12 月 31 日止。$0.50（文字）自 2027 年 1 月 1 日起。 |
    | 輸出價格 | 不提供 | $3.00（音訊）至 2026 年 12 月 31 日止。$6.00（音訊）自 2027 年 1 月 1 日起。相當於每 10 秒音訊 $0.00075 至 2026 年 12 月 31 日止。相當於每 10 秒音訊 $0.0015 自 2027 年 1 月 1 日起。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "彈性"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $0.25（文字）至 2026 年 12 月 31 日止。$0.50（文字）自 2027 年 1 月 1 日起。 |
    | 輸出價格 | 不提供 | $3.00（音訊）至 2026 年 12 月 31 日止。$6.00（音訊）自 2027 年 1 月 1 日起。相當於每 10 秒音訊 $0.00075 至 2026 年 12 月 31 日止。相當於每 10 秒音訊 $0.0015 自 2027 年 1 月 1 日起。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "優先"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.90（文字）至 2026 年 12 月 31 日止。$1.80（文字）自 2027 年 1 月 1 日起。 |
    | 輸出價格 | 免費 | $10.80（音訊）至 2026 年 12 月 31 日止。$21.60（音訊）自 2027 年 1 月 1 日起。相當於每 10 秒音訊 $0.0027 至 2026 年 12 月 31 日止。相當於每 10 秒音訊 $0.0054 自 2027 年 1 月 1 日起。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


* 音訊 token 以每秒音訊 25 tokens 計算。



## 支援的語言 {#supported-languages}

`gemini-3.8-flash-lite-tts` 會自動偵測輸入語言，並
支援 **100 種以上語言**：

| Language | Language | Language |
| :--- | :--- | :--- |
| Acehnese (Arab script) | German | Manipuri |
| Afrikaans | Greek | Marathi |
| Akan | Gujarati | Minangkabau (Arab script) |
| Amharic | Haitian Creole | Mizo |
| Armenian | Halh Mongolian | Nepali (individual language) |
| Assamese | Hausa | Nigerian Fulfulde |
| Awadhi | Hebrew | North Azerbaijani |
| Balinese | Hindi | Northern Sotho |
| Bangla | Hungarian | Northern Uzbek |
| Banjar (Latn script) | Icelandic | Norwegian Bokmål |
| Basque | Iloko | Norwegian Nynorsk |
| Belarusian | Indonesian | Nyanja |
| Bhojpuri | Iranian Persian | Odia (individual language) |
| Bosnian | Italian | Persian (Afghanistan) |
| Buginese | Japanese | Polish |
| Bulgarian | Javanese | Portuguese |
| Cantonese | Kamba | Punjabi |
| Catalan | Kannada | Romanian |
| Cebuano | Kashmiri (Arab script) | Russian |
| Central Kurdish | Kashmiri (Deva script) | Santali |
| Chhattisgarhi | Kazakh | Serbian |
| Chinese (Hans script) | Khmer | Sinhala |
| Chinese (Hant script) | Kikuyu | Slovak |
| Croatian | Kinyarwanda | South Azerbaijani |
| Czech | Kongo | Southern Pashto |
| Danish | Korean | Spanish |
| Dutch | Kyrgyz | Standard Arabic (Arab script) |
| Egyptian Arabic | Lao | Standard Arabic (Latn script) |
| English | Lingala | Standard Latvian |
| Estonian | Macedonian | Standard Malay |
| Filipino | Magahi | Tamil |
| French | Maithili | Telugu |
| Galician | Malayalam | Turkish |
| Ganda | Maltese | Vietnamese |
| Georgian | — | — |
