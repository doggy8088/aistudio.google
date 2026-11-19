# 選擇模型

請根據推理深度、回應速度與 token 價格，為您的任務挑選合適的 Gemini 模型。每個通用 Gemini 模型都能接受文字、圖片、音訊、影片與 PDF。

* **預設使用 [`gemini-4-hydrogen`](/docs/models/gemini-4-hydrogen/)：** 速度快且成本效益高，適用於日常程式設計、互動式應用程式、使用工具的代理，以及多模態文件。
* **複雜的高頻率任務請使用 [`gemini-4-neon`](/docs/models/gemini-4-neon/)：** 介於 Hydrogen 與 Carbon 之間，推理比 Hydrogen 更深入，任務完成速度比 Carbon 更快。專為多檔案程式設計、知識工作與科學工作流程而打造。僅適用於付費層級。
* **最困難的問題請使用 [`gemini-4-carbon`](/docs/models/gemini-4-carbon/)：** 投入更多思考 token，驗證系統架構、除錯、科學與安全領域的邊界情況。
* **大量文字生成請使用 [`gemini-3.5-flash-lite`](/docs/models/gemini-3.5-flash-lite/)：** 成本最低的通用模型，適用於擷取、翻譯、摘要，以及次秒級延遲目標。
* **專用任務與模態請查看專用模型**：我們也有專為特定用途打造的模型，例如用於分類、路由與評分的 [`gemini-decision-1`](/docs/decisions-api/)（您的程式碼會根據其決策結果分支），用於圖片的 [Nano Banana](/docs/image-generation/)、用於影片的 [Gemini Omni](/docs/omni/)，以及用於即時語音的 [Gemini 3.8 Live](/docs/live-api/)。

請使用 [Interactions API](/docs/interactions-overview/) 傳送要求，並切換 `model`，在您的提示詞上測試任何層級：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",  # Or "gemini-4-neon", "gemini-4-carbon", "gemini-3.5-flash-lite"
          input="Design a Postgres schema for multi-tenant webhook delivery with exponential retry.",
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        model: "gemini-4-hydrogen", // Or "gemini-4-neon", "gemini-4-carbon", "gemini-3.5-flash-lite"
        input: "Design a Postgres schema for multi-tenant webhook delivery with exponential retry.",
      });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Design a Postgres schema for multi-tenant webhook delivery with exponential retry."
        }'
      ```


## 通用模型與推理模型 {#reasoning-models}

Gemini 4 Carbon、Neon 與 Hydrogen 共用一個 100 萬 tokens 的統一上下文視窗、最高 100 萬 tokens 的[長解碼](/docs/long-decode/)，以及內建工具（[Google 搜尋](/docs/google-search/)、[程式碼執行](/docs/code-execution/)、[函式呼叫](/docs/function-calling/)、[電腦使用](/docs/computer-use/) 與[結構化輸出](/docs/structured-output/)）。三者的差異在於每一輪投入的思考 token 數量、回應速度與成本。

| 模型 | 速度 | 思考層級 | 每 100 萬 tokens 價格（輸入／輸出） |
| :--- | :--- | :--- | :--- |
| [`gemini-4-carbon`](/docs/models/gemini-4-carbon/) | 深思熟慮 | `low`、`medium`（預設）、`high` | $2.00 / $10.00（推廣價至 11 月 30 日） |
| [`gemini-4-neon`](/docs/models/gemini-4-neon/) | 適中 | `low`、`medium`、`high`（預設）、`xhigh` | $3.00 / $15.00 |
| [`gemini-4-hydrogen`](/docs/models/gemini-4-hydrogen/) | 快速 | `low`、`medium`、`high`（預設）、`xhigh` | $1.50 / $7.50 |
| [`gemini-3.5-flash-lite`](/docs/models/gemini-3.5-flash-lite/) | 最快 | `minimal`（預設）、`low`、`medium`、`high` | $0.30 / $2.50 |

表格未提及的幾個細節：

* **推廣定價**：Carbon 的價格為推廣價，有效期至 2026 年 11 月 30 日。自 2026 年 12 月 1 日起，每 100 萬 tokens 的輸入為 $4.00、輸出為 $20.00。Neon 沒有推廣價。
* **免費層級**：Hydrogen 與 Flash-Lite 可在免費層級使用，Carbon 與 Neon 則不行。
* **上下文與輸出**：Flash-Lite 擁有 100 萬 tokens 的輸入視窗與另外的 64K 輸出上限，而非統一的 100 萬視窗。

完整的層級詳情與速率限制請參閱[定價](/docs/pricing/)與[速率限制](/docs/rate-limits/)。

### 何時選擇各模型 {#when-to-choose}

* **Gemini 4 Hydrogen（`gemini-4-hydrogen`）**：大多數新專案請從這裡開始。相較於 [Gemini 3.8 Flash](/docs/whats-new-gemini-3.8/)，Hydrogen 會標示缺少的上下文而非憑空猜測，將虛構的主張減少 5 倍以上，並以平行方式批次執行讀取與搜尋工具呼叫。日常程式設計、互動式 Web 應用程式、多模態文件管線與平行工作者代理都適合選用它。
* **Gemini 4 Neon（`gemini-4-neon`）**：介於 Hydrogen 與 Carbon 之間。相較於 Carbon，它的輸出 tokens 更少、完成速度更快，同時能處理比 Hydrogen 更困難的推理。適用於複雜的軟體工程、密集的知識工作與科學工作流程——也就是 Hydrogen 不足以應付、但又不需要 Carbon 額外驗證的情況。
* **Gemini 4 Carbon（`gemini-4-carbon`）**：我們最強大的推理模型。Carbon 在每一輪投入更多思考 token，用於測試假設、跨儲存庫隔離根本原因，並以測試驗證修正。適用於系統架構、多檔案除錯、密集的多模態分析、形式化證明與安全稽核，或在較快的模型卡住時使用。
* **Gemini 3.5 Flash-Lite（`gemini-3.5-flash-lite`）**：我們速度最快、成本最低的通用模型。當您需要大量生成文字（例如翻譯、摘要與結構化 JSON 擷取），或有次秒級延遲目標時，請選用它。如果您的程式碼只需要一個標籤、是／否答案或分數來決定分支（分類、路由或內容審查），請考慮 [`gemini-decision-1`](/docs/decisions-api/)，它會以零輸出 tokens 傳回經過校準的答案。

## 在多步驟工作流程中搭配使用模型 {#pair-models}

您不必為整個應用程式只挑一個模型。由於 Carbon、Neon 與 Hydrogen 共用相同的要求結構描述、上下文視窗與工具，您可以將每個步驟導向最適合的模型。

常見的模式是將 `gemini-4-carbon` 與 `gemini-4-hydrogen` 搭配使用。在第一輪請 Carbon 設計系統介面或隔離困難的錯誤。接著將 `previous_interaction_id` 傳給 Hydrogen，讓它撰寫程式碼編輯、執行平行的子代理任務，並以更低的延遲與成本反覆測試。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      # Turn 1: Use Carbon to diagnose a concurrency bug and design the fix.
      plan = client.interactions.create(
          model="gemini-4-carbon",
          input=(
              "Identify the race conditions in a Redis-backed distributed lock "
              "that renews TTL on a background thread, and outline a safe fix."
          ),
      )

      # Turn 2: Hand the conversation to Hydrogen to implement code and unit tests.
      implementation = client.interactions.create(
          model="gemini-4-hydrogen",
          previous_interaction_id=plan.id,
          input="Write the Python implementation and pytest suite for your proposed fix.",
      )

      print(implementation.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      // Turn 1: Use Carbon to diagnose a concurrency bug and design the fix.
      const plan = await client.interactions.create({
        model: "gemini-4-carbon",
        input:
          "Identify the race conditions in a Redis-backed distributed lock " +
          "that renews TTL on a background thread, and outline a safe fix.",
      });

      // Turn 2: Hand the conversation to Hydrogen to implement code and unit tests.
      const implementation = await client.interactions.create({
        model: "gemini-4-hydrogen",
        previous_interaction_id: plan.id,
        input: "Write the TypeScript implementation and Vitest suite for your proposed fix.",
      });

      console.log(implementation.output_text);
      ```

=== "REST"

      ```bash
      PLAN_ID=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-4-carbon",
          "input": "Identify the race conditions in a Redis-backed distributed lock that renews TTL on a background thread, and outline a safe fix."
        }' | jq -r '.id')

      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d "{
          \"model\": \"gemini-4-hydrogen\",
          \"previous_interaction_id\": \"$PLAN_ID\",
          \"input\": \"Write the Python implementation and pytest suite for your proposed fix.\"
        }"
      ```


在 [Gemini Managed Agents](/docs/agents/) 中，[Antigravity 代理](/docs/antigravity-agent/) 預設使用 `gemini-4-hydrogen` 執行，並允許您覆寫 `model`（在 [`agent_config`](/docs/antigravity-agent/#model-selection) 中設定），以因應需要 `gemini-4-carbon` 或 `gemini-4-neon` 的任務。如果您在用戶端使用 [`generateContent` API](/docs/text-generation/?generate-content=true) 管理對話歷史記錄，請在跨輪次切換模型時，原封不動地傳回先前的模型輪次與[思考簽章](/docs/thought-signatures/?generate-content=true)。

## 調整速度、成本與推理深度 {#tune-reasoning-and-cost}

在切換至更大或更小的模型之前，請先調整 [`thinking_level`](/docs/thinking/#thinking-levels)。思考層級決定模型在回答前進行多少內部推理，進而控管延遲與 token 花費。

| 思考層級 | 支援的模型 | token 用量 | 適用時機 |
| :--- | :--- | :--- | :--- |
| `minimal` | `gemini-3.5-flash-lite`（預設） | 幾乎零思考、延遲最低 | 大量擷取、翻譯與摘要。不支援於 Gemini 4 模型。 |
| `low` | 所有 Gemini 4 模型、`gemini-3.5-flash-lite` | token 最少、首個 token 最快 | 對成本與延遲敏感的對話、摘要，以及簡單的工具呼叫。 |
| `medium` | `gemini-4-carbon`（預設）、`gemini-4-neon`、`gemini-4-hydrogen`、`gemini-3.5-flash-lite` | 均衡 | Carbon 的預設值。在 Neon 與 Hydrogen 上適合互動式程式設計與即時 UI 原型製作。 |
| `high` | `gemini-4-neon`（預設）、`gemini-4-hydrogen`（預設）、`gemini-4-carbon`、`gemini-3.5-flash-lite` | 更深入的多步驟推理 | Neon 與 Hydrogen 上程式設計、代理與多模態工作的預設值。Carbon 上的最大深度。 |
| `xhigh` | `gemini-4-neon`、`gemini-4-hydrogen` | token 最多、推理最深 | `high` 不足以應付的困難多步驟程式設計與代理問題。 |

請在所有支援的層級下執行評測，並將 `max_output_tokens` 設為至少 65,536，避免上限截斷答案。接著，挑選能通過您品質門檻的最低 `thinking_level`。請將 `xhigh`（適用於 `gemini-4-neon` 與 `gemini-4-hydrogen`）保留給 `high` 不足以應付的困難多步驟問題，因為 `xhigh` 會增加延遲與 token 用量。

### 使用推論選項降低成本與延遲 {#inference-options}

選定模型與思考層級後，請使用下列 API 選項，配合您的正式環境預算與延遲目標：

* **[隱含上下文快取](/docs/caching/)**：在至少 4,096 tokens 的 Gemini 4 提示詞上預設執行，並為快取的輸入 tokens 提供 95% 的折扣。請將共用的系統指令、工具定義與參考文件放在提示詞開頭，以最大化快取命中率。
* **[Flex 推論](/docs/flex-inference/) 與 [Batch API](/docs/batch-api/)**：為離線評測、資料集處理與非緊急的多步驟代理執行降低 50% 的 token 成本。
* **[Priority 推論](/docs/priority-inference/)**：將面向使用者的正式環境流量導向不可捨棄的運算佇列，在尖峰負載下保持穩定的低延遲。

如需服務層級的並排比較，請參閱[最佳化與推論](/docs/optimization/)。

## 專用模型與媒體模型 {#specialized-models}

若要進行評分、媒體生成、即時音訊、嵌入或機器人應用，請使用專為特定用途打造的模型。各指南會說明其模型選項。

| 工作負載 | 從這裡開始 |
| :--- | :--- |
| 分類、路由與評分 | [`gemini-decision-1`](/docs/decisions-api/) |
| 圖片生成與編輯 | [`gemini-nano-banana-2.1`](/docs/image-generation/) |
| 影片生成與編輯 | [`gemini-omni-1.2-flash`](/docs/omni/) |
| 即時語音與影片代理 | [`gemini-3.8-live`](/docs/live-api/) |
| 文字轉語音 | [`gemini-3.8-flash-tts`](/docs/speech-generation/) |
| 語音轉文字 | [`gemini-3.5-transcribe`](/docs/transcribe/) |
| 多模態嵌入 | [`gemini-embedding-2`](/docs/embeddings/) |
| 音樂生成 | [`lyria-3.5`](/docs/music-generation/) |
| 機器人 | [`gemini-robotics-er-2-preview`](/docs/robotics-overview/) |
| 受管理的代理 | [Antigravity](/docs/antigravity-agent/)、[Deep Research](/docs/deep-research/) |

完整清單請參閱[查看所有模型](/docs/models/)。

## 從較早的 Gemini 模型升級 {#upgrade-paths}

從較早的 Gemini 3 或 Gemini 2.5 模型升級時，請使用下列目標。關閉與自動路由日期請參閱[淘汰](/docs/deprecations/)。

| 目前的模型 | 建議升級目標 | 遷移指南 |
| :--- | :--- | :--- |
| `gemini-3.8-flash`、`gemini-3.6-flash`、`gemini-3-flash-preview` | `gemini-4-hydrogen` | [從 Gemini 3.8 Flash 與更早版本遷移](/docs/whats-new-gemini-4-hydrogen/#migrate-from-gemini-3-8-flash) |
| `gemini-3.1-pro-preview` | `gemini-4-neon`（或 `gemini-4-carbon`，適用於最困難的問題） | [Gemini 4 Neon 遷移檢查清單](/docs/whats-new-gemini-4-neon/#migration-checklist) |
| `gemini-3.1-flash-lite` | `gemini-3.5-flash-lite` | [遷移至 Gemini 3.5 Flash-Lite](/docs/whats-new-gemini-3.6/#migrate-to-gemini-3-5-flash-lite) |
| `gemini-2.5-pro` | `gemini-4-hydrogen`（或 `gemini-4-carbon`，適用於最困難的問題） | [從 Gemini 3.8 Flash 與更早版本遷移](/docs/whats-new-gemini-4-hydrogen/#migrate-from-gemini-3-8-flash) |
| `gemini-2.5-flash`、`gemini-2.5-flash-lite` | `gemini-4-hydrogen` 或 `gemini-3.5-flash-lite` | [從 Gemini 3.8 Flash 與更早版本遷移](/docs/whats-new-gemini-4-hydrogen/#migrate-from-gemini-3-8-flash) |

## 後續步驟 {#whats-next}

* 在[最新 Gemini 模型](/docs/latest-model/)上比較模型規格並啟動 AI Studio 遊樂場。
* 在[所有模型](/docs/models/)上瀏覽完整的端點目錄。
* 在[思考指南](/docs/thinking/)中設定 `thinking_level` 與思考摘要。
* 檢閱[最佳化與推論](/docs/optimization/)、[定價](/docs/pricing/)與[速率限制](/docs/rate-limits/)。
