# 代理總覽

Gemini API 上的受管代理提供可設定的代理框架。只要一次 API 呼叫，就能佈建 Linux 沙箱，讓代理在其中自主推理、執行程式碼、管理檔案並瀏覽網頁。


  

**[快速入門](/docs/managed-agents-quickstart/)**

完成第一次代理呼叫、串流回應，並建構自訂代理。


  

**[Antigravity Agent](/docs/antigravity-agent/)**

介紹預設代理的功能、工具、多模態輸入與定價。


  

**[AI Studio 中的代理](/docs/aistudio-agents/)**

無需撰寫程式碼即可試作代理的視覺化 Playground。


## 可用的受管代理 {#managed-agents}

* **[Antigravity agent](/docs/antigravity-agent/)**：以 Gemini 4 Hydrogen 建構的通用受管代理。能在 Google 代管的安全 Linux 沙箱中執行程式碼、管理檔案並搜尋網頁。你可以加上自己的指令、技能與資料來延伸它，[建構自訂代理](/docs/custom-agents/)。

* **[Deep Research](/docs/deep-research/)**：自主研究代理，能規劃、執行並彙整多步驟研究任務，適用於市場分析、盡職調查與文獻回顧等情境。


## 安全性與最佳做法 {#security-best-practices}


!!! note " "

      注意：受管代理目前為 **Public Preview**。在敏感工作流程中依賴之前，請先檢視代理的動作與輸出。


每個代理都在沙箱環境中執行，並在作業系統層級隔離。沙箱預設具有不受限制的對外網路存取權，你可以使用允許清單來限制或停用網路存取。

### 網路存取 {#network-access}

環境預設具有不受限制的對外網路存取權。使用 `network` 允許清單，可將對外流量限制在特定網域或萬用字元模式。如需設定細節，請參閱 [Network Allow List](/docs/aistudio-agents/#network-allow-list)（AI Studio）或 [Network rules](/docs/custom-agents/#with-network-rules)（API）。

### 外部工具與 API {#external-tools-and-apis}

你可以連接外部工具與 API 來擴充代理。請只使用來自可信來源的工具，並將權限範圍縮小到必要的最小限度。將機密儲存為受管憑證，並以 ID 參照它們，如此 egress proxy 就能在要求發出時注入，機密也不會暴露在沙箱內。代理可能會使用它能存取的任何憑證，因此只應提供你願意授予完整權限範圍的憑證。

* 使用最小權限的服務帳號或 API 金鑰。
* 優先使用短期 token，而非長期金鑰。
* 只提供你願意授予完整權限範圍的憑證。
* 定期輪替憑證。

如需憑證類型與管理操作，請參閱 [Credentials](/docs/agent-credentials/)。你也可以直接在允許清單規則上設定標頭，請參閱 [Network configuration](/docs/agent-environment/#network-configuration)。

### 人工監督 {#human-oversight}

部署前務必驗證輸出內容（產生的程式碼、資料轉換、設定變更），尤其是會修改資料或與外部系統互動的任務。

## 定價 {#pricing}

受管代理採用按量付費模式，依 Gemini 模型 token 與工具使用量計費。單次互動可能觸發多輪推理循環，通常會消耗 100k 到 3M tokens。預覽期間，環境運算**不計費**。如需各任務的費用明細，請參閱[預估成本](/docs/antigravity-agent/#availability-and-pricing)。


| 功能 | 模型 | 工具 |
| --- | --- | --- |
| [Gemini Deep Research 代理](/docs/deep-research/) | 所有模型推論均按 Gemini 標準牌價收費，包括代理迴圈期間產生的輸入、輸出與中間輸入／推理 token。 | 工具使用費依現行定價結構收取，並維持標準區別：Search Grounding（不含擷取的 token）與 Url_context／File Search（其他所有工具均包含擷取的 token）。 |
| [Gemini API 中的代管代理](/docs/agents/) | 所有模型推論均按 Gemini 標準牌價收費，包括代理迴圈期間產生的輸入、輸出與中間輸入／推理 token。 | 預覽期間不收取環境運算（CPU、記憶體、沙箱執行）費用。 |
| [Antigravity Agent](/docs/antigravity-agent/) | 所有模型推論均按 Gemini 標準牌價收費，包括代理迴圈期間產生的輸入、輸出與中間輸入／推理 token。 | 預覽期間不收取環境運算（CPU、記憶體、沙箱執行）費用。 |


## 限制 {#limits}

| 限制 | 說明 |
| :--- | :--- |
| **Environment Lifetime** | 環境在閒置 7 天後會永久刪除。 |
| **VM Spin-down** | VM 會在短暫閒置後關機以節省資源。下一次要求會還原狀態（需冷啟動）。 |
| **Pre-installed Software** | 以 Ubuntu 為基礎的環境，搭載 Python 3.12 與 Node.js 22。如需環境基礎映像的詳細資訊，請參閱 [Pre-installed software](/docs/agent-environment/#pre-installed-software)。 |
| **Max agents** | 最多可擁有 1,000 個受管代理。 |

## 代理框架 {#agent-frameworks}

你也可以使用以下框架與 SDK，搭配 Gemini 建構代理：

* [**LangChain / LangGraph**](/docs/langgraph-example/)：使用圖形結構建構有狀態的複雜應用流程與多代理系統。

* [**LlamaIndex**](/docs/llama-index/)：將 Gemini 代理連接到你的私有資料，打造 RAG 強化的工作流程。

* [**CrewAI**](/docs/crewai-example/)：協調具協作性、角色扮演式的自主 AI 代理。

* [**Vercel AI SDK**](/docs/vercel-ai-sdk-example/)：以 JavaScript/TypeScript 建構 AI 驅動的使用者介面與代理。

* [**Google ADK**](https://google.github.io/adk-docs/get-started/python/)：用於建構與協調可互通 AI 代理的開放原始碼框架。

*   [**Genkit**](https://genkit.dev)：以 TypeScript、Go、Python 與 Dart 建構全端 AI 應用與代理。

* [**Antigravity SDK**](https://antigravity.google/product/antigravity-sdk)：使用驅動 Google Antigravity 的相同工具、代理循環與上下文管理功能，建構自主 AI 代理，可用 Python 撰寫。
