# 以 Gemini 模型的長上下文強化 AI 程式設計助理

長上下文視窗應用中最令人興奮的前沿之一，是程式碼產生與理解。大型程式碼庫需要對複雜關係與相依性有深入的理解，這是傳統 AI 模型難以掌握的。透過以大型上下文視窗擴展程式碼量，我們可以在程式碼產生與理解方面開啟全新層次的精確度與實用性。我們與 Sourcegraph 合作——Sourcegraph 是 [Cody AI 程式設計助理](https://sourcegraph.com/cody) 的開發者，Cody 支援 [Gemini 1.5 Pro 與 Flash](https://sourcegraph.com/blog/cody-vscode-1.22.0-release) 等 LLM——共同探索長上下文視窗在真實程式設計情境中的潛力。Sourcegraph 專注於將程式碼搜尋與智慧整合到 AI 程式碼產生中，並成功將 Cody 部署到擁有大型、複雜程式碼庫的企業，如 Palo Alto Networks 與 Leidos，使其成為這次探索的理想夥伴。

## Sourcegraph 的方法與成果

Sourcegraph 將 Cody 使用 100 萬 tokens 上下文視窗（使用 Google 的 Gemini 1.5 Flash）時的效能，與其正式版進行比較。這種直接比較讓他們能單獨看出擴展上下文的好處。他們專注於技術問答，這是開發者在處理大型程式碼庫時的一項關鍵任務。他們使用了一個需要深入理解程式碼的挑戰性問題資料集。結果令人矚目。Sourcegraph 的三個關鍵基準——Essential Recall、Essential Concision 與 Helpfulness——在使用較長上下文時都展現了顯著的改善。Essential Recall：回應中關鍵事實的比例大幅增加。Essential Concision：以回應長度正規化後的關鍵事實比例也有所改善，代表答案更精簡且更切題。Helpfulness：以回應長度正規化後的整體幫助度分數顯著提高，代表更友善的使用者體驗。

![長條圖，顯示 Code base 與使用 Gemini 1.5 Flash 的 Cody 之間的品質改善](https://ai.google.dev/static/images/showcase/sourcegraph/quality-improves-with-longuer-context.jpg)

此外，使用長上下文模型大幅降低了整體幻覺率（產生事實上不正確資訊的比率）。幻覺率從 18.97% 降至 10.48%，在精確度與可靠性上有顯著改善。

![長條圖，顯示 Code base 與使用 Gemini 1.5 Flash 的 Cody 之間的幻覺率差異](https://ai.google.dev/static/images/showcase/sourcegraph/hallucination-decreases-with-layered-context.jpg)

## 權衡與未來方向

雖然長上下文的好處顯著，但也存在權衡。首個 token 時間會隨著上下文長度線性增加。為了緩解這一點，Sourcegraph 實作了預先擷取機制與分層上下文模型架構，用於模型執行狀態的快取。搭配 Gemini 1.5 Flash 與 Pro 長上下文模型，這將 1MB 上下文的首個 token 時間從 30 到 40 秒最佳化到約 5 秒——對即時程式碼產生與技術協助而言是可觀的改善。這次合作展現了長上下文模型在革新程式碼理解與產生方面的變革潛力。我們很興奮能與 Sourcegraph 這樣的公司合作，持續以大型上下文視窗開啟更多創新的應用與範式。若要深入了解 Sourcegraph 詳細的評估方法、基準與分析，包括說明範例，別錯過他們的[深入部落格文章](https://sourcegraph.com/blog/towards-infinite-context-for-code)。

### 作者
