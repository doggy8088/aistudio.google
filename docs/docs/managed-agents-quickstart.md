# 受管代理快速入門

本指南將帶你使用 [Antigravity 代理](/docs/antigravity-agent/)，在 Gemini API 上建立並使用 Managed Agents。你將完成第一次代理呼叫、延續多輪對話、串流回應、從沙箱下載檔案，並實際操作 Antigravity 受管代理。

## 執行第一次代理互動 {#run-your-first-agent-interaction}

只要呼叫一次 [Interactions API](/docs/)，系統就會佈建 Linux 沙箱、執行代理迴圈並回傳結果。你需要定義三個參數：

* 將 `agent` 傳入為 `"antigravity-preview-09-2026"`，這是目前預先定義的通用型受管代理版本。
* 將 `environment="remote"` 定義為佈建全新的沙箱環境。
* 建立輸入內容，說明你希望代理執行的任務。


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Write a Python script that generates the first 20 Fibonacci numbers and saves them to fibonacci.txt. Then read the file and print its contents.",
          environment="remote",
      )

      # Print the agent's final output
      print(f"Interaction ID: {interaction.id}")
      print(f"Environment ID: {interaction.environment_id}")
      print(f"Output: {interaction.output_text}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Write a Python script that generates the first 20 Fibonacci numbers and saves them to fibonacci.txt. Then read the file and print its contents.",
          environment: "remote",
      });

      console.log(`Interaction ID: ${interaction.id}`);
      console.log(`Environment ID: ${interaction.environment_id}`);

      console.log(`Output: ${interaction.output_text}`);
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
          .input(InteractionsInput.of("Write a Python script that generates the first 20 Fibonacci numbers and saves them to fibonacci.txt. Then read the file and print its contents."))
          .environment(CreateAgentInteractionEnvironment.of("remote"))
          .build();

      Interaction interaction = client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      // Print the agent's final output
      System.out.println("Interaction ID: " + interaction.id().orElse(""));
      System.out.println("Environment ID: " + interaction.environmentId().orElse(""));
      System.out.println("Output: " + interaction.outputText().orElse(""));
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
                  Input:       interactions.NewInteractionsInput("Write a Python script that generates the first 20 Fibonacci numbers and saves them to fibonacci.txt. Then read the file and print its contents."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment("remote")),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          interaction := res.Interaction
          // Print the agent's final output
          fmt.Printf("Interaction ID: %s\n", *interaction.ID)
          fmt.Printf("Environment ID: %s\n", *interaction.EnvironmentID)
          fmt.Printf("Output: %s\n", *interaction.OutputText)
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": [{"type": "text", "text": "Write a Python script that generates the first 20 Fibonacci numbers and saves them to fibonacci.txt. Then read the file and print its contents."}],
          "environment": {"type": "remote"}
      }'
      ```


回應會回傳一個 `Interaction` 物件。請儲存 `interaction.id` 與
`interaction.environment_id`，以便在同一個沙箱中延續對話。
使用 `interaction.output_text` 取得代理的最終回應。
`interaction.steps` 會列出代理執行的每個步驟（推理、工具呼叫、程式碼執行）。

## 延續對話（多輪） {#continue-conversation}

API 會追蹤兩個彼此獨立的狀態面向：

- **對話上下文**：聊天記錄、推理軌跡、工具使用，透過 `previous_interaction_id` 管理。
- [**環境狀態**：](/docs/agent-environment/)檔案、已安裝的套件與沙箱狀態，透過 `environment` 管理。

將兩者分別傳入對應位置，即可繼續先前的工作：


=== "Python"

      ```py
      interaction_2 = client.interactions.create(
          agent="antigravity-preview-09-2026",
          previous_interaction_id=interaction.id,
          environment=interaction.environment_id,
          input="Now plot the Fibonacci sequence as a line chart and save it as chart.png.",
      )

      print(interaction_2.output_text)
      ```

=== "JavaScript"

      ```javascript
      const interaction2 = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          previous_interaction_id: interaction.id,
          environment: interaction.environment_id,
          input: "Now plot the Fibonacci sequence as a line chart and save it as chart.png.",
      }, { timeout: 300_000 });

      console.log(interaction2.output_text);
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
      String interactionId = "INTERACTION_ID";
      String environmentId = "ENVIRONMENT_ID";

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .previousInteractionId(interactionId)
          .environment(CreateAgentInteractionEnvironment.of(environmentId))
          .input(InteractionsInput.of("Now plot the Fibonacci sequence as a line chart and save it as chart.png."))
          .build();

      Interaction interaction2 = client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      System.out.println(interaction2.outputText().orElse(""));
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:                 interactions.AgentOption("antigravity-preview-09-2026"),
                  PreviousInteractionID: genai.Ptr(interactionID),
                  Environment:           genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(environmentID)),
                  Input:                 interactions.NewInteractionsInput("Now plot the Fibonacci sequence as a line chart and save it as chart.png."),
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
          "previous_interaction_id": "interaction_id_from_step_1",
          "environment": "environment_id_from_step_1",
          "input": [{"type": "text", "text": "Now plot the Fibonacci sequence as a line chart and save it as chart.png."}]
      }'
      ```


第 1 輪產生的檔案（`fibonacci.txt`）會保留到第 2 輪，代理也會保留對話上下文。

你可以依需求獨立組合這兩個面向：

- **清除對話、保留檔案**：省略 `previous_interaction_id`，僅透過 `environment` 傳入環境 ID，即可在同一個工作區開啟全新對話。
- **保留對話、使用新工作區**：傳入 `previous_interaction_id`，並將 `environment="remote"` 設定為全新的沙箱。

### 自動上下文壓縮 {#automatic-context-compaction}

在長時間執行的多輪對話中，推理步驟、工具呼叫與大型檔案內容的原始記錄會快速累積，佔用大量上下文空間。為避免 token 上限錯誤並維持代理的專注度（防止「上下文腐化」），Managed Agents API 內建原生上下文壓縮步驟，會在大約 135k token 時自動執行。

## 串流回應 {#stream-response}

對於長時間執行的任務，你可以串流回應，即時查看代理的工作過程：


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      stream = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Read Hacker News, summarize the top 5 stories, and save the results as a PDF.",
          environment="remote",
          stream=True,
      )

      for event in stream:
          print(event)
          if event.event_type == "step.stop" and event.usage:
              print(event.usage)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const stream = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Read Hacker News, summarize the top 5 stories, and save the results as a PDF.",
          environment: "remote",
          stream: true,
      });

      for await (const event of stream) {
          console.log(event);
          if (event.event_type === "step.stop" && event.usage) {
              console.log(event.usage);
          }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.InteractionSSEStreamEvent;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.StepStop;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.utils.EventStream;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Read Hacker News, summarize the top 5 stories, and save the results as a PDF."))
          .environment(CreateAgentInteractionEnvironment.of("remote"))
          .stream(true)
          .build();

      try (EventStream<InteractionSSEStreamEvent> stream =
          client.interactions.create(CreateInteractionRequestBody.of(params)).events()) {
        for (InteractionSSEStreamEvent event : stream) {
          System.out.println(event);
          if (event.data().isPresent() && event.data().get() instanceof StepStop stepStop) {
            stepStop.usage().ifPresent(System.out::println);
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
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Read Hacker News, summarize the top 5 stories, and save the results as a PDF."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment("remote")),
                  Stream:      genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          stream := res.InteractionSSEStreamEvent
          defer stream.Close()

          for stream.Next() {
              event := stream.Value()
              fmt.Printf("%+v\n", event)
              if stepStop := event.GetDataStepStop(); stepStop != nil && stepStop.Usage != nil {
                  fmt.Printf("%+v\n", stepStop.Usage)
              }
          }
          if err := stream.Err(); err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```shell
      curl -N -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Read Hacker News, summarize the top 5 stories, and save the results as a PDF.",
          "environment": "remote",
          "stream": true
      }'
      ```


串流會以步驟差異的形式回傳漸進式更新。當某個步驟完成時，
`step.stop` 事件會包含累計的使用統計。詳情請參閱
[串流指南](/docs/streaming/)。

## 從環境下載檔案 {#download-files}

當代理在沙箱內建立檔案時，可透過 Files API 以直接 HTTP 要求下載這些檔案（目前尚無 SDK 方法）：


=== "Python"

      ```py
      import os
      import requests
      import tarfile

      env_id = interaction.environment_id
      api_key = os.environ["GEMINI_API_KEY"]

      response = requests.get(
          f"https://generativelanguage.googleapis.com/v1beta/files/environment-{env_id}:download",
          params={"alt": "media"},
          headers={"x-goog-api-key": api_key},
          allow_redirects=True,
      )

      with open("snapshot.tar", "wb") as f:
          f.write(response.content)

      with tarfile.open("snapshot.tar") as tar:
          tar.extractall(path="extracted_snapshot")
      ```

=== "JavaScript"

      ```javascript
      import fs from "fs";
      import { execSync } from "child_process";

      const envId = interaction.environment_id;
      const apiKey = process.env.GEMINI_API_KEY || "";

      const url = `https://generativelanguage.googleapis.com/v1beta/files/environment-${envId}:download?alt=media`;
      const response = await fetch(url, {
          headers: {
              "x-goog-api-key": apiKey,
          },
      });

      if (!response.ok) {
          throw new Error(`Failed to download file: ${response.statusText}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync("snapshot.tar", buffer);

      if (!fs.existsSync("extracted_snapshot")) {
          fs.mkdirSync("extracted_snapshot");
      }
      execSync("tar -xf snapshot.tar -C extracted_snapshot");

      console.log(fs.readdirSync("extracted_snapshot"));
      ```

=== "Java"

      ```java
      import java.net.URI;
      import java.net.http.HttpClient;
      import java.net.http.HttpRequest;
      import java.net.http.HttpResponse;
      import java.nio.file.Files;
      import java.nio.file.Paths;

      String envId = "ENVIRONMENT_ID";
      String apiKey = System.getenv("GEMINI_API_KEY");

      HttpClient httpClient = HttpClient.newBuilder()
          .followRedirects(HttpClient.Redirect.NORMAL)
          .build();

      HttpRequest request = HttpRequest.newBuilder()
          .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/files/environment-" + envId + ":download?alt=media"))
          .header("x-goog-api-key", apiKey)
          .GET()
          .build();

      HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
      Files.write(Paths.get("snapshot.tar"), response.body());
      System.out.println("Saved snapshot to snapshot.tar");
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "io"
          "log"
          "net/http"
          "os"
      )

      func main() {
          ctx := context.Background()
          envID := "ENVIRONMENT_ID"
          apiKey := os.Getenv("GEMINI_API_KEY")

          url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/files/environment-%s:download?alt=media", envID)
          req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
          if err != nil {
              log.Fatal(err)
          }
          req.Header.Set("x-goog-api-key", apiKey)

          resp, err := http.DefaultClient.Do(req)
          if err != nil {
              log.Fatal(err)
          }
          defer resp.Body.Close()

          data, err := io.ReadAll(resp.Body)
          if err != nil {
              log.Fatal(err)
          }
          if err := os.WriteFile("snapshot.tar", data, 0644); err != nil {
              log.Fatal(err)
          }
          fmt.Println("Saved snapshot to snapshot.tar")
      }
      ```

=== "REST"

      ```shell
      ENV_ID="your_environment_id_here"

      curl -L -X GET "https://generativelanguage.googleapis.com/v1beta/files/environment-$ENV_ID:download?alt=media" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -o snapshot.tar

      mkdir -p extracted_snapshot
      tar -xf snapshot.tar -C extracted_snapshot
      ```


## 儲存受管代理 {#save-managed-agent}

在前面的步驟中，我們使用預設的 Antigravity 代理，並以內嵌方式自訂設定。當你反覆調整好設定（指令、技能、模型選擇與環境）後，就可以將其儲存為可重複使用的受管代理。如此一來，你便能以 ID 呼叫代理，無須每次重複設定。

儲存代理時，請留意其架構與內嵌互動的對稱性：你會指定 `base_agent: "antigravity-preview-09-2026"`，並可傳入 `agent_config`，其中包含你所選的 `model`，做法與在
`interactions.create` 上相同。你還需要定義 `base_environment`（可從來源建立，或從既有環境分岔）。代理在每次新的互動中，都會使用這個環境與模型設定。

**從來源建立**：以內嵌方式定義來源，或使用 GitHub、Cloud Storage 等其他來源。


=== "Python"

      ```py
      agent = client.agents.create(
          id="fibonacci-analyst",
          base_agent="antigravity-preview-09-2026",
          agent_config={
              "type": "antigravity",
              "model": "gemini-4-hydrogen",
          },
          system_instruction="You are a math analysis agent. Generate sequences, visualize them, and export results as PDF reports.",
          base_environment={
              "type": "remote",
              "sources": [
                  {
                      "type": "inline",
                      "target": ".agents/AGENTS.md",
                      "content": "Always include a chart and a summary table in your reports.",
                  },
                  {
                      "type": "repository",
                      "source": "https://github.com/your-org/skills",
                      "target": ".agents/skills"
                  }
              ],
          },
      )

      print(f"Saved agent: {agent.id}")
      ```

=== "JavaScript"

      ```javascript
      const agent = await client.agents.create({
          id: "fibonacci-analyst",
          base_agent: "antigravity-preview-09-2026",
          agent_config: {
              type: "antigravity",
              model: "gemini-4-hydrogen",
          },
          system_instruction: "You are a math analysis agent. Generate sequences, visualize them, and export results as PDF reports.",
          base_environment: {
              type: "remote",
              sources: [
                  {
                      type: "inline",
                      target: ".agents/AGENTS.md",
                      content: "Always include a chart and a summary table in your reports.",
                  },
                  {
                      type: "repository",
                      source: "https://github.com/your-org/skills",
                      target: ".agents/skills"
                  }
              ],
          },
      });

      console.log(`Saved agent: ${agent.id}`);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.agents.Agent;
      import com.google.genai.gaos.models.agents.AgentConfig;
      import com.google.genai.gaos.models.agents.BaseEnvironment;
      import com.google.genai.gaos.models.interactions.AntigravityAgentConfig;
      import com.google.genai.gaos.models.interactions.Environment;
      import com.google.genai.gaos.models.interactions.Source;
      import com.google.genai.gaos.models.interactions.SourceType;
      import java.util.List;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      Environment env = Environment.builder()
          .sources(List.of(
              Source.builder()
                  .type(SourceType.INLINE)
                  .target(".agents/AGENTS.md")
                  .content("Always include a chart and a summary table in your reports.")
                  .build(),
              Source.builder()
                  .type(SourceType.REPOSITORY)
                  .source("https://github.com/your-org/skills")
                  .target(".agents/skills")
                  .build()
          ))
          .build();

      Agent agentParams = Agent.builder()
          .id("fibonacci-analyst")
          .baseAgent("antigravity-preview-09-2026")
          .agentConfig(AgentConfig.of(
              AntigravityAgentConfig.builder()
                  .model("gemini-4-hydrogen")
                  .build()
          ))
          .systemInstruction("You are a math analysis agent. Generate sequences, visualize them, and export results as PDF reports.")
          .baseEnvironment(BaseEnvironment.of(env))
          .build();

      Agent agent = client.agents.create(agentParams).agent().get();
      System.out.println("Saved agent: " + agent.id().orElse(""));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/agents"
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
                      Target:  genai.Ptr(".agents/AGENTS.md"),
                      Content: genai.Ptr("Always include a chart and a summary table in your reports."),
                  },
                  {
                      Type:   interactions.SourceTypeRepository.ToPointer(),
                      Source: genai.Ptr("https://github.com/your-org/skills"),
                      Target: genai.Ptr(".agents/skills"),
                  },
              },
          }

          res, err := client.Agents.Create(ctx, operations.CreateAgentRequest{
              Body: agents.Agent{
                  ID:        genai.Ptr("fibonacci-analyst"),
                  BaseAgent: genai.Ptr("antigravity-preview-09-2026"),
                  AgentConfig: genai.Ptr(agents.NewAgentConfig(interactions.AntigravityAgentConfig{
                      Model: genai.Ptr("gemini-4-hydrogen"),
                  })),
                  SystemInstruction: genai.Ptr("You are a math analysis agent. Generate sequences, visualize them, and export results as PDF reports."),
                  BaseEnvironment:   genai.Ptr(agents.NewBaseEnvironment(env)),
              },
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("Saved agent: %s\n", *res.Agent.ID)
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/agents" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "id": "fibonacci-analyst",
          "base_agent": "antigravity-preview-09-2026",
          "agent_config": {
              "type": "antigravity",
              "model": "gemini-4-hydrogen"
          },
          "system_instruction": "You are a math analysis agent. Generate sequences, visualize them, and export results as PDF reports.",
          "base_environment": {
              "type": "remote",
              "sources": [
                  {
                      "type": "inline",
                      "target": ".agents/AGENTS.md",
                      "content": "Always include a chart and a summary table in your reports."
                  },
                  {
                      "type": "repository",
                      "source": "https://github.com/your-org/skills",
                      "target": ".agents/skills"
                  }
              ]
          }
      }'
      ```


## 呼叫受管代理 {#invoke-managed-agent}

儲存受管代理後，即可以 ID 呼叫它。每次呼叫都會從基礎環境分岔，因此每次執行都從乾淨的狀態開始：


=== "Python"

      ```py
      result = client.interactions.create(
          agent="fibonacci-analyst",
          input="Generate the first 50 prime numbers, plot their distribution, and save a PDF report.",
          environment="remote",
      )

      print(result.output_text)
      ```

=== "JavaScript"

      ```javascript
      const result = await client.interactions.create({
          agent: "fibonacci-analyst",
          input: "Generate the first 50 prime numbers, plot their distribution, and save a PDF report.",
          environment: "remote",
      }, {
          timeout: 300_000,
      });

      console.log(result.output_text);
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
          .agent(AgentOption.of("fibonacci-analyst"))
          .input(InteractionsInput.of("Generate the first 50 prime numbers, plot their distribution, and save a PDF report."))
          .environment(CreateAgentInteractionEnvironment.of("remote"))
          .build();

      Interaction result = client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("fibonacci-analyst"),
                  Input:       interactions.NewInteractionsInput("Generate the first 50 prime numbers, plot their distribution, and save a PDF report."),
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
      -H "Api-Revision: 2026-05-20" \
      -d '{
          "agent": "fibonacci-analyst",
          "environment": "remote",
          "input": "Generate the first 50 prime numbers, plot their distribution, and save a PDF report."
      }'
      ```


## 後續步驟 {#whats-next}

- [Antigravity Agent](/docs/antigravity-agent/)：功能、支援的工具、多模態輸入、定價與限制。
- [建構 Managed Agents](/docs/custom-agents/)：以你自己的指令、技能與資料擴充 Antigravity。
- [Environments](/docs/agent-environment/)：來源、網路、生命週期、資源限制。
- [Interactions API](/docs/interactions-overview/)：模型與代理背後的基礎 API。

