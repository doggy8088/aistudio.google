# Files API

Gemini 能同時處理多種類型的輸入資料，包括文字、圖片和音訊。

本指南說明如何使用 Files API 處理媒體檔案。音訊檔案、圖片、影片、文件及其他支援的檔案類型，基本操作都相同。

如需檔案提示的相關指引，請參閱[檔案提示指南](/docs/files/#prompt-guide)一節。

## 上傳檔案 {#upload-audio}

你可以使用 Files API 上傳媒體檔案。當請求總大小（包括檔案、文字提示詞、系統指令等）超過 100 MB 時，務必使用 Files API。PDF 檔案的上限則為 50 MB。

以下程式碼會上傳一個檔案，接著在呼叫 `interactions.create` 時使用該檔案。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      myfile = client.files.upload(file="path/to/sample.mp3")

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": "Describe this audio clip"},
              {"type": "audio", "uri": myfile.uri, "mime_type": myfile.mime_type}
          ]
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      async function main() {
        const myfile = await client.files.upload({
          file: "path/to/sample.mp3",
          config: { mimeType: "audio/mpeg" },
        });

        const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: [
            { type: "text", text: "Describe this audio clip" },
            { type: "audio", uri: myfile.uri, mime_type: myfile.mimeType }
          ]
        });
        console.log(interaction.output_text);
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.AudioContent;
      import com.google.genai.gaos.models.interactions.AudioContentMimeType;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
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
              new java.io.File("path/to/sample.mp3"),
              UploadFileConfig.builder().mimeType("audio/mp3").build());

      Content textContent = TextContent.builder().text("Describe this audio clip").build();
      Content audioContent =
          AudioContent.builder()
              .uri(myFile.uri().orElse(""))
              .mimeType(AudioContentMimeType.of(myFile.mimeType().orElse("audio/mp3")))
              .build();

      List<Content> contents = Arrays.asList(textContent, audioContent);

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

          myFile, err := client.Files.UploadFromPath(ctx, "path/to/sample.mp3", &genai.UploadFileConfig{
              MIMEType: "audio/mp3",
          })
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: "Describe this audio clip",
                      }),
                      interactions.NewContent(interactions.AudioContent{
                          URI:      genai.Ptr(myFile.URI),
                          MimeType: interactions.AudioContentMimeType(myFile.MIMEType).ToPointer(),
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
      AUDIO_PATH="path/to/sample.mp3"
      MIME_TYPE=$(file -b --mime-type "${AUDIO_PATH}")
      NUM_BYTES=$(wc -c < "${AUDIO_PATH}")
      DISPLAY_NAME=AUDIO

      tmp_header_file=upload-header.tmp

      # Initial resumable request defining metadata.
      # The upload url is in the response headers dump them to a file.
      curl "${BASE_URL}/upload/v1beta/files" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -D "${tmp_header_file}" \
        -H "X-Goog-Upload-Protocol: resumable" \
        -H "X-Goog-Upload-Command: start" \
        -H "X-Goog-Upload-Header-Content-Length: ${NUM_BYTES}" \
        -H "X-Goog-Upload-Header-Content-Type: ${MIME_TYPE}" \
        -H "Content-Type: application/json" \
        -d "{'file': {'display_name': '${DISPLAY_NAME}'}}" 2> /dev/null

      upload_url=$(grep -i "x-goog-upload-url: " "${tmp_header_file}" | cut -d" " -f2 | tr -d "\r")
      rm "${tmp_header_file}"

      # Upload the actual bytes.
      curl "${upload_url}" \
        -H "Content-Length: ${NUM_BYTES}" \
        -H "X-Goog-Upload-Offset: 0" \
        -H "X-Goog-Upload-Command: upload, finalize" \
        --data-binary "@${AUDIO_PATH}" 2> /dev/null > file_info.json

      file_uri=$(jq ".file.uri" file_info.json)
      echo file_uri=$file_uri

      # Now create an interaction using the Interactions API
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -H "Api-Revision: 2026-05-20" \
          -d '{
            "model": "gemini-4-hydrogen",
            "input": [
              {"type": "text", "text": "Describe this audio clip"},
              {"type": "audio", "uri": '$file_uri', "mime_type": "'${MIME_TYPE}'"}
            ]
          }' 2> /dev/null > response.json

      cat response.json
      echo

      jq ".outputs[] | select(.type == \"text\") | .text" response.json
      ```

=== "CLI"

      ```bash
      FILE=$(gemini-api files upload path/to/sample.mp3 --wait)
      gemini-api generate "Describe this audio clip" -m gemini-4-hydrogen -i "$FILE"
      ```


## 取得檔案的中繼資料 {#get-metadata}

呼叫 `files.get`，即可確認 API 是否已成功儲存上傳的檔案，並取得其中繼資料。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      myfile = client.files.upload(file='path/to/sample.mp3')
      file_name = myfile.name
      myfile = client.files.get(name=file_name)
      print(myfile)
      ```

=== "JavaScript"

      ```javascript
      import {
        GoogleGenAI,
      } from "@google/genai";

      const client = new GoogleGenAI({});

      async function main() {
        const myfile = await client.files.upload({
          file: "path/to/sample.mp3",
          config: { mimeType: "audio/mpeg" },
        });

        const fileName = myfile.name;
        const fetchedFile = await client.files.get({ name: fileName || '' });
        console.log(fetchedFile);
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.File;
      import com.google.genai.types.UploadFileConfig;

      Client client = new Client();

      File myFile =
          client.files.upload(
              new java.io.File("path/to/sample.mp3"),
              UploadFileConfig.builder().mimeType("audio/mp3").build());

      String fileName = myFile.name().orElse("");
      File fileMetadata = client.files.get(fileName, null);
      System.out.println(fileMetadata);
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

          myFile, err := client.Files.UploadFromPath(ctx, "path/to/sample.mp3", &genai.UploadFileConfig{
              MIMEType: "audio/mp3",
          })
          if err != nil {
              log.Fatal(err)
          }

          fileMetadata, err := client.Files.Get(ctx, myFile.Name, nil)
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(fileMetadata)
      }
      ```

=== "REST"

      ```shell
      # file_info.json was created in the upload example
      name=$(jq -r ".file.name" file_info.json)
      # Get the file of interest to check state
      curl https://generativelanguage.googleapis.com/v1beta/$name \
      -H "x-goog-api-key: $GEMINI_API_KEY" > file_info.json
      # Print some information about the file you got
      name=$(jq -r ".name" file_info.json)
      echo name=$name
      file_uri=$(jq -r ".uri" file_info.json)
      echo file_uri=$file_uri
      ```

=== "CLI"

      ```bash
      FILE=$(gemini-api files upload path/to/sample.mp3)
      gemini-api files get "$FILE"
      ```


## 列出已上傳的檔案 {#list-uploaded}

以下程式碼會取得所有已上傳檔案的清單：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      print('My files:')
      for f in client.files.list():
          print(' ', f.name)
      ```

=== "JavaScript"

      ```javascript
      import {
        GoogleGenAI,
      } from "@google/genai";

      const client = new GoogleGenAI({});

      async function main() {
        const listResponse = await client.files.list({ config: { pageSize: 10 } });
        for await (const file of listResponse) {
          console.log(file.name);
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.File;

      Client client = new Client();

      System.out.println("My files:");
      for (File f : client.files.list(null)) {
        System.out.println("  " + f.name().orElse(""));
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
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println("My files:")
          for f, err := range client.Files.All(ctx) {
              if err != nil {
                  log.Fatal(err)
              }
              fmt.Println(" ", f.Name)
          }
      }
      ```

=== "REST"

      ```shell
      echo "My files: "

      curl "https://generativelanguage.googleapis.com/v1beta/files" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "CLI"

      ```bash
      gemini-api files list --all --jq '.files[]?.name'
      ```


## 刪除已上傳的檔案 {#delete-uploaded}

檔案會在 48 小時後自動刪除，你也可以手動刪除已上傳的檔案：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      myfile = client.files.upload(file='path/to/sample.mp3')
      client.files.delete(name=myfile.name)
      ```

=== "JavaScript"

      ```javascript
      import {
        GoogleGenAI,
      } from "@google/genai";

      const client = new GoogleGenAI({});

      async function main() {
        const myfile = await client.files.upload({
          file: "path/to/sample.mp3",
          config: { mimeType: "audio/mpeg" },
        });

        const fileName = myfile.name;
        await client.files.delete({ name: fileName || '' });
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.File;
      import com.google.genai.types.UploadFileConfig;

      Client client = new Client();

      File myFile =
          client.files.upload(
              new java.io.File("path/to/sample.mp3"),
              UploadFileConfig.builder().mimeType("audio/mp3").build());

      client.files.delete(myFile.name().orElse(""), null);
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          myFile, err := client.Files.UploadFromPath(ctx, "path/to/sample.mp3", &genai.UploadFileConfig{
              MIMEType: "audio/mp3",
          })
          if err != nil {
              log.Fatal(err)
          }

          if _, err := client.Files.Delete(ctx, myFile.Name, nil); err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```shell
      curl --request "DELETE" https://generativelanguage.googleapis.com/v1beta/$name \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "CLI"

      ```bash
      FILE=$(gemini-api files upload path/to/sample.mp3)
      gemini-api files delete "$FILE"
      ```


## 使用資訊 {#usage-info}

你可以使用 Files API 上傳媒體檔案並與之互動。Files API 每個專案最多可儲存 20 GB 的檔案，單一檔案大小上限為 2 GB。檔案的儲存期限為 48 小時。

在這段期間內，你可以透過 API 取得檔案的中繼資料。不過，你無法下載使用者上傳的檔案；至於模型產生的檔案（例如影片），則可使用 `files.download` 方法下載。只要是 Gemini API 提供服務的地區，Files API 皆可免費使用。

## 檔案提示策略 {#prompt-guide}

本節提供在 Gemini API 提示詞中使用媒體檔案的指引與最佳做法。

能在提示詞中使用多種類型的資料，代表你能運用 Gemini API 處理的任務更具彈性。舉例來說，你可以傳送一張美味餐點的照片給模型，請它為這份餐點寫一篇簡短的部落格文章。


| **提示詞** | **回應** |
| --- | --- |
| 根據這張圖片寫一篇簡短、引人入勝的部落格文章，內容應包含照片中餐點的描述，並談談我備餐的心路歷程。 ![](https://www.gstatic.com/cloud-cms/16043e598e2b76cf73c90625b5cd4202.png) | 備餐是節省時間與金錢的好方法，也能幫助你吃得更健康。這份餐點就是健康又美味、且可事先準備的絕佳範例，內容有糙米、烤蔬菜和照燒雞肉。糙米是健康又複雜的碳水化合物，能提供持久的能量；烤蔬菜是攝取每日所需維生素與礦物質的好方式；照燒雞肉則美味又富含蛋白質。這份餐點的準備方式也很簡單：煮好糙米、烤好蔬菜、再煮好照燒雞肉即可。全部煮好後，分裝到備餐盒中放入冰箱冷藏，忙碌的早晨就能拿了就走！如果你正在尋找一份健康美味、又能事先準備的餐點，這會是很好的選擇。它營養與風味兼具，保證讓你飽足又滿足。為健康美味的備餐乾杯！ |


如果使用媒體檔案的提示詞始終得不到想要的輸出，以下策略或許能幫助你獲得理想結果。後續各節將提供改善多模態輸入提示詞的設計方法與疑難排解技巧。

遵循以下最佳做法，即可改善你的多模態提示詞：

* **[提示詞設計基礎](/docs/files/#specific-instructions)**
  *   **讓指令具體明確**：撰寫清楚簡潔的指令，盡量不留誤解的空間。
  *   **在提示詞中加入幾個範例**：使用貼近真實情境的少樣本範例，說明你想達成的目標。
  *   **逐步拆解**：將複雜任務拆成可處理的子目標，引導模型一步步完成。
  *   **指定輸出格式**：在提示詞中要求輸出採用你想要的格式，例如 Markdown、JSON、HTML 等。
  *   **單張圖片的提示詞將圖片放在最前面**：Gemini 能以任意順序處理圖片與文字輸入，但對於只含一張圖片的提示詞，將圖片放在文字提示詞之前，效果可能更好。

* **[多模態提示詞疑難排解](/docs/files/#troubleshooting)**
  *   **模型未從圖片的相關部分擷取資訊時**：給予提示，指出你希望提示詞從圖片的哪些方面擷取資訊。
  *   **模型輸出過於泛泛（未針對圖片量身打造）時**：在提示詞開頭先請模型描述圖片，再給予任務指令；或請模型在回應時參照圖片中的內容。


### 讓指令具體明確 {#specific-instructions}

提示詞清楚又詳細時，成功率最高。如果你心中已有明確的輸出，不妨將該要求直接寫入提示詞，確保得到想要的結果。

以這張機場資訊看板的圖片為例，若只請模型「描述這張圖片」，得到的可能只是概略的描述；若你需要模型解析圖片中的時間與城市，可以直接把這項要求寫進提示詞。


| 提示詞 | 模型回應 |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/ce337b5b79a15e364db421596f86353c.png) | 這張圖片顯示的是機場的抵達與出發資訊看板。 |


| **改良後的提示詞** | **改良後的回應** |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/ce337b5b79a15e364db421596f86353c.png) 將這張圖片中機場看板上的時間與城市解析成清單。 | 10:50 Moscow 11:05 Edinburgh 11:05 London 11:10 Bucharest 11:30 Kiev 11:35 Dublin 11:45 East Midlands 12:15 Sofia 12:30 London 12:30 Newcastle 12:40 St Petersburg 12:40 London 12:45 Manchester |


### 加入幾個範例 {#add-a-few-examples}

Gemini 模型可接受多個輸入，並將其作為範例來理解你想要的輸出。加入這些範例能幫助模型辨識規律，並將給定圖片與回應之間的關係套用到新範例上，這就是所謂的「少樣本」（few-shot）學習。

以下範例中，初始輸出以句子形式撰寫，且包含國家（Brazil）。假設你想要不同的輸出格式或風格，而且只要城市、不要國家，在提示詞中加入少樣本範例，就能引導模型以你想要的方式回應。


| **提示詞** | **模型回應** |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/c75f4d57229a316cefb7e84b9d6f6458.png)判斷城市與地標。 | 該地標是位於巴西 Rio de Janeiro 的 Christ the Redeemer 雕像。 |


| **改良後的提示詞** | **改良後的回應** |
| --- | --- |
| 判斷城市與地標。 ![](https://www.gstatic.com/cloud-cms/6764f6e86aaa8af76882b09d37fc5e23.png) | city: Rome, landmark: the Colosseum. |
| ![](https://www.gstatic.com/cloud-cms/1e37dfdd70d0b6ff26e5fffb0a04b71f.png) | city: Beijing, landmark: Forbidden City |
| ![](https://www.gstatic.com/cloud-cms/c75f4d57229a316cefb7e84b9d6f6458.png) | city: Rio de Janeiro, landmark: Christ the Redeemer statue |


### 逐步拆解 {#break-it-down-step-by-step}

對於同時需要視覺理解與推理的複雜任務，將任務拆成更小、更直接的步驟會有所幫助。或者，直接在提示詞中請模型「逐步思考」，也可能同樣有效。


| 提示詞 | 模型回應 |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/556c63543fcbb2efc7696a0d5d85ce44.jpg) 我的衛生紙什麼時候會用完？ | 很快，你只剩下 3 捲了。 |


| **改良後的提示詞** | **改良後的回應** |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/556c63543fcbb2efc7696a0d5d85ce44.jpg) 首先，數一數這張圖片中有幾捲衛生紙。接著，判斷一般人每天大約使用多少衛生紙，再計算這些衛生紙可以用多久。 | 這張圖片中有 3 捲衛生紙。一般人每天大約使用 20 張衛生紙。若每捲有 200 張，每捲大約可用 10 天，因此這 3 捲大約可用一個月。 |


數學問題或其他類型的文字題，很適合請模型逐步思考。


| **提示詞** | **回應** |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/1713c829afa7fa9b5250dc43e703cc70.jpg) 這個數列的第 4 項是多少？ | -135 |


模型的回應不正確。改善的方法之一，是請模型先解析題目，再回答提示詞。


| **提示詞** | **回應** |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/1713c829afa7fa9b5250dc43e703cc70.jpg) 先解析圖片中的公式，再根據公式回答「這個數列的第 4 項是多少？」。 | *點選以展開結果* $$ b(n) = b(n-1) * (-3) $$ $$ b(1) = 15 $$ 將 n = 4 代入公式： $$ b(4) = b(4-1) * (-3) $$ $$ b(4) = b(3) * (-3) $$ 我們不知道 b(3) 的值，因此將 n = 3 代入公式： $$ b(3) = b(3-1) * (-3) $$ $$ b(3) = b(2) * (-3) $$ 我們不知道 b(2) 的值，因此將 n = 2 代入公式： $$ b(2) = b(2-1) * (-3) $$ $$ b(2) = b(1) * (-3) $$ 我們知道 b(1) 的值是 15，將它代入公式： $$ b(2) = 15 * (-3) $$ $$ b(2) = -45 $$ 現在我們知道 b(2) 的值，將它代入 b(3) 的公式： $$ b(3) = b(2) * (-3) $$ $$ b(3) = -45 * (-3) $$ $$ b(3) = 135 $$ 現在我們知道 b(3) 的值，將它代入 b(4) 的公式： $$ b(4) = b(3) * (-3) $$ $$ b(4) = 135 * (-3) $$ $$ b(4) = -405 $$ 因此，這個數列的第 4 項是 -405。 |


這次模型的回應正確。若想讓回應更精簡，你可以請模型逐步思考。


| **改良後的提示詞** | **改良後的回應** |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/1713c829afa7fa9b5250dc43e703cc70.jpg) 這個數列的第 4 項是多少？請逐步思考。 | 第一項是 15。第二項是 b(1) * (-3) = 15 * (-3) = -45。第三項是 b(2) * (-3) = -45 * (-3) = 135。第四項是 b(3) * (-3) = 135 * (-3) = -405。 |


### 指定輸出格式 {#specify-the-output-format}

常見的問題是模型輸出需要採用特定格式（例如 Markdown、JSON、HTML），尤其是輸出需要由下游任務接收處理時。你可以在提示詞中指示模型以該格式產出，嘗試得到符合格式的輸出。以下提供兩個範例：


| 提示詞 | 模型回應 |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/7dad070133c3c7ffb409a80bd2e17f92.png) 將這張圖片中的表格解析為 Markdown 格式 |  |

```none
    | Subject | Status | Time | Start date | Due on |
    | ------- | ------ | ---- | ---------- | ------ |
    | Math | Done | 1.5 hrs | 11/29/2023 | 12/1/2023 |
    | Geography | Done | 30 min | 12/2/2023 | 12/4/2023 |
    | Physics | In progress | 2 hrs | 12/3/2023 | 12/5/2023 |
    | Biology | Not started | 6 hrs | 11/2/2016 | 12/6/2023 |
  ```


| **提示詞** | **模型回應** |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/09e773a60f61717072e458669e53119e.png) 以 JSON 格式列出以下所有屬性：食材、料理類型、是否為素食 |  |

```json
    {
    "ingredients": [
    "rice",
    "shrimp",
    "clams",
    "mussels",
    "peas",
    "tomatoes",
    "onions",
    "garlic",
    "olive oil",
    "paprika",
    "salt",
    "pepper"
    ],
    "type of cuisine": "Spanish",
    "vegetarian": false
    }
  ```


### 單張圖片的提示詞將圖片放在最前面 {#single-image-prompts}

Gemini 能以任意順序解讀提示詞中的圖片與文字，不過，將單張圖片放在文字提示詞之前，可能會得到更好的結果。在以下範例中，你會注意到每個提示詞都是圖片在前、文字在後。

### 多模態提示詞疑難排解 {#troubleshooting}

如果回應不如預期，你可能需要為提示詞進行疑難排解。以下提供幾種可以嘗試的策略。

#### 模型未從圖片的相關部分擷取資訊時 {#if-the-model-is-not-drawing-information-from-the-relevant-part-of-the-image}

若要得到更具體的回應，你可以指出希望提示詞從圖片的哪些方面擷取資訊，以作為回應的依據。


| 提示詞 | 模型回應 |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/34f7e4cef20c432692eccd6714a0dfc5.png) 這些尿布可以讓寶寶用幾天？ | 這些尿布在用完之前可以用 198 天。 |


| **改良後的提示詞** | **改良後的回應** |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/34f7e4cef20c432692eccd6714a0dfc5.png) 這些尿布在用完之前可以用多久？請利用盒子上標示的體重來判斷孩子的年齡，並利用盒中尿布的總數量，將總數量除以孩子每天用掉的尿布數量。 | 盒中共有 198 片尿布。盒上標示這些尿布適用於體重 22-37 lbs 的孩子，這個體重範圍的孩子平均年齡大約介於 1 到 2 歲之間。2 歲的孩子通常每天用掉 6 片尿布，因此這些尿布大約可用 33 天（198/6）。 |


#### 模型輸出過於泛泛，未針對圖片輸入量身打造時 {#if-the-model-output-is-too-generic-and-not-tailored-enough-to-the-image-input}

若要幫助模型針對圖片量身打造回應，可以先請它描述圖片，再執行推理任務。


| 提示詞 | 模型回應 |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/11ccc8ffe775cf47201136a3c0563144.jpg) ![](https://www.gstatic.com/cloud-cms/7d1f11cedb5f37ff8937b90f18eacf50.jpg) ![](https://www.gstatic.com/cloud-cms/556c63543fcbb2efc7696a0d5d85ce44.jpg) ![](https://www.gstatic.com/cloud-cms/8f7351fd5648f2d710f74c0bd1e62afa.jpg) 這些圖片有什麼共同點？ | 這四張圖片都是風景攝影的範例。 |


| **改良後的提示詞** | **改良後的回應** |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/11ccc8ffe775cf47201136a3c0563144.jpg) ![](https://www.gstatic.com/cloud-cms/7d1f11cedb5f37ff8937b90f18eacf50.jpg) ![](https://www.gstatic.com/cloud-cms/556c63543fcbb2efc7696a0d5d85ce44.jpg) ![](https://www.gstatic.com/cloud-cms/8f7351fd5648f2d710f74c0bd1e62afa.jpg) 首先，詳細描述每張圖片的內容。這些圖片有什麼共同點？ | 第一張圖片顯示一個人正在打包行李箱。第二張圖片顯示購物商場中一條空無一人的走廊。第三張圖片顯示一捲衛生紙。第四張圖片顯示波濤洶湧的黑暗海面。這些圖片的共同點是，它們都是閾限空間（liminal spaces）的範例。閾限空間是介於另外兩個地點或情境之間的地點或情境，通常帶有不確定或模糊的氛圍。第一張圖片顯示這個人正處於在家與出門旅行之間。第二張圖片顯示兩間商店之間的走廊。第三張圖片是衛生紙，可以代表浴室；浴室是私人與公共領域之間的過渡空間，是我們準備進入或離開外面世界的地方。第四張圖片顯示介於平靜與暴風雨之間的海面。閾限空間既令人興奮，也令人不安；它可以是新開始的起點，也可以是終點；可以是反思的場所，也可以是行動的場所。 |


你也可以嘗試明確請模型在回應中參照圖片的內容。


| **改良後的提示詞** | **改良後的回應** |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/11ccc8ffe775cf47201136a3c0563144.jpg) ![](https://www.gstatic.com/cloud-cms/7d1f11cedb5f37ff8937b90f18eacf50.jpg) ![](https://www.gstatic.com/cloud-cms/556c63543fcbb2efc7696a0d5d85ce44.jpg) ![](https://www.gstatic.com/cloud-cms/8f7351fd5648f2d710f74c0bd1e62afa.jpg) 這些圖片有什麼共同點？請在回應中參照圖片的內容。 | 這些圖片都與旅行有關。第一張圖片顯示一個人正在打包行李箱，第二張圖片顯示購物商場中一條空無一人的走廊，第三張圖片顯示一疊衛生紙，第四張圖片顯示波濤洶湧的黑暗海面。這些圖片之所以都與旅行有關，是因為它們都是人們旅行時需要或會用到的事物。第一張圖片顯示一個人正在打包行李箱，這是人們出門旅行時會做的事。第二張圖片顯示購物商場中一條空無一人的走廊，這是人們經常去購買旅行用品的地方。第三張圖片顯示一疊衛生紙，這是人們旅行時經常用到的物品。第四張圖片顯示波濤洶湧的黑暗海面，這是人們旅行時經常會遇到的景象。 |


同樣的技巧也適用於圖片的創意輸出。在以下兔子的範例中，明確請模型納入圖片中的元素，可以改善輸出品質。


| 提示詞 | 模型回應 |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/c3755985176e1cba66432e301b16b92c.jpg) 你能為我寫一首關於這張圖片的詩嗎？ | 小兔子，如此柔軟又棕亮，在田野間跳上跳下。你的耳朵好長，尾巴好小，你是所有生物中最可愛的。你啃著青草，如此翠綠又香甜，一看到我就跳開。但我永遠是你的朋友，小兔子，直到最後。 |


| **改良後的提示詞** | **改良後的回應** |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/c3755985176e1cba66432e301b16b92c.jpg) 你能為我寫一首描寫生動、戲劇張力十足的詩來描繪這張圖片，並納入地點嗎？ | 小兔子站在綠地上，耳朵好長、好敏銳。你在那裡看到了什麼，在你凝視的遠方？是蔚藍的海洋，在陽光下閃閃發光？還是拍打咆哮的浪花，一種你喜愛的節奏？小兔子，告訴我實話，是什麼如此吸引你的注意力？是鹹鹹的海風，還是海鷗令人愉悅的叫聲？也許是這一切的浩瀚無垠，一個既大又小的世界。一個夢想可以漫遊、冒險可以萌芽的地方。小兔子，我好奇你夢見了什麼，當你如此寧靜地坐在草地上。你渴望探索深海，還是留在陸地上自在跳躍？無論是什麼，小兔子，讓那份驚奇的火花持續明亮燃燒。因為在你的夢想與抱負之中，有一個等待你去創造的世界。 |


#### 判斷提示詞是哪個部分出了問題 {#troubleshooting-which-part-of-the-prompt-failed}

有時很難判斷提示詞失敗，是因為模型一開始就沒有**理解圖片**，還是它理解了圖片、卻沒有正確執行後續的**推理步驟**。若要釐清這兩種原因，可以請模型描述圖片中的內容。

以下範例中，如果模型回應的點心與茶搭配起來令人意外（例如爆米花），你可以先進行疑難排解，確認模型是否正確辨識出圖片中是茶。


| 提示詞 | 疑難排解用提示詞 |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/dc5ca83828db596dd80c52488447cb47.png) 有什麼點心可以在 1 分鐘內做好，又能與這個搭配？ | ![](https://www.gstatic.com/cloud-cms/dc5ca83828db596dd80c52488447cb47.png) 描述這張圖片中的內容。 |


另一個策略是請模型說明它的推理過程，這能幫助你縮小範圍，找出推理在哪個環節出了問題（如果有的話）。


| 提示詞 | 疑難排解用提示詞 |
| --- | --- |
| ![](https://www.gstatic.com/cloud-cms/dc5ca83828db596dd80c52488447cb47.png) 有什麼點心可以在 1 分鐘內做好，又能與這個搭配？ | ![](https://www.gstatic.com/cloud-cms/dc5ca83828db596dd80c52488447cb47.png) 有什麼點心可以在 1 分鐘內做好，又能與這個搭配？請說明原因。 |


## 後續步驟 {#whats-next}

- 使用 [Google AI
  Studio](http://aistudio.google.com) 試著撰寫你自己的多模態提示詞。

- 如需使用 Gemini Files API 上傳媒體檔案並將其納入提示詞的相關資訊，請參閱
  [Vision](/docs/image-understanding/)、[Audio](/docs/audio/) 與
  [Document processing](/docs/document-processing/) 指南。

- 如需提示詞設計的更多指引（例如調整取樣參數），請參閱
  [Prompt strategies](/docs/prompting-strategies/) 頁面。
