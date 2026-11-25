# Gemini API 中的動態工具擷取

讓數百個工具隨時待命，並在需要時按需載入參數結構描述，透過內建工具搜尋或您自己的用戶端登錄檔。

作者：[Philipp Schmid](https://x.com/_philschmid)
發布於 2026 年 11 月 20 日
閱讀時間 9 分鐘

[動態工具擷取](/docs/tool-retrieval/)（工具搜尋工具）已在 [Gemini API](/docs/interactions-overview/) 提供預覽版。您的代理可以讓數百個工具隨時待命，起初只看到簡短的名稱與說明，並只在任務需要時才載入完整的參數結構描述。

## 動態工具擷取的運作方式

動態工具擷取支援兩種模式，取決於您希望由 Gemini 處理搜尋，還是接入自己的擷取堆疊：**內建[伺服器端擷取](/docs/tool-retrieval/#server-side)：** 加入 `tool_search`，並將 [`defer_loading: true`](/docs/tool-retrieval/#defer-loading) 設定於函式或[遠端 MCP 伺服器](/docs/tool-retrieval/#mcp)上。Gemini 會將完整的參數結構描述排除在初始提示詞之外，每個工具只看到一行摘要（約 26 個 token，或使用[簡短說明](/docs/tool-retrieval/#short-description)時更少）。將最常用的 3 到 5 個工具保持載入狀態，其餘工具延遲載入。搜尋、結構描述載入與函式呼叫都在一次 API 要求中完成，因此您的提示詞前綴在各回合之間仍可[跨回合快取](/docs/tool-retrieval/#caching)。**自訂[用戶端擷取](/docs/tool-retrieval/#client-side)：** 宣告一個 `execution: "client"` 的 `tool_search` 工具，並將函式保存在外部登錄檔中。當模型呼叫您的搜尋工具時，您可以執行向量搜尋、權限篩選，或使用 [Gemini Decisions API](/docs/decisions-api/) 以零輸出 token 進行平行評分，然後在函式結果中傳回相符的結構描述。

![單次 Gemini API 呼叫中內建伺服器端動態工具擷取的順序圖](https://www.gstatic.com/aistudio-static/editorial/dynamic-tool-retrieval-gemini-api/953db1ea.png)

## 內建伺服器端擷取

以下是一個代理迴圈範例，示範如何使用內建伺服器端工具擷取。將 `tool_search` 工具加入您的 `tools` 清單，並以 `defer_loading: true` 標記延遲載入的工具。接著，您的迴圈運作方式與一般的函式呼叫相同：Gemini 會在伺服器端搜尋並載入結構描述，您在本機執行傳回的函式呼叫，並在每一回合將完整的[工具清單](/docs/tool-retrieval/#resend-tools)傳回。

```
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiVersion: "v1beta" });

const tools = [
  { type: "tool_search" as const },
  {
    type: "function" as const,
    name: "issue_refund",
    description:
      "Refund an order to the original payment method with optional partial amount and reason code.",
    short_description: "Refund an order to the original payment method.",
    defer_loading: true,
    parameters: {
      type: "object",
      properties: {
        order_id: { type: "string" },
        amount: { type: "number" },
      },
      required: ["order_id", "amount"],
    },
  },
  {
    type: "mcp_server" as const,
    name: "order_service",
    url: "https://gemini-api-demos.uc.r.appspot.com/mcp",
    defer_loading: true,
  },
];

function runLocalTool(name: string, args: Record<string, unknown>) {
  if (name === "issue_refund") {
    return { status: "refunded", order_id: args.order_id, amount: args.amount };
  }
  return { error: `Unknown tool: ${name}` };
}

let nextInput: any = "Order A-1042 arrived damaged. Please refund 40 dollars.";
let previousId: string | undefined;
let interaction;

while (true) {
  interaction = await ai.interactions.create({
    model: "gemini-4-neon",
    previous_interaction_id: previousId,
    input: nextInput,
    tools,
  });
  previousId = interaction.id;

  const functionCalls = (interaction.steps ?? []).filter(
    (s) => s.type === "function_call"
  );
  if (functionCalls.length === 0) break;

  nextInput = functionCalls.map((fc) => ({
    type: "function_result" as const,
    name: fc.name,
    call_id: fc.id,
    result: [
      {
        type: "text" as const,
        text: JSON.stringify(
          runLocalTool(fc.name!, (fc.arguments ?? {}) as Record<string, unknown>)
        ),
      },
    ],
  }));
}

console.log(interaction.output_text);
```

### 伺服器端回應的樣貌

在第一回合，回應步驟會顯示搜尋呼叫、已載入的結構描述，以及供您的應用程式執行的函式呼叫。伺服器會為您處理搜尋步驟，因此您只需執行自己的函式呼叫。如果您以[無狀態](/docs/tool-retrieval/#stateless)方式執行，請將每個步驟及其簽章原封不動地傳回。

```
{
  "id": "v1_Chd5eFVBYTZYZkpZam0yOG9QbUl6MjJRTRIXeXhVQWE2WGZKWWptMjhvUG1JejIyUU0",
  "status": "requires_action",
  "steps": [
    {
      "type": "tool_search_call",
      "id": "call_4556920196118434386",
      "arguments": {"function_names": ["issue_refund"]},
      "signature": "..."
    },
    {
      "type": "tool_search_result",
      "call_id": "call_4556920196118434386",
      "result": [
        {
          "type": "function",
          "name": "default_api:issue_refund",
          "parameters": {"...": "..."}
        }
      ],
      "signature": "..."
    },
    {
      "type": "function_call",
      "id": "call_12826847808633637368",
      "name": "issue_refund",
      "arguments": {"order_id": "A-1042", "amount": 40}
    }
  ]
}
```

## 使用 Decisions API 建立自己的擷取器

以下是一個代理迴圈範例，示範如何搭配 [Gemini Decisions API](/docs/decisions-api/) 接入自己的擷取器。宣告一個 `execution: "client"` 的 `tool_search` 工具，並將工具目錄保留在要求之外。當模型呼叫您的搜尋工具時，Gemini Decision 1 會以校準機率（0.01 至 0.99）平行為您的工具評分，且不產生輸出 token，您的應用程式只會傳回相符的結構描述。

![圖表顯示使用 Gemini Decision 1 為 200 個外部工具評分，並將相符的結構描述注入 function_result 的用戶端工具擷取](https://www.gstatic.com/aistudio-static/editorial/dynamic-tool-retrieval-gemini-api/ef91d24d.png)

```
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiVersion: "v1beta" });

// External tool catalog (never sent in tools[] upfront)
const TOOL_REGISTRY = {
  get_billing_history: {
    type: "function" as const,
    name: "get_billing_history",
    description: "Retrieve invoices and payment history for a user.",
    parameters: {
      type: "object",
      properties: { user_id: { type: "integer" } },
      required: ["user_id"],
    },
  },
  get_shipment_status: {
    type: "function" as const,
    name: "get_shipment_status",
    description: "Track package delivery status and carrier updates.",
    parameters: {
      type: "object",
      properties: { order_id: { type: "string" } },
      required: ["order_id"],
    },
  },
};

async function searchRegistryWithDecisions(query: string, threshold = 0.5) {
  const questions = Object.fromEntries(
    Object.entries(TOOL_REGISTRY).map(([name, schema]) => [
      name,
      {
        type: "noul" as const,
        instructions: `Is the tool '${name}' (${schema.description}) needed for this request?`,
      },
    ])
  );

  const decision = await ai.decisions.create({
    model: "gemini-decision-1",
    input: query,
    questions,
  });

  return Object.entries(decision.answers ?? {})
    .filter(([, ans]) => ans.type === "noul" && (ans.noul ?? 0) >= threshold)
    .map(([name]) => TOOL_REGISTRY[name as keyof typeof TOOL_REGISTRY]);
}

const tools = [
  {
    type: "tool_search" as const,
    execution: "client" as const,
    name: "search_tool_registry", // any name you want
    description:
      "Search the internal tool registry for billing, shipping, or account tools.",
    parameters: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  },
];

let nextInput: any = "Look up the billing history and invoices for user 123.";
let previousId: string | undefined;
let interaction;

while (true) {
  interaction = await ai.interactions.create({
    model: "gemini-4-neon",
    previous_interaction_id: previousId,
    input: nextInput,
    tools, // stays unchanged across turns
  });
  previousId = interaction.id;

  const functionCalls = (interaction.steps ?? []).filter(
    (s) => s.type === "function_call"
  );
  if (functionCalls.length === 0) break;

  nextInput = await Promise.all(
    functionCalls.map(async (fc) => {
      if (fc.name === "search_tool_registry") {
        const query = String((fc.arguments as { query?: string })?.query ?? "");
        const matches = await searchRegistryWithDecisions(query);
        return {
          type: "function_result" as const,
          name: fc.name,
          call_id: fc.id,
          result:
            matches.length > 0
              ? matches
              : [{ type: "text" as const, text: "No matching tools found." }],
        };
      }

      const output = {
        user_id: 123,
        invoices: [{ id: "inv_9", amount: 49 }],
      };
      return {
        type: "function_result" as const,
        name: fc.name,
        call_id: fc.id,
        result: [{ type: "text" as const, text: JSON.stringify(output) }],
      };
    })
  );
}

console.log(interaction.output_text);
```

### 用戶端線路流程的樣貌

由於搜尋由您的應用程式負責，Gemini 會使用您自訂的搜尋工具名稱發出一般的函式呼叫。您在結果中傳回相符的結構描述，同時保持工具清單不變，讓提示詞前綴維持可快取狀態。從第 2 回合起，恢復一般的函式呼叫，每次搜尋會增加一次往返。

```
// Turn 1 response step: model calls your custom search tool
{
  "type": "function_call",
  "id": "call_4044047903665466125",
  "name": "search_tool_registry",
  "arguments": {"query": "billing invoices"}
}

// Turn 2 input: your app injects the matching schemas from the Decisions API
{
  "type": "function_result",
  "name": "search_tool_registry",
  "call_id": "call_4044047903665466125",
  "result": [
    {
      "type": "function",
      "name": "get_billing_history",
      "description": "Retrieve invoices and payment history for a user.",
      "parameters": {
        "type": "object",
        "properties": {"user_id": {"type": "integer"}},
        "required": ["user_id"]
      }
    }
  ]
}

// Turn 2 response step: model calls the tool you just injected
{
  "type": "function_call",
  "id": "call_13225774024630221018",
  "name": "get_billing_history",
  "arguments": {"user_id": 123}
}
```

## 使用時機

選擇符合您的工具數量、延遲預算，以及工具定義所在位置的擷取模式。

| 模式 | 適用情境 | 額外往返次數 | 遠端 MCP |
| --- | --- | --- | --- |
| **靜態載入** | 工具少於 20 個且穩定、不需要搜尋開銷的情況。 | 無 | 支援 |
| **伺服器端擷取** | 大型固定工具程式庫，以及對延遲敏感、且無需撰寫擷取程式碼的代理。 | 無（1 次 API 呼叫） | 透過 `defer_loading` 支援 |
| **用戶端擷取** | 外部登錄檔、依使用者篩選、向量搜尋，或 Gemini Decision 1 路由。 | 每次搜尋 1 次 | 在您的應用程式中處理 |

對於大多數大型工具程式庫，請先使用內建伺服器端擷取；當您需要自訂排名、向量搜尋或依使用者授權時，再改用用戶端擷取。如需錯誤處理、token 計價與無狀態用法的相關資訊，請參閱[工具擷取文件](/docs/tool-retrieval/)。
