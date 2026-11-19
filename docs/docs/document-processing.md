# 文件理解

Gemini 模型能處理 PDF 格式的文件，運用原生視覺能力理解文件的完整脈絡。這不只是擷取文字而已，Gemini 還能：

* 分析與解讀內容，包括文字、圖片、示意圖、圖表與表格，即使是長達 1000 頁的文件也不例外。

* 將資訊擷取為[結構化輸出](/docs/structured-output/)格式。

* 根據文件中的視覺與文字元素進行摘要並回答問題。

* 轉錄文件內容（例如轉為 HTML），同時保留版面配置與格式，供下游應用程式使用。


你也可以傳入 Microsoft Office 與 OpenDocument 檔案，例如 Word 文件、PowerPoint 簡報與 Excel 試算表。若要檢查特定頁面、工作表或內容圖層，而非整份檔案，請見[自訂文件、簡報與試算表處理](/docs/document-processing/#customize-document-processing)。其他非 PDF 文件，例如 TXT、Markdown 或 HTML 檔案，會以純文字方式處理，因此圖表、格式等脈絡資訊將不復存在。

## 在請求中內嵌傳入 PDF 資料 {#inline_data}

你可以在請求中直接內嵌傳入 PDF 資料。這種方式最適合較小的文件，或不需要在後續請求中再次引用檔案的臨時處理情境。若文件較大，且需要在多輪互動中引用，我們建議改用 [Files API](/docs/document-processing/#large-pdfs)，以改善請求延遲並減少頻寬用量。

以下範例示範如何內嵌傳入 PDF 資料：


=== "Python"

      ```python
      from google import genai
      import base64

      client = genai.Client()

      with open('path/to/document.pdf', 'rb') as f:
          pdf_bytes = f.read()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {
                  "type": "document",
                  "data": base64.b64encode(pdf_bytes).decode('utf-8'),
                  "mime_type": "application/pdf"
              },
              {"type": "text", "text": "Summarize this document"}
          ]
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      const ai = new GoogleGenAI({});

      async function main() {
          const pdfData = fs.readFileSync("path/to/document.pdf", {
              encoding: "base64"
          });

          const interaction = await ai.interactions.create({
              model: "gemini-4-hydrogen",
              input: [
                  { type: "text", text: "Summarize this document" },
                  {
                      type: "document",
                      data: pdfData,
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

      byte[] pdfBytes = Files.readAllBytes(Paths.get("path/to/document.pdf"));
      String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);

      Content docContent =
          DocumentContent.builder()
              .data(base64Pdf)
              .mimeType(DocumentContentMimeType.APPLICATION_PDF)
              .build();
      Content textContent = TextContent.builder().text("Summarize this document").build();

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

          pdfBytes, err := os.ReadFile("path/to/document.pdf")
          if err != nil {
              log.Fatal(err)
          }
          base64Pdf := base64.StdEncoding.EncodeToString(pdfBytes)

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: genai.Ptr(interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.DocumentContent{
                          Data:     genai.Ptr(base64Pdf),
                          MimeType: interactions.DocumentContentMimeTypeApplicationPdf.ToPointer(),
                      }),
                      interactions.NewContent(interactions.TextContent{
                          Text: "Summarize this document",
                      }),
                  })),
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
      PDF_PATH="path/to/document.pdf"

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
          {
            "type": "document",
            "data": "'$(base64 $B64FLAGS $PDF_PATH)'",
            "mime_type": "application/pdf"
          },
          {"type": "text", "text": "Summarize this document"}
        ]
      }'
      ```

=== "CLI"

      ```bash
      gemini-api analyze -i path/to/document.pdf "Summarize this document"
      ```


你也可以上傳本機的 PDF 檔案進行處理：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      uploaded_file = client.files.upload(file="file.pdf")

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "document", "uri": uploaded_file.uri, "mime_type": uploaded_file.mime_type},
              {"type": "text", "text": "Summarize this document"}
          ]
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
          const uploadedFile = await ai.files.upload({
              file: "file.pdf",
              config: { mimeType: "application/pdf" }
          });

          const interaction = await ai.interactions.create({
              model: "gemini-4-hydrogen",
              input: [
                  { type: "text", text: "Summarize this document" },
                  {
                      type: "document",
                      uri: uploadedFile.uri,
                      mime_type: uploadedFile.mimeType
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
      import com.google.genai.types.File;
      import com.google.genai.types.UploadFileConfig;
      import java.util.Arrays;
      import java.util.List;

      Client client = new Client();

      File uploadedFile =
          client.files.upload(
              new java.io.File("file.pdf"),
              UploadFileConfig.builder().mimeType("application/pdf").build());

      Content docContent =
          DocumentContent.builder()
              .uri(uploadedFile.uri().orElse(""))
              .mimeType(DocumentContentMimeType.of(uploadedFile.mimeType().orElse("application/pdf")))
              .build();
      Content textContent = TextContent.builder().text("Summarize this document").build();

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
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          uploadedFile, err := client.Files.UploadFromPath(ctx, "file.pdf", &genai.UploadFileConfig{
              MIMEType: "application/pdf",
          })
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: genai.Ptr(interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.DocumentContent{
                          URI:      genai.Ptr(uploadedFile.URI),
                          MimeType: interactions.DocumentContentMimeType(uploadedFile.MIMEType).ToPointer(),
                      }),
                      interactions.NewContent(interactions.TextContent{
                          Text: "Summarize this document",
                      }),
                  })),
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

=== "CLI"

      ```bash
      FILE=$(gemini-api files upload file.pdf --wait)
      gemini-api analyze -i "$FILE" "Summarize this document"
      ```


## 使用 Files API 上傳 PDF {#large-pdfs}

若檔案較大，或打算在多個請求中重複使用同一份文件，建議使用 Files API。將檔案上傳與模型請求分開處理，能改善請求延遲並減少頻寬用量。


!!! note " "

      只要是 Gemini API 提供服務的地區，Files API 皆可免費使用。上傳的檔案會保存 48 小時。


### 來自 URL 的大型 PDF {#large-pdfs-urls}

使用 File API 可以簡化從 URL 上傳與處理大型 PDF 檔案的流程：


=== "Python"

      ```python
      from google import genai
      import io
      import httpx

      client = genai.Client()

      long_context_pdf_path = "https://arxiv.org/pdf/2312.11805"

      doc_io = io.BytesIO(httpx.get(long_context_pdf_path).content)

      sample_doc = client.files.upload(
        file=doc_io,
        config=dict(
          mime_type='application/pdf')
      )

      prompt = "Summarize this document"

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "document", "uri": sample_doc.uri, "mime_type": sample_doc.mime_type},
              {"type": "text", "text": prompt}
          ]
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {

          const pdfBuffer = await fetch("https://arxiv.org/pdf/2312.11805")
              .then((response) => response.arrayBuffer());

          const fileBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

          const file = await ai.files.upload({
              file: fileBlob,
              config: {
                  displayName: 'A17_FlightPlan.pdf',
              },
          });

          let getFile = await ai.files.get({ name: file.name || "" });
          while (getFile.state === 'PROCESSING') {
              getFile = await ai.files.get({ name: file.name || "" });
              console.log(`current file status: ${getFile.state}`);
              console.log('File is still processing, retrying in 5 seconds');

              await new Promise((resolve) => {
                  setTimeout(resolve, 5000);
              });
          }
          if (file.state === 'FAILED') {
              throw new Error('File processing failed.');
          }

          const interaction = await ai.interactions.create({
              model: 'gemini-4-hydrogen',
              input: [
                  { type: "document", uri: file.uri, mime_type: file.mimeType },
                  { type: "text", text: "Summarize this document" }
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
      import com.google.genai.gaos.models.interactions.DocumentContent;
      import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.File;
      import com.google.genai.types.UploadFileConfig;
      import java.net.URI;
      import java.net.http.HttpClient;
      import java.net.http.HttpRequest;
      import java.net.http.HttpResponse;
      import java.util.Arrays;
      import java.util.List;

      Client client = new Client();

      String longContextPdfPath = "https://arxiv.org/pdf/2312.11805";
      HttpClient httpClient = HttpClient.newHttpClient();
      HttpRequest request = HttpRequest.newBuilder().uri(URI.create(longContextPdfPath)).build();
      byte[] pdfBytes = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray()).body();

      File sampleDoc =
          client.files.upload(
              pdfBytes, UploadFileConfig.builder().mimeType("application/pdf").build());

      String prompt = "Summarize this document";

      Content docContent =
          DocumentContent.builder()
              .uri(sampleDoc.uri().orElse(""))
              .mimeType(DocumentContentMimeType.of(sampleDoc.mimeType().orElse("application/pdf")))
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
          "bytes"
          "context"
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

          longContextPdfPath := "https://arxiv.org/pdf/2312.11805"
          resp, err := http.Get(longContextPdfPath)
          if err != nil {
              log.Fatal(err)
          }
          defer resp.Body.Close()
          pdfBytes, err := io.ReadAll(resp.Body)
          if err != nil {
              log.Fatal(err)
          }

          sampleDoc, err := client.Files.Upload(ctx, bytes.NewReader(pdfBytes), &genai.UploadFileConfig{
              MIMEType: "application/pdf",
          })
          if err != nil {
              log.Fatal(err)
          }

          prompt := "Summarize this document"

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: genai.Ptr(interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.DocumentContent{
                          URI:      genai.Ptr(sampleDoc.URI),
                          MimeType: interactions.DocumentContentMimeType(sampleDoc.MIMEType).ToPointer(),
                      }),
                      interactions.NewContent(interactions.TextContent{
                          Text: prompt,
                      }),
                  })),
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
      PDF_PATH="https://arxiv.org/pdf/2312.11805"
      DISPLAY_NAME="Gemini_paper"
      PROMPT="Summarize this document"

      wget -O "${DISPLAY_NAME}.pdf" "${PDF_PATH}"

      MIME_TYPE=$(file -b --mime-type "${DISPLAY_NAME}.pdf")
      NUM_BYTES=$(wc -c < "${DISPLAY_NAME}.pdf")

      echo "MIME_TYPE: ${MIME_TYPE}"
      echo "NUM_BYTES: ${NUM_BYTES}"

      tmp_header_file=upload-header.tmp

      curl "https://generativelanguage.googleapis.com/upload/v1beta/files?key=${GEMINI_API_KEY}" \
      -D upload-header.tmp \
      -H "X-Goog-Upload-Protocol: resumable" \
      -H "X-Goog-Upload-Command: start" \
      -H "X-Goog-Upload-Header-Content-Length: ${NUM_BYTES}" \
      -H "X-Goog-Upload-Header-Content-Type: ${MIME_TYPE}" \
      -H "Content-Type: application/json" \
      -d "{'file': {'display_name': '${DISPLAY_NAME}'}}" 2> /dev/null

      upload_url=$(grep -i "x-goog-upload-url: " "${tmp_header_file}" | cut -d" " -f2 | tr -d "\r")
      rm "${tmp_header_file}"

      curl "${upload_url}" \
      -H "Content-Length: ${NUM_BYTES}" \
      -H "X-Goog-Upload-Offset: 0" \
      -H "X-Goog-Upload-Command: upload, finalize" \
      --data-binary "@${DISPLAY_NAME}.pdf" 2> /dev/null > file_info.json

      file_uri=$(jq -r ".file.uri" file_info.json)
      echo "file_uri: ${file_uri}"

      cat << EOF > payload.json
      {
      "model": "gemini-4-hydrogen",
      "input": [
        {"type": "text", "text": "${PROMPT}"},
        {"type": "document", "uri": "${file_uri}", "mime_type": "application/pdf"}
      ]
      }
      EOF

      curl "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -X POST \
        -d @payload.json 2> /dev/null > response.json

      cat response.json
      echo

      jq ".steps[-1].content[0].text" response.json

      rm "${DISPLAY_NAME}.pdf"
      rm payload.json
      ```

=== "CLI"

      ```bash
      curl -sL -o Gemini_paper.pdf "https://arxiv.org/pdf/2312.11805"
      FILE=$(gemini-api files upload Gemini_paper.pdf --wait)
      gemini-api analyze -i "$FILE" "Summarize this document"
      ```


### 儲存在本機的大型 PDF {#large-pdfs-local}


=== "Python"

      ```python
      from google import genai
      import pathlib

      client = genai.Client()

      file_path = pathlib.Path('large_file.pdf')
      sample_file = client.files.upload(
          file=file_path,
      )

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "document", "uri": sample_file.uri, "mime_type": sample_file.mime_type},
              {"type": "text", "text": "Summarize this document"}
          ]
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
          const file = await ai.files.upload({
              file: 'path-to-localfile.pdf',
              config: {
                  displayName: 'A17_FlightPlan.pdf',
              },
          });

          let getFile = await ai.files.get({ name: file.name || "" });
          while (getFile.state === 'PROCESSING') {
              getFile = await ai.files.get({ name: file.name || "" });
              console.log(`current file status: ${getFile.state}`);
              console.log('File is still processing, retrying in 5 seconds');

              await new Promise((resolve) => {
                  setTimeout(resolve, 5000);
              });
          }
          if (file.state === 'FAILED') {
              throw new Error('File processing failed.');
          }

          const interaction = await ai.interactions.create({
              model: 'gemini-4-hydrogen',
              input: [
                  { type: "document", uri: file.uri, mime_type: file.mimeType },
                  { type: "text", text: "Summarize this document" }
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

      File sampleFile =
          client.files.upload(
              new java.io.File("large_file.pdf"),
              UploadFileConfig.builder().mimeType("application/pdf").build());

      Content docContent =
          DocumentContent.builder()
              .uri(sampleFile.uri().orElse(""))
              .mimeType(DocumentContentMimeType.of(sampleFile.mimeType().orElse("application/pdf")))
              .build();
      Content textContent = TextContent.builder().text("Summarize this document").build();

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
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          sampleFile, err := client.Files.UploadFromPath(ctx, "large_file.pdf", &genai.UploadFileConfig{
              MIMEType: "application/pdf",
          })
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: genai.Ptr(interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.DocumentContent{
                          URI:      genai.Ptr(sampleFile.URI),
                          MimeType: interactions.DocumentContentMimeType(sampleFile.MIMEType).ToPointer(),
                      }),
                      interactions.NewContent(interactions.TextContent{
                          Text: "Summarize this document",
                      }),
                  })),
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
      PDF_PATH="path/to/large_file.pdf"
      NUM_BYTES=$(wc -c < "${PDF_PATH}")
      DISPLAY_NAME=TEXT
      tmp_header_file=upload-header.tmp

      curl "https://generativelanguage.googleapis.com/upload/v1beta/files?key=${GEMINI_API_KEY}" \
      -D upload-header.tmp \
      -H "X-Goog-Upload-Protocol: resumable" \
      -H "X-Goog-Upload-Command: start" \
      -H "X-Goog-Upload-Header-Content-Length: ${NUM_BYTES}" \
      -H "X-Goog-Upload-Header-Content-Type: application/pdf" \
      -H "Content-Type: application/json" \
      -d "{'file': {'display_name': '${DISPLAY_NAME}'}}" 2> /dev/null

      upload_url=$(grep -i "x-goog-upload-url: " "${tmp_header_file}" | cut -d" " -f2 | tr -d "\r")
      rm "${tmp_header_file}"

      curl "${upload_url}" \
      -H "Content-Length: ${NUM_BYTES}" \
      -H "X-Goog-Upload-Offset: 0" \
      -H "X-Goog-Upload-Command: upload, finalize" \
      --data-binary "@${PDF_PATH}" 2> /dev/null > file_info.json

      file_uri=$(jq ".file.uri" file_info.json)
      echo file_uri=$file_uri

      curl "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -X POST \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {"type": "document", "uri": '$file_uri', "mime_type": "application/pdf"},
            {"type": "text", "text": "Can you add a few more lines to this poem?"}
          ]
        }' 2> /dev/null > response.json

      cat response.json
      echo

      jq ".steps[-1].content[0].text" response.json
      ```

=== "CLI"

      ```bash
      FILE=$(gemini-api files upload large_file.pdf --wait)
      gemini-api analyze -i "$FILE" "Summarize this document"
      ```


你可以呼叫 [`files.get`](/api-reference/files/get-file/)，確認 API 已成功儲存上傳的檔案並取得其詮釋資料。只有 `name`（連帶 `uri`）是唯一的。


=== "Python"

      ```python
      from google import genai
      import pathlib

      client = genai.Client()

      fpath = pathlib.Path('example.pdf')
      fpath.write_text('hello')

      file = client.files.upload(file='example.pdf')

      file_info = client.files.get(name=file.name)
      print(file_info.model_dump_json(indent=4))
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.File;
      import com.google.genai.types.UploadFileConfig;
      import java.nio.charset.StandardCharsets;
      import java.nio.file.Files;
      import java.nio.file.Path;
      import java.nio.file.Paths;

      Client client = new Client();

      Path fpath = Paths.get("example.pdf");
      Files.write(fpath, "hello".getBytes(StandardCharsets.UTF_8));

      File file =
          client.files.upload(
              fpath.toFile(), UploadFileConfig.builder().mimeType("application/pdf").build());

      File fileInfo = client.files.get(file.name().orElse(""), null);
      System.out.println(fileInfo.toJson());
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "os"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          if err := os.WriteFile("example.pdf", []byte("hello"), 0644); err != nil {
              log.Fatal(err)
          }

          file, err := client.Files.UploadFromPath(ctx, "example.pdf", &genai.UploadFileConfig{
              MIMEType: "application/pdf",
          })
          if err != nil {
              log.Fatal(err)
          }

          fileInfo, err := client.Files.Get(ctx, file.Name, nil)
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(fileInfo)
      }
      ```

=== "REST"

      ```shell
      name=$(jq -r ".file.name" file_info.json)
      curl "https://generativelanguage.googleapis.com/v1beta/$name?key=$GEMINI_API_KEY" > file_info.json
      name=$(jq -r ".name" file_info.json)
      echo name=$name
      file_uri=$(jq -r ".uri" file_info.json)
      echo file_uri=$file_uri
      ```

=== "CLI"

      ```bash
      FILE=$(gemini-api files upload example.pdf)
      gemini-api files get "$FILE" -o json
      ```


## 傳入多份 PDF {#prompt-multiple}

Gemini API 能在單一請求中處理多份 PDF 文件（最多 1000 頁），前提是文件與文字提示詞的合計大小不超過模型的上下文視窗。


=== "Python"

      ```python
      from google import genai
      import io
      import httpx

      client = genai.Client()

      doc_url_1 = "https://arxiv.org/pdf/2312.11805"
      doc_url_2 = "https://arxiv.org/pdf/2403.05530"

      doc_data_1 = io.BytesIO(httpx.get(doc_url_1).content)
      doc_data_2 = io.BytesIO(httpx.get(doc_url_2).content)

      sample_pdf_1 = client.files.upload(
        file=doc_data_1,
        config=dict(mime_type='application/pdf')
      )
      sample_pdf_2 = client.files.upload(
        file=doc_data_2,
        config=dict(mime_type='application/pdf')
      )

      prompt = "What is the difference between each of the main benchmarks between these two papers? Output these in a table."

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "document", "uri": sample_pdf_1.uri, "mime_type": sample_pdf_1.mime_type},
              {"type": "document", "uri": sample_pdf_2.uri, "mime_type": sample_pdf_2.mime_type},
              {"type": "text", "text": prompt}
          ]
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function uploadRemotePDF(url = '', displayName = '') {
          const pdfBuffer = await fetch(url)
              .then((response) => response.arrayBuffer());

          const fileBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

          const file = await ai.files.upload({
              file: fileBlob,
              config: {
                  displayName: displayName,
              },
          });

          let getFile = await ai.files.get({ name: file.name || "" });
          while (getFile.state === 'PROCESSING') {
              getFile = await ai.files.get({ name: file.name || "" });
              console.log(`current file status: ${getFile.state}`);
              console.log('File is still processing, retrying in 5 seconds');

              await new Promise((resolve) => {
                  setTimeout(resolve, 5000);
              });
          }
          if (file.state === 'FAILED') {
              throw new Error('File processing failed.');
          }

          return file;
      }

      async function main() {
          const file1 = await uploadRemotePDF("https://arxiv.org/pdf/2312.11805", "PDF 1");
          const file2 = await uploadRemotePDF("https://arxiv.org/pdf/2403.05530", "PDF 2");

          const interaction = await ai.interactions.create({
              model: 'gemini-4-hydrogen',
              input: [
                  { type: "document", uri: file1.uri, mime_type: file1.mimeType },
                  { type: "document", uri: file2.uri, mime_type: file2.mimeType },
                  { type: "text", text: "What is the difference between each of the main benchmarks between these two papers? Output these in a table." }
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
      import com.google.genai.gaos.models.interactions.DocumentContent;
      import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.File;
      import com.google.genai.types.UploadFileConfig;
      import java.net.URI;
      import java.net.http.HttpClient;
      import java.net.http.HttpRequest;
      import java.net.http.HttpResponse;
      import java.util.Arrays;
      import java.util.List;

      Client client = new Client();

      String docUrl1 = "https://arxiv.org/pdf/2312.11805";
      String docUrl2 = "https://arxiv.org/pdf/2403.05530";

      HttpClient httpClient = HttpClient.newHttpClient();
      byte[] docData1 =
          httpClient
              .send(HttpRequest.newBuilder().uri(URI.create(docUrl1)).build(), HttpResponse.BodyHandlers.ofByteArray())
              .body();
      byte[] docData2 =
          httpClient
              .send(HttpRequest.newBuilder().uri(URI.create(docUrl2)).build(), HttpResponse.BodyHandlers.ofByteArray())
              .body();

      File samplePdf1 =
          client.files.upload(
              docData1, UploadFileConfig.builder().mimeType("application/pdf").build());
      File samplePdf2 =
          client.files.upload(
              docData2, UploadFileConfig.builder().mimeType("application/pdf").build());

      String prompt =
          "What is the difference between each of the main benchmarks between these two papers? Output these in a table.";

      Content doc1Content =
          DocumentContent.builder()
              .uri(samplePdf1.uri().orElse(""))
              .mimeType(DocumentContentMimeType.of(samplePdf1.mimeType().orElse("application/pdf")))
              .build();
      Content doc2Content =
          DocumentContent.builder()
              .uri(samplePdf2.uri().orElse(""))
              .mimeType(DocumentContentMimeType.of(samplePdf2.mimeType().orElse("application/pdf")))
              .build();
      Content textContent = TextContent.builder().text(prompt).build();

      List<Content> contents = Arrays.asList(doc1Content, doc2Content, textContent);

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
          "bytes"
          "context"
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

          docURL1 := "https://arxiv.org/pdf/2312.11805"
          docURL2 := "https://arxiv.org/pdf/2403.05530"

          resp1, err := http.Get(docURL1)
          if err != nil {
              log.Fatal(err)
          }
          defer resp1.Body.Close()
          docData1, err := io.ReadAll(resp1.Body)
          if err != nil {
              log.Fatal(err)
          }

          resp2, err := http.Get(docURL2)
          if err != nil {
              log.Fatal(err)
          }
          defer resp2.Body.Close()
          docData2, err := io.ReadAll(resp2.Body)
          if err != nil {
              log.Fatal(err)
          }

          samplePdf1, err := client.Files.Upload(ctx, bytes.NewReader(docData1), &genai.UploadFileConfig{
              MIMEType: "application/pdf",
          })
          if err != nil {
              log.Fatal(err)
          }
          samplePdf2, err := client.Files.Upload(ctx, bytes.NewReader(docData2), &genai.UploadFileConfig{
              MIMEType: "application/pdf",
          })
          if err != nil {
              log.Fatal(err)
          }

          prompt := "What is the difference between each of the main benchmarks between these two papers? Output these in a table."

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: genai.Ptr(interactions.NewInteractionsInput([]interactions.Content{
                      interactions.NewContent(interactions.DocumentContent{
                          URI:      genai.Ptr(samplePdf1.URI),
                          MimeType: interactions.DocumentContentMimeType(samplePdf1.MIMEType).ToPointer(),
                      }),
                      interactions.NewContent(interactions.DocumentContent{
                          URI:      genai.Ptr(samplePdf2.URI),
                          MimeType: interactions.DocumentContentMimeType(samplePdf2.MIMEType).ToPointer(),
                      }),
                      interactions.NewContent(interactions.TextContent{
                          Text: prompt,
                      }),
                  })),
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
      DOC_URL_1="https://arxiv.org/pdf/2312.11805"
      DOC_URL_2="https://arxiv.org/pdf/2403.05530"
      DISPLAY_NAME_1="Gemini_paper"
      DISPLAY_NAME_2="Gemini_1.5_paper"
      PROMPT="What is the difference between each of the main benchmarks between these two papers? Output these in a table."

      upload_pdf() {
      local doc_url="$1"
      local display_name="$2"

      echo "Downloading ${display_name} from ${doc_url}..." >&2
      wget -O "${display_name}.pdf" "${doc_url}" 2> /dev/null

      local MIME_TYPE=$(file -b --mime-type "${display_name}.pdf")
      local NUM_BYTES=$(wc -c < "${display_name}.pdf")

      echo "MIME_TYPE: ${MIME_TYPE}" >&2
      echo "NUM_BYTES: ${NUM_BYTES}" >&2

      local tmp_header_file="upload-header-${display_name}.tmp"

      curl "https://generativelanguage.googleapis.com/upload/v1beta/files?key=${GEMINI_API_KEY}" \
        -D "${tmp_header_file}" \
        -H "X-Goog-Upload-Protocol: resumable" \
        -H "X-Goog-Upload-Command: start" \
        -H "X-Goog-Upload-Header-Content-Length: ${NUM_BYTES}" \
        -H "X-Goog-Upload-Header-Content-Type: ${MIME_TYPE}" \
        -H "Content-Type: application/json" \
        -d "{'file': {'display_name': '${display_name}'}}" 2> /dev/null

      local upload_url=$(grep -i "x-goog-upload-url: " "${tmp_header_file}" | cut -d" " -f2 | tr -d "\r")
      rm "${tmp_header_file}"

      echo "Upload URL for ${display_name}: ${upload_url}" >&2

      curl "${upload_url}" \
        -H "Content-Length: ${NUM_BYTES}" \
        -H "X-Goog-Upload-Offset: 0" \
        -H "X-Goog-Upload-Command: upload, finalize" \
        --data-binary "@${display_name}.pdf" 2> /dev/null > "file_info_${display_name}.json"

      local file_uri=$(jq -r ".file.uri" "file_info_${display_name}.json")
      echo "file_uri for ${display_name}: ${file_uri}" >&2

      rm "${display_name}.pdf"

      echo "${file_uri}"
      }

      file_uri_1=$(upload_pdf "${DOC_URL_1}" "${DISPLAY_NAME_1}")

      file_uri_2=$(upload_pdf "${DOC_URL_2}" "${DISPLAY_NAME_2}")

      cat << EOF > payload_multi.json
      {
      "model": "gemini-4-hydrogen",
      "input": [
        {"type": "document", "uri": "${file_uri_1}", "mime_type": "application/pdf"},
        {"type": "document", "uri": "${file_uri_2}", "mime_type": "application/pdf"},
        {"type": "text", "text": "${PROMPT}"}
      ]
      }
      EOF

      curl "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -X POST \
        -d @payload_multi.json 2> /dev/null > response.json

      cat response.json
      echo

      jq ".steps[-1].content[0].text" response.json

      rm payload_multi.json
      rm "file_info_${DISPLAY_NAME_1}.json"
      rm "file_info_${DISPLAY_NAME_2}.json"
      ```

=== "CLI"

      ```bash
      curl -sL -o Gemini_paper.pdf "https://arxiv.org/pdf/2312.11805"
      curl -sL -o Gemini_1.5_paper.pdf "https://arxiv.org/pdf/2403.05530"
      PDF_1=$(gemini-api files upload Gemini_paper.pdf --wait)
      PDF_2=$(gemini-api files upload Gemini_1.5_paper.pdf --wait)
      gemini-api analyze -i "$PDF_1" -i "$PDF_2" \
        "What is the difference between each of the main benchmarks between these two papers? Output these in a table."
      ```


## Office 與 OpenDocument 檔案 {#office-documents}

Gemini 模型處理 Microsoft Office 與 OpenDocument 檔案的方式與 PDF 相同。請以內嵌方式或透過 Files API 傳入，並使用 `document` 內容區塊與下列其中一種 MIME 類型：

| 檔案類型 | 副檔名 | MIME 類型 |
| --- | --- | --- |
| 文件 | `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
|  | `.doc` | `application/msword` |
|  | `.dotx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.template` |
|  | `.odt` | `application/vnd.oasis.opendocument.text` |
| 簡報 | `.pptx` | `application/vnd.openxmlformats-officedocument.presentationml.presentation` |
|  | `.ppt` | `application/vnd.ms-powerpoint` |
|  | `.odp` | `application/vnd.oasis.opendocument.presentation` |
| 試算表 | `.xlsx` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
|  | `.xls` | `application/vnd.ms-excel` |
|  | `.ods` | `application/vnd.oasis.opendocument.spreadsheet` |

若未指定 `processing` 選項，Gemini 會使用以下預設值擷取整份檔案：

| 副檔名 | Gemini 4 以上 | Gemini 3 與 2.5 |
| :--- | :--- | :--- |
| `.docx`、`.dotx`、`.odt`、`.pptx` | 頁面／投影片圖片（中解析度，每頁約 560 個權杖） | 擷取文字（＋內嵌圖片） |
| `.doc`、`.ppt`、`.odp` | 頁面／投影片圖片（中解析度，每頁約 560 個權杖） | 頁面／投影片圖片 |
| `.xlsx`、`.xls` | 所有工作表：值、公式、工作表名稱 | 所有工作表以 CSV 呈現（僅值） |
| `.ods` | 所有工作表：值、公式、工作表名稱 | 所有工作表：值、公式、工作表名稱 |

以下範例使用 Files API 上傳一份 PowerPoint 簡報，並請模型加以摘要：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      deck = client.files.upload(
          file="quarterly_review.pptx",
          config={
              "mime_type": "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          },
      )

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {"type": "document", "uri": deck.uri, "mime_type": deck.mime_type},
              {"type": "text", "text": "Summarize the key takeaways from each slide."},
          ],
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
        const deck = await ai.files.upload({
          file: "quarterly_review.pptx",
          config: {
            mimeType:
              "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          },
        });

        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: [
            { type: "document", uri: deck.uri, mime_type: deck.mimeType },
            { type: "text", text: "Summarize the key takeaways from each slide." },
          ],
        });
        console.log(interaction.output_text);
      }

      main();
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {
              "type": "document",
              "uri": "https://generativelanguage.googleapis.com/v1beta/files/FILE_ID",
              "mime_type": "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            },
            {"type": "text", "text": "Summarize the key takeaways from each slide."}
          ]
        }'
      ```

=== "CLI"

      ```bash
      FILE=$(gemini-api files upload quarterly_review.pptx --wait \
        --mime-type application/vnd.openxmlformats-officedocument.presentationml.presentation)
      gemini-api analyze -i "$FILE" "Summarize the key takeaways from each slide."
      ```


工具也可以在[函式回應](/docs/function-calling/#multimodal)中回傳這些檔案或切割後的選取範圍。現有的檔案大小與頁數限制適用於整份檔案。

## 自訂文件、簡報與試算表處理 {#customize-document-processing}

你可以在 `document` 區塊上傳入 `processing`（`{"type": "static", ...}`），以選取頁面範圍、工作表索引標籤、儲存格範圍、內容圖層與算繪解析度。這些選項適用於所有 Gemini 3 與 Gemini 4 以上模型，可用於使用者的 `input`，也可放在 `function_result.result` 內。

Gemini 只會計算並收取傳送給模型的切割後輸出內容的權杖費用。模型還會自動收到總頁數與工作表名稱，因此可以在後續回合中要求接續的範圍。

### 切割頁面並選取內容圖層 {#page-options}

針對 PDF（`.pdf`）、文件（`.docx`、`.doc`、`.dotx`、`.odt`）與簡報（`.pptx`、`.ppt`、`.odp`），請設定 `processing.page_options`：

* `start_page`（整數，選填）：以 1 為起始的包含起始頁。設定 `end_page` 時預設為 `1`。值 `<= 0` 會回傳 `400 INVALID_ARGUMENT`。超過頁數的值會回傳空的切割範圍。
* `end_page`（整數，選填）：以 1 為起始的包含結束頁。設定 `start_page` 時預設為最後一頁，超過頁數時會箝制為最後一頁。必須 `>= start_page`。
* `content_layers`（字串清單，選填）：選擇 `"page_image"`（算繪後的頁面圖片）、`"page_text"`（擷取的文字），或兩者皆選。設定 `processing` 時預設為 `["page_image"]`。
* `resolution`（字串，選填）：在外層 `document` 區塊上設定（`"low"`、`"medium"` 或 `"high"`）。預設為 `"medium"`（每頁約 560 個權杖；`"low"` 約 280 個，`"high"` 約 1,120 個）。


!!! note " "

      對於大型 Office 文件與簡報，請先以 `content_layers: ["page_text"]` 掃描檔案，再針對含有圖表或密集版面配置的頁面或投影片，以 `"high"` 解析度要求 `"page_image"`。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      uploaded_doc = client.files.upload(file="quarterly_report.pdf")

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {
                  "type": "document",
                  "uri": uploaded_doc.uri,
                  "mime_type": "application/pdf",
                  "resolution": "high",
                  "processing": {
                      "type": "static",
                      "page_options": {
                          "start_page": 3,
                          "end_page": 7,
                          "content_layers": ["page_image"],
                      },
                  },
              },
              {
                  "type": "text",
                  "text": "Summarize the revenue bridge chart and footnotes on pages 3 through 7.",
              },
          ],
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const uploadedDoc = await ai.files.upload({
        file: "quarterly_report.pdf",
        config: { mimeType: "application/pdf" },
      });

      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: [
          {
            type: "document",
            uri: uploadedDoc.uri,
            mime_type: "application/pdf",
            resolution: "high",
            processing: {
              type: "static",
              page_options: {
                start_page: 3,
                end_page: 7,
                content_layers: ["page_image"],
              },
            },
          },
          {
            type: "text",
            text: "Summarize the revenue bridge chart and footnotes on pages 3 through 7.",
          },
        ],
      });

      console.log(interaction.output_text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.DocumentContent;
      import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
      import com.google.genai.gaos.models.interactions.DocumentMediaProcessing;
      import com.google.genai.gaos.models.interactions.DocumentProcessing;
      import com.google.genai.gaos.models.interactions.DocumentStaticMediaProcessing;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.MediaResolution;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.PageProcessingOptions;
      import com.google.genai.gaos.models.interactions.PageProcessingOptionsContentLayer;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.File;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.types.UploadFileConfig;
      import java.util.List;

      Client client =
          Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      File uploadedDoc =
          client.files.upload(
              new java.io.File("quarterly_report.pdf"),
              UploadFileConfig.builder().mimeType("application/pdf").build());

      List<Content> content =
          List.of(
              DocumentContent.builder()
                  .uri(uploadedDoc.uri().orElse(""))
                  .mimeType(DocumentContentMimeType.APPLICATION_PDF)
                  .resolution(MediaResolution.HIGH)
                  .processing(
                      DocumentProcessing.of(
                          DocumentMediaProcessing.of(
                              DocumentStaticMediaProcessing.builder()
                                  .pageOptions(
                                      PageProcessingOptions.builder()
                                          .startPage(3)
                                          .endPage(7)
                                          .contentLayers(
                                              List.of(PageProcessingOptionsContentLayer.PAGE_IMAGE))
                                          .build())
                                  .build())))
                  .build(),
              TextContent.builder()
                  .text("Summarize the revenue bridge chart and footnotes on pages 3 through 7.")
                  .build());

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.ofContent(content))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().orElseThrow();
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
          client, err := genai.NewClient(ctx, &genai.ClientConfig{
              HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
          })
          if err != nil {
              log.Fatal(err)
          }

          uploadedDoc, err := client.Files.UploadFromPath(ctx, "quarterly_report.pdf", &genai.UploadFileConfig{
              MIMEType: "application/pdf",
          })
          if err != nil {
              log.Fatal(err)
          }

          contents := []interactions.Content{
              interactions.NewContent(interactions.DocumentContent{
                  URI:        genai.Ptr(uploadedDoc.URI),
                  MimeType:   interactions.DocumentContentMimeTypeApplicationPdf.ToPointer(),
                  Resolution: interactions.MediaResolutionHigh.ToPointer(),
                  Processing: genai.Ptr(interactions.NewDocumentProcessing(
                      interactions.NewDocumentMediaProcessing(interactions.DocumentStaticMediaProcessing{
                          PageOptions: &interactions.PageProcessingOptions{
                              StartPage: genai.Ptr(3),
                              EndPage:   genai.Ptr(7),
                              ContentLayers: []interactions.PageProcessingOptionsContentLayer{
                                  interactions.PageProcessingOptionsContentLayerPageImage,
                              },
                          },
                      }),
                  )),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: "Summarize the revenue bridge chart and footnotes on pages 3 through 7.",
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: genai.Ptr(interactions.NewInteractionsInput(contents)),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if res.Interaction != nil && res.Interaction.OutputText != nil {
              fmt.Println(*res.Interaction.OutputText)
          }
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {
              "type": "document",
              "uri": "https://generativelanguage.googleapis.com/v1beta/files/FILE_ID",
              "mime_type": "application/pdf",
              "resolution": "high",
              "processing": {
                "type": "static",
                "page_options": {
                  "start_page": 3,
                  "end_page": 7,
                  "content_layers": ["page_image"]
                }
              }
            },
            {
              "type": "text",
              "text": "Summarize the revenue bridge chart and footnotes on pages 3 through 7."
            }
          ]
        }'
      ```


### 選取試算表索引標籤與儲存格範圍 {#spreadsheet-options}

針對試算表（`.xlsx`、`.xls`、`.ods`），請設定 `processing.spreadsheet_options`：

* `sheet_index`（整數，選填）：依索引標籤順序排列、以 1 為起始的工作表位置。省略時會擷取所有工作表（每張工作表上限 50,000 個儲存格）。值 `<= 0` 或超過工作表數量會回傳 `400 INVALID_ARGUMENT`。
* `visible_cells`（字串，選填）：標準 A1 儲存格或範圍（例如 `"A1:G40"` 或 `"B5"`）。會將所有選取的圖層裁切至該區域。
* `content_layers`（字串清單，選填）：選擇 `"data"`（求值後的儲存格值）、`"formulas"`（原始公式）與 `"visual"`（用於圖表與版面配置的算繪試算表快照）。預設為 `["data", "formulas"]`。
* `resolution`（字串，選填）：啟用 `"visual"` 時，在外層 `document` 區塊上設定（`"low"`、`"medium"` 或 `"high"`）。預設為 `"medium"`。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      workbook = client.files.upload(file="financial_model.xlsx")

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=[
              {
                  "type": "document",
                  "uri": workbook.uri,
                  "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  "resolution": "high",
                  "processing": {
                      "type": "static",
                      "spreadsheet_options": {
                          "sheet_index": 2,
                          "visible_cells": "A1:H50",
                          "content_layers": ["data", "formulas", "visual"],
                      },
                  },
              },
              {
                  "type": "text",
                  "text": "Audit the EBITDA formulas and chart in Sheet 2 (A1:H50).",
              },
          ],
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const workbook = await ai.files.upload({
        file: "financial_model.xlsx",
        config: {
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });

      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: [
          {
            type: "document",
            uri: workbook.uri,
            mime_type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            resolution: "high",
            processing: {
              type: "static",
              spreadsheet_options: {
                sheet_index: 2,
                visible_cells: "A1:H50",
                content_layers: ["data", "formulas", "visual"],
              },
            },
          },
          {
            type: "text",
            text: "Audit the EBITDA formulas and chart in Sheet 2 (A1:H50).",
          },
        ],
      });

      console.log(interaction.output_text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.DocumentContent;
      import com.google.genai.gaos.models.interactions.DocumentContentMimeType;
      import com.google.genai.gaos.models.interactions.DocumentMediaProcessing;
      import com.google.genai.gaos.models.interactions.DocumentProcessing;
      import com.google.genai.gaos.models.interactions.DocumentStaticMediaProcessing;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.MediaResolution;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.SpreadsheetProcessingOptions;
      import com.google.genai.gaos.models.interactions.SpreadsheetProcessingOptionsContentLayer;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.File;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.types.UploadFileConfig;
      import java.util.List;

      Client client =
          Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      File workbook =
          client.files.upload(
              new java.io.File("financial_model.xlsx"),
              UploadFileConfig.builder()
                  .mimeType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                  .build());

      List<Content> content =
          List.of(
              DocumentContent.builder()
                  .uri(workbook.uri().orElse(""))
                  .mimeType(
                      DocumentContentMimeType
                          .APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_SPREADSHEETML_SHEET)
                  .resolution(MediaResolution.HIGH)
                  .processing(
                      DocumentProcessing.of(
                          DocumentMediaProcessing.of(
                              DocumentStaticMediaProcessing.builder()
                                  .spreadsheetOptions(
                                      SpreadsheetProcessingOptions.builder()
                                          .sheetIndex(2)
                                          .visibleCells("A1:H50")
                                          .contentLayers(
                                              List.of(
                                                  SpreadsheetProcessingOptionsContentLayer.DATA,
                                                  SpreadsheetProcessingOptionsContentLayer.FORMULAS,
                                                  SpreadsheetProcessingOptionsContentLayer.VISUAL))
                                          .build())
                                  .build())))
                  .build(),
              TextContent.builder()
                  .text("Audit the EBITDA formulas and chart in Sheet 2 (A1:H50).")
                  .build());

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.ofContent(content))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().orElseThrow();
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
          client, err := genai.NewClient(ctx, &genai.ClientConfig{
              HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
          })
          if err != nil {
              log.Fatal(err)
          }

          workbook, err := client.Files.UploadFromPath(ctx, "financial_model.xlsx", &genai.UploadFileConfig{
              MIMEType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
          if err != nil {
              log.Fatal(err)
          }

          contents := []interactions.Content{
              interactions.NewContent(interactions.DocumentContent{
                  URI:        genai.Ptr(workbook.URI),
                  MimeType:   interactions.DocumentContentMimeTypeApplicationVndOpenxmlformatsOfficedocumentSpreadsheetmlSheet.ToPointer(),
                  Resolution: interactions.MediaResolutionHigh.ToPointer(),
                  Processing: genai.Ptr(interactions.NewDocumentProcessing(
                      interactions.NewDocumentMediaProcessing(interactions.DocumentStaticMediaProcessing{
                          SpreadsheetOptions: &interactions.SpreadsheetProcessingOptions{
                              SheetIndex:   genai.Ptr(2),
                              VisibleCells: genai.Ptr("A1:H50"),
                              ContentLayers: []interactions.SpreadsheetProcessingOptionsContentLayer{
                                  interactions.SpreadsheetProcessingOptionsContentLayerData,
                                  interactions.SpreadsheetProcessingOptionsContentLayerFormulas,
                                  interactions.SpreadsheetProcessingOptionsContentLayerVisual,
                              },
                          },
                      }),
                  )),
              }),
              interactions.NewContent(interactions.TextContent{
                  Text: "Audit the EBITDA formulas and chart in Sheet 2 (A1:H50).",
              }),
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: genai.Ptr(interactions.NewInteractionsInput(contents)),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if res.Interaction != nil && res.Interaction.OutputText != nil {
              fmt.Println(*res.Interaction.OutputText)
          }
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": [
            {
              "type": "document",
              "uri": "https://generativelanguage.googleapis.com/v1beta/files/WORKBOOK_FILE_ID",
              "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "resolution": "high",
              "processing": {
                "type": "static",
                "spreadsheet_options": {
                  "sheet_index": 2,
                  "visible_cells": "A1:H50",
                  "content_layers": ["data", "formulas", "visual"]
                }
              }
            },
            {
              "type": "text",
              "text": "Audit the EBITDA formulas and chart in Sheet 2 (A1:H50)."
            }
          ]
        }'
      ```


## 技術細節 {#technical-details}

### 限制與縮放 {#limits-and-scaling}

* **檔案大小與長度**：每個檔案上限 50 MB、PDF 上限 1,000 頁，Office 或 OpenDocument 檔案上限 2,000 頁或投影片（同時適用於內嵌資料與 Files API 上傳；即使切割檔案，仍以完整上傳的檔案為準）。
* **試算表**：每張工作表上限 50,000 個儲存格。
* **頁面圖片算繪**：Gemini 會將 PDF 與 Office 頁面算繪為 200 萬像素的圖片（288 DPI），同時保留長寬比。輸入的像素尺寸不會改變權杖費用。請使用 `resolution` 控制權杖預算與細節程度。
* **其他文字格式**：TXT、Markdown、HTML 與 XML 等檔案只會擷取為純文字（版面配置、格式與圖表不會保留）。如需瞭解所有輸入選項，請見[檔案輸入方式](/docs/file-input-methods/)。

### 權杖與計費 {#tokens-and-billing}

* **Gemini 4 與 Gemini 3 模型**：頁面圖片的權杖數量取決於 `resolution`。`low` 每頁約 280 個權杖、`medium`（預設）約 560 個權杖，`high` 約 1,120 個權杖。詳情請見[媒體解析度](/docs/media-resolution/)。
* **Gemini 2.5 模型**：每頁固定 258 個權杖。
* **PDF 原生文字與用量回報**：預設 PDF 處理（未設定 `processing` 選項）時，內嵌的 PDF 文字會與頁面圖片一併擷取，不另收權杖費用。頁面圖片權杖會在 `usage.input_tokens_by_modality` 中以 `"image"` 模態回報。
* **切割計費**：設定 `processing` 選項時，Gemini 只會計算並收取傳送給模型的選取頁面、工作表與 `content_layers` 的費用。

## 最佳做法 {#best-practices}

* 上傳前先將頁面旋轉至正確方向。
* 避免使用模糊的掃描檔或低對比頁面。
* 傳送單一頁面時，請將文字提示詞放在文件之後。

## 後續步驟 {#whats-next}

如需深入瞭解，請參考以下資源：

* [檔案提示策略](/docs/files/#prompt-guide)：Gemini API 支援以文字、圖片、音訊與影片資料進行提示，也就是所謂的多模態提示。

* [系統指令](/docs/text-generation/#system-instructions)：系統指令可讓你依據自身需求與使用情境，引導模型的行為。


