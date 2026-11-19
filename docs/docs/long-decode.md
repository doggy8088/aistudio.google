# 長解碼

Gemini 4 模型（`gemini-4-carbon`、`gemini-4-argon`、`gemini-4-neon` 與 `gemini-4-hydrogen`）預設每次回應最多產生 64K 個權杖（65,536）的思考與輸出。長解碼可讓你將 `max_output_tokens` 提高到超過 64K，用於困難的推理、數學與程式設計任務，上限為統一的 100 萬權杖上下文視窗（1,048,576 個權杖，由輸入、思考與輸出共同使用）。在 Interactions API 上，你可以透過[背景執行](/docs/background-execution/)執行長解碼，讓我們的伺服器為你執行每一個躍點；也可以在前景透過[用戶端接續](/docs/long-decode/#client-side-continuation)執行。

## 長解碼如何運作 {#how-long-decode-works}

產生數十萬個權杖所需的時間，可能比單一 HTTP 請求能保持開啟的時間更長，因此長解碼會將生成過程拆分為連續的躍點，從前一個躍點停止的位置繼續：背景呼叫、串流呼叫，以及 `gemini-4-neon` 與 `gemini-4-hydrogen` 的非串流呼叫，每個躍點最多 64K 個權杖（65,536）；`gemini-4-carbon` 與 `gemini-4-argon` 的非串流躍點，每個躍點最多 32K 個權杖（32,768）。

當你在 Interactions API 上設定 `background: true`，且 `max_output_tokens` 大於 65,536 時：

1. 請求會以非同步方式執行，並傳回 `status="in_progress"` 的互動。
2. 若回應在未完成前達到 64K 個權杖，伺服器會以目前已產生的權杖啟動一個接續躍點。
3. 此過程會重複，直到模型完成或達到 `max_output_tokens` 為止。
4. 當你輪詢該互動時，會在單一互動中取得所有躍點合併後的思考與輸出。

若要改由你的用戶端執行接續躍點，請參閱[選擇長解碼的執行方式](/docs/long-decode/#choose-how-to-run-long-decode)。


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
      # 1. Create the background interaction. It returns an ID right away.
      ID=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-4-carbon",
          "input": "Write a complete, rigorous proof of the prime number theorem.",
          "background": true,
          "generation_config": {"max_output_tokens": 262144, "thinking_level": "high"}
        }' | jq -r '.id')

      # 2. Poll until the status is no longer in_progress or queued.
      #    The REST response has no output_text field, so join the text of every model_output step.
      while true; do
        RESP=$(curl -s "https://generativelanguage.googleapis.com/v1beta/interactions/$ID" \
          -H "x-goog-api-key: $GEMINI_API_KEY")
        STATUS=$(echo "$RESP" | jq -r '.status')
        if [[ "$STATUS" != "in_progress" && "$STATUS" != "queued" ]]; then
          echo "$RESP" | jq -r '[.steps[]? | select(.type == "model_output") | .content[]? | select(.type == "text") | .text] | join("")'
          echo "$RESP" | jq '{status, usage}'
          break
        fi
        sleep 5
      done
      ```


## 輸出上限 {#output-limits}

串流與非串流互動的預設輸出權杖上限為 64K，因此最多 64K 個權杖的回應無需修改任何程式碼。若要產生超過 64K 個權杖，請提高 `max_output_tokens`，並使用背景執行或用戶端接續。

| 建立互動的方式 | 輸出上限 |
| :--- | :--- |
| `background: false`，未設定 `max_output_tokens` | 65,536 個權杖 |
| `background: false`，`max_output_tokens` 大於 65,536，`automatic_continuation: true`（SDK 預設） | 你的 `max_output_tokens`，上限為 1,048,576 減去你的輸入 |
| `background: false`，`max_output_tokens` 大於 65,536，`automatic_continuation: false` 或 REST | 每個串流躍點（或 `gemini-4-neon` 與 `gemini-4-hydrogen` 的非串流躍點）65,536 個權杖，或 `gemini-4-carbon` 與 `gemini-4-argon` 每個非串流躍點 32,768 個權杖。使用 `continuation_token` 迴圈執行，即可產生最多達你的 `max_output_tokens`。 |
| `background: true`，未設定 `max_output_tokens` | 65,536 個權杖 |
| `background: true`，`max_output_tokens` 大於 65,536 | 你的 `max_output_tokens`，上限為 1,048,576 減去你的輸入 |


!!! warning " "

      長解碼時，請務必將 `max_output_tokens` 設定為大於 65,536。同時也要檢查你的代理框架或評測工具中的設定值。過低的值（例如 8,192）會讓模型在思考完成前就停止。


## 何時使用長解碼 {#when-to-use-long-decode}

大多數請求都能在 64K 個權杖內完成。僅在單一回應需要超過該數量的思考與輸出時，才使用長解碼。

| 工作負載 | 是否使用長解碼？ | 原因 |
| :--- | :--- | :--- |
| 困難的數學、科學、研究與形式證明 | 是 | 模型可使用超過 64K 個權杖來探索並檢查其推理。 |
| 最困難的程式設計與代理任務 | 是 | 有些任務在單一回應中需要超過 64K 個權杖的思考與程式碼。大多數程式設計與代理任務都能在 64K 內完成。 |
| 會在輸出上限處停止的評測工具 | 是 | 長解碼可避免模型將整個 64K 回應都用在思考上時，答案被截斷。 |
| 聊天、問答、摘要、分類與擷取 | 否 | 這些任務都能在 32K 個權杖內順利完成。 |
| 要求固定長度的請求，例如「寫一本 700,000 字的書」 | 否 | 模型不會遵循長度目標。 |
| 在許多短回合中呼叫工具的代理 | 否 | 每個回合都很短。每個回合的大量輸出會快速填滿共用的上下文視窗。 |
| 接近輸入上限的提示詞 | 否 | 輸出只能使用 1,048,576 個權杖減去你的輸入後的數量。 |
| 對延遲敏感的請求 | 否 | 長解碼可能執行數分鐘。 |

設定較高的 `max_output_tokens`，能讓模型在困難問題上有更多空間進行更長時間的思考，但模型仍會自行決定要寫多少內容。若要控制模型使用的推理努力程度，請設定 [`thinking_level`](/docs/thinking/)。

## 選擇長解碼的執行方式 {#choose-how-to-run-long-decode}

背景執行是在 Interactions API 上執行長解碼最簡單的方式。我們的伺服器會執行每一個躍點，因此用戶端連線中斷不會干擾生成過程。用戶端接續則是由 Google GenAI SDK 或你自己的程式碼啟動每個躍點，同樣可在 Interactions API 上用於前景呼叫、無狀態請求，或自行管理重試的韌性。

|  | 背景執行（Interactions API） | 用戶端接續（Interactions API） |
| :--- | :--- | :--- |
| **誰啟動每個躍點** | 我們的伺服器 | Google GenAI SDK（預設），或你自己的程式碼 |
| **每個請求的權杖數** | 你的 `max_output_tokens`，在單一互動中（每個內部躍點最多 64K） | 每個串流 64K（`gemini-4-neon` 與 `gemini-4-hydrogen` 的非串流亦同）；`gemini-4-carbon` 與 `gemini-4-argon` 每個非串流請求 32K |
| **執行時間** | 最多 24 小時 | 每個串流躍點 20 分鐘，每個非串流躍點 10 分鐘 |
| **儲存** | 需要 `store: true` | 預設儲存（`store: true`），或以 `store: false` 設為無狀態 |
| **最適合** | 執行長解碼最簡單的方式 | 前景呼叫、無狀態應用程式，或對重試有更細緻的控制，以便建立你自己的退避、錯誤處理與韌性機制 |

若你改用 GenerateContent API，請參閱[使用 GenerateContent API 的長解碼](/docs/long-decode/?generate-content=true)。

## 用戶端接續 {#client-side-continuation}

以下章節適用於 `background: false`（預設）的情況。你的用戶端會驅動每個接續躍點，而非由我們的伺服器執行，可透過 Google GenAI SDK 自動完成，或使用你自己的迴圈。

### 使用 SDK 自動接續 {#automatic-continuation}


!!! note " "

      用戶端接續需要 Google GenAI SDK 版本：Python 2.34.0 以上、JavaScript 2.32.0 以上、Go 1.77.0 以上、Java 1.80.0 以上，或 .NET 1.28.0 以上。


當 `max_output_tokens` 超過單一躍點上限時，Google GenAI SDK 會執行接續躍點，並傳回一個合併後的互動。如需使用 REST 或自訂迴圈控制，請參閱[使用自訂迴圈的用戶端接續](/docs/long-decode/#client-side-loop)。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-carbon",
          input="Write a complete, rigorous proof of the prime number theorem.",
          generation_config={
              "max_output_tokens": 262144,
              "thinking_level": "high",
          },
      )

      print(interaction.output_text)
      print("Status:", interaction.status)
      print("Usage:", interaction.usage)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        model: "gemini-4-carbon",
        input: "Write a complete, rigorous proof of the prime number theorem.",
        generation_config: {
          max_output_tokens: 262144,
          thinking_level: "high",
        },
      });

      console.log(interaction.output_text);
      console.log("Status:", interaction.status);
      console.log("Usage:", interaction.usage);
      ```


請留意以下 SDK 行為：

* **儲存合併後的回應：** `interactions.create` 會合併所有躍點的文字、步驟與用量，並使用最後一個躍點的 `id`。由於每個躍點是分開儲存的，`interactions.get` 只會傳回最後一個躍點的輸出，因此請儲存 `create` 的回應。在下一回合將該 `id` 以 `previous_interaction_id` 傳入，即可保留完整歷史記錄。
* **逾時：** 用戶端的 `http_options` 設定每個躍點的 HTTP 逾時。將 `timeout` 傳給 `interactions.create`，可限制所有躍點的總時間。
* **中斷的執行：** 若某個躍點在已有進度後失敗，SDK 會擲出 `ContinuationInterruptedError`。對於非串流呼叫，`partial_interaction` 會保存已完成躍點合併後的輸出。若要繼續，請將錯誤中的互動 ID 與 `continuation_token` 傳給 `interactions.create`（或重新傳送 `input`，當 `store` 為 `false` 時）。

### 使用自訂迴圈的用戶端接續 {#client-side-loop}

若要直接呼叫 REST，或自行管理躍點之間的重試、退避與記錄，請在你的程式碼中執行接續迴圈（在 SDK 中停用 `automatic_continuation`）。每個躍點請保持相同的模型、工具、系統指令與生成設定；若已停用儲存，請重新傳送提示詞，而非前一個互動 ID。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-carbon",
          input="Write a complete, rigorous proof of the prime number theorem.",
          automatic_continuation=False,
          generation_config={
              "max_output_tokens": 262144,
              "thinking_level": "high",
          },
      )
      full_text = interaction.output_text or ""

      while interaction.status == "requires_continuation":
          interaction = client.interactions.create(
              model="gemini-4-carbon",
              previous_interaction_id=interaction.id,
              continuation_token=interaction.continuation_token,
              automatic_continuation=False,
              generation_config={
                  "max_output_tokens": 262144,
                  "thinking_level": "high",
              },
          )
          full_text += interaction.output_text or ""

      print(full_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      let interaction = await client.interactions.create({
        model: "gemini-4-carbon",
        input: "Write a complete, rigorous proof of the prime number theorem.",
        automatic_continuation: false,
        generation_config: {
          max_output_tokens: 262144,
          thinking_level: "high",
        },
      });
      let fullText = interaction.output_text ?? "";

      while (interaction.status === "requires_continuation") {
        interaction = await client.interactions.create({
          model: "gemini-4-carbon",
          previous_interaction_id: interaction.id,
          continuation_token: interaction.continuation_token,
          automatic_continuation: false,
          generation_config: {
            max_output_tokens: 262144,
            thinking_level: "high",
          },
        });
        fullText += interaction.output_text ?? "";
      }

      console.log(fullText);
      ```

=== "REST"

      ```bash
      RESP=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-4-carbon",
          "input": "Write a complete, rigorous proof of the prime number theorem.",
          "generation_config": {"max_output_tokens": 262144, "thinking_level": "high"}
        }')

      while [[ "$(echo "$RESP" | jq -r '.status')" == "requires_continuation" ]]; do
        echo "$RESP" | jq -rj '[.steps[]? | select(.type == "model_output") | .content[]? | select(.type == "text") | .text] | join("")'
        PREV_ID=$(echo "$RESP" | jq -r '.id')
        TOKEN=$(echo "$RESP" | jq -r '.continuation_token')
        RESP=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H "Content-Type: application/json" \
          -d "{
            \"model\": \"gemini-4-carbon\",
            \"previous_interaction_id\": \"$PREV_ID\",
            \"continuation_token\": \"$TOKEN\",
            \"generation_config\": {\"max_output_tokens\": 262144, \"thinking_level\": \"high\"}
          }")
      done

      echo "$RESP" | jq -r '[.steps[]? | select(.type == "model_output") | .content[]? | select(.type == "text") | .text] | join("")'
      ```


## 串流長解碼 {#streaming}

若要即時串流輸出與思考摘要，請加入 `stream: true` 與 `thinking_summaries: "auto"`。長時間的串流可能會中斷，因此你的用戶端必須重新連線。請遵循[背景執行指南](/docs/background-execution/)中的重新連線模式。長解碼另有以下規則：

* **儲存互動 ID：** 從 `interaction.created` 事件中讀取。
* **儲存每個 `event_id`：** `event_id` 可能出現在 `interaction.status_update` 事件上，不僅限於文字增量。
* **使用 `last_event_id` 重新連線：** 呼叫 `interactions.get`，並帶入 `stream: true` 與最後的 `event_id`。串流會在該事件之後繼續。
* **讀取到最後：** 重新連線後，請先將串流讀取到最後，再檢查狀態。伺服器會重播錯過的事件，即使互動已完成亦然。
* **設定較長的逾時：** 將每個串流的 HTTP 讀取逾時設定為 15 到 20 分鐘。
* **預期以 5K 權杖為單位的輸出區塊：** 在 `gemini-4-carbon` 與 `gemini-4-argon` 上的前 32K 個權杖之後（或在 `gemini-4-neon` 與 `gemini-4-hydrogen` 上 64K 個權杖之後，從第二個躍點開始），串流會在每個檢查點以約 5,000 個權杖為單位傳送輸出。區塊之間的停頓屬正常現象。互動並未卡住，請保持連線開啟。

對於使用 Google GenAI SDK 的前景串流，SDK 會將接續躍點串連成單一串流：

* **跨躍點持續讀取：** 每個躍點都是獨立的互動，會發出 `interaction.created` 與 `interaction.completed` 事件。不要在 `interaction.created` 時重設你的串流剖析器，也不要在 `interaction.completed` 時停止（當狀態為 `requires_continuation` 時）。若要繼續對話，請儲存最後一個躍點的 ID。
* **處理躍點中途的斷線：** 若連線在檢查點、新的增量到達前中斷，SDK 會為你重新連線。若串流在最新檢查點之後已產生增量，SDK 會擲出 `ContinuationInterruptedError`，以避免重複輸出。

## 互動狀態 {#background-status}

背景互動最多可執行 24 小時。一旦狀態不再是 `in_progress` 或 `queued`，請使用下表處理互動狀態：

| 狀態 | 意義 | 處理方式 |
| :--- | :--- | :--- |
| `completed` | 模型已完成。 | 合併 `model_output` 步驟（位於 `steps` 中）並讀取 `usage`。若要繼續對話，請將此互動的 `id` 以 `previous_interaction_id` 傳入。 |
| `requires_continuation` | 前景躍點已達到其單一請求上限（串流，以及 `gemini-4-neon` 與 `gemini-4-hydrogen` 的非串流，為 64K；`gemini-4-carbon` 與 `gemini-4-argon` 的非串流為 32K），且仍有剩餘的權杖預算。 | Google GenAI SDK 預設會為你接續。在 REST 中，請以 `previous_interaction_id` 與 `continuation_token` 傳送下一個躍點。 |
| `requires_action` | 模型要求進行工具呼叫。 | 執行該工具。然後以此互動的 `id` 傳送結果。 |
| `incomplete` | 模型已用完所有 `max_output_tokens`。若模型仍在思考，文字可能為空。 | 以 `previous_interaction_id`、`continuation_token` 與更高的 `max_output_tokens` 繼續，或以更高的 `max_output_tokens` 重新傳送請求。 |
| `failed` | 伺服器無法完成，或互動執行時間超過 24 小時。 | 重試請求。若再次失敗，請將互動 `id` 提供給支援團隊。 |
| `cancelled` | 你已取消該互動。 | 讀取 `usage` 以查看已計費的權杖。 |

若要停止執行中的互動，請在 Python 中呼叫 `client.interactions.cancel(id=interaction.id)`，在 JavaScript 中呼叫 `client.interactions.cancel(interaction.id)`，或在 REST 中使用 `POST /v1beta/interactions/{id}/cancel`。

## 設定 `max_output_tokens` {#set-max-output-tokens}

`max_output_tokens` 設定整個互動中思考與輸出的合併上限。降低此值不會讓模型更精簡地思考，只會讓回應更早被截斷。

| 你的工作負載 | 建議的 `max_output_tokens` |
| :--- | :--- |
| 上限低於 32K 的既有應用程式 | 提高到 32,768。不需要背景執行。 |
| 長篇程式設計與代理任務 | 從 65,536（預設）開始。不需要背景執行。 |
| 複雜推理、困難數學、科學與證明 | 設定 `background: true`（或使用用戶端接續），並從 262,144 開始，上限為 1,048,576 減去你的輸入權杖數。 |

若要使用較少的權杖，請降低 `thinking_level`。Carbon 與 Argon 預設為 `medium`，最高支援 `high`。Neon 與 Hydrogen 預設為 `high`，最高支援 `xhigh`。大多數程式設計與代理工作請先使用預設值，最困難的推理任務再提高等級。

## 計算權杖數 {#count-tokens}

`interaction.usage` 會回報所有躍點的總計。請讀取以下欄位：`total_input_tokens`、`total_cached_tokens`、`total_output_tokens`、`total_thought_tokens` 與 `total_tokens`。

`total_input_tokens` 是每個躍點輸入權杖的總和。每個躍點都會將你的提示詞加上目前已產生的全部內容，作為輸入回傳給模型，因此相同的權杖會在之後的每個躍點中重複計算。例如，一個 1,000 權杖的提示詞產生了 200,000 個權杖的思考與輸出，需要四個 64K 躍點（或在 `gemini-4-carbon` 與 `gemini-4-argon` 上七個 32K 非串流躍點）：

| 躍點 | 傳送給模型的輸入 | 輸入權杖數 |
| :--- | :--- | ---: |
| 1 | 提示詞 | 1,000 |
| 2 | 提示詞 + 躍點 1 | 66,536 |
| 3 | 提示詞 + 躍點 1 與 2 | 132,072 |
| 4 | 提示詞 + 躍點 1 至 3 | 197,608 |
| **總計** |  | **397,216** |

`total_input_tokens` 回報約 397,000 個權杖（重複的躍點輸入會透過隱含快取自動折扣 95%），儘管實際上下文大小僅約 201,000 個權杖：1,000 個權杖的提示詞加上 200,000 個權杖的思考與輸出。


!!! warning " "

      `total_input_tokens` 是每個躍點輸入的總和，不是你的上下文大小。不要用它來決定何時摘要或修剪你的對話歷史記錄（上下文壓縮）。若要估計上下文大小，請將你的提示詞大小（或非串流 SDK 回應上的 `usage.initial_input_tokens`）加上 `total_output_tokens` 與 `total_thought_tokens`。


在串流期間，`interaction.status_update` 與 `interaction.completed` 事件會包含 `usage`（該躍點的累計值，或在背景模式下為整個互動的累計值）。在背景串流或單一前景躍點中，請讀取最新的 `usage` 值，而非將它們相加。在前景串流中，每個躍點都是獨立的互動，因此請將每個躍點最終的 `usage` 相加。

## 了解計費 {#understand-billing}

你需要為每個躍點中的每個權杖付費，包括僅包含思考的躍點。

* **快取折扣：** 隱含快取會將每個躍點中重複的輸入折扣 95%。快取輸入的費用為標準輸入價格的 5%。各模型的費率請參閱[定價](/docs/pricing/)。
* **已取消與失敗的互動：** 你需要為互動結束前已完成的所有工作付費。

## 疑難排解 {#troubleshooting}

| 症狀 | 原因與修正方式 |
| :--- | :--- |
| 輸出在 64K 停止 | 將 `max_output_tokens` 設定為大於 65,536，並使用背景執行或升級 Google GenAI SDK。 |
| 輸出以 `requires_continuation` 狀態停止 | 躍點已達到其單一請求上限，且仍有剩餘預算。請升級 SDK、啟用 `automatic_continuation`，或加入接續迴圈。 |
| 400："store=true is required for background interactions" | 背景執行需要 `store: true`。 |
| 狀態為 `incomplete` 且文字為空 | 模型已將所有權杖用在思考上。請提高 `max_output_tokens` 或降低 `thinking_level`。 |
| 上下文壓縮太早開始 | 你的代理框架或評測工具讀取了 `total_input_tokens`。請參閱[計算權杖數](/docs/long-decode/#count-tokens)。 |

## 限制 {#limitations}

* **較早的 SDK：** 早於 Python 2.34.0、JavaScript 2.32.0、Go 1.77.0、Java 1.80.0 與 .NET 1.28.0 的版本，不會接續前景互動。
* **無長度目標：** 模型不會遵循權杖長度或字數目標。

## 後續步驟 {#next-steps}

* 了解[最新的 Gemini 模型](/docs/latest-model/)
* [背景執行](/docs/background-execution/)
* [思考](/docs/thinking/)
* [使用 GenerateContent API 的長解碼](/docs/long-decode/?generate-content=true)
