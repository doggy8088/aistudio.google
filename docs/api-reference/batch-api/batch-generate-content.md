# 建立內容生成批次

`POST` `https://generativelanguage.googleapis.com/v1beta/models/{model}:batchGenerateContent`

將一批 `GenerateContent` 請求排入佇列，進行批次處理。


  
## 參數 {#parameters}

  
  **model**: required `string`

  模型 ID，例如 `gemini-2.5-flash`。組成資源名稱 `models/{model}`。

  

## 請求主體 {#request-body}

  
  **batch**: required [`GenerateContentBatch`](/api-reference/batch-api/batch-generate-content/#Resource:GenerateContentBatch)

  要建立的批次。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/$MODEL_ID:batchGenerateContent" \
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

  
  

??? note "**error**: `Status` 操作失敗或取消時的錯誤結果。"

    **code**: `integer`

    狀態碼，應為 google.rpc.Code 的列舉值。

    **message**: `string`

    面向開發人員的錯誤訊息，應以英文撰寫。任何面向使用者的錯誤訊息都應本地化，並透過 google.rpc.Status.details 欄位傳送，或由用戶端本地化。

    **details**: `object array`

    承載錯誤詳細資訊的訊息清單。API 可使用一組常見的訊息類型。



  

---


  

??? note "**response**: `BatchGenerateContentResponse`"

    ??? note "**output**: `GenerateContentBatchOutput` 僅供輸出。批次請求的輸出。"

        ??? note "**output**: `Union type` 批次請求的輸出。"

              聯合欄位 `output` 只能是下列其中之一：

              **responsesFile**: `string`

              僅供輸出。包含回應之檔案的檔案 ID。該檔案為 JSONL 檔案，每行一個回應。回應將是 JSON 格式的 `GenerateContentResponse` 訊息。回應的寫入順序與輸入請求相同。



            ??? note "**inlinedResponses**: `InlinedResponses` 僅供輸出。批次中各請求的回應。當批次以內嵌請求建立時回傳。回應順序與輸入請求相同。"

                ??? note "**inlinedResponses**: `InlinedResponse array` 僅供輸出。批次中各請求的回應。"

                    ??? note "**output**: `Union type` 請求的輸出。"

                          聯合欄位 `output` 只能是下列其中之一：



                        ??? note "**error**: `Status` 僅供輸出。處理請求時遇到的錯誤。"

                            **code**: `integer`

                            狀態碼，應為 google.rpc.Code 的列舉值。

                            **message**: `string`

                            面向開發人員的錯誤訊息，應以英文撰寫。任何面向使用者的錯誤訊息都應本地化，並透過 google.rpc.Status.details 欄位傳送，或由用戶端本地化。

                            **details**: `object array`

                            承載錯誤詳細資訊的訊息清單。API 可使用一組常見的訊息類型。





                        ??? note "**response**: `GenerateContentResponse` 僅供輸出。請求的回應。"

                            ??? note "**candidates**: `Candidate array` 模型提供的候選回應。"

                                  **index**: `integer`

                                  僅供輸出。候選項目在回應候選清單中的索引。



                                ??? note "**content**: `Content` 僅供輸出。模型回傳的生成內容。"

                                    ??? note "**parts**: `Part array` 組成單一訊息的有序 `Parts`。各 Part 的 MIME 類型可能不同。"

                                        ??? note "**data**: `Union type`"

                                              聯合欄位 `data` 只能是下列其中之一：

                                              **text**: `string`

                                              內嵌文字。



                                            ??? note "**inlineData**: `Blob` 內嵌媒體位元組。"

                                                **mimeType**: `string`

                                                來源資料的 IANA 標準 MIME 類型。支援的類型範例：

                                                - 圖片：image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
                                                - 音訊：audio/*, video/audio/s16le, video/audio/wav
                                                - 影片：video/*
                                                - 文字：text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
                                                - 應用程式：application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf 其他背景資訊請參閱 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                                **data**: `string`

                                                媒體格式的原始位元組。

                                                **displayName**: `string`

                                                選用。指定用來向模型指稱此 blob 的名稱（例如 "my_blob.png"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 參照識別符使用。





                                            ??? note "**functionCall**: `FunctionCall` 模型回傳的預測 `FunctionCall`，其中包含一個表示 `FunctionDeclaration.name` 的字串，以及其引數與值。"

                                                **name**: required `string`

                                                要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                                                **id**: `string`

                                                選用。函式呼叫的唯一識別符。若有填入，用戶端會執行 `function_call`，並回傳 `id` 相符的回應。

                                                **args**: `object`

                                                選用。函式參數與值，採 JSON 物件格式。





                                            ??? note "**functionResponse**: `FunctionResponse` `FunctionCall` 的結果輸出，其中包含一個表示 `FunctionDeclaration.name` 的字串，以及一個包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。"

                                                  **name**: required `string`

                                                  要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                                                  **response**: required `object`

                                                  函式回應，採 JSON 物件格式。呼叫端可使用任何符合函式語法的鍵來回傳函式輸出，例如 "output"、"result" 等。特別是當函式呼叫執行失敗時，回應可包含 "error" 鍵，將錯誤詳細資訊回傳給模型。多媒體內容可透過子物件納入，該子物件包含單一 "$ref" 鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，即持有該多媒體之 `FunctionResponsePart` 的對應名稱。請參閱 [多模態函式回應](/docs/function-calling/#multimodal)。

                                                  **id**: `string`

                                                  選用。此回應所對應函式呼叫的識別符。由用戶端填入，以對應相對應的函式呼叫 `id`。



                                                ??? note "**parts**: `FunctionResponsePart array` 選用。組成函式回應的有序 `Parts`。各 Part 的 IANA MIME 類型可能不同。"

                                                    ??? note "**data**: `Union type` 函式回應部分的資料。"

                                                          聯合欄位 `data` 只能是下列其中之一：



                                                        ??? note "**inlineData**: `FunctionResponseBlob` 內嵌媒體位元組。"

                                                            **mimeType**: `string`

                                                            來源資料的 IANA 標準 MIME 類型。範例：

                                                            - image/png
                                                            - image/jpeg

                                                            若提供不支援的 MIME 類型，將回傳錯誤。完整支援類型清單請參閱 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                                            **data**: `string`

                                                            媒體格式的原始位元組。

                                                            **displayName**: `string`

                                                            選用。blob 的顯示名稱。用來提供標籤或檔名以區分各 blob，並可從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                                        ??? note "**fileData**: `FunctionResponseFileData` 以 URI 為基礎的資料。"

                                                            **fileUri**: required `string`

                                                            URI。

                                                            **mimeType**: `string`

                                                            來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將回傳錯誤。完整支援類型清單請參閱 [多模態函式回應](/docs/function-calling/#multimodal) 與 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                                            **displayName**: `string`

                                                            選用。檔案的顯示名稱。用來提供標籤或檔名以區分檔案資料，並可從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                                    ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以進行理解。僅對影片部分有意義（`inline_data` 或具影片 mime 類型的 `file_data`）。非影片部分會忽略此欄位。"

                                                        可能的值：

                                                        - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
                                                        - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
                                                        - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。



                                                  **willContinue**: `boolean`

                                                  選用。表示函式呼叫將繼續，且會回傳更多回應，使函式呼叫成為產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，後續回應將不予考慮。允許回傳空的 `response` 並搭配 `will_continue=False`，以表示函式呼叫已完成。這仍可能觸發模型生成。若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。



                                                ??? note "**scheduling**: `string enum` 選用。指定回應在對話中應如何排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。"

                                                    可能的值：

                                                    - `SCHEDULING_UNSPECIFIED`：此值未使用。
                                                    - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發生成。
                                                    - `WHEN_IDLE`：將結果加入對話上下文，並提示生成輸出，但不中斷進行中的生成。
                                                    - `INTERRUPT`：將結果加入對話上下文，中斷進行中的生成，並提示生成輸出。





                                            ??? note "**fileData**: `FileData` 以 URI 為基礎的資料。"

                                                **fileUri**: required `string`

                                                URI。

                                                **mimeType**: `string`

                                                選用。來源資料的 IANA 標準 MIME 類型。

                                                **displayName**: `string`

                                                選用。指定用來向模型指稱此檔案的名稱（例如 "my_file.pdf"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案參照識別符使用。





                                            ??? note "**executableCode**: `ExecutableCode` 模型生成的程式碼，預期將被執行。"

                                                ??? note "**language**: required `string enum` `code` 的程式語言。"

                                                    可能的值：

                                                    - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用此值。
                                                    - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 為預設語言。



                                                  **code**: required `string`

                                                  要執行的程式碼。

                                                  **id**: `string`

                                                  選用。`ExecutableCode` 部分的唯一識別符。伺服器會回傳 `CodeExecutionResult`，其 `id` 與之相符。





                                            ??? note "**codeExecutionResult**: `CodeExecutionResult` 執行 `ExecutableCode` 的結果。"

                                                ??? note "**outcome**: required `string enum` 程式碼執行的結果狀態。"

                                                    可能的值：

                                                    - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用此值。
                                                    - `OUTCOME_OK`：程式碼執行成功完成。若有 stdout，`output` 包含其內容。
                                                    - `OUTCOME_FAILED`：程式碼執行失敗。若有 stderr 與 stdout，`output` 包含其內容。
                                                    - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已被取消。`output` 可能有、也可能沒有部分內容。



                                                  **id**: `string`

                                                  選用。此結果所對應 `ExecutableCode` 部分的識別符。僅在對應的 `ExecutableCode` 具有 id 時才填入。

                                                  **output**: `string`

                                                  選用。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。





                                            ??? note "**toolCall**: `ToolCall` 伺服器端工具呼叫。當模型預測應在伺服器上執行的工具叫用時，會填入此欄位。用戶端應將此訊息原樣回傳給 API。"

                                                ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型。"

                                                    可能的值：

                                                    - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                                    - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                                    - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                                    - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                                    - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                                    - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                                    - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                                  **id**: `string`

                                                  選用。工具呼叫的唯一識別符。伺服器會回傳帶有相符 `id` 的工具回應。

                                                  **toolName**: `string`

                                                  選用。被呼叫的工具名稱。

                                                  **args**: `object`

                                                  選用。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





                                            ??? note "**toolResponse**: `ToolResponse` 伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端填入執行對應 `ToolCall` 的結果。"

                                                ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型，與對應的 `tool_type`（位於對應的 `ToolCall` 中）相符。"

                                                    可能的值：

                                                    - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                                    - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                                    - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                                    - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                                    - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                                    - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                                    - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                                  **id**: `string`

                                                  選用。此回應所對應工具呼叫的識別符。

                                                  **response**: `object`

                                                  選用。工具回應。





                                        ??? note "**metadata**: `Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定此項，以設定每個部分的靜態媒體預處理。"

                                              聯合欄位 `metadata` 只能是下列其中之一：



                                            ??? note "**videoMetadata**: `VideoMetadata` 選用。影片中繼資料。中繼資料僅應在影片資料以 inline_data 或 file_data 呈現時指定。"

                                                **startOffset**: `string`

                                                選用。影片的開始偏移。

                                                **endOffset**: `string`

                                                選用。影片的結束偏移。

                                                **fps**: `number`

                                                選用。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。



                                          **thought**: `boolean`

                                          選用。表示該部分是否為模型的思考內容。

                                          **thoughtSignature**: `string`

                                          選用。思考內容的不透明簽章，以便在後續請求中重複使用。

                                          **partMetadata**: `object`

                                          與 Part 關聯的自訂中繼資料。使用 genai.Part 作為內容表示法的代理，可能需要追蹤額外資訊。例如，它可以是 Part 來源檔案或出處的名稱，或是多工處理多個 Part 串流的方式。



                                        ??? note "**mediaResolution**: `V1mainMediaResolution` 選用。輸入媒體的媒體解析度。"

                                            ??? note "**value**: `Union type` 媒體解析度等級。"

                                                  聯合欄位 `value` 只能是下列其中之一：



                                                ??? note "**level**: `string enum` 給定媒體所使用的權杖化品質。供 Gemini API 支援使用。"

                                                    可能的值：

                                                    - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                                                    - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低。
                                                    - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中。
                                                    - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高。
                                                    - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設為超高。





                                        ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以進行理解。僅對影片部分有意義（`inline_data` 或具影片 mime 類型的 `file_data`）。非影片部分會忽略此欄位。"

                                            可能的值：

                                            - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
                                            - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
                                            - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。





                                        ??? note "**audioTranscription**: `AudioTranscription` 選用。音訊（輸入或輸出）轉錄。僅在此 Part 包含音訊資料時設定。"

                                              **text**: required `string`

                                              此音訊片段的轉錄文字。

                                              **speakerLabel**: `string`

                                              選用。標示此音訊片段說話者的標籤（例如 "spk_1"、"spk_2"）。在設定語者分離時出現。



                                            ??? note "**words**: `WordInfo array` 選用。詳細的單字級轉錄與時間資訊。在設定 word_timestamp 時出現。"

                                                **word**: required `string`

                                                單字的轉錄內容。

                                                **startOffset**: `string`

                                                選用。單字相對於音訊開頭的開始時間偏移。

                                                **endOffset**: `string`

                                                選用。單字相對於音訊開頭的結束時間偏移。





                                        ??? note "**speechMetadata**: `SpeechMetadata` 選用。套用於文字部分的中繼資料，用來客製化其朗讀或合成方式，例如指定說話者身分或說話風格。"

                                            **speaker**: `string`

                                            選用。選填的說話者名稱，用於多說話者合成。

                                            **style**: `string`

                                            選用。選填的風格指令，用於語音合成。



                                      **role**: `string`

                                      選用。內容的產生者。必須為 'user' 或 'model'。在多輪對話中設定很有用，其他情況可留空或不設定。





                                ??? note "**finishReason**: `string enum` 選用。僅供輸出。模型停止生成權杖的原因。若為空，表示模型尚未停止生成權杖。"

                                    可能的值：

                                    - `FINISH_REASON_UNSPECIFIED`：預設值。此值未使用。
                                    - `STOP`：模型的自然停止點，或所提供的停止序列。
                                    - `MAX_TOKENS`：已達請求中指定的權杖數量上限。
                                    - `SAFETY`：回應候選內容因安全因素被標記。
                                    - `RECITATION`：回應候選內容因引述因素被標記。
                                    - `LANGUAGE`：回應候選內容因使用不支援的語言被標記。
                                    - `OTHER`：未知原因。
                                    - `BLOCKLIST`：權杖生成因內容包含禁用詞彙而停止。
                                    - `PROHIBITED_CONTENT`：權杖生成因可能包含禁止內容而停止。
                                    - `SPII`：權杖生成因內容可能包含敏感個人識別資訊（SPII）而停止。
                                    - `MALFORMED_FUNCTION_CALL`：模型生成的函式呼叫無效。
                                    - `IMAGE_SAFETY`：權杖生成因生成的圖片包含安全違規而停止。
                                    - `IMAGE_PROHIBITED_CONTENT`：圖片生成因生成的圖片含有其他禁止內容而停止。
                                    - `IMAGE_OTHER`：圖片生成因其他雜項問題而停止。
                                    - `NO_IMAGE`：模型預期會生成圖片，但未生成任何圖片。
                                    - `IMAGE_RECITATION`：圖片生成因引述而停止。
                                    - `UNEXPECTED_TOOL_CALL`：模型生成了工具呼叫，但請求中未啟用任何工具。
                                    - `TOO_MANY_TOOL_CALLS`：模型連續呼叫過多工具，系統因此退出執行。
                                    - `MISSING_THOUGHT_SIGNATURE`：請求至少缺少一個思考簽章。
                                    - `MALFORMED_RESPONSE`：因回應格式錯誤而結束。
                                    - `ESCALATION`：請求被升級規則篩除。
                                    - `PUP_LIMITED_DISABLED`：表示權杖生成因使用者帳號違反禁止使用政策（PUP）而受限或停用，因而停止。
                                    - `CONTINUATION`：權杖生成因回應已達單次請求的權杖上限而停止，但生成尚未完成。可透過後續請求使用回傳的 `continuation_token` 繼續模型回應。請注意，`max_output_tokens` 在多次接續跳轉之間為累計值，必須單調遞增或省略。



                                  **finishMessage**: `string`

                                  選用。僅供輸出。詳細說明模型停止生成權杖的原因。僅在 `finish_reason` 已設定時填入。



                                ??? note "**safetyRatings**: `SafetyRating array` 回應候選的安全性評等清單。每個類別最多有一個評等。"

                                    ??? note "**category**: required `HarmCategory` 此評等的類別。"

                                        可能的值：

                                        - `HARM_CATEGORY_UNSPECIFIED`：未指定類別。
                                        - `HARM_CATEGORY_HARASSMENT`：**Gemini** - 騷擾內容。
                                        - `HARM_CATEGORY_HATE_SPEECH`：**Gemini** - 仇恨言論及內容。
                                        - `HARM_CATEGORY_SEXUALLY_EXPLICIT`：**Gemini** - 性露骨內容。
                                        - `HARM_CATEGORY_DANGEROUS_CONTENT`：**Gemini** - 危險內容。
                                        - `HARM_CATEGORY_JAILBREAK`：**Gemini** - 試圖繞過或顛覆模型安全準則的提示詞（越獄嘗試）。





                                    ??? note "**probability**: required `string enum` 此內容造成危害的機率。"

                                        可能的值：

                                        - `HARM_PROBABILITY_UNSPECIFIED`：未指定機率。
                                        - `NEGLIGIBLE`：內容不安全的可能性微乎其微。
                                        - `LOW`：內容不安全的可能性低。
                                        - `MEDIUM`：內容不安全的可能性中等。
                                        - `HIGH`：內容不安全的可能性高。



                                      **blocked**: `boolean`

                                      此內容是否因這項評等而被封鎖？





                                ??? note "**citationMetadata**: `CitationMetadata` 僅供輸出。模型生成候選的引註資訊。此欄位可能填入 `content` 中任何文字的引述資訊。這些是從基礎 LLM 訓練資料中的受版權保護素材「引述」的段落。"

                                    ??? note "**citationSources**: `CitationSource array` 特定回應的來源引註。"

                                        **startIndex**: `integer`

                                        選用。歸因於此來源之回應片段的起始位置。索引表示片段的起點，以位元組計。

                                        **endIndex**: `integer`

                                        選用。歸因片段的結束位置，不含該位置。

                                        **uri**: `string`

                                        選用。被歸因為某段文字來源的 URI。

                                        **license**: `string`

                                        選用。被歸因為片段來源之 GitHub 專案的授權。程式碼引註必須提供授權資訊。



                                  **tokenCount**: `integer`

                                  僅供輸出。此候選的權杖數量。



                                ??? note "**groundingAttributions**: `GroundingAttribution array` 僅供輸出。有助於形成接地答案之來源的歸因資訊。此欄位在 `GenerateAnswer` 呼叫時填入。"

                                    ??? note "**sourceId**: `AttributionSourceId` 僅供輸出。有助於此歸因之來源的識別符。"

                                        ??? note "**source**: `Union type`"

                                              聯合欄位 `source` 只能是下列其中之一：



                                            ??? note "**groundingPassage**: `GroundingPassageId` 內嵌段落的識別符。"

                                                **passageId**: `string`

                                                僅供輸出。與 `GenerateAnswerRequest` 的 `GroundingPassage.id` 相符的段落 ID。

                                                **partIndex**: `integer`

                                                僅供輸出。該部分在 `GenerateAnswerRequest` 的 `GroundingPassage.content` 中的索引。





                                            ??? note "**semanticRetrieverChunk**: `SemanticRetrieverChunk` 透過 Semantic Retriever 擷取之 `Chunk` 的識別符。"

                                                **source**: `string`

                                                僅供輸出。與請求的 `SemanticRetrieverConfig.source` 相符的來源名稱。範例：`corpora/123` 或 `corpora/123/documents/abc`

                                                **chunk**: `string`

                                                僅供輸出。包含歸因文字之 `Chunk` 的名稱。範例：`corpora/123/documents/abc/chunks/xyz`





                                    ??? note "**content**: `Content` 組成此歸因的接地來源內容。"

                                        ??? note "**parts**: `Part array` 組成單一訊息的有序 `Parts`。各 Part 的 MIME 類型可能不同。"

                                            ??? note "**data**: `Union type`"

                                                  聯合欄位 `data` 只能是下列其中之一：

                                                  **text**: `string`

                                                  內嵌文字。



                                                ??? note "**inlineData**: `Blob` 內嵌媒體位元組。"

                                                    **mimeType**: `string`

                                                    來源資料的 IANA 標準 MIME 類型。支援的類型範例：

                                                    - 圖片：image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
                                                    - 音訊：audio/*, video/audio/s16le, video/audio/wav
                                                    - 影片：video/*
                                                    - 文字：text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
                                                    - 應用程式：application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf 其他背景資訊請參閱 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                                    **data**: `string`

                                                    媒體格式的原始位元組。

                                                    **displayName**: `string`

                                                    選用。指定用來向模型指稱此 blob 的名稱（例如 "my_blob.png"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 參照識別符使用。





                                                ??? note "**functionCall**: `FunctionCall` 模型回傳的預測 `FunctionCall`，其中包含一個表示 `FunctionDeclaration.name` 的字串，以及其引數與值。"

                                                    **name**: required `string`

                                                    要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                                                    **id**: `string`

                                                    選用。函式呼叫的唯一識別符。若有填入，用戶端會執行 `function_call`，並回傳 `id` 相符的回應。

                                                    **args**: `object`

                                                    選用。函式參數與值，採 JSON 物件格式。





                                                ??? note "**functionResponse**: `FunctionResponse` `FunctionCall` 的結果輸出，其中包含一個表示 `FunctionDeclaration.name` 的字串，以及一個包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。"

                                                      **name**: required `string`

                                                      要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                                                      **response**: required `object`

                                                      函式回應，採 JSON 物件格式。呼叫端可使用任何符合函式語法的鍵來回傳函式輸出，例如 "output"、"result" 等。特別是當函式呼叫執行失敗時，回應可包含 "error" 鍵，將錯誤詳細資訊回傳給模型。多媒體內容可透過子物件納入，該子物件包含單一 "$ref" 鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，即持有該多媒體之 `FunctionResponsePart` 的對應名稱。請參閱 [多模態函式回應](/docs/function-calling/#multimodal)。

                                                      **id**: `string`

                                                      選用。此回應所對應函式呼叫的識別符。由用戶端填入，以對應相對應的函式呼叫 `id`。



                                                    ??? note "**parts**: `FunctionResponsePart array` 選用。組成函式回應的有序 `Parts`。各 Part 的 IANA MIME 類型可能不同。"

                                                        ??? note "**data**: `Union type` 函式回應部分的資料。"

                                                              聯合欄位 `data` 只能是下列其中之一：



                                                            ??? note "**inlineData**: `FunctionResponseBlob` 內嵌媒體位元組。"

                                                                **mimeType**: `string`

                                                                來源資料的 IANA 標準 MIME 類型。範例：

                                                                - image/png
                                                                - image/jpeg

                                                                若提供不支援的 MIME 類型，將回傳錯誤。完整支援類型清單請參閱 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                                                **data**: `string`

                                                                媒體格式的原始位元組。

                                                                **displayName**: `string`

                                                                選用。blob 的顯示名稱。用來提供標籤或檔名以區分各 blob，並可從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                                            ??? note "**fileData**: `FunctionResponseFileData` 以 URI 為基礎的資料。"

                                                                **fileUri**: required `string`

                                                                URI。

                                                                **mimeType**: `string`

                                                                來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將回傳錯誤。完整支援類型清單請參閱 [多模態函式回應](/docs/function-calling/#multimodal) 與 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                                                **displayName**: `string`

                                                                選用。檔案的顯示名稱。用來提供標籤或檔名以區分檔案資料，並可從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                                        ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以進行理解。僅對影片部分有意義（`inline_data` 或具影片 mime 類型的 `file_data`）。非影片部分會忽略此欄位。"

                                                            可能的值：

                                                            - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
                                                            - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
                                                            - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。



                                                      **willContinue**: `boolean`

                                                      選用。表示函式呼叫將繼續，且會回傳更多回應，使函式呼叫成為產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，後續回應將不予考慮。允許回傳空的 `response` 並搭配 `will_continue=False`，以表示函式呼叫已完成。這仍可能觸發模型生成。若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。



                                                    ??? note "**scheduling**: `string enum` 選用。指定回應在對話中應如何排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。"

                                                        可能的值：

                                                        - `SCHEDULING_UNSPECIFIED`：此值未使用。
                                                        - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發生成。
                                                        - `WHEN_IDLE`：將結果加入對話上下文，並提示生成輸出，但不中斷進行中的生成。
                                                        - `INTERRUPT`：將結果加入對話上下文，中斷進行中的生成，並提示生成輸出。





                                                ??? note "**fileData**: `FileData` 以 URI 為基礎的資料。"

                                                    **fileUri**: required `string`

                                                    URI。

                                                    **mimeType**: `string`

                                                    選用。來源資料的 IANA 標準 MIME 類型。

                                                    **displayName**: `string`

                                                    選用。指定用來向模型指稱此檔案的名稱（例如 "my_file.pdf"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案參照識別符使用。





                                                ??? note "**executableCode**: `ExecutableCode` 模型生成的程式碼，預期將被執行。"

                                                    ??? note "**language**: required `string enum` `code` 的程式語言。"

                                                        可能的值：

                                                        - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用此值。
                                                        - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 為預設語言。



                                                      **code**: required `string`

                                                      要執行的程式碼。

                                                      **id**: `string`

                                                      選用。`ExecutableCode` 部分的唯一識別符。伺服器會回傳 `CodeExecutionResult`，其 `id` 與之相符。





                                                ??? note "**codeExecutionResult**: `CodeExecutionResult` 執行 `ExecutableCode` 的結果。"

                                                    ??? note "**outcome**: required `string enum` 程式碼執行的結果狀態。"

                                                        可能的值：

                                                        - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用此值。
                                                        - `OUTCOME_OK`：程式碼執行成功完成。若有 stdout，`output` 包含其內容。
                                                        - `OUTCOME_FAILED`：程式碼執行失敗。若有 stderr 與 stdout，`output` 包含其內容。
                                                        - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已被取消。`output` 可能有、也可能沒有部分內容。



                                                      **id**: `string`

                                                      選用。此結果所對應 `ExecutableCode` 部分的識別符。僅在對應的 `ExecutableCode` 具有 id 時才填入。

                                                      **output**: `string`

                                                      選用。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。





                                                ??? note "**toolCall**: `ToolCall` 伺服器端工具呼叫。當模型預測應在伺服器上執行的工具叫用時，會填入此欄位。用戶端應將此訊息原樣回傳給 API。"

                                                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型。"

                                                        可能的值：

                                                        - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                                        - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                                        - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                                        - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                                        - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                                        - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                                        - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                                      **id**: `string`

                                                      選用。工具呼叫的唯一識別符。伺服器會回傳帶有相符 `id` 的工具回應。

                                                      **toolName**: `string`

                                                      選用。被呼叫的工具名稱。

                                                      **args**: `object`

                                                      選用。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





                                                ??? note "**toolResponse**: `ToolResponse` 伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端填入執行對應 `ToolCall` 的結果。"

                                                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型，與對應的 `tool_type`（位於對應的 `ToolCall` 中）相符。"

                                                        可能的值：

                                                        - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                                        - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                                        - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                                        - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                                        - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                                        - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                                        - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                                      **id**: `string`

                                                      選用。此回應所對應工具呼叫的識別符。

                                                      **response**: `object`

                                                      選用。工具回應。





                                            ??? note "**metadata**: `Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定此項，以設定每個部分的靜態媒體預處理。"

                                                  聯合欄位 `metadata` 只能是下列其中之一：



                                                ??? note "**videoMetadata**: `VideoMetadata` 選用。影片中繼資料。中繼資料僅應在影片資料以 inline_data 或 file_data 呈現時指定。"

                                                    **startOffset**: `string`

                                                    選用。影片的開始偏移。

                                                    **endOffset**: `string`

                                                    選用。影片的結束偏移。

                                                    **fps**: `number`

                                                    選用。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。



                                              **thought**: `boolean`

                                              選用。表示該部分是否為模型的思考內容。

                                              **thoughtSignature**: `string`

                                              選用。思考內容的不透明簽章，以便在後續請求中重複使用。

                                              **partMetadata**: `object`

                                              與 Part 關聯的自訂中繼資料。使用 genai.Part 作為內容表示法的代理，可能需要追蹤額外資訊。例如，它可以是 Part 來源檔案或出處的名稱，或是多工處理多個 Part 串流的方式。



                                            ??? note "**mediaResolution**: `V1mainMediaResolution` 選用。輸入媒體的媒體解析度。"

                                                ??? note "**value**: `Union type` 媒體解析度等級。"

                                                      聯合欄位 `value` 只能是下列其中之一：



                                                    ??? note "**level**: `string enum` 給定媒體所使用的權杖化品質。供 Gemini API 支援使用。"

                                                        可能的值：

                                                        - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                                                        - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低。
                                                        - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中。
                                                        - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高。
                                                        - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設為超高。





                                            ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以進行理解。僅對影片部分有意義（`inline_data` 或具影片 mime 類型的 `file_data`）。非影片部分會忽略此欄位。"

                                                可能的值：

                                                - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
                                                - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
                                                - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。





                                            ??? note "**audioTranscription**: `AudioTranscription` 選用。音訊（輸入或輸出）轉錄。僅在此 Part 包含音訊資料時設定。"

                                                  **text**: required `string`

                                                  此音訊片段的轉錄文字。

                                                  **speakerLabel**: `string`

                                                  選用。標示此音訊片段說話者的標籤（例如 "spk_1"、"spk_2"）。在設定語者分離時出現。



                                                ??? note "**words**: `WordInfo array` 選用。詳細的單字級轉錄與時間資訊。在設定 word_timestamp 時出現。"

                                                    **word**: required `string`

                                                    單字的轉錄內容。

                                                    **startOffset**: `string`

                                                    選用。單字相對於音訊開頭的開始時間偏移。

                                                    **endOffset**: `string`

                                                    選用。單字相對於音訊開頭的結束時間偏移。





                                            ??? note "**speechMetadata**: `SpeechMetadata` 選用。套用於文字部分的中繼資料，用來客製化其朗讀或合成方式，例如指定說話者身分或說話風格。"

                                                **speaker**: `string`

                                                選用。選填的說話者名稱，用於多說話者合成。

                                                **style**: `string`

                                                選用。選填的風格指令，用於語音合成。



                                          **role**: `string`

                                          選用。內容的產生者。必須為 'user' 或 'model'。在多輪對話中設定很有用，其他情況可留空或不設定。





                                ??? note "**groundingMetadata**: `GroundingMetadata` 僅供輸出。候選的接地中繼資料。此欄位在 `GenerateContent` 呼叫時填入。"

                                    ??? note "**searchEntryPoint**: `SearchEntryPoint` 選用。供後續網路搜尋使用的 Google 搜尋條目。"

                                        **renderedContent**: `string`

                                        選用。可嵌入網頁或應用程式 webview 的網路內容摘要。

                                        **sdkBlob**: `string`

                                        選用。Base64 編碼的 JSON，表示 tuple 陣列。





                                    ??? note "**groundingChunks**: `GroundingChunk array` 從指定接地來源擷取的佐證參照清單。串流時，這裡僅包含先前回應的接地中繼資料中尚未包含的接地區塊。"

                                        ??? note "**chunkType**: `Union type` 區塊類型。"

                                              聯合欄位 `chunkType` 只能是下列其中之一：



                                            ??? note "**web**: `Web` 來自網路的接地區塊。"

                                                **uri**: `string`

                                                僅供輸出。區塊的 URI 參照。

                                                **title**: `string`

                                                僅供輸出。區塊的標題。





                                            ??? note "**image**: `Image` 選用。來自圖片搜尋的接地區塊。"

                                                **sourceUri**: `string`

                                                用於歸因的網頁 URI。

                                                **imageUri**: `string`

                                                圖片素材 URL。

                                                **title**: `string`

                                                圖片來源網頁的標題。

                                                **domain**: `string`

                                                圖片來源網頁的根網域，例如 "example.com"。





                                            ??? note "**retrievedContext**: `RetrievedContext` 選用。來自檔案搜尋工具所擷取上下文的接地區塊。"

                                                  **uri**: `string`

                                                  選用。語意擷取文件的 URI 參照。

                                                  **title**: `string`

                                                  選用。文件的標題。

                                                  **text**: `string`

                                                  選用。區塊的文字。

                                                  **fileSearchStore**: `string`

                                                  選用。包含該文件之 `FileSearchStore` 的名稱。範例：`fileSearchStores/123`



                                                ??? note "**customMetadata**: `GroundingChunkCustomMetadata array` 選用。使用者提供的、關於擷取上下文的中繼資料。"

                                                    ??? note "**value**: `Union type` 中繼資料的值。可以是字串、字串清單或數字。"

                                                          聯合欄位 `value` 只能是下列其中之一：

                                                          **stringValue**: `string`

                                                          選用。中繼資料的字串值。



                                                        ??? note "**stringListValue**: `GroundingChunkStringList` 選用。中繼資料的字串值清單。"

                                                            **values**: `string array`

                                                            清單中的字串值。



                                                          **numericValue**: `number`

                                                          選用。中繼資料的數值。此值的預期範圍取決於所使用的特定 `key`。



                                                      **key**: `string`

                                                      中繼資料的鍵。



                                                  **pageNumber**: `integer`

                                                  選用。擷取上下文的頁碼（如適用）。

                                                  **mediaId**: `string`

                                                  選用。多模態檔案搜尋結果的媒體 blob 資源名稱。格式：fileSearchStores/{file_search_store_id}/media/{blob_id}





                                            ??? note "**maps**: `Maps` 選用。來自 Google Maps 的接地區塊。"

                                                  **uri**: `string`

                                                  地點的 URI 參照。

                                                  **title**: `string`

                                                  地點的標題。

                                                  **text**: `string`

                                                  地點答案的文字說明。

                                                  **placeId**: `string`

                                                  地點的 ID，格式為 `places/{place_id}`。使用者可使用此 ID 查詢該地點。



                                                ??? note "**placeAnswerSources**: `PlaceAnswerSources` 在 Google Maps 中提供特定地點各項特色答案的來源。"

                                                    ??? note "**reviewSnippets**: `ReviewSnippet array` 用來生成特定地點各項特色答案的評論摘要。"

                                                        **reviewId**: `string`

                                                        評論摘要的 ID。

                                                        **googleMapsUri**: `string`

                                                        對應 Google Maps 上使用者評論的連結。

                                                        **title**: `string`

                                                        評論的標題。





                                    ??? note "**groundingSupports**: `GoogleAiGenerativelanguageV1betaGroundingSupport array` 接地佐證清單。"

                                        ??? note "**segment**: `GoogleAiGenerativelanguageV1betaSegment` 此佐證所屬的內容片段。"

                                            **partIndex**: `integer`

                                            Part 物件在其父層 Content 物件中的索引。

                                            **startIndex**: `integer`

                                            在給定 Part 中的起始索引，以位元組計。自 Part 開頭起算，包含該位置，從零開始。

                                            **endIndex**: `integer`

                                            在給定 Part 中的結束索引，以位元組計。自 Part 開頭起算，不含該位置，從零開始。

                                            **text**: `string`

                                            回應中對應該片段的文字。



                                          **groundingChunkIndices**: `integer array`

                                          選用。索引清單（指向 `response.candidate.grounding_metadata` 中的 'grounding_chunk'），指定與該主張關聯的引註。例如 [1,3,4] 表示 grounding_chunk[1]、grounding_chunk[3]、grounding_chunk[4] 是歸因於該主張的擷取內容。若回應為串流，grounding_chunk_indices 指的是跨所有回應的索引。用戶端有責任累積所有回應中的接地區塊（並維持相同順序）。

                                          **confidenceScores**: `number array`

                                          選用。佐證參照的信心分數。範圍為 0 到 1，1 為最有信心。此清單的大小必須與 grounding_chunk_indices 相同。

                                          **renderedParts**: `integer array`

                                          僅供輸出。指向候選內容 `parts` 欄位的索引。這些索引指定哪些已算繪部分與此佐證來源關聯。





                                    ??? note "**retrievalMetadata**: `RetrievalMetadata` 與接地流程中擷取相關的中繼資料。"

                                        **googleSearchDynamicRetrievalScore**: `number`

                                        選用。分數，表示 Google 搜尋的資訊能協助回答提示詞的可能性。分數範圍為 [0, 1]，0 表示可能性最低，1 表示可能性最高。此分數僅在啟用 Google 搜尋接地與動態擷取時填入。它會與門檻值比較，以判斷是否觸發 Google 搜尋。



                                      **webSearchQueries**: `string array`

                                      供後續網路搜尋使用的網路搜尋查詢。

                                      **imageSearchQueries**: `string array`

                                      用於接地的圖片搜尋查詢。

                                      **googleMapsWidgetContextToken**: `string`

                                      選用。Google Maps 小工具上下文權杖的資源名稱，可與 PlacesContextElement 小工具搭配使用，以算繪上下文資料。僅在啟用 Google Maps 接地時填入。



                                  **avgLogprobs**: `number`

                                  僅供輸出。候選的平均對數機率分數。



                                ??? note "**logprobsResult**: `LogprobsResult` 僅供輸出。回應權杖與頂尖權杖的對數似然分數"

                                      **logProbabilitySum**: `number`

                                      所有權杖的對數機率總和。



                                    ??? note "**topCandidates**: `TopCandidates array` 長度 = 解碼步驟的總數。"

                                        ??? note "**candidates**: `LogprobsResultCandidate array` 依對數機率由高至低排序。"

                                            **token**: `string`

                                            候選的權杖字串值。

                                            **tokenId**: `integer`

                                            候選的權杖 id 值。

                                            **logProbability**: `number`

                                            候選的對數機率。





                                    ??? note "**chosenCandidates**: `LogprobsResultCandidate array` 長度 = 解碼步驟的總數。所選候選可能在 top_candidates 中，也可能不在。"

                                        **token**: `string`

                                        候選的權杖字串值。

                                        **tokenId**: `integer`

                                        候選的權杖 id 值。

                                        **logProbability**: `number`

                                        候選的對數機率。





                                ??? note "**urlContextMetadata**: `UrlContextMetadata` 僅供輸出。與 URL 上下文擷取工具相關的中繼資料。"

                                    ??? note "**urlMetadata**: `UrlMetadata array` URL 上下文清單。"

                                          **retrievedUrl**: `string`

                                          工具擷取的 URL。



                                        ??? note "**urlRetrievalStatus**: `string enum` URL 擷取的狀態。"

                                            可能的值：

                                            - `URL_RETRIEVAL_STATUS_UNSPECIFIED`：預設值。此值未使用。
                                            - `URL_RETRIEVAL_STATUS_SUCCESS`：URL 擷取成功。
                                            - `URL_RETRIEVAL_STATUS_ERROR`：URL 擷取因錯誤而失敗。
                                            - `URL_RETRIEVAL_STATUS_PAYWALL`：URL 擷取因內容位於付費牆後而失敗。
                                            - `URL_RETRIEVAL_STATUS_UNSAFE`：URL 擷取因內容不安全而失敗。



                                  **continuationToken**: `string`

                                  選填的不透明接續權杖，在 `finish_reason` 為 `CONTINUATION` 時回傳。用戶端可將此權杖傳入後續的 `GenerateContentRequest` 以繼續生成。





                            ??? note "**promptFeedback**: `PromptFeedback` 回傳與內容篩選器相關的提示詞回饋。"

                                ??? note "**blockReason**: `string enum` 選用。若有設定，表示提示詞被封鎖，且不回傳任何候選。請重新措辭提示詞。"

                                    可能的值：

                                    - `BLOCK_REASON_UNSPECIFIED`：預設值。此值未使用。
                                    - `SAFETY`：提示詞因安全因素被封鎖。請查看 `safety_ratings`，了解是哪個安全類別造成封鎖。
                                    - `OTHER`：提示詞因未知原因被封鎖。
                                    - `BLOCKLIST`：提示詞因包含術語封鎖清單中的詞彙而被封鎖。
                                    - `PROHIBITED_CONTENT`：提示詞因禁止內容而被封鎖。
                                    - `IMAGE_SAFETY`：候選因圖片生成內容不安全而被封鎖。





                                ??? note "**safetyRatings**: `SafetyRating array` 提示詞的安全性評等。每個類別最多有一個評等。"

                                    ??? note "**category**: required `HarmCategory` 此評等的類別。"

                                        可能的值：

                                        - `HARM_CATEGORY_UNSPECIFIED`：未指定類別。
                                        - `HARM_CATEGORY_HARASSMENT`：**Gemini** - 騷擾內容。
                                        - `HARM_CATEGORY_HATE_SPEECH`：**Gemini** - 仇恨言論及內容。
                                        - `HARM_CATEGORY_SEXUALLY_EXPLICIT`：**Gemini** - 性露骨內容。
                                        - `HARM_CATEGORY_DANGEROUS_CONTENT`：**Gemini** - 危險內容。
                                        - `HARM_CATEGORY_JAILBREAK`：**Gemini** - 試圖繞過或顛覆模型安全準則的提示詞（越獄嘗試）。





                                    ??? note "**probability**: required `string enum` 此內容造成危害的機率。"

                                        可能的值：

                                        - `HARM_PROBABILITY_UNSPECIFIED`：未指定機率。
                                        - `NEGLIGIBLE`：內容不安全的可能性微乎其微。
                                        - `LOW`：內容不安全的可能性低。
                                        - `MEDIUM`：內容不安全的可能性中等。
                                        - `HIGH`：內容不安全的可能性高。



                                      **blocked**: `boolean`

                                      此內容是否因這項評等而被封鎖？





                            ??? note "**usageMetadata**: `UsageMetadata` 僅供輸出。生成請求的權杖使用量中繼資料。"

                                  **promptTokenCount**: `integer`

                                  提示詞中的權杖數量。當 `cached_content` 已設定時，這仍是有效的提示詞總大小，也就是包含快取內容中的權杖數量。

                                  **cachedContentTokenCount**: `integer`

                                  提示詞中快取部分的權杖數量（快取內容）

                                  **candidatesTokenCount**: `integer`

                                  所有生成回應候選的權杖總數。

                                  **toolUsePromptTokenCount**: `integer`

                                  僅供輸出。工具使用提示詞中存在的權杖數量。

                                  **thoughtsTokenCount**: `integer`

                                  僅供輸出。思考模型的思考權杖數量。

                                  **totalTokenCount**: `integer`

                                  生成請求的權杖總數（提示詞 + 工具使用提示詞 + 思考 + 回應候選）。



                                ??? note "**promptTokensDetails**: `ModalityTokenCount array` 僅供輸出。請求輸入中處理過的模態清單。"

                                    ??? note "**modality**: `GenerativeLanguageModality` 與此權杖數量關聯的模態。"

                                        可能的值：

                                        - `MODALITY_UNSPECIFIED`：未指定的模態。
                                        - `TEXT`：純文字。
                                        - `IMAGE`：圖片。
                                        - `VIDEO`：影片。
                                        - `AUDIO`：音訊。
                                        - `DOCUMENT`：文件，例如 PDF。



                                      **tokenCount**: `integer`

                                      權杖數量。





                                ??? note "**cacheTokensDetails**: `ModalityTokenCount array` 僅供輸出。請求輸入中快取內容的模態清單。"

                                    ??? note "**modality**: `GenerativeLanguageModality` 與此權杖數量關聯的模態。"

                                        可能的值：

                                        - `MODALITY_UNSPECIFIED`：未指定的模態。
                                        - `TEXT`：純文字。
                                        - `IMAGE`：圖片。
                                        - `VIDEO`：影片。
                                        - `AUDIO`：音訊。
                                        - `DOCUMENT`：文件，例如 PDF。



                                      **tokenCount**: `integer`

                                      權杖數量。





                                ??? note "**candidatesTokensDetails**: `ModalityTokenCount array` 僅供輸出。回應中回傳的模態清單。"

                                    ??? note "**modality**: `GenerativeLanguageModality` 與此權杖數量關聯的模態。"

                                        可能的值：

                                        - `MODALITY_UNSPECIFIED`：未指定的模態。
                                        - `TEXT`：純文字。
                                        - `IMAGE`：圖片。
                                        - `VIDEO`：影片。
                                        - `AUDIO`：音訊。
                                        - `DOCUMENT`：文件，例如 PDF。



                                      **tokenCount**: `integer`

                                      權杖數量。





                                ??? note "**toolUsePromptTokensDetails**: `ModalityTokenCount array` 僅供輸出。為工具使用請求輸入處理過的模態清單。"

                                    ??? note "**modality**: `GenerativeLanguageModality` 與此權杖數量關聯的模態。"

                                        可能的值：

                                        - `MODALITY_UNSPECIFIED`：未指定的模態。
                                        - `TEXT`：純文字。
                                        - `IMAGE`：圖片。
                                        - `VIDEO`：影片。
                                        - `AUDIO`：音訊。
                                        - `DOCUMENT`：文件，例如 PDF。



                                      **tokenCount**: `integer`

                                      權杖數量。





                                ??? note "**serviceTier**: [`ServiceTier`](/api-reference/batch-api/batch-generate-content/#Resource:ServiceTier) 僅供輸出。請求的服務層級。"

                                    可能的值：

                                    - `unspecified`：預設服務層級，即標準層級。
                                    - `standard`：標準服務層級。
                                    - `flex`：Flex 服務層級。
                                    - `priority`：優先服務層級。



                              **modelVersion**: `string`

                              僅供輸出。用來生成回應的模型版本。

                              **responseId**: `string`

                              僅供輸出。response_id 用來識別每個回應。



                            ??? note "**modelStatus**: `ModelStatus` 僅供輸出。此模型目前的模型狀態。"

                                ??? note "**modelStage**: `ModelStage` 基礎模型的階段。"

                                    可能的值：

                                    - `MODEL_STAGE_UNSPECIFIED`：未指定的模型階段。
                                    - `EXPERIMENTAL`：此階段的模型僅供實驗用途。
                                    - `PREVIEW`：此階段的模型比實驗模型更成熟。
                                    - `STABLE`：此階段的模型被視為穩定，可供生產環境使用。
                                    - `LEGACY`：若模型處於此階段，表示該模型在不久的將來將走向淘汰。只有現有客戶可使用此模型。
                                    - `RETIRED`：此階段的模型已退役。這些模型無法使用。



                                  **retirementTime**: `string`

                                  模型退役的時間。

                                  **message**: `string`

                                  說明模型狀態的訊息。



                      **metadata**: `object`

                      僅供輸出。與請求關聯的中繼資料。



  

---


  **name**: `string`

  伺服器指派的名稱，僅在最初回傳它的同一服務內唯一。若使用預設的 HTTP 對應，`name` 應為以 `operations/{unique_id}` 結尾的資源名稱。

  

---


  **metadata**: [`GenerateContentBatch`](/api-reference/batch-api/batch-generate-content/#Resource:GenerateContentBatch)

  

---


  **done**: `boolean`

  若值為 `false`，表示操作仍在進行中。若為 `true`，表示操作已完成，且 `error` 或 `response` 可供使用。

  

  

  
  **範例回應** 

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

  


## 資源 {#resources}

### GenerateContentBatch {#Resource:GenerateContentBatch}

表示一批 `GenerateContent` 請求的資源。

**屬性**：


  **model**: required `string`

  用來生成補全內容的 `Model` 名稱。格式：`models/{model}`。

  

---


  **displayName**: required `string`

  使用者為此批次定義的名稱。

  

---


  

??? note "**inputConfig**: required `InputConfig` 對其執行批次處理之執行個體的輸入設定。"

    ??? note "**source**: required `Union type` 輸入的來源。"

          聯合欄位 `source` 只能是下列其中之一：

          **fileName**: `string`

          包含輸入請求之 `File` 的名稱。



        ??? note "**requests**: `InlinedRequests` 要在批次中處理的請求。"

            ??? note "**requests**: required `InlinedRequest array` 要在批次中處理的請求。"

                ??? note "**request**: required `GenerateContentRequest` 要在批次中處理的請求。"

                      **model**: required `string`

                      用來生成補全內容的 `Model` 名稱。格式：`models/{model}`。



                    ??? note "**contents**: required `Content array` 目前與模型的對話內容。對於單輪查詢，這是單一執行個體。對於多輪查詢（如 [聊天](/docs/text-generation/#multi-turn-conversations)），這是重複欄位，包含對話記錄與最新請求。"

                        ??? note "**parts**: `Part array` 組成單一訊息的有序 `Parts`。各 Part 的 MIME 類型可能不同。"

                            ??? note "**data**: `Union type`"

                                  聯合欄位 `data` 只能是下列其中之一：

                                  **text**: `string`

                                  內嵌文字。



                                ??? note "**inlineData**: `Blob` 內嵌媒體位元組。"

                                    **mimeType**: `string`

                                    來源資料的 IANA 標準 MIME 類型。支援的類型範例：

                                    - 圖片：image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
                                    - 音訊：audio/*, video/audio/s16le, video/audio/wav
                                    - 影片：video/*
                                    - 文字：text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
                                    - 應用程式：application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf 其他背景資訊請參閱 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                    **data**: `string`

                                    媒體格式的原始位元組。

                                    **displayName**: `string`

                                    選用。指定用來向模型指稱此 blob 的名稱（例如 "my_blob.png"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 參照識別符使用。





                                ??? note "**functionCall**: `FunctionCall` 模型回傳的預測 `FunctionCall`，其中包含一個表示 `FunctionDeclaration.name` 的字串，以及其引數與值。"

                                    **name**: required `string`

                                    要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                                    **id**: `string`

                                    選用。函式呼叫的唯一識別符。若有填入，用戶端會執行 `function_call`，並回傳 `id` 相符的回應。

                                    **args**: `object`

                                    選用。函式參數與值，採 JSON 物件格式。





                                ??? note "**functionResponse**: `FunctionResponse` `FunctionCall` 的結果輸出，其中包含一個表示 `FunctionDeclaration.name` 的字串，以及一個包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。"

                                      **name**: required `string`

                                      要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                                      **response**: required `object`

                                      函式回應，採 JSON 物件格式。呼叫端可使用任何符合函式語法的鍵來回傳函式輸出，例如 "output"、"result" 等。特別是當函式呼叫執行失敗時，回應可包含 "error" 鍵，將錯誤詳細資訊回傳給模型。多媒體內容可透過子物件納入，該子物件包含單一 "$ref" 鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，即持有該多媒體之 `FunctionResponsePart` 的對應名稱。請參閱 [多模態函式回應](/docs/function-calling/#multimodal)。

                                      **id**: `string`

                                      選用。此回應所對應函式呼叫的識別符。由用戶端填入，以對應相對應的函式呼叫 `id`。



                                    ??? note "**parts**: `FunctionResponsePart array` 選用。組成函式回應的有序 `Parts`。各 Part 的 IANA MIME 類型可能不同。"

                                        ??? note "**data**: `Union type` 函式回應部分的資料。"

                                              聯合欄位 `data` 只能是下列其中之一：



                                            ??? note "**inlineData**: `FunctionResponseBlob` 內嵌媒體位元組。"

                                                **mimeType**: `string`

                                                來源資料的 IANA 標準 MIME 類型。範例：

                                                - image/png
                                                - image/jpeg

                                                若提供不支援的 MIME 類型，將回傳錯誤。完整支援類型清單請參閱 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                                **data**: `string`

                                                媒體格式的原始位元組。

                                                **displayName**: `string`

                                                選用。blob 的顯示名稱。用來提供標籤或檔名以區分各 blob，並可從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                            ??? note "**fileData**: `FunctionResponseFileData` 以 URI 為基礎的資料。"

                                                **fileUri**: required `string`

                                                URI。

                                                **mimeType**: `string`

                                                來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將回傳錯誤。完整支援類型清單請參閱 [多模態函式回應](/docs/function-calling/#multimodal) 與 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                                **displayName**: `string`

                                                選用。檔案的顯示名稱。用來提供標籤或檔名以區分檔案資料，並可從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                        ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以進行理解。僅對影片部分有意義（`inline_data` 或具影片 mime 類型的 `file_data`）。非影片部分會忽略此欄位。"

                                            可能的值：

                                            - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
                                            - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
                                            - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。



                                      **willContinue**: `boolean`

                                      選用。表示函式呼叫將繼續，且會回傳更多回應，使函式呼叫成為產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，後續回應將不予考慮。允許回傳空的 `response` 並搭配 `will_continue=False`，以表示函式呼叫已完成。這仍可能觸發模型生成。若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。



                                    ??? note "**scheduling**: `string enum` 選用。指定回應在對話中應如何排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。"

                                        可能的值：

                                        - `SCHEDULING_UNSPECIFIED`：此值未使用。
                                        - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發生成。
                                        - `WHEN_IDLE`：將結果加入對話上下文，並提示生成輸出，但不中斷進行中的生成。
                                        - `INTERRUPT`：將結果加入對話上下文，中斷進行中的生成，並提示生成輸出。





                                ??? note "**fileData**: `FileData` 以 URI 為基礎的資料。"

                                    **fileUri**: required `string`

                                    URI。

                                    **mimeType**: `string`

                                    選用。來源資料的 IANA 標準 MIME 類型。

                                    **displayName**: `string`

                                    選用。指定用來向模型指稱此檔案的名稱（例如 "my_file.pdf"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案參照識別符使用。





                                ??? note "**executableCode**: `ExecutableCode` 模型生成的程式碼，預期將被執行。"

                                    ??? note "**language**: required `string enum` `code` 的程式語言。"

                                        可能的值：

                                        - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用此值。
                                        - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 為預設語言。



                                      **code**: required `string`

                                      要執行的程式碼。

                                      **id**: `string`

                                      選用。`ExecutableCode` 部分的唯一識別符。伺服器會回傳 `CodeExecutionResult`，其 `id` 與之相符。





                                ??? note "**codeExecutionResult**: `CodeExecutionResult` 執行 `ExecutableCode` 的結果。"

                                    ??? note "**outcome**: required `string enum` 程式碼執行的結果狀態。"

                                        可能的值：

                                        - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用此值。
                                        - `OUTCOME_OK`：程式碼執行成功完成。若有 stdout，`output` 包含其內容。
                                        - `OUTCOME_FAILED`：程式碼執行失敗。若有 stderr 與 stdout，`output` 包含其內容。
                                        - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已被取消。`output` 可能有、也可能沒有部分內容。



                                      **id**: `string`

                                      選用。此結果所對應 `ExecutableCode` 部分的識別符。僅在對應的 `ExecutableCode` 具有 id 時才填入。

                                      **output**: `string`

                                      選用。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。





                                ??? note "**toolCall**: `ToolCall` 伺服器端工具呼叫。當模型預測應在伺服器上執行的工具叫用時，會填入此欄位。用戶端應將此訊息原樣回傳給 API。"

                                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型。"

                                        可能的值：

                                        - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                        - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                        - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                        - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                        - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                        - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                        - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                      **id**: `string`

                                      選用。工具呼叫的唯一識別符。伺服器會回傳帶有相符 `id` 的工具回應。

                                      **toolName**: `string`

                                      選用。被呼叫的工具名稱。

                                      **args**: `object`

                                      選用。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





                                ??? note "**toolResponse**: `ToolResponse` 伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端填入執行對應 `ToolCall` 的結果。"

                                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型，與對應的 `tool_type`（位於對應的 `ToolCall` 中）相符。"

                                        可能的值：

                                        - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                        - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                        - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                        - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                        - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                        - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                        - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                      **id**: `string`

                                      選用。此回應所對應工具呼叫的識別符。

                                      **response**: `object`

                                      選用。工具回應。





                            ??? note "**metadata**: `Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定此項，以設定每個部分的靜態媒體預處理。"

                                  聯合欄位 `metadata` 只能是下列其中之一：



                                ??? note "**videoMetadata**: `VideoMetadata` 選用。影片中繼資料。中繼資料僅應在影片資料以 inline_data 或 file_data 呈現時指定。"

                                    **startOffset**: `string`

                                    選用。影片的開始偏移。

                                    **endOffset**: `string`

                                    選用。影片的結束偏移。

                                    **fps**: `number`

                                    選用。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。



                              **thought**: `boolean`

                              選用。表示該部分是否為模型的思考內容。

                              **thoughtSignature**: `string`

                              選用。思考內容的不透明簽章，以便在後續請求中重複使用。

                              **partMetadata**: `object`

                              與 Part 關聯的自訂中繼資料。使用 genai.Part 作為內容表示法的代理，可能需要追蹤額外資訊。例如，它可以是 Part 來源檔案或出處的名稱，或是多工處理多個 Part 串流的方式。



                            ??? note "**mediaResolution**: `V1mainMediaResolution` 選用。輸入媒體的媒體解析度。"

                                ??? note "**value**: `Union type` 媒體解析度等級。"

                                      聯合欄位 `value` 只能是下列其中之一：



                                    ??? note "**level**: `string enum` 給定媒體所使用的權杖化品質。供 Gemini API 支援使用。"

                                        可能的值：

                                        - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                                        - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低。
                                        - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中。
                                        - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高。
                                        - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設為超高。





                            ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以進行理解。僅對影片部分有意義（`inline_data` 或具影片 mime 類型的 `file_data`）。非影片部分會忽略此欄位。"

                                可能的值：

                                - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
                                - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
                                - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。





                            ??? note "**audioTranscription**: `AudioTranscription` 選用。音訊（輸入或輸出）轉錄。僅在此 Part 包含音訊資料時設定。"

                                  **text**: required `string`

                                  此音訊片段的轉錄文字。

                                  **speakerLabel**: `string`

                                  選用。標示此音訊片段說話者的標籤（例如 "spk_1"、"spk_2"）。在設定語者分離時出現。



                                ??? note "**words**: `WordInfo array` 選用。詳細的單字級轉錄與時間資訊。在設定 word_timestamp 時出現。"

                                    **word**: required `string`

                                    單字的轉錄內容。

                                    **startOffset**: `string`

                                    選用。單字相對於音訊開頭的開始時間偏移。

                                    **endOffset**: `string`

                                    選用。單字相對於音訊開頭的結束時間偏移。





                            ??? note "**speechMetadata**: `SpeechMetadata` 選用。套用於文字部分的中繼資料，用來客製化其朗讀或合成方式，例如指定說話者身分或說話風格。"

                                **speaker**: `string`

                                選用。選填的說話者名稱，用於多說話者合成。

                                **style**: `string`

                                選用。選填的風格指令，用於語音合成。



                          **role**: `string`

                          選用。內容的產生者。必須為 'user' 或 'model'。在多輪對話中設定很有用，其他情況可留空或不設定。





                    ??? note "**systemInstruction**: `Content` 選用。開發人員設定的 [系統指令](/docs/text-generation/#system-instructions)。目前僅支援文字。"

                        ??? note "**parts**: `Part array` 組成單一訊息的有序 `Parts`。各 Part 的 MIME 類型可能不同。"

                            ??? note "**data**: `Union type`"

                                  聯合欄位 `data` 只能是下列其中之一：

                                  **text**: `string`

                                  內嵌文字。



                                ??? note "**inlineData**: `Blob` 內嵌媒體位元組。"

                                    **mimeType**: `string`

                                    來源資料的 IANA 標準 MIME 類型。支援的類型範例：

                                    - 圖片：image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
                                    - 音訊：audio/*, video/audio/s16le, video/audio/wav
                                    - 影片：video/*
                                    - 文字：text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
                                    - 應用程式：application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf 其他背景資訊請參閱 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                    **data**: `string`

                                    媒體格式的原始位元組。

                                    **displayName**: `string`

                                    選用。指定用來向模型指稱此 blob 的名稱（例如 "my_blob.png"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 參照識別符使用。





                                ??? note "**functionCall**: `FunctionCall` 模型回傳的預測 `FunctionCall`，其中包含一個表示 `FunctionDeclaration.name` 的字串，以及其引數與值。"

                                    **name**: required `string`

                                    要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                                    **id**: `string`

                                    選用。函式呼叫的唯一識別符。若有填入，用戶端會執行 `function_call`，並回傳 `id` 相符的回應。

                                    **args**: `object`

                                    選用。函式參數與值，採 JSON 物件格式。





                                ??? note "**functionResponse**: `FunctionResponse` `FunctionCall` 的結果輸出，其中包含一個表示 `FunctionDeclaration.name` 的字串，以及一個包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。"

                                      **name**: required `string`

                                      要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                                      **response**: required `object`

                                      函式回應，採 JSON 物件格式。呼叫端可使用任何符合函式語法的鍵來回傳函式輸出，例如 "output"、"result" 等。特別是當函式呼叫執行失敗時，回應可包含 "error" 鍵，將錯誤詳細資訊回傳給模型。多媒體內容可透過子物件納入，該子物件包含單一 "$ref" 鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，即持有該多媒體之 `FunctionResponsePart` 的對應名稱。請參閱 [多模態函式回應](/docs/function-calling/#multimodal)。

                                      **id**: `string`

                                      選用。此回應所對應函式呼叫的識別符。由用戶端填入，以對應相對應的函式呼叫 `id`。



                                    ??? note "**parts**: `FunctionResponsePart array` 選用。組成函式回應的有序 `Parts`。各 Part 的 IANA MIME 類型可能不同。"

                                        ??? note "**data**: `Union type` 函式回應部分的資料。"

                                              聯合欄位 `data` 只能是下列其中之一：



                                            ??? note "**inlineData**: `FunctionResponseBlob` 內嵌媒體位元組。"

                                                **mimeType**: `string`

                                                來源資料的 IANA 標準 MIME 類型。範例：

                                                - image/png
                                                - image/jpeg

                                                若提供不支援的 MIME 類型，將回傳錯誤。完整支援類型清單請參閱 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                                **data**: `string`

                                                媒體格式的原始位元組。

                                                **displayName**: `string`

                                                選用。blob 的顯示名稱。用來提供標籤或檔名以區分各 blob，並可從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                            ??? note "**fileData**: `FunctionResponseFileData` 以 URI 為基礎的資料。"

                                                **fileUri**: required `string`

                                                URI。

                                                **mimeType**: `string`

                                                來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將回傳錯誤。完整支援類型清單請參閱 [多模態函式回應](/docs/function-calling/#multimodal) 與 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                                **displayName**: `string`

                                                選用。檔案的顯示名稱。用來提供標籤或檔名以區分檔案資料，並可從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                        ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以進行理解。僅對影片部分有意義（`inline_data` 或具影片 mime 類型的 `file_data`）。非影片部分會忽略此欄位。"

                                            可能的值：

                                            - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
                                            - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
                                            - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。



                                      **willContinue**: `boolean`

                                      選用。表示函式呼叫將繼續，且會回傳更多回應，使函式呼叫成為產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，後續回應將不予考慮。允許回傳空的 `response` 並搭配 `will_continue=False`，以表示函式呼叫已完成。這仍可能觸發模型生成。若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。



                                    ??? note "**scheduling**: `string enum` 選用。指定回應在對話中應如何排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。"

                                        可能的值：

                                        - `SCHEDULING_UNSPECIFIED`：此值未使用。
                                        - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發生成。
                                        - `WHEN_IDLE`：將結果加入對話上下文，並提示生成輸出，但不中斷進行中的生成。
                                        - `INTERRUPT`：將結果加入對話上下文，中斷進行中的生成，並提示生成輸出。





                                ??? note "**fileData**: `FileData` 以 URI 為基礎的資料。"

                                    **fileUri**: required `string`

                                    URI。

                                    **mimeType**: `string`

                                    選用。來源資料的 IANA 標準 MIME 類型。

                                    **displayName**: `string`

                                    選用。指定用來向模型指稱此檔案的名稱（例如 "my_file.pdf"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案參照識別符使用。





                                ??? note "**executableCode**: `ExecutableCode` 模型生成的程式碼，預期將被執行。"

                                    ??? note "**language**: required `string enum` `code` 的程式語言。"

                                        可能的值：

                                        - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用此值。
                                        - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 為預設語言。



                                      **code**: required `string`

                                      要執行的程式碼。

                                      **id**: `string`

                                      選用。`ExecutableCode` 部分的唯一識別符。伺服器會回傳 `CodeExecutionResult`，其 `id` 與之相符。





                                ??? note "**codeExecutionResult**: `CodeExecutionResult` 執行 `ExecutableCode` 的結果。"

                                    ??? note "**outcome**: required `string enum` 程式碼執行的結果狀態。"

                                        可能的值：

                                        - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用此值。
                                        - `OUTCOME_OK`：程式碼執行成功完成。若有 stdout，`output` 包含其內容。
                                        - `OUTCOME_FAILED`：程式碼執行失敗。若有 stderr 與 stdout，`output` 包含其內容。
                                        - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已被取消。`output` 可能有、也可能沒有部分內容。



                                      **id**: `string`

                                      選用。此結果所對應 `ExecutableCode` 部分的識別符。僅在對應的 `ExecutableCode` 具有 id 時才填入。

                                      **output**: `string`

                                      選用。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。





                                ??? note "**toolCall**: `ToolCall` 伺服器端工具呼叫。當模型預測應在伺服器上執行的工具叫用時，會填入此欄位。用戶端應將此訊息原樣回傳給 API。"

                                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型。"

                                        可能的值：

                                        - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                        - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                        - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                        - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                        - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                        - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                        - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                      **id**: `string`

                                      選用。工具呼叫的唯一識別符。伺服器會回傳帶有相符 `id` 的工具回應。

                                      **toolName**: `string`

                                      選用。被呼叫的工具名稱。

                                      **args**: `object`

                                      選用。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





                                ??? note "**toolResponse**: `ToolResponse` 伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端填入執行對應 `ToolCall` 的結果。"

                                    ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型，與對應的 `tool_type`（位於對應的 `ToolCall` 中）相符。"

                                        可能的值：

                                        - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                        - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                        - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                        - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                        - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                        - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                        - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                      **id**: `string`

                                      選用。此回應所對應工具呼叫的識別符。

                                      **response**: `object`

                                      選用。工具回應。





                            ??? note "**metadata**: `Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定此項，以設定每個部分的靜態媒體預處理。"

                                  聯合欄位 `metadata` 只能是下列其中之一：



                                ??? note "**videoMetadata**: `VideoMetadata` 選用。影片中繼資料。中繼資料僅應在影片資料以 inline_data 或 file_data 呈現時指定。"

                                    **startOffset**: `string`

                                    選用。影片的開始偏移。

                                    **endOffset**: `string`

                                    選用。影片的結束偏移。

                                    **fps**: `number`

                                    選用。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。



                              **thought**: `boolean`

                              選用。表示該部分是否為模型的思考內容。

                              **thoughtSignature**: `string`

                              選用。思考內容的不透明簽章，以便在後續請求中重複使用。

                              **partMetadata**: `object`

                              與 Part 關聯的自訂中繼資料。使用 genai.Part 作為內容表示法的代理，可能需要追蹤額外資訊。例如，它可以是 Part 來源檔案或出處的名稱，或是多工處理多個 Part 串流的方式。



                            ??? note "**mediaResolution**: `V1mainMediaResolution` 選用。輸入媒體的媒體解析度。"

                                ??? note "**value**: `Union type` 媒體解析度等級。"

                                      聯合欄位 `value` 只能是下列其中之一：



                                    ??? note "**level**: `string enum` 給定媒體所使用的權杖化品質。供 Gemini API 支援使用。"

                                        可能的值：

                                        - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                                        - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低。
                                        - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中。
                                        - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高。
                                        - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設為超高。





                            ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以進行理解。僅對影片部分有意義（`inline_data` 或具影片 mime 類型的 `file_data`）。非影片部分會忽略此欄位。"

                                可能的值：

                                - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
                                - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
                                - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。





                            ??? note "**audioTranscription**: `AudioTranscription` 選用。音訊（輸入或輸出）轉錄。僅在此 Part 包含音訊資料時設定。"

                                  **text**: required `string`

                                  此音訊片段的轉錄文字。

                                  **speakerLabel**: `string`

                                  選用。標示此音訊片段說話者的標籤（例如 "spk_1"、"spk_2"）。在設定語者分離時出現。



                                ??? note "**words**: `WordInfo array` 選用。詳細的單字級轉錄與時間資訊。在設定 word_timestamp 時出現。"

                                    **word**: required `string`

                                    單字的轉錄內容。

                                    **startOffset**: `string`

                                    選用。單字相對於音訊開頭的開始時間偏移。

                                    **endOffset**: `string`

                                    選用。單字相對於音訊開頭的結束時間偏移。





                            ??? note "**speechMetadata**: `SpeechMetadata` 選用。套用於文字部分的中繼資料，用來客製化其朗讀或合成方式，例如指定說話者身分或說話風格。"

                                **speaker**: `string`

                                選用。選填的說話者名稱，用於多說話者合成。

                                **style**: `string`

                                選用。選填的風格指令，用於語音合成。



                          **role**: `string`

                          選用。內容的產生者。必須為 'user' 或 'model'。在多輪對話中設定很有用，其他情況可留空或不設定。





                    ??? note "**tools**: `Tool array` 選用。`Tools` 清單，供 `Model` 用來生成下一個回應。`Tool` 是一段程式碼，使系統能與外部系統互動，以執行 `Model` 知識與範圍之外的一個或一組動作。支援的 `Tool` 為 `Function` 與 `code_execution`。如需了解更多，請參閱 [函式呼叫](/docs/function-calling/) 與 [程式碼執行](/docs/code-execution/) 指南。"

                        ??? note "**functionDeclarations**: `FunctionDeclaration array` 選用。模型可用於函式呼叫的 `FunctionDeclarations` 清單。模型或系統不會執行該函式。相反地，已定義的函式可能以帶有引數的 FunctionCall 形式回傳至用戶端執行。模型可能決定呼叫這些函式的子集，方式是在回應中填入 FunctionCall。下一個對話輪次可能包含帶有 Content.role 'function' 的 FunctionResponse，作為下一個模型輪次的生成上下文。"

                              **name**: required `string`

                              函式的名稱。必須為 a-z、A-Z、0-9，或包含底線、冒號、點號與連字號，長度上限為 128。

                              **description**: required `string`

                              函式的簡要說明。



                            ??? note "**parameters**: `Schema` 選用。說明此函式的參數。反映 Open API 3.03 Parameter Object。字串鍵：參數的名稱。參數名稱區分大小寫。Schema 值：定義參數所用類型的 Schema。"

                                ??? note "**type**: required `Type` 資料類型。"

                                    可能的值：

                                    - `TYPE_UNSPECIFIED`：未指定，不應使用。
                                    - `STRING`：字串類型。
                                    - `NUMBER`：數字類型。
                                    - `INTEGER`：整數類型。
                                    - `BOOLEAN`：布林類型。
                                    - `ARRAY`：陣列類型。
                                    - `OBJECT`：物件類型。
                                    - `NULL`：Null 類型。



                                  **format**: `string`

                                  選用。資料的格式。允許任何值，但大多數值不會觸發任何特殊功能。

                                  **title**: `string`

                                  選用。schema 的標題。

                                  **description**: `string`

                                  選用。參數的簡要說明。其中可包含使用範例。參數說明可採 Markdown 格式。

                                  **nullable**: `boolean`

                                  選用。表示該值是否可為 null。

                                  **enum**: `string array`

                                  選用。具 enum 格式之 Type.STRING 元素的可能值。例如，我們可將 Enum Direction 定義為：{type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]}

                                  **items**: `Schema`

                                  選用。Type.ARRAY 元素的 Schema。

                                  **maxItems**: `string`

                                  選用。Type.ARRAY 元素的數量上限。

                                  **minItems**: `string`

                                  選用。Type.ARRAY 元素的數量下限。

                                  **properties**: `object`

                                  選用。Type.OBJECT 的屬性。

                                  **required**: `string array`

                                  選用。Type.OBJECT 的必填屬性。

                                  **minProperties**: `string`

                                  選用。Type.OBJECT 屬性的數量下限。

                                  **maxProperties**: `string`

                                  選用。Type.OBJECT 屬性的數量上限。

                                  **minimum**: `number`

                                  選用。TYPE INTEGER 與 NUMBER 的 SCHEMA 欄位 Type.INTEGER 與 Type.NUMBER 的最小值

                                  **maximum**: `number`

                                  選用。Type.INTEGER 與 Type.NUMBER 的最大值

                                  **minLength**: `string`

                                  選用。TYPE STRING 的 SCHEMA 欄位 Type.STRING 的最小長度

                                  **maxLength**: `string`

                                  選用。Type.STRING 的最大長度

                                  **pattern**: `string`

                                  選用。Type.STRING 的模式，用來將字串限制為正規表示式。

                                  **example**: `object`

                                  選用。物件的範例。僅在物件為根物件時填入。

                                  **anyOf**: `Schema array`

                                  選用。該值應對照清單中任一（一個或多個）子 schema 進行驗證。

                                  **propertyOrdering**: `string array`

                                  選用。屬性的順序。非 Open API 規格中的標準欄位。用來決定回應中屬性的順序。

                                  **default**: `object`

                                  選用。欄位的預設值。依 JSON Schema，此欄位是供文件產生器使用，不影響驗證。因此這裡納入並忽略它，讓傳送帶有 `default` 欄位的 schema 的開發人員不會收到未知欄位錯誤。



                              **parametersJsonSchema**: `object`

                              選用。以 JSON Schema 格式說明函式的參數。該 schema 必須描述一個物件，其屬性即為函式的參數。例如：`{ "type": "object", "properties": { "name": { "type": "string" }, "age": { "type": "integer" } }, "additionalProperties": false, "required": ["name", "age"], "propertyOrdering": ["name", "age"] }` 此欄位與 `parameters` 互斥。



                            ??? note "**response**: `Schema` 選用。以 JSON Schema 格式說明此函式的輸出。反映 Open API 3.03 Response Object。該 Schema 定義函式回應值所使用的類型。"

                                ??? note "**type**: required `Type` 資料類型。"

                                    可能的值：

                                    - `TYPE_UNSPECIFIED`：未指定，不應使用。
                                    - `STRING`：字串類型。
                                    - `NUMBER`：數字類型。
                                    - `INTEGER`：整數類型。
                                    - `BOOLEAN`：布林類型。
                                    - `ARRAY`：陣列類型。
                                    - `OBJECT`：物件類型。
                                    - `NULL`：Null 類型。



                                  **format**: `string`

                                  選用。資料的格式。允許任何值，但大多數值不會觸發任何特殊功能。

                                  **title**: `string`

                                  選用。schema 的標題。

                                  **description**: `string`

                                  選用。參數的簡要說明。其中可包含使用範例。參數說明可採 Markdown 格式。

                                  **nullable**: `boolean`

                                  選用。表示該值是否可為 null。

                                  **enum**: `string array`

                                  選用。具 enum 格式之 Type.STRING 元素的可能值。例如，我們可將 Enum Direction 定義為：{type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]}

                                  **items**: `Schema`

                                  選用。Type.ARRAY 元素的 Schema。

                                  **maxItems**: `string`

                                  選用。Type.ARRAY 元素的數量上限。

                                  **minItems**: `string`

                                  選用。Type.ARRAY 元素的數量下限。

                                  **properties**: `object`

                                  選用。Type.OBJECT 的屬性。

                                  **required**: `string array`

                                  選用。Type.OBJECT 的必填屬性。

                                  **minProperties**: `string`

                                  選用。Type.OBJECT 屬性的數量下限。

                                  **maxProperties**: `string`

                                  選用。Type.OBJECT 屬性的數量上限。

                                  **minimum**: `number`

                                  選用。TYPE INTEGER 與 NUMBER 的 SCHEMA 欄位 Type.INTEGER 與 Type.NUMBER 的最小值

                                  **maximum**: `number`

                                  選用。Type.INTEGER 與 Type.NUMBER 的最大值

                                  **minLength**: `string`

                                  選用。TYPE STRING 的 SCHEMA 欄位 Type.STRING 的最小長度

                                  **maxLength**: `string`

                                  選用。Type.STRING 的最大長度

                                  **pattern**: `string`

                                  選用。Type.STRING 的模式，用來將字串限制為正規表示式。

                                  **example**: `object`

                                  選用。物件的範例。僅在物件為根物件時填入。

                                  **anyOf**: `Schema array`

                                  選用。該值應對照清單中任一（一個或多個）子 schema 進行驗證。

                                  **propertyOrdering**: `string array`

                                  選用。屬性的順序。非 Open API 規格中的標準欄位。用來決定回應中屬性的順序。

                                  **default**: `object`

                                  選用。欄位的預設值。依 JSON Schema，此欄位是供文件產生器使用，不影響驗證。因此這裡納入並忽略它，讓傳送帶有 `default` 欄位的 schema 的開發人員不會收到未知欄位錯誤。



                              **responseJsonSchema**: `object`

                              選用。以 JSON Schema 格式說明此函式的輸出。schema 指定的值即為函式的回應值。此欄位與 `response` 互斥。



                            ??? note "**behavior**: `string enum` 選用。指定函式的 Behavior。目前僅 BidiGenerateContent 方法支援。"

                                可能的值：

                                - `UNSPECIFIED`：此值未使用。
                                - `BLOCKING`：若設定，系統會等待收到函式回應後才繼續對話。
                                - `NON_BLOCKING`：若設定，系統不會等待收到函式回應。相反地，它會在維持使用者與模型對話的同時，嘗試在函式回應可用時加以處理。





                        ??? note "**googleSearchRetrieval**: `GoogleSearchRetrieval` 選用。由 Google 搜尋驅動的擷取工具。"

                            ??? note "**dynamicRetrievalConfig**: `DynamicRetrievalConfig` 指定給定來源的動態擷取設定。"

                                ??? note "**mode**: `string enum` 動態擷取中要使用的預測器模式。"

                                    可能的值：

                                    - `MODE_UNSPECIFIED`：一律觸發擷取。
                                    - `MODE_DYNAMIC`：僅在系統判斷有必要時才執行擷取。



                                  **dynamicThreshold**: `number`

                                  動態擷取要使用的門檻值。若未設定，使用系統預設值。





                        ??? note "**codeExecution**: `CodeExecution` 選用。讓模型能在生成過程中執行程式碼。"






                        ??? note "**googleSearch**: `GoogleSearch` 選用。GoogleSearch 工具類型。在 Model 中支援 Google Search 的工具。由 Google 提供。"

                            ??? note "**timeRangeFilter**: `Interval` 選用。將搜尋結果篩選至特定時間範圍。若客戶設定了開始時間，就必須設定結束時間（反之亦然）。"

                                **startTime**: `string`

                                選用。區間的起始（含）。若有指定，符合此區間的 Timestamp 必須等於或晚於起始。

                                **endTime**: `string`

                                選用。區間的結束（不含）。若有指定，符合此區間的 Timestamp 必須早於結束。





                            ??? note "**searchTypes**: `SearchTypes` 選用。要啟用的搜尋類型集合。若未設定，預設啟用網路搜尋。"

                                ??? note "**webSearch**: `WebSearch` 選用。啟用網路搜尋。僅回傳文字結果。"






                                ??? note "**imageSearch**: `ImageSearch` 選用。啟用圖片搜尋。回傳圖片位元組。"





                        ??? note "**computerUse**: `ComputerUse` 選用。支援模型直接與電腦互動的工具。若啟用，會自動填入電腦使用專屬的 Function Declarations。"

                            ??? note "**environment**: required `string enum` 所操作的環境。"

                                可能的值：

                                - `ENVIRONMENT_UNSPECIFIED`：預設為瀏覽器。
                                - `ENVIRONMENT_BROWSER`：在網路瀏覽器中操作。
                                - `ENVIRONMENT_MOBILE`：在行動環境中操作。
                                - `ENVIRONMENT_DESKTOP`：在桌面環境中操作。



                              **excludedPredefinedFunctions**: `string array`

                              選用。依預設，預定義函式會包含在最終的模型呼叫中。其中部分函式可明確排除，不自動納入。這有兩個用途：1. 使用更受限／不同的動作空間。2. 改進預定義函式的定義／指令。

                              **enablePromptInjectionDetection**: `boolean`

                              選用。是否對電腦使用請求啟用提示詞注入偵測檢查。



                            ??? note "**disabledSafetyPolicies**: `string enum array` 選用。電腦使用已停用的安全政策。"

                                可能的值：

                                - `SAFETY_POLICY_UNSPECIFIED`：未指定的安全政策。
                                - `FINANCIAL_TRANSACTIONS`：金融交易的安全政策。
                                - `SENSITIVE_DATA_MODIFICATION`：敏感資料修改的安全政策。
                                - `COMMUNICATION_TOOL`：通訊工具（例如 Gmail、Chat、Meet）的安全政策。
                                - `ACCOUNT_CREATION`：帳號建立的安全政策。
                                - `DATA_MODIFICATION`：資料修改的安全政策。
                                - `USER_CONSENT_MANAGEMENT`：使用者同意管理的安全政策。
                                - `LEGAL_TERMS_AND_AGREEMENTS`：法律條款與協議的安全政策。





                        ??? note "**urlContext**: `UrlContext` 選用。支援 URL 上下文擷取的工具。"






                        ??? note "**fileSearch**: `FileSearch` 選用。FileSearch 工具類型。從 Semantic Retrieval 語料庫擷取知識的工具。"

                            **fileSearchStoreNames**: required `string array`

                            要擷取的 file_search_stores 名稱。範例：`fileSearchStores/my-file-search-store-123`

                            **topK**: `integer`

                            選用。要擷取的語意擷取區塊數量。

                            **metadataFilter**: `string`

                            選用。要套用於語意擷取文件與區塊的中繼資料篩選器。





                        ??? note "**mcpServers**: `McpServer array` 選用。要連線的 MCP Servers。"

                            ??? note "**transport**: `Union type` 連線至 MCPServer 所使用的傳輸方式。"

                                  聯合欄位 `transport` 只能是下列其中之一：



                                ??? note "**streamableHttpTransport**: `StreamableHttpTransport` 可串流 HTTP 請求與回應的傳輸方式。"

                                    **url**: `string`

                                    MCPServer 端點的完整 URL。範例："https://api.example.com/mcp"

                                    **headers**: `object`

                                    選用：如有需要，包含驗證標頭、逾時等欄位。

                                    **timeout**: `string`

                                    一般操作的 HTTP 逾時。

                                    **sseReadTimeout**: `string`

                                    SSE 讀取操作的逾時。

                                    **terminateOnClose**: `boolean`

                                    當傳輸關閉時是否關閉用戶端工作階段。



                              **name**: `string`

                              MCPServer 的名稱。





                        ??? note "**googleMaps**: `GoogleMaps` 選用。讓模型的回應能以與使用者查詢相關的地理空間上下文接地的工具。"

                            **enableWidget**: `boolean`

                            選用。是否在回應的 GroundingMetadata 中回傳小工具上下文權杖。開發人員可使用小工具上下文權杖，算繪帶有與模型在回應中參照之地點相關地理空間上下文的 Google Maps 小工具。





                    ??? note "**toolConfig**: `ToolConfig` 選用。請求中指定之任何 `Tool` 的工具設定。使用範例請參閱 [函式呼叫指南](/docs/function-calling/#function_calling_modes)。"

                        ??? note "**functionCallingConfig**: `FunctionCallingConfig` 選用。函式呼叫設定。"

                            ??? note "**mode**: `string enum` 選用。指定函式呼叫應執行的模式。若未指定，預設值將設為 AUTO。"

                                可能的值：

                                - `MODE_UNSPECIFIED`：未指定的函式呼叫模式。不應使用此值。
                                - `AUTO`：預設的模型行為，由模型決定預測函式呼叫或自然語言回應。
                                - `ANY`：模型受限於一律僅預測函式呼叫。若設定了 "allowed_function_names"，預測的函式呼叫將限於 "allowed_function_names" 中的任一項，否則預測的函式呼叫將為所提供 "function_declarations" 中的任一項。
                                - `NONE`：模型不會預測任何函式呼叫。模型行為與未傳入任何函式宣告時相同。
                                - `VALIDATED`：模型決定預測函式呼叫或自然語言回應，但會以受限解碼驗證函式呼叫。若設定了 "allowed_function_names"，預測的函式呼叫將限於 "allowed_function_names" 中的任一項，否則預測的函式呼叫將為所提供 "function_declarations" 中的任一項。



                              **allowedFunctionNames**: `string array`

                              選用。函式名稱集合，提供時可限制模型呼叫的函式。僅應在 Mode 為 ANY 或 VALIDATED 時設定。函式名稱應與 [FunctionDeclaration.name] 相符。設定後，模型將僅從允許的函式名稱中預測函式呼叫。





                        ??? note "**retrievalConfig**: `RetrievalConfig` 選用。擷取設定。"

                            ??? note "**latLng**: `LatLng` 選用。使用者的位置。"

                                **latitude**: `number`

                                以度為單位的緯度。必須在 [-90.0, +90.0] 範圍內。

                                **longitude**: `number`

                                以度為單位的經度。必須在 [-180.0, +180.0] 範圍內。



                              **languageCode**: `string`

                              選用。使用者的語言代碼。內容的語言代碼。使用 [BCP47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) 定義的語言標籤。



                          **includeServerSideToolInvocations**: `boolean`

                          選用。若為 true，API 回應將在 `Content` 訊息中包含伺服器端工具呼叫與回應。這讓用戶端能觀察伺服器的工具互動。





                    ??? note "**safetySettings**: `SafetySetting array` 選用。用於封鎖不安全內容的唯一 `SafetySetting` 執行個體清單。這將對 `GenerateContentRequest.contents` 與 `GenerateContentResponse.candidates` 強制套用。每個 `SafetyCategory` 類型不應有多於一個設定。API 會封鎖任何未達這些設定所定門檻的內容與回應。此清單會覆寫 safety_settings 中指定的每個 `SafetyCategory` 的預設設定。若清單中未提供某個 `SafetySetting`（對應給定的 `SafetyCategory`），API 將使用該類別的預設安全設定。支援的危害類別為 HARM_CATEGORY_HATE_SPEECH、HARM_CATEGORY_SEXUALLY_EXPLICIT、HARM_CATEGORY_DANGEROUS_CONTENT、HARM_CATEGORY_HARASSMENT、HARM_CATEGORY_CIVIC_INTEGRITY、HARM_CATEGORY_JAILBREAK。如需可用安全設定的詳細資訊，請參閱 [指南](/docs/safety-settings/)。另請參閱 [安全指南](/docs/safety-guidance/)，了解如何將安全考量納入您的 AI 應用程式。"

                        ??? note "**category**: required `HarmCategory` 此設定的類別。"

                            可能的值：

                            - `HARM_CATEGORY_UNSPECIFIED`：未指定類別。
                            - `HARM_CATEGORY_HARASSMENT`：**Gemini** - 騷擾內容。
                            - `HARM_CATEGORY_HATE_SPEECH`：**Gemini** - 仇恨言論及內容。
                            - `HARM_CATEGORY_SEXUALLY_EXPLICIT`：**Gemini** - 性露骨內容。
                            - `HARM_CATEGORY_DANGEROUS_CONTENT`：**Gemini** - 危險內容。
                            - `HARM_CATEGORY_JAILBREAK`：**Gemini** - 試圖繞過或顛覆模型安全準則的提示詞（越獄嘗試）。





                        ??? note "**threshold**: required `string enum` 控制封鎖危害的機率門檻。"

                            可能的值：

                            - `HARM_BLOCK_THRESHOLD_UNSPECIFIED`：未指定門檻。
                            - `BLOCK_LOW_AND_ABOVE`：NEGLIGIBLE 的內容將被允許。
                            - `BLOCK_MEDIUM_AND_ABOVE`：NEGLIGIBLE 與 LOW 的內容將被允許。
                            - `BLOCK_ONLY_HIGH`：NEGLIGIBLE、LOW 與 MEDIUM 的內容將被允許。
                            - `BLOCK_NONE`：所有內容都將被允許。
                            - `OFF`：關閉安全篩選器。





                    ??? note "**generationConfig**: `GenerationConfig` 選用。模型生成與輸出的設定選項。"

                          **candidateCount**: `integer`

                          選用。要回傳的生成回應數量。若未設定，預設為 1。請注意，這對前代生成模型（Gemini 1.0 系列）不適用

                          **stopSequences**: `string array`

                          選用。將停止輸出生成的字元序列集合（最多 5 個）。若有指定，API 會在 `stop_sequence` 首次出現時停止。停止序列不會包含在回應中。

                          **maxOutputTokens**: `integer`

                          選用。回應候選中要包含的權杖數量上限。注意：預設值因模型而異，請參閱 `Model.output_token_limit` 屬性，其所屬的 `Model` 由 `getModel` 函式回傳。

                          **temperature**: `number`

                          選用。控制輸出的隨機性。注意：預設值因模型而異，請參閱 `Model.temperature` 屬性，其所屬的 `Model` 由 `getModel` 函式回傳。值範圍可為 [0.0, 2.0]。此欄位在 Gemini 3.6 Flash 及更新的模型上已不再支援，且會被無聲忽略。

                          **topP**: `number`

                          選用。取樣時要考慮之權杖的最大累計機率。模型結合使用 Top-k 與 Top-p（nucleus）取樣。權杖依其指派的機率排序，使得僅考慮最有可能的權杖。Top-k 取樣直接限制要考慮的權杖數量上限，而 Nucleus 取樣則依累計機率限制權杖數量。注意：預設值因 `Model` 而異，由 `Model.top_p` 屬性指定，其由 `getModel` 函式回傳。空的 `top_k` 屬性表示模型不套用 top-k 取樣，且不允許在請求中設定 `top_k`。此欄位在 Gemini 3.6 Flash 及更新的模型上已不再支援，且會被無聲忽略。

                          **topK**: `integer`

                          選用。取樣時要考慮的權杖數量上限。Gemini 模型使用 Top-p（nucleus）取樣，或 Top-k 與 nucleus 取樣的組合。Top-k 取樣考慮 `top_k` 個最有可能權杖的集合。以 nucleus 取樣運行的模型不允許設定 top_k。注意：預設值因 `Model` 而異，由 `Model.top_p` 屬性指定，其由 `getModel` 函式回傳。空的 `top_k` 屬性表示模型不套用 top-k 取樣，且不允許在請求中設定 `top_k`。此欄位在 Gemini 3.6 Flash 及更新的模型上已不再支援，且會被無聲忽略。

                          **seed**: `integer`

                          選用。解碼時使用的種子。若未設定，請求會使用隨機生成的種子。

                          **responseMimeType**: `string`

                          選用。生成候選文字的 MIME 類型。支援的 MIME 類型為：`text/plain`：（預設）文字輸出。`application/json`：回應候選中的 JSON 回應。`text/x.enum`：回應候選中以字串表示的 ENUM 回應。所有支援的文字 MIME 類型清單請參閱 [文件](/docs/file-input-methods/#text-file-types)。

                          **responseJsonSchema**: `object`

                          選用。內部細節。請使用 `responseJsonSchema`，不要使用此欄位。

                          **presencePenalty**: `number`

                          選用。若權杖已在回應中出現，套用於下一個權杖 logprobs 的存在懲罰。此懲罰為二元的開／關，不取決於權杖被使用的次數（第一次之後）。若需要隨每次使用而增加的懲罰，請使用 frequency_penalty。正懲罰會抑制使用已在回應中用過的權杖，增加詞彙量。負懲罰會鼓勵使用已在回應中用過的權杖，減少詞彙量。

                          **frequencyPenalty**: `number`

                          選用。套用於下一個權杖 logprobs 的頻率懲罰，乘以每個權杖迄今在回應中出現的次數。正懲罰會依權杖被使用的次數比例抑制使用已用過的權杖：權杖用得越多，模型再次使用該權杖就越困難，從而增加回應的詞彙量。注意：*負*懲罰會依權杖被使用的次數比例鼓勵模型重複使用權杖。小的負值會減少回應的詞彙量。較大的負值會使模型開始重複一個常見權杖，直到達到 max_output_tokens 上限。

                          **responseLogprobs**: `boolean`

                          選用。若為 true，在回應中匯出 logprobs 結果。

                          **logprobs**: `integer`

                          選用。僅在 response_logprobs=True 時有效。這會設定在每個解碼步驟要於 Candidate.logprobs_result 中回傳的頂尖 logprobs 數量（包含所選候選）。數字必須在 [0, 20] 範圍內。

                          **enableEnhancedCivicAnswers**: `boolean`

                          選用。啟用強化公民答案。它可能不適用於所有模型。



                        ??? note "**responseModalities**: `string enum array` 選用。請求的回應模態。表示模型可回傳、且應在回應中預期出現的模態集合。這與回應的模態完全相符。一個模型可能有多種支援模態的組合。若請求的模態與任何支援的組合都不相符，將回傳錯誤。空清單等同於僅請求文字。"

                            可能的值：

                            - `MODALITY_UNSPECIFIED`：預設值。
                            - `TEXT`：表示模型應回傳文字。
                            - `IMAGE`：表示模型應回傳圖片。
                            - `AUDIO`：表示模型應回傳音訊。





                        ??? note "**speechConfig**: `SpeechConfig` 選用。語音生成設定。"

                            ??? note "**voiceConfig**: `VoiceConfig` 單一語音輸出情況下的設定。"

                                ??? note "**voiceConfig**: `Union type` 要使用的說話者設定。"

                                      聯合欄位 `voiceConfig` 只能是下列其中之一：



                                    ??? note "**prebuiltVoiceConfig**: `PrebuiltVoiceConfig` 要使用的預建語音設定。"

                                        **voiceName**: `string`

                                        選用。要使用的預設語音名稱。



                                      **voice**: `string`

                                      選用。用於合成的說話者識別符。支援的格式：

                                      - 預建語音的說話者名稱（例如 `Orus` 或 `Kore`）。
                                      - 已儲存語音的語音 ID（例如 `voice_xxx`）。
                                      - 語音複製金鑰（例如 `voicekey_xxx`）。





                            ??? note "**multiSpeakerVoiceConfig**: `MultiSpeakerVoiceConfig` 選用。多說話者設定的設定。它與 voice_config 欄位互斥。"

                                ??? note "**speakerVoiceConfigs**: required `SpeakerVoiceConfig array` 所有已啟用的說話者語音。"

                                      **speaker**: required `string`

                                      要使用的說話者名稱。應與提示詞中的名稱相同。



                                    ??? note "**voiceConfig**: required `VoiceConfig` 要使用的語音設定。"

                                        ??? note "**voiceConfig**: `Union type` 要使用的說話者設定。"

                                              聯合欄位 `voiceConfig` 只能是下列其中之一：



                                            ??? note "**prebuiltVoiceConfig**: `PrebuiltVoiceConfig` 要使用的預建語音設定。"

                                                **voiceName**: `string`

                                                選用。要使用的預設語音名稱。



                                              **voice**: `string`

                                              選用。用於合成的說話者識別符。支援的格式：

                                              - 預建語音的說話者名稱（例如 `Orus` 或 `Kore`）。
                                              - 已儲存語音的語音 ID（例如 `voice_xxx`）。
                                              - 語音複製金鑰（例如 `voicekey_xxx`）。



                              **languageCode**: `string`

                              選用。使用者將應用程式設定為使用的 IETF [BCP-47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) 語言代碼。用於語音辨識與合成。有效值為：`de-DE`、`en-AU`、`en-GB`、`en-IN`、`en-US`、`es-US`、`fr-FR`、`hi-IN`、`pt-BR`、`ar-XA`、`es-ES`、`fr-CA`、`id-ID`、`it-IT`、`ja-JP`、`tr-TR`、`vi-VN`、`bn-IN`、`gu-IN`、`kn-IN`、`ml-IN`、`mr-IN`、`ta-IN`、`te-IN`、`nl-NL`、`ko-KR`、`cmn-CN`、`pl-PL`、`ru-RU` 與 `th-TH`。





                        ??? note "**thinkingConfig**: `ThinkingConfig` 選用。思考功能的設定。若為不支援思考的模型設定此欄位，將回傳錯誤。"

                              **includeThoughts**: `boolean`

                              表示是否在回應中包含思考內容。若為 true，僅在思考內容可用時回傳。

                              **thinkingBudget**: `integer`

                              模型應生成的思考權杖數量。



                            ??? note "**thinkingLevel**: `string enum` 選用。控制模型在產生回應之前，內部推理程序的最大深度。預設值依模型而定。更多詳細資訊請參閱 [思考等級指南](/docs/thinking/#thinking-levels)。建議用於 Gemini 3 或更新的模型。與較早的模型搭配使用會導致錯誤。"

                                可能的值：

                                - `THINKING_LEVEL_UNSPECIFIED`：預設值。
                                - `MINIMAL`：幾乎不思考。
                                - `LOW`：低思考等級。
                                - `MEDIUM`：中思考等級。
                                - `HIGH`：高思考等級。
                                - `XHIGH`：超高思考等級。





                        ??? note "**imageConfig**: `ImageConfig` 選用。圖片生成的設定。若為不支援這些設定選項的模型設定此欄位，將回傳錯誤。"

                            **aspectRatio**: `string`

                            選用。要生成之圖片的長寬比。支援的長寬比：`1:1`、`1:4`、`4:1`、`1:8`、`8:1`、`2:3`、`3:2`、`3:4`、`4:3`、`4:5`、`5:4`、`9:16`、`16:9` 或 `21:9`。若未指定，模型會依所提供的任何參照圖片選擇預設長寬比。

                            **imageSize**: `string`

                            選用。指定生成圖片的大小。支援的值為 `512`、`1K`、`2K`、`4K`。若未指定，模型會使用預設值 `1K`。





                        ??? note "**mediaResolution**: `string enum` 選用。若有指定，將使用指定的媒體解析度。"

                            可能的值：

                            - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                            - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低（64 個權杖）。
                            - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中（256 個權杖）。
                            - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高（以 256 個權杖放大重新取景）。



                          **enableAffectiveDialog**: `boolean`

                          選用。若啟用，模型會偵測情緒並相應調整其回應。



                        ??? note "**responseFormat**: `ResponseFormatConfig` 選用。回應輸出格式的設定。允許以扁平結構為每個模態（文字、音訊、圖片）指定輸出設定。"

                            ??? note "**text**: `TextResponseFormat` 選用。文字輸出格式設定。"

                                ??? note "**mimeType**: `string enum` 選用。文字輸出的 MIME 類型。"

                                    可能的值：

                                    - `MIME_TYPE_UNSPECIFIED`：預設值。此值未使用。
                                    - `APPLICATION_JSON`：JSON 輸出格式。
                                    - `TEXT_PLAIN`：純文字輸出格式。



                                  **schema**: `object`

                                  選用。輸出應符合的 JSON schema。僅在 mime_type 為 APPLICATION_JSON 時適用。





                            ??? note "**audio**: `AudioResponseFormat` 選用。音訊輸出格式設定。"

                                ??? note "**mimeType**: `string enum` 選用。音訊輸出的 MIME 類型。"

                                    可能的值：

                                    - `MIME_TYPE_UNSPECIFIED`：預設值。此值未使用。
                                    - `AUDIO_MP3`：MP3 音訊格式。
                                    - `AUDIO_OGG_OPUS`：OGG Opus 音訊格式。
                                    - `AUDIO_L16`：原始 PCM（L16）音訊格式。
                                    - `AUDIO_WAV`：WAV 音訊格式。
                                    - `AUDIO_ALAW`：A-law 音訊格式。
                                    - `AUDIO_MULAW`：Mu-law 音訊格式。





                                ??? note "**delivery**: `string enum` 選用。音訊輸出的傳遞模式。"

                                    可能的值：

                                    - `DELIVERY_UNSPECIFIED`：預設值。此值未使用。
                                    - `INLINE`：音訊資料在回應中內嵌回傳。
                                    - `URI`：音訊資料以 URI 形式回傳。



                                  **sampleRate**: `integer`

                                  選用。取樣率，單位為 Hz。

                                  **bitRate**: `integer`

                                  選用。位元率，單位為每秒位元數（bps）。僅適用於壓縮格式（MP3、Opus）。





                            ??? note "**image**: `ImageResponseFormat` 選用。圖片輸出格式設定。"

                                ??? note "**mimeType**: `string enum` 選用。圖片輸出的 MIME 類型。"

                                    可能的值：

                                    - `MIME_TYPE_UNSPECIFIED`：預設值。此值未使用。
                                    - `IMAGE_JPEG`：JPEG 圖片格式。





                                ??? note "**delivery**: `string enum` 選用。圖片輸出的傳遞模式。"

                                    可能的值：

                                    - `DELIVERY_UNSPECIFIED`：預設值。此值未使用。
                                    - `INLINE`：圖片資料在回應中內嵌回傳。
                                    - `URI`：圖片資料以 URI 形式回傳。





                                ??? note "**aspectRatio**: `string enum` 選用。圖片輸出的長寬比。"

                                    可能的值：

                                    - `ASPECT_RATIO_UNSPECIFIED`：預設值。此值未使用。
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





                                ??? note "**imageSize**: `string enum` 選用。圖片輸出的大小。"

                                    可能的值：

                                    - `IMAGE_SIZE_UNSPECIFIED`：預設值。此值未使用。
                                    - `IMAGE_SIZE_FIVE_TWELVE`：512px 圖片大小。
                                    - `IMAGE_SIZE_ONE_K`：1K 圖片大小。
                                    - `IMAGE_SIZE_TWO_K`：2K 圖片大小。
                                    - `IMAGE_SIZE_FOUR_K`：4K 圖片大小。





                        ??? note "**translationConfig**: `TranslationConfig` 選用。翻譯的設定。"

                            **targetLanguageCode**: required `string`

                            翻譯的目標語言。支援的值為 BCP-47 語言代碼（例如 "en"、"es"、"fr"）。

                            **echoTargetLanguage**: `boolean`

                            選用。若為 true，當目標語言被說出時，模型會生成音訊，基本上是鸚鵡學舌般重複輸入。若為 false，我們不會為目標語言產生音訊。





                        ??? note "**audioTranscriptionConfig**: `AudioTranscriptionConfig` 選用。音訊轉錄（語音辨識）的設定。"

                              **languageCodes**: `string array`

                              選用。BCP-47 語言代碼，提供音訊中出現之語言的提示。若省略或為空，預設為自動語言偵測。

                              **customVocabulary**: `string array`

                              選用。自訂詞彙片語清單，用來使語音辨識模型偏向辨識特定詞彙（產品名稱、專有名詞、術語）。

                              **wordTimestamp**: `boolean`

                              選用。設定單字級時間戳記的生成。

                              **diarization**: `boolean`

                              選用。設定說話者分離。

                              **sourceText**: `string`

                              選用。要透過語音指令編輯或改寫的來源文字。在 `SMART` 模式下提供時，模型會以此文字評估音訊輸入，並在候選回應中發出完整的替代文字，而不是附加於其後。



                            ??? note "**mode**: `string enum` 選用。設定轉錄模式。支援的值：`VERBATIM`、`SMART`。若未指定，預設為 `VERBATIM` 轉錄。在 `SMART` 模式下，模型會執行不流暢內容移除（消除填充詞、重複與假開頭）、輕度文法清理、自動格式化（段落、項目符號、編號清單），以及輕微的使用者編輯（行內自我修正）。時間戳記與語者分離與 `SMART` 模式不相容。"

                                可能的值：

                                - `MODE_UNSPECIFIED`：未指定的轉錄模式。
                                - `VERBATIM`：逐字轉錄模式。
                                - `SMART`：智慧轉錄模式。



                      **cachedContent**: `string`

                      選用。要用作預測上下文之內容 [快取](/docs/caching/) 的名稱。格式：`cachedContents/{cachedContent}`



                    ??? note "**serviceTier**: [`ServiceTier`](/api-reference/batch-api/batch-generate-content/#Resource:ServiceTier) 選用。請求的服務層級。"

                        可能的值：

                        - `unspecified`：預設服務層級，即標準層級。
                        - `standard`：標準服務層級。
                        - `flex`：Flex 服務層級。
                        - `priority`：優先服務層級。



                      **store**: `boolean`

                      選用。設定給定請求的記錄行為。若有設定，其優先順序高於專案層級的記錄設定。

                      **continuationToken**: `string`

                      選用。不透明的接續權杖，用來從先前的 `GenerateContent` 或 `StreamGenerateContent` 回應恢復生成，該回應先前以 `finish_reason` 設為 `CONTINUATION` 而停止。請注意，當請求中提供接續權杖時，`contents` 為必填，且必須與初始請求的提示詞與對話記錄完全相同。

                      **labels**: `object`

                      選用。帶有使用者定義中繼資料的請求標籤。選用。標籤必須遵循標準的統一 Cloud 標籤要求：

                      - 標籤鍵必須以字母開頭。
                      - 標籤鍵與值的長度不得超過 63 個字元（Unicode 碼點），且僅能包含小寫字母、數字字元、底線與連字號。
                      - 允許國際字元。

                      用法：

                      - 來自聚合器的安全識別符：使用鍵 `safety_identifier`（例如 `{"safety_identifier": "user_session_123"}`）



                  **metadata**: `object`

                  選用。要與請求關聯的中繼資料。



  

---


  **name**: `string`

  僅供輸出。識別符。批次的資源名稱。格式：`batches/{batch_id}`。

  

---


  

??? note "**output**: `GenerateContentBatchOutput` 僅供輸出。批次請求的輸出。"

    ??? note "**output**: `Union type` 批次請求的輸出。"

          聯合欄位 `output` 只能是下列其中之一：

          **responsesFile**: `string`

          僅供輸出。包含回應之檔案的檔案 ID。該檔案為 JSONL 檔案，每行一個回應。回應將是 JSON 格式的 `GenerateContentResponse` 訊息。回應的寫入順序與輸入請求相同。



        ??? note "**inlinedResponses**: `InlinedResponses` 僅供輸出。批次中各請求的回應。當批次以內嵌請求建立時回傳。回應順序與輸入請求相同。"

            ??? note "**inlinedResponses**: `InlinedResponse array` 僅供輸出。批次中各請求的回應。"

                ??? note "**output**: `Union type` 請求的輸出。"

                      聯合欄位 `output` 只能是下列其中之一：



                    ??? note "**error**: `Status` 僅供輸出。處理請求時遇到的錯誤。"

                        **code**: `integer`

                        狀態碼，應為 google.rpc.Code 的列舉值。

                        **message**: `string`

                        面向開發人員的錯誤訊息，應以英文撰寫。任何面向使用者的錯誤訊息都應本地化，並透過 google.rpc.Status.details 欄位傳送，或由用戶端本地化。

                        **details**: `object array`

                        承載錯誤詳細資訊的訊息清單。API 可使用一組常見的訊息類型。





                    ??? note "**response**: `GenerateContentResponse` 僅供輸出。請求的回應。"

                        ??? note "**candidates**: `Candidate array` 模型提供的候選回應。"

                              **index**: `integer`

                              僅供輸出。候選項目在回應候選清單中的索引。



                            ??? note "**content**: `Content` 僅供輸出。模型回傳的生成內容。"

                                ??? note "**parts**: `Part array` 組成單一訊息的有序 `Parts`。各 Part 的 MIME 類型可能不同。"

                                    ??? note "**data**: `Union type`"

                                          聯合欄位 `data` 只能是下列其中之一：

                                          **text**: `string`

                                          內嵌文字。



                                        ??? note "**inlineData**: `Blob` 內嵌媒體位元組。"

                                            **mimeType**: `string`

                                            來源資料的 IANA 標準 MIME 類型。支援的類型範例：

                                            - 圖片：image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
                                            - 音訊：audio/*, video/audio/s16le, video/audio/wav
                                            - 影片：video/*
                                            - 文字：text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
                                            - 應用程式：application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf 其他背景資訊請參閱 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                            **data**: `string`

                                            媒體格式的原始位元組。

                                            **displayName**: `string`

                                            選用。指定用來向模型指稱此 blob 的名稱（例如 "my_blob.png"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 參照識別符使用。





                                        ??? note "**functionCall**: `FunctionCall` 模型回傳的預測 `FunctionCall`，其中包含一個表示 `FunctionDeclaration.name` 的字串，以及其引數與值。"

                                            **name**: required `string`

                                            要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                                            **id**: `string`

                                            選用。函式呼叫的唯一識別符。若有填入，用戶端會執行 `function_call`，並回傳 `id` 相符的回應。

                                            **args**: `object`

                                            選用。函式參數與值，採 JSON 物件格式。





                                        ??? note "**functionResponse**: `FunctionResponse` `FunctionCall` 的結果輸出，其中包含一個表示 `FunctionDeclaration.name` 的字串，以及一個包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。"

                                              **name**: required `string`

                                              要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                                              **response**: required `object`

                                              函式回應，採 JSON 物件格式。呼叫端可使用任何符合函式語法的鍵來回傳函式輸出，例如 "output"、"result" 等。特別是當函式呼叫執行失敗時，回應可包含 "error" 鍵，將錯誤詳細資訊回傳給模型。多媒體內容可透過子物件納入，該子物件包含單一 "$ref" 鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，即持有該多媒體之 `FunctionResponsePart` 的對應名稱。請參閱 [多模態函式回應](/docs/function-calling/#multimodal)。

                                              **id**: `string`

                                              選用。此回應所對應函式呼叫的識別符。由用戶端填入，以對應相對應的函式呼叫 `id`。



                                            ??? note "**parts**: `FunctionResponsePart array` 選用。組成函式回應的有序 `Parts`。各 Part 的 IANA MIME 類型可能不同。"

                                                ??? note "**data**: `Union type` 函式回應部分的資料。"

                                                      聯合欄位 `data` 只能是下列其中之一：



                                                    ??? note "**inlineData**: `FunctionResponseBlob` 內嵌媒體位元組。"

                                                        **mimeType**: `string`

                                                        來源資料的 IANA 標準 MIME 類型。範例：

                                                        - image/png
                                                        - image/jpeg

                                                        若提供不支援的 MIME 類型，將回傳錯誤。完整支援類型清單請參閱 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                                        **data**: `string`

                                                        媒體格式的原始位元組。

                                                        **displayName**: `string`

                                                        選用。blob 的顯示名稱。用來提供標籤或檔名以區分各 blob，並可從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                                    ??? note "**fileData**: `FunctionResponseFileData` 以 URI 為基礎的資料。"

                                                        **fileUri**: required `string`

                                                        URI。

                                                        **mimeType**: `string`

                                                        來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將回傳錯誤。完整支援類型清單請參閱 [多模態函式回應](/docs/function-calling/#multimodal) 與 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                                        **displayName**: `string`

                                                        選用。檔案的顯示名稱。用來提供標籤或檔名以區分檔案資料，並可從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                                ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以進行理解。僅對影片部分有意義（`inline_data` 或具影片 mime 類型的 `file_data`）。非影片部分會忽略此欄位。"

                                                    可能的值：

                                                    - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
                                                    - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
                                                    - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。



                                              **willContinue**: `boolean`

                                              選用。表示函式呼叫將繼續，且會回傳更多回應，使函式呼叫成為產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，後續回應將不予考慮。允許回傳空的 `response` 並搭配 `will_continue=False`，以表示函式呼叫已完成。這仍可能觸發模型生成。若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。



                                            ??? note "**scheduling**: `string enum` 選用。指定回應在對話中應如何排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。"

                                                可能的值：

                                                - `SCHEDULING_UNSPECIFIED`：此值未使用。
                                                - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發生成。
                                                - `WHEN_IDLE`：將結果加入對話上下文，並提示生成輸出，但不中斷進行中的生成。
                                                - `INTERRUPT`：將結果加入對話上下文，中斷進行中的生成，並提示生成輸出。





                                        ??? note "**fileData**: `FileData` 以 URI 為基礎的資料。"

                                            **fileUri**: required `string`

                                            URI。

                                            **mimeType**: `string`

                                            選用。來源資料的 IANA 標準 MIME 類型。

                                            **displayName**: `string`

                                            選用。指定用來向模型指稱此檔案的名稱（例如 "my_file.pdf"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案參照識別符使用。





                                        ??? note "**executableCode**: `ExecutableCode` 模型生成的程式碼，預期將被執行。"

                                            ??? note "**language**: required `string enum` `code` 的程式語言。"

                                                可能的值：

                                                - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用此值。
                                                - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 為預設語言。



                                              **code**: required `string`

                                              要執行的程式碼。

                                              **id**: `string`

                                              選用。`ExecutableCode` 部分的唯一識別符。伺服器會回傳 `CodeExecutionResult`，其 `id` 與之相符。





                                        ??? note "**codeExecutionResult**: `CodeExecutionResult` 執行 `ExecutableCode` 的結果。"

                                            ??? note "**outcome**: required `string enum` 程式碼執行的結果狀態。"

                                                可能的值：

                                                - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用此值。
                                                - `OUTCOME_OK`：程式碼執行成功完成。若有 stdout，`output` 包含其內容。
                                                - `OUTCOME_FAILED`：程式碼執行失敗。若有 stderr 與 stdout，`output` 包含其內容。
                                                - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已被取消。`output` 可能有、也可能沒有部分內容。



                                              **id**: `string`

                                              選用。此結果所對應 `ExecutableCode` 部分的識別符。僅在對應的 `ExecutableCode` 具有 id 時才填入。

                                              **output**: `string`

                                              選用。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。





                                        ??? note "**toolCall**: `ToolCall` 伺服器端工具呼叫。當模型預測應在伺服器上執行的工具叫用時，會填入此欄位。用戶端應將此訊息原樣回傳給 API。"

                                            ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型。"

                                                可能的值：

                                                - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                                - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                                - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                                - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                                - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                                - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                                - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                              **id**: `string`

                                              選用。工具呼叫的唯一識別符。伺服器會回傳帶有相符 `id` 的工具回應。

                                              **toolName**: `string`

                                              選用。被呼叫的工具名稱。

                                              **args**: `object`

                                              選用。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





                                        ??? note "**toolResponse**: `ToolResponse` 伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端填入執行對應 `ToolCall` 的結果。"

                                            ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型，與對應的 `tool_type`（位於對應的 `ToolCall` 中）相符。"

                                                可能的值：

                                                - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                                - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                                - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                                - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                                - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                                - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                                - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                              **id**: `string`

                                              選用。此回應所對應工具呼叫的識別符。

                                              **response**: `object`

                                              選用。工具回應。





                                    ??? note "**metadata**: `Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定此項，以設定每個部分的靜態媒體預處理。"

                                          聯合欄位 `metadata` 只能是下列其中之一：



                                        ??? note "**videoMetadata**: `VideoMetadata` 選用。影片中繼資料。中繼資料僅應在影片資料以 inline_data 或 file_data 呈現時指定。"

                                            **startOffset**: `string`

                                            選用。影片的開始偏移。

                                            **endOffset**: `string`

                                            選用。影片的結束偏移。

                                            **fps**: `number`

                                            選用。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。



                                      **thought**: `boolean`

                                      選用。表示該部分是否為模型的思考內容。

                                      **thoughtSignature**: `string`

                                      選用。思考內容的不透明簽章，以便在後續請求中重複使用。

                                      **partMetadata**: `object`

                                      與 Part 關聯的自訂中繼資料。使用 genai.Part 作為內容表示法的代理，可能需要追蹤額外資訊。例如，它可以是 Part 來源檔案或出處的名稱，或是多工處理多個 Part 串流的方式。



                                    ??? note "**mediaResolution**: `V1mainMediaResolution` 選用。輸入媒體的媒體解析度。"

                                        ??? note "**value**: `Union type` 媒體解析度等級。"

                                              聯合欄位 `value` 只能是下列其中之一：



                                            ??? note "**level**: `string enum` 給定媒體所使用的權杖化品質。供 Gemini API 支援使用。"

                                                可能的值：

                                                - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                                                - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低。
                                                - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中。
                                                - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高。
                                                - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設為超高。





                                    ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以進行理解。僅對影片部分有意義（`inline_data` 或具影片 mime 類型的 `file_data`）。非影片部分會忽略此欄位。"

                                        可能的值：

                                        - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
                                        - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
                                        - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。





                                    ??? note "**audioTranscription**: `AudioTranscription` 選用。音訊（輸入或輸出）轉錄。僅在此 Part 包含音訊資料時設定。"

                                          **text**: required `string`

                                          此音訊片段的轉錄文字。

                                          **speakerLabel**: `string`

                                          選用。標示此音訊片段說話者的標籤（例如 "spk_1"、"spk_2"）。在設定語者分離時出現。



                                        ??? note "**words**: `WordInfo array` 選用。詳細的單字級轉錄與時間資訊。在設定 word_timestamp 時出現。"

                                            **word**: required `string`

                                            單字的轉錄內容。

                                            **startOffset**: `string`

                                            選用。單字相對於音訊開頭的開始時間偏移。

                                            **endOffset**: `string`

                                            選用。單字相對於音訊開頭的結束時間偏移。





                                    ??? note "**speechMetadata**: `SpeechMetadata` 選用。套用於文字部分的中繼資料，用來客製化其朗讀或合成方式，例如指定說話者身分或說話風格。"

                                        **speaker**: `string`

                                        選用。選填的說話者名稱，用於多說話者合成。

                                        **style**: `string`

                                        選用。選填的風格指令，用於語音合成。



                                  **role**: `string`

                                  選用。內容的產生者。必須為 'user' 或 'model'。在多輪對話中設定很有用，其他情況可留空或不設定。





                            ??? note "**finishReason**: `string enum` 選用。僅供輸出。模型停止生成權杖的原因。若為空，表示模型尚未停止生成權杖。"

                                可能的值：

                                - `FINISH_REASON_UNSPECIFIED`：預設值。此值未使用。
                                - `STOP`：模型的自然停止點，或所提供的停止序列。
                                - `MAX_TOKENS`：已達請求中指定的權杖數量上限。
                                - `SAFETY`：回應候選內容因安全因素被標記。
                                - `RECITATION`：回應候選內容因引述因素被標記。
                                - `LANGUAGE`：回應候選內容因使用不支援的語言被標記。
                                - `OTHER`：未知原因。
                                - `BLOCKLIST`：權杖生成因內容包含禁用詞彙而停止。
                                - `PROHIBITED_CONTENT`：權杖生成因可能包含禁止內容而停止。
                                - `SPII`：權杖生成因內容可能包含敏感個人識別資訊（SPII）而停止。
                                - `MALFORMED_FUNCTION_CALL`：模型生成的函式呼叫無效。
                                - `IMAGE_SAFETY`：權杖生成因生成的圖片包含安全違規而停止。
                                - `IMAGE_PROHIBITED_CONTENT`：圖片生成因生成的圖片含有其他禁止內容而停止。
                                - `IMAGE_OTHER`：圖片生成因其他雜項問題而停止。
                                - `NO_IMAGE`：模型預期會生成圖片，但未生成任何圖片。
                                - `IMAGE_RECITATION`：圖片生成因引述而停止。
                                - `UNEXPECTED_TOOL_CALL`：模型生成了工具呼叫，但請求中未啟用任何工具。
                                - `TOO_MANY_TOOL_CALLS`：模型連續呼叫過多工具，系統因此退出執行。
                                - `MISSING_THOUGHT_SIGNATURE`：請求至少缺少一個思考簽章。
                                - `MALFORMED_RESPONSE`：因回應格式錯誤而結束。
                                - `ESCALATION`：請求被升級規則篩除。
                                - `PUP_LIMITED_DISABLED`：表示權杖生成因使用者帳號違反禁止使用政策（PUP）而受限或停用，因而停止。
                                - `CONTINUATION`：權杖生成因回應已達單次請求的權杖上限而停止，但生成尚未完成。可透過後續請求使用回傳的 `continuation_token` 繼續模型回應。請注意，`max_output_tokens` 在多次接續跳轉之間為累計值，必須單調遞增或省略。



                              **finishMessage**: `string`

                              選用。僅供輸出。詳細說明模型停止生成權杖的原因。僅在 `finish_reason` 已設定時填入。



                            ??? note "**safetyRatings**: `SafetyRating array` 回應候選的安全性評等清單。每個類別最多有一個評等。"

                                ??? note "**category**: required `HarmCategory` 此評等的類別。"

                                    可能的值：

                                    - `HARM_CATEGORY_UNSPECIFIED`：未指定類別。
                                    - `HARM_CATEGORY_HARASSMENT`：**Gemini** - 騷擾內容。
                                    - `HARM_CATEGORY_HATE_SPEECH`：**Gemini** - 仇恨言論及內容。
                                    - `HARM_CATEGORY_SEXUALLY_EXPLICIT`：**Gemini** - 性露骨內容。
                                    - `HARM_CATEGORY_DANGEROUS_CONTENT`：**Gemini** - 危險內容。
                                    - `HARM_CATEGORY_JAILBREAK`：**Gemini** - 試圖繞過或顛覆模型安全準則的提示詞（越獄嘗試）。





                                ??? note "**probability**: required `string enum` 此內容造成危害的機率。"

                                    可能的值：

                                    - `HARM_PROBABILITY_UNSPECIFIED`：未指定機率。
                                    - `NEGLIGIBLE`：內容不安全的可能性微乎其微。
                                    - `LOW`：內容不安全的可能性低。
                                    - `MEDIUM`：內容不安全的可能性中等。
                                    - `HIGH`：內容不安全的可能性高。



                                  **blocked**: `boolean`

                                  此內容是否因這項評等而被封鎖？





                            ??? note "**citationMetadata**: `CitationMetadata` 僅供輸出。模型生成候選的引註資訊。此欄位可能填入 `content` 中任何文字的引述資訊。這些是從基礎 LLM 訓練資料中的受版權保護素材「引述」的段落。"

                                ??? note "**citationSources**: `CitationSource array` 特定回應的來源引註。"

                                    **startIndex**: `integer`

                                    選用。歸因於此來源之回應片段的起始位置。索引表示片段的起點，以位元組計。

                                    **endIndex**: `integer`

                                    選用。歸因片段的結束位置，不含該位置。

                                    **uri**: `string`

                                    選用。被歸因為某段文字來源的 URI。

                                    **license**: `string`

                                    選用。被歸因為片段來源之 GitHub 專案的授權。程式碼引註必須提供授權資訊。



                              **tokenCount**: `integer`

                              僅供輸出。此候選的權杖數量。



                            ??? note "**groundingAttributions**: `GroundingAttribution array` 僅供輸出。有助於形成接地答案之來源的歸因資訊。此欄位在 `GenerateAnswer` 呼叫時填入。"

                                ??? note "**sourceId**: `AttributionSourceId` 僅供輸出。有助於此歸因之來源的識別符。"

                                    ??? note "**source**: `Union type`"

                                          聯合欄位 `source` 只能是下列其中之一：



                                        ??? note "**groundingPassage**: `GroundingPassageId` 內嵌段落的識別符。"

                                            **passageId**: `string`

                                            僅供輸出。與 `GenerateAnswerRequest` 的 `GroundingPassage.id` 相符的段落 ID。

                                            **partIndex**: `integer`

                                            僅供輸出。該部分在 `GenerateAnswerRequest` 的 `GroundingPassage.content` 中的索引。





                                        ??? note "**semanticRetrieverChunk**: `SemanticRetrieverChunk` 透過 Semantic Retriever 擷取之 `Chunk` 的識別符。"

                                            **source**: `string`

                                            僅供輸出。與請求的 `SemanticRetrieverConfig.source` 相符的來源名稱。範例：`corpora/123` 或 `corpora/123/documents/abc`

                                            **chunk**: `string`

                                            僅供輸出。包含歸因文字之 `Chunk` 的名稱。範例：`corpora/123/documents/abc/chunks/xyz`





                                ??? note "**content**: `Content` 組成此歸因的接地來源內容。"

                                    ??? note "**parts**: `Part array` 組成單一訊息的有序 `Parts`。各 Part 的 MIME 類型可能不同。"

                                        ??? note "**data**: `Union type`"

                                              聯合欄位 `data` 只能是下列其中之一：

                                              **text**: `string`

                                              內嵌文字。



                                            ??? note "**inlineData**: `Blob` 內嵌媒體位元組。"

                                                **mimeType**: `string`

                                                來源資料的 IANA 標準 MIME 類型。支援的類型範例：

                                                - 圖片：image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
                                                - 音訊：audio/*, video/audio/s16le, video/audio/wav
                                                - 影片：video/*
                                                - 文字：text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
                                                - 應用程式：application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf 其他背景資訊請參閱 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                                **data**: `string`

                                                媒體格式的原始位元組。

                                                **displayName**: `string`

                                                選用。指定用來向模型指稱此 blob 的名稱（例如 "my_blob.png"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 參照識別符使用。





                                            ??? note "**functionCall**: `FunctionCall` 模型回傳的預測 `FunctionCall`，其中包含一個表示 `FunctionDeclaration.name` 的字串，以及其引數與值。"

                                                **name**: required `string`

                                                要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                                                **id**: `string`

                                                選用。函式呼叫的唯一識別符。若有填入，用戶端會執行 `function_call`，並回傳 `id` 相符的回應。

                                                **args**: `object`

                                                選用。函式參數與值，採 JSON 物件格式。





                                            ??? note "**functionResponse**: `FunctionResponse` `FunctionCall` 的結果輸出，其中包含一個表示 `FunctionDeclaration.name` 的字串，以及一個包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。"

                                                  **name**: required `string`

                                                  要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                                                  **response**: required `object`

                                                  函式回應，採 JSON 物件格式。呼叫端可使用任何符合函式語法的鍵來回傳函式輸出，例如 "output"、"result" 等。特別是當函式呼叫執行失敗時，回應可包含 "error" 鍵，將錯誤詳細資訊回傳給模型。多媒體內容可透過子物件納入，該子物件包含單一 "$ref" 鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，即持有該多媒體之 `FunctionResponsePart` 的對應名稱。請參閱 [多模態函式回應](/docs/function-calling/#multimodal)。

                                                  **id**: `string`

                                                  選用。此回應所對應函式呼叫的識別符。由用戶端填入，以對應相對應的函式呼叫 `id`。



                                                ??? note "**parts**: `FunctionResponsePart array` 選用。組成函式回應的有序 `Parts`。各 Part 的 IANA MIME 類型可能不同。"

                                                    ??? note "**data**: `Union type` 函式回應部分的資料。"

                                                          聯合欄位 `data` 只能是下列其中之一：



                                                        ??? note "**inlineData**: `FunctionResponseBlob` 內嵌媒體位元組。"

                                                            **mimeType**: `string`

                                                            來源資料的 IANA 標準 MIME 類型。範例：

                                                            - image/png
                                                            - image/jpeg

                                                            若提供不支援的 MIME 類型，將回傳錯誤。完整支援類型清單請參閱 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                                            **data**: `string`

                                                            媒體格式的原始位元組。

                                                            **displayName**: `string`

                                                            選用。blob 的顯示名稱。用來提供標籤或檔名以區分各 blob，並可從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                                        ??? note "**fileData**: `FunctionResponseFileData` 以 URI 為基礎的資料。"

                                                            **fileUri**: required `string`

                                                            URI。

                                                            **mimeType**: `string`

                                                            來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將回傳錯誤。完整支援類型清單請參閱 [多模態函式回應](/docs/function-calling/#multimodal) 與 [支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                                                            **displayName**: `string`

                                                            選用。檔案的顯示名稱。用來提供標籤或檔名以區分檔案資料，並可從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                                                    ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以進行理解。僅對影片部分有意義（`inline_data` 或具影片 mime 類型的 `file_data`）。非影片部分會忽略此欄位。"

                                                        可能的值：

                                                        - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
                                                        - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
                                                        - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。



                                                  **willContinue**: `boolean`

                                                  選用。表示函式呼叫將繼續，且會回傳更多回應，使函式呼叫成為產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，後續回應將不予考慮。允許回傳空的 `response` 並搭配 `will_continue=False`，以表示函式呼叫已完成。這仍可能觸發模型生成。若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。



                                                ??? note "**scheduling**: `string enum` 選用。指定回應在對話中應如何排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。"

                                                    可能的值：

                                                    - `SCHEDULING_UNSPECIFIED`：此值未使用。
                                                    - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發生成。
                                                    - `WHEN_IDLE`：將結果加入對話上下文，並提示生成輸出，但不中斷進行中的生成。
                                                    - `INTERRUPT`：將結果加入對話上下文，中斷進行中的生成，並提示生成輸出。





                                            ??? note "**fileData**: `FileData` 以 URI 為基礎的資料。"

                                                **fileUri**: required `string`

                                                URI。

                                                **mimeType**: `string`

                                                選用。來源資料的 IANA 標準 MIME 類型。

                                                **displayName**: `string`

                                                選用。指定用來向模型指稱此檔案的名稱（例如 "my_file.pdf"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案參照識別符使用。





                                            ??? note "**executableCode**: `ExecutableCode` 模型生成的程式碼，預期將被執行。"

                                                ??? note "**language**: required `string enum` `code` 的程式語言。"

                                                    可能的值：

                                                    - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用此值。
                                                    - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 為預設語言。



                                                  **code**: required `string`

                                                  要執行的程式碼。

                                                  **id**: `string`

                                                  選用。`ExecutableCode` 部分的唯一識別符。伺服器會回傳 `CodeExecutionResult`，其 `id` 與之相符。





                                            ??? note "**codeExecutionResult**: `CodeExecutionResult` 執行 `ExecutableCode` 的結果。"

                                                ??? note "**outcome**: required `string enum` 程式碼執行的結果狀態。"

                                                    可能的值：

                                                    - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用此值。
                                                    - `OUTCOME_OK`：程式碼執行成功完成。若有 stdout，`output` 包含其內容。
                                                    - `OUTCOME_FAILED`：程式碼執行失敗。若有 stderr 與 stdout，`output` 包含其內容。
                                                    - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已被取消。`output` 可能有、也可能沒有部分內容。



                                                  **id**: `string`

                                                  選用。此結果所對應 `ExecutableCode` 部分的識別符。僅在對應的 `ExecutableCode` 具有 id 時才填入。

                                                  **output**: `string`

                                                  選用。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。





                                            ??? note "**toolCall**: `ToolCall` 伺服器端工具呼叫。當模型預測應在伺服器上執行的工具叫用時，會填入此欄位。用戶端應將此訊息原樣回傳給 API。"

                                                ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型。"

                                                    可能的值：

                                                    - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                                    - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                                    - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                                    - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                                    - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                                    - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                                    - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                                  **id**: `string`

                                                  選用。工具呼叫的唯一識別符。伺服器會回傳帶有相符 `id` 的工具回應。

                                                  **toolName**: `string`

                                                  選用。被呼叫的工具名稱。

                                                  **args**: `object`

                                                  選用。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





                                            ??? note "**toolResponse**: `ToolResponse` 伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端填入執行對應 `ToolCall` 的結果。"

                                                ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型，與對應的 `tool_type`（位於對應的 `ToolCall` 中）相符。"

                                                    可能的值：

                                                    - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                                                    - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                                                    - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                                                    - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                                                    - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                                                    - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                                                    - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



                                                  **id**: `string`

                                                  選用。此回應所對應工具呼叫的識別符。

                                                  **response**: `object`

                                                  選用。工具回應。





                                        ??? note "**metadata**: `Union type` 控制資料的額外預處理。當 `inline_data` 或 `file_data` 存在時設定此項，以設定每個部分的靜態媒體預處理。"

                                              聯合欄位 `metadata` 只能是下列其中之一：



                                            ??? note "**videoMetadata**: `VideoMetadata` 選用。影片中繼資料。中繼資料僅應在影片資料以 inline_data 或 file_data 呈現時指定。"

                                                **startOffset**: `string`

                                                選用。影片的開始偏移。

                                                **endOffset**: `string`

                                                選用。影片的結束偏移。

                                                **fps**: `number`

                                                選用。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。



                                          **thought**: `boolean`

                                          選用。表示該部分是否為模型的思考內容。

                                          **thoughtSignature**: `string`

                                          選用。思考內容的不透明簽章，以便在後續請求中重複使用。

                                          **partMetadata**: `object`

                                          與 Part 關聯的自訂中繼資料。使用 genai.Part 作為內容表示法的代理，可能需要追蹤額外資訊。例如，它可以是 Part 來源檔案或出處的名稱，或是多工處理多個 Part 串流的方式。



                                        ??? note "**mediaResolution**: `V1mainMediaResolution` 選用。輸入媒體的媒體解析度。"

                                            ??? note "**value**: `Union type` 媒體解析度等級。"

                                                  聯合欄位 `value` 只能是下列其中之一：



                                                ??? note "**level**: `string enum` 給定媒體所使用的權杖化品質。供 Gemini API 支援使用。"

                                                    可能的值：

                                                    - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                                                    - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低。
                                                    - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中。
                                                    - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高。
                                                    - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設為超高。





                                        ??? note "**mediaProcessing**: `string enum` 選用。模型如何處理此部分的媒體以進行理解。僅對影片部分有意義（`inline_data` 或具影片 mime 類型的 `file_data`）。非影片部分會忽略此欄位。"

                                            可能的值：

                                            - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
                                            - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
                                            - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。





                                        ??? note "**audioTranscription**: `AudioTranscription` 選用。音訊（輸入或輸出）轉錄。僅在此 Part 包含音訊資料時設定。"

                                              **text**: required `string`

                                              此音訊片段的轉錄文字。

                                              **speakerLabel**: `string`

                                              選用。標示此音訊片段說話者的標籤（例如 "spk_1"、"spk_2"）。在設定語者分離時出現。



                                            ??? note "**words**: `WordInfo array` 選用。詳細的單字級轉錄與時間資訊。在設定 word_timestamp 時出現。"

                                                **word**: required `string`

                                                單字的轉錄內容。

                                                **startOffset**: `string`

                                                選用。單字相對於音訊開頭的開始時間偏移。

                                                **endOffset**: `string`

                                                選用。單字相對於音訊開頭的結束時間偏移。





                                        ??? note "**speechMetadata**: `SpeechMetadata` 選用。套用於文字部分的中繼資料，用來客製化其朗讀或合成方式，例如指定說話者身分或說話風格。"

                                            **speaker**: `string`

                                            選用。選填的說話者名稱，用於多說話者合成。

                                            **style**: `string`

                                            選用。選填的風格指令，用於語音合成。



                                      **role**: `string`

                                      選用。內容的產生者。必須為 'user' 或 'model'。在多輪對話中設定很有用，其他情況可留空或不設定。





                            ??? note "**groundingMetadata**: `GroundingMetadata` 僅供輸出。候選的接地中繼資料。此欄位在 `GenerateContent` 呼叫時填入。"

                                ??? note "**searchEntryPoint**: `SearchEntryPoint` 選用。供後續網路搜尋使用的 Google 搜尋條目。"

                                    **renderedContent**: `string`

                                    選用。可嵌入網頁或應用程式 webview 的網路內容摘要。

                                    **sdkBlob**: `string`

                                    選用。Base64 編碼的 JSON，表示 tuple 陣列。





                                ??? note "**groundingChunks**: `GroundingChunk array` 從指定接地來源擷取的佐證參照清單。串流時，這裡僅包含先前回應的接地中繼資料中尚未包含的接地區塊。"

                                    ??? note "**chunkType**: `Union type` 區塊類型。"

                                          聯合欄位 `chunkType` 只能是下列其中之一：



                                        ??? note "**web**: `Web` 來自網路的接地區塊。"

                                            **uri**: `string`

                                            僅供輸出。區塊的 URI 參照。

                                            **title**: `string`

                                            僅供輸出。區塊的標題。





                                        ??? note "**image**: `Image` 選用。來自圖片搜尋的接地區塊。"

                                            **sourceUri**: `string`

                                            用於歸因的網頁 URI。

                                            **imageUri**: `string`

                                            圖片素材 URL。

                                            **title**: `string`

                                            圖片來源網頁的標題。

                                            **domain**: `string`

                                            圖片來源網頁的根網域，例如 "example.com"。





                                        ??? note "**retrievedContext**: `RetrievedContext` 選用。來自檔案搜尋工具所擷取上下文的接地區塊。"

                                              **uri**: `string`

                                              選用。語意擷取文件的 URI 參照。

                                              **title**: `string`

                                              選用。文件的標題。

                                              **text**: `string`

                                              選用。區塊的文字。

                                              **fileSearchStore**: `string`

                                              選用。包含該文件之 `FileSearchStore` 的名稱。範例：`fileSearchStores/123`



                                            ??? note "**customMetadata**: `GroundingChunkCustomMetadata array` 選用。使用者提供的、關於擷取上下文的中繼資料。"

                                                ??? note "**value**: `Union type` 中繼資料的值。可以是字串、字串清單或數字。"

                                                      聯合欄位 `value` 只能是下列其中之一：

                                                      **stringValue**: `string`

                                                      選用。中繼資料的字串值。



                                                    ??? note "**stringListValue**: `GroundingChunkStringList` 選用。中繼資料的字串值清單。"

                                                        **values**: `string array`

                                                        清單中的字串值。



                                                      **numericValue**: `number`

                                                      選用。中繼資料的數值。此值的預期範圍取決於所使用的特定 `key`。



                                                  **key**: `string`

                                                  中繼資料的鍵。



                                              **pageNumber**: `integer`

                                              選用。擷取上下文的頁碼（如適用）。

                                              **mediaId**: `string`

                                              選用。多模態檔案搜尋結果的媒體 blob 資源名稱。格式：fileSearchStores/{file_search_store_id}/media/{blob_id}





                                        ??? note "**maps**: `Maps` 選用。來自 Google Maps 的接地區塊。"

                                              **uri**: `string`

                                              地點的 URI 參照。

                                              **title**: `string`

                                              地點的標題。

                                              **text**: `string`

                                              地點答案的文字說明。

                                              **placeId**: `string`

                                              地點的 ID，格式為 `places/{place_id}`。使用者可使用此 ID 查詢該地點。



                                            ??? note "**placeAnswerSources**: `PlaceAnswerSources` 在 Google Maps 中提供特定地點各項特色答案的來源。"

                                                ??? note "**reviewSnippets**: `ReviewSnippet array` 用來生成特定地點各項特色答案的評論摘要。"

                                                    **reviewId**: `string`

                                                    評論摘要的 ID。

                                                    **googleMapsUri**: `string`

                                                    對應 Google Maps 上使用者評論的連結。

                                                    **title**: `string`

                                                    評論的標題。





                                ??? note "**groundingSupports**: `GoogleAiGenerativelanguageV1betaGroundingSupport array` 接地佐證清單。"

                                    ??? note "**segment**: `GoogleAiGenerativelanguageV1betaSegment` 此佐證所屬的內容片段。"

                                        **partIndex**: `integer`

                                        Part 物件在其父層 Content 物件中的索引。

                                        **startIndex**: `integer`

                                        在給定 Part 中的起始索引，以位元組計。自 Part 開頭起算，包含該位置，從零開始。

                                        **endIndex**: `integer`

                                        在給定 Part 中的結束索引，以位元組計。自 Part 開頭起算，不含該位置，從零開始。

                                        **text**: `string`

                                        回應中對應該片段的文字。



                                      **groundingChunkIndices**: `integer array`

                                      選用。索引清單（指向 `response.candidate.grounding_metadata` 中的 'grounding_chunk'），指定與該主張關聯的引註。例如 [1,3,4] 表示 grounding_chunk[1]、grounding_chunk[3]、grounding_chunk[4] 是歸因於該主張的擷取內容。若回應為串流，grounding_chunk_indices 指的是跨所有回應的索引。用戶端有責任累積所有回應中的接地區塊（並維持相同順序）。

                                      **confidenceScores**: `number array`

                                      選用。佐證參照的信心分數。範圍為 0 到 1，1 為最有信心。此清單的大小必須與 grounding_chunk_indices 相同。

                                      **renderedParts**: `integer array`

                                      僅供輸出。指向候選內容 `parts` 欄位的索引。這些索引指定哪些已算繪部分與此佐證來源關聯。





                                ??? note "**retrievalMetadata**: `RetrievalMetadata` 與接地流程中擷取相關的中繼資料。"

                                    **googleSearchDynamicRetrievalScore**: `number`

                                    選用。分數，表示 Google 搜尋的資訊能協助回答提示詞的可能性。分數範圍為 [0, 1]，0 表示可能性最低，1 表示可能性最高。此分數僅在啟用 Google 搜尋接地與動態擷取時填入。它會與門檻值比較，以判斷是否觸發 Google 搜尋。



                                  **webSearchQueries**: `string array`

                                  供後續網路搜尋使用的網路搜尋查詢。

                                  **imageSearchQueries**: `string array`

                                  用於接地的圖片搜尋查詢。

                                  **googleMapsWidgetContextToken**: `string`

                                  選用。Google Maps 小工具上下文權杖的資源名稱，可與 PlacesContextElement 小工具搭配使用，以算繪上下文資料。僅在啟用 Google Maps 接地時填入。



                              **avgLogprobs**: `number`

                              僅供輸出。候選的平均對數機率分數。



                            ??? note "**logprobsResult**: `LogprobsResult` 僅供輸出。回應權杖與頂尖權杖的對數似然分數"

                                  **logProbabilitySum**: `number`

                                  所有權杖的對數機率總和。



                                ??? note "**topCandidates**: `TopCandidates array` 長度 = 解碼步驟的總數。"

                                    ??? note "**candidates**: `LogprobsResultCandidate array` 依對數機率由高至低排序。"

                                        **token**: `string`

                                        候選的權杖字串值。

                                        **tokenId**: `integer`

                                        候選的權杖 id 值。

                                        **logProbability**: `number`

                                        候選的對數機率。





                                ??? note "**chosenCandidates**: `LogprobsResultCandidate array` 長度 = 解碼步驟的總數。所選候選可能在 top_candidates 中，也可能不在。"

                                    **token**: `string`

                                    候選的權杖字串值。

                                    **tokenId**: `integer`

                                    候選的權杖 id 值。

                                    **logProbability**: `number`

                                    候選的對數機率。





                            ??? note "**urlContextMetadata**: `UrlContextMetadata` 僅供輸出。與 URL 上下文擷取工具相關的中繼資料。"

                                ??? note "**urlMetadata**: `UrlMetadata array` URL 上下文清單。"

                                      **retrievedUrl**: `string`

                                      工具擷取的 URL。



                                    ??? note "**urlRetrievalStatus**: `string enum` URL 擷取的狀態。"

                                        可能的值：

                                        - `URL_RETRIEVAL_STATUS_UNSPECIFIED`：預設值。此值未使用。
                                        - `URL_RETRIEVAL_STATUS_SUCCESS`：URL 擷取成功。
                                        - `URL_RETRIEVAL_STATUS_ERROR`：URL 擷取因錯誤而失敗。
                                        - `URL_RETRIEVAL_STATUS_PAYWALL`：URL 擷取因內容位於付費牆後而失敗。
                                        - `URL_RETRIEVAL_STATUS_UNSAFE`：URL 擷取因內容不安全而失敗。



                              **continuationToken**: `string`

                              選填的不透明接續權杖，在 `finish_reason` 為 `CONTINUATION` 時回傳。用戶端可將此權杖傳入後續的 `GenerateContentRequest` 以繼續生成。





                        ??? note "**promptFeedback**: `PromptFeedback` 回傳與內容篩選器相關的提示詞回饋。"

                            ??? note "**blockReason**: `string enum` 選用。若有設定，表示提示詞被封鎖，且不回傳任何候選。請重新措辭提示詞。"

                                可能的值：

                                - `BLOCK_REASON_UNSPECIFIED`：預設值。此值未使用。
                                - `SAFETY`：提示詞因安全因素被封鎖。請查看 `safety_ratings`，了解是哪個安全類別造成封鎖。
                                - `OTHER`：提示詞因未知原因被封鎖。
                                - `BLOCKLIST`：提示詞因包含術語封鎖清單中的詞彙而被封鎖。
                                - `PROHIBITED_CONTENT`：提示詞因禁止內容而被封鎖。
                                - `IMAGE_SAFETY`：候選因圖片生成內容不安全而被封鎖。





                            ??? note "**safetyRatings**: `SafetyRating array` 提示詞的安全性評等。每個類別最多有一個評等。"

                                ??? note "**category**: required `HarmCategory` 此評等的類別。"

                                    可能的值：

                                    - `HARM_CATEGORY_UNSPECIFIED`：未指定類別。
                                    - `HARM_CATEGORY_HARASSMENT`：**Gemini** - 騷擾內容。
                                    - `HARM_CATEGORY_HATE_SPEECH`：**Gemini** - 仇恨言論及內容。
                                    - `HARM_CATEGORY_SEXUALLY_EXPLICIT`：**Gemini** - 性露骨內容。
                                    - `HARM_CATEGORY_DANGEROUS_CONTENT`：**Gemini** - 危險內容。
                                    - `HARM_CATEGORY_JAILBREAK`：**Gemini** - 試圖繞過或顛覆模型安全準則的提示詞（越獄嘗試）。





                                ??? note "**probability**: required `string enum` 此內容造成危害的機率。"

                                    可能的值：

                                    - `HARM_PROBABILITY_UNSPECIFIED`：未指定機率。
                                    - `NEGLIGIBLE`：內容不安全的可能性微乎其微。
                                    - `LOW`：內容不安全的可能性低。
                                    - `MEDIUM`：內容不安全的可能性中等。
                                    - `HIGH`：內容不安全的可能性高。



                                  **blocked**: `boolean`

                                  此內容是否因這項評等而被封鎖？





                        ??? note "**usageMetadata**: `UsageMetadata` 僅供輸出。生成請求的權杖使用量中繼資料。"

                              **promptTokenCount**: `integer`

                              提示詞中的權杖數量。當 `cached_content` 已設定時，這仍是有效的提示詞總大小，也就是包含快取內容中的權杖數量。

                              **cachedContentTokenCount**: `integer`

                              提示詞中快取部分的權杖數量（快取內容）

                              **candidatesTokenCount**: `integer`

                              所有生成回應候選的權杖總數。

                              **toolUsePromptTokenCount**: `integer`

                              僅供輸出。工具使用提示詞中存在的權杖數量。

                              **thoughtsTokenCount**: `integer`

                              僅供輸出。思考模型的思考權杖數量。

                              **totalTokenCount**: `integer`

                              生成請求的權杖總數（提示詞 + 工具使用提示詞 + 思考 + 回應候選）。



                            ??? note "**promptTokensDetails**: `ModalityTokenCount array` 僅供輸出。請求輸入中處理過的模態清單。"

                                ??? note "**modality**: `GenerativeLanguageModality` 與此權杖數量關聯的模態。"

                                    可能的值：

                                    - `MODALITY_UNSPECIFIED`：未指定的模態。
                                    - `TEXT`：純文字。
                                    - `IMAGE`：圖片。
                                    - `VIDEO`：影片。
                                    - `AUDIO`：音訊。
                                    - `DOCUMENT`：文件，例如 PDF。



                                  **tokenCount**: `integer`

                                  權杖數量。





                            ??? note "**cacheTokensDetails**: `ModalityTokenCount array` 僅供輸出。請求輸入中快取內容的模態清單。"

                                ??? note "**modality**: `GenerativeLanguageModality` 與此權杖數量關聯的模態。"

                                    可能的值：

                                    - `MODALITY_UNSPECIFIED`：未指定的模態。
                                    - `TEXT`：純文字。
                                    - `IMAGE`：圖片。
                                    - `VIDEO`：影片。
                                    - `AUDIO`：音訊。
                                    - `DOCUMENT`：文件，例如 PDF。



                                  **tokenCount**: `integer`

                                  權杖數量。





                            ??? note "**candidatesTokensDetails**: `ModalityTokenCount array` 僅供輸出。回應中回傳的模態清單。"

                                ??? note "**modality**: `GenerativeLanguageModality` 與此權杖數量關聯的模態。"

                                    可能的值：

                                    - `MODALITY_UNSPECIFIED`：未指定的模態。
                                    - `TEXT`：純文字。
                                    - `IMAGE`：圖片。
                                    - `VIDEO`：影片。
                                    - `AUDIO`：音訊。
                                    - `DOCUMENT`：文件，例如 PDF。



                                  **tokenCount**: `integer`

                                  權杖數量。





                            ??? note "**toolUsePromptTokensDetails**: `ModalityTokenCount array` 僅供輸出。為工具使用請求輸入處理過的模態清單。"

                                ??? note "**modality**: `GenerativeLanguageModality` 與此權杖數量關聯的模態。"

                                    可能的值：

                                    - `MODALITY_UNSPECIFIED`：未指定的模態。
                                    - `TEXT`：純文字。
                                    - `IMAGE`：圖片。
                                    - `VIDEO`：影片。
                                    - `AUDIO`：音訊。
                                    - `DOCUMENT`：文件，例如 PDF。



                                  **tokenCount**: `integer`

                                  權杖數量。





                            ??? note "**serviceTier**: [`ServiceTier`](/api-reference/batch-api/batch-generate-content/#Resource:ServiceTier) 僅供輸出。請求的服務層級。"

                                可能的值：

                                - `unspecified`：預設服務層級，即標準層級。
                                - `standard`：標準服務層級。
                                - `flex`：Flex 服務層級。
                                - `priority`：優先服務層級。



                          **modelVersion**: `string`

                          僅供輸出。用來生成回應的模型版本。

                          **responseId**: `string`

                          僅供輸出。response_id 用來識別每個回應。



                        ??? note "**modelStatus**: `ModelStatus` 僅供輸出。此模型目前的模型狀態。"

                            ??? note "**modelStage**: `ModelStage` 基礎模型的階段。"

                                可能的值：

                                - `MODEL_STAGE_UNSPECIFIED`：未指定的模型階段。
                                - `EXPERIMENTAL`：此階段的模型僅供實驗用途。
                                - `PREVIEW`：此階段的模型比實驗模型更成熟。
                                - `STABLE`：此階段的模型被視為穩定，可供生產環境使用。
                                - `LEGACY`：若模型處於此階段，表示該模型在不久的將來將走向淘汰。只有現有客戶可使用此模型。
                                - `RETIRED`：此階段的模型已退役。這些模型無法使用。



                              **retirementTime**: `string`

                              模型退役的時間。

                              **message**: `string`

                              說明模型狀態的訊息。



                  **metadata**: `object`

                  僅供輸出。與請求關聯的中繼資料。



  

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


  

??? note "**batchStats**: `BatchStats` 僅供輸出。批次的統計資訊。"

    **requestCount**: `string`

    僅供輸出。批次中的請求數量。

    **successfulRequestCount**: `string`

    僅供輸出。成功處理的請求數量。

    **failedRequestCount**: `string`

    僅供輸出。處理失敗的請求數量。

    **pendingRequestCount**: `string`

    僅供輸出。仍待處理的請求數量。



  

---


  

??? note "**state**: [`BatchState`](/api-reference/batch-api/batch-generate-content/#Resource:BatchState) 僅供輸出。批次的狀態。"

    可能的值：

    - `BATCH_STATE_UNSPECIFIED`：未指定批次狀態。
    - `BATCH_STATE_PENDING`：服務正在準備執行批次。
    - `BATCH_STATE_RUNNING`：批次正在進行中。
    - `BATCH_STATE_SUCCEEDED`：批次成功完成。
    - `BATCH_STATE_FAILED`：批次失敗。
    - `BATCH_STATE_CANCELLED`：批次已被取消。
    - `BATCH_STATE_EXPIRED`：批次已過期。



  

---


  **priority**: `string`

  選用。批次的優先順序。優先順序值較高的批次會在優先順序值較低的批次之前處理。允許負值。預設為 0。


## 資料模型 {#data-models}

### BatchState {#Resource:BatchState}

**可能的值**：

- `BATCH_STATE_UNSPECIFIED`：未指定批次狀態。
- `BATCH_STATE_PENDING`：服務正在準備執行批次。
- `BATCH_STATE_RUNNING`：批次正在進行中。
- `BATCH_STATE_SUCCEEDED`：批次成功完成。
- `BATCH_STATE_FAILED`：批次失敗。
- `BATCH_STATE_CANCELLED`：批次已被取消。
- `BATCH_STATE_EXPIRED`：批次已過期。

### ServiceTier {#Resource:ServiceTier}

**可能的值**：

- `unspecified`：預設服務層級，即標準層級。
- `standard`：標準服務層級。
- `flex`：Flex 服務層級。
- `priority`：優先服務層級。
