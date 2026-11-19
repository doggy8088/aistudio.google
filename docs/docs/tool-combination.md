# 結合內建工具與函式呼叫


!!! note " "

      此功能目前為[預覽版](/docs/models/#preview)，支援 [Gemini 4](/docs/models/#gemini-4) 與 [Gemini 3](/docs/models/#gemini-3) 模型。


Gemini 允許在單一互動中結合[內建工具](/docs/tools/)（例如 `google_search`）與[函式呼叫](/docs/function-calling/)（亦稱為*自訂工具*），做法是保留並公開工具呼叫的上下文記錄。結合內建與自訂工具後，便能實現複雜的代理式工作流程；例如，模型可以先以即時網路資料為自己接地，再呼叫你特定的業務邏輯。

以下範例示範如何透過 `google_search` 與自訂函式 `getWeather` 啟用內建與自訂工具的組合：


=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      from google import genai

      client = genai.Client()

      getWeather = {
          "type": "function",
          "name": "getWeather",
          "description": "Gets the weather for a requested city.",
          "parameters": {
              "type": "object",
              "properties": {
                  "city": {
                      "type": "string",
                      "description": "The city and state, e.g. Utqiaġvik, Alaska",
                  },
              },
              "required": ["city"],
          },
      }

      # The Interactions API manages context automatically across tool calls.
      # The model will first use Google Search, then call getWeather.
      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="What is the northernmost city in the United States? What's the weather like there today?",
          tools=[
              {"type": "google_search"},
              getWeather,
          ],
      )

      # Process steps: the interaction contains search results and a function call
      for step in interaction.steps:
          if step.type == "function_call":
              print(f"Function call: {step.name} with args: {step.arguments}")
              # In a real application, you would execute the function here
              # and provide the result back to the model.
      ```

=== "JavaScript"

      ```javascript
      // This will only work for SDK newer than 2.0.0
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      // The Interactions API manages context automatically across tool calls.
      // The model will first use Google Search, then call getWeather.
      const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: "What is the northernmost city in the United States? What's the weather like there today?",
          tools: [
              { type: "google_search" },
              {
                  type: "function",
                  name: "get_weather",
                  description: "Get current weather",
                  parameters: {
                      type: "object",
                      properties: { location: { type: "string" } },
                      required: ["location"],
                  },
              },
          ],
      });

      // Process steps: the interaction contains search results and a function call
      for (const step of interaction.steps) {
          if (step.type === "function_call") {
              console.log(`Function call: ${step.name} with args: ${JSON.stringify(step.arguments)}`);
              // In a real application, you would execute the function here
              // and provide the result back to the model.
          }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.GoogleSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");

      Function customFunc =
          Function.builder()
              .name("get_user_location")
              .description("Retrieves user current location.")
              .parameters(parameters)
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("What is the weather like where I am right now?"))
              .tools(Arrays.asList(customFunc, new GoogleSearch()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

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
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          customFunc := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("get_user_location"),
              Description: genai.Ptr("Retrieves user current location."),
              Parameters: map[string]any{
                  "type": "object",
              },
          })

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("What is the weather like where I am right now?"),
                  Tools: []interactions.Tool{
                      customFunc,
                      interactions.NewTool(interactions.GoogleSearch{}),
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

=== "REST"

      ```bash
      # Specifies the API revision to avoid breaking changes when they become default
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Api-Revision: 2026-05-20" \
      -d '{
        "model": "gemini-4-hydrogen",
        "input": "What is the northernmost city in the United States? What'\''s the weather like there today?",
        "tools": [
          { "type": "google_search" },
          {
            "type": "function",
            "name": "getWeather",
            "description": "Get the weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    }
                },
                "required": ["location"]
            }
          }
        ]
      }'
      ```


## 運作方式 {#how-it-works}

Gemini 3 模型運用*工具上下文流通*來實現內建與自訂工具的組合。工具上下文流通能保留並公開內建工具的上下文，並在同一次互動中與自訂工具共用。

### 啟用工具組合 {#enable}

* 加入 [`function_declarations`](/docs/function-calling/#function-declarations)，以及你想使用的內建工具，即可觸發組合行為。

### API 回傳的步驟 {#api-returns-steps}

在互動回應中，API 會為內建工具呼叫與函式（自訂工具）呼叫分別回傳步驟：

*   **內建工具步驟**：API 會自動管理這些步驟，並跨回合保留上下文。

*   **函式呼叫步驟**：API 會為你的自訂函式回傳 `function_call` 步驟。你負責執行該函式，並將結果回傳。


### 回傳步驟中的關鍵欄位 {#critical-fields}

回傳步驟中的某些欄位，對於維持工具上下文與實現工具組合至關重要：

* **`id`**：出現在 `function_call` 與 `function_response` 步驟上，是將呼叫對應到其回應的唯一識別碼。
* **`signature`**：出現在 `thought` 步驟上，也出現在 Gemini 3 以上模型的所有工具呼叫（例如 `function_call`）與結果（例如 `function_response`）步驟上。這段加密上下文能讓**工具上下文流通**跨互動運作。

**管理這些欄位的方式：**

* **有狀態模式（建議）**：使用 `previous_interaction_id` 時，伺服器會自動處理 `id` 與 `signature` 兩個欄位。
* **無狀態模式**：若要手動管理對話記錄，你必須確保在後續請求中將 `id` 與 `signature` 兩個欄位都回傳給模型，以驗證真實性並維持上下文。只要把完整的回應物件回傳到記錄中，官方 SDK 就會自動處理這件事。

### 工具專屬資料 {#data}

部分內建工具會回傳依工具類型而定的使用者可見資料引數。


| 工具 | 使用者可見的工具呼叫引數（如有） | 使用者可見的工具回應（如有） |
| --- | --- | --- |
| **google_search** | `queries` | `search_suggestions` |
| **google_maps** | `queries` | `places` `google_maps_widget_context_token` |
| **url_context** | `urls` 要瀏覽的 URL | `status`：瀏覽狀態 `retrieved_url`：已瀏覽的 URL |
| **file_search** | 無 | 無 |


## token 與定價 {#tokens}

請注意，請求中的內建工具呼叫部分會列入 `prompt_token_count` 計算。由於這些中間工具步驟現在會顯示並回傳給你，它們便成為對話記錄的一部分。這只適用於*請求*，不適用於*回應*。

Google 搜尋工具是這項規則的例外。Google 搜尋已在查詢層級套用自己的定價模式，因此 token 不會被重複收費（請參閱[定價](/docs/pricing/)頁面）。

詳情請參閱[token](/docs/tokens/)頁面。

## 限制 {#limitations}

* 啟用工具上下文流通時，預設使用 `validated` 模式（不支援 `auto` 模式）。

* 像 `google_search` 這類內建工具仰賴地點與目前時間資訊，因此若你的 `system_instruction` 或 `function_declaration.description` 含有相互衝突的地點與時間資訊，工具組合功能可能無法順利運作。


## 支援的工具 {#supported-tools}

標準的工具上下文流通適用於伺服器端（內建）工具。程式碼執行同樣是伺服器端工具，但它有自己內建的上下文流通解決方案。Computer Use 與函式呼叫則是用戶端工具，同樣具備內建的上下文流通解決方案。

| 工具 | 執行端 | 上下文流通支援 |
| :--- | :--- | :--- |
| [Google 搜尋](/docs/google-search/) | 伺服器端 | 支援 |
| [Google Maps](/docs/maps-grounding/) | 伺服器端 | 支援 |
| [URL 上下文](/docs/url-context/) | 伺服器端 | 支援 |
| [File Search](/docs/file-search/) | 伺服器端 | 支援 |
| [程式碼執行](/docs/code-execution/) | 伺服器端 | 支援（內建，使用 `code_execution` 與 `code_execution_result` 步驟） |
| [Computer Use](/docs/computer-use/) | 用戶端 | 支援（內建，使用 `function_call` 與 `function_response` 步驟） |
| [自訂函式](/docs/function-calling/) | 用戶端 | 支援（內建，使用 `function_call` 與 `function_response` 步驟） |

## 後續步驟 {#whats-next}

* 進一步瞭解 Gemini API 中的[函式呼叫](/docs/function-calling/)。
* 探索支援的工具：
  * [Google 搜尋](/docs/google-search/)
  * [Google Maps](/docs/maps-grounding/)
  * [URL 上下文](/docs/url-context/)
  * [File Search](/docs/file-search/)
