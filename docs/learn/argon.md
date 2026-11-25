# Gemini 4 Argon：開發者指南

Gemini 4 Argon 是我們為複雜工作流程打造的新一代尖端模型，適用於真實世界的軟體工程、企業知識工作與資安防禦。

作者：[Geneviève Huskens](https://aistudio.google.com/)、[Jack Wotherspoon](https://aistudio.google.com/)
發布於 2026 年 10 月 13 日

今天，我們開始在全球向開發者與企業[推出 **Gemini 4 Argon**](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/)。你可以透過 Google AI Studio 中 Gemini API 的付費層級開始建構；Google AI Ultra 訂閱者則可在 AI Studio 以及我們以代理為核心的開發平台 [Google Antigravity](https://antigravity.google/) 中使用。Gemini 4 Argon 經過訓練，能比以往任何 Gemini 模型**工作更久**、**更能保留上下文**。從大規模程式碼庫重構與效能最佳化，到漏洞修補與多模態合成，它就是為你最艱鉅的任務而打造，從頭到尾一手包辦。

### Gemini 4 Argon 模型總覽

| 模型 | 模型 ID | 預設思考 | 定價（每 100 萬 tokens） |
| --- | --- | --- | --- |
| **Gemini 4 Argon** | `gemini-4-argon` | `medium` | **優惠價（至 11 月 30 日）**：輸入 $2 · 輸出 $10 *（快取享 95% 折扣）* **12 月 1 日起**：輸入 $4 · 輸出 $20 · [定價詳情](/docs/pricing/) |

Argon 透過 Gemini API 支援**統一的 100 萬 tokens 上下文視窗**，輸入與輸出 tokens 共用（先前模型的上限為 64k），並提供可調整的思考等級（`low`、`medium`、`high`），以及同一套內建的 Gemini API 工具。本指南將介紹 Gemini 4 Argon 的新功能，並分享使用這個模型的實用技巧。想進一步了解 Gemini 4 Argon 在機器人、科學、金融、法律等領域的應用，請參閱我們的[公告部落格文章](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/)。

## Gemini 4 Argon 為開發者工作流程帶來的新能力

Gemini 4 Argon 強化的推理與問題解決能力，讓它有餘裕把龐大的問題從頭到尾處理完畢。**長程工程與安全任務**：把一個可衡量的目標交給 Argon，例如拆解老舊子系統、把程式碼庫從 C++ 重構為 Rust，或修復安全漏洞，讓它自行建立驗證框架、以編譯器或執行階段的輸出驗證假設，並反覆迭代直到任務完成。**端到端多模態與商務工作流程**：把混雜了長影片、PDF、試算表、財務帳冊或法律文件的密集資料夾交給 Argon，讓它跨格式交叉比對事實，把非結構化輸入直接轉成互動式儀表板、投影片或經審核的修訂稿。**3D 視覺化、模擬與全端應用程式**：結合 Argon 的空間推理與視覺程式碼生成能力，搭配 Blender、Three.js、WebGPU 等工具，打造複雜的 3D 場景、物理模擬與全端 Web 應用程式。實作工作流程請參閱我們的配套指南：[**以 Gemini 4 Argon 打造 3D 遊戲與程序化世界**](/learn/building-3d-games-and-worlds-with-gemini-4-argon/?e=0)。

## API 的新功能

在深入工作流程技巧之前，先來看看透過 Gemini API 呼叫 `gemini-4-argon` 時需要知道的重要 API 更新：

### 以 thinking_level 控制推理深度

Gemini 4 Argon 使用 `thinking_level`（`"low"` | `"medium"` | `"high"`）來控制模型在回應前進行多少推理（思考）：• **`"high"`**：最大化推理深度，適用於多檔案根本原因除錯、安全漏洞修補、形式數學與前期架構設計。• **`"medium"`（預設）**：當你想在互動式程式設計與代理工具使用情境中，兼顧速度、成本效率與高首次通過準確率時，建議使用這個等級。• **`"low"`**：把延遲與成本降到最低，適用於高速分類、路由與定向擷取。

```
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-4-argon",
    input=(
        "Build a single-file HTML drum machine and synth using the "
        "Web Audio API with a 16-step sequencer, tempo slider, and "
        "a live waveform visualizer."
    ),
    generation_config={
        "thinking_level": "medium"  # "low" | "medium" (default) | "high"
    },
)
print(interaction.output_text)
```

**在 Google AI Studio 中測試這個提示詞**：在 Playground 中開啟預先載入 `gemini-4-argon` 的 Web Audio 鼓機與合成器提示詞。

### 統一的 100 萬輸入輸出 token 上限與長解碼

先前的 Gemini 模型把輸出上限（思考＋回應）設在 64Ktokens。在 Gemini 4 Argon 中，輸入、思考與輸出在 Gemini API 裡共用一個統一的 100 萬 tokens 視窗，你可以使用**長解碼**生成超過 64Ktokens的內容（上限為 100 萬 tokens 扣除你的輸入），讓 Argon 想思考多久都行，同時在單次生成中傳回完整的多檔案差異、測試套件或長篇證明。**預設輸出上限為 `65,536`（`64K`）個 token**：在 Interactions API 上，串流與非串流要求預設都是 `65,536` 個 token，不需修改任何程式碼。**使用 `background=True` 生成最多 100 萬 tokens**：若要在 Interactions API 上生成超過 `65,536` 個 token，請設定 `background=True`，並把 `max_output_tokens` 設為高於 `65536`。設定值要夠高，避免思考把答案截斷；也要夠低，以免艱難的提示詞把額度用光時花費失控。

**注意**：若你需要更細緻地控制長解碼，可以改用用戶端的長解碼接續方式，目前僅透過舊版 **GenerateContent API** 提供。用戶端接續很快也會來到 Interactions API，作為自行管理韌性的進階選項。

```
import time

from google import genai

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-4-argon",
    input="Write a complete, rigorous proof of the prime number theorem.",
    background=True,
    generation_config={
        "max_output_tokens": 262144,
        "thinking_level": "high",
    },
)

while interaction.status in ("in_progress", "queued"):
    time.sleep(5)
    interaction = client.interactions.get(id=interaction.id)

# Each segment adds a model_output step, so join the text of all of them.
text = "".join(
    content.text
    for step in interaction.steps
    if step.type == "model_output"
    for content in step.content
    if content.type == "text"
)
print(text)
print("Status:", interaction.status)
print("Usage:", interaction.usage)
```

詳情請參閱 [Gemini 4 Argon 的新功能](/docs/latest-model/)，內容包括如何更新寫死的 `64K` 同步輸出上限、背景保留、動態輸出截斷與無狀態接續。

### 從先前模型遷移

遷移到 Gemini 4 Argon 時，請清理以下參數：**以 `thinking_level` 取代 `thinking_budget`**：`thinking_budget` 已淘汰，使用時會傳回警告。**移除 `temperature`、`top_p` 與 `top_k`**：`gemini-4-argon` 會忽略自訂取樣值，並傳回淘汰警告。**停用顯式上下文快取**：移除建立或傳入顯式 `cached_content` 的呼叫。隱式快取會自動啟用，快取的輸入 tokens 享有 **95% 折扣**。**拉長用戶端逾時**：艱難的推理提示詞可能需要數分鐘。請在 Interactions API 上使用 `background=True`，或把 HTTP 用戶端逾時設為至少 15 到 20 分鐘。完整詳情請參閱我們的[遷移檢查清單](https://ai.google.dev/gemini-api/docs/latest-model#migration-checklist)，或在你的程式設計代理中安裝 `gemini-api-dev` [技能](https://ai.google.dev/gemini-api/docs/coding-agents#gemini-api-dev)，請它把你的程式碼庫遷移到 `gemini-4-argon`。

## 在受管理代理中使用 Gemini 4 Argon

你也可以把 `gemini-4-argon` 用作 [Gemini API 受管理代理](https://ai.google.dev/gemini-api/docs/antigravity-agent) 的模型。受管理代理提供代管沙箱與 Antigravity 框架，讓 Argon 的尖端推理能透過單一 API 呼叫搜尋網路、撰寫程式碼、驗證成果並呼叫 MCP 工具。

```
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    agent="antigravity-preview-09-2026",
    agent_config={
        "type": "antigravity",
        "model": "gemini-4-argon",
    },
    input=(
        "Audit https://web.dev for performance, Core Web Vitals, and SEO. "
        "Query Google's PageSpeed Insights API for both Mobile and Desktop strategies. "
        "Check search indexing with Google Search for site:web.dev. "
        "Format the output as a side-by-side scorecard table with prioritized fixes."
    ),
    environment="remote",
)

print(interaction.output_text)
```

### Finance Story

由 Argon 為你的財務打造的個人化互動視覺化工具。放入你過去一年的交易紀錄，讓代理把它們轉成動畫與視覺圖表。

![Finance Story - Gemini 受管理代理](https://www.gstatic.com/aistudio-static/applets/finance-story/image.png)

### Pixel Arcade

一台能讓你生成個人化遊戲的街機。選好角色與想要的遊戲風格，受管理代理就會打造、試玩，並把一款能玩的遊戲交回你手上。

![Pixel Arcade - Gemini 受管理代理](https://www.gstatic.com/aistudio-static/applets/pixel-arcade/image.png)

## 使用 Gemini 4 Argon 建構的 5 個實用技巧

以下是我們的團隊用來充分發揮這個模型、攻克最艱鉅問題的五種模式。

### 1. 長時間執行前先對齊意圖

Gemini 4 Argon 能長時間獨立處理一項任務。這表示，一開始就清楚對齊可衡量的目標與關鍵里程碑，能幫助你最有效率地得到成果。一旦指向明確的目標，模型在長時間執行中就能很好地自行保持上下文。為了讓長時間的自主執行從第一步就瞄準正確的目標：**分享你的目標，並請 Argon 主動提出釐清問題**，針對邊界情況與成功標準先問清楚。**在界定範圍時與 Argon 一起發想**：利用規劃階段壓力測試架構、探索創意解法。在我們的工作流程中，它曾在整個技術棧提出新穎的升級建議，從設計出人意料的遊戲機制與程序化視覺效果，到推薦更乾淨的資料模型與更直覺的 API 設計。**做一次快速的行前檢查**：開始前，請 Argon 確認它能存取所需的工具與文件，並且理解你的意圖。**退一步，讓 Argon 一路執行到完成**：不要一回合一回合地下提示，讓 Argon 自主執行完整計畫，撰寫程式碼、執行檢查、跨檔案反覆迭代，直到達成你們議定的目標；在採取不可逆的步驟前，它會先停下來徵求你的確認。

### 2. 給模型驗證自己成果的方法

當 Argon 能以真實的回饋循環檢驗自己的修改時，它在長程工作上的表現最好。不要讓 Argon 猜測修正是否有效，給它一個具體的查核信號：指向你的測試套件、餵入執行階段日誌、讓它擷取瀏覽器截圖檢查 UI，或請它撰寫驗證腳本並反覆迭代，直到每項檢查都通過。更好的做法是，讓 Argon 撰寫一份可重現的驗證腳本、記錄基準分數，並在循環中以該腳本測試每一項修改，直到達成目標。有了具體的通過／失敗目標，Argon 就能記錄基準、在循環中檢驗假設，並反覆迭代直到檢查全數通過。如果你手邊沒有可衡量的東西，請 Argon 協助分析你的專案，**建立一個基準標竿**。

### 3. 使用多模態參考素材

Gemini 模型向來以多模態能力見長，Gemini 4 Argon 也不例外。它能接收圖片、音訊、影片、程式碼與文字作為輸入。建構前端或在 3D 建構中重現圖片時，傳入參考圖片；想在 Web 應用程式中重現某種動畫或互動時，傳給它一段影片。如果你對專案有特定的目標風格，把 Argon 指向 1 到 2 個具體的視覺參考，或先請它把你的字型、色彩調色盤與版面規則彙整成一份輕量的 `DESIGN.md` 檔案，讓每個元件都保持視覺上的一致。Gemini 4 Argon 還具備代理式影片理解能力，能讓模型動態地在時間戳之間來回檢視、以高解析度檢查個別影格，並把螢幕上看到的內容與口述旁白或主控台音訊連結起來。不妨快速錄一段螢幕分享，一邊點選你的應用程式、一邊口頭說明粗糙不順之處，把棘手的時序錯誤連同即時主控台日誌一併捕捉下來；或放入一段 20 分鐘的使用者測試錄影，請 Argon 精確指出使用者卡住的地方，並修補底層元件。

### 4. 把 Argon 當作協調者

面對高度技術性的任務，Argon 很擅長協調子代理來平行化工作。你可以讓 Argon 在複雜任務中指揮多個 Argon 子代理，不過 Google 各地的開發者經常喜歡把 Gemini 4 Argon 搭配 Gemini 3.8 Flash 子代理，作為高速實作的主力。Argon 負責繁重的架構推理與程式碼審查，Flash 則快速完成平行執行，讓你在速度、成本與程式碼品質上兼得兩者之長。把 **Gemini 4 Argon**（`thinking_level="medium"` 或 `"high"`）用作**主協調者**，負責拆解問題、設計介面並審查最終成果。把平行且範圍明確的任務委派給 **Gemini 3.8 Flash** 子代理（`model: flash`），例如快速探索程式碼庫、撰寫樣板測試、遷移個別的葉節點模組，或執行高頻率檢查。對於豐富的互動式應用程式，讓 Argon 跨模態協調專用模型：以 **Nano Banana** 生成 UI 圖片、紋理與精靈圖，以 **Gemini 3.8 Flash TTS** 或 **Lyria** 生成語音與音樂。

### 5. 讓 Argon 回顧過去的工作

在一項複雜任務結束時，或在工作階段中途碰上特別棘手的問題時，請 Argon 退一步，檢視目前為止的軌跡。由於 Argon 擅長綜整漫長歷史中的細節，養成回顧的習慣有兩大好處：**避開在程式碼庫怪癖上反覆試錯**：每個儲存庫都有不明顯的陷阱，例如自訂測試旗標、嚴格的 lint 規則或已淘汰的輔助函式，都可能耗掉額外的回合來診斷。讓 Argon 把這些經驗寫入 `AGENTS.md` 或一份可重複使用的技能，未來的每個工作階段第一次就能走上正確的路。**把一次性除錯變成可重複使用的團隊技能**：一旦 Argon 摸索出可靠的多步驟工作流程（例如執行棘手的本機遷移，或驗證一次建置），請它把這些確切步驟包裝成可重複使用的技能，讓你和你的隊友再也不必從頭重新摸索。試著這樣對 Argon 下提示詞：

當 Argon 完成一次橫跨數十個檔案的長時間自主執行時，閱讀原始差異不一定是建立變更全貌心智模型的最快方式。不妨請 Argon 為它的解法生成一份互動式視覺解說，例如即時架構圖、資料流圖，或逐步的管線導覽。這能讓你在合併前快速查核設計是否合理、迅速掌握陌生的數學或渲染邏輯，或以令人滿足的動畫看到 3D 渲染的進度，理解哪些變更影響最大。

## 開始使用

你今天就能在 Google 的各個開發者平台上開始使用 **Gemini 4 Argon** 建構：**Google AI Studio**：在 [Playground](https://aistudio.google.com/) 中測試提示詞，或在 [Google AI Studio Build](https://aistudio.google.com/build) 中打造全端應用程式，開放給 [Google AI Ultra](https://one.google.com/about/google-ai-plans/) 訂閱者，以及使用 Gemini API 付費層級的開發者。**Gemini API**：在 [Interactions API](/docs/) 中使用 `gemini-4-argon`，第一天起即支援各 `google-genai` SDK 與[受管理代理](/docs/antigravity-agent/)。**Google Antigravity**：[Google AI Ultra](https://one.google.com/about/google-ai-plans/) 訂閱者可在 [Google Antigravity](https://antigravity.google/) 中選取 **Gemini 4 Argon**（`gemini-4-argon`）作為使用中的模型，進行複雜規劃、`/goal` 執行與多代理協調。**開發者文件**：閱讀完整的 [Gemini 4 Argon](/docs/latest-model/) 與[長解碼文件](/docs/long-decode/)，以及我們的配套指南[以 Gemini 4 Argon 打造 3D 遊戲與程序化世界](/learn/)。**使用你慣用的開發工具**：你今天也能在 [Vercel](https://ai-sdk.dev/providers/ai-sdk-providers/google)、[LiteLLM](https://docs.litellm.ai/blog/gemini-4-argon)、[OpenRouter](https://openrouter.ai/docs/cookbook/evaluate-and-optimize/model-migrations/gemini-4)、[Pydantic](https://ai.pydantic.dev/)、[OpenCode](https://opencode.ai/docs/providers/#google-vertex-ai)、[LiveKit](https://docs.livekit.io/agents/models/llm/gemini/)、[BrowserBase](https://gemini.browserbase.com/)、[Eigent](https://www.eigent.ai/use-cases/turn-video-tutorials-into-production-rl-environment-engineering-skills-gemini-4)、[Cua](https://cua.ai/) 等熱門工具與框架中開始使用 Gemini 4 Argon 建構。**Gemini API 技能**：在你的程式設計代理中安裝 `gemini-api-dev` [技能](/docs/coding-agents/#gemini-api-dev)，請它把你的程式碼庫遷移到 `gemini-4-argon`。
