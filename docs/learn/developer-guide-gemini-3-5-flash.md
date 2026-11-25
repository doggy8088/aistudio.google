# Gemini 3.5 Flash 開發人員指南

Gemini 3.5 Flash 已正式推出（GA），穩定可靠，可用於大規模正式環境。

作者：[Patrick Loeber](https://x.com/patloeber)

作為我們最聰明的 Flash 模型，它在代理執行、程式設計與長時程任務上，都能大規模地持續提供前沿水準的效能。本指南概述 Gemini 3.5 Flash 的改進、API 變更與遷移指引。Gemini 3.5 Flash 支援 1Mtokens上下文視窗、最多 65k 個輸出 tokens、思考功能，以及與 Gemini 3 Flash 相同的一整套工具與平台功能。目前尚不支援 [Computer Use](https://ai.google.dev/gemini-api/docs/computer-use)。完整規格請參閱[模型總覽](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash)。定價請參閱[定價頁面](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.5-flash)。

## 快速入門

安裝最新版 Google Gen AI SDK：

```
pip install -U google-genai
```

[Interactions API](https://ai.google.dev/gemini-api/docs/interactions) 是使用 Gemini 建構應用的新標準基本元件，建議所有新專案都採用。它針對代理工作流程、伺服器端狀態管理，以及複雜的多模態、多輪對話做了最佳化。[GenerateContent API](https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.5) 也同樣支援，適用的設定選項與建議相同。

```
# Interactions API
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-3.5-flash",
    input="Explain how parallel agentic execution works in three sentences."
)
print(interaction.output_text)
```

```
# Generate Content API
from google import genai

client = genai.Client()

response = client.models.generate_content(
   model="gemini-3.5-flash",
   contents="How does AI work?",
)
print(response.text)
```

## 新功能

**持續的前沿效能**：我們最聰明的 Flash 模型，針對大規模的代理與程式設計任務最佳化。**代理執行**：大規模部署子代理、解決問題與快速執行代理迴圈。**程式設計**：反覆的程式設計循環、快速探索，以及透過原型驗證不同路徑、動態探索解決方案。**長時程**：大規模的多步驟工作流程與工具使用。**思考保留**：模型會自動在多輪對話之間保留中間推理，無需變更 API。**新的預設努力等級**：預設思考努力等級由 `high` 改為 `medium`。**改進的 `low` 思考**：`low` 現在對步驟較少的程式碼與代理任務有顯著改進，能以更低的延遲與成本提供出色的品質。**正式推出（GA）**：穩定的模型，可用於大規模正式環境。

## 行為變更

**新的預設努力等級**：`medium`。預設思考努力等級現在是 `medium`，有別於 Gemini 3 Flash Preview 的 `high`。`medium` 在各種任務上都能產生很好的結果，同時速度更快、更具成本效益。面對複雜問題時，`high` 會促使模型進行更深入的思考。

## 努力等級與使用時機

**minimal**＝針對回應速度最佳化。適合聊天類使用案例、快速的事實性回答、較簡單的工具呼叫。**low**＝適合需要較低延遲與較少步驟的程式碼與代理任務。也適合需要一些思考的分析與寫作任務。**medium（預設）**＝在大多數任務上品質最佳。建議用於複雜程式碼與代理使用案例。**high**＝將模型的思考與工具使用能力發揮到最大。最適合複雜推理、困難的數學，以及最艱難的程式碼或代理任務。可進行延伸思考與函式呼叫。

```
from google import genai

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-3.5-flash",
    input="Prove that the square root of 2 is irrational.",
    generation_config={"thinking_level": "high"},
)
print(interaction.output_text)
```

## 思考保留

模型會自動在多輪對話之間保留中間推理。當對話記錄中存在推理上下文時，它會延續到後續對話，進而提升反覆除錯、程式碼重構等複雜多步驟任務的效能。無需變更 API：**Interactions API**：思考已自動保留，行為不變。**GenerateContent API**：自 Gemini 3.5 Flash 起，當對話記錄中存在思考簽章時，模型會使用先前所有輪次的推理上下文。若要啟用此功能，請在 `contents` 中傳入完整且未經修改的對話記錄（包含[思考簽章](https://ai.google.dev/gemini-api/docs/thought-signatures)）。SDK 會自動處理。

## Gemini 3.x 的參數更新與最佳實務

以下內容適用於**所有 Gemini 3.x 模型**，包括 Gemini 3.5 Flash。`temperature`、`top_p`、`top_k`：強烈建議不要變更預設值。Gemini 3 的推理能力是針對預設設定最佳化的。請使用 `thinking_level` 而非 `thinking_budget`。**函式呼叫回應比對**：`id`、`name` 與回應數量必須與前面的呼叫相符。**多模態函式回應**：將多模態內容放在函式回應內部，而非外部。**函式回應中的行內指令**：附加到函式回應文字中，不要拆成獨立的部分。**減少不必要的工具呼叫**：使用較低的思考等級，或嘗試透過系統指令減少代理工作流程中的工具呼叫。如何更新程式碼，請參閱以下各節。

## 取樣參數（不再建議使用）

所有 Gemini 3.x 模型都不再建議使用 `temperature`、`top_p` 與 `top_k`。Gemini 3 的推理能力是針對預設設定最佳化的。**請從所有要求中移除這些參數。**

```
# ⚠️ Remove these parameters (not recommended)
generation_config = {
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": 40,
}
```

為確保結果的確定性，建議針對你的特定使用案例，以明確的規則定義系統指令。

## thinking_budget（不再建議使用）

所有 Gemini 3.x 模型都不再建議使用原始數值型 `thinking_budget` 參數。請改用 `thinking_level` 字串列舉。

```
# ⚠️ Before (not recommended)
generation_config = {
    "thinking": {"thinking_budget": 7500},
}

# ✅ After
generation_config = {
    "thinking": {"thinking_level": "medium"},
}
```

可用值：`minimal`、`low`、`medium`（預設）與 `high`。

## 函式呼叫：嚴格的回應比對

Interactions API 遇到不相符的函式回應時已會回傳錯誤。GenerateContent API 尚未會回傳錯誤，但不相符的回應在大多數情況下會導致模型回傳 `finish_reason: STOP` 的空白回應。請務必遵循以下慣例：**包含 id**：每個 FunctionResponse 都必須包含對應 FunctionCall 的 id。**比對 name**：回應中的 name 必須與呼叫中的 name 相符。**比對數量**：為收到的每個 FunctionCall 恰好回傳一個 FunctionResponse。

```
# ✅ Include matching call_id and name in the function_result
final_interaction = client.interactions.create(
    model="gemini-3.5-flash",
    previous_interaction_id=interaction.id,
    tools=[my_tool],
    input=[{
        "type": "function_result",
        "name": fc_step.name,
        "call_id": fc_step.id,
        "result": [{"type": "text", "text": json.dumps(result)}],
    }],
)
```

## 多模態函式回應

我們經常看到用戶端將圖片放在函式回應之外。這可能導致模型出現非預期的行為（例如思考外洩），並產生品質較低的輸出。請改為遵循[多模態函式回應 API 文件](https://ai.google.dev/gemini-api/docs/interactions/function-calling?example=meeting#multimodal)中的建議，將多模態內容納入你傳送給模型的函式回應部分。模型可以在下一輪處理這些多模態內容，產生資訊更充分的回應。

```
# ✅ Include multimodal content in the function response
final_interaction = client.interactions.create(
    model="gemini-3.5-flash",
    previous_interaction_id=interaction.id,
    input=[
        {
            "type": "function_result",
            "name": tool_call.name,
            "call_id": tool_call.id,
            "result": [
                {"type": "text", "text": "instrument.jpg"},
                {
                    "type": "image",
                    "mime_type": "image/jpeg",
                    "data": base64_image_data,
                },
            ],
        }
    ],
)
```

## 函式回應中的行內指令

我們經常看到用戶端以接續的 `Parts` 形式，連同函式回應一起提供額外指令。這可能導致模型出現非預期的行為（例如思考外洩），並產生品質較低的輸出。請改為將任何額外指令附加到函式回應文字的末尾，並以兩個換行字元分隔。

```
# ✅ Append inline instructions to the end of the function response separated by two newlines
result_text = f"{json.dumps(result)}\n\n<your inline instructions>"

final_interaction = client.interactions.create(
    model="gemini-3.5-flash",
    previous_interaction_id=interaction.id,
    tools=[my_tool],
    input=[
        {
            "type": "function_result",
            "name": fc_step.name,
            "call_id": fc_step.id,
            "result": [{"type": "text", "text": result_text}],
        }
    ],
)
```

## 減少不必要的工具呼叫

如果你遇到工具呼叫過度使用的情況，以下兩種技巧有助於減少呼叫次數：**先降低思考等級**（`medium`、`low` 或 `minimal`）：較高的思考等級會促使模型使用更多工具進行探索與驗證，因此降低等級可以減少工具呼叫。**加入系統指令**：如果調整思考等級後仍過度使用，可以考慮以提示詞限制工具的使用。例如：

```
You have a limited action budget of <n> tool calls. Use them efficiently.
```

## 遷移檢查清單

注意：**使用程式設計代理自動完成這次遷移。**如果你使用的程式設計代理支援技能（例如 Antigravity），請安裝 [Gemini Interactions API 技能](https://ai.google.dev/gemini-api/docs/coding-agents#gemini-interactions-api) 並執行：

```
/gemini-interactions-api migrate my app to Gemini 3.5 Flash
```

**強烈建議更新至 `google-genai` SDK v2.0.0 或更新版本。**此版本為 Interactions API 引入了破壞性變更。詳情請參閱[破壞性變更遷移指南](https://ai.google.dev/gemini-api/docs/interactions-breaking-changes-may-2026)。

## 從 Gemini 3 Flash Preview 遷移

更新模型名稱：`gemini-3-flash-preview` → `gemini-3.5-flash`。檢視定價。Gemini 3.5 Flash 的價格高於 Gemini 3 Flash Preview。詳情請參閱[定價頁面](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.5-flash)。從設定中移除 `temperature`、`top_p`、`top_k`（不再建議使用）。以 `thinking_level` 取代 `thinking_budget`。為所有 `FunctionResponse` 部分加入 `id` 與相符的 `name`。測試你的提示詞。預設努力等級已由 `high` 改為 `medium`；請驗證品質、速度與成本。思考保留現在預設開啟。推理上下文會延續到後續輪次，可提升效能，但可能增加 token 用量。減少不必要的工具呼叫：先降低思考等級（`medium`、`low` 或 `minimal`）；如果仍過度使用，再加入系統指令限制工具的使用。目前 Gemini 3.5 Flash 尚不支援 [Computer Use](https://ai.google.dev/gemini-api/docs/computer-use)。Computer Use 工作負載請繼續使用 Gemini 3 Flash Preview。

## 從 Gemini 2.5 遷移

以上全部，外加：簡化提示詞。如果你曾使用思維鏈提示工程來強制推理，請改為搭配較簡單的提示詞，嘗試 `thinking_level: "medium"` 或 `"high"`。測試 PDF 與媒體工作負載。如果你仰賴密集文件解析的特定行為，請測試 `media_resolution_high` 設定，確保準確度維持不變。遷移到 Gemini 3 的預設值也可能增加 PDF 的 token 用量、但減少影片的 token 用量；如果要求超出上下文視窗，請明確降低 `media_resolution`。詳情請參閱[媒體解析度](https://ai.google.dev/gemini-api/docs/interactions/media-resolution)文件。善用[組合式工具使用](https://ai.google.dev/gemini-api/docs/interactions/tool-combination)。Google 搜尋、URL 上下文、程式碼執行與自訂函式可以在同一個要求中一起使用。如果使用多模態函式回應，請將多模態內容移到函式回應部分內部，不要放在旁邊。如果在函式回應中使用行內指令，請將它們附加到函式回應文字中並以兩個換行字元分隔，不要拆成獨立的部分。Gemini 3.x 不支援圖片分割。分割工作負載請繼續使用關閉思考功能的 Gemini 2.5 Flash，或 [Gemini Robotics-ER 1.6](https://ai.google.dev/gemini-api/docs/robotics-overview)。

## Gemini 3 系列功能

Gemini 3.5 Flash 繼承了 Gemini 3 系列的全部功能，Computer Use 除外。Gemini 3 引入並延續下來的功能：[**思考**](https://ai.google.dev/gemini-api/docs/interactions/thinking)：在 API 呼叫之間保留加密的推理上下文。在 Interactions API 中自動啟用；在 GenerateContent 中則隱含啟用。[**結合工具的結構化輸出**](https://ai.google.dev/gemini-api/docs/interactions/structured-output)：將 JSON 模式與內建工具（搜尋、URL 上下文、程式碼執行、函式呼叫）結合使用。[**多模態函式回應**](https://ai.google.dev/gemini-api/docs/interactions/function-calling#multimodal)：在函式呼叫結果中回傳圖片、音訊與其他媒體。[**結合圖片的程式碼執行**](https://ai.google.dev/gemini-api/docs/interactions/code-execution#images)：執行可處理並產生圖片的程式碼。[**組合式工具使用**](https://ai.google.dev/gemini-api/docs/interactions/tool-combination)：在同一個要求中同時使用內建工具與自訂函式呼叫。
