# 受管理代理的憑證 {#credentials}

憑證是由伺服器管理的密鑰，讓代理能存取第三方服務，同時確保密鑰不會進入
代理的執行環境。您只需儲存憑證一次，之後以 ID 參照它，egress proxy 會在
請求發出時解析並注入該憑證。

密鑰值僅可寫入。一旦儲存，任何端點都不會再回傳它，因此即使代理遭到入侵，
也無法讀回自己正在使用的 token。

憑證的主要使用位置是 [`environment.network`](/docs/agent-environment/)
上的網路許可清單。請先儲存密鑰：


=== "Python"

      ```py
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      credential = client.credentials.create(
          id="github-production",
          type="bearer_token",
          token="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      )

      print(f"Credential ID: {credential.id}, Status: {credential.status}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const credential = await client.credentials.create({
          id: "github-production",
          type: "bearer_token",
          token: "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      });

      console.log(`Credential ID: ${credential.id}, Status: ${credential.status}`);
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/credentials"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Credentials.Create(ctx, operations.CreateCredentialRequest{
              Body: credentials.NewCredentialCreateParams(credentials.HTTPBearerConfig{
                  ID:    "github-production",
                  Token: "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("Credential ID: %s, Status: %v\n", res.Credential.ID, res.Credential.GetStatus())
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/credentials" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "id": "github-production",
          "type": "bearer_token",
          "token": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }'
      ```

=== "CLI"

      ```bash
      gemini-api credentials create --body '{
        "id": "github-production",
        "type": "bearer_token",
        "token": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }'
      ```


接著將它附加到要驗證的網域：


=== "Python"

      ```py
      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Triage the open issues in my-org/my-repo.",
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
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Triage the open issues in my-org/my-repo.",
          environment: {
              type: "remote",
              network: {
                  allowlist: [
                      { domain: "api.github.com", credential: "github-production" },
                      { domain: "*" },
                  ],
              },
          },
      });
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
                  Agent: interactions.AgentOption("antigravity-preview-09-2026"),
                  Input: interactions.NewInteractionsInput("Triage the open issues in my-org/my-repo."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(interactions.Environment{
                      Network: genai.Ptr(interactions.NewNetwork(interactions.EnvironmentNetworkEgressAllowlist{
                          Allowlist: genai.Ptr(interactions.NewAllowlist([]interactions.AllowlistEntry{
                              {Domain: "api.github.com", Credential: genai.Ptr("github-production")},
                              {Domain: "*"},
                          })),
                      })),
                  })),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(res.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Triage the open issues in my-org/my-repo.",
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

=== "CLI"

      ```bash
      gemini-api agent run "Triage the open issues in my-org/my-repo." \
        --agent antigravity-preview-09-2026 \
        --body '{
          "environment": {
            "type": "remote",
            "network": {"allowlist": [
              {"domain": "api.github.com", "credential": "github-production"},
              {"domain": "*"}
            ]}
          }
        }'
      ```


代理現在就能向 `api.github.com` 發出已驗證的請求，而 token 自始至終不會
存在於沙箱之中。

## 憑證類型 {#credential-types}

每個憑證都有一個 `type`，決定它可接受哪些欄位，以及 proxy 如何套用它。

| 類型 | 使用情境 | 行為 |
| :--- | :--- | :--- |
| `bearer_token` | 個人存取 token、機器人 token、靜態 API 金鑰 | proxy 會將 token 注入為請求標頭，不含重新整理邏輯。 |
| `oauth2` | OAuth 應用程式與使用者委派流程 | proxy 會以更新 token 交換存取 token，並在存取 token 到期時自動重新整理。 |
| `environment_variable` | 從行程環境讀取密鑰的用戶端 SDK | 代理的環境會收到一個佔位符，proxy 會在送出請求時將其替換為真正的密鑰。 |

## 在網路許可清單中使用憑證 {#network-allowlist}

只要在許可清單規則中加入 `credential`，proxy 就會驗證每一個送往該網域的
對外請求。若要讓代理存取私人 API、私人存放區或私人 bucket，建議採用這種
方式。

同一份許可清單可以混用已驗證與未驗證的規則：


=== "Python"

      ```py
      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Sync the open Jira issues into the tracking sheet in my repo.",
          environment={
              "type": "remote",
              "sources": [
                  {
                      "type": "repository",
                      "source": "https://github.com/your-org/backend",
                      "target": "/backend-app",
                  }
              ],
              "network": {
                  "allowlist": [
                      {"domain": "github.com", "credential": "github-production"},
                      {"domain": "api.atlassian.com", "credential": "jira-oauth"},
                      {"domain": "*.googleapis.com"},
                  ]
              },
          },
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Sync the open Jira issues into the tracking sheet in my repo.",
          environment: {
              type: "remote",
              sources: [
                  {
                      type: "repository",
                      source: "https://github.com/your-org/backend",
                      target: "/backend-app",
                  },
              ],
              network: {
                  allowlist: [
                      { domain: "github.com", credential: "github-production" },
                      { domain: "api.atlassian.com", credential: "jira-oauth" },
                      { domain: "*.googleapis.com" },
                  ],
              },
          },
      });
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
                  Agent: interactions.AgentOption("antigravity-preview-09-2026"),
                  Input: interactions.NewInteractionsInput("Sync the open Jira issues into the tracking sheet in my repo."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(interactions.Environment{
                      Sources: []interactions.Source{
                          {
                              Type:   interactions.SourceTypeRepository.ToPointer(),
                              Source: genai.Ptr("https://github.com/your-org/backend"),
                              Target: genai.Ptr("/backend-app"),
                          },
                      },
                      Network: genai.Ptr(interactions.NewNetwork(interactions.EnvironmentNetworkEgressAllowlist{
                          Allowlist: genai.Ptr(interactions.NewAllowlist([]interactions.AllowlistEntry{
                              {Domain: "github.com", Credential: genai.Ptr("github-production")},
                              {Domain: "api.atlassian.com", Credential: genai.Ptr("jira-oauth")},
                              {Domain: "*.googleapis.com"},
                          })),
                      })),
                  })),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(res.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Sync the open Jira issues into the tracking sheet in my repo.",
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
                      { "domain": "github.com", "credential": "github-production" },
                      { "domain": "api.atlassian.com", "credential": "jira-oauth" },
                      { "domain": "*.googleapis.com" }
                  ]
              }
          }
      }'
      ```


由於 proxy 會針對每個請求逐一解析憑證，`oauth2` 憑證的存取 token 會在背景
自動重新整理。即使存取 token 到期，長時間執行的互動也不會因此中斷。

### 同時使用 `credential` 與 `transform` {#credential-and-transform}

許可清單規則也可接受內嵌的
[`transform`](/docs/agent-environment/#private-sources) 物件，直接在規則上
設定標頭。兩種機制都是由 egress proxy 在傳輸過程中套用，因此無論哪一種，
標頭值都不會存在於沙箱之中。兩個欄位也可以同時出現在同一條規則上。

| 規則設定 | 行為 |
| :--- | :--- |
| 僅 `credential` | proxy 會解析憑證，並在每個送往該網域的請求中注入其標頭。 |
| 僅 `transform` | 靜態標頭注入，您寫入的標頭會原樣送出。 |
| 兩者皆有 | 先套用憑證，再將 `transform` 疊加其上。若兩者設定了相同的鍵，明確指定的 `transform` 標頭優先。 |
| 兩者皆無 | 允許該網域，但不注入任何標頭。 |

當您希望只儲存一次密鑰，就能在專案中的每個環境、代理與觸發條件裡參照它，
並且希望存取 token 的重新整理與輪替都自動處理時，使用憑證最合適。內嵌的
`transform` 則適用於只屬於單次呼叫的值，例如您在建立互動之前自行產生的
token。

兩者併用相當常見：憑證負責攜帶驗證標頭，`transform` 則補上上游服務在同一
請求中預期的其他內容：

```json
{
    "domain": "api.atlassian.com",
    "credential": "jira-oauth",
    "transform": {
        "X-Atlassian-Workspace": "my-workspace-id"
    }
}
```

若要把密鑰從內嵌的 `transform` 移入憑證，請以 `POST /credentials` 儲存它，
將 `transform` 中的驗證標頭替換為 `"credential": "<id>"`，其餘 `transform`
物件內容保持不變。

## 在 MCP 伺服器中使用憑證 {#mcp-servers}

遠端 MCP 伺服器同樣接受 `credential` 欄位。在 `mcp_server` 工具上設定它，
proxy 就會將驗證標頭注入每一個送往該伺服器的請求：


=== "Python"

      ```py
      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Create a new issue in my-org/my-repo",
          environment="remote",
          tools=[{
              "type": "mcp_server",
              "name": "github",
              "url": "https://api.githubcopilot.com/mcp",
              "credential": "github-production",
          }],
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Create a new issue in my-org/my-repo",
          environment: "remote",
          tools: [{
              type: "mcp_server",
              name: "github",
              url: "https://api.githubcopilot.com/mcp",
              credential: "github-production",
          }],
      });
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
                  Agent: interactions.AgentOption("antigravity-preview-09-2026"),
                  Input: interactions.NewInteractionsInput("Create a new issue in my-org/my-repo"),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(interactions.Environment{
                      Network: genai.Ptr(interactions.NewNetwork(interactions.EnvironmentNetworkEgressAllowlist{
                          Allowlist: genai.Ptr(interactions.NewAllowlist([]interactions.AllowlistEntry{
                              {Domain: "api.githubcopilot.com", Credential: genai.Ptr("github-production")},
                          })),
                      })),
                  })),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.MCPServer{
                          Name: genai.Ptr("github"),
                          URL:  genai.Ptr("https://api.githubcopilot.com/mcp"),
                      }),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(res.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Create a new issue in my-org/my-repo",
          "environment": "remote",
          "tools": [
              {
                  "type": "mcp_server",
                  "name": "github",
                  "url": "https://api.githubcopilot.com/mcp",
                  "credential": "github-production"
              }
          ]
      }'
      ```


`credential` 與 `headers` 遵循與許可清單相同的優先順序規則：先套用憑證，
再將 `headers` 疊加其上，因此若兩者設定了相同的鍵，明確指定的標頭優先：

```json
{
    "type": "mcp_server",
    "name": "jira",
    "url": "https://jira.atlassian.com/mcp",
    "credential": "jira-oauth",
    "headers": {
        "X-Atlassian-Workspace": "my-workspace-id"
    }
}
```

若要把密鑰從內嵌的 `headers` 移入憑證，請以 `POST /credentials` 儲存它，
並將 `headers` 中的驗證項目替換為 `credential`，其餘標頭保持原位。

## 將憑證用作環境變數 {#environment-variables}

有些用戶端程式庫會從行程環境讀取密鑰，而非透過請求標頭接收。Socket 模式
與長輪詢用戶端就是常見的例子。

將 `environment_variable` 憑證綁定到 `environment.env` 下的變數名稱：


=== "Python"

      ```py
      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Run the sync script and check notifications.",
          environment={
              "type": "remote",
              "env": {
                  "NODE_ENV": "production",
                  "SLACK_BOT_TOKEN": {"credential": "slack-bot-token"},
              },
          },
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          agent: "antigravity-preview-09-2026",
          input: "Run the sync script and check notifications.",
          environment: {
              type: "remote",
              env: {
                  NODE_ENV: "production",
                  SLACK_BOT_TOKEN: { credential: "slack-bot-token" },
              },
          },
      });
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
                  Agent: interactions.AgentOption("antigravity-preview-09-2026"),
                  Input: interactions.NewInteractionsInput("Run the sync script and check notifications."),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment(interactions.Environment{
                      Env: genai.Ptr(interactions.NewEnv(map[string]interactions.EnvVar{
                          "NODE_ENV":        {Value: genai.Ptr("production")},
                          "SLACK_BOT_TOKEN": {Credential: genai.Ptr("slack-bot-token")},
                      })),
                  })),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(res.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Run the sync script and check notifications.",
          "environment": {
              "type": "remote",
              "env": {
                  "NODE_ENV": "production",
                  "SLACK_BOT_TOKEN": { "credential": "slack-bot-token" }
              }
          }
      }'
      ```

=== "CLI"

      ```bash
      gemini-api agent run "Run the sync script and check notifications." \
        --agent antigravity-preview-09-2026 \
        --body '{
          "environment": {
            "type": "remote",
            "env": {"NODE_ENV": "production", "SLACK_BOT_TOKEN": {"credential": "slack-bot-token"}}
          }
        }'
      ```


`env` 可以同時接受字面字串與憑證參照。字面字串會以一般純文字變數的形式
注入容器。

憑證參照則不然。變數收到的是佔位符 `__GEMINI_CRED_<credential-id>__`，
proxy 只會在對外請求送往憑證 `trusted_domains` 所列網域時，才換入真正的
密鑰。送往其他網域的請求會被拒絕，因此密鑰永遠不會離開邊界，佔位符也不會
被誤送出去。

注意：字面值會以純文字形式注入，沙箱中執行的任何程式（包括代理本身）都
能讀取。請將它們用於 `NODE_ENV` 這類設定，而非密鑰。密鑰應存放在憑證中，
這是唯一會取得佔位符並在傳輸時替換的形式。

`trusted_domains` 必須為每個 `environment_variable` 憑證設定。它是用來
限定密鑰可用範圍的控管機制。

## 建立憑證 {#create-a-credential}

每個建立請求都需要 `type`，以及該類型所要求的各項欄位。

直接呼叫 REST 時，所有欄位名稱都使用 snake_case。傳送 camelCase 欄位會
回傳 `400`。

### Bearer token {#bearer-token}

Bearer token 憑證只需要 `token`：


=== "Python"

      ```py
      credential = client.credentials.create(
          id="github-production",
          type="bearer_token",
          token="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      )
      ```

=== "JavaScript"

      ```javascript
      const credential = await client.credentials.create({
          id: "github-production",
          type: "bearer_token",
          token: "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      });
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/credentials"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Credentials.Create(ctx, operations.CreateCredentialRequest{
              Body: credentials.NewCredentialCreateParams(credentials.HTTPBearerConfig{
                  ID:    "github-production",
                  Token: "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("Created credential: %s\n", res.Credential.ID)
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/credentials" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "id": "github-production",
          "type": "bearer_token",
          "token": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }'
      ```

=== "CLI"

      ```bash
      gemini-api credentials create --body '{
        "id": "github-production",
        "type": "bearer_token",
        "token": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }'
      ```


回應只會回傳中繼資料，絕不包含 token：

```json
{
  "id": "github-production",
  "type": "bearer_token",
  "status": "active",
  "create_time": "2026-07-15T10:00:00.000000000Z",
  "update_time": "2026-07-15T10:00:00.000000000Z"
}
```

proxy 預設會送出 `Authorization: Bearer <token>`。若目標服務預期的是其他
格式，可覆寫 `header_name` 與 `prefix`：


=== "Python"

      ```py
      credential = client.credentials.create(
          id="my-api-key",
          type="bearer_token",
          token="key_xxxxxxxxxxxx",
          header_name="x-goog-api-key",
          prefix="",
      )
      ```

=== "JavaScript"

      ```javascript
      const credential = await client.credentials.create({
          id: "my-api-key",
          type: "bearer_token",
          token: "key_xxxxxxxxxxxx",
          header_name: "x-goog-api-key",
          prefix: "",
      });
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/credentials"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Credentials.Create(ctx, operations.CreateCredentialRequest{
              Body: credentials.NewCredentialCreateParams(credentials.HTTPBearerConfig{
                  ID:         "my-api-key",
                  Token:      "key_xxxxxxxxxxxx",
                  HeaderName: genai.Ptr("x-goog-api-key"),
                  Prefix:     genai.Ptr(""),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("Created credential: %s\n", res.Credential.ID)
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/credentials" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "id": "my-api-key",
          "type": "bearer_token",
          "token": "key_xxxxxxxxxxxx",
          "header_name": "x-goog-api-key",
          "prefix": ""
      }'
      ```

=== "CLI"

      ```bash
      gemini-api credentials create --body '{
        "id": "my-api-key",
        "type": "bearer_token",
        "token": "key_xxxxxxxxxxxx",
        "header_name": "x-goog-api-key",
        "prefix": ""
      }'
      ```


這組設定會產生 `x-goog-api-key: key_xxxxxxxxxxxx` 標頭。

下表說明 `header_name` 與 `prefix` 如何組合：

| 設定 | 注入的標頭 |
| :--- | :--- |
| `{"token": "ghp_xxx"}` | `Authorization: Bearer ghp_xxx` |
| `{"token": "sk_live_xxx"}` | `Authorization: Bearer sk_live_xxx` |
| `{"token": "key_xxx", "header_name": "x-goog-api-key", "prefix": ""}` | `x-goog-api-key: key_xxx` |
| `{"token": "mytoken", "header_name": "X-API-Token", "prefix": ""}` | `X-API-Token: mytoken` |

### OAuth2 {#oauth2}

OAuth2 憑證需要 `client_id`、`client_secret`、`refresh_token` 與
`token_url`。`scopes` 欄位為選填：


=== "Python"

      ```py
      credential = client.credentials.create(
          id="jira-oauth",
          type="oauth2",
          client_id="my-client-id",
          client_secret="my-client-secret",
          token_url="https://auth.atlassian.com/oauth/token",
          refresh_token="rt_xxxxxxxxxxxxxxxxxxxx",
          scopes=["read:jira-work", "write:jira-work"],
      )
      ```

=== "JavaScript"

      ```javascript
      const credential = await client.credentials.create({
          id: "jira-oauth",
          type: "oauth2",
          client_id: "my-client-id",
          client_secret: "my-client-secret",
          token_url: "https://auth.atlassian.com/oauth/token",
          refresh_token: "rt_xxxxxxxxxxxxxxxxxxxx",
          scopes: ["read:jira-work", "write:jira-work"],
      });
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/credentials"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Credentials.Create(ctx, operations.CreateCredentialRequest{
              Body: credentials.NewCredentialCreateParams(credentials.OAuth2Config{
                  ID:           "jira-oauth",
                  ClientID:     "my-client-id",
                  ClientSecret: "my-client-secret",
                  TokenURL:     "https://auth.atlassian.com/oauth/token",
                  RefreshToken: "rt_xxxxxxxxxxxxxxxxxxxx",
                  Scopes:       []string{"read:jira-work", "write:jira-work"},
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("Created OAuth2 credential: %s\n", res.Credential.ID)
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/credentials" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "id": "jira-oauth",
          "type": "oauth2",
          "client_id": "my-client-id",
          "client_secret": "my-client-secret",
          "token_url": "https://auth.atlassian.com/oauth/token",
          "refresh_token": "rt_xxxxxxxxxxxxxxxxxxxx",
          "scopes": ["read:jira-work", "write:jira-work"]
      }'
      ```

=== "CLI"

      ```bash
      gemini-api credentials create --body '{
        "id": "jira-oauth",
        "type": "oauth2",
        "client_id": "my-client-id",
        "client_secret": "my-client-secret",
        "token_url": "https://auth.atlassian.com/oauth/token",
        "refresh_token": "rt_xxxxxxxxxxxxxxxxxxxx",
        "scopes": ["read:jira-work", "write:jira-work"]
      }'
      ```


建立 OAuth2 憑證時，系統會向 `token_url` 執行一次即時 token 交換，以確認
設定正確無誤。只有在供應商回傳成功的 token 回應且其中包含 `access_token` 時，
憑證才會被儲存。JSON 與 form-urlencoded 兩種回應格式都可接受。

換句話說，建立當下您必須持有有效且未過期的更新 token。若供應商拒絕這次
交換，錯誤會回傳給您：

```json
{
  "error": {
    "message": "OAuth token validation failed with HTTP 403: {\"error\":\"unauthorized_client\",\"error_description\":\"refresh_token is invalid\"}",
    "code": "invalid_request"
  }
}
```

儲存之後，proxy 會在存取 token 到期時自動重新整理。若供應商會輪替更新 token，
並在重新整理時回傳新的 token，新 token 會自動取代已儲存的舊 token。

### 環境變數 {#environment-variable}

`environment_variable` 憑證需要 `value` 與 `injection_location`：


=== "Python"

      ```py
      credential = client.credentials.create(
          id="slack-bot-token",
          type="environment_variable",
          value="xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx",
          trusted_domains=["*.slack.com", "slack.com"],
          injection_location="header",
      )
      ```

=== "JavaScript"

      ```javascript
      const credential = await client.credentials.create({
          id: "slack-bot-token",
          type: "environment_variable",
          value: "xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx",
          trusted_domains: ["*.slack.com", "slack.com"],
          injection_location: "header",
      });
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/credentials"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Credentials.Create(ctx, operations.CreateCredentialRequest{
              Body: credentials.NewCredentialCreateParams(credentials.EnvironmentVariableConfig{
                  ID:                "slack-bot-token",
                  Value:             "xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx",
                  TrustedDomains:    []string{"*.slack.com", "slack.com"},
                  InjectionLocation: credentials.NewEnvironmentVariableConfigInjectionLocation(credentials.InjectionLocationEnumHeader),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("Created environment variable credential: %s\n", res.Credential.ID)
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/credentials" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "id": "slack-bot-token",
          "type": "environment_variable",
          "value": "xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx",
          "trusted_domains": ["*.slack.com", "slack.com"],
          "injection_location": "header"
      }'
      ```

=== "CLI"

      ```bash
      gemini-api credentials create --body '{
        "id": "slack-bot-token",
        "type": "environment_variable",
        "value": "xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx",
        "trusted_domains": ["*.slack.com", "slack.com"],
        "injection_location": "header"
      }'
      ```


`injection_location` 欄位用來告訴 proxy 應在對外請求的哪個位置替換密鑰。
它接受 `header`、`query` 或 `body`，可以是單一字串；若服務需要多個位置，
也可以傳入陣列：

```json
"injection_location": ["header", "query"]
```

替換只會發生在您列出的位置。若請求在其他位置攜帶了佔位符，該請求會被
拒絕，而不會送出。

如需將憑證綁定到變數名稱，請參閱
[將憑證用作環境變數](/docs/agent-credentials/#environment-variables)。

### 自動產生的 ID {#generated-ids}

`id` 欄位為選填。省略時，服務會自動產生一個 UUID：

```json
{
  "id": "9e545973-4330-49bb-9a44-930cea9fbe3c",
  "type": "bearer_token",
  "status": "active",
  "create_time": "2026-07-15T10:00:00.000000000Z",
  "update_time": "2026-07-15T10:00:00.000000000Z"
}
```

若希望在多次互動之間使用穩定且易讀的參照，請自行提供 ID。由於 ID 會出現在
資源路徑中，建議使用小寫英數字元搭配連字號或底線。

## 列出憑證 {#list-credentials}

列出屬於您專案的憑證。您可以使用分頁參數控制每次回應的批次大小。


=== "Python"

      ```py
      response = client.credentials.list(page_size=10)
      for credential in response.credentials:
          print(f"Credential ID: {credential.id}, Type: {credential.type}")
      ```

=== "JavaScript"

      ```javascript
      const response = await client.credentials.list({ page_size: 10 });
      for (const credential of response.credentials) {
          console.log(`Credential ID: ${credential.id}, Type: ${credential.type}`);
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

          res, err := client.Credentials.List(ctx, operations.ListCredentialsRequest{
              PageSize: genai.Ptr(10),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, cred := range res.CredentialListResponse.Credentials {
              fmt.Printf("Credential ID: %s, Type: %v\n", cred.ID, cred.GetType())
          }
      }
      ```

=== "REST"

      ```shell
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/credentials?page_size=10" \
      -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "CLI"

      ```bash
      gemini-api credentials list --page-size 10
      ```


回應只包含中繼資料：

```json
{
  "credentials": [
    {
      "id": "github-production",
      "type": "bearer_token",
      "status": "active",
      "create_time": "2026-07-15T10:00:00.000000000Z",
      "update_time": "2026-07-15T10:00:00.000000000Z"
    },
    {
      "id": "jira-oauth",
      "type": "oauth2",
      "status": "active",
      "create_time": "2026-07-15T10:05:00.000000000Z",
      "update_time": "2026-07-15T10:05:00.000000000Z"
    }
  ],
  "next_page_token": "Cj...5aE="
}
```

將 `next_page_token` 以 `page_token` 的形式傳回，即可取得下一頁。若沒有
更多結果，該欄位會被省略。

| 參數 | 類型 | 說明 |
| :--- | :--- | :--- |
| `page_size` | integer | 每頁憑證數量的上限。 |
| `page_token` | string | 來自前一次回應 `next_page_token` 的 token。 |

## 取得憑證 {#get-a-credential}

依 ID 擷取特定憑證的中繼資料。


=== "Python"

      ```py
      credential = client.credentials.get(id="github-production")
      print(f"Credential ID: {credential.id}, Status: {credential.status}")
      ```

=== "JavaScript"

      ```javascript
      const credential = await client.credentials.get("github-production");
      console.log(`Credential ID: ${credential.id}, Status: ${credential.status}`);
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

          res, err := client.Credentials.Get(ctx, operations.GetCredentialRequest{
              ID: "github-production",
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("Credential ID: %s, Status: %v\n", res.Credential.ID, res.Credential.GetStatus())
      }
      ```

=== "REST"

      ```shell
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/credentials/github-production" \
      -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "CLI"

      ```bash
      gemini-api credentials get github-production
      ```


回應大致如下：

```json
{
  "id": "github-production",
  "type": "bearer_token",
  "status": "active",
  "create_time": "2026-07-15T10:00:00.000000000Z",
  "update_time": "2026-08-01T14:30:00.000000000Z"
}
```

請求不存在的憑證會回傳 `404`：

```json
{
  "error": {
    "message": "Result not found.; GetCredential call failed",
    "code": "not_found"
  }
}
```

## 輪替憑證 {#rotate-a-credential}

在不更動任何參照該憑證的許可清單規則、工具定義或環境變數的情況下，替換
密鑰。輪替會在下一次 proxy 解析時生效。

請求必須包含 `type`，以及您要變更的欄位。省略的欄位會保留目前的值。

輪替 Bearer token：


=== "Python"

      ```py
      credential = client.credentials.update(
          id="github-production",
          type="bearer_token",
          token="ghp_new_xxxxxxxxxxxxxxxxxxxx",
      )
      ```

=== "JavaScript"

      ```javascript
      const credential = await client.credentials.update("github-production", {
          type: "bearer_token",
          token: "ghp_new_xxxxxxxxxxxxxxxxxxxx",
      });
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/credentials"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Credentials.Update(ctx, operations.UpdateCredentialRequest{
              ID: "github-production",
              Body: credentials.NewCredentialUpdate(credentials.HTTPBearerUpdateConfig{
                  Token: genai.Ptr("ghp_new_xxxxxxxxxxxxxxxxxxxx"),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("Updated credential %s at %v\n", res.Credential.ID, res.Credential.GetUpdateTime())
      }
      ```

=== "REST"

      ```shell
      curl -X PATCH "https://generativelanguage.googleapis.com/v1beta/credentials/github-production" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "type": "bearer_token",
          "token": "ghp_new_xxxxxxxxxxxxxxxxxxxx"
      }'
      ```

=== "CLI"

      ```bash
      gemini-api credentials update github-production --body '{"type": "bearer_token", "token": "ghp_new_xxxxxxxxxxxxxxxxxxxx"}'
      ```


輪替 OAuth2 更新 token：


=== "Python"

      ```py
      credential = client.credentials.update(
          id="jira-oauth",
          type="oauth2",
          refresh_token="rt_new_xxxxxxxxxxxxxxxxxxxx",
      )
      ```

=== "JavaScript"

      ```javascript
      const credential = await client.credentials.update("jira-oauth", {
          type: "oauth2",
          refresh_token: "rt_new_xxxxxxxxxxxxxxxxxxxx",
      });
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/credentials"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Credentials.Update(ctx, operations.UpdateCredentialRequest{
              ID: "jira-oauth",
              Body: credentials.NewCredentialUpdate(credentials.OAuth2UpdateConfig{
                  RefreshToken: genai.Ptr("rt_new_xxxxxxxxxxxxxxxxxxxx"),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("Updated credential %s at %v\n", res.Credential.ID, res.Credential.GetUpdateTime())
      }
      ```

=== "REST"

      ```shell
      curl -X PATCH "https://generativelanguage.googleapis.com/v1beta/credentials/jira-oauth" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "type": "oauth2",
          "refresh_token": "rt_new_xxxxxxxxxxxxxxxxxxxx"
      }'
      ```

=== "CLI"

      ```bash
      gemini-api credentials update jira-oauth --body '{"type": "oauth2", "refresh_token": "rt_new_xxxxxxxxxxxxxxxxxxxx"}'
      ```


回應會反映新的 `update_time`：

```json
{
  "id": "jira-oauth",
  "type": "oauth2",
  "status": "active",
  "create_time": "2026-07-15T10:05:00.000000000Z",
  "update_time": "2026-08-01T14:30:00.000000000Z"
}
```

憑證的 `type` 在建立時即固定。若要變更，請刪除該憑證並重新建立一個。

## 刪除憑證 {#delete-a-credential}

不再需要時，刪除憑證及其儲存的密鑰。


=== "Python"

      ```py
      client.credentials.delete(id="github-production")
      ```

=== "JavaScript"

      ```javascript
      await client.credentials.delete("github-production");
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

          _, err = client.Credentials.Delete(ctx, operations.DeleteCredentialRequest{
              ID: "github-production",
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```shell
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/credentials/github-production" \
      -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "CLI"

      ```bash
      gemini-api credentials delete github-production
      ```


刪除成功會回傳空物件：

```json
{}
```

任何仍參照該 ID 的許可清單規則、工具或環境變數都會無法解析，因此請先
更新這些參照。

## 欄位參考 {#field-reference}

所有憑證共用的欄位：

| 欄位 | 類型 | 必填 | 說明 |
| :--- | :--- | :--- | :--- |
| `id` | string | 否 | 唯一識別碼。省略時會自動產生 UUID。 |
| `type` | string | 是 | `bearer_token`、`oauth2`、`environment_variable` 三者之一。 |
| `status` | string | 唯讀 | 憑證目前的狀態。 |
| `create_time` | string | 唯讀 | RFC 3339 格式的建立時間戳記。 |
| `update_time` | string | 唯讀 | RFC 3339 格式的上次更新時間戳記。 |

`bearer_token` 的欄位：

| 欄位 | 類型 | 必填 | 說明 |
| :--- | :--- | :--- | :--- |
| `token` | string | 是 | 僅可寫入。token 的值。 |
| `header_name` | string | 否 | 要注入的標頭。預設為 `Authorization`。 |
| `prefix` | string | 否 | 值的字首。預設為 `Bearer`。若不需要，請設為 `""`。 |

`oauth2` 的欄位：

| 欄位 | 類型 | 必填 | 說明 |
| :--- | :--- | :--- | :--- |
| `client_id` | string | 是 | OAuth2 用戶端 ID。 |
| `client_secret` | string | 是 | 僅可寫入。OAuth2 用戶端密鑰。 |
| `refresh_token` | string | 是 | 僅可寫入。用來取得存取 token 的更新 token。 |
| `token_url` | string | 是 | 供應商的 token 端點。 |
| `scopes` | array | 否 | 要請求的 OAuth 範圍。 |

`environment_variable` 的欄位：

| 欄位 | 類型 | 必填 | 說明 |
| :--- | :--- | :--- | :--- |
| `value` | string | 是 | 僅可寫入。密鑰的值。 |
| `injection_location` | string or array | 是 | 替換密鑰的位置。`header`、`query`、`body` 一者或多者。 |
| `trusted_domains` | array | 否 | 獲准進行替換的網域模式。 |

## 錯誤 {#errors}

錯誤會回傳帶有 `message` 與 `code` 的 JSON 物件：

```json
{
  "error": {
    "message": "Credential 'github-production' already exists.; CreateCredential call failed",
    "code": "aborted"
  }
}
```

| HTTP 狀態 | `code` | 原因 |
| :--- | :--- | :--- |
| 400 | `invalid_request` | 缺少必填欄位、未知欄位、不支援的 `type`，或 OAuth2 驗證失敗。 |
| 404 | `not_found` | 沒有該 ID 的憑證。 |
| 409 | `aborted` | 已存在使用該 ID 的憑證。 |

未知欄位會被拒絕而非忽略，且錯誤訊息會指出該欄位名稱：

```json
{
  "error": {
    "message": "Unknown parameter 'headerName'. Did you mean 'header_name'?",
    "code": "invalid_request"
  }
}
```

## 後續步驟 {#whats-next}

*   [環境](/docs/agent-environment/)：了解代理如何執行程式碼並保存檔案。
*   [代理總覽](/docs/agents/)：了解受管理代理的核心概念。
*   [建立自訂代理](/docs/custom-agents/)：使用 `AGENTS.md` 與 `SKILL.md` 定義您自己的代理。

