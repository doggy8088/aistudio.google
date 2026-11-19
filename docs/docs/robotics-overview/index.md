# Gemini Robotics ER


!!! note " "

      Gemini Robotics ER 模型目前為預覽版。


Gemini Robotics ER（embodied reasoning，具身推理）模型是視覺語言模型（VLM），讓機器人能感知實體世界並與之互動。這類模型能解讀視覺資料、進行空間與時間推理、規劃多步驟任務，並編排機器人與工具。

## 模型 {#models}

Gemini Robotics ER 2 模型是 Gemini Robotics 系列的最新模型，也是我們更新後的推理模型，能讓機器人精確理解所處環境。它專精於具身推理能力，例如以代理方式編排機器人（例如使用 VLA）、機器人影片理解（包括進度理解與成功偵測）、儀器讀數、指向與空間推理。

Gemini Robotics ER 2 模型提供兩個模型端點：

*   **`gemini-robotics-er-2-preview`**：標準 ER 2 模型。以 Gemini 3.5 Flash 為基礎，具備更佳的空間推理、影片時刻查找、影片進度分類、多機器人編排與多步驟工具使用能力。
*   **`gemini-robotics-er-2-streaming-preview`**：針對使用 [Live API](/docs/live-api/get-started-sdk/) 的即時串流最佳化。適合需要處理連續音訊與影片輸入的低延遲機器人代理。

Gemini Robotics ER 1.6 已於 [2026 年 8 月 31 日淘汰](/docs/deprecations/#robotics-models)。若你仍在使用 Gemini Robotics ER 1.6，請在 API 呼叫中將 `model="gemini-robotics-er-1.6-preview"` 換成 `model="gemini-robotics-er-2-preview"` 或 `model="gemini-robotics-er-2-streaming-preview"`，升級至 Gemini Robotics ER 2。

[在 Google AI Studio 中試用 Gemini Robotics ER 2](https://aistudio.google.com/prompts/new_chat?model=gemini-robotics-er-2-preview)

## 機器人能力 {#capabilities}

Gemini Robotics ER 支援多種具身推理能力。選取一項能力以深入瞭解：


| 能力 | 說明 | 指南 |
| --- | --- | --- |
| 空間推理 | 指向物體、在影片中追蹤物體、以邊界框偵測、規劃軌跡。 | [空間推理](/docs/robotics-spatial/) |
| 代理視覺 | 運用程式碼執行，透過影像處理工具強化其他能力。 | [代理視覺](/docs/robotics-agentic/) |
| 任務編排 | 結合空間推理與自訂機器人 API，完成長程任務。 | [任務編排](/docs/robotics-orchestration/) |
| 串流（僅限 Gemini Robotics ER 2 Streaming 端點） | 雙向串流，支援低延遲函式呼叫的即時機器人代理。 | [機器人串流](/docs/robotics-streaming/) |
| 影片進度（僅限 Gemini Robotics ER 2） | 從連續影片來源進行時刻查找與進度分類。 | [影片理解](/docs/robotics-video-progress/) |


## 開始之前 {#before-you-begin}

Gemini Robotics ER 模型可透過 **Gemini Developer API** 使用。開始之前，請先從 [Google AI Studio](https://aistudio.google.com/apikey) 或 [Google Cloud 控制台](/docs/api-key/#cloud-console) 建立 [Gemini API 金鑰](/docs/api-key/)，並[設定你的環境](/docs/api-key/#setup-environment)。

如需瞭解金鑰類型、安全性，以及如何在 Python、JavaScript 等語言中設定金鑰的詳細資訊，請參閱[使用 Gemini API 金鑰](/docs/api-key/)。


!!! note " "

      Cloud Storage URI（`gs://`）無法直接透過 Gemini Developer API 存取。請在本機載入圖片，或使用 [Files API](/docs/files/)。


## 開始使用 {#getting-started}

下列範例會找出圖片中的物體，並傳回其正規化的 2D 座標與標籤。你可以直接將此輸出傳給機器人 API 或 VLA 模型，以產生機器人動作。


=== "Python"

      ```python
      from google import genai

      PROMPT = """
                Point to no more than 10 items in the image. The label returned
                should be an identifying name for the object detected.
                The answer should follow the json format: [{"point": <point>,
                "label": <label1>}, ...]. The points are in [y, x] format
                normalized to 0-1000.
              """
      client = genai.Client()

      uploaded_file = client.files.upload(file="my-image.png")

      image_response = client.interactions.create(
          model="gemini-robotics-er-2-preview",
          input=[
              {
                  "type": "image",
                  "uri": uploaded_file.uri,
                  "mime_type": uploaded_file.mime_type
              },
              {"type": "text", "text": PROMPT}
          ],
          generation_config={"thinking_level": "high"},
      )

      print(image_response.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const PROMPT = `
        Point to no more than 10 items in the image. The label returned
        should be an identifying name for the object detected.
        The answer should follow the json format: [{"point": <point>,
        "label": <label1>}, ...]. The points are in [y, x] format
        normalized to 0-1000.
      `;
      const client = new GoogleGenAI();

      const uploadedFile = await client.files.upload({ file: "my-image.png" });

      const imageResponse = await client.interactions.create({
        model: "gemini-robotics-er-2-preview",
        input: [
          {
            type: "image",
            uri: uploadedFile.uri,
            mime_type: uploadedFile.mimeType,
          },
          { type: "text", text: PROMPT },
        ],
        generation_config: { thinking_level: "high" },
      });

      console.log(imageResponse.output_text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.GenerationConfig;
      import com.google.genai.gaos.models.interactions.ImageContent;
      import com.google.genai.gaos.models.interactions.ImageContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.ThinkingLevel;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.File;
      import com.google.genai.types.UploadFileConfig;
      import java.util.List;

      Client client = new Client();

      String prompt =
          "Point to no more than 10 items in the image. The label returned "
              + "should be an identifying name for the object detected. "
              + "The answer should follow the json format: [{\"point\": <point>, "
              + "\"label\": <label1>}, ...]. The points are in [y, x] format "
              + "normalized to 0-1000.";

      File uploadedFile =
          client.files.upload(
              new java.io.File("my-image.png"),
              UploadFileConfig.builder().mimeType("image/png").build());

      Content imageContent =
          ImageContent.builder()
              .uri(uploadedFile.uri().orElse(""))
              .mimeType(ImageContentMimeType.of(uploadedFile.mimeType().orElse("image/png")))
              .build();
      Content textContent = TextContent.builder().text(prompt).build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-robotics-er-2-preview"))
              .input(InteractionsInput.ofContent(List.of(imageContent, textContent)))
              .generationConfig(
                  GenerationConfig.builder().thinkingLevel(ThinkingLevel.HIGH).build())
              .build();

      Interaction imageResponse =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println(imageResponse.outputText().orElse(""));
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

          prompt := `Point to no more than 10 items in the image. The label returned
      should be an identifying name for the object detected.
      The answer should follow the json format: [{"point": <point>,
      "label": <label1>}, ...]. The points are in [y, x] format
      normalized to 0-1000.`

          uploadedFile, err := client.Files.UploadFromPath(ctx, "my-image.png", &genai.UploadFileConfig{
              MIMEType: "image/png",
          })
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-robotics-er-2-preview"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.ImageContent{
                          URI:      genai.Ptr(uploadedFile.URI),
                          MimeType: genai.Ptr(interactions.ImageMimeTypeImagePng),
                      }),
                      interactions.NewContent(interactions.TextContent{
                          Text: prompt,
                      }),
                  }),
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

      ```bash
      # First, ensure you have the image file locally.
      # Encode the image to base64
      IMAGE_BASE64=$(base64 -w 0 my-image.png)

      curl -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-robotics-er-2-preview",
          "input": {
            "parts": [
              {
                "inlineData": {
                  "mimeType": "image/png",
                  "data": "'"${IMAGE_BASE64}"'"
                }
              },
              {
                "text": "Point to no more than 10 items in the image. The label returned should be an identifying name for the object detected. The answer should follow the json format: [{\"point\": [y, x], \"label\": <label1>}, ...]. The points are in [y, x] format normalized to 0-1000."
              }
            ]
          },
          "generation_config": {
            "thinking_config": {
              "thinking_level": "high"
            }
          }
        }'
      ```


輸出會是一個 JSON 陣列，其中每個物件都包含一個 `point`（正規化的 `[y, x]` 座標）與一個標示物體的 `label`。


=== "JSON"

      ```json
      [
        {"point": [376, 508], "label": "small banana"},
        {"point": [287, 609], "label": "larger banana"},
        {"point": [223, 303], "label": "pink starfruit"},
        {"point": [435, 172], "label": "paper bag"},
        {"point": [270, 786], "label": "green plastic bowl"},
        {"point": [488, 775], "label": "metal measuring cup"},
        {"point": [673, 580], "label": "dark blue bowl"},
        {"point": [471, 353], "label": "light blue bowl"},
        {"point": [492, 497], "label": "bread"},
        {"point": [525, 429], "label": "lime"}
      ]
      ```


下圖示範這些點的呈現方式：

![](https://www.gstatic.com/cloud-cms/9520553bf3464dfdca8d4bf4b4da2951.png)

## 運作方式 {#how-it-works}

Gemini Robotics ER 接收圖片、影片或音訊輸入與自然語言提示詞。它能辨識物體、推理場景脈絡與空間關係，並傳回座標或邊界框等結構化輸出。

Gemini Robotics ER 也具備代理能力：它能將複雜任務拆解為子任務，並透過呼叫你的機器人函式或執行產生的程式碼來完成。例如，「把蘋果放進碗裡」會變成定位、抓取與放置的一系列步驟。

如需瞭解 Gemini 如何執行工具呼叫的詳細資訊，請參閱[函式呼叫](/docs/function-calling/?example=meeting#how-it-works)。

## 安全性 {#safety}

Gemini Robotics ER 在設計時已將安全性納入考量，但維護機器人周圍環境的安全仍是你的責任。生成式 AI 模型可能會出錯，實體機器人也可能造成損壞。如需深入瞭解，請造訪
[Gemini Robotics 安全頁面](https://deepmind.google/models/gemini-robotics/safety)。

## 最佳做法 {#best-practices}

1.  使用平實的自然語言。如同對人說明一樣，描述你希望機器人做的事。若某個詞彙效果不佳，可改用常見的同義詞。

2.  最佳化視覺輸入。傳送圖片前，先裁切或放大體積小或不清楚的物體。光線與低色彩對比都可能影響偵測。

3.  將複雜任務拆解為步驟。將每個步驟以獨立提示詞傳送，讓模型保持專注並提升準確度。

4.  對於高精確度任務，多次查詢並將結果取平均。這種共識做法能降低空間輸出的變異。


## 限制 {#limitations}

使用 Gemini Robotics ER 開發時，請留意下列限制：

*   **API 金鑰限制**：Gemini API 不接受來自未受限 API 金鑰的要求，並會傳回 `403 Forbidden` 錯誤。請在 [AI Studio](https://aistudio.google.com/api-keys) 中為 API 金鑰加上限制，以確保其安全。詳情請參閱[保護未受限的 API 金鑰](/docs/api-key/#secure-unrestricted-keys)。
*   **延遲與效能的取捨**：複雜的查詢、高解析度輸入或高思考等級都可能拉長處理時間。思考等級建議使用 medium，在延遲與效能之間取得良好平衡。
*   **幻覺**：與所有大型語言模型一樣，Gemini Robotics ER 模型偶爾會「產生幻覺」或提供不正確的資訊，特別是在提示詞含糊或輸入超出分布範圍時。
*   **對提示詞品質的依賴**：輸出品質取決於輸入提示詞是否清晰。請使用具體且結構良好的提示詞。
*   **運算成本**：執行模型會消耗運算資源並產生費用，特別是使用影片輸入或高 `thinking_budget` 時。詳情請參閱[思考](/docs/thinking/)頁面。
*   **輸入類型**：各模式限制的詳細資訊請參閱下列主題。
    * [圖片輸入](/docs/image-understanding/#technical-details-image)
    * [影片輸入](/docs/video-understanding/#supported-formats)
    * [音訊輸入](/docs/audio/#supported-formats)


## 隱私權聲明 {#privacy-notice}

你瞭解，本文件所提及的模型（下稱「Robotics Models」）會運用影片與音訊資料來運作，並依你的指示移動你的硬體。因此，你在操作 Robotics Models 時，可能會收集到可識別個人的資料，例如聲音、影像與肖像資料（下稱「個人資料」）。若你選擇以會收集個人資料的方式操作 Robotics Models，你同意：在未充分告知可識別個人並取得其同意之前，你不會允許任何可識別個人與 Robotics Models 互動，或出現在 Robotics Models 周圍的區域；該告知與同意須說明其個人資料可能會依 [https://aistudio.google.com/docs/terms](/docs/terms/) 所載的 Gemini API 附加服務條款（下稱「條款」），包括其中名為「How Google Uses Your Data」的一節所述，提供給 Google 並由 Google 使用。你應確保該告知允許依條款所述收集與使用個人資料，並應盡商業上合理的努力，透過臉部模糊等技術將個人資料的收集與散布降到最低，並在可行範圍內於不含可識別個人的區域操作 Robotics Models。

## 定價 {#pricing}

定價與可用地區的詳細資訊，請參閱[定價](/docs/pricing/)頁面。

## 模型端點 {#model-versions}


=== "Gemini Robotics ER 2 Preview"


    | 屬性 | 說明 |
    | --- | --- |
    | 模型代碼 | `gemini-robotics-er-2-preview` |
    | 支援的資料類型 | **輸入** 文字、圖片、影片、音訊 **輸出** 文字 |
    | token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 131,072 **輸出 token 上限** 65,536 |
    | 功能 | [**音訊生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 支援 [**電腦使用**](/docs/computer-use/) 支援 [**上下文快取**](/docs/caching/) 支援 [**File search**](/docs/file-search/) 支援 [**函式呼叫**](/docs/function-calling/) 支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 支援 [**思考**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 支援 |
    | 取用選項 | [**Batch API**](/docs/batch-api/) 支援 [**Flex inference**](/docs/flex-inference/) 不支援 [**Priority inference**](/docs/priority-inference/) 不支援 |
    | 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。預覽版：`gemini-robotics-er-2-preview` |
    | 最新更新 | 2026 年 7 月 |
    | 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-robotics-er-2/) |
    | 定價 | [定價](/docs/pricing/#gemini-robotics-er-2) |

=== "Gemini Robotics ER 2 Streaming Preview"


    | 屬性 | 說明 |
    | --- | --- |
    | 模型代碼 | `gemini-robotics-er-2-streaming-preview` |
    | 支援的資料類型 | **輸入** 文字、圖片、影片、音訊 **輸出** 文字 |
    | token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 131,072 **輸出 token 上限** 65,536 |
    | 功能 | [**音訊生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 不支援 [**電腦使用**](/docs/computer-use/) 不支援 [**上下文快取**](/docs/caching/) 不支援 [**File search**](/docs/file-search/) 不支援 [**函式呼叫**](/docs/function-calling/) 支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 不支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 支援 [**結構化輸出**](/docs/structured-output/) 不支援 [**思考**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 不支援 |
    | 取用選項 | [**Batch API**](/docs/batch-api/) 不支援 [**Flex inference**](/docs/flex-inference/) 不支援 [**Priority inference**](/docs/priority-inference/) 不支援 |
    | 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。預覽版：`gemini-robotics-er-2-streaming-preview` |
    | 最新更新 | 2026 年 7 月 |
    | 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-robotics-er-2/) |
    | 定價 | [定價](/docs/pricing/#gemini-robotics-er-2-streaming) |

=== "Gemini Robotics ER 1.6 Preview"


    | 屬性 | 說明 |
    | --- | --- |
    | 模型代碼 | `gemini-robotics-er-1.6-preview` |
    | 支援的資料類型 | **輸入** 文字、圖片、影片、音訊 **輸出** 文字 |
    | token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 131,072 **輸出 token 上限** 65,536 |
    | 功能 | [**音訊生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 支援 [**電腦使用**](/docs/computer-use/) 支援 [**上下文快取**](/docs/caching/) 支援 [**File search**](/docs/file-search/) 支援 [**函式呼叫**](/docs/function-calling/) 支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 支援 [**思考**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 支援 |
    | 取用選項 | [**Batch API**](/docs/batch-api/) 支援 [**Flex inference**](/docs/flex-inference/) 支援 [**Priority inference**](/docs/priority-inference/) 支援 |
    | 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。已關閉：`gemini-robotics-er-1.6-preview` |
    | 最新更新 | 2025 年 12 月 |
    | 知識截止日期 | 2025 年 1 月 |


## 後續步驟 {#whats-next}

*   [空間推理](/docs/robotics-spatial/) — 指向、追蹤、邊界框、軌跡。
*   [代理能力](/docs/robotics-agentic/) — 程式碼執行、儀器讀數、圖片標註。
*   [任務編排](/docs/robotics-orchestration/) — 透過自訂機器人 API 完成長程任務。
*   [串流機器人應用](/docs/robotics-streaming/) — 即時雙向串流（僅限 Gemini Robotics ER 2）。
*   [影片理解](/docs/robotics-video-progress/) — 時刻查找與進度分類（僅限 Gemini Robotics ER 2）。
*   [Gemini Robotics 安全性](https://deepmind.google/models/gemini-robotics/safety)
    — 模型系列背後的安全研究。
