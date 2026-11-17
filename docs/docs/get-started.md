# 開始使用

本指南將帶你透過 [Interactions API](/docs/interactions-overview/) 開始使用
Gemini API。你將在不到一分鐘內完成第一次 API 呼叫，並探索文字生成、
多模態理解、圖片生成、結構化輸出、工具、函式呼叫、代理與背景執行。

Interactions API 可透過 [Python](https://github.com/googleapis/python-genai)
與 [JavaScript](https://github.com/googleapis/js-genai) SDK 使用，也可以
透過 REST 呼叫。


!!! info " "

      使用 AI 程式設計代理開發嗎？將這段設定提示詞複製到你的代理中，或
      連接我們的 [MCP 伺服器與技能](/docs/coding-agents/)，即時取得最新
      文件。

      ```none
      Set up my Gemini API project using the Interactions API and the latest models. Read https://aistudio.google.com/docs/get-started.md first (every page under https://aistudio.google.com/docs/ is available as Markdown when you add `.md`, or via https://aistudio.google.com/llms.txt).
      1. Install `google-genai` (Python) or `@google/genai` (JS/TS) for this project.
      2. Check `GEMINI_API_KEY`, or prompt me to create one at https://aistudio.google.com/apikey.
      3. Ask if I want to add the `gemini-api-dev` skill and Docs MCP server from https://aistudio.google.com/docs/coding-agents.md.
      4. When we are set up, run one `client.interactions.create` test call, show me the reply, and ask what I want to build.
      ```


## 1. 取得 API 金鑰 {#get-api-key}

使用 Gemini API 需要 API 金鑰，用來驗證你的請求、強制執行安全限制，
並將用量記錄到你的帳戶。

*   Google AI Studio 會自動為新使用者建立專案與 API 金鑰。你可以從
    [API 金鑰頁面](https://aistudio.google.com/api-keys) 複製金鑰。
*   如需新的金鑰，在 AI Studio 中點選 **Create API key**，並依照對話框
    指示新增一組金鑰與專案的配對。
*   額外建立的專案，以及從 Google Cloud 匯入的專案，可能需要先完成
    [專案驗證](/docs/verification/)，才能使用免費層級。

[Create a Gemini API Key](https://aistudio.google.com/apikey)

將金鑰設定為環境變數：

```bash
export GEMINI_API_KEY="YOUR_API_KEY"
```

如需提高速率限制，請在 [API
金鑰](https://aistudio.google.com/api-keys) 頁面點選 **Set up billing**，
或參閱[計費指南](/docs/billing/)。

## 2. 安裝 SDK 並發出第一次呼叫 {#2-install-the-sdk-and-make-your-first-call}

安裝 SDK，並以單一 API 呼叫生成文字。


=== "Python"

      安裝 SDK：

      ```bash
      pip install -U google-genai
      ```

      初始化用戶端並發出請求：

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Explain how AI works in a few words"
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      安裝 SDK：

      ```bash
      npm install @google/genai
      ```

      初始化用戶端並發出請求：

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: "Explain how AI works in a few words",
      });
      console.log(interaction.output_text);
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
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Explain how AI works in a few words"))
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
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Explain how AI works in a few words."),
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
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Explain how AI works in a few words"
        }'
      ```

      **回應**：

      ```json
      {
        "id": "v1_ChdpQUFvYXI...",
        "status": "completed",
        "usage": {
          "total_tokens": 197,
          "total_input_tokens": 8,
          "total_output_tokens": 12
        },
        "created": "2026-06-09T12:01:25Z",
        "steps": [
          {
            "type": "thought",
            "signature": "EvEFCu4FAQw..."
          },
          {
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "AI learns patterns from data, then uses those patterns to make predictions or decisions on new data."
              }
            ]
          }
        ],
        "object": "interaction",
        "model": "gemini-4-hydrogen",
      }
      ```

      使用 REST 時，API 會回傳完整的 `Interaction` 資源，其中包含
        中繼資料、用量統計，以及該輪對話的逐步歷史記錄。

=== "CLI"

      ```bash
      curl -fsSL https://raw.githubusercontent.com/google-gemini/gemini-api-cli/main/scripts/install.sh | bash
      gemini-api generate "Explain how AI works in a few words"
      ```


SDK 除了提供完整回應，也提供 `interaction.output_text` 與
`interaction.output_image` 等便利屬性，讓你直接存取最終輸出。如需了解
回應結構的更多資訊，請參閱 [Interactions
總覽](/docs/interactions-overview/)，或閱讀[文字生成指南](/docs/text-generation/)，
了解系統指令與生成設定的細節。

## 3. 串流回應 {#3-stream-the-response}

若想讓互動更流暢，可在回應生成時即時串流。每個 `step.delta` 事件都會
傳遞一段文字，讓你立即顯示。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      stream = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Explain how AI works",
          stream=True
      )
      for event in stream:
          print(event)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const stream = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: "Explain how AI works",
        stream: true,
      });

      for await (const event of stream) {
        console.log(event);
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.InteractionSSEStreamEvent;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.CreateInteractionResponse;
      import com.google.genai.gaos.utils.EventStream;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Explain how AI works"))
              .stream(true)
              .build();

      CreateInteractionResponse response =
          client.interactions.create(CreateInteractionRequestBody.of(params));

      try (EventStream<InteractionSSEStreamEvent> stream = response.events()) {
        for (InteractionSSEStreamEvent event : stream) {
          System.out.println(event);
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
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Write a haiku about coding."),
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
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        --no-buffer \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Explain how AI works",
          "stream": true
        }'
      ```

      串流時，伺服器會以 server-sent events (SSE) 串流回應。
        每個事件都包含類型與 JSON 資料。

      **回應**：

      ```json
      event: interaction.created
      data: {"interaction":{"id":"v1_Chd...","status":"in_progress","model":"gemini-4-hydrogen"},"event_type":"interaction.created"}

      event: step.start
      data: {"index":0,"step":{"type":"thought"},"event_type":"step.start"}

      event: step.delta
      data: {"index":0,"delta":{"signature":"EvEFCu4F...","type":"thought_signature"},"event_type":"step.delta"}

      event: step.stop
      data: {"index":0,"event_type":"step.stop"}

      event: step.start
      data: {"index":1,"step":{"type":"model_output"},"event_type":"step.start"}

      event: step.delta
      data: {"index":1,"delta":{"text":"AI ","type":"text"},"event_type":"step.delta"}

      event: step.delta
      data: {"index":1,"delta":{"text":"works ","type":"text"},"event_type":"step.delta"}

      event: step.stop
      data: {"index":1,"event_type":"step.stop"}

      event: interaction.completed
      data: {"interaction":{"id":"v1_Chd...","status":"completed","usage":{"total_tokens":197}},"event_type":"interaction.completed"}
      ```

=== "CLI"

      ```bash
      gemini-api generate "Explain how AI works"
      ```


如需深入了解如何處理串流事件與 delta 類型，請參閱[串流互動指南](/docs/streaming/)。

## 4. 多輪對話 {#4-multi-turn-conversations}

Interactions API 支援兩種多輪對話方式：

*   **有狀態**（建議）：使用 `previous_interaction_id` 在伺服器端延續
    對話。適合大多數聊天與代理工作流程，讓伺服器管理歷史記錄並最佳化
    快取。
*   **無狀態**：在用戶端管理對話歷史，在每次請求中傳入先前的所有輪次
    （包括模型中間的思考與工具步驟）。


=== "Code"

      傳入 `previous_interaction_id` 即可串連多次互動，完整的對話歷史
        由伺服器為你管理。


    === "Python"

          ```python
          from google import genai

          client = genai.Client()

          # Server-side state (recommended)
          interaction1 = client.interactions.create(
              model="gemini-4-hydrogen",
              input="I have 2 dogs in my house.",
          )
          print("Response 1:", interaction1.output_text)

          interaction2 = client.interactions.create(
              model="gemini-4-hydrogen",
              input="How many paws are in my house?",
              previous_interaction_id=interaction1.id,
          )
          print("Response 2:", interaction2.output_text)
          ```

    === "JavaScript"

          ```javascript
          import { GoogleGenAI } from "@google/genai";

          const ai = new GoogleGenAI({});

          // Server-side state (recommended)
          const interaction1 = await ai.interactions.create({
            model: "gemini-4-hydrogen",
            input: "I have 2 dogs in my house.",
          });
          console.log("Response 1:", interaction1.output_text);

          const interaction2 = await ai.interactions.create({
            model: "gemini-4-hydrogen",
            input: "How many paws are in my house?",
            previous_interaction_id: interaction1.id,
          });
          console.log("Response 2:", interaction2.output_text);
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

          // Server-side state (recommended)
          CreateModelInteraction params1 =
              CreateModelInteraction.builder()
                  .model(Model.of("gemini-4-hydrogen"))
                  .input(InteractionsInput.of("I have 2 dogs in my house."))
                  .build();

          Interaction interaction1 =
              client.interactions.create(CreateInteractionRequestBody.of(params1)).interaction().get();
          System.out.println("Response 1: " + interaction1.outputText().orElse(""));

          CreateModelInteraction params2 =
              CreateModelInteraction.builder()
                  .model(Model.of("gemini-4-hydrogen"))
                  .input(InteractionsInput.of("How many paws are in my house?"))
                  .previousInteractionId(interaction1.id().orElse(""))
                  .build();

          Interaction interaction2 =
              client.interactions.create(CreateInteractionRequestBody.of(params2)).interaction().get();
          System.out.println("Response 2: " + interaction2.outputText().orElse(""));
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
                      Model:  interactions.Model("gemini-4-hydrogen"),
                      Input:  interactions.NewInteractionsInput("Explain quantum computing in simple terms."),
                      Stream: genai.Ptr(true),
                  }),
              })
              if err != nil {
                  log.Fatal(err)
              }
              stream := res.InteractionSSEStreamEvent
              defer stream.Close()

              for stream.Next() {
                  event := stream.Value()
                  if stepDelta := event.GetDataStepDelta(); stepDelta != nil {
                      if textDelta := stepDelta.GetDeltaText(); textDelta != nil {
                          fmt.Print(textDelta.GetText())
                      }
                  }
              }
              if err := stream.Err(); err != nil {
                  log.Fatal(err)
              }
          }
          ```

    === "REST"

          ```bash
          RESPONSE1=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H 'Content-Type: application/json' \
            -H "Api-Revision: 2026-05-20" \
            -d '{
              "model": "gemini-4-hydrogen",
              "input": "I have 2 dogs in my house."
            }')

          INTERACTION_ID=$(echo "$RESPONSE1" | jq -r '.id')
          echo "Interaction 1 ID: $INTERACTION_ID"

          curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H 'Content-Type: application/json' \
            -H "Api-Revision: 2026-05-20" \
            -d '{
              "model": "gemini-4-hydrogen",
              "input": "How many paws are in my house?",
              "previous_interaction_id": "'$INTERACTION_ID'"
            }'
          ```

    === "CLI"

          ```bash
          INTERACTION_ID=$(gemini-api generate "I have 2 dogs in my house." --stream=false --jq '.id')
          gemini-api generate "How many paws are in my house?" --previous-interaction-id "$INTERACTION_ID"
          ```

=== "Code"

      設定 `store=false`，在用戶端管理對話歷史。你必須完整保留模型
        生成的所有步驟（包括 `thought` 與 `function_call` 步驟），並
        依原樣重新送出。


    === "Python"

          ```python
          from google import genai

          client = genai.Client()

          history = [
              {
                  "type": "user_input",
                  "content": [{"type": "text", "text": "I have 2 dogs in my house."}]
              }
          ]

          interaction1 = client.interactions.create(
              model="gemini-4-hydrogen",
              store=False,
              input=history
          )
          print("Response 1:", interaction1.steps[-1].content[0].text)

          for step in interaction1.steps:
              history.append(step.model_dump())

          history.append({
              "type": "user_input",
              "content": [{"type": "text", "text": "How many paws are in my house?"}]
          })

          interaction2 = client.interactions.create(
              model="gemini-4-hydrogen",
              store=False,
              input=history
          )
          print("Response 2:", interaction2.steps[-1].content[0].text)
          ```

    === "JavaScript"

          ```javascript
          import { GoogleGenAI } from "@google/genai";

          const ai = new GoogleGenAI({});

          const history = [
            {
              type: "user_input",
              content: [{ type: "text", text: "I have 2 dogs in my house." }]
            }
          ];

          const interaction1 = await ai.interactions.create({
            model: "gemini-4-hydrogen",
            store: false,
            input: history
          });
          console.log("Response 1:", interaction1.steps.at(-1).content[0].text);

          history.push(...interaction1.steps);

          history.push({
            type: "user_input",
            content: [{ type: "text", text: "How many paws are in my house?" }]
          });

          const interaction2 = await ai.interactions.create({
            model: "gemini-4-hydrogen",
            store: false,
            input: history
          });
          console.log("Response 2:", interaction2.steps.at(-1).content[0].text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.Model;
          import com.google.genai.gaos.models.interactions.Step;
          import com.google.genai.gaos.models.interactions.TextContent;
          import com.google.genai.gaos.models.interactions.UserInputStep;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import java.util.ArrayList;
          import java.util.Arrays;
          import java.util.List;

          Client client = new Client();

          List<Step> history = new ArrayList<>();
          history.add(
              UserInputStep.builder()
                  .content(Arrays.asList(TextContent.builder().text("I have 2 dogs in my house.").build()))
                  .build());

          CreateModelInteraction params1 =
              CreateModelInteraction.builder()
                  .model(Model.of("gemini-4-hydrogen"))
                  .store(false)
                  .input(InteractionsInput.ofStep(history))
                  .build();

          Interaction interaction1 =
              client.interactions.create(CreateInteractionRequestBody.of(params1)).interaction().get();
          System.out.println("Response 1: " + interaction1.outputText().orElse(""));

          interaction1.steps().ifPresent(history::addAll);

          history.add(
              UserInputStep.builder()
                  .content(Arrays.asList(TextContent.builder().text("How many paws are in my house?").build()))
                  .build());

          CreateModelInteraction params2 =
              CreateModelInteraction.builder()
                  .model(Model.of("gemini-4-hydrogen"))
                  .store(false)
                  .input(InteractionsInput.ofStep(history))
                  .build();

          Interaction interaction2 =
              client.interactions.create(CreateInteractionRequestBody.of(params2)).interaction().get();
          System.out.println("Response 2: " + interaction2.outputText().orElse(""));
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

              // 1. First turn
              res1, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                  Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Hi, my name is Alex."),
                  }),
              })
              if err != nil {
                  log.Fatal(err)
              }
              if res1.Interaction.OutputText != nil {
                  fmt.Println(*res1.Interaction.OutputText)
              }

              // 2. Second turn (passing PreviousInteractionID)
              res2, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                  Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                      Model:                 interactions.Model("gemini-4-hydrogen"),
                      Input:                 interactions.NewInteractionsInput("What's my name?"),
                      PreviousInteractionID: res1.Interaction.ID,
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

    === "REST"

          ```bash
          # Turn 1: Send with store: false
          RESPONSE1=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H 'Content-Type: application/json' \
            -H "Api-Revision: 2026-05-20" \
            -d '{
              "model": "gemini-4-hydrogen",
              "store": false,
              "input": [
                {
                  "type": "user_input",
                  "content": "I have 2 dogs in my house."
                }
              ]
            }')

          MODEL_STEPS=$(echo "$RESPONSE1" | jq '.steps')

          # Turn 2: Build full history
          HISTORY=$(jq -n \
            --argjson first_input '[{"type": "user_input", "content": "I have 2 dogs in my house."}]' \
            --argjson model_steps "$MODEL_STEPS" \
            --argjson second_input '[{"type": "user_input", "content": "How many paws are in my house?"}]' \
            '$first_input + $model_steps + $second_input')

          curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H 'Content-Type: application/json' \
            -H "Api-Revision: 2026-05-20" \
            -d "{
              \"model\": \"gemini-4-hydrogen\",
              \"store\": false,
              \"input\": $HISTORY
            }"
          ```

          **回應**：

          ```json
          {
            "id": "v2_Chd...",
            "status": "completed",
            "usage": {
              "total_tokens": 240,
              "total_input_tokens": 60,
              "total_output_tokens": 20
            },
            "steps": [
              {
                "type": "model_output",
                "content": [
                  {
                    "type": "text",
                    "text": "There are 8 paws in your house. 2 dogs \u00d7 4 paws = 8 paws."
                  }
                ]
              }
            ],
            "object": "interaction",
            "model": "gemini-4-hydrogen"
          }
          ```

          第二次互動會回傳完整的回應物件，其中僅包含新的步驟，但內容
                以先前輪次的上下文為依據。如需了解如何維護狀態，請參閱
                [多輪對話指南](/docs/text-generation/#multi-turn-conversations)；
                如需在用戶端管理歷史，請探索[無狀態
                模式](/docs/text-generation/#stateless-conversations)。


## 5. 多模態理解 {#5-multimodal-understanding}

Gemini 模型原生理解圖片、音訊、影片與文件。在單一請求中同時傳入媒體
與文字即可。


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client()

      # Load a local image
      with open("sample.jpg", "rb") as f:
          image_bytes = f.read()
      image_b64 = base64.b64encode(image_bytes).decode("utf-8")

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": "Compare this local image and this remote audio file."},
              {
                  "type": "image",
                  "data": image_b64,
                  "mime_type": "image/jpeg"
              },
              {
                  "type": "audio",
                  "uri": "https://storage.googleapis.com/generativeai-downloads/data/sample.mp3",
                  "mime_type": "audio/mp3"
              }
          ]
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import fs from "fs";
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      // Load a local image
      const imageBytes = fs.readFileSync("sample.jpg");
      const imageB64 = imageBytes.toString("base64");

      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: [
          { type: "text", text: "Compare this local image and this remote audio file." },
          {
            type: "image",
            data: imageB64,
            mime_type: "image/jpeg"
          },
          {
            type: "audio",
            uri: "https://storage.googleapis.com/generativeai-downloads/data/sample.mp3",
            mime_type: "audio/mp3"
          }
        ],
      });
      console.log(interaction.output_text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.AudioContent;
      import com.google.genai.gaos.models.interactions.AudioContentMimeType;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Path;
      import java.util.Arrays;
      import java.util.Base64;

      Client client = new Client();

      // Load a local image
      byte[] imageBytes = Files.readAllBytes(Path.of("sample.jpg"));
      String imageB64 = Base64.getEncoder().encodeToString(imageBytes);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(
                  InteractionsInput.ofContent(
                      Arrays.asList(
                          TextContent.builder()
                              .text("Compare this local image and this remote audio file.")
                              .build(),
                          ImageContent.builder()
                              .data(imageB64)
                              .mimeType(ImageContentMimeType.IMAGE_JPEG)
                              .build(),
                          AudioContent.builder()
                              .uri("https://storage.googleapis.com/generativeai-downloads/data/sample.mp3")
                              .mimeType(AudioContentMimeType.AUDIO_MP3)
                              .build())))
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
          "encoding/base64"
          "fmt"
          "log"
          "os"

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

          imageBytes, err := os.ReadFile("path/to/organ.jpg")
          if err != nil {
              log.Fatal(err)
          }
          base64Image := base64.StdEncoding.EncodeToString(imageBytes)

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: "What is in this image?",
                      }),
                      interactions.NewContent(interactions.ImageContent{
                          Data:     genai.Ptr(base64Image),
                          MimeType: interactions.ImageContentMimeTypeImageJpeg.ToPointer(),
                      }),
                  }),
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
      # Base64-encode local image
      BASE64_IMAGE=$(base64 -w 0 sample.jpg)

      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {
              "type": "text",
              "text": "Compare this local image and this remote audio file."
            },
            {
              "type": "image",
              "data": "'$BASE64_IMAGE'",
              "mime_type": "image/jpeg"
            },
            {
              "type": "audio",
              "uri": "https://storage.googleapis.com/generativeai-downloads/data/sample.mp3",
              "mime_type": "audio/mp3"
            }
          ]
        }'
      ```

      **回應**：

      ```json
      {
        "id": "v1_Chd...",
        "status": "completed",
        "usage": {
          "total_tokens": 300
        },
        "steps": [
          {
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "The local image displays a pipe organ while the remote audio file is a sample MP3 clip..."
              }
            ]
          }
        ],
        "object": "interaction",
        "model": "gemini-4-hydrogen",
      }
      ```

=== "CLI"

      ```bash
      curl -fsSLO https://storage.googleapis.com/generativeai-downloads/data/Apollo-11_Day-01-Highlights-10s.mp3
      gemini-api generate "Compare this image and this audio file." \
        -i sample.jpg \
        -i Apollo-11_Day-01-Highlights-10s.mp3
      ```


如需了解如何傳入圖片、影片與音訊檔案，請參閱[圖片理解指南](/docs/image-understanding/)。


  

**[音訊理解](/docs/audio/)**

轉錄、摘要音訊檔案，或針對音訊檔案提問。


  

**[影片理解](/docs/video-understanding/)**

分析影片內容、定位事件並描述動作。


  

**[文件處理](/docs/document-processing/)**

從 PDF 與其他文件格式中擷取資訊。


## 6. 多模態生成 {#6-multimodal-generation}

Gemini 可使用 [Nano Banana](/docs/image-generation/) 圖片模型原生生成
圖片。


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-3.1-flash-image",
          input="Generate an image of a futuristic city skyline at sunset",
      )

      with open("generated_image.png", "wb") as f:
          f.write(base64.b64decode(interaction.output_image.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-image",
        input: "Generate an image of a futuristic city skyline at sunset",
      });

      const generatedImage = interaction.output_image;
      if (generatedImage && generatedImage.data) {
        const buffer = Buffer.from(generatedImage.data, "base64");
        fs.writeFileSync("generated_image.png", buffer);
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Path;
      import java.util.Base64;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-3.1-flash-image"))
              .input(InteractionsInput.of("Generate an image of a futuristic city skyline at sunset"))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputImage().isPresent()) {
        ImageContent generatedImage = interaction.outputImage().get();
        if (generatedImage.data().isPresent()) {
          byte[] imageBytes = Base64.getDecoder().decode(generatedImage.data().get());
          Files.write(Path.of("generated_image.png"), imageBytes);
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
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          weatherTool := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("get_current_weather"),
              Description: genai.Ptr("Gets the current weather for a given location."),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "location": map[string]any{
                          "type":        "string",
                          "description": "The city and state, e.g. San Francisco, CA",
                      },
                  },
                  "required": []string{"location"},
              },
          })

          // 1. Send prompt with tool declaration
          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("What is the weather like in Boston?"),
                  Tools: []interactions.Tool{weatherTool},
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          // 2. Check if the model requested a function call
          for _, step := range res.Interaction.Steps {
              if call := step.FunctionCallStep; call != nil {
                  fmt.Printf("Function to call: %s\n", call.Name)
                  fmt.Printf("Arguments: %v\n", call.Arguments)

                  // 3. Execute your local function and send the result back
                  finalRes, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                      Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                          Model:                 interactions.Model("gemini-4-hydrogen"),
                          PreviousInteractionID: res.Interaction.ID,
                          Input: interactions.NewInteractionsInput([]interactions.Step{
                              interactions.NewStep(interactions.FunctionResultStep{
                                  Name:   genai.Ptr(call.Name),
                                  CallID: call.ID,
                                  Result: interactions.NewFunctionResultStepResultUnion(`{"temperature": "72F", "condition": "Sunny"}`),
                              }),
                          }),
                      }),
                  })
                  if err != nil {
                      log.Fatal(err)
                  }

                  if finalRes.Interaction.OutputText != nil {
                      fmt.Println(*finalRes.Interaction.OutputText)
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-3.1-flash-image",
          "input": [
            {"type": "text", "text": "Generate an image of a futuristic city skyline at sunset"}
          ]
        }'
      ```

      **回應**：

      ```json
      {
        "id": "v1_Chd...",
        "status": "completed",
        "steps": [
          {
            "type": "model_output",
            "content": [
              {
                "type": "image",
                "data": "BASE64_ENCODED_IMAGE",
                "mime_type": "image/png"
              }
            ]
          }
        ],
        "object": "interaction",
        "model": "gemini-3.1-flash-image",
      }
      ```

=== "CLI"

      ```bash
      gemini-api image "Generate an image of a futuristic city skyline at sunset" \
        -m gemini-3.1-flash-image \
        --out generated_image.png
      ```


模型生成圖片時，會在 `steps` 陣列的某個步驟中回傳以 base64 編碼的
圖片資料，也可透過 `output_image` 便利屬性取得。詳情請參閱[圖片生成
指南](/docs/image-generation/)，了解長寬比、圖片編輯與參考圖片。


  

**[語音生成](/docs/speech-generation/)**

使用 Gemini 3.1 Flash TTS 生成富有表現力、支援多位講者的語音。


  

**[音樂生成](/docs/music-generation/)**

使用 Lyria 3.5 創作音樂片段與完整歌曲。


## 7. 使用結構化輸出 {#7-use-structured-output}

設定模型回傳符合你所定義結構的 JSON。結構化輸出可搭配
[Pydantic](https://docs.pydantic.dev/latest/)（Python）與
[Zod](https://zod.dev/)（JavaScript）使用。


=== "Python"

      ```python
      from google import genai
      from pydantic import BaseModel, Field
      from typing import List, Optional

      class Recipe(BaseModel):
          recipe_name: str = Field(description="Name of the recipe.")
          ingredients: List[str] = Field(description="List of ingredients.")
          prep_time_minutes: Optional[int] = Field(description="Prep time in minutes.")

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Give me a recipe for banana bread",
          response_format={
              "type": "text",
              "mime_type": "application/json",
              "schema": Recipe.model_json_schema()
          },
      )

      recipe = Recipe.model_validate_json(interaction.output_text)
      print(recipe)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as z from "zod";

      const ai = new GoogleGenAI({});

      const recipeJsonSchema = {
        type: "object",
        properties: {
          recipe_name: { type: "string", description: "Name of the recipe." },
          ingredients: {
            type: "array",
            items: { type: "string" },
            description: "List of ingredients."
          },
          prep_time_minutes: {
            type: "integer",
            description: "Prep time in minutes."
          }
        },
        required: ["recipe_name", "ingredients"]
      };

      const recipeSchema = z.fromJSONSchema(recipeJsonSchema);

      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: "Give me a recipe for banana bread",
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: recipeJsonSchema
        },
      });

      const recipe = recipeSchema.parse(JSON.parse(interaction.output_text));
      console.log(recipe);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormatMimeType;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> recipeNameProp = new HashMap<>();
      recipeNameProp.put("type", "string");
      recipeNameProp.put("description", "Name of the recipe.");

      Map<String, Object> itemsProp = new HashMap<>();
      itemsProp.put("type", "string");

      Map<String, Object> ingredientsProp = new HashMap<>();
      ingredientsProp.put("type", "array");
      ingredientsProp.put("items", itemsProp);
      ingredientsProp.put("description", "List of ingredients.");

      Map<String, Object> prepTimeProp = new HashMap<>();
      prepTimeProp.put("type", "integer");
      prepTimeProp.put("description", "Prep time in minutes.");

      Map<String, Object> properties = new HashMap<>();
      properties.put("recipe_name", recipeNameProp);
      properties.put("ingredients", ingredientsProp);
      properties.put("prep_time_minutes", prepTimeProp);

      Map<String, Object> recipeJsonSchema = new HashMap<>();
      recipeJsonSchema.put("type", "object");
      recipeJsonSchema.put("properties", properties);
      recipeJsonSchema.put("required", Arrays.asList("recipe_name", "ingredients"));

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  TextResponseFormat.builder()
                      .mimeType(TextResponseFormatMimeType.APPLICATION_JSON)
                      .schema(recipeJsonSchema)
                      .build()));

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Give me a recipe for banana bread"))
              .responseFormat(format)
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
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Who won the latest Super Bowl and what was the score?"),
                  Tools: []interactions.Tool{
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

          // Optional: Inspect search queries and citations
          for _, step := range res.Interaction.Steps {
              if searchCall := step.GoogleSearchCallStep; searchCall != nil {
                  fmt.Printf("Search queries: %v\n", searchCall.Arguments.Queries)
              } else if modelOut := step.ModelOutputStep; modelOut != nil {
                  for _, part := range modelOut.Content {
                      if textPart := part.TextContent; textPart != nil {
                          for _, annotation := range textPart.Annotations {
                              if citation := annotation.URLCitation; citation != nil {
                                  var title, url string
                                  if citation.Title != nil {
                                      title = *citation.Title
                                  }
                                  if citation.URL != nil {
                                      url = *citation.URL
                                  }
                                  fmt.Printf("Source: %s (%s)\n", title, url)
                              }
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Give me a recipe for banana bread",
          "response_format": {
            "type": "text",
            "mime_type": "application/json",
            "schema": {
              "type": "object",
              "properties": {
                "recipe_name": { "type": "string", "description": "Name of the recipe." },
                "ingredients": {
                  "type": "array",
                  "items": { "type": "string" },
                  "description": "List of ingredients."
                },
                "prep_time_minutes": {
                  "type": "integer",
                  "description": "Prep time in minutes."
                }
              },
              "required": ["recipe_name", "ingredients"]
            }
          }
        }'
      ```

      **回應**：

      ```json
      {
        "id": "v1_Chd...",
        "status": "completed",
        "steps": [
          {
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "{\n \"recipe_name\": \"Classic Banana Bread\",\n \"ingredients\": [\n \"3 ripe bananas, mashed\",\n \"1/3 cup melted butter\",\n \"3/4 cup sugar\",\n \"1 egg, beaten\",\n \"1 teaspoon vanilla extract\",\n \"1 teaspoon baking soda\",\n \"Pinch of salt\",\n \"1.5 cups all-purpose flour\"\n ],\n \"prep_time_minutes\": 15\n}"
              }
            ]
          }
        ],
        "object": "interaction",
        "model": "gemini-4-hydrogen",
      }
      ```

=== "CLI"

      ```bash
      gemini-api generate "Give me a recipe for banana bread" --body '{
        "response_format": {
          "type": "text",
          "mime_type": "application/json",
          "schema": {
            "type": "object",
            "properties": {
              "recipe_name": {"type": "string", "description": "Name of the recipe."},
              "ingredients": {"type": "array", "items": {"type": "string"}, "description": "List of ingredients."},
              "prep_time_minutes": {"type": "integer", "description": "Prep time in minutes."}
            },
            "required": ["recipe_name", "ingredients"]
          }
        }
      }'
      ```


輸出文字區塊包含一段有效的 JSON 字串，完全符合所要求的結構。如需
了解如何定義更複雜的結構與遞迴結構，請參閱[結構化輸出指南](/docs/structured-output/)。

## 8. 使用工具 {#8-use-tools}

使用 Google 搜尋，讓模型的回應以即時資訊接地。API 會自動搜尋、處理
結果並回傳引用來源。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Who won the euro 2024?",
          tools=[{"type": "google_search"}]
      )

      print(interaction.output_text)

      # Print citations
      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text" and content_block.annotations:
                      print("\nCitations:")
                      for annotation in content_block.annotations:
                          if annotation.type == "url_citation":
                              print(f" [{annotation.title}]({annotation.url})")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: "Who won the euro 2024?",
        tools: [{ type: "google_search" }]
      });

      console.log(interaction.output_text);

      // Print citations
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content || []) {
            if (contentBlock.type === "text" && contentBlock.annotations) {
              console.log("\nCitations:");
              for (const annotation of contentBlock.annotations) {
                if (annotation.type === "url_citation") {
                  console.log(` [${annotation.title}](${annotation.url})`);
                }
              }
            }
          }
        }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Annotation;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.GoogleSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.URLCitation;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Who won the euro 2024?"))
              .tools(Arrays.asList(new GoogleSearch()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println(interaction.outputText().orElse(""));

      // Print citations
      for (Step step : interaction.steps().orElse(Collections.emptyList())) {
        if (step instanceof ModelOutputStep outputStep) {
          for (Content contentBlock : outputStep.content().orElse(Collections.emptyList())) {
            if (contentBlock instanceof TextContent textContent && textContent.annotations().isPresent()) {
              System.out.println("\nCitations:");
              for (Annotation annotation : textContent.annotations().get()) {
                if (annotation instanceof URLCitation citation) {
                  System.out.printf("  [%s](%s)%n", citation.title().orElse(""), citation.url().orElse(""));
                }
              }
            }
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
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Calculate the 20th Fibonacci number and verify if it is prime."),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.CodeExecution{}),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if codeCall := step.CodeExecutionCallStep; codeCall != nil {
                  fmt.Printf("Generated Code:\n%s\n", codeCall.Arguments.Code)
              } else if codeRes := step.CodeExecutionResultStep; codeRes != nil {
                  fmt.Printf("Execution Output:\n%s\n", codeRes.Result)
              }
          }

          if res.Interaction.OutputText != nil {
              fmt.Println(*res.Interaction.OutputText)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Who won the euro 2024?",
          "tools": [{"type": "google_search"}]
        }'
      ```

      **回應**：

      ```json
      {
        "id": "v1_Chd...",
        "status": "completed",
        "steps": [
          {
            "type": "thought",
            "signature": "EvEFCu4F..."
          },
          {
            "type": "google_search_call",
            "arguments": {
              "queries": ["UEFA Euro 2024 winner"]
            }
          },
          {
            "type": "google_search_result",
            "call_id": "search_001",
            "result": [
              {
                "search_suggestions": "<!-- HTML and CSS search widget -->"
              }
            ]
          },
          {
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "Spain won Euro 2024, defeating England 2-1 in the final.",
                "annotations": [
                  {
                    "type": "url_citation",
                    "url": "https://www.uefa.com/euro2024",
                    "title": "uefa.com",
                    "start_index": 0,
                    "end_index": 56
                  }
                ]
              }
            ]
          }
        ],
        "object": "interaction",
        "model": "gemini-4-hydrogen",
      }
      ```

=== "CLI"

      ```bash
      gemini-api generate "Who won the euro 2024?" --body '{"tools": [{"type": "google_search"}]}'
      ```


搜尋步驟會詳列於互動歷史中，最終輸出則包含指向網路來源的行內引用。

如需了解如何擷取搜尋引用，請參閱 [Google 搜尋接地
指南](/docs/google-search/)；如需了解如何組合多個工具，請參閱[工具組合
指南](/docs/tool-combination/)。


  

**[程式碼執行](/docs/code-execution/)**

在安全的沙箱 Borg 環境中執行 Python 程式碼。


  

**[URL 上下文](/docs/url-context/)**

直接傳入公開的網頁 URL，讓回應以網頁內容接地。


  

**[File search](/docs/file-search/)**

為上傳的文件與媒體檔案建立索引並進行搜尋。


  

**[Google Maps](/docs/maps-grounding/)**

讓回應以真實世界的地理空間與位置資料接地。


  

**[電腦操作](/docs/computer-use/)**

瀏覽器自動化與螢幕互動。


## 9. 呼叫自己的函式 {#9-call-your-own-functions}

函式呼叫讓模型能與你的程式碼連接。你宣告函式的名稱與參數，模型決定
何時呼叫並回傳結構化引數，你在本機執行後再將結果送回。


=== "Code"


    === "Python"

          ```python
          import json
          from google import genai

          client = genai.Client()

          weather_tool = {
              "type": "function",
              "name": "get_current_temperature",
              "description": "Gets the current temperature for a given location.",
              "parameters": {
                  "type": "object",
                  "properties": {
                      "location": {
                          "type": "string",
                          "description": "The city name, e.g. San Francisco",
                      },
                  },
                  "required": ["location"],
              },
          }

          available_functions = {
              "get_current_temperature": lambda location: {
                  "location": location, "temperature": "22", "unit": "celsius"
              },
          }

          user_input = "What is the temperature in London?"
          previous_id = None

          while True:
              interaction = client.interactions.create(
                  model="gemini-4-hydrogen",
                  input=user_input,
                  tools=[weather_tool],
                  previous_interaction_id=previous_id,
              )

              function_results = []
              for step in interaction.steps:
                  if step.type == "function_call":
                      result = available_functions[step.name](**step.arguments)
                      print(f"Called {step.name}({step.arguments}) → {result}")
                      function_results.append({
                          "type": "function_result",
                          "name": step.name,
                          "call_id": step.id,
                          "result": [{"type": "text", "text": json.dumps(result)}],
                      })

              if not function_results:
                  break

              user_input = function_results
              previous_id = interaction.id

          print(interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import { GoogleGenAI } from "@google/genai";

          const ai = new GoogleGenAI({});

          const weatherTool = {
            type: "function",
            name: "get_current_temperature",
            description: "Gets the current temperature for a given location.",
            parameters: {
              type: "object",
              properties: {
                location: {
                  type: "string",
                  description: "The city name, e.g. San Francisco",
                },
              },
              required: ["location"],
            },
          };

          const availableFunctions = {
            get_current_temperature: ({ location }) => ({
              location, temperature: "22", unit: "celsius"
            }),
          };

          let input = "What is the temperature in London?";
          let previousId = null;
          let interaction;

          while (true) {
            interaction = await ai.interactions.create({
              model: "gemini-4-hydrogen",
              input,
              tools: [weatherTool],
              previous_interaction_id: previousId,
            });

            const functionResults = [];
            for (const step of interaction.steps) {
              if (step.type === "function_call") {
                const result = availableFunctions[step.name](step.arguments);
                console.log(`Called ${step.name}(${JSON.stringify(step.arguments)}) →`, result);
                functionResults.push({
                  type: "function_result",
                  name: step.name,
                  call_id: step.id,
                  result: [{ type: "text", text: JSON.stringify(result) }],
                });
              }
            }

            if (functionResults.length === 0) break;

            input = functionResults;
            previousId = interaction.id;
          }

          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.Function;
          import com.google.genai.gaos.models.interactions.FunctionCallStep;
          import com.google.genai.gaos.models.interactions.FunctionResultStep;
          import com.google.genai.gaos.models.interactions.FunctionResultStepResultUnion;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.Model;
          import com.google.genai.gaos.models.interactions.Step;
          import com.google.genai.gaos.models.interactions.TextContent;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import java.util.ArrayList;
          import java.util.Arrays;
          import java.util.Collections;
          import java.util.HashMap;
          import java.util.List;
          import java.util.Map;

          Client client = new Client();

          Map<String, Object> locationProp = new HashMap<>();
          locationProp.put("type", "string");
          locationProp.put("description", "The city name, e.g. San Francisco");

          Map<String, Object> properties = new HashMap<>();
          properties.put("location", locationProp);

          Map<String, Object> parameters = new HashMap<>();
          parameters.put("type", "object");
          parameters.put("properties", properties);
          parameters.put("required", Arrays.asList("location"));

          Function weatherTool =
              Function.builder()
                  .name("get_current_temperature")
                  .description("Gets the current temperature for a given location.")
                  .parameters(parameters)
                  .build();

          InteractionsInput userInput = InteractionsInput.of("What is the temperature in London?");
          String previousId = null;
          Interaction interaction = null;

          while (true) {
            CreateModelInteraction.Builder paramsBuilder =
                CreateModelInteraction.builder()
                    .model(Model.of("gemini-4-hydrogen"))
                    .input(userInput)
                    .tools(Arrays.asList(weatherTool));
            if (previousId != null) {
              paramsBuilder.previousInteractionId(previousId);
            }

            interaction =
                client.interactions.create(CreateInteractionRequestBody.of(paramsBuilder.build())).interaction().get();

            List<Step> functionResults = new ArrayList<>();
            for (Step step : interaction.steps().orElse(Collections.emptyList())) {
              if (step instanceof FunctionCallStep fcStep) {
                String resultJson = "{\"location\": \"London\", \"temperature\": \"22\", \"unit\": \"celsius\"}";
                System.out.printf(
                    "Called %s(%s) -> %s%n",
                    fcStep.name().orElse(""), fcStep.arguments().orElse(Collections.emptyMap()), resultJson);
                functionResults.add(
                    FunctionResultStep.builder()
                        .name(fcStep.name().orElse(""))
                        .callId(fcStep.id().orElse(""))
                        .result(
                            FunctionResultStepResultUnion.of(
                                Arrays.asList(TextContent.builder().text(resultJson).build())))
                        .build());
              }
            }

            if (functionResults.isEmpty()) {
              break;
            }

            userInput = InteractionsInput.ofStep(functionResults);
            previousId = interaction.id().orElse(null);
          }

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

              // Turn 1: Create a CSV file in the sandbox
              turn1, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                  Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Write a Python script to save a CSV file 'sales.csv' with 5 rows of sample data."),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.CodeExecution{}),
                      },
                  }),
              })
              if err != nil {
                  log.Fatal(err)
              }

              var env *interactions.CreateModelInteractionEnvironment
              if turn1.Interaction.EnvironmentID != nil {
                  env = genai.Ptr(interactions.NewCreateModelInteractionEnvironment(*turn1.Interaction.EnvironmentID))
              }

              // Turn 2: Reuse the sandbox environment to analyze the file created in Turn 1
              turn2, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                  Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                      Model:                 interactions.Model("gemini-4-hydrogen"),
                      PreviousInteractionID: turn1.Interaction.ID,
                      Environment:           env,
                      Input:                 interactions.NewInteractionsInput("Now read 'sales.csv' and compute the total revenue."),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.CodeExecution{}),
                      },
                  }),
              })
              if err != nil {
                  log.Fatal(err)
              }

              if turn2.Interaction.OutputText != nil {
                  fmt.Println(*turn2.Interaction.OutputText)
              }
          }
          ```

    === "REST"

          ```bash
          # Turn 1: Send prompt with function declaration
          RESPONSE1=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H 'Content-Type: application/json' \
            -H "Api-Revision: 2026-05-20" \
            -d '{
              "model": "gemini-4-hydrogen",
              "input": "What is the temperature in London?",
              "tools": [{
                "type": "function",
                "name": "get_current_temperature",
                "description": "Gets the current temperature for a given location.",
                "parameters": {
                  "type": "object",
                  "properties": {
                    "location": {"type": "string", "description": "The city name"}
                  },
                  "required": ["location"]
                }
              }]
            }')

          INTERACTION_ID=$(echo "$RESPONSE1" | jq -r '.id')
          FC_NAME=$(echo "$RESPONSE1" | jq -r '.steps[] | select(.type=="function_call") | .name')
          FC_ID=$(echo "$RESPONSE1" | jq -r '.steps[] | select(.type=="function_call") | .id')
          echo "Function: $FC_NAME, Call ID: $FC_ID"

          # Turn 2: Send function result back
          curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H 'Content-Type: application/json' \
            -H "Api-Revision: 2026-05-20" \
            -d '{
              "model": "gemini-4-hydrogen",
              "previous_interaction_id": "'$INTERACTION_ID'",
              "input": [{
                "type": "function_result",
                "name": "'$FC_NAME'",
                "call_id": "'$FC_ID'",
                "result": [{"type": "text", "text": "{\"location\": \"London\", \"temperature\": \"22\", \"unit\": \"celsius\"}"}]
              }],
              "tools": [{
                "type": "function",
                "name": "get_current_temperature",
                "description": "Gets the current temperature for a given location.",
                "parameters": {
                  "type": "object",
                  "properties": {
                    "location": {"type": "string", "description": "The city name"}
                  },
                  "required": ["location"]
                }
              }]
            }'
          ```

=== "Code"

      你也可以在無狀態模式下使用函式呼叫：在用戶端管理對話歷史，並
        設定 `store=false`。在無狀態模式中，後續每個請求都必須在
        `input` 欄位傳入完整的對話歷史，其中必須包含：

      1.  初始的 `user_input` 步驟。
      2.  第一輪回傳的所有模型生成步驟（包括 `thought` 與
          `function_call` 步驟），須依原樣傳入。
      3.  包含函式執行結果的 `function_result` 步驟。


    === "Python"

          ```python
          import json
          from google import genai

          client = genai.Client()

          weather_tool = {
              "type": "function",
              "name": "get_current_temperature",
              "description": "Gets the current temperature for a given location.",
              "parameters": {
                  "type": "object",
                  "properties": {
                      "location": {
                          "type": "string",
                          "description": "The city name, e.g. San Francisco",
                      },
                  },
                  "required": ["location"],
              },
          }

          available_functions = {
              "get_current_temperature": lambda location: {
                  "location": location, "temperature": "22", "unit": "celsius"
              },
          }

          history = [
              {
                  "type": "user_input",
                  "content": [{"type": "text", "text": "What is the temperature in London?"}]
              }
          ]

          while True:
              interaction = client.interactions.create(
                  model="gemini-4-hydrogen",
                  store=False,
                  input=history,
                  tools=[weather_tool],
              )

              function_results = []
              for step in interaction.steps:
                  history.append(step.model_dump())
                  if step.type == "function_call":
                      result = available_functions[step.name](**step.arguments)
                      print(f"Called {step.name}({step.arguments}) → {result}")
                      fn_result = {
                          "type": "function_result",
                          "name": step.name,
                          "call_id": step.id,
                          "result": [{"type": "text", "text": json.dumps(result)}],
                      }
                      function_results.append(fn_result)
                      history.append(fn_result)

              if not function_results:
                  break

          print(interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import { GoogleGenAI } from "@google/genai";

          const ai = new GoogleGenAI({});

          const weatherTool = {
            type: "function",
            name: "get_current_temperature",
            description: "Gets the current temperature for a given location.",
            parameters: {
              type: "object",
              properties: {
                location: {
                  type: "string",
                  description: "The city name, e.g. San Francisco",
                },
              },
              required: ["location"],
            },
          };

          const availableFunctions = {
            get_current_temperature: ({ location }) => ({
              location, temperature: "22", unit: "celsius"
            }),
          };

          const history = [
            {
              type: "user_input",
              content: [{ type: "text", text: "What is the temperature in London?" }]
            }
          ];

          let interaction;

          while (true) {
            interaction = await ai.interactions.create({
              model: "gemini-4-hydrogen",
              store: false,
              input: history,
              tools: [weatherTool],
            });

            const functionResults = [];
            for (const step of interaction.steps) {
              history.push(step);
              if (step.type === "function_call") {
                const result = availableFunctions[step.name](step.arguments);
                console.log(`Called ${step.name}(${JSON.stringify(step.arguments)}) →`, result);
                const fnResult = {
                  type: "function_result",
                  name: step.name,
                  call_id: step.id,
                  result: [{ type: "text", text: JSON.stringify(result) }],
                };
                functionResults.push(fnResult);
                history.push(fnResult);
              }
            }

            if (functionResults.length === 0) break;
          }

          console.log(interaction.output_text);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.interactions.CreateModelInteraction;
          import com.google.genai.gaos.models.interactions.Function;
          import com.google.genai.gaos.models.interactions.FunctionCallStep;
          import com.google.genai.gaos.models.interactions.FunctionResultStep;
          import com.google.genai.gaos.models.interactions.FunctionResultStepResultUnion;
          import com.google.genai.gaos.models.interactions.Interaction;
          import com.google.genai.gaos.models.interactions.InteractionsInput;
          import com.google.genai.gaos.models.interactions.Model;
          import com.google.genai.gaos.models.interactions.Step;
          import com.google.genai.gaos.models.interactions.TextContent;
          import com.google.genai.gaos.models.interactions.UserInputStep;
          import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
          import java.util.ArrayList;
          import java.util.Arrays;
          import java.util.Collections;
          import java.util.HashMap;
          import java.util.List;
          import java.util.Map;

          Client client = new Client();

          Map<String, Object> locationProp = new HashMap<>();
          locationProp.put("type", "string");
          locationProp.put("description", "The city name, e.g. San Francisco");

          Map<String, Object> properties = new HashMap<>();
          properties.put("location", locationProp);

          Map<String, Object> parameters = new HashMap<>();
          parameters.put("type", "object");
          parameters.put("properties", properties);
          parameters.put("required", Arrays.asList("location"));

          Function weatherTool =
              Function.builder()
                  .name("get_current_temperature")
                  .description("Gets the current temperature for a given location.")
                  .parameters(parameters)
                  .build();

          List<Step> history = new ArrayList<>();
          history.add(
              UserInputStep.builder()
                  .content(Arrays.asList(TextContent.builder().text("What is the temperature in London?").build()))
                  .build());

          Interaction interaction = null;

          while (true) {
            CreateModelInteraction params =
                CreateModelInteraction.builder()
                    .model(Model.of("gemini-4-hydrogen"))
                    .store(false)
                    .input(InteractionsInput.ofStep(history))
                    .tools(Arrays.asList(weatherTool))
                    .build();

            interaction =
                client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

            List<Step> functionResults = new ArrayList<>();
            for (Step step : interaction.steps().orElse(Collections.emptyList())) {
              history.add(step);
              if (step instanceof FunctionCallStep fcStep) {
                String resultJson = "{\"location\": \"London\", \"temperature\": \"22\", \"unit\": \"celsius\"}";
                System.out.printf(
                    "Called %s(%s) -> %s%n",
                    fcStep.name().orElse(""), fcStep.arguments().orElse(Collections.emptyMap()), resultJson);
                FunctionResultStep fnResult =
                    FunctionResultStep.builder()
                        .name(fcStep.name().orElse(""))
                        .callId(fcStep.id().orElse(""))
                        .result(
                            FunctionResultStepResultUnion.of(
                                Arrays.asList(TextContent.builder().text(resultJson).build())))
                        .build();
                functionResults.add(fnResult);
                history.add(fnResult);
              }
            }

            if (functionResults.isEmpty()) {
              break;
            }
          }

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

              recipeSchema := map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "recipe_name":       map[string]any{"type": "string"},
                      "prep_time_minutes": map[string]any{"type": "integer"},
                      "ingredients": map[string]any{
                          "type":  "array",
                          "items": map[string]any{"type": "string"},
                      },
                  },
                  "required": []string{"recipe_name", "prep_time_minutes", "ingredients"},
              }

              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                  Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Give me a quick recipe for chocolate chip cookies."),
                      ResponseFormat: genai.Ptr(interactions.NewCreateModelInteractionResponseFormat(
                          interactions.NewResponseFormat(interactions.TextResponseFormat{
                              MimeType: interactions.TextResponseFormatMimeTypeApplicationJSON.ToPointer(),
                              Schema:   recipeSchema,
                          }),
                      )),
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
          # Turn 1: Send request with tools and store: false
          RESPONSE1=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H 'Content-Type: application/json' \
            -H "Api-Revision: 2026-05-20" \
            -d '{
              "model": "gemini-4-hydrogen",
              "store": false,
              "input": [
                {
                  "type": "user_input",
                  "content": "What is the temperature in London?"
                }
              ],
              "tools": [{
                "type": "function",
                "name": "get_current_temperature",
                "description": "Gets the current temperature for a given location.",
                "parameters": {
                  "type": "object",
                  "properties": {
                    "location": {"type": "string", "description": "The city name"}
                  },
                  "required": ["location"]
                }
              }]
            }')

          # Extract model steps (thought, function_call)
          MODEL_STEPS=$(echo "$RESPONSE1" | jq '.steps')
          FC_NAME=$(echo "$RESPONSE1" | jq -r '.steps[] | select(.type=="function_call") | .name')
          FC_ID=$(echo "$RESPONSE1" | jq -r '.steps[] | select(.type=="function_call") | .id')
          echo "Function: $FC_NAME, Call ID: $FC_ID"

          # Assume local execution returns:
          RESULT="{\"location\": \"London\", \"temperature\": \"22\", \"unit\": \"celsius\"}"

          # Reconstruct history for Turn 2
          HISTORY=$(jq -n \
            --argjson first_input '[{"type": "user_input", "content": "What is the temperature in London?"}]' \
            --argjson model_steps "$MODEL_STEPS" \
            --arg fc_name "$FC_NAME" \
            --arg fc_id "$FC_ID" \
            --arg result "$RESULT" \
            '$first_input + $model_steps + [{"type": "function_result", "name": $fc_name, "call_id": $fc_id, "result": [{"type": "text", "text": $result}]}]')

          # Turn 2: Send the full history
          curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H 'Content-Type: application/json' \
            -H "Api-Revision: 2026-05-20" \
            -d "{
              \"model\": \"gemini-4-hydrogen\",
              \"store\": false,
              \"input\": $HISTORY,
              \"tools\": [{
                \"type\": \"function\",
                \"name\": \"get_current_temperature\",
                \"description\": \"Gets the current temperature for a given location.\",
                \"parameters\": {
                  \"type\": \"object\",
                  \"properties\": {
                    \"location\": {\"type\": \"string\", \"description\": \"The city name\"}
                  },
                  \"required\": [\"location\"]
                }
              }]
            }"
          ```

          **回應**：

          在第一輪中，模型會回傳狀態為 `requires_action` 的回應，其中
                包含 `function_call` 步驟：

          ```json
          {
            "id": "v1_Chd...",
            "status": "requires_action",
            "steps": [
              {
                "type": "function_call",
                "id": "call_abc123",
                "name": "get_current_temperature",
                "arguments": {
                  "location": "London"
                }
              }
            ],
            "object": "interaction",
            "model": "gemini-4-hydrogen"
          }
          ```

          在本機執行函式並送回結果（第二輪）後，最終完成的互動會回傳：

          ```json
          {
            "id": "v1_Chd...",
            "status": "completed",
            "steps": [
              {
                "type": "function_call",
                "id": "call_abc123",
                "name": "get_current_temperature",
                "arguments": {
                  "location": "London"
                }
              },
              {
                "type": "model_output",
                "content": [
                  {
                    "type": "text",
                    "text": "The temperature in London is currently 22°C."
                  }
                ]
              }
            ],
            "object": "interaction",
            "model": "gemini-4-hydrogen",
          }
          ```


如需平行函式呼叫或函式選擇模式等進階功能，請參閱[函式呼叫指南](/docs/function-calling/)。

## 10. 執行託管代理 {#10-run-a-managed-agent}

託管代理在遠端沙箱中執行，可使用程式碼執行、檔案管理等工具。傳入
`agent` 而非 `model`，並設定 `environment="remote"`。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input="Write a Python script that generates the first 20 Fibonacci numbers and saves them to fibonacci.txt. Then read the file and print its contents.",
          environment="remote",
      )
      print(f"Environment: {interaction.environment_id}")
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await ai.interactions.create({
        agent: "antigravity-preview-09-2026",
        input: "Write a Python script that generates the first 20 Fibonacci numbers and saves them to fibonacci.txt. Then read the file and print its contents.",
        environment: "remote",
      });
      console.log(`Environment: ${interaction.environment_id}`);
      console.log(interaction.output_text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent("antigravity-preview-09-2026")
              .input(
                  InteractionsInput.of(
                      "Write a Python script that generates the first 20 Fibonacci numbers and saves them to fibonacci.txt. Then read the file and print its contents."))
              .environment(CreateAgentInteractionEnvironment.of("remote"))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      System.out.println("Environment: " + interaction.environmentId().orElse(""));
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
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Solve this logic puzzle: Three gods A, B, and C are called True, False, and Random..."),
                  GenerationConfig: &interactions.GenerationConfig{
                      ThinkingLevel:     interactions.ThinkingLevelHigh.ToPointer(),
                      ThinkingSummaries: interactions.ThinkingSummariesAuto.ToPointer(),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          // Print thought summaries if returned
          for _, step := range res.Interaction.Steps {
              if thought := step.ThoughtStep; thought != nil {
                  for _, part := range thought.Summary {
                      if part.TextContent != nil {
                          fmt.Printf("Thought Summary: %s\n", part.TextContent.Text)
                      }
                  }
              }
          }

          if res.Interaction.OutputText != nil {
              fmt.Printf("Answer: %s\n", *res.Interaction.OutputText)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Write a Python script that generates the first 20 Fibonacci numbers and saves them to fibonacci.txt. Then read the file and print its contents.",
          "environment": "remote"
        }'
      ```

=== "CLI"

      ```bash
      gemini-api agent run "Write a Python script that generates the first 20 Fibonacci numbers and saves them to fibonacci.txt. Then read the file and print its contents." \
        --agent antigravity-preview-09-2026 \
        --body '{"environment": "remote"}'
      ```


你也可以定義並儲存[自訂代理](/docs/custom-agents/)，加入自己的指令、
技能與資料來源。


  

**[快速入門](/docs/managed-agents-quickstart/)**

發出第一次代理呼叫、串流回應，並建立自訂代理。


  

**[Antigravity Agent](/docs/antigravity-agent/)**

預設代理的功能、工具、多模態輸入與定價。


  

**[AI Studio 中的代理](/docs/aistudio-agents/)**

以視覺化 Playground 快速打造代理原型，無需撰寫程式碼。


## 11. 在背景執行工作 {#11-run-tasks-in-the-background}

設定 `background=True`，即可非同步執行長時間工作。使用
`interactions.get()` 輪詢結果。


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Write a detailed analysis of the impact of artificial intelligence on modern healthcare.",
          background=True,
      )
      print(f"Started background task: {interaction.id}")
      print(f"Status: {interaction.status}")

      # Poll for completion
      while True:
          result = client.interactions.get(interaction.id)
          print(f"Status: {result.status}")
          if result.status == "completed":
              print(f"\nResult:\n{result.output_text}")
              break
          elif result.status == "failed":
              print(f"Failed: {result.error}")
              break
          time.sleep(5)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: "Write a detailed analysis of the impact of artificial intelligence on modern healthcare.",
        background: true,
      });
      console.log(`Started background task: ${interaction.id}`);
      console.log(`Status: ${interaction.status}`);

      // Poll for completion
      while (true) {
        const result = await ai.interactions.get(interaction.id);
        console.log(`Status: ${result.status}`);
        if (result.status === "completed") {
          console.log(`\nResult:\n${result.output_text}`);
          break;
        } else if (result.status === "failed") {
          console.log(`Failed: ${JSON.stringify(result.errors)}`);
          break;
        }
        await new Promise(r => setTimeout(r, 5000));
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionStatus;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.GetInteractionByIdRequest;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(
                  InteractionsInput.of(
                      "Write a detailed analysis of the impact of artificial intelligence on modern healthcare."))
              .background(true)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      String interactionId = interaction.id().orElse("");
      System.out.println("Started background task: " + interactionId);
      System.out.println("Status: " + interaction.status().map(InteractionStatus::value).orElse(""));

      // Poll for completion
      while (true) {
        Interaction result =
            client.interactions.get(new GetInteractionByIdRequest(interactionId)).interaction().get();
        String status = result.status().map(InteractionStatus::value).orElse("");
        System.out.println("Status: " + status);
        if ("completed".equals(status)) {
          System.out.println("\nResult:\n" + result.outputText().orElse(""));
          break;
        } else if ("failed".equals(status)) {
          System.out.println("Failed: " + result.errors().orElse(null));
          break;
        }
        Thread.sleep(5000);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "time"

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

          // Start a Deep Research agent in the background
          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent:      interactions.AgentOption("deep-research-preview-04-2026"),
                  Input:      interactions.NewInteractionsInput("Research the competitive landscape of solid-state EV batteries in 2026."),
                  Background: genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          interaction := res.Interaction
          fmt.Printf("Started research job: %s\n", *interaction.ID)

          // Poll until completion
          for interaction.Status != interactions.InteractionStatusCompleted && interaction.Status != interactions.InteractionStatusFailed {
              time.Sleep(10 * time.Second)
              getRes, err := client.Interactions.Get(ctx, operations.GetInteractionByIDRequest{
                  ID: *interaction.ID,
              })
              if err != nil {
                  log.Fatal(err)
              }
              interaction = getRes.Interaction
              fmt.Printf("Current status: %s\n", interaction.Status)
          }

          if interaction.Status == interactions.InteractionStatusCompleted {
              if interaction.OutputText != nil {
                  fmt.Println(*interaction.OutputText)
              }
          } else {
              fmt.Printf("Research failed: %v\n", interaction.Errors)
          }
      }
      ```

=== "REST"

      ```bash
      # Start a background task
      RESPONSE=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Write a detailed analysis of the impact of artificial intelligence on modern healthcare.",
          "background": true
        }')

      INTERACTION_ID=$(echo "$RESPONSE" | jq -r '.id')
      echo "Started background task: $INTERACTION_ID"

      # Poll for completion
      while true; do
        RESULT=$(curl -s "https://generativelanguage.googleapis.com/v1beta/interactions/$INTERACTION_ID" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H "Api-Revision: 2026-05-20")
        STATUS=$(echo "$RESULT" | jq -r '.status')
        echo "Status: $STATUS"
        if [ "$STATUS" = "completed" ]; then
          echo "$RESULT" | jq -r '.steps[] | select(.type=="model_output") | .content[] | select(.type=="text") | .text'
          break
        elif [ "$STATUS" = "failed" ]; then
          echo "Failed"
          break
        fi
        sleep 5
      done
      ```

      **回應**：

      初始回應會立即回傳，狀態為 `in_progress`：

      ```json
      {
        "id": "v1_abc123",
        "status": "in_progress",
        "object": "interaction",
        "model": "gemini-4-hydrogen"
      }
      ```

      背景工作完整執行完畢後，查詢互動狀態會回傳：

      ```json
      {
        "id": "v1_abc123",
        "status": "completed",
        "steps": [
          {
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "Artificial intelligence has transformed modern healthcare in several..."
              }
            ]
          }
        ],
        "object": "interaction",
        "model": "gemini-4-hydrogen",
      }
      ```

=== "CLI"

      ```bash
      INTERACTION_ID=$(gemini-api agent run "Write a detailed analysis of the impact of artificial intelligence on modern healthcare." \
        -m gemini-4-hydrogen --background --stream=false --jq '.id')
      echo "Started background task: $INTERACTION_ID"
      # Re-run until the status is "completed"
      gemini-api agent status "$INTERACTION_ID"
      ```


如需了解如何非同步執行模型與代理，請參閱[背景執行指南](/docs/background-execution/)。

## 後續步驟 {#whats-next}

-   [文字生成](/docs/text-generation/)：系統指令、生成設定與進階文字
    模式。
-   [圖片生成](/docs/image-generation/)：長寬比、圖片編輯與風格參考。
-   [圖片理解](/docs/image-understanding/)：分類、物件偵測與視覺問答。
-   [思考](/docs/thinking/)：運用思維鏈推理處理複雜任務。
-   [函式呼叫](/docs/function-calling/)：平行、組合與受限的函式模式。
-   [Google Search](/docs/google-search/)：接地、引用與搜尋建議。
-   [託管代理](/docs/managed-agents-quickstart/)：預建代理，具備程式碼
    執行與檔案管理功能。
-   [Deep Research](/docs/deep-research/)：自主多步驟研究，含規劃與
    綜整。
-   [結構化輸出](/docs/structured-output/)：JSON 結構定義、列舉與遞迴
    型別定義。
