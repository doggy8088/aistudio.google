# 使用 Gemini API 金鑰

若要使用 Gemini API，您必須驗證您的請求。您可以使用標準 API 金鑰或授權 API 金鑰進行驗證。

[Create or view a Gemini API Key](https://aistudio.google.com/apikey)

## API 金鑰類型：標準金鑰與授權金鑰 {#api-keys}

API 金鑰可讓您存取 Gemini API，但兩者的安全特性不同。為了提升安全性，Gemini API 正從標準 API 金鑰過渡至授權金鑰：

* **Standard API keys**：將請求與 Google Cloud 專案關聯，用於計費與配額用途。標準金鑰不會識別呼叫者身分，因此能支援的權限與存取控制細緻程度有限。

* **Authorization (auth) keys**：直接綁定至 Google Cloud 服務帳戶。使用授權金鑰時，您的請求會以該綁定服務帳戶的身分處理，進而實現細緻的存取控制。授權金鑰預設僅限於 Generative Language API（Gemini API）使用，並提供快速生效的外洩金鑰封鎖機制，能在系統偵測到金鑰外洩時迅速停用該金鑰。


為了確保使用安全，Gemini API 將從標準金鑰改為授權金鑰：

* **Auth keys default**：自 2026 年 5 月 28 日起，所有在 Google AI Studio 中建立的新 API 金鑰都會自動建立為授權金鑰。

* **Unrestricted keys rejected**：Gemini API 會拒絕來自**未受限制的標準金鑰**的請求。已套用明確限制的標準 API 金鑰仍可繼續使用。此限制可防止可能被公開分享或與其他服務連結的金鑰遭未授權使用。


!!! note " "

      透過授權金鑰驗證的請求，不會記錄在 Google Cloud 服務帳戶用量指標中。


## 在 Google AI Studio 中管理 API 金鑰 {#getting-started}

您可以直接在 [Google AI Studio](https://aistudio.google.com/apikey) 中管理您的專案與金鑰。

### Google Cloud 專案 {#google-cloud-projects}

每一把 Gemini API 金鑰都與一個 [Google Cloud project](https://cloud.google.com/resource-manager/docs/creating-managing-projects) 關聯。Google Cloud 專案負責管理計費、協作者與權限。Google AI Studio 提供了一個輕量介面，讓您存取這些專案。

* **Default project**：如果您是新使用者，Google AI Studio 會在您接受服務條款後，自動為您建立一個預設的 Google Cloud 專案與 API 金鑰。您可以前往資訊主頁中的 **Projects** 檢視畫面，重新命名此專案。

* **Existing projects**：如果您已有 Google Cloud 帳戶，AI Studio 不會建立預設專案；您必須改為匯入現有的專案。


### 匯入專案 {#import-projects}

Google AI Studio 預設不會顯示您所有的 Google Cloud 專案。您必須匯入想要使用的專案：

1. 前往 [Google AI Studio](https://aistudio.google.com)。

2. 從左側面板開啟 **Dashboard**，並選取 **Projects**。

3. 點選 **Import projects** 按鈕。

4. 搜尋並選取您要匯入的 Google Cloud 專案，然後點選 **Import**。

5. 匯入完成後，前往資訊主頁中的 **API Keys** 頁面，在該專案中建立金鑰。


匯入的專案可能需要先完成 [project verification](/docs/verification/)，才能使用 Gemini API 免費層級。您也可以 [set up billing](/docs/billing/#setup-billing)，改用付費層級。

### 疑難排解金鑰建立權限 {#key-permission}

如果 **Create API key** 按鈕無法使用，並顯示以下訊息：*"You do not have permission to create a key in this project"*，表示您缺少必要的 IAM 權限。

請向您的 Google Cloud 專案或機構管理員申請授予包含以下權限的角色（例如 Project Editor）：

* `resourcemanager.projects.get`：允許 AI Studio 查閱專案。

* `apikeys.keys.create`：允許產生金鑰。

* `serviceusage.services.enable`：確保 Generative Language API 已啟用。

* `iam.serviceAccounts.create`：建立連結的服務帳戶所需。

* `iam.serviceAccountApiKeyBindings.create`：將服務帳戶綁定至 API 金鑰。


如果無法取得管理員存取權，您可以建立一個未與任何機構關聯的新 Google Cloud 專案來產生金鑰。

### Usage 頁面上的未知金鑰 {#unknown-keys}

Google AI Studio 中的 [Usage page](https://aistudio.google.com/usage) 會將無法對應到專案中具名 API 金鑰的請求，歸類在 **(unknown keys)** 之下。這包括 30 天前刪除的金鑰、沒有顯示名稱的金鑰，以及使用其他憑證（例如 OAuth）發出的請求。

## 在 Google Cloud 主控台中建立金鑰 {#cloud-console}

Google AI Studio 只會顯示未受限制，或僅限於 Gemini API 的金鑰。如果您無法使用 AI Studio，或想在一處管理所有 API 金鑰，請依照 Cloud 文件中關於[建立 API 金鑰](https://cloud.google.com/docs/authentication/api-keys#create)的說明操作。建立 Gemini API 金鑰時，需要將其綁定至[服務帳戶](https://cloud.google.com/iam/docs/service-account-overview)。在 Google AI Studio 以外建立的專案，可能需要先完成 [project verification](/docs/verification/) 才能使用免費層級。

## 設定您的環境 {#setup-environment}

取得金鑰後，請設定您的環境，讓應用程式能安全地使用它。

### 選項 1：使用環境變數（建議） {#set-api-env-var}

設定環境變數 `GEMINI_API_KEY` 或 `GOOGLE_API_KEY`。Gemini API 用戶端程式庫會自動偵測並使用這些變數。如果兩者都已設定，則以 `GOOGLE_API_KEY` 優先。

請選取您的作業系統來設定變數：


=== "Linux/macOS - Bash"

      確認您是否有 bash 設定檔：

      ```posix-terminal
      ~/.bashrc
      ```

      若沒有，請建立一個並開啟：

      ```posix-terminal
      touch ~/.bashrc && open ~/.bashrc
      ```

      在檔案末尾加入 export 指令：

      ```posix-terminal
      export GEMINI_API_KEY=[YOUR_API_KEY_HERE]
      ```

      儲存檔案，然後套用變更：

      ```posix-terminal
      source ~/.bashrc
      ```

=== "macOS - Zsh"

      確認您是否有 zsh 設定檔：

      ```posix-terminal
      ~/.zshrc
      ```

      若沒有，請建立一個並開啟：

      ```posix-terminal
      touch ~/.zshrc && open ~/.zshrc
      ```

      加入 export 指令：

      ```posix-terminal
      export GEMINI_API_KEY=[YOUR_API_KEY_HERE]
      ```

      儲存檔案，然後套用變更：

      ```posix-terminal
      source ~/.zshrc
      ```

=== "Windows"

      1. 在 Windows 搜尋列中搜尋「Environment Variables」。
      2. 在「系統內容」對話框中點選 **Environment Variables**。
      3. 在 **User variables** 或 **System variables** 之下，點選 **New...**。
      4. 將變數名稱設為 `GEMINI_API_KEY`，值設為您的 API 金鑰。
      5. 點選 **OK** 儲存。開啟新的終端機工作階段以載入該變數。


### 選項 2：在程式碼中明確提供 API 金鑰 {#provide-api-key-explicitly}

您可以在初始化用戶端時明確傳入 API 金鑰。只有在無法使用環境變數時才這樣做。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(api_key="YOUR_API_KEY")

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input="Explain how AI works in a few words"
      )
      print(interaction.output_text)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

      async function main() {
        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Explain how AI works in a few words",
        });
        console.log(interaction.output_text);
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;

      Client client = Client.builder().apiKey("YOUR_API_KEY").build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of("Explain how AI works in a few sentences."))
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
          client, err := genai.NewClient(ctx, &genai.ClientConfig{
              APIKey: "{{ '<var>YOUR_API_KEY</var>' }}",
          })
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model: interactions.Model("gemini-4-hydrogen"),
                  Input: interactions.NewInteractionsInput("Explain how AI works in a few sentences."),
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

      ```bash
      curl "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H 'Content-Type: application/json' \
        -H "x-goog-api-key: YOUR_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -X POST \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Explain how AI works in a few words"
        }'
      ```


## 安全與密鑰管理 {#security}

請將您的 Gemini API 金鑰視同密碼。一旦外洩，他人可能耗用您專案的配額、產生未預期的計費費用，並存取私人資源。

### 關鍵安全規則 {#critical-security-rules}

* **金鑰保密**：切勿將 API 金鑰提交至 Git 等原始碼版本控制系統。

* **切勿在正式環境中於用戶端暴露金鑰**：不要將 API 金鑰直接寫死在網頁或行動應用程式中。編譯在用戶端程式碼中的金鑰可能被使用者擷取。為了保護用戶端應用程式的安全，請透過後端 proxy 伺服器進行實際的 API 呼叫。


### 密鑰管理最佳做法 {#secret-management}

* **環境變數**：從環境變數讀取金鑰，而非設定檔。

* **Secret Manager**：在正式環境中，請將金鑰儲存在安全的密鑰儲存服務中，例如 [Google Cloud Secret Manager](https://cloud.google.com/secret-manager)。

* **計費快訊**：在 Google Cloud 主控台中設定計費快訊，當用量或費用異常攀升時通知您。


### 外洩應變檢查清單 {#leak-response}

如果您懷疑 API 金鑰已外洩：

1. **產生新金鑰**：在 Google AI Studio 或 Cloud 主控台中建立替代金鑰。

2. **更新您的應用程式**：使用新金鑰部署您的程式碼。

3. **停用或刪除遭外洩的金鑰**：確認新金鑰有效後，在 Cloud 主控台中停用外洩的金鑰。在新金鑰完全生效前，請勿刪除舊金鑰，以免應用程式停機。

4. **稽核用量**：在 Google Cloud 主控台中檢查計費記錄與 API 用量，找出未授權的活動。


## 限制與保護您的金鑰 {#restricting-keys}

為 API 金鑰加上限制，可將金鑰遭外洩時的潛在損害降到最低。

### 套用請求來源限制 {#request-origin-restrictions}

來源限制會限定哪些 IP 位址、網站或應用程式可以使用您的金鑰。

1. 前往 [Google Cloud console credentials page](https://console.cloud.google.com/apis/credentials)。

2. 選取您的專案，並點選您要限制的 API 金鑰名稱。

3. 在 **Application restrictions** 之下，選取 **IP addresses**（或適合您環境的限制類型）。

4. 指定允許的 IP 位址或範圍，然後點選 **Save**。


### 保護未受限制的標準 API 金鑰 {#secure-unrestricted-keys}

若要繼續使用 Gemini API，您必須保護所有未受限制的金鑰。

#### 方法 A：將金鑰限制為僅供 Gemini API 使用（AI Studio） {#method-a-restrict-the-key-to-the-gemini-api-only-ai-studio}

如果這把金鑰僅用於 Gemini API，請直接在 AI Studio 中保護它：

1. 在 [Google AI Studio](https://aistudio.google.com/api-keys) 的 **API Keys** 頁面上，找到標示為
   **Unrestricted** 的金鑰。

2. 將滑鼠游標停在該標籤上，並在對話框中點選 **Add restrictions**。

3. 選取 **Restrict to Gemini API only**。

4. 點選 **Restrict key** 確認。


!!! note " "

      若要限制 API 金鑰，您必須在關聯的 Google Cloud 專案上擁有 `apikeys.keys.update` 權限。此權限包含在 **API Keys Admin** 或 **Editor** 等角色中。


#### 方法 B：為其他服務限制金鑰（Google Cloud 主控台） {#method-b-restrict-the-key-for-other-services-google-cloud-console}

如果這把金鑰與其他 Google API 共用（不建議），請在 Cloud 主控台中限制它。**注意：套用這些限制後，使用這把金鑰的 Gemini API 請求將會失敗。**

1. 前往 [Google Cloud console credentials page](https://console.cloud.google.com/apis/credentials)。

2. 選取專案與 API 金鑰。

3. 在 **API restrictions** 之下，選取 **Restrict key**。

4. 從下拉式選單中，選取這把金鑰可以存取的 API。不要選取 **Generative Language API**。

5. 點選 **Save**。在 AI Studio 中建立一把獨立且受限制的金鑰，以繼續使用 Gemini API。


### 遭封鎖的閒置金鑰 {#blocked-keys}

自 2026 年 5 月 7 日起，Gemini API 會封鎖長時間閒置的未受限制 API 金鑰。這類金鑰在 AI Studio 中會顯示 **Blocked** 標籤。您必須產生新金鑰，或使用現有的受限制金鑰，才能繼續使用。

## 遷移至授權金鑰 {#migrate-to-auth-key}

請依照以下步驟建立新的授權 API 金鑰，並更新您的應用程式：

1. 前往 [AI Studio API Keys page](https://aistudio.google.com/api-keys)。

2. 查看 **Key Type** 欄，找出列為 **Standard** 的金鑰。

3. 點選 **Create API key** 產生新金鑰。在 AI Studio 中建立的所有新金鑰都會自動建立為授權金鑰。

4. 複製新的授權 API 金鑰。

5. 更新您的應用程式程式碼、環境變數與任何部署設定，改用新的授權 API 金鑰。

6. 測試您的應用程式，確認新金鑰能正常運作。

7. 確認無誤後，刪除或撤銷您的舊流量金鑰，以防遭濫用。


!!! note " "

      如果您看不到自己的金鑰，可能需要將 Cloud 專案匯入 AI Studio。相關說明請參閱[匯入專案](/docs/api-key/#import-projects)一節。


## 限制 {#limitations}

Google AI Studio 對專案與金鑰管理設有以下限制：

* 您一次最多可從 Google AI Studio 的 **Projects** 頁面建立 10 個專案。

* **API keys** 與 **Projects** 頁面最多顯示 100 把金鑰與 50 個專案。

* 僅顯示未受限制，或專門限制為 Generative Language API（Gemini API）的 API 金鑰。


如需進階專案管理，或修改帶有其他限制的金鑰，請使用 [Google Cloud console credentials page](https://console.cloud.google.com/apis/credentials)。
