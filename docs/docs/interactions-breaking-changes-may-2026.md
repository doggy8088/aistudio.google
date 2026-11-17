# Interactions API：重大變更遷移指南（2026 年 5 月）


!!! warning " "

      **重大變更**：本指南所述的變更屬於 Interactions API 的重大變更，舊版結構將於 **2026 年 6 月 8 日**移除。請使用 `Api-Revision` 要求標頭來[管理遷移作業](/docs/interactions-breaking-changes-may-2026/#how-to-migrate)。


`v1beta` Interactions API 將導入重大變更，重新調整 API 的結構，以支援執行中途引導、非同步工具呼叫等未來功能。本頁說明變更內容，並提供變更前後的程式碼範例，協助你完成遷移。變更分為兩大類：

1. [**Steps 結構**](/docs/interactions-breaking-changes-may-2026/#steps-schema)：新的 `steps` 陣列取代 `outputs` 陣列，為每一輪互動提供結構化的時間軸。
2. [**輸出格式設定**](/docs/interactions-breaking-changes-may-2026/#output-format-config)：新的多型 `response_format` 整合所有輸出格式控制項，並移除 `response_mime_type`。

請依照[如何遷移至新結構](/docs/interactions-breaking-changes-may-2026/#how-to-migrate)中的步驟，更新你的整合方式。

## 核心變更：`outputs` 改為 `steps` {#steps-schema}

新結構將 `outputs` 陣列改為 `steps` 陣列。

- **舊版**：回應傳回扁平的 `outputs` 陣列，僅包含模型產生的內容。
- **新結構**：回應傳回 `steps` 陣列，其中包含帶有類型判別欄位的結構化步驟。

`POST /interactions` 僅傳回輸出步驟；`GET /interactions/{id}` 則傳回完整的步驟時間軸，包括最初的 `user_input` 步驟。

### 基本輸入/輸出（單次呼叫） {#basic-unary}

#### 變更前（舊版）


=== "Python"

      ```python
      # Request
      interaction = client.interactions.create(
          model="gemini-3.8-flash", input="Tell me a joke."
      )

      # Response access
      print(interaction.outputs[-1].text)
      ```

=== "JavaScript"

      ```javascript
      // Request
      const interaction = await client.interactions.create({
          model: 'gemini-3.8-flash',
          input: 'Tell me a joke.'
      });

      // Response access
      console.log(interaction.outputs[-1].text);
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-3.8-flash",
          "input": "Tell me a joke."
        }'
      ```

      ```none
      // Response
      {
        "id": "int_123",
        "role": "model",
        {{ '<strong>' }}"outputs": [
          {
            "type": "text",
            "text": "Why did the chicken cross the road?"
          }
        ]{{ '</strong>' }}
      }
      ```


#### 變更後（新結構）


=== "Python"

      ```python
      # Request
      interaction = client.interactions.create(
          model="gemini-3.8-flash", input="Tell me a joke."
      )

      # Response access (Recommended sugar)
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      // Request
      const interaction = await client.interactions.create({
          model: 'gemini-3.8-flash',
          input: 'Tell me a joke.'
      });

      // Response access (Recommended sugar)
      console.log(interaction.output_text);
      ```

      注意：如需 SDK 便利屬性的詳細資訊（包括 `.output_text`、`.output_image` 與 `.output_audio`），請參閱總覽中的[透過 SDK 便利屬性存取輸出](/docs/interactions-overview/#sdk-sugar)。

=== "REST"

      ```bash
      # Opt-in needed before May 26th
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        {{ '**' }}-H "Api-Revision: 2026-05-20" \{{ '**' }}
        -d '{
          "model": "gemini-3.8-flash",
          "input": "Tell me a joke."
        }'
      ```

      ```html
      // POST Response
      {
        "id": "int_123",
        {{ '<strong>' }}"steps": [
          {
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "Why did the chicken cross the road?"
              }
            ]
          }
        ]{{ '</strong>' }}
      }

      // GET /v1beta/interactions/int_123 (returns full timeline including input)
      {
        "id": "int_123",
        "steps": [
          {
            "type": "user_input",
            "content": [
              { "type": "text", "text": "Tell me a joke." }
            ]
          },
          {
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "Why did the chicken cross the road?"
              }
            ]
          }
        ]
      }
      ```


### 函式呼叫 {#function-calling}

要求結構維持不變，但回應改以結構化步驟取代扁平的 `outputs` 內容。

#### 變更前（舊版）


=== "Python"

      ```python
      # Accessing function call in legacy schema
      for output in interaction.outputs:
          if output.type == "function_call":
              print(f"Calling {output.name} with {output.arguments}")
      ```

=== "JavaScript"

      ```javascript
      // Accessing function call in legacy schema
      for (const output of interaction.outputs) {
          if (output.type === 'function_call') {
              console.log(`Calling ${output.name} with ${JSON.stringify(output.arguments)}`);
          }
      }
      ```

=== "REST"

      ```json
      // Response
      {
        "id": "int_001",
        "role": "model",
        "status": "requires_action",
        {{ '<strong>' }}"outputs": [
          {
            "type": "thought",
            "signature": "abc123..."
          },
          {
            "type": "function_call",
            "id": "fc_1",
            "name": "get_weather",
            "arguments": { "location": "Boston, MA" }
          }
        ]{{ '</strong>' }}
      }
      ```


#### 變更後（新結構）


=== "Python"

      ```python
      # Accessing function call in new steps schema
      for step in interaction.steps:
          if step.type == "function_call":
              print(f"Calling {step.name} with {step.arguments}")
      ```

=== "JavaScript"

      ```javascript
      // Accessing function call in new steps schema
      for (const step of interaction.steps) {
          if (step.type === 'function_call') {
              console.log(`Calling ${step.name} with ${JSON.stringify(step.arguments)}`);
          }
      }
      ```

=== "REST"

      ```json
      // POST Response
      {
        "id": "int_001",
        "status": "requires_action",
        {{ '<strong>' }}"steps": [
          {
            "type": "thought",
            "summary": [{
              "type": "text",
              "text": "I need to check the weather in Boston..."
            }],
            "signature": "abc123..."
          },
          {
            "type": "function_call",
            "id": "fc_1",
            "name": "get_weather",
            "arguments": { "location": "Boston, MA" }
          }
        ]{{ '</strong>' }}
      }
      ```


### 伺服器端工具 {#server-side-tools}

伺服器端工具（例如 Google Search 或程式碼執行）現在會在 `steps` 陣列中產生特定的步驟類型。舊版結構將這些操作以特定內容類型的形式放在 `outputs` 陣列中，新結構則將它們移入 `steps` 陣列。以下範例使用 Google Search。

#### 變更前（舊版）


=== "Python"

      ```python
      # Accessing search results in legacy schema
      for output in interaction.outputs:
          if output.type == "google_search_call":
              print(f"Searched for: {output.arguments.queries}")
          elif output.type == "google_search_result":
              print(f"Found results: {output.result.rendered_content}")
      ```

=== "JavaScript"

      ```javascript
      // Accessing search results in legacy schema
      for (const output of interaction.outputs) {
          if (output.type === 'google_search_call') {
              console.log(`Searched for: ${output.arguments.queries}`);
          } else if (output.type === 'google_search_result') {
              console.log(`Found results: ${output.result.renderedContent}`);
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-3.8-flash",
          "input": "Who won the last Super Bowl?",
          "tools": [
            { "type": "google_search" }
          ]
        }'
      ```

      ```html
      // Response
      {
        "id": "int_456",
        {{ '<strong>' }}"outputs": [
          {
            "type": "google_search_call",
            "id": "gs_1",
            "arguments": { "queries": ["last Super Bowl winner"] }
          },
          {
            "type": "google_search_result",
            "call_id": "gs_1",
            "result": {
              "rendered_content": "...",
              "url": "https://www.nfl.com/super-bowl"
            }
          },
          {
            "type": "text",
            "text": "The Kansas City Chiefs won the last Super Bowl.",
            "annotations": [
              {
                "start_index": 4,
                "end_index": 22,
                "source": "https://www.nfl.com/super-bowl"
              }
            ]
          }
        ]{{ '</strong>' }},
        "status": "completed"
      }
      ```


#### 變更後（新結構）


=== "Python"

      ```python
      # Accessing search results in new steps schema
      for step in interaction.steps:
          if step.type == "google_search_call":
              print(f"Searched for: {step.arguments.queries}")
          elif step.type == "google_search_result":
              print(f"Found results: {step.result[0].search_suggestions}")
      ```

=== "JavaScript"

      ```javascript
      // Accessing search results in new steps schema
      for (const step of interaction.steps) {
          if (step.type === 'google_search_call') {
              console.log(`Searched for: ${step.arguments.queries}`);
          } else if (step.type === 'google_search_result') {
              console.log(`Found results: ${step.result[0].search_suggestions}`);
          }
      }
      ```

=== "REST"

      ```bash
      # Opt-in needed before May 26th
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        {{ '**' }}-H "Api-Revision: 2026-05-20" \{{ '**' }}
        -d '{
          "model": "gemini-3.8-flash",
          "input": "Who won the last Super Bowl?",
          "tools": [
            { "type": "google_search" }
          ]
        }'
      ```

      ```html
      // POST Response
      {
        "id": "int_456",
        {{ '<strong>' }}"steps": [
          {
            "type": "google_search_call",
            "id": "gs_1",
            "arguments": { "queries": ["last Super Bowl winner"] },
            "signature": "abc123..."
          },
          {
            "type": "google_search_result",
            "call_id": "gs_1",
            "result": {
              "search_suggestions": "..."
            },
            "signature": "abc123..."
          },
          {
            "type": "model_output",
            "content": [
              {
                "type": "text",
                "text": "The Kansas City Chiefs won the last Super Bowl.",
                "annotations": [
                  {
                    "type": "url_citation",
                    "url": "https://www.nfl.com/super-bowl",
                    "title": "NFL.com",
                    "start_index": 4,
                    "end_index": 22
                  }
                ]
              }
            ]
          }
        ]{{ '</strong>' }},
        "status": "completed"
      }
      ```


### 串流 {#streaming}

串流新增了以下事件類型：

#### 新的事件類型 {#event-types}

-  `interaction.created`
-  `interaction.completed`
-  `step.start`
-  `step.delta`
-  `step.stop`

`interaction.status_update` 維持不變，它會攜帶新的 `status`（例如 `in_progress` 或 `requires_action`）。每個事件都會在 JSON 負載的 `event_type` 欄位中標示其類型，與 SSE 的 `event:` 行相符。

#### 已淘汰的事件類型 {#deprecated-event-types}

下列舊版事件類型由上方列出的新事件取代：

-  `interaction.start` → `interaction.created`
-  `content.start` → `step.start`
-  `content.delta` → `step.delta`
-  `content.stop` → `step.stop`
-  `interaction.complete` → `interaction.completed`

**串流函式呼叫**：將串流與函式呼叫搭配使用時，`step.start` 事件會傳遞函式名稱，`step.delta` 事件則以部分 JSON 字串的形式串流傳遞引數（使用 `arguments_delta`）。你必須累積這些增量，才能取得完整的引數。這與單次呼叫不同，後者會一次收到完整的函式呼叫物件。

#### 範例 {#streaming-examples}

##### 變更前（舊版）


=== "Python"

      ```python
      # Legacy streaming used content.delta
      stream = client.interactions.create(
          model="gemini-3.8-flash",
          input="Explain quantum entanglement in simple terms.",
          stream=True,
      )

      for chunk in stream:
          if chunk.event_type == "content.delta":
              if chunk.delta.type == "text":
                  print(chunk.delta.text, end="", flush=True)
      ```

=== "JavaScript"

      ```javascript
      // Legacy streaming used content.delta
      const stream = await client.interactions.create({
          model: 'gemini-3.8-flash',
          input: 'Explain quantum entanglement in simple terms.',
          stream: true,
      });

      for await (const chunk of stream) {
          if (chunk.event_type === 'content.delta') {
              if (chunk.delta.type === 'text') {
                  process.stdout.write(chunk.delta.text);
              }
          }
      }
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-3.8-flash",
          "input": "Explain quantum entanglement in simple terms.",
          "stream": true
        }'
      ```

      ```none
      // Response (SSE Lines)
      // event: interaction.start
      // data: {"id": "int_123", "status": "in_progress"}
      //
      // event: content.start
      // data: {"index": 0, "type": "text"}
      //
      // event: content.delta
      // data: {"delta": {"type": "text", "text": "Quantum entanglement is..."}}
      //
      // event: content.stop
      // data: {"index": 0}
      //
      // event: interaction.complete
      // data: {"id": "int_123", "status": "done", "usage": {"total_tokens": 42}}
      ```


##### 變更後（新結構）


=== "Python"

      ```python
      # Consuming stream and handling new event types
      for event in client.interactions.create(
          model="gemini-3.8-flash",
          input="Tell me a story.",
          stream=True,
      ):
          if event.event_type == "step.delta":  # CHANGED: step.delta instead of content.delta
              if event.delta.type == "text":
                  print(event.delta.text, end="")
      ```

=== "JavaScript"

      ```javascript
      // Consuming stream and handling new event types
      const stream = await client.interactions.create({
          model: 'gemini-3.8-flash',
          input: 'Tell me a story.',
          stream: true,
      });

      for await (const event of stream) {
          if (event.event_type === 'step.delta') {  // CHANGED: step.delta instead of content.delta
              if (event.delta.type === 'text') {
                  process.stdout.write(event.delta.text);
              }
          }
      }
      ```

=== "REST"

      ```bash
      {{ '**' }}# Opt-in needed before May 26th{{ '**' }}
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -H "Accept: text/event-stream" \
        {{ '**' }}-H "Api-Revision: 2026-05-20" \{{ '**' }}
        -d '{
          "model": "gemini-3.8-flash",
          "input": "Tell me a story.",
          "stream": true
        }'
      ```

      ```none
      // Response (SSE Lines)
      // event: interaction.created
      // data: {"interaction": {"id": "int_xyz", "status": "in_progress", "object": "interaction", "model": "gemini-3.8-flash"}, "event_type": "interaction.created"}
      //
      // event: interaction.status_update
      // data: {"interaction_id": "int_xyz", "status": "in_progress", "event_type": "interaction.status_update"}
      //
      // event: step.start
      // data: {"index": 0, "step": {"type": "thought", "signature": "abc123..."}, "event_type": "step.start"}
      //
      // event: step.stop
      // data: {"index": 0, "event_type": "step.stop"}
      //
      // event: step.start
      // data: {"index": 1, "step": {"content": [{"text": "Once upon", "type": "text"}], "type": "model_output"}, "event_type": "step.start"}
      //
      // event: step.delta
      // data: {"index": 1, "delta": {"text": " a time...", "type": "text"}, "event_type": "step.delta"}
      //
      // event: step.stop
      // data: {"index": 1, "event_type": "step.stop"}
      //
      // event: interaction.completed
      // data: {"interaction": {"id": "int_xyz", "status": "completed", "usage": {"total_input_tokens": 10, "total_output_tokens": 5, "total_tokens": 15}}, "event_type": "interaction.completed"} // NEW: Dedicated completion event
      ```


### 無狀態對話記錄 {#stateless-history}

如果你在用戶端手動管理對話記錄（無狀態使用情境），就必須更新串連先前對話輪次的方式。

- **舊版**：開發人員通常會從回應中收集 `outputs` 陣列，並在下一輪透過 `input` 欄位送回。
- **新結構**：現在應從回應中收集 `steps` 陣列，傳入下一個要求的 `input` 欄位，並將你新的使用者輪次以 `user_input` 步驟附加在後。

## 輸出格式設定：`response_format` 的變更 {#output-format-config}

更新後的 API 將所有輸出格式控制項整合為單一的多型 `response_format` 欄位，讓輸出設定集中在頂層，並使 `generation_config` 專注於模型行為（例如 temperature、top_p 與 thinking）。

### 主要變更 {#response-format-changes}

- **API 移除了 `response_mime_type`**：你現在可以在 `response_format` 內的每個格式項目中指定 MIME 類型。
- **`response_format` 現在是多型物件（或陣列）**：每個項目都有一個 `type` 判別欄位（`text`、`audio`、`image`）以及各類型專屬的欄位。若要要求多種輸出模態，請傳入格式項目組成的陣列。
- **`image_config` 從 `generation_config` 移至 `response_format`**：你現在可以指定 `aspect_ratio`、`image_size` 等圖片輸出設定，寫在 `response_format` 項目中（項目需標示 `"type": "image"`）。

### 結構化輸出（JSON） {#structured-output}

新結構移除了 `response_mime_type` 欄位。請改在 `response_format` 物件（`"type": "text"`）中指定 MIME 類型與 JSON 結構。

#### 變更前（舊版）


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="gemini-3.8-flash",
          input="Summarize this article.",
          response_mime_type="application/json",
          response_format={
              "type": "object",
              "properties": {
                  "summary": {"type": "string"}
              }
          },
      )

      print(interaction.outputs[-1].text)
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          model: 'gemini-3.8-flash',
          input: 'Summarize this article.',
          response_mime_type: 'application/json',
          response_format: {
              type: 'object',
              properties: {
                  summary: { type: 'string' }
              }
          },
      });

      console.log(interaction.outputs[-1].text);
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-3.8-flash",
          "input": "Summarize this article.",
          "response_mime_type": "application/json",
          "response_format": {
            "type": "object",
            "properties": {
              "summary": { "type": "string" }
            }
          }
        }'
      ```


#### 變更後（新結構）


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="gemini-3.8-flash",
          input="Summarize this article.",
          # response_mime_type is removed -- specify mime_type inside response_format
          response_format={
              "type": "text",
              "mime_type": "application/json",
              "schema": {
                  "type": "object",
                  "properties": {
                      "summary": {"type": "string"}
                  }
              }
          },
      )

      # Print response
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          model: 'gemini-3.8-flash',
          input: 'Summarize this article.',
          // response_mime_type is removed -- specify mime_type inside response_format
          response_format: {
              type: 'text',
              mime_type: 'application/json',
              schema: {
                  type: 'object',
                  properties: {
                      summary: { type: 'string' }
                  }
              }
          },
      });

      // Print response
      console.log(interaction.output_text);
      ```

=== "REST"

      ```bash
      # Opt-in needed before May 26th
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        {{ '**' }}-H "Api-Revision: 2026-05-20" \{{ '**' }}
        -d '{
          "model": "gemini-3.8-flash",
          "input": "Summarize this article.",
          "response_format": {
            "type": "text",
            "mime_type": "application/json",
            "schema": {
              "type": "object",
              "properties": {
                "summary": { "type": "string" }
              }
            }
          }
        }'
      ```


### 圖片設定 {#image-config}

新結構移除了 `image_config`（原本位於 `generation_config`）。你現在可以在 `response_format` 項目（`"type": "image"`）中指定圖片輸出設定。

#### 變更前（舊版）


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="gemini-3.8-flash",
          input="Generate an image of a sunset over the ocean.",
          generation_config={
              "image_config": {
                  "aspect_ratio": "1:1",
                  "image_size": "1K"
              }
          },
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          model: 'gemini-3.8-flash',
          input: 'Generate an image of a sunset over the ocean.',
          generation_config: {
              image_config: {
                  aspect_ratio: '1:1',
                  image_size: '1K'
              }
          },
      });
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-3.8-flash",
          "input": "Generate an image of a sunset over the ocean.",
          "generation_config": {
            "image_config": {
              "aspect_ratio": "1:1",
              "image_size": "1K"
            }
          }
        }'
      ```


#### 變更後（新結構）


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="gemini-3.8-flash",
          input="Generate an image of a sunset over the ocean.",
          # image_config is removed from generation_config -- use response_format
          response_format={
              "type": "image",
              "mime_type": "image/jpeg",
              "aspect_ratio": "1:1",
              "image_size": "1K"
          },
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          model: 'gemini-3.8-flash',
          input: 'Generate an image of a sunset over the ocean.',
          // image_config is removed from generation_config -- use response_format
          response_format: {
              type: 'image',
              mime_type: 'image/jpeg',
              aspect_ratio: '1:1',
              image_size: '1K'
          },
      });
      ```

=== "REST"

      ```bash
      # Opt-in needed before May 26th
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        {{ '**' }}-H "Api-Revision: 2026-05-20" \{{ '**' }}
        -d '{
          "model": "gemini-3.8-flash",
          "input": "Generate an image of a sunset over the ocean.",
          "response_format": {
            "type": "image",
            "mime_type": "image/jpeg",
            "aspect_ratio": "1:1",
            "image_size": "1K"
          }
        }'
      ```


### 音訊設定 {#audio-config}

新結構將 `response_modalities: ["audio"]` 改為 `response_format` 中的 `"type": "audio"` 項目。

#### 變更前（舊版）


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="gemini-3.1-flash-tts-preview",
          input="Say cheerfully: Have a wonderful day!",
          response_modalities=["audio"],
          generation_config={
              "speech_config": [
                  {"voice": "Kore"}
              ]
          }
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          model: 'gemini-3.1-flash-tts-preview',
          input: 'Say cheerfully: Have a wonderful day!',
          response_modalities: ['audio'],
          generation_config: {
              speech_config: [
                  { voice: 'Kore' }
              ]
          },
      });
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-3.1-flash-tts-preview",
          "input": "Say cheerfully: Have a wonderful day!",
          "response_modalities": ["audio"],
          "generation_config": {
            "speech_config": [
              { "voice": "Kore" }
            ]
          }
        }'
      ```


#### 變更後（新結構）


=== "Python"

      ```python
      interaction = client.interactions.create(
          model="gemini-3.1-flash-tts-preview",
          input="Say cheerfully: Have a wonderful day!",
          # response_modalities is removed -- use response_format
          response_format={
              "type": "audio"
          },
          generation_config={
              "speech_config": [
                  {"voice": "Kore"}
              ]
          }
      )
      ```

=== "JavaScript"

      ```javascript
      const interaction = await client.interactions.create({
          model: 'gemini-3.1-flash-tts-preview',
          input: 'Say cheerfully: Have a wonderful day!',
          // response_modalities is removed -- use response_format
          response_format: {
              type: 'audio'
          },
          generation_config: {
              speech_config: [
                  { voice: 'Kore' }
              ]
          },
      });
      ```

=== "REST"

      ```bash
      # Opt-in needed before May 26th
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions?key=$GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-3.1-flash-tts-preview",
          "input": "Say cheerfully: Have a wonderful day!",
          "response_format": {
            "type": "audio"
          },
          "generation_config": {
            "speech_config": [
              { "voice": "Kore" }
            ]
          }
        }'
      ```

      若要要求多種輸出模態（例如同時輸出文字與音訊），請將格式項目組成的陣列傳入 `response_format`，而非單一物件。


## 如何遷移至新結構 {#how-to-migrate}

### SDK 使用者 {#sdk-users}

請升級至最新版 SDK（Python ≥2.0.0、JavaScript ≥2.0.0）。SDK 會自動讓你採用新結構，除了更新讀取回應的方式（見上方範例）之外，無需變更任何程式碼。請注意，這些 SDK 版本僅支援新結構。舊版 SDK（Python 1.x.x、JavaScript 1.x.x）仍可繼續使用，直到舊版結構於 **2026 年 6 月 8 日**移除為止。

### REST API 使用者 {#raw-api-users}

在要求中加入 `Api-Revision: 2026-05-20` 標頭，即可立即採用新結構。**5 月 26 日**之後，新結構將成為所有要求的預設。你可以暫時使用 `Api-Revision: 2026-05-07` 退出，直到 **6 月 8 日** API 永久移除舊版結構為止。

### 時間表 {#timeline}

| 日期 | 階段 | SDK 使用者 | REST API 使用者 |
| --- | --- | --- | --- |
| **5 月 7 日** | 開放採用 | 新版 SDK 上市（Python ≥2.0.0、JS ≥2.0.0），升級後即自動取得新結構。 | 加入 `Api-Revision: 2026-05-20` 標頭以採用新結構，預設仍為舊版。 |
| **5 月 26 日** | 預設切換 | 若已升級，無需採取任何行動。舊版 SDK（Python 1.x.x、JS 1.x.x）仍可運作，但會傳回舊版回應。 | 新結構即日起成為預設。如需退出，請傳送 `Api-Revision: 2026-05-07` 標頭。 |
| **6 月 8 日** | 終止支援 | Python 1.x.x 與 JS 1.x.x 版 SDK 將無法再呼叫 Interactions API。 | Interactions API 移除舊版結構，`Api-Revision` 標頭將被忽略。 |


!!! note " "

      **注意**：5 月 7 日之後推出的新功能只會出現在 `steps` 回應中。使用舊版 `outputs` 結構的使用者，在完成遷移前將無法獲得新功能。


## 遷移檢查清單 {#migration-checklist}

### Steps 結構（`steps`）

- 更新程式碼，改從 `steps` 陣列（而非 `outputs`）讀取回應內容。[查看範例](/docs/interactions-breaking-changes-may-2026/#basic-unary)。
- 確認你的程式碼能處理 `user_input` 與 `model_output` 兩種步驟類型。[查看範例](/docs/interactions-breaking-changes-may-2026/#basic-unary)。
- （函式呼叫）更新程式碼，找到 `function_call` 步驟（位於 `steps` 陣列中）。[查看範例](/docs/interactions-breaking-changes-may-2026/#function-calling)。
- （伺服器端工具）更新程式碼，處理工具專屬步驟（例如 `google_search_call`、`google_search_result`）。[查看範例](/docs/interactions-breaking-changes-may-2026/#server-side-tools)。
- （無狀態記錄）更新記錄管理方式，將 `steps` 陣列傳入下一個要求的 `input` 欄位。[查看詳情](/docs/interactions-breaking-changes-may-2026/#stateless-history)。
- （僅限串流）更新用戶端，監聽新的 SSE 事件類型（`interaction.created`、`step.delta` 等）。[查看範例](/docs/interactions-breaking-changes-may-2026/#streaming)。

### 輸出格式設定（`response_format`）

- `response_mime_type` 改以 `mime_type` 欄位表示，並放在 `response_format` 內。[查看範例](/docs/interactions-breaking-changes-may-2026/#structured-output)。
- 將現有的 `response_format` JSON 結構包裝在 `{"type": "text", "schema": ...}` 物件中。[查看範例](/docs/interactions-breaking-changes-may-2026/#structured-output)。
- （圖片生成）將 `image_config` 從 `generation_config` 移至 `{"type": "image", ...}` 形式的項目，並放入 `response_format`。[查看範例](/docs/interactions-breaking-changes-may-2026/#image-config)。
- （語音生成）將 `response_modalities=["audio"]` 改為 `{"type": "audio"}` 形式的項目，並放入 `response_format`。[查看範例](/docs/interactions-breaking-changes-may-2026/#audio-config)。
- （多模態）要求多種輸出模態時，將 `response_format` 由單一物件改為陣列。

