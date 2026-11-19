# 使用 Google 搜尋接地

使用 Google 搜尋接地可將 Gemini 模型連結至即時網路內容，且支援所有可用語言。這讓 Gemini 能提供更準確的答案，並引用可驗證的來源，涵蓋其知識截止日期之後的資訊。

接地可協助你建構具備以下能力的應用程式：

* **提高事實準確性**：以真實世界的資訊為回覆依據，減少模型幻覺。

* **存取即時資訊**：回答關於近期事件與主題的問題。

* **提供引用來源**：展示模型主張的來源，建立使用者信任。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Who won the euro 2024?",
          tools=[{"type": "google_search"}]
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Who won the euro 2024?",
          tools: [{ type: "google_search" }]
      });

      console.log(interaction.output_text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.GoogleSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Who won the euro 2024?"))
              .tools(Arrays.asList(GoogleSearch.builder().build()))
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

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-hydrogen"),
                      Input: interactions.NewInteractionsInput("Who won the euro 2024?"),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.GoogleSearch{}),
                      },
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

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Who won the euro 2024?",
          "tools": [{"type": "google_search"}]
        }'
      ```


## Google 搜尋接地的運作方式 {#how-it-works}

啟用 `google_search` 工具後，模型會自動處理搜尋、處理資訊與引用資訊的整個工作流程。

![](https://www.gstatic.com/cloud-cms/0c893db002557e538dbe4c9afe8f5abf.png)

1. **使用者提示詞**：你的應用程式將使用者的提示詞連同已啟用的 `google_search` 工具傳送至 Gemini API。

2. **提示詞分析**：模型會分析提示詞，判斷 Google 搜尋是否能改善答案。

3. **Google 搜尋**：如有需要，模型會自動產生一或多個搜尋查詢並執行。

4. **搜尋結果處理**：模型會處理搜尋結果、彙整資訊，並形成回覆。

5. **接地回覆**：API 會傳回最終且易於使用者理解的回覆，該回覆以搜尋結果為依據。此回覆包含模型的文字答案，其中附有含引用來源的行內 `annotations`，以及包含搜尋查詢與搜尋建議的 `google_search_call` 與 `google_search_result` 步驟。


## 瞭解接地回覆 {#understanding-the-grounding-response}

回覆成功接地後，模型的文字輸出會在文字內容區塊上直接包含行內 `annotations`。這些註解提供引用資訊，將回覆的部分內容連結至其來源。

```json
{
  "steps": [
    {
      "type": "thought",
      "summary": [
        {
          "type": "text",
          "text": "The user is asking for the winner of Euro 2024. I need to search for the result of the Euro 2024 final."
        }
      ],
      "signature": "CoMDAXLI2nynRYojJIy6B1Jh9os2crpWLfB0..."
    },
    {
      "type": "google_search_call",
      "arguments": {
        "queries": ["UEFA Euro 2024 winner"]
      }
    },
    {
      "type": "google_search_result",
      "call_id": "search_001",
      "result": [
        {
          "search_suggestions": "<!-- HTML and CSS for the search widget -->"
        }
      ]
    },
    {
      "type": "model_output",
      "content": [
        {
          "type": "text",
          "text": "Spain won Euro 2024, defeating England 2-1 in the final. This victory marks Spain's record fourth European Championship title.",
          "annotations": [
            {
              "type": "url_citation",
              "url": "https://www.aljazeera.com/sports/euro-2024-final",
              "title": "aljazeera.com",
              "start_index": 0,
              "end_index": 56
            },
            {
              "type": "url_citation",
              "url": "https://www.uefa.com/euro2024/news/spain-wins-euro-2024",
              "title": "uefa.com",
              "start_index": 57,
              "end_index": 124
            }
          ]
        }
      ]
    }
  ]
}
```

回覆中的關鍵欄位：

* `google_search_call`：包含模型執行的搜尋 `queries`。

* `google_search_result`：包含 `search_suggestions`，這是一段 HTML 程式碼片段，可用於在你的 UI 中算繪搜尋建議。完整的使用規定詳見[服務條款](/docs/terms/#grounding-with-google-search)。

* `text` 與其 `annotations`：模型彙整的答案，附有行內引用。每個 `url_citation` 註解會將一段文字（由 `start_index` 與 `end_index` 定義）連結至來源 URL。這是建立行內引用的關鍵。


Google 搜尋接地也可以與 [URL 上下文工具](/docs/url-context/)搭配使用，讓回覆同時以公開網路資料與你提供的特定 URL 為依據。

## 以行內引用標示來源 {#attributing-sources-with-inline-citations}

API 會在文字內容區塊上傳回行內 `url_citation` 註解，讓你完全掌控在使用者介面中顯示來源的方式。每個註解都包含 `start_index` 與 `end_index`，用以識別它所引用的文字部分。以下是擷取與顯示這些註解的方法。


=== "Python"

      ```python
      for step in interaction.steps:
          if step.type == "model_output":
              for content_block in step.content:
                  if content_block.type == "text":
                      print(content_block.text)
                      if content_block.annotations:
                          print("\nCitations:")
                          for annotation in content_block.annotations:
                              if annotation.type == "url_citation":
                                  cited_text = content_block.text[annotation.start_index:annotation.end_index]
                                  print(f" [{annotation.title}]({annotation.url})")
                                  print(f" Cited text: \"{cited_text}\"")
      ```

=== "JavaScript"

      ```javascript
      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          for (const contentBlock of step.content || []) {
            if (contentBlock.type === 'text') {
              console.log(contentBlock.text);
              if (contentBlock.annotations) {
                console.log("\nCitations:");
                for (const annotation of contentBlock.annotations) {
                  if (annotation.type === 'url_citation') {
                    const citedText = contentBlock.text.slice(annotation.startIndex, annotation.endIndex);
                    console.log(` [${annotation.title}](${annotation.url})`);
                    console.log(` Cited text: "${citedText}"`);
                  }
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
      import com.google.genai.gaos.models.interactions.GoogleSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ModelOutputStep;
      import com.google.genai.gaos.models.interactions.Step;
      import com.google.genai.gaos.models.interactions.TextContent;
      import com.google.genai.gaos.models.interactions.URLCitation;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Who won the euro 2024?"))
              .tools(Arrays.asList(GoogleSearch.builder().build()))
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
                  String text = textContent.text().orElse("");
                  System.out.println(text);
                  if (textContent.annotations().isPresent()
                      && !textContent.annotations().get().isEmpty()) {
                    System.out.println("\nCitations:");
                    for (Annotation annotation : textContent.annotations().get()) {
                      if (annotation instanceof URLCitation) {
                        URLCitation citation = (URLCitation) annotation;
                        int start = citation.startIndex().orElse(0);
                        int end = citation.endIndex().orElse(0);
                        String citedText =
                            (start >= 0 && end <= text.length() && start <= end)
                                ? text.substring(start, end)
                                : "";
                        System.out.printf(
                            "  [%s](%s)%n", citation.title().orElse(""), citation.url().orElse(""));
                        System.out.printf("    Cited text: \"%s\"%n", citedText);
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
                      Input: interactions.NewInteractionsInput("Who won the euro 2024?"),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.GoogleSearch{}),
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
                          text := content.TextContent.Text
                          fmt.Println(text)
                          if len(content.TextContent.Annotations) > 0 {
                              fmt.Println("\nCitations:")
                              for _, annotation := range content.TextContent.Annotations {
                                  if annotation.URLCitation != nil {
                                      c := annotation.URLCitation
                                      start := 0
                                      if c.StartIndex != nil {
                                          start = *c.StartIndex
                                      }
                                      end := 0
                                      if c.EndIndex != nil {
                                          end = *c.EndIndex
                                      }
                                      citedText := ""
                                      if start >= 0 && end <= len(text) && start <= end {
                                          citedText = text[start:end]
                                      }
                                      title := ""
                                      if c.Title != nil {
                                          title = *c.Title
                                      }
                                      url := ""
                                      if c.URL != nil {
                                          url = *c.URL
                                      }
                                      fmt.Printf("  [%s](%s)\n", title, url)
                                      fmt.Printf("    Cited text: %q\n", citedText)
                                  }
                              }
                          }
                      }
                  }
              }
          }
      }
      ```


輸出結果會先顯示文字，接著顯示其引用：

```none
Spain won Euro 2024, defeating England 2-1 in the final. This victory marks Spain's record fourth European Championship title.

Citations:
  [aljazeera.com](https://www.aljazeera.com/sports/euro-2024-final)
    Cited text: "Spain won Euro 2024, defeating England 2-1 in the final."
  [uefa.com](https://www.uefa.com/euro2024/news/spain-wins-euro-2024)
    Cited text: "This victory marks Spain's record fourth European Championship title."
```

## 定價 {#pricing}

使用 Gemini 3 與更新模型的 Google 搜尋接地時，系統會針對模型決定執行的**每一次**搜尋查詢向你的專案計費。這種依查詢計費的模式包含每月 5,000 次免費搜尋要求（由所有 Gemini 3 與更新模型共用），之後的費率為**每 1,000 次搜尋要求 $14**。

舉例來說，如果模型決定執行多次搜尋查詢來回答單一提示詞（例如在同一次 API 呼叫中搜尋 `"UEFA Euro 2024 winner"` 與 `"Spain vs England Euro 2024 final score"`），該次要求就會計算為兩次工具的計費用量。基於計費目的，計算不重複查詢時會忽略空白的網路搜尋查詢。

使用 Gemini 2.5 或較舊模型的搜尋接地時，系統會依提示詞向你的專案計費。

如需詳細定價資訊，請參閱 [Gemini API 定價頁面](/docs/pricing/)。


!!! note " "

      **注意**：在 Gemini Developer API 的付費級別中，Gemini 3 與更新模型的 Google 搜尋接地預設上限為**每個專案每天 1,500 次要求（RPD）**。如果你的應用程式需要更高的每日上限，請在 [Google AI Studio](https://aistudio.google.com/rate-limit) 中提出申請（在 `generate_content_search_request_paid` 上限旁選取 **Request more quota**）。


## 支援的模型 {#supported-models}

你可以在[模型總覽](/docs/models/)頁面查看完整功能。

| 模型 | Google 搜尋接地 |
| --- | :---: |
| Gemini 4 Carbon | ✔️ |
| Gemini 4 Argon | ✔️ |
| Gemini 4 Neon | ✔️ |
| Gemini 4 Hydrogen | ✔️ |
| Gemini 3.8 Flash | ✔️ |
| Gemini 3.6 Flash | ✔️ |
| Gemini 3.5 Flash-Lite | ✔️ |
| Gemini 3.1 Flash Image Preview | ✔️ |
| Gemini 3.1 Pro Preview | ✔️ |
| Gemini 3 Pro Image Preview | ✔️ |
| Gemini 3 Flash Preview | ✔️ |
| Gemini 2.5 Pro | ✔️ |
| Gemini 2.5 Flash | ✔️ |
| Gemini 2.5 Flash-Lite | ✔️ |
| Gemini 2.0 Flash | ✔️ |


!!! note " "

      較舊的模型使用 `google_search_retrieval` 工具。所有目前的模型請使用範例所示的 `google_search` 工具。


## 支援的工具組合 {#tool-combination}

你可以將 Google 搜尋接地與其他工具搭配使用，例如[程式碼執行](/docs/code-execution/)、[URL 上下文](/docs/url-context/)與[使用 Google Maps 接地](/docs/maps-grounding/)（Gemini 3.5 Flash 與更新模型支援），以因應更複雜的使用案例。Gemini 4 與 Gemini 3 模型也支援將這些內建工具與自訂工具（函式呼叫）結合使用。詳情請參閱[工具組合](/docs/tool-combination/)頁面。

## 後續步驟 {#whats-next}

* 瞭解其他可用工具，例如[函式呼叫](/docs/function-calling/)。
* 瞭解如何使用 [URL 上下文工具](/docs/url-context/)，以特定 URL 增強提示詞。
