# 建立代理


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/`.


`POST` `https://generativelanguage.googleapis.com/v1beta/agents`

建立新的代理（SDK 的具型別版本）。


  
## 參數 {#parameters}

  
  **parent**: required `string`

  建立此代理的父資源。格式： `projects/{project}/locations/{location}`

  

## 請求主體 {#request-body}

  
  **id**: `string`

  代理的唯一識別碼。

  

---


  **base_agent**: `string`

  要擴充的基礎代理。

  

---


  **system_instruction**: `string`

  代理的系統指令。

  

---


  **description**: `string`

  供開發人員快速閱讀與理解的代理說明。

  

---


  

??? note "**agent_config**: `AntigravityAgentConfig` 代理的設定參數。"

    **type**: required `object`

    值： `antigravity`

    **model**: `string`

    代理推理所使用的模型。

    **max_total_tokens**: `string`

    代理執行期間的 token 總數上限。



  

---


  

??? note "**base_environment**: `EnvironmentConfig` or `string` 代理的環境設定。"

      **可能的類型：** 



    ??? note "**EnvironmentConfig**"

          自訂環境的設定。

          **type**: required `object`

          值： `remote`



        ??? note "**sources**: `Source array`"

            ??? note "**type**: `string enum`"

                可能的值：

                - `gcs`: Cloud Storage 值區。
                - `inline`: 行內內容。
                - `repository`: 一般儲存庫。來源 URL 中的通訊協定前置字元可識別提供者（例如 github://、gcs://）。



              **source**: `string`

              環境的來源。對於 Cloud Storage，這是 Cloud Storage 路徑；對於 GitHub，這是 GitHub 路徑。

              **target**: `string`

              來源在環境中應出現的位置。

              **content**: `string`

              當 `type` 為 `INLINE` 時的行內內容。

              **encoding**: `string`

              行內內容的選用編碼（例如 `base64`）。





        ??? note "**network**: `EnvironmentNetworkEgressAllowlist` or `string enum` 環境的網路設定。"

              **可能的類型：** 



            ??? note "**EnvironmentNetworkEgressAllowlist**"

                  環境的網路輸出設定。



                ??? note "**allowlist**: `EgressRule array` or `string enum` 允許的網域及其設定清單。設為 `"disabled"` 即可封鎖所有網路輸出。"

                      **可能的類型：** 



                    ??? note "**EgressRule array**"

                        單一網域允許清單規則，可選擇性注入標頭。

                        **domain**: required `string`

                        允許送出請求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

                        **transform**: `object`

                        要注入至符合此規則之請求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

                        **credential**: `string`

                        選用。透過 ID 參照由伺服器管理的 Credential 資源。





                    ??? note "**string enum**"

                        可能的值：

                        - `disabled`: 所有網路輸出皆被封鎖。





            ??? note "**string enum**"

                可能的值：

                - `disabled`: 所有網路輸出皆被封鎖。



          **environment_id**: `string`

          選用。互動的環境 ID。若有指定，請求將更新現有環境，而非建立新環境。



        ??? note "**env**: `object` or `string` 要在沙箱環境中設定的環境變數。"

              **可能的類型：** 



            ??? note "**string**"

                直接的字串值。





        ??? note "**mode**: `string enum` 此環境的運算生命週期模式。"

            可能的值：

            - `on_demand`: 此環境的運算生命週期模式。
            - `self_hosted`: 此環境的運算生命週期模式。



          **custom_config**: `object`

          選用。傳遞至自行託管環境輪詢器的任意客戶自訂 JSON 設定。僅在 `mode` 為 `SELF_HOSTED` 時支援。





    ??? note "**string**"

        直接的字串值。



  

---


  

??? note "**tools**: `AgentTool array` 代理可使用的工具。"

      **可能的類型：** 



    ??? note "**CodeExecution**"

        模型可用來執行程式碼的工具。

        **type**: required `object`

        值： `code_execution`





    ??? note "**Function**"

        模型可使用的工具。

        **type**: required `object`

        值： `function`

        **name**: `string`

        函式的名稱。

        **description**: `string`

        函式的說明。

        **parameters**: `object`

        函式參數的 JSON Schema。支援 JSON Schema 的子集。 `minLength`, `maxLength`, `minProperties`, `maxProperties`, `uniqueItems`, `contains`, `minContains`, and `maxContains` 會被忽略且不強制執行。

        **defer_loading**: `boolean`

        若為 true，系統會延遲載入此函式。

        **short_description**: `string`

        函式的簡短描述；對於設定了 `defer_loading` 的函式，模型會看到這段摘要。





    ??? note "**GoogleSearch**"

          模型可用來搜尋 Google 的工具。

          **type**: required `object`

          值： `google_search`



        ??? note "**search_types**: `string enum array` 要啟用的搜尋接地類型。"

            可能的值：

            - `web_search`: 設定此欄位可啟用網路搜尋。僅傳回文字結果。
            - `image_search`: 設定此欄位可啟用圖片搜尋。傳回圖片位元組。





    ??? note "**McpServer**"

          MCPServer 是模型可呼叫以執行動作的伺服器。

          **type**: required `object`

          值： `mcp_server`

          **name**: `string`

          MCPServer 的名稱。

          **url**: `string`

          MCPServer 端點的完整 URL。範例： "https://api.example.com/mcp"

          **headers**: `object`

          選用：視需要提供驗證標頭、逾時等欄位。



        ??? note "**allowed_tools**: `AllowedTools array` 允許的工具。"

            ??? note "**mode**: `string enum` 工具選擇的模式。"

                可能的值：

                - `auto`: 自動選擇工具。
                - `any`: 任一工具選擇。
                - `none`: 不選擇工具。
                - `validated`: 經驗證的工具選擇。



              **tools**: `string array`

              允許的工具名稱。

              **defer_loading**: `boolean`

              若為 true，系統會延遲載入此 MCP 伺服器上的工具。





    ??? note "**UrlContext**"

        模型可用來取得 URL 內容脈絡的工具。

        **type**: required `object`

        值： `url_context`



  

  

  
  **請求範例** 

  

=== "建立代理"


    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/agents \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "id": "research-assistant-abc123",
              "base_agent": "antigravity-preview-09-2026",
              "description": "A helpful research assistant.",
              "system_instruction": "You are a helpful research assistant.",
              "base_environment": "remote",
              "tools": [{"type": "google_search"}]
            }'
          ```

    === "Python"

          ```python
          import uuid
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})
          agent = client.agents.create(
              id=f"research-assistant-{uuid.uuid4().hex[:8]}",
              base_agent="antigravity-preview-09-2026",
              description="A helpful research assistant.",
              system_instruction="You are a helpful research assistant.",
              base_environment="remote",
              tools=[{"type": "google_search"}],
          )
          print(agent.id)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});
          const agentId = `research-assistant-${crypto.randomUUID().slice(0, 8)}`;
          const agent = await ai.agents.create({
            id: agentId,
            base_agent: 'antigravity-preview-09-2026',
            description: 'A helpful research assistant.',
            system_instruction: 'You are a helpful research assistant.',
            base_environment: 'remote',
            tools: [{type: 'google_search'}],
          });
          if (!agent.id) {
            throw new Error('Agent creation failed: ID is undefined');
          }
          console.log(agent.id);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.agents.Agent;
          import com.google.genai.gaos.models.agents.BaseEnvironment;
          import com.google.genai.gaos.models.interactions.GoogleSearch;
          import com.google.genai.gaos.models.operations.CreateAgentResponse;
          import com.google.genai.types.HttpOptions;
          import java.util.List;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
          String agentId = "research-assistant-" + UUID.randomUUID().toString().substring(0, 8);
          Agent agent =
              Agent.builder()
                  .id(agentId)
                  .baseAgent("antigravity-preview-09-2026")
                  .description("A helpful research assistant.")
                  .systemInstruction("You are a helpful research assistant.")
                  .baseEnvironment(BaseEnvironment.of("remote"))
                  .tools(List.of(new GoogleSearch()))
                  .build();
          CreateAgentResponse response = client.agents.create(agent);
          System.out.println(response.agent().flatMap(Agent::id).orElse(""));
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
              gaos_agents "google.golang.org/genai/interactions/models/agents"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, &genai.ClientConfig{
                  HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
              })
              if err != nil {
                  log.Fatal(err)
              }

              agentID := fmt.Sprintf("research-assistant-%d", time.Now().UnixNano())
              req := operations.CreateAgentRequest{
                  Body: gaos_agents.Agent{
                      ID:                genai.Ptr(agentID),
                      BaseAgent:         genai.Ptr("antigravity-preview-09-2026"),
                      Description:       genai.Ptr("A helpful research assistant."),
                      SystemInstruction: genai.Ptr("You are a helpful research assistant."),
                      BaseEnvironment:   genai.Ptr(gaos_agents.NewBaseEnvironment("remote")),
                      Tools: []gaos_agents.AgentTool{
                          gaos_agents.NewAgentTool(gaos_interactions.GoogleSearch{}),
                      },
                  },
              }

              res, err := client.Agents.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.Agent != nil && res.Agent.ID != nil {
                  fmt.Println(*res.Agent.ID)
              }
          }
          ```

=== "含有來源的代理"


    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/agents \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "id": "data-analyst-abc123",
              "base_agent": "antigravity-preview-09-2026",
              "system_instruction": "You are a data analyst. Always include visualizations and export results as PDF.",
              "base_environment": {
                "type": "remote",
                "sources": [
                  {
                    "type": "inline",
                    "target": ".agents/AGENTS.md",
                    "content": "Always use matplotlib for charts. Include a summary table in every report."
                  },
                  {
                    "type": "repository",
                    "source": "https://github.com/my-org/analysis-templates",
                    "target": "/workspace/templates"
                  }
                ]
              }
            }'
          ```

    === "Python"

          ```python
          import uuid
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})
          agent = client.agents.create(
              id=f"data-analyst-{uuid.uuid4().hex[:8]}",
              base_agent="antigravity-preview-09-2026",
              system_instruction=(
                  "You are a data analyst. Always include visualizations and export"
                  " results as PDF."
              ),
              base_environment={
                  "type": "remote",
                  "sources": [
                      {
                          "type": "inline",
                          "target": ".agents/AGENTS.md",
                          "content": (
                              "Always use matplotlib for charts. Include a summary"
                              " table in every report."
                          ),
                      },
                      {
                          "type": "repository",
                          "source": "https://github.com/my-org/analysis-templates",
                          "target": "/workspace/templates",
                      },
                  ],
              },
          )
          print(f"Created agent: {agent.id}")
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});
          const agentId = `data-analyst-${crypto.randomUUID().slice(0, 8)}`;
          const agent = await ai.agents.create({
            id: agentId,
            base_agent: 'antigravity-preview-09-2026',
            system_instruction:
              'You are a data analyst. Always include visualizations and export results as PDF.',
            base_environment: {
              type: 'remote',
              sources: [
                {
                  type: 'inline',
                  target: '.agents/AGENTS.md',
                  content:
                    'Always use matplotlib for charts. Include a summary table in every report.',
                },
                {
                  type: 'repository',
                  source: 'https://github.com/my-org/analysis-templates',
                  target: '/workspace/templates',
                },
              ],
            },
          });
          console.log(`Created agent: ${agent.id}`);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.agents.Agent;
          import com.google.genai.gaos.models.agents.BaseEnvironment;
          import com.google.genai.gaos.models.environments.Environment;
          import com.google.genai.gaos.models.interactions.Source;
          import com.google.genai.gaos.models.interactions.SourceType;
          import com.google.genai.gaos.models.operations.CreateAgentResponse;
          import com.google.genai.types.HttpOptions;
          import java.util.List;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
          String agentId = "data-analyst-" + UUID.randomUUID().toString().substring(0, 8);
          com.google.genai.gaos.models.interactions.Environment env =
              com.google.genai.gaos.models.interactions.Environment.builder()
                  .sources(
                      List.of(
                          Source.builder()
                              .type(SourceType.INLINE)
                              .target(".agents/AGENTS.md")
                              .content(
                                  "Always use matplotlib for charts. Include a summary table in every"
                                      + " report.")
                              .build(),
                          Source.builder()
                              .type(SourceType.REPOSITORY)
                              .source("https://github.com/my-org/analysis-templates")
                              .target("/workspace/templates")
                              .build()))
                  .build();
          Agent agent =
              Agent.builder()
                  .id(agentId)
                  .baseAgent("antigravity-preview-09-2026")
                  .systemInstruction(
                      "You are a data analyst. Always include visualizations and export results as PDF.")
                  .baseEnvironment(BaseEnvironment.of(env))
                  .build();
          CreateAgentResponse response = client.agents.create(agent);
          System.out.println("Created agent: " + response.agent().flatMap(Agent::id).orElse(""));
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
              gaos_agents "google.golang.org/genai/interactions/models/agents"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, &genai.ClientConfig{
                  HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
              })
              if err != nil {
                  log.Fatal(err)
              }

              agentID := fmt.Sprintf("data-analyst-%d", time.Now().UnixNano())
              env := gaos_interactions.Environment{
                  Sources: []gaos_interactions.Source{
                      {
                          Type:    genai.Ptr(gaos_interactions.SourceTypeInline),
                          Target:  genai.Ptr(".agents/AGENTS.md"),
                          Content: genai.Ptr("Always use matplotlib for charts. Include a summary table in every report."),
                      },
                      {
                          Type:   genai.Ptr(gaos_interactions.SourceTypeRepository),
                          Source: genai.Ptr("https://github.com/my-org/analysis-templates"),
                          Target: genai.Ptr("/workspace/templates"),
                      },
                  },
              }

              req := operations.CreateAgentRequest{
                  Body: gaos_agents.Agent{
                      ID:                genai.Ptr(agentID),
                      BaseAgent:         genai.Ptr("antigravity-preview-09-2026"),
                      SystemInstruction: genai.Ptr("You are a data analyst. Always include visualizations and export results as PDF."),
                      BaseEnvironment:   genai.Ptr(gaos_agents.NewBaseEnvironment(env)),
                  },
              }

              res, err := client.Agents.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.Agent != nil && res.Agent.ID != nil {
                  fmt.Printf("Created agent: %s\n", *res.Agent.ID)
              }
          }
          ```

=== "從環境分叉的代理"


    === "REST"

          ```sh
          # Step 1: Set up the environment interactively
          RESPONSE=$(curl -s -X POST https://generativelanguage.googleapis.com/v1beta/interactions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "agent": "antigravity-preview-09-2026",
              "input": "Write a basic Hello World template to /workspace/template.py.",
              "environment": "remote"
            }')
          ENV_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['environment_id'])")

          # Step 2: Fork that environment into a named agent
          curl -X POST https://generativelanguage.googleapis.com/v1beta/agents \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d "{
              \"id\": \"my-data-analyst\",
              \"base_agent\": \"antigravity-preview-09-2026\",
              \"system_instruction\": \"You are a data analyst. Use the template at /workspace/template.py for all reports.\",
              \"base_environment\": \"$ENV_ID\"
            }"
          ```

    === "Python"

          ```python
          import uuid
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})

          # Step 1: Set up the environment interactively.
          interaction = client.interactions.create(
              agent="antigravity-preview-09-2026",
              input="Write a basic Hello World template to /workspace/template.py.",
              environment="remote",
          )

          # Step 2: Fork that environment into a named agent.
          agent_id = f"my-data-analyst-{uuid.uuid4().hex[:8]}"
          agent = client.agents.create(
              id=agent_id,
              base_agent="antigravity-preview-09-2026",
              system_instruction=(
                  "You are a data analyst. Use the template at /workspace/template.py"
                  " for all reports."
              ),
              base_environment=interaction.environment_id,
          )
          print(f"Forked agent: {agent.id}")
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});

          // Step 1: Set up the environment interactively.
          const interaction = await ai.interactions.create({
            agent: 'antigravity-preview-09-2026',
            input: 'Write a basic Hello World template to /workspace/template.py.',
            environment: 'remote',
          });

          // Step 2: Fork that environment into a named agent.
          const agentId = `my-data-analyst-${crypto.randomUUID().slice(0, 8)}`;
          const agent = await ai.agents.create({
            id: agentId,
            base_agent: 'antigravity-preview-09-2026',
            system_instruction:
              'You are a data analyst. Use the template at /workspace/template.py for all reports.',
            base_environment: interaction.environment_id,
          });
          console.log(`Forked agent: ${agent.id}`);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.agents.Agent;
          import com.google.genai.gaos.models.agents.BaseEnvironment;
          import com.google.genai.gaos.models.interactions.AgentOption;
          import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
          import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.Step;
          import com.google.genai.gaos.models.operations.CreateAgentResponse;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import com.google.genai.gaos.models.operations.CreateInteractionResponse;
          import com.google.genai.types.HttpOptions;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

          // Step 1: Set up the environment interactively.
          CreateAgentInteraction params =
              CreateAgentInteraction.builder()
                  .agent(AgentOption.of("antigravity-preview-09-2026"))
                  .input(
                      InteractionsInput.of(
                          "Write a basic Hello World template to /workspace/template.py."))
                  .environment(CreateAgentInteractionEnvironment.of("remote"))
                  .build();
          CreateInteractionResponse interactionResponse =
              client.interactions.create(CreateInteractionRequestBody.of(params));
          Interaction interaction =
              interactionResponse
                  .interaction()
                  .orElseThrow(() -> new RuntimeException("No interaction returned"));

          // Step 2: Fork that environment into a named agent.
          String agentId = "my-data-analyst-" + UUID.randomUUID().toString().substring(0, 8);
          Agent agent =
              Agent.builder()
                  .id(agentId)
                  .baseAgent("antigravity-preview-09-2026")
                  .systemInstruction(
                      "You are a data analyst. Use the template at /workspace/template.py for all"
                          + " reports.")
                  .baseEnvironment(BaseEnvironment.of(interaction.environmentId().orElse("")))
                  .build();
          CreateAgentResponse agentResponse = client.agents.create(agent);
          System.out.println("Forked agent: " + agentResponse.agent().flatMap(Agent::id).orElse(""));
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
              gaos_agents "google.golang.org/genai/interactions/models/agents"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, &genai.ClientConfig{
                  HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
              })
              if err != nil {
                  log.Fatal(err)
              }

              // Step 1: Set up the environment interactively.
              interactionReq := operations.CreateInteractionRequest{
                  Body: operations.NewCreateInteractionRequestBody(gaos_interactions.CreateAgentInteraction{
                      Agent:       gaos_interactions.AgentOption("antigravity-preview-09-2026"),
                      Input:       genai.Ptr(gaos_interactions.NewInteractionsInput("Write a basic Hello World template to /workspace/template.py.")),
                      Environment: genai.Ptr(gaos_interactions.NewCreateAgentInteractionEnvironment("remote")),
                  }),
              }
              interactionRes, err := client.Interactions.Create(ctx, interactionReq)
              if err != nil {
                  log.Fatal(err)
              }
              envID := ""
              if interactionRes.Interaction != nil && interactionRes.Interaction.EnvironmentID != nil {
                  envID = *interactionRes.Interaction.EnvironmentID
              }

              // Step 2: Fork that environment into a named agent.
              agentID := fmt.Sprintf("my-data-analyst-%d", time.Now().UnixNano())
              req := operations.CreateAgentRequest{
                  Body: gaos_agents.Agent{
                      ID:                genai.Ptr(agentID),
                      BaseAgent:         genai.Ptr("antigravity-preview-09-2026"),
                      SystemInstruction: genai.Ptr("You are a data analyst. Use the template at /workspace/template.py for all reports."),
                      BaseEnvironment:   genai.Ptr(gaos_agents.NewBaseEnvironment(envID)),
                  },
              }
              res, err := client.Agents.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }
              if res.Agent != nil && res.Agent.ID != nil {
                  fmt.Printf("Forked agent: %s\n", *res.Agent.ID)
              }
          }
          ```


  


  
## 回應 {#response}

  
  **id**: `string`

  代理的唯一識別碼。

  

---


  **base_agent**: `string`

  要擴充的基礎代理。

  

---


  **system_instruction**: `string`

  代理的系統指令。

  

---


  **description**: `string`

  供開發人員快速閱讀與理解的代理說明。

  

---


  

??? note "**agent_config**: `AntigravityAgentConfig` 代理的設定參數。"

    **type**: required `object`

    值： `antigravity`

    **model**: `string`

    代理推理所使用的模型。

    **max_total_tokens**: `string`

    代理執行期間的 token 總數上限。



  

---


  

??? note "**base_environment**: `EnvironmentConfig` or `string` 代理的環境設定。"

      **可能的類型：** 



    ??? note "**EnvironmentConfig**"

          自訂環境的設定。

          **type**: required `object`

          值： `remote`



        ??? note "**sources**: `Source array`"

            ??? note "**type**: `string enum`"

                可能的值：

                - `gcs`: Cloud Storage 值區。
                - `inline`: 行內內容。
                - `repository`: 一般儲存庫。來源 URL 中的通訊協定前置字元可識別提供者（例如 github://、gcs://）。



              **source**: `string`

              環境的來源。對於 Cloud Storage，這是 Cloud Storage 路徑；對於 GitHub，這是 GitHub 路徑。

              **target**: `string`

              來源在環境中應出現的位置。

              **content**: `string`

              當 `type` 為 `INLINE` 時的行內內容。

              **encoding**: `string`

              行內內容的選用編碼（例如 `base64`）。





        ??? note "**network**: `EnvironmentNetworkEgressAllowlist` or `string enum` 環境的網路設定。"

              **可能的類型：** 



            ??? note "**EnvironmentNetworkEgressAllowlist**"

                  環境的網路輸出設定。



                ??? note "**allowlist**: `EgressRule array` or `string enum` 允許的網域及其設定清單。設為 `"disabled"` 即可封鎖所有網路輸出。"

                      **可能的類型：** 



                    ??? note "**EgressRule array**"

                        單一網域允許清單規則，可選擇性注入標頭。

                        **domain**: required `string`

                        允許送出請求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

                        **transform**: `object`

                        要注入至符合此規則之請求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

                        **credential**: `string`

                        選用。透過 ID 參照由伺服器管理的 Credential 資源。





                    ??? note "**string enum**"

                        可能的值：

                        - `disabled`: 所有網路輸出皆被封鎖。





            ??? note "**string enum**"

                可能的值：

                - `disabled`: 所有網路輸出皆被封鎖。



          **environment_id**: `string`

          選用。互動的環境 ID。若有指定，請求將更新現有環境，而非建立新環境。



        ??? note "**env**: `object` or `string` 要在沙箱環境中設定的環境變數。"

              **可能的類型：** 



            ??? note "**string**"

                直接的字串值。





        ??? note "**mode**: `string enum` 此環境的運算生命週期模式。"

            可能的值：

            - `on_demand`: 此環境的運算生命週期模式。
            - `self_hosted`: 此環境的運算生命週期模式。



          **custom_config**: `object`

          選用。傳遞至自行託管環境輪詢器的任意客戶自訂 JSON 設定。僅在 `mode` 為 `SELF_HOSTED` 時支援。





    ??? note "**string**"

        直接的字串值。



  

---


  

??? note "**tools**: `AgentTool array` 代理可使用的工具。"

      **可能的類型：** 



    ??? note "**CodeExecution**"

        模型可用來執行程式碼的工具。

        **type**: required `object`

        值： `code_execution`





    ??? note "**Function**"

        模型可使用的工具。

        **type**: required `object`

        值： `function`

        **name**: `string`

        函式的名稱。

        **description**: `string`

        函式的說明。

        **parameters**: `object`

        函式參數的 JSON Schema。支援 JSON Schema 的子集。 `minLength`, `maxLength`, `minProperties`, `maxProperties`, `uniqueItems`, `contains`, `minContains`, and `maxContains` 會被忽略且不強制執行。

        **defer_loading**: `boolean`

        若為 true，系統會延遲載入此函式。

        **short_description**: `string`

        函式的簡短描述；對於設定了 `defer_loading` 的函式，模型會看到這段摘要。





    ??? note "**GoogleSearch**"

          模型可用來搜尋 Google 的工具。

          **type**: required `object`

          值： `google_search`



        ??? note "**search_types**: `string enum array` 要啟用的搜尋接地類型。"

            可能的值：

            - `web_search`: 設定此欄位可啟用網路搜尋。僅傳回文字結果。
            - `image_search`: 設定此欄位可啟用圖片搜尋。傳回圖片位元組。





    ??? note "**McpServer**"

          MCPServer 是模型可呼叫以執行動作的伺服器。

          **type**: required `object`

          值： `mcp_server`

          **name**: `string`

          MCPServer 的名稱。

          **url**: `string`

          MCPServer 端點的完整 URL。範例： "https://api.example.com/mcp"

          **headers**: `object`

          選用：視需要提供驗證標頭、逾時等欄位。



        ??? note "**allowed_tools**: `AllowedTools array` 允許的工具。"

            ??? note "**mode**: `string enum` 工具選擇的模式。"

                可能的值：

                - `auto`: 自動選擇工具。
                - `any`: 任一工具選擇。
                - `none`: 不選擇工具。
                - `validated`: 經驗證的工具選擇。



              **tools**: `string array`

              允許的工具名稱。

              **defer_loading**: `boolean`

              若為 true，系統會延遲載入此 MCP 伺服器上的工具。





    ??? note "**UrlContext**"

        模型可用來取得 URL 內容脈絡的工具。

        **type**: required `object`

        值： `url_context`



  

  

  
  **回應範例** 

  

=== "建立代理"

      ```json
      {
        "description": "A helpful research assistant.",
        "base_agent": "antigravity-preview-09-2026",
        "base_environment": "remote",
        "id": "research-assistant-abc123",
        "system_instruction": "You are a helpful research assistant.",
        "tools": [
          {
            "type": "google_search"
          }
        ]
      }
      ```

=== "含有來源的代理"

      ```json
      {
        "base_agent": "antigravity-preview-09-2026",
        "base_environment": {
          "type": "remote",
          "sources": [
            {
              "type": "inline",
              "content": "Always use matplotlib for charts. Include a summary table in every report.",
              "target": ".agents/AGENTS.md"
            },
            {
              "type": "repository",
              "source": "https://github.com/my-org/analysis-templates",
              "target": "/workspace/templates"
            }
          ]
        },
        "id": "data-analyst-abc123",
        "system_instruction": "You are a data analyst. Always include visualizations and export results as PDF."
      }
      ```

=== "從環境分叉的代理"

      ```json
      {
        "base_agent": "antigravity-preview-09-2026",
        "base_environment": "env_abc123",
        "id": "my-data-analyst-abc123",
        "system_instruction": "You are a data analyst. Use the template at /workspace/template.py for all reports."
      }
      ```


  

