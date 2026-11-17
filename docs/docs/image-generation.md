# Nano Banana 圖像生成 {#nano-banana-image-generation}

[在 Google AI Studio 中試用](https://aistudio.google.com)

**Nano Banana** 是 Gemini 原生圖像生成功能的名稱。Gemini 能以對話方式生成與處理圖像，可搭配文字、圖像、影片或三者的組合，讓你以前所未有的掌控程度建立、編輯並反覆調整視覺內容。

## 模型選用 {#model-selection}

Nano Banana 指的是 Gemini API 中提供的下列模型：

* **Nano Banana 2.1**：[Gemini Nano Banana 2.1](/docs/models/gemini-nano-banana-2.1/) 模型（`gemini-nano-banana-2.1`）。這是 Nano Banana 2 的更新版，是圖像生成與對話式編輯的主力高效模型。它維持 Flash 等級的速度與成本效率，同時在 1K、2K 與 4K 解析度下提供更佳的視覺品質、文字算繪、多輪一致性，以及 Google 搜尋接地。

* **Nano Banana 2 Lite**：[Gemini 3.1 Flash Lite Image](/docs/models/gemini-3.1-flash-lite-image/) 模型（`gemini-3.1-flash-lite-image`）。這是最快、最便宜的 Gemini 圖像模型，專為速度與規模而設計，適用於速度與成本為首要考量的情境。它並未針對多張參考輸入或多輪連續編輯最佳化。

* **Nano Banana 2**：[Gemini 3.1 Flash Image](/docs/models/gemini-3.1-flash-image/) 模型（`gemini-3.1-flash-image`）。這是上一代的高效主力模型，針對速度、4K 生成與多張參考圖像的一致性最佳化。所有新專案建議改用 Nano Banana 2.1。

* **Nano Banana Pro**：[Gemini 3 Pro Image](/docs/models/gemini-3-pro-image/) 模型（`gemini-3-pro-image`）。這是處理複雜視覺任務的頂級選擇，運用進階推理（「Thinking」）來遵循複雜指令、維持品牌一致性，並算繪高擬真文字。

* **Nano Banana**：[Gemini 2.5 Flash Image](/docs/models/gemini-2.5-flash-image/) 模型（`gemini-2.5-flash-image`）。這是 Nano Banana 系列的舊版模型。建議的遷移路徑是 Nano Banana 2 Lite，可獲得更高的品質、更快的速度與更低的價格。


所有生成的圖像都包含 [SynthID 浮水印](https://deepmind.google/technologies/synthid/)。

## 圖像生成（文字轉圖像）{#image-generation-text-to-image}


=== "Python"

      ```python
      from google import genai
      from PIL import Image
      import base64

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input="Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme",
      )

      with open("generated_image.png", "wb") as f:
          f.write(base64.b64decode(interaction.output_image.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {

        const ai = new GoogleGenAI({});

        const prompt =
          "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: prompt,
        });
        const generatedImage = interaction.output_image;
        if (generatedImage) {
          if (generatedImage && generatedImage.data) {
          const buffer = Buffer.from(generatedImage.data, "base64");
          fs.writeFileSync("gemini-native-image.png", buffer);
        }
          console.log("Image saved as gemini-native-image.png");
        }
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
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Base64;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(
                  InteractionsInput.of(
                      "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputImage().isPresent()
          && interaction.outputImage().get().data().isPresent()) {
        byte[] imageBytes =
            Base64.getDecoder().decode(interaction.outputImage().get().data().get());
        Files.write(Paths.get("generated_image.png"), imageBytes);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "encoding/base64"
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput("Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputImage != nil && res.Interaction.OutputImage.Data != nil {
              imageBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputImage.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("generated_image.png", imageBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": [
            {"type": "text", "text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
          ]
        }'
      ```

=== "CLI"

      ```bash
      gemini-api image "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme" \
        --out generated_image.png
      ```


你可以使用 `interaction.output_image` 屬性取得生成的圖像資料，該屬性會傳回最後生成的圖像區塊。


!!! note " "

      注意：對於複雜的文字與圖像交錯輸出（例如含有插圖的故事），便利屬性無法擷取所有部分。你必須改為手動逐一走訪各個步驟，範例請見[交錯的文字與圖像](/docs/image-generation/#interleaved-output)。


## 圖像編輯（文字與圖像轉圖像）{#gemini-image-editing}

**Reminder**：請確認你對上傳的任何圖像都擁有必要的權利。請勿生成侵犯他人權利的內容，包括欺騙、騷擾或傷害他人的影片或圖像。你使用這項生成式 AI 服務須遵守我們的[禁止使用政策](https://policies.google.com/terms/generative-ai/use-policy)。

提供一張圖像，並使用文字提示詞來新增、移除或修改元素、變更風格，或調整調色。

下列範例示範如何上傳以 `base64` 編碼的圖像。如需多張圖像、較大的酬載與支援的 MIME 類型，請參閱[圖像理解](/docs/image-understanding/)頁面。


=== "Python"

      ```python
      from google import genai
      from PIL import Image
      import base64

      client = genai.Client()

      with open("/path/to/cat_image.png", "rb") as f:
          image_bytes = f.read()

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input=[
              {
                "type": "text",
                "text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"
              },
              {
                  "type": "image",
                  "data": base64.b64encode(image_bytes).decode('utf-8'),
                  "mime_type": "image/png"
              }
          ],
      )

      with open("generated_image.png", "wb") as f:
          f.write(base64.b64decode(interaction.output_image.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {

        const ai = new GoogleGenAI({});

        const imagePath = "path/to/cat_image.png";
        const imageData = fs.readFileSync(imagePath);
        const base64Image = imageData.toString("base64");

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: [
            { type: "text", text: "Create a picture of my cat eating a nano-banana in a" +
                    "fancy restaurant under the Gemini constellation" },
            {
              type: "image",
              mime_type: "image/png",
              data: base64Image
            },
          ],
        });
        const generatedImage = interaction.output_image;
        if (generatedImage) {
          if (generatedImage && generatedImage.data) {
          const buffer = Buffer.from(generatedImage.data, "base64");
          fs.writeFileSync("gemini-native-image.png", buffer);
        }
          console.log("Image saved as gemini-native-image.png");
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
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
      import java.util.List;

      Client client = new Client();

      byte[] inputBytes = Files.readAllBytes(Paths.get("/path/to/cat_image.png"));
      String base64Image = Base64.getEncoder().encodeToString(inputBytes);

      Content textContent =
          TextContent.builder()
              .text("Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme")
              .build();
      Content imageContent =
          ImageContent.builder()
              .data(base64Image)
              .mimeType(ImageContentMimeType.IMAGE_PNG)
              .build();

      List<Content> contents = Arrays.asList(textContent, imageContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputImage().isPresent()
          && interaction.outputImage().get().data().isPresent()) {
        byte[] outputBytes =
            Base64.getDecoder().decode(interaction.outputImage().get().data().get());
        Files.write(Paths.get("generated_image.png"), outputBytes);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "encoding/base64"
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

          inputBytes, err := os.ReadFile("/path/to/cat_image.png")
          if err != nil {
              log.Fatal(err)
          }
          base64Image := base64.StdEncoding.EncodeToString(inputBytes)

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme",
                      }),
                      interactions.NewContent(interactions.ImageContent{
                          Data:     genai.Ptr(base64Image),
                          MimeType: interactions.ImageContentMimeTypeImagePng.ToPointer(),
                      }),
                  }),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputImage != nil && res.Interaction.OutputImage.Data != nil {
              outputBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputImage.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("generated_image.png", outputBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -H "Api-Revision: 2026-05-20" \
          -d "{
            \"model\": \"gemini-nano-banana-2.1\",
            \"input\": [
              {\"type\": \"text\", \"text\": \"Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation\"},
              {
                \"type\": \"image\",
                \"mime_type\": \"image/jpeg\",
                \"data\": \"[BASE64_IMAGE_DATA]\"
              }
            ]
          }"
      ```

=== "CLI"

      ```bash
      gemini-api image "Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation" \
        -i /path/to/cat_image.png \
        --out generated_image.png
      ```


### 多輪圖像編輯 {#multi-turn-image-editing}

以對話方式持續生成與編輯圖像。多輪對話是反覆調整圖像的推薦方式。下列範例示範以提示詞生成一張說明光合作用的資訊圖表。


=== "Python"

      ```python
      from google import genai
      import base64

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input="Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader.",
          tools=[{"type": "google_search"}],
      )

      with open("photosynthesis.png", "wb") as f:
          f.write(base64.b64decode(interaction.output_image.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      const ai = new GoogleGenAI({});

      async function main() {
        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader.",
          tools: [{"type": "google_search"}],
        });

        const generatedImage = interaction.output_image;
        if (generatedImage) {
          if (generatedImage && generatedImage.data) {
          const buffer = Buffer.from(generatedImage.data, "base64");
          fs.writeFileSync("photosynthesis.png", buffer);
        }
          console.log("Image saved as photosynthesis.png");
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.GoogleSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(
                  InteractionsInput.of(
                      "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader."))
              .tools(Arrays.asList(new GoogleSearch()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputImage().isPresent()
          && interaction.outputImage().get().data().isPresent()) {
        byte[] imageBytes =
            Base64.getDecoder().decode(interaction.outputImage().get().data().get());
        Files.write(Paths.get("photosynthesis.png"), imageBytes);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "encoding/base64"
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput(`Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the "ingredients" (sunlight, water, CO2) and the "finished dish" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader.`),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.GoogleSearch{}),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputImage != nil && res.Interaction.OutputImage.Data != nil {
              imageBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputImage.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("photosynthesis.png", imageBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": [
            {"type": "text", "text": "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plants favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids cookbook, suitable for a 4th grader."}
          ],
          "tools": [{"type": "google_search"}]
        }'
      ```

=== "CLI"

      ```bash
      ID=$(gemini-api image "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food. Show the \"ingredients\" (sunlight, water, CO2) and the \"finished dish\" (sugar/energy). The style should be like a page from a colorful kids' cookbook, suitable for a 4th grader." \
        --body '{"tools":[{"type":"google_search"}]}' \
        --out photosynthesis.png \
        --jq '.response_id')
      ```


![AI 生成的光合作用資訊圖表](https://www.gstatic.com/cloud-cms/bb7eae3c8034fd8aded280176d387543.png)接著你可以使用 `previous_interaction_id`，將圖表上的語言改為西班牙文。


=== "Python"

      ```python
      interaction_2 = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input="Update this infographic to be in Spanish. Do not change any other elements of the image.",
          previous_interaction_id=interaction.id,
          response_format={
              "type": "image",
              "mime_type": "image/jpeg",
              "aspect_ratio": "16:9",
              "image_size": "2K"
          },
      )

      generated_image = interaction_2.output_image
      if generated_image:
          with open("photosynthesis_spanish.png", "wb") as f:
              f.write(base64.b64decode(generated_image.data))
      ```

=== "JavaScript"

      ```javascript
      const interaction2 = await ai.interactions.create({
        model: "gemini-nano-banana-2.1",
        input: "Update this infographic to be in Spanish. Do not change any other elements of the image.",
        previous_interaction_id: interaction.id,
        response_format: {
          type: "image",
          mime_type: "image/png",
          aspect_ratio: "16:9",
          image_size: "2K"
        },
      });

      const generatedImage = interaction2.output_image;
      if (generatedImage) {
        if (generatedImage && generatedImage.data) {
          const buffer = Buffer.from(generatedImage.data, "base64");
          fs.writeFileSync("photosynthesis_spanish.png", buffer);
        }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.GoogleSearch;
      import com.google.genai.gaos.models.interactions.ImageResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatAspectRatio;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatImageSize;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;

      Client client = new Client();

      CreateModelInteraction turn1Params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(
                  InteractionsInput.of(
                      "Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food."))
              .tools(Arrays.asList(new GoogleSearch()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(turn1Params)).interaction().get();

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  ImageResponseFormat.builder()
                      .mimeType(ImageResponseFormatMimeType.IMAGE_JPEG)
                      .aspectRatio(ImageResponseFormatAspectRatio.of("16:9"))
                      .imageSize(ImageResponseFormatImageSize.TWO_K)
                      .build()));

      CreateModelInteraction turn2Params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(
                  InteractionsInput.of(
                      "Update this infographic to be in Spanish. Do not change any other elements of the image."))
              .previousInteractionId(interaction.id().orElse(""))
              .responseFormat(format)
              .build();

      Interaction interaction2 =
          client.interactions.create(CreateInteractionRequestBody.of(turn2Params)).interaction().get();

      if (interaction2.outputImage().isPresent()
          && interaction2.outputImage().get().data().isPresent()) {
        byte[] imageBytes =
            Base64.getDecoder().decode(interaction2.outputImage().get().data().get());
        Files.write(Paths.get("photosynthesis_spanish.png"), imageBytes);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "encoding/base64"
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

          res1, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput("Create a vibrant infographic that explains photosynthesis as if it were a recipe for a plant's favorite food."),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.GoogleSearch{}),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.ImageResponseFormat{
                  MimeType:    interactions.ImageResponseFormatMimeTypeImageJpeg.ToPointer(),
                  AspectRatio: interactions.ImageResponseFormatAspectRatio("16:9").ToPointer(),
                  ImageSize:   interactions.ImageResponseFormatImageSizeTwoK.ToPointer(),
              }),
          )

          res2, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:                 interactions.Model("gemini-nano-banana-2.1"),
                  Input:                 interactions.NewInteractionsInput("Update this infographic to be in Spanish. Do not change any other elements of the image."),
                  PreviousInteractionID: res1.Interaction.ID,
                  ResponseFormat:        genai.Ptr(format),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res2.Interaction.OutputImage != nil && res2.Interaction.OutputImage.Data != nil {
              imageBytes, err := base64.StdEncoding.DecodeString(*res2.Interaction.OutputImage.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("photosynthesis_spanish.png", imageBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": "Update this infographic to be in Spanish. Do not change any other elements of the image.",
          "previous_interaction_id": "[PREVIOUS_INTERACTION_ID]",
          "response_format": {
            "type": "image",
            "mime_type": "image/jpeg",
            "aspect_ratio": "16:9",
            "image_size": "2K"
          }
        }'
      ```

=== "CLI"

      ```bash
      gemini-api image "Update this infographic to be in Spanish. Do not change any other elements of the image." \
        --previous-interaction-id "$ID" \
        --output-mime-type image/jpeg \
        --aspect-ratio 16:9 \
        --image-size 2K \
        --out photosynthesis_spanish.jpg
      ```


![AI 生成的西班牙文光合作用資訊圖表](https://www.gstatic.com/cloud-cms/b435b5da9f72aebf268a1d821a46bd3a.png)## Nano Banana 的功能

Nano Banana 模型提供最先進的圖像生成與編輯能力。Gemini Nano Banana 2.1 與 Gemini 3.1 Flash Image 針對速度與高用量情境最佳化，Gemini 3 Pro Image 則針對專業素材製作最佳化。這些模型運用進階推理來處理最具挑戰性的工作流程，特別擅長複雜的多輪建立與修改任務。

- **高解析度輸出**：內建 1K、2K 與 4K 視覺內容的生成能力。

  - **Gemini 3.1 Flash Image** 新增較小的 512px（0.5K）解析度（Gemini Nano Banana 2.1 不支援）。

- **進階文字算繪**：能為資訊圖表、菜單、圖解與行銷素材生成清晰易讀、風格化的文字。

- **使用 Google 搜尋接地**：模型可將 Google 搜尋作為工具，查核事實並根據即時資料生成圖像（例如目前的天氣圖、股價圖表、近期事件）。

  - **Gemini Nano Banana 2.1 與 Gemini 3.1 Flash Image** 除了網路搜尋外，還整合了 Google 圖片搜尋接地。

- **思考模式**：模型運用「思考」流程來推理複雜的提示詞。它會生成中間的「思考圖像」（在後端可見，但不計費），在產出最終高品質成品前先完善構圖。

- **最多 14 張參考圖像**：混合最多 14 張參考圖像來產出最終圖像。

- **新的長寬比**：Gemini Nano Banana 2.1 與 Gemini 3.1 Flash Image 新增 1:4、4:1、1:8 與 8:1 [長寬比](/docs/image-generation/#aspect-ratios-and-image-size)。


### 最多使用 14 張參考圖像 {#use-14-images}

Nano Banana 模型可讓你混合最多 14 張參考圖像。這 14 張圖像可包括下列內容：

| Gemini Nano Banana 2.1 與 Gemini 3.1 Flash Image | Gemini 3 Pro Image |
| :--- | :--- |
| 最多 10 張高擬真物件圖像，納入最終圖像 | 最多 6 張高擬真物件圖像，納入最終圖像 |
| 最多 4 張角色圖像，以維持角色一致性 | 最多 5 張角色圖像，以維持角色一致性 |
| 不適用 | 最多 3 張圖像，作為風格參考 |


=== "Python"

      ```python
      from google import genai
      from google.genai import types
      from PIL import Image
      import base64

      prompt = "An office group photo of these people, they are making funny faces."

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input=[
              {
                  "type": "text",
                  "text": prompt,
              },
              {
                  "type": "image",
                  "data": base64.b64encode(image_bytes).decode('utf-8'),
                  "mime_type": "image/png"
              },
              {
                  "type": "image",
                  "data": base64.b64encode(image_bytes).decode('utf-8'),
                  "mime_type": "image/png"
              },
              {
                  "type": "image",
                  "data": base64.b64encode(image_bytes).decode('utf-8'),
                  "mime_type": "image/png"
              },
              {
                  "type": "image",
                  "data": base64.b64encode(image_bytes).decode('utf-8'),
                  "mime_type": "image/png"
              },
              {
                  "type": "image",
                  "data": base64.b64encode(image_bytes).decode('utf-8'),
                  "mime_type": "image/png"
              },
          ],
          response_format={
              "type": "image",
              "aspect_ratio": "5:4",
              "image_size": "2K"
          },
      )

      with open("office.png", "wb") as f:
          f.write(base64.b64decode(interaction.output_image.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-nano-banana-2.1",
        input: [
          {
            type: "text",
            text: "An office group photo of these people, they are making funny faces.",
          },
          { type: "image", mime_type: "image/jpeg", data: base64ImageFile1 },
          { type: "image", mime_type: "image/jpeg", data: base64ImageFile2 },
          { type: "image", mime_type: "image/jpeg", data: base64ImageFile3 },
          { type: "image", mime_type: "image/jpeg", data: base64ImageFile4 },
          { type: "image", mime_type: "image/jpeg", data: base64ImageFile5 },
        ],
        response_format: {
          type: "image",
          aspect_ratio: "5:4",
          image_size: "2K",
        },
      });

      if (interaction.output_image && interaction.output_image.data) {
        const buffer = Buffer.from(interaction.output_image.data, 'base64');
        fs.writeFileSync('office.png', buffer);
      }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.ImageResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatAspectRatio;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatImageSize;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      String prompt = "An office group photo of these people, they are making funny faces.";

      byte[] imageBytes = Files.readAllBytes(Paths.get("/path/to/person.png"));
      String base64Image = Base64.getEncoder().encodeToString(imageBytes);

      Content textContent = TextContent.builder().text(prompt).build();
      Content imageContent =
          ImageContent.builder()
              .data(base64Image)
              .mimeType(ImageContentMimeType.IMAGE_PNG)
              .build();

      List<Content> contents =
          Arrays.asList(
              textContent,
              imageContent,
              imageContent,
              imageContent,
              imageContent,
              imageContent);

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  ImageResponseFormat.builder()
                      .aspectRatio(ImageResponseFormatAspectRatio.of("5:4"))
                      .imageSize(ImageResponseFormatImageSize.TWO_K)
                      .build()));

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(InteractionsInput.ofContent(contents))
              .responseFormat(format)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputImage().isPresent()
          && interaction.outputImage().get().data().isPresent()) {
        byte[] outBytes =
            Base64.getDecoder().decode(interaction.outputImage().get().data().get());
        Files.write(Paths.get("office.png"), outBytes);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "encoding/base64"
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

          prompt := "An office group photo of these people, they are making funny faces."

          imageBytes, err := os.ReadFile("/path/to/person.png")
          if err != nil {
              log.Fatal(err)
          }
          base64Image := base64.StdEncoding.EncodeToString(imageBytes)

          textContent := interactions.NewContent(interactions.TextContent{
              Text: prompt,
          })
          imageContent := interactions.NewContent(interactions.ImageContent{
              Data:     genai.Ptr(base64Image),
              MimeType: interactions.ImageContentMimeTypeImagePng.ToPointer(),
          })

          contents := []interactions.Content{
              textContent,
              imageContent,
              imageContent,
              imageContent,
              imageContent,
              imageContent,
          }

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.ImageResponseFormat{
                  AspectRatio: interactions.ImageResponseFormatAspectRatio("5:4").ToPointer(),
                  ImageSize:   interactions.ImageResponseFormatImageSizeTwoK.ToPointer(),
              }),
          )

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:          interactions.Model("gemini-nano-banana-2.1"),
                  Input:          interactions.NewInteractionsInput(contents),
                  ResponseFormat: genai.Ptr(format),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputImage != nil && res.Interaction.OutputImage.Data != nil {
              outBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputImage.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("office.png", outBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
      "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d "{
          \"model\": \"gemini-nano-banana-2.1\",
          \"input\": [
            {\"type\": \"text\", \"text\": \"An office group photo of these people, they are making funny faces.\"},
            {\"type\": \"image\", \"mime_type\": \"image/png\", \"data\": \"[BASE64_DATA_IMG_1]\"},
            {\"type\": \"image\", \"mime_type\": \"image/png\", \"data\": \"[BASE64_DATA_IMG_2]\"},
            {\"type\": \"image\", \"mime_type\": \"image/png\", \"data\": \"[BASE64_DATA_IMG_3]\"},
            {\"type\": \"image\", \"mime_type\": \"image/png\", \"data\": \"[BASE64_DATA_IMG_4]\"},
            {\"type\": \"image\", \"mime_type\": \"image/png\", \"data\": \"[BASE64_DATA_IMG_5]\"}
          ],
          \"response_format\": {
            \"type\": \"image\",
            \"aspect_ratio\": \"5:4\",
            \"image_size\": \"2K\"
          }
        }"
      ```

=== "CLI"

      ```bash
      gemini-api image "An office group photo of these people, they are making funny faces." \
        -i person1.png -i person2.png -i person3.png -i person4.png -i person5.png \
        --aspect-ratio 5:4 \
        --image-size 2K \
        --out office.png
      ```


![AI 生成的辦公室團體照](https://www.gstatic.com/cloud-cms/e4b16a85c6cedde829bc7532c456fe5a.jpeg)### 使用 Google 搜尋接地

使用 [Google 搜尋工具](/docs/google-search/)，根據即時資訊（例如天氣預報、股價圖表或近期事件）生成圖像。

請注意，將 Google 搜尋接地與圖像生成搭配使用時，以圖像為基礎的搜尋結果不會傳遞給生成模型，也會從回應中排除（請見[使用 Google 圖片搜尋接地](/docs/image-generation/#image-search)）。


!!! note " "

      `gemini-3.1-flash-lite-image` 模型不支援 Google 搜尋接地。


=== "Python"

      ```python
      from google import genai
      from google.genai import types
      import base64
      prompt = "Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day"

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input=prompt,
          tools=[{"type": "google_search"}],
          response_format={
              "type": "image",
              "mime_type": "image/jpeg",
              "aspect_ratio": "16:9"
          },
      )

      with open("weather.png", "wb") as f:
          f.write(base64.b64decode(interaction.output_image.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: "Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day",
          tools: [{"type": "google_search"}],
          response_format: {
            type: "image",
            mime_type: "image/png",
            aspect_ratio: "16:9",
            image_size: "2K"
          },
        });

        if (interaction.output_image && interaction.output_image.data) {
          const buffer = Buffer.from(interaction.output_image.data, 'base64');
          fs.writeFileSync('weather.png', buffer);
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.GoogleSearch;
      import com.google.genai.gaos.models.interactions.ImageResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatAspectRatio;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;

      String prompt =
          "Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day";

      Client client = new Client();

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  ImageResponseFormat.builder()
                      .mimeType(ImageResponseFormatMimeType.IMAGE_JPEG)
                      .aspectRatio(ImageResponseFormatAspectRatio.of("16:9"))
                      .build()));

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(InteractionsInput.of(prompt))
              .tools(Arrays.asList(new GoogleSearch()))
              .responseFormat(format)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputImage().isPresent()
          && interaction.outputImage().get().data().isPresent()) {
        byte[] imageBytes =
            Base64.getDecoder().decode(interaction.outputImage().get().data().get());
        Files.write(Paths.get("weather.png"), imageBytes);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "encoding/base64"
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

          prompt := "Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day"

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.ImageResponseFormat{
                  MimeType:    interactions.ImageResponseFormatMimeTypeImageJpeg.ToPointer(),
                  AspectRatio: interactions.ImageResponseFormatAspectRatio("16:9").ToPointer(),
              }),
          )

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput(prompt),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.GoogleSearch{}),
                  },
                  ResponseFormat: genai.Ptr(format),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputImage != nil && res.Interaction.OutputImage.Data != nil {
              imageBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputImage.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("weather.png", imageBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": [
            {"type": "text", "text": "Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day"}
          ],
          "tools": [{"type": "google_search"}],
          "response_format": {
            "type": "image",
            "mime_type": "image/jpeg",
            "aspect_ratio": "16:9"
          }
        }'
      ```

=== "CLI"

      ```bash
      gemini-api image "Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart. Add a visual on what I should wear each day" \
        --body '{"tools":[{"type":"google_search"}]}' \
        --output-mime-type image/jpeg \
        --aspect-ratio 16:9 \
        --out weather.jpg
      ```


![AI 生成的舊金山五日天氣圖表](https://www.gstatic.com/cloud-cms/3444f386f283ac68b9d97cfe37c2f588.png)回應中包含 `google_search_call` 與 `google_search_result` 步驟，以及文字步驟上的行內 `url_citation` 註記：

- **`google_search_result`**：包含 `search_suggestions`，這是一段 HTML 程式碼片段，用於在你的 UI 中算繪搜尋建議。

- **`url_citation` 註記**：文字步驟上的行內引用，將回應的各個部分連結至其網路來源。


### 使用 Google 搜尋進行圖像接地（Nano Banana 2.1 與 3.1 Flash）{#image-search}


!!! note " "

      注意：這項功能僅適用於 Gemini Nano Banana 2.1 與 Gemini 3.1 Flash Image 模型。


使用 Google 圖片搜尋接地，可讓模型將透過 Google 圖片搜尋擷取的網路圖像作為圖像生成的視覺上下文。圖片搜尋是既有的 Google 搜尋接地工具中的一種新搜尋類型，與標準的[網路搜尋](/docs/image-generation/#use-with-grounding)並行運作。

如要啟用圖片搜尋，請在 API 請求中設定 `google_search` 工具，並將 `image_search` 指定於 `search_types` 陣列中。圖片搜尋可單獨使用，也可與網路搜尋搭配使用。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input="A detailed painting of a Timareta butterfly resting on a flower",
          tools=[{
            "type": "google_search",
            "search_types": ["web_search", "image_search"]
          }]
      )
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      async function main() {
        const ai = new GoogleGenAI({});

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: "A detailed painting of a Timareta butterfly resting on a flower",
          tools: [{
            "type": "google_search",
            "search_types": ["web_search", "image_search"]
          }]
        });
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.GoogleSearch;
      import com.google.genai.gaos.models.interactions.GoogleSearchSearchType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      GoogleSearch searchTool =
          GoogleSearch.builder()
              .searchTypes(
                  Arrays.asList(
                      GoogleSearchSearchType.WEB_SEARCH, GoogleSearchSearchType.IMAGE_SEARCH))
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(
                  InteractionsInput.of(
                      "A detailed painting of a Timareta butterfly resting on a flower"))
              .tools(Arrays.asList(searchTool))
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

          searchTool := interactions.GoogleSearch{
              SearchTypes: []interactions.GoogleSearchSearchType{
                  interactions.GoogleSearchSearchTypeWebSearch,
                  interactions.GoogleSearchSearchTypeImageSearch,
              },
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput("A detailed painting of a Timareta butterfly resting on a flower"),
                  Tools: []interactions.Tool{
                      interactions.NewTool(searchTool),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          _ = res
      }
      ```

=== "REST"

      ```shell
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": "A detailed painting of a Timareta butterfly resting on a flower",
          "tools": [{"type": "google_search", "search_types": ["web_search", "image_search"]}]
        }'
      ```


**顯示要求**

將圖片搜尋用於 Google 搜尋接地時，你必須顯示 `search_suggestions`（來自 `google_search_result` 步驟）。完整的使用要求詳見[服務條款](/docs/terms/#grounding-with-google-search)。

**回應**

對於使用圖片搜尋的接地回應，API 會在回應步驟中傳回行內引用與出處中繼資料：

* **`url_citation` 註記**：`model_output` 內文字內容區塊上的行內引用，將生成的內容連結至其來源。

* **`google_search_result`**：包含 `search_suggestions`，這是一段 HTML 程式碼片段，用於在你的 UI 中算繪搜尋建議。


### 影片轉圖像生成（Nano Banana 2.1、3.1 Flash 與 3.1 Flash Lite）{#video-to-image}


!!! note " "

      注意：這項功能僅適用於 Gemini Nano Banana 2.1、Gemini 3.1 Flash Image 與 Gemini 3.1 Flash Lite Image 模型。


影片轉圖像生成可讓你以影片的上下文作為多模態參考，生成新的圖像。這適用於製作高品質的影片縮圖、電影海報、摘要資訊圖表，或受影片場景啟發的新作品。

生成過程中，模型會在上下文中分析影片畫面，擷取視覺主題與關鍵事件，再結合你的文字提示詞合成輸出圖像。

你可以在 API 請求中直接傳入公開的 [YouTube 網址](/docs/video-understanding/#youtube)，或使用 [Files API](/docs/files/) 上傳本機影片檔案。


=== "Python"

      ```python
      from google import genai
      from google.genai import types
      import base64

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input=[
              {
                  "type": "video",
                  "uri": "https://www.youtube.com/watch?v=UTdfxFyOQTI",
                  "mime_type": "video/mp4"
              },
              {"type": "text", "text": "Generate a poster image that captures the key themes of this video."}
          ],
          response_format={"type": "image", "aspect_ratio": "16:9"}
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      with open("video_poster.png", "wb") as f:
                          f.write(base64.b64decode(content_block.data))
                      print("Image saved as video_poster.png")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: [
            {
              type: "video",
              uri: "https://www.youtube.com/watch?v=UTdfxFyOQTI",
              mime_type: "video/mp4"
            },
            { type: "text", text: "Generate a poster image that captures the key themes of this video." }
          ],
          response_format: {
            type: "image",
            aspect_ratio: "16:9"
          }
        });

        for (const step of interaction.steps) {
          if (step.type === "model_output") {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === "text") {
                console.log(contentBlock.text);
              } else if (contentBlock.type === "image") {
                if (contentBlock.data) {
                const buffer = Buffer.from(contentBlock.data, "base64");
                fs.writeFileSync("video_poster.png", buffer);
              }
                console.log("Image saved as video_poster.png");
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatAspectRatio;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.VideoContent;
      import com.google.genai.gaos.models.interactions.VideoContentMimeType;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      Client client = new Client();

      Content videoContent =
          VideoContent.builder()
              .uri("https://www.youtube.com/watch?v=UTdfxFyOQTI")
              .mimeType(VideoContentMimeType.VIDEO_MP4)
              .build();
      Content textContent =
          TextContent.builder()
              .text("Generate a poster image that captures the key themes of this video.")
              .build();

      List<Content> contents = Arrays.asList(videoContent, textContent);

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  ImageResponseFormat.builder()
                      .aspectRatio(ImageResponseFormatAspectRatio.of("16:9"))
                      .build()));

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(InteractionsInput.ofContent(contents))
              .responseFormat(format)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content block : outputStep.content().get()) {
                if (block instanceof TextContent) {
                  System.out.println(((TextContent) block).text().orElse(""));
                } else if (block instanceof ImageContent) {
                  ImageContent img = (ImageContent) block;
                  if (img.data().isPresent()) {
                    byte[] imgBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get("video_poster.png"), imgBytes);
                    System.out.println("Image saved as video_poster.png");
                  }
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

          contents := []interactions.Content{
              interactions.NewContent(interactions.VideoContent{
                  URI:      genai.Ptr("https://www.youtube.com/watch?v=UTdfxFyOQTI"),
                  MimeType: interactions.VideoContentMimeTypeVideoMp4.ToPointer(),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: "Generate a poster image that captures the key themes of this video.",
              }),
          }

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.ImageResponseFormat{
                  AspectRatio: interactions.ImageResponseFormatAspectRatio("16:9").ToPointer(),
              }),
          )

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:          interactions.Model("gemini-nano-banana-2.1"),
                  Input:          interactions.NewInteractionsInput(contents),
                  ResponseFormat: genai.Ptr(format),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, block := range step.ModelOutputStep.Content {
                      if block.TextContent != nil {
                          fmt.Println(block.TextContent.Text)
                      } else if block.ImageContent != nil && block.ImageContent.Data != nil {
                          imgBytes, err := base64.StdEncoding.DecodeString(*block.ImageContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          if err := os.WriteFile("video_poster.png", imgBytes, 0644); err != nil {
                              log.Fatal(err)
                          }
                          fmt.Println("Image saved as video_poster.png")
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": [
            {
              "type": "video",
              "uri": "https://www.youtube.com/watch?v=UTdfxFyOQTI",
              "mime_type": "video/mp4"
            },
            {
              "type": "text",
              "text": "Generate a poster image that captures the key themes of this video."
            }
          ],
          "response_format": {
            "type": "image",
            "aspect_ratio": "16:9"
          }
        }'
      ```

=== "CLI"

      ```bash
      gemini-api image "Generate a poster image that captures the key themes of this video." \
        -i "https://www.youtube.com/watch?v=UTdfxFyOQTI" \
        --aspect-ratio 16:9 \
        --out video_poster.png
      ```


![AI 根據 YouTube 影片生成的資訊圖表](https://www.gstatic.com/cloud-cms/f0d79a97f2742cf79b96cc961e8625bb.jpg)### 生成最高 4K 解析度的圖像

Gemini 3 圖像模型預設生成 1K 圖像，但也能輸出 2K、4K 與 512px（05.K）圖像（僅 Gemini 3.1 Flash Image）。如要生成更高解析度的素材，請指定 `image_size`（位於 `response_format` 中）。

你必須使用大寫的「K」（例如 512px (05.K)、1K、2K、4K）。小寫參數（例如 1k）會遭到拒絕。


=== "Python"

      ```python
      from google import genai
      from google.genai import types
      import base64

      prompt = "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English."

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input=prompt,
          response_format={
              "type": "image",
              "mime_type": "image/jpeg",
              "aspect_ratio": "1:1",
              "image_size": "1K"
          },
      )

      print(interaction.output_text)

      with open("butterfly.png", "wb") as f:
          f.write(base64.b64decode(interaction.output_image.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English.",
          response_format: {
            type: "image",
            mime_type: "image/png",
            aspect_ratio: "1:1",
            image_size: "1K",
          },
        });

        console.log(interaction.output_text);

        if (interaction.output_image && interaction.output_image.data) {
          const buffer = Buffer.from(interaction.output_image.data, 'base64');
          fs.writeFileSync('butterfly.png', buffer);
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatAspectRatio;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatImageSize;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Base64;

      String prompt =
          "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English.";

      Client client = new Client();

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  ImageResponseFormat.builder()
                      .mimeType(ImageResponseFormatMimeType.IMAGE_JPEG)
                      .aspectRatio(ImageResponseFormatAspectRatio.of("1:1"))
                      .imageSize(ImageResponseFormatImageSize.ONE_K)
                      .build()));

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(InteractionsInput.of(prompt))
              .responseFormat(format)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println(interaction.outputText().orElse(""));

      if (interaction.outputImage().isPresent()
          && interaction.outputImage().get().data().isPresent()) {
        byte[] imageBytes =
            Base64.getDecoder().decode(interaction.outputImage().get().data().get());
        Files.write(Paths.get("butterfly.png"), imageBytes);
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

          prompt := "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English."

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.ImageResponseFormat{
                  MimeType:    interactions.ImageResponseFormatMimeTypeImageJpeg.ToPointer(),
                  AspectRatio: interactions.ImageResponseFormatAspectRatio("1:1").ToPointer(),
                  ImageSize:   interactions.ImageResponseFormatImageSizeOneK.ToPointer(),
              }),
          )

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:          interactions.Model("gemini-nano-banana-2.1"),
                  Input:          interactions.NewInteractionsInput(prompt),
                  ResponseFormat: genai.Ptr(format),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputText != nil {
              fmt.Println(*res.Interaction.OutputText)
          }

          if res.Interaction.OutputImage != nil && res.Interaction.OutputImage.Data != nil {
              imageBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputImage.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("butterfly.png", imageBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English.",
          "response_format": {
            "type": "image",
            "mime_type": "image/jpeg",
            "aspect_ratio": "1:1",
            "image_size": "1K"
          }
        }'
      ```

=== "CLI"

      ```bash
      gemini-api image "Da Vinci style anatomical sketch of a dissected Monarch butterfly. Detailed drawings of the head, wings, and legs on textured parchment with notes in English." \
        --output-mime-type image/jpeg \
        --aspect-ratio 1:1 \
        --image-size 1K \
        --out butterfly.jpg
      ```


以下是用這個提示詞生成的範例圖像：

![AI 生成的達文西風格帝王蝶解剖素描](https://www.gstatic.com/cloud-cms/c111455910e372aa2c46d7cb7b0c5d85.png)### 思考流程

Gemini 3 圖像模型是思考模型，會針對複雜的提示詞運用推理流程（「Thinking」）。這項功能預設啟用，且無法在 API 中停用。如需進一步瞭解思考流程，請參閱 [Gemini Thinking](/docs/thinking/) 指南。

模型最多會生成兩張中間圖像，用來測試構圖與邏輯。Thinking 中的最後一張圖像同時也是最終算繪的圖像。

你可以查看導出最終圖像的思考內容。


=== "Python"

      ```python
      for step in interaction.steps:
          if step.type == "thought":
              for content_block in step.summary:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      image = Image.open(io.BytesIO(base64.b64decode(content_block.data)))
                      image.show()
      ```

=== "JavaScript"

      ```javascript
      for (const step of interaction.steps) {
        if (step.type === "thought") {
          for (const contentBlock of step.summary) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              if (contentBlock.data) {
                const buffer = Buffer.from(contentBlock.data, "base64");
                fs.writeFileSync("thought_image.png", buffer);
              }
            }
          }
        }
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
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.ThoughtStep;
      import com.google.genai.gaos.models.interactions.ThoughtSummaryContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Base64;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(
                  InteractionsInput.of(
                      "A futuristic city built inside a giant glass bottle floating in space"))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ThoughtStep) {
            ThoughtStep thoughtStep = (ThoughtStep) step;
            if (thoughtStep.summary().isPresent()) {
              for (ThoughtSummaryContent contentBlock : thoughtStep.summary().get()) {
                if (contentBlock instanceof TextContent) {
                  System.out.println(((TextContent) contentBlock).text().orElse(""));
                } else if (contentBlock instanceof ImageContent) {
                  ImageContent img = (ImageContent) contentBlock;
                  if (img.data().isPresent()) {
                    byte[] imgBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get("thought_image.png"), imgBytes);
                  }
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput("A futuristic city built inside a giant glass bottle floating in space"),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if step.ThoughtStep != nil {
                  for _, contentBlock := range step.ThoughtStep.Summary {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
                      } else if contentBlock.ImageContent != nil && contentBlock.ImageContent.Data != nil {
                          imgBytes, err := base64.StdEncoding.DecodeString(*contentBlock.ImageContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          if err := os.WriteFile("thought_image.png", imgBytes, 0644); err != nil {
                              log.Fatal(err)
                          }
                      }
                  }
              }
          }
      }
      ```


#### 交錯的文字與圖像 {#interleaved-output}

標準的圖像生成模型只會輸出圖像，但某些進階的 Gemini 3 模型（例如 `gemini-3-pro-image`）能在同一個回應中生成交錯的內容，例如同時包含文字區塊與插圖的故事或教學指南。

由於輸出內容複雜且交錯，`.output_image` 或 `.output_text` 等便利屬性無法擷取完整的序列。如要存取並儲存交錯內容，你必須手動逐一走訪 `steps`：


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="gemini-3-pro-image",
          input="Write the story of the lifecycle of a monarch butterfly, interleave illustrations",
      )

      image_counter = 1
      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      filename = f"butterfly_lifecycle_{image_counter}.png"
                      with open(filename, "wb") as f:
                          f.write(base64.b64decode(content_block.data))
                      print(f"\n[Saved illustration: {filename}]\n")
                      image_counter += 1
      ```

=== "JavaScript"

      ```javascript
      const interaction = await ai.interactions.create({
          model: "gemini-3-pro-image",
          input: "Write the story of the lifecycle of a monarch butterfly, interleave illustrations",
      });

      let imageCounter = 1;
      for (const step of interaction.steps) {
        if (step.type === "model_output") {
          for (const contentBlock of step.content || []) {
            if (contentBlock.type === "text") {
              console.log(contentBlock.text);
            } else if (contentBlock.type === "image") {
              const buffer = Buffer.from(contentBlock.data, "base64");
              const filename = `butterfly_lifecycle_${imageCounter}.png`;
              fs.writeFileSync(filename, buffer);
              console.log(`\n[Saved illustration: ${filename}]\n`);
              imageCounter++;
            }
          }
        }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Base64;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-3-pro-image"))
              .input(
                  InteractionsInput.of(
                      "Write the story of the lifecycle of a monarch butterfly, interleave illustrations"))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      int imageCounter = 1;
      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  System.out.println(((TextContent) contentBlock).text().orElse(""));
                } else if (contentBlock instanceof ImageContent) {
                  ImageContent img = (ImageContent) contentBlock;
                  if (img.data().isPresent()) {
                    String filename = String.format("butterfly_lifecycle_%d.png", imageCounter);
                    byte[] imgBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get(filename), imgBytes);
                    System.out.printf("%n[Saved illustration: %s]%n", filename);
                    imageCounter++;
                  }
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-3-pro-image"),
                  Input: interactions.NewInteractionsInput("Write the story of the lifecycle of a monarch butterfly, interleave illustrations"),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          imageCounter := 1
          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
                      } else if contentBlock.ImageContent != nil && contentBlock.ImageContent.Data != nil {
                          filename := fmt.Sprintf("butterfly_lifecycle_%d.png", imageCounter)
                          imgBytes, err := base64.StdEncoding.DecodeString(*contentBlock.ImageContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          if err := os.WriteFile(filename, imgBytes, 0644); err != nil {
                              log.Fatal(err)
                          }
                          fmt.Printf("\n[Saved illustration: %s]\n", filename)
                          imageCounter++
                      }
                  }
              }
          }
      }
      ```


#### 控制思考等級 {#thinking-levels}

使用 Gemini Nano Banana 2.1、Gemini 3.1 Flash Image 與 Gemini 3.1 Flash Lite Image 時，你可以控制模型使用的思考量，在品質與延遲之間取得平衡：

| 模型 | 支援的思考等級 | 預設值 |
| :--- | :--- | :--- |
| **Gemini Nano Banana 2.1** | `minimal`、`medium`、`high` | `medium` |
| **Gemini 3.1 Flash Image** | `minimal`、`high` | `minimal` |
| **Gemini 3.1 Flash Lite Image** | `minimal`、`high` | `minimal` |


=== "Python"

      ```python
      from google import genai
      from PIL import Image
      import base64
      import io

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input="A futuristic city built inside a giant glass bottle floating in space",
          generation_config={"thinking_level": "high"},
      )

      print(interaction.output_text)

      image = Image.open(io.BytesIO(base64.b64decode(interaction.output_image.data)))

      image.show()
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: "A futuristic city built inside a giant glass bottle floating in space",
          generation_config: { thinking_level: "high" },
        });

        console.log(interaction.output_text);

        if (interaction.output_image && interaction.output_image.data) {
          const buffer = Buffer.from(interaction.output_image.data, 'base64');
          fs.writeFileSync('image.png', buffer);
        }
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
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Base64;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(
                  InteractionsInput.of(
                      "A futuristic city built inside a giant glass bottle floating in space"))
              .generationConfig(GenerationConfig.builder().thinkingLevel(ThinkingLevel.HIGH).build())
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println(interaction.outputText().orElse(""));

      if (interaction.outputImage().isPresent()
          && interaction.outputImage().get().data().isPresent()) {
        byte[] imageBytes =
            Base64.getDecoder().decode(interaction.outputImage().get().data().get());
        Files.write(Paths.get("futuristic_city.png"), imageBytes);
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput("A futuristic city built inside a giant glass bottle floating in space"),
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

          if res.Interaction.OutputImage != nil && res.Interaction.OutputImage.Data != nil {
              imageBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputImage.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("futuristic_city.png", imageBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```shell
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": "A futuristic city built inside a giant glass bottle floating in space",
          "generation_config": {
            "thinking_level": "high"
          }
        }'
      ```

=== "CLI"

      ```bash
      gemini-api image "A futuristic city built inside a giant glass bottle floating in space" \
        --body '{"generation_config":{"thinking_level":"high"}}' \
        --out bottle_city.png
      ```


請注意，思考模型的思考權杖預設會計費，因為無論你是否查看[思考流程](/docs/image-generation/#thinking-process)，該流程預設都會進行。

## 其他圖像生成模式 {#other-modes}

雖然大多數用途都建議使用 Nano Banana 圖像生成模型，你也可以探索專用的圖像生成模型：

* **Imagen**：Google 的舊版文字轉圖像模型（已關閉）。

* **[Veo](/docs/video/)**：Google 的影片生成模型。


## 批次生成圖像 {#batch-api}

本頁所述的所有圖像生成功能，也能使用 [Batch API](/docs/batch-api/) 以批次工作的方式執行。

## 提示詞指南與策略 {#prompt-guide}

本節提供常見圖像生成與編輯工作流程的提示詞範例與範本。每個範例都包含一個可重複使用的範本，以及一個 Interactions API 的範例提示詞。

### 生成圖像的提示詞 {#image-generation-prompts}

下列範例示範如何使用文字提示詞生成各種類型的圖像。

#### 1. 擬真場景 {#1-photorealistic-scenes}

以豐富的細節描述場景。你描述得越具體，對結果的掌控就越強。


=== "範本"

      ```none
      A photorealistic [type of shot] of a [subject description] in a [setting
      description]. [Description of the light]. Shot from a [camera angle]
      with a [lens type].
      ```

=== "提示詞"

      ```none
      A photorealistic wide-angle shot of a vibrant coral reef teeming with tropical fish. Crystal-clear turquoise water with sunbeams filtering down from the surface, illuminating a sea turtle gliding gracefully over the coral. Shot from a low perspective with a wide-angle lens. Aspect ratio 16:9.
      ```

=== "Python"

      ```python
      from google import genai
      from google.genai import types
      import base64

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input="A photorealistic wide-angle shot of a vibrant coral reef teeming with tropical fish. Crystal-clear turquoise water with sunbeams filtering down from the surface, illuminating a sea turtle gliding gracefully over the coral. Shot from a low perspective with a wide-angle lens. Aspect ratio 16:9.",
          response_format=[
              {
                  "type": "image",
                  "mime_type": "image/jpeg",
                  "aspect_ratio": "16:9",
              }
          ],
      )

      print(interaction.output_text)

      with open("coral_reef.png", "wb") as f:

          f.write(base64.b64decode(interaction.output_image.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: "A photorealistic wide-angle shot of a vibrant coral reef teeming with tropical fish. Crystal-clear turquoise water with sunbeams filtering down from the surface, illuminating a sea turtle gliding gracefully over the coral. Shot from a low perspective with a wide-angle lens. Aspect ratio 16:9.",
          response_format: [
            {
              type: "image",
              mime_type: "image/jpeg",
              aspect_ratio: "16:9",
            }
          ],
        });
        console.log(interaction.output_text);

        if (interaction.output_image && interaction.output_image.data) {
          const buffer = Buffer.from(interaction.output_image.data, 'base64');
          fs.writeFileSync('coral_reef.png', buffer);
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatAspectRatio;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;

      Client client = new Client();

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              Arrays.asList(
                  ResponseFormat.of(
                      ImageResponseFormat.builder()
                          .mimeType(ImageResponseFormatMimeType.IMAGE_JPEG)
                          .aspectRatio(ImageResponseFormatAspectRatio.of("16:9"))
                          .build())));

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(
                  InteractionsInput.of(
                      "A photorealistic wide-angle shot of a vibrant coral reef teeming with tropical fish. Crystal-clear turquoise water with sunbeams filtering down from the surface, illuminating a sea turtle gliding gracefully over the coral. Shot from a low perspective with a wide-angle lens. Aspect ratio 16:9."))
              .responseFormat(format)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println(interaction.outputText().orElse(""));

      if (interaction.outputImage().isPresent()
          && interaction.outputImage().get().data().isPresent()) {
        byte[] imageBytes =
            Base64.getDecoder().decode(interaction.outputImage().get().data().get());
        Files.write(Paths.get("coral_reef.png"), imageBytes);
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

          format := interactions.NewCreateModelInteractionResponseFormat([]interactions.ResponseFormat{
              interactions.NewResponseFormat(interactions.ImageResponseFormat{
                  MimeType:    interactions.ImageResponseFormatMimeTypeImageJpeg.ToPointer(),
                  AspectRatio: interactions.ImageResponseFormatAspectRatio("16:9").ToPointer(),
              }),
          })

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:          interactions.Model("gemini-nano-banana-2.1"),
                  Input:          interactions.NewInteractionsInput("A photorealistic wide-angle shot of a vibrant coral reef teeming with tropical fish. Crystal-clear turquoise water with sunbeams filtering down from the surface, illuminating a sea turtle gliding gracefully over the coral. Shot from a low perspective with a wide-angle lens. Aspect ratio 16:9."),
                  ResponseFormat: genai.Ptr(format),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputText != nil {
              fmt.Println(*res.Interaction.OutputText)
          }

          if res.Interaction.OutputImage != nil && res.Interaction.OutputImage.Data != nil {
              imageBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputImage.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("coral_reef.png", imageBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": "A photorealistic wide-angle shot of a vibrant coral reef teeming with tropical fish. Crystal-clear turquoise water with sunbeams filtering down from the surface, illuminating a sea turtle gliding gracefully over the coral. Shot from a low perspective with a wide-angle lens. Aspect ratio 16:9.",
          "response_format": {
            "type": "image",
            "mime_type": "image/png",
            "aspect_ratio": "16:9"
          }
        }'
      ```


#### 2. 風格化插圖與貼圖 {#2-stylized-illustrations-stickers}

描述藝術風格、主體與媒材。具體說明視覺細節（粗線條、色彩等），才能得到一致的結果。


=== "範本"

      ```none
      A [style] of a [subject, with details about accessories or actions]
      doing [activity]. The design features [visual qualities, e.g., bold outlines,
      cel-shading, etc.] and [color/background preference].
      ```

=== "提示詞"

      ```none
      A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white.
      ```

=== "Python"

      ```python
      from google import genai
      import base64

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input="A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white.",
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      with open("red_panda_sticker.png", "wb") as f:
                          f.write(base64.b64decode(content_block.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: "A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white.",
        });
        for (const step of interaction.steps) {
          if (step.type === "model_output") {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === "text") {
                console.log(contentBlock.text);
              } else if (contentBlock.type === "image") {
                if (contentBlock.data) {
                const buffer = Buffer.from(contentBlock.data, "base64");
                fs.writeFileSync("red_panda_sticker.png", buffer);
              }
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Base64;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(
                  InteractionsInput.of(
                      "A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white."))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  System.out.println(((TextContent) contentBlock).text().orElse(""));
                } else if (contentBlock instanceof ImageContent) {
                  ImageContent img = (ImageContent) contentBlock;
                  if (img.data().isPresent()) {
                    byte[] imgBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get("red_panda_sticker.png"), imgBytes);
                  }
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput("A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white."),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
                      } else if contentBlock.ImageContent != nil && contentBlock.ImageContent.Data != nil {
                          imgBytes, err := base64.StdEncoding.DecodeString(*contentBlock.ImageContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          if err := os.WriteFile("red_panda_sticker.png", imgBytes, 0644); err != nil {
                              log.Fatal(err)
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": "A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It is munching on a green bamboo leaf. The design features bold, clean outlines, simple cel-shading, and a vibrant color palette. The background must be white."
        }'
      ```


![A kawaii-style sticker of a happy red...](https://www.gstatic.com/cloud-cms/239971d11d553532aaf0f70ca49f30ef.png)#### 3. 圖像中的精確文字

Gemini 擅長算繪文字。請清楚說明文字內容、字體風格（以描述方式呈現）與整體設計。專業素材製作請使用 Gemini 3 Pro Image。


=== "範本"

      ```none
      Create a [image type] for [brand/concept] with the text "[text to render]"
      in a [font style]. The design should be [style description], with a
      [color scheme].
      ```

=== "提示詞"

      ```none
      Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way.
      ```

=== "Python"

      ```python
      from google import genai
      import base64

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input="Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way.",
          response_format={"type": "image", "aspect_ratio": "1:1"},
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      with open("logo_example.jpg", "wb") as f:
                          f.write(base64.b64decode(content_block.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: "Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way.",
          response_format: { type: "image", aspect_ratio: "1:1" },
        });
        for (const step of interaction.steps) {
          if (step.type === "model_output") {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === "text") {
                console.log(contentBlock.text);
              } else if (contentBlock.type === "image") {
                if (contentBlock.data) {
                const buffer = Buffer.from(contentBlock.data, "base64");
                fs.writeFileSync("logo_example.jpg", buffer);
              }
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatAspectRatio;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Base64;

      Client client = new Client();

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  ImageResponseFormat.builder()
                      .aspectRatio(ImageResponseFormatAspectRatio.of("1:1"))
                      .build()));

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(
                  InteractionsInput.of(
                      "Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way."))
              .responseFormat(format)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  System.out.println(((TextContent) contentBlock).text().orElse(""));
                } else if (contentBlock instanceof ImageContent) {
                  ImageContent img = (ImageContent) contentBlock;
                  if (img.data().isPresent()) {
                    byte[] imgBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get("logo_example.jpg"), imgBytes);
                  }
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

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.ImageResponseFormat{
                  AspectRatio: interactions.ImageResponseFormatAspectRatio("1:1").ToPointer(),
              }),
          )

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:          interactions.Model("gemini-nano-banana-2.1"),
                  Input:          interactions.NewInteractionsInput("Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way."),
                  ResponseFormat: genai.Ptr(format),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
                      } else if contentBlock.ImageContent != nil && contentBlock.ImageContent.Data != nil {
                          imgBytes, err := base64.StdEncoding.DecodeString(*contentBlock.ImageContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          if err := os.WriteFile("logo_example.jpg", imgBytes, 0644); err != nil {
                              log.Fatal(err)
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": "Create a modern, minimalist logo for a coffee shop called The Daily Grind. The text should be in a clean, bold, sans-serif font. The color scheme is black and white. Put the logo in a circle. Use a coffee bean in a clever way.",
          "response_format": {
            "type": "image",
            "aspect_ratio": "1:1"
          }
        }'
      ```


![Create a modern, minimalist logo for a coffee shop called
'The Daily Grind'...](https://www.gstatic.com/cloud-cms/f501e05c7e3dbb96395eb156fa3faeb4.jpg)#### 4. 產品模型圖與商業攝影

非常適合為電子商務、廣告或品牌製作乾淨、專業的產品照片。


=== "範本"

      ```none
      A high-resolution, studio-lit product photograph of a [product description]
      on a [background surface/description]. The lighting is a [lighting setup,
      e.g., three-point softbox setup] to [lighting purpose]. The camera angle is
      a [angle type] to showcase [specific feature]. Ultra-realistic, with sharp
      focus on [key detail]. [Aspect ratio].
      ```

=== "提示詞"

      ```none
      A high-resolution, studio-lit product photograph of a minimalist ceramic
      coffee mug in matte black, presented on a polished concrete surface. The
      lighting is a three-point softbox setup designed to create soft, diffused
      highlights and eliminate harsh shadows. The camera angle is a slightly
      elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with
      sharp focus on the steam rising from the coffee. Square image.
      ```

=== "Python"

      ```python
      from google import genai
      import base64

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input="A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image.",
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      with open("product_mockup.png", "wb") as f:
                          f.write(base64.b64decode(content_block.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: "A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image.",
        });
        for (const step of interaction.steps) {
          if (step.type === "model_output") {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === "text") {
                console.log(contentBlock.text);
              } else if (contentBlock.type === "image") {
                if (contentBlock.data) {
                const buffer = Buffer.from(contentBlock.data, "base64");
                fs.writeFileSync("product_mockup.png", buffer);
              }
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Base64;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(
                  InteractionsInput.of(
                      "A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image."))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  System.out.println(((TextContent) contentBlock).text().orElse(""));
                } else if (contentBlock instanceof ImageContent) {
                  ImageContent img = (ImageContent) contentBlock;
                  if (img.data().isPresent()) {
                    byte[] imgBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get("product_mockup.png"), imgBytes);
                  }
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput("A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image."),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
                      } else if contentBlock.ImageContent != nil && contentBlock.ImageContent.Data != nil {
                          imgBytes, err := base64.StdEncoding.DecodeString(*contentBlock.ImageContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          if err := os.WriteFile("product_mockup.png", imgBytes, 0644); err != nil {
                              log.Fatal(err)
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": "A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image."
        }'
      ```


![A high-resolution, studio-lit product photograph of a minimalist
ceramic coffee mug...](https://www.gstatic.com/cloud-cms/4c77e8a2b3655d5d94b134b073b976c2.png)#### 5. 極簡與負空間設計

非常適合為網站、簡報或行銷素材製作背景，之後可在其上疊加文字。


=== "範本"

      ```none
      A minimalist composition featuring a single [subject] positioned in the
      [bottom-right/top-left/etc.] of the frame. The background is a vast, empty
      [color] canvas, creating significant negative space. Soft, subtle lighting.
      [Aspect ratio].
      ```

=== "提示詞"

      ```none
      A minimalist composition featuring a single, delicate red maple leaf
      positioned in the bottom-right of the frame. The background is a vast, empty
      off-white canvas, creating significant negative space for text. Soft,
      diffused lighting from the top left. Square image.
      ```

=== "Python"

      ```python
      from google import genai
      import base64

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input="A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image.",
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      with open("minimalist_design.png", "wb") as f:
                          f.write(base64.b64decode(content_block.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: "A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image.",
        });
        for (const step of interaction.steps) {
          if (step.type === "model_output") {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === "text") {
                console.log(contentBlock.text);
              } else if (contentBlock.type === "image") {
                if (contentBlock.data) {
                const buffer = Buffer.from(contentBlock.data, "base64");
                fs.writeFileSync("minimalist_design.png", buffer);
              }
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Base64;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(
                  InteractionsInput.of(
                      "A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image."))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  System.out.println(((TextContent) contentBlock).text().orElse(""));
                } else if (contentBlock instanceof ImageContent) {
                  ImageContent img = (ImageContent) contentBlock;
                  if (img.data().isPresent()) {
                    byte[] imgBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get("minimalist_design.png"), imgBytes);
                  }
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput("A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image."),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
                      } else if contentBlock.ImageContent != nil && contentBlock.ImageContent.Data != nil {
                          imgBytes, err := base64.StdEncoding.DecodeString(*contentBlock.ImageContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          if err := os.WriteFile("minimalist_design.png", imgBytes, 0644); err != nil {
                              log.Fatal(err)
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": "A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image."
        }'
      ```


![A minimalist composition featuring a single, delicate red maple leaf...](https://www.gstatic.com/cloud-cms/eabdf57912bb9e3412cb7ae92f1e7ce6.png)#### 6. 連環圖像（漫畫格／分鏡）

以角色一致性與場景描述為基礎，為視覺說故事建立分格。就文字準確度與說故事能力而言，這類提示詞最適合搭配 Gemini 3 Pro 與 Gemini 3.1 Flash Image。


=== "範本"

      ```none
      Make a 3 panel comic in a [style]. Put the character in a [type of scene].
      ```

=== "提示詞"

      ```none
      Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene.
      ```

=== "Python"

      ```python
      from google import genai
      from PIL import Image
      import base64

      client = genai.Client()

      with open('/path/to/your/man_in_white_glasses.jpg', 'rb') as f:
          image_bytes = f.read()
      text_input = "Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene."

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input=[
              {"type": "text", "text": text_input},
              {
                  "type": "image",
                  "data": base64.b64encode(image_bytes).decode('utf-8'),
                  "mime_type": "image/jpeg"
              }
          ],
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      with open("comic_panel.jpg", "wb") as f:
                          f.write(base64.b64decode(content_block.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const imagePath = "/path/to/your/man_in_white_glasses.jpg";
        const imageData = fs.readFileSync(imagePath);
        const base64Image = imageData.toString("base64");

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: [
            { type: "text", text: "Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene." },
            {
              type: "image",
              mime_type: "image/jpeg",
              data: base64Image
            },
          ],
        });
        for (const step of interaction.steps) {
          if (step.type === "model_output") {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === "text") {
                console.log(contentBlock.text);
              } else if (contentBlock.type === "image") {
                if (contentBlock.data) {
                const buffer = Buffer.from(contentBlock.data, "base64");
                fs.writeFileSync("comic_panel.jpg", buffer);
              }
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      Client client = new Client();

      byte[] imageBytes = Files.readAllBytes(Paths.get("/path/to/your/man_in_white_glasses.jpg"));
      String base64Image = Base64.getEncoder().encodeToString(imageBytes);
      String textInput =
          "Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene.";

      Content textContent = TextContent.builder().text(textInput).build();
      Content imageContent =
          ImageContent.builder()
              .data(base64Image)
              .mimeType(ImageContentMimeType.IMAGE_JPEG)
              .build();

      List<Content> contents = Arrays.asList(textContent, imageContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  System.out.println(((TextContent) contentBlock).text().orElse(""));
                } else if (contentBlock instanceof ImageContent) {
                  ImageContent img = (ImageContent) contentBlock;
                  if (img.data().isPresent()) {
                    byte[] outBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get("comic_panel.jpg"), outBytes);
                  }
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

          imageBytes, err := os.ReadFile("/path/to/your/man_in_white_glasses.jpg")
          if err != nil {
              log.Fatal(err)
          }
          base64Image := base64.StdEncoding.EncodeToString(imageBytes)
          textInput := "Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene."

          contents := []interactions.Content{
              interactions.NewContent(interactions.TextContent{
                  Text: textInput,
              }),
              interactions.NewContent(interactions.ImageContent{
                  Data:     genai.Ptr(base64Image),
                  MimeType: interactions.ImageContentMimeTypeImageJpeg.ToPointer(),
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput(contents),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
                      } else if contentBlock.ImageContent != nil && contentBlock.ImageContent.Data != nil {
                          outBytes, err := base64.StdEncoding.DecodeString(*contentBlock.ImageContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          if err := os.WriteFile("comic_panel.jpg", outBytes, 0644); err != nil {
                              log.Fatal(err)
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": [
            {"type": "text", "text": "Make a 3 panel comic in a gritty, noir art style with high-contrast black and white inks. Put the character in a humurous scene."},
            {"type": "image", "data": "[BASE64_IMAGE_DATA]", "mime_type": "image/jpeg"}
          ]
        }'
      ```


| 輸入 | 輸出 |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/75f6d00e713587601b3fde0d1ce3f39f.jpg) 輸入圖像 | ![](https://www.gstatic.com/cloud-cms/aa62e80cd0c43fa1a4f086d3e4c720fb.jpg) Make a 3 panel comic in a gritty, noir art style... |


#### 7. 使用 Google 搜尋接地 {#grounding-with-search}

使用 Google 搜尋，根據近期或即時資訊生成圖像。這適用於新聞、天氣與其他時效性主題。


=== "提示詞"

      ```none
      Make a simple but stylish graphic of last night's Arsenal game in the Champion's League
      ```

=== "Python"

      ```python
      from google import genai
      from google.genai import types
      import base64

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input="Make a simple but stylish graphic of last night's Arsenal game in the Champion's League",
          tools=[{"type": "google_search"}],
          response_format={"type": "image", "aspect_ratio": "16:9"},
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      with open("football-score.jpg", "wb") as f:
                          f.write(base64.b64decode(content_block.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: "Make a simple but stylish graphic of last night's Arsenal game in the Champion's League",
          tools: [{ type: "google_search" }],
          response_format: { type: "image", aspect_ratio: "16:9", image_size: "2K" },
        });

        for (const step of interaction.steps) {
          if (step.type === "model_output") {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === "text") {
                console.log(contentBlock.text);
              } else if (contentBlock.type === "image") {
                if (contentBlock.data) {
                const buffer = Buffer.from(contentBlock.data, "base64");
                fs.writeFileSync("football-score.jpg", buffer);
              }
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.GoogleSearch;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatAspectRatio;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;

      Client client = new Client();

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  ImageResponseFormat.builder()
                      .aspectRatio(ImageResponseFormatAspectRatio.of("16:9"))
                      .build()));

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(
                  InteractionsInput.of(
                      "Make a simple but stylish graphic of last night's Arsenal game in the Champion's League"))
              .tools(Arrays.asList(new GoogleSearch()))
              .responseFormat(format)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  System.out.println(((TextContent) contentBlock).text().orElse(""));
                } else if (contentBlock instanceof ImageContent) {
                  ImageContent img = (ImageContent) contentBlock;
                  if (img.data().isPresent()) {
                    byte[] imgBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get("football-score.jpg"), imgBytes);
                  }
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

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.ImageResponseFormat{
                  AspectRatio: interactions.ImageResponseFormatAspectRatio("16:9").ToPointer(),
              }),
          )

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput("Make a simple but stylish graphic of last night's Arsenal game in the Champion's League"),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.GoogleSearch{}),
                  },
                  ResponseFormat: genai.Ptr(format),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
                      } else if contentBlock.ImageContent != nil && contentBlock.ImageContent.Data != nil {
                          imgBytes, err := base64.StdEncoding.DecodeString(*contentBlock.ImageContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          if err := os.WriteFile("football-score.jpg", imgBytes, 0644); err != nil {
                              log.Fatal(err)
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": "Make a simple but stylish graphic of last nights Arsenal game in the Champions League",
          "tools": [{"type": "google_search"}],
          "response_format": {
            "type": "image",
            "aspect_ratio": "16:9"
          }
        }'
      ```


![AI 生成的兵工廠足球比分圖表](https://www.gstatic.com/cloud-cms/ab8ab85b1d93b1802adeb3ea7c3b8bea.jpg)### 編輯圖像的提示詞

這些範例示範如何連同文字提示詞一起提供圖像，進行編輯、構圖與風格轉換。

#### 1. 新增與移除元素 {#1-adding-and-removing-elements}

提供一張圖像並描述你要的變更。模型會配合原始圖像的風格、光線與透視。


=== "範本"

      ```none
      Using the provided image of [subject], please [add/remove/modify] [element]
      to/from the scene. Ensure the change is [description of how the change should
      integrate].
      ```

=== "提示詞"

      ```none
      "Using the provided image of my cat, please add a small, knitted wizard hat
      on its head. Make it look like it's sitting comfortably and matches the soft
      lighting of the photo."
      ```

=== "Python"

      ```python
      from google import genai
      from PIL import Image
      import base64

      client = genai.Client()

      with open('/path/to/your/cat_photo.png', 'rb') as f:
          image_bytes = f.read()
      text_input = """Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off."""

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input=[
              {"type": "text", "text": text_input},
              {
                  "type": "image",
                  "data": base64.b64encode(image_bytes).decode('utf-8'),
                  "mime_type": "image/png"
              }
          ],
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      with open("cat_with_hat.png", "wb") as f:
                          f.write(base64.b64decode(content_block.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const imagePath = "/path/to/your/cat_photo.png";
        const imageData = fs.readFileSync(imagePath);
        const base64Image = imageData.toString("base64");

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: [
            { type: "text", text: "Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off." },
            {
              type: "image",
              mime_type: "image/png",
              data: base64Image
            },
          ],
        });
        for (const step of interaction.steps) {
          if (step.type === "model_output") {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === "text") {
                console.log(contentBlock.text);
              } else if (contentBlock.type === "image") {
                if (contentBlock.data) {
                const buffer = Buffer.from(contentBlock.data, "base64");
                fs.writeFileSync("cat_with_hat.png", buffer);
              }
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      Client client = new Client();

      byte[] imageBytes = Files.readAllBytes(Paths.get("/path/to/your/cat_photo.png"));
      String base64Image = Base64.getEncoder().encodeToString(imageBytes);
      String textInput =
          "Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off.";

      Content textContent = TextContent.builder().text(textInput).build();
      Content imageContent =
          ImageContent.builder()
              .data(base64Image)
              .mimeType(ImageContentMimeType.IMAGE_PNG)
              .build();

      List<Content> contents = Arrays.asList(textContent, imageContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  System.out.println(((TextContent) contentBlock).text().orElse(""));
                } else if (contentBlock instanceof ImageContent) {
                  ImageContent img = (ImageContent) contentBlock;
                  if (img.data().isPresent()) {
                    byte[] outBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get("cat_with_hat.png"), outBytes);
                  }
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

          imageBytes, err := os.ReadFile("/path/to/your/cat_photo.png")
          if err != nil {
              log.Fatal(err)
          }
          base64Image := base64.StdEncoding.EncodeToString(imageBytes)
          textInput := "Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off."

          contents := []interactions.Content{
              interactions.NewContent(interactions.TextContent{
                  Text: textInput,
              }),
              interactions.NewContent(interactions.ImageContent{
                  Data:     genai.Ptr(base64Image),
                  MimeType: interactions.ImageContentMimeTypeImagePng.ToPointer(),
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput(contents),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
                      } else if contentBlock.ImageContent != nil && contentBlock.ImageContent.Data != nil {
                          outBytes, err := base64.StdEncoding.DecodeString(*contentBlock.ImageContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          if err := os.WriteFile("cat_with_hat.png", outBytes, 0644); err != nil {
                              log.Fatal(err)
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -d "{
            \"model\": \"gemini-nano-banana-2.1\",
            \"input\": [
                  {\"type\": \"text\", \"text\": \"Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and not falling off.\"},
                  {\"type\": \"image\", \"mime_type\":\"image/png\", \"data\": \"[BASE64_IMAGE_DATA]\"}
              ]
          }"
      ```


| 輸入 | 輸出 |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/4a26c9e6a813d316fcc515db9c6721e8.png) A photorealistic picture of a fluffy ginger cat... | ![](https://www.gstatic.com/cloud-cms/aaf4ca309bb3731c7a607e89dddd8a7a.png) Using the provided image of my cat, please add a small, knitted wizard hat... |


#### 2. 局部重繪（語意遮罩）{#2-inpainting-semantic-masking}

以對話方式定義「遮罩」，只編輯圖像的特定部分，其餘部分保持不動。


=== "範本"

      ```none
      Using the provided image, change only the [specific element] to [new
      element/description]. Keep everything else in the image exactly the same,
      preserving the original style, lighting, and composition.
      ```

=== "提示詞"

      ```none
      "Using the provided image of a living room, change only the blue sofa to be
      a vintage, brown leather chesterfield sofa. Keep the rest of the room,
      including the pillows on the sofa and the lighting, unchanged."
      ```

=== "Python"

      ```python
      from google import genai
      from PIL import Image
      import base64

      client = genai.Client()

      with open('/path/to/your/living_room.png', 'rb') as f:
          image_bytes = f.read()
      text_input = """Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room, including the pillows on the sofa and the lighting, unchanged."""

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input=[
              {
                  "type": "image",
                  "data": base64.b64encode(image_bytes).decode('utf-8'),
                  "mime_type": "image/png"
              },
              {"type": "text", "text": text_input}
          ],
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      with open("living_room_edited.png", "wb") as f:
                          f.write(base64.b64decode(content_block.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const imagePath = "/path/to/your/living_room.png";
        const imageData = fs.readFileSync(imagePath);
        const base64Image = imageData.toString("base64");

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: [
            {
              type: "image",
              mime_type: "image/png",
              data: base64Image
            },
            { type: "text", text: "Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room, including the pillows on the sofa and the lighting, unchanged." },
          ],
        });
        for (const step of interaction.steps) {
          if (step.type === "model_output") {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === "text") {
                console.log(contentBlock.text);
              } else if (contentBlock.type === "image") {
                if (contentBlock.data) {
                const buffer = Buffer.from(contentBlock.data, "base64");
                fs.writeFileSync("living_room_edited.png", buffer);
              }
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      Client client = new Client();

      byte[] imageBytes = Files.readAllBytes(Paths.get("/path/to/your/living_room.png"));
      String base64Image = Base64.getEncoder().encodeToString(imageBytes);
      String textInput =
          "Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room, including the pillows on the sofa and the lighting, unchanged.";

      Content imageContent =
          ImageContent.builder()
              .data(base64Image)
              .mimeType(ImageContentMimeType.IMAGE_PNG)
              .build();
      Content textContent = TextContent.builder().text(textInput).build();

      List<Content> contents = Arrays.asList(imageContent, textContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  System.out.println(((TextContent) contentBlock).text().orElse(""));
                } else if (contentBlock instanceof ImageContent) {
                  ImageContent img = (ImageContent) contentBlock;
                  if (img.data().isPresent()) {
                    byte[] outBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get("living_room_edited.png"), outBytes);
                  }
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

          imageBytes, err := os.ReadFile("/path/to/your/living_room.png")
          if err != nil {
              log.Fatal(err)
          }
          base64Image := base64.StdEncoding.EncodeToString(imageBytes)
          textInput := "Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room, including the pillows on the sofa and the lighting, unchanged."

          contents := []interactions.Content{
              interactions.NewContent(interactions.ImageContent{
                  Data:     genai.Ptr(base64Image),
                  MimeType: interactions.ImageContentMimeTypeImagePng.ToPointer(),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: textInput,
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput(contents),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
                      } else if contentBlock.ImageContent != nil && contentBlock.ImageContent.Data != nil {
                          outBytes, err := base64.StdEncoding.DecodeString(*contentBlock.ImageContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          if err := os.WriteFile("living_room_edited.png", outBytes, 0644); err != nil {
                              log.Fatal(err)
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -d "{
            \"model\": \"gemini-nano-banana-2.1\",
            \"input\": [
              {\"type\": \"image\", \"mime_type\":\"image/png\", \"data\": \"[BASE64_IMAGE_DATA]\"},
              {\"type\": \"text\", \"text\": \"Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room, including the pillows on the sofa and the lighting, unchanged.\"}
            ]
          }"
      ```


| 輸入 | 輸出 |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/c4bc515821aabf9438b4140dd581ee04.png) A wide shot of a modern, well-lit living room... | ![](https://www.gstatic.com/cloud-cms/50e14b41157a17030d665ec71fbe17e0.png) Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa... |


#### 3. 風格轉換 {#3-style-transfer}

提供一張圖像，請模型以不同的藝術風格重新創作其內容。


=== "範本"

      ```none
      Transform the provided photograph of [subject] into the artistic style of [artist/art style]. Preserve the original composition but render it with [description of stylistic elements].
      ```

=== "提示詞"

      ```none
      "Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows."
      ```

=== "Python"

      ```python
      from google import genai
      from PIL import Image
      import base64

      client = genai.Client()

      with open('/path/to/your/city.png', 'rb') as f:
          image_bytes = f.read()
      text_input = """Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows."""

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input=[
              {
                  "type": "image",
                  "data": base64.b64encode(image_bytes).decode('utf-8'),
                  "mime_type": "image/png"
              },
              {"type": "text", "text": text_input}
          ],
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      with open("city_style_transfer.png", "wb") as f:
                          f.write(base64.b64decode(content_block.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});
        const imageData = fs.readFileSync("/path/to/your/city.png");
        const base64Image = imageData.toString("base64");

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: [
            {
              type: "image",
              mime_type: "image/png",
              data: base64Image
            },
            { type: "text", text: "Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows." },
          ],
        });
        for (const step of interaction.steps) {
          if (step.type === "model_output") {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === "text") {
                console.log(contentBlock.text);
              } else if (contentBlock.type === "image") {
                if (contentBlock.data) {
                const buffer = Buffer.from(contentBlock.data, "base64");
                fs.writeFileSync("city_style_transfer.png", buffer);
              }
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      Client client = new Client();

      byte[] imageBytes = Files.readAllBytes(Paths.get("/path/to/your/city.png"));
      String base64Image = Base64.getEncoder().encodeToString(imageBytes);
      String textInput =
          "Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows.";

      Content imageContent =
          ImageContent.builder()
              .data(base64Image)
              .mimeType(ImageContentMimeType.IMAGE_PNG)
              .build();
      Content textContent = TextContent.builder().text(textInput).build();

      List<Content> contents = Arrays.asList(imageContent, textContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  System.out.println(((TextContent) contentBlock).text().orElse(""));
                } else if (contentBlock instanceof ImageContent) {
                  ImageContent img = (ImageContent) contentBlock;
                  if (img.data().isPresent()) {
                    byte[] outBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get("city_style_transfer.png"), outBytes);
                  }
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

          imageBytes, err := os.ReadFile("/path/to/your/city.png")
          if err != nil {
              log.Fatal(err)
          }
          base64Image := base64.StdEncoding.EncodeToString(imageBytes)
          textInput := "Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows."

          contents := []interactions.Content{
              interactions.NewContent(interactions.ImageContent{
                  Data:     genai.Ptr(base64Image),
                  MimeType: interactions.ImageContentMimeTypeImagePng.ToPointer(),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: textInput,
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput(contents),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
                      } else if contentBlock.ImageContent != nil && contentBlock.ImageContent.Data != nil {
                          outBytes, err := base64.StdEncoding.DecodeString(*contentBlock.ImageContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          if err := os.WriteFile("city_style_transfer.png", outBytes, 0644); err != nil {
                              log.Fatal(err)
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -d "{
            \"model\": \"gemini-nano-banana-2.1\",
            \"input\": [
              {\"type\": \"image\", \"mime_type\":\"image/png\", \"data\": \"[BASE64_IMAGE_DATA]\"},
              {\"type\": \"text\", \"text\": \"Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh's 'Starry Night'. Preserve the original composition of buildings and cars, but render all elements with swirling, impasto brushstrokes and a dramatic palette of deep blues and bright yellows.\"}
            ]
          }"
      ```


| 輸入 | 輸出 |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/c6c7a301a3e30f428a159cd359f37827.png) A photorealistic, high-resolution photograph of a busy city street... | ![](https://www.gstatic.com/cloud-cms/e749119638b1abc50d2620ed76a60706.png) Transform the provided photograph of a modern city street at night... |


#### 4. 進階構圖：結合多張圖像 {#4-advanced-composition-combining-multiple-images}

提供多張圖像作為上下文，建立新的合成場景。這非常適合產品模型圖或創意拼貼。


=== "範本"

      ```none
      Create a new image by combining the elements from the provided images. Take
      the [element from image 1] and place it with/on the [element from image 2].
      The final image should be a [description of the final scene].
      ```

=== "提示詞"

      ```none
      "Create a professional e-commerce fashion photo. Take the blue floral dress
      from the first image and let the woman from the second image wear it.
      Generate a realistic, full-body shot of the woman wearing the dress, with
      the lighting and shadows adjusted to match the outdoor environment."
      ```

=== "Python"

      ```python
      from google import genai
      from PIL import Image
      import base64

      client = genai.Client()

      with open('/path/to/your/dress.png', 'rb') as f:
          dress_bytes = f.read()
      with open('/path/to/your/model.png', 'rb') as f:
          model_bytes = f.read()
      text_input = """Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. Generate a realistic, full-body shot of the woman wearing the dress, with the lighting and shadows adjusted to match the outdoor environment."""

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input=[
              {
                  "type": "image",
                  "data": base64.b64encode(dress_bytes).decode('utf-8'),
                  "mime_type": "image/png"
              },
              {
                  "type": "image",
                  "data": base64.b64encode(model_bytes).decode('utf-8'),
                  "mime_type": "image/png"
              },
              {"type": "text", "text": text_input}
          ],
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      with open("fashion_ecommerce_shot.png", "wb") as f:
                          f.write(base64.b64decode(content_block.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const imagePath1 = "/path/to/your/dress.png";
        const imageData1 = fs.readFileSync(imagePath1);
        const base64Image1 = imageData1.toString("base64");
        const imagePath2 = "/path/to/your/model.png";
        const imageData2 = fs.readFileSync(imagePath2);
        const base64Image2 = imageData2.toString("base64");

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: [
            {
              type: "image",
              mime_type: "image/png",
              data: base64Image1
            },
            {
              type: "image",
              mime_type: "image/png",
              data: base64Image2
            },
            { type: "text", text: "Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. Generate a realistic, full-body shot of the woman wearing the dress, with the lighting and shadows adjusted to match the outdoor environment." },
          ],
        });
        for (const step of interaction.steps) {
          if (step.type === "model_output") {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === "text") {
                console.log(contentBlock.text);
              } else if (contentBlock.type === "image") {
                if (contentBlock.data) {
                const buffer = Buffer.from(contentBlock.data, "base64");
                fs.writeFileSync("fashion_ecommerce_shot.png", buffer);
              }
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      Client client = new Client();

      byte[] dressBytes = Files.readAllBytes(Paths.get("/path/to/your/dress.png"));
      byte[] modelBytes = Files.readAllBytes(Paths.get("/path/to/your/model.png"));
      String textInput =
          "Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. Generate a realistic, full-body shot of the woman wearing the dress, with the lighting and shadows adjusted to match the outdoor environment.";

      Content dressContent =
          ImageContent.builder()
              .data(Base64.getEncoder().encodeToString(dressBytes))
              .mimeType(ImageContentMimeType.IMAGE_PNG)
              .build();
      Content modelContent =
          ImageContent.builder()
              .data(Base64.getEncoder().encodeToString(modelBytes))
              .mimeType(ImageContentMimeType.IMAGE_PNG)
              .build();
      Content textContent = TextContent.builder().text(textInput).build();

      List<Content> contents = Arrays.asList(dressContent, modelContent, textContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  System.out.println(((TextContent) contentBlock).text().orElse(""));
                } else if (contentBlock instanceof ImageContent) {
                  ImageContent img = (ImageContent) contentBlock;
                  if (img.data().isPresent()) {
                    byte[] outBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get("fashion_ecommerce_shot.png"), outBytes);
                  }
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

          dressBytes, err := os.ReadFile("/path/to/your/dress.png")
          if err != nil {
              log.Fatal(err)
          }
          modelBytes, err := os.ReadFile("/path/to/your/model.png")
          if err != nil {
              log.Fatal(err)
          }
          textInput := "Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. Generate a realistic, full-body shot of the woman wearing the dress, with the lighting and shadows adjusted to match the outdoor environment."

          contents := []interactions.Content{
              interactions.NewContent(interactions.ImageContent{
                  Data:     genai.Ptr(base64.StdEncoding.EncodeToString(dressBytes)),
                  MimeType: interactions.ImageContentMimeTypeImagePng.ToPointer(),
              }),
              interactions.NewContent(interactions.ImageContent{
                  Data:     genai.Ptr(base64.StdEncoding.EncodeToString(modelBytes)),
                  MimeType: interactions.ImageContentMimeTypeImagePng.ToPointer(),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: textInput,
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput(contents),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
                      } else if contentBlock.ImageContent != nil && contentBlock.ImageContent.Data != nil {
                          outBytes, err := base64.StdEncoding.DecodeString(*contentBlock.ImageContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          if err := os.WriteFile("fashion_ecommerce_shot.png", outBytes, 0644); err != nil {
                              log.Fatal(err)
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -d "{
            \"model\": \"gemini-nano-banana-2.1\",
            \"input\": [
                  {\"type\": \"image\", \"mime_type\":\"image/png\", \"data\": \"[BASE64_IMAGE_DATA_1]\"},
                  {\"type\": \"image\", \"mime_type\":\"image/png\", \"data\": \"[BASE64_IMAGE_DATA_2]\"},
                  {\"type\": \"text\", \"text\": \"Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. Generate a realistic, full-body shot of the woman wearing the dress, with the lighting and shadows adjusted to match the outdoor environment.\"}
            }]
          }"
      ```


| 輸入 1 | 輸入 2 | 輸出 |
| --- | --- | --- |
| ![](https://www.gstatic.com/cloud-cms/ef38320013ceae07bd42686c364a16a3.png) A blue floral summer dress on a neutral background | ![](https://www.gstatic.com/cloud-cms/39a9891907e0a1b80ecb168c32bda34d.png) Full-body shot of a woman with her hair in a bun... | ![](https://www.gstatic.com/cloud-cms/e6ea1787bd4158e76d6490d18301d7fd.png) A woman wearing a blue floral summer dress in an outdoor setting |


#### 5. 高擬真細節保留 {#5-high-fidelity-detail-preservation}

如要確保關鍵細節（例如臉孔或標誌）在編輯過程中獲得保留，請在編輯要求中一併詳細描述這些細節。


=== "範本"

      ```none
      Using the provided images, place [element from image 2] onto [element from
      image 1]. Ensure that the features of [element from image 1] remain
      completely unchanged. The added element should [description of how the
      element should integrate].
      ```

=== "提示詞"

      ```none
      "Take the first image of the woman with brown hair, blue eyes, and a neutral
      expression. Add the logo from the second image onto her black t-shirt.
      Ensure the woman's face and features remain completely unchanged. The logo
      should look like it's naturally printed on the fabric, following the folds
      of the shirt."
      ```

=== "Python"

      ```python
      from google import genai
      from PIL import Image
      import base64

      client = genai.Client()

      with open('/path/to/your/woman.png', 'rb') as f:
          woman_bytes = f.read()
      with open('/path/to/your/logo.png', 'rb') as f:
          logo_bytes = f.read()
      text_input = """Take the first image of the woman with brown hair, blue eyes, and a neutral expression. Add the logo from the second image onto her black t-shirt. Ensure the woman's face and features remain completely unchanged. The logo should look like it's naturally printed on the fabric, following the folds of the shirt."""

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input=[
            {"type": "image", "mime_type":"image/png", "data": base64.b64encode(woman_bytes).decode('utf-8')},
            {"type": "image", "mime_type":"image/png", "data": base64.b64encode(logo_bytes).decode('utf-8')},
            {"type": "text", "text": text_input}
          ],
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      with open("woman_with_logo.png", "wb") as f:
                          f.write(base64.b64decode(content_block.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const imagePath1 = "/path/to/your/woman.png";
        const imageData1 = fs.readFileSync(imagePath1);
        const base64Image1 = imageData1.toString("base64");
        const imagePath2 = "/path/to/your/logo.png";
        const imageData2 = fs.readFileSync(imagePath2);
        const base64Image2 = imageData2.toString("base64");

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: [
            {"type": "image", "mime_type":"image/png", "data": base64Image1},
            {"type": "image", "mime_type":"image/png", "data": base64Image2},
            {"type": "text", "text": "Take the first image of the woman with brown hair, blue eyes, and a neutral expression. Add the logo from the second image onto her black t-shirt. Ensure the woman's face and features remain completely unchanged. The logo should look like it's naturally printed on the fabric, following the folds of the shirt."},
          ],
        });
        for (const step of interaction.steps) {
          if (step.type === "model_output") {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === "text") {
                console.log(contentBlock.text);
              } else if (contentBlock.type === "image") {
                if (contentBlock.data) {
                const buffer = Buffer.from(contentBlock.data, "base64");
                fs.writeFileSync("woman_with_logo.png", buffer);
              }
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      Client client = new Client();

      byte[] womanBytes = Files.readAllBytes(Paths.get("/path/to/your/woman.png"));
      byte[] logoBytes = Files.readAllBytes(Paths.get("/path/to/your/logo.png"));
      String textInput =
          "Take the first image of the woman with brown hair, blue eyes, and a neutral expression. Add the logo from the second image onto her black t-shirt. Ensure the woman's face and features remain completely unchanged. The logo should look like it's naturally printed on the fabric, following the folds of the shirt.";

      Content womanContent =
          ImageContent.builder()
              .data(Base64.getEncoder().encodeToString(womanBytes))
              .mimeType(ImageContentMimeType.IMAGE_PNG)
              .build();
      Content logoContent =
          ImageContent.builder()
              .data(Base64.getEncoder().encodeToString(logoBytes))
              .mimeType(ImageContentMimeType.IMAGE_PNG)
              .build();
      Content textContent = TextContent.builder().text(textInput).build();

      List<Content> contents = Arrays.asList(womanContent, logoContent, textContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  System.out.println(((TextContent) contentBlock).text().orElse(""));
                } else if (contentBlock instanceof ImageContent) {
                  ImageContent img = (ImageContent) contentBlock;
                  if (img.data().isPresent()) {
                    byte[] outBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get("woman_with_logo.png"), outBytes);
                  }
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

          womanBytes, err := os.ReadFile("/path/to/your/woman.png")
          if err != nil {
              log.Fatal(err)
          }
          logoBytes, err := os.ReadFile("/path/to/your/logo.png")
          if err != nil {
              log.Fatal(err)
          }
          textInput := "Take the first image of the woman with brown hair, blue eyes, and a neutral expression. Add the logo from the second image onto her black t-shirt. Ensure the woman's face and features remain completely unchanged. The logo should look like it's naturally printed on the fabric, following the folds of the shirt."

          contents := []interactions.Content{
              interactions.NewContent(interactions.ImageContent{
                  Data:     genai.Ptr(base64.StdEncoding.EncodeToString(womanBytes)),
                  MimeType: interactions.ImageContentMimeTypeImagePng.ToPointer(),
              }),
              interactions.NewContent(interactions.ImageContent{
                  Data:     genai.Ptr(base64.StdEncoding.EncodeToString(logoBytes)),
                  MimeType: interactions.ImageContentMimeTypeImagePng.ToPointer(),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: textInput,
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput(contents),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
                      } else if contentBlock.ImageContent != nil && contentBlock.ImageContent.Data != nil {
                          outBytes, err := base64.StdEncoding.DecodeString(*contentBlock.ImageContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          if err := os.WriteFile("woman_with_logo.png", outBytes, 0644); err != nil {
                              log.Fatal(err)
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -d "{
            \"model\": \"gemini-nano-banana-2.1\",
            \"input\": [
              {\"type\": \"image\", \"mime_type\":\"image/png\", \"data\": \"[BASE64_IMAGE_DATA_1]\"},
              {\"type\": \"image\", \"mime_type\":\"image/png\", \"data\": \"[BASE64_IMAGE_DATA_2]\"},
              {\"type\": \"text\", \"text\": \"Take the first image of the woman with brown hair, blue eyes, and a neutral expression. Add the logo from the second image onto her black t-shirt. Ensure the woman's face and features remain completely unchanged. The logo should look like it's naturally printed on the fabric, following the folds of the shirt.\"}
            ]
          }"
      ```


| 輸入 1 | 輸入 2 | 輸出 |
| --- | --- | --- |
| ![](https://www.gstatic.com/cloud-cms/f1f3d04375e487bc630f1af0e2b081fb.png) A professional headshot of a woman with brown hair and blue eyes... | ![](https://www.gstatic.com/cloud-cms/5c6702cf25e4707c890457d7b315f0b2.png) Modern brand identifier with letters G and A | ![](https://www.gstatic.com/cloud-cms/2b6b85696ca48b750cffa82a29cf56b3.png) Take the first image of the woman with brown hair, blue eyes, and a neutral expression... |


#### 6. 讓事物栩栩如生 {#6-bring-something-to-life}

上傳一張粗略的素描或手稿，請模型將它完善成完整的圖像。


=== "範本"

      ```none
      Turn this rough [medium] sketch of a [subject] into a [style description]
      photo. Keep the [specific features] from the sketch but add [new details/materials].
      ```

=== "提示詞"

      ```none
      "Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting."
      ```

=== "Python"

      ```python
      from google import genai
      from PIL import Image
      import base64

      client = genai.Client()

      with open('/path/to/your/car_sketch.png', 'rb') as f:
          sketch_bytes = f.read()
      text_input = """Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting."""

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input=[
            {"type": "image", "mime_type":"image/png", "data": base64.b64encode(sketch_bytes).decode('utf-8')},
            {"type": "text", "text": text_input}
          ],
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      with open("car_photo.png", "wb") as f:
                          f.write(base64.b64decode(content_block.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
        const ai = new GoogleGenAI({});

        const imagePath = "/path/to/your/car_sketch.png";
        const imageData = fs.readFileSync(imagePath);
        const base64Image = imageData.toString("base64");

        const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: [
            {"type": "image", "mime_type":"image/png", "data": base64Image},
            {"type": "text", "text": "Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting."},
          ],
        });
        for (const step of interaction.steps) {
          if (step.type === "model_output") {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === "text") {
                console.log(contentBlock.text);
              } else if (contentBlock.type === "image") {
                if (contentBlock.data) {
                const buffer = Buffer.from(contentBlock.data, "base64");
                fs.writeFileSync("car_photo.png", buffer);
              }
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      Client client = new Client();

      byte[] sketchBytes = Files.readAllBytes(Paths.get("/path/to/your/car_sketch.png"));
      String textInput =
          "Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting.";

      Content sketchContent =
          ImageContent.builder()
              .data(Base64.getEncoder().encodeToString(sketchBytes))
              .mimeType(ImageContentMimeType.IMAGE_PNG)
              .build();
      Content textContent = TextContent.builder().text(textInput).build();

      List<Content> contents = Arrays.asList(sketchContent, textContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  System.out.println(((TextContent) contentBlock).text().orElse(""));
                } else if (contentBlock instanceof ImageContent) {
                  ImageContent img = (ImageContent) contentBlock;
                  if (img.data().isPresent()) {
                    byte[] outBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get("car_photo.png"), outBytes);
                  }
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

          sketchBytes, err := os.ReadFile("/path/to/your/car_sketch.png")
          if err != nil {
              log.Fatal(err)
          }
          textInput := "Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting."

          contents := []interactions.Content{
              interactions.NewContent(interactions.ImageContent{
                  Data:     genai.Ptr(base64.StdEncoding.EncodeToString(sketchBytes)),
                  MimeType: interactions.ImageContentMimeTypeImagePng.ToPointer(),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: textInput,
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-nano-banana-2.1"),
                  Input: interactions.NewInteractionsInput(contents),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
                      } else if contentBlock.ImageContent != nil && contentBlock.ImageContent.Data != nil {
                          outBytes, err := base64.StdEncoding.DecodeString(*contentBlock.ImageContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          if err := os.WriteFile("car_photo.png", outBytes, 0644); err != nil {
                              log.Fatal(err)
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -d "{
            \"model\": \"gemini-nano-banana-2.1\",
            \"input\": [
              {\"type\": \"image\", \"mime_type\":\"image/png\", \"data\": \"[BASE64_IMAGE_DATA]\"},
              {\"type\": \"text\", \"text\": \"Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines and low profile from the sketch but add metallic blue paint and neon rim lighting.\"}
            ]
          }"
      ```


| 輸入 | 輸出 |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/937f4ad9bbc91213c1b069acf78da4eb.jpg) Rough sketch of a car | ![](https://www.gstatic.com/cloud-cms/93d2f7208f11510ad185f0572c7ca616.jpg) Polished photo of a car |


#### 7. 角色一致性：360 度視角 {#7-character-consistency-360-view}

你可以反覆以提示詞指定不同角度，生成角色的 360 度視角。為獲得最佳效果，請在後續提示詞中納入先前生成的圖像，以維持一致性。對於複雜的姿勢，請納入所選姿勢的參考圖像。


=== "範本"

      ```none
      A studio portrait of [person] against [background], [looking forward/in profile looking right/etc.]
      ```

=== "提示詞"

      ```none
      A studio portrait of this man against white, in profile looking right
      ```

=== "Python"

      ```python
      from google import genai
      from PIL import Image
      import base64

      client = genai.Client()

      with open('/path/to/your/man_in_white_glasses.jpg', 'rb') as f:
          image_bytes = f.read()
      text_input = """A studio portrait of this man against white, in profile looking right"""

      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input={
            {"type": "text", "text": text_input},
            {"type": "image", "mime_type":"image/png", "data": base64.b64encode(image_bytes).decode('utf-8')}
          },
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                  elif content_block.type == "image":
                      with open("man_right_profile.png", "wb") as f:
                          f.write(base64.b64decode(content_block.data))
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      Client client = new Client();

      byte[] imageBytes = Files.readAllBytes(Paths.get("/path/to/your/man_in_white_glasses.jpg"));
      String textInput = "A studio portrait of this man against white, in profile looking right";

      Content textContent = TextContent.builder().text(textInput).build();
      Content imageContent =
          ImageContent.builder()
              .data(Base64.getEncoder().encodeToString(imageBytes))
              .mimeType(ImageContentMimeType.IMAGE_PNG)
              .build();

      List<Content> contents = Arrays.asList(textContent, imageContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  System.out.println(((TextContent) contentBlock).text().orElse(""));
                } else if (contentBlock instanceof ImageContent) {
                  ImageContent img = (ImageContent) contentBlock;
                  if (img.data().isPresent()) {
                    byte[] outBytes = Base64.getDecoder().decode(img.data().get());
                    Files.write(Paths.get("man_right_profile.png"), outBytes);
                  }
                }
              }
            }
          }
        }
      }
      ```


| 輸入 | 輸出 1 | 輸出 2 |
| --- | --- | --- |
| ![](https://www.gstatic.com/cloud-cms/75f6d00e713587601b3fde0d1ce3f39f.jpg) Original image | ![](https://www.gstatic.com/cloud-cms/2143d148c8ca3169e2d42869ab4af6a6.jpg) Man in white glasses looking right | ![](https://www.gstatic.com/cloud-cms/91dd9874fa2cd0fe714418c9a4ba9f5c.jpg) Man in white glasses looking forward |


### 最佳做法 {#best-practices}

如要讓成果從良好提升到出色，請將這些專業策略納入你的工作流程。

* **極度具體**：你提供的細節越多，掌控程度就越高。不要只寫「奇幻盔甲」，而是這樣描述：「華麗的精靈板甲，蝕刻銀葉圖案，高領，肩甲形狀如獵鷹翅膀。」

* **提供上下文與意圖**：說明圖像的「用途」。模型對上下文的理解會影響最終輸出。例如，「為高級極簡保養品牌建立標誌」會比單寫「建立一個標誌」得到更好的結果。

* **反覆調整與完善**：不要期待第一次就得到完美的圖像。利用模型的對話特性進行小幅修改，接著使用這樣的提示詞：「很好，但可以讓光線再暖一點嗎？」或「其他都保持不變，但把角色的表情改得更嚴肅。」

* **使用逐步指令**：對於元素眾多的複雜場景，將提示詞拆成步驟。「首先，建立一個黎明時寧靜薄霧森林的背景。接著，在前景加一座覆滿苔蘚的古老石祭壇。最後，在祭壇上放一把發光的劍。」

* **使用「語意負面提示詞」**：不要說「不要有車」，而是以正向方式描述想要的場景：「一條空無一人、毫無交通跡象的荒涼街道。」

* **掌控鏡頭**：使用攝影與電影語言來掌控構圖，例如 `wide-angle shot`、`macro shot`、`low-angle
perspective` 等術語。


## 限制 {#limitations}

* 為獲得最佳效能，請使用下列語言：EN、ar-EG、de-DE、es-MX、fr-FR、hi-IN、id-ID、it-IT、ja-JP、ko-KR、pt-BR、ru-RU、ua-UA、vi-VN、zh-CN。

* 圖像生成不支援音訊輸入。影片輸入僅支援 Gemini Nano Banana 2.1、Gemini 3.1 Flash Image 與 Gemini 3.1 Flash Lite Image。

* 模型不一定會完全依照使用者明確要求的圖像輸出數量生成。

* `gemini-2.5-flash-image` 最適合以最多 3 張圖像作為輸入；`gemini-3-pro-image` 支援 5 張高擬真圖像，總計最多 14 張圖像。`gemini-nano-banana-2.1` 與 `gemini-3.1-flash-image` 在單一工作流程中，支援最多 4 個角色的相似度與最多 10 個物件的擬真度。

* 為圖像生成文字時，Gemini 的最佳做法是先生成文字，再要求產生包含該文字的圖像。

* `gemini-nano-banana-2.1` 與 `gemini-3.1-flash-image` 的 Google 搜尋接地目前不支援使用網路搜尋中找到的真人圖像。

* 所有生成的圖像都包含 [SynthID 浮水印](https://deepmind.google/technologies/synthid/)。


## 選用設定 {#optional-configurations}

你可以視需要使用 `response_format` 參數，設定輸出格式、長寬比與圖像大小。

### 輸出格式 {#output-format}

模型預設同時傳回文字與圖像回應。你可以在 `response_format` 參數中指定圖像格式，將回應設定為只傳回生成的圖像（省略對話文字）。

如要請求多種模態（例如同時傳回文字與生成的圖像），請改為將格式項目陣列傳入 `response_format`。


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input="Write a short poem about a starry night and generate an image of it.",
          response_format=[
              {"type": "text"},
              {"type": "image"},
          ],
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await ai.interactions.create({
        model: "gemini-nano-banana-2.1",
        input: "Write a short poem about a starry night and generate an image of it.",
        response_format: [
          { type: "text" },
          { type: "image" },
        ],
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageResponseFormat;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormat;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              Arrays.asList(
                  ResponseFormat.of(TextResponseFormat.builder().build()),
                  ResponseFormat.of(ImageResponseFormat.builder().build())));

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(
                  InteractionsInput.of(
                      "Write a short poem about a starry night and generate an image of it."))
              .responseFormat(format)
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

          format := interactions.NewCreateModelInteractionResponseFormat([]interactions.ResponseFormat{
              interactions.NewResponseFormat(interactions.TextResponseFormat{}),
              interactions.NewResponseFormat(interactions.ImageResponseFormat{}),
          })

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:          interactions.Model("gemini-nano-banana-2.1"),
                  Input:          interactions.NewInteractionsInput("Write a short poem about a starry night and generate an image of it."),
                  ResponseFormat: genai.Ptr(format),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          _ = res
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": "Write a short poem about a starry night and generate an image of it.",
          "response_format": [
            { "type": "text" },
            { "type": "image" }
          ]
        }'
      ```

=== "CLI"

      ```bash
      gemini-api image "Write a short poem about a starry night and generate an image of it." \
        --body '{"response_format":[{"type":"text"},{"type":"image"}]}' \
        --raw-response -o json
      ```


### 長寬比與圖像大小 {#aspect-ratios-and-image-size}

模型預設會讓輸出圖像大小與你的輸入圖像相符，否則生成 1:1 的正方形圖像。你可以使用 `aspect_ratio` 與 `image_size` 欄位（位於 `response_format` 下），在 `type` 設為 `"image"` 時控制輸出圖像的長寬比與大小。


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="gemini-nano-banana-2.1",
          input=prompt,
          response_format={
              "type": "image",
              "aspect_ratio": "16:9",
              "image_size": "2K",
          },
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await ai.interactions.create({
          model: "gemini-nano-banana-2.1",
          input: prompt,
          response_format: {
            type: "image",
            aspect_ratio: "16:9",
            image_size: "2K",
          },
        });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatAspectRatio;
      import com.google.genai.gaos.models.interactions.ImageResponseFormatImageSize;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = new Client();
      String prompt = "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  ImageResponseFormat.builder()
                      .aspectRatio(ImageResponseFormatAspectRatio.of("16:9"))
                      .imageSize(ImageResponseFormatImageSize.TWO_K)
                      .build()));

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-nano-banana-2.1"))
              .input(InteractionsInput.of(prompt))
              .responseFormat(format)
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

          prompt := "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.ImageResponseFormat{
                  AspectRatio: interactions.ImageResponseFormatAspectRatio("16:9").ToPointer(),
                  ImageSize:   interactions.ImageResponseFormatImageSizeTwoK.ToPointer(),
              }),
          )

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:          interactions.Model("gemini-nano-banana-2.1"),
                  Input:          interactions.NewInteractionsInput(prompt),
                  ResponseFormat: genai.Ptr(format),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          _ = res
      }
      ```

=== "REST"

      ```bash
      curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-nano-banana-2.1",
          "input": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme",
          "response_format": {
            "type": "image",
            "aspect_ratio": "16:9",
            "image_size": "2K"
          }
        }'
      ```

=== "CLI"

      ```bash
      gemini-api image "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme" \
        --aspect-ratio 16:9 \
        --image-size 2K \
        --out generated_image.png
      ```


下表列出可用的各種比例，以及生成的圖像大小：


=== "Nano Banana 2.1"


    | 長寬比 | 1K 解析度 | 1K 權杖數 | 2K 解析度 | 2K 權杖數 | 4K 解析度 | 4K 權杖數 |
    | --- | --- | --- | --- | --- | --- | --- |
    | **1:1** | 1024x1024 | 1120 | 2048x2048 | 1680 | 4096x4096 | 2520 |
    | **1:4** | 512x2048 | 1120 | 1024x4096 | 1680 | 2048x8192 | 2520 |
    | **1:8** | 384x3072 | 1120 | 768x6144 | 1680 | 1536x12288 | 2520 |
    | **2:3** | 848x1264 | 1120 | 1696x2528 | 1680 | 3392x5056 | 2520 |
    | **3:2** | 1264x848 | 1120 | 2528x1696 | 1680 | 5056x3392 | 2520 |
    | **3:4** | 896x1200 | 1120 | 1792x2400 | 1680 | 3584x4800 | 2520 |
    | **4:1** | 2048x512 | 1120 | 4096x1024 | 1680 | 8192x2048 | 2520 |
    | **4:3** | 1200x896 | 1120 | 2400x1792 | 1680 | 4800x3584 | 2520 |
    | **4:5** | 928x1152 | 1120 | 1856x2304 | 1680 | 3712x4608 | 2520 |
    | **5:4** | 1152x928 | 1120 | 2304x1856 | 1680 | 4608x3712 | 2520 |
    | **8:1** | 3072x384 | 1120 | 6144x768 | 1680 | 12288x1536 | 2520 |
    | **9:16** | 768x1376 | 1120 | 1536x2752 | 1680 | 3072x5504 | 2520 |
    | **16:9** | 1376x768 | 1120 | 2752x1536 | 1680 | 5504x3072 | 2520 |
    | **21:9** | 1584x672 | 1120 | 3168x1344 | 1680 | 6336x2688 | 2520 |

=== "3.1 Flash Image"


    | 長寬比 | 512px 解析度 | 0.5K 權杖數 | 1K 解析度 | 1K 權杖數 | 2K 解析度 | 2K 權杖數 | 4K 解析度 | 4K 權杖數 |
    | --- | --- | --- | --- | --- | --- | --- | --- | --- |
    | **1:1** | 512x512 | 747 | 1024x1024 | 1120 | 2048x2048 | 1680 | 4096x4096 | 2520 |
    | **1:4** | 256x1024 | 747 | 512x2048 | 1120 | 1024x4096 | 1680 | 2048x8192 | 2520 |
    | **1:8** | 192x1536 | 747 | 384x3072 | 1120 | 768x6144 | 1680 | 1536x12288 | 2520 |
    | **2:3** | 424x632 | 747 | 848x1264 | 1120 | 1696x2528 | 1680 | 3392x5056 | 2520 |
    | **3:2** | 632x424 | 747 | 1264x848 | 1120 | 2528x1696 | 1680 | 5056x3392 | 2520 |
    | **3:4** | 448x600 | 747 | 896x1200 | 1120 | 1792x2400 | 1680 | 3584x4800 | 2520 |
    | **4:1** | 1024x256 | 747 | 2048x512 | 1120 | 4096x1024 | 1680 | 8192x2048 | 2520 |
    | **4:3** | 600x448 | 747 | 1200x896 | 1120 | 2400x1792 | 1680 | 4800x3584 | 2520 |
    | **4:5** | 464x576 | 747 | 928x1152 | 1120 | 1856x2304 | 1680 | 3712x4608 | 2520 |
    | **5:4** | 576x464 | 747 | 1152x928 | 1120 | 2304x1856 | 1680 | 4608x3712 | 2520 |
    | **8:1** | 1536x192 | 747 | 3072x384 | 1120 | 6144x768 | 1680 | 12288x1536 | 2520 |
    | **9:16** | 384x688 | 747 | 768x1376 | 1120 | 1536x2752 | 1680 | 3072x5504 | 2520 |
    | **16:9** | 688x384 | 747 | 1376x768 | 1120 | 2752x1536 | 1680 | 5504x3072 | 2520 |
    | **21:9** | 792x168 | 747 | 1584x672 | 1120 | 3168x1344 | 1680 | 6336x2688 | 2520 |

=== "3 Pro Image"


    | 長寬比 | 1K 解析度 | 1K 權杖數 | 2K 解析度 | 2K 權杖數 | 4K 解析度 | 4K 權杖數 |
    | --- | --- | --- | --- | --- | --- | --- |
    | **1:1** | 1024x1024 | 1120 | 2048x2048 | 1120 | 4096x4096 | 2000 |
    | **2:3** | 848x1264 | 1120 | 1696x2528 | 1120 | 3392x5056 | 2000 |
    | **3:2** | 1264x848 | 1120 | 2528x1696 | 1120 | 5056x3392 | 2000 |
    | **3:4** | 896x1200 | 1120 | 1792x2400 | 1120 | 3584x4800 | 2000 |
    | **4:3** | 1200x896 | 1120 | 2400x1792 | 1120 | 4800x3584 | 2000 |
    | **4:5** | 928x1152 | 1120 | 1856x2304 | 1120 | 3712x4608 | 2000 |
    | **5:4** | 1152x928 | 1120 | 2304x1856 | 1120 | 4608x3712 | 2000 |
    | **9:16** | 768x1376 | 1120 | 1536x2752 | 1120 | 3072x5504 | 2000 |
    | **16:9** | 1376x768 | 1120 | 2752x1536 | 1120 | 5504x3072 | 2000 |
    | **21:9** | 1584x672 | 1120 | 3168x1344 | 1120 | 6336x2688 | 2000 |

=== "Gemini 2.5 Flash Image"


    | 長寬比 | 解析度 | 權杖數 |
    | --- | --- | --- |
    | 1:1 | 1024x1024 | 1290 |
    | 2:3 | 832x1248 | 1290 |
    | 3:2 | 1248x832 | 1290 |
    | 3:4 | 864x1184 | 1290 |
    | 4:3 | 1184x864 | 1290 |
    | 4:5 | 896x1152 | 1290 |
    | 5:4 | 1152x896 | 1290 |
    | 9:16 | 768x1344 | 1290 |
    | 16:9 | 1344x768 | 1290 |
    | 21:9 | 1536x672 | 1290 |


## 何時使用 Imagen {#choose-a-model}


!!! warning " "

      Imagen 模型已關閉。所有圖像生成任務請使用 Nano Banana 模型。


Imagen 已關閉，不再透過 Gemini API 提供。圖像生成與編輯請使用 Nano Banana。

## 後續步驟 {#what-is-next}

* 請參閱 [Veo 指南](/docs/video/)，瞭解如何使用 Gemini API 生成影片。

* 如需進一步瞭解 Gemini 模型，請參閱 [Gemini 模型](/docs/models/)。
