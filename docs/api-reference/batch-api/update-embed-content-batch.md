# 更新嵌入批次

`PATCH` `https://generativelanguage.googleapis.com/v1beta/batches/{generateContentBatch}:updateEmbedContentBatch`

更新一批供批次處理使用的 EmbedContent 要求。


  
## 參數 {#parameters}

  
  **generateContentBatch**: required `string`

  批次 ID，構成資源名稱 `batches/{generateContentBatch}`。

  

---


  **updateMask**: `string`

  選填。要更新的欄位清單。

  

## 要求主體 {#request-body}

  
  **model**: required `string`

  用於產生補全結果的 `Model` 名稱。格式：`models/{model}`。

  

---


  **displayName**: required `string`

  使用者為這個批次自訂的名稱。

  

---


  

??? note "**inputConfig**: required `InputEmbedContentConfig` 執行批次處理之執行個體的輸入設定。"

    ??? note "**source**: required `Union type` 輸入的來源。"

          聯合欄位 `source` 只能是下列其中之一：

          **fileName**: `string`

          包含輸入要求的 `File` 名稱。



        ??? note "**requests**: `InlinedEmbedContentRequests` 要在批次中處理的要求。"

            ??? note "**requests**: required `InlinedEmbedContentRequest array` 要在批次中處理的要求。"

                ??? note "**request**: required `EmbedContentRequest` 要在批次中處理的要求。"

                      **model**: required `string`

                      模型的資源名稱，作為要使用的 Model 的 ID。此名稱應與 `ListModels` 方法傳回的模型名稱相符。格式：`models/{model}`



                    ??? note "**content**: required `Content` 要嵌入的內容。只有 `parts.text` 欄位會計入。"

                        ??? note "**parts**: `Part array` 構成單一訊息的有序 `Parts`。各 Part 的 MIME 類型可能不同。"

                            ??? note "**data**: `Union type`"

                                  聯合欄位 `data` 只能是下列其中之一：

                                  **text**: `string`

                                  行內文字。



                                ??? note "**inlineData**: `Blob` 行內媒體位元組。"

                                    **mimeType**: `string`

                                    來源資料的 IANA 標準 MIME 類型。支援的類型範例如下：

                                    - 圖片：image/png、image/jpeg、image/jpg、image/webp、image/heic、image/heif、image/gif、image/avif
                                    - 音訊：audio/*、video/audio/s16le、video/audio/wav
                                    - 影片：video/*
                                    - 文字：text/plain、text/html、text/css、text/javascript、text/x-typescript、text/csv、text/markdown、text/x-python、text/xml、text/rtf、video/text/timestamp
                                    - 應用程式：application/x-javascript、application/x-typescript、application/x-python-code、application/json、application/x-ipynb+json、application/rtf、application/pdf。更多背景資訊請參閱 [Supported file formats](/docs/file-input-methods/#supported-content-types)。

                                    **data**: `string`

                                    媒體格式的原始位元組。

                                    **displayName**: `string`

                                    選填。指定向模型提及這個 blob 時所用的名稱（例如「my_blob.png」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 的參照識別碼使用。





                                ??? note "**functionCall**: `FunctionCall` 模型傳回的預測 `FunctionCall`，其中包含一個字串，表示 `FunctionDeclaration.name` 及其引數與引數值。"

                                    **name**: required `string`

                                    要呼叫的函式名稱。必須由 a-z、A-Z、0-9 組成，或包含底線與連字號，長度上限為 128。

                                    **id**: `string`

                                    選填。函式呼叫的唯一識別碼。若有填入，用戶端會執行 `function_call`，並傳回帶有相符 `id` 的回應。

                                    **args**: `object`

                                    選填。以 JSON 物件格式表示的函式參數與值。





                                ??? note "**functionResponse**: `FunctionResponse` `FunctionCall` 的結果輸出，其中包含表示 `FunctionDeclaration.name` 的字串，以及含有函式任何輸出內容的結構化 JSON 物件，作為提供給模型的上下文。"

                                      **name**: required `string`

                                      要呼叫的函式名稱。必須由 a-z、A-Z、0-9 組成，或包含底線與連字號，長度上限為 128。

                                      **response**: required `object`

                                      以 JSON 物件格式表示的函式回應。呼叫端可使用任何符合函式語法的自訂鍵來傳回函式輸出，例如「output」、「result」等。特別是當函式呼叫執行失敗時，回應可帶有「error」鍵，將錯誤詳情傳回給模型。多媒體內容可透過子物件納入，該子物件含有單一「$ref」鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，取自承載該多媒體內容的 `FunctionResponsePart`。請參閱 [Multimodal function responses](/docs/function-calling/#multimodal)。

                                      **id**: `string`

                                      選填。此回應所對應函式呼叫的識別碼。由用戶端填入，以對應相對應函式呼叫的 `id`。



                                    ??? note "**parts**: `FunctionResponsePart array` 選填。構成函式回應的有序 `Parts`。各 Part 的 IANA MIME 類型可能不同。"

                                        ??? note "**data**: `Union type` 函式回應 part 的資料。"

                                              聯合欄位 `data` 只能是下列其中之一：



                                            ??? note "**inlineData**: `FunctionResponseBlob` 行內媒體位元組。"

                                                **mimeType**: `string`

                                                來源資料的 IANA 標準 MIME 類型。範例：

                                                - image/png
                                                - image/jpeg

                                                若提供不支援的 MIME 類型，將傳回錯誤。完整支援類型清單請參閱 [Supported file formats](/docs/file-input-methods/#supported-content-types)。

                                                **data**: `string`

                                                媒體格式的原始位元組。

                                                **displayName**: `string`

                                                選填。blob 的顯示名稱。用於提供標籤或檔名以區分各個 blob，並可從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                            ??? note "**fileData**: `FunctionResponseFileData` 以 URI 為基礎的資料。"

                                                **fileUri**: required `string`

                                                URI.

                                                **mimeType**: `string`

                                                來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將傳回錯誤。完整支援類型清單請參閱 [Multimodal function responses](/docs/function-calling/#multimodal) 與 [Supported file formats](/docs/file-input-methods/#supported-content-types)。

                                                **displayName**: `string`

                                                選填。檔案的顯示名稱。用於提供標籤或檔名以區分檔案資料，並可從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                        ??? note "**metadata**: `Union type` 控制資料的額外前處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個 part 的靜態媒體前處理。"


                                              聯合欄位 `metadata` 只能是下列其中之一：


                                            ??? note "**videoMetadata**: `VideoMetadata` 選填。影片中繼資料。僅在影片資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"


                                                  **startOffset**: `string`

                                                  選填。影片的起始位移。

                                                  **endOffset**: `string`

                                                  選填。影片的結束位移。

                                                  **fps**: `number`

                                                  選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。


                                                ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                                                      可能的值：

                                                      - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                                                      - `FRAMES`：擷取影片影格。
                                                      - `AUDIO`：擷取音軌。
                                                      - `TRANSCRIPT`：擷取音訊逐字稿。


                                            ??? note "**documentMetadata**: `DocumentMetadata` 選填。文件中繼資料。僅在文件資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"


                                                  **startPage**: `integer`

                                                  選填。起始頁，以 1 起算，包含起始頁。

                                                  **endPage**: `integer`

                                                  選填。結束頁，以 1 起算，包含結束頁。


                                                ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                                                      可能的值：

                                                      - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                                                      - `PAGE_IMAGE`：轉譯後的頁面影像。
                                                      - `PAGE_TEXT`：擷取的頁面文字。


                                            ??? note "**spreadsheetMetadata**: `SpreadsheetMetadata` 選填。試算表中繼資料。僅在試算表資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"


                                                  **visibleCells**: `string`

                                                  選填。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                                                  **sheetIndex**: `integer`

                                                  選填。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                                                ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                                                      可能的值：

                                                      - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                                                      - `DATA`：儲存格值、合併儲存格與格式。
                                                      - `FORMULAS`：公式運算式及其計算結果。
                                                      - `VISUAL`：工作表的轉譯影像。


                                            ??? note "**audioMetadata**: `AudioMetadata` 選填。音訊中繼資料。僅在音訊資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"


                                                  **startOffset**: `string`

                                                  選填。音訊的起始位移，相對於音訊串流的開頭。

                                                  **endOffset**: `string`

                                                  選填。音訊的結束位移，相對於音訊串流的開頭。


                                        ??? note "**mediaProcessing**: `string enum` 選填。模型為理解內容而處理這個 part 媒體的方式。僅對影片 part（`inline_data` 或 MIME 為影片的 `file_data`）有意義，非影片 part 會忽略此欄位。"

                                            可能的值：

                                            - `MEDIA_PROCESSING_UNSPECIFIED`：預設採用模型專屬的處理方式。
                                            - `STATIC`：以固定速率擷取影格，所有影格都放入上下文。
                                            - `AGENTIC`：由模型驅動的動態導覽，建議用於大多數使用情境。



                                        ??? note "**mediaResolution**: `V1mainMediaResolution` 選填。輸入媒體的媒體解析度。"


                                            ??? note "**value**: `Union type` 媒體解析度等級。"


                                                  聯合欄位 `value` 只能是下列其中之一：


                                                ??? note "**level**: `string enum` 用於指定媒體的 Tokenizer 品質，適用於 Gemini API 支援。"


                                                      可能的值：

                                                      - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                                                      - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低。
                                                      - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中。
                                                      - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高。
                                                      - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設為超高。


                                      **willContinue**: `boolean`

                                      選填。表示函式呼叫將繼續，並會傳回更多回應，使函式呼叫成為產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會忽略。若設為 false，後續回應將不予考慮。允許傳回空的 `response` 並將 `will_continue=False`，以表示函式呼叫已結束。這仍可能觸發模型產生內容。若要避免觸發產生並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。



                                    ??? note "**scheduling**: `string enum` 選填。指定回應在對話中的排程方式。僅適用於 NON_BLOCKING 函式呼叫，其他情況會忽略。預設為 WHEN_IDLE。"

                                        可能的值：

                                        - `SCHEDULING_UNSPECIFIED`：不使用此值。
                                        - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發產生。
                                        - `WHEN_IDLE`：將結果加入對話上下文，並提示產生輸出，但不中斷進行中的產生。
                                        - `INTERRUPT`：將結果加入對話上下文，中斷進行中的產生，並提示產生輸出。





                                ??? note "**fileData**: `FileData` 以 URI 為基礎的資料。"

                                    **fileUri**: required `string`

                                    URI.

                                    **mimeType**: `string`

                                    選填。來源資料的 IANA 標準 MIME 類型。

                                    **displayName**: `string`

                                    選填。指定向模型提及這個檔案時所用的名稱（例如「my_file.pdf」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案的參照識別碼使用。





                                ??? note "**executableCode**: `ExecutableCode` 由模型產生、供執行的程式碼。"

                                    ??? note "**language**: required `string enum` `code` 的程式語言。"

                                        可能的值：

                                        - `LANGUAGE_UNSPECIFIED`：未指定語言。不應使用此值。
                                        - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 為預設語言。



                                      **code**: required `string`

                                      要執行的程式碼。

                                      **id**: `string`

                                      選填。`ExecutableCode` part 的唯一識別碼。伺服器會傳回 `CodeExecutionResult`，其 `id` 與之相符。





                                ??? note "**codeExecutionResult**: `CodeExecutionResult` 執行 `ExecutableCode` 的結果。"

                                    ??? note "**outcome**: required `string enum` 程式碼執行的結果。"

                                        可能的值：

                                        - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用此值。
                                        - `OUTCOME_OK`：程式碼執行成功完成。`output` 包含 stdout（若有）。
                                        - `OUTCOME_FAILED`：程式碼執行失敗。`output` 包含 stderr 與 stdout（若有）。
                                        - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已取消。可能有也可能沒有部分 `output`。



                                      **id**: `string`

                                      選填。此結果所對應 `ExecutableCode` part 的識別碼。僅在相對應的 `ExecutableCode` 具有 id 時才會填入。

                                      **output**: `string`

                                      選填。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。





                                ??? note "**toolCall**: `ToolCall` 伺服器端工具呼叫。當模型預測有應在伺服器上執行的工具呼叫時，會填入此欄位。用戶端應將此訊息回傳給 API。"

                                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型。"

                                        可能的值：

                                        - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                        - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                        - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                        - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                        - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                        - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                        - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應多模態理解所用的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                      **id**: `string`

                                      選填。工具呼叫的唯一識別碼。伺服器會傳回帶有相符 `id` 的工具回應。

                                      **toolName**: `string`

                                      選填。被呼叫的工具名稱。

                                      **args**: `object`

                                      選填。工具呼叫的引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





                                ??? note "**toolResponse**: `ToolResponse` 伺服器端 `ToolCall` 執行的輸出。用戶端會以執行相對應 `ToolCall` 的結果填入此欄位。"

                                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型；其 `tool_type` 與相對應 `ToolCall` 中的值一致。"

                                        可能的值：

                                        - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                        - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                        - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                        - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                        - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                        - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                        - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應多模態理解所用的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                      **id**: `string`

                                      選填。此回應所對應工具呼叫的識別碼。

                                      **response**: `object`

                                      選填。工具回應。





                            ??? note "**metadata**: `Union type` 控制資料的額外前處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個 part 的靜態媒體前處理。"

                                  聯合欄位 `metadata` 只能是下列其中之一：



                                ??? note "**videoMetadata**: `VideoMetadata` 選填。影片中繼資料。僅在影片資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"

                                    **startOffset**: `string`

                                    選填。影片的起始位移。

                                    **endOffset**: `string`

                                    選填。影片的結束位移。

                                    **fps**: `number`

                                    選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。



                                    ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                                          可能的值：

                                          - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                                          - `FRAMES`：擷取影片影格。
                                          - `AUDIO`：擷取音軌。
                                          - `TRANSCRIPT`：擷取音訊逐字稿。


                                ??? note "**documentMetadata**: `DocumentMetadata` 選填。文件中繼資料。僅在文件資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"


                                      **startPage**: `integer`

                                      選填。起始頁，以 1 起算，包含起始頁。

                                      **endPage**: `integer`

                                      選填。結束頁，以 1 起算，包含結束頁。


                                    ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                                          可能的值：

                                          - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                                          - `PAGE_IMAGE`：轉譯後的頁面影像。
                                          - `PAGE_TEXT`：擷取的頁面文字。


                                ??? note "**spreadsheetMetadata**: `SpreadsheetMetadata` 選填。試算表中繼資料。僅在試算表資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"


                                      **visibleCells**: `string`

                                      選填。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                                      **sheetIndex**: `integer`

                                      選填。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                                    ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                                          可能的值：

                                          - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                                          - `DATA`：儲存格值、合併儲存格與格式。
                                          - `FORMULAS`：公式運算式及其計算結果。
                                          - `VISUAL`：工作表的轉譯影像。


                                ??? note "**audioMetadata**: `AudioMetadata` 選填。音訊中繼資料。僅在音訊資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"


                                      **startOffset**: `string`

                                      選填。音訊的起始位移，相對於音訊串流的開頭。

                                      **endOffset**: `string`

                                      選填。音訊的結束位移，相對於音訊串流的開頭。


                              **thought**: `boolean`

                              選填。表示該 part 是否為模型的思考內容。

                              **thoughtSignature**: `string`

                              選填。思考內容的不透明簽章，可在後續要求中重複使用。

                              **partMetadata**: `object`

                              與 Part 相關聯的自訂中繼資料。使用 genai.Part 作為內容表示方式的代理，可能需要追蹤額外資訊。例如 Part 來源檔案／來源的名稱，或多工處理多個 Part 串流的方式。



                            ??? note "**mediaResolution**: `V1mainMediaResolution` 選填。輸入媒體的媒體解析度。"

                                ??? note "**value**: `Union type` 媒體解析度等級。"

                                      聯合欄位 `value` 只能是下列其中之一：



                                    ??? note "**level**: `string enum` 用於指定媒體的 Tokenizer 品質，適用於 Gemini API 支援。"

                                        可能的值：

                                        - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                                        - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低。
                                        - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中。
                                        - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高。
                                        - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設為超高。





                            ??? note "**mediaProcessing**: `string enum` 選填。模型為理解內容而處理這個 part 媒體的方式。僅對影片 part（`inline_data` 或 MIME 為影片的 `file_data`）有意義，非影片 part 會忽略此欄位。"

                                可能的值：

                                - `MEDIA_PROCESSING_UNSPECIFIED`：預設採用模型專屬的處理方式。
                                - `STATIC`：以固定速率擷取影格，所有影格都放入上下文。
                                - `AGENTIC`：由模型驅動的動態導覽，建議用於大多數使用情境。





                            ??? note "**audioTranscription**: `AudioTranscription` 選填。音訊（輸入或輸出）轉錄。僅當這個 Part 含有音訊資料時才會設定。"

                                  **text**: required `string`

                                  這個音訊片段的轉錄文字。

                                  **speakerLabel**: `string`

                                  選填。標示這個音訊片段說話者的標籤（例如「spk_1」、「spk_2」）。設定語者分離時會出現。



                                ??? note "**words**: `WordInfo array` 選填。詳細的單字層級轉錄與時間詳情。設定 word_timestamp 時會出現。"

                                    **word**: required `string`

                                    單字的轉錄。

                                    **startOffset**: `string`

                                    選填。單字相對於音訊開頭的起始時間位移。

                                    **endOffset**: `string`

                                    選填。單字相對於音訊開頭的結束時間位移。





                            ??? note "**speechMetadata**: `SpeechMetadata` 選填。套用於文字 part 的中繼資料，用來訂製朗讀或合成方式，例如指定說話者身分或說話風格。"

                                **speaker**: `string`

                                選填。多說話者合成時可選填的說話者名稱。

                                **style**: `string`

                                選填。語音合成時可選填的風格指令。



                          **role**: `string`

                          選填。內容的產生者，必須是 'user' 或 'model'。在多輪對話中適合設定，否則可留空或不設定。





                    ??? note "**embedContentConfig**: `EmbedContentConfig` 選填。EmbedContent 要求的設定。"

                          **title**: `string`

                          選填。文字的標題。



                        ??? note "**taskType**: `TaskType` 選填。嵌入的工作類型。"

                            可能的值：

                            - `TASK_TYPE_UNSPECIFIED`：未設定的值，將預設為其他列舉值之一。
                            - `RETRIEVAL_QUERY`：指定所給文字是搜尋／檢索情境中的查詢。
                            - `RETRIEVAL_DOCUMENT`：指定所給文字是被搜尋語料庫中的文件。
                            - `SEMANTIC_SIMILARITY`：指定所給文字將用於 STS。
                            - `CLASSIFICATION`：指定所給文字將進行分類。
                            - `CLUSTERING`：指定嵌入向量將用於分群。
                            - `QUESTION_ANSWERING`：指定所給文字將用於問答。
                            - `FACT_VERIFICATION`：指定所給文字將用於事實查核。
                            - `CODE_RETRIEVAL_QUERY`：指定所給文字將用於程式碼檢索。



                          **autoTruncate**: `boolean`

                          選填。若輸入內容長於最大序列長度，是否靜默截斷。

                          **outputDimensionality**: `integer`

                          選填。輸出嵌入向量的縮減維度。若有設定，輸出嵌入向量中多餘的值會從末端截斷。

                          **documentOcr**: `boolean`

                          選填。是否為文件內容啟用 OCR。

                          **audioTrackExtraction**: `boolean`

                          選填。是否從影片內容擷取音訊。



                  **metadata**: `object`

                  選填。要與要求相關聯的中繼資料。



  

---


  **priority**: `string`

  選填。批次的優先順序。優先值較高的批次會先於優先值較低的批次處理。允許負值，預設為 0。

  

  

  
  **要求範例**

  

=== "REST"

      ```sh
      curl -X PATCH "https://generativelanguage.googleapis.com/v1beta/batches/$BATCH_ID:updateEmbedContentBatch" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
        "model": "string",
        "displayName": "string",
        "inputConfig": {
          "fileName": "string"
        }
      }'
      ```


  


  
## 回應 {#response}

  
  **model**: required `string`

  用於產生補全結果的 `Model` 名稱。格式：`models/{model}`。

  

---


  **displayName**: required `string`

  使用者為這個批次自訂的名稱。

  

---


  

??? note "**inputConfig**: required `InputEmbedContentConfig` 執行批次處理之執行個體的輸入設定。"

    ??? note "**source**: required `Union type` 輸入的來源。"

          聯合欄位 `source` 只能是下列其中之一：

          **fileName**: `string`

          包含輸入要求的 `File` 名稱。



        ??? note "**requests**: `InlinedEmbedContentRequests` 要在批次中處理的要求。"

            ??? note "**requests**: required `InlinedEmbedContentRequest array` 要在批次中處理的要求。"

                ??? note "**request**: required `EmbedContentRequest` 要在批次中處理的要求。"

                      **model**: required `string`

                      模型的資源名稱，作為要使用的 Model 的 ID。此名稱應與 `ListModels` 方法傳回的模型名稱相符。格式：`models/{model}`



                    ??? note "**content**: required `Content` 要嵌入的內容。只有 `parts.text` 欄位會計入。"

                        ??? note "**parts**: `Part array` 構成單一訊息的有序 `Parts`。各 Part 的 MIME 類型可能不同。"

                            ??? note "**data**: `Union type`"

                                  聯合欄位 `data` 只能是下列其中之一：

                                  **text**: `string`

                                  行內文字。



                                ??? note "**inlineData**: `Blob` 行內媒體位元組。"

                                    **mimeType**: `string`

                                    來源資料的 IANA 標準 MIME 類型。支援的類型範例如下：

                                    - 圖片：image/png、image/jpeg、image/jpg、image/webp、image/heic、image/heif、image/gif、image/avif
                                    - 音訊：audio/*、video/audio/s16le、video/audio/wav
                                    - 影片：video/*
                                    - 文字：text/plain、text/html、text/css、text/javascript、text/x-typescript、text/csv、text/markdown、text/x-python、text/xml、text/rtf、video/text/timestamp
                                    - 應用程式：application/x-javascript、application/x-typescript、application/x-python-code、application/json、application/x-ipynb+json、application/rtf、application/pdf。更多背景資訊請參閱 [Supported file formats](/docs/file-input-methods/#supported-content-types)。

                                    **data**: `string`

                                    媒體格式的原始位元組。

                                    **displayName**: `string`

                                    選填。指定向模型提及這個 blob 時所用的名稱（例如「my_blob.png」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 的參照識別碼使用。





                                ??? note "**functionCall**: `FunctionCall` 模型傳回的預測 `FunctionCall`，其中包含一個字串，表示 `FunctionDeclaration.name` 及其引數與引數值。"

                                    **name**: required `string`

                                    要呼叫的函式名稱。必須由 a-z、A-Z、0-9 組成，或包含底線與連字號，長度上限為 128。

                                    **id**: `string`

                                    選填。函式呼叫的唯一識別碼。若有填入，用戶端會執行 `function_call`，並傳回帶有相符 `id` 的回應。

                                    **args**: `object`

                                    選填。以 JSON 物件格式表示的函式參數與值。





                                ??? note "**functionResponse**: `FunctionResponse` `FunctionCall` 的結果輸出，其中包含表示 `FunctionDeclaration.name` 的字串，以及含有函式任何輸出內容的結構化 JSON 物件，作為提供給模型的上下文。"

                                      **name**: required `string`

                                      要呼叫的函式名稱。必須由 a-z、A-Z、0-9 組成，或包含底線與連字號，長度上限為 128。

                                      **response**: required `object`

                                      以 JSON 物件格式表示的函式回應。呼叫端可使用任何符合函式語法的自訂鍵來傳回函式輸出，例如「output」、「result」等。特別是當函式呼叫執行失敗時，回應可帶有「error」鍵，將錯誤詳情傳回給模型。多媒體內容可透過子物件納入，該子物件含有單一「$ref」鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，取自承載該多媒體內容的 `FunctionResponsePart`。請參閱 [Multimodal function responses](/docs/function-calling/#multimodal)。

                                      **id**: `string`

                                      選填。此回應所對應函式呼叫的識別碼。由用戶端填入，以對應相對應函式呼叫的 `id`。



                                    ??? note "**parts**: `FunctionResponsePart array` 選填。構成函式回應的有序 `Parts`。各 Part 的 IANA MIME 類型可能不同。"

                                        ??? note "**data**: `Union type` 函式回應 part 的資料。"

                                              聯合欄位 `data` 只能是下列其中之一：



                                            ??? note "**inlineData**: `FunctionResponseBlob` 行內媒體位元組。"

                                                **mimeType**: `string`

                                                來源資料的 IANA 標準 MIME 類型。範例：

                                                - image/png
                                                - image/jpeg

                                                若提供不支援的 MIME 類型，將傳回錯誤。完整支援類型清單請參閱 [Supported file formats](/docs/file-input-methods/#supported-content-types)。

                                                **data**: `string`

                                                媒體格式的原始位元組。

                                                **displayName**: `string`

                                                選填。blob 的顯示名稱。用於提供標籤或檔名以區分各個 blob，並可從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                            ??? note "**fileData**: `FunctionResponseFileData` 以 URI 為基礎的資料。"

                                                **fileUri**: required `string`

                                                URI.

                                                **mimeType**: `string`

                                                來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將傳回錯誤。完整支援類型清單請參閱 [Multimodal function responses](/docs/function-calling/#multimodal) 與 [Supported file formats](/docs/file-input-methods/#supported-content-types)。

                                                **displayName**: `string`

                                                選填。檔案的顯示名稱。用於提供標籤或檔名以區分檔案資料，並可從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                        ??? note "**metadata**: `Union type` 控制資料的額外前處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個 part 的靜態媒體前處理。"


                                              聯合欄位 `metadata` 只能是下列其中之一：


                                            ??? note "**videoMetadata**: `VideoMetadata` 選填。影片中繼資料。僅在影片資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"


                                                  **startOffset**: `string`

                                                  選填。影片的起始位移。

                                                  **endOffset**: `string`

                                                  選填。影片的結束位移。

                                                  **fps**: `number`

                                                  選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。


                                                ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                                                      可能的值：

                                                      - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                                                      - `FRAMES`：擷取影片影格。
                                                      - `AUDIO`：擷取音軌。
                                                      - `TRANSCRIPT`：擷取音訊逐字稿。


                                            ??? note "**documentMetadata**: `DocumentMetadata` 選填。文件中繼資料。僅在文件資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"


                                                  **startPage**: `integer`

                                                  選填。起始頁，以 1 起算，包含起始頁。

                                                  **endPage**: `integer`

                                                  選填。結束頁，以 1 起算，包含結束頁。


                                                ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                                                      可能的值：

                                                      - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                                                      - `PAGE_IMAGE`：轉譯後的頁面影像。
                                                      - `PAGE_TEXT`：擷取的頁面文字。


                                            ??? note "**spreadsheetMetadata**: `SpreadsheetMetadata` 選填。試算表中繼資料。僅在試算表資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"


                                                  **visibleCells**: `string`

                                                  選填。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                                                  **sheetIndex**: `integer`

                                                  選填。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                                                ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                                                      可能的值：

                                                      - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                                                      - `DATA`：儲存格值、合併儲存格與格式。
                                                      - `FORMULAS`：公式運算式及其計算結果。
                                                      - `VISUAL`：工作表的轉譯影像。


                                            ??? note "**audioMetadata**: `AudioMetadata` 選填。音訊中繼資料。僅在音訊資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"


                                                  **startOffset**: `string`

                                                  選填。音訊的起始位移，相對於音訊串流的開頭。

                                                  **endOffset**: `string`

                                                  選填。音訊的結束位移，相對於音訊串流的開頭。


                                        ??? note "**mediaProcessing**: `string enum` 選填。模型為理解內容而處理這個 part 媒體的方式。僅對影片 part（`inline_data` 或 MIME 為影片的 `file_data`）有意義，非影片 part 會忽略此欄位。"

                                            可能的值：

                                            - `MEDIA_PROCESSING_UNSPECIFIED`：預設採用模型專屬的處理方式。
                                            - `STATIC`：以固定速率擷取影格，所有影格都放入上下文。
                                            - `AGENTIC`：由模型驅動的動態導覽，建議用於大多數使用情境。



                                        ??? note "**mediaResolution**: `V1mainMediaResolution` 選填。輸入媒體的媒體解析度。"


                                            ??? note "**value**: `Union type` 媒體解析度等級。"


                                                  聯合欄位 `value` 只能是下列其中之一：


                                                ??? note "**level**: `string enum` 用於指定媒體的 Tokenizer 品質，適用於 Gemini API 支援。"


                                                      可能的值：

                                                      - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                                                      - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低。
                                                      - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中。
                                                      - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高。
                                                      - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設為超高。


                                      **willContinue**: `boolean`

                                      選填。表示函式呼叫將繼續，並會傳回更多回應，使函式呼叫成為產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會忽略。若設為 false，後續回應將不予考慮。允許傳回空的 `response` 並將 `will_continue=False`，以表示函式呼叫已結束。這仍可能觸發模型產生內容。若要避免觸發產生並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。



                                    ??? note "**scheduling**: `string enum` 選填。指定回應在對話中的排程方式。僅適用於 NON_BLOCKING 函式呼叫，其他情況會忽略。預設為 WHEN_IDLE。"

                                        可能的值：

                                        - `SCHEDULING_UNSPECIFIED`：不使用此值。
                                        - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發產生。
                                        - `WHEN_IDLE`：將結果加入對話上下文，並提示產生輸出，但不中斷進行中的產生。
                                        - `INTERRUPT`：將結果加入對話上下文，中斷進行中的產生，並提示產生輸出。





                                ??? note "**fileData**: `FileData` 以 URI 為基礎的資料。"

                                    **fileUri**: required `string`

                                    URI.

                                    **mimeType**: `string`

                                    選填。來源資料的 IANA 標準 MIME 類型。

                                    **displayName**: `string`

                                    選填。指定向模型提及這個檔案時所用的名稱（例如「my_file.pdf」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案的參照識別碼使用。





                                ??? note "**executableCode**: `ExecutableCode` 由模型產生、供執行的程式碼。"

                                    ??? note "**language**: required `string enum` `code` 的程式語言。"

                                        可能的值：

                                        - `LANGUAGE_UNSPECIFIED`：未指定語言。不應使用此值。
                                        - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 為預設語言。



                                      **code**: required `string`

                                      要執行的程式碼。

                                      **id**: `string`

                                      選填。`ExecutableCode` part 的唯一識別碼。伺服器會傳回 `CodeExecutionResult`，其 `id` 與之相符。





                                ??? note "**codeExecutionResult**: `CodeExecutionResult` 執行 `ExecutableCode` 的結果。"

                                    ??? note "**outcome**: required `string enum` 程式碼執行的結果。"

                                        可能的值：

                                        - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用此值。
                                        - `OUTCOME_OK`：程式碼執行成功完成。`output` 包含 stdout（若有）。
                                        - `OUTCOME_FAILED`：程式碼執行失敗。`output` 包含 stderr 與 stdout（若有）。
                                        - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已取消。可能有也可能沒有部分 `output`。



                                      **id**: `string`

                                      選填。此結果所對應 `ExecutableCode` part 的識別碼。僅在相對應的 `ExecutableCode` 具有 id 時才會填入。

                                      **output**: `string`

                                      選填。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。





                                ??? note "**toolCall**: `ToolCall` 伺服器端工具呼叫。當模型預測有應在伺服器上執行的工具呼叫時，會填入此欄位。用戶端應將此訊息回傳給 API。"

                                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型。"

                                        可能的值：

                                        - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                        - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                        - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                        - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                        - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                        - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                        - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應多模態理解所用的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                      **id**: `string`

                                      選填。工具呼叫的唯一識別碼。伺服器會傳回帶有相符 `id` 的工具回應。

                                      **toolName**: `string`

                                      選填。被呼叫的工具名稱。

                                      **args**: `object`

                                      選填。工具呼叫的引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





                                ??? note "**toolResponse**: `ToolResponse` 伺服器端 `ToolCall` 執行的輸出。用戶端會以執行相對應 `ToolCall` 的結果填入此欄位。"

                                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型；其 `tool_type` 與相對應 `ToolCall` 中的值一致。"

                                        可能的值：

                                        - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                        - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                        - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                        - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                        - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                        - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                        - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應多模態理解所用的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                      **id**: `string`

                                      選填。此回應所對應工具呼叫的識別碼。

                                      **response**: `object`

                                      選填。工具回應。





                            ??? note "**metadata**: `Union type` 控制資料的額外前處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個 part 的靜態媒體前處理。"

                                  聯合欄位 `metadata` 只能是下列其中之一：



                                ??? note "**videoMetadata**: `VideoMetadata` 選填。影片中繼資料。僅在影片資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"

                                    **startOffset**: `string`

                                    選填。影片的起始位移。

                                    **endOffset**: `string`

                                    選填。影片的結束位移。

                                    **fps**: `number`

                                    選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。


                                    ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                                          可能的值：

                                          - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                                          - `FRAMES`：擷取影片影格。
                                          - `AUDIO`：擷取音軌。
                                          - `TRANSCRIPT`：擷取音訊逐字稿。


                                ??? note "**documentMetadata**: `DocumentMetadata` 選填。文件中繼資料。僅在文件資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"


                                      **startPage**: `integer`

                                      選填。起始頁，以 1 起算，包含起始頁。

                                      **endPage**: `integer`

                                      選填。結束頁，以 1 起算，包含結束頁。


                                    ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                                          可能的值：

                                          - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                                          - `PAGE_IMAGE`：轉譯後的頁面影像。
                                          - `PAGE_TEXT`：擷取的頁面文字。


                                ??? note "**spreadsheetMetadata**: `SpreadsheetMetadata` 選填。試算表中繼資料。僅在試算表資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"


                                      **visibleCells**: `string`

                                      選填。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                                      **sheetIndex**: `integer`

                                      選填。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                                    ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                                          可能的值：

                                          - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                                          - `DATA`：儲存格值、合併儲存格與格式。
                                          - `FORMULAS`：公式運算式及其計算結果。
                                          - `VISUAL`：工作表的轉譯影像。


                                ??? note "**audioMetadata**: `AudioMetadata` 選填。音訊中繼資料。僅在音訊資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"


                                      **startOffset**: `string`

                                      選填。音訊的起始位移，相對於音訊串流的開頭。

                                      **endOffset**: `string`

                                      選填。音訊的結束位移，相對於音訊串流的開頭。



                              **thought**: `boolean`

                              選填。表示該 part 是否為模型的思考內容。

                              **thoughtSignature**: `string`

                              選填。思考內容的不透明簽章，可在後續要求中重複使用。

                              **partMetadata**: `object`

                              與 Part 相關聯的自訂中繼資料。使用 genai.Part 作為內容表示方式的代理，可能需要追蹤額外資訊。例如 Part 來源檔案／來源的名稱，或多工處理多個 Part 串流的方式。



                            ??? note "**mediaResolution**: `V1mainMediaResolution` 選填。輸入媒體的媒體解析度。"

                                ??? note "**value**: `Union type` 媒體解析度等級。"

                                      聯合欄位 `value` 只能是下列其中之一：



                                    ??? note "**level**: `string enum` 用於指定媒體的 Tokenizer 品質，適用於 Gemini API 支援。"

                                        可能的值：

                                        - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                                        - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低。
                                        - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中。
                                        - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高。
                                        - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設為超高。





                            ??? note "**mediaProcessing**: `string enum` 選填。模型為理解內容而處理這個 part 媒體的方式。僅對影片 part（`inline_data` 或 MIME 為影片的 `file_data`）有意義，非影片 part 會忽略此欄位。"

                                可能的值：

                                - `MEDIA_PROCESSING_UNSPECIFIED`：預設採用模型專屬的處理方式。
                                - `STATIC`：以固定速率擷取影格，所有影格都放入上下文。
                                - `AGENTIC`：由模型驅動的動態導覽，建議用於大多數使用情境。





                            ??? note "**audioTranscription**: `AudioTranscription` 選填。音訊（輸入或輸出）轉錄。僅當這個 Part 含有音訊資料時才會設定。"

                                  **text**: required `string`

                                  這個音訊片段的轉錄文字。

                                  **speakerLabel**: `string`

                                  選填。標示這個音訊片段說話者的標籤（例如「spk_1」、「spk_2」）。設定語者分離時會出現。



                                ??? note "**words**: `WordInfo array` 選填。詳細的單字層級轉錄與時間詳情。設定 word_timestamp 時會出現。"

                                    **word**: required `string`

                                    單字的轉錄。

                                    **startOffset**: `string`

                                    選填。單字相對於音訊開頭的起始時間位移。

                                    **endOffset**: `string`

                                    選填。單字相對於音訊開頭的結束時間位移。





                            ??? note "**speechMetadata**: `SpeechMetadata` 選填。套用於文字 part 的中繼資料，用來訂製朗讀或合成方式，例如指定說話者身分或說話風格。"

                                **speaker**: `string`

                                選填。多說話者合成時可選填的說話者名稱。

                                **style**: `string`

                                選填。語音合成時可選填的風格指令。



                          **role**: `string`

                          選填。內容的產生者，必須是 'user' 或 'model'。在多輪對話中適合設定，否則可留空或不設定。





                    ??? note "**embedContentConfig**: `EmbedContentConfig` 選填。EmbedContent 要求的設定。"

                          **title**: `string`

                          選填。文字的標題。



                        ??? note "**taskType**: `TaskType` 選填。嵌入的工作類型。"

                            可能的值：

                            - `TASK_TYPE_UNSPECIFIED`：未設定的值，將預設為其他列舉值之一。
                            - `RETRIEVAL_QUERY`：指定所給文字是搜尋／檢索情境中的查詢。
                            - `RETRIEVAL_DOCUMENT`：指定所給文字是被搜尋語料庫中的文件。
                            - `SEMANTIC_SIMILARITY`：指定所給文字將用於 STS。
                            - `CLASSIFICATION`：指定所給文字將進行分類。
                            - `CLUSTERING`：指定嵌入向量將用於分群。
                            - `QUESTION_ANSWERING`：指定所給文字將用於問答。
                            - `FACT_VERIFICATION`：指定所給文字將用於事實查核。
                            - `CODE_RETRIEVAL_QUERY`：指定所給文字將用於程式碼檢索。



                          **autoTruncate**: `boolean`

                          選填。若輸入內容長於最大序列長度，是否靜默截斷。

                          **outputDimensionality**: `integer`

                          選填。輸出嵌入向量的縮減維度。若有設定，輸出嵌入向量中多餘的值會從末端截斷。

                          **documentOcr**: `boolean`

                          選填。是否為文件內容啟用 OCR。

                          **audioTrackExtraction**: `boolean`

                          選填。是否從影片內容擷取音訊。



                  **metadata**: `object`

                  選填。要與要求相關聯的中繼資料。



  

---


  **name**: `string`

  僅供輸出。識別碼。批次的資源名稱。格式：`batches/{batch_id}`。

  

---


  

??? note "**output**: `EmbedContentBatchOutput` 僅供輸出。批次要求的輸出。"

    ??? note "**output**: `Union type` 批次要求的輸出。"

          聯合欄位 `output` 只能是下列其中之一：

          **responsesFile**: `string`

          僅供輸出。包含回應之檔案的檔案 ID。該檔案為 JSONL 檔案，每行一個回應。回應為格式化為 JSON 的 `EmbedContentResponse` 訊息，寫入順序與輸入要求相同。



        ??? note "**inlinedResponses**: `InlinedEmbedContentResponses` 僅供輸出。批次中各要求的回應。當批次以行內要求建立時傳回。回應順序與輸入要求相同。"

            ??? note "**inlinedResponses**: `InlinedEmbedContentResponse array` 僅供輸出。批次中各要求的回應。"

                ??? note "**output**: `Union type` 要求的輸出。"

                      聯合欄位 `output` 只能是下列其中之一：



                    ??? note "**error**: `Status` 僅供輸出。處理要求時遇到的錯誤。"

                        **code**: `integer`

                        狀態碼，應為 google.rpc.Code 的列舉值。

                        **message**: `string`

                        給開發人員看的錯誤訊息，應以英文撰寫。任何給使用者看的錯誤訊息都應本地化，並放在 google.rpc.Status.details 欄位中傳送，或由用戶端本地化。

                        **details**: `object array`

                        承載錯誤詳情的訊息清單。API 有一組通用的訊息類型可供使用。





                    ??? note "**response**: `EmbedContentResponse` 僅供輸出。對要求的回應。"

                        ??? note "**embedding**: `ContentEmbedding` 僅供輸出。由輸入內容產生的嵌入向量。"

                            **values**: `number array`

                            嵌入向量值。僅供 3P 使用者，1P 呼叫不會填入。

                            **shape**: `integer array`

                            此欄位儲存軟 token 張量影格形狀（例如 [1, 1, 256, 2048]）。





                        ??? note "**usageMetadata**: `EmbeddingUsageMetadata` 僅供輸出。要求的使用中繼資料。"

                              **promptTokenCount**: `integer`

                              僅供輸出。提示詞中的 token 數量。



                            ??? note "**promptTokenDetails**: `ModalityTokenCount array` 僅供輸出。要求輸入中已處理的模態清單。"

                                ??? note "**modality**: `GenerativeLanguageModality` 與此 token 數量相關聯的模態。"

                                    可能的值：

                                    - `MODALITY_UNSPECIFIED`：未指定的模態。
                                    - `TEXT`：純文字。
                                    - `IMAGE`：圖片。
                                    - `VIDEO`：影片。
                                    - `AUDIO`：音訊。
                                    - `DOCUMENT`：文件，例如 PDF。



                                  **tokenCount**: `integer`

                                  token 數量。



                  **metadata**: `object`

                  僅供輸出。與要求相關聯的中繼資料。



  

---


  **createTime**: `string`

  僅供輸出。批次的建立時間。

  

---


  **endTime**: `string`

  僅供輸出。批次處理完成的時間。

  

---


  **updateTime**: `string`

  僅供輸出。批次最後更新的時間。

  

---


  

??? note "**batchStats**: `EmbedContentBatchStats` 僅供輸出。批次的統計資料。"

    **requestCount**: `string`

    僅供輸出。批次中的要求數量。

    **successfulRequestCount**: `string`

    僅供輸出。成功處理的要求數量。

    **failedRequestCount**: `string`

    僅供輸出。處理失敗的要求數量。

    **pendingRequestCount**: `string`

    僅供輸出。仍在等待處理的要求數量。



  

---


  

??? note "**state**: [`BatchState`](/api-reference/batch-api/update-embed-content-batch/#Resource:BatchState) 僅供輸出。批次的狀態。"

    可能的值：

    - `BATCH_STATE_UNSPECIFIED`：未指定批次狀態。
    - `BATCH_STATE_PENDING`：服務正在準備執行批次。
    - `BATCH_STATE_RUNNING`：批次進行中。
    - `BATCH_STATE_SUCCEEDED`：批次已成功完成。
    - `BATCH_STATE_FAILED`：批次失敗。
    - `BATCH_STATE_CANCELLED`：批次已取消。
    - `BATCH_STATE_EXPIRED`：批次已過期。



  

---


  **priority**: `string`

  選填。批次的優先順序。優先值較高的批次會先於優先值較低的批次處理。允許負值，預設為 0。

  

  

  
  **回應範例**

  ```json
  {
    "model": "string",
    "displayName": "string",
    "inputConfig": {
      "fileName": "string",
      "requests": {
        "requests": [
          {
            "request": {
              "model": "...",
              "content": "...",
              "embedContentConfig": "..."
            },
            "metadata": {}
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
            "error": {
              "code": "...",
              "message": "...",
              "details": "..."
            },
            "response": {
              "embedding": "...",
              "usageMetadata": "..."
            },
            "metadata": {}
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
  }
  ```

  


## 資料模型 {#data-models}

### BatchState {#Resource:BatchState}

**可能的值：**

- `BATCH_STATE_UNSPECIFIED`：未指定批次狀態。
- `BATCH_STATE_PENDING`：服務正在準備執行批次。
- `BATCH_STATE_RUNNING`：批次進行中。
- `BATCH_STATE_SUCCEEDED`：批次已成功完成。
- `BATCH_STATE_FAILED`：批次失敗。
- `BATCH_STATE_CANCELLED`：批次已取消。
- `BATCH_STATE_EXPIRED`：批次已過期。
