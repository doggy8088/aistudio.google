# File search

Gemini API 透過 File Search 工具實現檢索增強生成（RAG）。File Search 會匯入、切分並索引你的資料，依據所提供的提示詞快速擷取相關資訊。這些擷取到的資訊會作為模型的上下文，讓模型能提供更準確且更切題的回答。File Search 也提供多模態能力，文字嵌入由 `gemini-embedding-001` 支援，圖片／多模態嵌入則由 `gemini-embedding-2` 支援。


!!! note " "

      目前尚不支援音訊與影片格式。


檔案儲存與查詢時產生嵌入皆為免費，你只需在首次為檔案建立索引時支付建立嵌入的費用，以及一般 Gemini 模型的輸入／輸出權杖費用。這種新的計費模式讓 File Search 工具在建置與擴展上都更簡單、更具成本效益。詳情請參閱[定價](/docs/file-search/#pricing)一節。

## 直接上傳至 File Search store {#upload}

以下範例示範如何將檔案直接上傳至 [file search store](/api-reference/file-search/file-search-stores/upload-to-file-search-store/)：


=== "Python"

      ```python
      from google import genai
      from google.genai import types
      import time

      client = genai.Client()

      file_search_store = client.file_search_stores.create(
          config={
              'display_name': 'your-fileSearchStore-name',
              'embedding_model': 'models/gemini-embedding-2'
          }
      )

      operation = client.file_search_stores.upload_to_file_search_store(
        file='sample.txt',
        file_search_store_name=file_search_store.name,
        config={
            'display_name' : 'display-file-name',
        }
      )

      while not operation.done:
          time.sleep(5)
          operation = client.operations.get(operation)

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Can you tell me about [insert question]",
          tools=[{
              "type": "file_search",
              "file_search_store_names": [file_search_store.name]
          }]
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                      if content_block.annotations:
                          print("\nSources:")
                          for annotation in content_block.annotations:
                              if annotation.type == "file_citation":
                                  print(f" - {annotation.file_name}: {annotation.source}")
      ```

=== "JavaScript"

      ```javascript
      const { GoogleGenAI } = require('@google/genai');

      const ai = new GoogleGenAI({});

      async function run() {
        const fileSearchStore = await ai.fileSearchStores.create({
          config: {
            displayName: 'your-fileSearchStore-name',
            embeddingModel: 'models/gemini-embedding-2'
          }
        });

        let operation = await ai.fileSearchStores.uploadToFileSearchStore({
          file: 'file.txt',
          fileSearchStoreName: fileSearchStore.name,
          config: {
            displayName: 'file-name',
          }
        });

        while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          operation = await ai.operations.get({ operation });
        }

        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Can you tell me about [insert question]",
          tools: [{
            type: "file_search",
            file_search_store_names: [fileSearchStore.name]
          }]
        });

        for (const step of interaction.steps) {
          if (step.type === 'model_output') {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === 'text') {
                console.log(contentBlock.text);
                if (contentBlock.annotations) {
                  console.log("\nSources:");
                  for (const annotation of contentBlock.annotations) {
                    if (annotation.type === 'file_citation') {
                      console.log(` - ${annotation.file_name}: ${annotation.source}`);
                    }
                  }
                }
              }
            }
          }
        }
      }

      await run();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Annotation;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.FileCitation;
      import com.google.genai.gaos.models.interactions.FileSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.CreateFileSearchStoreConfig;
      import com.google.genai.types.FileSearchStore;
      import com.google.genai.types.UploadToFileSearchStoreConfig;
      import com.google.genai.types.UploadToFileSearchStoreOperation;
      import java.util.Arrays;

      Client client = new Client();

      FileSearchStore fileSearchStore =
          client.fileSearchStores.create(
              CreateFileSearchStoreConfig.builder()
                  .displayName("your-fileSearchStore-name")
                  .embeddingModel("models/gemini-embedding-2")
                  .build());

      UploadToFileSearchStoreOperation operation =
          client.fileSearchStores.uploadToFileSearchStore(
              fileSearchStore.name().get(),
              "sample.txt",
              UploadToFileSearchStoreConfig.builder().displayName("display-file-name").build());

      while (!operation.done().orElse(false)) {
        Thread.sleep(5000);
        operation = client.operations.get(operation, null);
      }

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Can you tell me about [insert question]"))
              .tools(
                  Arrays.asList(
                      FileSearch.builder()
                          .fileSearchStoreNames(Arrays.asList(fileSearchStore.name().get()))
                          .build()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  TextContent textContent = (TextContent) contentBlock;
                  System.out.println(textContent.text().orElse(""));
                  if (textContent.annotations().isPresent()
                      && !textContent.annotations().get().isEmpty()) {
                    System.out.println("\nSources:");
                    for (Annotation annotation : textContent.annotations().get()) {
                      if (annotation instanceof FileCitation) {
                        FileCitation citation = (FileCitation) annotation;
                        System.out.printf(
                            "  - %s: %s%n",
                            citation.fileName().orElse(""), citation.source().orElse(""));
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
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

          fileSearchStore, err := client.FileSearchStores.Create(ctx, &genai.CreateFileSearchStoreConfig{
              DisplayName:    "your-fileSearchStore-name",
              EmbeddingModel: "models/gemini-embedding-2",
          })
          if err != nil {
              log.Fatal(err)
          }

          operation, err := client.FileSearchStores.UploadToFileSearchStoreFromPath(
              ctx,
              "sample.txt",
              fileSearchStore.Name,
              &genai.UploadToFileSearchStoreConfig{
                  DisplayName: "display-file-name",
              },
          )
          if err != nil {
              log.Fatal(err)
          }

          for !operation.Done {
              time.Sleep(5 * time.Second)
              operation, err = client.Operations.GetUploadToFileSearchStoreOperation(ctx, operation, nil)
              if err != nil {
                  log.Fatal(err)
              }
          }

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Can you tell me about [insert question]"),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.FileSearch{
                              FileSearchStoreNames: []string{fileSearchStore.Name},
                          }),
                      },
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range resp.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, content := range step.ModelOutputStep.Content {
                      if content.TextContent != nil {
                          fmt.Println(content.TextContent.Text)
                          if len(content.TextContent.Annotations) > 0 {
                              fmt.Println("\nSources:")
                              for _, annotation := range content.TextContent.Annotations {
                                  if annotation.FileCitation != nil {
                                      c := annotation.FileCitation
                                      fileName := ""
                                      if c.FileName != nil {
                                          fileName = *c.FileName
                                      }
                                      source := ""
                                      if c.Source != nil {
                                          source = *c.Source
                                      }
                                      fmt.Printf("  - %s: %s\n", fileName, source)
                                  }
                              }
                          }
                      }
                  }
              }
          }
      }
      ```


詳情請參閱 [`uploadToFileSearchStore`](/api-reference/file-search/file-search-stores/upload-to-file-search-store/) 的 API 參考文件。

## 匯入檔案 {#importing-files}

或者，你也可以先上傳現有檔案，再將它[匯入你的 file search store](/api-reference/file-search/file-search-stores/import-file/)：


=== "Python"

      ```python
      from google import genai
      from google.genai import types
      import time

      client = genai.Client()

      sample_file = client.files.upload(file='sample.txt', config={'display_name': 'display_file_name'})

      file_search_store = client.file_search_stores.create(
          config={
              'display_name': 'your-fileSearchStore-name',
              'embedding_model': 'models/gemini-embedding-2'
          }
      )

      operation = client.file_search_stores.import_file(
          file_search_store_name=file_search_store.name,
          file_name=sample_file.name
      )

      while not operation.done:
          time.sleep(5)
          operation = client.operations.get(operation)

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Can you tell me about [insert question]",
          tools=[{
              "type": "file_search",
              "file_search_store_names": [file_search_store.name]
          }]
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
      ```

=== "JavaScript"

      ```javascript
      const { GoogleGenAI } = require('@google/genai');

      const ai = new GoogleGenAI({});

      async function run() {
        const sampleFile = await ai.files.upload({
          file: 'sample.txt',
          config: { displayName: 'file-name' }
        });

        const fileSearchStore = await ai.fileSearchStores.create({
          config: {
            displayName: 'your-fileSearchStore-name',
            embeddingModel: 'models/gemini-embedding-2'
          }
        });

        let operation = await ai.fileSearchStores.importFile({
          fileSearchStoreName: fileSearchStore.name,
          fileName: sampleFile.name
        });

        while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          operation = await ai.operations.get({ operation: operation });
        }

        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Can you tell me about [insert question]",
          tools: [{
            type: "file_search",
            file_search_store_names: [fileSearchStore.name]
          }]
        });

        for (const step of interaction.steps) {
          if (step.type === 'model_output') {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === 'text') {
                console.log(contentBlock.text);
              }
            }
          }
        }
      }

      await run();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.FileSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.CreateFileSearchStoreConfig;
      import com.google.genai.types.File;
      import com.google.genai.types.FileSearchStore;
      import com.google.genai.types.ImportFileOperation;
      import com.google.genai.types.UploadFileConfig;
      import java.util.Arrays;

      Client client = new Client();

      File sampleFile =
          client.files.upload(
              "sample.txt", UploadFileConfig.builder().displayName("display_file_name").build());

      FileSearchStore fileSearchStore =
          client.fileSearchStores.create(
              CreateFileSearchStoreConfig.builder()
                  .displayName("your-fileSearchStore-name")
                  .embeddingModel("models/gemini-embedding-2")
                  .build());

      ImportFileOperation operation =
          client.fileSearchStores.importFile(
              fileSearchStore.name().get(), sampleFile.name().get(), null);

      while (!operation.done().orElse(false)) {
        Thread.sleep(5000);
        operation = client.operations.get(operation, null);
      }

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Can you tell me about [insert question]"))
              .tools(
                  Arrays.asList(
                      FileSearch.builder()
                          .fileSearchStoreNames(Arrays.asList(fileSearchStore.name().get()))
                          .build()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  TextContent textContent = (TextContent) contentBlock;
                  System.out.println(textContent.text().orElse(""));
                }
              }
            }
          }
        }
      }
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

          sampleFile, err := client.Files.UploadFromPath(ctx, "sample.txt", &genai.UploadFileConfig{
              DisplayName: "display_file_name",
          })
          if err != nil {
              log.Fatal(err)
          }

          fileSearchStore, err := client.FileSearchStores.Create(ctx, &genai.CreateFileSearchStoreConfig{
              DisplayName:    "your-fileSearchStore-name",
              EmbeddingModel: "models/gemini-embedding-2",
          })
          if err != nil {
              log.Fatal(err)
          }

          operation, err := client.FileSearchStores.ImportFile(ctx, fileSearchStore.Name, sampleFile.Name, nil)
          if err != nil {
              log.Fatal(err)
          }

          for !operation.Done {
              time.Sleep(5 * time.Second)
              operation, err = client.Operations.GetImportFileOperation(ctx, operation, nil)
              if err != nil {
                  log.Fatal(err)
              }
          }

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Can you tell me about [insert question]"),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.FileSearch{
                              FileSearchStoreNames: []string{fileSearchStore.Name},
                          }),
                      },
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range resp.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, content := range step.ModelOutputStep.Content {
                      if content.TextContent != nil {
                          fmt.Println(content.TextContent.Text)
                      }
                  }
              }
          }
      }
      ```


詳情請參閱 [`importFile`](/api-reference/file-search/file-search-stores/import-file/) 的 API 參考文件。

## 切分設定 {#chunking-configuration}

將檔案匯入 File Search store 時，系統會自動將檔案切分為區塊、產生嵌入、建立索引，並上傳至你的 File Search store。若你需要更精細地控制切分策略，可以指定 [`chunking_config`](/api-reference/file-search/file-search-stores/upload-to-file-search-store/#request-body) 設定，設定每個區塊的權杖數量上限與重疊權杖數量上限。


=== "Python"

      ```python
      from google import genai
      from google.genai import types
      import time

      client = genai.Client()

      operation = client.file_search_stores.upload_to_file_search_store(
          file_search_store_name=file_search_store.name,
          file='sample.txt',
          config={
              'chunking_config': {
                'white_space_config': {
                  'max_tokens_per_chunk': 200,
                  'max_overlap_tokens': 20
                }
              }
          }
      )

      while not operation.done:
          time.sleep(5)
          operation = client.operations.get(operation)

      print("Custom chunking complete.")
      ```

=== "JavaScript"

      ```javascript
      const { GoogleGenAI } = require('@google/genai');

      const ai = new GoogleGenAI({});

      let operation = await ai.fileSearchStores.uploadToFileSearchStore({
        file: 'file.txt',
        fileSearchStoreName: fileSearchStore.name,
        config: {
          displayName: 'file-name',
          chunkingConfig: {
            whiteSpaceConfig: {
              maxTokensPerChunk: 200,
              maxOverlapTokens: 20
            }
          }
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.get({ operation });
      }
      console.log("Custom chunking complete.");
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.ChunkingConfig;
      import com.google.genai.types.UploadToFileSearchStoreConfig;
      import com.google.genai.types.UploadToFileSearchStoreOperation;
      import com.google.genai.types.WhiteSpaceConfig;

      Client client = new Client();

      UploadToFileSearchStoreOperation operation =
          client.fileSearchStores.uploadToFileSearchStore(
              "fileSearchStores/my-file-search-store",
              "sample.txt",
              UploadToFileSearchStoreConfig.builder()
                  .displayName("file-name")
                  .chunkingConfig(
                      ChunkingConfig.builder()
                          .whiteSpaceConfig(
                              WhiteSpaceConfig.builder()
                                  .maxTokensPerChunk(200)
                                  .maxOverlapTokens(20)
                                  .build())
                          .build())
                  .build());

      while (!operation.done().orElse(false)) {
        Thread.sleep(5000);
        operation = client.operations.get(operation, null);
      }

      System.out.println("Custom chunking complete.");
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
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          operation, err := client.FileSearchStores.UploadToFileSearchStoreFromPath(
              ctx,
              "sample.txt",
              "fileSearchStores/my-file-search-store",
              &genai.UploadToFileSearchStoreConfig{
                  DisplayName: "file-name",
                  ChunkingConfig: &genai.ChunkingConfig{
                      WhiteSpaceConfig: &genai.WhiteSpaceConfig{
                          MaxTokensPerChunk: genai.Ptr(int32(200)),
                          MaxOverlapTokens:  genai.Ptr(int32(20)),
                      },
                  },
              },
          )
          if err != nil {
              log.Fatal(err)
          }

          for !operation.Done {
              time.Sleep(5 * time.Second)
              operation, err = client.Operations.GetUploadToFileSearchStoreOperation(ctx, operation, nil)
              if err != nil {
                  log.Fatal(err)
              }
          }

          fmt.Println("Custom chunking complete.")
      }
      ```


若要使用你的 File Search store，請將它作為工具傳入 `interactions.create` 方法，如[上傳](/docs/file-search/#upload)與[匯入](/docs/file-search/#importing-files)範例所示。

## 運作方式 {#how-it-works}

File Search 採用一種稱為語意搜尋的技術，找出與使用者提示詞相關的資訊。與標準的關鍵字搜尋不同，語意搜尋能理解查詢的含義與上下文。

匯入檔案時，檔案會被轉換為稱為[嵌入](/docs/embeddings/)的數值表示，以擷取上傳內容的語意。這些嵌入會儲存在專門的 File Search 資料庫中。當你提出查詢時，查詢同樣會被轉換為嵌入，接著系統會執行 File Search，從 File Search store 中找出最相似、最相關的文件區塊。

嵌入並沒有存活時間（TTL）的設定，會一直保留到你手動刪除，或模型遭到淘汰為止。相較之下，檔案會在 48 小時後刪除。

以下說明使用 File Search `uploadToFileSearchStore` API 的流程：

1. **建立 File Search store**：File Search store 存放你檔案處理後的資料，是語意搜尋所操作之嵌入的持久性容器。

2. **上傳檔案並匯入 File Search store**：同時上傳檔案並將結果匯入你的 File Search store。這會建立一個暫時的 `File` 物件，作為你原始文件的參照。接著，該資料會被切分、轉換為 File Search 嵌入並建立索引。`File` 物件會在 48 小時後刪除，而匯入 File Search store 的資料則會無限期儲存，直到你選擇將它刪除。

3. **使用 File Search 查詢**：最後，使用 `FileSearch` 工具發出 `generateContent` 呼叫。在工具設定中，你會指定一個 `FileSearchRetrievalResource`，指向你想搜尋的 `FileSearchStore`。這會指示模型對該特定的 File Search store 執行語意搜尋，找出相關資訊作為回應的接地依據。


![File Search 的索引與查詢流程](https://www.gstatic.com/cloud-cms/def39b91d11c6d080f235056ad4d90ee.png)在這張圖中，從 *Documents* 到 *Embedding model* 的虛線（使用 [`gemini-embedding-001`](/docs/embeddings/)）代表 `uploadToFileSearchStore` API（繞過 *File storage*）。若改用 [Files API](/docs/files/) 分別建立再匯入檔案，索引流程則會從 *Documents* 經 *File storage* 再到 *Embedding model*。

## File Search store {#file-search-stores}

File Search store 是存放文件嵌入的容器。透過 File API 上傳的原始檔案會在 48 小時後刪除，但匯入 File Search store 的資料會無限期儲存，直到你手動刪除為止。你可以建立多個 File Search store 來組織你的文件。`FileSearchStore` API 提供建立、列出、取得與刪除等操作，讓你管理自己的 file search store。File Search store 的名稱屬於全域範圍。

以下範例示範如何管理你的 File Search store：


=== "Python"

      ```python
      file_search_store = client.file_search_stores.create(
          config={
              'display_name': 'my-file_search-store-123',
              'embedding_model': 'models/gemini-embedding-2'
          }
      )

      for file_search_store in client.file_search_stores.list():
          print(file_search_store)

      my_file_search_store = client.file_search_stores.get(name='fileSearchStores/my-file_search-store-123')

      client.file_search_stores.delete(name='fileSearchStores/my-file_search-store-123', config={'force': True})
      ```

=== "JavaScript"

      ```javascript
      const fileSearchStore = await ai.fileSearchStores.create({
        config: {
          displayName: 'my-file_search-store-123',
          embeddingModel: 'models/gemini-embedding-2'
        }
      });

      const fileSearchStores = await ai.fileSearchStores.list();
      for await (const store of fileSearchStores) {
        console.log(store);
      }

      const myFileSearchStore = await ai.fileSearchStores.get({
        name: 'fileSearchStores/my-file_search-store-123'
      });

      await ai.fileSearchStores.delete({
        name: 'fileSearchStores/my-file_search-store-123',
        config: { force: true }
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.CreateFileSearchStoreConfig;
      import com.google.genai.types.DeleteFileSearchStoreConfig;
      import com.google.genai.types.FileSearchStore;

      Client client = new Client();

      FileSearchStore fileSearchStore =
          client.fileSearchStores.create(
              CreateFileSearchStoreConfig.builder()
                  .displayName("myfilesearchstore123")
                  .embeddingModel("models/gemini-embedding-2")
                  .build());

      for (FileSearchStore store : client.fileSearchStores.list(null)) {
        System.out.println(store);
      }

      FileSearchStore myFileSearchStore =
          client.fileSearchStores.get(fileSearchStore.name().get(), null);

      client.fileSearchStores.delete(
          fileSearchStore.name().get(), DeleteFileSearchStoreConfig.builder().force(true).build());
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

          fileSearchStore, err := client.FileSearchStores.Create(ctx, &genai.CreateFileSearchStoreConfig{
              DisplayName:    "myfilesearchstore123",
              EmbeddingModel: "models/gemini-embedding-2",
          })
          if err != nil {
              log.Fatal(err)
          }

          for store, err := range client.FileSearchStores.All(ctx) {
              if err != nil {
                  log.Fatal(err)
              }
              fmt.Println(store)
          }

          myFileSearchStore, err := client.FileSearchStores.Get(ctx, fileSearchStore.Name, nil)
          if err != nil {
              log.Fatal(err)
          }
          _ = myFileSearchStore

          err = client.FileSearchStores.Delete(ctx, fileSearchStore.Name, &genai.DeleteFileSearchStoreConfig{
              Force: genai.Ptr(true),
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/fileSearchStores?key=${GEMINI_API_KEY}" \
          -H "Content-Type: application/json" \
          -d '{ "displayName": "My Store", "embedding_model": "models/gemini-embedding-2" }'

      curl "https://generativelanguage.googleapis.com/v1beta/fileSearchStores?key=${GEMINI_API_KEY}" \

      curl "https://generativelanguage.googleapis.com/v1beta/fileSearchStores/my-file_search-store-123?key=${GEMINI_API_KEY}"

      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/fileSearchStores/my-file_search-store-123?key=${GEMINI_API_KEY}"
      ```


## File Search 文件 {#file-search-documents}

你可以使用 [File Search Documents](/api-reference/file-search/documents/) API 管理檔案儲存庫中的個別文件：以 `list` 列出 file search store 中的每份文件、以 `get` 取得文件的相關資訊，並以 `delete` 依名稱刪除文件。


=== "Python"

      ```python
      for document_in_store in client.file_search_stores.documents.list(parent='fileSearchStores/my-file_search-store-123'):
        print(document_in_store)

      file_search_document = client.file_search_stores.documents.get(name='fileSearchStores/my-file_search-store-123/documents/my_doc')
      print(file_search_document)

      client.file_search_stores.documents.delete(name='fileSearchStores/my-file_search-store-123/documents/my_doc', config={'force': True})
      ```

=== "JavaScript"

      ```javascript
      const documents = await ai.fileSearchStores.documents.list({
        parent: 'fileSearchStores/my-file_search-store-123'
      });
      for await (const doc of documents) {
        console.log(doc);
      }

      const fileSearchDocument = await ai.fileSearchStores.documents.get({
        name: 'fileSearchStores/my-file_search-store-123/documents/my_doc'
      });

      await ai.fileSearchStores.documents.delete({
        name: 'fileSearchStores/my-file_search-store-123/documents/my_doc'
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.DeleteDocumentConfig;
      import com.google.genai.types.Document;

      Client client = new Client();

      for (Document documentInStore :
          client.fileSearchStores.documents.list("fileSearchStores/myfilesearchstore123", null)) {
        System.out.println(documentInStore);
      }

      Document fileSearchDocument =
          client.fileSearchStores.documents.get(
              "fileSearchStores/myfilesearchstore123/documents/sampletxt123", null);
      System.out.println(fileSearchDocument);

      client.fileSearchStores.documents.delete(
          "fileSearchStores/myfilesearchstore123/documents/sampletxt123",
          DeleteDocumentConfig.builder().force(true).build());
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

          for documentInStore, err := range client.FileSearchStores.Documents.All(ctx, "fileSearchStores/myfilesearchstore123") {
              if err != nil {
                  log.Fatal(err)
              }
              fmt.Println(documentInStore)
          }

          fileSearchDocument, err := client.FileSearchStores.Documents.Get(ctx, "fileSearchStores/myfilesearchstore123/documents/sampletxt123", nil)
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(fileSearchDocument)

          err = client.FileSearchStores.Documents.Delete(ctx, "fileSearchStores/myfilesearchstore123/documents/sampletxt123", &genai.DeleteDocumentConfig{
              Force: genai.Ptr(true),
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```

=== "REST"

      ```shell
      curl "https://generativelanguage.googleapis.com/v1beta/fileSearchStores/my-file_search-store-123/documents?key=${GEMINI_API_KEY}"

      curl "https://generativelanguage.googleapis.com/v1beta/fileSearchStores/my-file_search-store-123/documents/my_doc?key=${GEMINI_API_KEY}"

      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/fileSearchStores/my-file_search-store-123/documents/my_doc?key=${GEMINI_API_KEY}&force=true"
      ```


## 檔案中繼資料 {#metadata}

你可以為檔案加上自訂中繼資料，協助篩選檔案或提供額外的上下文。中繼資料是一組鍵值對。


=== "Python"

      ```python
      op = client.file_search_stores.import_file(
          file_search_store_name=file_search_store.name,
          file_name=sample_file.name,
          config={
              'custom_metadata': [
                  {"key": "author", "string_value": "Robert Graves"},
                  {"key": "year", "numeric_value": 1934}
              ]
          }
      )
      ```

=== "JavaScript"

      ```javascript
      let operation = await ai.fileSearchStores.importFile({
        fileSearchStoreName: fileSearchStore.name,
        fileName: sampleFile.name,
        config: {
          customMetadata: [
            { key: "author", stringValue: "Robert Graves" },
            { key: "year", numericValue: 1934 }
          ]
        }
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.CustomMetadata;
      import com.google.genai.types.ImportFileConfig;
      import com.google.genai.types.ImportFileOperation;
      import java.util.Arrays;

      Client client = new Client();

      ImportFileOperation op =
          client.fileSearchStores.importFile(
              "fileSearchStores/myfilesearchstore123",
              "files/samplefile123",
              ImportFileConfig.builder()
                  .customMetadata(
                      Arrays.asList(
                          CustomMetadata.builder().key("author").stringValue("Robert Graves").build(),
                          CustomMetadata.builder().key("year").numericValue(1934f).build()))
                  .build());
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

          op, err := client.FileSearchStores.ImportFile(
              ctx,
              "fileSearchStores/myfilesearchstore123",
              "files/samplefile123",
              &genai.ImportFileConfig{
                  CustomMetadata: []*genai.CustomMetadata{
                      {Key: "author", StringValue: "Robert Graves"},
                      {Key: "year", NumericValue: genai.Ptr(float32(1934))},
                  },
              },
          )
          if err != nil {
              log.Fatal(err)
          }
          _ = op
      }
      ```


當 File Search store 中有多份文件，而你只想搜尋其中的一部分時，這項功能便很實用。


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Tell me about the book 'I, Claudius'",
          tools=[{
              "type": "file_search",
              "file_search_store_names": [file_search_store.name],
              "metadata_filter": 'author="Robert Graves"',
          }]
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
      ```

=== "JavaScript"

      ```javascript
      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: "Tell me about the book 'I, Claudius'",
        tools: [{
          type: "file_search",
          file_search_store_names: [fileSearchStore.name],
          metadata_filter: 'author="Robert Graves"',
        }]
      });

      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          for (const contentBlock of step.content || []) {
            if (contentBlock.type === 'text') {
              console.log(contentBlock.text);
            }
          }
        }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.FileSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Tell me about the book 'I, Claudius'"))
              .tools(
                  Arrays.asList(
                      FileSearch.builder()
                          .fileSearchStoreNames(Arrays.asList("fileSearchStores/myfilesearchstore123"))
                          .metadataFilter("author=\"Robert Graves\"")
                          .build()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  TextContent textContent = (TextContent) contentBlock;
                  System.out.println(textContent.text().orElse(""));
                }
              }
            }
          }
        }
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

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Tell me about the book 'I, Claudius'"),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.FileSearch{
                              FileSearchStoreNames: []string{"fileSearchStores/myfilesearchstore123"},
                              MetadataFilter:       genai.Ptr(`author="Robert Graves"`),
                          }),
                      },
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range resp.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, content := range step.ModelOutputStep.Content {
                      if content.TextContent != nil {
                          fmt.Println(content.TextContent.Text)
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```shell
      curl "https://generativelanguage.googleapis.com/v1beta/interactions" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -H "Api-Revision: 2026-05-20" \
          -X POST \
          -d '{
                  "model": "gemini-4-hydrogen",
                  "input": [{"type": "text", "text": "Tell me about the book I, Claudius"}],
                  "tools": [{
                      "type": "file_search",
                      "file_search_store_names": ["'$STORE_NAME'"],
                      "metadata_filter": "author = \"Robert Graves\""
                  }]
              }' 2> /dev/null > response.json

      cat response.json
      ```


有關如何實作 `metadata_filter` 的清單篩選語法，可參閱 [google.aip.dev/160](https://google.aip.dev/160)。

## 多模態 File Search {#multimodal-file-search}

多模態 File Search 讓你能原生地嵌入並搜尋圖片，打造豐富的多模態 RAG 應用程式。

### 設定嵌入模型 {#configure-the-embedding-model}

建立 `FileSearchStore` 時，你必須覆寫預設的純文字嵌入模型，改用多模態模型。使用 `models/gemini-embedding-2` 即可同時處理文字與圖片。


=== "Python"

      ```python
      store = client.file_search_stores.create(
          config={
              "display_name": "Multimodal Catalog",
              "embedding_model": "models/gemini-embedding-2",
          }
      )
      ```

=== "JavaScript"

      ```javascript
      const fileSearchStore = await ai.fileSearchStores.create({
        config: {
          displayName: "Multimodal Catalog",
          embeddingModel: "models/gemini-embedding-2",
        },
      });
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.CreateFileSearchStoreConfig;
      import com.google.genai.types.FileSearchStore;

      Client client = new Client();

      FileSearchStore store =
          client.fileSearchStores.create(
              CreateFileSearchStoreConfig.builder()
                  .displayName("Multimodal Catalog")
                  .embeddingModel("models/gemini-embedding-2")
                  .build());
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

          store, err := client.FileSearchStores.Create(ctx, &genai.CreateFileSearchStoreConfig{
              DisplayName:    "Multimodal Catalog",
              EmbeddingModel: "models/gemini-embedding-2",
          })
          if err != nil {
              log.Fatal(err)
          }
          _ = store
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/fileSearchStores?key=$GEMINI_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "display_name": "Multimodal Catalog",
            "embedding_model": "models/gemini-embedding-2"
          }'
      ```


### 上傳圖片 {#upload-images}

以多模態嵌入模型建立 store 後，你可以使用[直接上傳至 File Search store](/docs/file-search/#upload)或[匯入檔案](/docs/file-search/#importing-files)中所述的相同上傳 API，直接上傳圖片檔案。

**圖片檔案要求**：

- 圖片檔案的解析度不得超過 4K x 4K 像素。
- 支援的格式為 PNG、JPEG。

## 引用 {#citations}

使用 File Search 時，模型的回應可能會包含引用，標明回答是依據你上傳文件的哪些部分生成的。這有助於事實查核與驗證。

你可以透過 `annotations` 屬性存取引用資訊，該屬性位於回應中 `model_output` 步驟的 `content` 區塊內。


=== "Python"

      ```python
      for step in interaction.steps:
          if step.type == 'model_output':
              for content in step.content:
                  if content.type == 'text' and content.annotations:
                      print(content.annotations)
      ```

=== "JavaScript"

      ```javascript
      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          for (const contentBlock of step.content || []) {
            if (contentBlock.type === 'text' && contentBlock.annotations) {
              console.log(JSON.stringify(contentBlock.annotations, null, 2));
            }
          }
        }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.FileSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Can you tell me about [insert question]"))
              .tools(
                  Arrays.asList(
                      FileSearch.builder()
                          .fileSearchStoreNames(Arrays.asList("fileSearchStores/myfilesearchstore123"))
                          .build()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content content : outputStep.content().get()) {
                if (content instanceof TextContent) {
                  TextContent textContent = (TextContent) content;
                  if (textContent.annotations().isPresent()) {
                    System.out.println(textContent.annotations().get());
                  }
                }
              }
            }
          }
        }
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

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Can you tell me about [insert question]"),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.FileSearch{
                              FileSearchStoreNames: []string{"fileSearchStores/myfilesearchstore123"},
                          }),
                      },
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range resp.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, content := range step.ModelOutputStep.Content {
                      if content.TextContent != nil && len(content.TextContent.Annotations) > 0 {
                          fmt.Println(content.TextContent.Annotations)
                      }
                  }
              }
          }
      }
      ```


有關引用結構的詳細資訊，請參閱 [Interactions 的 API 參考文件](/api-reference/interactions-api/)。

### 頁碼 {#page-numbers}

將 File Search 用於具有頁面的文件（例如 PDF）時，模型的回應可能會包含找到資訊的頁碼。你可以透過 `page_number` 屬性存取這項資訊，該屬性屬於 `file_citation` 註解。


=== "Python"

      ```python
      for step in interaction.steps:
          if step.type == "model_output":
              for content in step.content:
                  if content.type == "text" and content.annotations:
                      for annotation in content.annotations:
                          if annotation.type == "file_citation" and annotation.page_number:
                              print(f"Cited Page: {annotation.page_number}")
      ```

=== "JavaScript"

      ```javascript
      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          for (const block of step.content || []) {
            if (block.type === 'text' && block.annotations) {
              for (const annotation of block.annotations) {
                if (annotation.type === 'file_citation' && annotation.page_number) {
                  console.log(`Cited Page: ${annotation.page_number}`);
                }
              }
            }
          }
        }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Annotation;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.FileCitation;
      import com.google.genai.gaos.models.interactions.FileSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Can you tell me about [insert question]"))
              .tools(
                  Arrays.asList(
                      FileSearch.builder()
                          .fileSearchStoreNames(Arrays.asList("fileSearchStores/myfilesearchstore123"))
                          .build()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content content : outputStep.content().get()) {
                if (content instanceof TextContent) {
                  TextContent textContent = (TextContent) content;
                  if (textContent.annotations().isPresent()) {
                    for (Annotation annotation : textContent.annotations().get()) {
                      if (annotation instanceof FileCitation) {
                        FileCitation citation = (FileCitation) annotation;
                        if (citation.pageNumber().isPresent()) {
                          System.out.println("Cited Page: " + citation.pageNumber().get());
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
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

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Can you tell me about [insert question]"),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.FileSearch{
                              FileSearchStoreNames: []string{"fileSearchStores/myfilesearchstore123"},
                          }),
                      },
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range resp.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, content := range step.ModelOutputStep.Content {
                      if content.TextContent != nil {
                          for _, annotation := range content.TextContent.Annotations {
                              if annotation.FileCitation != nil && annotation.FileCitation.PageNumber != nil {
                                  fmt.Println("Cited Page:", *annotation.FileCitation.PageNumber)
                              }
                          }
                      }
                  }
              }
          }
      }
      ```


### 媒體引用 {#media-citations}

當模型在生成過程中參照了某個圖片區塊時，API 會在註解中傳回一個類型為 `file_citation` 的註解，其中包含 `media_id`。你可以使用這個 ID 下載模型所參照的確切圖片區塊。這個 `media_id` 在多次搜尋呼叫之間持續有效，讓你能可靠地擷取同一張圖片，或使用該 ID 將其快取。

以下程式碼片段是一個 REST 回應步驟的範例：

```json
{
  "type": "model_output",
  "content": [
    {
      "type": "text",
      "text": "...",
      "annotations": [
        {
          "type": "file_citation",
          "file_name": "product_image",
          "media_id": "fileSearchStores/my-store-123/media/BlobId-456"
        }
      ]
    }
  ]
}
```

以下程式碼片段示範如何擷取 `media_id` 並下載媒體：


=== "Python"

      ```python
      for step in interaction.steps:
          if step.type == "model_output":
              for content in step.content:
                  if content.type == "text" and content.annotations:
                      for annotation in content.annotations:
                          if annotation.type == "file_citation" and annotation.media_id:
                              print(f"Cited Media ID: {annotation.media_id}")
                              blob_content = client.file_search_stores.download_media(
                                  media_id=annotation.media_id
                              )
      ```

=== "JavaScript"

      ```javascript
      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          for (const block of step.content || []) {
            if (block.type === 'text' && block.annotations) {
              for (const annotation of block.annotations) {
                if (annotation.type === 'file_citation' && annotation.media_id) {
                  console.log(`Cited Media ID: ${annotation.media_id}`);
                  const blobContent = await ai.fileSearchStores.downloadMedia(annotation.media_id);
                }
              }
            }
          }
        }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Annotation;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.FileCitation;
      import com.google.genai.gaos.models.interactions.FileSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Can you tell me about [insert question]"))
              .tools(
                  Arrays.asList(
                      FileSearch.builder()
                          .fileSearchStoreNames(Arrays.asList("fileSearchStores/myfilesearchstore123"))
                          .build()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content content : outputStep.content().get()) {
                if (content instanceof TextContent) {
                  TextContent textContent = (TextContent) content;
                  if (textContent.annotations().isPresent()) {
                    for (Annotation annotation : textContent.annotations().get()) {
                      if (annotation instanceof FileCitation) {
                        FileCitation citation = (FileCitation) annotation;
                        if (citation.mediaId().isPresent()) {
                          System.out.println("Cited Media ID: " + citation.mediaId().get());
                          byte[] blobContent =
                              client.fileSearchStores.downloadMedia(citation.mediaId().get(), null);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
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

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Can you tell me about [insert question]"),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.FileSearch{
                              FileSearchStoreNames: []string{"fileSearchStores/myfilesearchstore123"},
                          }),
                      },
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range resp.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, content := range step.ModelOutputStep.Content {
                      if content.TextContent != nil {
                          for _, annotation := range content.TextContent.Annotations {
                              if annotation.FileCitation != nil && annotation.FileCitation.MediaID != nil {
                                  fmt.Println("Cited Media ID:", *annotation.FileCitation.MediaID)
                                  blobContent, err := client.FileSearchStores.DownloadMedia(ctx, *annotation.FileCitation.MediaID, nil)
                                  if err != nil {
                                      log.Fatal(err)
                                  }
                                  _ = blobContent
                              }
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X GET "https://generativelanguage.googleapis.com/v1beta/fileSearchStores/my-store-123/media/BlobId-456?alt=media" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -o cited_image.png
      ```


## 自訂中繼資料 {#custom-metadata-grounding}

如果你已為檔案加上自訂中繼資料，可以在模型回應的註解中存取它。這對於將額外的上下文（例如 URL、頁碼或作者）從來源文件傳遞給你的應用程式邏輯很有幫助。每個類型為 `file_citation` 的引用註解都包含這份自訂中繼資料。


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Tell me about [insert question]",
          tools=[{
              "type": "file_search",
              "file_search_store_names": [file_search_store.name]
          }]
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.annotations:
                      for annotation in content_block.annotations:
                          print(annotation)
      ```

=== "JavaScript"

      ```javascript
      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: "Tell me about [insert question]",
        tools: [{
          type: "file_search",
          file_search_store_names: [fileSearchStore.name]
        }]
      });

      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          for (const contentBlock of step.content || []) {
            if (contentBlock.annotations) {
              contentBlock.annotations.forEach((annotation) => {
                console.log(annotation);
              });
            }
          }
        }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Annotation;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.FileSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Tell me about [insert question]"))
              .tools(
                  Arrays.asList(
                      FileSearch.builder()
                          .fileSearchStoreNames(Arrays.asList("fileSearchStores/myfilesearchstore123"))
                          .build()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      if (interaction.steps().isPresent()) {
        for (Step step : interaction.steps().get()) {
          if (step instanceof ModelOutputStep) {
            ModelOutputStep outputStep = (ModelOutputStep) step;
            if (outputStep.content().isPresent()) {
              for (Content contentBlock : outputStep.content().get()) {
                if (contentBlock instanceof TextContent) {
                  TextContent textContent = (TextContent) contentBlock;
                  if (textContent.annotations().isPresent()) {
                    for (Annotation annotation : textContent.annotations().get()) {
                      System.out.println(annotation);
                    }
                  }
                }
              }
            }
          }
        }
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

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Tell me about [insert question]"),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.FileSearch{
                              FileSearchStoreNames: []string{"fileSearchStores/myfilesearchstore123"},
                          }),
                      },
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range resp.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, content := range step.ModelOutputStep.Content {
                      if content.TextContent != nil {
                          for _, annotation := range content.TextContent.Annotations {
                              fmt.Println(annotation)
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -H "Api-Revision: 2026-05-20" \
        -X POST \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Tell me about [insert question]",
          "tools": [{
            "type": "file_search",
            "file_search_store_names": ["'$FILE_SEARCH_STORE_NAME'"]
          }]
        }'
      ```

      自訂中繼資料會在每個註解的 `custom_metadata` 中傳回，附於每個 `file_citation` 註解上：

      ```json
      {
        "steps": [
          {
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "...",
                "annotations": [
                  {
                    "type": "file_citation",
                    "file_name": "...",
                    "document_uri": "...",
                    "source": "...",
                    "custom_metadata": {
                      "author": "Robert Graves",
                      "year": 1934
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
      ```


## 結構化輸出 {#structured-output}

自 Gemini 3 模型起，你可以將 file search 工具與[結構化輸出](/docs/structured-output/)結合使用。


=== "Python"

      ```python
      from pydantic import BaseModel, Field

      class Money(BaseModel):
          amount: str = Field(description="The numerical part of the amount.")
          currency: str = Field(description="The currency of amount.")

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="What is the minimum hourly wage in Tokyo right now?",
          tools=[{
              "type": "file_search",
              "file_search_store_names": [file_search_store.name]
          }],
          response_format={
              "type": "text",
              "mime_type": "application/json",
              "schema": Money.model_json_schema()
          },
      )
      result = Money.model_validate_json(interaction.output_text)
      print(result)
      ```

=== "JavaScript"

      ```javascript
      import { z } from "zod";

      const moneyJsonSchema = {
        type: "object",
        properties: {
          amount: { type: "string", description: "The numerical part of the amount." },
          currency: { type: "string", description: "The currency of amount." }
        },
        required: ["amount", "currency"]
      };

      const moneySchema = z.fromJSONSchema(moneyJsonSchema);

      async function run() {
        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "What is the minimum hourly wage in Tokyo right now?",
          tools: [{
            type: "file_search",
            file_search_store_names: [fileSearchStore.name],
          }],
          response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: moneyJsonSchema
          },
        });

        const result = moneySchema.parse(JSON.parse(interaction.output_text));
        console.log(result);
      }

      await run();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.FileSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormatMimeType;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> properties = new HashMap<>();

      Map<String, Object> amountProp = new HashMap<>();
      amountProp.put("type", "string");
      amountProp.put("description", "The numerical part of the amount.");
      properties.put("amount", amountProp);

      Map<String, Object> currencyProp = new HashMap<>();
      currencyProp.put("type", "string");
      currencyProp.put("description", "The currency of amount.");
      properties.put("currency", currencyProp);

      Map<String, Object> moneyJsonSchema = new HashMap<>();
      moneyJsonSchema.put("type", "object");
      moneyJsonSchema.put("properties", properties);
      moneyJsonSchema.put("required", Arrays.asList("amount", "currency"));

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  TextResponseFormat.builder()
                      .mimeType(TextResponseFormatMimeType.APPLICATION_JSON)
                      .schema(moneyJsonSchema)
                      .build()));

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("What is the minimum hourly wage in Tokyo right now?"))
              .tools(
                  Arrays.asList(
                      FileSearch.builder()
                          .fileSearchStoreNames(Arrays.asList("fileSearchStores/myfilesearchstore123"))
                          .build()))
              .responseFormat(format)
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

          moneyJsonSchema := map[string]any{
              "type": "object",
              "properties": map[string]any{
                  "amount": map[string]any{
                      "type":        "string",
                      "description": "The numerical part of the amount.",
                  },
                  "currency": map[string]any{
                      "type":        "string",
                      "description": "The currency of amount.",
                  },
              },
              "required": []string{"amount", "currency"},
          }

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.TextResponseFormat{
                  MimeType: interactions.TextResponseFormatMimeTypeApplicationJSON.ToPointer(),
                  Schema:   moneyJsonSchema,
              }),
          )

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("What is the minimum hourly wage in Tokyo right now?"),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.FileSearch{
                              FileSearchStoreNames: []string{"fileSearchStores/myfilesearchstore123"},
                          }),
                      },
                      ResponseFormat: &format,
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(resp.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```bash
      curl "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -X POST \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "What is the minimum hourly wage in Tokyo right now?",
          "tools": [{
            "type": "file_search",
            "file_search_store_names": ["'$FILE_SEARCH_STORE_NAME'"]
          }],
          "response_format": {
            "type": "text",
            "mime_type": "application/json",
            "schema": {
              "type": "object",
              "properties": {
                "amount": {"type": "string", "description": "The numerical part of the amount."},
                "currency": {"type": "string", "description": "The currency of amount."}
              },
              "required": ["amount", "currency"]
            }
          }
        }'
      ```


## 支援的模型 {#supported-models}

以下模型支援 File Search：

| 模型 | File Search |
| --- | :---: |
| [Gemini 4 Carbon](/docs/models/gemini-4-carbon/) | ✔️ |
| [Gemini 4 Argon](/docs/models/gemini-4-argon/) | ✔️ |
| [Gemini 4 Neon](/docs/models/gemini-4-neon/) | ✔️ |
| [Gemini 4 Hydrogen](/docs/models/gemini-4-hydrogen/) | ✔️ |
| [Gemini 3.8 Flash](/docs/models/gemini-3.8-flash/) | ✔️ |
| [Gemini 3.6 Flash](/docs/models/gemini-3.6-flash/) | ✔️ |
| [Gemini 3.5 Flash-Lite](/docs/models/gemini-3.5-flash-lite/) | ✔️ |
| [Gemini 3.1 Pro Preview](/docs/models/gemini-3.1-pro-preview/) | ✔️ |
| [Gemini 3.1 Flash-Lite](/docs/models/gemini-3.1-flash-lite/) | ✔️ |
| [Gemini 3 Flash Preview](/docs/models/gemini-3-flash-preview/) | ✔️ |
| [Gemini 2.5 Pro](/docs/models/gemini-2.5-pro/) | ✔️ |
| [Gemini 2.5 Flash-Lite](/docs/models/gemini-2.5-flash-lite/) | ✔️ |

## 支援的工具組合 {#tool-combination}

Gemini 4 與 Gemini 3 模型支援將內建工具（例如 File Search）與自訂工具（函式呼叫）結合使用。詳情請參閱[工具組合](/docs/tool-combination/)頁面。

## 支援的檔案類型 {#supported-files}

File Search 支援多種檔案格式，列於以下各節。

## 限制 {#limitations}

* **Live API**：File Search 不支援於 [Live API](/docs/live-api/)。

* **工具不相容**：目前 File Search 無法與其他工具（例如[使用 Google 搜尋接地](/docs/google-search/)、[URL Context](/docs/url-context/)等）合併使用。


### 速率限制 {#rate-limits}

File Search API 設有以下限制，以確保服務穩定：

* **檔案大小上限／每份文件上限**：100 MB
* **專案 File Search store 的總大小**（依使用者層級而定）：
  * **Free**: 1 GB
  * **Tier 1**: 10 GB
  * **Tier 2**: 100 GB
  * **Tier 3**: 1 TB

* **建議**：將每個 File Search store 的大小控制在 20 GB 以下，以確保最佳的擷取延遲。


!!! note " "

      File Search store 的大小上限由後端計算，依據的是你的輸入大小，加上隨之產生並儲存的嵌入大小。一般而言，這大約是你輸入資料大小的 3 倍。


## 定價 {#pricing}

* 索引時會依現有的[嵌入定價](/docs/pricing/#gemini-embedding-2)收取嵌入費用。

* 儲存免費。

* 查詢時的嵌入免費。

* 擷取到的文件權杖比照一般的[上下文權杖](/docs/tokens/)計費。


## 後續步驟 {#whats-next}

* 請參閱 [File Search Stores](/api-reference/file-search/file-search-stores/) 與 File Search [Documents](/api-reference/file-search/documents/) 的 API 參考文件。

