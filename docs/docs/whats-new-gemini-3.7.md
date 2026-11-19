# Gemini 3.7 Flash 的新功能


!!! note " "

       **Deprecated:** Gemini 3.7 Flash
      (`gemini-3.7-flash`) 已淘汰，並由
      [Gemini 3.8 Flash (`gemini-3.8-flash`)](/docs/whats-new-gemini-3.8/) 取代。它已無法
      在 Google AI Studio 中選取，傳送至
      `gemini-3.7-flash` 的 API 要求會自動路由至 `gemini-3.8-flash`。
      請將模型字串更新為 `gemini-3.8-flash`，並查閱
      [Gemini 3.8 Flash 指南](/docs/whats-new-gemini-3.8/)。 


Gemini 3.7 Flash (`gemini-3.7-flash`) 是 Gemini 3 系列中前一代的 Flash 模型，
目前已淘汰，並會自動路由至
[Gemini 3.8 Flash](/docs/whats-new-gemini-3.8/)。

本指南保留供參考使用，記錄 Gemini 3.7 Flash 導入的功能與變更。

## 模型總覽 {#new-model}

| 模型 | 模型 ID | 預設思考層級 | 說明 |
| :--- | :--- | :---: | :--- |
| Gemini 3.7 Flash（已淘汰） | `gemini-3.7-flash` | `medium` | 前一代 Flash 模型，專為程式設計、代理工作流程與多步驟執行打造。已由 [Gemini 3.8 Flash](/docs/whats-new-gemini-3.8/) 取代。 |

Gemini 3.7 Flash 支援 1M 權杖上下文視窗、64k 輸出權杖上限、可調整的思考層級（`low`、`medium`、`high`），以及與 3.6 Flash 相同的整套內建工具。

如需完整規格，請參閱
[Gemini 3.7 Flash 模型頁面](/docs/models/gemini-3.7-flash/)。

## 快速入門 {#quickstart}


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-3.7-flash",
          input="Write a responsive navigation component in React with smooth animations and dark mode toggle."
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        model: "gemini-3.7-flash",
        input: "Write a responsive navigation component in React with smooth animations and dark mode toggle.",
      });

      console.log(interaction.output_text);
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
          CreateModelInteraction req = CreateModelInteraction.builder()
              .model(Model.of("gemini-3.7-flash"))
              .input(InteractionsInput.of("Write a responsive navigation component in React with smooth animations and dark mode toggle."))
              .build();
          Interaction interaction =
              client.interactions.create(CreateInteractionRequestBody.of(req)).interaction().get();
          System.out.println(interaction.outputText().orElse(""));
      ```

=== "REST"

      ```bash
      curl "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -X POST \
        -d '{
          "model": "gemini-3.7-flash",
          "input": "Write a responsive navigation component in React with smooth animations and dark mode toggle."
        }'
      ```


## Gemini 3.7 Flash 的新功能 {#whats-new-gemini-3-7-flash}

* **程式設計與代理任務**：在真實世界的軟體工程與代理評測基準上，品質大幅提升，不僅改善問題解決能力，也減少代理迴圈失敗的情況。
* **網頁開發與更強的設計一致性**：可直接根據設計稿產生高擬真度的桌面與網頁應用程式程式碼，在設計遵循度上大幅進步，也能稽核既有程式碼庫與設計稿的差異，驗證 1:1 的設計一致性。

## 瞭解推理層級 {#understanding-reasoning-levels}

Gemini 3.7 Flash 讓開發人員能透過調整模型的思考層級，彈性控制延遲與智慧程度：

* **低思考投入**：縮短回答時間，適合延遲敏感的任務，例如事件回應管線、即時聊天、撰寫草稿與快速資料分析。
* **中（預設）**：在大多數任務上品質最佳。建議用於複雜程式碼與代理情境，首次嘗試的正確率更高。
* **高思考投入**：將模型思考與使用工具的能力發揮到極致。最適合複雜推理、困難數學，以及棘手的程式設計與代理任務。可進行延伸思考與函式呼叫，但權杖消耗與成本也更高。

如要在 Gemini 3.7 Flash 中設定思考層級：

```python
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-3.7-flash",
    input="Analyze this payment processing pipeline for race conditions during retry attempts and rewrite the transaction locks safely.",
    generation_config={
        "thinking_level": "medium"  # Balanced reasoning effort for complex tasks
    }
)

print(interaction.output_text)
```

如需多語言程式碼範例（JavaScript、Java、Go、REST）與深入的推理概念說明，請參閱 [Gemini 3.8 Flash 的推理層級說明](/docs/whats-new-gemini-3.8/#understanding-reasoning-levels)。

## Antigravity 代理支援 {#updated-antigravity-agent}

Gemini 3.7 Flash 導入了在 Gemini Managed Agents 中驅動 [Antigravity 代理](/docs/antigravity-agent/) 的支援，以及 [Google Antigravity SDK](https://antigravity.google/docs/sdk/overview/)。

如需目前的程式碼範例與最新的預設代理設定，請參閱 [Antigravity 代理指南](/docs/antigravity-agent/) 與 [Gemini 3.8 Flash 指南](/docs/whats-new-gemini-3.8/#updated-antigravity-agent)。

## 其他模型 {#other-models}

*   [最新 Gemini 模型](/docs/latest-model/)
*   [Gemini 4 Neon](/docs/whats-new-gemini-4-neon/)
*   [Gemini 4 Hydrogen](/docs/whats-new-gemini-4-hydrogen/)
*   [Gemini 4 Carbon](/docs/whats-new-gemini-4-carbon/)
*   [Gemini 4 Argon](/docs/whats-new-gemini-4-argon/)
*   [Gemini 3.8 Flash](/docs/whats-new-gemini-3.8/)
*   [Gemini 3.6 Flash 與 3.5 Flash-Lite](/docs/whats-new-gemini-3.6/)
*   [查看所有模型](/docs/models/)

## 後續步驟 {#whats-next}

* 在 [Models Overview](/docs/models/) 查閱 API 規格。
* 在 [Interactions API 指南](/docs/interactions-overview/) 探索多代理協作。
* 在 [Google AI Studio](https://aistudio.google.com/) 測試並優化提示詞。
