# Gemini 3.8 Flash TTS

Gemini 3.8 Flash TTS（`gemini-3.8-flash-tts`）是 Google 的旗艦創意
文字轉語音模型，專為錄音室等級的語音逼真度、富有表現力的演繹、
道地的地區口音，以及穩固的長篇多回合穩定性而打造。

[在 Google AI Studio 中試用](https://aistudio.google.com?model=gemini-3.8-flash-tts)

## 總覽與功能 {#overview-and-capabilities}

Gemini 3.8 Flash TTS 為富有表現力的音訊生成樹立了新標竿：

*   **高音響逼真度與演繹細膩度**：提供豐富的情感幅度、
    自然的韻律，並精確遵循回合層級的 `style` 指示與
    行內人聲事件（`<laugh>`、`<sigh>`、`<short pause>`）。
*   **長篇多回合穩定性**：在長時間的對話與
    數分鐘的旁白中，維持一致的語音身分、
    音色、音量與環境音場，不發生語音漂移。
*   **道地的地區口音與發音**：支援地區口音
    與少數方言。
*   **完整的語音生態系支援**：與預建語音、
    擴充語音庫（`GET /v1beta/voices`）、自訂的
    [語音設計](/docs/voice-design/)角色、
    [語音複製](/docs/voice-replication/)（預設為持久儲存的語音，另可選用無狀態金鑰），以及
    [語音混音](/docs/voice-remixing/) 無縫搭配。你也可以在
    [Google AI Studio](https://aistudio.google.com/generate-speech) 中互動式地設計、複製與混製語音。

功能、提示最佳實務與程式碼範例的完整說明，請參閱[文字轉語音](/docs/speech-generation/)指南。


!!! note " "

      **必須使用 `v1beta`：** 這個模型使用的語音生成功能
      目前僅在 `v1beta` API 中提供。最新版的 Google Gen AI SDK 預設使用
      `v1`，因此在建立用戶端或呼叫 REST API 時，請將 API 版本設為 `v1beta`。請參閱
      [設定 API 版本](/docs/api-versions/#configure-api-version)。


## 如何選擇 TTS 模型 {#when-to-use-which-tts-model}

兩個 Gemini 3.8 TTS 模型共用相同的 API 結構定義與提示結構。請依你的工作負載選擇合適的模型：

| 功能／工作負載 | Gemini 3.8 Flash TTS（`gemini-3.8-flash-tts`） | Gemini 3.8 Flash-Lite TTS（`gemini-3.8-flash-lite-tts`） |
| :--- | :--- | :--- |
| **主要優勢** | 最高的語音逼真度、演繹細膩度與方言涵蓋範圍 | 高輸送量、低延遲與成本效益 |
| **最適合的使用情境** | 有聲書、錄音室旁白、複雜的多說話者對話、大量爆發式人聲演繹、困難發音、地區方言 | 大量生產、即時語音代理串聯、朗讀功能、語音複製、日常單一說話者生成 |
| **支援的語言** | 130 種語言 | 101 種語言 |
| **建議取代的模型** | 全新的旗艦創意層級 | `gemini-3.1-flash-tts-preview` |

## 遷移指南 {#migration-guide}

如果你要從 `gemini-3.1-flash-tts-preview` 或更早的 Gemini TTS
模型遷移，請依 Gemini 3.8 TTS 結構定義更新你的要求：

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


## gemini-3.8-flash-tts {#gemini-38-flash-tts}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-3.8-flash-tts` |
| 支援的資料類型 | **輸入** 文字 **輸出** 音訊 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 8,192 **輸出 token 上限** 16,384（Gemini API 服務上限） |
| 功能 | [**音訊生成**](/docs/speech-generation/) 支援 [**程式碼執行**](/docs/code-execution/) 不支援 [**上下文快取**](/docs/caching/) 不支援 [**檔案搜尋**](/docs/file-search/) 不支援 [**函式呼叫**](/docs/function-calling/) 不支援 [**使用 Google 地圖接地**](/docs/maps-grounding/) 不支援 [**使用 Google 搜尋接地**](/docs/google-search/) 不支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 不支援 [**推理**](/docs/thinking/) 不支援 [**網址上下文**](/docs/url-context/) 不支援 |
| 使用方式 | [**Batch API**](/docs/batch-api/) 支援 [**Flex 推論**](/docs/flex-inference/) 支援 [**Priority 推論**](/docs/priority-inference/) 支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | `gemini-3.8-flash-tts` |
| 最近更新 | 2026 年 9 月 |
| 定價 | [定價](/docs/pricing/#gemini-3.8-flash-tts) |


## 支援的語言 {#supported-languages}

`gemini-3.8-flash-tts` 會自動偵測輸入語言，並支援
**130 種以上語言**：

| Language | Language | Language |
| :--- | :--- | :--- |
| Acehnese (Arab script) | Greek | Nepali (individual language) |
| Afrikaans | Guarani | Nigerian Fulfulde |
| Akan | Gujarati | North Azerbaijani |
| Amharic | Haitian Creole | Northern Sotho |
| Armenian | Halh Mongolian | Northern Uzbek |
| Assamese | Hausa | Norwegian Bokmål |
| Awadhi | Hebrew | Norwegian Nynorsk |
| Balinese | Hindi | Nyanja |
| Bangla | Hungarian | Occitan |
| Banjar (Arab script) | Icelandic | Odia (individual language) |
| Banjar (Latn script) | Igbo | Pangasinan |
| Bashkir | Iloko | Persian (Afghanistan) |
| Basque | Indonesian | Polish |
| Belarusian | Iranian Persian | Portuguese |
| Bemba | Italian | Punjabi |
| Bhojpuri | Japanese | Romanian |
| Bosnian | Javanese | Russian |
| Buginese | Kabyle | Santali |
| Bulgarian | Kamba | Serbian |
| Burmese | Kannada | Sindhi |
| Cantonese | Kashmiri (Arab script) | Sinhala |
| Catalan | Kashmiri (Deva script) | Slovak |
| Cebuano | Kazakh | Slovenian |
| Central Kurdish | Khmer | Somali |
| Chhattisgarhi | Kikuyu | South Azerbaijani |
| Chinese (Hans script) | Kinyarwanda | Southern Pashto |
| Chinese (Hant script) | Kongo | Southern Sotho |
| Crimean Tatar | Korean | Spanish |
| Croatian | Kyrgyz | Standard Arabic (Arab script) |
| Czech | Lao | Standard Arabic (Latn script) |
| Danish | Latgalian | Standard Latvian |
| Dutch | Lingala | Standard Malay |
| Dyula | Lithuanian | Swahili (individual language) |
| Dzongkha | Luxembourgish | Swati |
| Egyptian Arabic | Macedonian | Swedish |
| English | Magahi | Tajik |
| Estonian | Maithili | Tamil |
| Filipino | Malayalam | Telugu |
| Finnish | Maltese | Thai |
| French | Manipuri | Tigrinya |
| Galician | Marathi | Tosk Albanian |
| Ganda | Minangkabau (Arab script) | Turkish |
| Georgian | Minangkabau (Latn script) | Uyghur |
| German | Mizo | Vietnamese |
