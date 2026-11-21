# 工具擷取


!!! note " "

       工具擷取目前處於[預覽版](/docs/models/#preview)，且需要 `v1beta` [API 版本](/api-reference/api-versions/)。API 介面在正式推出前可能會有所變更。


工具擷取能讓 Gemini 在對話進行中搜尋您的工具庫，只載入所需的綱要。您只需宣告一次工具，並延遲載入要從初始上下文中保留的工具。

數十個函式宣告每次請求可能耗用數萬個 token，而且隨著候選工具清單增加，工具選擇的準確度會下降。工具擷取能讓作用中的工具集保持精簡。

工具擷取適用於 [Interactions API](/docs/interactions-overview/)。[`generateContent`](/docs/function-calling/?generate-content=true) 方法不支援此功能。

## 伺服器端工具擷取 {#server-side}

如要啟用伺服器端擷取，請在 `tools` 陣列中加入 `{"type": "tool_search"}`，並在每個要保留的工具上設定 `defer_loading: true`。模型看得到每個延遲載入工具的名稱與說明，需要時會載入完整參數綱要，並在單一 API 請求中呼叫該函式。


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
                      "from_currency": {"type": "string"},
                      "to_currency": {"type": "string"},
                  },
                  "required": ["amount", "from_currency", "to_currency"],
              },
          },
          {
              "type": "function",
              "name": "get_exchange_rate_history",
              "description": "Return historical exchange rates for a currency pair.",
              "defer_loading": True,
              "parameters": {
                  "type": "object",
                  "properties": {
                      "pair": {"type": "string"},
                      "days": {"type": "integer"},
                  },
                  "required": ["pair", "days"],
              },
          },
      ]

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Convert 100 USD to EUR.",
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
              from_currency: { type: "string" },
              to_currency: { type: "string" },
            },
            required: ["amount", "from_currency", "to_currency"],
          },
        },
        {
          type: "function",
          name: "get_exchange_rate_history",
          description: "Return historical exchange rates for a currency pair.",
          defer_loading: true,
          parameters: {
            type: "object",
            properties: {
              pair: { type: "string" },
              days: { type: "integer" },
            },
            required: ["pair", "days"],
          },
        },
      ];

      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: "Convert 100 USD to EUR.",
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
          "input": "Convert 100 USD to EUR.",
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
                  "from_currency": {"type": "string"},
                  "to_currency": {"type": "string"}
                },
                "required": ["amount", "from_currency", "to_currency"]
              }
            },
            {
              "type": "function",
              "name": "get_exchange_rate_history",
              "description": "Return historical exchange rates for a currency pair.",
              "defer_loading": true,
              "parameters": {
                "type": "object",
                "properties": {
                  "pair": {"type": "string"},
                  "days": {"type": "integer"}
                },
                "required": ["pair", "days"]
              }
            }
          ]
        }'
      ```


### 伺服器端回應格式 {#server-side-response}

回應包含內部的 `tool_search_call` 與 `tool_search_result` 步驟，其後是供您的應用程式執行的 `function_call` 步驟：

```json
{
  "id": "int_server_111",
  "status": "requires_action",
  "steps": [
    {
      "type": "tool_search_call",
      "id": "tsc_abc123",
      "arguments": {
        "function_names": ["convert_currency"]
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
          "name": "convert_currency",
          "parameters": {
            "type": "object",
            "properties": {
              "amount": {"type": "number"},
              "from_currency": {"type": "string"},
              "to_currency": {"type": "string"}
            },
            "required": ["amount", "from_currency", "to_currency"]
          }
        }
      ]
    },
    {
      "type": "function_call",
      "id": "fc_xyz789",
      "name": "convert_currency",
      "arguments": {
        "amount": 100,
        "from_currency": "USD",
        "to_currency": "EUR"
      }
    }
  ]
}
```

API 會在同一請求內解析 `tool_search_call` 與 `tool_search_result`，因此您只需執行 `function_call` 步驟。每個擷取步驟都包含加密的 `signature`，如果您自行管理對話歷程，必須將它原封不動地回傳（詳見[無狀態對話](/docs/tool-retrieval/#stateless)）。

## 選擇擷取模式 {#choosing-a-mode}

Gemini API 支援伺服器端擷取（預設值）與用戶端擷取。請根據您的工具註冊表所在位置與延遲預算選擇模式：


| 能力 | 靜態工具載入 | 伺服器端擷取 | 用戶端擷取 |
| --- | --- | --- | --- |
| 工具如何傳送給模型 | 每次請求傳送所有綱要 | Gemini 按需載入延遲載入的綱要 | 您的應用程式按需回傳綱要 |
| 您需要撰寫的擷取程式碼 | 無 | 無 | 搜尋、排序與篩選邏輯 |
| 工具是否事先宣告 | 是 | 是 | 否 |
| 是否支援遠端 MCP 伺服器 | 是 | 是 | 不適用 |
| 每次搜尋額外增加的往返次數 | 無 | 無 | 每次搜尋一次 |
| 適用情境 | 20 個以下穩定的工具 | 龐大、已知的工具庫與 MCP 伺服器 | 動態註冊表、命名空間或依使用者區分的工具 |


如果您的應用程式對延遲敏感，請使用伺服器端擷取，因為搜尋在單一 API 呼叫內完成。

## 用戶端工具擷取 {#client-side}

用戶端擷取將搜尋工作委派給您的應用程式。宣告一個 `tool_search` 工具，設定 `execution: "client"`，並提供 `name`、`description` 與搜尋用的 `parameters`。模型呼叫它時，請執行您自己的查詢，並在 `function_result.result` 中回傳相符的函式宣告。

以這種方式回傳的工具不必出現在您初始的 `tools` 陣列中，因此您可以在對話進行中動態注入工具。


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
                          "description": "Namespace filter, such as 'billing'.",
                      },
                  },
                  "required": ["query"],
              },
          }
      ]

      # Turn 1: the model calls your search tool.
      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Look up the billing history for user 123.",
          tools=tools,
      )

      for step in interaction.steps:
          if step.type == "function_call" and step.name == "search_tool_registry":
              # Run your own retrieval and return complete function declarations.
              matches = [
                  {
                      "type": "function",
                      "name": "get_billing_history",
                      "description": "Retrieve billing history for a user.",
                      "parameters": {
                          "type": "object",
                          "properties": {"user_id": {"type": "integer"}},
                          "required": ["user_id"],
                      },
                  }
              ]

              # Turn 2: return the matching schemas.
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

              # Turn 3: the model calls the discovered tool.
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
                description: "Namespace filter, such as 'billing'.",
              },
            },
            required: ["query"],
          },
        },
      ];

      // Turn 1: the model calls your search tool.
      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: "Look up the billing history for user 123.",
        tools: tools,
      });

      for (const step of interaction.steps) {
        if (step.type === "function_call" && step.name === "search_tool_registry") {
          // Run your own retrieval and return complete function declarations.
          const matches = [
            {
              type: "function",
              name: "get_billing_history",
              description: "Retrieve billing history for a user.",
              parameters: {
                type: "object",
                properties: { user_id: { type: "integer" } },
                required: ["user_id"],
              },
            },
          ];

          // Turn 2: return the matching schemas.
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

          // Turn 3: the model calls the discovered tool.
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
                  "namespace": {"type": "string"}
                },
                "required": ["query"]
              }
            }
          ]
        }'

      # Turn 2: return the matching schemas in function_result.
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
                  "namespace": {"type": "string"}
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
                  "description": "Retrieve billing history for a user.",
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


## 延遲載入遠端 MCP 伺服器 {#mcp}

在 `mcp_server` 項目上設定 `defer_loading: true`，並搭配伺服器端 `tool_search`，即可延遲載入該伺服器公開的所有工具：

```json
{
  "type": "mcp_server",
  "name": "weather_service",
  "url": "https://gemini-api-demos.uc.r.appspot.com/mcp",
  "defer_loading": true
}
```

模型擷取並呼叫延遲載入的 MCP 工具時，API 會在遠端伺服器上執行它，並在同一回應中回傳 `mcp_server_tool_call` 與 `mcp_server_tool_result` 步驟。連接設定詳見[遠端 MCP](/docs/function-calling/#mcp)。

## 設定選項 {#configuration}

每次請求只能加入一個 `tool_search` 項目。完整欄位綱要請見 [Interactions API 參考文件](/api-reference/interactions-api/create-interaction/)。


| 欄位 | 適用對象 | 行為 |
| --- | --- | --- |
| `execution` | `tool_search` | `"server"`（預設值）或 `"client"`。 |
| `name`、`description`、`parameters` | 用戶端 `tool_search` | `execution: "client"` 時為必填（`parameters` 為選填）。伺服器端 `tool_search` 請勿設定這些欄位。 |
| `defer_loading` | `function`、`mcp_server` | 完整參數綱要會保留到擷取時才提供。需要伺服器端 `tool_search`。 |
| `short_description` | 延遲載入的 `function` | 選填的精簡摘要，在擷取期間顯示給模型，取代完整的 `description`。僅在 `defer_loading: true` 時有效。 |


當函式的 `description` 很長、會讓延遲載入工具清單變得臃腫時，請使用 `short_description`：

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

## 多輪對話 {#multi-turn}

使用 `previous_interaction_id` 串連多輪對話時，API 會代為儲存先前的步驟，包括 `tool_search_call` 與 `tool_search_result`。

### 每次請求都要傳送完整的 `tools` 陣列 {#resend-tools}

API 不會將工具宣告保留到下一個輪次。請在每次請求都傳送完整的 `tools` 陣列（包括 `tool_search`、延遲載入的工具與已載入的工具），包括回傳 `function_result` 的後續輪次：


=== "Python"

      ```python
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

如果您自行管理歷程（`store=false`，詳見[無狀態函式呼叫](/docs/function-calling/#stateless-function-calling)），請將回應中每個由模型產生的步驟原封不動地附加到歷程中：

*   將 `tool_search_call` 與 `tool_search_result` 兩個步驟保留在原始順序、放在 `function_call` 步驟之前。
*   保留 `tool_search_call`、`tool_search_result`、`thought` 與 `function_call` 步驟上的 `signature` 欄位。
*   使用支援 `tool_search_call` 與 `tool_search_result` 步驟的 SDK 版本，以免序列化時捨棄這些步驟。

省略 `tool_search_call`，或從任何步驟中移除 `signature`，會在您回傳 `function_result` 時傳回 `400` 錯誤。省略 `tool_search_result` 不會傳回錯誤，但會讓已載入的綱要從上下文中消失。


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
                      "from_currency": {"type": "string"},
                      "to_currency": {"type": "string"},
                  },
                  "required": ["amount", "from_currency", "to_currency"],
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
              from_currency: { type: "string" },
              to_currency: { type: "string" },
            },
            required: ["amount", "from_currency", "to_currency"],
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


## 定價與 token 用量 {#pricing}

工具擷取不另行收費。所有 token 均按您呼叫的模型之標準輸入、快取與輸出費率計費（詳見[定價](/docs/pricing/)）。

*   延遲載入的工具只會將名稱與 `short_description`（或 `description` 的第一句話）計入 `total_input_tokens`。參數綱要要等載入後才會計費。
*   每次伺服器端搜尋都會在請求內觸發一次額外的模型呼叫，傳入完整上下文與已載入的綱要。這些提示詞 token 會計入 `total_tool_use_tokens`，按輸入費率計費。
*   擷取到的綱要會以內嵌方式附加在對話中，而非更動提示詞前綴，因此只要您的前綴達到模型的最小可快取大小，[隱式快取](/docs/caching/)就會繼續適用。延遲載入工具也會縮小提示詞，可能讓中等大小的提示詞低於該最小值。

工具庫龐大、每次請求只使用少數工具時，工具擷取可以節省 token。工具庫很小，或上下文很長且每輪都會搜尋時，靜態載入的成本反而可能較低。

## 支援的模型 {#supported-models}

工具擷取支援以下模型：

*   [`gemini-4-carbon`](/docs/models/gemini-4-carbon/)
*   [`gemini-4-neon`](/docs/models/gemini-4-neon/)
*   [`gemini-4-hydrogen`](/docs/models/gemini-4-hydrogen/)
*   [`gemini-4-argon`](/docs/models/gemini-4-argon/)
*   [`gemini-3.8-flash`](/docs/models/gemini-3.8-flash/)
*   [`gemini-3.6-flash`](/docs/models/gemini-3.6-flash/)

## 常見錯誤 {#errors}


| 錯誤 | 原因 | 解決方式 |
| --- | --- | --- |
| `tool_search tool must be specified when using defer_loading.` 或 `When defer_loading is set on a FunctionDeclaration, a Tool with tool_search must also be provided in the request.` | 工具設定了 `defer_loading: true`，但請求中沒有伺服器端 `tool_search`（例如使用了 `execution: "client"`，或後續輪次漏掉了 `tool_search`）。 | 在每次請求的 `tools` 中加入 `{"type": "tool_search"}`，或移除 `defer_loading`。 |
| `Server side tool call context must be circulated when using deferred loading functions.` | 在無狀態請求中，省略了 `tool_search_call` 步驟，或模型在未先搜尋的情況下就具名呼叫了延遲載入的工具。 | 將所有 `tool_search_call` 與 `tool_search_result` 步驟原封不動地重播，並不要延遲載入系統指令中具名提及的工具。 |
| `Tool call part is missing thought_signature.` 或 `Function call is missing a thought_signature in functionCall parts.` | 回傳的 `tool_search_call`、`tool_search_result`、`thought` 或 `function_call` 步驟缺少 `signature` 欄位。 | 將回應步驟原封不動地附加到歷程中，並保留 `signature`。 |
| `deferred loading is not supported for this model` | 目標模型不支援工具擷取。 | 使用其中一個[支援的模型](/docs/tool-retrieval/#supported-models)。 |


完整的 API 錯誤代碼清單，請見 [API 錯誤](/docs/api-errors/)。

## 最佳做法 {#best-practices}

*   讓最常用的工具保持載入。在大多數輪次都會用到的核心工具上，不要設定 `defer_loading`；只延遲載入長尾工具。
*   讓具名提及的工具保持載入。不要延遲載入系統指令或工具輸出中具名出現的工具，否則模型可能在未先搜尋的情況下就呼叫它們。
*   為延遲載入的工具傳送完整參數綱要。未載入的綱要不會計費；省略 `parameters` 會讓模型在擷取後無法呼叫該工具。
*   以服務前綴區分相似的工具名稱（例如 `billing_get_customer` 與 `crm_get_customer`），並在 `short_description` 開頭寫明服務名稱。
*   在用戶端擷取中，於 `description` 列出可搜尋的命名空間、以物件形式（而非 JSON 字串）回傳函式宣告，並在搜尋查無結果時回傳簡短訊息，列出可用的類別。
*   每次回應都要檢查 `interaction.steps` 中是否有 `function_call` 步驟，而不要只看 `interaction.status`，因為回傳 `function_call` 時，`status` 不一定是 `requires_action`。

## 限制 {#limitations}

*   僅支援 Interactions API（`v1beta`）。`generateContent` 不支援工具擷取。
*   在同一個請求內，無法同時使用伺服器端與用戶端擷取。
*   `defer_loading` 僅適用於伺服器端擷取。
*   模型在一個輪次內需要多個工具時，可能會發出多次搜尋呼叫。
*   已載入的工具會在對話剩餘時間內留在上下文中，無法卸載。
*   沒有任何延遲載入工具相符的查詢，會產生文字回應而非結構化錯誤。

## 後續步驟 {#whats-next}

*   在[函式呼叫](/docs/function-calling/)指南中學習基礎知識。
*   使用[多工具併用](/docs/function-calling/#native-tools)將工具擷取與內建工具結合。
*   瀏覽所有[工具](/docs/tools/)。
*   使用[上下文快取](/docs/caching/)降低重複的輸入成本。

