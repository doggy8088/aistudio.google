# 在 Google AI Studio 中使用 AI 摘要 YouTube 影片

貼上任何公開 YouTube 連結，即可立即取得重點摘要、章節分析，並針對完整影片提問。

閱讀時間 7 分鐘

## 看懂畫面內容，而不只是聽到什麼

僅靠字幕的工具會錯過所有沒有說出口的內容。由於 Gemini 會同時檢視影片影格與音軌，因此可以讀取簡報投影片、檢視終端機操作示範中的程式碼，並解說畫面上的圖解。對於冗長的演講、主題演講與網路研討會，Gemini 支援[代理式影片理解](https://ai.google.dev/gemini-api/docs/video-understanding#agentic-video-understanding)。模型不會一開始就以高解析度解碼每一個影格，而是先掃描時間軸，再只針對相關時刻動態放大檢視高解析度影格，token 用量最多可減少 88%。

## 從任何公開影片中可以擷取的內容

摘要只是開始。你可以要求配合工作流程的結構化輸出，從附時間戳記的章節分析，到學習指南與可直接使用的程式碼片段。

#### 摘要演講與講座

#### 依時間戳記查詢特定時刻

#### 檢視畫面上的投影片與程式碼

#### 提出後續問題

## 在 Google AI Studio Playground 中摘要

### 開啟新對話

### 加入 YouTube 影片

### 索取想要的摘要

- 「用 3 個重點摘要這部影片。」
- 「撰寫附標題的學習筆記，結尾附上簡短測驗。」
- 「列出主要主題轉換點，並附上時間戳記。」

### 在對話中提出後續問題

## 使用 Gemini API 摘要

在 API 請求中，將公開 YouTube 網址直接以檔案資料的形式傳送，並搭配你的提示詞。你只需要把 Gemini API 金鑰儲存在環境中。使用 `pip install google-genai` 或 `npm install @google/genai` 安裝 Google GenAI SDK。

```
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-3.8-flash",
    input=[
        {"type": "text", "text": "Summarize the key takeaways and provide high-level chapter milestones with approximate timestamps."},
        {
            "type": "video",
            "uri": "https://www.youtube.com/watch?v=OyimE74UMF8"
        }
    ]
)

print(interaction.output_text)
```

## 需要知道的影片限制

使用 AI Studio 與 Gemini API 處理 YouTube 網址時的重要限制。

#### 僅限公開影片

#### 每日免費上限 8 小時

#### 一次最多 10 部影片

#### 每部影片最長 3 小時
