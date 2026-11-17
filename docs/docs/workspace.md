# 使用 Workspace 帳號存取 Google AI Studio

所有 [Google Workspace](https://workspace.google.com) 使用者預設都能存取 AI Studio。AI Studio 也是使用者管理 Gemini API 計費的主要位置。如果您是 Workspace 使用者，想開始使用 AI Studio，請參閱 [AI Studio 快速入門](/docs/ai-studio-quickstart/)。

## 疑難排解 {#troubleshooting}

如果您的 Google Workspace 帳號無法存取 AI Studio，您可能會看到類似以下的錯誤訊息：

`We are sorry, but you do not have access to Google AI Studio. Please contact
your Organization Administrator for access.`

如果您認為自己應該有權存取 AI Studio，請聯絡您的 Workspace 管理員。

## 為 Workspace 使用者啟用 AI Studio {#enable-ai-studio}

重要事項：本節內容適用對象為 Google Workspace 管理員。

身為 Google Workspace 管理員，您可以控管哪些人可以使用 AI Studio：

* 所有版本預設都會開啟 AI Studio。

* 您可以針對跨組織單位或組織單位內的使用者群組，關閉或開啟 AI Studio。

* Google Workspace for Education 版本：未滿 18 歲的使用者不得使用其 Google Workspace for Education 帳號使用 AI Studio，即使 AI Studio 設定已開啟也是如此。詳情請參閱[依年齡控管 Google 服務存取權](https://support.google.com/a/answer/10651918)。


!!! note " "

      如果您關閉 AI Studio，使用者將無法管理 Gemini API 的計費。


如要為機構中的使用者啟用或停用 AI Studio，請參閱[為使用者開啟或關閉 Google AI Studio](https://support.google.com/a/answer/15004095)。

## 僅為管理 Gemini API 計費的使用者開啟 AI Studio {#billing-group}

如果您不想為所有人開啟 AI Studio，可以只為管理 Gemini API 計費的使用者群組開啟。

1.  [建立群組](https://support.google.com/a/answer/167160)：前往 [admin.google.com/ac/groups](https://admin.google.com/ac/groups)，並將管理 Gemini API 計費的使用者加入群組。
2.  為該群組開啟 **Security** 標籤。詳情請參閱[使用安全群組控管機敏資料的存取權](https://support.google.com/a/answer/9468710)。
3.  在管理控制台中，前往[其他 Google 服務](https://admin.google.com/ac/appslist/additional)，依序點選 **AI Studio** 和 **Service status**。
4.  在左側的 **Groups** 底下，搜尋並選取您建立的群組。
5.  勾選 **ON** 方塊。
6.  點選 **Save**。

![](https://www.gstatic.com/cloud-cms/0b387a2e93b19fe4e6bd41475b82d8de.png)

