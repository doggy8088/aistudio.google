# 背景執行

對於深度研究、複雜推理或多步驟代理執行這類長時間執行的任務，標準 HTTP 請求（通常在 60 秒後關閉）可能會因連線逾時而中斷。[Interactions API](/docs/interactions-overview/) 提供**背景執行**功能，可非同步執行這類任務。

若要讓互動在伺服器上持續執行直到任務完成，請在建立互動時設定 `"background": true`。API 會立即回傳互動 ID，用戶端應用程式可用這個 ID 輪詢狀態、串流進度，或重新連接已中斷的串流。

背景執行支援標準 Gemini 模型（例如 `gemini-4-carbon`、`gemini-4-argon`、`gemini-4-neon`、`gemini-4-hydrogen` 與 `gemini-3.8-flash`），以及 Managed Agents（例如 `antigravity-preview-09-2026`）。

## 建立背景互動 {#create-a-background-interaction}

若要啟動背景互動，請在建立資源時將 `background` 參數設為 `true`。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Write a guide on space exploration.",
          background=True,
      )
      print(f"Created background interaction ID: {interaction.id}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Write a guide on space exploration.",
          background: true,
      });
      console.log(`Created background interaction ID: ${interaction.id}`);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model("gemini-4-hydrogen")
              .input(InteractionsInput.of("Write a guide on space exploration."))
              .background(true)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      System.out.println("Created background interaction ID: " + interaction.id().orElse(""));
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
                  Model:      interactions.Model("gemini-4-hydrogen"),
                  Input:      interactions.NewInteractionsInput("Write a guide on space exploration."),
                  Background: genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if res.Interaction.ID != nil {
              fmt.Printf("Created background interaction ID: %s\n", *res.Interaction.ID)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Write a guide on space exploration.",
          "background": true
        }'
      ```

=== "CLI"

      ```bash
      gemini-api agent run "Write a guide on space exploration." -m gemini-4-hydrogen \
        --background --stream=false --jq '.id'
      ```


## 背景執行的運作方式 {#how-background-execution-works}

建立背景互動後，任務會在伺服器上非同步執行。互動會歷經多種執行狀態：

*   `in_progress`：伺服器正在積極執行互動（例如執行程式碼或進行研究）。
*   `requires_action`：互動已暫停，正在等待用戶端輸入（例如確認工具執行或回答問題）。
*   `completed`：互動已成功完成，輸出可供使用。
*   `failed`：執行期間發生錯誤（例如工具失敗或速率限制）。
*   `cancelled`：用戶端請求已停止執行。


!!! note " "

      互動狀態的完整清單，請參閱 [Interactions API 參考文件](/api-reference/interactions-api/#Resource:Interaction)。


### 使用案例 {#use-cases}

以下情況適合使用背景執行：

*   **代理執行**：需要程式碼執行、網頁瀏覽或子代理協調的任務（例如 `antigravity-preview-09-2026`）。
*   **深度研究**：使用 `deep-research-preview-04-2026` 或 `deep-research-max-preview-04-2026` 執行、需耗時數分鐘的研究。
*   **長時間推理**：模型思考步驟較長、超出標準 HTTP 連線上限的任務。
*   **長解碼（Gemini 4）**：產生超過 `65,536` 個 token 的延伸完成內容的任務。在 `gemini-4-carbon`、`gemini-4-argon`、`gemini-4-neon` 與 `gemini-4-hydrogen` 上，你可以透過[長解碼](/docs/long-decode/)將 `max_output_tokens` 設為最高 `1,048,576` 個 token。


!!! note " "

      當 `background=False`（預設）時，單次前景跳轉的輸出 token 上限為 65,536 個，適用於串流呼叫與 `gemini-4-neon` 及 `gemini-4-hydrogen` 的非串流呼叫（`gemini-4-carbon` 與 `gemini-4-argon` 的非串流呼叫則為 32,768 個輸出 tokens）。若要在 `background=False` 的情況下產生超過 65,536 tokens，請使用[用戶端接續](/docs/long-decode/#client-side-continuation)。


### 背景執行的資料保留 {#data-retention}

背景執行（`background=True`）需要 `store=True`（預設值），伺服器才能在你輪詢或串流結果時儲存互動。若同時傳入 `background=True` 與 `store=False`，會回傳 `400` 錯誤。

已儲存的背景互動遵循標準的 [Interactions API 資料儲存與保留](/docs/interactions-overview/#data-storage-retention)政策：

*   **付費方案**：保留 **55 天**（可在 [Google AI Studio](https://aistudio.google.com/logs) 中設定為 7、14、28 或 55 天）。
*   **免費方案**：保留 **1 天**。

若要提早移除背景互動，請在取得結果後[刪除該互動](/docs/background-execution/#cancellation-and-deletion)。

## 取得結果 {#retrieve-results}

你可以使用**輪詢**或**串流**取得背景互動的結果。

### 輪詢模式（非阻塞） {#polling-pattern-non-blocking}

輪詢會使用非阻塞的 GET 請求定期檢查互動狀態，直到互動達到終止狀態為止。


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client()

      interaction = client.interactions.get(id="YOUR_INTERACTION_ID")

      while interaction.status == "in_progress":
          time.sleep(5)
          interaction = client.interactions.get(id=interaction.id)

      if interaction.status == "completed":
          print(interaction.output_text)
      else:
          print(f"Finished with status: {interaction.status}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      let interaction = await client.interactions.get("YOUR_INTERACTION_ID");

      while (interaction.status === "in_progress") {
          await new Promise(resolve => setTimeout(resolve, 5000));
          interaction = await client.interactions.get(interaction.id);
      }

      if (interaction.status === "completed") {
          console.log(interaction.output_text);
      } else {
          console.log(`Finished with status: ${interaction.status}`);
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionStatus;
      import com.google.genai.gaos.models.operations.GetInteractionByIdRequest;

      Client client = new Client();

      Interaction interaction =
          client.interactions
              .get(GetInteractionByIdRequest.builder().id("YOUR_INTERACTION_ID").build())
              .interaction()
              .get();

      while (InteractionStatus.IN_PROGRESS.equals(interaction.status().orElse(null))) {
        Thread.sleep(5000);
        interaction =
            client.interactions
                .get(GetInteractionByIdRequest.builder().id(interaction.id().get()).build())
                .interaction()
                .get();
      }

      if (InteractionStatus.COMPLETED.equals(interaction.status().orElse(null))) {
        System.out.println(interaction.outputText().orElse(""));
      } else {
        System.out.println(
            "Finished with status: " + interaction.status().map(InteractionStatus::value).orElse(""));
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
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
              ID: "YOUR_INTERACTION_ID",
          })
          if err != nil {
              log.Fatal(err)
          }
          interaction := res.Interaction

          for interaction.Status == interactions.InteractionStatusInProgress {
              time.Sleep(5 * time.Second)
              res, err = client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                  ID: *interaction.ID,
              })
              if err != nil {
                  log.Fatal(err)
              }
              interaction = res.Interaction
          }

          if interaction.Status == interactions.InteractionStatusCompleted {
              if interaction.OutputText != nil {
                  fmt.Println(*interaction.OutputText)
              }
          } else {
              fmt.Printf("Finished with status: %s\n", interaction.Status)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/interactions/YOUR_INTERACTION_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20"
      ```

=== "CLI"

      ```bash
      # Exits with code 1 if the interaction is "failed" or "cancelled".
      gemini-api agent status YOUR_INTERACTION_ID -o json
      ```


### 串流模式 {#streaming-pattern}

如果網路中斷導致串流斷線，串流可以從最後收到的事件接續。每個 delta 的酬載中都包含唯一的 `event_id`。將這個 ID 作為 `last_event_id` 傳入，即可從該事件接續串流。

!!! note " "

      受管代理的串流（例如 `antigravity-preview-09-2026`）目前尚未發出 `event_id` 續接游標，因此重新連線時會從 `interaction.created` 開始重播。

=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client()
      interaction_id = "YOUR_INTERACTION_ID"

      def stream_with_reconnect(interaction_id: str):
          last_event_id = None
          while True:
              try:
                  # Retrieve the stream. If resuming, pass last_event_id
                  stream = client.interactions.get(
                      id=interaction_id,
                      stream=True,
                      last_event_id=last_event_id
                  )

                  for event in stream:
                      # Log event updates and capture event_id if present
                      if event.event_id:
                          last_event_id = event.event_id

                      if event.event_type == "step.delta" and event.delta.type == "text":
                          print(event.delta.text, end="", flush=True)

                      if event.event_type == "interaction.completed":
                          return

              except Exception as e:
                  print(f"\n[Connection lost: {e}. Reconnecting in 3s...]")
                  time.sleep(3)

      stream_with_reconnect(interaction_id)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});
      const interactionId = "YOUR_INTERACTION_ID";

      async function streamWithReconnect(id = interactionId) {
          let lastEventId = "";
          while (true) {
              try {
                  // Retrieve the stream. If resuming, pass last_event_id in options
                  const eventStream = await client.interactions.get(id, {
                      stream: true,
                      last_event_id: lastEventId
                  });

                  for await (const event of eventStream) {
                      if (event.event_id) {
                          lastEventId = event.event_id;
                      }

                      if (event.event_type === "step.delta" && event.delta?.type === "text") {
                          process.stdout.write(event.delta.text);
                      }

                      if (event.event_type === "interaction.completed") {
                          return;
                      }
                  }
              } catch (error) {
                  const message = error instanceof Error ? error.message : String(error);
                  console.log(`\n[Connection lost: ${message}. Reconnecting in 3s...]`);
                  await new Promise(resolve => setTimeout(resolve, 3000));
              }
          }
      }

      await streamWithReconnect(interactionId);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.InteractionCompletedEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEStreamEvent;
      import com.google.genai.gaos.models.interactions.StepDelta;
      import com.google.genai.gaos.models.interactions.TextDelta;
      import com.google.genai.gaos.models.operations.GetInteractionByIdRequest;
      import com.google.genai.gaos.utils.EventStream;

      Client client = new Client();
      String interactionId = "YOUR_INTERACTION_ID";
      String lastEventId = null;
      boolean completed = false;

      while (!completed) {
        try (EventStream<InteractionSSEStreamEvent> stream =
            client.interactions
                .get(
                    GetInteractionByIdRequest.builder()
                        .id(interactionId)
                        .stream(true)
                        .lastEventId(lastEventId)
                        .build())
                .events()) {
          for (InteractionSSEStreamEvent streamEvent : stream) {
            InteractionSSEEvent event = streamEvent.data().orElse(null);
            if (event instanceof StepDelta) {
              StepDelta stepDelta = (StepDelta) event;
              if (stepDelta.eventId().isPresent()) {
                lastEventId = stepDelta.eventId().get();
              }
              if (stepDelta.delta().isPresent() && stepDelta.delta().get() instanceof TextDelta) {
                System.out.print(((TextDelta) stepDelta.delta().get()).text().orElse(""));
                System.out.flush();
              }
            } else if (event instanceof InteractionCompletedEvent) {
              completed = true;
              break;
            }
          }
        } catch (Exception e) {
          System.out.println("\n[Connection lost: " + e.getMessage() + ". Reconnecting in 3s...]");
          Thread.sleep(3000);
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
          "time"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          interactionID := "YOUR_INTERACTION_ID"
          var lastEventID *string
          completed := false

          for !completed {
              res, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                  ID:          interactionID,
                  Stream:      genai.Ptr(true),
                  LastEventID: lastEventID,
              })
              if err != nil {
                  fmt.Printf("\n[Connection lost: %v. Reconnecting in 3s...]\n", err)
                  time.Sleep(3 * time.Second)
                  continue
              }

              stream := res.InteractionSSEStreamEvent
              for stream.Next() {
                  event := stream.Value()
                  if stepDelta := event.GetDataStepDelta(); stepDelta != nil {
                      if stepDelta.EventID != nil {
                          lastEventID = stepDelta.EventID
                      }
                      if textDelta := stepDelta.GetDeltaText(); textDelta != nil {
                          fmt.Print(textDelta.GetText())
                      }
                  } else if event.GetDataInteractionCompleted() != nil {
                      completed = true
                      break
                  }
              }
              if err := stream.Err(); err != nil {
                  fmt.Printf("\n[Stream error: %v. Reconnecting in 3s...]\n", err)
                  _ = stream.Close()
                  time.Sleep(3 * time.Second)
                  continue
              }
              _ = stream.Close()
          }
      }
      ```

=== "REST"

      ```bash
      curl -N -X GET "https://generativelanguage.googleapis.com/v1beta/interactions/YOUR_INTERACTION_ID?stream=true&last_event_id=YOUR_LAST_EVENT_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20"
      ```

=== "CLI"

      ```bash
      # Add -o json to emit full NDJSON SSE events (including event_id for reconnection).
      # Default output prints text deltas only.
      gemini-api agent status YOUR_INTERACTION_ID --stream --last-event-id YOUR_LAST_EVENT_ID
      ```


## 多輪對話 {#multi-turn-conversations}

後續互動可以使用 `previous_interaction_id` 串接到背景對話，但須遵守以下限制：

1.  **執行中的互動無法串接**：將後續互動串接到狀態為 `in_progress` 的互動，會回傳 `400 Bad Request` 錯誤。請等互動達到 `completed` 狀態後，再啟動下一個互動。
2.  **Managed Agents 的環境參數**：為 Managed Agents（例如 `antigravity-preview-09-2026`）串接互動時，請求必須同時包含 `previous_interaction_id` 與 `environment`。

以下範例說明如何串接互動：


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})
      agent_model = "antigravity-preview-09-2026"

      # First interaction: Provision sandbox environment and execute first instruction
      interaction1 = client.interactions.create(
          agent=agent_model,
          input="Create a folder named project/ and write hello.py inside.",
          environment="remote",
          background=True
      )

      # Wait for completion
      while True:
          check = client.interactions.get(id=interaction1.id)
          if check.status != "in_progress":
              break
          time.sleep(2)

      # Second interaction: Chain using previous_interaction_id and environment
      interaction2 = client.interactions.create(
          agent=agent_model,
          input="List all files in the project/ directory.",
          previous_interaction_id=interaction1.id,
          environment="remote",
          background=True
      )
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });
      const agentModel = "antigravity-preview-09-2026";

      // First interaction: Provision sandbox environment and execute first instruction
      const interaction1 = await client.interactions.create({
          agent: agentModel,
          input: "Create a folder named project/ and write hello.py inside.",
          environment: "remote",
          background: true
      });

      // Wait for completion
      while (true) {
          const check = await client.interactions.get(interaction1.id);
          if (check.status !== "in_progress") {
              break;
          }
          await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Second interaction: Chain using previous_interaction_id and environment
      const interaction2 = await client.interactions.create({
          agent: agentModel,
          input: "List all files in the project/ directory.",
          previous_interaction_id: interaction1.id,
          environment: "remote",
          background: true
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionStatus;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.GetInteractionByIdRequest;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
      String agentModel = "antigravity-preview-09-2026";

      // First interaction: Provision sandbox environment and execute first instruction
      CreateModelInteraction params1 =
          CreateModelInteraction.builder()
              .model(agentModel)
              .input(InteractionsInput.of("Create a folder named project/ and write hello.py inside."))
              .environment(CreateModelInteractionEnvironment.of("remote"))
              .background(true)
              .build();

      Interaction interaction1 =
          client.interactions.create(CreateInteractionRequestBody.of(params1)).interaction().get();

      // Wait for completion
      while (true) {
        Interaction check =
            client.interactions
                .get(GetInteractionByIdRequest.builder().id(interaction1.id().get()).build())
                .interaction()
                .get();
        if (!InteractionStatus.IN_PROGRESS.equals(check.status().orElse(null))) {
          break;
        }
        Thread.sleep(2000);
      }

      // Second interaction: Chain using previousInteractionId and environment
      CreateModelInteraction params2 =
          CreateModelInteraction.builder()
              .model(agentModel)
              .input(InteractionsInput.of("List all files in the project/ directory."))
              .previousInteractionId(interaction1.id().get())
              .environment(CreateModelInteractionEnvironment.of("remote"))
              .background(true)
              .build();

      Interaction interaction2 =
          client.interactions.create(CreateInteractionRequestBody.of(params2)).interaction().get();
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
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

          agentModel := interactions.Model("antigravity-preview-09-2026")
          remoteEnv := interactions.NewCreateModelInteractionEnvironment("remote")

          // First interaction: Provision sandbox environment and execute first instruction
          res1, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:       agentModel,
                  Input:       interactions.NewInteractionsInput("Create a folder named project/ and write hello.py inside."),
                  Environment: &remoteEnv,
                  Background:  genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          // Wait for completion
          for {
              check, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                  ID: *res1.Interaction.ID,
              })
              if err != nil {
                  log.Fatal(err)
              }
              if check.Interaction.Status != interactions.InteractionStatusInProgress {
                  break
              }
              time.Sleep(2 * time.Second)
          }

          // Second interaction: Chain using PreviousInteractionID and Environment
          _, err = client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:                 agentModel,
                  Input:                 interactions.NewInteractionsInput("List all files in the project/ directory."),
                  PreviousInteractionID: res1.Interaction.ID,
                  Environment:           &remoteEnv,
                  Background:            genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```bash
      # Chain second interaction (Make sure FIRST_INTERACTION_ID has status 'completed')
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "List all files in the project/ directory.",
          "previous_interaction_id": "FIRST_INTERACTION_ID",
          "environment": "remote",
          "background": true
        }'
      ```

=== "CLI"

      ```bash
      FIRST_ID=$(gemini-api agent run "Create a folder named project/ and write hello.py inside." \
        --agent antigravity-preview-09-2026 --body '{"environment": "remote"}' \
        --background --stream=false --jq '.id')
      # Wait until gemini-api agent status "$FIRST_ID" --jq '.status' returns "completed"
      # (exits with code 1 if the interaction ends in "failed" or "cancelled").
      gemini-api agent run "List all files in the project/ directory." \
        --agent antigravity-preview-09-2026 --previous-interaction-id "$FIRST_ID" \
        --body '{"environment": "remote"}' --background --stream=false --jq '.id'
      ```


## 取消與刪除 {#cancellation-and-deletion}

你可以使用取消與刪除請求，控制執行中的任務並管理儲存空間：

*   **取消（`POST /interactions/{id}/cancel`）**：停止執行中的任務，狀態會轉為 `cancelled`。由於伺服器需要進行清理作業，GET 請求中的狀態更新可能會稍有延遲。
*   **刪除（`DELETE /interactions/{id}`）**：從伺服器移除互動記錄。後續的 GET 請求會回傳 `404 Not Found` 錯誤。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      # Cancel a running interaction
      client.interactions.cancel(id="YOUR_INTERACTION_ID")

      # Delete the interaction record entirely
      client.interactions.delete(id="YOUR_INTERACTION_ID")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      // Cancel a running interaction
      await client.interactions.cancel("YOUR_INTERACTION_ID");

      // Delete the interaction record entirely
      await client.interactions.delete("YOUR_INTERACTION_ID");
      ```

=== "Java"

      ```java
      import com.google.genai.Client;

      Client client = new Client();

      // Cancel a running interaction
      client.interactions.cancel("YOUR_INTERACTION_ID");

      // Delete the interaction record entirely
      client.interactions.delete("YOUR_INTERACTION_ID");
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          // Cancel a running interaction
          _, err = client.Interactions.Cancel(ctx, operations.CancelInteractionByIDRequest{
              ID: "YOUR_INTERACTION_ID",
          })
          if err != nil {
              log.Fatal(err)
          }

          // Delete the interaction record entirely
          _, err = client.Interactions.Delete(ctx, operations.DeleteInteractionRequest{
              ID: "YOUR_INTERACTION_ID",
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```bash
      # Cancel the interaction
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions/YOUR_INTERACTION_ID/cancel" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20"

      # Delete the interaction
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/interactions/YOUR_INTERACTION_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20"
      ```

=== "CLI"

      ```bash
      gemini-api agent cancel YOUR_INTERACTION_ID
      gemini-api agent delete-interaction YOUR_INTERACTION_ID
      ```


## 後續步驟 {#next-steps}

*   閱讀 [Interactions API 總覽](/docs/interactions-overview/)，瞭解工作階段與狀態管理。
*   查看[串流互動](/docs/streaming/)指南，瞭解即時事件更新的詳細資訊。
*   探索 [Managed agents 快速入門](/docs/managed-agents-quickstart/)，建立具狀態的多輪代理。

