# 影片理解

如要瞭解影片生成，請參閱 [Gemini Omni Flash](/docs/omni/) 指南。

Gemini 模型可以處理影片，讓許多過去需要專門領域模型才能實現的前沿開發者應用案例成為可能。Gemini 的部分視覺能力包括：描述影片、將影片分段、從影片中擷取資訊、回答與影片內容有關的問題，以及指出影片中的特定時間戳記。

你可以透過下列方式將影片提供給 Gemini 作為輸入：

| 輸入方式 | 大小上限 | 建議應用案例 |
| :--- | :--- | :--- |
| [File API](/docs/video-understanding/#upload-video) | 20GB（付費）/ 2GB（免費） | 大型檔案（100MB 以上）、長影片（10 分鐘以上）、可重複使用的檔案。 |
| [Cloud Storage Registration](/docs/file-input-methods/#registration) | 2GB（每個檔案，無儲存空間上限） | 大型檔案（100MB 以上）、長影片（10 分鐘以上）、可長期保存且可重複使用的檔案。 |
| [Inline Data](/docs/video-understanding/#inline-video) | < 100MB | 小型檔案（<100MB）、時間短（<1 分鐘）、一次性輸入。 |
| [YouTube URLs](/docs/video-understanding/#youtube) | 不適用 | 公開的 YouTube 影片。 |


!!! note " "

      多數應用案例都建議使用 [File API](/docs/video-understanding/#upload-video)，尤其是檔案大於 100MB，或想在多個要求中重複使用同一個檔案時。


如要瞭解其他檔案輸入方式，例如使用外部 URL 或儲存在 Google Cloud 中的檔案，請參閱 [File input methods](/docs/file-input-methods/) 指南。

### 上傳影片檔案 {#upload-video}

下列程式碼會下載範例影片，使用 [Files API](/docs/files/) 上傳，等待處理完成，然後使用上傳後的檔案參照來摘要這部影片。


=== "Python"

      ```python
      from google import genai
      import time

      client = genai.Client()

      myfile = client.files.upload(file="path/to/sample.mp4")

      while not myfile.state or myfile.state.name != "ACTIVE":
          print("Processing video...")
          time.sleep(5)
          myfile = client.files.get(name=myfile.name)

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "video", "uri": myfile.uri, "mime_type": myfile.mime_type},
              {"type": "text", "text": "Summarize this video. Then create a quiz with an answer key based on the information in this video."}
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
          file: "path/to/sample.mp4",
          config: { mimeType: "video/mp4" },
        });

        let getFile = await ai.files.get({ name: myfile.name || '' });
        while (getFile.state === 'PROCESSING') {
            getFile = await ai.files.get({ name: myfile.name || '' });
            console.log(`current file status: ${getFile.state}`);
            console.log('File is still processing, retrying in 5 seconds');

            await new Promise((resolve) => {
                setTimeout(resolve, 5000);
            });
        }
        if (getFile.state === 'FAILED') {
            throw new Error('File processing failed.');
        }

        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: [
            { type: "video", uri: myfile.uri, mime_type: myfile.mimeType },
            { type: "text", text: "Summarize this video. Then create a quiz with an answer key based on the information in this video." }
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
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.VideoContent;
      import com.google.genai.gaos.models.interactions.VideoContentMimeType;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.File;
      import com.google.genai.types.FileState;
      import com.google.genai.types.UploadFileConfig;
      import java.util.Arrays;
      import java.util.List;

      Client client = new Client();

      File myfile =
          client.files.upload(
              "path/to/sample.mp4", UploadFileConfig.builder().mimeType("video/mp4").build());

      while (!myfile.state().isPresent()
          || myfile.state().get().knownEnum() != FileState.Known.ACTIVE) {
        System.out.println("Processing video...");
        Thread.sleep(5000);
        myfile = client.files.get(myfile.name().get(), null);
      }

      Content videoContent =
          VideoContent.builder()
              .uri(myfile.uri().get())
              .mimeType(VideoContentMimeType.of(myfile.mimeType().get()))
              .build();
      Content textContent =
          TextContent.builder()
              .text(
                  "Summarize this video. Then create a quiz with an answer key based on the information in this video.")
              .build();

      List<Content> contents = Arrays.asList(videoContent, textContent);

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

          myfile, err := client.Files.UploadFromPath(ctx, "path/to/sample.mp4", &genai.UploadFileConfig{
              MIMEType: "video/mp4",
          })
          if err != nil {
              log.Fatal(err)
          }

          for myfile.State != genai.FileStateActive {
              fmt.Println("Processing video...")
              time.Sleep(5 * time.Second)
              myfile, err = client.Files.Get(ctx, myfile.Name, nil)
              if err != nil {
                  log.Fatal(err)
              }
          }

          contents := []interactions.Content{
              interactions.NewContent(interactions.VideoContent{
                  URI:      genai.Ptr(myfile.URI),
                  MimeType: interactions.VideoContentMimeType(myfile.MIMEType).ToPointer(),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: "Summarize this video. Then create a quiz with an answer key based on the information in this video.",
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput(contents),
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
      VIDEO_PATH="path/to/sample.mp4"
      MIME_TYPE=$(file -b --mime-type "${VIDEO_PATH}")
      NUM_BYTES=$(wc -c < "${VIDEO_PATH}")
      DISPLAY_NAME=VIDEO

      tmp_header_file=upload-header.tmp

      echo "Starting file upload..."
      curl "https://generativelanguage.googleapis.com/upload/v1beta/files" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -D ${tmp_header_file} \
      -H "X-Goog-Upload-Protocol: resumable" \
      -H "X-Goog-Upload-Command: start" \
      -H "X-Goog-Upload-Header-Content-Length: ${NUM_BYTES}" \
      -H "X-Goog-Upload-Header-Content-Type: ${MIME_TYPE}" \
      -H "Content-Type: application/json" \
      -d "{'file': {'display_name': '${DISPLAY_NAME}'}}" 2> /dev/null

      upload_url=$(grep -i "x-goog-upload-url: " "${tmp_header_file}" | cut -d" " -f2 | tr -d "\r")
      rm "${tmp_header_file}"

      echo "Uploading video data..."
      curl "${upload_url}" \
      -H "Content-Length: ${NUM_BYTES}" \
      -H "X-Goog-Upload-Offset: 0" \
      -H "X-Goog-Upload-Command: upload, finalize" \
      --data-binary "@${VIDEO_PATH}" 2> /dev/null > file_info.json

      file_uri=$(jq -r ".file.uri" file_info.json)
      file_name=$(jq -r ".file.name" file_info.json)
      echo file_uri=$file_uri

      echo "File uploaded successfully. File URI: ${file_uri}"

      echo "Waiting for file to be processed..."
      while true; do
      curl -s "https://generativelanguage.googleapis.com/v1beta/${file_name}" \
        -H "x-goog-api-key: $GEMINI_API_KEY" > file_status.json
      state=$(jq -r ".state" file_status.json)
      echo "Current state: $state"
      if [ "$state" == "ACTIVE" ]; then
        break
      elif [ "$state" == "FAILED" ]; then
        echo "File processing failed."
        exit 1
      fi
      sleep 5
      done

      echo "Generating content from video..."
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {"type": "video", "uri": "'${file_uri}'", "mime_type": "'${MIME_TYPE}'"},
            {"type": "text", "text": "Summarize this video. Then create a quiz with an answer key based on the information in this video."}
          ]
        }' 2> /dev/null > response.json

      jq ".steps[].content[0].text" response.json
      ```

=== "CLI"

      ```bash
      FILE=$(gemini-api files upload path/to/sample.mp4 --wait)
      gemini-api analyze "Summarize this video. Then create a quiz with an answer key based on the information in this video." \
        -i "$FILE"
      ```


若要最佳化 token 效率與效能，可以考慮使用 [Agentic video processing](/docs/video-understanding/#agentic-video-understanding)。

當要求總大小（包含檔案、文字提示詞、系統指令等）大於 20 MB、影片時間較長，或打算在多個提示詞中使用同一部影片時，請一律使用 Files API。File API 可直接接受影片檔案格式。

如要進一步瞭解如何處理媒體檔案，請參閱 [Files API](/docs/files/)。

### 以行內方式傳遞影片資料 {#inline-video}

除了使用 File API 上傳影片檔案，你也可以在要求中直接傳遞較小的影片。這適用於要求總大小在 20MB 以下的較短影片。

以下範例示範如何提供行內影片資料：


=== "Python"

      ```python
      from google import genai
      import base64

      video_file_name = "/path/to/your/video.mp4"
      video_bytes = open(video_file_name, 'rb').read()

      client = genai.Client()
      interaction = client.interactions.create(
          model='gemini-4-hydrogen',
          input=[
              {"type": "text", "text": "Please summarize the video in 3 sentences."},
              {
                  "type": "video",
                  "data": base64.b64encode(video_bytes).decode('utf-8'),
                  "mime_type": "video/mp4"
              }
          ]
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      const ai = new GoogleGenAI({});
      const base64VideoFile = fs.readFileSync("path/to/small-sample.mp4", {
        encoding: "base64",
      });

      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: [
          { type: "text", text: "Please summarize the video in 3 sentences." },
          {
            type: "video",
            data: base64VideoFile,
            mime_type: "video/mp4",
          }
        ],
      });
      console.log(interaction.output_text);
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
      import com.google.genai.gaos.models.interactions.VideoContentMimeType;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      String videoFileName = "/path/to/your/video.mp4";
      byte[] videoBytes = Files.readAllBytes(Paths.get(videoFileName));
      String base64Video = Base64.getEncoder().encodeToString(videoBytes);

      Client client = new Client();

      Content textContent =
          TextContent.builder().text("Please summarize the video in 3 sentences.").build();
      Content videoContent =
          VideoContent.builder()
              .data(base64Video)
              .mimeType(VideoContentMimeType.VIDEO_MP4)
              .build();

      List<Content> contents = Arrays.asList(textContent, videoContent);

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

          videoFileName := "/path/to/your/video.mp4"
          videoBytes, err := os.ReadFile(videoFileName)
          if err != nil {
              log.Fatal(err)
          }
          base64Video := base64.StdEncoding.EncodeToString(videoBytes)

          contents := []interactions.Content{
              interactions.NewContent(interactions.TextContent{
                  Text: "Please summarize the video in 3 sentences.",
              }),
              interactions.NewContent(interactions.VideoContent{
                  Data:     genai.Ptr(base64Video),
                  MimeType: interactions.VideoContentMimeTypeVideoMp4.ToPointer(),
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput(contents),
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


    !!! note " "

          注意：如果你收到 `Argument list too long` 錯誤，可能是檔案的 base64 編碼太長，無法放進 curl 指令列。較大的檔案請改用 File API 方法。


      ```shell
      VIDEO_PATH=/path/to/your/video.mp4

      if [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
      B64FLAGS="--input"
      else
      B64FLAGS="-w0"
      fi

      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {"type": "text", "text": "Please summarize the video in 3 sentences."},
            {
              "type": "video",
              "data": "'$(base64 $B64FLAGS $VIDEO_PATH)'",
              "mime_type": "video/mp4"
            }
          ]
        }' 2> /dev/null
      ```

=== "CLI"

      ```bash
      gemini-api analyze "Please summarize the video in 3 sentences." -i /path/to/your/video.mp4
      ```


### 傳遞 YouTube URL {#youtube}


!!! note " "

      預覽：YouTube URL 功能目前為預覽版，免費提供。定價與速率限制可能會變更。


你可以將 YouTube URL 直接傳遞給 Gemini API，作為要求的一部分，方法如下：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()
      interaction = client.interactions.create(
          model='gemini-4-hydrogen',
          input=[
              {"type": "text", "text": "Please summarize the video in 3 sentences."},
              {
                  "type": "video",
                  "uri": "https://www.youtube.com/watch?v=9hE5-98ZeCg"
              }
          ]
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: [
          { type: "text", text: "Please summarize the video in 3 sentences." },
          {
            type: "video",
            uri: "https://www.youtube.com/watch?v=9hE5-98ZeCg",
          }
        ],
      });
      console.log(interaction.output_text);
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
      import java.util.Arrays;
      import java.util.List;

      Client client = new Client();

      Content textContent =
          TextContent.builder().text("Please summarize the video in 3 sentences.").build();
      Content videoContent =
          VideoContent.builder()
              .uri("https://www.youtube.com/watch?v=9hE5-98ZeCg")
              .build();

      List<Content> contents = Arrays.asList(textContent, videoContent);

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

          contents := []interactions.Content{
              interactions.NewContent(interactions.TextContent{
                  Text: "Please summarize the video in 3 sentences.",
              }),
              interactions.NewContent(interactions.VideoContent{
                  URI: genai.Ptr("https://www.youtube.com/watch?v=9hE5-98ZeCg"),
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput(contents),
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
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {"type": "text", "text": "Please summarize the video in 3 sentences."},
            {
              "type": "video",
              "uri": "https://www.youtube.com/watch?v=9hE5-98ZeCg"
            }
          ]
        }' 2> /dev/null
      ```

=== "CLI"

      ```bash
      gemini-api analyze "Please summarize the video in 3 sentences." \
        -i "https://www.youtube.com/watch?v=9hE5-98ZeCg"
      ```


**限制**：

* 免費層級每天上傳的 YouTube 影片總長度不得超過 8 小時。
* 付費層級不依影片長度設限。
* Gemini 2.5 之前的模型，每個要求只能上傳 1 部影片；Gemini 2.5 及後續模型，每個要求最多可上傳 10 部影片。
* 只能上傳公開影片（不能是私人或不公開影片）。

## 代理式影片理解 {#agentic-video-understanding}

預設情況下，所有模型（包括 Gemini 4）的影片輸入都使用靜態處理（以 1 FPS 擷取影格）。Gemini 4 Carbon、Gemini 4 Argon、Gemini 4 Neon、Gemini 4 Hydrogen、3.8 Flash、3.6 Flash 與 3.5 Flash Lite 模型也支援**代理式影片理解**；這是一種可選擇啟用的模式，模型會依提示詞動態探索影片時間軸、選擇性檢視字幕稿，並即時調整影格率與解析度。

| **模式** | **說明** | **支援的模型** |
| --- | --- | --- |
| **Static**（預設） | 以固定速率（1 FPS）擷取影格，一次全部放入上下文。所有 Gemini 模型（包括 Gemini 4）的預設模式。 | 所有 Gemini 模型 |
| **Agentic** | 模型會依提示詞動態瀏覽影片時間軸，只載入需要的內容。處理長篇內容時，token 效率最高可提升 88%，品質約高出 7%。 | Gemini 4 Carbon、Gemini 4 Argon、Gemini 4 Neon、Gemini 4 Hydrogen、3.8 Flash、3.6 Flash、3.5 Flash Lite |

### 選擇處理模式 {#when-to-use}

請依影片長度與查詢類型選擇合適的處理模式：

- **Static（預設）**：最適合短片（5 分鐘以下）、整部影片都相關的廣泛全片摘要、對延遲敏感的查詢，或需要全片逐格精確度的情況。對於短片，或需要檢視大部分影片的廣泛提示詞，靜態處理可避免時間軸瀏覽所產生的額外思考 token（`total_thought_tokens`）與工具呼叫往返（`total_tool_use_tokens`）。
- **Agentic**：最適合長篇影片（超過 5 到 10 分鐘）、大海撈針式的檢索，或針對特定時刻或主題的查詢。模型會先檢視字幕稿，僅在需要時載入相關的視覺片段，在不塞滿上下文視窗的情況下，最多可減少 88% 的影片輸入 token 用量。


!!! note " "

      對於代理式處理需要較多時間的長影片或複雜提示詞，請使用串流或[背景執行](/docs/background-execution/)。這樣可以保持連線、顯示中間的推理步驟，並避免連線或驗證逾時。


### 設定處理模式 {#set-processing-mode}

如要使用代理式影片理解，請在 `input` 陣列的影片部分設定 `"processing": "agentic"`。

代理式影片處理在長影片上可能需要較多時間，因為模型會多次檢視以瀏覽時間軸。為避免網路連線中斷時遺失進度，下列範例使用 `background` 參數，在伺服器上以非同步方式執行工作。你也可以省略 `background` 參數，同步執行要求，這種方式很適合較短的影片。

如要瞭解輪詢、擷取結果與管理背景工作的詳細資訊，請參閱[背景執行](/docs/background-execution/)指南。


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client()

      # Upload a long video
      video_file = client.files.upload(file="path/to/lecture.mp4")

      while video_file.state.name == "PROCESSING":
          time.sleep(2)
          video_file = client.files.get(name=video_file.name)

      # Use agentic processing with background execution
      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {
                  "type": "video",
                  "uri": video_file.uri,
                  "mime_type": video_file.mime_type,
                  "processing": "agentic"
              },
              {"type": "text", "text": "What are the three main arguments presented?"}
          ],
          background=True,
      )

      while interaction.status == "in_progress":
          time.sleep(5)
          interaction = client.interactions.get(interaction.id)

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      // Upload a long video
      let videoFile = await ai.files.upload({
        file: "path/to/lecture.mp4",
        config: { mimeType: "video/mp4" }
      });

      while (videoFile.state === "PROCESSING") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        videoFile = await ai.files.get({ name: videoFile.name || '' });
      }

      // Use agentic processing with background execution
      let interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: [
          {
            type: "video",
            uri: videoFile.uri,
            mime_type: videoFile.mimeType,
            processing: "agentic"
          },
          { type: "text", text: "What are the three main arguments presented?" }
        ],
        background: true,
      });

      while (interaction.status === "in_progress") {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        interaction = await ai.interactions.get(interaction.id);
      }

      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      # 1. Start the interaction in the background
      interaction=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {
              "type": "video",
              "uri": "'${file_uri}'",
              "mime_type": "video/mp4",
              "processing": "agentic"
            },
            {"type": "text", "text": "What are the three main arguments presented?"}
          ],
          "background": true
        }')

      id=$(echo "$interaction" | jq -r '.id')

      # 2. Poll until the interaction finishes
      while [ "$(echo "$interaction" | jq -r '.status')" = "in_progress" ]; do
        sleep 5
        interaction=$(curl -s "https://generativelanguage.googleapis.com/v1beta/interactions/$id" \
          -H "x-goog-api-key: $GEMINI_API_KEY")
      done

      echo "$interaction" | jq '.'
      ```

=== "CLI"

      ```bash
      FILE=$(gemini-api files upload path/to/lecture.mp4 --wait)
      ID=$(gemini-api agent run -m gemini-4-hydrogen --background --stream=false --jq '.id' --body '{"input": [
        {"type": "video", "uri": "'"$FILE"'", "processing": "agentic"},
        {"type": "text", "text": "What are the three main arguments presented?"}
      ]}')
      gemini-api agent status "$ID" --stream
      ```


!!! note " "

      如要確認是否使用了代理式處理，請檢視 `interaction.steps`。若其中出現 `processing_call` 與 `processing_result`，即表示模型曾動態瀏覽影片。


### 回應步驟 {#response-steps}

代理式處理會在 `steps` 陣列中加入兩種新的步驟類型：

* `processing_call`：模型要求載入某個影片片段或音訊字幕稿，以 `id` 標識。
* `processing_result`：該次載入的結果，以 `call_id` 與要求對應。

這些步驟會與 `thought` 步驟交錯出現（啟用摘要時），並排在最後的 `model_output` 步驟之前。它們可用於在你的 UI 中顯示進度追蹤，但不需要回應。

下列範例顯示交錯著處理步驟的回應酬載：

```json
{
  "steps": [
    {
      "type": "thought",
      "signature": "sig_thought_1",
      "summary": [
        {
          "type": "text",
          "text": "Inspecting transcript for key discussion topics..."
        }
      ]
    },
    {
      "type": "processing_call",
      "id": "call_01",
      "signature": "sig_call_01"
    },
    {
      "type": "processing_result",
      "call_id": "call_01",
      "signature": "sig_result_01"
    },
    {
      "type": "thought",
      "signature": "sig_thought_2",
      "summary": [
        {
          "type": "text",
          "text": "Loading visual frames to verify slide content..."
        }
      ]
    },
    {
      "type": "processing_call",
      "id": "call_02",
      "signature": "sig_call_02"
    },
    {
      "type": "processing_result",
      "call_id": "call_02",
      "signature": "sig_result_02"
    },
    {
      "type": "thought",
      "signature": "sig_thought_3",
      "summary": [
        {
          "type": "text",
          "text": "Synthesizing answer from gathered evidence..."
        }
      ]
    },
    {
      "type": "model_output",
      "content": [
        {
          "type": "text",
          "text": "The three main arguments presented in the lecture are..."
        }
      ]
    }
  ]
}
```

### 在多部影片間混用處理模式 {#mix-processing-modes}

在同一個要求中，為每部影片設定不同的處理模式：


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client()

      lecture = client.files.upload(file="path/to/long-lecture.mp4")
      experiment = client.files.upload(file="path/to/short-experiment.mp4")

      # Use agentic processing with background execution
      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {
                  "type": "video",
                  "uri": lecture.uri,
                  "mime_type": lecture.mime_type,
                  "processing": "agentic"  # Use agentic video understanding
              },
              {
                  "type": "video",
                  "uri": experiment.uri,
                  "mime_type": experiment.mime_type,
                  "processing": "static"  # Use static processing
              },
              {"type": "text", "text": "Compare the lecture content with the experiment results."}
          ],
          background=True,
      )

      while interaction.status == "in_progress":
          time.sleep(5)
          interaction = client.interactions.get(interaction.id)

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const lecture = await ai.files.upload({
        file: "path/to/long-lecture.mp4",
        config: { mimeType: "video/mp4" }
      });
      const experiment = await ai.files.upload({
        file: "path/to/short-experiment.mp4",
        config: { mimeType: "video/mp4" }
      });

      // Use agentic processing with background execution
      let interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: [
          {
            type: "video",
            uri: lecture.uri,
            mime_type: lecture.mimeType,
            processing: "agentic" // Use agentic video understanding
          },
          {
            type: "video",
            uri: experiment.uri,
            mime_type: experiment.mimeType,
            processing: "static" // Use static processing
          },
          { type: "text", text: "Compare the lecture content with the experiment results." }
        ],
        background: true,
      });

      while (interaction.status === "in_progress") {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        interaction = await ai.interactions.get(interaction.id);
      }

      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      # 1. Start the interaction in the background
      interaction=$(curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {
              "type": "video",
              "uri": "'${lecture_uri}'",
              "mime_type": "video/mp4",
              "processing": "agentic"
            },
            {
              "type": "video",
              "uri": "'${experiment_uri}'",
              "mime_type": "video/mp4",
              "processing": "static"
            },
            {"type": "text", "text": "Compare the lecture content with the experiment results."}
          ],
          "background": true
        }')

      id=$(echo "$interaction" | jq -r '.id')

      # 2. Poll until the interaction finishes
      while [ "$(echo "$interaction" | jq -r '.status')" = "in_progress" ]; do
        sleep 5
        interaction=$(curl -s "https://generativelanguage.googleapis.com/v1beta/interactions/$id" \
          -H "x-goog-api-key: $GEMINI_API_KEY")
      done

      echo "$interaction" | jq '.'
      ```


### 多輪影片對話 {#multi-turn-video}

影片上下文會在對話的各輪之間保留。使用代理式處理時：

- **有狀態模式**（使用 `previous_interaction_id`）：伺服器會保留影片上下文，不需要額外處理。
- **無狀態模式**（使用 `step_list`）：在無狀態模式下，回應會包含 `processing_call` 與 `processing_result` 步驟，其中編碼了影片上下文。你必須將回應中的所有步驟都納入下一個要求的 `step_list`，才能保留影片上下文。省略這些步驟目前不會造成 API 錯誤，但影片上下文會遺失，後續問題的回應品質會大幅降低。請注意，在後續要求中送出的回傳步驟會計入輸入 token 數量。

## 在內容中指出時間戳記 {#refer-timestamps}

你可以使用 `MM:SS` 形式的時間戳記，詢問影片中特定時間點的問題。


=== "Python"

      ```python
      prompt = "What are the examples given at 00:05 and 00:10 supposed to show us?"
      ```

=== "JavaScript"

      ```javascript
      const prompt = "What are the examples given at 00:05 and 00:10 supposed to show us?";
      ```

=== "Java"

      ```java
      String prompt = "What are the examples given at 00:05 and 00:10 supposed to show us?";
      ```

=== "Go"

      ```go
      prompt := "What are the examples given at 00:05 and 00:10 supposed to show us?"
      ```

=== "REST"

      ```shell
      PROMPT="What are the examples given at 00:05 and 00:10 supposed to show us?"
      ```


## 從影片中擷取詳細深入分析 {#transcribe-video}

Gemini 模型能同時處理**音訊與視覺**串流中的資訊，提供強大的影片內容理解能力，讓你可以擷取豐富的細節，包括產生影片內容的描述，以及回答與內容有關的問題。

在視覺描述方面，模型會以**每秒 1 個影格**（FPS）的速率取樣影片。這個預設取樣率適用於多數內容，但請注意，動作快速或場景切換頻繁的影片可能會遺漏部分細節。


=== "Python"

      ```python
      prompt = "Describe the key events in this video, providing both audio and visual details. Include timestamps for salient moments."
      ```

=== "JavaScript"

      ```javascript
      const prompt = "Describe the key events in this video, providing both audio and visual details. Include timestamps for salient moments.";
      ```

=== "Java"

      ```java
      String prompt =
          "Describe the key events in this video, providing both audio and visual details. Include timestamps for salient moments.";
      ```

=== "Go"

      ```go
      prompt := "Describe the key events in this video, providing both audio and visual details. Include timestamps for salient moments."
      ```

=== "REST"

      ```shell
      PROMPT="Describe the key events in this video, providing both audio and visual details. Include timestamps for salient moments."
      ```


## 自訂影片處理 {#customize-video-processing}

在 `"static"` 模式下，你可以剪輯影片區間、設定自訂影格取樣率（`fps` 介於 `(0, 24]` 之間），並選擇 `content_layers`。Gemini 只會針對剪輯後的區間與選取的圖層收取 token 費用。

### 設定剪輯區間 {#clipping-intervals}

請將 `start_offset` 與 `end_offset` 以秒為單位、以 `"s"` 結尾的字串指定（例如 `"1200s"` 或 `"10.5s"`）。超過影片長度的 `end_offset` 會箝制為影片結尾。超過影片長度的 `start_offset` 會回傳 `400 INVALID_ARGUMENT`。


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {
                  "type": "video",
                  "uri": video_file.uri,
                  "mime_type": video_file.mime_type,
                  "processing": {
                      "type": "static",
                      "start_offset": "1200s",
                      "end_offset": "1500s",
                  },
              },
              {"type": "text", "text": "Summarize this section of the video."},
          ],
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: [
          {
            type: "video",
            uri: videoFile.uri,
            mime_type: videoFile.mimeType,
            processing: {
              type: "static",
              start_offset: "1200s",
              end_offset: "1500s",
            },
          },
          { type: "text", text: "Summarize this section of the video." },
        ],
      });
      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {
              "type": "video",
              "uri": "'${file_uri}'",
              "mime_type": "video/mp4",
              "processing": {
                "type": "static",
                "start_offset": "1200s",
                "end_offset": "1500s"
              }
            },
            {"type": "text", "text": "Summarize this section of the video."}
          ]
        }' 2> /dev/null
      ```

=== "CLI"

      ```bash
      FILE=$(gemini-api files upload path/to/sample.mp4 --wait)
      gemini-api generate -m gemini-4-hydrogen --body '{"input": [
        {"type": "video", "uri": "'"$FILE"'",
         "processing": {"type": "static", "start_offset": "1200s", "end_offset": "1500s"}},
        {"type": "text", "text": "Summarize this section of the video."}
      ]}'
      ```


### 設定自訂影格率 {#custom-frame-rate}

你可以在 `processing` 設定物件中傳入 `fps` 引數，設定自訂的影格率取樣。


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {
                  "type": "video",
                  "uri": video_file.uri,
                  "mime_type": video_file.mime_type,
                  "processing": {
                      "type": "static",
                      "fps": 0.5,  # Sample 1 frame every 2 seconds
                  },
              },
              {"type": "text", "text": "Describe the scene changes in this video."},
          ],
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: [
          {
            type: "video",
            uri: videoFile.uri,
            mime_type: videoFile.mimeType,
            processing: {
              type: "static",
              fps: 0.5, // Sample 1 frame every 2 seconds
            },
          },
          { type: "text", text: "Describe the scene changes in this video." },
        ],
      });
      console.log(interaction.output_text);
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {
              "type": "video",
              "uri": "'${file_uri}'",
              "mime_type": "video/mp4",
              "processing": {
                "type": "static",
                "fps": 0.5
              }
            },
            {"type": "text", "text": "Describe the scene changes in this video."}
          ]
        }' 2> /dev/null
      ```


### 選取影片內容圖層 {#video-content-layers}

預設情況下，`"static"` 模式會包含取樣的影格與音訊（`content_layers: ["frames", "audio"]`）。傳入 `content_layers` 即可任選組合：

*   `"frames"`：取樣的視覺影格，依 `resolution` 與 `fps` 計費。
*   `"audio"`：原始音軌，依標準音訊 token 費率計費。
*   `"transcript"`：附時間戳記的文字字幕稿，依文字 token 計費。

對於長影片，請先要求 `"transcript"`，以低成本找出時間戳記，再以 `"frames"` 檢視該片段：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      video_file = client.files.upload(file="keynote_recording.mp4")

      # 1. Scan the transcript first at low token cost.
      transcript_turn = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {
                  "type": "video",
                  "uri": video_file.uri,
                  "mime_type": video_file.mime_type,
                  "processing": {
                      "type": "static",
                      "content_layers": ["transcript"],
                  },
              },
              {
                  "type": "text",
                  "text": "Find the timestamps where the speaker demos the architecture diagram.",
              },
          ],
      )
      print(transcript_turn.output_text)

      # 2. Zoom into the matching clip with frames.
      detail_turn = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {
                  "type": "video",
                  "uri": video_file.uri,
                  "mime_type": video_file.mime_type,
                  "processing": {
                      "type": "static",
                      "start_offset": "420s",
                      "end_offset": "465s",
                      "fps": 2.0,
                      "content_layers": ["frames"],
                  },
              },
              {
                  "type": "text",
                  "text": "Describe the architecture diagram in this clip and summarize the explanation.",
              },
          ],
      )

      print(detail_turn.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const videoFile = await ai.files.upload({
        file: "keynote_recording.mp4",
        config: { mimeType: "video/mp4" },
      });

      // 1. Scan the transcript first at low token cost.
      const transcriptTurn = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: [
          {
            type: "video",
            uri: videoFile.uri,
            mime_type: videoFile.mimeType,
            processing: {
              type: "static",
              content_layers: ["transcript"],
            },
          },
          {
            type: "text",
            text: "Find the timestamps where the speaker demos the architecture diagram.",
          },
        ],
      });
      console.log(transcriptTurn.output_text);

      // 2. Zoom into the matching clip with frames.
      const detailTurn = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: [
          {
            type: "video",
            uri: videoFile.uri,
            mime_type: videoFile.mimeType,
            processing: {
              type: "static",
              start_offset: "420s",
              end_offset: "465s",
              fps: 2.0,
              content_layers: ["frames"],
            },
          },
          {
            type: "text",
            text: "Describe the architecture diagram in this clip and summarize the explanation.",
          },
        ],
      });

      console.log(detailTurn.output_text);
      ```

=== "REST"

      ```shell
      # 1. Scan the transcript first at low token cost.
      curl -X POST "https://generativelanguage.googleapis.com/v1/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {
              "type": "video",
              "uri": "https://generativelanguage.googleapis.com/v1beta/files/VIDEO_FILE_ID",
              "mime_type": "video/mp4",
              "processing": {
                "type": "static",
                "content_layers": ["transcript"]
              }
            },
            {"type": "text", "text": "Find the timestamps where the speaker demos the architecture diagram."}
          ]
        }'

      # 2. Zoom into the matching clip with frames.
      curl -X POST "https://generativelanguage.googleapis.com/v1/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {
              "type": "video",
              "uri": "https://generativelanguage.googleapis.com/v1beta/files/VIDEO_FILE_ID",
              "mime_type": "video/mp4",
              "processing": {
                "type": "static",
                "start_offset": "420s",
                "end_offset": "465s",
                "fps": 2.0,
                "content_layers": ["frames"]
              }
            },
            {"type": "text", "text": "Describe the architecture diagram in this clip and summarize the explanation."}
          ]
        }'
      ```


## 支援的影片格式 {#supported-formats}

Gemini 支援下列影片格式 MIME 類型：

* `video/mp4`
* `video/mpeg`
* `video/mov`
* `video/avi`
* `video/x-flv`
* `video/mpg`
* `video/webm`
* `video/wmv`
* `video/3gpp`

## 影片的技術細節 {#technical-details-video}

- **支援的模型與上下文**：所有 Gemini 模型都能處理影片資料。
  -   具備 1M 上下文視窗的模型，預設（低媒體解析度）可處理長達 3 小時的影片，高媒體解析度下則可處理長達 1 小時的影片。

- **處理模式**：Gemini 4 Carbon、Gemini 4 Argon、Gemini 4 Neon、Gemini 4 Hydrogen、3.8 Flash、3.6 Flash、3.5 Flash Lite 及後續模型支援兩種影片處理模式：
  -   **Static**：以 1 FPS 擷取影格並放入上下文（所有模型的預設模式）。音訊以 1Kbps（單聲道）處理。每秒加入時間戳記。最適合短片，或每個影格都很重要的情況（例如逐格檢視）。請注意，由於取樣率為 1 FPS，快速動作片段可能會遺失細節。
  -   **Agentic**：模型會動態瀏覽影片，依需求載入字幕稿及／或影格及／或音訊。處理長篇內容時，使用的 token 最多可減少 88%；不過由於內部推理與工具往返，瀏覽可能會增加短片（<5 分鐘）或廣泛查詢的首 token 時間（TTFT）與總 token 用量。最適合長篇影片與針對性查詢，可最佳化 token 成本與回應品質。支援 Gemini 4 Carbon、Gemini 4 Argon、Gemini 4 Neon、Gemini 4 Hydrogen、3.8 Flash、3.6 Flash 與 3.5 Flash Lite。詳情請參閱 [Agentic video understanding](/docs/video-understanding/#agentic-video-understanding)。

- **token 計算（靜態模式）**：每秒影片的 Tokenizer 方式如下：
  -   個別影格（以 1 FPS 取樣）：
      -   若 `media_resolution` 設為低，影格以每個影格 66 tokens 計算。
      -   否則，影格以每個影格 258 tokens 計算。

  -   音訊：每秒 32 tokens。
  -   也包含中繼資料。
  -   總計：在預設（低）媒體解析度下，每秒影片約 100 tokens；高媒體解析度下，每秒影片約 300 tokens。

- **token 計算（代理式模式）**：token 用量會依內容複雜度與模型的瀏覽策略而有所不同。影片探索期間產生的瀏覽推理 token 會計為**思考 token**（`total_thought_tokens`），依需求載入的影格、音訊與字幕稿則會計為工具使用 token（`total_tool_use_tokens`）。代理式處理處理長篇內容時，總 token 用量通常最多可比靜態處理少 88%，因為模型只會載入回答提示詞所需的字幕稿及／或影格及／或音訊（請參閱[token 指南](/docs/tokens/#video)）。
- **媒體解析度**：Gemini 3 透過 `media_resolution` 參數，引入對多模態視覺處理的細緻控制。`media_resolution` 參數決定**每個輸入圖片或影片影格可分配的 token 數量上限。**解析度越高，模型越能讀取細小文字或辨識微小細節，但 token 用量與延遲也會增加。`media_resolution` 與 `processing` 參數彼此獨立：你可以在同一個影片輸入上同時設定兩者。

如要進一步瞭解 token 計算方式，請參閱 [tokens](/docs/tokens/) 指南。

- **時間戳記格式**：在提示詞中指出影片的特定時刻時，請使用 `MM:SS` 格式（例如 `01:15` 表示 1 分 15 秒）。
- **提示詞位置**：若要將文字與單一影片組合，請將文字提示詞放在 `input` 陣列中影片部分的*後面*。
- **長要求的逾時**：對於需要較長處理時間或複雜多步驟推理的影片，請使用串流或[背景執行](/docs/background-execution/)。在高需求下經歷後端重試的同步非串流要求，可能會超出連線或驗證 token 的有效期限，進而以非預期的 `401 Unauthorized` 或逾時錯誤呈現。串流可以保持連線，並顯示中間的推理與工具呼叫進度。

## 後續步驟 {#whats-next}

- [Media resolution](/docs/media-resolution/)：控制影片影格的解析度，在品質與 token 用量之間取得平衡。
- [Tokens](/docs/tokens/)：瞭解靜態與代理式兩種處理模式下，影片內容的 Tokenizer 方式。
- [Background execution](/docs/background-execution/)：以非同步方式執行長時間的影片理解工作，避免連線逾時。
- [System instructions](/docs/text-generation/#system-instructions)：系統指令可讓你依特定需求與應用案例，引導模型的行為。
- [Files API](/docs/files/)：進一步瞭解如何上傳及管理供 Gemini 使用的檔案。
- [File prompting strategies](/docs/files/#prompt-guide)：Gemini API 支援以文字、圖片、音訊與影片資料進行提示，也稱為多模態提示。
- [Safety guidance](/docs/safety-guidance/)：生成式 AI 模型有時會產生非預期的輸出，例如不準確、帶有偏見或冒犯性的輸出。後處理與人工評估是降低這類輸出造成危害風險的關鍵。
