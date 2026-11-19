# Gemini 4 Carbon 的新功能

Gemini 4 Carbon（`gemini-4-carbon`）是我們最強大的推理模型，專為在複雜軟體工程、多模態知識工作、科學推理與網路安全防禦等領域中，進行持續的代理式工作流程而打造。在困難問題上，Carbon 會花費更多思考權杖來探索假設、驗證其工作成果，並在回應前檢查邊界案例。

Gemini 4 Carbon 可在 Gemini API 的付費層級與 Google AI Studio 中使用。與 [Gemini 4 Argon](/docs/whats-new-gemini-4-argon/) 相同，它支援統一的 1M 權杖上下文視窗、最長可達 1M 權杖的長解碼，以及可調整的思考層級（`low`、`medium`、`high`），且每權杖價格相同。


  

**[模型卡](/docs/models/gemini-4-carbon/)**

查看權杖上限、支援的功能與完整規格。


  

**[在 AI Studio 中建置](https://aistudio.google.com/apps?model=gemini-4-carbon)**

使用 Gemini 4 Carbon 建置並驗證全端 Web 與 3D 應用程式。


  

**[開發人員指南](/learn/gemini-4-carbon-developer-guide/)**

閱讀 Gemini 4 Carbon 的實用提示詞與多代理模式。


本指南說明 Gemini 4 Carbon 的新功能、如何在各 Gemini 4 模型之間做選擇、API 變更、程式碼範例，以及遷移指南。

## 新模型 {#new-model}

| 模型 | 模型 ID | 預設思考層級 | 定價 | 說明 |
| :--- | :--- | :---: | :--- | :--- |
| Gemini 4 Carbon | `gemini-4-carbon` | `medium` | 2026 年 11 月 30 日前享有優惠價：輸入權杖每 1M 個 $2、輸出權杖每 1M 個 $10（之後為輸入每 1M 個 $4、輸出每 1M 個 $20）。詳情請參閱[定價](/docs/pricing/)。 | 我們最強大的推理模型，專為持續的代理式程式設計、多模態知識工作、科學探索與網路安全防禦而打造。 |

如需完整詳情，請參閱 [Gemini 4 Carbon 模型頁面](/docs/models/gemini-4-carbon/)與[最新 Gemini 模型](/docs/latest-model/)。如需優惠定價詳情，請參閱本頁的[定價章節](/docs/whats-new-gemini-4-carbon/#pricing)或[定價頁面](/docs/pricing/#gemini-4-carbon)。

## 快速入門 {#quickstart}

使用下列範例，將請求傳送至 `gemini-4-carbon`，並採用建議的預設 `thinking_level`（`medium`）與 64K 輸出權杖上限：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-carbon",
          input="Write a three.js script that renders a realistic 3D black hole with gravitational lensing."
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        model: "gemini-4-carbon",
        input: "Write a three.js script that renders a realistic 3D black hole with gravitational lensing.",
      });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```bash
      curl "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "model": "gemini-4-carbon",
          "input": "Write a three.js script that renders a realistic 3D black hole with gravitational lensing."
        }'
      ```


## Gemini 4 Carbon 的新功能 {#whats-new-gemini-4-carbon}

* **延伸驗證與代理式程式設計：** 在複雜的存放庫、前端 UI 設計與 3D 場景中執行更深入的建置與驗證迴圈，找出根本原因並對照測試檢查修正。
* **多模態知識工作的更高精確度：** 在密集的 PDF、試算表、投影片與工作區資料中，提供更強的來源接地與更少的無根據主張，並嚴格遵守輸出結構描述。
* **科學與網路安全推理：** 在形式證明、實驗資料分析、弱點探索與根本原因修補方面表現更佳。
* **統一的 1M 上下文視窗與長解碼：** 輸入、思考與輸出權杖共用一個 1,048,576 個權杖的視窗，單一回應現在可超過 64K 個權杖，最多可達 1M 個權杖減去您的輸入。請參閱[長解碼](/docs/long-decode/)。
* **支援 Managed Agents：** Gemini Managed Agents 中的 [Antigravity 代理](/docs/antigravity-agent/)現已支援 `gemini-4-carbon`。

## 在 Carbon、Neon、Hydrogen 與其他模型之間做選擇 {#choosing-between-models}

Gemini 4 Carbon、[Gemini 4 Neon](/docs/whats-new-gemini-4-neon/) 與 [Gemini 4 Hydrogen](/docs/whats-new-gemini-4-hydrogen/) 共用相同的 1M 統一上下文視窗、長解碼架構與內建工具：

* **Gemini 4 Carbon（`gemini-4-carbon`）：** 專為挑戰推理深度極限的任務而打造。Carbon 每回合會花費更多思考權杖，進行徹底探索並驗證其工作成果，因此每回合的權杖用量與延遲都會增加。適用於複雜的根本原因除錯、架構設計、密集的多模態整合、科學證明與安全稽核。
* **Gemini 4 Neon（`gemini-4-neon`）：** 具備前沿級智慧，端到端任務完成速度快（每 100 萬權杖 $3.00 / $15.00，僅付費層級），適用於複雜的軟體工程、知識工作與科學工作流程。
* **Gemini 4 Hydrogen（`gemini-4-hydrogen`）：** 速度快且具成本效益（每 100 萬權杖 $1.50 / $7.50，另提供免費層級），適用於日常程式設計、互動式應用程式、多模態文件與平行子代理執行。

如需並排比較與多模型協調範例，請參閱[選擇模型](/docs/choosing-a-model/)與[最新 Gemini 模型](/docs/latest-model/#compare-models)。

## 了解思考層級 {#understanding-thinking-levels}

[思考層級](/docs/thinking/)是您在 Gemini 4 Carbon 中控制品質、延遲與權杖用量的主要方式：

| 思考層級 | 權杖用量 | 適用時機 |
| :--- | :--- | :--- |
| `low` | 權杖最少、延遲最低 | 較簡單的任務與成本敏感的工作。也適用於需要輕量思考的分析與寫作任務。在困難任務上品質可能下降。 |
| `medium`（預設） | 均衡 | 建議用於大多數任務，包括複雜程式碼與代理使用案例。 |
| `high` | 權杖最多、首個權杖最慢 | 複雜推理、困難的數學與科學，以及最困難的程式碼或代理任務。搭配長解碼使用，適合產生長輸出。 |

請在三個層級都執行評估，再挑選能達到品質標準的最低層級。如需進一步了解，請參閱[思考指南](/docs/thinking/)。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-carbon",
          input="Analyze this payment processing pipeline for race conditions during retry attempts and rewrite the transaction locks safely.",
          generation_config={
              "thinking_level": "medium"  # Balanced reasoning effort for complex tasks
          }
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        model: "gemini-4-carbon",
        input: "Analyze this payment processing pipeline for race conditions during retry attempts and rewrite the transaction locks safely.",
        generation_config: {
          thinking_level: "medium", // Balanced reasoning effort for complex tasks
        },
      });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```bash
      curl "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "model": "gemini-4-carbon",
          "input": "Analyze this payment processing pipeline for race conditions during retry attempts and rewrite the transaction locks safely.",
          "generation_config": {
            "thinking_level": "medium"
          }
        }'
      ```


## 更大的輸出與長解碼 {#long-decode}

Gemini 4 Carbon 能在困難的數學、科學與程式設計問題上進行更長時間的思考。

* **使用 `thinking_level` 控制推理深度：** `thinking_level` 設定模型在回答前推理的深度。`max_output_tokens` 設定思考與輸出權杖合計的上限。當思考加上輸出達到 `max_output_tokens` 時，回應即停止，因此請將其設得夠高，為最終答案留出空間。
* **透過背景執行產生超過 64K 權杖的內容：** 標準同步回應會在 65,536 個權杖時停止。若要產生更長的回應，請將 `background=True` 設為真，並將 `max_output_tokens` 提高至 65,536 以上（最高可達統一的 1M 權杖上下文視窗減去您的輸入權杖）。我們的伺服器會以 64K 權杖為單位的接續跳轉為您產生回應。每個跳轉都會新增一個 `model_output` 步驟至 `interaction.steps`，因此當互動完成時，請將所有 `model_output` 步驟中的文字串連起來。


=== "Python"

      ```python
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

      # Each hop adds a model_output step, so join the text of all of them.
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

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      let interaction = await client.interactions.create({
        model: "gemini-4-carbon",
        input: "Write a complete, rigorous proof of the prime number theorem.",
        background: true,
        generation_config: {
          max_output_tokens: 262144,
          thinking_level: "high",
        },
      });

      while (interaction.status === "in_progress" || interaction.status === "queued") {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        interaction = await client.interactions.get(interaction.id);
      }

      // Each hop adds a model_output step, so join the text of all of them.
      const text = interaction.steps
        .filter((step) => step.type === "model_output")
        .flatMap((step) => step.content ?? [])
        .filter((content) => content.type === "text")
        .map((content) => content.text)
        .join("");
      console.log(text);
      console.log("Status:", interaction.status);
      console.log("Usage:", interaction.usage);
      ```

=== "REST"

      ```bash
      ID=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-4-carbon",
          "input": "Write a complete, rigorous proof of the prime number theorem.",
          "background": true,
          "generation_config": {
            "max_output_tokens": 262144,
            "thinking_level": "high"
          }
        }' | jq -r '.id')

      while true; do
        RESP=$(curl -s "https://generativelanguage.googleapis.com/v1beta/interactions/$ID" \
          -H "x-goog-api-key: $GEMINI_API_KEY")
        STATUS=$(echo "$RESP" | jq -r '.status')
        if [[ "$STATUS" != "in_progress" && "$STATUS" != "queued" ]]; then
          echo "$RESP" | jq -r '[.steps[]? | select(.type == "model_output") | .content[]? | select(.type == "text") | .text] | join("")'
          break
        fi
        sleep 5
      done
      ```


!!! note " "

      如果您設定 `background: true` 但未定義 `max_output_tokens`，伺服器會在 64K 個權杖後停止。


背景執行是執行長解碼的建議方式。它會在伺服器端執行接續迴圈，直到模型完成或達到 `max_output_tokens` 為止。如果您需要更細緻地控制重試、退避與錯誤處理（或不想儲存您的互動），您可以在 [Interactions API](/docs/long-decode/#client-side-continuation) 或 [GenerateContent API](/docs/long-decode/?generate-content=true) 中使用用戶端接續。如需串流、重新連線、權杖計算，以及何時使用長解碼的相關資訊，請參閱[長解碼指南](/docs/long-decode/)。

### 設定輸出權杖上限 {#setting-output-token-limits}

`max_output_tokens` 設定回應中思考與輸出權杖合計的最大值。請將其設得夠高，避免思考把答案截斷；同時也要設得夠低，以便在困難提示詞用盡上限時限制支出。

請將下列數值作為起點：

* **標準任務：** 保留預設值 65,536，或不設定任何值。
* **上限低於 32K 的現有應用程式：** 將 `max_output_tokens` 提高至至少 32,768。Gemini 4 Carbon 可能會將比先前模型更多的上限花在思考上。若要使用較少的權杖，請改為降低思考層級。
* **複雜推理與程式設計：** 將 `background: true` 設為真，並將 `max_output_tokens` 設為 131,072 或 262,144，最高可達 1,048,576 減去您的輸入權杖。

## Managed Agents 中的 Gemini 4 Carbon {#managed-agents}

Gemini Managed Agents 中的 [Antigravity 代理](/docs/antigravity-agent/)支援 Gemini 4 Carbon。若要使用，請在 `agent_config` 中設定模型：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input=(
              "Audit https://web.dev for performance, Core Web Vitals, and SEO. "
              "Query Google's PageSpeed Insights API for both Mobile and Desktop strategies. "
              "Check search indexing with Google Search for site:web.dev. "
              "Format the output as a side-by-side scorecard table with prioritized fixes."
          ),
          environment="remote",
          agent_config={
              "type": "antigravity",
              "model": "gemini-4-carbon",
          },
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        agent: "antigravity-preview-09-2026",
        input:
          "Audit https://web.dev for performance, Core Web Vitals, and SEO. " +
          "Query Google's PageSpeed Insights API for both Mobile and Desktop strategies. " +
          "Check search indexing with Google Search for site:web.dev. " +
          "Format the output as a side-by-side scorecard table with prioritized fixes.",
        environment: "remote",
        agent_config: {
          type: "antigravity",
          model: "gemini-4-carbon",
        },
      }, { timeout: 300000 });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Audit https://web.dev for performance, Core Web Vitals, and SEO. Query Google'\''s PageSpeed Insights API for both Mobile and Desktop strategies. Check search indexing with Google Search for site:web.dev. Format the output as a side-by-side scorecard table with prioritized fixes.",
          "environment": "remote",
          "agent_config": {
            "type": "antigravity",
            "model": "gemini-4-carbon"
          }
        }'
      ```


如需更多選項，請參閱 Antigravity 代理指南中的[模型選擇](/docs/antigravity-agent/#model-selection)。

## 遷移檢查清單 {#migration-checklist}


!!! note " "

      使用程式設計代理自動化這項遷移。如果您使用支援技能的程式設計代理（例如 Antigravity），請安裝 [gemini-api-dev 技能](/docs/coding-agents/#gemini-api-dev)並執行：

      ```none
      /gemini-api-dev migrate my app to Gemini 4 Carbon
      ```


### 從 Gemini 4 Argon 遷移 {#migrate-from-gemini-4-argon}

如果您已在執行 `gemini-4-argon`，升級至 `gemini-4-carbon` 不需要變更請求結構描述：

* **更新模型 ID：** 將模型字串從 `gemini-4-argon` 改為 `gemini-4-carbon`。
* **考量更長的思考時間：** 在複雜任務上，Carbon 每回合花費的思考權杖比 Argon 更多。請將 `thinking_level` 保留為 `medium`（預設），除非工作負載需要 `high`，並確保您的 `max_output_tokens` 與 HTTP 逾時能容納更長的推理過程。
* **在重視速度的地方使用 Neon 或 Hydrogen：** 當您在複雜的軟體工程、知識工作與科學工作流程中，想要更快的端到端任務完成速度時，請使用 [`gemini-4-neon`](/docs/whats-new-gemini-4-neon/)；日常程式設計與互動式迴圈則使用 [`gemini-4-hydrogen`](/docs/whats-new-gemini-4-hydrogen/)。

### 從 Gemini 3 與更早版本遷移 {#migrate-to-gemini-4-carbon}

* **更新模型 ID：** 將目標模型字串改為 `gemini-4-carbon`。
* **檢視 `max_output_tokens`：** 如果您目前有明確設定，請考慮提高。我們建議至少 32,768，因為 Gemini 4 Carbon 可能會將更多的上限花在思考上。
* **設定思考層級：** 選擇 `low`、`medium`（預設）或 `high`，並在三個層級都測試您的工作負載。
* **停止使用明確上下文快取：** Gemini 4 Carbon 不支援明確快取（`cachedContents` / `caches.create`）。請從您的請求中移除建立或參照 `cached_content` 的呼叫。[隱含快取](/docs/caching/)預設為至少 4,096 個權杖的提示詞啟用，並在快取命中時為快取的輸入權杖提供 95% 折扣。
* **移除取樣參數：** 請從您的請求中移除 `temperature`、`top_p` 與 `top_k`。如果提供，這些參數會被忽略。
* **對長輸出使用背景執行：** 對於需要超過 64K 個權杖的任務，請將 `background` 設為 true，並將 `max_output_tokens` 設為大於 65,536。
* **增加用戶端逾時：** 困難的提示詞可能需要數分鐘。請使用背景執行，或將 HTTP 用戶端逾時設為至少 15 分鐘。
* **將對話狀態保留在伺服器上：** 使用 `previous_interaction_id` 進行多回合與函式呼叫對話。
* **檢視您的成本估算：** 模型處理的每個權杖都會計費，包括使用接地時的內部工具系統指令與函式宣告（請參閱[定價](/docs/whats-new-gemini-4-carbon/#pricing)）。

## 定價 {#pricing}

Gemini 4 Carbon 在 2026 年 11 月 30 日前享有優惠定價：

* **輸入權杖：** 每 1M 個權杖 $2.00（2026 年 12 月 1 日起為 $4.00）
  *   **快取的輸入權杖：** 隱含快取為快取的輸入提供 95% 折扣，降至每 1M 個權杖 $0.10（2026 年 12 月 1 日起為 $0.20）。

* **輸出權杖（包括思考權杖）：** 每 1M 個權杖 $10.00（2026 年 12 月 1 日起為 $20.00）

模型處理的每個權杖都會計算並計費，包括思考權杖，以及使用接地時的內部工具系統指令與函式宣告。使用 Google 搜尋接地也會繼續按查詢計費。

Gemini 4 Carbon 不提供免費層級。如需完整的定價層級，請參閱[定價頁面](/docs/pricing/#gemini-4-carbon)。

## 其他模型 {#other-models}

* [選擇模型](/docs/choosing-a-model/)
* [最新 Gemini 模型](/docs/latest-model/)
* [Gemini 4 Neon](/docs/whats-new-gemini-4-neon/)
* [Gemini 4 Hydrogen](/docs/whats-new-gemini-4-hydrogen/)
* [Gemini 4 Argon](/docs/whats-new-gemini-4-argon/)
* [Gemini 3.8 Flash](/docs/whats-new-gemini-3.8/)
* [Gemini 3.6 Flash 與 3.5 Flash-Lite](/docs/whats-new-gemini-3.6/)
* [查看所有模型](/docs/models/)

## 後續步驟 {#whats-next}

* 閱讀 [Gemini 4 Carbon 開發人員指南](/learn/gemini-4-carbon-developer-guide/)，了解提示詞與多代理模式。
* 閱讀[長解碼指南](/docs/long-decode/)，了解串流、重新連線與權杖計算。
* 在[思考指南](/docs/thinking/)中了解思考層級與思考摘要的運作方式。
* 在[背景執行指南](/docs/background-execution/)中了解長時間執行的工作。
* 在[文件理解指南](/docs/document-processing/#office-documents)中處理 Word、PowerPoint 與 Excel 檔案。
* 在 [Google AI Studio](https://aistudio.google.com/prompts/new_chat?model=gemini-4-carbon) 中測試並調整提示詞。
