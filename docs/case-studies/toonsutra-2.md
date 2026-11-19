# Toonsutra 讓漫畫活起來：由 Gemini API、Gemini 2.5 Pro Preview 與 Lyria 2 驅動的沉浸式閱讀體驗

Toonsutra 是印度最大的網路漫畫與圖像小說平台，其使命是讓全球讀者走進浩瀚的網路漫畫敘事宇宙，尤其著重讓世界級的故事能以印度語言親近讀者。為了加深讀者的參與感，Toonsutra 拋出一個問題：我們如何把傳統的漫畫閱讀體驗，轉變為一場沉浸式的電影之旅，讓聲音、音樂與故事以讀者夢中使用的語言自然流動？

## 打造互動敘事的下一篇章

這個問題成為 Toonsutra 的核心關注。社群的回饋凸顯了讀者對更深層參與感與更廣泛可及性的渴望。看見 AI 的巨大潛力，並在 Google 的 [AI Futures Fund](https://labs.google/aifuturesfund) 支持下，Toonsutra 與 Google 的 Labs 及 Partner Innovation 團隊合作。他們共同運用 Gemini API（以 Gemini 2.5 Pro Preview 為核心）與 [Lyria 2](https://deepmind.google/technologies/lyria/)（Google DeepMind 的音樂生成模型），為全球粉絲重新定義網路漫畫體驗。這項合作在 Google I/O 上亮相，展示了 AI 驅動的漫畫體驗：故事不再只是靜靜躺在頁面上，而是會回應、會互動，把靜態圖像轉化為動態的音訊敘事：**自適應 AI 旁白**：Gemini 2.5 Pro Preview 創造能配合閱讀速度流動的 AI 旁白，以鮮明的聲音讓角色活靈活現。這對印度讀者影響特別深遠，因為當地語言的文化細微差異極大。Gemini 2.5 Pro 的自適應與多語言能力，結合 Toonsutra 專有的角色上下文引擎，確保敘事一致且細膩。**動態音景**：透過 Gemini 2.5 Pro Preview 的多模態理解，以及 Lyria 與 Gemini 的原生音訊生成能力，平台能產生沉浸式的音景，包括量身打造的音樂、配音與動作音效——從劍刃的鏗鏘聲，到熙攘市集的氛圍。**強化的互動性**：由 Gemini 2.5 Pro Preview 驅動的元素，讓讀者能觸發獨特的對話、探索隱藏的細節，或巧妙地影響敘事線索，確保每次閱讀體驗都各有不同。

## 技術細節

這個專案提出了一種新穎的方法，能為數位漫畫自動生成沉浸式音訊，並附帶同步的空間中繼資料。其核心是建立在 Gemini 2.5 Pro Preview 之上的多代理架構，由多個專門的代理組成：Comic Context Extractor、Narrator、Music Composer、Music Director 與 Sound Effects Agents。工作流程從 Comic Context Extractor Agent 開始，它分析多個漫畫章節，整理出完整的劇情大綱、類型與角色特質。接著擷取各個分鏡並定義邊界。Narrator Agent 將逐字稿中的對話與這些分鏡對齊，再結合角色上下文，由 Gemini Native Audio 配音。與此同時，Music Composer Agent 受到電影配樂的啟發，使用 Gemini 2.5 Pro Preview 辨識各章節的主題與情感，將其轉化為音樂提示詞，讓 Lyria 生成背景配樂。Music Director Agent 將音樂對應到特定的分鏡，Sound Effects Agent 則把分鏡對應到相關的音效標籤，這些標籤是從資料庫中擷取的。這個工作流程最終產出一份 JSON 檔案，詳列分鏡座標、配音、音效與同步音樂，並交付給 Toonsutra 的前端。一項關鍵成就是 Gemini 能以印度語言原生生成這種電影級的音訊，從印地語開始，進一步推進 Toonsutra 的可及性使命。

> 「運用 Gemini 的多模態與多語言能力來做這個案例，實在既有趣又令人興奮。使用 Google 強大的大型語言模型，從語意上理解圖像、角色、素描與主題，是一個把輸入媒體濃縮至其本質的絕佳機制。Lyria 強大的音樂生成能力與 Gemini 的原生語音能力，特別是在印度語言方面，提升了我們與 Toonsutra 合作交付的最終體驗。」

— Avneet（PM，Google Partner Innovation）

## 從 Google I/O 到正式推出

Google I/O 上的展示是一個了不起的里程碑，展現了 AI 如何從根本上提升數位內容。對 Toonsutra 而言，這只是第一章。正如我們團隊常說的：「Toonsutra 的願景始終是讓漫畫對每一個人、每一個地方都更吸引人、更容易親近。這次與 Google 的合作，是邁向這個願景的一大步。創造這些深度沉浸、AI 驅動的閱讀體驗的能力，直接回應了我們社群的回饋，並加速了我們的創新。我們對 I/O 上的迴響感到非常興奮，也迫不及待想把這項功能整合進 Toonsutra 應用程式，最終甚至探索推出 API 的可能，賦能其他創作者。」Toonsutra 目前專注於分階段把這些功能整合進他們的主要應用程式，並仔細聆聽社群的回饋。他們相信，他們不只是在豐富自己的平台，也在協助打造 AI 強化內容的新藍圖。準備好開始建置了嗎？立即探索 [Gemini API 文件](/docs/)，並透過 [Google AI Studio](https://aistudio.google.com/) 開始使用。Toonsutra 是 Google AI Futures Fund 的參與者，該基金投資並與雄心勃勃的新創公司合作，共同建置 AI 的下一步。

### 作者
