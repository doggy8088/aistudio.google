# 使用 Gemini Omni Flash 生成與編輯影片

Gemini Omni 1.2 Flash（`gemini-omni-1.2-flash`）是為快速影片生成、對話式編輯
與電影級掌控而打造的多模態模型。
主要功能包括：

*   **原生多模態**：Omni 可處理文字、圖片與影片輸入，生成最長 15 秒、
    影音同步的影片與原生音訊。
*   **對話式編輯與延伸**：透過 [Interactions
    API](/docs/interactions-overview/)，你可以用自然語言在多個回合中微調、
    編輯與延伸影片。只要描述你想改動的內容，或場景接下來應如何發展，
    Omni 就會更新影片，同時保留場景的
    其餘部分。
*   **角色一致性與世界知識**：Omni 結合對物理與世界知識的理解，
    以及參考素材轉影片的一致性，最多可使用 6 張參考圖片，
    讓角色與物件在不同鏡頭間
    保持一致。


!!! note " "

      `gemini-omni-1.1-flash` 在 4 週的過渡期內仍可使用。
      自 **2026 年 12 月 3 日**起，所有指向 `gemini-omni-1.1-flash` 的 API 請求
      都會自動導向 `gemini-omni-1.2-flash`，無需修改任何程式碼，
      並按較低的 [Gemini Omni 1.2 Flash
      費率](/docs/pricing/#gemini-omni-1.2-flash) 計費。


## 文字轉影片生成 {#text-to-video-generation}

透過文字提示詞生成影片。模型會根據你的文字描述，生成附帶音訊的影片。
撰寫提示詞時加入場景描述、鏡頭運動、光線與氛圍等
細節，效果最佳。


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-omni-1.2-flash",
          input="A marble rolling fast on a chain reaction style track, continuous smooth shot."
      )
      with open("marble.mp4", "wb") as f:
          f.write(base64.b64decode(interaction.output_video.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      import * as fs from 'fs';
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: 'A marble rolling fast on a chain reaction style track, continuous smooth shot.',
      });

      if (interaction.output_video?.data) {
        fs.writeFileSync('marble.mp4', Buffer.from(interaction.output_video.data, 'base64'));
      }
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
              .model(Model.of("gemini-omni-1.2-flash"))
              .input(
                  InteractionsInput.of(
                      "A marble rolling fast on a chain reaction style track, continuous smooth shot."))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputVideo().isPresent() && interaction.outputVideo().get().data().isPresent()) {
        byte[] videoBytes = Base64.getDecoder().decode(interaction.outputVideo().get().data().get());
        Files.write(Paths.get("marble.mp4"), videoBytes);
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
                  Model: interactions.Model("gemini-omni-1.2-flash"),
                  Input: interactions.NewInteractionsInput(
                      "A marble rolling fast on a chain reaction style track, continuous smooth shot.",
                  ),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputVideo != nil && res.Interaction.OutputVideo.Data != nil {
              videoBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputVideo.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("marble.mp4", videoBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
       "model": "gemini-omni-1.2-flash",
       "input": "A marble rolling fast on a chain reaction style track, continuous smooth shot."
      }'
      ```

=== "CLI"

      ```bash
      gemini-api video "A marble rolling fast on a chain reaction style track, continuous smooth shot." \
        -m gemini-omni-1.2-flash \
        --out marble.mp4
      ```


[觀看影片](https://www.youtube.com/watch?v=6DRkXO9nM7g)

### REST 回應結構 {#rest-response-schema}

便利欄位 `interaction.output_video` **僅供 SDK 使用**。
直接使用 REST API 時，請從 `steps` 陣列取得影片輸出。

**原始 REST JSON 結構**：

```json
{
  "steps": [
    { "type": "user_input", "content": [{"type": "text", "text": "..."}] },
    { "type": "thought", "content": [{"text": "...", "type": "thought"}] },
    {
      "type": "model_output",
      "content": [
        {
          "type": "video",
          "mime_type": "video/mp4",
          "data": "AAAAIGZ0eXBpc29t..." // Base64 encoded video data
        }
      ]
    }
  ],
  "id": "v1_...",
  "status": "completed",
  "model": "gemini-omni-1.2-flash",
  "object": "interaction"
}
```

### 控制長寬比 {#control-aspect-ratio}

將 `aspect_ratio` 設為 `"9:16"` 即可建立直式影片。橫式（16:9）
為預設值。


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-omni-1.2-flash",
          input="A futuristic city with neon lights and flying cars, cyberpunk style",
          response_format={
              "type": "video",  # optional
              "aspect_ratio": "9:16"  # Supported values: "9:16", "16:9"
          }
      )
      with open("example.mp4", "wb") as f:
          f.write(base64.b64decode(interaction.output_video.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      import * as fs from 'fs';
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: 'A futuristic city with neon lights and flying cars, cyberpunk style',
        response_format: {
          type: 'video', // optional
          aspect_ratio: '9:16' // Supported values: '9:16', '16:9'
        },
      });

      if (interaction.output_video?.data) {
        fs.writeFileSync('example.mp4', Buffer.from(interaction.output_video.data, 'base64'));
      }
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
      import com.google.genai.gaos.models.interactions.VideoResponseFormat;
      import com.google.genai.gaos.models.interactions.VideoResponseFormatAspectRatio;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Base64;

      Client client = new Client();

      VideoResponseFormat videoFormat =
          VideoResponseFormat.builder()
              .aspectRatio(VideoResponseFormatAspectRatio.of("9:16"))
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-omni-1.2-flash"))
              .input(
                  InteractionsInput.of(
                      "A futuristic city with neon lights and flying cars, cyberpunk style"))
              .responseFormat(CreateModelInteractionResponseFormat.of(ResponseFormat.of(videoFormat)))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputVideo().isPresent() && interaction.outputVideo().get().data().isPresent()) {
        byte[] videoBytes = Base64.getDecoder().decode(interaction.outputVideo().get().data().get());
        Files.write(Paths.get("example.mp4"), videoBytes);
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

          videoFormat := interactions.VideoResponseFormat{
              AspectRatio: interactions.VideoResponseFormatAspectRatioNineHundredAndSixteen.ToPointer(),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-omni-1.2-flash"),
                  Input: interactions.NewInteractionsInput(
                      "A futuristic city with neon lights and flying cars, cyberpunk style",
                  ),
                  ResponseFormat: genai.Ptr(interactions.NewCreateModelInteractionResponseFormat(
                      interactions.NewResponseFormat(videoFormat),
                  )),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputVideo != nil && res.Interaction.OutputVideo.Data != nil {
              videoBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputVideo.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("example.mp4", videoBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
       "model": "gemini-omni-1.2-flash",
       "input": "A futuristic city with neon lights and flying cars, cyberpunk style",
       "response_format": {
         "type": "video",
         "aspect_ratio": "9:16"
       }
      }'
      ```

=== "CLI"

      ```bash
      gemini-api video "A futuristic city with neon lights and flying cars, cyberpunk style" \
        -m gemini-omni-1.2-flash \
        --aspect-ratio 9:16 \
        --out example.mp4
      ```


### 輸出解析度 {#output-resolution}

使用 `resolution` 參數（位於 `response_format` 中），控制生成影片的
輸出解析度。預設解析度為 720p。

| 值 | 說明 |
| :--- | :--- |
| `360p` | 360p 輸出解析度 |
| `720p` | 720p 輸出解析度（預設） |
| `1080p` | 1080p 輸出（放大） |
| `4k` | 4K 輸出（放大） |


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-omni-1.2-flash",
          input="A drone shot of a mountain landscape at sunrise.",
          response_format={
              "type": "video",
              "resolution": "1080p",
          },
      )
      with open("hires.mp4", "wb") as f:
          f.write(base64.b64decode(interaction.output_video.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      import * as fs from 'fs';
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: 'A drone shot of a mountain landscape at sunrise.',
        response_format: {
          type: 'video',
          resolution: '1080p',
        },
      });

      if (interaction.output_video?.data) {
        fs.writeFileSync('hires.mp4', Buffer.from(interaction.output_video.data, 'base64'));
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Resolution;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.VideoResponseFormat;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Base64;

      Client client = new Client();

      VideoResponseFormat videoFormat =
          VideoResponseFormat.builder()
              .resolution(Resolution.of("1080p"))
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-omni-1.2-flash"))
              .input(InteractionsInput.of("A drone shot of a mountain landscape at sunrise."))
              .responseFormat(CreateModelInteractionResponseFormat.of(ResponseFormat.of(videoFormat)))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputVideo().isPresent() && interaction.outputVideo().get().data().isPresent()) {
        byte[] videoBytes = Base64.getDecoder().decode(interaction.outputVideo().get().data().get());
        Files.write(Paths.get("hires.mp4"), videoBytes);
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

          videoFormat := interactions.VideoResponseFormat{
              Resolution: interactions.ResolutionOneThousandAndEightyp.ToPointer(),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-omni-1.2-flash"),
                  Input: interactions.NewInteractionsInput("A drone shot of a mountain landscape at sunrise."),
                  ResponseFormat: genai.Ptr(interactions.NewCreateModelInteractionResponseFormat(
                      interactions.NewResponseFormat(videoFormat),
                  )),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputVideo != nil && res.Interaction.OutputVideo.Data != nil {
              videoBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputVideo.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("hires.mp4", videoBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
       "model": "gemini-omni-1.2-flash",
       "input": "A drone shot of a mountain landscape at sunrise.",
       "response_format": {
         "type": "video",
         "resolution": "1080p"
       }
      }'
      ```

=== "CLI"

      ```bash
      gemini-api video "A drone shot of a mountain landscape at sunrise." \
        -m gemini-omni-1.2-flash \
        --resolution 1080p \
        --out hires.mp4
      ```


[影片](https://storage.googleapis.com/generativeai-downloads/videos/omni_misty_mountains_1080p.mp4)

### 控制影片長度 {#control-video-duration}

你可以將影片的 `duration`（在 `response_format` 中）設為 3 到 15 秒
之間的任意整數秒（例如 `"15s"`）。未設定長度時，模型預設為 10 秒。若在
`response_format` 中設定了長度，模型會採用該值，而非文字提示詞中提及的
任何長度。將長度設為超過 15 秒，會傳回
無效引數錯誤。


!!! note " "

      *   [起始與結束影格插值](/docs/omni/#first-and-last-frame-interpolation)
          與每回合的[影片延伸](/docs/omni/#video-extension)支援 3 到 10 秒的長度
          （延伸後的影片總長最長 30 秒）。
      *   11 到 15 秒的影片支援 1 部參考影片（最長 3 秒），
          3 到 10 秒的影片則支援最多 3 部參考影片。所有長度皆可使用
          最多 6 張參考圖片。詳情請見
          [限制](/docs/omni/#limitations)。


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-omni-1.2-flash",
          input="A single unbroken tracking shot following a paper airplane gliding through a bustling library.",
          response_format={
              "type": "video",
              "duration": "15s",  # Supported values: "3s" to "15s" (default: "10s")
          },
      )
      with open("library_flight.mp4", "wb") as f:
          f.write(base64.b64decode(interaction.output_video.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      import * as fs from 'fs';
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: 'A single unbroken tracking shot following a paper airplane gliding through a bustling library.',
        response_format: {
          type: 'video',
          duration: '15s', // Supported values: '3s' to '15s' (default: '10s')
        },
      });

      if (interaction.output_video?.data) {
        fs.writeFileSync('library_flight.mp4', Buffer.from(interaction.output_video.data, 'base64'));
      }
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
      import com.google.genai.gaos.models.interactions.VideoResponseFormat;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Base64;

      Client client = new Client();

      VideoResponseFormat videoFormat =
          VideoResponseFormat.builder()
              .duration("15s")
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-omni-1.2-flash"))
              .input(
                  InteractionsInput.of(
                      "A single unbroken tracking shot following a paper airplane gliding through a bustling library."))
              .responseFormat(CreateModelInteractionResponseFormat.of(ResponseFormat.of(videoFormat)))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputVideo().isPresent() && interaction.outputVideo().get().data().isPresent()) {
        byte[] videoBytes = Base64.getDecoder().decode(interaction.outputVideo().get().data().get());
        Files.write(Paths.get("library_flight.mp4"), videoBytes);
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

          videoFormat := interactions.VideoResponseFormat{
              Duration: genai.Ptr("15s"),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-omni-1.2-flash"),
                  Input: interactions.NewInteractionsInput(
                      "A single unbroken tracking shot following a paper airplane gliding through a bustling library.",
                  ),
                  ResponseFormat: genai.Ptr(interactions.NewCreateModelInteractionResponseFormat(
                      interactions.NewResponseFormat(videoFormat),
                  )),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputVideo != nil && res.Interaction.OutputVideo.Data != nil {
              videoBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputVideo.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("library_flight.mp4", videoBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
       "model": "gemini-omni-1.2-flash",
       "input": "A single unbroken tracking shot following a paper airplane gliding through a bustling library.",
       "response_format": {
         "type": "video",
         "duration": "15s"
       }
      }'
      ```

=== "CLI"

      ```bash
      gemini-api video "A single unbroken tracking shot following a paper airplane gliding through a bustling library." \
        -m gemini-omni-1.2-flash \
        --body '{"response_format":{"duration":"15s"}}' \
        --out library_flight.mp4
      ```


## 圖片轉影片生成 {#image-to-video-generation}

你可以在文字提示詞之外提供一張參考圖片。模型會依你的
提示詞決定如何運用這張圖片。這項功能很適合讓產品照、
插圖或照片栩栩如生地
動起來。

下例示範如何使用一張魚躍出水面的
繪圖作為參考圖片：

![](https://www.gstatic.com/cloud-cms/04194087dddd37bc098812305b1d8fb1.png)

使用以下提示詞：

```none
turn this into realistic footage, using the drawing only as a guide for movement, do not show the drawing in the final video
```

藉此生成這張繪圖的寫實影片。


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-omni-1.2-flash",
          input=[
              {"type": "image", "data": base64_image, "mime_type": "image/jpeg"},
              {"type": "text", "text": "turn this into realistic footage, using the drawing only as a guide for movement, do not show the drawing in the final video"}
          ],
      )
      with open("clownfish.mp4", "wb") as f:
          f.write(base64.b64decode(interaction.output_video.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      import * as fs from 'fs';
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: [
          { type: 'image', data: base64Image, mime_type: 'image/jpeg' },
          { type: 'text', text: 'turn this into realistic footage, using the drawing only as a guide for movement, do not show the drawing in the final video' }
        ]
      });

      if (interaction.output_video?.data) {
        fs.writeFileSync('clownfish.mp4', Buffer.from(interaction.output_video.data, 'base64'));
      }
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

      byte[] imageBytes = Files.readAllBytes(Paths.get("drawing.jpg"));
      String base64Image = Base64.getEncoder().encodeToString(imageBytes);

      Content imageContent =
          ImageContent.builder()
              .data(base64Image)
              .mimeType(ImageContentMimeType.IMAGE_JPEG)
              .build();

      Content textContent =
          TextContent.builder()
              .text(
                  "turn this into realistic footage, using the drawing only as a guide for movement, do not show the drawing in the final video")
              .build();

      List<Content> contents = Arrays.asList(imageContent, textContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-omni-1.2-flash"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputVideo().isPresent() && interaction.outputVideo().get().data().isPresent()) {
        byte[] videoBytes = Base64.getDecoder().decode(interaction.outputVideo().get().data().get());
        Files.write(Paths.get("clownfish.mp4"), videoBytes);
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

          imageBytes, err := os.ReadFile("drawing.jpg")
          if err != nil {
              log.Fatal(err)
          }
          base64Image := base64.StdEncoding.EncodeToString(imageBytes)

          contents := []interactions.Content{
              interactions.NewContent(interactions.ImageContent{
                  Data:     genai.Ptr(base64Image),
                  MimeType: interactions.ImageContentMimeTypeImageJpeg.ToPointer(),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: "turn this into realistic footage, using the drawing only as a guide for movement, do not show the drawing in the final video",
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-omni-1.2-flash"),
                  Input: interactions.NewInteractionsInput(contents),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputVideo != nil && res.Interaction.OutputVideo.Data != nil {
              videoBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputVideo.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("clownfish.mp4", videoBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
       "model": "gemini-omni-1.2-flash",
       "input": [
         {"type": "image", "data": "'"$BASE64_IMAGE"'", "mime_type": "image/jpeg"},
         {"type": "text", "text": "turn this into realistic footage, using the drawing only as a guide for movement, do not show the drawing in the final video"}
       ]
      }'
      ```

=== "CLI"

      ```bash
      gemini-api video "turn this into realistic footage, using the drawing only as a guide for movement, do not show the drawing in the final video" \
        -m gemini-omni-1.2-flash \
        -i drawing.jpg \
        --out clownfish.mp4
      ```


[觀看影片](https://www.youtube.com/watch?v=zTNIIZ0X7mA)


!!! note " "

      為了讓圖轉影片效果最佳，請使用高解析度圖片，並提供具體的動作描述。
      像「讓它動起來」這類含糊的提示詞，效果不如詳細描述鏡頭運動、
      主體動作與環境
      效果的提示詞。


### 起始與結束影格插值 {#first-and-last-frame-interpolation}

Gemini Omni Flash 支援影片插值，可讓你生成一段在起始圖片（起始影格）
與結束圖片（結束影格）之間平順
轉換的影片。

在 `input` 清單中提供兩張圖片，並在提示詞中描述想要的轉換效果。
模型會讓場景從起始影格一路動態
過渡到結束影格。


!!! note " "

      起始與結束影格插值支援 3 到 10 秒的影片長度。若同時傳入起始與結束
      影格，又將長度設為超過 10 秒，API 會傳回無效引數錯誤。單張圖片
      生成最長支援
      15 秒。


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-omni-1.2-flash",
          input=[
              {"type": "image", "data": first_frame_b64, "mime_type": "image/jpeg"},
              {"type": "image", "data": last_frame_b64, "mime_type": "image/jpeg"},
              {"type": "text", "text": "A smooth cinematic transition from a lush green forest at sunrise to a snowy forest under a starry night sky."}
          ],
      )
      with open("interpolation.mp4", "wb") as f:
          f.write(base64.b64decode(interaction.output_video.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      import * as fs from 'fs';
      const ai = new GoogleGenAI({});

      const firstFrameB64 = '...';
      const lastFrameB64 = '...';

      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: [
          { type: 'image', data: firstFrameB64, mime_type: 'image/jpeg' },
          { type: 'image', data: lastFrameB64, mime_type: 'image/jpeg' },
          { type: 'text', text: 'A smooth cinematic transition from a lush green forest at sunrise to a snowy forest under a starry night sky.' }
        ]
      });

      if (interaction.output_video?.data) {
        fs.writeFileSync('interpolation.mp4', Buffer.from(interaction.output_video.data, 'base64'));
      }
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

      String firstFrameB64 =
          Base64.getEncoder().encodeToString(Files.readAllBytes(Paths.get("first_frame.jpg")));
      String lastFrameB64 =
          Base64.getEncoder().encodeToString(Files.readAllBytes(Paths.get("last_frame.jpg")));

      Content firstFrame =
          ImageContent.builder()
              .data(firstFrameB64)
              .mimeType(ImageContentMimeType.IMAGE_JPEG)
              .build();

      Content lastFrame =
          ImageContent.builder()
              .data(lastFrameB64)
              .mimeType(ImageContentMimeType.IMAGE_JPEG)
              .build();

      Content prompt =
          TextContent.builder()
              .text(
                  "A smooth cinematic transition from a lush green forest at sunrise to a snowy forest under a starry night sky.")
              .build();

      List<Content> contents = Arrays.asList(firstFrame, lastFrame, prompt);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-omni-1.2-flash"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputVideo().isPresent() && interaction.outputVideo().get().data().isPresent()) {
        byte[] videoBytes = Base64.getDecoder().decode(interaction.outputVideo().get().data().get());
        Files.write(Paths.get("interpolation.mp4"), videoBytes);
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

          firstBytes, err := os.ReadFile("first_frame.jpg")
          if err != nil {
              log.Fatal(err)
          }
          lastBytes, err := os.ReadFile("last_frame.jpg")
          if err != nil {
              log.Fatal(err)
          }

          firstFrameB64 := base64.StdEncoding.EncodeToString(firstBytes)
          lastFrameB64 := base64.StdEncoding.EncodeToString(lastBytes)

          contents := []interactions.Content{
              interactions.NewContent(interactions.ImageContent{
                  Data:     genai.Ptr(firstFrameB64),
                  MimeType: interactions.ImageContentMimeTypeImageJpeg.ToPointer(),
              }),
              interactions.NewContent(interactions.ImageContent{
                  Data:     genai.Ptr(lastFrameB64),
                  MimeType: interactions.ImageContentMimeTypeImageJpeg.ToPointer(),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: "A smooth cinematic transition from a lush green forest at sunrise to a snowy forest under a starry night sky.",
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-omni-1.2-flash"),
                  Input: interactions.NewInteractionsInput(contents),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputVideo != nil && res.Interaction.OutputVideo.Data != nil {
              videoBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputVideo.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("interpolation.mp4", videoBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
       "model": "gemini-omni-1.2-flash",
       "input": [
         {"type": "image", "data": "'"$FIRST_FRAME_B64"'", "mime_type": "image/jpeg"},
         {"type": "image", "data": "'"$LAST_FRAME_B64"'", "mime_type": "image/jpeg"},
         {"type": "text", "text": "A smooth cinematic transition from a lush green forest at sunrise to a snowy forest under a starry night sky."}
       ]
      }'
      ```

=== "CLI"

      ```bash
      gemini-api video "A smooth cinematic transition from a lush green forest at sunrise to a snowy forest under a starry night sky." \
        -m gemini-omni-1.2-flash \
        -i first_frame.jpg \
        -i last_frame.jpg \
        --out interpolation.mp4
      ```


[影片](https://storage.googleapis.com/generativeai-downloads/videos/omni_keyframe_interpolation.mp4)

### 主體參考 {#subject-reference}

你可以生成納入參考圖片所提供之特定主體的影片。Gemini Omni 1.2 Flash
每次請求最多支援 6 張參考圖片（每個角色最多 3 張、最多 2 個角色），
讓角色的樣貌、服裝與物件在不同鏡頭間保持一致。舉例來說，以下程式碼
提供貓與毛線的 2 張圖片，生成貓玩毛線的
影片。



=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-omni-1.2-flash",
          input=[
              {"type": "image", "data": cat_b64, "mime_type": "image/png"},
              {"type": "image", "data": yarn_b64, "mime_type": "image/png"},
              {"type": "text", "text": "A cat playfully batting at a ball of yarn."}
          ],
      )
      with open("cat.mp4", "wb") as f:
          f.write(base64.b64decode(interaction.output_video.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      import * as fs from 'fs';
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: [
          { type: 'image', data: catData, mime_type: 'image/png' },
          { type: 'image', data: yarnData, mime_type: 'image/png' },
          { type: 'text', text: 'A cat playfully batting at a ball of yarn.' }
        ]
      });

      if (interaction.output_video?.data) {
        fs.writeFileSync('cat.mp4', Buffer.from(interaction.output_video.data, 'base64'));
      }
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

      String catB64 = Base64.getEncoder().encodeToString(Files.readAllBytes(Paths.get("cat.png")));
      String yarnB64 = Base64.getEncoder().encodeToString(Files.readAllBytes(Paths.get("yarn.png")));

      Content catImage =
          ImageContent.builder()
              .data(catB64)
              .mimeType(ImageContentMimeType.IMAGE_PNG)
              .build();

      Content yarnImage =
          ImageContent.builder()
              .data(yarnB64)
              .mimeType(ImageContentMimeType.IMAGE_PNG)
              .build();

      Content textContent =
          TextContent.builder()
              .text("A cat playfully batting at a ball of yarn.")
              .build();

      List<Content> contents = Arrays.asList(catImage, yarnImage, textContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-omni-1.2-flash"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputVideo().isPresent() && interaction.outputVideo().get().data().isPresent()) {
        byte[] videoBytes = Base64.getDecoder().decode(interaction.outputVideo().get().data().get());
        Files.write(Paths.get("cat.mp4"), videoBytes);
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

          catBytes, err := os.ReadFile("cat.png")
          if err != nil {
              log.Fatal(err)
          }
          yarnBytes, err := os.ReadFile("yarn.png")
          if err != nil {
              log.Fatal(err)
          }

          catB64 := base64.StdEncoding.EncodeToString(catBytes)
          yarnB64 := base64.StdEncoding.EncodeToString(yarnBytes)

          contents := []interactions.Content{
              interactions.NewContent(interactions.ImageContent{
                  Data:     genai.Ptr(catB64),
                  MimeType: interactions.ImageContentMimeTypeImagePng.ToPointer(),
              }),
              interactions.NewContent(interactions.ImageContent{
                  Data:     genai.Ptr(yarnB64),
                  MimeType: interactions.ImageContentMimeTypeImagePng.ToPointer(),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: "A cat playfully batting at a ball of yarn.",
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-omni-1.2-flash"),
                  Input: interactions.NewInteractionsInput(contents),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputVideo != nil && res.Interaction.OutputVideo.Data != nil {
              videoBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputVideo.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("cat.mp4", videoBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
       "model": "gemini-omni-1.2-flash",
       "input": [
         {"type": "image", "data": "'"$CAT_B64"'", "mime_type": "image/png"},
         {"type": "image", "data": "'"$YARN_B64"'", "mime_type": "image/png"},
         {"type": "text", "text": "A cat playfully batting at a ball of yarn."}
       ]
      }'
      ```

=== "CLI"

      ```bash
      gemini-api video "A cat playfully batting at a ball of yarn." \
        -m gemini-omni-1.2-flash \
        -i cat.png \
        -i yarn.png \
        --out cat.mp4
      ```


### task 參數 {#tasks-parameter}

模型預設會直接從你的自然語言提示詞，推斷生成模式與媒體角色。若光靠
提示詞無法選到預期的模式，可將 `task` 參數（在 `video_config` 中）設為
備援手段（例如
`image_to_video`）。


!!! note " "

      務必先嘗試不加 `task` 的自然語言提示詞。設定 `task` 會加上嚴格限制，例如限制輸入圖片，或鎖定多個媒體輸入的組合方式。只有在光靠提示詞無法選到預期模式時，才把 `task` 當作備援手段。


!!! warning " "

      不要在文字提示詞中加入控制字串（例如 `<FIRST_FRAME>`、`<LAST_FRAME>`、`<IMAGE_REF_0>` 或 `<VIDEO_REF_0>`）。這些標籤已淘汰，未來的模型也不再支援。請改以自然語言描述每張圖片或每部影片應如何使用。


允許的值如下：

*   `text_to_video`
*   `image_to_video`
*   `reference_to_video`
*   `edit`
*   `extend`

下例示範如何為先前展示的圖轉影片
範例設定此參數。


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-omni-1.2-flash",
          input=[
              {"type": "image", "data": base64_image, "mime_type": "image/jpeg"},
              {"type": "text", "text": "turn this into realistic footage, using the drawing only as a guide for movement, do not show the drawing in the final video"}
          ],
          generation_config={
            "video_config": {
              "task": "image_to_video",
            }
          },
      )
      with open("example.mp4", "wb") as f:
          f.write(base64.b64decode(interaction.output_video.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from 'fs';
      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: [
          { type: 'image', data: base64Image, mime_type: 'image/jpeg' },
          { type: 'text', text: 'turn this into realistic footage, using the drawing only as a guide for movement, do not show the drawing in the final video' }
        ],
        generation_config: {
          video_config: {
            task: 'image_to_video',
          }
        }
      });

      if (interaction.output_video?.data) {
        fs.writeFileSync('example.mp4', Buffer.from(interaction.output_video.data, 'base64'));
      }
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
      import com.google.genai.gaos.models.interactions.Task;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.VideoConfig;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      Client client = new Client();

      byte[] imageBytes = Files.readAllBytes(Paths.get("drawing.jpg"));
      String base64Image = Base64.getEncoder().encodeToString(imageBytes);

      Content imageContent =
          ImageContent.builder()
              .data(base64Image)
              .mimeType(ImageContentMimeType.IMAGE_JPEG)
              .build();

      Content textContent =
          TextContent.builder()
              .text(
                  "turn this into realistic footage, using the drawing only as a guide for movement, do not show the drawing in the final video")
              .build();

      List<Content> contents = Arrays.asList(imageContent, textContent);

      GenerationConfig generationConfig =
          GenerationConfig.builder()
              .videoConfig(VideoConfig.builder().task(Task.IMAGE_TO_VIDEO).build())
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-omni-1.2-flash"))
              .input(InteractionsInput.ofContent(contents))
              .generationConfig(generationConfig)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputVideo().isPresent() && interaction.outputVideo().get().data().isPresent()) {
        byte[] videoBytes = Base64.getDecoder().decode(interaction.outputVideo().get().data().get());
        Files.write(Paths.get("example.mp4"), videoBytes);
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

          imageBytes, err := os.ReadFile("drawing.jpg")
          if err != nil {
              log.Fatal(err)
          }
          base64Image := base64.StdEncoding.EncodeToString(imageBytes)

          contents := []interactions.Content{
              interactions.NewContent(interactions.ImageContent{
                  Data:     genai.Ptr(base64Image),
                  MimeType: interactions.ImageContentMimeTypeImageJpeg.ToPointer(),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: "turn this into realistic footage, using the drawing only as a guide for movement, do not show the drawing in the final video",
              }),
          }

          generationConfig := &interactions.GenerationConfig{
              VideoConfig: &interactions.VideoConfig{
                  Task: interactions.TaskImageToVideo.ToPointer(),
              },
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:            interactions.Model("gemini-omni-1.2-flash"),
                  Input:            interactions.NewInteractionsInput(contents),
                  GenerationConfig: generationConfig,
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputVideo != nil && res.Interaction.OutputVideo.Data != nil {
              videoBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputVideo.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("example.mp4", videoBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-omni-1.2-flash",
          "input": [
            {
              "type": "image",
              "data": "'"$BASE64_IMAGE"'",
              "mime_type": "image/jpeg"
            },
            {
              "type": "text",
              "text": "turn this into realistic footage, using the drawing only as a guide for movement, do not show the drawing in the final video"
            }
          ],
          "generation_config": {
            "video_config": {
              "task": "image_to_video"
            }
          }
        }'
      ```

=== "CLI"

      ```bash
      gemini-api video "turn this into realistic footage, using the drawing only as a guide for movement, do not show the drawing in the final video" \
        -m gemini-omni-1.2-flash \
        -i drawing.jpg \
        --body '{"generation_config":{"video_config":{"task":"image_to_video"}}}' \
        --out example.mp4
      ```


## 有狀態的影片編輯 {#stateful-video-editing}

生成影片後，可用後續提示詞反覆編輯。每一回合都建立在前一回合的結果
之上。模型會記住影片上下文，套用你的變更，同時保留你未提及的元素。
使用 `previous_interaction_id` 追蹤對話記錄，即可編輯最長 15 秒的
生成影片，無需重新上傳
前一部影片。


!!! note " "

      影片編輯限制的完整清單，請見
      [限制](/docs/omni/#limitations)。


下例示範如何先生成第一部影片，再加以編輯：


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client()

      # Turn 1: Generate initial video
      res1 = client.interactions.create(model="gemini-omni-1.2-flash", input="A woman playing violin outdoors.")

      # Turn 2: Edit the previous video
      res2 = client.interactions.create(
          model="gemini-omni-1.2-flash",
          previous_interaction_id=res1.id,
          input="Make the violin invisible."
      )
      with open("example.mp4", "wb") as f:
          f.write(base64.b64decode(res2.output_video.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      import * as fs from 'fs';
      const ai = new GoogleGenAI({});

      // Turn 1: Generate initial video
      const res1 = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: 'A woman playing violin outdoors.',
      });

      // Turn 2: Edit the previous video
      const res2 = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        previous_interaction_id: res1.id,
        input: 'Make the violin invisible.',
      });

      if (res2.output_video?.data) {
        fs.writeFileSync('example.mp4', Buffer.from(res2.output_video.data, 'base64'));
      }
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

      // Turn 1: Generate initial video
      CreateModelInteraction turn1Params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-omni-1.2-flash"))
              .input(InteractionsInput.of("A woman playing violin outdoors."))
              .build();

      Interaction res1 =
          client.interactions.create(CreateInteractionRequestBody.of(turn1Params)).interaction().get();

      // Turn 2: Edit the previous video
      CreateModelInteraction turn2Params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-omni-1.2-flash"))
              .previousInteractionId(res1.id().get())
              .input(InteractionsInput.of("Make the violin invisible."))
              .build();

      Interaction res2 =
          client.interactions.create(CreateInteractionRequestBody.of(turn2Params)).interaction().get();

      if (res2.outputVideo().isPresent() && res2.outputVideo().get().data().isPresent()) {
        byte[] videoBytes = Base64.getDecoder().decode(res2.outputVideo().get().data().get());
        Files.write(Paths.get("example.mp4"), videoBytes);
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

          // Turn 1: Generate initial video
          res1, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-omni-1.2-flash"),
                  Input: interactions.NewInteractionsInput("A woman playing violin outdoors."),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          // Turn 2: Edit the previous video
          res2, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:                 interactions.Model("gemini-omni-1.2-flash"),
                  PreviousInteractionID: res1.Interaction.ID,
                  Input:                 interactions.NewInteractionsInput("Make the violin invisible."),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res2.Interaction.OutputVideo != nil && res2.Interaction.OutputVideo.Data != nil {
              videoBytes, err := base64.StdEncoding.DecodeString(*res2.Interaction.OutputVideo.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("example.mp4", videoBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
       "model": "gemini-omni-1.2-flash",
       "previous_interaction_id": "'"$PREVIOUS_ID"'",
       "input": "Make the violin invisible."
      }'
      ```

=== "CLI"

      ```bash
      ID=$(gemini-api video "A woman playing violin outdoors." -m gemini-omni-1.2-flash --out violin.mp4 --jq '.response_id')
      gemini-api video "Make the violin invisible." -m gemini-omni-1.2-flash --previous-interaction-id "$ID" --out example.mp4
      ```


初始影片範例：

[觀看影片](https://www.youtube.com/watch?v=9yk4HuZmF0g)

編輯後影片範例：

[觀看影片](https://www.youtube.com/watch?v=U5GXcvq6GZY)

對話的每一回合都會產生一部新影片。模型能理解先前回合的上下文，
讓你逐步微調，例如調整光線、更換背景，而無需重新描述
整個場景。

### 編輯你自己的影片 {#edit-your-own-videos}

使用 [Files API](/docs/files/) 上傳你的影片（最長 15 秒），
即可用 Gemini Omni Flash 加以編輯。


!!! note " "

      編輯上傳的影片並非所有地區都可使用。詳情請見 [限制](/docs/omni/#limitations)
      一節。


下例示範如何編輯以下原始影片：

[觀看影片](https://www.youtube.com/watch?v=lw9MJDx9Zas)


=== "Python"

      ```python
      import time
      import base64
      from google import genai

      client = genai.Client()

      # Upload video using the file API
      video_file = client.files.upload(file="Video.mp4")

      while video_file.state == "PROCESSING":
          print('Waiting for video to be processed.')
          time.sleep(10)
          video_file = client.files.get(name=video_file.name)

      if video_file.state == "FAILED":
        raise ValueError(video_file.state)
      print(f'Video processing complete: ' + video_file.uri)

      # Edit your video
      interaction = client.interactions.create(
          model="gemini-omni-1.2-flash",
          input=[
              {"type": "video", "uri": video_file.uri},
              {"type": "text", "text": "When the person touches the mirror, make the mirror ripple beautifully like liquid, and the person's arm turns into reflective mirror material"}
          ],
      )
      with open("example.mp4", "wb") as f:
          f.write(base64.b64decode(interaction.output_video.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      import * as fs from 'fs';
      const ai = new GoogleGenAI({});

      // Upload video using the file API
      let videoFile = await ai.files.upload({
        file: 'Video.mp4',
      });

      while (videoFile.state === 'PROCESSING') {
        console.log('Waiting for video to be processed.');
        await new Promise(r => setTimeout(r, 10000));
        videoFile = await ai.files.get({ name: videoFile.name || '' });
      }

      if (videoFile.state === 'FAILED') {
        throw new Error(videoFile.state);
      }
      console.log('Video processing complete: ' + videoFile.uri);

      // Edit your video
      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: [
          { type: 'video', uri: videoFile.uri },
          { type: 'text', text: "When the person touches the mirror, make the mirror ripple beautifully like liquid, and the person's arm turns into reflective mirror material" }
        ],
      });

      if (interaction.output_video?.data) {
        fs.writeFileSync('example.mp4', Buffer.from(interaction.output_video.data, 'base64'));
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.VideoContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.File;
      import com.google.genai.types.FileState;
      import com.google.genai.types.UploadFileConfig;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      Client client = new Client();

      // Upload video using the file API
      File videoFile =
          client.files.upload("Video.mp4", UploadFileConfig.builder().mimeType("video/mp4").build());

      while (videoFile.state().isPresent()
          && videoFile.state().get().knownEnum() == FileState.Known.PROCESSING) {
        System.out.println("Waiting for video to be processed.");
        Thread.sleep(10000);
        videoFile = client.files.get(videoFile.name().get(), null);
      }

      if (videoFile.state().isPresent()
          && videoFile.state().get().knownEnum() == FileState.Known.FAILED) {
        throw new IllegalStateException("Video processing failed: " + videoFile.state().get());
      }
      System.out.println("Video processing complete: " + videoFile.uri().orElse(""));

      // Edit your video
      Content videoContent = VideoContent.builder().uri(videoFile.uri().get()).build();
      Content textContent =
          TextContent.builder()
              .text(
                  "When the person touches the mirror, make the mirror ripple beautifully like liquid, and the person's arm turns into reflective mirror material")
              .build();

      List<Content> contents = Arrays.asList(videoContent, textContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-omni-1.2-flash"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputVideo().isPresent() && interaction.outputVideo().get().data().isPresent()) {
        byte[] videoBytes = Base64.getDecoder().decode(interaction.outputVideo().get().data().get());
        Files.write(Paths.get("example.mp4"), videoBytes);
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
          "time"

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

          // Upload video using the file API
          videoFile, err := client.Files.UploadFromPath(ctx, "Video.mp4", &genai.UploadFileConfig{
              MIMEType: "video/mp4",
          })
          if err != nil {
              log.Fatal(err)
          }

          for videoFile.State == genai.FileStateProcessing {
              fmt.Println("Waiting for video to be processed.")
              time.Sleep(10 * time.Second)
              videoFile, err = client.Files.Get(ctx, videoFile.Name, nil)
              if err != nil {
                  log.Fatal(err)
              }
          }

          if videoFile.State == genai.FileStateFailed {
              log.Fatalf("Video processing failed: %s", videoFile.State)
          }
          fmt.Printf("Video processing complete: %s\n", videoFile.URI)

          // Edit your video
          contents := []interactions.Content{
              interactions.NewContent(interactions.VideoContent{
                  URI: genai.Ptr(videoFile.URI),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: "When the person touches the mirror, make the mirror ripple beautifully like liquid, and the person's arm turns into reflective mirror material",
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-omni-1.2-flash"),
                  Input: interactions.NewInteractionsInput(contents),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputVideo != nil && res.Interaction.OutputVideo.Data != nil {
              videoBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputVideo.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("example.mp4", videoBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      #!/bin/bash
      VIDEO_B64=$(encode_file "$VIDEO_FILE")

      curl -sS -w "\n[HTTP %{http_code}]\n" "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: ${API_KEY}" \
        -H "Content-Type: application/json" \
        -d @- <<EOF > video_editing_response.json
      {
        "model": "gemini-omni-1.2-flash",
        "input": [
          {
            "type": "user_input",
            "content": [
              {
                "type": "video",
                "mime_type": "video/mp4",
                "data": "$VIDEO_B64"
              },
              {
                "type": "text",
                "text": "When the person touches the mirror, make the mirror ripple beautifully like liquid, and the person's arm turns into reflective mirror material"
              }
            ]
          }
        ],
        "response_format": { "type": "video" }
      }
      EOF
      ```

=== "CLI"

      ```bash
      VIDEO=$(gemini-api files upload Video.mp4 --wait)
      gemini-api video "When the person touches the mirror, make the mirror ripple beautifully like liquid, and the person's arm turns into reflective mirror material" \
        -m gemini-omni-1.2-flash \
        -i "$VIDEO" \
        --out example.mp4
      ```


編輯後影片範例：

[觀看影片](https://www.youtube.com/watch?v=Bn-6vCl1wgQ)


!!! note " "

      你也可以直接以 base64 傳入資料，但影片檔案可能相當大，
      建議使用 File API。


## 以 URI 取得影片 {#retrieving-videos-with-an-uri}

使用 `delivery="uri"` 參數（在 `response_format` 中），
即可取得大於 4MB 的生成影片。這會傳回一個由 Google 代管的 URI，
你可以輪詢該 URI，直到影片狀態為
`ACTIVE` 後再下載。


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client()

      # 1. Request video via URI delivery
      interaction = client.interactions.create(
          model="gemini-omni-1.2-flash",
          input="A beautiful sunset.",
          response_format={"type": "video", "delivery": "uri"}
      )

      # 2. Extract file name and poll for ACTIVE state
      video_output = interaction.output_video
      file_name = video_output.uri.split("/")[-1] # Extract ID

      print("Waiting for video processing...")
      while True:
          f_info = client.files.get(name=f"files/{file_name}")
          if f_info.state.name == "ACTIVE":
              break
          elif f_info.state.name == "FAILED":
              raise RuntimeError("Generation failed.")
          time.sleep(5)

      # 3. Download the final video
      client.files.download(file=video_output.uri, destination="output.mp4")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      const ai = new GoogleGenAI({});

      // 1. Request video using URI delivery
      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: 'A beautiful sunset.',
        response_format: { type: 'video', delivery: 'uri' },
      });

      // 2. Extract filename and poll for ACTIVE state
      const videoOutput = interaction.output_video;
      const fileId = videoOutput?.uri?.match(/files\/([a-zA-Z0-9]+)/)?.[1] || '';
      const name = `files/${fileId}`;

      console.log("Waiting for video processing...");
      while (true) {
        const fInfo = await ai.files.get({ name });
        if (fInfo.state === 'ACTIVE') break;
        if (fInfo.state === 'FAILED') throw new Error("Generation failed.");
        await new Promise(r => setTimeout(r, 5000));
      }

      // 3. Download the final video
      await ai.files.download({
        file: name,
        downloadPath: 'output.mp4',
      });
      console.log("💾 Saved video to output.mp4");
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
      import com.google.genai.gaos.models.interactions.VideoContent;
      import com.google.genai.gaos.models.interactions.VideoResponseFormat;
      import com.google.genai.gaos.models.interactions.VideoResponseFormatDelivery;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.File;
      import com.google.genai.types.FileState;

      Client client = new Client();

      // 1. Request video using URI delivery
      VideoResponseFormat videoFormat =
          VideoResponseFormat.builder()
              .delivery(VideoResponseFormatDelivery.URI)
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-omni-1.2-flash"))
              .input(InteractionsInput.of("A beautiful sunset."))
              .responseFormat(CreateModelInteractionResponseFormat.of(ResponseFormat.of(videoFormat)))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      // 2. Extract filename and poll for ACTIVE state
      VideoContent videoOutput = interaction.outputVideo().get();
      String uri = videoOutput.uri().get();
      String[] parts = uri.split("/");
      String fileName = parts[parts.length - 1];

      System.out.println("Waiting for video processing...");
      while (true) {
        File fileInfo = client.files.get("files/" + fileName, null);
        if (fileInfo.state().isPresent()
            && fileInfo.state().get().knownEnum() == FileState.Known.ACTIVE) {
          break;
        } else if (fileInfo.state().isPresent()
            && fileInfo.state().get().knownEnum() == FileState.Known.FAILED) {
          throw new RuntimeException("Generation failed.");
        }
        Thread.sleep(5000);
      }

      // 3. Download the final video
      client.files.download(uri, "output.mp4", null);
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "os"
          "strings"
          "time"

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

          // 1. Request video using URI delivery
          videoFormat := interactions.VideoResponseFormat{
              Delivery: interactions.VideoResponseFormatDeliveryURI.ToPointer(),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-omni-1.2-flash"),
                  Input: interactions.NewInteractionsInput("A beautiful sunset."),
                  ResponseFormat: genai.Ptr(interactions.NewCreateModelInteractionResponseFormat(
                      interactions.NewResponseFormat(videoFormat),
                  )),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          // 2. Extract filename and poll for ACTIVE state
          uri := *res.Interaction.OutputVideo.URI
          parts := strings.Split(uri, "/")
          fileName := parts[len(parts)-1]

          fmt.Println("Waiting for video processing...")
          var fileInfo *genai.File
          for {
              fileInfo, err = client.Files.Get(ctx, "files/"+fileName, nil)
              if err != nil {
                  log.Fatal(err)
              }
              if fileInfo.State == genai.FileStateActive {
                  break
              } else if fileInfo.State == genai.FileStateFailed {
                  log.Fatal("Generation failed.")
              }
              time.Sleep(5 * time.Second)
          }

          // 3. Download the final video
          videoBytes, err := client.Files.Download(ctx, genai.NewDownloadURIFromFile(fileInfo), nil)
          if err != nil {
              log.Fatal(err)
          }
          if err := os.WriteFile("output.mp4", videoBytes, 0644); err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```bash
      #!/bin/bash

      # 1. Initial request to generate the video
      RESPONSE=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
       "model": "gemini-omni-1.2-flash",
       "input": "A beautiful sunset over a calm ocean.",
       "response_format": {"type": "video", "delivery": "uri"}
      }')

      # Extract FILE_ID from the URI (e.g., "files/abc-123" -> "abc-123")
      FILE_URI=$(echo $RESPONSE | jq -r '.output_video.uri')
      FILE_ID=$(echo $FILE_URI | cut -d'/' -f2)

      echo "Video requested (ID: $FILE_ID). Waiting for processing..."

      # 2. Polling loop
      while true; do
       # Get current file status
       STATUS_JSON=$(curl -s -X GET "https://generativelanguage.googleapis.com/v1beta/files/$FILE_ID?key=$API_KEY")
       STATE=$(echo $STATUS_JSON | jq -r '.state')

       if [ "$STATE" == "ACTIVE" ]; then
         echo "Processing complete! Downloading..."
         break
       elif [ "$STATE" == "FAILED" ]; then
         echo "Error: Generation failed."
         exit 1
       else
         echo "Current state: $STATE... (waiting 5s)"
         sleep 5
       fi
      done

      # 3. Final download
      curl -L -X GET "https://generativelanguage.googleapis.com/v1beta/files/$FILE_ID:download?alt=media&key=$API_KEY" \
      --output "output.mp4"

      echo "Done! Video saved to output.mp4"
      ```


**原始 REST JSON 結構（URI）**：

```json
{
  "steps": [
    { "type": "user_input", "content": [{"type": "text", "text": "..."}] },
    { "type": "thought", "content": [{"text": "...", "type": "thought"}] },
    {
      "type": "model_output",
      "content": [
        {
          "type": "video",
          "mime_type": "video/mp4",
          "uri": "https://generativelanguage.googleapis.com/v1beta/files/...:download?alt=media"
        }
      ]
    }
  ],
  "id": "v1_...",
  "status": "completed",
  "model": "gemini-omni-1.2-flash",
  "object": "interaction"
}
```


!!! note " "

      目前，呼叫 `GET /v1beta/interactions/{id}` 時，仍會在 `data` 欄位中以內嵌
      base64 資料傳回影片，即使該互動最初是以 `delivery: "uri"` 建立。
      `uri` 欄位僅保證出現在初始建立回應或
      Server-Sent Events（SSE）串流中。


## 影片延伸 {#video-extension}

在片段尾端生成無縫接續的內容，延伸既有影片。在提示詞中描述你希望
影片如何接續，例如 `"Extend this video"` 或
`"Continue the scene: the camera pans across the mountains"`。模型會使用
輸入影片的最後 10 秒，生成 3 到 10 秒的接續內容（預設 10 秒，或以
`duration`（在 `response_format` 中）設定），影片總長
最長可達 30 秒。

你可以延伸：

*   **模型生成的影片（多回合）**：以 `previous_interaction_id` 參照
    先前生成的影片，加以延伸。
*   **上傳的影片**：提供已上傳的影片檔案（透過 Files API），
    並附上你的延伸提示詞。


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client()

      # Upload your video using the Files API
      video_file = client.files.upload(file="my_video.mp4")

      # Extend the video using prompt-based extension
      interaction = client.interactions.create(
          model="gemini-omni-1.2-flash",
          input=[
              {"type": "video", "uri": video_file.uri},
              {"type": "text", "text": "Continue the scene."}
          ],
      )
      with open("extended.mp4", "wb") as f:
          f.write(base64.b64decode(interaction.output_video.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      import * as fs from 'fs';
      const ai = new GoogleGenAI({});

      // Upload your video using the Files API
      let videoFile = await ai.files.upload({
        file: 'my_video.mp4',
      });

      while (videoFile.state === 'PROCESSING') {
        await new Promise(r => setTimeout(r, 10000));
        videoFile = await ai.files.get({ name: videoFile.name || '' });
      }

      // Extend the video using prompt-based extension
      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: [
          { type: 'video', uri: videoFile.uri },
          { type: 'text', text: 'Continue the scene.' }
        ],
      });

      if (interaction.output_video?.data) {
        fs.writeFileSync('extended.mp4', Buffer.from(interaction.output_video.data, 'base64'));
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.VideoContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.File;
      import com.google.genai.types.UploadFileConfig;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      Client client = new Client();

      // Upload your video using the Files API
      File videoFile =
          client.files.upload(
              "my_video.mp4", UploadFileConfig.builder().mimeType("video/mp4").build());

      // Extend the video using prompt-based extension
      Content videoContent = VideoContent.builder().uri(videoFile.uri().get()).build();
      Content textContent = TextContent.builder().text("Continue the scene.").build();

      List<Content> contents = Arrays.asList(videoContent, textContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-omni-1.2-flash"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputVideo().isPresent() && interaction.outputVideo().get().data().isPresent()) {
        byte[] videoBytes = Base64.getDecoder().decode(interaction.outputVideo().get().data().get());
        Files.write(Paths.get("extended.mp4"), videoBytes);
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

          // Upload your video using the Files API
          videoFile, err := client.Files.UploadFromPath(ctx, "my_video.mp4", &genai.UploadFileConfig{
              MIMEType: "video/mp4",
          })
          if err != nil {
              log.Fatal(err)
          }

          // Extend the video using prompt-based extension
          contents := []interactions.Content{
              interactions.NewContent(interactions.VideoContent{
                  URI: genai.Ptr(videoFile.URI),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: "Continue the scene.",
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-omni-1.2-flash"),
                  Input: interactions.NewInteractionsInput(contents),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputVideo != nil && res.Interaction.OutputVideo.Data != nil {
              videoBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputVideo.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("extended.mp4", videoBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$API_KEY" -H "Content-Type: application/json" -d '{
       "model": "gemini-omni-1.2-flash",
       "input": [
         {"type": "video", "uri": "'"$VIDEO_URI"'"},
         {"type": "text", "text": "Continue the scene."}
       ]
      }'
      ```

=== "CLI"

      ```bash
      VIDEO=$(gemini-api files upload my_video.mp4 --wait)
      gemini-api video "Continue the scene." -m gemini-omni-1.2-flash -i "$VIDEO" --out extended.mp4
      ```


[影片](https://storage.googleapis.com/generativeai-downloads/videos/omni_scene_extension_base.mp4)

[影片](https://storage.googleapis.com/generativeai-downloads/videos/omni_scene_extension_extended.mp4)

### 使用參考媒體延伸 {#extending-with-reference-media}

你可以在 `input` 陣列中隨提示詞一併提供參考圖片，將新角色或新元素
引入延伸後的影片：


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client()

      # Upload base video and reference image using the Files API
      video_file = client.files.upload(file="my_video.mp4")
      character_img = client.files.upload(file="character.png")

      # Extend the video while introducing the reference character
      interaction = client.interactions.create(
          model="gemini-omni-1.2-flash",
          input=[
              {"type": "video", "uri": video_file.uri},
              {"type": "image", "uri": character_img.uri},
              {"type": "text", "text": "Extend this video: have the character shown in the reference image enter the scene and wave."}
          ],
      )
      with open("extended_with_character.mp4", "wb") as f:
          f.write(base64.b64decode(interaction.output_video.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      import * as fs from 'fs';
      const ai = new GoogleGenAI({});

      // Upload base video and reference image using the Files API
      let videoFile = await ai.files.upload({ file: 'my_video.mp4' });
      let characterImg = await ai.files.upload({ file: 'character.png' });

      while (videoFile.state === 'PROCESSING' || characterImg.state === 'PROCESSING') {
        await new Promise(r => setTimeout(r, 10000));
        videoFile = await ai.files.get({ name: videoFile.name || '' });
        characterImg = await ai.files.get({ name: characterImg.name || '' });
      }

      // Extend the video while introducing the reference character
      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: [
          { type: 'video', uri: videoFile.uri },
          { type: 'image', uri: characterImg.uri },
          { type: 'text', text: 'Extend this video: have the character shown in the reference image enter the scene and wave.' }
        ],
      });

      if (interaction.output_video?.data) {
        fs.writeFileSync('extended_with_character.mp4', Buffer.from(interaction.output_video.data, 'base64'));
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
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.VideoContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.File;
      import com.google.genai.types.UploadFileConfig;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      Client client = new Client();

      // Upload base video and reference image using the Files API
      File videoFile =
          client.files.upload(
              "my_video.mp4", UploadFileConfig.builder().mimeType("video/mp4").build());
      File characterImg =
          client.files.upload(
              "character.png", UploadFileConfig.builder().mimeType("image/png").build());

      // Extend the video while introducing the reference character
      Content videoContent = VideoContent.builder().uri(videoFile.uri().get()).build();
      Content imageContent = ImageContent.builder().uri(characterImg.uri().get()).build();
      Content textContent =
          TextContent.builder()
              .text(
                  "Extend this video: have the character shown in the reference image enter the scene and wave.")
              .build();

      List<Content> contents = Arrays.asList(videoContent, imageContent, textContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-omni-1.2-flash"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputVideo().isPresent() && interaction.outputVideo().get().data().isPresent()) {
        byte[] videoBytes = Base64.getDecoder().decode(interaction.outputVideo().get().data().get());
        Files.write(Paths.get("extended_with_character.mp4"), videoBytes);
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

          // Upload base video and reference image using the Files API
          videoFile, err := client.Files.UploadFromPath(ctx, "my_video.mp4", &genai.UploadFileConfig{
              MIMEType: "video/mp4",
          })
          if err != nil {
              log.Fatal(err)
          }
          characterImg, err := client.Files.UploadFromPath(ctx, "character.png", &genai.UploadFileConfig{
              MIMEType: "image/png",
          })
          if err != nil {
              log.Fatal(err)
          }

          // Extend the video while introducing the reference character
          contents := []interactions.Content{
              interactions.NewContent(interactions.VideoContent{
                  URI: genai.Ptr(videoFile.URI),
              }),
              interactions.NewContent(interactions.ImageContent{
                  URI: genai.Ptr(characterImg.URI),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: "Extend this video: have the character shown in the reference image enter the scene and wave.",
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-omni-1.2-flash"),
                  Input: interactions.NewInteractionsInput(contents),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputVideo != nil && res.Interaction.OutputVideo.Data != nil {
              videoBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputVideo.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("extended_with_character.mp4", videoBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$API_KEY" -H "Content-Type: application/json" -d '{
       "model": "gemini-omni-1.2-flash",
       "input": [
         {"type": "video", "uri": "'$VIDEO_URI'"},
         {"type": "image", "uri": "'$CHARACTER_IMG_URI'"},
         {"type": "text", "text": "Extend this video: have the character shown in the reference image enter the scene and wave."}
       ]
      }'
      ```

=== "CLI"

      ```bash
      VIDEO=$(gemini-api files upload my_video.mp4 --wait)
      IMAGE=$(gemini-api files upload character.png --wait)
      gemini-api video "Extend this video: have the character shown in the reference image enter the scene and wave." \
        -m gemini-omni-1.2-flash \
        -i "$VIDEO" \
        -i "$IMAGE" \
        --out extended_with_character.mp4
      ```


[影片](https://storage.googleapis.com/generativeai-downloads/videos/omni_traveler_extension.mp4)


!!! note " "

      務必先嘗試不加 `task` 的自然語言提示詞，因為設定 `task` 會對模型加上嚴格限制。只有在光靠提示詞無法觸發延伸模式時，才設定 `"task": "extend"`（於 `video_config` 中）作為備援手段。


### 延伸的限制與準則 {#extension-constraints}

延伸影片時，請留意以下規則與限制：

*   **延伸與總長度限制**：你可以將上傳或模型生成的影片（包括 15 秒
    片段）每回合延伸 3 到 10 秒（預設 10 秒），影片
    總長最長 30 秒。
*   **10 秒回顧視窗**：延伸影片時，模型會以輸入影片的最後 10 秒作為
    上下文，同時保留較早的影格。若某個角色或視覺元素只在最後 10 秒
    之前出現，請在提示詞中再次
    提及，或將其作為參考圖片傳入。
*   **上傳影片中的口語對白**：目前無法延伸有人正在說話的上傳影片來
    新增對白（若角色保持沉默，或提示詞未新增對白，
    則可支援）。
*   **多回合語音延伸**：透過多回合（`previous_interaction_id`）延伸
    先前生成的影片時，支援生成口語對白或語音。
*   **僅限片段結尾**：延伸僅限於在影片結尾附加內容，無法在開頭加入
    內容或延伸片段中段。
*   **地區可用性**：目前，歐洲經濟區（EEA）、瑞士與英國的使用者尚無法
    延伸上傳的影片（在所有可用地區皆可延伸模型
    生成的影片）。

## 最佳實務 {#best-practices}

*   **大型影片使用 URI 傳遞**：對於大於 4MB 的影片（可用時為 >720p），
    請使用 `delivery="uri"`（於 `response_format` 中），以避開
    酬載大小限制。
*   **最佳化效能**：設定 `background=false`、`store=false` 與
    `stream=false`，可獲得更快、同步的單次生成。請注意，設定 `store=false`
    表示生成的影片無法在後續回合中以
    `previous_interaction_id` 編輯。
*   **提示詞精確度**：詳情請見
    [提示詞指南](/docs/omni/#prompt-guide)一節。

## 限制 {#limitations}

*   起始與結束影格插值（提供兩張圖片作為起始與結束影格）支援 3 到 10 秒
    的影片。同時提供兩個影格並將長度設為超過 10 秒，會傳回
    無效引數錯誤。
*   在歐洲經濟區、瑞士與英國，不支援上傳及編輯含有未成年人的圖片。
*   不支援上傳及編輯含有某些可辨識人物的圖片。
*   目前，歐洲經濟區（EEA）、瑞士與英國的使用者尚無法編輯或延伸上傳的影片（編輯或延伸模型生成的影片則可支援）。
*   供編輯的上傳與模型生成輸入影片，長度須為 15 秒或更短。影片延伸會使用
    輸入影片的最後 10 秒，每回合可將上傳或模型生成的影片延伸 3 到 10 秒，
    影片總長最長
    30 秒。
*   影片延伸僅限於在影片結尾附加內容，不支援在開頭加入內容或延伸片段中段。
*   你無法延伸有人正在說話的上傳影片來新增對白（角色可以保持沉默，或可使用多回合的 `previous_interaction_id` 延伸）。
*   不支援語音編輯。
*   目前版本的 API 不支援上傳音訊輸入或音訊參考素材。
*   參考影片最適合用於視覺樣貌（參考影片中的任何音訊都會被忽略），且僅
    支援生成新影片時使用，不支援編輯或延伸既有影片。參考圖片則支援新影片
    生成、影片編輯，以及以提示詞為基礎的影片
    延伸。
*   11 到 15 秒的影片支援 1 部參考影片（最長 3 秒），3 到 10 秒的影片則
    支援最多 3 部參考影片（每部最長 3 秒）。所有影片長度皆支援最多 6 張
    參考圖片，適用於
    所有影片長度。
*   不支援參照多部影片或跨多部影片推理。嘗試多影片提示可能導致模型效能下降或輸出異常。
*   不支援預配輸送量。
*   不支援系統指令、temperature、`top_p`、停止序列與負面提示詞（你可以把負面要求寫進一般提示詞中，例如 "Do not do X"）。
*   不支援使用 YouTube 影片作為媒體來源。

## 技術細節 {#tech-details}

*   所有生成的影片都包含 SynthID 浮水印，觀眾看不見，但可透過程式偵測以驗證來源。
*   影片生成時間會依長度、解析度與目前的 API 負載而有所不同。長度越長、解析度越高的影片，生成所需時間越久。
*   Omni 會對輸入提示詞與生成的影片套用內容安全篩選器（因地區而異）。違反使用政策的提示詞會被封鎖。
*   英文（EN）受到完整支援，但其他語言尚未經過評估，因此可能可用，但結果可能有所差異。

## Gemini Omni Flash 提示詞指南 {#prompt-guide}

本節提供如何有效提示 Gemini Omni Flash 的技巧與範例。

### 單一場景 {#single-scene}

Omni Flash 預設會嘗試以數個不同鏡頭構成影片，並依據提示詞編織出
有趣的敘事。

若需要輸出影片只包含單一場景，你必須在提示詞中明示：

*   以單一不中斷的場景呈現
*   以單一連續鏡頭拍攝
*   不要切換場景

例如：

```none
Continuous, unbroken handheld shot of a fluffy tabby cat sitting on a sunny windowsill, looking out into a leafy garden. The cat's tail twitches slowly, and its ears rotate slightly toward ambient noises. Sunbeams illuminate dust motes in the air. Sound design: Gentle breeze, distant bird chirps. No dialogue.
```

### 移除不需要的元素 {#remove-unwanted-elements}

若生成的影片含有你不想要的內容，加入簡單的負面提示詞即可避免：

*   無對白
*   無多餘修飾
*   無額外音效

### 編輯用提示詞 {#prompts-for-editing}

影片編輯以簡單的提示詞效果最佳。過於詳盡的提示詞可能導致非預期的變更。

以下是更多簡單編輯提示詞的範例：

*   把這部影片變成動畫風格
*   給這個人戴上一頂時尚的帽子
*   讓光線更具戲劇性
*   把招牌上的文字改成 "Omni Flash"

編輯影片的特定面向時，加入 `"Keep everything else the same"`，以維持視覺一致性。

以下範例示範如何運用這項技巧：

*   **避免**： `In the video of the man sitting on the sofa, please add a small
    black cat that runs from the right side of the screen, jumps onto his lap,
    and then he starts to stroke its head while looking down.`
    *   **簡化**： `Add a cat that jumps onto his lap, he begins to pet it.
        Keep everything else the same.`

*   **避免**： `Please remove the cell phone that the person is holding in
    their hand and fill in the background so it looks like they are just holding
    their hand empty.`
    *   **簡化**： `Make the phone invisible. Keep everything else the
        same.`


### 音訊提示詞 {#prompting-audio}

模型預設會嘗試為影片生成合適的音軌，但這未必符合你的需求。
你可以用提示詞描述想要的音訊類型。若希望影片中有音樂，
這一點尤其
重要：

*   加入平靜的背景音樂
*   影片帶有高能量的 techno 節拍
*   背景音訊是一段音質單薄的收音機廣播，正播放著一首歌

### 事件時間點 {#timing-events}

你可以提示事件在影片中的特定時間發生，無需精確語法，使用自然語言
即可。這在自行安排場景切換、節奏或快節奏連續鏡頭時特別
實用。
範例如下：

*   3 秒後，一名女子進入場景。
*   在 5 秒時，背景音訊中的副歌開始。
*   每 2 秒切換到一個新影格。
*   以快節奏連續鏡頭，每半秒（24fps 下為 12 個影格）將場景切換到新地點。

你也可以使用時間碼語法：

```none
[0-5s] A person is walking down a quiet street
[5-10s] They stop and turn around toward a glowing doorway
[10-15s] They start running into the portal
```

### 後設提示 {#meta-prompting}

你可以要求 Gemini Omni Flash 留意影片生成的整體
品質或原則：

*   注重微小細節、表情與時機，營造非常豐富、細膩卻完全
    自然的場景。
*   極其詳盡地描述角色與環境。對角色套用服裝設計原則。非常具體地
    描述場景中的人物、物品與
    物件。
*   在背景元素中加入大量恰當的細節，讓場景感覺
    真實自然。
*   製作一段快節奏影片，每 1 秒展示一種不同的稀有 `[thing]`，配上輕快的
    音樂，並以文字標示該事物。

### 影片中的文字 {#text-in-videos}

你可以透過提示詞在影片中加入文字，Gemini Omni 會以正確且可讀的
方式呈現。若影片中會自然出現文字，即使只在背景元素中，先定義其
內容會有所
幫助。

*   畫面一次只出現一個單字："did, you, know, that, Omni, can, do,
    awesome, text?" 每個單字出現 1 秒，並採用不同的動畫風格。
    無對白。
*   有一塊街道招牌寫著："This is an AI generation by Omni"，有一間
    店面寫著："All you need AI"，還有一輛車的車牌
    寫著："OMNI1.2"

### 延伸影片的提示詞 {#prompts-extending-video}

使用 Gemini Omni 1.2 Flash，你可以用 `"Extend this video"` 或 `"The scene continues"` 之類的提示詞延伸影片。每回合可延伸 3 到 10 秒（預設 10 秒），總長最長 30 秒。

Omni 會以原始影片的最後 10 秒作為上下文，生成在影片、動作、角色與音訊上都連貫的延伸內容。輸入影片的最後幾個影格會經過編輯，讓轉換無縫銜接。

延伸時，本指南的所有 Omni 提示技巧同樣適用：

*   描述延伸場景中的音訊，尤其是需要變化時：`"The music continues into the chorus"`
*   描述場景是接續下去，還是切換到新場景（角色可能相同）：`"Show the same characters in the next scene"`
*   加入參考圖片，讓輸出保持一致或引入新角色：`"The person shown in the reference image enters the scene"`
*   若使用時間戳記或時間碼語法，0s 指的是影片延伸部分的開頭。若延伸一部 10 秒的影片，此提示詞中的場景切換會發生在 12 秒後：`"After 2s cut to a new scene with the same characters"`

## 後續步驟 {#what-s-next}

*   在 [Omni Quickstart Colab](https://colab.sandbox.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_Omni.ipynb) 中動手實驗，開始使用 Gemini Omni Flash。
*   透過我們的[提示詞設計入門](/docs/prompting-strategies/)，學習如何寫出更好的提示詞。

