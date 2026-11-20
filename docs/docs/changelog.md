# 更新日誌

本頁記錄 Gemini API 的更新內容。

## 2026 年 11 月 19 日 {#11-19-2026}

*   **Genie 4（`models/genie-4`）正式推出（GA）**：推出
    [Genie 4](/docs/models/genie-4/)（`models/genie-4`），於
    [Interactions API](/docs/genie/)（`v1beta`）上實現即時互動世界生成，串流可操控的
    `24 fps` `16:9` 影片，並同步 `48 kHz` 立體聲音訊，透過 WebRTC 與 WebSockets 傳輸。以文字、
    `16:9` 參考圖片或兩者播種世界，並以 `WASD`/方向鍵與工作階段中的文字事件即時操控。
    付費層級的[定價](/docs/pricing/#genie-4)為每 100 萬個輸入 tokens `$1.50`、每 100 萬個文字輸出
    tokens `$9.00`，以及每 100 萬個影片輸出 tokens `$17.50`（約 `~$0.10/sec`，含立體聲音訊）；請參閱
    [使用 Genie 4 生成互動世界](/docs/genie/)、[Genie 4 提示詞與控制指南](/docs/genie-prompting/)與
    [速率限制](/docs/rate-limits/#genie-4)。

*   **工具擷取（預覽版）**：Interactions API 現在可以搜尋你的工具程式庫，並按需載入函式結構描述，
    因此大型工具集不再需要在每次請求時完整傳送。以 `defer_loading: true` 標記工具，並加入
    `{"type": "tool_search"}` 工具，讓 Gemini 為你擷取結構描述，或設定 `execution: "client"`
    以執行你自己的擷取邏輯。遠端 MCP 伺服器也支援 `defer_loading`。

    工具擷取適用於 Gemini 3.6 及更新模型，包括所有 Gemini 4 模型，於 Interactions API 中使用。請參閱
    [工具擷取](/docs/tool-retrieval/)指南。


## 2026 年 11 月 18 日 {#11-18-2026}

*   **Gemini 4 Neon（`gemini-4-neon`）正式推出（GA）**：推出
    [Gemini 4 Neon](/docs/models/gemini-4-neon/)（`gemini-4-neon`），帶來
    前沿級智慧，端到端任務完成速度快，適用於複雜的軟體工程、知識工作與
    科學工作流程。付費層級的[定價](/docs/pricing/#gemini-4-neon)為每 100 萬個
    輸入 tokens $3.00、每 100 萬個輸出 tokens $15.00，`gemini-4-neon` 支援四種
    [思考等級](/docs/thinking/#understanding-thinking-levels)
    （`low`、`medium`、預設的 `high` 與 `xhigh`）、統一的 100 萬 tokens 上下文
    視窗，以及最高 100 萬 tokens 的長解碼。請參閱
    [Gemini 4 Neon 的新功能](/docs/whats-new-gemini-4-neon/)開始使用。

*   **多模態檔案處理與切片**：現在可以直接將 Microsoft Office 與
    OpenDocument 檔案（Word、PowerPoint 與 Excel）直接傳給 Gemini API，
    並在使用者提示詞與[函式回應](/docs/function-calling/#file-inspection-options)
    中切片文件、試算表、影片與音訊。指定頁碼範圍、工作表分頁、儲存格範圍、
    時間區間或內容圖層（例如頁面圖片、擷取的文字、公式或影片轉錄稿），
    只處理並支付你需要的內容。

    如需開始使用，請參閱[文件理解](/docs/document-processing/#customize-document-processing)、
    [影片理解](/docs/video-understanding/#customize-video-processing)
    與[音訊理解](/docs/audio/#clipping-intervals)。


## 2026 年 11 月 17 日 {#11-17-2026}

*   **Gemini 3.5 Transcribe 語音編輯**：
    [`gemini-3.5-transcribe`](/docs/models/gemini-3.5-transcribe/) 與
    `gemini-3.5-transcribe-live` 現已支援以語音驅動的方式編輯、改寫
    口述內容或既有文字（`source_text`）並設定其格式。請參閱
    [音訊轉錄](/docs/transcribe/#voice-editing)與
    [即時轉錄](/docs/live-api/live-transcribe/#voice-editing)指南。

## 2026 年 11 月 12 日 {#11-12-2026}

*   **Gemini 4 Hydrogen（`gemini-4-hydrogen`）正式推出（GA）**：推出
    [Gemini 4 Hydrogen](/docs/models/gemini-4-hydrogen/)（`gemini-4-hydrogen`），
    以速度與效率支援日常程式設計與代理工作流程，將尖端智慧帶給所有人。
    此模型提供免費層級，付費層級的[定價](/docs/pricing/#gemini-4-hydrogen)為每 100 萬個輸入 tokens $1.50、
    每 100 萬個輸出 tokens $7.50；`gemini-4-hydrogen` 新增第四個
    [`xhigh`](/docs/thinking/#understanding-thinking-levels) 思考等級，與既有的 `low`、
    `medium` 及預設的 `high` 並列，現已成為 Gemini Managed Agents 中
    [Antigravity agent](/docs/antigravity-agent/) 的預設模型。如需 API
    變更與從 Gemini 3.8 Flash 遷移的指引，請參閱
    [Gemini 4 Hydrogen 的新功能](/docs/whats-new-gemini-4-hydrogen/)。

## 2026 年 11 月 11 日 {#11-11-2026}

*   **Gemini Decision 1 與 Decisions API**：推出
    [Gemini Decision 1](/docs/models/gemini-decision-1/)（`gemini-decision-1`）與
    [Decisions API](/docs/decisions-api/)，能以零輸出 tokens，針對文字、圖片、音訊、影片與
    PDF 快速做出經過校準的二元、分類與評分量表決策。請查看[定價](/docs/pricing/#gemini-decision)
    與[速率限制](/docs/rate-limits/#gemini-decision)，或參閱
    [Decisions API 指南](/docs/decisions-api/)開始使用。

## 2026 年 11 月 10 日 {#11-10-2026}

*   **Gemini 4 Carbon（`gemini-4-carbon`）正式推出（GA）**：推出
    [Gemini 4 Carbon](/docs/models/gemini-4-carbon/)（`gemini-4-carbon`），這是我們
    能力最強的推理模型，專為長時間的代理程式設計、多模態知識工作、科學推理與網路安全防禦而打造，
    在 2026 年 11 月 30 日前提供優惠[定價](/docs/pricing/#gemini-4-carbon)：每 100 萬個
    輸入 tokens $2.00、每 100 萬個輸出 tokens $10.00。如需開始使用，請參閱
    [Gemini 4 Carbon 的新功能](/docs/whats-new-gemini-4-carbon/)。

## 2026 年 11 月 6 日 {#11-06-2026}

*   **Gemini Embedding 2 Preview 已淘汰**：
    [`gemini-embedding-2-preview`](/docs/models/gemini-embedding-2-preview/) 已
    [淘汰](/docs/deprecations/#embedding-deprecated-models)。自
    2026 年 11 月 6 日起，傳送至 `gemini-embedding-2-preview` 的 API 要求將改為導向
    [`gemini-embedding-2`](/docs/models/gemini-embedding-2/)，並按
    [Gemini Embedding 2 費率](/docs/pricing/#gemini-embedding-2)計費。請將您的
    模型字串更新為 `gemini-embedding-2`。`gemini-embedding-2` 採用相同的 API
    結構、定價與嵌入空間，因此無需變更其他程式碼，也無需重新建立向量索引。

## 2026 年 11 月 5 日 {#11-05-2026}

*   **Gemini Omni 1.2 Flash 正式推出（GA）**：推出
    [Gemini Omni 1.2 Flash](/docs/models/gemini-omni-flash/)
    （`gemini-omni-1.2-flash`），支援最長 15 秒的影片生成與
    對話式編輯（首尾影格插值為 3 至 10 秒、每輪影片延伸為 3 至 10 秒，總長度最長 30 秒），
    在最多 6 張參考圖片之間提升角色與主體的一致性，影片輸出
    [定價](/docs/pricing/#gemini-omni-1.2-flash)降低 30%（每 100 萬 tokens $12.00），且
    付費層級的[速率限制](/docs/rate-limits/#gemini-omni-flash-rate-limits)提高一倍。
    如需開始使用，請參閱 [Gemini Omni Flash 指南](/docs/omni/)。

*   **Gemini Omni 1.1 Flash 自動導向通知**：自 **2026 年 12 月 3 日**起，
    傳送至 `gemini-omni-1.1-flash` 的 API 要求將自動導向
    `gemini-omni-1.2-flash`，並按
    [Gemini Omni 1.2 Flash 費率](/docs/pricing/#gemini-omni-1.2-flash)計費。

*   **擴充 Office 與 OpenDocument 檔案支援**：Gemini API 現在
    可接受 PowerPoint 97-2003（PPT）、OpenDocument Presentation（ODP）與
    OpenDocument Spreadsheet（ODS）檔案作為輸入，並為 Word 97-2003（DOC）檔案新增頁面圖片
    處理。DOC、PPT 與 ODP 檔案會轉譯為頁面圖片；ODS 檔案則由模型接收第一個工作表中的資料與公式。
    DOCX、DOTX、ODT、PPTX、XLSX 與 XLS 的處理方式維持不變。如需各格式的處理方式，請參閱
    [Office 與 OpenDocument 檔案](/docs/document-processing/#office-documents)。

*   **函式回應支援更多檔案類型與檔案 URI**：工具現在
    可將 Office 與 OpenDocument 檔案、音訊與影片回傳給模型。

    *   **GenerateContent API**：函式回應部分除了圖片、PDF
        與純文字之外，現在也接受音訊、影片，以及 Office 與 OpenDocument 檔案。此外也接受 `fileData`，因此工具可回傳
        Files API URI，而非內嵌位元組。`displayName` 現在可用於
        `inlineData` 與 `fileData` 兩者，影片部分則接受
        `mediaProcessing`（`STATIC` 或 `AGENTIC`）。
    *   **Interactions API**：`function_result` 步驟現在接受 `document`、
        `audio` 與 `video` 內容區塊（除了既有的 `text` 與 `image` 之外），可透過內嵌 `data` 或 `uri` 提供。影片區塊可在 `v1beta` 與
        `v1alpha` 中使用，並接受 `processing`。

    詳情請參閱[多模態函式回應](/docs/function-calling/#multimodal)。


## 2026 年 11 月 4 日 {#11-04-2026}

*   **Gemini 3.8 TTS 的 Voice remixing**：推出
    [Voice remixing](/docs/voice-remixing/)，您可使用自然語言
    指令修改現有的預建語音或[設計語音](/docs/voice-design/)，建立新的獨立儲存語音。請使用
    `POST /v1beta/voices` 搭配 `gemini-3.8-flash-tts`（或在
    [Google AI Studio](https://aistudio.google.com/generate-speech) 中互動式混音）來產生
    `voice_...` ID，再使用
    [Gemini 3.8 Flash TTS](/docs/models/gemini-3.8-flash-tts/) 或
    [Gemini 3.8 Flash-Lite TTS](/docs/models/gemini-3.8-flash-lite-tts/) 合成语音。如需開始使用，請參閱
    [Voice remixing 指南](/docs/voice-remixing/)。

## 2026 年 11 月 2 日 {#11-02-2026}

*   **Gemini 2.5 Pro 已淘汰**：
    [`gemini-2.5-pro`](/docs/models/gemini-2.5-pro/) 已
    [淘汰](/docs/deprecations/#gemini-2.5-pro-models)，且無法再於
    Google AI Studio 中選取。自 2026 年 12 月 1 日起，所有傳送至 `gemini-2.5-pro` 的 API
    要求將自動導向
    [`gemini-3.8-flash`](/docs/models/gemini-3.8-flash/)，並按
    [Gemini 3.8 Flash 費率](/docs/pricing/#gemini-3.8-flash)計費。請在 2026 年 12 月 1 日
    之前，將模型字串更新為 `gemini-3.8-flash`，並查看
    [Gemini 3.8 Flash 遷移指南](/docs/whats-new-gemini-3.8/#migrate-to-gemini-3-8-flash)。
    破壞性 API 變更包括函式呼叫與 `thought_signature`
    驗證、`thinking_level` 取代 `thinking_budget`，以及移除
    取樣參數與預填的模型回合。
*   **Gemini 2.5 Flash 已淘汰**：
    [`gemini-2.5-flash`](/docs/models/gemini-2.5-flash/) 已
    [淘汰](/docs/deprecations/#gemini-2.5-flash-models)，且無法再於
    Google AI Studio 中選取。自 2026 年 12 月 1 日起，所有傳送至 `gemini-2.5-flash` 的 API
    要求將自動導向
    [`gemini-3.5-flash-lite`](/docs/models/gemini-3.5-flash-lite/)，並按
    [Gemini 3.5 Flash-Lite 費率](/docs/pricing/#gemini-3.5-flash-lite)計費。
    請在 2026 年 12 月 1 日之前，將模型字串更新為 `gemini-3.5-flash-lite`，
    並查看
    [Gemini 3.5 Flash-Lite 遷移指南](/docs/whats-new-gemini-3.6/#migrate-to-gemini-3-5-flash-lite)。
    破壞性 API 變更包括函式呼叫與 `thought_signature`
    驗證、`thinking_level` 取代 `thinking_budget`，以及移除
    取樣參數與預填的模型回合。

## 2026 年 10 月 30 日 {#10-30-2026}

*   **Computer Use 正式推出（GA）**：[Computer Use](/docs/computer-use/) 工具已在 Interactions 與 GenerateContent API 中正式推出（GA）。

## 2026 年 10 月 27 日 {#10-27-2026}

*   **Gemini API CLI（`gemini-api`）beta 版**：推出 [Gemini API
    CLI](/docs/cli/)（`gemini-api`），這是無狀態、零相依性的指令列
    用戶端，適用於 AI 程式設計代理、指令碼與 CI 管線。您可在
    [Interactions API](/docs/interactions-overview/) 上使用 `gemini-api` 來生成文字與
    媒體、分析檔案，並執行 [Gemini managed agents](/docs/agents/)。如需開始使用，請參閱
    [Gemini API CLI 指南](/docs/cli/)。

## 2026 年 10 月 26 日 {#10-26-2026}

*   **Generate Content API 儲存功能預設開啟**：在付費層級使用
    Generate Content API（`generateContent`、`streamGenerateContent` 與
    `batchGenerateContent`）的新專案，現在預設會儲存要求
    （`store=true`），與 Interactions API 一致。現有專案
    會保留目前的設定。如要退出，請在個別要求上設定 `store=false`，或在
    [Logs and Datasets](https://aistudio.google.com/logs) 資訊主頁的 **Settings** 面板中關閉 Generate Content API 記錄功能。詳情請參閱
    [Logs and datasets](/docs/logs-datasets/#configure-logging)。

## 2026 年 10 月 13 日 {#10-13-2026}

*   **Gemini 4 Argon（`gemini-4-argon`）正式推出（GA）**：推出
    [Gemini 4 Argon](/docs/models/gemini-4-argon/)（`gemini-4-argon`），這是我們
    能力最強的模型，專為複雜的程式設計、代理、數學與科學任務而打造。

    如需 API 變更、定價與遷移指引，請參閱
    [Gemini 4 Argon 的新功能](/docs/whats-new-gemini-4-argon/)。


## 2026 年 10 月 8 日 {#10-08-2026}

*   **Gemini 3.7 Flash 已淘汰**：
    [`gemini-3.7-flash`](/docs/whats-new-gemini-3.7/) 已淘汰，並由
    [`gemini-3.8-flash`](/docs/whats-new-gemini-3.8/) 取代。此模型已無法再於 Google AI Studio 中選取，傳送至
    `gemini-3.7-flash` 的 API 要求會自動導向 `gemini-3.8-flash`。請將您的模型字串更新為 `gemini-3.8-flash`，並查看
    [Gemini 3.8 Flash 指南](/docs/whats-new-gemini-3.8/)。

*   **Gemini 3.5 Flash 已淘汰**：
    [`gemini-3.5-flash`](/docs/whats-new-gemini-3.5/) 已淘汰，並由
    [`gemini-3.6-flash`](/docs/whats-new-gemini-3.6/) 取代。此模型已
    無法再於 Google AI Studio 中選取，傳送至
    `gemini-3.5-flash` 的 API 要求會自動導向 `gemini-3.6-flash`。請將您的模型字串更新為 `gemini-3.6-flash`（或
    [`gemini-3.8-flash`](/docs/whats-new-gemini-3.8/)），並查看
    [Gemini 3.6 Flash 指南](/docs/whats-new-gemini-3.6/)。

*   **Deep Research Agent `deep-research-pro-preview-12-2025` 已淘汰**：
    `deep-research-pro-preview-12-2025` 代理已淘汰，並將於 **2026 年 10 月 23 日**[關閉](/docs/deprecations/#managed-agents)。

    請將您的要求遷移至較新版本的 [Deep
    Research](/docs/deep-research/) 代理：

    *   [`deep-research-preview-04-2026`](/docs/models/deep-research-preview-04-2026/)：
        專為速度與效率而設計，適合串流回傳至用戶端
        UI。
    *   [`deep-research-max-preview-04-2026`](/docs/models/deep-research-max-preview-04-2026/)：
        提供最完整的自動化上下文蒐集與彙整能力。

    如要遷移，請將 `agent` 參數（在您的 `interactions.create`
    要求中）從 `deep-research-pro-preview-12-2025` 更新為
    `deep-research-preview-04-2026`（或 `deep-research-max-preview-04-2026`）。


## 2026 年 10 月 6 日 {#10-06-2026}

*   **Gemini Nano Banana 2.1 正式推出（GA）**：推出
    [Gemini Nano Banana 2.1](/docs/models/gemini-nano-banana-2.1/)
    （`gemini-nano-banana-2.1`），這是最新高效能圖片生成與
    對話式編輯模型。此模型為 Nano Banana 2
    （[`gemini-3.1-flash-image`](/docs/models/gemini-3.1-flash-image/)）的更新版本，
    在維持 Flash 等級速度與成本效率的同時，大幅提升
    視覺品質、提示詞遵循度、多輪角色一致性、文字轉譯，以及寬幅與全景長寬比生成
    （`1:4`、`4:1`、`1:8`、`8:1`），涵蓋 `1K`、`2K` 與 `4K` 解析度。

    如需開始使用，請參閱[圖片生成指南](/docs/image-generation/)。

*   **淘汰公告**：`gemini-3.1-flash-image` 模型已
    淘汰（尚未公布關閉日期）。請遷移至
    [`gemini-nano-banana-2.1`](/docs/models/gemini-nano-banana-2.1/)。


## 2026 年 9 月 22 日 {#09-22-2026}

*   **Gemini 3.8 Flash TTS 與 Gemini 3.8 Flash-Lite TTS 正式推出
    （GA）**：推出新一代文字轉語音（TTS）音訊模型與
    Gemini API Voices 端點（`/v1beta/voices`）：

    *   **[Gemini 3.8 Flash TTS](/docs/models/gemini-3.8-flash-tts/)
        （`gemini-3.8-flash-tts`）**：旗艦創意 TTS 模型，專為
        錄音室等級的語音逼真度、細膩的表演、地區方言與
        長篇多輪穩定性而設計。
    *   **[Gemini 3.8 Flash-Lite TTS](/docs/models/gemini-3.8-flash-lite-tts/)
        （`gemini-3.8-flash-lite-tts`）**：快速且具成本效益的 TTS 模型，旨在
        取代 `gemini-3.1-flash-tts-preview`，適用於高輸送量的正式環境
        與即時語音代理串連。
    *   **[Voice design](/docs/voice-design/)、
        [Voice replication](/docs/voice-replication/) 與
        [Extended Voice Library](/docs/speech-generation/#voice-library)**：
        透過文字提示詞建立持久的自訂聲音角色、經同意驗證後複製
        語音，並查詢 150 種以上的預建與自訂
        語音。

    如需開始使用，請參閱[文字轉語音指南](/docs/speech-generation/)。


## 2026 年 9 月 18 日 {#09-18-2026}

*   **Gemini 2.5 模型存取更新**：為確保所有人都能獲得可靠的效能，
    我們將 2.5 模型的存取權限限制為過去曾主動使用過這些模型的使用者。這些模型尚未淘汰，
    並將透過 API 持續提供服務，直到另行通知。任何新
    專案請使用我們的最新模型：3.5 Flash-Lite 或 3.8 Flash。這麼做
    有助於我們為持續中的舊版工作流程與
    新應用程式維持足夠的容量。

## 2026 年 9 月 17 日 {#09-17-2026}

*   **Antigravity Agent 09-2026**：推出 `antigravity-preview-09-2026`，
    取代並淘汰 `antigravity-preview-05-2026`。

    如果您在遠端沙箱（`environment: "remote"`）中執行，且只讀取
    `output_text` 或 `model_output` 步驟，只需更新代理字串，其他部分
    不會改變。

    如果您在本機執行工具（`local_environment`）或解析 `function_call`
    步驟，內建工具已變更。參數改用 PascalCase，而非
    snake_case；檔案編輯改用行範圍取代，而非完整
    重寫。

    | 功能 | 05-2026 | 09-2026 |
    | :--- | :--- | :--- |
    | 建立檔案 | `write_file(path, content)` | `write_to_file(TargetFile, CodeContent, Overwrite, Description)` |
    | 編輯檔案 | `write_file(path, content)`，完整重寫 | `replace_file_content(TargetFile, StartLine, EndLine, TargetContent, ReplacementContent)` |
    | 讀取檔案 | `read_file(path, offset, limit)`，位元組偏移 | `view_file(AbsolutePath, StartLine, EndLine, ContentOffset)` |
    | 目錄清單 | `list_files(path)` | `list_dir(DirectoryPath)` |
    | 檔案與程式碼搜尋 | 無，代理使用 shell 指令 | `find_by_name(SearchDirectory, Pattern, MaxDepth)` 與 `grep_search(SearchPath, Query, IsRegex)` |
    | Shell 執行 | `code_execution(command, timeout_seconds)` | 未變更 |
    | 網頁搜尋 | `google_search(queries)` | 未變更 |

    請參閱 [Antigravity Agent](/docs/antigravity-agent/) 指南。
    `antigravity-preview-05-2026` 將於 2026 年 10 月 5 日關閉，詳情記錄於
    [淘汰](/docs/deprecations/#managed-agents)頁面。


## 2026 年 9 月 15 日 {#09-15-2026}

*   **Gemini 3.8 Live 與 Gemini 3.8 Live Extended Thinking 正式推出
    （GA）**：推出新一代 Live API 模型，適用於即時
    多模態對話與代理工具使用：

    *   **[Gemini 3.8 Live](/docs/models/gemini-3.8-live/)（`gemini-3.8-live`）**：
        專為次秒級對話延遲而設計，具備原生音訊
        理解、情感對話、主動音訊，以及
        同步／非同步函式呼叫。
    *   **[Gemini 3.8 Live Extended Thinking](/docs/models/gemini-3.8-live-extended-thinking/)
        （`gemini-3.8-live-extended-thinking`）**：專為複雜
        推理、多步驟規劃與長時間狀態追蹤而設計，具備
        可設定的思考等級（`MINIMAL`、`LOW`、`MEDIUM`、`HIGH`）與
        非同步函式呼叫。

    如需開始使用，請參閱
    [Live API 中的思考指南](/docs/live-api/thinking/) 與
    [Live API 總覽](/docs/live-api/)。


## 2026 年 9 月 3 日 {#09-03-2026}

*   **Lyria 3.5 正式推出（GA）**：推出新一代
    Google 音樂生成模型：

    *   [`lyria-3.5`](/docs/models/lyria-3.5/)：
        完整長度歌曲生成，具備更佳的音樂連貫性、自然
        人聲，以及精細的長度與結構控制。

    此模型支援文字與圖片輸入，可生成高逼真度的 44.1
    kHz 立體聲音訊。詳情與程式碼範例請參閱[音樂生成](/docs/music-generation/)
    指南。


## 2026 年 9 月 2 日 {#09-02-2026}

*   **Gemini 3.8 Flash 正式推出（GA）**：推出 `gemini-3.8-flash`，
    這是我們最智慧的 Flash 模型，專為長時間軟體
    工程、自主代理與複雜的企業工作流程而設計。

    如需開始使用，請參閱 [Gemini 3.8 Flash](/docs/models/gemini-3.8-flash/)
    模型頁面與 [Gemini 3.8 Flash 指南](/docs/whats-new-gemini-3.8/)。


## 2026 年 9 月 1 日 {#09-01-2026}

*   **代理式影片理解**：為
    Gemini 3.7 Flash、3.6 Flash 與 3.5 Flash-Lite 在 Interactions 與
    GenerateContent API 中推出代理式影片理解。模型會動態瀏覽影片時間軸，
    依需求請求逐字稿、影格或音軌。與靜態
    處理相比，這種方式在長篇內容上最多可減少 88% 的 token 用量。

    如需開始使用，請參閱[代理式影片
    理解](/docs/video-understanding/#agentic-video-understanding)指南。


## 2026 年 8 月 27 日 {#08-27-2026}

*   **Gemini Omni Flash 正式推出（GA）**：推出
    `gemini-omni-1.1-flash`，這是我們快速、對話式影片
    生成與編輯模型的 GA 版本。此版本包含多項重要的新
    功能：

    *   **影片延伸**：使用 `extend` 任務或直接
        以提示詞在片段結尾生成接續內容，無縫延伸現有影片。
    *   **插值（首影格＋末影格）**：使用 `image_to_video` 任務搭配最多 2 張圖片，生成在兩張圖片之間轉場的影片。
    *   **解析度控制**：新的 `resolution` 參數（位於 `video_config` 中）
        支援 `360p`、`720p`（預設）、`1080p` 與 `4k` 輸出。
        1080p 與 4K 輸出是透過放大處理生成的。

    現有的 `gemini-omni-flash-preview` 端點將於
    2026 年 9 月 30 日淘汰。

    如需開始使用，請參閱 [Gemini Omni Flash](/docs/models/gemini-omni-flash/)
    模型頁面與 [omni 指南](/docs/omni/)。


## 2026 年 8 月 26 日 {#08-26-2026}

*   **Gemini 3.5 Transcribe 正式推出（GA）**：推出兩款專用的
    語音轉文字模型，奠基於 Gemini 的音訊理解能力：

    *   **Gemini 3.5 Transcribe**（`gemini-3.5-transcribe`）：高準確度、
        低延遲的非串流語音轉文字，具備以語句為基礎的語言
        偵測（涵蓋 80 多種語言）、說話者分離、單字層級
        時間戳記，以及自訂詞彙偏置（最多 1,000 個詞彙）。
    *   **Gemini 3.5 Transcribe Live**（`gemini-3.5-transcribe-live`）：
        透過 WebSocket 使用 Live API 的低延遲、雙向串流語音轉文字，
        支援暫時與最終轉錄
        事件、Smart transcription 模式，以及多種 Voice Activity Detection
        （VAD）策略。

    如需開始使用，請參閱[音訊轉錄指南](/docs/transcribe/)、
    [即時轉錄指南](/docs/live-api/live-transcribe/) 與
    [Gemini 3.5 Transcribe 模型頁面](/docs/models/gemini-3.5-transcribe/)。


## 2026 年 8 月 13 日 {#08-13-2026}

*   **Gemini 3.7 Flash 正式推出（GA）**：推出我們至今最智慧的
    主力模型，適用於程式設計與代理：

    *   **Gemini 3.7 Flash**（`gemini-3.7-flash`）：在
        軟體工程、網頁開發與代理工作流程方面大幅提升，
        在 2026 年 12 月 31 日前提供優惠定價。

    如需開始使用，請參閱 [Gemini 3.7 Flash](/docs/models/gemini-3.7-flash/)
    模型頁面與[最新模型指南](/docs/latest-model/)。


## 2026 年 7 月 30 日 {#07-30-2026}

*   **Gemini Robotics ER 2 公開預覽**：推出兩款新的具身
    推理模型端點，適用於機器人技術：

    *   `gemini-robotics-er-2-preview`：進階空間推理、代理式程式碼
        執行、多步驟工具編排、影片時刻搜尋、進度
        分類與多機器人協調。
    *   `gemini-robotics-er-2-streaming-preview`：使用 Live API 最佳化的即時文字
        串流，可實現具備雙向音訊與影片輸入的低延遲機器人代理。

    兩個模型端點都接受文字、圖片、影片與音訊輸入，並支援
    具備實體機器人動作阻斷行為的函式呼叫。如需
    開始使用，請參閱 [Gemini Robotics ER 總覽](/docs/robotics-overview/)。
    如需即時串流使用情境，請參閱[使用
    串流的機器人技術](/docs/robotics-streaming/)。

*   **淘汰公告**：`gemini-robotics-er-1.6-preview` 模型
    將於 2026 年 8 月 31 日[關閉](/docs/deprecations/)。


## 2026 年 7 月 21 日 {#07-21-2026}

*   **Gemini 3.6 Flash 與 Gemini 3.5 Flash-Lite 正式推出（GA）**：
    推出我們最新 3.x Flash 模型的穩定、可用於正式環境的版本：

    *   **Gemini 3.6 Flash**（`gemini-3.6-flash`）：具備更佳的 token
        效率與程式碼／代理規劃能力，價格低於
        3.5 Flash，並解決了開發人員對輸出冗長的回饋。
    *   **Gemini 3.5 Flash-Lite**（`gemini-3.5-flash-lite`）：提供
        低延遲、高成本效益的子代理選項，專為
        大量自動化而設計。

    如需瞭解詳情，請參閱 [Gemini 3.6 Flash 指南](/docs/whats-new-gemini-3.6/)。

*   **已淘汰的參數**：取樣參數 `temperature`、`top_p`
    與 `top_k` 現已淘汰。詳情請參閱 [Gemini 3.6 Flash
    指南](/docs/whats-new-gemini-3.6/#sampling-parameter-deprecation)。


## 2026 年 7 月 6 日 {#07-06-2026}

*   Interactions API 的[開發人員記錄](/docs/logs-datasets/)支援：受支援的 Interactions API 呼叫記錄現在可在 [AI Studio
    資訊主頁](https://aistudio.google.com/logs)中查看。

## 2026 年 6 月 30 日 {#06-30-2026}

*   **Gemini Omni Flash 公開預覽**：推出
    `gemini-omni-flash-preview`，這是高效能多模態模型，專為
    高速影片生成與對話式影片編輯而設計。使用
    [Interactions API](/docs/interactions-overview/)，您可從文字描述生成 3–10
    秒、720p 的影片，或將靜態圖片製成動畫，並
    以對話方式編輯與精修輸出。如需開始使用，請參閱
    [Gemini Omni Flash](/docs/omni/) 指南與 [Gemini Omni
    Flash](/docs/models/gemini-omni-flash/) 模型卡。

*   推出 `gemini-3.1-flash-lite-image`（Nano Banana 2 Lite）正式版本
    （GA），這是我們的內建多模態模型，專為超低
    延遲與具成本效益的圖片生成與編輯最佳化。請參閱 [Gemini 3.1
    Flash Lite Image](/docs/models/gemini-3.1-flash-lite-image/) 模型卡與
    [圖片生成](/docs/image-generation/)指南。


## 2026 年 6 月 24 日 {#06-24-2026}

*   **Computer Use**：在 Gemini 3.5 Flash 中推出 [Computer
    Use](/docs/computer-use/) 工具的公開預覽支援。此版本包含
    帶有意圖的簡化動作、對瀏覽器、行動裝置與
    桌面環境的內建支援、可設定的安全政策，以及進階的提示詞
    注入偵測。

## 2026 年 6 月 17 日 {#06-17-2026}

*   **語音生成的串流支援**：透過
    `streamGenerateContent`（以及 Interactions API 中的 `stream: true`）的串流，現在
    已支援 `gemini-3.1-flash-tts-preview` 模型。如需瞭解詳情，請參閱
    [文字轉語音](/docs/speech-generation/#streaming)指南。

## 2026 年 6 月 15 日 {#06-15-2026}

*   **淘汰公告**：以下圖片生成模型
    即將淘汰，並將於
    **2026 年 8 月 17 日**[關閉](/docs/deprecations/)：

    *   **Imagen 4 與 Gemini 3 Image 模型**：
        *   `imagen-4.0-generate-001`
        *   `imagen-4.0-ultra-generate-001`
        *   `imagen-4.0-fast-generate-001`


    如要將程式碼遷移至較新的穩定或預覽端點，請參閱
    [Gemini 淘汰](/docs/deprecations/#imagen-models)頁面。

*   **淘汰公告**：以下影片生成模型
    即將淘汰，並將於
    **2026 年 6 月 30 日**[關閉](/docs/deprecations/)：

    *   **Veo 模型**：
        *   `veo-2.0-generate-001`
        *   `veo-3.0-generate-001`
        *   `veo-3.0-fast-generate-001`


    請將您的整合更新為使用 Veo 3.1 預覽模型 ID
    （`veo-3.1-generate-preview`、`veo-3.1-fast-generate-preview`）或
    透過 [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate) 提供的
    3.1 GA 模型，以避免服務中斷。

*   **淘汰公告**：實驗性的 GMP Contextual View 工具（
    供 Grounding with Google Maps 輸出使用的固定介面）將於 **2026 年 6 月 15 日**[關閉](/docs/deprecations/)：


## 2026 年 6 月 1 日 {#06-01-2026}

*   以下 Gemini 2.0 模型現已[關閉](/docs/deprecations/)：

    *   `gemini-2.0-flash`
    *   `gemini-2.0-flash-001`
    *   `gemini-2.0-flash-lite`
    *   `gemini-2.0-flash-lite-001`

    請改用 [`gemini-3.5-flash`](/docs/models/gemini-3.5-flash/) 或
    [`gemini-3.1-flash-lite`](/docs/models/gemini-3.1-flash-lite/)。


## 2026 年 5 月 28 日 {#05-28-2026}

*   推出 `gemini-3.1-flash-image`（Nano Banana 2）與 `gemini-3-pro-image`
    （Nano Banana Pro），這是我們原生
    視覺模型的正式推出（GA）版本：[Gemini 3.1 Flash Image](/docs/models/gemini-3.1-flash-image/)
    與 [Gemini 3 Pro Image](/docs/models/gemini-3-pro-image/)。

*   **影片轉圖片生成支援**：您現在可傳入影片檔案（透過
    直接上傳或以公開的 YouTube 網址提供）作為多模態上下文，並搭配
    文字提示詞，生成高品質的縮圖、電影海報或
    摘要資訊圖表。此功能僅在
    `gemini-3.1-flash-image` 模型上支援。如需瞭解詳情，請參閱[影片轉圖片
    生成](/docs/image-generation/#video-to-image)指南。

*   淘汰公告：`gemini-3.1-flash-image-preview` 與
    `gemini-3-pro-image-preview` 模型已淘汰，並將於 2026 年 6 月 25 日[關閉](/docs/deprecations/)。


## 2026 年 5 月 25 日 {#05-25-2026}

*   `gemini-3.1-flash-lite-preview` 模型已[關閉](/docs/deprecations/)。請改用
    [`gemini-3.1-flash-lite`](/docs/models/gemini-3.1-flash-lite/)。

## 2026 年 5 月 19 日 {#05-19-2026}

*   推出 `gemini-3.5-flash`，這是 [Gemini
    3.5 Flash](/docs/models/gemini-3.5-flash/) 的正式推出（GA）版本，也是我們在代理與程式設計任務上能持續提供前沿效能的最智慧模型。

*   以公開預覽推出 **Managed Agents in the Gemini API**。這項功能
    可讓開發人員建構並部署自主、有狀態的代理，這些代理會在
    安全、隔離、由 Google 代管的 Linux 沙箱環境中執行。如需瞭解詳情，
    請參閱[代理總覽](/docs/agents/)頁面與
    [快速入門](/docs/managed-agents-quickstart/)。

*   推出通用型 **Antigravity Agent** 受管代理
    [`antigravity-preview-05-2026`](/docs/models/antigravity-preview-05-2026/)，
    目前為公開預覽。Antigravity agent 能在沙箱
    容器內自主規劃、推理、撰寫並執行程式碼、管理檔案與瀏覽網頁。程式碼範例與規格請參閱 [Antigravity Agent](/docs/antigravity-agent/) 指南。


## 2026 年 5 月 7 日 {#05-07-2026}

*   推出 `gemini-3.1-flash-lite`，這是
    [Gemini 3.1 Flash-Lite](/docs/models/gemini-3.1-flash-lite/) 的正式推出（GA）版本，專為
    速度、規模與成本效率最佳化。

*   淘汰公告：`gemini-3.1-flash-lite-preview` 模型
    將於 5/11/26 淘汰，並將於 2026 年 5 月
    25 日[關閉](/docs/deprecations/)。


## 2026 年 5 月 6 日 {#05-06-2026}

*   **即將到來的破壞性變更**：[Interactions API](/docs/interactions-overview/)
    的要求與回應結構（`outputs` → `steps`）及輸出格式
    設定（`response_format`）即將變更。新結構將於 **5 月 26 日**成為預設，舊版結構將於 **6 月 8 日**移除。
    詳情請參閱[遷移指南](/docs/interactions-breaking-changes-may-2026/)。

## 2026 年 5 月 5 日 {#05-05-2026}

*   更新 **File Search** 以支援多模態搜尋。您現在可原生
    使用 `gemini-embedding-2` 模型嵌入並搜尋圖片。
    接地中繼資料現在包含供視覺引用使用的 `media_id`，以及
    指出資訊所在位置的 `page_numbers`。如需瞭解詳情，請參閱
    [File Search](/docs/file-search/)指南。

## 2026 年 5 月 4 日 {#05-04-2026}

*   在 Gemini API 中推出事件驅動的 [Webhooks](/docs/webhooks/) 支援，
    以取代 Batch API 與長時間執行作業的輪詢工作流程。

## 2026 年 4 月 30 日 {#04-30-2026}

*   `gemini-robotics-er-1.5-preview` 模型已[關閉](/docs/deprecations/)。請改用
    [`gemini-robotics-er-1.6-preview`](/docs/models/gemini-robotics-er-1.6-preview/)。

## 2026 年 4 月 22 日 {#04-22-2026}

*   推出 `gemini-embedding-2` 正式版本（GA）。如需瞭解詳情，
    請參閱[嵌入](/docs/embeddings/)頁面。

## 2026 年 4 月 21 日 {#04-21-2026}

*   推出新版本的 [Deep Research](/docs/deep-research/) 代理，具備
    協作規劃、視覺化支援、MCP 伺服器整合與
    File Search：

    *   [`deep-research-preview-04-2026`](/docs/models/deep-research-preview-04-2026/)：
        專為速度與效率而設計，適合串流回傳至用戶端
        UI。

    *   [`deep-research-max-preview-04-2026`](/docs/models/deep-research-max-preview-04-2026/)：
        提供最完整的自動化上下文蒐集與彙整能力。


## 2026 年 4 月 15 日 {#04-15-2026}

*   推出 [Gemini 3.1 Flash TTS
    Preview](/docs/models/gemini-3.1-flash-tts-preview/)，這是我們具成本效益、
    富表現力且可操控的文字轉語音模型。詳情請參閱
    [文字轉語音](/docs/speech-generation/)文件。

## 2026 年 4 月 14 日 {#04-14-2026}

*   推出 `gemini-robotics-er-1.6-preview`，這是我們更新的機器人技術模型。此模型
    現在具備儀器讀取等新功能，以及更佳的空間與
    物理推理能力。如需瞭解詳情，請參閱 [Gemini
    Robotics-ER](/docs/robotics-overview/) 頁面與
    [部落格](https://deepmind.google/blog/gemini-robotics-er-1-6)。

*   淘汰公告：`gemini-robotics-er-1.5-preview` 模型將於
    2026 年 4 月 30 日上午 9 點 PST [關閉](/docs/deprecations/)。


## 2026 年 4 月 2 日 {#04-02-2026}

*   推出 `gemma-4-26b-a4b-it` 與 `gemma-4-31b-it`，可於 [AI
    Studio](https://aistudio.google.com) 與透過 Gemini API 使用，這是
    [Gemma 4](https://ai.google.dev/gemma/docs/core) 發表的一部分。

## 2026 年 4 月 1 日 {#04-01-2026}

*   推出新的 [Flex](/docs/flex-inference/) 與
    [Priority](/docs/priority-inference/) 推論層級，提供更多
    針對成本或延遲最佳化的選項。

## 2026 年 3 月 31 日 {#03-31-2026}

*   推出 Veo 3.1 Lite Preview，
    [`veo-3.1-lite-generate-preview`](/docs/models/veo-3.1-lite-generate-preview/)，
    這是我們最具成本效益的[影片生成](/docs/video/)模型，專為
    快速迭代與建構大量應用程式而設計。

*   `gemini-2.5-flash-lite-preview-09-2025` 模型已關閉。請改用
    [`gemini-3.1-flash-lite-preview`](/docs/models/gemini-3.1-flash-lite-preview/)。


## 2026 年 3 月 26 日 {#03-26-2026}

*   推出
    [`gemini-3.1-flash-live-preview`](/docs/models/gemini-3.1-flash-live-preview/)，
    這是最新音訊轉音訊（A2A）模型，專為即時對話與
    語音優先的 AI 應用程式而設計。詳情請參閱 [Live API](/docs/live-api/) 文件並
    開始使用。

## 2026 年 3 月 25 日 {#03-25-2026}

*   推出 [Lyria 3](/docs/music-generation/) 音樂生成模型：
    [`lyria-3-clip-preview`](/docs/models/lyria-3-clip-preview/)（30 秒
    片段）與 [`lyria-3-pro-preview`](/docs/models/lyria-3-pro-preview/)
    （完整長度歌曲）。兩個模型都接受文字與圖片輸入，可生成
    高品質的 48kHz 立體聲音訊。詳情與程式碼範例請參閱[音樂
    生成](/docs/music-generation/)指南。

## 2026 年 3 月 23 日 {#03-23-2026}

*   在 AI Studio 中推出 [Prepay and Postpay billing plans](/docs/billing/)。
    現有帳號可能受到影響；詳情請參閱[計費](/docs/billing/)
    文件。

## 2026 年 3 月 18 日 {#03-18-2026}

*   推出新的[內建工具與函式呼叫
    組合](/docs/tool-combination/)功能，讓您可在單次
    API 呼叫中同時使用 Gemini 的內建工具與自訂函式呼叫工具。

*   [使用 Google Maps 接地](/docs/maps-grounding/#supported-models)現在
    已支援 Gemini 3 模型。


## 2026 年 3 月 16 日 {#03-16-2026}

*   推出改版的[使用層級](/docs/billing/#about-billing)與[計費
    帳戶支出上限](/docs/billing/#tier-spend-caps)，提供更佳的使用者計費
    體驗。

## 2026 年 3 月 12 日 {#03-12-2026}

*   在 AI Studio 的計費中推出[專案層級支出上限](/docs/billing/#project-spend-caps)。

## 2026 年 3 月 10 日 {#03-10-2026}

*   推出 `gemini-embedding-2-preview`，這是我們第一個多模態嵌入模型。
    此模型支援文字、圖片、影片、音訊與 PDF 輸入，可將所有
    模態對映至統一的嵌入空間。如需瞭解詳情，請參閱
    [嵌入](/docs/embeddings/)。

*   淘汰公告：`gemini-2.5-flash-lite-preview-09-2025` 模型
    將於 2026 年 3 月 31 日[關閉](/docs/deprecations/)。


## 2026 年 3 月 9 日 {#03-09-2026}

*   Gemini 3 Pro Preview 模型已[關閉](/docs/deprecations/)。
    `gemini-3-pro-preview` 現在指向
    [`gemini-3.1-pro-preview`](/docs/models/gemini-3.1-pro-preview/)。

## 2026 年 3 月 3 日 {#03-03-2026}

*   推出 Gemini 3.1 Flash-Lite Preview，這是 Gemini 3 系列中的第一個 Flash-Lite 模型。規格、具體
    更新與開發人員指引請參閱[模型
    頁面](/docs/models/gemini-3.1-flash-lite-preview/)。

## 2026 年 2 月 26 日 {#02-26-2026}

*   推出 Nano Banana 2：[Gemini 3.1 Flash Image
    Preview](/docs/models/gemini-3.1-flash-image/)，這是高效能
    模型，專為速度與大量使用情境最佳化。

*   淘汰公告：Gemini 3 Pro Preview（`gemini-3-pro-preview`）將於
    2026 年 3 月 9 日[關閉](/docs/deprecations/)。


## 2026 年 2 月 19 日 {#02-19-2026}

*   推出 [Gemini 3.1 Pro Preview](/docs/models/gemini-3.1-pro-preview/)，這是
    我們在新 Gemini 3 系列家族中的最新版本。

*   推出獨立端點 `gemini-3.1-pro-preview-customtools`，此端點
    更擅長優先處理自訂工具，適用於同時使用 bash
    與工具建構的使用者。


## 2026 年 2 月 18 日 {#02-18-2026}

*   淘汰公告：以下模型將於 2026 年 6 月 1 日[關閉](/docs/deprecations/)：

    *   `gemini-2.0-flash`
    *   `gemini-2.0-flash-001`
    *   `gemini-2.0-flash-lite`
    *   `gemini-2.0-flash-lite-001`


## 2026 年 2 月 17 日 {#02-17-2026}

*   以下模型已[關閉](/docs/deprecations/)：

    *   `gemini-2.5-flash-preview-09-25`
    *   `imagen-4.0-generate-preview-06-06`
    *   `imagen-4.0-ultra-generate-preview-06-06`


## 2026 年 1 月 29 日 {#01-29-2026}

*   在 `gemini-3-pro-preview` 與
    `gemini-3-flash-preview` 中推出 Computer Use 工具支援。

## 2026 年 1 月 21 日 {#01-21-2026}

*   變更 `latest` 別名：

    *   `gemini-pro-latest` 切換至 `gemini-3-pro-preview`
    *   `gemini-flash-latest` 切換至 `gemini-3-flash-preview`


## 2026 年 1 月 15 日 {#01-15-2026}

*   淘汰公告：以下模型將於 2026 年 2 月 17 日[關閉](/docs/deprecations/)：

    *   `gemini-2.5-flash-preview-09-25`
    *   `imagen-4.0-generate-preview-06-06`
    *   `imagen-4.0-ultra-generate-preview-06-06`

*   `gemini-2.5-flash-image-preview` 模型已關閉。


## 2026 年 1 月 14 日 {#01-14-2026}

*   `text-embedding-004` 模型已[關閉](/docs/deprecations/)。

## 2026 年 1 月 13 日 {#01-13-2026}

*   為 [Veo](/docs/video/) 新增 4k 輸出解析度，並在所有解析度下提供更多直向影片支援。

## 2026 年 1 月 12 日 {#01-12-2026}

*   推出模型生命週期功能。部分模型現在會標示生命週期
    階段與淘汰時間軸。詳情請參閱以下文件：

    *   [Model stages](/api-reference/generate-content/)


## 2026 年 1 月 8 日 {#01-08-2026}

*   推出對 Cloud Storage 值區，以及任何公開與私人 DB
    預先簽署網址作為 Gemini API 資料輸入來源的支援。檔案大小上限
    也從 20MB 提高至 100MB。詳情請參閱[檔案輸入方式
    指南](/docs/file-input-methods/)。

## 2025 年 12 月 19 日 {#12-19-2025}

*   在 v1beta 的 Interactions API 中推出破壞性變更。
    `total_reasoning_tokens` 欄位已重新命名為 `total_thought_tokens`，以
    更貼合思考模型中「thoughts」的概念。

## 2025 年 12 月 17 日 {#12-17-2025}

*   推出 Gemini 3 Flash Preview：`gemini-3-flash-preview`，以一小部分的
    成本提供媲美大型模型的前沿級效能。
    此模型具備升級的視覺與空間推理，以及代理程式設計
    功能。詳情請參閱部分新功能的文件，包括：

    *   [多模態函式回應](/docs/function-calling/#multimodal)
    *   [搭配圖片的程式碼執行](/docs/code-execution/#images)


## 2025 年 12 月 12 日 {#12-12-2025}

*   推出 `gemini-2.5-flash-native-audio-preview-12-2025`，這是 Live API 的新原生音訊
    模型。此更新提升了模型處理
    複雜工作流程的能力。如需瞭解詳情，請參閱 [Live API
    指南](/docs/live-api/capabilities/) 與 [Gemini 2.5 Flash Native
    Audio](/docs/models/gemini-2.5-flash-native-audio-preview-12-2025/)。

## 2025 年 12 月 11 日 {#12-11-2025}

*   推出 Interactions API。此 API 提供統一的介面，可
    與 Gemini 模型與代理互動。如需瞭解詳情，請參閱
    [Interactions API](/docs/interactions-overview/)指南。

*   以預覽推出 Gemini Deep Research 代理。此代理能自主
    為多步驟研究任務規劃、執行並彙整結果。詳情請參閱
    [Deep Research](/docs/deep-research/)指南。


## 2025 年 12 月 10 日 {#12-10-2025}

*   針對我們的[文字轉語音
    模型](/docs/speech-generation/)推出強化功能：Gemini 2.5 Flash TTS preview（針對
    低延遲最佳化）與 Gemini 2.5 Pro TTS preview（針對品質最佳化），
    包括更佳的表現力、精準的節奏控制與無縫對話。

## 2025 年 12 月 9 日 {#12-09-2025}

*   以下 Gemini Live API 模型現已關閉：
    -   `gemini-2.0-flash-live-001`
    -   `gemini-live-2.5-flash-preview`


## 2025 年 12 月 5 日 {#12-05-2025}

*   Gemini 3 的[使用 Google Search 接地](/docs/google-search/)計費
    將於 2026 年 1 月 5 日開始。

## 2025 年 12 月 4 日 {#12-04-2025}

*   淘汰公告：`gemini-2.5-flash-image-preview` 模型將於
    2026 年 1 月 15 日關閉。

## 2025 年 12 月 3 日 {#12-03-2025}

*   淘汰公告：`text-embedding-004` 模型將於
    2026 年 1 月 14 日關閉。

## 2025 年 11 月 20 日 {#11-20-2025}

*   推出 Gemini 3 Pro Image Preview：`gemini-3-pro-image-preview`，這是
    Nano Banana 模型的下一個版本。詳情請參閱[圖片
    生成](/docs/image-generation/)頁面。

## 2025 年 11 月 18 日 {#11-18-2025}

*   推出第一個 Gemini 3 系列模型 `gemini-3-pro-preview`，這是我們
    最先進的推理與多模態理解模型，具備強大的
    代理與程式設計功能。

    除了智慧與效能的提升，Gemini 3 Pro
    Preview 也在以下方面推出新行為：

    *   [媒體解析度](/docs/media-resolution/)
    *   [Thought signatures](/docs/thinking/#signatures)
    *   [思考等級](/docs/thinking/#thinking-levels)

    遷移、新功能與規格請參閱 Gemini 3 開發人員指南。


## 2025 年 11 月 11 日 {#11-11-2025}

*   淘汰公告：以下模型將關閉：

    *   11 月 12 日：

        -   `veo-3.0-fast-generate-preview`
        -   `veo-3.0-generate-preview`

    *   11 月 14 日：

        -   `gemini-2.0-flash-exp-image-generation`
        -   `gemini-2.0-flash-preview-image-generation`


## 2025 年 11 月 10 日 {#11-10-2025}

*   以下模型已關閉：

    -   `imagen-3.0-generate-002`

    請改用 [Imagen 4](/docs/image-generation/)。詳情請參閱
    [Gemini 淘汰表格](/docs/deprecations/)。


## 2025 年 11 月 6 日 {#11-06-2025}

*   將 File Search API 推出至公開預覽，讓開發人員能
    以自己的資料為回應接地。詳情請參閱新的 [File
    Search](/docs/file-search/)頁面。

## 2025 年 11 月 4 日 {#11-04-2025}

*   針對 [Gemini 2.5 Flash Image](/docs/image-generation/)，圖片的輸入 token 數量
    已從 1290 降至 258，降低了圖片
    編輯的成本。

*   淘汰公告：以下模型將關閉：

    *   11 月 18 日：

        -   `gemini-2.5-flash-lite-preview-06-17`
        -   `gemini-2.5-flash-preview-05-20`

    *   12 月 2 日：

        -   `gemini-2.0-flash-thinking-exp`
        -   `gemini-2.0-flash-thinking-exp-01-21`
        -   `gemini-2.0-flash-thinking-exp-1219`
        -   `gemini-2.5-pro-preview-03-25`
        -   `gemini-2.5-pro-preview-05-06`
        -   `gemini-2.5-pro-preview-06-05`

    *   12 月 9 日：

        -   `gemini-2.0-flash-lite-preview`
        -   `gemini-2.0-flash-lite-preview-02-05`
        -   `gemini-2.0-flash-exp`
        -   `gemini-2.0-pro-exp`
        -   `gemini-2.0-pro-exp-02-05`


## 2025 年 10 月 29 日 {#10-29-2025}

*   針對 Gemini API 推出新的[記錄與資料集](/docs/logs-datasets/)工具。

## 2025 年 10 月 20 日 {#10-20-2025}

*   以下 Gemini Live API 模型現已關閉：

    -   `gemini-2.5-flash-preview-native-audio-dialog`
    -   `gemini-2.5-flash-exp-native-audio-thinking-dialog`

    您可改用 `gemini-2.5-flash-native-audio-preview-09-2025`。

*   淘汰公告：`gemini-2.0-flash-live-001` 與
    `gemini-live-2.5-flash-preview` 將於 2025 年 12 月 09 日關閉。


## 2025 年 10 月 17 日 {#10-17-2025}

*   **使用 Google Maps 接地**現已正式推出。詳情
    請參閱[使用 Google Maps 接地](/docs/maps-grounding/)
    文件。

## 2025 年 10 月 15 日 {#10-15-2025}

*   以公開
    預覽推出 [Veo 3.1 與 3.1 Fast](/docs/video/) 模型，新功能包括：

    -   延伸 Veo 建立的影片。
    -   參照最多三張圖片來生成影片。
    -   提供首影格與末影格圖片來生成影片。

    此次發表也為 Veo 3 輸出影片長度新增更多選項：4、6
    與 8 秒。

*   淘汰公告：`veo-3.0-generate-preview` 與
    `veo-3.0-fast-generate-preview` 將於 2025 年 11 月 12 日關閉。


## 2025 年 10 月 7 日 {#10-07-2025}

*   推出 [Gemini 2.5 Computer Use Preview](/docs/computer-use/)

## 2025 年 10 月 2 日 {#10-02-2025}

*   推出 Gemini 2.5 Flash Image GA：[使用 Gemini 生成圖片](/docs/image-generation/)

## 2025 年 9 月 29 日 {#09-29-2025}

*   以下 Gemini 1.5 模型現已關閉：
    -   `gemini-1.5-pro`
    -   `gemini-1.5-flash-8b`
    -   `gemini-1.5-flash`


## 2025 年 9 月 25 日 {#09-25-2025}

*   以預覽推出 Gemini Robotics-ER 1.5 模型。詳情請參閱[機器人技術
    總覽](/docs/robotics-overview/)，瞭解如何將此模型用於
    您的機器人技術應用程式。

*   推出以下預覽模型：

    -   `gemini-2.5-flash-preview-09-2025`
    -   `gemini-2.5-flash-lite-preview-09-2025`

    詳情請參閱[模型](/docs/models/)頁面。


## 2025 年 9 月 23 日 {#09-23-2025}

*   推出 `gemini-2.5-flash-native-audio-preview-09-2025`，這是 Live API 的新原生音訊
    模型，具備更佳的函式呼叫與語音截斷
    處理。如需瞭解詳情，請參閱 [Live API
    指南](/docs/live-api/capabilities/) 與 [Gemini 2.5 Flash Native
    Audio](/docs/models/)。

## 2025 年 9 月 16 日 {#09-16-2025}

*   淘汰公告：以下模型將於 2025 年 10 月關閉：

    -   `embedding-001`
    -   `embedding-gecko-001`
    -   `gemini-embedding-exp-03-07`（`gemini-embedding-exp`）

    最新嵌入模型的詳情請參閱[嵌入](/docs/embeddings/)頁面。


## 2025 年 9 月 10 日 {#09-10-2025}

*   推出 [Batch
    API 中的嵌入模型](/docs/batch-api/#batch-embedding)支援，並將 Batch API 新增至 [OpenAI
    相容性程式庫](/docs/openai/#batch)，讓您以更簡便的方式
    開始使用批次查詢。

## 2025 年 9 月 9 日 {#09-09-2025}

*   推出 Veo 3 與 Veo 3 Fast GA，價格更低，並新增
    長寬比、解析度與種子選項。詳情請參閱 [Veo
    文件](/docs/video/)。

## 2025 年 8 月 26 日 {#08-26-2025}

*   推出 [Gemini 2.5 Image
    Preview](/docs/models/)，這是我們最新的原生
    圖片生成模型。

## 2025 年 8 月 18 日 {#08-18-2025}

*   將 [URL context tool](/docs/url-context/) 推出至正式版本（GA），
    此工具可提供網址作為提示詞的額外上下文。使用
    URL context 搭配 `gemini-2.0-flash` 模型的支援（在
    實驗性發表期間提供）將於一週後停止。

## 2025 年 8 月 14 日 {#08-14-2025}

*   將 Imagen 4 Ultra、Standard 與 Fast 模型推出至正式版本
    （GA）。如需瞭解詳情，請參閱 [Imagen](/docs/image-generation/) 頁面。

## 2025 年 8 月 7 日 {#08-07-2025}

*   Image to Video 生成中的 `allow_adult` 設定現在已在
    受限地區提供。詳情請參閱
    [Veo](/docs/video/?example=dialogue)頁面。

## 2025 年 7 月 31 日 {#07-31-2025}

*   為 Veo 3 Preview 模型推出圖片轉影片生成。
*   推出 Veo 3 Fast Preview 模型。
*   如需瞭解 Veo 3 詳情，請造訪 [Veo](/docs/video/) 頁面。

## 2025 年 7 月 22 日 {#07-22-2025}

*   推出 `gemini-2.5-flash-lite`，這是我們快速、低成本、高效能的
    Gemini
    2.5 模型。如需瞭解詳情，請參閱 [Gemini 2.5
    Flash-Lite](/docs/models/#gemini-25-flash-lite)。

## 2025 年 7 月 17 日 {#07-17-2025}

*   推出 `veo-3.0-generate-preview`，這是 Veo 的最新更新，推出
    搭配音訊生成的影片。如需瞭解 Veo 3 詳情，請造訪
    [Veo](/docs/video/)頁面。

*   提高 Imagen 4 Standard 與 Ultra 的速率限制。詳情請造訪[速率
    限制](/docs/rate-limits/)頁面。


## 2025 年 7 月 14 日 {#07-14-2025}

*   推出 `gemini-embedding-001`，這是我們文字嵌入
    模型的穩定版本。如需瞭解詳情，請參閱[嵌入](/docs/embeddings/)。
    `gemini-embedding-exp-03-07` 模型將於 2025 年 8 月 14 日淘汰。

## 2025 年 7 月 7 日 {#07-07-2025}

*   推出 Gemini API Batch Mode。將要求批次處理後送出，以
    非同步方式處理。如需瞭解詳情，請參閱 [Batch Mode](/docs/batch-api/)。

## 2025 年 6 月 26 日 {#06-26-2025}

*   預覽模型 `gemini-2.5-pro-preview-05-06` 與
    `gemini-2.5-pro-preview-03-25` 現在會導向至最新的穩定
    版本 `gemini-2.5-pro`。

*   `gemini-2.5-pro-exp-03-25` 已關閉。


## 2025 年 6 月 24 日 {#06-24-2025}

*   推出 Imagen 4 Ultra 與 Standard Preview 模型。如需瞭解詳情，請參閱
    [圖片生成](/docs/image-generation/)頁面。

## 2025 年 6 月 17 日 {#06-17-2025}

*   推出 `gemini-2.5-pro`，這是我們最強大模型的穩定版本，
    現在具備自適應思考。如需瞭解詳情，請參閱 [Gemini 2.5
    Pro](/docs/models/#gemini-25-pro) 與 [Thinking](/docs/thinking/)。
    `gemini-2.5-pro-preview-05-06` 將於
    2025 年 6 月 26 日導向至 `gemini-2.5-pro`。

*   推出 `gemini-2.5-flash`，這是我們第一個穩定的 2.5 Flash 模型。如需
    瞭解詳情，請參閱 [Gemini 2.5 Flash](/docs/models/#gemini-25-flash)。
    `gemini-2.5-flash-preview-04-17` 將於 2025 年 7 月 15 日淘汰。

*   推出 `gemini-2.5-flash-lite-preview-06-17`，這是低成本、高效能的
    Gemini 2.5 模型。如需瞭解詳情，請參閱 [Gemini 2.5 Flash-Lite
    Preview](/docs/models/#gemini-25-flash-lite)。


## 2025 年 6 月 05 日 {#06-05-2025}

*   推出 `gemini-2.5-pro-preview-06-05`，這是我們最強大模型的新版本，
    現在具備自適應思考。如需瞭解詳情，請參閱 [Gemini 2.5 Pro
    Preview](/docs/models/) 與
    [Thinking](/docs/thinking/)。`gemini-2.5-pro-preview-05-06` 將於
    2025 年 6 月 26 日導向至 `gemini-2.5-pro`。

## 2025 年 5 月 27 日 {#05-27-2025}

*   最後一個可用的微調模型 Gemini 1.5 Flash 001 已關閉。
    所有模型都不再支援微調。請參閱[使用
    Gemini API 微調](/docs/model-tuning/)。

## 2025 年 5 月 20 日 {#05-20-2025}

**API 更新：**

*   推出[自訂影片預處理](/docs/video-understanding/#customize-video-processing)支援，
    使用剪輯區間與可設定的影格率取樣。

*   推出多工具使用，支援在同一個 `generateContent` 要求上設定[程式碼
    執行](/docs/code-execution/)與[使用 Google
    Search 接地](/docs/google-search/)。

*   在 Live API 中推出[非同步函式呼叫](/docs/live-api/tools/#async-function-calling)支援。

*   推出實驗性的 [URL context tool](/docs/url-context/)，可提供
    網址作為提示詞的額外上下文。


**模型更新：**

*   推出 `gemini-2.5-flash-preview-05-20`，這是 Gemini
    [preview](/docs/models/#model-versions) 模型，針對價格效能比
    與自適應思考最佳化。如需瞭解詳情，請參閱 [Gemini 2.5 Flash
    Preview](/docs/models/) 與
    [Thinking](/docs/thinking/)。

*   推出 [`gemini-2.5-pro-preview-tts`](/docs/models/)
    與
    [`gemini-2.5-flash-preview-tts`](/docs/models/)
    模型，這些模型能以一位或兩位說話者[生成語音](/docs/speech-generation/)。

*   推出 `lyria-realtime-exp` 模型，此模型能即時[生成
    音樂](/docs/music-generation/)。

*   推出 `gemini-2.5-flash-preview-native-audio-dialog` 與
    `gemini-2.5-flash-exp-native-audio-thinking-dialog`，這是 Live API 的新 Gemini 模型，具備原生音訊輸出功能。如需瞭解詳情，請參閱
    [Live API 指南](/docs/live-api/capabilities/#native-audio-output) 與
    [Gemini 2.5 Flash Native Audio](/docs/models/)。

*   推出 `gemma-3n-e4b-it` 預覽版，可於 [AI
    Studio](https://aistudio.google.com) 與透過 Gemini API 使用，這是
    [Gemma 3n](https://ai.google.dev/gemma/docs/3n) 發表的一部分。


## 2025 年 5 月 7 日 {#05-07-2025}

*   推出 `gemini-2.0-flash-preview-image-generation`，這是預覽模型，適用於
    生成與編輯圖片。如需瞭解詳情，請參閱[圖片
    生成](/docs/image-generation/)與 [Gemini 2.0
    Flash Preview Image
    Generation](/docs/models/)。

## 2025 年 5 月 6 日 {#05-06-2025}

*   推出 `gemini-2.5-pro-preview-05-06`，這是我們最強大模型的新版本，
    在程式碼與函式呼叫方面有所提升。
    `gemini-2.5-pro-preview-03-25` 將自動指向此模型的
    新版本。

## 2025 年 4 月 17 日 {#04-17-2025}

*   推出 `gemini-2.5-flash-preview-04-17`，這是 Gemini
    [preview](/docs/models/#model-versions) 模型，針對價格效能比
    與自適應思考最佳化。如需瞭解詳情，請參閱 [Gemini 2.5 Flash
    Preview](/docs/models/) 與
    [Thinking](/docs/thinking/)。

## 2025 年 4 月 16 日 {#04-16-2025}

*   為 [Gemini 2.0
    Flash](/docs/models/) 推出上下文快取。

## 2025 年 4 月 9 日 {#04-09-2025}

**模型更新：**

*   推出 `veo-2.0-generate-001`，這是正式推出（GA）的文字與
    圖片轉影片模型，能生成細膩且具藝術
    細膩感的影片。如需瞭解詳情，請參閱 [Veo 文件](/docs/video/)。

*   推出 `gemini-2.0-flash-live-001`，這是 [Live
    API](/docs/live-api/) 模型的公開預覽版本，已啟用計費。

    *   **強化的工作階段管理與可靠性**

        *   **工作階段恢復：**讓工作階段在暫時性網路
            中斷期間保持運作。API 現在支援伺服器端工作階段狀態儲存
            （最長 24 小時），並提供控制代碼（session_resumption）以
            重新連線並從中斷處恢復。

        *   **透過上下文壓縮延長工作階段：**讓互動能
            超越先前的時間限制。透過滑動視窗機制設定上下文視窗
            壓縮，以自動管理
            上下文長度，避免因上下文限制而突然終止。

        *   **優雅中斷連線通知：**接收 `GoAway` 伺服器
            訊息，指出連線即將關閉，讓您能在終止前優雅處理。


    *   **更完善的互動動態控制**

    *   **可設定的 Voice Activity Detection（VAD）：**選擇敏感度
        等級，或完全停用自動 VAD，並使用新的用戶端事件
        （`activityStart`、`activityEnd`）進行手動回合控制。

    *   **可設定的中斷處理：**決定使用者輸入是否應
        中斷模型的回應。

    *   **可設定的回合涵蓋範圍：**選擇 API 是持續處理所有
        音訊與影片輸入，或只在偵測到最終使用者
        說話時才擷取。

    *   **可設定的媒體解析度：**透過選取輸入媒體的解析度，針對品質或 token 用量最佳化。

    *   **更豐富的輸出與功能**

    *   **擴充的語音與語言選項：**從兩種新語音與
        30 種新語言中選取音訊輸出。輸出語言現在可在
        `speechConfig` 中設定。

    *   **文字串流：**在文字回應生成時逐步接收，
        讓您能更快向使用者顯示。

    *   **token 用量回報：**透過伺服器訊息的 `usageMetadata` 欄位中提供的詳細 token
        數量，深入瞭解用量，並依模態與提示詞或回應階段細分。


## 2025 年 4 月 4 日 {#04-04-2025}

*   推出 `gemini-2.5-pro-preview-03-25`，這是已啟用計費的 Gemini 2.5 Pro 公開預覽
    版本。您可繼續在免費層級使用
    `gemini-2.5-pro-exp-03-25`。

## 2025 年 3 月 25 日 {#03-25-2025}

*   推出 `gemini-2.5-pro-exp-03-25`，這是公開實驗性 Gemini 模型，
    預設一律開啟思考模式。如需瞭解詳情，請參閱 [Gemini 2.5 Pro
    Experimental](/docs/models/)。

## 2025 年 3 月 12 日 {#03-12-2025}

**模型更新：**

*   推出實驗性的 [Gemini 2.0 Flash](/docs/image-generation/)
    模型，能生成與編輯圖片。

*   推出 `gemma-3-27b-it`，可於 [AI
    Studio](https://aistudio.google.com) 與透過 Gemini API 使用，這是
    [Gemma 3](https://ai.google.dev/gemma/docs/core) 發表的一部分。


**API 更新：**

*   新增對 [YouTube 網址](/docs/image-understanding/) 作為
    媒體來源的支援。

*   新增對包含小於 20MB 的[內嵌
    影片](/docs/image-understanding/)的支援。


## 2025 年 3 月 11 日 {#03-11-2025}

**SDK 更新：**

*   將 [Google Gen AI SDK for TypeScript and JavaScript](https://googleapis.github.io/js-genai)
    推出至公開預覽。

## 2025 年 3 月 7 日 {#03-07-2025}

**模型更新：**

*   推出 `gemini-embedding-exp-03-07`，這是公開預覽的[實驗性](/docs/models/)
    Gemini 嵌入模型。

## 2025 年 2 月 28 日 {#02-28-2025}

**API 更新：**

*   已將[搜尋作為工具](/docs/google-search/)支援新增至
    `gemini-2.0-pro-exp-02-05`，此為奠基於 Gemini 2.0 Pro 的實驗性模型。

## 2025 年 2 月 25 日 {#02-25-2025}

**模型更新：**

*   推出 `gemini-2.0-flash-lite`，這是
    [Gemini 2.0 Flash-Lite](/docs/models/) 的正式推出（GA）版本，
    針對速度、規模與成本效率最佳化。

## 2025 年 2 月 19 日 {#02-19-2025}

**AI Studio 更新：**

*   支援[其他地區](/docs/available-regions/)
    （Kosovo、Greenland 與 Faroe Islands）。

**API 更新：**

*   支援[其他地區](/docs/available-regions/)
    （Kosovo、Greenland 與 Faroe Islands）。

## 2025 年 2 月 18 日 {#02-18-2025}

**模型更新：**

*   不再支援 Gemini 1.0 Pro。受支援模型的清單請參閱
    [Gemini 模型](/docs/models/)。

## 2025 年 2 月 11 日 {#02-11-2025}

**API 更新：**

*   [OpenAI 程式庫
    相容性](/docs/openai/)的更新。

## 2025 年 2 月 6 日 {#02-06-2025}

**模型更新：**

*   推出 `imagen-3.0-generate-002`，這是
    [Gemini API 中的 Imagen 3](/docs/image-generation/) 的正式推出（GA）版本。

**SDK 更新：**

*   將 [Google Gen AI SDK for Java](https://github.com/googleapis/java-genai)
    推出至公開預覽。

## 2025 年 2 月 5 日 {#02-05-2025}

**模型更新：**

*   推出 `gemini-2.0-flash-001`，這是
    [Gemini 2.0 Flash](/docs/models/) 的正式推出（GA）版本，支援純文字
    輸出。

*   推出 `gemini-2.0-pro-exp-02-05`，這是 Gemini 2.0 Pro 的[實驗性](/docs/models/)公開
    預覽版本。

*   推出 `gemini-2.0-flash-lite-preview-02-05`，這是實驗性公開
    預覽[模型](/docs/models/)，針對成本
    效率最佳化。


**API 更新：**

*   為程式碼執行新增[檔案輸入與圖形輸出](/docs/code-execution/#input-output)
    支援。

**SDK 更新：**

*   將 [Google Gen AI SDK for Python](https://googleapis.github.io/python-genai/)
    推出至正式版本（GA）。

## 2025 年 1 月 21 日 {#01-21-2025}

**模型更新：**

*   推出 `gemini-2.0-flash-thinking-exp-01-21`，這是
    [Gemini 2.0 Flash Thinking Model](/docs/thinking/) 背後模型的最新預覽版本。

## 2024 年 12 月 19 日 {#12-19-2024}

**模型更新：**

*   將 Gemini 2.0 Flash Thinking Mode 推出至公開預覽。Thinking Mode 是
    測試時運算模型，可讓您在模型生成回應時查看其思考過程，
    並產生具備更強推理能力的回應。

    如需瞭解 Gemini 2.0 Flash Thinking Mode 詳情，請參閱我們的[總覽
    頁面](/docs/thinking/)。


## 2024 年 12 月 11 日 {#12-11-2024}

**模型更新：**

*   將 [Gemini 2.0 Flash Experimental](/docs/models/) 推出至
    公開預覽。Gemini 2.0 Flash Experimental 的部分功能
    包括：

    *   速度是 Gemini 1.5 Pro 的兩倍
    *   使用我們的 Live API 進行雙向串流
    *   以文字、圖片與語音形式生成多模態回應
    *   內建工具使用與多輪推理，可使用程式碼
        執行、Search、函式呼叫等功能


詳情請參閱我們在[總覽頁面](/docs/models/)中對 Gemini 2.0 Flash 的說明。

## 2024 年 11 月 21 日 {#11-21-24}

**模型更新：**

*   推出 `gemini-exp-1121`，這是更強大的實驗性 Gemini API
    模型。

**模型更新：**

*   將 `gemini-1.5-flash-latest` 與 `gemini-1.5-flash` 模型別名
    更新為使用 `gemini-1.5-flash-002`。

    *   `top_k` 參數變更：`gemini-1.5-flash-002` 模型支援
        介於 1 與 41（不含 41）之間的 `top_k` 值。大於 40 的值將
        變更為 40。


## 2024 年 11 月 14 日 {#11-14-24}

**模型更新：**

*   推出 `gemini-exp-1114`，這是強大的實驗性 Gemini API 模型。

## 2024 年 11 月 8 日 {#11-08-24}

**API 更新：**

*   在 OpenAI 程式庫／REST API 中新增[對 Gemini 的支援](/docs/openai/)。

## 2024 年 10 月 31 日 {#10-31-24}

**API 更新：**

*   新增[使用 Google Search 接地](/docs/google-search/)支援。

## 2024 年 10 月 3 日 {#10-03-24}

**模型更新：**

*   推出 `gemini-1.5-flash-8b-001`，這是我們最小 Gemini
    API 模型的穩定版本。

## 2024 年 9 月 24 日 {#09-24-24}

**模型更新：**

*   推出 `gemini-1.5-pro-002` 與 `gemini-1.5-flash-002`，這是 Gemini 1.5 Pro 與 1.5 Flash 的兩個新穩定
    版本，已正式推出。

*   將 `gemini-1.5-pro-latest` 模型程式碼更新為使用 `gemini-1.5-pro-002`，
    並將 `gemini-1.5-flash-latest` 模型程式碼更新為使用 `gemini-1.5-flash-002`。

*   推出 `gemini-1.5-flash-8b-exp-0924` 以取代
    `gemini-1.5-flash-8b-exp-0827`。

*   針對 Gemini API 與 AI Studio 推出 [civic integrity safety filter](/docs/safety-settings/#safety-filters)。

*   在 Python 與 NodeJS 中，為 Gemini 1.5 Pro 與 1.5 Flash 推出對兩個新參數的支援：
    [`frequencyPenalty`](/api-reference/generate-content/generate-content/#request-body)
    與
    [`presencePenalty`](/api-reference/generate-content/generate-content/#request-body)。


## 2024 年 9 月 19 日 {#09-19-24}

**AI Studio 更新：**

*   在模型回應中新增按讚與倒讚按鈕，讓使用者能
    針對回應品質提供回饋。

**API 更新：**

*   新增對 Google Cloud 抵免額的支援，現在可將其用於 Gemini
    API 用量。

## 2024 年 9 月 17 日 {#09-17-24}

**AI Studio 更新：**

*   新增 **Open in Colab** 按鈕，可將提示詞（以及
    執行該提示詞的程式碼）匯出至 Colab 筆記本。此功能尚未支援
    搭配工具的提示詞（JSON 模式、函式呼叫或程式碼執行）。

## 2024 年 9 月 13 日 {#09-13-24}

**AI Studio 更新：**

*   新增對比較模式的支援，讓您能比較不同
    模型與提示詞的回應，找出最適合您使用情境的選項。

## 2024 年 8 月 30 日 {#08-30-24}

**模型更新：**

*   Gemini 1.5 Flash 支援[透過模型
    設定提供 JSON 結構](/docs/structured-output/)。

## 2024 年 8 月 27 日 {#08-27-24}

**模型更新：**

*   推出以下[實驗性模型](/docs/models/)：

    *   `gemini-1.5-pro-exp-0827`
    *   `gemini-1.5-flash-exp-0827`
    *   `gemini-1.5-flash-8b-exp-0827`


## 2024 年 8 月 9 日 {#08-09-24}

**API 更新：**

*   新增 [PDF 處理](/docs/document-processing/)支援。

## 2024 年 8 月 5 日 {#08-05-24}

**模型更新：**

*   推出 Gemini 1.5 Flash 的微調支援。

## 2024 年 8 月 1 日 {#08-01-24}

**模型更新：**

*   推出 `gemini-1.5-pro-exp-0801`，這是 [Gemini
    1.5 Pro](/docs/models/) 的新實驗性版本。

## 2024 年 7 月 12 日 {#07-12-24}

**模型更新：**

*   已從 Google AI 服務與工具中移除 Gemini 1.0 Pro Vision 支援。

## 2024 年 6 月 27 日 {#06-27-24}

**模型更新：**

*   Gemini 1.5 Pro 的 2M 上下文視窗正式推出。

**API 更新：**

*   新增[程式碼執行](/docs/code-execution/)支援。

## 2024 年 6 月 18 日 {#06-18-24}

**API 更新：**

*   新增[上下文快取](/docs/caching/)支援。

## 2024 年 6 月 12 日 {#06-12-204}

**模型更新：**

*   Gemini 1.0 Pro Vision 已淘汰。

## 2024 年 5 月 23 日 {#05-23-24}

**模型更新：**

*   [Gemini 1.5 Pro](/docs/models/)（`gemini-1.5-pro-001`）已
    正式推出（GA）。

*   [Gemini 1.5 Flash](/docs/models/)（`gemini-1.5-flash-001`）
    已正式推出（GA）。


## 2024 年 5 月 14 日 {#05-14-24}

**API 更新：**

*   為 Gemini 1.5 Pro 推出 2M 上下文視窗（候補名單）。

*   為 Gemini 1.0 Pro 推出隨用隨付的[計費](/docs/billing/)，
    Gemini 1.5 Pro 與 Gemini 1.5 Flash 的計費即將推出。

*   為即將推出的 Gemini 1.5
    Pro 付費層級推出更高的速率限制。

*   為 [File
    API](/api-reference/files/) 新增內建影片支援。

*   為 [File
    API](/api-reference/files/) 新增純文字支援。

*   新增對平行函式呼叫的支援，此功能可一次回傳多個
    呼叫。


## 2024 年 5 月 10 日 {#05-10-24}

**模型更新：**

*   以預覽推出 [Gemini 1.5 Flash](/docs/models/)
    （`gemini-1.5-flash-latest`）。

## 2024 年 4 月 9 日 {#04-09-24}

**模型更新：**

*   以預覽推出 [Gemini 1.5 Pro](/docs/models/)
    （`gemini-1.5-pro-latest`）。

*   推出新的文字嵌入模型 `text-embeddings-004`，此模型支援
    小於 768 的[彈性嵌入](/docs/embeddings/)大小。


**API 更新：**

*   推出 [File API](/api-reference/files/)，用於
    暫時儲存媒體檔案，供提示詞使用。

*   新增對以文字、圖片與音訊資料進行提示詞的支援，也稱為
    *multimodal* 提示詞。如需瞭解詳情，請參閱[使用
    媒體進行提示詞](/docs/files/#prompt-guide)。

*   以 beta 版推出[系統指令](/docs/text-generation/)。

*   新增[函式呼叫模式](/docs/function-calling/#function_calling_modes)，
    此功能定義函式呼叫的執行行為。

*   新增對 `response_mime_type` 設定選項的支援，此選項可讓
    您以 [JSON 格式](/api-reference/generate-content/generate-content/#request-body)請求回應。


## 2024 年 3 月 19 日 {#03-09-24}

**模型更新：**

*   新增在 Google AI Studio 中或使用 Gemini API [微調 Gemini 1.0 Pro](https://developers.googleblog.com/en/tune-gemini-pro-in-google-ai-studio-or-with-the-gemini-api/)
    的支援。

## 2023 年 12 月 13 日 {#12-13-23}

**模型更新：**

*   gemini-pro：適用於各種任務的新文字模型。在能力
    與效率之間取得平衡。

*   gemini-pro-vision：適用於各種任務的新多模態模型。
    在能力與效率之間取得平衡。

*   embedding-001：新的嵌入模型。

*   aqa：經過特別微調的新模型，訓練目標是使用
    文字段落回答問題，為生成的答案接地。


詳情請參閱 [Gemini 模型](/docs/models/)。

**API 版本更新：**

*   v1：穩定的 API 通道。
*   v1beta：Beta 通道。此通道具備可能正在
    開發中的功能。

詳情請參閱[API 版本主題](/api-reference/api-versions/)。

**API 更新：**

*   `GenerateContent` 是供聊天與文字使用的單一統一端點。

*   可透過 `StreamGenerateContent` 方法使用串流。

*   多模態功能：圖片是新支援的模態

*   新的 beta 功能：

    *   [函式呼叫](/docs/function-calling/)
    *   Semantic Retriever
    *   Attributed Question Answering (AQA)

*   更新候選數量：Gemini 模型只會回傳 1 個候選。

*   不同的 Safety Settings 與 SafetyRating 類別。詳情請參閱[安全
    設定](/docs/safety-settings/)。

*   Gemini 模型尚不支援微調模型（開發中）。

