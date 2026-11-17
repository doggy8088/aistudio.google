# 建立檔案

`POST` `https://generativelanguage.googleapis.com/v1beta/files`

建立 [`File`](/api-reference/files/create-file/#Resource:File)。


  
## 要求主體 {#request-body}

  
  **file**: [`File`](/api-reference/files/create-file/#Resource:File)

  選填。要建立之檔案的中繼資料。

  

  

  
  **範例要求** 

  

=== "圖片"


    === "REST"

          ```sh
          MIME_TYPE=$(file -b --mime-type "${IMG_PATH_2}")
          NUM_BYTES=$(wc -c < "${IMG_PATH_2}")
          DISPLAY_NAME=TEXT

          tmp_header_file=upload-header.tmp

          # Initial resumable request defining metadata.
          # The upload url is in the response headers dump them to a file.
          curl "${BASE_URL}/upload/v1beta/files?key=${GEMINI_API_KEY}" \
            -D upload-header.tmp \
            -H "X-Goog-Upload-Protocol: resumable" \
            -H "X-Goog-Upload-Command: start" \
            -H "X-Goog-Upload-Header-Content-Length: ${NUM_BYTES}" \
            -H "X-Goog-Upload-Header-Content-Type: ${MIME_TYPE}" \
            -H "Content-Type: application/json" \
            -d "{'file': {'display_name': '${DISPLAY_NAME}'}}" 2> /dev/null

          upload_url=$(grep -i "x-goog-upload-url: " "${tmp_header_file}" | cut -d" " -f2 | tr -d "\r")
          rm "${tmp_header_file}"

          # Upload the actual bytes.
          curl "${upload_url}" \
            -H "Content-Length: ${NUM_BYTES}" \
            -H "X-Goog-Upload-Offset: 0" \
            -H "X-Goog-Upload-Command: upload, finalize" \
            --data-binary "@${IMG_PATH_2}" 2> /dev/null > file_info.json

          file_uri=$(jq ".file.uri" file_info.json)
          echo file_uri=$file_uri

          # Now generate content using that file
          curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY" \
              -H 'Content-Type: application/json' \
              -X POST \
              -d '{
                "contents": [{
                  "parts":[
                    {"text": "Can you tell me about the instruments in this photo?"},
                    {"file_data":
                      {"mime_type": "image/jpeg",
                      "file_uri": '$file_uri'}
                  }]
                  }]
                 }' 2> /dev/null > response.json

          cat response.json
          echo

          jq ".candidates[].content.parts[].text" response.json
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          myfile = client.files.upload(file=media / "Cajun_instruments.jpg")
          print(f"{myfile=}")

          result = client.models.generate_content(
              model="gemini-3.8-flash",
              contents=[
                  myfile,
                  "\n\n",
                  "Can you tell me about the instruments in this photo?",
              ],
          )
          print(f"{result.text=}")
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
          const myfile = await ai.files.upload({
            file: path.join(media, 'Cajun_instruments.jpg'),
            config: {mimeType: 'image/jpeg'},
          });
          console.log('Uploaded file:', myfile);

          const result = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: createUserContent([
              createPartFromUri(myfile.uri, myfile.mimeType),
              '\n\n',
              'Can you tell me about the instruments in this photo?',
            ]),
          });
          console.log('result.text=', result.text);
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
              filepath.Join(getMedia(), "Cajun_instruments.jpg"),
              &genai.UploadFileConfig{
                  MIMEType: "image/jpeg",
              },
          )
          if err != nil {
              log.Fatal(err)
          }
          fmt.Printf("myfile=%+v\n", myfile)

          parts := []*genai.Part{
              genai.NewPartFromURI(myfile.URI, myfile.MIMEType),
              genai.NewPartFromText("\n\n"),
              genai.NewPartFromText("Can you tell me about the instruments in this photo?"),
          }

          contents := []*genai.Content{
              genai.NewContentFromParts(parts, genai.RoleUser),
          }

          response, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, nil)
          if err != nil {
              log.Fatal(err)
          }
          text := response.Text()
          fmt.Printf("result.text=%s\n", text)
          ```

=== "音訊"


    === "REST"

          ```sh
          MIME_TYPE=$(file -b --mime-type "${AUDIO_PATH}")
          NUM_BYTES=$(wc -c < "${AUDIO_PATH}")
          DISPLAY_NAME=AUDIO

          tmp_header_file=upload-header.tmp

          # Initial resumable request defining metadata.
          # The upload url is in the response headers dump them to a file.
          curl "${BASE_URL}/upload/v1beta/files?key=${GEMINI_API_KEY}" \
            -D upload-header.tmp \
            -H "X-Goog-Upload-Protocol: resumable" \
            -H "X-Goog-Upload-Command: start" \
            -H "X-Goog-Upload-Header-Content-Length: ${NUM_BYTES}" \
            -H "X-Goog-Upload-Header-Content-Type: ${MIME_TYPE}" \
            -H "Content-Type: application/json" \
            -d "{'file': {'display_name': '${DISPLAY_NAME}'}}" 2> /dev/null

          upload_url=$(grep -i "x-goog-upload-url: " "${tmp_header_file}" | cut -d" " -f2 | tr -d "\r")
          rm "${tmp_header_file}"

          # Upload the actual bytes.
          curl "${upload_url}" \
            -H "Content-Length: ${NUM_BYTES}" \
            -H "X-Goog-Upload-Offset: 0" \
            -H "X-Goog-Upload-Command: upload, finalize" \
            --data-binary "@${AUDIO_PATH}" 2> /dev/null > file_info.json

          file_uri=$(jq ".file.uri" file_info.json)
          echo file_uri=$file_uri

          # Now generate content using that file
          curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY" \
              -H 'Content-Type: application/json' \
              -X POST \
              -d '{
                "contents": [{
                  "parts":[
                    {"text": "Describe this audio clip"},
                    {"file_data":{"mime_type": "audio/mp3", "file_uri": '$file_uri'}}]
                  }]
                 }' 2> /dev/null > response.json

          cat response.json
          echo

          jq ".candidates[].content.parts[].text" response.json
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          myfile = client.files.upload(file=media / "sample.mp3")
          print(f"{myfile=}")

          result = client.models.generate_content(
              model="gemini-3.8-flash", contents=[myfile, "Describe this audio clip"]
          )
          print(f"{result.text=}")
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
          const myfile = await ai.files.upload({
            file: path.join(media, 'sample.mp3'),
            config: {mimeType: 'audio/mpeg'},
          });
          console.log('Uploaded file:', myfile);

          const result = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: createUserContent([
              createPartFromUri(myfile.uri, myfile.mimeType),
              'Describe this audio clip',
            ]),
          });
          console.log('result.text=', result.text);
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
              filepath.Join(getMedia(), "sample.mp3"),
              &genai.UploadFileConfig{
                  MIMEType: "audio/mpeg",
              },
          )
          if err != nil {
              log.Fatal(err)
          }
          fmt.Printf("myfile=%+v\n", myfile)

          parts := []*genai.Part{
              genai.NewPartFromURI(myfile.URI, myfile.MIMEType),
              genai.NewPartFromText("Describe this audio clip"),
          }

          contents := []*genai.Content{
              genai.NewContentFromParts(parts, genai.RoleUser),
          }

          response, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, nil)
          if err != nil {
              log.Fatal(err)
          }
          text := response.Text()
          fmt.Printf("result.text=%s\n", text)
          ```

=== "文字"


    === "REST"

          ```sh
          MIME_TYPE=$(file -b --mime-type "${TEXT_PATH}")
          NUM_BYTES=$(wc -c < "${TEXT_PATH}")
          DISPLAY_NAME=TEXT

          tmp_header_file=upload-header.tmp

          # Initial resumable request defining metadata.
          # The upload url is in the response headers dump them to a file.
          curl "${BASE_URL}/upload/v1beta/files?key=${GEMINI_API_KEY}" \
            -D upload-header.tmp \
            -H "X-Goog-Upload-Protocol: resumable" \
            -H "X-Goog-Upload-Command: start" \
            -H "X-Goog-Upload-Header-Content-Length: ${NUM_BYTES}" \
            -H "X-Goog-Upload-Header-Content-Type: ${MIME_TYPE}" \
            -H "Content-Type: application/json" \
            -d "{'file': {'display_name': '${DISPLAY_NAME}'}}" 2> /dev/null

          upload_url=$(grep -i "x-goog-upload-url: " "${tmp_header_file}" | cut -d" " -f2 | tr -d "\r")
          rm "${tmp_header_file}"

          # Upload the actual bytes.
          curl "${upload_url}" \
            -H "Content-Length: ${NUM_BYTES}" \
            -H "X-Goog-Upload-Offset: 0" \
            -H "X-Goog-Upload-Command: upload, finalize" \
            --data-binary "@${TEXT_PATH}" 2> /dev/null > file_info.json

          file_uri=$(jq ".file.uri" file_info.json)
          echo file_uri=$file_uri

          # Now generate content using that file
          curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY" \
              -H 'Content-Type: application/json' \
              -X POST \
              -d '{
                "contents": [{
                  "parts":[
                    {"text": "Can you add a few more lines to this poem?"},
                    {"file_data":{"mime_type": "text/plain", "file_uri": '$file_uri'}}]
                  }]
                 }' 2> /dev/null > response.json

          cat response.json
          echo

          jq ".candidates[].content.parts[].text" response.json

          name=$(jq ".file.name" file_info.json)
          # Get the file of interest to check state
          curl https://generativelanguage.googleapis.com/v1beta/files/$name > file_info.json
          # Print some information about the file you got
          name=$(jq ".file.name" file_info.json)
          echo name=$name
          file_uri=$(jq ".file.uri" file_info.json)
          echo file_uri=$file_uri

          curl --request "DELETE" https://generativelanguage.googleapis.com/v1beta/files/$name?key=$GEMINI_API_KEY
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          myfile = client.files.upload(file=media / "poem.txt")
          print(f"{myfile=}")

          result = client.models.generate_content(
              model="gemini-3.8-flash",
              contents=[myfile, "\n\n", "Can you add a few more lines to this poem?"],
          )
          print(f"{result.text=}")
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
          const myfile = await ai.files.upload({
            file: path.join(media, 'poem.txt'),
          });
          console.log('Uploaded file:', myfile);

          const result = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: createUserContent([
              createPartFromUri(myfile.uri, myfile.mimeType),
              '\n\n',
              'Can you add a few more lines to this poem?',
            ]),
          });
          console.log('result.text=', result.text);
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
          fmt.Printf("myfile=%+v\n", myfile)

          parts := []*genai.Part{
              genai.NewPartFromURI(myfile.URI, myfile.MIMEType),
              genai.NewPartFromText("\n\n"),
              genai.NewPartFromText("Can you add a few more lines to this poem?"),
          }

          contents := []*genai.Content{
              genai.NewContentFromParts(parts, genai.RoleUser),
          }

          response, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, nil)
          if err != nil {
              log.Fatal(err)
          }
          text := response.Text()
          fmt.Printf("result.text=%s\n", text)
          ```

=== "影片"


    === "REST"

          ```sh
          MIME_TYPE=$(file -b --mime-type "${VIDEO_PATH}")
          NUM_BYTES=$(wc -c < "${VIDEO_PATH}")
          DISPLAY_NAME=VIDEO_PATH

          # Initial resumable request defining metadata.
          # The upload url is in the response headers dump them to a file.
          curl "${BASE_URL}/upload/v1beta/files?key=${GEMINI_API_KEY}" \
            -D upload-header.tmp \
            -H "X-Goog-Upload-Protocol: resumable" \
            -H "X-Goog-Upload-Command: start" \
            -H "X-Goog-Upload-Header-Content-Length: ${NUM_BYTES}" \
            -H "X-Goog-Upload-Header-Content-Type: ${MIME_TYPE}" \
            -H "Content-Type: application/json" \
            -d "{'file': {'display_name': '${DISPLAY_NAME}'}}" 2> /dev/null

          upload_url=$(grep -i "x-goog-upload-url: " "${tmp_header_file}" | cut -d" " -f2 | tr -d "\r")
          rm "${tmp_header_file}"

          # Upload the actual bytes.
          curl "${upload_url}" \
            -H "Content-Length: ${NUM_BYTES}" \
            -H "X-Goog-Upload-Offset: 0" \
            -H "X-Goog-Upload-Command: upload, finalize" \
            --data-binary "@${VIDEO_PATH}" 2> /dev/null > file_info.json

          file_uri=$(jq ".file.uri" file_info.json)
          echo file_uri=$file_uri

          state=$(jq ".file.state" file_info.json)
          echo state=$state

          # Ensure the state of the video is 'ACTIVE'
          while [[ "($state)" = *"PROCESSING"* ]];
          do
            echo "Processing video..."
            sleep 5
            # Get the file of interest to check state
            curl https://generativelanguage.googleapis.com/v1beta/files/$name > file_info.json
            state=$(jq ".file.state" file_info.json)
          done

          # Now generate content using that file
          curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY" \
              -H 'Content-Type: application/json' \
              -X POST \
              -d '{
                "contents": [{
                  "parts":[
                    {"text": "Describe this video clip"},
                    {"file_data":{"mime_type": "video/mp4", "file_uri": '$file_uri'}}]
                  }]
                 }' 2> /dev/null > response.json

          cat response.json
          echo

          jq ".candidates[].content.parts[].text" response.json
          ```

    === "Python"

          ```python
          from google import genai
          import time

          client = genai.Client()
          # Video clip (CC BY 3.0) from https://peach.blender.org/download/
          myfile = client.files.upload(file=media / "Big_Buck_Bunny.mp4")
          print(f"{myfile=}")

          # Poll until the video file is completely processed (state becomes ACTIVE).
          while not myfile.state or myfile.state.name != "ACTIVE":
            print("Processing video...")
            print("File state:", myfile.state)
            time.sleep(5)
            myfile = client.files.get(name=myfile.name)

          result = client.models.generate_content(
              model="gemini-3.8-flash", contents=[myfile, "Describe this video clip"]
          )
          print(f"{result.text=}")
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
          let myfile = await ai.files.upload({
            file: path.join(media, 'Big_Buck_Bunny.mp4'),
            config: {mimeType: 'video/mp4'},
          });
          console.log('Uploaded video file:', myfile);

          // Poll until the video file is completely processed (state becomes ACTIVE).
          while (!myfile.state || myfile.state.toString() !== 'ACTIVE') {
            console.log('Processing video...');
            console.log('File state: ', myfile.state);
            await sleep(5000);
            myfile = await ai.files.get({name: myfile.name});
          }

          const result = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: createUserContent([
              createPartFromUri(myfile.uri, myfile.mimeType),
              'Describe this video clip',
            ]),
          });
          console.log('result.text=', result.text);
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
              filepath.Join(getMedia(), "Big_Buck_Bunny.mp4"),
              &genai.UploadFileConfig{
                  MIMEType: "video/mp4",
              },
          )
          if err != nil {
              log.Fatal(err)
          }
          fmt.Printf("myfile=%+v\n", myfile)

          // Poll until the video file is completely processed (state becomes ACTIVE).
          for myfile.State == genai.FileStateUnspecified || myfile.State != genai.FileStateActive {
              fmt.Println("Processing video...")
              fmt.Println("File state:", myfile.State)
              time.Sleep(5 * time.Second)

              myfile, err = client.Files.Get(ctx, myfile.Name, nil)
              if err != nil {
                  log.Fatal(err)
              }
          }

          parts := []*genai.Part{
              genai.NewPartFromURI(myfile.URI, myfile.MIMEType),
              genai.NewPartFromText("Describe this video clip"),
          }

          contents := []*genai.Content{
              genai.NewContentFromParts(parts, genai.RoleUser),
          }

          response, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, nil)
          if err != nil {
              log.Fatal(err)
          }
          text := response.Text()
          fmt.Printf("result.text=%s\n", text)
          ```

=== "PDF"


    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          sample_pdf = client.files.upload(file=media / "test.pdf")
          response = client.models.generate_content(
              model="gemini-3.8-flash",
              contents=["Give me a summary of this pdf file.", sample_pdf],
          )
          print(response.text)
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
          samplePdf, err := client.Files.UploadFromPath(
              ctx,
              filepath.Join(getMedia(), "test.pdf"),
              &genai.UploadFileConfig{
                  MIMEType: "application/pdf",
              },
          )
          if err != nil {
              log.Fatal(err)
          }

          parts := []*genai.Part{
              genai.NewPartFromText("Give me a summary of this pdf file."),
              genai.NewPartFromURI(samplePdf.URI, samplePdf.MIMEType),
          }

          contents := []*genai.Content{
              genai.NewContentFromParts(parts, genai.RoleUser),
          }

          response, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, nil)
          if err != nil {
              log.Fatal(err)
          }
          text := response.Text()
          fmt.Println(text)
          ```


  


## 回應 {#response}


  **file**: [`File`](/api-reference/files/create-file/#Resource:File)

  所建立檔案的中繼資料。


## 資源 {#resources}

### File {#Resource:File}

上傳至 API 的檔案。

**屬性**：


  

??? note "**metadata**: `Union type` File 的中繼資料。"

      聯合欄位 `metadata` 只能是下列其中之一：



    ??? note "**videoMetadata**: `VideoFileMetadata` 僅供輸出。影片的中繼資料。"

        **videoDuration**: `string`

        影片的長度。



  

---


  **name**: `string`

  不可變動。識別碼。[`File`](/api-reference/files/create-file/#Resource:File) 的資源名稱。ID（名稱不含 "files/" 前置字串）最多可包含 40 個字元，限小寫英數字元或連字號 (-)。ID 不得以連字號開頭或結尾。若建立時名稱為空，將產生唯一名稱。範例：`files/123-456`

  

---


  **displayName**: `string`

  選填。[`File`](/api-reference/files/create-file/#Resource:File) 的人類可讀顯示名稱。顯示名稱的長度不得超過 512 個字元（含空格）。範例："Welcome Image"

  

---


  **mimeType**: `string`

  僅供輸出。檔案的 MIME 類型。

  

---


  **sizeBytes**: `string`

  僅供輸出。檔案大小（以位元組計）。

  

---


  **createTime**: `string`

  僅供輸出。[`File`](/api-reference/files/create-file/#Resource:File) 建立時間的時間戳記。

  

---


  **updateTime**: `string`

  僅供輸出。[`File`](/api-reference/files/create-file/#Resource:File) 上次更新的時間戳記。

  

---


  **expirationTime**: `string`

  僅供輸出。[`File`](/api-reference/files/create-file/#Resource:File) 將被刪除的時間戳記。僅在 [`File`](/api-reference/files/create-file/#Resource:File) 已排定到期時才會設定。

  

---


  **sha256Hash**: `string`

  僅供輸出。所上傳位元組的 SHA-256 雜湊。

  

---


  **uri**: `string`

  僅供輸出。[`File`](/api-reference/files/create-file/#Resource:File) 的 uri。

  

---


  **downloadUri**: `string`

  僅供輸出。[`File`](/api-reference/files/create-file/#Resource:File) 的下載 uri。

  

---


  

??? note "**state**: `string enum` 僅供輸出。File 的處理狀態。"

    可能的值：

    - `STATE_UNSPECIFIED`：預設值。省略狀態時使用此值。
    - `PROCESSING`：檔案正在處理中，尚無法用於推論。
    - `ACTIVE`：檔案已處理完成，可用於推論。
    - `FAILED`：檔案處理失敗。



  

---


  

??? note "**source**: `string enum` File 的來源。"

    可能的值：

    - `SOURCE_UNSPECIFIED`：未指定來源時使用。
    - `UPLOADED`：表示檔案由使用者上傳。
    - `GENERATED`：表示檔案由 Google 產生。
    - `REGISTERED`：表示檔案為已註冊的檔案，即 Google Cloud Storage 檔案。



  

---


  **error**: [`Status`](/api-reference/files/create-file/#Resource:Status)

  僅供輸出。File 處理失敗時的錯誤狀態。


## 資料模型 {#data-models}

### Status {#Resource:Status}

[`Status`](/api-reference/files/create-file/#Resource:Status) 類型定義了一種邏輯錯誤模型，適用於各種程式設計環境，包括 REST API 與 RPC API。此模型由 [gRPC](https://github.com/grpc) 使用。每個 [`Status`](/api-reference/files/create-file/#Resource:Status) 訊息包含三項資料：錯誤碼、錯誤訊息與錯誤詳細資訊。

如需進一步瞭解此錯誤模型以及如何使用，請參閱
[API Design Guide](https://cloud.google.com/apis/design/errors)。

**屬性**：


  **code**: `integer`

  狀態碼，應為 google.rpc.Code 的列舉值。

  

---


  **message**: `string`

  供開發人員參考的錯誤訊息，應以英文撰寫。任何要給使用者看的錯誤訊息都應本地化，並放在 google.rpc.Status.details 欄位中傳送，或由用戶端本地化。

  

---


  **details**: `object array`

  承載錯誤詳細資訊的訊息清單。API 有一組通用的訊息類型可供使用。

