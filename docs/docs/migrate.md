# 遷移至 Google GenAI SDK

自 2024 年底 Gemini 2.0 發布起，我們推出了一套新的程式庫，稱為
[Google GenAI SDK](/docs/libraries/)。它透過
[更新的用戶端架構](/docs/migrate/#client)提供更佳的開發體驗，並
[簡化](/docs/migrate-to-cloud/)開發者工作流程與企業工作流程之間的轉換。

Google GenAI SDK 現已在所有支援的平台上
[正式推出（GA）](/docs/libraries/#new-libraries)。如果你使用的是我們的
[舊版程式庫](/docs/libraries/#previous-sdks)之一，強烈建議你進行遷移。

本指南提供遷移前後的程式碼對照範例，協助你快速上手。


!!! note " "

      Go 範例省略了 import 與其他樣板程式碼，以提升可讀性。


## 安裝 {#install-sdk}

**之前**


=== "Python"

      ```shell
      pip install -U -q "google-generativeai"
      ```

=== "JavaScript"

      ```shell
      npm install @google/generative-ai
      ```

=== "Java"

      ```xml
      <dependency>
          <groupId>com.google.ai.client.generativeai</groupId>
          <artifactId>generativeai</artifactId>
          <version>0.9.0</version>
      </dependency>
      ```

=== "Go"

      ```shell
      go get github.com/google/generative-ai-go
      ```


**之後**


=== "Python"

      ```shell
      pip install -U -q "google-genai"
      ```

=== "JavaScript"

      ```shell
      npm install @google/genai
      ```

=== "Java"

      ```xml
      <dependency>
          <groupId>com.google.genai</groupId>
          <artifactId>google-genai</artifactId>
          <version>1.67.0</version>
      </dependency>
      ```

=== "Go"

      ```shell
      go get google.golang.org/genai
      ```


## API 存取 {#client}

舊版 SDK 透過各種臨時做法，在幕後隱含地處理 API 用戶端，使得用戶端與憑證
難以管理。現在，你改為透過一個中央 `Client` 物件互動。這個 `Client` 物件是
各種 API 服務（例如 `models`、`chats`、`files`、`tunings`）的單一入口，能提升
一致性，並簡化不同 API 呼叫之間的憑證與設定管理。

**之前（較不集中式的 API 存取）**


=== "Python"

      舊版 SDK 在大多數 API 呼叫中並未明確使用頂層用戶端物件。你會直接建立
        `GenerativeModel` 物件並與之互動。

      ```python
      import google.generativeai as genai

      # Directly create and use model objects
      model = genai.GenerativeModel('gemini-3.8-flash')
      response = model.generate_content(...)
      chat = model.start_chat(...)
      ```

=== "JavaScript"

      雖然 `GoogleGenerativeAI` 是模型與聊天的中央入口，但檔案與快取管理等
        其他功能，通常需要匯入並建立完全獨立的用戶端類別。

      ```javascript
      import { GoogleGenerativeAI } from "@google/generative-ai";
      import { GoogleAIFileManager, GoogleAICacheManager } from "@google/generative-ai/server"; // For files/caching

      const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
      const fileManager = new GoogleAIFileManager("GEMINI_API_KEY");
      const cacheManager = new GoogleAICacheManager("GEMINI_API_KEY");

      // Get a model instance, then call methods on it
      const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
      const result = await model.generateContent(...);
      const chat = model.startChat(...);

      // Call methods on separate client objects for other services
      const uploadedFile = await fileManager.uploadFile(...);
      const cache = await cacheManager.create(...);
      ```

=== "Java"

      ```java
      import com.google.genai.Chat;
      import com.google.genai.Client;
      import com.google.genai.types.GenerateContentResponse;

      // Previously, model operations were called on separate model instances
      Client client = new Client();
      GenerateContentResponse response =
          client.models.generateContent("gemini-3.8-flash", "Tell me a story.", null);
      Chat chat = client.chats.create("gemini-3.8-flash");
      ```

=== "Go"

      `genai.NewClient` 函式會建立用戶端，但生成模型操作通常是在由此用戶端
        取得的獨立 `GenerativeModel` 執行個體上呼叫。其他服務則可能透過不同的
        套件或模式存取。

      ```go
      import (
        "github.com/google/generative-ai-go/genai"
        "github.com/google/generative-ai-go/genai/fileman" // For files
        "google.golang.org/api/option"
      )

      client, err := genai.NewClient(ctx, option.WithAPIKey("GEMINI_API_KEY"))
      fileClient, err := fileman.NewClient(ctx, option.WithAPIKey("GEMINI_API_KEY"))

      // Get a model instance, then call methods on it
      model := client.GenerativeModel("gemini-3.8-flash")
      resp, err := model.GenerateContent(...)
      cs := model.StartChat()

      // Call methods on separate client objects for other services
      uploadedFile, err := fileClient.UploadFile(...)
      ```


**之後（集中式 Client 物件）**


=== "Python"

      ```python
      from google import genai

      # Create a single client object
      client = genai.Client(http_options={"api_version": "v1beta"})

      # Access API methods through services on the client object
      response = client.models.generate_content(...)
      chat = client.chats.create(...)
      my_file = client.files.upload(...)
      tuning_job = client.tunings.tune(...)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      // Create a single client object
      const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY", httpOptions: { apiVersion: "v1beta" } });

      // Access API methods through services on the client object
      const response = await ai.models.generateContent(...);
      const chat = ai.chats.create(...);
      const uploadedFile = await ai.files.upload(...);
      const cache = await ai.caches.create(...);
      ```

=== "Java"

      ```java
      import com.google.genai.Chat;
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.types.CachedContent;
      import com.google.genai.types.CreateCachedContentConfig;
      import com.google.genai.types.File;
      import com.google.genai.types.GenerateContentResponse;

      // Create a single client object
      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      // Access API methods through services on the client object
      GenerateContentResponse response =
          client.models.generateContent("gemini-3.8-flash", "Tell me a story.", null);
      Chat chat = client.chats.create("gemini-3.8-flash");
      File uploadedFile = client.files.upload("sample.txt", null);
      CachedContent cache =
          client.caches.create("gemini-3.8-flash", CreateCachedContentConfig.builder().build());
      ```

=== "Go"

      ```go
      import "google.golang.org/genai"

      // Create a single client object
      client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})

      // Access API methods through services on the client object
      result, err := client.Models.GenerateContent(...)
      chat, err := client.Chats.Create(...)
      uploadedFile, err := client.Files.Upload(...)
      tuningJob, err := client.Tunings.Tune(...)
      ```


## 驗證 {#authenticate}

舊版與新版程式庫都使用 API 金鑰進行驗證。你可以在 Google AI Studio 中
[建立](https://aistudio.google.com/apikey)你的 API 金鑰。

**之前**


=== "Python"

      舊版 SDK 會隱含地處理 API 用戶端物件。

      ```python
      import google.generativeai as genai

      genai.configure(api_key=...)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenerativeAI } from "@google/generative-ai";

      const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
      ```

=== "Java"

      ```java
      import com.google.genai.Client;

      // Passing the API key explicitly to the client builder
      Client client = Client.builder().apiKey("GEMINI_API_KEY").build();
      ```

=== "Go"

      匯入 Google 程式庫：

      ```go
      import (
        "github.com/google/generative-ai-go/genai"
        "google.golang.org/api/option"
      )
      ```

      建立用戶端：

      ```go
      client, err := genai.NewClient(ctx, option.WithAPIKey("GEMINI_API_KEY"))
      ```


**之後**


=== "Python"

      使用 Google GenAI SDK 時，你會先建立一個 API 用戶端，再用它來呼叫
        API。
        如果你沒有向用戶端傳入 API 金鑰，新版 SDK 會從 `GEMINI_API_KEY`
        環境變數取得。

      ```shell
      export GEMINI_API_KEY="YOUR_API_KEY"
      ```

      ```python
      from google import genai

      client = genai.Client() # Set the API key using the GEMINI_API_KEY env var.
                            # Alternatively, you could set the API key explicitly:
                            # client = genai.Client(api_key="YOUR_API_KEY")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({apiKey: "GEMINI_API_KEY"});
      ```

=== "Java"

      ```java
      import com.google.genai.Client;

      // The client automatically picks up the GEMINI_API_KEY environment variable,
      // or you can pass it explicitly via Client.builder().apiKey("GEMINI_API_KEY").build()
      Client client = new Client();
      ```

=== "Go"

      匯入 GenAI 程式庫：

      ```go
      import "google.golang.org/genai"
      ```

      建立用戶端：

      ```go
      client, err := genai.NewClient(ctx, &genai.ClientConfig{
          Backend: genai.BackendGeminiAPI,
      })
      ```


## 產生內容 {#generate-content}

### 文字 {#text}

**之前**


=== "Python"

      先前沒有用戶端物件，你直接透過 `GenerativeModel` 物件存取 API。

      ```python
      import google.generativeai as genai

      model = genai.GenerativeModel('gemini-3.8-flash')
      response = model.generate_content(
        'Tell me a story in 300 words'
      )
      print(response.text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenerativeAI } from "@google/generative-ai";

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
      const prompt = "Tell me a story in 300 words";

      const result = await model.generateContent(prompt);
      console.log(result.response.text());
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateContentResponse;

      Client client = new Client();
      String prompt = "Tell me a story in 300 words";

      GenerateContentResponse response =
          client.models.generateContent("gemini-3.8-flash", prompt, null);
      System.out.println(response.text());
      ```

=== "Go"

      ```go
      ctx := context.Background()
      client, err := genai.NewClient(ctx, option.WithAPIKey("GEMINI_API_KEY"))
      if err != nil {
          log.Fatal(err)
      }
      defer client.Close()

      model := client.GenerativeModel("gemini-3.8-flash")
      resp, err := model.GenerateContent(ctx, genai.Text("Tell me a story in 300 words."))
      if err != nil {
          log.Fatal(err)
      }

      printResponse(resp) // utility for printing response parts
      ```


**之後**


=== "Python"

      新版 Google GenAI SDK 透過 `Client` 物件提供所有 API 方法的存取。
        除了少數有狀態的特殊情況（`chat` 與 Live API 的 `session`）之外，
        這些都是無狀態函式。為了實用與一致性，回傳的物件都是 `pydantic`
        類別。

      ```python
      from google import genai
      client = genai.Client()

      response = client.models.generate_content(
        model='gemini-3.8-flash',
        contents='Tell me a story in 300 words.'
      )
      print(response.text)

      print(response.model_dump_json(
        exclude_none=True, indent=4))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: "Tell me a story in 300 words.",
      });
      console.log(response.text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateContentResponse;

      Client client = new Client();

      GenerateContentResponse response =
          client.models.generateContent(
              "gemini-3.8-flash", "Tell me a story in 300 words.", null);
      System.out.println(response.text());
      ```

=== "Go"

      ```go
      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      result, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", genai.Text("Tell me a story in 300 words."), nil)
      if err != nil {
          log.Fatal(err)
      }
      debugPrint(result) // utility for printing result
      ```


### 圖片 {#image}

**之前**


=== "Python"

      ```python
      import google.generativeai as genai

      model = genai.GenerativeModel('gemini-3.8-flash')
      response = model.generate_content([
          'Tell me a story based on this image',
          Image.open(image_path)
      ])
      print(response.text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenerativeAI } from "@google/generative-ai";

      const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
      const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

      function fileToGenerativePart(path = '', mimeType = '') {
        return {
          inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
          },
        };
      }

      const prompt = "Tell me a story based on this image";

      const imagePart = fileToGenerativePart(
        `path/to/organ.jpg`,
        "image/jpeg",
      );

      const result = await model.generateContent([prompt, imagePart]);
      console.log(result.response.text());
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.Content;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.Part;
      import java.nio.file.Files;
      import java.nio.file.Paths;

      Client client = new Client();

      byte[] imageBytes = Files.readAllBytes(Paths.get("path/to/organ.jpg"));
      Part imagePart = Part.fromBytes(imageBytes, "image/jpeg");

      GenerateContentResponse response =
          client.models.generateContent(
              "gemini-3.8-flash",
              Content.fromParts(Part.fromText("Tell me a story based on this image"), imagePart),
              null);
      System.out.println(response.text());
      ```

=== "Go"

      ```go
      ctx := context.Background()
      client, err := genai.NewClient(ctx, option.WithAPIKey("GEMINI_API_KEY"))
      if err != nil {
          log.Fatal(err)
      }
      defer client.Close()

      model := client.GenerativeModel("gemini-3.8-flash")

      imgData, err := os.ReadFile("path/to/organ.jpg")
      if err != nil {
          log.Fatal(err)
      }

      resp, err := model.GenerateContent(ctx,
          genai.Text("Tell me about this instrument"),
          genai.ImageData("jpeg", imgData))
      if err != nil {
          log.Fatal(err)
      }

      printResponse(resp) // utility for printing response
      ```


**之後**


=== "Python"

      新版 SDK 保留了許多相同的便利功能。例如，`PIL.Image` 物件會自動
        轉換。

      ```python
      from google import genai
      from PIL import Image

      client = genai.Client()

      response = client.models.generate_content(
        model='gemini-3.8-flash',
        contents=[
            'Tell me a story based on this image',
            Image.open(image_path)
        ]
      )
      print(response.text)
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

      const organ = await ai.files.upload({
        file: "path/to/organ.jpg",
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          createUserContent([
            "Tell me a story based on this image",
            createPartFromUri(organ.uri, organ.mimeType)
          ]),
        ],
      });
      console.log(response.text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.Content;
      import com.google.genai.types.File;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.Part;

      Client client = new Client();

      File organ = client.files.upload("path/to/organ.jpg", null);

      GenerateContentResponse response =
          client.models.generateContent(
              "gemini-3.8-flash",
              Content.fromParts(
                  Part.fromText("Tell me a story based on this image"),
                  Part.fromUri(organ.uri().orElse(""), organ.mimeType().orElse("image/jpeg"))),
              null);
      System.out.println(response.text());
      ```

=== "Go"

      ```go
      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      imgData, err := os.ReadFile("path/to/organ.jpg")
      if err != nil {
          log.Fatal(err)
      }

      parts := []*genai.Part{
          {Text: "Tell me a story based on this image"},
          {InlineData: &genai.Blob{Data: imgData, MIMEType: "image/jpeg"}},
      }
      contents := []*genai.Content{
          {Parts: parts},
      }

      result, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, nil)
      if err != nil {
          log.Fatal(err)
      }
      debugPrint(result) // utility for printing result
      ```


### 串流 {#streaming}

**之前**


=== "Python"

      ```python
      import google.generativeai as genai

      response = model.generate_content(
          "Write a cute story about cats.",
          stream=True)
      for chunk in response:
          print(chunk.text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenerativeAI } from "@google/generative-ai";

      const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
      const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

      const prompt = "Write a story about a magic backpack.";

      const result = await model.generateContentStream(prompt);

      // Print text as it comes in.
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        process.stdout.write(chunkText);
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.ResponseStream;
      import com.google.genai.types.GenerateContentResponse;

      Client client = new Client();
      String prompt = "Write a story about a magic backpack.";

      try (ResponseStream<GenerateContentResponse> stream =
          client.models.generateContentStream("gemini-3.8-flash", prompt, null)) {
        for (GenerateContentResponse chunk : stream) {
          System.out.print(chunk.text());
        }
      }
      ```

=== "Go"

      ```go
      ctx := context.Background()
      client, err := genai.NewClient(ctx, option.WithAPIKey("GEMINI_API_KEY"))
      if err != nil {
          log.Fatal(err)
      }
      defer client.Close()

      model := client.GenerativeModel("gemini-3.8-flash")
      iter := model.GenerateContentStream(ctx, genai.Text("Write a story about a magic backpack."))
      for {
          resp, err := iter.Next()
          if err == iterator.Done {
              break
          }
          if err != nil {
              log.Fatal(err)
          }
          printResponse(resp) // utility for printing the response
      }
      ```


**之後**


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      for chunk in client.models.generate_content_stream(
        model='gemini-3.8-flash',
        contents='Tell me a story in 300 words.'
      ):
          print(chunk.text)
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

      const response = await ai.models.generateContentStream({
        model: "gemini-3.8-flash",
        contents: "Write a story about a magic backpack.",
      });
      let text = "";
      for await (const chunk of response) {
        console.log(chunk.text);
        text += chunk.text;
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.ResponseStream;
      import com.google.genai.types.GenerateContentResponse;

      Client client = new Client();

      try (ResponseStream<GenerateContentResponse> response =
          client.models.generateContentStream(
              "gemini-3.8-flash", "Tell me a story in 300 words.", null)) {
        for (GenerateContentResponse chunk : response) {
          System.out.println(chunk.text());
        }
      }
      ```

=== "Go"

      ```go
      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      for result, err := range client.Models.GenerateContentStream(
          ctx,
          "gemini-3.8-flash",
          genai.Text("Write a story about a magic backpack."),
          nil,
      ) {
          if err != nil {
              log.Fatal(err)
          }
          fmt.Print(result.Candidates[0].Content.Parts[0].Text)
      }
      ```


## 設定 {#configuration}

**之前**


=== "Python"

      ```python
      import google.generativeai as genai

      model = genai.GenerativeModel(
        'gemini-3.8-flash',
          system_instruction='you are a story teller for kids under 5 years old',
          generation_config=genai.GenerationConfig(
            max_output_tokens=400,
            top_k=2,
            top_p=0.5,
            temperature=0.5,
            response_mime_type='application/json',
            stop_sequences=['\n'],
          )
      )
      response = model.generate_content('tell me a story in 100 words')
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenerativeAI } from "@google/generative-ai";

      const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
      const model = genAI.getGenerativeModel({
        model: "gemini-3.8-flash",
        generationConfig: {
          candidateCount: 1,
          stopSequences: ["x"],
          maxOutputTokens: 20,
          temperature: 1.0,
        },
      });

      const result = await model.generateContent(
        "Tell me a story about a magic backpack.",
      );
      console.log(result.response.text())
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.Content;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.Part;
      import java.util.Arrays;

      Client client = new Client();

      GenerateContentConfig config =
          GenerateContentConfig.builder()
              .systemInstruction(
                  Content.fromParts(Part.fromText("you are a story teller for kids under 5 years old")))
              .maxOutputTokens(400)
              .topK(2.0f)
              .topP(0.5f)
              .temperature(0.5f)
              .responseMimeType("application/json")
              .stopSequences(Arrays.asList("\n"))
              .build();

      GenerateContentResponse response =
          client.models.generateContent("gemini-3.8-flash", "tell me a story in 100 words", config);
      System.out.println(response.text());
      ```

=== "Go"

      ```go
      ctx := context.Background()
      client, err := genai.NewClient(ctx, option.WithAPIKey("GEMINI_API_KEY"))
      if err != nil {
          log.Fatal(err)
      }
      defer client.Close()

      model := client.GenerativeModel("gemini-3.8-flash")
      model.SetTemperature(0.5)
      model.SetTopP(0.5)
      model.SetTopK(2.0)
      model.SetMaxOutputTokens(100)
      model.ResponseMIMEType = "application/json"
      resp, err := model.GenerateContent(ctx, genai.Text("Tell me about New York"))
      if err != nil {
          log.Fatal(err)
      }
      printResponse(resp) // utility for printing response
      ```


**之後**


=== "Python"

      在新版 SDK 中，所有方法都以關鍵字引數提供必要引數，所有選用輸入則
        放在 `config` 引數中。設定引數可以指定為 Python 字典，或 `Config`
        類別（位於 `google.genai.types` 命名空間中）。為了實用與一致性，
        `types` 模組中的所有定義都是 `pydantic` 類別。

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client()

      response = client.models.generate_content(
      model='gemini-3.8-flash',
      contents='Tell me a story in 100 words.',
      config=types.GenerateContentConfig(
          system_instruction='you are a story teller for kids under 5 years old',
          max_output_tokens= 400,
          top_k= 2,
          top_p= 0.5,
          temperature= 0.5,
          response_mime_type= 'application/json',
          stop_sequences= ['\n'],
          seed=42,
      ),
      )
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: "Tell me a story about a magic backpack.",
        config: {
          candidateCount: 1,
          stopSequences: ["x"],
          maxOutputTokens: 20,
          temperature: 1.0,
        },
      });

      console.log(response.text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;
      import java.util.Arrays;

      Client client = new Client();

      GenerateContentConfig config =
          GenerateContentConfig.builder()
              .candidateCount(1)
              .stopSequences(Arrays.asList("x"))
              .maxOutputTokens(20)
              .temperature(1.0f)
              .build();

      GenerateContentResponse response =
          client.models.generateContent(
              "gemini-3.8-flash", "Tell me a story about a magic backpack.", config);
      System.out.println(response.text());
      ```

=== "Go"

      ```go
      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      result, err := client.Models.GenerateContent(ctx,
          "gemini-3.8-flash",
          genai.Text("Tell me about New York"),
          &genai.GenerateContentConfig{
              Temperature: genai.Ptr[float32](0.5),
              TopP: genai.Ptr[float32](0.5),
              TopK: genai.Ptr[float32](2.0),
              ResponseMIMEType: "application/json",
              StopSequences: []string{"Yankees"},
              CandidateCount: 2,
              Seed: genai.Ptr[int32](42),
              MaxOutputTokens: 128,
              PresencePenalty: genai.Ptr[float32](0.5),
              FrequencyPenalty: genai.Ptr[float32](0.5),
          },
      )
      if err != nil {
          log.Fatal(err)
      }
      debugPrint(result) // utility for printing response
      ```


## 安全設定 {#safety-settings}

使用安全設定產生回應：

**之前**


=== "Python"

      ```python
      import google.generativeai as genai

      model = genai.GenerativeModel('gemini-3.8-flash')
      response = model.generate_content(
          'say something bad',
          safety_settings={
              'HATE': 'BLOCK_ONLY_HIGH',
              'HARASSMENT': 'BLOCK_ONLY_HIGH',
        }
      )
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

      const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
      const model = genAI.getGenerativeModel({
        model: "gemini-3.8-flash",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
        ],
      });

      const unsafePrompt =
        "I support Martians Soccer Club and I think " +
        "Jupiterians Football Club sucks! Write an ironic phrase telling " +
        "them how I feel about them.";

      const result = await model.generateContent(unsafePrompt);

      try {
        result.response.text();
      } catch (e) {
        console.error(e);
        console.log(result.response.candidates[0].safetyRatings);
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.HarmBlockThreshold;
      import com.google.genai.types.HarmCategory;
      import com.google.genai.types.SafetySetting;
      import java.util.Arrays;

      Client client = new Client();

      GenerateContentConfig config =
          GenerateContentConfig.builder()
              .safetySettings(
                  Arrays.asList(
                      SafetySetting.builder()
                          .category(HarmCategory.Known.HARM_CATEGORY_HARASSMENT)
                          .threshold(HarmBlockThreshold.Known.BLOCK_LOW_AND_ABOVE)
                          .build()))
              .build();

      GenerateContentResponse response =
          client.models.generateContent("gemini-3.8-flash", "say something bad", config);
      System.out.println(response.text());
      ```


**之後**


=== "Python"

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client()

      response = client.models.generate_content(
        model='gemini-3.8-flash',
        contents='say something bad',
        config=types.GenerateContentConfig(
            safety_settings= [
                types.SafetySetting(
                    category='HARM_CATEGORY_HATE_SPEECH',
                    threshold='BLOCK_ONLY_HIGH'
                ),
            ]
        ),
      )
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI, HarmCategory, HarmBlockThreshold} from '@google/genai';

      const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });
      const unsafePrompt =
        "I support Martians Soccer Club and I think " +
        "Jupiterians Football Club sucks! Write an ironic phrase telling " +
        "them how I feel about them.";

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: unsafePrompt,
        config: {
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
          ],
        },
      });

      console.log("Finish reason:", response.candidates?.[0]?.finishReason);
      console.log("Safety ratings:", response.candidates?.[0]?.safetyRatings);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.HarmBlockThreshold;
      import com.google.genai.types.HarmCategory;
      import com.google.genai.types.SafetySetting;
      import java.util.Arrays;

      Client client = new Client();

      GenerateContentConfig config =
          GenerateContentConfig.builder()
              .safetySettings(
                  Arrays.asList(
                      SafetySetting.builder()
                          .category(HarmCategory.Known.HARM_CATEGORY_HATE_SPEECH)
                          .threshold(HarmBlockThreshold.Known.BLOCK_ONLY_HIGH)
                          .build()))
              .build();

      GenerateContentResponse response =
          client.models.generateContent("gemini-3.8-flash", "say something bad", config);
      System.out.println("Finish reason: " + response.finishReason());
      ```


## 非同步 {#async}

**之前**


=== "Python"

      ```python
      import google.generativeai as genai

      model = genai.GenerativeModel('gemini-3.8-flash')
      response = model.generate_content_async(
          'tell me a story in 100 words'
      )
      ```


**之後**


=== "Python"

      若要將新版 SDK 與 `asyncio` 搭配使用，每個方法都有一個獨立的
        `async` 實作，位於 `client.aio` 之下。

      ```python
      from google import genai

      client = genai.Client()

      response = await client.aio.models.generate_content(
        model='gemini-3.8-flash',
        contents='Tell me a story in 300 words.'
      )
      ```


## 聊天 {#chat}

開始聊天，並將訊息傳送給模型：

**之前**


=== "Python"

      ```python
      import google.generativeai as genai

      model = genai.GenerativeModel('gemini-3.8-flash')
      chat = model.start_chat()

      response = chat.send_message(
          "Tell me a story in 100 words")
      response = chat.send_message(
          "What happened after that?")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenerativeAI } from "@google/generative-ai";

      const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
      const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Hello" }],
          },
          {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
          },
        ],
      });
      let result = await chat.sendMessage("I have 2 dogs in my house.");
      console.log(result.response.text());
      result = await chat.sendMessage("How many paws are in my house?");
      console.log(result.response.text());
      ```

=== "Java"

      ```java
      import com.google.genai.Chat;
      import com.google.genai.Client;
      import com.google.genai.types.GenerateContentResponse;

      Client client = new Client();
      Chat chat = client.chats.create("gemini-3.8-flash");

      GenerateContentResponse response1 = chat.sendMessage("Tell me a story in 100 words");
      System.out.println(response1.text());

      GenerateContentResponse response2 = chat.sendMessage("What happened after that?");
      System.out.println(response2.text());
      ```

=== "Go"

      ```go
      ctx := context.Background()
      client, err := genai.NewClient(ctx, option.WithAPIKey("GEMINI_API_KEY"))
      if err != nil {
          log.Fatal(err)
      }
      defer client.Close()

      model := client.GenerativeModel("gemini-3.8-flash")
      cs := model.StartChat()

      cs.History = []*genai.Content{
          {
              Parts: []genai.Part{
                  genai.Text("Hello, I have 2 dogs in my house."),
              },
              Role: "user",
          },
          {
              Parts: []genai.Part{
                  genai.Text("Great to meet you. What would you like to know?"),
              },
              Role: "model",
          },
      }

      res, err := cs.SendMessage(ctx, genai.Text("How many paws are in my house?"))
      if err != nil {
          log.Fatal(err)
      }
      printResponse(res) // utility for printing the response
      ```


**之後**


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      chat = client.chats.create(model='gemini-3.8-flash')

      response = chat.send_message(
          message='Tell me a story in 100 words')
      response = chat.send_message(
          message='What happened after that?')
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });
      const chat = ai.chats.create({
        model: "gemini-3.8-flash",
        history: [
          {
            role: "user",
            parts: [{ text: "Hello" }],
          },
          {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
          },
        ],
      });

      const response1 = await chat.sendMessage({
        message: "I have 2 dogs in my house.",
      });
      console.log("Chat response 1:", response1.text);

      const response2 = await chat.sendMessage({
        message: "How many paws are in my house?",
      });
      console.log("Chat response 2:", response2.text);
      ```

=== "Java"

      ```java
      import com.google.genai.Chat;
      import com.google.genai.Client;
      import com.google.genai.types.GenerateContentResponse;

      Client client = new Client();
      Chat chat = client.chats.create("gemini-3.8-flash");

      GenerateContentResponse response1 = chat.sendMessage("I have 2 dogs in my house.");
      System.out.println("Chat response 1: " + response1.text());

      GenerateContentResponse response2 = chat.sendMessage("How many paws are in my house?");
      System.out.println("Chat response 2: " + response2.text());
      ```

=== "Go"

      ```go
      ctx := context.Background()
      client, err := genai.NewClient(ctx, nil)
      if err != nil {
          log.Fatal(err)
      }

      chat, err := client.Chats.Create(ctx, "gemini-3.8-flash", nil, nil)
      if err != nil {
          log.Fatal(err)
      }

      result, err := chat.SendMessage(ctx, genai.Part{Text: "Hello, I have 2 dogs in my house."})
      if err != nil {
          log.Fatal(err)
      }
      debugPrint(result) // utility for printing result

      result, err = chat.SendMessage(ctx, genai.Part{Text: "How many paws are in my house?"})
      if err != nil {
          log.Fatal(err)
      }
      debugPrint(result) // utility for printing result
      ```


## 函式呼叫 {#function-calling}

**之前**


=== "Python"

      ```python
      import google.generativeai as genai
      from enum import Enum

      def get_current_weather(location: str) -> str:
          """Get the current whether in a given location.

          Args:
              location: required, The city and state, e.g. San Franciso, CA
              unit: celsius or fahrenheit
          """
          print(f'Called with: {location=}')
          return "23C"

      model = genai.GenerativeModel(
          model_name="gemini-3.8-flash",
          tools=[get_current_weather]
      )

      response = model.generate_content("What is the weather in San Francisco?")
      function_call = response.candidates[0].parts[0].function_call
      ```


**之後**


=== "Python"

      在新版 SDK 中，自動函式呼叫是預設行為。此處將其停用。

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client()

      def get_current_weather(location: str) -> str:
        """Get the current whether in a given location.

        Args:
            location: required, The city and state, e.g. San Franciso, CA
            unit: celsius or fahrenheit
        """
        print(f'Called with: {location=}')
        return "23C"

      response = client.models.generate_content(
      model='gemini-3.8-flash',
      contents="What is the weather like in Boston?",
      config=types.GenerateContentConfig(
          tools=[get_current_weather],
          automatic_function_calling={'disable': True},
      ),
      )

      function_call = response.candidates[0].content.parts[0].function_call
      ```


### 自動函式呼叫 {#automatic-function}

**之前**


=== "Python"

      舊版 SDK 僅在聊天中支援自動函式呼叫。在新版 SDK 中，這是
        `generate_content` 的預設行為。

      ```python
      import google.generativeai as genai

      def get_current_weather(city: str) -> str:
        return "23C"

      model = genai.GenerativeModel(
        model_name="gemini-3.8-flash",
        tools=[get_current_weather]
      )

      chat = model.start_chat(
        enable_automatic_function_calling=True)
      result = chat.send_message("What is the weather in San Francisco?")
      ```


**之後**


=== "Python"

      ```python
      from google import genai
      from google.genai import types
      client = genai.Client()

      def get_current_weather(city: str) -> str:
          return "23C"

      response = client.models.generate_content(
        model='gemini-3.8-flash',
        contents="What is the weather like in Boston?",
        config=types.GenerateContentConfig(
            tools=[get_current_weather]
        ),
      )
      ```


## 程式碼執行 {#code-execution}

程式碼執行是一項工具，可讓模型產生 Python 程式碼、執行它，並回傳結果。

**之前**


=== "Python"

      ```python
      import google.generativeai as genai

      model = genai.GenerativeModel(
          model_name="gemini-3.8-flash",
          tools="code_execution"
      )

      result = model.generate_content(
        "What is the sum of the first 50 prime numbers? Generate and run code for "
        "the calculation, and make sure you get all 50.")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenerativeAI } from "@google/generative-ai";

      const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
      const model = genAI.getGenerativeModel({
        model: "gemini-3.8-flash",
        tools: [{ codeExecution: {} }],
      });

      const result = await model.generateContent(
        "What is the sum of the first 50 prime numbers? " +
          "Generate and run code for the calculation, and make sure you get " +
          "all 50.",
      );

      console.log(result.response.text());
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.Tool;
      import com.google.genai.types.ToolCodeExecution;
      import java.util.Arrays;

      Client client = new Client();

      GenerateContentConfig config =
          GenerateContentConfig.builder()
              .tools(
                  Arrays.asList(
                      Tool.builder().codeExecution(ToolCodeExecution.builder().build()).build()))
              .build();

      GenerateContentResponse response =
          client.models.generateContent(
              "gemini-3.8-flash",
              "What is the sum of the first 50 prime numbers? Generate and run code for "
                  + "the calculation, and make sure you get all 50.",
              config);
      System.out.println(response.text());
      ```


**之後**


=== "Python"

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client()

      response = client.models.generate_content(
          model='gemini-3.8-flash',
          contents='What is the sum of the first 50 prime numbers? Generate and run '
                  'code for the calculation, and make sure you get all 50.',
          config=types.GenerateContentConfig(
              tools=[types.Tool(code_execution=types.ToolCodeExecution)],
          ),
      )
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Write and execute code that calculates the sum of the first 50 prime numbers.
                  Ensure that only the executable code and its resulting output are generated.`,
      });

      // Each part may contain text, executable code, or an execution result.
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        console.log(part);
        console.log("\n");
      }

      console.log("-".repeat(80));
      // The `.text` accessor concatenates the parts into a markdown-formatted text.
      console.log("\n", response.text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.Part;
      import com.google.genai.types.Tool;
      import com.google.genai.types.ToolCodeExecution;
      import java.util.Arrays;

      Client client = new Client();

      GenerateContentConfig config =
          GenerateContentConfig.builder()
              .tools(
                  Arrays.asList(
                      Tool.builder().codeExecution(ToolCodeExecution.builder().build()).build()))
              .build();

      GenerateContentResponse response =
          client.models.generateContent(
              "gemini-3.8-flash",
              "Write and execute code that calculates the sum of the first 50 prime numbers. "
                  + "Ensure that only the executable code and its resulting output are generated.",
              config);

      if (response.parts() != null) {
        for (Part part : response.parts()) {
          System.out.println(part);
        }
      }
      System.out.println(response.text());
      ```


## 搜尋接地 {#search-grounding}

`GoogleSearch`（Gemini>=2.0）與 `GoogleSearchRetrieval`（Gemini < 2.0）是
讓模型擷取公開網路資料以進行接地的工具，由 Google 提供支援。

**之前**


=== "Python"

      ```python
      import google.generativeai as genai

      model = genai.GenerativeModel('gemini-3.8-flash')
      response = model.generate_content(
          contents="what is the Google stock price?",
          tools='google_search_retrieval'
      )
      ```


**之後**


=== "Python"

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client()

      response = client.models.generate_content(
          model='gemini-3.8-flash',
          contents='What is the Google stock price?',
          config=types.GenerateContentConfig(
              tools=[
                  types.Tool(
                      google_search=types.GoogleSearch()
                  )
              ]
          )
      )
      ```


## JSON 回應 {#json-response}

以 JSON 格式產生答案。

**之前**


=== "Python"

      透過指定 `response_schema` 並設定
        `response_mime_type="application/json"`，使用者可以限制模型依指定的
        結構產生 `JSON` 回應。

      ```python
      import google.generativeai as genai
      import typing_extensions as typing

      class CountryInfo(typing.TypedDict):
        name: str
        population: int
        capital: str
        continent: str
        major_cities: list[str]
        gdp: int
        official_language: str
        total_area_sq_mi: int

      model = genai.GenerativeModel(model_name="gemini-3.8-flash")
      result = model.generate_content(
        "Give me information of the United States",
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema = CountryInfo
        ),
      )
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

      const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");

      const schema = {
        description: "List of recipes",
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            recipeName: {
              type: SchemaType.STRING,
              description: "Name of the recipe",
              nullable: false,
            },
          },
          required: ["recipeName"],
        },
      };

      const model = genAI.getGenerativeModel({
        model: "gemini-3.8-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

      const result = await model.generateContent(
        "List a few popular cookie recipes.",
      );
      console.log(result.response.text());
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.Schema;
      import com.google.genai.types.Type;
      import java.util.Arrays;
      import java.util.Map;

      Client client = new Client();

      Schema schema =
          Schema.builder()
              .description("List of recipes")
              .type(Type.Known.ARRAY)
              .items(
                  Schema.builder()
                      .type(Type.Known.OBJECT)
                      .properties(
                          Map.of(
                              "recipeName",
                              Schema.builder()
                                  .type(Type.Known.STRING)
                                  .description("Name of the recipe")
                                  .build()))
                      .required(Arrays.asList("recipeName"))
                      .build())
              .build();

      GenerateContentConfig config =
          GenerateContentConfig.builder()
              .responseMimeType("application/json")
              .responseSchema(schema)
              .build();

      GenerateContentResponse response =
          client.models.generateContent(
              "gemini-3.8-flash", "List a few popular cookie recipes.", config);
      System.out.println(response.text());
      ```


**之後**


=== "Python"

      新版 SDK 使用 `pydantic` 類別來提供結構定義（不過你也可以傳入
        `genai.types.Schema`，或等效的 `dict`）。在可能的情況下，SDK 會解析
        回傳的 JSON，並將結果放在 `response.parsed` 中回傳。如果你提供的
        結構定義是 `pydantic` 類別，SDK 會將該 `JSON` 轉換為該類別的
        執行個體。

      ```python
      from google import genai
      from pydantic import BaseModel

      client = genai.Client()

      class CountryInfo(BaseModel):
        name: str
        population: int
        capital: str
        continent: str
        major_cities: list[str]
        gdp: int
        official_language: str
        total_area_sq_mi: int

      response = client.models.generate_content(
        model='gemini-3.8-flash',
        contents='Give me information of the United States.',
        config={
            'response_mime_type': 'application/json',
            'response_schema': CountryInfo,
        },
      )

      response.parsed
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: "List a few popular cookie recipes.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                recipeName: { type: "string" },
                ingredients: { type: "array", items: { type: "string" } },
              },
              required: ["recipeName", "ingredients"],
            },
          },
        },
      });
      console.log(response.text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.Schema;
      import com.google.genai.types.Type;
      import java.util.Arrays;
      import java.util.Map;

      Client client = new Client();

      Schema schema =
          Schema.builder()
              .type(Type.Known.ARRAY)
              .items(
                  Schema.builder()
                      .type(Type.Known.OBJECT)
                      .properties(
                          Map.of(
                              "recipeName", Schema.builder().type(Type.Known.STRING).build(),
                              "ingredients",
                                  Schema.builder()
                                      .type(Type.Known.ARRAY)
                                      .items(Schema.builder().type(Type.Known.STRING).build())
                                      .build()))
                      .required(Arrays.asList("recipeName", "ingredients"))
                      .build())
              .build();

      GenerateContentConfig config =
          GenerateContentConfig.builder()
              .responseMimeType("application/json")
              .responseSchema(schema)
              .build();

      GenerateContentResponse response =
          client.models.generateContent(
              "gemini-3.8-flash", "List a few popular cookie recipes.", config);
      System.out.println(response.text());
      ```


## 檔案 {#files}

### 上傳 {#upload}

上傳檔案：

**之前**


=== "Python"

      ```python
      import requests
      import pathlib
      import google.generativeai as genai

      # Download file
      response = requests.get(
          'https://storage.googleapis.com/generativeai-downloads/data/a11.txt')
      pathlib.Path('a11.txt').write_text(response.text)

      file = genai.upload_file(path='a11.txt')

      model = genai.GenerativeModel('gemini-3.8-flash')
      response = model.generate_content([
          'Can you summarize this file:',
          my_file
      ])
      print(response.text)
      ```


**之後**


=== "Python"

      ```python
      import requests
      import pathlib
      from google import genai

      client = genai.Client()

      # Download file
      response = requests.get(
          'https://storage.googleapis.com/generativeai-downloads/data/a11.txt')
      pathlib.Path('a11.txt').write_text(response.text)

      my_file = client.files.upload(file='a11.txt')

      response = client.models.generate_content(
          model='gemini-3.8-flash',
          contents=[
              'Can you summarize this file:',
              my_file
          ]
      )
      print(response.text)
      ```


### 列出與取得 {#list-and-get}

列出已上傳的檔案，並依檔案名稱取得已上傳的檔案：

**之前**


=== "Python"

      ```python
      import google.generativeai as genai

      for file in genai.list_files():
        print(file.name)

      file = genai.get_file(name=file.name)
      ```


**之後**


=== "Python"

      ```python
      from google import genai
      client = genai.Client()

      for file in client.files.list():
          print(file.name)

      file = client.files.get(name=file.name)
      ```


### 刪除 {#delete}

刪除檔案：

**之前**


=== "Python"

      ```python
      import pathlib
      import google.generativeai as genai

      pathlib.Path('dummy.txt').write_text(dummy)
      dummy_file = genai.upload_file(path='dummy.txt')

      file = genai.delete_file(name=dummy_file.name)
      ```


**之後**


=== "Python"

      ```python
      import pathlib
      from google import genai

      client = genai.Client()

      pathlib.Path('dummy.txt').write_text(dummy)
      dummy_file = client.files.upload(file='dummy.txt')

      response = client.files.delete(name=dummy_file.name)
      ```


## 上下文快取 {#context-caching}

上下文快取可讓使用者將內容傳給模型一次、快取輸入 tokens，然後在後續呼叫中
參照這些已快取的 token，以降低成本。

**之前**


=== "Python"

      ```python
      import requests
      import pathlib
      import google.generativeai as genai
      from google.generativeai import caching

      # Download file
      response = requests.get(
          'https://storage.googleapis.com/generativeai-downloads/data/a11.txt')
      pathlib.Path('a11.txt').write_text(response.text)

      # Upload file
      document = genai.upload_file(path="a11.txt")

      # Create cache
      apollo_cache = caching.CachedContent.create(
          model="gemini-3.8-flash",
          system_instruction="You are an expert at analyzing transcripts.",
          contents=[document],
      )

      # Generate response
      apollo_model = genai.GenerativeModel.from_cached_content(
          cached_content=apollo_cache
      )
      response = apollo_model.generate_content("Find a lighthearted moment from this transcript")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleAICacheManager, GoogleAIFileManager } from "@google/generative-ai/server";
      import { GoogleGenerativeAI } from "@google/generative-ai";

      const cacheManager = new GoogleAICacheManager("GEMINI_API_KEY");
      const fileManager = new GoogleAIFileManager("GEMINI_API_KEY");

      const uploadResult = await fileManager.uploadFile("path/to/a11.txt", {
        mimeType: "text/plain",
      });

      const cacheResult = await cacheManager.create({
        model: "models/gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                fileData: {
                  fileUri: uploadResult.file.uri,
                  mimeType: uploadResult.file.mimeType,
                },
              },
            ],
          },
        ],
      });

      console.log(cacheResult);

      const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
      const model = genAI.getGenerativeModelFromCachedContent(cacheResult);
      const result = await model.generateContent(
        "Please summarize this transcript.",
      );
      console.log(result.response.text());
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.types.CachedContent;
      import com.google.genai.types.Content;
      import com.google.genai.types.CreateCachedContentConfig;
      import com.google.genai.types.File;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.Part;
      import java.util.Arrays;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      File uploadResult = client.files.upload("path/to/a11.txt", null);

      CachedContent cacheResult =
          client.caches.create(
              "gemini-3.8-flash",
              CreateCachedContentConfig.builder()
                  .contents(
                      Arrays.asList(
                          Content.fromParts(
                              Part.fromUri(
                                  uploadResult.uri().orElse(""),
                                  uploadResult.mimeType().orElse("text/plain")))))
                  .systemInstruction(
                      Content.fromParts(Part.fromText("You are an expert at analyzing transcripts.")))
                  .build());

      GenerateContentResponse response =
          client.models.generateContent(
              "gemini-3.8-flash",
              "Please summarize this transcript.",
              GenerateContentConfig.builder().cachedContent(cacheResult.name().orElse("")).build());
      System.out.println(response.text());
      ```


**之後**


=== "Python"

      ```python
      import requests
      import pathlib
      from google import genai
      from google.genai import types

      client = genai.Client(http_options={"api_version": "v1beta"})

      # Check which models support caching.
      for m in client.models.list():
        for action in m.supported_actions:
          if action == "createCachedContent":
            print(m.name)
            break

      # Download file
      response = requests.get(
          'https://storage.googleapis.com/generativeai-downloads/data/a11.txt')
      pathlib.Path('a11.txt').write_text(response.text)

      # Upload file
      document = client.files.upload(file='a11.txt')

      # Create cache
      model='gemini-3.8-flash'
      apollo_cache = client.caches.create(
            model=model,
            config={
                'contents': [document],
                'system_instruction': 'You are an expert at analyzing transcripts.',
            },
        )

      # Generate response
      response = client.models.generate_content(
          model=model,
          contents='Find a lighthearted moment from this transcript',
          config=types.GenerateContentConfig(
              cached_content=apollo_cache.name,
          )
      )
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI, createPartFromUri, createUserContent} from '@google/genai';

      const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY", httpOptions: { apiVersion: "v1beta" } });
      const filePath = "path/to/a11.txt";
      const document = await ai.files.upload({
        file: filePath,
        config: { mimeType: "text/plain" },
      });
      console.log("Uploaded file name:", document.name);
      const modelName = "gemini-3.8-flash";

      const contents = [
        createUserContent(createPartFromUri(document.uri, document.mimeType)),
      ];

      const cache = await ai.caches.create({
        model: modelName,
        config: {
          contents: contents,
          systemInstruction: "You are an expert analyzing transcripts.",
        },
      });
      console.log("Cache created:", cache);

      const response = await ai.models.generateContent({
        model: modelName,
        contents: "Please summarize this transcript",
        config: { cachedContent: cache.name },
      });
      console.log("Response text:", response.text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.types.CachedContent;
      import com.google.genai.types.Content;
      import com.google.genai.types.CreateCachedContentConfig;
      import com.google.genai.types.File;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;
      import com.google.genai.types.Part;
      import java.util.Arrays;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      File document = client.files.upload("a11.txt", null);
      String modelName = "gemini-3.8-flash";

      CachedContent cache =
          client.caches.create(
              modelName,
              CreateCachedContentConfig.builder()
                  .contents(
                      Arrays.asList(
                          Content.fromParts(
                              Part.fromUri(
                                  document.uri().orElse(""), document.mimeType().orElse("text/plain")))))
                  .systemInstruction(
                      Content.fromParts(Part.fromText("You are an expert analyzing transcripts.")))
                  .build());

      GenerateContentResponse response =
          client.models.generateContent(
              modelName,
              "Find a lighthearted moment from this transcript",
              GenerateContentConfig.builder().cachedContent(cache.name().orElse("")).build());
      System.out.println(response.text());
      ```


## 計算 token 數 {#count-tokens}

計算請求中的 token 數量。

**之前**


=== "Python"

      ```python
      import google.generativeai as genai

      model = genai.GenerativeModel('gemini-3.8-flash')
      response = model.count_tokens(
          'The quick brown fox jumps over the lazy dog.')
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenerativeAI } from "@google/generative-ai";

      const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
      const model = genAI.getGenerativeModel({
        model: "gemini-3.8-flash",
      });

      // Count tokens in a prompt without calling text generation.
      const countResult = await model.countTokens(
        "The quick brown fox jumps over the lazy dog.",
      );

      console.log(countResult.totalTokens); // 11

      const generateResult = await model.generateContent(
        "The quick brown fox jumps over the lazy dog.",
      );

      // On the response for `generateContent`, use `usageMetadata`
      // to get separate input and output token counts
      // (`promptTokenCount` and `candidatesTokenCount`, respectively),
      // as well as the combined token count (`totalTokenCount`).
      console.log(generateResult.response.usageMetadata);
      // candidatesTokenCount and totalTokenCount depend on response, may vary
      // { promptTokenCount: 11, candidatesTokenCount: 124, totalTokenCount: 135 }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.CountTokensResponse;
      import com.google.genai.types.GenerateContentResponse;

      Client client = new Client();
      String prompt = "The quick brown fox jumps over the lazy dog.";

      CountTokensResponse countResult = client.models.countTokens("gemini-3.8-flash", prompt, null);
      System.out.println(countResult.totalTokens().orElse(0));

      GenerateContentResponse generateResult =
          client.models.generateContent("gemini-3.8-flash", prompt, null);
      System.out.println(generateResult.usageMetadata());
      ```


**之後**


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      response = client.models.count_tokens(
          model='gemini-3.8-flash',
          contents='The quick brown fox jumps over the lazy dog.',
      )
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });
      const prompt = "The quick brown fox jumps over the lazy dog.";
      const countTokensResponse = await ai.models.countTokens({
        model: "gemini-3.8-flash",
        contents: prompt,
      });
      console.log(countTokensResponse.totalTokens);

      const generateResponse = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });
      console.log(generateResponse.usageMetadata);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.CountTokensResponse;
      import com.google.genai.types.GenerateContentResponse;

      Client client = new Client();
      String prompt = "The quick brown fox jumps over the lazy dog.";

      CountTokensResponse countTokensResponse =
          client.models.countTokens("gemini-3.8-flash", prompt, null);
      System.out.println(countTokensResponse.totalTokens().orElse(0));

      GenerateContentResponse generateResponse =
          client.models.generateContent("gemini-3.8-flash", prompt, null);
      System.out.println(generateResponse.usageMetadata());
      ```


## 產生圖片 {#generate-images}

產生圖片：

**之前**


=== "Python"

      ```python
      #pip install https://github.com/google-gemini/generative-ai-python@imagen
      import google.generativeai as genai

      imagen = genai.ImageGenerationModel(
          "imagen-3.0-generate-001")
      gen_images = imagen.generate_images(
          prompt="Robot holding a red skateboard",
          number_of_images=1,
          safety_filter_level="block_low_and_above",
          person_generation="allow_adult",
          aspect_ratio="3:4",
      )
      ```


**之後**


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      gen_images = client.models.generate_images(
          model='gemini-2.5-flash-image',
          prompt='Robot holding a red skateboard',
          config=types.GenerateImagesConfig(
              number_of_images= 1,
              safety_filter_level= "BLOCK_LOW_AND_ABOVE",
              person_generation= "ALLOW_ADULT",
              aspect_ratio= "3:4",
          )
      )

      for n, image in enumerate(gen_images.generated_images):
          pathlib.Path(f'{n}.png').write_bytes(
              image.image.image_bytes)
      ```


## 嵌入內容 {#embed-content}

產生內容的嵌入向量。

**之前**


=== "Python"

      ```python
      import google.generativeai as genai

      response = genai.embed_content(
        model='models/gemini-embedding-001',
        content='Hello world'
      )
      ```

=== "JavaScript"

      ```javascript
        import { GoogleGenerativeAI } from "@google/generative-ai";

        const genAI = new GoogleGenerativeAI("GEMINI_API_KEY");
        const model = genAI.getGenerativeModel({
          model: "gemini-embedding-001",
      });

        const result = await model.embedContent("Hello world!");

        console.log(result.embedding);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.EmbedContentResponse;

      Client client = new Client();

      EmbedContentResponse response =
          client.models.embedContent("gemini-embedding-001", "Hello world!", null);
      System.out.println(response.embeddings());
      ```


**之後**


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      response = client.models.embed_content(
        model='gemini-embedding-001',
        contents='Hello world',
      )
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });
      const text = "Hello World!";
      const result = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
        config: { outputDimensionality: 10 },
      });
      console.log(result.embeddings);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.EmbedContentConfig;
      import com.google.genai.types.EmbedContentResponse;

      Client client = new Client();
      String text = "Hello World!";

      EmbedContentResponse result =
          client.models.embedContent(
              "gemini-embedding-001",
              text,
              EmbedContentConfig.builder().outputDimensionality(10).build());
      System.out.println(result.embeddings());
      ```


