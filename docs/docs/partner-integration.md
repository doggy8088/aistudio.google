# 合作夥伴與函式庫整合

本指南說明如何以 Gemini API 為基礎，打造函式庫、平台與閘道的架構策略，並詳述使用官方 GenAI SDK、Direct API（REST/gRPC）與 OpenAI 相容層三者之間的技術取捨。

如果您正在為其他開發者打造工具，例如開放原始碼框架、企業閘道或 SaaS 彙總服務，且需要針對相依性管理、套件大小或功能對等性進行最佳化，本指南正是為您而寫。

## 什麼是合作夥伴整合？ {#overview}

注意：如果您打造的是終端使用者應用程式（例如客服機器人、旅遊規劃工具），請跳過本指南，改用 [Gemini API 開始使用指南](/docs/get-started/)。對您而言，[GenAI SDK](/docs/libraries/) 是建議的選擇。

合作夥伴是指在 Gemini API 與終端使用者開發者之間建立整合的任何人。我們將合作夥伴分為四種類型，辨認自己最接近哪一種類型，有助於選出正確的整合路徑。

#### 生態系框架 {#ecosystem-framework}

* **您是誰：** 開放原始碼框架（例如 LangChain、LlamaIndex、Spring AI）或特定語言用戶端的維護者。

* **您的目標：** 廣泛的相容性。您希望函式庫能在使用者選擇的任何環境中運作，同時不強加衝突。


#### 執行階段與邊緣平台 {#runtime-and-edge-platform}

* **您是誰：** 在受限環境中執行程式碼的 SaaS 平台、AI 閘道或雲端基礎架構供應商（例如 Vercel、Cloudflare、Zapier）。

* **您的目標：** 效能。您需要低延遲、最小的套件大小，以及快速的冷啟動。


#### 彙總服務 {#aggregator}

* **您是誰：** 將多家不同 LLM 供應商（例如 OpenAI、Anthropic、Google）的存取方式標準化為單一介面的平台、代理或內部「Model Gardens」。

* **您的目標：** 可攜性與一致性。


#### 企業閘道 {#enterprise-gateway}

* **您是誰：** 在大型企業中為數百位內部開發者打造「Golden Paths」的內部平台工程團隊。

* **您的目標：** 標準化、治理與統一的驗證機制。


## 一覽比較 {#comparison}

**全球最佳實務：** 無論選擇哪一條路徑，所有合作夥伴都必須傳送 [`x-goog-api-client` 標頭](/docs/partner-integration/#client-id)。


| 如果您是…… | 建議路徑 | 主要優勢 | 主要取捨 | 最佳實務 |
| --- | --- | --- | --- | --- |
| **Enterprise gateway, ecosystem framework** | **[Google GenAI SDK](/docs/partner-integration/#genai-sdk)** | **Gemini Enterprise Agent Platform 對等性與速度。** 內建處理類型、驗證與複雜功能（例如檔案上傳），並可無縫遷移至 Google Cloud。 | **相依性負擔。** 傳遞性相依關係可能相當複雜，且不在您的掌控範圍內。僅限支援的語言（Python/Node/Go/Java）。 | **鎖定版本。** 在內部基礎映像中固定 SDK 版本，確保各團隊之間的穩定性。 |
| **Ecosystem framework, edge platforms, and aggregators** | **[Direct API](/docs/partner-integration/#rest)** *(REST / gRPC)* | **零相依性。** 由您掌控 HTTP 用戶端與確切的套件大小，並可完整存取所有 API 與模型功能。 | **開發負擔高。** JSON 結構可能巢狀層次很深，需要嚴格的手動驗證與類型檢查。 | **使用 OpenAPI 規格。** 透過我們的官方規格自動產生類型，不要手動撰寫。 |
| **Aggregator using OpenAI SDKs that only require text-based workflows** *(Optimizing for legacy portability)* | **[OpenAI compatibility](/docs/partner-integration/#openai)** | **即時可攜性。** 重複使用現有與 OpenAI 相容的程式碼或函式庫。 | **功能上限。** 模型專屬功能（原生影片、快取）可能無法使用。 | **遷移計畫。** 用於快速驗證，但應規劃升級至 Direct API，以取得完整的 API 功能。 |


## Google GenAI SDK 整合 {#genai-sdk}

對框架而言，實作 [Google GenAI SDK](/docs/libraries/) 往往是最簡單的路徑，因為在支援的語言中所需的程式碼行數最少。

對內部平台團隊而言，您的主要交付成果往往是一條「golden path」，讓產品工程師能快速行動，同時符合安全政策。

**優勢：**

* **遷移至 Gemini Enterprise Agent Platform 的統一介面：** 內部開發者常以 API 金鑰（Gemini API）進行原型開發，再部署到 Gemini Enterprise Agent Platform（IAM）以符合正式環境的合規要求。SDK 能抽象化這些驗證方式的差異。對框架而言也是如此：您可以實作一條程式碼路徑，同時支援兩組使用者。

* **用戶端輔助工具：** SDK 內含符合語言慣例的實用工具，可減少複雜工作的樣板程式碼。

  *   *範例：* 在提示詞中直接支援 `PIL` 圖片物件、自動函式呼叫，以及完整的類型定義。

* **功能第一時間可用：** 新的 API 功能在推出當下即可透過 SDK 使用。

* **更完善的程式碼產生支援：** 在本機安裝 SDK 後，程式設計輔助工具（例如 Cursor、Copilot）就能存取類型定義與 docstring。相較於產生原始的 REST 請求，這樣的上下文能提升程式碼產生的準確度。


**取捨：**

* **相依性負擔與複雜度：** SDK 有自己的相依關係，可能增加套件大小，也可能帶來供應鏈風險。

* **版本管理：** 新的 API 功能往往會固定要求最低 SDK 版本。您可能需要推送更新給使用者，才能讓他們使用新功能或新模型；在某些情況下，這可能需要變更傳遞性相依關係，進而影響您的使用者。

* **通訊協定限制：** SDK 僅支援以 HTTPS 存取主要 API，以及以 WebSockets（WSS）存取 Live API。高階 SDK 用戶端不支援 gRPC。

* **語言支援：** SDK 支援的是*目前*的語言版本。如果您需要支援已終止生命週期的版本（例如 Python 3.9），就必須自行維護分支版本。


**最佳實務：**

* **鎖定版本：** 在內部基礎映像中固定 SDK 版本，確保各團隊之間的穩定性。

## Direct API 整合 {#rest}

如果您要將函式庫散布給數千位開發者、在受限環境中執行，或是打造需要 Gemini 最新進功能的彙總服務，您可能需要直接透過 REST 或 gRPC 與 API 整合。

**優勢：**

* **完整的功能存取：** 與 OpenAI 相容層不同，直接使用 API 可啟用 Gemini 專屬功能，例如上傳至 File API、建立內容快取，以及使用雙向的 Live API。

* **最少的相依性：** 在對相依性敏感的環境中，無論是基於大小或稽核成本考量，透過 `fetch` 這類標準函式庫，或 `httpx` 這類封裝工具直接使用 API，都能讓您的函式庫保持輕量。

* **與語言無關：** 這是 SDK 未涵蓋語言的唯一路徑，例如 Rust、PHP 與 Ruby，因為它沒有語言限制。

* **效能：** Direct API 的初始化額外負擔為零，能將無伺服器函式中的冷啟動降到最低。


**取捨：**

* **需手動實作 Gemini Enterprise Agent Platform：** 與 SDK 不同，直接使用 API 不會自動處理 AI Studio（API 金鑰）與 Gemini Enterprise Agent Platform（IAM）之間的驗證差異。如果您想同時支援這兩個環境，必須自行實作各自的驗證處理程序。

* **沒有原生類型或輔助工具：** 除非自行實作，否則您不會獲得請求物件的程式碼自動完成或編譯期檢查。也沒有用戶端「輔助工具」（例如函式轉結構定義的轉換器），因此您必須自行手動撰寫這類邏輯。


**最佳實務**

我們提供機器可讀的規格，您可用來為函式庫產生類型定義，省去手動撰寫的功夫。請在建置過程中下載規格、產生類型，再隨附編譯後的程式碼一同發布。

* **端點：** `https://generativelanguage.googleapis.com/$discovery/OPENAPI3_0`

## OpenAI SDK 整合 {#openai}

如果您是優先考量統一結構定義（OpenAI Chat Completions）、而非模型專屬功能的平台，這會是您最快的路徑。

**優勢：**

* **低摩擦：** 您往往只要變更 `baseURL` 與 `apiKey`，就能加入 Gemini 支援。這是整合「自備金鑰」實作的快速方式，無需撰寫新程式碼即可加入 Gemini 支援。

* **限制：** 只有在您受限於 OpenAI SDK、且不需要 File API 等進階 Gemini 功能，或不需要手動加入 Grounding with Google Search 等工具支援時，才建議走這條路徑。


**取捨：**

* **功能限制：** 相容層對 Gemini 的核心能力設有限制。兩個平台可用的伺服器端工具並不相同，可能需要手動處理，才能與 Gemini API 工具搭配運作。

* **轉換額外負擔：** 由於 OpenAI 結構定義與 Gemini 的架構並非 1:1 對應，仰賴相容層會帶來一些複雜度，需要額外的實作工作才能解決，例如將使用者的「search」工具對應到正確的平台工具。如果您需要大量的特殊處理，改為針對每個平台使用專屬的 SDK 或 API，可能更有價值。


**最佳實務**

在可能的情況下，請直接與 Gemini API 整合。不過，若要追求最大的相容性，可考慮使用能辨識不同供應商、並為您處理工具與訊息對應的函式庫。

## 所有合作夥伴的最佳實務：用戶端識別 {#client-id}

當您以平台或函式庫的身分呼叫 Gemini API 時，必須使用 `x-goog-api-client` 標頭來識別您的用戶端。

如此一來，Google 就能辨識您特定的流量區段；如果您的函式庫產生了某種特定的錯誤模式，我們也能主動聯繫您，協助除錯。

請使用 `company-product/version` 格式（例如 `acme-framework/1.2.0`）。

### 實作範例 {#client-examples}


=== "GenAI SDK"

      只要提供 API 用戶端，SDK 就會自動將您的自訂標頭附加到其內部標頭中。

      ```py
      from google import genai

      client = genai.Client(
        api_key="...",
        http_options={
            "headers": {
                "x-goog-api-client": "acme-framework/1.2.0",
            }
        }
      )
      ```

=== "Direct"

      ```posix-terminal
        curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
            -H 'Content-Type: application/json' \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H 'x-goog-api-client: acme-framework/1.2.0' \
            -d '{...}'
      ```

=== "OpenAI SDK"

      ```py
      from openai import OpenAI

      client = OpenAI(
          api_key="...",
          base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
          default_headers={
              "x-goog-api-client": "acme-framework-oai/1.2.0",
          }
      )
      ```


## 後續步驟 {#next}

* 前往[函式庫總覽](/docs/libraries/)，了解 GenAI SDK

* 瀏覽 [API 參考文件](/api-reference/)

* 閱讀 [OpenAI 相容性指南](/docs/openai/)

