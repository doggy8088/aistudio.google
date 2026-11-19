# 運用 Gemini for Research 加速探索

[取得 Gemini API 金鑰](https://aistudio.google.com/apikey)

Gemini 模型可用於推動各學科的基礎研究。以下列出幾種將 Gemini 運用於研究的方式：

-  **分析並控制模型輸出**：若要進一步分析，您可以運用 `CitationMetadata` 等工具，檢視模型產生的回應候選結果。您也可以設定模型生成與輸出的相關選項，例如 `responseSchema`、`topP` 與 `topK`。[瞭解詳情](/api-reference/generate-content/)。

-  **多模態輸入**：Gemini 能處理圖片、音訊與影片，為研究開啟多種令人振奮的方向。[瞭解詳情](/docs/image-understanding/)。

-  **長上下文能力**：Gemini 3.0 Flash 與 Pro 具備 100 萬 tokens 的上下文視窗。[瞭解詳情](/docs/long-context/)。

-  **與 Google 一同成長**：透過 API 與 Google AI Studio 快速存取 Gemini 模型，用於正式環境的應用情境。若您需要以 Google Cloud 為基礎的平台，Gemini Enterprise Agent Platform 可提供額外的支援基礎設施。


為支援學術研究並推動尖端研究，Google 透過 [Gemini Academic Program](/docs/gemini-for-research/#gemini-academic-program)，為科學家與學術研究人員提供 Gemini API 額度。

## 開始使用 Gemini {#get-started-with-gemini}

Gemini API 與 Google AI Studio 能協助您開始使用 Google 的最新模型，並將您的想法轉化為可擴展的應用程式。


=== "Python"

      ```python
        from google import genai

        client = genai.Client()
        response = client.models.generate_content(
            model="gemini-4-hydrogen",
            contents="How large is the universe?",
        )

        print(response.text)
      ```

=== "JavaScript"

      ```javascript
        import { GoogleGenAI } from "@google/genai";

        const ai = new GoogleGenAI({});

        async function main() {
          const response = await ai.models.generateContent({
            model: "gemini-4-hydrogen",
            contents: "How large is the universe?",
          });
          console.log(response.text);
        }

        await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;

      Client client = new Client();
      CreateModelInteraction req = CreateModelInteraction.builder()
          .model(Model.of("gemini-4-hydrogen"))
          .input(InteractionsInput.of("How large is the universe?"))
          .build();
      var interaction = client.interactions.create(CreateInteractionRequestBody.of(req)).interaction().get();
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
                  Input: interactions.NewInteractionsInput("How large is the universe?"),
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

      ```bash
        curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:generateContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "contents": [{
            "parts":[{"text": "How large is the universe?"}]
            }]
           }'
      ```


## 精選學術研究人員 {#featured-academics}


![](https://www.gstatic.com/cloud-cms/287718c31f8665f683c3d79289e8d8e6.png)

  「我們的研究從穩健性與安全性的角度，探討 Gemini 作為視覺語言模型（VLM）的表現，以及其在多樣環境中的代理行為。至今，我們已評估 Gemini 在 VLM 代理執行電腦任務時，面對彈出式視窗等干擾因素的穩健性，也運用 Gemini 根據影片輸入，分析社交互動、時序事件與風險因素。」

  [Diyi Yang 的網站](https://cs.stanford.edu/~diyiy/)


![](https://www.gstatic.com/cloud-cms/780aeb12bd871920301b77d426a658a2.png)

  「Gemini Pro 與 Flash 憑藉其長上下文視窗，一直協助我們進行 OK-Robot 這個開放詞彙行動操作專案。Gemini 能針對機器人的『記憶』執行複雜的自然語言查詢與指令：在此情境中，記憶指的是機器人在長時間運作期間先前所做的觀察。我與 Mahi Shafiullah 也運用 Gemini，將任務分解為機器人能在現實世界執行的程式碼。」

  [Lerrel Pinto 的網站](https://www.lerrelpinto.com/)


## Gemini Academic Program {#gemini-academic-program}

位於[支援的國家/地區](/docs/available-regions/)、符合資格的學術研究人員（例如教職員與博士生），可申請獲得用於研究專案的 Gemini API 額度與更高的速率限制。這項支援能為科學實驗帶來更高的輸送量，並推動研究進展。

我們特別關注下一節列出的研究領域，但也歡迎來自各科學學科的申請：

-  **評估與基準測試**：由社群認可的評估方法，能在事實性、安全性、指令遵循、推理與規劃等方面，提供強而有力的效能訊號。

-  **加速科學探索，造福人類**：AI 在跨學科科學研究中的潛在應用，包括罕見與被忽視疾病、實驗生物學、材料科學與永續發展等領域。

-  **具身與互動**：運用大型語言模型，探索具身 AI、環境互動、機器人學與人機互動等領域中的新型互動方式。

-  **湧現能力**：探索提升推理與規劃所需的新型代理能力，以及如何在推論期間擴展能力（例如運用 Gemini Flash）。

-  **多模態互動與理解**：找出多模態基礎模型在各種任務的分析、推理與規劃方面的落差與機會。

-   **多模態互動與理解**：找出多模態基礎模型在各種任務的分析、推理與規劃方面的落差與機會。


申請資格：僅限隸屬於有效學術機構或學術研究組織的個人（教職員、研究人員或同等職位）申請。請注意，API 存取權與額度將由 Google 酌情授予與撤銷。我們每月審查申請。

### 開始以 Gemini API 進行研究 {#start-researching-with-the-gemini-api}

[立即申請](https://forms.gle/HMviQstU8PxC5iCt5)
