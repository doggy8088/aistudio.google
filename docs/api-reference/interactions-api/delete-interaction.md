# 刪除互動


!!! note " "

      您正在查看 Interactions API 的 Beta 版。端點位於 `/v1beta/` 下。另有穩定的 [v1 版本](/api-reference/interactions-api/delete-interaction/?api-version=v1) 可供使用。


`DELETE` `https://generativelanguage.googleapis.com/v1beta/interactions/{id}`

依 ID 刪除互動。


  
## 參數 {#parameters}

  
  **api_version**: required `string`

  用於請求路由的 API 版本。

  

---


  **id**: required `string`

  要刪除的互動的唯一識別碼。

  

---


  **interactionsId**: required `string`

  要刪除的互動的名稱。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/interactions/$INTERACTION_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client()


      client.interactions.delete(id=created.id)
      print("Interaction deleted successfully.")
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({});


      await ai.interactions.delete(created.id);
      console.log('Interaction deleted successfully.');
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.Interaction;

      Client client = new Client();


      client.interactions.delete(interactionId);
      System.out.println("Interaction deleted successfully.");
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
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }


          req := operations.DeleteInteractionRequest{
              ID: interactionID,
          }

          _, err = client.Interactions.Delete(
              ctx,
              req,
          )
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println("Interaction deleted successfully.")
      }
      ```


  


## 回應 {#response}

空回應。
