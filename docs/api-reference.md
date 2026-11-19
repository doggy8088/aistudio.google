# Gemini API 參考文件

Gemini API 為 Gemini 模型與受管理代理提供單向 REST、串流與即時
WebSocket 端點。新專案建議從
[Interactions API](/api-reference/interactions-api/) 開始，或依照
[開始使用指南](/docs/get-started/) 送出你的第一個要求。

用戶端程式庫與編輯器工具請參閱
[SDK 參考文件](/api-reference/#sdk-references)、
[Gemini API 程式庫](/docs/libraries/) 或
[程式設計代理設定](/docs/coding-agents/)。

!!! note " "

      最新版 Gemini API SDK 預設使用 API 版本 `v1`。部分功能（例如
      Live API 與語音生成）僅在 `v1beta` 提供，請參閱
      [API 版本](/api-reference/api-versions/)。

## 基礎 URL 與驗證 {#authentication}

  **驗證方式**：將你的 [API 金鑰](/docs/api-key/) 放在 `x-goog-api-key`
    標頭中傳遞（使用 SDK 時則設定 `GEMINI_API_KEY`）。

  **呼叫端點**：將 HTTPS 要求送往
    `https://generativelanguage.googleapis.com/{version}/{endpoint}`，
    版本使用 [`v1beta` 或 `v1`](/api-reference/api-versions/)。

| 設定 | 值 |
| --- | --- |
| Base URL | `https://generativelanguage.googleapis.com` |
| WebSocket | `wss://generativelanguage.googleapis.com/ws/...` |
| 驗證 | `x-goog-api-key: $GEMINI_API_KEY` |
| 版本 | `v1beta`（新功能與代理）、`v1`（穩定版） |

  [Get API key](https://aistudio.google.com/apikey)

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-3.8-flash",
          "input": "Explain how TCP congestion control works in two sentences."
        }'
      ```

=== "Agents"

      ```bash
      # Set up your coding agent with these tools

      # Search live docs with the MCP server
      npx add-mcp "https://gemini-api-docs-mcp.dev"

      # Add skills for current SDK syntax and rules
      npx skills add google-gemini/gemini-skills --skill gemini-api-dev

      # In Antigravity, install both with one plugin
      agy plugin install https://github.com/google-gemini/gemini-skills

      # Fetch any reference page as clean Markdown
      curl -H "Accept: text/markdown" \
        "https://aistudio.google.com/api-reference/interactions-api"
      ```

## API 端點 {#primary-endpoints}

從下方的核心介面開始、依類別瀏覽端點，或在
[All methods](/api-reference/all-methods/) 一頁中檢視每一個 REST 操作。

**[Interactions API](/api-reference/interactions-api/)**

POST /v1beta/interactions

文字、多模態提示詞、思考、工具、有狀態輪次與代理的預設端點。

**[Live and Live Music](/api-reference/live/)**

WSS BidiGenerate*

低延遲 WebSocket 工作階段，適用於即時語音、影片與互動式 Lyria 音樂。

**[Agents and automation](/api-reference/agents/)**

POST /v1beta/agents

設定可重複使用的代理、佈建沙箱、排程 cron 執行，以及註冊 webhook。

**[All REST methods](/api-reference/all-methods/)**

/api-reference/all-methods

單頁索引，列出所有 Gemini API 服務的每一個 REST 操作。

=== "核心與即時"


    | API | 端點 | 說明 |
    | --- | --- | --- |
    | [Interactions API](/api-reference/interactions-api/) | `POST` `/v1beta/interactions` | 文字、多模態提示詞、思考、工具、有狀態輪次、背景工作與 SSE 串流。 |
    | [Live API](/api-reference/live/) | `WSS` `BidiGenerateContent` | 低延遲 WebSocket 工作階段，適用於雙向語音、影片與工具呼叫。 |
    | [Live Music API](/api-reference/live-music/) | `WSS` `BidiGenerateMusic` | 即時 WebSocket 工作階段，用來操控互動式器樂音樂與 Lyria。 |
    | [Models API](/api-reference/models/) | `GET` `/v1beta/models` | 列出模型、檢視 token 上限，或執行媒體預測（[`predict`](https://aistudio.google.com/api-reference/models/predict)、[`predictLongRunning`](https://aistudio.google.com/api-reference/models/predict-long-running)）。 |

=== "代理與自動化"


    | API | 端點 | 說明 |
    | --- | --- | --- |
    | [Agents](/api-reference/agents/) | `POST` `/v1beta/agents` | 建立、擷取、列出與刪除可重複使用的代理設定。 |
    | [Environments](/api-reference/environments/) | `POST` `/v1beta/environments` | 佈建隔離的遠端沙箱，並管理代理執行所需的工作區檔案。 |
    | [Triggers](/api-reference/triggers/) | `POST` `/v1beta/triggers` | 排程週期性的 cron 執行，或依需求呼叫代理觸發器。 |
    | [Webhooks](/api-reference/webhooks/) | `POST` `/v1beta/webhooks` | 註冊背景事件的回呼 URL，並輪替簽署密鑰。 |
    | [Credentials](/api-reference/credentials/) | `POST` `/v1beta/credentials` | 儲存並管理代理與工具使用的外部服務憑證。 |

=== "資料、音訊與規模"


    | API | 端點 | 說明 |
    | --- | --- | --- |
    | [Files API](/api-reference/files/) | `POST` `/v1beta/files` | 上傳並管理提示詞使用的大型音訊、圖片、影片與文件檔案。 |
    | [File Search](/api-reference/file-search/file-search-stores/) | `POST` `/v1beta/fileSearchStores` | 將[文件](/api-reference/file-search/documents/)分塊、建立索引並查詢，用於受管理的檢索接地。 |
    | [Caching](/api-reference/caching/) | `POST` `/v1beta/cachedContents` | 在支援的模型上固定共用的提示詞上下文，降低重複輸入的成本。 |
    | [Voices](/api-reference/voices/) | `POST` `/v1beta/voices` | 建立並管理文字轉語音用的自訂提示或複製聲音。 |
    | [Batch API](/api-reference/batch-api/) | `POST` `/v1beta/batches` | 以較低成本提交非同步的內容生成與嵌入工作。 |
    | [Embeddings](/api-reference/embeddings/) | `POST` `/v1beta/models/{model}:embedContent` | 產生向量嵌入，用於語意搜尋、分類與分群。 |
    | [Tokens](/api-reference/tokens/) | `POST` `/v1beta/models/{model}:countTokens` | 在送出要求前計算輸入 token 數。 |

=== "舊版"

      新專案請使用 [Interactions API](/api-reference/interactions-api/)，或依照
        [遷移指南](/docs/migrate-to-interactions/)。既有的整合仍可使用
        下列端點。


    | API | 端點 | 說明 |
    | --- | --- | --- |
    | [`generateContent`](/api-reference/generate-content/generate-content/) | `POST` `/v1beta/models/{model}:generateContent` | 供既有 `generateContent` 整合使用的單向文字與多模態生成。 |
    | [`streamGenerateContent`](/api-reference/generate-content/stream-generate-content/) | `POST` `/v1beta/models/{model}:streamGenerateContent` | 供既有 `generateContent` 整合使用的伺服器送出事件串流。 |
    | [`createToken`](/api-reference/generate-content/create-token/) | `POST` `/v1alpha/auth_tokens` | 為用戶端 Live API 工作階段佈建短期臨時驗證 token。 |

## SDK 參考文件 {#sdk-references}

官方 Google GenAI SDK 的用戶端、方法與型別文件（自動產生）。

**[Python](https://googleapis.github.io/python-genai/)**

pip install google-genai

google-genai Python SDK 的參考文件，包含同步與非同步用戶端。

**[TypeScript and JavaScript](https://googleapis.github.io/js-genai/)**

npm install @google/genai

@google/genai SDK（Node.js 與 TypeScript）的參考文件。

**[Go](https://pkg.go.dev/google.golang.org/genai)**

go get google.golang.org/genai

google.golang.org/genai 在 pkg.go.dev 上的套件參考文件。

**[Java](https://googleapis.github.io/java-genai/javadoc/)**

com.google.genai:google-genai

com.google.genai Java SDK 的 Javadoc 參考文件。

**[C# (.NET)](https://googleapis.github.io/dotnet-genai/)**

dotnet add package Google.GenAI

Google.GenAI .NET SDK 的參考文件。

**[Installation and migration](/docs/libraries/)**

/docs/libraries

安裝 SDK 套件、設定環境變數，或從舊版程式庫遷移。
