# 文字生成

Gemini API 可以根據文字、圖片、影片與音訊輸入，產生文字輸出。如需挑選適合你的任務的模型，請參閱[選擇模型](/docs/choosing-a-model/)。

以下是一個基本範例：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="How does AI work?"
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "How does AI work?",
        });
        console.log(interaction.output_text);
      }

      await main();
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
              .input(InteractionsInput.of("How does AI work?"))
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
                  Input: interactions.NewInteractionsInput("How does AI work?"),
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

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "How does AI work?"
        }'
      ```

=== "CLI"

      ```bash
      gemini-api generate "How does AI work?"
      ```


Google GenAI SDK 在傳回的 `Interaction` 物件上直接提供方便的屬性，讓你存取模型的回應。

最常用的輔助屬性是 **`interaction.output_text`**（String），它會傳回模型回應中最後的文字區塊。如果回應被拆分到多個連續的 `TextContent` 區塊中，它會自動將這些區塊串接起來。請注意，`.output_text` 不包含被非文字內容（例如思考、圖片、音訊或工具呼叫）分隔的較早文字區塊。對於複雜或交錯的多模態回應，你必須改為手動逐一處理 `steps`。

## 使用 Gemini 思考 {#thinking-with-gemini}

Gemini 模型通常預設啟用[「思考」](/docs/thinking/)，讓模型在回應請求之前先進行推理。

每個模型支援不同的思考設定，讓你可以掌控成本、延遲與智慧程度。如需詳細資訊，請參閱[思考指南](/docs/thinking/#thinking-levels)。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="How does AI work?",
          generation_config={
              "thinking_level": "high"
          }
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "How does AI work?",
          generation_config: {
            thinking_level: "high",
          },
        });
        console.log(interaction.output_text);
      }

      await main();
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
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("How does AI work?"))
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
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("How does AI work?"),
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

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "How does AI work?",
          "generation_config": {
            "thinking_level": "high"
          }
        }'
      ```

=== "CLI"

      ```bash
      gemini-api generate "How does AI work?" \
        -m gemini-4-hydrogen \
        --body '{"generation_config": {"thinking_level": "high"}}'
      ```


## 系統指令與其他設定 {#system-instructions}

你可以使用系統指令引導 Gemini 模型的行為。傳入 `system_instruction` 參數即可設定模型的行為。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          system_instruction="You are a cat. Your name is Neko.",
          input="Hello there"
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Hello there",
          system_instruction: "You are a cat. Your name is Neko.",
        });
        console.log(interaction.output_text);
      }

      await main();
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
              .systemInstruction("You are a cat. Your name is Neko.")
              .input(InteractionsInput.of("Hello there"))
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
                  Model:             interactions.Model("gemini-4-hydrogen"),
                  Input:             interactions.NewInteractionsInput("Hello there"),
                  SystemInstruction: genai.Ptr("You are a cat. Your name is Neko."),
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

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "system_instruction": "You are a cat. Your name is Neko.",
          "input": "Hello there"
        }'
      ```

=== "CLI"

      ```bash
      gemini-api generate "Hello there" --system "You are a cat. Your name is Neko."
      ```


你也可以覆寫 `max_output_tokens` 或 `thinking_level` 等預設生成參數，方法是使用 `generation_config` 參數。


!!! note " "

      Gemini 4 與 Gemini 3.6+ 模型會忽略 `temperature`、`top_p` 與 `top_k` 的自訂值，並傳回淘汰警告標頭。請從你的請求中移除這些取樣參數。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Explain how AI works",
          generation_config={
              "max_output_tokens": 500
          }
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Explain how AI works",
          generation_config: {
            max_output_tokens: 500,
          },
        });
        console.log(interaction.output_text);
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.GenerationConfig;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Explain how AI works"))
              .generationConfig(GenerationConfig.builder().maxOutputTokens(500).build())
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
                  Input: interactions.NewInteractionsInput("Explain the concept of Occam's Razor and provide a simple, everyday example."),
                  GenerationConfig: &interactions.GenerationConfig{
                      MaxOutputTokens: genai.Ptr(500),
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

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Explain how AI works",
          "generation_config": {
            "max_output_tokens": 1000
          }
        }'
      ```

=== "CLI"

      ```bash
      gemini-api generate "Explain how AI works" \
        --body '{"generation_config": {"max_output_tokens": 500}}'
      ```


可設定的參數完整清單與說明，請參閱 [Interactions API 參考文件](/api-reference/interactions-api/)。

## 多模態輸入 {#multimodal-input}

Gemini API 支援多模態輸入，讓你可以將文字與媒體檔案結合使用。以下範例示範如何提供圖片：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      uploaded_file = client.files.upload(file="path/to/organ.jpg")

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": "Tell me about this instrument"},
              {
                  "type": "image",
                  "uri": uploaded_file.uri,
                  "mime_type": uploaded_file.mime_type
              }
          ]
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
        const uploadedFile = await ai.files.upload({
          file: "path/to/organ.jpg",
          config: { mimeType: "image/jpeg" }
        });

        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: [
            {type: "text", text: "Tell me about this instrument"},
            {
              type: "image",
              uri: uploadedFile.uri,
              mime_type: uploadedFile.mimeType
            }
          ],
        });
        console.log(interaction.output_text);
      }

      await main();
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
      import com.google.genai.types.File;
      import com.google.genai.types.UploadFileConfig;
      import java.util.Arrays;

      Client client = new Client();

      File uploadedFile =
          client.files.upload(
              new java.io.File("path/to/organ.jpg"),
              UploadFileConfig.builder().mimeType("image/jpeg").build());

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(
                  InteractionsInput.ofContent(
                      Arrays.asList(
                          TextContent.builder().text("Tell me about this instrument").build(),
                          ImageContent.builder()
                              .uri(uploadedFile.uri().orElse(""))
                              .mimeType(
                                  ImageContentMimeType.of(uploadedFile.mimeType().orElse("image/jpeg")))
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

          imageBytes, err := os.ReadFile("/path/to/organ.jpg")
          if err != nil {
              log.Fatal(err)
          }
          base64Image := base64.StdEncoding.EncodeToString(imageBytes)

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: "Tell me about this instrument",
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

      ```shell
      # First upload the file using the Files API, then use the URI:
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {"type": "text", "text": "Tell me about this instrument"},
            {
              "type": "image",
              "uri": "YOUR_FILE_URI",
              "mime_type": "image/jpeg"
            }
          ]
        }'
      ```

=== "CLI"

      ```bash
      gemini-api generate "Tell me about this instrument" -i path/to/organ.jpg
      ```


如需提供圖片的其他方法與更進階的圖片處理，請參閱我們的[圖片理解指南](/docs/image-understanding/)。此 API 也支援[文件](/docs/document-processing/)、[影片](/docs/video-understanding/)與[音訊](/docs/audio/)輸入與理解。

## 串流回應 {#streaming-responses}

預設情況下，模型會等到整個生成程序完成後才傳回回應。

若要讓互動更流暢，請使用串流，在回應區塊產生時即時處理。如需涵蓋事件類型、搭配工具的串流、思考、代理與圖片生成的完整指南，請參閱專門的[串流互動](/docs/streaming/)指南。


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
          if event.event_type == "step.delta":
              if event.delta.type == "text":
                  print(event.delta.text, end="")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
        const stream = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Explain how AI works",
          stream: true,
        });

        for await (const event of stream) {
          if (event.event_type === "step.delta") {
            if (event.delta.type === "text") {
              process.stdout.write(event.delta.text);
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.InteractionSSEEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEStreamEvent;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.StepDelta;
      import com.google.genai.gaos.models.interactions.StepDeltaData;
      import com.google.genai.gaos.models.interactions.TextDelta;
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
        for (InteractionSSEStreamEvent streamEvent : stream) {
          InteractionSSEEvent event = streamEvent.data().orElse(null);
          if (event instanceof StepDelta stepDelta) {
            StepDeltaData delta = stepDelta.delta().orElse(null);
            if (delta instanceof TextDelta textDelta) {
              System.out.print(textDelta.text().orElse(""));
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
                  Input:  interactions.NewInteractionsInput("Explain how AI works"),
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

      ```shell
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

=== "CLI"

      ```bash
      gemini-api generate "Explain how AI works"
      ```


## 多輪對話 {#multi-turn-conversations}

Interactions API 支援多輪對話，透過 `previous_interaction_id` 將多次互動串連起來。每一輪都是一次獨立的互動，API 會自動管理對話記錄。


!!! note " "

      與其他需要你手動管理對話記錄的 API 不同，Interactions API 會在伺服器端處理對話狀態。你只要傳入上一次互動的 `id`，即可繼續對話。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction1 = client.interactions.create(
          model="gemini-4-hydrogen",
          input="I have 2 dogs in my house.",
      )
      print(interaction1.output_text)

      interaction2 = client.interactions.create(
          model="gemini-4-hydrogen",
          input="How many paws are in my house?",
          previous_interaction_id=interaction1.id,
      )
      print(interaction2.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
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
      }

      await main();
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

          // First turn
          turn1, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Hello, I have 2 dogs in my house."),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if turn1.Interaction.OutputText != nil {
              fmt.Printf("Model: %s\n", *turn1.Interaction.OutputText)
          }

          // Second turn (chained using PreviousInteractionID)
          turn2, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:                 interactions.Model("gemini-4-hydrogen"),
                  PreviousInteractionID: turn1.Interaction.ID,
                  Input:                 interactions.NewInteractionsInput("How many paws are in my house?"),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if turn2.Interaction.OutputText != nil {
              fmt.Printf("Model: %s\n", *turn2.Interaction.OutputText)
          }
      }
      ```

=== "REST"

      ```shell
      RESPONSE1=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "I have 2 dogs in my house."
        }')

      INTERACTION_ID=$(echo "$RESPONSE1" | jq -r '.id')

      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "I have two dogs in my house. How many paws are in my house?",
          "previous_interaction_id": "'$INTERACTION_ID'"
        }'
      ```

=== "CLI"

      ```bash
      ID=$(gemini-api generate "I have 2 dogs in my house." --stream=false --jq '.id')
      gemini-api generate "How many paws are in my house?" --previous-interaction-id "$ID"
      ```


將 `previous_interaction_id` 與串流方法結合，也可以把串流用於多輪對話。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction1 = client.interactions.create(
          model="gemini-4-hydrogen",
          input="I have 2 dogs in my house.",
      )
      print(interaction1.output_text)

      stream = client.interactions.create(
          model="gemini-4-hydrogen",
          input="How many paws are in my house?",
          previous_interaction_id=interaction1.id,
          stream=True
      )
      for event in stream:
          if event.event_type == "step.delta":
              if event.delta.type == "text":
                  print(event.delta.text, end="")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
        const interaction1 = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "I have 2 dogs in my house.",
        });
        console.log("Response 1:", interaction1.output_text);

        const stream = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "How many paws are in my house?",
          previous_interaction_id: interaction1.id,
          stream: true,
        });
        for await (const event of stream) {
          if (event.event_type === "step.delta") {
            if (event.delta.type === "text") {
              process.stdout.write(event.delta.text);
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionSSEEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEStreamEvent;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.StepDelta;
      import com.google.genai.gaos.models.interactions.StepDeltaData;
      import com.google.genai.gaos.models.interactions.TextDelta;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.CreateInteractionResponse;
      import com.google.genai.gaos.utils.EventStream;

      Client client = new Client();

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
              .stream(true)
              .build();

      CreateInteractionResponse response2 =
          client.interactions.create(CreateInteractionRequestBody.of(params2));

      try (EventStream<InteractionSSEStreamEvent> stream = response2.events()) {
        for (InteractionSSEStreamEvent streamEvent : stream) {
          InteractionSSEEvent event = streamEvent.data().orElse(null);
          if (event instanceof StepDelta stepDelta) {
            StepDeltaData delta = stepDelta.delta().orElse(null);
            if (delta instanceof TextDelta textDelta) {
              System.out.print(textDelta.text().orElse(""));
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

          turn1, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Hello, I have 2 dogs in my house."),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          res2, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:                 interactions.Model("gemini-4-hydrogen"),
                  PreviousInteractionID: turn1.Interaction.ID,
                  Input:                 interactions.NewInteractionsInput("How many paws are in my house?"),
                  Stream:                genai.Ptr(true),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          stream := res2.InteractionSSEStreamEvent
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

      ```shell
      RESPONSE1=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "I have 2 dogs in my house."
        }')
      INTERACTION_ID=$(echo "$RESPONSE1" | jq -r '.id')

      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        --no-buffer \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "How many paws are in my house?",
          "previous_interaction_id": "'$INTERACTION_ID'",
          "stream": true
        }'
      ```


## 無狀態對話 {#stateless-conversations}

預設情況下，當你使用 `previous_interaction_id` 時，Interactions API 會在伺服器端管理對話狀態。不過，你也可以在用戶端自行管理對話記錄，以無狀態模式運作。

使用無狀態模式的方法如下：

1. 在請求中設定 `store=false`，選擇不使用伺服器端儲存。
2. 在用戶端將對話記錄維護為 **steps** 陣列。
3. 在後續請求中，將累積的 steps 傳入 `input` 欄位，並把你的新一輪內容附加為 `user_input` step。


!!! note " "

      如果模型使用「思考」或工具，你**必須**完整保留所有模型產生的 steps（例如 `thought` 與 `function_call` steps），並依原樣重新傳送，因為其中包含繼續對話所需的簽章。


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

      async function main() {
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
      }

      await main();
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Step{
                      interactions.NewStep(interactions.UserInputStep{
                          Content: []interactions.Content{
                              interactions.NewContent(interactions.TextContent{
                                  Text: "Hello, I have 2 dogs in my house.",
                              }),
                          },
                      }),
                      interactions.NewStep(interactions.ModelOutputStep{
                          Content: []interactions.Content{
                              interactions.NewContent(interactions.TextContent{
                                  Text: "That's great! Two dogs must keep your house lively.",
                              }),
                          },
                      }),
                      interactions.NewStep(interactions.UserInputStep{
                          Content: []interactions.Content{
                              interactions.NewContent(interactions.TextContent{
                                  Text: "How many paws are in my house?",
                              }),
                          },
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

      ```shell
      # Turn 1: Send request with store: false
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

      # Extract the steps from response
      MODEL_STEPS=$(echo "$RESPONSE1" | jq '.steps')

      # Reconstruct the full history for Turn 2 by combining:
      # 1. First user input
      # 2. Model response steps
      # 3. Second user input
      HISTORY=$(jq -n \
        --argjson first_input '[{"type": "user_input", "content": "I have 2 dogs in my house."}]' \
        --argjson model_steps "$MODEL_STEPS" \
        --argjson second_input '[{"type": "user_input", "content": "How many paws are in my house?"}]' \
        "'"'"'$first_input + $model_steps + $second_input'"'"'")

      # Turn 2: Send the full history
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


## 提示詞技巧 {#prompting-tips}

如需充分發揮 Gemini 效能的建議，請參閱我們的[提示詞工程指南](/docs/prompting-strategies/)。

## 下一步 {#whats-next}

* 試用 [Google AI Studio 中的 Gemini](https://aistudio.google.com)。

* 嘗試使用[結構化輸出](/docs/structured-output/)，取得類似 JSON 的回應。

* 探索 Gemini 的[圖片](/docs/image-understanding/)、[影片](/docs/video-understanding/)、[音訊](/docs/audio/)與[文件](/docs/document-processing/)理解能力。

* 瞭解多模態[檔案提示策略](/docs/files/#prompt-guide)。


