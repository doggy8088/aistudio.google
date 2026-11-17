# 日誌與資料集

在本指南中，你將了解如何在 Google AI Studio 儀表板中查看 Gemini API 使用日誌，藉此更深入理解模型行為，以及使用者可能如何與你的應用程式互動。透過日誌記錄，你可以觀察、除錯，並選擇性地與 Google 分享使用回饋，協助改善 Gemini 在各種開發者使用案例中的表現。若要了解 Google 如何使用日誌資料，請參閱[資料記錄與分享](/docs/logs-policy/)政策文件。

所有 `GenerateContent`、`BatchGenerateContent`、`StreamGenerateContent` API 呼叫，以及不含 Managed Agents 的 [Interactions](/docs/interactions-overview/) API 呼叫皆受支援。這也包括透過 [OpenAI 相容性](/docs/openai/)端點發出的呼叫。


!!! note " "

      Gemini API 日誌的儲存功能僅適用於 Gemini API 付費層級的專案。


## 設定專案日誌記錄 {#configure-logging}

根據預設，[Interactions](/docs/interactions-overview/) API 與 Generate Content API 都會儲存要求（`store=true`）。對於 Interactions API，這同時也啟用了伺服器端狀態管理功能。


!!! note " "

      自 2026 年 10 月 26 日起，Generate Content API 會為「新」專案預設儲存要求。在此日期之前建立的專案，其 Generate Content API 會保留既有的儲存設定，也就是關閉（`store=false`），除非先前已在 AI Studio 中啟用。


在 Google [AI Studio](https://aistudio.google.com/logs) 中，你可以為個別專案啟用或停用儲存功能，並隨時透過 [Gemini API Logs Dashboard](https://aistudio.google.com/logs) 中的 **Settings** 面板變更這些偏好設定。你可以分別切換 `generateContent` API 與 [Interactions](/docs/interactions-overview/) API 的日誌記錄開關，以變更專案的預設儲存行為。


!!! warning " "

      在 AI Studio 的 **Settings** 面板中將 Interactions API 日誌記錄「關閉」，將會阻止 API 自動儲存與擷取對話記錄，除非在每個要求中明確覆寫。


### 要求層級的日誌記錄 {#request-logging}

這兩個 API 都會預設儲存要求（`store=true`）：

*   **[Interactions API](/docs/interactions-overview/)：** 預設儲存要求，以簡化伺服器端狀態管理。
*   **Generate Content API（`generateContent`、`streamGenerateContent` 與 `batchGenerateContent`）：** 對於在 2026 年 10 月 26 日當天或之後建立的專案，預設儲存要求。在此日期之前建立的專案則不會預設儲存要求（`store=false`），除非已在 AI Studio 中啟用日誌記錄。

要求層級的 `store` 屬性優先於專案層級的設定。在 Generate Content API 要求中設定 `store`，Python 需要 `google-genai` 2.33.0 或更新版本，JavaScript 需要 `@google/genai` 2.31.0 或更新版本，Java 需要 `google-genai` 1.79.0 或更新版本，Go 需要 `google.golang.org/genai` 1.76.0 或更新版本。以下示範如何設定 `store` 屬性：

**GenerateContent API**


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      response = client.models.generate_content(
          model='gemini-4-hydrogen',
          contents='Explain quantum entanglement in simple terms.',
          config={'store': True} # Set to False to disable logging of this request
      )

      print(response.text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const response = await client.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: 'Explain quantum entanglement in simple terms.',
          config: {
              store: true // Set to false to disable logging of this request
          }
      });

      console.log(response.text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.GenerateContentConfig;
      import com.google.genai.types.GenerateContentResponse;

      Client client = new Client();

      GenerateContentResponse response =
          client.models.generateContent(
              "gemini-4-hydrogen",
              "Explain quantum entanglement in simple terms.",
              GenerateContentConfig.builder()
                  .store(true) // Set to false to disable logging of this request
                  .build());

      System.out.println(response.text());
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

          response, err := client.Models.GenerateContent(
              ctx,
              "gemini-4-hydrogen",
              genai.Text("Explain quantum entanglement in simple terms."),
              &genai.GenerateContentConfig{
                  Store: genai.Ptr(true), // Set to false to disable logging of this request
              },
          )
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(response.Text())
      }
      ```


**Interactions API**


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Explain quantum entanglement in simple terms.",
          store=True # Set to False to disable logging of this request
      )

      print(interaction.outputs[-1].text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
          model: 'gemini-4-hydrogen',
          input: 'Explain quantum entanglement in simple terms.',
          store: true // Set to false to disable logging of this request
      });

      console.log(interaction.output_text);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Explain quantum entanglement in simple terms."))
              .store(true) // Set to false to disable logging of this request
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

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Explain quantum entanglement in simple terms."),
                  Store: genai.Ptr(true), // Set to false to disable logging of this request
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


## 在 AI Studio 中查看專案日誌 {#view-logs}

1. 前往 [AI Studio](https://aistudio.google.com/logs) 中的 Logs 頁面。
2. 從下拉式選單中選取一個專案。
3. 如果有日誌，它們會以時間倒序顯示在表格中。
4. 對於在 2026 年 10 月 26 日之前建立的專案，請先在[設定面板](/docs/logs-datasets/#configure-logging)中啟用 Generate Content API 日誌記錄，才能查看該 API 的專案日誌。


!!! note " "

      專案至少需要一個有效的 API 金鑰，日誌才會顯示。如果專案中的所有 API 金鑰都被刪除（例如刪除了外洩的金鑰），在有可用的 API 金鑰之前，你將無法查看該專案的日誌。


點選任一項目即可預覽酬載內容。你可以查看來自 Gemini 的完整提示詞與回應，以及先前回合的上下文。對於 **Interactions API** 要求，日誌還包含指向 `previous_interaction_id` 的直接連結。

## 設定專案儲存保留期限 {#retention}

日誌會在預設保留期限 55 天後到期並標記為刪除（除非[儲存至資料集](/docs/logs-datasets/#create)，資料集不會到期）。你可以將專案日誌的保留期限設定為 7、14、28 或最多 55 天。

## 建立與分享資料集 {#create}

你可以將日誌儲存至資料集，以便更有效率地整理與匯出。

* 在 [Logs 頁面](https://aistudio.google.com/logs)中，找到頂部的篩選列，選取要篩選的屬性。
* 在篩選後的檢視中，使用核取方塊選取全部或個別日誌。
* 點選清單頂部出現的 **Create dataset** 按鈕。
* 為新的資料集命名，並可選擇性地加上說明。
* 你會看到剛建立的資料集，其中包含精選的日誌集合。
* 將資料集匯出為 CSV、JSONL 檔案或 Google Sheets，以進行進一步分析。

資料集在許多不同的使用案例中都很有幫助。

* **精選挑戰集：** 推動未來的改進，聚焦於你希望 AI 提升的領域。
* **精選範例集：** 例如，從實際使用中抽樣，讓另一個模型產生回應，或收集邊界案例，在部署前進行例行檢查。
* **評估集：** 能代表重要能力面向實際使用情況的集合，用於比較不同模型或系統指令的迭代版本。

你可以選擇與 Google 分享你的資料集，作為示範範例，為 Gemini 的研究與開發做出貢獻。

## 限制 {#limitations}

目前下列項目不支援日誌記錄：

* Imagen 與 Veo 模型
* Gemini 嵌入模型
* Gemini Robotics 模型
* 包含影片、GIF 或 PDF 的輸入
* Gemini API 中的 Public Preview Agents

## 後續步驟 {#next-steps}

- **使用工作階段記錄進行原型開發：** 使用 [AI Studio Build](https://aistudio.google.com/apps) 以 vibe coding 方式打造應用程式，並加入你的 API 金鑰，即可為 AI 功能啟用 Gemini API 日誌記錄。
- **使用 Gemini Batch API 重新執行日誌：** 使用資料集進行回應抽樣，並透過 [Gemini Batch API](https://github.com/google-gemini/cookbook/blob/main/examples/Datasets.ipynb) 重新執行日誌，評估模型或應用程式邏輯。
