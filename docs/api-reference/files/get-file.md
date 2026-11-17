# 取得檔案

`GET` `https://generativelanguage.googleapis.com/v1beta/files/{file}`

取得指定 [`File`](/api-reference/files/#Resource:File) 的後設資料。


  
## 參數 {#parameters}

  
  **file**：必填，`string`

  檔案 ID，構成資源名稱 `files/{file}`。

  

  

  
  **範例要求** 

  

=== "REST"

      ```sh
      name=$(jq ".file.name" file_info.json)
      # Get the file of interest to check state
      curl https://generativelanguage.googleapis.com/v1beta/files/$name > file_info.json
      # Print some information about the file you got
      name=$(jq ".file.name" file_info.json)
      echo name=$name
      file_uri=$(jq ".file.uri" file_info.json)
      echo file_uri=$file_uri
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client()
      myfile = client.files.upload(file=media / "poem.txt")
      file_name = myfile.name
      print(file_name)  # "files/*"

      myfile = client.files.get(name=file_name)
      print(myfile)
      ```

=== "JavaScript"

      ```javascript
      // Make sure to include the following import:
      // import {GoogleGenAI} from '@google/genai';
      const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
      const myfile = await ai.files.upload({
        file: path.join(media, 'poem.txt'),
      });
      const fileName = myfile.name;
      console.log(fileName);

      const fetchedFile = await ai.files.get({name: fileName});
      console.log(fetchedFile);
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
      fileName := myfile.Name
      fmt.Println(fileName)
      file, err := client.Files.Get(ctx, fileName, nil)
      if err != nil {
          log.Fatal(err)
      }
      fmt.Println(file)
      ```


  


## 回應 {#response}


  

??? note "**metadata**: `Union type` 檔案的後設資料。"

      `metadata` 聯合欄位只能是下列其中之一：



    ??? note "**videoMetadata**: `VideoFileMetadata` 僅供輸出。影片的後設資料。"

        **videoDuration**: `string`

        影片的長度。



  

---


  **name**: `string`

  不可變。識別碼。此為 [`File`](/api-reference/files/#Resource:File) 資源名稱。ID（即扣除 "files/" 前綴後的名稱）最多可包含 40 個字元，限小寫英數字元或連字號（-）。ID 不得以連字號開頭或結尾。若建立時名稱為空，系統將產生不重複的名稱。範例：`files/123-456`

  

---


  **displayName**: `string`

  選填。此為 [`File`](/api-reference/files/#Resource:File) 易讀的顯示名稱。顯示名稱長度不得超過 512 個字元（含空格）。範例："Welcome Image"

  

---


  **mimeType**: `string`

  僅供輸出。檔案的 MIME 類型。

  

---


  **sizeBytes**: `string`

  僅供輸出。檔案大小（以位元組為單位）。

  

---


  **createTime**: `string`

  僅供輸出。[`File`](/api-reference/files/#Resource:File) 的建立時間戳記。

  

---


  **updateTime**: `string`

  僅供輸出。[`File`](/api-reference/files/#Resource:File) 的最後更新時間戳記。

  

---


  **expirationTime**: `string`

  僅供輸出。[`File`](/api-reference/files/#Resource:File) 將被刪除的時間戳記。僅在 [`File`](/api-reference/files/#Resource:File) 已排定到期時才會設定。

  

---


  **sha256Hash**: `string`

  僅供輸出。所上傳位元組的 SHA-256 雜湊值。

  

---


  **uri**: `string`

  僅供輸出。[`File`](/api-reference/files/#Resource:File) 的 uri。

  

---


  **downloadUri**: `string`

  僅供輸出。[`File`](/api-reference/files/#Resource:File) 的下載 uri。

  

---


  

??? note "**state**: `string enum` 僅供輸出。檔案的處理狀態。"

    可能的值：

    - `STATE_UNSPECIFIED`：預設值。省略狀態時即使用此值。
    - `PROCESSING`：檔案正在處理中，尚無法用於推論。
    - `ACTIVE`：檔案已處理完成，可用於推論。
    - `FAILED`：檔案處理失敗。



  

---


  

??? note "**source**: `string enum` 檔案的來源。"

    可能的值：

    - `SOURCE_UNSPECIFIED`：未指定來源時使用。
    - `UPLOADED`：表示檔案由使用者上傳。
    - `GENERATED`：表示檔案由 Google 產生。
    - `REGISTERED`：表示檔案為已註冊的檔案，即 Google Cloud Storage 檔案。



  

---


  **error**: [`Status`](/api-reference/files/get-file/#Resource:Status)

  僅供輸出。檔案處理失敗時的錯誤狀態。


## 資料模型 {#data-models}

### Status {#Resource:Status}

[`Status`](/api-reference/files/get-file/#Resource:Status) 類型定義了一套邏輯錯誤模型，適用於不同的程式設計環境，包括 REST API 與 RPC API，並由 [gRPC](https://github.com/grpc) 採用。每個 [`Status`](/api-reference/files/get-file/#Resource:Status) 訊息包含三項資料：錯誤代碼、錯誤訊息與錯誤詳細資訊。

如需進一步瞭解此錯誤模型及其使用方式，請參閱
[API Design Guide](https://cloud.google.com/apis/design/errors)。

**Properties:**


  **code**: `integer`

  狀態碼，應為 google.rpc.Code 的列舉值。

  

---


  **message**: `string`

  供開發人員閱讀的錯誤訊息，應以英文撰寫。任何供使用者閱讀的錯誤訊息都應在地化，並透過 google.rpc.Status.details 欄位傳送，或由用戶端進行在地化。

  

---


  **details**: `object array`

  承載錯誤詳細資訊的訊息清單。API 可使用一組通用的訊息類型。

