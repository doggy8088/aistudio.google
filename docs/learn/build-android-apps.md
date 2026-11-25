# 用 Firebase 在幾分鐘內建立 Android 應用程式

在 Google AI Studio 中描述你的應用程式、連接 Firebase，並直接從 Google Play 安裝。

作者：[Jack Wotherspoon](https://x.com/JackWoth98)、[Mike Taylor-Cai](https://x.com/miketaylorcai)
閱讀時間 9 分鐘

每個人心裡都有一個個人 Android 應用程式的點子，但從點子到口袋裡真正能用的應用程式，才是困難的部分。直到最近，想把自訂應用程式裝到自己的手機上，還得安裝 Android Studio、設定 Gradle、透過 USB 線安裝，或支付 25 美元的開發人員註冊費。現在不用了，我們做了許多改進，讓你現在可以用 [Google AI Studio](https://aistudio.google.com/apps?features=build_android_app)，在幾分鐘內從提示詞做出完整的全端 Android 應用程式並裝到自己的手機上。用你自己的話描述一個 Android 應用程式，讓 Gemini 幫你建立，在瀏覽器中即時測試語音與 UI、連接 Firebase，並免費從 Google Play 的個人書庫安裝你的應用程式。

## 五個步驟，從提示詞到你的手機

### 描述你的 Android 應用程式

![在 AI Studio 中輸入 Wayword 旅遊會話手冊提示詞，並選取「Build an Android app」](https://www.gstatic.com/aistudio-static/editorial/build-android-apps/ee6985cc.webp)

### 在 Android 模擬器中建立與預覽

AI Studio 會生成 Kotlin 與 Jetpack Compose 專案、編譯應用程式，並直接在瀏覽器中啟動互動式雲端 Android 模擬器。點按瀏覽畫面、開啟翻譯工具表單、在工具列中切換 **Preview** 與 **Code**，或點按頂端標頭中的 **Publish**。

![AI Studio 工作區：左側顯示生成的 Kotlin 與 Compose 檔案，右側顯示在雲端 Android 模擬器中執行的 Wayword](https://www.gstatic.com/aistudio-static/editorial/build-android-apps/a6540673.webp)

### 使用 Firebase 連接登入、儲存空間與 AI 邏輯

![放大檢視對話內的「Enable Firebase」設定卡，正在佈建 Cloud Firestore 與 Gemini 整合](https://www.gstatic.com/aistudio-static/editorial/build-android-apps/275b8e40.webp)

### 以 HD 測試，並用螢幕截圖精修

在浮動模擬器工具列中開啟 **HD**，以高品質解析度檢視字體與間距。發現想調整的版面細節？點按右上角預覽列中的相機按鈕，把即時模擬器螢幕截圖直接附加進對話。

![雲端 Android 模擬器特寫，標示箭頭指向已開啟的 HD 串流與右上角的「Send screenshot to chat」按鈕](https://www.gstatic.com/aistudio-static/editorial/build-android-apps/c9b2cdcf.webp)

### 發布並掃描 Google Play QR code 安裝

![放大檢視 AI Studio 中的「Publish」抽屜，顯示「Add this app to your personal library on Google Play」](https://www.gstatic.com/aistudio-static/editorial/build-android-apps/860b1191.webp)

## AI Studio 中 Android 應用程式的新功能

### 直接從 Google Play 安裝與更新

把自己的應用程式裝到手機上測試，曾經是行動開發最困難的一哩路。在 **Publish** 下，AI Studio 現在提供兩種 Google Play 發布管道，並為你處理自動應用程式簽署：**Google Play 個人書庫（免註冊費）：** 選取 **Add your app to personal library** 並連接你的個人 Google 帳號（`@gmail.com`）。AI Studio 會簽署你的建置項目並產生 QR code，開啟 [Google Play 個人書庫](https://support.google.com/googleplay/android-developer/answer/18765789)中的私人上架頁面，不需要 USB 線、開發人員選項或 25 美元註冊費。之後進行編輯時，點按 **Update app** 即可透過 Google Play 推送更新。**最多 100 名測試人員的內部測試：** 準備好與朋友、家人或隊友分享了嗎？選取 **Publish your app to internal testing**，連接 Google Play Console 開發人員帳號（一次性 25 美元費用），即可向最多 100 名測試人員發布已簽署的 Android App Bundle。

### 在對話中佈建登入、雲端同步與受保護的 Gemini 呼叫

使用 AI 的行動應用程式，一旦需要真實資料或模型呼叫，往往立刻遇到瓶頸。把原始 Gemini API 金鑰嵌入 Android APK 會讓它面臨被抽取的風險，而自行架設後端伺服器又會拖慢小型應用程式的開發。當你要求帳號、已儲存的資料或 AI 功能時，對話內的卡片可讓你點按 **Enable Firebase**，在免費的 Firebase Spark 方案上啟用，不必離開 AI Studio：**使用 Firebase AI Logic 與 App Check 的用戶端安全 Gemini：** 不必把原始 API 金鑰放進用戶端程式碼，就能從 Android 應用程式呼叫 Gemini Live、語音與視覺模型。AI Studio 會自動為瀏覽器與 USB 測試設定 App Check 除錯 token，並自動將 Google Play 建置項目切換為發布驗證。**一鍵 Google 登入與 Cloud Firestore：** AI Studio 會註冊你的應用程式簽署憑證、串接 Google 登入，並設定具有自動生成安全性規則的 Cloud Firestore，讓筆記、相片與收藏集跨裝置同步，並可離線使用。

**Google Play 個人書庫（僅限美國）：** 將個人應用程式加入 Google Play，目前免費提供給美國的個人 *@gmail.com* 帳號（測試版），更多地區即將陸續推出。

### 即時 HD 模擬器串流

在底層，AI Studio Build 會透過 Android CLI，依據最新的 Android SDK 文件生成單一 Activity 的 Kotlin 與 Jetpack Compose 應用程式，並套用 Material 3 主題。這種接地方式可讓 Gradle 相依性保持一致，並在多輪反覆運算中避免使用已淘汰的 Compose API。對話旁的雲端模擬器是為緊密的視覺與音訊回饋迴圈而打造：**HD 顯示與即時瀏覽器音訊：** 在浮動模擬器工具列中開啟 **HD**，檢查字體與視覺精緻度。取消模擬器音訊靜音，即可在瀏覽器中測試 Gemini Live 語音工作階段與口述旁白。**螢幕截圖轉代理視覺修正：** 發現尷尬的邊距或被裁切的卡片？點按預覽列中的相機圖示，把即時模擬器畫面附加到提示詞，讓代理檢視並修正 UI，或在對話中要求捆綁 Google Fonts。

### 在瀏覽器預覽、手機硬體與 Android Studio 之間切換

使用瀏覽器模擬器快速反覆調整版面、導覽、旋轉與音訊，接著在想要使用真實硬體感測器時，盡快移至實體手機。相機拍照、藍牙、NFC、即時 GPS，以及 Google 登入與 Google 地圖等 Google Play 服務，都可以在應用程式透過 Google Play 或 WebUSB 使用 **Install** 安裝到 Android 裝置後運作。在每一步，你都擁有生成的專案。開啟 **Code** 分頁直接檢視或編輯檔案、從 **Export** 選單下載完整的 Gradle ZIP，或[將應用程式與 GitHub 同步](/learn/sync-your-ai-studio-apps-with-github/)，以便繼續在 Android Studio 中開發。
