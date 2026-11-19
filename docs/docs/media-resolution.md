# 媒體解析度

`media_resolution` 參數決定 Gemini API 處理影像、影片、音訊與 PDF 文件等媒體輸入的方式，透過設定配置給媒體輸入的**token 數量上限**，讓你在回應品質、延遲與成本之間取得平衡。視覺與文件輸入的 token 配置會依解析度設定縮放；音訊輸入則在所有解析度等級下，都以每秒固定速率進行 Tokenizer。各設定的預設值與對應的 token 數，請參閱[token 數量](/docs/media-resolution/#token-counts)一節。

你可以針對請求中的個別媒體物件（內容項目）設定媒體解析度（Gemini 4 與 Gemini 3 模型）。

## 逐內容項目的媒體解析度（Gemini 4 與 Gemini 3 模型） {#per-content-item-media-resolution}

Gemini 4 與 Gemini 3 模型可讓你為請求中的個別媒體物件設定媒體解析度，藉此精細地最佳化 token 用量。同一個請求中可以混用不同解析度等級，例如對複雜圖表使用高解析度、對簡單的情境圖片使用低解析度。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      myfile = client.files.upload(file="path/to/image.jpg")

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": "Describe this image:"},
              {
                  "type": "image",
                  "uri": myfile.uri,
                  "mime_type": myfile.mime_type,
                  "resolution": "high"
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
        const myfile = await ai.files.upload({
          file: "path/to/image.jpg",
          config: { mimeType: "image/jpeg" },
        });

        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: [
            { type: "text", text: "Describe this image:" },
            {
              type: "image",
              uri: myfile.uri,
              mime_type: myfile.mimeType,
              resolution: "high"
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

      Content textContent = TextContent.builder().text("Describe the details in this high-resolution image.").build();
      Content imageContent =
          ImageContent.builder()
              .uri("gs://cloud-samples-data/generative-ai/image/scones.jpg")
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

          uploadedFile, err := client.Files.UploadFromPath(ctx, "path/to/image.jpg", nil)
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: "Describe the details in this high-resolution image.",
                      }),
                      interactions.NewContent(interactions.ImageContent{
                          URI:        genai.Ptr(uploadedFile.URI),
                          MimeType:   interactions.ImageContentMimeType(uploadedFile.MIMEType).ToPointer(),
                          Resolution: interactions.MediaResolutionHigh.ToPointer(),
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
            {"type": "text", "text": "Describe this image:"},
            {
              "type": "image",
              "uri": "YOUR_FILE_URI",
              "mime_type": "image/jpeg",
              "resolution": "high"
            }
          ]
        }'
      ```


## 可用的解析度值 {#available-resolution-values}

Gemini API 定義了以下媒體解析度等級：

* `unspecified`：預設設定。此等級的 token 數量在 Gemini 4/3 與較早的 Gemini 模型之間差異甚大。
* `low`：token 數量較低，處理速度更快、成本更低，但細節較少。
* `medium`：在細節、成本與延遲之間取得平衡。
* `high`：token 數量較高，為模型提供更多細節，代價是延遲與成本增加。
* `ultra_high`（僅限逐內容項目）：token 數量最高，適用於[電腦操作](/docs/computer-use/)等特定用途。

請注意，`high` 能為大多數用途提供最佳效能。

每個等級實際產生的 token 數量，取決於**媒體類型**（影像、影片、音訊、PDF）與**模型版本**。

## token 數量 {#token-counts}

下表彙整了各模型家族在每個 `media_resolution` 值與媒體類型下的近似 token 數量。

**Gemini 4 與 Gemini 3 模型**

| MediaResolution | 影像 | 影片 | 音訊 | PDF |
| :--- | :--- | :--- | :--- | :--- |
| `unspecified`（預設） | 1120 | 70 | 25（每秒） | 560 |
| `low` | 280 | 70 | 25（每秒） | 280 + Native Text |
| `medium` | 560 | 70 | 25（每秒） | 560 + Native Text |
| `high` | 1120 | 280 | 25（每秒） | 1120 + Native Text |
| `ultra_high` | 2240 | N/A | N/A | N/A |

## 選擇合適的解析度 {#choosing-the-right-resolution}

* **預設值（`unspecified`）**：先從預設值開始。這個設定已針對大多數常見用途，在品質、延遲與成本之間調校出良好平衡。
* **`low`**：適用於成本與延遲最優先、精細細節較不重要的情境。
* **`medium` / `high`**：當任務需要理解媒體中的複雜細節時，提高解析度。這類需求常見於複雜的視覺分析、圖表判讀或密集文件理解。
* **`ultra_high`**：僅適用於逐內容項目設定。建議用於電腦操作等特定用途，或測試顯示其效果明顯優於 `high` 的情境。
* **逐內容項目控制（Gemini 4 與 Gemini 3）**：最佳化 token 用量。例如，在含有多張圖片的提示詞中，對複雜圖表使用 `high`，對較簡單的情境圖片使用 `low` 或 `medium`。

**建議設定**

下表列出各支援媒體類型的建議媒體解析度設定。

| 媒體類型 | 建議設定 | token 上限 | 使用指南 |
| :--- | :--- | :--- | :--- |
| **影像** | `high` | 1120 | 建議用於大多數影像分析任務，以確保最高品質。 |
| **PDF** | `medium` | 560 | 最適合文件理解；品質通常在 `medium` 時即已飽和。提高至 `high` 很少能改善標準文件的 OCR 結果。 |
| **影片**（一般） | `low`（或 `medium`） | 70（每畫格） | **注意**：影片的 `low` 與 `medium` 設定視為相同（70 tokens），以最佳化上下文用量。這已足以應付大多數動作辨識與描述任務。 |
| **影片**（文字密集） | `high` | 280（每畫格） | 僅在用途涉及讀取影片畫格中的密集文字（OCR）或微小細節時才需要。 |
| **音訊** | `unspecified`（預設） | 25（每秒） | 音訊在所有支援的解析度設定（`unspecified`、`low`、`medium` 與 `high`）下，都以每秒 25 tokens 的固定速率進行 Tokenizer。 |

請務必實際測試與評估不同解析度設定對應用程式的影響，找出品質、延遲與成本之間的最佳取捨。

## 與影片處理模式的關係 {#relationship-with-video-processing-modes}

對於影片內容，`media_resolution` 控制每個畫格的 token 預算，而 `processing` 模式則控制載入影片中的*哪些*內容。這兩項設定彼此獨立：無論是靜態處理或代理式影片理解，都可以搭配低、中或高解析度使用。詳情請參閱[代理式影片理解](/docs/video-understanding/#agentic-video-understanding)。

## 版本相容性摘要 {#version-compatibility-summary}

* 在個別內容項目上設定 `resolution`，**支援 Gemini 4 與 Gemini 3 模型**。

## 後續步驟 {#next-steps}

* 在以下指南中進一步了解 Gemini API 的多模態功能：
  [影像理解](/docs/image-understanding/)、
  [影片理解](/docs/video-understanding/)、
  [音訊理解](/docs/audio/)與
  [文件理解](/docs/document-processing/)。


