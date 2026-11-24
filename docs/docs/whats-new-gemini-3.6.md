# Gemini 3.6 Flash 與 3.5 Flash-Lite 的新功能

Gemini 3.6 Flash (`gemini-3.6-flash`) 與 Gemini 3.5 Flash-Lite
(`gemini-3.5-flash-lite`) 是 Gemini 3 系列中前一代的版本，目前仍可供正式環境使用。如需最新的 Flash 模型，請參閱
[Gemini 3.8 Flash](/docs/whats-new-gemini-3.8/)。

* **Gemini 3.6 Flash**：在複雜的代理與多模態任務上效能更強，同時減少 token 用量，價格也低於 3.5 Flash。
* **Gemini 3.5 Flash-Lite**：3.5 家族中速度最快、成本最低的模型。在高輸送量執行上，表現優於先前的 Flash-Lite 世代。

本指南說明每個模型導入的新功能、會影響程式碼的 API 變更，以及遷移方式。


!!! note " "

      你可以使用支援 [skills](/docs/coding-agents/#gemini-api-dev) 的程式設計代理（例如 Antigravity）自動完成這項遷移。


=== "Gemini 3.6 Flash"

      1. 安裝 skill：

         ```bash
         npx skills add google-gemini/gemini-skills --skill gemini-interactions-api --global
         ```

      2. 套用 skill：

         ```bash
         /gemini-interactions-api migrate my app to Gemini 3.6 Flash
         ```

=== "Gemini 3.5 Flash-Lite"

      1. 安裝 skill：

         ```bash
         npx skills add google-gemini/gemini-skills --skill gemini-interactions-api --global
         ```

      2. 套用 skill：

         ```bash
         /gemini-interactions-api migrate my app to Gemini 3.5 Flash-Lite
         ```


## 新模型 {#new-models}

| 模型 | 模型 ID | 預設思考層級 | 定價 | 說明 |
| :--- | :--- | :---: | --- | :--- |
| Gemini 3.6 Flash | `gemini-3.6-flash` | `medium` | 請參閱下方的 [Gemini 3.6 Flash 定價](/docs/whats-new-gemini-3.6/#pricing-gemini-3.6-flash)。 | 在速度與智慧之間取得平衡，適合代理與多模態任務。 |
| Gemini 3.5 Flash-Lite | `gemini-3.5-flash-lite` | `minimal` | 請參閱下方的 [Gemini 3.5 Flash-Lite 定價](/docs/whats-new-gemini-3.6/#pricing-gemini-3.5-flash-lite)。 | 速度最快、成本最低的 3.5 模型，適合高輸送量執行。 |

這兩個模型都支援 1Mtokens上下文視窗、64k 輸出 token 上限、思考功能，以及包含 [Computer Use](/docs/computer-use/) 在內的整套內建工具。

如需完整規格，請參閱模型頁面：

* [Gemini 3.6 Flash 模型頁面](/docs/models/gemini-3.6-flash/)
* [Gemini 3.5 Flash-Lite 模型頁面](/docs/models/gemini-3.5-flash-lite/)

如需完整定價詳情，請參閱下方的[定價章節](/docs/whats-new-gemini-3.6/#pricing)，或[定價頁面](/docs/pricing/)。

## 快速入門 {#quickstart}


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-3.6-flash",
          input="Write a three.js script that renders an interactive 3D robot."
      )

      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({});

      async function main() {
        const interaction = await ai.interactions.create({
          model: "gemini-3.6-flash",
          input: "Write a three.js script that renders an interactive 3D robot.",
        });
        console.log(interaction.output_text);
      }

      await main();
      ```

=== "REST"

      ```bash
      curl "https://generativelanguage.googleapis.com/v1beta/interactions"   -H "x-goog-api-key: $GEMINI_API_KEY"   -H 'Content-Type: application/json'   -X POST   -d '{
          "model": "gemini-3.6-flash",
          "input": {
            "parts": [{"text": "Write a three.js script that renders an interactive 3D robot."}]
          }
        }'
      ```


## Gemini 3.6 Flash 的新功能 {#whats-new-gemini-3-6-flash}

* **減少 token 與回合數**：以更少的推理步驟、對話回合與工具呼叫完成多步驟工作流程，表現優於 Gemini 3.5。同時也能減少執行迴圈失控打轉的情況。
* **改善程式碼產生**：產生品質更高、可直接用於正式環境的程式碼，減少不必要的修改與除錯迴圈。
* **更佳的指令遵循能力**：在診斷任務中減少不必要的檔案變更。
* **強大的多模態與空間推理**：在圖表解讀、視覺藍圖轉換與多元素網頁版面產生上，效能有所提升。
* **預先進行程式化檢查**：比 Gemini 3.5 Flash 更常在修改前先執行診斷程式碼指令碼。這能提升複雜任務的正確率，但在例行的前端工作上，可能會增加額外的探索步驟。
* **Computer Use 支援**：支援作為內建工具，用於代理式 UI 自動化。
* **UI 樣式偏好**：更擅長建立功能完整的程式碼，不過人類評測人員在視覺版面與樣式方面較偏好先前的模型。你可以提供明確的設計準則來緩解這個問題。
* **預設思考投入（medium）**：採用與 Gemini 3.5 Flash 相同的 `medium` 預設思考層級。
* **價格調降**：輸出 tokens 成本低於 3.5 Flash（請參閱 [Gemini 3.6 Flash 定價](/docs/whats-new-gemini-3.6/#pricing-gemini-3.6-flash)）。

## Gemini 3.5 Flash-Lite 的新功能 {#whats-new-gemini-3-5-flash-lite}

* **降低任務執行延遲**：在 3.5 家族中輸送量最高，適合大量資料解析與文件擷取。
* **強化推理與多模態效能**：是從 Gemini 2.5 Flash 遷移的理想路徑，在 HLE 等推理任務（18.0% 對 11.0%）與 CharXIV 等多模態評測基準（74.5% 對 63.7%）上都取得更高分數。
* **子代理協作與工具可靠性**：提升程式碼執行、搜尋與 MCP 工作流程的工具執行可靠性。若是自主規劃與複雜的子代理任務，請提高思考層級。
* **改善文件理解能力**：提升文件解析與結構化資料擷取的正確率。請依文件複雜程度，分別嘗試 minimal 與 high 思考層級。
* **互動式網頁程式設計與表格式資料處理**：透過輕量程式碼執行進行規劃，在前端 JavaScript 與表格式資料處理上表現出色。
* **聊天機器人與角色一致性**：相較於 Gemini 3.1 Flash-Lite，多回合指令遵循與角色一致性更強。
* **Computer Use 支援**：支援作為內建工具，用於代理式 UI 自動化。

## 選擇合適的 Flash 或 Flash-Lite 模型 {#choosing-the-right-flash-model}

請使用下表，為你的工作負載選擇合適的模型與遷移路徑。

這兩個模型都必須移除已淘汰的取樣參數（`temperature`、`top_p`、`top_k`）與預填的模型回合。詳情請參閱 [API 變更](/docs/whats-new-gemini-3.6/#api-changes-and-parameter-updates)。

| 模型 | 主要用途 | 建議遷移目標 |
| :--- | :--- | :--- |
| **Gemini 3.6 Flash** (`gemini-3.6-flash`) | 程式碼產生、空間／多模態推理、多步驟代理工作流程 | **Gemini 3.5 Flash**、**Gemini 3 Flash (Preview)** 或 **Gemini 3.1 Pro** |
| **Gemini 3.5 Flash-Lite** (`gemini-3.5-flash-lite`) | 自主子代理執行、大量資料分析與文件擷取、結構化 JSON 解析 | **Gemini 3.1 Flash-Lite** 或 **Gemini 2.5 Flash** |

## Antigravity 代理支援 {#updated-antigravity-agent}

Gemini 3.6 Flash 在 Gemini Managed Agents 中導入了 [Antigravity 代理](/docs/antigravity-agent/) 的支援。

如需目前的程式碼範例與最新的預設代理設定，請參閱 [Antigravity 代理指南](/docs/antigravity-agent/) 與 [Gemini 3.8 Flash 指南](/docs/whats-new-gemini-3.8/#updated-antigravity-agent)。

## API 變更與參數更新 {#api-changes-and-parameter-updates}

自 Gemini 3.6 Flash 與 Gemini 3.5 Flash-Lite 起，下列 API 變更適用於這些模型，以及未來所有的 Gemini 模型版本。

* **取樣參數淘汰**：`temperature`、`top_p` 與 `top_k` 已淘汰。API 會忽略這些參數，並在未來的模型世代中傳回錯誤。
* **預填模型回合驗證**：不再支援預填模型回合。如果要求中最後一個非空白回合是 `model` 回合，API 會傳回 `400` 錯誤。

以下各節針對每項 API 變更提供詳細說明與程式碼範例。

### 1. 取樣參數淘汰（temperature、top_p、top_k） {#sampling-parameter-deprecation}

`temperature`、`top_p` 與 `top_k` 已淘汰且會被忽略。在未來的模型世代中，提供這些參數會傳回 HTTP 400 錯誤。**請從所有要求中移除這些參數。**

```python
# ⚠️ Remove these parameters (deprecated)
generation_config = {
     "temperature": 0.7,
     "top_p": 0.9,
     "top_k": 40,
}
```

若要提升確定性，請針對你的特定用途，以明確規則定義系統指令。

### 2. 預填模型回合驗證 {#prefilled-model-turn-validation}

以非空白的 model 角色回合結尾的 API 要求不受允許，會傳回 **HTTP 400 Error**。

#### ⚠️ 避免 {#prefill-avoid}

在舊版 `generateContent` 或原始 REST 酬載中，以 model 角色回合結尾的做法現在已不受允許：

```json
/* ❌ DO NOT: End payload contents with a 'model' role turn */
{
  "contents": [
    {"role": "user", "parts": [{"text": "Translate 'Hello world' to Spanish."}]},
    {"role": "model", "parts": [{"text": "Translation:"}]}  /* ❌ Returns error */
  ]
}
```

#### ✅ 建議的遷移方式（Interactions API） {#prefill-recommended-migration}

在 Interactions API 中，模型回合不會以手動方式預填。如果你的應用程式先前曾預填模型回合，以抑制前言或強制 JSON 格式，請改用 system_instruction 或[結構化輸出](/docs/structured-output/)。

```python
# ✅ RECOMMENDED: Use system_instruction in the Interactions API to specify output format
interaction = client.interactions.create(
    model="gemini-3.6-flash",
    input="Translate 'Hello world' to Spanish.",
    system_instruction="Output only the translation without introductory text.",
)
```

## 遷移檢查清單 {#migration-checklist}


!!! note " "

      你可以使用支援 [skills](/docs/coding-agents/#gemini-api-dev) 的程式設計代理（例如 Antigravity）自動完成這項遷移。


=== "Gemini 3.6 Flash"

      1. 安裝 skill：

         ```bash
         npx skills add google-gemini/gemini-skills --skill gemini-interactions-api --global
         ```

      2. 套用 skill：

         ```bash
         /gemini-interactions-api migrate my app to Gemini 3.6 Flash
         ```

=== "Gemini 3.5 Flash-Lite"

      1. 安裝 skill：

         ```bash
         npx skills add google-gemini/gemini-skills --skill gemini-interactions-api --global
         ```

      2. 套用 skill：

         ```bash
         /gemini-interactions-api migrate my app to Gemini 3.5 Flash-Lite
         ```


### 遷移至 gemini-3.6-flash {#migrate-to-gemini-3-6-flash}

* **更新 Model ID**：將目標模型字串改為 `gemini-3.6-flash`。
* **套用參數更新**：移除已淘汰的取樣參數（`temperature`、`top_p`、`top_k`）、`candidate_count`（Gemini 3 及後續版本不支援），以及預填的模型回合，詳情請參閱 [API 變更與參數更新](/docs/whats-new-gemini-3.6/#api-changes-and-parameter-updates)。
* **設定思考層級**：將 `thinking_budget` 改為 `thinking_level`（`"medium"` 或 `"high"`）。
* **稽核函式呼叫**：
  * 將多模態素材放在回應酬載內。
  * 使用 `\n\n` 格式化行內指令。
  * 如果你看到與工具前文字相關的 `Malformed_Function_Call` 錯誤，請參閱[工具前文字需求的因應方式](/docs/function-calling/#workarounds-for-pre-tool-text-requirements)。

*   **Gemini 3.x 基本要求**：如需 SDK 更新與思考簽章保留的相關資訊，請參閱[思考簽章](/docs/thinking/#signatures)。

### 遷移至 gemini-3.5-flash-lite {#migrate-to-gemini-3-5-flash-lite}

* **更新 Model ID**：將目標模型字串改為 `gemini-3.5-flash-lite`。
* **設定思考投入層級**：
  * 若是大量擷取、路由或分類：將 `thinking_level` 維持在 `"minimal"`（預設），以獲得最高輸送量。
  * 若是會進行工具呼叫、程式碼執行或多步驟推理的自主子代理：將 `thinking_level` 設為 `"medium"` 或 `"high"`，以避免工具過早終止。

* **移除已淘汰的參數並驗證函式呼叫**：套用[與 3.6 Flash 相同的規則](/docs/whats-new-gemini-3.6/#migrate-to-gemini-3-6-flash)。
*   **Gemini 3.x 基本要求**：請參閱
    [思考簽章](/docs/thinking/#signatures)。

## 定價 {#pricing}

### Gemini 3.6 Flash {#pricing-gemini-3.6-flash}


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.75 至 2026 年 12 月 31 日止。$1.50 自 2027 年 1 月 1 日起。 |
    | 輸出價格（含思考 token） | 免費 | $3.75 至 2026 年 12 月 31 日止。$7.50 自 2027 年 1 月 1 日起。 |
    | 上下文快取價格 | 免費 | $0.075 至 2026 年 12 月 31 日止。$0.15 自 2027 年 1 月 1 日起。$0.50 / 1,000,000tokens/小時（儲存價格）至 2026 年 12 月 31 日止。$1.00 / 1,000,000tokens/小時（儲存價格）自 2027 年 1 月 1 日起。 |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "批次"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $0.375 至 2026 年 12 月 31 日止。$0.75 自 2027 年 1 月 1 日起。 |
    | 輸出價格（含思考 token） | 不提供 | $1.875 至 2026 年 12 月 31 日止。$3.75 自 2027 年 1 月 1 日起。 |
    | 上下文快取價格 | 不提供 | $0.0375 至 2026 年 12 月 31 日止。$0.075 自 2027 年 1 月 1 日起。$0.50 / 1,000,000tokens/小時（儲存價格）至 2026 年 12 月 31 日止。$1.00 / 1,000,000tokens/小時（儲存價格）自 2027 年 1 月 1 日起。 |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "彈性"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $0.375 至 2026 年 12 月 31 日止。$0.75 自 2027 年 1 月 1 日起。 |
    | 輸出價格（含思考 token） | 不提供 | $1.875 至 2026 年 12 月 31 日止。$3.75 自 2027 年 1 月 1 日起。 |
    | 上下文快取價格 | 不提供 | $0.0375 至 2026 年 12 月 31 日止。$0.075 自 2027 年 1 月 1 日起。$0.50 / 1,000,000tokens/小時（儲存價格）至 2026 年 12 月 31 日止。$1.00 / 1,000,000tokens/小時（儲存價格）自 2027 年 1 月 1 日起。 |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |

=== "優先"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $1.35 至 2026 年 12 月 31 日止。$2.70 自 2027 年 1 月 1 日起。 |
    | 輸出價格（含思考 token） | 免費 | $6.75 至 2026 年 12 月 31 日止。$13.50 自 2027 年 1 月 1 日起。 |
    | 上下文快取價格 | 免費 | $0.135 至 2026 年 12 月 31 日止。$0.27 自 2027 年 1 月 1 日起。$0.50 / 1,000,000tokens/小時（儲存價格）至 2026 年 12 月 31 日止。$1.00 / 1,000,000tokens/小時（儲存價格）自 2027 年 1 月 1 日起。 |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


* 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

\*\* 可在 Google AI Studio 中測試。

### Gemini 3.5 Flash-Lite {#pricing-gemini-3.5-flash-lite}


=== "標準"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.30（文字 / 圖片 / 影片 / 音訊） |
    | 輸出價格（含思考 token） | 免費 | $2.50 |
    | 上下文快取價格 | 不提供 | $0.03 $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


      * 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

      \*\* 可在 Google AI Studio 中測試。

=== "批次"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.15（文字 / 圖片 / 影片 / 音訊） |
    | 輸出價格（含思考 token） | 免費 | $1.25 |
    | 上下文快取價格 | 不提供 | $0.015 $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


      * 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

      \*\* 可在 Google AI Studio 中測試。

=== "彈性"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 不提供 | $0.15（文字 / 圖片 / 影片 / 音訊） |
    | 輸出價格（含思考 token） | 不提供 | $1.25 |
    | 上下文快取價格 | 不提供 | $0.02 $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


      * 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

      \*\* 可在 Google AI Studio 中測試。

=== "優先"


    | 功能 | 免費級 | 付費級，每 100 萬 tokens（美元） |
    | --- | --- | --- |
    | 輸入價格 | 免費 | $0.54（文字 / 圖片 / 影片 / 音訊） |
    | 輸出價格（含思考 token） | 免費 | $4.50 |
    | 上下文快取價格 | 不提供 | $0.05 $1.00 / 1,000,000tokens/小時（儲存價格） |
    | 使用 Google 搜尋接地* | 不提供 | 每月 5,000 次免費搜尋請求（所有 Gemini 3 及更新模型共用），其後每 1,000 次請求 $14（受[每日上限](/docs/pricing/#pricing-for-tools)限制，每日 1,500 次請求）。 |
    | 使用 Google 地圖接地 | 不提供 | 每月 5,000 次請求（免費，所有 Gemini 3 及更新模型共用），其後每 1,000 次搜尋查詢 $14。 |
    | 用於改善我們的產品 | [是](/docs/terms/) | [否](/docs/terms/) |


      * 客戶提交給 Gemini 的請求可能會產生一或多個 Google 搜尋查詢。每一次個別搜尋查詢都會向您收費。

      \*\* 可在 Google AI Studio 中測試。


## 其他模型 {#other-models}

*   [選擇模型](/docs/choosing-a-model/)
*   [最新 Gemini 模型](/docs/latest-model/)
*   [Gemini 4 Neon](/docs/whats-new-gemini-4-neon/)
*   [Gemini 4 Hydrogen](/docs/whats-new-gemini-4-hydrogen/)
*   [Gemini 4 Carbon](/docs/whats-new-gemini-4-carbon/)
*   [Gemini 4 Argon](/docs/whats-new-gemini-4-argon/)
*   [Gemini 3.8 Flash](/docs/whats-new-gemini-3.8/)
*   [查看所有模型](/docs/models/)

## 後續步驟 {#whats-next}

* 在 [Models Overview](/docs/models/) 查閱 API 規格。
* 在 [Interactions API 指南](/docs/interactions-overview/) 探索多代理協作。
* 在 [Google AI Studio](https://aistudio.google.com/) 測試並優化提示詞。
