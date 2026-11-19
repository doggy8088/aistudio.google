# API 版本說明

本文件概略說明 Gemini API 的 `v1`
與 `v1beta` 版本之間的差異。

* **v1**：API 的穩定版本。穩定版本中的功能
  在主要版本的整個生命週期內都受到完整支援。若有任何
  破壞性變更，將建立新的 API 主要版本，現有版本
  則在合理的期間後淘汰。
  非破壞性變更可以在不變更主要版本的情況下
  導入 API。**Interactions API** 及其核心功能
  已在 `v1` 中正式提供。
* **v1beta**：此版本包含早期功能與能力，
  目前仍在積極開發中。`v1beta` 中的功能可能會隨著
  我們依回饋所做的調整而變更，但能讓你搶先試用
  尚未晉升為穩定版的新能力。


!!! warning " "

      **最新版 SDK 預設使用 `v1`。**自 2026 年 11 月的主要版本起，
      Google Gen AI SDK 除非你有設定版本，否則一律呼叫 `v1`。較早的版本
      預設使用 `v1beta`。若你升級後使用[下表](/api-reference/api-versions/#feature-support)中
      任何僅限 `v1beta` 的功能，例如 Live API、顯式上下文快取
      或代管代理，這些呼叫在你將 API 版本設為 `v1beta` 之前都會失敗。
      請參閱[在 SDK 中設定 API 版本](/api-reference/api-versions/#configure-api-version)。


## 能力與功能支援 {#feature-support}

下表詳列各項能力在 `v1`（GA）與 `v1beta`（Beta）中的可用性。
除非另有說明，核心 API 能力與工具同時適用於
Interactions API 與 `generateContent`：


!!! note " "

      大多數模型同時支援 `v1` 與 `v1beta`。仰賴僅限 `v1beta` 功能的模型
      可能無法在 `v1` 上使用。詳情請參閱
      [模型卡](/docs/models/)。本表追蹤各功能在 `v1` 與 `v1beta`
      **API 版本**（端點路由與結構定義參數）中的可用性。


| 功能 | v1 | v1beta |
| :--- | :---: | :---: |
| **核心 API 能力** |  |  |
| [Interactions API](/docs/get-started/) | 支援 | 支援 |
| [函式呼叫](/docs/function-calling/) | 支援 | 支援 |
| [結構化輸出](/docs/structured-output/) | 支援 | 支援 |
| [思考／推理](/docs/thinking/) | 支援 | 支援 |
| [系統指令](/docs/text-generation/#system-instructions) | 支援 | 支援 |
| [音訊輸出（語音設定）](/docs/speech-generation/) |  | 支援 |
| [音訊轉錄（轉錄設定）](/docs/transcribe/) |  | 支援 |
| [服務層級（Priority／Flex）](/docs/optimization/#inference-tiers) | 支援 | 支援 |
| **工具** |  |  |
| [程式碼執行工具](/docs/code-execution/) | 支援 | 支援 |
| [Google 搜尋接地](/docs/google-search/) | 支援 | 支援 |
| [Google 地圖接地](/docs/maps-grounding/) | 支援 | 支援 |
| [URL 上下文工具](/docs/url-context/) | 支援 | 支援 |
| [File Search 工具](/docs/file-search/) | 支援 | 支援 |
| [Computer Use 工具](/docs/computer-use/) | 支援 | 支援 |
| [MCP 伺服器工具](/docs/function-calling/#mcp) | 支援 | 支援 |
| **即時 API** |  |  |
| [Live API (WebSockets)](/docs/live-api/) |  | 支援 |
| [Live Music API](/docs/realtime-music-generation/) |  | 支援 |
| [臨時 token（Live API）](/docs/live-api/ephemeral-tokens/) |  | 支援 |
| **平台 API** |  |  |
| [Models API](/docs/models/) | 支援 | 支援 |
| [Files 服務路由](/docs/files/) | 支援 | 支援 |
| [File Search Stores 路由](/docs/file-search/#file-search-stores) | 支援 | 支援 |
| [Agents API](/docs/agents/) |  | 支援 |
| [Webhooks API](/docs/webhooks/) |  | 支援 |
| [顯式上下文快取](/docs/caching/?generate-content=true#explicit-caching) |  | 支援 |

## 在 SDK 中設定 API 版本 {#configure-api-version}

最新版 Gemini API SDK 預設使用 `v1`。較早的 SDK 版本預設使用
`v1beta`。若要使用僅限 `v1beta` 的功能，請如下列程式碼範例所示，
明確設定 API 版本。你也可以設定
`GOOGLE_GENAI_API_VERSION` 環境變數（例如
`GOOGLE_GENAI_API_VERSION=v1beta`）。在程式碼中設定的版本
優先於環境變數。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Explain how AI works",
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({
        httpOptions: { apiVersion: "v1beta" },
      });

      async function main() {
        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Explain how AI works",
        });
        console.log(interaction.output_text);
      }

      await main();
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Explain how AI works"
        }'
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.types.HttpOptions;

      Client client = Client.builder()
          .httpOptions(HttpOptions.builder().apiVersion("v1beta").build())
          .build();

      CreateModelInteraction req = CreateModelInteraction.builder()
          .model(Model.of("gemini-3.6-flash"))
          .input(InteractionsInput.of("Explain how AI works"))
          .build();
      var interaction = client.interactions.create(CreateInteractionRequestBody.of(req)).interaction().get();
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
          client, err := genai.NewClient(ctx, &genai.ClientConfig{
              HTTPOptions: genai.HTTPOptions{
                  APIVersion: "v1beta",
              },
          })
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-3.6-flash"),
                  Input: interactions.NewInteractionsInput("Explain how AI works"),
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


