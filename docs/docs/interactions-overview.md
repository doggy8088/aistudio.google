# Interactions API

Interactions API 是我們全新的介面，也是使用 Gemini 模型與代理最直接的方式。截至 2026 年 6 月，它已正式推出，是所有新專案的建議介面。

雖然原始的 [`generateContent`](/docs/text-generation/?generate-content=true) API 現在被視為舊版介面，但仍獲得完整支援。

## 為什麼要使用 Interactions API？ {#why-interactions}

*   **開箱即用的新功能**：可選的伺服器端對話狀態（使用 `previous_interaction_id`）、可供除錯與 UI 渲染觀察的執行步驟，以及使用 `background=true` 執行長時間任務的背景執行功能。

*   **成本更低、快取命中率更高**：伺服器端狀態管理讓多輪對話之間的上下文快取更有效率，進而降低 token 成本。

*   **為前沿模型與代理而打造**：專為思考模型、多步驟工具使用與複雜推理流程設計，簡化代理應用程式的建構、除錯與編排過程。

*   **模型與代理共用單一 API**：以一個統一介面直接呼叫 Gemini 模型與代理，例如 Deep Research 與自訂的受管理代理，不必再學習不同的端點或模式。

*   **新功能在此推出**：今後，核心主力系列之外的新模型與新功能，以及新的代理功能與工具，都將在 Interactions API 上推出。


Interactions API 預設會儲存要求，讓你能使用 `previous_interaction_id` 運用伺服器端狀態管理功能。你也可以設定 `store=false`，改採無狀態行為。詳情請參閱[資料保留](/docs/interactions-overview/#data-storage-retention)一節。

## 開始使用 {#get-started}

*   **設定你的程式設計代理**：連接 **Gemini Docs MCP** 並安裝 `gemini-api-dev` 技能，讓你的助理能直接存取最新的開發人員文件與最佳做法。[設定你的程式設計代理 →](/docs/coding-agents/)

*   **從 `generateContent` 遷移**：如果你已有現成的整合，請依照[遷移指南](/docs/migrate-to-interactions/)轉換到 Interactions API。

*   **開始使用**：請參閱 [Interactions API 開始使用指南](/docs/get-started/)。


### 功能指南 {#feature-guides}

透過下列指南探索 Interactions API 的各項功能。你可以使用這些頁面上的切換開關，在 generateContent 與 Interactions API 之間切換：

*   [文字生成](/docs/text-generation/)
*   [圖片生成](/docs/image-generation/)
*   [圖片理解](/docs/image-understanding/)
*   [音訊理解](/docs/audio/)
*   [影片理解](/docs/video-understanding/)
*   [文件處理](/docs/document-processing/)
*   [函式呼叫](/docs/function-calling/)
*   [結構化輸出](/docs/structured-output/)
*   [Deep Research 代理](/docs/deep-research/)
*   [Flex 推論](/docs/flex-inference/)
*   [Priority 推論](/docs/priority-inference/)

## Interactions API 的運作方式 {#how-it-works}

Interactions API 以一項核心資源為中心：[**`Interaction`**](/api-reference/interactions-api/#Resource:Interaction)。`Interaction` 代表對話或任務中的一個完整輪次，本身即是一筆工作階段紀錄，以時間順序排列的**執行步驟**序列保存一次互動的完整歷程。這些步驟包括模型的思考過程、伺服器端或用戶端工具呼叫與結果（例如 `function_call` 與 `function_result`），以及最終的 `model_output`。儲存下來的資源（透過 `interactions.get` 取得）還包含 `user_input` 步驟，以提供完整上下文；不過 `interactions.create` 的回應只會回傳模型產生的步驟。

當你呼叫 [`interactions.create`](/api-reference/interactions-api/create-interaction/) 時，就是在建立一筆新的 `Interaction` 資源：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Tell me a short story about a time-traveling lighthouse."
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI();

      const interaction = await client.interactions.create({
        model: "gemini-4-hydrogen",
        input: "Tell me a short story about a time-traveling lighthouse.",
      });

      console.log(interaction.output_text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Tell me a short story about a time-traveling lighthouse."))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println(interaction.outputText().orElse(""));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Tell me a short story about a time-traveling lighthouse."),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if res.Interaction.OutputText != nil {
              fmt.Println(*res.Interaction.OutputText)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Tell me a short story about a time-traveling lighthouse."
        }'
      ```

=== "CLI"

      ```bash
      gemini-api generate "Tell me a short story about a time-traveling lighthouse."
      ```


### 伺服器端狀態管理 {#server-side-state}

在後續呼叫中，你可以使用已完成互動的 `id`，透過 `previous_interaction_id` 參數延續對話。伺服器會以這個 ID 取得對話歷程，你就不必重新傳送整段聊天紀錄：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      # 1. First turn
      turn1 = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Hi, my name is Phil."
      )

      # 2. Second turn (chained using previous_interaction_id)
      turn2 = client.interactions.create(
          model="gemini-4-hydrogen",
          input="What is my name?",
          previous_interaction_id=turn1.id
      )

      print(turn2.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI();

      // 1. First turn
      const turn1 = await client.interactions.create({
        model: "gemini-4-hydrogen",
        input: "Hi, my name is Phil.",
      });

      // 2. Second turn (chained using previous_interaction_id)
      const turn2 = await client.interactions.create({
        model: "gemini-4-hydrogen",
        input: "What is my name?",
        previous_interaction_id: turn1.id,
      });

      console.log(turn2.output_text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = new Client();

      // 1. First turn
      Interaction turn1 =
          client
              .interactions
              .create(
                  CreateInteractionRequestBody.of(
                      CreateModelInteraction.builder()
                          .model(Model.of("gemini-4-hydrogen"))
                          .input(InteractionsInput.of("Hi, my name is Phil."))
                          .build()))
              .interaction()
              .get();

      // 2. Second turn (chained using previousInteractionId)
      Interaction turn2 =
          client
              .interactions
              .create(
                  CreateInteractionRequestBody.of(
                      CreateModelInteraction.builder()
                          .model(Model.of("gemini-4-hydrogen"))
                          .input(InteractionsInput.of("What is my name?"))
                          .previousInteractionId(turn1.id().get())
                          .build()))
              .interaction()
              .get();

      System.out.println(turn2.outputText().orElse(""));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          // 1. First turn
          turn1, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Hi, my name is Phil."),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          // 2. Second turn (chained using PreviousInteractionID)
          turn2, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:                 interactions.Model("gemini-4-hydrogen"),
                  Input:                 interactions.NewInteractionsInput("What is my name?"),
                  PreviousInteractionID: turn1.Interaction.ID,
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if turn2.Interaction.OutputText != nil {
              fmt.Println(*turn2.Interaction.OutputText)
          }
      }
      ```

=== "REST"

      ```bash
      # Replace PREVIOUS_INTERACTION_ID with the id returned from the first turn
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "What is my name?",
          "previous_interaction_id": "PREVIOUS_INTERACTION_ID"
        }'
      ```

=== "CLI"

      ```bash
      TURN1_ID=$(gemini-api generate "Hi, my name is Phil." --stream=false --jq '.id')
      gemini-api generate "What is my name?" --previous-interaction-id "$TURN1_ID"
      ```


`previous_interaction_id` 參數只會透過 `previous_interaction_id` 保留對話歷程（輸入與輸出）。其他參數的作用範圍僅限於單次互動，只適用於你目前正在產生的那一次互動：

-   `tools`
-   `system_instruction`
-   `generation_config`（包括 `thinking_level`、`temperature` 等）

這表示，如果你希望這些參數生效，就必須在每一次新的互動中重新指定。伺服器端狀態管理是可選功能；你也可以在每次要求中傳送完整的對話歷程，以無狀態模式運作。

### 資料儲存與保留 {#data-storage-retention}

API 預設會儲存所有 Interaction 物件（`store=true`），以便簡化伺服器端狀態管理功能（搭配 `previous_interaction_id`）、背景執行（使用 `background=true`）與可觀察性等用途。

-   **付費層級**：系統會保留互動紀錄 **55 天**。
-   **免費層級**：系統會保留互動紀錄 **1 天**。

如果你不希望如此，可以在要求中設定 `store=false`。這項控制與狀態管理相互獨立，任何互動都可以選擇不儲存。不過請注意，`store=false` 與[背景執行](/docs/background-execution/)不相容，也無法在後續輪次中使用 `previous_interaction_id`。

對於付費層級專案，你可以在 [AI Studio](https://aistudio.google.com/logs) 中設定保留期間，讓系統在 7、14、28 或 55 天後，自動將紀錄標示為要從專案儲存空間中刪除。保留期間較短，可能會影響過去對話的擷取。

你隨時都可以使用 [`delete`](/api-reference/interactions-api/delete-interaction/) 方法以程式化方式刪除已儲存的互動，只需提供互動 ID。你也可以在 [AI Studio](https://aistudio.google.com/logs) 中查看及管理已儲存的互動紀錄，包括從專案儲存空間中刪除。

保留期間屆滿後，你的資料將自動刪除。

Interaction 物件會依照[條款](/docs/terms/)處理。

### 在 AI Studio 中查看互動 {#viewing-interactions-in-ai-studio}

對於付費層級專案，API 會儲存以 `store=true` 執行的 Interactions API 要求。你可以直接從 [Google AI Studio 的 Logs 頁面](https://aistudio.google.com/logs)查看。詳情請參閱 [Logs 指南](/docs/logs-datasets/)。

## 最佳做法 {#best-practices}

*   **快取命中率**：有狀態與無狀態模式都支援隱式快取（請參閱[快速入門](/docs/get-started/#4-multi-turn-conversations)）。使用 `previous_interaction_id`（有狀態）延續對話，能讓系統更容易運用隱式快取處理對話歷程，進而提升效能並降低成本。
*   **混用互動**：你可以在一段對話中靈活混用代理互動與模型互動。例如，先使用 Deep Research 代理這類專門代理進行初步資料蒐集，再使用標準 Gemini 模型處理摘要或重新格式化等後續任務，並以 `previous_interaction_id` 將這些步驟串連起來。

## 支援的模型與代理 {#supported-models-agents}

| 模型名稱 | 類型 | 模型 ID |
| :--- | :--- | :--- |
| Gemini 4 Carbon | Model | `gemini-4-carbon` |
| Gemini 4 Argon | Model | `gemini-4-argon` |
| Gemini 4 Neon | Model | `gemini-4-neon` |
| Gemini 4 Hydrogen | Model | `gemini-4-hydrogen` |
| Gemini 3.8 Flash | Model | `gemini-3.8-flash` |
| Gemini 3.6 Flash | Model | `gemini-3.6-flash` |
| Gemini 3.1 Pro Preview | Model | `gemini-3.1-pro-preview` |
| Gemini 3.5 Flash-Lite | Model | `gemini-3.5-flash-lite` |
| Gemini 3.1 Flash-Lite | Model | `gemini-3.1-flash-lite` |
| Gemini 3 Flash Preview | Model | `gemini-3-flash-preview` |
| Gemini 2.5 Pro | Model | `gemini-2.5-pro` |
| Gemini 2.5 Flash | Model | `gemini-2.5-flash` |
| Gemini 2.5 Flash-lite | Model | `gemini-2.5-flash-lite` |
| Gemini 3 Pro Image | Model | `gemini-3-pro-image` |
| Gemini 3.1 Flash Image | Model | `gemini-3.1-flash-image` |
| Gemini 3.1 Flash TTS Preview | Model | `gemini-3.1-flash-tts-preview` |
| Gemma 4 31B IT | Model | `gemma-4-31b-it` |
| Gemma 4 26B MoE IT | Model | `gemma-4-26b-a4b-it` |
| Lyria 3.5 | Model | `lyria-3.5` |
| Lyria 3 Clip Preview | Model | `lyria-3-clip-preview` |
| Lyria 3 Pro Preview | Model | `lyria-3-pro-preview` |
| Deep Research Preview | Agent | `deep-research-preview-04-2026` |
| Deep Research Preview | Agent | `deep-research-max-preview-04-2026` |
| Antigravity Preview | Agent | `antigravity-preview-09-2026` |

## SDK {#sdk}

你可以使用最新版的 Google GenAI SDK 存取 Interactions API。

*   在 Python 上，是 `google-genai` 套件（從 `2.3.0` 版起）。
*   在 JavaScript 上，是 `@google/genai` 套件（從 `2.3.0` 版起）。
*   在 Go 上，是 `google.golang.org/genai` 套件。
*   在 Java 上，是 `com.google.genai:google-genai` 套件。

如需進一步瞭解如何安裝 SDK，請參閱 [Libraries](/docs/libraries/) 頁面。

## 限制 {#limitations}

*   **遠端 MCP**：Gemini 3 尚不支援遠端 MCP，此功能即將推出。
*   **多輪模型相容性**：在一段對話中混用不同模型時（不論有狀態或無狀態），後續模型必須能將先前模型的輸出模態作為輸入。例如，如果你使用 `gemini-3.1-flash-image` 產生圖片，就無法用不接受圖片輸入的模型（例如純文字模型，或 Lyria 這類音樂生成模型）延續該段對話。

下列功能已由 [`generateContent`](/docs/text-generation/?generate-content=true) API 支援，但在 Interactions API 中**尚未提供**：

*   **[Batch API](/docs/batch-api/)**
*   **[自動函式呼叫（Python）](/docs/function-calling/?example=meeting&generate-content=true#automatic_function_calling_python_only)**
    *   **[顯式快取](/docs/caching/)**：請注意，Interactions API 可透過 `previous_interaction_id` 使用伺服器端隱式快取。


## 意見回饋 {#feedback}

你的意見回饋對 Interactions API 的發展至關重要。歡迎在我們的 [Google AI Developer Community Forum](https://discuss.ai.google.dev/c/gemini-api/4) 分享你的想法、回報錯誤或提出功能要求。

## 後續步驟 {#whats-next}

*   試試 [Interactions API 快速入門筆記本](https://colab.sandbox.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_interactions_api.ipynb)。
    *   進一步瞭解 [Gemini Deep Research 代理](/docs/deep-research/)。
