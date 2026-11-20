# 工具擷取


!!! note " "

       工具擷取目前處於[預覽版](/docs/models/#preview)，且需要 `v1beta` [API 版本](/api-reference/api-versions/)。API 介面在正式推出前可能會有所變更。


工具擷取能讓 Gemini 在對話進行中搜尋並載入工具綱要，而不必在一開始就接收全部工具定義。您只需宣告一次完整的工具庫，並標記要從初始上下文中保留的工具。模型接著只會載入執行手邊任務實際需要的少數幾個綱要。

當您的工具庫龐大時，這項功能就特別重要。數十個函式宣告每次請求可能耗用數萬個 token，而且隨著候選工具數量增加，模型準確度會下降。工具擷取能讓作用中的工具集保持精簡。

工具擷取適用於 [Interactions API](/docs/interactions-overview/)。[`generateContent`](/docs/function-calling/?generate-content=true) 方法不支援此功能。

## 選擇擷取模式 {#choosing-a-mode}

Gemini API 支援兩種擷取模式：**伺服器端擷取**（預設值），由 Gemini 自行搜尋您宣告的工具並載入相符的綱要；以及**用戶端擷取**，由您的應用程式自行執行搜尋，並將相符的綱要回傳給模型。下表比較這兩種模式與靜態工具載入（每次請求都會傳送所有綱要）：


| 能力 | 靜態工具載入 | 伺服器端擷取 | 用戶端擷取 |
| --- | --- | --- | --- |
| **工具如何傳送給模型** | 每次請求傳送所有綱要 | Gemini 按需載入延遲載入的綱要 | 您的應用程式按需回傳綱要 |
| **您需要撰寫的擷取程式碼** | 無 | 無 | 搜尋、排序與篩選邏輯 |
| **工具是否必須事先宣告** | 是 | 是 | 否 |
| **是否支援 MCP 伺服器** | 是 | 是 | 不適用 |
| **每次搜尋額外增加的往返次數** | 無 | 無 | 每次搜尋一次：您的應用程式執行搜尋並傳送新的請求 |
| **適用情境** | 約 20 個以下穩定的工具 | 龐大但固定的工具庫 | 專屬註冊表、命名空間、依使用者區分的工具集 |


如果您的應用程式對延遲敏感，請使用伺服器端擷取。每次用戶端搜尋都會在模型與您的應用程式之間增加一次往返，而伺服器端搜尋則在單一 API 呼叫內完成。

## 伺服器端工具擷取 {#server-side}

如要啟用伺服器端擷取，請在工具陣列中加入 `{"type": "tool_search"}`。接著在每個要保留的 `function` 工具上設定 `defer_loading: true`；若在 `mcp_server` 工具上設定，則會延遲載入該伺服器公開的所有工具。模型看得到每個延遲載入工具的名稱與說明，但看不到其參數綱要。需要時，模型會載入完整綱要並繼續執行。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      tools = [
          {"type": "tool_search"},
          {
              "type": "function",
              "name": "convert_currency",
              "description": "Convert an amount from one currency to another.",
              "defer_loading": True,
              "parameters": {
                  "type": "object",
                  "properties": {
                      "amount": {"type": "number"},
                      "to": {"type": "string"},
                  },
                  "required": ["amount", "to"],
              },
          },
          {
              "type": "mcp_server",
              "name": "weather_service",
              "url": "https://gemini-api-demos.uc.r.appspot.com/mcp",
              "defer_loading": True,
          },
      ]

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Check the temperature in London and convert 100 USD to EUR.",
          tools=tools,
      )

      for step in interaction.steps:
          print(step.type, getattr(step, "name", ""))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const tools = [
        { type: "tool_search" },
        {
          type: "function",
          name: "convert_currency",
          description: "Convert an amount from one currency to another.",
          defer_loading: true,
          parameters: {
            type: "object",
            properties: {
              amount: { type: "number" },
              to: { type: "string" },
            },
            required: ["amount", "to"],
          },
        },
        {
          type: "mcp_server",
          name: "weather_service",
          url: "https://gemini-api-demos.uc.r.appspot.com/mcp",
          defer_loading: true,
        },
      ];

      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: "Check the temperature in London and convert 100 USD to EUR.",
        tools: tools,
      });

      for (const step of interaction.steps) {
        console.log(step.type, step.name ?? "");
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Check the temperature in London and convert 100 USD to EUR.",
          "tools": [
            {"type": "tool_search"},
            {
              "type": "function",
              "name": "convert_currency",
              "description": "Convert an amount from one currency to another.",
              "defer_loading": true,
              "parameters": {
                "type": "object",
                "properties": {
                  "amount": {"type": "number"},
                  "to": {"type": "string"}
                },
                "required": ["amount", "to"]
              }
            },
            {
              "type": "mcp_server",
              "name": "weather_service",
              "url": "https://gemini-api-demos.uc.r.appspot.com/mcp",
              "defer_loading": true
            }
          ]
        }'
      ```


### 伺服器端擷取的運作方式 {#how-server-side-works}

1.  宣告工具，將要延遲載入的工具標記為 `defer_loading:
    true`，並加入 `{"type": "tool_search"}`。
2.  模型會收到每個延遲載入工具的名稱與說明，但不包含參數綱要。
3.  模型需要某個工具時，會發出 `tool_search_call` 步驟。
4.  API 會解析綱要，並以 `tool_search_result` 步驟回傳。
5.  模型接著發出帶有引數的實際 `function_call`。
6.  您照常執行函式並回傳 `function_result`。

步驟 3 和 4 在單一 API 呼叫內完成。您會在回應中看到這兩個步驟，但不需要對它們採取任何動作。

### 伺服器端回應格式 {#server-side-response}

```json
{
  "id": "int_server_111",
  "status": "requires_action",
  "steps": [
    {
      "type": "tool_search_call",
      "id": "tsc_abc123",
      "arguments": {
        "function_names": ["weather_service:get_weather", "convert_currency"]
      },
      "signature": "CpkBAY89a1..."
    },
    {
      "type": "tool_search_result",
      "call_id": "tsc_abc123",
      "signature": "CrQCAY89a1...",
      "result": [
        {
          "type": "function",
          "name": "weather_service:get_weather",
          "parameters": {
            "type": "object",
            "properties": {"location": {"type": "string"}},
            "required": ["location"]
          }
        },
        {
          "type": "function",
          "name": "convert_currency",
          "parameters": {
            "type": "object",
            "properties": {
              "amount": {"type": "number"},
              "to": {"type": "string"}
            },
            "required": ["amount", "to"]
          }
        }
      ]
    },
    {
      "type": "mcp_server_tool_call",
      "id": "mcp_call_111",
      "name": "get_weather",
      "server_name": "weather_service",
      "arguments": {"location": "London"}
    },
    {
      "type": "mcp_server_tool_result",
      "call_id": "mcp_call_111",
      "name": "get_weather",
      "server_name": "weather_service",
      "result": {"temp_celsius": 15}
    },
    {
      "type": "function_call",
      "id": "fc_xyz789",
      "name": "convert_currency",
      "arguments": {"amount": 100, "to": "EUR"}
    }
  ]
}
```

API 會在遠端 MCP 伺服器上執行 `get_weather`，並在同一回應中回傳 `mcp_server_tool_call` 與 `mcp_server_tool_result` 步驟。`convert_currency` 是您自己的函式，因此回應最後會以一個 `function_call` 步驟結尾，等您執行。請在 `steps` 中尋找 `function_call` 步驟，而不要依賴互動的 `status`；回傳 `function_call` 時，狀態不一定是 `requires_action`。

`tool_search_call` 與 `tool_search_result` 步驟上的 `signature` 是不透明的加密值，承載了擷取上下文。您不需要解讀它。如果您自行管理對話狀態，必須將這些步驟原封不動地回傳，包含簽章在內。詳見[無狀態對話](/docs/tool-retrieval/#stateless)。

## 用戶端工具擷取 {#client-side}

用戶端擷取把搜尋工作交回給您的應用程式。您宣告一個 `tool_search` 工具，設定 `execution: "client"`，並提供 `name`、`description` 以及您自己的參數綱要。`description` 為必填，因為模型會讀取它來決定何時搜尋。模型會像呼叫一般函式一樣呼叫這個工具，而您在 `function_result` 中回傳相符的工具定義。

由於綱要隨結果傳送，這些工具不必存在於您原本的 `tools` 陣列中。這讓您能在對話進行到一半時注入新開放的工具，例如使用者連接了新的整合服務。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      tools = [
          {
              "type": "tool_search",
              "execution": "client",
              "name": "search_tool_registry",
              "description": "Search the internal tool registry for functions.",
              "parameters": {
                  "type": "object",
                  "properties": {
                      "query": {
                          "type": "string",
                          "description": "The tool name or capability to look for.",
                      },
                      "namespace": {
                          "type": "string",
                          "description": "Namespace filter, for example 'billing'.",
                      },
                      "limit": {
                          "type": "integer",
                          "description": "Maximum number of tools to return.",
                      },
                  },
                  "required": ["query"],
              },
          }
      ]

      # Turn 1: the model asks your application to search.
      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Look up the billing history for user 123.",
          tools=tools,
      )

      for step in interaction.steps:
          if step.type == "function_call" and step.name == "search_tool_registry":
              # Run your own retrieval here: vector search, registry lookup, and
              # so on. Return complete function declarations.
              matches = [
                  {
                      "type": "function",
                      "name": "get_billing_history",
                      "description": "Retrieve billing history for a given user.",
                      "parameters": {
                          "type": "object",
                          "properties": {"user_id": {"type": "integer"}},
                          "required": ["user_id"],
                      },
                  }
              ]

              # Turn 2: return the schemas. The tools array is unchanged.
              followup = client.interactions.create(
                  model="gemini-4-hydrogen",
                  previous_interaction_id=interaction.id,
                  tools=tools,
                  input=[
                      {
                          "type": "function_result",
                          "name": step.name,
                          "call_id": step.id,
                          "result": matches,
                      }
                  ],
              )

              # Turn 3: the model calls the tool it just discovered.
              for followup_step in followup.steps:
                  if followup_step.type == "function_call":
                      print(followup_step.name, followup_step.arguments)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const tools = [
        {
          type: "tool_search",
          execution: "client",
          name: "search_tool_registry",
          description: "Search the internal tool registry for functions.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The tool name or capability to look for.",
              },
              namespace: {
                type: "string",
                description: "Namespace filter, for example 'billing'.",
              },
              limit: {
                type: "integer",
                description: "Maximum number of tools to return.",
              },
            },
            required: ["query"],
          },
        },
      ];

      // Turn 1: the model asks your application to search.
      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: "Look up the billing history for user 123.",
        tools: tools,
      });

      for (const step of interaction.steps) {
        if (step.type === "function_call" && step.name === "search_tool_registry") {
          // Run your own retrieval here.
          const matches = [
            {
              type: "function",
              name: "get_billing_history",
              description: "Retrieve billing history for a given user.",
              parameters: {
                type: "object",
                properties: { user_id: { type: "integer" } },
                required: ["user_id"],
              },
            },
          ];

          // Turn 2: return the schemas. The tools array is unchanged.
          const followup = await ai.interactions.create({
            model: "gemini-4-hydrogen",
            previous_interaction_id: interaction.id,
            tools: tools,
            input: [
              {
                type: "function_result",
                name: step.name,
                call_id: step.id,
                result: matches,
              },
            ],
          });

          // Turn 3: the model calls the tool it just discovered.
          for (const followupStep of followup.steps) {
            if (followupStep.type === "function_call") {
              console.log(followupStep.name, followupStep.arguments);
            }
          }
        }
      }
      ```

=== "REST"

      ```bash
      # Turn 1: declare a client-side tool search.
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Look up the billing history for user 123.",
          "tools": [
            {
              "type": "tool_search",
              "execution": "client",
              "name": "search_tool_registry",
              "description": "Search the internal tool registry for functions.",
              "parameters": {
                "type": "object",
                "properties": {
                  "query": {"type": "string"},
                  "namespace": {"type": "string"},
                  "limit": {"type": "integer"}
                },
                "required": ["query"]
              }
            }
          ]
        }'

      # The response contains a function_call step for "search_tool_registry".

      # Turn 2: return the matching schemas in the function result.
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "previous_interaction_id": "INTERACTION_ID",
          "tools": [
            {
              "type": "tool_search",
              "execution": "client",
              "name": "search_tool_registry",
              "description": "Search the internal tool registry for functions.",
              "parameters": {
                "type": "object",
                "properties": {
                  "query": {"type": "string"},
                  "namespace": {"type": "string"},
                  "limit": {"type": "integer"}
                },
                "required": ["query"]
              }
            }
          ],
          "input": [
            {
              "type": "function_result",
              "name": "search_tool_registry",
              "call_id": "CALL_ID",
              "result": [
                {
                  "type": "function",
                  "name": "get_billing_history",
                  "description": "Retrieve billing history for a given user.",
                  "parameters": {
                    "type": "object",
                    "properties": {"user_id": {"type": "integer"}},
                    "required": ["user_id"]
                  }
                }
              ]
            }
          ]
        }'
      ```


### 用戶端擷取的運作方式 {#how-client-side-works}

1.  宣告 `tool_search` 工具，設定 `execution: "client"`，並提供 `name`、`description` 與 `parameters` 綱要。
2.  模型針對該工具發出標準的 `function_call` 步驟。
3.  您的應用程式執行自己的擷取邏輯。
4.  您在 `function_result.result` 中回傳相符的工具定義。
5.  模型針對剛收到的工具發出 `function_call` 步驟。
6.  您照常執行這些函式並回傳結果。

## 設定參考 {#configuration}

### `tool_search` {#tool-search}

宣告擷取機制。每個請求只能使用一個 `tool_search` 工具。

伺服器端：

```json
{"type": "tool_search"}
```

用戶端：

```json
{
  "type": "tool_search",
  "execution": "client",
  "name": "search_tool_registry",
  "description": "Search the internal tool registry for functions.",
  "parameters": { ... }
}
```


| 欄位 | 是否必填 | 說明 |
| --- | --- | --- |
| `type` | 是 | 必須是 `"tool_search"`。 |
| `execution` | 否 | `"server"`（預設值）或 `"client"`。 |
| `name` | 僅用戶端 | 模型呼叫的函式名稱。用戶端 `tool_search` 若省略此欄位，會傳回 `400` 錯誤。伺服器端 `tool_search` 請勿設定此欄位。 |
| `description` | 僅用戶端 | 告訴模型何時搜尋。用戶端 `tool_search` 若省略此欄位，會傳回 `400` 錯誤。伺服器端 `tool_search` 請勿設定此欄位。 |
| `parameters` | 僅用戶端 | 搜尋引數的 JSON 綱要。伺服器端 `tool_search` 請勿設定此欄位。 |


### `defer_loading` {#defer-loading}

在 `function` 或 `mcp_server` 工具上設定 `defer_loading: true`，可讓完整綱要不進入初始上下文。工具的名稱與說明仍會顯示，讓模型知道這項功能存在。

`defer_loading` 僅適用於伺服器端擷取。在任何工具上設定它，卻未同時加入伺服器端 `{"type": "tool_search"}`，會傳回 `400` 錯誤；因此請勿將它與 `execution: "client"` 併用。

### `short_description` {#short-description}

函式宣告上的選填欄位，僅適用於同時設定 `defer_loading: true` 的函式。設定後，模型在擷取期間會用它取代完整的 `description`，作為精簡摘要。可用它讓冗長、參數繁多的說明不進入初始上下文：

```json
{
  "type": "function",
  "name": "convert_currency",
  "description": "Convert an amount between currencies using live mid-market rates, with optional rounding and historical date lookup.",
  "short_description": "Convert an amount between currencies.",
  "defer_loading": true,
  "parameters": { ... }
}
```

在未設定 `defer_loading: true` 的函式上設定 `short_description`，會傳回 `400` 錯誤。

## MCP 伺服器 {#mcp}

遠端 MCP 伺服器支援 `defer_loading`。設定後，該伺服器公開的所有工具都會延遲載入，按需載入：

```json
{
  "type": "mcp_server",
  "name": "weather_service",
  "url": "https://gemini-api-demos.uc.r.appspot.com/mcp",
  "defer_loading": true
}
```

同時連接多個 MCP 伺服器時，這項功能特別實用，因為單一伺服器就可能公開數十個工具。連接方式詳見[遠端 MCP](/docs/function-calling/#mcp)。

## 多輪對話 {#multi-turn}

使用 `previous_interaction_id` 串連多輪對話時，API 會代為儲存步驟歷程，包括 `tool_search_call` 與 `tool_search_result` 步驟。您不需要再次傳送這些步驟，但仍需再次傳送工具，詳見下一節。

### 每次請求都要傳送完整的 `tools` 陣列 {#resend-tools}

API 不會將工具宣告從一個請求帶到下一個請求，即使您傳入 `previous_interaction_id` 也一樣。請在對話中的每次請求都傳送相同的完整 `tools` 陣列：

*   `tool_search` 項目。
*   每個延遲載入的工具，包括延遲載入的 `mcp_server` 工具。
*   每個未延遲載入的工具。

這適用於使用 `previous_interaction_id` 的串連請求、回傳 `function_result` 的請求，以及重播完整歷程的[無狀態對話](/docs/tool-retrieval/#stateless)。

如果後續請求漏掉了工具，模型只知道它在先前輪次已呼叫過的工具。它往往會繼續使用這些工具，甚至可能嘗試呼叫請求中已不再宣告的函式。使用伺服器端擷取時，名稱以 `retriever:` 開頭的內部擷取呼叫也可能出現在回應步驟中。

以下範例在第 2 輪回傳函式結果，並重新傳送第 1 輪相同的 `tools` 清單：


=== "Python"

      ```python
      # Turn 1 used tools=tools and returned a function_call step.
      fc_step = next(s for s in interaction.steps if s.type == "function_call")

      followup = client.interactions.create(
          model="gemini-4-hydrogen",
          previous_interaction_id=interaction.id,
          tools=tools,
          input=[
              {
                  "type": "function_result",
                  "name": fc_step.name,
                  "call_id": fc_step.id,
                  "result": [{"type": "text", "text": '{"amount": 92.4, "currency": "EUR"}'}],
              }
          ],
      )

      print(followup.output_text)
      ```

=== "JavaScript"

      ```javascript
      // Turn 1 used tools: tools and returned a function_call step.
      const fcStep = interaction.steps.find((s) => s.type === "function_call");

      const followup = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        previous_interaction_id: interaction.id,
        tools: tools,
        input: [
          {
            type: "function_result",
            name: fcStep.name,
            call_id: fcStep.id,
            result: [{ type: "text", text: '{"amount": 92.4, "currency": "EUR"}' }],
          },
        ],
      });

      console.log(followup.output_text);
      ```


### 無狀態對話 {#stateless}

如果您自行管理對話狀態（`store=false`），並在每次請求的 `input` 中傳入完整步驟歷程（詳見[無狀態函式呼叫](/docs/function-calling/#stateless-function-calling)），就必須將每個 `tool_search_call` 與 `tool_search_result` 步驟原封不動地回傳，同時附上完整的 `tools` 陣列。這適用於伺服器端擷取，也就是任何使用 `defer_loading` 的請求。用戶端擷取使用一般的 `function_call` 與 `function_result` 步驟，遵循標準的無狀態規則。

原封不動地傳回這些步驟，代表：

*   兩個步驟都要傳送。缺少 `tool_search_call` 步驟時，API 會拒絕請求，但它不會檢查是否有對應的 `tool_search_result` 步驟。該步驟保留了已載入的綱要，缺少它，模型就無法使用已載入的工具。
*   保留 `signature` 欄位。它承載了 API 重建對話所需的擷取上下文。
*   不要編輯、重建或重新格式化這些步驟。請將回應步驟原樣附加到歷程中。
*   保持步驟的原始位置，放在使用擷取工具的 `function_call` 步驟之前。
*   也要回傳回應中的其他步驟，包括 `thought` 步驟及其簽章，如同任何[無狀態函式呼叫](/docs/function-calling/#stateless-function-calling)。如果您使用 SDK 建立歷程，請使用能辨識 `tool_search_call` 與 `tool_search_result` 步驟類型的版本。舊版本會將它們解析為未知步驟並捨棄其欄位，進而引發下方錯誤。

缺少這些步驟時，API 會以 `400` 錯誤拒絕請求：

```none
Server side tool call context must be circulated when using deferred loading
functions. Please return the tool_call and tool_response parts in previous turns
back to the server. Missing circulated context for functions: convert_currency
```

這個錯誤會出現在傳送延遲載入工具 `function_result` 的請求上，而不是發生擷取的那次請求。第一次呼叫會成功，第二次呼叫才會失敗。訊息末尾會列出缺少擷取上下文的函式。

如果步驟存在，但 `signature` 欄位被移除，API 會傳回不同的 `400` 錯誤：

```none
Tool call part is missing thought_signature.
```

對於 `tool_search_result` 步驟，訊息開頭會改為 `Tool response part`。兩種情況下，`thought_signature` 指的都是 `signature` 欄位。請將 `tool_search_call` 與 `tool_search_result` 步驟連同未更動的 `signature` 值一併回傳。

以下範例使用延遲載入的工具，以無狀態方式重播對話：


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      tools = [
          {"type": "tool_search"},
          {
              "type": "function",
              "name": "convert_currency",
              "description": "Convert an amount from one currency to another.",
              "defer_loading": True,
              "parameters": {
                  "type": "object",
                  "properties": {
                      "amount": {"type": "number"},
                      "to": {"type": "string"},
                  },
                  "required": ["amount", "to"],
              },
          },
      ]

      history = [
          {
              "type": "user_input",
              "content": [{"type": "text", "text": "Convert 100 USD to EUR."}],
          }
      ]

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          store=False,
          input=history,
          tools=tools,
      )

      # Append every step unchanged, including tool_search_call and
      # tool_search_result steps and their signatures.
      for step in interaction.steps:
          history.append(step.model_dump())

      fc_step = next(s for s in interaction.steps if s.type == "function_call")
      history.append({
          "type": "function_result",
          "name": fc_step.name,
          "call_id": fc_step.id,
          "result": [{"type": "text", "text": '{"amount": 92.4, "currency": "EUR"}'}],
      })

      final_interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          store=False,
          input=history,
          tools=tools,
      )

      print(final_interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const tools = [
        { type: "tool_search" },
        {
          type: "function",
          name: "convert_currency",
          description: "Convert an amount from one currency to another.",
          defer_loading: true,
          parameters: {
            type: "object",
            properties: {
              amount: { type: "number" },
              to: { type: "string" },
            },
            required: ["amount", "to"],
          },
        },
      ];

      const history = [
        {
          type: "user_input",
          content: [{ type: "text", text: "Convert 100 USD to EUR." }],
        },
      ];

      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        store: false,
        input: history,
        tools: tools,
      });

      // Append every step unchanged, including tool_search_call and
      // tool_search_result steps and their signatures.
      history.push(...interaction.steps);

      const fcStep = interaction.steps.find((s) => s.type === "function_call");
      history.push({
        type: "function_result",
        name: fcStep.name,
        call_id: fcStep.id,
        result: [{ type: "text", text: '{"amount": 92.4, "currency": "EUR"}' }],
      });

      const finalInteraction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        store: false,
        input: history,
        tools: tools,
      });

      console.log(finalInteraction.output_text);
      ```


## 錯誤 {#errors}


| 訊息 | 原因 | 解決方式 |
| --- | --- | --- |
| `tool_search tool must be specified when using defer_loading.` | `function` 或 `mcp_server` 工具設定了 `defer_loading: true`，但請求中沒有 `tool_search` 工具。 | 在工具陣列中加入 `{"type": "tool_search"}`，或移除 `defer_loading`。 |
| `When defer_loading is set on a FunctionDeclaration, a Tool with tool_search must also be provided in the request.` | 函式設定了 `defer_loading: true`，但請求中沒有伺服器端 `tool_search`。這發生在唯一的 `tool_search` 是用戶端（`execution: "client"`）時，或後續請求漏掉了 `tool_search` 項目時。 | 使用用戶端擷取時，請移除 `defer_loading`。使用伺服器端擷取時，請在每次請求都傳送完整的 `tools` 陣列，包括 `{"type": "tool_search"}`。 |
| `Cannot specify both client-side and server-side tool_search tools.` | 工具陣列同時包含伺服器端與用戶端的 `tool_search`。 | 只能宣告一個。 |
| `Only a single ToolSearch definition is expected.` | 工具陣列包含多個同類型的 `tool_search`。 | 只能宣告一個。 |
| `ToolSearch name must be specified when execution mode is CLIENT_SIDE.` | 用戶端 `tool_search` 缺少 `name`。 | 加入 `name`。 |
| `ToolSearch description must be specified when execution mode is CLIENT_SIDE.` | 用戶端 `tool_search` 缺少 `description`。 | 加入 `description`。 |
| `ToolSearch name must not be specified when execution mode is SERVER_SIDE.` | 伺服器端 `tool_search` 設定了 `name`。設定 `description` 與 `parameters` 時也會傳回相同錯誤。 | 移除該欄位，或設定 `execution: "client"`。 |
| `short_description can only be set if defer_loading is true` | 函式設定了 `short_description`，卻未設定 `defer_loading: true`。 | 設定 `defer_loading: true`，或移除 `short_description`。 |
| `deferred loading is not supported for this model` | 模型不支援工具擷取。 | 使用其中一個[支援的模型](/docs/tool-retrieval/#supported-models)。 |
| `Server side tool call context must be circulated when using deferred loading functions.` | 在無狀態請求中，歷程包含延遲載入工具的 `function_result`，卻沒有載入它的 `tool_search_call` 與 `tool_search_result` 步驟。這個錯誤出現在第二次呼叫，而非第一次。 | 將每個 `tool_search_call` 與 `tool_search_result` 步驟原封不動地回傳，包含 `signature` 在內。詳見[無狀態對話](/docs/tool-retrieval/#stateless)。 |
| `Tool call part is missing thought_signature.` 或 `Tool response part is missing thought_signature.` | 在無狀態請求中，`tool_search_call`（呼叫部分）或 `tool_search_result`（回應部分）步驟回傳時缺少 `signature` 欄位。 | 將擷取步驟完全按照收到的原樣回傳，包含 `signature` 在內。詳見[無狀態對話](/docs/tool-retrieval/#stateless)。 |
| `Function call is missing a thought_signature in functionCall parts.` | 在無狀態請求中，`function_call` 步驟或其前面的 `thought` 步驟回傳時缺少 `signature`。 | 將每個步驟原封不動地回傳，包含 `thought` 步驟及其簽章。詳見[無狀態對話](/docs/tool-retrieval/#stateless)。 |
| `Server side tool call context must be circulated ... Missing circulated context for functions: FUNCTION_NAME`，即使您已將每個步驟都回傳 | 模型呼叫了一個對話中沒有任何 `tool_search` 載入過的延遲載入函式，通常是因為該函式名稱出現在您的系統指令或另一個工具的輸出中。這個錯誤出現在傳送 `function_result` 的請求上，且對話無法繼續。 | 不要延遲載入您會具名提及的工具。詳見[最佳做法](/docs/tool-retrieval/#best-practices)。 |


完整的 API 錯誤代碼清單，請見 [API 錯誤](/docs/api-errors/)。

## 最佳做法 {#best-practices}

*   **讓最常用的工具保持載入**：在代理大多數輪次都會用到的少數工具上，不要設定 `defer_loading`；只延遲載入長尾的專門工具。
*   **讓您會具名提及的工具保持載入**：如果工具名稱出現在系統指令或另一個工具的輸出中，請不要延遲載入該工具。否則模型可能在未先搜尋的情況下就呼叫它，導致下一個請求失敗並出現 `Server side tool call context must be circulated` 錯誤。
*   **為每個延遲載入的工具傳送完整綱要**：在延遲載入的函式宣告中加入完整的 `parameters` 綱要。未載入的綱要不會計費；而只附 `name` 與 `short_description` 的工具，經搜尋回傳時會帶著空白綱要，模型無法呼叫。
*   **告訴模型何時搜尋**：在系統指令中加入類似「If none of your loaded tools can complete the task, use tool search to find one」的指示。
*   **區分相似的工具**：當多個服務提供類似操作時，請在函式名稱前加上服務前綴（例如 `billing_get_customer` 與 `crm_get_customer`），並在 `short_description` 開頭寫明服務名稱。
*   **在用戶端 `tool_search` 中描述您的目錄**：在 `description` 中列出您可以搜尋的命名空間或類別，以及何時搜尋。含糊的說明會降低模型執行搜尋的可能性。
*   **以物件形式回傳函式宣告**：在用戶端擷取中，將完整宣告放入 `function_result.result` 陣列。不要以 JSON 字串傳送。在每個 `function_result` 中都要包含搜尋用 `function_call` 的 `name` 與 `call_id`。
*   **處理查無結果的搜尋**：如果用戶端搜尋找不到相符項目，請回傳簡短的文字結果說明此事，並列出模型可以搜尋的內容，讓它能調整查詢。
*   **檢查步驟，而不是狀態**：即使回應的 `status` 不是 `requires_action`，其中仍可能包含要您執行的 `function_call` 步驟。請在每次回應的 `steps` 中尋找 `function_call` 步驟。

## Token 用量與計費 {#pricing}

工具擷取不另行收費。每個 token 均按您呼叫的模型之標準輸入、快取與輸出費率計費。詳見[定價](/docs/pricing/)。

延遲載入的工具只會以延遲工具清單中的單行項目計入輸入 token，參數綱要要等模型載入後才會計費。每次伺服器端搜尋都會產生各自的費用，因此請針對自己的流量衡量淨效果。詳見[計費內容](/docs/tool-retrieval/#billing)。

### 用量欄位 {#usage-fields}

每次互動都會在 `usage` 物件中回報 token 數量，這些欄位就是計費依據。使用工具擷取時，請留意以下欄位：


| 欄位 | 包含內容 |
| --- | --- |
| `total_input_tokens` | 請求中第一次模型呼叫的提示詞：您的輸入、對話歷程、系統指令、未延遲載入工具的綱要、工具搜尋指示，以及延遲載入工具清單。 |
| `total_tool_use_tokens` | 伺服器端工具執行後，API 在同一請求內發起的額外模型呼叫之提示詞，包括每次伺服器端工具搜尋。每次呼叫都會再次傳送完整上下文，以及新載入的綱要。按輸入費率計費。 |
| `total_cached_tokens` | 提示詞中由[隱式快取](/docs/caching/)提供的部分。按快取費率而非輸入費率計費。 |
| `total_output_tokens`、`total_thought_tokens` | 生成的 token，與任何請求相同。 |


### 計費內容 {#billing}

*   **延遲載入的工具清單**：每個延遲載入的工具會在輸入中增加一行：名稱與 `short_description`；若未設定 `short_description`，則為 `description` 的第一句話。不包含參數綱要。早期測試顯示，每個延遲載入的工具約為 26 個 token。
*   **工具搜尋指示**：啟用伺服器端 `tool_search` 會在每次請求中增加一小段固定數量的輸入 token。
*   **每次搜尋**：模型呼叫伺服器端 `tool_search` 時，API 會在同一請求內再執行一次模型呼叫，傳入完整上下文與已載入的綱要。該次呼叫的完整提示詞會計入 `total_tool_use_tokens`。因此，一次搜尋的輸入成本大約等於請求提示詞再算一次，減去任何快取的 token。同一請求中的每次額外搜尋都會再增加一次呼叫。用戶端擷取時，每次搜尋都是一次獨立請求，計費方式與其他請求相同。
*   **已載入的綱要**：模型載入的每個綱要都會留在上下文中，在之後每次呼叫與每輪對話中按輸入計費，與事先宣告的工具相同。

### 快取 {#caching}

工具擷取可搭配[隱式快取](/docs/caching/)使用。擷取到的綱要會加在模型載入它們的對話位置，而非提示詞開頭，因此您的系統指令、工具清單與先前輪次，在每次請求之間都維持不變的前綴。一旦該前綴超過模型的最小可快取大小，對話中後續的請求便可由快取提供，包括每次伺服器端搜尋發起的額外模型呼叫。快取的 token 會計入 `total_cached_tokens`。

請注意，延遲載入工具也會讓提示詞變小。如果提示詞只是因為完整的工具綱要才超過最小可快取大小，延遲載入這些工具後可能會低於該大小。各模型的最小快取大小，請見[上下文快取](/docs/caching/)。

### 工具擷取何時能節省 token {#when-it-saves}

當您不再每次請求都傳送的綱要所省下的 token 超過搜尋成本時，工具擷取就能節省 token。通常在以下情況成立：

*   工具庫龐大，而一般請求只使用少數工具。
*   大多數請求不需要搜尋，或只需要搜尋一次。

在以下情況，成本反而可能更高：

*   工具庫很小，沒什麼可省的。
*   對話上下文龐大，且幾乎每次請求都會搜尋，因為每次搜尋都會再次傳送該上下文。

以下範例僅供說明，使用的是概略數字而非實測值，且未計入輸出 token 與快取。某個請求傳送了 2,000 個 token 的對話內容，模型載入 2 個工具（各 400 個 token），整個對話需要兩次請求：一次以 `function_call` 結尾，一次回傳 `function_result`。


| 情境 | 靜態載入（輸入 token） | 工具擷取（輸入 + 工具使用 token） |
| --- | --- | --- |
| 200 個工具，各 400 個 token | 2 × (2,000 + 80,000) = **164,000** | 請求 1：2,000 + 5,200 延遲清單 + 150 指示 = 7,350，再加上一次搜尋呼叫 7,350 + 800 = 8,150。請求 2：8,150。總計：**約 23,650** |
| 10 個工具，各 400 個 token，30,000 個 token 的上下文 | 2 × (30,000 + 4,000) = **68,000** | 請求 1：30,000 + 260 + 150 = 30,410，再加上一次搜尋呼叫 31,210。請求 2：31,210。總計：**約 92,830** |


在全面導入工具擷取之前，請先針對自己的流量進行實測。

## 限制 {#limitations}

*   工具擷取僅支援 Interactions API。`generateContent` 方法不支援此功能。
*   在同一個請求內，伺服器端與用戶端擷取互斥。
*   `defer_loading` 僅適用於伺服器端擷取。
*   模型在一個輪次內需要多個工具時，可能會發出多次搜尋呼叫。
*   擷取到的工具會在對話剩餘時間內留在上下文中。工具一旦被模型載入，就無法卸載。
*   工具宣告不會在請求之間保留。請在每次請求都傳送完整的 `tools` 陣列。詳見[每次請求都要傳送完整的 `tools` 陣列](/docs/tool-retrieval/#resend-tools)。
*   沒有任何延遲載入工具相符的查詢，會產生文字回應而非結構化的擷取錯誤。請勿依賴 `tool_search_result` 步驟來偵測擷取失敗。

## 支援的模型 {#supported-models}

工具擷取支援以下模型：

*   [`gemini-4-hydrogen`](/docs/models/gemini-4-hydrogen/)
*   [`gemini-4-argon`](/docs/models/gemini-4-argon/)
*   [`gemini-3.8-flash`](/docs/models/gemini-3.8-flash/)
*   [`gemini-3.6-flash`](/docs/models/gemini-3.6-flash/)

在不支援的模型上設定 `defer_loading` 的請求會傳回 `400` 錯誤。

## 後續步驟 {#whats-next}

*   在[函式呼叫](/docs/function-calling/)指南中學習基礎知識。
*   使用[多工具併用](/docs/function-calling/#native-tools)將工具擷取與內建工具結合。
*   瀏覽完整的[工具](/docs/tools/)清單。
*   使用[上下文快取](/docs/caching/)進一步降低成本。
