# 遷移至 Interactions API

本指南協助你從 `generateContent` API 遷移至 Interactions
API。

Interactions API 是使用 Gemini 開發的標準介面，針對
代理工作流程、伺服器端狀態管理，以及複雜的多模態、
多輪對話最佳化，同時也完整支援簡單的無狀態單輪
要求。雖然 `generateContent` 仍受到完整支援，
我們仍建議所有新開發工作都採用 Interactions API。


!!! note " "

      **使用程式設計代理自動完成遷移。** 如果你使用的
      程式設計代理支援技能（例如 Gemini CLI 或 Jules），請安裝
      [Gemini API 技能](/docs/coding-agents/#gemini-api-dev)，並執行：

      `/gemini-api-dev migrate my app to the interactions api`

      該技能會套用本指南所述的 API 變更。


### 為什麼要遷移？ {#why-migrate}

Interactions API 提供更結構化且更強大的方式，讓你使用 Gemini
進行開發：

* **伺服器端歷史記錄管理**：透過
  `previous_interaction_id` 簡化多輪流程。伺服器預設啟用狀態保存（`store=true`），
  你也可以設定 `store=false`，改採無狀態行為。
* **可觀察的執行步驟**：具型別的步驟讓你輕鬆除錯複雜
  流程，並為中間事件（例如思考過程或搜尋小工具）呈現 UI。
* **專為代理工作流程打造**：原生支援多步驟工具使用、
  協調編排與複雜的推理流程，皆透過具型別的執行步驟實現。
* **長時間執行與背景工作**：支援將 Deep Think、Deep Research
  等耗時作業卸載至背景行程執行，方法是使用
  `background=true`。

## 基本輸入/輸出 {#basic-input-output}

本節說明如何遷移簡單的文字生成要求。

### 變更前（generateContent） {#before-generatecontent}

`generateContent` API 為無狀態 API，會直接傳回回應。
其回應結構將輸出包裝在 `candidates` 清單中，每個候選項都包含
`content`，其中含有待剖析的 `parts` 清單。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      response = client.models.generate_content(
          model="gemini-4-hydrogen", contents="Tell me a joke."
      )
      print(response.text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const ai = new GoogleGenAI({});

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: "Tell me a joke.",
      });
      console.log(response.text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateContentResponse;

      Client client = new Client();

      GenerateContentResponse response =
          client.models.generateContent("gemini-2.5-flash-lite", "Tell me a joke.", null);
      System.out.println(response.text());
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          response, err := client.Models.GenerateContent(
              ctx,
              "gemini-2.5-flash-lite",
              genai.Text("Tell me a joke."),
              nil,
          )
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(response.Text())
      }
      ```

=== "REST"

      ```json
      # Request
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:generateContent" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          {{ '**' }}"contents": [{
              "parts": [{
                  "text": "Tell me a joke."
              }]
          }]{{ '**' }}
      }'

      # Response
      {
        {{ '**' }}"candidates": [
          {
            "content": {
              "parts": [
                {
                  "text": "Why did the chicken cross the road? To get to the other side!"
                }
              ],
              "role": "model"
            },
            "finishReason": "STOP",
            "index": 0
          }
        ]{{ '**' }},
        "usageMetadata": {
          "promptTokenCount": 4,
          "candidatesTokenCount": 12,
          "totalTokenCount": 16
        }
      }
      ```


Interactions API 會傳回已儲存的互動資源，其中包含 `steps`
時間軸。你可以手動檢查 `steps` 陣列，找出中間
事件；不過 Google GenAI SDK 也在傳回的 `Interaction` 物件上
直接提供便利屬性，讓你存取最終輸出。

最常用的便利屬性是 **`.output_text`**（String），它會
自動擷取並串連模型回應結尾處連續的 `TextContent`
區塊。這個屬性對簡單回應非常好用，
但不會包含先前被非文字內容（例如思考過程、圖片、
音訊或工具呼叫）隔開的文字區塊。若是複雜或交錯的
多模態回應，你必須改為手動逐一處理 `steps`。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen", input="Tell me a joke."
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      let interaction = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          input: 'Tell me a joke.'
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

      CreateModelInteraction request =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Tell me a joke."))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(request)).interaction().get();

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
                  Input: interactions.NewInteractionsInput("Tell me a joke."),
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

      ```json
      # Request
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "model": "gemini-4-hydrogen",
          {{ '**' }}"input": "Tell me a joke."{{ '**' }}
      }'

      # Response
      {
        "id": "int_123",
        "status": "completed",
        {{ '**' }}"steps": [
          {
            "type": "user_input",
            "status": "done",
            "content": [
              {
                "type": "text",
                "text": "Tell me a joke."
              }
            ]
          },
          {
            "type": "model_output",
            "status": "done",
            "content": [
              {
                "type": "text",
                "text": "Why did the chicken cross the road?"
              }
            ]
          }
        ]{{ '**' }}
      }
      ```


## 多輪對話 {#multi-turn-conversations}

Interactions API 預設會儲存互動，藉此在伺服器端管理
多輪對話的狀態。

### 變更前（generateContent） {#before-generatecontent}

使用 `generateContent` 時，你必須透過 `contents` 陣列
或用戶端聊天輔助工具，手動管理對話歷史記錄。


=== "Python"

      **使用聊天輔助工具（建議）**

      ```python
      from google import genai

      client = genai.Client()

      chat = client.chats.create(model="gemini-4-hydrogen")
      response1 = chat.send_message("Hi, my name is Phil.")
      print(response1.text)

      response2 = chat.send_message("What is my name?")
      print(response2.text)
      ```

      **手動管理歷史記錄**

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client()

      response = client.models.generate_content(
          model="gemini-4-hydrogen",
          contents=[
              types.Content(
                  role="user", parts=[types.Part.from_text("Hi, my name is Phil.")]
              ),
              types.Content(
                  role="model",
                  parts=[types.Part.from_text("Hi Phil, how can I help you?")],
              ),
              types.Content(
                  role="user", parts=[types.Part.from_text("What is my name?")]
              ),
          ],
      )
      print(response.text)
      ```

=== "JavaScript"

      **使用聊天輔助工具（建議）**

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const chat = client.chats.create({ model: 'gemini-4-hydrogen' });
      let response = await chat.sendMessage({ message: 'Hi, my name is Phil.' });
      console.log(response.text);

      response = await chat.sendMessage({ message: 'What is my name?' });
      console.log(response.text);
      ```

      **手動管理歷史記錄**

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const response = await client.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: [
              { role: 'user', parts: [{ text: 'Hi, my name is Phil.' }] },
              { role: 'model', parts: [{ text: 'Hi Phil, how can I help you?' }] },
              { role: 'user', parts: [{ text: 'What is my name?' }] }
          ]
      });
      console.log(response.text);
      ```

=== "Java"

      ```java
      import com.google.genai.Chat;
      import com.google.genai.Client;
      import com.google.genai.types.Content;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.Part;
      import java.util.Arrays;

      Client client = new Client();

      // Using the chat helper (recommended)
      Chat chat = client.chats.create("gemini-2.5-flash-lite");
      GenerateContentResponse response1 = chat.sendMessage("Hi, my name is Phil.");
      System.out.println(response1.text());

      GenerateContentResponse response2 = chat.sendMessage("What is my name?");
      System.out.println(response2.text());

      // Manually managing history
      GenerateContentResponse manualResponse =
          client.models.generateContent(
              "gemini-2.5-flash-lite",
              Arrays.asList(
                  Content.builder()
                      .role("user")
                      .parts(Arrays.asList(Part.fromText("Hi, my name is Phil.")))
                      .build(),
                  Content.builder()
                      .role("model")
                      .parts(Arrays.asList(Part.fromText("Hi Phil, how can I help you?")))
                      .build(),
                  Content.builder()
                      .role("user")
                      .parts(Arrays.asList(Part.fromText("What is my name?")))
                      .build()),
              null);
      System.out.println(manualResponse.text());
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          // Using the chat helper (recommended)
          chat, err := client.Chats.Create(ctx, "gemini-2.5-flash-lite", nil, nil)
          if err != nil {
              log.Fatal(err)
          }
          response1, err := chat.SendMessage(ctx, genai.Part{Text: "Hi, my name is Phil."})
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(response1.Text())

          response2, err := chat.SendMessage(ctx, genai.Part{Text: "What is my name?"})
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(response2.Text())

          // Manually managing history
          history := []*genai.Content{
              genai.NewContentFromText("Hi, my name is Phil.", genai.RoleUser),
              genai.NewContentFromText("Hi Phil, how can I help you?", genai.RoleModel),
              genai.NewContentFromText("What is my name?", genai.RoleUser),
          }
          manualResponse, err := client.Models.GenerateContent(ctx, "gemini-2.5-flash-lite", history, nil)
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(manualResponse.Text())
      }
      ```

=== "REST"

      ```json
      # Request (the second turn requires sending the entire history)
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:generateContent" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          {{ '**' }}"contents": [
              {"role": "user", "parts": [{"text": "Hi, my name is Phil."}]},
              {"role": "model", "parts": [{"text": "Hi Phil, how can I help you?"}]},
              {"role": "user", "parts": [{"text": "What is my name?"}]}
          ]{{ '**' }}
      }'

      # Response
      {
        {{ '**' }}"candidates": [
          {
            "content": {
              "parts": [
                {
                  "text": "Your name is Phil."
                }
              ],
              "role": "model"
            },
            "finishReason": "STOP",
            "index": 0
          }
        ]{{ '**' }}
      }
      ```


### 變更後（Interactions API） {#after-interactions-api}

Interactions API 在伺服器上管理狀態。你只要參照
`previous_interaction_id`，即可接續對話。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction1 = client.interactions.create(
          model="gemini-4-hydrogen", input="Hi, my name is Phil."
      )
      print("Response 1:", interaction1.output_text)

      interaction2 = client.interactions.create(
          model="gemini-4-hydrogen",
          previous_interaction_id=interaction1.id,
          input="What is my name?",
      )
      print("Response 2:", interaction2.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      let interaction = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          input: 'Hi, my name is Phil.'
      });
      console.log("Response 1:", interaction.output_text);

      interaction = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          previous_interaction_id: interaction.id,
          input: 'What is my name?'
      });
      console.log("Response 2:", interaction.output_text);
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

      CreateModelInteraction req1 =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Hi, my name is Phil."))
              .build();

      Interaction interaction1 =
          client.interactions.create(CreateInteractionRequestBody.of(req1)).interaction().get();
      System.out.println("Response 1: " + interaction1.outputText().orElse(""));

      CreateModelInteraction req2 =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .previousInteractionId(interaction1.id().orElse(""))
              .input(InteractionsInput.of("What is my name?"))
              .build();

      Interaction interaction2 =
          client.interactions.create(CreateInteractionRequestBody.of(req2)).interaction().get();
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

          res1, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Hi, my name is Phil."),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if res1.Interaction.OutputText != nil {
              fmt.Println("Response 1:", *res1.Interaction.OutputText)
          }

          res2, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:                 interactions.Model("gemini-4-hydrogen"),
                  PreviousInteractionID: res1.Interaction.ID,
                  Input:                 interactions.NewInteractionsInput("What is my name?"),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if res2.Interaction.OutputText != nil {
              fmt.Println("Response 2:", *res2.Interaction.OutputText)
          }
      }
      ```

=== "REST"

      ```json
      # First Request
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "model": "gemini-4-hydrogen",
          {{ '**' }}"input": "Hi, my name is Phil."{{ '**' }}
      }'

      # Second Request (using ID from first response)
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "model": "gemini-4-hydrogen",
          {{ '**' }}"previous_interaction_id": "int_123",
          "input": "What is my name?"{{ '**' }}
      }'

      # Response to Second Request
      {
        "id": "int_123",
        {{ '**' }}"steps": [
          {
            "type": "user_input",
            "status": "done",
            "content": [{ "type": "text", "text": "Hi, my name is Phil." }]
          },
          {
            "type": "model_output",
            "status": "done",
            "content": [{ "type": "text", "text": "Hello Phil! How can I help you today?" }]
          },
          {
            "type": "user_input",
            "status": "done",
            "content": [{ "type": "text", "text": "What is my name?" }]
          },
          {
            "type": "model_output",
            "status": "done",
            "content": [{ "type": "text", "text": "Your name is Phil." }]
          }
        ]{{ '**' }}
      }
      ```


## 多模態輸入 {#multimodal-inputs}

兩個 API 都支援多模態輸入（文字、圖片、影片等）。

### 變更前（generateContent） {#before-generatecontent}

使用 `generateContent` 時，你要將 `parts` 清單傳入 `contents` 陣列中。
回應會將輸出放在第一個候選項的 `parts` 中傳回。


=== "Python"

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client()

      with open("sample.jpg", "rb") as f:
          image_bytes = f.read()

      response = client.models.generate_content(
          model="gemini-4-hydrogen",
          contents=[
              types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
              "Describe this image.",
          ],
      )
      print(response.text)
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.Content;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.Part;
      import java.nio.file.Files;
      import java.nio.file.Paths;

      Client client = new Client();

      byte[] imageBytes = Files.readAllBytes(Paths.get("sample.jpg"));

      GenerateContentResponse response =
          client.models.generateContent(
              "gemini-2.5-flash-lite",
              Content.fromParts(
                  Part.fromBytes(imageBytes, "image/jpeg"), Part.fromText("Describe this image.")),
              null);
      System.out.println(response.text());
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "os"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          imageBytes, err := os.ReadFile("sample.jpg")
          if err != nil {
              log.Fatal(err)
          }

          contents := []*genai.Content{
              genai.NewContentFromParts([]*genai.Part{
                  genai.NewPartFromBytes(imageBytes, "image/jpeg"),
                  genai.NewPartFromText("Describe this image."),
              }, genai.RoleUser),
          }

          response, err := client.Models.GenerateContent(ctx, "gemini-2.5-flash-lite", contents, nil)
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(response.Text())
      }
      ```

=== "REST"

      ```json
      # Request
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:generateContent" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          {{ '**' }}"contents": [{
              "parts": [
                  {
                      "inlineData": {
                          "mimeType": "image/jpeg",
                          "data": "..."
                      }
                  },
                  {
                      "text": "Describe this image."
                  }
              ]
          }]{{ '**' }}
      }'

      # Response
      {
        {{ '**' }}"candidates": [
          {
            "content": {
              "parts": [
                {
                  "text": "This is a picture of a beautiful sunset."
                }
              ],
              "role": "model"
            }
          }
        ]{{ '**' }}
      }
      ```


### 變更後（Interactions API） {#after-interactions-api}

使用 Interactions API 時，你要將陣列傳入 `input` 欄位；
並在時間軸中找出 `model_output` 步驟，即可取得輸出內容。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      with open("sample.jpg", "rb") as f:
          image_bytes = f.read()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {
                  "type": "image",
                  "mime_type": "image/jpeg",
                  "data": image_bytes,
              },
              {"type": "text", "text": "Describe this image."},
          ],
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      import * as fs from 'fs';

      const client = new GoogleGenAI({});

      const imageBytes = fs.readFileSync('sample.jpg').toString('base64');

      const interaction = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          input: [
              {
                  type: 'image',
                  mime_type: 'image/jpeg',
                  data: imageBytes
              },
              {
                  type: 'text',
                  text: 'Describe this image.'
              }
          ]
      });
      console.log(interaction.output_text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;

      Client client = new Client();

      byte[] imageBytes = Files.readAllBytes(Paths.get("sample.jpg"));
      String base64ImageData = Base64.getEncoder().encodeToString(imageBytes);

      CreateModelInteraction request =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(
                  InteractionsInput.ofContent(
                      Arrays.asList(
                          ImageContent.builder()
                              .mimeType(ImageContentMimeType.IMAGE_JPEG)
                              .data(base64ImageData)
                              .build(),
                          TextContent.builder().text("Describe this image.").build())))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(request)).interaction().get();
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

          imageBytes, err := os.ReadFile("sample.jpg")
          if err != nil {
              log.Fatal(err)
          }
          base64ImageData := base64.StdEncoding.EncodeToString(imageBytes)

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.ImageContent{
                          MimeType: interactions.ImageContentMimeType("image/jpeg").ToPointer(),
                          Data:     genai.Ptr(base64ImageData),
                      }),
                      interactions.NewContent(interactions.TextContent{
                          Text: "Describe this image.",
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

      ```json
      # Request
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "model": "gemini-4-hydrogen",
          {{ '**' }}"input": [
              {
                  "type": "image",
                  "mime_type": "image/jpeg",
                  "data": "..."
              },
              {
                  "type": "text",
                  "text": "Describe this image."
              }
          ]{{ '**' }}
      }'

      # Response
      {
        "id": "int_multimodal",
        {{ '**' }}"steps": [
          {
            "type": "user_input",
            "status": "done",
            "content": [
              {
                "type": "image",
                "mime_type": "image/jpeg",
                "data": "..."
              },
              {
                "type": "text",
                "text": "Describe this image."
              }
            ]
          },
          {
            "type": "model_output",
            "status": "done",
            "content": [
              {
                "type": "text",
                "text": "This is a picture of a beautiful sunset over the mountains."
              }
            ]
          }
        ]{{ '**' }}
      }
      ```


## 結構化輸出 {#structured-output}

若要讓模型傳回符合特定結構定義的 JSON，請設定回應
格式。

### 變更前（generateContent） {#before-generatecontent}

使用 `generateContent` 時，輸出格式是透過 `response_mime_type`
與 `response_schema` 欄位來設定，這些欄位巢狀於 `config`（或 `generationConfig`）
物件中。


=== "Python"

      ```python
      from google import genai
      from google.genai import types
      from pydantic import BaseModel

      client = genai.Client()

      class Recipe(BaseModel):
          recipe_name: str
          ingredients: list[str]

      response = client.models.generate_content(
          model="gemini-2.5-flash-lite",
          contents="Give me a recipe for chocolate chip cookies.",
          config=types.GenerateContentConfig(
              response_mime_type="application/json",
              response_schema=Recipe,
          ),
      )
      print(response.text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI, Type } from '@google/genai';

      const ai = new GoogleGenAI({});

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          contents: 'Give me a recipe for chocolate chip cookies.',
          config: {
              responseMimeType: 'application/json',
              responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                      recipe_name: { type: Type.STRING },
                      ingredients: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                      },
                  },
                  required: ['recipe_name', 'ingredients'],
              },
          },
      });
      console.log(response.text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.Schema;
      import com.google.genai.types.Type;
      import java.util.Arrays;
      import java.util.Map;

      Client client = new Client();

      Schema recipeSchema =
          Schema.builder()
              .type(Type.Known.OBJECT)
              .properties(
                  Map.of(
                      "recipe_name", Schema.builder().type(Type.Known.STRING).build(),
                      "ingredients",
                          Schema.builder()
                              .type(Type.Known.ARRAY)
                              .items(Schema.builder().type(Type.Known.STRING).build())
                              .build()))
              .required(Arrays.asList("recipe_name", "ingredients"))
              .build();

      GenerateContentResponse response =
          client.models.generateContent(
              "gemini-2.5-flash-lite",
              "Give me a recipe for chocolate chip cookies.",
              GenerateContentConfig.builder()
                  .responseMimeType("application/json")
                  .responseSchema(recipeSchema)
                  .build());
      System.out.println(response.text());
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          recipeSchema := &genai.Schema{
              Type: genai.TypeObject,
              Properties: map[string]*genai.Schema{
                  "recipe_name": {Type: genai.TypeString},
                  "ingredients": {
                      Type:  genai.TypeArray,
                      Items: &genai.Schema{Type: genai.TypeString},
                  },
              },
              Required: []string{"recipe_name", "ingredients"},
          }

          response, err := client.Models.GenerateContent(
              ctx,
              "gemini-2.5-flash-lite",
              genai.Text("Give me a recipe for chocolate chip cookies."),
              &genai.GenerateContentConfig{
                  ResponseMIMEType: "application/json",
                  ResponseSchema:   recipeSchema,
              },
          )
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(response.Text())
      }
      ```

=== "REST"

      ```json
      # Request
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          {{ '**' }}"contents": [{
              "parts": [{
                  "text": "Give me a recipe for chocolate chip cookies."
              }]
          }],
          "generationConfig": {
              "responseMimeType": "application/json",
              "responseSchema": {
                  "type": "OBJECT",
                  "properties": {
                      "recipe_name": { "type": "STRING" },
                      "ingredients": {
                          "type": "ARRAY",
                          "items": { "type": "STRING" }
                      }
                  },
                  "required": ["recipe_name", "ingredients"]
              }
          }{{ '**' }}
      }'

      # Response
      {
        {{ '**' }}"candidates": [
          {
            "content": {
              "parts": [
                {
                  "text": "{\n \"recipe_name\": \"Chocolate Chip Cookies\",\n \"ingredients\": [\n \"1 cup butter\",\n \"1 cup sugar\",\n \"2 cups flour\",\n \"1 cup chocolate chips\"\n ]\n}"
                }
              ],
              "role": "model"
            }
          }
        ]{{ '**' }}
      }
      ```


### 變更後（Interactions API） {#after-interactions-api}

使用 Interactions API 時，輸出格式控制項改放在最上層的
`response_format` 欄位。請傳入單一格式物件；若要求多種
輸出類型，則傳入格式物件陣列。


=== "Python"

      ```python
      from google import genai
      from pydantic import BaseModel

      client = genai.Client()

      class Recipe(BaseModel):
          recipe_name: str
          ingredients: list[str]

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Give me a recipe for chocolate chip cookies.",
          response_format={
              "type": "text",
              "mime_type": "application/json",
              "schema": Recipe.model_json_schema(),
          },
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          input: 'Give me a recipe for chocolate chip cookies.',
          response_format: {
              type: 'text',
              mime_type: 'application/json',
              schema: {
                  type: 'object',
                  properties: {
                      recipe_name: { type: 'string' },
                      ingredients: {
                          type: 'array',
                          items: { type: 'string' }
                      }
                  },
                  required: ['recipe_name', 'ingredients']
              }
          }
      });
      console.log(interaction.output_text);
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

      Map<String, Object> properties = new HashMap<>();
      properties.put("recipe_name", Map.of("type", "string"));
      properties.put("ingredients", Map.of("type", "array", "items", Map.of("type", "string")));

      Map<String, Object> schema = new HashMap<>();
      schema.put("type", "object");
      schema.put("properties", properties);
      schema.put("required", Arrays.asList("recipe_name", "ingredients"));

      CreateModelInteraction request =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Give me a recipe for chocolate chip cookies."))
              .responseFormat(
                  CreateModelInteractionResponseFormat.of(
                      ResponseFormat.of(
                          TextResponseFormat.builder()
                              .mimeType(TextResponseFormatMimeType.APPLICATION_JSON)
                              .schema(schema)
                              .build())))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(request)).interaction().get();
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

          schema := map[string]any{
              "type": "object",
              "properties": map[string]any{
                  "recipe_name": map[string]any{"type": "string"},
                  "ingredients": map[string]any{
                      "type":  "array",
                      "items": map[string]any{"type": "string"},
                  },
              },
              "required": []string{"recipe_name", "ingredients"},
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Give me a recipe for chocolate chip cookies."),
                  ResponseFormat: genai.Ptr(interactions.NewCreateModelInteractionResponseFormat(
                      interactions.NewResponseFormat(interactions.TextResponseFormat{
                          MimeType: interactions.TextResponseFormatMimeType("application/json").ToPointer(),
                          Schema:   schema,
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

      ```json
      # Request
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "model": "gemini-4-hydrogen",
          {{ '**' }}"input": "Give me a recipe for chocolate chip cookies.",
          "response_format": {
              "type": "text",
              "mime_type": "application/json",
              "schema": {
                  "type": "object",
                  "properties": {
                      "recipe_name": { "type": "string" },
                      "ingredients": {
                          "type": "array",
                          "items": { "type": "string" }
                      }
                  },
                  "required": ["recipe_name", "ingredients"]
              }
          }{{ '**' }}
      }'

      # Response
      {
        "id": "int_structured",
        {{ '**' }}"steps": [
          {
            "type": "user_input",
            "status": "done",
            "content": [{ "type": "text", "text": "Give me a recipe for chocolate chip cookies." }]
          },
          {
            "type": "model_output",
            "status": "done",
            "content": [
              {
                "type": "text",
                "text": "{\n \"recipe_name\": \"Chocolate Chip Cookies\",\n \"ingredients\": [\n \"1 cup butter\",\n \"1 cup sugar\",\n \"2 cups flour\",\n \"1 cup chocolate chips\"\n ]\n}"
              }
            ]
          }
        ]{{ '**' }}
      }
      ```


## 多模態生成 {#multimodal-generation}

生成文字以外的模態內容（例如圖片或音訊）時，
主要差異在於回應如何組織所生成的媒體內容。

### 變更前（generateContent） {#before-generatecontent}

使用 `generateContent` 時，回應會將生成的媒體直接放在候選項的
`parts` 中傳回，通常是以 `inlineData` 形式存放的 base64 資料。

```json
# Response structure concept
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Here is your generated image:"
          },
          {
            "inlineData": {
              "mimeType": "image/jpeg",
              "data": "...base64..."
            }
          }
        ]
      }
    }
  ]
}
```

### 變更後（Interactions API） {#after-interactions-api}

使用 Interactions API 時，生成的媒體會以獨立項目的形式，出現在
`content` 陣列中，該陣列位於時間軸的 `model_output` 步驟內，維持互動的
時間順序。

```json
# Response structure concept
{
  "id": "int_123",
  "steps": [
    {
      "type": "model_output",
      "status": "done",
      "content": [
        {
          "type": "text",
          "text": "Here is your generated image:"
        },
        {
          "type": "image",
          "mime_type": "image/jpeg",
          "data": "...base64..." // Or a reference URL in future
        }
      ]
    }
  ]
}
```

如此一來，回應的剖析方式便與輸入及文字輸出的處理方式保持一致
——一切都是時間軸中的一個步驟。

## 伺服器端工具 {#server-side-tools}

Gemini 支援內建的伺服器端工具，例如 Google 搜尋接地。
主要差異在於回應如何呈現工具的執行過程。

### 變更前（generateContent） {#before-generatecontent}

使用 `generateContent` 時，伺服器端工具的運作大多不透明。你啟用工具後，
會得到最終答案，以及一個獨立的 `groundingMetadata` 物件。關鍵在於，
引用並非內嵌於文中；`groundingSupports` 使用字元索引，將文字
片段對應回 `groundingChunks` 中的網路來源。


=== "Python"

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client()

      response = client.models.generate_content(
          model="gemini-4-hydrogen",
          contents="Who won Euro 2024?",
          config=types.GenerateContentConfig(
              tools=[{"google_search": {}}]
          ),
      )

      metadata = response.candidates[0].grounding_metadata
      if metadata.search_entry_point:
          print(f"Search Entry Point: {metadata.search_entry_point.rendered_content}")

      for support in metadata.grounding_supports:
          print(f"Citation: {support.segment.text}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const response = await client.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: 'Who won Euro 2024?',
          config: {
              tools: [{ googleSearch: {} }]
          }
      });

      const metadata = response.candidates?.[0]?.groundingMetadata;
      if (metadata?.searchEntryPoint) {
          console.log(`Search Entry Point: ${metadata.searchEntryPoint.renderedContent}`);
      }
      if (metadata?.groundingSupports) {
          for (const support of metadata.groundingSupports) {
              if (support?.segment?.text) {
                  console.log(`Citation: ${support.segment.text}`);
              }
          }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.Candidate;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.GoogleSearch;
      import com.google.genai.types.GroundingMetadata;
      import com.google.genai.types.GroundingSupport;
      import com.google.genai.types.Tool;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.List;
      import java.util.Optional;

      Client client = new Client();

      GenerateContentResponse response =
          client.models.generateContent(
              "gemini-2.5-flash-lite",
              "Who won Euro 2024?",
              GenerateContentConfig.builder()
                  .tools(
                      Arrays.asList(
                          Tool.builder().googleSearch(GoogleSearch.builder().build()).build()))
                  .build());

      List<Candidate> candidates = response.candidates().orElse(Collections.emptyList());
      if (!candidates.isEmpty() && candidates.get(0).groundingMetadata().isPresent()) {
        GroundingMetadata metadata = candidates.get(0).groundingMetadata().get();
        if (metadata.searchEntryPoint().isPresent()) {
          System.out.println(
              "Search Entry Point: " + metadata.searchEntryPoint().get().renderedContent().orElse(""));
        }
        for (GroundingSupport support : metadata.groundingSupports().orElse(Collections.emptyList())) {
          Optional<String> segmentText = support.segment().flatMap(s -> s.text());
          segmentText.ifPresent(text -> System.out.println("Citation: " + text));
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
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          response, err := client.Models.GenerateContent(
              ctx,
              "gemini-2.5-flash-lite",
              genai.Text("Who won Euro 2024?"),
              &genai.GenerateContentConfig{
                  Tools: []*genai.Tool{
                      {GoogleSearch: &genai.GoogleSearch{}},
                  },
              },
          )
          if err != nil {
              log.Fatal(err)
          }

          if len(response.Candidates) > 0 && response.Candidates[0].GroundingMetadata != nil {
              metadata := response.Candidates[0].GroundingMetadata
              if metadata.SearchEntryPoint != nil {
                  fmt.Println("Search Entry Point:", metadata.SearchEntryPoint.RenderedContent)
              }
              for _, support := range metadata.GroundingSupports {
                  if support.Segment != nil {
                      fmt.Println("Citation:", support.Segment.Text)
                  }
              }
          }
      }
      ```

=== "REST"

      ```json
      # Request
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:generateContent" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          {{ '**' }}"contents": [{
              "parts": [{
                  "text": "Who won Euro 2024?"
              }]
          }],
          "tools": [{
              "googleSearchRetrieval": {}
          }]{{ '**' }}
      }'

      # Response
      {
        {{ '**' }}"candidates": [
          {
            "content": {
              "parts": [
                {
                  "text": "Spain won Euro 2024, defeating England 2-1 in the final. This victory marks Spain's record fourth European Championship title."
                }
              ],
              "role": "model"
            },
            "groundingMetadata": {
              "webSearchQueries": [
                "UEFA Euro 2024 winner",
                "who won euro 2024"
              ],
              "searchEntryPoint": {
                "renderedContent": " HTML and CSS for the search widget "
              },
              "groundingChunks": [
                {"web": {"uri": "https://vertexaisearch.cloud.google.com.....", "title": "aljazeera.com"}},
                {"web": {"uri": "https://vertexaisearch.cloud.google.com.....", "title": "uefa.com"}}
              ],
              "groundingSupports": [
                {
                  "segment": {"startIndex": 0, "endIndex": 85, "text": "Spain won Euro 2024, defeatin..."},
                  "groundingChunkIndices": [0]
                },
                {
                  "segment": {"startIndex": 86, "endIndex": 210, "text": "This victory marks Spain's..."},
                  "groundingChunkIndices": [0, 1]
                }
              ]
            }
          }
        ]{{ '**' }}
      }
      ```


### 變更後（Interactions API） {#after-interactions-api}

使用 Interactions API 時，伺服器端工具提供完整的時間軸透明度。
API 會將呼叫與結果記錄為獨立的執行 `steps`
（`google_search_call` 與 `google_search_result`），清楚呈現模型
實際擷取了哪些資料。

此外，API 會將引用**內嵌**於文中傳回。你不需要再從獨立的中繼資料
物件對應索引；`model_output` 步驟中的文字項目本身就含有
專屬的 `annotations` 陣列，直接連結至來源。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Who won Euro 2024?",
          tools=[{"type": "google_search"}],
      )

      for step in interaction.steps:
          if step.type == "google_search_result":
              print(f"Search Suggestions: {step.search_suggestions}")
          elif step.type == "model_output":
              print(f"Answer: {step.content[0].text}")
              if step.content[0].annotations:
                  for anno in step.content[0].annotations:
                      print(f"Citation: {anno.title} ({anno.uri})")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          input: 'Who won Euro 2024?',
          tools: [{ type: 'google_search' }]
      });

      for (const step of interaction.steps || []) {
          if (step.type === 'google_search_result') {
              if (step.result?.[0]?.search_suggestions) {
                  console.log(`Search Suggestions: ${step.result[0].search_suggestions}`);
              }
          } else if (step.type === 'model_output') {
              for (const part of step.content || []) {
                  if (part.type === 'text') {
                      console.log(`Answer: ${part.text}`);
                      if (part.annotations) {
                          for (const anno of part.annotations) {
                              if (anno.type === 'url_citation') {
                                  console.log(`Citation: ${anno.title} (${anno.url})`);
                              }
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
      import com.google.genai.gaos.models.interactions.GoogleSearchResult;
      import com.google.genai.gaos.models.interactions.GoogleSearchResultStep;
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

      CreateModelInteraction request =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Who won Euro 2024?"))
              .tools(Arrays.asList(GoogleSearch.builder().build()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(request)).interaction().get();

      for (Step step : interaction.steps().orElse(Collections.emptyList())) {
        if (step instanceof GoogleSearchResultStep) {
          GoogleSearchResultStep searchStep = (GoogleSearchResultStep) step;
          for (GoogleSearchResult res : searchStep.result().orElse(Collections.emptyList())) {
            System.out.println("Search Suggestions: " + res.searchSuggestions().orElse(""));
          }
        } else if (step instanceof ModelOutputStep) {
          ModelOutputStep modelOutput = (ModelOutputStep) step;
          for (Content contentBlock : modelOutput.content().orElse(Collections.emptyList())) {
            if (contentBlock instanceof TextContent) {
              TextContent textContent = (TextContent) contentBlock;
              System.out.println("Answer: " + textContent.text().orElse(""));
              for (Annotation anno : textContent.annotations().orElse(Collections.emptyList())) {
                if (anno instanceof URLCitation) {
                  URLCitation cit = (URLCitation) anno;
                  System.out.println(
                      "Citation: " + cit.title().orElse("") + " (" + cit.url().orElse("") + ")");
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
                  Input: interactions.NewInteractionsInput("Who won Euro 2024?"),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.GoogleSearch{}),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if searchStep := step.GoogleSearchResultStep; searchStep != nil {
                  for _, r := range searchStep.Result {
                      if r.SearchSuggestions != nil {
                          fmt.Println("Search Suggestions:", *r.SearchSuggestions)
                      }
                  }
              } else if modelOutput := step.ModelOutputStep; modelOutput != nil {
                  for _, contentBlock := range modelOutput.Content {
                      if textContent := contentBlock.TextContent; textContent != nil {
                          fmt.Println("Answer:", textContent.Text)
                          for _, anno := range textContent.Annotations {
                              if cit := anno.URLCitation; cit != nil {
                                  fmt.Printf("Citation: %s (%s)\n", cit.GetTitle(), cit.GetURL())
                              }
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```json
      # Request
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "model": "gemini-4-hydrogen",
          {{ '**' }}"input": "Who won Euro 2024?",
          "tools": [{{ '{' }}"type": "google_search"{{ '}' }}]{{ '**' }}
      }'

      # Response (showing grounding)
      {
        "id": "int_grounded",
        {{ '**' }}"steps": [
          {
            "type": "user_input",
            "status": "done",
            "content": [{ "type": "text", "text": "Who won Euro 2024?" }]
          },
          {
            "type": "google_search_call",
            "status": "done",
            "content": [{ "type": "text", "text": "UEFA Euro 2024 winner" }]
          },
          {
            "type": "google_search_result",
            "status": "done",
            "content": [
              {
                "type": "text",
                "text": "Spain won Euro 2024..."
              }
            ]
          },
          {
            "type": "model_output",
            "status": "done",
            "content": [
              {
                "type": "text",
                "text": "Spain won Euro 2024, defeating England 2-1.",
                "annotations": [
                  {
                    "start_index": 0,
                    "end_index": 42,
                    "uri": "https://vertexaisearch...",
                    "title": "aljazeera.com"
                  }
                ]
              }
            ]
          }
        ]{{ '**' }}
      }
      ```


## 函式呼叫 {#function-calling}

函式呼叫與結果的結構也已調整，以符合 Steps
結構定義。

### 變更前（generateContent） {#before-generatecontent}

使用 `generateContent` 時，回應會將函式呼叫放在候選項中傳回。


=== "Python"

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client()

      response = client.models.generate_content(
          model="gemini-4-hydrogen",
          contents="What's the weather in Boston?",
          config=types.GenerateContentConfig(tools=[weather_tool]),
      )

      function_call = response.candidates[0].content.parts[0].function_call
      print(f"Requested tool: {function_call.name}")

      result = "52°F and rain"

      response = client.models.generate_content(
          model="gemini-4-hydrogen",
          contents=[
              types.Content(
                  role="user",
                  parts=[
                      types.Part.from_text(text="What's the weather in Boston?")
                  ],
              ),
              response.candidates[0].content,
              types.Content(
                  role="user",
                  parts=[
                      types.Part.from_function_response(
                          name=function_call.name,
                          response={"result": result},
                      )
                  ],
              ),
          ],
          config=types.GenerateContentConfig(tools=[weather_tool]),
      )
      print(response.text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      let response = await client.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: "What's the weather in Boston?",
          config: { tools: [weatherTool] }
      });

      const candidateContent = response.candidates?.[0]?.content;
      const functionCall = candidateContent?.parts?.[0]?.functionCall;
      if (functionCall) {
          console.log(`Requested tool: ${functionCall.name}`);
      }

      const result = "52°F and rain";

      if (candidateContent && functionCall) {
          response = await client.models.generateContent({
              model: 'gemini-4-hydrogen',
              contents: [
                  { role: 'user', parts: [{ text: "What's the weather in Boston?" }] },
                  candidateContent,
                  {
                      role: 'user',
                      parts: [{
                          functionResponse: {
                              name: functionCall.name,
                              response: { result: result }
                          }
                      }]
                  }
              ],
              config: { tools: [weatherTool] }
          });
          console.log(response.text);
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.Content;
      import com.google.genai.types.FunctionCall;
      import com.google.genai.types.FunctionDeclaration;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.Part;
      import com.google.genai.types.Schema;
      import com.google.genai.types.Tool;
      import com.google.genai.types.Type;
      import java.util.Arrays;
      import java.util.Map;

      Client client = new Client();

      FunctionDeclaration weatherFunc =
          FunctionDeclaration.builder()
              .name("get_weather")
              .description("Gets weather")
              .parameters(
                  Schema.builder()
                      .type(Type.Known.OBJECT)
                      .properties(Map.of("location", Schema.builder().type(Type.Known.STRING).build()))
                      .build())
              .build();

      Tool weatherTool = Tool.builder().functionDeclarations(Arrays.asList(weatherFunc)).build();

      GenerateContentResponse response =
          client.models.generateContent(
              "gemini-2.5-flash-lite",
              "What's the weather in Boston?",
              GenerateContentConfig.builder().tools(Arrays.asList(weatherTool)).build());

      FunctionCall functionCall = response.functionCalls().get(0);
      System.out.println("Requested tool: " + functionCall.name().orElse(""));

      String result = "52°F and rain";

      GenerateContentResponse finalResponse =
          client.models.generateContent(
              "gemini-2.5-flash-lite",
              Arrays.asList(
                  Content.builder()
                      .role("user")
                      .parts(Arrays.asList(Part.fromText("What's the weather in Boston?")))
                      .build(),
                  response.candidates().get().get(0).content().get(),
                  Content.builder()
                      .role("user")
                      .parts(
                          Arrays.asList(
                              Part.fromFunctionResponse(
                                  functionCall.name().orElse(""), Map.of("result", result))))
                      .build()),
              GenerateContentConfig.builder().tools(Arrays.asList(weatherTool)).build());
      System.out.println(finalResponse.text());
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          weatherTool := &genai.Tool{
              FunctionDeclarations: []*genai.FunctionDeclaration{
                  {
                      Name:        "get_weather",
                      Description: "Gets weather",
                      Parameters: &genai.Schema{
                          Type: genai.TypeObject,
                          Properties: map[string]*genai.Schema{
                              "location": {Type: genai.TypeString},
                          },
                      },
                  },
              },
          }

          config := &genai.GenerateContentConfig{
              Tools: []*genai.Tool{weatherTool},
          }

          response, err := client.Models.GenerateContent(
              ctx,
              "gemini-2.5-flash-lite",
              genai.Text("What's the weather in Boston?"),
              config,
          )
          if err != nil {
              log.Fatal(err)
          }

          calls := response.FunctionCalls()
          if len(calls) > 0 {
              functionCall := calls[0]
              fmt.Println("Requested tool:", functionCall.Name)

              result := "52°F and rain"
              history := []*genai.Content{
                  genai.NewContentFromText("What's the weather in Boston?", genai.RoleUser),
                  response.Candidates[0].Content,
                  genai.NewContentFromParts([]*genai.Part{
                      genai.NewPartFromFunctionResponse(functionCall.Name, map[string]any{"result": result}),
                  }, genai.RoleUser),
              }

              finalResponse, err := client.Models.GenerateContent(ctx, "gemini-2.5-flash-lite", history, config)
              if err != nil {
                  log.Fatal(err)
              }
              fmt.Println(finalResponse.Text())
          }
      }
      ```

=== "REST"

      ```json
      # Request
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:generateContent" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          {{ '**' }}"contents": [{
              "parts": [{
                  "text": "What is the weather like in Boston, MA?"
              }]
          }],
          "tools": [{
              "functionDeclarations": [{
                  "name": "get_weather",
                  "description": "Get the current weather",
                  "parameters": {
                      "type": "OBJECT",
                      "properties": {
                          "location": {"type": "STRING"}
                      },
                      "required": ["location"]
                  }
              }]
          }]{{ '**' }}
      }'

      # Response
      {
        {{ '**' }}"candidates": [
          {
            "content": {
              "parts": [
                {
                  "functionCall": {
                    "name": "get_weather",
                    "args": { "location": "Boston, MA" }
                  }
                }
              ],
              "role": "model"
            },
            "finishReason": "STOP",
            "index": 0
          }
        ]{{ '**' }}
      }
      ```


### 變更後（Interactions API） {#after-interactions-api}

工具呼叫與結果現在是時間軸中各自獨立的步驟。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      weather_tool = {
          "type": "function",
          "name": "get_weather",
          "description": "Gets weather",
          "parameters": {
              "type": "object",
              "properties": {
                  "location": {"type": "string"}
              },
          },
      }

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="What's the weather in Boston?",
          tools=[weather_tool],
      )

      for step in interaction.steps:
          if step.type == "function_call":
              print(f"Executing {step.name} for {step.arguments}")

              result = "52°F and rain"

              interaction = client.interactions.create(
                  model="gemini-4-hydrogen",
                  previous_interaction_id=interaction.id,
                  input=[
                      {
                          "type": "function_result",
                          "call_id": step.id,
                          "name": step.name,
                          "result": [{"type": "text", "text": result}],
                      }
                  ],
              )
              print(next_interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          input: "What's the weather in Boston?",
          tools: [
              {
                  type: "function",
                  name: "get_weather",
                  description: "Get weather for a location",
                  parameters: {
                      type: "object",
                      properties: {
                          location: { type: "string" }
                      },
                      required: ["location"]
                  }
              }
          ]
      });

      for (const step of interaction.steps || []) {
          if (step.type === 'function_call') {
              console.log(`Executing ${step.name} for ${JSON.stringify(step.arguments)}`);

              const result = "52°F and rain";

              const nextInteraction = await client.interactions.create({
                  model: 'gemini-4-hydrogen',
                  previous_interaction_id: interaction.id,
                  input: [
                      {
                          type: 'function_result',
                          call_id: step.id,
                          name: step.name,
                          result: [{ type: 'text', text: result }]
                      }
                  ]
              });

              console.log(nextInteraction.output_text);
          }
      }
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
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> properties = new HashMap<>();
      properties.put("location", Map.of("type", "string"));

      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");
      parameters.put("properties", properties);
      parameters.put("required", Arrays.asList("location"));

      Function weatherTool =
          Function.builder()
              .name("get_weather")
              .description("Gets weather")
              .parameters(parameters)
              .build();

      CreateModelInteraction request =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("What's the weather in Boston?"))
              .tools(Arrays.asList(weatherTool))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(request)).interaction().get();

      for (Step step : interaction.steps().orElse(Collections.emptyList())) {
        if (step instanceof FunctionCallStep) {
          FunctionCallStep fcStep = (FunctionCallStep) step;
          System.out.println(
              "Executing "
                  + fcStep.name().orElse("")
                  + " for "
                  + fcStep.arguments().orElse(Collections.emptyMap()));

          String result = "52°F and rain";

          FunctionResultStep funcResult =
              FunctionResultStep.builder()
                  .callId(fcStep.id().orElse(""))
                  .name(fcStep.name().orElse(""))
                  .result(
                      FunctionResultStepResultUnion.of(
                          Arrays.asList(TextContent.builder().text(result).build())))
                  .build();

          CreateModelInteraction nextRequest =
              CreateModelInteraction.builder()
                  .model(Model.of("gemini-4-hydrogen"))
                  .previousInteractionId(interaction.id().orElse(""))
                  .input(InteractionsInput.ofStep(Arrays.asList(funcResult)))
                  .build();

          Interaction nextInteraction =
              client.interactions.create(CreateInteractionRequestBody.of(nextRequest)).interaction().get();
          System.out.println(nextInteraction.outputText().orElse(""));
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
              Name:        genai.Ptr("get_weather"),
              Description: genai.Ptr("Gets weather"),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "location": map[string]any{"type": "string"},
                  },
                  "required": []string{"location"},
              },
          })

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("What's the weather in Boston?"),
                  Tools: []interactions.Tool{weatherTool},
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if fcStep := step.FunctionCallStep; fcStep != nil {
                  fmt.Printf("Executing %s for %v\n", fcStep.Name, fcStep.Arguments)

                  result := "52°F and rain"
                  funcResult := interactions.NewStep(interactions.FunctionResultStep{
                      CallID: fcStep.ID,
                      Name:   genai.Ptr(fcStep.Name),
                      Result: interactions.NewFunctionResultStepResultUnion([]interactions.FunctionResultSubcontent{
                          interactions.NewFunctionResultSubcontent(interactions.TextContent{Text: result}),
                      }),
                  })

                  nextRes, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                      Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                          Model:                 interactions.Model("gemini-4-hydrogen"),
                          PreviousInteractionID: res.Interaction.ID,
                          Input:                 interactions.NewInteractionsInput([]interactions.Step{funcResult}),
                      }),
                  })
                  if err != nil {
                      log.Fatal(err)
                  }
                  if nextRes.Interaction.OutputText != nil {
                      fmt.Println(*nextRes.Interaction.OutputText)
                  }
              }
          }
      }
      ```

=== "REST"

      ```json
      # Initial Request
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "model": "gemini-4-hydrogen",
          {{ '**' }}"input": "What's the weather in Boston?",
          "tools": [{
              "type": "function",
              "name": "get_weather",
              "description": "Get weather for a location",
              "parameters": {
                  "type": "object",
                  "properties": {
                      "location": { "type": "string" }
                  },
                  "required": ["location"]
              }
          }]{{ '**' }}
      }'

      # Response (requires action)
      {
        "id": "int_001",
        "status": "requires_action",
        {{ '**' }}"steps": [
          {
            "type": "user_input",
            "status": "done",
            "content": [
              { "type": "text", "text": "What's the weather in Boston?" }
            ]
          },
          {
            "type": "function_call",
            "status": "waiting",
            "id": "fc_1",
            "name": "get_weather",
            "arguments": { "location": "Boston, MA" }
          }
        ]{{ '**' }}
      }

      # Submit Tool Result Request
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "model": "gemini-4-hydrogen",
          {{ '**' }}"previous_interaction_id": "int_001",
          "input": {
              "type": "function_result",
              "call_id": "fc_1",
              "name": "get_weather",
              "result": [
                  { "type": "text", "text": "52°F with rain" }
              ]
          }{{ '**' }}
      }'

      # Final Response
      {
        "id": "int_002",
        "status": "completed",
        {{ '**' }}"steps": [
          {
            "type": "function_result",
            "call_id": "fc_1",
            "name": "get_weather",
            "result": [
              { "type": "text", "text": "52°F with rain" }
            ]
          },
          {
            "type": "model_output",
            "status": "done",
            "content": [
              { "type": "text", "text": "It's 52°F with rain in Boston." }
            ]
          }
        ]{{ '**' }}
      }
      ```


## 串流 {#streaming}

串流方面的一項關鍵差異是：Interactions API 使用同一個
端點，並在要求內文中帶入 `"stream": true`；而
`generateContent` API 則必須呼叫專用端點
（`:streamGenerateContent`）。

此外，串流事件現在使用專用型別，讓你監控
互動的生命週期，並追蹤時間軸上的執行步驟。

### 變更前（generateContentStream） {#before-generatecontentstream}

使用 `generateContent` 時，你接收的是一連串回應區塊組成的串流。


=== "Python"

      ```python
      response = client.models.generate_content_stream(
          model="gemini-4-hydrogen", contents="Tell me a story"
      )
      for chunk in response:
          print(chunk.text, end="")
      ```

=== "JavaScript"

      ```javascript
      const responseStream = await client.models.generateContentStream({
          model: 'gemini-4-hydrogen',
          contents: 'Tell me a story',
      });
      for await (const chunk of responseStream) {
          process.stdout.write(chunk.text);
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.ResponseStream;
      import com.google.genai.types.GenerateContentResponse;

      Client client = new Client();

      try (ResponseStream<GenerateContentResponse> responseStream =
          client.models.generateContentStream("gemini-2.5-flash-lite", "Tell me a story", null)) {
        for (GenerateContentResponse chunk : responseStream) {
          System.out.print(chunk.text());
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
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          for chunk, err := range client.Models.GenerateContentStream(
              ctx,
              "gemini-2.5-flash-lite",
              genai.Text("Tell me a story"),
              nil,
          ) {
              if err != nil {
                  log.Fatal(err)
              }
              fmt.Print(chunk.Text())
          }
      }
      ```

=== "REST"

      ```json
      # Request
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:streamGenerateContent" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          {{ '**' }}"contents": [{
              "parts": [{
                  "text": "Tell me a story"
              }]
          }]{{ '**' }}
      }'

      # Response stream
      {{ '**' }}event: content.start
      data: {"event_type": "content.start", "index": 0, "content": {"type": "thought"}}
      event: content.delta
      data: {"event_type": "content.delta", "index": 0, "delta": {"type": "thought_summary", "text": "User wants an explanation."}}
      event: content.stop
      data: {"event_type": "content.stop", "index": 0}
      event: content.start
      data: {"event_type": "content.start", "index": 1, "content": {"type": "text"}}
      event: content.delta
      data: {"event_type": "content.delta", "index": 1, "delta": {"type": "text", "text": "Hello"}}
      event: content.stop
      data: {"event_type": "content.stop", "index": 1}{{ '**' }}
      ```


### 變更後（Interactions API） {#after-interactions-api}

使用 Interactions API 時，串流採用 Server-Sent Events（SSE）與專用
差異（delta）型別，即時呈現執行步驟的發生過程。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      stream = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Tell me a story",
          stream=True,
      )

      for event in stream:
          if event.event_type == "step.delta":
              if event.delta.type == "text":
                  print(event.delta.text, end="", flush=True)
          elif event.event_type == "interaction.completed":
              print(f"\n\n--- Stream Finished ---")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const stream = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          input: 'Tell me a story',
          stream: true,
      });

      for await (const event of stream) {
          if (event.event_type === 'step.delta') {
              if (event.delta.type === 'text' && 'text' in event.delta) {
                  process.stdout.write(event.delta.text);
              }
          } else if (event.event_type === 'interaction.completed') {
              console.log('\n\n--- Stream Finished ---');
          }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.InteractionCompletedEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEStreamEvent;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.StepDelta;
      import com.google.genai.gaos.models.interactions.TextDelta;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.utils.EventStream;

      Client client = new Client();

      CreateModelInteraction request =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Tell me a story"))
              .stream(true)
              .build();

      try (EventStream<InteractionSSEStreamEvent> stream =
          client.interactions.create(CreateInteractionRequestBody.of(request)).events()) {
        for (InteractionSSEStreamEvent streamEvent : stream) {
          if (streamEvent.data().isPresent()) {
            InteractionSSEEvent event = streamEvent.data().get();
            if (event instanceof StepDelta) {
              StepDelta stepDelta = (StepDelta) event;
              if (stepDelta.delta().isPresent() && stepDelta.delta().get() instanceof TextDelta) {
                TextDelta textDelta = (TextDelta) stepDelta.delta().get();
                System.out.print(textDelta.text().orElse(""));
              }
            } else if (event instanceof InteractionCompletedEvent) {
              System.out.println("\n\n--- Stream Finished ---");
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
                  Model:  interactions.Model("gemini-4-hydrogen"),
                  Input:  interactions.NewInteractionsInput("Tell me a story"),
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
              } else if event.GetDataInteractionCompleted() != nil {
                  fmt.Println("\n\n--- Stream Finished ---")
              }
          }
          if err := stream.Err(); err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```json
        {{ '**' }}event: interaction.created
        data: {"interaction": {"id": "int_xyz", "status": "in_progress"}, "event_type": "interaction.created"}
        event: interaction.status_update
        data: {"interaction_id": "int_xyz", "status": "in_progress", "event_type": "interaction.status_update"}
        event: step.start
        data: {"index": 0, "step": {"type": "thought"}, "event_type": "step.start"}
        event: step.delta
        data: {"index": 0, "delta": {"type": "thought_summary", "content": {"type": "text", "text": "User wants an explanation."}}, "event_type": "step.delta"}
        event: step.stop
        data: {"index": 0, "event_type": "step.stop"}
        event: step.start
        data: {"index": 1, "step": {"type": "model_output"}, "event_type": "step.start"}
        event: step.delta
        data: {"index": 1, "delta": {"type": "text", "text": "Hello"}, "event_type": "step.delta"}
        event: step.stop
        data: {"index": 1, "event_type": "step.stop"}
        event: interaction.completed
        data: {"interaction": {"id": "int_xyz", "status": "completed", "usage": {"total_input_tokens": 10, "total_output_tokens": 5, "total_tokens": 15}}, "event_type": "interaction.completed"}{{ '**' }}
      ```


### 串流工具與函式呼叫 {#streaming-tools-and-function-calls}

工具在串流中的行為方式已與 `generateContent` 大不相同，
提供更精細的控制與可見性。

#### 變更前（generateContent） {#before-generatecontent}

使用 `generateContent` 時，串流中的函式呼叫會以完整形式在單一
區塊中送達。你無法即時看到引數的生成過程，因此處理常式
只需檢查是否有完整的 `functionCall` 物件即可。


=== "Python"

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client()

      stream = client.models.generate_content_stream(
          model="gemini-4-hydrogen",
          contents="What's the weather in Boston?",
          config=types.GenerateContentConfig(tools=[weather_tool]),
      )

      for chunk in stream:
          if chunk.candidates[0].content.parts[0].function_call:
              fc = chunk.candidates[0].content.parts[0].function_call
              print(f"Call: {fc.name}({fc.args})")
          elif chunk.text:
              print(chunk.text, end="")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const stream = await client.models.generateContentStream({
          model: 'gemini-4-hydrogen',
          contents: "What's the weather in Boston?",
          config: { tools: [weatherTool] }
      });

      for await (const chunk of stream) {
          const part = chunk.candidates?.[0]?.content?.parts?.[0];
          if (part?.functionCall) {
              console.log(`Call: ${part.functionCall.name}(${JSON.stringify(part.functionCall.args)})`);
          } else if (part?.text) {
              process.stdout.write(part.text);
          }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.ResponseStream;
      import com.google.genai.types.FunctionCall;
      import com.google.genai.types.FunctionDeclaration;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.Schema;
      import com.google.genai.types.Tool;
      import com.google.genai.types.Type;
      import java.util.Arrays;
      import java.util.Map;

      Client client = new Client();

      FunctionDeclaration weatherFunc =
          FunctionDeclaration.builder()
              .name("get_weather")
              .description("Gets weather")
              .parameters(
                  Schema.builder()
                      .type(Type.Known.OBJECT)
                      .properties(Map.of("location", Schema.builder().type(Type.Known.STRING).build()))
                      .build())
              .build();

      Tool weatherTool = Tool.builder().functionDeclarations(Arrays.asList(weatherFunc)).build();

      try (ResponseStream<GenerateContentResponse> stream =
          client.models.generateContentStream(
              "gemini-2.5-flash-lite",
              "What's the weather in Boston?",
              GenerateContentConfig.builder().tools(Arrays.asList(weatherTool)).build())) {
        for (GenerateContentResponse chunk : stream) {
          if (chunk.functionCalls() != null && !chunk.functionCalls().isEmpty()) {
            FunctionCall fc = chunk.functionCalls().get(0);
            System.out.println("Call: " + fc.name().orElse("") + "(" + fc.args().orElse(Map.of()) + ")");
          } else if (chunk.text() != null) {
            System.out.print(chunk.text());
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
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          weatherTool := &genai.Tool{
              FunctionDeclarations: []*genai.FunctionDeclaration{
                  {
                      Name:        "get_weather",
                      Description: "Gets weather",
                      Parameters: &genai.Schema{
                          Type: genai.TypeObject,
                          Properties: map[string]*genai.Schema{
                              "location": {Type: genai.TypeString},
                          },
                      },
                  },
              },
          }

          for chunk, err := range client.Models.GenerateContentStream(
              ctx,
              "gemini-2.5-flash-lite",
              genai.Text("What's the weather in Boston?"),
              &genai.GenerateContentConfig{
                  Tools: []*genai.Tool{weatherTool},
              },
          ) {
              if err != nil {
                  log.Fatal(err)
              }
              if calls := chunk.FunctionCalls(); len(calls) > 0 {
                  fc := calls[0]
                  fmt.Printf("Call: %s(%v)\n", fc.Name, fc.Args)
              } else if text := chunk.Text(); text != "" {
                  fmt.Print(text)
              }
          }
      }
      ```

=== "REST"

      ```json
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:streamGenerateContent" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          {{ '**' }}"contents": [{"parts": [{"text": "What'\''s the weather in Boston?"}]}],
          "tools": [{"functionDeclarations": [{"name": "get_weather", "parameters": {"type": "OBJECT", "properties": {"location": {"type": "STRING"}}}}]}]{{ '**' }}
      }'

      {{ '**' }}{"candidates": [{"content": {"parts": [{"functionCall": {"name": "get_weather", "args": {"location": "Boston, MA"}}}]}}]}{{ '**' }}
      ```


#### 變更後（Interactions API） {#after-interactions-api}

Interactions API 會以 `arguments_delta` 事件的形式，逐字元
串流傳送函式呼叫引數。整個工具生命週期——思考、呼叫、結果與
輸出——都以一連串獨立步驟的形式呈現。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      stream = client.interactions.create(
          model="gemini-4-hydrogen",
          input="What's the weather in Boston?",
          tools=[get_weather_tool],
          stream=True,
      )

      for event in stream:
          if event.event_type == "step.start":
              if event.step.type == "function_call":
                  print(f"Calling: {event.step.name}")
          elif event.event_type == "step.delta":
              if event.delta.type == "arguments_delta":
                  print(f" args: {event.delta.arguments}")
              elif event.delta.type == "text":
                  print(event.delta.text, end="")
          elif event.event_type == "interaction.completed":
              print("\n--- Done ---")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const stream = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          input: "What's the weather in Boston?",
          tools: [getWeatherTool],
          stream: true,
      });

      for await (const event of stream) {
          if (event.event_type === 'step.start') {
              if (event.step.type === 'function_call') {
                  console.log(`Calling: ${event.step.name}`);
              }
          } else if (event.event_type === 'step.delta') {
              if (event.delta.type === 'arguments_delta') {
                  console.log(` args: ${event.delta.arguments}`);
              } else if (event.delta.type === 'text') {
                  process.stdout.write(event.delta.text);
              }
          } else if (event.event_type === 'interaction.completed') {
              console.log('\n--- Done ---');
          }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.ArgumentsDelta;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.FunctionCallStep;
      import com.google.genai.gaos.models.interactions.InteractionCompletedEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEStreamEvent;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.StepDelta;
      import com.google.genai.gaos.models.interactions.StepDeltaData;
      import com.google.genai.gaos.models.interactions.StepStart;
      import com.google.genai.gaos.models.interactions.TextDelta;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.utils.EventStream;
      import java.util.Arrays;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> properties = new HashMap<>();
      properties.put("location", Map.of("type", "string"));

      Map<String, Object> parameters = new HashMap<>();
      parameters.put("type", "object");
      parameters.put("properties", properties);
      parameters.put("required", Arrays.asList("location"));

      Function getWeatherTool =
          Function.builder()
              .name("get_weather")
              .description("Gets weather")
              .parameters(parameters)
              .build();

      CreateModelInteraction request =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("What's the weather in Boston?"))
              .tools(Arrays.asList(getWeatherTool))
              .stream(true)
              .build();

      try (EventStream<InteractionSSEStreamEvent> stream =
          client.interactions.create(CreateInteractionRequestBody.of(request)).events()) {
        for (InteractionSSEStreamEvent streamEvent : stream) {
          if (streamEvent.data().isPresent()) {
            InteractionSSEEvent event = streamEvent.data().get();
            if (event instanceof StepStart) {
              StepStart stepStart = (StepStart) event;
              if (stepStart.step().isPresent() && stepStart.step().get() instanceof FunctionCallStep) {
                FunctionCallStep fcStep = (FunctionCallStep) stepStart.step().get();
                System.out.println("Calling: " + fcStep.name().orElse(""));
              }
            } else if (event instanceof StepDelta) {
              StepDelta stepDelta = (StepDelta) event;
              if (stepDelta.delta().isPresent()) {
                StepDeltaData delta = stepDelta.delta().get();
                if (delta instanceof ArgumentsDelta) {
                  System.out.println("  args: " + ((ArgumentsDelta) delta).arguments().orElse(""));
                } else if (delta instanceof TextDelta) {
                  System.out.print(((TextDelta) delta).text().orElse(""));
                }
              }
            } else if (event instanceof InteractionCompletedEvent) {
              System.out.println("\n--- Done ---");
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

          getWeatherTool := interactions.NewTool(interactions.Function{
              Name:        genai.Ptr("get_weather"),
              Description: genai.Ptr("Gets weather"),
              Parameters: map[string]any{
                  "type": "object",
                  "properties": map[string]any{
                      "location": map[string]any{"type": "string"},
                  },
                  "required": []string{"location"},
              },
          })

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:  interactions.Model("gemini-4-hydrogen"),
                  Input:  interactions.NewInteractionsInput("What's the weather in Boston?"),
                  Tools:  []interactions.Tool{getWeatherTool},
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
              if stepStart := event.GetDataStepStart(); stepStart != nil {
                  if fcStep := stepStart.GetStepFunctionCall(); fcStep != nil {
                      fmt.Println("Calling:", fcStep.Name)
                  }
              } else if stepDelta := event.GetDataStepDelta(); stepDelta != nil {
                  if argsDelta := stepDelta.GetDeltaArgumentsDelta(); argsDelta != nil {
                      fmt.Println("  args:", argsDelta.GetArguments())
                  } else if textDelta := stepDelta.GetDeltaText(); textDelta != nil {
                      fmt.Print(textDelta.GetText())
                  }
              } else if event.GetDataInteractionCompleted() != nil {
                  fmt.Println("\n--- Done ---")
              }
          }
          if err := stream.Err(); err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```json
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "model": "gemini-4-hydrogen",
          {{ '**' }}"input": "What'\''s the weather in Boston?",
          "tools": [{"type": "function", "name": "get_weather", "parameters": {"type": "object", "properties": {"location": {"type": "string"}}}}],
          "stream": true{{ '**' }}
      }'

      // Stream 1: the model calls the function
      event: interaction.created
      data: {"interaction": {"id": "int_1", "status": "in_progress"}, "event_type": "interaction.created"}

      event: interaction.status_update
      data: {"interaction_id": "int_1", "status": "in_progress", "event_type": "interaction.status_update"}

      // ── Step 0: Thought ──────────────────────────────────
      event: step.start
      data: {"index": 0, "step": {"type": "thought"}, "event_type": "step.start"}

      event: step.delta
      data: {"index": 0, "delta": {"type": "thought_summary", "content": {"type": "text", "text": "The user wants weather data for Boston. I'll call the get_weather tool."}}, "event_type": "step.delta"}

      event: step.stop
      data: {"index": 0, "event_type": "step.stop"}

      // ── Step 1: Function Call (arguments streamed) ───────
      event: step.start
      data: {"index": 1, "step": {"type": "function_call", "id": "fc_1", "name": "get_weather", "arguments": {}}, "event_type": "step.start"}

      event: step.delta
      data: {"index": 1, "delta": {"type": "arguments_delta", "arguments": "{\"location\": \"Boston, MA\"}"}, "event_type": "step.delta"}

      event: step.stop
      data: {"index": 1, "event_type": "step.stop"}

      // The stream ends with status requires_action: the model needs the tool result.
      event: interaction.completed
      data: {"interaction": {"id": "int_1", "status": "requires_action", "usage": {"total_input_tokens": 34, "total_output_tokens": 15, "total_tokens": 49}}, "event_type": "interaction.completed"}

      event: done
      data: [DONE]

      // ── (Client submits the tool result) ──────────────────
      // The client calls interactions.create with the function_result as input
      // and previous_interaction_id set to "int_1". This opens a new stream.

      // Stream 2: the model uses the result
      event: interaction.created
      data: {"interaction": {"id": "int_2", "status": "in_progress"}, "event_type": "interaction.created"}

      event: interaction.status_update
      data: {"interaction_id": "int_2", "status": "in_progress", "event_type": "interaction.status_update"}

      // ── Step 0: Thought ──────────────────────────────────
      event: step.start
      data: {"index": 0, "step": {"type": "thought"}, "event_type": "step.start"}

      event: step.delta
      data: {"index": 0, "delta": {"type": "thought_summary", "content": {"type": "text", "text": "Got weather data. Composing the final response."}}, "event_type": "step.delta"}

      event: step.stop
      data: {"index": 0, "event_type": "step.stop"}

      // ── Step 1: Model Output (text streamed) ─────────────
      event: step.start
      data: {"index": 1, "step": {"type": "model_output"}, "event_type": "step.start"}

      event: step.delta
      data: {"index": 1, "delta": {"type": "text", "text": "It's currently 52°F and rainy in Boston."}, "event_type": "step.delta"}

      event: step.stop
      data: {"index": 1, "event_type": "step.stop"}

      // ── Interaction complete ─────────────────────────────
      event: interaction.completed
      data: {"interaction": {"id": "int_2", "status": "completed", "usage": {"total_input_tokens": 256, "total_output_tokens": 128, "total_tokens": 384}}, "event_type": "interaction.completed"}

      event: done
      data: [DONE]
      ```


