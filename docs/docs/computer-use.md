# 電腦操作

電腦操作工具可讓你建構瀏覽器、行動裝置與桌面控制代理，與介面互動並自動執行任務。模型能透過螢幕截圖「看見」電腦畫面，並產生滑鼠點選、鍵盤輸入等具體的 UI 動作來「採取行動」。與函式呼叫類似，你需要自行實作用戶端執行環境，以接收並執行電腦操作動作。

支援的模型清單請參閱[模型版本](/docs/computer-use/#model-versions)。Gemini 4 與 Gemini 3.x 模型支援多項進階功能：

* **多環境支援**：為[瀏覽器、行動裝置與桌面](/docs/computer-use/#supported-environments)環境建構代理。
* **附帶意圖的精簡動作**：每個動作都包含 `intent` 欄位，說明模型在每個步驟背後的推理。
* **可設定的安全政策**：透過內建政策類別與覆寫，微調[安全行為](/docs/computer-use/#safety-policies)。
* **提示詞注入偵測**：可選擇啟用[螢幕截圖掃描](/docs/computer-use/#prompt-injection)，偵測隱藏的對抗性指令。

運用電腦操作，你可以建構能執行以下工作的代理：

* 在網站上自動處理重複的資料輸入或表單填寫。
* 對網頁應用程式與使用者流程進行自動化測試
* 在多個網站間進行研究（例如從電子商務網站蒐集產品資訊、價格與評論，作為購買決策的參考）

以下是一個最小範例，示範如何初始化用戶端，並在瀏覽器環境中啟用 `computer_use` 工具，將提示詞傳送給模型：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Search for 'Gemini API' on Google.",
          tools=[{"type": "computer_use", "environment": "browser"}]
      )

      print(interaction)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const ai = new GoogleGenAI();

      const interaction = await ai.interactions.create({
        model: 'gemini-4-hydrogen',
        input: "Search for 'Gemini API' on Google.",
        tools: [{ type: "computer_use", environment: "browser" }]
      });

      console.log(interaction);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.ComputerUse;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.EnvironmentEnum;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model("gemini-4-hydrogen")
              .input(InteractionsInput.of("Search for 'Gemini API' on Google."))
              .tools(
                  Arrays.asList(
                      ComputerUse.builder().environment(EnvironmentEnum.BROWSER).build()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println(interaction);
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
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Search for 'Gemini API' on Google."),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.ComputerUse{
                          Environment: interactions.EnvironmentEnumBrowser.ToPointer(),
                      }),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(res.Interaction)
      }
      ```


!!! note " "

      電腦操作可能包含錯誤與安全漏洞。我們建議，重要任務務必密切監督，並避免將電腦操作功能用於涉及重大決策、敏感資料，或嚴重錯誤無法挽回的動作。我們鼓勵你詳閱[安全最佳做法](/docs/computer-use/#safety-best-practices)、[禁止使用政策](https://policies.google.com/terms/generative-ai/use-policy)與 [Gemini API 附加服務條款](/docs/terms/)。


## 電腦操作的運作方式 {#how-computer-use}

若要用電腦操作模型建構代理，你需要在應用程式與 API 之間建立一個連續迴圈。以下是你的程式碼在每個步驟要做的事：

1. [**將要求傳送給模型**](/docs/computer-use/#send-request)
   *  你的應用程式會傳送 API 要求，其中包含電腦操作工具、你的設定（例如目標環境）、使用者的提示詞，以及目前畫面的螢幕截圖。

2. [**接收模型回應**](/docs/computer-use/#model-response)
   *  模型會分析畫面與提示詞，回傳一個回應，其中包含建議的 `function_call`，代表一個 UI 動作（例如點選、捲動或按鍵）。
   *    對於 **Gemini 4 與 Gemini 3.x 模型**，回應還包含推理 `intent`，說明模型選擇該動作的原因。
   *  回應也可能包含來自內部安全系統的 `safety_decision`，將動作分類為一般／允許、`require_confirmation`（需要使用者核准）或封鎖。

3. [**執行收到的動作**](/docs/computer-use/#execute-actions)
   *  若動作獲允許（或使用者確認），你的用戶端程式碼會解析 `function_call`，將正規化座標換算為符合你的檢視區的座標，並使用自動化工具（例如 Playwright）在目標環境中執行該動作。若動作被封鎖，你的用戶端應停止執行或處理該中斷。

4. [**擷取新的環境狀態**](/docs/computer-use/#capture-state)
   *  動作執行完畢後，你的應用程式會擷取新的螢幕截圖，並透過 `function_result` 傳回給模型，以要求下一步。


接著，這個流程會從步驟 2 重複進行，持續向模型要求下一個動作，直到任務完成或終止。

![](https://www.gstatic.com/cloud-cms/1360b1ef687451ea91ed7780b9766e90.png)

## 如何實作電腦操作 {#implement-computer-use}

使用電腦操作工具進行建構之前，你需要先備妥：

* **安全的執行環境**：在沙箱化的 VM 或容器中執行代理，將其與主機系統隔離，並限制其潛在影響。[參考實作](https://github.com/google/computer-use-preview/)包含可立即使用的 Docker 沙箱，可作為起點。
* **用戶端動作處理常式**：實作用戶端邏輯，以執行座標、輸入文字並擷取螢幕截圖。

以下範例使用網頁瀏覽器作為執行環境，並以 [Playwright](https://playwright.dev/) 作為用戶端處理常式。

### 0. 設定 Playwright

首先，安裝所需的套件：

```bash
pip install google-genai playwright
playwright install chromium
```

接著，初始化一個 Playwright 瀏覽器執行個體以供執行：

```python
from playwright.sync_api import sync_playwright

# 1. Configure screen dimensions for the target environment
SCREEN_WIDTH = 1440
SCREEN_HEIGHT = 900

# 2. Start the Playwright browser
# In production, utilize a sandboxed environment.
playwright = sync_playwright().start()
# Set headless=False to see the actions performed on your screen
browser = playwright.chromium.launch(headless=False)

# 3. Create a context and page with the specified dimensions
context = browser.new_context(
    viewport={"width": SCREEN_WIDTH, "height": SCREEN_HEIGHT}
)
page = context.new_page()

# 4. Navigate to an initial page to start the task
page.goto("https://www.google.com")

# The 'page', 'SCREEN_WIDTH', and 'SCREEN_HEIGHT' variables
# will be used in the steps below.
```

### 1. 將要求傳送給模型 {#send-request}

初始化用戶端程式庫並設定電腦操作工具。請注意，發出要求時無需指定顯示尺寸；模型會依螢幕的高度與寬度預測像素座標。


=== "Python"

      使用 `google-genai` Python SDK（版本 `2.7.0` 以上），設定以瀏覽器環境為目標的要求：

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model='gemini-4-hydrogen',
          input="Find a flight from SF to Hawaii on Jun 30th, coming back on Jul 6th",
          tools=[
              {
                  "type": "computer_use",
                  "environment": "browser",
                  "enable_prompt_injection_detection": True
              }
          ]
      )

      print(interaction)
      ```

=== "JavaScript"

      使用 `@google/genai` Node.js SDK，設定以瀏覽器環境為目標的要求：

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const ai = new GoogleGenAI();

      const interaction = await ai.interactions.create({
        model: 'gemini-4-hydrogen',
        input: "Find a flight from SF to Hawaii on Jun 30th, coming back on Jul 6th",
        tools: [
          {
            type: "computer_use",
            environment: "browser",
            enable_prompt_injection_detection: true
          }
        ]
      });

      console.log(interaction);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.ComputerUse;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.EnvironmentEnum;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model("gemini-4-hydrogen")
              .input(
                  InteractionsInput.of(
                      "Find a flight from SF to Hawaii on Jun 30th, coming back on Jul 6th"))
              .tools(
                  Arrays.asList(
                      ComputerUse.builder()
                          .environment(EnvironmentEnum.BROWSER)
                          .enablePromptInjectionDetection(true)
                          .build()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println(interaction);
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
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Find a flight from SF to Hawaii on Jun 30th, coming back on Jul 6th"),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.ComputerUse{
                          Environment:                    interactions.EnvironmentEnumBrowser.ToPointer(),
                          EnablePromptInjectionDetection: genai.Ptr(true),
                      }),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(res.Interaction)
      }
      ```

=== "REST"

      使用 curl 傳送要求：

      ```shell
      curl -X POST \
        "https://generativelanguage.googleapis.com/v1/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Find me a flight from SF to Hawaii on Jun 30th, coming back on Jul 6th. Start by navigating directly to flights.google.com",
          "tools": [
            {
              "type": "computer_use",
              "environment": "browser",
              "enable_prompt_injection_detection": true
            }
          ]
        }'
      ```


### 2. 接收模型回應 {#model-response}

模型回應會建議一個函式呼叫，其中包含座標，以及專為該動作說明的推理意圖：

```json
{
  "steps": [
    {
      "type": "function_call",
      "name": "click",
      "arguments": {
        "x": 450,
        "y": 120,
        "intent": "Click the search box to type the destination."
      }
    }
  ]
}
```

### 3. 執行收到的動作 {#execute-actions}

你的應用程式必須解析回應中的座標，將其從正規化的 1000x1000 座標換算，並執行該動作：


=== "Python"

      ```python
      from typing import Any, List, Tuple
      import time

      def denormalize_x(x: int, screen_width: int) -> int:
          """Convert normalized x coordinate (0-1000) to actual pixel coordinate."""
          return int(x / 1000 * screen_width)

      def denormalize_y(y: int, screen_height: int) -> int:
          """Convert normalized y coordinate (0-1000) to actual pixel coordinate."""
          return int(y / 1000 * screen_height)

      def execute_function_calls(interaction, page, screen_width, screen_height):
          results = []
          function_calls = [
              step for step in interaction.steps if step.type == "function_call"
          ]

          for function_call in function_calls:
              action_result = {}
              fname = function_call.name
              args = function_call.arguments
              print(f"  -> Executing: {fname} (Intent: {args.get('intent', 'N/A')})")

              try:
                  if fname == "open_app":
                      pass # Handled / already open
                  elif fname in ("click", "double_click", "triple_click", "middle_click", "right_click", "move", "long_press"):
                      actual_x = denormalize_x(args["x"], screen_width)
                      actual_y = denormalize_y(args["y"], screen_height)

                      if fname == "click":
                          page.mouse.click(actual_x, actual_y)
                      elif fname == "double_click":
                          page.mouse.dblclick(actual_x, actual_y)
                      elif fname == "right_click":
                          page.mouse.click(actual_x, actual_y, button="right")
                      elif fname == "middle_click":
                          page.mouse.click(actual_x, actual_y, button="middle")
                      elif fname == "move":
                          page.mouse.move(actual_x, actual_y)
                  elif fname == "type":
                      actual_x = denormalize_x(args["x"], screen_width) if "x" in args else None
                      actual_y = denormalize_y(args["y"], screen_height) if "y" in args else None
                      text = args["text"]
                      press_enter = args.get("press_enter", False)

                      if actual_x is not None and actual_y is not None:
                          page.mouse.click(actual_x, actual_y)
                      # Clear field first
                      page.keyboard.press("Meta+A")
                      page.keyboard.press("Backspace")
                      page.keyboard.type(text)
                      if press_enter:
                          page.keyboard.press("Enter")
                  elif fname == "navigate":
                      page.goto(args["url"])
                  elif fname == "go_back":
                      page.go_back()
                  elif fname == "go_forward":
                      page.go_forward()
                  elif fname == "wait":
                      time.sleep(args.get("seconds", 1))
                  else:
                      print(f"Warning: Custom or unhandled function {fname}")

                  page.wait_for_load_state(timeout=5000)
                  time.sleep(1)

              except Exception as e:
                  print(f"Error executing {fname}: {e}")
                  action_result = {"error": str(e)}

              results.append((fname, function_call.id, action_result))

          return results
      ```

=== "JavaScript"

      ```javascript
      function denormalizeX(x, screenWidth) {
          // Convert normalized x coordinate (0-1000) to actual pixel coordinate.
          return Math.floor((x / 1000) * screenWidth);
      }

      function denormalizeY(y, screenHeight) {
          // Convert normalized y coordinate (0-1000) to actual pixel coordinate.
          return Math.floor((y / 1000) * screenHeight);
      }

      async function executeFunctionCalls(interaction, page, screenWidth, screenHeight) {
          const results = [];
          const functionCalls = interaction.steps.filter(step => step.type === "function_call");

          for (const functionCall of functionCalls) {
              const actionResult = {};
              const fname = functionCall.name;
              const args = functionCall.arguments;
              console.log(`  -> Executing: ${fname} (Intent: ${args.intent || 'N/A'})`);

              try {
                  if (fname === "open_app") {
                      // Handled / already open
                  } else if (["click", "double_click", "triple_click", "middle_click", "right_click", "move", "long_press"].includes(fname)) {
                      const actualX = denormalizeX(args.x, screenWidth);
                      const actualY = denormalizeY(args.y, screenHeight);

                      if (fname === "click") {
                          await page.mouse.click(actualX, actualY);
                      } else if (fname === "double_click") {
                          await page.mouse.dblclick(actualX, actualY);
                      } else if (fname === "right_click") {
                          await page.mouse.click(actualX, actualY, { button: "right" });
                      } else if (fname === "middle_click") {
                          await page.mouse.click(actualX, actualY, { button: "middle" });
                      } else if (fname === "move") {
                          await page.mouse.move(actualX, actualY);
                      }
                  } else if (fname === "type") {
                      const actualX = args.x !== undefined ? denormalizeX(args.x, screenWidth) : null;
                      const actualY = args.y !== undefined ? denormalizeY(args.y, screenHeight) : null;
                      const text = args.text;
                      const pressEnter = args.press_enter || false;

                      if (actualX !== null && actualY !== null) {
                          await page.mouse.click(actualX, actualY);
                      }
                      // Clear field first
                      await page.keyboard.press("Meta+A");
                      await page.keyboard.press("Backspace");
                      await page.keyboard.type(text);
                      if (pressEnter) {
                          await page.keyboard.press("Enter");
                      }
                  } else if (fname === "navigate") {
                      await page.goto(args.url);
                  } else if (fname === "go_back") {
                      await page.goBack();
                  } else if (fname === "go_forward") {
                      await page.goForward();
                  } else if (fname === "wait") {
                      await new Promise(resolve => setTimeout(resolve, (args.seconds || 1) * 1000));
                  } else {
                      console.log(`Warning: Custom or unhandled function ${fname}`);
                  }

                  await page.waitForLoadState('load', { timeout: 5000 }).catch(() => {});
                  await new Promise(resolve => setTimeout(resolve, 1000));
              } catch (e) {
                  console.log(`Error executing ${fname}: ${e}`);
                  actionResult.error = e.message;
              }

              results.push([fname, functionCall.id, actionResult]);
          }

          return results;
      }
      ```

=== "Java"

      ```java
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.Step;
      import java.util.ArrayList;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.List;
      import java.util.Map;

      class ActionExecutor {
        int denormalizeX(int x, int screenWidth) {
          return (int) (x / 1000.0 * screenWidth);
        }

        int denormalizeY(int y, int screenHeight) {
          return (int) (y / 1000.0 * screenHeight);
        }

        List<Map<String, Object>> executeFunctionCalls(
            Interaction interaction, int screenWidth, int screenHeight) {
          List<Map<String, Object>> results = new ArrayList<>();

          for (Step step : interaction.steps().orElse(Collections.emptyList())) {
            if (step instanceof FunctionCallStep) {
              FunctionCallStep functionCall = (FunctionCallStep) step;
              String fname = functionCall.name().orElse("");
              Map<String, Object> args = functionCall.arguments().orElse(Collections.emptyMap());
              Map<String, Object> actionResult = new HashMap<>();

              System.out.println(
                  "  -> Executing: " + fname + " (Intent: " + args.getOrDefault("intent", "N/A") + ")");

              try {
                if (fname.equals("click")) {
                  int actualX = denormalizeX(((Number) args.get("x")).intValue(), screenWidth);
                  int actualY = denormalizeY(((Number) args.get("y")).intValue(), screenHeight);
                  // Perform mouse click at (actualX, actualY) using your browser automation library
                } else if (fname.equals("type")) {
                  String text = (String) args.get("text");
                  // Type text into active element using your browser automation library
                } else if (fname.equals("navigate")) {
                  String url = (String) args.get("url");
                  // Navigate browser to url
                }
              } catch (Exception e) {
                actionResult.put("error", e.getMessage());
              }

              Map<String, Object> entry = new HashMap<>();
              entry.put("name", fname);
              entry.put("callId", functionCall.id().orElse(""));
              entry.put("result", actionResult);
              results.add(entry);
            }
          }
          return results;
        }
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "fmt"

          "google.golang.org/genai/interactions/models/interactions"
      )

      func denormalizeX(x, screenWidth int) int {
          return int(float64(x) / 1000.0 * float64(screenWidth))
      }

      func denormalizeY(y, screenHeight int) int {
          return int(float64(y) / 1000.0 * float64(screenHeight))
      }

      func executeFunctionCalls(interaction *interactions.Interaction, screenWidth, screenHeight int) []map[string]any {
          var results []map[string]any

          for _, step := range interaction.Steps {
              if functionCall := step.FunctionCallStep; functionCall != nil {
                  fname := functionCall.Name
                  args := functionCall.Arguments
                  actionResult := map[string]any{}

                  intent := args["intent"]
                  if intent == nil {
                      intent = "N/A"
                  }
                  fmt.Printf("  -> Executing: %s (Intent: %v)\n", fname, intent)

                  switch fname {
                  case "click":
                      xVal, _ := args["x"].(float64)
                      yVal, _ := args["y"].(float64)
                      actualX := denormalizeX(int(xVal), screenWidth)
                      actualY := denormalizeY(int(yVal), screenHeight)
                      _ = actualX
                      _ = actualY
                      // Perform mouse click at (actualX, actualY) using your browser automation library
                  case "type":
                      text, _ := args["text"].(string)
                      _ = text
                      // Type text into active element using your browser automation library
                  case "navigate":
                      url, _ := args["url"].(string)
                      _ = url
                      // Navigate browser to url
                  }

                  results = append(results, map[string]any{
                      "name":   fname,
                      "callId": functionCall.ID,
                      "result": actionResult,
                  })
              }
          }
          return results
      }

      func main() {
          // Example helper usage with an Interaction response
      }
      ```


### 4. 擷取新的環境狀態 {#capture-state}

執行動作後，將函式執行的結果傳回給模型，讓模型運用這些資訊產生下一個動作。若執行了多個動作（平行呼叫），你必須在下一個使用者回合中，為每個動作各傳送一個 `function_result`。


=== "Python"

      ```python
      import json
      import base64

      def get_function_responses(page, results):
          screenshot_bytes = page.screenshot(type="png")
          current_url = page.url
          function_responses = []
          for name, call_id, result in results:
              function_responses.append({
                  "type": "function_result",
                  "name": name,
                  "call_id": call_id,
                  "result": [
                      {
                          "type": "text",
                          "text": json.dumps({"url": current_url, **result})
                      },
                      {
                          "type": "image",
                          "data": base64.b64encode(screenshot_bytes).decode("utf-8"),
                          "mime_type": "image/png"
                      }
                  ]
              })
          return function_responses
      ```

=== "JavaScript"

      ```javascript
      async function getFunctionResponses(page, results) {
          const screenshotBuffer = await page.screenshot({ type: 'png' });
          const screenshotBase64 = screenshotBuffer.toString('base64');
          const currentUrl = page.url();
          const functionResponses = [];

          for (const [name, callId, result] of results) {
              functionResponses.push({
                  type: "function_result",
                  name: name,
                  call_id: callId,
                  result: [
                      {
                          type: "text",
                          text: JSON.stringify({ url: currentUrl, ...result })
                      },
                      {
                          type: "image",
                          data: screenshotBase64,
                          mime_type: "image/png"
                      }
                  ]
              });
          }
          return functionResponses;
      }
      ```

      定義好如何擷取環境狀態並加以格式化後，你就能將這些步驟組合成一個連續的執行迴圈。

=== "Java"

      ```java
      import com.google.genai.gaos.models.interactions.FunctionResultStep;
      import com.google.genai.gaos.models.interactions.FunctionResultStepResultUnion;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import java.util.ArrayList;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;
      import java.util.Map;

      class StateCapturer {
        List<Step> getFunctionResponses(
            byte[] screenshotBytes, String currentUrl, List<Map<String, Object>> results) {
          List<Step> functionResponses = new ArrayList<>();
          String base64Screenshot = Base64.getEncoder().encodeToString(screenshotBytes);

          for (Map<String, Object> entry : results) {
            String name = (String) entry.get("name");
            String callId = (String) entry.get("callId");
            String jsonResult = String.format("{\"url\": \"%s\"}", currentUrl);

            FunctionResultStep responseStep =
                FunctionResultStep.builder()
                    .name(name)
                    .callId(callId)
                    .result(
                        FunctionResultStepResultUnion.of(
                            Arrays.asList(
                                TextContent.builder().text(jsonResult).build(),
                                ImageContent.builder()
                                    .data(base64Screenshot)
                                    .mimeType(ImageContentMimeType.IMAGE_PNG)
                                    .build())))
                    .build();
            functionResponses.add(responseStep);
          }
          return functionResponses;
        }
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "encoding/base64"
          "fmt"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
      )

      func getFunctionResponses(screenshotBytes []byte, currentURL string, results []map[string]any) []interactions.Step {
          var functionResponses []interactions.Step
          base64Screenshot := base64.StdEncoding.EncodeToString(screenshotBytes)

          for _, entry := range results {
              name, _ := entry["name"].(string)
              callID, _ := entry["callId"].(string)
              jsonResult := fmt.Sprintf(`{"url": "%s"}`, currentURL)

              responseStep := interactions.NewStep(interactions.FunctionResultStep{
                  Name:   genai.Ptr(name),
                  CallID: callID,
                  Result: interactions.NewFunctionResultStepResultUnion([]interactions.FunctionResultSubcontent{
                      interactions.NewFunctionResultSubcontent(interactions.TextContent{
                          Text: jsonResult,
                      }),
                      interactions.NewFunctionResultSubcontent(interactions.ImageContent{
                          Data:     genai.Ptr(base64Screenshot),
                          MimeType: interactions.ImageContentMimeType("image/png").ToPointer(),
                      }),
                  }),
              })
              functionResponses = append(functionResponses, responseStep)
          }
          return functionResponses
      }

      func main() {
          // Example helper usage to build FunctionResultStep responses
      }
      ```


## 建構代理迴圈 {#agent-loop}

若要支援多步驟互動，請將[如何實作電腦操作](/docs/computer-use/#implement-computer-use)一節的四個步驟組合成單一迴圈。這個迴圈會持續向模型要求動作，並將結果回傳給模型，直到任務完成。

請記得正確管理對話記錄：在每個步驟中，將模型回應與你的函式回應都附加到記錄中。


=== "Python"

      ```python
      import time
      from typing import Any, List, Tuple
      from playwright.sync_api import sync_playwright

      from google import genai

      client = genai.Client()

      # Constants for screen dimensions
      SCREEN_WIDTH = 1440
      SCREEN_HEIGHT = 900

      # Setup Playwright
      print("Initializing browser...")
      playwright = sync_playwright().start()
      browser = playwright.chromium.launch(headless=False)
      context = browser.new_context(viewport={"width": SCREEN_WIDTH, "height": SCREEN_HEIGHT})
      page = context.new_page()

      # Define helper functions. Copy/paste from steps 3 and 4
      # def denormalize_x(...)
      # def denormalize_y(...)
      # def execute_function_calls(...)
      # def get_function_responses(...)

      try:
          # Go to initial page
          page.goto("https://aistudio.google.com/docs")

          # Take initial screenshot
          initial_screenshot = page.screenshot(type="png")
          USER_PROMPT = "Go to aistudio.google.com/docs and search for pricing."
          print(f"Goal: {USER_PROMPT}")

          # First interaction
          interaction = client.interactions.create(
              model='gemini-4-hydrogen',
              input=[
                  {"type": "text", "text": USER_PROMPT},
                  {"type": "image", "data": base64.b64encode(initial_screenshot).decode("utf-8"), "mime_type": "image/png"}
              ],
              tools=[{
                  "type": "computer_use",
                  "environment": "browser",
                  "enable_prompt_injection_detection": True
              }]
          )

          # Agent Loop
          turn_limit = 5
          for i in range(turn_limit):
              print(f"\n--- Turn {i+1} ---")

              has_function_calls = any(
                  step.type == "function_call"
                  for step in interaction.steps
              )
              if not has_function_calls:
                  text_response = " ".join([
                      content_block.text for step in interaction.steps if step.type == "model_output"
                      for content_block in step.content if content_block.type == "text"
                  ])
                  print("Agent finished:", text_response)
                  break

              print("Executing actions...")
              results = execute_function_calls(interaction, page, SCREEN_WIDTH, SCREEN_HEIGHT)

              print("Capturing state...")
              function_responses = get_function_responses(page, results)

              # Continue conversation with function responses
              interaction = client.interactions.create(
                  model='gemini-4-hydrogen',
                  previous_interaction_id=interaction.id,
                  input=function_responses,
                  tools=[{
                      "type": "computer_use",
                      "environment": "browser",
                      "enable_prompt_injection_detection": True
                  }]
              )

      finally:
          # Cleanup
          print("\nClosing browser...")
          browser.close()
          playwright.stop()
      ```

=== "JavaScript"

      ```javascript
      import { chromium } from 'playwright';
      import { GoogleGenAI } from '@google/genai';

      const ai = new GoogleGenAI();

      // Constants for screen dimensions
      const SCREEN_WIDTH = 1440;
      const SCREEN_HEIGHT = 900;

      console.log("Initializing browser...");
      const browser = await chromium.launch({ headless: false });
      const context = await browser.newContext({
          viewport: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }
      });
      const page = await context.newPage();

      // Define helper functions. Copy/paste from steps 3 and 4:
      // function denormalizeX(...)
      // function denormalizeY(...)
      // async function executeFunctionCalls(...)
      // async function getFunctionResponses(...)

      try {
          // Go to initial page
          await page.goto("https://aistudio.google.com/docs");

          // Take initial screenshot
          const initialScreenshotBuffer = await page.screenshot({ type: 'png' });
          const initialScreenshotBase64 = initialScreenshotBuffer.toString('base64');
          const USER_PROMPT = "Go to aistudio.google.com/docs and search for pricing.";
          console.log(`Goal: ${USER_PROMPT}`);

          // First interaction
          let interaction = await ai.interactions.create({
              model: 'gemini-4-hydrogen',
              input: [
                  { type: 'text', text: USER_PROMPT },
                  { type: 'image', data: initialScreenshotBase64, mime_type: 'image/png' }
              ],
              tools: [{
                  type: 'computer_use',
                  environment: 'browser',
                  enable_prompt_injection_detection: true
              }]
          });

          // Agent Loop
          const turnLimit = 5;
          for (let i = 0; i < turnLimit; i++) {
              console.log(`\n--- Turn ${i + 1} ---`);

              const hasFunctionCalls = (interaction.steps || []).some(step => step.type === "function_call");
              if (!hasFunctionCalls) {
                  const textResponses = [];
                  for (const step of interaction.steps || []) {
                      if (step.type === "model_output") {
                          for (const contentBlock of step.content || []) {
                              if (contentBlock.type === "text") {
                                  textResponses.push(contentBlock.text);
                              }
                          }
                      }
                  }
                  console.log("Agent finished:", textResponses.join(" "));
                  break;
              }

              console.log("Executing actions...");
              const results = await executeFunctionCalls(interaction, page, SCREEN_WIDTH, SCREEN_HEIGHT);

              console.log("Capturing state...");
              const functionResponses = await getFunctionResponses(page, results);

              // Continue conversation with function responses
              interaction = await ai.interactions.create({
                  model: 'gemini-4-hydrogen',
                  previous_interaction_id: interaction.id,
                  input: functionResponses,
                  tools: [{
                      type: 'computer_use',
                      environment: 'browser',
                      enable_prompt_injection_detection: true
                  }]
              });
          }
      } finally {
          // Cleanup
          console.log("\nClosing browser...");
          await browser.close();
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.ComputerUse;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.EnvironmentEnum;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.ArrayList;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.Collections;
      import java.util.List;

      Client client = new Client();

      // Constants for screen dimensions
      int screenWidth = 1440;
      int screenHeight = 900;

      // Capture initial screenshot from browser driver (e.g. Playwright)
      byte[] initialScreenshot = new byte[0];
      String base64Screenshot = Base64.getEncoder().encodeToString(initialScreenshot);
      String userPrompt = "Go to aistudio.google.com/docs and search for pricing.";
      System.out.println("Goal: " + userPrompt);

      ComputerUse computerUseTool =
          ComputerUse.builder()
              .environment(EnvironmentEnum.BROWSER)
              .enablePromptInjectionDetection(true)
              .build();

      CreateModelInteraction initialParams =
          CreateModelInteraction.builder()
              .model("gemini-4-hydrogen")
              .input(
                  InteractionsInput.ofContent(
                      Arrays.asList(
                          TextContent.builder().text(userPrompt).build(),
                          ImageContent.builder()
                              .data(base64Screenshot)
                              .mimeType(ImageContentMimeType.IMAGE_PNG)
                              .build())))
              .tools(Arrays.asList(computerUseTool))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(initialParams)).interaction().get();

      int turnLimit = 5;
      for (int i = 0; i < turnLimit; i++) {
        System.out.println("\n--- Turn " + (i + 1) + " ---");

        boolean hasFunctionCalls =
            interaction.steps().orElse(Collections.emptyList()).stream()
                .anyMatch(step -> step instanceof FunctionCallStep);

        if (!hasFunctionCalls) {
          StringBuilder textResponse = new StringBuilder();
          for (Step step : interaction.steps().orElse(Collections.emptyList())) {
            if (step instanceof ModelOutputStep) {
              for (Content contentBlock :
                  ((ModelOutputStep) step).content().orElse(Collections.emptyList())) {
                if (contentBlock instanceof TextContent) {
                  textResponse.append(((TextContent) contentBlock).text().orElse("")).append(" ");
                }
              }
            }
          }
          System.out.println("Agent finished: " + textResponse.toString().trim());
          break;
        }

        System.out.println("Executing actions and capturing state...");
        // Execute function calls against browser driver and capture List<Step> functionResponses
        List<Step> functionResponses = new ArrayList<>();

        CreateModelInteraction nextParams =
            CreateModelInteraction.builder()
                .model("gemini-4-hydrogen")
                .previousInteractionId(interaction.id().get())
                .input(InteractionsInput.ofStep(functionResponses))
                .tools(Arrays.asList(computerUseTool))
                .build();

        interaction =
            client.interactions.create(CreateInteractionRequestBody.of(nextParams)).interaction().get();
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "encoding/base64"
          "fmt"
          "log"
          "strings"

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

          // Constants for screen dimensions
          screenWidth := 1440
          screenHeight := 900
          _ = screenWidth
          _ = screenHeight

          // Capture initial screenshot from browser driver (e.g. Playwright)
          initialScreenshot := []byte{}
          base64Screenshot := base64.StdEncoding.EncodeToString(initialScreenshot)
          userPrompt := "Go to aistudio.google.com/docs and search for pricing."
          fmt.Println("Goal:", userPrompt)

          computerUseTool := interactions.NewTool(interactions.ComputerUse{
              Environment:                    interactions.EnvironmentEnumBrowser.ToPointer(),
              EnablePromptInjectionDetection: genai.Ptr(true),
          })

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{Text: userPrompt}),
                      interactions.NewContent(interactions.ImageContent{
                          Data:     genai.Ptr(base64Screenshot),
                          MimeType: interactions.ImageContentMimeType("image/png").ToPointer(),
                      }),
                  }),
                  Tools: []interactions.Tool{computerUseTool},
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          interaction := res.Interaction

          turnLimit := 5
          for i := 0; i < turnLimit; i++ {
              fmt.Printf("\n--- Turn %d ---\n", i+1)

              hasFunctionCalls := false
              for _, step := range interaction.Steps {
                  if step.FunctionCallStep != nil {
                      hasFunctionCalls = true
                      break
                  }
              }

              if !hasFunctionCalls {
                  var parts []string
                  for _, step := range interaction.Steps {
                      if outStep := step.ModelOutputStep; outStep != nil {
                          for _, contentBlock := range outStep.Content {
                              if textContent := contentBlock.TextContent; textContent != nil {
                                  parts = append(parts, textContent.GetText())
                              }
                          }
                      }
                  }
                  fmt.Println("Agent finished:", strings.TrimSpace(strings.Join(parts, " ")))
                  break
              }

              fmt.Println("Executing actions and capturing state...")
              // Execute function calls against browser driver and capture []interactions.Step functionResponses
              var functionResponses []interactions.Step

              nextRes, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                  Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                      Model:                 interactions.Model("gemini-4-hydrogen"),
                      PreviousInteractionID: interaction.ID,
                      Input:                 interactions.NewInteractionsInput(functionResponses),
                      Tools:                 []interactions.Tool{computerUseTool},
                  }),
              })
              if err != nil {
                  log.Fatal(err)
              }
              interaction = nextRes.Interaction
          }
      }
      ```


## 支援的環境 {#supported-environments}

Gemini 4 與 Gemini 3.x 模型支援在 `computer_use` 設定中指定的三種環境：

### 瀏覽器環境（`ENVIRONMENT_BROWSER`）

瀏覽器工具可用的動作：

| 指令名稱 | 說明 | 參數（函式呼叫中） |
| :--- | :--- | :--- |
| **click** | 在指定座標按下滑鼠左鍵。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **double_click** | 在指定座標連按兩下。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **triple_click** | 在指定座標連按三下。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **middle_click** | 在指定座標按下中鍵。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **right_click** | 在指定座標按下滑鼠右鍵。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **mouse_down** | 在指定座標按住滑鼠按鈕不放。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **mouse_up** | 在指定座標放開滑鼠按鈕。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **move** | 將游標移到指定位置。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **type** | 輸入文字。 | `text`: str`press_enter`: bool (Optional, default `false`)`intent`: str |
| **drag_and_drop** | 將項目從起始座標拖曳到結束座標。 | `start_y`: int (0-999)`start_x`: int (0-999)`end_y`: int (0-999)`end_x`: int (0-999)`intent`: str |
| **wait** | 暫停執行指定的秒數。 | `seconds`: int (Optional, default `1`)`intent`: str |
| **press_key** | 按下指定按鍵後放開。 | `key`: str`intent`: str |
| **key_down** | 按住指定按鍵不放。 | `key`: str`intent`: str |
| **key_up** | 放開指定按鍵。 | `key`: str`intent`: str |
| **hotkey** | 按下指定的按鍵組合。 | `keys`: `List[str]``intent`: `str` |
| **take_screenshot** | 回傳目前畫面的螢幕截圖。 | `intent`: str |
| **scroll** | 在指定座標以像素距離向上、下、左或右捲動。 | `y`: int (0-999)`x`: int (0-999)`direction`: str (`"up"`, `"down"`, `"left"`, `"right"`)`magnitude_in_pixels`: int (0-999, Optional, default `300`)`intent`: str |
| **go_back** | 回到瀏覽器歷史紀錄中的上一個網頁。 | `intent`: str |
| **navigate** | 直接前往指定的 URL。 | `url`: str`intent`: str |
| **go_forward** | 前往瀏覽器歷史紀錄中的下一個網頁。 | `intent`: str |

### 行動環境（`ENVIRONMENT_MOBILE`） {#mobile-environment}

針對 Android 最佳化的環境動作：

| 指令名稱 | 說明 | 參數（函式呼叫中） |
| :--- | :--- | :--- |
| **open_app** | 依名稱開啟應用程式。 | `app_name`: str`intent`: str |
| **click** | 在指定座標按下滑鼠左鍵。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **list_apps** | 列出裝置上可用的應用程式，並回傳其名稱與套件名稱。 | `intent`: str |
| **wait** | 暫停執行指定的秒數。 | `seconds`: int (Optional, default `1`)`intent`: str |
| **go_back** | 回到上一個畫面或網頁。 | `intent`: str |
| **type** | 輸入文字。 | `text`: str`press_enter`: bool (Optional, default `false`)`intent`: str |
| **drag_and_drop** | 將項目從起始座標拖曳到結束座標。 | `start_y`: int (0-999)`start_x`: int (0-999)`end_y`: int (0-999)`end_x`: int (0-999)`intent`: str |
| **long_press** | 在畫面上的指定座標長按。 | `y`: int (0-999)`x`: int (0-999)`seconds`: int (Optional, default `2`)`intent`: str |
| **press_key** | 按下指定按鍵後放開。 | `key`: str`intent`: str |
| **take_screenshot** | 回傳目前畫面的螢幕截圖。 | `intent`: str |

### 桌面環境（`ENVIRONMENT_DESKTOP`） {#desktop-environment}

桌面環境的作業系統層級游標指令：

| 指令名稱 | 說明 | 參數（函式呼叫中） |
| :--- | :--- | :--- |
| **click** | 在指定座標按下滑鼠左鍵。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **double_click** | 在指定座標連按兩下。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **triple_click** | 在指定座標連按三下。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **middle_click** | 在指定座標按下中鍵。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **right_click** | 在指定座標按下滑鼠右鍵。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **mouse_down** | 在指定座標按住滑鼠按鈕不放。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **mouse_up** | 在指定座標放開滑鼠按鈕。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **move** | 將游標移到指定位置。 | `y`: int (0-999)`x`: int (0-999)`intent`: str |
| **type** | 輸入文字。 | `text`: str`press_enter`: bool (Optional, default `false`)`intent`: str |
| **drag_and_drop** | 將項目從起始座標拖曳到結束座標。 | `start_y`: int (0-999)`start_x`: int (0-999)`end_y`: int (0-999)`end_x`: int (0-999)`intent`: str |
| **wait** | 暫停執行指定的秒數。 | `seconds`: int (Optional, default `1`)`intent`: str |
| **press_key** | 按下指定按鍵後放開。 | `key`: str`intent`: str |
| **key_down** | 按住指定按鍵不放。 | `key`: str`intent`: str |
| **key_up** | 放開指定按鍵。 | `key`: str`intent`: str |
| **hotkey** | 按下指定的按鍵組合。 | `keys`: `List[str]``intent`: `str` |
| **take_screenshot** | 回傳目前畫面的螢幕截圖。 | `intent`: str |
| **scroll** | 在指定座標以像素距離向上、下、左或右捲動。 | `y`: int (0-999)`x`: int (0-999)`direction`: str (`"up"`, `"down"`, `"left"`, `"right"`)`magnitude_in_pixels`: int (0-999, Optional, default `300`)`intent`: str |

## 自訂的使用者定義函式 {#custom-functions}

你可以加入自訂的使用者定義函式，擴充模型的功能。例如，在人類參與（HITL）的情境中，你可以排除預設的預定義動作，並註冊自訂動作。


=== "Python"

      排除標準的預定義瀏覽器動作（例如 `click`），並註冊自訂的 `yield_to_user` 工具：

      ```python
      from google import genai

      client = genai.Client()

      yield_to_user_tool = {
          "type": "function",
          "name": "yield_to_user",
          "description": "Yields control back to the user for assistance or verification when an automated action is unsafe or ambiguous.",
          "parameters": {
              "type": "object",
              "properties": {
                  "reason": {
                      "type": "string",
                      "description": "The reason why the agent is yielding control to the human."
                  }
              },
              "required": ["reason"]
          }
      }

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Click the submit button. If you need a second factor authentication code, ask me.",
          tools=[
              {
                  "type": "computer_use",
                  "environment": "mobile",
                  "excluded_predefined_functions": ["click"]
              },
              yield_to_user_tool
          ]
      )
      ```

=== "JavaScript"

      排除標準的預定義瀏覽器動作（例如 `click`），並註冊自訂的 `yield_to_user` 工具：

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const ai = new GoogleGenAI();

      const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Click the submit button. If you need a second factor authentication code, ask me.",
          tools: [
              {
                  type: "computer_use",
                  environment: "mobile",
                  excluded_predefined_functions: ["click"]
              },
              {
                  type: "function",
                  name: "yield_to_user",
                  description: "Yields control back to the user for assistance or verification when an automated action is unsafe or ambiguous.",
                  parameters: {
                      type: "object",
                      properties: {
                          reason: {
                              type: "string",
                              description: "The reason why the agent is yielding control to the human."
                          }
                      },
                      required: ["reason"]
                  }
              }
          ]
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.ComputerUse;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.EnvironmentEnum;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> reasonProp = new HashMap<>();
      reasonProp.put("type", "string");
      reasonProp.put("description", "The reason why the agent is yielding control to the human.");

      Map<String, Object> properties = new HashMap<>();
      properties.put("reason", reasonProp);

      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");
      parameters.put("properties", properties);
      parameters.put("required", Collections.singletonList("reason"));

      Function yieldToUserTool =
          Function.builder()
              .name("yield_to_user")
              .description(
                  "Yields control back to the user for assistance or verification when an automated action is unsafe or ambiguous.")
              .parameters(parameters)
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model("gemini-4-hydrogen")
              .input(
                  InteractionsInput.of(
                      "Click the submit button. If you need a second factor authentication code, ask me."))
              .tools(
                  Arrays.asList(
                      ComputerUse.builder()
                          .environment(EnvironmentEnum.MOBILE)
                          .excludedPredefinedFunctions(Arrays.asList("click"))
                          .build(),
                      yieldToUserTool))
              .build();

      Interaction interaction =
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

          yieldToUserTool := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("yield_to_user"),
              Description: genai.Ptr("Yields control back to the user for assistance or verification when an automated action is unsafe or ambiguous."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "reason": map[string]any{
                          "type":        "string",
                          "description": "The reason why the agent is yielding control to the human.",
                      },
                  },
                  "required": []string{"reason"},
              },
          })

          _, err = client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Click the submit button. If you need a second factor authentication code, ask me."),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.ComputerUse{
                          Environment:                 interactions.EnvironmentEnumMobile.ToPointer(),
                          ExcludedPredefinedFunctions: []string{"click"},
                      }),
                      yieldToUserTool,
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```


## 管理思考層級 {#thinking-levels}

對於電腦操作代理，你可以設定不同的思考層級，在動作品質與執行速度之間取得平衡。較低的思考層級通常就能為標準自動化任務帶來良好的平衡。

## 安全與資安 {#safety-security}

### 設定安全政策 {#safety-policies}

Gemini 4 與 Gemini 3.x 模型內建安全服務類別，可協助判斷是否需要使用者確認。

| 安全政策類別 | 說明 |
| :--- | :--- |
| `FINANCIAL_TRANSACTIONS` | 封鎖涉及付款、零售結帳或受管制商品的動作，或觸發確認流程。 |
| `SENSITIVE_DATA_MODIFICATION` | 保護健康、財務或政府紀錄，避免未經授權的修改。 |
| `COMMUNICATION_TOOL` | 限制代理自主傳送電子郵件、聊天訊息或草稿。 |
| `ACCOUNT_CREATION` | 限制代理在網站上自主註冊新帳號。 |
| `DATA_MODIFICATION` | 管控整體檔案系統修改、資料共用與儲存空間刪除。 |
| `USER_CONSENT_MANAGEMENT` | Cookie 同意橫幅與隱私提示需由使用者接手處理。 |
| `LEGAL_TERMS_AND_AGREEMENTS` | 防止模型自主接受服務條款或具法律約束力的合約。 |

#### 安全覆寫

你可以傳入覆寫設定，覆寫特定政策：


!!! note " "

      安全覆寫代表你的偏好，但在某些情況下，模型仍可能回傳 `safety_decision`，其中帶有 `require_confirmation`。無論是否設定覆寫，你的應用程式都應一律實作安全決策的處理邏輯。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Clean up the local folder by archiving old logs.",
          tools=[
              {
                  "type": "computer_use",
                  "environment": "desktop",
                  "disabled_safety_policies": [
                      "data_modification"
                  ]
              }
          ]
      )
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const ai = new GoogleGenAI();

      const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Clean up the local folder by archiving old logs.",
          tools: [
              {
                  type: "computer_use",
                  environment: "desktop",
                  disabled_safety_policies: [
                      "data_modification"
                  ]
              }
          ]
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.ComputerUse;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.DisabledSafetyPolicy;
      import com.google.genai.gaos.models.interactions.EnvironmentEnum;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model("gemini-4-hydrogen")
              .input(InteractionsInput.of("Clean up the local folder by archiving old logs."))
              .tools(
                  Arrays.asList(
                      ComputerUse.builder()
                          .environment(EnvironmentEnum.DESKTOP)
                          .disabledSafetyPolicies(
                              Arrays.asList(DisabledSafetyPolicy.DATA_MODIFICATION))
                          .build()))
              .build();

      Interaction interaction =
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

          _, err = client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Clean up the local folder by archiving old logs."),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.ComputerUse{
                          Environment: interactions.EnvironmentEnumDesktop.ToPointer(),
                          DisabledSafetyPolicies: []interactions.DisabledSafetyPolicy{
                              interactions.DisabledSafetyPolicyDataModification,
                          },
                      }),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```


### 提示詞注入偵測 {#prompt-injection}

Gemini 3.5 Flash-Lite 以上版本的電腦操作支援進階安全機制，可偵測提示詞注入攻擊。啟用後，這項功能會檢查隨附的螢幕截圖是否含有隱藏的對抗性指令（例如「Ignore previous commands」），偵測到時即封鎖執行。

提示詞注入偵測為選擇性啟用的功能，預設值為 `false`。

以下範例示範如何在電腦操作工具設定中啟用提示詞注入偵測：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Search for flight deals and summarize top results.",
          tools=[
              {
                  "type": "computer_use",
                  "environment": "desktop",
                  "enable_prompt_injection_detection": True,
              }
          ],
      )
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const ai = new GoogleGenAI();

      const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Search for flight deals and summarize top results.",
          tools: [
              {
                  type: "computer_use",
                  environment: "desktop",
                  enable_prompt_injection_detection: true,
              }
          ]
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.ComputerUse;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.EnvironmentEnum;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model("gemini-4-hydrogen")
              .input(InteractionsInput.of("Search for flight deals and summarize top results."))
              .tools(
                  Arrays.asList(
                      ComputerUse.builder()
                          .environment(EnvironmentEnum.DESKTOP)
                          .enablePromptInjectionDetection(true)
                          .build()))
              .build();

      Interaction interaction =
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

          _, err = client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Search for flight deals and summarize top results."),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.ComputerUse{
                          Environment:                    interactions.EnvironmentEnumDesktop.ToPointer(),
                          EnablePromptInjectionDetection: genai.Ptr(true),
                      }),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "cURL"

      ```bash
      curl "https://generativelanguage.googleapis.com/v1/interactions?key=${GEMINI_API_KEY}" \
      -H 'Content-Type: application/json' \
      -d '{
        "model": "gemini-4-hydrogen",
        "input": "Search for flight deals and summarize top results.",
        "tools": [
          {
            "type": "computer_use",
            "environment": "desktop",
            "enable_prompt_injection_detection": true
          }
        ]
      }'
      ```


### 確認安全決策 {#safety-decisions}

回應的函式呼叫參數中可能包含 `safety_decision` 參數：

```json
{
  "steps": [
    {
      "type": "function_call",
      "name": "click",
      "arguments": {
        "x": 60,
        "y": 100,
        "safety_decision": {
          "explanation": "Must check check-box",
          "decision": "require_confirmation"
        }
      }
    }
  ]
}
```

若 `safety_decision` 為 `require_confirmation`，請提示最終使用者。若使用者確認，請將 `safety_acknowledgement` 設定於 `function_result` 中。


=== "Python"

      ```python
      def get_safety_confirmation(safety_decision):
          # Prompt user for confirmation
          print(f"Safety confirmation required: {safety_decision.get('explanation', '')}")
          return "CONTINUE" # Or TERMINATE

      # Inside execute_function_calls, check for safety_decision:
      if 'safety_decision' in function_call.arguments:
          decision = get_safety_confirmation(function_call.arguments['safety_decision'])
          if decision == "TERMINATE":
              break
          # Include safety_acknowledgement inside the action result
          action_result["safety_acknowledgement"] = True
      ```


### 安全最佳做法 {#safety-best-practices}

電腦操作帶來獨特的安全與營運風險，因為代表使用者行事的模型可能在畫面上遇到不受信任的內容，或在執行動作時出錯。請落實以下最佳做法，保護使用者資料與系統：

1. **人類參與（HITL）**：
   *  **強制使用者確認**：當安全回應顯示 `require_confirmation` 時，提示使用者核准。
   *  **提供自訂安全指令**：實作自訂系統指令，定義並落實你自己的安全界限。例如：


=== "Python"

      ```python
                  from google import genai

                  client = genai.Client()

                  system_instruction = """
                  ## **RULE 1: Seek User Confirmation (USER_CONFIRMATION)**

                  This is your first and most important check. If the next required action falls
                  into any of the following categories, you MUST stop immediately, and seek the
                  user's explicit permission.

                  **Procedure for Seeking Confirmation:**
                  * **For Consequential Actions:** Perform all preparatory steps (e.g., navigating,
                    filling out forms, typing a message). You will ask for confirmation **AFTER**
                    all necessary information is entered on the screen, but **BEFORE** you perform
                    the final, irreversible action (e.g., before clicking "Send", "Submit",
                    "Confirm Purchase", "Share").
                  * **For Prohibited Actions:** If the action is strictly forbidden (e.g., accepting
                    legal terms, solving a CAPTCHA), you must first inform the user about the
                    required action and ask for their confirmation to proceed.

                  **USER_CONFIRMATION Categories:**

                  *   **Consent and Agreements:** You are FORBIDDEN from accepting, selecting, or
                      agreeing to any of the following on the user's behalf. You must ask the
                      user to confirm before performing these actions.
                      *   Terms of Service
                      *   Privacy Policies
                      *   Cookie consent banners
                      *   End User License Agreements (EULAs)
                      *   Any other legally significant contracts or agreements.
                  *   **Robot Detection:** You MUST NEVER attempt to solve or bypass the
                      following. You must ask the user to confirm before performing these actions.
                      *   CAPTCHAs (of any kind)
                      *   Any other anti-robot or human-verification mechanisms, even if you are
                          capable.
                  *   **Financial Transactions:**
                      *   Completing any purchase.
                      *   Managing or moving money (e.g., transfers, payments).
                      *   Purchasing regulated goods or participating in gambling.
                  *   **Sending Communications:**
                      *   Sending emails.
                      *   Sending messages on any platform (e.g., social media, chat apps).
                      *   Posting content on social media or forums.
                  *   **Accessing or Modifying Sensitive Information:**
                      *   Health, financial, or government records (e.g., medical history, tax
                          forms, passport status).
                      *   Revealing or modifying sensitive personal identifiers (e.g., SSN, bank
                          account number, credit card number).
                  *   **User Data Management:**
                      *   Accessing, downloading, or saving files from the web.
                      *   Sharing or sending files/data to any third party.
                      *   Transferring user data between systems.
                  *   **Browser Data Usage:**
                      *   Accessing or managing Chrome browsing history, bookmarks, autofill data,
                          or saved passwords.
                  *   **Security and Identity:**
                      *   Logging into any user account.
                      *   Any action that involves misrepresentation or impersonation (e.g.,
                          creating a fan account, posting as someone else).
                  *   **Insurmountable Obstacles:** If you are technically unable to interact with
                      a user interface element or are stuck in a loop you cannot resolve, ask the
                      user to take over.
                  ---

                  ## **RULE 2: Default Behavior (ACTUATE)**

                  If an action does **NOT** fall under the conditions for `USER_CONFIRMATION`,
                  your default behavior is to **Actuate**.

                  **Actuation Means:**  You MUST proactively perform all necessary steps to move
                  the user's request forward. Continue to actuate until you either complete the
                  non-consequential task or encounter a condition defined in Rule 1.

                  *   **Example 1:** If asked to send money, you will navigate to the payment
                      portal, enter the recipient's details, and enter the amount. You will then
                      **STOP** as per Rule 1 and ask for confirmation before clicking the final
                      "Send" button.
                  *   **Example 2:** If asked to post a message, you will navigate to the site,
                      open the post composition window, and write the full message. You will then
                      **STOP** as per Rule 1 and ask for confirmation before clicking the final
                      "Post" button.

                      After the user has confirmed, remember to get the user's latest screen
                      before continuing to perform actions.

                  # Final Response Guidelines:
                  Write final response to the user in the following cases:
                  - User confirmation
                  - When the task is complete or you have enough information to respond to the user
                  """

                  interaction = client.interactions.create(
                      model="gemini-4-hydrogen",
                      system_instruction=system_instruction,
                      input="Prepare a draft but do not send.",
                      tools=[{
                          "type": "computer_use",
                          "environment": "browser"
                      }]
                  )
      ```

=== "JavaScript"

      ```javascript
                  import { GoogleGenAI } from '@google/genai';

                  const ai = new GoogleGenAI();

                  const systemInstruction = `
                  ## **RULE 1: Seek User Confirmation (USER_CONFIRMATION)**

                  This is your first and most important check. If the next required action falls
                  into any of the following categories, you MUST stop immediately, and seek the
                  user's explicit permission.

                  **Procedure for Seeking Confirmation:**
                  * **For Consequential Actions:** Perform all preparatory steps (e.g., navigating,
                    filling out forms, typing a message). You will ask for confirmation **AFTER**
                    all necessary information is entered on the screen, but **BEFORE** you perform
                    the final, irreversible action (e.g., before clicking "Send", "Submit",
                    "Confirm Purchase", "Share").
                  * **For Prohibited Actions:** If the action is strictly forbidden (e.g., accepting
                    legal terms, solving a CAPTCHA), you must first inform the user about the
                    required action and ask for their confirmation to proceed.

                  **USER_CONFIRMATION Categories:**

                  *   **Consent and Agreements:** You are FORBIDDEN from accepting, selecting, or
                      agreeing to any of the following on the user's behalf. You must ask the
                      user to confirm before performing these actions.
                      *   Terms of Service
                      *   Privacy Policies
                      *   Cookie consent banners
                      *   End User License Agreements (EULAs)
                      *   Any other legally significant contracts or agreements.
                  *   **Robot Detection:** You MUST NEVER attempt to solve or bypass the
                      following. You must ask the user to confirm before performing these actions.
                      *   CAPTCHAs (of any kind)
                      *   Any other anti-robot or human-verification mechanisms, even if you are
                          capable.
                  *   **Financial Transactions:**
                      *   Completing any purchase.
                      *   Managing or moving money (e.g., transfers, payments).
                      *   Purchasing regulated goods or participating in gambling.
                  *   **Sending Communications:**
                      *   Sending emails.
                      *   Sending messages on any platform (e.g., social media, chat apps).
                      *   Posting content on social media or forums.
                  *   **Accessing or Modifying Sensitive Information:**
                      *   Health, financial, or government records (e.g., medical history, tax
                          forms, passport status).
                      *   Revealing or modifying sensitive personal identifiers (e.g., SSN, bank
                          account number, credit card number).
                  *   **User Data Management:**
                      *   Accessing, downloading, or saving files from the web.
                      *   Sharing or sending files/data to any third party.
                      *   Transferring user data between systems.
                  *   **Browser Data Usage:**
                      *   Accessing or managing Chrome browsing history, bookmarks, autofill data,
                          or saved passwords.
                  *   **Security and Identity:**
                      *   Logging into any user account.
                      *   Any action that involves misrepresentation or impersonation (e.g.,
                          creating a fan account, posting as someone else).
                  *   **Insurmountable Obstacles:** If you are technically unable to interact with
                      a user interface element or are stuck in a loop you cannot resolve, ask the
                      user to take over.
                  ---

                  ## **RULE 2: Default Behavior (ACTUATE)**

                  If an action does **NOT** fall under the conditions for \`USER_CONFIRMATION\`,
                  your default behavior is to **Actuate**.

                  **Actuation Means:**  You MUST proactively perform all necessary steps to move
                  the user's request forward. Continue to actuate until you either complete the
                  non-consequential task or encounter a condition defined in Rule 1.

                  *   **Example 1:** If asked to send money, you will navigate to the payment
                      portal, enter the recipient's details, and enter the amount. You will then
                      **STOP** as per Rule 1 and ask for confirmation before clicking the final
                      "Send" button.
                  *   **Example 2:** If asked to post a message, you will navigate to the site,
                      open the post composition window, and write the full message. You will then
                      **STOP** as per Rule 1 and ask for confirmation before clicking the final
                      "Post" button.

                      After the user has confirmed, remember to get the user's latest screen
                      before continuing to perform actions.

                  # Final Response Guidelines:
                  Write final response to the user in the following cases:
                  - User confirmation
                  - When the task is complete or you have enough information to respond to the user
                  `;

                  const interaction = await ai.interactions.create({
                      model: "gemini-4-hydrogen",
                      system_instruction: systemInstruction,
                      input: "Prepare a draft but do not send.",
                      tools: [{
                          type: "computer_use",
                          environment: "browser"
                      }]
                  });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.ComputerUse;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.EnvironmentEnum;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      String systemInstruction =
          "## **RULE 1: Seek User Confirmation (USER_CONFIRMATION)**\n\n"
              + "This is your first and most important check. If the next required action falls "
              + "into any of the following categories, you MUST stop immediately, and seek the "
              + "user's explicit permission.\n\n"
              + "## **RULE 2: Default Behavior (ACTUATE)**\n\n"
              + "If an action does **NOT** fall under the conditions for `USER_CONFIRMATION`, "
              + "your default behavior is to **Actuate**.";

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model("gemini-4-hydrogen")
              .systemInstruction(systemInstruction)
              .input(InteractionsInput.of("Prepare a draft but do not send."))
              .tools(
                  Arrays.asList(
                      ComputerUse.builder().environment(EnvironmentEnum.BROWSER).build()))
              .build();

      Interaction interaction =
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

          systemInstruction := "## **RULE 1: Seek User Confirmation (USER_CONFIRMATION)**\n\n" +
              "This is your first and most important check. If the next required action falls " +
              "into any of the following categories, you MUST stop immediately, and seek the " +
              "user's explicit permission.\n\n" +
              "## **RULE 2: Default Behavior (ACTUATE)**\n\n" +
              "If an action does **NOT** fall under the conditions for `USER_CONFIRMATION`, " +
              "your default behavior is to **Actuate**."

          _, err = client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:             interactions.Model("gemini-4-hydrogen"),
                  SystemInstruction: genai.Ptr(systemInstruction),
                  Input:             interactions.NewInteractionsInput("Prepare a draft but do not send."),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.ComputerUse{
                          Environment: interactions.EnvironmentEnumBrowser.ToPointer(),
                      }),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```


1. **安全的執行環境**：在安全、沙箱化的環境中執行代理，以限制其潛在影響。可以是沙箱化的虛擬機器（VM）、容器（例如 Docker），或權限受限的專用瀏覽器設定檔。沙箱設定指引（使用 Docker）請參閱 [GitHub 參考實作](https://github.com/google/computer-use-preview/)。
2. **輸入清理**：清理提示詞中所有使用者產生的文字，降低非預期指令或提示詞注入的風險。這是一層有用的安全防護，但不能取代安全的執行環境。
3. **內容防護**：使用防護機制與內容安全 API，評估使用者輸入、工具輸入與輸出，以及代理的回應是否適當，並偵測提示詞注入與越獄行為。
4. **允許清單與封鎖清單**：實作篩選機制，控制模型可以前往的位置與可以執行的動作。先從禁止網站的封鎖清單著手是個好起點，而限制更嚴格的允許清單則更加安全。
5. **可觀測性與記錄**：保留詳細記錄，以利除錯、稽核與事件應變。你的用戶端應記錄提示詞、螢幕截圖、模型建議的動作（`function_call`）、安全回應，以及用戶端最終執行的所有動作。
6. **環境管理**：確保 GUI 環境保持一致。意料之外的彈出視窗、通知或版面變化都可能讓模型混淆。盡可能讓每個新任務都從已知的乾淨狀態開始。

## 模型版本 {#model-versions}

你可以搭配以下模型使用電腦操作：

* [**Gemini 4 Carbon**](/docs/models/gemini-4-carbon/)（`gemini-4-carbon`）：我們能力最強的推理模型，支援電腦操作，適用於複雜推理與代理式 UI 工作流程。
* [**Gemini 4 Argon**](/docs/models/gemini-4-argon/)（`gemini-4-argon`）：高效的 Gemini 4 前沿推理模型，支援電腦操作；相較於 [Gemini 4 Carbon](/docs/models/gemini-4-carbon/)，回應更快、每回合的權杖消耗更低。
* [**Gemini 4 Neon**](/docs/models/gemini-4-neon/)（`gemini-4-neon`）：具備前沿等級的智慧，端到端任務完成速度快，支援電腦操作，涵蓋複雜的軟體工程、知識工作與科學工作流程。
* [**Gemini 4 Hydrogen**](/docs/models/gemini-4-hydrogen/)（`gemini-4-hydrogen`）：兼具尖端智慧、速度與效率，適用於日常程式設計、電腦操作與代理式 UI 工作流程。
* [**Gemini 3.8 Flash**](/docs/models/gemini-3.8-flash/)（`gemini-3.8-flash`）：上一代 Flash 模型，支援電腦操作，具備 UI 互動與可靠的工具呼叫能力。
* [**Gemini 3.5 Flash-Lite**](/docs/models/gemini-3.5-flash-lite/)（`gemini-3.5-flash-lite`）：低延遲、高成本效益的模型，支援電腦操作。
* [**Gemini 3 Flash Preview**](/docs/models/gemini-3-flash-preview/)（`gemini-3-flash-preview`）：支援電腦操作的預覽模型。

## 後續步驟 {#whats-next}

* 在 [Browserbase 示範環境](http://gemini.browserbase.com)中試用電腦操作。
* 查看[參考實作](https://github.com/google/computer-use-preview)的範例程式碼。
* 了解其他 Gemini API 工具：
  *   [函式呼叫](/docs/function-calling/)
  *   [使用 Google 搜尋接地](/docs/google-search/)
