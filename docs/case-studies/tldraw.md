# Gemini 為 tldraw 的自然語言運算體驗提供動力

## 透過 Gemini API 解鎖自然語言互動

Gemini API 讓開發者能將先進的 AI 能力無縫整合到應用程式中，為使用者體驗與功能開啟全新可能。本文將介紹 tldraw 如何運用 Gemini，在其新專案 [computer](https://computer.tldraw.com/) 中打造革命性的「自然語言運算」體驗。這展示了新創公司能以多快的速度、多輕鬆的方式，透過 Gemini API 與 tldraw 的 [canvas SDK](https://tldraw.dev/) 整合強大的 AI。tldraw 團隊即將推出搭載 [Gemini 1.5 Flash](/docs/models/gemini/#gemini-1.5-flash) 的 computer（[加入候補名單](https://computer.tldraw.com/)），目前正以 [Gemini 2.0](/docs/models/gemini/#gemini-2.0-flash) Flash 進行原型開發，為未來的迭代做準備。

tldraw 正使用 Gemini API，將對話式 AI 的力量帶入視覺化程式設計，讓使用者以自然語言生成內容並處理資訊。這為更直覺、更有效率的 AI 使用者體驗開啟了令人興奮的機會，並拓展視覺溝通的邊界。

## computer 背後的願景

tldraw 致力於讓圖表製作變得平易近人又直覺，並設想出一種更自然的方式，讓使用者與畫布互動。創辦人 Steve Ruiz 希望運用 tldraw 無限畫布 SDK 的力量，打造一個運用生成式 AI 的動態環境。這個願景催生了 [computer](http://computer.tldraw.com/)——一個實驗性應用程式，讓使用者以文字、圖片與指令組成的區塊建立工作流程。執行時，資訊從一個元件流向下一個元件，每一次生成的輸出成為下一次的輸入，形成能分支、迴圈與迭代產出成果的強大流程。

## 以 Gemini 2.0 打造：深入剖析 computer

tldraw 的 computer 建立在一張由相互連結的「元件」組成的網路之上，這些元件代表畫布上的元素（文字方塊、圖片、音訊片段等）。這些元件以箭頭相連，將資料與轉換的流向視覺化。每個元件都有相應的「程序」——根據所連接元件的輸入而執行的指令集。一個元件可以接受任意數量的其他元件傳來的資料，並將其輸出資料傳給許多其他元件——包括它自己！這種以元件為基礎的架構，結合 Gemini 2.0 Flash 的力量與速度，形成一個快速且彈性的系統，能處理多樣化的任務。

以下是 Gemini 2.0 Flash 的原型開發如何為這個體驗提供動力：**閃電般快速的程序執行**：Gemini 2.0 Flash 能迅速執行程序。例如，一個「Instruction」元件可能包含「Write a short commercial.」。被觸發後短短片刻，元件就會生成一套可重複使用的步驟腳本，能將任意輸入組合轉化為廣告腳本。接著，元件會運用這套腳本，連同目前的輸入（例如一個內容為「New AI-powered smartgloves for cats」的「Text」元件），向模型發出第二次提示詞，取得最終輸出。這個輸出可能會傳給另一個相連的「Text」元件來顯示，也會傳給其他連接的元件，例如用於文字轉語音的「Speech」、用於視覺生成的「Image」，或其他用於進一步轉換的「Instruction」元件。**大量上下文、多種模式**：tldraw 的 computer 走極繁主義路線，需要速度、容量與能力。由於每次生成都有多個元件提供資料，Gemini 2.0 Flash 龐大的上下文視窗是產出能納入所有輸入的成果的關鍵，它對圖片與檔案的支援（與文字提示詞並用）同樣重要。**結構化資料**：若不遵循單一結構描述，元件之間的資料流動根本無從實現。Gemini 2.0 Flash 的結構化 JSON 輸出，確保工作流程中的每個元件都能辨識任何類型的資料，並以相同結構產出輸出，避免停滯、讓執行順暢，並確保即使是大型工作流程也能可靠地完成。**動態程序生成**：除了執行預先定義的程序，Gemini 2.0 Flash 還能動態生成程序。使用者可以輸入「create a marketing campaign based on this product description」，Gemini 2.0 Flash 就會生成必要的步驟（程序）與所需的元件，根據使用者的高層次請求在畫布上建立出一個工作流程。這種動態生成為創新的使用者體驗與精簡的工作流程，開啟了巨大的潛力。

## 創新的一次快速勝利

tldraw 快速實作出 computer，凸顯了 Gemini 對新創公司的價值主張：快速原型開發、透過直覺的自然語言介面提升使用者體驗，以及借助 Gemini 2.0 Flash 等模型實現高效率的結構化資料處理。這些結合起來，讓小團隊能快速且具成本效益地打造創新的 AI 功能。

> 「我們想證明，任何團隊都能用 tldraw 的 canvas SDK 打造雄心勃勃的專案。Gemini Flash 是快速、多模態、以畫布為基礎的工作流程工具的完美引擎。有了 Gemini 2.0，再加上一個更好的名字，我幾乎可以肯定，我們明天就能把 computer 當成一間獨立的新創公司來提案。」

— Steve Ruiz，tldraw 創辦人

## 透過 Gemini API 為你的應用程式賦能

受到 tldraw 成功的啟發嗎？Gemini API 提供 Gemini 1.5 Pro、Gemini 1.5 Flash 等強大模型，以及現已作為實驗性預覽模型的 Gemini 2.0 Flash，為你的應用程式帶來創新的 AI 功能。探索 [Gemini API 文件](/docs/)，用 AI 為你的使用者賦能。對創意專業人士、開發者與各種團隊來說，tldraw 提供了一個獨特而強大的平台，讓想法成真。[加入 computer 候補名單](https://computer.tldraw.com/)，立即[體驗視覺協作的未來](https://tldraw.dev/)。

### 作者
