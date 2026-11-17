# 在 Google AI Studio 開發全端應用程式

Google AI Studio 現在支援全端開發，讓你能建置超越用戶端原型的應用程式。透過伺服器端執行環境，你可以管理機密、連接外部 API，並建置即時多人體驗。

## 伺服器端執行環境 {#server-side}

Google AI Studio 應用程式現在可以包含伺服器端元件（Node.js）。這讓你能：

- **執行伺服器端邏輯**：執行不應向用戶端公開的程式碼。

- **存取 npm 套件**：[Antigravity Agent](https://antigravity.google/docs/agent) 可以安裝並使用龐大 npm 生態系中的套件。

- **處理機密**：安全地使用 API 金鑰與憑證。


### 使用 npm 套件 {#use-npm-packages}

你不需要手動執行 `npm install`。只要請 Agent 加入需要套件的功能，它就會處理安裝與匯入。

**Example**： > "Use `axios` to fetch data from the external API."

## 安全地管理機密 {#secrets}

有了伺服器端程式碼與機密管理，你現在可以建置與外界互動的應用程式。

### Gemini API 金鑰 {#gemini-api-key}

當你建立使用 Gemini API 的新應用程式時，AI Studio 會自動將你的 `GEMINI_API_KEY` 設定為伺服器端機密，無需手動設定。你可以在 Settings 的 **Secrets** 面板中檢視這把金鑰。你的應用程式會使用這把金鑰，從伺服器端程式碼發出 Gemini API 呼叫，因此金鑰絕不會在瀏覽器中公開。

### 第三方 API 金鑰 {#third-party-keys}

對於其他服務，你可以手動加入 API 金鑰：

- **第三方 API**：連接 Stripe、SendGrid 等服務，或自訂 REST API。

- **資料庫**：連接外部資料庫（例如透過 Supabase、Firebase 或 MongoDB Atlas），將資料持久保存至工作階段之外。


建置實際應用程式時，你經常需要連接需要 API 金鑰的第三方服務（例如 Twilio、Slack 或資料庫）。你可以依照以下步驟手動加入金鑰：

1. **加入機密**：前往 Google AI Studio 的 **Settings** 選單，找到 Secrets 區段。

2. **儲存你的金鑰**：在這裡加入你的 API 金鑰或機密權杖。

3. **在程式碼中存取**：Agent 可以撰寫伺服器端程式碼，安全地存取這些機密（通常透過環境變數），確保它們絕不會向用戶端瀏覽器公開。


需要時，Agent 也會在聊天中顯示卡片，提示你加入金鑰；無論是需要新的機密時，或在專案的環境變數中偵測到新金鑰時，都會如此。

### 用於資料庫與驗證的 Firebase 整合 {#firebase-integration}

Google AI Studio 現在讓你能透過 [Firebase integration](https://firebase.google.com/docs/ai-assistance/ai-studio-integration)，輕鬆為應用程式加入資料庫或驗證功能。Antigravity Agent 可以自動為你佈建並設定以下服務：

- **Firestore database**：靈活、可擴展的 NoSQL 雲端資料庫，可為用戶端與伺服器端開發儲存並同步資料。

- **Firebase Authentication**：讓你的使用者透過「Sign in with Google」流程，安全地登入你的應用程式。


只要請 Agent「add a database to my app」或「set up Google Sign-in」，它就會為你處理必要的設定與程式碼產生。建置 [Android apps](/docs/aistudio-android/#firebase-integration) 時，Firebase 整合也會佈建 **Firebase AI Logic** 與 **Firebase App Check**，以便安全地從用戶端發出 Gemini API 呼叫。

Firebase 讓你能免費開始使用，並在你準備好取得更多配額或使用付費功能時，隨時選擇以付費帳戶擴展規模。

## Google Workspace API {#workspace}

Google AI Studio 讓你能建置連接 Google Workspace API 的應用程式，讓你的使用者能在應用程式中處理他們的真實資料：電子郵件、試算表、文件、行事曆活動等。你不再需要設定 Google Cloud 專案、設定 OAuth，或手動管理你的 API。

### 運作方式 {#workspace-how}

你可以用兩種方式加入 Workspace 整合：

- **在聊天面板中描述**：只要在底部的聊天面板中告訴 Agent 你想要什麼。例如，*"Build an expense tracker that logs receipts to my Google Sheet"* 或 *"Create a dashboard that summarizes my unread Gmail messages."*
- **從整合面板選取**：在 Build mode 右側邊欄中開啟 **Integrations** 面板，並啟用你想連接的 Workspace 應用程式。

加入 Workspace 應用程式後，AI Studio 會自動：

1. 為你的應用程式接上必要的 Google API。
2. 產生呼叫該 API 的伺服器端程式碼。
3. 加入安全的「Sign in with Google」流程，讓你應用程式的最終使用者能授權存取他們自己的資料。

### 受支援的應用程式 {#workspace-apps}

以下 Google Workspace 應用程式可供使用：

| App | 你可以建置什麼 |
| --- | --- |
| Google Calendar | 讀取、建立並管理活動與行事曆 |
| Google Chat | 讀取對話與群組空間並與之互動 |
| Google Docs | 建立、讀取、更新文件並設定格式 |
| Google Drive | 組織、搜尋並管理檔案與資料夾 |
| Google Forms | 建立問卷、更新問題並擷取回覆 |
| Gmail | 讀取、傳送並管理電子郵件內容 |
| Google Keep | 管理筆記、清單與附件 |
| Google Meet | 安排並管理視訊通話 |
| Contacts | 同步並管理聯絡人 |
| Google Sheets | 讀取、寫入試算表資料並設定格式 |
| Google Slides | 建立並修改簡報 |
| Google Tasks | 建立、管理並組織工作 |

### 驗證與權限 {#workspace-auth}

身為建置者，你不需要設定 OAuth 用戶端、管理憑證，或設定 Google Cloud 專案。AI Studio 會為你處理這一切。

整合 Workspace API 的應用程式使用「Sign in with Google」來驗證最終使用者。當使用者開啟你的應用程式時，系統會提示他們登入，並授予你的應用程式所需的特定權限（例如，對其行事曆的唯讀存取權，或編輯試算表的能力）。你的應用程式只會存取正在使用它的那個人的資料。每位使用者都會授權存取他們自己的帳戶。

### 範例提示詞 {#workspace-examples}

以下是幾個幫助你開始使用 Workspace 整合的想法：

- *"Build an app that reads my Google Calendar and drafts prep emails in Gmail for each meeting."*

- *"Create a tool that takes a Google Doc and generates a 5-slide summary presentation in Google Slides."*

- *"Make an expense tracker where I upload a receipt, Gemini extracts the details, and it logs a new row in my Google Sheet."*


### 設定 OAuth {#oauth-setup}

機密管理的一個關鍵使用案例，是設定 OAuth 以連接其他網站或應用程式。當你的提示詞包含連接需要 OAuth 驗證的第三方應用程式的指示時，Agent 會提供如何為該應用程式設定 OAuth 的指示。這些指示會包含設定你的 OAuth Application 所需的回呼網址。你也可以在 Settings 面板的 **Integrations** 下找到回呼網址。

## 建置多人體驗 {#multiplayer}

全端執行環境可實現即時協作功能。

- **即時狀態**：你可以請 Agent 建置「a live chat」、「a collaborative whiteboard」或「a multiplayer game」等功能。

- **同步的工作階段**：伺服器會管理狀態，讓多位使用者能即時與同一個應用程式執行個體互動。


**Example prompt**： > "Make this a multiplayer game where players can see each other's cursors."

### 測試多人應用程式的提示 {#testing-multiplayer}

在部署應用程式之前，你可以用兩種方式測試多人模式。

1. 在多個分頁中於 Google AI Studio Build mode 開啟你的應用程式。在 Build mode 中開發時，你的應用程式位於開發容器中。在多個分頁中開啟應用程式，可以讓你模擬多位玩家使用你的應用程式。

2. 使用右上角的 **Share** 選單將應用程式分享給他人。然後使用 **Share** 選單的 **Integrations** 分頁中的 **Shared URL**，與你已分享應用程式的玩家一起使用該應用程式。


## 最佳做法 {#best-practices}

- **Gemini API calls**：你的 `GEMINI_API_KEY` 會自動設定為伺服器端機密。請使用這把金鑰，從你的伺服器端程式碼發出 Gemini API 呼叫。你可以在 **Secrets** 面板中檢視它。

- **Secrets security**：務必使用 Secrets 管理工具處理敏感金鑰。絕不要將它們寫死在檔案中。

- **Separation of concerns**：將你的 UI 邏輯保留在用戶端框架（React/Angular）中，並將你的業務邏輯／資料處理保留在伺服器端。

- **Error handling**：確保你的伺服器端程式碼能穩健地處理外部 API 呼叫的錯誤，以防止應用程式當機。


## 後續步驟 {#whats-next}

- [Build apps in Google AI Studio](/docs/aistudio-build-mode/)
- [Publish your app in Google AI Studio](/docs/aistudio-deploying/)
- [App Gallery](https://aistudio.google.com/apps?source=showcase)
