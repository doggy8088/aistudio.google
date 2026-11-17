# Priority 推論


!!! note " "

      這項功能目前為[預覽版](/docs/models/#preview)。


Gemini Priority API 是高階推論層級，專為業務關鍵工作負載設計，能以較高的價格提供更低的延遲與最高的可靠性。Priority 層級的流量優先級高於標準 API 與 Flex 層級的流量。

Interactions API 的各個端點都可使用 Priority 推論。

## 如何使用 Priority {#how-to-use}

若要使用 Priority 層級，請將請求中的 `service_tier` 欄位設為
`priority`。若省略這個欄位，預設層級為標準層級。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Triage this critical customer support ticket immediately.",
          service_tier='priority'
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const ai = new GoogleGenAI({});

      async function main() {
          const interaction = await ai.interactions.create({
              model: "gemini-4-hydrogen",
              input: "Triage this critical customer support ticket immediately.",
              service_tier: "priority"
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
              .input(InteractionsInput.of("Perform a priority inference task."))
              .serviceTier(ServiceTier.PRIORITY)
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
                  Input:       interactions.NewInteractionsInput("Perform a priority inference task."),
                  ServiceTier: interactions.ServiceTierPriority.ToPointer(),
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
          "input": "Triage this critical customer support ticket immediately.",
          "service_tier": "priority"
        }'
      ```


## Priority 推論的運作方式 {#how-it-works}

Priority 推論會將請求導向高關鍵性的運算佇列，為面向使用者的應用程式提供可預測且快速的效能。其主要機制是：當流量超過動態上限時，伺服器端會平順地將其降級為標準處理，確保應用程式穩定運作，而不是讓請求失敗。

| 功能 | Priority | 標準 | Flex | Batch |
| :--- | :--- | :--- | :--- | :--- |
| **價格** | 比標準層級高 75-100% | 全額價格 | 5 折 | 5 折 |
| **延遲** | 數秒 | 數秒至數分鐘 | 數分鐘（目標 1-15 分鐘） | 最長 24 小時 |
| **可靠性** | 高（不可捨棄） | 高／中高 | 盡力而為（可捨棄） | 高（以輸送量為考量） |
| **介面** | 同步 | 同步 | 同步 | 非同步 |

### 主要優點 {#benefits}

* **低延遲**：專為互動式、面向使用者的 AI 工具設計，回應時間以秒計。

* **高可靠性**：流量以最高關鍵性處理，且嚴格不可捨棄。

* **平順降級**：流量尖峰超過動態上限時，會自動降級至標準層級處理，而不是讓請求失敗，避免服務中斷。

* **低導入成本**：與標準層級和 Flex 層級使用相同的同步 `create` 方法。


### 使用案例 {#use-cases}

Priority 處理非常適合效能與可靠性至關重要的業務關鍵工作流程。

* **互動式 AI 應用程式**：例如客服聊天機器人與 copilot，使用者支付較高費用，並期待快速且一致的回應。

* **即時決策引擎**：需要高度可靠、低延遲結果的系統，例如即時工單分類或詐欺偵測。

* **高階客戶功能**：需要為付費客戶保證更高服務水準目標（SLO）的開發人員。


### 速率限制 {#rate-limits}

Priority 的用量會計入[整體互動流量速率限制](https://aistudio.google.com/rate-limit)，但它本身另有獨立的速率限制。Priority 推論的預設速率限制為 **Model / Tier 標準速率限制的 0.3 倍**

### 平順降級邏輯 {#downgrade}

若因壅塞而超過 Priority 上限，溢出的請求會**自動且平順地**降級為標準處理，而不是以 503 或 429 錯誤失敗。降級後的請求按標準費率計費，不收取 Priority 的高階費率。

### 用戶端責任 {#client}

* **回應監控**：開發人員應監控 API 回應中的 `x-gemini-service-tier`
  標頭，以偵測請求是否經常被降級為 `standard`。

* **重試**：用戶端必須針對標準錯誤（例如 `DEADLINE_EXCEEDED`）實作重試邏輯／指數退避。


## 價格 {#pricing}

Priority 推論的價格比[標準 API](/docs/pricing/) 高 75-100%，並按權杖計費。

## 支援的模型 {#supported-models}

下列模型支援 Priority 推論：

| 模型 | Priority 推論 |
| --- | :---: |
| [Gemini 4 Carbon](/docs/models/gemini-4-carbon/) | ✔️ |
| [Gemini 4 Argon](/docs/models/gemini-4-argon/) | ✔️ |
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

* [Flex 推論](/docs/flex-inference/)：降低成本。
* [權杖](/docs/tokens/)：瞭解權杖。

