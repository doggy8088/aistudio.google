# Gemini 的代理式影片理解：開發人員指南

了解代理式影片分析如何將權杖消耗量減少多達 88%、成本降低多達 66%，同時提升準確度。

![Patrick Loeber](https://www.gstatic.com/aistudio-static/editorial/authors/54f6334eb7a549668f54.jpg)

![Maarten Grootendorst](https://www.gstatic.com/aistudio-static/editorial/authors/mgrootendorst.jpg)

在多模態 LLM 中分析長篇影片，傳統上仰賴均勻取樣：以固定的靜態影格率（通常為 1 FPS）解碼整條時間軸，並將全部視覺資料填入上下文視窗。[**代理式影片理解**](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-agentic-video-in-gemini/) 以主動的伺服器端工具迴圈取代靜態解碼。模型不再預先載入整部影片，而是依需求檢視時間軸：搜尋轉錄稿、以自適應影格率擷取目標影格序列，並分離出關鍵音軌。相較於靜態（1 FPS）處理，主要優勢包括：每次要求的**權杖數量減少多達 88%**、長篇媒體的**分析成本降低多達 66%**、細粒度視覺推理任務的**準確度提高多達 7%**。

## 底層運作方式

![代理式影片理解的解說影片](https://ytimg.googleusercontent.com/vi/ytjgy30Cono/maxresdefault.jpg)

代理式影片理解以反覆的**思考 → 行動 → 觀察**迴圈取代預先擷取：**以參照方式傳遞**：API 不解碼整個檔案，而是傳遞指向影片的輕量指標。初始上下文只消耗影片的中繼資料（長度、容器格式與檔案 ID）。**思考（規劃）**：模型根據使用者的提示詞，判斷回答查詢需要哪些資訊，並決定要檢視哪些模態或時間戳記。**行動（目標式工具呼叫）**：模型發出內部的伺服器端工具呼叫，擷取特定的影片片段：**轉錄稿優先**：對於口語內容或一般性的定位，它會先讀取附時間戳記的語音轉錄稿，再決定是否需要檢視畫面。**時間縮放與自適應 FPS**：為了檢視視覺細節，它只載入相關的時間區間（例如第 14 到 16 秒），並調整影格率（例如快速動作使用 5–10 FPS，或以 0.1 FPS 略覽影片尋找相關資訊）。**音軌**：當聲音線索、音樂或說話者的語氣很重要時，它會直接擷取音訊串流。**觀察與綜合**：擷取出的片段會以觀察結果的形式回傳給模型。模型可以再進行一輪迴圈來精煉搜尋，或綜合出最終具接地依據的答案。

## 實際運作展示

## 開發人員指南：在 Gemini API 中使用代理式影片理解

我們最新的模型 Gemini 3.8 Flash、3.7 Flash、3.6 Flash 與 3.5 Flash-Lite 都支援代理式影片理解。傳送要求時，將 `processing` 設為 `"agentic"` 即可啟用。

```
import time
from google import genai

client = genai.Client()

# Upload a video 
video_file = client.files.upload(file="path/to/lecture.mp4")

while video_file.state.name == "PROCESSING":
    time.sleep(2)
    video_file = client.files.get(name=video_file.name)

# Use agentic video processing
interaction = client.interactions.create(
    model="gemini-3.8-flash",
    input=[
        {
            "type": "video",
            "uri": video_file.uri,
            "mime_type": video_file.mime_type,
            "processing": "agentic"
        },
        {"type": "text", "text": "What are the three main arguments presented?"}
    ]
)

print(interaction.output_text)
print(interaction.usage.total_tokens)
```

## 混合模式與多影片要求

你可以在同一個提示詞中，為每個媒體項目分別設定處理行為。這非常適合將一段長的參考錄影與一段短的查詢片段進行比較：

```
interaction = client.interactions.create(
    model="gemini-3.8-flash",
    input=[
        # 45-minute reference match: process agentically
        {
            "type": "video",
            "uri": full_match_file.uri,
            "mime_type": "video/mp4",
            "processing": "agentic",
        },
        # 10-second query clip: process statically
        {
            "type": "video",
            "uri": highlight_snippet_file.uri,
            "mime_type": "video/mp4",
            "processing": "static",
        },
        {
            "type": "text",
            "text": "Find the exact timestamp in the full recording where the highlight sequence occurred.",
        },
    ],
)

print(interaction.output_text)
```

## YouTube 影片支援

你也可以直接傳入可公開存取的 YouTube 網址，並搭配代理模式：

```
interaction = client.interactions.create(
    model="gemini-3.8-flash",
    input=[
        {
            "type": "video",
            "uri": "https://youtu.be/7Z5Vy9JBANs",
            "processing": "agentic"
        },
        {
            "type": "text",
            "text": "What are the 3 most important announcements in this keynote?",
        },
    ],
)

print(interaction.output_text)
```

## 在代理模式與靜態模式之間選擇

一般而言，**請先從代理模式開始**，尤其是要最佳化回應品質或權杖效率時。請根據素材長度與查詢的性質選擇處理模式：使用 `processing="agentic"` 的時機：**長影片（> 約 5 分鐘）**：講座、網路研討會、財報電話會議、體育賽事與廣播媒體檔案。**細粒度的時間任務**：精確定位時間戳記，或分析 1 FPS 會漏掉的快速動作。**語音與畫面分離**：主要可透過搜尋轉錄稿回答、再以目標式畫面檢視加以驗證的查詢。使用 `processing="static"` 的時機：**短影片片段（< 5 分鐘）**：對延遲敏感的短片段查詢，例如產品 GIF、UI 動畫，或需要整段影格級精確度的社群短片。

## 基準測試

在標準的影片分析基準測試中，代理式處理的表現優於靜態取樣：分析成本降低多達 66%、權杖消耗量減少多達 88%，同時準確度提高多達 7%。

![agentic-video__evals__1.png](https://www.gstatic.com/aistudio-static/editorial/agentic-video-understanding-with-gemini/9b30bb85.png)

## 權杖計費與定價

代理式影片理解要求的計費依循標準的基礎模型定價：**影片輸入權杖**：只針對執行期間實際產生的媒體權杖計費（輕量的初始參照，加上模型明確擷取的任何影格片段與音訊片段）。**思考與輸出權杖**：模型的推理步驟與工具呼叫，依標準的輸出與思考權杖費率計費。**上下文快取**：在多輪工作階段中載入的影片會觸發標準的隱含快取，並支援明確的快取執行個體。**Batch API 支援**：代理式影片處理可以搭配 [Gemini Batch API](https://ai.google.dev/gemini-api/docs/batch-api) 使用，費用為標準成本的 50%。

## 後續步驟

參閱 [Gemini API 影片理解文件](https://ai.google.dev/gemini-api/docs/video-understanding)。在[定價參考文件](https://ai.google.dev/gemini-api/docs/pricing)中查看標準與批次推論的級別。在 [Gemini 3.8 Flash 模型卡](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash) 中探索模型規格與功能。
