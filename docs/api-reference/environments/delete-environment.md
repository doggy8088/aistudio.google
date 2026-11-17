# 刪除環境


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 之下。


`DELETE` `https://generativelanguage.googleapis.com/v1beta/environments/{id}`

刪除一個環境。


  
## 參數 {#parameters}

  
  **id**: required `string`

  構成資源 `name` 的資源 ID 區段。如 https://google.aip.dev/122 所述，它可在其父集合中識別該資源。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl -X DELETE https://generativelanguage.googleapis.com/v1beta/environments/env_abc123 \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})


      client.environments.delete(id=created.id)
      print("Environment deleted successfully.")
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({apiVersion: 'v1beta'});


      await ai.environments.delete(created.id);
      console.log('Environment deleted successfully.');
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.environments.Environment;
      import com.google.genai.types.HttpOptions;

      Client client =
          Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();


      client.environments.deleteEnvironment(envId);
      System.out.println(
          "com.google.genai.gaos.models.environments.Environment deleted successfully.");
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


          _, err = client.Environments.DeleteEnvironment(ctx, operations.DeleteEnvironmentRequest{
              ID: envID,
          })
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println("Environment deleted successfully.")
      }
      ```


  


## 回應 {#response}


