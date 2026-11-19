# Ava：以 Gemini 2.5 Flash 與 Live API 打造代理式工作流程

[Ava](https://hiava.app/?utm_source=google&utm_medium=blog&utm_campaign=spotlight) 是一個「AI 驅動的家庭作業系統」，旨在透過預測需求與自動化任務來管理家庭生活的後勤事務。家長管理的資訊很少是結構化的；它透過不一致的學校電子郵件、傳單截圖、PDF 附件、冗長的 WhatsApp 對話串與語音筆記而來。Ava 必須理解上下文，並與外部服務無縫互動。為了處理現實世界混亂、非結構化的輸入，Ava 團隊實作了分層架構，在其代理管線的不同階段使用 [Gemini 2.5 Flash 模型](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-flash)，並使用 [Live API](https://ai.google.dev/gemini-api/docs/live) 提供對話式介面。

![Ava 展示](https://www.gstatic.com/aistudio/case_studies/ava/ava-showcase.jpg)

## 最佳化效能與效率

傳入的要求首先會遇到一個輕量級的代理路由器，讓使用者體驗感覺反應靈敏。這個路由器扮演分流系統的角色，分類輸入的優先順序、萃取關鍵欄位（誰、何時、何地），並決定需要哪個專門工具或後續模型。根據 Ava 共同創辦人暨技術長 Joe Alicata 的說法，「Gemini 2.5 Flash-Lite 在超輕量檢查方面表現出色」，處理意圖偵測與短篇摘要，同時提供次秒級的回應。

## 處理複雜的規劃與執行

一旦意圖確立，任務往往需要更深入的推理。例如，解析學校行事曆、正規化不一致的日期，並提出正確的活動，需要細膩的理解。Gemini 2.5 Flash 讓 Ava 能滿足嚴格的技術要求，擔任稱職的「家庭營運長」：**多模態理解**：在單次處理中處理文字、圖片與音訊。**在模糊情況下更高的精確度**：正確解讀不一致的學校溝通內容。**可靠的函式呼叫**：確保諸如呼叫 Gmail 與 Calendar API 等動作，使用結構化且可信賴的資料。家庭可以完全透過 Live API 啟用的語音互動來管理家務。Alicata 指出，他們對「原生音訊」有「硬性要求」，這樣 Ava 才感覺像是一個自然好用的工具。

## 打造代理式系統的成熟方法

團隊在開發過程中廣泛使用 Google AI Studio，快速迭代提示詞與工具 schema，並對候選模型進行 A/B 測試，將從想法到測試的循環從數天縮短到數小時。結果證明了他們多模型方法的有效性。他們觀察到，在電子郵件串與傳單照片等吵雜輸入上，首次處理的精確度更高。在 alpha 衝刺期間，Ava 有 80% 的使用者是每日活躍使用者，數以千計經過分流的活動被核准並加入行事曆。透過將高效模型用於快速讀取、把資源密集的模型保留給複雜分析，代理式系統能以真實生活的速度運作。若要探索 Gemini 模型與 Live API 如何簡化代理式工作流程，請查看我們的 [API 文件](https://ai.google.dev/gemini-api/docs)。

### 作者
