# Optimal AI 運用 Gemini API 將程式碼審查時間縮短 50%

程式碼審查雖然對品質至關重要，卻常成為快速開發節奏中的瓶頸。[Optimal AI](http://www.getoptimal.ai/) 正在改變這一點。他們的使命是「把時間還給工程師」，運用 AI 自動化工程與合規作業。他們的解決方案包括專注於安全與合規的 AI 程式碼審查員 Optibot，以及一個由 Gemini API 驅動、用來最佳化開發速度的洞察平台。過去，Optimal AI 面臨的挑戰在於：真正有效的 AI 程式碼審查所需的速度與上下文理解能力。「最大的挑戰是上下文理解——我們需要一個能檢視程式碼變更集，並真正理解其上下文的模型，」共同創辦人暨技術長 Syed Ahmed 解釋道。

## 提升效率

透過整合 Gemini API，Optimal AI 大幅強化了其產品能力：**提升程式碼審查的速度與準確度**：由 Gemini API 驅動的 Optibot 會自動審查拉取請求中的安全漏洞、合規風險與程式碼模式，提供可行的回饋，並大幅縮短審查時間。**萃取可行的工程洞察**：Gemini 模型分析來自 GitHub 與 Jira 的資料，找出瓶頸並理解工程績效，有效區分有生產力的活動與程式碼流失（code churn）。**在速度與精深度之間取得平衡**：Optimal AI 運用 Gemini 1.5 Pro 進行複雜分析與深入的程式碼理解，同時以 Gemini 1.5 Flash 提供低延遲任務（如快速摘要）所需的速度。

## Optimal AI 如何使用 Gemini API

Optimal AI 的實作展現了 Gemini API 的彈性：**使用的模型**：Gemini 1.5 Pro：用於深入的程式碼分析、安全檢查、對拉取請求的上下文回饋，以及為績效洞察辨識複雜的工程模式。Gemini 1.5 Flash：用於低延遲任務，例如檔案樹掃描與快速生成摘要。**主要功能與實作**：**上下文理解**：Gemini 模型龐大的上下文視窗，是解讀複雜程式碼變更集與理解更廣泛工程模式的關鍵。**多語言支援**：Gemini 模型處理多種程式語言與框架的能力大幅提升，是 Optimal AI 的一大勝利。**[Google AI Studio](https://aistudio.google.com/)**：團隊大量使用 Google AI Studio 進行快速的提示詞測試、模型評估與迭代。「能把輸出與實作程式碼並排檢視，讓我們的工程師做實驗變得容易許多，」Ahmed 表示。

![OpenAI GPT-4、Gemini 1.5 Pro 與 Gemini 1.5 Experimental 的程式碼審查指標比較。](https://ai.google.dev/static/images/showcase/optimalai/Google-Case-Study-Model-Comparison-Activity-Analysis.jpg)

## 成果：更快的審查

整合 Gemini 的影響，對 Optimal AI 及其客戶而言都十分顯著。主要成果包括：**拉取請求週期時間縮短 50%**：工程師等待審查的時間更少，花在寫程式上的時間更多。**客戶快速採用並擴大使用**：像 MongoDB 這樣的公司在體驗到其效益後，大幅增加了對 Optimal AI 的使用，工程師人數從 5 人成長到 40 多人。**成功完成 225 萬美元的種子前輪募資**：這是在私人測試階段達成的，主要由 Gemini API 驅動功能所展現的吸引力與成果推動。「團隊很喜歡 Optibot 幫他們把 PR 審查時間砍半，讓工程師能花更多時間寫程式，而不是等待核准，」Ahmed 分享道。

## 展望未來

Optimal AI 專注於擴充其 AI 代理套件，自動化更多重複性任務。他們目前正在開發「Code Radar」，一個設計來自主監控、修補並保護程式碼庫的代理。回顧與 Gemini API 的旅程，Syed Ahmed 給其他開發者這樣的建議：「直接去 Google AI Studio——它有更好的工具、更好的文件，實驗起來效率高得多。」他也強調：「充分利用 Gemini 模型的上下文視窗。盡可能多餵給模型相關的上下文……我們提供的上下文越多，AI 的推理就越好。」Optimal AI 的成功展示了 Gemini API 如何改變軟體開發，讓團隊更快地打造更好的軟體。準備好開始打造了嗎？立即探索 [Gemini API 文件](https://ai.google.dev/gemini-api)，並從 [Google AI Studio](https://aistudio.google.com/) 開始。

### 作者
