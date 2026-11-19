# Gemini 4 Neon 的新功能

Gemini 4 Neon（`gemini-4-neon`）帶來前沿級智慧，端到端任務完成速度快，適用於複雜的軟體工程、知識工作與科學工作流程。它介於 [Gemini 4 Hydrogen](/docs/whats-new-gemini-4-hydrogen/) 與 [Gemini 4 Carbon](/docs/whats-new-gemini-4-carbon/) 之間，適用於高頻率的複雜任務。

Gemini 4 Neon 可在 Gemini API 的付費層級使用（同時支援 `generateContent` 與 Interactions API），以及在 Google AI Studio 中搭配 Google AI Pro 與 Ultra 方案使用。與其他 Gemini 4 模型相同，它具備統一的 100 萬 tokens 上下文視窗，並支援最長 100 萬 tokens 的長解碼。它支援四種思考層級：`low`、`medium`、`high`（預設）與 [`xhigh`](/docs/thinking/#understanding-thinking-levels)。


  

**[模型卡](/docs/models/gemini-4-neon/)**

查看 token 上限、支援的功能與完整規格。


  

**[在 AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-4-neon)**

在 Google AI Studio 中使用 Gemini 4 Neon 測試提示詞。


  

**[遷移至 Neon](/docs/whats-new-gemini-4-neon/#migration-checklist)**

使用遷移檢查清單將現有工作負載移轉至 Gemini 4 Neon。


本指南說明 Gemini 4 Neon 的新功能、API 變更、程式碼範例與遷移指引。

## 新模型 {#new-model}

| 模型 | 模型 ID | 思考層級 | 付費層級價格 |
| :--- | :--- | :--- | :--- |
| Gemini 4 Neon | `gemini-4-neon` | `low`、`medium`、`high`（預設）、`xhigh` | 每 1M 輸入 $3.00、每 1M 輸出 $15.00 |

完整規格請參閱 [Gemini 4 Neon 模型頁面](/docs/models/gemini-4-neon/) 與[最新 Gemini 模型](/docs/latest-model/)。

## 快速入門 {#quickstart}

使用 Interactions API 向 `gemini-4-neon` 傳送要求。模型預設使用 `high` 思考層級，同步輸出 token 上限為 64K。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-neon",
          input="Build an interactive single-file HTML token bucket rate-limiter simulator with live sliders for burst size and request traffic."
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        model: "gemini-4-neon",
        input: "Build an interactive single-file HTML token bucket rate-limiter simulator with live sliders for burst size and request traffic.",
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
          "model": "gemini-4-neon",
          "input": "Build an interactive single-file HTML token bucket rate-limiter simulator with live sliders for burst size and request traffic."
        }'
      ```


## Gemini 4 Neon 的新功能 {#whats-new-gemini-4-neon}

* **前沿級智慧，端到端任務完成速度快**：在複雜的軟體工程、知識工作與科學工作流程中提供前沿級品質，token 用量更精簡、端到端任務完成速度更快，價格為每 100 萬輸入 tokens $3.00、每 100 萬輸出 tokens $15.00。
* **為複雜軟體工程與代理執行而打造**：以更少的步驟、乾淨的編輯完成儲存庫層級的除錯與多檔案重構。在包含大量工具呼叫的長時間工作階段中，Neon 能減少重複的檔案讀取、可靠地處理上下文壓縮，並將虛構的主張與任務捷徑降至最少。
* **知識工作、科學與分析推理**：將密集的文件、試算表、圖表與多步驟工具輸出，在 100 萬 tokens 的上下文視窗中綜合成結構化的交付成果，在法律、金融、科學與量化任務上表現出色。
* **網路安全與可靠性**：撰寫的程式碼安全漏洞更少，改善根本原因漏洞修補，並減少多步驟工作流程中的代理越權與服務不足。雙重用途的攻擊性網路防禦能力可透過 [Fairwind Program](https://deepmind.google/fairwind-program/) 提供給防禦者。
* **四種可設定的思考層級**：支援 `low`、`medium`、`high`（預設）與 `xhigh`，讓您能針對每個工作負載調整推理深度、延遲與 token 花費。詳情請參閱[思考層級](/docs/whats-new-gemini-4-neon/#understanding-thinking-levels)一節。
* **統一的 100 萬上下文視窗與長解碼**：輸入、思考與輸出 tokens 共用同一個 1,048,576tokens 的視窗。透過背景執行或用戶端接續，回覆長度可超過 64K，最長可達 100 萬 tokens。請參閱[長解碼](/docs/long-decode/)。
* **支援受管理的代理**：Gemini Managed Agents 中的 [Antigravity 代理](/docs/antigravity-agent/) 支援 `gemini-4-neon`，可獨立使用，或在多模型工作流程中與 Hydrogen 搭配使用。

## 比較 Neon、Carbon、Hydrogen 與其他模型 {#choosing-between-models}

Gemini 4 Neon 介於 [Gemini 4 Hydrogen](/docs/whats-new-gemini-4-hydrogen/) 與 [Gemini 4 Carbon](/docs/whats-new-gemini-4-carbon/) 之間。對於複雜的軟體工程、知識工作與科學工作流程，若您希望兼具前沿級智慧與快速的端到端任務完成速度，請使用 Neon。對於最困難的架構、除錯、科學與安全問題，請使用 Carbon。日常程式設計與代理工作流程請繼續以 Hydrogen 為預設，而大量、低延遲的任務請使用 [Gemini 3.5 Flash-Lite](/docs/whats-new-gemini-3.6/)。

如需並排比較、專用模型建議與多模型程式碼範例，請參閱[選擇模型](/docs/choosing-a-model/)。

## 了解思考層級 {#understanding-thinking-levels}

[思考層級](/docs/thinking/) 是您在 Gemini 4 Neon 中控管品質、延遲與 token 用量的主要手段。模型預設為 `high`，並支援 `xhigh`。

| 思考層級 | token 用量 | 適用時機 |
| :--- | :--- | :--- |
| `low` | token 最少、延遲最低 | 對成本與延遲敏感的工作負載，例如快速對話與高輸送量處理。在代理任務上仍具備能力。 |
| `medium` | token 用量較低、回覆較快 | 互動式程式設計、即時 UI 原型製作、回應迅速的對話，以及對延遲敏感的工具呼叫。 |
| `high`（預設） | 智慧與速度兼顧 | 大多數任務的建議預設值，包括複雜程式設計、代理執行、工具呼叫與多模態知識工作。 |
| `xhigh` | token 最多、推理最深 | 保留給 `high` 不足以應付的困難多步驟工程、分析與科學問題，此時您可以接受更高的延遲與 token 用量。 |

大多數複雜任務請先從 `high` 開始，並將 `xhigh` 保留給 `high` 不足以應付的困難多步驟問題。使用 `xhigh` 會增加延遲與 token 用量。請在四個層級下都執行評測，並將 `max_output_tokens` 設得夠高，避免上限截斷答案。接著，挑選能達到您品質門檻的最低 `thinking_level`。詳情請參閱[思考指南](/docs/thinking/)。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-neon",
          input="Audit this payment retry queue for race conditions and rewrite the lock acquisition logic.",
          generation_config={
              "thinking_level": "xhigh"
          }
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        model: "gemini-4-neon",
        input: "Audit this payment retry queue for race conditions and rewrite the lock acquisition logic.",
        generation_config: {
          thinking_level: "xhigh",
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
          "model": "gemini-4-neon",
          "input": "Audit this payment retry queue for race conditions and rewrite the lock acquisition logic.",
          "generation_config": {
            "thinking_level": "xhigh"
          }
        }'
      ```


## 更大的輸出與長解碼 {#long-decode}

Gemini 4 Neon 支援最長 65,536 tokens 的同步輸出，以及最長可達 100 萬統一上下文視窗的長解碼：

* **使用 `thinking_level` 控管推理深度**：`thinking_level` 欄位決定模型在回答前進行多少推理。`max_output_tokens` 欄位則限制思考與輸出 tokens 的總量，因此請為最終答案預留足夠的空間。
* **透過背景執行或接續產生超過 64Ktokens的內容**：同步回覆在串流與非串流要求下，每一跳最多支援 65,536 tokens。若要產生更長的輸出，請將 `max_output_tokens` 設為高於 65,536（上限為 1,048,576 減去您的輸入 token 數），並將 `background` 設為 `true`，讓我們的伺服器以每跳 64Ktokens的方式接續產生；或者在最新版 Google GenAI SDK 中使用用戶端接續。


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-neon",
          input="Generate a complete multi-module migration specification and test suite for this service.",
          background=True,
          generation_config={
              "max_output_tokens": 262144,
              "thinking_level": "high",
          },
      )

      while interaction.status in ("in_progress", "queued"):
          time.sleep(5)
          interaction = client.interactions.get(id=interaction.id)

      # Join text across all 64K continuation hops.
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
        model: "gemini-4-neon",
        input: "Generate a complete multi-module migration specification and test suite for this service.",
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

      // Join text across all 64K continuation hops.
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
          "model": "gemini-4-neon",
          "input": "Generate a complete multi-module migration specification and test suite for this service.",
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

      如果您將 `background` 設為 `true` 卻未設定 `max_output_tokens`，伺服器會在 65,536 tokens 後停止。


建議使用背景執行來執行長解碼。若需要自訂重試控制，或使用不儲存的互動，請在 [Interactions API](/docs/long-decode/#client-side-continuation) 或 [`generateContent` API](/docs/long-decode/?generate-content=true) 中使用用戶端接續。串流與 token 計算的詳情請參閱[長解碼指南](/docs/long-decode/)。

### 設定輸出 token 上限 {#setting-output-token-limits}

`max_output_tokens` 欄位限制單一回覆中思考與輸出 tokens 的總量。請使用下列起始值，在控制支出的同時避免答案被截斷：

* **一般任務**：保留 65,536 的預設值，或省略 `max_output_tokens`。
* **上限過低的現有應用程式**：移除寫死的低上限（例如 8,192），或將 `max_output_tokens` 提高到 65,536。若要減少 token 用量，請改為降低思考層級。
* **長輸出與多步驟任務**：將 `background` 設為 `true`，並將 `max_output_tokens` 設為 131,072 或 262,144，上限為 1,048,576 減去您的輸入 token 數。

## 遷移檢查清單 {#migration-checklist}


!!! note " "

      如果您使用支援技能的程式設計代理（例如 Antigravity），請安裝 [gemini-api-dev 技能](/docs/coding-agents/#gemini-api-dev) 以自動完成這次升級：

      ```none
      /gemini-api-dev migrate my app to Gemini 4 Neon
      ```


### 從 Gemini 4 Carbon、Argon 或 Hydrogen 遷移 {#migrate-from-gemini-4}

如果您目前執行的是其他 Gemini 4 模型，切換至 `gemini-4-neon` 不需要變更要求結構描述：

* **更新模型 ID**：將 `model` 設為 `gemini-4-neon`。
* **檢查預設思考層級**：Neon 與 Hydrogen 相同，預設為 `high` 並支援 `xhigh`。Carbon 與 Argon 預設為 `medium`，上限為 `high`。若您希望有不同的行為，請設定 `thinking_level`。
* **使用付費層級專案**：Neon 僅適用於付費層級（不適用於免費層級）。

### 從 Gemini 3 與更早版本遷移 {#migrate-from-gemini-3}

Gemini 4 Neon 採用與 Carbon、Argon 及 Hydrogen 相同的 Gemini 4 API 設計。從 `gemini-3.8-flash` 或更早的 Gemini 3 模型升級時，請檢閱下列變更：

* **更新模型 ID**：將模型字串改為 `gemini-4-neon`。
* **留意統一的 100 萬上下文視窗**：Gemini 3.8 Flash 將 100 萬輸入與 64K 輸出的預算分開計算；Neon 則讓輸入、思考與輸出 tokens 共用同一個 1,048,576tokens 的視窗，同時在串流與非串流呼叫中都保留單次要求 65,536 的預設值與上限。請移除寫死的低 `max_output_tokens` 上限，或將其提高到 65,536。
* **設定 `thinking_level`**：Neon 的預設值為 `high` 而非 `medium`，新增了 `xhigh`，並會以錯誤拒絕 `minimal`。請在您的評測套件上測試 `medium` 與 `high`，以在速度與成本之間取得平衡。
* **停用明確上下文快取**：Gemini 4 Neon 不支援明確快取（`cachedContents` 與 `caches.create`）。請從要求中移除 `cached_content` 欄位。[隱含快取](/docs/caching/) 會預設在至少 4,096 tokens 的提示詞上執行，並在快取命中時為快取的輸入 tokens 提供 95% 的折扣。
* **移除取樣參數**：請從要求中移除 `temperature`、`top_p` 與 `top_k`。若傳送範圍內的自訂值，伺服器會加以忽略；超出範圍的值則會傳回 `400` 驗證錯誤。
* **宣告原生工具或結構化輸出結構描述**：請勿透過系統指令提示模型在未宣告任何工具的情況下，發出自訂的原始文字 JSON 工具呼叫，這可能會傳回 `MALFORMED_FUNCTION_CALL`。請一律使用[函式呼叫](/docs/function-calling/) 以原生方式宣告工具，或使用[結構化輸出](/docs/structured-output/) 限制 JSON 回覆。
* **保留對話狀態與思考簽章**：在多輪與工具呼叫工作階段中，請在 Interactions API 中使用 `previous_interaction_id`。在由用戶端管理的 `generateContent` 歷史記錄中，請在每一輪都原封不動地傳回先前的模型輪次與思考簽章。請勿將同一個思考簽章複製到平行的 `functionCall` 部分。
* **對超過 64K 的輸出使用背景執行**：對於長度超過 64Ktokens的回覆，請將 `background` 設為 `true`，並將 `max_output_tokens` 設為高於 65,536（或在最新版 SDK 中使用用戶端接續）。
* **提高用戶端逾時時間**：困難的提示詞可能需要數分鐘。請使用背景執行，或將 HTTP 用戶端逾時設為至少 15 分鐘。
* **檢閱 token 計費估算**：我們會計算並收費模型處理的每一個 token，包括思考 token，以及內部的接地系統指令與函式宣告。

## 定價 {#pricing}

Gemini 4 Neon 僅適用於 Gemini API 的付費層級，並在完整的 100 萬上下文視窗範圍內採用單一標準定價：

* **輸入 tokens**：每 100 萬 tokens $3.00
  *   **快取的輸入 tokens**：隱含快取為快取的輸入提供 95% 的折扣，降至每 100 萬 tokens $0.15。

* **輸出 tokens（包括思考 token）**：每 100 萬 tokens $15.00

我們會計算並收費模型處理的每一個 token，包括使用接地時所涉及的思考 token，以及內部工具的系統指令與函式宣告。使用 Google 搜尋接地仍依查詢次數計費。

完整的層級詳情與速率限制請參閱[定價頁面](/docs/pricing/#gemini-4-neon) 與[速率限制頁面](/docs/rate-limits/)。

## 其他模型 {#other-models}

* [最新 Gemini 模型](/docs/latest-model/)
* [Gemini 4 Carbon](/docs/whats-new-gemini-4-carbon/)
* [Gemini 4 Argon](/docs/whats-new-gemini-4-argon/)
* [Gemini 4 Hydrogen](/docs/whats-new-gemini-4-hydrogen/)
* [Gemini 3.8 Flash](/docs/whats-new-gemini-3.8/)
* [Gemini 3.6 Flash 與 3.5 Flash-Lite](/docs/whats-new-gemini-3.6/)
* [查看所有模型](/docs/models/)

## 後續步驟 {#whats-next}

* 在[選擇模型](/docs/choosing-a-model/)中比較模型與多模型模式。
* 閱讀[長解碼指南](/docs/long-decode/)，了解串流、重新連線與 token 計算。
* 在[思考指南](/docs/thinking/)中了解思考層級與思考摘要的運作方式。
* 在[背景執行指南](/docs/background-execution/)中了解非同步工作。
* 在 [Google AI Studio](https://aistudio.google.com/prompts/new_chat?model=gemini-4-neon) 中測試並優化提示詞。
