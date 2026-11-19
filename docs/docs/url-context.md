# URL 上下文

URL 上下文工具可讓你以 URL 的形式，為模型提供額外的上下文。在請求中加入 URL 後，模型便會存取這些頁面的內容（前提是該 URL 類型未列在[限制一節](/docs/url-context/#limitations)中），用以豐富並強化其回應。

URL 上下文工具適用於下列工作：

* **擷取資料**：從多個 URL 中擷取特定資訊，例如價格、名稱或關鍵發現。

* **比較文件**：分析多份報告、文章或 PDF，找出差異並追蹤趨勢。

* **彙整與建立內容**：結合多個來源 URL 的資訊，產生正確的摘要、部落格文章或報告。

* **分析程式碼與文件**：指向 GitHub 儲存庫或技術文件，用來解說程式碼、產生設定說明或回答問題。

## 比較兩個頁面 {#get-started}

以下範例說明如何比較兩個不同網站上的食譜。

=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      from google import genai

      client = genai.Client()

      url1 = "https://www.foodnetwork.com/recipes/ina-garten/perfect-roast-chicken-recipe-1940592"
      url2 = "https://www.allrecipes.com/recipe/21151/simple-whole-roast-chicken/"

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=f"Compare the ingredients and cooking times from the recipes at {url1} and {url2}",
          tools=[{"type": "url_context"}]
      )

      # Print the model's text response and its source annotations
      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                      if content_block.annotations:
                          print("\nSources:")
                          for annotation in content_block.annotations:
                              if annotation.type == "url_citation":
                                  print(f" - {annotation.title}: {annotation.url}")
      ```

=== "Javascript"

      ```javascript
      // This will only work for SDK newer than 2.0.0
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      async function main() {
        const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Compare the ingredients and cooking times from the recipes at https://www.foodnetwork.com/recipes/ina-garten/perfect-roast-chicken-recipe-1940592 and https://www.allrecipes.com/recipe/21151/simple-whole-roast-chicken/",
          tools: [{ type: "url_context" }]
        });

        // Print the model's text response and its source annotations
        for (const step of interaction.steps) {
          if (step.type === 'model_output') {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === 'text') {
                console.log(contentBlock.text);
                if (contentBlock.annotations) {
                  console.log("\nSources:");
                  for (const annotation of contentBlock.annotations) {
                    if (annotation.type === 'url_citation') {
                      console.log(` - ${annotation.title}: ${annotation.url}`);
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

          url1 := "https://www.foodnetwork.com/recipes/ina-garten/perfect-roast-chicken-recipe-1940592"
          url2 := "https://www.allrecipes.com/recipe/21151/simple-whole-roast-chicken/"

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput(
                      fmt.Sprintf("Compare the ingredients and cooking times from the recipes at %s and %s", url1, url2),
                  ),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.URLContext{}),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          // Print the model's text response and its source annotations
          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
                          if len(contentBlock.TextContent.Annotations) > 0 {
                              fmt.Println("\nSources:")
                              for _, annotation := range contentBlock.TextContent.Annotations {
                                  if annotation.URLCitation != nil {
                                      fmt.Printf("  - %s: %s\n", annotation.URLCitation.GetTitle(), annotation.URLCitation.GetURL())
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
      -H "Content-Type: application/json" \
      -H "Api-Revision: 2026-05-20" \
      -d '{
          "model": "gemini-4-hydrogen",
          "input": "Compare the ingredients and cooking times from the recipes at https://www.foodnetwork.com/recipes/ina-garten/perfect-roast-chicken-recipe-1940592 and https://www.allrecipes.com/recipe/21151/simple-whole-roast-chicken/",
          "tools": [{"type": "url_context"}]
      }'
      ```

## 運作方式 {#how-it-works}

URL 上下文工具採用兩步驟的擷取流程，兼顧速度、成本與新資料的取得。當你提供 URL 時，工具會先嘗試從內部索引快取中擷取內容，這層快取經過高度最佳化。若某個 URL 不在索引中（例如是很新的頁面），工具會自動改採即時擷取，直接存取該 URL，立即取得其內容。

## 與其他工具結合使用 {#code-examples-with-search}

你可以將 URL 上下文工具與其他工具結合，打造更強大的工作流程。

[Gemini 3 模型](/docs/url-context/#supported-models)支援將內建工具（如 URL 上下文）與自訂工具（函式呼叫）結合使用。詳情請參閱[工具組合](/docs/tool-combination/)頁面。

### 使用搜尋接地 {#grounding-with-search}

當 URL 上下文與[使用 Google 搜尋接地](/docs/google-search/)同時啟用時，模型可以先運用其搜尋能力，在線上尋找相關資訊，再透過 URL 上下文工具，深入理解找到的頁面。這種做法對於需要廣泛搜尋，又需要深入分析特定頁面的提示詞特別有效。

=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Give me three day events schedule based on {{'YOUR_URL'}}. Also let me know what needs to taken care of considering weather and commute.",
          tools=[
              {"type": "url_context"},
              {"type": "google_search"}
          ]
      )

      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
      ```

=== "Javascript"

      ```javascript
      // This will only work for SDK newer than 2.0.0
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      async function main() {
        const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Give me three day events schedule based on {{'YOUR_URL'}}. Also let me know what needs to taken care of considering weather and commute.",
          tools: [
            { type: "url_context" },
            { type: "google_search" }
          ]
        });

        for (const step of interaction.steps) {
          if (step.type === 'model_output') {
            for (const contentBlock of step.content || []) {
              if (contentBlock.type === 'text') console.log(contentBlock.text);
            }
          }
        }
      }

      await main();
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
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Give me three day events schedule based on YOUR_URL. Also let me know what needs to taken care of considering weather and commute."),
                  Tools: []interactions.Tool{
                      interactions.NewTool(interactions.URLContext{}),
                      interactions.NewTool(interactions.GoogleSearch{}),
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          for _, step := range res.Interaction.Steps {
              if step.ModelOutputStep != nil {
                  for _, contentBlock := range step.ModelOutputStep.Content {
                      if contentBlock.TextContent != nil {
                          fmt.Println(contentBlock.TextContent.Text)
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
        -H "Content-Type: application/json" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
            "model": "gemini-4-hydrogen",
            "input": "Give me three day events schedule based on {{'YOUR_URL'}}. Also let me know what needs to taken care of considering weather and commute.",
            "tools": [
                {"type": "url_context"},
                {"type": "google_search"}
            ]
        }'
      ```

## 理解回應 {#contextual-response}

當模型使用 URL 上下文工具時，其文字回應會在文字內容區塊中加入行內的 `url_citation` 標註。每個標註都會將回應文字中的某個區段（透過 `start_index` 與 `end_index`）連結到其來源 URL。這是在你的應用程式中呈現引用來源的主要方式——擷取方法請參閱[上方的主要範例](/docs/url-context/#get-started)。

回應中還包含一個 `url_context_result` 步驟，記錄每次 URL 擷取嘗試的中繼資料（狀態、擷取的 URL）。這主要用於除錯。

### 安全檢查 {#safety-checks}

系統會對 URL 執行內容審查，確認其符合安全標準。若某個 URL 未通過這項檢查，對應的 `url_context_result` 步驟會顯示 `status` 為 `"unsafe"`。

### token 數量 {#token-count}

從你在提示詞中指定的 URL 擷取到的內容，會計入輸入 tokens。你可以在互動的 `usage` 物件中查看 token 數量，範例如下：

```none
'usage': {
  'output_tokens': 45,
  'input_tokens': 27,
  'input_tokens_details': [{'modality': 'TEXT', 'token_count': 27}],
  'thoughts_tokens': 31,
  'tool_use_input_tokens': 10309,
  'tool_use_input_tokens_details': [{'modality': 'TEXT', 'token_count': 10309}],
  'total_tokens': 10412
}
```

每個 token 的價格取決於所使用的模型，詳情請參閱[定價](/docs/pricing/)頁面。

## 支援的模型 {#supported-models}

| Model | URL Context |
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

## 最佳做法 {#best-practices}

* **提供具體的 URL**：為獲得最佳效果，請提供指向你希望模型分析之內容的直接 URL。模型只會擷取你提供的 URL 內容，不會擷取巢狀連結中的任何內容。

* **檢查可存取性**：確認你提供的 URL 不會導向需要登入或設有付費牆的頁面。

* **使用完整的 URL**：提供完整的 URL，包括通訊協定（例如 https://www.google.com，而非僅 google.com）。

## 限制 {#limitations}

* 請求上限：此工具每次請求最多可處理 20 個 URL。

* URL 內容大小：從單一 URL 擷取的內容大小上限為 34MB。

* 公開存取：URL 必須能在網路上公開存取。不支援 localhost 位址（例如 localhost、127.0.0.1）、私人網路與通道服務（例如 ngrok、pinggy）。

### 支援與不支援的內容類型 {#url-types}

此工具可從下列內容類型的 URL 擷取內容：

*   文字（text/html、application/json、text/plain、text/xml、text/css、text/javascript、text/csv、text/rtf）

*   圖片（image/png、image/jpeg、image/bmp、image/webp）

*   PDF（application/pdf）

下列內容類型**不**受支援：

*   付費牆內容

*   YouTube 影片（如何處理 YouTube URL，請參閱[影片理解](/docs/video-understanding/#youtube)）

*   Google Workspace 檔案，例如 Google 文件或試算表

*   影片與音訊檔案
