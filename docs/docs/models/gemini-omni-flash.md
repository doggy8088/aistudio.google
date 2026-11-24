# Gemini Omni Flash

Gemini Omni Flash 是高效能模型，專為快速、對話式的影片生成與編輯而設計。它擅長將文字與圖片轉換為影片，讓你透過 Interactions API 以自然語言對話調整與編輯生成的影片，並支援影片延長、最高 4K 輸出解析度與進階插值。

[Try in Google AI Studio](https://aistudio.google.com?model=gemini-omni-1.2-flash)

## 文件 {#documentation}

如需功能與能力的完整說明，請參閱 [Gemini Omni Flash](/docs/omni/) 頁面。

## gemini-omni-1.2-flash {#gemini-omni-1.2-flash}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | **Gemini API** `gemini-omni-1.2-flash` |
| 支援的資料類型 | **輸入** 文字、圖片、影片（編輯最長 15s，延長回看 10s） **輸出** 含原生音訊的影片、文字 |
| 上限 | **輸入 token 上限** 131,072 tokens **輸出 token 上限** 65,536 tokens **輸出影片** 3s-15s（360p/720p/1080p/4K，24 FPS；首幀與尾幀插值為 3s-10s，每輪影片延長總長最高 30s） |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 穩定版：`gemini-omni-1.2-flash` | 穩定版：`gemini-omni-1.1-flash`（2026 年 12 月 3 日起改導向 `gemini-omni-1.2-flash`） | 已關閉：`gemini-omni-flash-preview` |
| 最近更新 | 2026 年 11 月 |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-omni-flash/#pricing-gemini-omni-1.2-flash)。 |


### 定價 {#pricing-gemini-omni-1.2-flash}


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $1.50（文字 / 圖片 / 影片） |
    | 輸出價格（含思考 token） | 不提供 | $9.00（文字） $12.00（影片）* |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


* 計費以輸出 token 總消耗量為準，以每秒 720p 影片 5,792 tokens 計算。在 Standard 定價（每 100 萬 tokens $12.00）下，相當於每秒約 $0.07 的有效價格（10 秒片段約 $0.70，15 秒片段約 $1.04；360p 以 1,931tokens/秒計為 $0.023/秒；1080p 經升頻以 8,688tokens/秒計為 $0.104/秒；4K 經升頻以 17,376tokens/秒計為 $0.209/秒）。



## gemini-omni-1.1-flash {#gemini-omni-1.1-flash}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | **Gemini API** `gemini-omni-1.1-flash` |
| 支援的資料類型 | **輸入** 文字、圖片、影片（編輯與延長最長 10s） **輸出** 影片 |
| 上限 | **輸入 token 上限** 131,072 tokens **輸出 token 上限** 65,536 tokens **輸出影片** 3s-10s（360p/720p/1080p/4K，24 FPS） |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 穩定版：`gemini-omni-1.2-flash` | 穩定版：`gemini-omni-1.1-flash`（2026 年 12 月 3 日起改導向 `gemini-omni-1.2-flash`） | 已關閉：`gemini-omni-flash-preview` |
| 最近更新 | 2026 年 8 月 |
| 定價 | 請參閱下方的[定價](/docs/models/gemini-omni-flash/#pricing-gemini-omni-1.1-flash)。 |




### 定價 {#pricing-gemini-omni-1.1-flash}

自 2026 年 12 月 3 日起，所有對 `gemini-omni-1.1-flash` 的 API 請求都會自動轉送至 [`gemini-omni-1.2-flash`](/docs/models/gemini-omni-flash/#gemini-omni-1.2-flash)，並按 `gemini-omni-1.2-flash` 的費率計費。


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $1.50（文字 / 圖片 / 影片） |
    | 輸出價格（含思考 token） | 不提供 | $9.00（文字） $17.50（影片）* |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

* 計費以輸出 token 總消耗量為準，以每秒 720p 影片 5,792 tokens 計算。在 Standard 定價下，相當於每秒約 $0.10 的有效價格。
