# Batch API

Gemini API 支援批次 API，可讓你在單次呼叫中處理多個要求。詳情請參閱 [Batch API 指南](/docs/batch-api/)。

## 方法 {#methods}


| 方法 | HTTP 要求 |
| --- | --- |
| [建立內容生成批次](/api-reference/batch-api/batch-generate-content/) | `POST` `/v1beta/models/{model}:batchGenerateContent` 將一批 `GenerateContent` 要求排入佇列，進行批次處理。 |
| [建立嵌入批次](/api-reference/batch-api/async-batch-embed-content/) | `POST` `/v1beta/models/{model}:asyncBatchEmbedContent` 將一批 `EmbedContent` 要求排入佇列，進行批次處理。 |
| [取得批次](/api-reference/batch-api/get-batch/) | `GET` `/v1beta/batches/{generateContentBatch}` 取得長時間執行作業的最新狀態。 |
| [列出批次](/api-reference/batch-api/list-batches/) | `GET` `/v1beta/batches` 列出符合要求中所指定篩選條件的作業。 |
| [取消批次](/api-reference/batch-api/cancel-batch/) | `POST` `/v1beta/batches/{generateContentBatch}:cancel` 開始非同步取消長時間執行作業。 |
| [刪除批次](/api-reference/batch-api/delete-batch/) | `DELETE` `/v1beta/batches/{generateContentBatch}` 刪除長時間執行作業。 |
| [更新內容生成批次](/api-reference/batch-api/update-generate-content-batch/) | `PATCH` `/v1beta/batches/{generateContentBatch}:updateGenerateContentBatch` 更新一批用於批次處理的 GenerateContent 要求。 |
| [更新嵌入批次](/api-reference/batch-api/update-embed-content-batch/) | `PATCH` `/v1beta/batches/{generateContentBatch}:updateEmbedContentBatch` 更新一批用於批次處理的 EmbedContent 要求。 |


## 資源 {#resources}

### GenerateContentBatch {#Resource:GenerateContentBatch}

代表一批 `GenerateContent` 要求的資源。

**屬性：**


  **model**：必填 `string`

  用於生成補全內容的 `Model` 名稱。格式：`models/{model}`。

  

---


  **displayName**：必填 `string`

  使用者為這個批次定義的名稱。

  

---


  

<details>
<summary>**inputConfig**：必填 `InputConfig` 要執行批次處理的執行個體的輸入設定。</summary>

  

  

<details>
<summary>**source**：必填 `Union type` 輸入的來源。</summary>

  

  Union 欄位 `source` 只能是下列其中之一：

  **fileName**：`string`

  包含輸入要求的 `File` 名稱。

  

<details>
<summary>**requests**：`InlinedRequests` 要在批次中處理的要求。</summary>

  

  

<details>
<summary>**requests**：必填 `InlinedRequest array` 要在批次中處理的要求。</summary>

  

  

<details>
<summary>**request**：必填 `GenerateContentRequest` 要在批次中處理的要求。</summary>

  

  **model**：必填 `string`

  用於生成補全內容的 `Model` 名稱。格式：`models/{model}`。

  

<details>
<summary>**contents**：必填 `Content array` 目前與模型的對話內容。對於單輪查詢，這是單一執行個體；對於多輪查詢（例如[聊天](/docs/text-generation/#multi-turn-conversations)），這是重複欄位，包含對話記錄與最新要求。</summary>

  

  

<details>
<summary>**parts**：`Part array` 組成單一訊息的已排序 `Parts`。各 Part 的 MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type`</summary>

  

  Union 欄位 `data` 只能是下列其中之一：

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

  選填。指定用來向模型指稱這個 blob 的名稱（例如「my_blob.png」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 參照識別碼使用。

  

</details>


  

<details>
<summary>**functionCall**：`FunctionCall` 模型傳回的預測 `FunctionCall`，包含代表 `FunctionDeclaration.name` 的字串，以及引數與其值。</summary>

  

  **name**：必填 `string`

  要呼叫的函式名稱。必須由 a-z、A-Z、0-9 組成，或包含底線與破折號，長度上限為 128。

  **id**：`string`

  選填。函式呼叫的唯一識別碼。若有填入，用戶端應執行該 `function_call`，並傳回帶有相符 `id` 的回應。

  **args**：`object`

  選填。JSON 物件格式的函式參數與值。

  

</details>


  

<details>
<summary>**functionResponse**：`FunctionResponse` `FunctionCall` 的結果輸出，包含代表 `FunctionDeclaration.name` 的字串，以及含有函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。</summary>

  

  **name**：必填 `string`

  要呼叫的函式名稱。必須由 a-z、A-Z、0-9 組成，或包含底線與破折號，長度上限為 128。

  **response**：必填 `object`

  JSON 物件格式的函式回應。呼叫端可使用符合函式語法的任意鍵來傳回函式輸出，例如「output」、「result」等。特別是當函式呼叫執行失敗時，回應可包含「error」鍵，將錯誤詳情傳回給模型。多媒體內容可透過子物件納入，該子物件包含單一「$ref」鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，屬於持有該多媒體內容的 `FunctionResponsePart`。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

  **id**：`string`

  選填。這個回應所對應的函式呼叫識別碼。由用戶端填入，以比對對應的函式呼叫 `id`。

  

<details>
<summary>**parts**：`FunctionResponsePart array` 選填。組成函式回應的已排序 `Parts`。各 Part 的 IANA MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type` 函式回應 part 的資料。</summary>

  

  Union 欄位 `data` 只能是下列其中之一：

  

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

  選填。blob 的顯示名稱。用來提供標籤或檔名以區分各個 blob，並從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。

  

</details>


  

<details>
<summary>**fileData**：`FunctionResponseFileData` 以 URI 為基礎的資料。</summary>

  

  **fileUri**：必填 `string`

  URI。

  **mimeType**：`string`

  來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將傳回錯誤。完整支援類型清單請參閱[多模態函式回應](/docs/function-calling/#multimodal)與[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

  **displayName**：`string`

  選填。檔案的顯示名稱。用來提供標籤或檔名以區分檔案資料，並從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。

  

</details>


  

</details>


  

<details>
<summary>**mediaProcessing**：`string enum` 選填。模型如何處理這個 part 的媒體以進行理解。僅對影片 part（`inline_data` 或 MIME 類型為影片的 `file_data`）有意義；非影片 part 會忽略這個欄位。</summary>

  

  可能的值：

  - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型專屬的處理方式。
  - `STATIC`：固定速率擷取影格，所有影格都放入上下文。
  - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。

  

</details>


  

</details>


  **willContinue**：`boolean`

  選填。表示函式呼叫會繼續，並將傳回更多回應，使函式呼叫成為產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，後續回應將不予考慮。允許傳回空的 `response` 並搭配 `will_continue=False`，表示函式呼叫已完成。這仍可能觸發模型生成；若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。

  

<details>
<summary>**scheduling**：`string enum` 選填。指定回應應如何在對話中排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。</summary>

  

  可能的值：

  - `SCHEDULING_UNSPECIFIED`：這個值未使用。
  - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發生成。
  - `WHEN_IDLE`：將結果加入對話上下文，並提示生成輸出，但不中斷進行中的生成。
  - `INTERRUPT`：將結果加入對話上下文，中斷進行中的生成，並提示生成輸出。

  

</details>


  

</details>


  

<details>
<summary>**fileData**：`FileData` 以 URI 為基礎的資料。</summary>

  

  **fileUri**：必填 `string`

  URI。

  **mimeType**：`string`

  選填。來源資料的 IANA 標準 MIME 類型。

  **displayName**：`string`

  選填。指定用來向模型指稱這個檔案的名稱（例如「my_file.pdf」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案參照識別碼使用。

  

</details>


  

<details>
<summary>**executableCode**：`ExecutableCode` 由模型生成、預定要執行的程式碼。</summary>

  

  

<details>
<summary>**language**：必填 `string enum` `code` 的程式語言。</summary>

  

  可能的值：

  - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用這個值。
  - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 是預設語言。

  

</details>


  **code**：必填 `string`

  要執行的程式碼。

  **id**：`string`

  選填。`ExecutableCode` part 的唯一識別碼。伺服器傳回的 `CodeExecutionResult` 會帶有相符的 `id`。

  

</details>


  

<details>
<summary>**codeExecutionResult**：`CodeExecutionResult` 執行 `ExecutableCode` 的結果。</summary>

  

  

<details>
<summary>**outcome**：必填 `string enum` 程式碼執行的結果。</summary>

  

  可能的值：

  - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用這個值。
  - `OUTCOME_OK`：程式碼執行成功完成。`output` 包含標準輸出（如有）。
  - `OUTCOME_FAILED`：程式碼執行失敗。`output` 包含標準錯誤與標準輸出（如有）。
  - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已取消。可能有也可能沒有部分 `output`。

  

</details>


  **id**：`string`

  選填。這個結果所對應的 `ExecutableCode` part 的識別碼。僅在對應的 `ExecutableCode` 有 id 時才填入。

  **output**：`string`

  選填。程式碼執行成功時包含標準輸出，否則包含標準錯誤或其他說明。

  

</details>


  

<details>
<summary>**toolCall**：`ToolCall` 伺服器端工具呼叫。當模型預測某個工具叫用應在伺服器上執行時，會填入這個欄位。用戶端應將這則訊息原樣回傳給 API。</summary>

  

  

<details>
<summary>**toolType**：必填 `V1mainToolType` 被呼叫的工具類型。</summary>

  

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

  選填。工具呼叫的唯一識別碼。伺服器會傳回帶有相符 `id` 的工具回應。

  **toolName**：`string`

  選填。被呼叫的工具名稱。

  **args**：`object`

  選填。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}

  

</details>


  

<details>
<summary>**toolResponse**：`ToolResponse` 伺服器端 `ToolCall` 執行的輸出。這個欄位由用戶端填入，內容為執行對應 `ToolCall` 的結果。</summary>

  

  

<details>
<summary>**toolType**：必填 `V1mainToolType` 被呼叫的工具類型，與 `tool_type`（在對應的 `ToolCall` 中）相符。</summary>

  

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

  選填。這個回應所對應的工具呼叫識別碼。

  **response**：`object`

  選填。工具回應。

  

</details>


  

</details>


  

<details>
<summary>**metadata**：`Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定這個欄位，以設定每個 part 的靜態媒體預處理。</summary>

  

  Union 欄位 `metadata` 只能是下列其中之一：

  

<details>
<summary>**videoMetadata**：`VideoMetadata` 選填。影片中繼資料。僅當影片資料以 inline_data 或 file_data 呈現時，才應指定中繼資料。</summary>

  

  **startOffset**：`string`

  選填。影片的起始偏移。

  **endOffset**：`string`

  選填。影片的結束偏移。

  **fps**：`number`

  選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。

  

</details>


  

</details>


  **thought**：`boolean`

  選填。表示這個 part 是否為模型的思考內容。

  **thoughtSignature**：`string`

  選填。思考內容的不透明簽章，可在後續要求中重複使用。

  **partMetadata**：`object`

  與 Part 相關聯的自訂中繼資料。使用 genai.Part 作為內容表示法的代理，可能需要追蹤額外資訊。例如 Part 來源檔案／來源的名稱，或多工處理多個 Part 串流的方式。

  

<details>
<summary>**mediaResolution**：`V1mainMediaResolution` 選填。輸入媒體的媒體解析度。</summary>

  

  

<details>
<summary>**value**：`Union type` 媒體解析度等級。</summary>

  

  Union 欄位 `value` 只能是下列其中之一：

  

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
<summary>**mediaProcessing**：`string enum` 選填。模型如何處理這個 part 的媒體以進行理解。僅對影片 part（`inline_data` 或 MIME 類型為影片的 `file_data`）有意義；非影片 part 會忽略這個欄位。</summary>

  

  可能的值：

  - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型專屬的處理方式。
  - `STATIC`：固定速率擷取影格，所有影格都放入上下文。
  - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。

  

</details>


  

<details>
<summary>**audioTranscription**：`AudioTranscription` 選填。音訊（輸入或輸出）轉錄。僅當這個 Part 包含音訊資料時才設定。</summary>

  

  **text**：必填 `string`

  這個音訊片段的轉錄文字。

  **speakerLabel**：`string`

  選填。識別這個音訊片段說話者的標籤（例如「spk_1」、「spk_2」）。在設定說話者分離時出現。

  

<details>
<summary>**words**：`WordInfo array` 選填。詳細的單字層級轉錄與時間資訊。在設定 word_timestamp 時出現。</summary>

  

  **word**：必填 `string`

  單字的轉錄。

  **startOffset**：`string`

  選填。單字相對於音訊起始處的起始時間偏移。

  **endOffset**：`string`

  選填。單字相對於音訊起始處的結束時間偏移。

  

</details>


  

</details>


  

<details>
<summary>**speechMetadata**：`SpeechMetadata` 選填。套用到文字 part 的中繼資料，用來自訂其朗讀或合成方式，例如指定說話者身分或說話風格。</summary>

  

  **speaker**：`string`

  選填。多說話者合成時選用的說話者名稱。

  **style**：`string`

  選填。語音合成的風格指令（選填）。

  

</details>


  

</details>


  **role**：`string`

  選填。內容的產生者。必須是「user」或「model」。在多輪對話中設定很有用，否則可留空或不設定。

  

</details>


  

<details>
<summary>**systemInstruction**：`Content` 選填。開發人員設定的[系統指令](/docs/text-generation/#system-instructions)。目前僅支援文字。</summary>

  

  

<details>
<summary>**parts**：`Part array` 組成單一訊息的已排序 `Parts`。各 Part 的 MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type`</summary>

  

  Union 欄位 `data` 只能是下列其中之一：

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

  選填。指定用來向模型指稱這個 blob 的名稱（例如「my_blob.png」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 參照識別碼使用。

  

</details>


  

<details>
<summary>**functionCall**：`FunctionCall` 模型傳回的預測 `FunctionCall`，包含代表 `FunctionDeclaration.name` 的字串，以及引數與其值。</summary>

  

  **name**：必填 `string`

  要呼叫的函式名稱。必須由 a-z、A-Z、0-9 組成，或包含底線與破折號，長度上限為 128。

  **id**：`string`

  選填。函式呼叫的唯一識別碼。若有填入，用戶端應執行該 `function_call`，並傳回帶有相符 `id` 的回應。

  **args**：`object`

  選填。JSON 物件格式的函式參數與值。

  

</details>


  

<details>
<summary>**functionResponse**：`FunctionResponse` `FunctionCall` 的結果輸出，包含代表 `FunctionDeclaration.name` 的字串，以及含有函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。</summary>

  

  **name**：必填 `string`

  要呼叫的函式名稱。必須由 a-z、A-Z、0-9 組成，或包含底線與破折號，長度上限為 128。

  **response**：必填 `object`

  JSON 物件格式的函式回應。呼叫端可使用符合函式語法的任意鍵來傳回函式輸出，例如「output」、「result」等。特別是當函式呼叫執行失敗時，回應可包含「error」鍵，將錯誤詳情傳回給模型。多媒體內容可透過子物件納入，該子物件包含單一「$ref」鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，屬於持有該多媒體內容的 `FunctionResponsePart`。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

  **id**：`string`

  選填。這個回應所對應的函式呼叫識別碼。由用戶端填入，以比對對應的函式呼叫 `id`。

  

<details>
<summary>**parts**：`FunctionResponsePart array` 選填。組成函式回應的已排序 `Parts`。各 Part 的 IANA MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type` 函式回應 part 的資料。</summary>

  

  Union 欄位 `data` 只能是下列其中之一：

  

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

  選填。blob 的顯示名稱。用來提供標籤或檔名以區分各個 blob，並從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。

  

</details>


  

<details>
<summary>**fileData**：`FunctionResponseFileData` 以 URI 為基礎的資料。</summary>

  

  **fileUri**：必填 `string`

  URI。

  **mimeType**：`string`

  來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將傳回錯誤。完整支援類型清單請參閱[多模態函式回應](/docs/function-calling/#multimodal)與[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

  **displayName**：`string`

  選填。檔案的顯示名稱。用來提供標籤或檔名以區分檔案資料，並從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。

  

</details>


  

</details>


  

<details>
<summary>**mediaProcessing**：`string enum` 選填。模型如何處理這個 part 的媒體以進行理解。僅對影片 part（`inline_data` 或 MIME 類型為影片的 `file_data`）有意義；非影片 part 會忽略這個欄位。</summary>

  

  可能的值：

  - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型專屬的處理方式。
  - `STATIC`：固定速率擷取影格，所有影格都放入上下文。
  - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。

  

</details>


  

</details>


  **willContinue**：`boolean`

  選填。表示函式呼叫會繼續，並將傳回更多回應，使函式呼叫成為產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，後續回應將不予考慮。允許傳回空的 `response` 並搭配 `will_continue=False`，表示函式呼叫已完成。這仍可能觸發模型生成；若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。

  

<details>
<summary>**scheduling**：`string enum` 選填。指定回應應如何在對話中排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。</summary>

  

  可能的值：

  - `SCHEDULING_UNSPECIFIED`：這個值未使用。
  - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發生成。
  - `WHEN_IDLE`：將結果加入對話上下文，並提示生成輸出，但不中斷進行中的生成。
  - `INTERRUPT`：將結果加入對話上下文，中斷進行中的生成，並提示生成輸出。

  

</details>


  

</details>


  

<details>
<summary>**fileData**：`FileData` 以 URI 為基礎的資料。</summary>

  

  **fileUri**：必填 `string`

  URI。

  **mimeType**：`string`

  選填。來源資料的 IANA 標準 MIME 類型。

  **displayName**：`string`

  選填。指定用來向模型指稱這個檔案的名稱（例如「my_file.pdf」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案參照識別碼使用。

  

</details>


  

<details>
<summary>**executableCode**：`ExecutableCode` 由模型生成、預定要執行的程式碼。</summary>

  

  

<details>
<summary>**language**：必填 `string enum` `code` 的程式語言。</summary>

  

  可能的值：

  - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用這個值。
  - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 是預設語言。

  

</details>


  **code**：必填 `string`

  要執行的程式碼。

  **id**：`string`

  選填。`ExecutableCode` part 的唯一識別碼。伺服器傳回的 `CodeExecutionResult` 會帶有相符的 `id`。

  

</details>


  

<details>
<summary>**codeExecutionResult**：`CodeExecutionResult` 執行 `ExecutableCode` 的結果。</summary>

  

  

<details>
<summary>**outcome**：必填 `string enum` 程式碼執行的結果。</summary>

  

  可能的值：

  - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用這個值。
  - `OUTCOME_OK`：程式碼執行成功完成。`output` 包含標準輸出（如有）。
  - `OUTCOME_FAILED`：程式碼執行失敗。`output` 包含標準錯誤與標準輸出（如有）。
  - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已取消。可能有也可能沒有部分 `output`。

  

</details>


  **id**：`string`

  選填。這個結果所對應的 `ExecutableCode` part 的識別碼。僅在對應的 `ExecutableCode` 有 id 時才填入。

  **output**：`string`

  選填。程式碼執行成功時包含標準輸出，否則包含標準錯誤或其他說明。

  

</details>


  

<details>
<summary>**toolCall**：`ToolCall` 伺服器端工具呼叫。當模型預測某個工具叫用應在伺服器上執行時，會填入這個欄位。用戶端應將這則訊息原樣回傳給 API。</summary>

  

  

<details>
<summary>**toolType**：必填 `V1mainToolType` 被呼叫的工具類型。</summary>

  

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

  選填。工具呼叫的唯一識別碼。伺服器會傳回帶有相符 `id` 的工具回應。

  **toolName**：`string`

  選填。被呼叫的工具名稱。

  **args**：`object`

  選填。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}

  

</details>


  

<details>
<summary>**toolResponse**：`ToolResponse` 伺服器端 `ToolCall` 執行的輸出。這個欄位由用戶端填入，內容為執行對應 `ToolCall` 的結果。</summary>

  

  

<details>
<summary>**toolType**：必填 `V1mainToolType` 被呼叫的工具類型，與 `tool_type`（在對應的 `ToolCall` 中）相符。</summary>

  

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

  選填。這個回應所對應的工具呼叫識別碼。

  **response**：`object`

  選填。工具回應。

  

</details>


  

</details>


  

<details>
<summary>**metadata**：`Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定這個欄位，以設定每個 part 的靜態媒體預處理。</summary>

  

  Union 欄位 `metadata` 只能是下列其中之一：

  

<details>
<summary>**videoMetadata**：`VideoMetadata` 選填。影片中繼資料。僅當影片資料以 inline_data 或 file_data 呈現時，才應指定中繼資料。</summary>

  

  **startOffset**：`string`

  選填。影片的起始偏移。

  **endOffset**：`string`

  選填。影片的結束偏移。

  **fps**：`number`

  選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。

  

</details>


  

</details>


  **thought**：`boolean`

  選填。表示這個 part 是否為模型的思考內容。

  **thoughtSignature**：`string`

  選填。思考內容的不透明簽章，可在後續要求中重複使用。

  **partMetadata**：`object`

  與 Part 相關聯的自訂中繼資料。使用 genai.Part 作為內容表示法的代理，可能需要追蹤額外資訊。例如 Part 來源檔案／來源的名稱，或多工處理多個 Part 串流的方式。

  

<details>
<summary>**mediaResolution**：`V1mainMediaResolution` 選填。輸入媒體的媒體解析度。</summary>

  

  

<details>
<summary>**value**：`Union type` 媒體解析度等級。</summary>

  

  Union 欄位 `value` 只能是下列其中之一：

  

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
<summary>**mediaProcessing**：`string enum` 選填。模型如何處理這個 part 的媒體以進行理解。僅對影片 part（`inline_data` 或 MIME 類型為影片的 `file_data`）有意義；非影片 part 會忽略這個欄位。</summary>

  

  可能的值：

  - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型專屬的處理方式。
  - `STATIC`：固定速率擷取影格，所有影格都放入上下文。
  - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。

  

</details>


  

<details>
<summary>**audioTranscription**：`AudioTranscription` 選填。音訊（輸入或輸出）轉錄。僅當這個 Part 包含音訊資料時才設定。</summary>

  

  **text**：必填 `string`

  這個音訊片段的轉錄文字。

  **speakerLabel**：`string`

  選填。識別這個音訊片段說話者的標籤（例如「spk_1」、「spk_2」）。在設定說話者分離時出現。

  

<details>
<summary>**words**：`WordInfo array` 選填。詳細的單字層級轉錄與時間資訊。在設定 word_timestamp 時出現。</summary>

  

  **word**：必填 `string`

  單字的轉錄。

  **startOffset**：`string`

  選填。單字相對於音訊起始處的起始時間偏移。

  **endOffset**：`string`

  選填。單字相對於音訊起始處的結束時間偏移。

  

</details>


  

</details>


  

<details>
<summary>**speechMetadata**：`SpeechMetadata` 選填。套用到文字 part 的中繼資料，用來自訂其朗讀或合成方式，例如指定說話者身分或說話風格。</summary>

  

  **speaker**：`string`

  選填。多說話者合成時選用的說話者名稱。

  **style**：`string`

  選填。語音合成的風格指令（選填）。

  

</details>


  

</details>


  **role**：`string`

  選填。內容的產生者。必須是「user」或「model」。在多輪對話中設定很有用，否則可留空或不設定。

  

</details>


  

<details>
<summary>**tools**：`Tool array` 選填。`Tools` 清單，`Model` 可用來生成下一個回應。`Tool` 是一段程式碼，讓系統能與外部系統互動，以執行 `Model` 知識與範圍之外的動作（單一或一組）。支援的 `Tool` 為 `Function` 與 `code_execution`。詳情請參閱[函式呼叫](/docs/function-calling/)與[程式碼執行](/docs/code-execution/)指南。</summary>

  

  

<details>
<summary>**functionDeclarations**：`FunctionDeclaration array` 選填。模型可用於函式呼叫的 `FunctionDeclarations` 清單。模型或系統不會執行該函式；相反地，定義的函式可能以 FunctionCall 形式連同引數傳回給用戶端執行。模型可決定呼叫這些函式的子集，方式是在回應中填入 FunctionCall。下一個對話回合可能包含 FunctionResponse，其 Content.role 為「function」，作為下一個模型回合的生成上下文。</summary>

  

  **name**：必填 `string`

  函式的名稱。必須由 a-z、A-Z、0-9 組成，或包含底線、冒號、句點與破折號，長度上限為 128。

  **description**：必填 `string`

  函式的簡要說明。

  

<details>
<summary>**parameters**：`Schema` 選填。說明這個函式的參數。反映 Open API 3.03 Parameter Object：字串 Key 為參數名稱（參數名稱區分大小寫）；Schema Value 為定義該參數所用類型的 Schema。</summary>

  

  

<details>
<summary>**type**：必填 `Type` 資料類型。</summary>

  

  可能的值：

  - `TYPE_UNSPECIFIED`：未指定，不應使用。
  - `STRING`：字串類型。
  - `NUMBER`：數字類型。
  - `INTEGER`：整數類型。
  - `BOOLEAN`：布林類型。
  - `ARRAY`：陣列類型。
  - `OBJECT`：物件類型。
  - `NULL`：Null 類型。

  

</details>


  **format**：`string`

  選填。資料的格式。允許任意值，但大多數值不會觸發任何特殊功能。

  **title**：`string`

  選填。結構定義的標題。

  **description**：`string`

  選填。參數的簡要說明。可包含使用範例。參數說明可使用 Markdown 格式。

  **nullable**：`boolean`

  選填。表示值是否可為 null。

  **enum**：`string array`

  選填。Type.STRING 元素在 enum 格式下的可能值。例如，我們可以將 Enum Direction 定義為：{type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]}

  **items**：`Schema`

  選填。Type.ARRAY 元素的結構定義。

  **maxItems**：`string`

  選填。Type.ARRAY 的元素數量上限。

  **minItems**：`string`

  選填。Type.ARRAY 的元素數量下限。

  **properties**：`object`

  選填。Type.OBJECT 的屬性。

  **required**：`string array`

  選填。Type.OBJECT 的必填屬性。

  **minProperties**：`string`

  選填。Type.OBJECT 的屬性數量下限。

  **maxProperties**：`string`

  選填。Type.OBJECT 的屬性數量上限。

  **minimum**：`number`

  選填。TYPE INTEGER 與 NUMBER 的結構定義欄位：Type.INTEGER 與 Type.NUMBER 的最小值。

  **maximum**：`number`

  選填。Type.INTEGER 與 Type.NUMBER 的最大值。

  **minLength**：`string`

  選填。TYPE STRING 的結構定義欄位：Type.STRING 的最小長度。

  **maxLength**：`string`

  選填。Type.STRING 的最大長度。

  **pattern**：`string`

  選填。Type.STRING 的模式，用來將字串限制為正規表示式。

  **example**：`object`

  選填。物件的範例。僅在物件為根物件時填入。

  **anyOf**：`Schema array`

  選填。值應通過清單中任一（一個或多個）子結構定義的驗證。

  **propertyOrdering**：`string array`

  選填。屬性的順序。不是 Open API 規格的標準欄位。用來決定回應中屬性的順序。

  **default**：`object`

  選填。欄位的預設值。依 JSON Schema，這個欄位是供文件產生器使用，不影響驗證。因此這裡納入並忽略它，讓傳送帶有 `default` 欄位的結構定義的開發人員不會收到未知欄位錯誤。

  

</details>


  **parametersJsonSchema**：`object`

  選填。以 JSON Schema 格式說明這個函式的參數。結構定義必須描述一個物件，其屬性即為函式的參數。例如：`{ "type": "object", "properties": { "name": { "type": "string" }, "age": { "type": "integer" } }, "additionalProperties": false, "required": ["name", "age"], "propertyOrdering": ["name", "age"] }` 這個欄位與 `parameters` 互斥。

  

<details>
<summary>**response**：`Schema` 選填。以 JSON Schema 格式說明這個函式的輸出。反映 Open API 3.03 Response Object。Schema 定義函式回應值所使用的類型。</summary>

  

  

<details>
<summary>**type**：必填 `Type` 資料類型。</summary>

  

  可能的值：

  - `TYPE_UNSPECIFIED`：未指定，不應使用。
  - `STRING`：字串類型。
  - `NUMBER`：數字類型。
  - `INTEGER`：整數類型。
  - `BOOLEAN`：布林類型。
  - `ARRAY`：陣列類型。
  - `OBJECT`：物件類型。
  - `NULL`：Null 類型。

  

</details>


  **format**：`string`

  選填。資料的格式。允許任意值，但大多數值不會觸發任何特殊功能。

  **title**：`string`

  選填。結構定義的標題。

  **description**：`string`

  選填。參數的簡要說明。可包含使用範例。參數說明可使用 Markdown 格式。

  **nullable**：`boolean`

  選填。表示值是否可為 null。

  **enum**：`string array`

  選填。Type.STRING 元素在 enum 格式下的可能值。例如，我們可以將 Enum Direction 定義為：{type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]}

  **items**：`Schema`

  選填。Type.ARRAY 元素的結構定義。

  **maxItems**：`string`

  選填。Type.ARRAY 的元素數量上限。

  **minItems**：`string`

  選填。Type.ARRAY 的元素數量下限。

  **properties**：`object`

  選填。Type.OBJECT 的屬性。

  **required**：`string array`

  選填。Type.OBJECT 的必填屬性。

  **minProperties**：`string`

  選填。Type.OBJECT 的屬性數量下限。

  **maxProperties**：`string`

  選填。Type.OBJECT 的屬性數量上限。

  **minimum**：`number`

  選填。TYPE INTEGER 與 NUMBER 的結構定義欄位：Type.INTEGER 與 Type.NUMBER 的最小值。

  **maximum**：`number`

  選填。Type.INTEGER 與 Type.NUMBER 的最大值。

  **minLength**：`string`

  選填。TYPE STRING 的結構定義欄位：Type.STRING 的最小長度。

  **maxLength**：`string`

  選填。Type.STRING 的最大長度。

  **pattern**：`string`

  選填。Type.STRING 的模式，用來將字串限制為正規表示式。

  **example**：`object`

  選填。物件的範例。僅在物件為根物件時填入。

  **anyOf**：`Schema array`

  選填。值應通過清單中任一（一個或多個）子結構定義的驗證。

  **propertyOrdering**：`string array`

  選填。屬性的順序。不是 Open API 規格的標準欄位。用來決定回應中屬性的順序。

  **default**：`object`

  選填。欄位的預設值。依 JSON Schema，這個欄位是供文件產生器使用，不影響驗證。因此這裡納入並忽略它，讓傳送帶有 `default` 欄位的結構定義的開發人員不會收到未知欄位錯誤。

  

</details>


  **responseJsonSchema**：`object`

  選填。以 JSON Schema 格式說明這個函式的輸出。結構定義所指定的值即為函式的回應值。這個欄位與 `response` 互斥。

  

<details>
<summary>**behavior**：`string enum` 選填。指定函式的 Behavior。目前僅 BidiGenerateContent 方法支援。</summary>

  

  可能的值：

  - `UNSPECIFIED`：這個值未使用。
  - `BLOCKING`：若設定，系統會等待收到函式回應後才繼續對話。
  - `NON_BLOCKING`：若設定，系統不會等待函式回應；相反地，它會在使用者與模型的對話持續進行的同時，嘗試在函式回應可用時加以處理。

  

</details>


  

</details>


  

<details>
<summary>**googleSearchRetrieval**：`GoogleSearchRetrieval` 選填。由 Google 搜尋驅動的檢索工具。</summary>

  

  

<details>
<summary>**dynamicRetrievalConfig**：`DynamicRetrievalConfig` 指定指定來源的動態檢索設定。</summary>

  

  

<details>
<summary>**mode**：`string enum` 動態檢索所使用的預測器模式。</summary>

  

  可能的值：

  - `MODE_UNSPECIFIED`：一律觸發檢索。
  - `MODE_DYNAMIC`：僅在系統判定有必要時才執行檢索。

  

</details>


  **dynamicThreshold**：`number`

  動態檢索所使用的閾值。若未設定，將使用系統預設值。

  

</details>


  

</details>


  

<details>
<summary>**codeExecution**：`CodeExecution` 選填。讓模型能在生成過程中執行程式碼。</summary>

  

  

</details>


  

<details>
<summary>**googleSearch**：`GoogleSearch` 選填。GoogleSearch 工具類型。支援模型中的 Google 搜尋。由 Google 提供。</summary>

  

  

<details>
<summary>**timeRangeFilter**：`Interval` 選填。將搜尋結果篩選至特定時間範圍。若客戶設定了開始時間，就必須設定結束時間（反之亦然）。</summary>

  

  **startTime**：`string`

  選填。區間的起始（含）。若有指定，符合這個區間的 Timestamp 必須等於或晚於起始時間。

  **endTime**：`string`

  選填。區間的結束（不含）。若有指定，符合這個區間的 Timestamp 必須早於結束時間。

  

</details>


  

<details>
<summary>**searchTypes**：`SearchTypes` 選填。要啟用的搜尋類型集合。若未設定，預設啟用網頁搜尋。</summary>

  

  

<details>
<summary>**webSearch**：`WebSearch` 選填。啟用網頁搜尋。僅傳回文字結果。</summary>

  

  

</details>


  

<details>
<summary>**imageSearch**：`ImageSearch` 選填。啟用圖片搜尋。傳回圖片位元組。</summary>

  

  

</details>


  

</details>


  

</details>


  

<details>
<summary>**computerUse**：`ComputerUse` 選填。支援模型直接與電腦互動的工具。若啟用，會自動填入電腦使用專屬的函式宣告。</summary>

  

  

<details>
<summary>**environment**：必填 `string enum` 正在操作的環境。</summary>

  

  可能的值：

  - `ENVIRONMENT_UNSPECIFIED`：預設為瀏覽器。
  - `ENVIRONMENT_BROWSER`：在網頁瀏覽器中操作。
  - `ENVIRONMENT_MOBILE`：在行動環境中操作。
  - `ENVIRONMENT_DESKTOP`：在桌面環境中操作。

  

</details>


  **excludedPredefinedFunctions**：`string array`

  選填。依預設，預先定義的函式會納入最終的模型呼叫中。其中部分函式可明確排除，不自動納入。這有兩個目的：1. 使用更受限／不同的動作空間。2. 改進預先定義函式的定義／指令。

  **enablePromptInjectionDetection**：`boolean`

  選填。是否在電腦使用要求上啟用提示詞注入偵測檢查。

  

<details>
<summary>**disabledSafetyPolicies**：`string enum array` 選填。電腦使用停用的安全政策。</summary>

  

  可能的值：

  - `SAFETY_POLICY_UNSPECIFIED`：未指定的安全政策。
  - `FINANCIAL_TRANSACTIONS`：金融交易的安全政策。
  - `SENSITIVE_DATA_MODIFICATION`：敏感資料修改的安全政策。
  - `COMMUNICATION_TOOL`：通訊工具的安全政策（例如 Gmail、Chat、Meet）。
  - `ACCOUNT_CREATION`：帳號建立的安全政策。
  - `DATA_MODIFICATION`：資料修改的安全政策。
  - `USER_CONSENT_MANAGEMENT`：使用者同意管理的安全政策。
  - `LEGAL_TERMS_AND_AGREEMENTS`：法律條款與協議的安全政策。

  

</details>


  

</details>


  

<details>
<summary>**urlContext**：`UrlContext` 選填。支援 URL 上下文檢索的工具。</summary>

  

  

</details>


  

<details>
<summary>**fileSearch**：`FileSearch` 選填。FileSearch 工具類型。用來從 Semantic Retrieval 語料庫檢索知識的工具。</summary>

  

  **fileSearchStoreNames**：必填 `string array`

  要檢索的 file_search_stores 名稱。範例：`fileSearchStores/my-file-search-store-123`

  **topK**：`integer`

  選填。要檢索的語意檢索區塊數量。

  **metadataFilter**：`string`

  選填。要套用到語意檢索文件與區塊的中繼資料篩選條件。

  

</details>


  

<details>
<summary>**mcpServers**：`McpServer array` 選填。要連接的 MCP 伺服器。</summary>

  

  

<details>
<summary>**transport**：`Union type` 用來連接 MCPServer 的傳輸方式。</summary>

  

  Union 欄位 `transport` 只能是下列其中之一：

  

<details>
<summary>**streamableHttpTransport**：`StreamableHttpTransport` 可串流 HTTP 要求與回應的傳輸方式。</summary>

  

  **url**：`string`

  MCPServer 端點的完整 URL。範例：「https://api.example.com/mcp」

  **headers**：`object`

  選填：如有需要，用於驗證標頭、逾時等欄位。

  **timeout**：`string`

  一般作業的 HTTP 逾時。

  **sseReadTimeout**：`string`

  SSE 讀取作業的逾時。

  **terminateOnClose**：`boolean`

  傳輸關閉時是否關閉用戶端工作階段。

  

</details>


  

</details>


  **name**：`string`

  MCPServer 的名稱。

  

</details>


  

<details>
<summary>**googleMaps**：`GoogleMaps` 選填。讓模型的回應能以與使用者查詢相關的地理空間上下文接地的工具。</summary>

  

  **enableWidget**：`boolean`

  選填。是否在回應的 GroundingMetadata 中傳回 widget 上下文權杖。開發人員可使用 widget 上下文權杖，算繪帶有與模型在回應中提及的地點相關的地理空間上下文的 Google Maps widget。

  

</details>


  

</details>


  

<details>
<summary>**toolConfig**：`ToolConfig` 選填。要求中指定的任何 `Tool` 的工具設定。使用範例請參閱[函式呼叫指南](/docs/function-calling/#function_calling_modes)。</summary>

  

  

<details>
<summary>**functionCallingConfig**：`FunctionCallingConfig` 選填。函式呼叫設定。</summary>

  

  

<details>
<summary>**mode**：`string enum` 選填。指定函式呼叫應執行的模式。若未指定，預設值將設為 AUTO。</summary>

  

  可能的值：

  - `MODE_UNSPECIFIED`：未指定的函式呼叫模式。不應使用這個值。
  - `AUTO`：預設的模型行為，由模型決定要預測函式呼叫還是自然語言回應。
  - `ANY`：模型被限制為一律只預測函式呼叫。若設定了「allowed_function_names」，預測的函式呼叫將限於「allowed_function_names」其中之一；否則預測的函式呼叫將是所提供的「function_declarations」其中之一。
  - `NONE`：模型不會預測任何函式呼叫。模型行為與未傳入任何函式宣告時相同。
  - `VALIDATED`：模型決定要預測函式呼叫還是自然語言回應，但會以受限解碼驗證函式呼叫。若設定了「allowed_function_names」，預測的函式呼叫將限於「allowed_function_names」其中之一；否則預測的函式呼叫將是所提供的「function_declarations」其中之一。

  

</details>


  **allowedFunctionNames**：`string array`

  選填。一組函式名稱，提供時可限制模型將呼叫的函式。僅應在 Mode 為 ANY 或 VALIDATED 時設定。函式名稱應與 [FunctionDeclaration.name] 相符。設定後，模型只會從允許的函式名稱中預測函式呼叫。

  

</details>


  

<details>
<summary>**retrievalConfig**：`RetrievalConfig` 選填。檢索設定。</summary>

  

  

<details>
<summary>**latLng**：`LatLng` 選填。使用者的位置。</summary>

  

  **latitude**：`number`

  緯度（度）。必須介於 [-90.0, +90.0] 範圍內。

  **longitude**：`number`

  經度（度）。必須介於 [-180.0, +180.0] 範圍內。

  

</details>


  **languageCode**：`string`

  選填。使用者的語言代碼。內容的語言代碼。使用 [BCP47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) 定義的語言標籤。

  

</details>


  **includeServerSideToolInvocations**：`boolean`

  選填。若為 true，API 回應將在 `Content` 訊息中包含伺服器端工具呼叫與回應。這讓用戶端能觀察伺服器的工具互動。

  

</details>


  

<details>
<summary>**safetySettings**：`SafetySetting array` 選填。用來封鎖不安全內容的一組不重複的 `SafetySetting` 執行個體。這將在 `GenerateContentRequest.contents` 與 `GenerateContentResponse.candidates` 上強制執行。每個 `SafetyCategory` 類型不應有多於一個設定。API 會封鎖任何未達到這些設定所定閾值的內容與回應。這份清單會覆寫 safety_settings 中指定的每個 `SafetyCategory` 的預設設定。若清單中沒有 `SafetySetting` 對應給定的 `SafetyCategory`，API 將使用該類別的預設安全設定。支援的有害類別為 HARM_CATEGORY_HATE_SPEECH、HARM_CATEGORY_SEXUALLY_EXPLICIT、HARM_CATEGORY_DANGEROUS_CONTENT、HARM_CATEGORY_HARASSMENT、HARM_CATEGORY_CIVIC_INTEGRITY、HARM_CATEGORY_JAILBREAK。可用安全設定的詳細資訊請參閱[指南](/docs/safety-settings/)。另請參閱[安全指南](/docs/safety-guidance/)，了解如何將安全考量納入你的 AI 應用程式。</summary>

  

  

<details>
<summary>**category**：必填 `HarmCategory` 這個設定的類別。</summary>

  

  可能的值：

  - `HARM_CATEGORY_UNSPECIFIED`：未指定類別。
  - `HARM_CATEGORY_HARASSMENT`：**Gemini** - 騷擾內容。
  - `HARM_CATEGORY_HATE_SPEECH`：**Gemini** - 仇恨言論與內容。
  - `HARM_CATEGORY_SEXUALLY_EXPLICIT`：**Gemini** - 性露骨內容。
  - `HARM_CATEGORY_DANGEROUS_CONTENT`：**Gemini** - 危險內容。
  - `HARM_CATEGORY_JAILBREAK`：**Gemini** - 試圖繞過或顛覆模型安全準則的提示詞（越獄嘗試）。

  

</details>


  

<details>
<summary>**threshold**：必填 `string enum` 控制封鎖有害內容的機率閾值。</summary>

  

  可能的值：

  - `HARM_BLOCK_THRESHOLD_UNSPECIFIED`：未指定閾值。
  - `BLOCK_LOW_AND_ABOVE`：NEGLIGIBLE 的內容將被允許。
  - `BLOCK_MEDIUM_AND_ABOVE`：NEGLIGIBLE 與 LOW 的內容將被允許。
  - `BLOCK_ONLY_HIGH`：NEGLIGIBLE、LOW 與 MEDIUM 的內容將被允許。
  - `BLOCK_NONE`：所有內容都將被允許。
  - `OFF`：關閉安全篩選器。

  

</details>


  

</details>


  

<details>
<summary>**generationConfig**：`GenerationConfig` 選填。模型生成與輸出的設定選項。</summary>

  

  **candidateCount**：`integer`

  選填。要傳回的生成回應數量。若未設定，預設為 1。請注意，這對前一代模型（Gemini 1.0 系列）不適用。

  **stopSequences**：`string array`

  選填。會停止輸出生成的字元序列集合（最多 5 個）。若有指定，API 會在 `stop_sequence` 首次出現時停止。停止序列不會包含在回應中。

  **maxOutputTokens**：`integer`

  選填。要包含在回應候選中的權杖數量上限。注意：預設值依模型而異，請參閱 `Model.output_token_limit` 屬性；該 `Model` 是由 `getModel` 函式傳回的。

  **temperature**：`number`

  選填。控制輸出的隨機性。注意：預設值依模型而異，請參閱 `Model.temperature` 屬性；該 `Model` 是由 `getModel` 函式傳回的。值可介於 [0.0, 2.0]。這個欄位在 Gemini 3.6 Flash 及更新的模型上已不再支援，會被靜默忽略。

  **topP**：`number`

  選填。取樣時要考量的權杖累積機率上限。模型使用 Top-k 與 Top-p（nucleus）合併取樣。權杖會依其指派的機率排序，只考量最有可能的權杖。Top-k 取樣直接限制要考量的權杖數量上限，而 Nucleus 取樣則依累積機率限制權杖數量。注意：預設值依 `Model` 而異，由 `Model.top_p` 屬性指定，該屬性由 `getModel` 函式傳回。空的 `top_k` 屬性表示模型不套用 top-k 取樣，也不允許在要求上設定 `top_k`。這個欄位在 Gemini 3.6 Flash 及更新的模型上已不再支援，會被靜默忽略。

  **topK**：`integer`

  選填。取樣時要考量的權杖數量上限。Gemini 模型使用 Top-p（nucleus）取樣，或 Top-k 與 nucleus 取樣的組合。Top-k 取樣考量最有可能的 `top_k` 個權杖集合。使用 nucleus 取樣的模型不允許設定 top_k。注意：預設值依 `Model` 而異，由 `Model.top_p` 屬性指定，該屬性由 `getModel` 函式傳回。空的 `top_k` 屬性表示模型不套用 top-k 取樣，也不允許在要求上設定 `top_k`。這個欄位在 Gemini 3.6 Flash 及更新的模型上已不再支援，會被靜默忽略。

  **seed**：`integer`

  選填。解碼所使用的種子。若未設定，要求會使用隨機生成的種子。

  **responseMimeType**：`string`

  選填。生成的候選文字的 MIME 類型。支援的 MIME 類型為：`text/plain`：（預設）文字輸出。`application/json`：回應候選中的 JSON 回應。`text/x.enum`：回應候選中以字串形式呈現的 ENUM 回應。所有支援的文字 MIME 類型清單請參閱[文件](/docs/file-input-methods/#text-file-types)。

  **responseJsonSchema**：`object`

  選填。內部細節。請使用 `responseJsonSchema` 而非這個欄位。

  **presencePenalty**：`number`

  選填。若權杖已在回應中出現，套用到下一個權杖 logprobs 的存在懲罰。這個懲罰是二元的開／關，不取決於權杖的使用次數（首次之後）。若需要隨每次使用而增加的懲罰，請使用 frequency_penalty。正懲罰會抑制使用已在回應中使用過的權杖，增加詞彙量；負懲罰會鼓勵使用已在回應中使用過的權杖，減少詞彙量。

  **frequencyPenalty**：`number`

  選填。套用到下一個權杖 logprobs 的頻率懲罰，乘以每個權杖到目前為止在回應中出現的次數。正懲罰會抑制使用已使用過的權杖，程度與權杖的使用次數成比例：權杖用得越多，模型再次使用該權杖的難度越高，從而增加回應的詞彙量。注意：*負*懲罰會鼓勵模型重複使用權杖，程度與權杖的使用次數成比例。小的負值會減少回應的詞彙量；較大的負值會使模型開始重複一個常見權杖，直到達到 max_output_tokens 上限。

  **responseLogprobs**：`boolean`

  選填。若為 true，在回應中匯出 logprobs 結果。

  **logprobs**：`integer`

  選填。僅在 response_logprobs=True 時有效。這會設定在每個解碼步驟中，於 Candidate.logprobs_result 中傳回的最高 logprobs 數量（含所選候選）。數字必須介於 [0, 20] 範圍內。

  **enableEnhancedCivicAnswers**：`boolean`

  選填。啟用增強的公民答覆。可能不適用於所有模型。

  

<details>
<summary>**responseModalities**：`string enum array` 選填。要求的回應模態。代表模型可傳回且應在回應中預期出現的模態集合。這與回應的模態完全相符。模型可能有多種支援模態的組合。若要求的模態不符合任何支援的組合，將傳回錯誤。空清單等同於僅要求文字。</summary>

  

  可能的值：

  - `MODALITY_UNSPECIFIED`：預設值。
  - `TEXT`：表示模型應傳回文字。
  - `IMAGE`：表示模型應傳回圖片。
  - `AUDIO`：表示模型應傳回音訊。

  

</details>


  

<details>
<summary>**speechConfig**：`SpeechConfig` 選填。語音生成設定。</summary>

  

  

<details>
<summary>**voiceConfig**：`VoiceConfig` 單一語音輸出情況下的設定。</summary>

  

  

<details>
<summary>**voiceConfig**：`Union type` 要使用的說話者設定。</summary>

  

  Union 欄位 `voiceConfig` 只能是下列其中之一：

  

<details>
<summary>**prebuiltVoiceConfig**：`PrebuiltVoiceConfig` 要使用的預建語音設定。</summary>

  

  **voiceName**：`string`

  選填。要使用的預設語音名稱。

  

</details>


  **voice**：`string`

  選填。用於合成的說話者識別碼。支援的格式：

  - 預建語音的說話者名稱（例如 `Orus` 或 `Kore`）。
  - 已儲存語音的語音 ID（例如 `voice_xxx`）。
  - 語音複製金鑰（例如 `voicekey_xxx`）。

  

</details>


  

</details>


  

<details>
<summary>**multiSpeakerVoiceConfig**：`MultiSpeakerVoiceConfig` 選填。多說話者設定的設定。與 voice_config 欄位互斥。</summary>

  

  

<details>
<summary>**speakerVoiceConfigs**：必填 `SpeakerVoiceConfig array` 所有啟用的說話者語音。</summary>

  

  **speaker**：必填 `string`

  要使用的說話者名稱。應與提示詞中的名稱相同。

  

<details>
<summary>**voiceConfig**：必填 `VoiceConfig` 要使用的語音設定。</summary>

  

  

<details>
<summary>**voiceConfig**：`Union type` 要使用的說話者設定。</summary>

  

  Union 欄位 `voiceConfig` 只能是下列其中之一：

  

<details>
<summary>**prebuiltVoiceConfig**：`PrebuiltVoiceConfig` 要使用的預建語音設定。</summary>

  

  **voiceName**：`string`

  選填。要使用的預設語音名稱。

  

</details>


  **voice**：`string`

  選填。用於合成的說話者識別碼。支援的格式：

  - 預建語音的說話者名稱（例如 `Orus` 或 `Kore`）。
  - 已儲存語音的語音 ID（例如 `voice_xxx`）。
  - 語音複製金鑰（例如 `voicekey_xxx`）。

  

</details>


  

</details>


  

</details>


  

</details>


  **languageCode**：`string`

  選填。使用者將應用程式設定為使用的 IETF [BCP-47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) 語言代碼。用於語音辨識與合成。有效值為：`de-DE`、`en-AU`、`en-GB`、`en-IN`、`en-US`、`es-US`、`fr-FR`、`hi-IN`、`pt-BR`、`ar-XA`、`es-ES`、`fr-CA`、`id-ID`、`it-IT`、`ja-JP`、`tr-TR`、`vi-VN`、`bn-IN`、`gu-IN`、`kn-IN`、`ml-IN`、`mr-IN`、`ta-IN`、`te-IN`、`nl-NL`、`ko-KR`、`cmn-CN`、`pl-PL`、`ru-RU` 與 `th-TH`。

  

</details>


  

<details>
<summary>**thinkingConfig**：`ThinkingConfig` 選填。思考功能的設定。若對不支援思考的模型設定這個欄位，將傳回錯誤。</summary>

  

  **includeThoughts**：`boolean`

  表示是否在回應中包含思考內容。若為 true，僅在思考內容可用時才傳回。

  **thinkingBudget**：`integer`

  模型應生成的思考權杖數量。

  

<details>
<summary>**thinkingLevel**：`string enum` 選填。控制模型在產生回應之前，內部推理程序的最大深度。預設值依模型而定。詳情請參閱[思考等級指南](/docs/thinking/#thinking-levels)。建議用於 Gemini 3 或更新的模型；用於較早的模型會導致錯誤。</summary>

  

  可能的值：

  - `THINKING_LEVEL_UNSPECIFIED`：預設值。
  - `MINIMAL`：幾乎不思考。
  - `LOW`：低思考等級。
  - `MEDIUM`：中思考等級。
  - `HIGH`：高思考等級。
  - `XHIGH`：超高思考等級。

  

</details>


  

</details>


  

<details>
<summary>**imageConfig**：`ImageConfig` 選填。圖片生成的設定。若對不支援這些設定選項的模型設定這個欄位，將傳回錯誤。</summary>

  

  **aspectRatio**：`string`

  選填。要生成的圖片長寬比。支援的長寬比：`1:1`、`1:4`、`4:1`、`1:8`、`8:1`、`2:3`、`3:2`、`3:4`、`4:3`、`4:5`、`5:4`、`9:16`、`16:9` 或 `21:9`。若未指定，模型會依所提供的任何參照圖片選擇預設長寬比。

  **imageSize**：`string`

  選填。指定生成圖片的大小。支援的值為 `512`、`1K`、`2K`、`4K`。若未指定，模型會使用預設值 `1K`。

  

</details>


  

<details>
<summary>**mediaResolution**：`string enum` 選填。若有指定，將使用指定的媒體解析度。</summary>

  

  可能的值：

  - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
  - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低（64 個權杖）。
  - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中（256 個權杖）。
  - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高（以 256 個權杖縮放重新取景）。

  

</details>


  **enableAffectiveDialog**：`boolean`

  選填。若啟用，模型將偵測情緒並相應調整其回應。

  

<details>
<summary>**responseFormat**：`ResponseFormatConfig` 選填。回應輸出格式的設定。允許以扁平結構指定每種模態（文字、音訊、圖片）的輸出設定。</summary>

  

  

<details>
<summary>**text**：`TextResponseFormat` 選填。文字輸出格式設定。</summary>

  

  

<details>
<summary>**mimeType**：`string enum` 選填。文字輸出的 MIME 類型。</summary>

  

  可能的值：

  - `MIME_TYPE_UNSPECIFIED`：預設值。這個值未使用。
  - `APPLICATION_JSON`：JSON 輸出格式。
  - `TEXT_PLAIN`：純文字輸出格式。

  

</details>


  **schema**：`object`

  選填。輸出應符合的 JSON 結構定義。僅在 mime_type 為 APPLICATION_JSON 時適用。

  

</details>


  

<details>
<summary>**audio**：`AudioResponseFormat` 選填。音訊輸出格式設定。</summary>

  

  

<details>
<summary>**mimeType**：`string enum` 選填。音訊輸出的 MIME 類型。</summary>

  

  可能的值：

  - `MIME_TYPE_UNSPECIFIED`：預設值。這個值未使用。
  - `AUDIO_MP3`：MP3 音訊格式。
  - `AUDIO_OGG_OPUS`：OGG Opus 音訊格式。
  - `AUDIO_L16`：原始 PCM（L16）音訊格式。
  - `AUDIO_WAV`：WAV 音訊格式。
  - `AUDIO_ALAW`：A-law 音訊格式。
  - `AUDIO_MULAW`：Mu-law 音訊格式。

  

</details>


  

<details>
<summary>**delivery**：`string enum` 選填。音訊輸出的傳遞模式。</summary>

  

  可能的值：

  - `DELIVERY_UNSPECIFIED`：預設值。這個值未使用。
  - `INLINE`：音訊資料在回應中行內傳回。
  - `URI`：音訊資料以 URI 形式傳回。

  

</details>


  **sampleRate**：`integer`

  選填。取樣率（Hz）。

  **bitRate**：`integer`

  選填。位元率（位元／秒，bps）。僅適用於壓縮格式（MP3、Opus）。

  

</details>


  

<details>
<summary>**image**：`ImageResponseFormat` 選填。圖片輸出格式設定。</summary>

  

  

<details>
<summary>**mimeType**：`string enum` 選填。圖片輸出的 MIME 類型。</summary>

  

  可能的值：

  - `MIME_TYPE_UNSPECIFIED`：預設值。這個值未使用。
  - `IMAGE_JPEG`：JPEG 圖片格式。

  

</details>


  

<details>
<summary>**delivery**：`string enum` 選填。圖片輸出的傳遞模式。</summary>

  

  可能的值：

  - `DELIVERY_UNSPECIFIED`：預設值。這個值未使用。
  - `INLINE`：圖片資料在回應中行內傳回。
  - `URI`：圖片資料以 URI 形式傳回。

  

</details>


  

<details>
<summary>**aspectRatio**：`string enum` 選填。圖片輸出的長寬比。</summary>

  

  可能的值：

  - `ASPECT_RATIO_UNSPECIFIED`：預設值。這個值未使用。
  - `ASPECT_RATIO_ONE_BY_ONE`：1:1 長寬比。
  - `ASPECT_RATIO_TWO_BY_THREE`：2:3 長寬比。
  - `ASPECT_RATIO_THREE_BY_TWO`：3:2 長寬比。
  - `ASPECT_RATIO_THREE_BY_FOUR`：3:4 長寬比。
  - `ASPECT_RATIO_FOUR_BY_THREE`：4:3 長寬比。
  - `ASPECT_RATIO_FOUR_BY_FIVE`：4:5 長寬比。
  - `ASPECT_RATIO_FIVE_BY_FOUR`：5:4 長寬比。
  - `ASPECT_RATIO_NINE_BY_SIXTEEN`：9:16 長寬比。
  - `ASPECT_RATIO_SIXTEEN_BY_NINE`：16:9 長寬比。
  - `ASPECT_RATIO_TWENTY_ONE_BY_NINE`：21:9 長寬比。
  - `ASPECT_RATIO_ONE_BY_EIGHT`：1:8 長寬比。
  - `ASPECT_RATIO_EIGHT_BY_ONE`：8:1 長寬比。
  - `ASPECT_RATIO_ONE_BY_FOUR`：1:4 長寬比。
  - `ASPECT_RATIO_FOUR_BY_ONE`：4:1 長寬比。

  

</details>


  

<details>
<summary>**imageSize**：`string enum` 選填。圖片輸出的大小。</summary>

  

  可能的值：

  - `IMAGE_SIZE_UNSPECIFIED`：預設值。這個值未使用。
  - `IMAGE_SIZE_FIVE_TWELVE`：512px 圖片大小。
  - `IMAGE_SIZE_ONE_K`：1K 圖片大小。
  - `IMAGE_SIZE_TWO_K`：2K 圖片大小。
  - `IMAGE_SIZE_FOUR_K`：4K 圖片大小。

  

</details>


  

</details>


  

</details>


  

<details>
<summary>**translationConfig**：`TranslationConfig` 選填。翻譯設定。</summary>

  

  **targetLanguageCode**：必填 `string`

  翻譯的目標語言。支援的值為 BCP-47 語言代碼（例如「en」、「es」、「fr」）。

  **echoTargetLanguage**：`boolean`

  選填。若為 true，當目標語言被說出時，模型將生成音訊，本質上是鸚鵡學舌般重複輸入。若為 false，我們不會為目標語言產生音訊。

  

</details>


  

<details>
<summary>**audioTranscriptionConfig**：`AudioTranscriptionConfig` 選填。音訊轉錄（語音辨識）設定。</summary>

  

  **languageCodes**：`string array`

  選填。提供音訊中出現語言提示的 BCP-47 語言代碼。若省略或為空，預設為自動語言偵測。

  **customVocabulary**：`string array`

  選填。自訂詞彙片語清單，用來使語音辨識模型偏向辨識特定詞彙（產品名稱、專有名詞、術語）。

  **wordTimestamp**：`boolean`

  選填。設定單字層級時間戳記的生成。

  **diarization**：`boolean`

  選填。設定說話者分離。

  **sourceText**：`string`

  選填。要透過語音指令編輯或改寫的來源文字。在 `SMART` 模式下提供時，模型會以這段文字評估音訊輸入，並在候選回應中發出完整的替代文字，而不是附加到其後。

  

<details>
<summary>**mode**：`string enum` 選填。設定轉錄模式。支援的值：`VERBATIM`、`SMART`。若未指定，預設為 `VERBATIM` 轉錄。在 `SMART` 模式下，模型會執行不流暢內容移除（消除填充詞、重複與錯誤開頭）、輕度文法清理、自動格式化（段落、項目符號、編號清單），以及輕微的使用者編輯（行內自我修正）。時間戳記與說話者分離與 `SMART` 模式不相容。</summary>

  

  可能的值：

  - `MODE_UNSPECIFIED`：未指定的轉錄模式。
  - `VERBATIM`：逐字轉錄模式。
  - `SMART`：智慧轉錄模式。

  

</details>


  

</details>


  

</details>


  **cachedContent**：`string`

  選填。用來作為提供預測的上下文的[已快取](/docs/caching/)內容名稱。格式：`cachedContents/{cachedContent}`

  

<details>
<summary>**serviceTier**：[`ServiceTier`](/api-reference/batch-api/#Resource:ServiceTier) 選填。要求的服務層級。</summary>

  

  可能的值：

  - `unspecified`：預設服務層級，即標準層級。
  - `standard`：標準服務層級。
  - `flex`：Flex 服務層級。
  - `priority`：Priority 服務層級。

  

</details>


  **store**：`boolean`

  選填。設定指定要求的記錄行為。若有設定，優先於專案層級的記錄設定。

  **continuationToken**：`string`

  選填。不透明的接續權杖，用來從先前的 `GenerateContent` 或 `StreamGenerateContent` 回應繼續生成，該回應是以 `finish_reason` 設為 `CONTINUATION` 而停止的。注意，在要求中提供接續權杖時，`contents` 為必填，且必須與初始要求的提示詞與對話記錄完全相同。

  **labels**：`object`

  選填。帶有使用者定義中繼資料的要求標籤。選填。標籤必須遵循標準統一的 Cloud 標籤要求：

  - 標籤鍵必須以字母開頭。
  - 標籤鍵與值的長度不得超過 63 個字元（Unicode 碼位），且只能包含小寫字母、數字字元、底線與破折號。
  - 允許國際字元。

  用法：

  - 來自彙總器的安全識別碼：使用鍵 `safety_identifier`（例如 `{"safety_identifier": "user_session_123"}`）

  

</details>


  **metadata**：`object`

  選填。要與要求相關聯的中繼資料。

  

</details>


  

</details>


  

</details>


  

</details>


  

---


  **name**：`string`

  僅輸出。識別碼。批次的資源名稱。格式：`batches/{batch_id}`。

  

---


  

<details>
<summary>**output**：`GenerateContentBatchOutput` 僅輸出。批次要求的輸出。</summary>

  

  

<details>
<summary>**output**：`Union type` 批次要求的輸出。</summary>

  

  Union 欄位 `output` 只能是下列其中之一：

  **responsesFile**：`string`

  僅輸出。包含回應的檔案的檔案 ID。該檔案為 JSONL 檔案，每行一個回應。回應將是 JSON 格式的 `GenerateContentResponse` 訊息。回應的寫入順序與輸入要求相同。

  

<details>
<summary>**inlinedResponses**：`InlinedResponses` 僅輸出。對批次中要求的回應。當批次是使用行內要求建立時傳回。回應的順序與輸入要求相同。</summary>

  

  

<details>
<summary>**inlinedResponses**：`InlinedResponse array` 僅輸出。對批次中要求的回應。</summary>

  

  

<details>
<summary>**output**：`Union type` 要求的輸出。</summary>

  

  Union 欄位 `output` 只能是下列其中之一：

  

<details>
<summary>**error**：`Status` 僅輸出。處理要求時遇到的錯誤。</summary>

  

  **code**：`integer`

  狀態碼，應為 google.rpc.Code 的列舉值。

  **message**：`string`

  面向開發人員的錯誤訊息，應以英文撰寫。任何面向使用者的錯誤訊息都應本地化，並在 google.rpc.Status.details 欄位中傳送，或由用戶端本地化。

  **details**：`object array`

  帶有錯誤詳情的訊息清單。API 有一組通用的訊息類型可供使用。

  

</details>


  

<details>
<summary>**response**：`GenerateContentResponse` 僅輸出。對要求的回應。</summary>

  

  

<details>
<summary>**candidates**：`Candidate array` 來自模型的候選回應。</summary>

  

  **index**：`integer`

  僅輸出。候選在回應候選清單中的索引。

  

<details>
<summary>**content**：`Content` 僅輸出。模型傳回的生成內容。</summary>

  

  

<details>
<summary>**parts**：`Part array` 組成單一訊息的已排序 `Parts`。各 Part 的 MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type`</summary>

  

  Union 欄位 `data` 只能是下列其中之一：

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

  選填。指定用來向模型指稱這個 blob 的名稱（例如「my_blob.png」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 參照識別碼使用。

  

</details>


  

<details>
<summary>**functionCall**：`FunctionCall` 模型傳回的預測 `FunctionCall`，包含代表 `FunctionDeclaration.name` 的字串，以及引數與其值。</summary>

  

  **name**：必填 `string`

  要呼叫的函式名稱。必須由 a-z、A-Z、0-9 組成，或包含底線與破折號，長度上限為 128。

  **id**：`string`

  選填。函式呼叫的唯一識別碼。若有填入，用戶端應執行該 `function_call`，並傳回帶有相符 `id` 的回應。

  **args**：`object`

  選填。JSON 物件格式的函式參數與值。

  

</details>


  

<details>
<summary>**functionResponse**：`FunctionResponse` `FunctionCall` 的結果輸出，包含代表 `FunctionDeclaration.name` 的字串，以及含有函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。</summary>

  

  **name**：必填 `string`

  要呼叫的函式名稱。必須由 a-z、A-Z、0-9 組成，或包含底線與破折號，長度上限為 128。

  **response**：必填 `object`

  JSON 物件格式的函式回應。呼叫端可使用符合函式語法的任意鍵來傳回函式輸出，例如「output」、「result」等。特別是當函式呼叫執行失敗時，回應可包含「error」鍵，將錯誤詳情傳回給模型。多媒體內容可透過子物件納入，該子物件包含單一「$ref」鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，屬於持有該多媒體內容的 `FunctionResponsePart`。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

  **id**：`string`

  選填。這個回應所對應的函式呼叫識別碼。由用戶端填入，以比對對應的函式呼叫 `id`。

  

<details>
<summary>**parts**：`FunctionResponsePart array` 選填。組成函式回應的已排序 `Parts`。各 Part 的 IANA MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type` 函式回應 part 的資料。</summary>

  

  Union 欄位 `data` 只能是下列其中之一：

  

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

  選填。blob 的顯示名稱。用來提供標籤或檔名以區分各個 blob，並從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。

  

</details>


  

<details>
<summary>**fileData**：`FunctionResponseFileData` 以 URI 為基礎的資料。</summary>

  

  **fileUri**：必填 `string`

  URI。

  **mimeType**：`string`

  來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將傳回錯誤。完整支援類型清單請參閱[多模態函式回應](/docs/function-calling/#multimodal)與[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

  **displayName**：`string`

  選填。檔案的顯示名稱。用來提供標籤或檔名以區分檔案資料，並從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。

  

</details>


  

</details>


  

<details>
<summary>**mediaProcessing**：`string enum` 選填。模型如何處理這個 part 的媒體以進行理解。僅對影片 part（`inline_data` 或 MIME 類型為影片的 `file_data`）有意義；非影片 part 會忽略這個欄位。</summary>

  

  可能的值：

  - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型專屬的處理方式。
  - `STATIC`：固定速率擷取影格，所有影格都放入上下文。
  - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。

  

</details>


  

</details>


  **willContinue**：`boolean`

  選填。表示函式呼叫會繼續，並將傳回更多回應，使函式呼叫成為產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，後續回應將不予考慮。允許傳回空的 `response` 並搭配 `will_continue=False`，表示函式呼叫已完成。這仍可能觸發模型生成；若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。

  

<details>
<summary>**scheduling**：`string enum` 選填。指定回應應如何在對話中排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。</summary>

  

  可能的值：

  - `SCHEDULING_UNSPECIFIED`：這個值未使用。
  - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發生成。
  - `WHEN_IDLE`：將結果加入對話上下文，並提示生成輸出，但不中斷進行中的生成。
  - `INTERRUPT`：將結果加入對話上下文，中斷進行中的生成，並提示生成輸出。

  

</details>


  

</details>


  

<details>
<summary>**fileData**：`FileData` 以 URI 為基礎的資料。</summary>

  

  **fileUri**：必填 `string`

  URI。

  **mimeType**：`string`

  選填。來源資料的 IANA 標準 MIME 類型。

  **displayName**：`string`

  選填。指定用來向模型指稱這個檔案的名稱（例如「my_file.pdf」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案參照識別碼使用。

  

</details>


  

<details>
<summary>**executableCode**：`ExecutableCode` 由模型生成、預定要執行的程式碼。</summary>

  

  

<details>
<summary>**language**：必填 `string enum` `code` 的程式語言。</summary>

  

  可能的值：

  - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用這個值。
  - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 是預設語言。

  

</details>


  **code**：必填 `string`

  要執行的程式碼。

  **id**：`string`

  選填。`ExecutableCode` part 的唯一識別碼。伺服器傳回的 `CodeExecutionResult` 會帶有相符的 `id`。

  

</details>


  

<details>
<summary>**codeExecutionResult**：`CodeExecutionResult` 執行 `ExecutableCode` 的結果。</summary>

  

  

<details>
<summary>**outcome**：必填 `string enum` 程式碼執行的結果。</summary>

  

  可能的值：

  - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用這個值。
  - `OUTCOME_OK`：程式碼執行成功完成。`output` 包含標準輸出（如有）。
  - `OUTCOME_FAILED`：程式碼執行失敗。`output` 包含標準錯誤與標準輸出（如有）。
  - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已取消。可能有也可能沒有部分 `output`。

  

</details>


  **id**：`string`

  選填。這個結果所對應的 `ExecutableCode` part 的識別碼。僅在對應的 `ExecutableCode` 有 id 時才填入。

  **output**：`string`

  選填。程式碼執行成功時包含標準輸出，否則包含標準錯誤或其他說明。

  

</details>


  

<details>
<summary>**toolCall**：`ToolCall` 伺服器端工具呼叫。當模型預測某個工具叫用應在伺服器上執行時，會填入這個欄位。用戶端應將這則訊息原樣回傳給 API。</summary>

  

  

<details>
<summary>**toolType**：必填 `V1mainToolType` 被呼叫的工具類型。</summary>

  

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

  選填。工具呼叫的唯一識別碼。伺服器會傳回帶有相符 `id` 的工具回應。

  **toolName**：`string`

  選填。被呼叫的工具名稱。

  **args**：`object`

  選填。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}

  

</details>


  

<details>
<summary>**toolResponse**：`ToolResponse` 伺服器端 `ToolCall` 執行的輸出。這個欄位由用戶端填入，內容為執行對應 `ToolCall` 的結果。</summary>

  

  

<details>
<summary>**toolType**：必填 `V1mainToolType` 被呼叫的工具類型，與 `tool_type`（在對應的 `ToolCall` 中）相符。</summary>

  

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

  選填。這個回應所對應的工具呼叫識別碼。

  **response**：`object`

  選填。工具回應。

  

</details>


  

</details>


  

<details>
<summary>**metadata**：`Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定這個欄位，以設定每個 part 的靜態媒體預處理。</summary>

  

  Union 欄位 `metadata` 只能是下列其中之一：

  

<details>
<summary>**videoMetadata**：`VideoMetadata` 選填。影片中繼資料。僅當影片資料以 inline_data 或 file_data 呈現時，才應指定中繼資料。</summary>

  

  **startOffset**：`string`

  選填。影片的起始偏移。

  **endOffset**：`string`

  選填。影片的結束偏移。

  **fps**：`number`

  選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。

  

</details>


  

</details>


  **thought**：`boolean`

  選填。表示這個 part 是否為模型的思考內容。

  **thoughtSignature**：`string`

  選填。思考內容的不透明簽章，可在後續要求中重複使用。

  **partMetadata**：`object`

  與 Part 相關聯的自訂中繼資料。使用 genai.Part 作為內容表示法的代理，可能需要追蹤額外資訊。例如 Part 來源檔案／來源的名稱，或多工處理多個 Part 串流的方式。

  

<details>
<summary>**mediaResolution**：`V1mainMediaResolution` 選填。輸入媒體的媒體解析度。</summary>

  

  

<details>
<summary>**value**：`Union type` 媒體解析度等級。</summary>

  

  Union 欄位 `value` 只能是下列其中之一：

  

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
<summary>**mediaProcessing**：`string enum` 選填。模型如何處理這個 part 的媒體以進行理解。僅對影片 part（`inline_data` 或 MIME 類型為影片的 `file_data`）有意義；非影片 part 會忽略這個欄位。</summary>

  

  可能的值：

  - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型專屬的處理方式。
  - `STATIC`：固定速率擷取影格，所有影格都放入上下文。
  - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。

  

</details>


  

<details>
<summary>**audioTranscription**：`AudioTranscription` 選填。音訊（輸入或輸出）轉錄。僅當這個 Part 包含音訊資料時才設定。</summary>

  

  **text**：必填 `string`

  這個音訊片段的轉錄文字。

  **speakerLabel**：`string`

  選填。識別這個音訊片段說話者的標籤（例如「spk_1」、「spk_2」）。在設定說話者分離時出現。

  

<details>
<summary>**words**：`WordInfo array` 選填。詳細的單字層級轉錄與時間資訊。在設定 word_timestamp 時出現。</summary>

  

  **word**：必填 `string`

  單字的轉錄。

  **startOffset**：`string`

  選填。單字相對於音訊起始處的起始時間偏移。

  **endOffset**：`string`

  選填。單字相對於音訊起始處的結束時間偏移。

  

</details>


  

</details>


  

<details>
<summary>**speechMetadata**：`SpeechMetadata` 選填。套用到文字 part 的中繼資料，用來自訂其朗讀或合成方式，例如指定說話者身分或說話風格。</summary>

  

  **speaker**：`string`

  選填。多說話者合成時選用的說話者名稱。

  **style**：`string`

  選填。語音合成的風格指令（選填）。

  

</details>


  

</details>


  **role**：`string`

  選填。內容的產生者。必須是「user」或「model」。在多輪對話中設定很有用，否則可留空或不設定。

  

</details>


  

<details>
<summary>**finishReason**：`string enum` 選填。僅輸出。模型停止生成權杖的原因。若為空，表示模型尚未停止生成權杖。</summary>

  

  可能的值：

  - `FINISH_REASON_UNSPECIFIED`：預設值。這個值未使用。
  - `STOP`：模型的自然停止點或所提供的停止序列。
  - `MAX_TOKENS`：已達到要求中指定的權杖數量上限。
  - `SAFETY`：回應候選內容因安全因素被標記。
  - `RECITATION`：回應候選內容因重述因素被標記。
  - `LANGUAGE`：回應候選內容因使用不支援的語言被標記。
  - `OTHER`：未知原因。
  - `BLOCKLIST`：權杖生成因內容包含禁用詞彙而停止。
  - `PROHIBITED_CONTENT`：權杖生成因可能包含禁止內容而停止。
  - `SPII`：權杖生成因內容可能包含敏感個人識別資訊（SPII）而停止。
  - `MALFORMED_FUNCTION_CALL`：模型生成的函式呼叫無效。
  - `IMAGE_SAFETY`：權杖生成因生成的圖片包含安全違規而停止。
  - `IMAGE_PROHIBITED_CONTENT`：圖片生成因生成的圖片有其他禁止內容而停止。
  - `IMAGE_OTHER`：圖片生成因其他雜項問題而停止。
  - `NO_IMAGE`：預期模型生成圖片，但未生成任何圖片。
  - `IMAGE_RECITATION`：圖片生成因重述而停止。
  - `UNEXPECTED_TOOL_CALL`：模型生成了工具呼叫，但要求中未啟用任何工具。
  - `TOO_MANY_TOOL_CALLS`：模型連續呼叫了太多工具，因此系統結束執行。
  - `MISSING_THOUGHT_SIGNATURE`：要求中至少有一個思考簽章缺失。
  - `MALFORMED_RESPONSE`：因回應格式錯誤而結束。
  - `ESCALATION`：要求被升級規則篩選。
  - `PUP_LIMITED_DISABLED`：表示權杖生成因使用者帳號違反禁止使用政策（PUP）而受限或停用而停止。
  - `CONTINUATION`：權杖生成因回應達到每個要求的權杖上限而停止，但生成尚未完成。可透過後續要求使用傳回的 `continuation_token` 繼續模型回應。注意，`max_output_tokens` 在各接續跳躍間是累積的，必須單調增加或省略。

  

</details>


  **finishMessage**：`string`

  選填。僅輸出。詳述模型停止生成權杖的原因。僅在設定了 `finish_reason` 時填入。

  

<details>
<summary>**safetyRatings**：`SafetyRating array` 回應候選的安全性評分清單。每個類別最多有一個評分。</summary>

  

  

<details>
<summary>**category**：必填 `HarmCategory` 這個評分的類別。</summary>

  

  可能的值：

  - `HARM_CATEGORY_UNSPECIFIED`：未指定類別。
  - `HARM_CATEGORY_HARASSMENT`：**Gemini** - 騷擾內容。
  - `HARM_CATEGORY_HATE_SPEECH`：**Gemini** - 仇恨言論與內容。
  - `HARM_CATEGORY_SEXUALLY_EXPLICIT`：**Gemini** - 性露骨內容。
  - `HARM_CATEGORY_DANGEROUS_CONTENT`：**Gemini** - 危險內容。
  - `HARM_CATEGORY_JAILBREAK`：**Gemini** - 試圖繞過或顛覆模型安全準則的提示詞（越獄嘗試）。

  

</details>


  

<details>
<summary>**probability**：必填 `string enum` 這個內容有害的機率。</summary>

  

  可能的值：

  - `HARM_PROBABILITY_UNSPECIFIED`：未指定機率。
  - `NEGLIGIBLE`：內容不安全的可能性微乎其微。
  - `LOW`：內容不安全的可能性低。
  - `MEDIUM`：內容不安全的可能性中等。
  - `HIGH`：內容不安全的可能性高。

  

</details>


  **blocked**：`boolean`

  這個內容是否因這個評分而被封鎖？

  

</details>


  

<details>
<summary>**citationMetadata**：`CitationMetadata` 僅輸出。模型生成候選的引文資訊。這個欄位可能填入 `content` 中任何文字的重述資訊。這些是從基礎 LLM 訓練資料中的受版權保護素材「重述」而來的段落。</summary>

  

  

<details>
<summary>**citationSources**：`CitationSource array` 針對特定回應的來源引文。</summary>

  

  **startIndex**：`integer`

  選填。歸因於這個來源的回應片段的起始。索引表示片段的起始，以位元組計量。

  **endIndex**：`integer`

  選填。歸因片段的結束（不含）。

  **uri**：`string`

  選填。被歸因為部分文字來源的 URI。

  **license**：`string`

  選填。被歸因為片段來源的 GitHub 專案的授權。程式碼引文需要授權資訊。

  

</details>


  

</details>


  **tokenCount**：`integer`

  僅輸出。這個候選的權杖數量。

  

<details>
<summary>**groundingAttributions**：`GroundingAttribution array` 僅輸出。對接地答案有所貢獻的來源的歸因資訊。這個欄位會為 `GenerateAnswer` 呼叫填入。</summary>

  

  

<details>
<summary>**sourceId**：`AttributionSourceId` 僅輸出。對這個歸因有所貢獻的來源的識別碼。</summary>

  

  

<details>
<summary>**source**：`Union type`</summary>

  

  Union 欄位 `source` 只能是下列其中之一：

  

<details>
<summary>**groundingPassage**：`GroundingPassageId` 行內段落的識別碼。</summary>

  

  **passageId**：`string`

  僅輸出。與 `GenerateAnswerRequest` 的 `GroundingPassage.id` 相符的段落 ID。

  **partIndex**：`integer`

  僅輸出。`GenerateAnswerRequest` 的 `GroundingPassage.content` 中 part 的索引。

  

</details>


  

<details>
<summary>**semanticRetrieverChunk**：`SemanticRetrieverChunk` 透過 Semantic Retriever 取得的 `Chunk` 的識別碼。</summary>

  

  **source**：`string`

  僅輸出。與要求的 `SemanticRetrieverConfig.source` 相符的來源名稱。範例：`corpora/123` 或 `corpora/123/documents/abc`

  **chunk**：`string`

  僅輸出。包含歸因文字的 `Chunk` 名稱。範例：`corpora/123/documents/abc/chunks/xyz`

  

</details>


  

</details>


  

</details>


  

<details>
<summary>**content**：`Content` 組成這個歸因的接地來源內容。</summary>

  

  

<details>
<summary>**parts**：`Part array` 組成單一訊息的已排序 `Parts`。各 Part 的 MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type`</summary>

  

  Union 欄位 `data` 只能是下列其中之一：

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

  選填。指定用來向模型指稱這個 blob 的名稱（例如「my_blob.png」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 參照識別碼使用。

  

</details>


  

<details>
<summary>**functionCall**：`FunctionCall` 模型傳回的預測 `FunctionCall`，包含代表 `FunctionDeclaration.name` 的字串，以及引數與其值。</summary>

  

  **name**：必填 `string`

  要呼叫的函式名稱。必須由 a-z、A-Z、0-9 組成，或包含底線與破折號，長度上限為 128。

  **id**：`string`

  選填。函式呼叫的唯一識別碼。若有填入，用戶端應執行該 `function_call`，並傳回帶有相符 `id` 的回應。

  **args**：`object`

  選填。JSON 物件格式的函式參數與值。

  

</details>


  

<details>
<summary>**functionResponse**：`FunctionResponse` `FunctionCall` 的結果輸出，包含代表 `FunctionDeclaration.name` 的字串，以及含有函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。</summary>

  

  **name**：必填 `string`

  要呼叫的函式名稱。必須由 a-z、A-Z、0-9 組成，或包含底線與破折號，長度上限為 128。

  **response**：必填 `object`

  JSON 物件格式的函式回應。呼叫端可使用符合函式語法的任意鍵來傳回函式輸出，例如「output」、「result」等。特別是當函式呼叫執行失敗時，回應可包含「error」鍵，將錯誤詳情傳回給模型。多媒體內容可透過子物件納入，該子物件包含單一「$ref」鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，屬於持有該多媒體內容的 `FunctionResponsePart`。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

  **id**：`string`

  選填。這個回應所對應的函式呼叫識別碼。由用戶端填入，以比對對應的函式呼叫 `id`。

  

<details>
<summary>**parts**：`FunctionResponsePart array` 選填。組成函式回應的已排序 `Parts`。各 Part 的 IANA MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type` 函式回應 part 的資料。</summary>

  

  Union 欄位 `data` 只能是下列其中之一：

  

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

  選填。blob 的顯示名稱。用來提供標籤或檔名以區分各個 blob，並從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。

  

</details>


  

<details>
<summary>**fileData**：`FunctionResponseFileData` 以 URI 為基礎的資料。</summary>

  

  **fileUri**：必填 `string`

  URI。

  **mimeType**：`string`

  來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將傳回錯誤。完整支援類型清單請參閱[多模態函式回應](/docs/function-calling/#multimodal)與[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

  **displayName**：`string`

  選填。檔案的顯示名稱。用來提供標籤或檔名以區分檔案資料，並從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。

  

</details>


  

</details>


  

<details>
<summary>**mediaProcessing**：`string enum` 選填。模型如何處理這個 part 的媒體以進行理解。僅對影片 part（`inline_data` 或 MIME 類型為影片的 `file_data`）有意義；非影片 part 會忽略這個欄位。</summary>

  

  可能的值：

  - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型專屬的處理方式。
  - `STATIC`：固定速率擷取影格，所有影格都放入上下文。
  - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。

  

</details>


  

</details>


  **willContinue**：`boolean`

  選填。表示函式呼叫會繼續，並將傳回更多回應，使函式呼叫成為產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，後續回應將不予考慮。允許傳回空的 `response` 並搭配 `will_continue=False`，表示函式呼叫已完成。這仍可能觸發模型生成；若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。

  

<details>
<summary>**scheduling**：`string enum` 選填。指定回應應如何在對話中排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。</summary>

  

  可能的值：

  - `SCHEDULING_UNSPECIFIED`：這個值未使用。
  - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發生成。
  - `WHEN_IDLE`：將結果加入對話上下文，並提示生成輸出，但不中斷進行中的生成。
  - `INTERRUPT`：將結果加入對話上下文，中斷進行中的生成，並提示生成輸出。

  

</details>


  

</details>


  

<details>
<summary>**fileData**：`FileData` 以 URI 為基礎的資料。</summary>

  

  **fileUri**：必填 `string`

  URI。

  **mimeType**：`string`

  選填。來源資料的 IANA 標準 MIME 類型。

  **displayName**：`string`

  選填。指定用來向模型指稱這個檔案的名稱（例如「my_file.pdf」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案參照識別碼使用。

  

</details>


  

<details>
<summary>**executableCode**：`ExecutableCode` 由模型生成、預定要執行的程式碼。</summary>

  

  

<details>
<summary>**language**：必填 `string enum` `code` 的程式語言。</summary>

  

  可能的值：

  - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用這個值。
  - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 是預設語言。

  

</details>


  **code**：必填 `string`

  要執行的程式碼。

  **id**：`string`

  選填。`ExecutableCode` part 的唯一識別碼。伺服器傳回的 `CodeExecutionResult` 會帶有相符的 `id`。

  

</details>


  

<details>
<summary>**codeExecutionResult**：`CodeExecutionResult` 執行 `ExecutableCode` 的結果。</summary>

  

  

<details>
<summary>**outcome**：必填 `string enum` 程式碼執行的結果。</summary>

  

  可能的值：

  - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用這個值。
  - `OUTCOME_OK`：程式碼執行成功完成。`output` 包含標準輸出（如有）。
  - `OUTCOME_FAILED`：程式碼執行失敗。`output` 包含標準錯誤與標準輸出（如有）。
  - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已取消。可能有也可能沒有部分 `output`。

  

</details>


  **id**：`string`

  選填。這個結果所對應的 `ExecutableCode` part 的識別碼。僅在對應的 `ExecutableCode` 有 id 時才填入。

  **output**：`string`

  選填。程式碼執行成功時包含標準輸出，否則包含標準錯誤或其他說明。

  

</details>


  

<details>
<summary>**toolCall**：`ToolCall` 伺服器端工具呼叫。當模型預測某個工具叫用應在伺服器上執行時，會填入這個欄位。用戶端應將這則訊息原樣回傳給 API。</summary>

  

  

<details>
<summary>**toolType**：必填 `V1mainToolType` 被呼叫的工具類型。</summary>

  

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

  選填。工具呼叫的唯一識別碼。伺服器會傳回帶有相符 `id` 的工具回應。

  **toolName**：`string`

  選填。被呼叫的工具名稱。

  **args**：`object`

  選填。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}

  

</details>


  

<details>
<summary>**toolResponse**：`ToolResponse` 伺服器端 `ToolCall` 執行的輸出。這個欄位由用戶端填入，內容為執行對應 `ToolCall` 的結果。</summary>

  

  

<details>
<summary>**toolType**：必填 `V1mainToolType` 被呼叫的工具類型，與 `tool_type`（在對應的 `ToolCall` 中）相符。</summary>

  

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

  選填。這個回應所對應的工具呼叫識別碼。

  **response**：`object`

  選填。工具回應。

  

</details>


  

</details>


  

<details>
<summary>**metadata**：`Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定這個欄位，以設定每個 part 的靜態媒體預處理。</summary>

  

  Union 欄位 `metadata` 只能是下列其中之一：

  

<details>
<summary>**videoMetadata**：`VideoMetadata` 選填。影片中繼資料。僅當影片資料以 inline_data 或 file_data 呈現時，才應指定中繼資料。</summary>

  

  **startOffset**：`string`

  選填。影片的起始偏移。

  **endOffset**：`string`

  選填。影片的結束偏移。

  **fps**：`number`

  選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。

  

</details>


  

</details>


  **thought**：`boolean`

  選填。表示這個 part 是否為模型的思考內容。

  **thoughtSignature**：`string`

  選填。思考內容的不透明簽章，可在後續要求中重複使用。

  **partMetadata**：`object`

  與 Part 相關聯的自訂中繼資料。使用 genai.Part 作為內容表示法的代理，可能需要追蹤額外資訊。例如 Part 來源檔案／來源的名稱，或多工處理多個 Part 串流的方式。

  

<details>
<summary>**mediaResolution**：`V1mainMediaResolution` 選填。輸入媒體的媒體解析度。</summary>

  

  

<details>
<summary>**value**：`Union type` 媒體解析度等級。</summary>

  

  Union 欄位 `value` 只能是下列其中之一：

  

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
<summary>**mediaProcessing**：`string enum` 選填。模型如何處理這個 part 的媒體以進行理解。僅對影片 part（`inline_data` 或 MIME 類型為影片的 `file_data`）有意義；非影片 part 會忽略這個欄位。</summary>

  

  可能的值：

  - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型專屬的處理方式。
  - `STATIC`：固定速率擷取影格，所有影格都放入上下文。
  - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。

  

</details>


  

<details>
<summary>**audioTranscription**：`AudioTranscription` 選填。音訊（輸入或輸出）轉錄。僅當這個 Part 包含音訊資料時才設定。</summary>

  

  **text**：必填 `string`

  這個音訊片段的轉錄文字。

  **speakerLabel**：`string`

  選填。識別這個音訊片段說話者的標籤（例如「spk_1」、「spk_2」）。在設定說話者分離時出現。

  

<details>
<summary>**words**：`WordInfo array` 選填。詳細的單字層級轉錄與時間資訊。在設定 word_timestamp 時出現。</summary>

  

  **word**：必填 `string`

  單字的轉錄。

  **startOffset**：`string`

  選填。單字相對於音訊起始處的起始時間偏移。

  **endOffset**：`string`

  選填。單字相對於音訊起始處的結束時間偏移。

  

</details>


  

</details>


  

<details>
<summary>**speechMetadata**：`SpeechMetadata` 選填。套用到文字 part 的中繼資料，用來自訂其朗讀或合成方式，例如指定說話者身分或說話風格。</summary>

  

  **speaker**：`string`

  選填。多說話者合成時選用的說話者名稱。

  **style**：`string`

  選填。語音合成的風格指令（選填）。

  

</details>


  

</details>


  **role**：`string`

  選填。內容的產生者。必須是「user」或「model」。在多輪對話中設定很有用，否則可留空或不設定。

  

</details>


  

</details>


  

<details>
<summary>**groundingMetadata**：`GroundingMetadata` 僅輸出。候選的接地中繼資料。這個欄位會為 `GenerateContent` 呼叫填入。</summary>

  

  

<details>
<summary>**searchEntryPoint**：`SearchEntryPoint` 選填。後續網頁搜尋的 Google 搜尋入口。</summary>

  

  **renderedContent**：`string`

  選填。可嵌入網頁或應用程式 webview 的網頁內容片段。

  **sdkBlob**：`string`

  選填。代表 tuple 陣列的 Base64 編碼 JSON。

  

</details>


  

<details>
<summary>**groundingChunks**：`GroundingChunk array` 從指定接地來源檢索到的支援參照清單。串流時，這裡僅包含先前回應的接地中繼資料中尚未納入的接地區塊。</summary>

  

  

<details>
<summary>**chunkType**：`Union type` 區塊類型。</summary>

  

  Union 欄位 `chunkType` 只能是下列其中之一：

  

<details>
<summary>**web**：`Web` 來自網路的接地區塊。</summary>

  

  **uri**：`string`

  僅輸出。區塊的 URI 參照。

  **title**：`string`

  僅輸出。區塊的標題。

  

</details>


  

<details>
<summary>**image**：`Image` 選填。來自圖片搜尋的接地區塊。</summary>

  

  **sourceUri**：`string`

  用於歸因的網頁 URI。

  **imageUri**：`string`

  圖片資產 URL。

  **title**：`string`

  圖片來源網頁的標題。

  **domain**：`string`

  圖片來源網頁的根網域，例如「example.com」。

  

</details>


  

<details>
<summary>**retrievedContext**：`RetrievedContext` 選填。來自檔案搜尋工具檢索到的上下文的接地區塊。</summary>

  

  **uri**：`string`

  選填。語意檢索文件的 URI 參照。

  **title**：`string`

  選填。文件的標題。

  **text**：`string`

  選填。區塊的文字。

  **fileSearchStore**：`string`

  選填。包含該文件的 `FileSearchStore` 名稱。範例：`fileSearchStores/123`

  

<details>
<summary>**customMetadata**：`GroundingChunkCustomMetadata array` 選填。使用者提供的關於檢索到的上下文的中繼資料。</summary>

  

  

<details>
<summary>**value**：`Union type` 中繼資料的值。可以是字串、字串清單或數字。</summary>

  

  Union 欄位 `value` 只能是下列其中之一：

  **stringValue**：`string`

  選填。中繼資料的字串值。

  

<details>
<summary>**stringListValue**：`GroundingChunkStringList` 選填。中繼資料的字串值清單。</summary>

  

  **values**：`string array`

  清單的字串值。

  

</details>


  **numericValue**：`number`

  選填。中繼資料的數值。這個值的預期範圍取決於所使用的特定 `key`。

  

</details>


  **key**：`string`

  中繼資料的鍵。

  

</details>


  **pageNumber**：`integer`

  選填。檢索到的上下文的頁碼（如適用）。

  **mediaId**：`string`

  選填。多模態檔案搜尋結果的媒體 blob 資源名稱。格式：fileSearchStores/{file_search_store_id}/media/{blob_id}

  

</details>


  

<details>
<summary>**maps**：`Maps` 選填。來自 Google Maps 的接地區塊。</summary>

  

  **uri**：`string`

  地點的 URI 參照。

  **title**：`string`

  地點的標題。

  **text**：`string`

  地點答覆的文字說明。

  **placeId**：`string`

  地點的 ID，格式為 `places/{place_id}`。使用者可使用這個 ID 查詢該地點。

  

<details>
<summary>**placeAnswerSources**：`PlaceAnswerSources` 提供 Google Maps 中指定地點特徵答覆的來源。</summary>

  

  

<details>
<summary>**reviewSnippets**：`ReviewSnippet array` 用來生成 Google Maps 中指定地點特徵答覆的評論片段。</summary>

  

  **reviewId**：`string`

  評論片段的 ID。

  **googleMapsUri**：`string`

  對應 Google Maps 上使用者評論的連結。

  **title**：`string`

  評論的標題。

  

</details>


  

</details>


  

</details>


  

</details>


  

</details>


  

<details>
<summary>**groundingSupports**：`GoogleAiGenerativelanguageV1betaGroundingSupport array` 接地支援清單。</summary>

  

  

<details>
<summary>**segment**：`GoogleAiGenerativelanguageV1betaSegment` 這個支援所屬內容的片段。</summary>

  

  **partIndex**：`integer`

  Part 物件在其父 Content 物件中的索引。

  **startIndex**：`integer`

  指定 Part 中的起始索引，以位元組計量。從 Part 起始處算起的偏移（含），從零開始。

  **endIndex**：`integer`

  指定 Part 中的結束索引，以位元組計量。從 Part 起始處算起的偏移（不含），從零開始。

  **text**：`string`

  回應中對應於該片段的文字。

  

</details>


  **groundingChunkIndices**：`integer array`

  選填。指定與該主張相關聯的引文的索引清單（指向 `response.candidate.grounding_metadata` 中的「grounding_chunk」）。例如 [1,3,4] 表示 grounding_chunk[1]、grounding_chunk[3]、grounding_chunk[4] 是歸因於該主張的檢索內容。若回應是串流的，grounding_chunk_indices 指的是所有回應中的索引。用戶端有責任累積所有回應中的接地區塊（同時保持相同順序）。

  **confidenceScores**：`number array`

  選填。支援參照的信心分數。範圍從 0 到 1，1 表示最有信心。這個清單的大小必須與 grounding_chunk_indices 相同。

  **renderedParts**：`integer array`

  僅輸出。指向候選內容的 `parts` 欄位的索引。這些索引指定哪些算繪的 part 與這個支援來源相關聯。

  

</details>


  

<details>
<summary>**retrievalMetadata**：`RetrievalMetadata` 與接地流程中檢索相關的中繼資料。</summary>

  

  **googleSearchDynamicRetrievalScore**：`number`

  選填。表示來自 Google 搜尋的資訊有多大可能有助於回答提示詞的分數。分數範圍為 [0, 1]，其中 0 表示可能性最低，1 表示可能性最高。這個分數僅在啟用 Google 搜尋接地與動態檢索時填入。它將與閾值比較，以決定是否觸發 Google 搜尋。

  

</details>


  **webSearchQueries**：`string array`

  後續網頁搜尋的網頁搜尋查詢。

  **imageSearchQueries**：`string array`

  用於接地的圖片搜尋查詢。

  **googleMapsWidgetContextToken**：`string`

  選填。Google Maps widget 上下文權杖的資源名稱，可與 PlacesContextElement widget 搭配使用，以算繪上下文資料。僅在啟用 Google Maps 接地時填入。

  

</details>


  **avgLogprobs**：`number`

  僅輸出。候選的平均對數機率分數。

  

<details>
<summary>**logprobsResult**：`LogprobsResult` 僅輸出。回應權杖與頂部權杖的對數概似分數</summary>

  

  **logProbabilitySum**：`number`

  所有權杖的對數機率總和。

  

<details>
<summary>**topCandidates**：`TopCandidates array` 長度 = 解碼步驟總數。</summary>

  

  

<details>
<summary>**candidates**：`LogprobsResultCandidate array` 依對數機率降冪排序。</summary>

  

  **token**：`string`

  候選的權杖字串值。

  **tokenId**：`integer`

  候選的權杖 ID 值。

  **logProbability**：`number`

  候選的對數機率。

  

</details>


  

</details>


  

<details>
<summary>**chosenCandidates**：`LogprobsResultCandidate array` 長度 = 解碼步驟總數。所選候選可能在 top_candidates 中，也可能不在。</summary>

  

  **token**：`string`

  候選的權杖字串值。

  **tokenId**：`integer`

  候選的權杖 ID 值。

  **logProbability**：`number`

  候選的對數機率。

  

</details>


  

</details>


  

<details>
<summary>**urlContextMetadata**：`UrlContextMetadata` 僅輸出。與 URL 上下文檢索工具相關的中繼資料。</summary>

  

  

<details>
<summary>**urlMetadata**：`UrlMetadata array` URL 上下文清單。</summary>

  

  **retrievedUrl**：`string`

  工具檢索到的 URL。

  

<details>
<summary>**urlRetrievalStatus**：`string enum` URL 檢索的狀態。</summary>

  

  可能的值：

  - `URL_RETRIEVAL_STATUS_UNSPECIFIED`：預設值。這個值未使用。
  - `URL_RETRIEVAL_STATUS_SUCCESS`：URL 檢索成功。
  - `URL_RETRIEVAL_STATUS_ERROR`：URL 檢索因錯誤而失敗。
  - `URL_RETRIEVAL_STATUS_PAYWALL`：URL 檢索因內容位於付費牆後而失敗。
  - `URL_RETRIEVAL_STATUS_UNSAFE`：URL 檢索因內容不安全而失敗。

  

</details>


  

</details>


  

</details>


  **continuationToken**：`string`

  當 `finish_reason` 為 `CONTINUATION` 時傳回的選填不透明接續權杖。用戶端可在後續的 `GenerateContentRequest` 中傳入這個權杖，以繼續生成。

  

</details>


  

<details>
<summary>**promptFeedback**：`PromptFeedback` 傳回與內容篩選器相關的提示詞回饋。</summary>

  

  

<details>
<summary>**blockReason**：`string enum` 選填。若有設定，表示提示詞被封鎖，且不會傳回任何候選。請重新措辭提示詞。</summary>

  

  可能的值：

  - `BLOCK_REASON_UNSPECIFIED`：預設值。這個值未使用。
  - `SAFETY`：提示詞因安全因素被封鎖。請檢查 `safety_ratings` 以了解是哪個安全類別封鎖了它。
  - `OTHER`：提示詞因未知原因被封鎖。
  - `BLOCKLIST`：提示詞因包含術語封鎖清單中的詞彙而被封鎖。
  - `PROHIBITED_CONTENT`：提示詞因禁止內容而被封鎖。
  - `IMAGE_SAFETY`：候選因不安全的圖片生成內容而被封鎖。

  

</details>


  

<details>
<summary>**safetyRatings**：`SafetyRating array` 提示詞的安全性評分。每個類別最多有一個評分。</summary>

  

  

<details>
<summary>**category**：必填 `HarmCategory` 這個評分的類別。</summary>

  

  可能的值：

  - `HARM_CATEGORY_UNSPECIFIED`：未指定類別。
  - `HARM_CATEGORY_HARASSMENT`：**Gemini** - 騷擾內容。
  - `HARM_CATEGORY_HATE_SPEECH`：**Gemini** - 仇恨言論與內容。
  - `HARM_CATEGORY_SEXUALLY_EXPLICIT`：**Gemini** - 性露骨內容。
  - `HARM_CATEGORY_DANGEROUS_CONTENT`：**Gemini** - 危險內容。
  - `HARM_CATEGORY_JAILBREAK`：**Gemini** - 試圖繞過或顛覆模型安全準則的提示詞（越獄嘗試）。

  

</details>


  

<details>
<summary>**probability**：必填 `string enum` 這個內容有害的機率。</summary>

  

  可能的值：

  - `HARM_PROBABILITY_UNSPECIFIED`：未指定機率。
  - `NEGLIGIBLE`：內容不安全的可能性微乎其微。
  - `LOW`：內容不安全的可能性低。
  - `MEDIUM`：內容不安全的可能性中等。
  - `HIGH`：內容不安全的可能性高。

  

</details>


  **blocked**：`boolean`

  這個內容是否因這個評分而被封鎖？

  

</details>


  

</details>


  

<details>
<summary>**usageMetadata**：`UsageMetadata` 僅輸出。生成要求的權杖使用量中繼資料。</summary>

  

  **promptTokenCount**：`integer`

  提示詞中的權杖數量。當設定了 `cached_content` 時，這仍是總有效提示詞大小，意即包含快取內容中的權杖數量。

  **cachedContentTokenCount**：`integer`

  提示詞快取部分的權杖數量（快取內容）。

  **candidatesTokenCount**：`integer`

  所有生成回應候選的權杖總數。

  **toolUsePromptTokenCount**：`integer`

  僅輸出。工具使用提示詞中存在的權杖數量。

  **thoughtsTokenCount**：`integer`

  僅輸出。思考模型的思考權杖數量。

  **totalTokenCount**：`integer`

  生成要求的權杖總數（提示詞 + 工具使用提示詞 + 思考 + 回應候選）。

  

<details>
<summary>**promptTokensDetails**：`ModalityTokenCount array` 僅輸出。在要求輸入中處理的模態清單。</summary>

  

  

<details>
<summary>**modality**：`GenerativeLanguageModality` 與這個權杖數量相關聯的模態。</summary>

  

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


  

<details>
<summary>**cacheTokensDetails**：`ModalityTokenCount array` 僅輸出。要求輸入中快取內容的模態清單。</summary>

  

  

<details>
<summary>**modality**：`GenerativeLanguageModality` 與這個權杖數量相關聯的模態。</summary>

  

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


  

<details>
<summary>**candidatesTokensDetails**：`ModalityTokenCount array` 僅輸出。在回應中傳回的模態清單。</summary>

  

  

<details>
<summary>**modality**：`GenerativeLanguageModality` 與這個權杖數量相關聯的模態。</summary>

  

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


  

<details>
<summary>**toolUsePromptTokensDetails**：`ModalityTokenCount array` 僅輸出。為工具使用要求輸入處理的模態清單。</summary>

  

  

<details>
<summary>**modality**：`GenerativeLanguageModality` 與這個權杖數量相關聯的模態。</summary>

  

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


  

<details>
<summary>**serviceTier**：[`ServiceTier`](/api-reference/batch-api/#Resource:ServiceTier) 僅輸出。要求的服務層級。</summary>

  

  可能的值：

  - `unspecified`：預設服務層級，即標準層級。
  - `standard`：標準服務層級。
  - `flex`：Flex 服務層級。
  - `priority`：Priority 服務層級。

  

</details>


  

</details>


  **modelVersion**：`string`

  僅輸出。用來生成回應的模型版本。

  **responseId**：`string`

  僅輸出。response_id 用來識別每個回應。

  

<details>
<summary>**modelStatus**：`ModelStatus` 僅輸出。這個模型目前的模型狀態。</summary>

  

  

<details>
<summary>**modelStage**：`ModelStage` 基礎模型的階段。</summary>

  

  可能的值：

  - `MODEL_STAGE_UNSPECIFIED`：未指定的模型階段。
  - `EXPERIMENTAL`：這個階段的模型僅供實驗用途。
  - `PREVIEW`：這個階段的模型比實驗模型更成熟。
  - `STABLE`：這個階段的模型被視為穩定，可用於生產環境。
  - `LEGACY`：若模型處於這個階段，表示這個模型在不久的將來將走上淘汰之路。僅現有客戶可使用這個模型。
  - `RETIRED`：這個階段的模型已退役。這些模型無法使用。

  

</details>


  **retirementTime**：`string`

  模型將退役的時間。

  **message**：`string`

  說明模型狀態的訊息。

  

</details>


  

</details>


  

</details>


  **metadata**：`object`

  僅輸出。與要求相關聯的中繼資料。

  

</details>


  

</details>


  

</details>


  

</details>


  

---


  **createTime**：`string`

  僅輸出。批次建立的時間。

  

---


  **endTime**：`string`

  僅輸出。批次處理完成的時間。

  

---


  **updateTime**：`string`

  僅輸出。批次上次更新的時間。

  

---


  

<details>
<summary>**batchStats**：`BatchStats` 僅輸出。關於批次的統計資料。</summary>

  

  **requestCount**：`string`

  僅輸出。批次中的要求數量。

  **successfulRequestCount**：`string`

  僅輸出。成功處理的要求數量。

  **failedRequestCount**：`string`

  僅輸出。處理失敗的要求數量。

  **pendingRequestCount**：`string`

  僅輸出。仍在等待處理的要求數量。

  

</details>


  

---


  

<details>
<summary>**state**：[`BatchState`](/api-reference/batch-api/#Resource:BatchState) 僅輸出。批次的狀態。</summary>

  

  可能的值：

  - `BATCH_STATE_UNSPECIFIED`：未指定批次狀態。
  - `BATCH_STATE_PENDING`：服務正在準備執行批次。
  - `BATCH_STATE_RUNNING`：批次正在進行中。
  - `BATCH_STATE_SUCCEEDED`：批次成功完成。
  - `BATCH_STATE_FAILED`：批次失敗。
  - `BATCH_STATE_CANCELLED`：批次已取消。
  - `BATCH_STATE_EXPIRED`：批次已過期。

  

</details>


  

---


  **priority**：`string`

  選填。批次的優先順序。優先順序值較高的批次將在優先順序值較低的批次之前處理。允許負值。預設為 0。


## 資料模型 {#data-models}

### BatchState {#Resource:BatchState}

**可能的值：**

- `BATCH_STATE_UNSPECIFIED`：未指定批次狀態。
- `BATCH_STATE_PENDING`：服務正在準備執行批次。
- `BATCH_STATE_RUNNING`：批次正在進行中。
- `BATCH_STATE_SUCCEEDED`：批次成功完成。
- `BATCH_STATE_FAILED`：批次失敗。
- `BATCH_STATE_CANCELLED`：批次已取消。
- `BATCH_STATE_EXPIRED`：批次已過期。

### ServiceTier {#Resource:ServiceTier}

**可能的值：**

- `unspecified`：預設服務層級，即標準層級。
- `standard`：標準服務層級。
- `flex`：Flex 服務層級。
- `priority`：Priority 服務層級。

