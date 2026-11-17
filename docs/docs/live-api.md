# Gemini Live API 總覽

Live API 讓使用者能以低延遲、即時的方式，透過語音與視覺和 Gemini 互動。它會處理連續的音訊、圖片與文字串流，即時給出自然流暢、近似真人的語音回應，為使用者帶來自然的對話體驗。

![](https://www.gstatic.com/cloud-cms/995b16822e9fa0e87694e97e1da60e42.png)

[在 Google AI Studio 中試用 Live API](https://aistudio.google.com/live)

[從 GitHub 複製範例應用程式](https://github.com/google-gemini/gemini-live-api-examples)

[使用程式設計代理技能](/docs/coding-agents/)

## 使用案例 {#use-cases}

Live API 可用於為各行各業打造即時語音代理，包括：

* **電子商務與零售：** 提供個人化推薦的購物助理，以及協助解決客戶問題的支援代理。

* **遊戲：** 互動式非玩家角色（NPC）、遊戲內協助助理，以及遊戲內容的即時翻譯。

* **新一代介面：** 機器人、智慧眼鏡與車輛中的語音與影片互動體驗。

* **醫療保健：** 為病患提供支援與衛教的健康夥伴。

* **金融服務：** 提供財富管理與投資建議的 AI 顧問。

* **教育：** 提供個人化教學與回饋的 AI 導師與學習夥伴。

* **翻譯與在地化：** 即時、低延遲的口語對話翻譯，實現流暢的多語言溝通。

* **即時轉錄與字幕：** 即時語音轉文字串流，適用於即時字幕、會議轉錄、語音聽寫與客服通話紀錄。


## 主要功能 {#key-features}

Live API 提供一整套完善的功能，協助打造穩健的語音代理：

* [**多語言支援**](/docs/live-api/capabilities/#supported-languages)：
  可使用 70 種支援語言進行對話。

* [**插話**](/docs/live-api/capabilities/#interruptions)：
  使用者可隨時打斷模型，讓互動更靈敏即時。

* [**工具使用**](/docs/live-api/tools/)：
  整合函式呼叫與 Google 搜尋等工具，實現動態互動。

* [**音訊轉錄**](/docs/live-api/capabilities/#audio-transcription)：
  同時提供使用者輸入與模型輸出的文字轉錄。

* [**主動式音訊**](/docs/live-api/capabilities/#proactive-audio)：
  讓你控制模型在何時、以及在什麼情境下回應。

* [**情感對話**](/docs/live-api/capabilities/#affective-dialog)：
  依使用者的表達方式調整回應風格與語氣。

* [**Live Transcription**](/docs/live-api/live-transcribe/)：
  即時、連續的語音轉文字串流，具備自動語言偵測與自訂詞彙功能。

* [**Live Translation**](/docs/live-api/live-translate/)：
  支援 70 多種語言的即時語音對語音翻譯。


## 技術規格 {#technical-specifications}

下表列出 Live API 的技術規格：


| 類別 | 詳細資訊 |
| --- | --- |
| 輸入模態 | 音訊（原始 16 位元 PCM 音訊，16kHz，小端序）、圖片（JPEG <= 1FPS）、文字 |
| 輸出模態 | 音訊（原始 16 位元 PCM 音訊，24kHz，小端序） |
| 通訊協定 | 具狀態的 WebSocket 連線（WSS） |


## 選擇實作方式 {#implementation-approach}

整合 Live API 時，你需要從下列實作方式中擇一：

- **Server-to-server**：你的後端透過 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 連接到 Live API。一般來說，用戶端會將串流資料（音訊、影片、文字）傳送到你的伺服器，再由伺服器轉送至 Live API。

- **Client-to-server**：你的前端程式碼透過 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 直接連接到 Live API 串流資料，略過後端。


!!! note " "

      注意：Client-to-server 在串流音訊與影片時通常能提供較佳的效能，因為它不需要先將串流傳送到你的後端，設定上也較簡單，不必實作將資料從用戶端傳到伺服器、再由伺服器傳到 API 的代理。不過，在正式環境中，為了降低安全風險，我們建議使用[臨時權杖](/docs/live-api/ephemeral-tokens/)，而不要使用標準 API 金鑰。


## 開始使用 {#get-started}

請依你的開發環境選擇對應的指南：


  

**[GenAI SDK tutorial](/docs/live-api/get-started-sdk/)**

使用 GenAI SDK 連接到 Gemini Live API，打造具備 Python 後端的即時多模態應用程式。


  

**[WebSocket tutorial](/docs/live-api/get-started-websocket/)**

使用 WebSockets 連接到 Gemini Live API，打造具備 JavaScript 前端與臨時權杖的即時多模態應用程式。


  

**[ADK tutorial](https://google.github.io/adk-docs/streaming/)**

Create


## 合作夥伴整合 {#partner-integrations}

若要簡化即時音訊與影片應用程式的開發流程，你可以使用支援透過 WebRTC 或 WebSockets 存取 Gemini Live API 的第三方整合方案。


  

**[LiveKit](https://docs.livekit.io/agents/models/realtime/plugins/gemini/)**

搭配 LiveKit Agents 使用 Gemini Live API。


  

**[Pipecat by Daily](https://docs.pipecat.ai/guides/features/gemini-live)**

使用 Gemini Live 與 Pipecat 建立即時 AI 聊天機器人。


  

**[Fishjam by Software Mansion](https://docs.fishjam.io/tutorials/gemini-live-integration)**

使用 Fishjam 建立即時影片與音訊串流應用程式。


  

**[Vision Agents by Stream](https://visionagents.ai/integrations/gemini)**

使用 Vision Agents 打造即時語音與影片 AI 應用程式。


  

**[Voximplant](https://voximplant.com/products/gemini-client)**

透過 Voximplant 將來電與去電連接到 Live API。


  

**[Agora](https://docs.agora.io/en/conversational-ai/models/mllm/gemini)**

使用 Agora 打造即時對話式 AI 應用程式。


  

**[Firebase AI SDK](https://firebase.google.com/docs/ai-logic/live-api?api=dev)**

使用 Firebase AI Logic 開始使用 Gemini Live API。
