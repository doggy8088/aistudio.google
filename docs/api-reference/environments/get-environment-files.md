# 取得環境檔案


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 之下。


`GET` `https://generativelanguage.googleapis.com/v1beta/environments/{environment}/files/{path}`

從環境的快照中擷取檔案中繼資料或目錄內容。若要下載檔案內容，請使用回應中傳回的下載 URL。


  
## 參數 {#parameters}

  
  **page_size**: `integer`

  選填。每頁最多傳回的項目數量（用於目錄清單）。

  

---


  **page_token**: `string`

  選填。目錄清單的分頁權杖。

  

---


  **recursive**: `boolean`

  選填。若為 true 且路徑為目錄，則遞迴列出所有檔案。

  

  

  
  **範例請求** 

  

=== "列出檔案"


    === "REST"

          ```sh
          curl -X GET 'https://generativelanguage.googleapis.com/v1beta/environments/env_abc123/files/src' \
            -H "x-goog-api-key: $GEMINI_API_KEY"
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})


          response = client.environments.files.list(
              environment=created.id,
              path="src",
          )
          for file in response.files or []:
            print(file.name, file.type, file.size_bytes)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});


          const response = await ai.environments.files.list({
            environment: created.id,
            path: 'src',
          });
          for (const file of response.files ?? []) {
            console.log(file.name, file.type, file.size_bytes);
          }
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.environments.EnvironmentFile;
          import com.google.genai.gaos.models.operations.GetEnvironmentFilesRequest;
          import com.google.genai.gaos.models.environments.GetEnvironmentFilesResponse;
          import com.google.genai.types.HttpOptions;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();


          com.google.genai.gaos.models.operations.GetEnvironmentFilesResponse response =
              client
                  .environments
                  .files()
                  .list(GetEnvironmentFilesRequest.builder().environment(envId).path("src").build());
          GetEnvironmentFilesResponse filesResponse =
              response.getEnvironmentFilesResponse().orElseThrow();
          for (EnvironmentFile file : filesResponse.files().orElse(List.of())) {
            System.out.println(
                file.name().orElse("")
                    + " "
                    + file.type().map(Object::toString).orElse("")
                    + " "
                    + file.sizeBytes().orElse(""));
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


              res, err := client.Environments.Files.List(ctx, operations.GetEnvironmentFilesRequest{
                  Environment: envID,
                  Path:        "src",
              })
              if err != nil {
                  log.Fatal(err)
              }

              if res.GetEnvironmentFilesResponse != nil {
                  for _, file := range res.GetEnvironmentFilesResponse.Files {
                      name := ""
                      if file.Name != nil {
                          name = *file.Name
                      }
                      fileType := ""
                      if file.Type != nil {
                          fileType = string(*file.Type)
                      }
                      var size int64
                      if file.SizeBytes != nil {
                          size = *file.SizeBytes
                      }
                      fmt.Println(name, fileType, size)
                  }
              }
          }
          ```

=== "取得檔案"


    === "REST"

          ```sh
          curl -X GET 'https://generativelanguage.googleapis.com/v1beta/environments/env_abc123/files/main.py' \
            -H "x-goog-api-key: $GEMINI_API_KEY"
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})


          response = client.environments.files.get(
              environment=created.id,
              path="main.py",
          )
          for file in response.files or []:
            print(file.name, file.size_bytes)
          ```

    === "JavaScript"

          ```javascript
          import {GoogleGenAI} from '@google/genai';

          const ai = new GoogleGenAI({apiVersion: 'v1beta'});


          const response = await ai.environments.files.list({
            environment: created.id,
            path: 'main.py',
          });
          for (const file of response.files ?? []) {
            console.log(file.name, file.size_bytes);
          }
          ```

    === "Java"

          ```java
          import com.google.genai.Client;
          import com.google.genai.gaos.models.environments.EnvironmentFile;
          import com.google.genai.gaos.models.operations.GetEnvironmentFilesRequest;
          import com.google.genai.gaos.models.environments.GetEnvironmentFilesResponse;
          import com.google.genai.types.HttpOptions;

          Client client =
              Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();


          com.google.genai.gaos.models.operations.GetEnvironmentFilesResponse response =
              client
                  .environments
                  .files()
                  .list(GetEnvironmentFilesRequest.builder().environment(envId).path("main.py").build());
          GetEnvironmentFilesResponse filesResponse =
              response.getEnvironmentFilesResponse().orElseThrow();
          for (EnvironmentFile file : filesResponse.files().orElse(List.of())) {
            System.out.println(file.name().orElse("") + " " + file.sizeBytes().orElse(""));
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


              res, err := client.Environments.Files.List(ctx, operations.GetEnvironmentFilesRequest{
                  Environment: envID,
                  Path:        "main.py",
              })
              if err != nil {
                  log.Fatal(err)
              }

              if res.GetEnvironmentFilesResponse != nil {
                  for _, file := range res.GetEnvironmentFilesResponse.Files {
                      name := ""
                      if file.Name != nil {
                          name = *file.Name
                      }
                      var size int64
                      if file.SizeBytes != nil {
                          size = *file.SizeBytes
                      }
                      fmt.Println(name, size)
                  }
              }
          }
          ```

=== "下載檔案"


    === "REST"

          ```sh
          curl -X GET 'https://generativelanguage.googleapis.com/v1beta/environments/env_abc123/files/src/main.py?alt=media' \
            -H "x-goog-api-key: $GEMINI_API_KEY" \
            --output main.py
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client(http_options={"api_version": "v1beta"})


          content = client.environments.files.download(
              environment=created.id,
              path="src/main.py",
          )
          print(content.decode("utf-8"))
          ```


  


## 回應 {#response}


  

??? note "**files**: `EnvironmentFile array` 若請求的路徑是目錄，此欄位包含其內容；若請求的路徑是檔案，此欄位包含單一項目，即該檔案的中繼資料；若指定了 alt=media，此欄位為空（內容透過 `blob` 提供）。"

      **name**: `string`

      僅供輸出。檔案或目錄的名稱（例如 "main.py" 或 "src"）。

      **path**: `string`

      僅供輸出。環境內的完整相對路徑（例如 "workspace/src/main.py"）。



    ??? note "**type**: `string enum` 僅供輸出。此項目的類型。"

        可能的值：

        - `file`: 一般檔案。
        - `directory`: 目錄。



      **size_bytes**: `string`

      僅供輸出。檔案／目錄的大小（以位元組計）。NOLINT

      **mime_type**: `string`

      僅供輸出。檔案的 MIME 類型（例如 "text/python"、"image/png"）。目錄則為空。NOLINT

      **created**: `string`

      僅供輸出。檔案／目錄的建立時間。

      **modified**: `string`

      僅供輸出。檔案／目錄的修改時間。



  

---


  **next_page_token**: `string`

  目錄清單的分頁權杖。NOLINT

