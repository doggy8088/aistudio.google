# Gemini 4 Carbon：開發者指南

Gemini 4 Carbon 是我們最強大的模型，在資訊安全與長程能力方面展現前沿水準，涵蓋複雜的軟體工程、企業知識工作與科學推理。

![Geneviève Huskens](https://www.gstatic.com/aistudio-static/editorial/page-msrgq2u0/genevieve-huskens.webp)

![Jack Wotherspoon](https://www.gstatic.com/aistudio-static/editorial/page-msrgq2u0/jack-wotherspoon.webp)

今天，我們開始向開發者、企業、科學家與消費者[推出 **Gemini 4 Carbon**](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/)。它於[兩週前宣布](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/)，並已透過我們的 [Fairwind Program](https://deepmind.google/fairwind-program/) 提供給資訊安全防禦者；現在，你可以透過 Google AI Studio 中 Gemini API 的付費層級開始建構，Google AI Ultra 訂閱者則可在 AI Studio 與 [Google Antigravity](https://antigravity.google/) 中使用。Gemini 4 Carbon 專為徹底探索、深度推理，以及在持續的代理工作流程中執行延伸的驗證循環而打造。從多步驟軟體工程與全端 Web 應用程式，到開放式問題、科學探索與根本原因弱點修補，Carbon 為從頭到尾的深度複雜任務帶來更多智慧。

### Gemini 4 Carbon 模型總覽

| 模型 | 模型 ID | 預設思考 | 定價（每 100 萬 tokens） |
| --- | --- | --- | --- |
| **Gemini 4 Carbon** | `gemini-4-carbon` | `medium` | **優惠價（至 11 月 30 日）**：輸入 $2 · 輸出 $10 *（快取享 95% 折扣）* **12 月 1 日起**：輸入 $4 · 輸出 $20 · [定價詳情](/docs/pricing/) |

Carbon 透過 Gemini API 支援**統一的 100 萬 token 上下文視窗**，輸入與輸出 token 共用，可調整思考等級（`low`、`medium`、`high`），以及同一套完整的內建 Gemini API 工具。本指南將介紹如何在 Gemini 4 Carbon 與 Gemini 4 Argon 之間做選擇、API 有哪些新功能，以及使用 Carbon 建構的實用技巧。想進一步了解 Gemini 4 Carbon 在軟體工程、金融、法律、資訊安全與科學研究領域的應用，請參閱我們的[公告部落格文章](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/)。

## 在 Gemini 4 Carbon 與 Gemini 4 Argon 之間做選擇

Gemini 4 Carbon 與 Gemini 4 Argon 同屬我們前沿模型家族的一員，採用相同的優惠 token 價格（2026 年 11 月 30 日前，每 100 萬 token 輸入 $2、輸出 $10；12 月 1 日起輸入 $4、輸出 $20，快取的輸入 token 享有 95% 折扣）。兩個模型透過 Gemini API 共用同一個統一的 100 萬 token 上下文視窗、`thinking_level` 控制項與內建工具支援，因此在兩者之間切換或路由只需改一個模型字串。**當你的任務挑戰前沿智慧的極限時，請選用 Gemini 4 Carbon（`gemini-4-carbon`）：**Carbon 是我們最強大的模型，會花費更多思考 token，徹底探索大型程式碼庫、深入推理密集的多模態檔案、找出細微的根本原因，並執行延伸的建構與驗證循環。請為最艱鉅的多步驟軟體工程、架構設計與程式碼稽核、形式數學與科學探索、高精確度的金融或法律綜整，以及弱點研究選用 Carbon。**對於大多數軟體工程與知識工作，請選用 Gemini 4 Argon（`gemini-4-argon`）：**Argon 仍是大多數進階軟體工程與知識工作任務的理想選擇。它以更精簡的 token 用量與更快的回應速度，提供強大的前沿推理能力，適用於互動式程式設計、日常功能開發與快速的生產循環。**在多代理工作流程中搭配使用兩者：**把 `gemini-4-carbon` 指派給最能受益於深度推理的角色，例如前期架構、任務協調與最終驗證（包括 Google Antigravity 的 `/swarm`[預覽版](https://antigravity.google/docs/swarm/)），同時把平行的實作工作委派給 `gemini-4-argon` 或 `gemini-3.8-flash`。想進一步了解何時選用哪個模型，請參閱[比較 Gemini 模型](/docs/latest-model/?e=0#compare-models)。

## Gemini 4 Carbon 為開發者工作流程帶來的新能力

Gemini 4 Carbon 在需要深度推理、徹底探索與嚴格驗證的持續多步驟工作流程中，展現前沿水準的效能。**長程工程、形式驗證與安全任務：**把複雜的目標交給 Carbon，例如在大型程式碼庫中找出根本原因、把安全屬性轉譯為形式數學證明，或追蹤多跳軟體缺陷並產生經驗證的修補程式，讓它以編譯器與測試輸出驗證假設，直到每項檢查都通過。**高精確度的多模態知識工作與科學推理：**把混雜 PDF、長影片、財務帳冊或實驗室實驗資料的密集儲存庫交給 Carbon。Carbon 結合徹底的擷取與嚴格的結構描述遵循，產出有根據的試算表、簡報、報告與多步驟科學推導。**全端 Web 應用程式、3D 環境與物理模擬：**Carbon 在程式碼與渲染後的 UI 兩端執行有紀律的建構與驗證循環，結合前端設計品味與強大的空間推理能力，運用 Three.js、Blender 與 WebGPU 打造功能完備的應用程式、3D 重建與模擬。實作工作流程請參閱我們的配套指南[**以 Gemini 4 Argon 打造 3D 遊戲與程序化世界**](/learn/building-3d-games-and-worlds-with-gemini-4-argon/?e=0)。

## API 的新功能

在深入工作流程技巧之前，先來看看透過 Gemini API 呼叫 `gemini-4-carbon` 時需要知道的重要 API 更新：

### 以 thinking_level 控制推理深度

Gemini 4 Carbon 使用 `thinking_level`（`"low"` | `"medium"` | `"high"`）來控制模型在回應前進行多少推理（思考）：**`"high"`：**最大化推理深度，適用於多檔案根本原因除錯、安全漏洞修補、形式數學與前期架構設計。**`"medium"`（預設）：**當你想在互動式程式設計與代理工具使用情境中，兼顧速度、成本效率與高首次通過準確率時，建議使用這個等級。**`"low"`：**把延遲與成本降到最低，適用於高速分類、路由與定向擷取。

```
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-4-carbon",
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

### 統一的 100 萬輸入輸出 token 上限與長解碼

先前的 Gemini 模型把輸出上限（思考＋回應）設在 64K 個 token。在 Gemini 4 Carbon（與 Argon）中，輸入、思考與輸出在 Gemini API 裡共用一個統一的 100 萬 token 視窗，你可以使用**長解碼**生成超過 64K 個 token 的內容（上限為 100 萬個 token 扣除你的輸入），讓 Carbon 想思考多久都行，同時在單次生成中傳回完整的多檔案差異、測試套件或長篇證明。**預設輸出上限為 `65,536`（`64K`）個 token：**在 Interactions API 上，串流與非串流要求預設都是 `65,536` 個 token，不需修改任何程式碼。**使用 `background=True` 生成最多 100 萬個 token：**若要在 Interactions API 上生成超過 `65,536` 個 token，請設定 `background=True`，並把 `max_output_tokens` 設為高於 `65536`。設定值要夠高，避免思考把答案截斷；也要夠低，以免艱難的提示詞把額度用光時花費失控。

```
import time

from google import genai

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-4-carbon",
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

詳情請參閱 [Gemini 4 Carbon 的新功能](/docs/whats-new-gemini-4-carbon/)，內容包括如何更新寫死的 `64K` 同步輸出上限、背景保留、動態輸出截斷與無狀態接續。

### 從先前模型遷移

如果你已經在使用 `gemini-4-argon`，切換到 `gemini-4-carbon` 只需改一個模型字串，即可沿用相同的 `thinking_level` 控制項、透過 Gemini API 的 100 萬上下文視窗與定價。如果你是從 Gemini 3 或更早的模型遷移，請清理以下參數：**以 `thinking_level` 取代 `thinking_budget`：**`thinking_budget` 已淘汰，使用時會傳回警告。**移除 `temperature`、`top_p` 與 `top_k`：**`gemini-4-carbon` 會忽略自訂取樣值，並傳回淘汰警告。**停用顯式上下文快取：**移除建立或傳入顯式 `cached_content` 的呼叫。隱式快取會自動啟用，快取的輸入 token 享有 **95% 折扣**。**拉長用戶端逾時：**艱難的推理提示詞可能需要數分鐘。請在 Interactions API 上使用 `background=True`，或把 HTTP 用戶端逾時設為至少 15 到 20 分鐘。完整詳情請參閱我們的[遷移檢查清單](/docs/whats-new-gemini-4-carbon/#migration-checklist)，或在你的程式設計代理中安裝 `gemini-api-dev` [技能](https://ai.google.dev/gemini-api/docs/coding-agents#gemini-api-dev)，請它把你的程式碼庫遷移到 `gemini-4-carbon`。

## 在受管理代理中使用 Gemini 4 Carbon

你也可以把 `gemini-4-carbon` 用作 [Gemini API 受管理代理](https://ai.google.dev/gemini-api/docs/antigravity-agent) 的模型。受管理代理提供代管沙箱與 Antigravity 框架，讓 Carbon 的前沿推理能透過單一 API 呼叫搜尋網路、撰寫程式碼、驗證成果並呼叫 MCP 工具。

```
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    agent="antigravity-preview-09-2026",
    agent_config={
        "type": "antigravity",
        "model": "gemini-4-carbon",
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

### Family Historian

運用 Gemini 受管理代理追溯你的家族歷史與根源。代理會搜尋網路與公開紀錄，並在 3D 地球儀上建立你的家族歷史。

![Family Historian - Gemini 受管理代理](https://www.gstatic.com/aistudio-static/editorial/gemini-4-carbon-showcase/27e725f6.webp)

## 使用 Gemini 4 Carbon 建構的 5 個實用技巧

以下是我們的團隊用來充分發揮這個模型、攻克最艱鉅問題的五種模式。

### 1. 長時間執行前先對齊意圖

Gemini 4 Carbon 能長時間獨立處理一項任務。這表示，一開始就清楚對齊可衡量的目標與關鍵里程碑，能幫助你最有效率地得到成果。一旦指向明確的目標，模型在長時間執行中就能很好地自行保持上下文。為了讓長時間的自主執行從第一步就瞄準正確的目標：**分享你的目標，並請 Carbon 主動提出釐清問題**，針對邊界情況與成功標準先問清楚。**在界定範圍時與 Carbon 一起發想**：利用規劃階段壓力測試架構、探索創意解法。在我們的工作流程中，它曾在整個技術棧提出新穎的升級建議，從設計出人意料的遊戲機制與程序化視覺效果，到推薦更乾淨的資料模型與更直覺的 API 設計。**做一次快速的行前檢查**：開始前，請 Carbon 確認它能存取所需的工具與文件，並且理解你的意圖。**退一步，讓 Carbon 一路執行到完成**：不要一回合一回合地下提示，讓 Carbon 自主執行完整計畫，撰寫程式碼、執行檢查、跨檔案反覆迭代，直到達成你們議定的目標；在採取不可逆的步驟前，它會先停下來徵求你的確認。

### 2. 給模型驗證自己成果的方法

當 Carbon 能以真實的回饋循環檢驗自己的修改時，它在長程工作上的表現最好。不要讓 Carbon 猜測修正是否有效，給它一個具體的查核信號：指向你的測試套件、餵入執行階段日誌、讓它擷取瀏覽器截圖檢查渲染後的 UI，或請它撰寫驗證腳本並反覆迭代，直到每項檢查都通過。更好的做法是，讓 Carbon 撰寫一份可重現的驗證腳本、記錄基準分數，並在循環中以該腳本測試每一項修改，直到達成目標。有了具體的通過／失敗目標，Carbon 就能記錄基準、在延伸的驗證循環中檢驗假設，並反覆迭代直到檢查全數通過。如果你手邊沒有可衡量的東西，請 Carbon 協助分析你的專案，**建立一個基準標竿**。

### 3. 使用多模態參考素材與我們的前端設計技能

Gemini 模型向來以多模態推理能力見長，而 Gemini 4 Carbon 進一步擴充了你能直接傳入的內容：圖片、音訊、影片、PDF、程式碼與文字。在建構前端與 3D 重建時傳入參考圖片或架構 PDF，在綜整時放入投影片與試算表，或在重現一段動畫或互動時傳入影片。如果你對專案有特定的目標風格，把 Carbon 指向 1 到 2 個具體的視覺參考，或先請它把你的字型、色彩調色盤與版面規則彙整成一份輕量的 `DESIGN.md` 檔案，讓每個元件都保持視覺上的一致。隨著 Gemini 4 Carbon 的推出，我們也發布了 `gemini-frontend-design` 技能，幫助你從 Gemini 4 模型獲得最佳的前端與 UI 設計成果。使用這項技能打造的 UI，可靠地勝過未使用技能或使用熱門第三方前端設計技能所生成的結果。請直接以 `npx skills add google-gemini/demolab --skill gemini-frontend-design` 安裝，或在 [`google-gemini/demolab` GitHub 儲存庫](https://github.com/google-gemini/demolab/)中瀏覽原始碼。最後，Carbon 很擅長提示其他 Gemini 模型生成圖片、影片、語音或音樂等資產。為了讓這件事更容易，我們建議一併安裝 [Gemini API CLI](/docs/cli/) 及其代理技能（`npx skills add google-gemini/gemini-skills --skill gemini-api-cli`）。如此一來，Carbon 就能直接從終端機把媒體檔案生成並儲存到你的專案資料夾中，不必撰寫一次性腳本，也不會膨脹它的上下文視窗，並能把新的視覺與音訊直接接進你的建構流程。

### 4. 把 Carbon 當作協調者，用於多代理團隊

對於大型的多檔案專案，Carbon 擅長協調多代理團隊，包括 Google Antigravity 的[全新](https://antigravity.google/docs/swarm)`/swarm`[預覽版](https://antigravity.google/docs/swarm)，它能把單一提示詞轉化為一支在隔離工作區中協同工作的代理團隊，你可以即時追蹤進度。把 Gemini 4 Carbon 指派給要求最深度推理的角色，例如架構設計、協調、安全稽核與驗證，同時搭配 Gemini 3.8 Flash（或 Gemini 4 Argon）子代理進行快速的平行實作。**把 Gemini 4 Carbon**（`thinking_level="medium"` 或 `"high"`）**釘選為主協調者與驗證者**，負責拆解架構、定義介面並稽核已完成的修改。**委派平行的實作工作**，例如遷移葉節點模組、撰寫單元測試或執行高頻率檢查，交給 **Gemini 3.8 Flash** 子代理（`model: flash`）高速執行。**跨模態協調專用模型：**讓 Carbon 協調 **Nano Banana 2.1** 生成產品圖片、紋理與 3D 參考圖，**Gemini Omni 1.2 Flash** 生成影片參考，以及 **Gemini 3.8 Flash TTS** 或 **Lyria** 生成語音與音樂。

### 5. 讓 Carbon 回顧過去的工作

在一項複雜任務結束時，或在工作階段中途碰上特別棘手的問題時，請 Carbon 退一步，檢視目前為止的軌跡。由於 Carbon 擅長綜整漫長歷史中的細節，養成回顧的習慣有兩大好處：**避開在程式碼庫怪癖上反覆試錯：**每個儲存庫都有不明顯的陷阱，例如自訂測試旗標、嚴格的 lint 規則或已淘汰的輔助函式，都可能耗掉額外的回合來診斷。讓 Carbon 把這些經驗寫入 `AGENTS.md` 或一份可重複使用的技能，未來的每個工作階段第一次就能走上正確的路。**把一次性除錯變成可重複使用的團隊技能：**一旦 Carbon 摸索出可靠的多步驟工作流程（例如執行棘手的本機遷移，或驗證一次建置），請它把這些確切步驟包裝成可重複使用的技能，讓你和你的隊友再也不必從頭重新摸索。試著這樣對 Carbon 下提示詞：

當 Carbon 完成一次橫跨數十個檔案的長時間自主執行時，閱讀原始差異不一定是建立變更全貌心智模型的最快方式。不妨請 Carbon 為它的解法生成一份互動式視覺解說，例如即時架構圖、資料流圖，或逐步的管線導覽。這能讓你在合併前快速查核設計是否合理、迅速掌握陌生的數學或渲染邏輯，或以令人滿足的動畫看到 3D 渲染的進度，理解哪些變更影響最大。

## 開始使用

你今天就能在 Google 的各個開發者平台上開始使用 **Gemini 4 Carbon** 建構：**Google AI Studio**：在 [Playground](https://aistudio.google.com/) 中測試提示詞，或在 [Google AI Studio Build](https://aistudio.google.com/build) 中打造全端應用程式，開放給 [Google AI Ultra](https://one.google.com/about/google-ai-plans/) 訂閱者，以及使用 Gemini API 付費層級的開發者。**Gemini API**：在 [Interactions API](/docs/) 中使用 `gemini-4-carbon`，第一天起即支援各 `google-genai` SDK 與[受管理代理](/docs/antigravity-agent/)。**Google Antigravity**：[Google AI Ultra](https://one.google.com/about/google-ai-plans/) 訂閱者可在 [Google Antigravity](https://antigravity.google/) 桌面應用程式、CLI 與 IDE 擴充功能中選取 **Gemini 4 Carbon**（`gemini-4-carbon`），進行複雜規劃、`/goal` 執行與多代理 `/swarm` 團隊。科學家與研究人員也可以[申請](https://forms.gle/WvmBbPvRbpKG1BPn9)在 Google Antigravity 中免費使用六個月，資訊安全防禦者則可向 [Fairwind Program](https://deepmind.google/fairwind-program/) 申請使用 Carbon 進行資安工作。**開發者文件**：閱讀完整的 [Gemini 4 Carbon](/docs/latest-model/)、[長解碼](/docs/long-decode/)與[Office 與 OpenDocument 處理](/docs/document-processing/#office-documents)文件，以及我們的配套指南[以 Gemini 4 Argon 打造 3D 遊戲與程序化世界](/learn/building-3d-games-and-worlds-with-gemini-4-argon/)。**Gemini API 技能**：在你的程式設計代理中安裝 `gemini-api-dev` [技能](/docs/coding-agents/#gemini-api-dev)，請它把你的程式碼庫遷移到 `gemini-4-carbon`。
