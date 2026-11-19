# Gemini 3.5 Flash 新功能


!!! note " "

       **已淘汰**：Gemini 3.5 Flash
      (`gemini-3.5-flash`) 已淘汰，並由
      [Gemini 3.6 Flash (`gemini-3.6-flash`)](/docs/whats-new-gemini-3.6/) 取代。目前
      已無法在 Google AI Studio 中選用，傳送至
      `gemini-3.5-flash` 的 API 要求會自動路由至 `gemini-3.6-flash`。請將
      模型字串更新為 `gemini-3.6-flash`（或改用
      [Gemini 3.8 Flash](/docs/latest-model/)），並參閱
      [Gemini 3.6 Flash 指南](/docs/whats-new-gemini-3.6/)。


Gemini 3.5 Flash (`gemini-3.5-flash`) 是 Gemini 3 系列中較早一代的 Flash 模型，
目前已淘汰，並會自動路由至
[Gemini 3.6 Flash](/docs/whats-new-gemini-3.6/)。

本指南保留供參考，記錄 Gemini 3.5 Flash 所具備的功能，以及 Gemini 3.x 基礎參數的相關更新。

## 模型總覽 {#new-model}

| 模型 | 模型 ID | 說明 |
| :--- | :--- | :--- |
| Gemini 3.5 Flash（已淘汰） | `gemini-3.5-flash` | 較早一代的 Flash 模型，適用於代理與程式設計工作。已由 [Gemini 3.6 Flash](/docs/whats-new-gemini-3.6/) 取代。 |

Gemini 3.5 Flash 支援 1Mtokens的上下文視窗、最多 65k 個輸出 tokens、思考功能，以及與 Gemini 3 Flash 相同的工具與平台功能，包括 [Computer Use](/docs/computer-use/)。

完整規格請參閱[模型總覽](/docs/models/gemini-3.5-flash/)。

## 快速入門 {#quickstart}

本指南中的所有範例均使用 Interactions API。本指南也支援 GenerateContent API，且適用相同的設定選項與建議。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-3.6-flash",
          input="Explain how parallel agentic execution works in three sentences."
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      async function main() {
        const interaction = await client.interactions.create({
          model: "gemini-3.6-flash",
          input: "Explain how parallel agentic execution works in three sentences.",
        });
        console.log(interaction.output_text);
      }

      await main();
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-3.6-flash",
          "input": "Explain how parallel agentic execution works in three sentences."
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-3.5-flash"))
              .input(
                  InteractionsInput.of(
                      "Explain how parallel agentic execution works in three sentences."))
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-3.5-flash"),
                  Input: interactions.NewInteractionsInput("Explain how parallel agentic execution works in three sentences."),
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


## 新功能 {#whats-new}

*   **持續的前沿效能**：我們最聰明的 Flash 模型，針對大規模代理與程式設計工作最佳化。
*   **代理執行**：可大規模部署子代理、解決問題，並進行快速的代理迴圈。
*   **程式設計**：反覆進行程式設計循環、快速探索與製作原型，以測試不同路徑並動態探索解決方案。
*   **長程工作**：大規模的多步驟工作流程與工具使用。
*   **思考保留**：模型會自動在多輪對話之間保留中間推理過程，無需變更 API。
*   **新的預設思考強度等級**：預設思考強度已由 `high` 改為 `medium`。詳情請參閱[新的預設思考強度等級](/docs/whats-new-gemini-3.5/#default-effort-level)。
*   **改良的 `low` 思考**：`low` 現在已針對步驟較少的程式碼與代理工作大幅改良，能以更低的延遲與成本提供優異品質。
*   **正式發布**：穩定模型，可用於大規模正式環境。

### 選擇合適的 Flash 模型 {#choose-model}

Gemini 3.5 Flash 已淘汰，並會自動路由至
[Gemini 3.6 Flash](/docs/whats-new-gemini-3.6/)。我們會依您的成本、延遲與
能力需求，推薦下列模型：

*   **Gemini 3.8 Flash**：我們最新、最聰明的 Flash 模型，適用於
    複雜的程式設計與代理工作流程。請參閱
    [Gemini 3.8 Flash 指南](/docs/latest-model/)。
*   **Gemini 3.6 Flash**：Gemini 3.5 Flash 的直接替代模型，token 用量更少，
    輸出價格也更低。請參閱
    [Gemini 3.6 Flash 與 3.5 Flash-Lite 指南](/docs/whats-new-gemini-3.6/)。
*   **Gemini 3.5 Flash-Lite / Gemini 3.1 Flash-Lite**：若工作成本低、數量大，
    且不需要完整的 Flash 推理深度，請使用
    [Gemini 3.5 Flash-Lite](/docs/models/gemini-3.5-flash-lite/) 或
    [Gemini 3.1 Flash-Lite](/docs/models/gemini-3.1-flash-lite/)。

## 行為變更 {#behavioral-changes}

### 新的預設思考強度等級：`medium` {#default-effort-level}

預設思考強度現在為 **`medium`**，已由 Gemini 3
Flash Preview 的 `high` 變更。`medium` 能在各種工作上提供非常好的結果，
同時速度更快、成本效益更高。面對複雜問題時，`high`
會促使模型進行更深入的思考。

| 思考強度等級 | 適用時機 |
| :--- | :--- |
| `minimal` | 針對回應速度最佳化。適用於聊天類用途、快速的事實型回答，以及較簡單的工具呼叫。 |
| `low` | 適用於需要較低延遲與較少步驟的程式碼與代理工作。也適用於需要一定思考的分析與寫作工作。 |
| **`medium` (default)** | **適用於大多數工作，品質最佳。建議用於複雜的程式碼與代理用途。** |
| `high` | 將模型的思考與工具使用能力發揮到最大。最適合複雜推理、困難的數學，以及最艱難的程式碼或代理工作。可進行延伸思考與函式呼叫。 |

如要覆寫預設值，請在設定中指定 `thinking_level`：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-3.6-flash",
          input="Prove that the square root of 2 is irrational.",
          generation_config={"thinking_level": "high"},
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      async function main() {
        const interaction = await client.interactions.create({
          model: "gemini-3.6-flash",
          input: "Prove that the square root of 2 is irrational.",
          generation_config: { thinking_level: "high" },
        });
        console.log(interaction.output_text);
      }

      await main();
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-3.6-flash",
          "input": "Prove that the square root of 2 is irrational.",
          "generation_config": {"thinking_level": "high"}
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.GenerationConfig;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ThinkingLevel;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-3.5-flash"))
              .input(InteractionsInput.of("Prove that the square root of 2 is irrational."))
              .generationConfig(GenerationConfig.builder().thinkingLevel(ThinkingLevel.HIGH).build())
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-3.5-flash"),
                  Input: interactions.NewInteractionsInput("Prove that the square root of 2 is irrational."),
                  GenerationConfig: &interactions.GenerationConfig{
                      ThinkingLevel: interactions.ThinkingLevelHigh.ToPointer(),
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


!!! note " "

      請先從 `medium` 開始，它能為絕大多數工作提供最佳品質。若想獲得更快、更便宜且品質依然優異的體驗，請試用 `low`。面對複雜推理、困難的數學或艱難的程式設計挑戰時，請切換至
      `high`。若要為簡單查詢最佳化速度，請使用
      `minimal`。


下表列出各模型支援的思考等級：


| 思考等級 | Gemini 3.5 Flash | Gemini 3.1 Pro | Gemini 3.1 Flash-Lite | Gemini 3 Flash | 說明 |
| --- | --- | --- | --- | --- | --- |
| **`minimal`** | Supported | Not supported | Supported (Default) | Supported | 在大多數查詢中，相當於「不思考」的設定。請注意，`minimal` 並不保證完全關閉思考，模型在處理複雜工作時仍可能進行極少量的推理。 |
| **`low`** | Supported | Supported | Supported | Supported | 將延遲與成本降到最低。 |
| **`medium`** | Supported (Default) | Supported | Supported | Supported | 適用於大多數工作的均衡思考等級。 |
| **`high`** | Supported (Dynamic) | Supported (Default, Dynamic) | Supported (Dynamic) | Supported (Default, Dynamic) | 將推理深度發揮到最大。 |


!!! note " "

      同一個要求中不能同時使用 `thinking_level` 與舊版 `thinking_budget` 參數，
      否則會傳回 400 錯誤。


### 思考保留 {#thought-preservation}

模型會自動在多輪對話之間保留中間推理過程。當對話記錄中存在推理上下文時，
該上下文會延續至後續回合，進而提升反覆除錯與程式碼重構等複雜多步驟工作的效能。無需變更 API：

*   **Interactions API**：思考內容已自動保留，行為不變。
*   **GenerateContent API**：自 Gemini 3.5 Flash 起，當對話記錄中存在思考簽章時，模型會使用先前所有回合的推理上下文。如要啟用此功能，請在 `contents` 中傳入完整且未經修改的對話記錄（包括[思考簽章](/docs/thinking/#signatures)）。SDK 會自動處理此事。

## Gemini 3.x 的參數更新與最佳做法 {#parameter-updates}

以下內容適用於**所有 Gemini 3.x 模型**，包括 Gemini 3.5 Flash。

*   **`temperature`, `top_p`, `top_k`**：我們強烈建議不要變更預設值。Gemini 3 的推理能力已針對預設設定最佳化。
*   請使用 `thinking_level`，不要使用 `thinking_budget`。
*   **函式呼叫回應配對**：`id`、`name` 與回應數量必須與前面的呼叫相符。
*   **多模態函式回應**：請將多模態內容放在函式回應內部，不要放在外部。
*   **函式回應中的行內指令**：請附加至函式回應文字，不要另列為獨立部分。
*   **減少不必要的工具呼叫**：在代理工作流程中，可使用較低的思考等級，或透過系統指令進行實驗，以減少工具呼叫。

如何更新程式碼，請參閱下列各節。

### 取樣參數（不再建議使用） {#sampling-parameters}

所有 Gemini 3.x 模型現在都不再建議使用 `temperature`、`top_p` 與 `top_k`。Gemini 3 的推理能力已針對預設
設定最佳化。**請從所有要求中移除這些參數。**

```python
# ⚠️ Remove these parameters (not recommended)
generation_config = {
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": 40,
}
```

如要確保結果具確定性，建議您針對特定用途定義含有明確規則的系統指令。

### `thinking_budget`（不再建議使用） {#thinking-budget}

所有 Gemini 3.x 模型現在都不再建議使用原始數值型 `thinking_budget` 參數。請改用 `thinking_level` 字串列舉。

```python
# ⚠️ Before (not recommended)
generation_config = {
    "thinking": {"thinking_budget": 7500},
}

# ✅ After
generation_config = {
    "thinking": {"thinking_level": "medium"},
}
```

可用值為：`minimal`、`low`、`medium`（預設）與 `high`。

### 函式呼叫：嚴格的回應配對 {#function-calling}

Interactions API 已會在函式回應不相符時傳回錯誤。GenerateContent API 目前尚不會傳回錯誤，但在大多數情況下，不相符的回應會導致模型傳回 `finish_reason: STOP` 的空白回應。請務必遵循下列慣例：

| 要求 | 詳細說明 |
| :--- | :--- |
| 包含 `id` | 每個 `FunctionResponse` 都必須包含 `id`，該值來自對應的 `FunctionCall` |
| 配對 `name` | 回應中的 `name` 必須與呼叫中的 `name` 相符 |
| 配對數量 | 恰好傳回一個 `FunctionResponse`，對應收到的每個 `FunctionCall` |


=== "Python"

      ```python
      # ✅ Include matching call_id and name in the function_result
      final_interaction = client.interactions.create(
          model="gemini-3.6-flash",
          previous_interaction_id=interaction.id,
          tools=[my_tool],
          input=[{
              "type": "function_result",
              "name": fc_step.name,
              "call_id": fc_step.id,
              "result": [{"type": "text", "text": json.dumps(result)}],
          }],
      )
      ```

=== "JavaScript"

      ```javascript
      // ✅ Include matching call_id and name in the function_result
      const finalInteraction = await client.interactions.create({
        model: "gemini-3.6-flash",
        previousInteractionId: interaction.id,
        tools: [myTool],
        input: [{
          type: "function_result",
          name: fcStep.name,
          call_id: fcStep.id,
          result: [{ type: "text", text: JSON.stringify(result) }],
        }],
      });
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-3.6-flash",
          "previous_interaction_id": "<INTERACTION_ID>",
          "tools": [...],
          "input": [{
            "type": "function_result",
            "name": "my_function",
            "call_id": "<CALL_ID>",
            "result": [{"type": "text", "text": "..."}]
          }]
        }'
      ```

=== "Java"

      ```java
      import java.util.Arrays;
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionResultStep;
      import com.google.genai.gaos.models.interactions.FunctionResultStepResultUnion;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.List;

      Client client = new Client();

      // Assumes interactionId, callId, functionName, myTool, and resultJson from previous step
      String interactionId = "interaction-id-123";
      String callId = "call-id-123";
      String functionName = "get_weather";
      Function myTool = Function.builder().name(functionName).build();
      String resultJson = "{\"temperature\": \"72F\"}";

      // ✅ Include matching callId and name in the FunctionResultStep
      FunctionResultStep functionResult =
          FunctionResultStep.builder()
              .name(functionName)
              .callId(callId)
              .result(
                  FunctionResultStepResultUnion.of(
                      Arrays.asList(TextContent.builder().text(resultJson).build())))
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-3.5-flash"))
              .previousInteractionId(interactionId)
              .tools(Arrays.asList(myTool))
              .input(InteractionsInput.ofStep(Arrays.asList(functionResult)))
              .build();

      Interaction finalInteraction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
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

          // Assumes interactionID, callID, functionName, myTool, and resultJSON from previous step
          interactionID := "interaction-id-123"
          callID := "call-id-123"
          functionName := "get_weather"
          myTool := interactions.NewTool(interactions.Function{Name: genai.Ptr(functionName)})
          resultJSON := `{"temperature": "72F"}`

          // ✅ Include matching CallID and Name in the FunctionResultStep
          functionResult := interactions.NewStep(interactions.FunctionResultStep{
              Name:   genai.Ptr(functionName),
              CallID: callID,
              Result: interactions.NewFunctionResultStepResultUnion([]interactions.FunctionResultSubcontent{
                  interactions.NewFunctionResultSubcontent(interactions.TextContent{Text: resultJSON}),
              }),
          })

          finalRes, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:                 interactions.Model("gemini-3.5-flash"),
                  PreviousInteractionID: genai.Ptr(interactionID),
                  Tools:                 []interactions.Tool{myTool},
                  Input:                 interactions.NewInteractionsInput([]interactions.Step{functionResult}),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          _ = finalRes
      }
      ```


### 多模態函式回應 {#multimodal-function-responses}

我們經常看到用戶端將圖片放在函式回應之外提供。這可能導致模型出現非預期行為（例如思考內容外洩），並產生品質較低的輸出。請改為遵循 [Multimodal Function Responses API 文件](/docs/function-calling/?example=meeting#multimodal)中的建議，將您傳送給模型的多模態內容放在函式回應部分中。模型能在下一回合處理這些多模態內容，進而產生資訊更充分的回應。


=== "Python"

      ```python
      # ✅ Include multimodal content in the function response
      final_interaction = client.interactions.create(
          model="gemini-3.6-flash",
          previous_interaction_id=interaction.id,
          input=[
              {
                  "type": "function_result",
                  "name": tool_call.name,
                  "call_id": tool_call.id,
                  "result": [
                      {"type": "text", "text": "instrument.jpg"},
                      {
                          "type": "image",
                          "mime_type": "image/jpeg",
                          "data": base64_image_data,
                      },
                  ],
              }
          ],
      )
      ```

=== "JavaScript"

      ```javascript
      // ✅ Include multimodal content in the function response
      const finalInteraction = await client.interactions.create({
        model: "gemini-3.6-flash",
        previousInteractionId: interaction.id,
        input: [{
          type: "function_result",
          name: toolCall.name,
          call_id: toolCall.id,
          result: [
            { type: "text", text: "instrument.jpg" },
            {
              type: "image",
              mime_type: "image/jpeg",
              data: base64ImageData,
            },
          ],
        }],
      });
      ```

=== "Java"

      ```java
      import java.util.Arrays;
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.FunctionResultStep;
      import com.google.genai.gaos.models.interactions.FunctionResultStepResultUnion;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.List;

      Client client = new Client();

      // Assumes interactionId, callId, functionName, and base64ImageData from previous step
      String interactionId = "interaction-id-123";
      String callId = "call-id-123";
      String functionName = "get_instrument_image";
      String base64ImageData = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

      // ✅ Include multimodal content in the function response
      FunctionResultStep functionResult =
          FunctionResultStep.builder()
              .name(functionName)
              .callId(callId)
              .result(
                  FunctionResultStepResultUnion.of(
                      Arrays.asList(
                          TextContent.builder().text("instrument.jpg").build(),
                          ImageContent.builder()
                              .mimeType(ImageContentMimeType.IMAGE_JPEG)
                              .data(base64ImageData)
                              .build())))
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-3.5-flash"))
              .previousInteractionId(interactionId)
              .input(InteractionsInput.ofStep(Arrays.asList(functionResult)))
              .build();

      Interaction finalInteraction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
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

          // Assumes interactionID, callID, functionName, and base64ImageData from previous step
          interactionID := "interaction-id-123"
          callID := "call-id-123"
          functionName := "get_instrument_image"
          base64ImageData := "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="

          // ✅ Include multimodal content in the function response
          functionResult := interactions.NewStep(interactions.FunctionResultStep{
              Name:   genai.Ptr(functionName),
              CallID: callID,
              Result: interactions.NewFunctionResultStepResultUnion([]interactions.FunctionResultSubcontent{
                  interactions.NewFunctionResultSubcontent(interactions.TextContent{
                      Text: "instrument.jpg",
                  }),
                  interactions.NewFunctionResultSubcontent(interactions.ImageContent{
                      MimeType: interactions.ImageContentMimeType("image/jpeg").ToPointer(),
                      Data:     genai.Ptr(base64ImageData),
                  }),
              }),
          })

          finalRes, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:                 interactions.Model("gemini-3.5-flash"),
                  PreviousInteractionID: genai.Ptr(interactionID),
                  Input:                 interactions.NewInteractionsInput([]interactions.Step{functionResult}),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          _ = finalRes
      }
      ```


### 函式回應中的行內指令 {#inline-instructions}

我們經常看到用戶端將額外指令連同函式
回應一起以接續的 `Parts` 形式提供。這可能導致模型出現非預期行為
（例如思考內容外洩），並產生品質較低的輸出。請改為將任何
額外指令附加至函式回應文字的末尾，並以兩個換行字元分隔。


=== "Python"

      ```python
      # ✅ Append inline instructions to the end of the function response separated by two newlines
      result_text = f"{json.dumps(result)}\n\n<your inline instructions>"

      final_interaction = client.interactions.create(
          model="gemini-3.6-flash",
          previous_interaction_id=interaction.id,
          tools=[my_tool],
          input=[{
              "type": "function_result",
              "name": fc_step.name,
              "call_id": fc_step.id,
              "result": [{"type": "text", "text": result_text}],
          }],
      )
      ```

=== "JavaScript"

      ```javascript
      // ✅ Append inline instructions to the end of the function response separated by two newlines
      const resultText = `${JSON.stringify(result)}\n\n<your inline instructions>`;

      const finalInteraction = await client.interactions.create({
        model: "gemini-3.6-flash",
        previousInteractionId: interaction.id,
        tools: [myTool],
        input: [{
          type: "function_result",
          name: fcStep.name,
          call_id: fcStep.id,
          result: [{ type: "text", text: resultText }],
        }],
      });
      ```

=== "Java"

      ```java
      import java.util.Arrays;
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionResultStep;
      import com.google.genai.gaos.models.interactions.FunctionResultStepResultUnion;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.List;

      Client client = new Client();

      // Assumes interactionId, callId, functionName, myTool, and resultJson from previous step
      String interactionId = "interaction-id-123";
      String callId = "call-id-123";
      String functionName = "get_weather";
      Function myTool = Function.builder().name(functionName).build();
      String resultJson = "{\"temperature\": \"72F\"}";

      // ✅ Append inline instructions to the end of the function response separated by two newlines
      String resultText = resultJson + "\n\n<your inline instructions>";

      FunctionResultStep functionResult =
          FunctionResultStep.builder()
              .name(functionName)
              .callId(callId)
              .result(
                  FunctionResultStepResultUnion.of(
                      Arrays.asList(TextContent.builder().text(resultText).build())))
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-3.5-flash"))
              .previousInteractionId(interactionId)
              .tools(Arrays.asList(myTool))
              .input(InteractionsInput.ofStep(Arrays.asList(functionResult)))
              .build();

      Interaction finalInteraction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
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

          // Assumes interactionID, callID, functionName, myTool, and resultJSON from previous step
          interactionID := "interaction-id-123"
          callID := "call-id-123"
          functionName := "get_weather"
          myTool := interactions.NewTool(interactions.Function{Name: genai.Ptr(functionName)})
          resultJSON := `{"temperature": "72F"}`

          // ✅ Append inline instructions to the end of the function response separated by two newlines
          resultText := resultJSON + "\n\n<your inline instructions>"

          functionResult := interactions.NewStep(interactions.FunctionResultStep{
              Name:   genai.Ptr(functionName),
              CallID: callID,
              Result: interactions.NewFunctionResultStepResultUnion([]interactions.FunctionResultSubcontent{
                  interactions.NewFunctionResultSubcontent(interactions.TextContent{Text: resultText}),
              }),
          })

          finalRes, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:                 interactions.Model("gemini-3.5-flash"),
                  PreviousInteractionID: genai.Ptr(interactionID),
                  Tools:                 []interactions.Tool{myTool},
                  Input:                 interactions.NewInteractionsInput([]interactions.Step{functionResult}),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          _ = finalRes
      }
      ```


### 減少不必要的工具呼叫 {#reducing-tool-calls}

如果您遇到工具呼叫過度使用的情況，以下兩種技巧有助於減少呼叫次數：

1.  **先降低思考等級**（`medium`、`low` 或 `minimal`）：
    較高的思考等級會促使模型使用更多工具進行探索與
    驗證，因此降低等級可減少工具呼叫。

2.  **加入系統指令**：如果在調整
    思考等級後仍過度使用，請考慮使用限制工具用量的提示詞。例如：

    ```text
    You have a limited action budget of <n> tool calls. Use them efficiently.
    ```


!!! note " "

       **我們強烈建議更新至 `google-genai`
      SDK v2.0.0 或更新版本。** 此版本為
      Interactions API 引入了破壞性變更。詳情請參閱
      [破壞性變更遷移指南](/docs/interactions-breaking-changes-may-2026/)。


## Gemini 3 系列功能 {#gemini-3-features}

Gemini 3.5 Flash 繼承了 Gemini 3 系列的全部功能，包括 Computer Use。
Gemini 3 推出並延續至今的功能包括：

*   [**Thinking**](/docs/thinking/)**：** 在 API 呼叫之間保留加密的推理上下文。在 Interactions API 中自動啟用；在 GenerateContent 中則為隱含啟用。
*   [**Structured outputs with tools**](/docs/structured-output/)**：** 將 JSON 模式與內建工具（Search、URL context、程式碼執行、函式呼叫）結合使用。
*   [**Multimodal function responses**](/docs/function-calling/#multimodal)**：** 在函式呼叫結果中傳回圖片、音訊與其他媒體。
*   [**Code execution with images**](/docs/code-execution/#images)**：** 執行可處理並產生圖片的程式碼。
*   [**Combined tool use**](/docs/tool-combination/)**：** 在同一個要求中同時使用內建工具與自訂函式呼叫。
*   [**Media resolution**](/docs/media-resolution/)**：** 精細控制圖片、影片與 PDF 輸入的 token 配置。Gemini 3 模型支援依內容項目設定解析度（`low`、`medium`、`high`、`ultra_high`），適用於混合保真度的提示詞。
*   [**Thought signatures**](/docs/thinking/#signatures)**：** 加密
    呈現模型內部推理的表示方式。在無狀態模式下進行多輪
    函式呼叫時為必要項目；Interactions API 與官方 SDK 會自動管理。

## 提示詞最佳做法 {#prompting-best-practices}

Gemini 3.x 模型是推理模型，這會改變您撰寫提示詞的方式。

*   **精確的指令**：請保持簡潔。Gemini 3.x 對直接、
    清楚的指令回應最佳。為舊模型設計的冗長或複雜提示詞工程技巧，
    可能導致模型過度分析。
*   **輸出詳盡程度**：Gemini 3 與 3.1 預設較不冗長，
    偏好直接且有效率的回答。如果您的用途需要
    對話式語氣，請在提示詞中明確引導模型（例如，
    「請以親切、健談的助理風格說明這件事」）。
*   **上下文管理**：處理大型資料集（例如整本
    書籍、程式碼集或長影片）時，請將您的具體指令或
    問題放在提示詞末尾、資料上下文之後。請以類似「根據
    前述資訊……」的句子作為問題開頭，以錨定
    模型的推理。

如要進一步瞭解提示詞設計策略，請參閱
[提示詞工程指南](/docs/prompting-strategies/)。

## 限制 {#limitations}

*   Gemini 3.x 不支援圖片分割。若有分割
    工作負載，請繼續使用已關閉思考功能的 Gemini 2.5 Flash，或
    [Gemini Robotics-ER 1.6](/docs/robotics-overview/)。

## 常見問題 {#faq}

1.  **Gemini 3.5 Flash 的知識截止日期為何？** Gemini 3.5 Flash 的
    知識截止日期為 2025 年 1 月。如需較新的資訊，請使用
    [Search Grounding](/docs/google-search/) 工具。
2.  **上下文視窗的限制為何？** Gemini 3.5 Flash 支援 1
    百萬個 token 的輸入上下文視窗，以及最多 65k 個輸出 tokens。
3.  **我原有的 `thinking_budget` 程式碼還能運作嗎？** 可以，`thinking_budget` 目前
    仍受支援以維持向後相容性，但我們建議遷移至
    `thinking_level`，以獲得更可預測的效能。請勿在同一個
    要求中同時使用兩者。
4.  **Gemini 3.5 Flash 是否支援 Batch API？** 支援。詳情請參閱
    [Batch API](/docs/batch-api/) 指南。
5.  **是否支援 Context Caching？** 支援，[Context Caching](/docs/caching/) 已
    支援。
6.  **支援哪些工具？** Gemini 3.5 Flash 支援
    [Google Search](/docs/google-search/)、
    [Grounding with Google Maps](/docs/maps-grounding/)、
    [File Search](/docs/file-search/)、[Code Execution](/docs/code-execution/)、
    [URL Context](/docs/url-context/)，以及標準的
    [Function Calling](/docs/function-calling/)，包括
    [combined tool use](/docs/tool-combination/) 與
    [Computer Use](/docs/computer-use/)。

## 其他模型 {#other-models}

*   [Latest Gemini models](/docs/latest-model/)
*   [Gemini 4 Neon](/docs/whats-new-gemini-4-neon/)
*   [Gemini 4 Hydrogen](/docs/whats-new-gemini-4-hydrogen/)
*   [Gemini 4 Carbon](/docs/whats-new-gemini-4-carbon/)
*   [Gemini 4 Argon](/docs/whats-new-gemini-4-argon/)
*   [Gemini 3.8 Flash](/docs/whats-new-gemini-3.8/)
*   [Gemini 3.6 Flash and 3.5 Flash-Lite](/docs/whats-new-gemini-3.6/)
*   [See all models](/docs/models/)

## 後續步驟 {#whats-next}

*   進一步瞭解提示詞設計策略，請參閱
    [提示詞工程指南](/docs/prompting-strategies/)。
*   開始使用
    [Gemini 3 Cookbook](https://github.com/google-gemini/cookbook)
*   瞭解 [Gemini API 優化與推論](/docs/optimization/)
