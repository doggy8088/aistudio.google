# 產生內容

`POST` `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`

根據輸入的 [`GenerateContentRequest`](/api-reference/generate-content/generate-content/#request-body) 產生模型回應。詳細用法請參閱[文字生成指南](/docs/text-generation/)。不同模型的輸入能力有所不同，微調模型亦然。詳情請參閱[模型指南](/docs/models/)與[微調指南](/docs/model-tuning/)。



## 參數 {#parameters}


  **model**：必填 `string`

  模型 ID，例如 `gemini-2.5-flash`。組成資源名稱 `models/{model}`。



## 請求主體 {#request-body}


  **model**：必填 `string`

  用於產生完成結果的 `Model` 名稱。格式：`models/{model}`。



---


  **contents**：必填 [`Content`](/api-reference/generate-content/generate-content/#Resource:Content) `array`

  與模型進行目前對話的內容。單輪查詢時為單一執行個體；多輪查詢（例如[聊天](/docs/text-generation/#multi-turn-conversations)）時，這是包含對話記錄與最新請求的重複欄位。



---


  **systemInstruction**：[`Content`](/api-reference/generate-content/generate-content/#Resource:Content)

  選填。開發人員設定的[系統指令](/docs/text-generation/#system-instructions)。目前僅支援文字。



---


  **tools**：[`Tool`](/api-reference/generate-content/generate-content/#Resource:Tool) `array`

  選填。`Tools` 清單，`Model` 可用於產生下一個回應。[`Tool`](/api-reference/generate-content/generate-content/#Resource:Tool) 是一段程式碼，讓系統能與外部系統互動，在 `Model` 的知識與範圍之外執行某個動作或一組動作。支援的 [`Tool`](/api-reference/generate-content/generate-content/#Resource:Tool) 為 `Function` 與 `code_execution`。詳情請參閱[函式呼叫](/docs/function-calling/)與[程式碼執行](/docs/code-execution/)指南。



---




??? note "**toolConfig**：`ToolConfig` 選填。請求中指定的任何 [`Tool`](/api-reference/generate-content/generate-content/#Resource:Tool) 的工具設定。使用範例請參閱[函式呼叫指南](/docs/function-calling/#function_calling_modes)。"

    ??? note "**functionCallingConfig**：`FunctionCallingConfig` 選填。函式呼叫設定。"

        ??? note "**mode**：`string enum` 選填。指定函式呼叫的執行模式。若未指定，預設值為 AUTO。"

            可能的值：

            - `MODE_UNSPECIFIED`：未指定的函式呼叫模式。不應使用此值。
            - `AUTO`：模型預設行為，由模型決定要預測函式呼叫或自然語言回應。
            - `ANY`：模型被限制為只能預測函式呼叫。若已設定 "allowed_function_names"，預測的函式呼叫將限於 "allowed_function_names" 中的任一個；否則預測的函式呼叫將是提供的 "function_declarations" 中的任一個。
            - `NONE`：模型不會預測任何函式呼叫。模型行為與未傳入任何函式宣告時相同。
            - `VALIDATED`：模型決定預測函式呼叫或自然語言回應，但會以受限解碼驗證函式呼叫。若已設定 "allowed_function_names"，預測的函式呼叫將限於 "allowed_function_names" 中的任一個；否則預測的函式呼叫將是提供的 "function_declarations" 中的任一個。



          **allowedFunctionNames**：`string array`

          選填。一組函式名稱，提供後會限制模型可呼叫的函式。僅應在 Mode 為 ANY 或 VALIDATED 時設定。函式名稱應與 [FunctionDeclaration.name] 相符。設定後，模型只會從允許的函式名稱中預測函式呼叫。






    ??? note "**retrievalConfig**：`RetrievalConfig` 選填。擷取設定。"

        ??? note "**latLng**：`LatLng` 選填。使用者的位置。"

            **latitude**：`number`

            以度為單位的緯度。必須介於 [-90.0, +90.0] 範圍內。

            **longitude**：`number`

            以度為單位的經度。必須介於 [-180.0, +180.0] 範圍內。



          **languageCode**：`string`

          選填。使用者的語言代碼。內容的語言代碼。使用 [BCP47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) 定義的語言標籤。



      **includeServerSideToolInvocations**：`boolean`

      選填。若為 true，API 回應會在 [`Content`](/api-reference/generate-content/generate-content/#Resource:Content) 訊息中包含伺服器端工具呼叫與回應，讓用戶端能觀察伺服器的工具互動。






---


  **safetySettings**：[`SafetySetting`](/api-reference/generate-content/generate-content/#Resource:SafetySetting) `array`

  選填。用於封鎖不安全內容的專屬 [`SafetySetting`](/api-reference/generate-content/generate-content/#Resource:SafetySetting) 執行個體清單。此設定會強制套用於 `GenerateContentRequest.contents` 與 `GenerateContentResponse.candidates`。每個 `SafetyCategory` 類型不應有多於一個設定。API 會封鎖任何未達這些設定所定門檻的內容與回應。此清單會覆寫 safety_settings 中指定的每個 `SafetyCategory` 的預設設定。若清單中未提供 [`SafetySetting`](/api-reference/generate-content/generate-content/#Resource:SafetySetting) 供某個 `SafetyCategory` 使用，API 會使用該類別的預設安全設定。支援的危害類別為 HARM_CATEGORY_HATE_SPEECH、HARM_CATEGORY_SEXUALLY_EXPLICIT、HARM_CATEGORY_DANGEROUS_CONTENT、HARM_CATEGORY_HARASSMENT、HARM_CATEGORY_CIVIC_INTEGRITY、HARM_CATEGORY_JAILBREAK。可用安全設定的詳細資訊請參閱[指南](/docs/safety-settings/)。另請參閱[安全指南](/docs/safety-guidance/)，了解如何將安全考量納入您的 AI 應用程式。



---


??? note "**generationConfig**：`GenerationConfig` 選填。模型產生與輸出的設定選項。"

      **candidateCount**：`integer`

      選填。要傳回的產生回應數量。若未設定，預設為 1。請注意，此設定不適用於前幾代模型（Gemini 1.0 系列）。

      **stopSequences**：`string array`

      選填。會停止輸出產生的字元序列集合（最多 5 個）。若指定，API 會在 `stop_sequence` 首次出現時停止。停止序列不會包含在回應中。

      **maxOutputTokens**：`integer`

      選填。回應候選中可包含的 token 數量上限。注意：預設值依模型而異，請參閱 `Model.output_token_limit` 屬性（屬於 `Model`，由 `getModel` 函式傳回）。

      **temperature**：`number`

      選填。控制輸出的隨機程度。注意：預設值依模型而異，請參閱 `Model.temperature` 屬性（屬於 `Model`，由 `getModel` 函式傳回）。值可介於 [0.0, 2.0]。此欄位在 Gemini 3.6 Flash 及更新的模型上不再支援，會被靜默忽略。

      **topP**：`number`

      選填。取樣時要考量的 token 累積機率上限。模型結合使用 Top-k 與 Top-p（nucleus）取樣。token 會依其指派的機率排序，只考量最有可能的 token。Top-k 取樣直接限制要考量的 token 數量上限，Nucleus 取樣則依累積機率限制 token 數量。注意：預設值依 `Model` 而異，由 `Model.top_p` 屬性指定，該屬性由 `getModel` 函式傳回。空的 `top_k` 屬性表示模型不套用 top-k 取樣，也不允許在請求上設定 `top_k`。此欄位在 Gemini 3.6 Flash 及更新的模型上不再支援，會被靜默忽略。

      **topK**：`integer`

      選填。取樣時要考量的 token 數量上限。Gemini 模型使用 Top-p（nucleus）取樣，或 Top-k 與 nucleus 取樣的組合。Top-k 取樣考量機率最高的 `top_k` 個 token 集合。使用 nucleus 取樣執行的模型不允許設定 top_k。注意：預設值依 `Model` 而異，由 `Model.top_p` 屬性指定，該屬性由 `getModel` 函式傳回。空的 `top_k` 屬性表示模型不套用 top-k 取樣，也不允許在請求上設定 `top_k`。此欄位在 Gemini 3.6 Flash 及更新的模型上不再支援，會被靜默忽略。

      **seed**：`integer`

      選填。解碼時使用的種子。若未設定，請求會使用隨機產生的種子。

      **responseMimeType**：`string`

      選填。產生的候選文字的 MIME 類型。支援的 MIME 類型為：`text/plain`：（預設）文字輸出。`application/json`：回應候選中的 JSON 回應。`text/x.enum`：回應候選中以字串形式表示的 ENUM 回應。所有支援的文字 MIME 類型清單請參閱[文件](/docs/file-input-methods/#text-file-types)。

      **responseJsonSchema**：`object`

      選填。內部細節。請改用 `responseJsonSchema`，不要使用此欄位。

      **presencePenalty**：`number`

      選填。若某個 token 已在回應中出現過，對下一個 token 的 logprobs 套用的存在懲罰。此懲罰是二元的開／關，不取決於 tokens 被使用的次數（第一次之後）。若要使用隨使用次數增加的懲罰，請使用 frequency_penalty。正值懲罰會降低使用已在回應中用過的 token，擴大詞彙量；負值懲罰會鼓勵使用已在回應中用過的 token，縮小詞彙量。

      **frequencyPenalty**：`number`

      選填。對下一個 token 的 logprobs 套用的頻率懲罰，會乘以每個 token 至今在回應中出現的次數。正值懲罰會依 tokens 被使用的次數比例降低其再次使用：token 用得越多，模型就越難再次使用該 token，進而擴大回應的詞彙量。注意：*負值*懲罰會鼓勵模型依 tokens 被使用的次數比例重複使用 token。較小的負值會縮小回應的詞彙量；較大的負值會使模型開始重複某個常見 token，直到達到 max_output_tokens 上限。

      **responseLogprobs**：`boolean`

      選填。若為 true，在回應中匯出 logprobs 結果。

      **logprobs**：`integer`

      選填。僅在 response_logprobs=True 時有效。此設定決定在每個解碼步驟要傳回的頂尖 logprobs 數量（包含所選候選），傳回於 Candidate.logprobs_result 中。數字必須介於 [0, 20] 範圍內。

      **enableEnhancedCivicAnswers**：`boolean`

      選填。啟用強化公民答覆。並非所有模型都提供此功能。



    ??? note "**responseModalities**：`string enum array` 選填。請求的回應模態。代表模型可傳回且應在回應中出現的模態集合，必須與回應的模態完全相符。一個模型可能有多種支援的模態組合。若請求的模態與任何支援的組合都不相符，將傳回錯誤。空清單等同於僅請求文字。"

        可能的值：

        - `MODALITY_UNSPECIFIED`：預設值。
        - `TEXT`：表示模型應傳回文字。
        - `IMAGE`：表示模型應傳回圖片。
        - `AUDIO`：表示模型應傳回音訊。






    ??? note "**speechConfig**：`SpeechConfig` 選填。語音產生設定。"

        ??? note "**voiceConfig**：`VoiceConfig` 單一語音輸出時的設定。"

            ??? note "**voiceConfig**：`Union type` 要使用的說話者設定。"

                  Union 欄位 `voiceConfig` 只能是下列其中之一：



                ??? note "**prebuiltVoiceConfig**：`PrebuiltVoiceConfig` 要使用的預建語音設定。"

                    **voiceName**：`string`

                    選填。要使用的預設語音名稱。



                  **voice**：`string`

                  選填。用於合成的說話者識別碼。支援的格式：

                  - 預建語音的說話者名稱（例如 `Orus` 或 `Kore`）。
                  - 已儲存語音的語音 ID（例如 `voice_xxx`）。
                  - 語音複製金鑰（例如 `voicekey_xxx`）。






        ??? note "**multiSpeakerVoiceConfig**：`MultiSpeakerVoiceConfig` 選填。多說話者設定的設定。與 voice_config 欄位互斥。"

            ??? note "**speakerVoiceConfigs**：必填 `SpeakerVoiceConfig array` 所有已啟用的說話者語音。"

                  **speaker**：必填 `string`

                  要使用的說話者名稱。應與提示詞中的名稱相同。



                ??? note "**voiceConfig**：必填 `VoiceConfig` 要使用的語音設定。"

                    ??? note "**voiceConfig**：`Union type` 要使用的說話者設定。"

                          Union 欄位 `voiceConfig` 只能是下列其中之一：



                        ??? note "**prebuiltVoiceConfig**：`PrebuiltVoiceConfig` 要使用的預建語音設定。"

                            **voiceName**：`string`

                            選填。要使用的預設語音名稱。



                          **voice**：`string`

                          選填。用於合成的說話者識別碼。支援的格式：

                          - 預建語音的說話者名稱（例如 `Orus` 或 `Kore`）。
                          - 已儲存語音的語音 ID（例如 `voice_xxx`）。
                          - 語音複製金鑰（例如 `voicekey_xxx`）。



          **languageCode**：`string`

          選填。使用者將應用程式設定為使用的 IETF [BCP-47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) 語言代碼。用於語音辨識與合成。有效值為：`de-DE`、`en-AU`、`en-GB`、`en-IN`、`en-US`、`es-US`、`fr-FR`、`hi-IN`、`pt-BR`、`ar-XA`、`es-ES`、`fr-CA`、`id-ID`、`it-IT`、`ja-JP`、`tr-TR`、`vi-VN`、`bn-IN`、`gu-IN`、`kn-IN`、`ml-IN`、`mr-IN`、`ta-IN`、`te-IN`、`nl-NL`、`ko-KR`、`cmn-CN`、`pl-PL`、`ru-RU` 與 `th-TH`。






    ??? note "**thinkingConfig**：`ThinkingConfig` 選填。思考功能的設定。若為不支援思考的模型設定此欄位，將傳回錯誤。"

          **includeThoughts**：`boolean`

          表示是否要在回應中包含思考內容。若為 true，僅在有思考內容可用時才會傳回。


          **thinkingBudget**：`integer`

          模型應產生的思考 token 數量。



        ??? note "**thinkingLevel**：`string enum` 選填。控制模型在產生回應前，內部推理過程的最大深度。預設值依模型而定。詳情請參閱[思考層級指南](/docs/thinking/#thinking-levels)。建議用於 Gemini 3 或更新的模型；用於較早的模型會產生錯誤。"

            可能的值：

            - `THINKING_LEVEL_UNSPECIFIED`：預設值。
            - `MINIMAL`：幾乎不思考或完全不思考。
            - `LOW`：低思考層級。
            - `MEDIUM`：中思考層級。
            - `HIGH`：高思考層級。
            - `XHIGH`：極高思考層級。






    ??? note "**imageConfig**：`ImageConfig` 選填。圖片產生設定。若為不支援這些設定選項的模型設定此欄位，將傳回錯誤。"

        **aspectRatio**：`string`

        選填。要產生的圖片的長寬比。支援的長寬比：`1:1`、`1:4`、`4:1`、`1:8`、`8:1`、`2:3`、`3:2`、`3:4`、`4:3`、`4:5`、`5:4`、`9:16`、`16:9` 或 `21:9`。若未指定，模型會根據提供的任何參考圖片選擇預設長寬比。

        **imageSize**：`string`

        選填。指定產生圖片的大小。支援的值為 `512`、`1K`、`2K`、`4K`。若未指定，模型會使用預設值 `1K`。






    ??? note "**mediaResolution**：`string enum` 選填。若指定，將使用所指定的媒體解析度。"

        可能的值：

        - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
        - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低（64 tokens）。
        - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中（256 tokens）。
        - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高（以 256 tokens 縮放重新取景）。



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
                - `INLINE`：音訊資料以行內方式在回應中傳回。
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
                - `INLINE`：圖片資料以行內方式在回應中傳回。
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

        翻譯的目標語言。支援的值為 BCP-47 語言代碼（例如 "en"、"es"、"fr"）。

        **echoTargetLanguage**：`boolean`

        選填。若為 true，當目標語言被說出時，模型會產生音訊，本質上是鸚鵡學舌般覆述輸入。若為 false，不會為目標語言產生音訊。






    ??? note "**audioTranscriptionConfig**：`AudioTranscriptionConfig` 選填。音訊轉錄（語音辨識）設定。"

          **languageCodes**：`string array`

          選填。BCP-47 語言代碼，提供音訊中出現之語言的提示。若省略或為空，預設為自動語言偵測。

          **customVocabulary**：`string array`

          選填。自訂詞彙片語清單，用於引導語音辨識模型偏向辨識特定詞彙（產品名稱、專有名詞、行話）。

          **wordTimestamp**：`boolean`

          選填。設定逐詞時間戳記的產生。

          **diarization**：`boolean`

          選填。設定說話者分離。

          **sourceText**：`string`

          選填。要透過語音指令編輯或改寫的來源文字。在 `SMART` 模式下提供時，模型會將音訊輸入與此文字比對，並在候選回應中發出完整的替換文字，而不是附加在其後。



        ??? note "**mode**：`string enum` 選填。設定轉錄模式。支援的值：`VERBATIM`、`SMART`。若未指定，預設為 `VERBATIM` 轉錄。在 `SMART` 模式下，模型會執行去除不流暢語（消除填充詞、重複與錯誤起頭）、輕度文法清理、自動格式化（段落、項目符號、編號清單），以及小幅使用者編輯（行內自我更正）。時間戳記與說話者分離與 `SMART` 模式不相容。"

            可能的值：

            - `MODE_UNSPECIFIED`：未指定的轉錄模式。
            - `VERBATIM`：逐字轉錄模式。
            - `SMART`：智慧轉錄模式。






---


  **cachedContent**：`string`

  選填。要用作提供預測之上下文的[快取](/docs/caching/)內容名稱。格式：`cachedContents/{cachedContent}`



---




??? note "**serviceTier**：[`ServiceTier`](/api-reference/generate-content/generate-content/#Resource:ServiceTier) 選填。請求的服務層級。"

    可能的值：

    - `unspecified`：預設服務層級，即標準層級。
    - `standard`：標準服務層級。
    - `flex`：Flex 服務層級。
    - `priority`：Priority 服務層級。






---


  **store**：`boolean`

  選填。設定指定請求的記錄行為。若有設定，其優先順序高於專案層級的記錄設定。



---


  **continuationToken**：`string`

  選填。不透明的接續 token，用於從先前的 `GenerateContent` 或 `StreamGenerateContent` 回應繼續產生，該回應先前以 `finish_reason` 設為 `CONTINUATION` 而停止。注意：在請求中提供接續 token 時，`contents` 為必填，且必須與初始請求的提示詞及對話記錄完全相同。



---


  **labels**：`object`

  選填。帶有使用者自訂中繼資料的請求標籤。選填。標籤必須遵循標準的統一 Cloud 標籤要求：

  - 標籤鍵必須以字母開頭。
  - 標籤鍵與值的長度不得超過 63 個字元（Unicode 碼點），且只能包含小寫字母、數字字元、底線與連字號。
  - 允許國際字元。

  用法：

  - 來自彙總者的安全識別碼：使用鍵 `safety_identifier`（例如 `{"safety_identifier": "user_session_123"}`）







  **範例請求**

  

=== "文字"


    === "REST"

          ```sh
          curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY" \
              -H 'Content-Type: application/json' \
              -X POST \
              -d '{
                "contents": [{
                  "parts":[{"text": "Write a story about a magic backpack."}]
                  }]
                 }' 2> /dev/null
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          response = client.models.generate_content(
              model="gemini-3.8-flash",
              contents="Write a story about a magic backpack.",
          )
          print(response.text)
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: 'Write a story about a magic backpack.',
          });
          console.log(response.text);
          ```

    === "Java"

          ```java
          Client client = new Client();

          GenerateContentResponse response =
              client.models.generateContent(
                  "gemini-3.8-flash", "Write a story about a magic backpack.", null);

          System.out.println(response.text());
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
          contents := []*genai.Content{
              genai.NewContentFromText("Write a story about a magic backpack.", genai.RoleUser),
          }
          response, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, nil)
          if err != nil {
              log.Fatal(err)
          }
          printResponse(response)
          ```

=== "圖片"


    === "REST"

          ```sh
          # Use a temporary file to hold the base64 encoded image data
          TEMP_B64=$(mktemp)
          trap 'rm -f "$TEMP_B64"' EXIT
          base64 $B64FLAGS $IMG_PATH > "$TEMP_B64"

          # Use a temporary file to hold the JSON payload
          TEMP_JSON=$(mktemp)
          trap 'rm -f "$TEMP_JSON"' EXIT

          cat > "$TEMP_JSON" << EOF
          {
            "contents": [{
              "parts":[
                {"text": "Tell me about this instrument"},
                {
                  "inline_data": {
                    "mime_type":"image/jpeg",
                    "data": "$(cat "$TEMP_B64")"
                  }
                }
              ]
            }]
          }
          EOF

          curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY" \
              -H 'Content-Type: application/json' \
              -X POST \
              -d "@$TEMP_JSON" 2> /dev/null
          ```

    === "Python"

          ```python
          from google import genai
          import PIL.Image

          client = genai.Client()
          organ = PIL.Image.open(media / "organ.jpg")
          response = client.models.generate_content(
              model="gemini-3.8-flash",
              contents=["Tell me about this instrument", organ],
          )
          print(response.text)
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

          const organ = await ai.files.upload({
            file: path.join(media, 'organ.jpg'),
          });

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [
              createUserContent([
                'Tell me about this instrument',
                createPartFromUri(organ.uri, organ.mimeType)
              ]),
            ],
          });
          console.log(response.text);
          ```

    === "Java"

          ```java
          Client client = new Client();

          String path = media_path + "organ.jpg";
          byte[] imageData = Files.readAllBytes(Paths.get(path));

          Content content =
              Content.fromParts(
                  Part.fromText("Tell me about this instrument."),
                  Part.fromBytes(imageData, "image/jpeg"));

          GenerateContentResponse response =
              client.models.generateContent("gemini-3.8-flash", content, null);

          System.out.println(response.text());
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
              filepath.Join(getMedia(), "organ.jpg"),
              &genai.UploadFileConfig{
                  MIMEType: "image/jpeg",
              },
          )
          if err != nil {
              log.Fatal(err)
          }
          parts := []*genai.Part{
              genai.NewPartFromText("Tell me about this instrument"),
              genai.NewPartFromURI(file.URI, file.MIMEType),
          }
          contents := []*genai.Content{
              genai.NewContentFromParts(parts, genai.RoleUser),
          }

          response, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, nil)
          if err != nil {
              log.Fatal(err)
          }
          printResponse(response)
          ```

=== "音訊"


    === "REST"

          ```sh
          # Use File API to upload audio data to API request.
          MIME_TYPE=$(file -b --mime-type "${AUDIO_PATH}")
          NUM_BYTES=$(wc -c < "${AUDIO_PATH}")
          DISPLAY_NAME=AUDIO

          tmp_header_file=upload-header.tmp

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
            --data-binary "@${AUDIO_PATH}" 2> /dev/null > file_info.json

          file_uri=$(jq ".file.uri" file_info.json)
          echo file_uri=$file_uri

          curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY" \
              -H 'Content-Type: application/json' \
              -X POST \
              -d '{
                "contents": [{
                  "parts":[
                    {"text": "Please describe this file."},
                    {"file_data":{"mime_type": "audio/mpeg", "file_uri": '$file_uri'}}]
                  }]
                 }' 2> /dev/null > response.json

          cat response.json
          echo

          jq ".candidates[].content.parts[].text" response.json
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          sample_audio = client.files.upload(file=media / "sample.mp3")
          response = client.models.generate_content(
              model="gemini-3.8-flash",
              contents=["Give me a summary of this audio file.", sample_audio],
          )
          print(response.text)
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

          const audio = await ai.files.upload({
            file: path.join(media, 'sample.mp3'),
          });

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [
              createUserContent([
                'Give me a summary of this audio file.',
                createPartFromUri(audio.uri, audio.mimeType),
              ]),
            ],
          });
          console.log(response.text);
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
              filepath.Join(getMedia(), "sample.mp3"),
              &genai.UploadFileConfig{
                  MIMEType: "audio/mpeg",
              },
          )
          if err != nil {
              log.Fatal(err)
          }

          parts := []*genai.Part{
              genai.NewPartFromText("Give me a summary of this audio file."),
              genai.NewPartFromURI(file.URI, file.MIMEType),
          }

          contents := []*genai.Content{
              genai.NewContentFromParts(parts, genai.RoleUser),
          }

          response, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, nil)
          if err != nil {
              log.Fatal(err)
          }
          printResponse(response)
          ```

=== "影片"


    === "REST"

          ```sh
          # Use File API to upload audio data to API request.
          MIME_TYPE=$(file -b --mime-type "${VIDEO_PATH}")
          NUM_BYTES=$(wc -c < "${VIDEO_PATH}")
          DISPLAY_NAME=VIDEO

          # Initial resumable request defining metadata.
          # The upload url is in the response headers dump them to a file.
          curl "${BASE_URL}/upload/v1beta/files?key=${GEMINI_API_KEY}" \
            -D "${tmp_header_file}" \
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
          echo file_uri=$file_uri

          state=$(jq ".file.state" file_info.json)
          echo state=$state

          name=$(jq ".file.name" file_info.json)
          echo name=$name

          while [[ "($state)" = *"PROCESSING"* ]];
          do
            echo "Processing video..."
            sleep 5
            # Get the file of interest to check state
            curl https://generativelanguage.googleapis.com/v1beta/files/$name > file_info.json
            state=$(jq ".file.state" file_info.json)
          done

          curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY" \
              -H 'Content-Type: application/json' \
              -X POST \
              -d '{
                "contents": [{
                  "parts":[
                    {"text": "Transcribe the audio from this video, giving timestamps for salient events in the video. Also provide visual descriptions."},
                    {"file_data":{"mime_type": "video/mp4", "file_uri": '$file_uri'}}]
                  }]
                 }' 2> /dev/null > response.json

          cat response.json
          echo

          jq ".candidates[].content.parts[].text" response.json
          ```

    === "Python"

          ```python
          from google import genai
          import time

          client = genai.Client()
          # Video clip (CC BY 3.0) from https://peach.blender.org/download/
          myfile = client.files.upload(file=media / "Big_Buck_Bunny.mp4")
          print(f"{myfile=}")

          # Poll until the video file is completely processed (state becomes ACTIVE).
          while not myfile.state or myfile.state.name != "ACTIVE":
            print("Processing video...")
            print("File state:", myfile.state)
            time.sleep(5)
            myfile = client.files.get(name=myfile.name)

          response = client.models.generate_content(
              model="gemini-3.8-flash", contents=[myfile, "Describe this video clip"]
          )
          print(f"{response.text=}")
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

          let video = await ai.files.upload({
            file: path.join(media, 'Big_Buck_Bunny.mp4'),
          });

          // Poll until the video file is completely processed (state becomes ACTIVE).
          while (!video.state || video.state.toString() !== 'ACTIVE') {
            console.log('Processing video...');
            console.log('File state: ', video.state);
            await sleep(5000);
            video = await ai.files.get({name: video.name});
          }

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [
              createUserContent([
                'Describe this video clip',
                createPartFromUri(video.uri, video.mimeType),
              ]),
            ],
          });
          console.log(response.text);
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
              genai.NewPartFromText("Describe this video clip"),
              genai.NewPartFromURI(file.URI, file.MIMEType),
          }

          contents := []*genai.Content{
              genai.NewContentFromParts(parts, genai.RoleUser),
          }

          response, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, nil)
          if err != nil {
              log.Fatal(err)
          }
          printResponse(response)
          ```

=== "Pdf"


    === "REST"

          ```sh
          MIME_TYPE=$(file -b --mime-type "${PDF_PATH}")
          NUM_BYTES=$(wc -c < "${PDF_PATH}")
          DISPLAY_NAME=TEXT


          echo $MIME_TYPE
          tmp_header_file=upload-header.tmp

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
            --data-binary "@${PDF_PATH}" 2> /dev/null > file_info.json

          file_uri=$(jq ".file.uri" file_info.json)
          echo file_uri=$file_uri

          # Now generate content using that file
          curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY" \
              -H 'Content-Type: application/json' \
              -X POST \
              -d '{
                "contents": [{
                  "parts":[
                    {"text": "Can you add a few more lines to this poem?"},
                    {"file_data":{"mime_type": "application/pdf", "file_uri": '$file_uri'}}]
                  }]
                 }' 2> /dev/null > response.json

          cat response.json
          echo

          jq ".candidates[].content.parts[].text" response.json
          ```

    === "Python"

          ```python
          from google import genai

          client = genai.Client()
          sample_pdf = client.files.upload(file=media / "test.pdf")
          response = client.models.generate_content(
              model="gemini-3.8-flash",
              contents=["Give me a summary of this document:", sample_pdf],
          )
          print(f"{response.text=}")
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
              filepath.Join(getMedia(), "test.pdf"),
              &genai.UploadFileConfig{
                  MIMEType: "application/pdf",
              },
          )
          if err != nil {
              log.Fatal(err)
          }

          parts := []*genai.Part{
              genai.NewPartFromText("Give me a summary of this document:"),
              genai.NewPartFromURI(file.URI, file.MIMEType),
          }

          contents := []*genai.Content{
              genai.NewContentFromParts(parts, genai.RoleUser),
          }

          response, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, nil)
          if err != nil {
              log.Fatal(err)
          }
          printResponse(response)
          ```

=== "聊天"


    === "REST"

          ```sh
          curl https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY \
              -H 'Content-Type: application/json' \
              -X POST \
              -d '{
                "contents": [
                  {"role":"user",
                   "parts":[{
                     "text": "Hello"}]},
                  {"role": "model",
                   "parts":[{
                     "text": "Great to meet you. What would you like to know?"}]},
                  {"role":"user",
                   "parts":[{
                     "text": "I have two dogs in my house. How many paws are in my house?"}]},
                ]
              }' 2> /dev/null | grep "text"
          ```

    === "Python"

          ```python
          from google import genai
          from google.genai import types

          client = genai.Client()
          # Pass initial history using the "history" argument
          chat = client.chats.create(
              model="gemini-3.8-flash",
              history=[
                  types.Content(role="user", parts=[types.Part(text="Hello")]),
                  types.Content(
                      role="model",
                      parts=[
                          types.Part(
                              text="Great to meet you. What would you like to know?"
                          )
                      ],
                  ),
              ],
          )
          response = chat.send_message(message="I have 2 dogs in my house.")
          print(response.text)
          response = chat.send_message(message="How many paws are in my house?")
          print(response.text)
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
          const chat = ai.chats.create({
            model: 'gemini-3.8-flash',
            history: [
              {
                role: 'user',
                parts: [{text: 'Hello'}],
              },
              {
                role: 'model',
                parts: [{text: 'Great to meet you. What would you like to know?'}],
              },
            ],
          });

          const response1 = await chat.sendMessage({
            message: 'I have 2 dogs in my house.',
          });
          console.log('Chat response 1:', response1.text);

          const response2 = await chat.sendMessage({
            message: 'How many paws are in my house?',
          });
          console.log('Chat response 2:', response2.text);
          ```

    === "Java"

          ```java
          Client client = new Client();

          Content userContent = Content.fromParts(Part.fromText("Hello"));
          Content modelContent =
              Content.builder()
                  .role("model")
                  .parts(
                      Collections.singletonList(
                          Part.fromText("Great to meet you. What would you like to know?")))
                  .build();

          Chat chat =
              client.chats.create(
                  "gemini-3.8-flash",
                  GenerateContentConfig.builder()
                      .systemInstruction(userContent)
                      .systemInstruction(modelContent)
                      .build());

          GenerateContentResponse response1 = chat.sendMessage("I have 2 dogs in my house.");
          System.out.println(response1.text());

          GenerateContentResponse response2 = chat.sendMessage("How many paws are in my house?");
          System.out.println(response2.text());
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

          // Pass initial history using the History field.
          history := []*genai.Content{
              genai.NewContentFromText("Hello", genai.RoleUser),
              genai.NewContentFromText("Great to meet you. What would you like to know?", genai.RoleModel),
          }

          chat, err := client.Chats.Create(ctx, "gemini-3.8-flash", nil, history)
          if err != nil {
              log.Fatal(err)
          }

          firstResp, err := chat.SendMessage(ctx, genai.Part{Text: "I have 2 dogs in my house."})
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(firstResp.Text())

          secondResp, err := chat.SendMessage(ctx, genai.Part{Text: "How many paws are in my house?"})
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(secondResp.Text())
          ```

=== "JSON 模式"


    === "REST"

          ```sh
          curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -d '{
              "contents": [{
                "parts":[
                  {"text": "List 5 popular cookie recipes"}
                  ]
              }],
              "generationConfig": {
                  "response_mime_type": "application/json",
                  "response_schema": {
                    "type": "ARRAY",
                    "items": {
                      "type": "OBJECT",
                      "properties": {
                        "recipe_name": {"type":"STRING"},
                      }
                    }
                  }
              }
          }' 2> /dev/null | head
          ```

    === "Python"

          ```python
          from google import genai
          from google.genai import types
          from typing_extensions import TypedDict

          class Recipe(TypedDict):
            recipe_name: str
            ingredients: list[str]

          client = genai.Client()
          result = client.models.generate_content(
              model="gemini-3.8-flash",
              contents="List a few popular cookie recipes.",
              config=types.GenerateContentConfig(
                  response_mime_type="application/json", response_schema=list[Recipe]
              ),
          )
          print(result)
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: 'List a few popular cookie recipes.',
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    recipeName: {type: 'string'},
                    ingredients: {type: 'array', items: {type: 'string'}},
                  },
                  required: ['recipeName', 'ingredients'],
                },
              },
            },
          });
          console.log(response.text);
          ```

    === "Java"

          ```java
          Client client = new Client();

          Schema recipeSchema =
              Schema.builder()
                  .type(Array.class.getSimpleName())
                  .items(
                      Schema.builder()
                          .type(Object.class.getSimpleName())
                          .properties(
                              Map.of(
                                  "recipe_name",
                                  Schema.builder().type(String.class.getSimpleName()).build(),
                                  "ingredients",
                                  Schema.builder()
                                      .type(Array.class.getSimpleName())
                                      .items(Schema.builder().type(String.class.getSimpleName()).build())
                                      .build()))
                          .required(List.of("recipe_name", "ingredients"))
                          .build())
                  .build();

          GenerateContentConfig config =
              GenerateContentConfig.builder()
                  .responseMimeType("application/json")
                  .responseSchema(recipeSchema)
                  .build();

          GenerateContentResponse response =
              client.models.generateContent(
                  "gemini-3.8-flash", "List a few popular cookie recipes.", config);

          System.out.println(response.text());
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

          schema := &genai.Schema{
              Type: genai.TypeArray,
              Items: &genai.Schema{
                  Type: genai.TypeObject,
                  Properties: map[string]*genai.Schema{
                      "recipe_name": {Type: genai.TypeString},
                      "ingredients": {
                          Type:  genai.TypeArray,
                          Items: &genai.Schema{Type: genai.TypeString},
                      },
                  },
                  Required: []string{"recipe_name"},
              },
          }

          config := &genai.GenerateContentConfig{
              ResponseMIMEType: "application/json",
              ResponseSchema:   schema,
          }

          response, err := client.Models.GenerateContent(
              ctx,
              "gemini-3.8-flash",
              genai.Text("List a few popular cookie recipes."),
              config,
          )
          if err != nil {
              log.Fatal(err)
          }
          printResponse(response)
          ```

=== "函式呼叫"


    === "REST"

          ```sh
          cat > tools.json << EOF
          {
            "function_declarations": [
              {
                "name": "enable_lights",
                "description": "Turn on the lighting system."
              },
              {
                "name": "set_light_color",
                "description": "Set the light color. Lights must be enabled for this to work.",
                "parameters": {
                  "type": "object",
                  "properties": {
                    "rgb_hex": {
                      "type": "string",
                      "description": "The light color as a 6-digit hex string, e.g. ff0000 for red."
                    }
                  },
                  "required": [
                    "rgb_hex"
                  ]
                }
              },
              {
                "name": "stop_lights",
                "description": "Turn off the lighting system."
              }
            ]
          }
          EOF

          curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY" \
            -H 'Content-Type: application/json' \
            -d @<(echo '
            {
              "system_instruction": {
                "parts": {
                  "text": "You are a helpful lighting system bot. You can turn lights on and off, and you can set the color. Do not perform any other tasks."
                }
              },
              "tools": ['$(cat tools.json)'],

              "tool_config": {
                "function_calling_config": {"mode": "auto"}
              },

              "contents": {
                "role": "user",
                "parts": {
                  "text": "Turn on the lights please."
                }
              }
            }
          ') 2>/dev/null |sed -n '/"content"/,/"finishReason"/p'
          ```

    === "Python"

          ```python
          from google import genai
          from google.genai import types

          client = genai.Client()

          def add(a: float, b: float) -> float:
            """returns a + b."""
            return a + b

          def subtract(a: float, b: float) -> float:
            """returns a - b."""
            return a - b

          def multiply(a: float, b: float) -> float:
            """returns a * b."""
            return a * b

          def divide(a: float, b: float) -> float:
            """returns a / b."""
            return a / b

          # Create a chat session; function calling (via tools) is enabled in the config.
          chat = client.chats.create(
              model="gemini-3.8-flash",
              config=types.GenerateContentConfig(
                  tools=[add, subtract, multiply, divide]
              ),
          )
          response = chat.send_message(
              message=(
                  "I have 57 cats, each owns 44 mittens, how many mittens is that in"
                  " total?"
              )
          )
          print(response.text)
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

          /**
           * The add function returns the sum of two numbers.
           * @param {number} a
           * @param {number} b
           * @returns {number}
           */
          function add(a, b) {
            return a + b;
          }

          /**
           * The subtract function returns the difference (a - b).
           * @param {number} a
           * @param {number} b
           * @returns {number}
           */
          function subtract(a, b) {
            return a - b;
          }

          /**
           * The multiply function returns the product of two numbers.
           * @param {number} a
           * @param {number} b
           * @returns {number}
           */
          function multiply(a, b) {
            return a * b;
          }

          /**
           * The divide function returns the quotient of a divided by b.
           * @param {number} a
           * @param {number} b
           * @returns {number}
           */
          function divide(a, b) {
            return a / b;
          }

          const addDeclaration = {
            name: 'addNumbers',
            parameters: {
              type: 'object',
              description: 'Return the result of adding two numbers.',
              properties: {
                firstParam: {
                  type: 'number',
                  description:
                      'The first parameter which can be an integer or a floating point number.',
                },
                secondParam: {
                  type: 'number',
                  description:
                      'The second parameter which can be an integer or a floating point number.',
                },
              },
              required: ['firstParam', 'secondParam'],
            },
          };

          const subtractDeclaration = {
            name: 'subtractNumbers',
            parameters: {
              type: 'object',
              description:
                  'Return the result of subtracting the second number from the first.',
              properties: {
                firstParam: {
                  type: 'number',
                  description: 'The first parameter.',
                },
                secondParam: {
                  type: 'number',
                  description: 'The second parameter.',
                },
              },
              required: ['firstParam', 'secondParam'],
            },
          };

          const multiplyDeclaration = {
            name: 'multiplyNumbers',
            parameters: {
              type: 'object',
              description: 'Return the product of two numbers.',
              properties: {
                firstParam: {
                  type: 'number',
                  description: 'The first parameter.',
                },
                secondParam: {
                  type: 'number',
                  description: 'The second parameter.',
                },
              },
              required: ['firstParam', 'secondParam'],
            },
          };

          const divideDeclaration = {
            name: 'divideNumbers',
            parameters: {
              type: 'object',
              description:
                  'Return the quotient of dividing the first number by the second.',
              properties: {
                firstParam: {
                  type: 'number',
                  description: 'The first parameter.',
                },
                secondParam: {
                  type: 'number',
                  description: 'The second parameter.',
                },
              },
              required: ['firstParam', 'secondParam'],
            },
          };

          // Step 1: Call generateContent with function calling enabled.
          const generateContentResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents:
                'I have 57 cats, each owns 44 mittens, how many mittens is that in total?',
            config: {
              toolConfig: {
                functionCallingConfig: {
                  mode: FunctionCallingConfigMode.ANY,
                },
              },
              tools: [
                {
                  functionDeclarations: [
                    addDeclaration,
                    subtractDeclaration,
                    multiplyDeclaration,
                    divideDeclaration,
                  ],
                },
              ],
            },
          });

          // Step 2: Extract the function call.(
          // Assuming the response contains a 'functionCalls' array.
          const functionCall = generateContentResponse.functionCalls &&
              generateContentResponse.functionCalls[0];
          console.log(functionCall);

          // Parse the arguments.
          const args = functionCall.args;
          // Expected args format: { firstParam: number, secondParam: number }

          // Step 3: Invoke the actual function based on the function name.
          const functionMapping = {
            addNumbers: add,
            subtractNumbers: subtract,
            multiplyNumbers: multiply,
            divideNumbers: divide,
          };
          const func = functionMapping[functionCall.name];
          if (!func) {
            console.error('Unimplemented error:', functionCall.name);
            return generateContentResponse;
          }
          const resultValue = func(args.firstParam, args.secondParam);
          console.log('Function result:', resultValue);

          // Step 4: Use the chat API to send the result as the final answer.
          const chat = ai.chats.create({model: 'gemini-3.8-flash'});
          const chatResponse = await chat.sendMessage({
            message: 'The final result is ' + resultValue,
          });
          console.log(chatResponse.text);
          ```

    === "Java"

          ```java
          Client client = new Client();

          FunctionDeclaration addFunction =
              FunctionDeclaration.builder()
                  .name("addNumbers")
                  .parameters(
                      Schema.builder()
                          .type("object")
                          .properties(
                              Map.of(
                                  "firstParam",
                                      Schema.builder().type("number").description("First number").build(),
                                  "secondParam",
                                      Schema.builder()
                                          .type("number")
                                          .description("Second number")
                                          .build()))
                          .required(Arrays.asList("firstParam", "secondParam"))
                          .build())
                  .build();

          FunctionDeclaration subtractFunction =
              FunctionDeclaration.builder()
                  .name("subtractNumbers")
                  .parameters(
                      Schema.builder()
                          .type("object")
                          .properties(
                              Map.of(
                                  "firstParam",
                                      Schema.builder().type("number").description("First number").build(),
                                  "secondParam",
                                      Schema.builder()
                                          .type("number")
                                          .description("Second number")
                                          .build()))
                          .required(Arrays.asList("firstParam", "secondParam"))
                          .build())
                  .build();

          FunctionDeclaration multiplyFunction =
              FunctionDeclaration.builder()
                  .name("multiplyNumbers")
                  .parameters(
                      Schema.builder()
                          .type("object")
                          .properties(
                              Map.of(
                                  "firstParam",
                                      Schema.builder().type("number").description("First number").build(),
                                  "secondParam",
                                      Schema.builder()
                                          .type("number")
                                          .description("Second number")
                                          .build()))
                          .required(Arrays.asList("firstParam", "secondParam"))
                          .build())
                  .build();

          FunctionDeclaration divideFunction =
              FunctionDeclaration.builder()
                  .name("divideNumbers")
                  .parameters(
                      Schema.builder()
                          .type("object")
                          .properties(
                              Map.of(
                                  "firstParam",
                                      Schema.builder().type("number").description("First number").build(),
                                  "secondParam",
                                      Schema.builder()
                                          .type("number")
                                          .description("Second number")
                                          .build()))
                          .required(Arrays.asList("firstParam", "secondParam"))
                          .build())
                  .build();

          GenerateContentConfig config =
              GenerateContentConfig.builder()
                  .toolConfig(
                      ToolConfig.builder()
                          .functionCallingConfig(FunctionCallingConfig.builder().mode("ANY").build())
                          .build())
                  .tools(
                      Collections.singletonList(
                          Tool.builder()
                              .functionDeclarations(
                                  Arrays.asList(
                                      addFunction, subtractFunction, divideFunction, multiplyFunction))
                              .build()))
                  .build();

          GenerateContentResponse response =
              client.models.generateContent(
                  "gemini-3.8-flash",
                  "I have 57 cats, each owns 44 mittens, how many mittens is that in total?",
                  config);

          if (response.functionCalls() == null || response.functionCalls().isEmpty()) {
            System.err.println("No function call received");
            return null;
          }

          var functionCall = response.functionCalls().getFirst();
          String functionName = functionCall.name().get();
          var arguments = functionCall.args();

          Map<String, BiFunction<Double, Double, Double>> functionMapping = new HashMap<>();
          functionMapping.put("addNumbers", (a, b) -> a + b);
          functionMapping.put("subtractNumbers", (a, b) -> a - b);
          functionMapping.put("multiplyNumbers", (a, b) -> a * b);
          functionMapping.put("divideNumbers", (a, b) -> b != 0 ? a / b : Double.NaN);

          BiFunction<Double, Double, Double> function = functionMapping.get(functionName);

          Number firstParam = (Number) arguments.get().get("firstParam");
          Number secondParam = (Number) arguments.get().get("secondParam");
          Double result = function.apply(firstParam.doubleValue(), secondParam.doubleValue());

          System.out.println(result);
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
          modelName := "gemini-3.8-flash"

          // Create the function declarations for arithmetic operations.
          addDeclaration := createArithmeticToolDeclaration("addNumbers", "Return the result of adding two numbers.")
          subtractDeclaration := createArithmeticToolDeclaration("subtractNumbers", "Return the result of subtracting the second number from the first.")
          multiplyDeclaration := createArithmeticToolDeclaration("multiplyNumbers", "Return the product of two numbers.")
          divideDeclaration := createArithmeticToolDeclaration("divideNumbers", "Return the quotient of dividing the first number by the second.")

          // Group the function declarations as a tool.
          tools := []*genai.Tool{
              {
                  FunctionDeclarations: []*genai.FunctionDeclaration{
                      addDeclaration,
                      subtractDeclaration,
                      multiplyDeclaration,
                      divideDeclaration,
                  },
              },
          }

          // Create the content prompt.
          contents := []*genai.Content{
              genai.NewContentFromText(
                  "I have 57 cats, each owns 44 mittens, how many mittens is that in total?", genai.RoleUser,
              ),
          }

          // Set up the generate content configuration with function calling enabled.
          config := &genai.GenerateContentConfig{
              Tools: tools,
              ToolConfig: &genai.ToolConfig{
                  FunctionCallingConfig: &genai.FunctionCallingConfig{
                      // The mode equivalent to FunctionCallingConfigMode.ANY in JS.
                      Mode: genai.FunctionCallingConfigModeAny,
                  },
              },
          }

          genContentResp, err := client.Models.GenerateContent(ctx, modelName, contents, config)
          if err != nil {
              log.Fatal(err)
          }

          // Assume the response includes a list of function calls.
          if len(genContentResp.FunctionCalls()) == 0 {
              log.Println("No function call returned from the AI.")
              return nil
          }
          functionCall := genContentResp.FunctionCalls()[0]
          log.Printf("Function call: %+v\n", functionCall)

          // Marshal the Args map into JSON bytes.
          argsMap, err := json.Marshal(functionCall.Args)
          if err != nil {
              log.Fatal(err)
          }

          // Unmarshal the JSON bytes into the ArithmeticArgs struct.
          var args ArithmeticArgs
          if err := json.Unmarshal(argsMap, &args); err != nil {
              log.Fatal(err)
          }

          // Map the function name to the actual arithmetic function.
          var result float64
          switch functionCall.Name {
          case "addNumbers":
              result = add(args.FirstParam, args.SecondParam)
          case "subtractNumbers":
              result = subtract(args.FirstParam, args.SecondParam)
          case "multiplyNumbers":
              result = multiply(args.FirstParam, args.SecondParam)
          case "divideNumbers":
              result = divide(args.FirstParam, args.SecondParam)
          default:
              return fmt.Errorf("unimplemented function: %s", functionCall.Name)
          }
          log.Printf("Function result: %v\n", result)

          // Prepare the final result message as content.
          resultContents := []*genai.Content{
              genai.NewContentFromText("The final result is "+fmt.Sprintf("%v", result), genai.RoleUser),
          }

          // Use GenerateContent to send the final result.
          finalResponse, err := client.Models.GenerateContent(ctx, modelName, resultContents, &genai.GenerateContentConfig{})
          if err != nil {
              log.Fatal(err)
          }

          printResponse(finalResponse)
          ```

=== "產生設定"


    === "REST"

          ```sh
          curl https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY \
              -H 'Content-Type: application/json' \
              -X POST \
              -d '{
                  "contents": [{
                      "parts":[
                          {"text": "Explain how AI works"}
                      ]
                  }],
                  "generationConfig": {
                      "stopSequences": [
                          "Title"
                      ],
                      "temperature": 1.0,
                      "maxOutputTokens": 800,
                      "topP": 0.8,
                      "topK": 10
                  }
              }'  2> /dev/null | grep "text"
          ```

    === "Python"

          ```python
          from google import genai
          from google.genai import types

          client = genai.Client()
          response = client.models.generate_content(
              model="gemini-3.8-flash",
              contents="Tell me a story about a magic backpack.",
              config=types.GenerateContentConfig(
                  candidate_count=1,
                  stop_sequences=["x"],
                  max_output_tokens=800,
                  temperature=1.0,
              ),
          )
          print(response.text)
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: 'Tell me a story about a magic backpack.',
            config: {
              candidateCount: 1,
              stopSequences: ['x'],
              maxOutputTokens: 800,
              temperature: 1.0,
            },
          });

          console.log(response.text);
          ```

    === "Java"

          ```java
          Client client = new Client();

          GenerateContentConfig config =
              GenerateContentConfig.builder()
                  .candidateCount(1)
                  .stopSequences(List.of("x"))
                  .maxOutputTokens(800)
                  .temperature(1.0F)
                  .build();

          GenerateContentResponse response =
              client.models.generateContent(
                  "gemini-3.8-flash", "Tell me a story about a magic backpack.", config);

          System.out.println(response.text());
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

          // Create local variables for parameters.
          candidateCount := int32(1)
          maxOutputTokens := int32(800)
          temperature := float32(1.0)

          response, err := client.Models.GenerateContent(
              ctx,
              "gemini-3.8-flash",
              genai.Text("Tell me a story about a magic backpack."),
              &genai.GenerateContentConfig{
                  CandidateCount:  candidateCount,
                  StopSequences:   []string{"x"},
                  MaxOutputTokens: maxOutputTokens,
                  Temperature:     &temperature,
              },
          )
          if err != nil {
              log.Fatal(err)
          }

          printResponse(response)
          ```

=== "安全設定"


    === "REST"

          ```sh
          echo '{
              "safetySettings": [
                  {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_ONLY_HIGH"},
                  {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
              ],
              "contents": [{
                  "parts":[{
                      "text": "'I support Martians Soccer Club and I think Jupiterians Football Club sucks! Write a ironic phrase about them.'"}]}]}' > request.json

          curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY" \
              -H 'Content-Type: application/json' \
              -X POST \
              -d @request.json 2> /dev/null
          ```

    === "Python"

          ```python
          from google import genai
          from google.genai import types

          client = genai.Client()
          unsafe_prompt = (
              "I support Martians Soccer Club and I think Jupiterians Football Club"
              " sucks! Write a ironic phrase about them including expletives."
          )
          response = client.models.generate_content(
              model="gemini-3.8-flash",
              contents=unsafe_prompt,
              config=types.GenerateContentConfig(
                  safety_settings=[
                      types.SafetySetting(
                          category="HARM_CATEGORY_HATE_SPEECH",
                          threshold="BLOCK_MEDIUM_AND_ABOVE",
                      ),
                      types.SafetySetting(
                          category="HARM_CATEGORY_HARASSMENT",
                          threshold="BLOCK_ONLY_HIGH",
                      ),
                  ]
              ),
          )
          try:
            print(response.text)
          except Exception:
            print("No information generated by the model.")

          print(response.candidates[0].safety_ratings)
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
          const unsafePrompt =
              'I support Martians Soccer Club and I think Jupiterians Football Club sucks! Write a ironic phrase about them including expletives.';

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: unsafePrompt,
            config: {
              safetySettings: [
                {
                  category: 'HARM_CATEGORY_HATE_SPEECH',
                  threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                },
                {
                  category: 'HARM_CATEGORY_HARASSMENT',
                  threshold: 'BLOCK_ONLY_HIGH',
                },
              ],
            },
          });

          try {
            console.log('Generated text:', response.text);
          } catch (error) {
            console.log('No information generated by the model.');
          }
          console.log('Safety ratings:', response.candidates[0].safetyRatings);
          ```

    === "Java"

          ```java
          Client client = new Client();

          String unsafePrompt =
              """
               I support Martians Soccer Club and I think Jupiterians Football Club sucks!
               Write a ironic phrase about them including expletives.
              """;

          GenerateContentConfig config =
              GenerateContentConfig.builder()
                  .safetySettings(
                      Arrays.asList(
                          SafetySetting.builder()
                              .category("HARM_CATEGORY_HATE_SPEECH")
                              .threshold("BLOCK_MEDIUM_AND_ABOVE")
                              .build(),
                          SafetySetting.builder()
                              .category("HARM_CATEGORY_HARASSMENT")
                              .threshold("BLOCK_ONLY_HIGH")
                              .build()))
                  .build();

          GenerateContentResponse response =
              client.models.generateContent("gemini-3.8-flash", unsafePrompt, config);

          try {
            System.out.println(response.text());
          } catch (Exception e) {
            System.out.println("No information generated by the model");
          }

          System.out.println(response.candidates().get().getFirst().safetyRatings());
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

          unsafePrompt := "I support Martians Soccer Club and I think Jupiterians Football Club sucks! " +
              "Write a ironic phrase about them including expletives."

          config := &genai.GenerateContentConfig{
              SafetySettings: []*genai.SafetySetting{
                  {
                      Category:  "HARM_CATEGORY_HATE_SPEECH",
                      Threshold: "BLOCK_MEDIUM_AND_ABOVE",
                  },
                  {
                      Category:  "HARM_CATEGORY_HARASSMENT",
                      Threshold: "BLOCK_ONLY_HIGH",
                  },
              },
          }
          contents := []*genai.Content{
              genai.NewContentFromText(unsafePrompt, genai.RoleUser),
          }
          response, err := client.Models.GenerateContent(ctx, "gemini-3.8-flash", contents, config)
          if err != nil {
              log.Fatal(err)
          }

          // Print the generated text.
          text := response.Text()
          fmt.Println("Generated text:", text)

          // Print the and safety ratings from the first candidate.
          if len(response.Candidates) > 0 {
              fmt.Println("Finish reason:", response.Candidates[0].FinishReason)
              safetyRatings, err := json.MarshalIndent(response.Candidates[0].SafetyRatings, "", "  ")
              if err != nil {
                  return err
              }
              fmt.Println("Safety ratings:", string(safetyRatings))
          } else {
              fmt.Println("No candidate returned.")
          }
          ```

=== "系統指令"


    === "REST"

          ```sh
          curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -d '{ "system_instruction": {
              "parts":
                { "text": "You are a cat. Your name is Neko."}},
              "contents": {
                "parts": {
                  "text": "Hello there"}}}'
          ```

    === "Python"

          ```python
          from google import genai
          from google.genai import types

          client = genai.Client()
          response = client.models.generate_content(
              model="gemini-3.8-flash",
              contents="Good morning! How are you?",
              config=types.GenerateContentConfig(
                  system_instruction="You are a cat. Your name is Neko."
              ),
          )
          print(response.text)
          ```

    === "JavaScript"

          ```javascript
          // Make sure to include the following import:
          // import {GoogleGenAI} from '@google/genai';
          const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: 'Good morning! How are you?',
            config: {
              systemInstruction: 'You are a cat. Your name is Neko.',
            },
          });
          console.log(response.text);
          ```

    === "Java"

          ```java
          Client client = new Client();

          Part textPart = Part.builder().text("You are a cat. Your name is Neko.").build();

          Content content = Content.builder().role("system").parts(ImmutableList.of(textPart)).build();

          GenerateContentConfig config =
              GenerateContentConfig.builder().systemInstruction(content).build();

          GenerateContentResponse response =
              client.models.generateContent("gemini-3.8-flash", "Good morning! How are you?", config);

          System.out.println(response.text());
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

=== "快取"


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

=== "程式碼執行"


    === "Python"

          ```python
          from google import genai
          from google.genai import types

          client = genai.Client()
          response = client.models.generate_content(
              model="gemini-3.8-flash",
              contents=(
                  "Write and execute code that calculates the sum of the first 50"
                  " prime numbers. Ensure that only the executable code and its"
                  " resulting output are generated."
              ),
          )
          # Each part may contain text, executable code, or an execution result.
          for part in response.candidates[0].content.parts:
            print(part, "\n")

          print("-" * 80)
          # The .text accessor concatenates the parts into a markdown-formatted text.
          print("\n", response.text)
          ```

    === "Java"

          ```java
          Client client = new Client();

          String prompt =
              """
              Write and execute code that calculates the sum of the first 50 prime numbers.
              Ensure that only the executable code and its resulting output are generated.
              """;

          GenerateContentResponse response =
              client.models.generateContent("gemini-3.8-flash", prompt, null);

          for (Part part : response.candidates().get().getFirst().content().get().parts().get()) {
            System.out.println(part + "\n");
          }

          System.out.println("-".repeat(80));
          System.out.println(response.text());
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

          response, err := client.Models.GenerateContent(
              ctx,
              "gemini-3.8-flash",
              genai.Text(
                  `Write and execute code that calculates the sum of the first 50 prime numbers.
                   Ensure that only the executable code and its resulting output are generated.`,
              ),
              &genai.GenerateContentConfig{},
          )
          if err != nil {
              log.Fatal(err)
          }

          // Print the response.
          printResponse(response)

          fmt.Println("--------------------------------------------------------------------------------")
          fmt.Println(response.Text())
          ```


  




## 回應 {#response}


  **candidates**：[`Candidate`](/api-reference/generate-content/generate-content/#Resource:Candidate) `array`

  來自模型的候選回應。



---




??? note "**promptFeedback**：`PromptFeedback` 傳回與內容篩選器相關的提示詞回饋。"

    ??? note "**blockReason**：`string enum` 選填。若有設定，表示提示詞已被封鎖，不會傳回任何候選。請改寫提示詞。"

        可能的值：

        - `BLOCK_REASON_UNSPECIFIED`：預設值。此值未使用。
        - `SAFETY`：提示詞因安全原因被封鎖。請檢查 `safety_ratings` 以了解是哪個安全類別封鎖了它。
        - `OTHER`：提示詞因未知原因被封鎖。
        - `BLOCKLIST`：提示詞因包含術語封鎖清單中的詞彙而被封鎖。
        - `PROHIBITED_CONTENT`：提示詞因包含禁止內容而被封鎖。
        - `IMAGE_SAFETY`：候選因圖片產生內容不安全而被封鎖。



      **safetyRatings**：[`SafetyRating`](/api-reference/generate-content/generate-content/#Resource:SafetyRating) `array`

      提示詞的安全性評分。每個類別最多有一個評分。






---




??? note "**usageMetadata**：`UsageMetadata` 僅供輸出。產生請求的 token 用量中繼資料。"

      **promptTokenCount**：`integer`

      提示詞中的 token 數量。當設定了 `cached_content` 時，這仍是有效的提示詞總大小，也就是包含快取內容中的 token 數量。

      **cachedContentTokenCount**：`integer`

      提示詞中快取部分的 token 數量（快取內容）。

      **candidatesTokenCount**：`integer`

      所有產生的回應候選的 token 總數。

      **toolUsePromptTokenCount**：`integer`

      僅供輸出。工具使用提示詞中存在的 token 數量。

      **thoughtsTokenCount**：`integer`

      僅供輸出。思考模型的思考 token 數量。

      **totalTokenCount**：`integer`

      產生請求的 token 總數（提示詞 + 工具使用提示詞 + 思考 + 回應候選）。

      **promptTokensDetails**：[`ModalityTokenCount`](/api-reference/generate-content/generate-content/#Resource:ModalityTokenCount) `array`

      僅供輸出。請求輸入中處理的模態清單。

      **cacheTokensDetails**：[`ModalityTokenCount`](/api-reference/generate-content/generate-content/#Resource:ModalityTokenCount) `array`

      僅供輸出。請求輸入中快取內容的模態清單。

      **candidatesTokensDetails**：[`ModalityTokenCount`](/api-reference/generate-content/generate-content/#Resource:ModalityTokenCount) `array`

      僅供輸出。回應中傳回的模態清單。

      **toolUsePromptTokensDetails**：[`ModalityTokenCount`](/api-reference/generate-content/generate-content/#Resource:ModalityTokenCount) `array`

      僅供輸出。工具使用請求輸入中處理的模態清單。



    ??? note "**serviceTier**：[`ServiceTier`](/api-reference/generate-content/generate-content/#Resource:ServiceTier) 僅供輸出。請求的服務層級。"

        可能的值：

        - `unspecified`：預設服務層級，即標準層級。
        - `standard`：標準服務層級。
        - `flex`：Flex 服務層級。
        - `priority`：Priority 服務層級。






---


  **modelVersion**：`string`

  僅供輸出。用於產生回應的模型版本。



---


  **responseId**：`string`

  僅供輸出。response_id 用於識別每個回應。



---




??? note "**modelStatus**：`ModelStatus` 僅供輸出。此模型目前的模型狀態。"

    ??? note "**modelStage**：`ModelStage` 底層模型的階段。"

        可能的值：

        - `MODEL_STAGE_UNSPECIFIED`：未指定的模型階段。
        - `EXPERIMENTAL`：此階段的模型僅供實驗用途。
        - `PREVIEW`：此階段的模型比實驗模型更成熟。
        - `STABLE`：此階段的模型被視為穩定，可用於生產環境。
        - `LEGACY`：若模型處於此階段，表示該模型在不久的將來將走上淘汰之路。只有現有客戶能使用此模型。
        - `RETIRED`：此階段的模型已退役。這些模型無法使用。



      **retirementTime**：`string`

      模型將退役的時間。

      **message**：`string`

      說明模型狀態的訊息。



## 資料模型 {#data-models}

### Candidate {#Resource:Candidate}

由模型產生的回應候選。

**Properties：**


  **index**：`integer`

  僅供輸出。候選在回應候選清單中的索引。



---




  **content**：[`Content`](/api-reference/generate-content/generate-content/#Resource:Content)

  僅供輸出。模型傳回的產生內容。



---




??? note "**finishReason**：`string enum` 選填。僅供輸出。模型停止產生 token 的原因。若為空，表示模型尚未停止產生 token。"

    可能的值：

    - `FINISH_REASON_UNSPECIFIED`：預設值。此值未使用。
    - `STOP`：模型的自然停止點或提供的停止序列。
    - `MAX_TOKENS`：已達到請求中指定的 token 數量上限。
    - `SAFETY`：回應候選內容因安全原因被標記。
    - `RECITATION`：回應候選內容因重述原因被標記。
    - `LANGUAGE`：回應候選內容因使用不支援的語言而被標記。
    - `OTHER`：未知原因。
    - `BLOCKLIST`：token 產生因內容包含禁用詞彙而停止。
    - `PROHIBITED_CONTENT`：token 產生因可能包含禁止內容而停止。
    - `SPII`：token 產生因內容可能包含敏感個人識別資訊（SPII）而停止。
    - `MALFORMED_FUNCTION_CALL`：模型產生的函式呼叫無效。
    - `IMAGE_SAFETY`：token 產生因產生的圖片包含安全違規而停止。
    - `IMAGE_PROHIBITED_CONTENT`：圖片產生因產生的圖片含有其他禁止內容而停止。
    - `IMAGE_OTHER`：圖片產生因其他雜項問題而停止。
    - `NO_IMAGE`：模型預期應產生圖片，但未產生任何圖片。
    - `IMAGE_RECITATION`：圖片產生因重述而停止。
    - `UNEXPECTED_TOOL_CALL`：模型產生了工具呼叫，但請求中未啟用任何工具。
    - `TOO_MANY_TOOL_CALLS`：模型連續呼叫了太多工具，因此系統結束執行。
    - `MISSING_THOUGHT_SIGNATURE`：請求至少缺少一個思考簽章。
    - `MALFORMED_RESPONSE`：因回應格式錯誤而結束。
    - `ESCALATION`：請求被升級規則篩除。
    - `PUP_LIMITED_DISABLED`：表示 token 產生因使用者帳號違反禁止使用政策（PUP）而受限或停用，因而停止。
    - `CONTINUATION`：token 產生因回應達到單一請求的 token 上限而停止，但產生尚未完成。可透過後續請求使用傳回的 `continuation_token` 繼續模型回應。注意，`max_output_tokens` 在各次接續跳轉之間是累計的，必須單調增加或省略。






---


  **finishMessage**：`string`

  選填。僅供輸出。詳述模型停止產生 token 的原因。僅在設定了 `finish_reason` 時才會填入。



---


  **safetyRatings**：[`SafetyRating`](/api-reference/generate-content/generate-content/#Resource:SafetyRating) `array`

  回應候選的安全性評分清單。每個類別最多有一個評分。



---


  **citationMetadata**：[`CitationMetadata`](/api-reference/generate-content/generate-content/#Resource:CitationMetadata)

  僅供輸出。模型產生的候選的引用資訊。此欄位可能會為 `content` 中包含的任何文字填入重述資訊。這些是從基礎 LLM 訓練資料中受著作權保護的素材「重述」而來的段落。



---


  **tokenCount**：`integer`

  僅供輸出。此候選的 token 數量。



---




??? note "**groundingAttributions**：`GroundingAttribution array` 僅供輸出。對接地答案有所貢獻的來源的歸因資訊。此欄位會為 `GenerateAnswer` 呼叫填入。"

    ??? note "**sourceId**：`AttributionSourceId` 僅供輸出。對此歸因有所貢獻的來源的識別碼。"

        ??? note "**source**：`Union type`"

              Union 欄位 `source` 只能是下列其中之一：



            ??? note "**groundingPassage**：`GroundingPassageId` 行內段落的識別碼。"

                **passageId**：`string`

                僅供輸出。與 `GenerateAnswerRequest` 的 `GroundingPassage.id` 相符的段落 ID。

                **partIndex**：`integer`

                僅供輸出。部分在 `GenerateAnswerRequest` 的 `GroundingPassage.content` 中的索引。






            ??? note "**semanticRetrieverChunk**：`SemanticRetrieverChunk` 透過 Semantic Retriever 取得的 `Chunk` 的識別碼。"

                **source**：`string`

                僅供輸出。與請求的 `SemanticRetrieverConfig.source` 相符的來源名稱。範例：`corpora/123` 或 `corpora/123/documents/abc`

                **chunk**：`string`

                僅供輸出。包含歸因文字的 `Chunk` 名稱。範例：`corpora/123/documents/abc/chunks/xyz`



      **content**：[`Content`](/api-reference/generate-content/generate-content/#Resource:Content)

      組成此歸因的接地來源內容。






---




??? note "**groundingMetadata**：`GroundingMetadata` 僅供輸出。候選的接地中繼資料。此欄位會為 `GenerateContent` 呼叫填入。"

    ??? note "**searchEntryPoint**：`SearchEntryPoint` 選填。後續網路搜尋的 Google 搜尋入口。"

        **renderedContent**：`string`

        選填。可嵌入網頁或應用程式 webview 的網路內容片段。

        **sdkBlob**：`string`

        選填。表示元組陣列的 Base64 編碼 JSON。






    ??? note "**groundingChunks**：`GroundingChunk array` 從指定接地來源擷取的支援參考清單。串流時，這裡僅包含先前回應的接地中繼資料中尚未包含的接地區塊。"

        ??? note "**chunkType**：`Union type` 區塊類型。"

              Union 欄位 `chunkType` 只能是下列其中之一：



            ??? note "**web**：`Web` 來自網路的接地區塊。"

                **uri**：`string`

                僅供輸出。區塊的 URI 參考。

                **title**：`string`

                僅供輸出。區塊的標題。






            ??? note "**image**：`Image` 選填。來自圖片搜尋的接地區塊。"

                **sourceUri**：`string`

                用於歸因的網頁 URI。

                **imageUri**：`string`

                圖片素材 URL。

                **title**：`string`

                圖片來源網頁的標題。

                **domain**：`string`

                圖片來源網頁的根網域，例如 "example.com"。






            ??? note "**retrievedContext**：`RetrievedContext` 選填。來自檔案搜尋工具擷取之上下文的接地區塊。"

                  **uri**：`string`

                  選填。語意擷取文件的 URI 參考。

                  **title**：`string`

                  選填。文件的標題。

                  **text**：`string`

                  選填。區塊的文字。

                  **fileSearchStore**：`string`

                  選填。包含該文件的 `FileSearchStore` 名稱。範例：`fileSearchStores/123`



                ??? note "**customMetadata**：`GroundingChunkCustomMetadata array` 選填。使用者提供的關於擷取上下文的中繼資料。"

                    ??? note "**value**：`Union type` 中繼資料的值。可以是字串、字串清單或數字。"

                          Union 欄位 `value` 只能是下列其中之一：

                          **stringValue**：`string`

                          選填。中繼資料的字串值。



                        ??? note "**stringListValue**：`GroundingChunkStringList` 選填。中繼資料的字串值清單。"

                            **values**：`string array`

                            清單的字串值。



                          **numericValue**：`number`

                          選填。中繼資料的數值。此值的預期範圍取決於所使用的特定 `key`。



                      **key**：`string`

                      中繼資料的鍵。



                  **pageNumber**：`integer`

                  選填。擷取上下文的頁碼（如適用）。

                  **mediaId**：`string`

                  選填。多模態檔案搜尋結果的媒體 blob 資源名稱。格式：fileSearchStores/{file_search_store_id}/media/{blob_id}






            ??? note "**maps**：`Maps` 選填。來自 Google Maps 的接地區塊。"

                  **uri**：`string`

                  地點的 URI 參考。

                  **title**：`string`

                  地點的標題。

                  **text**：`string`

                  地點答案的文字說明。

                  **placeId**：`string`

                  地點的 ID，格式為 `places/{place_id}`。使用者可用此 ID 查詢該地點。



                ??? note "**placeAnswerSources**：`PlaceAnswerSources` 提供關於 Google Maps 中指定地點特徵之答案的來源。"

                    ??? note "**reviewSnippets**：`ReviewSnippet array` 用於產生關於 Google Maps 中指定地點特徵之答案的評論片段。"

                        **reviewId**：`string`

                        評論片段的 ID。

                        **googleMapsUri**：`string`

                        對應到 Google Maps 上使用者評論的連結。

                        **title**：`string`

                        評論的標題。






    ??? note "**groundingSupports**：`GoogleAiGenerativelanguageV1betaGroundingSupport array` 接地支援清單。"

        ??? note "**segment**：`GoogleAiGenerativelanguageV1betaSegment` 此支援所屬內容的區段。"

            **partIndex**：`integer`

            Part 物件在其父 Content 物件中的索引。

            **startIndex**：`integer`

            在指定 Part 中的起始索引，以位元組為單位。從 Part 開頭算起的偏移量，含起始端，從零開始。

            **endIndex**：`integer`

            在指定 Part 中的結束索引，以位元組為單位。從 Part 開頭算起的偏移量，不含結束端，從零開始。

            **text**：`string`

            回應中對應於該區段的文字。



          **groundingChunkIndices**：`integer array`

          選填。索引清單（指向 `response.candidate.grounding_metadata` 中的 'grounding_chunk'），指定與該主張相關的引用。例如 [1,3,4] 表示 grounding_chunk[1]、grounding_chunk[3]、grounding_chunk[4] 是歸因於該主張的擷取內容。若回應是串流的，grounding_chunk_indices 指的是跨所有回應的索引。用戶端有責任從所有回應中累積接地區塊（同時維持相同順序）。

          **confidenceScores**：`number array`

          選填。支援參考的信心分數。範圍從 0 到 1，1 表示最有信心。此清單的大小必須與 grounding_chunk_indices 相同。

          **renderedParts**：`integer array`

          僅供輸出。指向候選內容的 `parts` 欄位的索引。這些索引指定哪些算繪出的部分與此支援來源相關。






    ??? note "**retrievalMetadata**：`RetrievalMetadata` 與接地流程中擷取相關的中繼資料。"

        **googleSearchDynamicRetrievalScore**：`number`

        選填。表示來自 Google 搜尋的資訊有多大可能有助於回答提示詞的分數。分數範圍為 [0, 1]，0 表示最不可能，1 表示最有可能。此分數僅在啟用 Google 搜尋接地與動態擷取時才會填入，並會與門檻比較，以決定是否觸發 Google 搜尋。



      **webSearchQueries**：`string array`

      後續網路搜尋的網路搜尋查詢。

      **imageSearchQueries**：`string array`

      用於接地的圖片搜尋查詢。

      **googleMapsWidgetContextToken**：`string`

      選填。Google Maps 小工具上下文 token 的資源名稱，可與 PlacesContextElement 小工具搭配使用以算繪上下文資料。僅在啟用 Google Maps 接地時才會填入。






---


  **avgLogprobs**：`number`

  僅供輸出。候選的平均對數機率分數。



---




??? note "**logprobsResult**：`LogprobsResult` 僅供輸出。回應 token 與頂尖 token 的對數概似分數"

      **logProbabilitySum**：`number`

      所有 tokens 的對數機率總和。



    ??? note "**topCandidates**：`TopCandidates array` 長度 = 解碼步驟總數。"

        ??? note "**candidates**：`LogprobsResultCandidate array` 依對數機率降冪排序。"

            **token**：`string`

            候選的 token 字串值。

            **tokenId**：`integer`

            候選的 token ID 值。

            **logProbability**：`number`

            候選的對數機率。






    ??? note "**chosenCandidates**：`LogprobsResultCandidate array` 長度 = 解碼步驟總數。所選候選可能在 top_candidates 中，也可能不在。"

        **token**：`string`

        候選的 token 字串值。

        **tokenId**：`integer`

        候選的 token ID 值。

        **logProbability**：`number`

        候選的對數機率。






---




??? note "**urlContextMetadata**：`UrlContextMetadata` 僅供輸出。與 URL 上下文擷取工具相關的中繼資料。"

    ??? note "**urlMetadata**：`UrlMetadata array` URL 上下文清單。"

          **retrievedUrl**：`string`

          工具擷取的 URL。



        ??? note "**urlRetrievalStatus**：`string enum` URL 擷取的狀態。"

            可能的值：

            - `URL_RETRIEVAL_STATUS_UNSPECIFIED`：預設值。此值未使用。
            - `URL_RETRIEVAL_STATUS_SUCCESS`：URL 擷取成功。
            - `URL_RETRIEVAL_STATUS_ERROR`：URL 擷取因錯誤而失敗。
            - `URL_RETRIEVAL_STATUS_PAYWALL`：URL 擷取因內容位於付費牆後而失敗。
            - `URL_RETRIEVAL_STATUS_UNSAFE`：URL 擷取因內容不安全而失敗。






---


  **continuationToken**：`string`

  當 `finish_reason` 為 `CONTINUATION` 時傳回的選填不透明接續 token。用戶端可在後續的 [`GenerateContentRequest`](/api-reference/generate-content/generate-content/#request-body) 中傳入此 token 以繼續產生。


### CitationMetadata {#Resource:CitationMetadata}

一段內容的來源歸因集合。

**Properties：**





??? note "**citationSources**：`CitationSource array` 針對特定回應的來源引用。"

    **startIndex**：`integer`

    選填。歸因於此來源的回應區段的開頭。索引表示區段的開頭，以位元組為單位。

    **endIndex**：`integer`

    選填。歸因區段的結尾，不含結束端。

    **uri**：`string`

    選填。被歸因為部分文字之來源的 URI。

    **license**：`string`

    選填。被歸因為區段來源的 GitHub 專案的授權。程式碼引用需要授權資訊。



### HarmCategory {#Resource:HarmCategory}

**Possible values：**

- `HARM_CATEGORY_UNSPECIFIED`：未指定類別。
- `HARM_CATEGORY_HARASSMENT`：**Gemini** - 騷擾內容。
- `HARM_CATEGORY_HATE_SPEECH`：**Gemini** - 仇恨言論與內容。
- `HARM_CATEGORY_SEXUALLY_EXPLICIT`：**Gemini** - 性露骨內容。
- `HARM_CATEGORY_DANGEROUS_CONTENT`：**Gemini** - 危險內容。
- `HARM_CATEGORY_JAILBREAK`：**Gemini** - 試圖繞過或顛覆模型安全指南的提示詞（越獄嘗試）。

### ModalityTokenCount {#Resource:ModalityTokenCount}

表示單一模態的 token 計算資訊。

**Properties：**





??? note "**modality**：`GenerativeLanguageModality` 與此 token 數量相關的模態。"

    可能的值：

    - `MODALITY_UNSPECIFIED`：未指定的模態。
    - `TEXT`：純文字。
    - `IMAGE`：圖片。
    - `VIDEO`：影片。
    - `AUDIO`：音訊。
    - `DOCUMENT`：文件，例如 PDF。






---


  **tokenCount**：`integer`

  token 數量。


### SafetyRating {#Resource:SafetyRating}

一段內容的安全評分。

安全評分包含一段內容的危害類別，以及該類別中的危害機率層級。內容會在多個危害類別上進行安全分類，危害分類的機率包含於此。

**Properties：**





??? note "**category**：必填 [`HarmCategory`](/api-reference/generate-content/generate-content/#Resource:HarmCategory) 此評分的類別。"

    可能的值：

    - `HARM_CATEGORY_UNSPECIFIED`：未指定類別。
    - `HARM_CATEGORY_HARASSMENT`：**Gemini** - 騷擾內容。
    - `HARM_CATEGORY_HATE_SPEECH`：**Gemini** - 仇恨言論與內容。
    - `HARM_CATEGORY_SEXUALLY_EXPLICIT`：**Gemini** - 性露骨內容。
    - `HARM_CATEGORY_DANGEROUS_CONTENT`：**Gemini** - 危險內容。
    - `HARM_CATEGORY_JAILBREAK`：**Gemini** - 試圖繞過或顛覆模型安全指南的提示詞（越獄嘗試）。






---


??? note "**probability**：必填 `string enum` 此內容的危害機率。"

    可能的值：

    - `HARM_PROBABILITY_UNSPECIFIED`：未指定機率。
    - `NEGLIGIBLE`：內容不安全的可能性微乎其微。
    - `LOW`：內容不安全的可能性低。
    - `MEDIUM`：內容不安全的可能性中等。
    - `HIGH`：內容不安全的可能性高。






---


  **blocked**：`boolean`

  此內容是否因這項評分而被封鎖？


### SafetySetting {#Resource:SafetySetting}

安全設定，影響安全封鎖行為。

為某個類別傳入安全設定，會改變內容被封鎖時允許的機率。

**Properties：**





??? note "**category**：必填 [`HarmCategory`](/api-reference/generate-content/generate-content/#Resource:HarmCategory) 此設定的類別。"

    可能的值：

    - `HARM_CATEGORY_UNSPECIFIED`：未指定類別。
    - `HARM_CATEGORY_HARASSMENT`：**Gemini** - 騷擾內容。
    - `HARM_CATEGORY_HATE_SPEECH`：**Gemini** - 仇恨言論與內容。
    - `HARM_CATEGORY_SEXUALLY_EXPLICIT`：**Gemini** - 性露骨內容。
    - `HARM_CATEGORY_DANGEROUS_CONTENT`：**Gemini** - 危險內容。
    - `HARM_CATEGORY_JAILBREAK`：**Gemini** - 試圖繞過或顛覆模型安全指南的提示詞（越獄嘗試）。






---




??? note "**threshold**：必填 `string enum` 控制封鎖危害的機率門檻。"

    可能的值：

    - `HARM_BLOCK_THRESHOLD_UNSPECIFIED`：未指定門檻。
    - `BLOCK_LOW_AND_ABOVE`：NEGLIGIBLE 的內容將被允許。
    - `BLOCK_MEDIUM_AND_ABOVE`：NEGLIGIBLE 與 LOW 的內容將被允許。
    - `BLOCK_ONLY_HIGH`：NEGLIGIBLE、LOW 與 MEDIUM 的內容將被允許。
    - `BLOCK_NONE`：所有內容都將被允許。
    - `OFF`：關閉安全篩選器。



### ServiceTier {#Resource:ServiceTier}

**Possible values：**

- `unspecified`：預設服務層級，即標準層級。
- `standard`：標準服務層級。
- `flex`：Flex 服務層級。
- `priority`：Priority 服務層級。

### Content {#Resource:Content}

包含訊息多部分內容的基礎結構化資料類型。

[`Content`](/api-reference/generate-content/generate-content/#Resource:Content) 包含一個 `role` 欄位，指定 [`Content`](/api-reference/generate-content/generate-content/#Resource:Content) 的產生者；以及一個 `parts` 欄位，包含構成訊息輪次內容的多部分資料。

**Properties：**





??? note "**parts**：`Part array` 構成單一訊息的有序 `Parts`。各部分可能有不同的 MIME 類型。"

    ??? note "**data**：`Union type`"

          Union 欄位 `data` 只能是下列其中之一：

          **text**：`string`

          行內文字。



        ??? note "**inlineData**：`Blob` 行內媒體位元組。"

            **mimeType**：`string`

            來源資料的 IANA 標準 MIME 類型。支援類型的範例：

            - 圖片： image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
            - Audio: audio/*, video/audio/s16le, video/audio/wav
            - Video: video/*
            - 文字： text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
            - 應用程式： application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf For additional context, see [Supported file formats](/docs/file-input-methods/#supported-content-types).

            **data**：`string`

            媒體格式的原始位元組。

            **displayName**：`string`

            選填。指定用來向模型指稱此 blob 的名稱（例如 "my_blob.png"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，用作 blob 參考識別碼。






        ??? note "**functionCall**：`FunctionCall` 模型傳回的預測 `FunctionCall`，包含一個表示 `FunctionDeclaration.name` 的字串，以及引數與其值。"

            **name**：必填 `string`

            要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

            **id**：`string`

            選填。函式呼叫的專屬識別碼。若有填入，用戶端應執行該 `function_call` 並以相符的 `id` 傳回回應。

            **args**：`object`

            選填。JSON 物件格式的函式參數與值。






        ??? note "**functionResponse**：`FunctionResponse` `FunctionCall` 的結果輸出，包含一個表示 `FunctionDeclaration.name` 的字串，以及一個包含函式任何輸出的結構化 JSON 物件，用作模型的上下文。"

              **name**：必填 `string`

              要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與連字號，長度上限為 128。

              **response**：必填 `object`

              JSON 物件格式的函式回應。呼叫者可使用任何符合函式語法的自選鍵來傳回函式輸出，例如 "output"、"result" 等。特別是，若函式呼叫執行失敗，回應可包含 "error" 鍵，將錯誤詳情傳回給模型。多媒體可透過子物件包含，子物件含有單一 "$ref" 鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，屬於持有該多媒體的 `FunctionResponsePart`。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

              **id**：`string`

              選填。此回應所對應的函式呼叫的識別碼。由用戶端填入，以符合對應函式呼叫的 `id`。



            ??? note "**parts**：`FunctionResponsePart array` 選填。構成函式回應的有序 `Parts`。各部分可能有不同的 IANA MIME 類型。"

                ??? note "**data**：`Union type` 函式回應部分的資料。"

                      Union 欄位 `data` 只能是下列其中之一：



                    ??? note "**inlineData**：`FunctionResponseBlob` 行內媒體位元組。"

                        **mimeType**：`string`

                        來源資料的 IANA 標準 MIME 類型。範例：

                        - image/png
                        - image/jpeg

                        若提供不支援的 MIME 類型，將傳回錯誤。支援類型的完整清單請參閱 [Supported file formats](/docs/file-input-methods/#supported-content-types)。

                        **data**：`string`

                        媒體格式的原始位元組。

                        **displayName**：`string`

                        選填。blob 的顯示名稱。用於提供標籤或檔名以區分各 blob，並從 `FunctionResponse.response` 參考該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。






                    ??? note "**fileData**：`FunctionResponseFileData` 以 URI 為基礎的資料。"

                        **fileUri**：必填 `string`

                        URI。

                        **mimeType**：`string`

                        來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將傳回錯誤。支援類型的完整清單請參閱 [Multimodal function responses](/docs/function-calling/#multimodal) 與 [Supported file formats](/docs/file-input-methods/#supported-content-types)。

                        **displayName**：`string`

                        選填。檔案的顯示名稱。用於提供標籤或檔名以區分檔案資料，並從 `FunctionResponse.response` 參考該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。






                ??? note "**metadata**：`Union type` 控制資料的額外前置處理。當存在 `inline_data` 或 `file_data` 時設定此欄位，以設定逐部分的靜態媒體前置處理。"


                      Union 欄位 `metadata` 只能是下列其中之一：


                    ??? note "**videoMetadata**：`VideoMetadata` 選填。影片中繼資料。中繼資料僅應在影片資料以 inline_data 或 file_data 呈現時指定。"


                          **startOffset**：`string`

                          選填。影片的起始偏移量。

                          **endOffset**：`string`

                          選填。影片的結束偏移量。

                          **fps**：`number`

                          選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。


                        ??? note "**contentLayers**：`string enum array` 選填。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                              可能的值：

                              - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                              - `FRAMES`：擷取影片影格。
                              - `AUDIO`：擷取音軌。
                              - `TRANSCRIPT`：擷取音訊逐字稿。


                    ??? note "**documentMetadata**：`DocumentMetadata` 選填。文件中繼資料。中繼資料僅應在文件資料以 inline_data 或 file_data 呈現時指定。"


                          **startPage**：`integer`

                          選填。起始頁，以 1 起算，包含起始頁。

                          **endPage**：`integer`

                          選填。結束頁，以 1 起算，包含結束頁。


                        ??? note "**contentLayers**：`string enum array` 選填。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                              可能的值：

                              - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                              - `PAGE_IMAGE`：轉譯後的頁面影像。
                              - `PAGE_TEXT`：擷取的頁面文字。


                    ??? note "**spreadsheetMetadata**：`SpreadsheetMetadata` 選填。試算表中繼資料。中繼資料僅應在試算表資料以 inline_data 或 file_data 呈現時指定。"


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


                    ??? note "**audioMetadata**：`AudioMetadata` 選填。音訊中繼資料。中繼資料僅應在音訊資料以 inline_data 或 file_data 呈現時指定。"


                          **startOffset**：`string`

                          選填。音訊的起始偏移量。

                          **endOffset**：`string`

                          選填。音訊的結束偏移，相對於音訊串流的開頭量。


                ??? note "**mediaProcessing**：`string enum` 選填。模型如何處理此部分的媒體以進行理解。僅對影片部分有意義（`inline_data` 或 MIME 為影片的 `file_data`）。非影片部分會忽略此欄位。"

                    可能的值：

                    - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
                    - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
                    - `AGENTIC`：模型驅動的動態導覽。建議用於大多數使用情境。



                ??? note "**mediaResolution**：`MediaResolution` 選填。輸入媒體的媒體解析度。"


                    ??? note "**value**：`Union type` 媒體解析度層級。"


                          Union 欄位 `value` 只能是下列其中之一：


                        ??? note "**level**：`string enum` 用於指定媒體的 Tokenizer 品質。for Gemini API support ."


                              可能的值：

                              - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                              - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低。
                              - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中。
                              - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高。
                              - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設為極高。


              **willContinue**：`boolean`

              選填。表示函式呼叫會繼續，將傳回更多回應，使函式呼叫變成產生器。僅適用於 NON_BLOCKING 函式呼叫，否則會被忽略。若設為 false，未來的回應將不被考量。允許傳回空的 `response` 並將 `will_continue=False`，以表示函式呼叫已結束。這仍可能觸發模型產生。若要避免觸發產生並結束函式呼叫，請另外將 `scheduling` 設為 `SILENT`。



            ??? note "**scheduling**：`string enum` 選填。指定回應應如何在對話中排程。僅適用於 NON_BLOCKING 函式呼叫，否則會被忽略。預設為 WHEN_IDLE。"

                可能的值：

                - `SCHEDULING_UNSPECIFIED`：此值未使用。
                - `SILENT`：僅將結果加入對話上下文，不中斷也不觸發產生。
                - `WHEN_IDLE`：將結果加入對話上下文，並提示產生輸出，但不中斷進行中的產生。
                - `INTERRUPT`：將結果加入對話上下文，中斷進行中的產生，並提示產生輸出。






        ??? note "**fileData**：`FileData` 以 URI 為基礎的資料。"

            **fileUri**：必填 `string`

            URI。

            **mimeType**：`string`

            選填。來源資料的 IANA 標準 MIME 類型。

            **displayName**：`string`

            選填。指定用來向模型指稱此檔案的名稱（例如 "my_file.pdf"）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，用作檔案參考識別碼。






        ??? note "**executableCode**：`ExecutableCode` 由模型產生、供執行的程式碼。"

            ??? note "**language**：必填 `string enum` `code` 的程式語言。"

                可能的值：

                - `LANGUAGE_UNSPECIFIED`：未指定的語言。不應使用此值。
                - `PYTHON`：Python >= 3.10，可使用 numpy 與 simpy。Python 是預設語言。



              **code**：必填 `string`

              要執行的程式碼。

              **id**：`string`

              選填。`ExecutableCode` 部分的專屬識別碼。伺服器會傳回 `CodeExecutionResult`，其 `id` 與之相符。






        ??? note "**codeExecutionResult**：`CodeExecutionResult` 執行 `ExecutableCode` 的結果。"

            ??? note "**outcome**：必填 `string enum` 程式碼執行的結果。"

                可能的值：

                - `OUTCOME_UNSPECIFIED`：未指定的狀態。不應使用此值。
                - `OUTCOME_OK`：程式碼執行成功完成。`output` 包含 stdout（如有）。
                - `OUTCOME_FAILED`：程式碼執行失敗。`output` 包含 stderr 與 stdout（如有）。
                - `OUTCOME_DEADLINE_EXCEEDED`：程式碼執行時間過長，已被取消。可能有也可能沒有部分 `output`。



              **id**：`string`

              選填。此結果所對應的 `ExecutableCode` 部分的識別碼。僅在對應的 `ExecutableCode` 有 id 時才會填入。

              **output**：`string`

              選填。程式碼執行成功時包含 stdout，否則包含 stderr 或其他說明。






        ??? note "**toolCall**：`ToolCall` 伺服器端工具呼叫。當模型預測應在伺服器上執行的工具呼叫時，會填入此欄位。預期用戶端會將此訊息回傳給 API。"

            ??? note "**toolType**：必填 `ToolType` 被呼叫的工具類型。"

                可能的值：

                - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應到 Tool.google_search.search_types.web_search。
                - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應到 Tool.google_search.search_types.image_search。
                - `URL_CONTEXT`：URL 上下文工具，對應到 Tool.url_context。
                - `GOOGLE_MAPS`：Google 地圖工具，對應到 Tool.google_maps。
                - `FILE_SEARCH`：檔案搜尋工具，對應到 Tool.file_search。
                - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應到用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



              **id**：`string`

              選填。工具呼叫的專屬識別碼。伺服器會以相符的 `id` 傳回工具回應。

              **toolName**：`string`

              選填。被呼叫的工具名稱。

              **args**：`object`

              選填。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}






        ??? note "**toolResponse**：`ToolResponse` 伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端以執行對應 `ToolCall` 的結果填入。"

            ??? note "**toolType**：必填 `ToolType` 被呼叫的工具類型，與對應的 `tool_type`（位於對應的 `ToolCall` 中）相符。"

                可能的值：

                - `TOOL_TYPE_UNSPECIFIED`：未指定的工具類型。
                - `GOOGLE_SEARCH_WEB`：Google 搜尋工具，對應到 Tool.google_search.search_types.web_search。
                - `GOOGLE_SEARCH_IMAGE`：圖片搜尋工具，對應到 Tool.google_search.search_types.image_search。
                - `URL_CONTEXT`：URL 上下文工具，對應到 Tool.url_context。
                - `GOOGLE_MAPS`：Google 地圖工具，對應到 Tool.google_maps。
                - `FILE_SEARCH`：檔案搜尋工具，對應到 Tool.file_search。
                - `MEDIA_PROCESSING`：媒體處理工具類型（例如影片、音訊等），對應到用於多模態理解的隱形工具，如 GOOGLE_UNDERSTANDING_VIDEO。



              **id**：`string`

              選填。此回應所對應的工具呼叫的識別碼。

              **response**：`object`

              選填。工具回應。






    ??? note "**metadata**：`Union type` 控制資料的額外前置處理。當存在 `inline_data` 或 `file_data` 時設定此欄位，以設定逐部分的靜態媒體前置處理。"

          Union 欄位 `metadata` 只能是下列其中之一：



        ??? note "**videoMetadata**：`VideoMetadata` 選填。影片中繼資料。中繼資料僅應在影片資料以 inline_data 或 file_data 呈現時指定。"

            **startOffset**：`string`

            選填。影片的起始偏移量。

            **endOffset**：`string`

            選填。影片的結束偏移量。

            **fps**：`number`

            選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。


            ??? note "**contentLayers**：`string enum array` 選填。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                  可能的值：

                  - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                  - `FRAMES`：擷取影片影格。
                  - `AUDIO`：擷取音軌。
                  - `TRANSCRIPT`：擷取音訊逐字稿。


        ??? note "**documentMetadata**：`DocumentMetadata` 選填。文件中繼資料。中繼資料僅應在文件資料以 inline_data 或 file_data 呈現時指定。"


              **startPage**：`integer`

              選填。起始頁，以 1 起算，包含起始頁。

              **endPage**：`integer`

              選填。結束頁，以 1 起算，包含結束頁。


            ??? note "**contentLayers**：`string enum array` 選填。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                  可能的值：

                  - `CONTENT_LAYER_UNSPECIFIED`：預設值。
                  - `PAGE_IMAGE`：轉譯後的頁面影像。
                  - `PAGE_TEXT`：擷取的頁面文字。


        ??? note "**spreadsheetMetadata**：`SpreadsheetMetadata` 選填。試算表中繼資料。中繼資料僅應在試算表資料以 inline_data 或 file_data 呈現時指定。"


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


        ??? note "**audioMetadata**：`AudioMetadata` 選填。音訊中繼資料。中繼資料僅應在音訊資料以 inline_data 或 file_data 呈現時指定。"


              **startOffset**：`string`

              選填。音訊的起始偏移量。

              **endOffset**：`string`

              選填。音訊的結束偏移，相對於音訊串流的開頭量。



      **thought**：`boolean`

      選填。表示該部分是否為來自模型的思考。

      **thoughtSignature**：`string`

      選填。思考的不透明簽章，以便在後續請求中重複使用。

      **partMetadata**：`object`

      與 Part 相關的自訂中繼資料。使用 genai.Part 作為內容表示的代理，可能需要追蹤額外資訊。例如可以是 Part 來源的檔案／來源名稱，或是多工處理多個 Part 串流的方式。



    ??? note "**mediaResolution**：`MediaResolution` 選填。輸入媒體的媒體解析度。"

        ??? note "**value**：`Union type` 媒體解析度層級。"

              Union 欄位 `value` 只能是下列其中之一：



            ??? note "**level**：`string enum` 用於指定媒體的 Tokenizer 品質。for Gemini API support ."

                可能的值：

                - `MEDIA_RESOLUTION_UNSPECIFIED`：尚未設定媒體解析度。
                - `MEDIA_RESOLUTION_LOW`：媒體解析度設為低。
                - `MEDIA_RESOLUTION_MEDIUM`：媒體解析度設為中。
                - `MEDIA_RESOLUTION_HIGH`：媒體解析度設為高。
                - `MEDIA_RESOLUTION_ULTRA_HIGH`：媒體解析度設為極高。






    ??? note "**mediaProcessing**：`string enum` 選填。模型如何處理此部分的媒體以進行理解。僅對影片部分有意義（`inline_data` 或 MIME 為影片的 `file_data`）。非影片部分會忽略此欄位。"

        可能的值：

        - `MEDIA_PROCESSING_UNSPECIFIED`：預設為模型特定的處理方式。
        - `STATIC`：固定速率影格擷取。所有影格都放入上下文。
        - `AGENTIC`：模型驅動的動態導覽。建議用於大多數使用情境。






    ??? note "**audioTranscription**：`AudioTranscription` 選填。音訊（輸入或輸出）轉錄。僅在此 Part 包含音訊資料時設定。"

          **text**：必填 `string`

          此音訊區段的轉錄文字。

          **speakerLabel**：`string`

          選填。識別此音訊區段說話者的標籤（例如 "spk_1"、"spk_2"）。在設定說話者分離時出現。



        ??? note "**words**：`WordInfo array` 選填。詳細的逐詞轉錄與時間詳情。在設定 word_timestamp 時出現。"

            **word**：必填 `string`

            單詞的轉錄。

            **startOffset**：`string`

            選填。單詞相對於音訊開頭的起始時間偏移量。

            **endOffset**：`string`

            選填。單詞相對於音訊開頭的結束時間偏移量。






    ??? note "**speechMetadata**：`SpeechMetadata` 選填。套用於文字部分的中繼資料，用於自訂其朗讀或合成方式，例如指定說話者身分或說話風格。"

        **speaker**：`string`

        選填。多說話者合成的選填說話者名稱。

        **style**：`string`

        選填。語音合成的選填風格指令。






---


  **role**：`string`

  選填。內容的產生者。必須是 'user' 或 'model'。設定此欄位對多輪對話很有用，否則可留空或不設定。


### Schema {#Resource:Schema}

[`Schema`](/api-reference/generate-content/generate-content/#Resource:Schema) 物件允許定義輸入與輸出資料類型。這些類型可以是物件，也可以是原始型別與陣列。表示 [OpenAPI 3.0 schema object](https://spec.openapis.org/oas/v3.0.3#schema) 的精選子集。

**Properties：**





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

  選填。資料的格式。允許任何值，但大多數不會觸發任何特殊功能。



---


  **title**：`string`

  選填。架構的標題。



---


  **description**：`string`

  選填。參數的簡要說明。可以包含使用範例。參數說明可使用 Markdown 格式。



---


  **nullable**：`boolean`

  選填。表示值是否可為 null。



---


  **enum**：`string array`

  選填。Type.STRING 元素在 enum 格式下的可能值。例如我們可以定義一個 Enum Direction 為：{type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]}



---


  **items**：[`Schema`](/api-reference/generate-content/generate-content/#Resource:Schema)

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

  選填。SCHEMA FIELDS FOR TYPE INTEGER and NUMBER Type.INTEGER 與 Type.NUMBER 的最小值


---


  **maximum**：`number`

  選填。Type.INTEGER 與 Type.NUMBER 的最大值。



---


  **minLength**：`string`

  選填。SCHEMA FIELDS FOR TYPE STRING Type.STRING 的最小長度。



---


  **maxLength**：`string`

  選填。Type.STRING 的最大長度。



---


  **pattern**：`string`

  選填。Type.STRING 的模式，用於將字串限制為正規表示式。



---


  **example**：`object`

  選填。物件的範例。僅在物件為根時才會填入。



---


  **anyOf**：[`Schema`](/api-reference/generate-content/generate-content/#Resource:Schema) `array`

  選填。值應針對清單中的任一（一個或多個）子架構進行驗證。



---


  **propertyOrdering**：`string array`

  選填。屬性的順序。不是 Open API 規格中的標準欄位。用於決定回應中屬性的順序。



---


  **default**：`object`

  選填。欄位的預設值。依 JSON Schema，此欄位是供文件產生器使用，不影響驗證。因此在此包含並忽略它，讓傳送帶有 `default` 欄位的架構的開發人員不會收到未知欄位錯誤。


### Tool {#Resource:Tool}

模型可用於產生回應的工具詳情。

[`Tool`](/api-reference/generate-content/generate-content/#Resource:Tool) 是一段程式碼，讓系統能與外部系統互動，在模型的知識與範圍之外執行某個動作或一組動作。

**Properties：**





??? note "**functionDeclarations**：`FunctionDeclaration array` 選填。模型可用於函式呼叫的 `FunctionDeclarations` 清單。模型或系統不會執行函式。相反地，定義的函式可能會以 FunctionCall 的形式連同引數一起傳回給用戶端執行。模型可能決定呼叫這些函式的子集，方法是將 FunctionCall 填入回應中。下一個對話輪次可能包含 FunctionResponse，其 Content.role 為 'function'，作為下一個模型輪次的產生上下文。"

      **name**：必填 `string`

      函式的名稱。必須為 a-z、A-Z、0-9，或包含底線、冒號、點與連字號，長度上限為 128。

      **description**：必填 `string`

      函式的簡要說明。

      **parameters**：[`Schema`](/api-reference/generate-content/generate-content/#Resource:Schema)

      選填。說明此函式的參數。反映 Open API 3.03 Parameter Object 字串 Key：參數的名稱。參數名稱區分大小寫。Schema Value：定義參數所用類型的 Schema。

      **parametersJsonSchema**：`object`

      選填。以 JSON Schema 格式說明函式的參數。架構必須描述一個物件，其屬性即為函式的參數。例如：`{ "type": "object", "properties": { "name": { "type": "string" }, "age": { "type": "integer" } }, "additionalProperties": false, "required": ["name", "age"], "propertyOrdering": ["name", "age"] }` 此欄位與 `parameters` 互斥。

      **response**：[`Schema`](/api-reference/generate-content/generate-content/#Resource:Schema)

      選填。以 JSON Schema 格式說明此函式的輸出。反映 Open API 3.03 Response Object。Schema 定義函式回應值所用的類型。

      **responseJsonSchema**：`object`

      選填。以 JSON Schema 格式說明此函式的輸出。架構指定的值即為函式的回應值。此欄位與 `response` 互斥。



    ??? note "**behavior**：`string enum` 選填。指定函式 Behavior。目前僅 BidiGenerateContent 方法支援。"

        可能的值：

        - `UNSPECIFIED`：此值未使用。
        - `BLOCKING`：若設定，系統會等待收到函式回應後才繼續對話。
        - `NON_BLOCKING`：若設定，系統不會等待收到函式回應。相反地，它會在維持使用者與模型之間對話的同時，嘗試在函式回應可用時加以處理。






---




??? note "**googleSearchRetrieval**：`GoogleSearchRetrieval` 選填。由 Google 搜尋驅動的擷取工具。"

    ??? note "**dynamicRetrievalConfig**：`DynamicRetrievalConfig` 指定指定來源的動態擷取設定。"

        ??? note "**mode**：`string enum` 動態擷取中要使用的預測器模式。"

            可能的值：

            - `MODE_UNSPECIFIED`：一律觸發擷取。
            - `MODE_DYNAMIC`：僅在系統判定有必要時才執行擷取。



          **dynamicThreshold**：`number`

          動態擷取中要使用的門檻。若未設定，會使用系統預設值。






---




??? note "**codeExecution**：`CodeExecution` 選填。讓模型能在產生過程中執行程式碼。"







---




??? note "**googleSearch**：`GoogleSearch` 選填。GoogleSearch 工具類型。支援模型中 Google 搜尋的工具。由 Google 提供。"

    ??? note "**timeRangeFilter**：`Interval` 選填。將搜尋結果篩選至特定時間範圍。若客戶設定了開始時間，就必須設定結束時間（反之亦然）。"

        **startTime**：`string`

        選填。區間的起始（含）。若有指定，符合此區間的 Timestamp 必須等於或晚於起始。

        **endTime**：`string`

        選填。區間的結束（不含）。若有指定，符合此區間的 Timestamp 必須早於結束。






    ??? note "**searchTypes**：`SearchTypes` 選填。要啟用的搜尋類型集合。若未設定，預設啟用網路搜尋。"

        ??? note "**webSearch**：`WebSearch` 選填。啟用網路搜尋。僅傳回文字結果。"







        ??? note "**imageSearch**：`ImageSearch` 選填。啟用圖片搜尋。傳回圖片位元組。"






---




??? note "**computerUse**：`ComputerUse` 選填。支援模型直接與電腦互動的工具。若啟用，會自動填入電腦使用專屬的函式宣告。"

    ??? note "**environment**：必填 `string enum` 正在操作的環境。"

        可能的值：

        - `ENVIRONMENT_UNSPECIFIED`：預設為瀏覽器。
        - `ENVIRONMENT_BROWSER`：在網路瀏覽器中操作。
        - `ENVIRONMENT_MOBILE`：在行動環境中操作。
        - `ENVIRONMENT_DESKTOP`：在桌面環境中操作。



      **excludedPredefinedFunctions**：`string array`

      選填。依預設，預先定義的函式會包含在最終的模型呼叫中。其中一些可以明確排除，不自動包含。這有兩個目的：1. 使用更受限／不同的動作空間。2. 改進預先定義函式的定義／指令。

      **enablePromptInjectionDetection**：`boolean`

      選填。是否在電腦使用請求上啟用提示詞注入偵測檢查。



    ??? note "**disabledSafetyPolicies**：`string enum array` 選填。電腦使用的已停用安全政策。"

        可能的值：

        - `SAFETY_POLICY_UNSPECIFIED`：未指定的安全政策。
        - `FINANCIAL_TRANSACTIONS`：金融交易的安全政策。
        - `SENSITIVE_DATA_MODIFICATION`：敏感資料修改的安全政策。
        - `COMMUNICATION_TOOL`：通訊工具的安全政策（例如 Gmail、Chat、Meet）。
        - `ACCOUNT_CREATION`：帳號建立的安全政策。
        - `DATA_MODIFICATION`：資料修改的安全政策。
        - `USER_CONSENT_MANAGEMENT`：使用者同意管理的安全政策。
        - `LEGAL_TERMS_AND_AGREEMENTS`：法律條款與協議的安全政策。






---




??? note "**urlContext**：`UrlContext` 選填。支援 URL 上下文擷取的工具。"







---




??? note "**fileSearch**：`FileSearch` 選填。FileSearch 工具類型。從 Semantic Retrieval 語料庫擷取知識的工具。"

    **fileSearchStoreNames**：必填 `string array`

    要從中擷取的 file_search_stores 名稱。範例：`fileSearchStores/my-file-search-store-123`

    **topK**：`integer`

    選填。要擷取的語意擷取區塊數量。

    **metadataFilter**：`string`

    選填。要套用於語意擷取文件與區塊的中繼資料篩選器。






---




??? note "**mcpServers**：`McpServer array` 選填。要連接的 MCP 伺服器。"

    ??? note "**transport**：`Union type` 用於連接 MCPServer 的傳輸方式。"

          Union 欄位 `transport` 只能是下列其中之一：



        ??? note "**streamableHttpTransport**：`StreamableHttpTransport` 可串流 HTTP 請求與回應的傳輸方式。"

            **url**：`string`

            MCPServer 端點的完整 URL。範例："https://api.example.com/mcp"

            **headers**：`object`

            選填：如有需要，驗證標頭、逾時等的欄位。

            **timeout**：`string`

            一般操作的 HTTP 逾時。

            **sseReadTimeout**：`string`

            SSE 讀取操作的逾時。

            **terminateOnClose**：`boolean`

            傳輸關閉時是否關閉用戶端工作階段。



      **name**：`string`

      MCPServer 的名稱。






---




??? note "**googleMaps**：`GoogleMaps` 選填。讓模型的回應能以與使用者查詢相關的地理空間上下文接地的工具。"

    **enableWidget**：`boolean`

    選填。是否在回應的 GroundingMetadata 中傳回小工具上下文 token。開發人員可使用小工具上下文 token，算繪帶有與模型在回應中參考之地點相關的地理空間上下文的 Google Maps 小工具。
