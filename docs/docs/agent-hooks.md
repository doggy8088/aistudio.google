# Hooks

Hook 讓你能在代理於遠端沙箱內執行程式碼或修改檔案的前後，執行自訂指令碼或外部 HTTP 要求。你可以利用 hook 為代理迴圈加上自動化的防護機制與背景工作流程，例如：

* 在高風險的 shell 指令或受限檔案讀取執行前，**強制實施安全與存取防護**。
* 在代理建立或修改檔案後，立即**自動執行資料管線轉換**。
* 在工具執行後，將**企業稽核遙測資料串流傳送**至外部監控系統。


=== "Python"

      ```python
      import json
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      hooks_config = {
          "security-gate": {
              "pre_tool_execution": [
                  {
                      "matcher": "code_execution",
                      "hooks": [
                          {
                              "type": "command",
                              "command": "python3 /.agents/hooks-scripts/gate.py",
                              "timeout": 10,
                          }
                      ],
                  }
              ]
          }
      }

      gate_script = """#!/usr/bin/env python3
      import sys, json
      data = json.load(sys.stdin)
      cmd = str(data.get("tool_call", {}).get("args", {}))
      if "rm -rf" in cmd:
          print(json.dumps({"decision": "deny", "reason": "Destructive command blocked by security gate."}))
      else:
          print(json.dumps({"decision": "allow"}))
      """

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Run `rm -rf /tmp/forbidden` using code_execution.",
          tools=[{"type": "code_execution"}],
          environment={
              "type": "remote",
              "sources": [
                  {
                      "type": "inline",
                      "target": ".agents/hooks.json",
                      "content": json.dumps(hooks_config, indent=2),
                  },
                  {
                      "type": "inline",
                      "target": ".agents/hooks-scripts/gate.py",
                      "content": gate_script,
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

      const hooksConfig = {
          "security-gate": {
              pre_tool_execution: [
                  {
                      matcher: "code_execution",
                      hooks: [
                          {
                              type: "command",
                              command: "python3 /.agents/hooks-scripts/gate.py",
                              timeout: 10,
                          },
                      ],
                  },
              ],
          },
      };

      const gateScript = `#!/usr/bin/env python3
      import sys, json
      data = json.load(sys.stdin)
      cmd = str(data.get("tool_call", {}).get("args", {}))
      if "rm -rf" in cmd:
          print(json.dumps({"decision": "deny", "reason": "Destructive command blocked by security gate."}))
      else:
          print(json.dumps({"decision": "allow"}))
      `;

      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Run `rm -rf /tmp/forbidden` using code_execution.",
          tools: [{ type: "code_execution" }],
          environment: {
              type: "remote",
              sources: [
                  {
                      type: "inline",
                      target: ".agents/hooks.json",
                      content: JSON.stringify(hooksConfig, null, 2),
                  },
                  {
                      type: "inline",
                      target: ".agents/hooks-scripts/gate.py",
                      content: gateScript,
                  },
              ],
          },
      });
      console.log(interaction.output_text);
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
            "agent": "antigravity-preview-09-2026",
            "input": [{"type": "text", "text": "Run `rm -rf /tmp/forbidden` using code_execution."}],
            "tools": [{"type": "code_execution"}],
            "environment": {
                "type": "remote",
                "sources": [
                    {
                        "type": "inline",
                        "target": ".agents/hooks.json",
                        "content": "{\"security-gate\": {\"pre_tool_execution\": [{\"matcher\": \"code_execution\", \"hooks\": [{\"type\": \"command\", \"command\": \"python3 /.agents/hooks-scripts/gate.py\", \"timeout\": 10}]}]}}"
                    },
                    {
                        "type": "inline",
                        "target": ".agents/hooks-scripts/gate.py",
                        "content": "#!/usr/bin/env python3\nimport sys, json\ndata = json.load(sys.stdin)\ncmd = str(data.get(\"tool_call\", {}).get(\"args\", {}))\nif \"rm -rf\" in cmd:\n    print(json.dumps({\"decision\": \"deny\", \"reason\": \"Destructive command blocked by security gate.\"}))\nelse:\n    print(json.dumps({\"decision\": \"allow\"}))\n"
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
      import com.google.genai.gaos.models.interactions.CodeExecution;
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

      String hooksConfig = """
      {
        "security-gate": {
          "pre_tool_execution": [
            {
              "matcher": "code_execution",
              "hooks": [
                {
                  "type": "command",
                  "command": "python3 /.agents/hooks-scripts/gate.py",
                  "timeout": 10
                }
              ]
            }
          ]
        }
      }
      """;

      String gateScript = "#!/usr/bin/env python3\n"
          + "import sys, json\n"
          + "data = json.load(sys.stdin)\n"
          + "cmd = str(data.get(\"tool_call\", {}).get(\"args\", {}))\n"
          + "if \"rm -rf\" in cmd:\n"
          + "    print(json.dumps({\"decision\": \"deny\", \"reason\": \"Destructive command blocked by security gate.\"}))\n"
          + "else:\n"
          + "    print(json.dumps({\"decision\": \"allow\"}))\n";

      Environment env = Environment.builder()
          .sources(List.of(
              Source.builder()
                  .type(SourceType.INLINE)
                  .target(".agents/hooks.json")
                  .content(hooksConfig)
                  .build(),
              Source.builder()
                  .type(SourceType.INLINE)
                  .target(".agents/hooks-scripts/gate.py")
                  .content(gateScript)
                  .build()
          ))
          .build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Run `rm -rf /tmp/forbidden` using code_execution."))
          .tools(List.of(CodeExecution.builder().build()))
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

          hooksConfig := `{
        "security-gate": {
          "pre_tool_execution": [
            {
              "matcher": "code_execution",
              "hooks": [
                {
                  "type": "command",
                  "command": "python3 /.agents/hooks-scripts/gate.py",
                  "timeout": 10
                }
              ]
            }
          ]
        }
      }`

          gateScript := `#!/usr/bin/env python3
      import sys, json
      data = json.load(sys.stdin)
      cmd = str(data.get("tool_call", {}).get("args", {}))
      if "rm -rf" in cmd:
          print(json.dumps({"decision": "deny", "reason": "Destructive command blocked by security gate."}))
      else:
          print(json.dumps({"decision": "allow"}))
      `

          env := interactions.Environment{
              Sources: []interactions.Source{
                  {
                      Type:    interactions.SourceTypeInline.ToPointer(),
                      Target:  genai.Ptr(".agents/hooks.json"),
                      Content: genai.Ptr(hooksConfig),
                  },
                  {
                      Type:    interactions.SourceTypeInline.ToPointer(),
                      Target:  genai.Ptr(".agents/hooks-scripts/gate.py"),
                      Content: genai.Ptr(gateScript),
                  },
              },
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Run `rm -rf /tmp/forbidden` using code_execution."),
                  Tools:       []interactions.Tool{interactions.NewTool(interactions.CodeExecution{})},
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


## 支援的生命週期事件 {#supported-lifecycle-events}

Hook 在沙箱內支援 2 種事件：

| 事件 | 觸發時機 | 作用 |
| :--- | :--- | :--- |
| `pre_tool_execution` | 工具執行前夕 | 可在工具執行前核准（`allow`）或阻擋（`deny`）。遭到阻擋時，模型會看到你的拒絕原因並據此調整。 |
| `post_tool_execution` | 工具完成後立即 | 執行後續工作，例如格式化程式碼、執行單元測試或記錄遙測資料。無法阻擋或復原已完成的動作。 |

### `pre_tool_execution` {#pre-tool-execution}

在工具執行前夕觸發。你的指令碼會從 `stdin` 讀取工具呼叫的詳細資訊，並將決策 JSON（`allow` 或 `deny`）輸出至 `stdout`。

**輸入酬載（`stdin`）：**

```json
{
  "tool_call": {
    "name": "code_execution",
    "args": {
      "code": "rm -rf /tmp/forbidden",
      "language": "bash"
    }
  },
  "environment_id": "env_xyz789"
}
```

**輸出回應（`stdout`）：**

核准工具呼叫：

```json
{
  "decision": "allow"
}
```

阻擋工具呼叫並將意見回饋給模型：

```json
{
  "decision": "deny",
  "reason": "Destructive command blocked by security gate."
}
```

當 hook 拒絕某個指令時，工具呼叫會立即被略過。代理會在目前的回合中直接看到包含拒絕原因的錯誤結果，模型便能自行修正，改選其他指令，或向使用者說明阻擋的原因。

若你的指令碼輸出無法辨識的 JSON、純文字，或任何非 `{"decision": "deny"}` 的內容，執行環境會將該回應視為核准（`allow`）。

### `post_tool_execution` {#post-tool-execution}

在工具完成後立即觸發。你的指令碼會從 `stdin` 讀取執行詳細資訊與任何錯誤狀態。

**輸入酬載（`stdin`）：**

```json
{
  "tool_call": {
    "name": "code_execution",
    "args": {
      "code": "python3 /workspace/app.py",
      "language": "bash"
    }
  },
  "environment_id": "env_xyz789"
}
```

若 shell 指令將錯誤輸出至標準錯誤（`stderr`），或檔案系統操作失敗，酬載中會包含帶有錯誤文字的 `"error"` 欄位。指令成功且無錯誤時，則完全省略 `"error"` 欄位。

**輸出回應（`stdout`）：**

```json
{}
```

由於工具後 hook 僅用於程式碼格式化或記錄等背景工作，執行環境會忽略在 `stdout` 回傳的任何決策值。

## 設定探索 {#configuration-discovery}

執行環境會自動從沙箱環境內的 `.agents/hooks.json` 或 `/.agents/hooks.json` 探索 hook 定義。你可以透過任何受支援的[環境來源](/docs/agent-environment/#mount-from-a-source)，將 `hooks.json` 連同自訂指令碼一併提供：

* **Repository mount**：包含 `.agents/hooks.json` 與 `AGENTS.md` 的 Git 存放庫。
* **Cloud Storage（`gcs`）**：包含已複製到環境中的 `hooks.json` 的 GCS 值區。
* **Inline sources**：在 `environment.sources` 中傳入的原始 JSON 字串與指令碼內容（於呼叫 `client.interactions.create` 時提供）。

### `hooks.json` 結構定義 {#hooks-json-schema}

`hooks.json` 檔案會將事件定義（`pre_tool_execution` 或 `post_tool_execution`）歸在自訂名稱之下。你可以獨立啟用或停用每個群組：

```json
{
  "security-gate": {
    "enabled": true,
    "pre_tool_execution": [
      {
        "matcher": "code_execution",
        "hooks": [
          {
            "type": "command",
            "command": "python3 /.agents/hooks-scripts/gate.py",
            "timeout": 10
          }
        ]
      }
    ]
  },
  "auto-format": {
    "post_tool_execution": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "python3 /.agents/hooks-scripts/auto_lint.py",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

### Matcher 語法與規則 {#matcher-syntax}

`hooks.json` 中的每個規則群組會透過 `matcher` 與 `hooks` 屬性，定義處理常式觸發的時機與方式：

| 欄位 | 類型 | 說明 |
| :--- | :--- | :--- |
| `enabled` | `boolean` | 選填。設為 `false` 可停用該群組（預設為 `true`）。 |
| `matcher` | `string` | 用來比對容器內目標工具名稱的正規表示式模式。 |
| `hooks` | `array` | 處理常式定義的有序清單（`command` 或 `http`）。處理常式會依宣告順序依序執行。 |

#### 正規表示式的評估方式

當代理在沙箱內叫用工具時，執行環境會使用標準 RE2 正規表示式，將工具的容器名稱與你的 `matcher` 模式進行比對。若正規表示式與工具名稱相符，`hooks` 陣列中的所有處理常式便會依序執行。若多個規則群組同時符合同一個工具，所有對應的處理常式陣列都會執行。

你可以指定任何內建容器工具名稱：程式碼執行（`code_execution`）或檔案系統操作（`view_file`、`write_to_file`、`replace_file_content`、`list_dir` 與 `delete_file`）。

#### 常見的 matcher 表示式

* `"code_execution"`：精確字串比對，用於 shell 指令與指令碼執行。
* `"write_to_file"`：精確比對，用於檔案系統的檔案建立與磁碟寫入。
* `"view_file|write_to_file"`：以直線分隔，可在單一規則中比對多個特定工具名稱。
* `".*_file"`：正規表示式萬用字元，比對任何以 `_file` 結尾的工具（例如 `view_file`、`write_to_file` 或 `delete_file`）。這只涵蓋部分檔案系統工具集，`replace_file_content` 與 `list_dir` 並不以 `_file` 結尾，需要時請明確寫出。標準 RE2 正規表示式要求使用 `.*`；像 `*_file` 這類簡單的 shell glob 是無效的正規表示式語法，將無法比對成功。
* `".*"`、`"*"` 或 `""`：全包式模式，攔截容器內的每一次工具呼叫。

## 處理常式類型 {#handler-types}

### Command hook {#command-hooks}

Command hook 會在沙箱內執行 shell 指令或指令碼。指令碼會從 `stdin` 接收事件 JSON，並將決策 JSON 輸出至 `stdout`。

| 欄位 | 類型 | 說明 |
| :--- | :--- | :--- |
| `type` | `string` | 必須為 `"command"`。 |
| `command` | `string` | 在沙箱內執行的指令列（例如 `python3 /.agents/hooks-scripts/gate.py`）。 |
| `timeout` | `integer` | 逾時時間（秒）。預設值：`30`。 |

### HTTP hook {#http-hooks}

HTTP hook 會直接從沙箱網路內，將事件 JSON 以 POST 要求的形式傳送至外部 HTTPS URL。目標伺服器會在 HTTP 回應主體中，以完全相同的 JSON 格式回傳決策（`{"decision": "allow"}` 或 `{"decision": "deny", "reason": "..."}`）。

| 欄位 | 類型 | 說明 |
| :--- | :--- | :--- |
| `type` | `string` | 必須為 `"http"`。 |
| `url` | `string` | 用來 POST 事件酬載的外部 HTTPS 端點。 |
| `headers` | `object` | 選填的鍵值對，用於非敏感的自訂標頭（例如 `{"X-Event-Source": "agent-sandbox"}`）。如需驗證，請改用網路允許清單上的 [credential](/docs/agent-credentials/)。 |
| `timeout` | `integer` | 逾時時間（秒）。預設值：`30`。 |

#### 出口 proxy 與 token 轉換 {#egress-proxy-and-token-transformation}

由於 HTTP hook 是直接在沙箱網路命名空間內執行，對外要求會經過透明的出口 proxy。這套架構帶來 2 項關鍵的安全優勢：

* **網路允許清單**：目標端點必須在環境的 `network.allowlist` 中明確獲得許可。回送流量（`127.0.0.1` 或 `localhost`）會被 proxy 阻擋；請一律以允許清單上的外部端點為目標。
* **憑證注入**：你不需要將 API 金鑰或秘密持有人 token 儲存在 `.agents/hooks.json` 內，也不需要將其掛載到容器中。只要將秘密儲存為一份 [credential](/docs/agent-credentials/)，並在環境的 `network.allowlist` 中以 ID 參照即可。出口 proxy 會自動攔截對外的 HTTP hook 流量，並在離開沙箱前於傳輸過程中注入真正的驗證標頭。行內的 `transform` 規則同樣是在傳輸過程中設定標頭；若你想在整個專案中共用秘密並集中在一處輪替，credential 才是合適的選擇。詳見[網路設定](/docs/agent-environment/#network-configuration)。

## 執行環境如何處理決策與失敗 {#execution-and-failure-semantics}

* **同步等待**：代理會暫停並等待你的 hook 完成後才繼續。
* **阻擋工具執行**：若你的工具前 hook 回傳 `{"decision": "deny", "reason": "<your reason>"}`，執行環境會立即取消該工具呼叫。模型會在對話記錄中看到你的拒絕原因，並據此改選安全的替代方案，或向使用者說明阻擋的緣由。
* **處理指令碼當機、HTTP 錯誤與逾時**：若指令碼當機（結束狀態非零）、HTTP hook 回傳非 2xx 狀態碼（例如 4xx 或 5xx 伺服器錯誤），或操作逾時、回傳無法辨識的 JSON，執行環境會將其視為核准（`allow`）。工具執行會照常繼續，因此損壞的指令碼或無法連線的遙測伺服器絕不會讓你的應用程式陷入死結。

## 常見使用案例 {#common-use-cases}

### 資料隱私與法規遵循的多回合復原 {#data-privacy-recovery}

當 hook 阻擋了對受限資源的存取（例如包含個人識別資訊（PII）或機密財務記錄的目錄），你可以在下一次呼叫時傳入 `previous_interaction_id`，在同一個環境中接續該回合。代理會讀取拒絕說明，並自動改為查詢已核准的公開資料表來復原。


=== "Python"

      ```python
      import json
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      hooks_config = {
          "privacy-gate": {
              "pre_tool_execution": [
                  {
                      "matcher": "view_file",
                      "hooks": [
                          {
                              "type": "command",
                              "command": "python3 /.agents/hooks-scripts/check_privacy.py",
                              "timeout": 5,
                          }
                      ],
                  }
              ]
          }
      }

      check_privacy_script = """#!/usr/bin/env python3
      import sys, json
      data = json.load(sys.stdin)
      path = str(data.get("tool_call", {}).get("args", {}).get("path", ""))

      if "/private/" in path:
          resp = {
              "decision": "deny",
              "reason": "Access to confidential `/private/` records is blocked by PII compliance policy. Query approved `/public/` summary tables instead."
          }
      else:
          resp = {"decision": "allow"}

      print(json.dumps(resp))
      """

      # Step 1: Agent attempts to read confidential PII records and is intercepted
      int_1 = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Use your filesystem tool to read `/workspace/private/employees.json` and summarize the employee details.",
          environment={
              "type": "remote",
              "sources": [
                  {
                      "type": "inline",
                      "target": ".agents/hooks.json",
                      "content": json.dumps(hooks_config, indent=2),
                  },
                  {
                      "type": "inline",
                      "target": ".agents/hooks-scripts/check_privacy.py",
                      "content": check_privacy_script,
                  },
                  {
                      "type": "inline",
                      "target": "workspace/private/employees.json",
                      "content": '{"employees": [{"id": 1, "salary": 150000, "ssn": "000-00-0000"}]}',
                  },
                  {
                      "type": "inline",
                      "target": "workspace/public/summary.json",
                      "content": '{"department": "Engineering", "team_size": 42, "status": "active"}',
                  },
              ],
          },
      )
      print(int_1.output_text)

      # Step 2: Continue in the same environment using previous_interaction_id; agent recovers with public tables
      int_2 = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Understood. Please read the approved `/workspace/public/summary.json` file instead and provide the summary.",
          environment=int_1.environment_id,
          previous_interaction_id=int_1.id,
      )
      print(int_2.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const hooksConfig = {
          "privacy-gate": {
              pre_tool_execution: [
                  {
                      matcher: "view_file",
                      hooks: [
                          {
                              type: "command",
                              command: "python3 /.agents/hooks-scripts/check_privacy.py",
                              timeout: 5,
                          },
                      ],
                  },
              ],
          },
      };

      const checkPrivacyScript = `#!/usr/bin/env python3
      import sys, json
      data = json.load(sys.stdin)
      path = str(data.get("tool_call", {}).get("args", {}).get("path", ""))

      if "/private/" in path:
          resp = {
              "decision": "deny",
              "reason": "Access to confidential \`/private/\` records is blocked by PII compliance policy. Query approved \`/public/\` summary tables instead."
          }
      else:
          resp = {"decision": "allow"}

      print(json.dumps(resp))
      `;

      const int1 = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Use your filesystem tool to read `/workspace/private/employees.json` and summarize the employee details.",
          environment: {
              type: "remote",
              sources: [
                  {
                      type: "inline",
                      "target": ".agents/hooks.json",
                      content: JSON.stringify(hooksConfig, null, 2),
                  },
                  {
                      type: "inline",
                      "target": ".agents/hooks-scripts/check_privacy.py",
                      content: checkPrivacyScript,
                  },
                  {
                      type: "inline",
                      "target": "workspace/private/employees.json",
                      content: '{"employees": [{"id": 1, "salary": 150000, "ssn": "000-00-0000"}]}',
                  },
                  {
                      type: "inline",
                      "target": "workspace/public/summary.json",
                      content: '{"department": "Engineering", "team_size": 42, "status": "active"}',
                  },
              ],
          },
      });
      console.log(int1.output_text);

      const int2 = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Understood. Please read the approved `/workspace/public/summary.json` file instead and provide the summary.",
          environment: int1.environment_id,
          previous_interaction_id: int1.id,
      });
      console.log(int2.output_text);
      ```

=== "REST"

      ```bash
      # Step 1: Attempt to access restricted PII directory (blocked by hook)
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
            "agent": "antigravity-preview-09-2026",
            "input": [{"type": "text", "text": "Use your filesystem tool to read /workspace/private/employees.json and summarize the employee details."}],
            "environment": {
                "type": "remote",
                "sources": [
                    {
                        "type": "inline",
                        "target": ".agents/hooks.json",
                        "content": "{\"privacy-gate\": {\"pre_tool_execution\": [{\"matcher\": \"view_file\", \"hooks\": [{\"type\": \"command\", \"command\": \"python3 /.agents/hooks-scripts/check_privacy.py\", \"timeout\": 5}]}]}}"
                    },
                    {
                        "type": "inline",
                        "target": ".agents/hooks-scripts/check_privacy.py",
                        "content": "#!/usr/bin/env python3\nimport sys, json\ndata = json.load(sys.stdin)\npath = str(data.get(\"tool_call\", {}).get(\"args\", {}).get(\"path\", \"\"))\nif \"/private/\" in path:\n    resp = {\"decision\": \"deny\", \"reason\": \"Access to confidential `/private/` records is blocked by PII compliance policy. Query approved `/public/` summary tables instead.\"}\nelse:\n    resp = {\"decision\": \"allow\"}\nprint(json.dumps(resp))\n"
                    },
                    {
                        "type": "inline",
                        "target": "workspace/private/employees.json",
                        "content": "{\"employees\": [{\"id\": 1, \"salary\": 150000, \"ssn\": \"000-00-0000\"}]}"
                    },
                    {
                        "type": "inline",
                        "target": "workspace/public/summary.json",
                        "content": "{\"department\": \"Engineering\", \"team_size\": 42, \"status\": \"active\"}"
                    }
                ]
            }
        }'

      # Step 2: Continue in the same environment using $ENV_ID and $INTERACTION_ID from the previous response
      # curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      #   -H "Content-Type: application/json" \
      #   -H "x-goog-api-key: $GEMINI_API_KEY" \
      #   -d '{
      #       "agent": "antigravity-preview-09-2026",
      #       "input": [{"type": "text", "text": "Understood. Please read the approved /workspace/public/summary.json file instead and provide the summary."}],
      #       "environment": "'"$ENV_ID"'",
      #       "previous_interaction_id": "'"$INTERACTION_ID"'"
      #   }'
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

      String hooksConfig = """
      {
        "privacy-gate": {
          "pre_tool_execution": [
            {
              "matcher": "read_file",
              "hooks": [
                {
                  "type": "command",
                  "command": "python3 /.agents/hooks-scripts/check_privacy.py",
                  "timeout": 5
                }
              ]
            }
          ]
        }
      }
      """;

      String checkPrivacyScript = "#!/usr/bin/env python3\n"
          + "import sys, json\n"
          + "data = json.load(sys.stdin)\n"
          + "path = str(data.get(\"tool_call\", {}).get(\"args\", {}).get(\"path\", \"\"))\n"
          + "if \"/private/\" in path:\n"
          + "    resp = {\n"
          + "        \"decision\": \"deny\",\n"
          + "        \"reason\": \"Access to confidential `/private/` records is blocked by PII compliance policy. Query approved `/public/` summary tables instead.\"\n"
          + "    }\n"
          + "else:\n"
          + "    resp = {\"decision\": \"allow\"}\n"
          + "print(json.dumps(resp))\n";

      Environment env = Environment.builder()
          .sources(List.of(
              Source.builder()
                  .type(SourceType.INLINE)
                  .target(".agents/hooks.json")
                  .content(hooksConfig)
                  .build(),
              Source.builder()
                  .type(SourceType.INLINE)
                  .target(".agents/hooks-scripts/check_privacy.py")
                  .content(checkPrivacyScript)
                  .build(),
              Source.builder()
                  .type(SourceType.INLINE)
                  .target("workspace/private/employees.json")
                  .content("{\"employees\": [{\"id\": 1, \"salary\": 150000, \"ssn\": \"000-00-0000\"}]}")
                  .build(),
              Source.builder()
                  .type(SourceType.INLINE)
                  .target("workspace/public/summary.json")
                  .content("{\"department\": \"Engineering\", \"team_size\": 42, \"status\": \"active\"}")
                  .build()
          ))
          .build();

      // Step 1: Agent attempts to read confidential PII records and is intercepted
      CreateAgentInteraction params1 = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Use your filesystem tool to read `/workspace/private/employees.json` and summarize the employee details."))
          .environment(CreateAgentInteractionEnvironment.of(env))
          .build();

      Interaction int1 = client.interactions.create(CreateInteractionRequestBody.of(params1)).interaction().get();
      System.out.println(int1.outputText().orElse(""));

      // Step 2: Continue in the same environment using previous_interaction_id; agent recovers with public tables
      CreateAgentInteraction params2 = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Understood. Please read the approved `/workspace/public/summary.json` file instead and provide the summary."))
          .environment(CreateAgentInteractionEnvironment.of(int1.environmentId().orElse("")))
          .previousInteractionId(int1.id().orElse(""))
          .build();

      Interaction int2 = client.interactions.create(CreateInteractionRequestBody.of(params2)).interaction().get();
      System.out.println(int2.outputText().orElse(""));
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

          hooksConfig := `{
        "privacy-gate": {
          "pre_tool_execution": [
            {
              "matcher": "read_file",
              "hooks": [
                {
                  "type": "command",
                  "command": "python3 /.agents/hooks-scripts/check_privacy.py",
                  "timeout": 5
                }
              ]
            }
          ]
        }
      }`

          checkPrivacyScript := `#!/usr/bin/env python3
      import sys, json
      data = json.load(sys.stdin)
      path = str(data.get("tool_call", {}).get("args", {}).get("path", ""))
      if "/private/" in path:
          resp = {
              "decision": "deny",
              "reason": "Access to confidential '/private/' records is blocked by PII compliance policy. Query approved '/public/' summary tables instead."
          }
      else:
          resp = {"decision": "allow"}
      print(json.dumps(resp))
      `

          env := interactions.Environment{
              Sources: []interactions.Source{
                  {
                      Type:    interactions.SourceTypeInline.ToPointer(),
                      Target:  genai.Ptr(".agents/hooks.json"),
                      Content: genai.Ptr(hooksConfig),
                  },
                  {
                      Type:    interactions.SourceTypeInline.ToPointer(),
                      Target:  genai.Ptr(".agents/hooks-scripts/check_privacy.py"),
                      Content: genai.Ptr(checkPrivacyScript),
                  },
                  {
                      Type:    interactions.SourceTypeInline.ToPointer(),
                      Target:  genai.Ptr("workspace/private/employees.json"),
                      Content: genai.Ptr(`{"employees": [{"id": 1, "salary": 150000, "ssn": "000-00-0000"}]}`),
                  },
                  {
                      Type:    interactions.SourceTypeInline.ToPointer(),
                      Target:  genai.Ptr("workspace/public/summary.json"),
                      Content: genai.Ptr(`{"department": "Engineering", "team_size": 42, "status": "active"}`),
                  },
              },
          }

          // Step 1: Agent attempts to read confidential PII records and is intercepted
          res1, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:       interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:       interactions.NewInteractionsInput("Use your filesystem tool to read `/workspace/private/employees.json` and summarize the employee details."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(env)),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          int1 := res1.Interaction
          if int1.OutputText != nil {
              fmt.Println(*int1.OutputText)
          }

          // Step 2: Continue in the same environment using previous_interaction_id; agent recovers with public tables
          res2, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:                 interactions.AgentOption("antigravity-preview-09-2026"),
                  Input:                 interactions.NewInteractionsInput("Understood. Please read the approved `/workspace/public/summary.json` file instead and provide the summary."),
                  Environment:           genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(*int1.EnvironmentID)),
                  PreviousInteractionID: int1.ID,
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if res2.Interaction.OutputText != nil {
              fmt.Println(*res2.Interaction.OutputText)
          }
      }
      ```


### 外部稽核記錄與遙測 {#external-audit-logging}

每當檔案被讀取或修改時，將即時稽核事件從沙箱內傳送至外部監控伺服器。

* **比對多個工具**：由於 matcher 使用標準正規表示式，你可以用直線（`view_file|write_to_file|replace_file_content`）或萬用字元（`.*_file`），在單一規則中組合多個工具。
* **讓秘密遠離你的設定**：將驗證 token 儲存為 [credential](/docs/agent-credentials/)，並在環境的[網路設定](/docs/agent-environment/#network-configuration)（`network.allowlist.credential`）中以 ID 參照。出口 proxy 會在對外要求中注入真正的持有人 token。本範例改以 `transform` 行內設定標頭，同樣受到相同 proxy 的保護，適用於 token 只屬於這一組設定的情況。


=== "Python"

      ```python
      import json
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # Define hook without secrets; the egress proxy injects headers dynamically
      hooks_config = {
          "audit-logging": {
              "post_tool_execution": [
                  {
                      "matcher": "view_file|write_to_file|replace_file_content",
                      "hooks": [
                          {
                              "type": "http",
                              "url": "https://telemetry.example.com/api/v1/agent-events",
                              "timeout": 10,
                          }
                      ],
                  }
              ]
          }
      }

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Use your filesystem tool to create `/workspace/audit.log` containing 'event 1', then immediately read it back using your filesystem read tool.",
          environment={
              "type": "remote",
              "sources": [
                  {
                      "type": "inline",
                      "target": ".agents/hooks.json",
                      "content": json.dumps(hooks_config, indent=2),
                  }
              ],
              "network": {
                  "allowlist": [
                      {
                          "domain": "telemetry.example.com",
                          "transform": {
                              "Authorization": "Bearer telemetry_secret_token_123",
                          },
                      },
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

      // Define hook without secrets; the egress proxy injects headers dynamically
      const hooksConfig = {
          "audit-logging": {
              post_tool_execution: [
                  {
                      matcher: "view_file|write_to_file|replace_file_content",
                      hooks: [
                          {
                              type: "http",
                              url: "https://telemetry.example.com/api/v1/agent-events",
                              timeout: 10,
                          },
                      ],
                  },
              ],
          },
      };

      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Use your filesystem tool to create `/workspace/audit.log` containing 'event 1', then immediately read it back using your filesystem read tool.",
          environment: {
              type: "remote",
              sources: [
                  {
                      type: "inline",
                      target: ".agents/hooks.json",
                      content: JSON.stringify(hooksConfig, null, 2),
                  },
              ],
              network: {
                  allowlist: [
                      {
                          domain: "telemetry.example.com",
                          transform: {
                              Authorization: "Bearer telemetry_secret_token_123",
                          },
                      },
                      { domain: "*" },
                  ],
              },
          },
      });
      console.log(interaction.output_text);
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
            "agent": "antigravity-preview-09-2026",
            "input": [{"type": "text", "text": "Use your filesystem tool to create /workspace/audit.log containing event 1, then immediately read it back using your filesystem read tool."}],
            "environment": {
                "type": "remote",
                "sources": [
                    {
                        "type": "inline",
                        "target": ".agents/hooks.json",
                        "content": "{\"audit-logging\": {\"post_tool_execution\": [{\"matcher\": \"view_file|write_to_file|replace_file_content\", \"hooks\": [{\"type\": \"http\", \"url\": \"https://telemetry.example.com/api/v1/agent-events\", \"timeout\": 10}]}]}}"
                    }
                ],
                "network": {
                    "allowlist": [
                        {
                            "domain": "telemetry.example.com",
                            "transform": {
                                "Authorization": "Bearer telemetry_secret_token_123"
                            }
                        },
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
      import com.google.genai.gaos.models.interactions.Source;
      import com.google.genai.gaos.models.interactions.SourceType;
      import com.google.genai.gaos.models.interactions.Transform;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.List;
      import java.util.Map;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      // Define hook without secrets; the egress proxy injects headers dynamically
      String hooksConfig = """
      {
        "audit-logging": {
          "post_tool_execution": [
            {
              "matcher": "read_file|write_file",
              "hooks": [
                {
                  "type": "http",
                  "url": "https://telemetry.example.com/api/v1/agent-events",
                  "timeout": 10
                }
              ]
            }
          ]
        }
      }
      """;

      Environment env = Environment.builder()
          .sources(List.of(
              Source.builder()
                  .type(SourceType.INLINE)
                  .target(".agents/hooks.json")
                  .content(hooksConfig)
                  .build()
          ))
          .network(Network.of(
              EnvironmentNetworkEgressAllowlist.builder()
                  .allowlist(Allowlist.of(List.of(
                      AllowlistEntry.builder()
                          .domain("telemetry.example.com")
                          .transform(Transform.of(Map.of(
                              "Authorization", "Bearer telemetry_secret_token_123"
                          )))
                          .build(),
                      AllowlistEntry.builder().domain("*").build()
                  )))
                  .build()
          ))
          .build();

      CreateAgentInteraction params = CreateAgentInteraction.builder()
          .agent(AgentOption.of("antigravity-preview-09-2026"))
          .input(InteractionsInput.of("Use your filesystem tool to create `/workspace/audit.log` containing 'event 1', then immediately read it back using your filesystem read tool."))
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

          // Define hook without secrets; the egress proxy injects headers dynamically
          hooksConfig := `{
        "audit-logging": {
          "post_tool_execution": [
            {
              "matcher": "read_file|write_file",
              "hooks": [
                {
                  "type": "http",
                  "url": "https://telemetry.example.com/api/v1/agent-events",
                  "timeout": 10
                }
              ]
            }
          ]
        }
      }`

          env := interactions.Environment{
              Sources: []interactions.Source{
                  {
                      Type:    interactions.SourceTypeInline.ToPointer(),
                      Target:  genai.Ptr(".agents/hooks.json"),
                      Content: genai.Ptr(hooksConfig),
                  },
              },
              Network: genai.Ptr(interactions.NewNetwork(interactions.EnvironmentNetworkEgressAllowlist{
                  Allowlist: genai.Ptr(interactions.NewAllowlist([]interactions.AllowlistEntry{
                      {
                          Domain: "telemetry.example.com",
                          Transform: genai.Ptr(interactions.NewTransform(map[string]string{
                              "Authorization": "Bearer telemetry_secret_token_123",
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
                  Input:       interactions.NewInteractionsInput("Use your filesystem tool to create `/workspace/audit.log` containing 'event 1', then immediately read it back using your filesystem read tool."),
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


## 限制 {#limitations}

* **沙箱工具範圍**：Hook 會攔截沙箱內的內建工具：程式碼執行（`code_execution`）與檔案系統操作（`view_file`、`write_to_file`、`replace_file_content`、`list_dir` 與 `delete_file`）。對於在容器外處理的自訂函式呼叫（`function`）或外部 Model Context Protocol（`mcp_server`）工具，則不會觸發。
* **網路允許清單**：HTTP hook 在容器網路內執行。你必須在環境的 `network.allowlist` 中明確允許目標 URL。回送位址（`localhost`、`127.0.0.1`）會被 proxy 阻擋。
* **發生錯誤時自動核准**：若 hook 指令碼當機（結束狀態非零）、逾時或失敗，執行環境會記錄該失敗，並允許工具呼叫繼續進行。這能確保損壞的 linter 指令碼或卡住的行程絕不會讓你的應用程式陷入死結。
* **沙箱設定保護**：由於 hook 是在容器沙箱內執行，擁有檔案系統寫入工具或 shell 程式碼執行權限的代理，可以修改本機的 `.agents/hooks.json`，或可寫入工作區內的指令碼。請將容器 hook 視為自動化的政策指引與作業防護；若需要嚴格防範不受信任的模型執行竄改設定，請從唯讀存放庫掛載設定來源。

## 後續步驟 {#whats-next}

- 瞭解如何設定常駐的[遠端沙箱與環境](/docs/agent-environment/)。
- 探索 [Antigravity agent](/docs/antigravity-agent/) 的功能與內建工具。
- 查閱 [Interactions API 總覽](/docs/interactions-overview/)，瞭解多回合工作階段與串流。

