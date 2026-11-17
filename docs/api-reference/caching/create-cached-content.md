# 建立快取內容

`POST` `https://generativelanguage.googleapis.com/v1beta/cachedContents`

建立 CachedContent 資源。


  
## 請求主體 {#request-body}

  
  **model**：必填 `string`

  不可變更。快取內容要使用的 `Model` 名稱。格式：`models/{model}`

  

---


  

<details>
<summary>**expiration**：`Union type`，指定此資源何時到期。</summary>

  

  聯集欄位 `expiration` 只能是下列其中一項：

  **expireTime**：`string`

  以 UTC 表示的時間戳，代表此資源被視為到期的時間。此欄位在輸出時*一律*會提供，無論輸入時送了什麼。

  **ttl**：`string`

  僅供輸入。此資源的新 TTL，僅供輸入。

  

</details>


  

---


  **displayName**：`string`

  選填。不可變更。由使用者產生、具意義的快取內容顯示名稱。最多 128 個 Unicode 字元。

  

---


  

<details>
<summary>**systemInstruction**：`Content` 選填。僅供輸入。不可變更。由開發人員設定的系統指令。目前僅支援文字。</summary>

  

  

<details>
<summary>**parts**：`Part array` 組成單一訊息的已排序 `Parts`。各 Part 的 MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type`</summary>

  

  聯集欄位 `data` 只能是下列其中一項：

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

  JSON 物件格式的函式回應。呼叫端可使用符合函式語法的任意鍵來傳回函式輸出，例如「output」、「result」等。特別是當函式呼叫執行失敗時，回應可包含「error」鍵，將錯誤詳情傳回給模型。多媒體內容可透過子物件納入，該子物件包含單一「$ref」鍵，其值是 `inline_data.display_name` 或 `file_data.display_name`，屬於持有該多媒體內容的 `FunctionResponsePart`。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

  **id**：`string`

  選填。這個回應所對應的函式呼叫識別碼。由用戶端填入，以比對對應的函式呼叫 `id`。

  

<details>
<summary>**parts**：`FunctionResponsePart array` 選填。組成函式回應的已排序 `Parts`。各 Part 的 IANA MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type` 函式回應 part 的資料。</summary>

  

  聯集欄位 `data` 只能是下列其中一項：

  

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

  選填。`ExecutableCode` part 的唯一識別碼。伺服器會傳回 `CodeExecutionResult`，其 `id` 與之相符。

  

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
<summary>**toolType**：必填 `V1mainToolType` 被呼叫的工具類型，與對應的 `tool_type`（位於對應的 `ToolCall` 中）相符。</summary>

  

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

  

  聯集欄位 `metadata` 只能是下列其中一項：

  

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

  

  聯集欄位 `value` 只能是下列其中一項：

  

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


  

---


  

<details>
<summary>**contents**：`Content array` 選填。僅供輸入。不可變更。要快取的內容。</summary>

  

  

<details>
<summary>**parts**：`Part array` 組成單一訊息的已排序 `Parts`。各 Part 的 MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type`</summary>

  

  聯集欄位 `data` 只能是下列其中一項：

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

  JSON 物件格式的函式回應。呼叫端可使用符合函式語法的任意鍵來傳回函式輸出，例如「output」、「result」等。特別是當函式呼叫執行失敗時，回應可包含「error」鍵，將錯誤詳情傳回給模型。多媒體內容可透過子物件納入，該子物件包含單一「$ref」鍵，其值是 `inline_data.display_name` 或 `file_data.display_name`，屬於持有該多媒體內容的 `FunctionResponsePart`。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

  **id**：`string`

  選填。這個回應所對應的函式呼叫識別碼。由用戶端填入，以比對對應的函式呼叫 `id`。

  

<details>
<summary>**parts**：`FunctionResponsePart array` 選填。組成函式回應的已排序 `Parts`。各 Part 的 IANA MIME 類型可能不同。</summary>

  

  

<details>
<summary>**data**：`Union type` 函式回應 part 的資料。</summary>

  

  聯集欄位 `data` 只能是下列其中一項：

  

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

  選填。`ExecutableCode` part 的唯一識別碼。伺服器會傳回 `CodeExecutionResult`，其 `id` 與之相符。

  

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
<summary>**toolType**：必填 `V1mainToolType` 被呼叫的工具類型，與對應的 `tool_type`（位於對應的 `ToolCall` 中）相符。</summary>

  

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

  

  聯集欄位 `metadata` 只能是下列其中一項：

  

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

  

  聯集欄位 `value` 只能是下列其中一項：

  

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


  

---


  

<details>
<summary>**tools**：`Tool array` 選填。僅供輸入。不可變更。模型可用來生成下一個回應的 `Tools` 清單</summary>

  

  

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
<summary>**fileSearch**：`FileSearch` 選填。FileSearch 工具類型。用來從語意檢索語料庫擷取知識的工具。</summary>

  

  **fileSearchStoreNames**：必填 `string array`

  要從中擷取的 file_search_stores 名稱。範例：`fileSearchStores/my-file-search-store-123`

  **topK**：`integer`

  選填。要擷取的語意檢索區塊數量。

  **metadataFilter**：`string`

  選填。要套用到語意檢索文件與區塊的中繼資料篩選條件。

  

</details>


  

<details>
<summary>**mcpServers**：`McpServer array` 選填。要連線的 MCP 伺服器。</summary>

  

  

<details>
<summary>**transport**：`Union type` 用來連線至 MCPServer 的傳輸方式。</summary>

  

  聯集欄位 `transport` 只能是下列其中一項：

  

<details>
<summary>**streamableHttpTransport**：`StreamableHttpTransport` 可串流傳輸 HTTP 請求與回應的傳輸方式。</summary>

  

  **url**：`string`

  MCPServer 端點的完整 URL。範例：「https://api.example.com/mcp」

  **headers**：`object`

  選填：如有需要，提供驗證標頭、逾時等欄位。

  **timeout**：`string`

  一般作業的 HTTP 逾時。

  **sseReadTimeout**：`string`

  SSE 讀取作業的逾時。

  **terminateOnClose**：`boolean`

  傳輸關閉時是否要關閉用戶端工作階段。

  

</details>


  

</details>


  **name**：`string`

  MCPServer 的名稱。

  

</details>


  

<details>
<summary>**googleMaps**：`GoogleMaps` 選填。讓模型的回應能以與使用者查詢相關的地理空間上下文接地的工具。</summary>

  

  **enableWidget**：`boolean`

  選填。是否在回應的 GroundingMetadata 中傳回小工具上下文權杖。開發人員可使用小工具上下文權杖，算繪與模型在回應中參照的地點相關的地理空間上下文 Google Maps 小工具。

  

</details>


  

</details>


  

---


  

<details>
<summary>**toolConfig**：`ToolConfig` 選填。僅供輸入。不可變更。工具設定。此設定由所有工具共用。</summary>

  

  

<details>
<summary>**functionCallingConfig**：`FunctionCallingConfig` 選填。函式呼叫設定。</summary>

  

  

<details>
<summary>**mode**：`string enum` 選填。指定函式呼叫應以何種模式執行。若未指定，預設值將設為 AUTO。</summary>

  

  可能的值：

  - `MODE_UNSPECIFIED`：未指定的函式呼叫模式。不應使用這個值。
  - `AUTO`：模型的預設行為，由模型決定要預測函式呼叫或自然語言回應。
  - `ANY`：模型被限制為一律只預測函式呼叫。若有設定「allowed_function_names」，預測的函式呼叫將限於「allowed_function_names」其中之一；否則，預測的函式呼叫將是所提供「function_declarations」的其中之一。
  - `NONE`：模型不會預測任何函式呼叫。模型行為與未傳入任何函式宣告時相同。
  - `VALIDATED`：由模型決定要預測函式呼叫或自然語言回應，但會以受限解碼驗證函式呼叫。若有設定「allowed_function_names」，預測的函式呼叫將限於「allowed_function_names」其中之一；否則，預測的函式呼叫將是所提供「function_declarations」的其中之一。

  

</details>


  **allowedFunctionNames**：`string array`

  選填。一組函式名稱，提供時會限制模型可呼叫的函式。僅應在模式為 ANY 或 VALIDATED 時設定。函式名稱應與 [FunctionDeclaration.name] 相符。設定後，模型只會從允許的函式名稱中預測函式呼叫。

  

</details>


  

<details>
<summary>**retrievalConfig**：`RetrievalConfig` 選填。檢索設定。</summary>

  

  

<details>
<summary>**latLng**：`LatLng` 選填。使用者的位置。</summary>

  

  **latitude**：`number`

  以度為單位的緯度。必須介於 [-90.0, +90.0] 範圍內。

  **longitude**：`number`

  以度為單位的經度。必須介於 [-180.0, +180.0] 範圍內。

  

</details>


  **languageCode**：`string`

  選填。使用者的語言代碼。內容的語言代碼。使用 [BCP47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) 所定義的語言標籤。

  

</details>


  **includeServerSideToolInvocations**：`boolean`

  選填。若為 true，API 回應會在 `Content` 訊息中包含伺服器端的工具呼叫與回應，讓用戶端能觀察伺服器的工具互動情形。

  

</details>


  

  

  
  **範例請求**

  

=== "基本"


    === "REST"

          ```sh
          wget https://storage.googleapis.com/generativeai-downloads/data/a11.txt
          echo '{
            "model": "models/gemini-3.8-flash",
            "contents":[
              {
                "parts":[
                  {
                    "inline_data": {
                      "mime_type":"text/plain",
                      "data": "'$(base64 $B64FLAGS a11.txt)'"
                    }
                  }
                ],
              "role": "user"
              }
            ],
            "systemInstruction": {
              "parts": [
                {
                  "text": "You are an expert at analyzing transcripts."
                }
              ]
            },
            "ttl": "300s"
          }' > request.json

          curl -X POST "https://generativelanguage.googleapis.com/v1beta/cachedContents?key=$GEMINI_API_KEY" \
           -H 'Content-Type: application/json' \
           -d @request.json \
           > cache.json

          CACHE_NAME=$(cat cache.json | grep '"name":' | cut -d '"' -f 4 | head -n 1)

          curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -d '{
                "contents": [
                  {
                    "parts":[{
                      "text": "Please summarize this transcript"
                    }],
                    "role": "user"
                  },
                ],
                "cachedContent": "'$CACHE_NAME'"
              }'
          ```

    === "Python"

          ```python
          from google import genai
          from google.genai import types

          client = genai.Client(http_options={"api_version": "v1beta"})
          document = client.files.upload(file=media / "a11.txt")
          model_name = "gemini-3.8-flash"

          cache = client.caches.create(
              model=model_name,
              config=types.CreateCachedContentConfig(
                  contents=[document],
                  system_instruction="You are an expert analyzing transcripts.",
              ),
          )
          print(cache)

          response = client.models.generate_content(
              model=model_name,
              contents="Please summarize this transcript",
              config=types.GenerateContentConfig(cached_content=cache.name),
          )
          print(response.text)
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
          console.log('Cache created:', cache);

          const response = await ai.models.generateContent({
            model: modelName,
            contents: 'Please summarize this transcript',
            config: {cachedContent: cache.name},
          });
          console.log('Response text:', response.text);
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
          fmt.Println("Cache created:")
          fmt.Println(cache)

          // Use the cache for generating content.
          response, err := client.Models.GenerateContent(
              ctx,
              modelName,
              genai.Text("Please summarize this transcript"),
              &genai.GenerateContentConfig{
                  CachedContent: cache.Name,
              },
          )
          if err != nil {
              log.Fatal(err)
          }
          printResponse(response)
          ```

=== "依名稱"


    === "Python"

          ```python
          from google import genai
          from google.genai import types

          client = genai.Client(http_options={"api_version": "v1beta"})
          document = client.files.upload(file=media / "a11.txt")
          model_name = "gemini-3.8-flash"

          cache = client.caches.create(
              model=model_name,
              config=types.CreateCachedContentConfig(
                  contents=[document],
                  system_instruction="You are an expert analyzing transcripts.",
              ),
          )
          cache_name = cache.name  # Save the name for later

          # Later retrieve the cache
          cache = client.caches.get(name=cache_name)
          response = client.models.generate_content(
              model=model_name,
              contents="Find a lighthearted moment from this transcript",
              config=types.GenerateContentConfig(cached_content=cache.name),
          )
          print(response.text)
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
          const cacheName = cache.name;  // Save the name for later

          // Later retrieve the cache
          const retrievedCache = await ai.caches.get({name: cacheName});
          const response = await ai.models.generateContent({
            model: modelName,
            contents: 'Find a lighthearted moment from this transcript',
            config: {cachedContent: retrievedCache.name},
          });
          console.log('Response text:', response.text);
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
          cacheName := cache.Name

          // Later retrieve the cache.
          cache, err = client.Caches.Get(ctx, cacheName, &genai.GetCachedContentConfig{})
          if err != nil {
              log.Fatal(err)
          }

          response, err := client.Models.GenerateContent(
              ctx,
              modelName,
              genai.Text("Find a lighthearted moment from this transcript"),
              &genai.GenerateContentConfig{
                  CachedContent: cache.Name,
              },
          )
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println("Response from cache (create from name):")
          printResponse(response)
          ```

=== "從對話"


    === "Python"

          ```python
          from google import genai
          from google.genai import types

          client = genai.Client(http_options={"api_version": "v1beta"})
          model_name = "gemini-3.8-flash"
          system_instruction = "You are an expert analyzing transcripts."

          # Create a chat session with the given system instruction.
          chat = client.chats.create(
              model=model_name,
              config=types.GenerateContentConfig(
                  system_instruction=system_instruction
              ),
          )
          document = client.files.upload(file=media / "a11.txt")

          response = chat.send_message(
              message=["Hi, could you summarize this transcript?", document]
          )
          print("\n\nmodel:  ", response.text)
          response = chat.send_message(
              message=["Okay, could you tell me more about the trans-lunar injection"]
          )
          print("\n\nmodel:  ", response.text)

          # To cache the conversation so far, pass the chat history as the list of contents.
          cache = client.caches.create(
              model=model_name,
              config={
                  "contents": chat.get_history(),
                  "system_instruction": system_instruction,
              },
          )
          # Continue the conversation using the cached content.
          chat = client.chats.create(
              model=model_name,
              config=types.GenerateContentConfig(cached_content=cache.name),
          )
          response = chat.send_message(
              message=(
                  "I didn't understand that last part, could you explain it in"
                  " simpler language?"
              )
          )
          print("\n\nmodel:  ", response.text)
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            apiVersion: 'v1beta',
          });
          const modelName = 'gemini-3.8-flash';
          const systemInstruction = 'You are an expert analyzing transcripts.';

          // Create a chat session with the system instruction.
          const chat = ai.chats.create({
            model: modelName,
            config: {systemInstruction: systemInstruction},
          });
          const filePath = path.join(media, 'a11.txt');
          const document = await ai.files.upload({
            file: filePath,
            config: {mimeType: 'text/plain'},
          });
          console.log('Uploaded file name:', document.name);

          let response = await chat.sendMessage({
            message: createUserContent([
              'Hi, could you summarize this transcript?',
              createPartFromUri(document.uri, document.mimeType),
            ]),
          });
          console.log('\n\nmodel:', response.text);

          response = await chat.sendMessage({
            message: 'Okay, could you tell me more about the trans-lunar injection',
          });
          console.log('\n\nmodel:', response.text);

          // To cache the conversation so far, pass the chat history as the list of
          // contents.
          const chatHistory = chat.getHistory();
          const cache = await ai.caches.create({
            model: modelName,
            config: {
              contents: chatHistory,
              systemInstruction: systemInstruction,
            },
          });

          // Continue the conversation using the cached content.
          const chatWithCache = ai.chats.create({
            model: modelName,
            config: {cachedContent: cache.name},
          });
          response = await chatWithCache.sendMessage({
            message:
                'I didn\'t understand that last part, could you explain it in simpler language?',
          });
          console.log('\n\nmodel:', response.text);
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
          systemInstruction := "You are an expert analyzing transcripts."

          // Create initial chat with a system instruction.
          chat, err := client.Chats.Create(ctx, modelName, &genai.GenerateContentConfig{
              SystemInstruction: genai.NewContentFromText(systemInstruction, genai.RoleUser),
          }, nil)
          if err != nil {
              log.Fatal(err)
          }

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

          // Send first message with the transcript.
          parts := make([]genai.Part, 2)
          parts[0] = genai.Part{Text: "Hi, could you summarize this transcript?"}
          parts[1] = genai.Part{
              FileData: &genai.FileData{
                  FileURI:  document.URI,
                  MIMEType: document.MIMEType,
              },
          }

          // Send chat message.
          resp, err := chat.SendMessage(ctx, parts...)
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println("\n\nmodel: ", resp.Text())

          resp, err = chat.SendMessage(
              ctx,
              genai.Part{
                  Text: "Okay, could you tell me more about the trans-lunar injection",
              },
          )
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println("\n\nmodel: ", resp.Text())

          // To cache the conversation so far, pass the chat history as the list of contents.
          cache, err := client.Caches.Create(ctx, modelName, &genai.CreateCachedContentConfig{
              Contents:          chat.History(false),
              SystemInstruction: genai.NewContentFromText(systemInstruction, genai.RoleUser),
          })
          if err != nil {
              log.Fatal(err)
          }

          // Continue the conversation using the cached history.
          chat, err = client.Chats.Create(ctx, modelName, &genai.GenerateContentConfig{
              CachedContent: cache.Name,
          }, nil)
          if err != nil {
              log.Fatal(err)
          }

          resp, err = chat.SendMessage(
              ctx,
              genai.Part{
                  Text: "I didn't understand that last part, could you explain it in simpler language?",
              },
          )
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println("\n\nmodel: ", resp.Text())
          ```


  


## 回應 {#response}


  **model**：必填 `string`

  不可變更。快取內容要使用的 `Model` 名稱。格式：`models/{model}`

  

---


  

<details>
<summary>**expiration**：`Union type`，指定此資源何時到期。</summary>

  

  聯集欄位 `expiration` 只能是下列其中一項：

  **expireTime**：`string`

  以 UTC 表示的時間戳，代表此資源被視為到期的時間。此欄位在輸出時*一律*會提供，無論輸入時送了什麼。

  

</details>


  

---


  **name**：`string`

  僅供輸出。識別碼。指向快取內容的資源名稱。格式：`cachedContents/{id}`

  

---


  **displayName**：`string`

  選填。不可變更。由使用者產生、具意義的快取內容顯示名稱。最多 128 個 Unicode 字元。

  

---


  **createTime**：`string`

  僅供輸出。快取項目的建立時間。

  

---


  **updateTime**：`string`

  僅供輸出。快取項目上次更新的 UTC 時間。

  

---


  

<details>
<summary>**usageMetadata**：`CachedContentUsageMetadata`，僅供輸出。快取內容使用情形的中繼資料。</summary>

  

  **totalTokenCount**：`integer`

  快取內容所消耗的權杖總數。

  

</details>


