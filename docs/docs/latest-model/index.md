# 最新 Gemini 模型

透過單一整合式 API，使用 Google 最新模型進行推理、程式設計與原生媒體生成。先從 `gemini-4-hydrogen` 開始，適用於快速、可靠的程式設計、代理工作流程與多模態知識工作。若需要深度的前沿推理，可使用 `gemini-4-carbon` 或 `gemini-4-neon`，或從下方挑選專用模型。

[選擇模型](/docs/choosing-a-model/) [查看所有模型](/docs/models/)

## Gemini 模型比較 {#compare-models}

下方每個 Gemini 模型都接受文字、圖片、音訊、影片與 PDF 輸入。四個模型全數支援[使用 Google 搜尋接地](/docs/google-search/)、[程式碼執行](/docs/code-execution/)、[函式呼叫](/docs/function-calling/)、[電腦操作](/docs/computer-use/)與[結構化輸出](/docs/structured-output/)。


  

**Gemini 4 Carbon**

*   *模型 ID* **`gemini-4-carbon`**
  *   *價格（1M）* **$2.00 / $10.00（優惠價至 11 月 30 日）**
  *   *速度* **Deliberate**
  *   *上下文* **1M 統一權杖**
  *   *最大輸出* **預設 64K / 1M [長解碼](/docs/long-decode/)**
  *   *思考* **`low`、`medium`（預設）、`high`**

  

  
  [在 AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-4-carbon) [查看 Gemini 4 Carbon 模型規格](/docs/models/gemini-4-carbon/)


  

**Gemini 4 Neon**

*   *模型 ID* **`gemini-4-neon`**
  *   *價格（1M）* **$3.00 / $15.00**
  *   *速度* **Moderate**
  *   *上下文* **1M 統一權杖**
  *   *最大輸出* **預設 64K / 1M [長解碼](/docs/long-decode/)**
  *   *思考* **`low`、`medium`、`high`（預設）、`xhigh`**

  

  
  [在 AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-4-neon) [查看 Gemini 4 Neon 模型規格](/docs/models/gemini-4-neon/)


  

**Gemini 4 Hydrogen**

*   *模型 ID* **`gemini-4-hydrogen`**
  *   *價格（1M）* **$1.50 / $7.50**
  *   *速度* **Fast**
  *   *上下文* **1M 統一權杖**
  *   *最大輸出* **預設 64K / 1M [長解碼](/docs/long-decode/)**
  *   *思考* **`low`、`medium`、`high`（預設）、`xhigh`**

  

  
  [在 AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-4-hydrogen) [查看 Gemini 4 Hydrogen 模型規格](/docs/models/gemini-4-hydrogen/)


  

**Gemini 3.5 Flash-Lite**

*   *模型 ID* **`gemini-3.5-flash-lite`**
  *   *價格（1M）* **$0.30 / $2.50**
  *   *速度* **Fastest**
  *   *上下文* **1M 輸入權杖**
  *   *最大輸出* **64K 權杖**
  *   *思考* **`minimal`（預設）、`low`、`medium`、`high`**

  

  
  [在 AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-3.5-flash-lite) [查看 Gemini 3.5 Flash-Lite 模型規格](/docs/models/gemini-3.5-flash-lite/)


## 新功能指南 {#whats-new-guides}

閱讀新功能指南，瞭解新功能、API 變更、程式碼範例與遷移步驟。


  

**[Gemini 4 Carbon 新功能](/docs/whats-new-gemini-4-carbon/)**

我們最強大的推理模型，適用於代理程式設計、多模態精準處理，以及科學與安全推理。


  

**[Gemini 4 Neon 新功能](/docs/whats-new-gemini-4-neon/)**

具備前沿等級的智慧，能在複雜的軟體工程、知識工作與科學工作流程中快速完成端對端任務。


  

**[Gemini 4 Hydrogen 新功能](/docs/whats-new-gemini-4-hydrogen/)**

兼具尖端智慧、速度與效率，適用於日常程式設計與代理工作流程，並提供最高達 xhigh 的四種思考等級。


  

**[Gemini 3.6 與 3.5 Flash-Lite 新功能](/docs/whats-new-gemini-3.6/)**

最快、成本最低的 Flash-Lite 模型，適用於高輸送量的子代理與路由，並提供從 Gemini 2.5 逐步遷移的說明。


## 各模態的最新模型 {#latest-by-modality}

開始新專案時，無論是文字、圖片、影片或語音，都請選用目前建議的模型 ID。


  

**文字、程式碼與推理**

多模態理解、軟體工程、結構化擷取，以及會使用工具的代理。

*   *旗艦推理* **[`gemini-4-carbon`](/docs/models/gemini-4-carbon/)、[`gemini-4-neon`](/docs/models/gemini-4-neon/)**
  *   *預設通用模型* **[`gemini-4-hydrogen`](/docs/models/gemini-4-hydrogen/)**
  *   *大量與低成本* **[`gemini-3.5-flash-lite`](/docs/models/gemini-3.5-flash-lite/)**

  

  
  [在 AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-4-hydrogen) [閱讀文字生成指南](/docs/text-generation/)


  

**圖片**

對話式圖片生成、多輪編輯、角色一致性，以及最高 4K 的精準文字渲染。

*   *預設高效率* **[`gemini-nano-banana-2.1`](/docs/models/gemini-nano-banana-2.1/)**
  *   *Studio 4K 與版面配置* **[`gemini-3-pro-image`](/docs/models/gemini-3-pro-image/)**
  *   *超低延遲* **[`gemini-3.1-flash-lite-image`](/docs/models/gemini-3.1-flash-lite-image/)**

  

  
  [在 AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-nano-banana-2.1) [閱讀圖片生成指南](/docs/image-generation/)


  

**影片**

使用 Gemini Omni 生成與編輯最高 4K、含同步音訊的影片，串流即時影片，或分析長影片。

*   *影片生成與編輯* **[`gemini-omni-1.2-flash`](/docs/models/gemini-omni-flash/)**
  *   *影片理解* **[`gemini-4-carbon`](/docs/models/gemini-4-carbon/)、[`gemini-4-neon`](/docs/models/gemini-4-neon/)、[`gemini-4-hydrogen`](/docs/models/gemini-4-hydrogen/)**
  *   *即時影片串流* **[`gemini-3.8-live`](/docs/models/gemini-3.8-live/)**

  

  
  [在 AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-omni-1.2-flash) [閱讀 Gemini Omni Flash 指南](/docs/omni/)


  

**音訊與語音**

次秒級的雙向語音代理、支援 130 種語言的生動文字轉語音，以及附說話者標記的轉錄。

*   *即時語音代理* **[`gemini-3.8-live`](/docs/models/gemini-3.8-live/)**
  *   *Studio 文字轉語音* **[`gemini-3.8-flash-tts`](/docs/models/gemini-3.8-flash-tts/)**
  *   *語音轉文字* **[`gemini-3.5-transcribe`](/docs/models/gemini-3.5-transcribe/)**

  

  
  [在 AI Studio 中試用](https://aistudio.google.com/live) [閱讀 Live API 指南](/docs/live-api/)


## 快速入門 {#quickstart}

使用 Google GenAI SDK 與 [Interactions API](/docs/interactions-overview/) 送出您的第一個請求。只要更換 `model`，即可測試任何等級的模型。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-carbon",
          input="Explain gravity to a skeptical cat in three short sentences.",
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        model: "gemini-4-carbon",
        input: "Explain gravity to a skeptical cat in three short sentences.",
      });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-4-carbon",
          "input": "Explain gravity to a skeptical cat in three short sentences."
        }'
      ```


## 設定您的程式設計代理 {#coding-agents}

讓您的程式設計代理即時存取最新 Gemini 模型、SDK 語法與文件，確保它隨時以最新資訊進行開發。

```bash
# Connect the live Gemini Docs MCP server
npx add-mcp "https://gemini-api-docs-mcp.dev"

# Install official Gemini API agent skills
npx skills add google-gemini/gemini-skills --skill gemini-api-dev --global

# Or install the bundled Antigravity plugin
agy plugin install https://github.com/google-gemini/gemini-skills
```

您也可以在任何文件網址後加上 `.md`，或將 [`llms.txt`](https://aistudio.google.com/llms.txt) 提供給您的代理。編輯器設定與 `AGENTS.md` 範本請參閱[程式設計代理設定](/docs/coding-agents/)。

## 專用模型 {#specialized-models}

除了上述通用與媒體模型，Gemini API 還包含專用端點：

* **[Managed Agents](/docs/agents/)**：用於程式設計與工具編排的 [`antigravity-preview-09-2026`](/docs/antigravity-agent/)，以及用於自主多步驟研究的 [`deep-research-preview-04-2026`](/docs/deep-research/)。
* **[Decisions](/docs/decisions-api/)**：[`gemini-decision-1`](/docs/models/gemini-decision-1/)，以零輸出權杖快速做出經過校準的多模態是／否、選項與評分量表決策。
* **[Embeddings](/docs/embeddings/)**：[`gemini-embedding-2`](/docs/models/gemini-embedding-2/)，用於多模態文字、圖片、音訊、影片與 PDF 的搜尋及 RAG。
* **[音樂生成](/docs/music-generation/)**：[`lyria-3.5`](/docs/models/lyria-3.5/)，用於錄音室等級的器樂與人聲曲目。
* **[機器人技術](/docs/robotics-overview/)**：[`gemini-robotics-er-2-preview`](/docs/models/gemini-robotics-er-2-preview/)，用於空間推理與具身規劃。

## 後續步驟 {#whats-next}

* 在[選擇模型](/docs/choosing-a-model/)中，依據工作負載、延遲目標與預算決定適合的模型。
* 在[所有模型](/docs/models/)瀏覽完整的端點目錄。
* 在[思考指南](/docs/thinking/)中調整推理深度與延遲。
* 查看[定價](/docs/pricing/)、[速率限制](/docs/rate-limits/)、[上下文快取](/docs/caching/)與 [Batch API（成本降低 50%）](/docs/batch-api/)。
* 在[淘汰資訊](/docs/deprecations/)查看停用日期，並在[版本資訊](/docs/changelog/)查看近期更新。
