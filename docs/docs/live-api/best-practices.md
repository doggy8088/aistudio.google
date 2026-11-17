# Live API 最佳做法

本指南涵蓋您可以遵循的最佳做法，
以最佳化 Live API 的使用方式。
常見使用情境的總覽與範例程式碼，請參閱[開始使用 Live API](/docs/live-api/)
頁面。

## 設計清晰的系統指令 {#system-instruction-guidelines}

若要發揮 Live API 的最佳效能，我們建議準備一套
定義明確的系統指令（SI），依序定義代理人設、
對話規則與防護措施。

為獲得最佳效果，請將每個代理分別放入各自的系統指令中。

1. **指定代理人設**：詳細說明代理的名稱、角色，以及
   任何偏好的特質。如果您想指定口音，請務必
   一併指定偏好的輸出語言（例如英語使用者使用英式口音）。

2. **指定對話規則**：請依照您預期模型遵循的順序排列這些規則。
   區分對話中的一次性元素與對話迴圈。例如：

   *  **一次性元素**：只收集一次客戶資料（例如姓名、
      地點、會員卡號）。
   *  **對話迴圈**：使用者可以討論推薦、價格、
      退貨與配送，並可能在不同主題間來回切換。讓
      模型知道，只要使用者願意，就可以持續進行這種對話迴圈。

3. **在流程中以獨立句子指定工具呼叫**：例如，如果
   收集客戶資料的一次性步驟需要呼叫 `get_user_info`
   函式，您可以這樣寫：*您的第一步是收集使用者資訊。首先，
   請使用者提供姓名、地點與會員卡號。接著
   以這些資料呼叫 `get_user_info`。*

4. **加入必要的防護措施**：提供您不希望模型執行的任何一般對話
   防護措施。您可以提供具體範例：如果發生 *x*，
   希望模型執行 *y*。如果精準度仍未達到偏好水準，請使用
   *unmistakably* 一詞，引導模型做到精確無誤。


## 精確定義工具 {#tool-definitions}

搭配 Live API 使用工具時，請在工具定義中具體明確。
務必告訴 Gemini 在什麼條件下應呼叫工具。
詳情請參閱範例一節中的[工具定義](/docs/live-api/best-practices/#tool-definitions-example)。

## 撰寫有效的提示詞 {#prompt-design}

* **使用清晰的提示詞**：在提示詞中提供模型應該與不應該做的範例，
  並盡量將提示詞限制為一次對應一個人設
  或角色。與其撰寫冗長、多頁的提示詞，不如考慮改用提示詞
  串連。模型在單一函式呼叫的任務上表現最佳。

* **提供起始指令與資訊**：Live API 會等待
  使用者輸入後才回應。若要讓 Live API 主動開啟
  對話，請在提示詞中要求它向使用者問候或開始
  對話。提供使用者的相關資訊，可讓 Live API
  將問候個人化。


## 指定語言 {#language-guidelines}

如果您希望模型以特定語言回應，請在系統指令中加入以下
指示：

```none
RESPOND IN {OUTPUT_LANGUAGE}. YOU MUST RESPOND UNMISTAKABLY IN {OUTPUT_LANGUAGE}.
```

## 串流 {#streaming-guidelines}

實作即時音訊時，請遵循以下最佳做法：

*   **區塊大小與延遲**：以 20ms 至 40ms 的區塊傳送音訊。
*   **插話處理**：當使用者在模型回覆期間開口說話時，
    伺服器會傳送 `server_content` 訊息，其中 `"interrupted": true`。您
    必須立即捨棄用戶端的音訊緩衝區，避免代理
    繼續蓋過使用者的聲音說話。

## 上下文管理 {#context-management}

長時間的工作階段請使用 `ContextWindowCompressionConfig`，因為原生音訊權杖
累積速度很快（每秒音訊約 25 個權杖）。

## 用戶端緩衝 {#client-buffering}

傳送前不要對輸入音訊進行大量緩衝（例如 1 秒）。請傳送
小區塊（20ms 至 100ms），將延遲降到最低。

## 重新取樣 {#resampling}

請確保您的用戶端應用程式在傳輸前，將麥克風輸入（通常為 44.1kHz 或
48kHz）重新取樣為 16kHz。

## 工作階段管理 {#session-management}

請遵循以下準則來處理工作階段生命週期，確保可靠的使用者
體驗：

*   **啟用上下文視窗壓縮**：音訊權杖的累積速度約為
    每秒 25 個權杖。若未壓縮，純音訊工作階段
    上限為 15 分鐘，音訊加視訊工作階段上限為 2 分鐘。啟用
    [上下文視窗壓縮](/docs/live-api/session-management/#context-window-compression)
    可將工作階段延長至無限時長。
*   **實作工作階段恢復**：伺服器可能會定期重設
    WebSocket 連線。請使用
    [工作階段恢復](/docs/live-api/session-management/#session-resumption)
    在不遺失上下文的情況下無縫重新連線。保留來自 `SessionResumptionUpdate` 訊息的最新恢復
    權杖，並在重新連線時將其作為控制代碼傳入。恢復權杖在上一個工作階段
    結束後 2 小時內有效。
*   **處理 GoAway 訊息**：伺服器會在終止連線前傳送
    [GoAway](/docs/live-api/session-management/#goaway-message) 訊息
    。請監聽此訊息，並使用
    `timeLeft` 欄位，在連線關閉前妥善收尾或重新連線。
*   **處理 generationComplete 訊號**：使用
    [`generationComplete`](/docs/live-api/session-management/#generation-complete-message)
    訊息得知模型何時完成回應生成，讓您的
    應用程式能更新 UI 或進行下一個動作。

實作細節請參閱
[工作階段管理](/docs/live-api/session-management/)。

## 範例 {#best-practices-example}

此範例結合了最佳做法與
[系統指令設計準則](/docs/live-api/best-practices/#system-instruction-guidelines)，
引導模型扮演職涯教練時的表現。

```none
**Persona:**
You are Laura, a career coach from Brooklyn, NY. You specialize in providing
data driven advice to give your clients a fresh perspective on the career
questions they're navigating. Your special sauce is providing quantitative,
data-driven insights to help clients think about their issues in a different
way. You leverage statistics, research, and psychology as much as possible.
You only speak to your clients in English, no matter what language they speak
to you in.

**Conversational Rules:**

1. **Introduce yourself:** Warmly greet the client.

2. **Intake:** Ask for your client's full name, date of birth, and state they're
calling in from. Call `create_client_profile` to create a new patient profile.

3. **Discuss the client's issue:** Get a sense of what the client wants to
cover in the session. DO NOT repeat what the client is saying back to them in
your response. Don't ask more than a few questions here.

4. **Reframe the client's issue with real data:** NO PLATITUDES. Start providing
data-driven insights for the client, but embed these as general facts within
conversation. This is what they're coming to you for: your unique thinking on
the subjects that are stressing them out. Show them a new way of thinking about
something. Let this step go on for as long as the client wants. As part of this,
if the client mentions wanting to take any actions, update
`add_action_items_to_profile` to remind the client later.

5. **Next appointment:** Call `get_next_appointment` to see if another
appointment has already been scheduled for the client. If so, then share the
date and time with the client and confirm if they'll be able to attend. If
there is no appointment, then call `get_available_appointments` to see openings.
Share the list of openings with the client and ask what they would prefer. Save
their preference with `schedule_appointment`. If the client prefers to schedule
offline, then let them know that's perfectly fine and to use the patient portal.

**General Guidelines:** You're meant to be a witty, snappy conversational
partner. Keep your responses short and progressively disclose more information
if the client requests it. Don't repeat back what the client says back to them.
Each response you give should be a net new addition to the conversation, not a
recap of what the client said. Be relatable by bringing in your own background
growing up professionally in Brooklyn, NY. If a client tries to get you off
track, gently bring them back to the workflow articulated above.

**Guardrails:** If the client is being hard on themselves, never encourage that.
Remember that your ultimate goal is to create a supportive environment for your
clients to thrive.
```

### 工具定義 {#tool-definitions-example}

此 JSON 定義了職涯教練範例中呼叫的相關函式。
定義函式時，為獲得最佳效果，請包含函式的名稱、說明、
參數與呼叫條件。

```json
[
 {
   "name": "create_client_profile",
   "description": "Creates a new client profile with their personal details. Returns a unique client ID. \n**Invocation Condition:** Invoke this tool *only after* the client has provided their full name, date of birth, AND state. This should only be called once at the beginning of the 'Intake' step.",
   "parameters": {
     "type": "object",
     "properties": {
       "full_name": {
         "type": "string",
         "description": "The client's full name."
       },
       "date_of_birth": {
         "type": "string",
         "description": "The client's date of birth in YYYY-MM-DD format."
       },
       "state": {
         "type": "string",
         "description": "The 2-letter postal abbreviation for the client's state (e.g., 'NY', 'CA')."
       }
     },
     "required": ["full_name", "date_of_birth", "state"]
   }
 },
 {
   "name": "add_action_items_to_profile",
   "description": "Adds a list of actionable next steps to a client's profile using their client ID. \n**Invocation Condition:** Invoke this tool *only after* a list of actionable next steps has been discussed and agreed upon with the client during the 'Actions' step. Requires the `client_id` obtained from the start of the session.",
   "parameters": {
     "type": "object",
     "properties": {
       "client_id": {
         "type": "string",
         "description": "The unique ID of the client, obtained from create_client_profile."
       },
       "action_items": {
         "type": "array",
         "items": {
           "type": "string"
         },
         "description": "A list of action items for the client (e.g., ['Update resume', 'Research three companies'])."
       }
     },
     "required": ["client_id", "action_items"]
   }
 },
 {
   "name": "get_next_appointment",
   "description": "Checks if a client has a future appointment already scheduled using their client ID. Returns the appointment details or null. \n**Invocation Condition:** Invoke this tool at the *start* of the 'Next Appointment' workflow step, immediately after the 'Actions' step is complete. This is used to check if an appointment *already exists*.",
   "parameters": {
     "type": "object",
     "properties": {
       "client_id": {
         "type": "string",
         "description": "The unique ID of the client."
       }
     },
     "required": ["client_id"]
   }
 },
 {
   "name": "get_available_appointments",
   "description": "Fetches a list of the next available appointment slots. \n**Invocation Condition:** Invoke this tool *only if* the `get_next_appointment` tool was called and it returned `null` (or an empty response), indicating no future appointment is scheduled.",
   "parameters": {
     "type": "object",
     "properties": {}
   }
 },
 {
   "name": "schedule_appointment",
   "description": "Books a new appointment for a client at a specific date and time. \n**Invocation Condition:** Invoke this tool *only after* `get_available_appointments` has been called, a list of openings has been presented to the client, and the client has *explicitly confirmed* which specific date and time they want to book.",
   "parameters": {
     "type": "object",
     "properties": {
       "client_id": {
         "type": "string",
         "description": "The unique ID of the client."
       },
       "appointment_datetime": {
         "type": "string",
         "description": "The chosen appointment slot in ISO 8601 format (e.g., '2025-10-30T14:30:00')."
       }
     },
     "required": ["client_id", "appointment_datetime"]
   }
 }
]
```

## 定價與計費 {#pricing-billing}

Gemini Live API 嚴格依照權杖用量計費。由於 Live API 維持持續性的 WebSocket 工作階段，計費會依照使用中的上下文視窗，採用複合累計模式。

### 工作階段上下文視窗（複合成本） {#session-context-window}

API 會針對工作階段上下文視窗中存在的所有權杖，按輪向您收費。一「輪」定義為一次使用者輸入加上模型對應的回應。

*   **累積**：上下文視窗包含目前這一輪的新權杖，以及先前各輪累積的所有權杖。
*   **重複計費**：過去的權杖會在每一輪重新處理並計入費用，上限為您設定的上下文視窗大小。隨著工作階段拉長，每輪成本會上升，因為對話記錄會被重新處理。

### 音訊權杖與轉錄 {#audio-tokens-and-transcriptions}

Live API 本身即為多模態。它會以原始音訊權杖的形式保留對話記錄，以保存聲音的細微差異與語氣。

*   **音訊計費**：API 會在每一輪，依照標準音訊輸入費率，向您收取累積的原生音訊權杖費用。
*   **轉錄附加費**：啟用音訊轉文字轉錄時（`inputAudioTranscription` 或 `outputAudioTranscription`），API 除了標準音訊權杖費用外，還會依照文字權杖輸出費率，收取為轉錄生成的所有文字權杖費用。

### 以上下文上限管理成本 {#managing-costs}

為避免長時間工作階段的成本無限增長，請使用 `contextWindowCompression` 設定上下文視窗大小。

設定壓縮觸發門檻（例如 25,000 個權杖）與滑動視窗（例如 8,000 個權杖）後，API 會在達到門檻時自動淘汰較舊的權杖。之後各輪，API 只會針對保留的記錄與任何新權杖計費。

### 主動音訊模式 {#proactive-audio-mode}

啟用主動音訊模式時，Live API 聆聽的整個期間都會收取輸入權杖費用，而輸出權杖僅在 API 回應時才收費。

*   **Gemini 3.8 與 3.1 注意事項**：`gemini-3.8-live` 與 `gemini-3.8-live-extended-thinking` 支援主動音訊模式。`gemini-3.1-flash-live-preview` 不支援；使用該模型時，僅在主動串流輸入時才會收取音訊費用。

詳細定價資訊請參閱 [Gemini API 定價頁面](/docs/pricing/)。
