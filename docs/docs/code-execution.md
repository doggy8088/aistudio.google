# 程式碼執行

Gemini API 提供程式碼執行工具，讓模型能生成並執行 Python 程式碼。模型接著可以從程式碼執行結果中反覆學習，直到得出最終輸出。您可以利用程式碼執行，建置能受惠於程式碼推理的應用程式。例如，您可以用程式碼執行來解方程式或處理文字，也可以使用程式碼執行環境內含的[函式庫](/docs/code-execution/#supported-libraries)來執行更專門的任務。

Gemini 只能執行 Python 程式碼。您仍然可以要求 Gemini 以其他語言生成程式碼，但模型無法使用程式碼執行工具來執行它。

## 啟用程式碼執行 {#enable-code-execution}

若要啟用程式碼執行，請在模型上設定程式碼執行工具，讓模型能生成並執行程式碼。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="What is the sum of the first 50 prime numbers? "
                "Generate and run code for the calculation, and make sure you get all 50.",
          tools=[{"type": "code_execution"}]
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
          elif step.type == "code_execution_call":
              print(step.arguments.code)
          elif step.type == "code_execution_result":
              print(step.result)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: "What is the sum of the first 50 prime numbers? " +
                 "Generate and run code for the calculation, and make sure you get all 50.",
          tools: [{ type: "code_execution" }]
      });

      for (const step of interaction.steps) {
          if (step.type === "model_output") {
              for (const contentBlock of step.content || []) {
                  if (contentBlock.type === "text") {
                      console.log(contentBlock.text);
                  }
              }
          } else if (step.type === "code_execution_call") {
              console.log(step.arguments.code);
          } else if (step.type === "code_execution_result") {
              console.log(step.result);
          }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CodeExecution;
      import com.google.genai.gaos.models.interactions.CodeExecutionCallStep;
      import com.google.genai.gaos.models.interactions.CodeExecutionResultStep;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model("gemini-4-hydrogen")
              .input(
                  InteractionsInput.of(
                      "What is the sum of the first 50 prime numbers? "
                          + "Generate and run code for the calculation, and make sure you get all 50."))
              .tools(Arrays.asList(CodeExecution.builder().build()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      for (Step step : interaction.steps().orElse(Collections.emptyList())) {
        if (step instanceof ModelOutputStep) {
          ModelOutputStep outputStep = (ModelOutputStep) step;
          for (Content contentBlock : outputStep.content().orElse(Collections.emptyList())) {
            if (contentBlock instanceof TextContent) {
              System.out.println(((TextContent) contentBlock).text().orElse(""));
            }
          }
        } else if (step instanceof CodeExecutionCallStep) {
          CodeExecutionCallStep callStep = (CodeExecutionCallStep) step;
          callStep.arguments().ifPresent(args -> System.out.println(args.code().orElse("")));
        } else if (step instanceof CodeExecutionResultStep) {
          CodeExecutionResultStep resultStep = (CodeExecutionResultStep) step;
          System.out.println(resultStep.result().flatMap(r -> r.string()).orElse(""));
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
                  Input: interactions.NewInteractionsInput(
                      "What is the sum of the first 50 prime numbers? " +
                          "Generate and run code for the calculation, and make sure you get all 50.",
                  ),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.CodeExecution{}),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if outStep := step.ModelOutputStep; outStep != nil {
                  for _, contentBlock := range outStep.Content {
                      if textContent := contentBlock.TextContent; textContent != nil {
                          fmt.Println(textContent.GetText())
                      }
                  }
              } else if callStep := step.CodeExecutionCallStep; callStep != nil {
                  if code := callStep.Arguments.GetCode(); code != nil {
                      fmt.Println(*code)
                  }
              } else if resultStep := step.CodeExecutionResultStep; resultStep != nil {
                  if result := resultStep.GetResult().Str; result != nil {
                      fmt.Println(*result)
                  }
              }
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
          "input": "What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50.",
          "tools": [{"type": "code_execution"}]
      }'
      ```


輸出結果大致如下（已為易讀性重新排版）：

```none
Okay, I need to calculate the sum of the first 50 prime numbers. Here's how I'll
approach this:

1. **Generate Prime Numbers:** I'll use an iterative method to find prime
    numbers. I'll start with 2 and check if each subsequent number is divisible
    by any number between 2 and its square root. If not, it's a prime.

2. **Store Primes:** I'll store the prime numbers in a list until I have 50 of
    them.

3. **Calculate the Sum:** Finally, I'll sum the prime numbers in the list.

Here's the Python code to do this:

def is_prime(n):
  """Efficiently checks if a number is prime."""
  if n <= 1:
    return False
  if n <= 3:
    return True
  if n % 2 == 0 or n % 3 == 0:
    return False
  i = 5
  while i * i <= n:
    if n % i == 0 or n % (i + 2) == 0:
      return False
    i += 6
  return True

primes = []
num = 2
while len(primes) < 50:
  if is_prime(num):
    primes.append(num)
  num += 1

sum_of_primes = sum(primes)
print(f'{primes=}')
print(f'{sum_of_primes=}')

primes=[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229]
sum_of_primes=5117

The sum of the first 50 prime numbers is 5117.
```

使用程式碼執行時，模型回傳的輸出由以下幾個內容部分組合而成：

* `text`：模型生成的行內文字
* `code_execution_call`：模型生成、待執行的程式碼
* `code_execution_result`：可執行程式碼的結果

## 搭配圖片的程式碼執行（Gemini 3） {#images}

Gemini 3 Flash 模型現在可以撰寫並執行 Python 程式碼，主動操作與檢視圖片。

**使用案例**

* **縮放與檢視**：當細節太小（例如讀取遠處的儀表）時，模型會自動偵測，並撰寫程式碼裁切該區域、以更高解析度重新檢視。

* **視覺數學**：模型可以使用程式碼執行多步驟計算（例如加總收據上的品項）。

* **圖片標註**：模型可以標註圖片來回答問題，例如畫箭頭標示彼此的關係。


!!! note " "

      模型會自動處理小細節的縮放，但對於其他任務，您應在提示詞中明確要求它使用程式碼，例如「撰寫程式碼計算齒輪的數量」或「旋轉這張圖片讓它擺正」。


## 啟用搭配圖片的程式碼執行 {#code-exec-with-images}

搭配圖片的程式碼執行已在 Gemini 3 Flash 中正式支援。同時啟用程式碼執行工具與思考功能，即可啟動此行為。


=== "Python"

      ```python
      from google import genai
      import requests
      import base64
      from PIL import Image
      import io

      image_path = "https://goo.gle/instrument-img"
      image_bytes = requests.get(image_path).content

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "image", "data": base64.b64encode(image_bytes).decode('utf-8'), "mime_type": "image/jpeg"},
              {"type": "text", "text": "Zoom into the expression pedals and tell me how many pedals are there?"}
          ],
          tools=[{"type": "code_execution"}]
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      display(Image.open(io.BytesIO(base64.b64decode(content_block.data))))
          elif step.type == "code_execution_call":
              print(step.arguments.code)
          elif step.type == "code_execution_result":
              print(step.result)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      async function main() {
        const client = new GoogleGenAI({});

        const imageUrl = "https://goo.gle/instrument-img";
        const response = await fetch(imageUrl);
        const imageArrayBuffer = await response.arrayBuffer();
        const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');

        const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: [
            {
              type: "image",
              data: base64ImageData,
              mime_type: "image/jpeg"
            },
            { type: "text", text: "Zoom into the expression pedals and tell me how many pedals are there?" }
          ],
          tools: [{ type: "code_execution" }]
        });

        for (const step of interaction.steps) {
          if (step.type === "model_output") {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === "text") {
                console.log("Text:", contentBlock.text);
              }
            }
          } else if (step.type === "code_execution_call") {
            console.log(`\nGenerated Code:\n`, step.arguments.code);
          } else if (step.type === "code_execution_result") {
            console.log(`\nExecution Output:\n`, step.result);
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CodeExecution;
      import com.google.genai.gaos.models.interactions.CodeExecutionCallStep;
      import com.google.genai.gaos.models.interactions.CodeExecutionResultStep;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.io.InputStream;
      import java.net.URI;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.Collections;

      String imageUrl = "https://goo.gle/instrument-img";
      byte[] imageBytes;
      try (InputStream in = URI.create(imageUrl).toURL().openStream()) {
        imageBytes = in.readAllBytes();
      }
      String base64Image = Base64.getEncoder().encodeToString(imageBytes);

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model("gemini-4-hydrogen")
              .input(
                  InteractionsInput.ofContent(
                      Arrays.asList(
                          ImageContent.builder()
                              .data(base64Image)
                              .mimeType(ImageContentMimeType.IMAGE_JPEG)
                              .build(),
                          TextContent.builder()
                              .text(
                                  "Zoom into the expression pedals and tell me how many pedals are there?")
                              .build())))
              .tools(Arrays.asList(CodeExecution.builder().build()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      for (Step step : interaction.steps().orElse(Collections.emptyList())) {
        if (step instanceof ModelOutputStep) {
          ModelOutputStep outputStep = (ModelOutputStep) step;
          for (Content contentBlock : outputStep.content().orElse(Collections.emptyList())) {
            if (contentBlock instanceof TextContent) {
              System.out.println(((TextContent) contentBlock).text().orElse(""));
            } else if (contentBlock instanceof ImageContent) {
              ImageContent imgContent = (ImageContent) contentBlock;
              if (imgContent.data().isPresent()) {
                byte[] decoded = Base64.getDecoder().decode(imgContent.data().get());
                Files.write(Paths.get("output_image.jpg"), decoded);
              }
            }
          }
        } else if (step instanceof CodeExecutionCallStep) {
          CodeExecutionCallStep callStep = (CodeExecutionCallStep) step;
          callStep.arguments().ifPresent(args -> System.out.println(args.code().orElse("")));
        } else if (step instanceof CodeExecutionResultStep) {
          CodeExecutionResultStep resultStep = (CodeExecutionResultStep) step;
          System.out.println(resultStep.result().flatMap(r -> r.string()).orElse(""));
        }
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "encoding/base64"
          "fmt"
          "io"
          "log"
          "net/http"
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

          imageURL := "https://goo.gle/instrument-img"
          httpResp, err := http.Get(imageURL)
          if err != nil {
              log.Fatal(err)
          }
          defer httpResp.Body.Close()
          imageBytes, err := io.ReadAll(httpResp.Body)
          if err != nil {
              log.Fatal(err)
          }
          base64Image := base64.StdEncoding.EncodeToString(imageBytes)

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.ImageContent{
                          Data:     genai.Ptr(base64Image),
                          MimeType: interactions.ImageContentMimeType("image/jpeg").ToPointer(),
                      }),
                      interactions.NewContent(interactions.TextContent{
                          Text: "Zoom into the expression pedals and tell me how many pedals are there?",
                      }),
                  }),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.CodeExecution{}),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if outStep := step.ModelOutputStep; outStep != nil {
                  for _, contentBlock := range outStep.Content {
                      if textContent := contentBlock.TextContent; textContent != nil {
                          fmt.Println(textContent.GetText())
                      } else if imgContent := contentBlock.ImageContent; imgContent != nil && imgContent.Data != nil {
                          decoded, err := base64.StdEncoding.DecodeString(*imgContent.Data)
                          if err == nil {
                              _ = os.WriteFile("output_image.jpg", decoded, 0644)
                          }
                      }
                  }
              } else if callStep := step.CodeExecutionCallStep; callStep != nil {
                  if code := callStep.Arguments.GetCode(); code != nil {
                      fmt.Println(*code)
                  }
              } else if resultStep := step.CodeExecutionResultStep; resultStep != nil {
                  if result := resultStep.GetResult().Str; result != nil {
                      fmt.Println(*result)
                  }
              }
          }
      }
      ```

=== "REST"

      ```shell
      IMG_URL="https://goo.gle/instrument-img"
      MODEL="gemini-4-hydrogen"

      MIME_TYPE=$(curl -sIL "$IMG_URL" | grep -i '^content-type:' | awk -F ': ' '{print $2}' | sed 's/\r$//' | head -n 1)
      if [[ -z "$MIME_TYPE" || ! "$MIME_TYPE" == image/* ]]; then
        MIME_TYPE="image/jpeg"
      fi

      if [[ "$(uname)" == "Darwin" ]]; then
        IMAGE_B64=$(curl -sL "$IMG_URL" | base64 -b 0)
      elif [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
        IMAGE_B64=$(curl -sL "$IMG_URL" | base64)
      else
        IMAGE_B64=$(curl -sL "$IMG_URL" | base64 -w0)
      fi

      # Use jq to create the JSON payload to avoid "Argument list too long" error with large base64 strings
      echo -n "$IMAGE_B64" > image_b64.txt
      jq -n \
        --rawfile b64 image_b64.txt \
        --arg mime "$MIME_TYPE" \
        '{
          model: "gemini-4-hydrogen",
          input: [
            {type: "image", data: $b64, mime_type: $mime},
            {type: "text", text: "Zoom into the expression pedals and tell me how many pedals are there?"}
          ],
          tools: [{type: "code_execution"}]
        }' > payload.json

      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -H "Api-Revision: 2026-05-20" \
          -d @payload.json
      ```


## 在多輪互動中使用程式碼執行 {#code-in-chat}

您也可以使用 `previous_interaction_id`，將程式碼執行作為多輪對話的一部分。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction1 = client.interactions.create(
          model="gemini-4-hydrogen",
          input="I have a math question for you.",
          tools=[{"type": "code_execution"}]
      )
      print(interaction1.output_text)

      interaction2 = client.interactions.create(
          model="gemini-4-hydrogen",
          previous_interaction_id=interaction1.id,
          input="What is the sum of the first 50 prime numbers? "
                "Generate and run code for the calculation, and make sure you get all 50.",
          tools=[{"type": "code_execution"}]
      )

      for step in interaction2.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
          elif step.type == "code_execution_call":
              print(step.arguments.code)
          elif step.type == "code_execution_result":
              print(step.result)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction1 = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: "I have a math question for you.",
          tools: [{ type: "code_execution" }]
      });
      console.log(interaction1.output_text);

      const interaction2 = await client.interactions.create({
          model: "gemini-4-hydrogen",
          previous_interaction_id: interaction1.id,
          input: "What is the sum of the first 50 prime numbers? " +
                 "Generate and run code for the calculation, and make sure you get all 50.",
          tools: [{ type: "code_execution" }]
      });

      for (const step of interaction2.steps) {
          if (step.type === "model_output") {
              for (const contentBlock of step.content || []) {
                  if (contentBlock.type === "text") {
                      console.log(contentBlock.text);
                  }
              }
          } else if (step.type === "code_execution_call") {
              console.log(step.arguments.code);
          } else if (step.type === "code_execution_result") {
              console.log(step.result);
          }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CodeExecution;
      import com.google.genai.gaos.models.interactions.CodeExecutionCallStep;
      import com.google.genai.gaos.models.interactions.CodeExecutionResultStep;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;

      Client client = new Client();

      CreateModelInteraction params1 =
          CreateModelInteraction.builder()
              .model("gemini-4-hydrogen")
              .input(InteractionsInput.of("I have a math question for you."))
              .tools(Arrays.asList(CodeExecution.builder().build()))
              .build();

      Interaction interaction1 =
          client.interactions.create(CreateInteractionRequestBody.of(params1)).interaction().get();
      System.out.println(interaction1.outputText().orElse(""));

      CreateModelInteraction params2 =
          CreateModelInteraction.builder()
              .model("gemini-4-hydrogen")
              .previousInteractionId(interaction1.id().get())
              .input(
                  InteractionsInput.of(
                      "What is the sum of the first 50 prime numbers? "
                          + "Generate and run code for the calculation, and make sure you get all 50."))
              .tools(Arrays.asList(CodeExecution.builder().build()))
              .build();

      Interaction interaction2 =
          client.interactions.create(CreateInteractionRequestBody.of(params2)).interaction().get();

      for (Step step : interaction2.steps().orElse(Collections.emptyList())) {
        if (step instanceof ModelOutputStep) {
          ModelOutputStep outputStep = (ModelOutputStep) step;
          for (Content contentBlock : outputStep.content().orElse(Collections.emptyList())) {
            if (contentBlock instanceof TextContent) {
              System.out.println(((TextContent) contentBlock).text().orElse(""));
            }
          }
        } else if (step instanceof CodeExecutionCallStep) {
          CodeExecutionCallStep callStep = (CodeExecutionCallStep) step;
          callStep.arguments().ifPresent(args -> System.out.println(args.code().orElse("")));
        } else if (step instanceof CodeExecutionResultStep) {
          CodeExecutionResultStep resultStep = (CodeExecutionResultStep) step;
          System.out.println(resultStep.result().flatMap(r -> r.string()).orElse(""));
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

          res1, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("I have a math question for you."),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.CodeExecution{}),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if res1.Interaction.OutputText != nil {
              fmt.Println(*res1.Interaction.OutputText)
          }

          res2, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:                 interactions.Model("gemini-4-hydrogen"),
                  PreviousInteractionID: res1.Interaction.ID,
                  Input: interactions.NewInteractionsInput(
                      "What is the sum of the first 50 prime numbers? " +
                          "Generate and run code for the calculation, and make sure you get all 50.",
                  ),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.CodeExecution{}),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res2.Interaction.Steps {
              if outStep := step.ModelOutputStep; outStep != nil {
                  for _, contentBlock := range outStep.Content {
                      if textContent := contentBlock.TextContent; textContent != nil {
                          fmt.Println(textContent.GetText())
                      }
                  }
              } else if callStep := step.CodeExecutionCallStep; callStep != nil {
                  if code := callStep.Arguments.GetCode(); code != nil {
                      fmt.Println(*code)
                  }
              } else if resultStep := step.CodeExecutionResultStep; resultStep != nil {
                  if result := resultStep.GetResult().Str; result != nil {
                      fmt.Println(*result)
                  }
              }
          }
      }
      ```

=== "REST"

      ```shell
      # First turn
      RESPONSE1=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -H "Api-Revision: 2026-05-20" \
      -d '{
          "model": "gemini-4-hydrogen",
          "input": "I have a math question for you.",
          "tools": [{"type": "code_execution"}]
      }')

      INTERACTION_ID=$(echo $RESPONSE1 | jq -r '.id')

      # Second turn with previous_interaction_id
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -H "Api-Revision: 2026-05-20" \
      -d '{
          "model": "gemini-4-hydrogen",
          "previous_interaction_id": "'"$INTERACTION_ID"'",
          "input": "What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50.",
          "tools": [{"type": "code_execution"}]
      }'
      ```


## 輸入／輸出（I/O） {#input-output}

從 [Gemini 2.0 Flash](/docs/models/) 開始，程式碼執行支援檔案輸入與圖形輸出。運用這些輸入與輸出能力，您可以上傳 CSV 與文字檔案、針對檔案提問，並讓 [Matplotlib](https://matplotlib.org/) 圖形成為回應的一部分。輸出檔案會以行內圖片的形式在回應中回傳。

### I/O 定價 {#input-output-pricing}

使用程式碼執行 I/O 時，您需要支付輸入 tokens 與輸出 tokens 的費用：

**輸入 tokens**：

* 使用者提示詞

**輸出 tokens**：

* 模型生成的程式碼
* 程式碼環境中的程式碼執行輸出
* 思考 token
* 模型生成的摘要

### I/O 細節 {#input-output-details}

使用程式碼執行 I/O 時，請留意以下技術細節：

* 程式碼環境的最長執行時間為 30 秒。

* 若程式碼環境產生錯誤，模型可能決定重新生成程式碼輸出，最多可達 5 次。

* 檔案輸入大小上限受模型的 token 視窗限制。若您上傳的檔案超過模型的最大上下文視窗，API 會回傳錯誤。

* 程式碼執行最適合處理文字與 CSV 檔案。

* 輸入檔案可以行內資料傳入，或使用 [Files API](/docs/files/) 上傳；輸出檔案一律以行內資料回傳。


## 計費 {#billing}

透過 Gemini API 啟用程式碼執行不需額外付費。您將依所使用 Gemini 模型的目前費率，支付輸入與輸出 tokens 的費用。

關於程式碼執行的計費，還有幾點需要知道：

* 您傳入模型的輸入 tokens 只計費一次，並依模型回傳給您的最終輸出 tokens 計費。

* 代表生成程式碼的 token 計為輸出 tokens。生成的程式碼可以包含文字與圖片等多模態輸出。

* 程式碼執行結果也計為輸出 tokens。


計費模式如下圖所示：

![](https://www.gstatic.com/cloud-cms/ecde91a1ae68725124dc8c1532aabd8c.png)

* 您將依所使用 Gemini 模型的目前費率，支付輸入與輸出 tokens 的費用。

* 若 Gemini 在生成回應時使用程式碼執行，原始提示詞、生成的程式碼與執行後程式碼的結果會被標記為*中間 token*，並以*輸入 tokens*計費。

* 接著，Gemini 會生成摘要，並回傳生成的程式碼、執行後程式碼的結果與最終摘要。這些會以*輸出 tokens*計費。

* Gemini API 會在 API 回應中包含中間 token 數量，讓您了解為何除了初始提示詞之外還會出現額外的輸入 tokens。


## 限制 {#limitations}

* 模型只能生成並執行程式碼，無法回傳媒體檔案等其他產物。

* 在某些情況下，啟用程式碼執行可能導致模型輸出的其他方面退步（例如寫故事）。

* 不同模型成功使用程式碼執行的能力存在差異。


## 支援的工具組合 {#supported-tools-combinations}

程式碼執行工具可以與[使用 Google 搜尋接地](/docs/google-search/)結合，支援更複雜的使用案例。

Gemini 4 與 Gemini 3 模型支援將內建工具（如程式碼執行）與自訂工具（函式呼叫）結合使用。

## 支援的函式庫 {#supported-libraries}

程式碼執行環境包含以下函式庫：

* attrs
* chess
* contourpy
* fpdf
* geopandas
* imageio
* jinja2
* joblib
* jsonschema
* jsonschema-specifications
* lxml
* matplotlib
* mpmath
* numpy
* opencv-python
* openpyxl
* packaging
* pandas
* pillow
* protobuf
* pylatex
* pyparsing
* PyPDF2
* python-dateutil
* python-docx
* python-pptx
* reportlab
* scikit-learn
* scipy
* seaborn
* six
* striprtf
* sympy
* tabulate
* tensorflow
* toolz
* xlrd

您無法安裝自己的函式庫。


!!! note " "

      使用程式碼執行時，圖形算繪僅支援 `matplotlib`。


## 後續步驟 {#whats-next}

* 在 Google Colab 中試用[程式碼執行快速入門](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Code_Execution.ipynb)。
* 了解其他 Gemini API 工具：
  * [函式呼叫](/docs/function-calling/)
  * [使用 Google 搜尋接地](/docs/google-search/)
