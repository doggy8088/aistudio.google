# Gemini 思考

[Gemini 模型](/docs/models/)採用「思考流程」，能大幅提升推理與多步驟規劃能力，因此在程式設計、進階數學與資料分析等複雜任務上表現出色。

使用思考模型時，Gemini 會在回應前先進行內部推理。Interactions API 透過 `thought` 步驟呈現這段推理過程，這些專屬步驟會依時間順序，與函式呼叫、使用者輸入或模型輸出一起出現在 `steps` 陣列中。

每個思考步驟都包含兩個欄位：


| 欄位 | 必要 | 說明 |
| --- | --- | --- |
| `signature` | ✅ 是 | 模型內部推理狀態的加密表示。即使模型只進行極少量的推理，這個欄位也一定會出現。 |
| `summary` | ❌ 否 | 摘要推理內容的陣列（文字及／或圖片）。視 [`thinking_summaries`](/api-reference/interactions-api/) 設定、模型是否進行了足夠的推理，或內容類型而定，這個欄位可能為空（例如圖片潛在表示可能沒有文字摘要）。 |


!!! note " "

      Interactions API 處理思考與簽章的方式，與 `generateContent` API 不同：

      - 在 `generateContent` API 中，沒有專屬的思考區塊。因此，簽章是可附加到任何部分的後設資料，例如存在於 `functionCall` 部分或回應的最後一個部分中。
      - 在 Interactions API 中，思考是以專屬 `thought` 步驟作為一級表示。因此，簽章只會出現在兩個已知位置：`thought` 步驟，或內建工具步驟（例如 `google_search_call`／`google_search_result`）。簽章絕不會出現在使用者輸入、模型輸出或標準函式呼叫上。


## 搭配思考功能的互動 {#interactions-with-thinking}

使用思考模型發起互動的方式，與其他互動請求類似。在 `model` 欄位中指定其中一個[支援思考功能的模型](/docs/thinking/#thinking-levels)：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Explain the concept of Occam's Razor and provide a simple, everyday example."
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Explain the concept of Occam's Razor and provide a simple, everyday example."
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
              .input(
                  InteractionsInput.of(
                      "Explain the concept of Occam's Razor and provide a simple, everyday example."))
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
                  Input: interactions.NewInteractionsInput("Explain the concept of Occam's Razor and provide a simple, everyday example."),
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
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Explain the concept of Occam'\''s Razor and provide a simple example."
        }'
      ```


## 思考摘要 {#summaries}

思考摘要能讓你深入了解模型的內部推理流程。預設情況下，系統只會回傳最終輸出。你可以透過 `thinking_summaries` 啟用思考摘要：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="What is the sum of the first 50 prime numbers?",
          generation_config={
              "thinking_summaries": "auto"
          }
      )

      for step in interaction.steps:
          if step.type == "thought":
              print("Thought summary:")
              if step.summary:
                  for content_block in step.summary:
                      if content_block.type == "text":
                          print(content_block.text)
              print()
          elif step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print("Answer:")
                      print(content_block.text)
                      print()
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: "What is the sum of the first 50 prime numbers?",
          generation_config: {
              thinking_summaries: "auto"
          }
      });

      for (const step of interaction.steps) {
          if (step.type === "thought") {
              console.log("Thought summary:");
              if (step.summary) {
                  for (const contentBlock of step.summary) {
                      if (contentBlock.type === "text") console.log(contentBlock.text);
                  }
              }
          } else if (step.type === "model_output") {
              for (const contentBlock of step.content || []) {
                  if (contentBlock.type === "text") {
                      console.log("Answer:");
                      console.log(contentBlock.text);
                  }
              }
          }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.GenerationConfig;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.ThinkingSummaries;
      import com.google.genai.gaos.models.interactions.ThoughtStep;
      import com.google.genai.gaos.models.interactions.ThoughtSummaryContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Collections;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("What is the sum of the first 50 prime numbers?"))
              .generationConfig(
                  GenerationConfig.builder().thinkingSummaries(ThinkingSummaries.AUTO).build())
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      for (Step step : interaction.steps().orElse(Collections.emptyList())) {
        if (step instanceof ThoughtStep thoughtStep) {
          System.out.println("Thought summary:");
          for (ThoughtSummaryContent contentBlock : thoughtStep.summary().orElse(Collections.emptyList())) {
            if (contentBlock instanceof TextContent textContent) {
              System.out.println(textContent.text().orElse(""));
            }
          }
          System.out.println();
        } else if (step instanceof ModelOutputStep outputStep) {
          for (Content contentBlock : outputStep.content().orElse(Collections.emptyList())) {
            if (contentBlock instanceof TextContent textContent) {
              System.out.println("Answer:");
              System.out.println(textContent.text().orElse(""));
              System.out.println();
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
                  Input: interactions.NewInteractionsInput("What is the sum of the first 50 prime numbers?"),
                  GenerationConfig: &interactions.GenerationConfig{
                      ThinkingSummaries: interactions.ThinkingSummariesAuto.ToPointer(),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if thought := step.ThoughtStep; thought != nil {
                  for _, part := range thought.Summary {
                      if part.TextContent != nil {
                          fmt.Printf("Thought summary:\n%s\n\n", part.TextContent.Text)
                      }
                  }
              }
          }

          if res.Interaction.OutputText != nil {
              fmt.Printf("Answer:\n%s\n", *res.Interaction.OutputText)
          }
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "What is the sum of the first 50 prime numbers?",
          "generation_config": {
            "thinking_summaries": "auto"
          }
        }'
      ```


在下列情況下，思考區塊可能**只有簽章而沒有摘要**：

* 簡單的請求，模型沒有進行足夠的推理來產生摘要
* `thinking_summaries: "none"`，明確停用摘要
* 某些思考內容類型（例如圖片）可能沒有文字摘要

你的程式碼應隨時處理 `summary` 為空或不存在的思考區塊。

## 搭配思考功能的串流 {#streaming-with-thinking}

使用串流可在生成過程中逐步接收思考摘要。思考區塊透過 Server-Sent Events（SSE）傳遞，並使用兩種不同的差異類型：

| 差異類型 | 內容 | 傳送時機 |
| --- | --- | --- |
| `thought_summary` | 文字或圖片摘要內容 | 一個或多個包含增量摘要的差異 |
| `thought_signature` | 加密簽章 | `step.stop` 之前的最後一個差異 |



=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      prompt = """
      Alice, Bob, and Carol each live in a different house on the same street: red, green, and blue.
      Alice does not live in the red house.
      Bob does not live in the green house.
      Carol does not live in the red or green house.
      Which house does each person live in?
      """

      thoughts = ""
      answer = ""

      stream = client.interactions.create(
          model="gemini-4-hydrogen",
          input=prompt,
          generation_config={
              "thinking_summaries": "auto"
          },
          stream=True
      )

      for event in stream:
          if event.event_type == "step.delta":
              if event.delta.type == "thought_summary":
                  if not thoughts:
                      print("Thinking...")
                  summary_text = event.delta.content.text
                  print(f"[Thought] {summary_text}", end="")
                  thoughts += summary_text
              elif event.delta.type == "text" and event.delta.text:
                  if not answer:
                      print("\nAnswer:")
                  print(event.delta.text, end="")
                  answer += event.delta.text
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const prompt = `Alice, Bob, and Carol each live in a different house on the same
      street: red, green, and blue. Alice does not live in the red house.
      Bob does not live in the green house.
      Carol does not live in the red or green house.
      Which house does each person live in?`;

      let thoughts = "";
      let answer = "";

      const stream = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: prompt,
          generation_config: {
              thinking_summaries: "auto"
          },
          stream: true
      });

      for await (const event of stream) {
          if (event.event_type === "step.delta") {
              if (event.delta.type === "thought_summary") {
                  if (!thoughts) console.log("Thinking...");
                  if (event.delta.content?.type === "text") {
                      const text = event.delta.content.text;
                      process.stdout.write(`[Thought] ${text}`);
                      thoughts += text;
                  }
              } else if (event.delta.type === "text" && event.delta.text) {
                  if (!answer) console.log("\nAnswer:");
                  process.stdout.write(event.delta.text);
                  answer += event.delta.text;
              }
          }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.GenerationConfig;
      import com.google.genai.gaos.models.interactions.InteractionSSEEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEStreamEvent;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.StepDelta;
      import com.google.genai.gaos.models.interactions.StepDeltaData;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.TextDelta;
      import com.google.genai.gaos.models.interactions.ThinkingSummaries;
      import com.google.genai.gaos.models.interactions.ThoughtSummaryDelta;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.CreateInteractionResponse;
      import com.google.genai.gaos.utils.EventStream;

      Client client = new Client();

      String prompt =
          "Alice, Bob, and Carol each live in a different house on the same street: red, green, and blue.\n"
              + "Alice does not live in the red house.\n"
              + "Bob does not live in the green house.\n"
              + "Carol does not live in the red or green house.\n"
              + "Which house does each person live in?";

      StringBuilder thoughts = new StringBuilder();
      StringBuilder answer = new StringBuilder();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of(prompt))
              .generationConfig(
                  GenerationConfig.builder().thinkingSummaries(ThinkingSummaries.AUTO).build())
              .stream(true)
              .build();

      CreateInteractionResponse response =
          client.interactions.create(CreateInteractionRequestBody.of(params));

      try (EventStream<InteractionSSEStreamEvent> stream = response.events()) {
        for (InteractionSSEStreamEvent streamEvent : stream) {
          InteractionSSEEvent event = streamEvent.data().orElse(null);
          if (event instanceof StepDelta stepDelta) {
            StepDeltaData delta = stepDelta.delta().orElse(null);
            if (delta instanceof ThoughtSummaryDelta thoughtDelta) {
              Content content = thoughtDelta.content().orElse(null);
              if (content instanceof TextContent textContent) {
                if (thoughts.length() == 0) {
                  System.out.println("Thinking...");
                }
                String summaryText = textContent.text().orElse("");
                System.out.print("[Thought] " + summaryText);
                thoughts.append(summaryText);
              }
            } else if (delta instanceof TextDelta textDelta) {
              String text = textDelta.text().orElse("");
              if (!text.isEmpty()) {
                if (answer.length() == 0) {
                  System.out.println("\nAnswer:");
                }
                System.out.print(text);
                answer.append(text);
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
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      const prompt = `Alice, Bob, and Carol each live in a different house on the same street: red, green, and blue.
      Alice does not live in the red house.
      Bob does not live in the green house.
      Carol does not live in the red or green house.
      Which house does each person live in?`

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput(prompt),
                  GenerationConfig: &interactions.GenerationConfig{
                      ThinkingSummaries: interactions.ThinkingSummariesAuto.ToPointer(),
                  },
                  Stream: genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          stream := res.InteractionSSEStreamEvent
          defer stream.Close()

          for stream.Next() {
              event := stream.Value()
              if stepDelta := event.GetDataStepDelta(); stepDelta != nil {
                  if thoughtDelta := stepDelta.GetDeltaThoughtSummary(); thoughtDelta != nil {
                      if textContent := thoughtDelta.GetContentText(); textContent != nil {
                          fmt.Printf("[Thought] %s", textContent.Text)
                      }
                  }
                  if textDelta := stepDelta.GetDeltaText(); textDelta != nil {
                      fmt.Print(textDelta.GetText())
                  }
              }
          }
          if err := stream.Err(); err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -H 'Content-Type: application/json' \
        --no-buffer \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Alice, Bob, and Carol each live in a different house on the same street: red, green, and blue. Alice does not live in the red house. Bob does not live in the green house. Carol does not live in the red or green house. Which house does each person live in?",
          "generation_config": {
            "thinking_summaries": "auto"
          },
          "stream": true
        }'
      ```


串流回應使用 Server-Sent Events（SSE），由步驟與事件組成，例如：

```none
event: interaction.created
data: {"interaction":{"id":"v1_xxx","status":"in_progress","object":"interaction","model":"gemini-4-hydrogen"},"event_type":"interaction.created"}

event: step.start
data: {"index":0,"step":{"signature":"","summary":[{"text":"**Evaluating the clues**\n\nI'm considering...","type":"text"}],"type":"thought"},"event_type":"step.start"}

event: step.delta
data: {"index":0,"delta":{"signature":"EpoGCpcGAXLI2nx/...","type":"thought_signature"},"event_type":"step.delta"}

event: step.stop
data: {"index":0,"event_type":"step.stop"}

event: step.start
data: {"index":1,"step":{"content":[{"text":"Based on the clues provided, here","type":"text"}],"type":"model_output"},"event_type":"step.start"}

event: step.delta
data: {"index":1,"delta":{"text":" is the answer to your question...","type":"text"},"event_type":"step.delta"}

event: step.stop
data: {"index":1,"event_type":"step.stop"}

event: interaction.completed
data: {"interaction":{"id":"v1_xxx","status":"completed","usage":{"total_tokens":530,"total_input_tokens":62,"total_output_tokens":171,"total_thought_tokens":297}},"event_type":"interaction.completed"}

event: done
data: [DONE]
```

## 控制思考 {#thinking-levels}

Gemini 模型預設會進行動態思考，依請求的複雜程度自動調整推理投入的程度。你可以透過 `thinking_level` 參數控制這項行為。若要比較各模型的推理深度、速度與成本，請參閱[選擇模型](/docs/choosing-a-model/)。

| 模型 | 預設思考 | 支援的等級 |
| --- | --- | --- |
| gemini-4-carbon | On (medium) | low, medium, high |
| gemini-4-argon | On (medium) | low, medium, high |
| gemini-4-neon | On (high) | low, medium, high, xhigh |
| gemini-4-hydrogen | On (high) | low, medium, high, xhigh |
| gemini-3.8-flash | On (medium) | low, medium, high |
| gemini-3.6-flash | On (medium) | minimal, low, medium, high |
| gemini-3.5-flash-lite | On (minimal) | minimal, low, medium, high |
| gemini-3.1-pro-preview | On (high) | low, medium, high |
| gemini-3.1-flash-lite | On (minimal) | minimal, low, medium, high |
| gemini-3.1-flash-lite-image | On (minimal) | minimal, high |
| gemini-3-flash-preview | On (high) | minimal, low, medium, high |
| gemini-3-pro-preview | On (high) | low, high |
| gemini-2.5-pro | On | low, medium, high |
| gemini-2.5-flash | On | low, medium, high |
| gemini-2.5-flash-lite | Off | low, medium, high |
| gemini-robotics-er-2-preview | On (high) | minimal, low, medium, high |

### 了解思考等級 {#understanding-thinking-levels}

`thinking_level` 是你在 [Gemini 4 Neon](/docs/whats-new-gemini-4-neon/) 與 [Gemini 4 Hydrogen](/docs/whats-new-gemini-4-hydrogen/) 中控制品質、延遲與 token 用量的主要方式。這兩個模型預設皆為 `high`，且皆支援 `xhigh`：

| 思考等級 | token 用量 | 適用時機 |
| :--- | :--- | :--- |
| `low` | token 最少、延遲最低 | 對成本與延遲敏感的工作負載，例如快速聊天與高輸送量處理。在代理任務上仍具備不錯的能力。 |
| `medium` | token 用量較低、回應較快 | 互動式程式設計、即時 UI 原型製作、反應靈敏的聊天，以及對延遲敏感的工具呼叫。（`gemini-4-carbon`、`gemini-4-argon`、`gemini-3.8-flash` 與 `gemini-3.6-flash` 的預設值。） |
| `high`（`gemini-4-neon` 與 `gemini-4-hydrogen` 的預設值） | 在智慧與速度之間取得平衡 | 在 `gemini-4-neon` 與 `gemini-4-hydrogen` 上是大多數任務的建議預設值，包括複雜程式設計、代理執行、工具呼叫與多模態知識工作。在 `gemini-4-carbon`、`gemini-4-argon` 與 Gemini 3 模型上為最大推理深度。 |
| `xhigh` | token 最多、推理最深入 | 保留給 `high` 仍不足以應付的困難多步驟程式設計與代理問題，且你願意以較高的延遲與 token 用量交換（僅 `gemini-4-neon` 與 `gemini-4-hydrogen` 支援）。 |
| `minimal` | 接近關閉思考、延遲最低 | 在 `gemini-3.6-flash`、`gemini-3.5-flash-lite`（預設）、`gemini-3.1-flash-lite`、`gemini-3-flash-preview` 與 `gemini-robotics-er-2-preview` 上，大多數查詢都接近關閉設定。Gemini 4 模型與 `gemini-3.8-flash` 不支援。 |

大多數複雜任務可先從 `high` 開始，`xhigh` 則保留給 `high` 仍不足以應付的困難多步驟問題。使用 `xhigh` 會增加延遲與 token 用量，在文字或 JSON 擷取等較簡單的提示詞上，可能導致過度思考或耗盡 `max_output_tokens`。請在四個等級下都以較高的 `max_output_tokens` 執行評估，確保上限不會截斷答案，再挑選能達到品質標準的最低 `thinking_level`。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
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
        model: "gemini-4-hydrogen",
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
          "model": "gemini-4-hydrogen",
          "input": "Audit this payment retry queue for race conditions and rewrite the lock acquisition logic.",
          "generation_config": {
            "thinking_level": "xhigh"
          }
        }'
      ```


下列範例將 `thinking_level` 設為 `low`：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Provide a list of 3 famous physicists and their key contributions",
          generation_config={
              "thinking_level": "low"
          }
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Provide a list of 3 famous physicists and their key contributions",
          generation_config: {
              thinking_level: "low"
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
              .model(Model.of("gemini-4-hydrogen"))
              .input(
                  InteractionsInput.of(
                      "Provide a list of 3 famous physicists and their key contributions"))
              .generationConfig(GenerationConfig.builder().thinkingLevel(ThinkingLevel.LOW).build())
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
                  Input: interactions.NewInteractionsInput("Provide a list of 3 famous physicists and their key contributions"),
                  GenerationConfig: &interactions.GenerationConfig{
                      ThinkingLevel: interactions.ThinkingLevelLow.ToPointer(),
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

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Provide a list of 3 famous physicists and their key contributions",
          "generation_config": {
            "thinking_level": "low"
          }
        }'
      ```



### token 上限與 `max_output_tokens` {#token-limits}

[`max_output_tokens`](/api-reference/interactions-api/create-interaction/#request-body) 生成參數設定了回應可生成的 token 數量上限，包括思考 token 在內。

設定這個參數時，它會成為由基礎架構強制執行的硬性上限，不會改變模型分配思考預算（`thinking_level`）的方式。

如果模型在推理過程中達到這個上限，就會以 `"incomplete"` 狀態停止生成，並回傳截斷或空白的輸出（同時仍會針對已生成的思考 token 計費）。若要在不截斷回應的情況下降低成本或延遲，請調低 `thinking_level`（`low` 或 `medium`），而不是設定較小的 `max_output_tokens`。

使用 Gemini 4 模型（`gemini-4-carbon`、`gemini-4-argon`、`gemini-4-neon` 與 `gemini-4-hydrogen`）時，請留意下列上下文與輸出上限：

* **共用 1M 上下文視窗：** 輸入、思考與輸出 tokens 共用單一 100 萬 tokens 的上下文視窗（`1,048,576` 個 token）。如果輸入 tokens 加上 `max_output_tokens` 超過 1,048,576 tokens，API 會自動將輸出上限設為上下文視窗的剩餘空間（`1,048,576` 減去輸入 token 數）。
* **預設同步輸出上限（64K）：** 當 `background=False` 時，預設的 `max_output_tokens` 上限為 65,536 tokens。單次前景跳轉在串流呼叫，以及 `gemini-4-neon` 與 `gemini-4-hydrogen` 的非串流呼叫中最多可生成 65,536 tokens；在 `gemini-4-carbon` 與 `gemini-4-argon` 的非串流呼叫中則最多為 32,768 tokens。
* **長解碼（最多 1M tokens）：** 若要讓 Gemini 4 推理並生成超過 `65,536` 個 token 的內容（最多 `1,048,576` 個 token），請將 `max_output_tokens` 設定為大於 `65,536`，並搭配 `background=True` 或用戶端接續。詳情請參閱[長解碼](/docs/long-decode/)。

## 思考簽章 {#signatures}

思考簽章是模型內部推理的加密表示。在多輪互動中，必須保留思考簽章，才能維持推理的連續性。

相較於 `generateContent` API，Interactions API 大幅簡化了思考簽章的處理方式。

### 有狀態模式（建議） {#stateful-mode-recommended}

預設情況下，當你以有狀態模式使用 Interactions API（設定 `store: true`，並在後續輪次傳入 `previous_interaction_id`）時，伺服器會自動管理對話狀態，包括所有思考區塊與簽章。在這種模式下，你不需要對簽章做任何處理，全部由伺服器端負責。

### 無狀態模式 {#stateless-mode}

如果你自行管理對話狀態（無狀態模式），並在每個請求中傳入完整的輸入與輸出歷史紀錄：

* 你**必須**一律將所有 `thought` 區塊依接收時的原樣重新傳送。
* 你**不應**從歷史紀錄中移除或修改思考區塊，因為這些區塊包含模型繼續推理所需的簽章。
* 在同一個工作階段中切換模型時，仍應重新傳送前一個模型的思考區塊。後端會負責處理相容性。


!!! note " "

      注意：Google 搜尋等內建工具可能在呼叫／結果區塊上帶有各自不同的簽章。在無狀態模式下，你也必須在後續輪次重新傳送這些工具結果簽章。


## 定價 {#pricing}

啟用思考功能時，回應的定價是輸出 tokens 與思考 token 的總和。你可以從 `total_thought_tokens` 欄位取得生成的思考 token 總數。


=== "Python"

      ```python
      print("Thoughts tokens:", interaction.usage.total_thought_tokens)
      print("Output tokens:", interaction.usage.total_output_tokens)
      ```

=== "JavaScript"

      ```javascript
      console.log(`Thoughts tokens: ${interaction.usage.total_thought_tokens}`);
      console.log(`Output tokens: ${interaction.usage.total_output_tokens}`);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Usage;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Explain the concept of Occam's Razor."))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.usage().isPresent()) {
        Usage usage = interaction.usage().get();
        System.out.println("Thoughts tokens: " + usage.totalThoughtTokens().orElse(0));
        System.out.println("Output tokens: " + usage.totalOutputTokens().orElse(0));
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
                  Input: interactions.NewInteractionsInput("Explain the concept of Occam's Razor."),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if usage := res.Interaction.Usage; usage != nil {
              if usage.TotalThoughtTokens != nil {
                  fmt.Println("Thoughts tokens:", *usage.TotalThoughtTokens)
              }
              if usage.TotalOutputTokens != nil {
                  fmt.Println("Output tokens:", *usage.TotalOutputTokens)
              }
          }
      }
      ```


思考模型會生成完整的思考內容來提升最終回應的品質，再輸出[摘要](/docs/thinking/#summaries)，讓你了解思考流程。定價是依模型需要生成的完整思考 token 計算，即使 API 只輸出摘要也一樣。


!!! note " "

      由於 `max_output_tokens` 適用於思考 token 與輸出 tokens 的合計總數，設定過低的上限可能會截斷回應。詳情請參閱[token 上限與 `max_output_tokens`](/docs/thinking/#token-limits)。


你可以在[計算 token 數](/docs/tokens/)指南中進一步了解 token。

## 最佳做法 {#best-practices}

請遵循下列準則，有效率地使用思考模型。

- **檢視推理**：分析思考摘要，了解失敗原因並改善提示詞。
- **控制思考預算**：在需要冗長輸出時，提示模型減少思考，以節省 token。
- **簡單任務**：事實檢索或分類使用最低限度的思考（例如「DeepMind 是在哪裡創立的？」）。
- **中等任務**：比較概念或創意推理使用預設思考（例如比較電動車與油電混合車）。
- **複雜任務**：進階程式設計、數學或多步驟規劃使用最大思考（例如解 AIME 數學題）。

## 後續步驟 {#whats-next}

- [文字生成](/docs/text-generation/)：基本文字回應
- [函式呼叫](/docs/function-calling/)：連接到工具
- [最新 Gemini 模型](/docs/latest-model/)：比較模型並閱讀最新消息指南
