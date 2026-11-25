# 搭配程式設計代理使用 Gemini API 技能

Gemini API 技能是可重複使用的目錄套件，能為程式設計代理提供最新的 SDK 指令、遷移指南與可執行的輔助腳本。

作者：[Patrick Löber](https://aistudio.google.com/)、[Amy Burns](https://x.com/timeyoutakeit)
發布於 2026 年 9 月 22 日
閱讀時間 11 分鐘

語言模型的訓練資料有固定的截止點，因此程式設計代理常會建議已淘汰的套件或舊版 API 方法。安裝 Gemini API 技能，能讓你的程式設計代理掌握現行 `google-genai` Python SDK 與 `@google/genai` TypeScript SDK 的正確規則與程式碼模式。本指南將說明代理技能的運作方式、如何設定官方 Gemini API 技能，以及如何在常見的開發工作流程中使用它們。

## 什麼是技能，它如何運作

技能是一個由 Markdown 檔案、參考文件與腳本組成的資料夾，並以必要的 `SKILL.md` 資訊清單為核心。Gemini API 技能遵循開放的 [Agent Skills 規格](https://agentskills.io/)，可跨編輯器與命令列代理使用，例如 Antigravity、Claude Code、Cursor 與 Codex。

技能目錄結構 `my-skill/ ├── SKILL.md # Required: metadata + instructions ├── scripts/ # Optional: executable code ├── references/ # Optional: documentation └── assets/ # Optional: templates, resources`

在開發環境中使用技能時，程式設計代理會分三個階段處理這個套件：**啟動探索**：代理只讀取每個已安裝 `SKILL.md` 檔案的 YAML frontmatter（`name` 與 `description`），並把簡短說明加入其系統上下文。**按需啟用**：當你的提示詞符合某項技能的說明時，代理會把完整的 `SKILL.md` 檔案載入上下文視窗，讀取其中的 SDK 規則與程式碼範本。**資源執行**：當任務需要詳細參數或媒體處理時，`SKILL.md` 中的指令會引導代理讀取 `references/` 中的本機指南、執行 `scripts/` 中的輔助腳本，或從 `aistudio.google.com/docs` 取得即時文件頁面。技能與系統提示詞、工具的比較：除了系統提示詞（例如 `AGENTS.md`）與函式呼叫工具之外，技能也是為代理提供額外上下文的選項之一。每種選項都有其特定用途，對上下文視窗的影響也不同。舉例來說，`AGENTS.md` 檔案會包含在每一輪對話中，因此把龐大的 SDK 參考資料放進 `AGENTS.md`，即使你編輯的是不相關的前端或資料庫程式碼，每一輪都會消耗上下文 token。

**上下文選項****系統提示詞（例如 `AGENTS.md`）**：包含在每一輪對話中。最適合全域的儲存庫規則、程式碼風格慣例與專案架構概觀。**技能（`SKILL.md` 套件）**：在與提示詞相關時按需載入。最適合特定領域的 SDK 模式、API 遷移指南、多步驟工作流程與本機輔助腳本。**工具（函式呼叫）**：在執行期間按需載入。最適合取得即時的外部資料、查詢資料庫，或觸發外部副作用。

將 Gemini API 指令包裝成模組化技能，可讓全域系統提示詞保持精簡，只在你處理 Gemini 功能時才載入 SDK 指引。

## Gemini API 技能儲存庫的結構

開源的 [`google-gemini/gemini-skills`](https://github.com/google-gemini/gemini-skills) 儲存庫包含三個技能套件，分別針對不同的 Gemini API 工作負載量身打造。

儲存庫結構 `gemini-skills/ └── skills/ ├── gemini-api-dev/ │ ├── SKILL.md │ └── references/ │ └── migration.md ├── gemini-live-api-dev/ │ └── SKILL.md └── gemini-omni-flash-api/ ├── SKILL.md └── scripts/ ├── upload_file.py └── video/ ├── generate_video.py ├── inspect_video.py └── prep_video.py`

`gemini-api-dev`（也以 `gemini-interactions-api` 之名發布）`SKILL.md`：定義 Interactions API（`client.interactions.create`）、多模態輸入、結構化輸出、函式呼叫、上下文快取與伺服器端對話狀態的核心模式。它強制使用現行的 `google-genai` 與 `@google/genai` SDK，同時封鎖已淘汰的套件與舊版模型識別碼。`references/migration.md`：包含逐步重構檢查清單與程式碼差異，協助將舊版程式碼庫從 `google-generativeai` 與 `generate_content` 升級至現行的 Interactions API。`gemini-live-api-dev` `SKILL.md`：涵蓋透過 WebSocket 使用 Gemini Live API（`client.aio.live.connect`）進行的低延遲、雙向音訊、影片與文字串流。包含原始 PCM 音訊串流（輸入 16kHz、輸出 24kHz）、語音活動偵測（VAD）中斷處理、短期用戶端 token，以及 WebRTC 合作夥伴整合（LiveKit、Pipecat 與 Firebase AI Logic）的精確規格。`gemini-omni-flash-api` `SKILL.md`：涵蓋使用 Gemini 影片模型與 Interactions API 的生成式影片工作流程，包括文字轉影片、首幀轉場、幀間插值與影片延伸。`scripts/`：提供可執行的 Python 工具程式（`upload_file.py`、`generate_video.py`、`prep_video.py` 與 `inspect_video.py`），你的程式設計代理可以呼叫它們，用 `ffmpeg` 預先處理媒體、透過 Files API 上傳大型檔案，以及下載生成的影片檔案。

## 如何安裝 Gemini API 技能

你可以將 Gemini API 技能全域安裝到整台機器、在單一專案儲存庫中加入，或直接在 Google AI Studio Build 中使用。預先安裝於 Google AI Studio Build：如果你在 [Google AI Studio Build](https://ai.studio/build) 中進行原型開發與建置應用程式，Gemini API 技能已預先安裝。內建的程式設計代理會在生成或更新應用程式程式碼時自動使用這些技能，無需手動安裝。使用 skills CLI 安裝：在專案目錄中開啟終端機。執行 `npx skills` 指令，全域安裝基礎的 `gemini-api-dev` 技能，讓每個專案都能使用：

```
npx skills add google-gemini/gemini-skills --skill gemini-api-dev --global
```

若要安裝 Live API 技能或影片生成技能，將指令中的技能名稱替換即可。

```
# Install the Live API skill
npx skills add google-gemini/gemini-skills --skill gemini-live-api-dev --global
# Install the video generation skill
npx skills add google-gemini/gemini-skills --skill gemini-omni-flash-api --global
```

若想在選擇安裝哪些技能之前，以互動方式瀏覽所有可用技能，請執行清單指令。

```
npx skills add google-gemini/gemini-skills --list
```

若要為團隊把某項技能固定在特定儲存庫中，請在專案根目錄執行安裝指令，不要加上 `--global` 旗標。使用 Context7 安裝：如果你的工作區使用 Context7 工具鏈，請使用 `ctx7` CLI 安裝技能。

```
npx ctx7 skills install /google-gemini/gemini-skills gemini-api-dev
```

在 Antigravity 與其他程式設計代理中安裝：Antigravity 已將 Gemini API 技能作為內建的 Google 外掛。啟用方式：在 Antigravity 中開啟設定選單，選取 *Customizations*。選取 *Build with Google Plugins*，下載 **Gemini API** 技能。或者，在終端機執行以下指令，直接安裝外掛套件：

```
agy plugin install https://github.com/google-gemini/gemini-skills
```

至於 Claude Code、Cursor 與 Codex 等其他程式設計代理，請使用上方的通用 `npx skills` 指令安裝技能。

## 測試你的代理

若要測試代理在生成程式碼時是否套用了技能規則，請要求它使用 Interactions API 建立入門程式碼。

當 `gemini-api-dev` 處於啟用狀態時，你的程式設計代理會匯入統一的 `google-genai` 或 `@google/genai` SDK 並初始化用戶端。接著，代理會以技能選定的現行模型識別碼呼叫 `client.interactions.create()`，生成類似以下的 Python 或 TypeScript 範例程式碼。

```
from google import genai
# Initialize the client using the GEMINI_API_KEY environment variable
client = genai.Client()
# Create an interaction
interaction = client.interactions.create(
    model="gemini-3.8-flash",
    input="Explain how modular skills improve coding agent accuracy."
)
print(interaction.output_text)
```

如果你的程式設計代理反而從 `google.generativeai` 匯入，或呼叫 `model.generate_content()`，技能可能尚未在你的工作區中啟用。請重新啟動 IDE 或終端機工作階段，讓代理為技能建立索引，或參閱 [Gemini API 文件中的疑難排解章節](/docs/coding-agents/#troubleshooting)。

## 運用 Gemini API 技能的開發工作流程

安裝技能後，只要你的提示詞涉及 Gemini API，程式設計代理就應自動啟用相關技能。以下工作流程展示代理在開發過程中如何運用指令、參考檔案與腳本。 1. 使用 Gemini API 建置新功能

代理會啟用 `gemini-api-dev`，使用統一的 `google-genai` SDK、`client.interactions.create()` 與結構化的 Pydantic 結構定義設定來生成程式碼，而非舊版套件。 2. 遷移舊版程式碼庫

代理會讀取 `gemini-api-dev` 中的 `references/migration.md`，把舊版呼叫對應到現代的等價寫法。它會將 `model.generate_content()` 替換為 `client.interactions.create()`、更新回應解析方式以讀取 `interaction.output_text`，並將多輪聊天記錄改用 `previous_interaction_id`。 3. 升級至較新的模型世代

代理不會對模型字串盲目地尋找並取代，而是遵循 `references/migration.md` 中的模型升級檢查清單。第一，代理會掃描你的儲存庫，請你確認要更新哪些目錄或檔案。第二，它會將舊的模型識別碼更新為 `gemini-3.8-flash`，並調整會造成破壞性變更的設定參數，例如移除已淘汰的取樣設定（`temperature`、`top_p`、`top_k`），以及以 `thinking_level` 取代 `thinking_budget`。 4. 建置語音代理

代理會啟用 `gemini-live-api-dev`，使用 `client.aio.live.connect()` 建立非同步 WebSocket 工作階段。技能會確保代理正確設定 `LiveConnectConfig`，並使用 `session.send_realtime_input()` 串流 16kHz PCM 音訊幀。 5. 從代理執行影片生成腳本

你的代理會使用 `gemini-omni-flash-api` 技能找到並執行 `scripts/video/generate_video.py`。這個輔助腳本會透過 Files API 上傳參考幀、以第一幀與最後一幀旗標呼叫 Interactions API，並將產生的 MP4 檔案下載到你的工作區。

## 搭配受管理代理使用技能

除了在 IDE 或終端機中執行的本機程式設計代理，你也可以把 Gemini API 技能傳遞給透過 Interactions API 執行的[受管理代理](/docs/custom-agents/#customize-inline)。受管理代理在遠端沙箱環境（`environment={"type": "remote"}`）中執行，會自動探索放在 `.agents/skills/` 目錄中的 `SKILL.md` 資訊清單。由於 `google-gemini/gemini-skills` 儲存庫將其套件存放在根目錄的 `skills/` 資料夾中，你可以使用 `environment.sources` 把 GitHub 儲存庫直接掛載到 `.agents`。掛載儲存庫後，遠端代理即可存取全部三個 Gemini API 技能，包括它們的 `references/` 指南與 `scripts/` 工具程式：

```
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    agent="antigravity-preview-09-2026",
    input="Create a Python script that extracts structured invoice data using the Gemini API.",
    environment={
        "type": "remote",
        "sources": [
            {
                "type": "repository",
                "source": "https://github.com/google-gemini/gemini-skills",
                "target": ".agents",
            },
        ],
    },
)
print(interaction.output_text)
```

你也可以使用 `"type": "inline"` 以行內方式傳遞個別的 `SKILL.md` 檔案，或以 `client.agents.create()` 註冊可重複使用的代理設定，這樣就不必在每個要求中傳遞 `environment`。詳情請參閱[自訂代理文件](/docs/custom-agents/#customize-inline)。

## 後續步驟

Gemini API 技能能按需為你的程式設計代理提供正確的 SDK 規則、遷移檢查清單與輔助腳本，不會讓系統提示詞變得臃腫。技能只在任務需要時才載入指令，讓你的上下文視窗保持精簡，同時確保生成的程式碼使用統一的 `google-genai` 與 `@google/genai` SDK。開始使用的方法：在終端機全域安裝 `gemini-api-dev`，或把儲存庫外掛加入你的編輯器。你也可以在儲存庫中撰寫自訂的 `SKILL.md` 檔案，把官方 Gemini API 模式與團隊內部的架構及錯誤處理慣例結合。如果你遇到問題，或想貢獻新的工作流程，請在 GitHub 上開啟 pull request 或 issue。[Gemini API 技能 GitHub 儲存庫](https://github.com/google-gemini/gemini-skills)[Agent Skills 開放規格](https://agentskills.io/)[Gemini API 文件](/docs/)[Interactions API 開發人員指南](/docs/interactions-overview/)[自訂代理開發人員指南](/docs/custom-agents/#customize-inline)
