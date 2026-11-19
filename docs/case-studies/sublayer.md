# 以 Gemini API 強化 AI 驅動的開發者工具

過去一年，AI 的普及為開發者開啟了兩大機會：讓尖端 AI 整合進專案變得異常容易，以及把 AI 帶來的效率導入開發流程。[Sublayer](https://www.sublayer.com/) 是一個以 Ruby 為基礎的 AI 代理框架，它把我們的 1.5 模型整合進核心開發者產品與自家工具工作流程中，展現了 Gemini API 的威力與效率。

## 以 Gemini 讓 Sublayer 文件保持最新

AI 為開發者帶來的機會之一，是讓團隊——尤其是小型、早期階段的新創公司——能以更少資源做更多事。對許多團隊來說，這可以是像文件這樣簡單卻關鍵的事。Sublayer 在自家工作流程中，把函式庫與 Gemini 1.5 Pro 整合，並建立 AI 自動化，協助維持文件最新並找出可改進之處。

> 「這一切都源於 Gemini 龐大的上下文視窗，它真的給了你喘息的空間，讓你能嘗試新想法，不必一開始就陷入複雜、最佳化的實作裡。」

——Sublayer 執行長 Scott Werner 說道，他最近在 [Waste Inferences!](https://www.sublayer.com/blog/posts/waste-inferences) 一文中寫到了這個概念

流程是這樣的：每當有 PR 合併進 Sublayer 的主要存放庫，就會觸發一個代理開始更新文件。代理會產生一個提示詞，其中包含函式庫的全部內容、文件的全部內容、PR 的所有相關內容，以及說明任務的指令，然後送給 Gemini。Gemini 接著回傳結構化輸出，內含檔案路徑、名稱與內容，Sublayer 函式庫會將其轉換成可用的物件。最後，代理拿著收到的結構化資訊，建立新分支、依要求修改檔案，並提交新的 PR。

```
          
# Get the diff from the PR
diff = GithubGetDiffAction.new(repo: repo, pr_number: pr_number).call

# Get the contents of the library repository and docs repository
code_context = GetContextAction.new(path: code_repo_path).call
doc_context = GetContextAction.new(path: doc_repo_path).call

# Use Gemini 1.5 Pro to decide whether this PR requires a documentation update
result = DocUpdateNecessityGenerator.new(
  code_context: code_context,
  doc_context: doc_context,
  diff: diff
).generate

# Use Gemini 1.5 Pro to generate suggested changes to the documentation
doc_update_suggestions = DocUpdateSuggestionGenerator.new(
  code_context: code_context,
  doc_context: doc_context,
  context_ignore_list: context_ignore_list,
    diff: diff
).generate

# Use Gemini 1.5 Pro to generate the changes to the suggested files
file_updates = DocUpdateGenerator.new(
  code_context: code_context,
  suggestions: suggestions,
  doc_context: doc_context,
  context_ignore_list: context_ignore_list
).generate

# Update each of the files returned by Gemini 1.5 Pro and create a new PR
          
        
```

完整的工作流程程式碼見 [Sublayer 的開源範例](https://github.com/sublayerapp/sublayer/blob/main/.github/workflows/github_actions/update_docs.rb)

在第一個專案成功之後，他們進一步擴展到監控個別資源存放庫的代理，專注於讓文件中某個特定的型錄頁面保持最新。甚至還有一個類似的任務在夜間執行：Gemini 分析目前的文件，找出幾處可改進的地方，依影響程度排序，並產生一個 PR，讓 Sublayer 團隊每天早上醒來就能審查。

## 以 Gemini 模型把 AI 帶給 Ruby 開發者社群

除了讓自家的開發者基礎設施與工具更有效率，Sublayer 也在其核心產品功能中支援 Gemini 模型。Sublayer 的使命，是讓個別開發者與小型團隊有能力挑戰過去因成本或複雜度而遙不可及的雄心專案。他們專注於自動化繁瑣、耗時又重複的任務——這正是 AI 的完美應用場景。範圍從大規模的程式碼遷移（類似操作需要重複數千次），到把清單上耗費時間與精力的小任務自動化所帶來的日常效率提升。Sublayer 的一項主要挑戰，是支援在 AI 生態系中相對未獲足夠服務的 Ruby 開發者社群。整合 Gemini 讓他們能滿足工具中日益增長的 Gemini 支援需求。Sublayer 的 Gemini 實作非常有效率，歸功於他們的抽象層，只需要大約 60 行程式碼。他們使用結構化輸出，以單輪迭代的方式與模型互動。這種做法簡化了開發與除錯，幫助開發者建置穩健的應用程式。Werner 建議：「建置以 LLM 為基礎的應用程式時，要把問題拆解成最小的組成部分。你會希望程式能有效處理任何模型輸出，這甚至可能意味著刻意加入讓人先審查與編輯的步驟，再繼續往下進行。」

## LLM：AI 基礎設施拼圖中的核心一塊

對 Sublayer 而言，像 Gemini 這樣的 LLM 是不可或缺的基礎設施，就如同資料庫。他們的框架設計為能無縫整合對 Gemini 1.5 Pro 與 Gemini 1.5 Flash 的呼叫，擷取結構化資料，讓開發者能直接在應用程式中運用。這種做法開啟了無限可能：從多元資料來源中萃取洞見、產生程式碼，到跨語言與函式庫轉換程式碼庫。Sublayer 甚至用 Gemini 模型讓使用者能在框架本身之內產生新的功能元件。這種「自我組裝」的特性鼓勵實驗，讓使用者能快速探索新穎的想法。

> 「Gemini 非常擅長解決我們框架設計上要讓一切變簡單的所有問題——程式碼產生、任務拆解、遵循指令，以及根據範例產生新的資料結構。」

— Scott Werner, Sublayer

## 下一步

展望未來，Sublayer 正準備推出 [Augmentations.ai](https://augmentations.ai/)，一個讓所有開發團隊都能使用他們所建立自動化的平台。首波發布將包含兩個由 Gemini 1.5 Pro 驅動的工具：Semantic Linting，讓團隊能建立理解上下文、落實不斷演進最佳實務的 AI 程式碼審查規則；以及 Weekly Summaries，把跨多個存放庫與產品管理工具的開發活動，轉化為管理層可採取行動的洞見。隨著他們在 Augmentations 平台上推出更多工具，他們計畫持續混用 Gemini 1.5 Pro 處理較複雜的任務，以及 Gemini 1.5 Flash 處理對延遲較敏感、面向使用者的功能。這項工作也會回饋到他們的開源框架，讓 Ruby 社群能在 Gemini 新功能推出時立即受惠，同時由 Sublayer 團隊的實際使用經驗所驅動。Sublayer 的故事展現了 Gemini API 的變革潛力。它證明了開發者能多麼輕鬆地把 Gemini 整合進工作流程，為創新與自動化開啟無限機會。想開始使用 Gemini 模型建置，請閱讀我們的 [API 文件](https://ai.google.dev/gemini-api/docs)。

### 作者
