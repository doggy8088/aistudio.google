# Gemini Decision 1

Gemini Decision 1 是專為 [Decisions API](/docs/decisions-api/) 打造的專用多模態模型。它只需單次預填，即可評估文字、圖片、影片、音訊與 PDF 上的具型別問題，並回傳經校準的結果機率，輸出權杖為零。

Gemini Decision 1 適用於要求分流、同時對多條規則進行政策檢查、依評分標準為候選項目評分、工具選擇，以及對即時媒體串流進行低延遲分類。單一要求最多可評估 1,000 個獨立問題，共享輸入上限為 262,144 個權杖：

*   **是／否**：回傳 0.01 至 0.99 之間的校準機率與信心分數。
*   **單選**：評估 2 至 255 個選項，回傳最佳選項、各選項機率與信心分數。
*   **評分標準評級**：評估 2 至 255 個有序的評分等級，回傳以機率加權的期望分數、各等級機率與信心分數。

[查看文件](/docs/decisions-api/)

## 快速入門 {#quickstart}

在單次呼叫中，針對同一則顧客訊息同時評估是／否問題與分流選擇：


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
              "queue": {
                  "type": "choice",
                  "instructions": "Which support queue should handle this message?",
                  "criteria": {
                      "billing": "Payment, invoice, or refund questions.",
                      "replacements": "Damaged, missing, or wrong items.",
                      "general": "Product questions and account updates.",
                  },
              },
          },
      )

      damaged = result.answers["is_damaged"]
      queue = result.answers["queue"]
      print(f"P(damaged)={damaged.noul:.2f} queue={queue.choice}")
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
          queue: {
            type: "choice",
            instructions: "Which support queue should handle this message?",
            criteria: {
              billing: "Payment, invoice, or refund questions.",
              replacements: "Damaged, missing, or wrong items.",
              general: "Product questions and account updates.",
            },
          },
        },
      });

      const damaged = result.answers?.is_damaged;
      const queue = result.answers?.queue;
      if (damaged?.type === "noul" && queue?.type === "choice") {
        console.log(`P(damaged)=${damaged.noul} queue=${queue.choice}`);
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
            },
            "queue": {
              "type": "choice",
              "instructions": "Which support queue should handle this message?",
              "criteria": {
                "billing": "Payment, invoice, or refund questions.",
                "replacements": "Damaged, missing, or wrong items.",
                "general": "Product questions and account updates."
              }
            }
          }
        }'
      ```


## 文件 {#documentation}

要求架構、條件設計、多模態輸入與校準細節，請參閱 [Decisions API](/docs/decisions-api/) 指南。計費與配額層級請參閱[定價](/docs/pricing/#gemini-decision)與[速率限制](/docs/rate-limits/#gemini-decision)。

## 範例應用程式 {#sample-apps}

探索在 Google AI Studio 中以 Gemini Decision 1 打造的互動式範例應用程式：

*   [Decisions Playground](https://aistudio.google.com/apps/f6cbef57-8bad-443a-813f-4d4c8f9750af?fullscreenApplet=true):
    以互動方式在自訂文字與媒體輸入上，測試是／否、選擇與分數問題。
*   [Doorstep Parcels](https://aistudio.google.com/apps/bdca3fee-8d0a-4663-b30e-73828a55c1e8?fullscreenApplet=true):
    運用校準機率，分類配送照片中的包裹狀況與放置位置。
*   [Find the Zookeeper](https://aistudio.google.com/apps/b86d2f3b-c1d4-4d44-9198-5303a0cb65c1?fullscreenApplet=true):
    在單次處理中評估各場景候選的視覺屬性。

## gemini-decision-1 {#gemini-decision-1}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-decision-1` |
| 支援的資料類型 | **輸入** 文字、圖片、影片、音訊與 PDF **輸出** 校準機率（是／否、選擇與分數，輸出權杖為 0） |
| 權杖上限[[*]](/docs/tokens/) | **輸入權杖上限** 262,144 **輸出權杖上限** 0（每個要求最多 1,000 個問題） |
| 功能 | [**校準決策**](/docs/decisions-api/) 支援 **音訊生成** 不支援 **Batch API** 不支援 **快取** 不支援 **程式碼執行** 不支援 **電腦使用** 不支援 **File search** 不支援 **Flex 推論** 不支援 **函式呼叫** 不支援 **使用 Google Maps 接地** 不支援 **圖片生成** 不支援 **Live API** 不支援 **Priority 推論** 不支援 **搜尋接地** 不支援 **結構化輸出** 不支援 **文字生成** 不支援 **推理** 不支援 **URL 上下文** 不支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | `gemini-decision-1` |
| 最近更新 | 2026 年 11 月 |
| 速率限制 | [速率限制](/docs/rate-limits/#gemini-decision) |
| 定價 | [定價](/docs/pricing/#gemini-decision) |


