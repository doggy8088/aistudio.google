# 程式設計代理設定與開發人員資源

AI 程式設計代理仰賴的訓練資料有固定的截止日期。因此，代理經常會建議已淘汰的模型（`gemini-1.5`）、較舊的 SDK（`google-generativeai`），或過時的程式碼模式。

將代理連接到官方的 Gemini 開發人員資源，能協助它使用目前的模型、`google-genai` SDK 以及 [Interactions API](/docs/interactions-overview/)，寫出正確的程式碼。

你可以透過五種方式，將程式設計代理連接到 Gemini 文件、規則與 CLI 工具：

## 代理資源摘要 {#summary}

| 資源 | 提供內容 | 可用性 |
| :--- | :--- | :--- |
| **[Gemini Agent Skills](/docs/coding-agents/#available-skills)** | 針對特定功能的逐步規則、SDK 模式與輔助指令碼（`gemini-api-dev`、`gemini-api-cli`、`gemini-live-api-dev`、`gemini-omni-flash-api`）。 | 已預先安裝於 [AI Studio Build](https://ai.studio/build)；可透過 `skills.sh`、Context7 或 Managed Agents 安裝。 |
| **[Gemini Docs MCP Server](/docs/coding-agents/#mcp-setup)** | 可即時搜尋（`gemini_search_docs`）並完整讀取所有文件頁面（`gemini_get_doc`）。 | 支援 Claude Code、Cursor、OpenAI Codex 與 VS Code。 |
| **[Gemini API Plugin](/docs/coding-agents/#gemini-api-plugin)** | 整合官方 Gemini 技能、Docs MCP 伺服器與 API 金鑰工具的套裝套件。 | Antigravity。 |
| **[Machine-Readable Docs](/docs/coding-agents/#machine-readable-docs)** | 乾淨的 Markdown 頁面、`llms.txt` 索引與內容協商標頭。 | `aistudio.google.com/docs` 上的所有文件頁面。 |
| **[Gemini API CLI](/docs/cli/)** | 無狀態 CLI（`gemini-api`），可在不撰寫 SDK 程式碼的情況下，從殼層產生媒體、分析檔案並執行受管理代理。 | 可安裝於 macOS、Linux 或 Windows，並搭配 `gemini-api-cli` 技能使用（`npx skills add google-gemini/gemini-skills --skill gemini-api-cli`）。 |

## 安裝 Gemini 代理技能 {#available-skills}

代理技能為程式設計代理提供程序規則、目前的模型名稱與 SDK 程式碼模式。代理不需要在提示詞中加入冗長的指令，而是只在需要時才載入各項技能。這能協助代理避開已淘汰的 SDK，並採用現代的 Gemini 模式。

技能可與 Gemini Docs MCP 伺服器搭配運作。如果代理未安裝 MCP 伺服器，技能會改用 [`llms.txt`](https://aistudio.google.com/llms.txt) 作為備援。如需進一步瞭解技能的運作方式，請參閱 [Gemini API Skills guide](/learn/gemini-api-skills/)。


!!! note " "

      技能已預先安裝於 [Google AI Studio Build](https://ai.studio/build)，並隨 Antigravity 的 [Gemini API plugin](/docs/coding-agents/#gemini-api-plugin) 一併提供。


### 使用 CLI 安裝（`skills.sh` 或 Context7） {#install-skills-cli}

使用 [skills.sh](https://skills.sh)（建議）或 [Context7](https://context7.com) 安裝技能：

```bash
# List all available skills in the repository
npx skills add google-gemini/gemini-skills --list

# Install a specific skill globally with skills.sh
npx skills add google-gemini/gemini-skills --skill <skill-name> --global

# Or install with Context7
npx ctx7 skills install /google-gemini/gemini-skills <skill-name>
```

### 可用的技能 {#skills-catalog}

#### `gemini-api-dev` {#gemini-api-dev}

此技能用於透過 [Interactions API](/docs/interactions-overview/) 與官方 Gemini API SDK（Python 版 `google-genai` 與 TypeScript 版 `@google/genai`）建置應用程式。此技能涵蓋：

- 文字產生、多輪對話、串流、結構化輸出與函式呼叫
- 圖片產生、文字轉語音（TTS）與多模態輸入
- 伺服器端對話狀態管理、背景執行、Deep Research 與受管理代理
- 目前的模型名稱，以及遷移舊版 `generateContent` 或 `google-generativeai` 程式碼

```bash
npx skills add google-gemini/gemini-skills --skill gemini-api-dev --global
```

#### `gemini-api-cli` {#gemini-api-cli}

此技能用於在程式設計代理、shell 指令碼與 CI 管線中執行無狀態的 [Gemini API CLI](/docs/cli/)（`gemini-api`），無需在專案中加入 SDK 程式碼。此技能涵蓋：

- 將文字、圖片、語音（TTS）、音樂與影片產生至磁碟上的檔案
- 分析 PDF、圖片、音訊、影片與 YouTube 網址，並撰寫格式化的轉錄稿
- 啟動並輪詢背景 [Gemini 託管代理](/docs/agents/)，例如 Deep Research
- 離線旗標與 JSON 結構描述查詢（`--usage`、`--schema`、`--dry-run`）以及多步驟工作流程串連

```bash
npx skills add google-gemini/gemini-skills --skill gemini-api-cli --global
```

#### `gemini-live-api-dev` {#gemini-live-api-dev}

此技能用於透過 [Gemini Live API](/docs/live-api/) 建置即時音訊與影片串流應用程式。此技能涵蓋：

- WebSocket 工作階段管理、臨時用戶端 token 與工作階段恢復
- 串流音訊、影片與文字，並支援語音活動偵測（VAD）與插話
- 背景推理（延伸思考）、非封鎖式非同步工具呼叫、轉錄與即時語音翻譯

```bash
npx skills add google-gemini/gemini-skills --skill gemini-live-api-dev --global
```

#### `gemini-omni-flash-api` {#gemini-omni-flash-api}

此技能用於透過 Interactions API 使用 Gemini Omni Flash 產生與編輯影片。包含輔助指令碼（`upload_file.py`、`generate_video.py`、`prep_video.py`、`inspect_video.py`），並涵蓋：

- 文字轉影片產生與提示詞撰寫
- 首幀與尾幀轉場，以及以參考素材引導的影片產生
- 影片延伸與媒體預處理工作流程

```bash
npx skills add google-gemini/gemini-skills --skill gemini-omni-flash-api --global
```

### 在 Managed Agents 中掛載技能 {#managed-agents-skills}

透過 Interactions API 執行遠端受管理代理時，你可以將 `google-gemini/gemini-skills` 儲存庫掛載到代理的工作區。詳情請參閱 [Gemini API Skills guide](/learn/gemini-api-skills/)：

```python
from google import genai

client = genai.Client(http_options={"api_version": "v1beta"})

interaction = client.interactions.create(
    agent="antigravity-preview-09-2026",
    input="Build a script that generates a 5-second video of a neon cityscape.",
    environment={
        "type": "remote",
        "sources": [
            {
                "type": "repository",
                "source": "https://github.com/google-gemini/gemini-skills",
                "target": ".agents",
            }
        ],
    },
)
```

## 連接 Gemini Docs MCP 伺服器 {#mcp-setup}

公開的 **Gemini Docs MCP server**（`https://gemini-api-docs-mcp.dev`）讓代理能即時存取整個文件網站。代理可以搜尋並閱讀文件頁面，以確認要求結構、模型上限與新功能：

- `gemini_search_docs`：依主題或查詢搜尋 Gemini API 文件。
- `gemini_get_doc`：讀取特定文件頁面的完整 Markdown 內容。

### 快速設定 {#mcp-quick-setup}

在終端機或專案根目錄執行此指令，即可自動設定偵測到的程式設計代理：

```bash
npx add-mcp "https://gemini-api-docs-mcp.dev"
```

### 依環境設定 {#mcp-by-environment}


=== "Claude Code"

      在終端機中執行：

      ```bash
      $ claude mcp add --transport http geminiDocs https://gemini-api-docs-mcp.dev
      ```

=== "Cursor"

      加入 `~/.cursor/mcp.json`（全域）或 `.cursor/mcp.json`（專案）：

      ```json
      {
        "mcpServers": {
          "geminiDocs": {
            "url": "https://gemini-api-docs-mcp.dev"
          }
        }
      }
      ```

=== "OpenAI Codex"

      在終端機中執行：

      ```bash
      $ codex mcp add geminiDocs --url https://gemini-api-docs-mcp.dev
      ```

      或加入 `~/.codex/config.toml`：

      ```toml
      [mcp_servers.geminiDocs]
      url = "https://gemini-api-docs-mcp.dev"
      ```

=== "VS"

      加入工作區中的 `.vscode/mcp.json`：

      ```json
      {
        "servers": {
          "geminiDocs": {
            "type": "http",
            "url": "https://gemini-api-docs-mcp.dev"
          }
        }
      }
      ```


## Gemini API plugin {#gemini-api-plugin}

如果你使用 **Antigravity**，**Gemini API plugin** 是設定工作區最快速的方式。它將 Gemini Docs MCP 伺服器、所有官方 Gemini 技能（`gemini-api-dev`、`gemini-api-cli`、`gemini-live-api-dev`、`gemini-omni-flash-api`）與 API 金鑰工具整合在單一下載中。

- **在 Antigravity 中安裝（UI）**：前往 **Settings > Customizations > Build with Google Plugins**，並下載 **Gemini API**。
- **使用 CLI 安裝**：
  ```bash
  agy plugin install https://github.com/google-gemini/gemini-skills
  ```


## 機器可讀文件  {#machine-readable-docs}

  標準網頁包含 HTML 標籤、導覽列與指令碼，會占用上下文視窗空間。AI Studio 以乾淨的 Markdown 提供文件，以節省 tokens，並協助代理直接閱讀文件。

### 如何存取 Markdown  {#markdown-access-methods}

  | 方法 | 使用方式 | 使用理由 |
  | :--- | :--- | :--- |
  | **Accept header (content negotiation)** | 在任何 URL 上傳送 `Accept: text/markdown`，URL 形式為 `/docs/...` | 從你在瀏覽器中造訪的同一個 URL 取得原始 Markdown，無需變更路徑。 |
  | **Direct `.md` URLs** | 在任何文件 URL 後加上 `.md`（例如 `/docs/coding-agents.md`） | 提供乾淨的 Markdown 連結，可在提示詞、`AGENTS.md` 檔案或指令碼中分享。 |
  | **`llms.txt` index** | [`https://aistudio.google.com/llms.txt`](https://aistudio.google.com/llms.txt) | 列出每個文件頁面，並附上各原始 Markdown 檔案的連結。 |
  | **`llms-full.txt` file** | [`https://aistudio.google.com/llms-full.txt`](https://aistudio.google.com/llms-full.txt) | 將所有 Gemini API 文件頁面合併為單一檔案，以便載入完整上下文。 |
  | **Discovery headers** | 包含於所有 `/docs` HTTP 回應中 | 設定 `Link` 與 `X-Llms-Txt` 標頭，並在 Markdown 頁面中加入 `AI Agent Context` 區塊，將代理導向文件索引。 |

  若要使用 `Accept` 標頭從任何文件 URL 取得 Markdown：

  ```bash
  curl --header "Accept: text/markdown" https://aistudio.google.com/docs/interactions-overview
  ```

你也可以點選任何文件頁面頂端的 **Copy page**，將 Markdown 原始內容複製到剪貼簿。

## 建議的專案規則（`AGENTS.md`） {#project-rules}

專案規則檔案（`AGENTS.md`、`.cursorrules` 或 `CLAUDE.md`）設定基準規則，並在每個代理工作階段開始時載入。將這些指南加入專案根目錄，讓程式設計代理預設使用目前的模型與 SDK：

```markdown
# Gemini API Guidelines

- Before writing Gemini API code, consult the `geminiDocs` MCP server (`gemini_search_docs` / `gemini_get_doc`) or `https://aistudio.google.com/llms.txt`.
- Always use the current Google Gen AI SDK (`google-genai` for Python, `@google/genai` for TypeScript/JavaScript). Never use legacy SDKs (`google-generativeai` or `@google/generative-ai`).
- Use the Interactions API (`client.interactions.create`) for new applications unless a specific feature requires `generateContent`.
- Use current recommended models (see https://aistudio.google.com/docs/models) and avoid deprecated models.
```

## 驗證與疑難排解 {#verification-troubleshooting}

### 驗證你的設定 {#verify-setup}

若要測試設定，請向程式設計代理提出以下要求：

```none
Look up the request schema for the Gemini Interactions API in the documentation.
```

設定完成的代理會使用 `gemini_search_docs` 查詢 `geminiDocs` MCP 伺服器，並透過 `client.interactions.create` 撰寫程式碼，搭配 `google-genai` 或 `@google/genai` SDK。

### 狀態指令 {#status-commands}

| 環境 | MCP 驗證 | 技能驗證 |
| :--- | :--- | :--- |
| **Claude Code** | 執行 `/mcp` | 執行 `/skills` |
| **Cursor** | 開啟 **Settings > Features > MCP** | 開啟 **Settings > Rules** |
| **OpenAI Codex** | 執行 `codex mcp list` | 檢查 `.codex/skills/` 或 `~/.codex/skills/` |
| **Antigravity** | 開啟 **Customizations > Connections** | 開啟 **Customizations > Rules** 或執行 `/skills list` |
| **VS Code (Copilot)** | 開啟 **Extensions > MCP** 或 Output 面板 | 在 Copilot Chat 中點選 **Select Tools** |

### 疑難排解 {#troubleshooting}

- **未偵測到技能或 MCP 伺服器**：重新啟動編輯器（Cursor 或 VS Code）或終端機工作階段（Claude Code 或 Codex）。大多數代理只在啟動時載入 MCP 伺服器與技能。
- **全域技能衝突**：如果代理忽略全域安裝的技能，請在專案根目錄安裝該技能，不要加上 `--global`：
  ```bash
  npx skills add google-gemini/gemini-skills --skill gemini-api-dev
  ```

  - **規則遭到忽略**：請確認你的 `AGENTS.md`、`.cursorrules` 或 `CLAUDE.md` 檔案位於專案的根目錄。

## 後續步驟  {#whats-next}

- [Gemini API CLI](/docs/cli/)
- [Gemini API Skills guide](/learn/gemini-api-skills/)
- [Gemini API skills on GitHub](https://github.com/google-gemini/gemini-skills)
- [Interactions API](/docs/interactions-overview/)
- [Available models](/docs/models/)
- [Libraries and SDKs](/docs/libraries/)

