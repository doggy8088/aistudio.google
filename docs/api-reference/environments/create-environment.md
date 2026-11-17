# 建立環境


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 之下。


`POST` `https://generativelanguage.googleapis.com/v1beta/environments`

建立一個環境。


  
## 請求主體 {#request-body}

  
  

??? note "**network**: `EnvironmentNetworkEgressAllowlist` or `string enum` 環境的網路設定。"

      **可能的類型**： 



    ??? note "**EnvironmentNetworkEgressAllowlist**"

          環境的網路輸出設定。



        ??? note "**allowlist**: `EgressRule array` or `string enum` 允許的網域清單及其設定。設為 `"disabled"` 可封鎖所有網路輸出。"

              **可能的類型**： 



            ??? note "**EgressRule array**"

                單一網域允許清單規則，可選擇性注入標頭。

                **domain**: required `string`

                允許對外請求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

                **transform**: `object`

                要注入至符合此規則之請求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

                **credential**: `string`

                選填。依 ID 參照伺服器代管的 Credential 資源。





            ??? note "**string enum**"

                可能的值：

                - `disabled`: 所有網路輸出皆被封鎖。





    ??? note "**string enum**"

        可能的值：

        - `disabled`: 所有網路輸出皆被封鎖。



  

---


  

??? note "**sources**: `Source array` 要掛載至環境的來源。"

    ??? note "**type**: `string enum`"

        可能的值：

        - `gcs`: Cloud Storage 值區。
        - `inline`: 內嵌內容。
        - `repository`: 一般儲存庫。來源 URL 中的通訊協定前綴可識別提供者（例如 github://、gcs://）。



      **source**: `string`

      環境的來源。對 Cloud Storage 而言，這是 Cloud Storage 路徑；對 GitHub 而言，這是 GitHub 路徑。

      **target**: `string`

      來源在環境中應出現的位置。

      **content**: `string`

      當 `type` 為 `INLINE` 時的內嵌內容。

      **encoding**: `string`

      內嵌內容的選填編碼（例如 `base64`）。



  

---


  

??? note "**mode**: `string enum` 此環境的運算生命週期模式。"

    可能的值：

    - `on_demand`: 此環境的運算生命週期模式。
    - `self_hosted`: 此環境的運算生命週期模式。



  

---


  **custom_config**: `object`

  選填。由客戶自訂的任意 JSON 設定，會原樣傳遞給自行託管環境的輪詢器。僅在 `mode` 為 `SELF_HOSTED` 時支援。

  

---


  **from_environment**: `string`

  選填。要複製／分支的來源環境。格式：`environments/{environment_id}` 或 `{environment_id}`。指定此欄位時，`sources` 與 `env` 必須為空。

  

---


  **system_instruction**: `string`

  選填。套用至在此環境中執行的互動的系統指令。僅支援 `SELF_HOSTED` 環境，且建議在此類環境中使用。

  

  

  
  **範例請求** 

  

=== "建立"


    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/environments \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "sources": [{
                "type": "inline",
                "target": "main.py",
                "content": "print(\"Hello, World!\")"
              }]
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})
          environment = client.environments.create(
              sources=[{
                  "type": "inline",
                  "target": "main.py",
                  "content": "print('Hello, World!')",
              }]
          )
          print(environment.id)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});
          const environment = await ai.environments.create({
            sources: [
              {
                type: 'inline',
                target: 'main.py',
                content: "print('Hello, World!')",
              },
            ],
          });
          if (!environment.id) {
            throw new Error('Environment creation failed: ID is undefined');
          }
          console.log(environment.id);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.environments.CreateEnvironmentRequest;
          import com.google.genai.gaos.models.environments.Environment;
          import com.google.genai.types.HttpOptions;
          import com.google.genai.gaos.models.interactions.Source;
          import com.google.genai.gaos.models.interactions.SourceType;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
          CreateEnvironmentRequest request =
              CreateEnvironmentRequest.builder()
                  .sources(
                      List.of(
                          Source.builder()
                              .type(SourceType.INLINE)
                              .target("main.py")
                              .content("print('Hello, World!')")
                              .build()))
                  .build();
          com.google.genai.gaos.models.environments.Environment environment =
              client.environments.createEnvironment(request).environment().orElseThrow();
          System.out.println(environment.id().orElse(""));
          ```

    === "Go"

          ```go
          package main

          import (
              "context"
              "fmt"
              "log"
              "google.golang.org/genai"
              gaos_environments "google.golang.org/genai/interactions/models/environments"
              gaos_interactions "google.golang.org/genai/interactions/models/interactions"
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

              req := operations.CreateEnvironmentRequest{
                  Body: gaos_environments.CreateEnvironmentRequest{
                      Sources: []gaos_interactions.Source{
                          {
                              Type:    genai.Ptr(gaos_interactions.SourceTypeInline),
                              Target:  genai.Ptr("main.py"),
                              Content: genai.Ptr("print('Hello, World!')"),
                          },
                      },
                  },
              }

              res, err := client.Environments.CreateEnvironment(ctx, req)
              if err != nil {
                  log.Fatal(err)
              }

              if res.Environment != nil && res.Environment.ID != "" {
                  fmt.Println(res.Environment.ID)

              }
          }
          ```

=== "複製"


    === "REST"

          ```sh
          curl -X POST https://generativelanguage.googleapis.com/v1beta/environments \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "from_environment": "environments/env_abc123"
            }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})


          environment = client.environments.create(
              from_environment=source_env.id,
          )
          print(environment.id)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});


          const environment = await ai.environments.create({
            from_environment: sourceEnv.id,
          });
          if (!environment.id) {
            throw new Error('Environment creation failed: ID is undefined');
          }
          console.log(environment.id);
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.environments.CreateEnvironmentRequest;
          import com.google.genai.gaos.models.environments.Environment;
          import com.google.genai.types.HttpOptions;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();


          CreateEnvironmentRequest request =
              CreateEnvironmentRequest.builder().fromEnvironment(sourceEnvId).build();
          com.google.genai.gaos.models.environments.Environment environment =
              client.environments.createEnvironment(request).environment().orElseThrow();
          System.out.println(environment.id().orElse(""));
          ```

    === "Go"

          ```go
          package main

          import (
              "context"
              "fmt"
              "log"
              "google.golang.org/genai"
              gaos_environments "google.golang.org/genai/interactions/models/environments"
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


              res, err := client.Environments.CreateEnvironment(ctx, operations.CreateEnvironmentRequest{
                  Body: gaos_environments.CreateEnvironmentRequest{
                      FromEnvironment: genai.Ptr(sourceEnvID),
                  },
              })
              if err != nil {
                  log.Fatal(err)
              }

              if res.Environment != nil && res.Environment.ID != "" {
                  fmt.Println(res.Environment.ID)

              }
          }
          ```


  


## 回應 {#response}


  **id**: required `string`

  僅供輸出。環境的 ID。

  

---


  

??? note "**sources**: `Source array` 要掛載至環境的來源。"

    ??? note "**type**: `string enum`"

        可能的值：

        - `gcs`: Cloud Storage 值區。
        - `inline`: 內嵌內容。
        - `repository`: 一般儲存庫。來源 URL 中的通訊協定前綴可識別提供者（例如 github://、gcs://）。



      **source**: `string`

      環境的來源。對 Cloud Storage 而言，這是 Cloud Storage 路徑；對 GitHub 而言，這是 GitHub 路徑。

      **target**: `string`

      來源在環境中應出現的位置。

      **content**: `string`

      當 `type` 為 `INLINE` 時的內嵌內容。

      **encoding**: `string`

      內嵌內容的選填編碼（例如 `base64`）。



  

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


  

??? note "**status**: `string enum` 僅供輸出。環境容器的狀態。"

    可能的值：

    - `active`: 僅供輸出。環境容器的狀態。
    - `expired`: 僅供輸出。環境容器的狀態。



  

---


  

??? note "**network**: `EnvironmentNetworkEgressAllowlist` or `string enum` 環境的網路設定。"

      **可能的類型**： 



    ??? note "**EnvironmentNetworkEgressAllowlist**"

          環境的網路輸出設定。



        ??? note "**allowlist**: `EgressRule array` or `string enum` 允許的網域清單及其設定。設為 `"disabled"` 可封鎖所有網路輸出。"

              **可能的類型**： 



            ??? note "**EgressRule array**"

                單一網域允許清單規則，可選擇性注入標頭。

                **domain**: required `string`

                允許對外請求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

                **transform**: `object`

                要注入至符合此規則之請求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

                **credential**: `string`

                選填。依 ID 參照伺服器代管的 Credential 資源。





            ??? note "**string enum**"

                可能的值：

                - `disabled`: 所有網路輸出皆被封鎖。





    ??? note "**string enum**"

        可能的值：

        - `disabled`: 所有網路輸出皆被封鎖。



  

---


  **file_count**: `string`

  僅供輸出。環境中的檔案數量，僅供輸出。

  

---


  **size_bytes**: `string`

  僅供輸出。環境檔案的總大小（以位元組計），僅供輸出。

  

---


  

??? note "**mode**: `string enum` 僅供輸出。此環境的運算生命週期模式。"

    可能的值：

    - `on_demand`: 僅供輸出。此環境的運算生命週期模式。
    - `self_hosted`: 僅供輸出。此環境的運算生命週期模式。



  

---


  **custom_config**: `object`

  僅供輸出。由客戶自訂的任意 JSON 設定，會原樣傳遞給自行託管環境的輪詢器。僅在已設定時，才會為 `self_hosted` 環境填入此欄位。

  

---


  **environment_key**: `string`

  僅供輸出。在建立環境時為 self_hosted 環境產生的秘密權杖。自行託管的沙箱常駐程式會使用此權杖驗證輪詢與串流請求。僅在 CreateEnvironment 回應中傳回，後續的 GetEnvironment 與 ListEnvironments 呼叫不會包含此欄位。

