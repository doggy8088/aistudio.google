# 快取

上下文快取可讓你儲存並重複使用預先計算好的輸入權杖，適用於需要反覆使用的內容，例如針對同一個媒體檔案提出不同的問題。視使用方式而定，這能節省成本並提升速度。詳細介紹請參閱[上下文快取](/docs/caching/)指南。

## 方法 {#methods}


| 方法 | HTTP 請求 |
| --- | --- |
| [建立快取內容](/api-reference/caching/create-cached-content/) | `POST` `/v1beta/cachedContents` 建立 CachedContent 資源。 |
| [列出快取內容](/api-reference/caching/list-cached-contents/) | `GET` `/v1beta/cachedContents` 列出 CachedContents。 |
| [取得快取內容](/api-reference/caching/get-cached-content/) | `GET` `/v1beta/cachedContents/{id}` 讀取 CachedContent 資源。 |
| [更新快取內容](/api-reference/caching/update-cached-content/) | `PATCH` `/v1beta/cachedContents/{id}` 更新 CachedContent 資源（僅到期時間可更新）。 |
| [刪除快取內容](/api-reference/caching/delete-cached-content/) | `DELETE` `/v1beta/cachedContents/{id}` 刪除 CachedContent 資源。 |


## 資源 {#resources}

### CachedContent {#Resource:CachedContent}

已經過預先處理的內容，可用於後續對
GenerativeService 的要求。

快取內容只能用於建立它的模型。

**屬性**：


  **model**：必填 `string`

  不可變更。快取內容要使用的 `Model` 名稱。格式：`models/{model}`

  

---


  

??? note "**expiration**：`Union type`，指定此資源何時到期。"

    聯集欄位 `expiration` 只能是下列其中一項：

    **expireTime**：`string`

    以 UTC 表示的時間戳，代表此資源被視為到期的時間。此欄位在輸出時*一律*會提供，無論輸入時送了什麼。

    **ttl**：`string`

    僅供輸入。此資源的新 TTL，僅供輸入。



  

---


  **name**：`string`

  僅供輸出。識別碼。指向快取內容的資源名稱。格式：`cachedContents/{id}`

  

---


  **displayName**：`string`

  選填。不可變更。由使用者產生、具意義的快取內容顯示名稱。最多 128 個 Unicode 字元。

  

---


  

??? note "**systemInstruction**：`Content`，選填。僅供輸入。不可變更。由開發人員設定的系統指令。目前僅支援文字。"

    ??? note "**parts**：`Part array`，構成單一訊息的有序 `Parts`。各 Part 的 MIME 類型可能不同。"

        ??? note "**data**：`Union type`"

              聯集欄位 `data` 只能是下列其中一項：

              **text**：`string`

              內嵌文字。



            ??? note "**inlineData**：`Blob`，內嵌媒體位元組。"

                **mimeType**：`string`

                來源資料的 IANA 標準 MIME 類型。支援的類型範例：

                - 圖片：image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
                - 音訊：audio/*, video/audio/s16le, video/audio/wav
                - 影片：video/*
                - 文字：text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
                - 應用程式：application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf。其他背景資訊請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                **data**：`string`

                媒體格式的原始位元組。

                **displayName**：`string`

                選填。指定用來向模型指稱此 blob 的名稱（例如 "my_blob.png"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 的參照識別碼。





            ??? note "**functionCall**：`FunctionCall`，模型回傳的預測 `FunctionCall`，其中包含代表 `FunctionDeclaration.name` 的字串，以及其參數與值。"

                **name**：必填 `string`

                要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                **id**：`string`

                選填。函式呼叫的唯一識別碼。若有填入，用戶端應執行 `function_call` 並回傳帶有相符 `id` 的回應。

                **args**：`object`

                選填。以 JSON 物件格式表示的函式參數與值。





            ??? note "**functionResponse**：`FunctionResponse`，`FunctionCall` 的結果輸出，其中包含代表 `FunctionDeclaration.name` 的字串，以及包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。"

                  **name**：必填 `string`

                  要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                  **response**：必填 `object`

                  函式回應，採用 JSON 物件格式。呼叫端可使用任何符合函式語法的自訂鍵來回傳函式輸出，例如 "output"、"result" 等。特別是當函式呼叫執行失敗時，回應可包含 "error" 鍵，將錯誤詳細資訊回傳給模型。多媒體內容可透過子物件納入，該子物件包含單一 "$ref" 鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，即持有該多媒體的 `FunctionResponsePart` 的對應欄位。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

                  **id**：`string`

                  選填。此回應所對應函式呼叫的識別碼。由用戶端填入，以對應相對應的函式呼叫 `id`。



                ??? note "**parts**：`FunctionResponsePart array`，選填。構成函式回應的有序 `Parts`。各 Part 的 IANA MIME 類型可能不同。"

                    ??? note "**data**：`Union type`，函式回應部分的資料。"

                          聯集欄位 `data` 只能是下列其中一項：



                        ??? note "**inlineData**：`FunctionResponseBlob`，內嵌媒體位元組。"

                            **mimeType**：`string`

                            來源資料的 IANA 標準 MIME 類型。範例：

                            - image/png
                            - image/jpeg

                            若提供不支援的 MIME 類型，系統會回傳錯誤。完整支援類型清單請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                            **data**：`string`

                            媒體格式的原始位元組。

                            **displayName**：`string`

                            選填。blob 的顯示名稱。用來提供標籤或檔名以區分各個 blob，並可從 `FunctionResponse.response` 參照此 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                        ??? note "**fileData**：`FunctionResponseFileData`，以 URI 為基礎的資料。"

                            **fileUri**：必填 `string`

                            URI.

                            **mimeType**：`string`

                            來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，系統會回傳錯誤。完整支援類型清單請參閱[多模態函式回應](/docs/function-calling/#multimodal)與[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                            **displayName**：`string`

                            選填。檔案的顯示名稱。用來提供標籤或檔名以區分檔案資料，並可從 `FunctionResponse.response` 參照此檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                    ??? note "**mediaProcessing**：`string enum`，選填。模型如何處理此部分的媒體以進行理解。僅對影片部分（具影片 mime 的 `inline_data` 或 `file_data`）有意義。非影片部分會忽略此欄位。"

                        可能的值：

                        - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
                        - `STATIC`：固定速率擷取影格。所有影格都放入上下文。
                        - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。



                  **willContinue**：`boolean`

                  選填。表示函式呼叫將繼續，並會回傳更多回應，使函式呼叫變成產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，後續回應將不被考慮。允許回傳空的 `response` 並搭配 `will_continue=False`，表示函式呼叫已完成。這仍可能觸發模型生成。若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。



                ??? note "**scheduling**：`string enum`，選填。指定回應在對話中應如何排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。"

                    可能的值：

                    - `SCHEDULING_UNSPECIFIED`：此值未使用。
                    - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發生成。
                    - `WHEN_IDLE`：將結果加入對話上下文，並在不中斷進行中生成的前提下提示生成輸出。
                    - `INTERRUPT`：將結果加入對話上下文，中斷進行中的生成並提示生成輸出。





            ??? note "**fileData**：`FileData`，以 URI 為基礎的資料。"

                **fileUri**：必填 `string`

                URI.

                **mimeType**：`string`

                選填。來源資料的 IANA 標準 MIME 類型。

                **displayName**：`string`

                選填。指定用來向模型指稱此檔案的名稱（例如 "my_file.pdf"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案的參照識別碼。





            ??? note "**executableCode**：`ExecutableCode`，由模型產生、供執行的程式碼。"

                ??? note "**language**：必填 `string enum`，`code` 的程式語言。"

                    可能的值：

                    - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用此值。
                    - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 為預設語言。



                  **code**：必填 `string`

                  要執行的程式碼。

                  **id**：`string`

                  選填。`ExecutableCode` 部分的唯一識別碼。伺服器會回傳 `CodeExecutionResult`，其 `id` 與之相符。





            ??? note "**codeExecutionResult**：`CodeExecutionResult`，執行 `ExecutableCode` 的結果。"

                ??? note "**outcome**：必填 `string enum`，程式碼執行的結果。"

                    可能的值：

                    - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用此值。
                    - `OUTCOME_OK`：程式碼執行成功完成。`output` 包含 stdout（如有）。
                    - `OUTCOME_FAILED`：程式碼執行失敗。`output` 包含 stderr 與 stdout（如有）。
                    - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已被取消。可能有、也可能沒有部分 `output`。



                  **id**：`string`

                  選填。此結果所對應的 `ExecutableCode` 部分的識別碼。僅在對應的 `ExecutableCode` 具有 id 時才會填入。

                  **output**：`string`

                  選填。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。





            ??? note "**toolCall**：`ToolCall`，伺服器端工具呼叫。當模型預測某個工具呼叫應在伺服器上執行時，會填入此欄位。用戶端應將此訊息回傳給 API。"

                ??? note "**toolType**：必填 `V1mainToolType`，被呼叫的工具類型。"

                    可能的值：

                    - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                    - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                    - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                    - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                    - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                    - `FILE_SEARCH`：File Search 工具，對應 Tool.file_search。
                    - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應多模態理解所使用的隱形工具，例如 GOOGLE_UNDERSTANDING_VIDEO。



                  **id**：`string`

                  選填。工具呼叫的唯一識別碼。伺服器會回傳帶有相符 `id` 的工具回應。

                  **toolName**：`string`

                  選填。被呼叫工具的名稱。

                  **args**：`object`

                  選填。工具呼叫參數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





            ??? note "**toolResponse**：`ToolResponse`，伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端以執行對應 `ToolCall` 的結果填入。"

                ??? note "**toolType**：必填 `V1mainToolType`，被呼叫的工具類型；其 `tool_type` 與對應的 `ToolCall` 相符。"

                    可能的值：

                    - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                    - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                    - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                    - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                    - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                    - `FILE_SEARCH`：File Search 工具，對應 Tool.file_search。
                    - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應多模態理解所使用的隱形工具，例如 GOOGLE_UNDERSTANDING_VIDEO。



                  **id**：`string`

                  選填。此回應所對應工具呼叫的識別碼。

                  **response**：`object`

                  選填。工具回應。





        ??? note "**metadata**：`Union type`，控制資料的額外預先處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個部分的靜態媒體預先處理。"

              聯集欄位 `metadata` 只能是下列其中一項：



            ??? note "**videoMetadata**：`VideoMetadata`，選填。影片中繼資料。僅當影片資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"

                **startOffset**：`string`

                選填。影片的開始位移。

                **endOffset**：`string`

                選填。影片的結束位移。

                **fps**：`number`

                選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。



          **thought**：`boolean`

          選填。表示此部分是否為模型的思考內容。

          **thoughtSignature**：`string`

          選填。思考內容的不透明簽章，可在後續要求中重複使用。

          **partMetadata**：`object`

          與 Part 相關聯的自訂中繼資料。使用 genai.Part 作為內容表示方式的代理，可能需要追蹤額外資訊。例如，Part 來源的檔案/來源名稱，或多工處理多個 Part 串流的方式。



        ??? note "**mediaResolution**：`V1mainMediaResolution`，選填。輸入媒體的媒體解析度。"

            ??? note "**value**：`Union type`，媒體解析度等級。"

                  聯集欄位 `value` 只能是下列其中一項：



                ??? note "**level**：`string enum`，指定媒體所使用的權杖化品質。供 Gemini API 支援使用。"

                    可能的值：

                    - `MEDIA_RESOLUTION_UNSPECIFIED`：媒體解析度尚未設定。
                    - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低。
                    - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中。
                    - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高。
                    - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設為超高。





        ??? note "**mediaProcessing**：`string enum`，選填。模型如何處理此部分的媒體以進行理解。僅對影片部分（具影片 mime 的 `inline_data` 或 `file_data`）有意義。非影片部分會忽略此欄位。"

            可能的值：

            - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
            - `STATIC`：固定速率擷取影格。所有影格都放入上下文。
            - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。





        ??? note "**audioTranscription**：`AudioTranscription`，選填。音訊（輸入或輸出）轉錄。僅當此 Part 包含音訊資料時才會設定。"

              **text**：必填 `string`

              此音訊片段的轉錄文字。

              **speakerLabel**：`string`

              選填。標識此音訊片段說話者的標籤（例如 "spk_1"、"spk_2"）。在設定說話者分離時才會出現。



            ??? note "**words**：`WordInfo array`，選填。詳細的單字層級轉錄與時間資訊。在設定 word_timestamp 時才會出現。"

                **word**：必填 `string`

                單字的轉錄。

                **startOffset**：`string`

                選填。單字相對於音訊開頭的開始時間位移。

                **endOffset**：`string`

                選填。單字相對於音訊開頭的結束時間位移。





        ??? note "**speechMetadata**：`SpeechMetadata`，選填。套用至文字部分的中繼資料，用來自訂其朗讀或合成方式，例如指定說話者身分或說話風格。"

            **speaker**：`string`

            選填。多說話者合成所用的說話者名稱。

            **style**：`string`

            選填。語音合成的風格指令。



      **role**：`string`

      選填。內容的產生者。必須是 'user' 或 'model'。在多輪對話中設定很有用，其他情況可留空或不設定。



  

---


  

??? note "**contents**：`Content array`，選填。僅供輸入。不可變更。要快取的內容。"

    ??? note "**parts**：`Part array`，構成單一訊息的有序 `Parts`。各 Part 的 MIME 類型可能不同。"

        ??? note "**data**：`Union type`"

              聯集欄位 `data` 只能是下列其中一項：

              **text**：`string`

              內嵌文字。



            ??? note "**inlineData**：`Blob`，內嵌媒體位元組。"

                **mimeType**：`string`

                來源資料的 IANA 標準 MIME 類型。支援的類型範例：

                - 圖片：image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
                - 音訊：audio/*, video/audio/s16le, video/audio/wav
                - 影片：video/*
                - 文字：text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
                - 應用程式：application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf。其他背景資訊請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                **data**：`string`

                媒體格式的原始位元組。

                **displayName**：`string`

                選填。指定用來向模型指稱此 blob 的名稱（例如 "my_blob.png"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 的參照識別碼。





            ??? note "**functionCall**：`FunctionCall`，模型回傳的預測 `FunctionCall`，其中包含代表 `FunctionDeclaration.name` 的字串，以及其參數與值。"

                **name**：必填 `string`

                要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                **id**：`string`

                選填。函式呼叫的唯一識別碼。若有填入，用戶端應執行 `function_call` 並回傳帶有相符 `id` 的回應。

                **args**：`object`

                選填。以 JSON 物件格式表示的函式參數與值。





            ??? note "**functionResponse**：`FunctionResponse`，`FunctionCall` 的結果輸出，其中包含代表 `FunctionDeclaration.name` 的字串，以及包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。"

                  **name**：必填 `string`

                  要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

                  **response**：必填 `object`

                  函式回應，採用 JSON 物件格式。呼叫端可使用任何符合函式語法的自訂鍵來回傳函式輸出，例如 "output"、"result" 等。特別是當函式呼叫執行失敗時，回應可包含 "error" 鍵，將錯誤詳細資訊回傳給模型。多媒體內容可透過子物件納入，該子物件包含單一 "$ref" 鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，即持有該多媒體的 `FunctionResponsePart` 的對應欄位。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

                  **id**：`string`

                  選填。此回應所對應函式呼叫的識別碼。由用戶端填入，以對應相對應的函式呼叫 `id`。



                ??? note "**parts**：`FunctionResponsePart array`，選填。構成函式回應的有序 `Parts`。各 Part 的 IANA MIME 類型可能不同。"

                    ??? note "**data**：`Union type`，函式回應部分的資料。"

                          聯集欄位 `data` 只能是下列其中一項：



                        ??? note "**inlineData**：`FunctionResponseBlob`，內嵌媒體位元組。"

                            **mimeType**：`string`

                            來源資料的 IANA 標準 MIME 類型。範例：

                            - image/png
                            - image/jpeg

                            若提供不支援的 MIME 類型，系統會回傳錯誤。完整支援類型清單請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                            **data**：`string`

                            媒體格式的原始位元組。

                            **displayName**：`string`

                            選填。blob 的顯示名稱。用來提供標籤或檔名以區分各個 blob，並可從 `FunctionResponse.response` 參照此 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                        ??? note "**fileData**：`FunctionResponseFileData`，以 URI 為基礎的資料。"

                            **fileUri**：必填 `string`

                            URI.

                            **mimeType**：`string`

                            來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，系統會回傳錯誤。完整支援類型清單請參閱[多模態函式回應](/docs/function-calling/#multimodal)與[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                            **displayName**：`string`

                            選填。檔案的顯示名稱。用來提供標籤或檔名以區分檔案資料，並可從 `FunctionResponse.response` 參照此檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                    ??? note "**mediaProcessing**：`string enum`，選填。模型如何處理此部分的媒體以進行理解。僅對影片部分（具影片 mime 的 `inline_data` 或 `file_data`）有意義。非影片部分會忽略此欄位。"

                        可能的值：

                        - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
                        - `STATIC`：固定速率擷取影格。所有影格都放入上下文。
                        - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。



                  **willContinue**：`boolean`

                  選填。表示函式呼叫將繼續，並會回傳更多回應，使函式呼叫變成產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，後續回應將不被考慮。允許回傳空的 `response` 並搭配 `will_continue=False`，表示函式呼叫已完成。這仍可能觸發模型生成。若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。



                ??? note "**scheduling**：`string enum`，選填。指定回應在對話中應如何排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。"

                    可能的值：

                    - `SCHEDULING_UNSPECIFIED`：此值未使用。
                    - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發生成。
                    - `WHEN_IDLE`：將結果加入對話上下文，並在不中斷進行中生成的前提下提示生成輸出。
                    - `INTERRUPT`：將結果加入對話上下文，中斷進行中的生成並提示生成輸出。





            ??? note "**fileData**：`FileData`，以 URI 為基礎的資料。"

                **fileUri**：必填 `string`

                URI.

                **mimeType**：`string`

                選填。來源資料的 IANA 標準 MIME 類型。

                **displayName**：`string`

                選填。指定用來向模型指稱此檔案的名稱（例如 "my_file.pdf"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案的參照識別碼。





            ??? note "**executableCode**：`ExecutableCode`，由模型產生、供執行的程式碼。"

                ??? note "**language**：必填 `string enum`，`code` 的程式語言。"

                    可能的值：

                    - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用此值。
                    - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 為預設語言。



                  **code**：必填 `string`

                  要執行的程式碼。

                  **id**：`string`

                  選填。`ExecutableCode` 部分的唯一識別碼。伺服器會回傳 `CodeExecutionResult`，其 `id` 與之相符。





            ??? note "**codeExecutionResult**：`CodeExecutionResult`，執行 `ExecutableCode` 的結果。"

                ??? note "**outcome**：必填 `string enum`，程式碼執行的結果。"

                    可能的值：

                    - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用此值。
                    - `OUTCOME_OK`：程式碼執行成功完成。`output` 包含 stdout（如有）。
                    - `OUTCOME_FAILED`：程式碼執行失敗。`output` 包含 stderr 與 stdout（如有）。
                    - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已被取消。可能有、也可能沒有部分 `output`。



                  **id**：`string`

                  選填。此結果所對應的 `ExecutableCode` 部分的識別碼。僅在對應的 `ExecutableCode` 具有 id 時才會填入。

                  **output**：`string`

                  選填。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。





            ??? note "**toolCall**：`ToolCall`，伺服器端工具呼叫。當模型預測某個工具呼叫應在伺服器上執行時，會填入此欄位。用戶端應將此訊息回傳給 API。"

                ??? note "**toolType**：必填 `V1mainToolType`，被呼叫的工具類型。"

                    可能的值：

                    - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                    - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                    - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                    - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                    - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                    - `FILE_SEARCH`：File Search 工具，對應 Tool.file_search。
                    - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應多模態理解所使用的隱形工具，例如 GOOGLE_UNDERSTANDING_VIDEO。



                  **id**：`string`

                  選填。工具呼叫的唯一識別碼。伺服器會回傳帶有相符 `id` 的工具回應。

                  **toolName**：`string`

                  選填。被呼叫工具的名稱。

                  **args**：`object`

                  選填。工具呼叫參數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





            ??? note "**toolResponse**：`ToolResponse`，伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端以執行對應 `ToolCall` 的結果填入。"

                ??? note "**toolType**：必填 `V1mainToolType`，被呼叫的工具類型；其 `tool_type` 與對應的 `ToolCall` 相符。"

                    可能的值：

                    - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                    - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                    - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                    - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                    - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                    - `FILE_SEARCH`：File Search 工具，對應 Tool.file_search。
                    - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應多模態理解所使用的隱形工具，例如 GOOGLE_UNDERSTANDING_VIDEO。



                  **id**：`string`

                  選填。此回應所對應工具呼叫的識別碼。

                  **response**：`object`

                  選填。工具回應。





        ??? note "**metadata**：`Union type`，控制資料的額外預先處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定每個部分的靜態媒體預先處理。"

              聯集欄位 `metadata` 只能是下列其中一項：



            ??? note "**videoMetadata**：`VideoMetadata`，選填。影片中繼資料。僅當影片資料以 inline_data 或 file_data 呈現時，才應指定此中繼資料。"

                **startOffset**：`string`

                選填。影片的開始位移。

                **endOffset**：`string`

                選填。影片的結束位移。

                **fps**：`number`

                選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。



          **thought**：`boolean`

          選填。表示此部分是否為模型的思考內容。

          **thoughtSignature**：`string`

          選填。思考內容的不透明簽章，可在後續要求中重複使用。

          **partMetadata**：`object`

          與 Part 相關聯的自訂中繼資料。使用 genai.Part 作為內容表示方式的代理，可能需要追蹤額外資訊。例如，Part 來源的檔案/來源名稱，或多工處理多個 Part 串流的方式。



        ??? note "**mediaResolution**：`V1mainMediaResolution`，選填。輸入媒體的媒體解析度。"

            ??? note "**value**：`Union type`，媒體解析度等級。"

                  聯集欄位 `value` 只能是下列其中一項：



                ??? note "**level**：`string enum`，指定媒體所使用的權杖化品質。供 Gemini API 支援使用。"

                    可能的值：

                    - `MEDIA_RESOLUTION_UNSPECIFIED`：媒體解析度尚未設定。
                    - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低。
                    - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中。
                    - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高。
                    - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設為超高。





        ??? note "**mediaProcessing**：`string enum`，選填。模型如何處理此部分的媒體以進行理解。僅對影片部分（具影片 mime 的 `inline_data` 或 `file_data`）有意義。非影片部分會忽略此欄位。"

            可能的值：

            - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
            - `STATIC`：固定速率擷取影格。所有影格都放入上下文。
            - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。





        ??? note "**audioTranscription**：`AudioTranscription`，選填。音訊（輸入或輸出）轉錄。僅當此 Part 包含音訊資料時才會設定。"

              **text**：必填 `string`

              此音訊片段的轉錄文字。

              **speakerLabel**：`string`

              選填。標識此音訊片段說話者的標籤（例如 "spk_1"、"spk_2"）。在設定說話者分離時才會出現。



            ??? note "**words**：`WordInfo array`，選填。詳細的單字層級轉錄與時間資訊。在設定 word_timestamp 時才會出現。"

                **word**：必填 `string`

                單字的轉錄。

                **startOffset**：`string`

                選填。單字相對於音訊開頭的開始時間位移。

                **endOffset**：`string`

                選填。單字相對於音訊開頭的結束時間位移。





        ??? note "**speechMetadata**：`SpeechMetadata`，選填。套用至文字部分的中繼資料，用來自訂其朗讀或合成方式，例如指定說話者身分或說話風格。"

            **speaker**：`string`

            選填。多說話者合成所用的說話者名稱。

            **style**：`string`

            選填。語音合成的風格指令。



      **role**：`string`

      選填。內容的產生者。必須是 'user' 或 'model'。在多輪對話中設定很有用，其他情況可留空或不設定。



  

---


  

??? note "**tools**：`Tool array`，選填。僅供輸入。不可變更。模型可用來產生下一個回應的 `Tools` 清單"

    ??? note "**functionDeclarations**：`FunctionDeclaration array`，選填。提供給模型、可供函式呼叫使用的 `FunctionDeclarations` 清單。模型或系統不會執行函式。相反地，已定義的函式可能會以 FunctionCall 的形式連同參數回傳至用戶端執行。模型可能會在回應中填入 FunctionCall，決定呼叫這些函式的子集。下一個對話回合可能包含 FunctionResponse，帶有 Content.role 為 'function' 的生成上下文，供下一個模型回合使用。"

          **name**：必填 `string`

          函式的名稱。必須為 a-z、A-Z、0-9，或包含底線、冒號、句點與連字號，長度上限為 128。

          **description**：必填 `string`

          函式的簡要說明。



        ??? note "**parameters**：`Schema`，選填。說明此函式的參數。反映 Open API 3.03 Parameter Object。字串 Key：參數名稱。參數名稱區分大小寫。Schema Value：定義該參數所用類型的 Schema。"

            ??? note "**type**：必填 `Type`，資料類型。"

                可能的值：

                - `TYPE_UNSPECIFIED`：未指定，不應使用。
                - `STRING`：字串類型。
                - `NUMBER`：數字類型。
                - `INTEGER`：整數類型。
                - `BOOLEAN`：布林類型。
                - `ARRAY`：陣列類型。
                - `OBJECT`：物件類型。
                - `NULL`：Null 類型。



              **format**：`string`

              選填。資料的格式。允許任何值，但大多數值不會觸發任何特殊功能。

              **title**：`string`

              選填。schema 的標題。

              **description**：`string`

              選填。參數的簡要說明。其中可能包含使用範例。參數說明可使用 Markdown 格式。

              **nullable**：`boolean`

              選填。表示值是否可為 null。

              **enum**：`string array`

              選填。Type.STRING 元素在 enum 格式下的可能值。例如，我們可以將 Enum Direction 定義為：{type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]}

              **items**：`Schema`

              選填。Type.ARRAY 元素的 Schema。

              **maxItems**：`string`

              選填。Type.ARRAY 元素的數量上限。

              **minItems**：`string`

              選填。Type.ARRAY 元素的數量下限。

              **properties**：`object`

              選填。Type.OBJECT 的屬性。

              **required**：`string array`

              選填。Type.OBJECT 的必填屬性。

              **minProperties**：`string`

              選填。Type.OBJECT 屬性的數量下限。

              **maxProperties**：`string`

              選填。Type.OBJECT 屬性的數量上限。

              **minimum**：`number`

              選填。SCHEMA FIELDS FOR TYPE INTEGER and NUMBER。Type.INTEGER 與 Type.NUMBER 的最小值

              **maximum**：`number`

              選填。Type.INTEGER 與 Type.NUMBER 的最大值

              **minLength**：`string`

              選填。SCHEMA FIELDS FOR TYPE STRING。Type.STRING 的最小長度

              **maxLength**：`string`

              選填。Type.STRING 的最大長度

              **pattern**：`string`

              選填。Type.STRING 的模式，用來將字串限制為正規表示式。

              **example**：`object`

              選填。物件的範例。僅在物件為根物件時才會填入。

              **anyOf**：`Schema array`

              選填。值應對照清單中的任一（一個或多個）子 schema 進行驗證。

              **propertyOrdering**：`string array`

              選填。屬性的順序。不是 Open API 規格中的標準欄位。用來決定回應中屬性的順序。

              **default**：`object`

              選填。欄位的預設值。依據 JSON Schema，此欄位是供文件產生器使用，不影響驗證。因此在此納入並忽略，讓傳送帶有 `default` 欄位的 schema 的開發人員不會收到未知欄位錯誤。



          **parametersJsonSchema**：`object`

          選填。以 JSON Schema 格式說明函式的參數。該 schema 必須描述一個物件，其屬性即為函式的參數。例如：`{ "type": "object", "properties": { "name": { "type": "string" }, "age": { "type": "integer" } }, "additionalProperties": false, "required": ["name", "age"], "propertyOrdering": ["name", "age"] }` 此欄位與 `parameters` 互斥。



        ??? note "**response**：`Schema`，選填。以 JSON Schema 格式說明此函式的輸出。反映 Open API 3.03 Response Object。Schema 定義函式回應值所使用的類型。"

            ??? note "**type**：必填 `Type`，資料類型。"

                可能的值：

                - `TYPE_UNSPECIFIED`：未指定，不應使用。
                - `STRING`：字串類型。
                - `NUMBER`：數字類型。
                - `INTEGER`：整數類型。
                - `BOOLEAN`：布林類型。
                - `ARRAY`：陣列類型。
                - `OBJECT`：物件類型。
                - `NULL`：Null 類型。



              **format**：`string`

              選填。資料的格式。允許任何值，但大多數值不會觸發任何特殊功能。

              **title**：`string`

              選填。schema 的標題。

              **description**：`string`

              選填。參數的簡要說明。其中可能包含使用範例。參數說明可使用 Markdown 格式。

              **nullable**：`boolean`

              選填。表示值是否可為 null。

              **enum**：`string array`

              選填。Type.STRING 元素在 enum 格式下的可能值。例如，我們可以將 Enum Direction 定義為：{type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]}

              **items**：`Schema`

              選填。Type.ARRAY 元素的 Schema。

              **maxItems**：`string`

              選填。Type.ARRAY 元素的數量上限。

              **minItems**：`string`

              選填。Type.ARRAY 元素的數量下限。

              **properties**：`object`

              選填。Type.OBJECT 的屬性。

              **required**：`string array`

              選填。Type.OBJECT 的必填屬性。

              **minProperties**：`string`

              選填。Type.OBJECT 屬性的數量下限。

              **maxProperties**：`string`

              選填。Type.OBJECT 屬性的數量上限。

              **minimum**：`number`

              選填。SCHEMA FIELDS FOR TYPE INTEGER and NUMBER。Type.INTEGER 與 Type.NUMBER 的最小值

              **maximum**：`number`

              選填。Type.INTEGER 與 Type.NUMBER 的最大值

              **minLength**：`string`

              選填。SCHEMA FIELDS FOR TYPE STRING。Type.STRING 的最小長度

              **maxLength**：`string`

              選填。Type.STRING 的最大長度

              **pattern**：`string`

              選填。Type.STRING 的模式，用來將字串限制為正規表示式。

              **example**：`object`

              選填。物件的範例。僅在物件為根物件時才會填入。

              **anyOf**：`Schema array`

              選填。值應對照清單中的任一（一個或多個）子 schema 進行驗證。

              **propertyOrdering**：`string array`

              選填。屬性的順序。不是 Open API 規格中的標準欄位。用來決定回應中屬性的順序。

              **default**：`object`

              選填。欄位的預設值。依據 JSON Schema，此欄位是供文件產生器使用，不影響驗證。因此在此納入並忽略，讓傳送帶有 `default` 欄位的 schema 的開發人員不會收到未知欄位錯誤。



          **responseJsonSchema**：`object`

          選填。以 JSON Schema 格式說明此函式的輸出。schema 指定的值即為函式的回應值。此欄位與 `response` 互斥。



        ??? note "**behavior**：`string enum`，選填。指定函式的行為（Behavior）。目前僅 BidiGenerateContent 方法支援。"

            可能的值：

            - `UNSPECIFIED`：此值未使用。
            - `BLOCKING`：若設定，系統會等待收到函式回應後才繼續對話。
            - `NON_BLOCKING`：若設定，系統不會等待收到函式回應。相反地，它會在維持使用者與模型對話的同時，嘗試在函式回應可用時加以處理。





    ??? note "**googleSearchRetrieval**：`GoogleSearchRetrieval`，選填。由 Google 搜尋提供支援的檢索工具。"

        ??? note "**dynamicRetrievalConfig**：`DynamicRetrievalConfig`，指定該來源的動態檢索設定。"

            ??? note "**mode**：`string enum`，動態檢索所使用的預測器模式。"

                可能的值：

                - `MODE_UNSPECIFIED`：一律觸發檢索。
                - `MODE_DYNAMIC`：僅在系統判斷有必要時才執行檢索。



              **dynamicThreshold**：`number`

              動態檢索所使用的閾值。若未設定，將使用系統預設值。





    ??? note "**codeExecution**：`CodeExecution`，選填。讓模型能在生成過程中執行程式碼。"






    ??? note "**googleSearch**：`GoogleSearch`，選填。GoogleSearch 工具類型。支援模型中 Google 搜尋的工具。由 Google 提供支援。"

        ??? note "**timeRangeFilter**：`Interval`，選填。將搜尋結果篩選至特定時間範圍。若使用者設定了開始時間，就必須設定結束時間（反之亦然）。"

            **startTime**：`string`

            選填。區間的起始（含）。若有指定，符合此區間的 Timestamp 必須等於或晚於起始時間。

            **endTime**：`string`

            選填。區間的結束（不含）。若有指定，符合此區間的 Timestamp 必須早於結束時間。





        ??? note "**searchTypes**：`SearchTypes`，選填。要啟用的搜尋類型集合。若未設定，預設啟用網路搜尋。"

            ??? note "**webSearch**：`WebSearch`，選填。啟用網路搜尋。僅回傳文字結果。"






            ??? note "**imageSearch**：`ImageSearch`，選填。啟用圖片搜尋。回傳圖片位元組。"





    ??? note "**computerUse**：`ComputerUse`，選填。支援模型直接與電腦互動的工具。若啟用，會自動填入電腦使用專屬的 Function Declarations。"

        ??? note "**environment**：必填 `string enum`，所操作的環境。"

            可能的值：

            - `ENVIRONMENT_UNSPECIFIED`：預設為瀏覽器。
            - `ENVIRONMENT_BROWSER`：在網頁瀏覽器中操作。
            - `ENVIRONMENT_MOBILE`：在行動環境中操作。
            - `ENVIRONMENT_DESKTOP`：在桌面環境中操作。



          **excludedPredefinedFunctions**：`string array`

          選填。依預設，預先定義的函式會包含在最終的模型呼叫中。其中一些函式可明確排除、不自動包含。這有兩個目的：1. 使用更受限/不同的動作空間。2. 改進預先定義函式的定義/指令。

          **enablePromptInjectionDetection**：`boolean`

          選填。是否對 computer-use 要求啟用提示詞注入偵測檢查。



        ??? note "**disabledSafetyPolicies**：`string enum array`，選填。電腦使用所停用的安全政策。"

            可能的值：

            - `SAFETY_POLICY_UNSPECIFIED`：未指定的安全政策。
            - `FINANCIAL_TRANSACTIONS`：金融交易的安全政策。
            - `SENSITIVE_DATA_MODIFICATION`：敏感資料修改的安全政策。
            - `COMMUNICATION_TOOL`：通訊工具（例如 Gmail、Chat、Meet）的安全政策。
            - `ACCOUNT_CREATION`：帳號建立的安全政策。
            - `DATA_MODIFICATION`：資料修改的安全政策。
            - `USER_CONSENT_MANAGEMENT`：使用者同意管理的安全政策。
            - `LEGAL_TERMS_AND_AGREEMENTS`：法律條款與協議的安全政策。





    ??? note "**urlContext**：`UrlContext`，選填。支援 URL 上下文檢索的工具。"






    ??? note "**fileSearch**：`FileSearch`，選填。FileSearch 工具類型。用來從 Semantic Retrieval 語料庫檢索知識的工具。"

        **fileSearchStoreNames**：必填 `string array`

        要檢索的 file_search_stores 名稱。範例：`fileSearchStores/my-file-search-store-123`

        **topK**：`integer`

        選填。要檢索的語意檢索區塊數量。

        **metadataFilter**：`string`

        選填。要套用至語意檢索文件與區塊的中繼資料篩選條件。





    ??? note "**mcpServers**：`McpServer array`，選填。要連線的 MCP Servers。"

        ??? note "**transport**：`Union type`，用來連線至 MCPServer 的傳輸方式。"

              聯集欄位 `transport` 只能是下列其中一項：



            ??? note "**streamableHttpTransport**：`StreamableHttpTransport`，可串流 HTTP 要求與回應的傳輸方式。"

                **url**：`string`

                MCPServer 端點的完整 URL。範例："https://api.example.com/mcp"

                **headers**：`object`

                選填：視需要提供驗證標頭、逾時等欄位。

                **timeout**：`string`

                一般操作的 HTTP 逾時。

                **sseReadTimeout**：`string`

                SSE 讀取操作的逾時。

                **terminateOnClose**：`boolean`

                傳輸關閉時是否關閉用戶端工作階段。



          **name**：`string`

          MCPServer 的名稱。





    ??? note "**googleMaps**：`GoogleMaps`，選填。讓模型的回應能以與使用者查詢相關的地理空間上下文接地的工具。"

        **enableWidget**：`boolean`

        選填。是否在回應的 GroundingMetadata 中回傳 widget 上下文權杖。開發人員可使用 widget 上下文權杖，渲染帶有與模型在回應中參照的地點相關之地理空間上下文的 Google Maps widget。



  

---


  

??? note "**toolConfig**：`ToolConfig`，選填。僅供輸入。不可變更。工具設定。此設定為所有工具共用。"

    ??? note "**functionCallingConfig**：`FunctionCallingConfig`，選填。函式呼叫設定。"

        ??? note "**mode**：`string enum`，選填。指定函式呼叫應以何種模式執行。若未指定，預設值將設為 AUTO。"

            可能的值：

            - `MODE_UNSPECIFIED`：未指定的函式呼叫模式。不應使用此值。
            - `AUTO`：預設的模型行為，由模型決定要預測函式呼叫或自然語言回應。
            - `ANY`：模型被限制為一律只預測函式呼叫。若有設定 "allowed_function_names"，預測的函式呼叫將限於 "allowed_function_names" 中的任一項，否則預測的函式呼叫將是所提供的 "function_declarations" 中的任一項。
            - `NONE`：模型不會預測任何函式呼叫。模型行為與未傳入任何函式宣告時相同。
            - `VALIDATED`：由模型決定要預測函式呼叫或自然語言回應，但會以受限解碼驗證函式呼叫。若有設定 "allowed_function_names"，預測的函式呼叫將限於 "allowed_function_names" 中的任一項，否則預測的函式呼叫將是所提供的 "function_declarations" 中的任一項。



          **allowedFunctionNames**：`string array`

          選填。一組函式名稱，提供時可限制模型將呼叫的函式。僅應在 Mode 為 ANY 或 VALIDATED 時設定。函式名稱應與 [FunctionDeclaration.name] 相符。設定後，模型將只從允許的函式名稱中預測函式呼叫。





    ??? note "**retrievalConfig**：`RetrievalConfig`，選填。檢索設定。"

        ??? note "**latLng**：`LatLng`，選填。使用者的位置。"

            **latitude**：`number`

            以度為單位的緯度。必須在 [-90.0, +90.0] 範圍內。

            **longitude**：`number`

            以度為單位的經度。必須在 [-180.0, +180.0] 範圍內。



          **languageCode**：`string`

          選填。使用者的語言代碼。內容的語言代碼。使用 [BCP47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) 定義的語言標籤。



      **includeServerSideToolInvocations**：`boolean`

      選填。若為 true，API 回應將在 `Content` 訊息中包含伺服器端工具呼叫與回應。這讓用戶端能觀察伺服器的工具互動。



  

---


  **createTime**：`string`

  僅供輸出。快取條目的建立時間。

  

---


  **updateTime**：`string`

  僅供輸出。快取條目最後更新的時間（UTC）。

  

---


  

??? note "**usageMetadata**：`CachedContentUsageMetadata`，僅供輸出。快取內容使用情況的中繼資料。"

    **totalTokenCount**：`integer`

    快取內容消耗的權杖總數。


