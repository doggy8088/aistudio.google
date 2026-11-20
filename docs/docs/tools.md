# 搭配 Gemini API 使用工具

工具能擴充 Gemini 模型的能力，讓模型能在現實世界中採取行動、存取即時資訊，並執行複雜的運算工作。模型既能在標準的請求與回應互動中使用工具，也能透過 [Live API](/docs/live-api/tools/) 在即時串流工作階段中使用工具。

工具是模型可用來回答查詢的特定能力（例如 Google 搜尋或程式碼執行）。Gemini API 提供一整套由 Google 完全代管的內建工具，你也可以透過[函式呼叫](/docs/function-calling/)定義自訂工具。

如要建構多步驟、以目標為導向的系統，請參閱[代理總覽](/docs/agents/)。

## 可用的內建工具 {#build-in-tools}


| 工具 | 說明 | 使用案例 |
| --- | --- | --- |
| [Google 搜尋](/docs/google-search/) | 以網路上的時事與事實為回應接地，降低幻覺發生的機率。 | 回答近期事件相關問題、以多元來源查證事實。 |
| [Google Maps](/docs/maps-grounding/) | 建構具備地點感知能力的助理，能尋找地點、取得路線，並提供豐富的在地脈絡。 | 規劃包含多個停靠點的旅遊行程、依使用者條件尋找在地商家。 |
| [程式碼執行](/docs/code-execution/) | 讓模型撰寫並執行 Python 程式碼，精確解出數學問題或處理資料。 | 解出複雜的數學方程式、精確處理與分析文字資料。 |
| [URL 上下文](/docs/url-context/) | 指示模型讀取並分析特定網頁或文件的內容。 | 根據特定 URL 或文件回答問題、跨不同網頁擷取資訊。 |
| [Computer Use](/docs/computer-use/) | 讓 Gemini 能檢視螢幕，並產生與網頁瀏覽器 UI 互動的操作（用戶端執行）。 | 自動化重複性的網頁工作流程、測試網頁應用程式的使用者介面。 |
| [File Search](/docs/file-search/) | 為你自己的文件建立索引並進行搜尋，以實現檢索增強生成（RAG）。 | 搜尋技術手冊、針對專有資料進行問答。 |
| [工具擷取（預覽版）](/docs/tool-retrieval/) | 讓模型搜尋你的工具程式庫，並只載入其所需的結構描述。 | 擁有數十個函式的代理，或連接數個 MCP 伺服器的情境。 |


特定工具的相關費用詳情，請參閱[定價頁面](/docs/pricing/#pricing-for-tools)。

## 工具的執行方式 {#how-tools-execution-works}

工具讓模型能在對話過程中要求執行操作。流程會依工具是內建（由 Google 代管）或自訂（由你代管）而有所不同。

### 內建工具流程 {#built-in-tool-flow}

使用內建工具（Google 搜尋、Google Maps、URL 上下文、File Search、程式碼執行）時，整個流程都在單一 API 呼叫內完成：

1. **You** 送出提示詞：「GOOG 最新股價的平方根是多少？」

2. **Gemini** 判斷需要使用工具，並在 Google 的伺服器上執行（例如先搜尋股價，再執行 Python 程式碼計算平方根）。

3. **Gemini** 回傳以工具結果為依據接地的最終答案。


### 自訂工具流程（函式呼叫） {#custom-tool-flow-function-calling}

使用自訂工具與 Computer Use 時，執行工作由你的應用程式處理：

1. **You** 送出提示詞，並一併送出函式（工具）宣告。

2. **Gemini** 可能回傳結構化 JSON 來呼叫特定函式（例如 `{"name": "get_order_status", "args": {"order_id": "123"}}`），且一律附帶唯一的 `id`。

3. **You** 在你的應用程式或環境中執行該函式。

4. **You** 將函式結果連同與函式呼叫相同的 `id` 一起送回 Gemini。

5. **Gemini** 運用結果產生最終回應，或發出另一次工具呼叫。


!!! note " "

      預覽版：對於同時使用 bash 與自訂工具進行建構的開發者，Gemini 3.1 Pro Preview 另透過 API 提供一個獨立端點，稱為 [`gemini-3.1-pro-preview-customtools`](/docs/models/gemini-3.1-pro-preview/#gemini-31-pro-preview-customtools)。


詳情請參閱[函式呼叫指南](/docs/function-calling/)。

### 結合內建與自訂工具的流程 {#combining-built-in-and-custom-tools-flow}


!!! note " "

      預覽版：Gemini 4 與 Gemini 3 系列模型支援在單一回合中結合內建工具與自訂工具的選項。


對於結合內建工具與自訂工具（函式呼叫）的請求，模型會運用[工具上下文流通](/docs/tool-combination/)來協調不同環境之間的執行：

1. **You** 送出提示詞，宣告要啟用的內建工具與自訂函式，並設定旗標開啟組合支援。

2. **Gemini** 執行內建工具；若產生任何用戶端函式呼叫，則交由使用者處理（何者先執行，取決於提示詞與模型的判斷）。它會回傳一份回應，其中包含：

   *    工具呼叫的確認

   *    工具回應的結果（若模型產生了兩個平行函式呼叫，這可能會出現在 JSON 之後）

   *    用來呼叫你的函式的結構化 JSON

   *    用於保留上下文的加密思考簽章


3. **You** 在你的應用程式或環境中執行該函式。

4. **You** 回傳 Gemini 回應的所有部分，再加上你的函式呼叫結果。

5. **Gemini** 運用所有合併後的上下文產生最終回應。


如要瞭解如何開啟內建與自訂工具組合的支援，以及上下文流通的範例，請參閱[工具組合指南](/docs/tool-combination/)。

## 結構化輸出與函式呼叫的比較 {#structured-outputs-vs-function-calling}

Gemini 提供兩種產生結構化輸出的方法。當模型需要連接你自己的工具或資料系統來執行中間步驟時，請使用[函式呼叫](/docs/function-calling/)。當你嚴格要求模型的最終回應必須符合特定結構定義（例如用於算繪自訂 UI）時，請使用[結構化輸出](/docs/structured-output/)。

## 搭配工具使用結構化輸出 {#structured-outputs}


!!! note " "

      預覽版：此功能僅適用於 Gemini 4 與 Gemini 3 系列模型。


你可以將[結構化輸出](/docs/structured-output/)與內建工具結合，確保以外部資料或運算結果接地的模型回應，依然符合嚴格的結構定義。

程式碼範例請參閱[搭配工具使用結構化輸出](/docs/structured-output/?example=recipe#tools)。
