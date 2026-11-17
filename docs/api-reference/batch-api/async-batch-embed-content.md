# 建立嵌入批次

`POST` `https://generativelanguage.googleapis.com/v1beta/models/{model}:asyncBatchEmbedContent`

將一批 `EmbedContent` 請求加入佇列，進行批次處理。
`BatchEmbedContents` 處理常式位於 `GenerativeService` 中，但它是
同步式的。因此將這個命名為 `Async`，以免混淆。


  
## 參數 {#parameters}

  
  **model**：必填 `string`

  模型 ID，例如 `gemini-2.5-flash`。組成資源名稱 `models/{model}`。

  

## 請求主體 {#request-body}

  
  

<details>
<summary>**batch**：必填 `EmbedContentBatch` 要建立的批次。</summary>

  

  **model**：必填 `string`

  用於產生補全結果的 `Model` 名稱。格式：`models/{model}`。

  **displayName**：必填 `string`

  使用者為此批次自訂的名稱。

  

<details>
<summary>**inputConfig**：必填 `InputEmbedContentConfig` 執行批次處理的執行個體的輸入設定。</summary>

  

  

<details>
<summary>**source**：必填 `Union type` 輸入的來源。</summary>

  

  聯合欄位 `source` 只能是下列其中之一：

  **fileName**: `string`

  包含輸入請求的 `File` 名稱。

  

<details>
<summary>**requests**：`InlinedEmbedContentRequests` 要在批次中處理的請求。</summary>

  

  

<details>
<summary>**requests**：必填 `InlinedEmbedContentRequest array` 要在批次中處理的請求。</summary>

  

  

<details>
<summary>**request**：必填 `EmbedContentRequest` 要在批次中處理的請求。</summary>

  

  **model**：必填 `string`

  模型的資源名稱，作為要使用的 Model 的 ID。此名稱應與 `ListModels` 方法傳回的模型名稱相符。格式：`models/{model}`

  

<details>
<summary>**content**：必填 `Content` 要嵌入的內容。只有 `parts.text` 欄位會被計入。</summary>

  

  

<details>
<summary>**parts**：`Part array` 構成單一訊息的有序 `Parts`。各部分（part）的 MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**: `Union type`</summary>

  

  聯合欄位 `data` 只能是下列其中之一：

  **text**: `string`

  內嵌文字。

  

<details>
<summary>**inlineData**：`Blob` 內嵌媒體位元組。</summary>

  

  **mimeType**: `string`

  來源資料的 IANA 標準 MIME 類型。支援的類型範例：

  - 圖片：image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
  - 音訊：audio/*, video/audio/s16le, video/audio/wav
  - 影片：video/*
  - 文字：text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
  - 應用程式：application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf。如需更多背景資訊，請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

  **data**: `string`

  媒體格式的原始位元組。

  **displayName**: `string`

  選用。指定用來向模型指稱這個 blob 的名稱（例如 "my_blob.png"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 的參照識別碼。

  

</details>


  

<details>
<summary>**functionCall**：`FunctionCall` 模型傳回的預測 `FunctionCall`，其中包含代表 `FunctionDeclaration.name` 的字串，以及其引數與值。</summary>

  

  **name**：必填 `string`

  要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

  **id**: `string`

  選用。函式呼叫的唯一識別碼。若有填入，用戶端應執行 `function_call`，並傳回 `id` 相符的回應。

  **args**: `object`

  選用。函式參數與值，採用 JSON 物件格式。

  

</details>


  

<details>
<summary>**functionResponse**：`FunctionResponse` `FunctionCall` 的結果輸出，其中包含代表 `FunctionDeclaration.name` 的字串，以及包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。</summary>

  

  **name**：必填 `string`

  要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

  **response**：必填 `object`

  函式回應，採用 JSON 物件格式。呼叫端可以使用任何符合函式語法的自選鍵來傳回函式輸出，例如 "output"、"result" 等。特別是當函式呼叫執行失敗時，回應可以包含 "error" 鍵，將錯誤詳細資訊傳回給模型。多媒體內容可以透過子物件納入，該子物件包含單一 "$ref" 鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`（屬於持有該多媒體內容的 `FunctionResponsePart`）。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

  **id**: `string`

  選用。此回應所對應的函式呼叫的識別碼。由用戶端填入，以對應相對應的函式呼叫 `id`。

  

<details>
<summary>**parts**：`FunctionResponsePart array` 選用。構成函式回應的有序 `Parts`。各部分（part）的 IANA MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type` 函式回應部分的資料。</summary>

  

  聯合欄位 `data` 只能是下列其中之一：

  

<details>
<summary>**inlineData**：`FunctionResponseBlob` 內嵌媒體位元組。</summary>

  

  **mimeType**: `string`

  來源資料的 IANA 標準 MIME 類型。範例：

  - image/png
  - image/jpeg

  若提供了不支援的 MIME 類型，將傳回錯誤。支援類型的完整清單，請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

  **data**: `string`

  媒體格式的原始位元組。

  **displayName**: `string`

  選用。blob 的顯示名稱。用來提供標籤或檔案名稱以區分各個 blob，並從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。

  

</details>


  

<details>
<summary>**fileData**：`FunctionResponseFileData` 以 URI 為基礎的資料。</summary>

  

  **fileUri**：必填 `string`

  URI。

  **mimeType**: `string`

  來源資料的 IANA 標準 MIME 類型。若提供了不支援的 MIME 類型，將傳回錯誤。支援類型的完整清單，請參閱[多模態函式回應](/docs/function-calling/#multimodal)與[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

  **displayName**: `string`

  選用。檔案的顯示名稱。用來提供標籤或檔案名稱以區分檔案資料，並從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。

  

</details>


  

</details>


  

<details>
<summary>**mediaProcessing**：`string enum` 選用。模型如何處理這個部分（part）的媒體以進行理解。僅對影片部分（`inline_data` 或 MIME 類型為影片的 `file_data`）有意義。非影片部分會忽略此欄位。</summary>

  

  可能的值：

  - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型專屬的處理方式。
  - `STATIC`：以固定速率擷取影格。所有影格都會放入上下文。
  - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。

  

</details>


  

</details>


  **willContinue**: `boolean`

  選用。表示函式呼叫將繼續，並會傳回更多回應，使函式呼叫變成產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，後續回應將不被考慮。可以傳回空的 `response` 並將 `will_continue=False`，表示函式呼叫已結束。這仍可能觸發模型產生內容。若要避免觸發產生並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。

  

<details>
<summary>**scheduling**：`string enum` 選用。指定回應在對話中應如何排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。</summary>

  

  可能的值：

  - `SCHEDULING_UNSPECIFIED`：不使用此值。
  - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發產生。
  - `WHEN_IDLE`：將結果加入對話上下文，並提示產生輸出，但不中斷進行中的產生。
  - `INTERRUPT`：將結果加入對話上下文，中斷進行中的產生，並提示產生輸出。

  

</details>


  

</details>


  

<details>
<summary>**fileData**：`FileData` 以 URI 為基礎的資料。</summary>

  

  **fileUri**：必填 `string`

  URI。

  **mimeType**: `string`

  選用。來源資料的 IANA 標準 MIME 類型。

  **displayName**: `string`

  選用。指定用來向模型指稱這個檔案的名稱（例如 "my_file.pdf"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案的參照識別碼。

  

</details>


  

<details>
<summary>**executableCode**：`ExecutableCode` 模型產生的待執行程式碼。</summary>

  

  

<details>
<summary>**language**：必填 `string enum` `code` 的程式語言。</summary>

  

  可能的值：

  - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用此值。
  - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 為預設語言。

  

</details>


  **code**：必填 `string`

  要執行的程式碼。

  **id**: `string`

  選用。`ExecutableCode` 部分的唯一識別碼。伺服器會傳回 `CodeExecutionResult`，其 `id` 與之相符。

  

</details>


  

<details>
<summary>**codeExecutionResult**：`CodeExecutionResult` 執行 `ExecutableCode` 的結果。</summary>

  

  

<details>
<summary>**outcome**：必填 `string enum` 程式碼執行的結果。</summary>

  

  可能的值：

  - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用此值。
  - `OUTCOME_OK`：程式碼執行成功完成。`output` 包含標準輸出（stdout），若有的話。
  - `OUTCOME_FAILED`：程式碼執行失敗。`output` 包含標準錯誤（stderr）與標準輸出（stdout），若有的話。
  - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已取消。可能有、也可能沒有部分 `output`。

  

</details>


  **id**: `string`

  選用。此結果所對應的 `ExecutableCode` 部分的識別碼。僅在對應的 `ExecutableCode` 有 id 時才填入。

  **output**: `string`

  選用。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。

  

</details>


  

<details>
<summary>**toolCall**：`ToolCall` 伺服器端工具呼叫。當模型預測有應在伺服器上執行的工具呼叫時，會填入此欄位。用戶端應將此訊息回傳給 API。</summary>

  

  

<details>
<summary>**toolType**：必填 `V1mainToolType` 被呼叫的工具類型。</summary>

  

  可能的值：

  - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
  - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應至 Tool.google_search.search_types.web_search。
  - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應至 Tool.google_search.search_types.image_search。
  - `URL_CONTEXT`：URL 上下文工具，對應至 Tool.url_context。
  - `GOOGLE_MAPS`：Google 地圖工具，對應至 Tool.google_maps。
  - `FILE_SEARCH`：File Search 工具，對應至 Tool.file_search。
  - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應至用於多模態理解的隱形工具，例如 GOOGLE_UNDERSTANDING_VIDEO。

  

</details>


  **id**: `string`

  選用。工具呼叫的唯一識別碼。伺服器會傳回 `id` 相符的工具回應。

  **toolName**: `string`

  選用。被呼叫的工具名稱。

  **args**: `object`

  選用。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}

  

</details>


  

<details>
<summary>**toolResponse**：`ToolResponse` 伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端填入執行對應 `ToolCall` 的結果。</summary>

  

  

<details>
<summary>**toolType**：必填 `V1mainToolType` 被呼叫的工具類型，與 `tool_type`（在對應的 `ToolCall` 中）相符。</summary>

  

  可能的值：

  - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
  - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應至 Tool.google_search.search_types.web_search。
  - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應至 Tool.google_search.search_types.image_search。
  - `URL_CONTEXT`：URL 上下文工具，對應至 Tool.url_context。
  - `GOOGLE_MAPS`：Google 地圖工具，對應至 Tool.google_maps。
  - `FILE_SEARCH`：File Search 工具，對應至 Tool.file_search。
  - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應至用於多模態理解的隱形工具，例如 GOOGLE_UNDERSTANDING_VIDEO。

  

</details>


  **id**: `string`

  選用。此回應所對應的工具呼叫的識別碼。

  **response**: `object`

  選用。工具回應。

  

</details>


  

</details>


  

<details>
<summary>**metadata**：`Union type` 控制資料的額外前置處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個部分（part）的靜態媒體前置處理。</summary>

  

  聯合欄位 `metadata` 只能是下列其中之一：

  

<details>
<summary>**videoMetadata**：`VideoMetadata` 選用。影片中繼資料。只有當影片資料以 inline_data 或 file_data 形式提供時，才應指定此中繼資料。</summary>

  

  **startOffset**: `string`

  選用。影片的開始偏移量。

  **endOffset**: `string`

  選用。影片的結束偏移量。

  **fps**: `number`

  選用。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。

  

</details>


  

</details>


  **thought**: `boolean`

  選用。表示該部分（part）是否為模型的思考內容。

  **thoughtSignature**: `string`

  選用。思考內容的不透明簽章，可在後續請求中重複使用。

  **partMetadata**: `object`

  與 Part 相關聯的自訂中繼資料。使用 genai.Part 作為內容表示法的代理，可能需要追蹤額外資訊。例如 Part 來源的檔案/來源名稱，或多工處理多個 Part 串流的方式。

  

<details>
<summary>**mediaResolution**：`V1mainMediaResolution` 選用。輸入媒體的媒體解析度。</summary>

  

  

<details>
<summary>**value**：`Union type` 媒體解析度等級。</summary>

  

  聯合欄位 `value` 只能是下列其中之一：

  

<details>
<summary>**level**：`string enum` 用於指定媒體的權杖化品質。供 Gemini API 支援使用。</summary>

  

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
<summary>**mediaProcessing**：`string enum` 選用。模型如何處理這個部分（part）的媒體以進行理解。僅對影片部分（`inline_data` 或 MIME 類型為影片的 `file_data`）有意義。非影片部分會忽略此欄位。</summary>

  

  可能的值：

  - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型專屬的處理方式。
  - `STATIC`：以固定速率擷取影格。所有影格都會放入上下文。
  - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。

  

</details>


  

<details>
<summary>**audioTranscription**：`AudioTranscription` 選用。音訊（輸入或輸出）的轉錄。只有當此 Part 包含音訊資料時才會設定。</summary>

  

  **text**：必填 `string`

  這個音訊片段的轉錄文字。

  **speakerLabel**: `string`

  選用。識別這個音訊片段說話者的標籤（例如 "spk_1"、"spk_2"）。設定語者分離（diarization）時才會出現。

  

<details>
<summary>**words**：`WordInfo array` 選用。詳細的逐字轉錄與時間資訊。設定 word_timestamp 時才會出現。</summary>

  

  **word**：必填 `string`

  該單字的轉錄。

  **startOffset**: `string`

  選用。單字相對於音訊開頭的開始時間偏移量。

  **endOffset**: `string`

  選用。單字相對於音訊開頭的結束時間偏移量。

  

</details>


  

</details>


  

<details>
<summary>**speechMetadata**：`SpeechMetadata` 選用。套用至文字部分（part）的中繼資料，用來訂製朗讀或合成的方式，例如指定說話者身分或說話風格。</summary>

  

  **speaker**: `string`

  選用。多說話者合成時可指定的說話者名稱。

  **style**: `string`

  選用。語音合成時可指定的風格指令。

  

</details>


  

</details>


  **role**: `string`

  選用。內容的產生者。必須是 'user' 或 'model' 其中之一。在多輪對話中設定此欄位很有用，否則可留空或不設定。

  

</details>


  

<details>
<summary>**embedContentConfig**：`EmbedContentConfig` 選用。EmbedContent 請求的設定。</summary>

  

  **title**: `string`

  選用。文字的標題。

  

<details>
<summary>**taskType**：`TaskType` 選用。嵌入的工作類型。</summary>

  

  可能的值：

  - `TASK_TYPE_UNSPECIFIED`：未設定的值，將預設為其他列舉值之一。
  - `RETRIEVAL_QUERY`：指定所提供的文字是在搜尋/檢索情境中的查詢。
  - `RETRIEVAL_DOCUMENT`：指定所提供的文字是被搜尋語料庫中的文件。
  - `SEMANTIC_SIMILARITY`：指定所提供的文字將用於 STS。
  - `CLASSIFICATION`：指定所提供的文字將被分類。
  - `CLUSTERING`：指定嵌入向量將用於分群。
  - `QUESTION_ANSWERING`：指定所提供的文字將用於問答。
  - `FACT_VERIFICATION`：指定所提供的文字將用於事實查核。
  - `CODE_RETRIEVAL_QUERY`：指定所提供的文字將用於程式碼檢索。

  

</details>


  **autoTruncate**: `boolean`

  選用。若輸入內容長於最大序列長度，是否靜默截斷。

  **outputDimensionality**: `integer`

  選用。輸出嵌入向量的縮減維度。若有設定，輸出嵌入向量中多餘的值會從末端截斷。

  **documentOcr**: `boolean`

  選用。是否為文件內容啟用 OCR。

  **audioTrackExtraction**: `boolean`

  選用。是否從影片內容擷取音訊。

  

</details>


  

</details>


  **metadata**: `object`

  選用。要與請求相關聯的中繼資料。

  

</details>


  

</details>


  

</details>


  

</details>


  **name**: `string`

  僅供輸出。識別碼。批次的資源名稱。格式：`batches/{batch_id}`。

  

<details>
<summary>**output**：`EmbedContentBatchOutput` 僅供輸出。批次請求的輸出。</summary>

  

  

<details>
<summary>**output**：`Union type` 批次請求的輸出。</summary>

  

  聯合欄位 `output` 只能是下列其中之一：

  **responsesFile**: `string`

  僅供輸出。包含回應的檔案的檔案 ID。該檔案為 JSONL 檔案，每行一個回應。回應為格式化為 JSON 的 `EmbedContentResponse` 訊息。回應的寫入順序與輸入請求相同。

  

<details>
<summary>**inlinedResponses**：`InlinedEmbedContentResponses` 僅供輸出。批次中各請求的回應。當批次是以內嵌請求建立時傳回。回應的順序與輸入請求相同。</summary>

  

  

<details>
<summary>**inlinedResponses**：`InlinedEmbedContentResponse array` 僅供輸出。批次中各請求的回應。</summary>

  

  

<details>
<summary>**output**：`Union type` 請求的輸出。</summary>

  

  聯合欄位 `output` 只能是下列其中之一：

  

<details>
<summary>**error**：`Status` 僅供輸出。處理請求時遇到的錯誤。</summary>

  

  **code**: `integer`

  狀態碼，應為 google.rpc.Code 的列舉值。

  **message**: `string`

  給開發人員看的錯誤訊息，應以英文撰寫。任何給使用者看的錯誤訊息都應本地化，並放在 google.rpc.Status.details 欄位中傳送，或由用戶端本地化。

  **details**: `object array`

  承載錯誤詳細資訊的訊息清單。API 有一組通用的訊息類型可供使用。

  

</details>


  

<details>
<summary>**response**：`EmbedContentResponse` 僅供輸出。對請求的回應。</summary>

  

  

<details>
<summary>**embedding**：`ContentEmbedding` 僅供輸出。由輸入內容產生的嵌入向量。</summary>

  

  **values**: `number array`

  嵌入值。僅供第三方（3P）使用者，第一方（1P）呼叫不會填入此欄位。

  **shape**: `integer array`

  此欄位儲存 soft tokens 張量的影格形狀（例如 [1, 1, 256, 2048]）。

  

</details>


  

<details>
<summary>**usageMetadata**：`EmbeddingUsageMetadata` 僅供輸出。請求的用量中繼資料。</summary>

  

  **promptTokenCount**: `integer`

  僅供輸出。提示詞中的權杖數量。

  

<details>
<summary>**promptTokenDetails**：`ModalityTokenCount array` 僅供輸出。請求輸入中處理的模態清單。</summary>

  

  

<details>
<summary>**modality**：`GenerativeLanguageModality` 與此權杖數量相關聯的模態。</summary>

  

  可能的值：

  - `MODALITY_UNSPECIFIED`：未指定的模態。
  - `TEXT`：純文字。
  - `IMAGE`：圖片。
  - `VIDEO`：影片。
  - `AUDIO`：音訊。
  - `DOCUMENT`：文件，例如 PDF。

  

</details>


  **tokenCount**: `integer`

  權杖數量。

  

</details>


  

</details>


  

</details>


  

</details>


  **metadata**: `object`

  僅供輸出。與請求相關聯的中繼資料。

  

</details>


  

</details>


  

</details>


  

</details>


  **createTime**: `string`

  僅供輸出。批次的建立時間。

  **endTime**: `string`

  僅供輸出。批次處理完成的時間。

  **updateTime**: `string`

  僅供輸出。批次的最後更新時間。

  

<details>
<summary>**batchStats**：`EmbedContentBatchStats` 僅供輸出。批次的統計資訊。</summary>

  

  **requestCount**: `string`

  僅供輸出。批次中的請求數量。

  **successfulRequestCount**: `string`

  僅供輸出。成功處理的請求數量。

  **failedRequestCount**: `string`

  僅供輸出。處理失敗的請求數量。

  **pendingRequestCount**: `string`

  僅供輸出。仍在等待處理的請求數量。

  

</details>


  

<details>
<summary>**state**：[`BatchState`](/api-reference/batch-api/async-batch-embed-content/#Resource:BatchState) 僅供輸出。批次的狀態。</summary>

  

  可能的值：

  - `BATCH_STATE_UNSPECIFIED`：未指定批次狀態。
  - `BATCH_STATE_PENDING`：服務正在準備執行批次。
  - `BATCH_STATE_RUNNING`：批次正在執行中。
  - `BATCH_STATE_SUCCEEDED`：批次已成功完成。
  - `BATCH_STATE_FAILED`：批次失敗。
  - `BATCH_STATE_CANCELLED`：批次已取消。
  - `BATCH_STATE_EXPIRED`：批次已過期。

  

</details>


  **priority**: `string`

  選用。批次的優先順序。優先順序值較高的批次會先於值較低的批次處理。允許負值。預設為 0。

  

</details>


  

  

  
  **請求範例**

  

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/$MODEL_ID:asyncBatchEmbedContent" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
        "batch": {
          "model": "string",
          "displayName": "string",
          "inputConfig": {
            "fileName": "string"
          }
        }
      }'
      ```


  


  
## 回應 {#response}

  
  

<details>
<summary>**error**：`Status` 操作失敗或取消時的錯誤結果。</summary>

  

  **code**: `integer`

  狀態碼，應為 google.rpc.Code 的列舉值。

  **message**: `string`

  給開發人員看的錯誤訊息，應以英文撰寫。任何給使用者看的錯誤訊息都應本地化，並放在 google.rpc.Status.details 欄位中傳送，或由用戶端本地化。

  **details**: `object array`

  承載錯誤詳細資訊的訊息清單。API 有一組通用的訊息類型可供使用。

  

</details>


  

---


  

<details>
<summary>**response**: `AsyncBatchEmbedContentResponse`</summary>

  

  

<details>
<summary>**output**：`EmbedContentBatchOutput` 僅供輸出。批次請求的輸出。</summary>

  

  

<details>
<summary>**output**：`Union type` 批次請求的輸出。</summary>

  

  聯合欄位 `output` 只能是下列其中之一：

  **responsesFile**: `string`

  僅供輸出。包含回應的檔案的檔案 ID。該檔案為 JSONL 檔案，每行一個回應。回應為格式化為 JSON 的 `EmbedContentResponse` 訊息。回應的寫入順序與輸入請求相同。

  

<details>
<summary>**inlinedResponses**：`InlinedEmbedContentResponses` 僅供輸出。批次中各請求的回應。當批次是以內嵌請求建立時傳回。回應的順序與輸入請求相同。</summary>

  

  

<details>
<summary>**inlinedResponses**：`InlinedEmbedContentResponse array` 僅供輸出。批次中各請求的回應。</summary>

  

  

<details>
<summary>**output**：`Union type` 請求的輸出。</summary>

  

  聯合欄位 `output` 只能是下列其中之一：

  

<details>
<summary>**error**：`Status` 僅供輸出。處理請求時遇到的錯誤。</summary>

  

  **code**: `integer`

  狀態碼，應為 google.rpc.Code 的列舉值。

  **message**: `string`

  給開發人員看的錯誤訊息，應以英文撰寫。任何給使用者看的錯誤訊息都應本地化，並放在 google.rpc.Status.details 欄位中傳送，或由用戶端本地化。

  **details**: `object array`

  承載錯誤詳細資訊的訊息清單。API 有一組通用的訊息類型可供使用。

  

</details>


  

<details>
<summary>**response**：`EmbedContentResponse` 僅供輸出。對請求的回應。</summary>

  

  

<details>
<summary>**embedding**：`ContentEmbedding` 僅供輸出。由輸入內容產生的嵌入向量。</summary>

  

  **values**: `number array`

  嵌入值。僅供第三方（3P）使用者，第一方（1P）呼叫不會填入此欄位。

  **shape**: `integer array`

  此欄位儲存 soft tokens 張量的影格形狀（例如 [1, 1, 256, 2048]）。

  

</details>


  

<details>
<summary>**usageMetadata**：`EmbeddingUsageMetadata` 僅供輸出。請求的用量中繼資料。</summary>

  

  **promptTokenCount**: `integer`

  僅供輸出。提示詞中的權杖數量。

  

<details>
<summary>**promptTokenDetails**：`ModalityTokenCount array` 僅供輸出。請求輸入中處理的模態清單。</summary>

  

  

<details>
<summary>**modality**：`GenerativeLanguageModality` 與此權杖數量相關聯的模態。</summary>

  

  可能的值：

  - `MODALITY_UNSPECIFIED`：未指定的模態。
  - `TEXT`：純文字。
  - `IMAGE`：圖片。
  - `VIDEO`：影片。
  - `AUDIO`：音訊。
  - `DOCUMENT`：文件，例如 PDF。

  

</details>


  **tokenCount**: `integer`

  權杖數量。

  

</details>


  

</details>


  

</details>


  

</details>


  **metadata**: `object`

  僅供輸出。與請求相關聯的中繼資料。

  

</details>


  

</details>


  

</details>


  

</details>


  

</details>


  

---


  **name**: `string`

  伺服器指派的名稱，僅在最初傳回它的同一個服務內唯一。若使用預設的 HTTP 對應，`name` 應為以 `operations/{unique_id}` 結尾的資源名稱。

  

---


  

<details>
<summary>**metadata**: `EmbedContentBatch`</summary>

  

  **model**：必填 `string`

  用於產生補全結果的 `Model` 名稱。格式：`models/{model}`。

  **displayName**：必填 `string`

  使用者為此批次自訂的名稱。

  

<details>
<summary>**inputConfig**：必填 `InputEmbedContentConfig` 執行批次處理的執行個體的輸入設定。</summary>

  

  

<details>
<summary>**source**：必填 `Union type` 輸入的來源。</summary>

  

  聯合欄位 `source` 只能是下列其中之一：

  **fileName**: `string`

  包含輸入請求的 `File` 名稱。

  

<details>
<summary>**requests**：`InlinedEmbedContentRequests` 要在批次中處理的請求。</summary>

  

  

<details>
<summary>**requests**：必填 `InlinedEmbedContentRequest array` 要在批次中處理的請求。</summary>

  

  

<details>
<summary>**request**：必填 `EmbedContentRequest` 要在批次中處理的請求。</summary>

  

  **model**：必填 `string`

  模型的資源名稱，作為要使用的 Model 的 ID。此名稱應與 `ListModels` 方法傳回的模型名稱相符。格式：`models/{model}`

  

<details>
<summary>**content**：必填 `Content` 要嵌入的內容。只有 `parts.text` 欄位會被計入。</summary>

  

  

<details>
<summary>**parts**：`Part array` 構成單一訊息的有序 `Parts`。各部分（part）的 MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**: `Union type`</summary>

  

  聯合欄位 `data` 只能是下列其中之一：

  **text**: `string`

  內嵌文字。

  

<details>
<summary>**inlineData**：`Blob` 內嵌媒體位元組。</summary>

  

  **mimeType**: `string`

  來源資料的 IANA 標準 MIME 類型。支援的類型範例：

  - 圖片：image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
  - 音訊：audio/*, video/audio/s16le, video/audio/wav
  - 影片：video/*
  - 文字：text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
  - 應用程式：application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf。如需更多背景資訊，請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

  **data**: `string`

  媒體格式的原始位元組。

  **displayName**: `string`

  選用。指定用來向模型指稱這個 blob 的名稱（例如 "my_blob.png"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 的參照識別碼。

  

</details>


  

<details>
<summary>**functionCall**：`FunctionCall` 模型傳回的預測 `FunctionCall`，其中包含代表 `FunctionDeclaration.name` 的字串，以及其引數與值。</summary>

  

  **name**：必填 `string`

  要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

  **id**: `string`

  選用。函式呼叫的唯一識別碼。若有填入，用戶端應執行 `function_call`，並傳回 `id` 相符的回應。

  **args**: `object`

  選用。函式參數與值，採用 JSON 物件格式。

  

</details>


  

<details>
<summary>**functionResponse**：`FunctionResponse` `FunctionCall` 的結果輸出，其中包含代表 `FunctionDeclaration.name` 的字串，以及包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。</summary>

  

  **name**：必填 `string`

  要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

  **response**：必填 `object`

  函式回應，採用 JSON 物件格式。呼叫端可以使用任何符合函式語法的自選鍵來傳回函式輸出，例如 "output"、"result" 等。特別是當函式呼叫執行失敗時，回應可以包含 "error" 鍵，將錯誤詳細資訊傳回給模型。多媒體內容可以透過子物件納入，該子物件包含單一 "$ref" 鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`（屬於持有該多媒體內容的 `FunctionResponsePart`）。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

  **id**: `string`

  選用。此回應所對應的函式呼叫的識別碼。由用戶端填入，以對應相對應的函式呼叫 `id`。

  

<details>
<summary>**parts**：`FunctionResponsePart array` 選用。構成函式回應的有序 `Parts`。各部分（part）的 IANA MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type` 函式回應部分的資料。</summary>

  

  聯合欄位 `data` 只能是下列其中之一：

  

<details>
<summary>**inlineData**：`FunctionResponseBlob` 內嵌媒體位元組。</summary>

  

  **mimeType**: `string`

  來源資料的 IANA 標準 MIME 類型。範例：

  - image/png
  - image/jpeg

  若提供了不支援的 MIME 類型，將傳回錯誤。支援類型的完整清單，請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

  **data**: `string`

  媒體格式的原始位元組。

  **displayName**: `string`

  選用。blob 的顯示名稱。用來提供標籤或檔案名稱以區分各個 blob，並從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。

  

</details>


  

<details>
<summary>**fileData**：`FunctionResponseFileData` 以 URI 為基礎的資料。</summary>

  

  **fileUri**：必填 `string`

  URI。

  **mimeType**: `string`

  來源資料的 IANA 標準 MIME 類型。若提供了不支援的 MIME 類型，將傳回錯誤。支援類型的完整清單，請參閱[多模態函式回應](/docs/function-calling/#multimodal)與[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

  **displayName**: `string`

  選用。檔案的顯示名稱。用來提供標籤或檔案名稱以區分檔案資料，並從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。

  

</details>


  

</details>


  

<details>
<summary>**mediaProcessing**：`string enum` 選用。模型如何處理這個部分（part）的媒體以進行理解。僅對影片部分（`inline_data` 或 MIME 類型為影片的 `file_data`）有意義。非影片部分會忽略此欄位。</summary>

  

  可能的值：

  - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型專屬的處理方式。
  - `STATIC`：以固定速率擷取影格。所有影格都會放入上下文。
  - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。

  

</details>


  

</details>


  **willContinue**: `boolean`

  選用。表示函式呼叫將繼續，並會傳回更多回應，使函式呼叫變成產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，後續回應將不被考慮。可以傳回空的 `response` 並將 `will_continue=False`，表示函式呼叫已結束。這仍可能觸發模型產生內容。若要避免觸發產生並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。

  

<details>
<summary>**scheduling**：`string enum` 選用。指定回應在對話中應如何排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。</summary>

  

  可能的值：

  - `SCHEDULING_UNSPECIFIED`：不使用此值。
  - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發產生。
  - `WHEN_IDLE`：將結果加入對話上下文，並提示產生輸出，但不中斷進行中的產生。
  - `INTERRUPT`：將結果加入對話上下文，中斷進行中的產生，並提示產生輸出。

  

</details>


  

</details>


  

<details>
<summary>**fileData**：`FileData` 以 URI 為基礎的資料。</summary>

  

  **fileUri**：必填 `string`

  URI。

  **mimeType**: `string`

  選用。來源資料的 IANA 標準 MIME 類型。

  **displayName**: `string`

  選用。指定用來向模型指稱這個檔案的名稱（例如 "my_file.pdf"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案的參照識別碼。

  

</details>


  

<details>
<summary>**executableCode**：`ExecutableCode` 模型產生的待執行程式碼。</summary>

  

  

<details>
<summary>**language**：必填 `string enum` `code` 的程式語言。</summary>

  

  可能的值：

  - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用此值。
  - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 為預設語言。

  

</details>


  **code**：必填 `string`

  要執行的程式碼。

  **id**: `string`

  選用。`ExecutableCode` 部分的唯一識別碼。伺服器會傳回 `CodeExecutionResult`，其 `id` 與之相符。

  

</details>


  

<details>
<summary>**codeExecutionResult**：`CodeExecutionResult` 執行 `ExecutableCode` 的結果。</summary>

  

  

<details>
<summary>**outcome**：必填 `string enum` 程式碼執行的結果。</summary>

  

  可能的值：

  - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用此值。
  - `OUTCOME_OK`：程式碼執行成功完成。`output` 包含標準輸出（stdout），若有的話。
  - `OUTCOME_FAILED`：程式碼執行失敗。`output` 包含標準錯誤（stderr）與標準輸出（stdout），若有的話。
  - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已取消。可能有、也可能沒有部分 `output`。

  

</details>


  **id**: `string`

  選用。此結果所對應的 `ExecutableCode` 部分的識別碼。僅在對應的 `ExecutableCode` 有 id 時才填入。

  **output**: `string`

  選用。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。

  

</details>


  

<details>
<summary>**toolCall**：`ToolCall` 伺服器端工具呼叫。當模型預測有應在伺服器上執行的工具呼叫時，會填入此欄位。用戶端應將此訊息回傳給 API。</summary>

  

  

<details>
<summary>**toolType**：必填 `V1mainToolType` 被呼叫的工具類型。</summary>

  

  可能的值：

  - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
  - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應至 Tool.google_search.search_types.web_search。
  - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應至 Tool.google_search.search_types.image_search。
  - `URL_CONTEXT`：URL 上下文工具，對應至 Tool.url_context。
  - `GOOGLE_MAPS`：Google 地圖工具，對應至 Tool.google_maps。
  - `FILE_SEARCH`：File Search 工具，對應至 Tool.file_search。
  - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應至用於多模態理解的隱形工具，例如 GOOGLE_UNDERSTANDING_VIDEO。

  

</details>


  **id**: `string`

  選用。工具呼叫的唯一識別碼。伺服器會傳回 `id` 相符的工具回應。

  **toolName**: `string`

  選用。被呼叫的工具名稱。

  **args**: `object`

  選用。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}

  

</details>


  

<details>
<summary>**toolResponse**：`ToolResponse` 伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端填入執行對應 `ToolCall` 的結果。</summary>

  

  

<details>
<summary>**toolType**：必填 `V1mainToolType` 被呼叫的工具類型，與 `tool_type`（在對應的 `ToolCall` 中）相符。</summary>

  

  可能的值：

  - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
  - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應至 Tool.google_search.search_types.web_search。
  - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應至 Tool.google_search.search_types.image_search。
  - `URL_CONTEXT`：URL 上下文工具，對應至 Tool.url_context。
  - `GOOGLE_MAPS`：Google 地圖工具，對應至 Tool.google_maps。
  - `FILE_SEARCH`：File Search 工具，對應至 Tool.file_search。
  - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應至用於多模態理解的隱形工具，例如 GOOGLE_UNDERSTANDING_VIDEO。

  

</details>


  **id**: `string`

  選用。此回應所對應的工具呼叫的識別碼。

  **response**: `object`

  選用。工具回應。

  

</details>


  

</details>


  

<details>
<summary>**metadata**：`Union type` 控制資料的額外前置處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個部分（part）的靜態媒體前置處理。</summary>

  

  聯合欄位 `metadata` 只能是下列其中之一：

  

<details>
<summary>**videoMetadata**：`VideoMetadata` 選用。影片中繼資料。只有當影片資料以 inline_data 或 file_data 形式提供時，才應指定此中繼資料。</summary>

  

  **startOffset**: `string`

  選用。影片的開始偏移量。

  **endOffset**: `string`

  選用。影片的結束偏移量。

  **fps**: `number`

  選用。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。

  

</details>


  

</details>


  **thought**: `boolean`

  選用。表示該部分（part）是否為模型的思考內容。

  **thoughtSignature**: `string`

  選用。思考內容的不透明簽章，可在後續請求中重複使用。

  **partMetadata**: `object`

  與 Part 相關聯的自訂中繼資料。使用 genai.Part 作為內容表示法的代理，可能需要追蹤額外資訊。例如 Part 來源的檔案/來源名稱，或多工處理多個 Part 串流的方式。

  

<details>
<summary>**mediaResolution**：`V1mainMediaResolution` 選用。輸入媒體的媒體解析度。</summary>

  

  

<details>
<summary>**value**：`Union type` 媒體解析度等級。</summary>

  

  聯合欄位 `value` 只能是下列其中之一：

  

<details>
<summary>**level**：`string enum` 用於指定媒體的權杖化品質。供 Gemini API 支援使用。</summary>

  

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
<summary>**mediaProcessing**：`string enum` 選用。模型如何處理這個部分（part）的媒體以進行理解。僅對影片部分（`inline_data` 或 MIME 類型為影片的 `file_data`）有意義。非影片部分會忽略此欄位。</summary>

  

  可能的值：

  - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型專屬的處理方式。
  - `STATIC`：以固定速率擷取影格。所有影格都會放入上下文。
  - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。

  

</details>


  

<details>
<summary>**audioTranscription**：`AudioTranscription` 選用。音訊（輸入或輸出）的轉錄。只有當此 Part 包含音訊資料時才會設定。</summary>

  

  **text**：必填 `string`

  這個音訊片段的轉錄文字。

  **speakerLabel**: `string`

  選用。識別這個音訊片段說話者的標籤（例如 "spk_1"、"spk_2"）。設定語者分離（diarization）時才會出現。

  

<details>
<summary>**words**：`WordInfo array` 選用。詳細的逐字轉錄與時間資訊。設定 word_timestamp 時才會出現。</summary>

  

  **word**：必填 `string`

  該單字的轉錄。

  **startOffset**: `string`

  選用。單字相對於音訊開頭的開始時間偏移量。

  **endOffset**: `string`

  選用。單字相對於音訊開頭的結束時間偏移量。

  

</details>


  

</details>


  

<details>
<summary>**speechMetadata**：`SpeechMetadata` 選用。套用至文字部分（part）的中繼資料，用來訂製朗讀或合成的方式，例如指定說話者身分或說話風格。</summary>

  

  **speaker**: `string`

  選用。多說話者合成時可指定的說話者名稱。

  **style**: `string`

  選用。語音合成時可指定的風格指令。

  

</details>


  

</details>


  **role**: `string`

  選用。內容的產生者。必須是 'user' 或 'model' 其中之一。在多輪對話中設定此欄位很有用，否則可留空或不設定。

  

</details>


  

<details>
<summary>**embedContentConfig**：`EmbedContentConfig` 選用。EmbedContent 請求的設定。</summary>

  

  **title**: `string`

  選用。文字的標題。

  

<details>
<summary>**taskType**：`TaskType` 選用。嵌入的工作類型。</summary>

  

  可能的值：

  - `TASK_TYPE_UNSPECIFIED`：未設定的值，將預設為其他列舉值之一。
  - `RETRIEVAL_QUERY`：指定所提供的文字是在搜尋/檢索情境中的查詢。
  - `RETRIEVAL_DOCUMENT`：指定所提供的文字是被搜尋語料庫中的文件。
  - `SEMANTIC_SIMILARITY`：指定所提供的文字將用於 STS。
  - `CLASSIFICATION`：指定所提供的文字將被分類。
  - `CLUSTERING`：指定嵌入向量將用於分群。
  - `QUESTION_ANSWERING`：指定所提供的文字將用於問答。
  - `FACT_VERIFICATION`：指定所提供的文字將用於事實查核。
  - `CODE_RETRIEVAL_QUERY`：指定所提供的文字將用於程式碼檢索。

  

</details>


  **autoTruncate**: `boolean`

  選用。若輸入內容長於最大序列長度，是否靜默截斷。

  **outputDimensionality**: `integer`

  選用。輸出嵌入向量的縮減維度。若有設定，輸出嵌入向量中多餘的值會從末端截斷。

  **documentOcr**: `boolean`

  選用。是否為文件內容啟用 OCR。

  **audioTrackExtraction**: `boolean`

  選用。是否從影片內容擷取音訊。

  

</details>


  

</details>


  **metadata**: `object`

  選用。要與請求相關聯的中繼資料。

  

</details>


  

</details>


  

</details>


  

</details>


  **name**: `string`

  僅供輸出。識別碼。批次的資源名稱。格式：`batches/{batch_id}`。

  

<details>
<summary>**output**：`EmbedContentBatchOutput` 僅供輸出。批次請求的輸出。</summary>

  

  

<details>
<summary>**output**：`Union type` 批次請求的輸出。</summary>

  

  聯合欄位 `output` 只能是下列其中之一：

  **responsesFile**: `string`

  僅供輸出。包含回應的檔案的檔案 ID。該檔案為 JSONL 檔案，每行一個回應。回應為格式化為 JSON 的 `EmbedContentResponse` 訊息。回應的寫入順序與輸入請求相同。

  

<details>
<summary>**inlinedResponses**：`InlinedEmbedContentResponses` 僅供輸出。批次中各請求的回應。當批次是以內嵌請求建立時傳回。回應的順序與輸入請求相同。</summary>

  

  

<details>
<summary>**inlinedResponses**：`InlinedEmbedContentResponse array` 僅供輸出。批次中各請求的回應。</summary>

  

  

<details>
<summary>**output**：`Union type` 請求的輸出。</summary>

  

  聯合欄位 `output` 只能是下列其中之一：

  

<details>
<summary>**error**：`Status` 僅供輸出。處理請求時遇到的錯誤。</summary>

  

  **code**: `integer`

  狀態碼，應為 google.rpc.Code 的列舉值。

  **message**: `string`

  給開發人員看的錯誤訊息，應以英文撰寫。任何給使用者看的錯誤訊息都應本地化，並放在 google.rpc.Status.details 欄位中傳送，或由用戶端本地化。

  **details**: `object array`

  承載錯誤詳細資訊的訊息清單。API 有一組通用的訊息類型可供使用。

  

</details>


  

<details>
<summary>**response**：`EmbedContentResponse` 僅供輸出。對請求的回應。</summary>

  

  

<details>
<summary>**embedding**：`ContentEmbedding` 僅供輸出。由輸入內容產生的嵌入向量。</summary>

  

  **values**: `number array`

  嵌入值。僅供第三方（3P）使用者，第一方（1P）呼叫不會填入此欄位。

  **shape**: `integer array`

  此欄位儲存 soft tokens 張量的影格形狀（例如 [1, 1, 256, 2048]）。

  

</details>


  

<details>
<summary>**usageMetadata**：`EmbeddingUsageMetadata` 僅供輸出。請求的用量中繼資料。</summary>

  

  **promptTokenCount**: `integer`

  僅供輸出。提示詞中的權杖數量。

  

<details>
<summary>**promptTokenDetails**：`ModalityTokenCount array` 僅供輸出。請求輸入中處理的模態清單。</summary>

  

  

<details>
<summary>**modality**：`GenerativeLanguageModality` 與此權杖數量相關聯的模態。</summary>

  

  可能的值：

  - `MODALITY_UNSPECIFIED`：未指定的模態。
  - `TEXT`：純文字。
  - `IMAGE`：圖片。
  - `VIDEO`：影片。
  - `AUDIO`：音訊。
  - `DOCUMENT`：文件，例如 PDF。

  

</details>


  **tokenCount**: `integer`

  權杖數量。

  

</details>


  

</details>


  

</details>


  

</details>


  **metadata**: `object`

  僅供輸出。與請求相關聯的中繼資料。

  

</details>


  

</details>


  

</details>


  

</details>


  **createTime**: `string`

  僅供輸出。批次的建立時間。

  **endTime**: `string`

  僅供輸出。批次處理完成的時間。

  **updateTime**: `string`

  僅供輸出。批次的最後更新時間。

  

<details>
<summary>**batchStats**：`EmbedContentBatchStats` 僅供輸出。批次的統計資訊。</summary>

  

  **requestCount**: `string`

  僅供輸出。批次中的請求數量。

  **successfulRequestCount**: `string`

  僅供輸出。成功處理的請求數量。

  **failedRequestCount**: `string`

  僅供輸出。處理失敗的請求數量。

  **pendingRequestCount**: `string`

  僅供輸出。仍在等待處理的請求數量。

  

</details>


  

<details>
<summary>**state**：[`BatchState`](/api-reference/batch-api/async-batch-embed-content/#Resource:BatchState) 僅供輸出。批次的狀態。</summary>

  

  可能的值：

  - `BATCH_STATE_UNSPECIFIED`：未指定批次狀態。
  - `BATCH_STATE_PENDING`：服務正在準備執行批次。
  - `BATCH_STATE_RUNNING`：批次正在執行中。
  - `BATCH_STATE_SUCCEEDED`：批次已成功完成。
  - `BATCH_STATE_FAILED`：批次失敗。
  - `BATCH_STATE_CANCELLED`：批次已取消。
  - `BATCH_STATE_EXPIRED`：批次已過期。

  

</details>


  **priority**: `string`

  選用。批次的優先順序。優先順序值較高的批次會先於值較低的批次處理。允許負值。預設為 0。

  

</details>


  

---


  **done**: `boolean`

  若值為 `false`，表示操作仍在進行中。若為 `true`，表示操作已完成，且 `error` 或 `response` 其中之一可用。

  

  

  
  **回應範例**

  ```json
  {
    "error": {
      "code": 0,
      "message": "string",
      "details": [
        {}
      ]
    },
    "response": {
      "output": {
        "responsesFile": "string",
        "inlinedResponses": {
          "inlinedResponses": [
            {
              "error": "...",
              "response": "...",
              "metadata": "..."
            }
          ]
        }
      }
    },
    "name": "string",
    "metadata": {
      "model": "string",
      "displayName": "string",
      "inputConfig": {
        "fileName": "string",
        "requests": {
          "requests": [
            {
              "request": "...",
              "metadata": "..."
            }
          ]
        }
      },
      "name": "string",
      "output": {
        "responsesFile": "string",
        "inlinedResponses": {
          "inlinedResponses": [
            {
              "error": "...",
              "response": "...",
              "metadata": "..."
            }
          ]
        }
      },
      "createTime": "string",
      "endTime": "string",
      "updateTime": "string",
      "batchStats": {
        "requestCount": "string",
        "successfulRequestCount": "string",
        "failedRequestCount": "string",
        "pendingRequestCount": "string"
      },
      "state": "BATCH_STATE_UNSPECIFIED",
      "priority": "string"
    },
    "done": true
  }
  ```

  


## 資料模型 {#data-models}

### BatchState {#Resource:BatchState}

**可能的值：**

- `BATCH_STATE_UNSPECIFIED`：未指定批次狀態。
- `BATCH_STATE_PENDING`：服務正在準備執行批次。
- `BATCH_STATE_RUNNING`：批次正在執行中。
- `BATCH_STATE_SUCCEEDED`：批次已成功完成。
- `BATCH_STATE_FAILED`：批次失敗。
- `BATCH_STATE_CANCELLED`：批次已取消。
- `BATCH_STATE_EXPIRED`：批次已過期。

