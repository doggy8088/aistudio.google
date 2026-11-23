# Gemini API CLI 簡介

為開發人員提供快速的終端機遊樂場，並為程式設計代理提供確定性的執行軌道。

![Dmitry Lyalin](https://www.gstatic.com/aistudio-static/editorial/introducing-the-gemini-api-cli/66517f00.jpg)

![Philipp Schmid](https://www.gstatic.com/aistudio-static/editorial/introducing-the-gemini-api-cli/8475d524.png)

今天，我們正式發布 [Gemini API CLI](https://github.com/google-gemini/gemini-api-cli)（`gemini-api`）的實驗性預覽版，這是一個零相依性的二進位檔，可將 Google 最新的推理模型、媒體生成、多模態分析與 [Managed Agents](/learn/managed-agents-updated-harness-files-credentials/) 帶進你的終端機與程式設計代理。在 macOS 與 Linux（`bash`）上安裝 `gemini-api` CLI，或從原始碼（`go`）安裝：

```
# Install on macOS and Linux
curl -fsSL https://raw.githubusercontent.com/google-gemini/gemini-api-cli/main/scripts/install.sh | bash
```

在 Windows（PowerShell）上，請執行 `iwr -useb https://raw.githubusercontent.com/google-gemini/gemini-api-cli/main/scripts/install.ps1 | iex`，或參閱 [GitHub 上的安裝說明](https://github.com/google-gemini/gemini-api-cli#installation)。

## 擴充 Gemini 開發人員工具組

應用程式與 AI 代理和模型的互動方式各不相同。正式服務需要具型別的用戶端程式庫。終端機中的使用者與自主代理迴圈，則需要無狀態、可自我描述、輸入可預測且輸出乾淨的 CLI。沒有專用的 CLI，代理只能猜測模型 ID、撰寫用完即丟的 SDK 指令碼，並把原始 base64 酬載傾倒進上下文視窗。Gemini 開發人員工具組有 3 層：**[Gemini API](https://ai.google.dev/gemini-api/docs)：** 推理（Gemini 3.8 Flash）、媒體生成（Gemini Nano Banana 2.1、[Gemini Omni 1.1 Flash](https://ai.google.dev/gemini-api/docs/video)、Lyria 3.5、[Gemini 3.8 Flash TTS](/learn/gemini-3-8-flash-tts-developer-guide/)）與 [Managed Agents](/learn/managed-agents-updated-harness-files-credentials/)（[Deep Research](/learn/deep-research-developer-guide/)、Antigravity）的多模態基礎。**[Google Gen AI SDKs](https://ai.google.dev/gemini-api/docs/libraries)：** 適用於正式應用程式與後端服務的 Python、TypeScript、Go 與 Java 用戶端程式庫。**[Gemini API CLI](https://github.com/google-gemini/gemini-api-cli)（`gemini-api`）：** 適用於 macOS、Linux 與 Windows 的無狀態零相依性二進位檔，讓開發人員與具備 Shell 存取能力的代理直接存取 API。

![Gemini 開發人員工具組架構圖：Gemini API 基礎層支撐 Google Gen AI SDK（Python、TypeScript、Go、Java）與 Gemini API CLI](https://www.gstatic.com/aistudio-static/editorial/introducing-the-gemini-api-cli/dc07aba4.webp)

## 依工作流程選擇合適的層級

使用 gemini-api CLI 處理 Shell 管線與程式設計代理，使用 Gen AI SDK 處理應用程式後端，或直接使用 REST 與 Interactions API 規格。

### Gemini API CLI

無狀態、零相依性的 CLI 二進位檔，適用於終端機探索、多模態素材生成與程式設計代理執行軌道。

### Google Gen AI SDKs

具型別的 Python、TypeScript、Go 與 Java 用戶端程式庫，適用於將 Gemini 嵌入正式服務。

### Gemini API 與 Managed Agents

適用於 Gemini 3.8 Flash、Nano Banana 2.1、Omni 1.1 Flash、Lyria 3.5 與 Deep Research 的統一多模態端點。

## 從終端機到代理

使用 `gemini-api` CLI 執行意圖導向的指令，測試提示詞、生成媒體、分析文件或 YouTube 影片，以及轉錄音訊。媒體指令會把檔案直接寫入磁碟，並只把檔案路徑印到 stdout，因此能乾淨地接進 Shell 管線。先互動式探索指令與模型，或直接把圖片與影片片段生成到 `./assets/`：

```
# Explore commands interactively or list available models
gemini-api explore
gemini-api models

# Generate images and video directly to disk (prints only the file path to stdout)
gemini-api image "Isometric icon of a distributed database" --out ./assets/
gemini-api video "A slow camera move through a sunlit workshop" --out ./assets/
```

## 從 Shell 生成圖片與影片

上述 gemini-api image 與 gemini-api video CLI 指令寫入磁碟的實際輸出。

![由 gemini-api CLI 生成的等距分佈式資料庫圖示](https://www.gstatic.com/aistudio-static/editorial/introducing-the-gemini-api-cli/f84fe2f6.jpg)

### 等距分佈式資料庫圖示

![由 gemini-api CLI 生成的陽光工作室影片畫面](https://www.gstatic.com/aistudio-static/editorial/introducing-the-gemini-api-cli/295afcc6.webp)

### 陽光工作室鏡頭移動

使用 Gemini 3.8 Flash TTS 合成多講者對話，並使用 Lyria 3.5 生成器樂背景音樂：

```
# Generate multi-speaker speech and background music to disk
gemini-api tts "Alice: Deployment succeeded! Bob: Let's ship it." \
  --multi-speaker "Alice=Kore,Bob=Puck"
gemini-api music "Lo-fi ambient background track for a focus app" --out ./assets/
```

### 聆聽多講者 TTS、音樂與轉錄音訊範例

使用 `-i` 傳入本機 PDF、圖片或音訊檔，摘要文件或把音訊轉錄為附時間戳記的 SRT 字幕：

```
# Analyze documents and transcribe audio to SRT
gemini-api analyze -i architecture.pdf "Summarize the key bottlenecks"
gemini-api transcribe -i earnings_call.mp3 --format srt --out earnings_call.srt

# Generated earnings_call.srt:
# 1
# 00:00:03,000 --> 00:00:07,000
# Speaker 1: Welcome to the third quarter earnings call.
#
# 2
# 00:00:16,000 --> 00:00:20,000
# Speaker 1: Revenue grew 20% year-over-year.
```

將多步驟研究或程式設計任務委派給背景 [Managed Agents](/learn/managed-agents-updated-harness-files-credentials/)，例如 [Deep Research](/learn/deep-research-developer-guide/)，使用 `--jq` 擷取互動 ID，並輪詢結構化結果：

```
# Start a background Deep Research run and capture its interaction ID
INTERACTION_ID=$(gemini-api agent run "Research battery recycling approaches and cite sources" \
  --agent deep-research-preview-04-2026 \
  --background \
  --stream=false \
  --jq '.id')

# Check progress or retrieve structured JSON output
gemini-api agent status "$INTERACTION_ID" --stream=false --output-format json
```

### 在 Google Antigravity 中使用

[Google Antigravity](https://antigravity.google/) 的原生整合即將推出，你今天已經可以在 Antigravity 內使用 `gemini-api` CLI。Antigravity 會直接呼叫 `gemini-api` CLI，並使用回傳的檔案路徑或互動 ID。試用方式如下：**安裝並驗證：** 安裝 `gemini-api` CLI（或請 Antigravity 幫你安裝），並設定你的 [`GEMINI_API_KEY`](https://aistudio.google.com/apikey)。**提示 Antigravity：** 請 Antigravity 使用 `gemini-api` CLI 生成圖片、影片、音訊或音樂、分析文件，或執行背景代理。在 Antigravity 2.0 中，我們請 Gemini 使用 `gemini-api` CLI 為本次發布生成主視覺影片。它在工作區中執行 `gemini-api video` 來建立片段：

![在 Antigravity 2.0 中，Gemini 直接在工作區中執行 gemini-api CLI 來生成發布影片](https://www.gstatic.com/aistudio-static/editorial/introducing-the-gemini-api-cli/37b6d895.png)

### 在任何程式設計或自主代理中使用

`gemini-api` CLI 可搭配任何具備 Shell 存取能力的程式設計代理使用，包括 Claude Code、Codex、OpenClaw、Hermes、Cursor，或你自己的自訂迴圈。`gemini-api` CLI 中的每個指令都能離線自我描述。代理可以透過 `--help` 或 `--usage`（機器可讀的 KDL）檢視指令與旗標，使用 `--schema` 檢查請求結構描述，透過 `--dry-run` 在無網路存取的情況下驗證呼叫，並使用內嵌的 `--jq` 篩選功能解析乾淨的 `--output-format json` 或精簡的 `toon` 輸出。

在環境、作業系統金鑰鏈或 `~/.config/gemini-api/config.yaml` 中設定 API 金鑰，或執行 `gemini-api configure` 開啟互動式設定介面：

```
# Export in your environment or save to your OS keychain
export GEMINI_API_KEY="your-api-key"
gemini-api configure --api-key "your-api-key"

# Or launch the interactive CLI configuration UI
gemini-api configure
```

接著在提示詞中告訴你的代理使用 `gemini-api` CLI（或將其加入 `AGENTS.md`），當你需要媒體生成、檔案分析或背景 Managed Agents 時：

## 開始使用與早期回饋

這個 v0.4.x 版的 `gemini-api` CLI 是實驗性預覽版，會隨著 [Gemini Interactions API](https://ai.google.dev/gemini-api/docs/interactions) 持續演進。我們正在積極調整 CLI 指令介面，也很想聽聽你的回饋：

## 用 4 個步驟開始使用 gemini-api CLI

### 安裝 gemini-api CLI 二進位檔

### 使用 Gemini API 金鑰進行驗證

### 離線驗證 CLI 設定

### 探索 CLI 指令與結構描述

```
# Verify credentials and validate requests offline
gemini-api whoami
gemini-api generate "Hello from my agent" --dry-run

# Explore commands, models, and schemas
gemini-api --help
gemini-api explore
gemini-api models
gemini-api image --schema
```
