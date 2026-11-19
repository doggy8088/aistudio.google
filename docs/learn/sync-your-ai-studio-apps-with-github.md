# 將你的 AI Studio 應用程式與 GitHub 同步

將 GitHub 儲存庫連接到 AI Studio，無縫同步提交，讓你的專案隨時保持最新狀態。

![Jack Wotherspoon](https://www.gstatic.com/aistudio-static/editorial/page-msrgq2u0/jack-wotherspoon.webp)

![Kat Kampf](https://www.gstatic.com/aistudio-static/editorial/authors/XB4xLvDe8HVeqPSalRsV.webp)

你不再受限於一次性的儲存庫匯入或單向的程式碼匯出。AI Studio 現在支援與 **GitHub 的雙向同步**：將你在 AI Studio 中透過提示詞做出的變更直接推送到儲存庫、在 IDE 中或以 Antigravity 等代理在本機編輯、接收隊友的拉取請求，再將這些變更拉回 AI Studio！將 GitHub 與你的 AI Studio 應用程式同步，有以下主要好處：**處理 Git 事務**：AI Studio 為你處理進行中的同步，不需要任何 Git 指令。**完全的彈性**：由你掌控要整合哪些應用程式並連接到 GitHub。**自動生成的提交**：Gemini 會分析你暫存的檔案差異，並撰寫結構化的 Conventional Commit 訊息。**進階工作流程**：複製你的儲存庫並執行測試、讓隊友推送變更，或在 GitHub 中加入自訂 CI/CD，然後將變更同步回 AI Studio。

## 開始使用

在 AI Studio 中，你可以用兩種方式之一快速開始使用 GitHub。

## 匯入現有的 GitHub 儲存庫

你可以將現有的 GitHub 專案匯入 Google AI Studio，成為一個新應用程式：在 [AI Studio Build 頁面](http://ai.studio/build)上，點選提示框左下角的 **+** 按鈕，並選取 **Import from GitHub**。從你的帳號中選取一個儲存庫，或貼上儲存庫 URL。點選 **Import repository**。AI Studio 會分析你專案的框架、匯入程式碼庫，並建構應用程式。應用程式匯入完成後，會出現一個帶有 **Sync to GitHub** 按鈕的橫幅，點選它。在 GitHub 設定對話框中，選擇 **Force push to <repo-name>** 選項（注意：需要強制推送，因為 Google AI Studio 很可能已對程式碼做了變更，使其能在 AI Studio 中相容並成功建構）。你現有的儲存庫現在已成為 AI Studio 應用程式，並成功與 GitHub 同步。你可以在頂部設定工具列（⚙️）的 **GitHub** 分頁中管理同步，推送或拉取變更。

## 從 AI Studio 應用程式建立新的儲存庫

如果你已有一個 AI Studio 應用程式，可以輕鬆為它建立新的 GitHub 儲存庫，並直接在 AI Studio 中開始同步：開啟你想連結到新 GitHub 儲存庫的應用程式。在頂部設定工具列（ ⚙️）中，點選 **GitHub** 分頁。在 GitHub 設定對話框中選取 **Create new repository**。輸入 **Repository name**，以及選擇性的 **Description**。選擇儲存庫的可見性：**Private**（建議）或 **Public**。點選 **Create GitHub repository**。AI Studio 會在 main 分支上初始化儲存庫、推送你應用程式目前的檔案，並建立同步基準。

## 同步：推送、拉取與合併

AI Studio 會在你的應用程式與 GitHub 之間同步狀態。你隨時可以在設定側邊欄的 **GitHub** 分頁中查看狀態。這個分頁可以顯示數種不同的狀態，讓你檢視編輯過的檔案、查看自動生成的提交訊息等。以下是 GitHub 同步的各種狀態：**In Sync**：本機與遠端版本完全相同。**AI Studio Changes Ready**：你已在 AI Studio 中做出變更；可以推送到 GitHub。**Remote Changes Ready**：有新的提交被推送到 GitHub；可以拉取進 AI Studio。**Both Changed**：AI Studio 與 GitHub 同時發生了變更；進入差異檢視，視需要解決衝突。

![](https://www.gstatic.com/aistudio-static/editorial/sync-your-ai-studio-apps-with-github/1f8ea29f.png)

## 解鎖全新工作流程

有幾種新的工作流程，在 AI Studio 中有了 GitHub 同步之後變得容易許多，或是過去根本不可能實現：直接從 AI Studio 建構並提交到 GitHub；在本機以 Antigravity 開發、推送程式碼，再回到 AI Studio 繼續工作；從 GitHub 拉取最新程式碼，兩次點選就重新發布應用程式的新版本。

## 幾分鐘內建構、同步並部署你的應用程式

團隊與個人現在能以高得多的效率用 AI Studio 進行建構。團隊成員可以在共享儲存庫中協作開發一款遊戲。一位成員可以使用 Antigravity CLI，另一位則使用 AI Studio 開發功能。啟用 GitHub 同步後，使用 AI Studio 的成員可以拉取隊友在 Antigravity 中完成並提交到 GitHub 的變更，並在一分鐘內重新部署上線一款新版本的遊戲。GitHub 同步實現了協作、更強大的工作流程，並讓身為建構者的你，對應用程式的程式碼有更多掌控。

## 今天就來試試

GitHub 同步即日起開放給所有 Google AI Studio 使用者使用。在 [Google AI Studio](https://aistudio.google.com/build) 中開啟任何應用程式。點選右上方設定工具列中的 **GitHub** 分頁，連結現有儲存庫或建立新儲存庫。隨時點選 **Pull Changes** 或 **Push Changes**，讓你的工作保持同步！快來試試看，並在 X 上標記 [@GoogleAIStudio on X](https://x.com/GoogleAIStudio) 或在 [Google AI Developer Forum](https://discuss.ai.google.dev/) 分享，讓我們知道你打造了什麼！
