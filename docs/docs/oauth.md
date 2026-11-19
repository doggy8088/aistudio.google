# 使用 OAuth 進行驗證的快速入門

向 Gemini API 進行驗證最簡單的方式，是按照 [Gemini API 開始使用指南](/docs/get-started/)中的說明設定 API 金鑰。若你需要更嚴格的存取控制，也可以改用 OAuth。本指南將協助你完成 OAuth 驗證的設定。

本指南採用簡化的驗證方式，適合測試環境使用。若是正式環境，在[選擇適合應用的存取憑證](https://developers.google.com/workspace/guides/create-credentials#choose_the_access_credential_that_is_right_for_you)之前，請先了解[驗證與授權](https://developers.google.com/workspace/guides/auth-overview)的相關概念。

## 目標 {#objectives}

* 為 OAuth 設定你的雲端專案
* 設定應用程式預設憑證
* 在程式中自行管理憑證，而不使用 `gcloud auth`

## 前置條件 {#prerequisites}

執行本快速入門需要：

* [一個 Google Cloud 專案](https://developers.google.com/workspace/guides/create-project)
* [在本機安裝 gcloud CLI](https://cloud.google.com/sdk/docs/install)

## 設定你的雲端專案 {#set-cloud}

要完成本快速入門，首先需要設定你的 Cloud 專案。

### 1. 啟用 API {#enable-api}

使用 Google API 之前，你必須先在 Google Cloud 專案中將其啟用。

* 在 Google Cloud 控制台中，啟用 Google Generative Language API。

  [啟用 API](https://console.cloud.google.com/flows/enableapi?apiid=generativelanguage.googleapis.com)


### 2. 設定 OAuth 同意畫面 {#configure-oauth}

接著設定專案的 OAuth 同意畫面，並將自己新增為測試使用者。若你已為 Cloud 專案完成此步驟，請直接跳到下一節。

1. 在 Google Cloud 控制台中，依序前往 **Menu** >
   **Google Auth platform** > **Overview**。

[前往 Google Auth platform](https://console.developers.google.com/auth/overview)

1. 填寫專案設定表單，並在 **Audience** 區段中將使用者類型設定為 **External**。

2. 填寫表單的其餘欄位，接受 User Data Policy 條款，然後按一下 **Create**。

3. 目前可以先略過新增範圍的步驟，按一下 **Save and Continue**。日後當你建立供 Google Workspace 機構外部使用的應用程式時，必須新增並驗證應用程式所需的授權範圍。

4. 新增測試使用者：

   1.  導覽至 Google Auth platform 的
       [Audience 頁面](https://console.developers.google.com/auth/audience)。

   2.  在 **Test users** 下方，按一下 **Add users**。

   3.  輸入你的電子郵件地址以及其他獲授權的測試使用者，然後按一下 **Save**。


### 3. 為桌面應用程式授權憑證 {#authorize-credentials}

若要以使用者身分進行驗證並在應用程式中存取使用者資料，你必須建立一或多個 OAuth 2.0 Client ID。Client ID 用於向 Google 的 OAuth 伺服器識別單一應用程式。若你的應用程式在多個平台上執行，則必須為每個平台建立各自的 Client ID。

1. 在 Google Cloud 控制台中，依序前往 **Menu** > **Google Auth platform** >
   **Clients**。

[前往 Credentials](https://console.developers.google.com/auth/clients)

1. 按一下 **Create Client**。

2. 按一下 **Application type** > **Desktop app**。

3. 在 **Name** 欄位中，為憑證輸入一個名稱。此名稱僅會顯示在 Google Cloud 控制台中。

4. 按一下 **Create**。畫面會顯示 OAuth 用戶端建立完成的頁面，列出你新取得的 Client ID 與 Client secret。

5. 按一下 **OK**。新建立的憑證會顯示在 **OAuth 2.0 Client
   IDs** 下方。

6. 按一下下載按鈕儲存 JSON 檔案。檔案會儲存為
   `client_secret_<identifier>.json`，請將它重新命名為 `client_secret.json`
   並移至你的工作目錄。


## 設定應用程式預設憑證 {#set-application-default}

若要將 `client_secret.json` 檔案轉換為可用的憑證，請將其位置傳給
`gcloud auth application-default login` 指令的
`--client-id-file` 參數。

```posix-terminal
gcloud auth application-default login \
    --client-id-file=client_secret.json \
    --scopes='https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/generative-language.retriever'
```

本教學的簡化專案設定會觸發 **"Google hasn't
verified this app."** 對話框。這是正常現象，請選擇 **"continue"**。

這樣產生的 token 會放置在眾所皆知的位置，以便 `gcloud` 或用戶端程式庫存取。


!!! note " "

      注意：若在 Colab 上執行，請加上 `--no-browser`，並仔細按照它印出的指示操作（不要只點連結）。另外，請確認你本機的
      `gcloud --version` 是
      [最新版本](https://cloud.google.com/sdk/docs/release-notes)，以與 Colab 一致。


```bash
gcloud auth application-default login \
    --no-browser \
    --client-id-file=client_secret.json \
    --scopes='https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/generative-language.retriever'
```

設定好應用程式預設憑證（ADC）後，大多數語言的用戶端程式庫幾乎不需要額外協助就能找到它。

### Curl {#curl}

測試這是否運作正常的最快方式，是用它透過 curl 存取 REST
API：

```posix-terminal
access_token=$(gcloud auth application-default print-access-token)
project_id=<MY PROJECT ID>

curl -X GET https://generativelanguage.googleapis.com/v1/models \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer ${access_token}" \
    -H "x-goog-user-project: ${project_id}" | grep '"name"'
```

### Python {#python}

在 Python 中，用戶端程式庫應該會自動找到它：

```bash
pip install google-genai
```

一個可用於測試的最小指令碼如下：

```python
from google import genai

client = genai.Client()
print('Available base models:', [m.name for m in client.models.list()])
```

## 自行管理憑證 [Python] {#manage-credentials}

在許多情況下，你手邊不會有 `gcloud` 指令可用來從 Client ID（`client_secret.json`）建立存取 token。Google 在多種語言中都提供程式庫，讓你能在應用程式內管理這個流程。本節以 Python 示範此流程。其他語言的同類範例可在
[Drive API 文件](https://developers.google.com/drive/api/quickstart/python)中找到。

### 1. 安裝必要的程式庫 {#install-libs}

安裝 Google 的 Python 用戶端程式庫，以及 Gemini 用戶端程式庫。

```posix-terminal
pip install --upgrade -q google-api-python-client google-auth-httplib2 google-auth-oauthlib

pip install google-genai
```

### 2. 撰寫憑證管理程式 {#write-credentials}

為了盡量減少你必須點選授權畫面的次數，請在工作目錄中建立一個名為 `load_creds.py` 的檔案，由它快取一份 `token.json` 檔案，供日後重複使用，或在到期時重新整理。

先使用下列程式碼，將 `client_secret.json` 檔案轉換為可供
`genai.configure` 使用的 token：

```python
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ['https://www.googleapis.com/auth/generative-language.retriever']

def load_creds():
    """Converts `client_secret.json` to a credential object.

    This function caches the generated tokens to minimize the use of the
    consent screen.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'client_secret.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds
```

### 3. 撰寫你的程式 {#write-program}

接著建立你的 `script.py`：

```python
import pprint
from google import genai
from load_creds import load_creds

creds = load_creds()

client = genai.Client(credentials=creds)

print()
print('Available base models:', [m.name for m in client.models.list()])
```

### 4. 執行你的程式 {#run-program}

在你的工作目錄中，執行範例：

```posix-terminal
python script.py
```

第一次執行指令碼時，它會開啟瀏覽器視窗並提示你授權存取。

1. 若你尚未登入 Google 帳戶，系統會提示你登入。若你登入了多個帳戶，**請務必選擇你在設定專案時設為「Test Account」的帳戶。**


!!! note " "

      注意：本教學的簡化專案設定會觸發 **"Google
      hasn't verified this app."** 對話框。這是正常現象，請選擇 **"continue"**。


1. 授權資訊會儲存在檔案系統中，因此你下次執行範例程式碼時，就不會再被提示進行授權。

你已成功完成驗證的設定。
