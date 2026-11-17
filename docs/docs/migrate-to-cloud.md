# Gemini Developer API 與 Gemini platform

使用 Gemini 開發生成式 AI 解決方案時，Google 提供兩種 API 產品：[Gemini Developer API](/docs/) 與 [Gemini platform API](https://cloud.google.com/gemini-enterprise-agent-platform/overview)。

Gemini Developer API 提供建置、投入生產與擴充 Gemini 應用程式的最快途徑。除非需要特定的企業級控管功能，否則大多數開發人員都應使用 Gemini Developer API。

Gemini platform 提供完整的企業級功能與服務生態系，可用於建置與部署由 Google Cloud 支援的生成式 AI 應用程式。

我們近期簡化了這兩項服務之間的遷移流程。Gemini Developer API 與 Gemini platform API 現在都可透過統一的 [Google GenAI SDK](/docs/libraries/) 與 [Interactions API](/docs/interactions-overview/) 存取。


!!! note " "

       注意：如果你使用 AI 程式設計助理，請安裝 [Gemini API 開發技能](/docs/coding-agents/)，讓你的代理能取得最新文件與最佳做法。


## 程式碼比較：Interactions API（建議） {#interactions-api}

[Interactions API](/docs/interactions-overview/) 是使用 Gemini 模型與代理進行建置的建議方式。以下範例比較 Gemini Developer API 與 Gemini platform 之間的文字生成寫法。

### Python {#interactions-python}

你可以透過 `google-genai` 程式庫（`>= 2.3.0`）同時存取 Gemini Developer API 與 Gemini platform 服務。`google-genai` 的安裝說明請參閱 [libraries](/docs/libraries/) 頁面。


=== "Gemini Developer API"

      ```py
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Explain how AI works in a few words",
      )
      print(interaction.output_text)
      ```

=== "Gemini platform API"

      ```py
      from google import genai

      client = genai.Client(
          enterprise=True, project="your-project-id", location="global"
      )

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Explain how AI works in a few words",
      )
      print(interaction.output_text)
      ```


### JavaScript 與 TypeScript {#interactions-javascript-and-typescript}

你可以透過 `@google/genai` 程式庫（`>= 2.3.0`）同時存取 Gemini Developer API 與 Gemini platform 服務。`@google/genai` 的安裝說明請參閱 [libraries](/docs/libraries/) 頁面。


=== "Gemini Developer API"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: "Explain how AI works in a few words",
      });
      console.log(interaction.output_text);
      ```

=== "Gemini platform API"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({
        enterprise: true,
        project: "your_project",
        location: "global",
      });

      const interaction = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: "Explain how AI works in a few words",
      });
      console.log(interaction.output_text);
      ```


## 程式碼比較：generateContent API {#generate-content-api}

Interactions API 是新專案的建議選擇，但 `generateContent` API 仍持續受到支援。

### Python {#python}

你可以透過 `google-genai` 程式庫同時存取 Gemini Developer API 與 Gemini platform 服務。`google-genai` 的安裝說明請參閱 [libraries](/docs/libraries/) 頁面。


=== "Gemini Developer API"

      ```py
      from google import genai

      client = genai.Client()

      response = client.models.generate_content(
          model="gemini-4-hydrogen", contents="Explain how AI works in a few words"
      )
      print(response.text)
      ```

=== "Gemini platform API"

      ```py
      from google import genai

      client = genai.Client(
          vertexai=True, project='your-project-id', location='us-central1'
      )

      response = client.models.generate_content(
          model="gemini-4-hydrogen", contents="Explain how AI works in a few words"
      )
      print(response.text)
      ```


### JavaScript 與 TypeScript {#javascript-and-typescript}

你可以透過 `@google/genai` 程式庫同時存取 Gemini Developer API 與 Gemini platform 服務。`@google/genai` 的安裝說明請參閱 [libraries](/docs/libraries/) 頁面。


=== "Gemini Developer API"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
        const response = await ai.models.generateContent({
          model: "gemini-4-hydrogen",
          contents: "Explain how AI works in a few words",
        });
        console.log(response.text);
      }

      await main();
      ```

=== "Gemini platform API"

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      const ai = new GoogleGenAI({
         vertexai: true,
         project: 'your_project',
         location: 'your_location',
       });

       async function main() {
         const response = await ai.models.generateContent({
           model: "gemini-4-hydrogen",
           contents: "Explain how AI works in a few words",
         });
         console.log(response.text);
       }

       await main();
      ```


### Go {#go}

你可以透過 `google.golang.org/genai` 程式庫同時存取 Gemini Developer API 與 Gemini platform 服務。`google.golang.org/genai` 的安裝說明請參閱 [libraries](/docs/libraries/) 頁面。


=== "Gemini Developer API"

      ```go
      import (
        "context"
        "encoding/json"
        "fmt"
        "log"
        "google.golang.org/genai"
      )

      // Your Google API key
      const apiKey = "your-api-key"

      func main() {
        ctx := context.Background()
        client, err := genai.NewClient(ctx, nil)
        if err != nil {
            log.Fatal(err)
        }

        // Call the GenerateContent method.
        result, err := client.Models.GenerateContent(ctx, "gemini-4-hydrogen", genai.Text("Tell me about New York?"), nil)

      }
      ```

=== "Gemini platform API"

      ```go
      import (
        "context"
        "encoding/json"
        "fmt"
        "log"
        "google.golang.org/genai"
      )

      // Your Google Cloud project
      const project = "your-project"

      // A Google Cloud location like "us-central1"
      const location = "some-gcp-location"

      func main() {
        ctx := context.Background()
        client, err := genai.NewClient(ctx, &genai.ClientConfig
        {
                 Project: project,
            Location: location,
            Backend: genai.BackendVertexAI,
        })

        // Call the GenerateContent method.
        result, err := client.Models.GenerateContent(ctx, "gemini-4-hydrogen", genai.Text("Tell me about New York?"), nil)

      }
      ```


### 其他用途與平台 {#other-use-cases-and-platforms}

其他平台與用途，請參閱 [Gemini Developer API 文件](/docs/) 與 [Gemini platform 文件](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/docs/overview) 中針對特定用途的指南。

## 遷移注意事項 {#migration-considerations}

遷移時請注意：

*   你需要使用 Google Cloud 服務帳戶進行驗證。詳情請參閱 [Gemini platform 文件](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/docs/overview)。

* 你可以使用現有的 Google Cloud 專案（與你用來產生 API 金鑰的同一個專案），也可以[建立新的 Google Cloud 專案](https://cloud.google.com/resource-manager/docs/creating-managing-projects)。

*   Gemini Developer API 與 Gemini platform API 支援的區域可能不同。在預覽期間，[Gemini platform 上的 Interactions API](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/interactions/) 僅支援 `global` 端點（`location="global"`）。請參閱 [Google Cloud 上生成式 AI 的支援區域](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/docs/learn/locations-genai)清單。

* 你在 Google AI Studio 中建立的任何模型，都需要在 Gemini platform 中重新訓練。


如果你不再需要使用 Gemini API 金鑰來存取 Gemini Developer API，請遵循安全性最佳做法將其刪除。

刪除 API 金鑰的步驟如下：

1. 開啟 [Google Cloud API 憑證](https://console.cloud.google.com/apis/credentials) 頁面。

2. 找到你要刪除的 API 金鑰，並點選 **Actions** 圖示。

3. 選取 **Delete API key**。

4. 在 **Delete credential** 對話框中，選取 **Delete**。

   刪除 API 金鑰需要幾分鐘才會生效。生效完成後，任何使用已刪除 API 金鑰的流量都會遭到拒絕。


重要事項：如果你刪除的金鑰仍在正式環境中使用且需要復原，請參閱 [gcloud beta services api-keys undelete](https://cloud.google.com/sdk/gcloud/reference/beta/services/api-keys/undelete)。

## 後續步驟 {#next-steps}

*   探索 [Gemini platform 上的 Interactions API](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/interactions/) 開發人員指南。
* 參閱 [Gemini platform 上的生成式 AI 總覽](https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview)，進一步了解 Gemini platform 上的生成式 AI 解決方案。
