# Gemini API CLI

Gemini API CLI（`gemini-api`）是一款無狀態、零相依性的命令列用戶端，專為具備 shell 存取權限的 AI 代理、指令碼與 CI 管線打造。您的程式設計代理可以用它生成文字與媒體、分析檔案，並將任務委派給 [Gemini 託管代理](/docs/agents/)。它可與 Antigravity、Claude Code、Cursor 以及任何標準 shell 環境搭配使用。

所有功能都以標準 shell 指令的形式，透過 [Interactions API](/docs/interactions-overview/) 執行。您可以從代理的子行程、您的終端機或 CI 管線執行相同的指令：

```bash
# 1. Install on macOS or Linux
curl -fsSL https://raw.githubusercontent.com/google-gemini/gemini-api-cli/main/scripts/install.sh | bash

# 2. Set your API key
export GEMINI_API_KEY="YOUR_API_KEY"

# 3. Generate media, analyze a file, or launch a background managed agent
gemini-api image "Minimalist isometric icon of a cloud database" --out ./assets/db-icon.jpg
gemini-api analyze -i ./docs/quarterly-report.pdf "Summarize the key findings in three bullets."
gemini-api agent run "Compare WebRTC SFU architectures and cite sources" \
  --agent deep-research-preview-04-2026 \
  --background \
  --stream=false
```


!!! note " "

      `gemini-api` 是開源的 beta 版本，會隨 [Interactions API](/docs/interactions-overview/) 一同演進。次要版本之間可能出現破壞性變更。在自動化代理環境與 CI 管線中，請鎖定特定的[發行版本](https://github.com/google-gemini/gemini-api-cli/releases)。


## 選擇合適的 Gemini 工具 {#choose-tool}

當代理或指令碼需要直接從 shell **呼叫** Gemini、又不想在專案中加入 SDK 程式碼時，請使用 `gemini-api`。當您要將 Gemini **建置**進應用程式時，則請使用 SDK 與[程式設計代理設定](/docs/coding-agents/)：

| 工具 | 功能 | 使用時機 |
| :--- | :--- | :--- |
| **Gemini API CLI**（`gemini-api`） | 從任何 shell 呼叫 Gemini 模型與託管代理。 | 您的程式設計代理、shell 指令碼或 CI 工作需要在零專案相依性的情況下生成媒體、分析檔案，或執行背景研究代理。 |
| **[Google GenAI SDKs](/docs/libraries/)** | 將 Gemini 用戶端程式庫匯入 Python、TypeScript、JavaScript、Go、Java 或 C# 程式碼。 | 您要將 Gemini 功能建置進應用程式、後端服務，或即時的 [Live API](/docs/live-api/) 工作階段。 |
| **[Gemini Docs MCP & skills](/docs/coding-agents/)** | 為程式設計代理提供即時文件搜尋與最新 SDK 規則。 | 您的程式設計代理正在撰寫匯入 Google GenAI SDK 的應用程式程式碼。 |


!!! note " "

      `gemini-api` 是無狀態的 API 用戶端，並非像 `@google/gemini-cli` 那樣的互動式程式設計代理。您可以在任何程式設計代理內執行 `gemini-api`。


## 運作方式 {#how-it-works}

原始 REST 呼叫與互動式 CLI 經常為程式設計代理帶來問題：Base64 媒體會塞滿上下文視窗、互動式提示會卡住子行程，過時的訓練資料則會導致虛構的旗標。

四項設計抉擇讓 `gemini-api` 對代理而言保持可靠：

- **離線結構定義查詢**：傳入 `--usage` 可印出指令樹（以 [KDL](https://kdl.dev) 表示），或傳入 `--schema` 印出 `--body` 請求的 JSON Schema。
- **檔案寫入磁碟、路徑印到 `stdout`**：媒體與轉錄指令將檔案寫入磁碟，只印出輸出路徑，讓二進位資料不進入上下文。
- **預演與結構化輸出**：`--dry-run` 可驗證輸入、遮蔽憑證，並離線預覽 HTTP 請求。傳入 `-o json`、`-o toon` 或 `--jq` 可取得機器可讀的輸出。加上 `--agent-mode` 可在 `stderr` 回傳結構化 JSON 錯誤，並查看[結束碼](/docs/cli/#exit-codes)來處理失敗。除非傳入 `--interactive`，否則指令絕不會跳出提示。
- **預設無狀態**：指令不保存任何隱藏的本機狀態。多步驟工作請明確串連：使用 `--previous-interaction-id`、上傳後的 `files/<id>` URI，或背景互動 ID。

使用 `-o json` 時，媒體指令仍會將檔案寫入磁碟，並將中繼資料印到 `stdout`：

```json
{
  "kind": "image",
  "mime_type": "image/jpeg",
  "path": "/path/to/project/assets/db-icon.jpg",
  "response_id": "v1_...",
  "size_bytes": 2914159,
  "status": "completed"
}
```

## 開始使用 {#get-started}

安裝 CLI、將 `gemini-api` 加入 `PATH`、設定 `GEMINI_API_KEY`，並為您的程式設計代理加入使用規則。

### 1. 安裝二進位檔 {#install}


=== "macOS and Linux"

      ```bash
      curl -fsSL https://raw.githubusercontent.com/google-gemini/gemini-api-cli/main/scripts/install.sh | bash
      ```

      若要安裝特定版本，請將 `GEMINI_VERSION` 設為發行標籤：

      ```bash
      curl -fsSL https://raw.githubusercontent.com/google-gemini/gemini-api-cli/main/scripts/install.sh | GEMINI_VERSION=<release-tag> bash
      ```

=== "Windows"

      ```bash
      iwr -useb https://raw.githubusercontent.com/google-gemini/gemini-api-cli/main/scripts/install.ps1 | iex
      ```

=== "Go"

      ```bash
      go install github.com/google-gemini/gemini-api-cli/cmd/gemini-api@latest
      ```

=== "Prebuilt binaries"

      從 [GitHub Releases](https://github.com/google-gemini/gemini-api-cli/releases) 下載 macOS、Linux 與 Windows 的版本封存檔，並將 `gemini-api` 加入您的 `PATH`。在 Docker 映像與 CI 中，請使用預先建置的封存檔來鎖定確切版本。


### 2. 設定驗證並確認 {#authentication}

在 [Google AI Studio](https://aistudio.google.com/apikey) 建立 API 金鑰（請參閱 [API 金鑰](/docs/api-key/)）。在您的 shell 與代理的子行程環境中設定 `GEMINI_API_KEY`：

```bash
export GEMINI_API_KEY="YOUR_API_KEY"
```

在本機工作站上，您可以將金鑰儲存在作業系統的鑰匙圈中（macOS Keychain、Linux Secret Service 或 Windows Credential Manager）。若要改將金鑰儲存在其他位置，請傳入 `--no-keyring`，金鑰便會存入 `~/.config/gemini-api/config.yaml`：

```bash
# Save to your OS keychain (or run gemini-api configure --interactive)
gemini-api configure --api-key "YOUR_API_KEY"

# Check the active credential source, then preview a request offline
gemini-api whoami
gemini-api generate "Confirm CLI setup in one sentence." --dry-run
```


!!! warning " "

      請將 `GEMINI_API_KEY` 視為機密。在 CI 中，請從您的機密儲存空間注入該金鑰，不要將它提交到存放庫或建置檔案中。


### 3. 為您的代理提供指示 {#agent-instructions}

將以下片段加入專案的 `AGENTS.md`、`CLAUDE.md`、`.cursorrules` 或系統提示詞，讓您的程式設計代理知道如何使用 `gemini-api`：

```markdown
## Gemini API CLI (`gemini-api`)

You have access to `gemini-api` through the shell. Use it to generate text or media (images, speech, music, video), analyze documents and recordings, or run and manage Gemini managed agents.

1. Run `gemini-api --help` or `gemini-api --usage` to choose a command, and `gemini-api <command> --schema` before building a `--body` JSON payload.
2. Preview unfamiliar or complex calls offline with `--dry-run -o json`.
3. For a single JSON result or `--jq` filtering on `generate` or `agent run`, pass `--stream=false -o json`.
4. To chain multi-step workflows, capture the output paths that media and transcription commands print to stdout, and the `id` values returned by `generate` or `agent run`.
```

接著照常向您的程式設計代理下達提示詞：

```none
Build a landing page for our developer tool. Use Gemini to generate a hero
illustration and a 15-second welcome voiceover, and start a background Deep
Research agent to compare competing CLI onboarding flows. Wire the assets and
findings into the page.
```

## 指令 {#commands}

執行 `gemini-api --help` 可列出所有指令，或執行 `gemini-api explore` 以互動方式瀏覽。

| 群組 | 指令 | 功能 |
| :--- | :--- | :--- |
| Create | `image` | 生成或編輯圖片（`-i`），寫入 JPEG 檔案並印出其路徑。 |
| Create | `tts` | 合成 24 kHz 單聲道 WAV 語音（一或兩位講者）並印出輸出路徑。 |
| Create | `music` | 生成音樂曲目或循環片段，寫入音訊檔案並印出其路徑。 |
| Create | `video` | 生成或編輯 MP4 影片並等待完成（`--async` 會立即回傳 ID）。 |
| Create | `generate` | 生成文字並串流至 `stdout`（`--stream=false` 會回傳一個完整結果）。 |
| Understand | `analyze` | 回答關於 PDF、圖片、音訊、影片、CSV 與文字檔案，或公開 YouTube 網址的問題。 |
| Understand | `transcribe` | 寫入附講者標籤與時間戳記的轉錄稿（`md`、`text`、`json` 或 `srt`）並印出輸出路徑。 |
| Manage agents | `agent` | 執行託管代理（`run`、`status`、`cancel`、`delete-interaction`），並管理自訂代理定義（`create`、`list`、`get`、`delete`）。 |
| Manage agents | `environments`、`credentials`、`webhooks`、`triggers` | 設定託管代理的沙箱環境、已儲存憑證、webhook 傳遞與排程執行。 |
| Setup and files | `configure`、`auth`、`whoami` | 設定憑證與預設值，並顯示目前的驗證狀態。 |
| Setup and files | `files` | 在 Files API 中上傳、列出、檢視與刪除檔案。 |
| Setup and files | `models` | 列出可用的模型。 |

## 工作流程 {#workflows}

每個指令都預設使用適合其任務的模型。傳入 `--model`（`-m`）可選擇其他模型。執行 `gemini-api models` 可列出可用選項。

### 圖片生成與編輯 {#image}

建置 Web 或行動 UI 的代理可以使用 [Nano Banana](/docs/image-generation/) 生成預留位置圖片、圖示與主視覺圖片。將生成出的路徑以 `-i` 傳回即可編輯該圖片：

```bash
# Generate a 16:9 image at 2K resolution (512, 1K, 2K, or 4K) and capture its path
HERO_PATH=$(gemini-api image "Friendly robot mascot in a sunlit workshop, space on left for headline" \
  --aspect-ratio 16:9 \
  --image-size 2K \
  --out ./public/images/hero.jpg)

# Edit the generated image
gemini-api image "Add a winter scarf and soft snowfall outside the window" \
  -i "$HERO_PATH" \
  --out ./public/images/hero-winter.jpg
```

多次傳入 `-i` 可合併參考圖片，例如角色圖與風格指南。

### 語音合成 {#tts}

`gemini-api tts` 可合成 24 kHz WAV 音訊，適用於 UI 提示音、無障礙預覽與旁白導覽。預設語音為 `Kore`；使用 `--voice` 可選擇其他語音。若是雙人對話，請在提示詞中為每一輪標記講者，並將講者對應到語音：

```bash
gemini-api tts "Build succeeded. All integration tests passed." \
  --voice Aoede \
  --out ./public/audio/build-ok.wav

gemini-api tts "Alice: Welcome to the release walkthrough! Bob: Let's look at what shipped today." \
  --multi-speaker "Alice=Kore,Bob=Puck" \
  --out ./public/audio/release-intro.wav
```

### 音樂與影片 {#music-video}

使用 [Lyria](/docs/music-generation/) 創作原創曲目，並使用 [Gemini Omni](/docs/video/) 生成 MP4 影片：

```bash
gemini-api music "Warm ambient synth and acoustic guitar background loop, 95 BPM" \
  --out ./public/audio/bg-loop.mp3

gemini-api video "A drone shot of a mountain landscape at sunrise." \
  --aspect-ratio 16:9 \
  --resolution 1080p \
  --out ./public/video/mountain-sunrise.mp4
```

`video` 指令預設會等待生成完成，並將 MP4 檔案寫入磁碟。傳入 `--async` 可立即回傳互動 ID，之後再執行 `gemini-api video --resume <id> --out <path>`。傳入 `-i` 可讓現有圖片動起來。

### 文字生成 {#generate}

`gemini-api generate` 將文字串流至 `stdout`：

```bash
gemini-api generate "Write a one-paragraph welcome message for new users of a note-taking app."
```

加上 `--stdin` 可將文字以管線傳入提示詞。傳入 `--previous-interaction-id` 可接續先前的互動。

### 文件分析與轉錄 {#analyze}

`analyze` 可回答關於 PDF、試算表、螢幕截圖、音訊與影片檔案，以及公開 YouTube 網址的問題。`transcribe` 會將格式化的轉錄稿（`md`、`text`、`json` 或 `srt`）寫入磁碟：

```bash
gemini-api analyze -i ./docs/product-brief.pdf "List the open questions and who owns each one." > open-questions.md

gemini-api transcribe -i ./fixtures/customer-call.mp4 --format srt --out ./fixtures/customer-call.srt
```

多次將 `-i` 傳入 `analyze` 可比較檔案，例如修改前後的螢幕截圖。

`gemini-api` 以行內方式傳送本機檔案，上限為 14 MB（base64 編碼後為 20 MB）。對於較大的檔案，請先用 `files upload --wait` 上傳一次，再重複使用回傳的 `files/<id>` URI：

```bash
FILE_URI=$(gemini-api files upload ./recordings/all-hands.mp4 --wait)

gemini-api analyze -i "$FILE_URI" "List action items with owners and timestamps."
gemini-api transcribe -i "$FILE_URI" --format json --out ./recordings/all-hands.json
```

### 執行與管理代理 {#managed-agents}

您的程式設計代理可以將多步驟研究或沙箱任務委派給 [Gemini 託管代理](/docs/agents/)，例如 [Deep Research 代理](/docs/deep-research/)。傳入 `--background --stream=false` 可立即取得互動 ID，不必保持串流開啟：

```bash
# Launch a Deep Research job in the background and capture its interaction ID
RESEARCH_ID=$(gemini-api agent run "Compare open-source vector index benchmarks and cite primary papers." \
  --agent deep-research-preview-04-2026 \
  --background \
  --stream=false \
  --jq '.id')

# Check status or fetch the finished result while continuing other work
gemini-api agent status "$RESEARCH_ID" -o json
```

執行 `gemini-api agent cancel <id>` 可停止執行中的工作。您也可以用 `agent run` 在遠端沙箱中啟動 [Antigravity 代理](/docs/antigravity-agent/)，或用 `agent create`、`list`、`get` 與 `delete` 管理[自訂代理](/docs/custom-agents/)。請參閱[環境](/docs/agent-environment/)以設定代理沙箱。

## 自訂請求主體 {#custom-bodies}

對於沒有專用旗標的選項，請使用 `--body` 傳入原始的 [Interactions API](/docs/interactions-overview/) JSON 酬載（行內或以 `@file.json` 形式）。使用 `--body` 可設定 `response_format` 結構定義、函式呼叫工具、`generation_config`，或 `"store": false`。請先執行 `gemini-api <command> --schema` 檢查有效欄位：

```bash
# Inspect the JSON Schema for the request body
gemini-api generate --schema > generate-schema.json

# Return schema-constrained JSON and skip storing the interaction
cat logs.txt | gemini-api generate "Extract every error message from these logs." \
  --stdin \
  --body '{
    "response_format": {
      "type": "text",
      "mime_type": "application/json",
      "schema": {
        "type": "object",
        "properties": {"errors": {"type": "array", "items": {"type": "string"}}},
        "required": ["errors"]
      }
    },
    "store": false
  }'
```

`--body` 會與指令旗標合併。若兩者設定了相同的鍵，指令會以結束碼 `2` 失敗，讓衝突的輸入及早出錯。

## 結束碼 {#exit-codes}

每個指令都會回傳具型別的結束碼，讓指令碼與代理無需解析錯誤文字即可處理失敗。例如，`3` 表示驗證問題，`2` 表示指令語法無效：

| 代碼 | 意義 |
| :--- | :--- |
| `0` | 指令執行成功。 |
| `1` | 執行階段或 API 錯誤，例如網路故障、速率限制，或背景工作失敗。 |
| `2` | 使用方式或驗證錯誤，例如未知旗標、缺少輸入，或 `--body` 鍵重複。 |
| `3` | 驗證或授權失敗，例如 API 金鑰或 token 遺失或無效。 |

執行 `gemini-api --help-global` 可列出每個指令共用的全域旗標（驗證、輸出、網路與診斷）。

## 限制 {#limitations}

- 串流指令（`generate` 與 `agent run`）必須使用 `--stream=false`，與 `-o json` 或 `--jq` 併用時才能回傳單一 JSON 回應物件。
- 行內 `-i` 檔案輸入的原始檔案資料上限為 14 MB（包含 base64 編碼的請求酬載為 20 MB）。大型檔案請使用 `gemini-api files upload` 上傳。Files API 會在 48 小時後刪除上傳的檔案。
- `gemini-api` 支援標準 HTTP 請求、SSE 串流與非同步輪詢，不支援雙向 WebSocket。即時語音與影片串流請使用搭配 [Google GenAI SDKs](/docs/libraries/) 的 [Live API](/docs/live-api/)。

## 後續步驟 {#whats-next}

- [程式設計代理設定](/docs/coding-agents/)
- [Interactions API](/docs/interactions-overview/)
- [Gemini 託管代理](/docs/agents/)
- [GitHub 上的 gemini-api-cli](https://github.com/google-gemini/gemini-api-cli)
