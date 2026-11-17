# 安全設定

Gemini API 提供可在原型開發階段調整的安全設定，讓你判斷應用程式是否需要更嚴格或更寬鬆的安全配置。你可以針對各個篩選類別調整這些設定，限制或允許特定類型的內容。

本指南說明如何在互動（interaction）上設定安全設定、內容遭到封鎖時會發生什麼事，以及可用的類別與門檻。


!!! note " "

      使用較寬鬆安全設定的應用程式可能需要接受審查。詳情請參閱[服務條款](/docs/terms/#use-restrictions)。


## 設定安全設定 {#set-safety-settings}

建立互動時，傳入一組 `safety_settings` 清單。每項設定都由一個危害類別（`type`）與一個封鎖門檻（`threshold`）組成。

以下範例將仇恨言論（`hate_speech`）類別設為 `block_low_and_above`，也就是封鎖屬於仇恨言論的可能性為低或更高的任何內容：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Some potentially unsafe prompt.",
          safety_settings=[
              {
                  "type": "hate_speech",
                  "threshold": "block_low_and_above",
              }
          ],
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Some potentially unsafe prompt.",
          safety_settings: [
            {
              type: "hate_speech",
              threshold: "block_low_and_above",
            },
          ],
        });
        console.log(interaction.output_text);
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.HarmCategory;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.SafetySetting;
      import com.google.genai.gaos.models.interactions.Threshold;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.List;

      Client client = new Client();

      SafetySetting hateSpeechSafety =
          SafetySetting.builder()
              .type(HarmCategory.HATE_SPEECH)
              .threshold(Threshold.BLOCK_LOW_AND_ABOVE)
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Some potentially unsafe prompt."))
              .safetySettings(List.of(hateSpeechSafety))
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
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Some potentially unsafe prompt."),
                  SafetySettings: []interactions.SafetySetting{
                      {
                          Type:      interactions.HarmCategoryHateSpeech,
                          Threshold: interactions.ThresholdBlockLowAndAbove,
                      },
                  },
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

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Some potentially unsafe prompt.",
          "safety_settings": [
            {"type": "hate_speech", "threshold": "block_low_and_above"}
          ]
        }'
      ```


每個類別可以包含一項設定。未設定的類別會使用預設門檻；Gemini 2.5 及後續模型的預設值為 **Off**。

## 內容遭到封鎖時 {#when-content-is-blocked}

如果安全篩選器封鎖了輸入內容或模型的回應，互動會失敗並傳回 HTTP `400` 錯誤，被封鎖的內容不會一併傳回。

錯誤的 `code` 會說明要求遭到封鎖的原因：

*   `safety`：輸入內容或回應遭到安全篩選器封鎖。
*   `jailbreak`、`prohibited_content` 或 `blocklist`：輸入內容因該原因遭到封鎖。錯誤的 `message` 會以 `Input blocked:` 開頭。

例如：

```json
{
  "error": {
    "code": "safety",
    "message": "Request blocked due to safety violations (harmful content). Please modify your input and retry."
  }
}
```

對於背景互動（`background=true`），互動的 `status` 會設為 `failed`，相同的 `code` 與 `message` 也會出現在其 `errors` 清單中。串流時，錯誤會以 `error` 事件的形式送達。

## 安全篩選器 {#safety-filters}

Gemini API 可調整的安全篩選器涵蓋以下類別：


| Category | Value (API) | Description |
| --- | --- | --- |
| 騷擾 | `harassment` | 辱罵、威脅，或意圖霸凌、折磨、嘲弄他人的內容。 |
| 仇恨言論 | `hate_speech` | 基於特定屬性，宣揚暴力或煽動對個人或群體仇恨的內容。 |
| 色情內容 | `sexually_explicit` | 含有露骨色情素材的內容。 |
| 危險內容 | `dangerous_content` | 宣揚、協助或促成危險活動的內容。 |
| 越獄 | `jailbreak` | 設計來繞過安全篩選器的提示詞。 |


你可以運用這些篩選器，調整出適合自身用途的尺度。舉例來說，如果你正在開發電玩遊戲的對話，考量遊戲的性質，你或許可以接受允許更多被評為 *Dangerous* 的內容。

除了可調整的安全篩選器之外，Gemini API 還內建了針對核心危害的防護措施，例如危害兒童安全的內容。這類危害一律會遭到封鎖，且無法調整。

## 封鎖門檻 {#safety-filtering-per-request}

由於模型本身已具備安全性，額外的篩選器預設為 **Off**。模型的預設行為已能涵蓋大多數用途，因此只有在應用程式持續有此需求時，才需要調整這些設定。

下表說明每個類別可設定的門檻。舉例來說，如果你將 **Hate speech** 設為 **Block few**（`block_only_high`），屬於仇恨言論可能性為高的內容會遭到封鎖，可能性較低的內容則會放行。


| Threshold (Google AI Studio) | Threshold (API) | Description |
| --- | --- | --- |
| Off | `off` | 關閉安全篩選器 |
| Block few | `block_only_high` | 內容不安全的可能性為高時封鎖 |
| Block some | `block_medium_and_above` | 內容不安全的可能性為中或高時封鎖 |
| Block most | `block_low_and_above` | 內容不安全的可能性為低、中或高時封鎖 |


### 可能性與嚴重程度 {#safety-filtering-level}

Gemini API 會將內容不安全的可能性評為高、中、低或微乎其微。封鎖的依據是這個可能性，而不是危害的嚴重程度。有些內容雖然造成危害時可能相當嚴重，但被判定為不安全的可能性卻很低。舉例來說，比較以下兩個句子：

1. The robot punched me.
2. The robot slashed me up.

第一句被判定為不安全的可能性可能較高，但你或許認為第二句更嚴重。請仔細測試，找出既能支援你的用途、又能將對最終使用者的危害降到最低的封鎖程度。

## 在 Google AI Studio 中調整安全設定 {#safety-settings-ai-studio}

在 **Run settings** 面板中，點選 **Advanced settings** 下方的 **Safety settings**，即可開啟 **Run safety settings** 對話框。在對話框中，你可以使用滑桿，針對每個安全類別調整內容篩選程度：

![A rendering of the safety settings options in AI Studio](https://www.gstatic.com/cloud-cms/9d6bee794b9e1240c93ef64ab3c8b97e.png)

!!! note " "

      你有責任確保使用情境下的安全設定符合[服務條款](/docs/terms/#use-restrictions)。


當你送出要求時（例如向模型提問），如果要求的內容遭到封鎖，畫面上會出現

 **Content blocked** 訊息。若要查看更多詳情，將指標停留在
**Content blocked** 文字上，即可看到該危害分類的類別與可能性。

## 後續步驟 {#next-steps}

* 參閱 [Interactions API 參考文件](/api-reference/interactions-api/)，進一步瞭解完整的 API。
* 閱讀[安全指南](/docs/safety-guidance/)，概覽使用 LLM 開發時的安全考量。
* 前往 [Jigsaw 團隊](https://developers.perspectiveapi.com/s/about-the-api-score)深入瞭解如何評估可能性與嚴重程度。
* 瞭解更多有助於安全解決方案的產品，例如
  [Perspective
  API](https://medium.com/jigsaw/reducing-toxicity-in-large-language-models-with-perspective-api-c31c39b7a4d7)。
