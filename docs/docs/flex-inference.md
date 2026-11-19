# Flex 推論


!!! note " "

      此功能目前為[預覽版](/docs/models/#preview)。


Gemini Flex API 是一個推論層級，以標準費率五折的價格，換取不固定的延遲與盡力而為的可用性。它專為能容忍延遲的工作負載設計：這類工作負載需要同步處理，但不需要標準 API 的即時效能。

## 如何使用 Flex {#how-to-use-flex}

若要使用 Flex 層級，請在請求中將 `service_tier` 指定為 `flex`。若省略此欄位，請求預設使用標準層級。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Analyze this dataset for trends...",
          service_tier='flex'
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      async function main() {
          const interaction = await client.interactions.create({
              model: 'gemini-4-hydrogen',
              input: 'Analyze this dataset for trends...',
              service_tier: 'flex'
          });
          console.log(interaction.output_text);
      }
      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ServiceTier;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Analyze this dataset for trends..."))
              .serviceTier(ServiceTier.FLEX)
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
                  Model:       interactions.Model("gemini-4-hydrogen"),
                  Input:       interactions.NewInteractionsInput("Analyze this dataset for trends..."),
                  ServiceTier: interactions.ServiceTierFlex.ToPointer(),
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
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
            "model": "gemini-4-hydrogen",
            "input": "Analyze this dataset for trends...",
            "service_tier": "flex"
        }'
      ```


## Flex 推論的運作方式 {#how-it-works}

Gemini Flex 推論填補了標準 API 與 [Batch API](/docs/batch-api/) 24 小時處理時間之間的落差。它利用離峰時段「可卸載」的運算容量，為背景工作與循序工作流程提供具成本效益的解決方案。

| 功能 | Flex | Priority | Standard | Batch |
| :--- | :--- | :--- | :--- | :--- |
| **定價** | 五折優惠 | 比 Standard 貴 75-100% | 全額價格 | 五折優惠 |
| **延遲** | 數分鐘（目標 1-15 分鐘） | 低（數秒） | 數秒至數分鐘 | 最長 24 小時 |
| **可靠性** | 盡力而為（可卸載） | 高（不可卸載） | 高／中高 | 高（以輸送量為主） |
| **介面** | 同步 | 同步 | 同步 | 非同步 |

### 主要優勢 {#benefits}

* **成本效益**：為非正式環境的評估、背景代理與資料豐富化帶來可觀的節省。
* **低導入門檻**：只需在既有請求中加上單一參數即可。
* **同步工作流程**：非常適合循序的 API 呼叫鏈——下一個請求取決於前一個請求的輸出，因此在代理工作流程上比 Batch 更具彈性。

### 使用案例 {#use-cases}

* **離線評估**：執行「以 LLM 擔任評審」的迴歸測試或排行榜。
* **背景代理**：CRM 更新、個人資料建置或內容審核等循序工作，可接受數分鐘的延遲。
* **預算有限的研究**：在有限預算下需要大量 token 的學術實驗。

### 速率限制 {#quota}

Flex 推論流量會計入你的一般[速率限制](https://aistudio.google.com/rate-limit)；它不像 [Batch API](/docs/batch-api/) 那樣提供更高的速率限制。

### 可卸載容量 {#capacity}

Flex 流量的優先順序較低。若標準流量突然暴增，Flex 請求可能會被搶占或逐出，以確保高優先順序使用者的容量。若你需要高優先順序的推論，請參閱 [Priority 推論](/docs/priority-inference/)。

### 錯誤代碼 {#error-codes}

當 Flex 容量不足或系統壅塞時，API 會傳回標準錯誤代碼：

* **503 Service Unavailable**：系統目前已達容量上限。
* **429 Too Many Requests**：速率限制或資源耗盡。

### 用戶端責任 {#client}

* **無伺服器端自動退回**：為避免產生預期外的費用，當 Flex 容量已滿時，系統不會自動將 Flex 請求升級至 Standard 層級。

* **重試**：你必須自行實作用戶端重試邏輯，並採用指數退避。

* **逾時**：由於 Flex 請求可能會在佇列中等待，建議將用戶端逾時提高至 10 分鐘以上，以免連線過早關閉。


## 調整逾時視窗 {#timeout}

你可以為 REST API 與用戶端程式庫設定個別請求的逾時。務必確保用戶端逾時涵蓋預期的伺服器等待視窗（例如 Flex 等待佇列需 600 秒以上）。SDK 的逾時值以毫秒為單位。

### 個別請求逾時 {#per-request-timeout}


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"timeout": 900000})

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="why is the sky blue?",
          service_tier="flex",
      )
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const client = new GoogleGenAI({});

      async function main() {
          const interaction = await client.interactions.create({
              model: "gemini-4-hydrogen",
              input: "why is the sky blue?",
              service_tier: "flex",
          }, {timeout: 900000});
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ServiceTier;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.HttpOptions;

      Client client =
          Client.builder()
              .httpOptions(HttpOptions.builder().timeout(900000).build())
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("why is the sky blue?"))
              .serviceTier(ServiceTier.FLEX)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "log"
          "time"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{
              HTTPOptions: genai.HTTPOptions{
                  Timeout: genai.Ptr(15 * time.Minute),
              },
          })
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:       interactions.Model("gemini-4-hydrogen"),
                  Input:       interactions.NewInteractionsInput("why is the sky blue?"),
                  ServiceTier: interactions.ServiceTierFlex.ToPointer(),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          _ = res
      }
      ```


## 實作重試 {#retries}

由於 Flex 屬於可卸載容量，且會以 503 錯誤失敗，以下範例示範如何選擇性地實作重試邏輯，以接續處理失敗的請求：


=== "Python"

      ```python
      import time
      from google import genai

      client = genai.Client()

      def call_with_retry(max_retries=3, base_delay=5):
          for attempt in range(max_retries):
              try:
                  return client.interactions.create(
                      model="gemini-4-hydrogen",
                      input="Analyze this batch statement.",
                      service_tier="flex",
                  )
              except Exception as e:
                  if attempt < max_retries - 1:
                      delay = base_delay * (2 ** attempt) # Exponential Backoff
                      print(f"Flex busy, retrying in {delay}s...")
                      time.sleep(delay)
                  else:
                      print("Flex exhausted, falling back to Standard...")
                      return client.interactions.create(
                          model="gemini-4-hydrogen",
                          input="Analyze this batch statement."
                      )

      interaction = call_with_retry()
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const ai = new GoogleGenAI({});

      async function sleep(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      async function callWithRetry(maxRetries = 3, baseDelay = 5) {
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            console.log(`Attempt ${attempt + 1}: Calling Flex tier...`);
            const interaction = await ai.interactions.create({
              model: "gemini-4-hydrogen",
              input: "Analyze this batch statement.",
              service_tier: 'flex',
            });
            return interaction;
          } catch (e) {
            if (attempt < maxRetries - 1) {
              const delay = baseDelay * (2 ** attempt);
              console.log(`Flex busy, retrying in ${delay}s...`);
              await sleep(delay * 1000);
            } else {
              console.log("Flex exhausted, falling back to Standard...");
              return await ai.interactions.create({
                model: "gemini-4-hydrogen",
                input: "Analyze this batch statement.",
              });
            }
          }
        }
        throw new Error("Failed to complete request with retry.");
      }

      async function main() {
          const interaction = await callWithRetry();
          console.log(interaction.output_text);
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ServiceTier;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = new Client();

      int maxRetries = 3;
      int baseDelay = 5;
      Interaction interaction = null;

      for (int attempt = 0; attempt < maxRetries; attempt++) {
        try {
          CreateModelInteraction flexParams =
              CreateModelInteraction.builder()
                  .model(Model.of("gemini-4-hydrogen"))
                  .input(InteractionsInput.of("Analyze this batch statement."))
                  .serviceTier(ServiceTier.FLEX)
                  .build();
          interaction =
              client.interactions.create(CreateInteractionRequestBody.of(flexParams)).interaction().get();
          break;
        } catch (Exception e) {
          if (attempt < maxRetries - 1) {
            int delay = baseDelay * (1 << attempt); // Exponential Backoff
            System.out.println("Flex busy, retrying in " + delay + "s...");
            Thread.sleep(delay * 1000L);
          } else {
            System.out.println("Flex exhausted, falling back to Standard...");
            CreateModelInteraction standardParams =
                CreateModelInteraction.builder()
                    .model(Model.of("gemini-4-hydrogen"))
                    .input(InteractionsInput.of("Analyze this batch statement."))
                    .build();
            interaction =
                client
                    .interactions
                    .create(CreateInteractionRequestBody.of(standardParams))
                    .interaction()
                    .get();
          }
        }
      }

      if (interaction != null) {
        System.out.println(interaction.outputText().orElse(""));
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

          maxRetries := 3
          baseDelay := 5
          var interaction *interactions.Interaction

          for attempt := 0; attempt < maxRetries; attempt++ {
              res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                  Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                      Model:       interactions.Model("gemini-4-hydrogen"),
                      Input:       interactions.NewInteractionsInput("Analyze this batch statement."),
                      ServiceTier: interactions.ServiceTierFlex.ToPointer(),
                  }),
              })
              if err == nil {
                  interaction = res.Interaction
                  break
              }

              if attempt < maxRetries-1 {
                  delay := baseDelay * (1 << attempt) // Exponential Backoff
                  fmt.Printf("Flex busy, retrying in %ds...\n", delay)
                  time.Sleep(time.Duration(delay) * time.Second)
              } else {
                  fmt.Println("Flex exhausted, falling back to Standard...")
                  stdRes, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
                      Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                          Model: interactions.Model("gemini-4-hydrogen"),
                          Input: interactions.NewInteractionsInput("Analyze this batch statement."),
                      }),
                  })
                  if err != nil {
                      log.Fatal(err)
                  }
                  interaction = stdRes.Interaction
              }
          }

          if interaction != nil && interaction.OutputText != nil {
              fmt.Println(*interaction.OutputText)
          }
      }
      ```


## 定價 {#pricing}

Flex 推論的價格為[標準 API](/docs/pricing/)的 50%，並依 token 計費。

## 支援的模型 {#supported-models}

以下模型支援 Flex 推論：

| 模型 | Flex 推論 |
| --- | :---: |
| [Gemini 4 Carbon](/docs/models/gemini-4-carbon/) | ✔️ |
| [Gemini 4 Argon](/docs/models/gemini-4-argon/) | ✔️ |
| [Gemini 4 Neon](/docs/models/gemini-4-neon/) | ✔️ |
| [Gemini 4 Hydrogen](/docs/models/gemini-4-hydrogen/) | ✔️ |
| [Gemini 3.8 Flash](/docs/models/gemini-3.8-flash/) | ✔️ |
| [Gemini 3.6 Flash](/docs/models/gemini-3.6-flash/) | ✔️ |
| [Gemini 3.5 Flash-Lite](/docs/models/gemini-3.5-flash-lite/) | ✔️ |
| [Gemini 3.1 Flash-Lite](/docs/models/gemini-3.1-flash-lite/) | ✔️ |
| [Gemini 3.1 Pro Preview](/docs/models/gemini-3.1-pro-preview/) | ✔️ |
| [Gemini 3 Flash Preview](/docs/models/gemini-3-flash-preview/) | ✔️ |
| [Gemini 2.5 Pro](/docs/models/gemini-2.5-pro/) | ✔️ |
| [Gemini 2.5 Flash](/docs/models/gemini-2.5-flash/) | ✔️ |
| [Gemini 2.5 Flash-Lite](/docs/models/gemini-2.5-flash-lite/) | ✔️ |

## 後續步驟 {#whats-next}

* [Priority 推論](/docs/priority-inference/)：追求超低延遲。
* [token](/docs/tokens/)：了解 token。
