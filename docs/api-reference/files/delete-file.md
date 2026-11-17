# 刪除檔案

`DELETE` `https://generativelanguage.googleapis.com/v1beta/files/{file}`

刪除 [`File`](/api-reference/files/#Resource:File)。


  
## 參數 {#parameters}

  
  **file**：必填，`string`

  檔案 ID，構成資源名稱 `files/{file}`。

  

  

  
  **範例要求** 

  

=== "REST"

      ```sh
      curl --request "DELETE" https://generativelanguage.googleapis.com/v1beta/files/$name?key=$GEMINI_API_KEY
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client()
      myfile = client.files.upload(file=media / "poem.txt")

      client.files.delete(name=myfile.name)

      try:
        result = client.models.generate_content(
            model="gemini-3.8-flash", contents=[myfile, "Describe this file."]
        )
        print(result)
      except genai.errors.ClientError:
        pass
      ```

=== "Go"

      ```go
      ctx := context.Background()
      client, err := genai.NewClient(ctx, &genai.ClientConfig{
          APIKey:  os.Getenv("GEMINI_API_KEY"),
          Backend: genai.BackendGeminiAPI,
      })
      if err != nil {
          log.Fatal(err)
      }
      myfile, err := client.Files.UploadFromPath(
          ctx,
          filepath.Join(getMedia(), "poem.txt"),
          &genai.UploadFileConfig{
              MIMEType: "text/plain",
          },
      )
      if err != nil {
          log.Fatal(err)
      }
      // Delete the file.
      _, err = client.Files.Delete(ctx, myfile.Name, nil)
      if err != nil {
          log.Fatal(err)
      }
      // Attempt to use the deleted file.
      parts := []*genai.Part{
          genai.NewPartFromURI(myfile.URI, myfile.MIMEType),
          genai.NewPartFromText("Describe this file."),
      }

      contents := []*genai.Content{
          genai.NewContentFromParts(parts, genai.RoleUser),
      }

      _, err = client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, nil)
      // Expect an error when using a deleted file.
      if err != nil {
          return nil
      }
      return fmt.Errorf("expected an error when using deleted file")
      ```


  


## 回應 {#response}


