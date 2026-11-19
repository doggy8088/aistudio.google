# 計算 token 數

`POST` `https://generativelanguage.googleapis.com/v1beta/models/{model}:countTokens`

對輸入的 `Content` 執行模型的 tokenizer，並傳回 token 數量。
請參閱[token 指南](/docs/tokens/)
進一步瞭解 token。


  
## 參數 {#parameters}

  
  **model**: required `string`

  模型 ID，例如 `gemini-2.5-flash`。會組成資源名稱 `models/{model}`。

  

## 要求主體 {#request-body}

  
  

??? note "**contents**: `Content array` 選用。作為提示詞提供給模型的輸入。設定 `generate_content_request` 時會忽略此欄位。"

    ??? note "**parts**: `Part array` 組成單一訊息的有序 `Parts`。各 Part 的 MIME 類型可能不同。"

        ??? note "**data**: `Union type`"

              聯集欄位 `data` 只能是下列其中之一：

              **text**: `string`

              行內文字。



            ??? note "**inlineData**: `Blob` 行內媒體位元組。"

                **mimeType**: `string`

                來源資料的 IANA 標準 MIME 類型。支援的類型範例：

                - 圖片：image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
                - 音訊：audio/*, video/audio/s16le, video/audio/wav
                - 影片：video/*
                - 文字：text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
                - 應用程式：application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf。更多上下文請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                **data**: `string`

                媒體格式的原始位元組。

                **displayName**: `string`

                選用。指定用來向模型參照此 blob 的名稱（例如 "my_blob.png"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 的參照識別碼。





            ??? note "**functionCall**: `FunctionCall` 模型傳回的預測 `FunctionCall`，其中包含代表 `FunctionDeclaration.name` 的字串，以及其引數與值。"

                **name**: required `string`

                要呼叫的函式名稱。必須是 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                **id**: `string`

                選用。函式呼叫的專屬識別碼。若有填入，用戶端應執行 `function_call`，並傳回帶有相符 `id` 的回應。

                **args**: `object`

                選用。JSON 物件格式的函式參數與值。





            ??? note "**functionResponse**: `FunctionResponse` `FunctionCall` 的結果輸出，其中包含代表 `FunctionDeclaration.name` 的字串，以及包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。"

                  **name**: required `string`

                  要呼叫的函式名稱。必須是 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                  **response**: required `object`

                  JSON 物件格式的函式回應。呼叫端可使用任何符合函式語法的自選鍵來傳回函式輸出，例如 "output"、"result" 等。特別是當函式呼叫執行失敗時，回應可包含 "error" 鍵，將錯誤詳細資訊傳回給模型。多媒體內容可透過子物件納入，該子物件包含單一 "$ref" 鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，屬於持有該多媒體的 `FunctionResponsePart`。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

                  **id**: `string`

                  選用。此回應所對應之函式呼叫的識別碼。由用戶端填入，以對應相應函式呼叫的 `id`。



                ??? note "**parts**: `FunctionResponsePart array` 選用。組成函式回應的有序 `Parts`。各 Part 的 IANA MIME 類型可能不同。"

                    ??? note "**data**: `Union type` 函式回應部分的資料。"

                          聯集欄位 `data` 只能是下列其中之一：



                        ??? note "**inlineData**: `FunctionResponseBlob` 行內媒體位元組。"

                            **mimeType**: `string`

                            來源資料的 IANA 標準 MIME 類型。範例：

                            - image/png
                            - image/jpeg

                            若提供不支援的 MIME 類型，將傳回錯誤。支援類型的完整清單請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                            **data**: `string`

                            媒體格式的原始位元組。

                            **displayName**: `string`

                            選用。blob 的顯示名稱。用來提供標籤或檔名以區分各個 blob，並可從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                        ??? note "**fileData**: `FunctionResponseFileData` 以 URI 為基礎的資料。"

                            **fileUri**: required `string`

                            URI.

                            **mimeType**: `string`

                            來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將傳回錯誤。支援類型的完整清單請參閱[多模態函式回應](/docs/function-calling/#multimodal)與[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                            **displayName**: `string`

                            選用。檔案的顯示名稱。用來提供標籤或檔名以區分檔案資料，並可從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                    ??? note "**metadata**: `Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個部分的靜態媒體預處理。"


                          聯集欄位 `metadata` 只能是下列其中之一：


                        ??? note "**videoMetadata**: `VideoMetadata` 選用。影片中繼資料。僅應在影片資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                              **startOffset**: `string`

                              選用。影片的開始偏移。

                              **endOffset**: `string`

                              選用。影片的結束偏移。

                              **fps**: `number`

                              選用。傳送給模型的影片幀率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。


                            ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                                  可能的值：

                                  - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                                  - `FRAMES`: 擷取影片影格。
                                  - `AUDIO`: 擷取音軌。
                                  - `TRANSCRIPT`: 擷取音訊逐字稿。


                        ??? note "**documentMetadata**: `DocumentMetadata` 選用。文件中繼資料。僅應在文件資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                              **startPage**: `integer`

                              選用。起始頁，以 1 起算，包含起始頁。

                              **endPage**: `integer`

                              選用。結束頁，以 1 起算，包含結束頁。


                            ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                                  可能的值：

                                  - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                                  - `PAGE_IMAGE`: 轉譯後的頁面影像。
                                  - `PAGE_TEXT`: 擷取的頁面文字。


                        ??? note "**spreadsheetMetadata**: `SpreadsheetMetadata` 選用。試算表中繼資料。僅應在試算表資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                              **visibleCells**: `string`

                              選用。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                              **sheetIndex**: `integer`

                              選用。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                            ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                                  可能的值：

                                  - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                                  - `DATA`: 儲存格值、合併儲存格與格式。
                                  - `FORMULAS`: 公式運算式及其計算結果。
                                  - `VISUAL`: 工作表的轉譯影像。


                        ??? note "**audioMetadata**: `AudioMetadata` 選用。音訊中繼資料。僅應在音訊資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                              **startOffset**: `string`

                              選用。音訊的開始偏移，相對於音訊串流的開頭。

                              **endOffset**: `string`

                              選用。音訊的結束偏移，相對於音訊串流的開頭。


                    ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以便理解。僅對影片部分（`inline_data` 或 MIME 為影片的 `file_data`）有意義。非影片部分會忽略此欄位。"

                        可能的值：

                        - `MEDIA_PROCESSING_UNSPECIFIED`: 預設為模型專屬的處理方式。
                        - `STATIC`: 固定速率的幀擷取。所有幀都放入上下文。
                        - `AGENTIC`: 模型驅動的動態導覽。建議用於大多數使用情境。



                    ??? note "**mediaResolution**: `V1mainMediaResolution` 選用。輸入媒體的媒體解析度。"


                        ??? note "**value**: `Union type` 媒體解析度等級。"


                              聯集欄位 `value` 只能是下列其中之一：


                            ??? note "**level**: `string enum` 指定媒體所使用的 Tokenizer 品質。供 Gemini API 支援使用。"


                                  可能的值：

                                  - `MEDIA_RESOLUTION_UNSPECIFIED`: 尚未設定媒體解析度。
                                  - `MEDIA_RESOLUTION_LOW`: 媒體解析度設為低。
                                  - `MEDIA_RESOLUTION_MEDIUM`: 媒體解析度設為中。
                                  - `MEDIA_RESOLUTION_HIGH`: 媒體解析度設為高。
                                  - `MEDIA_RESOLUTION_ULTRA_HIGH`: 媒體解析度設為超高。


                  **willContinue**: `boolean`

                  選用。表示函式呼叫將繼續，且會傳回更多回應，使函式呼叫成為產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會忽略。若設為 false，後續回應將不予考慮。允許傳回空的 `response` 並搭配 `will_continue=False`，表示函式呼叫已完成。這仍可能觸發模型生成。若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。



                ??? note "**scheduling**: `string enum` 選用。指定回應在對話中的排程方式。僅適用於 NON_BLOCKING 函式呼叫，其他情況會忽略。預設為 WHEN_IDLE。"

                    可能的值：

                    - `SCHEDULING_UNSPECIFIED`: 此值未使用。
                    - `SILENT`: 僅將結果加入對話上下文，不中斷也不觸發生成。
                    - `WHEN_IDLE`: 將結果加入對話上下文，並提示生成輸出，不中斷進行中的生成。
                    - `INTERRUPT`: 將結果加入對話上下文，中斷進行中的生成，並提示生成輸出。





            ??? note "**fileData**: `FileData` 以 URI 為基礎的資料。"

                **fileUri**: required `string`

                URI.

                **mimeType**: `string`

                選用。來源資料的 IANA 標準 MIME 類型。

                **displayName**: `string`

                選用。指定用來向模型參照此檔案的名稱（例如 "my_file.pdf"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案的參照識別碼。





            ??? note "**executableCode**: `ExecutableCode` 模型生成、預定要執行的程式碼。"

                ??? note "**language**: required `string enum` `code` 的程式語言。"

                    可能的值：

                    - `LANGUAGE_UNSPECIFIED`: 未指定的語言。不應使用此值。
                    - `PYTHON`: Python >= 3.10，可使用 numpy 與 simpy。Python 是預設語言。



                  **code**: required `string`

                  要執行的程式碼。

                  **id**: `string`

                  選用。`ExecutableCode` 部分的專屬識別碼。伺服器會傳回 `CodeExecutionResult`，其 `id` 與之相符。





            ??? note "**codeExecutionResult**: `CodeExecutionResult` 執行 `ExecutableCode` 的結果。"

                ??? note "**outcome**: required `string enum` 程式碼執行的結果。"

                    可能的值：

                    - `OUTCOME_UNSPECIFIED`: 未指定的狀態。不應使用此值。
                    - `OUTCOME_OK`: 程式碼執行成功完成。`output` 包含 stdout（如有）。
                    - `OUTCOME_FAILED`: 程式碼執行失敗。`output` 包含 stderr 與 stdout（如有）。
                    - `OUTCOME_DEADLINE_EXCEEDED`: 程式碼執行時間過長，已取消。可能有也可能沒有部分 `output`。



                  **id**: `string`

                  選用。此結果所對應之 `ExecutableCode` 部分的識別碼。僅在對應的 `ExecutableCode` 有 id 時才會填入。

                  **output**: `string`

                  選用。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。





            ??? note "**toolCall**: `ToolCall` 伺服器端工具呼叫。當模型預測應在伺服器上執行的工具叫用時，會填入此欄位。用戶端應將此訊息回傳給 API。"

                ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型。"

                    可能的值：

                    - `TOOL_TYPE_UNSPECIFIED`: 未指定的工具類型。
                    - `GOOGLE_SEARCH_WEB`: Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                    - `GOOGLE_SEARCH_IMAGE`: 圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                    - `URL_CONTEXT`: URL 上下文工具，對應 Tool.url_context。
                    - `GOOGLE_MAPS`: Google 地圖工具，對應 Tool.google_maps。
                    - `FILE_SEARCH`: 檔案搜尋工具，對應 Tool.file_search。
                    - `MEDIA_PROCESSING`: 媒體處理工具類型（例如影片、音訊等），對應多模態理解所使用的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                  **id**: `string`

                  選用。工具呼叫的專屬識別碼。伺服器會傳回帶有相符 `id` 的工具回應。

                  **toolName**: `string`

                  選用。被呼叫的工具名稱。

                  **args**: `object`

                  選用。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





            ??? note "**toolResponse**: `ToolResponse` 伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端以執行對應 `ToolCall` 的結果填入。"

                ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型，`tool_type` 與對應 `ToolCall` 中的相符。"

                    可能的值：

                    - `TOOL_TYPE_UNSPECIFIED`: 未指定的工具類型。
                    - `GOOGLE_SEARCH_WEB`: Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                    - `GOOGLE_SEARCH_IMAGE`: 圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                    - `URL_CONTEXT`: URL 上下文工具，對應 Tool.url_context。
                    - `GOOGLE_MAPS`: Google 地圖工具，對應 Tool.google_maps。
                    - `FILE_SEARCH`: 檔案搜尋工具，對應 Tool.file_search。
                    - `MEDIA_PROCESSING`: 媒體處理工具類型（例如影片、音訊等），對應多模態理解所使用的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                  **id**: `string`

                  選用。此回應所對應之工具呼叫的識別碼。

                  **response**: `object`

                  選用。工具回應。





        ??? note "**metadata**: `Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個部分的靜態媒體預處理。"

              聯集欄位 `metadata` 只能是下列其中之一：



            ??? note "**videoMetadata**: `VideoMetadata` 選用。影片中繼資料。僅應在影片資料以 inline_data 或 file_data 呈現時指定此中繼資料。"

                **startOffset**: `string`

                選用。影片的開始偏移。

                **endOffset**: `string`

                選用。影片的結束偏移。

                **fps**: `number`

                選用。傳送給模型的影片幀率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。



                ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                      可能的值：

                      - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                      - `FRAMES`: 擷取影片影格。
                      - `AUDIO`: 擷取音軌。
                      - `TRANSCRIPT`: 擷取音訊逐字稿。


            ??? note "**documentMetadata**: `DocumentMetadata` 選用。文件中繼資料。僅應在文件資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                  **startPage**: `integer`

                  選用。起始頁，以 1 起算，包含起始頁。

                  **endPage**: `integer`

                  選用。結束頁，以 1 起算，包含結束頁。


                ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                      可能的值：

                      - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                      - `PAGE_IMAGE`: 轉譯後的頁面影像。
                      - `PAGE_TEXT`: 擷取的頁面文字。


            ??? note "**spreadsheetMetadata**: `SpreadsheetMetadata` 選用。試算表中繼資料。僅應在試算表資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                  **visibleCells**: `string`

                  選用。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                  **sheetIndex**: `integer`

                  選用。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                      可能的值：

                      - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                      - `DATA`: 儲存格值、合併儲存格與格式。
                      - `FORMULAS`: 公式運算式及其計算結果。
                      - `VISUAL`: 工作表的轉譯影像。


            ??? note "**audioMetadata**: `AudioMetadata` 選用。音訊中繼資料。僅應在音訊資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                  **startOffset**: `string`

                  選用。音訊的開始偏移，相對於音訊串流的開頭。

                  **endOffset**: `string`

                  選用。音訊的結束偏移，相對於音訊串流的開頭。


          **thought**: `boolean`

          選用。表示此部分是否為模型的思考內容。

          **thoughtSignature**: `string`

          選用。思考內容的不透明簽章，可在後續要求中重複使用。

          **partMetadata**: `object`

          與 Part 相關聯的自訂中繼資料。使用 genai.Part 作為內容表示方式的代理，可能需要追蹤這些額外資訊。例如 Part 來源檔案/來源的名稱，或多工處理多個 Part 串流的方式。



        ??? note "**mediaResolution**: `V1mainMediaResolution` 選用。輸入媒體的媒體解析度。"

            ??? note "**value**: `Union type` 媒體解析度等級。"

                  聯集欄位 `value` 只能是下列其中之一：



                ??? note "**level**: `string enum` 指定媒體所使用的 Tokenizer 品質。供 Gemini API 支援使用。"

                    可能的值：

                    - `MEDIA_RESOLUTION_UNSPECIFIED`: 尚未設定媒體解析度。
                    - `MEDIA_RESOLUTION_LOW`: 媒體解析度設為低。
                    - `MEDIA_RESOLUTION_MEDIUM`: 媒體解析度設為中。
                    - `MEDIA_RESOLUTION_HIGH`: 媒體解析度設為高。
                    - `MEDIA_RESOLUTION_ULTRA_HIGH`: 媒體解析度設為超高。





        ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以便理解。僅對影片部分（`inline_data` 或 MIME 為影片的 `file_data`）有意義。非影片部分會忽略此欄位。"

            可能的值：

            - `MEDIA_PROCESSING_UNSPECIFIED`: 預設為模型專屬的處理方式。
            - `STATIC`: 固定速率的幀擷取。所有幀都放入上下文。
            - `AGENTIC`: 模型驅動的動態導覽。建議用於大多數使用情境。





        ??? note "**audioTranscription**: `AudioTranscription` 選用。音訊（輸入或輸出）轉錄。僅在此 Part 包含音訊資料時設定。"

              **text**: required `string`

              此音訊片段的轉錄文字。

              **speakerLabel**: `string`

              選用。標示此音訊片段說話者的標籤（例如 "spk_1"、"spk_2"）。設定 diarization 時才會出現。



            ??? note "**words**: `WordInfo array` 選用。詳細的字詞層級轉錄與時間詳細資訊。設定 word_timestamp 時才會出現。"

                **word**: required `string`

                字詞的轉錄。

                **startOffset**: `string`

                選用。字詞相對於音訊開頭的開始時間偏移。

                **endOffset**: `string`

                選用。字詞相對於音訊開頭的結束時間偏移。





        ??? note "**speechMetadata**: `SpeechMetadata` 選用。套用至文字部分的中繼資料，用來自訂其朗讀或合成方式，例如指定說話者身分或說話風格。"

            **speaker**: `string`

            選用。多說話者合成時選用的說話者名稱。

            **style**: `string`

            選用。語音合成時選用的風格指令。



      **role**: `string`

      選用。內容的產生者。必須是 'user' 或 'model'。設定此欄位有助於多輪對話，否則可留空或不設定。



  

---


  

??? note "**generateContentRequest**: `GenerateContentRequest` 選用。提供給 `Model` 的整體輸入。包括提示詞，以及其他模型引導資訊，例如[系統指令](/docs/text-generation/#system-instructions)，和/或用於[函式呼叫](/docs/function-calling/)的函式宣告。`Model`/`Content` 與 `generate_content_request` 互斥。可以傳送 `Model` + `Content`，或傳送 `generate_content_request`，但不可兩者同時傳送。"

      **model**: required `string`

      用於生成完成內容的 `Model` 名稱。格式：`models/{model}`。



    ??? note "**contents**: required `Content array` 目前與模型對話的內容。對於單輪查詢，這是單一執行個體。對於多輪查詢（例如[聊天](/docs/text-generation/#multi-turn-conversations)），這是重複欄位，包含對話記錄與最新要求。"

        ??? note "**parts**: `Part array` 組成單一訊息的有序 `Parts`。各 Part 的 MIME 類型可能不同。"

            ??? note "**data**: `Union type`"

                  聯集欄位 `data` 只能是下列其中之一：

                  **text**: `string`

                  行內文字。



                ??? note "**inlineData**: `Blob` 行內媒體位元組。"

                    **mimeType**: `string`

                    來源資料的 IANA 標準 MIME 類型。支援的類型範例：

                    - 圖片：image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
                    - 音訊：audio/*, video/audio/s16le, video/audio/wav
                    - 影片：video/*
                    - 文字：text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
                    - 應用程式：application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf。更多上下文請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                    **data**: `string`

                    媒體格式的原始位元組。

                    **displayName**: `string`

                    選用。指定用來向模型參照此 blob 的名稱（例如 "my_blob.png"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 的參照識別碼。





                ??? note "**functionCall**: `FunctionCall` 模型傳回的預測 `FunctionCall`，其中包含代表 `FunctionDeclaration.name` 的字串，以及其引數與值。"

                    **name**: required `string`

                    要呼叫的函式名稱。必須是 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                    **id**: `string`

                    選用。函式呼叫的專屬識別碼。若有填入，用戶端應執行 `function_call`，並傳回帶有相符 `id` 的回應。

                    **args**: `object`

                    選用。JSON 物件格式的函式參數與值。





                ??? note "**functionResponse**: `FunctionResponse` `FunctionCall` 的結果輸出，其中包含代表 `FunctionDeclaration.name` 的字串，以及包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。"

                      **name**: required `string`

                      要呼叫的函式名稱。必須是 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                      **response**: required `object`

                      JSON 物件格式的函式回應。呼叫端可使用任何符合函式語法的自選鍵來傳回函式輸出，例如 "output"、"result" 等。特別是當函式呼叫執行失敗時，回應可包含 "error" 鍵，將錯誤詳細資訊傳回給模型。多媒體內容可透過子物件納入，該子物件包含單一 "$ref" 鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，屬於持有該多媒體的 `FunctionResponsePart`。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

                      **id**: `string`

                      選用。此回應所對應之函式呼叫的識別碼。由用戶端填入，以對應相應函式呼叫的 `id`。



                    ??? note "**parts**: `FunctionResponsePart array` 選用。組成函式回應的有序 `Parts`。各 Part 的 IANA MIME 類型可能不同。"

                        ??? note "**data**: `Union type` 函式回應部分的資料。"

                              聯集欄位 `data` 只能是下列其中之一：



                            ??? note "**inlineData**: `FunctionResponseBlob` 行內媒體位元組。"

                                **mimeType**: `string`

                                來源資料的 IANA 標準 MIME 類型。範例：

                                - image/png
                                - image/jpeg

                                若提供不支援的 MIME 類型，將傳回錯誤。支援類型的完整清單請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                **data**: `string`

                                媒體格式的原始位元組。

                                **displayName**: `string`

                                選用。blob 的顯示名稱。用來提供標籤或檔名以區分各個 blob，並可從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                            ??? note "**fileData**: `FunctionResponseFileData` 以 URI 為基礎的資料。"

                                **fileUri**: required `string`

                                URI.

                                **mimeType**: `string`

                                來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將傳回錯誤。支援類型的完整清單請參閱[多模態函式回應](/docs/function-calling/#multimodal)與[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                **displayName**: `string`

                                選用。檔案的顯示名稱。用來提供標籤或檔名以區分檔案資料，並可從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                        ??? note "**metadata**: `Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個部分的靜態媒體預處理。"


                              聯集欄位 `metadata` 只能是下列其中之一：


                            ??? note "**videoMetadata**: `VideoMetadata` 選用。影片中繼資料。僅應在影片資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                                  **startOffset**: `string`

                                  選用。影片的開始偏移。

                                  **endOffset**: `string`

                                  選用。影片的結束偏移。

                                  **fps**: `number`

                                  選用。傳送給模型的影片幀率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。


                                ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                                      可能的值：

                                      - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                                      - `FRAMES`: 擷取影片影格。
                                      - `AUDIO`: 擷取音軌。
                                      - `TRANSCRIPT`: 擷取音訊逐字稿。


                            ??? note "**documentMetadata**: `DocumentMetadata` 選用。文件中繼資料。僅應在文件資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                                  **startPage**: `integer`

                                  選用。起始頁，以 1 起算，包含起始頁。

                                  **endPage**: `integer`

                                  選用。結束頁，以 1 起算，包含結束頁。


                                ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                                      可能的值：

                                      - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                                      - `PAGE_IMAGE`: 轉譯後的頁面影像。
                                      - `PAGE_TEXT`: 擷取的頁面文字。


                            ??? note "**spreadsheetMetadata**: `SpreadsheetMetadata` 選用。試算表中繼資料。僅應在試算表資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                                  **visibleCells**: `string`

                                  選用。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                                  **sheetIndex**: `integer`

                                  選用。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                                ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                                      可能的值：

                                      - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                                      - `DATA`: 儲存格值、合併儲存格與格式。
                                      - `FORMULAS`: 公式運算式及其計算結果。
                                      - `VISUAL`: 工作表的轉譯影像。


                            ??? note "**audioMetadata**: `AudioMetadata` 選用。音訊中繼資料。僅應在音訊資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                                  **startOffset**: `string`

                                  選用。音訊的開始偏移，相對於音訊串流的開頭。

                                  **endOffset**: `string`

                                  選用。音訊的結束偏移，相對於音訊串流的開頭。


                        ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以便理解。僅對影片部分（`inline_data` 或 MIME 為影片的 `file_data`）有意義。非影片部分會忽略此欄位。"

                            可能的值：

                            - `MEDIA_PROCESSING_UNSPECIFIED`: 預設為模型專屬的處理方式。
                            - `STATIC`: 固定速率的幀擷取。所有幀都放入上下文。
                            - `AGENTIC`: 模型驅動的動態導覽。建議用於大多數使用情境。



                        ??? note "**mediaResolution**: `V1mainMediaResolution` 選用。輸入媒體的媒體解析度。"


                            ??? note "**value**: `Union type` 媒體解析度等級。"


                                  聯集欄位 `value` 只能是下列其中之一：


                                ??? note "**level**: `string enum` 指定媒體所使用的 Tokenizer 品質。供 Gemini API 支援使用。"


                                      可能的值：

                                      - `MEDIA_RESOLUTION_UNSPECIFIED`: 尚未設定媒體解析度。
                                      - `MEDIA_RESOLUTION_LOW`: 媒體解析度設為低。
                                      - `MEDIA_RESOLUTION_MEDIUM`: 媒體解析度設為中。
                                      - `MEDIA_RESOLUTION_HIGH`: 媒體解析度設為高。
                                      - `MEDIA_RESOLUTION_ULTRA_HIGH`: 媒體解析度設為超高。


                      **willContinue**: `boolean`

                      選用。表示函式呼叫將繼續，且會傳回更多回應，使函式呼叫成為產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會忽略。若設為 false，後續回應將不予考慮。允許傳回空的 `response` 並搭配 `will_continue=False`，表示函式呼叫已完成。這仍可能觸發模型生成。若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。



                    ??? note "**scheduling**: `string enum` 選用。指定回應在對話中的排程方式。僅適用於 NON_BLOCKING 函式呼叫，其他情況會忽略。預設為 WHEN_IDLE。"

                        可能的值：

                        - `SCHEDULING_UNSPECIFIED`: 此值未使用。
                        - `SILENT`: 僅將結果加入對話上下文，不中斷也不觸發生成。
                        - `WHEN_IDLE`: 將結果加入對話上下文，並提示生成輸出，不中斷進行中的生成。
                        - `INTERRUPT`: 將結果加入對話上下文，中斷進行中的生成，並提示生成輸出。





                ??? note "**fileData**: `FileData` 以 URI 為基礎的資料。"

                    **fileUri**: required `string`

                    URI.

                    **mimeType**: `string`

                    選用。來源資料的 IANA 標準 MIME 類型。

                    **displayName**: `string`

                    選用。指定用來向模型參照此檔案的名稱（例如 "my_file.pdf"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案的參照識別碼。





                ??? note "**executableCode**: `ExecutableCode` 模型生成、預定要執行的程式碼。"

                    ??? note "**language**: required `string enum` `code` 的程式語言。"

                        可能的值：

                        - `LANGUAGE_UNSPECIFIED`: 未指定的語言。不應使用此值。
                        - `PYTHON`: Python >= 3.10，可使用 numpy 與 simpy。Python 是預設語言。



                      **code**: required `string`

                      要執行的程式碼。

                      **id**: `string`

                      選用。`ExecutableCode` 部分的專屬識別碼。伺服器會傳回 `CodeExecutionResult`，其 `id` 與之相符。





                ??? note "**codeExecutionResult**: `CodeExecutionResult` 執行 `ExecutableCode` 的結果。"

                    ??? note "**outcome**: required `string enum` 程式碼執行的結果。"

                        可能的值：

                        - `OUTCOME_UNSPECIFIED`: 未指定的狀態。不應使用此值。
                        - `OUTCOME_OK`: 程式碼執行成功完成。`output` 包含 stdout（如有）。
                        - `OUTCOME_FAILED`: 程式碼執行失敗。`output` 包含 stderr 與 stdout（如有）。
                        - `OUTCOME_DEADLINE_EXCEEDED`: 程式碼執行時間過長，已取消。可能有也可能沒有部分 `output`。



                      **id**: `string`

                      選用。此結果所對應之 `ExecutableCode` 部分的識別碼。僅在對應的 `ExecutableCode` 有 id 時才會填入。

                      **output**: `string`

                      選用。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。





                ??? note "**toolCall**: `ToolCall` 伺服器端工具呼叫。當模型預測應在伺服器上執行的工具叫用時，會填入此欄位。用戶端應將此訊息回傳給 API。"

                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型。"

                        可能的值：

                        - `TOOL_TYPE_UNSPECIFIED`: 未指定的工具類型。
                        - `GOOGLE_SEARCH_WEB`: Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                        - `GOOGLE_SEARCH_IMAGE`: 圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                        - `URL_CONTEXT`: URL 上下文工具，對應 Tool.url_context。
                        - `GOOGLE_MAPS`: Google 地圖工具，對應 Tool.google_maps。
                        - `FILE_SEARCH`: 檔案搜尋工具，對應 Tool.file_search。
                        - `MEDIA_PROCESSING`: 媒體處理工具類型（例如影片、音訊等），對應多模態理解所使用的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                      **id**: `string`

                      選用。工具呼叫的專屬識別碼。伺服器會傳回帶有相符 `id` 的工具回應。

                      **toolName**: `string`

                      選用。被呼叫的工具名稱。

                      **args**: `object`

                      選用。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





                ??? note "**toolResponse**: `ToolResponse` 伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端以執行對應 `ToolCall` 的結果填入。"

                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型，`tool_type` 與對應 `ToolCall` 中的相符。"

                        可能的值：

                        - `TOOL_TYPE_UNSPECIFIED`: 未指定的工具類型。
                        - `GOOGLE_SEARCH_WEB`: Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                        - `GOOGLE_SEARCH_IMAGE`: 圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                        - `URL_CONTEXT`: URL 上下文工具，對應 Tool.url_context。
                        - `GOOGLE_MAPS`: Google 地圖工具，對應 Tool.google_maps。
                        - `FILE_SEARCH`: 檔案搜尋工具，對應 Tool.file_search。
                        - `MEDIA_PROCESSING`: 媒體處理工具類型（例如影片、音訊等），對應多模態理解所使用的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                      **id**: `string`

                      選用。此回應所對應之工具呼叫的識別碼。

                      **response**: `object`

                      選用。工具回應。





            ??? note "**metadata**: `Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個部分的靜態媒體預處理。"

                  聯集欄位 `metadata` 只能是下列其中之一：



                ??? note "**videoMetadata**: `VideoMetadata` 選用。影片中繼資料。僅應在影片資料以 inline_data 或 file_data 呈現時指定此中繼資料。"

                    **startOffset**: `string`

                    選用。影片的開始偏移。

                    **endOffset**: `string`

                    選用。影片的結束偏移。

                    **fps**: `number`

                    選用。傳送給模型的影片幀率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。



                    ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                          可能的值：

                          - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                          - `FRAMES`: 擷取影片影格。
                          - `AUDIO`: 擷取音軌。
                          - `TRANSCRIPT`: 擷取音訊逐字稿。


                ??? note "**documentMetadata**: `DocumentMetadata` 選用。文件中繼資料。僅應在文件資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                      **startPage**: `integer`

                      選用。起始頁，以 1 起算，包含起始頁。

                      **endPage**: `integer`

                      選用。結束頁，以 1 起算，包含結束頁。


                    ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                          可能的值：

                          - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                          - `PAGE_IMAGE`: 轉譯後的頁面影像。
                          - `PAGE_TEXT`: 擷取的頁面文字。


                ??? note "**spreadsheetMetadata**: `SpreadsheetMetadata` 選用。試算表中繼資料。僅應在試算表資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                      **visibleCells**: `string`

                      選用。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                      **sheetIndex**: `integer`

                      選用。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                    ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                          可能的值：

                          - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                          - `DATA`: 儲存格值、合併儲存格與格式。
                          - `FORMULAS`: 公式運算式及其計算結果。
                          - `VISUAL`: 工作表的轉譯影像。


                ??? note "**audioMetadata**: `AudioMetadata` 選用。音訊中繼資料。僅應在音訊資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                      **startOffset**: `string`

                      選用。音訊的開始偏移，相對於音訊串流的開頭。

                      **endOffset**: `string`

                      選用。音訊的結束偏移，相對於音訊串流的開頭。


              **thought**: `boolean`

              選用。表示此部分是否為模型的思考內容。

              **thoughtSignature**: `string`

              選用。思考內容的不透明簽章，可在後續要求中重複使用。

              **partMetadata**: `object`

              與 Part 相關聯的自訂中繼資料。使用 genai.Part 作為內容表示方式的代理，可能需要追蹤這些額外資訊。例如 Part 來源檔案/來源的名稱，或多工處理多個 Part 串流的方式。



            ??? note "**mediaResolution**: `V1mainMediaResolution` 選用。輸入媒體的媒體解析度。"

                ??? note "**value**: `Union type` 媒體解析度等級。"

                      聯集欄位 `value` 只能是下列其中之一：



                    ??? note "**level**: `string enum` 指定媒體所使用的 Tokenizer 品質。供 Gemini API 支援使用。"

                        可能的值：

                        - `MEDIA_RESOLUTION_UNSPECIFIED`: 尚未設定媒體解析度。
                        - `MEDIA_RESOLUTION_LOW`: 媒體解析度設為低。
                        - `MEDIA_RESOLUTION_MEDIUM`: 媒體解析度設為中。
                        - `MEDIA_RESOLUTION_HIGH`: 媒體解析度設為高。
                        - `MEDIA_RESOLUTION_ULTRA_HIGH`: 媒體解析度設為超高。





            ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以便理解。僅對影片部分（`inline_data` 或 MIME 為影片的 `file_data`）有意義。非影片部分會忽略此欄位。"

                可能的值：

                - `MEDIA_PROCESSING_UNSPECIFIED`: 預設為模型專屬的處理方式。
                - `STATIC`: 固定速率的幀擷取。所有幀都放入上下文。
                - `AGENTIC`: 模型驅動的動態導覽。建議用於大多數使用情境。





            ??? note "**audioTranscription**: `AudioTranscription` 選用。音訊（輸入或輸出）轉錄。僅在此 Part 包含音訊資料時設定。"

                  **text**: required `string`

                  此音訊片段的轉錄文字。

                  **speakerLabel**: `string`

                  選用。標示此音訊片段說話者的標籤（例如 "spk_1"、"spk_2"）。設定 diarization 時才會出現。



                ??? note "**words**: `WordInfo array` 選用。詳細的字詞層級轉錄與時間詳細資訊。設定 word_timestamp 時才會出現。"

                    **word**: required `string`

                    字詞的轉錄。

                    **startOffset**: `string`

                    選用。字詞相對於音訊開頭的開始時間偏移。

                    **endOffset**: `string`

                    選用。字詞相對於音訊開頭的結束時間偏移。





            ??? note "**speechMetadata**: `SpeechMetadata` 選用。套用至文字部分的中繼資料，用來自訂其朗讀或合成方式，例如指定說話者身分或說話風格。"

                **speaker**: `string`

                選用。多說話者合成時選用的說話者名稱。

                **style**: `string`

                選用。語音合成時選用的風格指令。



          **role**: `string`

          選用。內容的產生者。必須是 'user' 或 'model'。設定此欄位有助於多輪對話，否則可留空或不設定。





    ??? note "**systemInstruction**: `Content` 選用。開發人員設定的[系統指令](/docs/text-generation/#system-instructions)。目前僅支援文字。"

        ??? note "**parts**: `Part array` 組成單一訊息的有序 `Parts`。各 Part 的 MIME 類型可能不同。"

            ??? note "**data**: `Union type`"

                  聯集欄位 `data` 只能是下列其中之一：

                  **text**: `string`

                  行內文字。



                ??? note "**inlineData**: `Blob` 行內媒體位元組。"

                    **mimeType**: `string`

                    來源資料的 IANA 標準 MIME 類型。支援的類型範例：

                    - 圖片：image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
                    - 音訊：audio/*, video/audio/s16le, video/audio/wav
                    - 影片：video/*
                    - 文字：text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
                    - 應用程式：application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf。更多上下文請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                    **data**: `string`

                    媒體格式的原始位元組。

                    **displayName**: `string`

                    選用。指定用來向模型參照此 blob 的名稱（例如 "my_blob.png"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 的參照識別碼。





                ??? note "**functionCall**: `FunctionCall` 模型傳回的預測 `FunctionCall`，其中包含代表 `FunctionDeclaration.name` 的字串，以及其引數與值。"

                    **name**: required `string`

                    要呼叫的函式名稱。必須是 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                    **id**: `string`

                    選用。函式呼叫的專屬識別碼。若有填入，用戶端應執行 `function_call`，並傳回帶有相符 `id` 的回應。

                    **args**: `object`

                    選用。JSON 物件格式的函式參數與值。





                ??? note "**functionResponse**: `FunctionResponse` `FunctionCall` 的結果輸出，其中包含代表 `FunctionDeclaration.name` 的字串，以及包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。"

                      **name**: required `string`

                      要呼叫的函式名稱。必須是 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                      **response**: required `object`

                      JSON 物件格式的函式回應。呼叫端可使用任何符合函式語法的自選鍵來傳回函式輸出，例如 "output"、"result" 等。特別是當函式呼叫執行失敗時，回應可包含 "error" 鍵，將錯誤詳細資訊傳回給模型。多媒體內容可透過子物件納入，該子物件包含單一 "$ref" 鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，屬於持有該多媒體的 `FunctionResponsePart`。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

                      **id**: `string`

                      選用。此回應所對應之函式呼叫的識別碼。由用戶端填入，以對應相應函式呼叫的 `id`。



                    ??? note "**parts**: `FunctionResponsePart array` 選用。組成函式回應的有序 `Parts`。各 Part 的 IANA MIME 類型可能不同。"

                        ??? note "**data**: `Union type` 函式回應部分的資料。"

                              聯集欄位 `data` 只能是下列其中之一：



                            ??? note "**inlineData**: `FunctionResponseBlob` 行內媒體位元組。"

                                **mimeType**: `string`

                                來源資料的 IANA 標準 MIME 類型。範例：

                                - image/png
                                - image/jpeg

                                若提供不支援的 MIME 類型，將傳回錯誤。支援類型的完整清單請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                **data**: `string`

                                媒體格式的原始位元組。

                                **displayName**: `string`

                                選用。blob 的顯示名稱。用來提供標籤或檔名以區分各個 blob，並可從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                            ??? note "**fileData**: `FunctionResponseFileData` 以 URI 為基礎的資料。"

                                **fileUri**: required `string`

                                URI.

                                **mimeType**: `string`

                                來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將傳回錯誤。支援類型的完整清單請參閱[多模態函式回應](/docs/function-calling/#multimodal)與[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                **displayName**: `string`

                                選用。檔案的顯示名稱。用來提供標籤或檔名以區分檔案資料，並可從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                        ??? note "**metadata**: `Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個部分的靜態媒體預處理。"


                              聯集欄位 `metadata` 只能是下列其中之一：


                            ??? note "**videoMetadata**: `VideoMetadata` 選用。影片中繼資料。僅應在影片資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                                  **startOffset**: `string`

                                  選用。影片的開始偏移。

                                  **endOffset**: `string`

                                  選用。影片的結束偏移。

                                  **fps**: `number`

                                  選用。傳送給模型的影片幀率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。


                                ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                                      可能的值：

                                      - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                                      - `FRAMES`: 擷取影片影格。
                                      - `AUDIO`: 擷取音軌。
                                      - `TRANSCRIPT`: 擷取音訊逐字稿。


                            ??? note "**documentMetadata**: `DocumentMetadata` 選用。文件中繼資料。僅應在文件資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                                  **startPage**: `integer`

                                  選用。起始頁，以 1 起算，包含起始頁。

                                  **endPage**: `integer`

                                  選用。結束頁，以 1 起算，包含結束頁。


                                ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                                      可能的值：

                                      - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                                      - `PAGE_IMAGE`: 轉譯後的頁面影像。
                                      - `PAGE_TEXT`: 擷取的頁面文字。


                            ??? note "**spreadsheetMetadata**: `SpreadsheetMetadata` 選用。試算表中繼資料。僅應在試算表資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                                  **visibleCells**: `string`

                                  選用。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                                  **sheetIndex**: `integer`

                                  選用。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                                ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                                      可能的值：

                                      - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                                      - `DATA`: 儲存格值、合併儲存格與格式。
                                      - `FORMULAS`: 公式運算式及其計算結果。
                                      - `VISUAL`: 工作表的轉譯影像。


                            ??? note "**audioMetadata**: `AudioMetadata` 選用。音訊中繼資料。僅應在音訊資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                                  **startOffset**: `string`

                                  選用。音訊的開始偏移，相對於音訊串流的開頭。

                                  **endOffset**: `string`

                                  選用。音訊的結束偏移，相對於音訊串流的開頭。


                        ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以便理解。僅對影片部分（`inline_data` 或 MIME 為影片的 `file_data`）有意義。非影片部分會忽略此欄位。"

                            可能的值：

                            - `MEDIA_PROCESSING_UNSPECIFIED`: 預設為模型專屬的處理方式。
                            - `STATIC`: 固定速率的幀擷取。所有幀都放入上下文。
                            - `AGENTIC`: 模型驅動的動態導覽。建議用於大多數使用情境。



                        ??? note "**mediaResolution**: `V1mainMediaResolution` 選用。輸入媒體的媒體解析度。"


                            ??? note "**value**: `Union type` 媒體解析度等級。"


                                  聯集欄位 `value` 只能是下列其中之一：


                                ??? note "**level**: `string enum` 指定媒體所使用的 Tokenizer 品質。供 Gemini API 支援使用。"


                                      可能的值：

                                      - `MEDIA_RESOLUTION_UNSPECIFIED`: 尚未設定媒體解析度。
                                      - `MEDIA_RESOLUTION_LOW`: 媒體解析度設為低。
                                      - `MEDIA_RESOLUTION_MEDIUM`: 媒體解析度設為中。
                                      - `MEDIA_RESOLUTION_HIGH`: 媒體解析度設為高。
                                      - `MEDIA_RESOLUTION_ULTRA_HIGH`: 媒體解析度設為超高。


                      **willContinue**: `boolean`

                      選用。表示函式呼叫將繼續，且會傳回更多回應，使函式呼叫成為產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會忽略。若設為 false，後續回應將不予考慮。允許傳回空的 `response` 並搭配 `will_continue=False`，表示函式呼叫已完成。這仍可能觸發模型生成。若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。



                    ??? note "**scheduling**: `string enum` 選用。指定回應在對話中的排程方式。僅適用於 NON_BLOCKING 函式呼叫，其他情況會忽略。預設為 WHEN_IDLE。"

                        可能的值：

                        - `SCHEDULING_UNSPECIFIED`: 此值未使用。
                        - `SILENT`: 僅將結果加入對話上下文，不中斷也不觸發生成。
                        - `WHEN_IDLE`: 將結果加入對話上下文，並提示生成輸出，不中斷進行中的生成。
                        - `INTERRUPT`: 將結果加入對話上下文，中斷進行中的生成，並提示生成輸出。





                ??? note "**fileData**: `FileData` 以 URI 為基礎的資料。"

                    **fileUri**: required `string`

                    URI.

                    **mimeType**: `string`

                    選用。來源資料的 IANA 標準 MIME 類型。

                    **displayName**: `string`

                    選用。指定用來向模型參照此檔案的名稱（例如 "my_file.pdf"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案的參照識別碼。





                ??? note "**executableCode**: `ExecutableCode` 模型生成、預定要執行的程式碼。"

                    ??? note "**language**: required `string enum` `code` 的程式語言。"

                        可能的值：

                        - `LANGUAGE_UNSPECIFIED`: 未指定的語言。不應使用此值。
                        - `PYTHON`: Python >= 3.10，可使用 numpy 與 simpy。Python 是預設語言。



                      **code**: required `string`

                      要執行的程式碼。

                      **id**: `string`

                      選用。`ExecutableCode` 部分的專屬識別碼。伺服器會傳回 `CodeExecutionResult`，其 `id` 與之相符。





                ??? note "**codeExecutionResult**: `CodeExecutionResult` 執行 `ExecutableCode` 的結果。"

                    ??? note "**outcome**: required `string enum` 程式碼執行的結果。"

                        可能的值：

                        - `OUTCOME_UNSPECIFIED`: 未指定的狀態。不應使用此值。
                        - `OUTCOME_OK`: 程式碼執行成功完成。`output` 包含 stdout（如有）。
                        - `OUTCOME_FAILED`: 程式碼執行失敗。`output` 包含 stderr 與 stdout（如有）。
                        - `OUTCOME_DEADLINE_EXCEEDED`: 程式碼執行時間過長，已取消。可能有也可能沒有部分 `output`。



                      **id**: `string`

                      選用。此結果所對應之 `ExecutableCode` 部分的識別碼。僅在對應的 `ExecutableCode` 有 id 時才會填入。

                      **output**: `string`

                      選用。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。





                ??? note "**toolCall**: `ToolCall` 伺服器端工具呼叫。當模型預測應在伺服器上執行的工具叫用時，會填入此欄位。用戶端應將此訊息回傳給 API。"

                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型。"

                        可能的值：

                        - `TOOL_TYPE_UNSPECIFIED`: 未指定的工具類型。
                        - `GOOGLE_SEARCH_WEB`: Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                        - `GOOGLE_SEARCH_IMAGE`: 圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                        - `URL_CONTEXT`: URL 上下文工具，對應 Tool.url_context。
                        - `GOOGLE_MAPS`: Google 地圖工具，對應 Tool.google_maps。
                        - `FILE_SEARCH`: 檔案搜尋工具，對應 Tool.file_search。
                        - `MEDIA_PROCESSING`: 媒體處理工具類型（例如影片、音訊等），對應多模態理解所使用的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                      **id**: `string`

                      選用。工具呼叫的專屬識別碼。伺服器會傳回帶有相符 `id` 的工具回應。

                      **toolName**: `string`

                      選用。被呼叫的工具名稱。

                      **args**: `object`

                      選用。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





                ??? note "**toolResponse**: `ToolResponse` 伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端以執行對應 `ToolCall` 的結果填入。"

                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型，`tool_type` 與對應 `ToolCall` 中的相符。"

                        可能的值：

                        - `TOOL_TYPE_UNSPECIFIED`: 未指定的工具類型。
                        - `GOOGLE_SEARCH_WEB`: Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                        - `GOOGLE_SEARCH_IMAGE`: 圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                        - `URL_CONTEXT`: URL 上下文工具，對應 Tool.url_context。
                        - `GOOGLE_MAPS`: Google 地圖工具，對應 Tool.google_maps。
                        - `FILE_SEARCH`: 檔案搜尋工具，對應 Tool.file_search。
                        - `MEDIA_PROCESSING`: 媒體處理工具類型（例如影片、音訊等），對應多模態理解所使用的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                      **id**: `string`

                      選用。此回應所對應之工具呼叫的識別碼。

                      **response**: `object`

                      選用。工具回應。





            ??? note "**metadata**: `Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個部分的靜態媒體預處理。"

                  聯集欄位 `metadata` 只能是下列其中之一：



                ??? note "**videoMetadata**: `VideoMetadata` 選用。影片中繼資料。僅應在影片資料以 inline_data 或 file_data 呈現時指定此中繼資料。"

                    **startOffset**: `string`

                    選用。影片的開始偏移。

                    **endOffset**: `string`

                    選用。影片的結束偏移。

                    **fps**: `number`

                    選用。傳送給模型的影片幀率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。


                    ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                          可能的值：

                          - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                          - `FRAMES`: 擷取影片影格。
                          - `AUDIO`: 擷取音軌。
                          - `TRANSCRIPT`: 擷取音訊逐字稿。


                ??? note "**documentMetadata**: `DocumentMetadata` 選用。文件中繼資料。僅應在文件資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                      **startPage**: `integer`

                      選用。起始頁，以 1 起算，包含起始頁。

                      **endPage**: `integer`

                      選用。結束頁，以 1 起算，包含結束頁。


                    ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                          可能的值：

                          - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                          - `PAGE_IMAGE`: 轉譯後的頁面影像。
                          - `PAGE_TEXT`: 擷取的頁面文字。


                ??? note "**spreadsheetMetadata**: `SpreadsheetMetadata` 選用。試算表中繼資料。僅應在試算表資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                      **visibleCells**: `string`

                      選用。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                      **sheetIndex**: `integer`

                      選用。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                    ??? note "**contentLayers**: `string enum array` 選用。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                          可能的值：

                          - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                          - `DATA`: 儲存格值、合併儲存格與格式。
                          - `FORMULAS`: 公式運算式及其計算結果。
                          - `VISUAL`: 工作表的轉譯影像。


                ??? note "**audioMetadata**: `AudioMetadata` 選用。音訊中繼資料。僅應在音訊資料以 inline_data 或 file_data 呈現時指定此中繼資料。"


                      **startOffset**: `string`

                      選用。音訊的開始偏移，相對於音訊串流的開頭。

                      **endOffset**: `string`

                      選用。音訊的結束偏移，相對於音訊串流的開頭。



              **thought**: `boolean`

              選用。表示此部分是否為模型的思考內容。

              **thoughtSignature**: `string`

              選用。思考內容的不透明簽章，可在後續要求中重複使用。

              **partMetadata**: `object`

              與 Part 相關聯的自訂中繼資料。使用 genai.Part 作為內容表示方式的代理，可能需要追蹤這些額外資訊。例如 Part 來源檔案/來源的名稱，或多工處理多個 Part 串流的方式。



            ??? note "**mediaResolution**: `V1mainMediaResolution` 選用。輸入媒體的媒體解析度。"

                ??? note "**value**: `Union type` 媒體解析度等級。"

                      聯集欄位 `value` 只能是下列其中之一：



                    ??? note "**level**: `string enum` 指定媒體所使用的 Tokenizer 品質。供 Gemini API 支援使用。"

                        可能的值：

                        - `MEDIA_RESOLUTION_UNSPECIFIED`: 尚未設定媒體解析度。
                        - `MEDIA_RESOLUTION_LOW`: 媒體解析度設為低。
                        - `MEDIA_RESOLUTION_MEDIUM`: 媒體解析度設為中。
                        - `MEDIA_RESOLUTION_HIGH`: 媒體解析度設為高。
                        - `MEDIA_RESOLUTION_ULTRA_HIGH`: 媒體解析度設為超高。





            ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以便理解。僅對影片部分（`inline_data` 或 MIME 為影片的 `file_data`）有意義。非影片部分會忽略此欄位。"

                可能的值：

                - `MEDIA_PROCESSING_UNSPECIFIED`: 預設為模型專屬的處理方式。
                - `STATIC`: 固定速率的幀擷取。所有幀都放入上下文。
                - `AGENTIC`: 模型驅動的動態導覽。建議用於大多數使用情境。





            ??? note "**audioTranscription**: `AudioTranscription` 選用。音訊（輸入或輸出）轉錄。僅在此 Part 包含音訊資料時設定。"

                  **text**: required `string`

                  此音訊片段的轉錄文字。

                  **speakerLabel**: `string`

                  選用。標示此音訊片段說話者的標籤（例如 "spk_1"、"spk_2"）。設定 diarization 時才會出現。



                ??? note "**words**: `WordInfo array` 選用。詳細的字詞層級轉錄與時間詳細資訊。設定 word_timestamp 時才會出現。"

                    **word**: required `string`

                    字詞的轉錄。

                    **startOffset**: `string`

                    選用。字詞相對於音訊開頭的開始時間偏移。

                    **endOffset**: `string`

                    選用。字詞相對於音訊開頭的結束時間偏移。





            ??? note "**speechMetadata**: `SpeechMetadata` 選用。套用至文字部分的中繼資料，用來自訂其朗讀或合成方式，例如指定說話者身分或說話風格。"

                **speaker**: `string`

                選用。多說話者合成時選用的說話者名稱。

                **style**: `string`

                選用。語音合成時選用的風格指令。



          **role**: `string`

          選用。內容的產生者。必須是 'user' 或 'model'。設定此欄位有助於多輪對話，否則可留空或不設定。





    ??? note "**tools**: `Tool array` 選用。以下是 `Tools` 清單，`Model` 可用來生成下一個回應。`Tool` 是一段程式碼，讓系統能與外部系統互動，執行 `Model` 知識與範圍之外的一個或一組動作。支援的 `Tool` 為 `Function` 與 `code_execution`。詳情請參閱[函式呼叫](/docs/function-calling/)與[程式碼執行](/docs/code-execution/)指南。"

        ??? note "**functionDeclarations**: `FunctionDeclaration array` 選用。可供模型用於函式呼叫的 `FunctionDeclarations` 清單。模型或系統不會執行函式。改由將定義的函式以帶有引數的 FunctionCall 傳回用戶端執行。模型可決定呼叫這些函式的子集，在回應中填入 FunctionCall。下一個對話輪次可包含 FunctionResponse，作為下一個模型輪次中 Content.role 為 'function' 的生成上下文。"

              **name**: required `string`

              函式的名稱。必須是 a-z、A-Z、0-9，或包含底線、冒號、句點與連字號，長度上限為 128。

              **description**: required `string`

              函式的簡短說明。



            ??? note "**parameters**: `Schema` 選用。描述此函式的參數。反映 Open API 3.03 Parameter Object：字串 Key 為參數名稱，參數名稱區分大小寫；Schema Value 為定義參數所用類型的 Schema。"

                ??? note "**type**: required `Type` 資料類型。"

                    可能的值：

                    - `TYPE_UNSPECIFIED`: 未指定，不應使用。
                    - `STRING`: 字串類型。
                    - `NUMBER`: 數字類型。
                    - `INTEGER`: 整數類型。
                    - `BOOLEAN`: 布林類型。
                    - `ARRAY`: 陣列類型。
                    - `OBJECT`: 物件類型。
                    - `NULL`: Null 類型。



                  **format**: `string`

                  選用。資料的格式。允許任何值，但大多數值不會觸發任何特殊功能。

                  **title**: `string`

                  選用。schema 的標題。

                  **description**: `string`

                  選用。參數的簡短說明，可包含使用範例。參數說明可使用 Markdown 格式。

                  **nullable**: `boolean`

                  選用。表示值是否可為 null。

                  **enum**: `string array`

                  選用。Type.STRING 元素在 enum 格式下的可能值。例如可將 Enum Direction 定義為：{type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]}

                  **items**: `Schema`

                  選用。Type.ARRAY 元素的 Schema。

                  **maxItems**: `string`

                  選用。Type.ARRAY 的元素數量上限。

                  **minItems**: `string`

                  選用。Type.ARRAY 的元素數量下限。

                  **properties**: `object`

                  選用。Type.OBJECT 的屬性。

                  **required**: `string array`

                  選用。Type.OBJECT 的必填屬性。

                  **minProperties**: `string`

                  選用。Type.OBJECT 的屬性數量下限。

                  **maxProperties**: `string`

                  選用。Type.OBJECT 的屬性數量上限。

                  **minimum**: `number`

                  選用。TYPE INTEGER 與 NUMBER 的 SCHEMA 欄位：Type.INTEGER 與 Type.NUMBER 的最小值

                  **maximum**: `number`

                  選用。Type.INTEGER 與 Type.NUMBER 的最大值

                  **minLength**: `string`

                  選用。TYPE STRING 的 SCHEMA 欄位：Type.STRING 的長度下限

                  **maxLength**: `string`

                  選用。Type.STRING 的長度上限

                  **pattern**: `string`

                  選用。Type.STRING 的模式，用來將字串限制為正規表示式。

                  **example**: `object`

                  選用。物件的範例。僅在物件為根物件時才會填入。

                  **anyOf**: `Schema array`

                  選用。值應對照清單中的任一（一個或多個）子 schema 進行驗證。

                  **propertyOrdering**: `string array`

                  選用。屬性的順序。並非 Open API 規格的標準欄位。用來決定回應中屬性的順序。

                  **default**: `object`

                  選用。欄位的預設值。依據 JSON Schema，此欄位是供文件產生器使用，不影響驗證。因此在此納入並忽略，讓傳送含有 `default` 欄位之 schema 的開發人員不會收到未知欄位錯誤。



              **parametersJsonSchema**: `object`

              選用。以 JSON Schema 格式描述函式的參數。schema 必須描述一個物件，其屬性即為函式的參數。例如：`{ "type": "object", "properties": { "name": { "type": "string" }, "age": { "type": "integer" } }, "additionalProperties": false, "required": ["name", "age"], "propertyOrdering": ["name", "age"] }` 此欄位與 `parameters` 互斥。



            ??? note "**response**: `Schema` 選用。以 JSON Schema 格式描述此函式的輸出。反映 Open API 3.03 Response Object。Schema 定義函式回應值所使用的類型。"

                ??? note "**type**: required `Type` 資料類型。"

                    可能的值：

                    - `TYPE_UNSPECIFIED`: 未指定，不應使用。
                    - `STRING`: 字串類型。
                    - `NUMBER`: 數字類型。
                    - `INTEGER`: 整數類型。
                    - `BOOLEAN`: 布林類型。
                    - `ARRAY`: 陣列類型。
                    - `OBJECT`: 物件類型。
                    - `NULL`: Null 類型。



                  **format**: `string`

                  選用。資料的格式。允許任何值，但大多數值不會觸發任何特殊功能。

                  **title**: `string`

                  選用。schema 的標題。

                  **description**: `string`

                  選用。參數的簡短說明，可包含使用範例。參數說明可使用 Markdown 格式。

                  **nullable**: `boolean`

                  選用。表示值是否可為 null。

                  **enum**: `string array`

                  選用。Type.STRING 元素在 enum 格式下的可能值。例如可將 Enum Direction 定義為：{type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]}

                  **items**: `Schema`

                  選用。Type.ARRAY 元素的 Schema。

                  **maxItems**: `string`

                  選用。Type.ARRAY 的元素數量上限。

                  **minItems**: `string`

                  選用。Type.ARRAY 的元素數量下限。

                  **properties**: `object`

                  選用。Type.OBJECT 的屬性。

                  **required**: `string array`

                  選用。Type.OBJECT 的必填屬性。

                  **minProperties**: `string`

                  選用。Type.OBJECT 的屬性數量下限。

                  **maxProperties**: `string`

                  選用。Type.OBJECT 的屬性數量上限。

                  **minimum**: `number`

                  選用。TYPE INTEGER 與 NUMBER 的 SCHEMA 欄位：Type.INTEGER 與 Type.NUMBER 的最小值

                  **maximum**: `number`

                  選用。Type.INTEGER 與 Type.NUMBER 的最大值

                  **minLength**: `string`

                  選用。TYPE STRING 的 SCHEMA 欄位：Type.STRING 的長度下限

                  **maxLength**: `string`

                  選用。Type.STRING 的長度上限

                  **pattern**: `string`

                  選用。Type.STRING 的模式，用來將字串限制為正規表示式。

                  **example**: `object`

                  選用。物件的範例。僅在物件為根物件時才會填入。

                  **anyOf**: `Schema array`

                  選用。值應對照清單中的任一（一個或多個）子 schema 進行驗證。

                  **propertyOrdering**: `string array`

                  選用。屬性的順序。並非 Open API 規格的標準欄位。用來決定回應中屬性的順序。

                  **default**: `object`

                  選用。欄位的預設值。依據 JSON Schema，此欄位是供文件產生器使用，不影響驗證。因此在此納入並忽略，讓傳送含有 `default` 欄位之 schema 的開發人員不會收到未知欄位錯誤。



              **responseJsonSchema**: `object`

              選用。以 JSON Schema 格式描述此函式的輸出。schema 指定的值即為函式的回應值。此欄位與 `response` 互斥。



            ??? note "**behavior**: `string enum` 選用。指定函式的 Behavior。目前僅 BidiGenerateContent 方法支援。"

                可能的值：

                - `UNSPECIFIED`: 此值未使用。
                - `BLOCKING`: 若設定，系統會等待收到函式回應後才繼續對話。
                - `NON_BLOCKING`: 若設定，系統不會等待收到函式回應。改為在維持使用者與模型對話的同時，嘗試在函式回應可用時加以處理。





        ??? note "**googleSearchRetrieval**: `GoogleSearchRetrieval` 選用。由 Google 搜尋驅動的檢索工具。"

            ??? note "**dynamicRetrievalConfig**: `DynamicRetrievalConfig` 指定指定來源的動態檢索設定。"

                ??? note "**mode**: `string enum` 動態檢索要使用的預測器模式。"

                    可能的值：

                    - `MODE_UNSPECIFIED`: 一律觸發檢索。
                    - `MODE_DYNAMIC`: 僅在系統判斷有必要時才執行檢索。



                  **dynamicThreshold**: `number`

                  動態檢索要使用的閾值。若未設定，使用系統預設值。





        ??? note "**codeExecution**: `CodeExecution` 選用。讓模型能在生成過程中執行程式碼。"






        ??? note "**googleSearch**: `GoogleSearch` 選用。GoogleSearch 工具類型。在 Model 中支援 Google Search 的工具。由 Google 提供。"

            ??? note "**timeRangeFilter**: `Interval` 選用。將搜尋結果篩選至特定時間範圍。若客戶設定了開始時間，就必須設定結束時間（反之亦然）。"

                **startTime**: `string`

                選用。區間的含端點起始位置。若有指定，符合此區間的 Timestamp 必須等於或晚於起始位置。

                **endTime**: `string`

                選用。區間的不含端點結束位置。若有指定，符合此區間的 Timestamp 必須早於結束位置。





            ??? note "**searchTypes**: `SearchTypes` 選用。要啟用的搜尋類型集合。若未設定，預設啟用網路搜尋。"

                ??? note "**webSearch**: `WebSearch` 選用。啟用網路搜尋。僅傳回文字結果。"






                ??? note "**imageSearch**: `ImageSearch` 選用。啟用圖片搜尋。傳回圖片位元組。"





        ??? note "**computerUse**: `ComputerUse` 選用。支援模型直接與電腦互動的工具。啟用後，會自動填入 computer-use 專屬的 Function Declarations。"

            ??? note "**environment**: required `string enum` 所操作的環境。"

                可能的值：

                - `ENVIRONMENT_UNSPECIFIED`: 預設為瀏覽器。
                - `ENVIRONMENT_BROWSER`: 在網路瀏覽器中操作。
                - `ENVIRONMENT_MOBILE`: 在行動環境中操作。
                - `ENVIRONMENT_DESKTOP`: 在桌面環境中操作。



              **excludedPredefinedFunctions**: `string array`

              選用。根據預設，預先定義的函式會納入最終的模型呼叫中。其中部分函式可明確排除、不自動納入。這有兩個用途：1. 使用更受限/不同的動作空間。2. 改善預先定義函式的定義/指令。

              **enablePromptInjectionDetection**: `boolean`

              選用。是否對 computer-use 要求啟用提示詞注入偵測檢查。



            ??? note "**disabledSafetyPolicies**: `string enum array` 選用。computer use 已停用的安全政策。"

                可能的值：

                - `SAFETY_POLICY_UNSPECIFIED`: 未指定的安全政策。
                - `FINANCIAL_TRANSACTIONS`: 金融交易的安全政策。
                - `SENSITIVE_DATA_MODIFICATION`: 敏感資料修改的安全政策。
                - `COMMUNICATION_TOOL`: 通訊工具（例如 Gmail、Chat、Meet）的安全政策。
                - `ACCOUNT_CREATION`: 帳號建立的安全政策。
                - `DATA_MODIFICATION`: 資料修改的安全政策。
                - `USER_CONSENT_MANAGEMENT`: 使用者同意管理的安全政策。
                - `LEGAL_TERMS_AND_AGREEMENTS`: 法律條款與協議的安全政策。





        ??? note "**urlContext**: `UrlContext` 選用。支援 URL 上下文檢索的工具。"






        ??? note "**fileSearch**: `FileSearch` 選用。FileSearch 工具類型。從 Semantic Retrieval 語料庫檢索知識的工具。"

            **fileSearchStoreNames**: required `string array`

            要從中檢索的 file_search_stores 名稱。範例：`fileSearchStores/my-file-search-store-123`

            **topK**: `integer`

            選用。要檢索的語意檢索區塊數量。

            **metadataFilter**: `string`

            選用。要套用至語意檢索文件與區塊的中繼資料篩選條件。





        ??? note "**mcpServers**: `McpServer array` 選用。要連線的 MCP Servers。"

            ??? note "**transport**: `Union type` 用來連線至 MCPServer 的傳輸方式。"

                  聯集欄位 `transport` 只能是下列其中之一：



                ??? note "**streamableHttpTransport**: `StreamableHttpTransport` 可串流 HTTP 要求與回應的傳輸方式。"

                    **url**: `string`

                    MCPServer 端點的完整 URL。範例："https://api.example.com/mcp"

                    **headers**: `object`

                    選用：如有需要，提供驗證標頭、逾時等欄位。

                    **timeout**: `string`

                    一般操作的 HTTP 逾時。

                    **sseReadTimeout**: `string`

                    SSE 讀取操作的逾時。

                    **terminateOnClose**: `boolean`

                    傳輸關閉時是否關閉用戶端工作階段。



              **name**: `string`

              MCPServer 的名稱。





        ??? note "**googleMaps**: `GoogleMaps` 選用。讓模型的回應能以與使用者查詢相關的地理空間上下文接地的工具。"

            **enableWidget**: `boolean`

            選用。是否在回應的 GroundingMetadata 中傳回 widget 上下文 token。開發人員可使用 widget 上下文 token，算繪與模型在回應中參照之地點相關地理空間上下文的 Google Maps widget。





    ??? note "**toolConfig**: `ToolConfig` 選用。要求中指定的任何 `Tool` 的工具設定。使用範例請參閱[函式呼叫指南](/docs/function-calling/#function_calling_modes)。"

        ??? note "**functionCallingConfig**: `FunctionCallingConfig` 選用。函式呼叫設定。"

            ??? note "**mode**: `string enum` 選用。指定函式呼叫應執行的模式。若未指定，預設值為 AUTO。"

                可能的值：

                - `MODE_UNSPECIFIED`: 未指定的函式呼叫模式。不應使用此值。
                - `AUTO`: 預設模型行為，由模型決定預測函式呼叫或自然語言回應。
                - `ANY`: 模型被限制為一律僅預測函式呼叫。若設定了 "allowed_function_names"，預測的函式呼叫將限於 "allowed_function_names" 中的任一個，否則預測的函式呼叫將是提供的 "function_declarations" 中的任一個。
                - `NONE`: 模型不會預測任何函式呼叫。模型行為與未傳入任何函式宣告時相同。
                - `VALIDATED`: 模型決定預測函式呼叫或自然語言回應，但會以受限解碼驗證函式呼叫。若設定了 "allowed_function_names"，預測的函式呼叫將限於 "allowed_function_names" 中的任一個，否則預測的函式呼叫將是提供的 "function_declarations" 中的任一個。



              **allowedFunctionNames**: `string array`

              選用。函式名稱集合，提供後可限制模型可呼叫的函式。僅應在 Mode 為 ANY 或 VALIDATED 時設定。函式名稱應與 [FunctionDeclaration.name] 相符。設定後，模型只會從允許的函式名稱中預測函式呼叫。





        ??? note "**retrievalConfig**: `RetrievalConfig` 選用。檢索設定。"

            ??? note "**latLng**: `LatLng` 選用。使用者的位置。"

                **latitude**: `number`

                緯度（度）。必須在 [-90.0, +90.0] 範圍內。

                **longitude**: `number`

                經度（度）。必須在 [-180.0, +180.0] 範圍內。



              **languageCode**: `string`

              選用。使用者的語言代碼。內容的語言代碼。使用 [BCP47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) 定義的語言標籤。



          **includeServerSideToolInvocations**: `boolean`

          選用。若為 true，API 回應會在 `Content` 訊息中納入伺服器端工具呼叫與回應，讓用戶端能觀察伺服器的工具互動。





    ??? note "**safetySettings**: `SafetySetting array` 選用。用於封鎖不安全內容的專屬 `SafetySetting` 執行個體清單。會對 `GenerateContentRequest.contents` 與 `GenerateContentResponse.candidates` 強制套用。每個 `SafetyCategory` 類型不應有多個設定。API 會封鎖任何未達到這些設定所定閾值的內容與回應。此清單會覆寫 safety_settings 中指定的每個 `SafetyCategory` 的預設設定。若清單中未提供 `SafetySetting`（針對某個 `SafetyCategory`），API 會使用該類別的預設安全設定。支援的危害類別為 HARM_CATEGORY_HATE_SPEECH、HARM_CATEGORY_SEXUALLY_EXPLICIT、HARM_CATEGORY_DANGEROUS_CONTENT、HARM_CATEGORY_HARASSMENT、HARM_CATEGORY_CIVIC_INTEGRITY、HARM_CATEGORY_JAILBREAK。可用的安全設定的詳細資訊請參閱[指南](/docs/safety-settings/)。另請參閱[安全指南](/docs/safety-guidance/)，瞭解如何將安全考量納入 AI 應用程式。"

        ??? note "**category**: required `HarmCategory` 此設定的類別。"

            可能的值：

            - `HARM_CATEGORY_UNSPECIFIED`: 類別未指定。
            - `HARM_CATEGORY_HARASSMENT`: **Gemini** - 騷擾內容。
            - `HARM_CATEGORY_HATE_SPEECH`: **Gemini** - 仇恨言論與內容。
            - `HARM_CATEGORY_SEXUALLY_EXPLICIT`: **Gemini** - 性露骨內容。
            - `HARM_CATEGORY_DANGEROUS_CONTENT`: **Gemini** - 危險內容。
            - `HARM_CATEGORY_JAILBREAK`: **Gemini** - 企圖繞過或顛覆模型安全準則的提示詞（越獄嘗試）。





        ??? note "**threshold**: required `string enum` 控制封鎖危害的機率閾值。"

            可能的值：

            - `HARM_BLOCK_THRESHOLD_UNSPECIFIED`: 閾值未指定。
            - `BLOCK_LOW_AND_ABOVE`: NEGLIGIBLE 的內容將被允許。
            - `BLOCK_MEDIUM_AND_ABOVE`: NEGLIGIBLE 與 LOW 的內容將被允許。
            - `BLOCK_ONLY_HIGH`: NEGLIGIBLE、LOW 與 MEDIUM 的內容將被允許。
            - `BLOCK_NONE`: 所有內容都將被允許。
            - `OFF`: 關閉安全篩選器。





    ??? note "**generationConfig**: `GenerationConfig` 選用。模型生成與輸出的設定選項。"

          **candidateCount**: `integer`

          選用。要傳回的生成回應數量。若未設定，預設為 1。請注意，此設定不適用於上一代模型（Gemini 1.0 系列）

          **stopSequences**: `string array`

          選用。會停止輸出生成的字元序列集合（最多 5 個）。若有指定，API 會在 `stop_sequence` 首次出現時停止。停止序列不會納入回應中。

          **maxOutputTokens**: `integer`

          選用。回應候選中要納入的 token 數量上限。注意：預設值因模型而異，請參閱 `Model.output_token_limit` 屬性，其所屬的 `Model` 由 `getModel` 函式傳回。

          **temperature**: `number`

          選用。控制輸出的隨機程度。注意：預設值因模型而異，請參閱 `Model.temperature` 屬性，其所屬的 `Model` 由 `getModel` 函式傳回。值範圍為 [0.0, 2.0]。Gemini 3.6 Flash 及更新的模型已不再支援此欄位，會靜默忽略。

          **topP**: `number`

          選用。取樣時要考量的 token 累積機率上限。模型結合使用 Top-k 與 Top-p（nucleus）取樣。token 會依其指派的機率排序，僅考量最可能的 token。Top-k 取樣直接限制考量的 token 數量上限，Nucleus 取樣則依累積機率限制 token 數量。注意：預設值因 `Model` 而異，由 `Model.top_p` 屬性指定，該屬性由 `getModel` 函式傳回。空的 `top_k` 屬性表示模型不套用 top-k 取樣，也不允許在要求中設定 `top_k`。Gemini 3.6 Flash 及更新的模型已不再支援此欄位，會靜默忽略。

          **topK**: `integer`

          選用。取樣時要考量的 token 數量上限。Gemini 模型使用 Top-p（nucleus）取樣，或 Top-k 與 nucleus 取樣的組合。Top-k 取樣考量機率最高的 `top_k` 個 token 組成的集合。使用 nucleus 取樣的模型不允許設定 top_k。注意：預設值因 `Model` 而異，由 `Model.top_p` 屬性指定，該屬性由 `getModel` 函式傳回。空的 `top_k` 屬性表示模型不套用 top-k 取樣，也不允許在要求中設定 `top_k`。Gemini 3.6 Flash 及更新的模型已不再支援此欄位，會靜默忽略。

          **seed**: `integer`

          選用。解碼時使用的種子。若未設定，要求會使用隨機產生的種子。

          **responseMimeType**: `string`

          選用。生成候選文字的 MIME 類型。支援的 MIME 類型如下：`text/plain`：（預設）文字輸出。`application/json`：回應候選中的 JSON 回應。`text/x.enum`：回應候選中以字串形式呈現的 ENUM 回應。所有支援的文字 MIME 類型清單請參閱[文件](/docs/file-input-methods/#text-file-types)。

          **responseJsonSchema**: `object`

          選用。內部細節。請改用 `responseJsonSchema`，不要使用此欄位。

          **presencePenalty**: `number`

          選用。若 token 已在回應中出現，套用至下一個 token logprobs 的存在懲罰。此懲罰為二元開/關，不取決於 token 的使用次數（第一次之後）。若需要隨使用次數增加的懲罰，請使用 frequency_penalty。正值的懲罰會降低使用已用過 token 的意願，增加詞彙量。負值的懲罰會鼓勵使用已用過的 token，減少詞彙量。

          **frequencyPenalty**: `number`

          選用。套用至下一個 token logprobs 的頻率懲罰，乘以每個 token 到目前為止在回應中出現的次數。正值的懲罰會依 token 已使用的次數比例，降低再次使用已用過 token 的意願：token 用得越多，模型就越難再次使用該 token，從而增加回應的詞彙量。注意：*負值*的懲罰會依 token 已使用的次數比例，鼓勵模型重複使用 token。較小的負值會減少回應的詞彙量；較大的負值會使模型不斷重複某個常見 token，直到達到 max_output_tokens 上限。

          **responseLogprobs**: `boolean`

          選用。若為 true，在回應中輸出 logprobs 結果。

          **logprobs**: `integer`

          選用。僅在 response_logprobs=True 時有效。設定在每個解碼步驟中，於 Candidate.logprobs_result 傳回的頂尖 logprobs 數量（含所選候選）。數值必須在 [0, 20] 範圍內。

          **enableEnhancedCivicAnswers**: `boolean`

          選用。啟用強化公民問答。並非所有模型都提供此功能。



        ??? note "**responseModalities**: `string enum array` 選用。要求的回應模態。代表模型可傳回、且應在回應中預期出現的模態集合。這與回應的模態完全相符。模型可能有多種支援的模態組合。若要求的模態與任何支援的組合都不相符，將傳回錯誤。空清單等同於僅要求文字。"

            可能的值：

            - `MODALITY_UNSPECIFIED`: 預設值。
            - `TEXT`: 表示模型應傳回文字。
            - `IMAGE`: 表示模型應傳回圖片。
            - `AUDIO`: 表示模型應傳回音訊。





        ??? note "**speechConfig**: `SpeechConfig` 選用。語音生成設定。"

            ??? note "**voiceConfig**: `VoiceConfig` 單一語音輸出時的設定。"

                ??? note "**voiceConfig**: `Union type` 要使用的說話者設定。"

                      聯集欄位 `voiceConfig` 只能是下列其中之一：



                    ??? note "**prebuiltVoiceConfig**: `PrebuiltVoiceConfig` 要使用的預建語音設定。"

                        **voiceName**: `string`

                        選用。要使用的預設語音名稱。



                      **voice**: `string`

                      選用。用於合成的說話者識別碼。支援的格式：

                      - 預建語音的說話者名稱（例如 `Orus` 或 `Kore`）。
                      - 已儲存語音的 Voice ID（例如 `voice_xxx`）。
                      - 語音複製金鑰（例如 `voicekey_xxx`）。





            ??? note "**multiSpeakerVoiceConfig**: `MultiSpeakerVoiceConfig` 選用。多說話者設定的設定。與 voice_config 欄位互斥。"

                ??? note "**speakerVoiceConfigs**: required `SpeakerVoiceConfig array` 所有已啟用的說話者語音。"

                      **speaker**: required `string`

                      要使用的說話者名稱。應與提示詞中的名稱相同。



                    ??? note "**voiceConfig**: required `VoiceConfig` 要使用的語音設定。"

                        ??? note "**voiceConfig**: `Union type` 要使用的說話者設定。"

                              聯集欄位 `voiceConfig` 只能是下列其中之一：



                            ??? note "**prebuiltVoiceConfig**: `PrebuiltVoiceConfig` 要使用的預建語音設定。"

                                **voiceName**: `string`

                                選用。要使用的預設語音名稱。



                              **voice**: `string`

                              選用。用於合成的說話者識別碼。支援的格式：

                              - 預建語音的說話者名稱（例如 `Orus` 或 `Kore`）。
                              - 已儲存語音的 Voice ID（例如 `voice_xxx`）。
                              - 語音複製金鑰（例如 `voicekey_xxx`）。



              **languageCode**: `string`

              選用。使用者為應用程式設定的 IETF [BCP-47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) 語言代碼。用於語音辨識與合成。有效值為：`de-DE`、`en-AU`、`en-GB`、`en-IN`、`en-US`、`es-US`、`fr-FR`、`hi-IN`、`pt-BR`、`ar-XA`、`es-ES`、`fr-CA`、`id-ID`、`it-IT`、`ja-JP`、`tr-TR`、`vi-VN`、`bn-IN`、`gu-IN`、`kn-IN`、`ml-IN`、`mr-IN`、`ta-IN`、`te-IN`、`nl-NL`、`ko-KR`、`cmn-CN`、`pl-PL`、`ru-RU` 以及 `th-TH`。





        ??? note "**thinkingConfig**: `ThinkingConfig` 選用。思考功能的設定。若為不支援思考的模型設定此欄位，將傳回錯誤。"

              **includeThoughts**: `boolean`

              表示是否在回應中納入思考內容。若為 true，僅在有思考內容時才傳回。

              **thinkingBudget**: `integer`

              模型應生成的思考 token 數量。



            ??? note "**thinkingLevel**: `string enum` 選用。控制模型在產生回應前，內部推理過程的最大深度。預設值因模型而異。詳情請參閱[思考等級指南](/docs/thinking/#thinking-levels)。建議用於 Gemini 3 或更新的模型。用於較早的模型會導致錯誤。"

                可能的值：

                - `THINKING_LEVEL_UNSPECIFIED`: 預設值。
                - `MINIMAL`: 幾乎不思考。
                - `LOW`: 低思考等級。
                - `MEDIUM`: 中思考等級。
                - `HIGH`: 高思考等級。
                - `XHIGH`: 超高思考等級。





        ??? note "**imageConfig**: `ImageConfig` 選用。圖片生成的設定。若為不支援這些設定選項的模型設定此欄位，將傳回錯誤。"

            **aspectRatio**: `string`

            選用。要生成的圖片長寬比。支援的長寬比：`1:1`、`1:4`、`4:1`、`1:8`、`8:1`、`2:3`、`3:2`、`3:4`、`4:3`、`4:5`、`5:4`、`9:16`、`16:9` 或 `21:9`。若未指定，模型會依據提供的任何參照圖片選擇預設長寬比。

            **imageSize**: `string`

            選用。指定生成圖片的大小。支援的值為 `512`、`1K`、`2K`、`4K`。若未指定，模型會使用預設值 `1K`。





        ??? note "**mediaResolution**: `string enum` 選用。若有指定，將使用指定的媒體解析度。"

            可能的值：

            - `MEDIA_RESOLUTION_UNSPECIFIED`: 尚未設定媒體解析度。
            - `MEDIA_RESOLUTION_LOW`: 媒體解析度設為低（64 tokens）。
            - `MEDIA_RESOLUTION_MEDIUM`: 媒體解析度設為中（256 tokens）。
            - `MEDIA_RESOLUTION_HIGH`: 媒體解析度設為高（以 256 tokens 縮放重新取景）。



          **enableAffectiveDialog**: `boolean`

          選用。啟用後，模型會偵測情緒並據此調整回應。



        ??? note "**responseFormat**: `ResponseFormatConfig` 選用。回應輸出格式的設定。可在扁平結構中依模態（文字、音訊、圖片）指定輸出設定。"

            ??? note "**text**: `TextResponseFormat` 選用。文字輸出格式設定。"

                ??? note "**mimeType**: `string enum` 選用。文字輸出的 MIME 類型。"

                    可能的值：

                    - `MIME_TYPE_UNSPECIFIED`: 預設值。此值未使用。
                    - `APPLICATION_JSON`: JSON 輸出格式。
                    - `TEXT_PLAIN`: 純文字輸出格式。



                  **schema**: `object`

                  選用。輸出應符合的 JSON schema。僅在 mime_type 為 APPLICATION_JSON 時適用。





            ??? note "**audio**: `AudioResponseFormat` 選用。音訊輸出格式設定。"

                ??? note "**mimeType**: `string enum` 選用。音訊輸出的 MIME 類型。"

                    可能的值：

                    - `MIME_TYPE_UNSPECIFIED`: 預設值。此值未使用。
                    - `AUDIO_MP3`: MP3 音訊格式。
                    - `AUDIO_OGG_OPUS`: OGG Opus 音訊格式。
                    - `AUDIO_L16`: 原始 PCM（L16）音訊格式。
                    - `AUDIO_WAV`: WAV 音訊格式。
                    - `AUDIO_ALAW`: A-law 音訊格式。
                    - `AUDIO_MULAW`: Mu-law 音訊格式。





                ??? note "**delivery**: `string enum` 選用。音訊輸出的傳遞模式。"

                    可能的值：

                    - `DELIVERY_UNSPECIFIED`: 預設值。此值未使用。
                    - `INLINE`: 音訊資料以行內方式在回應中傳回。
                    - `URI`: 音訊資料以 URI 形式傳回。



                  **sampleRate**: `integer`

                  選用。取樣率，單位為 Hz。

                  **bitRate**: `integer`

                  選用。位元率，單位為每秒位元數（bps）。僅適用於壓縮格式（MP3、Opus）。





            ??? note "**image**: `ImageResponseFormat` 選用。圖片輸出格式設定。"

                ??? note "**mimeType**: `string enum` 選用。圖片輸出的 MIME 類型。"

                    可能的值：

                    - `MIME_TYPE_UNSPECIFIED`: 預設值。此值未使用。
                    - `IMAGE_JPEG`: JPEG 圖片格式。





                ??? note "**delivery**: `string enum` 選用。圖片輸出的傳遞模式。"

                    可能的值：

                    - `DELIVERY_UNSPECIFIED`: 預設值。此值未使用。
                    - `INLINE`: 圖片資料以行內方式在回應中傳回。
                    - `URI`: 圖片資料以 URI 形式傳回。





                ??? note "**aspectRatio**: `string enum` 選用。圖片輸出的長寬比。"

                    可能的值：

                    - `ASPECT_RATIO_UNSPECIFIED`: 預設值。此值未使用。
                    - `ASPECT_RATIO_ONE_BY_ONE`: 1:1 長寬比。
                    - `ASPECT_RATIO_TWO_BY_THREE`: 2:3 長寬比。
                    - `ASPECT_RATIO_THREE_BY_TWO`: 3:2 長寬比。
                    - `ASPECT_RATIO_THREE_BY_FOUR`: 3:4 長寬比。
                    - `ASPECT_RATIO_FOUR_BY_THREE`: 4:3 長寬比。
                    - `ASPECT_RATIO_FOUR_BY_FIVE`: 4:5 長寬比。
                    - `ASPECT_RATIO_FIVE_BY_FOUR`: 5:4 長寬比。
                    - `ASPECT_RATIO_NINE_BY_SIXTEEN`: 9:16 長寬比。
                    - `ASPECT_RATIO_SIXTEEN_BY_NINE`: 16:9 長寬比。
                    - `ASPECT_RATIO_TWENTY_ONE_BY_NINE`: 21:9 長寬比。
                    - `ASPECT_RATIO_ONE_BY_EIGHT`: 1:8 長寬比。
                    - `ASPECT_RATIO_EIGHT_BY_ONE`: 8:1 長寬比。
                    - `ASPECT_RATIO_ONE_BY_FOUR`: 1:4 長寬比。
                    - `ASPECT_RATIO_FOUR_BY_ONE`: 4:1 長寬比。





                ??? note "**imageSize**: `string enum` 選用。圖片輸出的大小。"

                    可能的值：

                    - `IMAGE_SIZE_UNSPECIFIED`: 預設值。此值未使用。
                    - `IMAGE_SIZE_FIVE_TWELVE`: 512px 圖片大小。
                    - `IMAGE_SIZE_ONE_K`: 1K 圖片大小。
                    - `IMAGE_SIZE_TWO_K`: 2K 圖片大小。
                    - `IMAGE_SIZE_FOUR_K`: 4K 圖片大小。





        ??? note "**translationConfig**: `TranslationConfig` 選用。翻譯設定。"

            **targetLanguageCode**: required `string`

            翻譯的目標語言。支援的值為 BCP-47 語言代碼（例如 "en"、"es"、"fr"）。

            **echoTargetLanguage**: `boolean`

            選用。若為 true，當說出目標語言時，模型會產生音訊，基本上就是覆誦輸入內容。若為 false，則不會為目標語言產生音訊。





        ??? note "**audioTranscriptionConfig**: `AudioTranscriptionConfig` 選用。音訊轉錄（語音辨識）設定。"

              **languageCodes**: `string array`

              選用。BCP-47 語言代碼，提供音訊中所含語言的提示。若省略或留空，預設為自動偵測語言。

              **customVocabulary**: `string array`

              選用。自訂詞彙片語清單，用來引導語音辨識模型偏向辨識特定詞彙（產品名稱、專有名詞、術語）。

              **wordTimestamp**: `boolean`

              選用。設定是否產生字詞層級的時間戳記。

              **diarization**: `boolean`

              選用。設定說話者分離（speaker diarization）。

              **sourceText**: `string`

              選用。要透過語音指令編輯或改寫的來源文字。在 `SMART` 模式下提供時，模型會對照此文字評估音訊輸入，並在候選回應中輸出完整的取代文字，而不是附加在其後。



            ??? note "**mode**: `string enum` 選用。設定轉錄模式。支援的值：`VERBATIM`、`SMART`。若未指定，預設為 `VERBATIM` 轉錄。在 `SMART` 模式下，模型會進行不流暢內容移除（消除填充詞、重複與錯誤開頭）、輕度文法清理、自動格式化（段落、項目符號、編號清單），以及小幅使用者編輯（行內自我修正）。時間戳記與說話者分離與 `SMART` 模式不相容。"

                可能的值：

                - `MODE_UNSPECIFIED`: 未指定的轉錄模式。
                - `VERBATIM`: 逐字轉錄模式。
                - `SMART`: 智慧轉錄模式。



      **cachedContent**: `string`

      選用。要作為預測上下文使用的已[快取](/docs/caching/)內容名稱。格式：`cachedContents/{cachedContent}`



    ??? note "**serviceTier**: `ServiceTier` 選用。要求的服務層級。"

        可能的值：

        - `unspecified`: 預設服務層級，即標準層級。
        - `standard`: 標準服務層級。
        - `flex`: Flex 服務層級。
        - `priority`: Priority 服務層級。



      **store**: `boolean`

      選用。設定特定要求的記錄行為。若有設定，優先於專案層級的記錄設定。

      **continuationToken**: `string`

      選用。不透明的接續 token，用來從先前的 `GenerateContent` 或 `StreamGenerateContent` 回應接續生成，該回應先前因 `finish_reason` 設為 `CONTINUATION` 而停止。請注意，在要求中提供接續 token 時，`contents` 為必填，且必須與初始要求的提示詞和對話記錄完全相同。

      **labels**: `object`

      選用。附有使用者自訂中繼資料的要求標籤。選用。標籤必須符合標準的統一 Cloud 標籤規定：

      - 標籤鍵必須以字母開頭。
      - 標籤鍵與值的長度不得超過 63 個字元（Unicode 碼位），且只能包含小寫字母、數字字元、底線與連字號。
      - 允許使用國際字元。

      用法：

      - 來自彙總器的安全識別碼：使用鍵 `safety_identifier`（例如 `{"safety_identifier": "user_session_123"}`）



  

  

  
  **範例要求**

  

=== "文字"


    === "REST"

          ```sh
          curl https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:countTokens?key=$GEMINI_API_KEY \
              -H 'Content-Type: application/json' \
              -X POST \
              -d '{
                "contents": [{
                  "parts":[{
                    "text": "The quick brown fox jumps over the lazy dog."
                    }],
                  }],
                }'
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          prompt = "The quick brown fox jumps over the lazy dog."

          # Count tokens using the new client method.
          total_tokens = client.models.count_tokens(
              model="gemini-3.8-flash", contents=prompt
          )
          print("total_tokens: ", total_tokens)
          # ( e.g., total_tokens: 10 )

          response = client.models.generate_content(
              model="gemini-3.8-flash", contents=prompt
          )

          # The usage_metadata provides detailed token counts.
          print(response.usage_metadata)
          # ( e.g., prompt_token_count: 11, candidates_token_count: 73, total_token_count: 84 )
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
          const prompt = 'The quick brown fox jumps over the lazy dog.';
          const countTokensResponse = await ai.models.countTokens({
            model: 'gemini-3.8-flash',
            contents: prompt,
          });
          console.log(countTokensResponse.totalTokens);

          const generateResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
          });
          console.log(generateResponse.usageMetadata);
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
          prompt := "The quick brown fox jumps over the lazy dog."

          // Convert prompt to a slice of *genai.Content using the helper.
          contents := []*genai.Content{
              genai.NewContentFromText(prompt, genai.RoleUser),
          }
          countResp, err := client.Models.CountTokens(ctx, "gemini-3.8-flash", contents, nil)
          if err != nil {
              return err
          }
          fmt.Println("total_tokens:", countResp.TotalTokens)

          response, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, nil)
          if err != nil {
              log.Fatal(err)
          }
          usageMetadata, err := json.MarshalIndent(response.UsageMetadata, "", "  ")
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(string(usageMetadata))
          ```

=== "聊天"


    === "REST"

          ```sh
          curl https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:countTokens?key=$GEMINI_API_KEY \
              -H 'Content-Type: application/json' \
              -X POST \
              -d '{
                "contents": [
                  {"role": "user",
                  "parts": [{"text": "Hi, my name is Bob."}],
                  },
                  {"role": "model",
                   "parts":[{"text": "Hi Bob"}],
                  },
                ],
                }'
          ```

    === "Python"

          ```python
          from google import genai
          from google.genai import types

          client = genai.Client()

          chat = client.chats.create(
              model="gemini-3.8-flash",
              history=[
                  types.Content(
                      role="user", parts=[types.Part(text="Hi my name is Bob")]
                  ),
                  types.Content(role="model", parts=[types.Part(text="Hi Bob!")]),
              ],
          )
          # Count tokens for the chat history.
          print(
              client.models.count_tokens(
                  model="gemini-3.8-flash", contents=chat.get_history()
              )
          )
          # ( e.g., total_tokens: 10 )

          response = chat.send_message(
              message=(
                  "In one sentence, explain how a computer works to a young child."
              )
          )
          print(response.usage_metadata)
          # ( e.g., prompt_token_count: 25, candidates_token_count: 21, total_token_count: 46 )

          # You can count tokens for the combined history and a new message.
          extra = types.UserContent(
              parts=[
                  types.Part(
                      text="What is the meaning of life?",
                  )
              ]
          )
          history = chat.get_history()
          history.append(extra)
          print(
              client.models.count_tokens(model="gemini-3.8-flash", contents=history)
          )
          # ( e.g., total_tokens: 56 )
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
          // Initial chat history.
          const history = [
            {role: 'user', parts: [{text: 'Hi my name is Bob'}]},
            {role: 'model', parts: [{text: 'Hi Bob!'}]},
          ];
          const chat = ai.chats.create({
            model: 'gemini-3.8-flash',
            history: history,
          });

          // Count tokens for the current chat history.
          const countTokensResponse = await ai.models.countTokens({
            model: 'gemini-3.8-flash',
            contents: chat.getHistory(),
          });
          console.log(countTokensResponse.totalTokens);

          const chatResponse = await chat.sendMessage({
            message: 'In one sentence, explain how a computer works to a young child.',
          });
          console.log(chatResponse.usageMetadata);

          // Add an extra user message to the history.
          const extraMessage = {
            role: 'user',
            parts: [{text: 'What is the meaning of life?'}],
          };
          const combinedHistory = chat.getHistory();
          combinedHistory.push(extraMessage);
          const combinedCountTokensResponse = await ai.models.countTokens({
            model: 'gemini-3.8-flash',
            contents: combinedHistory,
          });
          console.log(
              'Combined history token count:',
              combinedCountTokensResponse.totalTokens,
          );
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

          // Initialize chat with some history.
          history := []*genai.Content{
              {Role: genai.RoleUser, Parts: []*genai.Part{{Text: "Hi my name is Bob"}}},
              {Role: genai.RoleModel, Parts: []*genai.Part{{Text: "Hi Bob!"}}},
          }
          chat, err := client.Chats.Create(ctx, "gemini-3.8-flash", nil, history)
          if err != nil {
              log.Fatal(err)
          }

          firstTokenResp, err := client.Models.CountTokens(ctx, "gemini-3.8-flash", chat.History(false), nil)
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(firstTokenResp.TotalTokens)

          resp, err := chat.SendMessage(ctx, genai.Part{
              Text: "In one sentence, explain how a computer works to a young child."},
          )
          if err != nil {
              log.Fatal(err)
          }
          fmt.Printf("%#v\n", resp.UsageMetadata)

          // Append an extra user message and recount.
          extra := genai.NewContentFromText("What is the meaning of life?", genai.RoleUser)
          hist := chat.History(false)
          hist = append(hist, extra)

          secondTokenResp, err := client.Models.CountTokens(ctx, "gemini-3.8-flash", hist, nil)
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(secondTokenResp.TotalTokens)
          ```

=== "行內媒體"


    === "REST"

          ```sh
          curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:countTokens?key=$GEMINI_API_KEY" \
              -H 'Content-Type: application/json' \
              -X POST \
              -d '{
                "contents": [{
                  "parts":[
                      {"text": "Tell me about this instrument"},
                      {
                        "inline_data": {
                          "mime_type":"image/jpeg",
                          "data": "'$(base64 $B64FLAGS $IMG_PATH)'"
                        }
                      }
                  ]
                  }]
                 }' 2> /dev/null
          ```

    === "Python"

          ```python
          from google import genai
          import PIL.Image

          client = genai.Client()
          prompt = "Tell me about this image"
          your_image_file = PIL.Image.open(media / "organ.jpg")

          # Count tokens for combined text and inline image.
          print(
              client.models.count_tokens(
                  model="gemini-3.8-flash", contents=[prompt, your_image_file]
              )
          )
          # ( e.g., total_tokens: 263 )

          response = client.models.generate_content(
              model="gemini-3.8-flash", contents=[prompt, your_image_file]
          )
          print(response.usage_metadata)
          # ( e.g., prompt_token_count: 264, candidates_token_count: 80, total_token_count: 345 )
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
          const prompt = 'Tell me about this image';
          const imageBuffer = fs.readFileSync(path.join(media, 'organ.jpg'));

          // Convert buffer to base64 string.
          const imageBase64 = imageBuffer.toString('base64');

          // Build contents using createUserContent and createPartFromBase64.
          const contents = createUserContent([
            prompt,
            createPartFromBase64(imageBase64, 'image/jpeg'),
          ]);

          const countTokensResponse = await ai.models.countTokens({
            model: 'gemini-3.8-flash',
            contents: contents,
          });
          console.log(countTokensResponse.totalTokens);

          const generateResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: contents,
          });
          console.log(generateResponse.usageMetadata);
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

          state=$(jq ".file.state" file_info.json)

          name=$(jq ".file.name" file_info.json)

          while [[ "($state)" = *"PROCESSING"* ]];
          do
            echo "Processing video..."
            sleep 5
            # Get the file of interest to check state
            curl https://generativelanguage.googleapis.com/v1beta/files/$name > file_info.json
            state=$(jq ".file.state" file_info.json)
          done

          curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:countTokens?key=$GEMINI_API_KEY" \
              -H 'Content-Type: application/json' \
              -X POST \
              -d '{
                "contents": [{
                  "parts":[
                    {"text": "Describe this video clip"},
                    {"file_data":{"mime_type": "video/mp4", "file_uri": '$file_uri'}}]
                  }]
                 }'
          ```

    === "Python"

          ```python
          from google import genai
          import time

          client = genai.Client()
          prompt = "Tell me about this video"
          your_file = client.files.upload(file=media / "Big_Buck_Bunny.mp4")

          # Poll until the video file is completely processed (state becomes ACTIVE).
          while not your_file.state or your_file.state.name != "ACTIVE":
            print("Processing video...")
            print("File state:", your_file.state)
            time.sleep(5)
            your_file = client.files.get(name=your_file.name)

          print(
              client.models.count_tokens(
                  model="gemini-3.8-flash", contents=[prompt, your_file]
              )
          )
          # ( e.g., total_tokens: 300 )

          response = client.models.generate_content(
              model="gemini-3.8-flash", contents=[prompt, your_file]
          )
          print(response.usage_metadata)
          # ( e.g., prompt_token_count: 301, candidates_token_count: 60, total_token_count: 361 )
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
          const prompt = 'Tell me about this video';
          let videoFile = await ai.files.upload({
            file: path.join(media, 'Big_Buck_Bunny.mp4'),
            config: {mimeType: 'video/mp4'},
          });

          // Poll until the video file is completely processed (state becomes ACTIVE).
          while (!videoFile.state || videoFile.state.toString() !== 'ACTIVE') {
            console.log('Processing video...');
            console.log('File state: ', videoFile.state);
            await sleep(5000);
            videoFile = await ai.files.get({name: videoFile.name});
          }

          const countTokensResponse = await ai.models.countTokens({
            model: 'gemini-3.8-flash',
            contents: createUserContent([
              prompt,
              createPartFromUri(videoFile.uri, videoFile.mimeType),
            ]),
          });
          console.log(countTokensResponse.totalTokens);

          const generateResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: createUserContent([
              prompt,
              createPartFromUri(videoFile.uri, videoFile.mimeType),
            ]),
          });
          console.log(generateResponse.usageMetadata);
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

          file, err := client.Files.UploadFromPath(
              ctx,
              filepath.Join(getMedia(), "Big_Buck_Bunny.mp4"),
              &genai.UploadFileConfig{
                  MIMEType: "video/mp4",
              },
          )
          if err != nil {
              log.Fatal(err)
          }

          // Poll until the video file is completely processed (state becomes ACTIVE).
          for file.State == genai.FileStateUnspecified || file.State != genai.FileStateActive {
              fmt.Println("Processing video...")
              fmt.Println("File state:", file.State)
              time.Sleep(5 * time.Second)

              file, err = client.Files.Get(ctx, file.Name, nil)
              if err != nil {
                  log.Fatal(err)
              }
          }

          parts := []*genai.Part{
              genai.NewPartFromText("Tell me about this video"),
              genai.NewPartFromURI(file.URI, file.MIMEType),
          }
          contents := []*genai.Content{
              genai.NewContentFromParts(parts, genai.RoleUser),
          }

          tokenResp, err := client.Models.CountTokens(ctx, "gemini-3.8-flash", contents, nil)
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println("Multimodal video/audio token count:", tokenResp.TotalTokens)
          response, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, nil)
          if err != nil {
              log.Fatal(err)
          }
          usageMetadata, err := json.MarshalIndent(response.UsageMetadata, "", "  ")
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(string(usageMetadata))
          ```

=== "Pdf"


    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          sample_pdf = client.files.upload(file=media / "test.pdf")
          token_count = client.models.count_tokens(
              model="gemini-3.8-flash",
              contents=["Give me a summary of this document.", sample_pdf],
          )
          print(f"{token_count=}")

          response = client.models.generate_content(
              model="gemini-3.8-flash",
              contents=["Give me a summary of this document.", sample_pdf],
          )
          print(response.usage_metadata)
          ```

=== "快取"


    === "Python"

          ```python
          from google import genai
          from google.genai import types
          import time

          client = genai.Client(http_options={"api_version": "v1beta"})
          your_file = client.files.upload(file=media / "a11.txt")

          cache = client.caches.create(
              model="gemini-3.8-flash",
              config={
                  "contents": ["Here the Apollo 11 transcript:", your_file],
                  "system_instruction": None,
                  "tools": None,
              },
          )

          # Create a prompt.
          prompt = "Please give a short summary of this file."

          # Count tokens for the prompt (the cached content is not passed here).
          print(client.models.count_tokens(model="gemini-3.8-flash", contents=prompt))
          # ( e.g., total_tokens: 9 )

          response = client.models.generate_content(
              model="gemini-3.8-flash",
              contents=prompt,
              config=types.GenerateContentConfig(
                  cached_content=cache.name,
              ),
          )
          print(response.usage_metadata)
          # ( e.g., prompt_token_count: ..., cached_content_token_count: ..., candidates_token_count: ... )
          client.caches.delete(name=cache.name)
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            apiVersion: 'v1beta',
          });
          const textFile = await ai.files.upload({
            file: path.join(media, 'a11.txt'),
            config: {mimeType: 'text/plain'},
          });

          const cache = await ai.caches.create({
            model: 'gemini-3.8-flash',
            config: {
              contents: createUserContent([
                'Here the Apollo 11 transcript:',
                createPartFromUri(textFile.uri, textFile.mimeType),
              ]),
              system_instruction: null,
              tools: null,
            },
          });

          const prompt = 'Please give a short summary of this file.';
          const countTokensResponse = await ai.models.countTokens({
            model: 'gemini-3.8-flash',
            contents: prompt,
          });
          console.log(countTokensResponse.totalTokens);

          const generateResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {cachedContent: cache.name},
          });
          console.log(generateResponse.usageMetadata);

          await ai.caches.delete({name: cache.name});
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

          file, err := client.Files.UploadFromPath(
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
              genai.NewPartFromText("Here the Apollo 11 transcript:"),
              genai.NewPartFromURI(file.URI, file.MIMEType),
          }
          contents := []*genai.Content{
              genai.NewContentFromParts(parts, genai.RoleUser),
          }

          // Create cached content using a simple slice with text and a file.
          cache, err := client.Caches.Create(ctx, "gemini-3.8-flash", &genai.CreateCachedContentConfig{
              Contents: contents,
          })
          if err != nil {
              log.Fatal(err)
          }

          prompt := "Please give a short summary of this file."
          countResp, err := client.Models.CountTokens(ctx, "gemini-3.8-flash", []*genai.Content{
              genai.NewContentFromText(prompt, genai.RoleUser),
          }, nil)
          if err != nil {
              log.Fatal(err)
          }
          fmt.Printf("%d", countResp.TotalTokens)
          response, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", []*genai.Content{
              genai.NewContentFromText(prompt, genai.RoleUser),
          }, &genai.GenerateContentConfig{
              CachedContent: cache.Name,
          })
          if err != nil {
              log.Fatal(err)
          }

          usageMetadata, err := json.MarshalIndent(response.UsageMetadata, "", "  ")
          if err != nil {
              log.Fatal(err)
          }
          // Returns `nil` for some reason
          fmt.Println(string(usageMetadata))
          _, err = client.Caches.Delete(ctx, cache.Name, &genai.DeleteCachedContentConfig{})
          ```

=== "系統指令"


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

          // Construct the user message contents.
          contents := []*genai.Content{
              genai.NewContentFromText("Good morning! How are you?", genai.RoleUser),
          }

          // Set the system instruction as a *genai.Content.
          config := &genai.GenerateContentConfig{
              SystemInstruction: genai.NewContentFromText("You are a cat. Your name is Neko.", genai.RoleUser),
          }

          response, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, config)
          if err != nil {
              log.Fatal(err)
          }
          printResponse(response)
          ```


  


## 回應 {#response}


  **totalTokens**: `integer`

  `Model` 將 `prompt` Tokenizer 後的 token 數量。永遠為非負數。

  

---


  **cachedContentTokenCount**: `integer`

  提示詞中已快取部分（快取內容）的 token 數量。

  

---


  

??? note "**promptTokensDetails**: `ModalityTokenCount array` 僅供輸出。要求輸入中處理的模態清單。"

    ??? note "**modality**: `GenerativeLanguageModality` 與此 token 數量相關聯的模態。"

        可能的值：

        - `MODALITY_UNSPECIFIED`: 未指定的模態。
        - `TEXT`: 純文字。
        - `IMAGE`: 圖片。
        - `VIDEO`: 影片。
        - `AUDIO`: 音訊。
        - `DOCUMENT`: 文件，例如 PDF。



      **tokenCount**: `integer`

      token 數量。



  

---


  

??? note "**cacheTokensDetails**: `ModalityTokenCount array` 僅供輸出。快取內容中處理的模態清單。"

    ??? note "**modality**: `GenerativeLanguageModality` 與此 token 數量相關聯的模態。"

        可能的值：

        - `MODALITY_UNSPECIFIED`: 未指定的模態。
        - `TEXT`: 純文字。
        - `IMAGE`: 圖片。
        - `VIDEO`: 影片。
        - `AUDIO`: 音訊。
        - `DOCUMENT`: 文件，例如 PDF。



      **tokenCount**: `integer`

      token 數量。


