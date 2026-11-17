# AI Studio Playground 中的代理

Google AI Studio Playground 提供視覺化介面，讓你無需建立並撰寫 API 呼叫，就能試作並了解如何建構受管代理。

開始使用時，請前往 Google AI Studio 左側導覽面板的 **Playground** 分頁，並將切換開關切換至 **Agents**。

## 預先建構的範本 {#pre-built-templates}

**Agents** 分頁有一系列範本，透過設定工具與環境組態，預先設定基礎的 Antigravity Agent。所有範本皆為開放原始碼，並發佈在 [google-gemini/gemini-managed-agents-templates](https://github.com/google-gemini/gemini-managed-agents-templates/) 存放庫中。探索這些範本，是了解如何建構與組織你自己的受管代理的好方法。

例如，當你選取 AI Radio 範本時，它會啟用所有允許的工具，並連結一份專門的 `AGENTS.md` 檔案與廣播節目製作技能。你可以在 Playground 介面的 **Environment** 區段中，點選 **Sources** 按鈕來檢視這些設定。

重要事項：當你執行這些範本時，沙箱內的代理可以存取 Gemini API。它會使用你設定的 API 金鑰來執行呼叫，可能在你的帳戶產生額外的權杖費用。如需更多詳細資訊，請參閱 [safety and cost management](/docs/aistudio-agents/#safety-and-cost-management) 一節。

## 工具設定 {#tool-configuration}

在 Playground 的 Agent settings 下，你可以切換以下內建工具的存取權：

* **Google Search:** 存取開放網頁，取得即時資訊接地。

* **URL Context:** 擷取並解析特定網頁 URL 的文字內容。

* **Code Execution:** 直接在隔離的沙箱環境中執行 Bash 與 Python 指令。

* **Filesystem Tools:** 讀取、寫入、列出並刪除工作區內的檔案。


## 環境設定 {#environment-configuration}

受管代理在安全、暫時性的 Linux 沙箱（即環境）中執行，該環境提供它們運作所需的工作區與工具。如需更多資訊，請參閱[受管代理環境](/docs/agent-environment/)指南。

### 控制代理行為 {#controlling-agent-behavior}

代理的行為、人格與能力，主要由其環境中存在的檔案決定。代理會自動偵測並從特殊的 `.agents` 資料夾載入組態：

* **`AGENTS.md`**：預先載入到代理的上下文中，用來定義系統指令與人格。
* **`SKILL.md`**：位於各自的技能資料夾下（例如 `.agents/skills/my-skill/SKILL.md`），用來定義特定能力與工作流程。

### 佈建環境 {#provisioning-the-environment}

你可以在開始工作階段之前，透過掛載檔案到環境來設定代理要使用的環境。你可以透過掛載來源來建立新環境，也可以還原先前的環境：

* **若要建立新環境**，在 Environment settings 面板中點選 **Add Sources**，並從以下來源類型中選擇：


| 來源類型 | 說明 | 掛載路徑 |
| --- | --- | --- |
| **Inline Files** | 直接在 Playground 介面中撰寫或貼上設定檔、模擬資料集或公用程式指令碼（上限 100KB）。 | 使用者自訂的目的路徑（例如 `/workspace/scripts/parser.py`）。 |
| **Google Cloud Storage** | 掛載公開或私有的 Cloud Storage 值區。私有值區需要標準的 OAuth 2.0 Bearer 權杖。如需更多資訊，請參閱 [Private sources](/docs/agent-environment/#private-sources)。 | 將 GCS 值區路徑（例如 `gs://your-bucket-name/data/`）對應到工作區目錄（例如 `/workspace/data/`）。 |
| **GitHub Repositories** | 複製公開或私有的程式碼庫。私有存放庫需要使用你的 GitHub Personal Access Token (PAT) 進行 Basic 驗證。如需更多資訊，請參閱 [Private sources](/docs/agent-environment/#private-sources)。 | 直接複製到 `/workspace/`（通常位於 `/workspace/<repo-name>` 下）。 |


* **若要還原先前的環境**，你可以[重複使用現有的環境 ID](/docs/aistudio-agents/#reusing-an-existing-environment-id) 來複製並分岔其確切狀態。

### 重複使用現有的環境 ID {#reusing-an-existing-environment-id}

如果你已經花時間設定好沙箱環境，就不必從頭開始。若要使用現有環境：

1. 前往 AI Studio 的 Environments 面板，將 **Type** 切換為 **Existing**
2. 輸入 **Environment ID**（例如 `env_abc123`）

如需更多資訊，請參閱 [Configure an environment](/docs/agent-environment/#configure-an-environment)。你也可以從介面的 Environment 分頁取得目前工作階段的 Environment ID。

一旦你傳送第一則訊息給代理，該工作階段的環境設定就會固定下來。在互動執行期間，你無法掛載新來源或修改網路允許清單。

## 下載環境 {#download-the-environment}

環境建立後，你可以隨時在 AI Studio Playground 的 Environment settings 中使用 **Download** 按鈕，下載環境快照，將環境檔案取回為 tarball。

## 安全與成本管理 {#safety-and-cost-management}

### 管理權杖消耗 {#managing-token-consumption}

與產生單一輸出的標準聊天要求不同，Antigravity Agent 會執行自主工作流程。它會規劃、執行程式碼、觀察結果並反覆迭代。這表示單一提示詞可能導致不受限制的權杖消耗。

若要管理成本，**請在提示詞中提供明確的終止條件，並將交給代理的任務範圍縮小**。一個好的範例提示詞可以是 *Review the pull request and stop once you have generated the markdown summary. Do not attempt to write the fix yourself*。

重要事項：如果你發現代理執行時間過長，或方向不對（可透過觀察它的思考與工具呼叫來判斷），你可以隨時使用 **Stop** 按鈕停止代理，避免不必要的權杖消耗。

### 額外成本 {#additional-costs}

預設情況下，Playground 上的所有代理範本都能存取 Gemini API 服務，並可從環境中發出 API 呼叫來完成要求。這些呼叫可能產生額外成本，且不會反映在權杖消耗中。

同樣地，如果你加入其他外部服務，代理可能會代表你呼叫這些服務，因而產生額外成本。

### 網路允許清單 {#network-allow-list}

預設情況下，在 AI Studio 中，你的代理沙箱環境發出的所有對外網路要求都受到嚴格控管與限制，以確保安全。若要讓代理能夠存取外部 API、網路服務或套件管理工具，你必須明確宣告它們：

1. 前往 AI Studio 的 Environments 面板。
2. 選取 **Network** 旁的 **rules** 按鈕。
3. 在 **Network configuration** 面板中，點選 **Add to allowlist** 並填寫相關詳細資訊：
   *  **Domain Restriction:** 只有加入清單的特定網域或萬用字元模式，才能被代理的虛擬機器存取。例如，你可以輸入像 `api.github.com` 這樣的確切網域，或像 `*.googleapis.com` 這樣的廣泛模式。
   *  **Add HTTP Header and Token Injection:** 使用 **Add HTTP header** 選項，安全地為特定網域注入所需的憑證（例如 API 權杖）。這些憑證會安全地透過 egress proxy 傳遞，不會以原始文字形式直接暴露在代理沙箱內。


在將網域加入允許清單時，請務必謹慎。讓代理存取已驗證的服務，意味著它可以代表你執行操作，若未仔細監控，可能導致非預期的動作。


!!! note " "

      **Important:**

      *   透過 AI Studio Playground 進行的所有代理呼叫，預設都會啟用已驗證的 Gemini API（使用你連結的 API 金鑰）。
      *   當你使用 API 時，網路預設為開放。如需詳細資訊，請參閱 [API documentation](/docs/agent-environment/#network-configuration)。


### 憑證最佳做法 {#credentials-best-practices}

如果你的工作流程需要代理向外部服務進行驗證，你有責任佈建這些憑證並設定其權限範圍。請遵循以下準則來降低風險：

* **使用最小權限憑證**：建立只具有代理所需權限的服務帳號或 API 金鑰。避免傳遞具有廣泛或管理員存取權的憑證。

* **優先使用短期權杖**：盡可能使用有時效限制、會到期的憑證或權杖，而非長期 API 金鑰。

* **假設代理具有完整存取權**：代理可能會使用它能存取的任何憑證來完成你交給它的任務。只提供你願意授予完整存取範圍的憑證。

* **定期輪替憑證**：將與代理共用的憑證，視同任何程式化憑證一樣處理；定期輪替它們。


### 連接外部工具與 API {#connecting-external-tools-and-apis}

你可以連接外部工具與 API（例如 Model Context Protocol / MCP 伺服器）來擴充代理的能力。進行此操作時：

* 只連接來自你信任來源的工具。惡意或撰寫不當的工具可能會暴露資料或執行非預期的動作。

* 以你的使用情境所需的最小權限來設定工具。如果工具支援唯讀模式，除非寫入確實必要，否則請優先選擇唯讀模式。

* 在將工具連接到正式資料來源之前，先以範例或合成資料進行測試，確認代理會如預期般使用它。


### 人工監督 {#human-oversight}

代理能以高度自主性進行推理、規劃並執行多步驟工作流程。雖然這很強大，但也意味著你應該採取適當的監督；尤其是會修改資料或與外部系統互動的任務。

在部署之前，務必驗證重要輸出，例如產生的程式碼、資料轉換或設定變更。
