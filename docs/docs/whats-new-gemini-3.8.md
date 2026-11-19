# Gemini 3.8 Flash 的新功能

Gemini 3.8 Flash (`gemini-3.8-flash`) 是我們最聰明的 Flash 模型，專為長時間軟體工程、自主代理與複雜的企業工作流程打造。

本指南說明 Gemini 3.8 Flash 的新功能、API 變更、程式碼範例與遷移指引。

## 新模型 {#new-model}

| 模型 | 模型 ID | 預設思考層級 | 定價 | 說明 |
| :--- | :--- | :---: | --- | :--- |
| Gemini 3.8 Flash | `gemini-3.8-flash` | `medium` | 3.8 Flash 在年底前提供優惠價格：輸入 tokens 每 1M 為 $0.75、輸出 tokens 每 1M 為 $3.75；詳情請參閱[定價](/docs/pricing/)。 | 我們最聰明的 Flash 模型，專為長時間軟體工程、自主代理與複雜的企業工作流程打造。 |

Gemini 3.8 Flash 支援 1Mtokens上下文視窗、64k 輸出 token 上限、可調整的思考層級（`low`、`medium`、`high`），以及相同的整套內建工具。

如需完整規格，請參閱 [Gemini 3.8 Flash 模型頁面](/docs/models/gemini-3.8-flash/)。如需優惠定價詳情，請參閱本頁後段的[定價章節](/docs/whats-new-gemini-3.8/#pricing)，或[定價頁面](/docs/pricing/#gemini-3.8-flash)。

## 快速入門 {#quickstart}


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-3.8-flash",
          input="Write a three.js script that renders a realistic 3D black hole."
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        model: "gemini-3.8-flash",
        input: "Write a three.js script that renders a realistic 3D black hole.",
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
              .model(Model.of("gemini-3.8-flash"))
              .input(
                  InteractionsInput.of(
                      "Write a three.js script that renders a realistic 3D black hole."))
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
                  Model: interactions.Model("gemini-3.8-flash"),
                  Input: interactions.NewInteractionsInput("Write a three.js script that renders a realistic 3D black hole."),
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
      curl "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "model": "gemini-3.8-flash",
          "input": "Write a three.js script that renders a realistic 3D black hole."
        }'
      ```


## Gemini 3.8 Flash 的新功能 {#whats-new-gemini-3-8-flash}

* **長時間軟體工程**：在真實世界的程式設計評測基準、複雜的多檔案重構與確定性工具執行上，交出亮眼成績。詳情請參閱[評測方法](https://deepmind.google/models/evals-methodology/gemini-3-8-flash/)。
* **自主代理**：讓你建立具備韌性的多步驟規劃與工具協作工作流程，大幅減少迴圈失敗與錯誤。
* **複雜的企業工作流程**：在要求嚴苛的領域任務與大規模資料管線上，提供卓越的正確率、深度推理與高度的事實嚴謹性。
* **Managed Agents 的預設模型**：受管理代理的預設代理 [Antigravity 代理](/docs/antigravity-agent/) 現在使用 Gemini 3.8 Flash。[Antigravity SDK](https://antigravity.google/docs/sdk/overview/) 也預設使用 Gemini 3.8 Flash。
* **優惠定價**：Gemini 3.8 Flash 在 2026 年 12 月 31 日前提供優惠價格，輸入 tokens 每 1M 為 $0.75、輸出 tokens 每 1M 為 $3.75。標準定價（輸入 tokens 每 1M $1.50、輸出 tokens 每 1M $7.50）將自 2027 年 1 月 1 日起生效。

Gemini 3.8 Flash 在執行時間較長與較複雜的任務時，可能會依設計使用更多 token。為了在困難的多步驟目標上交出更高品質的結果，模型會採取較小的推理步驟、反覆呼叫工具，並在過程中驗證自己的工作。並非每個工作流程都需要這種程度的驗證。對於日常任務，你可以降低[推理](/docs/whats-new-gemini-3.8/#understanding-reasoning-levels)投入，以減少 token 消耗。或者，你也可以繼續使用仍受支援的 Gemini 3.6 Flash。

## 瞭解推理層級 {#understanding-reasoning-levels}

Gemini 3.8 Flash 讓你能透過調整模型的思考層級，彈性控制延遲與智慧程度：

* **低思考投入**：縮短回答時間，適合延遲敏感的任務，例如事件回應管線、即時聊天、撰寫草稿與快速資料分析。
* **中（預設）**：在大多數任務上品質最佳。建議用於複雜程式碼與代理情境，首次嘗試的正確率更高。
* **高思考投入**：將模型的推理與工具協作能力發揮到極致。最適合深度推理、數學與困難的多步驟任務。

注意：Gemini 3.8 Flash 不支援 `minimal` 思考層級，使用時會傳回錯誤。

下列範例針對複雜的程式碼分析要求，將 `thinking_level` 設為 `medium`：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-3.8-flash",
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
        model: "gemini-3.8-flash",
        input: "Analyze this payment processing pipeline for race conditions during retry attempts and rewrite the transaction locks safely.",
        generation_config: {
          thinking_level: "medium"
        }
      });

      console.log(interaction.output_text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.GenerationConfig;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ThinkingLevel;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-3.8-flash"))
              .input(
                  InteractionsInput.of(
                      "Analyze this payment processing pipeline for race conditions during retry attempts and rewrite the transaction locks safely."))
              .generationConfig(
                  GenerationConfig.builder()
                      .thinkingLevel(ThinkingLevel.MEDIUM) // Balanced reasoning effort for complex tasks
                      .build())
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
                  Model: interactions.Model("gemini-3.8-flash"),
                  Input: interactions.NewInteractionsInput("Analyze this payment processing pipeline for race conditions during retry attempts and rewrite the transaction locks safely."),
                  GenerationConfig: &interactions.GenerationConfig{
                      ThinkingLevel: interactions.ThinkingLevelMedium.ToPointer(), // Balanced reasoning effort for complex tasks
                  },
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
      curl "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "model": "gemini-3.8-flash",
          "input": "Analyze this payment processing pipeline for race conditions during retry attempts and rewrite the transaction locks safely.",
          "generation_config": {
            "thinking_level": "medium"
          }
        }'
      ```


## 更新的 Antigravity 代理 {#updated-antigravity-agent}

由於效能與推理能力有所提升，Gemini Managed Agents 中的 [Antigravity 代理](/docs/antigravity-agent/) 現在預設以 Gemini 3.8 Flash 建構。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input=(
              "Audit https://web.dev for performance, Core Web Vitals, and SEO. "
              "Query Google's PageSpeed Insights API for both Mobile and Desktop strategies. "
              "Check search indexing with Google Search for site:web.dev. "
              "Format the output as a side-by-side scorecard table with prioritized fixes."
          ),
          environment="remote",
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await client.interactions.create({
        agent: "antigravity-preview-09-2026",
        input: "Audit https://web.dev for performance, Core Web Vitals, and SEO. Query Google's PageSpeed Insights API for both Mobile and Desktop strategies. Check search indexing with Google Search for site:web.dev. Format the output as a side-by-side scorecard table with prioritized fixes.",
        environment: "remote",
      }, { timeout: 300000 });

      console.log(interaction.output_text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent(AgentOption.of("antigravity-preview-09-2026"))
              .input(
                  InteractionsInput.of(
                      "Audit https://web.dev for performance, Core Web Vitals, and SEO. "
                          + "Query Google's PageSpeed Insights API for both Mobile and Desktop strategies. "
                          + "Check search indexing with Google Search for site:web.dev. "
                          + "Format the output as a side-by-side scorecard table with prioritized fixes."))
              .environment(CreateAgentInteractionEnvironment.of("remote"))
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
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent: interactions.AgentOption("antigravity-preview-09-2026"),
                  Input: interactions.NewInteractionsInput(
                      "Audit https://web.dev for performance, Core Web Vitals, and SEO. " +
                          "Query Google's PageSpeed Insights API for both Mobile and Desktop strategies. " +
                          "Check search indexing with Google Search for site:web.dev. " +
                          "Format the output as a side-by-side scorecard table with prioritized fixes.",
                  ),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment("remote")),
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

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Audit https://web.dev for performance, Core Web Vitals, and SEO. Query Google'\''s PageSpeed Insights API for both Mobile and Desktop strategies. Check search indexing with Google Search for site:web.dev. Format the output as a side-by-side scorecard table with prioritized fixes.",
          "environment": "remote"
      }'
      ```


底層的 Gemini 模型[可以設定](/docs/antigravity-agent/#model-selection)，方式是使用 `agent_config`。

## 遷移檢查清單 {#migration-checklist}


!!! note " "

      **使用程式設計代理自動完成這項遷移。** 如果你使用的程式設計代理支援 skills（例如 Antigravity），
      請安裝 [gemini-api-dev skill](/docs/coding-agents/#gemini-api-dev) 並執行：

      `/gemini-api-dev migrate my app to Gemini 3.8 Flash`


### 遷移至 gemini-3.8-flash {#migrate-to-gemini-3-8-flash}

* **更新 Model ID**：將目標模型字串改為 `gemini-3.8-flash`。
* **設定思考層級**：將 `thinking_budget` 改為字串列舉 `thinking_level`。請注意，Gemini 3.8 Flash 不支援 `minimal`；請選擇 `low`、`medium`（預設）或 `high`。
* **套用 Gemini 3 API 參數變更**：移除已淘汰的取樣參數（`temperature`、`top_p`、`top_k`）、`candidate_count`（Gemini 3 及後續版本不支援），以及預填的模型回合。請參閱 [Gemini 3.6 API 變更與參數更新](/docs/whats-new-gemini-3.6/#api-changes-and-parameter-updates)。
* **落實回合驗證規則**：將多回合對話標準化為使用伺服器端的 `previous_interaction_id`，並移除預填的模型回合。
* **稽核函式呼叫**：
  * 將多模態素材放在回應酬載內。
  * 使用 `\n\n` 格式化行內指令。
  * 如果你看到與工具前文字相關的 `Malformed_Function_Call` 錯誤，請參閱[工具前文字需求的因應方式](/docs/function-calling/#workarounds-for-pre-tool-text-requirements)。
  * 僅限使用 generateContent API 時：確保所有 `FunctionResponse` 物件都包含 `call_id` 與 `name`。

* **Gemini 3 基本要求**：如需 SDK 更新與思考簽章保留的相關資訊，請參閱[思考簽章](/docs/thinking/#signatures)。

## 定價 {#pricing}

在 2026 年 12 月 31 日前，透過 Google AI Studio 與 Gemini Enterprise Agent Platform 使用 Gemini 3.8 Flash 與 Gemini 3.6 Flash，即可享有優惠定價。標準定價將自 2027 年 1 月 1 日起生效。如需完整的定價級距，請參閱[定價頁面](/docs/pricing/#gemini-3.8-flash)。

## 其他模型 {#other-models}

* [選擇模型](/docs/choosing-a-model/)
* [最新 Gemini 模型](/docs/latest-model/)
* [Gemini 4 Neon](/docs/whats-new-gemini-4-neon/)
* [Gemini 4 Hydrogen](/docs/whats-new-gemini-4-hydrogen/)
* [Gemini 4 Carbon](/docs/whats-new-gemini-4-carbon/)
* [Gemini 4 Argon](/docs/whats-new-gemini-4-argon/)
* [Gemini 3.6 Flash 與 3.5 Flash-Lite](/docs/whats-new-gemini-3.6/)
* [查看所有模型](/docs/models/)

## 後續步驟 {#whats-next}

* 在 [Models Overview](/docs/models/) 查閱 API 規格。
* 在 [Interactions API Overview](/docs/interactions-overview/) 探索多代理協作。
* 在 [Google AI Studio](https://aistudio.google.com/prompts/new_chat?model=gemini-3.8-flash) 測試並優化提示詞。
