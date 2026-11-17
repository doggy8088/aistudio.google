# Decisions API

生成式模型產出的文字是供人閱讀的。當程式碼需要一個可據以分支的判斷時，生成再解析文字的做法會增加延遲，也會讓解析邏輯變得脆弱。

Decisions API 能針對文字、PDF、音訊、圖片與影片，評估具型別的問題。它使用 [Gemini Decision 1](/docs/models/gemini-decision-1/)，並回傳經校準的機率。它不產生任何文字權杖，因此輸出權杖用量永遠為 0。你的程式碼可以直接依據回應進行分支、排序與路由。

## How it works {#how-it-works}

每次呼叫都會送出[共用輸入](/docs/decisions-api/#input)與一組問題對應表，並為每個問題回傳一個具型別的答案。共用輸入可以結合文字、JSON、[PDF 文件](/docs/decisions-api/#documents)、[音訊](/docs/decisions-api/#audio)、[圖片](/docs/decisions-api/#media)與[影片](/docs/decisions-api/#video)：

![](https://www.gstatic.com/cloud-cms/55bb56725305bef6dd99ace3e16515c1.png)

每個問題都使用三種[問題類型](/docs/decisions-api/#question-types)之一：

| Question type | Goal | Returns |
| :--- | :--- | :--- |
| [Yes/no (`noul`)](/docs/decisions-api/#noul) | 檢查某個陳述是否成立 | `noul` (0.01 to 0.99), `confidence` |
| [Choice (`choice`)](/docs/decisions-api/#choice) | 從固定清單中選出一個選項 | `choice`, `probabilities`, `confidence` |
| [Score (`score`)](/docs/decisions-api/#score) | 依據有順序的評分等級為輸入評分 | `score`, `probabilities`, `legend`, `confidence` |

使用 Gemini Decision 1 開發時，請牢記三個概念：

*   **平行、隔離的評分：** 每個問題都在一次前向傳遞中針對共用輸入執行。問題之間彼此看不到對方，當你[提出多個問題](/docs/decisions-api/#multiple-questions)時，延遲幾乎不會增加。
*   **數值加上信心水準：** 答案會告訴你的程式碼適合採取哪個行動。[信心水準](/docs/decisions-api/#confidence)則告訴你的程式碼，應自動執行該行動，還是升級處理。
*   **原子檢查，在程式碼中組合：** 提出狹窄、單一目的的問題。再在程式碼中以一般的 `if` 陳述式與權重組合這些答案（參見[最佳做法](/docs/decisions-api/#best-practices)）。

## Quickstart {#quickstart}

需要 SDK 3.2 或更新版本（`pip install -U google-genai` 或
`npm install @google/genai@latest`）。傳入模型、共用輸入，以及一組問題對應表。每個問題都需要指定類型（是非題用 [`noul`](/docs/decisions-api/#noul)）與指令：


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      result = client.decisions.create(
          model="gemini-decision-1",
          input="The blue mug I ordered on Monday arrived cracked on Wednesday.",
          questions={
              "is_damaged": {
                  "type": "noul",
                  "instructions": "Did the item arrive damaged?",
              },
          },
      )

      answer = result.answers["is_damaged"]
      print(f"P(yes)={answer.noul:.2f} confidence={answer.confidence:.2f}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ apiVersion: "v1beta" });

      const result = await ai.decisions.create({
        model: "gemini-decision-1",
        input: "The blue mug I ordered on Monday arrived cracked on Wednesday.",
        questions: {
          is_damaged: {
            type: "noul",
            instructions: "Did the item arrive damaged?",
          },
        },
      });

      const answer = result.answers?.is_damaged;
      if (answer?.type === "noul") {
        console.log(`P(yes)=${answer.noul} confidence=${answer.confidence}`);
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/decisions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-decision-1",
          "input": "The blue mug I ordered on Monday arrived cracked on Wednesday.",
          "questions": {
            "is_damaged": {
              "type": "noul",
              "instructions": "Did the item arrive damaged?"
            }
          }
        }'
      ```


API 會回傳經校準的機率與權杖用量：

```json
{
  "answers": {
    "is_damaged": { "type": "noul", "noul": 0.99, "confidence": 0.99 }
  },
  "usage": {
    "total_input_tokens": 100,
    "input_tokens_by_modality": [{ "modality": "text", "tokens": 100 }],
    "total_output_tokens": 0,
    "total_tokens": 100
  }
}
```

## Question types {#question-types}

### Yes or no (noul) {#noul}

是非題會回傳答案為「是」的經校準機率。當問題本身含義不明確時，請加入判準來說明「是」與「否」分別代表什麼。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      result = client.decisions.create(
          model="gemini-decision-1",
          input="Customer returned the sweater because they preferred green over blue.",
          questions={
              "is_defect": {
                  "type": "noul",
                  "instructions": "Is the customer reporting a product defect?",
                  "criteria": {
                      "true_description": "The product itself is broken or faulty.",
                      "false_description": "Preference, sizing, shipping, or pricing complaint.",
                  },
              },
          },
      )

      print(result.answers["is_defect"].noul)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ apiVersion: "v1beta" });

      const result = await ai.decisions.create({
        model: "gemini-decision-1",
        input: "Customer returned the sweater because they preferred green over blue.",
        questions: {
          is_defect: {
            type: "noul",
            instructions: "Is the customer reporting a product defect?",
            criteria: {
              true_description: "The product itself is broken or faulty.",
              false_description: "Preference, sizing, shipping, or pricing complaint.",
            },
          },
        },
      });

      const answer = result.answers?.is_defect;
      if (answer?.type === "noul") console.log(answer.noul);
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/decisions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-decision-1",
          "input": "Customer returned the sweater because they preferred green over blue.",
          "questions": {
            "is_defect": {
              "type": "noul",
              "instructions": "Is the customer reporting a product defect?",
              "criteria": {
                "true_description": "The product itself is broken or faulty.",
                "false_description": "Preference, sizing, shipping, or pricing complaint."
              }
            }
          }
        }'
      ```


答案：

```json
{ "type": "noul", "noul": 0.03, "confidence": 0.97 }
```


!!! note " "

      是非題的機率永遠介於 0.01 與 0.99 之間。請將門檻設定在這個範圍內，因為高於 0.99 的檢查永遠不會符合。


### Pick one option (choice) {#choice}

選擇題會為一組固定選項評分，並同時回傳最佳選項，以及每個選項經校準的機率（總和為 1）。Criteria 會將每個選項 ID 對應到其適用時機的說明。當選項 ID 本身已不言自明時，請使用空字串（`""`）。

評估之前，API 會以 UTF-8 位元組順序依字母順序排序選項鍵。在 JSON 要求中改變鍵的順序，不會改變選項的位置；若機率完全相同，則以字母順序最前面的鍵勝出。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      result = client.decisions.create(
          model="gemini-decision-1",
          input="I was charged twice for my order.",
          questions={
              "department": {
                  "type": "choice",
                  "instructions": "Which department should handle this request?",
                  "criteria": {
                      "billing": "Payments, invoices, and refunds.",
                      "technical": "Problems using the product.",
                      "shipping": "Delivery and tracking.",
                      "other": "Anything outside these categories.",
                  },
              },
          },
      )

      answer = result.answers["department"]
      print(answer.choice, answer.confidence, answer.probabilities)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ apiVersion: "v1beta" });

      const result = await ai.decisions.create({
        model: "gemini-decision-1",
        input: "I was charged twice for my order.",
        questions: {
          department: {
            type: "choice",
            instructions: "Which department should handle this request?",
            criteria: {
              billing: "Payments, invoices, and refunds.",
              technical: "Problems using the product.",
              shipping: "Delivery and tracking.",
              other: "Anything outside these categories.",
            },
          },
        },
      });

      const answer = result.answers?.department;
      if (answer?.type === "choice") {
        console.log(answer.choice, answer.confidence, answer.probabilities);
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/decisions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-decision-1",
          "input": "I was charged twice for my order.",
          "questions": {
            "department": {
              "type": "choice",
              "instructions": "Which department should handle this request?",
              "criteria": {
                "billing": "Payments, invoices, and refunds.",
                "technical": "Problems using the product.",
                "shipping": "Delivery and tracking.",
                "other": "Anything outside these categories."
              }
            }
          }
        }'
      ```


答案：

```json
{
  "type": "choice",
  "choice": "billing",
  "probabilities": { "billing": 0.99, "shipping": 0.004, "other": 0.003, "technical": 0.002 },
  "confidence": 0.99
}
```


!!! note " "

      即使沒有任何選項符合，選擇題仍會把機率分配到你的各個選項上。請以信心水準門檻攔截確定性低的輸入、將問題與另一個是非題範圍檢查搭配使用，或加入帶有明確說明的萬用選項，例如 "other"。避免使用 "none_of_the_above" 這類位置型鍵：字母排序會把它排在 "shipping" 與 "technical" 這類鍵的前面，而不是最後。


### Rate on a scale (score) {#score}

評分題會依據有順序的等級為輸入評分。Criteria 是一個由非空等級說明組成的陣列，依由低至高的順序排列（2 至 255 個等級，多數評分標準建議使用 2 至 10 個），索引從 0 開始。

回傳的分數是等級索引的機率加權平均，因此可能落在等級之間，而 legend 則將每個索引對應回其說明。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      result = client.decisions.create(
          model="gemini-decision-1",
          input="Export fails in Safari but works in Chrome.",
          questions={
              "severity": {
                  "type": "score",
                  "instructions": "How severe is this issue for the user?",
                  "criteria": [
                      "Cosmetic: appearance only, no lost functionality.",
                      "Workaround available: a task fails, but another way works.",
                      "Fully blocked: a task fails with no workaround.",
                  ],
              },
          },
      )

      answer = result.answers["severity"]
      print(answer.score, answer.confidence, answer.probabilities)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ apiVersion: "v1beta" });

      const result = await ai.decisions.create({
        model: "gemini-decision-1",
        input: "Export fails in Safari but works in Chrome.",
        questions: {
          severity: {
            type: "score",
            instructions: "How severe is this issue for the user?",
            criteria: [
              "Cosmetic: appearance only, no lost functionality.",
              "Workaround available: a task fails, but another way works.",
              "Fully blocked: a task fails with no workaround.",
            ],
          },
        },
      });

      const answer = result.answers?.severity;
      if (answer?.type === "score") {
        console.log(answer.score, answer.confidence, answer.probabilities);
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/decisions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-decision-1",
          "input": "Export fails in Safari but works in Chrome.",
          "questions": {
            "severity": {
              "type": "score",
              "instructions": "How severe is this issue for the user?",
              "criteria": [
                "Cosmetic: appearance only, no lost functionality.",
                "Workaround available: a task fails, but another way works.",
                "Fully blocked: a task fails with no workaround."
              ]
            }
          }
        }'
      ```


答案：

```json
{
  "type": "score",
  "score": 1.12,
  "legend": {
    "0": "Cosmetic: appearance only, no lost functionality.",
    "1": "Workaround available: a task fails, but another way works.",
    "2": "Fully blocked: a task fails with no workaround."
  },
  "probabilities": { "0": 0.03, "1": 0.83, "2": 0.15 },
  "confidence": 0.83
}
```

由於不同的機率分布可能產生相同的期望值（此處為 1.12，略高於等級 1），當輸入可能橫跨多個等級時，請連同分數一併檢查各等級的機率與信心水準。

你可以用分數依評分標準門檻對輸入排序，或篩選候選結果。當程式碼需要一個離散等級時，請選取機率最高的項目：

```python
level = max(answer.probabilities, key=answer.probabilities.get)  # "1"
print(answer.legend[level])  # "Workaround available: ..."
```

若要比較等級數量不同的量表，請將分數除以最高等級索引，將其正規化到 0 與 1 之間。

## Ask multiple questions {#multiple-questions}

將針對同一輸入的獨立問題放在同一個要求中。無論你提出多少問題，共用輸入在每個要求中只計算一次（每個問題只增加其自身的指令與判準），而且問題類型可以混合使用。這個範例利用訂單資料與顧客訊息來路由支援工單。


=== "Python"

      ```python
      import json
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      order = {"order": {"id": "8821", "item": "headphones", "price_usd": 240}, "tier": "Gold"}
      message = {"message": "Audio cuts out on the left earcup. Fix it today or I cancel my membership."}

      result = client.decisions.create(
          model="gemini-decision-1",
          input=[
              {"type": "text", "text": json.dumps(order) + "\n"},
              {"type": "text", "text": json.dumps(message)},
          ],
          questions={
              "is_defect": {
                  "type": "noul",
                  "instructions": "Does `message` describe a hardware defect?",
              },
              "next_action": {
                  "type": "choice",
                  "instructions": "What is the right resolution given `tier` and `order`?",
                  "criteria": {
                      "instant_refund": "Refund without return. Low value or clear fault.",
                      "replacement_shipment": "Ship a replacement. Customer returns the original.",
                      "troubleshooting_flow": "The issue may be fixable by the customer.",
                      "human_escalation": "",
                  },
              },
              "churn_risk": {
                  "type": "score",
                  "instructions": "How likely is the customer to churn if the issue is not resolved now?",
                  "criteria": [
                      "No churn signal",
                      "Mild frustration",
                      "Mentions alternatives",
                      "Threatens to cancel",
                  ],
              },
          },
      )

      a = result.answers
      if a["is_defect"].noul > 0.9 and a["next_action"].confidence > 0.6:
          action = a["next_action"].choice
      else:
          action = "human_escalation"

      print(action, a["churn_risk"].score)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ apiVersion: "v1beta" });

      const order = { order: { id: "8821", item: "headphones", price_usd: 240 }, tier: "Gold" };
      const message = { message: "Audio cuts out on the left earcup. Fix it today or I cancel my membership." };

      const result = await ai.decisions.create({
        model: "gemini-decision-1",
        input: [
          { type: "text", text: JSON.stringify(order) + "\n" },
          { type: "text", text: JSON.stringify(message) },
        ],
        questions: {
          is_defect: {
            type: "noul",
            instructions: "Does `message` describe a hardware defect?",
          },
          next_action: {
            type: "choice",
            instructions: "What is the right resolution given `tier` and `order`?",
            criteria: {
              instant_refund: "Refund without return. Low value or clear fault.",
              replacement_shipment: "Ship a replacement. Customer returns the original.",
              troubleshooting_flow: "The issue may be fixable by the customer.",
              human_escalation: "",
            },
          },
          churn_risk: {
            type: "score",
            instructions: "How likely is the customer to churn if the issue is not resolved now?",
            criteria: ["No churn signal", "Mild frustration", "Mentions alternatives", "Threatens to cancel"],
          },
        },
      });

      const { is_defect, next_action, churn_risk } = result.answers ?? {};
      let action = "human_escalation";
      if (
        is_defect?.type === "noul" && next_action?.type === "choice" &&
        (is_defect.noul ?? 0) > 0.9 && (next_action.confidence ?? 0) > 0.6
      ) {
        action = next_action.choice ?? action;
      }
      console.log(action, churn_risk?.type === "score" ? churn_risk.score : undefined);
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/decisions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-decision-1",
          "input": [
            { "type": "text", "text": "{\"order\": {\"id\": \"8821\", \"item\": \"headphones\", \"price_usd\": 240}, \"tier\": \"Gold\"}\n" },
            { "type": "text", "text": "{\"message\": \"Audio cuts out on the left earcup. Fix it today or I cancel my membership.\"}" }
          ],
          "questions": {
            "is_defect": {
              "type": "noul",
              "instructions": "Does `message` describe a hardware defect?"
            },
            "next_action": {
              "type": "choice",
              "instructions": "What is the right resolution given `tier` and `order`?",
              "criteria": {
                "instant_refund": "Refund without return. Low value or clear fault.",
                "replacement_shipment": "Ship a replacement. Customer returns the original.",
                "troubleshooting_flow": "The issue may be fixable by the customer.",
                "human_escalation": ""
              }
            },
            "churn_risk": {
              "type": "score",
              "instructions": "How likely is the customer to churn if the issue is not resolved now?",
              "criteria": ["No churn signal", "Mild frustration", "Mentions alternatives", "Threatens to cancel"]
            }
          }
        }'
      ```


回應：

```json
{
  "answers": {
    "is_defect": { "type": "noul", "noul": 0.94, "confidence": 0.94 },
    "next_action": {
      "type": "choice",
      "choice": "human_escalation",
      "probabilities": {
        "human_escalation": 0.76,
        "replacement_shipment": 0.18,
        "troubleshooting_flow": 0.04,
        "instant_refund": 0.02
      },
      "confidence": 0.76
    },
    "churn_risk": {
      "type": "score",
      "score": 2.99,
      "legend": {
        "0": "No churn signal",
        "1": "Mild frustration",
        "2": "Mentions alternatives",
        "3": "Threatens to cancel"
      },
      "probabilities": { "0": 0.0, "1": 0.0, "2": 0.01, "3": 0.99 },
      "confidence": 0.99
    }
  },
  "usage": {
    "total_input_tokens": 324,
    "input_tokens_by_modality": [{ "modality": "text", "tokens": 324 }],
    "total_output_tokens": 0,
    "total_tokens": 324
  }
}
```

有些決策取決於另一個決策，例如只有在物品損壞時才挑選維修類別。你可以在讀取第一個答案後再送出第二個要求，或是在同一個要求中同時提出兩個問題，再忽略不需要的答案即可。

## Answers, probabilities, and confidence {#confidence}

每個答案都包含經校準的機率與信心分數：

*   **最佳數值：** 二元問題中「是」的機率、選擇題中最可能的選項，或評分題中經機率加權的期望等級。
*   **機率：** 在選擇題與評分題答案中，是所有選項或等級的經校準機率對應表（總和為 1）。對於是非題答案，「否」的機率為 1 減去「是」的機率。
*   **信心水準：** 最佳答案正確的估計機率（從 0 到 1）。其值等於最佳結果的機率；對於是非題，則為 `max(noul, 1 - noul)`。

使用答案數值來挑選行動，並以信心水準決定是否自動執行：

```python
answer = result.answers["department"]
if answer.confidence >= 0.7:
    route_to(answer.choice)
else:
    route_to("human_review")
```


!!! note " "

      請使用來自你自身流量的已標記範例來設定門檻。權衡誤判為正與誤判為負的成本。


## Input {#input}

input 欄位接受文字、圖片、音訊、影片與 PDF 文件區塊，使用與
[Interactions API](/docs/interactions-overview/) 相同的內容區塊結構描述（不支援 tool-call、tool-result 與 thought 區塊）：

```none
Input   = string | Content | Content[]
Content = TextContent | ImageContent | AudioContent | VideoContent | DocumentContent
```

| 區塊 | 欄位 | 支援的 MIME 類型 |
| :--- | :--- | :--- |
| `text` | `text` | n/a |
| `image` | `data` 或 `uri`、`mime_type`、選填的 `resolution` | `image/png`, `image/jpeg`, `image/webp`, `image/heic`, `image/heif`, `image/gif`, `image/bmp`, `image/tiff` |
| `audio` | `data` or `uri`, `mime_type` | `audio/wav`, `audio/mp3`, `audio/mpeg`, `audio/aiff`, `audio/aac`, `audio/ogg`, `audio/flac`, `audio/m4a`, `audio/opus`, `audio/webm`, `audio/l16`, `audio/alaw`, `audio/mulaw` |
| `video` | `data` 或 `uri`、`mime_type`、選填的 `resolution` | `video/mp4`, `video/mpeg`, `video/mov`, `video/avi`, `video/webm`, `video/wmv`, `video/x-flv`, `video/3gpp` |
| `document` | `data` or `uri`, `mime_type` | `application/pdf` |

*   行內資料接受 base64 編碼的位元組（每個要求上限 100 MB，PDF 為 50 MB）。
*   URI 輸入接受 [Files API](/docs/files/) URI（`file.uri`）以及公開或已簽署的 HTTPS URL（每個外部 URL 上限 15 MB）。
*   請務必將 MIME 類型設定為真實的檔案格式。API 會拒絕通用的 octet-stream 類型，以及與區塊類型不符的內容。
*   API 會依序串連 `input` 與 `instructions` 中相鄰的文字區塊，且不加入分隔符。請在區塊之間自行加入空格或換行（`\n`）。
*   輸入不可為空。

### Structured data {#structured-data}

將 JSON 物件與陣列序列化為字串，並以文字形式傳入，這樣酬載內的鍵就會保持為純資料，而不是內容區塊。在問題指令中，請以鍵路徑參照 JSON 欄位：

```python
state = json.dumps({"customer": {"tier": "Gold"}, "order": {"id": "8821", "age_days": 14}})
```

### Documents (PDF) {#documents}

以行內 base64 位元組傳入上限 50 MB 的 PDF。對於較大或可重複使用的檔案，請使用 [Files API](/docs/files/) 上傳。模型會一併讀取文字、表格、圖表與頁面版面配置。這個範例檢查發票 PDF 是否含有採購訂單編號，並將其路由到費用類別：


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      with open("invoice.pdf", "rb") as f:
          pdf_b64 = base64.b64encode(f.read()).decode("utf-8")

      result = client.decisions.create(
          model="gemini-decision-1",
          input=[
              {
                  "type": "document",
                  "data": pdf_b64,
                  "mime_type": "application/pdf",
              },
          ],
          questions={
              "has_po_number": {
                  "type": "noul",
                  "instructions": "Does the invoice include a purchase order (PO) number?",
              },
              "expense_category": {
                  "type": "choice",
                  "instructions": "Which expense category fits this invoice?",
                  "criteria": {
                      "cloud_infrastructure": "Servers, GPU compute, hosting, or storage.",
                      "software_licenses": "SaaS subscriptions or seat licenses.",
                      "travel": "Flights, hotels, meals, or ground transport.",
                      "other": "Anything outside these categories.",
                  },
              },
          },
      )

      po = result.answers["has_po_number"]
      category = result.answers["expense_category"]
      print(po.noul, category.choice, category.confidence)
      ```

=== "JavaScript"

      ```javascript
      import { readFileSync } from "node:fs";
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ apiVersion: "v1beta" });
      const pdfB64 = readFileSync("invoice.pdf").toString("base64");

      const result = await ai.decisions.create({
        model: "gemini-decision-1",
        input: [
          {
            type: "document",
            data: pdfB64,
            mime_type: "application/pdf",
          },
        ],
        questions: {
          has_po_number: {
            type: "noul",
            instructions: "Does the invoice include a purchase order (PO) number?",
          },
          expense_category: {
            type: "choice",
            instructions: "Which expense category fits this invoice?",
            criteria: {
              cloud_infrastructure: "Servers, GPU compute, hosting, or storage.",
              software_licenses: "SaaS subscriptions or seat licenses.",
              travel: "Flights, hotels, meals, or ground transport.",
              other: "Anything outside these categories.",
            },
          },
        },
      });

      const po = result.answers?.has_po_number;
      const category = result.answers?.expense_category;
      if (po?.type === "noul" && category?.type === "choice") {
        console.log(po.noul, category.choice, category.confidence);
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/decisions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-decision-1",
          "input": [
            { "type": "document", "data": "<BASE64_PDF_DATA>", "mime_type": "application/pdf" }
          ],
          "questions": {
            "has_po_number": {
              "type": "noul",
              "instructions": "Does the invoice include a purchase order (PO) number?"
            },
            "expense_category": {
              "type": "choice",
              "instructions": "Which expense category fits this invoice?",
              "criteria": {
                "cloud_infrastructure": "Servers, GPU compute, hosting, or storage.",
                "software_licenses": "SaaS subscriptions or seat licenses.",
                "travel": "Flights, hotels, meals, or ground transport.",
                "other": "Anything outside these categories."
              }
            }
          }
        }'
      ```


### Images {#media}

將本機圖片位元組以 base64 傳入，或傳入 URI，並設定解析度，在視覺細節與權杖成本之間取捨。這個範例檢查產品照片是否有損壞：


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      with open("earcup.jpg", "rb") as f:
          image_b64 = base64.b64encode(f.read()).decode("utf-8")

      result = client.decisions.create(
          model="gemini-decision-1",
          input=[
              {"type": "text", "text": "Customer photo for return request #8821."},
              {
                  "type": "image",
                  "data": image_b64,
                  "mime_type": "image/jpeg",
                  "resolution": "low",  # Supported values: "low", "medium", "high", "ultra_high"
              },
          ],
          questions={
              "visible_damage": {
                  "type": "noul",
                  "instructions": "Does the photo show physical damage to the device? Ignore the packaging.",
              },
          },
      )

      print(result.answers["visible_damage"].noul)
      ```

=== "JavaScript"

      ```javascript
      import { readFileSync } from "node:fs";
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ apiVersion: "v1beta" });
      const imageB64 = readFileSync("earcup.jpg").toString("base64");

      const result = await ai.decisions.create({
        model: "gemini-decision-1",
        input: [
          { type: "text", text: "Customer photo for return request #8821." },
          {
            type: "image",
            data: imageB64,
            mime_type: "image/jpeg",
            resolution: "low", // Supported values: "low", "medium", "high", "ultra_high"
          },
        ],
        questions: {
          visible_damage: {
            type: "noul",
            instructions: "Does the photo show physical damage to the device? Ignore the packaging.",
          },
        },
      });

      const answer = result.answers?.visible_damage;
      if (answer?.type === "noul") console.log(answer.noul);
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/decisions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-decision-1",
          "input": [
            { "type": "text", "text": "Customer photo for return request #8821." },
            { "type": "image", "data": "<BASE64_IMAGE_DATA>", "mime_type": "image/jpeg", "resolution": "low" }
          ],
          "questions": {
            "visible_damage": {
              "type": "noul",
              "instructions": "Does the photo show physical damage to the device? Ignore the packaging."
            }
          }
        }'
      ```


### Audio {#audio}

傳入公開或已簽署的 HTTPS URL、使用 [Files API](/docs/files/) 上傳本機錄音，或送出行內 base64 位元組。模型無需額外的轉錄步驟，即可評估說話內容、節奏與語調，因此適合用於通話分流、品質保證與語音評估。

這個範例檢查一段演講錄音的主題，並為講者的表現評分：


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      result = client.decisions.create(
          model="gemini-decision-1",
          input=[
              {
                  "type": "audio",
                  "uri": "https://storage.googleapis.com/generativeai-downloads/audio/rehearsing.wav",
                  "mime_type": "audio/wav",
              },
          ],
          questions={
              "mentions_launch": {
                  "type": "noul",
                  "instructions": "Is the speaker talking about a product campaign launch?",
              },
              "delivery": {
                  "type": "score",
                  "instructions": "How fluent and prepared does the speaker sound?",
                  "criteria": [
                      "Hesitant, searching for notes, or self-correcting.",
                      "Mostly steady with minor pauses.",
                      "Polished, fluent, and confident throughout.",
                  ],
              },
          },
      )

      print(result.answers["mentions_launch"].noul, result.answers["delivery"].score)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ apiVersion: "v1beta" });

      const result = await ai.decisions.create({
        model: "gemini-decision-1",
        input: [
          {
            type: "audio",
            uri: "https://storage.googleapis.com/generativeai-downloads/audio/rehearsing.wav",
            mime_type: "audio/wav",
          },
        ],
        questions: {
          mentions_launch: {
            type: "noul",
            instructions: "Is the speaker talking about a product campaign launch?",
          },
          delivery: {
            type: "score",
            instructions: "How fluent and prepared does the speaker sound?",
            criteria: [
              "Hesitant, searching for notes, or self-correcting.",
              "Mostly steady with minor pauses.",
              "Polished, fluent, and confident throughout.",
            ],
          },
        },
      });

      const launch = result.answers?.mentions_launch;
      const delivery = result.answers?.delivery;
      if (launch?.type === "noul" && delivery?.type === "score") {
        console.log(launch.noul, delivery.score);
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/decisions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-decision-1",
          "input": [
            {
              "type": "audio",
              "uri": "https://storage.googleapis.com/generativeai-downloads/audio/rehearsing.wav",
              "mime_type": "audio/wav"
            }
          ],
          "questions": {
            "mentions_launch": {
              "type": "noul",
              "instructions": "Is the speaker talking about a product campaign launch?"
            },
            "delivery": {
              "type": "score",
              "instructions": "How fluent and prepared does the speaker sound?",
              "criteria": [
                "Hesitant, searching for notes, or self-correcting.",
                "Mostly steady with minor pauses.",
                "Polished, fluent, and confident throughout."
              ]
            }
          }
        }'
      ```


對於大於 15 MB 的本機檔案或錄音，請使用 [Files API](/docs/files/) 上傳一次，再傳入回傳的 URI（相同模式也適用於 PDF、圖片與影片）：

```python
uploaded = client.files.upload(file="support_call.wav")
audio_block = {"type": "audio", "uri": uploaded.uri, "mime_type": uploaded.mime_type}
```

### Video {#video}

透過 [Files API](/docs/files/)、公開或已簽署的 HTTPS URL，或行內 base64 位元組傳入影片。當不需要精細的視覺細節時，請將解析度設為 low。

這個範例以低解析度檢查一段 MP4 影片片段：


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      result = client.decisions.create(
          model="gemini-decision-1",
          input=[
              {
                  "type": "video",
                  "uri": "https://storage.googleapis.com/generativeai-downloads/videos/ForBiggerBlazes.mp4",
                  "mime_type": "video/mp4",
                  "resolution": "low",
              },
          ],
          questions={
              "shows_fire": {
                  "type": "noul",
                  "instructions": "Does the video show fire or flames?",
              },
          },
      )

      print(result.answers["shows_fire"].noul)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ apiVersion: "v1beta" });

      const result = await ai.decisions.create({
        model: "gemini-decision-1",
        input: [
          {
            type: "video",
            uri: "https://storage.googleapis.com/generativeai-downloads/videos/ForBiggerBlazes.mp4",
            mime_type: "video/mp4",
            resolution: "low",
          },
        ],
        questions: {
          shows_fire: {
            type: "noul",
            instructions: "Does the video show fire or flames?",
          },
        },
      });

      const answer = result.answers?.shows_fire;
      if (answer?.type === "noul") console.log(answer.noul);
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/decisions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-decision-1",
          "input": [
            {
              "type": "video",
              "uri": "https://storage.googleapis.com/generativeai-downloads/videos/ForBiggerBlazes.mp4",
              "mime_type": "video/mp4",
              "resolution": "low"
            }
          ],
          "questions": {
            "shows_fire": {
              "type": "noul",
              "instructions": "Does the video show fire or flames?"
            }
          }
        }'
      ```


### Media resolution {#media-resolution}

在圖片與影片區塊上設定[媒體解析度](/docs/media-resolution/)（low、medium、high 或 ultra_high），以控制權杖成本與視覺細節。超高解析度僅適用於圖片；音訊與文件區塊不使用解析度設定。

## Best practices {#best-practices}

*   讓每個問題都聚焦於單一決策或評分標準。當判準明確時，複雜的評分標準可以在一個問題中處理；或者，你也可以將獨立檢查拆成同一個要求中的多個問題，再在程式碼中組合答案。
*   在指令中寫出完整的問題。模型永遠看不到問題鍵或你的變數名稱。
*   為每個選擇選項與評分等級提供簡短說明。讓相鄰的評分等級有清楚區別，並保持評分量表為線性。由於分數是陣列索引（0、1、2 等）的平均值，像 1、10、100、1000 這類指數型量表會扭曲期望值。
*   預先規劃不符合任何選擇選項的輸入。在依據最佳選項行動前先檢查信心水準，或將選擇題與是非題範圍檢查搭配使用，例如「這則訊息是否與訂單有關？」。若你加入萬用選項，請使用 "other" 這類非位置型鍵，而不是 "none_of_the_above"，因為 API 會依字母順序排序選項鍵。
*   優先使用正向表述。詢問「等級是否為 Gold？」，並在程式碼中以 1 減去「是」的機率，而不是詢問「等級是否不是 Gold？」這類否定問題。
*   只送出問題所需的欄位。無關內容會降低準確度。
*   在程式碼中比較數字、日期與時間長度，再將結果或具名分組傳入輸入中。
*   將輸入視為不可信任。使用者提供的文字可能為自身的分類辯護。請寫出明確的判準、以對抗性範例測試，並對付款等高風險行動保留人工或第二道檢查。

## Decisions API or structured output {#when-to-use}

當你需要在封閉式結果上取得經校準的機率時，請使用 Decisions API：

*   將要求路由到模型、佇列、代理或工具。
*   一次針對多條政策規則檢查輸入與輸出。
*   決定代理需要哪些工具，或是否應壓縮、升級或停止。
*   依據評分標準篩選、評分或排序候選結果。
*   即時回應 UI 狀態、音訊或影片畫面。

| 當你需要以下功能時，使用 Decisions API | 當你需要以下功能時，使用 [Interactions API](/docs/interactions-overview/) |
| :--- | :--- |
| 是非題機率、從固定集合中選出一個選項，或在固定量表上評分 | 生成的文字、摘要或說明 |
| 可設定門檻的經校準機率 | 遵循你自訂 JSON 結構描述的擷取值或物件（參見 [Structured outputs](/docs/structured-output/)） |
| 在一次呼叫中針對同一輸入進行多項獨立檢查 | 帶有引數的工具呼叫 |
| 低延遲且零輸出權杖成本 | 多步驟推理 |

## Request and response reference {#request}

| 欄位 | 類型 | 必填 | 說明 |
| :--- | :--- | :--- | :--- |
| `model` | string | yes | 模型 ID：`gemini-decision-1`。參見 [Gemini Decision 1](/docs/models/gemini-decision-1/)。 |
| `input` | string, `Content`, or `Content[]` | yes | 所有問題的共用上下文（文字、圖片、音訊、影片或 PDF 文件）。參見 [Input](/docs/decisions-api/#input)。 |
| `questions` | map of string to `Question` | yes | 1 至 1,000 個問題。鍵由你自行選擇（`[A-Za-z0-9_-]+`，上限 64 個字元）。答案會以相同的鍵回傳。 |

每個問題都有：

| 欄位 | 類型 | 必填 | 說明 |
| :--- | :--- | :--- | :--- |
| `type` | `noul`, `choice`, or `score` | yes | 問題類型。 |
| `instructions` | string, `TextContent`, or `TextContent[]` | yes | 要針對輸入評估的問題。僅限文字。 |
| `criteria` | depends on type | choice and score: yes. noul: no. | 可能的答案。參見 [Question types](/docs/decisions-api/#question-types)。 |

API 會針對共用輸入獨立評估每個問題。問題之間彼此看不到對方，新增或移除一個問題不會改變其他答案。模型永遠看不到問題鍵，因此請在 instructions 欄位中寫出完整的問題。

回應包含：

| 欄位 | 類型 | 說明 |
| :--- | :--- | :--- |
| `answers` | map of string to `Answer` | 每個問題一個答案，使用與 `questions` 相同的鍵。每個答案的類型都與其問題相符。 |
| `usage` | `Usage` | 依模態區分的輸入權杖數量（文字、圖片與音訊，其中影片畫面與 PDF 頁面圖片計為圖片權杖），以及 0 個輸出權杖。僅輸入權杖計費；參見 [Pricing](/docs/pricing/#gemini-decision)。 |

當輸入安全篩選器封鎖要求時，API 會回傳 HTTP
`400 Bad Request` 錯誤，而不是 `answers`。JSON `error` 物件包含
`message` 與 `code`（`safety`、`prohibited_content`、`blocklist`、
`image_safety` 或 `content_blocked`）：

```json
{
  "error": {
    "code": "safety",
    "message": "Request blocked due to safety violations (harmful content). Please modify your input and retry."
  }
}
```

## Limits {#limits}

| 限制 | 值 |
| :--- | :--- |
| 每個要求的問題數 | 1 至 1,000（受 262,144 個權杖的上下文視窗限制） |
| 每個選擇題的選項數 | 2 至 255 |
| 每個評分題的等級數 | 2 至 255 個非空字串（多數評分標準建議 2 至 10 個） |
| 問題鍵 | 1 至 64 個 ASCII 字元，符合 `[A-Za-z0-9_-]+` |
| 選項鍵 | 1 至 128 個字元（上限 512 個 UTF-8 位元組）。允許內部 ASCII 空格。不允許開頭或結尾空格、控制字元與非 ASCII 空格。 |
| 上下文視窗 | 共用輸入與所有問題合計 262,144 個權杖 |
| JSON 巢狀深度 | 100 層 |
| 每個要求的媒體數 | 與 [Interactions API](/docs/interactions-overview/) 相同 |
| 問題指令 | 僅限文字 |

當要求超過限制或未通過鍵驗證時，API 會回傳 HTTP 400，並附上指出你所超過規則的錯誤訊息。

## Limitations {#limitations}

*   僅在 Gemini Developer API（v1beta）上搭配
    [Gemini Decision 1](/docs/models/gemini-decision-1/) 提供。
*   問題指令僅接受文字。不支援在問題中放入媒體。
*   Decisions API 不支援 YouTube URL 或直接的 Cloud Storage
    （`gs://`）URI。請使用 [Files API](/docs/files/) URI、公開或已簽署的 HTTPS URL，或行內 base64 位元組傳入媒體。
*   不支援將對話記錄、thought 與 tool-call 區塊作為輸入區塊。請將多輪上下文序列化為文字。
*   Decisions API 不支援上下文快取、
    [Batch API](/docs/batch-api/)，以及 Flex 或 Priority 推論。跨要求重複的輸入會完整計算。

## What's next {#whats-next}

*   在 [Decisions Playground](https://aistudio.google.com/apps/f6cbef57-8bad-443a-813f-4d4c8f9750af?fullscreenApplet=true) 中，以自訂文字與媒體互動測試是非題、選擇題與評分題，
    然後匯出可執行的程式碼。
*   探索在 Google AI Studio 中以 Gemini Decision 1 建構的範例應用程式，
    包括 [Doorstep Parcels](https://aistudio.google.com/apps/bdca3fee-8d0a-4663-b30e-73828a55c1e8?fullscreenApplet=true)
    與 [Find the Zookeeper](https://aistudio.google.com/apps/b86d2f3b-c1d4-4d44-9198-5303a0cb65c1?fullscreenApplet=true)。
*   在
    [Gemini Decision 1](/docs/models/gemini-decision-1/) 模型頁面查看模型規格，以及
    [Pricing](/docs/pricing/#gemini-decision) 與
    [Rate limits](/docs/rate-limits/#gemini-decision)。
*   在 Gemini API 上以 [Managed agents](/docs/agents/) 建構自主工作流程。
