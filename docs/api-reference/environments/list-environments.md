# 列出環境


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 之下。


`GET` `https://generativelanguage.googleapis.com/v1beta/environments`

列出環境。


  
## 參數 {#parameters}

  
  

<details>
<summary>**mode**: `string enum` 選填。依運算生命週期模式篩選環境。</summary>

  

  可能的值：

  - `on_demand`
  - `self_hosted`

  

</details>


  

---


  **page_size**: `integer`

  選填。最多傳回的環境數量。若未指定，預設為 50，上限為 1000。

  

---


  **page_token**: `string`

  選填。分頁權杖。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl -X GET https://generativelanguage.googleapis.com/v1beta/environments \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})
      response = client.environments.list()
      for environment in response.environments or []:
        print(environment.id)
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({apiVersion: 'v1beta'});
      const response = await ai.environments.list();
      for (const env of response.environments ?? []) {
        console.log(env.id);
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.environments.Environment;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.operations.ListEnvironmentsResponse;

      Client client =
          Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
      ListEnvironmentsResponse response = client.environments.listEnvironmentsDirect();
      for (com.google.genai.gaos.models.environments.Environment env :
          response.listEnvironmentsResponse().flatMap(res -> res.environments()).orElse(List.of())) {
        System.out.println(env.id().orElse(""));
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{
              HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
          })
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Environments.ListEnvironments(ctx, operations.ListEnvironmentsRequest{})
          if err != nil {
              log.Fatal(err)
          }

          if res.ListEnvironmentsResponse != nil {
              for _, env := range res.ListEnvironmentsResponse.Environments {
                  if env.ID != "" {
                      fmt.Println(env.ID)
                  }
              }
          }
      }
      ```


  


## 回應 {#response}


  **environments**: [`Environment`](/api-reference/environments/list-environments/#Resource:Environment) `array`

  屬於所提供專案的環境。

  

---


  **next_page_token**: `string`

  分頁權杖。


## 資源 {#resources}

### Environment {#Resource:Environment}

供代理使用的執行環境。

**屬性**：


  **id**: required `string`

  僅供輸出。環境的 ID。

  

---


  

<details>
<summary>**sources**: `Source array` 要掛載至環境的來源。</summary>

  

  

<details>
<summary>**type**: `string enum`</summary>

  

  可能的值：

  - `gcs`: Cloud Storage 值區。
  - `inline`: 內嵌內容。
  - `repository`: 一般儲存庫。來源 URL 中的通訊協定前綴可識別提供者（例如 github://、gcs://）。

  

</details>


  **source**: `string`

  環境的來源。對 Cloud Storage 而言，這是 Cloud Storage 路徑；對 GitHub 而言，這是 GitHub 路徑。

  **target**: `string`

  來源在環境中應出現的位置。

  **content**: `string`

  當 `type` 為 `INLINE` 時的內嵌內容。

  **encoding**: `string`

  內嵌內容的選填編碼（例如 `base64`）。

  

</details>


  

---


  **created**: `string`

  僅供輸出。環境建立的時間，採 ISO 8601 格式（YYYY-MM-DDThh:mm:ssZ）。

  

---


  **updated**: `string`

  僅供輸出。環境上次更新的時間，採 ISO 8601 格式（YYYY-MM-DDThh:mm:ssZ）。

  

---


  **last_accessed**: `string`

  僅供輸出。環境上次存取的時間，採 ISO 8601 格式（YYYY-MM-DDThh:mm:ssZ）。

  

---


  

<details>
<summary>**status**: `string enum` 僅供輸出。環境容器的狀態。</summary>

  

  可能的值：

  - `active`: 僅供輸出。環境容器的狀態。
  - `expired`: 僅供輸出。環境容器的狀態。

  

</details>


  

---


  

<details>
<summary>**network**: `EnvironmentNetworkEgressAllowlist` or `string enum` 環境的網路設定。</summary>

  

  **可能的類型**： 

  

<details>
<summary>**EnvironmentNetworkEgressAllowlist**</summary>

  

  環境的網路輸出設定。

  

<details>
<summary>**allowlist**: `EgressRule array` or `string enum` 允許的網域清單及其設定。設為 `"disabled"` 可封鎖所有網路輸出。</summary>

  

  **可能的類型**： 

  

<details>
<summary>**EgressRule array**</summary>

  

  單一網域允許清單規則，可選擇性注入標頭。

  **domain**: required `string`

  允許對外請求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

  **transform**: `object`

  要注入至符合此規則之請求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

  **credential**: `string`

  選填。依 ID 參照伺服器代管的 Credential 資源。

  

</details>


  

<details>
<summary>**string enum**</summary>

  

  可能的值：

  - `disabled`: 所有網路輸出皆被封鎖。

  

</details>


  

</details>


  

</details>


  

<details>
<summary>**string enum**</summary>

  

  可能的值：

  - `disabled`: 所有網路輸出皆被封鎖。

  

</details>


  

</details>


  

---


  **file_count**: `string`

  僅供輸出。環境中的檔案數量，僅供輸出。

  

---


  **size_bytes**: `string`

  僅供輸出。環境檔案的總大小（以位元組計），僅供輸出。

  

---


  

<details>
<summary>**mode**: `string enum` 僅供輸出。此環境的運算生命週期模式。</summary>

  

  可能的值：

  - `on_demand`: 僅供輸出。此環境的運算生命週期模式。
  - `self_hosted`: 僅供輸出。此環境的運算生命週期模式。

  

</details>


  

---


  **custom_config**: `object`

  僅供輸出。由客戶自訂的任意 JSON 設定，會原樣傳遞給自行託管環境的輪詢器。僅在已設定時，才會為 `self_hosted` 環境填入此欄位。

  

---


  **environment_key**: `string`

  僅供輸出。在建立環境時為 self_hosted 環境產生的秘密權杖。自行託管的沙箱常駐程式會使用此權杖驗證輪詢與串流請求。僅在 CreateEnvironment 回應中傳回，後續的 GetEnvironment 與 ListEnvironments 呼叫不會包含此欄位。


