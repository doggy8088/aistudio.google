# 影片理解


!!! note " "

      影片理解需要 Gemini Robotics ER 2
      (`gemini-robotics-er-2-preview`)。ER 1.6 不提供此功能。


Gemini Robotics ER 2 可透過兩項能力，從連續影片串流追蹤任務進度：

*   時刻搜尋：找出關鍵事件發生的精確時間戳記。
*   進度分類：將每段影片歸入五個完成度區間之一
    (0–20%、20–40%、40–60%、60–80%、80–100%)。

## 時刻搜尋 {#moment-finding}

時刻搜尋可找出關鍵事件發生的確切影片影格 —
例如杯子裝滿或繩結打好的時刻。機器人可藉此驗證
是否成功、安排步驟順序，並觸發修正動作。

以下範例提示詞要求模型找出影片中指定任務的完成時刻：

```python
from google import genai

client = genai.Client()

uploaded_file = client.files.upload(file="task_video.mp4")

prompt = """
At what timestamp (in seconds) does the task reach successful completion?
Return a JSON object: {"completion_time_seconds": <float>}.
If the task is not completed, return {"completion_time_seconds": null}.
"""

interaction = client.interactions.create(
    model="gemini-robotics-er-2-preview",
    input=[
        {
            "type": "video",
            "uri": uploaded_file.uri,
            "mime_type": uploaded_file.mime_type
        },
        {"type": "text", "text": prompt}
    ],
)

print(interaction.output_text)
```

以下顯示時刻搜尋影片的範例影格，
模型已在其中標示任務完成的時間戳記：

![](https://www.gstatic.com/cloud-cms/0d2c507f7f0c9e70b859bd31bf829b9e.png)

## 進度分類 {#progress-classification}

進度分類會將影片歸入五個完成度區間之一：
0–20%、20–40%、40–60%、60–80% 或 80–100%。這讓機器人能即時
掌握情境，進而調整動作或重試失敗的步驟，
而不必重新啟動整個工作流程。

以下範例提示詞要求模型根據影片分類目前的進度等級：

```python
from google import genai

client = genai.Client()

uploaded_file = client.files.upload(file="task_video.mp4")

prompt = """
Watch this video and classify the task progress level at the final frame.
Return a JSON object with the progress bracket:
{"progress_level": "0-20" | "20-40" | "40-60" | "60-80" | "80-100"}.
"""

interaction = client.interactions.create(
    model="gemini-robotics-er-2-preview",
    input=[
        {
            "type": "video",
            "uri": uploaded_file.uri,
            "mime_type": uploaded_file.mime_type
        },
        {"type": "text", "text": prompt}
    ],
)

print(interaction.output_text)
```

以下顯示進度分類影片的範例影格，
模型已在其中指派進度區間：

![](https://www.gstatic.com/cloud-cms/4c93b6e1b473ca3307b8ceeaabef7e63.png)

## 範例 {#full-examples}

如需包含多步驟任務追蹤在內的完整可執行範例，請參閱
[Robotics cookbook](https://github.com/google-gemini/robotics-samples/blob/main/Getting%20Started/gemini_robotics_er.ipynb)。

## 後續步驟 {#whats-next}

*   [適用於機器人的 Live API](/docs/robotics-streaming/) — 即時雙向串流。
*   [任務協調](/docs/robotics-orchestration/) — 具備空間推理的長時程任務。
*   [Gemini Robotics ER 總覽](/docs/robotics-overview/) — 模型比較與功能。
