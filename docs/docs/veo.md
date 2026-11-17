# 在 Gemini API 中使用 Veo 3.1 生成影片


!!! warning " "

       Gemini API 中的 Veo 3.1 Preview（`veo-3.1-generate-preview`、
      `veo-3.1-fast-generate-preview` 與 `veo-3.1-lite-generate-preview`）已於
      **2026 年 10 月 22 日**[停止服務](/docs/deprecations/)。為避免服務中斷，請遷移至
      [Gemini Omni Flash](/docs/models/gemini-omni-flash/)（`gemini-omni-1.2-flash`），
      或改用透過
      [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate)
      提供的 GA 模型。


> 如需瞭解影片理解功能，請參閱[影片理解](/docs/video-understanding/)指南。

[Veo 3.1](https://deepmind.google/models/veo/) 是一款可生成 8 秒影片（720p、1080p 或 4k）並原生生成音訊的模型。你可以透過 Gemini API 以程式方式存取
這個模型。如需瞭解可用的 Veo 模型版本，請參閱[模型版本](/docs/veo/#model-versions)一節。

Veo 3.1 擅長多種視覺與電影風格，並導入了數項新功能：

* **直向影片**：可選擇橫向（`16:9`）或直向（`9:16`）
  影片。
* **影片延伸**：延伸先前使用 Veo
  生成的影片。
* **指定影格生成**：指定第一個與最後一個
  影格來生成影片。
* **以圖片引導**：使用最多三張參考圖片來引導
  生成影片的內容。

如需瞭解如何為影片生成撰寫有效的文字提示詞，
請參閱 [Veo 提示詞指南](/docs/veo/#prompt-guide)

## 文字轉影片生成 {#generate-from-text}

以下範例示範如何生成含有[對話](/docs/veo/#dialogue)、[電影般寫實感](/docs/veo/#realism)或[創意動畫](/docs/veo/#style)的影片：

### 對話與音效 {#dialogue}


=== "Python"

      ```python
      import time
      from google import genai
      from google.genai import types

      client = genai.Client()

      prompt = """A close up of two people staring at a cryptic drawing on a wall, torchlight flickering.
      A man murmurs, 'This must be it. That's the secret code.' The woman looks at him and whispering excitedly, 'What did you find?'"""

      operation = client.models.generate_videos(
          model="veo-3.1-generate-preview",
          prompt=prompt,
      )

      # Poll the operation status until the video is ready.
      while not operation.done:
          print("Waiting for video generation to complete...")
          time.sleep(10)
          operation = client.operations.get(operation)

      # Download the generated video.
      generated_video = operation.response.generated_videos[0]
      client.files.download(file=generated_video.video, destination="dialogue_example.mp4")
      print("Generated video saved to dialogue_example.mp4")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const prompt = `A close up of two people staring at a cryptic drawing on a wall, torchlight flickering.
      A man murmurs, 'This must be it. That's the secret code.' The woman looks at him and whispering excitedly, 'What did you find?'`;

      let operation = await ai.models.generateVideos({
          model: "veo-3.1-generate-preview",
          prompt: prompt,
      });

      // Poll the operation status until the video is ready.
      while (!operation.done) {
          console.log("Waiting for video generation to complete...")
          await new Promise((resolve) => setTimeout(resolve, 10000));
          operation = await ai.operations.getVideosOperation({
              operation: operation,
          });
      }

      // Download the generated video.
      const video = operation.response?.generatedVideos?.[0]?.video;
      if (video) {
          await ai.files.download({
              file: video,
              downloadPath: "dialogue_example.mp4",
          });
          console.log(`Generated video saved to dialogue_example.mp4`);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"
          "os"
          "time"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          prompt := `A close up of two people staring at a cryptic drawing on a wall, torchlight flickering.
          A man murmurs, 'This must be it. That's the secret code.' The woman looks at him and whispering excitedly, 'What did you find?'`

          operation, _ := client.Models.GenerateVideos(
              ctx,
              "veo-3.1-generate-preview",
              prompt,
              nil,
              nil,
          )

          // Poll the operation status until the video is ready.
          for !operation.Done {
          log.Println("Waiting for video generation to complete...")
              time.Sleep(10 * time.Second)
              operation, _ = client.Operations.GetVideosOperation(ctx, operation, nil)
          }

          // Download the generated video.
          video := operation.Response.GeneratedVideos[0]
          client.Files.Download(ctx, video.Video, nil)
          fname := "dialogue_example.mp4"
          _ = os.WriteFile(fname, video.Video.VideoBytes, 0644)
          log.Printf("Generated video saved to %s\n", fname)
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateVideosOperation;
      import com.google.genai.types.GeneratedVideo;

      Client client = new Client();

      String prompt =
          "A close up of two people staring at a cryptic drawing on a wall, torchlight flickering.\n"
              + "A man murmurs, 'This must be it. That's the secret code.' The woman looks at him and whispering excitedly, 'What did you find?'";

      GenerateVideosOperation operation =
          client.models.generateVideos("veo-3.1-generate-preview", prompt, null, null);

      // Poll the operation status until the video is ready.
      while (!operation.done().orElse(false)) {
        System.out.println("Waiting for video generation to complete...");
        Thread.sleep(10000);
        operation = client.operations.getVideosOperation(operation, null);
      }

      // Download the generated video.
      GeneratedVideo generatedVideo = operation.response().get().generatedVideos().get().get(0);
      client.files.download(generatedVideo, "dialogue_example.mp4", null);
      System.out.println("Generated video saved to dialogue_example.mp4");
      ```

=== "REST"

      ```shell
      # Note: This script uses jq to parse the JSON response.
      # GEMINI API Base URL
      BASE_URL="https://generativelanguage.googleapis.com/v1beta"

      # Send request to generate video and capture the operation name into a variable.
      operation_name=$(curl -s "${BASE_URL}/models/veo-3.1-generate-preview:predictLongRunning" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -X "POST" \
        -d '{
          "instances": [{
              "prompt": "A close up of two people staring at a cryptic drawing on a wall, torchlight flickering. A man murmurs, \"This must be it. That'\''s the secret code.\" The woman looks at him and whispering excitedly, \"What did you find?\""
            }
          ]
        }' | jq -r .name)

      # Poll the operation status until the video is ready
      while true; do
        # Get the full JSON status and store it in a variable.
        status_response=$(curl -s -H "x-goog-api-key: $GEMINI_API_KEY" "${BASE_URL}/${operation_name}")

        # Check the "done" field from the JSON stored in the variable.
        is_done=$(echo "${status_response}" | jq .done)

        if [ "${is_done}" = "true" ]; then
          # Extract the download URI from the final response.
          video_uri=$(echo "${status_response}" | jq -r '.response.generateVideoResponse.generatedSamples[0].video.uri')
          echo "Downloading video from: ${video_uri}"

          # Download the video using the URI and API key and follow redirects.
          curl -L -o dialogue_example.mp4 -H "x-goog-api-key: $GEMINI_API_KEY" "${video_uri}"
          break
        fi
        # Wait for 5 seconds before checking again.
        sleep 10
      done
      ```


### 電影般的寫實感 {#realism}


=== "Python"

      ```python
      import time
      from google import genai
      from google.genai import types

      client = genai.Client()

      prompt = """Drone shot following a classic red convertible driven by a man along a winding coastal road at sunset, waves crashing against the rocks below.
      The convertible accelerates fast and the engine roars loudly."""

      operation = client.models.generate_videos(
          model="veo-3.1-generate-preview",
          prompt=prompt,
      )

      # Poll the operation status until the video is ready.
      while not operation.done:
          print("Waiting for video generation to complete...")
          time.sleep(10)
          operation = client.operations.get(operation)

      # Download the generated video.
      generated_video = operation.response.generated_videos[0]
      client.files.download(file=generated_video.video, destination="realism_example.mp4")
      print("Generated video saved to realism_example.mp4")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const prompt = `Drone shot following a classic red convertible driven by a man along a winding coastal road at sunset, waves crashing against the rocks below.
      The convertible accelerates fast and the engine roars loudly.`;

      let operation = await ai.models.generateVideos({
          model: "veo-3.1-generate-preview",
          prompt: prompt,
      });

      // Poll the operation status until the video is ready.
      while (!operation.done) {
          console.log("Waiting for video generation to complete...")
          await new Promise((resolve) => setTimeout(resolve, 10000));
          operation = await ai.operations.getVideosOperation({
              operation: operation,
          });
      }

      // Download the generated video.
      const video = operation.response?.generatedVideos?.[0]?.video;
      if (video) {
          await ai.files.download({
              file: video,
              downloadPath: "realism_example.mp4",
          });
          console.log(`Generated video saved to realism_example.mp4`);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"
          "os"
          "time"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          prompt := `Drone shot following a classic red convertible driven by a man along a winding coastal road at sunset, waves crashing against the rocks below.
        The convertible accelerates fast and the engine roars loudly.`

          operation, _ := client.Models.GenerateVideos(
              ctx,
              "veo-3.1-generate-preview",
              prompt,
              nil,
              nil,
          )

          // Poll the operation status until the video is ready.
          for !operation.Done {
          log.Println("Waiting for video generation to complete...")
              time.Sleep(10 * time.Second)
              operation, _ = client.Operations.GetVideosOperation(ctx, operation, nil)
          }

          // Download the generated video.
          video := operation.Response.GeneratedVideos[0]
          client.Files.Download(ctx, video.Video, nil)
          fname := "realism_example.mp4"
          _ = os.WriteFile(fname, video.Video.VideoBytes, 0644)
          log.Printf("Generated video saved to %s\n", fname)
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateVideosOperation;
      import com.google.genai.types.GeneratedVideo;

      Client client = new Client();

      String prompt =
          "Drone shot following a classic red convertible driven by a man along a winding coastal road at sunset, waves crashing against the rocks below.\n"
              + "The convertible accelerates fast and the engine roars loudly.";

      GenerateVideosOperation operation =
          client.models.generateVideos("veo-3.1-generate-preview", prompt, null, null);

      // Poll the operation status until the video is ready.
      while (!operation.done().orElse(false)) {
        System.out.println("Waiting for video generation to complete...");
        Thread.sleep(10000);
        operation = client.operations.getVideosOperation(operation, null);
      }

      // Download the generated video.
      GeneratedVideo generatedVideo = operation.response().get().generatedVideos().get().get(0);
      client.files.download(generatedVideo, "realism_example.mp4", null);
      System.out.println("Generated video saved to realism_example.mp4");
      ```

=== "REST"

      ```shell
      # Note: This script uses jq to parse the JSON response.
      # GEMINI API Base URL
      BASE_URL="https://generativelanguage.googleapis.com/v1beta"

      # Send request to generate video and capture the operation name into a variable.
      operation_name=$(curl -s "${BASE_URL}/models/veo-3.1-generate-preview:predictLongRunning" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -X "POST" \
        -d '{
          "instances": [{
              "prompt": "Drone shot following a classic red convertible driven by a man along a winding coastal road at sunset, waves crashing against the rocks below. The convertible accelerates fast and the engine roars loudly."
            }
          ]
        }' | jq -r .name)

      # Poll the operation status until the video is ready
      while true; do
        # Get the full JSON status and store it in a variable.
        status_response=$(curl -s -H "x-goog-api-key: $GEMINI_API_KEY" "${BASE_URL}/${operation_name}")

        # Check the "done" field from the JSON stored in the variable.
        is_done=$(echo "${status_response}" | jq .done)

        if [ "${is_done}" = "true" ]; then
          # Extract the download URI from the final response.
          video_uri=$(echo "${status_response}" | jq -r '.response.generateVideoResponse.generatedSamples[0].video.uri')
          echo "Downloading video from: ${video_uri}"

          # Download the video using the URI and API key and follow redirects.
          curl -L -o realism_example.mp4 -H "x-goog-api-key: $GEMINI_API_KEY" "${video_uri}"
          break
        fi
        # Wait for 5 seconds before checking again.
        sleep 10
      done
      ```


### 創意動畫 {#style}


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client()
      prompt = "A whimsical stop-motion animation of a tiny robot tending to a garden of glowing mushrooms on a miniature planet."

      operation = client.models.generate_videos(
          model="veo-3.1-generate-preview",
          prompt=prompt,
      )

      # Poll the operation status until the video is ready.
      while not operation.done:
          print("Waiting for video generation to complete...")
          time.sleep(10)
          operation = client.operations.get(operation)

      # Download the generated video.
      generated_video = operation.response.generated_videos[0]
      client.files.download(file=generated_video.video, destination="style_example.mp4")
      print("Generated video saved to style_example.mp4")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const prompt = "A whimsical stop-motion animation of a tiny robot tending to a garden of glowing mushrooms on a miniature planet.";

      let operation = await ai.models.generateVideos({
          model: "veo-3.1-generate-preview",
          prompt: prompt,
      });

      // Poll the operation status until the video is ready.
      while (!operation.done) {
          console.log("Waiting for video generation to complete...")
          await new Promise((resolve) => setTimeout(resolve, 10000));
          operation = await ai.operations.getVideosOperation({
              operation: operation,
          });
      }

      // Download the generated video.
      const video = operation.response?.generatedVideos?.[0]?.video;
      if (video) {
          await ai.files.download({
              file: video,
              downloadPath: "style_example.mp4",
          });
          console.log(`Generated video saved to style_example.mp4`);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"
          "os"
          "time"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          prompt := `A whimsical stop-motion animation of a tiny robot tending to a garden of glowing mushrooms on a miniature planet.`

          operation, _ := client.Models.GenerateVideos(
              ctx,
              "veo-3.1-generate-preview",
              prompt,
              nil,
              nil,
          )

          // Poll the operation status until the video is ready.
          for !operation.Done {
          log.Println("Waiting for video generation to complete...")
              time.Sleep(10 * time.Second)
              operation, _ = client.Operations.GetVideosOperation(ctx, operation, nil)
          }

          // Download the generated video.
          video := operation.Response.GeneratedVideos[0]
          client.Files.Download(ctx, video.Video, nil)
          fname := "style_example.mp4"
          _ = os.WriteFile(fname, video.Video.VideoBytes, 0644)
          log.Printf("Generated video saved to %s\n", fname)
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateVideosOperation;
      import com.google.genai.types.GeneratedVideo;

      Client client = new Client();

      String prompt =
          "A whimsical stop-motion animation of a tiny robot tending to a garden of glowing mushrooms on a miniature planet.";

      GenerateVideosOperation operation =
          client.models.generateVideos("veo-3.1-generate-preview", prompt, null, null);

      // Poll the operation status until the video is ready.
      while (!operation.done().orElse(false)) {
        System.out.println("Waiting for video generation to complete...");
        Thread.sleep(10000);
        operation = client.operations.getVideosOperation(operation, null);
      }

      // Download the generated video.
      GeneratedVideo generatedVideo = operation.response().get().generatedVideos().get().get(0);
      client.files.download(generatedVideo, "style_example.mp4", null);
      System.out.println("Generated video saved to style_example.mp4");
      ```

=== "REST"

      ```shell
      # Note: This script uses jq to parse the JSON response.
      # GEMINI API Base URL
      BASE_URL="https://generativelanguage.googleapis.com/v1beta"

      # Send request to generate video and capture the operation name into a variable.
      operation_name=$(curl -s "${BASE_URL}/models/veo-3.1-generate-preview:predictLongRunning" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -X "POST" \
        -d '{
          "instances": [{
              "prompt": "A whimsical stop-motion animation of a tiny robot tending to a garden of glowing mushrooms on a miniature planet."
            }
          ]
        }' | jq -r .name)

      # Poll the operation status until the video is ready
      while true; do
        # Get the full JSON status and store it in a variable.
        status_response=$(curl -s -H "x-goog-api-key: $GEMINI_API_KEY" "${BASE_URL}/${operation_name}")

        # Check the "done" field from the JSON stored in the variable.
        is_done=$(echo "${status_response}" | jq .done)

        if [ "${is_done}" = "true" ]; then
          # Extract the download URI from the final response.
          video_uri=$(echo "${status_response}" | jq -r '.response.generateVideoResponse.generatedSamples[0].video.uri')
          echo "Downloading video from: ${video_uri}"

          # Download the video using the URI and API key and follow redirects.
          curl -L -o style_example.mp4 -H "x-goog-api-key: $GEMINI_API_KEY" "${video_uri}"
          break
        fi
        # Wait for 5 seconds before checking again.
        sleep 10
      done
      ```


## 控制長寬比 {#aspect-ratio}

Veo 3.1 可讓你建立橫向（`16:9`，預設設定）或直向
（`9:16`）影片。你可以透過 `aspect_ratio` 參數告訴模型你想要哪一種：


=== "Python"

      ```python
      import time
      from google import genai
      from google.genai import types

      client = genai.Client()

      prompt = """A montage of pizza making: a chef tossing and flattening the floury dough, ladling rich red tomato sauce in a spiral, sprinkling mozzarella cheese and pepperoni, and a final shot of the bubbling golden-brown pizza, upbeat electronic music with a rhythmical beat is playing, high energy professional video."""

      operation = client.models.generate_videos(
          model="veo-3.1-generate-preview",
          prompt=prompt,
          config=types.GenerateVideosConfig(
            aspect_ratio="9:16",
          ),
      )

      # Poll the operation status until the video is ready.
      while not operation.done:
          print("Waiting for video generation to complete...")
          time.sleep(10)
          operation = client.operations.get(operation)

      # Download the generated video.
      generated_video = operation.response.generated_videos[0]
      client.files.download(file=generated_video.video, destination="pizza_making.mp4")
      print("Generated video saved to pizza_making.mp4")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const prompt = `A montage of pizza making: a chef tossing and flattening the floury dough, ladling rich red tomato sauce in a spiral, sprinkling mozzarella cheese and pepperoni, and a final shot of the bubbling golden-brown pizza, upbeat electronic music with a rhythmical beat is playing, high energy professional video.`;

      let operation = await ai.models.generateVideos({
          model: "veo-3.1-generate-preview",
          prompt: prompt,
          config: {
            aspectRatio: "9:16",
          },
      });

      // Poll the operation status until the video is ready.
      while (!operation.done) {
          console.log("Waiting for video generation to complete...")
          await new Promise((resolve) => setTimeout(resolve, 10000));
          operation = await ai.operations.getVideosOperation({
              operation: operation,
          });
      }

      // Download the generated video.
      const video = operation.response?.generatedVideos?.[0]?.video;
      if (video) {
          await ai.files.download({
              file: video,
              downloadPath: "pizza_making.mp4",
          });
          console.log(`Generated video saved to pizza_making.mp4`);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"
          "os"
          "time"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          prompt := `A montage of pizza making: a chef tossing and flattening the floury dough, ladling rich red tomato sauce in a spiral, sprinkling mozzarella cheese and pepperoni, and a final shot of the bubbling golden-brown pizza, upbeat electronic music with a rhythmical beat is playing, high energy professional video.`

        videoConfig := &genai.GenerateVideosConfig{
            AspectRatio: "9:16",
        }

          operation, _ := client.Models.GenerateVideos(
              ctx,
              "veo-3.1-generate-preview",
              prompt,
              nil,
              videoConfig,
          )

          // Poll the operation status until the video is ready.
          for !operation.Done {
          log.Println("Waiting for video generation to complete...")
              time.Sleep(10 * time.Second)
              operation, _ = client.Operations.GetVideosOperation(ctx, operation, nil)
          }

          // Download the generated video.
          video := operation.Response.GeneratedVideos[0]
          client.Files.Download(ctx, video.Video, nil)
          fname := "pizza_making.mp4"
          _ = os.WriteFile(fname, video.Video.VideoBytes, 0644)
          log.Printf("Generated video saved to %s\n", fname)
      }
      ```

=== "REST"

      ```shell
      # Note: This script uses jq to parse the JSON response.
      # GEMINI API Base URL
      BASE_URL="https://generativelanguage.googleapis.com/v1beta"

      # Send request to generate video and capture the operation name into a variable.
      operation_name=$(curl -s "${BASE_URL}/models/veo-3.1-generate-preview:predictLongRunning" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -X "POST" \
        -d '{
          "instances": [{
              "prompt": "A montage of pizza making: a chef tossing and flattening the floury dough, ladling rich red tomato sauce in a spiral, sprinkling mozzarella cheese and pepperoni, and a final shot of the bubbling golden-brown pizza, upbeat electronic music with a rhythmical beat is playing, high energy professional video."
            }
          ],
          "parameters": {
            "aspectRatio": "9:16"
          }
        }' | jq -r .name)

      # Poll the operation status until the video is ready
      while true; do
        # Get the full JSON status and store it in a variable.
        status_response=$(curl -s -H "x-goog-api-key: $GEMINI_API_KEY" "${BASE_URL}/${operation_name}")

        # Check the "done" field from the JSON stored in the variable.
        is_done=$(echo "${status_response}" | jq .done)

        if [ "${is_done}" = "true" ]; then
          # Extract the download URI from the final response.
          video_uri=$(echo "${status_response}" | jq -r '.response.generateVideoResponse.generatedSamples[0].video.uri')
          echo "Downloading video from: ${video_uri}"

          # Download the video using the URI and API key and follow redirects.
          curl -L -o pizza_making.mp4 -H "x-goog-api-key: $GEMINI_API_KEY" "${video_uri}"
          break
        fi
        # Wait for 5 seconds before checking again.
        sleep 10
      done
      ```


## 控制解析度 {#resolution}

Veo 3.1 也可以直接生成 720p、1080p 或 4k 影片（Veo 3.1 Lite 不提供 4k）。

請注意，解析度越高，延遲也越高。4k 影片的費用也較高（請參閱[定價](/docs/pricing/)）。

[影片延伸](/docs/veo/#extending-veo-videos)同樣僅限於 720p 影片。


=== "Python"

      ```python
      import time
      from google import genai
      from google.genai import types

      client = genai.Client()

      prompt = """A stunning drone view of the Grand Canyon during a flamboyant sunset that highlights the canyon's colors. The drone slowly flies towards the sun then accelerates, dives and flies inside the canyon."""

      operation = client.models.generate_videos(
          model="veo-3.1-generate-preview",
          prompt=prompt,
          config=types.GenerateVideosConfig(
            resolution="4k",
          ),
      )

      # Poll the operation status until the video is ready.
      while not operation.done:
          print("Waiting for video generation to complete...")
          time.sleep(10)
          operation = client.operations.get(operation)

      # Download the generated video.
      generated_video = operation.response.generated_videos[0]
      client.files.download(file=generated_video.video, destination="4k_grand_canyon.mp4")
      print("Generated video saved to 4k_grand_canyon.mp4")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const prompt = `A stunning drone view of the Grand Canyon during a flamboyant sunset that highlights the canyon's colors. The drone slowly flies towards the sun then accelerates, dives and flies inside the canyon.`;

      let operation = await ai.models.generateVideos({
          model: "veo-3.1-generate-preview",
          prompt: prompt,
          config: {
            resolution: "4k",
          },
      });

      // Poll the operation status until the video is ready.
      while (!operation.done) {
          console.log("Waiting for video generation to complete...")
          await new Promise((resolve) => setTimeout(resolve, 10000));
          operation = await ai.operations.getVideosOperation({
              operation: operation,
          });
      }

      // Download the generated video.
      const video = operation.response?.generatedVideos?.[0]?.video;
      if (video) {
          await ai.files.download({
              file: video,
              downloadPath: "4k_grand_canyon.mp4",
          });
          console.log(`Generated video saved to 4k_grand_canyon.mp4`);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"
          "os"
          "time"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          prompt := `A stunning drone view of the Grand Canyon during a flamboyant sunset that highlights the canyon's colors. The drone slowly flies towards the sun then accelerates, dives and flies inside the canyon.`

        videoConfig := &genai.GenerateVideosConfig{
            Resolution: "4k",
        }

          operation, _ := client.Models.GenerateVideos(
              ctx,
              "veo-3.1-generate-preview",
              prompt,
              nil,
              videoConfig,
          )

          // Poll the operation status until the video is ready.
          for !operation.Done {
          log.Println("Waiting for video generation to complete...")
              time.Sleep(10 * time.Second)
              operation, _ = client.Operations.GetVideosOperation(ctx, operation, nil)
          }

          // Download the generated video.
          video := operation.Response.GeneratedVideos[0]
          client.Files.Download(ctx, video.Video, nil)
          fname := "4k_grand_canyon.mp4"
          _ = os.WriteFile(fname, video.Video.VideoBytes, 0644)
          log.Printf("Generated video saved to %s\n", fname)
      }
      ```

=== "REST"

      ```shell
      # Note: This script uses jq to parse the JSON response.
      # GEMINI API Base URL
      BASE_URL="https://generativelanguage.googleapis.com/v1beta"

      # Send request to generate video and capture the operation name into a variable.
      operation_name=$(curl -s "${BASE_URL}/models/veo-3.1-generate-preview:predictLongRunning" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -X "POST" \
        -d '{
          "instances": [{
              "prompt": "A stunning drone view of the Grand Canyon during a flamboyant sunset that highlights the canyon'\''s colors. The drone slowly flies towards the sun then accelerates, dives and flies inside the canyon."
            }
          ],
          "parameters": {
            "resolution": "4k"
          }
        }' | jq -r .name)

      # Poll the operation status until the video is ready
      while true; do
        # Get the full JSON status and store it in a variable.
        status_response=$(curl -s -H "x-goog-api-key: $GEMINI_API_KEY" "${BASE_URL}/${operation_name}")

        # Check the "done" field from the JSON stored in the variable.
        is_done=$(echo "${status_response}" | jq .done)

        if [ "${is_done}" = "true" ]; then
          # Extract the download URI from the final response.
          video_uri=$(echo "${status_response}" | jq -r '.response.generateVideoResponse.generatedSamples[0].video.uri')
          echo "Downloading video from: ${video_uri}"

          # Download the video using the URI and API key and follow redirects.
          curl -L -o 4k_grand_canyon.mp4 -H "x-goog-api-key: $GEMINI_API_KEY" "${video_uri}"
          break
        fi
        # Wait for 5 seconds before checking again.
        sleep 10
      done
      ```


## 圖片轉影片生成 {#generate-from-images}

以下程式碼示範如何先使用
[Gemini 3.1 Flash Image（即 Nano Banana 2）](/docs/image-generation/)生成圖片，
再將該圖片作為
起始影格，使用 Veo 3.1 生成影片。


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client()

      prompt = "Panning wide shot of a calico kitten sleeping in the sunshine"

      # Step 1: Generate an image with Nano Banana 2.
      image = client.models.generate_content(
          model="gemini-3.1-flash-image-preview",
          contents=prompt,
          config={"response_modalities":['IMAGE']}
      )

      # Step 2: Generate video with Veo 3.1 using the image.
      operation = client.models.generate_videos(
          model="veo-3.1-generate-preview",
          prompt=prompt,
          image=image.parts[0].as_image(),
      )

      # Poll the operation status until the video is ready.
      while not operation.done:
          print("Waiting for video generation to complete...")
          time.sleep(10)
          operation = client.operations.get(operation)

      # Download the video.
      video = operation.response.generated_videos[0]
      client.files.download(file=video.video, destination="veo3_with_image_input.mp4")
      print("Generated video saved to veo3_with_image_input.mp4")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const prompt = "Panning wide shot of a calico kitten sleeping in the sunshine";

      // Step 1: Generate an image with Nano Banana 2.
      const imageResponse = await ai.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: prompt,
        config: { responseModalities: ["IMAGE"] },
      });

      const inlineData = imageResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData;

      // Step 2: Generate video with Veo 3.1 using the image.
      let operation = await ai.models.generateVideos({
        model: "veo-3.1-generate-preview",
        prompt: prompt,
        image: {
          imageBytes: inlineData?.data || '',
          mimeType: inlineData?.mimeType || "image/png",
        },
      });

      // Poll the operation status until the video is ready.
      while (!operation.done) {
        console.log("Waiting for video generation to complete...")
        await new Promise((resolve) => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({
          operation: operation,
        });
      }

      // Download the video.
      const video = operation.response?.generatedVideos?.[0]?.video;
      if (video) {
          await ai.files.download({
              file: video,
              downloadPath: "veo3_with_image_input.mp4",
          });
          console.log(`Generated video saved to veo3_with_image_input.mp4`);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"
          "os"
          "time"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          prompt := "Panning wide shot of a calico kitten sleeping in the sunshine"

          // Step 1: Generate an image with Nano Banana 2.
          imageResponse, err := client.Models.GenerateContent(
              ctx,
              "gemini-3.1-flash-image-preview",
              prompt,
              nil, // GenerateImagesConfig
          )
          if err != nil {
              log.Fatal(err)
          }

          // Step 2: Generate video with Veo 3.1 using the image.
          operation, err := client.Models.GenerateVideos(
              ctx,
              "veo-3.1-generate-preview",
              prompt,
              imageResponse.GeneratedImages[0].Image,
              nil, // GenerateVideosConfig
          )
          if err != nil {
              log.Fatal(err)
          }

          // Poll the operation status until the video is ready.
          for !operation.Done {
              log.Println("Waiting for video generation to complete...")
              time.Sleep(10 * time.Second)
              operation, _ = client.Operations.GetVideosOperation(ctx, operation, nil)
          }

          // Download the video.
          video := operation.Response.GeneratedVideos[0]
          client.Files.Download(ctx, video.Video, nil)
          fname := "veo3_with_image_input.mp4"
          _ = os.WriteFile(fname, video.Video.VideoBytes, 0644)
          log.Printf("Generated video saved to %s\n", fname)
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.Blob;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.GenerateVideosOperation;
      import com.google.genai.types.GeneratedVideo;
      import com.google.genai.types.Image;

      Client client = new Client();

      String prompt = "Panning wide shot of a calico kitten sleeping in the sunshine";

      // Step 1: Generate an image with Nano Banana 2.
      GenerateContentResponse imageResponse =
          client.models.generateContent(
              "gemini-3.1-flash-image-preview",
              prompt,
              GenerateContentConfig.builder().responseModalities("IMAGE").build());

      Blob inlineData = imageResponse.parts().get(0).inlineData().get();
      Image image =
          Image.builder()
              .imageBytes(inlineData.data().get())
              .mimeType(inlineData.mimeType().orElse("image/png"))
              .build();

      // Step 2: Generate video with Veo 3.1 using the image.
      GenerateVideosOperation operation =
          client.models.generateVideos("veo-3.1-generate-preview", prompt, image, null);

      // Poll the operation status until the video is ready.
      while (!operation.done().orElse(false)) {
        System.out.println("Waiting for video generation to complete...");
        Thread.sleep(10000);
        operation = client.operations.getVideosOperation(operation, null);
      }

      // Download the video.
      GeneratedVideo video = operation.response().get().generatedVideos().get().get(0);
      client.files.download(video, "veo3_with_image_input.mp4", null);
      System.out.println("Generated video saved to veo3_with_image_input.mp4");
      ```


### 使用參考圖片 {#reference-images}


!!! note " "

      此功能僅適用於 Veo 3.1 模型。


Veo 3.1 現在接受最多 3 張參考圖片，以引導生成影片的
內容。提供人物、角色或產品的圖片，
即可在輸出影片中保留主體的外觀。

例如，使用以下三張以
[Nano Banana](/docs/image-generation/) 生成的圖片作為參考，搭配[撰寫得宜的提示詞](/docs/veo/#use-reference-images)，即可建立出以下影片：

| `dress_image` | `woman_image` | `glasses_image` |
| :--- | :--- | :--- |
|  |  |  |


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client()

      prompt = "The video opens with a medium, eye-level shot of a beautiful woman with dark hair and warm brown eyes. She wears a magnificent, high-fashion flamingo dress with layers of pink and fuchsia feathers, complemented by whimsical pink, heart-shaped sunglasses. She walks with serene confidence through the crystal-clear, shallow turquoise water of a sun-drenched lagoon. The camera slowly pulls back to a medium-wide shot, revealing the breathtaking scene as the dress's long train glides and floats gracefully on the water's surface behind her. The cinematic, dreamlike atmosphere is enhanced by the vibrant colors of the dress against the serene, minimalist landscape, capturing a moment of pure elegance and high-fashion fantasy."

      dress_reference = types.VideoGenerationReferenceImage(
        image=dress_image, # Generated separately with Nano Banana
        reference_type="asset"
      )

      sunglasses_reference = types.VideoGenerationReferenceImage(
        image=glasses_image, # Generated separately with Nano Banana
        reference_type="asset"
      )

      woman_reference = types.VideoGenerationReferenceImage(
        image=woman_image, # Generated separately with Nano Banana
        reference_type="asset"
      )

      operation = client.models.generate_videos(
          model="veo-3.1-generate-preview",
          prompt=prompt,
          config=types.GenerateVideosConfig(
            reference_images=[dress_reference, glasses_reference, woman_reference],
          ),
      )

      # Poll the operation status until the video is ready.
      while not operation.done:
          print("Waiting for video generation to complete...")
          time.sleep(10)
          operation = client.operations.get(operation)

      # Download the video.
      video = operation.response.generated_videos[0]
      client.files.download(file=video.video, destination="veo3.1_with_reference_images.mp4")
      print("Generated video saved to veo3.1_with_reference_images.mp4")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI, VideoGenerationReferenceType } from "@google/genai";

      const ai = new GoogleGenAI({});

      const prompt = "The video opens with a medium, eye-level shot of a beautiful woman with dark hair and warm brown eyes. She wears a magnificent, high-fashion flamingo dress with layers of pink and fuchsia feathers, complemented by whimsical pink, heart-shaped sunglasses. She walks with serene confidence through the crystal-clear, shallow turquoise water of a sun-drenched lagoon. The camera slowly pulls back to a medium-wide shot, revealing the breathtaking scene as the dress's long train glides and floats gracefully on the water's surface behind her. The cinematic, dreamlike atmosphere is enhanced by the vibrant colors of the dress against the serene, minimalist landscape, capturing a moment of pure elegance and high-fashion fantasy.";

      // dressImage, glassesImage, womanImage generated separately with Nano Banana
      // and available as objects like { imageBytes: "...", mimeType: "image/png" }

      let operation = await ai.models.generateVideos({
        model: "veo-3.1-generate-preview",
        prompt: prompt,
        config: {
          referenceImages: [
            { image: dressImage, referenceType: VideoGenerationReferenceType.ASSET },
            { image: glassesImage, referenceType: VideoGenerationReferenceType.ASSET },
            { image: womanImage, referenceType: VideoGenerationReferenceType.ASSET },
          ],
        },
      });

      // Poll the operation status until the video is ready.
      while (!operation.done) {
        console.log("Waiting for video generation to complete...");
        await new Promise((resolve) => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({
          operation: operation,
        });
      }

      // Download the video.
      const video = operation.response?.generatedVideos?.[0]?.video;
      if (video) {
          await ai.files.download({
              file: video,
              downloadPath: "veo3.1_with_reference_images.mp4",
          });
          console.log(`Generated video saved to veo3.1_with_reference_images.mp4`);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"
          "os"
          "time"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

        prompt := `The video opens with a medium, eye-level shot of a beautiful woman with dark hair and warm brown eyes. She wears a magnificent, high-fashion flamingo dress with layers of pink and fuchsia feathers, complemented by whimsical pink, heart-shaped sunglasses. She walks with serene confidence through the crystal-clear, shallow turquoise water of a sun-drenched lagoon. The camera slowly pulls back to a medium-wide shot, revealing the breathtaking scene as the dress's long train glides and floats gracefully on the water's surface behind her. The cinematic, dreamlike atmosphere is enhanced by the vibrant colors of the dress against the serene, minimalist landscape, capturing a moment of pure elegance and high-fashion fantasy.`

        // dressImage, glassesImage, womanImage generated separately with Nano Banana
        // and available as *genai.Image objects.
        var dressImage, glassesImage, womanImage *genai.Image

        dressReference := &genai.VideoGenerationReferenceImage{
          Image: dressImage,
          ReferenceType: "asset",
        }
        sunglassesReference := &genai.VideoGenerationReferenceImage{
          Image: glassesImage,
          ReferenceType: "asset",
        }
        womanReference := &genai.VideoGenerationReferenceImage{
          Image: womanImage,
          ReferenceType: "asset",
        }

          operation, _ := client.Models.GenerateVideos(
              ctx,
              "veo-3.1-generate-preview",
              prompt,
          nil, // image
              &genai.GenerateVideosConfig{
            ReferenceImages: []*genai.VideoGenerationReferenceImage{
              dressReference,
              sunglassesReference,
              womanReference,
            },
          },
          )

          // Poll the operation status until the video is ready.
          for !operation.Done {
              log.Println("Waiting for video generation to complete...")
              time.Sleep(10 * time.Second)
              operation, _ = client.Operations.GetVideosOperation(ctx, operation, nil)
          }

          // Download the video.
          video := operation.Response.GeneratedVideos[0]
          client.Files.Download(ctx, video.Video, nil)
          fname := "veo3.1_with_reference_images.mp4"
          _ = os.WriteFile(fname, video.Video.VideoBytes, 0644)
          log.Printf("Generated video saved to %s\n", fname)
      }
      ```

=== "REST"

      ```shell
      # Note: This script uses jq to parse the JSON response.
      # It assumes dress_image_base64, glasses_image_base64, and woman_image_base64
      # contain base64-encoded image data.

      # GEMINI API Base URL
      BASE_URL="https://generativelanguage.googleapis.com/v1beta"

      # Send request to generate video and capture the operation name into a variable.
      operation_name=$(curl -s "${BASE_URL}/models/veo-3.1-generate-preview:predictLongRunning" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -X "POST" \
        -d '{
          "instances": [{
            "prompt": "The video opens with a medium, eye-level shot of a beautiful woman with dark hair and warm brown eyes. She wears a magnificent, high-fashion flamingo dress with layers of pink and fuchsia feathers, complemented by whimsical pink, heart-shaped sunglasses. She walks with serene confidence through the crystal-clear, shallow turquoise water of a sun-drenched lagoon. The camera slowly pulls back to a medium-wide shot, revealing the breathtaking scene as the dress'\''s long train glides and floats gracefully on the water'\''s surface behind her. The cinematic, dreamlike atmosphere is enhanced by the vibrant colors of the dress against the serene, minimalist landscape, capturing a moment of pure elegance and high-fashion fantasy.",
            "referenceImages": [
              {
                "image": {"inlineData": {"mimeType": "image/png", "data": "'"$dress_image_base64"'"}},
                "referenceType": "asset"
              },
              {
                "image": {"inlineData": {"mimeType": "image/png", "data": "'"$glasses_image_base64"'"}},
                "referenceType": "asset"
              },
              {
                "image": {"inlineData": {"mimeType": "image/png", "data": "'"$woman_image_base64"'"}},
                "referenceType": "asset"
              }
            ]
          }],
        }' | jq -r .name)

      # Poll the operation status until the video is ready
      while true; do
        # Get the full JSON status and store it in a variable.
        status_response=$(curl -s -H "x-goog-api-key: $GEMINI_API_KEY" "${BASE_URL}/${operation_name}")

        # Check the "done" field from the JSON stored in the variable.
        is_done=$(echo "${status_response}" | jq .done)

        if [ "${is_done}" = "true" ]; then
          # Extract the download URI from the final response.
          video_uri=$(echo "${status_response}" | jq -r '.response.generateVideoResponse.generatedSamples[0].video.uri')
          echo "Downloading video from: ${video_uri}"

          # Download the video using the URI and API key and follow redirects.
          curl -L -o veo3.1_with_reference_images.mp4 -H "x-goog-api-key: $GEMINI_API_KEY" "${video_uri}"
          break
        fi
        # Wait for 10 seconds before checking again.
        sleep 10
      done
      ```


### 使用第一個與最後一個影格 {#using-first-and-last-video-frames}


!!! note " "

      此功能僅適用於 Veo 3.1 模型


Veo 3.1 可讓你以插值方式建立影片，也就是指定影片的第一個與
最後一個影格。如需瞭解如何為影片生成撰寫有效的文字提示詞，請參閱 [Veo 提示詞指南](/docs/veo/#use-reference-images)。


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client()

      prompt = "A cinematic, haunting video. A ghostly woman with long white hair and a flowing dress swings gently on a rope swing beneath a massive, gnarled tree in a foggy, moonlit clearing. The fog thickens and swirls around her, and she slowly fades away, vanishing completely. The empty swing is left swaying rhythmically on its own in the eerie silence."

      operation = client.models.generate_videos(
          model="veo-3.1-generate-preview",
          prompt=prompt,
          image=first_image, # The starting frame is passed as a primary input
          config=types.GenerateVideosConfig(
            last_frame=last_image # The ending frame is passed as a generation constraint in the config
          ),
      )

      # Poll the operation status until the video is ready.
      while not operation.done:
          print("Waiting for video generation to complete...")
          time.sleep(10)
          operation = client.operations.get(operation)

      # Download the video.
      video = operation.response.generated_videos[0]
      client.files.download(file=video.video, destination="veo3.1_with_interpolation.mp4")
      print("Generated video saved to veo3.1_with_interpolation.mp4")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const prompt = "A cinematic, haunting video. A ghostly woman with long white hair and a flowing dress swings gently on a rope swing beneath a massive, gnarled tree in a foggy, moonlit clearing. The fog thickens and swirls around her, and she slowly fades away, vanishing completely. The empty swing is left swaying rhythmically on its own in the eerie silence.";

      // firstImage and lastImage generated separately with Nano Banana
      // and available as objects like { imageBytes: "...", mimeType: "image/png" }
      let operation = await ai.models.generateVideos({
          model: "veo-3.1-generate-preview",
          prompt: prompt,
          image: firstImage, // The starting frame is passed as a primary input
          config: {
            lastFrame: lastImage, // The ending frame is passed as a generation constraint in the config
          },
      });

      // Poll the operation status until the video is ready.
      while (!operation.done) {
          console.log("Waiting for video generation to complete...")
          await new Promise((resolve) => setTimeout(resolve, 10000));
          operation = await ai.operations.getVideosOperation({
              operation: operation,
          });
      }

      // Download the video.
      const video = operation.response?.generatedVideos?.[0]?.video;
      if (video) {
          await ai.files.download({
              file: video,
              downloadPath: "veo3.1_with_interpolation.mp4",
          });
          console.log(`Generated video saved to veo3.1_with_interpolation.mp4`);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"
          "os"
          "time"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

        prompt := `A cinematic, haunting video. A ghostly woman with long white hair and a flowing dress swings gently on a rope swing beneath a massive, gnarled tree in a foggy, moonlit clearing. The fog thickens and swirls around her, and she slowly fades away, vanishing completely. The empty swing is left swaying rhythmically on its own in the eerie silence.`

        // firstImage and lastImage generated separately with Nano Banana
        // and available as *genai.Image objects.
        var firstImage, lastImage *genai.Image

          operation, _ := client.Models.GenerateVideos(
              ctx,
              "veo-3.1-generate-preview",
              prompt,
          firstImage, // The starting frame is passed as a primary input
              &genai.GenerateVideosConfig{
            LastFrame: lastImage, // The ending frame is passed as a generation constraint in the config
          },
          )

          // Poll the operation status until the video is ready.
          for !operation.Done {
              log.Println("Waiting for video generation to complete...")
              time.Sleep(10 * time.Second)
              operation, _ = client.Operations.GetVideosOperation(ctx, operation, nil)
          }

          // Download the video.
          video := operation.Response.GeneratedVideos[0]
          client.Files.Download(ctx, video.Video, nil)
          fname := "veo3.1_with_interpolation.mp4"
          _ = os.WriteFile(fname, video.Video.VideoBytes, 0644)
          log.Printf("Generated video saved to %s\n", fname)
      }
      ```

=== "REST"

      ```shell
      # Note: This script uses jq to parse the JSON response.
      # It assumes first_image_base64 and last_image_base64
      # contain base64-encoded image data.

      # GEMINI API Base URL
      BASE_URL="https://generativelanguage.googleapis.com/v1beta"

      # Send request to generate video and capture the operation name into a variable.
      # The starting frame is passed as a primary input
      # The ending frame is passed as a generation constraint in the config
      operation_name=$(curl -s "${BASE_URL}/models/veo-3.1-generate-preview:predictLongRunning" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -X "POST" \
        -d '{
          "instances": [{
            "prompt": "A cinematic, haunting video. A ghostly woman with long white hair and a flowing dress swings gently on a rope swing beneath a massive, gnarled tree in a foggy, moonlit clearing. The fog thickens and swirls around her, and she slowly fades away, vanishing completely. The empty swing is left swaying rhythmically on its own in the eerie silence.",
            "image": {"inlineData": {"mimeType": "image/png", "data": "'"$first_image_base64"'"}},
            "lastFrame": {"inlineData": {"mimeType": "image/png", "data": "'"$last_image_base64"'"}}
          }],
        }' | jq -r .name)

      # Poll the operation status until the video is ready
      while true; do
        # Get the full JSON status and store it in a variable.
        status_response=$(curl -s -H "x-goog-api-key: $GEMINI_API_KEY" "${BASE_URL}/${operation_name}")

        # Check the "done" field from the JSON stored in the variable.
        is_done=$(echo "${status_response}" | jq .done)

        if [ "${is_done}" = "true" ]; then
          # Extract the download URI from the final response.
          video_uri=$(echo "${status_response}" | jq -r '.response.generateVideoResponse.generatedSamples[0].video.uri')
          echo "Downloading video from: ${video_uri}"

          # Download the video using the URI and API key and follow redirects.
          curl -L -o veo3.1_with_interpolation.mp4 -H "x-goog-api-key: $GEMINI_API_KEY" "${video_uri}"
          break
        fi
        # Wait for 10 seconds before checking again.
        sleep 10
      done
      ```


    | `first_image` | `last_image` | veo3.1_with_interpolation.mp4 |
    | --- | --- | --- |


## 延伸 Veo 影片 {#extending-veo-videos}


!!! note " "

      此功能僅適用於 Veo 3.1 與 Veo 3.1 Fast 模型，不適用於


Veo 3.1 Lite。

使用 Veo 3.1，可將先前以 Veo 生成的影片延伸 7 秒，最多可延伸 20 次。

輸入影片的限制：

* 僅限長度不超過 141 秒的 Veo 生成影片。
* Gemini API 僅支援延伸 Veo 生成的影片。
* 影片應來自先前的生成結果，例如
  `operation.response.generated_videos[0].video`
* 影片會儲存 2 天，但若影片被引用來進行延伸，
  其 2 天的儲存計時器會重新計算。你只能延伸在過去兩天內生成
  或被引用過的影片。
* 輸入影片應具備特定的長度、長寬比與尺寸：
  *   長寬比：9:16 或 16:9
  *   解析度：720p
  *   影片長度：141 秒或更短


延伸的輸出結果是將使用者輸入的影片與
生成的延伸影片合併而成的單一影片，長度最長可達 148 秒。

這個範例取用一段 Veo 生成的影片（此處連同
其原始提示詞一併呈現），並使用 `video` 參數與新的提示詞將其延伸：

| 提示詞 | 輸出：butterfly_video |
| :--- | :--- |
| An origami butterfly flaps its wings and flies out of the french doors into the garden. |  |


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client()

      prompt = "Track the butterfly into the garden as it lands on an orange origami flower. A fluffy white puppy runs up and gently pats the flower."

      operation = client.models.generate_videos(
          model="veo-3.1-generate-preview",
          video=operation.response.generated_videos[0].video, # This must be a video from a previous generation
          prompt=prompt,
          config=types.GenerateVideosConfig(
              number_of_videos=1,
              resolution="720p"
          ),
      )

      # Poll the operation status until the video is ready.
      while not operation.done:
          print("Waiting for video generation to complete...")
          time.sleep(10)
          operation = client.operations.get(operation)

      # Download the video.
      video = operation.response.generated_videos[0]
      client.files.download(file=video.video, destination="veo3.1_extension.mp4")
      print("Generated video saved to veo3.1_extension.mp4")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const prompt = "Track the butterfly into the garden as it lands on an orange origami flower. A fluffy white puppy runs up and gently pats the flower.";

      // butterflyVideo must be a video from a previous generation
      // available as an object like { videoBytes: "...", mimeType: "video/mp4" }
      let operation = await ai.models.generateVideos({
          model: "veo-3.1-generate-preview",
          video: butterflyVideo,
          prompt: prompt,
          config: {
              numberOfVideos: 1,
              resolution: "720p",
          },
      });

      // Poll the operation status until the video is ready.
      while (!operation.done) {
          console.log("Waiting for video generation to complete...")
          await new Promise((resolve) => setTimeout(resolve, 10000));
          operation = await ai.operations.getVideosOperation({
              operation: operation,
          });
      }

      // Download the video.
      const video = operation.response?.generatedVideos?.[0]?.video;
      if (video) {
          await ai.files.download({
              file: video,
              downloadPath: "veo3.1_extension.mp4",
          });
          console.log(`Generated video saved to veo3.1_extension.mp4`);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"
          "os"
          "time"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

        prompt := `Track the butterfly into the garden as it lands on an orange origami flower. A fluffy white puppy runs up and gently pats the flower.`

        // butterflyVideo must be a video from a previous generation
        // available as a *genai.Video object.
        var butterflyVideo *genai.Video

          operation, _ := client.Models.GenerateVideos(
              ctx,
              "veo-3.1-generate-preview",
              prompt,
          nil, // image
          butterflyVideo,
              &genai.GenerateVideosConfig{
            NumberOfVideos: 1,
            Resolution: "720p",
          },
          )

          // Poll the operation status until the video is ready.
          for !operation.Done {
              log.Println("Waiting for video generation to complete...")
              time.Sleep(10 * time.Second)
              operation, _ = client.Operations.GetVideosOperation(ctx, operation, nil)
          }

          // Download the video.
          video := operation.Response.GeneratedVideos[0]
          client.Files.Download(ctx, video.Video, nil)
          fname := "veo3.1_extension.mp4"
          _ = os.WriteFile(fname, video.Video.VideoBytes, 0644)
          log.Printf("Generated video saved to %s\n", fname)
      }
      ```

=== "REST"

      ```shell
      # Note: This script uses jq to parse the JSON response.
      # It assumes butterfly_video_base64 contains base64-encoded
      # video data from a previous generation.

      # GEMINI API Base URL
      BASE_URL="https://generativelanguage.googleapis.com/v1beta"

      # Send request to generate video and capture the operation name into a variable.
      operation_name=$(curl -s "${BASE_URL}/models/veo-3.1-generate-preview:predictLongRunning" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -X "POST" \
        -d '{
          "instances": [{
            "prompt": "Track the butterfly into the garden as it lands on an orange origami flower. A fluffy white puppy runs up and gently pats the flower.",
            "video": {"inlineData": {"mimeType": "video/mp4", "data": "'"$butterfly_video_base64"'"}}
          }],
          "parameters": {
            "numberOfVideos": 1,
            "resolution": "720p"
          }
        }' | jq -r .name)

      # Poll the operation status until the video is ready
      while true; do
        # Get the full JSON status and store it in a variable.
        status_response=$(curl -s -H "x-goog-api-key: $GEMINI_API_KEY" "${BASE_URL}/${operation_name}")

        # Check the "done" field from the JSON stored in the variable.
        is_done=$(echo "${status_response}" | jq .done)

        if [ "${is_done}" = "true" ]; then
          # Extract the download URI from the final response.
          video_uri=$(echo "${status_response}" | jq -r '.response.generateVideoResponse.generatedSamples[0].video.uri')
          echo "Downloading video from: ${video_uri}"

          # Download the video using the URI and API key and follow redirects.
          curl -L -o veo3.1_extension.mp4 -H "x-goog-api-key: $GEMINI_API_KEY" "${video_uri}"
          break
        fi
        # Wait for 10 seconds before checking again.
        sleep 10
      done
      ```

      如需瞭解如何為影片生成撰寫有效的文字提示詞，請參閱
        [Veo 提示詞指南](/docs/veo/#extend-prompt)。


## 處理非同步操作 {#handling-asynchronous-operations}

影片生成是運算密集的工作。當你向 API 送出要求
時，它會啟動一項長時間執行的作業，並立即傳回一個 `operation`
物件。接著你必須持續輪詢，直到影片就緒為止，也就是
`done` 狀態為 true 時。

這個流程的核心是輪詢迴圈，會定期檢查作業的
狀態。


=== "Python"

      ```python
      import time
      from google import genai
      from google.genai import types

      client = genai.Client()

      # After starting the job, you get an operation object.
      operation = client.models.generate_videos(
          model="veo-3.1-generate-preview",
          prompt="A cinematic shot of a majestic lion in the savannah.",
      )

      # Alternatively, you can use operation.name to get the operation.
      operation = types.GenerateVideosOperation(name=operation.name)

      # This loop checks the job status every 10 seconds.
      while not operation.done:
          time.sleep(10)
          # Refresh the operation object to get the latest status.
          operation = client.operations.get(operation)

      # Once done, the result is in operation.response.
      # ... process and download your video ...
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      // After starting the job, you get an operation object.
      let operation = await ai.models.generateVideos({
        model: "veo-3.1-generate-preview",
        prompt: "A cinematic shot of a majestic lion in the savannah.",
      });

      // Alternatively, you can use operation.name to get the operation.
      // operation = types.GenerateVideosOperation(name=operation.name)

      // This loop checks the job status every 10 seconds.
      while (!operation.done) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          // Refresh the operation object to get the latest status.
          operation = await ai.operations.getVideosOperation({ operation });
      }

      // Once done, the result is in operation.response.
      // ... process and download your video ...
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"
          "time"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          // After starting the job, you get an operation object.
          operation, _ := client.Models.GenerateVideos(
              ctx,
              "veo-3.1-generate-preview",
              "A cinematic shot of a majestic lion in the savannah.",
              nil,
              nil,
          )

          // This loop checks the job status every 10 seconds.
          for !operation.Done {
              time.Sleep(10 * time.Second)
              // Refresh the operation object to get the latest status.
              operation, _ = client.Operations.GetVideosOperation(ctx, operation, nil)
          }

          // Once done, the result is in operation.Response.
          // ... process and download your video ...
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateVideosOperation;

      Client client = new Client();

      // After starting the job, you get an operation object.
      GenerateVideosOperation operation =
          client.models.generateVideos(
              "veo-3.1-generate-preview",
              "A cinematic shot of a majestic lion in the savannah.",
              null,
              null);

      // Alternatively, you can use operation.name to construct the operation.
      operation = GenerateVideosOperation.builder().name(operation.name().get()).build();

      // This loop checks the job status every 10 seconds.
      while (!operation.done().orElse(false)) {
        Thread.sleep(10000);
        // Refresh the operation object to get the latest status.
        operation = client.operations.getVideosOperation(operation, null);
      }

      // Once done, the result is in operation.response().
      // ... process and download your video ...
      ```

=== "REST"

      ```shell
      # Note: This script uses jq to parse the JSON response.
      # GEMINI API Base URL
      BASE_URL="https://generativelanguage.googleapis.com/v1beta"

      # Send request to generate video and capture the operation name into a variable.
      operation_name=$(curl -s "${BASE_URL}/models/veo-3.1-generate-preview:predictLongRunning" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -X "POST" \
        -d '{
          "instances": [{
              "prompt": "A cinematic shot of a majestic lion in the savannah."
            }
          ]
        }' | jq -r .name)

      # This loop checks the job status every 10 seconds.
      while true; do
        # Get the full JSON status and store it in a variable.
        status_response=$(curl -s -H "x-goog-api-key: $GEMINI_API_KEY" "${BASE_URL}/${operation_name}")

        # Check the "done" field from the JSON stored in the variable.
        is_done=$(echo "${status_response}" | jq .done)

        if [ "${is_done}" = "true" ]; then
          # Once done, the result is in status_response.
          # ... process and download your video ...
          echo "Video generation complete."
          break
        fi
        # Wait for 10 seconds before checking again.
        echo "Waiting for video generation to complete..."
        sleep 10
      done
      ```


## Veo API 參數與規格 {#veo-model-parameters}

以下是在 API 要求中可以設定的參數，用來控制影片
生成流程。

| 參數 | Veo 3.1 & Veo 3.1 Fast | Veo 3.1 Lite | Veo 3 & Veo 3 Fast |
| :--- | :--- | :--- | :--- |
| Instances |  |  |  |
| `prompt`：影片的文字說明。支援音訊提示。 | `string` | `string` | `string` |
| `image`：要製成動畫的初始圖片。 | `Image` 物件 | `Image` 物件 | `Image` 物件 |
| `lastFrame`：插值影片要轉場到的最終圖片。必須與 `image` 參數搭配使用。 | `Image` 物件 | `Image` 物件 | `Image` 物件 |
| `referenceImages`：最多三張圖片，用作風格與內容參考。 | `VideoGenerationReferenceImage` 物件 | `n/a` 物件 | n/a |
| `video`：用於影片延伸的影片。 | 來自先前生成結果的 `Video` 物件 | n/a | n/a |
| 參數 |  |  |  |
| `aspectRatio`：影片的長寬比。 | `"16:9"`（預設）、`"9:16"` | `"16:9"`（預設）、`"9:16"` | `"16:9"`（預設）、`"9:16"` |
| `durationSeconds`：生成影片的長度。 | `"4"`、`"6"`、`"8"`。使用延伸、參考圖片或 1080p 與 4k 解析度時必須為 "8" | `"4"`、`"6"`、`"8"`。使用參考圖片或 1080p 時必須為 "8" | `"4"`、`"6"`、`"8"`。使用延伸、參考圖片或 1080p 與 4k 解析度時必須為 "8" |
| `personGeneration`：控制人物的生成。（地區限制請參閱[限制](/docs/veo/#limitations)） | 文字轉影片與延伸：僅 `"allow_all"` 圖片轉影片、插值與參考圖片：僅 `"allow_adult"` | 文字轉影片：僅 `"allow_all"` 圖片轉影片、插值與參考圖片：僅 `"allow_adult"` | 文字轉影片：僅 `"allow_all"` 圖片轉影片：僅 `"allow_adult"` |
| `resolution`：影片的解析度。 | `"720p"`（預設）、`"1080p"`（僅支援 8 秒長度）、`"4k"`（僅支援 8 秒長度）延伸時僅 `"720p"` | `"720p"`（預設）、`"1080p"`（僅支援 8 秒長度） | `"720p"`（預設）、`"1080p"`（僅支援 8 秒長度）、`"4k"`（僅支援 8 秒長度）延伸時僅 `"720p"` |

請注意，`seed` 參數也適用於 Veo 3 模型。
它不保證決定性，但能略微提升決定性。

## 模型功能 {#model-features}

| 功能 | Veo 3.1 & Veo 3.1 Fast | Veo 3.1 Lite | Veo 3 & Veo 3 Fast |
| :--- | :--- | :--- | :--- |
| **音訊**：原生生成含音訊的影片。 | ✔️ 一律開啟 | ✔️ 一律開啟 | ✔️ 一律開啟 |
| **輸入模態**：用於生成的輸入類型。 | 文字轉影片、圖片轉影片、影片轉影片 | 文字轉影片、圖片轉影片 | 文字轉影片、圖片轉影片 |
| **解析度**：影片的輸出解析度。 | 720p、1080p（僅限 8 秒長度）、4k（僅限 8 秒長度）使用影片延伸時僅 720p。 | 720p、1080p（僅限 8 秒長度） | 720p 與 1080p（僅限 16:9） |
| **影格率**：影片的輸出影格率。 | 24fps | 24fps | 24fps |
| **影片長度**：生成影片的長度。 | 8 秒、6 秒、4 秒 使用 1080p 或 4k 或參考圖片時僅限 8 秒 | 8 秒、6 秒、4 秒 使用 1080p 或參考圖片時僅限 8 秒 | 8 秒 |
| **每次要求的影片數**：每次要求生成的影片數量。 | 1 | 1 | 1 |
| **狀態**：模型可用性 | [Preview](/docs/models/#preview) | [Preview](/docs/models/#preview) | [Stable](/docs/models/#stable) |

## 限制 {#limitations}

* **多影片提示**：目前不支援參照多部影片或跨多部影片進行推理。嘗試多影片提示可能導致模型效能下降或產生非預期的輸出。
* **語言支援**：完整支援英文（EN），但其他語言尚未經過評估，因此可能可用，但結果可能有所不同。
* **要求延遲**：最短 11 秒；最長 6 分鐘（尖峰時段）。
* **地區限制**：在 EU、UK、CH、MENA 地區，`allow_adult` 是
  `personGeneration` 唯一允許的值。
* **影片保留**：生成的影片會在伺服器上儲存 2 天，
  之後即會移除。若要保存本機副本，你必須在生成後
  2 天內下載影片。延伸後的影片會視為新生成的
  影片。
* **浮水印**：Veo 建立的影片會使用 [SynthID](https://deepmind.google/technologies/synthid/) 加上浮水印，這是我們用來為 AI 生成內容加上浮水印
  並加以識別的工具。影片可透過
  [SynthID](https://deepmind.google/science/synthid/) 驗證平台進行驗證。
* **安全性**：生成的影片會經過安全篩選器與
  記憶檢查流程，有助於降低隱私、著作權與
  偏見方面的風險。
* **音訊錯誤**：Veo 3.1 有時會因為安全篩選器或其他音訊處理問題，
  而阻擋影片生成。若你的影片被阻擋而無法生成，
  你不會被收費。

## Veo 提示詞指南 {#prompt-guide}

本節包含可使用 Veo 建立的影片範例，並示範
如何修改提示詞以產生不同的結果。

### 安全篩選器 {#safety-filters}

Veo 在整個 Gemini 中套用安全篩選器，以協助確保
生成的影片與上傳的照片不含冒犯性內容。
違反我們的[條款與指南](/docs/usage-policies/#abuse-monitoring)的提示詞會被阻擋。

### 提示詞撰寫基礎 {#basics}

好的提示詞應具備描述性且清晰明確。若要充分發揮 Veo 的能力，先找出
你的核心構想，再透過加入關鍵字與修飾詞來精煉構想，
並將影片專用術語融入提示詞中。

你的提示詞應包含以下元素：

* **主體**：你希望出現在影片中的物件、人物、動物或景色，
  例如 *cityscape*、*nature*、*vehicles* 或 *puppies*。
* **動作**：主體正在做的事（例如 *walking*、*running* 或
  *turning their head*）。
* **風格**：使用特定的電影
  風格關鍵字來指定創意方向，例如 *sci-fi*、*horror film*、*film noir*，或動畫
  風格如 *cartoon*。
* **攝影機位置與運動**：\[Optional\] 使用 *aerial view*、*eye-level*、*top-down shot*、
  *dolly shot* 或 *worms eye* 等詞彙，控制攝影機的位置
  與移動方式。
* **構圖**：\[Optional\] 鏡頭的取景方式，例如 *wide shot*、
  *close-up*、*single-shot* 或 *two-shot*。
* **焦點與鏡頭效果**：\[Optional\] 使用 *shallow focus*、
  *deep focus*、*soft focus*、*macro lens* 與 *wide-angle lens* 等詞彙，達成
  特定的視覺效果。
* **氛圍**：\[Optional\] 色彩與光線如何為場景增添氣氛，
  例如 *blue tones*、*night* 或 *warm tones*。

#### 撰寫提示詞的更多技巧 {#more-tips}

* **使用描述性語言**：使用形容詞與副詞，為 Veo
  描繪出清晰的畫面。
* **強化臉部細節**：將
  臉部細節指定為畫面的焦點，例如在
  提示詞中使用 *portrait* 一詞。

*如需更完整的提示詞策略，請參閱[提示詞設計簡介](/docs/prompting-strategies/)。*

### 為音訊撰寫提示詞 {#audio}

你可以為 Veo 提供音效、環境噪音與對話的提示。
模型會捕捉這些提示的細微差別，生成同步的配樂。

* **對話**：使用引號標示特定的台詞。（範例："This must be the
  key," he murmured.）
* **音效（SFX）**：明確描述聲音。（範例：tires
  screeching loudly, engine roaring.）
* **環境噪音**：描述環境的聲音景觀。（範例：A faint,
  eerie hum resonates in the background.）

以下影片以漸增的細節程度，示範如何為 Veo 3 的音訊生成撰寫提示詞。

| 提示詞 | 生成結果 |
| :--- | :--- |
| **較多細節（對話與氛圍）** A wide shot of a misty Pacific Northwest forest. Two exhausted hikers, a man and a woman, push through ferns when the man stops abruptly, staring at a tree. Close-up: Fresh, deep claw marks are gouged into the tree's bark. Man: (Hand on his hunting knife) "That's no ordinary bear." Woman: (Voice tight with fear, scanning the woods) "Then what is it?" A rough bark, snapping twigs, footsteps on the damp earth. A lone bird chirps. |  |
| **較少細節（對話）** Paper Cut-Out Animation. New Librarian: "Where do you keep the forbidden books?" Old Curator: "We don't. They keep us." |  |

[試用 Veo](https://deepmind.google/models/veo/)

### 搭配參考圖片撰寫提示詞 {#use-reference-images}

你可以使用一張或多張圖片作為輸入，透過 Veo 的[圖片轉影片](/docs/veo/#generate-from-images)
功能，引導生成的影片。Veo 會將輸入圖片用作初始影格。選擇
一張最接近你心中影片第一個場景的圖片，即可讓日常物件動起來、
讓圖畫與繪畫栩栩如生，並為自然景色加入動作與聲音。

| 提示詞 | 生成結果 |
| :--- | :--- |
| **輸入圖片（由 Nano Banana 生成）** A hyperrealistic macro photo of tiny, miniature surfers riding ocean waves inside a rustic stone bathroom sink. A vintage brass faucet is running, creating the perpetual surf. Surreal, whimsical, bright natural lighting. |  |
| **輸出影片（由 Veo 3.1 生成）** A surreal, cinematic macro video. Tiny surfers ride perpetual, rolling waves inside a stone bathroom sink. A running vintage brass faucet generates the endless surf. The camera slowly pans across the whimsical, sunlit scene as the miniature figures expertly carve the turquoise water. |  |

Veo 3.1 可讓你[參照圖片](/docs/veo/#reference-images)或
素材，來引導生成
影片的內容。提供最多三張單一人物、角色或產品的素材圖片。Veo 會在輸出影片中保留主體的外觀。

| 提示詞 | 生成結果 |
| :--- | :--- |
| **參考圖片（由 Nano Banana 生成）** A deep sea angler fish lurks in the deep dark water, teeth bared and bait glowing. |  |
| **參考圖片（由 Nano Banana 生成）** A pink child's princess costume complete with a wand and tiara, on a plain product background. |  |
| **輸出影片（由 Veo 3.1 生成）** Create a silly cartoon version of the fish wearing the costume, swimming and waving the wand around. |  |

使用 Veo 3.1，你也可以指定影片的[第一個與最後一個影格](/docs/veo/#using-first-and-last-video-frames)來生成影片。

| 提示詞 | 生成結果 |
| :--- | :--- |
| **第一張圖片（由 Nano Banana 生成）** A high quality photorealistic front image of a ginger cat driving a red convertible racing car on the French riviera coast. |  |
| **最後一張圖片（由 Nano Banana 生成）** Show what happens when the car takes off from a cliff. |  |
| **輸出影片（由 Veo 3.1 生成）** Optional |  |

這項功能讓你定義起始與結束影格，從而精確掌控
鏡頭的構圖。上傳圖片或使用先前影片生成的影格，
確保場景完全按照你的構想開始與結束。

### 為延伸撰寫提示詞 {#extend-prompt}

若要使用 Veo 3.1 [延伸](/docs/veo/#extending-veo-videos)你以 Veo 生成的
影片（Veo 3.1 Lite 不提供此功能），請將該影片作為輸入，並可搭配選用的文字提示詞。延伸會以影片的最後 1 秒或 24 個影格為基礎，接續其動作。

請注意，若聲音未出現在影片的最後 1 秒內，便無法有效延伸聲音。

| 提示詞 | 生成結果 |
| :--- | :--- |
| **輸入影片（由 Veo 3.1 生成）** The paraglider takes off from the top of the mountain and starts gliding down the mountains overlooking the flower covered valleys below. |  |
| **輸出影片（由 Veo 3.1 生成）** Extend this video with the paraglider slowly descending. |  |

### 提示詞與輸出範例 {#examples}

本節呈現數個提示詞，說明描述性細節如何
提升每部影片的成果品質。

#### 冰柱 {#icicles}

這部影片示範如何在提示詞中運用
[提示詞撰寫基礎](/docs/veo/#basics)的元素。

| 提示詞 | 生成結果 |
| :--- | :--- |
| Close up shot (composition) of melting icicles (subject) on a frozen rock wall (context) with cool blue tones (ambiance), zoomed in (camera motion) maintaining close-up detail of water drips (action). |  |

#### 講電話的男子 {#man-on-the-phone}

以下影片示範如何以漸增的具體細節修改提示詞，讓 Veo 將輸出精煉至符合你的喜好。

| 提示詞 | 生成結果 |
| :--- | :--- |
| **較少細節** The camera dollies to show a close up of a desperate man in a green trench coat. He's making a call on a rotary-style wall phone with a green neon light. It looks like a movie scene. |  |
| **較多細節** A close-up cinematic shot follows a desperate man in a weathered green trench coat as he dials a rotary phone mounted on a gritty brick wall, bathed in the eerie glow of a green neon sign. The camera dollies in, revealing the tension in his jaw and the desperation etched on his face as he struggles to make the call. The shallow depth of field focuses on his furrowed brow and the black rotary phone, blurring the background into a sea of neon colors and indistinct shadows, creating a sense of urgency and isolation. |  |

#### Snow leopard {#snow-leopard}

| 提示詞 | 生成結果 |
| :--- | :--- |
| **簡單提示詞**： A cute creature with snow leopard-like fur is walking in winter forest, 3D cartoon style render. |  |
| **詳細提示詞**： Create a short 3D animated scene in a joyful cartoon style. A cute creature with snow leopard-like fur, large expressive eyes, and a friendly, rounded form happily prances through a whimsical winter forest. The scene should feature rounded, snow-covered trees, gentle falling snowflakes, and warm sunlight filtering through the branches. The creature's bouncy movements and wide smile should convey pure delight. Aim for an upbeat, heartwarming tone with bright, cheerful colors and playful animation. |  |

### 依撰寫元素分類的範例 {#element-examples}

以下範例示範如何依各個基本元素精煉提示詞。

#### 主體與情境 {#subject}

指定主要焦點（主體）以及背景或環境（情境）。

| 提示詞 | 生成結果 |
| :--- | :--- |
| An architectural rendering of a white concrete apartment building with flowing organic shapes, seamlessly blending with lush greenery and futuristic elements |  |
| A satellite floating through outer space with the moon and some stars in the background. |  |

#### 動作 {#action}

指定主體正在做的事（例如走路、跑步或轉頭）。

| 提示詞 | 生成結果 |
| :--- | :--- |
| A wide shot of a woman walking along the beach, looking content and relaxed towards the horizon at sunset. |  |

#### 風格 {#style}

加入關鍵字，將生成結果導向特定的美學風格（例如超現實、復古、未來感、黑色電影）。

| 提示詞 | 生成結果 |
| :--- | :--- |
| Film noir style, man and woman walk on the street, mystery, cinematic, black and white. |  |

#### 攝影機運動與構圖 {#camera-motion}

指定攝影機的移動方式（POV 鏡頭、空拍視角、追蹤無人機視角），以及鏡頭的取景方式（廣角鏡頭、特寫、低角度）。

| 提示詞 | 生成結果 |
| :--- | :--- |
| A POV shot from a vintage car driving in the rain, Canada at night, cinematic. |  |
| Extreme close-up of a an eye with city reflected in it. |  |

#### 氛圍 {#ambiance}

色彩搭配與光線會影響氛圍。試試「muted orange
warm tones」、「natural light」、「sunrise」或「cool blue tones」等詞彙。

| 提示詞 | 生成結果 |
| :--- | :--- |
| A close-up of a girl holding adorable golden retriever puppy in the park, sunlight. |  |
| Cinematic close-up shot of a sad woman riding a bus in the rain, cool blue tones, sad mood. |  |

### 長寬比 {#aspect-ratios}

Veo 可讓你指定影片的長寬比。

| 提示詞 | 生成結果 |
| :--- | :--- |
| **寬螢幕 (16:9)** Create a video with a tracking drone view of a man driving a red convertible car in Palm Springs, 1970s, warm sunlight, long shadows. |  |
| **直向 (9:16)** Create a video highlighting the smooth motion of a majestic Hawaiian waterfall within a lush rainforest. Focus on realistic water flow, detailed foliage, and natural lighting to convey tranquility. Capture the rushing water, misty atmosphere, and dappled sunlight filtering through the dense canopy. Use smooth, cinematic camera movements to showcase the waterfall and its surroundings. Aim for a peaceful, realistic tone, transporting the viewer to the serene beauty of the Hawaiian rainforest. |  |

## 模型版本 {#model-versions}

如需更多 Veo 模型專屬的使用詳情，請參閱[定價](/docs/pricing/)頁面與
[速率限制](https://aistudio.google.com/rate-limit)。


=== "Code"


    | 屬性 | 說明 |
    | --- | --- |
    | 模型代碼 | **Gemini API** `veo-3.1-generate-preview` |
    | 支援的資料類型 | **Input** 文字、圖片 **Output** 含音訊的影片 |
    | 限制 | **Text input** 1,024 個權杖 **Output video** 1 |
    | 最新更新 | 2026 年 1 月 |

=== "Code"


    | 屬性 | 說明 |
    | --- | --- |
    | 模型代碼 | **Gemini API** `veo-3.1-fast-generate-preview` |
    | 支援的資料類型 | **Input** 文字、圖片 **Output** 含音訊的影片 |
    | 限制 | **Text input** 1,024 個權杖 **Output video** 1 |
    | 最新更新 | 2026 年 1 月 |

=== "Code"


    | 屬性 | 說明 |
    | --- | --- |
    | 模型代碼 | **Gemini API** `veo-3.1-lite-generate-preview` |
    | 支援的資料類型 | **Input** 文字、圖片 **Output** 含音訊的影片 |
    | 限制 | **Text input** 1,024 個權杖 **Output video** 1 |
    | 最新更新 | 2026 年 3 月 |

=== "Code"


    | 屬性 | 說明 |
    | --- | --- |
    | 模型代碼 | **Gemini API** `veo-3.0-generate-001` |
    | 支援的資料類型 | **Input** 文字、圖片 **Output** 含音訊的影片 |
    | 限制 | **Text input** 1,024 個權杖 **Output video** 1 |
    | 最新更新 | 2025 年 7 月 |

=== "Code"


    | 屬性 | 說明 |
    | --- | --- |
    | 模型代碼 | **Gemini API** `veo-3.0-fast-generate-001` |
    | 支援的資料類型 | **Input** 文字、圖片 **Output** 含音訊的影片 |
    | 限制 | **Text input** 1,024 個權杖 **Output video** 1 |
    | 最新更新 | 2025 年 7 月 |


Veo Fast 版本讓開發人員能在維持
高品質的同時生成含聲音的影片，並針對速度與商業使用案例進行最佳化。這類版本非常適合以程式方式生成廣告的後端服務、用於快速 A/B 測試創意概念的工具，或需要迅速製作社群媒體內容的應用程式。

## 後續步驟 {#whats-next}

* 先在 [Veo Quickstart Colab](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_Veo.ipynb)
  與 [Veo 3.1 applet](https://aistudio.google.com/apps/bundled/veo_studio) 中動手試用，開始使用 Veo 3.1 API。

* 透過我們的[提示詞設計簡介](/docs/prompting-strategies/)，瞭解如何撰寫更出色的提示詞。


