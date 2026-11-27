# Gemini 電腦操作入門

使用 Gemini API 中的螢幕截圖與 UI 操作，以視覺方式操作瀏覽器、手機應用程式與桌面，打造代理。

作者：[Patrick Loeber](https://x.com/patloeber)、[Min Choi](https://x.com/iohcsnim)

發布於 2026 年 11 月 23 日

閱讀時間 5 分鐘

許多日常工作流程仍藏在圖形介面背後：填寫網頁表單、逐步操作應用程式流程，或跨分頁收集資料。Gemini API 中的電腦操作（Computer Use）讓你打造能以視覺方式瀏覽瀏覽器、手機應用程式與桌面的代理。透過螢幕截圖，Gemini 能「看見」畫面，並透過點擊、按鍵、捲動與手勢等 UI 指令「操作」。使用電腦操作，你可以打造能做到以下事情的代理：自動執行網站上重複的資料輸入或表單填寫、對網頁應用程式與使用者流程執行自動化測試，以及在不同網站間進行研究（例如從電商網站收集產品資訊、價格與評論，作為購買決策的參考）。在本文中，你將了解電腦操作的運作方式、啟動你的第一個瀏覽器或手機代理，並探索支援的 Gemini 模型。

## 運作方式

與伺服器端工具不同，電腦操作是在你的應用程式與 Gemini API 之間持續循環運作。Gemini 根據視覺情境規劃下一步，你的程式碼則執行每個動作，並回傳更新後的畫面。

![Gemini 與用戶端環境之間的電腦操作互動循環](https://firebasestorage.googleapis.com/v0/b/ais-content-production-3.firebasestorage.app/o/editorial-assets%2Fgetting-started-with-computer-use%2Fec624891.webp?alt=media&token=ec624891)

循環的每個回合包含四個步驟：將使用者的目標與目前畫面的螢幕截圖傳送給模型，並啟用電腦操作工具；接收模型的回應，其中包含下一個建議的 UI 動作，例如點擊、輸入或捲動；在你的用戶端環境中執行該動作；擷取更新後畫面的新螢幕截圖並傳回模型，以請求下一步。這個過程會不斷重複，直到模型完成任務。

## 快速入門

在 `tools` 中傳入 `computer_use` 與目標 `environment`（`"browser"`、`"mobile"` 或 `"desktop"`），即可在 API 要求中啟用電腦操作：

```
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-4-hydrogen",
    input="Search for 'Gemini API' on Google.",
    tools=[{"type": "computer_use", "environment": "browser"}],
)

print(interaction)
```

若要把這個單次要求變成完整的代理，請搭配沙箱環境與用戶端處理常式，執行每個回傳的動作並傳回新的螢幕截圖。完整的循環範例（Python、JavaScript、Java 與 Go）請參閱[電腦操作文件](/docs/computer-use/#implement-computer-use)。

## 入門儲存庫

如果你想直接取得可運作的代理循環，而不必從頭撰寫動作處理常式，可以從我們在 GitHub 上的開源參考儲存庫開始。

### 瀏覽器代理

[google-gemini/computer-use-preview](https://github.com/google-gemini/computer-use-preview) 儲存庫提供可直接執行的 Python CLI，用於網頁自動化，內含 Playwright 動作處理常式，並可透過 Browserbase 支援雲端瀏覽器。以下是在本機 Playwright 工作階段中搜尋 Google Flights 的瀏覽器入門代理：

### Android 代理

將 `environment` 設為 `"mobile"`，即可切換為適合手機的操作，在手機上開啟應用程式、點按、滑動與返回。[google-gemini/gemini-android-computer-use-quickstart](https://github.com/google-gemini/gemini-android-computer-use-quickstart) 儲存庫可透過 ADB 將 Gemini 連接至 Android 虛擬裝置，並內含啟動虛擬手機的設定指令碼。以下是在 Android 模擬器上使用快速入門完成任務的 Gemini：

## 功能與支援的模型

Gemini 4 模型（以及支援的 Gemini 3.x 模型）為電腦操作代理內建多項功能：多環境支援，可針對[瀏覽器、手機與桌面](/docs/computer-use/#supported-environments)介面使用量身打造的動作集；具備意圖的精簡動作，每個步驟都會回傳 `intent` 欄位，說明模型選擇該動作的原因；可設定的[安全政策](/docs/computer-use/#safety-policies)，內建政策類別、確認掛鉤與覆寫；可選用的[提示詞注入偵測](/docs/computer-use/#prompt-injection)，會掃描螢幕截圖中的隱藏對抗指令。你可以在以下[模型](/docs/computer-use/#model-versions)上啟用電腦操作：

| 模型 | 模型 ID | 適用情境 |
| --- | --- | --- |
| Gemini 4 Hydrogen | `gemini-4-hydrogen` | 建議的預設選項：日常電腦操作與互動式代理 UI 工作流程速度快、成本低 |
| Gemini 4 Neon | `gemini-4-neon` | 複雜互動工作流程的深度推理，完成速度更快、輸出 token 更少，優於 Carbon |
| Gemini 4 Carbon | `gemini-4-carbon` | 長時間非同步執行、深度驗證，以及最艱難的多步驟 UI 任務 |
| Gemini 3.5 Flash-Lite | `gemini-3.5-flash-lite` | 速度最快、成本最低的選項，適合大量或低延遲的瀏覽器與手機任務 |

## 下一步

電腦操作讓你僅憑視覺情境，就能跨網頁瀏覽器、手機應用程式與桌面自動執行工作流程。由於 UI 代理會與即時介面及不受信任的內容互動，請務必在沙箱環境中執行，並在部署到本機原型之外前，先閱讀[安全最佳實務](/docs/computer-use/#safety-best-practices)。探索以下資源，開始打造：[電腦操作文件](/docs/computer-use/)，提供完整的循環指南、動作結構描述與自訂使用者定義函式；[瀏覽器入門儲存庫](https://github.com/google-gemini/computer-use-preview)，提供 Playwright、Browserbase 與 Docker 沙箱範例；[Android 入門儲存庫](https://github.com/google-gemini/gemini-android-computer-use-quickstart)，提供 ADB 驅動的手機自動化；以及 [Gemini Browserbase 示範](https://gemini.browserbase.com/)，無須設定即可在雲端測試瀏覽器代理。
