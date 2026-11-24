# Gemini 3.1 Flash-Lite

Gemini 3.1 Flash-Lite 是一款低延遲、具成本效益的多模態模型，針對高頻率、輕量任務最佳化。此模型支援文字、圖片、影片、音訊與 PDF 輸入，專為大量代理工作流程、簡單的資料擷取，以及以延遲與 API 成本為主要考量的應用程式而設計。

[在 Google AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-3.1-flash-lite)

## gemini-3.1-flash-lite {#gemini-31-flash-lite}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `gemini-3.1-flash-lite` |
| 支援的資料類型 | **輸入** 文字、圖片、影片、音訊與 PDF **輸出** 文字 |
| token 上限[[*]](/docs/tokens/) | **輸入 token 上限** 1,048,576 **輸出 token 上限** 65,536 |
| 功能 | [**語音生成**](/docs/speech-generation/) 不支援 [**程式碼執行**](/docs/code-execution/) 支援 [**電腦操作**](/docs/computer-use/) 不支援 [**上下文快取**](/docs/caching/) 支援 [**檔案搜尋**](/docs/file-search/) 支援 [**函式呼叫**](/docs/function-calling/) 支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 支援 [**使用 Google 搜尋接地**](/docs/google-search/) 支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 支援 [**思考**](/docs/thinking/) 支援 [**URL 上下文**](/docs/url-context/) 支援 |
| 使用選項 | [**Batch API**](/docs/batch-api/) 支援 [**Flex 推論**](/docs/flex-inference/) 支援 [**優先推論**](/docs/priority-inference/) 支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | `Stable: gemini-3.1-flash-lite` |
| 最近更新 | 2026 年 5 月 |
| 模型卡 | [模型卡](https://deepmind.google/models/model-cards/gemini-3-1-flash-lite/) |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-3.1-flash-lite/#pricing)。 |


## 定價 {#pricing}


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.25（文字 / 圖片 / 影片） $0.50（音訊） |
    | 輸出價格（含思考 token） | 免費 | $1.50 |
    | 上下文快取價格 | 不提供 | $0.025（文字 / 圖片 / 影片） $0.05（音訊） $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "批次"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.125（文字 / 圖片 / 影片） $0.25（音訊） |
    | 輸出價格（含思考 token） | 免費 | $0.75 |
    | 上下文快取價格 | 不提供 | $0.0125（文字 / 圖片 / 影片） $0.025（音訊） $0.50 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "彈性"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.125（文字 / 圖片 / 影片） $0.25（音訊） |
    | 輸出價格（含思考 token） | 免費 | $0.75 |
    | 上下文快取價格 | 不提供 | $0.0125（文字 / 圖片 / 影片） $0.025（音訊） $0.50 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "優先"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.45（文字 / 圖片 / 影片） $0.90（音訊） |
    | 輸出價格（含思考 token） | 免費 | $2.70 |
    | 上下文快取價格 | 不提供 | $0.045（文字 / 圖片 / 影片） $0.09（音訊） $1.80 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


* 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

\*\* 可在 Google AI Studio 中測試。



## 開發者指南 {#developer-guide}

Gemini 3.1 Flash-Lite 最擅長大規模處理直接明瞭的任務。以下是最適合 Gemini 3.1 Flash-Lite 的使用情境：

* **翻譯**：快速、便宜的大量翻譯，例如大規模處理聊天訊息、評論與支援票證。你可以使用系統指令，將輸出限制為僅包含翻譯後的文字、不附加額外說明：

  ```python
  from google import genai

  client = genai.Client()
  text = "Hey, are you down to grab some pizza later? I'm starving!"

  response = client.models.generate_content(
      model="gemini-3.1-flash-lite",
      config={
          "system_instruction": "Only output the translated text"
      },
      contents=f"Translate the following text to German: {text}"
  )

  print(response.text)
  ```

* **轉錄**：處理錄音、語音筆記或任何音訊內容，取得文字轉錄稿，無需另外架設語音轉文字管線。它支援多模態輸入，因此你可以直接傳入音訊檔案進行轉錄：

  ```python
  from google import genai

  client = genai.Client()

  uploaded_file = client.files.upload(file='sample.mp3')

  prompt = 'Generate a transcript of the audio.'

  response = client.models.generate_content(
    model="gemini-3.1-flash-lite",
    contents=[prompt, uploaded_file]
  )

  print(response.text)
  ```

* **輕量代理任務與資料擷取**：實體擷取、分類與輕量資料處理管線，並支援
  結構化 JSON 輸出。例如，從電子商務顧客評論中擷取結構化資料：

  ```python
  from google import genai
  from pydantic import BaseModel, Field

  client = genai.Client()

  prompt = "Analyze the user review and determine the aspect, sentiment score, summary quote, and return risk"
  input_text = "The boots look amazing and the leather is high quality, but they run way too small. I'm sending them back."

  class ReviewAnalysis(BaseModel):
      aspect: str = Field(description="The feature mentioned (e.g., Price, Comfort, Style, Shipping)")
      summary_quote: str = Field(description="The specific phrase from the review about this aspect")
      sentiment_score: int = Field(description="1 to 5 (1=worst, 5=best)")
      is_return_risk: bool = Field(description="True if the user mentions returning the item")

  response = client.models.generate_content(
      model="gemini-3.1-flash-lite",
      contents=[prompt, input_text],
      config={
          "response_mime_type": "application/json",
          "response_json_schema": ReviewAnalysis.model_json_schema(),
      },
  )

  print(response.text)
  ```

* **文件處理與摘要**：解析 PDF 並回傳精簡摘要，例如用於建置文件處理管線，或快速分類處理傳入的檔案：

  ```python
  from google import genai
  from google.genai import types
  import httpx

  client = genai.Client()

  doc_url = "https://storage.googleapis.com/generativeai-downloads/data/med_gemini.pdf"
  doc_data = httpx.get(doc_url).content

  prompt = "Summarize this document"
  response = client.models.generate_content(
      model="gemini-3.1-flash-lite",
      contents=[
          types.Part.from_bytes(
              data=doc_data,
              mime_type='application/pdf',
          ),
          prompt
      ]
  )

  print(response.text)
  ```

* **模型路由**：使用低延遲、低成本的模型作為分類器，依任務複雜度將查詢路由至適當的模型。這是正式環境中真實存在的模式：開放原始碼的 [Gemini CLI](https://geminicli.com/docs/core/#model-fallback) 即使用 Flash-Lite 分類任務複雜度，並據此路由至 Flash 或 Pro。

  ```python
  from google import genai

  client = genai.Client()

  FLASH_MODEL = 'flash'
  PRO_MODEL = 'pro'

  CLASSIFIER_SYSTEM_PROMPT = f"""
  You are a specialized Task Routing AI. Your sole function is to analyze the user's request and classify its complexity. Choose between `{FLASH_MODEL}` (SIMPLE) or `{PRO_MODEL}` (COMPLEX).

  1. `{FLASH_MODEL}`: A fast, efficient model for simple, well-defined tasks.
  2. `{PRO_MODEL}`: A powerful, advanced model for complex, open-ended, or multi-step tasks.

  A task is COMPLEX if it meets ONE OR MORE of the following criteria:

  1. High Operational Complexity (Est. 4+ Steps/Tool Calls)
  2. Strategic Planning and Conceptual Design
  3. High Ambiguity or Large Scope
  4. Deep Debugging and Root Cause Analysis

  A task is SIMPLE if it is highly specific, bounded, and has Low Operational Complexity (Est. 1-3 tool calls).
  """

  user_input = "I'm getting an error 'Cannot read property 'map' of undefined' when I click the save button. Can you fix it?"

  response_schema = {
    "type": "object",
    "properties": {
      "reasoning": {
        "type": "string",
        "description": "A brief, step-by-step explanation for the model choice, referencing the rubric."
      },
      "model_choice": {
        "type": "string",
        "enum": [FLASH_MODEL, PRO_MODEL]
      }
    },
    "required": ["reasoning", "model_choice"]
  }

  response = client.models.generate_content(
      model="gemini-3.1-flash-lite",
      contents=user_input,
      config={
          "system_instruction": CLASSIFIER_SYSTEM_PROMPT,
          "response_mime_type": "application/json",
          "response_json_schema": response_schema
      },
  )

  print(response.text)
  ```

* **思考**：對於能受惠於逐步推理的任務，可設定思考，讓模型在產生最終輸出之前投入額外運算進行內部推理，以獲得更好的準確度：

  ```python
  from google import genai
  from google.genai import types

  client = genai.Client()

  response = client.models.generate_content(
      model="gemini-3.1-flash-lite",
      contents="How does AI work?",
      config=types.GenerateContentConfig(
          thinking_config=types.ThinkingConfig(thinking_level="high")
      ),
  )

  print(response.text)
  ```
