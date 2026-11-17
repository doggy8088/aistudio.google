# 取得快取內容

`GET` `https://generativelanguage.googleapis.com/v1beta/cachedContents/{id}`

讀取 CachedContent 資源。


  
## 參數 {#parameters}

  
  **id**: required `string`

  快取內容的 ID，會組成資源名稱 `cachedContents/{id}`。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl "https://generativelanguage.googleapis.com/v1beta/$CACHE_NAME?key=$GEMINI_API_KEY"
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
      print(client.caches.get(name=cache.name))
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
      const retrievedCache = await ai.caches.get({name: cache.name});
      console.log('Retrieved Cache:', retrievedCache);
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

      cache, err = client.Caches.Get(ctx, cache.Name, &genai.GetCachedContentConfig{})
      if err != nil {
          log.Fatal(err)
      }
      fmt.Println("Retrieved cache:")
      fmt.Println(cache)
      ```


  


## 回應 {#response}


  **model**: required `string`

  不可變更。快取內容要使用的 `Model` 名稱。格式：`models/{model}`

  

---


  

<details>
<summary>**expiration**：`Union type`，指定此資源何時到期。</summary>

  

  聯集欄位 `expiration` 只能是下列其中一項：

  **expireTime**: `string`

  以 UTC 表示的時間戳，代表此資源被視為到期的時間。此欄位在輸出時*一律*會提供，無論輸入時送了什麼。

  

</details>


  

---


  **name**: `string`

  僅供輸出。識別碼。指向快取內容的資源名稱。格式：`cachedContents/{id}`

  

---


  **displayName**: `string`

  選填。不可變更。由使用者產生、具意義的快取內容顯示名稱。最多 128 個 Unicode 字元。

  

---


  **createTime**: `string`

  僅供輸出。快取項目的建立時間。

  

---


  **updateTime**: `string`

  僅供輸出。快取項目上次更新的 UTC 時間。

  

---


  

<details>
<summary>**usageMetadata**：`CachedContentUsageMetadata`，僅供輸出。快取內容使用情形的中繼資料。</summary>

  

  **totalTokenCount**: `integer`

  快取內容所消耗的權杖總數。

  

</details>


