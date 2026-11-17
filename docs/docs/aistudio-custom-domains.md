# Google AI Studio 中的自訂網域

在 Google AI Studio Build mode 中發布的網頁應用程式，會獲得一個免費的 `ai.studio` 子網域。你也可以從 **Publish** 面板購買並連接你自己的自訂網域，例如 `example.com`。

AI Studio 會透過 [Cloud Domains](https://cloud.google.com/domains) 註冊你的網域，並在你的 Google Cloud 專案中設定 [Cloud DNS](https://cloud.google.com/dns) 路由，接著為你的 [Cloud Run](https://cloud.google.com/run) 服務建立受管理的 SSL 憑證。

[Open Build in AI Studio](https://aistudio.google.com/apps)

## 必要條件 {#prerequisites}

購買或連結自訂網域之前，請先確認你的專案符合以下三項要求：

1. **Paid Google Cloud project**：自訂網域需要具備有效 Cloud Billing 帳戶的[付費 Google Cloud 專案](/docs/aistudio-deploying/#standard-deployment)。自訂網域不適用於 [Google Cloud Starter Tier](/docs/aistudio-deploying/#about-the-starter-tier)。若你的應用程式使用 Starter Tier，請在 **Publish** 面板的 **Custom domains** 卡片上點選 **Upgrade to continue**，以連結計費帳戶。
2. **IAM permissions**：你的 Google 帳戶需要具備該專案的 **Owner**（`roles/owner`）或 **Editor**（`roles/editor`）角色。或者，授予 **Cloud Domains Admin**（`roles/domains.admin`）、**DNS Administrator**（`roles/dns.admin`）與 **Cloud Run Admin**（`roles/run.admin`）。若 Cloud Domains、Cloud DNS 與 Cloud Run API 尚未啟用，請授予 **Service Usage Admin**（`roles/serviceusage.serviceUsageAdmin`）或 `serviceusage.services.enable`。
3. **Available domain registration quota**：每個 Google Cloud 專案對有效網域註冊數量都有預設上限，上限會依專案紀錄而有所不同。若你已達到專案上限，請[申請額外的網域配額](/docs/aistudio-custom-domains/#request-additional-domains)。


!!! note " "

      連結 Cloud Billing 帳戶會將 Starter Tier 專案升級為標準的付費 Google Cloud 專案。升級後，你的帳戶將不再符合 Google Cloud Starter Tier 的資格。


## 定價與計費 {#pricing}

Google 會將自訂網域的費用，計入與你的 Google Cloud 專案連結的 Cloud Billing 帳戶。總費用由每年的網域註冊價格與持續收取的 Cloud DNS 代管費用組成。

| 費用項目 | 價格 | 計費方式 |
| :--- | :--- | :--- |
| **Domain registration** | 每年 $12.00 起（依頂級網域而定，例如 `.com`、`.net`、`.app` 或 `.cloud`） | 預先收取 1 年費用。除非取消，否則每年自動續約 |
| **Cloud DNS managed zone** | 每年 $2.40 起（每個受管理區域每月 $0.20），另加[查詢用量費用](https://cloud.google.com/dns/pricing) | 依有效區域數量與 DNS 查詢量按月計費 |


!!! warning " "

      AI Studio 會在你的 Google Cloud 專案中建立 Cloud DNS 受管理區域，將來自你網域的流量路由到 Cloud Run。自訂網域連接期間，請保持此受管理區域完整，否則訪客將無法連上你的應用程式。網域一經註冊，購買費用恕不退還。


## 購買並連接網域 {#buy-domain}

你可以在首次發布應用程式時購買新網域，也可以為已發布的應用程式新增網域。以下各節也涵蓋電子郵件驗證與 SSL 佈建。

1. 在 [Build mode](https://aistudio.google.com/apps) 中開啟你的網頁應用程式，點選右上角的 **Publish**。
2. 啟動自訂網域流程：
   * **Unpublished app**：確認你的 Google Cloud 專案與計費帳戶，點選 **Continue**，然後在 **Custom domains** 卡片上點選 **Purchase a domain**。
   * **Published app**：在 **App URL** 旁點選 **+**（**Add custom domain**），然後選取 **Buy a new domain**。若要更換已連接的網域，請開啟三點圖示的 **Custom domain options** 選單，選取 **Change custom domain > Purchase a domain**。

3. 在 **Search for a domain** 中輸入想要的網域名稱，按下 **Enter** 或點選搜尋按鈕。AI Studio 會顯示可用的網域及其每年的註冊價格。
4. 點選想要的網域旁的 **Select**。點選 **Cost breakdown**，檢視網域註冊費用與 Cloud DNS 的基本費用。
5. 勾選表示知悉 [Squarespace Terms of Service](https://www.squarespace.com/terms-of-service) 與 [Google Cloud Terms](https://cloud.google.com/terms) 的方塊（在專案中首次購買網域時顯示），然後點選 **Continue**。
6. 填寫你的註冊人聯絡資料。輸入你的姓名、電子郵件、電話號碼（例如 `+1 888 555 0123`）與郵寄地址。你的聯絡資訊預設為私人資訊，不會出現在公開的 WHOIS 查詢中。
7. 點選 **Purchase domain for `<price>`+ /year**（例如 **Purchase domain for $14.40+ /year**）。部分 Cloud Run 區域不支援網域對應。若有需要，AI Studio 會在將你的服務移至支援的區域之前先徵詢你的同意。
8. 確認橫幅出現後，點選 **Continue**（若是首次發布，再點選 **Publish your app**），即可連接網域。

### 電子郵件驗證 {#verify-email}

購買網域後，你必須在 **15 days** 內驗證註冊人的電子郵件地址，否則註冊商會暫停該網域。請留意來自 `no-reply@squarespace.com`（Cloud Domains 的註冊商合作夥伴）的電子郵件，並點選其中的驗證連結。

在驗證待處理期間，AI Studio 會在 **Publish** 面板中你的網域旁顯示警告圖示。驗證電子郵件可能需要幾分鐘才會送達。若找不到該郵件，請點選網域旁三點圖示的 **Custom domain options** 選單，選取 **Manage subscription**，再從 Google Cloud 控制台重新寄送驗證電子郵件。

### SSL 憑證佈建 {#ssl-provisioning}

購買完成後，AI Studio 會分三個階段連接你的網域，進度會顯示在 **App URL(s)** 下方網域旁的狀態旋轉圖示中：

1. **Purchasing domain**：在 Cloud Domains 中註冊網域。
2. **Connecting domain to your app**：建立 Cloud DNS 受管理區域、設定 DNS 記錄，並將網域對應到你的 Cloud Run 服務。
3. **Provisioning SSL certificate**：核發由 Google 管理的 SSL 憑證，讓你的網域能提供 HTTPS 流量。

DNS 與 SSL 設定需要 15 到 30 分鐘。DNS 變更的傳播可能需要更久。設定完成前，你的應用程式仍可透過其 `ai.studio` 網址存取。若網域連結過程中發生暫時性錯誤，請點選網域列旁的 **Retry**。

## 重複使用已擁有的網域 {#reuse-domain}

你可以連接先前透過 Google AI Studio 在同一個 Google Cloud 專案中購買的任何網域，無論該網域是尚未指派、靜置於你的網域組合中，還是已連結到另一個 AI Studio 應用程式。

1. 在目標應用程式上開啟 **Publish** 面板。
2. 在 **Custom domains** 卡片上選取 **Use a domain I own**（若是已發布的應用程式，則在 **App URL** 旁點選 **+**，再選取 **Use a domain you own**）。
3. 從清單中選取網域。若該網域已連結到另一個應用程式，請確認 **Move domain** 提示。
4. 點選 **Continue**。接著點選 **Publish your app**（首次發布時）或 **Finish**（更換網域時）。

AI Studio 會將移轉的網域從先前的應用程式中解除連結，並將流量路由到新的應用程式。先前的應用程式仍可透過其 `ai.studio` 網址存取。

## 管理或取消訂閱 {#manage-domain}

如要管理已連接的自訂網域，請開啟已發布應用程式的 **Publish** 面板，點選 **App URL(s)** 下方網域旁三點圖示的 **Custom domain options** 選單：

* **Manage subscription**：在 [Cloud Domains console](https://console.cloud.google.com/net-services/domains/registrations/list) 中開啟你的網域註冊資料。使用此頁面可編輯你的聯絡資訊、重新寄送驗證電子郵件、檢視 DNS 設定，或變更每年的自動續約設定。
* **Change custom domain**：購買新網域（**Purchase a domain**）或從你的專案中選取另一個網域（**Use a domain I own**），以更換應用程式的自訂網域。AI Studio 會詢問，要保留還是取消被更換網域的訂閱。
* **Remove custom domain**：解除自訂網域的連結，讓你的應用程式改用內建的 `ai.studio` 網址，接著提示你選擇網域計費的後續處理方式：
  * **Cancel domain subscription**：關閉每年的自動續約。網域在目前的 1 年期限結束前仍歸你所有，期滿後即失效且不再續約。取消訂閱不會刪除該網域的 [Cloud DNS managed zone](https://console.cloud.google.com/net-services/dns/zones)。若你不會再重複使用該網域，請在 Cloud DNS 中刪除該受管理區域，以停止每月 $0.20 的費用。
  * **Keep domain subscription**：讓每年的自動續約保持有效，並將網域保留在你的專案網域組合中，方便日後連結到另一個應用程式。


若已連結自訂網域，從 [Apps page](https://aistudio.google.com/apps) 取消發布應用程式或將其刪除時，也會顯示相同的提示。你可以在應用程式取消發布或移除之前，取消或保留該網域訂閱。

## 申請額外的網域 {#request-additional-domains}

每個 Google Cloud 專案都有一個預設的 **Domain registrations** 配額，依帳戶與計費紀錄而定。若你已達到上限，請在 Google Cloud 控制台中申請更高的配額。

[Open domain registration quota](https://console.cloud.google.com/iam-admin/quotas?service=domains.googleapis.com&metric=domain-registrations)

提交申請前，請先確認你的專案有有效的 Cloud Billing 帳戶。你的 Google 帳戶也需要具備 `serviceusage.quotas.update` 或 `cloudquotas.quotas.update` 權限。具備此權限的預先定義角色包括 **Owner**、**Editor**、**Cloud Quotas Admin**（`roles/cloudquotas.admin`）與 **Quota Administrator**（`roles/servicemanagement.quotaAdmin`）。

如要申請更高的網域上限：

1. 在 Google Cloud 控制台中開啟 [Domain registrations quota](https://console.cloud.google.com/iam-admin/quotas?service=domains.googleapis.com&metric=domain-registrations) 頁面。
2. 在控制台頂端的專案選擇器中，選取與你的 AI Studio 應用程式連結的 Google Cloud 專案。
3. 勾選 **Domain registrations**（位於 **Cloud Domains API** 之下）旁的方塊，然後點選 **Edit**（鉛筆圖示）。若出現提示，請點選 **Apply for higher quota**。
4. 在 **New value** 中輸入所需的網域總數，在 **Request description** 中描述你的用途，然後點選 **Done**。
5. 點選 **Next**，若出現提示請確認你的聯絡資料，然後點選 **Submit request**。

較新的 Google Cloud 專案所提出的申請會經過人工審查，需要 1 到 2 個工作天。審查完成後，Google Cloud Support 會以電子郵件通知你。你可以在 [Increase Requests tab](https://console.cloud.google.com/iam-admin/quotas/qirs) 查看待處理的申請。

在 AI Studio 中將網域從應用程式移除後，其註冊在已付費的 1 年期限結束前仍保持有效。即使選取 **Cancel domain subscription**，該網域在失效前仍會計入你的上限。若想提早釋放配額，請將網域轉移到另一個註冊商，並在 [Cloud Domains](https://console.cloud.google.com/net-services/domains/registrations/list) 中將其刪除。

## 疑難排解 {#troubleshooting}

| 症狀 | 原因與解決方法 |
| :--- | :--- |
| **Domain registration quota exceeded** | 你的專案已達到有效網域註冊上限。使用 **Use a domain I own** 重複使用現有網域，或[申請額外的網域配額](/docs/aistudio-custom-domains/#request-additional-domains)。 |
| **Warning icon: email verification required** | 註冊人的電子郵件尚未驗證。開啟來自 `no-reply@squarespace.com` 的電子郵件，或點選 **Custom domain options > Manage subscription**，從 Google Cloud 控制台重新寄送。 |
| **Failed status with `Retry` button** | 網域設定或 DNS 傳播逾時。點選網域列旁的 **Retry**。 |
| **App asks to move to a new region** | Cloud Run 網域對應僅在支援的區域提供。確認後，你的應用程式會重新部署到支援的區域。你的 `ai.studio` 網址與自訂網域會繼續運作，但底層的 `run.app` 服務網址會變更。 |

## 限制 {#limitations}

* **Domains registered outside AI Studio**：只有在同一個 Google Cloud 專案中、於 Google AI Studio 內購買的網域，才會出現在 **Use a domain I own** 之下。我們計畫在未來支援從外部註冊商轉入或連接網域。
* **Web apps on paid projects only**：自訂網域適用於在付費 Google Cloud 專案上發布的網頁應用程式，不適用於 Android 應用程式或 Starter Tier 應用程式。
* **Supported top-level domains and length**：搜尋結果只包含支援私人 WHOIS 保護的頂級網域。網域名稱長度上限為 63 個字元。
* **One custom domain per app**：為應用程式連接新的自訂網域，會取代該應用程式已連結的任何自訂網域。

## 後續步驟 {#whats-next}

* 進一步瞭解 [在 Google AI Studio 中發布應用程式](/docs/aistudio-deploying/)。
* 檢視付費 Google Cloud 專案的 [Billing](/docs/billing/)。
* 閱讀 [Google Cloud Quotas documentation](https://docs.cloud.google.com/docs/quotas/view-manage)，瞭解一般的專案配額管理。


