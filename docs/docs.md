
  
# 歡迎使用 Gemini API  

  透過 Gemini API，從簡單的提示詞出發，打造可正式上線的應用程式與代理。
    運用 Gemini 處理複雜的程式設計與多模態推理，透過 Decisions API 取得經校準的決策結果，或將多步驟工作交給受管理代理完成。
    透過 Live API 串流語音與影片，或使用 Nano Banana 生成圖片、使用 Gemini Omni 生成影片、使用 Lyria 生成音樂。

  [開始使用](/docs/get-started/) [建立 API 金鑰](https://aistudio.google.com/apikey)

  

  
  

=== "代理"

      ```bash
      # Set up your coding agent with these tools

      # Search live docs with the MCP server
      npx add-mcp "https://gemini-api-docs-mcp.dev"

      # Add skills for current SDK syntax and rules
      npx skills add google-gemini/gemini-skills --skill gemini-api-dev

      # In Antigravity, install both with one plugin
      agy plugin install https://github.com/google-gemini/gemini-skills

      # Let your agent call the API from the terminal
      curl -fsSL https://raw.githubusercontent.com/google-gemini/gemini-api-cli/main/scripts/install.sh | bash
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-carbon",
          input="Explain how AI works in a few words"
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-4-carbon",
        input: "Explain how AI works in a few words",
      });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "model": "gemini-4-carbon",
          "input": "Explain how AI works in a few words"
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = new Client();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-carbon"))
              .input(InteractionsInput.of("Explain how AI works in a few words"))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println(interaction.outputText().orElse(""));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-carbon"),
                  Input: interactions.NewInteractionsInput("Explain how AI works in a few words"),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if res.Interaction.OutputText != nil {
              fmt.Println(*res.Interaction.OutputText)
          }
      }
      ```

=== "CLI"

      ```bash
      gemini-api generate "Explain how AI works in a few words" -m gemini-4-carbon
      ```


  


## 認識各款模型 {#meet-the-models}

在[選擇模型](/docs/choosing-a-model/)中，比較我們各款模型的推理深度、延遲與成本。


  

**Gemini 4 Carbon**

我們能力最強的推理模型，具備共用的 1M 上下文視窗，長篇解碼長度最高可達 1Mtokens。

*   *模型代碼* **gemini-4-carbon**
  *   *上下文* **1Mtokens**
  *   *輸出上限* **64K / 1Mtokens**
  *   *模態* **文字、圖片、音訊、影片、PDF**

  

  
  [在 AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-4-carbon) [查看 Gemini 4 Carbon 模型詳細資訊](/docs/models/gemini-4-carbon/)


  

**Gemini 4 Neon**

帶來前沿級智慧，端到端任務完成速度快，適用於複雜的軟體工程、知識工作與科學工作流程，具備共用的 1M 上下文視窗，長篇解碼長度最高可達 1Mtokens。

*   *模型代碼* **gemini-4-neon**
  *   *上下文* **1Mtokens**
  *   *輸出上限* **64K / 1Mtokens**
  *   *模態* **文字、圖片、音訊、影片、PDF**

  

  
  [在 AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-4-neon) [查看 Gemini 4 Neon 模型詳細資訊](/docs/models/gemini-4-neon/)


  

**Gemini 4 Hydrogen**

讓所有人都能享有尖端智慧，兼具速度與效率，適合日常程式設計與代理工作流程，同樣具備共用的 1M 上下文視窗，長篇解碼長度最高可達 1Mtokens。

*   *模型代碼* **gemini-4-hydrogen**
  *   *上下文* **1Mtokens**
  *   *輸出上限* **64K / 1Mtokens**
  *   *模態* **文字、圖片、音訊、影片、PDF**

  

  
  [在 AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-4-hydrogen) [查看 Gemini 4 Hydrogen 模型詳細資訊](/docs/models/gemini-4-hydrogen/)


  

**Gemini Decision 1**

專為快速決策設計的多模態模型，能以零輸出 tokens 完成經校準的是／否、選擇與評分量表決策。

*   *模型代碼* **gemini-decision-1**
  *   *上下文* **262Ktokens**
  *   *輸出上限* **0tokens（1,000 個問題）**
  *   *模態* **文字、圖片、音訊、影片、PDF**

  

  
  [在 AI Studio 中試用](https://aistudio.google.com/apps/bundled/gemini-decisions-api-playground) [查看 Gemini Decision 1 模型詳細資訊](/docs/models/gemini-decision-1/)


  

**Nano Banana 2.1**

高效率的圖片生成與編輯模型，視覺品質、文字排版與多輪一致性皆有所提升。

*   *模型代碼* **gemini-nano-banana-2.1**
  *   *上下文* **128Ktokens**
  *   *輸出上限* **32Ktokens**
  *   *模態* **文字、圖片、影片、PDF → 圖片、文字**

  

  
  [在 AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=gemini-nano-banana-2.1) [查看 Nano Banana 2.1 模型詳細資訊](/docs/models/gemini-nano-banana-2.1/)


  

**[查看所有模型](/docs/models/)**


## 探索各項功能 {#explore-capabilities}


=== "圖片"


    === "Python"

          ```python
          import base64
          from google import genai

          client = genai.Client()

          interaction = client.interactions.create(
              model="gemini-nano-banana-2.1",
              input="Generate an image of a nano banana dish in a fancy restaurant",
              response_format={"type": "image", "aspect_ratio": "16:9", "image_size": "2K"},
          )

          with open("nano_banana.png", "wb") as f:
              f.write(base64.b64decode(interaction.output_image.data))
          ```

    === "JavaScript"

          ```javascript
          import { GoogleGenAI } from "@google/genai";
          import * as fs from "node:fs";

          const ai = new GoogleGenAI({});

          const interaction = await ai.interactions.create({
            model: "gemini-nano-banana-2.1",
            input: "Generate an image of a nano banana dish in a fancy restaurant",
            response_format: { type: "image", aspect_ratio: "16:9", image_size: "2K" },
          });

          fs.writeFileSync("nano_banana.png", Buffer.from(interaction.output_image.data, "base64"));
          ```


    ### 圖片生成

      使用 Nano Banana 模型原生生成與編輯高度貼合情境的圖片，可透過文字、圖片或交錯的多模態提示詞進行。


      *    **最高 4K 解析度**，並可彈性調整長寬比
      *    **多輪編輯**與角色一致性
      *    **以搜尋接地**提升視覺準確度與文字呈現效果


      [閱讀文件](/docs/image-generation/)

=== "影片"


    === "Python"

          ```python
          import base64
          from google import genai

          client = genai.Client()

          interaction = client.interactions.create(
              model="gemini-omni-1.2-flash",
              input="A cinematic close-up of two people talking by a window in the rain",
          )

          with open("dialogue_example.mp4", "wb") as f:
              f.write(base64.b64decode(interaction.output_video.data))
          ```

    === "JavaScript"

          ```javascript
          import { GoogleGenAI } from "@google/genai";
          import * as fs from "node:fs";

          const ai = new GoogleGenAI({});

          const interaction = await ai.interactions.create({
            model: "gemini-omni-1.2-flash",
            input: "A cinematic close-up of two people talking by a window in the rain",
          });

          if (interaction.output_video?.data) {
            fs.writeFileSync(
              "dialogue_example.mp4",
              Buffer.from(interaction.output_video.data, "base64")
            );
          }
          ```


    ### 影片生成

      透過文字或圖片提示詞，建立具備原生同步對話、音效與環境音訊的高畫質影片。


      *    **原生音訊與對話**，與畫面動作同步
      *    **影格插補**，可控制首尾影格
      *    **參考圖片**，用於保留角色與風格


      [閱讀文件](/docs/video/)

=== "語音"


    === "Python"

          ```python
          import asyncio
          from google import genai
          from google.genai import types

          client = genai.Client(http_options={"api_version": "v1beta"})

          async def main():
              config = types.LiveConnectConfig(response_modalities=["AUDIO"])
              async with client.aio.live.connect(
                  model="gemini-3.8-live-preview", config=config
              ) as session:
                  await session.send_client_content(
                      turns={"parts": [{"text": "Hello! Tell me a quick fun fact."}]}
                  )
                  async for response in session.receive():
                      if response.data is not None:
                          # Stream raw PCM audio bytes to speaker
                          pass

          asyncio.run(main())
          ```

    === "JavaScript"

          ```javascript
          import { GoogleGenAI, Modality } from "@google/genai";

          const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

          const session = await ai.live.connect({
            model: "gemini-3.8-live-preview",
            config: { responseModalities: [Modality.AUDIO] },
            callbacks: {
              onmessage: (message) => {
                if (message.serverContent?.modelTurn) {
                  // Handle low-latency streaming audio chunks
                }
              },
            },
          });

          session.sendClientContent({
            turns: [{ parts: [{ text: "Hello! Tell me a quick fun fact." }] }],
          });
          ```


    ### 使用 Live API 的語音代理

      打造即時、雙向的語音與影片代理，具備次秒級延遲、自然的插話處理與即時工具呼叫能力。


      *    **即時 WebSocket 串流**，適用於音訊與影片
      *    **自然的語音活動偵測**與打斷處理
      *    **富有表現力的多語言語音**，具備情感化對話


      [閱讀文件](/docs/live-api/)

=== "決策"


    === "Python"

          ```python
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})

          result = client.decisions.create(
              model="gemini-decision-1",
              input="The blue mug I ordered on Monday arrived cracked on Wednesday.",
              questions={
                  "is_damaged": {
                      "type": "noul",
                      "instructions": "Did the item arrive damaged?",
                  },
              },
          )

          answer = result.answers["is_damaged"]
          print(f"P(damaged)={answer.noul:.2f} confidence={answer.confidence:.2f}")
          ```

    === "JavaScript"

          ```javascript
          import { GoogleGenAI } from "@google/genai";

          const ai = new GoogleGenAI({ apiVersion: "v1beta" });

          const result = await ai.decisions.create({
            model: "gemini-decision-1",
            input: "The blue mug I ordered on Monday arrived cracked on Wednesday.",
            questions: {
              is_damaged: {
                type: "noul",
                instructions: "Did the item arrive damaged?",
              },
            },
          });

          const answer = result.answers?.is_damaged;
          if (answer?.type === "noul") {
            console.log(`P(damaged)=${answer.noul} confidence=${answer.confidence}`);
          }
          ```


    ### 經校準的決策

      針對文字、圖片、影片、音訊與 PDF，評估具型別的是／否、單選與評分量表問題，透過 [Gemini Decision 1](/docs/models/gemini-decision-1/) 以零輸出 tokens 完成。


      *    **經校準的機率**，涵蓋是／否、選擇與有序評分量表
      *    **最多 1,000 個獨立問題**，共用同一份輸入，僅需單次預填即可完成
      *    **零輸出 tokens**，涵蓋文字、圖片、音訊、影片與 PDF 輸入


      [閱讀文件](/docs/decisions-api/)

=== "思考"


    === "Python"

          ```python
          from google import genai

          client = genai.Client()

          interaction = client.interactions.create(
              model="gemini-4-hydrogen",
              input="Find the flaw in this distributed lock protocol and fix it.",
              generation_config={
                  "thinking_level": "high",
                  "thinking_summaries": "auto",
              },
          )

          for step in interaction.steps:
              if step.type == "thought":
                  for summary in step.summary or []:
                      print("Thought summary:", summary.text)
          print("Answer:", interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import { GoogleGenAI } from "@google/genai";

          const ai = new GoogleGenAI({});

          const interaction = await ai.interactions.create({
            model: "gemini-4-hydrogen",
            input: "Find the flaw in this distributed lock protocol and fix it.",
            generation_config: {
              thinking_level: "high",
              thinking_summaries: "auto",
            },
          });

          for (const step of interaction.steps) {
            if (step.type === "thought") {
              for (const summary of step.summary ?? []) {
                console.log("Thought summary:", summary.text);
              }
            }
          }
          console.log("Answer:", interaction.output_text);
          ```


    ### 自適應思考

      控制 Gemini 在回應前的推理深度，從低延遲的 `low` 思考，到深入的多步驟 `xhigh` 推理皆可調整。


      *    **可設定的思考等級**（minimal、low、medium、high、xhigh）
      *    **透明的思考摘要**，即時串流呈現
      *    **交錯推理**，橫跨工具呼叫與程式碼執行


      [閱讀文件](/docs/thinking/)

=== "工具"


    === "Python"

          ```python
          from google import genai

          client = genai.Client()

          interaction = client.interactions.create(
              model="gemini-4-hydrogen",
              input="Who won the latest F1 Grand Prix and what were the lap times?",
              tools=[{"type": "google_search"}, {"type": "code_execution"}],
          )

          print(interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import { GoogleGenAI } from "@google/genai";

          const ai = new GoogleGenAI({});

          const interaction = await ai.interactions.create({
            model: "gemini-4-hydrogen",
            input: "Who won the latest F1 Grand Prix and what were the lap times?",
            tools: [{ type: "google_search" }, { type: "code_execution" }],
          });

          console.log(interaction.output_text);
          ```


    ### 內建工具與函式呼叫

      透過託管工具與自訂函式宣告，將 Gemini 連接到即時資訊、運算資源與您自己的後端 API。


      *    **Google Search 與 URL Context**，用於即時網路接地
      *    **Code Execution**，在安全的 Python 沙箱中執行
      *    **Custom Function Calling**，支援平行多工具協調


      [閱讀文件](/docs/tools/)

=== "結構化輸出"


    === "Python"

          ```python
          from google import genai
          from pydantic import BaseModel, Field

          class FeedbackAnalysis(BaseModel):
              sentiment: str = Field(description="positive, neutral, or negative")
              summary: str = Field(description="One-sentence summary of the feedback.")
              action_items: list[str]

          client = genai.Client()

          interaction = client.interactions.create(
              model="gemini-4-hydrogen",
              input="The new dashboard is fast, but exporting CSVs fails on mobile.",
              response_format={
                  "type": "text",
                  "mime_type": "application/json",
                  "schema": FeedbackAnalysis.model_json_schema(),
              },
          )

          print(interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import { GoogleGenAI } from "@google/genai";
          import { z } from "zod";

          const FeedbackSchema = z.object({
            sentiment: z.enum(["positive", "neutral", "negative"]),
            summary: z.string(),
            actionItems: z.array(z.string()),
          });

          const ai = new GoogleGenAI({});

          const interaction = await ai.interactions.create({
            model: "gemini-4-hydrogen",
            input: "The new dashboard is fast, but exporting CSVs fails on mobile.",
            response_format: {
              type: "text",
              mime_type: "application/json",
              schema: z.toJSONSchema(FeedbackSchema),
            },
          });

          console.log(JSON.parse(interaction.output_text));
          ```


    ### 結構化輸出

      限制 Gemini 的回應遵循嚴格的 JSON Schema、Pydantic 模型或 Zod 型別，讓下游自動化更可靠。


      *    **保證符合 JSON Schema**，每次回應皆然
      *    **原生 Pydantic 與 Zod** 結構定義整合
      *    **與工具相容**，例如 Google Search 與 Code Execution


      [閱讀文件](/docs/structured-output/)

=== "長上下文"


    === "Python"

          ```python
          from google import genai

          client = genai.Client()

          uploaded_file = client.files.upload(file="full_codebase_archive.txt")

          interaction = client.interactions.create(
              model="gemini-4-hydrogen",
              input=[
                  {"type": "file", "file_uri": uploaded_file.uri},
                  {
                      "type": "text",
                      "text": "Trace how authentication tokens are refreshed across all services.",
                  },
              ],
          )

          print(interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import { GoogleGenAI } from "@google/genai";

          const ai = new GoogleGenAI({});

          const uploadedFile = await ai.files.upload({
            file: "full_codebase_archive.txt",
          });

          const interaction = await ai.interactions.create({
            model: "gemini-4-hydrogen",
            input: [
              { type: "file", fileUri: uploadedFile.uri },
              {
                type: "text",
                text: "Trace how authentication tokens are refreshed across all services.",
              },
            ],
          });

          console.log(interaction.output_text);
          ```


    ### 長上下文

      在單一提示詞中輸入多達 100 萬 tokens 的程式碼、影片、音訊或文件，進行深入的跨檔案推理與情境內學習。


      *    **超過 1Mtokens的上下文視窗**（約 50,000 行程式碼或 8 本小說）
      *    **近乎完美的回想能力**，涵蓋長篇多模態輸入
      *    **上下文快取**，降低重複提示詞的成本與延遲


      [閱讀文件](/docs/long-context/)

=== "函式呼叫"


    === "Python"

          ```python
          from google import genai

          schedule_meeting = {
              "type": "function",
              "name": "schedule_meeting",
              "description": "Schedules a meeting with attendees at a given date and time.",
              "parameters": {
                  "type": "object",
                  "properties": {
                      "attendees": {"type": "array", "items": {"type": "string"}},
                      "date": {"type": "string"},
                      "time": {"type": "string"},
                      "topic": {"type": "string"},
                  },
                  "required": ["attendees", "date", "time", "topic"],
              },
          }

          client = genai.Client()

          interaction = client.interactions.create(
              model="gemini-4-hydrogen",
              input="Schedule a meeting with Bob and Alice tomorrow at 10:00 AM about Q3 planning.",
              tools=[schedule_meeting],
          )

          for step in interaction.steps:
              if step.type == "function_call":
                  print(step.name, step.arguments)
          ```

    === "JavaScript"

          ```javascript
          import { GoogleGenAI } from "@google/genai";

          const ai = new GoogleGenAI({});

          const scheduleMeeting = {
            type: "function",
            name: "schedule_meeting",
            description: "Schedules a meeting with attendees at a given date and time.",
            parameters: {
              type: "object",
              properties: {
                attendees: { type: "array", items: { type: "string" } },
                date: { type: "string" },
                time: { type: "string" },
                topic: { type: "string" },
              },
              required: ["attendees", "date", "time", "topic"],
            },
          };

          const interaction = await ai.interactions.create({
            model: "gemini-4-hydrogen",
            input: "Schedule a meeting with Bob and Alice tomorrow at 10:00 AM about Q3 planning.",
            tools: [scheduleMeeting],
          });

          for (const step of interaction.steps) {
            if (step.type === "function_call") {
              console.log(step.name, step.arguments);
            }
          }
          ```


    ### 函式呼叫

      透過結構化函式宣告與自動引數擷取，將 Gemini 連接到您自己的 API、資料庫與後端服務。


      *    **平行與組合式**多步驟函式呼叫
      *    **嚴格遵循結構定義**的工具引數
      *    **無縫整合**內建工具與思考功能


      [閱讀文件](/docs/function-calling/)

=== "文件理解"


    === "Python"

          ```python
          import base64
          from google import genai

          client = genai.Client()

          with open("financial_report.pdf", "rb") as f:
              pdf_base64 = base64.b64encode(f.read()).decode("utf-8")

          interaction = client.interactions.create(
              model="gemini-4-hydrogen",
              input=[
                  {
                      "type": "document",
                      "data": pdf_base64,
                      "mime_type": "application/pdf",
                  },
                  {
                      "type": "text",
                      "text": "Summarize the key revenue drivers and extract the Q4 table.",
                  },
              ],
          )

          print(interaction.output_text)
          ```

    === "JavaScript"

          ```javascript
          import { GoogleGenAI } from "@google/genai";
          import * as fs from "node:fs";

          const ai = new GoogleGenAI({});

          const pdfData = fs.readFileSync("financial_report.pdf", {
            encoding: "base64",
          });

          const interaction = await ai.interactions.create({
            model: "gemini-4-hydrogen",
            input: [
              {
                type: "document",
                data: pdfData,
                mime_type: "application/pdf",
              },
              {
                type: "text",
                text: "Summarize the key revenue drivers and extract the Q4 table.",
              },
            ],
          });

          console.log(interaction.output_text);
          ```


    ### 文件理解

      處理多達 1,000 頁的 PDF，透過原生視覺與文字理解能力，解析表格、圖表、示意圖與版面配置。


      *    **原生視覺型 PDF 解析**，超越單純的 OCR
      *    **單份文件最多 1,000 頁**，單次請求即可處理
      *    **結構化擷取**複雜表格、表單與圖形


      [閱讀文件](/docs/document-processing/)


## 建立代理 {#create-agents}


  
  Managed Agents 為 Gemini 提供工作區，讓它能自行規劃並完成任務。只需單次請求，Gemini 就能在託管的沙箱環境中撰寫並執行程式碼、搜尋網路並建立檔案。您可以先使用我們預先建置的 Antigravity 代理，或以自己的指令與工具加以自訂。

  [代理快速入門](/docs/managed-agents-quickstart/) [在 AI Studio 中試用](https://aistudio.google.com/prompts/new_chat?model=antigravity-preview-09-2026)

  

  
  

=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          agent="antigravity-preview-09-2026",
          input=(
              "Research the top 5 sustainable fashion brands, "
              "compare their materials and pricing tiers, and "
              "build an interactive dashboard in analysis.html."
          ),
          environment="remote"
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await ai.interactions.create({
        agent: "antigravity-preview-09-2026",
        input:
          "Research the top 5 sustainable fashion brands, " +
          "compare their materials and pricing tiers, and " +
          "build an interactive dashboard in analysis.html.",
        environment: "remote",
      });

      console.log(interaction.output_text);
      ```

=== "REST"

      ```bash
      curl -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -d '{
          "agent": "antigravity-preview-09-2026",
          "input": "Research the top 5 sustainable fashion brands, compare their materials and pricing tiers, and build an interactive dashboard in analysis.html.",
          "environment": "remote"
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.AgentOption;
      import com.google.genai.gaos.models.interactions.CreateAgentInteraction;
      import com.google.genai.gaos.models.interactions.CreateAgentInteractionEnvironment;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      CreateAgentInteraction params =
          CreateAgentInteraction.builder()
              .agent(AgentOption.of("antigravity-preview-09-2026"))
              .input(
                  InteractionsInput.of(
                      "Research the top 5 sustainable fashion brands, "
                          + "compare their materials and pricing tiers, and "
                          + "build an interactive dashboard in analysis.html."))
              .environment(CreateAgentInteractionEnvironment.of("remote"))
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params))
              .interaction()
              .get();

      System.out.println(interaction.outputText().orElse(""));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateAgentInteraction{
                  Agent: interactions.AgentOption("antigravity-preview-09-2026"),
                  Input: interactions.NewInteractionsInput(
                      "Research the top 5 sustainable fashion brands, " +
                          "compare their materials and pricing tiers, and " +
                          "build an interactive dashboard in analysis.html.",
                  ),
                  Environment: genai.Ptr(interactions.NewCreateAgentInteractionEnvironment("remote")),
              }),
          })
          if err != nil {
              log.Fatal(err)
          }
          if res.Interaction.OutputText != nil {
              fmt.Println(*res.Interaction.OutputText)
          }
      }
      ```

=== "CLI"

      ```bash
      gemini-api agent run "Research the top 5 sustainable fashion brands, compare their materials and pricing tiers, and build an interactive dashboard in analysis.html." \
        --agent antigravity-preview-09-2026 \
        --body '{"environment":"remote"}'
      ```


  


## Interactions API {#interactions-api}

**Interactions API** 自 2026 年 6 月起已成為我們的預設介面，也是今後使用 Gemini 模型與代理進行開發的最佳方式。若您要開始新專案，建議使用 Interactions API。`generateContent` API 雖然仍受支援，但目前已視為舊版 API。


  

**[Interactions 總覽](/docs/interactions-overview/)**

了解 Interactions API 如何管理對話狀態、訊息與輸出格式。


  

**[遷移指南](/docs/migrate-to-interactions/)**

逐步指南，協助您將程式碼從 generateContent 轉換至 Interactions API。


  

**[串流](/docs/streaming/)**

串流即時 token、漸進式思考內容與工具呼叫事件。


