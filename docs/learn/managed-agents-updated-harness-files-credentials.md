# Gemini API 受管理代理更新

更新版代理框架、Files API 與受管理憑證。

![Philipp Schmid](https://www.gstatic.com/aistudio-static/editorial/managed-agents-updated-harness-files-credentials/4316f675.png)

![Mariano Cocirio](https://www.gstatic.com/aistudio-static/editorial/managed-agents-updated-harness-files-credentials/bc324cec.png)

Gemini 受管理代理迎來更新版框架。`antigravity-preview-09-2026` 讓代理的工具與行為更接近 Antigravity Coding Agent，即日起於 [Interactions API](https://ai.google.dev/gemini-api/docs/interactions-overview) 與 [AI Studio](https://aistudio.google.com/) 上線，底層運行 Gemini 3.8 Flash，模型可依每次互動[設定](https://ai.google.dev/gemini-api/docs/antigravity-agent#model-selection)。我們同時推出兩個新 API，讓使用受管理代理開發更簡單、更安全：[Files API](https://ai.google.dev/gemini-api/docs/agent-environment#download-files)，負責把資料送進、取出代理的環境；以及 [Credentials API](https://ai.google.dev/gemini-api/docs/agent-credentials)，讓代理能安全地使用你既有的服務，從 MCP 伺服器到第三方 API 都沒問題。

## Gemini 受管理代理：把 Antigravity 帶進 Gemini API

只要[一次 API 呼叫](https://ai.google.dev/gemini-api/docs/managed-agents-quickstart)，你就能取得一個 Gemini 代理，它能在 Gemini API 託管的隔離 [Linux 沙箱](https://ai.google.dev/gemini-api/docs/agent-environment)中推理、執行程式碼、管理檔案並瀏覽網路。你送出提示詞後，代理會規劃、行動、觀察結果，並不斷重複，直到任務完成。

![受管理代理的運作方式：輸入提示詞，在沙箱中規劃、行動、觀察、重複](https://www.gstatic.com/aistudio-static/editorial/managed-agents-updated-harness-files-credentials/907a011c.png)

### 代理開箱即用的能力

#### 程式碼執行

#### 檔案系統工具

#### 網路存取

#### 上下文壓縮

#### 自訂函式工具

#### 遠端 MCP 伺服器

```
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const interaction = await ai.interactions.create({
  agent: "antigravity-preview-09-2026",
  environment: "remote",
  input: `Clone https://github.com/pallets/click, find every place that still uses the
deprecated \`autocompletion\` parameter, migrate it to \`shell_complete\`, run the test
suite, and write a short CHANGELOG entry describing what you changed.`,
});

console.log(interaction.output_text);
```

你可以透過 `agent_config` 設定框架；[`model`](https://ai.google.dev/gemini-api/docs/antigravity-agent#model-selection) 可變更底層的 Gemini 模型，[`max_total_tokens`](https://ai.google.dev/gemini-api/docs/antigravity-agent#budget-controls) 則限制單次執行可消耗的上限。`tools` 可自訂代理能做的事。你可以在每次互動時內嵌傳入這些設定，或用 `agents.create()` 儲存一次成為[受管理代理](https://ai.google.dev/gemini-api/docs/custom-agents#save-agent)，之後以 id 呼叫。以下是一個低成本的研究代理，只能搜尋與閱讀網路。

```
const agent = await ai.agents.create({
  id: "paper-scout",
  base_agent: "antigravity-preview-09-2026",
  agent_config: {
    type: "antigravity",
    model: "gemini-3.5-flash-lite",
    max_total_tokens: "500000",
  },
  tools: [{ type: "google_search" }, { type: "url_context" }],
  system_instruction: `You find and summarize academic papers. Always return title,
venue, one-sentence claim, and a link. Current date: 2026/09/17.`,
});

const research = await ai.interactions.create({
  agent: agent.id,
  environment: "remote",
  input: "Find the 5 most-cited papers on speculative decoding from the last 12 months.",
});

console.log(research.output_text);
```

## Credentials API：模型永遠看不到的機密

### 長對話的快取效果更好

### 更便宜、更精確的編輯

### 新工具

## Files API：資料送進去、成果拿出來

代理會建立檔案、處理檔案：你交給它的 CSV、它撰寫的報告、它複製的存放庫。[Files API](https://ai.google.dev/gemini-api/docs/agent-environment#download-files) 讓這些檔案進出代理[環境](https://ai.google.dev/gemini-api/docs/agent-environment)變得簡單。你的第一次互動會建立沙箱並回傳其 `environment_id`；之後你就能列出其中的內容、上傳檔案，以及下載個別檔案或目錄。舉個例子：把一份 CSV 交給代理，請它產出自成一體的 HTML 儀表板，再把檔案取出來。

```
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

const ai = new GoogleGenAI({});

// 1. First turn: seed the sandbox with the CSV and ask for a dashboard
const first = await ai.interactions.create({
  agent: "antigravity-preview-09-2026",
  environment: {
    type: "remote",
    sources: [
      {
        type: "inline",
        target: "/workspace/data/q3_sales.csv",
        content: fs.readFileSync("./q3_sales.csv", "utf8"),
      },
    ],
  },
  input: `Read /workspace/data/q3_sales.csv and build a single-file HTML dashboard at
/workspace/output/dashboard.html: revenue by region, top 10 products, and a
month-over-month trend. Inline all CSS and JS. No external requests.`,
});

const envId = first.environment_id!;
console.log(first.output_text);

// 2. See what the agent wrote
const { files } = await ai.environments.files.list({
  environment: envId,
  path: "workspace/output",
});
for (const f of files ?? []) console.log(`${f.path} (${f.size_bytes} bytes)`);

// 3. Download the one file you want
const html = await ai.environments.files.download({
  environment: envId,
  path: "workspace/output/dashboard.html",
});
fs.writeFileSync("./dashboard.html", html);
```

![代理以 q3_sales.csv 建立的單一檔案 HTML 儀表板](https://www.gstatic.com/aistudio-static/editorial/managed-agents-updated-harness-files-credentials/60f423cd.webp)

環境會持續保留，因此下一次互動可以接續在此基礎上進行。用 `files.upload()` 上傳新資料，即可[繼續對話](https://ai.google.dev/gemini-api/docs/managed-agents-quickstart#continue-conversation)。

```
await ai.environments.files.upload({
  environment: envId,
  path: "workspace/data/q4_sales.csv",
  file: fs.readFileSync("./q4_sales.csv"),
  mime_type: "text/csv",
});

const second = await ai.interactions.create({
  agent: "antigravity-preview-09-2026",
  environment: envId,
  previous_interaction_id: first.id,
  input: "Q4 data is in /workspace/data/q4_sales.csv. Add a Q3 vs Q4 comparison section to the dashboard.",
});
```

## Credentials API：模型永遠看不到的機密

當代理能連上你既有的服務——[MCP 伺服器](https://ai.google.dev/gemini-api/docs/antigravity-agent#mcp-servers)、SaaS API、OAuth 背後的內部工具——它才真正派得上用場。這些服務全都需要憑證。[Credentials API](https://ai.google.dev/gemini-api/docs/agent-credentials) 將我們最初的[機密支援](https://ai.google.dev/gemini-api/docs/agent-environment#refresh-credentials)擴充為完整的 API，讓你不必在每次要求中傳遞明文權杖。你只要用 `credentials.create()` 註冊一次憑證；我們會以 `encrypted` 形式儲存，且只會在傳送至你所定義的目的地時才讓它上線傳輸。它支援 3 種憑證類型：[`bearer_token`](https://ai.google.dev/gemini-api/docs/agent-credentials#bearer-token) 適用於 MCP 伺服器與接受 `Authorization` 標頭的 API（標頭名稱與前綴可設定）；[`environment_variable`](https://ai.google.dev/gemini-api/docs/agent-credentials#environment-variable) 適用於代理從沙箱以 `curl`、`requests` 或 SDK 呼叫的任何服務，範圍限定於 `trusted_domains`；[`oauth2`](https://ai.google.dev/gemini-api/docs/agent-credentials#oauth2) 適用於會發放刷新權杖的供應商，我們會在存取權杖到期前刷新它，若供應商送來輪替後的刷新權杖也會一併儲存。憑證有三種放置位置。把它附加到遠端 [`mcp_server`](https://ai.google.dev/gemini-api/docs/antigravity-agent#mcp-servers) 工具，Gemini API 呼叫該伺服器時會加上 `Authorization` 標頭；把它綁定到沙箱中的環境變數，容器會取得一個佔位符，由[出口代理](https://ai.google.dev/gemini-api/docs/agent-environment#network-configuration)在送出時換成真正的值；或是直接為特定網域建立出口標頭的變更規則。

![憑證流程：加密儲存、沙箱中的佔位符、在出口代理換成真正的值](https://www.gstatic.com/aistudio-static/editorial/managed-agents-updated-harness-files-credentials/9b2e3fe5.webp)

```
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

// GitHub: bearer token for a remote MCP server. Injected by the Gemini API.
const github = await ai.credentials.create({
  id: "github-mcp",
  type: "bearer_token",
  token: process.env.GITHUB_PAT!,
});

// Slack: env var credential. The sandbox only ever sees a placeholder.
const slack = await ai.credentials.create({
  id: "slack-bot-token",
  type: "environment_variable",
  value: process.env.SLACK_BOT_TOKEN!,
  trusted_domains: ["slack.com", "*.slack.com"],
  injection_location: ["header"],
});

const interaction = await ai.interactions.create({
  agent: "antigravity-preview-09-2026",
  tools: [
    {
      type: "mcp_server",
      name: "github",
      url: "https://api.githubcopilot.com/mcp",
      credential: github.id,
    },
  ],
  environment: {
    type: "remote",
    // Inside the sandbox: SLACK_BOT_TOKEN=__GEMINI_CRED_slack-bot-token__
    env: { SLACK_BOT_TOKEN: { credential: slack.id } },
    network: {
      allowlist: [{ domain: "slack.com" }, { domain: "*.slack.com" }],
    },
  },
  input: `Use the GitHub MCP server to list open pull requests in my-org/payments-service
with failing checks. Then post a summary table to #release-ops using the Slack Web API
and $SLACK_BOT_TOKEN.`,
});

console.log(interaction.output_text);
```

## 開始建置

今天就切換到 `antigravity-preview-09-2026`，可透過 [Python 或 JavaScript SDK](https://ai.google.dev/gemini-api/docs/libraries) 或 [REST](https://ai.google.dev/gemini-api/docs/interactions-overview) 使用。價格不變，並享有：

#### 更新版框架

#### Files API

#### Credentials API

#### 價格不變

`antigravity-preview-05-2026` 將於 2026 年 10 月 5 日淘汰。此日期之後，送往它的要求會重新導向至更新版框架。我們會在更新日誌中記錄這個日期。
