# 刪除快取內容

`DELETE` `https://generativelanguage.googleapis.com/v1beta/cachedContents/{id}`

刪除 CachedContent 資源。


  
## 參數 {#parameters}

  
  **id**: required `string`

  快取內容的 ID，會組成資源名稱 `cachedContents/{id}`。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/$CACHE_NAME?key=$GEMINI_API_KEY"
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})
      document = client.files.upload(file=media / "a11.txt")
      model_name = "gemini-3.8-flash"

      cache = client.caches.create(
          model=model_name,
          config={
              "contents": [document],
              "system_instruction": "You are an expert analyzing transcripts.",
          },
      )
      client.caches.delete(name=cache.name)
      ```

=== "JavaScript"

      ```javascript
      // Make sure to include the following import:
      // import {GoogleGenAI} from '@google/genai';
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        apiVersion: 'v1beta',
      });
      const filePath = path.join(media, 'a11.txt');
      const document = await ai.files.upload({
        file: filePath,
        config: {mimeType: 'text/plain'},
      });
      console.log('Uploaded file name:', document.name);
      const modelName = 'gemini-3.8-flash';

      const contents = [
        createUserContent(createPartFromUri(document.uri, document.mimeType)),
      ];

      const cache = await ai.caches.create({
        model: modelName,
        config: {
          contents: contents,
          systemInstruction: 'You are an expert analyzing transcripts.',
        },
      });
      await ai.caches.delete({name: cache.name});
      console.log('Cache deleted:', cache.name);
      ```

=== "Go"

      ```go
      ctx := context.Background()
      client, err := genai.NewClient(ctx, &genai.ClientConfig{
          APIKey:      os.Getenv("GEMINI_API_KEY"),
          Backend:     genai.BackendGeminiAPI,
          HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
      })
      if err != nil {
          log.Fatal(err)
      }

      modelName := "gemini-3.8-flash"
      document, err := client.Files.UploadFromPath(
          ctx,
          filepath.Join(getMedia(), "a11.txt"),
          &genai.UploadFileConfig{
              MIMEType: "text/plain",
          },
      )
      if err != nil {
          log.Fatal(err)
      }
      parts := []*genai.Part{
          genai.NewPartFromURI(document.URI, document.MIMEType),
      }
      contents := []*genai.Content{
          genai.NewContentFromParts(parts, genai.RoleUser),
      }

      cache, err := client.Caches.Create(ctx, modelName, &genai.CreateCachedContentConfig{
          Contents: contents,
          SystemInstruction: genai.NewContentFromText(
              "You are an expert analyzing transcripts.", genai.RoleUser,
          ),
      })
      if err != nil {
          log.Fatal(err)
      }

      _, err = client.Caches.Delete(ctx, cache.Name, &genai.DeleteCachedContentConfig{})
      if err != nil {
          log.Fatal(err)
      }
      fmt.Println("Cache deleted:", cache.Name)
      ```


  


## 回應 {#response}


