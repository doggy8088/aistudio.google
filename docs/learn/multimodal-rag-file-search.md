# 運用 Gemini API File Search 工具的多模態 RAG

一份開發者指南，說明如何建立 Store、上傳文件與圖片、以接地生成進行查詢，以及擷取圖片引用。

作者：[Patrick Loeber](https://x.com/patloeber)

## 什麼是 File Search？

File Search 是 Gemini API 內建的 RAG 工具。當你上傳文件時，API 會處理繁重的工作：分塊、嵌入、建立索引與檢索。在查詢時，將 `file_search` 工具連同你的提示詞一起傳入，模型會自動從你的資料中檢索相關的區塊，產生接地的回應。

### 與自行打造 RAG 管線相比，File Search 提供

#### 完全託管

#### 具成本效益

#### 內建引用

#### 原生圖片搜尋

## 步驟 1：建立 File Search Store

File Search Store 是存放文件嵌入向量的持久容器。可以把它想成一個以專案為範圍的託管向量資料庫。若要對圖片啟用多模態搜尋，請將 **gemini-embedding-2** 指定為嵌入模型。這個參數是選用的；若省略，Store 會預設使用 gemini-embedding-001，這是針對純文字工作負載進行成本最佳化的模型。若要使用新功能，請務必安裝最新版 Python SDK：`pip install -U google-genai`。

```
from google import genai
from google.genai import types

client = genai.Client()

# Create a multimodal store with gemini-embedding-2
# Omit embedding_model to use the default text-only model
file_search_store = client.file_search_stores.create(
    config={
        "display_name": "product-catalog",
        "embedding_model": "models/gemini-embedding-2"
    }
)
print(f"Created store: {file_search_store.name}")
```

## 步驟 2：上傳文件與圖片

最簡單的路徑是 `upload_to_file_search_store` 方法，它能在一個步驟中上傳並索引檔案。搭配 gemini-embedding-2，文件和圖片都適用。

| 嵌入模型 | 最適合 |
| --- | --- |
| `gemini-embedding-001`（預設） | 文字密集的工作負載，成本最佳化 |
| `gemini-embedding-2` | 多模態檢索（文件與圖片） |

```
import time

# Upload a PDF document
operation = client.file_search_stores.upload_to_file_search_store(
    file_search_store_name=file_search_store.name,
    file="product_catalog.pdf",
    config={"display_name": "Product Catalog"}
)

# Wait for ingestion to complete
while not operation.done:
    time.sleep(5)
    operation = client.operations.get(operation)

# Upload product images directly
for image_file in ["sneaker_red.png", "sneaker_blue.jpeg", "sneaker_white.png"]:
    op = client.file_search_stores.upload_to_file_search_store(
        file_search_store_name=file_search_store.name,
        file=image_file,
        config={"display_name": image_file}
    )
    while not op.done:
        time.sleep(5)
        op = client.operations.get(op)

print("All files indexed!")
```

## 步驟 3：使用 File Search 查詢

透過將 `file_search` 工具傳入 `generate_content` 來查詢你的資料。系統會執行檔案搜尋，從 Store 中找出最相似且最相關的區塊，並用它們產生接地的回應。

```
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Which sneakers come in red?",
    config={
        "tools": [{
            "file_search": {
                "file_search_store_names": [file_search_store.name]
            }
        }]
    }
)

print(response.text)
```

## 步驟 4：檢視引用並擷取圖片

每個 File Search 回應都包含 **接地中繼資料**——本質上是模型答案的參考書目。它記錄了索引資訊的頁碼，讓應用程式能直接把使用者指向文件中正確的位置。在多模態 Store 中，引用可以包含所引用圖片的 `media_id`，可直接下載。

```
grounding = response.candidates[0].grounding_metadata

for chunk in grounding.grounding_chunks:
    ctx = chunk.retrieved_context
    if ctx.media_id:
        # This is an image citation — download it
        print(f"Cited image: {ctx.title}")
        blob = client.file_search_stores.download_media(
            media_id=ctx.media_id
        )
        with open(f"cited_{ctx.title}.png", "wb") as f:
            f.write(blob)
    else:
        # Text citation with exact page number
        print(f"Cited text: {ctx.title}")
        if ctx.page_number:
            print(f"   Page: {ctx.page_number}")
```

## 自訂中繼資料與篩選

你可以在上傳時為文件附加中繼資料，並在查詢時用它來篩選。當一個 Store 包含多樣的文件、且搜尋需要限定範圍時，這是不可或缺的功能。

```
# Upload with metadata
op = client.file_search_stores.upload_to_file_search_store(
    file_search_store_name=file_search_store.name,
    file="shoes_collection.pdf",
    config={
        "display_name": "Spring 2026 Shoes",
        "custom_metadata": [
            {"key": "category", "string_value": "footwear"},
            {"key": "season", "string_value": "spring-2026"},
            {"key": "price_tier", "numeric_value": 2}
        ]
    }
)

# Query with a metadata filter
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Do you have blue spring shoes?",
    config={
        "tools": [{
            "file_search": {
                "file_search_store_names": [file_search_store.name],
                "metadata_filter": 'category="footwear" AND season="spring-2026"',
            }
        }]
    }
)
```

## 結構化輸出

從 Gemini 3 模型開始，File Search 可以與 **結構化輸出** 結合。這非常適合從接地的回應中萃取結構化資料。

```
from pydantic import BaseModel, Field

class ProductMatch(BaseModel):
    name: str = Field(description="Product name")
    description: str = Field(description="Brief product description")
    confidence: str = Field(description="How confident the match is")

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Find products similar to a red running shoe",
    config={
        "tools": [{"file_search": {"file_search_store_names": [file_search_store.name]}}],
        "response_mime_type": "application/json",
        "response_schema": ProductMatch.model_json_schema()
    }
)
```

## 使用案例

有了多模態檢索，File Search 開啟了純文字 RAG 無法處理的場景：**視覺化產品搜尋**：以圖片與規格表為目錄建立索引，然後以視覺相似度或自然語言描述搜尋。**研究與技術文件**：從論文與報告中擷取特定的圖表、架構圖或資料視覺化。**保險與理賠處理**：結合結構化表單與損壞照片，進行統一的文件與視覺評估。**設計系統**：讓元件庫可以依視覺外觀搜尋，而不只是命名慣例。**房地產與物件刊登**：根據平面圖、室內照片與視覺偏好來媒合物件。
