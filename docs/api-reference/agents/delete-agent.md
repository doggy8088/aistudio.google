# 刪除代理


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/`.


`DELETE` `https://generativelanguage.googleapis.com/v1beta/agents/{agentsId}`

刪除代理。


  
## 參數 {#parameters}

  
  **agentsId**: required `string`

  要刪除的代理名稱。

  

  

  
  **請求範例** 

  

=== "REST"

      ```sh
      curl -X DELETE https://generativelanguage.googleapis.com/v1beta/agents/ag_abc123 \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Python"

      ```python
      import uuid
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})


      client.agents.delete(agent_id)
      print("Agent deleted successfully.")
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({apiVersion: 'v1beta'});


      await ai.agents.delete(agentId);
      console.log('Agent deleted successfully.');
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.agents.Agent;
      import com.google.genai.types.HttpOptions;

      Client client =
          Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();


      client.agents.delete(agentId);
      System.out.println("Agent deleted successfully.");
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


          _, err = client.Agents.Delete(ctx, operations.DeleteAgentRequest{ID: agentID})
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println("Agent deleted successfully.")
      }
      ```


  


## 回應 {#response}


