# Gemini Environments API


!!! note " "

      此 API 目前為 Beta 版。端點位於 `/v1beta/` 之下。


環境提供隔離的執行上下文，讓代理程式碼、工具與服務能安全執行。

## 方法 {#methods}


| 方法 | HTTP 要求 |
| --- | --- |
| [建立環境](/api-reference/environments/create-environment/) | `POST` `/v1beta/environments` 建立環境。 |
| [列出環境](/api-reference/environments/list-environments/) | `GET` `/v1beta/environments` 列出環境。 |
| [取得環境檔案](/api-reference/environments/get-environment-files/) | `GET` `/v1beta/environments/{environment}/files/{path}` 從環境的快照中擷取檔案中繼資料或目錄內容。 |
| [取得環境](/api-reference/environments/get-environment/) | `GET` `/v1beta/environments/{id}` 取得環境。 |
| [上傳環境檔案](/api-reference/environments/start-environment-file-upload/) | `PUT` `/upload/v1beta/environments/{environment}/files/{path}` 為環境工作區中的檔案啟動可續傳的上傳工作階段。 |
| [刪除環境](/api-reference/environments/delete-environment/) | `DELETE` `/v1beta/environments/{id}` 刪除環境。 |


## 資源 {#resources}

### Environment {#Resource:Environment}

代理的執行環境。

**屬性**：


  **id**: required `string`

  僅供輸出。環境的 ID。

  

---


  

??? note "**sources**: `Source array` 要掛載到環境中的來源。"

    ??? note "**type**: `string enum`"

        可能的值：

        - `gcs`：Cloud Storage 值區。
        - `inline`：行內內容。
        - `repository`：一般儲存庫。來源 URL 中的通訊協定前綴可識別提供者（例如 github://、gcs://）。



      **source**: `string`

      環境的來源。對於 Cloud Storage，這是 Cloud Storage 路徑；對於 GitHub，這是 GitHub 路徑。

      **target**: `string`

      來源在環境中應出現的位置。

      **content**: `string`

      當 `type` 為 `INLINE` 時的行內內容。

      **encoding**: `string`

      行內內容的選用編碼（例如 `base64`）。



  

---


  **created**: `string`

  僅供輸出。環境建立的時間，採用 ISO 8601 格式 (YYYY-MM-DDThh:mm:ssZ)。

  

---


  **updated**: `string`

  僅供輸出。環境最後更新的時間，採用 ISO 8601 格式 (YYYY-MM-DDThh:mm:ssZ)。

  

---


  **last_accessed**: `string`

  僅供輸出。環境最後存取的時間，採用 ISO 8601 格式 (YYYY-MM-DDThh:mm:ssZ)。

  

---


  

??? note "**status**: `string enum` 僅供輸出。環境容器的狀態。"

    可能的值：

    - `active`：僅供輸出。環境容器的狀態。
    - `expired`：僅供輸出。環境容器的狀態。



  

---


  

??? note "**network**: `EnvironmentNetworkEgressAllowlist` or `string enum` 環境的網路設定。"

      **可能的類型：** 



    ??? note "**EnvironmentNetworkEgressAllowlist**"

          環境的網路輸出設定。



        ??? note "**allowlist**: `EgressRule array` or `string enum` 允許的網域及其設定清單。設為 `"disabled"` 可封鎖所有網路輸出。"

              **可能的類型：** 



            ??? note "**EgressRule array**"

                單一網域允許清單規則，可選用標頭注入。

                **domain**: required `string`

                允許送出要求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

                **transform**: `object`

                要注入符合此規則之要求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

                **credential**: `string`

                選填。以 ID 參照由伺服器管理的 Credential 資源。





            ??? note "**string enum**"

                可能的值：

                - `disabled`：所有網路輸出皆被封鎖。





    ??? note "**string enum**"

        可能的值：

        - `disabled`：所有網路輸出皆被封鎖。



  

---


  **file_count**: `string`

  僅供輸出。環境中的檔案數量，僅供輸出。

  

---


  **size_bytes**: `string`

  僅供輸出。環境檔案的總大小（以位元組為單位），僅供輸出。

  

---


  

??? note "**mode**: `string enum` 僅供輸出。此環境的運算生命週期模式。"

    可能的值：

    - `on_demand`：僅供輸出。此環境的運算生命週期模式。
    - `self_hosted`：僅供輸出。此環境的運算生命週期模式。



  

---


  **custom_config**: `object`

  僅供輸出。由客戶自訂的任意 JSON 設定，會直接傳遞給自行託管環境的輪詢器。僅在已設定時，才會為 `self_hosted` 環境填入。

  

---


  **environment_key**: `string`

  僅供輸出。在建立環境時為 self_hosted 環境產生的秘密 token。由自行託管的沙箱守護程序用來驗證輪詢與串流要求。僅在 CreateEnvironment 回應中傳回；後續的 GetEnvironment 與 ListEnvironments 呼叫會省略此欄位。