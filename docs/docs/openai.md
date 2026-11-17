# OpenAI 相容性

只要修改三行程式碼並使用你的 [Gemini API 金鑰](https://aistudio.google.com/apikey)，就能透過 OpenAI 程式庫（Python 與 TypeScript／Javascript）以及 REST API 存取 Gemini 模型。若你尚未使用 OpenAI 程式庫，建議直接呼叫 [Gemini API](/docs/get-started/)。


=== "Python"

      ```python
      from openai import OpenAI

      client = OpenAI(
          api_key="GEMINI_API_KEY",
          base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
      )

      response = client.chat.completions.create(
          model="gemini-4-hydrogen",
          messages=[
              {   "role": "system",
                  "content": "You are a helpful assistant."
              },
              {
                  "role": "user",
                  "content": "Explain to me how AI works"
              }
          ]
      )

      print(response.choices[0].message)
      ```

=== "JavaScript"

      ```javascript
      import OpenAI from "openai";

      const openai = new OpenAI({
          apiKey: "GEMINI_API_KEY",
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
      });

      const response = await openai.chat.completions.create({
          model: "gemini-4-hydrogen",
          messages: [
              {   role: "system",
                  content: "You are a helpful assistant."
              },
              {
                  role: "user",
                  content: "Explain to me how AI works",
              },
          ],
      });

      console.log(response.choices[0].message);
      ```

=== "REST"

      ```bash
      curl "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $GEMINI_API_KEY" \
        -d '{
          "model": "gemini-4-hydrogen",
          "messages": [
            {
              "role": "user",
              "content": "Explain to me how AI works"
            }
          ]
        }'
      ```

      改了什麼？只有三行！

      * **`api_key="GEMINI_API_KEY"`**：將 "`GEMINI_API_KEY`" 換成你實際的 Gemini API 金鑰，你可以在 [Google AI Studio](https://aistudio.google.com) 取得。

      * **`base_url="https://generativelanguage.googleapis.com/v1beta/openai/"`**：這會讓 OpenAI 程式庫將要求送往 Gemini API 端點，而不是預設的 URL。

      * **`model="gemini-4-hydrogen"`**：選擇相容的 Gemini 模型


## 思考 {#thinking}

Gemini 模型經過訓練，能思考複雜問題，推理能力因此大幅提升。Gemini API 提供 [thinking 參數](/docs/thinking/)，可精細控制模型的思考程度。

不同的 Gemini 模型有不同的推理設定，其與 OpenAI reasoning effort 的對應關係如下：

| reasoning_effort (OpenAI) | thinking_level (Gemini 4) | thinking_level (Gemini 3.1 Flash-Lite) | thinking_level (Gemini 3 Flash) | thinking_budget (Gemini 2.5) |
| :--- | :--- | :--- | :--- | :--- |
| `minimal` | `low` | `minimal` | `minimal` | `1,024` |
| `low` | `low` | `low` | `low` | `1,024` |
| `medium` | `medium` | `medium` | `medium` | `8,192` |
| `high` | `high` | `high` | `high` | `24,576` |
| `xhigh` | `xhigh`（僅 `gemini-4-hydrogen`） | 不支援 | 不支援 | 不支援 |

若未指定 `reasoning_effort`，Gemini 會使用模型的預設[等級或預算](/docs/thinking/#thinking-levels)。

若要停用思考功能，可針對 2.5 模型將 `reasoning_effort` 設為 `"none"`。Gemini 2.5 Pro、Gemini 3 與 Gemini 4 模型無法關閉推理功能。


=== "Python"

      ```python
      from openai import OpenAI

      client = OpenAI(
          api_key="GEMINI_API_KEY",
          base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
      )

      response = client.chat.completions.create(
          model="gemini-4-hydrogen",
          reasoning_effort="low",
          messages=[
              {   "role": "system",
                  "content": "You are a helpful assistant."
              },
              {
                  "role": "user",
                  "content": "Explain to me how AI works"
              }
          ]
      )

      print(response.choices[0].message)
      ```

=== "JavaScript"

      ```javascript
      import OpenAI from "openai";

      const openai = new OpenAI({
          apiKey: "GEMINI_API_KEY",
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
      });

      const response = await openai.chat.completions.create({
          model: "gemini-4-hydrogen",
          reasoning_effort: "low",
          messages: [
              {   role: "system",
                  content: "You are a helpful assistant."
              },
              {
                  role: "user",
                  content: "Explain to me how AI works",
              },
          ],
      });

      console.log(response.choices[0].message);
      ```

=== "REST"

      ```bash
      curl "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $GEMINI_API_KEY" \
        -d '{
          "model": "gemini-4-hydrogen",
          "reasoning_effort": "low",
          "messages": [
            {
              "role": "user",
              "content": "Explain to me how AI works"
            }
          ]
        }'
      ```

      Gemini 思考模型也會產生[思考摘要](/docs/thinking/#summaries)。你可以使用 [`extra_body`](/docs/openai/#extra-body) 欄位，在要求中加入 Gemini 欄位。

      請注意，`reasoning_effort` 與 `thinking_level`／`thinking_budget` 的功能重疊，因此不能同時使用。

=== "Python"

      ```python
      from openai import OpenAI

      client = OpenAI(
          api_key="GEMINI_API_KEY",
          base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
      )

      response = client.chat.completions.create(
          model="gemini-4-hydrogen",
          messages=[{"role": "user", "content": "Explain to me how AI works"}],
          extra_body={
            'extra_body': {
              "google": {
                "thinking_config": {
                  "thinking_level": "high",
                  "include_thoughts": True
                }
              }
            }
          }
      )

      print(response.choices[0].message)
      ```

=== "JavaScript"

      ```javascript
      import OpenAI from "openai";

      const openai = new OpenAI({
          apiKey: "GEMINI_API_KEY",
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
      });

      const response = await openai.chat.completions.create({
          model: "gemini-4-hydrogen",
          messages: [{role: "user", content: "Explain to me how AI works",}],
          extra_body: {
            "google": {
              "thinking_config": {
                "thinking_level": "high",
                "include_thoughts": true
              }
            }
          }
      });

      console.log(response.choices[0].message);
      ```

=== "REST"

      ```shell
      curl "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer GEMINI_API_KEY" \
        -d '{
            "model": "gemini-4-hydrogen",
              "messages": [{"role": "user", "content": "Explain to me how AI works"}],
              "extra_body": {
                "google": {
                  "thinking_config": {
                    "thinking_level": "high",
                    "include_thoughts": true
                  }
                }
              }
            }'
      ```

      Gemini 3 在聊天補全 API 中支援 thought signatures 的 OpenAI 相容性。完整範例請見 [thought signatures](/docs/thought-signatures/?generate-content=true#openai) 頁面。


## 串流 {#streaming}

Gemini API 支援[串流回應](/docs/text-generation/#streaming-responses)。


=== "Python"

      ```python
      from openai import OpenAI

      client = OpenAI(
          api_key="GEMINI_API_KEY",
          base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
      )

      response = client.chat.completions.create(
        model="gemini-4-hydrogen",
        messages=[
          {
              "role": "system",
              "content": "You are a helpful assistant."
          },
          {   "role": "user",
              "content": "Hello!"
          }
        ],
        stream=True
      )

      for chunk in response:
          print(chunk.choices[0].delta)
      ```

=== "JavaScript"

      ```javascript
      import OpenAI from "openai";

      const openai = new OpenAI({
          apiKey: "GEMINI_API_KEY",
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
      });

      async function main() {
        const completion = await openai.chat.completions.create({
          model: "gemini-4-hydrogen",
          messages: [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "Hello!"
            }
          ],
          stream: true,
        });

        for await (const chunk of completion) {
          console.log(chunk.choices[0].delta.content);
        }
      }

      await main();
      ```

=== "REST"

      ```bash
      curl "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer GEMINI_API_KEY" \
        -d '{
            "model": "gemini-4-hydrogen",
            "messages": [
                {"role": "user", "content": "Explain to me how AI works"}
            ],
            "stream": true
          }'
      ```


## 函式呼叫 {#function-calling}

函式呼叫讓你更容易從生成式模型取得結構化資料輸出，且 [Gemini API 已支援此功能](/docs/function-calling/)。


=== "Python"

      ```python
      from openai import OpenAI

      client = OpenAI(
          api_key="GEMINI_API_KEY",
          base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
      )

      tools = [
        {
          "type": "function",
          "function": {
            "name": "get_weather",
            "description": "Get the weather in a given location",
            "parameters": {
              "type": "object",
              "properties": {
                "location": {
                  "type": "string",
                  "description": "The city and state, e.g. Chicago, IL",
                },
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
              },
              "required": ["location"],
            },
          }
        }
      ]

      messages = [{"role": "user", "content": "What's the weather like in Chicago today?"}]
      response = client.chat.completions.create(
        model="gemini-4-hydrogen",
        messages=messages,
        tools=tools,
        tool_choice="auto"
      )

      print(response)
      ```

=== "JavaScript"

      ```javascript
      import OpenAI from "openai";

      const openai = new OpenAI({
          apiKey: "GEMINI_API_KEY",
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
      });

      async function main() {
        const messages = [{"role": "user", "content": "What's the weather like in Chicago today?"}];
        const tools = [
            {
              "type": "function",
              "function": {
                "name": "get_weather",
                "description": "Get the weather in a given location",
                "parameters": {
                  "type": "object",
                  "properties": {
                    "location": {
                      "type": "string",
                      "description": "The city and state, e.g. Chicago, IL",
                    },
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                  },
                  "required": ["location"],
                },
              }
            }
        ];

        const response = await openai.chat.completions.create({
          model: "gemini-4-hydrogen",
          messages: messages,
          tools: tools,
          tool_choice: "auto",
        });

        console.log(response);
      }

      await main();
      ```

=== "REST"

      ```bash
      curl "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer GEMINI_API_KEY" \
      -d '{
        "model": "gemini-4-hydrogen",
        "messages": [
          {
            "role": "user",
            "content": "What'\''s the weather like in Chicago today?"
          }
        ],
        "tools": [
          {
            "type": "function",
            "function": {
              "name": "get_weather",
              "description": "Get the current weather in a given location",
              "parameters": {
                "type": "object",
                "properties": {
                  "location": {
                    "type": "string",
                    "description": "The city and state, e.g. Chicago, IL"
                  },
                  "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"]
                  }
                },
                "required": ["location"]
              }
            }
          }
        ],
        "tool_choice": "auto"
      }'
      ```


## 圖片理解 {#image-understanding}

Gemini 模型原生支援多模態，在[許多常見的視覺任務](/docs/image-understanding/)上表現領先業界。


=== "Python"

      ```python
      import base64
      from openai import OpenAI

      client = OpenAI(
          api_key="GEMINI_API_KEY",
          base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
      )

      # Function to encode the image
      def encode_image(image_path):
        with open(image_path, "rb") as image_file:
          return base64.b64encode(image_file.read()).decode('utf-8')

      # Getting the base64 string
      base64_image = encode_image("Path/to/agi/image.jpeg")

      response = client.chat.completions.create(
        model="gemini-4-hydrogen",
        messages=[
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "What is in this image?",
              },
              {
                "type": "image_url",
                "image_url": {
                  "url":  f"data:image/jpeg;base64,{base64_image}"
                },
              },
            ],
          }
        ],
      )

      print(response.choices[0])
      ```

=== "JavaScript"

      ```javascript
      import OpenAI from "openai";
      import fs from 'fs';

      const openai = new OpenAI({
        apiKey: "GEMINI_API_KEY",
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
      });

      function encodeImage(imagePath = '') {
        try {
          const imageBuffer = fs.readFileSync(imagePath);
          return imageBuffer.toString('base64');
        } catch (error) {
          console.error("Error encoding image:", error);
          return '';
        }
      }

      async function main() {
        const imagePath = "Path/to/agi/image.jpeg";
        const base64Image = await encodeImage(imagePath);

        const messages = [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "What is in this image?",
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": `data:image/jpeg;base64,${base64Image}`
                },
              },
            ],
          }
        ];

        try {
          const response = await openai.chat.completions.create({
            model: "gemini-4-hydrogen",
            messages: messages,
          });

          console.log(response.choices[0]);
        } catch (error) {
          console.error("Error calling Gemini API:", error);
        }
      }

      await main();
      ```

=== "REST"

      ```bash
      bash -c '
        base64_image=$(base64 -i "Path/to/agi/image.jpeg");
        curl "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer GEMINI_API_KEY" \
          -d "{
            \"model\": \"gemini-4-hydrogen\",
            \"messages\": [
              {
                \"role\": \"user\",
                \"content\": [
                  { \"type\": \"text\", \"text\": \"What is in this image?\" },
                  {
                    \"type\": \"image_url\",
                    \"image_url\": { \"url\": \"data:image/jpeg;base64,${base64_image}\" }
                  }
                ]
              }
            ]
          }"
      '
      ```


## 生成圖片 {#generate-image}

使用 `gemini-2.5-flash-image` 或 `gemini-3-pro-image-preview` 生成圖片。支援的參數包括 `prompt`、`model`、`n`、`size` 與 `response_format`。未列於此處或 [`extra_body`](/docs/openai/#extra-body) 章節的其他參數，將被相容層靜默忽略。


!!! note " "

      你可以透過 `extra_body` 參數啟用 **Grounding with Google Search** 並設定**安全設定**。可用參數請見 [`extra_body`](/docs/openai/#extra-body) 章節。使用 Google 搜尋接地僅適用於 Gemini 3 與更新的模型。


=== "Python"

      ```python
      import base64
      from openai import OpenAI
      from PIL import Image
      from io import BytesIO

      client = OpenAI(
          api_key="GEMINI_API_KEY",
          base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
      )

      response = client.images.generate(
          model="gemini-2.5-flash-image",
          prompt="a portrait of a sheepadoodle wearing a cape",
          response_format='b64_json',
          n=1,
      )

      for image_data in response.data:
        image = Image.open(BytesIO(base64.b64decode(image_data.b64_json)))
        image.show()
      ```

=== "JavaScript"

      ```javascript
      import OpenAI from "openai";

      const openai = new OpenAI({
        apiKey: "GEMINI_API_KEY",
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      });

      async function main() {
        const image = await openai.images.generate(
          {
            model: "gemini-2.5-flash-image",
            prompt: "a portrait of a sheepadoodle wearing a cape",
            response_format: "b64_json",
            n: 1,
          }
        );

        console.log(image.data);
      }

      await main();
      ```

=== "REST"

      ```bash
      curl "https://generativelanguage.googleapis.com/v1beta/openai/images/generations" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer GEMINI_API_KEY" \
        -d '{
              "model": "gemini-2.5-flash-image",
              "prompt": "a portrait of a sheepadoodle wearing a cape",
              "response_format": "b64_json",
              "n": 1,
            }'
      ```


## 生成影片 {#generate-video}


!!! warning " "

       Gemini API 中的 Veo 3.1 Preview（`veo-3.1-generate-preview`、`veo-3.1-fast-generate-preview` 與 `veo-3.1-lite-generate-preview`）已於 **2026 年 10 月 22 日**[關閉](/docs/deprecations/)。請改用原生 Google GenAI SDK（[Interactions API](/docs/interactions-overview/)）遷移至 [Gemini Omni Flash](/docs/omni/)（`gemini-omni-1.2-flash`），或改用透過 [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate) 提供的 GA 模型，以避免服務中斷。以 `gemini-omni-1.2-flash` 生成影片的功能，不支援於 OpenAI 相容的 `/v1/videos` 端點。 


## 音訊理解 {#audio-understanding}

分析音訊輸入：


=== "Python"

      ```python
      import base64
      from openai import OpenAI

      client = OpenAI(
          api_key="GEMINI_API_KEY",
          base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
      )

      with open("/path/to/your/audio/file.wav", "rb") as audio_file:
        base64_audio = base64.b64encode(audio_file.read()).decode('utf-8')

      response = client.chat.completions.create(
          model="gemini-4-hydrogen",
          messages=[
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "Transcribe this audio",
              },
              {
                    "type": "input_audio",
                    "input_audio": {
                      "data": base64_audio,
                      "format": "wav"
                }
              }
            ],
          }
        ],
      )

      print(response.choices[0].message.content)
      ```

=== "JavaScript"

      ```javascript
      import fs from "fs";
      import OpenAI from "openai";

      const client = new OpenAI({
        apiKey: "GEMINI_API_KEY",
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      });

      const audioFile = fs.readFileSync("/path/to/your/audio/file.wav");
      const base64Audio = audioFile.toString('base64');

      async function main() {
        const response = await client.chat.completions.create({
          model: "gemini-4-hydrogen",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Transcribe this audio",
                },
                {
                  type: "input_audio",
                  input_audio: {
                    data: base64Audio,
                    format: "wav",
                  },
                },
              ],
            },
          ],
        });

        console.log(response.choices[0].message.content);
      }

      await main();
      ```

=== "REST"

      注意：若你收到 `Argument list too long` 錯誤，可能是音訊檔案的編碼對 curl 而言太長。

      ```bash
      bash -c '
        base64_audio=$(base64 -i "/path/to/your/audio/file.wav");
        curl "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer GEMINI_API_KEY" \
          -d "{
            \"model\": \"gemini-4-hydrogen\",
            \"messages\": [
              {
                \"role\": \"user\",
                \"content\": [
                  { \"type\": \"text\", \"text\": \"Transcribe this audio file.\" },
                  {
                    \"type\": \"input_audio\",
                    \"input_audio\": {
                      \"data\": \"${base64_audio}\",
                      \"format\": \"wav\"
                    }
                  }
                ]
              }
            ]
          }"
      '
      ```


## 結構化輸出 {#structured-output}

Gemini 模型能以[你定義的任何結構](/docs/structured-output/)輸出 JSON 物件。


=== "Python"

      ```python
      from pydantic import BaseModel
      from openai import OpenAI

      client = OpenAI(
          api_key="GEMINI_API_KEY",
          base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
      )

      class CalendarEvent(BaseModel):
          name: str
          date: str
          participants: list[str]

      completion = client.beta.chat.completions.parse(
          model="gemini-4-hydrogen",
          messages=[
              {"role": "system", "content": "Extract the event information."},
              {"role": "user", "content": "John and Susan are going to an AI conference on Friday."},
          ],
          response_format=CalendarEvent,
      )

      print(completion.choices[0].message.parsed)
      ```

=== "JavaScript"

      ```javascript
      import OpenAI from "openai";
      import { zodResponseFormat } from "openai/helpers/zod";
      import { z } from "zod";

      const openai = new OpenAI({
          apiKey: "GEMINI_API_KEY",
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai"
      });

      const CalendarEvent = z.object({
        name: z.string(),
        date: z.string(),
        participants: z.array(z.string()),
      });

      const completion = await openai.chat.completions.parse({
        model: "gemini-4-hydrogen",
        messages: [
          { role: "system", content: "Extract the event information." },
          { role: "user", content: "John and Susan are going to an AI conference on Friday" },
        ],
        response_format: zodResponseFormat(CalendarEvent, "event"),
      });

      const event = completion.choices[0].message.parsed;
      console.log(event);
      ```


## 嵌入向量 {#embeddings}

文字嵌入向量用來衡量文字字串之間的相關程度，可透過 [Gemini API](/docs/embeddings/) 生成。你可以使用 `gemini-embedding-2` 產生多模態嵌入向量，或使用 `gemini-embedding-001` 產生純文字嵌入向量。


=== "Python"

      ```python
      from openai import OpenAI

      client = OpenAI(
          api_key="GEMINI_API_KEY",
          base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
      )

      response = client.embeddings.create(
          input="Your text string goes here",
          model="gemini-embedding-2"
      )

      print(response.data[0].embedding)
      ```

=== "JavaScript"

      ```javascript
      import OpenAI from "openai";

      const openai = new OpenAI({
          apiKey: "GEMINI_API_KEY",
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
      });

      async function main() {
        const embedding = await openai.embeddings.create({
          model: "gemini-embedding-2",
          input: "Your text string goes here",
        });

        console.log(embedding);
      }

      await main();
      ```

=== "REST"

      ```bash
      curl "https://generativelanguage.googleapis.com/v1beta/openai/embeddings" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer GEMINI_API_KEY" \
      -d '{
          "input": "Your text string goes here",
          "model": "gemini-embedding-2"
        }'
      ```


## Batch API {#batch}

你可以使用 OpenAI 程式庫建立[批次工作](/docs/batch-api/)、提交工作，並查看其狀態。

你需要先以 OpenAI 輸入格式準備 JSONL 檔案。例如：

```json
{"custom_id": "request-1", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gemini-4-hydrogen", "messages": [{"role": "user", "content": "Tell me a one-sentence joke."}]}}
{"custom_id": "request-2", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gemini-4-hydrogen", "messages": [{"role": "user", "content": "Why is the sky blue?"}]}}
```

Batch 的 OpenAI 相容性支援建立批次、監控工作狀態，以及查看批次結果。

目前尚不支援上傳與下載的相容性。下列範例改用 `genai` 用戶端上傳與下載[檔案](/docs/files/)，與使用 Gemini [Batch API](/docs/batch-api/#input-file) 時相同。


=== "Python"

      ```python
      from openai import OpenAI

      # Regular genai client for uploads & downloads
      from google import genai
      client = genai.Client()

      openai_client = OpenAI(
          api_key="GEMINI_API_KEY",
          base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
      )

      # Upload the JSONL file in OpenAI input format, using regular genai SDK
      uploaded_file = client.files.upload(
          file='my-batch-requests.jsonl',
          config=types.UploadFileConfig(display_name='my-batch-requests', mime_type='jsonl')
      )

      # Create batch
      batch = openai_client.batches.create(
          input_file_id=batch_input_file_id,
          endpoint="/v1/chat/completions",
          completion_window="24h"
      )

      # Wait for batch to finish (up to 24h)
      while True:
          batch = client.batches.retrieve(batch.id)
          if batch.status in ('completed', 'failed', 'cancelled', 'expired'):
              break
          print(f"Batch not finished. Current state: {batch.status}. Waiting 30 seconds...")
          time.sleep(30)
      print(f"Batch finished: {batch}")

      # Download results in OpenAI output format, using regular genai SDK
      file_content = genai_client.files.download(file=batch.output_file_id).decode('utf-8')

      # See batch_output JSONL in OpenAI output format
      for line in file_content.splitlines():
          print(line)
      ```

      OpenAI SDK 也支援[使用 Batch API 生成嵌入向量](/docs/batch-api/#batch-embedding)。若要這麼做，請將 `create` 方法的 `endpoint` 欄位換成嵌入向量端點，並同時更換 JSONL 檔案中的 `url` 與 `model` 鍵：

      ```python
      # JSONL file using embeddings model and endpoint
      # {"custom_id": "request-1", "method": "POST", "url": "/v1/embeddings", "body": {"model": "ggemini-embedding-001", "messages": [{"role": "user", "content": "Tell me a one-sentence joke."}]}}
      # {"custom_id": "request-2", "method": "POST", "url": "/v1/embeddings", "body": {"model": "gemini-embedding-001", "messages": [{"role": "user", "content": "Why is the sky blue?"}]}}

      # ...

      # Create batch step with embeddings endpoint
      batch = openai_client.batches.create(
      input_file_id=batch_input_file_id,
      endpoint="/v1/embeddings",
      completion_window="24h"
      )
      ```

      完整範例請見 OpenAI 相容性 cookbook 的 [Batch embedding generation](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Get_started_OpenAI_Compatibility.ipynb) 章節。


## Flex 與 Priority 推論 {#inference}

Gemini API 的 `service_tier` 參數在名稱與邏輯上都與 OpenAI 一致，能為 Flex 與 Priority 推論層級執行上限並平順導流。


=== "Python"

      ```python
      from openai import OpenAI

      client = OpenAI(
        api_key="GEMINI_API_KEY",
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
      )

      completion = client.chat.completions.create(
        model="gemini-4-hydrogen",
        messages=[
          {"role": "user", "content": "Write a short poem about clouds."}
        ],
        service_tier="priority" # Or service_tier="flex"
      )

      print(completion)
      ```

      未明確指定時，`service_tier` 預設為 `standard`，相當於 OpenAI 的 `default`。如需進一步了解推論層級，請參閱 [Optimization](/docs/optimization/) 文件。


## 使用 `extra_body` 啟用 Gemini 功能 {#extra-body}

Gemini 支援數項 OpenAI 模型沒有的功能，可透過 `extra_body` 欄位啟用。

| 參數 | 類型 | 端點 | 說明 |
| :--- | :--- | :--- | :--- |
| **`cached_content`** | Text | Chat | 對應 Gemini 的一般內容快取。 |
| **`thinking_config`** | Object | Chat | 對應 Gemini 的 ThinkingConfig。 |
| **`aspect_ratio`** | Text | Images | 輸出長寬比（例如 `"16:9"`、`"1:1"`、`"9:16"`）。 |
| **`generation_config`** | Object | Images | Gemini 生成設定物件（例如 `{"responseModalities": ["IMAGE"], "candidateCount": 2}`）。 |
| **`safety_settings`** | List | Images | 自訂安全門檻篩選器（例如 `[{"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"}]`）。 |
| **`tools`** | List | Images | 啟用接地（例如 `[{"google_search": {}}]`）。僅適用於 `gemini-3-pro-image-preview`。 |

### 使用 `extra_body` 的範例 {#extra-body-example}

以下範例示範如何使用 `extra_body` 設定 `cached_content`：


=== "Python"

      ```python
      from openai import OpenAI

      client = OpenAI(
          api_key=MY_API_KEY,
          base_url="https://generativelanguage.googleapis.com/v1beta/"
      )

      stream = client.chat.completions.create(
          model="gemini-3.8-flash",
          n=1,
          messages=[
              {
                  "role": "user",
                  "content": "Summarize the video"
              }
          ],
          stream=True,
          stream_options={'include_usage': True},
          extra_body={
              'extra_body':
              {
                  'google': {
                    'cached_content': "cachedContents/0000aaaa1111bbbb2222cccc3333dddd4444eeee"
                }
              }
          }
      )

      for chunk in stream:
          print(chunk)
          print(chunk.usage.to_dict())
      ```


## 列出模型 {#list-models}

取得可用的 Gemini 模型清單：


=== "Python"

      ```python
      from openai import OpenAI

      client = OpenAI(
        api_key="GEMINI_API_KEY",
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
      )

      models = client.models.list()
      for model in models:
        print(model.id)
      ```

=== "JavaScript"

      ```javascript
      import OpenAI from "openai";

      const openai = new OpenAI({
        apiKey: "GEMINI_API_KEY",
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      });

      async function main() {
        const list = await openai.models.list();

        for await (const model of list) {
          console.log(model);
        }
      }
      await main();
      ```

=== "REST"

      ```bash
      curl https://generativelanguage.googleapis.com/v1beta/openai/models \
      -H "Authorization: Bearer GEMINI_API_KEY"
      ```


## 擷取模型 {#retrieve-model}

擷取指定的 Gemini 模型：


=== "Python"

      ```python
      from openai import OpenAI

      client = OpenAI(
        api_key="GEMINI_API_KEY",
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
      )

      model = client.models.retrieve("gemini-4-hydrogen")
      print(model.id)
      ```

=== "JavaScript"

      ```javascript
      import OpenAI from "openai";

      const openai = new OpenAI({
        apiKey: "GEMINI_API_KEY",
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      });

      async function main() {
        const model = await openai.models.retrieve("gemini-4-hydrogen");
        console.log(model.id);
      }

      await main();
      ```

=== "REST"

      ```bash
      curl https://generativelanguage.googleapis.com/v1beta/openai/models/gemini-4-hydrogen \
      -H "Authorization: Bearer GEMINI_API_KEY"
      ```


## 目前限制 {#current-limitations}

在我們持續擴充功能支援的同時，OpenAI 程式庫的支援仍處於 beta 階段。

若你對支援的參數、即將推出的功能有疑問，或在開始使用 Gemini 時遇到任何問題，歡迎加入我們的 [Developer Forum](https://discuss.ai.google.dev/c/gemini-api/4)。

## 後續步驟 {#whats-next}

歡迎試用我們的 [OpenAI Compatibility Colab](https://colab.sandbox.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_OpenAI_Compatibility.ipynb)，逐步操作更詳細的範例。

