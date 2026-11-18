# 產生內容

Gemini API 支援以圖片、音訊、程式碼、工具等方式產生內容。如需瞭解各項功能的詳細資訊，請繼續閱讀並查看以任務為主的範例程式碼，或參閱完整的指南。

*  [文字產生](/docs/text-generation/)
*  [視覺](/docs/image-understanding/)
*  [音訊](/docs/audio/)
*  [嵌入向量](/docs/embeddings/)
*  [長上下文](/docs/long-context/)
*  [程式碼執行](/docs/code-execution/)
*  [JSON 模式](/docs/structured-output/)
*  [函式呼叫](/docs/function-calling/)
*  [系統指令](/docs/text-generation/#system-instructions)

## 方法 {#methods}


| 方法 | HTTP 要求 |
| --- | --- |
| [產生內容](/api-reference/generate-content/generate-content/) | `POST` `/v1beta/models/{model}:generateContent` 根據輸入的 [`GenerateContentRequest`](/api-reference/generate-content/generate-content/#request-body) 產生模型回應。 |
| [串流產生內容](/api-reference/generate-content/stream-generate-content/) | `POST` `/v1beta/models/{model}:streamGenerateContent` 從模型產生[串流回應](/docs/text-generation/#streaming-responses)，其輸入為 [`GenerateContentRequest`](/api-reference/generate-content/stream-generate-content/#request-body)。 |
| [建立臨時驗證權杖](/api-reference/generate-content/create-token/) | `POST` `/v1beta/auth_tokens` 建立一個權杖，可用於限制 BidiGenerateContent 工作階段的行為。 |


## 資料模型 {#data-models}

### GenerateContentResponse {#Resource:GenerateContentResponse}

來自模型的回應，支援多個候選回應。

安全評等與內容篩選結果會同時針對提示詞（在
`GenerateContentResponse.prompt_feedback` 中）以及每個候選回應（在
`finish_reason` 與 `safety_ratings` 中）回報。API 的行為如下：

-  回傳所有要求的候選回應，或一個都不回傳

-  只有在提示詞有問題時才完全不回傳候選回應
   （請查看 `prompt_feedback`）

-  在 `finish_reason` 與
   `safety_ratings` 中回報每個候選回應的回饋資訊。


**屬性**：


  **candidates**: [`Candidate`](/api-reference/generate-content/#Resource:Candidate) `array`

  來自模型的候選回應。

  

---


  

??? note "**promptFeedback**: `PromptFeedback` 回傳與內容篩選器相關的提示詞回饋資訊。"

    ??? note "**blockReason**: `string enum` 選填。若有設定，表示提示詞遭到封鎖，不會回傳任何候選回應。請改寫提示詞。"

        可能的值：

        - `BLOCK_REASON_UNSPECIFIED`: 預設值。此值未使用。
        - `SAFETY`: 提示詞因安全因素遭到封鎖。請查看 `safety_ratings`，瞭解是哪個安全類別造成封鎖。
        - `OTHER`: 提示詞因不明原因遭到封鎖。
        - `BLOCKLIST`: 提示詞因包含術語封鎖清單中的詞彙而遭到封鎖。
        - `PROHIBITED_CONTENT`: 提示詞因含禁止內容而遭到封鎖。
        - `IMAGE_SAFETY`: 候選回應因不安全的圖片產生內容而遭到封鎖。



      **safetyRatings**: [`SafetyRating`](/api-reference/generate-content/#Resource:SafetyRating) `array`

      提示詞的安全性評等。每個類別最多有一筆評等。



  

---


  

??? note "**usageMetadata**: `UsageMetadata` 僅供輸出。產生要求的權杖用量中繼資料。"

      **promptTokenCount**: `integer`

      提示詞中的權杖數量。當設定了 `cached_content` 時，這個值仍代表有效的提示詞總大小，也就是包含快取內容中的權杖數量。

      **cachedContentTokenCount**: `integer`

      提示詞中快取部分（快取內容）的權杖數量。

      **candidatesTokenCount**: `integer`

      所有產生的回應候選的權杖總數。

      **toolUsePromptTokenCount**: `integer`

      僅供輸出。工具使用提示詞中出現的權杖數量。

      **thoughtsTokenCount**: `integer`

      僅供輸出。思考模型所用思考內容的權杖數量。

      **totalTokenCount**: `integer`

      產生要求的權杖總數（提示詞 + 工具使用提示詞 + 思考 + 回應候選）。

      **promptTokensDetails**: [`ModalityTokenCount`](/api-reference/generate-content/#Resource:ModalityTokenCount) `array`

      僅供輸出。要求輸入中處理的模態清單。

      **cacheTokensDetails**: [`ModalityTokenCount`](/api-reference/generate-content/#Resource:ModalityTokenCount) `array`

      僅供輸出。要求輸入中快取內容的模態清單。

      **candidatesTokensDetails**: [`ModalityTokenCount`](/api-reference/generate-content/#Resource:ModalityTokenCount) `array`

      僅供輸出。回應中回傳的模態清單。

      **toolUsePromptTokensDetails**: [`ModalityTokenCount`](/api-reference/generate-content/#Resource:ModalityTokenCount) `array`

      僅供輸出。工具使用要求輸入中處理的模態清單。



    ??? note "**serviceTier**: [`ServiceTier`](/api-reference/generate-content/#Resource:ServiceTier) 僅供輸出。要求的服務層級。"

        可能的值：

        - `unspecified`: 預設服務層級，即標準層級。
        - `standard`: 標準服務層級。
        - `flex`: Flex 服務層級。
        - `priority`: Priority 服務層級。



  

---


  **modelVersion**: `string`

  僅供輸出。用於產生回應的模型版本。

  

---


  **responseId**: `string`

  僅供輸出。response_id 用於識別每個回應。

  

---


  

??? note "**modelStatus**: `ModelStatus` 僅供輸出。此模型目前的模型狀態。"

    ??? note "**modelStage**: `ModelStage` 基礎模型的階段。"

        可能的值：

        - `MODEL_STAGE_UNSPECIFIED`: 未指定的模型階段。
        - `EXPERIMENTAL`: 此階段的模型僅供實驗用途。
        - `PREVIEW`: 此階段的模型比實驗模型更成熟。
        - `STABLE`: 此階段的模型被視為穩定，可供正式環境使用。
        - `LEGACY`: 若模型處於此階段，表示該模型在不久的將來將走向淘汰。只有既有客戶能使用此模型。
        - `RETIRED`: 此階段的模型已退役。這些模型無法使用。



      **retirementTime**: `string`

      模型將退役的時間。

      **message**: `string`

      說明模型狀態的訊息。



### Candidate {#Resource:Candidate}

模型產生的回應候選。

**屬性**：


  **index**: `integer`

  僅供輸出。候選在回應候選清單中的索引。

  

---


  **content**: [`Content`](/api-reference/generate-content/#Resource:Content)

  僅供輸出。模型回傳的產生內容。

  

---


  

??? note "**finishReason**: `string enum` 選填。僅供輸出。模型停止產生權杖的原因。若為空，表示模型尚未停止產生權杖。"

    可能的值：

    - `FINISH_REASON_UNSPECIFIED`: 預設值。此值未使用。
    - `STOP`: 模型的自然停止點或指定的停止序列。
    - `MAX_TOKENS`: 已達到要求中指定的權杖數量上限。
    - `SAFETY`: 回應候選內容因安全因素遭到標記。
    - `RECITATION`: 回應候選內容因複誦因素遭到標記。
    - `LANGUAGE`: 回應候選內容因使用不支援的語言而遭到標記。
    - `OTHER`: 不明原因。
    - `BLOCKLIST`: 權杖產生因內容包含禁用詞彙而停止。
    - `PROHIBITED_CONTENT`: 權杖產生因可能包含禁止內容而停止。
    - `SPII`: 權杖產生因內容可能包含敏感個人識別資訊（SPII）而停止。
    - `MALFORMED_FUNCTION_CALL`: 模型產生的函式呼叫無效。
    - `IMAGE_SAFETY`: 權杖產生因產生的圖片違反安全規定而停止。
    - `IMAGE_PROHIBITED_CONTENT`: 圖片產生因產生的圖片含有其他禁止內容而停止。
    - `IMAGE_OTHER`: 圖片產生因其他雜項問題而停止。
    - `NO_IMAGE`: 模型預期應產生圖片，但未產生任何圖片。
    - `IMAGE_RECITATION`: 圖片產生因複誦而停止。
    - `UNEXPECTED_TOOL_CALL`: 模型產生了工具呼叫，但要求中未啟用任何工具。
    - `TOO_MANY_TOOL_CALLS`: 模型連續呼叫了過多工具，因此系統結束執行。
    - `MISSING_THOUGHT_SIGNATURE`: 要求中至少缺少一個思考簽章。
    - `MALFORMED_RESPONSE`: 因回應格式錯誤而結束。
    - `ESCALATION`: 要求遭到升級規則篩選。
    - `PUP_LIMITED_DISABLED`: 表示權杖產生因使用者帳號違反禁止使用政策（PUP）而受限或遭停用，因而停止。
    - `CONTINUATION`: 權杖產生因回應已達到單一要求的權杖上限而停止，但產生尚未完成。可使用回傳的 `continuation_token`，透過後續要求繼續模型的回應。請注意，`max_output_tokens` 會在各個接續跳點之間累計，且必須單調遞增或省略。



  

---


  **finishMessage**: `string`

  選填。僅供輸出。詳細說明模型停止產生權杖的原因。僅在設定了 `finish_reason` 時才會填入。

  

---


  **safetyRatings**: [`SafetyRating`](/api-reference/generate-content/#Resource:SafetyRating) `array`

  回應候選的安全性評等清單。每個類別最多有一筆評等。

  

---


  **citationMetadata**: [`CitationMetadata`](/api-reference/generate-content/#Resource:CitationMetadata)

  僅供輸出。模型產生之候選回應的引用資訊。此欄位可能會針對 `content` 中包含的任何文字填入複誦資訊。這些是從基礎 LLM 訓練資料中的受版權保護素材「複誦」而來的段落。

  

---


  **tokenCount**: `integer`

  僅供輸出。此候選回應的權杖數量。

  

---


  

??? note "**groundingAttributions**: `GroundingAttribution array` 僅供輸出。對接地答案有所貢獻的來源歸屬資訊。此欄位會針對 `GenerateAnswer` 呼叫填入。"

    ??? note "**sourceId**: `AttributionSourceId` 僅供輸出。對此歸屬有所貢獻的來源識別碼。"

        ??? note "**source**: `Union type`"

              聯集欄位 `source` 只能是下列其中之一：



            ??? note "**groundingPassage**: `GroundingPassageId` 行內段落的識別碼。"

                **passageId**: `string`

                僅供輸出。與 `GenerateAnswerRequest` 的 `GroundingPassage.id` 相符的段落 ID。

                **partIndex**: `integer`

                僅供輸出。該部分在 `GenerateAnswerRequest` 的 `GroundingPassage.content` 中的索引。





            ??? note "**semanticRetrieverChunk**: `SemanticRetrieverChunk` 透過 Semantic Retriever 擷取的 `Chunk` 識別碼。"

                **source**: `string`

                僅供輸出。與要求的 `SemanticRetrieverConfig.source` 相符的來源名稱。範例：`corpora/123` 或 `corpora/123/documents/abc`

                **chunk**: `string`

                僅供輸出。包含歸屬文字的 `Chunk` 名稱。範例：`corpora/123/documents/abc/chunks/xyz`



      **content**: [`Content`](/api-reference/generate-content/#Resource:Content)

      組成此歸屬的接地來源內容。



  

---


  

??? note "**groundingMetadata**: `GroundingMetadata` 僅供輸出。候選回應的接地中繼資料。此欄位會針對 `GenerateContent` 呼叫填入。"

    ??? note "**searchEntryPoint**: `SearchEntryPoint` 選填。供後續網路搜尋使用的 Google 搜尋入口。"

        **renderedContent**: `string`

        選填。可嵌入網頁或應用程式 webview 的網路內容片段。

        **sdkBlob**: `string`

        選填。代表 tuple 陣列的 Base64 編碼 JSON。





    ??? note "**groundingChunks**: `GroundingChunk array` 從指定接地來源擷取的佐證參考清單。串流時，這裡只包含尚未出現在先前回應之接地中繼資料中的接地區塊。"

        ??? note "**chunkType**: `Union type` 區塊類型。"

              聯集欄位 `chunkType` 只能是下列其中之一：



            ??? note "**web**: `Web` 來自網路的接地區塊。"

                **uri**: `string`

                僅供輸出。區塊的 URI 參考。

                **title**: `string`

                僅供輸出。區塊的標題。





            ??? note "**image**: `Image` 選填。來自圖片搜尋的接地區塊。"

                **sourceUri**: `string`

                供歸屬使用的網頁 URI。

                **imageUri**: `string`

                圖片素材的 URL。

                **title**: `string`

                圖片所在網頁的標題。

                **domain**: `string`

                圖片所在網頁的根網域，例如「example.com」。





            ??? note "**retrievedContext**: `RetrievedContext` 選填。由檔案搜尋工具擷取的上下文所形成的接地區塊。"

                  **uri**: `string`

                  選填。語意擷取文件的 URI 參考。

                  **title**: `string`

                  選填。文件的標題。

                  **text**: `string`

                  選填。區塊的文字。

                  **fileSearchStore**: `string`

                  選填。包含該文件的 `FileSearchStore` 名稱。範例：`fileSearchStores/123`



                ??? note "**customMetadata**: `GroundingChunkCustomMetadata array` 選填。使用者提供的擷取上下文中繼資料。"

                    ??? note "**value**: `Union type` 中繼資料的值。可以是字串、字串清單或數字。"

                          聯集欄位 `value` 只能是下列其中之一：

                          **stringValue**: `string`

                          選填。中繼資料的字串值。



                        ??? note "**stringListValue**: `GroundingChunkStringList` 選填。中繼資料的字串值清單。"

                            **values**: `string array`

                            清單中的字串值。



                          **numericValue**: `number`

                          選填。中繼資料的數值。此值的預期範圍取決於所使用的特定 `key`。



                      **key**: `string`

                      中繼資料的鍵。



                  **pageNumber**: `integer`

                  選填。擷取上下文的頁碼（如適用）。

                  **mediaId**: `string`

                  選填。多模態檔案搜尋結果的媒體 blob 資源名稱。格式：fileSearchStores/{file_search_store_id}/media/{blob_id}





            ??? note "**maps**: `Maps` 選填。來自 Google Maps 的接地區塊。"

                  **uri**: `string`

                  地點的 URI 參考。

                  **title**: `string`

                  地點的標題。

                  **text**: `string`

                  地點答案的文字說明。

                  **placeId**: `string`

                  地點的 ID，格式為 `places/{place_id}`。使用者可用此 ID 查詢該地點。



                ??? note "**placeAnswerSources**: `PlaceAnswerSources` 提供 Google Maps 中某地點特色相關答案的來源。"

                    ??? note "**reviewSnippets**: `ReviewSnippet array` 用於產生 Google Maps 中某地點特色相關答案的評論片段。"

                        **reviewId**: `string`

                        評論片段的 ID。

                        **googleMapsUri**: `string`

                        對應到 Google Maps 上使用者評論的連結。

                        **title**: `string`

                        評論的標題。





    ??? note "**groundingSupports**: `GoogleAiGenerativelanguageV1betaGroundingSupport array` 接地佐證清單。"

        ??? note "**segment**: `GoogleAiGenerativelanguageV1betaSegment` 此佐證所屬內容的區段。"

            **partIndex**: `integer`

            Part 物件在其父 Content 物件中的索引。

            **startIndex**: `integer`

            在給定 Part 中的起始索引，以位元組計。從 Part 的開頭起算（含起始位置），從零開始。

            **endIndex**: `integer`

            在給定 Part 中的結束索引，以位元組計。從 Part 的開頭起算（不含結束位置），從零開始。

            **text**: `string`

            回應中對應到該區段的文字。



          **groundingChunkIndices**: `integer array`

          選填。指定與該主張相關之引用的索引清單（指向 `response.candidate.grounding_metadata` 中的「grounding_chunk」）。例如 [1,3,4] 表示 grounding_chunk[1]、grounding_chunk[3]、grounding_chunk[4] 是歸屬於該主張的擷取內容。若回應是串流形式，grounding_chunk_indices 指的是所有回應之間的索引。用戶端有責任累積所有回應中的接地區塊（同時維持相同順序）。

          **confidenceScores**: `number array`

          選填。佐證參考的信心分數。範圍從 0 到 1，1 表示最有信心。此清單的大小必須與 grounding_chunk_indices 相同。

          **renderedParts**: `integer array`

          僅供輸出。指向候選回應內容之 `parts` 欄位的索引。這些索引指定哪些算繪後的部分與此佐證來源相關。





    ??? note "**retrievalMetadata**: `RetrievalMetadata` 與接地流程中擷取相關的中繼資料。"

        **googleSearchDynamicRetrievalScore**: `number`

        選填。表示 Google 搜尋資訊能協助回答提示詞之可能性的分數。分數範圍為 [0, 1]，0 表示最不可能，1 表示最有可能。此分數僅在啟用 Google 搜尋接地與動態擷取時才會填入。它會與門檻值比較，以決定是否觸發 Google 搜尋。



      **webSearchQueries**: `string array`

      供後續網路搜尋使用的網路搜尋查詢。

      **imageSearchQueries**: `string array`

      用於接地的圖片搜尋查詢。

      **googleMapsWidgetContextToken**: `string`

      選填。可搭配 PlacesContextElement 小工具使用的 Google Maps 小工具上下文權杖資源名稱，用於算繪上下文資料。僅在啟用 Google Maps 接地時才會填入。



  

---


  **avgLogprobs**: `number`

  僅供輸出。候選回應的平均對數機率分數。

  

---


  

??? note "**logprobsResult**: `LogprobsResult` 僅供輸出。回應權杖與頂尖權杖的對數概似分數"

      **logProbabilitySum**: `number`

      所有權杖的對數機率總和。



    ??? note "**topCandidates**: `TopCandidates array` 長度 = 解碼步驟總數。"

        ??? note "**candidates**: `LogprobsResultCandidate array` 依對數機率由高至低排序。"

            **token**: `string`

            候選回應的權杖字串值。

            **tokenId**: `integer`

            候選回應的權杖 id 值。

            **logProbability**: `number`

            候選回應的對數機率。





    ??? note "**chosenCandidates**: `LogprobsResultCandidate array` 長度 = 解碼步驟總數。所選的候選回應不一定會出現在 top_candidates 中。"

        **token**: `string`

        候選回應的權杖字串值。

        **tokenId**: `integer`

        候選回應的權杖 id 值。

        **logProbability**: `number`

        候選回應的對數機率。



  

---


  

??? note "**urlContextMetadata**: `UrlContextMetadata` 僅供輸出。與網址上下文擷取工具相關的中繼資料。"

    ??? note "**urlMetadata**: `UrlMetadata array` 網址上下文清單。"

          **retrievedUrl**: `string`

          工具擷取的網址。



        ??? note "**urlRetrievalStatus**: `string enum` 網址擷取的狀態。"

            可能的值：

            - `URL_RETRIEVAL_STATUS_UNSPECIFIED`: 預設值。此值未使用。
            - `URL_RETRIEVAL_STATUS_SUCCESS`: 網址擷取成功。
            - `URL_RETRIEVAL_STATUS_ERROR`: 網址擷取因錯誤而失敗。
            - `URL_RETRIEVAL_STATUS_PAYWALL`: 網址擷取因內容位於付費牆後而失敗。
            - `URL_RETRIEVAL_STATUS_UNSAFE`: 網址擷取因內容不安全而失敗。



  

---


  **continuationToken**: `string`

  當 `finish_reason` 為 `CONTINUATION` 時回傳的選填不透明接續權杖。用戶端可在後續的 `GenerateContentRequest` 中傳入此權杖，以繼續產生。


### CitationMetadata {#Resource:CitationMetadata}

一段內容的來源歸屬集合。

**屬性**：


  

??? note "**citationSources**: `CitationSource array` 針對特定回應的來源引用。"

    **startIndex**: `integer`

    選填。回應中歸屬於此來源之區段的開頭。索引表示區段的開頭，以位元組計。

    **endIndex**: `integer`

    選填。歸屬區段的結尾（不含結尾位置）。

    **uri**: `string`


    選填。被歸屬為某段文字來源的 URI。

    **license**: `string`

    選填。被歸屬為區段來源的 GitHub 專案授權。程式碼引用需要提供授權資訊。



### HarmCategory {#Resource:HarmCategory}

**可能的值**：

- `HARM_CATEGORY_UNSPECIFIED`: 未指定類別。
- `HARM_CATEGORY_HARASSMENT`: **Gemini** - 騷擾內容。
- `HARM_CATEGORY_HATE_SPEECH`: **Gemini** - 仇恨言論與內容。
- `HARM_CATEGORY_SEXUALLY_EXPLICIT`: **Gemini** - 色情露骨內容。
- `HARM_CATEGORY_DANGEROUS_CONTENT`: **Gemini** - 危險內容。
- `HARM_CATEGORY_JAILBREAK`: **Gemini** - 企圖繞過或顛覆模型安全準則的提示詞（越獄嘗試）。

### ModalityTokenCount {#Resource:ModalityTokenCount}

代表單一模態的權杖計算資訊。

**屬性**：


  

??? note "**modality**: `GenerativeLanguageModality` 與此權杖數量相關的模態。"

    可能的值：

    - `MODALITY_UNSPECIFIED`: 未指定的模態。
    - `TEXT`: 純文字。
    - `IMAGE`: 圖片。
    - `VIDEO`: 影片。
    - `AUDIO`: 音訊。
    - `DOCUMENT`: 文件，例如 PDF。



  

---


  **tokenCount**: `integer`

  權杖數量。


### SafetyRating {#Resource:SafetyRating}

一段內容的安全評等。

安全評等包含一段內容的危害類別，以及該類別中的
危害機率等級。內容會跨多個危害類別進行安全
分類，而危害分類的機率也包含在
這裡。

**屬性**：


  

??? note "**category**: required [`HarmCategory`](/api-reference/generate-content/#Resource:HarmCategory) 此評等的類別。"

    可能的值：

    - `HARM_CATEGORY_UNSPECIFIED`: 未指定類別。
    - `HARM_CATEGORY_HARASSMENT`: **Gemini** - 騷擾內容。
    - `HARM_CATEGORY_HATE_SPEECH`: **Gemini** - 仇恨言論與內容。
    - `HARM_CATEGORY_SEXUALLY_EXPLICIT`: **Gemini** - 色情露骨內容。
    - `HARM_CATEGORY_DANGEROUS_CONTENT`: **Gemini** - 危險內容。
    - `HARM_CATEGORY_JAILBREAK`: **Gemini** - 企圖繞過或顛覆模型安全準則的提示詞（越獄嘗試）。



  

---


  

??? note "**probability**: required `string enum` 此內容的危害機率。"

    可能的值：

    - `HARM_PROBABILITY_UNSPECIFIED`: 未指定機率。
    - `NEGLIGIBLE`: 內容不安全的可能性微乎其微。
    - `LOW`: 內容不安全的可能性低。
    - `MEDIUM`: 內容不安全的可能性中等。
    - `HIGH`: 內容不安全的可能性高。



  

---


  **blocked**: `boolean`

  此內容是否因這筆評等而遭到封鎖？


### SafetySetting {#Resource:SafetySetting}

安全設定，影響安全封鎖行為。

針對某個類別傳入安全設定，會改變內容遭到封鎖的
允許機率。

**屬性**：


  

??? note "**category**: required [`HarmCategory`](/api-reference/generate-content/#Resource:HarmCategory) 此設定的類別。"

    可能的值：

    - `HARM_CATEGORY_UNSPECIFIED`: 未指定類別。
    - `HARM_CATEGORY_HARASSMENT`: **Gemini** - 騷擾內容。
    - `HARM_CATEGORY_HATE_SPEECH`: **Gemini** - 仇恨言論與內容。
    - `HARM_CATEGORY_SEXUALLY_EXPLICIT`: **Gemini** - 色情露骨內容。
    - `HARM_CATEGORY_DANGEROUS_CONTENT`: **Gemini** - 危險內容。
    - `HARM_CATEGORY_JAILBREAK`: **Gemini** - 企圖繞過或顛覆模型安全準則的提示詞（越獄嘗試）。



  

---


  

??? note "**threshold**: required `string enum` 控制危害遭到封鎖的機率門檻。"

    可能的值：

    - `HARM_BLOCK_THRESHOLD_UNSPECIFIED`: 未指定門檻。
    - `BLOCK_LOW_AND_ABOVE`: 允許 NEGLIGIBLE 的內容。
    - `BLOCK_MEDIUM_AND_ABOVE`: 允許 NEGLIGIBLE 與 LOW 的內容。
    - `BLOCK_ONLY_HIGH`: 允許 NEGLIGIBLE、LOW 與 MEDIUM 的內容。
    - `BLOCK_NONE`: 允許所有內容。
    - `OFF`: 關閉安全篩選器。



### ServiceTier {#Resource:ServiceTier}

**可能的值**：

- `unspecified`: 預設服務層級，即標準層級。
- `standard`: 標準服務層級。
- `flex`: Flex 服務層級。
- `priority`: Priority 服務層級。

### Content {#Resource:Content}

包含訊息多部分內容的基礎結構化資料類型。

[`Content`](/api-reference/generate-content/#Resource:Content) 包含一個 `role` 欄位，用以指定 [`Content`](/api-reference/generate-content/#Resource:Content) 的產生者，
以及一個 `parts` 欄位，其中包含多部分資料，即訊息回合的
內容。

**屬性**：


  

??? note "**parts**: `Part array` 組成單一訊息的有序 `Parts`。各部分可能有不同的 MIME 類型。"

    ??? note "**data**: `Union type`"

          聯集欄位 `data` 只能是下列其中之一：

          **text**: `string`

          行內文字。



        ??? note "**inlineData**: `Blob` 行內媒體位元組。"

            **mimeType**: `string`

            來源資料的 IANA 標準 MIME 類型。支援的類型範例：

            - 圖片： image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, image/gif, image/avif
            - Audio: audio/*, video/audio/s16le, video/audio/wav
            - Video: video/*
            - 文字： text/plain, text/html, text/css, text/javascript, text/x-typescript, text/csv, text/markdown, text/x-python, text/xml, text/rtf, video/text/timestamp
            - 應用程式： application/x-javascript, application/x-typescript, application/x-python-code, application/json, application/x-ipynb+json, application/rtf, application/pdf 如需更多背景資訊，請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

            **data**: `string`

            媒體格式的原始位元組。

            **displayName**: `string`

            選填。指定用來向模型指稱此 blob 的名稱（例如「my_blob.png」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為 blob 參考識別碼使用。





        ??? note "**functionCall**: `FunctionCall` 模型回傳的預測 `FunctionCall`，其中包含代表 `FunctionDeclaration.name` 的字串，以及引數與其值。"

            **name**: required `string`

            要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與破折號，長度上限為 128。

            **id**: `string`

            選填。函式呼叫的唯一識別碼。若有填入，用戶端應執行該 `function_call`，並以相符的 `id` 回傳回應。

            **args**: `object`

            選填。JSON 物件格式的函式參數與值。





        ??? note "**functionResponse**: `FunctionResponse` `FunctionCall` 的結果輸出，其中包含代表 `FunctionDeclaration.name` 的字串，以及包含函式任何輸出的結構化 JSON 物件，作為提供給模型的上下文。"

              **name**: required `string`

              要呼叫的函式名稱。必須為 a-z、A-Z、0-9，或包含底線與破折號，長度上限為 128。

              **response**: required `object`

              JSON 物件格式的函式回應。呼叫端可使用任何符合函式語法的自選鍵來回傳函式輸出，例如「output」、「result」等。特別是當函式呼叫執行失敗時，回應可包含「error」鍵，將錯誤詳細資訊回傳給模型。多媒體內容可透過子物件納入，該子物件包含單一「$ref」鍵，其值為 `inline_data.display_name` 或 `file_data.display_name`，屬於持有該多媒體的 `FunctionResponsePart`。請參閱[多模態函式回應](/docs/function-calling/#multimodal)。

              **id**: `string`

              選填。此回應所對應之函式呼叫的識別碼。由用戶端填入，以對應到相應的函式呼叫 `id`。



            ??? note "**parts**: `FunctionResponsePart array` 選填。組成函式回應的有序 `Parts`。各部分可能有不同的 IANA MIME 類型。"

                ??? note "**data**: `Union type` 函式回應部分的資料。"

                      聯集欄位 `data` 只能是下列其中之一：



                    ??? note "**inlineData**: `FunctionResponseBlob` 行內媒體位元組。"

                        **mimeType**: `string`

                        來源資料的 IANA 標準 MIME 類型。範例：

                        - image/png
                        - image/jpeg

                        若提供不支援的 MIME 類型，將回傳錯誤。如需支援類型的完整清單，請參閱[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                        **data**: `string`

                        媒體格式的原始位元組。

                        **displayName**: `string`

                        選填。blob 的顯示名稱。用於提供標籤或檔案名稱以區分各個 blob，並可從 `FunctionResponse.response` 參照該 blob（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                    ??? note "**fileData**: `FunctionResponseFileData` 以 URI 為基礎的資料。"

                        **fileUri**: required `string`

                        URI。

                        **mimeType**: `string`

                        來源資料的 IANA 標準 MIME 類型。若提供不支援的 MIME 類型，將回傳錯誤。如需支援類型的完整清單，請參閱[多模態函式回應](/docs/function-calling/#multimodal)與[支援的檔案格式](/docs/file-input-methods/#supported-content-types)。

                        **displayName**: `string`

                        選填。檔案的顯示名稱。用於提供標籤或檔案名稱以區分檔案資料，並可從 `FunctionResponse.response` 參照該檔案（例如透過 `{"$ref": "DISPLAY_NAME"}`）。





                ??? note "**metadata**: `Union type` 控制資料的額外前處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定逐部分的靜態媒體前處理。"


                      聯集欄位 `metadata` 只能是下列其中之一：


                    ??? note "**videoMetadata**: `VideoMetadata` 選填。影片中繼資料。中繼資料只應在影片資料以 inline_data 或 file_data 呈現時指定。"


                          **startOffset**: `string`

                          選填。影片的起始偏移。

                          **endOffset**: `string`

                          選填。影片的結束偏移。

                          **fps**: `number`

                          選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。


                        ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                              可能的值：

                              - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                              - `FRAMES`: 擷取影片影格。
                              - `AUDIO`: 擷取音軌。
                              - `TRANSCRIPT`: 擷取音訊逐字稿。


                    ??? note "**documentMetadata**: `DocumentMetadata` 選填。文件中繼資料。中繼資料只應在文件資料以 inline_data 或 file_data 呈現時指定。"


                          **startPage**: `integer`

                          選填。起始頁，以 1 起算，包含起始頁。

                          **endPage**: `integer`

                          選填。結束頁，以 1 起算，包含結束頁。


                        ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                              可能的值：

                              - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                              - `PAGE_IMAGE`: 轉譯後的頁面影像。
                              - `PAGE_TEXT`: 擷取的頁面文字。


                    ??? note "**spreadsheetMetadata**: `SpreadsheetMetadata` 選填。試算表中繼資料。中繼資料只應在試算表資料以 inline_data 或 file_data 呈現時指定。"


                          **visibleCells**: `string`

                          選填。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

                          **sheetIndex**: `integer`

                          選填。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


                        ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                              可能的值：

                              - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                              - `DATA`: 儲存格值、合併儲存格與格式。
                              - `FORMULAS`: 公式運算式及其計算結果。
                              - `VISUAL`: 工作表的轉譯影像。


                    ??? note "**audioMetadata**: `AudioMetadata` 選填。音訊中繼資料。中繼資料只應在音訊資料以 inline_data 或 file_data 呈現時指定。"


                          **startOffset**: `string`

                          選填。音訊的起始偏移。

                          **endOffset**: `string`

                          選填。音訊的結束偏移，相對於音訊串流的開頭。


                ??? note "**mediaProcessing**: `string enum` 選填。模型如何處理此部分的媒體以利理解。僅對影片部分有意義（`inline_data` 或 MIME 類型為影片的 `file_data`）。非影片部分會忽略此欄位。"

                    可能的值：

                    - `MEDIA_PROCESSING_UNSPECIFIED`: 預設為模型專屬的處理方式。
                    - `STATIC`: 固定速率影格擷取。所有影格都放入上下文。
                    - `AGENTIC`: 由模型驅動的動態導覽。建議用於大多數使用情境。



                ??? note "**mediaResolution**: `V1mainMediaResolution` 選填。輸入媒體的媒體解析度。"


                    ??? note "**value**: `Union type` 媒體解析度等級。"


                          聯集欄位 `value` 只能是下列其中之一：


                        ??? note "**level**: `string enum` 用於給定媒體的權杖化品質。適用於 Gemini API 支援。"


                              可能的值：

                              - `MEDIA_RESOLUTION_UNSPECIFIED`: 尚未設定媒體解析度。
                              - `MEDIA_RESOLUTION_LOW`: 媒體解析度設為低。
                              - `MEDIA_RESOLUTION_MEDIUM`: 媒體解析度設為中。
                              - `MEDIA_RESOLUTION_HIGH`: 媒體解析度設為高。
                              - `MEDIA_RESOLUTION_ULTRA_HIGH`: 媒體解析度設為超高。


              **willContinue**: `boolean`

              選填。表示函式呼叫會繼續，將有更多回應回傳，使函式呼叫變成產生器。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。若設為 false，後續回應將不被考慮。允許回傳空的 `response` 並搭配 `will_continue=False`，表示函式呼叫已完成。這仍可能觸發模型產生。若要避免觸發產生並結束函式呼叫，另外將 `scheduling` 設為 `SILENT`。



            ??? note "**scheduling**: `string enum` 選填。指定回應應如何在對話中排程。僅適用於 NON_BLOCKING 函式呼叫，其他情況會被忽略。預設為 WHEN_IDLE。"

                可能的值：

                - `SCHEDULING_UNSPECIFIED`: 此值未使用。
                - `SILENT`: 只將結果加入對話上下文，不中斷也不觸發產生。
                - `WHEN_IDLE`: 將結果加入對話上下文，並提示產生輸出，但不中斷進行中的產生。
                - `INTERRUPT`: 將結果加入對話上下文，中斷進行中的產生，並提示產生輸出。





        ??? note "**fileData**: `FileData` 以 URI 為基礎的資料。"

            **fileUri**: required `string`

            URI。

            **mimeType**: `string`

            選填。來源資料的 IANA 標準 MIME 類型。

            **displayName**: `string`

            選填。指定用來向模型指稱此檔案的名稱（例如「my_file.pdf」）。當 `verbalization_mode` 設為 `REFERENCE_ONLY` 時，作為檔案參考識別碼使用。





        ??? note "**executableCode**: `ExecutableCode` 模型產生、預定要執行的程式碼。"

            ??? note "**language**: required `string enum` `code` 的程式語言。"

                可能的值：

                - `LANGUAGE_UNSPECIFIED`: 未指定的語言。不應使用此值。
                - `PYTHON`: Python >= 3.10，可使用 numpy 與 simpy。Python 是預設語言。



              **code**: required `string`

              要執行的程式碼。

              **id**: `string`

              選填。`ExecutableCode` 部分的唯一識別碼。伺服器會回傳 `CodeExecutionResult`，其 `id` 與之相符。





        ??? note "**codeExecutionResult**: `CodeExecutionResult` 執行 `ExecutableCode` 的結果。"

            ??? note "**outcome**: required `string enum` 程式碼執行的結果。"

                可能的值：

                - `OUTCOME_UNSPECIFIED`: 未指定的狀態。不應使用此值。
                - `OUTCOME_OK`: 程式碼執行成功完成。`output` 包含標準輸出（如有）。
                - `OUTCOME_FAILED`: 程式碼執行失敗。`output` 包含標準錯誤與標準輸出（如有）。
                - `OUTCOME_DEADLINE_EXCEEDED`: 程式碼執行時間過長，已被取消。可能會也可能不會有部分 `output`。



              **id**: `string`

              選填。此結果所對應之 `ExecutableCode` 部分的識別碼。僅在對應的 `ExecutableCode` 有 id 時才會填入。

              **output**: `string`

              選填。程式碼執行成功時包含標準輸出，否則包含標準錯誤或其他說明。





        ??? note "**toolCall**: `ToolCall` 伺服器端工具呼叫。當模型預測到應在伺服器上執行的工具叫用時，會填入此欄位。用戶端應將此訊息原樣回傳給 API。"

            ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型。"

                可能的值：

                - `TOOL_TYPE_UNSPECIFIED`: 未指定的工具類型。
                - `GOOGLE_SEARCH_WEB`: Google 搜尋工具，對應到 Tool.google_search.search_types.web_search。
                - `GOOGLE_SEARCH_IMAGE`: 圖片搜尋工具，對應到 Tool.google_search.search_types.image_search。
                - `URL_CONTEXT`: URL 上下文工具，對應到 Tool.url_context。
                - `GOOGLE_MAPS`: Google Maps 工具，對應到 Tool.google_maps。
                - `FILE_SEARCH`: 檔案搜尋工具，對應到 Tool.file_search。
                - `MEDIA_PROCESSING`: 媒體處理工具類型（例如影片、音訊等），對應到用於多模態理解的隱形工具，例如 GOOGLE_UNDERSTANDING_VIDEO。



              **id**: `string`

              選填。工具呼叫的唯一識別碼。伺服器會以相符的 `id` 回傳工具回應。

              **toolName**: `string`

              選填。被呼叫的工具名稱。

              **args**: `object`

              選填。工具呼叫引數。範例：{"arg1" : "value1", "arg2" : "value2" , ...}





        ??? note "**toolResponse**: `ToolResponse` 伺服器端 `ToolCall` 執行的輸出。此欄位由用戶端填入對應 `ToolCall` 的執行結果。"

            ??? note "**toolType**: required `V1mainToolType` 被呼叫的工具類型，與對應的 `tool_type`（位於對應的 `ToolCall` 中）相符。"

                可能的值：

                - `TOOL_TYPE_UNSPECIFIED`: 未指定的工具類型。
                - `GOOGLE_SEARCH_WEB`: Google 搜尋工具，對應到 Tool.google_search.search_types.web_search。
                - `GOOGLE_SEARCH_IMAGE`: 圖片搜尋工具，對應到 Tool.google_search.search_types.image_search。
                - `URL_CONTEXT`: URL 上下文工具，對應到 Tool.url_context。
                - `GOOGLE_MAPS`: Google Maps 工具，對應到 Tool.google_maps。
                - `FILE_SEARCH`: 檔案搜尋工具，對應到 Tool.file_search。
                - `MEDIA_PROCESSING`: 媒體處理工具類型（例如影片、音訊等），對應到用於多模態理解的隱形工具，例如 GOOGLE_UNDERSTANDING_VIDEO。



              **id**: `string`

              選填。此回應所對應之工具呼叫的識別碼。

              **response**: `object`

              選填。工具回應。





    ??? note "**metadata**: `Union type` 控制資料的額外前處理。當 `inline_data` 或 `file_data` 存在時設定此欄位，以設定逐部分的靜態媒體前處理。"

          聯集欄位 `metadata` 只能是下列其中之一：



        ??? note "**videoMetadata**: `VideoMetadata` 選填。影片中繼資料。中繼資料只應在影片資料以 inline_data 或 file_data 呈現時指定。"

            **startOffset**: `string`

            選填。影片的起始偏移。

            **endOffset**: `string`

            選填。影片的結束偏移。

            **fps**: `number`

            選填。傳送給模型的影片影格率。若未指定，預設值為 1.0。fps 範圍為 (0.0, 24.0]。


            ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，預設為 [FRAMES, AUDIO]。"


                  可能的值：

                  - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                  - `FRAMES`: 擷取影片影格。
                  - `AUDIO`: 擷取音軌。
                  - `TRANSCRIPT`: 擷取音訊逐字稿。


        ??? note "**documentMetadata**: `DocumentMetadata` 選填。文件中繼資料。中繼資料只應在文件資料以 inline_data 或 file_data 呈現時指定。"


              **startPage**: `integer`

              選填。起始頁，以 1 起算，包含起始頁。

              **endPage**: `integer`

              選填。結束頁，以 1 起算，包含結束頁。


            ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 DocumentMetadata 時預設為 [PAGE_IMAGE]；若未設定 DocumentMetadata，則使用預設的文件處理方式（例如 PDF 的頁面影像）。"


                  可能的值：

                  - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                  - `PAGE_IMAGE`: 轉譯後的頁面影像。
                  - `PAGE_TEXT`: 擷取的頁面文字。


        ??? note "**spreadsheetMetadata**: `SpreadsheetMetadata` 選填。試算表中繼資料。中繼資料只應在試算表資料以 inline_data 或 file_data 呈現時指定。"


              **visibleCells**: `string`

              選填。要擷取的儲存格範圍，以 A1 標記法表示（例如 "A1:D10"）。若未設定，將使用工作表已佔用的完整範圍。

              **sheetIndex**: `integer`

              選填。要擷取的工作表索引，以 1 起算，依活頁簿順序。若未設定，會擷取全部工作表。


            ??? note "**contentLayers**: `string enum array` 選填。要傳回的內容層。若為空，當設定了 SpreadsheetMetadata 時預設為 [DATA, FORMULAS]。"


                  可能的值：

                  - `CONTENT_LAYER_UNSPECIFIED`: 預設值。
                  - `DATA`: 儲存格值、合併儲存格與格式。
                  - `FORMULAS`: 公式運算式及其計算結果。
                  - `VISUAL`: 工作表的轉譯影像。


        ??? note "**audioMetadata**: `AudioMetadata` 選填。音訊中繼資料。中繼資料只應在音訊資料以 inline_data 或 file_data 呈現時指定。"


              **startOffset**: `string`

              選填。音訊的起始偏移。

              **endOffset**: `string`

              選填。音訊的結束偏移，相對於音訊串流的開頭。



      **thought**: `boolean`

      選填。表示該部分是否為模型的思考內容。

      **thoughtSignature**: `string`

      選填。思考內容的不透明簽章，可在後續要求中重複使用。

      **partMetadata**: `object`

      與該 Part 相關的自訂中繼資料。使用 genai.Part 作為內容表示的代理，可能需要追蹤額外資訊。例如，它可以是 Part 來源檔案/來源的名稱，或是多工處理多個 Part 串流的方式。



    ??? note "**mediaResolution**: `V1mainMediaResolution` 選填。輸入媒體的媒體解析度。"

        ??? note "**value**: `Union type` 媒體解析度等級。"

              聯集欄位 `value` 只能是下列其中之一：



            ??? note "**level**: `string enum` 用於給定媒體的權杖化品質。適用於 Gemini API 支援。"

                可能的值：

                - `MEDIA_RESOLUTION_UNSPECIFIED`: 尚未設定媒體解析度。
                - `MEDIA_RESOLUTION_LOW`: 媒體解析度設為低。
                - `MEDIA_RESOLUTION_MEDIUM`: 媒體解析度設為中。
                - `MEDIA_RESOLUTION_HIGH`: 媒體解析度設為高。
                - `MEDIA_RESOLUTION_ULTRA_HIGH`: 媒體解析度設為超高。





    ??? note "**mediaProcessing**: `string enum` 選填。模型如何處理此部分的媒體以利理解。僅對影片部分有意義（`inline_data` 或 MIME 類型為影片的 `file_data`）。非影片部分會忽略此欄位。"

        可能的值：

        - `MEDIA_PROCESSING_UNSPECIFIED`: 預設為模型專屬的處理方式。
        - `STATIC`: 固定速率影格擷取。所有影格都放入上下文。
        - `AGENTIC`: 由模型驅動的動態導覽。建議用於大多數使用情境。





    ??? note "**audioTranscription**: `AudioTranscription` 選填。音訊（輸入或輸出）轉錄。僅在此 Part 包含音訊資料時才會設定。"

          **text**: required `string`

          此音訊區段的轉錄文字。

          **speakerLabel**: `string`

          選填。識別此音訊區段說話者的標籤（例如「spk_1」、「spk_2」）。在設定語者分離時出現。



        ??? note "**words**: `WordInfo array` 選填。詳細的逐字轉錄與時間資訊。在設定 word_timestamp 時出現。"

            **word**: required `string`

            該單字的轉錄。

            **startOffset**: `string`

            選填。單字相對於音訊開頭的起始時間偏移。

            **endOffset**: `string`

            選填。單字相對於音訊開頭的結束時間偏移。





    ??? note "**speechMetadata**: `SpeechMetadata` 選填。套用到文字部分的中繼資料，用於自訂文字的朗讀或合成方式，例如指定說話者身分或說話風格。"

        **speaker**: `string`

        選填。多說話者合成的選填說話者名稱。

        **style**: `string`

        選填。語音合成的選填風格指令。



  

---


  **role**: `string`

  選填。內容的產生者。必須是「user」或「model」。在多回合對話中設定很有用，否則可留空或不設定。


### Environment {#Resource:Environment}

代理的執行環境。

**屬性**：


  **id**: required `string`

  僅供輸出。環境的 ID。

  

---


  

??? note "**sources**: `Source array` 要掛載到環境中的來源。"

    ??? note "**type**: `string enum`"

        可能的值：

        - `TYPE_UNSPECIFIED`
        - `GCS`: Cloud Storage 值區。
        - `INLINE`: 行內內容。
        - `REPOSITORY`: 一般儲存庫。來源 URL 中的通訊協定前綴可識別提供者（例如 github://、gcs://）。



      **source**: `string`

      環境的來源。對於 Cloud Storage，這是 Cloud Storage 路徑。對於 GitHub，這是 GitHub 路徑。

      **target**: `string`

      來源應在環境中出現的位置。

      **content**: `string`

      當 `type` 為 `INLINE` 時的行內內容。

      **encoding**: `string`

      行內內容的選填編碼（例如 `base64`）。



  

---


  **created**: `string`

  僅供輸出。環境建立的時間，採 ISO 8601 格式（YYYY-MM-DDThh:mm:ssZ）。

  

---


  **updated**: `string`

  僅供輸出。環境最後更新的時間，採 ISO 8601 格式（YYYY-MM-DDThh:mm:ssZ）。

  

---


  **lastAccessed**: `string`

  僅供輸出。環境最後存取的時間，採 ISO 8601 格式（YYYY-MM-DDThh:mm:ssZ）。

  

---


  

??? note "**status**: `string enum` 僅供輸出。環境容器的狀態。"

    可能的值：

    - `STATUS_UNSPECIFIED`: 僅供輸出。環境容器的狀態。
    - `ACTIVE`: 僅供輸出。環境容器的狀態。
    - `EXPIRED`: 僅供輸出。環境容器的狀態。



  

---


  

??? note "**network**: `Union type` 環境的網路設定。"

      聯集欄位 `network` 只能是下列其中之一：



    ??? note "**networkAllowlist**: `EnvironmentNetworkEgressAllowlist` 只允許特定網域。"

        ??? note "**allowlist**: `EgressRule array` 允許的網域及其設定清單。設為 `"disabled"` 可封鎖所有網路輸出流量。"

              **domain**: `string`

              允許向外發出要求的網域。支援萬用字元（例如「*.googleapis.com」）。使用「*」可允許所有網域。

              **transform**: `object`

              要注入符合此規則之要求的標頭。鍵：標頭名稱（例如「Authorization」）。值：標頭值（例如「Bearer your-token」）。

              **credential**: `string`

              選填。以 ID 參照伺服器代管的 Credential 資源。



            ??? note "**mode**: `string enum` 網路輸出模式。透過 `"allowlist": "disabled"` 簡寫形式設定；必須是允許清單中的唯一規則，且不能與 `domain`、`transform` 或 `credential` 併用。"

                可能的值：

                - `NETWORK_MODE_UNSPECIFIED`: 預設值。未使用。
                - `DISABLED`: 所有網路輸出流量都遭到封鎖。





    ??? note "**networkMode**: `string enum` 網路輸出模式。"

        可能的值：

        - `NETWORK_MODE_UNSPECIFIED`: 預設值。未使用。
        - `DISABLED`: 所有網路輸出流量都遭到封鎖。



  

---


  **fileCount**: `string`

  僅供輸出。環境中的檔案數量，僅供輸出。

  

---


  **sizeBytes**: `string`

  僅供輸出。環境檔案的總大小（以位元組計），僅供輸出。

  

---


  

??? note "**mode**: `string enum` 僅供輸出。此環境的運算生命週期模式。"

    可能的值：

    - `ENVIRONMENT_MODE_UNSPECIFIED`: 僅供輸出。此環境的運算生命週期模式。
    - `ON_DEMAND`: 僅供輸出。此環境的運算生命週期模式。
    - `SELF_HOSTED`: 僅供輸出。此環境的運算生命週期模式。



  

---


  **customConfig**: `object`

  僅供輸出。由客戶任意定義、透傳給自我託管環境輪詢器的 JSON 設定。僅在設定過的 `self_hosted` 環境中才會填入。

  

---


  **environmentKey**: `string`

  僅供輸出。在建立 self_hosted 環境時產生的秘密權杖。由自我託管沙箱守護行程用來驗證輪詢與串流要求。僅在 CreateEnvironment 回應中回傳；後續的 GetEnvironment 與 ListEnvironments 呼叫會省略。


### Schema {#Resource:Schema}

[`Schema`](/api-reference/generate-content/#Resource:Schema) 物件允許定義輸入與輸出資料類型。
這些類型可以是物件，也可以是基本型別與陣列。
代表 [OpenAPI 3.0 schema
object](https://spec.openapis.org/oas/v3.0.3#schema) 的選定子集。

**屬性**：


  

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



  

---


  **format**: `string`

  選填。資料的格式。允許任何值，但大多數值不會觸發任何特殊功能。

  

---


  **title**: `string`

  選填。schema 的標題。

  

---


  **description**: `string`

  選填。參數的簡短說明。其中可包含使用範例。參數說明可使用 Markdown 格式。

  

---


  **nullable**: `boolean`

  選填。表示該值是否可為 null。

  

---


  **enum**: `string array`

  選填。Type.STRING 元素在 enum 格式下的可能值。例如，我們可以這樣定義 Enum Direction：{type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]}

  

---


  **items**: [`Schema`](/api-reference/generate-content/#Resource:Schema)

  選填。Type.ARRAY 元素的 schema。

  

---


  **maxItems**: `string`

  選填。Type.ARRAY 的元素數量上限。

  

---


  **minItems**: `string`

  選填。Type.ARRAY 的元素數量下限。

  

---


  **properties**: `object`

  選填。Type.OBJECT 的屬性。

  

---


  **required**: `string array`

  選填。Type.OBJECT 的必要屬性。

  

---


  **minProperties**: `string`

  選填。Type.OBJECT 的屬性數量下限。

  

---


  **maxProperties**: `string`

  選填。Type.OBJECT 的屬性數量上限。

  

---


  **minimum**: `number`

  選填。TYPE INTEGER 與 NUMBER 的 SCHEMA 欄位：Type.INTEGER 與 Type.NUMBER 的最小值

  

---


  **maximum**: `number`

  選填。Type.INTEGER 與 Type.NUMBER 的最大值

  

---


  **minLength**: `string`

  選填。TYPE STRING 的 SCHEMA 欄位：Type.STRING 的最小長度

  

---


  **maxLength**: `string`

  選填。Type.STRING 的最大長度

  

---


  **pattern**: `string`

  選填。Type.STRING 的樣式，用於將字串限制為正規表示式。

  

---


  **example**: `object`

  選填。物件的範例。僅在物件為根物件時才會填入。

  

---


  **anyOf**: [`Schema`](/api-reference/generate-content/#Resource:Schema) `array`

  選填。該值應通過清單中任一（一個或多個）子 schema 的驗證。

  

---


  **propertyOrdering**: `string array`

  選填。屬性的順序。不是 Open API 規格中的標準欄位。用於決定回應中屬性的順序。

  

---


  **default**: `object`

  選填。欄位的預設值。依 JSON Schema，此欄位是供文件產生器使用，不影響驗證。因此這裡將其納入並忽略，讓傳送帶有 `default` 欄位之 schema 的開發人員不會收到未知欄位錯誤。


### Tool {#Resource:Tool}

模型可用來產生回應的工具詳細資訊。

[`Tool`](/api-reference/generate-content/#Resource:Tool) 是一段程式碼，讓系統能與
外部系統互動，以執行模型知識與範圍之外的
動作或一組動作。

**屬性**：


  

??? note "**functionDeclarations**: `FunctionDeclaration array` 選填。提供給模型、可供函式呼叫使用的 `FunctionDeclarations` 清單。模型或系統不會執行該函式。相反地，定義好的函式可能會以帶有引數的 FunctionCall 形式回傳到用戶端執行。模型可決定呼叫這些函式的子集，方式是在回應中填入 FunctionCall。下一個對話回合可包含帶有 Content.role「function」的 FunctionResponse，作為下一個模型回合的產生上下文。"

      **name**: required `string`

      函式的名稱。必須為 a-z、A-Z、0-9，或包含底線、冒號、句點與破折號，長度上限為 128。

      **description**: required `string`

      函式的簡短說明。

      **parameters**: [`Schema`](/api-reference/generate-content/#Resource:Schema)

      選填。說明此函式的參數。反映 Open API 3.03 Parameter Object：字串 Key：參數的名稱。參數名稱區分大小寫。Schema Value：定義該參數所用類型的 Schema。

      **parametersJsonSchema**: `object`

      選填。以 JSON Schema 格式說明函式的參數。該 schema 必須描述一個物件，其屬性即為函式的參數。例如：`{ "type": "object", "properties": { "name": { "type": "string" }, "age": { "type": "integer" } }, "additionalProperties": false, "required": ["name", "age"], "propertyOrdering": ["name", "age"] }` 此欄位與 `parameters` 互斥。

      **response**: [`Schema`](/api-reference/generate-content/#Resource:Schema)

      選填。以 JSON Schema 格式說明此函式的輸出。反映 Open API 3.03 Response Object。Schema 定義函式回應值所用的類型。

      **responseJsonSchema**: `object`

      選填。以 JSON Schema 格式說明函式的輸出。schema 指定的值即為函式的回應值。此欄位與 `response` 互斥。



    ??? note "**behavior**: `string enum` 選填。指定函式的 Behavior。目前僅 BidiGenerateContent 方法支援。"

        可能的值：

        - `UNSPECIFIED`: 此值未使用。
        - `BLOCKING`: 若有設定，系統會等待收到函式回應後才繼續對話。
        - `NON_BLOCKING`: 若有設定，系統不會等待收到函式回應。相反地，它會在維持使用者與模型對話的同時，嘗試在函式回應可用時加以處理。



  

---


  

??? note "**googleSearchRetrieval**: `GoogleSearchRetrieval` 選填。由 Google 搜尋提供支援的擷取工具。"

    ??? note "**dynamicRetrievalConfig**: `DynamicRetrievalConfig` 指定給定來源的動態擷取設定。"

        ??? note "**mode**: `string enum` 動態擷取中要使用的預測器模式。"

            可能的值：

            - `MODE_UNSPECIFIED`: 一律觸發擷取。
            - `MODE_DYNAMIC`: 僅在系統判定有必要時才執行擷取。



          **dynamicThreshold**: `number`

          動態擷取中要使用的門檻。若未設定，則使用系統預設值。



  

---


  

??? note "**codeExecution**: `CodeExecution` 選填。讓模型能在產生過程中執行程式碼。"




  

---


  

??? note "**googleSearch**: `GoogleSearch` 選填。GoogleSearch 工具類型。支援模型中 Google 搜尋的工具。由 Google 提供支援。"

    ??? note "**timeRangeFilter**: `Interval` 選填。將搜尋結果篩選為特定時間範圍。若客戶設定了開始時間，就必須設定結束時間（反之亦然）。"

        **startTime**: `string`

        選填。區間的起始（含）。若有指定，符合此區間的 Timestamp 必須等於或晚於起始時間。

        **endTime**: `string`

        選填。區間的結束（不含）。若有指定，符合此區間的 Timestamp 必須早於結束時間。





    ??? note "**searchTypes**: `SearchTypes` 選填。要啟用的搜尋類型集合。若未設定，預設啟用網路搜尋。"

        ??? note "**webSearch**: `WebSearch` 選填。啟用網路搜尋。只回傳文字結果。"






        ??? note "**imageSearch**: `ImageSearch` 選填。啟用圖片搜尋。回傳圖片位元組。"



  

---


  

??? note "**computerUse**: `ComputerUse` 選填。支援模型直接與電腦互動的工具。若啟用，會自動填入電腦使用專屬的函式宣告。"

    ??? note "**environment**: required `string enum` 正在操作的環境。"

        可能的值：

        - `ENVIRONMENT_UNSPECIFIED`: 預設為瀏覽器。
        - `ENVIRONMENT_BROWSER`: 在網路瀏覽器中操作。
        - `ENVIRONMENT_MOBILE`: 在行動環境中操作。
        - `ENVIRONMENT_DESKTOP`: 在桌面環境中操作。



      **excludedPredefinedFunctions**: `string array`

      選填。依預設，預先定義的函式會納入最終的模型呼叫中。其中有些函式可明確排除、不自動納入。這有兩個用途：1. 使用更受限/不同的動作空間。2. 改進預先定義函式的定義/指令。

      **enablePromptInjectionDetection**: `boolean`

      選填。是否在電腦使用要求上啟用提示詞注入偵測檢查。



    ??? note "**disabledSafetyPolicies**: `string enum array` 選填。電腦使用已停用的安全政策。"

        可能的值：

        - `SAFETY_POLICY_UNSPECIFIED`: 未指定的安全政策。
        - `FINANCIAL_TRANSACTIONS`: 金融交易的安全政策。
        - `SENSITIVE_DATA_MODIFICATION`: 敏感資料修改的安全政策。
        - `COMMUNICATION_TOOL`: 通訊工具（例如 Gmail、Chat、Meet）的安全政策。
        - `ACCOUNT_CREATION`: 帳號建立的安全政策。
        - `DATA_MODIFICATION`: 資料修改的安全政策。
        - `USER_CONSENT_MANAGEMENT`: 使用者同意管理的安全政策。
        - `LEGAL_TERMS_AND_AGREEMENTS`: 法律條款與協議的安全政策。



  

---


  

??? note "**urlContext**: `UrlContext` 選填。支援 URL 上下文擷取的工具。"




  

---


  

??? note "**fileSearch**: `FileSearch` 選填。FileSearch 工具類型。從 Semantic Retrieval 語料庫擷取知識的工具。"

    **fileSearchStoreNames**: required `string array`

    要擷取的 file_search_stores 名稱。範例：`fileSearchStores/my-file-search-store-123`

    **topK**: `integer`

    選填。要擷取的語意擷取區塊數量。

    **metadataFilter**: `string`

    選填。要套用到語意擷取文件與區塊的中繼資料篩選條件。



  

---


  

??? note "**mcpServers**: `McpServer array` 選填。要連線的 MCP 伺服器。"

    ??? note "**transport**: `Union type` 用來連線到 MCPServer 的傳輸方式。"

          聯集欄位 `transport` 只能是下列其中之一：



        ??? note "**streamableHttpTransport**: `StreamableHttpTransport` 可串流 HTTP 要求與回應的傳輸方式。"

            **url**: `string`

            MCPServer 端點的完整 URL。範例：「https://api.example.com/mcp」

            **headers**: `object`

            選填：驗證標頭、逾時等欄位（如需要）。

            **timeout**: `string`

            一般操作的 HTTP 逾時。

            **sseReadTimeout**: `string`

            SSE 讀取操作的逾時。

            **terminateOnClose**: `boolean`

            傳輸關閉時是否關閉用戶端工作階段。



      **name**: `string`

      MCPServer 的名稱。



  

---


  

??? note "**googleMaps**: `GoogleMaps` 選填。讓模型的回應能以與使用者查詢相關的地理空間上下文接地的工具。"

    **enableWidget**: `boolean`

    選填。是否在回應的 GroundingMetadata 中回傳小工具上下文權杖。開發人員可使用小工具上下文權杖，算繪一個帶有地理空間上下文的 Google Maps 小工具，內容與模型在回應中提及的地點相關。



### AuthToken {#Resource:AuthToken}

建立臨時驗證權杖的要求。

**屬性**：


  

??? note "**config**: `Union type` 產生之權杖的方法專屬設定。"

      聯集欄位 `config` 只能是下列其中之一：



    ??? note "**bidiGenerateContentSetup**: `BidiGenerateContentSetup` 選填。僅供輸入。不可變。`BidiGenerateContent` 專屬的設定。"

          **model**: required `string`

          模型的資源名稱。作為模型要使用的 ID。格式：`models/{model}`



        ??? note "**generationConfig**: `GenerationConfig` 選填。產生設定。不支援下列欄位：- `response_logprobs` - `response_mime_type` - `logprobs` - `response_schema` - `response_json_schema` - `stop_sequence` - `skip_response_cache` - `routing_config` - `audio_timestamp`"

              **candidateCount**: `integer`

              選填。要回傳的產生回應數量。若未設定，預設為 1。請注意，這對上一代模型（Gemini 1.0 系列）無效

              **stopSequences**: `string array`

              選填。會停止輸出產生的字元序列集合（最多 5 個）。若有指定，API 會在 `stop_sequence` 首次出現時停止。停止序列不會包含在回應中。

              **maxOutputTokens**: `integer`

              選填。回應候選中要包含的權杖數量上限。注意：預設值因模型而異，請參閱 `Model.output_token_limit` 屬性，其所屬的 `Model` 由 `getModel` 函式回傳。

              **temperature**: `number`

              選填。控制輸出的隨機性。注意：預設值因模型而異，請參閱 `Model.temperature` 屬性，其所屬的 `Model` 由 `getModel` 函式回傳。值可介於 [0.0, 2.0]。此欄位在 Gemini 3.6 Flash 與更新的模型上已不再支援，會被無聲忽略。

              **topP**: `number`

              選填。取樣時要考慮的權杖最大累積機率。模型使用 Top-k 與 Top-p（核）取樣相結合的方式。權杖依其指派的機率排序，因此只考慮最有可能的權杖。Top-k 取樣直接限制要考慮的權杖數量上限，而核取樣則依累積機率限制權杖數量。注意：預設值因 `Model` 而異，由 `Model.top_p` 屬性指定，該屬性由 `getModel` 函式回傳。空的 `top_k` 屬性表示模型不套用 top-k 取樣，也不允許在要求上設定 `top_k`。此欄位在 Gemini 3.6 Flash 與更新的模型上已不再支援，會被無聲忽略。

              **topK**: `integer`

              選填。取樣時要考慮的權杖數量上限。Gemini 模型使用 Top-p（核）取樣，或 Top-k 與核取樣相結合的方式。Top-k 取樣考慮最有可能的前 `top_k` 個權杖集合。以核取樣執行的模型不允許設定 top_k。注意：預設值因 `Model` 而異，由 `Model.top_p` 屬性指定，該屬性由 `getModel` 函式回傳。空的 `top_k` 屬性表示模型不套用 top-k 取樣，也不允許在要求上設定 `top_k`。此欄位在 Gemini 3.6 Flash 與更新的模型上已不再支援，會被無聲忽略。

              **seed**: `integer`

              選填。解碼時使用的種子。若未設定，要求會使用隨機產生的種子。

              **responseMimeType**: `string`

              選填。產生的候選文字 MIME 類型。支援的 MIME 類型為：`text/plain`：（預設）文字輸出。`application/json`：回應候選中的 JSON 回應。`text/x.enum`：回應候選中以字串形式呈現的 ENUM 回應。如需所有支援的文字 MIME 類型清單，請參閱[文件](/docs/file-input-methods/#text-file-types)。

              **responseJsonSchema**: `object`

              選填。內部細節。請使用 `responseJsonSchema`，不要使用此欄位。

              **presencePenalty**: `number`

              選填。若權杖已在回應中出現過，套用到下一個權杖對數機率的存在懲罰。此懲罰是二元的開/關，不取決於權杖被使用的次數（首次之後）。若要使用隨每次使用而增加的懲罰，請使用 frequency_penalty。正懲罰會抑制使用已在回應中用過的權杖，增加詞彙量。負懲罰則會鼓勵使用已在回應中用過的權杖，減少詞彙量。

              **frequencyPenalty**: `number`

              選填。套用到下一個權杖對數機率的頻率懲罰，乘以每個權杖到目前為止在回應中出現的次數。正懲罰會抑制使用已用過的權杖，抑制程度與權杖被使用的次數成正比：權杖用得越多，模型就越難再次使用該權杖，從而增加回應的詞彙量。注意：*負*懲罰會鼓勵模型重複使用權杖，程度與權杖被使用的次數成正比。小的負值會減少回應的詞彙量。較大的負值會使模型開始重複一個常見權杖，直到達到 max_output_tokens 上限為止。

              **responseLogprobs**: `boolean`

              選填。若為 true，在回應中匯出 logprobs 結果。

              **logprobs**: `integer`

              選填。僅在 response_logprobs=True 時有效。這會設定在每個解碼步驟中，要在 Candidate.logprobs_result 中回傳的頂尖 logprobs 數量（包含所選候選）。數字必須介於 [0, 20] 範圍。

              **enableEnhancedCivicAnswers**: `boolean`

              選填。啟用強化公民答案。並非所有模型都可用。



            ??? note "**responseModalities**: `string enum array` 選填。要求的回應模態。代表模型可回傳、且應在回應中預期出現的模態集合。這與回應的模態完全相符。一個模型可能有多種支援模態的組合。若要求的模態與任何支援的組合都不相符，將回傳錯誤。空清單等同於只要求文字。"

                可能的值：

                - `MODALITY_UNSPECIFIED`: 預設值。
                - `TEXT`: 表示模型應回傳文字。
                - `IMAGE`: 表示模型應回傳圖片。
                - `AUDIO`: 表示模型應回傳音訊。





            ??? note "**speechConfig**: `SpeechConfig` 選填。語音產生設定。"

                ??? note "**voiceConfig**: `VoiceConfig` 單一語音輸出情況下的設定。"

                    ??? note "**voiceConfig**: `Union type` 要使用的說話者設定。"

                          聯集欄位 `voiceConfig` 只能是下列其中之一：



                        ??? note "**prebuiltVoiceConfig**: `PrebuiltVoiceConfig` 要使用的預建語音設定。"

                            **voiceName**: `string`

                            選填。要使用的預設語音名稱。



                          **voice**: `string`

                          選填。用於合成的說話者識別碼。支援的格式：

                          - 預建語音的說話者名稱（例如 `Orus` 或 `Kore`）。
                          - 已儲存語音的語音 ID（例如 `voice_xxx`）。
                          - 語音複製金鑰（例如 `voicekey_xxx`）。





                ??? note "**multiSpeakerVoiceConfig**: `MultiSpeakerVoiceConfig` 選填。多說話者設定的設定。它與 voice_config 欄位互斥。"

                    ??? note "**speakerVoiceConfigs**: required `SpeakerVoiceConfig array` 所有已啟用的說話者語音。"

                          **speaker**: required `string`

                          要使用的說話者名稱。應與提示詞中的名稱相同。



                        ??? note "**voiceConfig**: required `VoiceConfig` 要使用的語音設定。"

                            ??? note "**voiceConfig**: `Union type` 要使用的說話者設定。"

                                  聯集欄位 `voiceConfig` 只能是下列其中之一：



                                ??? note "**prebuiltVoiceConfig**: `PrebuiltVoiceConfig` 要使用的預建語音設定。"

                                    **voiceName**: `string`

                                    選填。要使用的預設語音名稱。



                                  **voice**: `string`

                                  選填。用於合成的說話者識別碼。支援的格式：

                                  - 預建語音的說話者名稱（例如 `Orus` 或 `Kore`）。
                                  - 已儲存語音的語音 ID（例如 `voice_xxx`）。
                                  - 語音複製金鑰（例如 `voicekey_xxx`）。



                  **languageCode**: `string`

                  選填。使用者將應用程式設定為使用的 IETF [BCP-47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) 語言代碼。用於語音辨識與合成。有效值為：`de-DE`、`en-AU`、`en-GB`、`en-IN`、`en-US`、`es-US`、`fr-FR`、`hi-IN`、`pt-BR`、`ar-XA`、`es-ES`、`fr-CA`、`id-ID`、`it-IT`、`ja-JP`、`tr-TR`、`vi-VN`、`bn-IN`、`gu-IN`、`kn-IN`、`ml-IN`、`mr-IN`、`ta-IN`、`te-IN`、`nl-NL`、`ko-KR`、`cmn-CN`、`pl-PL`、`ru-RU` 與 `th-TH`。





            ??? note "**thinkingConfig**: `ThinkingConfig` 選填。思考功能的設定。若針對不支援思考的模型設定此欄位，將回傳錯誤。"

                  **includeThoughts**: `boolean`

                  表示是否在回應中包含思考內容。若為 true，僅在有思考內容可用時才回傳。

                  **thinkingBudget**: `integer`

                  模型應產生的思考權杖數量。



                ??? note "**thinkingLevel**: `string enum` 選填。控制模型在產生回應之前，內部推理過程的最大深度。預設值取決於模型。詳情請參閱[思考等級指南](/docs/thinking/#thinking-levels)。建議用於 Gemini 3 或更新的模型。在較早的模型上使用會導致錯誤。"

                    可能的值：

                    - `THINKING_LEVEL_UNSPECIFIED`: 預設值。
                    - `MINIMAL`: 幾乎不思考。
                    - `LOW`: 低思考等級。
                    - `MEDIUM`: 中思考等級。
                    - `HIGH`: 高思考等級。
                    - `XHIGH`: 超高思考等級。





            ??? note "**imageConfig**: `ImageConfig` 選填。圖片產生的設定。若針對不支援這些設定選項的模型設定此欄位，將回傳錯誤。"

                **aspectRatio**: `string`

                選填。要產生的圖片長寬比。支援的長寬比：`1:1`、`1:4`、`4:1`、`1:8`、`8:1`、`2:3`、`3:2`、`3:4`、`4:3`、`4:5`、`5:4`、`9:16`、`16:9` 或 `21:9`。若未指定，模型會根據提供的任何參考圖片選擇預設長寬比。

                **imageSize**: `string`

                選填。指定產生圖片的大小。支援的值為 `512`、`1K`、`2K`、`4K`。若未指定，模型會使用預設值 `1K`。





            ??? note "**mediaResolution**: `string enum` 選填。若有指定，將使用指定的媒體解析度。"

                可能的值：

                - `MEDIA_RESOLUTION_UNSPECIFIED`: 尚未設定媒體解析度。
                - `MEDIA_RESOLUTION_LOW`: 媒體解析度設為低（64 個權杖）。
                - `MEDIA_RESOLUTION_MEDIUM`: 媒體解析度設為中（256 個權杖）。
                - `MEDIA_RESOLUTION_HIGH`: 媒體解析度設為高（以 256 個權杖縮放重新取景）。



              **enableAffectiveDialog**: `boolean`

              選填。若啟用，模型會偵測情緒並相應調整其回應。



            ??? note "**responseFormat**: `ResponseFormatConfig` 選填。回應輸出格式的設定。允許以扁平結構指定各模態（文字、音訊、圖片）的輸出設定。"

                ??? note "**text**: `TextResponseFormat` 選填。文字輸出格式設定。"

                    ??? note "**mimeType**: `string enum` 選填。文字輸出的 MIME 類型。"

                        可能的值：

                        - `MIME_TYPE_UNSPECIFIED`: 預設值。此值未使用。
                        - `APPLICATION_JSON`: JSON 輸出格式。
                        - `TEXT_PLAIN`: 純文字輸出格式。



                      **schema**: `object`

                      選填。輸出應符合的 JSON schema。僅在 mime_type 為 APPLICATION_JSON 時適用。





                ??? note "**audio**: `AudioResponseFormat` 選填。音訊輸出格式設定。"

                    ??? note "**mimeType**: `string enum` 選填。音訊輸出的 MIME 類型。"

                        可能的值：

                        - `MIME_TYPE_UNSPECIFIED`: 預設值。此值未使用。
                        - `AUDIO_MP3`: MP3 音訊格式。
                        - `AUDIO_OGG_OPUS`: OGG Opus 音訊格式。
                        - `AUDIO_L16`: 原始 PCM（L16）音訊格式。
                        - `AUDIO_WAV`: WAV 音訊格式。
                        - `AUDIO_ALAW`: A-law 音訊格式。
                        - `AUDIO_MULAW`: Mu-law 音訊格式。





                    ??? note "**delivery**: `string enum` 選填。音訊輸出的傳遞模式。"

                        可能的值：

                        - `DELIVERY_UNSPECIFIED`: 預設值。此值未使用。
                        - `INLINE`: 音訊資料以行內方式在回應中回傳。
                        - `URI`: 音訊資料以 URI 形式回傳。



                      **sampleRate**: `integer`

                      選填。取樣率，單位為 Hz。

                      **bitRate**: `integer`

                      選填。位元率，單位為每秒位元數（bps）。僅適用於壓縮格式（MP3、Opus）。





                ??? note "**image**: `ImageResponseFormat` 選填。圖片輸出格式設定。"

                    ??? note "**mimeType**: `string enum` 選填。圖片輸出的 MIME 類型。"

                        可能的值：

                        - `MIME_TYPE_UNSPECIFIED`: 預設值。此值未使用。
                        - `IMAGE_JPEG`: JPEG 圖片格式。





                    ??? note "**delivery**: `string enum` 選填。圖片輸出的傳遞模式。"

                        可能的值：

                        - `DELIVERY_UNSPECIFIED`: 預設值。此值未使用。
                        - `INLINE`: 圖片資料以行內方式在回應中回傳。
                        - `URI`: 圖片資料以 URI 形式回傳。





                    ??? note "**aspectRatio**: `string enum` 選填。圖片輸出的長寬比。"

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





                    ??? note "**imageSize**: `string enum` 選填。圖片輸出的大小。"

                        可能的值：

                        - `IMAGE_SIZE_UNSPECIFIED`: 預設值。此值未使用。
                        - `IMAGE_SIZE_FIVE_TWELVE`: 512px 圖片大小。
                        - `IMAGE_SIZE_ONE_K`: 1K 圖片大小。
                        - `IMAGE_SIZE_TWO_K`: 2K 圖片大小。
                        - `IMAGE_SIZE_FOUR_K`: 4K 圖片大小。





            ??? note "**translationConfig**: `TranslationConfig` 選填。翻譯設定。"

                **targetLanguageCode**: required `string`

                翻譯的目標語言。支援的值為 BCP-47 語言代碼（例如「en」、「es」、「fr」）。

                **echoTargetLanguage**: `boolean`

                選填。若為 true，當目標語言被說出時，模型會產生音訊，本質上是鸚鵡學舌般重複輸入。若為 false，我們不會為目標語言產生音訊。





            ??? note "**audioTranscriptionConfig**: `AudioTranscriptionConfig` 選填。音訊轉錄（語音辨識）設定。"

                  **languageCodes**: `string array`

                  選填。提供音訊中出現之語言提示的 BCP-47 語言代碼。若省略或為空，預設為自動語言偵測。

                  **customVocabulary**: `string array`

                  選填。自訂詞彙片語清單，用於引導語音辨識模型偏向辨識特定詞彙（產品名稱、專有名詞、行話）。

                  **wordTimestamp**: `boolean`

                  選填。設定逐字時間戳記的產生。

                  **diarization**: `boolean`

                  選填。設定語者分離。

                  **sourceText**: `string`

                  選填。要透過語音指令編輯或改寫的來源文字。在 `SMART` 模式下提供時，模型會以音訊輸入對照此文字進行評估，並在候選回應中輸出完整的替代文字，而不是附加在其後。



                ??? note "**mode**: `string enum` 選填。設定轉錄模式。支援的值：`VERBATIM`、`SMART`。若未指定，預設為 `VERBATIM` 轉錄。在 `SMART` 模式下，模型會進行不流暢內容移除（消除填充詞、重複與錯誤開頭）、輕度文法清理、自動格式化（段落、項目符號、編號清單），以及輕微的使用者編輯（行內自我修正）。時間戳記與語者分離與 `SMART` 模式不相容。"

                    可能的值：

                    - `MODE_UNSPECIFIED`: 未指定的轉錄模式。
                    - `VERBATIM`: 逐字轉錄模式。
                    - `SMART`: 智慧轉錄模式。



          **systemInstruction**: [`Content`](/api-reference/generate-content/#Resource:Content)

          選填。使用者提供給模型的系統指令。注意：parts 中只應使用文字，且每個部分的內容會各自成為獨立段落。

          **tools**: [`Tool`](/api-reference/generate-content/#Resource:Tool) `array`

          選填。模型可用來產生下一個回應的 `Tools` 清單。[`Tool`](/api-reference/generate-content/#Resource:Tool) 是一段程式碼，讓系統能與外部系統互動，以執行模型知識與範圍之外的動作或一組動作。



        ??? note "**realtimeInputConfig**: `RealtimeInputConfig` 選填。設定即時輸入的處理方式。"

            ??? note "**automaticActivityDetection**: `AutomaticActivityDetection` 選填。若未設定，自動活動偵測預設為啟用。若停用自動語音偵測，用戶端必須傳送活動訊號。"

                  **disabled**: `boolean`

                  選填。若啟用（預設），偵測到的語音與文字輸入會計為活動。若停用，用戶端必須傳送活動訊號。



                ??? note "**startOfSpeechSensitivity**: `string enum` 選填。決定偵測到語音的可能性。"

                    可能的值：

                    - `START_SENSITIVITY_UNSPECIFIED`: 預設為 START_SENSITIVITY_HIGH。
                    - `START_SENSITIVITY_HIGH`: 自動偵測會更常偵測到語音開始。
                    - `START_SENSITIVITY_LOW`: 自動偵測會較少偵測到語音開始。



                  **prefixPaddingMs**: `integer`

                  選填。在確認語音開始之前，需要偵測到語音的持續時間。此值越低，語音開始偵測越靈敏，能辨識的語音也越短。不過，這也會提高誤判的機率。



                ??? note "**endOfSpeechSensitivity**: `string enum` 選填。決定偵測到的語音結束的可能性。"

                    可能的值：

                    - `END_SENSITIVITY_UNSPECIFIED`: 預設為 END_SENSITIVITY_HIGH。
                    - `END_SENSITIVITY_HIGH`: 自動偵測會更常結束語音。
                    - `END_SENSITIVITY_LOW`: 自動偵測會較少結束語音。



                  **silenceDurationMs**: `integer`

                  選填。在確認語音結束之前，需要偵測到非語音（例如靜默）的持續時間。此值越大，使用者活動中可容忍的語音間隔越長，但會增加模型的延遲。





            ??? note "**activityHandling**: `ActivityHandling` 選填。定義活動產生的效果。"

                可能的值：

                - `ACTIVITY_HANDLING_UNSPECIFIED`: 若未指定，預設行為為 `START_OF_ACTIVITY_INTERRUPTS`。
                - `START_OF_ACTIVITY_INTERRUPTS`: 若為 true，活動開始會中斷模型的回應（也稱為「插話」）。模型的目前回應會在中斷當下被截斷。這是預設行為。
                - `NO_INTERRUPTION`: 模型的回應不會被中斷。





            ??? note "**turnCoverage**: `string enum` 選填。定義使用者回合中包含哪些輸入。"

                可能的值：

                - `TURN_COVERAGE_UNSPECIFIED`: 若未指定，會依模型選擇預設行為。例如，對於 Gemini 2.5，預設為 `TURN_INCLUDES_ONLY_ACTIVITY`；對於 Gemini 3.1 及之後版本，則是 `TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO`。
                - `TURN_INCLUDES_ONLY_ACTIVITY`: 包含自上一回合以來的活動，排除不活動（例如音訊串流上的靜默）。
                - `TURN_INCLUDES_ALL_INPUT`: 包含自上一回合以來的所有即時輸入，包括不活動（例如音訊串流上的靜默）。
                - `TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO`: 包含自上一回合以來的音訊活動與所有影片。在自動活動偵測下，音訊活動指的是語音，不含靜默。



              **interimTranscriptTimestampEnabled**: `boolean`

              選填。設定暫時轉錄時間戳記。





        ??? note "**sessionResumption**: `SessionResumptionConfig` 選填。設定工作階段恢復機制。若有包含，伺服器會傳送 `SessionResumptionUpdate` 訊息。"

            **handle**: `string`

            先前工作階段的控制代碼。若不存在，則會建立新的工作階段。工作階段控制代碼來自先前連線中的 `SessionResumptionUpdate.token` 值。





        ??? note "**contextWindowCompression**: `ContextWindowCompressionConfig` 選填。設定上下文視窗壓縮機制。若有包含，當上下文超過設定的長度時，伺服器會自動縮小其大小。"

            ??? note "**compressionMechanism**: `Union type` 使用的上下文視窗壓縮機制。"

                  聯集欄位 `compressionMechanism` 只能是下列其中之一：



                ??? note "**slidingWindow**: `SlidingWindow` 滑動視窗機制。"

                    **targetTokens**: `string`

                    要保留的目標權杖數量。預設值為 trigger_tokens/2。捨棄上下文視窗的部分內容會造成暫時的延遲增加，因此此值應加以校準，以避免頻繁的壓縮操作。



              **triggerTokens**: `string`

              觸發上下文視窗壓縮所需的權杖數量（在執行一個回合之前）。這可用於在品質與延遲之間取得平衡，因為較短的上下文視窗可能帶來更快的模型回應。不過，任何壓縮操作都會造成暫時的延遲增加，因此不應頻繁觸發。若未設定，預設為模型上下文視窗上限的 80%。這會留下 20% 給下一個使用者要求/模型回應。





        ??? note "**inputAudioTranscription**: `AudioTranscriptionConfig` 選填。若有設定，啟用語音輸入的轉錄。若有設定，轉錄會與輸入音訊語言對齊。"

              **languageCodes**: `string array`

              選填。提供音訊中出現之語言提示的 BCP-47 語言代碼。若省略或為空，預設為自動語言偵測。

              **customVocabulary**: `string array`

              選填。自訂詞彙片語清單，用於引導語音辨識模型偏向辨識特定詞彙（產品名稱、專有名詞、行話）。

              **wordTimestamp**: `boolean`

              選填。設定逐字時間戳記的產生。

              **diarization**: `boolean`

              選填。設定語者分離。

              **sourceText**: `string`

              選填。要透過語音指令編輯或改寫的來源文字。在 `SMART` 模式下提供時，模型會以音訊輸入對照此文字進行評估，並在候選回應中輸出完整的替代文字，而不是附加在其後。



            ??? note "**mode**: `string enum` 選填。設定轉錄模式。支援的值：`VERBATIM`、`SMART`。若未指定，預設為 `VERBATIM` 轉錄。在 `SMART` 模式下，模型會進行不流暢內容移除（消除填充詞、重複與錯誤開頭）、輕度文法清理、自動格式化（段落、項目符號、編號清單），以及輕微的使用者編輯（行內自我修正）。時間戳記與語者分離與 `SMART` 模式不相容。"

                可能的值：

                - `MODE_UNSPECIFIED`: 未指定的轉錄模式。
                - `VERBATIM`: 逐字轉錄模式。
                - `SMART`: 智慧轉錄模式。





        ??? note "**outputAudioTranscription**: `AudioTranscriptionConfig` 選填。若有設定，啟用模型音訊輸出的轉錄。若有設定，轉錄會與輸出音訊指定的語言代碼對齊。"

              **languageCodes**: `string array`

              選填。提供音訊中出現之語言提示的 BCP-47 語言代碼。若省略或為空，預設為自動語言偵測。

              **customVocabulary**: `string array`

              選填。自訂詞彙片語清單，用於引導語音辨識模型偏向辨識特定詞彙（產品名稱、專有名詞、行話）。

              **wordTimestamp**: `boolean`

              選填。設定逐字時間戳記的產生。

              **diarization**: `boolean`

              選填。設定語者分離。

              **sourceText**: `string`

              選填。要透過語音指令編輯或改寫的來源文字。在 `SMART` 模式下提供時，模型會以音訊輸入對照此文字進行評估，並在候選回應中輸出完整的替代文字，而不是附加在其後。



            ??? note "**mode**: `string enum` 選填。設定轉錄模式。支援的值：`VERBATIM`、`SMART`。若未指定，預設為 `VERBATIM` 轉錄。在 `SMART` 模式下，模型會進行不流暢內容移除（消除填充詞、重複與錯誤開頭）、輕度文法清理、自動格式化（段落、項目符號、編號清單），以及輕微的使用者編輯（行內自我修正）。時間戳記與語者分離與 `SMART` 模式不相容。"

                可能的值：

                - `MODE_UNSPECIFIED`: 未指定的轉錄模式。
                - `VERBATIM`: 逐字轉錄模式。
                - `SMART`: 智慧轉錄模式。





        ??? note "**proactivity**: `ProactivityConfig` 選填。設定模型的主動性。這讓模型能主動回應輸入，並忽略不相關的輸入。"

            **proactiveAudio**: `boolean`

            選填。若啟用，模型可拒絕回應上一個提示詞。例如，這讓模型能忽略離題的語音，或在使用者尚未提出要求時保持沉默。

            **proactiveVideo**: `boolean`

            選填。若啟用，系統可能會在每張收到的圖片上觸發一次產生。這需要啟用 `proactive_audio`。產生的速率取決於傳入圖片的速率，可能造成成本大幅增加。





        ??? note "**historyConfig**: `HistoryConfig` 選填。設定用戶端與伺服器之間的歷史交換。"

            **initialHistoryInClientContent**: `boolean`

            選填。若為 true，在傳送 `setup_complete` 之後，伺服器會等待並先處理 `client_content` 訊息，直到 `turn_complete` 為 `true` 為止。這段初始歷史不會觸發模型呼叫，且可能以角色 `MODEL` 結束。在 `turn_complete` 為 `true` 之後，用戶端可透過 `realtime_input` 開始即時對話。



          **labels**: `object`

          選填。帶有使用者定義中繼資料的要求標籤。選填。標籤必須遵循標準的統一 Cloud 標籤要求：

          - 標籤鍵必須以字母開頭。
          - 標籤鍵與值的長度不得超過 63 個字元（Unicode 碼點），且只能包含小寫字母、數字字元、底線與破折號。
          - 允許國際字元。

          用途：

          - 來自彙總者的安全識別碼：使用鍵 `safety_identifier`（例如 `{"safety_identifier": "user_session_123"}`）



  

---


  **name**: `string`

  僅供輸出。識別碼。權杖本身。

  

---


  **expireTime**: `string`

  選填。僅供輸入。不可變。使用產生的權杖時，BidiGenerateContent 工作階段中的訊息在這個選填時間之後會遭到拒絕。（Gemini 可能會在此時間之後先行關閉工作階段。）若未設定，預設為未來 30 分鐘。若有設定，此值必須小於未來 20 小時。

  

---


  **newSessionExpireTime**: `string`

  選填。僅供輸入。不可變。使用本要求產生的權杖的新 Live API 工作階段，在這個時間之後會遭到拒絕。若未設定，預設為未來 60 秒。若有設定，此值必須小於未來 20 小時。

  

---


  **uses**: `integer`

  選填。僅供輸入。不可變。權杖可使用的次數。若此值為零，則不套用上限。恢復 Live API 工作階段不計為一次使用。若未指定，預設為 1。

  

---


  **fieldMask**: `string`

  選填。僅供輸入。不可變。若 field_mask 為空，且不存在 `bidi_generate_content_setup`，則有效的 `BidiGenerateContentSetup` 訊息取自 Live API 連線。若 field_mask 為空，且*存在* `bidi_generate_content_setup`，則有效的 `BidiGenerateContentSetup` 訊息完全取自本要求中的 `bidi_generate_content_setup`。Live API 連線的設定訊息會被忽略。若 field_mask 不為空，則 `bidi_generate_content_setup` 中的對應欄位會覆寫 Live API 連線設定訊息中的欄位。
