# OpenClaw 與 Gemini 入門

五個指令，在 60 秒內安裝 OpenClaw 2.0、連接 Google Gemini，並開始使用內建的 Google 搜尋接地聊天。

![Philipp Schmid](https://www.gstatic.com/aistudio-static/editorial/openclaw/19dd8130.png)

[OpenClaw](https://openclaw.ai/) 是一個開源的個人 AI 助理（[OpenClaw 2.0](https://openclaw.ai/blog/openclaw-2-accidentally)），設計為在你的裝置上本機運行、整合你日常使用的通訊管道，並執行真實世界的任務。將 OpenClaw 與 Google Gemini API 搭配，你就得到代理運算的理想基礎：高 token 輸送量（[每秒 300+ token](https://artificialanalysis.ai/#speed)）、龐大的上下文視窗，以及零設定的 Google 搜尋接地。無論你是透過瀏覽器 Control UI 互動，還是把你的 Claw 連接到 Telegram、Discord、WhatsApp 或 Slack，OpenClaw 都會在你的規則下運作，具備跨工作階段的持久記憶、完整的檔案系統存取權、瀏覽器自動化，以及沙箱化的 shell 執行能力。在 [OpenClaw 文件](https://docs.openclaw.ai/) 中了解更多，並探索 [Gemini API 文件](/docs/)。

### OpenClaw 能做什麼

#### 隨時隨地聊天

#### 原生網路搜尋接地

#### 整合的本機工具

#### 持久記憶

## 1. 安裝 OpenClaw 2.0

使用 npm 全域安裝 OpenClaw。發行詳情請參閱 [OpenClaw v2026.8.1 發行說明](https://docs.openclaw.ai/releases/2026.8.1)。

```
npm install -g openclaw@2026.8.1

# Verify installation
openclaw --version
# Output: OpenClaw 2026.8.1 (ea80657)
```

## 2. 設定 Gemini 驗證

從 [Google AI Studio](https://aistudio.google.com/apikey) 取得免費的 API 金鑰。驗證與速率限制的詳情，可閱讀 [Gemini API 快速入門](/docs/quickstart/)。在你的終端機中匯出你的金鑰，並執行 onboarding 將它存入 OpenClaw 的本機設定檔儲存區：

```
export GEMINI_API_KEY="your-gemini-api-key-here"

openclaw onboard --non-interactive --accept-risk --skip-health \
  --mode local \
  --auth-choice gemini-api-key \
  --gemini-api-key "$GEMINI_API_KEY"
```

## 3. 選取你的 Gemini 模型

OpenClaw 不綁定特定模型，可支援 Google 的整個 Gemini 產品線。你可以依需求，從 [Gemini 模型指南](/docs/models/gemini/) 設定任何模型，例如用 Flash 進行快速的互動回合，或用 Pro 進行深度的多步驟程式設計。將 [**Gemini 3.8 Flash**](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/) 設為你的預設代理模型，然後檢查你的供應商設定：

```
# Set Gemini 3.8 Flash as default agent model
openclaw models set google/gemini-3.8-flash

# Verify model discovery and authentication status
openclaw models list --provider google
```

## 4. 透過 CLI 測試推論

直接在終端機中執行一個獨立的代理回合，驗證驗證與模型推論是否正常運作：

```
openclaw agent --local --agent main --message "Hello! What model are you running?"
```

```
I am currently running on google/gemini-3.8-flash.
What would you like to call me?
```

![在終端機中執行 Gemini 的 OpenClaw CLI 設定](https://www.gstatic.com/aistudio-static/editorial/openclaw/8f566084.webp)

## 5. 啟動 gateway 並開啟 Control UI

將 gateway 設為本機模式並啟動它。接著在 `http://127.0.0.1:18789/` 開啟瀏覽器 Control UI 儀表板，並以你的本機工作階段 token 進行驗證：

```
# Set gateway to local mode and start it
openclaw config set gateway.mode local
openclaw gateway run

# Open the dashboard in your browser
openclaw dashboard
```

![連接到 Gemini 的 OpenClaw Control UI](https://www.gstatic.com/aistudio-static/editorial/openclaw/7b6101fb.png)

## Google 搜尋接地（預設啟用）

只要存在 `GEMINI_API_KEY`，Google 搜尋接地就會預設啟用。你不需要額外的設定或搜尋金鑰。在聊天工作階段中，Gemini 會在需要最新上下文時，自主執行附引用的網路搜尋。詳情請參閱 [OpenClaw 搜尋工具文件](https://docs.openclaw.ai/tools/gemini-search) 與 Google 的[搜尋接地指南](/docs/grounding/?mode=search)。直接從你的終端機測試搜尋接地：

```
openclaw capability web search --query "Latest gemini models"
```

![在 OpenClaw Control UI 中附引用的 Google 搜尋接地](https://www.gstatic.com/aistudio-static/editorial/openclaw/f51dc8d5.webp)

## 使用其他 Gemini 功能

OpenClaw 也連接 Google 的專門多模態模型。你可以為圖片、影片與音訊任務設定專用模型：**[圖片生成](https://docs.openclaw.ai/tools/image-generation)**：以 `openclaw models set-image google/gemini-3.1-flash-image` 設定 Google 的圖片模型（參閱 [Gemini Vision 文件](/docs/vision/)）。**[影片生成](https://docs.openclaw.ai/tools/video-generation)**：以 `google/veo-3.1-fast-generate-preview` 生成 4–8 秒影片。**[音樂生成](https://docs.openclaw.ai/tools/music-generation)**：透過 `google/lyria-3-clip-preview` 以提示詞驅動音樂生成。**[文字轉語音](https://docs.openclaw.ai/providers/google#text-to-speech)**：Gemini 批次文字轉語音，支援風格提示詞（`gemini-3.1-flash-tts-preview`）。**[即時語音](https://docs.openclaw.ai/providers/google#realtime-voice)**：使用 [Gemini Live API](/docs/live/) 的低延遲雙向語音串流（`gemini-3.1-flash-live-preview`）。如需最新的模型變體、上下文長度與配額，請查閱官方 [Gemini 模型指南](/docs/models/gemini/) 與 [OpenClaw Google 文件](https://docs.openclaw.ai/providers/google)。

## 連接聊天管道

使用 CLI 指令將你的 Gemini 助理連接到你的通訊應用程式。各平台的設定步驟請參閱 [OpenClaw 管道文件](https://docs.openclaw.ai/channels)：

```
# Browse all supported channels
openclaw channels list --all

# Interactive setup wizard
openclaw channels add

# Add Telegram bot
openclaw channels add --channel telegram --token "<BOT_TOKEN>"

# Add WhatsApp via QR code terminal login
openclaw channels login --channel whatsapp

# Add Discord bot
openclaw channels add --channel discord --token "<BOT_TOKEN>"

# Verify channel status
openclaw channels status --probe
```
