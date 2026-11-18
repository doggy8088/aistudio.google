# 建立嵌入批次

`POST` `https://generativelanguage.googleapis.com/v1beta/models/{model}:asyncBatchEmbedContent`

將一批 `EmbedContent` 請求排入佇列，以進行批次處理。
`BatchEmbedContents` 處理常式已存在於 `GenerativeService` 中，但該處理常式為同步處理。因此將此處命名為 `Async`，以避免混淆。


  
## 參數 {#parameters}

  
  **model**: required `string`

  模型 ID，例如 `gemini-2.5-flash`。組成資源名稱 `models/{model}`。

  

## 請求主體 {#request-body}

  
  **batch**: required [`EmbedContentBatch`](/api-reference/embeddings/async-batch-embed-content/#Resource:EmbedContentBatch)

  要建立的批次。

  

  

  
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

  
  

??? note "**error**: `Status` 操作在失敗或取消時的錯誤結果。"

    **code**: `integer`

    狀態碼，應為 google.rpc.Code 的列舉值。

    **message**: `string`

    面向開發人員的錯誤訊息，應以英文撰寫。任何面向使用者的錯誤訊息都應予以在地化，並放在 google.rpc.Status.details 欄位中傳送，或由用戶端進行在地化。

    **details**: `object array`

    承載錯誤詳細資訊的訊息清單。API 可使用一組常見的訊息類型。



  

---


  

??? note "**response**: `AsyncBatchEmbedContentResponse`"

    ??? note "**output**: `EmbedContentBatchOutput` 僅供輸出。批次請求的輸出。"

        ??? note "**output**: `Union type` 批次請求的輸出。"

              聯集欄位 `output` 只能是下列其中之一：

              **responsesFile**: `string`

              僅供輸出。包含回應之檔案的檔案 ID。該檔案為 JSONL 檔案，每行包含一個回應。回應將為格式化為 JSON 的 [`EmbedContentResponse`](/api-reference/embeddings/async-batch-embed-content/#Resource:EmbedContentResponse) 訊息。回應的寫入順序與輸入請求相同。



            ??? note "**inlinedResponses**: `InlinedEmbedContentResponses` 僅供輸出。批次中各請求的回應。當批次是使用內嵌請求建立時才會傳回。回應的順序與輸入請求相同。"

                ??? note "**inlinedResponses**: `InlinedEmbedContentResponse array` 僅供輸出。批次中各請求的回應。"

                    ??? note "**output**: `Union type` 請求的輸出。"

                          聯集欄位 `output` 只能是下列其中之一：



                        ??? note "**error**: `Status` 僅供輸出。處理請求時遇到的錯誤。"

                            **code**: `integer`

                            狀態碼，應為 google.rpc.Code 的列舉值。

                            **message**: `string`

                            面向開發人員的錯誤訊息，應以英文撰寫。任何面向使用者的錯誤訊息都應予以在地化，並放在 google.rpc.Status.details 欄位中傳送，或由用戶端進行在地化。

                            **details**: `object array`

                            承載錯誤詳細資訊的訊息清單。API 可使用一組常見的訊息類型。



                          **response**: [`EmbedContentResponse`](/api-reference/embeddings/async-batch-embed-content/#Resource:EmbedContentResponse)

                          僅供輸出。請求的回應。



                      **metadata**: `object`

                      僅供輸出。與請求相關聯的中繼資料。



  

---


  **name**: `string`

  由伺服器指派的名稱，僅在最初傳回它的同一個服務內具唯一性。若使用預設的 HTTP 對應，`name` 應為以 `operations/{unique_id}` 結尾的資源名稱。

  

---


  **metadata**: [`EmbedContentBatch`](/api-reference/embeddings/async-batch-embed-content/#Resource:EmbedContentBatch)

  

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

### EmbedContentResponse {#Resource:EmbedContentResponse}

`EmbedContentRequest` 的回應。

**Properties:**


  **embedding**: [`ContentEmbedding`](/api-reference/embeddings/async-batch-embed-content/#Resource:ContentEmbedding)

  僅供輸出。由輸入內容產生的嵌入向量。

  

---


  **usageMetadata**: [`EmbeddingUsageMetadata`](/api-reference/embeddings/async-batch-embed-content/#Resource:EmbeddingUsageMetadata)

  僅供輸出。請求的使用量中繼資料。


### ContentEmbedding {#Resource:ContentEmbedding}

表示嵌入向量的一組浮點數清單。

**Properties:**


  **values**: `number array`

  嵌入向量值。此欄位僅供 3P 使用者使用，1P 呼叫時不會填入。

  

---


  **shape**: `integer array`

  此欄位儲存軟權杖張量框架的形狀（例如 [1, 1, 256, 2048]）。


### TaskType {#Resource:TaskType}

**Possible values:**

- `TASK_TYPE_UNSPECIFIED`: 未設定的值，將預設為其他列舉值之一。
- `RETRIEVAL_QUERY`: 指定給定的文字為搜尋／擷取情境中的查詢。
- `RETRIEVAL_DOCUMENT`: 指定給定的文字為所搜尋語料庫中的文件。
- `SEMANTIC_SIMILARITY`: 指定給定的文字將用於 STS。
- `CLASSIFICATION`: 指定給定的文字將進行分類。
- `CLUSTERING`: 指定嵌入向量將用於分群。
- `QUESTION_ANSWERING`: 指定給定的文字將用於問答。
- `FACT_VERIFICATION`: 指定給定的文字將用於事實查核。
- `CODE_RETRIEVAL_QUERY`: 指定給定的文字將用於程式碼擷取。

### EmbedContentBatch {#Resource:EmbedContentBatch}

表示一批 `EmbedContent` 請求的資源。

**Properties:**


  **model**: required `string`

  用於產生完成結果的 `Model` 名稱。格式：`models/{model}`。

  

---


  **displayName**: required `string`

  此批次由使用者定義的名稱。

  

---


  

??? note "**inputConfig**: required `InputEmbedContentConfig` 要執行批次處理之執行個體的輸入設定。"

    ??? note "**source**: required `Union type` 輸入的來源。"

          聯集欄位 `source` 只能是下列其中之一：

          **fileName**: `string`

          包含輸入請求的 `File` 名稱。



        ??? note "**requests**: `InlinedEmbedContentRequests` 要在批次中處理的請求。"

            ??? note "**requests**: required `InlinedEmbedContentRequest array` 要在批次中處理的請求。"

                ??? note "**request**: required `EmbedContentRequest` 要在批次中處理的請求。"

                      **model**: required `string`

                      模型的資源名稱。此名稱作為要使用的 Model 的 ID。此名稱應與 `ListModels` 方法傳回的模型名稱相符。格式：`models/{model}`



                    ??? note "**content**: required `Content` 要嵌入的內容。僅會計算 `parts.text` 欄位。"

                        ??? note "**parts**: `Part array` 組成單一訊息的有序 `Parts`。各 Part 可能具有不同的 MIME 類型。"

                            ??? note "**data**: `Union type`"

                                  聯集欄位 `data` 只能是下列其中之一：

                                  **text**: `string`

                                  內嵌文字。



                                ??? note "**inlineData**: `Blob` 內嵌媒體位元組。"

                                    **mimeType**: `string`

                                    來源資料的 IANA 標準 MIME 類型。支援的類型範例如下：

                                    - 圖片： image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
                                    - Audio: audio/*, video/audio/s16le, video/audio/wav
                                    - Video: video/*
                                    - 文字： text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
                                    - 應用程式： application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf 如需更多背景資訊，請參閱 [Supported file formats](/docs/file-input-methods/#supported-content-types)。

                                    **data**: `string`

                                    媒體格式的原始位元組。

                                    **displayName**: `string`

                                    選填。指定用來向模型指稱此 blob 的名稱（例如 "my_blob.png"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 參照識別碼使用。





                                ??? note "**functionCall**: `FunctionCall` 模型傳回的預測 `FunctionCall`，其中包含表示 `FunctionDeclaration.name` 的字串，以及引數和其值。"

                                    **name**: required `string`

                                    要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線和連字號，長度上限為 128。

                                    **id**: `string`

                                    選填。函式呼叫的唯一識別碼。若已填入，用戶端應執行 `function_call`，並傳回具有相符 `id` 的回應。

                                    **args**: `object`

                                    選填。以 JSON 物件格式表示的函式參數和值。





                                ??? note "**functionResponse**: `FunctionResponse` `FunctionCall` 的結果輸出，其中包含表示 `FunctionDeclaration.name` 的字串，以及包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文使用。"

                                      **name**: required `string`

                                      要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線和連字號，長度上限為 128。

                                      **response**: required `object`

                                      以 JSON 物件格式表示的函式回應。呼叫端可使用任何符合函式語法的自選鍵來傳回函式輸出，例如 "output"、"result" 等。特別是，若函式呼叫執行失敗，回應可包含 "error" 鍵，將錯誤詳細資訊傳回給模型。多媒體內容可透過包含單一 "$ref" 鍵的子物件納入，其值為 `inline_data.display_name` 或 `file_data.display_name`，屬於持有該多媒體內容的 `FunctionResponsePart`。請參閱 [Multimodal function responses](/docs/function-calling/#multimodal)。

                                      **id**: `string`

                                      選填。此回應所對應之函式呼叫的識別碼。由用戶端填入，以符合對應函式呼叫的 `id`。



                                    ??? note "**parts**: `FunctionResponsePart array` 選填。組成函式回應的有序 `Parts`。各 Part 可能具有不同的 IANA MIME 類型。"

                                        ??? note "**data**: `Union type` 函式回應部分的資料。"

                                              聯集欄位 `data` 只能是下列其中之一：



                                            ??? note "**inlineData**: `FunctionResponseBlob` 內嵌媒體位元組。"

                                                **mimeType**: `string`

                                                來源資料的 IANA 標準 MIME 類型。範例：

                                                - image/png
                                                - image/jpeg

                                                若提供不支援的 MIME 類型，將傳回錯誤。如需支援類型的完整清單，請參閱 [Supported file formats](/docs/file-input-methods/#supported-content-types)。

                                                **data**: `string`

                                                媒體格式的原始位元組。

                                                **displayName**: `string`

                                                選填。blob 的顯示名稱。用於提供標籤或檔名以區分各 blob，並可從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                            ??? note "**fileData**: `FunctionResponseFileData` 以 URI 為基礎的資料。"

                                                **fileUri**: required `string`

                                                URI。

                                                **mimeType**: `string`

                                                來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將傳回錯誤。如需支援類型的完整清單，請參閱 [Multimodal function responses](/docs/function-calling/#multimodal) 和 [Supported file formats](/docs/file-input-methods/#supported-content-types)。

                                                **displayName**: `string`

                                                選填。檔案的顯示名稱。用於提供標籤或檔名以區分檔案資料，並可從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                        ??? note "**metadata**: `Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個部分的靜態媒體預處理。"


                                              聯集欄位 `metadata` 只能是下列其中之一：


                                            ??? note "**videoMetadata**: `VideoMetadata` 選填。影片中繼資料。中繼資料僅應在影片資料以 inline_data 或 file_data 呈現時指定。"


                                                  **startOffset**: `string`

                                                  選填。影片的開始偏移量。

                                                  **endOffset**: `string`

                                                  選填。影片的結束偏移量。

                                                  **fps**: `number`

                                                  選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。


                                                ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                                                      Possible values:

                                                      - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                                                      - `FRAMES`: 擷取影片影格。
                                                      - `AUDIO`: 擷取音軌。
                                                      - `TRANSCRIPT`: 擷取音訊逐字稿。


                                            ??? note "**documentMetadata**: `DocumentMetadata` 選填。文件中繼資料。中繼資料僅應在文件資料以 inline_data 或 file_data 呈現時指定。"


                                                  **startPage**: `integer`

                                                  選填。起始頁，以 1 起算，包含起始頁。

                                                  **endPage**: `integer`

                                                  選填。結束頁，以 1 起算，包含結束頁。


                                                ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                                                      Possible values:

                                                      - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                                                      - `PAGE_IMAGE`: 轉譯後的頁面影像。
                                                      - `PAGE_TEXT`: 擷取的頁面文字。


                                            ??? note "**spreadsheetMetadata**: `SpreadsheetMetadata` 選填。試算表中繼資料。中繼資料僅應在試算表資料以 inline_data 或 file_data 呈現時指定。"


                                                  **visibleCells**: `string`

                                                  選填。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                                                  **sheetIndex**: `integer`

                                                  選填。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                                                ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                                                      Possible values:

                                                      - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                                                      - `DATA`: 儲存格值、合併儲存格與格式。
                                                      - `FORMULAS`: 公式運算式及其計算結果。
                                                      - `VISUAL`: 工作表的轉譯影像。


                                            ??? note "**audioMetadata**: `AudioMetadata` 選填。音訊中繼資料。中繼資料僅應在音訊資料以 inline_data 或 file_data 呈現時指定。"


                                                  **startOffset**: `string`

                                                  選填。音訊的開始偏移，相對於音訊串流的開頭量。

                                                  **endOffset**: `string`

                                                  選填。音訊的結束偏移，相對於音訊串流的開頭量。


                                        ??? note "**mediaProcessing**: `string enum` 選填。模型如何處理此部分的媒體以進行理解。僅對影片部分（具有影片 MIME 的 `inline_data` 或 `file_data`）有意義。非影片部分會忽略此欄位。"

                                            Possible values:

                                            - `MEDIA_PROCESSING_UNSPECIFIED`: 預設為模型專屬的處理方式。
                                            - `STATIC`: 以固定速率擷取影格。所有影格都放入上下文中。
                                            - `AGENTIC`: 由模型驅動的動態導覽。建議用於大多數使用情境。



                                        ??? note "**mediaResolution**: `V1mainMediaResolution` 選填。輸入媒體的媒體解析度。"


                                            ??? note "**value**: `Union type` 媒體解析度等級。"


                                                  聯集欄位 `value` 只能是下列其中之一：


                                                ??? note "**level**: `string enum` 用於給定媒體的權杖化品質。適用於 Gemini API 支援。"


                                                      Possible values:

                                                      - `MEDIA_RESOLUTION_UNSPECIFIED`: 尚未設定媒體解析度。
                                                      - `MEDIA_RESOLUTION_LOW`: 媒體解析度設為低。
                                                      - `MEDIA_RESOLUTION_MEDIUM`: 媒體解析度設為中。
                                                      - `MEDIA_RESOLUTION_HIGH`: 媒體解析度設為高。
                                                      - `MEDIA_RESOLUTION_ULTRA_HIGH`: 媒體解析度設為超高。


                                      **willContinue**: `boolean`

                                      選填。表示函式呼叫將繼續，且將傳回更多回應，使函式呼叫轉為產生器。僅適用於 NON_BLOCKING 函式呼叫，否則會被忽略。若設為 false，後續回應將不予考慮。允許傳回空的 `response` 並將 `will_continue=False`，以表示函式呼叫已完成。這仍可能觸發模型產生。若要避免觸發產生並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。



                                    ??? note "**scheduling**: `string enum` 選填。指定回應應如何在對話中排程。僅適用於 NON_BLOCKING 函式呼叫，否則會被忽略。預設為 WHEN_IDLE。"

                                        Possible values:

                                        - `SCHEDULING_UNSPECIFIED`: 此值未使用。
                                        - `SILENT`: 僅將結果加入對話上下文，不中斷也不觸發產生。
                                        - `WHEN_IDLE`: 將結果加入對話上下文，並提示產生輸出，但不中斷進行中的產生。
                                        - `INTERRUPT`: 將結果加入對話上下文，中斷進行中的產生，並提示產生輸出。





                                ??? note "**fileData**: `FileData` 以 URI 為基礎的資料。"

                                    **fileUri**: required `string`

                                    URI。

                                    **mimeType**: `string`

                                    選填。來源資料的 IANA 標準 MIME 類型。

                                    **displayName**: `string`

                                    選填。指定用來向模型指稱此檔案的名稱（例如 "my_file.pdf"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案參照識別碼使用。





                                ??? note "**executableCode**: `ExecutableCode` 由模型產生、預定要執行的程式碼。"

                                    ??? note "**language**: required `string enum` `code` 的程式設計語言。"

                                        Possible values:

                                        - `LANGUAGE_UNSPECIFIED`: 未指定的語言。不應使用此值。
                                        - `PYTHON`: Python >= 3.10，可使用 numpy 和 simpy。Python 為預設語言。



                                      **code**: required `string`

                                      要執行的程式碼。

                                      **id**: `string`

                                      選填。`ExecutableCode` 部分的唯一識別碼。伺服器會傳回 `CodeExecutionResult`，其 `id` 與之相符。





                                ??? note "**codeExecutionResult**: `CodeExecutionResult` 執行 `ExecutableCode` 的結果。"

                                    ??? note "**outcome**: required `string enum` 程式碼執行的結果。"

                                        Possible values:

                                        - `OUTCOME_UNSPECIFIED`: 未指定的狀態。不應使用此值。
                                        - `OUTCOME_OK`: 程式碼執行成功完成。`output` 包含 stdout（如有）。
                                        - `OUTCOME_FAILED`: 程式碼執行失敗。`output` 包含 stderr 和 stdout（如有）。
                                        - `OUTCOME_DEADLINE_EXCEEDED`: 程式碼執行時間過長，已遭取消。可能有也可能沒有部分 `output`。



                                      **id**: `string`

                                      選填。此結果所對應之 `ExecutableCode` 部分的識別碼。僅在對應的 `ExecutableCode` 具有 id 時才會填入。

                                      **output**: `string`

                                      選填。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。





                                ??? note "**toolCall**: `ToolCall` 伺服器端工具呼叫。當模型預測應在伺服器上執行的工具叫用時，會填入此欄位。用戶端應將此訊息回傳給 API。"

                                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型。"

                                        Possible values:

                                        - `TOOL_TYPE_UNSPECIFIED`: 未指定的工具類型。
                                        - `GOOGLE_SEARCH_WEB`: Google 搜尋工具，對應至 Tool.google_search.search_types.web_search。
                                        - `GOOGLE_SEARCH_IMAGE`: 圖片搜尋工具，對應至 Tool.google_search.search_types.image_search。
                                        - `URL_CONTEXT`: URL 上下文工具，對應至 Tool.url_context。
                                        - `GOOGLE_MAPS`: Google 地圖工具，對應至 Tool.google_maps。
                                        - `FILE_SEARCH`: 檔案搜尋工具，對應至 Tool.file_search。
                                        - `MEDIA_PROCESSING`: 媒體處理工具類型（例如影片、音訊等），對應至用於多模態理解的隱形工具，例如 GOOGLE_UNDERSTANDING_VIDEO。



                                      **id**: `string`

                                      選填。工具呼叫的唯一識別碼。伺服器會傳回具有相符 `id` 的工具回應。

                                      **toolName**: `string`

                                      選填。被呼叫的工具名稱。

                                      **args**: `object`

                                      選填。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





                                ??? note "**toolResponse**: `ToolResponse` 伺服器端 `ToolCall` 執行的輸出。當用戶端執行對應的 `ToolCall` 後，會以其結果填入此欄位。"

                                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型，與 `tool_type`（位於對應的 `ToolCall` 中）相符。"

                                        Possible values:

                                        - `TOOL_TYPE_UNSPECIFIED`: 未指定的工具類型。
                                        - `GOOGLE_SEARCH_WEB`: Google 搜尋工具，對應至 Tool.google_search.search_types.web_search。
                                        - `GOOGLE_SEARCH_IMAGE`: 圖片搜尋工具，對應至 Tool.google_search.search_types.image_search。
                                        - `URL_CONTEXT`: URL 上下文工具，對應至 Tool.url_context。
                                        - `GOOGLE_MAPS`: Google 地圖工具，對應至 Tool.google_maps。
                                        - `FILE_SEARCH`: 檔案搜尋工具，對應至 Tool.file_search。
                                        - `MEDIA_PROCESSING`: 媒體處理工具類型（例如影片、音訊等），對應至用於多模態理解的隱形工具，例如 GOOGLE_UNDERSTANDING_VIDEO。



                                      **id**: `string`

                                      選填。此回應所對應之工具呼叫的識別碼。

                                      **response**: `object`

                                      選填。工具回應。





                            ??? note "**metadata**: `Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個部分的靜態媒體預處理。"

                                  聯集欄位 `metadata` 只能是下列其中之一：



                                ??? note "**videoMetadata**: `VideoMetadata` 選填。影片中繼資料。中繼資料僅應在影片資料以 inline_data 或 file_data 呈現時指定。"

                                    **startOffset**: `string`

                                    選填。影片的開始偏移量。

                                    **endOffset**: `string`

                                    選填。影片的結束偏移量。

                                    **fps**: `number`

                                    選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。


                                    ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                                          Possible values:

                                          - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                                          - `FRAMES`: 擷取影片影格。
                                          - `AUDIO`: 擷取音軌。
                                          - `TRANSCRIPT`: 擷取音訊逐字稿。


                                ??? note "**documentMetadata**: `DocumentMetadata` 選填。文件中繼資料。中繼資料僅應在文件資料以 inline_data 或 file_data 呈現時指定。"


                                      **startPage**: `integer`

                                      選填。起始頁，以 1 起算，包含起始頁。

                                      **endPage**: `integer`

                                      選填。結束頁，以 1 起算，包含結束頁。


                                    ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                                          Possible values:

                                          - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                                          - `PAGE_IMAGE`: 轉譯後的頁面影像。
                                          - `PAGE_TEXT`: 擷取的頁面文字。


                                ??? note "**spreadsheetMetadata**: `SpreadsheetMetadata` 選填。試算表中繼資料。中繼資料僅應在試算表資料以 inline_data 或 file_data 呈現時指定。"


                                      **visibleCells**: `string`

                                      選填。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                                      **sheetIndex**: `integer`

                                      選填。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                                    ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                                          Possible values:

                                          - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                                          - `DATA`: 儲存格值、合併儲存格與格式。
                                          - `FORMULAS`: 公式運算式及其計算結果。
                                          - `VISUAL`: 工作表的轉譯影像。


                                ??? note "**audioMetadata**: `AudioMetadata` 選填。音訊中繼資料。中繼資料僅應在音訊資料以 inline_data 或 file_data 呈現時指定。"


                                      **startOffset**: `string`

                                      選填。音訊的開始偏移，相對於音訊串流的開頭量。

                                      **endOffset**: `string`

                                      選填。音訊的結束偏移，相對於音訊串流的開頭量。



                              **thought**: `boolean`

                              選填。表示該部分是否為模型的思考內容。

                              **thoughtSignature**: `string`

                              選填。思考內容的不透明簽章，以便在後續請求中重複使用。

                              **partMetadata**: `object`

                              與 Part 相關聯的自訂中繼資料。使用 genai.Part 作為內容表示法的代理，可能需要追蹤額外資訊。例如，可以是 Part 來源檔案／來源的名稱，或是多工處理多個 Part 串流的方式。



                            ??? note "**mediaResolution**: `V1mainMediaResolution` 選填。輸入媒體的媒體解析度。"

                                ??? note "**value**: `Union type` 媒體解析度等級。"

                                      聯集欄位 `value` 只能是下列其中之一：



                                    ??? note "**level**: `string enum` 用於給定媒體的權杖化品質。適用於 Gemini API 支援。"

                                        Possible values:

                                        - `MEDIA_RESOLUTION_UNSPECIFIED`: 尚未設定媒體解析度。
                                        - `MEDIA_RESOLUTION_LOW`: 媒體解析度設為低。
                                        - `MEDIA_RESOLUTION_MEDIUM`: 媒體解析度設為中。
                                        - `MEDIA_RESOLUTION_HIGH`: 媒體解析度設為高。
                                        - `MEDIA_RESOLUTION_ULTRA_HIGH`: 媒體解析度設為超高。





                            ??? note "**mediaProcessing**: `string enum` 選填。模型如何處理此部分的媒體以進行理解。僅對影片部分（具有影片 MIME 的 `inline_data` 或 `file_data`）有意義。非影片部分會忽略此欄位。"

                                Possible values:

                                - `MEDIA_PROCESSING_UNSPECIFIED`: 預設為模型專屬的處理方式。
                                - `STATIC`: 以固定速率擷取影格。所有影格都放入上下文中。
                                - `AGENTIC`: 由模型驅動的動態導覽。建議用於大多數使用情境。





                            ??? note "**audioTranscription**: `AudioTranscription` 選填。音訊（輸入或輸出）轉錄。僅在此 Part 包含音訊資料時設定。"

                                  **text**: required `string`

                                  此音訊片段的轉錄文字。

                                  **speakerLabel**: `string`

                                  選填。識別此音訊片段說話者的標籤（例如 "spk_1"、"spk_2"）。在設定語者分離時出現。



                                ??? note "**words**: `WordInfo array` 選填。詳細的單字層級轉錄和時間詳細資訊。在設定 word_timestamp 時出現。"

                                    **word**: required `string`

                                    單字的轉錄內容。

                                    **startOffset**: `string`

                                    選填。單字相對於音訊開頭的時間開始偏移量。

                                    **endOffset**: `string`

                                    選填。單字相對於音訊開頭的時間結束偏移量。





                            ??? note "**speechMetadata**: `SpeechMetadata` 選填。套用至文字部分的中繼資料，用於自訂其朗讀或合成方式，例如指定說話者身分或說話風格。"

                                **speaker**: `string`

                                選填。多說話者合成的選填說話者名稱。

                                **style**: `string`

                                選填。語音合成的選填風格指令。



                          **role**: `string`

                          選填。內容的產生者。必須為 'user' 或 'model' 其中之一。適用於多輪對話時設定，否則可留空或不設定。



                      **embedContentConfig**: [`EmbedContentConfig`](/api-reference/embeddings/async-batch-embed-content/#Resource:EmbedContentConfig)

                      選填。EmbedContent 請求的設定。



                  **metadata**: `object`

                  選填。要與請求相關聯的中繼資料。



  

---


  **name**: `string`

  僅供輸出。識別碼。批次的資源名稱。格式：`batches/{batch_id}`。

  

---


  

??? note "**output**: `EmbedContentBatchOutput` 僅供輸出。批次請求的輸出。"

    ??? note "**output**: `Union type` 批次請求的輸出。"

          聯集欄位 `output` 只能是下列其中之一：

          **responsesFile**: `string`

          僅供輸出。包含回應之檔案的檔案 ID。該檔案為 JSONL 檔案，每行包含一個回應。回應將為格式化為 JSON 的 [`EmbedContentResponse`](/api-reference/embeddings/async-batch-embed-content/#Resource:EmbedContentResponse) 訊息。回應的寫入順序與輸入請求相同。



        ??? note "**inlinedResponses**: `InlinedEmbedContentResponses` 僅供輸出。批次中各請求的回應。當批次是使用內嵌請求建立時才會傳回。回應的順序與輸入請求相同。"

            ??? note "**inlinedResponses**: `InlinedEmbedContentResponse array` 僅供輸出。批次中各請求的回應。"

                ??? note "**output**: `Union type` 請求的輸出。"

                      聯集欄位 `output` 只能是下列其中之一：



                    ??? note "**error**: `Status` 僅供輸出。處理請求時遇到的錯誤。"

                        **code**: `integer`

                        狀態碼，應為 google.rpc.Code 的列舉值。

                        **message**: `string`

                        面向開發人員的錯誤訊息，應以英文撰寫。任何面向使用者的錯誤訊息都應予以在地化，並放在 google.rpc.Status.details 欄位中傳送，或由用戶端進行在地化。

                        **details**: `object array`

                        承載錯誤詳細資訊的訊息清單。API 可使用一組常見的訊息類型。



                      **response**: [`EmbedContentResponse`](/api-reference/embeddings/async-batch-embed-content/#Resource:EmbedContentResponse)

                      僅供輸出。請求的回應。



                  **metadata**: `object`

                  僅供輸出。與請求相關聯的中繼資料。



  

---


  **createTime**: `string`

  僅供輸出。批次建立的時間。

  

---


  **endTime**: `string`

  僅供輸出。批次處理完成的時間。

  

---


  **updateTime**: `string`

  僅供輸出。批次最後更新的時間。

  

---


  

??? note "**batchStats**: `EmbedContentBatchStats` 僅供輸出。批次的統計資訊。"

    **requestCount**: `string`

    僅供輸出。批次中的請求數量。

    **successfulRequestCount**: `string`

    僅供輸出。成功處理的請求數量。

    **failedRequestCount**: `string`

    僅供輸出。處理失敗的請求數量。

    **pendingRequestCount**: `string`

    僅供輸出。仍待處理的請求數量。



  

---


  

??? note "**state**: `BatchState` 僅供輸出。批次的狀態。"

    Possible values:

    - `BATCH_STATE_UNSPECIFIED`: 未指定批次狀態。
    - `BATCH_STATE_PENDING`: 服務正在準備執行批次。
    - `BATCH_STATE_RUNNING`: 批次正在進行中。
    - `BATCH_STATE_SUCCEEDED`: 批次已成功完成。
    - `BATCH_STATE_FAILED`: 批次失敗。
    - `BATCH_STATE_CANCELLED`: 批次已取消。
    - `BATCH_STATE_EXPIRED`: 批次已過期。



  

---


  **priority**: `string`

  選填。批次的優先順序。優先順序值較高的批次將先於優先順序值較低的批次處理。允許負值。預設為 0。


### EmbedContentConfig {#Resource:EmbedContentConfig}

EmbedContent 請求的設定。

**Properties:**


  **title**: `string`

  選填。文字的標題。

  

---


  

??? note "**taskType**: [`TaskType`](/api-reference/embeddings/async-batch-embed-content/#Resource:TaskType) 選填。嵌入向量的任務類型。"

    Possible values:

    - `TASK_TYPE_UNSPECIFIED`: 未設定的值，將預設為其他列舉值之一。
    - `RETRIEVAL_QUERY`: 指定給定的文字為搜尋／擷取情境中的查詢。
    - `RETRIEVAL_DOCUMENT`: 指定給定的文字為所搜尋語料庫中的文件。
    - `SEMANTIC_SIMILARITY`: 指定給定的文字將用於 STS。
    - `CLASSIFICATION`: 指定給定的文字將進行分類。
    - `CLUSTERING`: 指定嵌入向量將用於分群。
    - `QUESTION_ANSWERING`: 指定給定的文字將用於問答。
    - `FACT_VERIFICATION`: 指定給定的文字將用於事實查核。
    - `CODE_RETRIEVAL_QUERY`: 指定給定的文字將用於程式碼擷取。



  

---


  **autoTruncate**: `boolean`

  選填。若輸入內容長於最大序列長度，是否靜默截斷輸入內容。

  

---


  **outputDimensionality**: `integer`

  選填。輸出嵌入向量的縮減維度。若已設定，輸出嵌入向量中多餘的值將從尾端截斷。

  

---


  **documentOcr**: `boolean`

  選填。是否為文件內容啟用 OCR。

  

---


  **audioTrackExtraction**: `boolean`

  選填。是否從影片內容中擷取音訊。


### EmbeddingUsageMetadata {#Resource:EmbeddingUsageMetadata}

嵌入請求的使用量中繼資料。

**Properties:**


  **promptTokenCount**: `integer`

  僅供輸出。提示詞中的權杖數量。

  

---


  

??? note "**promptTokenDetails**: `ModalityTokenCount array` 僅供輸出。請求輸入中已處理的模態清單。"

    ??? note "**modality**: `GenerativeLanguageModality` 與此權杖數量相關聯的模態。"

        Possible values:

        - `MODALITY_UNSPECIFIED`: 未指定的模態。
        - `TEXT`: 純文字。
        - `IMAGE`: 圖片。
        - `VIDEO`: 影片。
        - `AUDIO`: 音訊。
        - `DOCUMENT`: 文件，例如 PDF。



      **tokenCount**: `integer`

      權杖數量。
