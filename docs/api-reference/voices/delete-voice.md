# 刪除語音


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 之下。


`DELETE` `https://generativelanguage.googleapis.com/v1beta/voices/{voicesId}`

依資源名稱刪除自訂的已儲存語音（`store = true`）。
預建目錄語音（`VOICE_TYPE_PREBUILT`）無法刪除。


  
## 參數 {#parameters}

  
  **voicesId**: required `string`

  要刪除的自訂已儲存語音的資源名稱（例如 `voices/voice_abc123def456`）。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl -X DELETE https://generativelanguage.googleapis.com/v1beta/voices/voice_abc123 \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})
      client.voices.delete(id="voice_abc123")
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({apiVersion: 'v1beta'});
      await ai.voices.delete('voice_abc123');
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
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

          _, err = client.Voices.Delete(ctx, operations.DeleteVoiceRequest{
              ID: "voice_abc123",
          })
          if err != nil {
              log.Fatal(err)
          }
      }
      ```


  


## 回應 {#response}



