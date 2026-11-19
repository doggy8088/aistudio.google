# 在 Google AI Studio 中建構 Android 應用程式

Google AI Studio 讓你用自然語言提示詞建構原生 Android 應用程式。只要描述你想要的應用程式，[Antigravity Agent](/docs/aistudio-build-mode/#antigravity-agent) 就會產生完整的 Kotlin 與 [Jetpack Compose](https://developer.android.com/develop/ui/compose) 專案。你可以在瀏覽器中透過瀏覽器型 Android 模擬器預覽應用程式、將它安裝到實體裝置上，並發佈它進行測試。

Android 應用程式也支援 [Firebase integration](/docs/aistudio-android/#firebase-integration)，可透過 Firebase AI Logic 與 App Check 呼叫 Gemini 模型、將資料儲存在 Cloud Firestore 中，並使用 Firebase Authentication 讓使用者登入。


!!! note " "

       注意：AI Studio 中的 Android 應用程式僅為用戶端。需要伺服器端執行環境的功能，例如 [Google Workspace APIs](/docs/aistudio-fullstack/#workspace)、[secrets management](/docs/aistudio-fullstack/#secrets) 與 [multiplayer](/docs/aistudio-fullstack/#multiplayer)，僅適用於網頁應用程式。 


## 開始使用 {#get-started}

若要開始建構 Android 應用程式：

1. 使用左側導覽面板，前往 Google AI Studio 的 [Build mode](https://aistudio.google.com/apps)。
2. 從平台選取器中選取 **Android**。
3. 輸入描述你想建構的應用程式的提示詞（例如 *「Create a daily task tracker with local storage」* 或 *「Build a recipe app that uses AI to suggest meals from ingredients」*）。
4. 代理會產生專案，並在瀏覽器型 Android 模擬器中啟動它。

接著，你可以像網頁體驗一樣，使用聊天面板反覆迭代你的應用程式。代理會管理 Android 專案中的所有檔案，並將變更傳播到整個程式碼庫。

## Firebase 整合 {#firebase-integration}

Google AI Studio 與 [Firebase](https://firebase.google.com/docs/ai-assistance/ai-studio-integration) 整合，讓你的 Android 應用程式無需自訂伺服器端後端，就能安全地呼叫 Gemini 模型、儲存資料並驗證使用者。當你提示代理建構需要生成式 AI、資料庫或登入功能的功能時，它可以自動在你的 Firebase 專案中佈建並設定以下服務：

- **[Firebase AI Logic](https://firebase.google.com/docs/ai-logic) 與 [Firebase App Check](https://firebase.google.com/docs/ai-logic/app-check)**：直接從你的 Android 應用程式呼叫 Gemini 模型，無需在 APK 中嵌入原始 API 金鑰。AI Studio 會自動設定 App Check，驗證要求來自你應用程式的真實執行個體：

  -   **測試與共用（偵錯建構版本）**：在瀏覽器型模擬器中預覽、透過 USB 安裝或與測試人員共用時，使用由 AI Studio 自動管理的 App Check 偵錯 token。
  -   **發佈到 Google Play（正式建構版本）**：在建構供 Google Play 使用的正式版本時，自動切換至使用預先設定網站金鑰的 reCAPTCHA Enterprise。

- **Cloud Firestore**：在 NoSQL 雲端資料庫中儲存並同步資料，包括自動產生的 Firestore Security Rules（`firestore.rules`）。

- **Firebase Authentication**：加入「Sign in with Google」流程來驗證使用者。


你可以從要求這些功能時在聊天中出現的設定卡片啟用 Firebase，或隨時在 **Settings > Integrations** 下啟用。如需專案設定、共用配額與 App Check 生命週期的詳細資訊，請參閱 [Add Firebase to your Google AI Studio app](https://firebase.google.com/docs/ai-assistance/ai-studio-integration)。

## 瀏覽器型 Android 模擬器 {#emulator}

Android 模擬器完全在雲端執行，並串流到你的瀏覽器。你不需要安裝 Android SDK、Android Studio 或本機模擬器。

模擬器提供：

- **Pixel-like device simulation**：就像在真實裝置上一樣，點按、捲動並與你的應用程式互動。

- **Rotation support**：在直向與橫向之間切換。

- **Live preview**：當代理修改程式碼時，應用程式會重新建構，模擬器也會自動重新整理。


### 模擬器限制 {#emulator-limitations}

瀏覽器型模擬器並不支援所有硬體功能。以下功能在模擬器中無法使用：

- 相機與相片拍攝
- NFC 與 Bluetooth
- GPS（位置為模擬）
- Google Play services（Google Sign-In、Maps 與其他 Play services 功能可在真實裝置上運作，但在模擬器中無法運作）

## 使用 ADB 安裝到裝置 {#adb}

你可以使用 USB，將建構好的 APK 直接安裝到連接到電腦的實體 Android 裝置上。這會使用 [WebUSB](https://developer.chrome.com/docs/capabilities/usb) 透過瀏覽器與你的裝置通訊。不需要安裝本機 ADB。

### 前置條件 {#prerequisites}

- 支援 WebUSB 的 Chrome 或 Edge 瀏覽器。

- 已啟用 [Developer Options and USB Debugging](https://developer.android.com/studio/debug/dev-options) 的 Android 裝置。

- 一條將裝置連接到電腦的 USB 連接線。


### 將應用程式安裝到你的裝置 {#install-the-app-on-your-device}

1. 在預覽面板中點選 **Install on Device**。
2. 從瀏覽器的 USB 裝置選取器中選取你的 Android device。
3. APK 會傳輸並安裝到你的裝置上。
4. 應用程式會自動啟動。


!!! note " "

      注意：第一次連接時，你的裝置可能會顯示 **「Allow USB debugging」** 提示。你必須接受才能繼續。


## 發佈到 Play Store {#publish}

你可以將 Android 應用程式發佈到 [Google Play Console](https://play.google.com/console) 的內部測試群組，讓你將應用程式發布給最多 100 位測試人員。

### 前置條件 {#prerequisites}

- [Google Play Developer account](https://play.google.com/console/signup)（需要一次性 $25 註冊費）。

- 已在 Play Console 中完成開發人員設定檔。


### 發佈你的應用程式 {#publish-your-app}

1. 在 Google AI Studio 中開啟 **Settings > Publish**。

2. 點選 **Publish to Play Store**。

3. 使用你的 Google Play Developer account 進行驗證。

4. AI Studio 會簽署 APK、建立應用程式資訊清單（或上傳新版本），並發佈到內部測試群組。

5. 你會收到一個連結，可與測試人員共用。


AI Studio 會使用受管金鑰庫自動管理 APK 簽署。你之後可以在 Play Console 中自訂應用程式資訊清單（圖示、螢幕截圖、說明）。


!!! note " "

      注意：發佈僅限於**內部測試群組**。正式版本必須直接在 Google Play Console 中管理。


## 產生的內容 {#whats-generated}

當你建構 Android 應用程式時，代理會產生一個標準的 Gradle 專案，結構如下：

- **Build configuration**：使用 Kotlin DSL 的 `build.gradle.kts` 檔案（專案層級與應用程式層級）。

- **UI layer**：採用 [Material 3](https://m3.material.io/) 主題的 [Jetpack Compose](https://developer.android.com/develop/ui/compose) 元件。

- **Architecture**：採用 ViewModels 與資料類別的單一 activity 架構。

- **Resources**：`AndroidManifest.xml`、drawables、strings 與其他 Android 資源。

- **Firebase configuration**（啟用 Firebase 時）：`google-services.json`、`firebase_applet_config.xml` 與 `firestore.rules`。


代理會自動管理 Gradle 相依性，視需要從 Maven 與 Google 存放庫加入套件。

你可以使用預覽面板中的 **Code** 分頁檢視並編輯產生的程式碼。若要在 Android Studio 中繼續開發，請將專案下載為 **ZIP file**。

## 限制 {#limitations}

AI Studio 中的 Android 應用程式建構有以下限制：

### 平台限制 {#platform-limitations}

- **Client-side only**：Android 應用程式不包含伺服器端元件。需要伺服器執行環境的功能（機密管理、多人功能、Google Workspace APIs）無法使用。

- **Single-activity architecture**：僅支援單一 activity、單一模組的專案。

- **Jetpack Compose only**：應用程式使用 Kotlin 與 Jetpack Compose。不支援 Java 與 XML 版面配置。

- **No NDK or native code**：不支援 C 與 C++ 程式碼。

- **No Wear OS or Android TV**：僅支援手機與平板電腦的外型規格。


### 匯出限制 {#export-limitations}

- **ZIP download only**：你可以將專案下載為 ZIP 檔案。Android 專案尚不支援匯出到 GitHub。

## 後續步驟 {#whats-next}

- [Build apps in Google AI Studio](/docs/aistudio-build-mode/)
- [Developing Full-Stack Apps](/docs/aistudio-fullstack/)（web）
- 在 [App Gallery](https://aistudio.google.com/apps?source=showcase) 中查看範例。
