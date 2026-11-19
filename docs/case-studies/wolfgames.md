# Wolf Games 如何運用 Gemini API 每日打造沉浸式犯罪故事

遊戲領域對新鮮、引人入勝的內容需求永無止境。對創新新創公司 Wolf Games 而言，這意味著每天向玩家提供新的互動式犯罪故事。他們運用 Gemini API 的力量，特別是 Gemini 2.0 Flash 與 Gemini 2.0 Flash Thinking，以空前的規模生成複雜敘事，實現這個雄心勃勃的目標。Wolf Games 的目標客群是渴望每日解謎體驗的手機遊戲玩家與推理愛好者。他們的應用程式每天提供寫實的犯罪現場，附有警方報告、照片、訪談與生動的角色，讓玩家能經常投入新的懸案之中。

## 挑戰：擴展每日敘事內容

維持這樣的每日節奏，需要內容生成的速度與準確性。在整合 Gemini API 之前，Wolf Games 面臨先前模型的障礙：難以產出一致的結構化輸出（成功率僅 80%），且提示詞執行時間緩慢（長達六分鐘）。「我們在提示詞執行 DAG 中運用 Gemini API，生成新穎且引人入勝的犯罪故事，」共同創辦人暨技術長 Noah Rosenberg 解釋道。「我們的流程編排了眾多精細調整的提示詞，從本質上非結構化的過程——敘事生成——中產出結構化內容。」

![工作流程應用程式的螢幕截圖，正在設定名為 "Generate Synopsis" 的 AI 任務，使用 gemini/gemini-1.5-flash 模型。](https://ai.google.dev/static/images/showcase/wolfgames/screenshot-1.png)

![工作流程應用程式的螢幕截圖，正在設定名為 "Generate Synopsis" 的 AI 任務，使用 gemini/gemini-1.5-flash 模型。](https://ai.google.dev/static/images/showcase/wolfgames/screenshot-2.png)

## Wolf Games 的創新提示詞引擎

Wolf Games 解法的核心是他們的內部工具「Prompt Composer」，用來管理他們的提示詞執行 DAG。這個框架讓他們能整合函式呼叫、執行自訂 Python 腳本處理確保名稱唯一等邏輯，並在整個生成過程中管理狀態。這讓他們能：輕鬆在不同模型之間切換，包括 Gemini 2.5 Pro、Gemini 2.0 Flash 與 Gemini 2.0 Flash Thinking。運用檢索增強生成（RAG），將所有生成的內容（例如角色背景故事與案件事件）儲存在持久性資料庫中，確保敘事連貫性。例如，在生成數位銀行對帳單時，參照一張事件的貝氏因果圖——它描繪了敘事中的邏輯相依關係——以確保準確與一致。強制結構化輸出，特別是 JSON，再以 Pydantic 等工具驗證，確保下游的可靠性。Wolf Games 運用 Gemini 2.0 Flash Thinking 處理具有大型上下文視窗（超過 10 萬個權杖）與輸出的複雜文字生成，整合了先前需要眾多步驟的工作流程。他們認為 Gemini 2.0 Flash 在較快速的任務上「效能驚人且可靠」，經常使用 Gemini 2.5 Pro 生成少樣本範例，以提升 Gemini 2.0 Flash 的表現。他們工作流程中的一項關鍵工具是 [Google AI Studio](https://aistudio.google.com/)。「Google AI Studio 已成為我最常用的 Google 產品，每日使用頻率甚至超過 Gmail、Calendar 與 Search，」Noah 分享道，凸顯了它在提示詞實驗上的價值。

## 速度、準確性與改進的工作流程

遷移到 Gemini 模型帶來了顯著的改進：**準確率提升**：提示詞執行成功率從 80% 飆升至 96%，確保高品質的結構化內容。**延遲降低**：大多數提示詞的完成時間從數分鐘大幅縮短至 20 秒以內。**內容生產流程精簡**：Gemini 模型——尤其是 Gemini 2.0 Flash——的速度與可靠性，顯著提升了他們每日製作精細犯罪故事的能力。「Gemini 模型直接回應了我們對快速且可靠地生成結構化敘事內容的需求，」Noah 強調。對 Wolf Games 而言，一個關鍵門檻是生成文字的速度要快過他們的寫手閱讀的速度，以維持創作的心流狀態——這是 Gemini 模型幫助他們持續達成的事。

## 展望未來

Wolf Games 計畫進一步運用 Gemini API，特別是探索即將推出的模型在生成更寫實遊戲證據方面的創意潛力。回顧這段經驗，Noah 給開發者的建議是：「花時間真正理解如何為 Gemini 模型建構提示詞。用更強大的模型來建立提示詞，交給更快的模型執行。」他強調結構完善的 schema 與少樣本範例的重要性，建議開發者「做實驗，培養對 Gemini 模型如何運用編碼在潛在空間中的資料的直覺」。對 Noah 而言，AI 是強大的創意催化劑：「我一輩子都是個『內容笨手』……如今有了 AI，我可以創造任何夢想中的東西，不必再費盡苦功。」Wolf Games 對 Gemini API 的創新運用，展現了它徹底改變遊戲開發的潛力，讓創作者能以前所未有的速度打造沉浸式體驗。你可以在 [Google AI Studio](https://aistudio.google.com/) 開始使用，並[探索 Gemini API 文件](https://ai.google.dev/gemini-api)著手打造 AI 的未來。

### 作者
