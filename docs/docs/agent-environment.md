# 受管理代理的環境

環境是 Linux 沙箱，為代理提供一個隔離的空間來執行
程式碼並儲存檔案。環境與互動情境彼此獨立，因此您可以
在多次互動中重複使用同一個環境，也能隨時重新
開始。沙箱預設由 Google 代管，您也可以連接
[自行代管環境](/docs/agent-environment/#self-hosted-environments)，在
您自己的基礎架構中執行工具。

以下範例示範如何以全新的遠端環境建立互動，
並取得其 ID：


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Install pandas and matplotlib, verify the imports, and print the versions.",
          environment="remote",
      )

      print(f"Environment ID: {interaction.environment_id}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Install pandas and matplotlib, verify the imports, and print the versions.",
          environment: "remote",
      });

      console.log(`Environment ID: ${interaction.environment_id}`);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Install pandas and matplotlib, verify the imports, and print the versions.",
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
          .input(InteractionsInput.of("Install pandas and matplotlib, verify the imports, and print the versions."))
          .environment(CreateAgentInteractionEnvironment.of("remote"))
          .build();

      Interaction interaction = client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      System.out.println("Environment ID: " + interaction.environmentId().orElse(""));
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
                  Input:       interactions.NewInteractionsInput("Install pandas and matplotlib, verify the imports, and print the versions."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment("remote")),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.EnvironmentID != nil {
              fmt.Printf("Environment ID: %s\n", *res.Interaction.EnvironmentID)
          }
      }
      ```


## `environment` 參數 {#the-environment-parameter}

`environment` 參數接受三種形式：

| 形式 | 範例 | 使用時機 |
| :--- | :--- | :--- |
| `"remote"` | `environment="remote"` | 佈建一個全新的沙箱。 |
| 環境 ID | `environment="env_abc123"` | 重複使用既有沙箱，連同其中的所有檔案與套件。 |
| 設定物件 | `environment={...}` | 佈建新沙箱，可帶入來源、網路規則、環境變數，或三者的組合。 |

以下範例示範 `environment` 參數的三種
用法。


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # Fresh sandbox
      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Write a hello world script.",
          environment="remote",
      )

      # Reuse an existing sandbox
      interaction_2 = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Modify the script to accept a name argument.",
          environment=interaction.environment_id,
          previous_interaction_id=interaction.id,
      )

      # New sandbox with sources
      interaction_3 = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="List all files and summarize the project.",
          environment={
              "type": "remote",
              "sources": [
                  {
                      "type": "repository",
                      "source": "https://github.com/octocat/Spoon-Knife",
                      "target": "/workspace/spoon-knife",
                  }
              ],
          },
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      // Fresh sandbox
      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Write a hello world script.",
          environment: "remote",
      });

      // Reuse an existing sandbox
      const interaction2 = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Modify the script to accept a name argument.",
          environment: interaction.environment_id,
          previous_interaction_id: interaction.id,
      });

      // New sandbox with sources
      const interaction3 = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "List all files and summarize the project.",
          environment: {
              type: "remote",
              sources: [
                  {
                      type: "repository",
                      source: "https://github.com/octocat/Spoon-Knife",
                      target: "/workspace/spoon-knife",
                  },
              ],
          },
      });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      # Fresh sandbox
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": [{"type": "text", "text": "Write a hello world script."}],
          "environment": "remote"
      }'

      # Reuse an existing sandbox (replace $ENV_ID and $INTERACTION_ID with values from the previous response)
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d "{
          \"agent\": \"antigravity-preview-09-2026\",
          \"input\": [{\"type\": \"text\", \"text\": \"Modify the script to accept a name argument.\"}],
          \"environment\": \"$ENV_ID\",
          \"previous_interaction_id\": \"$INTERACTION_ID\"
      }"

      # New sandbox with sources
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": [{"type": "text", "text": "List all files and summarize the project."}],
          "environment": {
              "type": "remote",
              "sources": [
                  {
                      "type": "repository",
                      "source": "https://github.com/octocat/Spoon-Knife",
                      "target": "/workspace/spoon-knife"
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

      // Fresh sandbox
      CreateAgentInteraction params1 = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Write a hello world script."))
          .environment(CreateAgentInteractionEnvironment.of("remote"))
          .build();
      Interaction interaction = client.interactions.create(CreateInteractionRequestBody.of(params1)).interaction().get();

      // Reuse an existing sandbox
      CreateAgentInteraction params2 = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Modify the script to accept a name argument."))
          .environment(CreateAgentInteractionEnvironment.of(interaction.environmentId().orElse("")))
          .previousInteractionId(interaction.id().orElse(""))
          .build();
      Interaction interaction2 = client.interactions.create(CreateInteractionRequestBody.of(params2)).interaction().get();

      // New sandbox with sources
      Environment env3 = Environment.builder()
          .sources(List.of(
              Source.builder()
                  .type(SourceType.REPOSITORY)
                  .source("https://github.com/octocat/Spoon-Knife")
                  .target("/workspace/spoon-knife")
                  .build()
          ))
          .build();

      CreateAgentInteraction params3 = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("List all files and summarize the project."))
          .environment(CreateAgentInteractionEnvironment.of(env3))
          .build();
      Interaction interaction3 = client.interactions.create(CreateInteractionRequestBody.of(params3)).interaction().get();

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

          // Fresh sandbox
          res1, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Write a hello world script."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment("remote")),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          interaction := res1.Interaction

          // Reuse an existing sandbox
          res2, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:                 interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:                 interactions.NewInteractionsInput("Modify the script to accept a name argument."),
                  Environment:           genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(*interaction.EnvironmentID)),
                  PreviousInteractionID: interaction.ID,
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          _ = res2

          // New sandbox with sources
          env3 := interactions.Environment{
              Sources: []interactions.Source{
                  {
                      Type:   interactions.SourceTypeRepository.ToPointer(),
                      Source: genai.Ptr("https://github.com/octocat/Spoon-Knife"),
                      Target: genai.Ptr("/workspace/spoon-knife"),
                  },
              },
          }

          res3, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("List all files and summarize the project."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(env3)),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          _ = res3

          if interaction.OutputText != nil {
              fmt.Println(*interaction.OutputText)
          }
      }
      ```


## 設定環境 {#configure-an-environment}

設定環境的方法之一，是直接告訴代理需要安裝什麼。
代理會處理相依性解析與疑難排解。環境就緒後，
請儲存 `environment_id` 並重複使用。


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Install pandas, matplotlib, and seaborn. Verify all imports work and print the installed versions.",
          environment="remote",
      )

      # Reuse the configured environment
      interaction_2 = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Clone https://github.com/octocat/Spoon-Knife into /workspace/tools. Run the test suite and fix any missing dependencies.",
          environment=interaction.environment_id,
          previous_interaction_id=interaction.id,
      )

      # Reuse the configured environment
      interaction_3 = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Using the tools in /workspace/tools, list the files.",
          environment=interaction.environment_id,
          previous_interaction_id=interaction_2.id,
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Install pandas, matplotlib, and seaborn. Verify all imports work and print the installed versions.",
          environment: "remote",
      });

      const interaction2 = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Clone https://github.com/octocat/Spoon-Knife into /workspace/tools. Run the test suite and fix any missing dependencies.",
          environment: interaction.environment_id,
          previous_interaction_id: interaction.id,
      });

      const interaction3 = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Using the tools in /workspace/tools, list the files.",
          environment: interaction.environment_id,
          previous_interaction_id: interaction2.id,
      });
      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      # Create interaction
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Install pandas, matplotlib, and seaborn. Verify all imports work and print the installed versions.",
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

      CreateAgentInteraction params1 = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Install pandas, matplotlib, and seaborn. Verify all imports work and print the installed versions."))
          .environment(CreateAgentInteractionEnvironment.of("remote"))
          .build();
      Interaction interaction = client.interactions.create(CreateInteractionRequestBody.of(params1)).interaction().get();

      // Reuse the configured environment
      CreateAgentInteraction params2 = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Clone https://github.com/octocat/Spoon-Knife into /workspace/tools. Run the test suite and fix any missing dependencies."))
          .environment(CreateAgentInteractionEnvironment.of(interaction.environmentId().orElse("")))
          .previousInteractionId(interaction.id().orElse(""))
          .build();
      Interaction interaction2 = client.interactions.create(CreateInteractionRequestBody.of(params2)).interaction().get();

      // Reuse the configured environment
      CreateAgentInteraction params3 = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Using the tools in /workspace/tools, list the files."))
          .environment(CreateAgentInteractionEnvironment.of(interaction.environmentId().orElse("")))
          .previousInteractionId(interaction2.id().orElse(""))
          .build();
      Interaction interaction3 = client.interactions.create(CreateInteractionRequestBody.of(params3)).interaction().get();

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

          res1, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Install pandas, matplotlib, and seaborn. Verify all imports work and print the installed versions."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment("remote")),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          interaction := res1.Interaction

          // Reuse the configured environment
          res2, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:                 interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:                 interactions.NewInteractionsInput("Clone https://github.com/octocat/Spoon-Knife into /workspace/tools. Run the test suite and fix any missing dependencies."),
                  Environment:           genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(*interaction.EnvironmentID)),
                  PreviousInteractionID: interaction.ID,
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          interaction2 := res2.Interaction

          // Reuse the configured environment
          res3, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:                 interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:                 interactions.NewInteractionsInput("Using the tools in /workspace/tools, list the files."),
                  Environment:           genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(*interaction.EnvironmentID)),
                  PreviousInteractionID: interaction2.ID,
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          _ = res3

          if interaction.OutputText != nil {
              fmt.Println(*interaction.OutputText)
          }
      }
      ```


### 從來源掛載 {#mount-from-a-source}

如果您確切知道代理需要哪些檔案，可以在單次呼叫中一次掛載，
不必反覆迭代。`environment` 設定物件接受 `sources` 陣列，
包含三種類型：

| 來源類型 | `type` 值 | 說明 | 上限 |
| :--- | :--- | :--- | :--- |
| Git 存放庫 | `repository` | 從 URL 將存放庫複製到沙箱中的 `target`。 | 500 MB |
| Cloud Storage | `gcs` | 將檔案或目錄從 Cloud Storage 複製到沙箱中的 `target`。 | 2 GB |
| 內嵌內容 | `inline` | 將原始文字內容寫入沙箱中 `target` 位置的檔案。 | 每個檔案 1 MB，總計 2 MB |


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="List all files under /workspace and describe what you find.",
          environment={
              "type": "remote",
              "sources": [
                  {
                      "type": "repository",
                      "source": "https://github.com/octocat/Spoon-Knife",
                      "target": "/workspace/spoon-knife",
                  },
                  {
                      "type": "gcs",
                      "source": "gs://cloud-samples-data/bigquery/us-states/",
                      "target": "/workspace/gcs-data",
                  },
                  {
                      "type": "inline",
                      "content": "# Project Notes\n\n- Analyze state population data\n- Create visualizations\n",
                      "target": "/workspace/notes/readme.md",
                  },
              ],
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
          input: "List all files under /workspace and describe what you find.",
          environment: {
              type: "remote",
              sources: [
                  {
                      type: "repository",
                      source: "https://github.com/octocat/Spoon-Knife",
                      target: "/workspace/spoon-knife",
                  },
                  {
                      type: "gcs",
                      source: "gs://cloud-samples-data/bigquery/us-states/",
                      target: "/workspace/gcs-data",
                  },
                  {
                      type: "inline",
                      content: "# Project Notes\n\n- Analyze state population data\n- Create visualizations\n",
                      target: "/workspace/notes/readme.md",
                  },
              ],
          },
      });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      # Create interaction with sources
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "List all files under /workspace and describe what you find.",
          "environment": {
              "type": "remote",
              "sources": [
                  {
                      "type": "repository",
                      "source": "https://github.com/octocat/Spoon-Knife",
                      "target": "/workspace/spoon-knife"
                  },
                  {
                      "type": "gcs",
                      "source": "gs://cloud-samples-data/bigquery/us-states/",
                      "target": "/workspace/gcs-data"
                  },
                  {
                      "type": "inline",
                      "content": "# Project Notes\n\n- Analyze state population data\n- Create visualizations\n",
                      "target": "/workspace/notes/readme.md"
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
                  .type(SourceType.REPOSITORY)
                  .source("https://github.com/octocat/Spoon-Knife")
                  .target("/workspace/spoon-knife")
                  .build(),
              Source.builder()
                  .type(SourceType.GCS)
                  .source("gs://cloud-samples-data/bigquery/us-states/")
                  .target("/workspace/gcs-data")
                  .build(),
              Source.builder()
                  .type(SourceType.INLINE)
                  .content("# Project Notes\n\n- Analyze state population data\n- Create visualizations\n")
                  .target("/workspace/notes/readme.md")
                  .build()
          ))
          .build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("List all files under /workspace and describe what you find."))
          .environment(CreateAgentInteractionEnvironment.of(env))
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

          env := interactions.Environment{
              Sources: []interactions.Source{
                  {
                      Type:   interactions.SourceTypeRepository.ToPointer(),
                      Source: genai.Ptr("https://github.com/octocat/Spoon-Knife"),
                      Target: genai.Ptr("/workspace/spoon-knife"),
                  },
                  {
                      Type:   interactions.SourceTypeGcs.ToPointer(),
                      Source: genai.Ptr("gs://cloud-samples-data/bigquery/us-states/"),
                      Target: genai.Ptr("/workspace/gcs-data"),
                  },
                  {
                      Type:    interactions.SourceTypeInline.ToPointer(),
                      Content: genai.Ptr("# Project Notes\n\n- Analyze state population data\n- Create visualizations\n"),
                      Target:  genai.Ptr("/workspace/notes/readme.md"),
                  },
              },
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("List all files under /workspace and describe what you find."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(env)),
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


您也可以結合兩種做法：先以宣告方式掛載已知來源，再透過後續
互動迭代，安裝套件或執行設定指令碼。新增自訂來源時，您不能將根目錄
（`/`）設為 target，
必須一律指定子目錄。

### Hooks {#hooks}

您也可以將 `.agents/hooks.json` 設定檔與自訂攔截指令碼掛載到沙箱中，在工具執行時強制套用安全防護措施或執行自動化驗證。結構定義與程式碼範例請參閱 [Hooks](/docs/agent-hooks/)。

### 私有來源 {#private-sources}

您也可以從私有 GitHub 存放庫或私有 Cloud Storage
值區下載，方法是先在網路
設定中驗證來源網域。

一種做法是引用已儲存的 [憑證](/docs/agent-credentials/)（以 ID 引用），
這樣密鑰只需儲存一次，每個需要該來源的
環境都能引用它：

```json
"network": {
    "allowlist": [
        { "domain": "github.com", "credential": "github-production" },
        { "domain": "*" }
    ]
}
```

您也可以如下列範例所示，以 `transform` 內嵌設定標頭。egress proxy 對兩種
形式的處理方式相同，而且無論哪一種，
密鑰都不會進入沙箱。

對於**私有 Git 存放庫**，請使用 `Basic` 驗證搭配您的
[GitHub Personal Access Token
（PAT）](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)。
使用 `x-oauth-basic` 作為使用者名稱來編碼該 token：

```shell
echo -n "x-oauth-basic:ghp_YourPATHere" | base64
```


=== "Python"

      ```py
      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Run the test for my backend app and fix any issue.",
          environment={
              "type": "remote",
              "sources": [
                  {
                      "type": "repository",
                      "source": "https://github.com/your-org/backend",
                      "target": "/backend-app"
                  }
              ],
              "network": {
                  "allowlist": [
                      {
                          "domain": "github.com",
                          "transform": {
                              "Authorization": "Basic YOUR_BASE64_TOKEN"
                          }
                      },
                      {
                          "domain": "*"
                      }
                  ]
              }
          }
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Run the test for my backend app and fix any issue.",
          environment: {
              type: "remote",
              sources: [
                  {
                      type: "repository",
                      source: "https://github.com/your-org/backend",
                      target: "/backend-app"
                  }
              ],
              network: {
                  allowlist: [
                      {
                          domain: "github.com",
                          transform: {
                              "Authorization": "Basic YOUR_BASE64_TOKEN"
                          }
                      },
                      {
                          domain: "*"
                      }
                  ]
              }
          },
      });
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Run the test for my backend app and fix any issue.",
          "environment": {
              "type": "remote",
              "sources": [
                  {
                      "type": "repository",
                      "source": "https://github.com/your-org/backend",
                      "target": "/backend-app"
                  }
              ],
              "network": {
                  "allowlist": [
                      {
                          "domain": "github.com",
                          "transform": {
                              "Authorization": "Basic YOUR_BASE64_TOKEN"
                          }
                      },
                      {
                          "domain": "*"
                      }
                  ]
              }
          }
      }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.Allowlist;
      import com.google.genai.gaos.models.interactions.AllowlistEntry;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Environment;
      import com.google.genai.gaos.models.interactions.EnvironmentNetworkEgressAllowlist;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Network;
      import com.google.genai.gaos.models.interactions.Source;
      import com.google.genai.gaos.models.interactions.SourceType;
      import com.google.genai.gaos.models.interactions.Transform;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.List;
      import java.util.Map;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      Environment env = Environment.builder()
          .sources(List.of(
              Source.builder()
                  .type(SourceType.REPOSITORY)
                  .source("https://github.com/your-org/backend")
                  .target("/backend-app")
                  .build()
          ))
          .network(Network.of(
              EnvironmentNetworkEgressAllowlist.builder()
                  .allowlist(Allowlist.of(List.of(
                      AllowlistEntry.builder()
                          .domain("github.com")
                          .transform(Transform.of(Map.of(
                              "Authorization", "Basic YOUR_BASE64_TOKEN"
                          )))
                          .build(),
                      AllowlistEntry.builder()
                          .domain("*")
                          .build()
                  )))
                  .build()
          ))
          .build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Run the test for my backend app and fix any issue."))
          .environment(CreateAgentInteractionEnvironment.of(env))
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

          env := interactions.Environment{
              Sources: []interactions.Source{
                  {
                      Type:   interactions.SourceTypeRepository.ToPointer(),
                      Source: genai.Ptr("https://github.com/your-org/backend"),
                      Target: genai.Ptr("/backend-app"),
                  },
              },
              Network: genai.Ptr(interactions.NewNetwork(interactions.EnvironmentNetworkEgressAllowlist{
                  Allowlist: genai.Ptr(interactions.NewAllowlist([]interactions.AllowlistEntry{
                      {
                          Domain: "github.com",
                          Transform: genai.Ptr(interactions.NewTransform(map[string]string{
                              "Authorization": "Basic YOUR_BASE64_TOKEN",
                          })),
                      },
                      {
                          Domain: "*",
                      },
                  })),
              })),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Run the test for my backend app and fix any issue."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(env)),
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


對於**私有 Cloud Storage 值區**，請使用標準的 OAuth 2.0 Bearer token：

```shell
gcloud auth print-access-token
```


=== "Python"

      ```py
      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Analyze the discrepancies across the data in workspace",
          environment={
              "type": "remote",
              "sources": [
                  {
                      "type": "gcs",
                      "source": "gs://my-private-bucket/data",
                      "target": "/workspace",
                  }
              ],
              "network": {
                  "allowlist": [
                      {
                          "domain": "*.googleapis.com",
                          "transform": {
                              "Authorization": "Bearer YOUR_GCS_TOKEN"
                          }
                      },
                      {
                          "domain": "*"
                      }
                  ]
              }
          },
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Analyze the discrepancies across the data in workspace",
          environment: {
              type: "remote",
              sources: [
                  {
                      type: "gcs",
                      source: "gs://my-private-bucket/data",
                      target: "/workspace",
                  }
              ],
              network: {
                  allowlist: [
                      {
                          domain: "storage.googleapis.com",
                          transform: {
                              "Authorization": "Bearer YOUR_GCS_TOKEN"
                          }
                      },
                      {
                          domain: "*"
                      }
                  ]
              }
          },
      });
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Analyze the discrepancies across the data in workspace",
          "environment": {
              "type": "remote",
              "sources": [
                  {
                      "type": "gcs",
                      "source": "gs://my-private-bucket/data",
                      "target": "/workspace"
                  }
              ],
              "network": {
                  "allowlist": [
                      {
                          "domain": "storage.googleapis.com",
                          "transform": {
                              "Authorization": "Bearer YOUR_GCS_TOKEN"
                          }
                      },
                      {
                          "domain": "*"
                      }
                  ]
              }
          }
      }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.Allowlist;
      import com.google.genai.gaos.models.interactions.AllowlistEntry;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Environment;
      import com.google.genai.gaos.models.interactions.EnvironmentNetworkEgressAllowlist;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Network;
      import com.google.genai.gaos.models.interactions.Source;
      import com.google.genai.gaos.models.interactions.SourceType;
      import com.google.genai.gaos.models.interactions.Transform;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.List;
      import java.util.Map;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      Environment env = Environment.builder()
          .sources(List.of(
              Source.builder()
                  .type(SourceType.GCS)
                  .source("gs://my-private-bucket/data")
                  .target("/workspace")
                  .build()
          ))
          .network(Network.of(
              EnvironmentNetworkEgressAllowlist.builder()
                  .allowlist(Allowlist.of(List.of(
                      AllowlistEntry.builder()
                          .domain("*.googleapis.com")
                          .transform(Transform.of(Map.of(
                              "Authorization", "Bearer YOUR_GCS_TOKEN"
                          )))
                          .build(),
                      AllowlistEntry.builder()
                          .domain("*")
                          .build()
                  )))
                  .build()
          ))
          .build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Analyze the discrepancies across the data in workspace"))
          .environment(CreateAgentInteractionEnvironment.of(env))
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

          env := interactions.Environment{
              Sources: []interactions.Source{
                  {
                      Type:   interactions.SourceTypeGcs.ToPointer(),
                      Source: genai.Ptr("gs://my-private-bucket/data"),
                      Target: genai.Ptr("/workspace"),
                  },
              },
              Network: genai.Ptr(interactions.NewNetwork(interactions.EnvironmentNetworkEgressAllowlist{
                  Allowlist: genai.Ptr(interactions.NewAllowlist([]interactions.AllowlistEntry{
                      {
                          Domain: "*.googleapis.com",
                          Transform: genai.Ptr(interactions.NewTransform(map[string]string{
                              "Authorization": "Bearer YOUR_GCS_TOKEN",
                          })),
                      },
                      {
                          Domain: "*",
                      },
                  })),
              })),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Analyze the discrepancies across the data in workspace"),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(env)),
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


## 預先安裝的軟體 {#pre-installed-software}

沙箱以 Ubuntu 運行，並預先安裝執行環境與常用
套件。代理可以在執行期間使用 `pip
install` 或 `npm install` 安裝其他套件。在互動期間安裝的套件，在您重複使用同一個
`environment_id` 時會保留下來。

| 類別 | 預先安裝的套件 |
| :--- | :--- |
| **UNIX 工具** | `curl`, `wget`, `git`, `rsync`, `unzip`, `ripgrep`, `fd-find`, `gawk`, `bc`, `tree`, `which`, `lsof`, `htop`, `jq`, `iproute2`, `procps`, `gcloud CLI` |
| **Python 3.12** | `numpy`, `pandas`, `requests`, `google-genai`, `beautifulsoup4`, `pyyaml`, `ast-grep-cli` |
| **Node.js 22** | `create-next-app`, `create-vite`, `typescript` |

## 環境變數 {#environment-variables}

使用 `env` 欄位在沙箱內設定環境變數。每個項目
會將變數名稱對應到一個值：可以是設定用的字面字串，
也可以是密鑰用的已儲存 [憑證](/docs/agent-credentials/) 引用。代理
看待這些變數的方式與在任何 shell 中相同，因此會從
行程環境讀取的工具與指令碼都能直接取得，無需額外串接。

| 欄位 | 類型 | 說明 |
| :--- | :--- | :--- |
| `env` | `object` | 變數名稱與值的對應表。值可以是字面 `string`，或形式為 `{"credential": "credential-id"}` 的憑證引用。 |


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Build the project and run the test suite.",
          environment={
              "type": "remote",
              "env": {
                  "NODE_ENV": "production",
                  "LOG_LEVEL": "debug",
                  "API_TOKEN": {"credential": "my-api-token"},
              },
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
          input: "Build the project and run the test suite.",
          environment: {
              type: "remote",
              env: {
                  NODE_ENV: "production",
                  LOG_LEVEL: "debug",
                  API_TOKEN: { credential: "my-api-token" },
              },
          },
      });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": [{"type": "text", "text": "Build the project and run the test suite."}],
          "environment": {
              "type": "remote",
              "env": {
                  "NODE_ENV": "production",
                  "LOG_LEVEL": "debug",
                  "API_TOKEN": {"credential": "my-api-token"}
              }
          }
      }'
      ```


變數會套用到代理在該次互動中執行的每個指令，
包括 shell 指令、建置步驟，以及它啟動的任何行程。

兩種值類型的行為並不相同。字面字串會以純文字寫入
容器。憑證引用則不同：變數收到的是一個
佔位符，egress proxy 只有在向該憑證信任網域發出外送要求時，
才會代入真正的密鑰。詳情請參閱
[將憑證用作環境變數](/docs/agent-credentials/#environment-variables)，
了解其運作方式。

注意：沙箱中執行的任何程式（包括代理本身）都能讀取字面值。請將字面值用於 `NODE_ENV` 這類設定，不要用於密鑰。所有密鑰都應存放在憑證中。

## 網路設定 {#network-configuration}

預設情況下，環境的外送網路存取不受限制。使用
`network` 欄位可將外送流量限制在特定網域。每條規則
會指定一個 `domain`，並可選擇性加上 `credential` 以注入已儲存的密鑰，
以及選擇性的 `transform` 物件，將標頭注入符合的要求。
這些標頭可依每次互動而有所不同，您也可以針對同一個環境更新它們。

| 欄位 | 類型 | 說明 |
| :--- | :--- | :--- |
| `domain` | `string` | 要比對的網域。使用完整主機名稱，或以 `*` 代表所有網域。 |
| `credential` | `string` | 已儲存的 [憑證](/docs/agent-credentials/) 的 ID。egress proxy 會在要求發出時解析它，並注入驗證標頭。 |
| `transform` | `object` | 包含扁平鍵值對的物件，代表要注入符合要求的標頭，例如 `{"Authorization": "Bearer ..."}`。 |


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Fetch the latest issues from the GitHub API for my-org/my-repo.",
          environment={
              "type": "remote",
              "network": {
                  "allowlist": [
                      {
                          "domain": "api.github.com",
                          "transform": {
                              "Authorization": "Bearer ghp_your_github_token"
                          },
                      },
                      {"domain": "pypi.org"},
                      {"domain": "*"},
                  ]
              },
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
          input: "Fetch the latest issues from the GitHub API for my-org/my-repo.",
          environment: {
              type: "remote",
              network: {
                  allowlist: [
                      {
                          domain: "api.github.com",
                          transform: {
                              "Authorization": "Bearer ghp_your_github_token"
                          },
                      },
                      { domain: "pypi.org" },
                      { domain: "*" },
                  ]
              }
          },
      });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": [{"type": "text", "text": "Fetch the latest issues from the GitHub API for my-org/my-repo."}],
          "environment": {
              "type": "remote",
              "network": {
                  "allowlist": [
                      {
                          "domain": "api.github.com",
                          "transform": {
                              "Authorization": "Bearer ghp_your_github_token"
                          }
                      },
                      {"domain": "pypi.org"},
                      {"domain": "*"}
                  ]
              }
          }
      }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.Allowlist;
      import com.google.genai.gaos.models.interactions.AllowlistEntry;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Environment;
      import com.google.genai.gaos.models.interactions.EnvironmentNetworkEgressAllowlist;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Network;
      import com.google.genai.gaos.models.interactions.Transform;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.List;
      import java.util.Map;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      Environment env = Environment.builder()
          .network(Network.of(
              EnvironmentNetworkEgressAllowlist.builder()
                  .allowlist(Allowlist.of(List.of(
                      AllowlistEntry.builder()
                          .domain("api.github.com")
                          .transform(Transform.of(Map.of(
                              "Authorization", "Bearer ghp_your_github_token"
                          )))
                          .build(),
                      AllowlistEntry.builder().domain("pypi.org").build(),
                      AllowlistEntry.builder().domain("*").build()
                  )))
                  .build()
          ))
          .build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Fetch the latest issues from the GitHub API for my-org/my-repo."))
          .environment(CreateAgentInteractionEnvironment.of(env))
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

          env := interactions.Environment{
              Network: genai.Ptr(interactions.NewNetwork(interactions.EnvironmentNetworkEgressAllowlist{
                  Allowlist: genai.Ptr(interactions.NewAllowlist([]interactions.AllowlistEntry{
                      {
                          Domain: "api.github.com",
                          Transform: genai.Ptr(interactions.NewTransform(map[string]string{
                              "Authorization": "Bearer ghp_your_github_token",
                          })),
                      },
                      {
                          Domain: "pypi.org",
                      },
                      {
                          Domain: "*",
                      },
                  })),
              })),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Fetch the latest issues from the GitHub API for my-org/my-repo."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(env)),
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


設定允許清單後，只有對清單中明確列出的網域發出的要求
才會被允許。您可以使用萬用字元比對子網域（例如 `{"domain":
"*.example.com"}`），但請注意，這不會比對到根網域
`example.com`，根網域必須另外加入。若要允許其他所有流量，
例如將未列出的網域直接路由而不注入標頭，請加入 `{"domain": "*"}` 作為
萬用項目。

### 憑證 {#credentials}

驗證外送流量有兩種方式：以 ID 引用的已儲存憑證，
以及允許清單規則上的內嵌 `transform`。egress
proxy 在傳輸時會套用兩者，因此無論哪一種情況，密鑰都不會進入
沙箱，也不會出現在您的互動酬載中。

如果您想將密鑰儲存一次並重複使用，[受管理的憑證](/docs/agent-credentials/)
就是最適合的選擇。您專案中的每個環境、代理與
觸發器都能引用同一個 ID，而您只需在一個
地方輪替它即可。


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # Store the secret once
      client.credentials.create(
          id="github-production",
          type="bearer_token",
          token="ghp_your_github_token",
      )

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Fetch the latest issues from the GitHub API for my-org/my-repo.",
          environment={
              "type": "remote",
              "network": {
                  "allowlist": [
                      {"domain": "api.github.com", "credential": "github-production"},
                      {"domain": "*"},
                  ]
              },
          },
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      // Store the secret once
      await client.credentials.create({
          id: "github-production",
          type: "bearer_token",
          token: "ghp_your_github_token",
      });

      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Fetch the latest issues from the GitHub API for my-org/my-repo.",
          environment: {
              type: "remote",
              network: {
                  allowlist: [
                      { domain: "api.github.com", credential: "github-production" },
                      { domain: "*" },
                  ]
              }
          },
      });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      # Store the secret once
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/credentials" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "id": "github-production",
          "type": "bearer_token",
          "token": "ghp_your_github_token"
      }'

      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Fetch the latest issues from the GitHub API for my-org/my-repo.",
          "environment": {
              "type": "remote",
              "network": {
                  "allowlist": [
                      { "domain": "api.github.com", "credential": "github-production" },
                      { "domain": "*" }
                  ]
              }
          }
      }'
      ```


`oauth2` 憑證也會自行刷新其存取 token，因此長時間執行的
互動不會因 token 到期而中斷。完整的
憑證類型與管理操作清單，請參閱
[憑證](/docs/agent-credentials/)。

您也可以用 `transform` 內嵌設定標頭。當值只屬於單次
呼叫時很適合這樣做，例如您在建立
互動之前才產生的 token。以這種方式設定的標頭會由同一個 egress proxy 注入，
絕不會以環境變數或檔案的形式暴露在沙箱內。


=== "Python"

      ```py
      import subprocess
      from google import genai

      # Fetch a short-lived access token from your local gcloud CLI
      gcloud_token = subprocess.check_output(
          ["gcloud", "auth", "print-access-token"], text=True
      ).strip()

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="List the files in gs://my-bucket/reports/ using the GCS JSON API.",
          environment={
              "type": "remote",
              "network": {
                  "allowlist": [
                      {
                          "domain": "storage.googleapis.com",
                          "transform": {
                              "Authorization": f"Bearer {gcloud_token}"
                          },
                      }
                  ]
              },
          },
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      import { execSync } from "child_process";

      const gcloudToken = execSync("gcloud auth print-access-token").toString().trim();

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "List the files in gs://my-bucket/reports/ using the GCS JSON API.",
          environment: {
              type: "remote",
              network: {
                  allowlist: [
                      {
                          domain: "storage.googleapis.com",
                          transform: {
                              "Authorization": `Bearer ${gcloudToken}`
                          },
                      }
                  ]
              }
          },
      });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "List the files in gs://my-bucket/reports/ using the GCS JSON API.",
          "environment": {
              "type": "remote",
              "network": {
                  "allowlist": [
                      {
                          "domain": "storage.googleapis.com",
                          "transform": {
                              "Authorization": "Bearer <YOUR_GCLOUD_TOKEN>"
                          }
                      }
                  ]
              }
          }
      }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.Allowlist;
      import com.google.genai.gaos.models.interactions.AllowlistEntry;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Environment;
      import com.google.genai.gaos.models.interactions.EnvironmentNetworkEgressAllowlist;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Network;
      import com.google.genai.gaos.models.interactions.Transform;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.charset.StandardCharsets;
      import java.util.List;
      import java.util.Map;

      // Fetch a short-lived access token from your local gcloud CLI
      Process process = new ProcessBuilder("gcloud", "auth", "print-access-token").start();
      String gcloudToken = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8).trim();

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      Environment env = Environment.builder()
          .network(Network.of(
              EnvironmentNetworkEgressAllowlist.builder()
                  .allowlist(Allowlist.of(List.of(
                      AllowlistEntry.builder()
                          .domain("storage.googleapis.com")
                          .transform(Transform.of(Map.of(
                              "Authorization", "Bearer " + gcloudToken
                          )))
                          .build()
                  )))
                  .build()
          ))
          .build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("List the files in gs://my-bucket/reports/ using the GCS JSON API."))
          .environment(CreateAgentInteractionEnvironment.of(env))
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
          "os/exec"
          "strings"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()

          // Fetch a short-lived access token from your local gcloud CLI
          out, err := exec.Command("gcloud", "auth", "print-access-token").Output()
          if err != nil {
              log.Fatal(err)
          }
          gcloudToken := strings.TrimSpace(string(out))

          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          env := interactions.Environment{
              Network: genai.Ptr(interactions.NewNetwork(interactions.EnvironmentNetworkEgressAllowlist{
                  Allowlist: genai.Ptr(interactions.NewAllowlist([]interactions.AllowlistEntry{
                      {
                          Domain: "storage.googleapis.com",
                          Transform: genai.Ptr(interactions.NewTransform(map[string]string{
                              "Authorization": "Bearer " + gcloudToken,
                          })),
                      },
                  })),
              })),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("List the files in gs://my-bucket/reports/ using the GCS JSON API."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(env)),
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


`credential` 與 `transform` 可以出現在同一條規則上。憑證會
先套用，`transform` 再疊加在其上，因此若兩者設定了相同的鍵，明確的 `transform` 標頭
會優先採用。常見的模式是：以憑證提供
驗證標頭，再以 `transform` 提供服務
一併預期的額外標頭。

### 停用網路存取 {#disable-network-access}

若要封鎖所有外送網路存取，請將 `network` 設為 `disabled`：


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Analyze the local files only.",
          environment={
              "type": "remote",
              "network": "disabled",
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
          input: "Analyze the local files only.",
          environment: {
              type: "remote",
              network: "disabled",
          },
      });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Analyze the local files only.",
          "environment": {
              "type": "remote",
              "network": "disabled"
          }
      }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Environment;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Network;
      import com.google.genai.gaos.models.interactions.NetworkEnum;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      Environment env = Environment.builder()
          .network(Network.of(NetworkEnum.DISABLED))
          .build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Analyze the local files only."))
          .environment(CreateAgentInteractionEnvironment.of(env))
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

          env := interactions.Environment{
              Network: genai.Ptr(interactions.NewNetwork(interactions.NetworkEnumDisabled)),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Analyze the local files only."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(env)),
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


### 刷新憑證 {#refresh-credentials}

存取 token 與短效 API 金鑰等內嵌 token 會到期。
您可以在下一次互動時，一併傳入既有的 `environment_id` 與
新的 `network` 設定來刷新它們。新的網路規則
會完全取代先前的規則，而環境的檔案系統狀態
（已安裝的套件、檔案、存放庫）則會保留。

如果您改用已儲存的 [憑證](/docs/agent-credentials/)，
就不需要這樣做。`oauth2` 憑證會自行刷新，輪替任何
憑證只需對該憑證發出 `PATCH`，所有引用它的允許清單規則
都不會受到影響。


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # First interaction: use an initial token
      first = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="List the files in gs://my-bucket/reports/ using the GCS JSON API.",
          environment={
              "type": "remote",
              "network": {
                  "allowlist": [
                      {
                          "domain": "storage.googleapis.com",
                          "transform": {
                              "Authorization": "Bearer INITIAL_TOKEN"
                          },
                      }
                  ]
              },
          },
      )

      # Later: refresh the token on the same environment
      result = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Now download the file reports/q1.csv from the same bucket.",
          environment={
              "type": "remote",
              "environment_id": first.environment_id,
              "network": {
                  "allowlist": [
                      {
                          "domain": "storage.googleapis.com",
                          "transform": {
                              "Authorization": "Bearer REFRESHED_TOKEN"
                          },
                      }
                  ]
              },
          },
      )

      print(result.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      // First interaction: use an initial token
      const first = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "List the files in gs://my-bucket/reports/ using the GCS JSON API.",
          environment: {
              type: "remote",
              network: {
                  allowlist: [
                      {
                          domain: "storage.googleapis.com",
                          transform: {
                              "Authorization": "Bearer INITIAL_TOKEN"
                          },
                      }
                  ]
              }
          },
      });

      // Later: refresh the token on the same environment
      const result = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Now download the file reports/q1.csv from the same bucket.",
          environment: {
              type: "remote",
              environment_id: first.environment_id,
              network: {
                  allowlist: [
                      {
                          domain: "storage.googleapis.com",
                          transform: {
                              "Authorization": "Bearer REFRESHED_TOKEN"
                          },
                      }
                  ]
              }
          },
      });

      console.log(result.output_text);
      ```

=== "REST"

      ```shell
      # Use the environment_id from a previous interaction
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Now download the file reports/q1.csv from the same bucket.",
          "environment": {
              "type": "remote",
              "environment_id": "<ENVIRONMENT_ID_FROM_PREVIOUS_INTERACTION>",
              "network": {
                  "allowlist": [
                      {
                          "domain": "storage.googleapis.com",
                          "transform": {
                              "Authorization": "Bearer REFRESHED_TOKEN"
                          }
                      }
                  ]
              }
          }
      }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.Allowlist;
      import com.google.genai.gaos.models.interactions.AllowlistEntry;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Environment;
      import com.google.genai.gaos.models.interactions.EnvironmentNetworkEgressAllowlist;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Network;
      import com.google.genai.gaos.models.interactions.Transform;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.List;
      import java.util.Map;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      // First interaction: use an initial token
      Environment initialEnv = Environment.builder()
          .network(Network.of(
              EnvironmentNetworkEgressAllowlist.builder()
                  .allowlist(Allowlist.of(List.of(
                      AllowlistEntry.builder()
                          .domain("storage.googleapis.com")
                          .transform(Transform.of(Map.of(
                              "Authorization", "Bearer INITIAL_TOKEN"
                          )))
                          .build()
                  )))
                  .build()
          ))
          .build();

      CreateAgentInteraction firstParams = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("List the files in gs://my-bucket/reports/ using the GCS JSON API."))
          .environment(CreateAgentInteractionEnvironment.of(initialEnv))
          .build();

      Interaction first = client.interactions.create(CreateInteractionRequestBody.of(firstParams)).interaction().get();

      // Later: refresh the token on the same environment
      Environment refreshedEnv = Environment.builder()
          .environmentId(first.environmentId().orElse(""))
          .network(Network.of(
              EnvironmentNetworkEgressAllowlist.builder()
                  .allowlist(Allowlist.of(List.of(
                      AllowlistEntry.builder()
                          .domain("storage.googleapis.com")
                          .transform(Transform.of(Map.of(
                              "Authorization", "Bearer REFRESHED_TOKEN"
                          )))
                          .build()
                  )))
                  .build()
          ))
          .build();

      CreateAgentInteraction secondParams = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Now download the file reports/q1.csv from the same bucket."))
          .environment(CreateAgentInteractionEnvironment.of(refreshedEnv))
          .build();

      Interaction result = client.interactions.create(CreateInteractionRequestBody.of(secondParams)).interaction().get();
      System.out.println(result.outputText().orElse(""));
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

          // First interaction: use an initial token
          initialEnv := interactions.Environment{
              Network: genai.Ptr(interactions.NewNetwork(interactions.EnvironmentNetworkEgressAllowlist{
                  Allowlist: genai.Ptr(interactions.NewAllowlist([]interactions.AllowlistEntry{
                      {
                          Domain: "storage.googleapis.com",
                          Transform: genai.Ptr(interactions.NewTransform(map[string]string{
                              "Authorization": "Bearer INITIAL_TOKEN",
                          })),
                      },
                  })),
              })),
          }

          firstRes, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("List the files in gs://my-bucket/reports/ using the GCS JSON API."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(initialEnv)),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          first := firstRes.Interaction

          // Later: refresh the token on the same environment
          refreshedEnv := interactions.Environment{
              EnvironmentID: first.EnvironmentID,
              Network: genai.Ptr(interactions.NewNetwork(interactions.EnvironmentNetworkEgressAllowlist{
                  Allowlist: genai.Ptr(interactions.NewAllowlist([]interactions.AllowlistEntry{
                      {
                          Domain: "storage.googleapis.com",
                          Transform: genai.Ptr(interactions.NewTransform(map[string]string{
                              "Authorization": "Bearer REFRESHED_TOKEN",
                          })),
                      },
                  })),
              })),
          }

          secondRes, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Now download the file reports/q1.csv from the same bucket."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(refreshedEnv)),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if secondRes.Interaction.OutputText != nil {
              fmt.Println(*secondRes.Interaction.OutputText)
          }
      }
      ```


## 環境生命週期 {#environment-lifecycle}

環境遵循以下生命週期：

| 狀態 | 行為 |
| :--- | :--- |
| **已建立** | 當互動指定 `environment: "remote"` 或設定物件時佈建。 |
| **使用中** | 互動進行期間持續運行。 |
| **閒置** | 閒置 15 分鐘後自動建立快照並停止。 |
| **離線** | 自上次使用中起保留 7 天。可傳入其 ID 來恢復。 |
| **已刪除** | 在 7 天 TTL 保留期到期後自動從系統移除，或在手動刪除時移除。 |

## Environments API {#environments-api}

您可以使用 Environments API 以程式化方式管理沙箱工作階段。
列舉環境能讓您找出使用中的工作階段 ID，並在用戶端連線
於長時間執行的工作期間中斷時恢復狀態。您也可以
檢視工作階段的中繼資料，並在工作流程
結束時明確刪除環境，不必等待 TTL 自動到期。

### 列出環境 {#list-environments}

列出屬於您專案的使用中環境。使用分頁參數
控制回應的批次大小。


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      response = client.environments.list(page_size=10)
      for env in response.environments:
          print(f"Environment ID: {env.id}, Status: {env.status}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const response = await client.environments.list({ page_size: 10 });
      for (const env of response.environments || []) {
          console.log(`Environment ID: ${env.id}, Status: ${env.status}`);
      }
      ```

=== "REST"

      ```shell
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/environments?pageSize=10" \
      -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.environments.Environment;
      import com.google.genai.gaos.models.environments.ListEnvironmentsResponse;
      import java.util.List;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      ListEnvironmentsResponse response = client.environments.listEnvironments()
          .pageSize(10)
          .call()
          .listEnvironmentsResponse()
          .get();

      for (Environment env : response.environments().orElse(List.of())) {
          System.out.println("Environment ID: " + env.id().orElse("") + ", Status: " + env.status().orElse(null));
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

          res, err := sdk.Environments.ListEnvironments(ctx, operations.ListEnvironmentsRequest{
              PageSize: genai.Ptr(10),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.ListEnvironmentsResponse != nil {
              for _, env := range res.ListEnvironmentsResponse.Environments {
                  fmt.Printf("Environment ID: %s, Status: %v\n", env.ID, env.Status)
              }
          }
      }
      ```


回應大致如下：

```json
{
  "environments": [
    {
      "id": "140128b2a13c12c00a5a0d8cf7af9469",
      "status": "active"
    },
    {
      "id": "362b738275a1d74af6f1c62bc050da73",
      "status": "active"
    }
  ],
  "next_page_token": "Cj...5aE="
}
```

### 取得環境 {#get-an-environment}

依資源名稱擷取特定環境的中繼資料與設定
詳細資訊。


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      env = client.environments.get(id="YOUR_ENVIRONMENT_ID")
      print(f"Environment ID: {env.id}, Status: {env.status}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const env = await client.environments.get("YOUR_ENVIRONMENT_ID");
      console.log(`Environment ID: ${env.id}, Status: ${env.status}`);
      ```

=== "REST"

      ```shell
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/environments/YOUR_ENVIRONMENT_ID" \
      -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.environments.Environment;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      Environment env = client.environments.getEnvironment("YOUR_ENVIRONMENT_ID").environment().get();
      System.out.println("Environment ID: " + env.id().orElse("") + ", Status: " + env.status().orElse(null));
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

          res, err := sdk.Environments.GetEnvironment(ctx, operations.GetEnvironmentRequest{
              ID: "YOUR_ENVIRONMENT_ID",
          })
          if err != nil {
              log.Fatal(err)
          }

          env := res.Environment
          fmt.Printf("Environment ID: %s, Status: %v\n", env.ID, env.Status)
      }
      ```


回應大致如下：

```json
{
  "id": "140128b2a13c12c00a5a0d8cf7af9469",
  "status": "active",
  "sources": [
    {
      "type": "repository",
      "source": "https://github.com/octocat/Spoon-Knife",
      "target": "/workspace/spoon-knife"
    }
  ],
  "network": {
    "allowlist": [
      {
        "domain": "api.github.com"
      },
      {
        "domain": "github.com"
      }
    ]
  }
}
```

### 刪除環境 {#delete-an-environment}

明確終止並刪除環境，在您的工作或管線
完成時清理沙箱資源。


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      client.environments.delete(id="YOUR_ENVIRONMENT_ID")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      await client.environments.delete("YOUR_ENVIRONMENT_ID");
      ```

=== "REST"

      ```shell
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/environments/YOUR_ENVIRONMENT_ID" \
      -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      client.environments.deleteEnvironment("YOUR_ENVIRONMENT_ID");
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

          _, err := sdk.Environments.DeleteEnvironment(ctx, operations.DeleteEnvironmentRequest{
              ID: "YOUR_ENVIRONMENT_ID",
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```


## 管理環境中的檔案 {#download-files-from-the-environment}

代理會在執行期間於沙箱內建立並修改檔案。您可以
瀏覽目錄內容、取得檔案中繼資料、下載個別檔案，或將
整個目錄下載為 tar 封存檔，也可以上傳檔案或將封存檔解壓縮，
直接放入環境中。沙箱環境的儲存空間
受合理使用限制約束。

### 列出目錄中的檔案 {#list-files-in-a-directory}

列出環境中某個目錄的內容。預設列出根
目錄。

#### 查詢參數

| 參數 | 類型 | 說明 |
| :--- | :--- | :--- |
| `recursive` | boolean | 為 `true` 時，遞迴列出所有檔案與目錄。預設值：`false`。 |


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # List root directory
      response = client.environments.files.list(
          environment="YOUR_ENVIRONMENT_ID",
          path="",
      )
      for file in response.files:
          print(f"{file.name} ({file.type}) - {file.path}")

      # List a subdirectory recursively
      response = client.environments.files.list(
          environment="YOUR_ENVIRONMENT_ID",
          path="src",
          recursive=True,
      )
      for file in response.files:
          print(f"{file.name} ({file.type}) - {file.path}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      // List root directory
      const response = await client.environments.files.list({
          environment: "YOUR_ENVIRONMENT_ID",
          path: "",
      });
      for (const file of response.files || []) {
          console.log(`${file.name} (${file.type}) - ${file.path}`);
      }

      // List a subdirectory recursively
      const srcResponse = await client.environments.files.list({
          environment: "YOUR_ENVIRONMENT_ID",
          path: "src",
          recursive: true,
      });
      for (const file of srcResponse.files || []) {
          console.log(`${file.name} (${file.type}) - ${file.path}`);
      }
      ```

=== "REST"

      ```shell
      # List root directory
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/environments/$ENV_ID/files" \
        -H "x-goog-api-key: $GEMINI_API_KEY"

      # List a subdirectory
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/environments/$ENV_ID/files/src" \
        -H "x-goog-api-key: $GEMINI_API_KEY"

      # List all files recursively
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/environments/$ENV_ID/files?recursive=true" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


回應會傳回 `files` 陣列，其中包含每個項目的中繼資料：

```json
{
  "files": [
    {
      "name": "config",
      "path": "config",
      "type": "DIRECTORY",
      "created": "2026-08-12T07:44:18Z",
      "modified": "2026-08-12T07:44:18Z"
    },
    {
      "name": "main.py",
      "path": "src/main.py",
      "type": "FILE",
      "size_bytes": "15",
      "mime_type": "text/x-python; charset=utf-8",
      "created": "2026-08-12T07:44:20Z",
      "modified": "2026-08-12T07:44:20Z"
    }
  ]
}
```

#### 檔案項目欄位

| 欄位 | 類型 | 說明 |
| :--- | :--- | :--- |
| `name` | string | 檔案或目錄名稱。 |
| `path` | string | 相對於環境根目錄的完整路徑。 |
| `type` | string | `FILE` 或 `DIRECTORY`。 |
| `size_bytes` | string | 檔案大小（以位元組計，僅限檔案）。 |
| `mime_type` | string | MIME 類型（僅限檔案）。 |
| `created` | string | ISO 8601 建立時間戳記。 |
| `modified` | string | ISO 8601 最後修改時間戳記。 |

### 取得檔案中繼資料 {#get-file-metadata}

依路徑取得特定檔案的中繼資料。


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      response = client.environments.files.list(
          environment="YOUR_ENVIRONMENT_ID",
          path="src/main.py",
      )
      file = response.files[0]
      print(f"Name: {file.name}, Size: {file.size_bytes} bytes, Type: {file.mime_type}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const response = await client.environments.files.list({
          environment: "YOUR_ENVIRONMENT_ID",
          path: "src/main.py",
      });
      const file = response.files?.[0];
      if (file) {
          console.log(`Name: ${file.name}, Size: ${file.size_bytes} bytes, Type: ${file.mime_type}`);
      }
      ```

=== "REST"

      ```shell
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/environments/$ENV_ID/files/src/main.py" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


回應會傳回檔案中繼資料，並包裝在 `files` 陣列中：

```json
{
  "files": [
    {
      "name": "main.py",
      "path": "src/main.py",
      "type": "FILE",
      "size_bytes": "15",
      "mime_type": "text/x-python; charset=utf-8",
      "created": "2026-08-12T07:44:20Z",
      "modified": "2026-08-12T07:44:20Z"
    }
  ]
}
```

如果檔案不存在，API 會傳回 `404` 錯誤：

```json
{
  "error": {
    "message": "Path 'nonexistent.txt' not found in environment 'ENV_ID'.",
    "code": "not_found"
  }
}
```

### 下載單一檔案 {#download-a-single-file}

下載特定檔案的內容。在 SDK 中使用 `download()`
方法；在 REST 要求中，將 `?alt=media` 查詢參數附加到檔案
路徑。伺服器會回應 `200 OK`，並串流傳送原始檔案內容。


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      content = client.environments.files.download(
          environment="YOUR_ENVIRONMENT_ID",
          path="src/main.py",
      )

      with open("main.py", "wb") as f:
          f.write(content)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "fs";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const bytes = await client.environments.files.download({
          environment: "YOUR_ENVIRONMENT_ID",
          path: "src/main.py",
      });

      fs.writeFileSync("main.py", Buffer.from(bytes));
      ```

=== "REST"

      ```shell
      curl -L -X GET "https://generativelanguage.googleapis.com/v1beta/environments/$ENV_ID/files/src/main.py?alt=media" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -o main.py
      ```


### 將目錄下載為 tar 封存檔 {#download-a-directory-as-a-tar-archive}

透過以 `?alt=media` 要求目錄路徑，將整個目錄下載為 tar 封存檔。
這會傳回 POSIX tar 檔案（未經 gzip 壓縮）。使用
`recursive=true` 可包含巢狀子目錄。


=== "Python"

      ```py
      import tarfile
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # Download a subdirectory archive
      archive = client.environments.files.download(
          environment="YOUR_ENVIRONMENT_ID",
          path="src",
      )

      with open("src.tar", "wb") as f:
          f.write(archive)

      with tarfile.open("src.tar") as tar:
          tar.extractall(path="./extracted")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import { execSync } from "child_process";
      import * as fs from "fs";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      // Download a subdirectory archive
      const bytes = await client.environments.files.download({
          environment: "YOUR_ENVIRONMENT_ID",
          path: "src",
      });

      fs.writeFileSync("src.tar", Buffer.from(bytes));
      execSync("tar -xf src.tar -C ./extracted");
      ```

=== "REST"

      ```shell
      # Download a subdirectory (top-level files only)
      curl -L -X GET "https://generativelanguage.googleapis.com/v1beta/environments/$ENV_ID/files/src?alt=media" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -o src.tar

      # Download a subdirectory recursively (includes nested directories)
      curl -L -X GET "https://generativelanguage.googleapis.com/v1beta/environments/$ENV_ID/files/config?alt=media&recursive=true" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -o config.tar

      # Download root directory
      curl -L -X GET "https://generativelanguage.googleapis.com/v1beta/environments/$ENV_ID/files?alt=media" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -o snapshot.tar

      # Extract the archive
      tar xf snapshot.tar -C ./extracted
      ```


#### 行為對照表

下列行為對照表彙整了檔案與目錄端點、HTTP 方法與查詢參數組合下，預期的回應與封存行為：

| 要求 | `alt` | `recursive` | `extract` | `overwrite` | 回應 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET /files` | （無） | （無） | - | - | 根目錄的 JSON 清單 |
| `GET /files/{path}`（檔案） | （無） | - | - | - | 檔案的 JSON 中繼資料 |
| `GET /files/{path}`（目錄） | （無） | `false` | - | - | 直接子項目的 JSON 清單 |
| `GET /files/{path}`（目錄） | （無） | `true` | - | - | 所有子孫項目的 JSON 清單 |
| `GET /files/{path}?alt=media`（檔案） | `media` | - | - | - | 原始檔案內容 |
| `GET /files/{path}?alt=media`（目錄） | `media` | `false` | - | - | 目錄中直接檔案的 tar 封存檔 |
| `GET /files/{path}?alt=media`（目錄） | `media` | `true` | - | - | 遞迴包含所有檔案的 tar 封存檔 |
| `GET /files?alt=media` | `media` | `false` | - | - | 僅根層級檔案的 tar 封存檔 |
| `PUT /files/{path}`（檔案） | - | - | `false` | `false` | 將檔案寫入該路徑。若已存在，傳回 `409 Conflict` |
| `PUT /files/{path}?overwrite=true` | - | - | `false` | `true` | 將檔案寫入或覆寫至該路徑 |
| `PUT /files/{path}?extract=true` | - | - | `true` | `false` | 將封存檔解壓縮到目標目錄。若有任何目標檔案已存在，傳回 `409 Conflict` |
| `PUT /files/{path}?extract=true&overwrite=true` | - | - | `true` | `true` | 解壓縮封存檔，取代任何既有檔案 |

### 上傳檔案到環境 {#upload-a-file}

使用 HTTP `PUT` 將個別檔案或目錄封存檔直接上傳到既有
環境沙箱。父目錄若不存在，
會自動建立。環境的儲存空間受合理使用限制約束。

注意：REST 上傳使用 `/upload/` 路徑前綴，例如
`https://generativelanguage.googleapis.com/upload/v1beta/environments/{environment_id}/files/{path}`。
未帶前綴送出的 `PUT` 會傳回 `400` 錯誤。Python 與 JavaScript
用戶端會自動為您加上前綴。

#### 上傳單一檔案


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      with open("local_file.txt", "rb") as f:
          result = client.environments.files.upload(
              environment="YOUR_ENVIRONMENT_ID",
              path="workspace/data/file.txt",
              file=f,
              mime_type="text/plain",
              overwrite=True,
          )

      file = result.files[0]
      print(f"Uploaded: {file.name} ({file.size_bytes} bytes)")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "fs";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const content = fs.readFileSync("local_file.txt");
      const result = await client.environments.files.upload({
          environment: "YOUR_ENVIRONMENT_ID",
          path: "workspace/data/file.txt",
          file: content,
          mime_type: "text/plain",
          overwrite: true,
      });

      const file = result.files[0];
      console.log(`Uploaded: ${file.name} (${file.size_bytes} bytes)`);
      ```

=== "REST"

      ```shell
      curl -X PUT "https://generativelanguage.googleapis.com/upload/v1beta/environments/$ENV_ID/files/workspace/data/file.txt" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: text/plain" \
        --data-binary @local_file.txt
      ```


回應會傳回上傳檔案的中繼資料，並包裝在 `files` 陣列中，
以與清單與取得端點保持一致：

```json
{
  "files": [
    {
      "name": "file.txt",
      "path": "workspace/data/file.txt",
      "type": "FILE",
      "size_bytes": "1024",
      "mime_type": "text/plain"
    }
  ]
}
```

#### 上傳並解壓縮目錄封存檔

若要在單次要求中放入整個程式碼庫或目錄結構，請上傳
`.tar` 或 `.tar.gz` 封存檔，並設定 `extract=true`。


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      with open("source.tar.gz", "rb") as f:
          result = client.environments.files.upload(
              environment="YOUR_ENVIRONMENT_ID",
              path="workspace/src/",
              file=f,
              extract=True,
          )

      for entry in result.files:
          print(f"Extracted: {entry.path}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "fs";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const archive = fs.readFileSync("source.tar.gz");
      const result = await client.environments.files.upload({
          environment: "YOUR_ENVIRONMENT_ID",
          path: "workspace/src/",
          file: archive,
          extract: true,
      });

      for (const entry of result.files) {
          console.log(`Extracted: ${entry.path}`);
      }
      ```

=== "REST"

      ```shell
      curl -X PUT "https://generativelanguage.googleapis.com/upload/v1beta/environments/$ENV_ID/files/workspace/src/?extract=true" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/x-tar" \
        --data-binary @source.tar.gz
      ```


回應會列出封存檔寫入的每個檔案：

```json
{
  "files": [
    {
      "name": "app.py",
      "path": "workspace/src/app.py",
      "type": "FILE",
      "size_bytes": "15",
      "mime_type": "text/x-python"
    },
    {
      "name": "requirements.txt",
      "path": "workspace/src/requirements.txt",
      "type": "FILE",
      "size_bytes": "17",
      "mime_type": "text/plain"
    }
  ]
}
```

注意：系統會從酬載本身偵測封存格式，因此 `.tar` 與
`.tar.gz` 都能正常運作，無論您送出的 `Content-Type` 為何。

#### 以可續傳工作階段上傳大型檔案

對於大型酬載，或在連線不穩定的情況下上傳時，請使用
可續傳工作階段，不要在單次要求中送出整個主體。可續傳
上傳會將傳輸切分為可個別重試的區塊，因此即使
中途失敗，也不必從頭開始。

先以 `uploadType=resumable` 啟動工作階段。送出空白主體，
並使用 `X-Upload-Content-Type` 與 `X-Upload-Content-Length` 標頭，
宣告您要上傳之酬載的媒體類型與總大小：

```http
PUT /upload/v1beta/environments/$ENV_ID/files/workspace/data/large_dataset.bin?uploadType=resumable HTTP/1.1
Host: generativelanguage.googleapis.com
X-Upload-Content-Type: application/octet-stream
X-Upload-Content-Length: 20971520
Content-Length: 0
x-goog-api-key: $GEMINI_API_KEY
```

回應會在 `Location` 標頭中帶有工作階段 URL。此 URL 已
包含 `upload_id`，因此不需要再次提供 API 金鑰：

```http
HTTP/1.1 200 OK
Location: https://generativelanguage.googleapis.com/upload/v1beta/environments/$ENV_ID/files/workspace/data/large_dataset.bin?uploadType=resumable&upload_id=AJjja9bfHjiYlGi60pUazCaTuPY
Content-Length: 0
```

將酬載分塊上傳至該 URL。每個區塊會以 `Content-Range` 標頭宣告其位元組範圍
與總大小：

```http
PUT /upload/v1beta/environments/$ENV_ID/files/workspace/data/large_dataset.bin?uploadType=resumable&upload_id=AJjja9bfHjiYlGi60pUazCaTuPY HTTP/1.1
Host: generativelanguage.googleapis.com
Content-Type: application/octet-stream
Content-Range: bytes 0-10485759/20971520
Content-Length: 10485760

<10 MB binary payload>
```

除最後一個區塊外，每個區塊都會傳回 `308 Resume Incomplete`。`Range` 標頭
會告訴您伺服器已提交了多少位元組，若某個區塊失敗，
就從該處續傳：

```http
HTTP/1.1 308 Resume Incomplete
Range: bytes=0-10485759
Content-Length: 0
```

以相同方式送出其餘區塊：

```http
PUT /upload/v1beta/environments/$ENV_ID/files/workspace/data/large_dataset.bin?uploadType=resumable&upload_id=AJjja9bfHjiYlGi60pUazCaTuPY HTTP/1.1
Host: generativelanguage.googleapis.com
Content-Type: application/octet-stream
Content-Range: bytes 10485760-20971519/20971520
Content-Length: 10485760

<remaining 10 MB binary payload>
```

最後一個區塊會完成上傳並傳回檔案中繼資料，格式與單次上傳相同，
採用相同的 `files` 包裝：

```json
{
  "files": [
    {
      "name": "large_dataset.bin",
      "path": "workspace/data/large_dataset.bin",
      "type": "FILE",
      "size_bytes": "20971520",
      "mime_type": "application/octet-stream"
    }
  ]
}
```

可續傳工作階段同樣適用於 `extract` 與 `overwrite`。請在啟動要求上設定這些查詢
參數，不要設定在個別區塊上。

#### 覆寫保護

預設情況下，`overwrite` 為 `false`。如果目標路徑已存在，
要求會傳回 `409 Conflict` 錯誤，且不會寫入任何內容：

```json
{
  "error": {
    "message": "Requested entity already exists",
    "code": "aborted"
  }
}
```

若要取代既有檔案或目錄，請設定 `overwrite=true`（或在 REST 中附加
`?overwrite=true`）。搭配 `extract=true` 時，衝突檢查會套用到
封存檔中的每個檔案，因此只要有任何目標檔案已存在，要求就會失敗。

### 下載完整快照（已淘汰） {#download-full-snapshot-deprecated}

注意：舊版 `/files/environment-{id}:download` 端點已淘汰。請改用 [環境檔案端點](/docs/agent-environment/#download-a-directory-as-a-tar-archive) 下載目錄或個別檔案。

若要將既有程式碼遷移到環境檔案 API：

*   **Python**：將舊版檔案下載要求改為：

    ```py
    archive = client.environments.files.download(
        environment="YOUR_ENVIRONMENT_ID",
        path="workspace",
    )
    with open("snapshot.tar", "wb") as f:
        f.write(archive)
    ```

*   **JavaScript**：將舊版檔案下載要求改為：

    ```javascript
    const bytes = await client.environments.files.download({
        environment: "YOUR_ENVIRONMENT_ID",
        path: "workspace",
    });
    fs.writeFileSync("snapshot.tar", Buffer.from(bytes));
    ```

*   **REST**：將 `GET /v1beta/files/environment-$ENV_ID:download?alt=media` 改為：

    ```shell
    curl -L -X GET "https://generativelanguage.googleapis.com/v1beta/environments/$ENV_ID/files?alt=media" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -o snapshot.tar
    ```


## 自行代管環境 {#self-hosted-environments}

除了使用 Google 代管的沙箱，您也可以連接自行代管
環境，讓受管理代理在您掌控的運算
基礎架構內執行工具。您的沙箱透過外送 HTTPS 連線，使用開放原始碼的
[Gemini API CLI](/docs/cli/)，且不需要開啟任何入站防火牆
連接埠。

連接自行代管環境的步驟如下：

1.  執行 `gemini-api environments create --mode self_hosted`（或呼叫
    `POST /v1beta/environments` 並帶入 `{"mode": "self_hosted"}`），取得
    環境 `id` 與一次性 `environment_key`。
2.  在您的沙箱內執行 `gemini-api environments connect`（來自
    [`google-gemini/gemini-api-cli`](https://github.com/google-gemini/gemini-api-cli)），
    並使用該 `environment_key`。
3.  將該環境的 `id` 傳入 `environment`，再呼叫
    `interactions.create`。

**注意**：託管沙箱選項（`sources`、`network`、`env` 與 `/files`
快照）僅適用於 Google 代管環境。自行代管環境
會以 `400 INVALID_ARGUMENT` 拒絕這些選項。

以下範例說明如何連接沙箱供應商：

*   [Google Cloud Run](https://github.com/google-gemini/gemini-api-cli/tree/main/docs/self-hosted/providers/cloud-run)
*   [Agent Substrate](https://github.com/google-gemini/gemini-api-cli/tree/main/docs/self-hosted/agent-substrate)
*   [Cloudflare Sandbox](https://github.com/google-gemini/gemini-api-cli/tree/main/docs/self-hosted/providers/cloudflare)
*   [Daytona](https://github.com/google-gemini/gemini-api-cli/tree/main/docs/self-hosted/providers/daytona)
*   [E2B](https://github.com/google-gemini/gemini-api-cli/tree/main/docs/self-hosted/providers/e2b)
*   [Fly.io (Sprites and Machines)](https://github.com/google-gemini/gemini-api-cli/tree/main/docs/self-hosted/providers/fly-machines)
*   [Modal](https://github.com/google-gemini/gemini-api-cli/tree/main/docs/self-hosted/providers/modal)
*   [Vercel Sandbox](https://github.com/google-gemini/gemini-api-cli/tree/main/docs/self-hosted/providers/vercel)

您也可以在
[Docker or rootless Podman](https://github.com/google-gemini/gemini-api-cli/tree/main/docs/self-hosted/containers) 中執行執行階段。
若要進行測試，您可以
在[本機](https://github.com/google-gemini/gemini-api-cli/tree/main/docs/self-hosted/local)執行。
本機模式會直接在您的主機上執行 `execute_bash`，除非您傳入
`--disable-bash`。設定說明請參閱
[自行代管環境指南](https://github.com/google-gemini/gemini-api-cli/tree/main/docs/self-hosted)，
該指南也包含參考架構與
部署資訊清單。

## 定價與資源 {#pricing-resources}

每個 Google 代管環境都以固定的 CPU 與記憶體配置運行。
在預覽期間，Google 不會針對代管環境的運算收費。
代理 token 費用請參閱[定價](/docs/pricing/#pricing-for-agents)。

## 限制 {#limitations}

- **預覽狀態**：環境與受管理代理目前為預覽版。功能與結構定義可能變更。
- **內嵌來源大小**：內嵌來源每個檔案上限為 1 MB，所有檔案總計上限為 2 MB。
- **來源大小**：Git 存放庫上限為 500 MB，Cloud Storage 存放庫上限為 2 GB。
- **環境啟動**：佈建新環境最多約需 5 秒。大型來源存放庫可能拉長此時間。
- **環境到期**：未使用中的離線環境會保留 7
  天，之後透過自動 TTL 清理到期失效。傳入已到期或
  無效的環境 ID 會傳回 `404 Not Found` 錯誤。
- **檔案支援**：代理目前僅能讀取文字與圖片檔案，尚未支援二進位檔案。
- **不可從根目錄掛載**：新增自訂來源時，您不能將根目錄（`/`）設為 target，必須一律指定子目錄。

## 後續步驟 {#whats-next}

*   [代理總覽](/docs/agents/)：了解受管理代理的核心概念。
*   [快速入門](/docs/managed-agents-quickstart/)：開始建立多輪對話與串流功能。
*   [Antigravity Agent](/docs/antigravity-agent/)：探索預設代理的功能、工具、模型選擇與定價。
*   [建立自訂代理](/docs/custom-agents/)：使用 `AGENTS.md` 與 `SKILL.md` 定義您自己的代理。
*   [Hooks](/docs/agent-hooks/)：在沙箱內強制套用安全防護措施並執行副作用驗證。

