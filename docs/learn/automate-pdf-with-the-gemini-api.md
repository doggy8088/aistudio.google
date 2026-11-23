# 使用 Gemini API 自動處理 PDF

使用 Google GenAI SDK 擷取結構化 JSON、查詢圖表與表格，並處理最多 1,000 頁的 PDF。

## 捨棄脆弱的 OCR 流程

傳統 OCR 流程會把 PDF 壓平成純文字，並丟失版面配置的上下文。Gemini 以原生視覺讀取每一頁，在單一 API 呼叫中完整保留多欄文字、表格、圖表、圖解與註腳。

## 小型 PDF 直接內嵌傳送，大型檔案只需上傳一次

並非每次請求都需要使用 Files API。當 PDF 小於 20 MB 且只使用一次時，直接以位元組內嵌傳送，可省去一次上傳呼叫。PDF 在 20 MB 至 50 MB 之間（最多 1,000 頁），或需要在多輪對話中查詢同一檔案時，請使用 Files API。上傳的檔案會免費儲存 48 小時。

## 可預期的頁面 token 計費

Gemini 以圖像 token 計算每個 PDF 頁面（每頁 258 個 token），而非按字數計費。使用 Gemini 3 與更新的模型時，PDF 中已內嵌的文字不收取額外 token 費用，讓密集的申報文件與手冊處理起來依然經濟實惠。

```
from pathlib import Path
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

client = genai.Client()

class InvoiceData(BaseModel):
    vendor_name: str
    invoice_number: str
    total_amount: float
    line_items: list[str] = Field(description="Individual billed items")

# Pass single-call PDFs under 20 MB directly inline (no Files API needed)
pdf_bytes = Path("quarterly_invoice.pdf").read_bytes()

response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents=[
        types.Part.from_bytes(data=pdf_bytes, mime_type="application/pdf"),
        "Extract the invoice details and line items.",
    ],
    config={
        "response_mime_type": "application/json",
        "response_json_schema": InvoiceData.model_json_schema(),
    },
)
invoice = InvoiceData.model_validate_json(response.text)
print(invoice)
```

```
from google import genai
from pydantic import BaseModel, Field

client = genai.Client()

class InvoiceData(BaseModel):
    vendor_name: str
    invoice_number: str
    total_amount: float
    line_items: list[str] = Field(description="Individual billed items")

# Use the Files API for PDFs from 20 MB to 50 MB or multi-turn queries
pdf_file = client.files.upload(file="annual_vendor_invoices.pdf")

response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents=[
        pdf_file,
        "Extract the invoice details and line items.",
    ],
    config={
        "response_mime_type": "application/json",
        "response_json_schema": InvoiceData.model_json_schema(),
    },
)
invoice = InvoiceData.model_validate_json(response.text)
print(invoice)
```

## 使用 Gemini API 自動處理

### 取得 API 金鑰

### 以位元組內嵌傳送，或使用 Files API 上傳

### 定義 JSON 輸出結構描述

### 執行擷取並解析 JSON
