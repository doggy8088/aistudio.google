# 串流互動

建立 Interaction 時，你可以設定 `stream: true`，透過 [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)（SSE）以串流方式逐步接收回應。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      stream = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Count from 1 to 25.",
          stream=True,
      )
      for event in stream:
          if event.event_type == "step.delta":
              if event.delta.type == "text":
                  print(event.delta.text, end="", flush=True)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const stream = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Count from 1 to 25.",
          stream: true,
      });
      for await (const event of stream) {
          if (event.event_type === "step.delta") {
              if (event.delta.type === "text") {
                  process.stdout.write(event.delta.text);
              }
          }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.InteractionSSEEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEStreamEvent;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.StepDelta;
      import com.google.genai.gaos.models.interactions.StepDeltaData;
      import com.google.genai.gaos.models.interactions.TextDelta;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.CreateInteractionResponse;
      import com.google.genai.gaos.utils.EventStream;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Count from 1 to 25."))
              .stream(true)
              .build();

      CreateInteractionResponse response =
          client.interactions.create(CreateInteractionRequestBody.of(params));

      try (EventStream<InteractionSSEStreamEvent> events = response.events()) {
        for (InteractionSSEStreamEvent streamEvent : events) {
          InteractionSSEEvent event = streamEvent.data().orElse(null);
          if (event instanceof StepDelta stepDelta) {
            StepDeltaData data = stepDelta.delta().orElse(null);
            if (data instanceof TextDelta textDelta) {
              textDelta.text().ifPresent(System.out::print);
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
                  Model:  interactions.Model("gemini-4-hydrogen"),
                  Input:  interactions.NewInteractionsInput("Explain quantum computing in simple terms."),
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

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        --no-buffer \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Count from 1 to 25.",
          "stream": true
        }'
      ```


```none
event: interaction.created
data: {"interaction":{"id":"v1_...","status":"in_progress","object":"interaction","model":"gemini-4-hydrogen"},"event_type":"interaction.created"}

event: interaction.status_update
data: {"interaction_id":"v1_...","status":"in_progress","event_type":"interaction.status_update"}

event: step.start
data: {"index":0,"step":{"type":"thought"},"event_type":"step.start"}

event: step.delta
data: {"index":0,"delta":{"signature":"...","type":"thought_signature"},"event_type":"step.delta"}

event: step.stop
data: {"index":0,"event_type":"step.stop"}

event: step.start
data: {"index":1,"step":{"type":"model_output"},"event_type":"step.start"}

event: step.delta
data: {"index":1,"delta":{"text":"1, 2, 3, 4, 5, 6, ","type":"text"},"event_type":"step.delta"}

event: step.delta
data: {"index":1,"delta":{"text":"7, 8, 9, 10, 11, 12, 13,","type":"text"},"event_type":"step.delta"}

...

event: step.stop
data: {"index":1,"event_type":"step.stop"}

event: interaction.completed
data: {"interaction":{"id":"v1_...","status":"completed","usage":{"total_tokens":346,"total_input_tokens":11,"input_tokens_by_modality":[{"modality":"text","tokens":11}],"total_cached_tokens":0,"total_output_tokens":90,"total_tool_use_tokens":0,"total_thought_tokens":245},"created":"2026-05-12T18:44:51Z","updated":"2026-05-12T18:44:51Z","service_tier":"standard","object":"interaction","model":"gemini-4-hydrogen"},"event_type":"interaction.completed"}

event: done
data: [DONE]
```

## 事件類型 {#event-types}

每個 server-sent event 都包含具名的 `event_type` 與相關的 JSON 資料。Interactions API 採用對稱的串流模型，所有內容——文字、工具呼叫、思考——都透過一致的**步驟式**事件傳遞。

每個串流都遵循以下事件流程：

1. `interaction.created`：互動已建立，包含中繼資料（ID、模型、狀態）。
2. 一系列的**步驟**，每個步驟包含：
   - 一個 `step.start` 事件，標示步驟類型（例如 `model_output`、`thought`、`function_call`）。
   - 一個或多個 `step.delta` 事件，攜帶該步驟的增量資料。
   - 一個 `step.stop` 事件，標示該步驟完成。

3. 一個 `interaction.completed` 事件，附帶最終的 `usage` 統計資料。

當你設定 `stream: false` 時，API 會回傳單一 `interaction` 物件，其中包含 `steps` 陣列。`steps` 中的每個元素，就是一個 `step.start` → `step.delta`（可多個）→ `step.stop` 循環完整組裝後的結果。

### `interaction.created` {#event-interaction-created}

在互動首次建立時送出。包含互動 ID、模型與初始狀態。

```none
event: interaction.created
data: {"interaction": {"id": "...", "model": "gemini-4-hydrogen", "status": "in_progress", "object": "interaction"}, "event_type": "interaction.created"}
```

### `interaction.status_update` {#event-interaction-status-update}

表示互動層級的狀態轉換。可能出現在步驟之間。

```none
event: interaction.status_update
data: {"interaction_id": "...", "status": "in_progress", "event_type": "interaction.status_update"}
```

### `step.start` {#event-step-start}

標示新步驟的開始。包含步驟的 `type` 與 `index`。步驟類型決定了預期會收到哪些 delta 類型，以及該步驟在非串流回應中的呈現方式：

| 步驟類型 | 預期的 Delta 類型 | 說明 |  |
| --- | --- | --- | --- |
| `model_output` | `text`, `image`, `audio` | 模型的最終回應內容。 |  |
| `thought` | `thought_signature`, `thought_summary` | 思維鏈推理。`summary` 僅在啟用 `thinking_summaries` 時才會出現。 |  |
| `function_call` | `arguments_delta` | 要求用戶端執行函式的請求。會將互動狀態設為 `requires_action`。 |  |
| 伺服器端工具 | 依工具而異 | 由 API 執行的工具（例如 `google_search_call`、`google_search_result`、`code_execution_call`、`code_execution_result`）。 |  |

完整清單請參閱 [Interactions API 參考文件](/api-reference/interactions-api/)。

```none
event: step.start
data: {"index": 0, "step": {"type": "model_output"}, "event_type": "step.start"}
```

若是函式呼叫，該步驟會包含函式名稱、id 以及空的引數 `{}`。

```none
event: step.start
data: {"index": 0, "step": {"type": "function_call", "id":"un6k8t18", "name": "get_weather", "arguments":{}}, "event_type": "step.start"}
```

### `step.delta` {#event-step-delta}

目前步驟的增量資料。`delta` 物件包含一個 `type` 欄位，用以決定其結構。

**範例：**

**`text`**：來自 `model_output` 步驟的增量文字權杖：

```none
event: step.delta
data: {"index": 0, "delta": {"type": "text", "text": "Hello, my name is Phil"}, "event_type": "step.delta"}

event: step.delta
data: {"index": 0, "delta": {"type": "text", "text": ", and I live in Germany." }, "event_type": "step.delta"}
```

**`image`**：來自 `model_output` 步驟、經 Base64 編碼的圖片資料：

```none
event: step.delta
data: {"index": 0, "delta": {"type": "image", "mime_type": "image/jpeg", "data": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCg..."}, "event_type": "step.delta"}
```

**`thought_summary`**：來自 `thought` 步驟的思考摘要內容：

```none
event: step.delta
data: {"index": 0, "delta": {"type": "thought_summary", "content": {"type": "text", "text": "I need to find the GCD..."}}, "event_type": "step.delta"}
```

**`arguments_delta`**：函式呼叫引數的（部分）JSON 字串。必須跨多個 delta 累積：

```none
event: step.delta
data: {"index": 0, "delta": {"type": "arguments_delta", "arguments": "{\"location\": \"San Francisco, CA\"}"}, "event_type": "step.delta"}
```

以上是一些最常見的 delta 類型。所有 delta 類型的完整清單，請參閱 [Interactions API 參考文件](/api-reference/interactions-api/)。

### `step.stop` {#event-step-stop}

標示步驟的結束。包含步驟的 `index`。

```none
event: step.stop
data: {"index": 0, "event_type": "step.stop"}
```

使用 [Antigravity Agent](/docs/antigravity-agent/) 時，
`step.stop` 事件也可能包含用量統計：

*   **`usage`**：自互動開始以來累積的用量（累計總量）。
*   **`step_usage`**：這個特定步驟的用量。

```none
event: step.stop
data: {"index": 2, "event_type": "step.stop", "usage": {"total_tokens": 4650, "total_input_tokens": 3577, "total_output_tokens": 305, "total_cached_tokens": 0}, "step_usage": {"total_tokens": 303, "total_input_tokens": 31, "total_output_tokens": 3, "total_cached_tokens": 0}}
```

### `interaction.completed` {#event-interaction-completed}

在互動完成時送出。包含最終的互動物件與 `usage` 統計資料。在非串流模式下，這就是最上層的回應物件本身。回應中不包含 `steps`。

```none
event: interaction.completed
data: {"interaction": {"id": "v1_abc123", "status": "completed", "usage": {"total_input_tokens": 7, "total_output_tokens": 12, "total_tokens": 19}}, "event_type": "interaction.completed"}
```

### `error` {#event-error}

在互動過程中發生錯誤時送出。包含帶有訊息與代碼的錯誤物件。

```none
event: error
data: {"error":{"message":"Deadline expired before operation could complete.","code":"gateway_timeout"},"event_type":"error"}
```

## 搭配工具使用串流 {#streaming-with-tools}

Interactions API 支援在單一請求中同時搭配用戶端工具（函式呼叫）與伺服器端工具（Google Search、Code Execution 等）進行串流。串流期間，工具的叫用會以具型別的步驟形式出現在事件串流中。對於函式呼叫，`step.start` 事件會傳遞函式名稱，`step.delta` 事件則以 JSON 字串（`arguments_delta`）的形式串流引數。你必須累積這些 delta，才能取得完整的引數。Google Search 等伺服器端工具會由 API 自動執行，產生 `google_search_call` 與 `google_search_result` 步驟。

### 搭配函式呼叫使用串流 {#streaming-with-function-calling}

若要搭配串流執行函式呼叫，用戶端必須處理多輪對話：

1. **第 1 輪（函式請求）**：呼叫 `interactions.create`，並設定 `stream: true` 以及你定義的 `tools`。API 會串流一個 `function_call` 步驟。你必須累積增量的引數 JSON 字串（`arguments_delta`），這些字串來自 `step.delta` 事件，直到互動以 `requires_action` 狀態完成。
2. **第 2 輪（送出結果）**：再次呼叫 `interactions.create`，傳入 `previous_interaction_id`（與第一個互動的 ID 相符），並送出一個 `function_result` 區塊，將其置於 `input` 陣列中。這會恢復串流，讓模型產生最終回應。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      weather_tool = {
          "type": "function",
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "parameters": {
              "type": "object",
              "properties": {
                  "location": {
                      "type": "string",
                      "description": "The city and state, e.g. San Francisco, CA"
                  }
              },
              "required": ["location"]
          }
      }

      # Turn 1: Request function call
      stream = client.interactions.create(
          model="gemini-4-hydrogen",
          tools=[weather_tool],
          input="What is the weather in Paris right now?",
          stream=True,
      )

      first_interaction_id = None
      func_call_id = None
      func_call_name = None
      func_args_accumulated = ""

      for event in stream:
          if event.event_type == "interaction.created":
              first_interaction_id = event.interaction.id
          elif event.event_type == "step.start":
              step = event.step
              if step.type == "function_call":
                  func_call_id = step.id
                  func_call_name = step.name
          elif event.event_type == "step.delta":
              if event.delta.type == "arguments_delta":
                  func_args_accumulated += event.delta.arguments

      # Turn 2: Execute tool and send the result back to resume stream
      if func_call_id:
          # Execute weather_tool using accumulated arguments
          dummy_result = {
              "content": [{"type": "text", "text": '{"weather": "Sunny and 22°C"}'}]
          }

          stream2 = client.interactions.create(
              model="gemini-4-hydrogen",
              previous_interaction_id=first_interaction_id,
              input=[{
                  "type": "function_result",
                  "name": func_call_name,
                  "call_id": func_call_id,
                  "result": dummy_result
              }],
              stream=True,
          )

          for event in stream2:
              if event.event_type == "step.delta":
                  if event.delta.type == "text":
                      print(event.delta.text, end="", flush=True)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const weatherTool = {
          type: "function",
          name: "get_weather",
          description: "Get the current weather in a given location",
          parameters: {
              type: "object",
              properties: {
                  location: {
                      type: "string",
                      description: "The city and state, e.g. San Francisco, CA"
                  }
              },
              required: ["location"]
          }
      };

      // Turn 1: Request function call
      const stream = await client.interactions.create({
          model: "gemini-4-hydrogen",
          tools: [
          {
            type: "function",
            name: "get_current_weather",
            description: "Get the current weather for a given location",
            parameters: {
              type: "object",
              properties: {
                location: { type: "string" },
              },
              required: ["location"],
            },
          },
        ],
          input: "What is the weather in Paris right now?",
          stream: true,
      });

      let firstInteractionId = null;
      let funcCallId = null;
      let funcCallName = null;
      let funcArgsAccumulated = "";

      for await (const event of stream) {
          if (event.event_type === "interaction.created") {
              firstInteractionId = event.interaction.id;
          } else if (event.event_type === "step.start") {
              const step = event.step;
              if (step.type === "function_call") {
                  funcCallId = step.id;
                  funcCallName = step.name;
              }
          } else if (event.event_type === "step.delta") {
              if (event.delta.type === "arguments_delta") {
                  funcArgsAccumulated += event.delta.arguments;
              }
          }
      }

      // Turn 2: Execute tool and send the result back to resume stream
      if (funcCallId && firstInteractionId && funcCallName) {
          const dummyResult = {
              content: [{ type: "text", text: '{"weather": "Sunny and 22°C"}' }]
          };

          const stream2 = await client.interactions.create({
              model: "gemini-4-hydrogen",
              previous_interaction_id: firstInteractionId,
              input: [{
                  type: "function_result",
                  name: funcCallName,
                  call_id: funcCallId,
                  result: dummyResult
              }],
              stream: true,
          });

          for await (const event of stream2) {
              if (event.event_type === "step.delta") {
                  if (event.delta.type === "text") {
                      process.stdout.write(event.delta.text);
                  }
              }
          }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.ArgumentsDelta;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.FunctionResultStep;
      import com.google.genai.gaos.models.interactions.FunctionResultStepResultUnion;
      import com.google.genai.gaos.models.interactions.InteractionCreatedEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEStreamEvent;
      import com.google.genai.gaos.models.interactions.InteractionSseEventInteraction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.StepDelta;
      import com.google.genai.gaos.models.interactions.StepDeltaData;
      import com.google.genai.gaos.models.interactions.StepStart;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.TextDelta;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.CreateInteractionResponse;
      import com.google.genai.gaos.utils.EventStream;
      import java.util.Arrays;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> locationProp = new HashMap<>();
      locationProp.put("type", "string");
      locationProp.put("description", "The city and state, e.g. San Francisco, CA");

      Map<String, Object> properties = new HashMap<>();
      properties.put("location", locationProp);

      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");
      parameters.put("properties", properties);
      parameters.put("required", Arrays.asList("location"));

      Function weatherTool =
          Function.builder()
              .name("get_weather")
              .description("Get the current weather in a given location")
              .parameters(parameters)
              .build();

      // Turn 1: Request function call
      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .tools(Arrays.asList(weatherTool))
              .input(InteractionsInput.of("What is the weather in Paris right now?"))
              .stream(true)
              .build();

      CreateInteractionResponse response =
          client.interactions.create(CreateInteractionRequestBody.of(params));

      String firstInteractionId = null;
      String funcCallId = null;
      String funcCallName = null;
      StringBuilder funcArgsAccumulated = new StringBuilder();

      try (EventStream<InteractionSSEStreamEvent> stream = response.events()) {
        for (InteractionSSEStreamEvent streamEvent : stream) {
          InteractionSSEEvent event = streamEvent.data().orElse(null);
          if (event instanceof InteractionCreatedEvent createdEvent) {
            firstInteractionId =
                createdEvent.interaction().flatMap(InteractionSseEventInteraction::id).orElse(null);
          } else if (event instanceof StepStart stepStart) {
            Step step = stepStart.step().orElse(null);
            if (step instanceof FunctionCallStep fcStep) {
              funcCallId = fcStep.id().orElse(null);
              funcCallName = fcStep.name().orElse(null);
            }
          } else if (event instanceof StepDelta stepDelta) {
            StepDeltaData delta = stepDelta.delta().orElse(null);
            if (delta instanceof ArgumentsDelta argsDelta) {
              funcArgsAccumulated.append(argsDelta.arguments().orElse(""));
            }
          }
        }
      }

      // Turn 2: Execute tool and send the result back to resume stream
      if (funcCallId != null && firstInteractionId != null && funcCallName != null) {
        FunctionResultStep resultStep =
            FunctionResultStep.builder()
                .name(funcCallName)
                .callId(funcCallId)
                .result(
                    FunctionResultStepResultUnion.of(
                        Arrays.asList(TextContent.builder().text("{\"weather\": \"Sunny and 22°C\"}").build())))
                .build();

        CreateModelInteraction params2 =
            CreateModelInteraction.builder()
                .model(Model.of("gemini-4-hydrogen"))
                .previousInteractionId(firstInteractionId)
                .input(InteractionsInput.ofStep(Arrays.asList(resultStep)))
                .stream(true)
                .build();

        CreateInteractionResponse response2 =
            client.interactions.create(CreateInteractionRequestBody.of(params2));

        try (EventStream<InteractionSSEStreamEvent> stream2 = response2.events()) {
          for (InteractionSSEStreamEvent streamEvent : stream2) {
            InteractionSSEEvent event = streamEvent.data().orElse(null);
            if (event instanceof StepDelta stepDelta) {
              StepDeltaData delta = stepDelta.delta().orElse(null);
              if (delta instanceof TextDelta textDelta) {
                textDelta.text().ifPresent(System.out::print);
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

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-3.8-pro"),
                  Input: interactions.NewInteractionsInput("Solve the Monty Hall problem step-by-step."),
                  GenerationConfig: &interactions.GenerationConfig{
                      ThinkingLevel:     interactions.ThinkingLevelHigh.ToPointer(),
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
                          fmt.Printf("[Thought] %s\n", textContent.Text)
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

      ```
      **Turn 1:** Request function call

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        --no-buffer \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "What is the weather in Paris right now?",
          "stream": true,
          "tools": [
            {
              "type": "function",
              "name": "get_weather",
              "description": "Get the current weather in a given location",
              "parameters": {
                "type": "object",
                "properties": {
                  "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, CA"
                  }
                },
                "required": ["location"]
              }
            }
          ]
        }'
      ```

      **Turn 2:** Send the function result using the `previous_interaction_id` and `call_id` from Turn 1

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        --no-buffer \
        -d '{
          "model": "gemini-4-hydrogen",
          "previous_interaction_id": "v1_ChdGUVFJYXBXVUdLVEF4TjhQ...",
          "stream": true,
          "input": [
            {
              "type": "function_result",
              "name": "get_weather",
              "call_id": "CALL_ID",
              "result": {
                "content": [
                  {
                    "type": "text",
                    "text": "{\"weather\": \"Sunny and 22°C\"}"
                  }
                ]
              }
            }
          ]
        }'
      ```
      ```

      {% /tab %}

      {% /tabs %}

      ### Streaming with multiple tools  {% id="streaming-with-multiple-tools" %}

      The following example uses both a `function` tool and `google_search` in one request:

      {% tabs %}
      {% tab label="Python" %}
      ```python
      from google import genai

      client = genai.Client()

      tools = [
          {"type": "google_search"},
          {
              "type": "function",
              "name": "get_weather",
              "description": "Get the current weather in a given location",
              "parameters": {
                  "type": "object",
                  "properties": {
                      "location": {
                          "type": "string",
                          "description": "The city and state, e.g. San Francisco, CA"
                      }
                  },
                  "required": ["location"]
              }
          }
      ]

      stream = client.interactions.create(
          model="gemini-4-hydrogen",
          tools=tools,
          input="Search what is the largest mountain in Europe and what the weather is there right now?",
          stream=True,
      )
      for event in stream:
          if event.event_type == "step.start":
              step = event.step
              print(f"\n--- Step {event.index}: {step.type} ---")
              # Show details for tool steps
              if step.type == "google_search_call":
                  print(f"  Search ID: {step.id}")
              elif step.type == "google_search_result":
                  print(f"  Result for: {step.call_id}")
              elif step.type == "function_call":
                  print(f"  Function: {step.name}({step.arguments})")
          elif event.event_type == "step.delta":
              if event.delta.type == "text":
                  print(event.delta.text, end="", flush=True)
              elif event.delta.type == "google_search_call":
                  print(f"  Queries: {event.delta.arguments}")
              elif event.delta.type == "arguments_delta":
                  print(f"  Args chunk: {event.delta.arguments}", end="", flush=True)
          elif event.event_type == "interaction.completed":
              print(f"\n\nStatus: {event.interaction.status}")
              if event.interaction.status == "requires_action":
                  print("Action required: provide function call results to continue.")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const stream = await client.interactions.create({
          model: "gemini-4-hydrogen",
          tools: [
              { type: "google_search" },
              {
                  type: "function",
                  name: "get_weather",
                  description: "Get the current weather in a given location",
                  parameters: {
                      type: "object",
                      properties: {
                          location: {
                              type: "string",
                              description: "The city and state, e.g. San Francisco, CA"
                          }
                      },
                      required: ["location"]
                  }
              }
          ],
          input: "Search what is the largest mountain in Europe and what the weather is there right now?",
          stream: true,
      });
      for await (const event of stream) {
          if (event.event_type === "step.start") {
              const step = event.step;
              console.log(`\n--- Step ${event.index}: ${step.type} ---`);
              // Show details for tool steps
              if (step.type === "google_search_call") {
                  console.log(`  Search ID: ${step.id}`);
              } else if (step.type === "google_search_result") {
                  console.log(`  Result for: ${step.call_id}`);
              } else if (step.type === "function_call") {
                  console.log(`  Function: ${step.name}(${JSON.stringify(step.arguments)})`);
              }
          } else if (event.event_type === "step.delta") {
              if (event.delta.type === "text") {
                  process.stdout.write(event.delta.text);
              } else if (event.delta.type === "google_search_call") {
                  console.log(`  Queries: ${JSON.stringify(event.delta.arguments?.queries)}`);
              } else if (event.delta.type === "arguments_delta") {
                  process.stdout.write(`  Args chunk: ${event.delta.arguments}`);
              }
          } else if (event.event_type === "interaction.completed") {
              console.log(`\n\nStatus: ${event.interaction.status}`);
              if (event.interaction.status === "requires_action") {
                  console.log("Action required: provide function call results to continue.");
              }
          }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.ArgumentsDelta;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.GoogleSearch;
      import com.google.genai.gaos.models.interactions.GoogleSearchCallDelta;
      import com.google.genai.gaos.models.interactions.GoogleSearchCallStep;
      import com.google.genai.gaos.models.interactions.GoogleSearchResultStep;
      import com.google.genai.gaos.models.interactions.InteractionCompletedEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEStreamEvent;
      import com.google.genai.gaos.models.interactions.InteractionSseEventInteractionStatus;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.StepDelta;
      import com.google.genai.gaos.models.interactions.StepDeltaData;
      import com.google.genai.gaos.models.interactions.StepStart;
      import com.google.genai.gaos.models.interactions.TextDelta;
      import com.google.genai.gaos.models.interactions.Tool;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.CreateInteractionResponse;
      import com.google.genai.gaos.utils.EventStream;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.List;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> locationProp = new HashMap<>();
      locationProp.put("type", "string");
      locationProp.put("description", "The city and state, e.g. San Francisco, CA");

      Map<String, Object> properties = new HashMap<>();
      properties.put("location", locationProp);

      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");
      parameters.put("properties", properties);
      parameters.put("required", Arrays.asList("location"));

      List<Tool> tools =
          Arrays.asList(
              new GoogleSearch(),
              Function.builder()
                  .name("get_weather")
                  .description("Get the current weather in a given location")
                  .parameters(parameters)
                  .build());

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .tools(tools)
              .input(
                  InteractionsInput.of(
                      "Search what is the largest mountain in Europe and what the weather is there right now?"))
              .stream(true)
              .build();

      CreateInteractionResponse response =
          client.interactions.create(CreateInteractionRequestBody.of(params));

      try (EventStream<InteractionSSEStreamEvent> stream = response.events()) {
        for (InteractionSSEStreamEvent streamEvent : stream) {
          InteractionSSEEvent event = streamEvent.data().orElse(null);
          if (event instanceof StepStart stepStart) {
            Step step = stepStart.step().orElse(null);
            if (step != null) {
              System.out.printf("%n--- Step %d: %s ---%n", stepStart.index().orElse(0), step.type());
              if (step instanceof GoogleSearchCallStep searchCall) {
                System.out.println("  Search ID: " + searchCall.id().orElse(""));
              } else if (step instanceof GoogleSearchResultStep searchResult) {
                System.out.println("  Result for: " + searchResult.callId().orElse(""));
              } else if (step instanceof FunctionCallStep fcStep) {
                System.out.printf(
                    "  Function: %s(%s)%n",
                    fcStep.name().orElse(""), fcStep.arguments().orElse(Collections.emptyMap()));
              }
            }
          } else if (event instanceof StepDelta stepDelta) {
            StepDeltaData delta = stepDelta.delta().orElse(null);
            if (delta instanceof TextDelta textDelta) {
              textDelta.text().ifPresent(System.out::print);
            } else if (delta instanceof GoogleSearchCallDelta searchDelta) {
              System.out.println("  Queries: " + searchDelta.arguments().orElse(null));
            } else if (delta instanceof ArgumentsDelta argsDelta) {
              System.out.print("  Args chunk: " + argsDelta.arguments().orElse(""));
            }
          } else if (event instanceof InteractionCompletedEvent completedEvent) {
            completedEvent
                .interaction()
                .ifPresent(
                    interaction -> {
                      String status =
                          interaction
                              .status()
                              .map(InteractionSseEventInteractionStatus::value)
                              .orElse("");
                      System.out.println("\n\nStatus: " + status);
                      if ("requires_action".equals(status)) {
                        System.out.println("Action required: provide function call results to continue.");
                      }
                    });
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

          weatherTool := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("get_weather"),
              Description: genai.Ptr("Gets the current weather for a given location."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "location": map[string]any{"type": "string"},
                  },
                  "required": []string{"location"},
              },
          })

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:  interactions.Model("gemini-4-hydrogen"),
                  Input:  interactions.NewInteractionsInput("What is the weather in Tokyo and Paris?"),
                  Tools:  []interactions.Tool{weatherTool},
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
              if stepStart := event.GetDataStepStart(); stepStart != nil {
                  if call := stepStart.GetStepFunctionCall(); call != nil {
                      fmt.Printf("\n[Function Call Started] %s (id: %s)\n", call.Name, call.ID)
                  }
              }
              if stepDelta := event.GetDataStepDelta(); stepDelta != nil {
                  if argsDelta := stepDelta.GetDeltaArgumentsDelta(); argsDelta != nil && argsDelta.Arguments != nil {
                      fmt.Printf("[Args Delta] %s\n", *argsDelta.Arguments)
                  }
                  if textDelta := stepDelta.GetDeltaText(); textDelta != nil {
                      fmt.Print(textDelta.GetText())
                  }
              }
              if completed := event.GetDataInteractionCompleted(); completed != nil {
                  interaction := completed.Interaction
                  if interaction.Status == interactions.InteractionSseEventInteractionStatusRequiresAction {
                      fmt.Printf("\nStream paused: Waiting for tool outputs for interaction %s\n", interaction.ID)
                  }
              }
          }
          if err := stream.Err(); err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        --no-buffer \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Search what is the largest mountain in Europe and what the weather is there right now?",
          "stream": true,
          "tools": [
            { "type": "google_search" },
            {
              "type": "function",
              "name": "get_weather",
              "description": "Get the current weather in a given location",
              "parameters": {
                "type": "object",
                "properties": {
                  "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, CA"
                  }
                },
                "required": ["location"]
              }
            }
          ]
        }'
      ```


```none
event: interaction.created
data: {"interaction":{"id":"v1_...","status":"in_progress","object":"interaction","model":"gemini-4-hydrogen"},"event_type":"interaction.created"}

event: interaction.status_update
data: {"interaction_id":"v1_...","status":"in_progress","event_type":"interaction.status_update"}

event: step.start
data: {"index":0,"step":{"id":"mkutnkgn","signature":"","type":"google_search_call"},"event_type":"step.start"}

event: step.delta
data: {"index":0,"delta":{"signature":"...","type":"google_search_call","arguments":{"queries":["largest mountain in Europe"]}},"event_type":"step.delta"}

event: step.stop
data: {"index":0,"event_type":"step.stop"}

event: step.start
data: {"index":1,"step":{"call_id":"mkutnkgn","signature":"","type":"google_search_result"},"event_type":"step.start"}

event: step.delta
data: {"index":1,"delta":{"signature":"...","type":"google_search_result","is_error":false},"event_type":"step.delta"}

event: step.stop
data: {"index":1,"event_type":"step.stop"}

event: step.start
data: {"index":2,"step":{"type":"thought"},"event_type":"step.start"}

event: step.delta
data: {"index":2,"delta":{"signature":"...","type":"thought_signature"},"event_type":"step.delta"}

event: step.stop
data: {"index":2,"event_type":"step.stop"}

event: step.start
data: {"index":3,"step":{"id":"ktr5aysg","type":"function_call","name":"get_weather","arguments":{}},"event_type":"step.start"}

event: step.delta
data: {"index":3,"delta":{"arguments":"{\"location\":\"Mount Elbrus, Russia\"}","type":"arguments_delta"},"event_type":"step.delta"}

event: step.stop
data: {"index":3,"event_type":"step.stop"}

event: interaction.completed
data: {"interaction":{"id":"v1_...","status":"requires_action","usage":{"total_tokens":299,"total_input_tokens":138,"input_tokens_by_modality":[{"modality":"text","tokens":138}],"total_cached_tokens":0,"total_output_tokens":20,"total_tool_use_tokens":0,"total_thought_tokens":141},"created":"2026-05-12T17:24:26Z","updated":"2026-05-12T17:24:26Z","service_tier":"standard","object":"interaction","model":"gemini-4-hydrogen"},"event_type":"interaction.completed"}

event: done
data: [DONE]
```

## 搭配思考使用串流 {#streaming-with-thinking}

當模型使用思考功能時，你會收到 `thought` 步驟，其中包含兩種不同的 delta 類型：`thought_summary`（增量的文字或圖片摘要內容），以及 `thought_signature`（模型內部推理的加密表示，會在 `step.stop` 之前作為最後一個 delta 送出）。若啟用了 `thinking_summaries`，`thought_summary` delta 會串流模型推理的摘要。思考功能的更多詳情，請參閱[思考指南](/docs/thinking/)。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      stream = client.interactions.create(
          model="gemini-4-hydrogen",
          input="What is the greatest common divisor of 1071 and 462?",
          generation_config={
              "thinking_summaries": "auto"
          },
          stream=True,
      )
      for event in stream:
          if event.event_type == "step.start":
              print(f"\n--- Step: {event.step.type} ---")
          elif event.event_type == "step.delta":
              if event.delta.type == "thought_summary":
                  if event.delta.content.type == "text":
                      print(event.delta.content.text, end="", flush=True)
              elif event.delta.type == "text":
                  print(event.delta.text, end="", flush=True)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const stream = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: "What is the greatest common divisor of 1071 and 462?",
          generation_config: {
              thinking_summaries: "auto",
          },
          stream: true,
      });
      for await (const event of stream) {
          if (event.event_type === "step.start") {
              console.log(`\n--- Step: ${event.step.type} ---`);
          } else if (event.event_type === "step.delta") {
              if (event.delta.type === "thought_summary") {
                  if (event.delta.content?.type === "text") {
                      process.stdout.write(event.delta.content.text);
                  }
              } else if (event.delta.type === "text") {
                  process.stdout.write(event.delta.text);
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
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.StepDelta;
      import com.google.genai.gaos.models.interactions.StepDeltaData;
      import com.google.genai.gaos.models.interactions.StepStart;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.TextDelta;
      import com.google.genai.gaos.models.interactions.ThinkingSummaries;
      import com.google.genai.gaos.models.interactions.ThoughtSummaryDelta;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.CreateInteractionResponse;
      import com.google.genai.gaos.utils.EventStream;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("What is the greatest common divisor of 1071 and 462?"))
              .generationConfig(
                  GenerationConfig.builder().thinkingSummaries(ThinkingSummaries.AUTO).build())
              .stream(true)
              .build();

      CreateInteractionResponse response =
          client.interactions.create(CreateInteractionRequestBody.of(params));

      try (EventStream<InteractionSSEStreamEvent> stream = response.events()) {
        for (InteractionSSEStreamEvent streamEvent : stream) {
          InteractionSSEEvent event = streamEvent.data().orElse(null);
          if (event instanceof StepStart stepStart) {
            Step step = stepStart.step().orElse(null);
            if (step != null) {
              System.out.printf("%n--- Step: %s ---%n", step.type());
            }
          } else if (event instanceof StepDelta stepDelta) {
            StepDeltaData delta = stepDelta.delta().orElse(null);
            if (delta instanceof ThoughtSummaryDelta thoughtDelta) {
              Content content = thoughtDelta.content().orElse(null);
              if (content instanceof TextContent textContent) {
                textContent.text().ifPresent(System.out::print);
              }
            } else if (delta instanceof TextDelta textDelta) {
              textDelta.text().ifPresent(System.out::print);
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
                  Input: interactions.NewInteractionsInput("What are the top news stories in AI today, and calculate 2^64 - 1?"),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.GoogleSearch{}),
                      interactions.NewTool(interactions.CodeExecution{}),
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
              if stepStart := event.GetDataStepStart(); stepStart != nil {
                  step := stepStart.Step
                  if searchCall := step.GoogleSearchCallStep; searchCall != nil {
                      fmt.Printf("[Google Search Started] id: %s\n", searchCall.ID)
                  } else if searchRes := step.GoogleSearchResultStep; searchRes != nil {
                      fmt.Printf("[Google Search Results Received] for call_id: %s\n", searchRes.CallID)
                  } else if codeCall := step.CodeExecutionCallStep; codeCall != nil {
                      fmt.Printf("[Code Execution Started] id: %s\n", codeCall.ID)
                  } else if codeRes := step.CodeExecutionResultStep; codeRes != nil {
                      fmt.Printf("[Code Execution Finished] output: %s\n", codeRes.Result)
                  }
              }
              if stepDelta := event.GetDataStepDelta(); stepDelta != nil {
                  if searchDelta := stepDelta.GetDeltaGoogleSearchCall(); searchDelta != nil {
                      fmt.Printf("[Search Queries] %v\n", searchDelta.Arguments.Queries)
                  }
                  if codeDelta := stepDelta.GetDeltaCodeExecutionCall(); codeDelta != nil {
                      fmt.Printf("[Code Delta] %s\n", codeDelta.Arguments.Code)
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

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        --no-buffer \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "What is the greatest common divisor of 1071 and 462?",
          "stream": true,
          "generation_config": {
            "thinking_summaries": "auto"
          }
        }'
      ```


```none
event: interaction.created
data: {"interaction":{"id":"v1_...","status":"in_progress","object":"interaction","model":"gemini-4-hydrogen"},"event_type":"interaction.created"}

event: interaction.status_update
data: {"interaction_id":"v1_...","status":"in_progress","event_type":"interaction.status_update"}

event: step.start
data: {"index":0,"step":{"type":"thought"},"event_type":"step.start"}

event: step.delta
data: {"index":0,"delta":{"content":{"text":"**Implementing Euclidean Algorithm**\n\nI've just worked through a detailed example applying the Euclidean algorithm to find the GCD of 1071 and 462, confirming its step-by-step nature. The calculations went smoothly, tracking the remainders until zero. My focus is now solidifying the implementation logic, ensuring accuracy and considering potential edge cases. I'll translate this example into code.\n\n\n","type":"text"},"type":"thought_summary"},"event_type":"step.delta"}

event: step.delta
data: {"index":0,"delta":{"signature":"...","type":"thought_signature"},"event_type":"step.delta"}

event: step.stop
data: {"index":0,"event_type":"step.stop"}

event: step.start
data: {"index":1,"step":{"type":"model_output"},"event_type":"step.start"}

...
```

## 搭配代理使用串流 {#streaming-with-agents}

Interactions API 支援 Deep Research 等代理。代理會使用 `background=True` 並以非同步方式回傳結果，但你也可以串流代理互動，即時接收進度更新與中間步驟。更多詳情請參閱[背景執行指南](/docs/background-execution/)與 [Deep Research 指南](/docs/deep-research/)。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      stream = client.interactions.create(
          agent="deep-research-preview-04-2026",
          input="Research the latest advances in quantum computing.",
          stream=True,
          background=True,
          agent_config={
              "type": "deep-research",
              "thinking_summaries": "auto"
          }
      )
      for event in stream:
          if event.event_type == "step.start":
              print(f"\n--- Step: {event.step.type} ---")
          elif event.event_type == "step.delta":
              if event.delta.type == "text":
                  print(event.delta.text, end="", flush=True)
              elif event.delta.type == "thought_summary":
                  if event.delta.content.type == "text":
                      print(event.delta.content.text, end="", flush=True)
          elif event.event_type == "interaction.completed":
              print(f"\n\nTotal Tokens: {event.interaction.usage.total_tokens}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const stream = await client.interactions.create({
          agent: "deep-research-preview-04-2026",
          input: "Research the latest advances in quantum computing.",
          stream: true,
          background: true,
          agent_config: {
              type: "deep-research",
              thinking_summaries: "auto"
          }
      });
      for await (const event of stream) {
          if (event.event_type === "step.start") {
              console.log(`\n--- Step: ${event.step.type} ---`);
          } else if (event.event_type === "step.delta") {
              if (event.delta.type === "text") {
                  process.stdout.write(event.delta.text);
              } else if (event.delta.type === "thought_summary") {
                  if (event.delta.content?.type === "text") {
                      process.stdout.write(event.delta.content.text);
                  }
              }
          } else if (event.event_type === "interaction.completed") {
              if (event.interaction?.usage?.total_tokens) { console.log(`\n\nTotal Tokens: ${event.interaction.usage.total_tokens}`); }
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
      import com.google.genai.gaos.models.interactions.InteractionCompletedEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEStreamEvent;
      import com.google.genai.gaos.models.interactions.InteractionSseEventInteraction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.StepDelta;
      import com.google.genai.gaos.models.interactions.StepDeltaData;
      import com.google.genai.gaos.models.interactions.StepStart;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.TextDelta;
      import com.google.genai.gaos.models.interactions.ThinkingSummaries;
      import com.google.genai.gaos.models.interactions.ThoughtSummaryDelta;
      import com.google.genai.gaos.models.interactions.Usage;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.CreateInteractionResponse;
      import com.google.genai.gaos.utils.EventStream;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("deep-research-preview-04-2026")
              .input(InteractionsInput.of("Research the latest advances in quantum computing."))
              .stream(true)
              .background(true)
              .agentConfig(
                  DeepResearchAgentConfig.builder()
                      .thinkingSummaries(ThinkingSummaries.AUTO)
                      .build())
              .build();

      CreateInteractionResponse response =
          client.interactions.create(CreateInteractionRequestBody.of(params));

      try (EventStream<InteractionSSEStreamEvent> stream = response.events()) {
        for (InteractionSSEStreamEvent streamEvent : stream) {
          InteractionSSEEvent event = streamEvent.data().orElse(null);
          if (event instanceof StepStart stepStart) {
            Step step = stepStart.step().orElse(null);
            if (step != null) {
              System.out.printf("%n--- Step: %s ---%n", step.type());
            }
          } else if (event instanceof StepDelta stepDelta) {
            StepDeltaData delta = stepDelta.delta().orElse(null);
            if (delta instanceof TextDelta textDelta) {
              textDelta.text().ifPresent(System.out::print);
            } else if (delta instanceof ThoughtSummaryDelta thoughtDelta) {
              Content content = thoughtDelta.content().orElse(null);
              if (content instanceof TextContent textContent) {
                textContent.text().ifPresent(System.out::print);
              }
            }
          } else if (event instanceof InteractionCompletedEvent completedEvent) {
            completedEvent
                .interaction()
                .flatMap(InteractionSseEventInteraction::usage)
                .flatMap(Usage::totalTokens)
                .ifPresent(tokens -> System.out.println("\n\nTotal Tokens: " + tokens));
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
          "os"

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
                  Model: interactions.Model("gemini-3.1-flash-image-preview"),
                  Input: interactions.NewInteractionsInput("Generate a watercolor illustration of a lighthouse at sunset and describe the scene."),
                  ResponseFormat: genai.Ptr(interactions.NewCreateModelInteractionResponseFormat([]interactions.ResponseFormat{
                      interactions.NewResponseFormat(interactions.TextResponseFormat{}),
                      interactions.NewResponseFormat(interactions.ImageResponseFormat{}),
                  })),
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
                  if textDelta := stepDelta.GetDeltaText(); textDelta != nil {
                      fmt.Print(textDelta.GetText())
                  }
                  if imgDelta := stepDelta.GetDeltaImage(); imgDelta != nil && imgDelta.Data != nil {
                      imageBytes, err := base64.StdEncoding.DecodeString(*imgDelta.Data)
                      if err != nil {
                          log.Fatal(err)
                      }
                      if err := os.WriteFile("lighthouse.png", imageBytes, 0644); err != nil {
                          log.Fatal(err)
                      }
                      fmt.Println("\n[Saved lighthouse.png]")
                  }
              }
              if completed := event.GetDataInteractionCompleted(); completed != nil {
                  // You can also access the final image using interaction.GetOutputImage() on a non-streamed or retrieved interaction
                  fmt.Println("\nGeneration complete!")
              }
          }
          if err := stream.Err(); err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        --no-buffer \
        -d '{
          "agent": "deep-research-preview-04-2026",
          "input": "Research the latest advances in quantum computing.",
          "stream": true,
          "background": true,
          "agent_config": {
            "type": "deep-research",
            "thinking_summaries": "auto"
          }
        }'
      ```


```none
event: interaction.created
data: {"interaction":{"id":"v1_...","status":"in_progress","object":"interaction","agent":"deep-research-preview-04-2026"},"event_type":"interaction.created"}

event: interaction.status_update
data: {"interaction_id":"v1_...","status":"in_progress","event_type":"interaction.status_update"}

event: step.start
data: {"index":0,"step":{"type":"thought"},"event_type":"step.start"}

event: step.delta
data: {"index":0,"delta":{"content":{"text":"***Generating research plan***\n\nTo best answer your request, I'm starting by constructing a comprehensive research plan. This will outline the key areas I need to investigate and the strategy I'll use to connect them."},"type":"thought_summary"},"event_type":"step.delta"}

... (additional thought steps) ...

event: step.stop
data: {"index":0,"event_type":"step.stop"}

event: step.start
data: {"index":1,"step":{"type":"model_output"},"event_type":"step.start"}

event: step.delta
data: {"index":1,"delta":{"text":"# The Quantum Inflection Point: Exhaustive Analysis of Hardware, Algorithms, and Market Dynamics in 2026\n\n## Executive Summary\n\n..."},"event_type":"step.delta"}

event: step.stop
data: {"index":1,"event_type":"step.stop"}

event: interaction.completed
data: {"interaction":{"id":"v1_...","status":"completed","usage":{"total_tokens":1117031,"total_input_tokens":428865,"total_output_tokens":22294,"total_thought_tokens":26213},"created":"2026-05-12T17:24:27Z","updated":"2026-05-12T17:24:27Z","object":"interaction","agent":"deep-research-preview-04-2026"},"event_type":"interaction.completed"}

event: done
data: [DONE]
```

## 串流圖片生成 {#streaming-image-generation}

Interactions API 支援同時串流多種輸出模態。只要同時要求 `text` 與 `image`，並將兩者放入 `response_format` 中，你就能在同一個串流中接收交錯的文字與生成的圖片。

以下範例使用 `gemini-3.1-flash-image`（Nano Banana 2）搜尋資訊，並生成一篇穿插插圖的故事。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      stream = client.interactions.create(
          model="gemini-3.1-flash-image",
          tools=[{"type": "google_search", "search_types": ["web_search", "image_search"]}],
          input="Search for the history of the Colosseum and write a short illustrated story about a gladiator named Marcus. Interleave text and generated images.",
          response_format=[
              {"type": "text"},
              {"type": "image"}
          ],
          stream=True,
      )

      for event in stream:
          if event.event_type == "step.delta":
              if event.delta.type == "text":
                  print(event.delta.text, end="", flush=True)
              elif event.delta.type == "image":
                  print(f"\n[Image chunk: {len(event.delta.data)} bytes]", end="", flush=True)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const stream = await client.interactions.create({
          model: "gemini-3.1-flash-image",
          tools: [{ type: "google_search", search_types: ["web_search", "image_search"] }],
          input: "Search for the history of the Colosseum and write a short illustrated story about a gladiator named Marcus. Interleave text and generated images.",
          response_format: [
              { type: "text" },
              { type: "image" }
          ],
          stream: true,
      });

      for await (const event of stream) {
          if (event.event_type === "step.delta") {
              if (event.delta.type === "text") {
                  process.stdout.write(event.delta.text);
              } else if (event.delta.type === "image") {
                  if (event.delta?.data) { console.log(`\n[Image chunk: ${event.delta.data.length} bytes]`); }
              }
          }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.GoogleSearch;
      import com.google.genai.gaos.models.interactions.GoogleSearchSearchType;
      import com.google.genai.gaos.models.interactions.ImageDelta;
      import com.google.genai.gaos.models.interactions.ImageResponseFormat;
      import com.google.genai.gaos.models.interactions.InteractionSSEEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEStreamEvent;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.StepDelta;
      import com.google.genai.gaos.models.interactions.StepDeltaData;
      import com.google.genai.gaos.models.interactions.TextDelta;
      import com.google.genai.gaos.models.interactions.TextResponseFormat;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.CreateInteractionResponse;
      import com.google.genai.gaos.utils.EventStream;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-3.1-flash-image"))
              .tools(
                  Arrays.asList(
                      GoogleSearch.builder()
                          .searchTypes(
                              Arrays.asList(
                                  GoogleSearchSearchType.of("web_search"),
                                  GoogleSearchSearchType.of("image_search")))
                          .build()))
              .input(
                  InteractionsInput.of(
                      "Search for the history of the Colosseum and write a short illustrated story about a gladiator named Marcus. Interleave text and generated images."))
              .responseFormat(
                  CreateModelInteractionResponseFormat.of(
                      Arrays.asList(
                          ResponseFormat.of(TextResponseFormat.builder().build()),
                          ResponseFormat.of(ImageResponseFormat.builder().build()))))
              .stream(true)
              .build();

      CreateInteractionResponse response =
          client.interactions.create(CreateInteractionRequestBody.of(params));

      try (EventStream<InteractionSSEStreamEvent> stream = response.events()) {
        for (InteractionSSEStreamEvent streamEvent : stream) {
          InteractionSSEEvent event = streamEvent.data().orElse(null);
          if (event instanceof StepDelta stepDelta) {
            StepDeltaData delta = stepDelta.delta().orElse(null);
            if (delta instanceof TextDelta textDelta) {
              textDelta.text().ifPresent(System.out::print);
            } else if (delta instanceof ImageDelta imageDelta) {
              imageDelta
                  .data()
                  .ifPresent(data -> System.out.printf("%n[Image chunk: %d bytes]", data.length()));
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

          var interactionID string
          var lastEventID *string

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:  interactions.Model("gemini-3.8-pro"),
                  Input:  interactions.NewInteractionsInput("Write a detailed 5-section guide to distributed consensus algorithms."),
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
              if created := event.GetDataInteractionCreated(); created != nil {
                  interactionID = created.Interaction.ID
                  if created.EventID != nil {
                      lastEventID = created.EventID
                  }
              }
              if stepDelta := event.GetDataStepDelta(); stepDelta != nil {
                  if stepDelta.EventID != nil {
                      lastEventID = stepDelta.EventID
                  }
                  if textDelta := stepDelta.GetDeltaText(); textDelta != nil {
                      fmt.Print(textDelta.GetText())
                  }
              }
          }

          if err := stream.Err(); err != nil {
              fmt.Printf("\nStream interrupted (%v). Resuming...\n", err)
              if interactionID != "" && lastEventID != nil {
                  resumedRes, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                      ID:          interactionID,
                      Stream:      genai.Ptr(true),
                      LastEventID: lastEventID,
                  })
                  if err != nil {
                      log.Fatal(err)
                  }
                  resumedStream := resumedRes.InteractionSSEStreamEvent
                  defer resumedStream.Close()

                  for resumedStream.Next() {
                      event := resumedStream.Value()
                      if stepDelta := event.GetDataStepDelta(); stepDelta != nil {
                          if textDelta := stepDelta.GetDeltaText(); textDelta != nil {
                              fmt.Print(textDelta.GetText())
                          }
                      }
                  }
                  if err := resumedStream.Err(); err != nil {
                      log.Fatal(err)
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        --no-buffer \
        -d '{
          "model": "gemini-3.1-flash-image",
          "input": "Search for the history of the Colosseum and write a short illustrated story about a gladiator named Marcus. Interleave text and generated images.",
          "stream": true,
          "tools": [
            { "type": "google_search",
              "search_types": ["web_search", "image_search"]
            }
          ],
          "generation_config": {
            "thinking_summaries": "auto"
          },
          "response_format": [
            { "type": "text" }, { "type": "image"}
          ]
        }'
      ```


```none
event: interaction.created
data: {"interaction":{"id":"v1_...","status":"in_progress","object":"interaction","model":"gemini-3.1-flash-image"},"event_type":"interaction.created"}

event: interaction.status_update
data: {"interaction_id":"v1_...","status":"in_progress","event_type":"interaction.status_update"}

event: step.start
data: {"index":0,"step":{"type":"model_output"},"event_type":"step.start"}

event: step.delta
data: {"index":0,"delta":{"text":"Here is a short illustrated story about the Colosseum...\n\n### Part 1: The New Flavian Amphitheater\n\n...","type":"text"},"event_type":"step.delta"}

...

event: step.stop
data: {"index":0,"event_type":"step.stop"}

event: step.start
data: {"index":1,"step":{"type":"thought"},"event_type":"step.start"}

event: step.delta
data: {"index":1,"delta":{"signature":"...","type":"thought_signature"},"event_type":"step.delta"}

event: step.stop
data: {"index":1,"event_type":"step.stop"}

event: step.start
data: {"index":2,"step":{"type":"model_output"},"event_type":"step.start"}

event: step.delta
data: {"index":2,"delta":{"mime_type":"image/jpeg","data":"/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCg...","type":"image"},"event_type":"step.delta"}

event: step.delta
data: {"index":2,"delta":{"text":"### Part 2: The Hypogeum and the Wait\n\n...","type":"text"},"event_type":"step.delta"}

...

event: step.stop
data: {"index":2,"event_type":"step.stop"}

event: step.start
data: {"index":3,"step":{"type":"thought"},"event_type":"step.start"}

event: step.delta
data: {"index":3,"delta":{"signature":"...","type":"thought_signature"},"event_type":"step.delta"}

event: step.stop
data: {"index":3,"event_type":"step.stop"}

event: step.start
data: {"index":4,"step":{"type":"model_output"},"event_type":"step.start"}

event: step.delta
data: {"index":4,"delta":{"mime_type":"image/jpeg","data":"/9j/4AAQSkZJRgABAQAAAQABAAD/...","type":"image"},"event_type":"step.delta"}

event: step.delta
data: {"index":4,"delta":{"text":"### Part 3: The Moment of Spectacle\n\n...","type":"text"},"event_type":"step.delta"}

...

event: step.stop
data: {"index":4,"event_type":"step.stop"}

event: interaction.completed
data: {"interaction":{"id":"v1_...","status":"completed","usage":{"total_tokens":6128,"total_input_tokens":29,"total_output_tokens":6099,"output_tokens_by_modality":[{"modality":"image","tokens":4480}]}},"event_type":"interaction.completed"}

event: done
data: [DONE]
```

## 處理未知事件 {#handling-unknown-events}

依據 API 的版本政策，未來可能會新增事件類型與 delta 類型。你的程式碼應妥善處理未知的事件類型——將不認識的事件記錄下來並略過，而不是擲出錯誤。

## 後續步驟 {#whats-next}

*   進一步瞭解 [Interactions API](/docs/interactions-overview/)。
*   探索搭配工具的[函式呼叫](/docs/function-calling/)。
*   瞭解用於強化推理的[思考](/docs/thinking/)。
*   試用適合長時間執行任務的 [Deep Research 代理](/docs/deep-research/)。
*   所有事件類型與 delta 類型請參閱 [Interactions API 參考文件](/api-reference/interactions-api/)。

