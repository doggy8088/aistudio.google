# 空間推理

Gemini Robotics ER 模型可以指向物體、在影片中追蹤物體、以邊界框偵測物體，並產生移動軌跡。

完整可執行的程式碼請參閱
[Robotics cookbook](https://github.com/google-gemini/robotics-samples/blob/main/Getting%20Started/gemini_robotics_er.ipynb)。

## 指向物體 {#pointing-to-objects}

下列範例會找出圖片中的特定物體，並傳回其正規化的 `[y, x]` 座標：


=== "Python"

      ```python
      from google import genai

      PROMPT = """
                Point to no more than 10 items in the image. The label returned
                should be an identifying name for the object detected.
                The answer should follow the json format: [{"point": <point>,
                "label": <label1>}, ...]. The points are in [y, x] format
                normalized to 0-1000.
              """
      client = genai.Client()

      uploaded_file = client.files.upload(file="my-image.png")

      image_response = client.interactions.create(
          model="gemini-robotics-er-2-preview",
          input=[
              {
                  "type": "image",
                  "uri": uploaded_file.uri,
                  "mime_type": uploaded_file.mime_type
              },
              {"type": "text", "text": PROMPT}
          ],
          generation_config={"thinking_level": "high"},
      )

      print(image_response.output_text)
      ```

=== "REST"

      ```bash
      # First, ensure you have the image file locally.
      # Encode the image to base64
      IMAGE_BASE64=$(base64 -w 0 my-image.png)

      curl -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-robotics-er-2-preview",
          "input": {
            "parts": [
              {
                "inlineData": {
                  "mimeType": "image/png",
                  "data": "'"${IMAGE_BASE64}"'"
                }
              },
              {
                "text": "Point to no more than 10 items in the image. The label returned should be an identifying name for the object detected. The answer should follow the json format: [{\"point\": [y, x], \"label\": <label1>}, ...]. The points are in [y, x] format normalized to 0-1000."
              }
            ]
          },
          "generation_config": {
            "thinking_config": {
              "thinking_level": "high"
            }
          }
        }'
      ```


輸出會是一個 JSON 陣列，其中每個物件都包含一個 `point`（正規化的 `[y, x]` 座標）與一個標示物體的 `label`。


=== "JSON"

      ```json
      [
        {"point": [376, 508], "label": "small banana"},
        {"point": [287, 609], "label": "larger banana"},
        {"point": [223, 303], "label": "pink starfruit"},
        {"point": [435, 172], "label": "paper bag"},
        {"point": [270, 786], "label": "green plastic bowl"},
        {"point": [488, 775], "label": "metal measuring cup"},
        {"point": [673, 580], "label": "dark blue bowl"},
        {"point": [471, 353], "label": "light blue bowl"},
        {"point": [492, 497], "label": "bread"},
        {"point": [525, 429], "label": "lime"}
      ]
      ```


下圖示範這些點的呈現方式：

![](https://www.gstatic.com/cloud-cms/9520553bf3464dfdca8d4bf4b4da2951.png)

## 在影片中追蹤物體 {#object-tracking-video}

Gemini Robotics ER 2 也能分析影片影格，隨時間追蹤物體。支援的影片格式清單請參閱[影片輸入](/docs/video-understanding/#supported-formats)。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      uploaded_file = client.files.upload(file="my-video.mp4")

      prompt = """
                Point to the red ball in every frame where it appears.
                The answer should follow the json format: [{"point": [y, x],
                "label": <label>}, ...]. The points are in [y, x] format
                normalized to 0-1000. Return one entry per frame that contains
                the object.
              """

      image_response = client.interactions.create(
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

      print(image_response.output_text)
      ```


## 物體偵測與邊界框 {#object-detection-bounding-boxes}

除了指向點之外，你也可以提示模型傳回 2D 邊界框，為偵測到的物體提供更詳細的空間資訊。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      uploaded_file = client.files.upload(file="my-image.png")

      prompt = """
                Detect all objects in this image and return bounding boxes.
                The answer should follow the JSON format:
                [{"label": <label>, "y": <y_min>, "x": <x_min>,
                  "y2": <y_max>, "x2": <x_max>}, ...]
                where coordinates are normalized to 0-1000.
              """

      image_response = client.interactions.create(
        model="gemini-robotics-er-2-preview",
        input=[
          {
              "type": "image",
              "uri": uploaded_file.uri,
              "mime_type": uploaded_file.mime_type
          },
          {"type": "text", "text": prompt}
        ],
      )

      print(image_response.output_text)
      ```


## 軌跡 {#trajectories}

Gemini Robotics ER 2 可以產生定義軌跡的點序列，對於引導機器人移動很有用。

本範例要求產生一條將紅筆移到收納盒的軌跡，並估算中間的途經點。為求簡潔，程式碼僅顯示提示詞部分。


=== "Python"

      ```python
      prompt = """
                Generate a trajectory for the robotic arm to pick up the red pen
                and place it in the organizer. Return a list of waypoints as JSON:
                [{"step": <int>, "point": [y, x], "action": <description>}, ...]
                where coordinates are normalized to 0-1000.
              """
      ```


## 為筆記型電腦騰出空間 {#making-room-laptop}

本範例展示 Gemini Robotics ER 如何推理空間。提示詞要求模型找出需要移開哪個物體，才能為另一個物品騰出空間。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      uploaded_file = client.files.upload(file="path/to/image-with-objects.jpg")

      prompt = """
                Point to the object that I need to remove to make room for my laptop
                The answer should follow the JSON format: [{"point": <point>,
                "label": <label1>}, ...]. The points are in [y, x] format normalized to 0-1000.
              """

      image_response = client.interactions.create(
        model="gemini-robotics-er-2-preview",
        input=[
          {
              "type": "image",
              "uri": uploaded_file.uri,
              "mime_type": uploaded_file.mime_type
          },
          {"type": "text", "text": prompt}
        ],
      )

      print(image_response.output_text)
      ```


回應包含一個 2D 座標，指向回答使用者問題的物體——在本例中，就是應該移開以便為筆記型電腦騰出空間的物體。

```json
[
  {"point": [672, 301], "label": "The object that I need to remove to make room for my laptop"}
]
```

![](https://www.gstatic.com/cloud-cms/2e93adec0bc100a1db910fd7ea48e758.png)

## 打包午餐 {#packing-lunch}

模型也能為多步驟任務提供指示，並為每個步驟指出相關物體。本範例展示模型如何規劃一系列步驟來打包午餐袋。


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      uploaded_file = client.files.upload(file="path/to/image-of-lunch.jpg")

      prompt = """
                Explain how to pack the lunch box and lunch bag. Point to each
                object that you refer to. Each point should be in the format:
                [{"point": [y, x], "label": }], where the coordinates are
                normalized between 0-1000.
              """

      image_response = client.interactions.create(
        model="gemini-robotics-er-2-preview",
        input=[
          {
              "type": "image",
              "uri": uploaded_file.uri,
              "mime_type": uploaded_file.mime_type
          },
          {"type": "text", "text": prompt}
        ],
      )

      print(image_response.output_text)
      ```


此提示詞的回應是一組逐步指示，說明如何根據輸入圖片打包午餐袋。

**輸入圖片**

![](https://www.gstatic.com/cloud-cms/ad80224a995418224640d876f08c5e1e.png)

**模型輸出**

```none
Based on the image, here is a plan to pack the lunch box and lunch bag:

1.  **Pack the fruit into the lunch box.** Place the [apple](apple), [banana](banana), [red grapes](red grapes), and [green grapes](green grapes) into the [blue lunch box](blue lunch box).
2.  **Add the spoon to the lunch box.** Put the [blue spoon](blue spoon) inside the lunch box as well.
3.  **Close the lunch box.** Secure the lid on the [blue lunch box](blue lunch box).
4.  **Place the lunch box inside the lunch bag.** Put the closed [blue lunch box](blue lunch box) into the [brown lunch bag](brown lunch bag).
5.  **Pack the remaining items into the lunch bag.** Place the [blue snack bar](blue snack bar) and the [brown snack bar](brown snack bar) into the [brown lunch bag](brown lunch bag).
```

## 後續步驟 {#whats-next}

*   [代理能力](/docs/robotics-agentic/) — 程式碼執行、儀器讀數、圖片標註。
*   [任務編排](/docs/robotics-orchestration/) — 透過自訂機器人 API 完成長程任務。
*   [串流機器人應用](/docs/robotics-streaming/) — 即時雙向串流（僅限 Gemini Robotics ER 2）。
*   [影片理解](/docs/robotics-video-progress/) — 時刻查找與進度分類（僅限 Gemini Robotics ER 2）。
