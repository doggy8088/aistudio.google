# Antigravity 代理

Antigravity 代理是 Gemini API 上的通用型受管代理。只要一次 API 呼叫，就能取得一個會推理、執行程式碼、管理檔案並瀏覽網路的代理，且全程在您專屬、由 Google 代管的安全 Linux 沙箱中運作。

它以 Gemini 4 Hydrogen 為基礎，採用與 Antigravity IDE 相同的執行框架。您可以透過 `agent_config` 設定底層的 Gemini 模型。可透過 [Interactions API](/docs/interactions-overview/) 與 [Google AI Studio](https://aistudio.google.com) 使用。


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Read Hacker News, summarize the top 10 stories, and save the results as a PDF.",
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
          input: "Read Hacker News, summarize the top 10 stories, and save the results as a PDF.",
          environment: "remote",
      }, { timeout: 300000 });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Read Hacker News, summarize the top 10 stories, and save the results as a PDF.",
          "environment": "remote"
      }'
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

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Read Hacker News, summarize the top 10 stories, and save the results as a PDF."))
          .environment(CreateAgentInteractionEnvironment.of("remote"))
          .build();

      Interaction interaction = client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
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
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Read Hacker News, summarize the top 10 stories, and save the results as a PDF."),
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


## 功能 {#capabilities}

每次呼叫都能佈建一個 Linux 沙箱，並啟動工具使用循環。代理會規劃、行動、觀察結果，然後不斷重複，直到任務完成。

- **程式碼執行**：執行 Bash、Python 與 Node.js 指令，安裝套件、執行測試、建置應用程式。
- **檔案管理**：在沙箱中讀取、寫入、編輯、搜尋與列出檔案。檔案會在多次互動之間保留。
- **網路存取**：透過 Google 搜尋與 URL 擷取取得資料。
- **上下文壓縮**：自動壓縮上下文（約在 135k 個 token 時觸發），讓長時間執行、多輪的工作階段不遺失上下文，也不會撞上 token 上限。

多輪使用方式與串流的說明，請參閱[快速入門](/docs/managed-agents-quickstart/)。

## 支援的工具 {#supported-tools}

代理預設可使用 `code_execution`、`google_search` 與 `url_context`。只要指定 `environment` 參數，檔案系統工具就會自動啟用。您也可以定義**自訂函式**，讓代理連接到您自己的 API 與工具。只有在自訂或限制預設工具集，或加入自訂函式時，才需要指定 `tools` 參數。

| 工具 | 類型值 | 說明 |
| :--- | :--- | :--- |
| 程式碼執行 | `code_execution` | 執行 shell 指令（bash、Python、Node），並擷取 stdout/stderr。 |
| Google 搜尋 | `google_search` | 搜尋公開網路。 |
| URL 上下文 | `url_context` | 擷取並讀取網頁。 |
| 檔案系統 | *(enabled via `environment`)* | 在沙箱中讀取、寫入、編輯、搜尋與列出檔案。設定 `environment` 後，系統會自動啟用這些工具。 |
| 自訂函式 | `function` | 定義代理可要求執行的自訂函式。請參閱[函式呼叫](/docs/antigravity-agent/#function-calling)。 |
| 遠端 MCP 伺服器 | `mcp_server` | 將外部 Model Context Protocol（MCP）伺服器註冊為工具。請參閱 [MCP 伺服器](/docs/antigravity-agent/#mcp-servers)。 |

您可以利用同步 [Hooks](/docs/agent-hooks/)，直接在遠端沙箱內攔截並驗證 `code_execution` 與 `filesystem` 工具的執行。

若要將代理限制為只能使用特定工具，只傳入需要的工具即可：


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Search for the latest AI research papers on reasoning and summarize them.",
          environment="remote",
          tools=[
              {"type": "google_search"},
              {"type": "url_context"},
          ],
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Search for the latest AI research papers on reasoning and summarize them.",
          environment: "remote",
          tools: [
              { type: "google_search" },
              { type: "url_context" },
          ],
      }, { timeout: 300000 });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Search for the latest AI research papers on reasoning and summarize them.",
          "environment": "remote",
          "tools": [
              {"type": "google_search"},
              {"type": "url_context"}
          ]
      }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.GoogleSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.URLContext;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.List;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Search for the latest AI research papers on reasoning and summarize them."))
          .environment(CreateAgentInteractionEnvironment.of("remote"))
          .tools(List.of(
              GoogleSearch.builder().build(),
              URLContext.builder().build()
          ))
          .build();

      Interaction interaction = client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
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
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Search for the latest AI research papers on reasoning and summarize them."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment("remote")),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.GoogleSearch{}),
                      interactions.NewTool(interactions.URLContext{}),
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


## 多模態輸入 {#multimodal-input}

Antigravity 代理支援多模態輸入。目前僅支援 `text` 與 `image` 輸入。圖片必須以行內 base64 編碼字串（`data`）的形式提供。


=== "Python"

      ```py
      import base64
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      with open("path/to/chart.png", "rb") as f:
          image_bytes = f.read()

      interaction_inline = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input=[
              {"type": "text", "text": "Analyze this chart and summarize the trends."},
              {
                  "type": "image",
                  "data": base64.b64encode(image_bytes).decode("utf-8"),
                  "mime_type": "image/png",
              },
          ],
          environment="remote",
      )
      ```

=== "JavaScript"

      ```javascript

      import { GoogleGenAI } from "@google/genai";

      import * as fs from "node:fs";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });
      const base64Image = fs.readFileSync("path/to/chart.png", { encoding: "base64" });

      const interactionInline = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: [
              { type: "text", text: "Analyze this chart and summarize the trends." },
              {
                  type: "image",
                  data: base64Image,
                  mime_type: "image/png",
              },
          ],
          environment: "remote",
      }, { timeout: 300000 });
      ```

=== "REST"

      ```shell
      BASE64_IMAGE=$(base64 -w0 /path/to/chart.png)

      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d "{
          \"agent\": \"antigravity-preview-09-2026\",
          \"input\": [
              {\"type\": \"text\", \"text\": \"Analyze this chart and summarize the trends.\"},
              {
                  \"type\": \"image\",
                  \"mime_type\": \"image/png\",
                  \"data\": \"$BASE64_IMAGE\"
              }
          ],
          \"environment\": \"remote\"
      }"
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Base64;
      import java.util.List;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      byte[] imageBytes = Files.readAllBytes(Paths.get("path/to/chart.png"));
      String base64Image = Base64.getEncoder().encodeToString(imageBytes);

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.ofContent(List.of(
              TextContent.builder().text("Analyze this chart and summarize the trends.").build(),
              ImageContent.builder()
                  .data(base64Image)
                  .mimeType(ImageContentMimeType.IMAGE_PNG)
                  .build()
          )))
          .environment(CreateAgentInteractionEnvironment.of("remote"))
          .build();

      Interaction interactionInline = client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      System.out.println(interactionInline.outputText().orElse(""));
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

          imageBytes, err := os.ReadFile("path/to/chart.png")
          if err != nil {
              log.Fatal(err)
          }
          base64Image := base64.StdEncoding.EncodeToString(imageBytes)

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent: interactions.AgentOption("antigravity-preview-09-2026"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: "Analyze this chart and summarize the trends.",
                      }),
                      interactions.NewContent(interactions.ImageContent{
                          Data:     genai.Ptr(base64Image),
                          MimeType: interactions.ImageContentMimeTypeImagePng.ToPointer(),
                      }),
                  }),
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


## 函式呼叫 {#function-calling}

函式呼叫讓您能定義代理可呼叫的自訂工具，將 Antigravity 代理連接到外部 API 與資料庫。一般概念請參閱[使用 Gemini API 進行函式呼叫](/docs/function-calling/)。

以下範例示範一個兩輪的互動。代理先要求呼叫自訂的 `get_weather` 函式，用戶端執行後，在第二輪回傳結果。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # 1. Define the custom function
      get_weather_tool = {
          "type": "function",
          "name": "get_weather",
          "description": "Gets the current weather for a given location.",
          "parameters": {
              "type": "object",
              "properties": {
                  "location": {
                      "type": "string",
                      "description": "The city and country, e.g. San Francisco, USA",
                  }
              },
              "required": ["location"],
          },
      }

      # 2. Call the agent with the custom tool (Turn 1)
      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="What is the weather in Tokyo?",
          environment="remote",
          tools=[
              {"type": "code_execution"},  # Enable default code execution
              get_weather_tool,            # Add custom function
          ],
      )

      # Check if the agent requested a function call
      if interaction.status == "requires_action":
          # Find function calls that do not have a matching function result.
          # Filesystem tools (like write_to_file) are also represented as function calls
          # but are executed automatically by the environment.
          executed_calls = {step.call_id for step in interaction.steps if step.type == "function_result"}
          pending_calls = [step for step in interaction.steps if step.type == "function_call" and step.id not in executed_calls]

          if pending_calls:
              fc_step = pending_calls[0]
              print(f"Function to call: {fc_step.name} (ID: {fc_step.id})")
              print(f"Arguments: {fc_step.arguments}")

              # 3. Execute the function locally (simulated get_weather()) and send the result back (Turn 2)
              function_result = {
                  "temperature": 23,
                  "unit": "celsius"
              }

              final_interaction = client.interactions.create(
                  agent="antigravity-preview-09-2026",
                  previous_interaction_id=interaction.id,  # Reference the interaction ID
                  environment=interaction.environment_id,
                  input=[
                      {
                          "type": "function_result",
                          "name": fc_step.name,
                          "call_id": fc_step.id,
                          "result": function_result,
                      }
                  ],
              )

              print(final_interaction.output_text)
              # Output: The current weather in Tokyo, Japan is 23°C (Celsius).
          else:
              print("No pending function calls.")
      else:
          print(f"Interaction completed with status: {interaction.status}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      // 1. Call the agent with the custom tool (Turn 1)
      const interaction = await client.interactions.create({
        agent: "antigravity-preview-09-2026",
        input: "What is the weather in Tokyo?",
        environment: "remote",
        tools: [
          { type: "code_execution" },
          {
            type: "function",
            name: "get_weather",
            description: "Gets the current weather for a given location.",
            parameters: {
              type: "object",
              properties: {
                location: {
                  type: "string",
                  description: "The city and country, e.g. San Francisco, USA",
                },
              },
              required: ["location"],
            },
          },
        ],
      }, { timeout: 300000 });

      if (interaction.status === "requires_action") {
        // Find function calls that do not have a matching function result.
        // Filesystem tools (like write_to_file) are also represented as function calls
        // but are executed automatically by the environment.
        const executedCalls = new Set(
          (interaction.steps || [])
            .filter(s => s.type === "function_result")
            .map(s => s.call_id)
        );
        const pendingCalls = (interaction.steps || []).filter(
          s => s.type === "function_call" && !executedCalls.has(s.id)
        );

        if (pendingCalls.length > 0) {
          const fcStep = pendingCalls[0];
          if (fcStep.type === "function_call") {
            console.log(`Function to call: ${fcStep.name} (ID: ${fcStep.id})`);

            // Execute the function locally (simulated get_weather()) and send the result back (Turn 2)
            const functionResult = {
              temperature: 23,
              unit: "celsius"
            };

            const finalInteraction = await client.interactions.create({
              agent: "antigravity-preview-09-2026",
              previous_interaction_id: interaction.id, // Reference the interaction ID
              environment: interaction.environment_id,
              input: [
                {
                  type: "function_result",
                  name: fcStep.name,
                  call_id: fcStep.id,
                  result: functionResult,
                }
              ],
            }, { timeout: 300000 });

            console.log(finalInteraction.output_text);
          }
        } else {
          console.log("No pending function calls.");
        }
      } else {
        console.log(`Interaction completed with status: ${interaction.status}`);
      }
      ```

=== "REST"

      ```shell
      # 1. Turn 1: Request function call
      RESPONSE=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
            "agent": "antigravity-preview-09-2026",
            "input": "What is the weather in Tokyo?",
            "environment": "remote",
            "tools": [
                {"type": "code_execution"},
                {
                    "type": "function",
                    "name": "get_weather",
                    "description": "Gets the current weather for a given location.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "location": {"type": "string"}
                        },
                        "required": ["location"]
                    }
                }
            ]
        }')

      # Extract interaction ID, environment ID, and call ID (requires jq)
      INTERACTION_ID=$(echo $RESPONSE | jq -r '.id')
      ENVIRONMENT_ID=$(echo $RESPONSE | jq -r '.environment_id')
      CALL_ID=$(echo $RESPONSE | jq -r '.steps[] | select(.type=="function_call") | .id')

      # 2. Turn 2: Send function result back using variables
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d "{
            \"agent\": \"antigravity-preview-09-2026\",
            \"previous_interaction_id\": \"$INTERACTION_ID\",
            \"environment\": \"$ENVIRONMENT_ID\",
            \"input\": [
                {
                    \"type\": \"function_result\",
                    \"name\": \"get_weather\",
                    \"call_id\": \"$CALL_ID\",
                    \"result\": {
                        \"temperature\": 23,
                        \"unit\": \"celsius\"
                    }
                }
            ]
        }"
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.CodeExecution;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.FunctionResultStep;
      import com.google.genai.gaos.models.interactions.FunctionResultStepResultUnion;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionStatus;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.List;
      import java.util.Map;
      import java.util.Set;
      import java.util.stream.Collectors;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      // 1. Define the custom function
      Function getWeatherTool = Function.builder()
          .name("get_weather")
          .description("Gets the current weather for a given location.")
          .parameters(Map.of(
              "type", "object",
              "properties", Map.of(
                  "location", Map.of(
                      "type", "string",
                      "description", "The city and country, e.g. San Francisco, USA"
                  )
              ),
              "required", List.of("location")
          ))
          .build();

      // 2. Call the agent with the custom tool (Turn 1)
      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("What is the weather in Tokyo?"))
          .environment(CreateAgentInteractionEnvironment.of("remote"))
          .tools(List.of(
              CodeExecution.builder().build(), // Enable default code execution
              getWeatherTool                   // Add custom function
          ))
          .build();

      Interaction interaction = client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      // Check if the agent requested a function call
      if (interaction.status().orElse(null) == InteractionStatus.REQUIRES_ACTION) {
          // Find function calls that do not have a matching function result.
          List<Step> steps = interaction.steps().orElse(List.of());
          Set<String> executedCalls = steps.stream()
              .filter(step -> step instanceof FunctionResultStep)
              .map(step -> ((FunctionResultStep) step).callId().orElse(""))
              .collect(Collectors.toSet());

          List<FunctionCallStep> pendingCalls = steps.stream()
              .filter(step -> step instanceof FunctionCallStep)
              .map(step -> (FunctionCallStep) step)
              .filter(fc -> !executedCalls.contains(fc.id().orElse("")))
              .collect(Collectors.toList());

          if (!pendingCalls.isEmpty()) {
              FunctionCallStep fcStep = pendingCalls.get(0);
              System.out.println("Function to call: " + fcStep.name().orElse("") + " (ID: " + fcStep.id().orElse("") + ")");
              System.out.println("Arguments: " + fcStep.arguments().orElse(Map.of()));

              // 3. Execute the function locally (simulated get_weather()) and send the result back (Turn 2)
              FunctionResultStep resultStep = FunctionResultStep.builder()
                  .name(fcStep.name().orElse(""))
                  .callId(fcStep.id().orElse(""))
                  .result(FunctionResultStepResultUnion.of("{\"temperature\": 23, \"unit\": \"celsius\"}"))
                  .build();

              CreateAgentInteraction followupParams = CreateAgentInteraction.builder()
                  .agent(AgentOption.of("antigravity-preview-09-2026"))
                  .previousInteractionId(interaction.id().orElse(""))
                  .environment(CreateAgentInteractionEnvironment.of(interaction.environmentId().orElse("")))
                  .input(InteractionsInput.ofStep(List.of(resultStep)))
                  .build();

              Interaction finalInteraction = client.interactions.create(CreateInteractionRequestBody.of(followupParams)).interaction().get();
              System.out.println(finalInteraction.outputText().orElse(""));
              // Output: The current weather in Tokyo, Japan is 23°C (Celsius).
          } else {
              System.out.println("No pending function calls.");
          }
      } else {
          System.out.println("Interaction completed with status: " + interaction.status().orElse(null));
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
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          // 1. Define the custom function
          getWeatherTool := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("get_weather"),
              Description: genai.Ptr("Gets the current weather for a given location."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "location": map[string]any{
                          "type":        "string",
                          "description": "The city and country, e.g. San Francisco, USA",
                      },
                  },
                  "required": []string{"location"},
              },
          })

          // 2. Call the agent with the custom tool (Turn 1)
          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("What is the weather in Tokyo?"),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment("remote")),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.CodeExecution{}), // Enable default code execution
                      getWeatherTool, // Add custom function
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          interaction := res.Interaction

          // Check if the agent requested a function call
          if interaction.Status == interactions.InteractionStatusRequiresAction {
              executedCalls := make(map[string]bool)
              for _, step := range interaction.Steps {
                  if fr := step.FunctionResultStep; fr != nil {
                      executedCalls[fr.CallID] = true
                  }
              }

              var pendingCalls []*interactions.FunctionCallStep
              for _, step := range interaction.Steps {
                  if fc := step.FunctionCallStep; fc != nil && !executedCalls[fc.ID] {
                      pendingCalls = append(pendingCalls, fc)
                  }
              }

              if len(pendingCalls) > 0 {
                  fcStep := pendingCalls[0]
                  fmt.Printf("Function to call: %s (ID: %s)\n", fcStep.Name, fcStep.ID)
                  fmt.Printf("Arguments: %v\n", fcStep.Arguments)

                  // 3. Execute the function locally (simulated get_weather()) and send the result back (Turn 2)
                  resultStep := interactions.FunctionResultStep{
                      Name:   genai.Ptr(fcStep.Name),
                      CallID: fcStep.ID,
                      Result: interactions.NewFunctionResultStepResultUnion(`{"temperature": 23, "unit": "celsius"}`),
                  }

                  followupRes, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                      Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                          Agent:                 interactions.AgentOption("antigravity-preview-09-2026"),
                          PreviousInteractionID: interaction.ID,
                          Environment:           genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(*interaction.EnvironmentID)),
                          Input: interactions.NewInteractionsInput([]interactions.Step{
                              interactions.NewStep(resultStep),
                          }),
                      }),
                  })
                  if err != nil {
                      log.Fatal(err)
                  }
                  if followupRes.Interaction.OutputText != nil {
                      fmt.Println(*followupRes.Interaction.OutputText)
                  }
              } else {
                  fmt.Println("No pending function calls.")
              }
          } else {
              fmt.Printf("Interaction completed with status: %s\n", interaction.Status)
          }
      }
      ```


## MCP 伺服器 {#mcp-servers}

您可以註冊遠端 Model Context Protocol（MCP）伺服器，將 Antigravity 代理連接到外部工具。代理支援透過可串流 HTTP 連線的遠端 MCP 伺服器。

註冊 MCP 伺服器時，必須在 `tools` 陣列中指定下列欄位：

| 欄位 | 類型 | 必填 | 說明 |
| :--- | :--- | :--- | :--- |
| `type` | string | 是 | 必須為 `"mcp_server"`。 |
| `name` | string | 是 | 伺服器的唯一識別碼。必須全為小寫英數字元（符合 `^[a-z0-9_-]+$`）。 |
| `url` | string | 是 | 遠端 MCP 伺服器的端點 URL。 |
| `headers` | object | 否 | 隨要求送出的自訂標頭（例如驗證用途）。 |
| `allowed_tools` | array | 否 | 允許執行的工具名稱清單。若省略，則允許所有工具。 |


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # Register a remote HTTP MCP server
      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="What is the weather in Tokyo?",
          environment="remote",
          tools=[{
              "type": "mcp_server",
              "name": "weather", # Must be lowercase
              "url": "https://gemini-api-demos.uc.r.appspot.com/mcp"
          }]
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "What is the weather in Tokyo?",
          environment: "remote",
          tools: [{
              type: "mcp_server",
              name: "weather", // Must be lowercase
              url: "https://gemini-api-demos.uc.r.appspot.com/mcp"
          }]
      }, { timeout: 300000 });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
            "agent": "antigravity-preview-09-2026",
            "input": "What is the weather in Tokyo?",
            "environment": "remote",
            "tools": [{
                "type": "mcp_server",
                "name": "weather",
                "url": "https://gemini-api-demos.uc.r.appspot.com/mcp"
            }]
        }'
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
      import com.google.genai.gaos.models.interactions.MCPServer;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.List;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      // Register a remote HTTP MCP server
      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("What is the weather in Tokyo?"))
          .environment(CreateAgentInteractionEnvironment.of("remote"))
          .tools(List.of(
              MCPServer.builder()
                  .name("weather") // Must be lowercase
                  .url("https://gemini-api-demos.uc.r.appspot.com/mcp")
                  .build()
          ))
          .build();

      Interaction interaction = client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
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

          // Register a remote HTTP MCP server
          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("What is the weather in Tokyo?"),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment("remote")),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.MCPServer{
                          Name: genai.Ptr("weather"), // Must be lowercase
                          URL:  genai.Ptr("https://gemini-api-demos.uc.r.appspot.com/mcp"),
                      }),
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


## 模型選擇 {#model-selection}

對於 `antigravity-preview-09-2026`，預設模型為 **Gemini 4 Hydrogen**（`gemini-4-hydrogen`）。若省略 `agent_config`，代理會預設使用 `gemini-4-hydrogen`。

您可以透過 `agent_config` 設定底層的 Gemini 模型，針對速度、成本或推理能力進行最佳化（比較 Hydrogen、Neon 與 Carbon 三者的取捨，請參閱[選擇模型](/docs/choosing-a-model/)）。例如，將 `model` 設為 **Gemini 4 Carbon**（`gemini-4-carbon`），處理複雜的軟體工程與推理任務：


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Summarize the key differences between functional and object-oriented programming.",
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

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Summarize the key differences between functional and object-oriented programming.",
          environment: "remote",
          agent_config: {
              type: "antigravity",
              model: "gemini-4-carbon",
          },
      }, { timeout: 300000 });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
            "agent": "antigravity-preview-09-2026",
            "input": "Summarize the key differences between functional and object-oriented programming.",
            "environment": "remote",
            "agent_config": {
                "type": "antigravity",
                "model": "gemini-4-carbon"
            }
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.AntigravityAgentConfig;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Summarize the key differences between functional and object-oriented programming."))
          .environment(CreateAgentInteractionEnvironment.of("remote"))
          .agentConfig(
              AntigravityAgentConfig.builder()
                  .model("gemini-4-carbon")
                  .build()
          )
          .build();

      Interaction interaction = client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
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
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Summarize the key differences between functional and object-oriented programming."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment("remote")),
                  AgentConfig: genai.Ptr(interactions.NewCreateAgentInteractionAgentConfig(interactions.AntigravityAgentConfig{
                      Model: genai.Ptr("gemini-4-carbon"),
                  })),
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


`agent_config.model` 支援的值如下：

| 模型 | `agent_config.model` 中的值 | 說明 |
| :--- | :--- | :--- |
| **Gemini 4 Hydrogen**（預設） | `gemini-4-hydrogen` | 預設的 Gemini 4 模型，兼具尖端智慧、速度與效率，適合日常程式設計與代理工作流程。 |
| **Gemini 4 Carbon** | `gemini-4-carbon` | 能力最強的前沿推理模型，適合複雜的軟體工程、深度問題求解與長時程代理任務。 |
| **Gemini 4 Argon** | `gemini-4-argon` | 高效率的 Gemini 4 前沿推理模型；在軟體工程與代理任務上，相較於 [Gemini 4 Carbon](/docs/whats-new-gemini-4-carbon/)，回應更快、每輪的 token 消耗更低。 |
| **Gemini 4 Neon** | `gemini-4-neon` | 前沿等級的智慧，端到端任務完成速度快，涵蓋複雜的軟體工程、知識工作與科學工作流程。 |
| **Gemini 3.8 Flash** | `gemini-3.8-flash` | 均衡的 Gemini 3.8 Flash 模型，適合推理、程式設計與工具使用。 |
| **Gemini 3.6 Flash** | `gemini-3.6-flash` | 均衡的 Flash 模型，適合一般代理工作流程。 |
| **Gemini 3.5 Flash-Lite** | `gemini-3.5-flash-lite` | 輕量模型，針對低延遲與成本敏感的任務最佳化。 |

使用 `agents.create` 建立受管代理時，設定模型的方式完全相同：傳入 `base_agent` 與 `agent_config` 即可。請注意，透過 `agents.create` 建立的受管代理，無法在互動時覆寫模型；模型會鎖定為建立代理當下設定的值。這能確保工具呼叫行為可預測、除錯結果一致，並嚴守安全邊界。

## 自訂代理 {#customizing-the-agent}

您可以自訂 Antigravity 代理的指令、工具與環境，藉此擴充其能力。代理支援以檔案系統為核心的自訂方式：您可以將 `AGENTS.md` 等指令檔案，以及 `.agents/skills/` 下的技能，直接掛載到沙箱中，或在互動時以行內方式傳入設定。您可以先以行內方式反覆調整設定，準備就緒後再將其儲存為受管代理。

建構自訂代理的完整說明，請參閱[建構受管代理](/docs/custom-agents/)。

## 背景執行 {#background-execution}

涉及多步驟推理、程式碼執行或檔案操作的代理任務，可能需要數分鐘才能完成。使用 `background=True` 即可非同步執行互動。API 會立即回傳一個互動 ID，您再輪詢該 ID，直到狀態變為 `completed` 或 `failed`。


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # 1. Start the interaction in the background
      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Run a complex analysis on the repository.",
          environment="remote",
          background=True,
      )

      print(f"Interaction started in background: {interaction.id}")

      # 2. Poll for completion
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

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Run a complex analysis on the repository.",
          environment: "remote",
          background: true,
      });

      console.log(`Interaction started in background: ${interaction.id}`);

      let result = interaction;
      while (result.status === "in_progress") {
          await new Promise(resolve => setTimeout(resolve, 5000));
          result = await client.interactions.get(interaction.id);
      }

      if (result.status === "completed") {
          console.log(result.output_text);
      } else {
          console.log(`Finished with status: ${result.status}`);
      }
      ```

=== "REST"

      ```shell
      # 1. Start the interaction in the background
      RESPONSE=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
            "agent": "antigravity-preview-09-2026",
            "input": "Run a complex analysis on the repository.",
            "environment": "remote",
            "background": true
        }')

      INTERACTION_ID=$(echo $RESPONSE | jq -r '.id')

      # 2. Poll for results (repeat until status is "completed")
      curl -s -X GET "https://generativelanguage.googleapis.com/v1beta/interactions/$INTERACTION_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionStatus;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.GetInteractionByIdRequest;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      // 1. Start the interaction in the background
      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Run a complex analysis on the repository."))
          .environment(CreateAgentInteractionEnvironment.of("remote"))
          .background(true)
          .build();

      Interaction interaction = client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      System.out.println("Interaction started in background: " + interaction.id().orElse(""));

      // 2. Poll for completion
      while (interaction.status().orElse(null) == InteractionStatus.IN_PROGRESS) {
          Thread.sleep(5000);
          interaction = client.interactions.get(new GetInteractionByIdRequest(interaction.id().orElse(""))).interaction().get();
      }

      if (interaction.status().orElse(null) == InteractionStatus.COMPLETED) {
          System.out.println(interaction.outputText().orElse(""));
      } else {
          System.out.println("Finished with status: " + interaction.status().orElse(null));
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

          // 1. Start the interaction in the background
          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Run a complex analysis on the repository."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment("remote")),
                  Background:  genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          interaction := res.Interaction
          fmt.Printf("Interaction started in background: %s\n", *interaction.ID)

          // 2. Poll for completion
          for interaction.Status == interactions.InteractionStatusInProgress {
              time.Sleep(5 * time.Second)
              getRes, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                  ID: *interaction.ID,
              })
              if err != nil {
                  log.Fatal(err)
              }
              interaction = getRes.Interaction
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


背景執行需要 `store=True`，而這正是預設值。背景執行期間的即時進度更新，請參閱[串流背景互動](/docs/background-execution/#streaming-pattern)。

您可以使用 `cancel` 方法取消執行中的背景互動。


=== "Python"

      ```python
      client.interactions.cancel(id="INTERACTION_ID")
      ```

=== "JavaScript"

      ```javascript
      await client.interactions.cancel("INTERACTION_ID");
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions/INTERACTION_ID:cancel" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
      client.interactions.cancel("INTERACTION_ID");
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
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          _, err = client.Interactions.Cancel(ctx, operations.CancelInteractionByIDRequest{
              ID: "INTERACTION_ID",
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```


**結合背景執行的多輪互動**

當背景互動涉及有狀態的工具（例如在沙箱中執行程式碼）時，請使用已完成互動的 `environment_id`，在同一個環境中繼續。這能確保代理從中斷處接續，所有檔案與狀態都完整保留。


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # First turn: run a task in the background
      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Clone https://github.com/google/generative-ai-python and run its tests.",
          environment="remote",
          background=True,
      )

      while interaction.status == "in_progress":
          time.sleep(5)
          interaction = client.interactions.get(id=interaction.id)

      # Second turn: continue in the same environment
      followup = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Fix any failing tests and re-run them.",
          previous_interaction_id=interaction.id,
          environment=interaction.environment_id,
          background=True,
      )

      while followup.status == "in_progress":
          time.sleep(5)
          followup = client.interactions.get(id=followup.id)

      print(followup.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      // First turn: run a task in the background
      let interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Clone https://github.com/google/generative-ai-python and run its tests.",
          environment: "remote",
          background: true,
      });

      while (interaction.status === "in_progress") {
          await new Promise(resolve => setTimeout(resolve, 5000));
          interaction = await client.interactions.get(interaction.id);
      }

      // Second turn: continue in the same environment
      let followup = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Fix any failing tests and re-run them.",
          previous_interaction_id: interaction.id,
          environment: interaction.environment_id,
          background: true,
      });

      while (followup.status === "in_progress") {
          await new Promise(resolve => setTimeout(resolve, 5000));
          followup = await client.interactions.get(followup.id);
      }

      console.log(followup.output_text);
      ```

=== "REST"

      ```shell
      # 1. Start first interaction in the background
      RESPONSE=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
            "agent": "antigravity-preview-09-2026",
            "input": "Clone https://github.com/google/generative-ai-python and run its tests.",
            "environment": "remote",
            "background": true
        }')

      INTERACTION_ID=$(echo $RESPONSE | jq -r '.id')

      # 2. Poll until completed (repeat until status is "completed")
      RESULT=$(curl -s -X GET "https://generativelanguage.googleapis.com/v1beta/interactions/$INTERACTION_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY")

      ENVIRONMENT_ID=$(echo $RESULT | jq -r '.environment_id')

      # 3. Continue in the same environment
      curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -d "{
            \"agent\": \"antigravity-preview-09-2026\",
            \"input\": \"Fix any failing tests and re-run them.\",
            \"previous_interaction_id\": \"$INTERACTION_ID\",
            \"environment\": \"$ENVIRONMENT_ID\",
            \"background\": true
        }"
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionStatus;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.GetInteractionByIdRequest;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      // First turn: run a task in the background
      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Clone https://github.com/google/generative-ai-python and run its tests."))
          .environment(CreateAgentInteractionEnvironment.of("remote"))
          .background(true)
          .build();

      Interaction interaction = client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      while (interaction.status().orElse(null) == InteractionStatus.IN_PROGRESS) {
          Thread.sleep(5000);
          interaction = client.interactions.get(new GetInteractionByIdRequest(interaction.id().orElse(""))).interaction().get();
      }

      // Second turn: continue in the same environment
      CreateAgentInteraction followupParams = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Fix any failing tests and re-run them."))
          .previousInteractionId(interaction.id().orElse(""))
          .environment(CreateAgentInteractionEnvironment.of(interaction.environmentId().orElse("")))
          .background(true)
          .build();

      Interaction followup = client.interactions.create(CreateInteractionRequestBody.of(followupParams)).interaction().get();

      while (followup.status().orElse(null) == InteractionStatus.IN_PROGRESS) {
          Thread.sleep(5000);
          followup = client.interactions.get(new GetInteractionByIdRequest(followup.id().orElse(""))).interaction().get();
      }

      System.out.println(followup.outputText().orElse(""));
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

          // First turn: run a task in the background
          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Clone https://github.com/google/generative-ai-python and run its tests."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment("remote")),
                  Background:  genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          interaction := res.Interaction
          for interaction.Status == interactions.InteractionStatusInProgress {
              time.Sleep(5 * time.Second)
              getRes, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                  ID: *interaction.ID,
              })
              if err != nil {
                  log.Fatal(err)
              }
              interaction = getRes.Interaction
          }

          // Second turn: continue in the same environment
          followupRes, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:                 interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:                 interactions.NewInteractionsInput("Fix any failing tests and re-run them."),
                  PreviousInteractionID: interaction.ID,
                  Environment:           genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(*interaction.EnvironmentID)),
                  Background:            genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          followup := followupRes.Interaction
          for followup.Status == interactions.InteractionStatusInProgress {
              time.Sleep(5 * time.Second)
              getRes, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                  ID: *followup.ID,
              })
              if err != nil {
                  log.Fatal(err)
              }
              followup = getRes.Interaction
          }

          if followup.OutputText != nil {
              fmt.Println(*followup.OutputText)
          }
      }
      ```


## 環境 {#environments}

每次呼叫都會建立或重複使用一個 Linux 沙箱。`environment` 參數有三種形式：

| 形式 | 說明 |
| :--- | :--- |
| `"remote"` | 以預設設定佈建一個全新的沙箱。 |
| `"env_abc123"` | 以 ID 重複使用既有環境，保留所有檔案與狀態。 |
| `{...}` | 完整的 `EnvironmentConfig`，含自訂來源與網路規則。 |

來源（Git、GCS、行內）、網路、生命週期與資源限制的詳細說明，請參閱[環境](/docs/agent-environment/)。

## 觸發器 {#triggers}

觸發器讓您能以 cron 排程讓代理自動執行。觸發器將代理、環境、提示詞與排程綁定為一個持久資源，無需人工介入即可觸發。每次執行都會重複使用同一個環境，因此某次執行建立的檔案會保留下來，供下一次執行使用。

### 建立觸發器

指定 cron 排程、時區與互動設定，即可建立觸發器。觸發器會以 `active` 狀態啟動，並在下一個符合的 cron 時間觸發。請保存回傳的 `id`，以便在後續呼叫中管理該觸發器。

由於觸發器會依排程無人值守地執行，請參照已儲存的[憑證](/docs/agent-credentials/)，而不是使用行內 token。出口 proxy 會在每次執行時解析該憑證，您輪替密鑰時也無需更動觸發器。行內 `transform` 規則同樣適用，只是值變更時必須一併更新觸發器。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      trigger = client.triggers.create(
          schedule="0 9 * * *",
          time_zone="America/Argentina/Buenos_Aires",
          display_name="issue-solver",
          interaction={
              "agent": "antigravity-preview-09-2026",
              "input": "Review open PRs in my-org/my-app for new comments and address feedback. Close issues whose PRs were merged. Then check for new issues labeled 'accepted', skip any already tracked in /workspace/solved-issues/, fix the rest, and open a PR for each. Save reports to /workspace/solved-issues/.",
              "environment": {
                  "type": "remote",
                  "network": {
                      "allowlist": [
                          {
                              "domain": "api.github.com",
                              "credential": "github-production",
                          },
                          {"domain": "github.com"},
                      ]
                  },
              },
          },
      )

      print(f"Trigger created: {trigger.id}")
      print(f"Next run: {trigger.next_run_time}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const trigger = await client.triggers.create({
          schedule: "0 9 * * *",
          time_zone: "America/Argentina/Buenos_Aires",
          display_name: "issue-solver",
          interaction: {
              agent: "antigravity-preview-09-2026",
              input: [{
                  type: "text",
                  text: "Review open PRs in my-org/my-app for new comments and address feedback. Close issues whose PRs were merged. Then check for new issues labeled 'accepted', skip any already tracked in /workspace/solved-issues/, fix the rest, and open a PR for each. Save reports to /workspace/solved-issues/.",
              }],
              environment: {
                  type: "remote",
                  network: {
                      allowlist: [
                          {
                              domain: "api.github.com",
                              credential: "github-production",
                          },
                          { domain: "github.com" },
                      ],
                  },
              },
          },
      });

      console.log(`Trigger created: ${trigger.id}`);
      console.log(`Next run: ${trigger.next_run_time}`);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/triggers" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
            "schedule": "0 9 * * *",
            "time_zone": "America/Argentina/Buenos_Aires",
            "display_name": "issue-solver",
            "interaction": {
                "agent": "antigravity-preview-09-2026",
                "input": [{"type": "text", "text": "Review open PRs in my-org/my-app for new comments and address feedback. Close issues whose PRs were merged. Then check for new issues labeled accepted, skip any already tracked in /workspace/solved-issues/, fix the rest, and open a PR for each. Save reports to /workspace/solved-issues/."}],
                "environment": {
                    "type": "remote",
                    "network": {
                        "allowlist": [
                            {
                                "domain": "api.github.com",
                                "credential": "github-production"
                            },
                            {"domain": "github.com"}
                        ]
                    }
                }
            }
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.gaos.GenAI;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.Allowlist;
      import com.google.genai.gaos.models.interactions.AllowlistEntry;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Environment;
      import com.google.genai.gaos.models.interactions.EnvironmentNetworkEgressAllowlist;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Network;
      import com.google.genai.gaos.models.interactions.Transform;
      import com.google.genai.gaos.models.shared.Security;
      import com.google.genai.gaos.models.triggers.Trigger;
      import com.google.genai.gaos.models.triggers.TriggerCreateParams;
      import java.util.List;
      import java.util.Map;

      GenAI client = GenAI.builder()
          .security(Security.builder().apiKey(System.getenv("GEMINI_API_KEY")).build())
          .build();

      Environment env = Environment.builder()
          .network(Network.of(
              EnvironmentNetworkEgressAllowlist.builder()
                  .allowlist(Allowlist.of(List.of(
                      AllowlistEntry.builder()
                          .domain("api.github.com")
                          .transform(Transform.of(Map.of(
                              "Authorization", "Bearer ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          )))
                          .build(),
                      AllowlistEntry.builder()
                          .domain("github.com")
                          .build()
                  )))
                  .build()
          ))
          .build();

      CreateAgentInteraction interactionTemplate = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Review open PRs in my-org/my-app for new comments and address feedback. Close issues whose PRs were merged. Then check for new issues labeled 'accepted', skip any already tracked in /workspace/solved-issues/, fix the rest, and open a PR for each. Save reports to /workspace/solved-issues/."))
          .environment(CreateAgentInteractionEnvironment.of(env))
          .build();

      TriggerCreateParams params = TriggerCreateParams.builder()
          .schedule("0 9 * * *")
          .timeZone("America/Argentina/Buenos_Aires")
          .displayName("issue-solver")
          .interaction(interactionTemplate)
          .build();

      Trigger trigger = client.triggers().create(params).trigger().get();
      System.out.println("Trigger created: " + trigger.id().orElse(""));
      System.out.println("Next run: " + trigger.nextRunTime().orElse(null));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "os"

          "google.golang.org/genai"
          interactionssdk "google.golang.org/genai/interactions"
          "google.golang.org/genai/interactions/models/components"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
          "google.golang.org/genai/interactions/models/triggers"
      )

      func main() {
          ctx := context.Background()
          sdk := interactionssdk.New(interactionssdk.WithSecurity(components.Security{
              APIKey: genai.Ptr(os.Getenv("GEMINI_API_KEY")),
          }))

          env := interactions.Environment{
              Network: genai.Ptr(interactions.NewNetwork(interactions.EnvironmentNetworkEgressAllowlist{
                  Allowlist: genai.Ptr(interactions.NewAllowlist([]interactions.AllowlistEntry{
                      {
                          Domain: "api.github.com",
                          Transform: genai.Ptr(interactions.NewTransform(map[string]string{
                              "Authorization": "Bearer ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                          })),
                      },
                      {
                          Domain: "github.com",
                      },
                  })),
              })),
          }

          interactionTemplate := interactions.CreateAgentInteraction{
              Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
              Input:       interactions.NewInteractionsInput("Review open PRs in my-org/my-app for new comments and address feedback. Close issues whose PRs were merged. Then check for new issues labeled 'accepted', skip any already tracked in /workspace/solved-issues/, fix the rest, and open a PR for each. Save reports to /workspace/solved-issues/."),
              Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(env)),
          }

          res, err := sdk.Triggers.Create(ctx, operations.CreateTriggerRequest{
              Body: triggers.TriggerCreateParams{
                  Schedule:    "0 9 * * *",
                  TimeZone:    "America/Argentina/Buenos_Aires",
                  DisplayName: genai.Ptr("issue-solver"),
                  Interaction: interactionTemplate,
              },
          })
          if err != nil {
              log.Fatal(err)
          }

          trigger := res.Trigger
          fmt.Printf("Trigger created: %s\n", trigger.ID)
          fmt.Printf("Next run: %v\n", trigger.NextRunTime)
      }
      ```


`CreateTrigger` 要求接受下列欄位：

| 欄位 | 類型 | 必填 | 說明 |
| :--- | :--- | :--- | :--- |
| `schedule` | string | 是 | Cron 表達式（例如每小時用 `0 * * * *`，平日上午用 `0 9 * * 1-5`）。 |
| `time_zone` | string | 是 | IANA 時區（例如 `UTC`、`America/Argentina/Buenos_Aires`）。 |
| `display_name` | string | 否 | 觸發器的易讀名稱。 |
| `max_consecutive_failures` | integer | 否 | 觸發器自動暫停前的最大失敗次數。預設值：5。 |
| `execution_timeout_seconds` | integer | 否 | 每次執行的逾時秒數。預設值：600。 |
| `interaction` | object | 是 | 定義代理、輸入、工具與環境的 `CreateInteractionRequest`。 |

回應包含下列關鍵欄位：

| 欄位 | 類型 | 說明 |
| :--- | :--- | :--- |
| `id` | string | 觸發器的唯一識別碼。後續所有操作都會用到。 |
| `status` | string | 目前狀態：`active`、`paused` 或 `disabled`。 |
| `next_run_time` | string | 下一次排定執行的 ISO 8601 時間戳記。 |
| `consecutive_failure_count` | integer | 自上次成功以來連續失敗的執行次數。 |

### 列出觸發器

取得與您的專案相關聯的所有觸發器。


=== "Python"

      ```python
      triggers = client.triggers.list()
      for trigger in triggers.triggers:
          print(f"{trigger.id}: {trigger.display_name} ({trigger.status})")
      ```

=== "JavaScript"

      ```javascript
      const triggers = await client.triggers.list();
      for (const trigger of triggers.triggers) {
          console.log(`${trigger.id}: ${trigger.display_name} (${trigger.status})`);
      }
      ```

=== "REST"

      ```shell
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/triggers" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Java"

      ```java
      import com.google.genai.gaos.GenAI;
      import com.google.genai.gaos.models.shared.Security;
      import com.google.genai.gaos.models.triggers.Trigger;
      import java.util.List;

      GenAI client = GenAI.builder()
          .security(Security.builder().apiKey(System.getenv("GEMINI_API_KEY")).build())
          .build();

      List<Trigger> triggers = client.triggers().listDirect().listTriggersResponse().get().triggers().orElse(List.of());
      for (Trigger trigger : triggers) {
          System.out.println(trigger.id().orElse("") + ": " + trigger.displayName().orElse("") + " (" + trigger.status().orElse(null) + ")");
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "os"

          "google.golang.org/genai"
          interactionssdk "google.golang.org/genai/interactions"
          "google.golang.org/genai/interactions/models/components"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          sdk := interactionssdk.New(interactionssdk.WithSecurity(components.Security{
              APIKey: genai.Ptr(os.Getenv("GEMINI_API_KEY")),
          }))

          res, err := sdk.Triggers.List(ctx, operations.ListTriggersRequest{})
          if err != nil {
              log.Fatal(err)
          }

          if res.ListTriggersResponse != nil {
              for _, trigger := range res.ListTriggersResponse.Triggers {
                  fmt.Printf("%s: %s (%v)\n", trigger.ID, *trigger.GetDisplayName(), trigger.Status)
              }
          }
      }
      ```


### 取得觸發器

擷取單一觸發器的完整設定與目前狀態。


=== "Python"

      ```python
      trigger = client.triggers.get(id="TRIGGER_ID")
      print(f"Schedule: {trigger.schedule}")
      print(f"Next run: {trigger.next_run_time}")
      ```

=== "JavaScript"

      ```javascript
      const trigger = await client.triggers.get("TRIGGER_ID");
      console.log(`Schedule: ${trigger.schedule}`);
      console.log(`Next run: ${trigger.next_run_time}`);
      ```

=== "REST"

      ```shell
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/triggers/TRIGGER_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Java"

      ```java
      import com.google.genai.gaos.GenAI;
      import com.google.genai.gaos.models.shared.Security;
      import com.google.genai.gaos.models.triggers.Trigger;

      GenAI client = GenAI.builder()
          .security(Security.builder().apiKey(System.getenv("GEMINI_API_KEY")).build())
          .build();

      Trigger trigger = client.triggers().get("TRIGGER_ID").trigger().get();
      System.out.println("Schedule: " + trigger.schedule().orElse(""));
      System.out.println("Next run: " + trigger.nextRunTime().orElse(null));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "os"

          "google.golang.org/genai"
          interactionssdk "google.golang.org/genai/interactions"
          "google.golang.org/genai/interactions/models/components"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          sdk := interactionssdk.New(interactionssdk.WithSecurity(components.Security{
              APIKey: genai.Ptr(os.Getenv("GEMINI_API_KEY")),
          }))

          res, err := sdk.Triggers.Get(ctx, operations.GetTriggerRequest{
              ID: "TRIGGER_ID",
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("Schedule: %s\n", res.Trigger.Schedule)
          fmt.Printf("Next run: %v\n", res.Trigger.NextRunTime)
      }
      ```


### 暫停與恢復

您可以暫停觸發器以停止排定的執行，也能恢復它以重新啟用排程。暫停不會影響手動執行。


=== "Python"

      ```python
      # Pause
      client.triggers.update(id="TRIGGER_ID", status="paused")

      # Resume
      client.triggers.update(id="TRIGGER_ID", status="active")
      ```

=== "JavaScript"

      ```javascript
      // Pause
      await client.triggers.update("TRIGGER_ID", { status: "paused" });

      // Resume
      await client.triggers.update("TRIGGER_ID", { status: "active" });
      ```

=== "REST"

      ```shell
      # Pause
      curl -X PATCH "https://generativelanguage.googleapis.com/v1beta/triggers/TRIGGER_ID" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{"status": "paused"}'

      # Resume
      curl -X PATCH "https://generativelanguage.googleapis.com/v1beta/triggers/TRIGGER_ID" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{"status": "active"}'
      ```

=== "Java"

      ```java
      import com.google.genai.gaos.GenAI;
      import com.google.genai.gaos.models.shared.Security;
      import com.google.genai.gaos.models.triggers.TriggerUpdate;
      import com.google.genai.gaos.models.triggers.TriggerUpdateStatus;

      GenAI client = GenAI.builder()
          .security(Security.builder().apiKey(System.getenv("GEMINI_API_KEY")).build())
          .build();

      // Pause
      client.triggers().update("TRIGGER_ID", TriggerUpdate.builder().status(TriggerUpdateStatus.PAUSED).build());

      // Resume
      client.triggers().update("TRIGGER_ID", TriggerUpdate.builder().status(TriggerUpdateStatus.ACTIVE).build());
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"
          "os"

          "google.golang.org/genai"
          interactionssdk "google.golang.org/genai/interactions"
          "google.golang.org/genai/interactions/models/components"
          "google.golang.org/genai/interactions/models/operations"
          "google.golang.org/genai/interactions/models/triggers"
      )

      func main() {
          ctx := context.Background()
          sdk := interactionssdk.New(interactionssdk.WithSecurity(components.Security{
              APIKey: genai.Ptr(os.Getenv("GEMINI_API_KEY")),
          }))

          // Pause
          _, err := sdk.Triggers.Update(ctx, operations.UpdateTriggerRequest{
              ID: "TRIGGER_ID",
              Body: triggers.TriggerUpdate{
                  Status: triggers.TriggerUpdateStatusPaused.ToPointer(),
              },
          })
          if err != nil {
              log.Fatal(err)
          }

          // Resume
          _, err = sdk.Triggers.Update(ctx, operations.UpdateTriggerRequest{
              ID: "TRIGGER_ID",
              Body: triggers.TriggerUpdate{
                  Status: triggers.TriggerUpdateStatusActive.ToPointer(),
              },
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```


### 刪除觸發器

永久移除觸發器。過去的執行紀錄不會被刪除。


=== "Python"

      ```python
      client.triggers.delete(id="TRIGGER_ID")
      ```

=== "JavaScript"

      ```javascript
      await client.triggers.delete("TRIGGER_ID");
      ```

=== "REST"

      ```shell
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/triggers/TRIGGER_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Java"

      ```java
      import com.google.genai.gaos.GenAI;
      import com.google.genai.gaos.models.shared.Security;

      GenAI client = GenAI.builder()
          .security(Security.builder().apiKey(System.getenv("GEMINI_API_KEY")).build())
          .build();

      client.triggers().delete("TRIGGER_ID");
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"
          "os"

          "google.golang.org/genai"
          interactionssdk "google.golang.org/genai/interactions"
          "google.golang.org/genai/interactions/models/components"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          sdk := interactionssdk.New(interactionssdk.WithSecurity(components.Security{
              APIKey: genai.Ptr(os.Getenv("GEMINI_API_KEY")),
          }))

          _, err := sdk.Triggers.Delete(ctx, operations.DeleteTriggerRequest{
              ID: "TRIGGER_ID",
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```


### 立即執行觸發器

依需求立即觸發觸發器，無需等到下一個排定時間。即使觸發器處於暫停狀態，也能這樣執行。


=== "Python"

      ```python
      client.triggers.run(trigger_id="TRIGGER_ID")
      ```

=== "JavaScript"

      ```javascript
      await client.triggers.run("TRIGGER_ID");
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/triggers/TRIGGER_ID/executions" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Java"

      ```java
      import com.google.genai.gaos.GenAI;
      import com.google.genai.gaos.models.shared.Security;

      GenAI client = GenAI.builder()
          .security(Security.builder().apiKey(System.getenv("GEMINI_API_KEY")).build())
          .build();

      client.triggers().run("TRIGGER_ID");
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"
          "os"

          "google.golang.org/genai"
          interactionssdk "google.golang.org/genai/interactions"
          "google.golang.org/genai/interactions/models/components"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          sdk := interactionssdk.New(interactionssdk.WithSecurity(components.Security{
              APIKey: genai.Ptr(os.Getenv("GEMINI_API_KEY")),
          }))

          _, err := sdk.Triggers.Run(ctx, operations.RunTriggerRequest{
              TriggerID: "TRIGGER_ID",
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```


### 列出執行紀錄

查看觸發器的執行紀錄。每次執行都包含 `status`、時間戳記，以及可用來擷取完整互動輸出的 `interaction_id`；另有 `environment_id`，確認所有執行共用同一個沙箱。


=== "Python"

      ```python
      executions = client.triggers.list_executions(trigger_id="TRIGGER_ID")
      for ex in executions.trigger_executions:
          print(f"{ex.id}: {ex.status} ({ex.start_time} - {ex.end_time})")

      # Fetch the full interaction for an execution
      interaction = client.interactions.get(id=ex.interaction_id)
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      const executions = await client.triggers.listExecutions("TRIGGER_ID");
      for (const ex of executions.trigger_executions) {
          console.log(`${ex.id}: ${ex.status} (${ex.start_time} - ${ex.end_time})`);
      }

      // Fetch the full interaction for an execution
      const interaction = await client.interactions.get(ex.interaction_id);
      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/triggers/TRIGGER_ID/executions" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Java"

      ```java
      import com.google.genai.gaos.GenAI;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.operations.GetInteractionByIdRequest;
      import com.google.genai.gaos.models.shared.Security;
      import com.google.genai.gaos.models.triggers.TriggerExecution;
      import java.util.List;

      GenAI client = GenAI.builder()
          .security(Security.builder().apiKey(System.getenv("GEMINI_API_KEY")).build())
          .build();

      List<TriggerExecution> executions = client.triggers().listExecutions("TRIGGER_ID")
          .listTriggerExecutionsResponse().get()
          .triggerExecutions().orElse(List.of());

      for (TriggerExecution ex : executions) {
          System.out.println(ex.id().orElse("") + ": " + ex.status().orElse(null)
              + " (" + ex.startTime().orElse(null) + " - " + ex.endTime().orElse(null) + ")");

          // Fetch the full interaction for an execution
          if (ex.interactionId().isPresent()) {
              Interaction interaction = client.interactions().get(new GetInteractionByIdRequest(ex.interactionId().get())).interaction().get();
              System.out.println(interaction.outputText().orElse(""));
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
          "os"

          "google.golang.org/genai"
          interactionssdk "google.golang.org/genai/interactions"
          "google.golang.org/genai/interactions/models/components"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          sdk := interactionssdk.New(interactionssdk.WithSecurity(components.Security{
              APIKey: genai.Ptr(os.Getenv("GEMINI_API_KEY")),
          }))

          res, err := sdk.Triggers.ListExecutions(ctx, operations.ListTriggerExecutionsRequest{
              TriggerID: "TRIGGER_ID",
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.ListTriggerExecutionsResponse != nil {
              for _, ex := range res.ListTriggerExecutionsResponse.TriggerExecutions {
                  fmt.Printf("%s: %v (%v - %v)\n", ex.ID, ex.Status, ex.StartTime, ex.EndTime)

                  // Fetch the full interaction for an execution
                  if ex.InteractionID != nil {
                      intRes, err := sdk.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                          ID: *ex.InteractionID,
                      })
                      if err != nil {
                          log.Fatal(err)
                      }
                      if intRes.Interaction.OutputText != nil {
                          fmt.Println(*intRes.Interaction.OutputText)
                      }
                  }
              }
          }
      }
      ```


## 可用性與定價 {#availability-and-pricing}

Antigravity 代理目前為預覽版，可透過 Google AI Studio 中的
[Interactions API](/docs/interactions-overview/) 與 Gemini API 使用，
免費層級與付費層級的專案皆可使用。

定價採用[按量付費模式](/docs/pricing/#pricing-for-agents)，
依底層 Gemini 模型的 token 與代理使用的工具計費。與只產生單一輸出的
一般聊天要求不同，Antigravity 互動是一種代理工作流程：單次要求就會觸發
推理、工具執行、程式碼執行與檔案管理的自主循環。免費層級專案包含免費的
速率限制與使用配額。

Antigravity 互動會執行多輪自主循環，可能消耗大量 token。請在要求中設定
[預算控制](/docs/antigravity-agent/#budget-controls)以限制 token 用量。您也可以透過
[SSE 串流](/docs/streaming/)即時監看進度，或取消執行中的要求。

### 預算控制 {#budget-controls}

除了[模型選擇](/docs/antigravity-agent/#model-selection)之外，您還可以設定 `max_total_tokens`，將其放在 `agent_config` 中（並搭配 `"type": "antigravity"`），
限制單次互動可消耗的 token 總數（輸入 + 輸出 + 思考）。
快取的 token 不計入此上限。代理達到上限時，
互動會停止，並以 `status: "incomplete"` 回傳。此上限為盡力而為：
實際用量可能略微超過，視代理在步驟之間檢查預算的時機而定。

在互動要求中，於 `agent_config` 裡設定預算，位置與 `agent`、`input` 並列。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Analyze the dataset in /workspace/data.csv and generate a summary report.",
          agent_config={
              "type": "antigravity",
              "max_total_tokens": 50000
          },
          environment={
              "type": "remote",
              "sources": [
                  {
                      "type": "inline",
                      "target": "/workspace/data.csv",
                      "content": "id,name,value\n1,alpha,100\n2,beta,200\n",
                  }
              ],
          }
      )
      print(f"Status: {interaction.status}")  # "incomplete" if budget was hit
      print(f"Tokens used: {interaction.usage.total_tokens}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Analyze the dataset in /workspace/data.csv and generate a summary report.",
          agent_config: {
              type: "antigravity",
              max_total_tokens: "50000"
          },
          environment: {
              type: "remote",
              sources: [
                  {
                      type: "inline",
                      target: "/workspace/data.csv",
                      content: "id,name,value\n1,alpha,100\n2,beta,200\n",
                  },
              ],
          },
      });
      console.log(`Status: ${interaction.status}`);
      console.log(`Tokens used: ${interaction.usage?.total_tokens}`);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Analyze the dataset in /workspace/data.csv and generate a summary report.",
          "agent_config": {
            "type": "antigravity",
            "max_total_tokens": 50000
          },
          "environment": {
            "type": "remote",
            "sources": [
              {
                "type": "inline",
                "target": "/workspace/data.csv",
                "content": "id,name,value\n1,alpha,100\n2,beta,200\n"
              }
            ]
          }
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.AntigravityAgentConfig;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Environment;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Source;
      import com.google.genai.gaos.models.interactions.SourceType;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.List;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      Environment env = Environment.builder()
          .sources(List.of(
              Source.builder()
                  .type(SourceType.INLINE)
                  .target("/workspace/data.csv")
                  .content("id,name,value\n1,alpha,100\n2,beta,200\n")
                  .build()
          ))
          .build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Analyze the dataset in /workspace/data.csv and generate a summary report."))
          .agentConfig(
              AntigravityAgentConfig.builder()
                  .maxTotalTokens("50000")
                  .build()
          )
          .environment(CreateAgentInteractionEnvironment.of(env))
          .build();

      Interaction interaction = client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      System.out.println("Status: " + interaction.status().orElse(null)); // "incomplete" if budget was hit
      interaction.usage().ifPresent(usage -> System.out.println("Tokens used: " + usage.totalTokens().orElse(0)));
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

          env := interactions.Environment{
              Sources: []interactions.Source{
                  {
                      Type:    interactions.SourceTypeInline.ToPointer(),
                      Target:  genai.Ptr("/workspace/data.csv"),
                      Content: genai.Ptr("id,name,value\n1,alpha,100\n2,beta,200\n"),
                  },
              },
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent: interactions.AgentOption("antigravity-preview-09-2026"),
                  Input: interactions.NewInteractionsInput("Analyze the dataset in /workspace/data.csv and generate a summary report."),
                  AgentConfig: genai.Ptr(interactions.NewCreateAgentInteractionAgentConfig(interactions.AntigravityAgentConfig{
                      MaxTotalTokens: genai.Ptr(int64(50000)),
                  })),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(env)),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          interaction := res.Interaction
          fmt.Printf("Status: %s\n", interaction.Status) // "incomplete" if budget was hit
          if interaction.Usage != nil && interaction.Usage.TotalTokens != nil {
              fmt.Printf("Tokens used: %d\n", *interaction.Usage.TotalTokens)
          }
      }
      ```


#### 繼續未完成的互動 {#continuing-incomplete-interaction}

當互動回傳 `status: "incomplete"` 時，代理的工作成果與上下文
都會保留。只要送出一個參照原始互動 `id` 與
`environment_id` 的新互動，就能從中斷處接續。新互動會有自己的
`max_total_tokens` 預算。


=== "Python"

      ```python
      # Continue from where the agent stopped
      continuation = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="continue",
          previous_interaction_id=interaction.id,
          environment=interaction.environment_id,
          agent_config={
              "type": "antigravity",
              "max_total_tokens": 50000
          }
      )
      print(f"Status: {continuation.status}")
      ```

=== "JavaScript"

      ```javascript
      const continuation = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "continue",
          previous_interaction_id: interaction.id,
          environment: interaction.environment_id,
          agent_config: {
              type: "antigravity",
              max_total_tokens: "50000"
          }
      });
      console.log(`Status: ${continuation.status}`);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "continue",
          "previous_interaction_id": "INTERACTION_ID",
          "environment": "ENVIRONMENT_ID",
          "agent_config": {
            "type": "antigravity",
            "max_total_tokens": 50000
          }
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.AntigravityAgentConfig;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
      String interactionId = "INTERACTION_ID";
      String environmentId = "ENVIRONMENT_ID";

      // Continue from where the agent stopped
      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("continue"))
          .previousInteractionId(interactionId)
          .environment(CreateAgentInteractionEnvironment.of(environmentId))
          .agentConfig(
              AntigravityAgentConfig.builder()
                  .maxTotalTokens("50000")
                  .build()
          )
          .build();

      Interaction continuation = client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      System.out.println("Status: " + continuation.status().orElse(null));
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

          interactionID := "INTERACTION_ID"
          environmentID := "ENVIRONMENT_ID"

          // Continue from where the agent stopped
          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:                 interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:                 interactions.NewInteractionsInput("continue"),
                  PreviousInteractionID: genai.Ptr(interactionID),
                  Environment:           genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(environmentID)),
                  AgentConfig: genai.Ptr(interactions.NewCreateAgentInteractionAgentConfig(interactions.AntigravityAgentConfig{
                      MaxTotalTokens: genai.Ptr(int64(50000)),
                  })),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("Status: %s\n", res.Interaction.Status)
      }
      ```


### 預估成本

成本依任務複雜度而異。代理會自主決定需要多少次工具呼叫、程式碼執行與檔案操作。以下估計值是根據實際執行結果得出。

| 任務類別 | 輸入 tokens | 輸出 tokens | 典型成本 |
| :--- | :--- | :--- | :--- |
| **研究與資訊綜整** | 100k–500k | 10k–40k | $0.30–$1.00 |
| **文件與內容生成** | 100k–500k | 15k–50k | $0.30–$1.30 |
| **流程與系統設計** | 100k–400k | 10k–30k | $0.25–$0.80 |
| **資料處理與分析** | 300k–3M | 30k–150k | $0.70–$3.25 |

輸入 tokens 通常有 50–70% 來自快取。工具呼叫次數眾多的複雜代理工作流程，單次互動可能累積 300 萬到 500 萬 tokens，成本最高約 \~$5。

**環境運算**（CPU、記憶體、沙箱執行）在預覽期間**不計費**。

## 限制 {#limitations}

- **預覽狀態**：Antigravity 代理與 Interactions API。功能與結構定義可能變更。
- **不支援的生成設定**：下列參數不受支援，使用時會回傳 400 錯誤：`temperature`、`top_p`、`top_k`、`stop_sequences`、`max_output_tokens`。
- **結構化輸出**：Antigravity 代理不支援結構化輸出。
- **尚不可用的工具**：`file_search`、`computer_use` 與 `google_maps` 尚未支援。
- **遠端 MCP 限制**：不支援 Server-Sent Events（SSE）傳輸方式（請改用 Streamable HTTP）。此外，伺服器的 `name` 必須全為小寫英數字元（使用大寫字母會觸發一般的 `400 Bad Request` 錯誤）。
- **檔案系統工具**：目前沒有獨立的檔案系統工具，它屬於 `environment` 的一部分。
- **Store 要求**：使用 `background=True` 執行代理時，必須同時設定 `store=True`。
- **函式呼叫僅限有狀態模式**：函式呼叫僅支援有狀態模式。您必須使用 `previous_interaction_id` 延續該輪互動；不支援手動重建歷史紀錄（無狀態模式）。
- **不支援的多模態類型**：目前不支援音訊、影片與文件輸入，僅允許文字與圖片。

## 後續步驟 {#whats-next}

- [快速入門](/docs/managed-agents-quickstart/)：多輪對話與串流。
- [建構自訂代理](/docs/custom-agents/)：自訂指令、技能與儲存代理。
- [環境](/docs/agent-environment/)：沙箱設定、來源、網路。
- [Hooks](/docs/agent-hooks/)：在沙箱內強制執行安全關卡與副作用驗證。
- [Deep Research 代理](/docs/deep-research/)：長篇研究任務。
- [Interactions API](/docs/interactions-overview/)：底層 API。

