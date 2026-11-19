# 建立臨時驗證 token

`POST` `https://generativelanguage.googleapis.com/v1beta/auth_tokens`

建立一個 token，可用來限制 BidiGenerateContent 工作階段的行為。


  
## 請求主體 {#request-body}

  
  

??? note "**config**：`Union type` 所產生 token 的方法專屬設定。"

      聯集欄位 `config` 只能是下列其中之一：



    ??? note "**bidiGenerateContentSetup**：`BidiGenerateContentSetup` 選填。僅供輸入。不可變。`BidiGenerateContent` 專屬的設定。"

          **model**：必填 `string`

          模型的資源名稱，作為要使用的 Model 的 ID。格式：`models/{model}`



        ??? note "**generationConfig**：`GenerationConfig` 選填。生成設定。下列欄位不受支援：- `response_logprobs` - `response_mime_type` - `logprobs` - `response_schema` - `response_json_schema` - `stop_sequence` - `skip_response_cache` - `routing_config` - `audio_timestamp`"

              **candidateCount**：`integer`

              選填。要傳回的生成回應數量。若未設定，預設為 1。請注意，此設定不適用於上一代模型（Gemini 1.0 系列）。

              **stopSequences**：`string array`

              選填。會停止輸出生成的字元序列集合（最多 5 個）。若有指定，API 會在 `stop_sequence` 首次出現時停止。停止序列不會包含在回應中。

              **maxOutputTokens**：`integer`

              選填。回應候選中可包含的 token 數量上限。注意：預設值依模型而異，請參閱 `Model.output_token_limit` 屬性；該屬性屬於一個 `Model`，由 `getModel` 函式傳回。

              **temperature**：`number`

              選填。控制輸出的隨機程度。注意：預設值依模型而異，請參閱 `Model.temperature` 屬性；該屬性屬於一個 `Model`，由 `getModel` 函式傳回。值域為 [0.0, 2.0]。此欄位在 Gemini 3.6 Flash 及更新的模型上已不再支援，會被靜默忽略。

              **topP**：`number`

              選填。取樣時要考量的 token 累積機率上限。模型會結合 Top-k 與 Top-p（nucleus）取樣。token 會依其指派的機率排序，因此只會考量最有可能的 token。Top-k 取樣直接限制要考量的 token 數量上限，而 Nucleus 取樣則依累積機率限制 token 數量。注意：預設值依 `Model` 而異，由 `Model.top_p` 屬性指定，該屬性由 `getModel` 函式傳回。若 `top_k` 屬性為空，表示該模型不套用 top-k 取樣，也不允許在請求中設定 `top_k`。此欄位在 Gemini 3.6 Flash 及更新的模型上已不再支援，會被靜默忽略。

              **topK**：`integer`

              選填。取樣時要考量的 token 數量上限。Gemini 模型使用 Top-p（nucleus）取樣，或 Top-k 與 nucleus 取樣的組合。Top-k 取樣會考量 `top_k` 個最有可能的 token。採用 nucleus 取樣的模型不允許設定 top_k。注意：預設值依 `Model` 而異，由 `Model.top_p` 屬性指定，該屬性由 `getModel` 函式傳回。若 `top_k` 屬性為空，表示該模型不套用 top-k 取樣，也不允許在請求中設定 `top_k`。此欄位在 Gemini 3.6 Flash 及更新的模型上已不再支援，會被靜默忽略。

              **seed**：`integer`

              選填。解碼時使用的種子。若未設定，請求會使用隨機產生的種子。

              **responseMimeType**：`string`

              選填。所生成候選文字的 MIME 類型。支援的 MIME 類型如下：`text/plain`：（預設）文字輸出。`application/json`：回應候選中的 JSON 回應。`text/x.enum`：回應候選中以字串形式呈現的 ENUM。所有支援的文字 MIME 類型清單，請參閱[文件](/docs/file-input-methods/#text-file-types)。

              **responseJsonSchema**：`object`

              選填。內部細節。請改用 `responseJsonSchema`，不要使用此欄位。

              **presencePenalty**：`number`

              選填。若某個 token 已在回應中出現過，則對下一個 token 的 logprobs 套用的 presence penalty。此懲罰為二元的開／關，不取決於 tokens 被使用的次數（第一次之後）。若要使用隨使用次數增加的懲罰，請使用 frequency_penalty。正值會抑制使用已在回應中出現過的 token，進而增加詞彙量。負值則會鼓勵使用已在回應中出現過的 token，進而減少詞彙量。

              **frequencyPenalty**：`number`

              選填。對下一個 token 的 logprobs 套用的 frequency penalty，會乘上每個 token 到目前為止在回應中出現的次數。正值會依 tokens 被使用的次數比例抑制重複使用：token 用得越多，模型就越難再次使用該 token，進而增加回應的詞彙量。注意：*負值*懲罰會依 tokens 被使用的次數比例，鼓勵模型重複使用 token。較小的負值會減少回應的詞彙量；較大的負值會使模型開始重複某個常見 token，直到達到 max_output_tokens 上限為止。

              **responseLogprobs**：`boolean`

              選填。若為 true，會在回應中匯出 logprobs 結果。

              **logprobs**：`integer`

              選填。僅在 response_logprobs=True 時有效。此欄位設定在每個解碼步驟要於 Candidate.logprobs_result 中傳回的 top logprobs 數量（包含所選候選）。數值必須介於 [0, 20] 之間。

              **enableEnhancedCivicAnswers**：`boolean`

              選填。啟用強化公民問答。此功能可能不適用於所有模型。



            ??? note "**responseModalities**：`string enum array` 選填。所請求的回應模態。表示模型可以傳回、且應在回應中預期出現的模態集合，必須與回應的模態完全相符。一個模型可能有多種受支援的模態組合。若所請求的模態與任何受支援的組合都不相符，將傳回錯誤。空清單等同於僅請求文字。"

                可能的值：

                - `MODALITY_UNSPECIFIED`：預設值。
                - `TEXT`：表示模型應傳回文字。
                - `IMAGE`：表示模型應傳回圖片。
                - `AUDIO`：表示模型應傳回音訊。





            ??? note "**speechConfig**：`SpeechConfig` 選填。語音生成設定。"

                ??? note "**voiceConfig**：`VoiceConfig` 單一語音輸出時的設定。"

                    ??? note "**voiceConfig**：`Union type` 要使用的說話者設定。"

                          聯集欄位 `voiceConfig` 只能是下列其中之一：



                        ??? note "**prebuiltVoiceConfig**：`PrebuiltVoiceConfig` 要使用的預建語音設定。"

                            **voiceName**：`string`

                            選填。要使用的預設語音名稱。



                          **voice**：`string`

                          選填。用於合成的說話者識別碼。支援的格式：

                          - 預建語音的說話者名稱（例如 `Orus` 或 `Kore`）。
                          - 已儲存語音的語音 ID（例如 `voice_xxx`）。
                          - 語音複製金鑰（例如 `voicekey_xxx`）。





                ??? note "**multiSpeakerVoiceConfig**：`MultiSpeakerVoiceConfig` 選填。多說話者設定的組態。與 voice_config 欄位互斥。"

                    ??? note "**speakerVoiceConfigs**：必填 `SpeakerVoiceConfig array` 所有已啟用的說話者語音。"

                          **speaker**：必填 `string`

                          要使用的說話者名稱。應與提示詞中的名稱相同。



                        ??? note "**voiceConfig**：必填 `VoiceConfig` 要使用的語音設定。"

                            ??? note "**voiceConfig**：`Union type` 要使用的說話者設定。"

                                  聯集欄位 `voiceConfig` 只能是下列其中之一：



                                ??? note "**prebuiltVoiceConfig**：`PrebuiltVoiceConfig` 要使用的預建語音設定。"

                                    **voiceName**：`string`

                                    選填。要使用的預設語音名稱。



                                  **voice**：`string`

                                  選填。用於合成的說話者識別碼。支援的格式：

                                  - 預建語音的說話者名稱（例如 `Orus` 或 `Kore`）。
                                  - 已儲存語音的語音 ID（例如 `voice_xxx`）。
                                  - 語音複製金鑰（例如 `voicekey_xxx`）。



                  **languageCode**：`string`

                  選填。使用者將應用程式設定為使用的 IETF [BCP-47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) 語言代碼。用於語音辨識與合成。有效值為：`de-DE`、`en-AU`、`en-GB`、`en-IN`、`en-US`、`es-US`、`fr-FR`、`hi-IN`、`pt-BR`、`ar-XA`、`es-ES`、`fr-CA`、`id-ID`、`it-IT`、`ja-JP`、`tr-TR`、`vi-VN`、`bn-IN`、`gu-IN`、`kn-IN`、`ml-IN`、`mr-IN`、`ta-IN`、`te-IN`、`nl-NL`、`ko-KR`、`cmn-CN`、`pl-PL`、`ru-RU` 以及 `th-TH`。





            ??? note "**thinkingConfig**：`ThinkingConfig` 選填。思考功能的設定。若對不支援思考的模型設定此欄位，將傳回錯誤。"

                  **includeThoughts**：`boolean`

                  表示是否要在回應中包含思考內容。若為 true，僅在有思考內容可用時才會傳回。

                  **thinkingBudget**：`integer`

                  模型應產生的思考 token 數量。



                ??? note "**thinkingLevel**：`string enum` 選填。控制模型在產生回應之前，內部推理過程的最大深度。預設值依模型而異。詳情請參閱[思考等級指南](/docs/thinking/#thinking-levels)。建議用於 Gemini 3 或更新的模型；用於較早的模型會導致錯誤。"

                    可能的值：

                    - `THINKING_LEVEL_UNSPECIFIED`：預設值。
                    - `MINIMAL`：幾乎不思考或不思考。
                    - `LOW`：低思考等級。
                    - `MEDIUM`：中思考等級。
                    - `HIGH`：高思考等級。
                    - `XHIGH`：極高思考等級。





            ??? note "**imageConfig**：`ImageConfig` 選填。圖片生成的設定。若對不支援這些設定選項的模型設定此欄位，將傳回錯誤。"

                **aspectRatio**：`string`

                選填。要生成的圖片長寬比。支援的長寬比：`1:1`、`1:4`、`4:1`、`1:8`、`8:1`、`2:3`、`3:2`、`3:4`、`4:3`、`4:5`、`5:4`、`9:16`、`16:9` 或 `21:9`。若未指定，模型會依所提供的任何參考圖片選擇預設長寬比。

                **imageSize**：`string`

                選填。指定所生成圖片的大小。支援的值為 `512`、`1K`、`2K`、`4K`。若未指定，模型會使用預設值 `1K`。





            ??? note "**mediaResolution**：`string enum` 選填。若有指定，將使用所指定的媒體解析度。"

                可能的值：

                - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                - `MEDIA_RESOLUTION_LOW`：媒體解析度設定為低（64 tokens）。
                - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設定為中（256 tokens）。
                - `MEDIA_RESOLUTION_HIGH`：媒體解析度設定為高（以 256 tokens 放大重新取景）。



              **enableAffectiveDialog**：`boolean`

              選填。若啟用，模型會偵測情緒並據此調整回應。



            ??? note "**responseFormat**：`ResponseFormatConfig` 選填。回應輸出格式的設定。可在扁平結構中為每種模態（文字、音訊、圖片）指定輸出設定。"

                ??? note "**text**：`TextResponseFormat` 選填。文字輸出格式設定。"

                    ??? note "**mimeType**：`string enum` 選填。文字輸出的 MIME 類型。"

                        可能的值：

                        - `MIME_TYPE_UNSPECIFIED`：預設值。此值未使用。
                        - `APPLICATION_JSON`：JSON 輸出格式。
                        - `TEXT_PLAIN`：純文字輸出格式。



                      **schema**：`object`

                      選填。輸出應符合的 JSON 架構。僅在 mime_type 為 APPLICATION_JSON 時適用。





                ??? note "**audio**：`AudioResponseFormat` 選填。音訊輸出格式設定。"

                    ??? note "**mimeType**：`string enum` 選填。音訊輸出的 MIME 類型。"

                        可能的值：

                        - `MIME_TYPE_UNSPECIFIED`：預設值。此值未使用。
                        - `AUDIO_MP3`：MP3 音訊格式。
                        - `AUDIO_OGG_OPUS`：OGG Opus 音訊格式。
                        - `AUDIO_L16`：原始 PCM（L16）音訊格式。
                        - `AUDIO_WAV`：WAV 音訊格式。
                        - `AUDIO_ALAW`：A-law 音訊格式。
                        - `AUDIO_MULAW`：Mu-law 音訊格式。





                    ??? note "**delivery**：`string enum` 選填。音訊輸出的傳遞模式。"

                        可能的值：

                        - `DELIVERY_UNSPECIFIED`：預設值。此值未使用。
                        - `INLINE`：音訊資料直接內嵌在回應中傳回。
                        - `URI`：音訊資料以 URI 形式傳回。



                      **sampleRate**：`integer`

                      選填。取樣率，單位為 Hz。

                      **bitRate**：`integer`

                      選填。位元率，單位為每秒位元數（bps）。僅適用於壓縮格式（MP3、Opus）。





                ??? note "**image**：`ImageResponseFormat` 選填。圖片輸出格式設定。"

                    ??? note "**mimeType**：`string enum` 選填。圖片輸出的 MIME 類型。"

                        可能的值：

                        - `MIME_TYPE_UNSPECIFIED`：預設值。此值未使用。
                        - `IMAGE_JPEG`：JPEG 圖片格式。





                    ??? note "**delivery**：`string enum` 選填。圖片輸出的傳遞模式。"

                        可能的值：

                        - `DELIVERY_UNSPECIFIED`：預設值。此值未使用。
                        - `INLINE`：圖片資料直接內嵌在回應中傳回。
                        - `URI`：圖片資料以 URI 形式傳回。





                    ??? note "**aspectRatio**：`string enum` 選填。圖片輸出的長寬比。"

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





                    ??? note "**imageSize**：`string enum` 選填。圖片輸出的大小。"

                        可能的值：

                        - `IMAGE_SIZE_UNSPECIFIED`：預設值。此值未使用。
                        - `IMAGE_SIZE_FIVE_TWELVE`：512px 圖片大小。
                        - `IMAGE_SIZE_ONE_K`：1K 圖片大小。
                        - `IMAGE_SIZE_TWO_K`：2K 圖片大小。
                        - `IMAGE_SIZE_FOUR_K`：4K 圖片大小。





            ??? note "**translationConfig**：`TranslationConfig` 選填。翻譯設定。"

                **targetLanguageCode**：必填 `string`

                翻譯的目標語言。支援的值為 BCP-47 語言代碼（例如「en」、「es」、「fr」）。

                **echoTargetLanguage**：`boolean`

                選填。若為 true，當說出目標語言時，模型會產生音訊，本質上是鸚鵡式複誦輸入。若為 false，則不會為目標語言產生音訊。





            ??? note "**audioTranscriptionConfig**：`AudioTranscriptionConfig` 選填。音訊轉錄（語音辨識）設定。"

                  **languageCodes**：`string array`

                  選填。BCP-47 語言代碼，提供音訊中所含語言的提示。若省略或為空，預設為自動語言偵測。

                  **customVocabulary**：`string array`

                  選填。自訂詞彙片語清單，用來引導語音辨識模型偏向辨識特定詞彙（產品名稱、專有名詞、術語）。

                  **wordTimestamp**：`boolean`

                  選填。設定是否產生逐字時間戳記。

                  **diarization**：`boolean`

                  選填。設定是否進行說話者分離。

                  **sourceText**：`string`

                  選填。要透過語音指令編輯或改寫的來源文字。在 `SMART` 模式下提供時，模型會將音訊輸入與此文字比對，並在候選回應中輸出完整的替代文字，而不是附加在其後。



                ??? note "**mode**：`string enum` 選填。設定轉錄模式。支援的值：`VERBATIM`、`SMART`。若未指定，預設為 `VERBATIM` 轉錄。在 `SMART` 模式下，模型會進行不流暢內容移除（消除填充詞、重複與錯誤起頭）、輕度文法清理、自動格式化（段落、項目符號、編號清單），以及輕微的使用者編輯（行內自我修正）。時間戳記與說話者分離與 `SMART` 模式不相容。"

                    可能的值：

                    - `MODE_UNSPECIFIED`：未指定的轉錄模式。
                    - `VERBATIM`：逐字轉錄模式。
                    - `SMART`：智慧轉錄模式。



          **systemInstruction**：[`Content`](/api-reference/generate-content/create-token/#Resource:Content)

          選填。使用者為模型提供的系統指令。注意：parts 中應僅使用文字，且每個 part 的內容會各自成段。

          **tools**：[`Tool`](/api-reference/generate-content/create-token/#Resource:Tool) `array`

          選填。模型可用來生成下一個回應的 `Tools` 清單。[`Tool`](/api-reference/generate-content/create-token/#Resource:Tool) 是一段程式碼，讓系統能與外部系統互動，以執行模型知識與範圍之外的一個或一組動作。



        ??? note "**realtimeInputConfig**：`RealtimeInputConfig` 選填。設定即時輸入的處理方式。"

            ??? note "**automaticActivityDetection**：`AutomaticActivityDetection` 選填。若未設定，預設啟用自動活動偵測。若停用自動語音偵測，用戶端必須傳送活動訊號。"

                  **disabled**：`boolean`

                  選填。若啟用（預設），偵測到的語音與文字輸入會計為活動。若停用，用戶端必須傳送活動訊號。



                ??? note "**startOfSpeechSensitivity**：`string enum` 選填。決定偵測到語音的可能性高低。"

                    可能的值：

                    - `START_SENSITIVITY_UNSPECIFIED`：預設為 START_SENSITIVITY_HIGH。
                    - `START_SENSITIVITY_HIGH`：自動偵測會較常偵測到語音開始。
                    - `START_SENSITIVITY_LOW`：自動偵測會較少偵測到語音開始。



                  **prefixPaddingMs**：`integer`

                  選填。在確認語音開始之前，必須偵測到的語音持續時間。此值越低，語音開始偵測越靈敏，也能辨識更短的語音；不過，這也會提高誤判的機率。



                ??? note "**endOfSpeechSensitivity**：`string enum` 選填。決定偵測到的語音被判定結束的可能性高低。"

                    可能的值：

                    - `END_SENSITIVITY_UNSPECIFIED`：預設為 END_SENSITIVITY_HIGH。
                    - `END_SENSITIVITY_HIGH`：自動偵測會較常結束語音。
                    - `END_SENSITIVITY_LOW`：自動偵測會較少結束語音。



                  **silenceDurationMs**：`integer`

                  選填。在確認語音結束之前，必須偵測到的非語音（例如靜音）持續時間。此值越大，可容忍的語音間隔越長，不會中斷使用者的活動，但會增加模型的延遲。





            ??? note "**activityHandling**：`ActivityHandling` 選填。定義活動所產生的效果。"

                可能的值：

                - `ACTIVITY_HANDLING_UNSPECIFIED`：若未指定，預設行為為 `START_OF_ACTIVITY_INTERRUPTS`。
                - `START_OF_ACTIVITY_INTERRUPTS`：若為 true，活動開始時會中斷模型的回應（也稱為「插話」）。模型目前的回應會在中斷當下被截斷。這是預設行為。
                - `NO_INTERRUPTION`：模型的回應不會被中斷。





            ??? note "**turnCoverage**：`string enum` 選填。定義使用者的輪次中包含哪些輸入。"

                可能的值：

                - `TURN_COVERAGE_UNSPECIFIED`：若未指定，會依模型選擇預設行為。例如，Gemini 2.5 的預設為 `TURN_INCLUDES_ONLY_ACTIVITY`，而 Gemini 3.1 及之後的版本則為 `TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO`。
                - `TURN_INCLUDES_ONLY_ACTIVITY`：包含自上一輪以來的活動，排除非活動（例如音訊串流中的靜音）。
                - `TURN_INCLUDES_ALL_INPUT`：包含自上一輪以來的所有即時輸入，包含非活動（例如音訊串流中的靜音）。
                - `TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO`：包含自上一輪以來的音訊活動與所有影片。在自動活動偵測下，音訊活動是指語音，不包含靜音。



              **interimTranscriptTimestampEnabled**：`boolean`

              選填。設定是否啟用暫時轉錄時間戳記。





        ??? note "**sessionResumption**：`SessionResumptionConfig` 選填。設定工作階段恢復機制。若有包含，伺服器會傳送 `SessionResumptionUpdate` 訊息。"

            **handle**：`string`

            先前工作階段的控制代碼。若不存在，則會建立新的工作階段。工作階段控制代碼來自先前連線中的 `SessionResumptionUpdate.token` 值。





        ??? note "**contextWindowCompression**：`ContextWindowCompressionConfig` 選填。設定上下文視窗壓縮機制。若有包含，當上下文超過所設定的長度時，伺服器會自動縮減其大小。"

            ??? note "**compressionMechanism**：`Union type` 所使用的上下文視窗壓縮機制。"

                  聯集欄位 `compressionMechanism` 只能是下列其中之一：



                ??? note "**slidingWindow**：`SlidingWindow` 滑動視窗機制。"

                    **targetTokens**：`string`

                    要保留的目標 token 數量。預設值為 trigger_tokens/2。捨棄部分上下文視窗會造成延遲暫時增加，因此應校準此值，以避免頻繁進行壓縮操作。



              **triggerTokens**：`string`

              觸發上下文視窗壓縮所需的 token 數量（在執行一個輪次之前）。此設定可用來在品質與延遲之間取得平衡，因為較短的上下文視窗可能帶來更快的模型回應。不過，任何壓縮操作都會造成延遲暫時增加，因此不應頻繁觸發。若未設定，預設為模型上下文視窗上限的 80%。這樣會為下一個使用者請求／模型回應保留 20%。





        ??? note "**inputAudioTranscription**：`AudioTranscriptionConfig` 選填。若有設定，會啟用語音輸入的轉錄。轉錄會與輸入音訊的語言對齊（若有設定）。"

              **languageCodes**：`string array`

              選填。BCP-47 語言代碼，提供音訊中所含語言的提示。若省略或為空，預設為自動語言偵測。

              **customVocabulary**：`string array`

              選填。自訂詞彙片語清單，用來引導語音辨識模型偏向辨識特定詞彙（產品名稱、專有名詞、術語）。

              **wordTimestamp**：`boolean`

              選填。設定是否產生逐字時間戳記。

              **diarization**：`boolean`

              選填。設定是否進行說話者分離。

              **sourceText**：`string`

              選填。要透過語音指令編輯或改寫的來源文字。在 `SMART` 模式下提供時，模型會將音訊輸入與此文字比對，並在候選回應中輸出完整的替代文字，而不是附加在其後。



            ??? note "**mode**：`string enum` 選填。設定轉錄模式。支援的值：`VERBATIM`、`SMART`。若未指定，預設為 `VERBATIM` 轉錄。在 `SMART` 模式下，模型會進行不流暢內容移除（消除填充詞、重複與錯誤起頭）、輕度文法清理、自動格式化（段落、項目符號、編號清單），以及輕微的使用者編輯（行內自我修正）。時間戳記與說話者分離與 `SMART` 模式不相容。"

                可能的值：

                - `MODE_UNSPECIFIED`：未指定的轉錄模式。
                - `VERBATIM`：逐字轉錄模式。
                - `SMART`：智慧轉錄模式。





        ??? note "**outputAudioTranscription**：`AudioTranscriptionConfig` 選填。若有設定，會啟用模型音訊輸出的轉錄。轉錄會與輸出音訊所指定的語言代碼對齊（若有設定）。"

              **languageCodes**：`string array`

              選填。BCP-47 語言代碼，提供音訊中所含語言的提示。若省略或為空，預設為自動語言偵測。

              **customVocabulary**：`string array`

              選填。自訂詞彙片語清單，用來引導語音辨識模型偏向辨識特定詞彙（產品名稱、專有名詞、術語）。

              **wordTimestamp**：`boolean`

              選填。設定是否產生逐字時間戳記。

              **diarization**：`boolean`

              選填。設定是否進行說話者分離。

              **sourceText**：`string`

              選填。要透過語音指令編輯或改寫的來源文字。在 `SMART` 模式下提供時，模型會將音訊輸入與此文字比對，並在候選回應中輸出完整的替代文字，而不是附加在其後。



            ??? note "**mode**：`string enum` 選填。設定轉錄模式。支援的值：`VERBATIM`、`SMART`。若未指定，預設為 `VERBATIM` 轉錄。在 `SMART` 模式下，模型會進行不流暢內容移除（消除填充詞、重複與錯誤起頭）、輕度文法清理、自動格式化（段落、項目符號、編號清單），以及輕微的使用者編輯（行內自我修正）。時間戳記與說話者分離與 `SMART` 模式不相容。"

                可能的值：

                - `MODE_UNSPECIFIED`：未指定的轉錄模式。
                - `VERBATIM`：逐字轉錄模式。
                - `SMART`：智慧轉錄模式。





        ??? note "**proactivity**：`ProactivityConfig` 選填。設定模型的主動性。這讓模型能主動回應輸入，並忽略不相關的輸入。"

            **proactiveAudio**：`boolean`

            選填。若啟用，模型可以拒絕回應上一個提示詞。例如，這讓模型能忽略離題的語音，或在使用者尚未提出請求時保持沉默。

            **proactiveVideo**：`boolean`

            選填。若啟用，系統可能會在每收到一張圖片時觸發一次生成。這需要啟用 `proactive_audio`。生成速率取決於傳入圖片的速率，可能大幅增加成本。





        ??? note "**historyConfig**：`HistoryConfig` 選填。設定用戶端與伺服器之間的歷史紀錄交換。"

            **initialHistoryInClientContent**：`boolean`

            選填。若為 true，在傳送 `setup_complete` 之後，伺服器會先等待並處理 `client_content` 訊息，直到 `turn_complete` 為 `true` 為止。這段初始歷史紀錄不會觸發模型呼叫，且可以以 `MODEL` 角色結尾。在 `turn_complete` 為 `true` 之後，用戶端即可透過 `realtime_input` 開始即時對話。



          **labels**：`object`

          選填。帶有使用者自訂中繼資料的請求標籤。選填。標籤必須符合標準的統一 Cloud 標籤要求：

          - 標籤鍵必須以字母開頭。
          - 標籤鍵與值的長度不得超過 63 個字元（Unicode 碼位），且只能包含小寫字母、數字字元、底線與連字號。
          - 允許使用國際字元。

          用法：

          - 來自彙總者的安全識別碼：使用鍵 `safety_identifier`（例如 `{"safety_identifier": "user_session_123"}`）



  

---


  **expireTime**：`string`

  選填。僅供輸入。不可變。使用所產生的 token 時，超過此時間之後，BidiGenerateContent 工作階段中的訊息將被拒絕。（Gemini 可能會在此時間之後預先關閉工作階段。）若未設定，預設為 30 分鐘後。若有設定，此值必須小於未來 20 小時。

  

---


  **newSessionExpireTime**：`string`

  選填。僅供輸入。不可變。超過此時間之後，使用本次請求所產生 token 的新 Live API 工作階段將被拒絕。若未設定，預設為 60 秒後。若有設定，此值必須小於未來 20 小時。

  

---


  **uses**：`integer`

  選填。僅供輸入。不可變。token 可被使用的次數。若此值為零，則不套用上限。恢復 Live API 工作階段不計為一次使用。若未指定，預設為 1。

  

---


  **fieldMask**：`string`

  選填。僅供輸入。不可變。若 field_mask 為空，且不存在 `bidi_generate_content_setup`，則有效的 `BidiGenerateContentSetup` 訊息會取自 Live API 連線。若 field_mask 為空，且*存在* `bidi_generate_content_setup`，則有效的 `BidiGenerateContentSetup` 訊息會完全取自本次請求中的 `bidi_generate_content_setup`，並忽略 Live API 連線中的設定訊息。若 field_mask 不為空，則 `bidi_generate_content_setup` 中的對應欄位會覆寫 Live API 連線設定訊息中的欄位。

  

  

  **範例請求** 

  

=== "REST"

      ```sh
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/auth_tokens" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```


  


  
## 回應 {#response}

  
  **name**：`string`

  僅供輸出。識別碼。token 本身。

  

  

  
  **範例回應** 

  ```json
  {
    "bidiGenerateContentSetup": {
      "model": "string",
      "generationConfig": {
        "candidateCount": 0,
        "stopSequences": [
          "string"
        ],
        "maxOutputTokens": 0,
        "temperature": 0.0,
        "topP": 0.0,
        "topK": 0,
        "seed": 0,
        "responseMimeType": "string",
        "responseJsonSchema": {},
        "presencePenalty": 0.0,
        "frequencyPenalty": 0.0,
        "responseLogprobs": true,
        "logprobs": 0,
        "enableEnhancedCivicAnswers": true,
        "responseModalities": [
          "MODALITY_UNSPECIFIED"
        ],
        "speechConfig": {
          "voiceConfig": {
            "prebuiltVoiceConfig": "...",
            "voice": "string"
          },
          "multiSpeakerVoiceConfig": {
            "speakerVoiceConfigs": [
              "..."
            ]
          },
          "languageCode": "string"
        },
        "thinkingConfig": {
          "includeThoughts": true,
          "thinkingBudget": 0,
          "thinkingLevel": "THINKING_LEVEL_UNSPECIFIED"
        },
        "imageConfig": {
          "aspectRatio": "string",
          "imageSize": "string"
        },
        "mediaResolution": "MEDIA_RESOLUTION_UNSPECIFIED",
        "enableAffectiveDialog": true,
        "responseFormat": {
          "text": {
            "mimeType": "MIME_TYPE_UNSPECIFIED",
            "schema": {}
          },
          "audio": {
            "mimeType": "MIME_TYPE_UNSPECIFIED",
            "delivery": "DELIVERY_UNSPECIFIED",
            "sampleRate": 0,
            "bitRate": 0
          },
          "image": {
            "mimeType": "MIME_TYPE_UNSPECIFIED",
            "delivery": "DELIVERY_UNSPECIFIED",
            "aspectRatio": "ASPECT_RATIO_UNSPECIFIED",
            "imageSize": "IMAGE_SIZE_UNSPECIFIED"
          }
        },
        "translationConfig": {
          "targetLanguageCode": "string",
          "echoTargetLanguage": true
        },
        "audioTranscriptionConfig": {
          "languageCodes": [
            "string"
          ],
          "customVocabulary": [
            "string"
          ],
          "wordTimestamp": true,
          "diarization": true,
          "sourceText": "string",
          "mode": "MODE_UNSPECIFIED"
        }
      },
      "systemInstruction": {
        "parts": [
          {
            "text": "string",
            "inlineData": {
              "mimeType": "...",
              "data": "...",
              "displayName": "..."
            },
            "functionCall": {
              "name": "...",
              "id": "...",
              "args": "..."
            },
            "functionResponse": {
              "name": "...",
              "response": "...",
              "id": "...",
              "parts": "...",
              "willContinue": "...",
              "scheduling": "..."
            },
            "fileData": {
              "fileUri": "...",
              "mimeType": "...",
              "displayName": "..."
            },
            "executableCode": {
              "language": "...",
              "code": "...",
              "id": "..."
            },
            "codeExecutionResult": {
              "outcome": "...",
              "id": "...",
              "output": "..."
            },
            "toolCall": {
              "toolType": "...",
              "id": "...",
              "toolName": "...",
              "args": "..."
            },
            "toolResponse": {
              "toolType": "...",
              "id": "...",
              "response": "..."
            },
            "videoMetadata": {
              "startOffset": "...",
              "endOffset": "...",
              "fps": "...",
              "contentLayers": "..."
            },
            "documentMetadata": {
              "startPage": "...",
              "endPage": "...",
              "contentLayers": "..."
            },
            "spreadsheetMetadata": {
              "visibleCells": "...",
              "sheetIndex": "...",
              "contentLayers": "..."
            },
            "audioMetadata": {
              "startOffset": "...",
              "endOffset": "..."
            },
            "thought": true,
            "thoughtSignature": "string",
            "partMetadata": {},
            "mediaResolution": {
              "level": "..."
            },
            "mediaProcessing": "MEDIA_PROCESSING_UNSPECIFIED",
            "audioTranscription": {
              "text": "...",
              "speakerLabel": "...",
              "words": "..."
            },
            "speechMetadata": {
              "speaker": "...",
              "style": "..."
            }
          }
        ],
        "role": "string"
      },
      "tools": [
        {
          "functionDeclarations": [
            {
              "name": "string",
              "description": "string",
              "parameters": "...",
              "parametersJsonSchema": {},
              "response": "...",
              "responseJsonSchema": {},
              "behavior": "UNSPECIFIED"
            }
          ],
          "googleSearchRetrieval": {
            "dynamicRetrievalConfig": {
              "mode": "...",
              "dynamicThreshold": "..."
            }
          },
          "codeExecution": {},
          "googleSearch": {
            "timeRangeFilter": {
              "startTime": "...",
              "endTime": "..."
            },
            "searchTypes": {
              "webSearch": "...",
              "imageSearch": "..."
            }
          },
          "computerUse": {
            "environment": "ENVIRONMENT_UNSPECIFIED",
            "excludedPredefinedFunctions": [
              "string"
            ],
            "enablePromptInjectionDetection": true,
            "disabledSafetyPolicies": [
              "SAFETY_POLICY_UNSPECIFIED"
            ]
          },
          "urlContext": {},
          "fileSearch": {
            "fileSearchStoreNames": [
              "string"
            ],
            "topK": 0,
            "metadataFilter": "string"
          },
          "mcpServers": [
            {
              "streamableHttpTransport": "...",
              "name": "string"
            }
          ],
          "googleMaps": {
            "enableWidget": true
          }
        }
      ],
      "realtimeInputConfig": {
        "automaticActivityDetection": {
          "disabled": true,
          "startOfSpeechSensitivity": "START_SENSITIVITY_UNSPECIFIED",
          "prefixPaddingMs": 0,
          "endOfSpeechSensitivity": "END_SENSITIVITY_UNSPECIFIED",
          "silenceDurationMs": 0
        },
        "activityHandling": "ACTIVITY_HANDLING_UNSPECIFIED",
        "turnCoverage": "TURN_COVERAGE_UNSPECIFIED",
        "interimTranscriptTimestampEnabled": true
      },
      "sessionResumption": {
        "handle": "string"
      },
      "contextWindowCompression": {
        "slidingWindow": {
          "targetTokens": "string"
        },
        "triggerTokens": "string"
      },
      "inputAudioTranscription": {
        "languageCodes": [
          "string"
        ],
        "customVocabulary": [
          "string"
        ],
        "wordTimestamp": true,
        "diarization": true,
        "sourceText": "string",
        "mode": "MODE_UNSPECIFIED"
      },
      "outputAudioTranscription": {
        "languageCodes": [
          "string"
        ],
        "customVocabulary": [
          "string"
        ],
        "wordTimestamp": true,
        "diarization": true,
        "sourceText": "string",
        "mode": "MODE_UNSPECIFIED"
      },
      "proactivity": {
        "proactiveAudio": true,
        "proactiveVideo": true
      },
      "historyConfig": {
        "initialHistoryInClientContent": true
      },
      "labels": {}
    },
    "name": "string",
    "expireTime": "string",
    "newSessionExpireTime": "string",
    "uses": 0,
    "fieldMask": "string"
  }
  ```

  


## 資料模型 {#data-models}

### Content {#Resource:Content}

包含訊息多部分內容的基礎結構化資料類型。

[`Content`](/api-reference/generate-content/create-token/#Resource:Content) 包含一個 `role` 欄位，用來指定 [`Content`](/api-reference/generate-content/create-token/#Resource:Content) 的產生者；以及一個 `parts` 欄位，包含構成訊息輪次內容的多部分資料。

**屬性：**


  

??? note "**parts**：`Part array` 構成單一訊息的有序 `Parts`。各 Part 可能有不同的 MIME 類型。"

    ??? note "**data**：`Union type`"

          聯集欄位 `data` 只能是下列其中之一：

          **text**：`string`

          行內文字。



        ??? note "**inlineData**：`Blob` 行內媒體位元組。"

            **mimeType**：`string`

            來源資料的 IANA 標準 MIME 類型。支援的類型範例：

            - 圖片：image/png、image/jpeg、image/jpg、image/webp、image/heic、image/heif、image/gif、image/avif
            - 音訊：audio/*、video/audio/s16le、video/audio/wav
            - 影片：video/*
            - 文字：text/plain、text/html、text/css、text/javascript、text/x-typescript、text/csv、text/markdown、text/x-python、text/xml、text/rtf、video/text/timestamp
            - 應用程式：application/x-javascript、application/x-typescript、application/x-python-code、application/json、application/x-ipynb+json、application/rtf、application/pdf。更多背景資訊，請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

            **data**：`string`

            媒體格式的原始位元組。

            **displayName**：`string`

            選填。指定用來向模型指稱此 blob 的名稱（例如「my_blob.png」）。當 `verbalization_mode` 設定為 `REFERENCE_ONLY` 時，作為 blob 參照識別碼使用。





        ??? note "**functionCall**：`FunctionCall` 模型傳回的預測 `FunctionCall`，包含一個表示 `FunctionDeclaration.name` 的字串，以及引數與其值。"

            **name**：必填 `string`

            要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

            **id**：`string`

            選填。函式呼叫的唯一識別碼。若有填入，用戶端應執行該 `function_call`，並以相符的 `id` 傳回回應。

            **args**：`object`

            選填。JSON 物件格式的函式參數與值。





        ??? note "**functionResponse**：`FunctionResponse` `FunctionCall` 的結果輸出，包含一個表示 `FunctionDeclaration.name` 的字串，以及一個包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。"

              **name**：必填 `string`

              要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

              **response**：必填 `object`

              JSON 物件格式的函式回應。呼叫端可以使用任何符合函式語法的自選鍵來傳回函式輸出，例如「output」、「result」等。特別是，若函式呼叫執行失敗，回應中可以包含「error」鍵，將錯誤詳情傳回給模型。多媒體內容可以透過子物件納入，該子物件包含單一「$ref」鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，指向持有該多媒體的 `FunctionResponsePart`。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

              **id**：`string`

              選填。此回應所對應的函式呼叫識別碼。由用戶端填入，以對應相對應的函式呼叫 `id`。



            ??? note "**parts**：`FunctionResponsePart array` 選填。構成函式回應的有序 `Parts`。各 Part 可能有不同的 IANA MIME 類型。"

                ??? note "**data**：`Union type` 函式回應部分的資料。"

                      聯集欄位 `data` 只能是下列其中之一：



                    ??? note "**inlineData**：`FunctionResponseBlob` 行內媒體位元組。"

                        **mimeType**：`string`

                        來源資料的 IANA 標準 MIME 類型。範例：

                        - image/png
                        - image/jpeg

                        若提供不受支援的 MIME 類型，將傳回錯誤。支援類型的完整清單，請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                        **data**：`string`

                        媒體格式的原始位元組。

                        **displayName**：`string`

                        選填。blob 的顯示名稱。用來提供標籤或檔案名稱以區分各 blob，並可從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                    ??? note "**fileData**：`FunctionResponseFileData` 以 URI 為基礎的資料。"

                        **fileUri**：必填 `string`

                        URI。

                        **mimeType**：`string`

                        來源資料的 IANA 標準 MIME 類型。若提供不受支援的 MIME 類型，將傳回錯誤。支援類型的完整清單，請參閱[多模態函式回應](/docs/function-calling/#multimodal)與[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                        **displayName**：`string`

                        選填。檔案的顯示名稱。用來提供標籤或檔案名稱以區分檔案資料，並可從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                ??? note "**metadata**：`Union type` 控制資料的額外前置處理。當存在 `inline_data` 或 `file_data` 時設定此欄位，以設定每個部分的靜態媒體前置處理。"


                      聯集欄位 `metadata` 只能是下列其中之一：


                    ??? note "**videoMetadata**：`VideoMetadata` 選填。影片中繼資料。中繼資料應僅在影片資料以 inline_data 或 file_data 呈現時指定。"


                          **startOffset**：`string`

                          選填。影片的開始位移。

                          **endOffset**：`string`

                          選填。影片的結束位移。

                          **fps**：`number`

                          選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。


                        ??? note "**contentLayers**：`string enum array` 選填。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                              可能的值：

                              - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                              - `FRAMES`：擷取影片影格。
                              - `AUDIO`：擷取音軌。
                              - `TRANSCRIPT`：擷取音訊逐字稿。


                    ??? note "**documentMetadata**：`DocumentMetadata` 選填。文件中繼資料。中繼資料應僅在文件資料以 inline_data 或 file_data 呈現時指定。"


                          **startPage**：`integer`

                          選填。起始頁，以 1 起算，包含起始頁。

                          **endPage**：`integer`

                          選填。結束頁，以 1 起算，包含結束頁。


                        ??? note "**contentLayers**：`string enum array` 選填。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                              可能的值：

                              - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                              - `PAGE_IMAGE`：轉譯後的頁面影像。
                              - `PAGE_TEXT`：擷取的頁面文字。


                    ??? note "**spreadsheetMetadata**：`SpreadsheetMetadata` 選填。試算表中繼資料。中繼資料應僅在試算表資料以 inline_data 或 file_data 呈現時指定。"


                          **visibleCells**：`string`

                          選填。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                          **sheetIndex**：`integer`

                          選填。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                        ??? note "**contentLayers**：`string enum array` 選填。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                              可能的值：

                              - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                              - `DATA`：儲存格值、合併儲存格與格式。
                              - `FORMULAS`：公式運算式及其計算結果。
                              - `VISUAL`：工作表的轉譯影像。


                    ??? note "**audioMetadata**：`AudioMetadata` 選填。音訊中繼資料。中繼資料應僅在音訊資料以 inline_data 或 file_data 呈現時指定。"


                          **startOffset**：`string`

                          選填。音訊的開始位移。

                          **endOffset**：`string`

                          選填。音訊的結束位移，相對於音訊串流的開頭。


                ??? note "**mediaProcessing**：`string enum` 選填。模型如何處理此部分的媒體以進行理解。僅對影片部分（影片 mime 的 `inline_data` 或 `file_data`）有意義。非影片部分會忽略此欄位。"

                    可能的值：

                    - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型專屬的處理方式。
                    - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
                    - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。



                ??? note "**mediaResolution**：`V1mainMediaResolution` 選填。輸入媒體的媒體解析度。"


                    ??? note "**value**：`Union type` 媒體解析度等級。"


                          聯集欄位 `value` 只能是下列其中之一：


                        ??? note "**level**：`string enum` 用於指定媒體的 Tokenizer 品質。適用於 Gemini API 支援。"


                              可能的值：

                              - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                              - `MEDIA_RESOLUTION_LOW`：媒體解析度設定為低。
                              - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設定為中。
                              - `MEDIA_RESOLUTION_HIGH`：媒體解析度設定為高。
                              - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設定為極高。


              **willContinue**：`boolean`

              選填。表示函式呼叫會繼續，且將傳回更多回應，使函式呼叫變成產生器。僅適用於 NON_BLOCKING 函式呼叫，否則會被忽略。若設定為 false，後續回應將不被考量。允許傳回空的 `response` 並將 `will_continue=False`，以表示函式呼叫已完成。這仍可能觸發模型生成。若要避免觸發生成並結束函式呼叫，請另外將 `scheduling` 設定為 `SILENT`。



            ??? note "**scheduling**：`string enum` 選填。指定回應在對話中的排程方式。僅適用於 NON_BLOCKING 函式呼叫，否則會被忽略。預設為 WHEN_IDLE。"

                可能的值：

                - `SCHEDULING_UNSPECIFIED`：此值未使用。
                - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發生成。
                - `WHEN_IDLE`：將結果加入對話上下文，並提示生成輸出，但不中斷進行中的生成。
                - `INTERRUPT`：將結果加入對話上下文，中斷進行中的生成，並提示生成輸出。





        ??? note "**fileData**：`FileData` 以 URI 為基礎的資料。"

            **fileUri**：必填 `string`

            URI。

            **mimeType**：`string`

            選填。來源資料的 IANA 標準 MIME 類型。

            **displayName**：`string`

            選填。指定用來向模型指稱此檔案的名稱（例如「my_file.pdf」）。當 `verbalization_mode` 設定為 `REFERENCE_ONLY` 時，作為檔案參照識別碼使用。





        ??? note "**executableCode**：`ExecutableCode` 由模型生成、預定要執行的程式碼。"

            ??? note "**language**：必填 `string enum` `code` 的程式設計語言。"

                可能的值：

                - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用此值。
                - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 是預設語言。



              **code**：必填 `string`

              要執行的程式碼。

              **id**：`string`

              選填。`ExecutableCode` 部分的唯一識別碼。伺服器會傳回 `CodeExecutionResult`，其 `id` 與之相符。





        ??? note "**codeExecutionResult**：`CodeExecutionResult` 執行 `ExecutableCode` 的結果。"

            ??? note "**outcome**：必填 `string enum` 程式碼執行的結果。"

                可能的值：

                - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用此值。
                - `OUTCOME_OK`：程式碼執行成功完成。`output` 包含 stdout（若有）。
                - `OUTCOME_FAILED`：程式碼執行失敗。`output` 包含 stderr 與 stdout（若有）。
                - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已被取消。可能有、也可能沒有部分 `output`。



              **id**：`string`

              選填。此結果所對應的 `ExecutableCode` 部分識別碼。僅在對應的 `ExecutableCode` 有 id 時才會填入。

              **output**：`string`

              選填。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。





        ??? note "**toolCall**：`ToolCall` 伺服器端工具呼叫。當模型預測到應在伺服器上執行的工具叫用時，會填入此欄位。預期用戶端會將此訊息回傳給 API。"

            ??? note "**toolType**：必填 `V1mainToolType` 被呼叫的工具類型。"

                可能的值：

                - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



              **id**：`string`

              選填。工具呼叫的唯一識別碼。伺服器會以相符的 `id` 傳回工具回應。

              **toolName**：`string`

              選填。被呼叫的工具名稱。

              **args**：`object`

              選填。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





        ??? note "**toolResponse**：`ToolResponse` 伺服器端 `ToolCall` 執行的輸出。當用戶端執行對應的 `ToolCall` 後，會以其結果填入此欄位。"

            ??? note "**toolType**：必填 `V1mainToolType` 被呼叫的工具類型，其 `tool_type` 與對應的 `ToolCall` 相符。"

                可能的值：

                - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應 Tool.google_search.search_types.web_search。
                - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應 Tool.google_search.search_types.image_search。
                - `URL_CONTEXT`：URL 上下文工具，對應 Tool.url_context。
                - `GOOGLE_MAPS`：Google 地圖工具，對應 Tool.google_maps。
                - `FILE_SEARCH`：檔案搜尋工具，對應 Tool.file_search。
                - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



              **id**：`string`

              選填。此回應所對應的工具呼叫識別碼。

              **response**：`object`

              選填。工具回應。





    ??? note "**metadata**：`Union type` 控制資料的額外前置處理。當存在 `inline_data` 或 `file_data` 時設定此欄位，以設定每個部分的靜態媒體前置處理。"

          聯集欄位 `metadata` 只能是下列其中之一：



        ??? note "**videoMetadata**：`VideoMetadata` 選填。影片中繼資料。中繼資料應僅在影片資料以 inline_data 或 file_data 呈現時指定。"

            **startOffset**：`string`

            選填。影片的開始位移。

            **endOffset**：`string`

            選填。影片的結束位移。

            **fps**：`number`

            選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。


            ??? note "**contentLayers**：`string enum array` 選填。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                  可能的值：

                  - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                  - `FRAMES`：擷取影片影格。
                  - `AUDIO`：擷取音軌。
                  - `TRANSCRIPT`：擷取音訊逐字稿。


        ??? note "**documentMetadata**：`DocumentMetadata` 選填。文件中繼資料。中繼資料應僅在文件資料以 inline_data 或 file_data 呈現時指定。"


              **startPage**：`integer`

              選填。起始頁，以 1 起算，包含起始頁。

              **endPage**：`integer`

              選填。結束頁，以 1 起算，包含結束頁。


            ??? note "**contentLayers**：`string enum array` 選填。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                  可能的值：

                  - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                  - `PAGE_IMAGE`：轉譯後的頁面影像。
                  - `PAGE_TEXT`：擷取的頁面文字。


        ??? note "**spreadsheetMetadata**：`SpreadsheetMetadata` 選填。試算表中繼資料。中繼資料應僅在試算表資料以 inline_data 或 file_data 呈現時指定。"


              **visibleCells**：`string`

              選填。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

              **sheetIndex**：`integer`

              選填。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


            ??? note "**contentLayers**：`string enum array` 選填。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                  可能的值：

                  - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                  - `DATA`：儲存格值、合併儲存格與格式。
                  - `FORMULAS`：公式運算式及其計算結果。
                  - `VISUAL`：工作表的轉譯影像。


        ??? note "**audioMetadata**：`AudioMetadata` 選填。音訊中繼資料。中繼資料應僅在音訊資料以 inline_data 或 file_data 呈現時指定。"


              **startOffset**：`string`

              選填。音訊的開始位移。

              **endOffset**：`string`

              選填。音訊的結束位移，相對於音訊串流的開頭。



      **thought**：`boolean`

      選填。表示此部分是否為來自模型的思考。

      **thoughtSignature**：`string`

      選填。思考的不透明簽章，可在後續請求中重複使用。

      **partMetadata**：`object`

      與 Part 相關聯的自訂中繼資料。使用 genai.Part 作為內容表示的代理，可能需要追蹤額外資訊。例如，它可以是 Part 所源自的檔案／來源名稱，或是多工處理多個 Part 串流的方式。



    ??? note "**mediaResolution**：`V1mainMediaResolution` 選填。輸入媒體的媒體解析度。"

        ??? note "**value**：`Union type` 媒體解析度等級。"

              聯集欄位 `value` 只能是下列其中之一：



            ??? note "**level**：`string enum` 用於指定媒體的 Tokenizer 品質。適用於 Gemini API 支援。"

                可能的值：

                - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                - `MEDIA_RESOLUTION_LOW`：媒體解析度設定為低。
                - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設定為中。
                - `MEDIA_RESOLUTION_HIGH`：媒體解析度設定為高。
                - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設定為極高。





    ??? note "**mediaProcessing**：`string enum` 選填。模型如何處理此部分的媒體以進行理解。僅對影片部分（影片 mime 的 `inline_data` 或 `file_data`）有意義。非影片部分會忽略此欄位。"

        可能的值：

        - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型專屬的處理方式。
        - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
        - `AGENTIC`：由模型驅動的動態導覽。建議用於大多數使用情境。





    ??? note "**audioTranscription**：`AudioTranscription` 選填。音訊（輸入或輸出）轉錄。僅在此 Part 包含音訊資料時設定。"

          **text**：必填 `string`

          此音訊片段的轉錄文字。

          **speakerLabel**：`string`

          選填。標示此音訊片段說話者的標籤（例如「spk_1」、「spk_2」）。在設定說話者分離時出現。



        ??? note "**words**：`WordInfo array` 選填。詳細的逐字轉錄與時間資訊。在設定 word_timestamp 時出現。"

            **word**：必填 `string`

            單字的轉錄。

            **startOffset**：`string`

            選填。單字相對於音訊開頭的開始時間位移。

            **endOffset**：`string`

            選填。單字相對於音訊開頭的結束時間位移。





    ??? note "**speechMetadata**：`SpeechMetadata` 選填。套用於文字部分的中繼資料，用來自訂其朗讀或合成方式，例如指定說話者身分或說話風格。"

        **speaker**：`string`

        選填。多說話者合成時選用的說話者名稱。

        **style**：`string`

        選填。語音合成的選用風格指令。



  

---


  **role**：`string`

  選填。內容的產生者。必須為 'user' 或 'model'。設定此欄位對多輪對話很有用，否則可以留空或不設定。


### Schema {#Resource:Schema}

[`Schema`](/api-reference/generate-content/create-token/#Resource:Schema) 物件允許定義輸入與輸出資料類型。
這些類型可以是物件，也可以是基本型別與陣列。
代表 [OpenAPI 3.0 schema 物件](https://spec.openapis.org/oas/v3.0.3#schema)的一個精選子集。

**屬性：**


  

??? note "**type**：必填 `Type` 資料類型。"

    可能的值：

    - `TYPE_UNSPECIFIED`：未指定，不應使用。
    - `STRING`：字串類型。
    - `NUMBER`：數字類型。
    - `INTEGER`：整數類型。
    - `BOOLEAN`：布林類型。
    - `ARRAY`：陣列類型。
    - `OBJECT`：物件類型。
    - `NULL`：Null 類型。



  

---


  **format**：`string`

  選填。資料的格式。允許任何值，但大多數值不會觸發任何特殊功能。

  

---


  **title**：`string`

  選填。架構的標題。

  

---


  **description**：`string`

  選填。參數的簡短說明。可以包含使用範例。參數說明可以採用 Markdown 格式。

  

---


  **nullable**：`boolean`

  選填。表示值是否可以為 null。

  

---


  **enum**：`string array`

  選填。具有 enum 格式的 Type.STRING 元素的可能值。例如，我們可以將 Enum Direction 定義為：{type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]}

  

---


  **items**：[`Schema`](/api-reference/generate-content/create-token/#Resource:Schema)

  選填。Type.ARRAY 元素的架構。

  

---


  **maxItems**：`string`

  選填。Type.ARRAY 的元素數量上限。

  

---


  **minItems**：`string`

  選填。Type.ARRAY 的元素數量下限。

  

---


  **properties**：`object`

  選填。Type.OBJECT 的屬性。

  

---


  **required**：`string array`

  選填。Type.OBJECT 的必填屬性。

  

---


  **minProperties**：`string`

  選填。Type.OBJECT 的屬性數量下限。

  

---


  **maxProperties**：`string`

  選填。Type.OBJECT 的屬性數量上限。

  

---


  **minimum**：`number`

  選填。TYPE INTEGER 與 NUMBER 的架構欄位：Type.INTEGER 與 Type.NUMBER 的最小值。

  

---


  **maximum**：`number`

  選填。Type.INTEGER 與 Type.NUMBER 的最大值。

  

---


  **minLength**：`string`

  選填。TYPE STRING 的架構欄位：Type.STRING 的最小長度。

  

---


  **maxLength**：`string`

  選填。Type.STRING 的最大長度。

  

---


  **pattern**：`string`

  選填。Type.STRING 的模式，用來將字串限制為正規表示式。

  

---


  **example**：`object`

  選填。物件的範例。僅在物件為根物件時才會填入。

  

---


  **anyOf**：[`Schema`](/api-reference/generate-content/create-token/#Resource:Schema) `array`

  選填。值應對照清單中的任一（一個或多個）子架構進行驗證。

  

---


  **propertyOrdering**：`string array`

  選填。屬性的順序。不是 Open API 規格中的標準欄位。用來決定回應中屬性的順序。

  

---


  **default**：`object`

  選填。欄位的預設值。依 JSON Schema，此欄位是供文件產生器使用，不影響驗證。因此這裡包含此欄位並予以忽略，讓傳送帶有 `default` 欄位架構的開發人員不會收到未知欄位錯誤。


### Tool {#Resource:Tool}

模型可用來生成回應的工具詳情。

[`Tool`](/api-reference/generate-content/create-token/#Resource:Tool) 是一段程式碼，讓系統能與外部系統互動，以執行模型知識與範圍之外的一個或一組動作。

**屬性：**


  

??? note "**functionDeclarations**：`FunctionDeclaration array` 選填。模型可用於函式呼叫的 `FunctionDeclarations` 清單。模型或系統不會執行該函式。相反地，所定義的函式可能會以帶有引數的 FunctionCall 形式傳回給用戶端執行。模型可以決定呼叫這些函式中的子集，方式是在回應中填入 FunctionCall。下一個對話輪次可以包含一個 FunctionResponse，並以 Content.role「function」的生成上下文供下一個模型輪次使用。"

      **name**：必填 `string`

      函式的名稱。必須為 a-z、A-Z、0-9，或包含底線、冒號、句點與連字號，長度上限為 128。

      **description**：必填 `string`

      函式的簡短說明。

      **parameters**：[`Schema`](/api-reference/generate-content/create-token/#Resource:Schema)

      選填。說明此函式的參數。反映 Open API 3.03 Parameter Object：字串 Key 為參數名稱，參數名稱區分大小寫；Schema Value 為定義該參數所用類型的 Schema。

      **parametersJsonSchema**：`object`

      選填。以 JSON Schema 格式說明函式的參數。該架構必須描述一個物件，其屬性即為函式的參數。例如：`{ "type": "object", "properties": { "name": { "type": "string" }, "age": { "type": "integer" } }, "additionalProperties": false, "required": ["name", "age"], "propertyOrdering": ["name", "age"] }` 此欄位與 `parameters` 互斥。

      **response**：[`Schema`](/api-reference/generate-content/create-token/#Resource:Schema)

      選填。以 JSON Schema 格式說明此函式的輸出。反映 Open API 3.03 Response Object。Schema 定義函式回應值所用的類型。

      **responseJsonSchema**：`object`

      選填。以 JSON Schema 格式說明此函式的輸出。由架構指定的值即為函式的回應值。此欄位與 `response` 互斥。



    ??? note "**behavior**：`string enum` 選填。指定函式的 Behavior。目前僅 BidiGenerateContent 方法支援。"

        可能的值：

        - `UNSPECIFIED`：此值未使用。
        - `BLOCKING`：若設定，系統會等到收到函式回應後才繼續對話。
        - `NON_BLOCKING`：若設定，系統不會等待收到函式回應。相反地，它會在維持使用者與模型對話的同時，嘗試在函式回應可用時加以處理。



  

---


  

??? note "**googleSearchRetrieval**：`GoogleSearchRetrieval` 選填。由 Google 搜尋驅動的檢索工具。"

    ??? note "**dynamicRetrievalConfig**：`DynamicRetrievalConfig` 指定指定來源的動態檢索設定。"

        ??? note "**mode**：`string enum` 動態檢索中要使用的預測器模式。"

            可能的值：

            - `MODE_UNSPECIFIED`：一律觸發檢索。
            - `MODE_DYNAMIC`：僅在系統判定有必要時才執行檢索。



          **dynamicThreshold**：`number`

          動態檢索中要使用的閾值。若未設定，將使用系統預設值。



  

---


  

??? note "**codeExecution**：`CodeExecution` 選填。讓模型能在生成過程中執行程式碼。"




  

---


  

??? note "**googleSearch**：`GoogleSearch` 選填。GoogleSearch 工具類型。支援模型中 Google 搜尋的工具。由 Google 驅動。"

    ??? note "**timeRangeFilter**：`Interval` 選填。將搜尋結果篩選至特定時間範圍。若客戶設定了開始時間，就必須設定結束時間（反之亦然）。"

        **startTime**：`string`

        選填。區間的包含式起點。若有指定，符合此區間的 Timestamp 必須等於或晚於起點。

        **endTime**：`string`

        選填。區間的不包含式終點。若有指定，符合此區間的 Timestamp 必須早於終點。





    ??? note "**searchTypes**：`SearchTypes` 選填。要啟用的搜尋類型集合。若未設定，預設啟用網路搜尋。"

        ??? note "**webSearch**：`WebSearch` 選填。啟用網路搜尋。僅傳回文字結果。"






        ??? note "**imageSearch**：`ImageSearch` 選填。啟用圖片搜尋。傳回圖片位元組。"



  

---


  

??? note "**computerUse**：`ComputerUse` 選填。支援模型直接與電腦互動的工具。若啟用，會自動填入電腦使用專屬的 Function Declarations。"

    ??? note "**environment**：必填 `string enum` 正在操作的環境。"

        可能的值：

        - `ENVIRONMENT_UNSPECIFIED`：預設為瀏覽器。
        - `ENVIRONMENT_BROWSER`：在網路瀏覽器中操作。
        - `ENVIRONMENT_MOBILE`：在行動環境中操作。
        - `ENVIRONMENT_DESKTOP`：在桌面環境中操作。



      **excludedPredefinedFunctions**：`string array`

      選填。依預設，預先定義的函式會包含在最終的模型呼叫中。其中一些可以明確排除，不自動包含。這有兩個用途：1. 使用更受限／不同的動作空間。2. 改善預先定義函式的定義／指令。

      **enablePromptInjectionDetection**：`boolean`

      選填。是否在電腦使用請求上啟用提示詞注入偵測檢查。



    ??? note "**disabledSafetyPolicies**：`string enum array` 選填。電腦使用已停用的安全政策。"

        可能的值：

        - `SAFETY_POLICY_UNSPECIFIED`：未指定的安全政策。
        - `FINANCIAL_TRANSACTIONS`：金融交易的安全政策。
        - `SENSITIVE_DATA_MODIFICATION`：敏感資料修改的安全政策。
        - `COMMUNICATION_TOOL`：通訊工具（例如 Gmail、Chat、Meet）的安全政策。
        - `ACCOUNT_CREATION`：帳號建立的安全政策。
        - `DATA_MODIFICATION`：資料修改的安全政策。
        - `USER_CONSENT_MANAGEMENT`：使用者同意管理的安全政策。
        - `LEGAL_TERMS_AND_AGREEMENTS`：法律條款與協議的安全政策。



  

---


  

??? note "**urlContext**：`UrlContext` 選填。支援 URL 上下文檢索的工具。"




  

---


  

??? note "**fileSearch**：`FileSearch` 選填。FileSearch 工具類型。從語意檢索語料庫中檢索知識的工具。"

    **fileSearchStoreNames**：必填 `string array`

    要從中檢索的 file_search_stores 名稱。範例：`fileSearchStores/my-file-search-store-123`

    **topK**：`integer`

    選填。要檢索的語意檢索區塊數量。

    **metadataFilter**：`string`

    選填。要套用於語意檢索文件與區塊的中繼資料篩選器。



  

---


  

??? note "**mcpServers**：`McpServer array` 選填。要連線的 MCP Servers。"

    ??? note "**transport**：`Union type` 用來連線至 MCPServer 的傳輸方式。"

          聯集欄位 `transport` 只能是下列其中之一：



        ??? note "**streamableHttpTransport**：`StreamableHttpTransport` 可串流 HTTP 請求與回應的傳輸方式。"

            **url**：`string`

            MCPServer 端點的完整 URL。範例：「https://api.example.com/mcp」

            **headers**：`object`

            選填：如有需要，用於驗證標頭、逾時等的欄位。

            **timeout**：`string`

            一般操作的 HTTP 逾時。

            **sseReadTimeout**：`string`

            SSE 讀取操作的逾時。

            **terminateOnClose**：`boolean`

            當傳輸關閉時，是否關閉用戶端工作階段。



      **name**：`string`

      MCPServer 的名稱。



  

---


  

??? note "**googleMaps**：`GoogleMaps` 選填。讓模型的回應能以與使用者查詢相關的地理空間上下文接地的工具。"

    **enableWidget**：`boolean`

    選填。是否在回應的 GroundingMetadata 中傳回小工具上下文 token。開發人員可以使用小工具上下文 token，算繪一個帶有地理空間上下文的 Google Maps 小工具，該上下文與模型在回應中參照的地點相關。
