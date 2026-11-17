# Batch API


!!! note " "

      這項功能目前僅適用於 generateContent API。
      詳情請參閱本頁內容。


Gemini Batch API 專為大量請求的非同步處理而設計，費用僅為
[標準費用的 50%](/docs/pricing/)。
目標處理時間為 24 小時，但多數情況下會快上許多。

Batch API 適合用於不需要即時回應的大規模、非急迫任務，
例如資料預處理或執行評估。

## 建立批次工作 {#create-batch-job}

在 Batch API 中提交請求有兩種方式：

* **[內嵌請求](/docs/batch-api/#inline-requests)**：直接包含在批次建立請求中的
  [`GenerateContentRequest`](/api-reference/batch-api/batch-generate-content/#request-body) 物件清單。
  這種方式適合總請求大小在 20MB 以下的較小批次。模型傳回的**輸出**
  是 `inlineResponse` 物件的清單。

* **[輸入檔案](/docs/batch-api/#input-file)**：[JSON Lines (JSONL)](https://jsonlines.org/)
  檔案，每一行都包含一個完整的
  [`GenerateContentRequest`](/api-reference/batch-api/batch-generate-content/#request-body) 物件。
  較大的請求建議使用這種方式。模型傳回的**輸出**是一個 JSONL 檔案，
  其中每一行不是 `GenerateContentResponse` 就是狀態物件。


### 內嵌請求 {#inline-requests}

請求數量較少時，你可以直接將
[`GenerateContentRequest`](/api-reference/batch-api/batch-generate-content/#request-body) 物件
內嵌在 [`BatchGenerateContentRequest`](/api-reference/batch-api/batch-generate-content/#request-body) 中。
下列範例以內嵌請求呼叫
[`BatchGenerateContent`](/api-reference/batch-api/batch-generate-content/)
方法：


=== "Python"

      ```python

      from google import genai
      from google.genai import types

      client = genai.Client()

      # A list of dictionaries, where each is a GenerateContentRequest
      inline_requests = [
          {
              'contents': [{
                  'parts': [{'text': 'Tell me a one-sentence joke.'}],
                  'role': 'user'
              }]
          },
          {
              'contents': [{
                  'parts': [{'text': 'Why is the sky blue?'}],
                  'role': 'user'
              }]
          }
      ]

      inline_batch_job = client.batches.create(
          model="gemini-4-hydrogen",
          src=inline_requests,
          config={
              'display_name': "inlined-requests-job-1",
          },
      )

      print(f"Created batch job: {inline_batch_job.name}")
      ```

=== "JavaScript"

      ```javascript

      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({});

      const inlinedRequests = [
          {
              contents: [{
                  parts: [{text: 'Tell me a one-sentence joke.'}],
                  role: 'user'
              }]
          },
          {
              contents: [{
                  parts: [{'text': 'Why is the sky blue?'}],
                  role: 'user'
              }]
          }
      ]

      const response = await ai.batches.create({
          model: 'gemini-4-hydrogen',
          src: inlinedRequests,
          config: {
              displayName: 'inlined-requests-job-1',
          }
      });

      console.log(response);
      ```

=== "Java"

      ```java
      import java.util.Arrays;
      import com.google.genai.Client;
      import com.google.genai.types.BatchJob;
      import com.google.genai.types.BatchJobSource;
      import com.google.genai.types.Content;
      import com.google.genai.types.CreateBatchJobConfig;
      import com.google.genai.types.InlinedRequest;
      import com.google.genai.types.Part;
      import java.util.List;

      Client client = new Client();

      // A list of InlinedRequest objects
      List<InlinedRequest> inlineRequests =
          Arrays.asList(
              InlinedRequest.builder()
                  .contents(
                      Arrays.asList(
                          Content.builder()
                              .role("user")
                              .parts(Arrays.asList(Part.fromText("Tell me a one-sentence joke.")))
                              .build()))
                  .build(),
              InlinedRequest.builder()
                  .contents(
                      Arrays.asList(
                          Content.builder()
                              .role("user")
                              .parts(Arrays.asList(Part.fromText("Why is the sky blue?")))
                              .build()))
                  .build());

      BatchJobSource src = BatchJobSource.builder().inlinedRequests(inlineRequests).build();
      CreateBatchJobConfig config =
          CreateBatchJobConfig.builder().displayName("inlined-requests-job-1").build();

      BatchJob inlineBatchJob = client.batches.create("gemini-4-hydrogen", src, config);

      System.out.println("Created batch job: " + inlineBatchJob.name().orElse(""));
      ```

=== "REST"

      ```bash
      curl https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:batchGenerateContent \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -X POST \
      -H "Content-Type:application/json" \
      -d '{
          "batch": {
              "display_name": "my-batch-requests",
              "input_config": {
                  "requests": {
                      "requests": [
                          {
                              "request": {"contents": [{"parts": [{"text": "Describe the process of photosynthesis."}]}]},
                              "metadata": {
                                  "key": "request-1"
                              }
                          },
                          {
                              "request": {"contents": [{"parts": [{"text": "Describe the process of photosynthesis."}]}]},
                              "metadata": {
                                  "key": "request-2"
                              }
                          }
                      ]
                  }
              }
          }
      }'
      ```


### 輸入檔案 {#input-file}

請求數量較大時，請準備一個 JSON Lines (JSONL) 檔案。檔案中的每一行
都必須是一個 JSON 物件，包含使用者自訂的鍵和一個 request
物件，其中 request 是有效的
[`GenerateContentRequest`](/api-reference/batch-api/batch-generate-content/#request-body) 物件。
使用者自訂的鍵會用在回應中，標示哪個輸出對應哪個請求的結果。
例如，鍵定義為 `request-1` 的請求，其回應也會標註相同的鍵名。

這個檔案透過 [File API](/docs/files/) 上傳。輸入檔案的大小上限為 2GB。

以下是一個 JSONL 檔案範例。你可以將它儲存為名為
`my-batch-requests.json` 的檔案：

```json
{"key": "request-1", "request": {"contents": [{"parts": [{"text": "Describe the process of photosynthesis."}]}]}}
{"key": "request-2", "request": {"contents": [{"parts": [{"text": "What are the main ingredients in a Margherita pizza?"}]}]}}
```

與內嵌請求相同，你也可以在每個請求的 JSON 中指定其他參數，
例如系統指令、工具或其他設定。

你可以如下列範例所示，透過 [File API](/docs/files/) 上傳這個檔案。
如果處理的是多模態輸入，你可以在 JSONL 檔案中參照其他已上傳的檔案。


=== "Python"

      ```python

      import json
      from google import genai
      from google.genai import types

      client = genai.Client()

      # Create a sample JSONL file
      with open("my-batch-requests.jsonl", "w") as f:
          requests = [
              {"key": "request-1", "request": {"contents": [{"parts": [{"text": "Describe the process of photosynthesis."}]}]}},
              {"key": "request-2", "request": {"contents": [{"parts": [{"text": "What are the main ingredients in a Margherita pizza?"}]}]}}
          ]
          for req in requests:
              f.write(json.dumps(req) + "\n")

      # Upload the file to the File API
      uploaded_file = client.files.upload(
          file='my-batch-requests.jsonl',
          config=types.UploadFileConfig(display_name='my-batch-requests', mime_type='jsonl')
      )

      print(f"Uploaded file: {uploaded_file.name}")
      ```

=== "JavaScript"

      ```javascript

      import {GoogleGenAI} from '@google/genai';
      import * as fs from "fs";
      import * as path from "path";

      const ai = new GoogleGenAI({});
      const fileName = "my-batch-requests.jsonl";

      // Define the requests
      const requests = [
          { "key": "request-1", "request": { "contents": [{ "parts": [{ "text": "Describe the process of photosynthesis." }] }] } },
          { "key": "request-2", "request": { "contents": [{ "parts": [{ "text": "What are the main ingredients in a Margherita pizza?" }] }] } }
      ];

      // Construct the path to file
      const filePath = fileName;

      async function writeBatchRequestsToFile(requests = [{ key: '', request: {} }], filePath = '') {
          try {
              // Use a writable stream for efficiency, especially with larger files.
              const writeStream = fs.createWriteStream(filePath, { flags: 'w' });

              writeStream.on('error', (err = null) => {
                  console.error(`Error writing to file ${filePath}:`, err);
              });

              for (const req of requests) {
                  writeStream.write(JSON.stringify(req) + '\n');
              }

              writeStream.end();

              console.log(`Successfully wrote batch requests to ${filePath}`);

          } catch (error) {
              // This catch block is for errors that might occur before stream setup,
              // stream errors are handled by the 'error' event.
              console.error(`An unexpected error occurred:`, error);
          }
      }

      // Write to a file.
      await writeBatchRequestsToFile(requests, filePath);

      // Upload the file to the File API.
      const uploadedFile = await ai.files.upload({file: 'my-batch-requests.jsonl', config: {
          mimeType: 'jsonl',
      }});
      console.log(uploadedFile.name);
      ```

=== "Java"

      ```java
      import java.util.Arrays;
      import com.google.genai.Client;
      import com.google.genai.types.File;
      import com.google.genai.types.UploadFileConfig;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.List;

      Client client = new Client();

      // Create a sample JSONL file
      List<String> requests =
          Arrays.asList(
              "{\"key\": \"request-1\", \"request\": {\"contents\": [{\"parts\": [{\"text\": \"Describe the process of photosynthesis.\"}]}]}}",
              "{\"key\": \"request-2\", \"request\": {\"contents\": [{\"parts\": [{\"text\": \"What are the main ingredients in a Margherita pizza?\"}]}]}}");
      Files.write(Paths.get("my-batch-requests.jsonl"), requests);

      // Upload the file to the File API
      UploadFileConfig uploadConfig =
          UploadFileConfig.builder()
              .displayName("my-batch-requests")
              .mimeType("jsonl")
              .build();
      File uploadedFile = client.files.upload("my-batch-requests.jsonl", uploadConfig);

      System.out.println("Uploaded file: " + uploadedFile.name().orElse(""));
      ```

=== "REST"

      ```bash
      tmp_batch_input_file=batch_input.tmp
      echo -e '{"contents": [{"parts": [{"text": "Describe the process of photosynthesis."}]}]}\n{"contents": [{"parts": [{"text": "What are the main ingredients in a Margherita pizza?"}]}]}' > batch_input.tmp
      MIME_TYPE=$(file -b --mime-type "${tmp_batch_input_file}")
      NUM_BYTES=$(wc -c < "${tmp_batch_input_file}")
      DISPLAY_NAME=BatchInput

      tmp_header_file=upload-header.tmp

      # Initial resumable request defining metadata.
      # The upload url is in the response headers dump them to a file.
      curl "https://generativelanguage.googleapis.com/upload/v1beta/files" \
      -D "${tmp_header_file}" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "X-Goog-Upload-Protocol: resumable" \
      -H "X-Goog-Upload-Command: start" \
      -H "X-Goog-Upload-Header-Content-Length: ${NUM_BYTES}" \
      -H "X-Goog-Upload-Header-Content-Type: ${MIME_TYPE}" \
      -H "Content-Type: application/jsonl" \
      -d "{'file': {'display_name': '${DISPLAY_NAME}'}}" 2> /dev/null

      upload_url=$(grep -i "x-goog-upload-url: " "${tmp_header_file}" | cut -d" " -f2 | tr -d "\r")
      rm "${tmp_header_file}"

      # Upload the actual bytes.
      curl "${upload_url}" \
      -H "Content-Length: ${NUM_BYTES}" \
      -H "X-Goog-Upload-Offset: 0" \
      -H "X-Goog-Upload-Command: upload, finalize" \
      --data-binary "@${tmp_batch_input_file}" 2> /dev/null > file_info.json

      file_uri=$(jq ".file.uri" file_info.json)
      ```


下列範例使用透過 File API 上傳的輸入檔案，呼叫
[`BatchGenerateContent`](/api-reference/batch-api/batch-generate-content/)
方法：


=== "Python"

      ```python
      from google import genai

      # Assumes `uploaded_file` is the file object from the previous step
      client = genai.Client()
      file_batch_job = client.batches.create(
          model="gemini-4-hydrogen",
          src=uploaded_file.name,
          config={
              'display_name': "file-upload-job-1",
          },
      )

      print(f"Created batch job: {file_batch_job.name}")
      ```

=== "JavaScript"

      ```javascript
      // Assumes `uploadedFile` is the file object from the previous step
      const fileBatchJob = await ai.batches.create({
          model: 'gemini-4-hydrogen',
          src: uploadedFile.name,
          config: {
              displayName: 'file-upload-job-1',
          }
      });

      console.log(fileBatchJob);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.BatchJob;
      import com.google.genai.types.BatchJobSource;
      import com.google.genai.types.CreateBatchJobConfig;

      Client client = new Client();

      // Assumes `uploadedFileName` is the file name from the previous step
      String uploadedFileName = "files/my-batch-requests-id";

      BatchJobSource src = BatchJobSource.builder().fileName(uploadedFileName).build();
      CreateBatchJobConfig config =
          CreateBatchJobConfig.builder().displayName("file-upload-job-1").build();

      BatchJob fileBatchJob = client.batches.create("gemini-4-hydrogen", src, config);

      System.out.println("Created batch job: " + fileBatchJob.name().orElse(""));
      ```

=== "REST"

      ```bash
      # Set the File ID taken from the upload response.
      BATCH_INPUT_FILE='files/123456'
      curl https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:batchGenerateContent \
      -X POST \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type:application/json" \
      -d "{
          'batch': {
              'display_name': 'my-batch-requests',
              'input_config': {
                  'file_name': '${BATCH_INPUT_FILE}'
              }
          }
      }"
      ```


建立批次工作後，系統會傳回一個工作名稱。工作完成後，你可以用這個名稱
[監控](/docs/batch-api/#batch-job-status)工作狀態，以及
[擷取結果](/docs/batch-api/#retrieve-batch-results)。

以下範例輸出包含一個工作名稱：

```none

Created batch job from file: batches/123456789
```

### 批次嵌入支援 {#batch-embedding}

你可以使用 Batch API 與
[嵌入模型](/docs/embeddings/)互動，以獲得更高的輸送量。
若要以[內嵌請求](/docs/batch-api/#inline-requests)
或[輸入檔案](/docs/batch-api/#input-file)建立嵌入批次工作，請使用 `batches.create_embeddings` API
並指定嵌入模型。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      # Creating an embeddings batch job with an input file request:
      file_job = client.batches.create_embeddings(
          model="gemini-embedding-2",
          src={'file_name': uploaded_batch_requests.name},
          config={'display_name': "Input embeddings batch"},
      )

      # Creating an embeddings batch job with an inline request:
      batch_job = client.batches.create_embeddings(
          model="gemini-embedding-2",
          # For a predefined list of requests `inlined_requests`
          src={'inlined_requests': inlined_requests},
          config={'display_name': "Inlined embeddings batch"},
      )
      ```

=== "JavaScript"

      ```javascript
      // Creating an embeddings batch job with an input file request:
      let fileJob;
      fileJob = await client.batches.createEmbeddings({
          model: 'gemini-embedding-2',
          src: {fileName: uploadedBatchRequests.name},
          config: {displayName: 'Input embeddings batch'},
      });
      console.log(`Created batch job: ${fileJob.name}`);

      // Creating an embeddings batch job with an inline request:
      let batchJob;
      batchJob = await client.batches.createEmbeddings({
          model: 'gemini-embedding-2',
          // For a predefined a list of requests `inlinedRequests`
          src: {inlinedRequests: inlinedRequests},
          config: {displayName: 'Inlined embeddings batch'},
      });
      console.log(`Created batch job: ${batchJob.name}`);
      ```

=== "Java"

      ```java
      import java.util.Arrays;
      import com.google.genai.Client;
      import com.google.genai.types.BatchJob;
      import com.google.genai.types.Content;
      import com.google.genai.types.CreateEmbeddingsBatchJobConfig;
      import com.google.genai.types.EmbedContentBatch;
      import com.google.genai.types.EmbeddingsBatchJobSource;
      import com.google.genai.types.Part;
      import java.util.List;

      Client client = new Client();

      String uploadedFileName = "files/my-embedding-requests-id";

      // Creating an embeddings batch job with an input file request:
      BatchJob fileJob =
          client.batches.createEmbeddings(
              "gemini-embedding-2",
              EmbeddingsBatchJobSource.builder().fileName(uploadedFileName).build(),
              CreateEmbeddingsBatchJobConfig.builder().displayName("Input embeddings batch").build());
      System.out.println("Created batch job: " + fileJob.name().orElse(""));

      // Creating an embeddings batch job with an inline request:
      EmbedContentBatch inlinedRequests =
          EmbedContentBatch.builder()
              .contents(Arrays.asList(Content.fromParts(Part.fromText("What is the meaning of life?"))))
              .build();
      BatchJob batchJob =
          client.batches.createEmbeddings(
              "gemini-embedding-2",
              EmbeddingsBatchJobSource.builder().inlinedRequests(inlinedRequests).build(),
              CreateEmbeddingsBatchJobConfig.builder().displayName("Inlined embeddings batch").build());
      System.out.println("Created batch job: " + batchJob.name().orElse(""));
      ```


更多範例請參閱 [Batch API cookbook](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Batch_mode.ipynb)
中的 Embeddings 章節。

### 請求設定 {#request-config}

你可以加入標準非批次請求會用到的任何請求設定。例如，你可以指定溫度、系統指令，
甚至傳入其他模態。下列範例展示一個內嵌請求，
其中一個請求包含系統指令：


=== "Python"

      ```python
      inline_requests_list = [
          {'contents': [{'parts': [{'text': 'Write a short poem about a cloud.'}]}]},
          {'contents': [{
              'parts': [{
                  'text': 'Write a short poem about a cat.'
                  }]
              }],
          'config': {
              'system_instruction': {'parts': [{'text': 'You are a cat. Your name is Neko.'}]}}
          }
      ]
      ```

=== "JavaScript"

      ```javascript
      inlineRequestsList = [
          {contents: [{parts: [{text: 'Write a short poem about a cloud.'}]}]},
          {contents: [{parts: [{text: 'Write a short poem about a cat.'}]}],
           config: {systemInstruction: {parts: [{text: 'You are a cat. Your name is Neko.'}]}}}
      ]
      ```

=== "Java"

      ```java
      import java.util.Arrays;
      import com.google.genai.types.Content;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.InlinedRequest;
      import com.google.genai.types.Part;
      import java.util.List;

      List<InlinedRequest> inlineRequestsList =
          Arrays.asList(
              InlinedRequest.builder()
                  .contents(Arrays.asList(Content.fromParts(Part.fromText("Write a short poem about a cloud."))))
                  .build(),
              InlinedRequest.builder()
                  .contents(Arrays.asList(Content.fromParts(Part.fromText("Write a short poem about a cat."))))
                  .config(
                      GenerateContentConfig.builder()
                          .systemInstruction(
                              Content.fromParts(Part.fromText("You are a cat. Your name is Neko.")))
                          .build())
                  .build());
      ```


同樣地，你也可以為請求指定要使用的工具。下列範例
展示一個啟用 [Google Search 工具](/docs/google-search/) 的請求：


=== "Python"

      ```python
      inlined_requests = [
      {'contents': [{'parts': [{'text': 'Who won the euro 1998?'}]}]},
      {'contents': [{'parts': [{'text': 'Who won the euro 2025?'}]}],
       'config':{'tools': [{'google_search': {}}]}}]
      ```

=== "JavaScript"

      ```javascript
      inlineRequestsList = [
          {contents: [{parts: [{text: 'Who won the euro 1998?'}]}]},
          {contents: [{parts: [{text: 'Who won the euro 2025?'}]}],
           config: {tools: [{googleSearch: {}}]}}
      ]
      ```

=== "Java"

      ```java
      import java.util.Arrays;
      import com.google.genai.types.Content;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GoogleSearch;
      import com.google.genai.types.InlinedRequest;
      import com.google.genai.types.Part;
      import com.google.genai.types.Tool;
      import java.util.List;

      List<InlinedRequest> inlinedRequests =
          Arrays.asList(
              InlinedRequest.builder()
                  .contents(Arrays.asList(Content.fromParts(Part.fromText("Who won the euro 1998?"))))
                  .build(),
              InlinedRequest.builder()
                  .contents(Arrays.asList(Content.fromParts(Part.fromText("Who won the euro 2025?"))))
                  .config(
                      GenerateContentConfig.builder()
                          .tools(Tool.builder().googleSearch(GoogleSearch.builder().build()).build())
                          .build())
                  .build());
      ```


你也可以指定[結構化輸出](/docs/structured-output/)。
下列範例說明如何為批次請求進行指定。


=== "Python"

      ```python
      import time
      from google import genai
      from pydantic import BaseModel, TypeAdapter

      class Recipe(BaseModel):
          recipe_name: str
          ingredients: list[str]

      client = genai.Client()

      # A list of dictionaries, where each is a GenerateContentRequest
      inline_requests = [
          {
              'contents': [{
                  'parts': [{'text': 'List a few popular cookie recipes, and include the amounts of ingredients.'}],
                  'role': 'user'
              }],
              'config': {
                  'response_mime_type': 'application/json',
                  'response_schema': list[Recipe]
              }
          },
          {
              'contents': [{
                  'parts': [{'text': 'List a few popular gluten free cookie recipes, and include the amounts of ingredients.'}],
                  'role': 'user'
              }],
              'config': {
                  'response_mime_type': 'application/json',
                  'response_schema': list[Recipe]
              }
          }
      ]

      inline_batch_job = client.batches.create(
          model="gemini-4-hydrogen",
          src=inline_requests,
          config={
              'display_name': "structured-output-job-1"
          },
      )

      # wait for the job to finish
      job_name = inline_batch_job.name
      print(f"Polling status for job: {job_name}")

      while True:
          batch_job_inline = client.batches.get(name=job_name)
          if batch_job_inline.state.name in ('JOB_STATE_SUCCEEDED', 'JOB_STATE_FAILED', 'JOB_STATE_CANCELLED', 'JOB_STATE_EXPIRED'):
              break
          print(f"Job not finished. Current state: {batch_job_inline.state.name}. Waiting 30 seconds...")
          time.sleep(30)

      print(f"Job finished with state: {batch_job_inline.state.name}")

      # print the response
      for i, inline_response in enumerate(batch_job_inline.dest.inlined_responses, start=1):
          print(f"\n--- Response {i} ---")

          # Check for a successful response
          if inline_response.response:
              # The .text property is a shortcut to the generated text.
              print(inline_response.response.text)
      ```

=== "JavaScript"

      ```javascript

      import {GoogleGenAI, Type} from '@google/genai';

      const ai = new GoogleGenAI({});

      const inlinedRequests = [
          {
              contents: [{
                  parts: [{text: 'List a few popular cookie recipes, and include the amounts of ingredients.'}],
                  role: 'user'
              }],
              config: {
                  responseMimeType: 'application/json',
                  responseSchema: {
                  type: Type.ARRAY,
                  items: {
                      type: Type.OBJECT,
                      properties: {
                      'recipeName': {
                          type: Type.STRING,
                          description: 'Name of the recipe',
                          nullable: false,
                      },
                      'ingredients': {
                          type: Type.ARRAY,
                          items: {
                          type: Type.STRING,
                          description: 'Ingredients of the recipe',
                          nullable: false,
                          },
                      },
                      },
                      required: ['recipeName'],
                  },
                  },
              }
          },
          {
              contents: [{
                  parts: [{text: 'List a few popular gluten free cookie recipes, and include the amounts of ingredients.'}],
                  role: 'user'
              }],
              config: {
                  responseMimeType: 'application/json',
                  responseSchema: {
                  type: Type.ARRAY,
                  items: {
                      type: Type.OBJECT,
                      properties: {
                      'recipeName': {
                          type: Type.STRING,
                          description: 'Name of the recipe',
                          nullable: false,
                      },
                      'ingredients': {
                          type: Type.ARRAY,
                          items: {
                          type: Type.STRING,
                          description: 'Ingredients of the recipe',
                          nullable: false,
                          },
                      },
                      },
                      required: ['recipeName'],
                  },
                  },
              }
          }
      ]

      const inlinedBatchJob = await ai.batches.create({
          model: 'gemini-4-hydrogen',
          src: inlinedRequests,
          config: {
              displayName: 'inlined-requests-job-1',
          }
      });
      ```

=== "Java"

      ```java
      import java.util.HashMap;
      import java.util.HashSet;
      import java.util.Arrays;
      import java.util.Collections;
      import com.google.genai.Client;
      import com.google.genai.types.BatchJob;
      import com.google.genai.types.BatchJobSource;
      import com.google.genai.types.Content;
      import com.google.genai.types.CreateBatchJobConfig;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.InlinedRequest;
      import com.google.genai.types.InlinedResponse;
      import com.google.genai.types.JobState;
      import com.google.genai.types.Part;
      import com.google.genai.types.Schema;
      import com.google.genai.types.Type;
      import java.util.List;
      import java.util.Map;
      import java.util.Set;

      Client client = new Client();

      Map<String, Schema> properties = new HashMap<>();
      properties.put("recipeName", Schema.builder().type(Type.Known.STRING).build());
      properties.put(
          "ingredients",
          Schema.builder()
              .type(Type.Known.ARRAY)
              .items(Schema.builder().type(Type.Known.STRING).build())
              .build());

      Schema recipeSchema =
          Schema.builder()
              .type(Type.Known.ARRAY)
              .items(
                  Schema.builder()
                      .type(Type.Known.OBJECT)
                      .properties(
      properties)
                      .required("recipeName")
                      .build())
              .build();

      GenerateContentConfig jsonConfig =
          GenerateContentConfig.builder()
              .responseMimeType("application/json")
              .responseSchema(recipeSchema)
              .build();

      List<InlinedRequest> inlineRequests =
          Arrays.asList(
              InlinedRequest.builder()
                  .contents(
                      Arrays.asList(
                          Content.builder()
                              .role("user")
                              .parts(
                                  Arrays.asList(
                                      Part.fromText(
                                          "List a few popular cookie recipes, and include the amounts of ingredients.")))
                              .build()))
                  .config(jsonConfig)
                  .build(),
              InlinedRequest.builder()
                  .contents(
                      Arrays.asList(
                          Content.builder()
                              .role("user")
                              .parts(
                                  Arrays.asList(
                                      Part.fromText(
                                          "List a few popular gluten free cookie recipes, and include the amounts of ingredients.")))
                              .build()))
                  .config(jsonConfig)
                  .build());

      BatchJob inlineBatchJob =
          client.batches.create(
              "gemini-4-hydrogen",
              BatchJobSource.builder().inlinedRequests(inlineRequests).build(),
              CreateBatchJobConfig.builder().displayName("structured-output-job-1").build());

      // Wait for the job to finish
      String jobName = inlineBatchJob.name().get();
      System.out.println("Polling status for job: " + jobName);

      Set<JobState.Known> completedStates =
          new HashSet<>(Arrays.asList(
              JobState.Known.JOB_STATE_SUCCEEDED,
              JobState.Known.JOB_STATE_FAILED,
              JobState.Known.JOB_STATE_CANCELLED,
              JobState.Known.JOB_STATE_EXPIRED));

      BatchJob batchJobInline = client.batches.get(jobName, null);
      while (!completedStates.contains(batchJobInline.state().get().knownEnum())) {
        System.out.println(
            "Job not finished. Current state: " + batchJobInline.state().get() + ". Waiting 30 seconds...");
        Thread.sleep(30000);
        batchJobInline = client.batches.get(jobName, null);
      }

      System.out.println("Job finished with state: " + batchJobInline.state().get());

      // Print the response
      List<InlinedResponse> responses = batchJobInline.dest().get().inlinedResponses().orElse(Collections.emptyList());
      for (int i = 0; i < responses.size(); i++) {
        System.out.println("\n--- Response " + (i + 1) + " ---");
        InlinedResponse inlineResponse = responses.get(i);
        if (inlineResponse.response().isPresent()) {
          System.out.println(inlineResponse.response().get().text());
        }
      }
      ```


以下展示這個工作的範例輸出：

```json
--- Response 1 ---
[
  {
    "recipe_name": "Chocolate Chip Cookies",
    "ingredients": [
      "1 cup (2 sticks) unsalted butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup packed light brown sugar",
      "1 large egg",
      "1 teaspoon vanilla extract",
      "2 1/4 cups all-purpose flour",
      "1 teaspoon baking soda",
      "1/2 teaspoon salt",
      "1 1/2 cups chocolate chips"
    ]
  },
  {
    "recipe_name": "Oatmeal Raisin Cookies",
    "ingredients": [
      "1 cup (2 sticks) unsalted butter, softened",
      "1 cup packed light brown sugar",
      "1/2 cup granulated sugar",
      "2 large eggs",
      "1 teaspoon vanilla extract",
      "1 1/2 cups all-purpose flour",
      "1 teaspoon baking soda",
      "1 teaspoon ground cinnamon",
      "1/2 teaspoon salt",
      "3 cups old-fashioned rolled oats",
      "1 cup raisins"
    ]
  },
  {
    "recipe_name": "Sugar Cookies",
    "ingredients": [
      "1 cup (2 sticks) unsalted butter, softened",
      "1 1/2 cups granulated sugar",
      "1 large egg",
      "1 teaspoon vanilla extract",
      "2 3/4 cups all-purpose flour",
      "1 teaspoon baking powder",
      "1/2 teaspoon salt"
    ]
  }
]

--- Response 2 ---
[
  {
    "recipe_name": "Gluten-Free Chocolate Chip Cookies",
    "ingredients": [
      "1 cup (2 sticks) unsalted butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup packed light brown sugar",
      "2 large eggs",
      "1 teaspoon vanilla extract",
      "2 1/4 cups gluten-free all-purpose flour blend (with xanthan gum)",
      "1 teaspoon baking soda",
      "1/2 teaspoon salt",
      "1 1/2 cups chocolate chips"
    ]
  },
  {
    "recipe_name": "Gluten-Free Peanut Butter Cookies",
    "ingredients": [
      "1 cup (250g) creamy peanut butter",
      "1/2 cup (100g) granulated sugar",
      "1/2 cup (100g) packed light brown sugar",
      "1 large egg",
      "1 teaspoon vanilla extract",
      "1/2 teaspoon baking soda",
      "1/4 teaspoon salt"
    ]
  },
  {
    "recipe_name": "Gluten-Free Oatmeal Raisin Cookies",
    "ingredients": [
      "1/2 cup (1 stick) unsalted butter, softened",
      "1/2 cup granulated sugar",
      "1/2 cup packed light brown sugar",
      "1 large egg",
      "1 teaspoon vanilla extract",
      "1 cup gluten-free all-purpose flour blend",
      "1/2 teaspoon baking soda",
      "1/2 teaspoon ground cinnamon",
      "1/4 teaspoon salt",
      "1 1/2 cups gluten-free rolled oats",
      "1/2 cup raisins"
    ]
  }
]
```

## 監控工作狀態 {#batch-job-status}

使用建立批次工作時取得的作業名稱來輪詢其狀態。
批次工作的 state 欄位會指出目前狀態。批次工作
可能處於下列任一狀態：

* `JOB_STATE_PENDING`：工作已建立，正在等待服務處理。
* `JOB_STATE_RUNNING`：工作正在進行中。
* `JOB_STATE_SUCCEEDED`：工作已成功完成，現在可以擷取結果。
* `JOB_STATE_FAILED`：工作失敗。請查看錯誤詳細資訊以瞭解更多。
* `JOB_STATE_CANCELLED`：工作已由使用者取消。
* `JOB_STATE_EXPIRED`：工作已過期，因為執行中或待處理的時間
  超過 48 小時。這個工作不會有任何結果可供擷取。
  你可以嘗試重新提交工作，或將請求拆分成
  較小的批次。

你可以定期輪詢工作狀態，確認工作是否完成。


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client()

      # Use the name of the job you want to check
      # e.g., inline_batch_job.name from the previous step
      job_name = "YOUR_BATCH_JOB_NAME" # (e.g. 'batches/your-batch-id')
      batch_job = client.batches.get(name=job_name)

      completed_states = set([
          'JOB_STATE_SUCCEEDED',
          'JOB_STATE_FAILED',
          'JOB_STATE_CANCELLED',
          'JOB_STATE_EXPIRED',
      ])

      print(f"Polling status for job: {job_name}")
      batch_job = client.batches.get(name=job_name) # Initial get
      while batch_job.state.name not in completed_states:
        print(f"Current state: {batch_job.state.name}")
        time.sleep(30) # Wait for 30 seconds before polling again
        batch_job = client.batches.get(name=job_name)

      print(f"Job finished with state: {batch_job.state.name}")
      if batch_job.state.name == 'JOB_STATE_FAILED':
          print(f"Error: {batch_job.error}")
      ```

=== "JavaScript"

      ```javascript
      // Use the name of the job you want to check
      // e.g., inlinedBatchJob.name from the previous step
      let batchJob;
      const completedStates = new Set([
          'JOB_STATE_SUCCEEDED',
          'JOB_STATE_FAILED',
          'JOB_STATE_CANCELLED',
          'JOB_STATE_EXPIRED',
      ]);

      try {
          batchJob = await ai.batches.get({name: inlinedBatchJob.name});
          while (!completedStates.has(batchJob.state || '')) {
              console.log(`Current state: ${batchJob.state}`);
              // Wait for 30 seconds before polling again
              await new Promise(resolve => setTimeout(resolve, 30000));
              batchJob = await client.batches.get({ name: batchJob.name });
          }
          console.log(`Job finished with state: ${batchJob.state}`);
          if (batchJob.state === 'JOB_STATE_FAILED') {
              // The exact structure of `error` might vary depending on the SDK
              // This assumes `error` is an object with a `message` property.
              console.error(`Error: ${batchJob.state}`);
          }
      } catch (error) {
          console.error(`An error occurred while polling job ${batchJob.name}:`, error);
      }
      ```

=== "Java"

      ```java
      import java.util.HashSet;
      import java.util.Arrays;
      import com.google.genai.Client;
      import com.google.genai.types.BatchJob;
      import com.google.genai.types.JobState;
      import java.util.Set;

      Client client = new Client();

      // Use the name of the job you want to check
      String jobName = "batches/your-batch-id";

      Set<JobState.Known> completedStates =
          new HashSet<>(Arrays.asList(
              JobState.Known.JOB_STATE_SUCCEEDED,
              JobState.Known.JOB_STATE_FAILED,
              JobState.Known.JOB_STATE_CANCELLED,
              JobState.Known.JOB_STATE_EXPIRED));

      System.out.println("Polling status for job: " + jobName);
      BatchJob batchJob = client.batches.get(jobName, null);
      while (!completedStates.contains(batchJob.state().get().knownEnum())) {
        System.out.println("Current state: " + batchJob.state().get());
        Thread.sleep(30000); // Wait for 30 seconds before polling again
        batchJob = client.batches.get(jobName, null);
      }

      System.out.println("Job finished with state: " + batchJob.state().get());
      if (batchJob.state().get().knownEnum() == JobState.Known.JOB_STATE_FAILED) {
        System.out.println("Error: " + batchJob.error().orElse(null));
      }
      ```


### 輪詢與 webhook {#webhooks}

**不想再輪詢了嗎**？Gemini 現在支援
[Webhooks](/docs/webhooks/)，可非同步處理完成事件。
你不需要持續呼叫 `GET / operations`，只要直接訂閱
`batch.succeeded`，Gemini API 就能在非同步或長時間執行的作業
完成時，將即時通知推送到你的伺服器。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      webhook = client.webhooks.create(
          name="MyBatchWebhook",
          subscribed_events=["batch.succeeded", "batch.failed"],
          uri="https://my-api.com/gemini-callback",
      )

      print(f"Created webhook: {webhook.name}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      async function createWebhook() {
        const webhook = await client.webhooks.create({
          name: "MyBatchWebhook",
          subscribed_events: ["batch.succeeded", "batch.failed"],
          uri: "https://my-api.com/gemini-callback",
        });

        console.log(`Created webhook: ${webhook.name}`);
      }

      await createWebhook();
      ```

=== "Java"

      ```java
      import java.util.Arrays;
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.webhooks.Webhook;
      import com.google.genai.gaos.models.webhooks.WebhookInput;
      import com.google.genai.gaos.models.webhooks.WebhookSubscribedEvent;
      import java.util.List;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      WebhookInput input =
          WebhookInput.builder()
              .name("MyBatchWebhook")
              .subscribedEvents(
                  Arrays.asList(
                      WebhookSubscribedEvent.BATCH_SUCCEEDED,
                      WebhookSubscribedEvent.BATCH_FAILED))
              .uri("https://my-api.com/gemini-callback")
              .build();

      Webhook webhook = client.webhooks.create(input).webhook().get();
      System.out.println("Created webhook: " + webhook.name().orElse(""));
      ```

=== "REST"

      ```shell
      curl -X POST \
        "https://generativelanguage.googleapis.com/v1beta/webhooks?webhook_id=my-example-webhook-123" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GOOGLE_API_KEY" \
        -d '{
          "name": "My Example Webhook",
          "uri": "https://my-api.com/gemini-callback",
          "subscribed_events": ["batch.succeeded", "batch.failed"]
        }'
      ```


## 擷取結果 {#retrieve-batch-results}

當工作狀態顯示批次工作已成功時，結果會放在 `response` 欄位中。


=== "Python"

      ```python
      import json
      from google import genai

      client = genai.Client()

      # Use the name of the job you want to check
      # e.g., inline_batch_job.name from the previous step
      job_name = "YOUR_BATCH_JOB_NAME"
      batch_job = client.batches.get(name=job_name)

      if batch_job.state.name == 'JOB_STATE_SUCCEEDED':

          # If batch job was created with a file
          if batch_job.dest and batch_job.dest.file_name:
              # Results are in a file
              result_file_name = batch_job.dest.file_name
              print(f"Results are in file: {result_file_name}")

              print("Downloading result file content...")
              file_content = client.files.download(file=result_file_name)
              # Process file_content (bytes) as needed
              print(file_content.decode('utf-8'))

          # If batch job was created with inline request
          # (for embeddings, use batch_job.dest.inlined_embed_content_responses)
          elif batch_job.dest and batch_job.dest.inlined_responses:
              # Results are inline
              print("Results are inline:")
              for i, inline_response in enumerate(batch_job.dest.inlined_responses):
                  print(f"Response {i+1}:")
                  if inline_response.response:
                      # Accessing response, structure may vary.
                      try:
                          print(inline_response.response.text)
                      except AttributeError:
                          print(inline_response.response) # Fallback
                  elif inline_response.error:
                      print(f"Error: {inline_response.error}")
          else:
              print("No results found (neither file nor inline).")
      else:
          print(f"Job did not succeed. Final state: {batch_job.state.name}")
          if batch_job.error:
              print(f"Error: {batch_job.error}")
      ```

=== "JavaScript"

      ```javascript
      // Use the name of the job you want to check
      // e.g., inlinedBatchJob.name from the previous step
      const jobName = "YOUR_BATCH_JOB_NAME";

      try {
          const batchJob = await ai.batches.get({ name: jobName });

          if (batchJob.state === 'JOB_STATE_SUCCEEDED') {
              console.log('Found completed batch:', batchJob.displayName);
              console.log(batchJob);

              // If batch job was created with a file destination
              if (batchJob.dest?.fileName) {
                  const resultFileName = batchJob.dest.fileName;
                  console.log(`Results are in file: ${resultFileName}`);

                  console.log("Downloading result file content...");
                  const fileContentBuffer = await ai.files.download({ file: resultFileName });

                  // Process fileContentBuffer (Buffer) as needed
                  console.log(fileContentBuffer.toString('utf-8'));
              }

              // If batch job was created with inline responses
              else if (batchJob.dest?.inlinedResponses) {
                  console.log("Results are inline:");
                  for (let i = 0; i < batchJob.dest.inlinedResponses.length; i++) {
                      const inlineResponse = batchJob.dest.inlinedResponses[i];
                      console.log(`Response ${i + 1}:`);
                      if (inlineResponse.response) {
                          // Accessing response, structure may vary.
                          if (inlineResponse.response.text !== undefined) {
                              console.log(inlineResponse.response.text);
                          } else {
                              console.log(inlineResponse.response); // Fallback
                          }
                      } else if (inlineResponse.error) {
                          console.error(`Error: ${inlineResponse.error}`);
                      }
                  }
              }

              // If batch job was an embedding batch with inline responses
              else if (batchJob.dest?.inlinedEmbedContentResponses) {
                  console.log("Embedding results found inline:");
                  for (let i = 0; i < batchJob.dest.inlinedEmbedContentResponses.length; i++) {
                      const inlineResponse = batchJob.dest.inlinedEmbedContentResponses[i];
                      console.log(`Response ${i + 1}:`);
                      if (inlineResponse.response) {
                          console.log(inlineResponse.response);
                      } else if (inlineResponse.error) {
                          console.error(`Error: ${inlineResponse.error}`);
                      }
                  }
              } else {
                  console.log("No results found (neither file nor inline).");
              }
          } else {
              console.log(`Job did not succeed. Final state: ${batchJob.state}`);
              if (batchJob.error) {
                  console.error(`Error: ${typeof batchJob.error === 'string' ? batchJob.error : batchJob.error.message || JSON.stringify(batchJob.error)}`);
              }
          }
      } catch (error) {
          console.error(`An error occurred while processing job ${jobName}:`, error);
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.BatchJob;
      import com.google.genai.types.BatchJobDestination;
      import com.google.genai.types.InlinedEmbedContentResponse;
      import com.google.genai.types.InlinedResponse;
      import com.google.genai.types.JobState;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.List;

      Client client = new Client();

      // Use the name of the job you want to check
      String jobName = "batches/your-batch-id";
      BatchJob batchJob = client.batches.get(jobName, null);

      if (batchJob.state().get().knownEnum() == JobState.Known.JOB_STATE_SUCCEEDED) {
        BatchJobDestination dest = batchJob.dest().orElse(null);

        // If batch job was created with a file destination
        if (dest != null && dest.fileName().isPresent()) {
          String resultFileName = dest.fileName().get();
          System.out.println("Results are in file: " + resultFileName);

          System.out.println("Downloading result file content...");
          client.files.download(resultFileName, "batch_results.jsonl", null);
          String fileContent = Files.readString(Paths.get("batch_results.jsonl"));
          System.out.println(fileContent);
        }
        // If batch job was created with inline requests
        else if (dest != null && dest.inlinedResponses().isPresent()) {
          System.out.println("Results are inline:");
          List<InlinedResponse> responses = dest.inlinedResponses().get();
          for (int i = 0; i < responses.size(); i++) {
            System.out.println("Response " + (i + 1) + ":");
            InlinedResponse inlineResponse = responses.get(i);
            if (inlineResponse.response().isPresent()) {
              System.out.println(inlineResponse.response().get().text());
            } else if (inlineResponse.error().isPresent()) {
              System.out.println("Error: " + inlineResponse.error().get());
            }
          }
        }
        // If batch job was an embedding batch with inline responses
        else if (dest != null && dest.inlinedEmbedContentResponses().isPresent()) {
          System.out.println("Embedding results found inline:");
          List<InlinedEmbedContentResponse> responses = dest.inlinedEmbedContentResponses().get();
          for (int i = 0; i < responses.size(); i++) {
            System.out.println("Response " + (i + 1) + ":");
            InlinedEmbedContentResponse inlineResponse = responses.get(i);
            if (inlineResponse.response().isPresent()) {
              System.out.println(inlineResponse.response().get());
            } else if (inlineResponse.error().isPresent()) {
              System.out.println("Error: " + inlineResponse.error().get());
            }
          }
        } else {
          System.out.println("No results found (neither file nor inline).");
        }
      } else {
        System.out.println("Job did not succeed. Final state: " + batchJob.state().get());
        batchJob.error().ifPresent(err -> System.out.println("Error: " + err));
      }
      ```

=== "REST"

      ```bash
      BATCH_NAME="batches/123456" # Your batch job name

      curl https://generativelanguage.googleapis.com/v1beta/$BATCH_NAME \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type:application/json" 2> /dev/null > batch_status.json

      if jq -r '.done' batch_status.json | grep -q "false"; then
          echo "Batch has not finished processing"
      fi

      batch_state=$(jq -r '.metadata.state' batch_status.json)
      if [[ $batch_state = "JOB_STATE_SUCCEEDED" ]]; then
          if [[ $(jq '.response | has("inlinedResponses")' batch_status.json) = "true" ]]; then
              jq -r '.response.inlinedResponses' batch_status.json
              exit
          fi
          responses_file_name=$(jq -r '.response.responsesFile' batch_status.json)
          curl https://generativelanguage.googleapis.com/download/v1beta/$responses_file_name:download?alt=media \
          -H "x-goog-api-key: $GEMINI_API_KEY" 2> /dev/null
      elif [[ $batch_state = "JOB_STATE_FAILED" ]]; then
          jq '.error' batch_status.json
      elif [[ $batch_state == "JOB_STATE_CANCELLED" ]]; then
          echo "Batch was cancelled by the user"
      elif [[ $batch_state == "JOB_STATE_EXPIRED" ]]; then
          echo "Batch expired after 48 hours"
      fi
      ```


## 列出批次工作 {#listing-batch-jobs}

你可以列出最近的批次工作。


=== "Python"

      ```python
      batch_jobs = client.batches.list()

      # Optional query config:
      # batch_jobs = client.batches.list(config={'page_size': 5})

      for batch_job in batch_jobs:
          print(batch_job)
      ```

=== "JavaScript"

      ```javascript
      const batchJobs = await ai.batches.list();

      // Optional query config:
      // const batchJobs = await ai.batches.list({config: {'pageSize': 5}});

      for await (const batchJob of batchJobs) {
          console.log(batchJob);
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.Pager;
      import com.google.genai.types.BatchJob;
      import com.google.genai.types.ListBatchJobsConfig;

      Client client = new Client();

      Pager<BatchJob> batchJobs = client.batches.list(null);

      // Optional query config:
      // Pager<BatchJob> batchJobs = client.batches.list(ListBatchJobsConfig.builder().pageSize(5).build());

      for (BatchJob batchJob : batchJobs) {
        System.out.println(batchJob);
      }
      ```

=== "REST"

      ```bash
      curl https://generativelanguage.googleapis.com/v1beta/batches \
      -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


## 取消批次工作 {#canceling-batch-job}

你可以使用工作名稱取消進行中的批次工作。工作
取消後，就會停止處理新的請求。


=== "Python"

      ```python
      client.batches.cancel(name=batch_job_to_cancel.name)
      ```

=== "JavaScript"

      ```javascript
      await ai.batches.cancel({name: batchJobToCancel.name});
      ```

=== "Java"

      ```java
      import com.google.genai.Client;

      Client client = new Client();

      String batchJobToCancelName = "batches/your-batch-id";
      client.batches.cancel(batchJobToCancelName, null);
      ```

=== "REST"

      ```bash
      BATCH_NAME="batches/123456" # Your batch job name

      # Cancel the batch
      curl https://generativelanguage.googleapis.com/v1beta/$BATCH_NAME:cancel \
      -H "x-goog-api-key: $GEMINI_API_KEY" \

      # Confirm that the status of the batch after cancellation is JOB_STATE_CANCELLED
      curl https://generativelanguage.googleapis.com/v1beta/$BATCH_NAME \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H "Content-Type:application/json" 2> /dev/null | jq -r '.metadata.state'
      ```


## 刪除批次工作 {#delete-batch-job}

你可以使用工作名稱刪除現有的批次工作。工作
刪除後，就會停止處理新的請求，並從批次工作清單中
移除。


=== "Python"

      ```python
      client.batches.delete(name=batch_job_to_delete.name)
      ```

=== "JavaScript"

      ```javascript
      await ai.batches.delete({name: batchJobToDelete.name});
      ```

=== "Java"

      ```java
      import com.google.genai.Client;

      Client client = new Client();

      String batchJobToDeleteName = "batches/your-batch-id";
      client.batches.delete(batchJobToDeleteName, null);
      ```

=== "REST"

      ```bash
      BATCH_NAME="batches/123456" # Your batch job name

      # Delete the batch job
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/$BATCH_NAME" \
      -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


## 以批次方式生成圖片 {#image-generation}

如果你使用 [Gemini Nano Banana](/docs/image-generation/) 且需要生成大量
圖片，可以使用 Batch API 換取更高的
[速率限制](/docs/rate-limits/)，代價是最長 24 小時的
處理時間。

小型批次請求（20MB 以下）可以使用[內嵌請求](/docs/batch-api/#inline-requests-images)，
大型批次則可使用 [JSONL 輸入檔案](/docs/batch-api/#input-file-images)（生成圖片時建議使用）：

### 圖片的內嵌請求 {#inline-requests-images}


=== "Python"

      ```python
      import time
      import base64
      import json
      from google import genai
      from google.genai import types
      from PIL import Image

      client = genai.Client(http_options={"api_version": "v1beta"})

      # 1. Create batch job with inline requests
      inline_requests = [
          {
              'contents': [{'parts': [{'text': 'A big letter A surrounded by animals starting with the A letter'}]}],
              'config': {'response_modalities': ['TEXT', 'IMAGE']}
          },
          {
              'contents': [{'parts': [{'text': 'A big letter B surrounded by animals starting with the B letter'}]}],
              'config': {'response_modalities': ['TEXT', 'IMAGE']}
          }
      ]

      inline_batch_job = client.batches.create(
          model="gemini-3-pro-image-preview",
          src=inline_requests,
          config={
              'display_name': "inlined-image-requests-job-1",
          },
      )

      print(f"Created batch job: {inline_batch_job.name}")

      # 2. Monitor job status
      job_name = inline_batch_job.name
      print(f"Polling status for job: {job_name}")

      completed_states = set([
          'JOB_STATE_SUCCEEDED',
          'JOB_STATE_FAILED',
          'JOB_STATE_CANCELLED',
          'JOB_STATE_EXPIRED',
      ])

      batch_job = client.batches.get(name=job_name) # Initial get
      while batch_job.state.name not in completed_states:
        print(f"Current state: {batch_job.state.name}")
        time.sleep(10) # Wait for 10 seconds before polling again
        batch_job = client.batches.get(name=job_name)

      print(f"Job finished with state: {batch_job.state.name}")

      # 3. Retrieve results
      if batch_job.state.name == 'JOB_STATE_SUCCEEDED':
          print("Results are inline:")
          for i, inline_response in enumerate(batch_job.dest.inlined_responses):
              print(f"Response {i+1}:")
              if inline_response.response:
                  for part in inline_response.response.candidates[0].content.parts:
                      if part.text:
                          print(part.text)
                      elif part.inline_data:
                          print(f"Image mime type: {part.inline_data.mime_type}")
                          image = part.as_image()
                          image.save(f"image_{i+1}.png")
              elif inline_response.error:
                  print(f"Error: {inline_response.error}")
      elif batch_job.state.name == 'JOB_STATE_FAILED':
          print(f"Error: {batch_job.error}")
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      async function run() {
          // 1. Create batch job with inline requests
          const inlinedRequests = [
              {
                  contents: [{parts: [{text: 'A big letter A surrounded by animals starting with the A letter'}]}],
                  config: {responseModalities: ['TEXT', 'IMAGE']}
              },
              {
                  contents: [{parts: [{text: 'A big letter B surrounded by animals starting with the B letter'}]}],
                  config: {responseModalities: ['TEXT', 'IMAGE']}
              }
          ]

          const inlineBatchJob = await ai.batches.create({
              model: 'gemini-3-pro-image-preview',
              src: inlinedRequests,
              config: {
                  displayName: 'inlined-image-requests-job-1',
              }
          });

          console.log(inlineBatchJob);

          // 2. Monitor job status
          let batchJob;
          const completedStates = new Set([
              'JOB_STATE_SUCCEEDED',
              'JOB_STATE_FAILED',
              'JOB_STATE_CANCELLED',
              'JOB_STATE_EXPIRED',
          ]);

          try {
              batchJob = await ai.batches.get({name: inlineBatchJob.name || ''});
              while (!completedStates.has(batchJob.state || '')) {
                  console.log(`Current state: ${batchJob.state}`);
                  // Wait for 10 seconds before polling again
                  await new Promise(resolve => setTimeout(resolve, 10000));
                  batchJob = await ai.batches.get({ name: batchJob.name || '' });
              }
              console.log(`Job finished with state: ${batchJob.state}`);
          } catch (error) {
              console.error(`An error occurred while polling job ${inlineBatchJob.name}:`, error);
              return;
          }

          // 3. Retrieve results
          if (batchJob.state === 'JOB_STATE_SUCCEEDED') {
              if (batchJob.dest?.inlinedResponses) {
                  console.log("Results are inline:");
                  for (let i = 0; i < batchJob.dest.inlinedResponses.length; i++) {
                      const inlineResponse = batchJob.dest.inlinedResponses[i];
                      console.log(`Response ${i + 1}:`);
                      if (inlineResponse.response) {
                          for (const part of inlineResponse.response?.candidates?.[0]?.content?.parts || []) {
                              if (part.text) {
                                  console.log(part.text);
                              } else if (part.inlineData) {
                                  console.log(`Image mime type: ${part.inlineData.mimeType}`);
                              }
                          }
                      } else if (inlineResponse.error) {
                          console.error(`Error: ${inlineResponse.error}`);
                      }
                  }
              } else {
                  console.log("No inline results found.");
              }
          } else if (batchJob.state === 'JOB_STATE_FAILED') {
               console.error(`Error: ${typeof batchJob.error === 'string' ? batchJob.error : batchJob.error?.message || JSON.stringify(batchJob.error)}`);
          }
      }
      await run();
      ```

=== "Java"

      ```java
      import java.util.HashSet;
      import java.util.Arrays;
      import java.util.Collections;
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.types.BatchJob;
      import com.google.genai.types.BatchJobSource;
      import com.google.genai.types.Content;
      import com.google.genai.types.CreateBatchJobConfig;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.InlinedRequest;
      import com.google.genai.types.InlinedResponse;
      import com.google.genai.types.JobState;
      import com.google.genai.types.Part;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.List;
      import java.util.Set;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      // 1. Create batch job with inline requests
      GenerateContentConfig imageConfig =
          GenerateContentConfig.builder().responseModalities("TEXT", "IMAGE").build();

      List<InlinedRequest> inlineRequests =
          Arrays.asList(
              InlinedRequest.builder()
                  .contents(
                      Arrays.asList(
                          Content.fromParts(
                              Part.fromText(
                                  "A big letter A surrounded by animals starting with the A letter"))))
                  .config(imageConfig)
                  .build(),
              InlinedRequest.builder()
                  .contents(
                      Arrays.asList(
                          Content.fromParts(
                              Part.fromText(
                                  "A big letter B surrounded by animals starting with the B letter"))))
                  .config(imageConfig)
                  .build());

      BatchJob inlineBatchJob =
          client.batches.create(
              "gemini-3-pro-image-preview",
              BatchJobSource.builder().inlinedRequests(inlineRequests).build(),
              CreateBatchJobConfig.builder().displayName("inlined-image-requests-job-1").build());

      System.out.println("Created batch job: " + inlineBatchJob.name().orElse(""));

      // 2. Monitor job status
      String jobName = inlineBatchJob.name().get();
      System.out.println("Polling status for job: " + jobName);

      Set<JobState.Known> completedStates =
          new HashSet<>(Arrays.asList(
              JobState.Known.JOB_STATE_SUCCEEDED,
              JobState.Known.JOB_STATE_FAILED,
              JobState.Known.JOB_STATE_CANCELLED,
              JobState.Known.JOB_STATE_EXPIRED));

      BatchJob batchJob = client.batches.get(jobName, null);
      while (!completedStates.contains(batchJob.state().get().knownEnum())) {
        System.out.println("Current state: " + batchJob.state().get());
        Thread.sleep(10000); // Wait for 10 seconds before polling again
        batchJob = client.batches.get(jobName, null);
      }

      System.out.println("Job finished with state: " + batchJob.state().get());

      // 3. Retrieve results
      if (batchJob.state().get().knownEnum() == JobState.Known.JOB_STATE_SUCCEEDED) {
        System.out.println("Results are inline:");
        List<InlinedResponse> responses = batchJob.dest().get().inlinedResponses().orElse(Collections.emptyList());
        for (int i = 0; i < responses.size(); i++) {
          System.out.println("Response " + (i + 1) + ":");
          InlinedResponse inlineResponse = responses.get(i);
          if (inlineResponse.response().isPresent()) {
            for (Part part : inlineResponse.response().get().parts()) {
              if (part.text().isPresent()) {
                System.out.println(part.text().get());
              } else if (part.inlineData().isPresent()) {
                System.out.println("Image mime type: " + part.inlineData().get().mimeType().orElse(""));
                Files.write(
                    Paths.get("image_" + (i + 1) + ".png"),
                    part.inlineData().get().data().get());
              }
            }
          } else if (inlineResponse.error().isPresent()) {
            System.out.println("Error: " + inlineResponse.error().get());
          }
        }
      } else if (batchJob.state().get().knownEnum() == JobState.Known.JOB_STATE_FAILED) {
        System.out.println("Error: " + batchJob.error().orElse(null));
      }
      ```

=== "REST"

      ```bash
      # 1. Create batch job
      printf -v request_data '{
          "batch": {
              "display_name": "my-batch-image-requests",
              "input_config": {
                  "requests": {
                      "requests": [
                          {
                              "request": {
                                  "contents": [{"parts": [{"text": "A big letter A surrounded by animals starting with the A letter"}]}],
                                  "generation_config": {"responseModalities": ["TEXT", "IMAGE"]}
                              },
                              "metadata": { "key": "request-1" }
                          },
                          {
                              "request": {
                                  "contents": [{"parts": [{"text": "A big letter B surrounded by animals starting with the B letter"}]}],
                                  "generation_config": {"responseModalities": ["TEXT", "IMAGE"]}
                              },
                              "metadata": { "key": "request-2" }
                          }
                      ]
                  }
              }
          }
      }'
      curl https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:batchGenerateContent \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -X POST \
        -H "Content-Type:application/json" \
        -d "$request_data" > created_batch.json

      BATCH_NAME=$(jq -r '.name' created_batch.json)
      echo "Created batch job: $BATCH_NAME"

      # 2. Poll job status until completion by repeating the following command
      # Replace $BATCH_NAME with the name returned above.
      curl https://generativelanguage.googleapis.com/v1beta/$BATCH_NAME \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type:application/json" > batch_status.json

      echo "Current status:"
      jq '.' batch_status.json

      # 3. If state is JOB_STATE_SUCCEEDED, retrieve results from batch_status.json
      batch_state=$(jq -r '.state' batch_status.json)
      if [[ $batch_state = "JOB_STATE_SUCCEEDED" ]]; then
          echo "Job succeeded. Results:"
          jq -r '.dest.inlinedResponses' batch_status.json
      fi
      ```


### 圖片的輸入檔案 {#input-file-images}


=== "Python"

      ```python
      import json
      import time
      import base64
      from google import genai
      from google.genai import types
      from PIL import Image

      client = genai.Client(http_options={"api_version": "v1beta"})

      # 1. Create and upload file
      file_name = "my-batch-image-requests.jsonl"
      with open(file_name, "w") as f:
          requests = [
              {"key": "request-1", "request": {"contents": [{"parts": [{"text": "A big letter A surrounded by animals starting with the A letter"}]}], "generation_config": {"responseModalities": ["TEXT", "IMAGE"]}}},
              {"key": "request-2", "request": {"contents": [{"parts": [{"text": "A big letter B surrounded by animals starting with the B letter"}]}], "generation_config": {"responseModalities": ["TEXT", "IMAGE"]}}}
          ]
          for req in requests:
              f.write(json.dumps(req) + "\n")

      uploaded_file = client.files.upload(
          file=file_name,
          config=types.UploadFileConfig(display_name='my-batch-image-requests', mime_type='jsonl')
      )
      print(f"Uploaded file: {uploaded_file.name}")

      # 2. Create batch job
      file_batch_job = client.batches.create(
          model="gemini-3-pro-image-preview",
          src=uploaded_file.name,
          config={
              'display_name': "file-image-upload-job-1",
          },
      )
      print(f"Created batch job: {file_batch_job.name}")

      # 3. Monitor job status
      job_name = file_batch_job.name
      print(f"Polling status for job: {job_name}")

      completed_states = set([
          'JOB_STATE_SUCCEEDED',
          'JOB_STATE_FAILED',
          'JOB_STATE_CANCELLED',
          'JOB_STATE_EXPIRED',
      ])

      batch_job = client.batches.get(name=job_name) # Initial get
      while batch_job.state.name not in completed_states:
        print(f"Current state: {batch_job.state.name}")
        time.sleep(10) # Wait for 10 seconds before polling again
        batch_job = client.batches.get(name=job_name)

      print(f"Job finished with state: {batch_job.state.name}")

      # 4. Retrieve results
      if batch_job.state.name == 'JOB_STATE_SUCCEEDED':
          result_file_name = batch_job.dest.file_name
          print(f"Results are in file: {result_file_name}")
          print("Downloading result file content...")
          file_content_bytes = client.files.download(file=result_file_name)
          file_content = file_content_bytes.decode('utf-8')
          # The result file is also a JSONL file. Parse and print each line.
          for line in file_content.splitlines():
            if line:
              parsed_response = json.loads(line)
              if 'response' in parsed_response and parsed_response['response']:
                  for part in parsed_response['response']['candidates'][0]['content']['parts']:
                    if part.get('text'):
                      print(part['text'])
                    elif part.get('inlineData'):
                      print(f"Image mime type: {part['inlineData']['mimeType']}")
                      data = base64.b64decode(part['inlineData']['data'])
              elif 'error' in parsed_response:
                  print(f"Error: {parsed_response['error']}")
      elif batch_job.state.name == 'JOB_STATE_FAILED':
          print(f"Error: {batch_job.error}")
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';
      import * as fs from "fs";
      import * as path from "path";

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      async function run() {
          // 1. Create and upload file
          const fileName = "my-batch-image-requests.jsonl";
          const requests = [
              { "key": "request-1", "request": { "contents": [{ "parts": [{ "text": "A big letter A surrounded by animals starting with the A letter" }] }], "generation_config": {"responseModalities": ["TEXT", "IMAGE"]} } },
              { "key": "request-2", "request": { "contents": [{ "parts": [{ "text": "A big letter B surrounded by animals starting with the B letter" }] }], "generation_config": {"responseModalities": ["TEXT", "IMAGE"]} } }
          ];
          const filePath = fileName;

          try {
              const writeStream = fs.createWriteStream(filePath, { flags: 'w' });
              for (const req of requests) {
                  writeStream.write(JSON.stringify(req) + '\n');
              }
              writeStream.end();
              console.log(`Successfully wrote batch requests to ${filePath}`);
          } catch (error) {
              console.error(`An unexpected error occurred writing file:`, error);
              return;
          }

          const uploadedFile = await ai.files.upload({file: fileName, config: { mimeType: 'jsonl' }});
          console.log(`Uploaded file: ${uploadedFile.name}`);

          // 2. Create batch job
          const fileBatchJob = await ai.batches.create({
              model: 'gemini-3-pro-image-preview',
              src: uploadedFile.name || '',
              config: {
                  displayName: 'file-image-upload-job-1',
              }
          });
          console.log(fileBatchJob);

          // 3. Monitor job status
          let batchJob;
          const completedStates = new Set([
              'JOB_STATE_SUCCEEDED',
              'JOB_STATE_FAILED',
              'JOB_STATE_CANCELLED',
              'JOB_STATE_EXPIRED',
          ]);

          try {
              batchJob = await ai.batches.get({name: fileBatchJob.name || ''});
              while (batchJob.state && !completedStates.has(batchJob.state)) {
                  console.log(`Current state: ${batchJob.state}`);
                  // Wait for 10 seconds before polling again
                  await new Promise(resolve => setTimeout(resolve, 10000));
                  batchJob = await ai.batches.get({ name: batchJob.name || '' });
              }
              console.log(`Job finished with state: ${batchJob.state}`);
          } catch (error) {
              console.error(`An error occurred while polling job ${fileBatchJob.name}:`, error);
              return;
          }

          // 4. Retrieve results
          if (batchJob.state === 'JOB_STATE_SUCCEEDED') {
              if (batchJob.dest?.fileName) {
                  const resultFileName = batchJob.dest.fileName;
                  console.log(`Results are in file: ${resultFileName}`);
                  console.log("Downloading result file content...");
                  await ai.files.download({ file: resultFileName, downloadPath: 'result.jsonl' });
                  const fileContent = fs.readFileSync('result.jsonl', 'utf-8');
                  for (const line of fileContent.split('\n')) {
                      if (line) {
                          const parsedResponse = JSON.parse(line);
                          if (parsedResponse.response) {
                              for (const part of parsedResponse.response.candidates[0].content.parts) {
                                  if (part.text) {
                                      console.log(part.text);
                                  } else if (part.inlineData) {
                                      console.log(`Image mime type: ${part.inlineData.mimeType}`);
                                  }
                              }
                          } else if (parsedResponse.error) {
                              console.error(`Error: ${parsedResponse.error}`);
                          }
                      }
                  }
              } else {
                  console.log("No result file found.");
              }
          } else if (batchJob.state === 'JOB_STATE_FAILED') {
               console.error(`Error: ${typeof batchJob.error === 'string' ? batchJob.error : batchJob.error?.message || JSON.stringify(batchJob.error)}`);
          }
      }
      await run();
      ```

=== "Java"

      ```java
      import java.util.HashSet;
      import java.util.Arrays;
      import com.google.genai.Client;
      import com.google.genai.types.BatchJob;
      import com.google.genai.types.BatchJobSource;
      import com.google.genai.types.CreateBatchJobConfig;
      import com.google.genai.types.File;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.types.JobState;
      import com.google.genai.types.UploadFileConfig;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.List;
      import java.util.Set;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      // 1. Create and upload file
      String fileName = "my-batch-image-requests.jsonl";
      List<String> requests =
          Arrays.asList(
              "{\"key\": \"request-1\", \"request\": {\"contents\": [{\"parts\": [{\"text\": \"A big letter A surrounded by animals starting with the A letter\"}]}], \"generation_config\": {\"responseModalities\": [\"TEXT\", \"IMAGE\"]}}}",
              "{\"key\": \"request-2\", \"request\": {\"contents\": [{\"parts\": [{\"text\": \"A big letter B surrounded by animals starting with the B letter\"}]}], \"generation_config\": {\"responseModalities\": [\"TEXT\", \"IMAGE\"]}}}");
      Files.write(Paths.get(fileName), requests);

      File uploadedFile =
          client.files.upload(
              fileName,
              UploadFileConfig.builder()
                  .displayName("my-batch-image-requests")
                  .mimeType("jsonl")
                  .build());
      System.out.println("Uploaded file: " + uploadedFile.name().orElse(""));

      // 2. Create batch job
      BatchJob fileBatchJob =
          client.batches.create(
              "gemini-3-pro-image-preview",
              BatchJobSource.builder().fileName(uploadedFile.name().get()).build(),
              CreateBatchJobConfig.builder().displayName("file-image-upload-job-1").build());
      System.out.println("Created batch job: " + fileBatchJob.name().orElse(""));

      // 3. Monitor job status
      String jobName = fileBatchJob.name().get();
      System.out.println("Polling status for job: " + jobName);

      Set<JobState.Known> completedStates =
          new HashSet<>(Arrays.asList(
              JobState.Known.JOB_STATE_SUCCEEDED,
              JobState.Known.JOB_STATE_FAILED,
              JobState.Known.JOB_STATE_CANCELLED,
              JobState.Known.JOB_STATE_EXPIRED));

      BatchJob batchJob = client.batches.get(jobName, null);
      while (!completedStates.contains(batchJob.state().get().knownEnum())) {
        System.out.println("Current state: " + batchJob.state().get());
        Thread.sleep(10000); // Wait for 10 seconds before polling again
        batchJob = client.batches.get(jobName, null);
      }

      System.out.println("Job finished with state: " + batchJob.state().get());

      // 4. Retrieve results
      if (batchJob.state().get().knownEnum() == JobState.Known.JOB_STATE_SUCCEEDED) {
        String resultFileName = batchJob.dest().get().fileName().get();
        System.out.println("Results are in file: " + resultFileName);
        System.out.println("Downloading result file content...");
        client.files.download(resultFileName, "batch_image_results.jsonl", null);
        for (String line : Files.readAllLines(Paths.get("batch_image_results.jsonl"))) {
          if (!line.isEmpty()) {
            System.out.println(line);
          }
        }
      } else if (batchJob.state().get().knownEnum() == JobState.Known.JOB_STATE_FAILED) {
        System.out.println("Error: " + batchJob.error().orElse(null));
      }
      ```

=== "REST"

      ```bash
      # 1. Create and upload file
      echo '{"key": "request-1", "request": {"contents": [{"parts": [{"text": "A big letter A surrounded by animals starting with the A letter"}]}], "generation_config": {"responseModalities": ["TEXT", "IMAGE"]}}}' > my-batch-image-requests.jsonl
      echo '{"key": "request-2", "request": {"contents": [{"parts": [{"text": "A big letter B surrounded by animals starting with the B letter"}]}], "generation_config": {"responseModalities": ["TEXT", "IMAGE"]}}}' >> my-batch-image-requests.jsonl

      # Follow File API guide to upload: https://aistudio.google.com/docs/files
      # This example assumes you have uploaded the file and set BATCH_INPUT_FILE to its name (e.g., files/abcdef123)
      BATCH_INPUT_FILE="files/your-uploaded-file-name"

      # 2. Create batch job
      printf -v request_data '{
          "batch": {
              "display_name": "my-batch-file-image-requests",
              "input_config": { "file_name": "%s" }
          }
      }' "$BATCH_INPUT_FILE"
      curl https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:batchGenerateContent \
        -X POST \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type:application/json" \
        -d "$request_data" > created_batch.json

      BATCH_NAME=$(jq -r '.name' created_batch.json)
      echo "Created batch job: $BATCH_NAME"

      # 3. Poll job status until completion by repeating the following command:
      curl https://generativelanguage.googleapis.com/v1beta/$BATCH_NAME \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type:application/json" > batch_status.json

      echo "Current status:"
      jq '.' batch_status.json

      # 4. If state is JOB_STATE_SUCCEEDED, download results file
      batch_state=$(jq -r '.state' batch_status.json)
      if [[ $batch_state = "JOB_STATE_SUCCEEDED" ]]; then
          responses_file_name=$(jq -r '.dest.fileName' batch_status.json)
          echo "Job succeeded. Downloading results from $responses_file_name..."
          curl https://generativelanguage.googleapis.com/download/v1beta/$responses_file_name:download?alt=media \
            -H "x-goog-api-key: $GEMINI_API_KEY" > batch_results.jsonl
          echo "Results saved to batch_results.jsonl"
      fi
      ```


## 技術細節 {#technical-details}

* **支援的模型**：Batch API 支援多種 Gemini 模型。
  每個模型對 Batch API 的支援情況，請參閱[模型頁面](/docs/models/)。
  Batch API 支援的模態與互動式（非批次）API
  支援的模態相同。

* **定價**：Batch API 的費用為對應模型標準互動式
  API 費用的 50%。詳情請參閱[定價頁面](/docs/pricing/)。
  這項功能的速率限制詳情，請參閱[速率限制頁面](/docs/rate-limits/#batch-api)。

* **服務水準目標 (SLO)**：批次工作的設計目標是在
  24 小時內完成。許多工作可能會快得多，
  視其大小與目前的系統負載而定。

* **快取**：批次請求支援[上下文快取](/docs/caching/)。
  在批次中個別請求的設定裡指定 `cached_content`
  資源名稱，即可重複使用已快取的內容。
  如果批次中的某個請求命中快取，你只需支付
  [標準的上下文快取費率](/docs/pricing/)。


## 最佳做法 {#best-practices}

* **大量請求請使用輸入檔案**：請求數量龐大時，
  一律使用檔案輸入
  方式，以便管理，也避免觸及 [`BatchGenerateContent`](/api-reference/batch-api/batch-generate-content/)
  呼叫本身的請求大小上限。請注意，每個輸入檔案的大小上限為 2GB。

* **錯誤處理**：工作完成後，檢查 `batchStats` 中的 `failedRequestCount`。
  如果使用檔案輸出，請逐行剖析，確認每一行是
  `GenerateContentResponse`，還是表示該請求發生錯誤的狀態物件。
  完整的錯誤代碼請參閱[疑難排解
  指南](/docs/troubleshooting/#error-codes)。

* **工作只提交一次**：建立批次工作不具冪等性。
  如果你將相同的建立請求送出兩次，就會建立兩個獨立的批次工作。

* **拆分超大型批次**：雖然目標處理時間為 24
  小時，實際處理時間會依系統負載與工作大小而有所不同。
  對於大型工作，如果需要提早取得中間結果，
  請考慮將其拆分成較小的批次。


## 後續步驟 {#whats-next}

* 更多範例請參閱 [Batch API notebook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Batch_mode.ipynb)。

* OpenAI 相容層支援 Batch API。範例請參閱
  [OpenAI Compatibility](/docs/openai/#batch) 頁面。


