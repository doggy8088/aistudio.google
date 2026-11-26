# 圖片理解

Gemini 模型從根本上即以多模態為設計核心，能處理各式各樣的圖片處理與電腦視覺任務，包括但不限於圖片說明生成、分類與視覺問答，且無需另外訓練專門的 ML 模型。

除了一般的多模態能力之外，Gemini 模型還透過額外訓練，針對[物件偵測](/docs/image-understanding/#object-detection)與[影像分割](/docs/image-understanding/#segmentation)等特定用途提供**更高的準確度**。

## 將圖片傳給 Gemini {#image-input}

你可以用以下幾種方式將圖片作為輸入提供給 Gemini：

* [使用 URL 傳遞圖片](/docs/image-understanding/#url-image)：適合可公開存取的圖片。
* [傳遞內嵌圖片資料](/docs/image-understanding/#inline-image)：適用於 base64 編碼的圖片資料。
* [使用 File API 上傳圖片](/docs/image-understanding/#upload-image)：建議用於較大的檔案，或需要在多個請求間重複使用圖片的情況。

### 使用 URL 傳遞圖片 {#url-image}

你可以透過 [Files API](/docs/files/) 上傳圖片，並將其傳入請求中：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      uploaded_file = client.files.upload(file="path/to/organ.jpg")

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": "Caption this image."},
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

      const client = new GoogleGenAI({});

      const uploadedFile = await client.files.upload({
          file: "path/to/organ.jpg",
          config: { mimeType: "image/jpeg" }
      });

      const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: [
              {type: "text", text: "Caption this image."},
              {
                  type: "image",
                  uri: uploadedFile.uri,
                  mime_type: uploadedFile.mimeType
              }
          ]
      });
      console.log(interaction.output_text);
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
      import com.google.genai.types.File;
      import com.google.genai.types.UploadFileConfig;
      import java.util.Arrays;
      import java.util.List;

      Client client = new Client();

      File uploadedFile =
          client.files.upload(
              new java.io.File("path/to/organ.jpg"),
              UploadFileConfig.builder().mimeType("image/jpeg").build());

      Content textContent = TextContent.builder().text("Caption this image.").build();
      Content imageContent =
          ImageContent.builder()
              .uri(uploadedFile.uri().orElse(""))
              .mimeType(ImageContentMimeType.of(uploadedFile.mimeType().orElse("image/jpeg")))
              .build();

      List<Content> contents = Arrays.asList(textContent, imageContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.ofContent(contents))
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

          uploadedFile, err := client.Files.UploadFromPath(ctx, "path/to/organ.jpg", &genai.UploadFileConfig{
              MIMEType: "image/jpeg",
          })
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: "Caption this image.",
                      }),
                      interactions.NewContent(interactions.ImageContent{
                          URI:      genai.Ptr(uploadedFile.URI),
                          MimeType: interactions.ImageContentMimeType(uploadedFile.MIMEType).ToPointer(),
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
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {"type": "text", "text": "Caption this image."},
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
      FILE=$(gemini-api files upload path/to/organ.jpg --wait)
      gemini-api analyze "Caption this image." -i "$FILE"
      ```


### 傳遞內嵌圖片資料 {#inline-image}

你可以將圖片資料以 base64 編碼字串的形式提供：


=== "Python"

      ```python
      import base64
      from google import genai

      with open('path/to/small-sample.jpg', 'rb') as f:
          image_bytes = f.read()

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": "Caption this image."},
              {
                  "type": "image",
                  "data": base64.b64encode(image_bytes).decode('utf-8'),
                  "mime_type": "image/jpeg"
              }
          ]
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      const client = new GoogleGenAI({});
      const base64ImageFile = fs.readFileSync("path/to/small-sample.jpg", {
        encoding: "base64",
      });

      const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: [
              {type: "text", text: "Caption this image."},
              {
                  type: "image",
                  data: base64ImageFile,
                  mime_type: "image/jpeg"
              }
          ]
      });
      console.log(interaction.output_text);
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

      byte[] imageBytes = Files.readAllBytes(Paths.get("path/to/small-sample.jpg"));
      String base64Image = Base64.getEncoder().encodeToString(imageBytes);

      Client client = new Client();

      Content textContent = TextContent.builder().text("Caption this image.").build();
      Content imageContent =
          ImageContent.builder()
              .data(base64Image)
              .mimeType(ImageContentMimeType.IMAGE_JPEG)
              .build();

      List<Content> contents = Arrays.asList(textContent, imageContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.ofContent(contents))
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

          imageBytes, err := os.ReadFile("path/to/small-sample.jpg")
          if err != nil {
              log.Fatal(err)
          }
          base64Image := base64.StdEncoding.EncodeToString(imageBytes)

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: "Caption this image.",
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
      IMG_PATH="/path/to/your/image1.jpg"

      if [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
        B64FLAGS="--input"
      else
        B64FLAGS="-w0"
      fi

      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {"type": "text", "text": "Caption this image."},
            {
              "type": "image",
              "data": "'"$(base64 $B64FLAGS $IMG_PATH)"'",
              "mime_type": "image/jpeg"
            }
          ]
        }'
      ```

=== "CLI"

      ```bash
      gemini-api analyze "Caption this image." -i path/to/small-sample.jpg
      ```


!!! note " "

      使用內嵌圖片資料時，請求總大小（文字提示詞、系統指令與內嵌位元組）上限為 20MB。若請求較大，請透過 File API [上傳圖片檔案](/docs/image-understanding/#upload-image)。


### 使用 File API 上傳圖片 {#upload-image}

若檔案較大，或需要重複使用同一個圖片檔案，請使用 Files API。詳情請參閱 [Files API 指南](/docs/files/)。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      my_file = client.files.upload(file="path/to/sample.jpg")

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": "Caption this image."},
              {
                  "type": "image",
                  "uri": my_file.uri,
                  "mime_type": my_file.mime_type
              }
          ]
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const myfile = await client.files.upload({
          file: "path/to/sample.jpg",
          config: { mimeType: "image/jpeg" },
      });

      const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: [
              {type: "text", text: "Caption this image."},
              {
                  type: "image",
                  uri: myfile.uri,
                  mime_type: myfile.mimeType
              }
          ]
      });
      console.log(interaction.output_text);
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
      import com.google.genai.types.File;
      import com.google.genai.types.UploadFileConfig;
      import java.util.Arrays;
      import java.util.List;

      Client client = new Client();

      File myFile =
          client.files.upload(
              new java.io.File("path/to/sample.jpg"),
              UploadFileConfig.builder().mimeType("image/jpeg").build());

      Content textContent = TextContent.builder().text("Caption this image.").build();
      Content imageContent =
          ImageContent.builder()
              .uri(myFile.uri().orElse(""))
              .mimeType(ImageContentMimeType.of(myFile.mimeType().orElse("image/jpeg")))
              .build();

      List<Content> contents = Arrays.asList(textContent, imageContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.ofContent(contents))
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

          myFile, err := client.Files.UploadFromPath(ctx, "path/to/sample.jpg", &genai.UploadFileConfig{
              MIMEType: "image/jpeg",
          })
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: "Caption this image.",
                      }),
                      interactions.NewContent(interactions.ImageContent{
                          URI:      genai.Ptr(myFile.URI),
                          MimeType: interactions.ImageContentMimeType(myFile.MIMEType).ToPointer(),
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

      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {"type": "text", "text": "Caption this image."},
            {
              "type": "image",
              "uri": "YOUR_FILE_URI",
              "mime_type": "image/jpeg"
            }
          ]
        }'
      ```


## 使用多張圖片進行提示 {#multiple-images}

你可以在單一提示詞中提供多張圖片，方法是將多個圖片物件放入 `input` 陣列：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": "What is different between these two images?"},
              {
                  "type": "image",
                  "uri": "https://example.com/image1.jpg",
                  "mime_type": "image/jpeg"
              },
              {
                  "type": "image",
                  "uri": "https://example.com/image2.jpg",
                  "mime_type": "image/jpeg"
              }
          ]
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: [
              {type: "text", text: "What is different between these two images?"},
              {
                  type: "image",
                  uri: "https://example.com/image1.jpg",
                  mime_type: "image/jpeg"
              },
              {
                  type: "image",
                  uri: "https://example.com/image2.jpg",
                  mime_type: "image/jpeg"
              }
          ]
      });
      console.log(interaction.output_text);
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
      import java.util.Arrays;
      import java.util.List;

      Client client = new Client();

      Content textContent =
          TextContent.builder().text("What is different between these two images?").build();
      Content image1 =
          ImageContent.builder()
              .uri("https://example.com/image1.jpg")
              .mimeType(ImageContentMimeType.IMAGE_JPEG)
              .build();
      Content image2 =
          ImageContent.builder()
              .uri("https://example.com/image2.jpg")
              .mimeType(ImageContentMimeType.IMAGE_JPEG)
              .build();

      List<Content> contents = Arrays.asList(textContent, image1, image2);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.ofContent(contents))
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
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: "What is different between these two images?",
                      }),
                      interactions.NewContent(interactions.ImageContent{
                          URI:      genai.Ptr("https://example.com/image1.jpg"),
                          MimeType: interactions.ImageContentMimeTypeImageJpeg.ToPointer(),
                      }),
                      interactions.NewContent(interactions.ImageContent{
                          URI:      genai.Ptr("https://example.com/image2.jpg"),
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
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {"type": "text", "text": "What is different between these two images?"},
            {
              "type": "image",
              "uri": "https://example.com/image1.jpg",
              "mime_type": "image/jpeg"
            },
            {
              "type": "image",
              "uri": "https://example.com/image2.jpg",
              "mime_type": "image/jpeg"
            }
          ]
        }'
      ```

=== "CLI"

      ```bash
      # -i accepts local files, files/<id>, or YouTube URLs. For other https:// images, download them locally first.
      gemini-api analyze "What is different between these two images?" -i image1.jpg -i image2.jpg
      ```


## 物件偵測 {#object-detection}

模型經過訓練，能偵測圖片中的物件並取得其邊界框座標。這些座標是相對於圖片尺寸的比例值，範圍為 \[0, 1000\]。你需要依原始圖片大小，將這些座標還原為實際尺寸。


=== "Python"

      ```python
      from google import genai
      from pydantic import BaseModel, Field
      from typing import List
      import json

      client = genai.Client()
      prompt = "Detect the all of the prominent items in the image. The box_2d should be [ymin, xmin, ymax, xmax] normalized to 0-1000."

      class BoundingBox(BaseModel):
          box_2d: List[int] = Field(description="The 2D bounding box of the item as [ymin, xmin, ymax, xmax] normalized to 0-1000.")
          mask: List[List[int]] = Field(description="The segmentation mask of the item as a polygon of [x,y] coordinates, normalized to 0-1000.")
          label: str = Field(description="A descriptive label for the item.")

      class BoundingBoxes(BaseModel):
          boxes: List[BoundingBox]

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": prompt},
              {
                  "type": "image",
                  "uri": "https://example.com/image.png",
                  "mime_type": "image/png"
              }
          ],
          response_format={
              "type": "text",
              "mime_type": "application/json",
              "schema": BoundingBoxes.model_json_schema()
          }
      )

      bounding_boxes = BoundingBoxes.model_validate_json(interaction.output_text)
      print(bounding_boxes)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as z from "zod";

      const client = new GoogleGenAI({});
      const prompt = "Detect the all of the prominent items in the image. The box_2d should be [ymin, xmin, ymax, xmax] normalized to 0-1000.";

      const boundingBoxesSchema = z.object({
        boxes: z.array(z.object({
          box_2d: z.array(z.number()),
          mask: z.array(z.array(z.number())),
          label: z.string()
        }))
      });

      const interaction = await client.interactions.create({
        model: "gemini-4-hydrogen",
        input: [
          { type: "text", text: prompt },
          {
            type: "image",
            uri: "https://example.com/image.png",
            mime_type: "image/png"
          }
        ],
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: z.toJSONSchema(boundingBoxesSchema)
        },
      });

      const result = boundingBoxesSchema.parse(JSON.parse(interaction.output_text));
      console.log(result);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.TextResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormatMimeType;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.List;
      import java.util.Map;

      Client client = new Client();
      String prompt =
          "Detect the all of the prominent items in the image. The box_2d should be [ymin, xmin, ymax, xmax] normalized to 0-1000.";

      Map<String, Object> boundingBoxSchema =
          Map.of(
              "type", "object",
              "properties",
                  Map.of(
                      "box_2d",
                          Map.of(
                              "type", "array",
                              "items", Map.of("type", "integer"),
                              "description",
                                  "The 2D bounding box of the item as [ymin, xmin, ymax, xmax] normalized to 0-1000."),
                      "mask",
                          Map.of(
                              "type", "array",
                              "items", Map.of("type", "array", "items", Map.of("type", "integer")),
                              "description",
                                  "The segmentation mask of the item as a polygon of [x,y] coordinates, normalized to 0-1000."),
                      "label",
                          Map.of("type", "string", "description", "A descriptive label for the item.")),
              "required", List.of("box_2d", "mask", "label"));

      Map<String, Object> boundingBoxesSchema =
          Map.of(
              "type", "object",
              "properties", Map.of("boxes", Map.of("type", "array", "items", boundingBoxSchema)),
              "required", List.of("boxes"));

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  TextResponseFormat.builder()
                      .mimeType(TextResponseFormatMimeType.APPLICATION_JSON)
                      .schema(boundingBoxesSchema)
                      .build()));

      Content textContent = TextContent.builder().text(prompt).build();
      Content imageContent =
          ImageContent.builder()
              .uri("https://example.com/image.png")
              .mimeType(ImageContentMimeType.IMAGE_PNG)
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.ofContent(Arrays.asList(textContent, imageContent)))
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

          prompt := "Detect the all of the prominent items in the image. The box_2d should be [ymin, xmin, ymax, xmax] normalized to 0-1000."

          boundingBoxSchema := map[string]any{
              "type": "object",
              "properties": map[string]any{
                  "box_2d": map[string]any{
                      "type":        "array",
                      "items":       map[string]any{"type": "integer"},
                      "description": "The 2D bounding box of the item as [ymin, xmin, ymax, xmax] normalized to 0-1000.",
                  },
                  "mask": map[string]any{
                      "type":        "array",
                      "items":       map[string]any{"type": "array", "items": map[string]any{"type": "integer"}},
                      "description": "The segmentation mask of the item as a polygon of [x,y] coordinates, normalized to 0-1000.",
                  },
                  "label": map[string]any{
                      "type":        "string",
                      "description": "A descriptive label for the item.",
                  },
              },
              "required": []string{"box_2d", "mask", "label"},
          }

          boundingBoxesSchema := map[string]any{
              "type": "object",
              "properties": map[string]any{
                  "boxes": map[string]any{
                      "type":  "array",
                      "items": boundingBoxSchema,
                  },
              },
              "required": []string{"boxes"},
          }

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.TextResponseFormat{
                  MimeType: interactions.TextResponseFormatMimeTypeApplicationJSON.ToPointer(),
                  Schema:   boundingBoxesSchema,
              }),
          )

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: prompt,
                      }),
                      interactions.NewContent(interactions.ImageContent{
                          URI:      genai.Ptr("https://example.com/image.png"),
                          MimeType: interactions.ImageContentMimeTypeImagePng.ToPointer(),
                      }),
                  }),
                  ResponseFormat: genai.Ptr(format),
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
          "input": [
            {"type": "text", "text": "Detect the all of the prominent items in the image. The box_2d should be [ymin, xmin, ymax, xmax] normalized to 0-1000."},
            {
              "type": "image",
              "uri": "https://example.com/image.png",
              "mime_type": "image/png"
            }
          ],
          "response_format": {
            "type": "text",
            "mime_type": "application/json",
            "schema": {
              "type": "object",
              "properties": {
                "boxes": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "box_2d": { "type": "array", "items": { "type": "integer" } },
                      "mask": { "type": "array", "items": { "type": "array", "items": { "type": "integer" } } },
                      "label": { "type": "string" }
                    },
                    "required": ["box_2d", "mask", "label"]
                  }
                }
              },
              "required": ["boxes"]
            }
          }
        }'
      ```

=== "CLI"

      ```bash
      # -i accepts local files, files/<id>, or YouTube URLs. For other https:// images, download locally first (or pass the full input array in --body without -i or a prompt argument).
      gemini-api generate -i image.png "Detect the all of the prominent items in the image. The box_2d should be [ymin, xmin, ymax, xmax] normalized to 0-1000." \
        --body '{"response_format": {"type": "text", "mime_type": "application/json", "schema": {
          "type": "object", "required": ["boxes"], "properties": {"boxes": {"type": "array", "items": {
            "type": "object", "required": ["box_2d", "mask", "label"], "properties": {
              "box_2d": {"type": "array", "items": {"type": "integer"}},
              "mask": {"type": "array", "items": {"type": "array", "items": {"type": "integer"}}},
              "label": {"type": "string"}}}}}}}}'
      ```


!!! note " "

      模型也支援依自訂指令產生邊界框，例如：「顯示這張圖片中所有綠色物件的邊界框」。


更多範例，請參閱 [Gemini Cookbook](https://github.com/google-gemini/cookbook) 中的以下筆記本：

## 影像分割 {#segmentation}

自 Gemini 2.5 起，模型不只能偵測物件，還能將其分割並提供輪廓遮罩。

模型會預測一份 JSON 清單，其中每個項目代表一個分割遮罩。每個項目包含一個邊界框（「`box_2d`」），格式為 `[y0, x0, y1, x1]`，座標已正規化為 0 到 1000 之間；一個用於識別物件的標籤（「`label`」）；以及位於邊界框內的分割遮罩，其形式為 base64 編碼的 png，是一張數值介於 0 到 255 之間的機率圖。


!!! note " "

      Gemini 4 Hydrogen 的 `thinking_level` 預設為 `"high"`。若要降低大量分割作業的延遲，也可以測試 `"low"`，或在[支援 minimal 思考的模型](/docs/thinking/#thinking-levels)上使用 `"minimal"`，例如 `gemini-3.5-flash-lite`。


=== "Python"

      ```python
      from google import genai
      from pydantic import BaseModel, Field
      from typing import List
      import json

      client = genai.Client()

      prompt = """
      Give the segmentation masks for the wooden and glass items.
      Output a JSON list of segmentation masks where each entry contains the 2D
      bounding box in the key "box_2d", the segmentation mask in key "mask", and
      the text label in the key "label". Use descriptive labels.
      """

      class BoundingBox(BaseModel):
          box_2d: List[int] = Field(description="The 2D bounding box of the item as [ymin, xmin, ymax, xmax] normalized to 0-1000.")
          mask: List[List[int]] = Field(description="The segmentation mask of the item as a polygon of [x,y] coordinates, normalized to 0-1000.")
          label: str = Field(description="A descriptive label for the item.")

      class BoundingBoxes(BaseModel):
          boxes: List[BoundingBox]

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": prompt},
              {
                  "type": "image",
                  "uri": "https://example.com/image.png",
                  "mime_type": "image/png"
              }
          ],
          response_format={
              "type": "text",
              "mime_type": "application/json",
              "schema": BoundingBoxes.model_json_schema()
          },
          generation_config={
              "thinking_level": "high"
          }
      )

      items = BoundingBoxes.model_validate_json(interaction.output_text)
      print("Segmentation results:", items)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as z from "zod";

      const client = new GoogleGenAI({});
      const prompt = `
      Give the segmentation masks for the wooden and glass items.
      Output a JSON list of segmentation masks where each entry contains the 2D
      bounding box in the key "box_2d", the segmentation mask in key "mask", and
      the text label in the key "label". Use descriptive labels.
      `;

      const boundingBoxesSchema = z.object({
        boxes: z.array(z.object({
          box_2d: z.array(z.number()),
          mask: z.array(z.array(z.number())),
          label: z.string()
        }))
      });

      const interaction = await client.interactions.create({
        model: "gemini-4-hydrogen",
        input: [
          { type: "text", text: prompt },
          {
            type: "image",
            uri: "https://example.com/image.png",
            mime_type: "image/png"
          }
        ],
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: z.toJSONSchema(boundingBoxesSchema)
        },
        generation_config: {
          thinking_level: "high"
        }
      });

      const result = boundingBoxesSchema.parse(JSON.parse(interaction.output_text));
      console.log(result);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.GenerationConfig;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.TextResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormatMimeType;
      import com.google.genai.gaos.models.interactions.ThinkingLevel;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.List;
      import java.util.Map;

      Client client = new Client();

      String prompt =
          "Give the segmentation masks for the wooden and glass items.\n"
              + "Output a JSON list of segmentation masks where each entry contains the 2D\n"
              + "bounding box in the key \"box_2d\", the segmentation mask in key \"mask\", and\n"
              + "the text label in the key \"label\". Use descriptive labels.";

      Map<String, Object> boundingBoxSchema =
          Map.of(
              "type", "object",
              "properties",
                  Map.of(
                      "box_2d",
                          Map.of(
                              "type", "array",
                              "items", Map.of("type", "integer"),
                              "description",
                                  "The 2D bounding box of the item as [ymin, xmin, ymax, xmax] normalized to 0-1000."),
                      "mask",
                          Map.of(
                              "type", "array",
                              "items", Map.of("type", "array", "items", Map.of("type", "integer")),
                              "description",
                                  "The segmentation mask of the item as a polygon of [x,y] coordinates, normalized to 0-1000."),
                      "label",
                          Map.of("type", "string", "description", "A descriptive label for the item.")),
              "required", List.of("box_2d", "mask", "label"));

      Map<String, Object> boundingBoxesSchema =
          Map.of(
              "type", "object",
              "properties", Map.of("boxes", Map.of("type", "array", "items", boundingBoxSchema)),
              "required", List.of("boxes"));

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  TextResponseFormat.builder()
                      .mimeType(TextResponseFormatMimeType.APPLICATION_JSON)
                      .schema(boundingBoxesSchema)
                      .build()));

      Content textContent = TextContent.builder().text(prompt).build();
      Content imageContent =
          ImageContent.builder()
              .uri("https://example.com/image.png")
              .mimeType(ImageContentMimeType.IMAGE_PNG)
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.ofContent(Arrays.asList(textContent, imageContent)))
              .responseFormat(format)
              .generationConfig(GenerationConfig.builder().thinkingLevel(ThinkingLevel.HIGH).build())
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      System.out.println("Segmentation results: " + interaction.outputText().orElse(""));
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

          prompt := "Give the segmentation masks for the wooden and glass items.\n" +
              "Output a JSON list of segmentation masks where each entry contains the 2D\n" +
              "bounding box in the key \"box_2d\", the segmentation mask in key \"mask\", and\n" +
              "the text label in the key \"label\". Use descriptive labels."

          boundingBoxSchema := map[string]any{
              "type": "object",
              "properties": map[string]any{
                  "box_2d": map[string]any{
                      "type":        "array",
                      "items":       map[string]any{"type": "integer"},
                      "description": "The 2D bounding box of the item as [ymin, xmin, ymax, xmax] normalized to 0-1000.",
                  },
                  "mask": map[string]any{
                      "type":        "array",
                      "items":       map[string]any{"type": "array", "items": map[string]any{"type": "integer"}},
                      "description": "The segmentation mask of the item as a polygon of [x,y] coordinates, normalized to 0-1000.",
                  },
                  "label": map[string]any{
                      "type":        "string",
                      "description": "A descriptive label for the item.",
                  },
              },
              "required": []string{"box_2d", "mask", "label"},
          }

          boundingBoxesSchema := map[string]any{
              "type": "object",
              "properties": map[string]any{
                  "boxes": map[string]any{
                      "type":  "array",
                      "items": boundingBoxSchema,
                  },
              },
              "required": []string{"boxes"},
          }

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.TextResponseFormat{
                  MimeType: interactions.TextResponseFormatMimeTypeApplicationJSON.ToPointer(),
                  Schema:   boundingBoxesSchema,
              }),
          )

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: prompt,
                      }),
                      interactions.NewContent(interactions.ImageContent{
                          URI:      genai.Ptr("https://example.com/image.png"),
                          MimeType: interactions.ImageContentMimeTypeImagePng.ToPointer(),
                      }),
                  }),
                  ResponseFormat: genai.Ptr(format),
                  GenerationConfig: &interactions.GenerationConfig{
                      ThinkingLevel: interactions.ThinkingLevelHigh.ToPointer(),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if res.Interaction.OutputText != nil {
              fmt.Println("Segmentation results: " + *res.Interaction.OutputText)
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
          "input": [
            {"type": "text", "text": "Give the segmentation masks for the wooden and glass items.\nOutput a JSON list of segmentation masks where each entry contains the 2D\nbounding box in the key \"box_2d\", the segmentation mask in key \"mask\", and\nthe text label in the key \"label\". Use descriptive labels."},
            {
              "type": "image",
              "uri": "https://example.com/image.png",
              "mime_type": "image/png"
            }
          ],
          "response_format": {
            "type": "text",
            "mime_type": "application/json",
            "schema": {
              "type": "object",
              "properties": {
                "boxes": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "box_2d": { "type": "array", "items": { "type": "integer" } },
                      "mask": { "type": "array", "items": { "type": "array", "items": { "type": "integer" } } },
                      "label": { "type": "string" }
                    },
                    "required": ["box_2d", "mask", "label"]
                  }
                }
              },
              "required": ["boxes"]
            }
          },
          "generation_config": {
            "thinking_level": "high"
          }
        }'
      ```


![一張擺有杯子蛋糕的桌子，木製與玻璃物件已被標示出來](https://www.gstatic.com/cloud-cms/86b50800e5bf459eeb2a91d96a5ed82a.jpg)## 支援的圖片格式  

Gemini 支援以下圖片格式的 MIME 類型：

* PNG - `image/png`
* JPEG - `image/jpeg`
* WEBP - `image/webp`
* HEIC - `image/heic`
* HEIF - `image/heif`

如需了解其他檔案輸入方式，請參閱 [檔案輸入方式](/docs/file-input-methods/)指南。

## 功能 {#capabilities}

所有版本的 Gemini 模型皆為多模態，可用於各式各樣的圖片處理與電腦視覺任務，包括但不限於圖片說明生成、視覺問答、圖片分類、物件偵測與影像分割。

視你的品質與效能需求而定，Gemini 可以減少使用專門 ML 模型的需要。

最新版本的模型除了一般能力之外，還特別針對專門任務的準確度進行訓練，例如強化過的[物件偵測](/docs/image-understanding/#object-detection)與[影像分割](/docs/image-understanding/#segmentation)。

## 限制與重要技術資訊 {#technical-details-image}

### 檔案上限 {#file-limit}

Gemini 模型每個請求最多支援 3,600 個圖片檔案。

### token 計算 {#token-calculation}

* 若兩個邊長皆 <= 384 像素，則為 258 tokens。
  較大的圖片會切割成 768x768 像素的圖磚，每塊圖磚耗用 258 tokens。

計算圖磚數量的概略公式如下：

* 裁切單位大小約為：`floor(min(width, height)` / 1.5)。
* 將每個邊長除以裁切單位大小，再相乘即可得到圖磚數量。

例如，尺寸為 960x540 的圖片，其裁切單位大小為 360。將每個邊長除以 360，圖磚數量即為 3 * 2 = 6。

### 媒體解析度 {#media-resolution}

Gemini 3 透過 `media_resolution` 參數，提供對多模態視覺處理的細粒度控制。`media_resolution` 參數決定**每張輸入圖片或每個影片影格所分配的 token 數量上限**。解析度越高，模型讀取細小文字或辨識微小細節的能力越好，但 token 用量與延遲也會隨之增加。

## 提示與最佳實務 {#tips-best-practices}

* 確認圖片方向正確。
* 使用清晰、不模糊的圖片。
* 使用單張圖片搭配文字時，請將文字提示詞放在 `input` 陣列中圖片的*前面*。

## 後續步驟 {#whats-next}

本指南說明如何上傳圖片檔案，並從圖片輸入產生文字輸出。如需深入了解，請參閱以下資源：

* [Files API](/docs/files/)：深入了解如何上傳與管理供 Gemini 使用的檔案。

* [系統指令](/docs/text-generation/#system-instructions)：
  系統指令可讓你依自身需求與用途，引導模型的行為。

* [檔案提示策略](/docs/files/#prompt-guide)：
  Gemini API 支援以文字、圖片、音訊與影片資料進行提示，也就是所謂的多模態提示。

* [安全指南](/docs/safety-guidance/)：生成式
  AI 模型有時會產生非預期的輸出，例如不正確、帶有偏見或冒犯性的內容。後處理與人工評估不可或缺，能降低這類輸出造成危害的風險。


