# 瞭解並計算權杖

Gemini 與其他生成式 AI 模型處理輸入與輸出時，所採用的粒度單位稱為*權杖*。

**對 Gemini 模型而言，1 個權杖約等於 4 個字元。
100 個權杖約等於 60 到 80 個英文字。**

## 關於權杖 {#about-tokens}

權杖可以是單一字元，例如 `z`，也可以是完整的單字，例如 `cat`。較長的單字
會被拆成多個權杖。模型所使用的全部權杖集合稱為詞彙表，而將文字拆分
為權杖的過程則稱為*權杖化*。

啟用計費後，[呼叫 Gemini API 的費用](/docs/pricing/)有一部分取決於輸入與
輸出權杖的數量，因此瞭解如何計算權杖數量會很有幫助。

## 計算權杖 {#count-tokens}

Gemini API 的所有輸入與輸出都會經過權杖化處理，包括文字、圖片檔案，
以及其他非文字模態。

你可以透過以下方式計算權杖數量：

* **以請求的輸入內容呼叫 `count_tokens`**：回傳的僅是*輸入內容*的權杖
  總數。在送出輸入之前先呼叫此方法，即可確認請求的大小。

* **使用互動回應中的 `usage`**：會回傳輸入（`total_input_tokens`）、
  輸出（`total_output_tokens`）、思考（`total_thought_tokens`）、快取內容
  （`total_cached_tokens`）、工具使用（`total_tool_use_tokens`）與總計
  （`total_tokens`）的權杖數量。


### 計算文字權杖 {#text-tokens}


=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      from google import genai

      client = genai.Client()
      prompt = "The quick brown fox jumps over the lazy dog."

      # Count tokens before sending
      total_tokens = client.models.count_tokens(
          model="gemini-4-hydrogen",
          contents=prompt
      )
      print("total_tokens:", total_tokens.total_tokens)

      # Get usage from interaction
      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=prompt
      )
      print(interaction.usage)
      ```

=== "JavaScript"

      ```javascript
      // This will only work for SDK newer than 2.0.0
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});
      const prompt = "The quick brown fox jumps over the lazy dog.";

      // Count tokens before sending
      const countResponse = await client.models.countTokens({
          model: "gemini-4-hydrogen",
          contents: prompt,
      });
      console.log(countResponse.totalTokens);

      // Get usage from interaction
      const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: prompt,
      });
      console.log(interaction.usage);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.CountTokensResponse;

      Client client = new Client();
      String prompt = "The quick brown fox jumps over the lazy dog.";

      // Count tokens before sending
      CountTokensResponse countResponse =
          client.models.countTokens("gemini-4-hydrogen", prompt, null);
      System.out.println("total_tokens: " + countResponse.totalTokens().orElse(0));

      // Get usage from interaction
      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of(prompt))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      System.out.println(interaction.usage().orElse(null));
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

          modelInfo, err := client.Models.Get(ctx, "gemini-4-hydrogen", nil)
          if err != nil {
              log.Fatal(err)
          }

          fmt.Printf("Input token limit: %d\n", modelInfo.InputTokenLimit)
          fmt.Printf("Output token limit: %d\n", modelInfo.OutputTokenLimit)
      }
      ```

=== "REST"

      ```shell
      # Specifies the API revision to avoid breaking changes when they become default
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:countTokens" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -H "Api-Revision: 2026-05-20" \
        -d '{"contents": [{"parts": [{"text": "The quick brown fox."}]}]}'
      ```


### 計算多輪對話的權杖 {#multi-turn-tokens}

使用 `previous_interaction_id` 計算整個對話記錄的權杖數量：


=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      # First interaction
      interaction1 = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Hi, my name is Bob"
      )

      # Second interaction continues the conversation
      interaction2 = client.interactions.create(
          model="gemini-4-hydrogen",
          input="What's my name?",
          previous_interaction_id=interaction1.id
      )

      # Usage includes tokens from both turns
      print(f"Input tokens: {interaction2.usage.total_input_tokens}")
      print(f"Output tokens: {interaction2.usage.total_output_tokens}")
      print(f"Total tokens: {interaction2.usage.total_tokens}")
      ```

=== "JavaScript"

      ```javascript
      // This will only work for SDK newer than 2.0.0
      // First interaction
      const interaction1 = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Hi, my name is Bob"
      });

      // Second interaction continues the conversation
      const interaction2 = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: "What's my name?",
          previous_interaction_id: interaction1.id
      });

      console.log(`Input tokens: ${interaction2.usage.total_input_tokens}`);
      console.log(`Output tokens: ${interaction2.usage.total_output_tokens}`);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Usage;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = new Client();

      // First interaction
      CreateModelInteraction params1 =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Hi, my name is Bob"))
              .build();

      Interaction interaction1 =
          client.interactions.create(CreateInteractionRequestBody.of(params1)).interaction().get();

      // Second interaction continues the conversation
      CreateModelInteraction params2 =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("What's my name?"))
              .previousInteractionId(interaction1.id().orElse(""))
              .build();

      Interaction interaction2 =
          client.interactions.create(CreateInteractionRequestBody.of(params2)).interaction().get();

      // Usage includes tokens from both turns
      if (interaction2.usage().isPresent()) {
        Usage usage = interaction2.usage().get();
        System.out.println("Input tokens: " + usage.totalInputTokens().orElse(0));
        System.out.println("Output tokens: " + usage.totalOutputTokens().orElse(0));
        System.out.println("Total tokens: " + usage.totalTokens().orElse(0));
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

          prompt := "The quick brown fox jumps over the lazy dog."

          // Count input tokens before sending
          totalTokens, err := client.Models.CountTokens(ctx, "gemini-4-hydrogen", genai.Text(prompt), nil)
          if err != nil {
              log.Fatal(err)
          }
          fmt.Printf("total_tokens: %d\n", totalTokens.TotalTokens)

          // Create the interaction and inspect the returned usage metadata
          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput(prompt),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          interaction := res.Interaction
          if interaction.OutputText != nil {
              fmt.Println(*interaction.OutputText)
          }
          if interaction.Usage != nil {
              if interaction.Usage.TotalInputTokens != nil {
                  fmt.Printf("Input tokens: %d\n", *interaction.Usage.TotalInputTokens)
              }
              if interaction.Usage.TotalOutputTokens != nil {
                  fmt.Printf("Output tokens: %d\n", *interaction.Usage.TotalOutputTokens)
              }
              if interaction.Usage.TotalThoughtTokens != nil {
                  fmt.Printf("Thought tokens: %d\n", *interaction.Usage.TotalThoughtTokens)
              }
              if interaction.Usage.TotalTokens != nil {
                  fmt.Printf("Total tokens: %d\n", *interaction.Usage.TotalTokens)
              }
          }
      }
      ```


### 計算多模態權杖 {#multimodal-tokens}

Gemini API 的所有輸入都會經過權杖化處理，包括圖片、影片與音訊。
關於權杖化，有幾個重點：

* **圖片**：兩個維度皆不超過 384 像素的圖片，計為 258 個權杖。較大的
  圖片會被切割為 768x768 像素的圖塊，每塊計為 258 個權杖。

* **影片**：每秒 263 個權杖（適用於靜態處理）。代理式處理的權杖用量
  則不固定。詳見[依處理模式計算的影片權杖用量](/docs/tokens/#video)。

* **音訊**：每秒 32 個權杖


#### 圖片權杖 {#images}


=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      uploaded_file = client.files.upload(file="path/to/image.jpg")

      # Count tokens for image + text
      total_tokens = client.models.count_tokens(
          model="gemini-4-hydrogen",
          contents=["Tell me about this image", uploaded_file]
      )
      print(f"Total tokens: {total_tokens}")

      # Generate with image
      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": "Tell me about this image"},
              {"type": "image", "uri": uploaded_file.uri, "mime_type": uploaded_file.mime_type}
          ]
      )
      print(interaction.usage)
      ```

=== "JavaScript"

      ```javascript
      // This will only work for SDK newer than 2.0.0
      const uploadedFile = await client.files.upload({
          file: "path/to/image.jpg",
          config: { mimeType: "image/jpeg" }
      });

      // Count tokens
      const countResponse = await client.models.countTokens({
          model: "gemini-4-hydrogen",
          contents: [
              { text: "Tell me about this image" },
              { fileData: { fileUri: uploadedFile.uri, mimeType: uploadedFile.mimeType } }
          ]
      });
      console.log(countResponse.totalTokens);
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
      import com.google.genai.types.Content;
      import com.google.genai.types.CountTokensResponse;
      import com.google.genai.types.File;
      import com.google.genai.types.Part;
      import com.google.genai.types.UploadFileConfig;
      import java.util.Arrays;

      Client client = new Client();

      File uploadedFile =
          client.files.upload(
              new java.io.File("path/to/image.jpg"),
              UploadFileConfig.builder().mimeType("image/jpeg").build());

      // Count tokens for image + text
      CountTokensResponse countResponse =
          client.models.countTokens(
              "gemini-4-hydrogen",
              Arrays.asList(
                  Content.fromParts(
                      Part.fromText("Tell me about this image"),
                      Part.fromUri(
                          uploadedFile.uri().orElse(""), uploadedFile.mimeType().orElse("image/jpeg")))),
              null);
      System.out.println("Total tokens: " + countResponse.totalTokens().orElse(0));

      // Generate with image
      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(
                  InteractionsInput.ofContent(
                      Arrays.asList(
                          TextContent.builder().text("Tell me about this image").build(),
                          ImageContent.builder()
                              .uri(uploadedFile.uri().orElse(""))
                              .mimeType(
                                  ImageContentMimeType.of(uploadedFile.mimeType().orElse("image/jpeg")))
                              .build())))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      System.out.println(interaction.usage().orElse(null));
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
                  Input:  interactions.NewInteractionsInput("Explain the history of the internet in 3 paragraphs."),
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
              if completed := event.GetDataInteractionCompleted(); completed != nil {
                  usage := completed.Interaction.Usage
                  if usage != nil && usage.TotalTokens != nil {
                      fmt.Printf("\nTotal tokens: %d\n", *usage.TotalTokens)
                  }
              }
          }
          if err := stream.Err(); err != nil {
              log.Fatal(err)
          }
      }
      ```


**內嵌資料範例**：


=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      import base64

      with open('image.jpg', 'rb') as f:
          image_bytes = f.read()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": "Describe this image"},
              {
                  "type": "image",
                  "data": base64.b64encode(image_bytes).decode('utf-8'),
                  "mime_type": "image/jpeg"
              }
          ]
      )
      print(interaction.usage)
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

      byte[] imageBytes = Files.readAllBytes(Paths.get("image.jpg"));
      String base64Image = Base64.getEncoder().encodeToString(imageBytes);

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(
                  InteractionsInput.ofContent(
                      Arrays.asList(
                          TextContent.builder().text("Describe this image").build(),
                          ImageContent.builder()
                              .data(base64Image)
                              .mimeType(ImageContentMimeType.IMAGE_JPEG)
                              .build())))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      System.out.println(interaction.usage().orElse(null));
      ```


#### 影片權杖 {#video}

影片的權杖計算方式取決於處理模式：

| **處理模式** | **取樣的影格** | **每秒權杖數** | **60 秒影片的權杖數** |
| --- | --- | --- | --- |
| **靜態**（預設） | 1 FPS（所有影格） | ~100（預設低解析度）/ ~300（高解析度） | ~6,000（預設）/ ~18,000（高解析度） |
| **代理式** | 動態（依需求） | 不固定（最多可減少 88%） | 通常為 1,500 到 3,000 |

如需瞭解如何設定處理模式，請參閱
[代理式影片理解](/docs/video-understanding/#agentic-video-understanding)。


!!! note " "

      靜態處理的權杖計算以預設取樣率 1 FPS 為準。若你在 GenerateContent API
      中設定了[自訂影格率](/docs/video-understanding/?generate-content=true#custom-frame-rate)，
      權杖用量會依設定的 FPS 等比例調整。


若要查看某個請求的實際權杖用量，請檢查 `interaction.usage`。代理式影片的權杖會分別記錄在以下欄位：

* **初始提示詞**（影片參照 + 使用者提示詞）：`total_input_tokens`
* **導覽思考**：`total_thought_tokens`
* **依需求載入的逐字稿、影格與音訊**：`total_tool_use_tokens`
* **最終回答**：`total_output_tokens`


=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      import time

      video_file = client.files.upload(file="path/to/video.mp4")

      while not video_file.state or video_file.state.name != "ACTIVE":
          print("Processing video...")
          time.sleep(5)
          video_file = client.files.get(name=video_file.name)

      # A 60-second video is approximately 100 * 60 = 6,000 tokens
      total_tokens = client.models.count_tokens(
          model="gemini-4-hydrogen",
          contents=["Summarize this video", video_file]
      )
      print(f"Total tokens: {total_tokens}")

      # Generate with video
      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": "Summarize this video"},
              {"type": "video", "uri": video_file.uri, "mime_type": video_file.mime_type}
          ]
      )
      print(interaction.usage)
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.VideoContent;
      import com.google.genai.gaos.models.interactions.VideoContentMimeType;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.Content;
      import com.google.genai.types.CountTokensResponse;
      import com.google.genai.types.File;
      import com.google.genai.types.FileState;
      import com.google.genai.types.Part;
      import com.google.genai.types.UploadFileConfig;
      import java.util.Arrays;

      Client client = new Client();

      File videoFile =
          client.files.upload(
              new java.io.File("path/to/video.mp4"),
              UploadFileConfig.builder().mimeType("video/mp4").build());

      // Wait for processing
      while (videoFile.state().isPresent()
          && videoFile.state().get().knownEnum() == FileState.Known.PROCESSING) {
        Thread.sleep(5000);
        videoFile = client.files.get(videoFile.name().orElse(""), null);
      }

      // A 60-second video is approximately 100 * 60 = 6,000 tokens
      CountTokensResponse countResponse =
          client.models.countTokens(
              "gemini-4-hydrogen",
              Arrays.asList(
                  Content.fromParts(
                      Part.fromText("Summarize this video"),
                      Part.fromUri(
                          videoFile.uri().orElse(""), videoFile.mimeType().orElse("video/mp4")))),
              null);
      System.out.println("Total tokens: " + countResponse.totalTokens().orElse(0));

      // Generate with video
      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(
                  InteractionsInput.ofContent(
                      Arrays.asList(
                          TextContent.builder().text("Summarize this video").build(),
                          VideoContent.builder()
                              .uri(videoFile.uri().orElse(""))
                              .mimeType(VideoContentMimeType.of(videoFile.mimeType().orElse("video/mp4")))
                              .build())))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      System.out.println(interaction.usage().orElse(null));
      ```


#### 音訊權杖 {#audio}


=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      audio_file = client.files.upload(file="path/to/audio.mp3")

      # A 60-second audio clip is approximately 32 * 60 = 1,920 tokens
      total_tokens = client.models.count_tokens(
          model="gemini-4-hydrogen",
          contents=["Transcribe this audio", audio_file]
      )
      print(f"Total tokens: {total_tokens}")

      # Generate with audio
      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": "Transcribe this audio"},
              {"type": "audio", "uri": audio_file.uri, "mime_type": audio_file.mime_type}
          ]
      )
      print(interaction.usage)
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.AudioContent;
      import com.google.genai.gaos.models.interactions.AudioContentMimeType;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.Content;
      import com.google.genai.types.CountTokensResponse;
      import com.google.genai.types.File;
      import com.google.genai.types.Part;
      import com.google.genai.types.UploadFileConfig;
      import java.util.Arrays;

      Client client = new Client();

      File audioFile =
          client.files.upload(
              new java.io.File("path/to/audio.mp3"),
              UploadFileConfig.builder().mimeType("audio/mp3").build());

      // A 60-second audio clip is approximately 32 * 60 = 1,920 tokens
      CountTokensResponse countResponse =
          client.models.countTokens(
              "gemini-4-hydrogen",
              Arrays.asList(
                  Content.fromParts(
                      Part.fromText("Transcribe this audio"),
                      Part.fromUri(
                          audioFile.uri().orElse(""), audioFile.mimeType().orElse("audio/mp3")))),
              null);
      System.out.println("Total tokens: " + countResponse.totalTokens().orElse(0));

      // Generate with audio
      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(
                  InteractionsInput.ofContent(
                      Arrays.asList(
                          TextContent.builder().text("Transcribe this audio").build(),
                          AudioContent.builder()
                              .uri(audioFile.uri().orElse(""))
                              .mimeType(AudioContentMimeType.of(audioFile.mimeType().orElse("audio/mp3")))
                              .build())))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      System.out.println(interaction.usage().orElse(null));
      ```


### 計算系統指令的權杖 {#system-instructions}

系統指令會計入輸入權杖的一部分：


=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Hello!",
          system_instruction="You are a helpful assistant who speaks like a pirate."
      )

      # system_instruction tokens included in total_input_tokens
      print(f"Input tokens: {interaction.usage.total_input_tokens}")
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
              .input(InteractionsInput.of("Hello!"))
              .systemInstruction("You are a helpful assistant who speaks like a pirate.")
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      // system_instruction tokens included in total_input_tokens
      if (interaction.usage().isPresent()) {
        System.out.println(
            "Input tokens: " + interaction.usage().get().totalInputTokens().orElse(0));
      }
      ```


### 計算工具的權杖 {#tools}

工具（函式、程式碼執行、Google Search）也會列入計算：


=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      tools = [
          {
              "type": "function",
              "name": "get_weather",
              "description": "Get current weather",
              "parameters": {
                  "type": "object",
                  "properties": {
                      "location": {"type": "string"}
                  }
              }
          }
      ]

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="What's the weather in Tokyo?",
          tools=tools
      )

      print(f"Input tokens: {interaction.usage.total_input_tokens}")
      print(f"Tool use tokens: {interaction.usage.total_tool_use_tokens}")
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Function;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.Tool;
      import com.google.genai.gaos.models.interactions.Usage;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> locationProp = new HashMap<>();
      locationProp.put("type", "string");

      Map<String, Object> properties = new HashMap<>();
      properties.put("location", locationProp);

      Map<String, Object> schema = new HashMap<>();
      schema.put("type", "object");
      schema.put("properties", properties);

      Tool weatherTool =
          Function.builder()
                  .name("get_weather")
                  .description("Get current weather")
                  .parameters(schema)
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("What's the weather in Tokyo?"))
              .tools(Arrays.asList(weatherTool))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.usage().isPresent()) {
        Usage usage = interaction.usage().get();
        System.out.println("Input tokens: " + usage.totalInputTokens().orElse(0));
        System.out.println("Tool use tokens: " + usage.totalToolUseTokens().orElse(0));
      }
      ```


## 上下文視窗 {#context-window}

每個 Gemini 模型都有可處理的權杖數量上限。

* **Gemini 4 模型（`gemini-4-carbon`、`gemini-4-argon`、`gemini-4-neon` 與 `gemini-4-hydrogen`）**：輸入、思考與輸出權杖共用單一 100 萬權杖的上下文視窗（`1,048,576` 個權杖）。同步回應（`background=False`，無論串流或非串流）預設的輸出權杖上限為 `65,536` 個，你也可以使用 [long decode](/docs/long-decode/) 生成最多 `1,048,576` 個權杖。若輸入權杖加上 `max_output_tokens` 超過 1,048,576 個權杖，API 會自動將輸出上限設為上下文視窗的剩餘空間（`1,048,576` 減去輸入權杖數）。
* **Gemini 3 與 2.5 模型**：輸入（`1,048,576` 個權杖）與輸出（`65,536` 個權杖）各自有獨立的預算。

### 以程式方式取得上下文視窗大小 {#get-context-window}


=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      model_info = client.models.get(model="gemini-4-hydrogen")
      print(f"Input token limit: {model_info.input_token_limit}")
      print(f"Output token limit: {model_info.output_token_limit}")
      ```

=== "JavaScript"

      ```javascript
      // This will only work for SDK newer than 2.0.0
      const modelInfo = await client.models.get({ model: "gemini-4-hydrogen" });
      console.log(`Input token limit: ${modelInfo.inputTokenLimit}`);
      console.log(`Output token limit: ${modelInfo.outputTokenLimit}`);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.Model;

      Client client = new Client();

      Model modelInfo = client.models.get("gemini-4-hydrogen", null);
      System.out.println("Input token limit: " + modelInfo.inputTokenLimit().orElse(0));
      System.out.println("Output token limit: " + modelInfo.outputTokenLimit().orElse(0));
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

          prompt := "Tell me about this instrument"
          imageBytes, err := os.ReadFile("/path/to/organ.jpg")
          if err != nil {
              log.Fatal(err)
          }
          base64Image := base64.StdEncoding.EncodeToString(imageBytes)

          // Count tokens before creating the interaction
          parts := []*genai.Part{
              genai.NewPartFromText(prompt),
              genai.NewPartFromBytes(imageBytes, "image/jpeg"),
          }
          totalTokens, err := client.Models.CountTokens(ctx, "gemini-4-hydrogen", []*genai.Content{
              genai.NewContentFromParts(parts, genai.RoleUser),
          }, nil)
          if err != nil {
              log.Fatal(err)
          }
          fmt.Printf("Estimated input tokens: %d\n", totalTokens.TotalTokens)

          // Create the multimodal interaction and inspect the usage metadata
          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: prompt,
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

          interaction := res.Interaction
          if interaction.OutputText != nil {
              fmt.Println(*interaction.OutputText)
          }
          if interaction.Usage != nil && interaction.Usage.TotalTokens != nil {
              fmt.Printf("Total tokens billed: %d\n", *interaction.Usage.TotalTokens)
          }
      }
      ```


各模型的上下文視窗大小請見 [models](/docs/models/) 頁面。

## 後續步驟 {#whats-next}

* [文字生成](/docs/text-generation/)：生成的基本概念
* [快取](/docs/caching/)：利用快取降低成本
* [定價](/docs/pricing/)：瞭解費用

