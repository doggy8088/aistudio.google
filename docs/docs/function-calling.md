# 使用 Gemini API 進行函式呼叫

函式呼叫能讓模型連接外部工具與 API。模型不再只是產生文字回應，而是自行判斷何時該呼叫特定函式，並提供執行實際操作所需的參數。如此一來，模型便能在自然語言與現實世界的動作及資料之間扮演橋梁。函式呼叫主要有 3 種用途：

- [**執行操作**：](/docs/function-calling/#meeting) 透過 API 與外部系統互動，例如安排預約、建立發票、寄送電子郵件，或控制智慧家庭裝置。
- [**擴充知識**：](/docs/function-calling/#weather) 從資料庫、API 與知識庫等外部來源存取資訊。
- [**擴展能力**：](/docs/function-calling/#chart) 使用外部工具執行運算，突破模型本身的限制，例如使用計算機或建立圖表。

以下提供這些用途的範例：

### 安排會議 {#meeting}

這個範例示範如何定義一個在指定時間為與會者安排會議的函式，讓模型能解析使用者的請求，並回傳結構化引數，以觸發外部系統中的操作。


=== "Python"

      ```python
      from google import genai

      schedule_meeting_function = {
          "type": "function",
          "name": "schedule_meeting",
          "description": "Schedules a meeting with specified attendees at a given time and date.",
          "parameters": {
              "type": "object",
              "properties": {
                  "attendees": {"type": "array", "items": {"type": "string"}},
                  "date": {"type": "string", "description": "Date (e.g., '2024-07-29')"},
                  "time": {"type": "string", "description": "Time (e.g., '15:00')"},
                  "topic": {"type": "string", "description": "The meeting topic."},
              },
              "required": ["attendees", "date", "time", "topic"],
          },
      }

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Schedule a meeting with Bob and Alice for 03/14/2025 at 10:00 AM about Q3 planning.",
          tools=[{"type": "function", **schedule_meeting_function}],
      )

      for step in interaction.steps:
          if step.type == "function_call":
              print(f"Function to call: {step.name}")
              print(f"Arguments: {step.arguments}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        model: 'gemini-4-hydrogen',
        input: 'Schedule a meeting with Bob and Alice for 03/27/2025 at 10:00 AM about Q3 planning.',
        tools: [
          {
            type: "function",
            name: "schedule_meeting",
            description: "Schedule a meeting with specified attendees, date, time, and topic.",
            parameters: {
              type: "object",
              properties: {
                attendees: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of attendee names or email addresses",
                },
                date: { type: "string", description: "Date of the meeting (YYYY-MM-DD)" },
                time: { type: "string", description: "Time of the meeting (HH:MM)" },
                topic: { type: "string", description: "Subject or topic of the meeting" },
              },
              required: ["attendees", "date", "time", "topic"],
            },
          },
        ],
      });

      for (const step of interaction.steps) {
        if (step.type === 'function_call') {
          console.log(`Function to call: ${step.name}`);
          console.log(`Arguments: ${JSON.stringify(step.arguments)}`);
        }
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Schedule a meeting with Bob and Alice for 03/27/2025 at 10:00 AM about Q3 planning.",
          "tools": [{
              "type": "function",
              "name": "schedule_meeting",
              "description": "Schedules a meeting with specified attendees at a given time and date.",
              "parameters": {
                "type": "object",
                "properties": {
                  "attendees": {"type": "array", "items": {"type": "string"}},
                  "date": {"type": "string"},
                  "time": {"type": "string"},
                  "topic": {"type": "string"}
                },
                "required": ["attendees", "date", "time", "topic"]
              }
          }]
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> attendeesProp = new HashMap<>();
      attendeesProp.put("type", "array");
      Map<String, Object> itemsMap = new HashMap<>(); itemsMap.put("type", "string"); attendeesProp.put("items", itemsMap);

      Map<String, Object> dateProp = new HashMap<>();
      dateProp.put("type", "string");
      dateProp.put("description", "Date (e.g., \"2024-07-29\")");

      Map<String, Object> timeProp = new HashMap<>();
      timeProp.put("type", "string");
      timeProp.put("description", "Time (e.g., \"15:00\")");

      Map<String, Object> topicProp = new HashMap<>();
      topicProp.put("type", "string");
      topicProp.put("description", "The meeting topic.");

      Map<String, Object> properties = new HashMap<>();
      properties.put("attendees", attendeesProp);
      properties.put("date", dateProp);
      properties.put("time", timeProp);
      properties.put("topic", topicProp);

      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");
      parameters.put("properties", properties);
      parameters.put("required", Arrays.asList("attendees", "date", "time", "topic"));

      Function scheduleMeetingFunction =
          Function.builder()
              .name("schedule_meeting")
              .description("Schedules a meeting with specified attendees at a given time and date.")
              .parameters(parameters)
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-3.6-flash"))
              .input(InteractionsInput.of("Schedule a meeting with Bob and Alice for 03/27/2025 at 10:00 AM about Q3 planning."))
              .tools(Arrays.asList(scheduleMeetingFunction))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof FunctionCallStep) {
            FunctionCallStep functionCall = (FunctionCallStep) step;
            System.out.println("Function to call: " + functionCall.name().orElse(""));
            System.out.println("Arguments: " + functionCall.arguments().orElse(null));
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

          scheduleMeetingFunction := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("schedule_meeting"),
              Description: genai.Ptr("Schedules a meeting with specified attendees at a given time and date."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "attendees": map[string]any{
                          "type":  "array",
                          "items": map[string]any{"type": "string"},
                      },
                      "date": map[string]any{
                          "type":        "string",
                          "description": "Date (e.g., '2024-07-29')",
                      },
                      "time": map[string]any{
                          "type":        "string",
                          "description": "Time (e.g., '15:00')",
                      },
                      "topic": map[string]any{
                          "type":        "string",
                          "description": "The meeting topic.",
                      },
                  },
                  "required": []string{"attendees", "date", "time", "topic"},
              },
          })

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Schedule a meeting with Bob and Alice for 03/14/2025 at 10:00 AM about Q3 planning."),
                      Tools: []interactions.Tool{scheduleMeetingFunction},
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range resp.Interaction.Steps {
              if step.FunctionCallStep != nil {
                  fc := step.FunctionCallStep
                  fmt.Println("Function to call:", fc.Name)
                  fmt.Println("Arguments:", fc.Arguments)
              }
          }
      }
      ```


### 取得天氣 {#weather}

這個範例示範如何定義一個取得指定地點溫度資料的函式，讓模型能呼叫外部 API，回答需要即時或外部資訊的問題。


=== "Python"

      ```python
      from google import genai

      weather_function = {
          "type": "function",
          "name": "get_current_temperature",
          "description": "Gets the current temperature for a given location.",
          "parameters": {
              "type": "object",
              "properties": {
                  "location": {
                      "type": "string",
                      "description": "The city name, e.g. San Francisco",
                  },
              },
              "required": ["location"],
          },
      }

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="What's the temperature in London?",
          tools=[weather_function],
      )

      for step in interaction.steps:
          if step.type == "function_call":
              print(f"Function to call: {step.name}")
              print(f"Arguments: {step.arguments}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        model: 'gemini-4-hydrogen',
        input: "What's the temperature in London?",
        tools: [
          {
            type: "function",
            name: "get_current_weather",
            description: "Get the current weather for a given location",
            parameters: {
              type: "object",
              properties: {
                location: { type: "string", description: "City and state, e.g. San Francisco, CA" },
                unit: { type: "string", enum: ["celsius", "fahrenheit"] },
              },
              required: ["location"],
            },
          },
        ],
      });

      for (const step of interaction.steps) {
        if (step.type === 'function_call') {
          console.log(`Function to call: ${step.name}`);
          console.log(`Arguments: ${JSON.stringify(step.arguments)}`);
        }
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "What'\''s the temperature in London?",
          "tools": [{
            "type": "function",
            "name": "get_current_temperature",
            "description": "Gets the current temperature for a given location.",
            "parameters": {
              "type": "object",
              "properties": {
                "location": {"type": "string", "description": "The city name"}
              },
              "required": ["location"]
            }
          }]
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> locationProp = new HashMap<>();
      locationProp.put("type", "string");
      locationProp.put("description", "The city name, e.g. San Francisco");

      Map<String, Object> properties = new HashMap<>();
      properties.put("location", locationProp);

      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");
      parameters.put("properties", properties);
      parameters.put("required", Arrays.asList("location"));

      Function weatherFunction =
          Function.builder()
              .name("get_current_temperature")
              .description("Gets the current temperature for a given location.")
              .parameters(parameters)
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-3.6-flash"))
              .input(InteractionsInput.of("What's the temperature in London?"))
              .tools(Arrays.asList(weatherFunction))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof FunctionCallStep) {
            FunctionCallStep functionCall = (FunctionCallStep) step;
            System.out.println("Function to call: " + functionCall.name().orElse(""));
            System.out.println("Arguments: " + functionCall.arguments().orElse(null));
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

          weatherFunction := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("get_current_temperature"),
              Description: genai.Ptr("Gets the current temperature for a given location."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "location": map[string]any{
                          "type":        "string",
                          "description": "The city name, e.g. San Francisco",
                      },
                  },
                  "required": []string{"location"},
              },
          })

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("What's the temperature in London?"),
                      Tools: []interactions.Tool{weatherFunction},
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range resp.Interaction.Steps {
              if step.FunctionCallStep != nil {
                  fc := step.FunctionCallStep
                  fmt.Println("Function to call:", fc.Name)
                  fmt.Println("Arguments:", fc.Arguments)
              }
          }
      }
      ```


### 建立圖表 {#chart}

這個範例示範如何定義一個從結構化資料產生長條圖的函式，展現模型如何運用外部工具執行運算或建立視覺素材：


=== "Python"

      ```python
      from google import genai

      create_chart_function = {
          "type": "function",
          "name": "create_bar_chart",
          "description": "Creates a bar chart given a title, labels, and values.",
          "parameters": {
              "type": "object",
              "properties": {
                  "title": {"type": "string", "description": "The title for the chart."},
                  "labels": {"type": "array", "items": {"type": "string"}},
                  "values": {"type": "array", "items": {"type": "number"}},
              },
              "required": ["title", "labels", "values"],
          },
      }

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Create a bar chart titled 'Quarterly Sales' with Q1: 50000, Q2: 75000, Q3: 60000.",
          tools=[create_chart_function],
      )

      for step in interaction.steps:
          if step.type == "function_call":
              print(f"Function to call: {step.name}")
              print(f"Arguments: {step.arguments}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        model: 'gemini-4-hydrogen',
        input: "Create a bar chart titled 'Quarterly Sales' with Q1: 50000, Q2: 75000, Q3: 60000.",
        tools: [
          {
            type: "function",
            name: "create_chart",
            description: "Create a chart based on provided data",
            parameters: {
              type: "object",
              properties: {
                chart_type: { type: "string", enum: ["bar", "line", "pie"] },
                data: { type: "string", description: "JSON string of chart data points" },
                title: { type: "string", description: "Title of the chart" },
              },
              required: ["chart_type", "data", "title"],
            },
          },
        ],
      });

      for (const step of interaction.steps) {
        if (step.type === 'function_call') {
          console.log(`${step.name}(${JSON.stringify(step.arguments)})`);
        }
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Create a bar chart titled '\''Quarterly Sales'\'' with Q1: 50000, Q2: 75000, Q3: 60000.",
          "tools": [{
              "type": "function",
              "name": "create_bar_chart",
              "description": "Creates a bar chart given a title, labels, and values.",
              "parameters": {
                "type": "object",
                "properties": {
                  "title": {"type": "string"},
                  "labels": {"type": "array", "items": {"type": "string"}},
                  "values": {"type": "array", "items": {"type": "number"}}
                },
                "required": ["title", "labels", "values"]
              }
          }]
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> properties = new HashMap<>();
      Map<String, Object> titleMap = new HashMap<>(); titleMap.put("type", "string"); titleMap.put("description", "The title for the chart."); properties.put("title", titleMap);
      Map<String, Object> labelsMap = new HashMap<>(); labelsMap.put("type", "array"); labelsMap.put("items", Collections.singletonMap("type", "string")); properties.put("labels", labelsMap);
      Map<String, Object> valuesMap = new HashMap<>(); valuesMap.put("type", "array"); valuesMap.put("items", Collections.singletonMap("type", "number")); properties.put("values", valuesMap);

      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");
      parameters.put("properties", properties);
      parameters.put("required", Arrays.asList("title", "labels", "values"));

      Function createChartFunction =
          Function.builder()
              .name("create_bar_chart")
              .description("Creates a bar chart given a title, labels, and values.")
              .parameters(parameters)
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-3.6-flash"))
              .input(InteractionsInput.of("Create a bar chart titled 'Quarterly Sales' with Q1: 50000, Q2: 75000, Q3: 60000."))
              .tools(Arrays.asList(createChartFunction))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof FunctionCallStep) {
            FunctionCallStep functionCall = (FunctionCallStep) step;
            System.out.println(functionCall.name().orElse("") + "(" + functionCall.arguments().orElse(null) + ")");
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

          createChartFunction := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("create_bar_chart"),
              Description: genai.Ptr("Creates a bar chart given a title, labels, and values."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "title": map[string]any{
                          "type":        "string",
                          "description": "The title for the chart.",
                      },
                      "labels": map[string]any{
                          "type":  "array",
                          "items": map[string]any{"type": "string"},
                      },
                      "values": map[string]any{
                          "type":  "array",
                          "items": map[string]any{"type": "number"},
                      },
                  },
                  "required": []string{"title", "labels", "values"},
              },
          })

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Create a bar chart titled 'Quarterly Sales' with Q1: 50000, Q2: 75000, Q3: 60000."),
                      Tools: []interactions.Tool{createChartFunction},
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range resp.Interaction.Steps {
              if step.FunctionCallStep != nil {
                  fc := step.FunctionCallStep
                  fmt.Println("Function to call:", fc.Name)
                  fmt.Println("Arguments:", fc.Arguments)
              }
          }
      }
      ```


## 函式呼叫的運作方式 {#how-it-works}

![](https://www.gstatic.com/cloud-cms/6fae8435a773b720d5db0c8746efb318.png)

函式呼叫涉及你的應用程式、模型與外部函式之間一套結構化的互動流程：

1. **定義函式宣告**：向模型定義函式的名稱、參數與用途。
2. **帶著函式宣告呼叫 LLM**：將使用者的提示詞連同函式宣告一起傳送給模型。
3. **執行函式程式碼（由你負責）**：模型*不會*自行執行函式；你必須擷取函式名稱與引數，在自己的應用程式中執行。
4. **產生易於理解的回應**：將執行結果傳回模型，由模型產生最終且易於理解的回應。

這個流程可以在多個回合中重複進行。模型支援在單一回合內呼叫多個函式（[平行函式呼叫](/docs/function-calling/#parallel_function_calling)），也能依序呼叫（[組合式函式呼叫](/docs/function-calling/#compositional_function_calling)）。

### 步驟 1：定義函式宣告 {#step-1}


=== "Python"

      ```python
      set_light_values_declaration = {
          "type": "function",
          "name": "set_light_values",
          "description": "Sets the brightness and color temperature of a light.",
          "parameters": {
              "type": "object",
              "properties": {
                  "brightness": {
                      "type": "integer",
                      "description": "Light level from 0 to 100",
                  },
                  "color_temp": {
                      "type": "string",
                      "enum": ["daylight", "cool", "warm"],
                      "description": "Color temperature",
                  },
              },
              "required": ["brightness", "color_temp"],
          },
      }

      def set_light_values(brightness: int, color_temp: str) -> dict:
          """Set the brightness and color temperature of a room light."""
          return {"brightness": brightness, "colorTemperature": color_temp}
      ```

=== "JavaScript"

      ```javascript
      const setLightValuesTool = {
        type: 'function',
        name: 'set_light_values',
        description: 'Sets the brightness and color temperature of a light.',
        parameters: {
          type: 'object',
          properties: {
            brightness: { type: 'number', description: 'Light level from 0 to 100' },
            color_temp: { type: 'string', enum: ['daylight', 'cool', 'warm'] },
          },
          required: ['brightness', 'color_temp'],
        },
      };

      function setLightValues(brightness = 0, color_temp = 'daylight') {
        return { brightness: brightness, colorTemperature: color_temp };
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");

      Function function = Function.builder()
          .name("custom_function")
          .description("A custom function.")
          .parameters(parameters)
          .build();

      CreateModelInteraction params = CreateModelInteraction.builder()
          .model(Model.of("gemini-3.6-flash"))
          .input(InteractionsInput.of("Call the function."))
          .tools(Arrays.asList(function))
          .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof FunctionCallStep) {
            FunctionCallStep fc = (FunctionCallStep) step;
            System.out.println("Function: " + fc.name().orElse(""));
          }
        }
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
      )

      func setLightValues(brightness int, colorTemp string) map[string]any {
          return map[string]any{
              "brightness":       brightness,
              "colorTemperature": colorTemp,
          }
      }

      func main() {
          setLightValuesDeclaration := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("set_light_values"),
              Description: genai.Ptr("Sets the brightness and color temperature of a light."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "brightness": map[string]any{
                          "type":        "integer",
                          "description": "Light level from 0 to 100",
                      },
                      "color_temp": map[string]any{
                          "type":        "string",
                          "enum":        []string{"daylight", "cool", "warm"},
                          "description": "Color temperature",
                      },
                  },
                  "required": []string{"brightness", "color_temp"},
              },
          })
          _ = setLightValuesDeclaration
      }
      ```


### 步驟 2：帶著函式宣告呼叫模型 {#step-2}


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Turn the lights down to a romantic level",
          tools=[set_light_values_declaration],
      )

      fc_step = next(s for s in interaction.steps if s.type == "function_call")
      print(fc_step)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        model: 'gemini-4-hydrogen',
        input: 'Turn the lights down to a romantic level',
        tools: [
          {
            type: "function",
            name: "set_light_values",
            description: "Set the brightness and color temperature of a room light.",
            parameters: {
              type: "object",
              properties: {
                brightness: { type: "number", description: "Light level from 0 to 100." },
                color_temp: { type: "string", description: "Color temperature (e.g. daylight, cool_white, warm_white)." },
              },
              required: ["brightness", "color_temp"],
            },
          },
        ],
      });

      let fcStep;
      for (const step of interaction.steps || []) {
        if (step.type === 'function_call') {
          fcStep = step;
          break;
        }
      }
      console.log(fcStep);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");

      Function function = Function.builder()
          .name("custom_function")
          .description("A custom function.")
          .parameters(parameters)
          .build();

      CreateModelInteraction params = CreateModelInteraction.builder()
          .model(Model.of("gemini-3.6-flash"))
          .input(InteractionsInput.of("Call the function."))
          .tools(Arrays.asList(function))
          .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof FunctionCallStep) {
            FunctionCallStep fc = (FunctionCallStep) step;
            System.out.println("Function: " + fc.name().orElse(""));
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

          setLightValuesDeclaration := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("set_light_values"),
              Description: genai.Ptr("Sets the brightness and color temperature of a light."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "brightness": map[string]any{
                          "type":        "integer",
                          "description": "Light level from 0 to 100",
                      },
                      "color_temp": map[string]any{
                          "type":        "string",
                          "enum":        []string{"daylight", "cool", "warm"},
                          "description": "Color temperature",
                      },
                  },
                  "required": []string{"brightness", "color_temp"},
              },
          })

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Turn the lights down to a romantic level"),
                      Tools: []interactions.Tool{setLightValuesDeclaration},
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          var fcStep *interactions.FunctionCallStep
          for _, step := range resp.Interaction.Steps {
              if step.FunctionCallStep != nil {
                  fcStep = step.FunctionCallStep
                  break
              }
          }
          fmt.Println(fcStep)
      }
      ```


模型會回傳一個 `function_call` 步驟，其中包含 `type`、`name` 與 `arguments`：

```python
type='function_call'
name='set_light_values'
arguments={'color_temp': 'warm', 'brightness': 25}
```

### 步驟 3：執行函式 {#step-3}


=== "Python"

      ```python
      fc_step = next(s for s in interaction.steps if s.type == "function_call")

      if fc_step.name == "set_light_values":
          result = set_light_values(**fc_step.arguments)
          print(f"Function execution result: {result}")
      ```

=== "JavaScript"

      ```javascript
      function setLightValues(brightness = 0, color_temp = '') {
        return { brightness: brightness, colorTemperature: color_temp };
      }

      let fcStep;
      for (const step of interaction.steps || []) {
        if (step.type === 'function_call') {
          fcStep = step;
          break;
        }
      }

      let result;
      if (fcStep?.name === 'set_light_values') {
        result = setLightValues(fcStep.arguments?.brightness, fcStep.arguments?.color_temp);
        console.log(`Function execution result: ${JSON.stringify(result)}`);
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");

      Function function = Function.builder()
          .name("custom_function")
          .description("A custom function.")
          .parameters(parameters)
          .build();

      CreateModelInteraction params = CreateModelInteraction.builder()
          .model(Model.of("gemini-3.6-flash"))
          .input(InteractionsInput.of("Call the function."))
          .tools(Arrays.asList(function))
          .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof FunctionCallStep) {
            FunctionCallStep fc = (FunctionCallStep) step;
            System.out.println("Function: " + fc.name().orElse(""));
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

      func setLightValues(brightness int, colorTemp string) map[string]any {
          return map[string]any{
              "brightness":       brightness,
              "colorTemperature": colorTemp,
          }
      }

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          setLightValuesDeclaration := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("set_light_values"),
              Description: genai.Ptr("Sets the brightness and color temperature of a light."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "brightness": map[string]any{
                          "type":        "integer",
                          "description": "Light level from 0 to 100",
                      },
                      "color_temp": map[string]any{
                          "type":        "string",
                          "enum":        []string{"daylight", "cool", "warm"},
                          "description": "Color temperature",
                      },
                  },
                  "required": []string{"brightness", "color_temp"},
              },
          })

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Turn the lights down to a romantic level"),
                      Tools: []interactions.Tool{setLightValuesDeclaration},
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range resp.Interaction.Steps {
              if step.FunctionCallStep != nil {
                  fcStep := step.FunctionCallStep
                  if fcStep.Name == "set_light_values" {
                      brightness := 25
                      if b, ok := fcStep.Arguments["brightness"].(float64); ok {
                          brightness = int(b)
                      }
                      colorTemp := "warm"
                      if c, ok := fcStep.Arguments["color_temp"].(string); ok {
                          colorTemp = c
                      }
                      result := setLightValues(brightness, colorTemp)
                      fmt.Println("Function execution result:", result)
                  }
              }
          }
      }
      ```


### 步驟 4：將結果傳回模型 {#step-4}


=== "Python"

      ```python
      final_interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {
                  "type": "function_result",
                  "name": fc_step.name,
                  "call_id": fc_step.id,
                  "result": [{"type": "text", "text": json.dumps(result)}],
              }
          ],
          tools=[set_light_values_declaration],
          previous_interaction_id=interaction.id,
      )

      print(final_interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      const finalInteraction = await client.interactions.create({
        model: 'gemini-4-hydrogen',
        input: [{
          type: 'function_result',
          name: fcStep.name,
          call_id: fcStep.id,
          result: [{ type: 'text', text: JSON.stringify(result) }]
        }],
        tools: [
          {
            type: "function",
            name: "set_light_values",
            description: "Set the brightness and color temperature of a room light.",
            parameters: {
              type: "object",
              properties: {
                brightness: { type: "number", description: "Light level from 0 to 100." },
                color_temp: { type: "string", description: "Color temperature (e.g. daylight, cool_white, warm_white)." },
              },
              required: ["brightness", "color_temp"],
            },
          },
        ],
        previous_interaction_id: interaction.id,
      });

      console.log(finalInteraction.output_text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");

      Function function = Function.builder()
          .name("custom_function")
          .description("A custom function.")
          .parameters(parameters)
          .build();

      CreateModelInteraction params = CreateModelInteraction.builder()
          .model(Model.of("gemini-3.6-flash"))
          .input(InteractionsInput.of("Call the function."))
          .tools(Arrays.asList(function))
          .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof FunctionCallStep) {
            FunctionCallStep fc = (FunctionCallStep) step;
            System.out.println("Function: " + fc.name().orElse(""));
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

          setLightValuesDeclaration := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("set_light_values"),
              Description: genai.Ptr("Sets the brightness and color temperature of a light."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "brightness": map[string]any{
                          "type":        "integer",
                          "description": "Light level from 0 to 100",
                      },
                      "color_temp": map[string]any{
                          "type":        "string",
                          "enum":        []string{"daylight", "cool", "warm"},
                          "description": "Color temperature",
                      },
                  },
                  "required": []string{"brightness", "color_temp"},
              },
          })

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Turn the lights down to a romantic level"),
                      Tools: []interactions.Tool{setLightValuesDeclaration},
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          var fcStep *interactions.FunctionCallStep
          for _, step := range resp.Interaction.Steps {
              if step.FunctionCallStep != nil {
                  fcStep = step.FunctionCallStep
                  break
              }
          }

          if fcStep != nil {
              resultJson := `{"brightness": 25, "colorTemperature": "warm"}`
              resultStep := interactions.NewStep(interactions.FunctionResultStep{
                  Name:   genai.Ptr(fcStep.Name),
                  CallID: fcStep.ID,
                  Result: interactions.NewFunctionResultStepResultUnion([]interactions.FunctionResultSubcontent{
                      interactions.NewFunctionResultSubcontent(interactions.TextContent{
                          Text: resultJson,
                      }),
                  }),
              })

              finalResp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                  Body: operations.NewCreateInteractionRequestBody(
                      interactions.CreateModelInteraction{
                          Model:                 interactions.Model("gemini-4-hydrogen"),
                          PreviousInteractionID: resp.Interaction.ID,
                          Tools:                 []interactions.Tool{setLightValuesDeclaration},
                          Input:                 interactions.NewInteractionsInput([]interactions.Step{resultStep}),
                      },
                  ),
              })
              if err != nil {
                  log.Fatal(err)
              }

              fmt.Println(finalResp.Interaction.GetOutputText())
          }
      }
      ```


### 無狀態函式呼叫 {#stateless-function-calling}

你也可以在用戶端自行管理對話記錄，並設定 `store=false`，以無狀態模式使用函式呼叫。

在無狀態模式下，你必須在後續每個請求的 `input` 欄位中傳入完整的對話記錄。這份記錄必須包含：

1. 最初的 `user_input` 步驟。
2. 第 1 回合回傳的所有模型產生步驟（包括 `thought` 與 `function_call` 步驟），須原封不動地照收到的內容傳入。
3. 包含函式執行結果的 `function_result` 步驟。


=== "Python"

      ```python
      from google import genai
      import json

      client = genai.Client()

      history = [
          {
              "type": "user_input",
              "content": [{"type": "text", "text": "Turn the lights down to a romantic level"}]
          }
      ]

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          store=False,
          input=history,
          tools=[set_light_values_declaration],
      )

      for step in interaction.steps:
          history.append(step.model_dump())

      fc_step = next(s for s in interaction.steps if s.type == "function_call")
      if fc_step.name == "set_light_values":
          result = set_light_values(**fc_step.arguments)

      history.append({
          "type": "function_result",
          "name": fc_step.name,
          "call_id": fc_step.id,
          "result": [{"type": "text", "text": json.dumps(result)}],
      })

      final_interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          store=False,
          input=history,
          tools=[set_light_values_declaration],
      )

      print(final_interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      async function main() {
        const history = [
          {
            type: "user_input",
            content: [{ type: "text", text: "Turn the lights down to a romantic level" }]
          }
        ];

        const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          store: false,
          input: history,
          tools: [setLightValuesTool],
        });

        history.push(...interaction.steps);

        const fcStep = interaction.steps.find(s => s.type === 'function_call');
        let result;
        if (fcStep.name === 'set_light_values') {
          result = setLightValues(fcStep.arguments.brightness, fcStep.arguments.color_temp);
        }

        history.push({
          type: 'function_result',
          name: fcStep.name,
          call_id: fcStep.id,
          result: [{ type: 'text', text: JSON.stringify(result) }]
        });

        const finalInteraction = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          store: false,
          input: history,
          tools: [setLightValuesTool],
        });

        console.log(finalInteraction.output_text);
      }

      await main();
      ```

=== "REST"

      ```shell
      # Turn 1: Send request with tools and store: false
      RESPONSE1=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "store": false,
          "input": [
            {
              "type": "user_input",
              "content": "Turn the lights down to a romantic level"
            }
          ],
          "tools": [{
            "type": "function",
            "name": "set_light_values",
            "description": "Sets the brightness and color temperature of a light.",
            "parameters": {
              "type": "object",
              "properties": {
                "brightness": {"type": "integer", "description": "Light level from 0 to 100"},
                "color_temp": {"type": "string", "enum": ["daylight", "cool", "warm"]}
              },
              "required": ["brightness", "color_temp"]
            }
          }]
        }')

      # Extract model steps (thought, function_call)
      MODEL_STEPS=$(echo "$RESPONSE1" | jq '.steps')

      # Extract function call details to execute
      FC_NAME=$(echo "$RESPONSE1" | jq -r '.steps[] | select(.type=="function_call") | .name')
      FC_ID=$(echo "$RESPONSE1" | jq -r '.steps[] | select(.type=="function_call") | .id')

      # Assume local execution returns: {"brightness": 25, "colorTemperature": "warm"}
      RESULT="{\"brightness\": 25, \"colorTemperature\": \"warm\"}"

      # Reconstruct history for Turn 2
      HISTORY=$(jq -n \
        --argjson first_input '[{"type": "user_input", "content": "Turn the lights down to a romantic level"}]' \
        --argjson model_steps "$MODEL_STEPS" \
        --arg fc_name "$FC_NAME" \
        --arg fc_id "$FC_ID" \
        --arg result "$RESULT" \
        '$first_input + $model_steps + [{"type": "function_result", "name": $fc_name, "call_id": $fc_id, "result": [{"type": "text", "text": $result}]}]')

      # Turn 2: Send the full history
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d "{
          \"model\": \"gemini-4-hydrogen\",
          \"store\": false,
          \"input\": $HISTORY,
          \"tools\": [{
            \"type\": \"function\",
            \"name\": \"set_light_values\",
            \"description\": \"Sets the brightness and color temperature of a light.\",
            \"parameters\": {
              \"type\": \"object\",
              \"properties\": {
                \"brightness\": {\"type\": \"integer\"},
                \"color_temp\": {\"type\": \"string\"}
              },
              \"required\": [\"brightness\", \"color_temp\"]
            }
          }]
        }"
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");

      Function function = Function.builder()
          .name("custom_function")
          .description("A custom function.")
          .parameters(parameters)
          .build();

      CreateModelInteraction params = CreateModelInteraction.builder()
          .model(Model.of("gemini-3.6-flash"))
          .input(InteractionsInput.of("Call the function."))
          .tools(Arrays.asList(function))
          .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof FunctionCallStep) {
            FunctionCallStep fc = (FunctionCallStep) step;
            System.out.println("Function: " + fc.name().orElse(""));
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

          setLightValuesDeclaration := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("set_light_values"),
              Description: genai.Ptr("Sets the brightness and color temperature of a light."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "brightness": map[string]any{
                          "type":        "integer",
                          "description": "Light level from 0 to 100",
                      },
                      "color_temp": map[string]any{
                          "type":        "string",
                          "enum":        []string{"daylight", "cool", "warm"},
                          "description": "Color temperature",
                      },
                  },
                  "required": []string{"brightness", "color_temp"},
              },
          })

          history := []interactions.Step{
              interactions.NewStep(interactions.UserInputStep{
                  Content: []interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: "Turn the lights down to a romantic level",
                      }),
                  },
              }),
          }

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Store: genai.Ptr(false),
                      Input: interactions.NewInteractionsInput(history),
                      Tools: []interactions.Tool{setLightValuesDeclaration},
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          history = append(history, resp.Interaction.Steps...)
          var fcStep *interactions.FunctionCallStep
          for _, step := range resp.Interaction.Steps {
              if step.FunctionCallStep != nil {
                  fcStep = step.FunctionCallStep
                  break
              }
          }

          if fcStep != nil {
              resultJson := `{"brightness": 25, "colorTemperature": "warm"}`
              history = append(history, interactions.NewStep(interactions.FunctionResultStep{
                  Name:   genai.Ptr(fcStep.Name),
                  CallID: fcStep.ID,
                  Result: interactions.NewFunctionResultStepResultUnion([]interactions.FunctionResultSubcontent{
                      interactions.NewFunctionResultSubcontent(interactions.TextContent{
                          Text: resultJson,
                      }),
                  }),
              }))

              finalResp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                  Body: operations.NewCreateInteractionRequestBody(
                      interactions.CreateModelInteraction{
                          Model: interactions.Model("gemini-4-hydrogen"),
                          Store: genai.Ptr(false),
                          Input: interactions.NewInteractionsInput(history),
                          Tools: []interactions.Tool{setLightValuesDeclaration},
                      },
                  ),
              })
              if err != nil {
                  log.Fatal(err)
              }

              fmt.Println(finalResp.Interaction.GetOutputText())
          }
      }
      ```


## 函式宣告 {#function-declarations}

函式宣告會以工具的形式傳入，內容包括：

* `type`（string）：自訂函式必須為 `"function"`。
* `name`（string）：不重複的函式名稱（使用底線或 camelCase）。
* `description`（string）：清楚說明函式的用途。
* `parameters`（object）：函式預期的輸入參數。
  *   `type`（string）：整體資料類型，例如 `object`。
  *   `properties`（object）：各個參數及其類型與說明。
  *   `required`（array）：必填參數的名稱。


## 搭配思考模型使用函式呼叫 {#thinking}

Gemini 3 系列模型會運用內部的[「thinking」](/docs/thinking/)流程來提升函式呼叫的效果。各 SDK 會自動為你處理[思考簽章](/docs/thought-signatures/)。

## 平行函式呼叫 {#parallel_function_calling}

當多個函式彼此獨立時，可以一次呼叫：


=== "Python"

      ```python
      power_disco_ball = {"type": "function", "name": "power_disco_ball", "description": "Powers the disco ball.",
          "parameters": {"type": "object", "properties": {"power": {"type": "boolean"}}, "required": ["power"]}}
      start_music = {"type": "function", "name": "start_music", "description": "Play music.",
          "parameters": {"type": "object", "properties": {"energetic": {"type": "boolean"}, "loud": {"type": "boolean"}}, "required": ["energetic", "loud"]}}
      dim_lights = {"type": "function", "name": "dim_lights", "description": "Dim the lights.",
          "parameters": {"type": "object", "properties": {"brightness": {"type": "number"}}, "required": ["brightness"]}}

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Turn this place into a party!",
          tools=[power_disco_ball, start_music, dim_lights],
          generation_config={"tool_choice": "any"},
      )

      for step in interaction.steps:
          if step.type == "function_call":
              args = ", ".join(f"{key}={val}" for key, val in step.arguments.items())
              print(f"{step.name}({args})")
      ```

=== "JavaScript"

      ```javascript
      const powerDiscoBall = { type: 'function', name: 'power_disco_ball', description: 'Powers the disco ball.',
        parameters: { type: 'object', properties: { power: { type: 'boolean' } }, required: ['power'] } };
      const startMusic = { type: 'function', name: 'start_music', description: 'Play music.',
        parameters: { type: 'object', properties: { energetic: { type: 'boolean' }, loud: { type: 'boolean' } }, required: ['energetic', 'loud'] } };
      const dimLights = { type: 'function', name: 'dim_lights', description: 'Dim the lights.',
        parameters: { type: 'object', properties: { brightness: { type: 'number' } }, required: ['brightness'] } };

      const interaction = await client.interactions.create({
        model: 'gemini-4-hydrogen',
        input: 'Turn this place into a party!',
        tools: [powerDiscoBall, startMusic, dimLights],
        generation_config: { tool_choice: 'any' },
      });

      for (const step of interaction.steps) {
        if (step.type === 'function_call') {
          console.log(`${step.name}(${JSON.stringify(step.arguments)})`);
        }
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Turn this place into a party!",
          "tools": [
            {
              "type": "function",
              "name": "power_disco_ball",
              "description": "Powers the disco ball.",
              "parameters": {
                "type": "object",
                "properties": {
                  "power": {"type": "boolean"}
                },
                "required": ["power"]
              }
            },
            {
              "type": "function",
              "name": "start_music",
              "description": "Play music.",
              "parameters": {
                "type": "object",
                "properties": {
                  "energetic": {"type": "boolean"},
                  "loud": {"type": "boolean"}
                },
                "required": ["energetic", "loud"]
              }
            },
            {
              "type": "function",
              "name": "dim_lights",
              "description": "Dim the lights.",
              "parameters": {
                "type": "object",
                "properties": {
                  "brightness": {"type": "number"}
                },
                "required": ["brightness"]
              }
            }
          ]
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");

      Function function = Function.builder()
          .name("custom_function")
          .description("A custom function.")
          .parameters(parameters)
          .build();

      CreateModelInteraction params = CreateModelInteraction.builder()
          .model(Model.of("gemini-3.6-flash"))
          .input(InteractionsInput.of("Call the function."))
          .tools(Arrays.asList(function))
          .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof FunctionCallStep) {
            FunctionCallStep fc = (FunctionCallStep) step;
            System.out.println("Function: " + fc.name().orElse(""));
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

          powerDiscoBall := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("power_disco_ball"),
              Description: genai.Ptr("Powers the disco ball."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "power": map[string]any{"type": "boolean"},
                  },
                  "required": []string{"power"},
              },
          })

          startMusic := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("start_music"),
              Description: genai.Ptr("Play music."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "energetic": map[string]any{"type": "boolean"},
                      "loud":      map[string]any{"type": "boolean"},
                  },
                  "required": []string{"energetic", "loud"},
              },
          })

          dimLights := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("dim_lights"),
              Description: genai.Ptr("Dim the lights."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "brightness": map[string]any{"type": "number"},
                  },
                  "required": []string{"brightness"},
              },
          })

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Turn this place into a party!"),
                      Tools: []interactions.Tool{powerDiscoBall, startMusic, dimLights},
                      GenerationConfig: &interactions.GenerationConfig{
                          ToolChoice: genai.Ptr(interactions.NewToolChoice(interactions.ToolChoiceTypeAny)),
                      },
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range resp.Interaction.Steps {
              if step.FunctionCallStep != nil {
                  fc := step.FunctionCallStep
                  fmt.Printf("%s(%v)\n", fc.Name, fc.Arguments)
              }
          }
      }
      ```


## 組合式函式呼叫 {#compositional_function_calling}

將多個函式呼叫串連起來，處理複雜的請求（例如先取得地點，再取得該地點的天氣）。


=== "Python"

      ```python
      get_weather_forecast_declaration = {
          "type": "function",
          "name": "get_weather_forecast",
          "description": "Gets the current weather temperature for a given location.",
          "parameters": {
              "type": "object",
              "properties": {
                  "location": {"type": "string", "description": "The location"},
              },
              "required": ["location"],
          },
      }

      set_thermostat_temperature_declaration = {
          "type": "function",
          "name": "set_thermostat_temperature",
          "description": "Sets the thermostat to a desired temperature.",
          "parameters": {
              "type": "object",
              "properties": {
                  "temperature": {
                      "type": "integer",
                      "description": "The temperature in Celsius",
                  },
              },
              "required": ["temperature"],
          },
      }

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="If it's warmer than 20°C in London, set the thermostat to 20°C, otherwise 18°C.",
          tools=[
              get_weather_forecast_declaration,
              set_thermostat_temperature_declaration,
          ],
      )

      for step in interaction.steps:
          if step.type == "function_call":
              print(f"Function to call: {step.name}")
              print(f"Arguments: {step.arguments}")
          elif hasattr(step, "content") and step.content:
               for part in step.content:
                   if hasattr(part, "text"):
                       print(part.text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        model: 'gemini-4-hydrogen',
        input: "If it's warmer than 20°C in London, set the thermostat to 20°C, otherwise 18°C.",
        tools: [
          {
            type: "function",
            name: "get_weather_forecast",
            description: "Get the weather forecast for a given location and number of days.",
            parameters: {
              type: "object",
              properties: {
                location: { type: "string", description: "The city and state, e.g. San Francisco, CA" },
                days: { type: "number", description: "Number of days for the forecast." },
              },
              required: ["location"],
            },
          },
          {
            type: "function",
            name: "set_thermostat_temperature",
            description: "Set the target temperature for the home thermostat.",
            parameters: {
              type: "object",
              properties: {
                temperature: { type: "number", description: "Target temperature in Fahrenheit." },
              },
              required: ["temperature"],
            },
          },
        ],
      });

      for (const step of interaction.steps) {
        if (step.type === 'function_call') {
          console.log(`Function to call: ${step.name}`);
          console.log(`Arguments: ${JSON.stringify(step.arguments)}`);
        } else if ('content' in step && Array.isArray(step.content)) {
          for (const part of step.content || []) {
            if ('text' in part && part.text) {
              console.log(part.text);
            }
          }
        }
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "If it'\''s warmer than 20°C in London, set the thermostat to 20°C, otherwise 18°C.",
          "tools": [
            {
              "type": "function",
              "name": "get_weather_forecast",
              "description": "Gets the current weather temperature for a given location.",
              "parameters": {
                "type": "object",
                "properties": {
                  "location": {"type": "string"}
                },
                "required": ["location"]
              }
            },
            {
              "type": "function",
              "name": "set_thermostat_temperature",
              "description": "Sets the thermostat to a desired temperature.",
              "parameters": {
                "type": "object",
                "properties": {
                  "temperature": {"type": "integer"}
                },
                "required": ["temperature"]
              }
            }
          ]
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");

      Function function = Function.builder()
          .name("custom_function")
          .description("A custom function.")
          .parameters(parameters)
          .build();

      CreateModelInteraction params = CreateModelInteraction.builder()
          .model(Model.of("gemini-3.6-flash"))
          .input(InteractionsInput.of("Call the function."))
          .tools(Arrays.asList(function))
          .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof FunctionCallStep) {
            FunctionCallStep fc = (FunctionCallStep) step;
            System.out.println("Function: " + fc.name().orElse(""));
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

          getWeatherForecastDeclaration := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("get_weather_forecast"),
              Description: genai.Ptr("Gets the current weather temperature for a given location."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "location": map[string]any{
                          "type":        "string",
                          "description": "The location",
                      },
                  },
                  "required": []string{"location"},
              },
          })

          setThermostatTemperatureDeclaration := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("set_thermostat_temperature"),
              Description: genai.Ptr("Sets the thermostat to a desired temperature."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "temperature": map[string]any{
                          "type":        "integer",
                          "description": "The temperature in Celsius",
                      },
                  },
                  "required": []string{"temperature"},
              },
          })

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("If it's warmer than 20°C in London, set the thermostat to 20°C, otherwise 18°C."),
                      Tools: []interactions.Tool{getWeatherForecastDeclaration, setThermostatTemperatureDeclaration},
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range resp.Interaction.Steps {
              if step.FunctionCallStep != nil {
                  fc := step.FunctionCallStep
                  fmt.Println("Function to call:", fc.Name)
                  fmt.Println("Arguments:", fc.Arguments)
              } else if step.ModelOutputStep != nil {
                  for _, part := range step.ModelOutputStep.Content {
                      if part.TextContent != nil {
                          fmt.Println(part.TextContent.Text)
                      }
                  }
              }
          }
      }
      ```


## 函式呼叫模式 {#function_calling_modes}

透過 `tool_choice`（位於 `generation_config` 中）控制模型使用工具的方式：

* `auto`（預設）：由模型決定要呼叫函式還是直接回應。
* `any`：強制模型一律預測函式呼叫。
* `none`：禁止模型進行函式呼叫。
* `validated`：確保模型遵循函式結構定義。


=== "Python"

      ```python
      generation_config = {
          "tool_choice": {
              "allowed_tools": {
                  "mode": "any",
                  "tools": ["get_current_temperature"]
              }
          }
      }
      ```

=== "JavaScript"

      ```javascript
      const generation_config = {
        tool_choice: {
          allowed_tools: {
            mode: 'any',
            tools: ['get_current_temperature']
          }
        }
      };
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "What is the temperature in Boston?",
          "tools": [{
            "type": "function",
            "name": "get_current_temperature",
            "description": "Gets the current temperature for a given location.",
            "parameters": {
              "type": "object",
              "properties": {
                "location": {"type": "string"}
              },
              "required": ["location"]
            }
          }],
          "generation_config": {
            "tool_choice": {
              "allowed_tools": {
                "mode": "any",
                "tools": ["get_current_temperature"]
              }
            }
          }
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");

      Function function = Function.builder()
          .name("custom_function")
          .description("A custom function.")
          .parameters(parameters)
          .build();

      CreateModelInteraction params = CreateModelInteraction.builder()
          .model(Model.of("gemini-3.6-flash"))
          .input(InteractionsInput.of("Call the function."))
          .tools(Arrays.asList(function))
          .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof FunctionCallStep) {
            FunctionCallStep fc = (FunctionCallStep) step;
            System.out.println("Function: " + fc.name().orElse(""));
          }
        }
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
      )

      func main() {
          generationConfig := interactions.GenerationConfig{
              ToolChoice: genai.Ptr(interactions.NewToolChoice(interactions.ToolChoiceConfig{
                  AllowedTools: &interactions.AllowedTools{
                      Mode:  interactions.ToolChoiceTypeAny.ToPointer(),
                      Tools: []string{"get_current_temperature"},
                  },
              })),
          }
          _ = generationConfig
      }
      ```


## 多工具併用 {#native-tools}

你可以在同一個請求中啟用多個工具，將內建工具與函式呼叫結合使用。Gemini 4 與 Gemini 3 模型在 Interactions 中開箱即可將內建工具與函式呼叫併用。傳入 `previous_interaction_id` 後，內建工具的上下文會自動延續。


=== "Python"

      ```python
      from google import genai
      import json

      client = genai.Client()

      get_weather = {
          "type": "function",
          "name": "get_weather",
          "description": "Gets the weather for a requested city.",
          "parameters": {
              "type": "object",
              "properties": {
                  "city": {
                      "type": "string",
                      "description": "The city and state, e.g. Utqiaġvik, Alaska",
                  },
              },
              "required": ["city"],
          },
      }

      tools = [
          {"type": "google_search"},
          get_weather
      ]

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="What is the northernmost city in the United States? What's the weather like there today?",
          tools=tools
      )

      for step in interaction.steps:
          if step.type == "function_call":
              print(f"Function call: {step.name} (ID: {step.id})")
              result = {"response": "Very cold. 22 degrees Fahrenheit."}
              interaction_2 = client.interactions.create(
                  model="gemini-4-hydrogen",
                  previous_interaction_id=interaction.id,
                  tools=tools,
                  input=[{
                      "type": "function_result",
                      "name": step.name,
                      "call_id": step.id,
                      "result": [{"type": "text", "text": json.dumps(result)}]
                  }]
              )

              print(interaction_2.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const weatherTool = {
        type: 'function',
        name: 'get_weather',
        description: 'Gets the weather for a given location.',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The city and state, e.g. San Francisco, CA',
            },
          },
          required: ['location'],
        },
      };

      const tools = [
        { type: 'google_search' }, // Built-in tool
        weatherTool,
      ];

      const interaction = await client.interactions.create({
        model: 'gemini-4-hydrogen',
        input: "What is the northernmost city in the United States? What's the weather like there today?",
        tools: tools,
      });

      for (const step of interaction.steps) {
        if (step.type === 'function_call') {
          console.log(`Function call: ${step.name} (ID: ${step.id})`);
          const result = { response: 'Very cold. 22 degrees Fahrenheit.' };
          const interaction_2 = await client.interactions.create({
            model: 'gemini-4-hydrogen',
            previous_interaction_id: interaction.id,
            tools: tools,
            input: [
              {
                type: 'function_result',
                name: step.name,
                call_id: step.id,
                result: [{ type: 'text', text: JSON.stringify(result) }],
              },
            ],
          });

          console.log(interaction_2.output_text);
        }
      }
      ```

=== "REST"

      ```shell
      # Turn 1: Send request with built-in google_search tool and custom weather tool
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "What is the northernmost city in the United States? What'\''s the weather like there today?",
          "tools": [
            {"type": "google_search"},
            {
              "type": "function",
              "name": "get_weather",
              "description": "Gets the weather for a given location.",
              "parameters": {
                "type": "object",
                "properties": {
                  "location": {"type": "string", "description": "The city and state, e.g. San Francisco, CA"}
                },
                "required": ["location"]
              }
            }
          ]
        }'

      # Turn 2: Provide function result and pass previous_interaction_id
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "previous_interaction_id": "INTERACTION_ID",
          "tools": [
            {"type": "google_search"},
            {
              "type": "function",
              "name": "get_weather",
              "description": "Gets the weather for a given location.",
              "parameters": {
                "type": "object",
                "properties": {
                  "location": {"type": "string", "description": "The city and state, e.g. San Francisco, CA"}
                },
                "required": ["location"]
              }
            }
          ],
          "input": [
            {
              "type": "function_result",
              "name": "get_weather",
              "call_id": "call_123",
              "result": [{"type": "text", "text": "{\"response\": \"Very cold. 22 degrees Fahrenheit.\"}"}]
            }
          ]
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");

      Function function = Function.builder()
          .name("custom_function")
          .description("A custom function.")
          .parameters(parameters)
          .build();

      CreateModelInteraction params = CreateModelInteraction.builder()
          .model(Model.of("gemini-3.6-flash"))
          .input(InteractionsInput.of("Call the function."))
          .tools(Arrays.asList(function))
          .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof FunctionCallStep) {
            FunctionCallStep fc = (FunctionCallStep) step;
            System.out.println("Function: " + fc.name().orElse(""));
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

          getWeather := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("get_weather"),
              Description: genai.Ptr("Gets the weather for a requested city."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "city": map[string]any{
                          "type":        "string",
                          "description": "The city and state, e.g. Utqiaġvik, Alaska",
                      },
                  },
                  "required": []string{"city"},
              },
          })

          tools := []interactions.Tool{
              interactions.NewTool(interactions.GoogleSearch{}),
              getWeather,
          }

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("What is the northernmost city in the United States? What's the weather like there today?"),
                      Tools: tools,
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range resp.Interaction.Steps {
              if step.FunctionCallStep != nil {
                  fcStep := step.FunctionCallStep
                  fmt.Printf("Function call: %s (ID: %s)\n", fcStep.Name, fcStep.ID)
                  resultJson := `{"response": "Very cold. 22 degrees Fahrenheit."}`

                  resultStep := interactions.NewStep(interactions.FunctionResultStep{
                      Name:   genai.Ptr(fcStep.Name),
                      CallID: fcStep.ID,
                      Result: interactions.NewFunctionResultStepResultUnion([]interactions.FunctionResultSubcontent{
                          interactions.NewFunctionResultSubcontent(interactions.TextContent{
                              Text: resultJson,
                          }),
                      }),
                  })

                  resp2, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                      Body: operations.NewCreateInteractionRequestBody(
                          interactions.CreateModelInteraction{
                              Model:                 interactions.Model("gemini-4-hydrogen"),
                              PreviousInteractionID: resp.Interaction.ID,
                              Tools:                 tools,
                              Input:                 interactions.NewInteractionsInput([]interactions.Step{resultStep}),
                          },
                      ),
                  })
                  if err != nil {
                      log.Fatal(err)
                  }

                  fmt.Println(resp2.Interaction.GetOutputText())
              }
          }
      }
      ```


## 多模態函式回應 {#multimodal}

對於 Gemini 3 系列模型，你可以在傳送給模型的函式回應中加入多模態內容。模型能在下一個回合處理這些多模態內容，產生資訊更充分的回應。

若要在函式回應中加入多模態資料，請將它以一或多個內容區塊的形式放入 `result` 欄位（屬於 `function_result` 步驟）。每個內容區塊都必須指定其 `type`。支援的類型如下：

* **`text`**
* **`image`**：`image/png`、`image/jpeg`、`image/webp`
* **`document`**：`application/pdf`、`text/csv`，以及
  [Office 與 OpenDocument 檔案](/docs/document-processing/#office-documents)
  （DOCX、DOC、DOTX、ODT、PPTX、PPT、ODP、XLSX、XLS、ODS）
* **`audio`**：[支援的音訊格式](/docs/audio/#supported-formats)
* **`video`**：[支援的影片格式](/docs/video-understanding/#supported-formats)
  （適用於 `v1beta` 與 `v1alpha`）

每個媒體區塊都接受以 base64 編碼的 `data` 或 `uri`，例如
[Files API](/docs/files/) 的 URI。函式結果中的檔案，其處理方式與一般輸入中的相同檔案相同。範例請見
[以 URI 回傳檔案](/docs/function-calling/#file-uri)。

若某個區塊使用了不支援的 MIME 類型，API 會回傳 `400
INVALID_ARGUMENT` 錯誤，指出問題欄位並列出可接受的類型。

以下範例示範如何在互動中，將包含圖片資料的函式回應傳回模型：


=== "Python"

      ```python
      import base64
      from google import genai
      import requests

      client = genai.Client()

      tool_call = next(s for s in interaction.steps if s.type == "function_call")

      image_path = "https://goo.gle/instrument-img"
      image_bytes = requests.get(image_path).content

      base64_image_data = base64.b64encode(image_bytes).decode("utf-8")

      final_interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          previous_interaction_id=interaction.id,
          input=[
              {
                  "type": "function_result",
                  "name": tool_call.name,
                  "call_id": tool_call.id,
                  "result": [
                      {"type": "text", "text": "instrument.jpg"},
                      {
                          "type": "image",
                          "mime_type": "image/jpeg",
                          "data": base64_image_data,
                      },
                  ],
              }
          ],
      )

      print(final_interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      let toolCall;
      for (const s of interaction.steps || []) {
        if (s.type === 'function_call') {
          toolCall = s;
          break;
        }
      }

      const base64ImageData = "BASE64_IMAGE_DATA";

      const finalInteraction = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          previous_interaction_id: interaction.id,
          input: [{
              type: 'function_result',
              name: (toolCall && toolCall.type === 'function_call' ? toolCall.name : ''),
              call_id: (toolCall && toolCall.type === 'function_call' ? toolCall.id : ''),
              result: [
                  { type: 'text', text: 'instrument.jpg' },
                  {
                      type: 'image',
                      mime_type: 'image/jpeg',
                      data: base64ImageData,
                  }
              ]
          }]
      });

      console.log(finalInteraction.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "previous_interaction_id": "INTERACTION_ID",
          "input": [
            {
              "type": "function_result",
              "name": "get_image",
              "call_id": "call_123",
              "result": [
                {"type": "text", "text": "instrument.jpg"},
                {
                  "type": "image",
                  "mime_type": "image/jpeg",
                  "data": "BASE64_IMAGE_DATA"
                }
              ]
            }
          ]
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");

      Function function = Function.builder()
          .name("custom_function")
          .description("A custom function.")
          .parameters(parameters)
          .build();

      CreateModelInteraction params = CreateModelInteraction.builder()
          .model(Model.of("gemini-3.6-flash"))
          .input(InteractionsInput.of("Call the function."))
          .tools(Arrays.asList(function))
          .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof FunctionCallStep) {
            FunctionCallStep fc = (FunctionCallStep) step;
            System.out.println("Function: " + fc.name().orElse(""));
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

          getInstrumentImage := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("get_instrument_image"),
              Description: genai.Ptr("Gets an image of an instrument."),
              Parameters: map[string]any{
                  "type": "object",
              },
          })

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Show me the instrument."),
                      Tools: []interactions.Tool{getInstrumentImage},
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          var toolCall *interactions.FunctionCallStep
          for _, step := range resp.Interaction.Steps {
              if step.FunctionCallStep != nil {
                  toolCall = step.FunctionCallStep
                  break
              }
          }

          if toolCall != nil {
              base64ImageData := "BASE64_IMAGE_DATA"

              resultStep := interactions.NewStep(interactions.FunctionResultStep{
                  Name:   genai.Ptr(toolCall.Name),
                  CallID: toolCall.ID,
                  Result: interactions.NewFunctionResultStepResultUnion([]interactions.FunctionResultSubcontent{
                      interactions.NewFunctionResultSubcontent(interactions.TextContent{
                          Text: "instrument.jpg",
                      }),
                      interactions.NewFunctionResultSubcontent(interactions.ImageContent{
                          MimeType: interactions.ImageContentMimeTypeImageJpeg.ToPointer(),
                          Data:     genai.Ptr(base64ImageData),
                      }),
                  }),
              })

              finalResp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                  Body: operations.NewCreateInteractionRequestBody(
                      interactions.CreateModelInteraction{
                          Model:                 interactions.Model("gemini-4-hydrogen"),
                          PreviousInteractionID: resp.Interaction.ID,
                          Input:                 interactions.NewInteractionsInput([]interactions.Step{resultStep}),
                      },
                  ),
              })
              if err != nil {
                  log.Fatal(err)
              }

              fmt.Println(finalResp.Interaction.GetOutputText())
          }
      }
      ```


### 以 URI 回傳檔案 {#file-uri}

內嵌資料會占用請求大小上限。對於影片、長音訊或多頁文件等大型檔案，請先用
[Files API](/docs/files/) 上傳檔案，再回傳其 `uri`，而非內嵌 `data`。

以下範例示範一個 `view_file` 工具，透過 Files API URI 回傳一份 Excel
試算表與一段影片。對於 `video` 區塊，你可以將
`processing` 設為 `"static"` 或 `"agentic"`。若未設定，則比照輸入影片的預設值。詳情請見
[代理式影片理解](/docs/video-understanding/#agentic-video-understanding)。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      tool_call = next(s for s in interaction.steps if s.type == "function_call")

      # Your tool uploads the files and returns their URIs.
      sheet = client.files.upload(
          file="q3_sales.xlsx",
          config={"mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
      )
      clip = client.files.upload(file="store_walkthrough.mp4")

      final_interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          previous_interaction_id=interaction.id,
          input=[
              {
                  "type": "function_result",
                  "name": tool_call.name,
                  "call_id": tool_call.id,
                  "result": [
                      {"type": "text", "text": "{\"status\": \"ok\"}"},
                      {
                          "type": "document",
                          "uri": sheet.uri,
                          "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                      },
                      {
                          "type": "video",
                          "uri": clip.uri,
                          "mime_type": "video/mp4",
                          "processing": "agentic",
                      },
                  ],
              }
          ],
      )

      print(final_interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const toolCall = interaction.steps.find(s => s.type === 'function_call');

      // Your tool uploads the files and returns their URIs.
      const sheet = await client.files.upload({
          file: 'q3_sales.xlsx',
          config: { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      });
      const clip = await client.files.upload({ file: 'store_walkthrough.mp4' });

      const finalInteraction = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          previous_interaction_id: interaction.id,
          input: [{
              type: 'function_result',
              name: toolCall.name,
              call_id: toolCall.id,
              result: [
                  { type: 'text', text: '{"status": "ok"}' },
                  {
                      type: 'document',
                      uri: sheet.uri,
                      mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  },
                  {
                      type: 'video',
                      uri: clip.uri,
                      mime_type: 'video/mp4',
                      processing: 'agentic',
                  }
              ]
          }]
      });

      console.log(finalInteraction.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "previous_interaction_id": "INTERACTION_ID",
          "input": [
            {
              "type": "function_result",
              "name": "view_file",
              "call_id": "call_123",
              "result": [
                {"type": "text", "text": "{\"status\": \"ok\"}"},
                {
                  "type": "document",
                  "uri": "https://generativelanguage.googleapis.com/v1beta/files/SHEET_FILE_ID",
                  "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                },
                {
                  "type": "video",
                  "uri": "https://generativelanguage.googleapis.com/v1beta/files/VIDEO_FILE_ID",
                  "mime_type": "video/mp4",
                  "processing": "agentic"
                }
              ]
            }
          ]
        }'
      ```


### 在函式回應中切割與檢視檔案 {#file-inspection-options}

你的工具可以在頂層 `function_result` 區塊中使用相同的 `processing` 與 `resolution` 欄位，回傳切割後的頁面、試算表範圍或媒體片段。模型會自動收到檔案中繼資料（頁數與工作表名稱），因此可以在後續回合中要求更窄的範圍。

如需瞭解所有可用選項，請見[自訂文件、簡報與試算表處理](/docs/document-processing/#customize-document-processing)、[自訂影片處理](/docs/video-understanding/#customize-video-processing)與[剪輯音訊區間](/docs/audio/#clipping-intervals)。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      manual_file = client.files.upload(file="service_manual.pdf")

      tools = [
          {
              "type": "function",
              "name": "inspect_document_pages",
              "description": "Load specific pages of service_manual.pdf.",
              "parameters": {
                  "type": "object",
                  "properties": {
                      "start_page": {"type": "integer", "description": "1-indexed start page."},
                      "end_page": {"type": "integer", "description": "1-indexed end page."},
                  },
                  "required": ["start_page", "end_page"],
              },
          }
      ]

      turn1 = client.interactions.create(
          model="gemini-4-hydrogen",
          tools=tools,
          input="Use inspect_document_pages to read pages 14-16 of service_manual.pdf.",
      )

      call = next(s for s in turn1.steps if s.type == "function_call")

      turn2 = client.interactions.create(
          model="gemini-4-hydrogen",
          previous_interaction_id=turn1.id,
          tools=tools,
          input=[
              {
                  "type": "function_result",
                  "call_id": call.id,
                  "name": call.name,
                  "result": [
                      {
                          "type": "document",
                          "uri": manual_file.uri,
                          "mime_type": "application/pdf",
                          "resolution": "high",
                          "processing": {
                              "type": "static",
                              "page_options": {
                                  "start_page": call.arguments["start_page"],
                                  "end_page": call.arguments["end_page"],
                                  "content_layers": ["page_image"],
                              },
                          },
                      }
                  ],
              }
          ],
      )

      print(turn2.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const manualFile = await ai.files.upload({
        file: "service_manual.pdf",
        config: { mimeType: "application/pdf" },
      });

      const tools = [
        {
          type: "function",
          name: "inspect_document_pages",
          description: "Load specific pages of service_manual.pdf.",
          parameters: {
            type: "object",
            properties: {
              start_page: { type: "integer", description: "1-indexed start page." },
              end_page: { type: "integer", description: "1-indexed end page." },
            },
            required: ["start_page", "end_page"],
          },
        },
      ];

      const turn1 = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        tools,
        input: "Use inspect_document_pages to read pages 14-16 of service_manual.pdf.",
      });

      const toolCall = turn1.steps.find((s) => s.type === "function_call");

      const turn2 = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        previous_interaction_id: turn1.id,
        tools,
        input: [
          {
            type: "function_result",
            call_id: toolCall.id,
            name: toolCall.name,
            result: [
              {
                type: "document",
                uri: manualFile.uri,
                mime_type: "application/pdf",
                resolution: "high",
                processing: {
                  type: "static",
                  page_options: {
                    start_page: toolCall.arguments.start_page,
                    end_page: toolCall.arguments.end_page,
                    content_layers: ["page_image"],
                  },
                },
              },
            ],
          },
        ],
      });

      console.log(turn2.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
          "model": "gemini-4-hydrogen",
          "previous_interaction_id": "INTERACTION_ID",
          "input": [
            {
              "type": "function_result",
              "call_id": "CALL_ID",
              "name": "inspect_document_pages",
              "result": [
                {
                  "type": "document",
                  "uri": "https://generativelanguage.googleapis.com/v1beta/files/MANUAL_FILE_ID",
                  "mime_type": "application/pdf",
                  "resolution": "high",
                  "processing": {
                    "type": "static",
                    "page_options": {
                      "start_page": 14,
                      "end_page": 16,
                      "content_layers": ["page_image"]
                    }
                  }
                }
              ]
            }
          ]
        }'
      ```


## 函式呼叫搭配結構化輸出 {#structured-output}

對於 Gemini 3 系列模型，可將函式呼叫與
[結構化輸出](/docs/structured-output/)結合，獲得格式一致的回應。

## 遠端 MCP（Model Context Protocol）{#mcp}

Interactions API 支援連接遠端 MCP 伺服器，讓模型能存取外部工具與服務。你只需在工具設定中提供伺服器的 `name` 與 `url`。

使用遠端 MCP 時，請注意以下限制：

* **伺服器類型**：遠端 MCP 僅適用於 Streamable HTTP 伺服器，不支援 SSE（Server-Sent Events）伺服器。
* **命名**：MCP 伺服器名稱不應包含 `-` 字元，請改用 `snake_case` 形式的伺服器名稱。

| 欄位 | 類型 | 必填 | 說明 |
| :--- | :--- | :--- | :--- |
| `type` | `string` | 是 | 必須為 `"mcp_server"`。 |
| `name` | `string` | 否 | MCP 伺服器的顯示名稱。 |
| `url` | `string` | 否 | MCP 伺服器端點的完整 URL。 |
| `headers` | `object` | 否 | 隨每次傳送至伺服器的請求一併送出的 HTTP 標頭鍵值對（例如驗證權杖）。 |
| `allowed_tools` | `array` | 否 | 限制代理可呼叫該伺服器的哪些工具。 |

### 範例


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Check the weather in San Francisco.",
          tools=[
              {
                  "type": "mcp_server",
                  "name": "weather",
                  "url": "https://gemini-api-demos.uc.r.appspot.com/mcp",
              }
          ]
      )
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          input: 'Check the weather in San Francisco.',
          tools: [
              {
                  type: 'mcp_server',
                  name: 'weather',
                  url: 'https://gemini-api-demos.uc.r.appspot.com/mcp'
              }
          ]
      });
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "model": "gemini-4-hydrogen",
          "input": "Check the weather in San Francisco.",
          "tools": [
              {
                  "type": "mcp_server",
                  "name": "weather",
                  "url": "https://gemini-api-demos.uc.r.appspot.com/mcp"
              }
          ]
      }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");

      Function function = Function.builder()
          .name("custom_function")
          .description("A custom function.")
          .parameters(parameters)
          .build();

      CreateModelInteraction params = CreateModelInteraction.builder()
          .model(Model.of("gemini-3.6-flash"))
          .input(InteractionsInput.of("Call the function."))
          .tools(Arrays.asList(function))
          .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof FunctionCallStep) {
            FunctionCallStep fc = (FunctionCallStep) step;
            System.out.println("Function: " + fc.name().orElse(""));
          }
        }
      }
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
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Check the weather in San Francisco."),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.MCPServer{
                              Name: genai.Ptr("weather"),
                              URL:  genai.Ptr("https://gemini-api-demos.uc.r.appspot.com/mcp"),
                          }),
                      },
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }
          _ = resp
      }
      ```


## 串流工具呼叫 {#streaming-tool-calls}

搭配串流使用工具時，模型會在串流上以一連串 `step.delta` 事件的形式產生函式呼叫。工具引數可透過 `arguments` 以部分引數的形式串流傳送。你必須彙總這些增量，才能重建完整的工具呼叫並加以執行。


=== "Python"

      ```python
      import json
      from google import genai

      client = genai.Client()

      weather_tool = {
          "type": "function",
          "name": "get_weather",
          "description": "Gets the weather for a given location.",
          "parameters": {
              "type": "object",
              "properties": {
                  "location": {"type": "string", "description": "The city and state"}
              },
              "required": ["location"]
          }
      }

      stream = client.interactions.create(
          model="gemini-4-hydrogen",
          input="What is the weather in Paris?",
          tools=[weather_tool],
          stream=True
      )

      current_calls = {}
      tool_calls = []

      for event in stream:
          if event.event_type == "step.start":
              if event.step.type == "function_call":
                  current_calls[event.index] = {
                      "id": event.step.id,
                      "name": event.step.name,
                      "arguments": ""
                  }
                  if hasattr(event.step, "arguments") and event.step.arguments:
                      if isinstance(event.step.arguments, dict):
                          current_calls[event.index]["arguments"] = json.dumps(event.step.arguments)
                      else:
                          current_calls[event.index]["arguments"] = event.step.arguments
          elif event.event_type == "step.delta":
              if event.delta.type == "arguments":
                  if event.index in current_calls:
                      current_calls[event.index]["arguments"] += event.delta.partial_arguments
              elif event.delta.type == "text":
                  print(event.delta.text, end="", flush=True)

          elif event.event_type == "interaction.completed":
              for index, call in current_calls.items():
                  args = call["arguments"]
                  if args:
                      args = json.loads(args)
                  else:
                      args = {}

                  tool_calls.append({
                      "type": "function_call",
                      "id": call["id"],
                      "name": call["name"],
                      "arguments": args
                  })

              print(f"\nFinal tool calls ready to execute:")
              print(json.dumps(tool_calls, indent=2))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const stream = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          input: 'What is the weather in Paris?',
          tools: [
              {
                  type: 'function',
                  name: 'get_weather',
                  description: 'Gets the weather for a given location.',
                  parameters: {
                      type: 'object',
                      properties: {
                          location: { type: 'string', description: 'The city and state' }
                      },
                      required: ['location']
                  }
              }
          ],
          stream: true,
      });

      const currentCalls = [];
      let toolCalls = [];

      for await (const event of stream) {
          const evType = event.event_type;
          if (evType === 'step.start') {
              if (event.step.type === 'function_call') {
                  currentCalls[event.index] = {
                      id: event.step.id,
                      name: event.step.name,
                      arguments: ''
                  };
                  if (event.step.arguments) {
                      if (typeof event.step.arguments === 'object') {
                          currentCalls[event.index].arguments = JSON.stringify(event.step.arguments);
                      } else {
                          currentCalls[event.index].arguments = event.step.arguments;
                      }
                  }
              }
          } else if (evType === 'step.delta') {
              if (event.delta.type === 'arguments_delta') {
                  if (currentCalls[event.index]) {
                      currentCalls[event.index].arguments += event.delta.arguments ?? '';
                  }
              } else if (event.delta.type === 'text') {
                  process.stdout.write(event.delta.text ?? '');
              }
          } else if (evType === 'step.stop') {
              toolCalls = currentCalls.map((call) => ({
                  type: 'function_call',
                  id: call.id,
                  name: call.name,
                  arguments: call.arguments ? JSON.parse(call.arguments) : {}
              }));
              console.log('\nFinal tool calls ready to execute:');
              console.log(JSON.stringify(toolCalls, null, 2));
          }
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "model": "gemini-4-hydrogen",
          "input": "What is the weather in Paris?",
          "tools": [{
              "type": "function",
              "name": "get_weather",
              "description": "Gets the weather for a given location.",
              "parameters": {
                  "type": "object",
                  "properties": {
                      "location": {"type": "string", "description": "The city and state"}
                  },
                  "required": ["location"]
              }
          }],
          "stream": true
      }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();
      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");

      Function function = Function.builder()
          .name("custom_function")
          .description("A custom function.")
          .parameters(parameters)
          .build();

      CreateModelInteraction params = CreateModelInteraction.builder()
          .model(Model.of("gemini-3.6-flash"))
          .input(InteractionsInput.of("Call the function."))
          .tools(Arrays.asList(function))
          .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof FunctionCallStep) {
            FunctionCallStep fc = (FunctionCallStep) step;
            System.out.println("Function: " + fc.name().orElse(""));
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
          "strings"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      type callState struct {
          id        string
          name      string
          arguments *strings.Builder
      }

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          weatherTool := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("get_weather"),
              Description: genai.Ptr("Gets the weather for a given location."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "location": map[string]any{
                          "type":        "string",
                          "description": "The city and state",
                      },
                  },
                  "required": []string{"location"},
              },
          })

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model:  interactions.Model("gemini-4-hydrogen"),
                      Input:  interactions.NewInteractionsInput("What is the weather in Paris?"),
                      Tools:  []interactions.Tool{weatherTool},
                      Stream: genai.Ptr(true),
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }
          defer resp.InteractionSSEStreamEvent.Close()

          currentCalls := make(map[int]*callState)
          var toolCalls []map[string]any

          for resp.InteractionSSEStreamEvent.Next() {
              event := resp.InteractionSSEStreamEvent.Value()
              if stepStart := event.GetDataStepStart(); stepStart != nil {
                  if fcStep := stepStart.GetStepFunctionCall(); fcStep != nil {
                      idx := stepStart.Index
                      builder := &strings.Builder{}
                      if len(fcStep.Arguments) > 0 {
                          builder.WriteString(fmt.Sprint(fcStep.Arguments))
                      }
                      currentCalls[idx] = &callState{
                          id:        fcStep.ID,
                          name:      fcStep.Name,
                          arguments: builder,
                      }
                  }
              } else if stepDelta := event.GetDataStepDelta(); stepDelta != nil {
                  idx := stepDelta.Index
                  if argsDelta := stepDelta.GetDeltaArgumentsDelta(); argsDelta != nil {
                      if argsDelta.Arguments != nil {
                          if call, ok := currentCalls[idx]; ok {
                              call.arguments.WriteString(*argsDelta.Arguments)
                          }
                      }
                  } else if textDelta := stepDelta.GetDeltaText(); textDelta != nil {
                      fmt.Print(textDelta.GetText())
                  }
              } else if completed := event.GetDataInteractionCompleted(); completed != nil {
                  for _, call := range currentCalls {
                      toolCalls = append(toolCalls, map[string]any{
                          "type":      "function_call",
                          "id":        call.id,
                          "name":      call.name,
                          "arguments": call.arguments.String(),
                      })
                  }
                  fmt.Println("\nFinal tool calls ready to execute:")
                  fmt.Println(toolCalls)
              }
          }
      }
      ```


## 最佳做法 {#best-practices}

* **函式與參數說明**：清楚且具體。
* **命名**：使用具描述性的名稱，不含空白或特殊字元。
* **強型別**：使用明確的類型（integer、string、enum）。
* **工具選擇**：啟用中的工具集最多維持在 10 到 20 個。
* **提示詞設計**：提供上下文與指令。
* **驗證**：執行前先驗證函式呼叫。
* **錯誤處理**：實作穩健的錯誤處理。
* **安全性**：對外部 API 使用適當的驗證方式。

## 工具呼叫前文字要求的因應方式 {#workarounds-for-pre-tool-text-requirements}

**問題**：若你的提示詞要求模型在進行工具呼叫之前，先立即輸出結構化文字（XML、YAML、JSON 等）（例如 `<UPDATE>...</UPDATE>`），工具呼叫偶爾會以 `Malformed_Function_Call` 失敗。

**解決方式**：以下因應方式可解決這個問題：

* **首選**：指示模型將工具呼叫前的筆記放在專用的 `update()` 函式呼叫中，而非原始文字（詳見下文）。
* 指示模型以 Markdown 標題（`# UPDATE`、`## PLAN`）撰寫筆記，而非結構化文字。
* 不要要求模型在工具呼叫前輸出文字。

### 首選因應方式：將工作筆記包裝在專用函式呼叫中 {#preferred-workaround}

不要使用原始指令：

```html
Before calling a tool, in every response you MUST first output a single `<UPDATE>` part as specified, don't skip this part or any of required sub-tags within `<UPDATE>`.
```

改用這份更新後的指令：

```html
Before calling any other tool, in every response you MUST first call `update` with all required parameters (previous_step, plan, next_step, external).
```

並更新客戶請求中所有參照舊 `<UPDATE>` XML 格式之處。接著加入 update 函式對應的函式宣告：

```json
{
  "name": "update",
  "description": "Update working notes (previous step analysis, plan, next step, external note).",
  "parameters": {
    "type": "OBJECT",
    "properties": {
      "previous_step": {
        "type": "STRING",
        "description": "Key findings and outcomes since the previous step."
      },
      "plan": {
        "type": "STRING",
        "description": "The current status of the plan."
      },
      "next_step": {
        "type": "STRING",
        "description": "Brief explanation of the immediate next action according to the plan."
      },
      "external": {
        "type": "STRING",
        "description": "A short, plain-language note shown to the User about what you are ABOUT TO DO next."
      }
    },
    "required": [
      "previous_step",
      "plan",
      "next_step",
      "external"
    ]
  }
}
```

如此一來，模型會在同一個步驟中進行兩次呼叫：取代結構化 XML 的 `update()` 呼叫，以及它真正想進行的函式呼叫。

## 注意事項與限制 {#limitations}

* 僅支援 [OpenAPI 結構定義的子集](/api-reference/generate-content/#Resource:Tool)。
* 在 `any` 模式下，過大或巢狀層級過深的結構定義可能會被拒絕。
* Python 中支援的參數類型有限。

### 簡化複雜的函式結構定義 {#simplifying-complex-schemas}

當你使用 `any` 模式或定義複雜的參數結構時，API 會將你的函式宣告編譯成一台狀態機，用以限制權杖的生成。這台狀態機會對狀態總數、分支路徑與巢狀深度設下限制。若你的工具整體複雜度超過這些限制，API 會以 `400 INVALID_ARGUMENT` 錯誤拒絕請求。

若要修正結構定義遭拒的錯誤，請降低宣告的結構深度與分支因子。簡化複雜函式結構定義的方法有幾種：

* **拆分大型工具集，並將規則移至說明中**：受限解碼會將所有已宣告的工具一併評估。請限制單一請求中的函式數量，並將龐大的單一函式拆成較小、聚焦的工具。將複雜的格式規則移入欄位的 `description` 屬性或系統指令中，如此既能引導模型，又不會擴大文法規模。
* **攤平巢狀物件並限制遞迴**：以較扁平的結構取代深層巢狀的物件階層。若你使用 `$defs` 與 `$ref` 定義遞迴類型，請將遞迴參照設為可選或可為 null。避免透過必填屬性，或 `minItems` 大於零的陣列進行遞迴。
* **減少可選欄位、列舉與聯集造成的分支**：可選屬性、`enum` 值與 `anyOf` 分支都會倍增輸出文法中的分支路徑。請盡可能將屬性標記為 `required`，並在欄位可為空時允許 `null` 值。精簡過大的 `enum` 清單並簡化 `anyOf` 聯集，或將限制寫入提示詞（例如搭配 Pydantic 結構定義），作為較寬鬆的約束。
* **縮短屬性名稱並移除陣列界限**：屬性鍵消耗的狀態數與其字元長度成正比。`minItems` 與 `maxItems` 等陣列界限也會為每個計數位置複製一份項目結構定義。請使用簡潔的屬性名稱、移除未使用的欄位，並將陣列界限寫入提示詞（例如搭配 Pydantic 結構定義）作為較寬鬆的約束，或在應用程式程式碼中檢查陣列長度。

