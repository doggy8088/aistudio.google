# 檔案輸入方法

本指南說明在向 Gemini API 發出請求時，納入圖片、音訊、影片與文件等媒體檔案的各種方式。
這些新方法適用於所有 Gemini API 端點，包括 Batch、Interactions 與 Live API。
該選用哪種方法，取決於檔案大小、資料的存放位置，以及你打算使用該檔案的頻率。

將檔案納入輸入最簡單的方式，是讀取本機檔案並放入提示詞中。
以下範例示範如何讀取本機 PDF 檔案；使用此方法時，PDF 的大小上限為 50MB。
完整的檔案輸入類型與限制清單，請見
[輸入方法比較表](/docs/file-input-methods/#method-comparison)。


=== "Python"

      ```python
      from google import genai
      import pathlib
      import base64

      client = genai.Client()

      filepath = pathlib.Path('my_local_file.pdf')

      prompt = "Summarize this document"
      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": prompt},
              {"type": "document", "data": base64.b64encode(filepath.read_bytes()).decode('utf-8'), "mime_type": "application/pdf"}
          ]
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from 'node:fs';

      const client = new GoogleGenAI({});
      const prompt = "Summarize this document";

      async function main() {
          const filePath = 'my_local_file.pdf';

          const interaction = await client.interactions.create({
              model: "gemini-4-hydrogen",
              input: [
                  { type: "text", text: prompt },
                  {
                      type: "document",
                      data: fs.readFileSync(filePath).toString("base64"),
                      mime_type: "application/pdf"
                  }
              ]
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
      import com.google.genai.gaos.models.interactions.DocumentContent;
      import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
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

      byte[] pdfBytes = Files.readAllBytes(Paths.get("my_local_file.pdf"));
      String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);

      String prompt = "Summarize this document";

      Content textContent = TextContent.builder().text(prompt).build();
      Content docContent =
          DocumentContent.builder()
              .data(base64Pdf)
              .mimeType(DocumentContentMimeType.APPLICATION_PDF)
              .build();

      List<Content> contents = Arrays.asList(textContent, docContent);

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

          pdfBytes, err := os.ReadFile("my_local_file.pdf")
          if err != nil {
              log.Fatal(err)
          }
          base64Pdf := base64.StdEncoding.EncodeToString(pdfBytes)

          prompt := "Summarize this document"

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: prompt,
                      }),
                      interactions.NewContent(interactions.DocumentContent{
                          Data:     genai.Ptr(base64Pdf),
                          MimeType: interactions.DocumentContentMimeTypeApplicationPdf.ToPointer(),
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

      ```bash
      # Encode the local file to base64
      B64_CONTENT=$(base64 -w 0 my_local_file.pdf)

      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {"type": "text", "text": "Summarize this document"},
            {
              "type": "document",
              "data": "'${B64_CONTENT}'",
              "mime_type": "application/pdf"
            }
          ]
        }'
      ```

=== "CLI"

      ```bash
      gemini-api analyze -m gemini-4-hydrogen -i my_local_file.pdf "Summarize this document"
      ```


## 輸入方法比較 {#method-comparison}

下表比較各輸入方法的檔案限制與最適合的使用情境。
請注意，檔案大小上限可能因檔案類型，以及用來處理檔案的模型或 tokenizer 而有所不同。


| 方法 | 最適合 | 檔案大小上限 | 保存方式 |
| --- | --- | --- | --- |
| **行內資料** | 快速測試、小型檔案、即時應用。 | 每個請求或酬載 100 MB（**PDF 為 50 MB**） | 無（隨每個請求一併傳送） |
| **File API 上傳** | 大型檔案、多次使用的檔案。 | 每個檔案 2 GB，每個專案最多 20GB | 48 小時 |
| **File API GCS URI 註冊** | 已存放在 Google Cloud Storage 的大型檔案、多次使用的檔案。 | 每個檔案 2 GB，無整體儲存空間上限 | 無（每個請求都重新擷取）。一次性註冊最多可提供 30 天的存取權。 |
| **外部 URL** | 公開資料，或存放在雲端值區（AWS、Azure、GCS）中、不想重新上傳的資料。 | 每個檔案 15 MB | 無（每個請求都重新擷取） |


## 行內資料 {#inline-data}

對於較小的檔案（100MB 以下，PDF 為 50MB 以下），你可以將資料直接放入請求酬載中傳遞。
這是快速測試最簡單的方法，也適合處理即時、暫時性資料的應用。
你可以將資料以 base64 編碼字串的形式提供，或直接讀取本機檔案。

讀取本機檔案的範例，請見本頁開頭的範例。

### 從 URL 擷取 {#fetch-from-a-url}

你也可以從 URL 擷取檔案、轉換為位元組，再納入輸入中。


=== "Python"

      ```python
      from google import genai
      import httpx

      client = genai.Client()

      doc_url = "https://discovery.ucl.ac.uk/id/eprint/10089234/1/343019_3_art_0_py4t4l_convrt.pdf"
      doc_data = httpx.get(doc_url).content

      prompt = "Summarize this document"

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "document", "data": base64.b64encode(doc_data).decode('utf-8'), "mime_type": "application/pdf"},
              {"type": "text", "text": prompt}
          ]
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});
      const docUrl = 'https://discovery.ucl.ac.uk/id/eprint/10089234/1/343019_3_art_0_py4t4l_convrt.pdf';
      const prompt = "Summarize this document";

      async function main() {
          const pdfResp = await fetch(docUrl)
            .then((response) => response.arrayBuffer());

          const interaction = await client.interactions.create({
              model: "gemini-4-hydrogen",
              input: [
                  { type: "text", text: prompt },
                  {
                      type: "document",
                      data: Buffer.from(pdfResp).toString("base64"),
                      mime_type: "application/pdf"
                  }
              ]
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
      import com.google.genai.gaos.models.interactions.DocumentContent;
      import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.net.URI;
      import java.net.http.HttpClient;
      import java.net.http.HttpRequest;
      import java.net.http.HttpResponse;
      import java.util.Arrays;
      import java.util.Base64;
      import java.util.List;

      Client client = new Client();

      String docUrl = "https://discovery.ucl.ac.uk/id/eprint/10089234/1/343019_3_art_0_py4t4l_convrt.pdf";
      HttpClient httpClient = HttpClient.newHttpClient();
      HttpRequest request = HttpRequest.newBuilder().uri(URI.create(docUrl)).build();
      byte[] docData = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray()).body();
      String base64Pdf = Base64.getEncoder().encodeToString(docData);

      String prompt = "Summarize this document";

      Content docContent =
          DocumentContent.builder()
              .data(base64Pdf)
              .mimeType(DocumentContentMimeType.APPLICATION_PDF)
              .build();
      Content textContent = TextContent.builder().text(prompt).build();

      List<Content> contents = Arrays.asList(docContent, textContent);

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
          "io"
          "log"
          "net/http"

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

          docURL := "https://discovery.ucl.ac.uk/id/eprint/10089234/1/343019_3_art_0_py4t4l_convrt.pdf"
          resp, err := http.Get(docURL)
          if err != nil {
              log.Fatal(err)
          }
          defer resp.Body.Close()
          docData, err := io.ReadAll(resp.Body)
          if err != nil {
              log.Fatal(err)
          }
          base64Pdf := base64.StdEncoding.EncodeToString(docData)

          prompt := "Summarize this document"

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.DocumentContent{
                          Data:     genai.Ptr(base64Pdf),
                          MimeType: interactions.DocumentContentMimeTypeApplicationPdf.ToPointer(),
                      }),
                      interactions.NewContent(interactions.TextContent{
                          Text: prompt,
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
        DOC_URL="https://discovery.ucl.ac.uk/id/eprint/10089234/1/343019_3_art_0_py4t4l_convrt.pdf"
        PROMPT="Summarize this document"
        DISPLAY_NAME="base64_pdf"

        # Download the PDF
        wget -O "${DISPLAY_NAME}.pdf" "${DOC_URL}"

        # Check for FreeBSD base64 and set flags accordingly
        if [[ "$(base64 --version 2>&1)" = *"FreeBSD"* ]]; then
          B64FLAGS="--input"
        else
          B64FLAGS="-w0"
        fi

        # Base64 encode the PDF
        ENCODED_PDF=$(base64 $B64FLAGS "${DISPLAY_NAME}.pdf")

        # Create JSON payload file
        cat <payload.json
      {
        "model": "gemini-4-hydrogen",
        "input": [
          {"type": "document", "data": "${ENCODED_PDF}", "mime_type": "application/pdf"},
          {"type": "text", "text": "${PROMPT}"}
        ]
      }
      EOF

          # Generate content using interactions
          curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
              -H "x-goog-api-key: $GEMINI_API_KEY" \
              -H 'Content-Type: application/json' \
              -H "Api-Revision: 2026-05-20" \
              -d @payload.json 2> /dev/null > response.json

          cat response.json
          echo

          jq ".outputs[] | select(.type == \"text\") | .text" response.json
      ```

=== "CLI"

      ```bash
      curl -sL -o base64_pdf.pdf "https://discovery.ucl.ac.uk/id/eprint/10089234/1/343019_3_art_0_py4t4l_convrt.pdf"
      gemini-api analyze -m gemini-4-hydrogen -i base64_pdf.pdf "Summarize this document"
      ```


## Gemini File API {#file-api}

File API 適用於較大的檔案（最大 2GB），或打算在多個請求中重複使用的檔案。

### 標準檔案上傳 {#standard-file-upload}

將本機檔案上傳至 Gemini API。
以此方式上傳的檔案會暫時保存（48 小時），並經過處理，以便模型有效率地擷取。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      doc_file = client.files.upload(file="path/to/your/sample.pdf")
      prompt = "Summarize this document"

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "text", "text": prompt},
              {"type": "document", "uri": doc_file.uri, "mime_type": doc_file.mime_type}
          ]
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});
      const prompt = "Summarize this document";

      async function main() {
        const filePath = "path/to/your/sample.pdf";

        const myfile = await client.files.upload({
          file: filePath,
          config: { mimeType: "application/pdf" },
        });

        const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: [
              { type: "text", text: prompt },
              { type: "document", uri: myfile.uri, mime_type: myfile.mimeType }
          ]
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
      import com.google.genai.gaos.models.interactions.DocumentContent;
      import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
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

      File docFile =
          client.files.upload(
              new java.io.File("path/to/your/sample.pdf"),
              UploadFileConfig.builder().mimeType("application/pdf").build());

      String prompt = "Summarize this document";

      Content textContent = TextContent.builder().text(prompt).build();
      Content docContent =
          DocumentContent.builder()
              .uri(docFile.uri().orElse(""))
              .mimeType(DocumentContentMimeType.of(docFile.mimeType().orElse("application/pdf")))
              .build();

      List<Content> contents = Arrays.asList(textContent, docContent);

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

          docFile, err := client.Files.UploadFromPath(ctx, "path/to/your/sample.pdf", &genai.UploadFileConfig{
              MIMEType: "application/pdf",
          })
          if err != nil {
              log.Fatal(err)
          }

          prompt := "Summarize this document"

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.TextContent{
                          Text: prompt,
                      }),
                      interactions.NewContent(interactions.DocumentContent{
                          URI:      genai.Ptr(docFile.URI),
                          MimeType: interactions.DocumentContentMimeType(docFile.MIMEType).ToPointer(),
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
      FILE_PATH="path/to/sample.pdf"
      MIME_TYPE=$(file -b --mime-type "${FILE_PATH}")
      NUM_BYTES=$(wc -c < "${FILE_PATH}")
      DISPLAY_NAME=DOCUMENT

      tmp_header_file=upload-header.tmp

      # Initial resumable request defining metadata.
      curl "https://generativelanguage.googleapis.com/upload/v1beta/files" \
        -D "${tmp_header_file}" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
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
        --data-binary "@${FILE_PATH}" 2> /dev/null > file_info.json

      file_uri=$(jq ".file.uri" file_info.json)

      # Now use in an interaction
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -H "Api-Revision: 2026-05-20" \
          -d '{
            "model": "gemini-4-hydrogen",
            "input": [
              {"type": "text", "text": "Summarize this document"},
              {"type": "document", "uri": '$file_uri', "mime_type": "'${MIME_TYPE}'"}
            ]
          }'
      ```

=== "CLI"

      ```bash
      FILE=$(gemini-api files upload path/to/your/sample.pdf --wait)
      gemini-api analyze -m gemini-4-hydrogen -i "$FILE" "Summarize this document"
      ```


### 註冊 Google Cloud Storage 檔案 {#registration}

如果你的資料已經存放在 Google Cloud Storage，就不必再下載並重新上傳。
你可以直接透過 File API 註冊。

1. 將 **Service Agent** 存取權授予每個值區

2.   在你的 Google Cloud 專案中啟用 Gemini API。

3.   建立 Service Agent：


`gcloud beta services identity create --service=generativelanguage.googleapis.com --project=<your_project>`

1.   **Grant the Gemini API Service Agent permissions**，讓它能讀取你的儲存空間
     值區。

     使用者需要將 `Storage Object Viewer`
     [IAM 角色](https://docs.cloud.google.com/storage/docs/access-control/iam-roles#storage.objectViewer)
     指派給這個服務代理，範圍限於打算使用的特定儲存空間值區。


這項存取權預設不會到期，但隨時可以變更。
你也可以使用
[Google Cloud Storage IAM SDK](https://cloud.google.com/iam/docs/write-policy-client-libraries)
指令來授予權限。

1. 驗證你的服務

   **Prerequisites**

   * 啟用 API
   * 建立具備適當權限的服務帳號或代理。


你首先需要以具備儲存空間物件檢視者權限的服務身分進行驗證。
具體方式取決於你的檔案管理程式碼將在哪個環境中執行。

**Outside of Google Cloud**

如果你的程式碼是在 Google Cloud 之外執行（例如你的桌面電腦），
請依照下列步驟，從 Google Cloud Console 下載帳號憑證：

1.   前往 [Service Account console](https://console.cloud.google.com/iam-admin/serviceaccounts)
2.   選取相關的服務帳號
3.   選取 **Keys** 分頁，然後選擇 **Add key, Create new key**
4.   選擇 **JSON** 金鑰類型，並記下檔案下載到你電腦上的位置。

詳情請參閱 Google Cloud 官方文件中有關
[服務帳號金鑰管理](https://docs.cloud.google.com/iam/docs/keys-create-delete)的說明。

接著使用下列指令進行驗證。
這些指令假設你的服務帳號檔案位於目前目錄，檔名為
`service-account.json`。


=== "Python"

      ```python
      from google.oauth2.service_account import Credentials

      GCS_READ_SCOPES = [
        'https://www.googleapis.com/auth/devstorage.read_only',
        'https://www.googleapis.com/auth/cloud-platform'
      ]

      SERVICE_ACCOUNT_FILE = 'service-account.json'

      credentials = Credentials.from_service_account_file(
          SERVICE_ACCOUNT_FILE,
          scopes=GCS_READ_SCOPES
      )
      ```

=== "Javascript"

      ```javascript
      const { GoogleAuth } = require('google-auth-library');

      const GCS_READ_SCOPES = [
        'https://www.googleapis.com/auth/devstorage.read_only',
        'https://www.googleapis.com/auth/cloud-platform'
      ];

      const SERVICE_ACCOUNT_FILE = 'service-account.json';

      const auth = new GoogleAuth({
        keyFile: SERVICE_ACCOUNT_FILE,
        scopes: GCS_READ_SCOPES
      });
      ```

=== "gcloud CLI"

      ```bash
      gcloud auth application-default login \
        --client-id-file=service-account.json \
        --scopes='https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/devstorage.read_only'
      ```

      **On Google Cloud**

      如果你直接在 Google Cloud 中執行，例如使用 [Cloud
        Run functions](https://cloud.google.com/functions) 或
        [Compute Engine instance](https://cloud.google.com/products/compute)，你會有
        隱含的憑證，但仍需要重新驗證，才能授予適當的範圍。

=== "Python"

      這段程式碼假設服務是在能自動取得
        [Application Default Credentials](https://docs.cloud.google.com/docs/authentication/application-default-credentials)
        的環境中執行，例如 Cloud Run 或 Compute Engine。

      ```
      ```python
      ```

      import google.auth

      GCS_READ_SCOPES = [
        'https://www.googleapis.com/auth/devstorage.read_only',
        'https://www.googleapis.com/auth/cloud-platform'
        ]

      credentials, project = google.auth.default(scopes=GCS_READ_SCOPES)
        ```

          {% /tab %}

          {% tab label="JavaScript" %}
          This code expects that the service is running in an environment where
        [Application Default Credentials](https://docs.cloud.google.com/docs/authentication/application-default-credentials)
        can be obtained automatically, such as Cloud Run or Compute Engine.

          ```
      ```javascript
      ```

      const { GoogleAuth } = require('google-auth-library');

      const auth = new GoogleAuth({
        scopes: [
        'https://www.googleapis.com/auth/devstorage.read_only',
        'https://www.googleapis.com/auth/cloud-platform'
        ]
        });
        ```

          {% /tab %}

          {% tab label="Java" %}
          ```java
          import com.google.auth.oauth2.GoogleCredentials;
          import java.io.FileInputStream;
          import java.util.Arrays;
          import java.util.List;
  
          List<String> gcsReadScopes =
          Arrays.asList(
              "https://www.googleapis.com/auth/devstorage.read_only",
              "https://www.googleapis.com/auth/cloud-platform");
  
          String serviceAccountFile = "service-account.json";
  
          GoogleCredentials credentials =
          GoogleCredentials.fromStream(new FileInputStream(serviceAccountFile))
              .createScoped(gcsReadScopes);
          ```

=== "gcloud CLI"

      這是互動式指令。對於 Compute Engine 等服務，你可以在設定層級將範圍
        附加到執行中的服務。範例請見
        [使用者代管服務文件](https://docs.cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances#using)。

      ```
      ```bash
      ```

      gcloud auth application-default login   
        --scopes="https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/devstorage.read_only"
        ```

          {% /tab %}

        {% /tabs %}

        1. File registration (Files API)

           Use the Files API to register files and produce a Files API path that can
           directly be used in the Gemini API.


        {% tabs %}
          {% tab label="Python" %}
          ```python
          from google import genai
  
          client = genai.Client(credentials=credentials)
  
          registered_gcs_files = client.files.register_files(
          uris=["gs://my_bucket/some_object.pdf", "gs://bucket2/object2.txt"]
          )
          prompt = "Summarize this file."
  
          for f in registered_gcs_files.files:
        print(f.name)
        interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
            {"type": "text", "text": prompt},
            {"type": "document", "uri": f.uri, "mime_type": f.mime_type}
          ],
        )
        print(interaction.output_text)
          ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
          const registeredGcsFiles = await ai.files.registerFiles({
              uris: ["gs://my_bucket/some_object.pdf", "gs://bucket2/object2.txt"]
          });

          const prompt = "Summarize this file.";

          for (const file of registeredGcsFiles.files || []) {
              console.log(file.name);
              const interaction = await ai.interactions.create({
                  model: "gemini-4-hydrogen",
                  input: [
                      { type: "text", text: prompt },
                      { type: "document", uri: file.uri, mime_type: file.mimeType }
                  ]
              });

              console.log(interaction.output_text);
          }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.auth.oauth2.GoogleCredentials;
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.DocumentContent;
      import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.File;
      import com.google.genai.types.RegisterFilesResponse;
      import java.io.FileInputStream;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.List;

      GoogleCredentials credentials =
          GoogleCredentials.fromStream(new FileInputStream("service-account.json"))
              .createScoped(
                  Arrays.asList(
                      "https://www.googleapis.com/auth/devstorage.read_only",
                      "https://www.googleapis.com/auth/cloud-platform"));

      Client client = Client.builder().credentials(credentials).build();

      RegisterFilesResponse registeredGcsFiles =
          client.files.registerFiles(
              credentials,
              Arrays.asList("gs://my_bucket/some_object.pdf", "gs://bucket2/object2.txt"),
              null);

      String prompt = "Summarize this file.";

      for (File f : registeredGcsFiles.files().orElse(Collections.emptyList())) {
        System.out.println(f.name().orElse(""));

        Content textContent = TextContent.builder().text(prompt).build();
        Content docContent =
            DocumentContent.builder()
                .uri(f.uri().orElse(""))
                .mimeType(DocumentContentMimeType.of(f.mimeType().orElse("application/pdf")))
                .build();

        CreateModelInteraction params =
            CreateModelInteraction.builder()
                .model(Model.of("gemini-4-hydrogen"))
                .input(InteractionsInput.ofContent(Arrays.asList(textContent, docContent)))
                .build();

        Interaction interaction =
            client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
        System.out.println(interaction.outputText().orElse(""));
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "log"

          "google.golang.org/genai"
      )

      func main() {
          cc := &genai.ClientConfig{}
          if err := cc.UseDefaultCredentials(); err != nil {
              log.Fatal(err)
          }
          _ = cc.Credentials
      }
      ```

=== "REST"

      ```bash
      access_token=$(gcloud auth application-default print-access-token)
      project_id=$(gcloud config get-value project)
      curl -X POST https://generativelanguage.googleapis.com/v1beta/files:register \
          -H 'Content-Type: application/json' \
          -H "Authorization: Bearer ${access_token}" \
          -H "x-goog-user-project: ${project_id}" \
          -d '{"uris": ["gs://bucket/object1", "gs://bucket/object2"]}'
      ```

=== "CLI"

      ```bash
      gemini-api files register \
        --uris '["gs://my_bucket/some_object.pdf", "gs://bucket2/object2.txt"]' \
        --access-token "$(gcloud auth application-default print-access-token)" \
        --user-project "$(gcloud config get-value project)"
      ```


## 外部 HTTP / 簽署 URL {#external-urls}

你可以直接在請求中傳入可公開存取的 HTTPS URL 或預先簽署的 URL。
Gemini API 會在處理過程中安全地擷取內容。
這種方式最適合不想重新上傳的檔案。每個檔案最大可達
15 MB。較大的檔案請使用
[File API](/docs/file-input-methods/#file-api)。


!!! note " "

      不支援 Gemini 2.0 系列模型


=== "Python"

      ```python
      from google import genai

      uri = "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf"
      prompt = "Summarize this file"

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "document", "uri": uri, "mime_type": "application/pdf"},
              {"type": "text", "text": prompt}
          ]
      )
      print(interaction.output_text)
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.DocumentContent;
      import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.List;

      String uri = "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";
      String prompt = "Summarize this file";

      Client client = new Client();

      Content docContent =
          DocumentContent.builder()
              .uri(uri)
              .mimeType(DocumentContentMimeType.APPLICATION_PDF)
              .build();
      Content textContent = TextContent.builder().text(prompt).build();

      List<Content> contents = Arrays.asList(docContent, textContent);

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
          cc := &genai.ClientConfig{}
          if err := cc.UseDefaultCredentials(); err != nil {
              log.Fatal(err)
          }
          client, err := genai.NewClient(ctx, cc)
          if err != nil {
              log.Fatal(err)
          }

          registeredGcsFiles, err := client.Files.RegisterFiles(
              ctx,
              []string{"gs://my_bucket/some_object.pdf", "gs://bucket2/object2.txt"},
              cc.Credentials,
              nil,
          )
          if err != nil {
              log.Fatal(err)
          }

          prompt := "Summarize this file."

          for _, f := range registeredGcsFiles.Files {
              fmt.Println(f.Name)
              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                  Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput([]interactions.Content{
                          interactions.NewContent(interactions.TextContent{
                              Text: prompt,
                          }),
                          interactions.NewContent(interactions.DocumentContent{
                              URI:      genai.Ptr(f.URI),
                              MimeType: interactions.DocumentContentMimeType(f.MIMEType).ToPointer(),
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
      }
      ```

=== "Javascript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const uri = "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";

      async function main() {
        const interaction = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          input: [
            { type: "document", uri: uri, mime_type: "application/pdf" },
            { type: "text", text: "summarize this file" }
          ]
        });

        console.log(interaction.output_text);
      }

      await main();
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
            -H 'x-goog-api-key: $GEMINI_API_KEY' \
            -H 'Content-Type: application/json' \
            -H "Api-Revision: 2026-05-20" \
            -d '{
                "model": "gemini-4-hydrogen",
                "input": [
                  {"type": "text", "text": "Summarize this pdf"},
                  {
                    "type": "document",
                    "uri": "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
                    "mime_type": "application/pdf"
                  }
                ]
              }'
      ```

=== "CLI"

      ```bash
      gemini-api generate -m gemini-4-hydrogen --body '{
        "input": [
          {"type": "document", "uri": "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf", "mime_type": "application/pdf"},
          {"type": "text", "text": "Summarize this file"}
        ]
      }'
      ```


### 可存取性 {#accessibility}

請確認你提供的 URL 不會導向需要登入或設有付費牆的頁面。
對於私人資料庫，請務必建立具備正確存取權限與到期時間的簽署 URL。

### 安全檢查 {#safety-checks}

系統會對 URL 執行內容審核檢查，確認其符合安全與政策標準。
如果 URL 未通過這項檢查，你會收到
`url_retrieval_status` 為 `URL_RETRIEVAL_STATUS_UNSAFE`。

### 支援的內容類型 {#supported-content-types}

這份支援的檔案類型與限制清單僅供初步參考，並不完整。
實際支援的類型可能有所變更，也可能因所使用的模型與 tokenizer 版本而異。
不支援的類型會導致錯誤。
此外，這些檔案類型的內容擷取
僅支援可公開存取的 URL。

#### 文字檔案類型 {#text-file-types}

* `text/html`
* `text/css`
* `text/plain`
* `text/xml`
* `text/csv`
* `text/rtf`
* `text/javascript`

#### 應用程式檔案類型 {#application-file-types}

* `application/json`
* `application/pdf`

#### 圖片檔案類型 {#image-file-types}

* `image/bmp`
* `image/jpeg`
* `image/png`
* `image/webp`

#### 音訊檔案類型 {#audio-file-types}

* `audio/wav`
* `audio/mp3`
* `audio/aiff`
* `audio/aac`
* `audio/ogg`
* `audio/flac`
* `audio/mpeg`
* `audio/m4a`
* `audio/l16`
* `audio/opus`
* `audio/alaw`
* `audio/mulaw`
* `audio/webm`

#### 影片檔案類型 {#video-file-types}

* `video/mp4`
* `video/mpeg`
* `video/quicktime`
* `video/avi`
* `video/x-flv`
* `video/mpg`
* `video/webm`
* `video/wmv`
* `video/3gpp`

## 最佳實務 {#best-practices}

* **選擇合適的方法**：小型、暫時性的檔案使用行內資料；
  較大或經常使用的檔案使用 File API；已託管在網路上的資料使用外部 URL。

* **指定 MIME 類型**：務必為檔案資料提供正確的 MIME 類型，
  以確保正確處理。

* **處理錯誤**：在程式碼中實作錯誤處理，以因應
  網路故障、檔案存取問題或 API 錯誤等潛在狀況。


## 限制 {#limitations}

* 檔案大小上限依方法（見[比較表](/docs/file-input-methods/#method-comparison)）
  與檔案類型而異。

* 行內資料會增加請求酬載的大小。

* File API 上傳的檔案是暫時性的，48 小時後到期。

* 外部 URL 擷取每個檔案上限為 15 MB，且僅支援特定
  內容類型。


## 後續步驟 {#whats-next}

* 試著使用
  [Google AI Studio](http://aistudio.google.com/) 撰寫你自己的多模態提示詞。

* 如需在提示詞中納入檔案的相關資訊，請參閱
  [Vision](/docs/image-understanding/)、
  [Audio](/docs/audio/) 與
  [文件處理](/docs/document-processing/)
  指南。
