# 代理式視覺

Gemini Robotics ER 模型可以撰寫並執行 Python 程式碼來處理圖片、套用邏輯，然後再回答。本頁涵蓋程式碼執行範例：以縮放與裁切進行物件偵測、儀器讀數、液體測量、電路板讀取，以及圖片標註。

若要將這些範例套用到你自己的使用情境，只需將提示詞文字與上傳的圖片檔案換成你自己的即可。你也可以調整提示詞中要求的 JSON 結構，配合你的應用程式所需的輸出結構，或加入 `system_instruction` 來強制輸出格式與精確度。

如需完整可執行的程式碼，請參閱 [Robotics cookbook](https://github.com/google-gemini/robotics-samples/blob/main/Getting%20Started/gemini_robotics_er.ipynb)。

## 思考等級 {#thinking-level}

你可以控制模型的思考等級，在延遲與準確度之間取捨。物件偵測等空間任務在低思考等級下表現良好；計數或重量估算等複雜任務則可從較高的思考等級中受益。

以下範例將思考等級設為 `high`，用於複雜的計數任務：

```python
from google import genai

client = genai.Client()

uploaded_file = client.files.upload(file="scene.jpeg")

interaction = client.interactions.create(
    model="gemini-robotics-er-2-preview",
    input=[
        {
            "type": "image",
            "uri": uploaded_file.uri,
            "mime_type": uploaded_file.mime_type
        },
        {"type": "text", "text": "Identify and count all objects on the table."}
    ],
    generation_config={
        "thinking_level": "high"  # Use "minimal" or "low" for faster spatial tasks
    }
)

print(interaction.output_text)
```

詳情請參閱[思考](/docs/thinking/)。

## 物件偵測（縮放與裁切） {#agentic-object-detection}

以下範例使用程式碼執行來縮放並裁切圖片，以便在偵測物件並傳回邊界框時看得更清楚。

```python
from google import genai

client = genai.Client()

uploaded_file = client.files.upload(file="sorting.jpeg")

prompt = """
Return JSON in the format {label: val, y: val, x: val, y2: val, x2: val} for
the compostable objects in this scene. Please Zoom and crop the image for a
clearer view. Return an annotated image of the final result with the bounding
boxes drawn on it to the API caller as a part of your process.
"""

interaction = client.interactions.create(
    model="gemini-robotics-er-2-preview",
    input=[
        {
            "type": "image",
            "uri": uploaded_file.uri,
            "mime_type": uploaded_file.mime_type
        },
        {"type": "text", "text": prompt}
    ],
    tools=[{"type": "code_execution"}]
)

print(interaction.output_text)
```

模型輸出會與以下 JSON 回應類似：

```json
[
  {"label": "compostable", "y": 256, "x": 482, "y2": 295, "x2": 546},
  {"label": "compostable", "y": 317, "x": 478, "y2": 350, "x2": 542},
  {"label": "compostable", "y": 586, "x": 556, "y2": 668, "x2": 595},
  {"label": "compostable", "y": 463, "x": 669, "y2": 511, "x2": 718},
  {"label": "compostable", "y": 178, "x": 565, "y2": 250, "x2": 609}
]
```

下圖顯示模型傳回的邊界框。

![](https://www.gstatic.com/cloud-cms/47f1db31ee649b09753e1a54748a0155.png)

## 讀取類比儀表並套用邏輯 {#reading-gauge}

以下範例示範如何使用模型讀取類比儀表並執行時間計算。它使用系統指令來強制 JSON 輸出。

```python
from google import genai

client = genai.Client()

uploaded_file = client.files.upload(file="gauge.jpeg")

interaction = client.interactions.create(
    model="gemini-robotics-er-2-preview",
    system_instruction="Be precise. When JSON is requested, reply with ONLY that JSON (no preface, no code block).",
    input=[
        {
            "type": "image",
            "uri": uploaded_file.uri,
            "mime_type": uploaded_file.mime_type
        },
        {"type": "text", "text": """Read the current value from this gauge. Then, calculate how long
        it will take at the current rate for the value to reach maximum.
        Reply in JSON: {"current_value": val, "max_value": val,
        "time_to_max_minutes": val}"""}
    ],
    tools=[{"type": "code_execution"}]
)

print(interaction.output_text)
```

## 測量容器中的液體 {#measuring-fluid}

以下範例示範如何使用程式碼執行來測量容器中的液體量。

```python
from google import genai

client = genai.Client()

uploaded_file = client.files.upload(file="fluid.jpeg")

interaction = client.interactions.create(
    model="gemini-robotics-er-2-preview",
    system_instruction="Be precise. When JSON is requested, reply with ONLY that JSON (no preface, no code block).",
    input=[
        {
            "type": "image",
            "uri": uploaded_file.uri,
            "mime_type": uploaded_file.mime_type
        },
        {"type": "text", "text": """Measure the amount of fluid in the container. Reply in JSON:
        {"fluid_level_ml": val, "container_capacity_ml": val,
        "percentage_full": val}"""}
    ],
    tools=[{"type": "code_execution"}]
)

print(interaction.output_text)
```

## 讀取電路板上的標記 {#reading-circuit-board}

以下範例示範如何使用程式碼執行來讀取電路板上的標記。

```python
from google import genai

client = genai.Client()

uploaded_file = client.files.upload(file="circuit_board.jpeg")

interaction = client.interactions.create(
    model="gemini-robotics-er-2-preview",
    system_instruction="Be precise. When JSON is requested, reply with ONLY that JSON (no preface, no code block).",
    input=[
        {
            "type": "image",
            "uri": uploaded_file.uri,
            "mime_type": uploaded_file.mime_type
        },
        {"type": "text", "text": """Read all visible component labels and markings on this circuit
        board. Reply in JSON: {"components": [{"label": val,
        "location": [y, x]}]}"""}
    ],
    tools=[{"type": "code_execution"}]
)

print(interaction.output_text)
```

![](https://www.gstatic.com/cloud-cms/ff8225012208552392922fd97916c147.png)

## 圖片標註 {#image-annotation}

以下範例示範如何使用程式碼執行來標註圖片（例如以箭頭標示丟棄指示），並傳回修改後的圖片。

```python
from google import genai

client = genai.Client()

# Load your image
uploaded_file = client.files.upload(file="sorting.jpeg")

prompt = """
Look at this image and return it as an annotated version using arrows of
different colors to represent which items should go in which bins for
disposal. You must return the final image to the API caller.
"""

interaction = client.interactions.create(
    model="gemini-robotics-er-2-preview",
    input=[
        {
            "type": "image",
            "uri": uploaded_file.uri,
            "mime_type": uploaded_file.mime_type
        },
        {"type": "text", "text": prompt}
    ],
    tools=[{"type": "code_execution"}]
)

print(interaction.output_text)
```

以下是一張範例輸入圖片。

![](https://www.gstatic.com/cloud-cms/d0fa4b3ba6a7af62eb10a2130cee364c.png)

模型輸出會與以下內容類似：

```none
The annotated image shows the suggested disposal locations for the items on the table:
- **Green bin (Compost/Organic)**: Green chili, red chili, grapes, and cherries.
- **Blue bin (Recycling)**: Yellow crushed can and plastic container.
- **Black bin (Trash)**: Chocolate bar wrapper, Welch's packet, and white tissue.
```

## 後續步驟 {#whats-next}

*   [任務編排](/docs/robotics-orchestration/)：以自訂機器人 API 執行長程任務。
*   [以串流進行機器人控制](/docs/robotics-streaming/)：即時雙向串流（僅限 Gemini Robotics ER 2）。
*   [影片理解](/docs/robotics-video-progress/)：時刻查找與進度分類（僅限 Gemini Robotics ER 2）。
