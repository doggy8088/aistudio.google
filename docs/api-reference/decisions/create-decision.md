# 建立決策


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/`.


`POST` `https://generativelanguage.googleapis.com/v1beta/decisions`

針對共用輸入，評估一整批結構化決策問題。

每個問題都會獨立作答，回應會針對每個問題提供一個經過校準的答案，並以請求中的問題 ID 作為對應鍵。


  
## 請求主體 {#request-body}

  
  **model**: required `string`

  用於評估決策的 `Model` 名稱。

  

---


  

<details>
<summary>**input**: required `DecisionInputContent` or `DecisionInputContent array` or `string` 所有決策問題共用的輸入前置內容，只評估一次。</summary>

  

  **可能的類型**：

  

<details>
<summary>**AudioContent**</summary>

  

  音訊內容區塊。

  **type**: required `object`

  值：`audio`

  **data**: `string`

  音訊內容。

  **uri**: `string`

  音訊的 URI。

  **channels**: `integer`

  音訊聲道數量。

  **sample_rate**: `integer`

  音訊的取樣率。

  

<details>
<summary>**mime_type**: `string enum` 音訊的 MIME 類型。</summary>

  

  可能的值：

  - `audio/wav`：WAV 音訊格式。
  - `audio/mp3`：MP3 音訊格式。
  - `audio/aiff`：AIFF 音訊格式。
  - `audio/aac`：AAC 音訊格式。
  - `audio/ogg`：OGG 音訊格式。
  - `audio/flac`：FLAC 音訊格式。
  - `audio/mpeg`：MPEG 音訊格式。
  - `audio/m4a`：M4A 音訊格式。
  - `audio/l16`：L16 音訊格式。
  - `audio/opus`：OPUS 音訊格式。
  - `audio/alaw`：ALAW 音訊格式。
  - `audio/mulaw`：MULAW 音訊格式。
  - `audio/webm`：WEBM 音訊格式。

  

</details>


  

</details>


  

<details>
<summary>**DocumentContent**</summary>

  

  文件內容區塊。

  **type**: required `object`

  值：`document`

  **data**: `string`

  文件內容。

  **uri**: `string`

  文件的 URI。

  

<details>
<summary>**mime_type**: `string enum` 文件的 MIME 類型。</summary>

  

  可能的值：

  - `application/pdf`：PDF 文件格式。
  - `text/csv`：CSV 文件格式。
  - `application/vnd.openxmlformats-officedocument.presentationml.presentation`：PPTX 簡報格式。
  - `application/vnd.ms-powerpoint`：PPT 簡報格式。
  - `application/vnd.oasis.opendocument.presentation`：ODP 簡報格式。
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`：DOCX 文件格式。
  - `application/msword`：DOC 文件格式。
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.template`：DOTX 文件範本格式。
  - `application/vnd.oasis.opendocument.text`：ODT 文件格式。
  - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`：XLSX 試算表格式。
  - `application/vnd.ms-excel`：XLS 試算表格式。
  - `application/vnd.oasis.opendocument.spreadsheet`：ODS 試算表格式。

  

</details>


  

</details>


  

<details>
<summary>**ImageContent**</summary>

  

  圖片內容區塊。

  **type**: required `object`

  值：`image`

  **data**: `string`

  圖片內容。

  **uri**: `string`

  圖片的 URI。

  

<details>
<summary>**resolution**: `MediaResolution` 媒體的解析度。</summary>

  

  可能的值：

  - `low`：低解析度。
  - `medium`：中解析度。
  - `high`：高解析度。
  - `ultra_high`：超高解析度。

  

</details>


  

<details>
<summary>**mime_type**: `string enum` 圖片的 MIME 類型。</summary>

  

  可能的值：

  - `image/png`：PNG 圖片格式。
  - `image/jpeg`：JPEG 圖片格式。
  - `image/webp`：WebP 圖片格式。
  - `image/heic`：HEIC 圖片格式。
  - `image/heif`：HEIF 圖片格式。
  - `image/gif`：GIF 圖片格式。
  - `image/bmp`：BMP 圖片格式。
  - `image/tiff`：TIFF 圖片格式。

  

</details>


  

</details>


  

<details>
<summary>**TextContent**</summary>

  

  文字內容區塊。

  **text**: required `string`

  文字內容。

  **type**: required `object`

  值：`text`

  

<details>
<summary>**annotations**: `Annotation array` 模型生成內容的引用資訊。</summary>

  

  **可能的類型**：

  

<details>
<summary>**FileCitation**</summary>

  

  檔案引用註記。

  **type**: required `object`

  值：`file_citation`

  **document_uri**: `string`

  檔案的 URI。

  **file_name**: `string`

  檔案名稱。

  **source**: `string`

  這段文字所歸屬的來源。

  **custom_metadata**: `object`

  使用者提供的擷取上下文相關中繼資料。

  **page_number**: `integer`

  所引用文件的頁碼（如適用）。

  **media_id**: `string`

  圖片引用時的媒體 ID（如適用）。

  **start_index**: `integer`

  回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

  **end_index**: `integer`

  所歸屬區段的終點（不含該位置）。

  

</details>


  

<details>
<summary>**PlaceCitation**</summary>

  

  地點引用註記。

  **type**: required `object`

  值：`place_citation`

  **place_id**: `string`

  地點的 ID，格式為 `places/{place_id}`。

  **name**: `string`

  地點的標題。

  **url**: `string`

  地點的 URI 參照。

  

<details>
<summary>**review_snippets**: `ReviewSnippet array` 用來生成 Google 地圖中特定地點特色相關回答的評論片段。</summary>

  

  **title**: `string`

  評論的標題。

  **url**: `string`

  對應到 Google 地圖上使用者評論的連結。

  **review_id**: `string`

  評論片段的 ID。

  

</details>


  **start_index**: `integer`

  回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

  **end_index**: `integer`

  所歸屬區段的終點（不含該位置）。

  

</details>


  

<details>
<summary>**SpeechAnnotation**</summary>

  

  文字內容的語音註記。

  **type**: required `object`

  值：`speech_metadata`

  **speaker**: `string`

  要與這個發言回合建立關聯的說話者。

  **style**: `string`

  語音合成的風格指令。

  **start_index**: `integer`

  回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

  **end_index**: `integer`

  所歸屬區段的終點（不含該位置）。

  

</details>


  

<details>
<summary>**UrlCitation**</summary>

  

  URL 引用註記。

  **type**: required `object`

  值：`url_citation`

  **url**: `string`

  URL。

  **title**: `string`

  URL 的標題。

  **start_index**: `integer`

  回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

  **end_index**: `integer`

  所歸屬區段的終點（不含該位置）。

  

</details>


  

<details>
<summary>**WordInfo**</summary>

  

  用於轉錄輸出的單字層級 ASR 註記。包含單字文字、選填的時間資訊，以及選填的說話者歸屬。

  **type**: required `object`

  值：`word_info`

  **text**: `string`

  轉錄出的單字。

  **start_offset**: `string`

  單字相對於音訊開頭的開始時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

  **end_offset**: `string`

  單字相對於音訊開頭的結束時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

  **speaker**: `string`

  選填。此單字的說話者標籤（例如 "spk_1"、"spk_2"）。在 TranscriptionConfig 中設定了 diarization_mode 時才會出現。

  **start_index**: `integer`

  回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

  **end_index**: `integer`

  所歸屬區段的終點（不含該位置）。

  

</details>


  

</details>


  

</details>


  

<details>
<summary>**VideoContent**</summary>

  

  影片內容區塊。

  **type**: required `object`

  值：`video`

  **data**: `string`

  影片內容。

  **uri**: `string`

  影片的 URI。

  

<details>
<summary>**resolution**: `MediaResolution` 媒體的解析度。</summary>

  

  可能的值：

  - `low`：低解析度。
  - `medium`：中解析度。
  - `high`：高解析度。
  - `ultra_high`：超高解析度。

  

</details>


  

<details>
<summary>**processing**: `MediaProcessing` or `string enum` 模型如何處理這部影片以進行理解。</summary>

  

  **可能的類型**：

  

<details>
<summary>**MediaProcessing**</summary>

  

  **type**: required `object`

  值：`static`

  **start_offset**: `string`

  選填。區段開始時間。以十進位秒數表示，後面加上 's' 後綴，例如 "10.5s"。必須為非負數。

  **end_offset**: `string`

  選填。區段結束時間。以十進位秒數表示，後面加上 's' 後綴，例如 "30s"。必須為非負數，且在設定了 `start_offset` 時，必須大於 `start_offset`。

  **fps**: `number`

  選填。影片影格率取樣密度。

  

</details>


  

<details>
<summary>**string enum**</summary>

  

  可能的值：

  - `static`：以固定速率擷取影格。所有影格都會放入上下文中。
  - `agentic`：由模型驅動的動態導覽。

  

</details>


  

</details>


  **name**: `string`

  使用者為此內容區塊定義的名稱。模型可以在最終回應中參照此名稱。

  

<details>
<summary>**mime_type**: `string enum` 影片的 MIME 類型。</summary>

  

  可能的值：

  - `video/mp4`：MP4 影片格式。
  - `video/mpeg`：MPEG 影片格式。
  - `video/mpg`：MPG 影片格式。
  - `video/mov`：MOV 影片格式。
  - `video/avi`：AVI 影片格式。
  - `video/x-flv`：FLV 影片格式。
  - `video/webm`：WebM 影片格式。
  - `video/wmv`：WMV 影片格式。
  - `video/3gpp`：3GPP 影片格式。

  

</details>


  

</details>


  

<details>
<summary>**DecisionInputContent array**</summary>

  

  清單中的每個項目為下列其中之一：`AudioContent`、`DocumentContent`、`ImageContent`、`TextContent`、`VideoContent`。

  

</details>


  

<details>
<summary>**string**</summary>

  

  直接的字串值。

  

</details>


  

</details>


  

---


  **questions**: required `object`

  要評估的決策問題，以呼叫端定義的唯一問題識別碼作為對應鍵（至少 1 個問題）。

  

  

  
  **範例請求**

  

=== "是"


    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/decisions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-decision-1",
              "input": "Customer message: Hi, I was charged twice for my monthly subscription this morning. Can you refund the duplicate charge?",
              "questions": {
                "needs_billing_refund": {
                  "type": "noul",
                  "instructions": "Determine whether the customer is requesting a billing refund.",
                  "criteria": {
                    "true_description": "The customer explicitly asks for a refund or reversal of a charge.",
                    "false_description": "The customer is asking a general question or reporting a non-billing issue."
                  }
                }
              }
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})
          response = client.decisions.create(
              model="gemini-decision-1",
              input=(
                  "Customer message: Hi, I was charged twice for my monthly"
                  " subscription this morning. Can you refund the duplicate charge?"
              ),
              questions={
                  "needs_billing_refund": {
                      "type": "noul",
                      "instructions": (
                          "Determine whether the customer is requesting a billing"
                          " refund."
                      ),
                      "criteria": {
                          "true_description": (
                              "The customer explicitly asks for a refund or reversal"
                              " of a charge."
                          ),
                          "false_description": (
                              "The customer is asking a general question or reporting"
                              " a non-billing issue."
                          ),
                      },
                  },
              },
          )
          if response.answers:
            answer = response.answers["needs_billing_refund"]
            if answer.type == "noul":
              print(f"P(true)={answer.noul}, confidence={answer.confidence}")
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});
          const response = await ai.decisions.create({
            model: 'gemini-decision-1',
            input:
              'Customer message: Hi, I was charged twice for my monthly subscription this morning. Can you refund the duplicate charge?',
            questions: {
              needs_billing_refund: {
                type: 'noul',
                instructions:
                  'Determine whether the customer is requesting a billing refund.',
                criteria: {
                  true_description:
                    'The customer explicitly asks for a refund or reversal of a charge.',
                  false_description:
                    'The customer is asking a general question or reporting a non-billing issue.',
                },
              },
            },
          });
          const answer = response.answers?.['needs_billing_refund'];
          if (answer?.type === 'noul') {
            console.log(`P(true)=${answer.noul}, confidence=${answer.confidence}`);
          }
          ```

    === "Java"

          ```java
          import com.google.genai.gaos.models.decisions.Answer;
          import com.google.genai.Client;
          import com.google.genai.gaos.models.decisions.CreateDecisionRequest;
          import com.google.genai.gaos.models.operations.CreateDecisionResponse;
          import com.google.genai.types.HttpOptions;
          import com.google.genai.gaos.models.decisions.Input;
          import com.google.genai.gaos.models.decisions.NoulAnswer;
          import com.google.genai.gaos.models.decisions.NoulCriteria;
          import com.google.genai.gaos.models.decisions.NoulQuestion;
          import com.google.genai.gaos.models.decisions.NoulQuestionInstructions;

          Client client =
              Client.builder()
                  .httpOptions(HttpOptions.builder().apiVersion("v1beta").build())
                  .build();
          CreateDecisionRequest request =
              CreateDecisionRequest.builder()
                  .model("gemini-decision-1")
                  .input(
                      Input.of(
                          "Customer message: Hi, I was charged twice for my monthly subscription this"
                              + " morning. Can you refund the duplicate charge?"))
                  .questions(
                      Map.of(
                          "needs_billing_refund",
                          NoulQuestion.builder()
                              .instructions(
                                  NoulQuestionInstructions.of(
                                      "Determine whether the customer is requesting a billing refund."))
                              .criteria(
                                  NoulCriteria.builder()
                                      .trueDescription(
                                          "The customer explicitly asks for a refund or reversal of a"
                                              + " charge.")
                                      .falseDescription(
                                          "The customer is asking a general question or reporting a"
                                              + " non-billing issue.")
                                      .build())
                              .build()))
                  .build();
          CreateDecisionResponse response = client.decisions.create(request);
          Map<String, Answer> answers =
              response.createDecisionResponse().flatMap(r -> r.answers()).orElse(Map.of());
          Answer answer = answers.get("needs_billing_refund");
          if (answer instanceof NoulAnswer noulAnswer) {
            System.out.println(
                "P(true)="
                    + noulAnswer.noul().orElse(0.0)
                    + ", confidence="
                    + noulAnswer.confidence().orElse(0.0));
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
              gaos_decisions "google.golang.org/genai/interactions/models/decisions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, &genai.ClientConfig{
                  HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
              })
              if err != nil {
                  log.Fatal(err)
              }

              req := operations.CreateDecisionRequest{
                  Body: gaos_decisions.CreateDecisionRequest{
                      Model: "gemini-decision-1",
                      Input: gaos_decisions.NewInput("Customer message: Hi, I was charged twice for my monthly subscription this morning. Can you refund the duplicate charge?"),
                      Questions: map[string]gaos_decisions.Question{
                          "needs_billing_refund": gaos_decisions.NewQuestion(gaos_decisions.NoulQuestion{
                              Instructions: gaos_decisions.NewNoulQuestionInstructions("Determine whether the customer is requesting a billing refund."),
                              Criteria: &gaos_decisions.NoulCriteria{
                                  TrueDescription:  genai.Ptr("The customer explicitly asks for a refund or reversal of a charge."),
                                  FalseDescription: genai.Ptr("The customer is asking a general question or reporting a non-billing issue."),
                              },
                          }),
                      },
                  },
              }

              res, err := client.Decisions.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.CreateDecisionResponse != nil {
                  if answer, ok := res.CreateDecisionResponse.Answers["needs_billing_refund"]; ok && answer.NoulAnswer != nil {
                      fmt.Printf("P(true)=%v, confidence=%v\n", answer.NoulAnswer.GetNoul(), answer.NoulAnswer.GetConfidence())
                  }
              }
          }
          ```

=== "選擇"


    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/decisions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-decision-1",
              "input": "Customer message: Every time I click Export to PDF, the app freezes and crashes with error code 504.",
              "questions": {
                "ticket_route": {
                  "type": "choice",
                  "instructions": "Route the support ticket to the most appropriate team.",
                  "criteria": {
                    "billing": "Invoices, charges, refunds, or subscription plan changes.",
                    "technical_support": "Bugs, crashes, errors, or product functionality issues.",
                    "account_access": "Login, password reset, or two-factor authentication issues."
                  }
                }
              }
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})
          response = client.decisions.create(
              model="gemini-decision-1",
              input=(
                  "Customer message: Every time I click Export to PDF, the app"
                  " freezes and crashes with error code 504."
              ),
              questions={
                  "ticket_route": {
                      "type": "choice",
                      "instructions": (
                          "Route the support ticket to the most appropriate team."
                      ),
                      "criteria": {
                          "billing": (
                              "Invoices, charges, refunds, or subscription plan"
                              " changes."
                          ),
                          "technical_support": (
                              "Bugs, crashes, errors, or product functionality"
                              " issues."
                          ),
                          "account_access": (
                              "Login, password reset, or two-factor authentication"
                              " issues."
                          ),
                      },
                  },
              },
          )
          if response.answers:
            answer = response.answers["ticket_route"]
            if answer.type == "choice":
              print(
                  f"choice={answer.choice}, confidence={answer.confidence},"
                  f" probabilities={answer.probabilities}"
              )
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});
          const response = await ai.decisions.create({
            model: 'gemini-decision-1',
            input:
              'Customer message: Every time I click Export to PDF, the app freezes and crashes with error code 504.',
            questions: {
              ticket_route: {
                type: 'choice',
                instructions:
                  'Route the support ticket to the most appropriate team.',
                criteria: {
                  billing:
                    'Invoices, charges, refunds, or subscription plan changes.',
                  technical_support:
                    'Bugs, crashes, errors, or product functionality issues.',
                  account_access:
                    'Login, password reset, or two-factor authentication issues.',
                },
              },
            },
          });
          const answer = response.answers?.['ticket_route'];
          if (answer?.type === 'choice') {
            console.log(
              `choice=${answer.choice}, confidence=${answer.confidence}`,
              answer.probabilities,
            );
          }
          ```

    === "Java"

          ```java
          import com.google.genai.gaos.models.decisions.Answer;
          import com.google.genai.gaos.models.decisions.ChoiceAnswer;
          import com.google.genai.gaos.models.decisions.ChoiceQuestion;
          import com.google.genai.gaos.models.decisions.ChoiceQuestionInstructions;
          import com.google.genai.Client;
          import com.google.genai.gaos.models.decisions.CreateDecisionRequest;
          import com.google.genai.gaos.models.operations.CreateDecisionResponse;
          import com.google.genai.types.HttpOptions;
          import com.google.genai.gaos.models.decisions.Input;

          Client client =
              Client.builder()
                  .httpOptions(HttpOptions.builder().apiVersion("v1beta").build())
                  .build();
          CreateDecisionRequest request =
              CreateDecisionRequest.builder()
                  .model("gemini-decision-1")
                  .input(
                      Input.of(
                          "Customer message: Every time I click Export to PDF, the app freezes and"
                              + " crashes with error code 504."))
                  .questions(
                      Map.of(
                          "ticket_route",
                          ChoiceQuestion.builder()
                              .instructions(
                                  ChoiceQuestionInstructions.of(
                                      "Route the support ticket to the most appropriate team."))
                              .criteria(
                                  Map.of(
                                      "billing",
                                      "Invoices, charges, refunds, or subscription plan changes.",
                                      "technical_support",
                                      "Bugs, crashes, errors, or product functionality issues.",
                                      "account_access",
                                      "Login, password reset, or two-factor authentication issues."))
                              .build()))
                  .build();
          CreateDecisionResponse response = client.decisions.create(request);
          Map<String, Answer> answers =
              response.createDecisionResponse().flatMap(r -> r.answers()).orElse(Map.of());
          Answer answer = answers.get("ticket_route");
          if (answer instanceof ChoiceAnswer choiceAnswer) {
            System.out.println(
                "choice="
                    + choiceAnswer.choice().orElse("")
                    + ", confidence="
                    + choiceAnswer.confidence().orElse(0.0)
                    + ", probabilities="
                    + choiceAnswer.probabilities().orElse(Map.of()));
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
              gaos_decisions "google.golang.org/genai/interactions/models/decisions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, &genai.ClientConfig{
                  HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
              })
              if err != nil {
                  log.Fatal(err)
              }

              req := operations.CreateDecisionRequest{
                  Body: gaos_decisions.CreateDecisionRequest{
                      Model: "gemini-decision-1",
                      Input: gaos_decisions.NewInput("Customer message: Every time I click Export to PDF, the app freezes and crashes with error code 504."),
                      Questions: map[string]gaos_decisions.Question{
                          "ticket_route": gaos_decisions.NewQuestion(gaos_decisions.ChoiceQuestion{
                              Instructions: gaos_decisions.NewChoiceQuestionInstructions("Route the support ticket to the most appropriate team."),
                              Criteria: map[string]string{
                                  "billing":           "Invoices, charges, refunds, or subscription plan changes.",
                                  "technical_support": "Bugs, crashes, errors, or product functionality issues.",
                                  "account_access":    "Login, password reset, or two-factor authentication issues.",
                              },
                          }),
                      },
                  },
              }

              res, err := client.Decisions.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.CreateDecisionResponse != nil {
                  if answer, ok := res.CreateDecisionResponse.Answers["ticket_route"]; ok && answer.ChoiceAnswer != nil {
                      fmt.Printf("choice=%s, confidence=%v, probabilities=%v\n", answer.ChoiceAnswer.GetChoice(), answer.ChoiceAnswer.GetConfidence(), answer.ChoiceAnswer.GetProbabilities())
                  }
              }
          }
          ```

=== "評分"


    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/decisions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-decision-1",
              "input": "Draft reply: Duplicate charge refunded ($19.99) to your Visa ending in 4242. It will appear on your statement within 3-5 business days.",
              "questions": {
                "clarity": {
                  "type": "score",
                  "instructions": "Score the clarity and actionability of the customer support reply.",
                  "criteria": [
                    "Unclear, confusing, or missing key details.",
                    "Partially clear, but leaves important questions unanswered.",
                    "Clear, concise, and gives concrete details and timeline."
                  ]
                }
              }
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})
          response = client.decisions.create(
              model="gemini-decision-1",
              input=(
                  "Draft reply: Duplicate charge refunded ($19.99) to your Visa"
                  " ending in 4242. It will appear on your statement within 3-5"
                  " business days."
              ),
              questions={
                  "clarity": {
                      "type": "score",
                      "instructions": (
                          "Score the clarity and actionability of the customer"
                          " support reply."
                      ),
                      "criteria": [
                          "Unclear, confusing, or missing key details.",
                          "Partially clear, but leaves important questions unanswered.",
                          "Clear, concise, and gives concrete details and timeline.",
                      ],
                  },
              },
          )
          if response.answers:
            answer = response.answers["clarity"]
            if answer.type == "score":
              print(
                  f"score={answer.score}, confidence={answer.confidence},"
                  f" probabilities={answer.probabilities}"
              )
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});
          const response = await ai.decisions.create({
            model: 'gemini-decision-1',
            input:
              'Draft reply: Duplicate charge refunded ($19.99) to your Visa ending in 4242. It will appear on your statement within 3-5 business days.',
            questions: {
              clarity: {
                type: 'score',
                instructions:
                  'Score the clarity and actionability of the customer support reply.',
                criteria: [
                  'Unclear, confusing, or missing key details.',
                  'Partially clear, but leaves important questions unanswered.',
                  'Clear, concise, and gives concrete details and timeline.',
                ],
              },
            },
          });
          const answer = response.answers?.['clarity'];
          if (answer?.type === 'score') {
            console.log(
              `score=${answer.score}, confidence=${answer.confidence}`,
              answer.probabilities,
            );
          }
          ```

    === "Java"

          ```java
          import com.google.genai.gaos.models.decisions.Answer;
          import com.google.genai.Client;
          import com.google.genai.gaos.models.decisions.CreateDecisionRequest;
          import com.google.genai.gaos.models.operations.CreateDecisionResponse;
          import com.google.genai.types.HttpOptions;
          import com.google.genai.gaos.models.decisions.Input;
          import com.google.genai.gaos.models.decisions.ScoreAnswer;
          import com.google.genai.gaos.models.decisions.ScoreQuestion;
          import com.google.genai.gaos.models.decisions.ScoreQuestionInstructions;

          Client client =
              Client.builder()
                  .httpOptions(HttpOptions.builder().apiVersion("v1beta").build())
                  .build();
          CreateDecisionRequest request =
              CreateDecisionRequest.builder()
                  .model("gemini-decision-1")
                  .input(
                      Input.of(
                          "Draft reply: Duplicate charge refunded ($19.99) to your Visa ending in 4242."
                              + " It will appear on your statement within 3-5 business days."))
                  .questions(
                      Map.of(
                          "clarity",
                          ScoreQuestion.builder()
                              .instructions(
                                  ScoreQuestionInstructions.of(
                                      "Score the clarity and actionability of the customer support"
                                          + " reply."))
                              .criteria(
                                  List.of(
                                      "Unclear, confusing, or missing key details.",
                                      "Partially clear, but leaves important questions unanswered.",
                                      "Clear, concise, and gives concrete details and timeline."))
                              .build()))
                  .build();
          CreateDecisionResponse response = client.decisions.create(request);
          Map<String, Answer> answers =
              response.createDecisionResponse().flatMap(r -> r.answers()).orElse(Map.of());
          Answer answer = answers.get("clarity");
          if (answer instanceof ScoreAnswer scoreAnswer) {
            System.out.println(
                "score="
                    + scoreAnswer.score().orElse(0.0)
                    + ", confidence="
                    + scoreAnswer.confidence().orElse(0.0)
                    + ", probabilities="
                    + scoreAnswer.probabilities().orElse(Map.of()));
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
              gaos_decisions "google.golang.org/genai/interactions/models/decisions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, &genai.ClientConfig{
                  HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
              })
              if err != nil {
                  log.Fatal(err)
              }

              req := operations.CreateDecisionRequest{
                  Body: gaos_decisions.CreateDecisionRequest{
                      Model: "gemini-decision-1",
                      Input: gaos_decisions.NewInput("Draft reply: Duplicate charge refunded ($19.99) to your Visa ending in 4242. It will appear on your statement within 3-5 business days."),
                      Questions: map[string]gaos_decisions.Question{
                          "clarity": gaos_decisions.NewQuestion(gaos_decisions.ScoreQuestion{
                              Instructions: gaos_decisions.NewScoreQuestionInstructions("Score the clarity and actionability of the customer support reply."),
                              Criteria: []string{
                                  "Unclear, confusing, or missing key details.",
                                  "Partially clear, but leaves important questions unanswered.",
                                  "Clear, concise, and gives concrete details and timeline.",
                              },
                          }),
                      },
                  },
              }

              res, err := client.Decisions.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.CreateDecisionResponse != nil {
                  if answer, ok := res.CreateDecisionResponse.Answers["clarity"]; ok && answer.ScoreAnswer != nil {
                      fmt.Printf("score=%v, confidence=%v, probabilities=%v\n", answer.ScoreAnswer.GetScore(), answer.ScoreAnswer.GetConfidence(), answer.ScoreAnswer.GetProbabilities())
                  }
              }
          }
          ```

=== "多個問題"


    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/decisions \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "model": "gemini-decision-1",
              "input": "Customer message: Production API requests have been failing with 503 errors for the past 20 minutes, blocking all checkout traffic!",
              "questions": {
                "is_outage": {
                  "type": "noul",
                  "instructions": "Determine whether the customer is reporting an active production outage."
                },
                "priority": {
                  "type": "choice",
                  "instructions": "Select the incident priority level.",
                  "criteria": {
                    "p1_critical": "Production outage blocking core business traffic.",
                    "p2_high": "Major feature degraded with a workaround available.",
                    "p3_normal": "Minor bug or general question."
                  }
                },
                "urgency": {
                  "type": "score",
                  "instructions": "Rate the urgency of immediate escalation.",
                  "criteria": [
                    "Routine inquiry, standard SLA.",
                    "Time-sensitive issue needing same-day follow-up.",
                    "Immediate escalation required for active production impact."
                  ]
                }
              }
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})
          response = client.decisions.create(
              model="gemini-decision-1",
              input=(
                  "Customer message: Production API requests have been failing with"
                  " 503 errors for the past 20 minutes, blocking all checkout"
                  " traffic!"
              ),
              questions={
                  "is_outage": {
                      "type": "noul",
                      "instructions": (
                          "Determine whether the customer is reporting an active"
                          " production outage."
                      ),
                  },
                  "priority": {
                      "type": "choice",
                      "instructions": "Select the incident priority level.",
                      "criteria": {
                          "p1_critical": (
                              "Production outage blocking core business traffic."
                          ),
                          "p2_high": (
                              "Major feature degraded with a workaround available."
                          ),
                          "p3_normal": "Minor bug or general question.",
                      },
                  },
                  "urgency": {
                      "type": "score",
                      "instructions": "Rate the urgency of immediate escalation.",
                      "criteria": [
                          "Routine inquiry, standard SLA.",
                          "Time-sensitive issue needing same-day follow-up.",
                          "Immediate escalation required for active production impact.",
                      ],
                  },
              },
          )
          for question_id, answer in (response.answers or {}).items():
            if answer.type == "noul":
              print(f"{question_id}: P(true)={answer.noul}")
            elif answer.type == "choice":
              print(f"{question_id}: choice={answer.choice}")
            elif answer.type == "score":
              print(f"{question_id}: score={answer.score}")
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});
          const response = await ai.decisions.create({
            model: 'gemini-decision-1',
            input:
              'Customer message: Production API requests have been failing with 503 errors for the past 20 minutes, blocking all checkout traffic!',
            questions: {
              is_outage: {
                type: 'noul',
                instructions:
                  'Determine whether the customer is reporting an active production outage.',
              },
              priority: {
                type: 'choice',
                instructions: 'Select the incident priority level.',
                criteria: {
                  p1_critical: 'Production outage blocking core business traffic.',
                  p2_high: 'Major feature degraded with a workaround available.',
                  p3_normal: 'Minor bug or general question.',
                },
              },
              urgency: {
                type: 'score',
                instructions: 'Rate the urgency of immediate escalation.',
                criteria: [
                  'Routine inquiry, standard SLA.',
                  'Time-sensitive issue needing same-day follow-up.',
                  'Immediate escalation required for active production impact.',
                ],
              },
            },
          });
          for (const [questionId, answer] of Object.entries(response.answers ?? {})) {
            if (answer.type === 'noul') {
              console.log(`${questionId}: P(true)=${answer.noul}`);
            } else if (answer.type === 'choice') {
              console.log(`${questionId}: choice=${answer.choice}`);
            } else if (answer.type === 'score') {
              console.log(`${questionId}: score=${answer.score}`);
            }
          }
          ```

    === "Java"

          ```java
          import com.google.genai.gaos.models.decisions.Answer;
          import com.google.genai.gaos.models.decisions.ChoiceAnswer;
          import com.google.genai.gaos.models.decisions.ChoiceQuestion;
          import com.google.genai.gaos.models.decisions.ChoiceQuestionInstructions;
          import com.google.genai.Client;
          import com.google.genai.gaos.models.decisions.CreateDecisionRequest;
          import com.google.genai.gaos.models.operations.CreateDecisionResponse;
          import com.google.genai.types.HttpOptions;
          import com.google.genai.gaos.models.decisions.Input;
          import com.google.genai.gaos.models.decisions.NoulAnswer;
          import com.google.genai.gaos.models.decisions.NoulQuestion;
          import com.google.genai.gaos.models.decisions.NoulQuestionInstructions;
          import com.google.genai.gaos.models.decisions.ScoreAnswer;
          import com.google.genai.gaos.models.decisions.ScoreQuestion;
          import com.google.genai.gaos.models.decisions.ScoreQuestionInstructions;

          Client client =
              Client.builder()
                  .httpOptions(HttpOptions.builder().apiVersion("v1beta").build())
                  .build();
          CreateDecisionRequest request =
              CreateDecisionRequest.builder()
                  .model("gemini-decision-1")
                  .input(
                      Input.of(
                          "Customer message: Production API requests have been failing with 503 errors"
                              + " for the past 20 minutes, blocking all checkout traffic!"))
                  .questions(
                      Map.of(
                          "is_outage",
                          NoulQuestion.builder()
                              .instructions(
                                  NoulQuestionInstructions.of(
                                      "Determine whether the customer is reporting an active production"
                                          + " outage."))
                              .build(),
                          "priority",
                          ChoiceQuestion.builder()
                              .instructions(
                                  ChoiceQuestionInstructions.of("Select the incident priority level."))
                              .criteria(
                                  Map.of(
                                      "p1_critical",
                                      "Production outage blocking core business traffic.",
                                      "p2_high",
                                      "Major feature degraded with a workaround available.",
                                      "p3_normal",
                                      "Minor bug or general question."))
                              .build(),
                          "urgency",
                          ScoreQuestion.builder()
                              .instructions(
                                  ScoreQuestionInstructions.of(
                                      "Rate the urgency of immediate escalation."))
                              .criteria(
                                  List.of(
                                      "Routine inquiry, standard SLA.",
                                      "Time-sensitive issue needing same-day follow-up.",
                                      "Immediate escalation required for active production impact."))
                              .build()))
                  .build();
          CreateDecisionResponse response = client.decisions.create(request);
          Map<String, Answer> answers =
              response.createDecisionResponse().flatMap(r -> r.answers()).orElse(Map.of());
          for (Map.Entry<String, Answer> entry : answers.entrySet()) {
            Answer answer = entry.getValue();
            if (answer instanceof NoulAnswer noulAnswer) {
              System.out.println(entry.getKey() + ": P(true)=" + noulAnswer.noul().orElse(0.0));
            } else if (answer instanceof ChoiceAnswer choiceAnswer) {
              System.out.println(entry.getKey() + ": choice=" + choiceAnswer.choice().orElse(""));
            } else if (answer instanceof ScoreAnswer scoreAnswer) {
              System.out.println(entry.getKey() + ": score=" + scoreAnswer.score().orElse(0.0));
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
              gaos_decisions "google.golang.org/genai/interactions/models/decisions"
              "google.golang.org/genai/interactions/models/operations"
          )

          func main() {
              ctx := context.Background()
              client, err := genai.NewClient(ctx, &genai.ClientConfig{
                  HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
              })
              if err != nil {
                  log.Fatal(err)
              }

              req := operations.CreateDecisionRequest{
                  Body: gaos_decisions.CreateDecisionRequest{
                      Model: "gemini-decision-1",
                      Input: gaos_decisions.NewInput("Customer message: Production API requests have been failing with 503 errors for the past 20 minutes, blocking all checkout traffic!"),
                      Questions: map[string]gaos_decisions.Question{
                          "is_outage": gaos_decisions.NewQuestion(gaos_decisions.NoulQuestion{
                              Instructions: gaos_decisions.NewNoulQuestionInstructions("Determine whether the customer is reporting an active production outage."),
                          }),
                          "priority": gaos_decisions.NewQuestion(gaos_decisions.ChoiceQuestion{
                              Instructions: gaos_decisions.NewChoiceQuestionInstructions("Select the incident priority level."),
                              Criteria: map[string]string{
                                  "p1_critical": "Production outage blocking core business traffic.",
                                  "p2_high":     "Major feature degraded with a workaround available.",
                                  "p3_normal":   "Minor bug or general question.",
                              },
                          }),
                          "urgency": gaos_decisions.NewQuestion(gaos_decisions.ScoreQuestion{
                              Instructions: gaos_decisions.NewScoreQuestionInstructions("Rate the urgency of immediate escalation."),
                              Criteria: []string{
                                  "Routine inquiry, standard SLA.",
                                  "Time-sensitive issue needing same-day follow-up.",
                                  "Immediate escalation required for active production impact.",
                              },
                          }),
                      },
                  },
              }

              res, err := client.Decisions.Create(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.CreateDecisionResponse != nil {
                  for questionID, answer := range res.CreateDecisionResponse.Answers {
                      if answer.NoulAnswer != nil {
                          fmt.Printf("%s: P(true)=%v\n", questionID, answer.NoulAnswer.GetNoul())
                      } else if answer.ChoiceAnswer != nil {
                          fmt.Printf("%s: choice=%s\n", questionID, answer.ChoiceAnswer.GetChoice())
                      } else if answer.ScoreAnswer != nil {
                          fmt.Printf("%s: score=%v\n", questionID, answer.ScoreAnswer.GetScore())
                      }
                  }
              }
          }
          ```


  


  
## 回應 {#response}

  
  **answers**: `object`

  僅供輸出。決策答案，以 `questions` 中的問題識別碼作為對應鍵。

  

---


  

<details>
<summary>**usage**: `Usage` 僅供輸出。此決策評估請求的權杖用量統計。</summary>

  

  **total_input_tokens**: `integer`

  提示詞（上下文）中的權杖數量。

  **initial_input_tokens**: `integer`

  此互動第一個回合所使用的輸入權杖數量。

  

<details>
<summary>**input_tokens_by_modality**: `ModalityTokens array` 依模態區分的輸入權杖用量明細。</summary>

  

  

<details>
<summary>**modality**: `ResponseModality` 與權杖數量對應的模態。</summary>

  

  可能的值：

  - `text`：表示模型應傳回文字。
  - `image`：表示模型應傳回圖片。
  - `audio`：表示模型應傳回音訊。
  - `video`：表示模型應傳回影片。
  - `document`：表示模型應傳回文件。

  

</details>


  **tokens**: `integer`

  該模態的權杖數量。

  

</details>


  **total_cached_tokens**: `integer`

  提示詞中已快取部分（快取內容）的權杖數量。

  

<details>
<summary>**cached_tokens_by_modality**: `ModalityTokens array` 依模態區分的快取權杖用量明細。</summary>

  

  

<details>
<summary>**modality**: `ResponseModality` 與權杖數量對應的模態。</summary>

  

  可能的值：

  - `text`：表示模型應傳回文字。
  - `image`：表示模型應傳回圖片。
  - `audio`：表示模型應傳回音訊。
  - `video`：表示模型應傳回影片。
  - `document`：表示模型應傳回文件。

  

</details>


  **tokens**: `integer`

  該模態的權杖數量。

  

</details>


  **total_output_tokens**: `integer`

  所有生成回應的權杖總數。

  

<details>
<summary>**output_tokens_by_modality**: `ModalityTokens array` 依模態區分的輸出權杖用量明細。</summary>

  

  

<details>
<summary>**modality**: `ResponseModality` 與權杖數量對應的模態。</summary>

  

  可能的值：

  - `text`：表示模型應傳回文字。
  - `image`：表示模型應傳回圖片。
  - `audio`：表示模型應傳回音訊。
  - `video`：表示模型應傳回影片。
  - `document`：表示模型應傳回文件。

  

</details>


  **tokens**: `integer`

  該模態的權杖數量。

  

</details>


  **total_tool_use_tokens**: `integer`

  工具使用提示詞中的權杖數量。

  

<details>
<summary>**tool_use_tokens_by_modality**: `ModalityTokens array` 依模態區分的工具使用權杖用量明細。</summary>

  

  

<details>
<summary>**modality**: `ResponseModality` 與權杖數量對應的模態。</summary>

  

  可能的值：

  - `text`：表示模型應傳回文字。
  - `image`：表示模型應傳回圖片。
  - `audio`：表示模型應傳回音訊。
  - `video`：表示模型應傳回影片。
  - `document`：表示模型應傳回文件。

  

</details>


  **tokens**: `integer`

  該模態的權杖數量。

  

</details>


  **total_thought_tokens**: `integer`

  思考模型的思考權杖數量。

  **total_tokens**: `integer`

  互動請求的權杖總數（提示詞 + 回應 + 其他內部權杖）。

  

<details>
<summary>**grounding_tool_count**: `GroundingToolCount array` 接地工具計數。</summary>

  

  

<details>
<summary>**type**: `string enum` 與計數對應的接地工具類型。</summary>

  

  可能的值：

  - `google_search`：使用 Google 網頁搜尋與圖片搜尋接地，以及 Web Grounding for Enterprise。
  - `google_maps`：使用 Google 地圖接地。

  

</details>


  **count**: `integer`

  接地工具的計數數量。

  

</details>


  

</details>


  

---


  **prompt_feedback**: [`PromptFeedback`](/api-reference/decisions/create-decision/#Resource:PromptFeedback)

  僅供輸出。來自輸入內容篩選器的回饋。若設定了 `prompt_feedback.block_reason`，表示提示詞（`input` 與問題文字）已被輸入政策封鎖，不會評估任何決策，且 `answers` 為空。

  

  

  
  **範例回應**

  

=== "是"

      ```json
      {
        "answers": {
          "needs_billing_refund": {
            "type": "noul",
            "confidence": 0.97,
            "noul": 0.97
          }
        },
        "usage": {
          "input_tokens_by_modality": [
            {
              "modality": "text",
              "tokens": 152
            }
          ],
          "total_input_tokens": 152,
          "total_output_tokens": 0,
          "total_tokens": 152
        }
      }
      ```

=== "選擇"

      ```json
      {
        "answers": {
          "ticket_route": {
            "type": "choice",
            "choice": "technical_support",
            "confidence": 0.95,
            "probabilities": {
              "account_access": 0.02,
              "billing": 0.03,
              "technical_support": 0.95
            }
          }
        }
      }
      ```

=== "評分"

      ```json
      {
        "answers": {
          "clarity": {
            "type": "score",
            "confidence": 0.82,
            "legend": {
              "0": "Unclear, confusing, or missing key details.",
              "1": "Partially clear, but leaves important questions unanswered.",
              "2": "Clear, concise, and gives concrete details and timeline."
            },
            "probabilities": {
              "0": 0.02,
              "1": 0.16,
              "2": 0.82
            },
            "score": 1.8
          }
        }
      }
      ```

=== "多個問題"

      ```json
      {
        "answers": {
          "is_outage": {
            "type": "noul",
            "confidence": 0.98,
            "noul": 0.98
          },
          "priority": {
            "type": "choice",
            "choice": "p1_critical",
            "confidence": 0.93,
            "probabilities": {
              "p1_critical": 0.93,
              "p2_high": 0.06,
              "p3_normal": 0.01
            }
          },
          "urgency": {
            "type": "score",
            "confidence": 0.91,
            "legend": {
              "0": "Routine inquiry, standard SLA.",
              "1": "Time-sensitive issue needing same-day follow-up.",
              "2": "Immediate escalation required for active production impact."
            },
            "probabilities": {
              "0": 0.01,
              "1": 0.08,
              "2": 0.91
            },
            "score": 1.9
          }
        }
      }
      ```


  


## 資料模型 {#data-models}

### PromptFeedback {#Resource:PromptFeedback}

來自輸入內容篩選器的回饋。

**屬性**：


  

<details>
<summary>**block_reason**: `string enum` 選填。若有設定，表示輸入已被封鎖，不會傳回任何答案。</summary>

  

  可能的值：

  - `safety`：提示詞因安全因素遭到封鎖。
  - `other`：提示詞因不明原因遭到封鎖。
  - `blocklist`：提示詞因含有術語封鎖清單中的詞彙遭到封鎖。
  - `prohibited_content`：提示詞因含有禁止內容遭到封鎖。
  - `image_safety`：提示詞因圖片內容不安全遭到封鎖。

  

</details>


  

---


  **block_reason_message**: `string`

  選填。詳細說明封鎖原因的訊息（選填）。


