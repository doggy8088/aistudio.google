# 資料記錄與分享

本頁說明 [Gemini API 日誌](/docs/logs-datasets/) 的儲存與管理方式。這些日誌是開發者擁有的 API 資料，來自已啟用計費專案中受支援的 Gemini API 呼叫。日誌涵蓋從使用者提出要求到模型回應的完整過程。這些日誌專屬於你的 Google Cloud 專案，與僅供[濫用監控](/docs/usage-policies/)目的而保存的日誌是分開的。

## 可分享的資料 {#shared-data}

Interactions API 呼叫預設會開啟日誌記錄；對於在 2026 年 10 月 26 日當天或之後建立的專案，Generate Content API 呼叫也會預設開啟。身為專案擁有者，你可以隨時在 AI Studio 的 [Logs](https://aistudio.google.com/logs) 頁面中開啟或關閉日誌記錄。日誌是供你自行使用的，你也可以選擇將它們作為回饋分享給 Google，協助我們持續改進模型。

啟用日誌記錄後，你可以選擇提供下列資料用於產品改進與模型訓練，協助我們打造在各領域與使用案例中都能持續為開發者帶來價值的 AI 系統：

* **資料集：** 使用 Google AI Studio 的 Logs 頁面，從受支援的 Gemini API 呼叫中挑選感興趣的日誌（要求、回應、中繼資料等）；透過納入資料集的方式提供，並可在建立資料集時選擇退出。

* **回饋：** 在查看日誌時，你可以提供回饋，包括按讚或倒讚評分，以及你提供的任何文字意見。


當你與 Google 分享資料集時，該資料集中的日誌（包括要求與回應）將依照我們針對「[Unpaid Services](/docs/terms/#data-use-unpaid)」的[條款](https://developers.google.com/terms)進行處理，也就是說，該資料集可能會用於開發與改進 Google 的產品、服務與機器學習技術，包括改進與訓練我們的模型。

請勿捐贈來自歐洲經濟區、瑞士或英國使用者的 API 用戶端資料，也請勿捐贈屬於個人、敏感或機密的資料。


!!! note " "

      可用選項會依你所在的位置而有所不同。


## 我們如何使用你的資料 {#use-data}

日誌的預設最長保留期限為 55 天。超過此期限後，日誌會自動標記為刪除。你可以在 AI Studio 中更新專案的儲存保留期限，讓日誌在 7、14、28 或 55 天後自動標記為刪除。

你可以建立[資料集](/docs/logs-datasets/)，將感興趣的日誌保留超過設定的保留期限，供下游使用案例使用，並可選擇性地提供用於模型改進。儲存在資料集中的日誌沒有設定的保留期限。

根據預設，由於日誌記錄僅適用於已啟用計費的專案，日誌中的提示詞與回應不會用於產品改進或開發，這符合我們條款中關於資料使用的規定。

如果你選擇與 Google 分享日誌資料集，這些資料集將作為真實世界的示範資料，協助我們更深入理解 AI 系統與應用程式所使用的各種領域與情境多樣性。這些資料可能會用於提升模型品質，並為未來模型與服務的訓練與評估提供參考。這些資料的處理方式，依照我們針對 [Unpaid Services](/docs/terms/#data-use-unpaid) 的資料使用[條款](https://developers.google.com/terms)辦理。

因此，人工審閱者可能會閱讀、註記並處理你分享的 API 輸入與輸出。在資料用於模型改進之前，Google 會採取措施保護使用者隱私，包括在審閱者查看或註記之前，先將這些資料與你的 Google 帳號、API 金鑰及 Cloud 專案解除連結。

## 資料權限 {#permissions}

選擇提供 API 資料，即表示你確認你擁有必要的權限，讓 Google 能依照本文件所述方式處理與使用這些資料。**請勿提供透過付費服務取得的、包含敏感、機密或專有資訊的日誌**。你依據 API 條款中「[Submission of Content](https://developers.google.com/terms#b_submission_of_content)」一節授予 Google 的授權，在適用法律要求我們使用的範圍內，也延伸至你提交至服務的任何內容（例如提示詞，包括相關的系統指令、快取內容，以及圖片、影片或文件等檔案），以及任何產生的回應。

## 資料分享與回饋 {#sharing-feedback}

你可以選擇分享你的資料作為範例，協助我們推進 AI 研究的前沿、Gemini API 與 Google AI Studio，讓我們能在各種情境中持續改進模型，並打造在各領域與使用案例中都能持續為開發者帶來價值的 AI 系統。

### Gemini API Contributor Tier {#contributor-tier}


!!! note " "

      **新功能：** Gemini API Contributor Tier 目前以邀請制私人預覽形式提供。符合資格的使用者將透過電子郵件收到邀請，並在 AI Studio 中看到提示訊息。


Gemini Contributor Tier 讓開發者能以折扣價格使用特定模型的權杖，交換條件是允許 Google 使用這些模型的資料，來提供、改進與開發 Google 的產品與服務以及機器學習技術。

開發者可在特定模型上享有最高 50% 的權杖費用折扣，並享有與[標準 API](/docs/optimization/) 相同的即時效能。目前支援下列模型：

| 模型 | Contributor Tier |
| --- | :---: |
| [Gemini 4 Argon](/docs/pricing/#gemini-4-argon) | ✔️ |
| [Gemini 4 Hydrogen](/docs/pricing/#gemini-4-hydrogen) | ✔️ |

**資料使用：**

*   只要為專案啟用 Contributor Tier，你在該專案中使用參與模型所產生的資料，將依照我們針對「[Unpaid Services](/docs/terms/#unpaid-services)」的條款使用。由於你的資料將用於改進 Google 產品與機器學習技術，請勿提交敏感或個人資訊。
