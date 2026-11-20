# re:cap 如何運用 Gemini Managed Agents 打造 Capital Advisory

[re:cap](https://www.re-cap.com/) 是一家位於柏林的金融科技公司，為歐洲各地的新創公司與中小企業安排債務融資，並提供資本策略與顧問平台。其最新產品 Capital Advisory 旨在協助創辦人與財務團隊，依據自身的事業與財務資料，了解自己實際上能籌集多少融資。整個體驗的核心是一個 Gemini Managed Agent。它是 re:cap 在 Gemini Managed Agents 上正式運行的數個代理之一。

創辦人從 Capital Readiness Assessment 開始：re:cap 會研究他們的公司、提出幾個問題，並計算他們目前的狀況。登入後，他們可以針對自己的結果、融資選項與公司財務提出詳細的後續問題。這些對話由 Gemini Managed Agents 處理，透過 MCP 存取 re:cap 的資料，並運用團隊專為 Capital Advisory 開發的一組技能。對 re:cap 而言，這不只是一個新架構。工程團隊先前已在另一個代理平台上建置了相同的體驗，因此有機會在相同的工作負載上測試兩種不同的實作。

## 在真實客戶問題上測試 Gemini Managed Agents

re:cap 從 Capital Advisory 擷取了 29 個常見的客戶問題，這些問題先前在舊設定上執行過，並以相同順序使用 Gemini Managed Agents 重播。Gemini Managed Agents 依據即時平台資料，給出了快速、低成本的答案。換算下來，在 re:cap Capital Advisory 基準測試中，**平均回應快約 2.6 倍、最慢的回答快 5 倍、模型成本降低 73%**。29 個問題的每個答案都緊扣即時平台資料。這些結果是針對 re:cap 的工作負載與實作，而非兩個平台的通用基準測試。成本以定價計算。在顧問諮詢中，答案品質最為重要，而 Gemini Managed Agents 以更快的速度、更低的成本做到了。

| re:cap Capital Advisory 基準測試 | Gemini Managed Agents（Gemini 3.7 Flash） | 先前的受管理代理實作 |
| --- | --- | --- |
| 平均回答時間 | 25.4 秒 | 65.6 秒 |
| 最慢的回答 | 46 秒 | 236 秒 |
| 每個問題的平均成本 | 6.0¢（−73%） | 22.4¢ |
| 回答風格 | 簡潔（團隊偏好） | 較為詳細 |

> 「代理正逐漸成為我們經營 re:cap 的方式，無論是對客戶還是對我們自己的團隊都是如此。Gemini Managed Agents 給了我們以大規模量做到這一點的速度與成本，而且它的運作方式與我們既有的建置方式一致：技能就是檔案，像我們其他的程式碼一樣發布。」

— Arne Zeising，re:cap 技術長

## 打造能處理客戶資料的資本顧問

Capital Advisory 的設計目標，是回答一個相當困難的問題：根據 re:cap 對一家公司財務資料的了解，這家公司實際上能籌集多少融資？re:cap 並未把整個產品都變成 Managed Agent。創辦人的旅程分為三個階段，每個階段都只給模型工作所需的自由度，並搭配相應的防護措施：**研究**：代理迴圈。創辦人輸入公司網站。Gemini 透過 ADK，從一組固定的工具中選擇下一步，例如 Google 搜尋、讀取網頁、執行程式碼，以及 re:cap 自家的研究工具。它會為每位訪客執行，因此必須既周全又快速。**評估**：固定管線。創辦人回答幾個引導式問題。每個數字都由 re:cap 自己的程式碼計算；Gemini 只讀取答案並撰寫摘要，兩者都採固定格式。速度與成本優先。**諮詢**：開放式對話。評估之後，創辦人會提出 re:cap 無法預測的問題：為什麼某個選項合適、有哪些替代方案，或是帳戶中的任何其他問題。這是建置在 Gemini Managed Agents 上的部分。答案品質優先。

![Capital Advisory 三個階段的示意圖：研究階段使用 Gemini API 與 ADK 以及一組固定工具，評估階段使用 Gemini API 與型別化輸出，諮詢階段使用 Gemini Managed Agents，範圍限定於單一客戶帳戶。](https://www.gstatic.com/aistudio/case_studies/recap/recap-capital-advisory-journey.svg)

## 一個平台，同時服務客戶與營運

在 Capital Advisory 中，Gemini Managed Agents 負責：**即時財務深度分析**：針對公司自身的銀行與會計資料進行營收、流動性與獲利能力分析。**處理創辦人自己的試算表**：分析上傳的工作簿，或把 re:cap 資料匯出到工作簿中。**在對話中確認資料就緒狀態**：哪些輸入缺失或已過時，以及如何修正。在其背後，數個營運代理在同一個平台上以相同方式建置，各自擁有專屬的技能與權限。它們為銷售團隊分類潛在客戶公司、檢查公司財務資料的品質，並起草公司更新與支援回覆，交由人員核准。由於這些代理全都取自同一組共用技能，一次做出的改進能觸及使用它的每個代理。

## Managed Agent 的運作方式

當創辦人開始提問時，re:cap 會為其帳戶啟動一個 Gemini Managed Agents 環境。代理可以透過 MCP 存取 re:cap 的客戶資料，以及 re:cap 為資本顧問任務建置的技能。這與客戶已經可以連接到自家 AI 代理的同一個 re:cap MCP 伺服器相同，因此 Capital Advisory 不需要獨立的資料層，且只能觸及創辦人自己帳戶可見的資料。創辦人無需離開 re:cap，也不必與獨立的 Gemini 產品互動。

![架構圖：創辦人在 re:cap 中聊天，re:cap 與 Gemini Managed Agents 交換訊息。每位創辦人都有自己的代理環境，由代理定義（模型、技能與連接器）建置而成，CI 會從 GitHub 同步該定義；代理透過同一個 re:cap MCP 伺服器讀取即時公司資料，創辦人也可以把該伺服器連接到自己的 AI 代理。](https://www.gstatic.com/aistudio/case_studies/recap/recap-capital-advisory-architecture.svg)

這套設定也與 re:cap 內部既有的代理開發方式十分契合。團隊以類似外掛的目錄結構維護技能，指令與共用知識都以檔案形式儲存。Gemini Managed Agents 讓 re:cap 把這套結構帶進代理的環境中，而不必把每項技能重建為獨立的平台物件。有三個選擇讓 re:cap 在基準測試的隔天就把 Capital Advisory 推到客戶面前，它們也適用於任何在正式環境運行代理的團隊：**每個代理一份定義**：一份檔案載明代理的指令、技能、工具與模型，像程式碼一樣進行版本管理。**技能像程式碼一樣發布**：它們存放在 GitHub 上，技能變更時，CI 會更新每個代理。**每個客戶帳戶一個環境**：代理永遠只看得到該客戶的資料。

## Capital Advisory 的下一步

推廣已完成：目前使用 Capital Advisory 的每位客戶，都由 Gemini Managed Agents 提供服務。更宏大的目標，是協助創辦人了解 re:cap 安排的債務融資之外的融資選項。如果債務不是合適的工具，Capital Advisory 會協助創辦人了解還有哪些選項可能合適。

> 「每位創辦人在開口籌資之前，都應該先知道自己能籌集多少融資。Capital Advisory 會從他們自己的資料給出這個答案，無論最後合適的選項是哪一個。」

— Arne Zeising，re:cap 技術長

閱讀 [Managed Agents 文件](/docs/agents/)，開始使用 Gemini Managed Agents 建置。

### 作者
