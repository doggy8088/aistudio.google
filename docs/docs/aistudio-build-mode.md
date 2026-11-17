# 在 Google AI Studio 中打造應用程式

本頁說明如何使用 Google AI Studio，快速打造（即所謂的「vibe coding」）並部署應用程式，體驗 Gemini 的最新能力，例如 [Nano Banana](/docs/image-generation/) 與 [Live API](/docs/live-api/)。Google AI Studio 支援打造具備全端執行環境的**網頁應用程式**，以及使用 Kotlin 與 Jetpack Compose 的**原生 Android 應用程式**，全程只需以自然語言下提示詞。

## 開始使用 {#get-started}

在 Google AI Studio 的 [Build mode](https://aistudio.google.com/apps) 中開始 vibe coding。你可以透過以下幾種方式開始打造：

- **Start with a prompt**：在 Build mode 中，使用輸入框描述你想打造的內容。選取 AI Chips，即可將圖片生成或 Google Maps 資料等特定功能加入提示詞。你甚至可以點選語音轉文字按鈕，直接用說的表達需求。

- **"I'm Feeling Lucky" button**：需要一點創意火花時，使用 "I'm Feeling Lucky" 按鈕，Gemini 會產生一個帶有專案構想的提示詞，助你起步。

- **Remix a project from the gallery**：從 [App Gallery](https://aistudio.google.com/apps?source=showcase) 開啟專案，然後選取 **Copy App**。

- **Import a project from GitHub**：在 Build mode 中，從提示詞輸入框的 **Add files**（+ 圖示）選單選取 **Import from GitHub**，即可匯入你現有的程式碼。


執行提示詞後，你會看到所需的程式碼與檔案陸續產生，右側同時出現應用程式的即時預覽。

## 產生了什麼？ {#what-is-created}

執行提示詞時，AI Studio 會建立一個完整的應用程式。你可以使用平台選擇器，選擇要打造**網頁應用程式**或**原生 Android 應用程式**。

對於**網頁應用程式**（預設），AI Studio 會建立一個全端環境，其中包括：

- **Client-side**：網頁前端（預設為 React）。
- **Server-side**：Node.js 執行環境，可安全地呼叫 API、連接資料庫，並使用 npm 套件。

對於 **Android 應用程式**，AI Studio 會產生 Kotlin 與 Jetpack Compose 專案，你可以在瀏覽器中的模擬器預覽、安裝到實體裝置上，並發布到 Play Store 進行測試。[進一步瞭解如何打造 Android 應用程式](/docs/aistudio-android/)。

選取右側預覽窗格中的 **Code** 分頁，即可查看產生的程式碼。**Antigravity Agent** 會智慧地管理整個技術堆疊中的多個檔案，確保變更正確傳遞。

### The Antigravity Agent {#antigravity-agent}

**Antigravity Agent** 是 [Google Antigravity](https://antigravity.google) 中的主要 AI 功能，如今其代理框架的核心元件也驅動著 Google AI Studio 的 Build mode 體驗。它不只是單純產生程式碼，還能掌握整個專案的上下文、管理多個檔案，並理解複雜指令，打造穩健的全端應用程式。

主要能力包括：

- **Context awareness**：掌握先前提示詞與檔案狀態的上下文。
- **Multi-file management**：處理多個檔案之間的相依關係。
- **Verified execution**：驗證程式碼更新，減少幻覺。

## 全端能力 {#full-stack}

Google AI Studio 釋放了現代網頁生態系的能量，讓你打造的不只是用戶端原型。

- **Server-side runtime & npm**：使用龐大的 npm 套件庫。代理會自動找出並安裝應用程式所需的套件（例如資料視覺化或 API 用戶端的特定程式庫）。你也可以視需要指定想要的套件。

- **Secrets management**：在 **Settings** 選單中安全地儲存 API 金鑰與機密資訊。這些資訊可在伺服器端程式碼中存取，不會暴露於用戶端。

- **Multiplayer**：直接在 AI Studio 中打造即時協作體驗。伺服器端執行環境會管理使用者即時互動所需的狀態與連線。

- **Firebase Firestore and Authentication**：自動佈建並設定 Firebase，包括 Firestore 資料庫（持久性資料儲存）與 Firebase Authentication（登入流程，特別是「Sign in with Google」）。代理會處理整個設定流程，甚至為你在應用程式中寫好使用這些服務的程式碼。

- **Google Workspace integrations**：將應用程式連接到 Gmail、Sheets、Docs、Drive、Calendar 等 Google Workspace API。AI Studio 會自動處理所有 OAuth 設定。


[進一步瞭解如何開發全端應用程式](/docs/aistudio-fullstack/)

### Android apps {#android}

你也可以使用 Kotlin 與 Jetpack Compose 打造原生 Android 應用程式。在瀏覽器中的 Android 模擬器預覽應用程式，透過瀏覽器中的 ADB 將其安裝到實體裝置，並發布到 Play Store 進行內部測試。

AI Studio 也為 Android 應用程式整合了 [Firebase](https://firebase.google.com/docs/ai-assistance/ai-studio-integration)，可自動佈建 **Firebase AI Logic** 與 **Firebase App Check**（讓用戶端能安全地呼叫 Gemini API，不必暴露原始 API 金鑰），以及 **Cloud Firestore** 與 **Firebase Authentication**。

[進一步瞭解如何打造 Android 應用程式](/docs/aistudio-android/)

## 繼續打造 {#continue-building}

Google AI Studio 為你的應用程式產生初始程式碼後，你可以繼續加以改進：

### 在 Google AI Studio 中打造 {#build-google}

- **Iterate with Gemini**：使用 **Build mode** 中的聊天面板，請 Gemini 進行修改、新增功能或變更樣式。

- **Edit the code directly**：開啟預覽面板中的 **Code tab**，直接即時編輯程式碼。


### 在外部開發 {#develop-externally}

若需要更進階的工作流程，你可以同步或匯出程式碼，在偏好的環境中作業：

- **Sync with GitHub**：將應用程式連接到 GitHub 存放區，啟用雙向同步。你可以將在 AI Studio 中以提示詞產生的變更，連同 AI 產生的提交訊息直接推送到存放區；也可以將在本機 IDE 中或由團隊成員所做的變更拉回 AI Studio。你隨時可以在 Settings 的 **GitHub** 分頁中管理同步狀態。

- **Download and develop locally**：將產生的程式碼匯出為 **ZIP file**，再匯入你的程式碼編輯器。


## 主要功能 {#key-features}

Google AI Studio 包含多項功能，讓打造過程直覺又視覺化：

- **Create and iterate on full stack apps**：只需一個提示詞即可建立全端應用程式，並透過聊天或 **annotation mode** 反覆調整。在標註模式中，你可以標示應用程式介面的任何部分，並描述想要的變更。

- **Share and deploy your app**：你可以與他人分享你的作品，一起協作或展示成果。分享時，API 呼叫會計入你的用量上限；若使用付費模型，可能產生費用。當應用程式準備就緒後，即可部署到 Cloud Run。

- **App gallery**：App Gallery 提供視覺化的專案構想庫。你可以瀏覽 Gemini 的各種可能性、即時預覽應用程式，並加以 remix，改造成自己的作品。


## 發布或封存你的應用程式 {#deploy-or}

應用程式準備就緒後，你可以發布或匯出它：

- **Cloud Run**：將應用程式發布為可擴展的服務。可能會依用量收取 [Google Cloud Run](https://cloud.google.com/run) 的費用。詳情請參閱 [在 Google AI Studio 中發布應用程式](/docs/aistudio-deploying/)。

-   **Custom domains**：在付費 Google Cloud 專案上發布時，直接從 **Publish** 面板購買並連接你自己的網域。請參閱 [Google AI Studio 中的自訂網域](/docs/aistudio-custom-domains/)。

- **GitHub**：將專案與新的或現有的 GitHub 存放區同步，以管理原始碼或與團隊成員協作。


## 限制 {#limitations}

本節列出 Google AI Studio 中 Build mode 目前的限制。

### API Key management {#api-key-management}

當你建立使用 Gemini API 的新網頁應用程式時，AI Studio 會自動將你的 Gemini API 金鑰設定為應用程式伺服器端環境中的機密資訊。你可以在 **Secrets** 面板中查看及管理這把金鑰。

- **Automatic setup**：你的 `GEMINI_API_KEY` 已自動設定完成，無需手動設定即可開始打造。

- **Server-side only**：API 金鑰只會注入伺服器端執行環境，絕不會出現在用戶端程式碼中。

- **Existing apps**：對於 2026 年 5 月 14 日之前打造的應用程式，下次你修改應用程式的 Gemini 功能時，代理會自動將你的 Gemini API 整合升級為建議的伺服器端做法。


#### Android apps {#android-api-key-management}

打造 Android 應用程式時，AI Studio 使用 [Firebase AI Logic 與 Firebase App Check](/docs/aistudio-android/#firebase-integration)，而非原始 API 金鑰，因此憑證絕不會嵌入你的 APK。

### 在 Google AI Studio 之外部署 {#deployment-outside-google-ai-studio}

- **Cloud Run**：從 AI Studio 部署到 Cloud Run 時，你的 API 金鑰會安全地包含在伺服器端環境中。部署後的應用程式會使用你的 API 金鑰，處理所有使用者的 Gemini API 呼叫。

- **ZIP download**：若你將應用程式下載為 ZIP 檔案並在其他地方執行，你需要在代管環境中設定 `GEMINI_API_KEY` 環境變數。由於應用程式的 Gemini API 呼叫是從伺服器端程式碼發出的，金鑰不會暴露給最終使用者。


### 分享應用程式時發生錯誤 {#error-when-sharing-apps}

若你分享應用程式，而最終使用者在使用分享的網址時遇到 **403 Access Restricted** 錯誤，可能是下列原因之一：

- **Browser extensions**：Privacy Badger 等隱私擴充功能可能會封鎖應用程式。停用該擴充功能即可避免此錯誤。
- **Build issues**：目前的程式碼可能有問題。請提示代理「fix any build issues with the current code」，然後重新分享網址。

## 常見問題 {#faq}

### 什麼是 AI Studio 中的 Build？ {#what-is-build}

AI Studio Build 是一個平台，旨在透過 Gemini，將簡單的提示詞轉化為可投入生產環境的 AI 應用程式。只要用提示詞描述你想打造的內容，Gemini 就會為你產生應用程式。你也可以探索我們的圖庫，看看 Gemini API 的各種可能性，並 remix 應用程式，改造成自己的作品。

### Build 如何處理我的 Gemini API 金鑰？ {#how-api-key}

當你建立使用 Gemini API 的網頁應用程式時，AI Studio 會自動將你的 Gemini API 金鑰設定為伺服器端機密資訊。應用程式的 Gemini API 呼叫會從伺服器端程式碼使用這把金鑰發出，因此金鑰絕不會在瀏覽器中暴露。你可以在 Settings 的 **Secrets** 面板中查看你的 API 金鑰。對於 Android 應用程式，AI Studio 使用 [Firebase AI Logic 與 Firebase App Check](/docs/aistudio-android/#firebase-integration) 進行安全的用戶端呼叫，不會將 API 金鑰嵌入應用程式的二進位檔。

### 分享應用程式時，我的 API 金鑰會暴露嗎？ {#api-key-exposed}

不會。你的 API 金鑰儲存為伺服器端機密資訊，絕不會出現在用戶端程式碼中。當你分享應用程式時，其他使用者可以使用它，但看不到你的 API 金鑰。

與他人分享應用程式時，API 呼叫會計入你的用量上限；若使用付費模型，可能產生費用。若你的應用程式可能產生費用，AI Studio 會在設定過程中以及分享之前提醒你。

### 誰可以看見我的應用程式？ {#who-can-see}

你的應用程式預設為私人狀態。你可以將應用程式分享給其他使用者，讓他們使用。獲你分享應用程式的使用者可以查看其程式碼，並 fork 出來供自己使用。若你以編輯權限分享應用程式，其他使用者可以編輯應用程式的程式碼。

### 我可以在 AI Studio 之外執行應用程式嗎？ {#run-outside}

可以。你可以從 AI Studio 將應用程式部署到 [Cloud Run](https://cloud.google.com/run)，為應用程式取得公開網址，並將你的 API 金鑰安全地設定在伺服器端環境中。你也可以將應用程式下載為 ZIP 檔案，在其他地方代管。你需要在代管環境中設定 `GEMINI_API_KEY` 環境變數。由於 Gemini API 呼叫是從伺服器端程式碼發出的，你的金鑰能保持安全。

如需進一步瞭解發布選項，請參閱 [在 Google AI Studio 中發布應用程式](/docs/aistudio-deploying/)。

### 我可以用自己的工具在本機開發應用程式，再到這裡分享嗎？ {#locally-develop}

可以。你可以將 AI Studio 應用程式連接到 GitHub 存放區，使用偏好的程式碼編輯器或 CLI 工具在本機開發，將變更推送到 GitHub，然後透過 Settings 中的 **GitHub** 分頁，將這些更新直接拉回 AI Studio。

### 如何在應用程式中使用資料庫或其他儲存空間？ {#database-storage}

AI Studio 應用程式是執行於 Cloud Run 容器中的標準應用程式。你可以使用任何能透過網路連接的儲存解決方案，前提是沒有防火牆阻擋來自動態 IP 範圍的存取。

我們正著手在未來加入對儲存空間的直接支援，屆時你將能直接在 AI Studio 中設定。

### 如何存取麥克風、網路攝影機及其他 Navigator API？ {#navigator-apis}

為確保檢視者知道應用程式會使用他們的網路攝影機或其他裝置，我們要求應用程式在存取這些 [Navigator APIs](https://developer.mozilla.org/en-US/docs/Web/API/Navigator) 之前，必須先取得額外的確認。應用程式建立者可以將這些權限要求加入應用程式的 `metadata.json` 檔案。例如：

```json
{
  "name": "My app",
  "requestFramePermissions": [
    "microphone",
    "camera",
    "display-capture",
    "geolocation",
    "bluetooth",
    "clipboard-read",
    "serial",
    "usb"
  ]
}
```

`requestFramePermissions` 支援的值，是標準 [policy-controlled features](https://github.com/w3c/webappsec-permissions-policy/blob/main/features) 的子集。

### 如何在應用程式中使用 GitHub？ {#github-integration}

AI Studio 支援與 GitHub 的雙向同步：

- **Import a repository**：在 Build mode 中，從提示詞輸入框的 **Add files**（+ 圖示）選單選取 **Import from GitHub**，匯入現有的程式碼。

- **Link a repository**：在 Settings 中開啟 **GitHub** 分頁，從你的應用程式建立新的 GitHub 存放區，或連結到現有的存放區。

- **Two-way sync**：將在 AI Studio 中以提示詞產生的變更，連同 AI 產生的提交訊息直接推送到存放區；或將在外部所做的變更（例如本機 IDE 編輯或團隊成員的 pull request）拉回 AI Studio。

- **Resolve merge conflicts**：若與 GitHub 同步時變更發生衝突，AI Studio 會提供 **Resolve conflicts** 對話框，附有並排的差異檢視器，讓你檢視差異，並為每個衝突的檔案選擇保留 AI Studio 或 GitHub 的版本。


### 我可以讓其他使用者編輯我的應用程式嗎？ {#edit-access}

AI Studio 不支援直接的即時協作編輯。不過，你可以將應用程式連結到共用的 GitHub 存放區，與團隊成員協作。團隊成員可以在 GitHub 上推送變更或開啟 pull request，你再將這些更新拉入 AI Studio。

### 為什麼我的應用程式被標記為違反政策？ {#policy-violation}

我們設有系統，會自動審查應用程式，確保其符合我們的政策。若發現應用程式違反政策，該應用程式將從 AI Studio 中移除。違反政策的情形包括但不限於：

- 含有惡意軟體、網路釣魚或冒充行為的應用程式
- 顯示或散布違反兒童性虐待圖像政策內容的應用程式
- 顯示或散布違反騷擾政策內容的應用程式
- 顯示或散布違反仇恨言論政策內容的應用程式
- 顯示或散布違反人口販運政策內容的應用程式
- 顯示或散布違反色情內容政策內容的應用程式
- 顯示或散布違反暴力與血腥政策內容的應用程式
- 顯示或散布違反有害或危險政策內容的應用程式

若你的應用程式被標記為違反政策，而你認為這是誤判，可以提出申訴。屢次違反政策，可能導致你存取 AI Studio 的權限被終止。

### 我身為應用程式開發者有哪些責任？ {#developer-responsibilities}

提醒你，身為應用程式的擁有者，你須對其行為及所處理的一切資料負責，包括：

- **Legal Compliance and Third Party Rights**：確保你的應用程式符合所有適用的法律與法規，且不侵犯他人的權利，包括智慧財產權與隱私權。

- **Content Monitoring**：你的應用程式所使用的其他服務，可能適用額外條款的規範。例如，適用於 Firestore 的 [Google Cloud Terms of Service](https://cloud.google.com/terms) 要求代管第三方內容的客戶發布政策，界定哪些內容是被禁止的（例如非法內容），並監控該等非法內容是否存在。

- **Safe Implementation**：實作必要的安全措施與審核工具，防止你的應用程式遭到濫用。


請留意服務條款中的[使用限制](/docs/terms/#use-restrictions)。

### AI Studio 應用程式圖庫中的應用程式適用哪些條款？ {#gallery-terms}

[Gemini API Additional Terms of Service](/docs/terms/) 適用於 AI Studio 應用程式圖庫中精選應用程式的使用情形，除非另有說明。

## 後續步驟 {#whats-next}

- [開發全端應用程式](/docs/aistudio-fullstack/)（web）
- [打造 Android 應用程式](/docs/aistudio-android/)
- 在 [App Gallery](https://aistudio.google.com/apps?source=showcase) 中查看範例。


