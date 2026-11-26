# Gemini Deep Research 代理


!!! note " "

      此功能目前為[預覽版](/docs/models/#preview)。Deep Research 代理僅能透過 [Interactions API](/docs/interactions-overview/) 使用，無法透過 `generate_content` 存取。


Gemini Deep Research 代理能自主規劃、執行並彙整多步驟的研究任務。它以 Gemini 為核心，能在複雜的資訊版圖中穿梭探索，產出附有引用來源的詳細報告。新功能讓你能與代理協作規劃、透過 MCP 伺服器連接外部工具、加入圖表等視覺化內容，並直接將文件作為輸入提供給代理。

研究任務需要反覆搜尋與閱讀，可能需要數分鐘才能完成。你必須使用背景執行（設定 `background=true`），以非同步方式執行代理，並輪詢結果或串流接收更新。詳情請參閱[處理長時間執行的任務](/docs/deep-research/#long-running-tasks)。

以下範例示範如何於背景啟動研究任務並輪詢結果。


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          input="Research the history of Google TPUs.",
          agent="deep-research-preview-04-2026",
          background=True,
      )

      print(f"Research started: {interaction.id}")

      while True:
          interaction = client.interactions.get(interaction.id)
          if interaction.status == "completed":
              print(interaction.steps[-1].content[0].text)
              break
          elif interaction.status == "failed":
              print(f"Research failed: {interaction.error}")
              break
          time.sleep(10)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await client.interactions.create({
          input: 'Research the history of Google TPUs.',
          agent: 'deep-research-preview-04-2026',
          background: true
      });

      console.log(`Research started: ${interaction.id}`);

      while (true) {
          const result = await client.interactions.get(interaction.id);
          if (result.status === 'completed') {
              console.log(result.output_text);
              break;
          } else if (result.status === 'failed') {
              console.log(`Research failed: ${JSON.stringify(result.errors)}`);
              break;
          }
          await new Promise(resolve => setTimeout(resolve, 10000));
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionStatus;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.GetInteractionByIdRequest;
      import java.util.Collections;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(InteractionsInput.of("Research the history of Google TPUs."))
              .background(true)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println("Research started: " + interaction.id().orElse(""));

      while (true) {
        interaction =
            client.interactions
                .get(GetInteractionByIdRequest.builder().id(interaction.id().get()).build())
                .interaction()
                .get();
        if (InteractionStatus.COMPLETED.equals(interaction.status().orElse(null))) {
          System.out.println(interaction.outputText().orElse(""));
          break;
        } else if (InteractionStatus.FAILED.equals(interaction.status().orElse(null))) {
          System.out.println("Research failed: " + interaction.errors().orElse(Collections.emptyList()));
          break;
        }
        Thread.sleep(10000);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "time"

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
                  Agent:      interactions.AgentOption("deep-research-preview-04-2026"),
                  Input:      interactions.NewInteractionsInput("Research the history of Google TPUs."),
                  Background: genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          interaction := res.Interaction
          if interaction.ID != nil {
              fmt.Printf("Research started: %s\n", *interaction.ID)
          }

          for {
              getRes, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                  ID: *interaction.ID,
              })
              if err != nil {
                  log.Fatal(err)
              }
              interaction = getRes.Interaction
              if interaction.Status == interactions.InteractionStatusCompleted {
                  if interaction.OutputText != nil {
                      fmt.Println(*interaction.OutputText)
                  }
                  break
              } else if interaction.Status == interactions.InteractionStatusFailed {
                  fmt.Printf("Research failed: %v\n", interaction.Errors)
                  break
              }
              time.Sleep(10 * time.Second)
          }
      }
      ```

=== "REST"

      ```bash
      # 1. Start the research task
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "input": "Research the history of Google TPUs.",
          "agent": "deep-research-preview-04-2026",
          "background": true
      }'

      # 2. Poll for results (Replace INTERACTION_ID)
      # curl -X GET "https://generativelanguage.googleapis.com/v1beta/interactions/INTERACTION_ID" \
      # -H "Api-Revision: 2026-05-20" \
      # -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "CLI"

      ```bash
      INTERACTION_ID=$(gemini-api agent run "Research the history of Google TPUs." \
        --agent deep-research-preview-04-2026 --background --stream=false --jq '.id')
      echo "Research started: $INTERACTION_ID"
      # Re-run until the status is "completed", then print the report.
      # Note: agent status exits with code 1 if the interaction is "failed" or "cancelled"
      # (append || true in scripts using set -e).
      gemini-api agent status "$INTERACTION_ID" --jq '.status'
      gemini-api agent status "$INTERACTION_ID" --jq '[.steps[]? | select(.type == "model_output") | .content[]? | select(.type == "text") | .text] | join("")'
      ```


## 支援的版本 {#supported-models}

Deep Research 代理共有兩個版本：

* **Deep Research**（`deep-research-preview-04-2026`）：著重速度與效率，非常適合串流回傳至用戶端 UI。
* **Deep Research Max**（`deep-research-max-preview-04-2026`）：提供最完整的涵蓋範圍，適合自動化的情境蒐集與彙整。

## 協作規劃 {#collaborative-planning}


!!! note " "

      預覽版：協作規劃讓你能在執行前檢視並調整研究計畫。


協作規劃讓你在代理開始工作之前，先掌握研究方向。啟用後，代理會先回傳一份擬定的研究計畫，而非立即執行。你接著可以透過多輪互動來檢視、修改或核准這份計畫。

### 步驟 1：請求計畫 {#step-1-request-a-plan}

在第一次互動中設定 `collaborative_planning=True`，代理便會回傳研究計畫，而非完整報告。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # First interaction: request a research plan
      plan_interaction = client.interactions.create(
          agent="deep-research-preview-04-2026",
          input="Do some research on Google TPUs.",
          agent_config={
              "type": "deep-research",
              "thinking_summaries": "auto",
              "collaborative_planning": True,
          },
          background=True,
      )

      # Wait for and retrieve the plan
      while (result := client.interactions.get(id=plan_interaction.id)).status != "completed":
          time.sleep(5)
      print(result.steps[-1].content[0].text)
      ```

=== "JavaScript"

      ```javascript
      const planInteraction = await client.interactions.create({
          agent: 'deep-research-preview-04-2026',
          input: 'Do some research on Google TPUs.',
          agent_config: {
              type: 'deep-research',
              thinking_summaries: 'auto',
              collaborative_planning: true
          },
          background: true
      });

      let result;
      while ((result = await client.interactions.get(planInteraction.id)).status !== 'completed') {
          await new Promise(r => setTimeout(r, 5000));
      }
      console.log(result.steps.at(-1).content[0].text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.DeepResearchAgentConfig;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionStatus;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.ThinkingSummaries;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.GetInteractionByIdRequest;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      // First interaction: request a research plan
      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(InteractionsInput.of("Do some research on Google TPUs."))
              .agentConfig(
                  DeepResearchAgentConfig.builder()
                      .thinkingSummaries(ThinkingSummaries.AUTO)
                      .collaborativePlanning(true)
                      .build())
              .background(true)
              .build();

      Interaction planInteraction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      // Wait for and retrieve the plan
      Interaction result;
      while (true) {
        result =
            client.interactions
                .get(GetInteractionByIdRequest.builder().id(planInteraction.id().get()).build())
                .interaction()
                .get();
        if (InteractionStatus.COMPLETED.equals(result.status().orElse(null))) {
          break;
        }
        Thread.sleep(5000);
      }
      System.out.println(result.outputText().orElse(""));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "time"

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

          agentCfg := interactions.NewCreateAgentInteractionAgentConfig(interactions.DeepResearchAgentConfig{
              ThinkingSummaries:     interactions.ThinkingSummariesAuto.ToPointer(),
              CollaborativePlanning: genai.Ptr(true),
          })

          // First interaction: request a research plan
          planRes, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("deep-research-preview-04-2026"),
                  Input:       interactions.NewInteractionsInput("Do some research on Google TPUs."),
                  AgentConfig: &agentCfg,
                  Background:  genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          // Wait for and retrieve the plan
          var result *interactions.Interaction
          for {
              getRes, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                  ID: *planRes.Interaction.ID,
              })
              if err != nil {
                  log.Fatal(err)
              }
              result = getRes.Interaction
              if result.Status == interactions.InteractionStatusCompleted {
                  break
              }
              time.Sleep(5 * time.Second)
          }
          if result.OutputText != nil {
              fmt.Println(*result.OutputText)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "deep-research-preview-04-2026",
          "input": "Do some research on Google TPUs.",
          "agent_config": {
              "type": "deep-research",
              "thinking_summaries": "auto",
              "collaborative_planning": true
          },
          "background": true
      }'
      ```

=== "CLI"

      ```bash
      PLAN_ID=$(gemini-api agent run "Do some research on Google TPUs." \
        --agent deep-research-preview-04-2026 --background --stream=false \
        --body '{"agent_config":{"type":"deep-research","thinking_summaries":"auto","collaborative_planning":true}}' \
        --jq '.id')
      # Once the status is "completed", print the proposed plan
      gemini-api agent status "$PLAN_ID" --jq '[.steps[]? | select(.type == "model_output") | .content[]? | select(.type == "text") | .text] | join("")'
      ```


### 步驟 2：調整計畫（選用） {#step-2-refine-the-plan-optional}

使用 `previous_interaction_id` 繼續對話，反覆調整計畫。將 `collaborative_planning=True` 保持不變，即可停留在規劃模式。


=== "Python"

      ```python
      # Second interaction: refine the plan
      refined_plan = client.interactions.create(
          agent="deep-research-preview-04-2026",
          input="Focus more on the differences between Google TPUs and competitor hardware, and less on the history.",
          agent_config={
              "type": "deep-research",
              "thinking_summaries": "auto",
              "collaborative_planning": True,
          },
          previous_interaction_id=plan_interaction.id,
          background=True,
      )

      while (result := client.interactions.get(id=refined_plan.id)).status != "completed":
          time.sleep(5)
      print(result.steps[-1].content[0].text)
      ```

=== "JavaScript"

      ```javascript
      const refinedPlan = await client.interactions.create({
          agent: 'deep-research-preview-04-2026',
          input: 'Focus more on the differences between Google TPUs and competitor hardware, and less on the history.',
          agent_config: {
              type: 'deep-research',
              thinking_summaries: 'auto',
              collaborative_planning: true
          },
          previous_interaction_id: planInteraction.id,
          background: true
      });

      let result;
      while ((result = await client.interactions.get(refinedPlan.id)).status !== 'completed') {
          await new Promise(r => setTimeout(r, 5000));
      }
      console.log(result.steps.at(-1).content[0].text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.DeepResearchAgentConfig;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionStatus;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.ThinkingSummaries;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.GetInteractionByIdRequest;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
      String planInteractionId = "PLAN_INTERACTION_ID";

      // Second interaction: refine the plan
      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(
                  InteractionsInput.of(
                      "Focus more on the differences between Google TPUs and competitor hardware, and less on the history."))
              .agentConfig(
                  DeepResearchAgentConfig.builder()
                      .thinkingSummaries(ThinkingSummaries.AUTO)
                      .collaborativePlanning(true)
                      .build())
              .previousInteractionId(planInteractionId)
              .background(true)
              .build();

      Interaction refinedPlan =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      Interaction result;
      while (true) {
        result =
            client.interactions
                .get(GetInteractionByIdRequest.builder().id(refinedPlan.id().get()).build())
                .interaction()
                .get();
        if (InteractionStatus.COMPLETED.equals(result.status().orElse(null))) {
          break;
        }
        Thread.sleep(5000);
      }
      System.out.println(result.outputText().orElse(""));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "time"

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

          planInteractionID := "PLAN_INTERACTION_ID"
          agentCfg := interactions.NewCreateAgentInteractionAgentConfig(interactions.DeepResearchAgentConfig{
              ThinkingSummaries:     interactions.ThinkingSummariesAuto.ToPointer(),
              CollaborativePlanning: genai.Ptr(true),
          })

          // Second interaction: refine the plan
          refinedRes, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:                 interactions.AgentOption("deep-research-preview-04-2026"),
                  Input:                 interactions.NewInteractionsInput("Focus more on the differences between Google TPUs and competitor hardware, and less on the history."),
                  AgentConfig:           &agentCfg,
                  PreviousInteractionID: genai.Ptr(planInteractionID),
                  Background:            genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          var result *interactions.Interaction
          for {
              getRes, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                  ID: *refinedRes.Interaction.ID,
              })
              if err != nil {
                  log.Fatal(err)
              }
              result = getRes.Interaction
              if result.Status == interactions.InteractionStatusCompleted {
                  break
              }
              time.Sleep(5 * time.Second)
          }
          if result.OutputText != nil {
              fmt.Println(*result.OutputText)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "deep-research-preview-04-2026",
          "input": "Focus more on the differences between Google TPUs and competitor hardware, and less on the history.",
          "agent_config": {
              "type": "deep-research",
              "thinking_summaries": "auto",
              "collaborative_planning": true
          },
          "previous_interaction_id": "PREVIOUS_INTERACTION_ID",
          "background": true
      }'
      ```


### 步驟 3：核准並執行 {#step-3-approve-and-execute}

將 `collaborative_planning=False`（或省略此參數）即可核准計畫並開始研究。


=== "Python"

      ```python
      # Third interaction: approve the plan and kick off research
      final_report = client.interactions.create(
          agent="deep-research-preview-04-2026",
          input="Plan looks good!",
          agent_config={
              "type": "deep-research",
              "thinking_summaries": "auto",
              "collaborative_planning": False,
          },
          previous_interaction_id=refined_plan.id,
          background=True,
      )

      while (result := client.interactions.get(id=final_report.id)).status != "completed":
          time.sleep(5)
      print(result.steps[-1].content[0].text)
      ```

=== "JavaScript"

      ```javascript
      const finalReport = await client.interactions.create({
          agent: 'deep-research-preview-04-2026',
          input: 'Plan looks good!',
          agent_config: {
              type: 'deep-research',
              thinking_summaries: 'auto',
              collaborative_planning: false
          },
          previous_interaction_id: refinedPlan.id,
          background: true
      });

      let result;
      while ((result = await client.interactions.get(finalReport.id)).status !== 'completed') {
          await new Promise(r => setTimeout(r, 5000));
      }
      console.log(result.steps.at(-1).content[0].text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.DeepResearchAgentConfig;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionStatus;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.ThinkingSummaries;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.GetInteractionByIdRequest;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
      String refinedPlanId = "REFINED_PLAN_ID";

      // Third interaction: approve the plan and kick off research
      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(InteractionsInput.of("Plan looks good!"))
              .agentConfig(
                  DeepResearchAgentConfig.builder()
                      .thinkingSummaries(ThinkingSummaries.AUTO)
                      .collaborativePlanning(false)
                      .build())
              .previousInteractionId(refinedPlanId)
              .background(true)
              .build();

      Interaction finalReport =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      Interaction result;
      while (true) {
        result =
            client.interactions
                .get(GetInteractionByIdRequest.builder().id(finalReport.id().get()).build())
                .interaction()
                .get();
        if (InteractionStatus.COMPLETED.equals(result.status().orElse(null))) {
          break;
        }
        Thread.sleep(5000);
      }
      System.out.println(result.outputText().orElse(""));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "time"

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

          refinedPlanID := "REFINED_PLAN_ID"
          agentCfg := interactions.NewCreateAgentInteractionAgentConfig(interactions.DeepResearchAgentConfig{
              ThinkingSummaries:     interactions.ThinkingSummariesAuto.ToPointer(),
              CollaborativePlanning: genai.Ptr(false),
          })

          // Third interaction: approve the plan and kick off research
          finalRes, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:                 interactions.AgentOption("deep-research-preview-04-2026"),
                  Input:                 interactions.NewInteractionsInput("Plan looks good!"),
                  AgentConfig:           &agentCfg,
                  PreviousInteractionID: genai.Ptr(refinedPlanID),
                  Background:            genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          var result *interactions.Interaction
          for {
              getRes, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                  ID: *finalRes.Interaction.ID,
              })
              if err != nil {
                  log.Fatal(err)
              }
              result = getRes.Interaction
              if result.Status == interactions.InteractionStatusCompleted {
                  break
              }
              time.Sleep(5 * time.Second)
          }
          if result.OutputText != nil {
              fmt.Println(*result.OutputText)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "deep-research-preview-04-2026",
          "input": "Plan looks good!",
          "agent_config": {
              "type": "deep-research",
              "thinking_summaries": "auto",
              "collaborative_planning": false
          },
          "previous_interaction_id": "PREVIOUS_INTERACTION_ID",
          "background": true
      }'
      ```


## 視覺化 {#visualization}


!!! note " "

      預覽版：視覺化功能讓代理能產生圖表，以佐證其研究發現。


當 `visualization` 設為 `"auto"` 時，代理可以產生圖表及其他視覺元素，來佐證其研究發現。產生的圖片會包含在回應步驟中，並以 `image` 增量形式串流傳送。為了獲得最佳效果，請在查詢中明確要求視覺內容，例如「Include charts showing trends over time」或「Generate graphics comparing market share」。將 `visualization` 設為 `"auto"` 只是啟用這項能力，代理只會在提示詞有所要求時才產生視覺內容。


=== "Python"

      ```python
      import base64

      interaction = client.interactions.create(
          agent="deep-research-preview-04-2026",
          input="Analyze global semiconductor market trends. Include graphics showing market share changes.",
          agent_config={
              "type": "deep-research",
              "visualization": "auto",
          },
          background=True,
      )

      print(f"Research started: {interaction.id}")

      while (result := client.interactions.get(id=interaction.id)).status != "completed":
          time.sleep(5)

      for step in result.steps:
          if step.type == "model_output":
              for content_item in step.content:
                  if content_item.type == "text":
                      print(content_item.text)
                  elif content_item.type == "image" and content_item.data:
                      image_bytes = base64.b64decode(content_item.data)
                      print(f"Received image: {len(image_bytes)} bytes")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await client.interactions.create({
          agent: 'deep-research-preview-04-2026',
          input: 'Analyze global semiconductor market trends. Include graphics showing market share changes.',
          agent_config: {
              type: 'deep-research',
              visualization: 'auto'
          },
          background: true
      });

      console.log(`Research started: ${interaction.id}`);

      let result;
      while ((result = await client.interactions.get(interaction.id)).status !== 'completed') {
          await new Promise(r => setTimeout(r, 5000));
      }

      for (const step of result.steps) {
          if (step.type === 'model_output') {
              for (const contentItem of step.content || []) {
                  if (contentItem.type === 'text') {
                      console.log(contentItem.text);
                  } else if (contentItem.type === 'image' && contentItem.data) {
                      console.log(`[Image Output: ${contentItem.data.substring(0, 20)}...]`);
                  }
              }
          }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.DeepResearchAgentConfig;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionStatus;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.Visualization;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.GetInteractionByIdRequest;
      import java.util.Base64;
      import java.util.Collections;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(
                  InteractionsInput.of(
                      "Analyze global semiconductor market trends. Include graphics showing market share changes."))
              .agentConfig(DeepResearchAgentConfig.builder().visualization(Visualization.AUTO).build())
              .background(true)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println("Research started: " + interaction.id().orElse(""));

      Interaction result;
      while (true) {
        result =
            client.interactions
                .get(GetInteractionByIdRequest.builder().id(interaction.id().get()).build())
                .interaction()
                .get();
        if (InteractionStatus.COMPLETED.equals(result.status().orElse(null))) {
          break;
        }
        Thread.sleep(5000);
      }

      for (Step step : result.steps().orElse(Collections.emptyList())) {
        if (step instanceof ModelOutputStep) {
          for (Content contentItem : ((ModelOutputStep) step).content().orElse(Collections.emptyList())) {
            if (contentItem instanceof TextContent) {
              System.out.println(((TextContent) contentItem).text().orElse(""));
            } else if (contentItem instanceof ImageContent) {
              ImageContent img = (ImageContent) contentItem;
              if (img.data().isPresent()) {
                byte[] imageBytes = Base64.getDecoder().decode(img.data().get());
                System.out.println("Received image: " + imageBytes.length + " bytes");
              }
            }
          }
        }
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "encoding/base64"
          "fmt"
          "log"
          "time"

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

          agentCfg := interactions.NewCreateAgentInteractionAgentConfig(interactions.DeepResearchAgentConfig{
              Visualization: interactions.VisualizationAuto.ToPointer(),
          })

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("deep-research-preview-04-2026"),
                  Input:       interactions.NewInteractionsInput("Analyze global semiconductor market trends. Include graphics showing market share changes."),
                  AgentConfig: &agentCfg,
                  Background:  genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if res.Interaction.ID != nil {
              fmt.Printf("Research started: %s\n", *res.Interaction.ID)
          }

          var result *interactions.Interaction
          for {
              getRes, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                  ID: *res.Interaction.ID,
              })
              if err != nil {
                  log.Fatal(err)
              }
              result = getRes.Interaction
              if result.Status == interactions.InteractionStatusCompleted {
                  break
              }
              time.Sleep(5 * time.Second)
          }

          for _, step := range result.Steps {
              if outStep := step.ModelOutputStep; outStep != nil {
                  for _, contentItem := range outStep.Content {
                      if textContent := contentItem.TextContent; textContent != nil {
                          fmt.Println(textContent.GetText())
                      } else if imgContent := contentItem.ImageContent; imgContent != nil && imgContent.Data != nil {
                          imageBytes, err := base64.StdEncoding.DecodeString(*imgContent.Data)
                          if err == nil {
                              fmt.Printf("Received image: %d bytes\n", len(imageBytes))
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "deep-research-preview-04-2026",
          "input": "Analyze global semiconductor market trends. Include graphics showing market share changes.",
          "agent_config": {
              "type": "deep-research",
              "visualization": "auto"
          },
          "background": true
      }'
      ```


## 支援的工具 {#supported-tools}

Deep Research 支援多種內建與外部工具。預設情況下（未提供 `tools` 參數時），代理可使用 Google Search、URL Context 與 Code Execution。你也可以明確指定工具，以限制或擴充代理的能力。

| 工具 | 類型值 | 說明 |
| :--- | :--- | :--- |
| Google Search | `google_search` | 搜尋公開網路。預設啟用。 |
| URL Context | `url_context` | 讀取並摘要網頁內容。預設啟用。 |
| Code Execution | `code_execution` | 執行程式碼以進行計算與資料分析。預設啟用。 |
| MCP Server | `mcp_server` | 連接遠端 MCP 伺服器以存取外部工具。 |
| File Search | `file_search` | 搜尋你上傳的文件語料庫。 |

### Google Search {#google-search}

明確指定僅啟用 Google Search 這一項工具：


=== "Python"

      ```python
      interaction = client.interactions.create(
          agent="deep-research-preview-04-2026",
          input="What are the latest developments in quantum computing?",
          tools=[{"type": "google_search"}],
          background=True,
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          agent: 'deep-research-preview-04-2026',
          input: 'What are the latest developments in quantum computing?',
          tools: [{ type: 'google_search' }],
          background: true
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.GoogleSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(InteractionsInput.of("What are the latest developments in quantum computing?"))
              .tools(Arrays.asList(GoogleSearch.builder().build()))
              .background(true)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
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

          _, err = client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent: interactions.AgentOption("deep-research-preview-04-2026"),
                  Input: interactions.NewInteractionsInput("What are the latest developments in quantum computing?"),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.GoogleSearch{}),
                  },
                  Background: genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "deep-research-preview-04-2026",
          "input": "What are the latest developments in quantum computing?",
          "tools": [{"type": "google_search"}],
          "background": true
      }'
      ```

=== "CLI"

      ```bash
      gemini-api agent run "What are the latest developments in quantum computing?" \
        --agent deep-research-preview-04-2026 --background --stream=false \
        --body '{"tools":[{"type":"google_search"}]}' --jq '.id'
      ```


### URL Context {#url-context}

讓代理能讀取並摘要特定網頁：


=== "Python"

      ```python
      interaction = client.interactions.create(
          agent="deep-research-preview-04-2026",
          input="Summarize the content of https://www.wikipedia.org/.",
          tools=[{"type": "url_context"}],
          background=True,
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          agent: 'deep-research-preview-04-2026',
          input: 'Summarize the content of https://www.wikipedia.org/.',
          tools: [{ type: 'url_context' }],
          background: true
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.URLContext;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(InteractionsInput.of("Summarize the content of https://www.wikipedia.org/."))
              .tools(Arrays.asList(URLContext.builder().build()))
              .background(true)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
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

          _, err = client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent: interactions.AgentOption("deep-research-preview-04-2026"),
                  Input: interactions.NewInteractionsInput("Summarize the content of https://www.wikipedia.org/."),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.URLContext{}),
                  },
                  Background: genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "deep-research-preview-04-2026",
          "input": "Summarize the content of https://www.wikipedia.org/.",
          "tools": [{"type": "url_context"}],
          "background": true
      }'
      ```


### Code Execution {#code-execution}

允許代理執行程式碼以進行計算與資料分析：


=== "Python"

      ```python
      interaction = client.interactions.create(
          agent="deep-research-preview-04-2026",
          input="Calculate the 50th Fibonacci number.",
          tools=[{"type": "code_execution"}],
          background=True,
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          agent: 'deep-research-preview-04-2026',
          input: 'Calculate the 50th Fibonacci number.',
          tools: [{ type: 'code_execution' }],
          background: true
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CodeExecution;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(InteractionsInput.of("Calculate the 50th Fibonacci number."))
              .tools(Arrays.asList(CodeExecution.builder().build()))
              .background(true)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
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

          _, err = client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent: interactions.AgentOption("deep-research-preview-04-2026"),
                  Input: interactions.NewInteractionsInput("Calculate the 50th Fibonacci number."),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.CodeExecution{}),
                  },
                  Background: genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "input": "Calculate the 50th Fibonacci number.",
          "agent": "deep-research-preview-04-2026",
          "tools": [{"type": "code_execution"}],
          "background": true
      }'
      ```


### MCP 伺服器 {#mcp-servers}


!!! note " "

      預覽版：連接遠端 MCP 伺服器，讓代理能存取外部工具與服務。


在工具設定中提供伺服器的 `name` 與 `url`。你也可以傳入驗證憑證，並限制代理可呼叫的工具。

| 欄位 | 類型 | 必填 | 說明 |
| :--- | :--- | :--- | :--- |
| `type` | `string` | 是 | 必須為 `"mcp_server"`。 |
| `name` | `string` | 否 | MCP 伺服器的顯示名稱。 |
| `url` | `string` | 否 | MCP 伺服器端點的完整 URL。 |
| `headers` | `object` | 否 | 隨每個傳送至伺服器的請求一併送出的鍵值對 HTTP 標頭（例如驗證 token）。 |
| `allowed_tools` | `array` | 否 | 限制代理可呼叫該伺服器的哪些工具。 |

#### 基本用法 {#mcp-basic}


=== "Python"

      ```python
      interaction = client.interactions.create(
          agent="deep-research-preview-04-2026",
          input="Check the status of my last server deployment.",
          tools=[
              {
                  "type": "mcp_server",
                  "name": "Deployment Tracker",
                  "url": "https://mcp.example.com/mcp",
                  "headers": {"Authorization": "Bearer my-token"},
              }
          ],
          background=True,
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          agent: 'deep-research-preview-04-2026',
          input: 'Check the status of my last server deployment.',
          tools: [
              {
                  type: 'mcp_server',
                  name: 'Deployment Tracker',
                  url: 'https://mcp.example.com/mcp',
                  headers: { Authorization: 'Bearer my-token' }
              }
          ],
          background: true
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.MCPServer;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(InteractionsInput.of("Check the status of my last server deployment."))
              .tools(
                  Arrays.asList(
                      MCPServer.builder()
                          .name("Deployment Tracker")
                          .url("https://mcp.example.com/mcp")
                          .headers(Collections.singletonMap("Authorization", "Bearer my-token"))
                          .build()))
              .background(true)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
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

          _, err = client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent: interactions.AgentOption("deep-research-preview-04-2026"),
                  Input: interactions.NewInteractionsInput("Check the status of my last server deployment."),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.MCPServer{
                          Name: genai.Ptr("Deployment Tracker"),
                          URL:  genai.Ptr("https://mcp.example.com/mcp"),
                          Headers: map[string]string{
                              "Authorization": "Bearer my-token",
                          },
                      }),
                  },
                  Background: genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "deep-research-preview-04-2026",
          "input": "Check the status of my last server deployment.",
          "tools": [
              {
                  "type": "mcp_server",
                  "name": "Deployment Tracker",
                  "url": "https://mcp.example.com/mcp",
                  "headers": {"Authorization": "Bearer my-token"}
              }
          ],
          "background": true
      }'
      ```


### File Search {#file-search}

使用 [File Search](/docs/file-search/) 工具，讓代理能存取你自己的資料。


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          input="Compare our 2025 fiscal year report against current public web news.",
          agent="deep-research-preview-04-2026",
          background=True,
          tools=[
              {
                  "type": "file_search",
                  "file_search_store_names": ['fileSearchStores/my-store-name']
              }
          ]
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          input: 'Compare our 2025 fiscal year report against current public web news.',
          agent: 'deep-research-preview-04-2026',
          background: true,
          tools: [
              { type: 'file_search', file_search_store_names: ['fileSearchStores/my-store-name'] },
          ]
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.FileSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(
                  InteractionsInput.of(
                      "Compare our 2025 fiscal year report against current public web news."))
              .tools(
                  Arrays.asList(
                      FileSearch.builder()
                          .fileSearchStoreNames(Arrays.asList("fileSearchStores/my-store-name"))
                          .build()))
              .background(true)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
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

          _, err = client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent: interactions.AgentOption("deep-research-preview-04-2026"),
                  Input: interactions.NewInteractionsInput("Compare our 2025 fiscal year report against current public web news."),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.FileSearch{
                          FileSearchStoreNames: []string{"fileSearchStores/my-store-name"},
                      }),
                  },
                  Background: genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "input": "Compare our 2025 fiscal year report against current public web news.",
          "agent": "deep-research-preview-04-2026",
          "background": true,
          "tools": [
              {"type": "file_search", "file_search_store_names": ["fileSearchStores/my-store-name"]},
          ]
      }'
      ```


## 引導與格式化 {#steerability-and-formatting}

你可以在提示詞中提供明確的格式指示，引導代理的輸出內容。如此便能將報告組織成特定的章節與小節、納入資料表，或針對不同受眾調整語氣（例如「technical」、「executive」、「casual」）。

請在輸入文字中明確定義期望的輸出格式。


=== "Python"

      ```python
      prompt = """
      Research the competitive landscape of EV batteries.

      Format the output as a technical report with the following structure:

      1. Executive Summary
      2. Key Players (Must include a data table comparing capacity and chemistry)
      3. Supply Chain Risks
      """

      interaction = client.interactions.create(
          input=prompt,
          agent="deep-research-preview-04-2026",
          background=True
      )
      ```

=== "JavaScript"

      ```javascript
      const prompt = `
      Research the competitive landscape of EV batteries.

      Format the output as a technical report with the following structure:

      1. Executive Summary
      2. Key Players (Must include a data table comparing capacity and chemistry)
      3. Supply Chain Risks
      `;

      const interaction = await client.interactions.create({
          input: prompt,
          agent: 'deep-research-preview-04-2026',
          background: true,
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      String prompt =
          "Research the competitive landscape of EV batteries.\n\n"
              + "Format the output as a technical report with the following structure:\n"
              + "1. Executive Summary\n"
              + "2. Key Players (Must include a data table comparing capacity and chemistry)\n"
              + "3. Supply Chain Risks";

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(InteractionsInput.of(prompt))
              .background(true)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
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

          prompt := "Research the competitive landscape of EV batteries.\n\n" +
              "Format the output as a technical report with the following structure:\n" +
              "1. Executive Summary\n" +
              "2. Key Players (Must include a data table comparing capacity and chemistry)\n" +
              "3. Supply Chain Risks"

          _, err = client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:      interactions.AgentOption("deep-research-preview-04-2026"),
                  Input:      interactions.NewInteractionsInput(prompt),
                  Background: genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "input": "Research the competitive landscape of EV batteries.\n\nFormat the output as a technical report with the following structure: \n1. Executive Summary\n2. Key Players (Must include a data table comparing capacity and chemistry)\n3. Supply Chain Risks",
          "agent": "deep-research-preview-04-2026",
          "background": true
      }'
      ```

=== "CLI"

      ```bash
      gemini-api agent run "Research the competitive landscape of EV batteries.
      Format the output as a technical report with the following structure:
      1. Executive Summary
      2. Key Players (Must include a data table comparing capacity and chemistry)
      3. Supply Chain Risks" \
        --agent deep-research-preview-04-2026 --background --stream=false --jq '.id'
      ```


## 多模態輸入 {#multimodal-inputs}

Deep Research 支援多模態輸入，包括圖片與文件（PDF），讓代理能分析視覺內容，並以所提供的輸入為脈絡進行網路研究。


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      prompt = """Analyze the interspecies dynamics and behavioral risks present
      in the provided image of the African watering hole. Specifically, investigate
      the symbiotic relationship between the avian species and the pachyderms
      shown, and conduct a risk assessment for the reticulated giraffes based on
      their drinking posture relative to the specific predator visible in the
      foreground."""

      interaction = client.interactions.create(
          input=[
              {"type": "text", "text": prompt},
              {
                  "type": "image",
                  "mime_type": "image/jpeg",
                  "uri": "https://storage.googleapis.com/generativeai-downloads/images/generated_elephants_giraffes_zebras_sunset.jpg"
              }
          ],
          agent="deep-research-preview-04-2026",
          background=True
      )

      print(f"Research started: {interaction.id}")

      while True:
          interaction = client.interactions.get(interaction.id)
          if interaction.status == "completed":
              print(interaction.steps[-1].content[0].text)
              break
          elif interaction.status == "failed":
              print(f"Research failed: {interaction.error}")
              break
          time.sleep(10)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const prompt = `Analyze the interspecies dynamics and behavioral risks present
      in the provided image of the African watering hole. Specifically, investigate
      the symbiotic relationship between the avian species and the pachyderms
      shown, and conduct a risk assessment for the reticulated giraffes based on
      their drinking posture relative to the specific predator visible in the
      foreground.`;

      const interaction = await client.interactions.create({
          input: [
              { type: 'text', text: prompt },
              {
                  type: 'image',
                  mime_type: "image/jpeg",
                  uri: 'https://storage.googleapis.com/generativeai-downloads/images/generated_elephants_giraffes_zebras_sunset.jpg'
              }
          ],
          agent: 'deep-research-preview-04-2026',
          background: true
      });

      console.log(`Research started: ${interaction.id}`);

      while (true) {
          const result = await client.interactions.get(interaction.id);
          if (result.status === 'completed') {
              console.log(result.output_text);
              break;
          } else if (result.status === 'failed') {
              console.log(`Research failed: ${JSON.stringify(result.errors)}`);
              break;
          }
          await new Promise(resolve => setTimeout(resolve, 10000));
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionStatus;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.GetInteractionByIdRequest;
      import java.util.Arrays;
      import java.util.Collections;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      String prompt =
          "Analyze the interspecies dynamics and behavioral risks present "
              + "in the provided image of the African watering hole. Specifically, investigate "
              + "the symbiotic relationship between the avian species and the pachyderms "
              + "shown, and conduct a risk assessment for the reticulated giraffes based on "
              + "their drinking posture relative to the specific predator visible in the "
              + "foreground.";

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(
                  InteractionsInput.ofContent(
                      Arrays.asList(
                          TextContent.builder().text(prompt).build(),
                          ImageContent.builder()
                              .mimeType(ImageContentMimeType.IMAGE_JPEG)
                              .uri(
                                  "https://storage.googleapis.com/generativeai-downloads/images/generated_elephants_giraffes_zebras_sunset.jpg")
                              .build())))
              .background(true)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println("Research started: " + interaction.id().orElse(""));

      while (true) {
        interaction =
            client.interactions
                .get(GetInteractionByIdRequest.builder().id(interaction.id().get()).build())
                .interaction()
                .get();
        if (InteractionStatus.COMPLETED.equals(interaction.status().orElse(null))) {
          System.out.println(interaction.outputText().orElse(""));
          break;
        } else if (InteractionStatus.FAILED.equals(interaction.status().orElse(null))) {
          System.out.println("Research failed: " + interaction.errors().orElse(Collections.emptyList()));
          break;
        }
        Thread.sleep(10000);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "time"

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

          prompt := "Analyze the interspecies dynamics and behavioral risks present " +
              "in the provided image of the African watering hole. Specifically, investigate " +
              "the symbiotic relationship between the avian species and the pachyderms " +
              "shown, and conduct a risk assessment for the reticulated giraffes based on " +
              "their drinking posture relative to the specific predator visible in the " +
              "foreground."

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent: interactions.AgentOption("deep-research-preview-04-2026"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{Text: prompt}),
                      interactions.NewContent(interactions.ImageContent{
                          MimeType: interactions.ImageContentMimeType("image/jpeg").ToPointer(),
                          URI:      genai.Ptr("https://storage.googleapis.com/generativeai-downloads/images/generated_elephants_giraffes_zebras_sunset.jpg"),
                      }),
                  }),
                  Background: genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          interaction := res.Interaction
          if interaction.ID != nil {
              fmt.Printf("Research started: %s\n", *interaction.ID)
          }

          for {
              getRes, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                  ID: *interaction.ID,
              })
              if err != nil {
                  log.Fatal(err)
              }
              interaction = getRes.Interaction
              if interaction.Status == interactions.InteractionStatusCompleted {
                  if interaction.OutputText != nil {
                      fmt.Println(*interaction.OutputText)
                  }
                  break
              } else if interaction.Status == interactions.InteractionStatusFailed {
                  fmt.Printf("Research failed: %v\n", interaction.Errors)
                  break
              }
              time.Sleep(10 * time.Second)
          }
      }
      ```

=== "REST"

      ```bash
      # 1. Start the research task with image input
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "input": [
              {"type": "text", "text": "Analyze the interspecies dynamics and behavioral risks present in the provided image of the African watering hole. Specifically, investigate the symbiotic relationship between the avian species and the pachyderms shown, and conduct a risk assessment for the reticulated giraffes based on their drinking posture relative to the specific predator visible in the foreground."},
              {"type": "image", "mime_type": "image/jpeg", "uri": "https://storage.googleapis.com/generativeai-downloads/images/generated_elephants_giraffes_zebras_sunset.jpg"}
          ],
          "agent": "deep-research-preview-04-2026",
          "background": true
      }'

      # 2. Poll for results (Replace INTERACTION_ID)
      # curl -X GET "https://generativelanguage.googleapis.com/v1beta/interactions/INTERACTION_ID" \
      # -H "Api-Revision: 2026-05-20" \
      # -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "CLI"

      ```bash
      # Download the image locally first (-i accepts local files, files/<id>, or YouTube URLs).
      curl -fsSL -o watering_hole.jpg \
        "https://storage.googleapis.com/generativeai-downloads/images/generated_elephants_giraffes_zebras_sunset.jpg"
      gemini-api agent run "Analyze the interspecies dynamics and behavioral risks present in the provided image of the African watering hole. Specifically, investigate the symbiotic relationship between the avian species and the pachyderms shown, and conduct a risk assessment for the reticulated giraffes based on their drinking posture relative to the specific predator visible in the foreground." \
        --agent deep-research-preview-04-2026 -i watering_hole.jpg \
        --background --stream=false --jq '.id'
      ```


### 文件理解 {#document-understanding}


!!! note " "

      預覽版：文件理解功能可直接將文件作為多模態輸入傳入。


直接將文件作為多模態輸入傳入。代理會分析所提供的文件，並以其內容為依據進行研究。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="deep-research-preview-04-2026",
          input=[
              {"type": "text", "text": "What is this document about?"},
              {
                  "type": "document",
                  "uri": "https://arxiv.org/pdf/1706.03762",
                  "mime_type": "application/pdf",
              },
          ],
          background=True,
      )
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await client.interactions.create({
          agent: 'deep-research-preview-04-2026',
          input: [
              { type: 'text', text: 'What is this document about?' },
              {
                  type: 'document',
                  uri: 'https://arxiv.org/pdf/1706.03762',
                  mime_type: 'application/pdf'
              }
          ],
          background: true
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.DocumentContent;
      import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(
                  InteractionsInput.ofContent(
                      Arrays.asList(
                          TextContent.builder().text("What is this document about?").build(),
                          DocumentContent.builder()
                              .uri("https://arxiv.org/pdf/1706.03762")
                              .mimeType(DocumentContentMimeType.APPLICATION_PDF)
                              .build())))
              .background(true)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
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

          _, err = client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent: interactions.AgentOption("deep-research-preview-04-2026"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{Text: "What is this document about?"}),
                      interactions.NewContent(interactions.DocumentContent{
                          URI:      genai.Ptr("https://arxiv.org/pdf/1706.03762"),
                          MimeType: interactions.DocumentContentMimeType("application/pdf").ToPointer(),
                      }),
                  }),
                  Background: genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```bash
      # 1. Start the research task with document input
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "deep-research-preview-04-2026",
          "input": [
              {"type": "text", "text": "What is this document about?"},
              {"type": "document", "uri": "https://arxiv.org/pdf/1706.03762", "mime_type": "application/pdf"}
          ],
          "background": true
      }'
      ```


## 處理長時間執行的任務 {#long-running-tasks}

Deep Research 是一個多步驟流程，涵蓋規劃、搜尋、閱讀與撰寫。這個循環通常會超出同步 API 呼叫的標準逾時上限。

代理必須使用 `background=True`。API 會立即回傳一個部分的 `Interaction` 物件。你可以使用 `id` 屬性取得互動以進行輪詢。互動狀態會從 `in_progress` 轉換為 `completed` 或 `failed`。

### 串流 {#streaming}

Deep Research 支援串流，可即時接收研究進度的更新，包括思考摘要、文字輸出與產生的圖片。你必須同時設定 `stream=True` 與 `background=True`。

若要接收中間的推理步驟（思考過程）與進度更新，你必須啟用 **thinking summaries**，作法是將 `thinking_summaries` 設為 `"auto"`（此設定位於 `agent_config` 內）。若未啟用，串流可能只會提供最終結果。


!!! note " "

      注意：串流連線可能會中斷或過期。由於 Deep Research 任務的執行時間較長，你的應用程式應檢查互動狀態並重新連線，如以下範例所示。


#### 串流事件類型 {#stream-event-types}

| 事件類型 | 增量類型 | 說明 |
| :--- | :--- | :--- |
| `step.delta` | `thought` | 代理的中間推理步驟。 |
| `step.delta` | `text` | 最終文字輸出的一部分。 |
| `step.delta` | `image` | 一張產生的圖片（base64 編碼）。 |

以下範例會啟動一個研究任務，並在處理串流時自動重新連線。它會追蹤 `interaction_id` 與 `last_event_id`，以便在連線中斷時（例如在 600 秒逾時後）能從中斷處繼續。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction_id = None
      last_event_id = None
      is_complete = False

      def process_stream(stream):
          global interaction_id, last_event_id, is_complete
          for event in stream:
              if event.event_type == "interaction.created":
                  interaction_id = event.interaction.id
              if event.event_id:
                  last_event_id = event.event_id
              if event.event_type == "step.delta":
                  if event.delta.type == "text":
                      print(event.delta.text, end="", flush=True)
                  elif event.delta.type == "thought":
                      print(f"Thought: {event.delta.text}", flush=True)
              elif event.event_type in ("interaction.completed", "interaction.error"):
                  is_complete = True

      stream = client.interactions.create(
          input="Research the history of Google TPUs.",
          agent="deep-research-preview-04-2026",
          background=True,
          stream=True,
          agent_config={"type": "deep-research", "thinking_summaries": "auto"},
      )
      process_stream(stream)

      # Reconnect if the connection drops
      while not is_complete and interaction_id:
          status = client.interactions.get(interaction_id)
          if status.status != "in_progress":
              break
          stream = client.interactions.get(
              id=interaction_id, stream=True, last_event_id=last_event_id,
          )
          process_stream(stream)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      let interactionId;
      let lastEventId;
      let isComplete = false;

      const initialStream = await client.interactions.create({
          input: 'Research the history of Google TPUs.',
          agent: 'deep-research-preview-04-2026',
          background: true,
          stream: true,
          agent_config: { type: 'deep-research', thinking_summaries: 'auto' },
      });

      async function processStream(stream = initialStream) {
          for await (const event of stream) {
              if (event.event_type === 'interaction.created') {
                  interactionId = event.interaction.id;
              }
              if (event.event_id) lastEventId = event.event_id;
              if (event.event_type === 'step.delta') {
                  if (event.delta.type === 'text') {
                      process.stdout.write(event.delta.text || '');
                  } else if (event.delta.type === 'thought_summary') {
                      if (event.delta.content?.type === 'text') {
                          console.log(`Thought: ${event.delta.content.text}`);
                      }
                  }
              } else if (['interaction.completed', 'interaction.error'].includes(event.event_type)) {
                  isComplete = true;
              }
          }
      }

      await processStream(initialStream);

      // Reconnect if the connection drops
      while (!isComplete && interactionId) {
          const status = await client.interactions.get(interactionId);
          if (status.status !== 'in_progress') break;
          const resumeStream = await client.interactions.get(interactionId, {
              stream: true, last_event_id: lastEventId,
          });
          await processStream(resumeStream);
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.DeepResearchAgentConfig;
      import com.google.genai.gaos.models.interactions.ErrorEvent;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionCompletedEvent;
      import com.google.genai.gaos.models.interactions.InteractionCreatedEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEStreamEvent;
      import com.google.genai.gaos.models.interactions.InteractionStatus;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.StepDelta;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.TextDelta;
      import com.google.genai.gaos.models.interactions.ThinkingSummaries;
      import com.google.genai.gaos.models.interactions.ThoughtSummaryDelta;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.GetInteractionByIdRequest;
      import com.google.genai.gaos.utils.EventStream;

      class StreamProcessor {
        String interactionId = null;
        String lastEventId = null;
        boolean isComplete = false;

        void processStream(EventStream<InteractionSSEStreamEvent> stream) {
          for (InteractionSSEStreamEvent streamEvent : stream) {
            InteractionSSEEvent event = streamEvent.data().orElse(null);
            if (event instanceof InteractionCreatedEvent) {
              InteractionCreatedEvent created = (InteractionCreatedEvent) event;
              interactionId = created.interaction().flatMap(i -> i.id()).orElse(null);
              if (created.eventId().isPresent()) {
                lastEventId = created.eventId().get();
              }
            } else if (event instanceof StepDelta) {
              StepDelta stepDelta = (StepDelta) event;
              if (stepDelta.eventId().isPresent()) {
                lastEventId = stepDelta.eventId().get();
              }
              if (stepDelta.delta().isPresent()) {
                if (stepDelta.delta().get() instanceof TextDelta) {
                  System.out.print(((TextDelta) stepDelta.delta().get()).text().orElse(""));
                  System.out.flush();
                } else if (stepDelta.delta().get() instanceof ThoughtSummaryDelta) {
                  ThoughtSummaryDelta thought = (ThoughtSummaryDelta) stepDelta.delta().get();
                  Content content = thought.content().orElse(null);
                  if (content instanceof TextContent) {
                    System.out.println("Thought: " + ((TextContent) content).text().orElse(""));
                  }
                }
              }
            } else if (event instanceof InteractionCompletedEvent || event instanceof ErrorEvent) {
              isComplete = true;
            }
          }
        }
      }

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
      StreamProcessor processor = new StreamProcessor();

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(InteractionsInput.of("Research the history of Google TPUs."))
              .background(true)
              .stream(true)
              .agentConfig(
                  DeepResearchAgentConfig.builder().thinkingSummaries(ThinkingSummaries.AUTO).build())
              .build();

      try (EventStream<InteractionSSEStreamEvent> stream =
          client.interactions.create(CreateInteractionRequestBody.of(params)).events()) {
        processor.processStream(stream);
      }

      // Reconnect if the connection drops
      while (!processor.isComplete && processor.interactionId != null) {
        Interaction status =
            client.interactions
                .get(GetInteractionByIdRequest.builder().id(processor.interactionId).build())
                .interaction()
                .get();
        if (!InteractionStatus.IN_PROGRESS.equals(status.status().orElse(null))) {
          break;
        }
        try (EventStream<InteractionSSEStreamEvent> stream =
            client.interactions
                .get(
                    GetInteractionByIdRequest.builder()
                        .id(processor.interactionId)
                        .stream(true)
                        .lastEventId(processor.lastEventId)
                        .build())
                .events()) {
          processor.processStream(stream);
        }
      }
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
          "google.golang.org/genai/interactions/types/stream"
      )

      type StreamProcessor struct {
          interactionID string
          lastEventID   *string
          isComplete    bool
      }

      func (p *StreamProcessor) processStream(s *stream.EventStream[interactions.InteractionSSEStreamEvent]) {
          defer s.Close()
          for s.Next() {
              event := s.Value()
              if created := event.GetDataInteractionCreated(); created != nil {
                  p.interactionID = created.Interaction.ID
                  if created.EventID != nil {
                      p.lastEventID = created.EventID
                  }
              } else if stepDelta := event.GetDataStepDelta(); stepDelta != nil {
                  if stepDelta.EventID != nil {
                      p.lastEventID = stepDelta.EventID
                  }
                  if textDelta := stepDelta.GetDeltaText(); textDelta != nil {
                      fmt.Print(textDelta.GetText())
                  } else if thoughtDelta := stepDelta.GetDeltaThoughtSummary(); thoughtDelta != nil {
                      if textContent := thoughtDelta.GetContentText(); textContent != nil {
                          fmt.Printf("Thought: %s\n", textContent.GetText())
                      }
                  }
              } else if event.GetDataInteractionCompleted() != nil || event.GetDataError() != nil {
                  p.isComplete = true
              }
          }
      }

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          processor := &StreamProcessor{}
          agentCfg := interactions.NewCreateAgentInteractionAgentConfig(interactions.DeepResearchAgentConfig{
              ThinkingSummaries: interactions.ThinkingSummariesAuto.ToPointer(),
          })

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("deep-research-preview-04-2026"),
                  Input:       interactions.NewInteractionsInput("Research the history of Google TPUs."),
                  Background:  genai.Ptr(true),
                  Stream:      genai.Ptr(true),
                  AgentConfig: &agentCfg,
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          processor.processStream(res.InteractionSSEStreamEvent)

          // Reconnect if the connection drops
          for !processor.isComplete && processor.interactionID != "" {
              statusRes, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                  ID: processor.interactionID,
              })
              if err != nil || statusRes.Interaction.Status != interactions.InteractionStatusInProgress {
                  break
              }
              streamRes, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                  ID:          processor.interactionID,
                  Stream:      genai.Ptr(true),
                  LastEventID: processor.lastEventID,
              })
              if err != nil {
                  break
              }
              processor.processStream(streamRes.InteractionSSEStreamEvent)
          }
      }
      ```

=== "REST"

      ```bash
      # 1. Start the stream (save the INTERACTION_ID from the interaction.start event
      # and the last "event_id" you receive)
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "input": "Research the history of Google TPUs.",
          "agent": "deep-research-preview-04-2026",
          "background": true,
          "stream": true,
          "agent_config": {
              "type": "deep-research",
              "thinking_summaries": "auto"
          }
      }'

      # 2. If the connection drops, reconnect with your saved IDs
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/interactions/INTERACTION_ID?stream=true&last_event_id=LAST_EVENT_ID" \
      -H "Api-Revision: 2026-05-20" \
      -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "CLI"

      ```bash
      # Print every event as JSON; save the interaction ID and the last event_id you see
      gemini-api agent run "Research the history of Google TPUs." \
        --agent deep-research-preview-04-2026 --background --stream -o json \
        --body '{"agent_config":{"type":"deep-research","thinking_summaries":"auto"}}'
      # If the connection drops, resume the stream from your saved IDs
      gemini-api agent status INTERACTION_ID --stream --last-event-id LAST_EVENT_ID -o json
      ```


## 後續問題與互動 {#follow-up-questions-and-interactions}

代理回傳最終報告後，你可以使用 `previous_interaction_id` 繼續對話。如此便能針對研究的特定章節要求釐清、摘要或進一步闡述，無需重新啟動整個任務。


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          input="Can you elaborate on the second point in the report?",
          model="gemini-4-carbon",
          previous_interaction_id="COMPLETED_INTERACTION_ID"
      )

      print(interaction.steps[-1].content[0].text)
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          input: 'Can you elaborate on the second point in the report?',
          model: 'gemini-4-carbon',
          previous_interaction_id: 'COMPLETED_INTERACTION_ID'
      });
      console.log(interaction.steps.at(-1).content[0].text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model("gemini-4-carbon")
              .input(InteractionsInput.of("Can you elaborate on the second point in the report?"))
              .previousInteractionId("COMPLETED_INTERACTION_ID")
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
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:                 interactions.Model("gemini-4-carbon"),
                  Input:                 interactions.NewInteractionsInput("Can you elaborate on the second point in the report?"),
                  PreviousInteractionID: genai.Ptr("COMPLETED_INTERACTION_ID"),
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
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "input": "Can you elaborate on the second point in the report?",
          "model": "gemini-4-carbon",
          "previous_interaction_id": "COMPLETED_INTERACTION_ID"
      }'
      ```

=== "CLI"

      ```bash
      gemini-api generate "Can you elaborate on the second point in the report?" \
        -m gemini-4-carbon --previous-interaction-id COMPLETED_INTERACTION_ID
      ```


## 何時使用 Gemini Deep Research 代理 {#when-to-use-deep-research}

Deep Research 是一個**代理**，而不只是一個模型。它最適合需要「開箱即用的分析師」式做法的工作負載，而非低延遲的聊天情境。

| 功能 | 標準 Gemini 模型 | Gemini Deep Research 代理 |
| :--- | :--- | :--- |
| **延遲** | 數秒 | 數分鐘（非同步／背景） |
| **流程** | 產生 \-\> 輸出 | 規劃 \-\> 搜尋 \-\> 閱讀 \-\> 反覆迭代 \-\> 輸出 |
| **輸出** | 對話文字、程式碼、簡短摘要 | 詳細報告、長篇分析、比較表 |
| **最適合** | 聊天機器人、擷取、創意寫作 | 市場分析、盡職調查、文獻回顧、競爭格局分析 |

## 代理設定 {#agent-configuration}

Deep Research 使用 `agent_config` 參數來控制行為。請以字典形式傳入，並包含以下欄位：

| 欄位 | 類型 | 預設值 | 說明 |
| :--- | :--- | :--- | :--- |
| `type` | `string` | 必填 | 必須為 `"deep-research"`。 |
| `thinking_summaries` | `string` | `"none"` | 設為 `"auto"` 可在串流期間接收中間推理步驟；設為 `"none"` 則停用。 |
| `visualization` | `string` | `"auto"` | 設為 `"auto"` 可啟用代理產生的圖表與圖片；設為 `"off"` 則停用。 |
| `collaborative_planning` | `boolean` | `false` | 設為 `true` 可在研究開始前啟用多輪計畫檢視。 |


=== "Python"

      ```python
      agent_config = {
          "type": "deep-research",
          "thinking_summaries": "auto",
          "visualization": "auto",
          "collaborative_planning": False,
      }

      interaction = client.interactions.create(
          agent="deep-research-preview-04-2026",
          input="Research the competitive landscape of cloud GPUs.",
          agent_config=agent_config,
          background=True,
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          agent: 'deep-research-preview-04-2026',
          input: 'Research the competitive landscape of cloud GPUs.',
          agent_config: {
              type: 'deep-research',
              thinking_summaries: 'auto',
              visualization: 'auto',
              collaborative_planning: false,
          },
          background: true,
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.DeepResearchAgentConfig;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.ThinkingSummaries;
      import com.google.genai.gaos.models.interactions.Visualization;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      DeepResearchAgentConfig agentConfig =
          DeepResearchAgentConfig.builder()
              .thinkingSummaries(ThinkingSummaries.AUTO)
              .visualization(Visualization.AUTO)
              .collaborativePlanning(false)
              .build();

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(InteractionsInput.of("Research the competitive landscape of cloud GPUs."))
              .agentConfig(agentConfig)
              .background(true)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
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

          agentCfg := interactions.NewCreateAgentInteractionAgentConfig(interactions.DeepResearchAgentConfig{
              ThinkingSummaries:     interactions.ThinkingSummariesAuto.ToPointer(),
              Visualization:         interactions.VisualizationAuto.ToPointer(),
              CollaborativePlanning: genai.Ptr(false),
          })

          _, err = client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("deep-research-preview-04-2026"),
                  Input:       interactions.NewInteractionsInput("Research the competitive landscape of cloud GPUs."),
                  AgentConfig: &agentCfg,
                  Background:  genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Api-Revision: 2026-05-20" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "input": "Research the competitive landscape of cloud GPUs.",
          "agent": "deep-research-preview-04-2026",
          "agent_config": {
              "type": "deep-research",
              "thinking_summaries": "auto",
              "visualization": "auto",
              "collaborative_planning": false
          },
          "background": true
      }'
      ```


## 可用性與定價 {#availability-and-pricing}

你可以在 Google AI Studio 與 Gemini API 中，透過 Interactions API 使用 Gemini Deep Research 代理。

定價採用[按量付費模式](/docs/pricing/#pricing-for-agents)，依底層的 Gemini 模型以及代理所使用的特定工具計費。與標準聊天請求不同（一個請求只產生一個輸出），Deep Research 任務是一個代理式工作流程：單一請求便會觸發一個自主循環，進行規劃、搜尋、閱讀與推理。

### 預估成本 {#estimated-costs}

成本會依所需的研究深度而有所不同。代理會自主判斷需要多少閱讀與搜尋，才能回答你的提示詞。

* **Deep Research**（`deep-research-preview-04-2026`）：對於需要中等程度分析的典型查詢，代理可能使用約 80 次搜尋查詢、約 250k 個輸入 tokens（約 50-70% 已快取），以及約 60k 個輸出 tokens。
  *   **預估總計：** 每項任務約 $1.00 - $3.00

* **Deep Research Max**（`deep-research-max-preview-04-2026`）：對於深入的競爭格局分析或大規模的盡職調查，代理可能使用多達約 160 次搜尋查詢、約 900k 個輸入 tokens（約 50-70% 已快取），以及約 80k 個輸出 tokens。
  *   **預估總計：** 每項任務約 $3.00 - $7.00


!!! note " "

      注意：以上數字是依預覽版費率所作的估計，日後可能變動。


## 安全考量 {#safety-considerations}

讓代理存取網路與你的私人檔案，必須審慎考量安全風險。

* **透過檔案進行提示詞注入：** 代理會讀取你所提供檔案的內容。請確保上傳的文件（PDF、文字檔）來自可信的來源。惡意檔案可能含有隱藏文字，意圖操縱代理的輸出。

* **網路內容風險：** 代理會搜尋公開網路。雖然我們設有健全的安全篩選機制，代理仍有可能接觸並處理惡意網頁。建議你檢視回應中提供的 `citations`，以查證來源。

* **資料外洩：** 若你同時允許代理瀏覽網路，在要求它摘要敏感的內部資料時務必謹慎。


## 最佳實務 {#best-practices}

* **針對未知情況給予提示：** 指示代理如何處理缺少的資料。例如，在提示詞中加入 *「If specific figures for 2025 are not available, explicitly state they are projections or unavailable rather than estimating」*。

* **提供脈絡：** 直接在輸入提示詞中提供背景資訊或限制條件，讓代理的研究有所依據。

* **使用協作規劃：** 對於複雜的查詢，請啟用協作規劃，在執行前檢視並調整研究計畫。

* **多模態輸入：** Deep Research 代理支援多模態輸入。請謹慎使用，因為這會增加成本，並提高上下文視窗溢位的風險。


## 限制 {#limitations}

* **自訂工具：** 目前無法提供自訂的函式呼叫工具，但你可以搭配 Deep Research 代理使用遠端 MCP（Model Context Protocol）伺服器。

* **結構化輸出：** Deep Research 代理目前不支援結構化輸出。

* **最長研究時間：** Deep Research 代理的最長研究時間為 60 分鐘。大多數任務應能在 20 分鐘內完成。

* **Store 要求：** 使用 `background=True` 執行代理時，必須設定 `store=True`。

* **Google 搜尋：** [Google 搜尋](/docs/google-search/) 預設啟用，且接地結果適用[特定限制](/docs/terms/#use-restrictions2)。


## 後續步驟 {#whats-next}

* 進一步瞭解 [Interactions API](/docs/interactions-overview/)。
* 瞭解如何使用 [File Search](/docs/file-search/) 工具運用你自己的資料。
