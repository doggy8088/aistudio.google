# 建構受管代理

Gemini API 上的受管代理可讓你以自己的指令、技能與資料擴充 Antigravity 代理。你可以在互動時[以內嵌方式自訂代理](/docs/custom-agents/#customize-inline)，或將設定[儲存為受管代理](/docs/custom-agents/#save-agent)，再以 ID 呼叫該代理。

## 自訂 Antigravity 代理 {#customize-inline}

建構自訂代理最快的方式，是在建立新互動時直接以內嵌方式傳入設定，無須任何註冊步驟。你可以透過以下幾種主要方式擴充代理：

* **[模型選取](/docs/antigravity-agent/#model-selection)**：透過 `agent_config` 選擇底層的 Gemini 模型（預設為 **Gemini 4 Hydrogen**）。
* **系統指令**：透過 `system_instruction` 傳入內嵌文字，以塑造代理的行為。
* **工具**：覆寫預設工具（Code Execution、Search、URL Context）、註冊遠端 MCP 伺服器，或定義自訂函式（Function Calling）。
* **檔案與技能**：將 `AGENTS.md` 與 `SKILL.md` 等檔案掛載到環境中。

以下範例同時以內嵌方式傳入這三項設定：


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Analyze the Q1 revenue data and create a slide deck.",
          system_instruction="You are a data analyst. Always include visualizations and export results as PDF.",
          environment={
              "type": "remote",
              "sources": [
                  {
                      "type": "inline",
                      "target": ".agents/AGENTS.md",
                      "content": "Always use matplotlib for charts. Include a summary table in every report.",
                  },
                  {
                      "type": "inline",
                      "target": ".agents/skills/slide-maker/SKILL.md",
                      "content": "---\nname: slide-maker\n---\n# Slide Maker\nCreate HTML slide decks from data analysis results.",
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
          input: "Analyze the Q1 revenue data and create a slide deck.",
          system_instruction: "You are a data analyst. Always include visualizations and export results as PDF.",
          environment: {
              type: "remote",
              sources: [
                  {
                      type: "inline",
                      target: ".agents/AGENTS.md",
                      content: "Always use matplotlib for charts. Include a summary table in every report.",
                  },
                  {
                      type: "inline",
                      target: ".agents/skills/slide-maker/SKILL.md",
                      content: "---\nname: slide-maker\n---\n# Slide Maker\nCreate HTML slide decks from data analysis results.",
                  },
              ],
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
          "input": "Analyze the Q1 revenue data and create a slide deck.",
          "system_instruction": "You are a data analyst. Always include visualizations and export results as PDF.",
          "environment": {
              "type": "remote",
              "sources": [
                  {
                      "type": "inline",
                      "target": ".agents/AGENTS.md",
                      "content": "Always use matplotlib for charts. Include a summary table in every report."
                  },
                  {
                      "type": "inline",
                      "target": ".agents/skills/slide-maker/SKILL.md",
                      "content": "---\nname: slide-maker\n---\n# Slide Maker\nCreate HTML slide decks from data analysis results."
                  }
              ]
          }
      }'
      ```

      所有設定都在互動時定義，無須事先註冊任何內容。Antigravity 代理框架提供執行階段（程式碼執行、檔案管理、網頁存取），你的設定則疊加在其上。

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
                  .type(SourceType.INLINE)
                  .target(".agents/AGENTS.md")
                  .content("Always use matplotlib for charts. Include a summary table in every report.")
                  .build(),
              Source.builder()
                  .type(SourceType.INLINE)
                  .target(".agents/skills/slide-maker/SKILL.md")
                  .content("---\nname: slide-maker\n---\n# Slide Maker\nCreate HTML slide decks from data analysis results.")
                  .build()
          ))
          .build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Analyze the Q1 revenue data and create a slide deck."))
          .systemInstruction("You are a data analyst. Always include visualizations and export results as PDF.")
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
                      Type:    interactions.SourceTypeInline.ToPointer(),
                      Target:  genai.Ptr(".agents/AGENTS.md"),
                      Content: genai.Ptr("Always use matplotlib for charts. Include a summary table in every report."),
                  },
                  {
                      Type:    interactions.SourceTypeInline.ToPointer(),
                      Target:  genai.Ptr(".agents/skills/slide-maker/SKILL.md"),
                      Content: genai.Ptr("---\nname: slide-maker\n---\n# Slide Maker\nCreate HTML slide decks from data analysis results."),
                  },
              },
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:             interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:             interactions.NewInteractionsInput("Analyze the Q1 revenue data and create a slide deck."),
                  SystemInstruction: genai.Ptr("You are a data analyst. Always include visualizations and export results as PDF."),
                  Environment:       genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(env)),
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


### 工具與系統指令

你可以使用 `system_instruction` 與 `tools` 參數，為特定互動自訂代理的行為與能力。

- **系統指令**：使用 `system_instruction` 參數傳入內嵌文字，以塑造代理的行為。這很適合用於希望每次呼叫都能調整的快速微調。`system_instruction` 與 `AGENTS.md` 的效果會疊加；兩者同時存在時都會套用。
- **工具**：Antigravity 代理預設可存取 `code_execution`、`google_search` 與 `url_context`。你可以在互動時傳入 `tools` 參數來覆寫這份清單。你也可以註冊[遠端 MCP 伺服器](/docs/antigravity-agent/#mcp-servers)，或定義[自訂函式（函式呼叫）](/docs/antigravity-agent/#function-calling)，將代理連接到你自己的 API 與資料庫。如需可用工具的完整說明，請參閱 [Antigravity Agent：支援的工具](/docs/antigravity-agent/#supported-tools)。

### 以檔案為基礎的自訂方式

#### 代理目錄結構

雖然你可以透過內嵌方式傳入設定，但建議將代理的檔案整理在結構化的目錄中。這樣更容易管理、進行版本控制，並掛載到代理的環境中。


!!! note " "

      你也可以使用開放原始碼的 [Gemini API CLI](/docs/cli/)，直接從終端機建立與執行自訂代理，或連接本機沙箱環境。


典型的代理專案目錄如下：

```text
my-agent/
├── AGENTS.md        # Instructions on how the agent should operate
├── skills/          # Custom skills (subfolders and SKILL.md files)
│   └── slide-maker/
│       └── SKILL.md
└── workspace/       # Initial data files and knowledge
```

Antigravity 執行階段會掃描 `.agents/`（以及環境的根目錄）來尋找這些檔案。

#### AGENTS.md

代理在啟動時會自動從環境載入 `.agents/AGENTS.md`（或 `/.agents/AGENTS.md`），並將其作為系統指令。使用 `AGENTS.md` 可定義長篇的人設、詳細準則，以及希望與程式碼一併進行版本控制的指令。

使用內嵌來源掛載 `AGENTS.md`：


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Analyze the Q1 revenue data and create a report.",
          system_instruction="You are a data analyst. Always include visualizations and export results as PDF.",
          environment={
              "type": "remote",
              "sources": [
                  {
                      "type": "inline",
                      "target": ".agents/AGENTS.md",
                      "content": "Always use matplotlib for charts. Include a summary table in every report.",
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
          input: "Analyze the Q1 revenue data and create a report.",
          system_instruction: "You are a data analyst. Always include visualizations and export results as PDF.",
          environment: {
              type: "remote",
              sources: [
                  {
                      type: "inline",
                      target: ".agents/AGENTS.md",
                      content: "Always use matplotlib for charts. Include a summary table in every report.",
                  },
              ],
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
            "input": "Analyze the Q1 revenue data and create a report.",
            "system_instruction": "You are a data analyst. Always include visualizations and export results as PDF.",
            "environment": {
                "type": "remote",
                "sources": [
                    {
                        "type": "inline",
                        "target": ".agents/AGENTS.md",
                        "content": "Always use matplotlib for charts. Include a summary table in every report."
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
                  .type(SourceType.INLINE)
                  .target(".agents/AGENTS.md")
                  .content("Always use matplotlib for charts. Include a summary table in every report.")
                  .build()
          ))
          .build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Analyze the Q1 revenue data and create a report."))
          .systemInstruction("You are a data analyst. Always include visualizations and export results as PDF.")
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
                      Type:    interactions.SourceTypeInline.ToPointer(),
                      Target:  genai.Ptr(".agents/AGENTS.md"),
                      Content: genai.Ptr("Always use matplotlib for charts. Include a summary table in every report."),
                  },
              },
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:             interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:             interactions.NewInteractionsInput("Analyze the Q1 revenue data and create a report."),
                  SystemInstruction: genai.Ptr("You are a data analyst. Always include visualizations and export results as PDF."),
                  Environment:       genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(env)),
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


#### 技能：SKILL.md

技能是可擴充代理能力的檔案。將技能放在 `.agents/skills/<skill-name>/SKILL.md` 下，框架便會自動探索並註冊它們。

```text
.agents/
├── AGENTS.md
└── skills/
    └── slide-maker/
        └── SKILL.md
```

使用內嵌來源掛載技能：


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Create a presentation about our Q1 results.",
          system_instruction="You create presentations from data.",
          environment={
              "type": "remote",
              "sources": [
                  {
                      "type": "inline",
                      "target": ".agents/skills/slide-maker/SKILL.md",
                      "content": "---\nname: slide-maker\ndescription: Create HTML slide decks\n---\n# Slide Maker\n\nWhen asked to create a presentation:\n1. Analyze the input data\n2. Create an HTML slide deck with reveal.js\n3. Save to /workspace/output/slides.html",
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
          input: "Create a presentation about our Q1 results.",
          system_instruction: "You create presentations from data.",
          environment: {
              type: "remote",
              sources: [
                  {
                      type: "inline",
                      target: ".agents/skills/slide-maker/SKILL.md",
                      content: "---\nname: slide-maker\ndescription: Create HTML slide decks\n---\n# Slide Maker\n\nWhen asked to create a presentation:\n1. Analyze the input data\n2. Create an HTML slide deck with reveal.js\n3. Save to /workspace/output/slides.html",
                  },
              ],
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
            "input": "Create a presentation about our Q1 results.",
            "system_instruction": "You create presentations from data.",
            "environment": {
                "type": "remote",
                "sources": [
                    {
                        "type": "inline",
                        "target": ".agents/skills/slide-maker/SKILL.md",
                        "content": "---\nname: slide-maker\ndescription: Create HTML slide decks\n---\n# Slide Maker\n\nWhen asked to create a presentation:\n1. Analyze the input data\n2. Create an HTML slide deck with reveal.js\n3. Save to /workspace/output/slides.html"
                    }
                ]
            }
        }'
      ```

      從 `.agents/skills/` 與 `/.agents/skills/` 載入的技能都會自動被探索到。

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
                  .type(SourceType.INLINE)
                  .target(".agents/skills/slide-maker/SKILL.md")
                  .content("---\nname: slide-maker\ndescription: Create HTML slide decks\n---\n# Slide Maker\n\nWhen asked to create a presentation:\n1. Analyze the input data\n2. Create an HTML slide deck with reveal.js\n3. Save to /workspace/output/slides.html")
                  .build()
          ))
          .build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Create a presentation about our Q1 results."))
          .systemInstruction("You create presentations from data.")
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
                      Type:    interactions.SourceTypeInline.ToPointer(),
                      Target:  genai.Ptr(".agents/skills/slide-maker/SKILL.md"),
                      Content: genai.Ptr("---\nname: slide-maker\ndescription: Create HTML slide decks\n---\n# Slide Maker\n\nWhen asked to create a presentation:\n1. Analyze the input data\n2. Create an HTML slide deck with reveal.js\n3. Save to /workspace/output/slides.html"),
                  },
              },
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:             interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:             interactions.NewInteractionsInput("Create a presentation about our Q1 results."),
                  SystemInstruction: genai.Ptr("You create presentations from data."),
                  Environment:       genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(env)),
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


## 建立受管代理 {#save-agent}

當你反覆調整好設定後，可以使用 `agents.create` 將其建立為受管代理。這樣就能以 ID 呼叫代理，無須每次重複傳入設定。

建立受管代理時指定的 `id` 在你的專案中必須是唯一的，且不得以保留前綴開頭（例如 `google-`、`gemini-`）。如需受限前綴的完整清單，請參閱[代理 ID 限制](/docs/custom-agents/#agent-id-restrictions)。

### 來自來源

指定 `base_agent`、`id`、`agent_config`、`system_instruction` 與 `base_environment`，並附上來源。平台會在每次呼叫時佈建一個全新的沙箱，並放入你的檔案。如需可用的來源類型（Git、GCS、內嵌），請參閱[環境](/docs/agent-environment/)。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      agent = client.agents.create(
          id="data-analyst",
          base_agent="antigravity-preview-09-2026",
          agent_config={
              "type": "antigravity",
              "model": "gemini-4-hydrogen",
          },
          system_instruction="You are a data analyst. Always include visualizations and export results as PDF.",
          base_environment={
              "type": "remote",
              "sources": [
                  {
                      "type": "inline",
                      "target": ".agents/AGENTS.md",
                      "content": "Always use matplotlib for charts. Include a summary table in every report.",
                  },
                  {
                      "type": "inline",
                      "target": ".agents/skills/slide-maker/SKILL.md",
                      "content": "---\nname: slide-maker\n---\n# Slide Maker\nCreate HTML slide decks from data analysis results.",
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
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const agent = await client.agents.create({
          id: "data-analyst",
          base_agent: "antigravity-preview-09-2026",
          agent_config: {
              type: "antigravity",
              model: "gemini-4-hydrogen",
          },
          system_instruction: "You are a data analyst. Always include visualizations and export results as PDF.",
          base_environment: {
              type: "remote",
              sources: [
                  {
                      type: "inline",
                      target: ".agents/AGENTS.md",
                      content: "Always use matplotlib for charts. Include a summary table in every report.",
                  },
                  {
                      type: "inline",
                      target: ".agents/skills/slide-maker/SKILL.md",
                      content: "---\nname: slide-maker\n---\n# Slide Maker\nCreate HTML slide decks from data analysis results.",
                  },
                  {
                      type: "repository",
                      source: "https://github.com/my-org/analysis-templates",
                      target: "/workspace/templates",
                  },
              ],
          },
      });

      console.log(`Created agent: ${agent.id}`);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/agents" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "id": "data-analyst",
          "base_agent": "antigravity-preview-09-2026",
          "agent_config": {
              "type": "antigravity",
              "model": "gemini-4-hydrogen"
          },
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
                      "type": "inline",
                      "target": ".agents/skills/slide-maker/SKILL.md",
                      "content": "---\nname: slide-maker\n---\n# Slide Maker\nCreate HTML slide decks from data analysis results."
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
                  .content("Always use matplotlib for charts. Include a summary table in every report.")
                  .build(),
              Source.builder()
                  .type(SourceType.INLINE)
                  .target(".agents/skills/slide-maker/SKILL.md")
                  .content("---\nname: slide-maker\n---\n# Slide Maker\nCreate HTML slide decks from data analysis results.")
                  .build(),
              Source.builder()
                  .type(SourceType.REPOSITORY)
                  .source("https://github.com/my-org/analysis-templates")
                  .target("/workspace/templates")
                  .build()
          ))
          .build();

      Agent agentParams = Agent.builder()
          .id("data-analyst")
          .baseAgent("antigravity-preview-09-2026")
          .agentConfig(AgentConfig.of(
              AntigravityAgentConfig.builder()
                  .model("gemini-4-hydrogen")
                  .build()
          ))
          .systemInstruction("You are a data analyst. Always include visualizations and export results as PDF.")
          .baseEnvironment(BaseEnvironment.of(env))
          .build();

      Agent agent = client.agents.create(agentParams).agent().get();
      System.out.println("Created agent: " + agent.id().orElse(""));
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
                      Content: genai.Ptr("Always use matplotlib for charts. Include a summary table in every report."),
                  },
                  {
                      Type:    interactions.SourceTypeInline.ToPointer(),
                      Target:  genai.Ptr(".agents/skills/slide-maker/SKILL.md"),
                      Content: genai.Ptr("---\nname: slide-maker\n---\n# Slide Maker\nCreate HTML slide decks from data analysis results."),
                  },
                  {
                      Type:   interactions.SourceTypeRepository.ToPointer(),
                      Source: genai.Ptr("https://github.com/my-org/analysis-templates"),
                      Target: genai.Ptr("/workspace/templates"),
                  },
              },
          }

          res, err := client.Agents.Create(ctx, operations.CreateAgentRequest{
              Body: agents.Agent{
                  ID:        genai.Ptr("data-analyst"),
                  BaseAgent: genai.Ptr("antigravity-preview-09-2026"),
                  AgentConfig: genai.Ptr(agents.NewAgentConfig(interactions.AntigravityAgentConfig{
                      Model: genai.Ptr("gemini-4-hydrogen"),
                  })),
                  SystemInstruction: genai.Ptr("You are a data analyst. Always include visualizations and export results as PDF."),
                  BaseEnvironment:   genai.Ptr(agents.NewBaseEnvironment(env)),
              },
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("Created agent: %s\n", *res.Agent.ID)
      }
      ```


### 來自既有環境（分支）

先使用基礎 Antigravity 代理反覆調整，直到環境符合需求（套件已安裝、檔案已就位），再將其分支為受管代理。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # Step 1: set up the environment interactively
      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Install pandas, matplotlib, and seaborn. Create an analysis template at /workspace/template.py.",
          environment="remote",
      )

      # Step 2: fork that environment into a managed agent

      agent = client.agents.create(
          id="my-data-analyst",
          base_agent="antigravity-preview-09-2026",
          system_instruction="You are a data analyst. Use the template at /workspace/template.py for all reports.",
          base_environment=interaction.environment_id,
      )

      print(f"Forked agent successfully: {agent.id}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Install pandas, matplotlib, and seaborn. Create an analysis template at /workspace/template.py.",
          environment: "remote",
      }, { timeout: 300000 });

      const agent = await client.agents.create({
          id: "my-data-analyst",
          base_agent: "antigravity-preview-09-2026",
          system_instruction: "You are a data analyst. Use the template at /workspace/template.py for all reports.",
          base_environment: interaction.environment_id,
      });

      console.log(`Forked agent successfully: ${agent.id}`);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
            "agent": "antigravity-preview-09-2026",
            "input": "Install pandas, matplotlib, and seaborn. Create an analysis template at /workspace/template.py.",
            "environment": "remote"
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.agents.Agent;
      import com.google.genai.gaos.models.agents.BaseEnvironment;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      // Step 1: set up the environment interactively
      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Install pandas, matplotlib, and seaborn. Create an analysis template at /workspace/template.py."))
          .environment(CreateAgentInteractionEnvironment.of("remote"))
          .build();

      Interaction interaction = client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      // Step 2: fork that environment into a managed agent
      Agent agentParams = Agent.builder()
          .id("my-data-analyst")
          .baseAgent("antigravity-preview-09-2026")
          .systemInstruction("You are a data analyst. Use the template at /workspace/template.py for all reports.")
          .baseEnvironment(BaseEnvironment.of(interaction.environmentId().orElse("")))
          .build();

      Agent agent = client.agents.create(agentParams).agent().get();
      System.out.println("Forked agent successfully: " + agent.id().orElse(""));
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

          // Step 1: set up the environment interactively
          intRes, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Install pandas, matplotlib, and seaborn. Create an analysis template at /workspace/template.py."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment("remote")),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          interaction := intRes.Interaction

          // Step 2: fork that environment into a managed agent
          agentRes, err := client.Agents.Create(ctx, operations.CreateAgentRequest{
              Body: agents.Agent{
                  ID:                genai.Ptr("my-data-analyst"),
                  BaseAgent:         genai.Ptr("antigravity-preview-09-2026"),
                  SystemInstruction: genai.Ptr("You are a data analyst. Use the template at /workspace/template.py for all reports."),
                  BaseEnvironment:   genai.Ptr(agents.NewBaseEnvironment(*interaction.EnvironmentID)),
              },
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("Forked agent successfully: %s\n", *agentRes.Agent.ID)
      }
      ```


### 搭配網路規則 {#with-network-rules}

儲存受管代理時，你可以限制對外存取，或注入憑證。如需允許清單結構定義、憑證模式與萬用字元的完整說明，請參閱[環境：網路設定](/docs/agent-environment/#network-configuration)。

在允許清單規則上以 ID 參照已儲存的[憑證](/docs/agent-credentials/)（`"credential": "github-production"`），egress proxy 便會在要求發出時注入機密，因此機密永遠不會出現在你的代理定義中。本範例改以 `transform` 內嵌設定標頭。proxy 對這兩種形式採用相同的處理方式，而使用憑證還能讓你在多個代理之間重複使用同一份機密，並在單一位置進行輪替。

以下範例建立一個 `issue-resolver` 代理，該代理只能存取 GitHub 與 PyPI，並為 GitHub 注入憑證：


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      agent = client.agents.create(
          id="issue-resolver",
          base_agent="antigravity-preview-09-2026",
          system_instruction="You resolve GitHub issues. Clone the repo, find the bug, write the fix, run the tests, and open a PR.",
          base_environment={
              "type": "remote",
              "sources": [
                  {
                      "type": "repository",
                      "source": "https://github.com/my-org/backend",
                      "target": "/workspace/repo",
                  }
              ],
              "network": {
                  "allowlist": [
                      {
                          "domain": "api.github.com",
                          "transform": {
                              "Authorization": "Basic YOUR_BASE64_TOKEN"
                          },
                      },
                      {"domain": "pypi.org"},
                  ]
              },
          },
      )

      print(f"Created issue-resolver agent successfully: {agent.id}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const agent = await client.agents.create({
          id: "issue-resolver",
          base_agent: "antigravity-preview-09-2026",
          system_instruction: "You resolve GitHub issues. Clone the repo, find the bug, write the fix, run the tests, and open a PR.",
          base_environment: {
              type: "remote",
              sources: [
                  {
                      type: "repository",
                      source: "https://github.com/my-org/backend",
                      target: "/workspace/repo",
                  }
              ],
              network: {
                  allowlist: [
                      {
                          domain: "api.github.com",
                          transform: {
                              "Authorization": "Basic YOUR_BASE64_TOKEN"
                          },
                      },
                      { domain: "pypi.org" },
                  ]
              }
          },
      });

      console.log(`Created issue-resolver agent successfully: ${agent.id}`);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/agents" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
            "id": "issue-resolver",
            "base_agent": "antigravity-preview-09-2026",
            "system_instruction": "You resolve GitHub issues. Clone the repo, find the bug, write the fix, run the tests, and open a PR.",
            "base_environment": {
                "type": "remote",
                "sources": [
                    {
                        "type": "repository",
                        "source": "https://github.com/my-org/backend",
                        "target": "/workspace/repo"
                    }
                ],
                "network": {
                    "allowlist": [
                        {
                            "domain": "api.github.com",
                            "transform": {
                                "Authorization": "Basic YOUR_BASE64_TOKEN"
                            }
                        },
                        {"domain": "pypi.org"}
                    ]
                }
            }
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.agents.Agent;
      import com.google.genai.gaos.models.agents.BaseEnvironment;
      import com.google.genai.gaos.models.interactions.Allowlist;
      import com.google.genai.gaos.models.interactions.AllowlistEntry;
      import com.google.genai.gaos.models.interactions.Environment;
      import com.google.genai.gaos.models.interactions.EnvironmentNetworkEgressAllowlist;
      import com.google.genai.gaos.models.interactions.Network;
      import com.google.genai.gaos.models.interactions.Source;
      import com.google.genai.gaos.models.interactions.SourceType;
      import com.google.genai.gaos.models.interactions.Transform;
      import java.util.List;
      import java.util.Map;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      Environment env = Environment.builder()
          .sources(List.of(
              Source.builder()
                  .type(SourceType.REPOSITORY)
                  .source("https://github.com/my-org/backend")
                  .target("/workspace/repo")
                  .build()
          ))
          .network(Network.of(
              EnvironmentNetworkEgressAllowlist.builder()
                  .allowlist(Allowlist.of(List.of(
                      AllowlistEntry.builder()
                          .domain("api.github.com")
                          .transform(Transform.of(Map.of(
                              "Authorization", "Basic YOUR_BASE64_TOKEN"
                          )))
                          .build(),
                      AllowlistEntry.builder().domain("pypi.org").build()
                  )))
                  .build()
          ))
          .build();

      Agent agentParams = Agent.builder()
          .id("issue-resolver")
          .baseAgent("antigravity-preview-09-2026")
          .systemInstruction("You resolve GitHub issues. Clone the repo, find the bug, write the fix, run the tests, and open a PR.")
          .baseEnvironment(BaseEnvironment.of(env))
          .build();

      Agent agent = client.agents.create(agentParams).agent().get();
      System.out.println("Created issue-resolver agent successfully: " + agent.id().orElse(""));
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
                      Type:   interactions.SourceTypeRepository.ToPointer(),
                      Source: genai.Ptr("https://github.com/my-org/backend"),
                      Target: genai.Ptr("/workspace/repo"),
                  },
              },
              Network: genai.Ptr(interactions.NewNetwork(interactions.EnvironmentNetworkEgressAllowlist{
                  Allowlist: genai.Ptr(interactions.NewAllowlist([]interactions.AllowlistEntry{
                      {
                          Domain: "api.github.com",
                          Transform: genai.Ptr(interactions.NewTransform(map[string]string{
                              "Authorization": "Basic YOUR_BASE64_TOKEN",
                          })),
                      },
                      {
                          Domain: "pypi.org",
                      },
                  })),
              })),
          }

          res, err := client.Agents.Create(ctx, operations.CreateAgentRequest{
              Body: agents.Agent{
                  ID:                genai.Ptr("issue-resolver"),
                  BaseAgent:         genai.Ptr("antigravity-preview-09-2026"),
                  SystemInstruction: genai.Ptr("You resolve GitHub issues. Clone the repo, find the bug, write the fix, run the tests, and open a PR."),
                  BaseEnvironment:   genai.Ptr(agents.NewBaseEnvironment(env)),
              },
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("Created issue-resolver agent successfully: %s\n", *res.Agent.ID)
      }
      ```


## 呼叫代理

建立新互動並使用你的代理 ID，即可呼叫受管代理。每次呼叫都會分支基礎環境，因此每次執行都從乾淨的狀態開始。


=== "Python"

      ```python
      result = client.interactions.create(
          agent="data-analyst",
          input="Analyze Q1 revenue data from /workspace/templates/sample.csv and create a slide deck.",
          environment="remote",
      )

      print(result.output_text)
      ```

=== "JavaScript"

      ```javascript
      const result = await client.interactions.create({
          agent: "data-analyst",
          input: "Analyze Q1 revenue data from /workspace/templates/sample.csv and create a slide deck.",
          environment: "remote",
      }, { timeout: 300000 });

      console.log(result.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
            "agent": "data-analyst",
            "input": "Analyze Q1 revenue data from /workspace/templates/sample.csv and create a slide deck.",
            "environment": "remote"
        }'
      ```

      如需多輪對話與串流的說明，請參閱[快速入門](/docs/managed-agents-quickstart/)。相同的 `previous_interaction_id` 與 `environment` 模式也適用於受管代理。

      受管代理也支援背景執行與取消。如需詳細資訊與程式碼範例，請參閱 [Antigravity Agent：背景執行](/docs/antigravity-agent/#background-execution)。

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
          .agent(AgentOption.of("data-analyst"))
          .input(InteractionsInput.of("Analyze Q1 revenue data from /workspace/templates/sample.csv and create a slide deck."))
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
                  Agent:       interactions.AgentOption("data-analyst"),
                  Input:       interactions.NewInteractionsInput("Analyze Q1 revenue data from /workspace/templates/sample.csv and create a slide deck."),
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


## 在呼叫時覆寫設定

建立互動時，你可以覆寫代理預設的 `system_instruction`、`tools` 與
`environment` 網路設定。這樣就能針對單次執行修改代理的行為、能力或憑證，
而無須變更已儲存的代理定義。


### 覆寫系統指令與工具


=== "Python"

      ```python
      result = client.interactions.create(
          agent="data-analyst",
          input="Analyze Q1 revenue data, but do not create a slide deck. Just output a summary table.",
          system_instruction="You are a data analyst. Focus ONLY on summary tables. Ignore default instructions about slides.",
          tools=[{"type": "code_execution"}], # Override to only use code execution
          environment="remote",
      )
      print(result.output_text)
      ```

=== "JavaScript"

      ```javascript
      const result = await client.interactions.create({
          agent: "data-analyst",
          input: "Analyze Q1 revenue data, but do not create a slide deck. Just output a summary table.",
          system_instruction: "You are a data analyst. Focus ONLY on summary tables. Ignore default instructions about slides.",
          tools: [{ type: "code_execution" }], // Override to only use code execution
          environment: "remote",
      }, { timeout: 300000 });

      console.log(result.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
            "agent": "data-analyst",
            "input": "Analyze Q1 revenue data, but do not create a slide deck. Just output a summary table.",
            "system_instruction": "You are a data analyst. Focus ONLY on summary tables. Ignore default instructions about slides.",
            "tools": [{"type": "code_execution"}],
            "environment": "remote"
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.CodeExecution;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.List;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("data-analyst"))
          .input(InteractionsInput.of("Analyze Q1 revenue data, but do not create a slide deck. Just output a summary table."))
          .systemInstruction("You are a data analyst. Focus ONLY on summary tables. Ignore default instructions about slides.")
          .tools(List.of(CodeExecution.builder().build())) // Override to only use code execution
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
                  Agent:             interactions.AgentOption("data-analyst"),
                  Input:             interactions.NewInteractionsInput("Analyze Q1 revenue data, but do not create a slide deck. Just output a summary table."),
                  SystemInstruction: genai.Ptr("You are a data analyst. Focus ONLY on summary tables. Ignore default instructions about slides."),
                  Tools:             []interactions.Tool{interactions.NewTool(interactions.CodeExecution{})}, // Override to only use code execution
                  Environment:       genai.Ptr(interactions.NewCreateAgentInteractionEnvironment("remote")),
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


### 覆寫網路設定（重新整理憑證） {#override-network}

如果你的受管代理已將網路憑證內嵌在 `base_environment` 中，
你可以在呼叫時覆寫這些憑證，以重新整理已過期的權杖或輪替 API
金鑰。傳入 `environment` 物件，並在其中設定新的 `network` 配置即可。新的
網路規則會在該次互動中完全取代先前的規則。基礎
環境的來源（檔案、存放庫）則會保留。

如果 `base_environment` 參照的是已儲存的
[憑證](/docs/agent-credentials/)，而非內嵌權杖，你就不需要
覆寫任何內容。只要以 `PATCH` 輪替該憑證，所有參照它的代理
都會在下一次執行時取得新的機密。


=== "Python"

      ```python
      # Invoke the agent with a fresh token, overriding the base_environment credentials
      result = client.interactions.create(
          agent="issue-resolver",
          input="Fix issue #42 and open a PR.",
          environment={
              "type": "remote",
              "network": {
                  "allowlist": [
                      {
                          "domain": "api.github.com",
                          "transform": {
                              "Authorization": "Bearer ghp_REFRESHED_TOKEN"
                          },
                      },
                      {"domain": "pypi.org"},
                  ]
              },
          },
      )

      print(result.output_text)
      ```

=== "JavaScript"

      ```javascript
      // Invoke the agent with a fresh token, overriding the base_environment credentials
      const result = await client.interactions.create({
          agent: "issue-resolver",
          input: "Fix issue #42 and open a PR.",
          environment: {
              type: "remote",
              network: {
                  allowlist: [
                      {
                          domain: "api.github.com",
                          transform: {
                              "Authorization": "Bearer ghp_REFRESHED_TOKEN"
                          },
                      },
                      { domain: "pypi.org" },
                  ]
              },
          },
      }, { timeout: 300000 });

      console.log(result.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
            "agent": "issue-resolver",
            "input": "Fix issue #42 and open a PR.",
            "environment": {
                "type": "remote",
                "network": {
                    "allowlist": [
                        {
                            "domain": "api.github.com",
                            "transform": {
                                "Authorization": "Bearer ghp_REFRESHED_TOKEN"
                            }
                        },
                        {"domain": "pypi.org"}
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

      // Invoke the agent with a fresh token, overriding the base_environment credentials
      Environment env = Environment.builder()
          .network(Network.of(
              EnvironmentNetworkEgressAllowlist.builder()
                  .allowlist(Allowlist.of(List.of(
                      AllowlistEntry.builder()
                          .domain("api.github.com")
                          .transform(Transform.of(Map.of(
                              "Authorization", "Bearer ghp_REFRESHED_TOKEN"
                          )))
                          .build(),
                      AllowlistEntry.builder().domain("pypi.org").build()
                  )))
                  .build()
          ))
          .build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("issue-resolver"))
          .input(InteractionsInput.of("Fix issue #42 and open a PR."))
          .environment(CreateAgentInteractionEnvironment.of(env))
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

          // Invoke the agent with a fresh token, overriding the base_environment credentials
          env := interactions.Environment{
              Network: genai.Ptr(interactions.NewNetwork(interactions.EnvironmentNetworkEgressAllowlist{
                  Allowlist: genai.Ptr(interactions.NewAllowlist([]interactions.AllowlistEntry{
                      {
                          Domain: "api.github.com",
                          Transform: genai.Ptr(interactions.NewTransform(map[string]string{
                              "Authorization": "Bearer ghp_REFRESHED_TOKEN",
                          })),
                      },
                      {
                          Domain: "pypi.org",
                      },
                  })),
              })),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("issue-resolver"),
                  Input:       interactions.NewInteractionsInput("Fix issue #42 and open a PR."),
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


## 管理代理

你可以列出、取得與刪除代理。

### 列出代理


=== "Python"

      ```python
      agents = client.agents.list()
      for a in agents.agents:
          print(f"{a.id}: {a.description}")
      ```

=== "JavaScript"

      ```javascript
      const agents = await client.agents.list();
      if (agents.agents) {
          for (const a of agents.agents) {
              console.log(`${a.id}: ${a.description}`);
          }
      }
      ```

=== "REST"

      ```shell
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/agents" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.agents.Agent;
      import java.util.List;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      List<Agent> agents = client.agents.listDirect().agentListResponse().get().agents().orElse(List.of());
      for (Agent a : agents) {
          System.out.println(a.id().orElse("") + ": " + a.description().orElse(""));
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
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Agents.List(ctx, operations.ListAgentsRequest{})
          if err != nil {
              log.Fatal(err)
          }

          if res.AgentListResponse != nil {
              for _, a := range res.AgentListResponse.Agents {
                  fmt.Printf("%s: %v\n", *a.ID, a.Description)
              }
          }
      }
      ```


### 取得代理


=== "Python"

      ```python
      agent = client.agents.get(id="data-analyst")
      print(agent)
      ```

=== "JavaScript"

      ```javascript
      const agent = await client.agents.get("data-analyst");
      console.log(agent);
      ```

=== "REST"

      ```shell
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/agents/data-analyst" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.agents.Agent;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      Agent agent = client.agents.get("data-analyst").agent().get();
      System.out.println(agent);
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
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

          res, err := client.Agents.Get(ctx, operations.GetAgentRequest{
              ID: "data-analyst",
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("%+v\n", res.Agent)
      }
      ```


### 刪除代理

刪除會移除該設定。由該代理建立的既有環境與互動不會受到影響。


=== "Python"

      ```python
      client.agents.delete(id="data-analyst")
      ```

=== "JavaScript"

      ```javascript
      await client.agents.delete("data-analyst");
      ```

=== "REST"

      ```shell
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/agents/data-analyst" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      client.agents.delete("data-analyst");
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

          _, err = client.Agents.Delete(ctx, operations.DeleteAgentRequest{
              ID: "data-analyst",
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```


## 代理定義參考文件

| 欄位 | 類型 | 必填 | 說明 |
| :--- | :--- | :--- | :--- |
| `id` | string | Yes | 在 Google Cloud 專案中唯一的代理識別碼。用於呼叫代理。不得使用保留前綴。請參閱[代理 ID 限制](/docs/custom-agents/#agent-id-restrictions)。 |
| `description` | string | No | 代理的易讀說明。 |
| `base_agent` | string | Yes | 基礎代理 ID（例如 `antigravity-preview-09-2026`）。 |
| `agent_config` | object | No | 基礎代理的設定，包含模型選取（`{"type": "antigravity", "model": "gemini-4-hydrogen"}`）。省略時預設為 `gemini-4-hydrogen`。對於具名代理，無法在互動時覆寫。 |
| `system_instruction` | string | No | 定義行為與人設的系統提示詞。 |
| `tools` | array | No | 代理可使用的工具。省略時預設為 `code_execution`、`google_search` 與 `url_context`。支援的工具包含 `code_execution`、`google_search`、`url_context`、`mcp_server`，以及自訂的 `function` 定義。 |
| `base_environment` | string or object | No | `"remote"`、一個 `environment_id`，或帶有 `sources` 與 `network` 的設定物件。請參閱環境。 |

### 代理 ID 限制 {#agent-id-restrictions}

建立受管代理時，你指定的 `id` 必須遵循以下規則：

* 它在你的 Google Cloud 專案中必須是唯一的。
* 它**不得**以下列任何保留前綴開頭（不區分大小寫），否則建立將會失敗：
  *   `antigravity-`
  *   `veo-`
  *   `omni-`
  *   `lyria-`
  *   `imagen-`
  *   `gemma-`
  *   `gemini-`
  *   `google-`
  *   `youtube-`
  *   `android-`
  *   `chrome-`
  *   `pixel-`
  *   `waze-`
  *   `fitbit-`
  *   `nest-`
  *   `kaggle-`


## 迭代工作流程 {#iteration-workflow}

1. **原型開發**：使用基礎 Antigravity 代理。透過內嵌方式傳入系統指令與環境來源。互動式地測試指令、技能與環境設定。
2. **穩定環境**：安裝套件、掛載來源，並確認一切運作正常。
3. **持久化**：建立新代理，將其持久化為受管代理，可從來源建立，或透過分支環境建立。
4. **更新**：更新代理定義。變更系統指令、更換技能或新增來源。下一次呼叫便會採用新設定。

## 限制 {#limitations}

* **預覽狀態**：受管代理目前為預覽版。功能與結構定義可能會變更。
*   **基礎代理與模型**：僅支援 `antigravity-preview-09-2026`
    作為 `base_agent`。`agent_config` 中支援的模型選項為
    `gemini-4-hydrogen`（預設）、`gemini-4-carbon`、`gemini-4-argon`、
    `gemini-3.8-flash`、`gemini-3.6-flash`，以及
    `gemini-3.5-flash-lite`。對於具名代理，無法在
    互動時覆寫模型。
* **無版本控制**：目前尚不提供代理版本控制與回復功能。
* **無子代理巢狀**：目前尚不支援子代理委派。
* 你最多可擁有 1000 個受管代理。

## 後續步驟 {#whats-next}

* [代理總覽](/docs/agents/)：了解受管代理的核心概念。
* [快速入門](/docs/managed-agents-quickstart/)：開始建構多輪對話與串流功能。
* [Antigravity Agent](/docs/antigravity-agent/)：探索預設代理的功能、工具與定價。
* [代理環境](/docs/agent-environment/)：設定沙箱、來源與網路。
* [Agent Platform 上的受管代理 API](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/managed-agents)：建立具備內建組織治理功能的代理。

