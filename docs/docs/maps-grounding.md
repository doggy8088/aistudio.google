# 使用 Google Maps 接地

使用 Google Maps 接地將 Gemini 的生成能力與 Google Maps 豐富、具事實依據且即時更新的資料結合起來。開發人員可透過這項功能，輕鬆將位置感知功能整合至應用程式中。當使用者的查詢涉及 Maps 資料相關的脈絡時，Gemini 模型會運用 Google Maps，提供與使用者指定位置或大致區域相關、事實正確且最新的回答。

* **正確且具位置感知的回應**：運用 Google Maps 龐大且最新的資料，處理具地理特定性的查詢。

* **更完善的個人化**：依據使用者提供的位置，量身打造推薦內容與資訊。


## 開始使用 {#get-started}

本範例示範如何將使用 Google Maps 接地整合至應用程式，為使用者的查詢提供正確且具位置感知的回應。提示詞會要求在地推薦，並可選擇性地附上使用者位置，讓 Gemini 模型能運用 Google Maps 資料。


=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="What are the best Italian restaurants within a 15-minute walk from here?",
          tools=[{
              "type": "google_maps",
              "latitude": 34.050481,
              "longitude": -118.248526
          }]
      )

      # Print the model's text response and annotations
      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                      if content_block.annotations:
                          print("\nSources:")
                          for annotation in content_block.annotations:
                              if annotation.type == "place_citation":
                                  print(f" - {annotation.name}: {annotation.url}")
      ```

=== "JavaScript"

      ```javascript
      // This will only work for SDK newer than 2.0.0
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "What are the best Italian restaurants within a 15-minute walk from here?",
          tools: [{
            type: "google_maps",
            latitude: 34.050481,
            longitude: -118.248526
          }]
        });

        // Print the model's text response and annotations
        for (const step of interaction.steps) {
          if (step.type === 'model_output') {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === 'text') {
                console.log(contentBlock.text);
                if (contentBlock.annotations) {
                  console.log("\nSources:");
                  for (const annotation of contentBlock.annotations) {
                    if (annotation.type === 'place_citation') {
                      console.log(` - {annotation.name}: {annotation.url}`);
                    }
                  }
                }
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Annotation;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.GoogleMaps;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.PlaceCitation;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(
                  InteractionsInput.of(
                      "What are the best Italian restaurants within a 15-minute walk from here?"))
              .tools(
                  Arrays.asList(
                      GoogleMaps.builder().latitude(34.050481).longitude(-118.248526).build()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      // Print the model's text response and annotations
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
                      if (annotation instanceof PlaceCitation) {
                        PlaceCitation citation = (PlaceCitation) annotation;
                        System.out.printf(
                            "  - %s: %s%n", citation.name().orElse(""), citation.url().orElse(""));
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
                      Input: interactions.NewInteractionsInput("What are the best Italian restaurants within a 15-minute walk from here?"),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.GoogleMaps{
                              Latitude:  genai.Ptr(34.050481),
                              Longitude: genai.Ptr(-118.248526),
                          }),
                      },
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          // Print the model's text response and annotations
          for _, step := range resp.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, content := range step.ModelOutputStep.Content {
                      if content.TextContent != nil {
                          fmt.Println(content.TextContent.Text)
                          if len(content.TextContent.Annotations) > 0 {
                              fmt.Println("\nSources:")
                              for _, annotation := range content.TextContent.Annotations {
                                  if annotation.PlaceCitation != nil {
                                      c := annotation.PlaceCitation
                                      name := ""
                                      if c.Name != nil {
                                          name = *c.Name
                                      }
                                      url := ""
                                      if c.URL != nil {
                                          url = *c.URL
                                      }
                                      fmt.Printf("  - %s: %s\n", name, url)
                                  }
                              }
                          }
                      }
                  }
              }
          }
      }
      ```

=== "REST"

      ```shell
      # Specifies the API revision to avoid breaking changes when they become default
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "What are the best Italian restaurants within a 15-minute walk from here?",
          "tools": [{
            "type": "google_maps",
            "latitude": 34.050481,
            "longitude": -118.248526
          }]
        }'
      ```


## 使用 Google Maps 接地的運作方式 {#how-it-works}

使用 Google Maps 接地以 Maps API 作為接地來源，將 Gemini API 與 Google Geo 生態系整合。當使用者的查詢包含地理脈絡時，Gemini 模型可叫用使用 Google Maps 接地工具。模型接著便能依據與所提供位置相關的 Google Maps 資料，生成接地的回應。

流程通常如下：

1. **使用者查詢**：使用者向應用程式提交查詢，其中可能包含地理脈絡（例如「我附近的咖啡店」、「舊金山的博物館」）。

2. **工具叫用**：Gemini 模型辨識出地理意圖後，會叫用使用 Google Maps 接地工具。此工具可選擇性地接收使用者的 `latitude` 與 `longitude`。此工具為文字搜尋工具，行為與在 Maps 上搜尋類似：在地查詢（「我附近」）會使用座標，而特定或非在地的查詢則不太會受到明確位置的影響。

3. **資料擷取**：使用 Google Maps 接地服務會向 Google Maps 查詢相關資訊（例如地點、評論、相片、地址、營業時間）。

4. **接地生成**：擷取到的 Maps 資料會用於輔助 Gemini 模型生成回應，確保事實正確且切合需求。

5. **回應與註解**：模型會傳回附有行內註解的文字回應，註解會連結至 Google Maps 來源，讓開發人員能顯示引用出處。


## 為何以及何時使用 Google Maps 接地 {#why-use}

使用 Google Maps 接地非常適合需要正確、最新且具位置特定性資訊的應用程式。它能運用 Google Maps 涵蓋全球超過 2 億 5,000 萬個地點的龐大資料庫，提供切合需求的個人化內容，進而提升使用者體驗。

當應用程式需要執行下列事項時，建議使用 Google Maps 接地：

* 針對具地理特定性的問題，提供完整且正確的回應。

* 打造對話式旅遊規劃工具與在地指南。

* 依據位置與使用者偏好（例如餐廳或商店）推薦景點。

* 為社交、零售或美食外送服務打造具位置感知的體驗。


在鄰近程度與最新事實資料至關重要的使用情境中，例如尋找「我附近最好的咖啡店」或取得路線指引，使用 Google Maps 接地都能發揮出色效果。

## 使用情境 {#use-cases}

使用 Google Maps 接地支援多種具位置感知的使用情境。

### 處理特定地點的問題 {#place-specific}

針對特定地點提出詳細問題，即可取得依據 Google 使用者評論與其他 Maps 資料所生成的回答。


=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Is there a cafe near the corner of 1st and Main that has outdoor seating?",
          tools=[{
              "type": "google_maps",
              "latitude": 34.050481,
              "longitude": -118.248526
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
                              if annotation.type == "place_citation":
                                  print(f" - {annotation.name}: {annotation.url}")
      ```

=== "JavaScript"

      ```javascript
      // This will only work for SDK newer than 2.0.0
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Is there a cafe near the corner of 1st and Main that has outdoor seating?",
          tools: [{
            type: "google_maps",
            latitude: 34.050481,
            longitude: -118.248526
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
                    if (annotation.type === 'place_citation') {
                      console.log(` - ${annotation.name}: ${annotation.url}`);
                    }
                  }
                }
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Annotation;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.GoogleMaps;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.PlaceCitation;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(
                  InteractionsInput.of(
                      "Is there a cafe near the corner of 1st and Main that has outdoor seating?"))
              .tools(
                  Arrays.asList(
                      GoogleMaps.builder().latitude(34.050481).longitude(-118.248526).build()))
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
                      if (annotation instanceof PlaceCitation) {
                        PlaceCitation citation = (PlaceCitation) annotation;
                        System.out.printf(
                            "  - %s: %s%n", citation.name().orElse(""), citation.url().orElse(""));
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
                      Input: interactions.NewInteractionsInput("Is there a cafe near the corner of 1st and Main that has outdoor seating?"),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.GoogleMaps{
                              Latitude:  genai.Ptr(34.050481),
                              Longitude: genai.Ptr(-118.248526),
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
                                  if annotation.PlaceCitation != nil {
                                      c := annotation.PlaceCitation
                                      name := ""
                                      if c.Name != nil {
                                          name = *c.Name
                                      }
                                      url := ""
                                      if c.URL != nil {
                                          url = *c.URL
                                      }
                                      fmt.Printf("  - %s: %s\n", name, url)
                                  }
                              }
                          }
                      }
                  }
              }
          }
      }
      ```


### 提供以位置為基礎的個人化服務 {#location-personalization}

取得依據使用者偏好與特定地理區域量身打造的推薦內容。


=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Which family-friendly restaurants near here have the best playground reviews?",
          tools=[{
              "type": "google_maps",
              "latitude": 30.2672,
              "longitude": -97.7431
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
                              if annotation.type == "place_citation":
                                  print(f" - {annotation.name}: {annotation.url}")
      ```

=== "JavaScript"

      ```javascript
      // This will only work for SDK newer than 2.0.0
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Which family-friendly restaurants near here have the best playground reviews?",
          tools: [{
            type: "google_maps",
            latitude: 30.2672,
            longitude: -97.7431
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
                    if (annotation.type === 'place_citation') {
                      console.log(` - ${annotation.name}: ${annotation.url}`);
                    }
                  }
                }
              }
            }
          }
        }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Annotation;
      import com.google.genai.gaos.models.interactions.Content;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.GoogleMaps;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.PlaceCitation;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(
                  InteractionsInput.of(
                      "Which family-friendly restaurants near here have the best playground reviews?"))
              .tools(
                  Arrays.asList(GoogleMaps.builder().latitude(30.2672).longitude(-97.7431).build()))
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
                      if (annotation instanceof PlaceCitation) {
                        PlaceCitation citation = (PlaceCitation) annotation;
                        System.out.printf(
                            "  - %s: %s%n", citation.name().orElse(""), citation.url().orElse(""));
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
                      Input: interactions.NewInteractionsInput("Which family-friendly restaurants near here have the best playground reviews?"),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.GoogleMaps{
                              Latitude:  genai.Ptr(30.2672),
                              Longitude: genai.Ptr(-97.7431),
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
                                  if annotation.PlaceCitation != nil {
                                      c := annotation.PlaceCitation
                                      name := ""
                                      if c.Name != nil {
                                          name = *c.Name
                                      }
                                      url := ""
                                      if c.URL != nil {
                                          url = *c.URL
                                      }
                                      fmt.Printf("  - %s: %s\n", name, url)
                                  }
                              }
                          }
                      }
                  }
              }
          }
      }
      ```


### 協助行程規劃 {#itinerary-planning}

生成包含路線指引與各地點資訊的多日行程規劃，非常適合旅遊應用程式。


=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      from google import genai

      client = genai.Client()

      prompt = "Plan a day in San Francisco for me. I want to see the Golden Gate Bridge, visit a museum, and have a nice dinner."

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=prompt,
          tools=[{
              "type": "google_maps",
              "latitude": 37.78193,
              "longitude": -122.40476
          }]
      )
      # ... code to process response
      ```

=== "JavaScript"

      ```javascript
      // This will only work for SDK newer than 2.0.0
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Plan a day in San Francisco for me. I want to see the Golden Gate Bridge, visit a museum, and have a nice dinner.",
          tools: [{
            type: "google_maps",
            latitude: 37.78193,
            longitude: -122.40476
          }]
        });
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.GoogleMaps;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      String prompt =
          "Plan a day in San Francisco for me. I want to see the Golden Gate Bridge, visit a museum, and have a nice dinner.";

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of(prompt))
              .tools(
                  Arrays.asList(GoogleMaps.builder().latitude(37.78193).longitude(-122.40476).build()))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      // ... code to process response
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

          prompt := "Plan a day in San Francisco for me. I want to see the Golden Gate Bridge, visit a museum, and have a nice dinner."

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput(prompt),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.GoogleMaps{
                              Latitude:  genai.Ptr(37.78193),
                              Longitude: genai.Ptr(-122.40476),
                          }),
                      },
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          // ... code to process response
          fmt.Println(resp.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```shell
      # Specifies the API revision to avoid breaking changes when they become default
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Plan a day in San Francisco for me. I want to see the Golden Gate Bridge, visit a museum, and have a nice dinner.",
          "tools": [{
            "type": "google_maps",
            "latitude": 37.78193,
            "longitude": -122.40476
          }]
        }'
      ```


## 服務使用規定 {#service-usage-requirements}

本節說明使用 Google Maps 接地的服務使用規定。

### 告知使用者 Google Maps 來源的使用方式 {#inform-sources}

每項 Google Maps 接地結果都會在 `model_output` 步驟的內容區塊上附帶來源註解，用以佐證各項回應。系統會傳回下列中繼資料：

* 來源網址
* 名稱

呈現使用 Google Maps 接地的結果時，必須註明相關的 Google Maps 來源，並告知使用者下列事項：

* Google Maps 來源必須緊接在該來源所佐證的生成內容之後。這類生成內容也稱為 Google Maps 接地結果。

* Google Maps 來源必須能在一次使用者互動內檢視。


### 以 Google Maps 連結顯示 Google Maps 來源 {#display-sources}

每項來源註解都必須依下列規定生成連結預覽：

* 依 Google Maps 文字[出處標示指南](/docs/maps-grounding/#maps-attribution-guidelines)，將每個來源標示為出自 Google Maps。

* 顯示回應中所提供的來源名稱。

* 使用註解中的 `url` 連結至來源。


### Google Maps 文字出處標示指南 {#maps-attribution-guidelines}

以文字將來源標示為出自 Google Maps 時，請遵循下列指南：

* 不得以任何方式修改 Google Maps 這段文字：
  *   不要變更 Google Maps 的大小寫。
  *   不要將 Google Maps 換行拆成多行。
  *   不要將 Google Maps 本地化為其他語言。
  *   使用 HTML 屬性 translate="no"，避免瀏覽器翻譯 Google Maps。


如需部分 Google Maps 資料提供者及其授權條款的詳細資訊，請參閱 [Google Maps 與 Google Earth 法律聲明](https://www.google.com/help/legalnotices_maps/)。

## 最佳做法 {#best-practices}

* **提供使用者位置**：為取得最切合需求且最個人化的回應，當已知使用者位置時，務必將 `latitude` 與 `longitude` 加入您的 `google_maps` 工具設定中。

* **告知最終使用者**：明確告知最終使用者，系統會使用 Google Maps 資料來回答其查詢，尤其是在啟用此工具時。

* **不需要時予以關閉**：使用 Google Maps 接地預設為關閉。僅在查詢具有明確地理脈絡時才啟用（`"tools": [{"type": "google_maps"}]`），以最佳化效能與成本。


## 限制 {#limitations}

* 使用 Google Maps 接地目前僅支援英文提示詞與回應。

* 此工具可能無法在所有地區使用。

* 結果可能因位置正確性與可用的 Maps 資料而異。

* **地理範圍**：使用 Google Maps 接地於全球皆可使用。

* **預設狀態**：使用 Google Maps 接地工具預設為關閉。您必須在 API 要求中明確啟用。


## 定價與速率限制 {#pricing-and-rate-limits}

使用 Google Maps 接地的定價會因模型世代而有所不同：

*   **Gemini 3 與更新的模型**：系統會針對模型決定執行的每項搜尋查詢向您的專案計費，所有 Gemini 3 與更新的模型每月共用 5,000 次免費要求，之後為**每 1,000 次搜尋查詢 $14**。單一搜尋提示詞（即您向模型發出的 API 要求）可能會使模型執行多次搜尋查詢，以尋找必要的資訊。每項查詢都計為一次可計費的工具使用。
*   **Gemini 2.5 與較舊的模型**：系統會依搜尋提示詞向您的專案計費（每 1,000 次接地提示詞 $25）。只有當提示詞成功傳回至少一項 Google Maps 接地結果時，要求才會計費，無論模型在內部為取得該結果執行了多少次個別搜尋查詢。

使用 Google Maps 接地的配額通常與底層 Gemini 模型的速率限制一致。如需詳細定價資訊，請參閱 [Gemini API 定價頁面](/docs/pricing/)。

## 支援的模型 {#supported-models}

下列模型支援使用 Google Maps 接地：

| 模型 | 使用 Google Maps 接地 |
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
| [Gemini 2.5 Flash](/docs/models/gemini-2.5-flash/) | ✔️ |
| [Gemini 2.5 Flash-Lite](/docs/models/gemini-2.5-flash-lite/) | ✔️ |

## 支援的工具組合 {#tool-combination}

您可以將使用 Google Maps 接地與其他內建工具搭配使用，例如[使用 Google 搜尋接地](/docs/google-search/)（Gemini 3.5 Flash 與更新的模型支援），以支援更複雜的使用情境。Gemini 4 與 Gemini 3 模型也支援將這些內建工具與自訂工具（函式呼叫）結合使用。詳情請參閱[工具組合](/docs/tool-combination/)頁面。

## 後續步驟 {#whats-next}

* 瞭解其他[可用工具](/docs/tools/)。
* 如需進一步瞭解負責任 AI 的最佳做法與 Gemini API 的安全篩選器，請參閱[安全設定指南](/docs/safety-settings/)。

