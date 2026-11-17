# 使用 Lyria 3.5 生成音樂

Lyria 3.5 是 Google 的音樂生成模型系列，可透過 Gemini API 使用。透過 Lyria 3.5，
你可以從文字提示詞或圖片生成高品質的 44.1 kHz 立體聲音訊。這些模型能呈現結構
上的一致性，包括人聲、帶時間點的歌詞，以及完整的器樂編曲。

Lyria 系列包含以下模型：

| 模型 | 模型 ID | 最適合 | 時長 | 輸出 |
| --- | --- | --- | --- | --- |
| **Lyria 3 Clip** | `lyria-3-clip-preview` | 短片段、循環、預覽 | 30 秒 | MP3 |
| **Lyria 3.5** | `lyria-3.5` | 包含主歌、副歌與橋段的完整歌曲 | 數分鐘（可透過提示詞控制） | MP3 |

這兩個模型都能透過新的 [Interactions
API](/docs/interactions-overview/) 使用，支援多模態輸入（文字與
圖片），並產生 **44.1 kHz 高傳真立體聲**音訊。


!!! note " "

      想找即時串流音樂生成嗎？請參閱[使用 Lyria RealTime
      即時生成音樂](/docs/realtime-music-generation/)。


## 生成音樂片段 {#generate-music}

Lyria 3 Clip 模型每次都會生成 **30 秒**的片段。若要生成
片段，請以文字提示詞呼叫 `interactions.create` 方法。回應中除了音訊之外，
還會在 `steps` 結構中一併包含生成的歌詞與歌曲結構。


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="lyria-3-clip-preview",
          input="A short instrumental acoustic guitar piece.",
      )

      generated_audio = interaction.output_audio
      if generated_audio:
          with open("music.mp3", "wb") as f:
              f.write(base64.b64decode(generated_audio.data))

      lyrics = interaction.output_text
      if lyrics:
          print(f"Lyrics:\n{lyrics}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      import * as fs from 'fs';

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
          model: 'lyria-3-clip-preview',
          input: 'A short instrumental acoustic guitar piece.',
      });

      const generatedAudio = interaction.output_audio;
      if (generatedAudio) {
        if (generatedAudio?.data) {
          fs.writeFileSync('music.mp3', Buffer.from(generatedAudio.data, 'base64'));
        }
      }

      const lyrics = interaction.output_text;
      if (lyrics) {
        console.log(`Lyrics:\n${lyrics}`);
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
              .model(Model.of("lyria-3-clip-preview"))
              .input(InteractionsInput.of("A short instrumental acoustic guitar piece."))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputAudio().isPresent() && interaction.outputAudio().get().data().isPresent()) {
        byte[] audioBytes = Base64.getDecoder().decode(interaction.outputAudio().get().data().get());
        Files.write(Paths.get("music.mp3"), audioBytes);
      }

      interaction.outputText().ifPresent(lyrics -> System.out.println("Lyrics:\n" + lyrics));
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
                  Model: interactions.Model("lyria-3-clip-preview"),
                  Input: interactions.NewInteractionsInput("A short instrumental acoustic guitar piece."),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputAudio != nil && res.Interaction.OutputAudio.Data != nil {
              audioBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputAudio.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("music.mp3", audioBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }

          if res.Interaction.OutputText != nil {
              fmt.Printf("Lyrics:\n%s\n", *res.Interaction.OutputText)
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "Api-Revision: 2026-05-20" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "model": "lyria-3-clip-preview",
          "input": "A short instrumental acoustic guitar piece."
      }'
      ```

=== "CLI"

      ```bash
      gemini-api music "A short instrumental acoustic guitar piece." \
        -m lyria-3-clip-preview \
        --out music.mp3
      ```


你可以使用 `interaction.output_audio`
屬性取得生成的音樂資料，該屬性會傳回最後生成的音訊區塊。你也可以使用
`interaction.output_text` 屬性取得歌曲的歌詞與結構。


!!! note " "

      對於複雜、交錯的多模態回應（例如同時包含原始結構拆解與音訊區塊的音樂），
      便利屬性可能無法涵蓋所有部分。你必須改為手動逐一處理各個步驟，範例請參閱
      [交錯的歌詞與音樂](/docs/music-generation/#interleaved-output)。


## 生成完整歌曲 {#full-song}

使用 `lyria-3.5` 模型即可生成長達
數分鐘的完整歌曲。Pro 模型理解音樂結構，能創作出主歌、副歌與橋段分明的
作品。你可以在提示詞中指定時長來影響歌曲長度（例如 "create a 2-minute song"），
也可以使用[時間戳記](/docs/music-generation/#timing)來定義結構。


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="lyria-3.5",
          input="An epic cinematic orchestral piece about a journey home. Starts with a solo piano intro, builds through sweeping strings, and climaxes with a massive wall of sound.",
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          model: 'lyria-3.5',
          input: 'A beautiful piano melody.',
      });
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
              .model(Model.of("lyria-3.5"))
              .input(
                  InteractionsInput.of(
                      "An epic cinematic orchestral piece about a journey home. Starts with a solo piano intro, builds through sweeping strings, and climaxes with a massive wall of sound."))
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("lyria-3.5"),
                  Input: interactions.NewInteractionsInput(
                      "An epic cinematic orchestral piece about a journey home. Starts with a solo piano intro, builds through sweeping strings, and climaxes with a massive wall of sound.",
                  ),
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
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
      -H "Content-Type: application/json" \
      -H "Api-Revision: 2026-05-20" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -d '{
          "model": "lyria-3.5",
          "input": "A beautiful piano melody."
      }'
      ```

=== "CLI"

      ```bash
      gemini-api music "An epic cinematic orchestral piece about a journey home. Starts with a solo piano intro, builds through sweeping strings, and climaxes with a massive wall of sound." \
        -m lyria-3.5 \
        --out song.mp3
      ```


## 選擇輸出格式 {#output-format}

Lyria 3.5 模型預設以 **MP3** 格式生成音訊。對於 Lyria
3.5，你也可以設定 `response_format`，
要求以 **WAV** 格式輸出。


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="lyria-3.5",
          input="A beautiful piano melody.",
          response_format={"type": "audio"},
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          model: 'lyria-3.5',
          input: 'A beautiful piano melody.',
          response_format: {
              type: 'audio',
          },
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.AudioResponseFormat;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("lyria-3.5"))
              .input(InteractionsInput.of("A beautiful piano melody."))
              .responseFormat(
                  CreateModelInteractionResponseFormat.of(
                      ResponseFormat.of(AudioResponseFormat.builder().build())))
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("lyria-3.5"),
                  Input: interactions.NewInteractionsInput("A beautiful piano melody."),
                  ResponseFormat: genai.Ptr(interactions.NewCreateModelInteractionResponseFormat(
                      interactions.NewResponseFormat(interactions.AudioResponseFormat{}),
                  )),
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
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "lyria-3.5",
          "input": "A beautiful piano melody.",
          "response_format": {
              "type": "audio"
          }
        }'
      ```

=== "CLI"

      ```bash
      gemini-api music "A beautiful piano melody." \
        -m lyria-3.5 \
        --body '{"response_format":{"mime_type":"audio/wav"}}' \
        --out output.wav
      ```


## 解析回應 {#parse-response}

Lyria 3.5 的回應在 `steps`
結構中包含多個內容區塊。Interactions 會傳回一連串步驟，其中 `model_output` 步驟
包含生成的內容。文字內容區塊包含生成的歌詞，
或以 JSON 描述的歌曲結構。類型為 `audio` 的內容區塊
則包含以 base64 編碼的音訊資料。


=== "Python"

      ```python
      lyrics = []
      audio_data = None

      generated_audio = interaction.output_audio
      if generated_audio:
          with open("output.mp3", "wb") as f:
              f.write(base64.b64decode(generated_audio.data))

      lyrics = interaction.output_text
      if lyrics:
          print(f"Lyrics:\n{lyrics}")
      ```

=== "JavaScript"

      ```javascript
      const lyrics = [];
      let audioData = null;

      const generatedAudio = interaction.output_audio;
      if (generatedAudio) {
          fs.writeFileSync("output.mp3", Buffer.from(generatedAudio.data, 'base64'));
      }

      const lyrics = interaction.output_text;
      if (lyrics) {
          console.log("Lyrics:\n" + lyrics);
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
              .model(Model.of("lyria-3.5"))
              .input(InteractionsInput.of("A song about a starry night."))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.outputAudio().isPresent() && interaction.outputAudio().get().data().isPresent()) {
        byte[] audioBytes = Base64.getDecoder().decode(interaction.outputAudio().get().data().get());
        Files.write(Paths.get("output.mp3"), audioBytes);
      }

      if (interaction.outputText().isPresent()) {
        System.out.println("Lyrics:\n" + interaction.outputText().get());
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
                  Model: interactions.Model("lyria-3.5"),
                  Input: interactions.NewInteractionsInput("A song about a starry night."),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.OutputAudio != nil && res.Interaction.OutputAudio.Data != nil {
              audioBytes, err := base64.StdEncoding.DecodeString(*res.Interaction.OutputAudio.Data)
              if err != nil {
                  log.Fatal(err)
              }
              if err := os.WriteFile("output.mp3", audioBytes, 0644); err != nil {
                  log.Fatal(err)
              }
          }

          if res.Interaction.OutputText != nil {
              fmt.Printf("Lyrics:\n%s\n", *res.Interaction.OutputText)
          }
      }
      ```

=== "REST"

      ```bash
      curl ... | jq -r '.steps[] | select(.type=="model_output") | .content[] | select(.type=="audio") | .data' | base64 -d > output.mp3
      ```


#### 交錯的歌詞與音樂 {#interleaved-output}

由於 Lyria 3.5 的輸出較為複雜，生成的歌詞（文字）與歌曲本身（音訊）分別
位於不同的步驟與區塊中，便利屬性提供了一種快速且推薦的捷徑。

不過，若你想以程式方式完整掌控伺服器傳回的原始步驟時間軸
（例如在收到各個內容區塊時逐一記錄），可以改為手動逐一處理 `steps`：


=== "Python"

      ```python
      lyrics = []
      audio_data = None

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "audio":
                      audio_data = base64.b64decode(content_block.data)
                  elif content_block.type == "text":
                      lyrics.append(content_block.text)

      if lyrics:
          print("Lyrics:\n" + "\n".join(lyrics))

      if audio_data:
          with open("output.mp3", "wb") as f:
              f.write(audio_data)
      ```

=== "JavaScript"

      ```javascript
      const lyrics = [];
      let audioData = null;

      for (const step of interaction.steps) {
          if (step.type === 'model_output') {
              for (const contentBlock of step.content || []) {
                  if (contentBlock.type === 'audio') {
                      audioData = Buffer.from(contentBlock.data, 'base64');
                  } else if (contentBlock.type === 'text') {
                      lyrics.push(contentBlock.text);
                  }
              }
          }
      }

      if (lyrics.length) {
          console.log("Lyrics:\n" + lyrics.join("\n"));
      }

      if (audioData) {
          fs.writeFileSync("output.mp3", audioData);
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.AudioContent;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.ArrayList;
      import java.util.Base64;
      import java.util.List;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("lyria-3.5"))
              .input(InteractionsInput.of("A song about a starry night."))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      List<String> lyrics = new ArrayList<>();
      byte[] audioData = null;

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof AudioContent) {
                  AudioContent audioBlock = (AudioContent) contentBlock;
                  if (audioBlock.data().isPresent()) {
                    audioData = Base64.getDecoder().decode(audioBlock.data().get());
                  }
                } else if (contentBlock instanceof TextContent) {
                  TextContent textBlock = (TextContent) contentBlock;
                  textBlock.text().ifPresent(lyrics::add);
                }
              }
            }
          }
        }
      }

      if (!lyrics.isEmpty()) {
        System.out.println("Lyrics:\n" + String.join("\n", lyrics));
      }

      if (audioData != null) {
        Files.write(Paths.get("output.mp3"), audioData);
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("lyria-3.5"),
                  Input: interactions.NewInteractionsInput("A song about a starry night."),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          var lyrics []string
          var audioData []byte

          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.AudioContent != nil && contentBlock.AudioContent.Data != nil {
                          decoded, err := base64.StdEncoding.DecodeString(*contentBlock.AudioContent.Data)
                          if err != nil {
                              log.Fatal(err)
                          }
                          audioData = decoded
                      } else if contentBlock.TextContent != nil {
                          lyrics = append(lyrics, contentBlock.TextContent.Text)
                      }
                  }
              }
          }

          if len(lyrics) > 0 {
              fmt.Printf("Lyrics:\n%s\n", strings.Join(lyrics, "\n"))
          }

          if audioData != nil {
              if err := os.WriteFile("output.mp3", audioData, 0644); err != nil {
                  log.Fatal(err)
              }
          }
      }
      ```


## 從圖片生成音樂 {#image-to-music}

Lyria 3.5 支援多模態輸入：你可以在 `input` 清單中連同文字提示詞一起提供最多 **10 張圖片**，
模型會從視覺內容汲取靈感來作曲。


=== "Python"

      ```python
      import base64

      with open("desert_sunset.jpg", "rb") as f:
          image_bytes = f.read()
          image_b64 = base64.b64encode(image_bytes).decode("utf-8")

      response = client.interactions.create(
          model="lyria-3.5",
          input=[
              {
                  "type": "text",
                  "text": "An atmospheric ambient track inspired by the mood and colors in this image.",
              },
              {
                  "type": "image",
                  "mime_type": "image/jpeg",
                  "data": image_b64,
              },
          ],
      )
      ```

=== "JavaScript"

      ```javascript
      import * as fs from "fs";

      const imageBytes = fs.readFileSync("desert_sunset.jpg").toString("base64");

      const interaction = await client.interactions.create({
          model: "lyria-3.5",
          input: [
              {
                  type: "text",
                  text: "An atmospheric ambient track inspired by the mood and colors in this image.",
              },
              {
                  type: "image",
                  mime_type: "image/jpeg",
                  data: imageBytes,
              },
          ],
      });
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

      byte[] imageBytes = Files.readAllBytes(Paths.get("desert_sunset.jpg"));
      String imageB64 = Base64.getEncoder().encodeToString(imageBytes);

      Content textContent =
          TextContent.builder()
              .text("An atmospheric ambient track inspired by the mood and colors in this image.")
              .build();
      Content imageContent =
          ImageContent.builder()
              .mimeType(ImageContentMimeType.IMAGE_JPEG)
              .data(imageB64)
              .build();

      List<Content> contents = Arrays.asList(textContent, imageContent);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("lyria-3.5"))
              .input(InteractionsInput.ofContent(contents))
              .build();

      Interaction response =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
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

          imageBytes, err := os.ReadFile("desert_sunset.jpg")
          if err != nil {
              log.Fatal(err)
          }
          imageB64 := base64.StdEncoding.EncodeToString(imageBytes)

          contents := []interactions.Content{
              interactions.NewContent(interactions.TextContent{
                  Text: "An atmospheric ambient track inspired by the mood and colors in this image.",
              }),
              interactions.NewContent(interactions.ImageContent{
                  MimeType: interactions.ImageContentMimeTypeImageJpeg.ToPointer(),
                  Data:     genai.Ptr(imageB64),
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("lyria-3.5"),
                  Input: interactions.NewInteractionsInput(contents),
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
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "lyria-3.5",
          "input": [
            {"type": "text", "text": "An atmospheric ambient track inspired by the mood and colors in this image."},
            {"type": "image", "mime_type": "image/jpeg", "data": "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="}
          ]
        }'
      ```


## 提供自訂歌詞 {#custom-lyrics}

你可以自己撰寫歌詞並放入提示詞中。使用 `[Verse]`、`[Chorus]`、`[Bridge]` 等段落標籤，
幫助模型理解歌曲結構：


=== "Python"

      ```python
      prompt = """
      Create a dreamy indie pop song with the following lyrics:

      [Verse 1]
      Walking through the neon glow,
      city lights reflect below,
      every shadow tells a story,
      every corner, fading glory.

      [Chorus]
      We are the echoes in the night,
      burning brighter than the light,
      hold on tight, don't let me go,
      we are the echoes down below.

      [Verse 2]
      Footsteps lost on empty streets,
      rhythms sync to heartbeats,
      whispers carried by the breeze,
      dancing through the autumn leaves.
      """

      interaction = client.interactions.create(
          model="lyria-3.5",
          input=prompt,
      )
      ```

=== "JavaScript"

      ```javascript
      const prompt = `
      Create a dreamy indie pop song with the following lyrics:

      [Verse 1]
      Walking through the neon glow,
      city lights reflect below,
      every shadow tells a story,
      every corner, fading glory.

      [Chorus]
      We are the echoes in the night,
      burning brighter than the light,
      hold on tight, don't let me go,
      we are the echoes down below.

      [Verse 2]
      Footsteps lost on empty streets,
      rhythms sync to heartbeats,
      whispers carried by the breeze,
      dancing through the autumn leaves.
      `;

      const interaction = await client.interactions.create({
          model: 'lyria-3.5',
          input: prompt,
      });
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

      String prompt =
          "Create a dreamy indie pop song with the following lyrics:\n\n"
              + "[Verse 1]\n"
              + "Walking through the neon glow,\n"
              + "city lights reflect below,\n"
              + "every shadow tells a story,\n"
              + "every corner, fading glory.\n\n"
              + "[Chorus]\n"
              + "We are the echoes in the night,\n"
              + "burning brighter than the light,\n"
              + "hold on tight, don't let me go,\n"
              + "we are the echoes down below.\n\n"
              + "[Verse 2]\n"
              + "Footsteps lost on empty streets,\n"
              + "rhythms sync to heartbeats,\n"
              + "whispers carried by the breeze,\n"
              + "dancing through the autumn leaves.";

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("lyria-3.5"))
              .input(InteractionsInput.of(prompt))
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

          prompt := "Create a dreamy indie pop song with the following lyrics:\n\n" +
              "[Verse 1]\n" +
              "Walking through the neon glow,\n" +
              "city lights reflect below,\n" +
              "every shadow tells a story,\n" +
              "every corner, fading glory.\n\n" +
              "[Chorus]\n" +
              "We are the echoes in the night,\n" +
              "burning brighter than the light,\n" +
              "hold on tight, don't let me go,\n" +
              "we are the echoes down below.\n\n" +
              "[Verse 2]\n" +
              "Footsteps lost on empty streets,\n" +
              "rhythms sync to heartbeats,\n" +
              "whispers carried by the breeze,\n" +
              "dancing through the autumn leaves."

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("lyria-3.5"),
                  Input: interactions.NewInteractionsInput(prompt),
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
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "lyria-3.5",
          "input": "Create a dreamy indie pop song with the following lyrics: ..."
        }'
      ```

=== "CLI"

      ```bash
      cat > lyrics.txt <<'EOF'
      Create a dreamy indie pop song with the following lyrics:
      [Verse 1]
      Walking through the neon glow,
      city lights reflect below,
      every shadow tells a story,
      every corner, fading glory.
      [Chorus]
      We are the echoes in the night,
      burning brighter than the light,
      hold on tight, don't let me go,
      we are the echoes down below.
      [Verse 2]
      Footsteps lost on empty streets,
      rhythms sync to heartbeats,
      whispers carried by the breeze,
      dancing through the autumn leaves.
      EOF
      gemini-api music -f lyrics.txt --out song.mp3
      ```


## 控制時間點與結構 {#timing}

你可以使用時間戳記，精確指定歌曲在特定時刻應該發生什麼。這有助於控制
樂器何時加入、歌詞何時唱出，以及歌曲如何推進：


=== "Python"

      ```python
      prompt = """
      [0:00 - 0:10] Intro: Begin with a soft lo-fi beat and muffled
                    vinyl crackle.
      [0:10 - 0:30] Verse 1: Add a warm Fender Rhodes piano melody
                    and gentle vocals singing about a rainy morning.
      [0:30 - 0:50] Chorus: Full band with upbeat drums and soaring
                    synth leads. The lyrics are hopeful and uplifting.
      [0:50 - 1:00] Outro: Fade out with the piano melody alone.
      """

      interaction = client.interactions.create(
          model="lyria-3.5",
          input=prompt,
      )
      ```

=== "JavaScript"

      ```javascript
      const prompt = `
      [0:00 - 0:10] Intro: Begin with a soft lo-fi beat and muffled
                    vinyl crackle.
      [0:10 - 0:30] Verse 1: Add a warm Fender Rhodes piano melody
                    and gentle vocals singing about a rainy morning.
      [0:30 - 0:50] Chorus: Full band with upbeat drums and soaring
                    synth leads. The lyrics are hopeful and uplifting.
      [0:50 - 1:00] Outro: Fade out with the piano melody alone.
      `;

      const interaction = await client.interactions.create({
          model: 'lyria-3.5',
          input: prompt,
      });
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

      String prompt =
          "[0:00 - 0:10] Intro: Begin with a soft lo-fi beat and muffled vinyl crackle.\n"
              + "[0:10 - 0:30] Verse 1: Add a warm Fender Rhodes piano melody and gentle vocals singing about a rainy morning.\n"
              + "[0:30 - 0:50] Chorus: Full band with upbeat drums and soaring synth leads. The lyrics are hopeful and uplifting.\n"
              + "[0:50 - 1:00] Outro: Fade out with the piano melody alone.";

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("lyria-3.5"))
              .input(InteractionsInput.of(prompt))
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

          prompt := "[0:00 - 0:10] Intro: Begin with a soft lo-fi beat and muffled vinyl crackle.\n" +
              "[0:10 - 0:30] Verse 1: Add a warm Fender Rhodes piano melody and gentle vocals singing about a rainy morning.\n" +
              "[0:30 - 0:50] Chorus: Full band with upbeat drums and soaring synth leads. The lyrics are hopeful and uplifting.\n" +
              "[0:50 - 1:00] Outro: Fade out with the piano melody alone."

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("lyria-3.5"),
                  Input: interactions.NewInteractionsInput(prompt),
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
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "lyria-3.5",
          "input": "[0:00 - 0:10] Intro: ..."
        }'
      ```


## 生成器樂曲目 {#instrumental}

對於背景音樂、遊戲配樂，或任何不需要人聲的使用情境，
你可以提示模型只生成器樂曲目：


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="lyria-3-clip-preview",
          input="A bright chiptune melody in C Major, retro 8-bit video game style. Instrumental only, no vocals.",
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          model: 'lyria-3-clip-preview',
          input: 'A bright chiptune melody in C Major, retro 8-bit video game style. Instrumental only, no vocals.',
      });
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
              .model(Model.of("lyria-3-clip-preview"))
              .input(
                  InteractionsInput.of(
                      "A bright chiptune melody in C Major, retro 8-bit video game style. Instrumental only, no vocals."))
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("lyria-3-clip-preview"),
                  Input: interactions.NewInteractionsInput(
                      "A bright chiptune melody in C Major, retro 8-bit video game style. Instrumental only, no vocals.",
                  ),
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
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "lyria-3-clip-preview",
          "input": "A bright chiptune melody in C Major, retro 8-bit video game style. Instrumental only, no vocals."
        }'
      ```


## 以不同語言生成音樂 {#languages}

Lyria 3.5 會以你提示詞所用的語言生成歌詞。若要生成
法文歌詞的歌曲，請用法文撰寫提示詞。模型會調整其演唱
風格與發音以符合該語言。


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="lyria-3.5",
          input="Crée une chanson pop romantique en français sur un coucher de soleil à Paris. Utilise du piano et de la guitare acoustique.",
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          model: 'lyria-3.5',
          input: 'Crée une chanson pop romantique en français sur un coucher de soleil à Paris. Utilise du piano et de la guitare acoustique.',
      });
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
              .model(Model.of("lyria-3.5"))
              .input(
                  InteractionsInput.of(
                      "Crée une chanson pop romantique en français sur un coucher de soleil à Paris. Utilise du piano et de la guitare acoustique."))
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("lyria-3.5"),
                  Input: interactions.NewInteractionsInput(
                      "Crée une chanson pop romantique en français sur un coucher de soleil à Paris. Utilise du piano et de la guitare acoustique.",
                  ),
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
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "lyria-3.5",
          "input": "Crée une chanson pop romantique en français sur un coucher de soleil à Paris. Utilise du piano et de la guitare acoustique."
        }'
      ```


## 模型智慧 {#intelligence}

Lyria 3.5 會分析你的提示詞，模型會依據你的提示詞推理出音樂
結構（前奏、主歌、副歌、橋段等）。這個過程在音訊生成之前
進行，確保結構的一致性與音樂性。

重要事項：Lyria 3.5 雖然在內部使用提示詞改寫器來解讀
自然語言指令，但**不會**向使用者公開中間的 "thought"
區塊或思考簽名。

## 提示詞指南 {#prompt-guide}

若要了解如何為音樂類型、樂器、歌曲結構、自訂歌詞與演唱風格撰寫有效的提示詞，請參閱 [Lyria 提示詞指南](/docs/lyria-prompt-guide/)。

## 最佳做法 {#best-practices}

*   **先用 Clip 反覆嘗試**：先用速度較快的 `lyria-3-clip-preview` 模型
    實驗提示詞，再決定是否以 `lyria-3.5` 生成完整歌曲。

*   **具體明確**：含糊的提示詞只會產生平庸的結果。提及樂器、
    BPM、調性、氛圍與結構，才能獲得最佳輸出。

*   **語言要一致**：用你希望歌詞採用的語言來撰寫提示詞。

*   **使用段落標籤**：`[Verse]`、`[Chorus]`、`[Bridge]` 標籤能為模型
    提供清晰的結構依循。

*   **將歌詞與指令分開**：提供自訂歌詞時，請將歌詞與
    音樂方向的指令清楚分開。


## 限制 {#limitations}

*   **安全**：所有提示詞都會經過安全篩選器檢查。觸發
    篩選器的提示詞將被封鎖，包括要求特定
    藝人嗓音或生成受版權保護歌詞的提示詞。

*   **浮水印**：所有生成的音訊都包含用於識別的 [SynthID 音訊
    浮水印](https://deepmind.google/technologies/synthid/)。
    這個浮水印人耳無法察覺，不會
    影響聆聽體驗。

*   **多輪編輯**：音樂生成是單輪過程。目前版本的 Lyria 3.5
    不支援透過多個提示詞反覆編輯或修飾生成的片段。

*   **長度**：Clip 模型每次都生成 30 秒的片段。Pro 模型
    生成的歌曲長達數分鐘；確切時長可
    透過提示詞影響。

*   **確定性**：即使使用相同的提示詞，每次呼叫的結果也可能不同。


## 後續步驟 {#next-steps}

*   參閱 [Lyria 提示詞指南](/docs/lyria-prompt-guide/)，深入了解提示策略與關鍵字詞彙，

*   查看 Lyria 3.5 模型的[定價](/docs/pricing/)，

*   透過 Lyria RealTime 嘗試[即時串流音樂生成](/docs/realtime-music-generation/)，

*   使用 [TTS
    模型](/docs/speech-generation/)生成多講者對話，

*   了解如何生成[圖片](/docs/image-generation/)或
    [影片](/docs/video/)，

*   了解 Gemini 如何[理解音訊檔案](/docs/audio/)，

*   使用 [Live
    API](/docs/live-api/) 與 Gemini 即時對話。



