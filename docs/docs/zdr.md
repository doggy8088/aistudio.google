# Gemini Developer API 的零資料保留

本頁說明 Gemini Developer API 中一般所稱「零資料保留」的相關細節。

## 訓練限制 {#training-restriction}

如 [Gemini API 服務條款](/docs/terms/)所述，當您使用付費服務時，Google 不會使用您的提示詞（包括相關的系統指令、快取內容，以及圖片、影片或文件等檔案）或回覆來改善我們的產品。付費服務的定義見[此處](/docs/terms/#paid-services)。

## 客戶資料保留與達成零資料保留 {#customer-data-retention-and-achieving-zero-data-retention}

在下列情境與條件下，客戶資料通常會保留一段有限的時間。若要達成零資料保留，客戶必須在以下各個領域採取特定措施，或避免使用特定功能：

- **用於濫用監控的提示詞記錄**：如 [Gemini API 附加服務條款](/docs/terms/)所述，對於付費服務，Google 會在有限期間內記錄提示詞與回覆，僅用於偵測是否違反[禁止使用政策](https://policies.google.com/terms/generative-ai/use-policy)。如果您的工作負載需要保證零資料保留或企業資料處理協議，請使用 Vertex AI。詳情請參閱 [Gemini Enterprise Agent Platform 與零資料保留](https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/zero-data-retention)。

- **使用 Google 搜尋接地**：如 [Gemini API 附加服務條款](/docs/terms/#grounding-with-google-search)所述，Google 會儲存提示詞、脈絡資訊與產生的輸出三十（30）天，用於建立接地結果與搜尋建議。這些儲存的資訊可能會用於支援接地之系統的除錯與測試。**如果您使用 Google 搜尋接地功能，將無法停用這類資訊的儲存。**

- **使用 Google 地圖接地**：如 [Gemini API 附加服務條款](/docs/terms/)所述，Google 會儲存提示詞、脈絡資訊與產生的輸出三十（30）天，用於建立接地結果。這些儲存的資訊僅能用於可靠性工程，例如在服務發生問題時進行除錯。**如果您使用 Google 地圖接地功能，將無法停用這類資訊的儲存。**

- **Interactions API**：Interactions API 會管理對話的進行中狀態，以支援多輪對話。**Interactions API 預設會啟用狀態儲存**。若要確保零資料足跡，您必須在 API 要求中明確將 `store` 參數設為 `false`，以退出預設的狀態保留。

- **Live API**：這個具狀態的 API 會儲存對話狀態，以支援即時重新連線。若要達成零資料保留，**請勿設定 SessionResumptionConfig**。一旦產生工作階段控制代碼，對話狀態（包括文字、音訊與影片）最多會保留 24 小時。

- **File API 儲存空間**：File API 允許使用者上傳大型素材。檔案會以靜態儲存方式保存，直到使用者刪除或檔案到期為止。使用 File API 與 ZDR 記錄無關；使用者必須手動刪除檔案，才能確保零資料足跡。

- **明確上下文快取**：使用者可以使用 `cached_content` 欄位，手動快取大型資料集（例如長影片或文件庫）。雖然這些要求的記錄會遵循 ZDR 捨棄政策，但快取的上下文本身會依使用者定義的 `ttl` 或 `expire_time` 儲存。若要達成絕對的零資料足跡，請勿使用 cached_content 功能。

- **隱含記憶體內快取**：Gemini 模型預設會將資料快取在記憶體中，以降低開發人員的延遲與成本。這類資料嚴格只存在於 RAM 中（非靜態儲存），並以專案層級隔離，TTL 為 24 小時。**這並不違反零資料保留。**


## 後續步驟 {#whats-next}

- 了解 [Gen AI 禁止使用政策](https://policies.google.com/terms/generative-ai/use-policy)。

- 檢閱 [Gemini API 附加服務條款](/docs/terms/)。

- 如果您需要企業級的自助式 ZDR 控制功能，請參閱 [Gemini Enterprise Agent Platform 零資料保留指南](https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/zero-data-retention)。


