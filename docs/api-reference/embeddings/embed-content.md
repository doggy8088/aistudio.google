# 嵌入內容

`POST` `https://generativelanguage.googleapis.com/v1beta/models/{model}:embedContent`

從輸入的 `Content` 產生文字嵌入向量，
使用指定的 [Gemini Embedding
模型](/docs/models/#specialized-task-models)。


  
## 參數 {#parameters}

  
  **model**：required `string`

  模型 ID，例如 `gemini-2.5-flash`。構成資源名稱 `models/{model}`。

  

## 請求主體 {#request-body}

  
  **model**：required `string`

  模型的資源名稱，作為模型要使用的 ID。此名稱應與 `ListModels` 方法傳回的模型名稱相符。格式：`models/{model}`

  

---


  

<details>
<summary>**content**：required `Content` 要嵌入的內容。僅計算 `parts.text` 欄位。</summary>

  

  

<details>
<summary>**parts**：`Part array` 組成單一訊息的 `Parts`，依順序排列。各 Part 的 MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type`</summary>

  

  Union 欄位 `data` 僅能是以下其中之一：

  **text**：`string`

  行內文字。

  

<details>
<summary>**inlineData**：`Blob` 行內媒體位元組。</summary>

  

  **mimeType**：`string`

  來源資料的 IANA 標準 MIME 類型。支援的類型範例：

  - 圖片：image/png、image/jpeg、image/jpg、image/webp、image/heic、image/heif、image/gif、image/avif
  - 音訊：audio/*、video/audio/s16le、video/audio/wav
  - 影片：video/*
  - 文字：text/plain、text/html、text/css、text/javascript、text/x-typescript、text/csv、text/markdown、text/x-python、text/xml、text/rtf、video/text/timestamp
  - 應用程式：application/x-javascript、application/x-typescript、application/x-python-code、application/json、application/x-ipynb+json、application/rtf、application/pdf 其他背景資訊請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

  **data**：`string`

  媒體格式的原始位元組。

  **displayName**：`string`

  選填。指定用來向模型指稱這個 blob 的名稱（例如「my_blob.png」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 的參照識別碼。

  

</details>


  

<details>
<summary>**functionCall**：`FunctionCall` 模型傳回的預測 `FunctionCall`，包含代表 `FunctionDeclaration.name` 的字串，以及參數和其值。</summary>

  

  **name**：required `string`

  要呼叫的函式名稱。只能是 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

  **id**：`string`

  選填。函式呼叫的唯一識別碼。若有填寫，用戶端應執行該 `function_call` 並傳回 `id` 相符的回應。

  **args**：`object`

  選填。JSON 物件格式的函式參數與值。

  

</details>


  

<details>
<summary>**functionResponse**：`FunctionResponse` `FunctionCall` 的結果輸出，包含代表 `FunctionDeclaration.name` 的字串，以及包含函式任何輸出的結構化 JSON 物件，用作模型的上下文。</summary>

  

  **name**：required `string`

  要呼叫的函式名稱。只能是 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

  **response**：required `object`

  JSON 物件格式的函式回應。呼叫端可使用任何符合函式語法的自選鍵來傳回函式輸出，例如「output」、「result」等。特別是當函式呼叫執行失敗時，回應可包含「error」鍵，將錯誤詳細資訊傳回給模型。多媒體內容可透過包含單一「$ref」鍵的子物件加入，其值為 `inline_data.display_name` 或 `file_data.display_name`，屬於持有該多媒體的 `FunctionResponsePart`。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

  **id**：`string`

  選填。此回應所屬函式呼叫的識別碼。由用戶端填寫，以對應相對的函式呼叫 `id`。

  

<details>
<summary>**parts**：`FunctionResponsePart array` 選填。組成函式回應的 `Parts`，依順序排列。各 Part 的 IANA MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type` 函式回應部分的資料。</summary>

  

  Union 欄位 `data` 僅能是以下其中之一：

  

<details>
<summary>**inlineData**：`FunctionResponseBlob` 行內媒體位元組。</summary>

  

  **mimeType**：`string`

  來源資料的 IANA 標準 MIME 類型。範例：

  - image/png
  - image/jpeg

  若提供不支援的 MIME 類型，將傳回錯誤。完整支援類型清單請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

  **data**：`string`

  媒體格式的原始位元組。

  **displayName**：`string`

  選填。blob 的顯示名稱。用來提供標籤或檔案名稱以區分各 blob，並從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。

  

</details>


  

<details>
<summary>**fileData**：`FunctionResponseFileData` 以 URI 為基礎的資料。</summary>

  

  **fileUri**：required `string`

  URI。

  **mimeType**：`string`

  來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將傳回錯誤。完整支援類型清單請參閱[多模態函式回應](/docs/function-calling/#multimodal)與[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

  **displayName**：`string`

  選填。檔案的顯示名稱。用來提供標籤或檔案名稱以區分檔案資料，並從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。

  

</details>


  

</details>


  

<details>
<summary>**mediaProcessing**：`string enum` 選填。模型如何處理這個 Part 的媒體以進行理解。僅對影片 Part（`inline_data` 或 MIME 類型為影片的 `file_data`）有意義。非影片 Part 會忽略此欄位。</summary>

  

  可能的值：

  - `MEDIA_PROCESSING_UNSPECIFIED`：預設採用模型專屬的處理方式。
  - `STATIC`：以固定速率擷取影格。所有影格都放入上下文。
  - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。

  

</details>


  

</details>


  **willContinue**：`boolean`

  選填。表示函式呼叫會繼續，將傳回更多回應，從而把函式呼叫變成產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，將不再考量後續回應。允許傳回空的 `response` 並將 `will_continue=False`，以表示函式呼叫已結束。這仍可能觸發模型產生內容。若要避免觸發產生並結束函式呼叫，還需將 `scheduling` 設為 `SILENT`。

  

<details>
<summary>**scheduling**：`string enum` 選填。指定回應在對話中應如何排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。</summary>

  

  可能的值：

  - `SCHEDULING_UNSPECIFIED`：此值未使用。
  - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發產生。
  - `WHEN_IDLE`：將結果加入對話上下文，並提示產生輸出，不中斷進行中的產生。
  - `INTERRUPT`：將結果加入對話上下文，中斷進行中的產生並提示產生輸出。

  

</details>


  

</details>


  

<details>
<summary>**fileData**：`FileData` 以 URI 為基礎的資料。</summary>

  

  **fileUri**：required `string`

  URI。

  **mimeType**：`string`

  選填。來源資料的 IANA 標準 MIME 類型。

  **displayName**：`string`

  選填。指定用來向模型指稱這個檔案的名稱（例如「my_file.pdf」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案的參照識別碼。

  

</details>


  

<details>
<summary>**executableCode**：`ExecutableCode` 模型產生的程式碼，預期要被執行。</summary>

  

  

<details>
<summary>**language**：required `string enum` `code` 的程式語言。</summary>

  

  可能的值：

  - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用此值。
  - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 是預設語言。

  

</details>


  **code**：required `string`

  要執行的程式碼。

  **id**：`string`

  選填。`ExecutableCode` Part 的唯一識別碼。伺服器會傳回 `CodeExecutionResult`，其 `id` 與之相符。

  

</details>


  

<details>
<summary>**codeExecutionResult**：`CodeExecutionResult` 執行 `ExecutableCode` 的結果。</summary>

  

  

<details>
<summary>**outcome**：required `string enum` 程式碼執行的結果。</summary>

  

  可能的值：

  - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用此值。
  - `OUTCOME_OK`：程式碼執行成功完成。`output` 包含 stdout（若有）。
  - `OUTCOME_FAILED`：程式碼執行失敗。`output` 包含 stderr 與 stdout（若有）。
  - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已被取消。可能有、也可能沒有部分的 `output`。

  

</details>


  **id**：`string`

  選填。此結果所屬 `ExecutableCode` Part 的識別碼。僅在對應的 `ExecutableCode` 有 id 時才會填寫。

  **output**：`string`

  選填。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。

  

</details>


  

<details>
<summary>**toolCall**：`ToolCall` 伺服器端工具呼叫。當模型預測到應在伺服器上執行的工具叫用時，會填寫此欄位。用戶端應將此訊息原樣回傳給 API。</summary>

  

  

<details>
<summary>**toolType**：required `V1mainToolType` 被呼叫的工具類型。</summary>

  

  可能的值：

  - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
  - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
  - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
  - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
  - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
  - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
  - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應多模態理解所使用的隱形工具，例如 GOOGLE_UNDERSTANDING_VIDEO。

  

</details>


  **id**：`string`

  選填。工具呼叫的唯一識別碼。伺服器會傳回 `id` 相符的工具回應。

  **toolName**：`string`

  選填。被呼叫的工具名稱。

  **args**：`object`

  選填。工具呼叫的參數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}

  

</details>


  

<details>
<summary>**toolResponse**：`ToolResponse` 伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端以執行對應 `ToolCall` 的結果填寫。</summary>

  

  

<details>
<summary>**toolType**：required `V1mainToolType` 被呼叫的工具類型，與對應的 `tool_type`（位於相對的 `ToolCall` 中）相符。</summary>

  

  可能的值：

  - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
  - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
  - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
  - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
  - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
  - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
  - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應多模態理解所使用的隱形工具，例如 GOOGLE_UNDERSTANDING_VIDEO。

  

</details>


  **id**：`string`

  選填。此回應所屬工具呼叫的識別碼。

  **response**：`object`

  選填。工具回應。

  

</details>


  

</details>


  

<details>
<summary>**metadata**：`Union type` 控制資料的額外前置處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個 Part 的靜態媒體前置處理。</summary>

  

  Union 欄位 `metadata` 僅能是以下其中之一：

  

<details>
<summary>**videoMetadata**：`VideoMetadata` 選填。影片中繼資料。中繼資料僅應在影片資料以 inline_data 或 file_data 呈現時指定。</summary>

  

  **startOffset**：`string`

  選填。影片的開始偏移。

  **endOffset**：`string`

  選填。影片的結束偏移。

  **fps**：`number`

  選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。

  

</details>


  

</details>


  **thought**：`boolean`

  選填。表示這個 Part 是否為模型的思考內容。

  **thoughtSignature**：`string`

  選填。思考內容的不透明簽章，可在後續請求中重複使用。

  **partMetadata**：`object`

  與 Part 關聯的自訂中繼資料。使用 genai.Part 作為內容表示法的代理，可能需要追蹤額外資訊。例如可以是 Part 來源檔案／來源的名稱，或多工處理多個 Part 串流的方式。

  

<details>
<summary>**mediaResolution**：`V1mainMediaResolution` 選填。輸入媒體的媒體解析度。</summary>

  

  

<details>
<summary>**value**：`Union type` 媒體解析度等級。</summary>

  

  Union 欄位 `value` 僅能是以下其中之一：

  

<details>
<summary>**level**：`string enum` 用於指定媒體的權杖化品質。適用於 Gemini API 支援。</summary>

  

  可能的值：

  - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
  - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低。
  - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中。
  - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高。
  - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設為超高。

  

</details>


  

</details>


  

</details>


  

<details>
<summary>**mediaProcessing**：`string enum` 選填。模型如何處理這個 Part 的媒體以進行理解。僅對影片 Part（`inline_data` 或 MIME 類型為影片的 `file_data`）有意義。非影片 Part 會忽略此欄位。</summary>

  

  可能的值：

  - `MEDIA_PROCESSING_UNSPECIFIED`：預設採用模型專屬的處理方式。
  - `STATIC`：以固定速率擷取影格。所有影格都放入上下文。
  - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。

  

</details>


  

<details>
<summary>**audioTranscription**：`AudioTranscription` 選填。音訊（輸入或輸出）轉錄。僅當這個 Part 包含音訊資料時才會設定。</summary>

  

  **text**：required `string`

  這段音訊片段的轉錄文字。

  **speakerLabel**：`string`

  選填。識別這段音訊片段說話者的標籤（例如「spk_1」、「spk_2」）。設定語者分離（diarization）時才會出現。

  

<details>
<summary>**words**：`WordInfo array` 選填。詳細的逐字轉錄與時間資訊。設定 word_timestamp 時才會出現。</summary>

  

  **word**：required `string`

  單字的轉錄。

  **startOffset**：`string`

  選填。單字相對於音訊開頭的開始時間偏移。

  **endOffset**：`string`

  選填。單字相對於音訊開頭的結束時間偏移。

  

</details>


  

</details>


  

<details>
<summary>**speechMetadata**：`SpeechMetadata` 選填。套用於文字 Part 的中繼資料，用來自訂文字應如何朗讀或合成，例如指定說話者身分或說話風格。</summary>

  

  **speaker**：`string`

  選填。多說話者合成時使用的選填說話者名稱。

  **style**：`string`

  選填。語音合成的選填風格指令。

  

</details>


  

</details>


  **role**：`string`

  選填。內容的產生者。必須是「user」或「model」。適用於多輪對話的設定，其他情況可留空或不設定。

  

</details>


  

---


  **embedContentConfig**：[`EmbedContentConfig`](/api-reference/embeddings/embed-content/#Resource:EmbedContentConfig)

  選填。EmbedContent 請求的設定。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent" \
      -H "x-goog-api-key: $GEMINI_API_KEY" \
      -H 'Content-Type: application/json' \
      -d '{"model": "models/gemini-embedding-001",
           "content": {
           "parts":[{
           "text": "What is the meaning of life?"}]}
          }'
      ```

=== "Python"

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client()
      text = "Hello World!"
      result = client.models.embed_content(
          model="gemini-embedding-001",
          contents=text,
          config=types.EmbedContentConfig(output_dimensionality=10),
      )
      print(result.embeddings)
      ```

=== "JavaScript"

      ```javascript
      // Make sure to include the following import:
      // import {GoogleGenAI} from '@google/genai';
      const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
      const text = 'Hello World!';
      const result = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text,
        config: {outputDimensionality: 10},
      });
      console.log(result.embeddings);
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

      text := "Hello World!"
      outputDim := int32(10)
      contents := []*genai.Content{
          genai.NewContentFromText(text, genai.RoleUser),
      }
      result, err := client.Models.EmbedContent(ctx, "gemini-embedding-001",
          contents, &genai.EmbedContentConfig{
              OutputDimensionality: &outputDim,
          })
      if err != nil {
          log.Fatal(err)
      }

      embeddings, err := json.MarshalIndent(result.Embeddings, "", "  ")
      if err != nil {
          log.Fatal(err)
      }
      fmt.Println(string(embeddings))
      ```


  


## 回應 {#response}


  **embedding**：[`ContentEmbedding`](/api-reference/embeddings/embed-content/#Resource:ContentEmbedding)

  僅供輸出。由輸入內容產生的嵌入向量。

  

---


  **usageMetadata**：[`EmbeddingUsageMetadata`](/api-reference/embeddings/embed-content/#Resource:EmbeddingUsageMetadata)

  僅供輸出。請求的使用中繼資料。


## 資料模型 {#data-models}

### ContentEmbedding {#Resource:ContentEmbedding}

一組浮點數，代表一個嵌入向量。

**屬性：**


  **values**：`number array`

  嵌入值。此欄位僅供 3P 使用者使用，1P 呼叫不會填寫。

  

---


  **shape**：`integer array`

  此欄位儲存軟權杖張量的影格形狀（例如 [1, 1, 256, 2048]）。


### TaskType {#Resource:TaskType}

**可能的值：**

- `TASK_TYPE_UNSPECIFIED`：未設定的值，將預設為其他列舉值之一。
- `RETRIEVAL_QUERY`：指定提供的文字是搜尋／檢索情境中的查詢。
- `RETRIEVAL_DOCUMENT`：指定提供的文字是被搜尋語料庫中的文件。
- `SEMANTIC_SIMILARITY`：指定提供的文字將用於 STS。
- `CLASSIFICATION`：指定提供的文字將進行分類。
- `CLUSTERING`：指定嵌入向量將用於分群。
- `QUESTION_ANSWERING`：指定提供的文字將用於問答。
- `FACT_VERIFICATION`：指定提供的文字將用於事實查核。
- `CODE_RETRIEVAL_QUERY`：指定提供的文字將用於程式碼檢索。

### EmbedContentConfig {#Resource:EmbedContentConfig}

EmbedContent 請求的設定。

**屬性：**


  **title**：`string`

  選填。文字的標題。

  

---


  

<details>
<summary>**taskType**：[`TaskType`](/api-reference/embeddings/embed-content/#Resource:TaskType) 選填。嵌入的任務類型。</summary>

  

  可能的值：

  - `TASK_TYPE_UNSPECIFIED`：未設定的值，將預設為其他列舉值之一。
  - `RETRIEVAL_QUERY`：指定提供的文字是搜尋／檢索情境中的查詢。
  - `RETRIEVAL_DOCUMENT`：指定提供的文字是被搜尋語料庫中的文件。
  - `SEMANTIC_SIMILARITY`：指定提供的文字將用於 STS。
  - `CLASSIFICATION`：指定提供的文字將進行分類。
  - `CLUSTERING`：指定嵌入向量將用於分群。
  - `QUESTION_ANSWERING`：指定提供的文字將用於問答。
  - `FACT_VERIFICATION`：指定提供的文字將用於事實查核。
  - `CODE_RETRIEVAL_QUERY`：指定提供的文字將用於程式碼檢索。

  

</details>


  

---


  **autoTruncate**：`boolean`

  選填。輸入內容長於最大序列長度時，是否靜默截斷。

  

---


  **outputDimensionality**：`integer`

  選填。輸出嵌入向量的縮減維度。若有設定，輸出嵌入向量中多餘的值會從末端截斷。

  

---


  **documentOcr**：`boolean`

  選填。是否為文件內容啟用 OCR。

  

---


  **audioTrackExtraction**：`boolean`

  選填。是否從影片內容擷取音訊。


### EmbeddingUsageMetadata {#Resource:EmbeddingUsageMetadata}

嵌入請求的使用中繼資料。

**屬性：**


  **promptTokenCount**：`integer`

  僅供輸出。提示詞中的權杖數量。

  

---


  

<details>
<summary>**promptTokenDetails**：`ModalityTokenCount array` 僅供輸出。請求輸入中處理的模態清單。</summary>

  

  

<details>
<summary>**modality**：`GenerativeLanguageModality` 與此權杖數量關聯的模態。</summary>

  

  可能的值：

  - `MODALITY_UNSPECIFIED`：未指定的模態。
  - `TEXT`：純文字。
  - `IMAGE`：圖片。
  - `VIDEO`：影片。
  - `AUDIO`：音訊。
  - `DOCUMENT`：文件，例如 PDF。

  

</details>


  **tokenCount**：`integer`

  權杖數量。

  

</details>


