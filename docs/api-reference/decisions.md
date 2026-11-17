# Gemini Decisions API


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/` 之下。


Decisions API 會在單一請求中，針對一份共用輸入評估一批結構化的決策問題。每個問題屬於三種類型之一：二元（true / false）的 `noul` 問題、在互斥選項中單選的 `choice` 問題，或是依離散等級評分標準量化的 `score` 問題。回應會以請求中的問題 ID 為鍵，為每個問題提供經過校準的答案，其中包含信心分數；對於 `choice` 與 `score` 問題，還會提供每個選項或等級的機率。

## 方法 {#methods}


| 方法 | HTTP 請求 |
| --- | --- |
| [建立決策](/api-reference/decisions/create-decision/) | `POST` `/v1beta/decisions` 針對一份共用輸入，評估一批結構化的決策問題。 |


## 資料模型 {#data-models}

### CreateDecisionResponse {#Resource:CreateDecisionResponse}

評估一批決策問題後得到的回應。

**屬性**：


  **answers**: `object`

  僅供輸出。決策答案，以 `questions` 中的問題識別碼作為對應鍵。

  

---


  

??? note "**usage**: `Usage` 僅供輸出。此決策評估請求的權杖用量統計。"

      **total_input_tokens**: `integer`

      提示詞（上下文）中的權杖數量。

      **initial_input_tokens**: `integer`

      此互動第一個回合所使用的輸入權杖數量。



    ??? note "**input_tokens_by_modality**: `ModalityTokens array` 依模態區分的輸入權杖用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量對應的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_cached_tokens**: `integer`

      提示詞中已快取部分（快取內容）的權杖數量。



    ??? note "**cached_tokens_by_modality**: `ModalityTokens array` 依模態區分的快取權杖用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量對應的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_output_tokens**: `integer`

      所有生成回應的權杖總數。



    ??? note "**output_tokens_by_modality**: `ModalityTokens array` 依模態區分的輸出權杖用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量對應的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_tool_use_tokens**: `integer`

      工具使用提示詞中的權杖數量。



    ??? note "**tool_use_tokens_by_modality**: `ModalityTokens array` 依模態區分的工具使用權杖用量明細。"

        ??? note "**modality**: `ResponseModality` 與權杖數量對應的模態。"

            可能的值：

            - `text`：表示模型應傳回文字。
            - `image`：表示模型應傳回圖片。
            - `audio`：表示模型應傳回音訊。
            - `video`：表示模型應傳回影片。
            - `document`：表示模型應傳回文件。



          **tokens**: `integer`

          該模態的權杖數量。



      **total_thought_tokens**: `integer`

      思考模型的思考權杖數量。

      **total_tokens**: `integer`

      互動請求的權杖總數（提示詞 + 回應 + 其他內部權杖）。



    ??? note "**grounding_tool_count**: `GroundingToolCount array` 接地工具計數。"

        ??? note "**type**: `string enum` 與計數對應的接地工具類型。"

            可能的值：

            - `google_search`：使用 Google 網頁搜尋與圖片搜尋接地，以及 Web Grounding for Enterprise。
            - `google_maps`：使用 Google 地圖接地。



          **count**: `integer`

          接地工具的計數數量。



  

---


  **prompt_feedback**: [`PromptFeedback`](/api-reference/decisions/#Resource:PromptFeedback)

  僅供輸出。來自輸入內容篩選器的回饋。若設定了 `prompt_feedback.block_reason`，表示提示詞（`input` 與問題文字）已被輸入政策封鎖，不會評估任何決策，且 `answers` 為空。


### Question {#Resource:Question}

單一決策問題。

**多型類型**：


??? note "**[ChoiceQuestion](/api-reference/decisions/#Resource:ChoiceQuestion)**"

      在互斥選項中單選的分類決策
      問題。


      **criteria**: required `object`

      可供選擇的互斥選項（2 到 255 個選項），將選項 ID 對應至選填的說明或評分標準。選項 ID 不得為空，且不得包含控制字元或開頭／結尾空白。



    ---




    ??? note "**instructions**: required `DecisionInstructionContent` or `DecisionInstructionContent array` or `string` 供人閱讀的決策指引、評分標準或條件，會針對共用的 `input` 進行評估。至少需要一個內容區塊。"

          **可能的類型**： 



        ??? note "**DecisionInstructionContent**"

              文字內容區塊。

              **text**: required `string`

              文字內容。

              **type**: required `object`

              值：`text`



            ??? note "**annotations**: `Annotation array` 模型生成內容的引用資訊。"

                  **可能的類型**： 



                ??? note "**FileCitation**"

                    檔案引用註記。

                    **type**: required `object`

                    值：`file_citation`

                    **document_uri**: `string`

                    檔案的 URI。

                    **file_name**: `string`

                    檔案名稱。

                    **source**: `string`

                    這段文字所歸屬的來源。

                    **custom_metadata**: `object`

                    使用者提供的擷取上下文相關中繼資料。

                    **page_number**: `integer`

                    所引用文件的頁碼（如適用）。

                    **media_id**: `string`

                    圖片引用時的媒體 ID（如適用）。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**PlaceCitation**"

                      地點引用註記。

                      **type**: required `object`

                      值：`place_citation`

                      **place_id**: `string`

                      地點的 ID，格式為 `places/{place_id}`。

                      **name**: `string`

                      地點的標題。

                      **url**: `string`

                      地點的 URI 參照。



                    ??? note "**review_snippets**: `ReviewSnippet array` 用來生成 Google 地圖中特定地點特色相關回答的評論片段。"

                        **title**: `string`

                        評論的標題。

                        **url**: `string`

                        對應到 Google 地圖上使用者評論的連結。

                        **review_id**: `string`

                        評論片段的 ID。



                      **start_index**: `integer`

                      回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                      **end_index**: `integer`

                      所歸屬區段的終點（不含該位置）。





                ??? note "**SpeechAnnotation**"

                    文字內容的語音註記。

                    **type**: required `object`

                    值：`speech_metadata`

                    **speaker**: `string`

                    要與這個發言回合建立關聯的說話者。

                    **style**: `string`

                    語音合成的風格指令。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**UrlCitation**"

                    URL 引用註記。

                    **type**: required `object`

                    值：`url_citation`

                    **url**: `string`

                    URL。

                    **title**: `string`

                    URL 的標題。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**WordInfo**"

                    用於轉錄輸出的單字層級 ASR 註記。包含單字文字、選填的時間資訊，以及選填的說話者歸屬。

                    **type**: required `object`

                    值：`word_info`

                    **text**: `string`

                    轉錄出的單字。

                    **start_offset**: `string`

                    單字相對於音訊開頭的開始時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                    **end_offset**: `string`

                    單字相對於音訊開頭的結束時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                    **speaker**: `string`

                    選填。此單字的說話者標籤（例如 "spk_1"、"spk_2"）。在 TranscriptionConfig 中設定了 diarization_mode 時才會出現。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





        ??? note "**DecisionInstructionContent array**"

              文字內容區塊。

              **text**: required `string`

              文字內容。

              **type**: required `object`

              值：`text`



            ??? note "**annotations**: `Annotation array` 模型生成內容的引用資訊。"

                  **可能的類型**： 



                ??? note "**FileCitation**"

                    檔案引用註記。

                    **type**: required `object`

                    值：`file_citation`

                    **document_uri**: `string`

                    檔案的 URI。

                    **file_name**: `string`

                    檔案名稱。

                    **source**: `string`

                    這段文字所歸屬的來源。

                    **custom_metadata**: `object`

                    使用者提供的擷取上下文相關中繼資料。

                    **page_number**: `integer`

                    所引用文件的頁碼（如適用）。

                    **media_id**: `string`

                    圖片引用時的媒體 ID（如適用）。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**PlaceCitation**"

                      地點引用註記。

                      **type**: required `object`

                      值：`place_citation`

                      **place_id**: `string`

                      地點的 ID，格式為 `places/{place_id}`。

                      **name**: `string`

                      地點的標題。

                      **url**: `string`

                      地點的 URI 參照。



                    ??? note "**review_snippets**: `ReviewSnippet array` 用來生成 Google 地圖中特定地點特色相關回答的評論片段。"

                        **title**: `string`

                        評論的標題。

                        **url**: `string`

                        對應到 Google 地圖上使用者評論的連結。

                        **review_id**: `string`

                        評論片段的 ID。



                      **start_index**: `integer`

                      回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                      **end_index**: `integer`

                      所歸屬區段的終點（不含該位置）。





                ??? note "**SpeechAnnotation**"

                    文字內容的語音註記。

                    **type**: required `object`

                    值：`speech_metadata`

                    **speaker**: `string`

                    要與這個發言回合建立關聯的說話者。

                    **style**: `string`

                    語音合成的風格指令。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**UrlCitation**"

                    URL 引用註記。

                    **type**: required `object`

                    值：`url_citation`

                    **url**: `string`

                    URL。

                    **title**: `string`

                    URL 的標題。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**WordInfo**"

                    用於轉錄輸出的單字層級 ASR 註記。包含單字文字、選填的時間資訊，以及選填的說話者歸屬。

                    **type**: required `object`

                    值：`word_info`

                    **text**: `string`

                    轉錄出的單字。

                    **start_offset**: `string`

                    單字相對於音訊開頭的開始時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                    **end_offset**: `string`

                    單字相對於音訊開頭的結束時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                    **speaker**: `string`

                    選填。此單字的說話者標籤（例如 "spk_1"、"spk_2"）。在 TranscriptionConfig 中設定了 diarization_mode 時才會出現。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





        ??? note "**string**"

            直接的字串值。





    ---


      **type**: required `object`

      值：`choice`



??? note "**[NoulQuestion](/api-reference/decisions/#Resource:NoulQuestion)**"

      二元（true / false）決策問題。




    ??? note "**instructions**: required `DecisionInstructionContent` or `DecisionInstructionContent array` or `string` 供人閱讀的決策指引、評分標準或條件，會針對共用的 `input` 進行評估。至少需要一個內容區塊。"

          **可能的類型**： 



        ??? note "**DecisionInstructionContent**"

              文字內容區塊。

              **text**: required `string`

              文字內容。

              **type**: required `object`

              值：`text`



            ??? note "**annotations**: `Annotation array` 模型生成內容的引用資訊。"

                  **可能的類型**： 



                ??? note "**FileCitation**"

                    檔案引用註記。

                    **type**: required `object`

                    值：`file_citation`

                    **document_uri**: `string`

                    檔案的 URI。

                    **file_name**: `string`

                    檔案名稱。

                    **source**: `string`

                    這段文字所歸屬的來源。

                    **custom_metadata**: `object`

                    使用者提供的擷取上下文相關中繼資料。

                    **page_number**: `integer`

                    所引用文件的頁碼（如適用）。

                    **media_id**: `string`

                    圖片引用時的媒體 ID（如適用）。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**PlaceCitation**"

                      地點引用註記。

                      **type**: required `object`

                      值：`place_citation`

                      **place_id**: `string`

                      地點的 ID，格式為 `places/{place_id}`。

                      **name**: `string`

                      地點的標題。

                      **url**: `string`

                      地點的 URI 參照。



                    ??? note "**review_snippets**: `ReviewSnippet array` 用來生成 Google 地圖中特定地點特色相關回答的評論片段。"

                        **title**: `string`

                        評論的標題。

                        **url**: `string`

                        對應到 Google 地圖上使用者評論的連結。

                        **review_id**: `string`

                        評論片段的 ID。



                      **start_index**: `integer`

                      回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                      **end_index**: `integer`

                      所歸屬區段的終點（不含該位置）。





                ??? note "**SpeechAnnotation**"

                    文字內容的語音註記。

                    **type**: required `object`

                    值：`speech_metadata`

                    **speaker**: `string`

                    要與這個發言回合建立關聯的說話者。

                    **style**: `string`

                    語音合成的風格指令。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**UrlCitation**"

                    URL 引用註記。

                    **type**: required `object`

                    值：`url_citation`

                    **url**: `string`

                    URL。

                    **title**: `string`

                    URL 的標題。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**WordInfo**"

                    用於轉錄輸出的單字層級 ASR 註記。包含單字文字、選填的時間資訊，以及選填的說話者歸屬。

                    **type**: required `object`

                    值：`word_info`

                    **text**: `string`

                    轉錄出的單字。

                    **start_offset**: `string`

                    單字相對於音訊開頭的開始時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                    **end_offset**: `string`

                    單字相對於音訊開頭的結束時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                    **speaker**: `string`

                    選填。此單字的說話者標籤（例如 "spk_1"、"spk_2"）。在 TranscriptionConfig 中設定了 diarization_mode 時才會出現。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





        ??? note "**DecisionInstructionContent array**"

              文字內容區塊。

              **text**: required `string`

              文字內容。

              **type**: required `object`

              值：`text`



            ??? note "**annotations**: `Annotation array` 模型生成內容的引用資訊。"

                  **可能的類型**： 



                ??? note "**FileCitation**"

                    檔案引用註記。

                    **type**: required `object`

                    值：`file_citation`

                    **document_uri**: `string`

                    檔案的 URI。

                    **file_name**: `string`

                    檔案名稱。

                    **source**: `string`

                    這段文字所歸屬的來源。

                    **custom_metadata**: `object`

                    使用者提供的擷取上下文相關中繼資料。

                    **page_number**: `integer`

                    所引用文件的頁碼（如適用）。

                    **media_id**: `string`

                    圖片引用時的媒體 ID（如適用）。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**PlaceCitation**"

                      地點引用註記。

                      **type**: required `object`

                      值：`place_citation`

                      **place_id**: `string`

                      地點的 ID，格式為 `places/{place_id}`。

                      **name**: `string`

                      地點的標題。

                      **url**: `string`

                      地點的 URI 參照。



                    ??? note "**review_snippets**: `ReviewSnippet array` 用來生成 Google 地圖中特定地點特色相關回答的評論片段。"

                        **title**: `string`

                        評論的標題。

                        **url**: `string`

                        對應到 Google 地圖上使用者評論的連結。

                        **review_id**: `string`

                        評論片段的 ID。



                      **start_index**: `integer`

                      回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                      **end_index**: `integer`

                      所歸屬區段的終點（不含該位置）。





                ??? note "**SpeechAnnotation**"

                    文字內容的語音註記。

                    **type**: required `object`

                    值：`speech_metadata`

                    **speaker**: `string`

                    要與這個發言回合建立關聯的說話者。

                    **style**: `string`

                    語音合成的風格指令。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**UrlCitation**"

                    URL 引用註記。

                    **type**: required `object`

                    值：`url_citation`

                    **url**: `string`

                    URL。

                    **title**: `string`

                    URL 的標題。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**WordInfo**"

                    用於轉錄輸出的單字層級 ASR 註記。包含單字文字、選填的時間資訊，以及選填的說話者歸屬。

                    **type**: required `object`

                    值：`word_info`

                    **text**: `string`

                    轉錄出的單字。

                    **start_offset**: `string`

                    單字相對於音訊開頭的開始時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                    **end_offset**: `string`

                    單字相對於音訊開頭的結束時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                    **speaker**: `string`

                    選填。此單字的說話者標籤（例如 "spk_1"、"spk_2"）。在 TranscriptionConfig 中設定了 diarization_mode 時才會出現。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





        ??? note "**string**"

            直接的字串值。





    ---


      **type**: required `object`

      值：`noul`



    ---




    ??? note "**criteria**: `Criteria` 選填。`true` 與 `false` 結果的選填條件。"

        **true_description**: `string`

        選填。`true` 結果的選填條件或說明。

        **false_description**: `string`

        選填。`false` 結果的選填條件或說明。



??? note "**[ScoreQuestion](/api-reference/decisions/#Resource:ScoreQuestion)**"

      依離散數值等級量化的評分標準問題。


      **criteria**: required `string array`

      評分標準中的離散分數等級（2 到 255 個非空等級），其中以 0 為起始的索引 `i` 對應數值等級值 `i` 與評分說明 `criteria[i]`。



    ---




    ??? note "**instructions**: required `DecisionInstructionContent` or `DecisionInstructionContent array` or `string` 供人閱讀的決策指引、評分標準或條件，會針對共用的 `input` 進行評估。至少需要一個內容區塊。"

          **可能的類型**： 



        ??? note "**DecisionInstructionContent**"

              文字內容區塊。

              **text**: required `string`

              文字內容。

              **type**: required `object`

              值：`text`



            ??? note "**annotations**: `Annotation array` 模型生成內容的引用資訊。"

                  **可能的類型**： 



                ??? note "**FileCitation**"

                    檔案引用註記。

                    **type**: required `object`

                    值：`file_citation`

                    **document_uri**: `string`

                    檔案的 URI。

                    **file_name**: `string`

                    檔案名稱。

                    **source**: `string`

                    這段文字所歸屬的來源。

                    **custom_metadata**: `object`

                    使用者提供的擷取上下文相關中繼資料。

                    **page_number**: `integer`

                    所引用文件的頁碼（如適用）。

                    **media_id**: `string`

                    圖片引用時的媒體 ID（如適用）。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**PlaceCitation**"

                      地點引用註記。

                      **type**: required `object`

                      值：`place_citation`

                      **place_id**: `string`

                      地點的 ID，格式為 `places/{place_id}`。

                      **name**: `string`

                      地點的標題。

                      **url**: `string`

                      地點的 URI 參照。



                    ??? note "**review_snippets**: `ReviewSnippet array` 用來生成 Google 地圖中特定地點特色相關回答的評論片段。"

                        **title**: `string`

                        評論的標題。

                        **url**: `string`

                        對應到 Google 地圖上使用者評論的連結。

                        **review_id**: `string`

                        評論片段的 ID。



                      **start_index**: `integer`

                      回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                      **end_index**: `integer`

                      所歸屬區段的終點（不含該位置）。





                ??? note "**SpeechAnnotation**"

                    文字內容的語音註記。

                    **type**: required `object`

                    值：`speech_metadata`

                    **speaker**: `string`

                    要與這個發言回合建立關聯的說話者。

                    **style**: `string`

                    語音合成的風格指令。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**UrlCitation**"

                    URL 引用註記。

                    **type**: required `object`

                    值：`url_citation`

                    **url**: `string`

                    URL。

                    **title**: `string`

                    URL 的標題。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**WordInfo**"

                    用於轉錄輸出的單字層級 ASR 註記。包含單字文字、選填的時間資訊，以及選填的說話者歸屬。

                    **type**: required `object`

                    值：`word_info`

                    **text**: `string`

                    轉錄出的單字。

                    **start_offset**: `string`

                    單字相對於音訊開頭的開始時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                    **end_offset**: `string`

                    單字相對於音訊開頭的結束時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                    **speaker**: `string`

                    選填。此單字的說話者標籤（例如 "spk_1"、"spk_2"）。在 TranscriptionConfig 中設定了 diarization_mode 時才會出現。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





        ??? note "**DecisionInstructionContent array**"

              文字內容區塊。

              **text**: required `string`

              文字內容。

              **type**: required `object`

              值：`text`



            ??? note "**annotations**: `Annotation array` 模型生成內容的引用資訊。"

                  **可能的類型**： 



                ??? note "**FileCitation**"

                    檔案引用註記。

                    **type**: required `object`

                    值：`file_citation`

                    **document_uri**: `string`

                    檔案的 URI。

                    **file_name**: `string`

                    檔案名稱。

                    **source**: `string`

                    這段文字所歸屬的來源。

                    **custom_metadata**: `object`

                    使用者提供的擷取上下文相關中繼資料。

                    **page_number**: `integer`

                    所引用文件的頁碼（如適用）。

                    **media_id**: `string`

                    圖片引用時的媒體 ID（如適用）。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**PlaceCitation**"

                      地點引用註記。

                      **type**: required `object`

                      值：`place_citation`

                      **place_id**: `string`

                      地點的 ID，格式為 `places/{place_id}`。

                      **name**: `string`

                      地點的標題。

                      **url**: `string`

                      地點的 URI 參照。



                    ??? note "**review_snippets**: `ReviewSnippet array` 用來生成 Google 地圖中特定地點特色相關回答的評論片段。"

                        **title**: `string`

                        評論的標題。

                        **url**: `string`

                        對應到 Google 地圖上使用者評論的連結。

                        **review_id**: `string`

                        評論片段的 ID。



                      **start_index**: `integer`

                      回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                      **end_index**: `integer`

                      所歸屬區段的終點（不含該位置）。





                ??? note "**SpeechAnnotation**"

                    文字內容的語音註記。

                    **type**: required `object`

                    值：`speech_metadata`

                    **speaker**: `string`

                    要與這個發言回合建立關聯的說話者。

                    **style**: `string`

                    語音合成的風格指令。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**UrlCitation**"

                    URL 引用註記。

                    **type**: required `object`

                    值：`url_citation`

                    **url**: `string`

                    URL。

                    **title**: `string`

                    URL 的標題。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





                ??? note "**WordInfo**"

                    用於轉錄輸出的單字層級 ASR 註記。包含單字文字、選填的時間資訊，以及選填的說話者歸屬。

                    **type**: required `object`

                    值：`word_info`

                    **text**: `string`

                    轉錄出的單字。

                    **start_offset**: `string`

                    單字相對於音訊開頭的開始時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                    **end_offset**: `string`

                    單字相對於音訊開頭的結束時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                    **speaker**: `string`

                    選填。此單字的說話者標籤（例如 "spk_1"、"spk_2"）。在 TranscriptionConfig 中設定了 diarization_mode 時才會出現。

                    **start_index**: `integer`

                    回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                    **end_index**: `integer`

                    所歸屬區段的終點（不含該位置）。





        ??? note "**string**"

            直接的字串值。





    ---


      **type**: required `object`

      值：`score`



### NoulQuestion {#Resource:NoulQuestion}

二元（true / false）決策問題。

**屬性**：


  

??? note "**instructions**: required `DecisionInstructionContent` or `DecisionInstructionContent array` or `string` 供人閱讀的決策指引、評分標準或條件，會針對共用的 `input` 進行評估。至少需要一個內容區塊。"

      **可能的類型**： 



    ??? note "**DecisionInstructionContent**"

          文字內容區塊。

          **text**: required `string`

          文字內容。

          **type**: required `object`

          值：`text`



        ??? note "**annotations**: `Annotation array` 模型生成內容的引用資訊。"

              **可能的類型**： 



            ??? note "**FileCitation**"

                檔案引用註記。

                **type**: required `object`

                值：`file_citation`

                **document_uri**: `string`

                檔案的 URI。

                **file_name**: `string`

                檔案名稱。

                **source**: `string`

                這段文字所歸屬的來源。

                **custom_metadata**: `object`

                使用者提供的擷取上下文相關中繼資料。

                **page_number**: `integer`

                所引用文件的頁碼（如適用）。

                **media_id**: `string`

                圖片引用時的媒體 ID（如適用）。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**PlaceCitation**"

                  地點引用註記。

                  **type**: required `object`

                  值：`place_citation`

                  **place_id**: `string`

                  地點的 ID，格式為 `places/{place_id}`。

                  **name**: `string`

                  地點的標題。

                  **url**: `string`

                  地點的 URI 參照。



                ??? note "**review_snippets**: `ReviewSnippet array` 用來生成 Google 地圖中特定地點特色相關回答的評論片段。"

                    **title**: `string`

                    評論的標題。

                    **url**: `string`

                    對應到 Google 地圖上使用者評論的連結。

                    **review_id**: `string`

                    評論片段的 ID。



                  **start_index**: `integer`

                  回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                  **end_index**: `integer`

                  所歸屬區段的終點（不含該位置）。





            ??? note "**SpeechAnnotation**"

                文字內容的語音註記。

                **type**: required `object`

                值：`speech_metadata`

                **speaker**: `string`

                要與這個發言回合建立關聯的說話者。

                **style**: `string`

                語音合成的風格指令。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**UrlCitation**"

                URL 引用註記。

                **type**: required `object`

                值：`url_citation`

                **url**: `string`

                URL。

                **title**: `string`

                URL 的標題。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**WordInfo**"

                用於轉錄輸出的單字層級 ASR 註記。包含單字文字、選填的時間資訊，以及選填的說話者歸屬。

                **type**: required `object`

                值：`word_info`

                **text**: `string`

                轉錄出的單字。

                **start_offset**: `string`

                單字相對於音訊開頭的開始時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                **end_offset**: `string`

                單字相對於音訊開頭的結束時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                **speaker**: `string`

                選填。此單字的說話者標籤（例如 "spk_1"、"spk_2"）。在 TranscriptionConfig 中設定了 diarization_mode 時才會出現。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





    ??? note "**DecisionInstructionContent array**"

          文字內容區塊。

          **text**: required `string`

          文字內容。

          **type**: required `object`

          值：`text`



        ??? note "**annotations**: `Annotation array` 模型生成內容的引用資訊。"

              **可能的類型**： 



            ??? note "**FileCitation**"

                檔案引用註記。

                **type**: required `object`

                值：`file_citation`

                **document_uri**: `string`

                檔案的 URI。

                **file_name**: `string`

                檔案名稱。

                **source**: `string`

                這段文字所歸屬的來源。

                **custom_metadata**: `object`

                使用者提供的擷取上下文相關中繼資料。

                **page_number**: `integer`

                所引用文件的頁碼（如適用）。

                **media_id**: `string`

                圖片引用時的媒體 ID（如適用）。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**PlaceCitation**"

                  地點引用註記。

                  **type**: required `object`

                  值：`place_citation`

                  **place_id**: `string`

                  地點的 ID，格式為 `places/{place_id}`。

                  **name**: `string`

                  地點的標題。

                  **url**: `string`

                  地點的 URI 參照。



                ??? note "**review_snippets**: `ReviewSnippet array` 用來生成 Google 地圖中特定地點特色相關回答的評論片段。"

                    **title**: `string`

                    評論的標題。

                    **url**: `string`

                    對應到 Google 地圖上使用者評論的連結。

                    **review_id**: `string`

                    評論片段的 ID。



                  **start_index**: `integer`

                  回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                  **end_index**: `integer`

                  所歸屬區段的終點（不含該位置）。





            ??? note "**SpeechAnnotation**"

                文字內容的語音註記。

                **type**: required `object`

                值：`speech_metadata`

                **speaker**: `string`

                要與這個發言回合建立關聯的說話者。

                **style**: `string`

                語音合成的風格指令。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**UrlCitation**"

                URL 引用註記。

                **type**: required `object`

                值：`url_citation`

                **url**: `string`

                URL。

                **title**: `string`

                URL 的標題。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**WordInfo**"

                用於轉錄輸出的單字層級 ASR 註記。包含單字文字、選填的時間資訊，以及選填的說話者歸屬。

                **type**: required `object`

                值：`word_info`

                **text**: `string`

                轉錄出的單字。

                **start_offset**: `string`

                單字相對於音訊開頭的開始時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                **end_offset**: `string`

                單字相對於音訊開頭的結束時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                **speaker**: `string`

                選填。此單字的說話者標籤（例如 "spk_1"、"spk_2"）。在 TranscriptionConfig 中設定了 diarization_mode 時才會出現。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





    ??? note "**string**"

        直接的字串值。



  

---


  **type**: required `object`

  值：`noul`

  

---


  

??? note "**criteria**: `Criteria` 選填。`true` 與 `false` 結果的選填條件。"

    **true_description**: `string`

    選填。`true` 結果的選填條件或說明。

    **false_description**: `string`

    選填。`false` 結果的選填條件或說明。



### ChoiceQuestion {#Resource:ChoiceQuestion}

在互斥選項中單選的分類決策
問題。

**屬性**：


  **criteria**: required `object`

  可供選擇的互斥選項（2 到 255 個選項），將選項 ID 對應至選填的說明或評分標準。選項 ID 不得為空，且不得包含控制字元或開頭／結尾空白。

  

---


  

??? note "**instructions**: required `DecisionInstructionContent` or `DecisionInstructionContent array` or `string` 供人閱讀的決策指引、評分標準或條件，會針對共用的 `input` 進行評估。至少需要一個內容區塊。"

      **可能的類型**： 



    ??? note "**DecisionInstructionContent**"

          文字內容區塊。

          **text**: required `string`

          文字內容。

          **type**: required `object`

          值：`text`



        ??? note "**annotations**: `Annotation array` 模型生成內容的引用資訊。"

              **可能的類型**： 



            ??? note "**FileCitation**"

                檔案引用註記。

                **type**: required `object`

                值：`file_citation`

                **document_uri**: `string`

                檔案的 URI。

                **file_name**: `string`

                檔案名稱。

                **source**: `string`

                這段文字所歸屬的來源。

                **custom_metadata**: `object`

                使用者提供的擷取上下文相關中繼資料。

                **page_number**: `integer`

                所引用文件的頁碼（如適用）。

                **media_id**: `string`

                圖片引用時的媒體 ID（如適用）。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**PlaceCitation**"

                  地點引用註記。

                  **type**: required `object`

                  值：`place_citation`

                  **place_id**: `string`

                  地點的 ID，格式為 `places/{place_id}`。

                  **name**: `string`

                  地點的標題。

                  **url**: `string`

                  地點的 URI 參照。



                ??? note "**review_snippets**: `ReviewSnippet array` 用來生成 Google 地圖中特定地點特色相關回答的評論片段。"

                    **title**: `string`

                    評論的標題。

                    **url**: `string`

                    對應到 Google 地圖上使用者評論的連結。

                    **review_id**: `string`

                    評論片段的 ID。



                  **start_index**: `integer`

                  回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                  **end_index**: `integer`

                  所歸屬區段的終點（不含該位置）。





            ??? note "**SpeechAnnotation**"

                文字內容的語音註記。

                **type**: required `object`

                值：`speech_metadata`

                **speaker**: `string`

                要與這個發言回合建立關聯的說話者。

                **style**: `string`

                語音合成的風格指令。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**UrlCitation**"

                URL 引用註記。

                **type**: required `object`

                值：`url_citation`

                **url**: `string`

                URL。

                **title**: `string`

                URL 的標題。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**WordInfo**"

                用於轉錄輸出的單字層級 ASR 註記。包含單字文字、選填的時間資訊，以及選填的說話者歸屬。

                **type**: required `object`

                值：`word_info`

                **text**: `string`

                轉錄出的單字。

                **start_offset**: `string`

                單字相對於音訊開頭的開始時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                **end_offset**: `string`

                單字相對於音訊開頭的結束時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                **speaker**: `string`

                選填。此單字的說話者標籤（例如 "spk_1"、"spk_2"）。在 TranscriptionConfig 中設定了 diarization_mode 時才會出現。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





    ??? note "**DecisionInstructionContent array**"

          文字內容區塊。

          **text**: required `string`

          文字內容。

          **type**: required `object`

          值：`text`



        ??? note "**annotations**: `Annotation array` 模型生成內容的引用資訊。"

              **可能的類型**： 



            ??? note "**FileCitation**"

                檔案引用註記。

                **type**: required `object`

                值：`file_citation`

                **document_uri**: `string`

                檔案的 URI。

                **file_name**: `string`

                檔案名稱。

                **source**: `string`

                這段文字所歸屬的來源。

                **custom_metadata**: `object`

                使用者提供的擷取上下文相關中繼資料。

                **page_number**: `integer`

                所引用文件的頁碼（如適用）。

                **media_id**: `string`

                圖片引用時的媒體 ID（如適用）。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**PlaceCitation**"

                  地點引用註記。

                  **type**: required `object`

                  值：`place_citation`

                  **place_id**: `string`

                  地點的 ID，格式為 `places/{place_id}`。

                  **name**: `string`

                  地點的標題。

                  **url**: `string`

                  地點的 URI 參照。



                ??? note "**review_snippets**: `ReviewSnippet array` 用來生成 Google 地圖中特定地點特色相關回答的評論片段。"

                    **title**: `string`

                    評論的標題。

                    **url**: `string`

                    對應到 Google 地圖上使用者評論的連結。

                    **review_id**: `string`

                    評論片段的 ID。



                  **start_index**: `integer`

                  回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                  **end_index**: `integer`

                  所歸屬區段的終點（不含該位置）。





            ??? note "**SpeechAnnotation**"

                文字內容的語音註記。

                **type**: required `object`

                值：`speech_metadata`

                **speaker**: `string`

                要與這個發言回合建立關聯的說話者。

                **style**: `string`

                語音合成的風格指令。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**UrlCitation**"

                URL 引用註記。

                **type**: required `object`

                值：`url_citation`

                **url**: `string`

                URL。

                **title**: `string`

                URL 的標題。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**WordInfo**"

                用於轉錄輸出的單字層級 ASR 註記。包含單字文字、選填的時間資訊，以及選填的說話者歸屬。

                **type**: required `object`

                值：`word_info`

                **text**: `string`

                轉錄出的單字。

                **start_offset**: `string`

                單字相對於音訊開頭的開始時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                **end_offset**: `string`

                單字相對於音訊開頭的結束時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                **speaker**: `string`

                選填。此單字的說話者標籤（例如 "spk_1"、"spk_2"）。在 TranscriptionConfig 中設定了 diarization_mode 時才會出現。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





    ??? note "**string**"

        直接的字串值。



  

---


  **type**: required `object`

  值：`choice`


### ScoreQuestion {#Resource:ScoreQuestion}

依離散數值等級量化的評分標準問題。

**屬性**：


  **criteria**: required `string array`

  評分標準中的離散分數等級（2 到 255 個非空等級），其中以 0 為起始的索引 `i` 對應數值等級值 `i` 與評分說明 `criteria[i]`。

  

---


  

??? note "**instructions**: required `DecisionInstructionContent` or `DecisionInstructionContent array` or `string` 供人閱讀的決策指引、評分標準或條件，會針對共用的 `input` 進行評估。至少需要一個內容區塊。"

      **可能的類型**： 



    ??? note "**DecisionInstructionContent**"

          文字內容區塊。

          **text**: required `string`

          文字內容。

          **type**: required `object`

          值：`text`



        ??? note "**annotations**: `Annotation array` 模型生成內容的引用資訊。"

              **可能的類型**： 



            ??? note "**FileCitation**"

                檔案引用註記。

                **type**: required `object`

                值：`file_citation`

                **document_uri**: `string`

                檔案的 URI。

                **file_name**: `string`

                檔案名稱。

                **source**: `string`

                這段文字所歸屬的來源。

                **custom_metadata**: `object`

                使用者提供的擷取上下文相關中繼資料。

                **page_number**: `integer`

                所引用文件的頁碼（如適用）。

                **media_id**: `string`

                圖片引用時的媒體 ID（如適用）。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**PlaceCitation**"

                  地點引用註記。

                  **type**: required `object`

                  值：`place_citation`

                  **place_id**: `string`

                  地點的 ID，格式為 `places/{place_id}`。

                  **name**: `string`

                  地點的標題。

                  **url**: `string`

                  地點的 URI 參照。



                ??? note "**review_snippets**: `ReviewSnippet array` 用來生成 Google 地圖中特定地點特色相關回答的評論片段。"

                    **title**: `string`

                    評論的標題。

                    **url**: `string`

                    對應到 Google 地圖上使用者評論的連結。

                    **review_id**: `string`

                    評論片段的 ID。



                  **start_index**: `integer`

                  回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                  **end_index**: `integer`

                  所歸屬區段的終點（不含該位置）。





            ??? note "**SpeechAnnotation**"

                文字內容的語音註記。

                **type**: required `object`

                值：`speech_metadata`

                **speaker**: `string`

                要與這個發言回合建立關聯的說話者。

                **style**: `string`

                語音合成的風格指令。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**UrlCitation**"

                URL 引用註記。

                **type**: required `object`

                值：`url_citation`

                **url**: `string`

                URL。

                **title**: `string`

                URL 的標題。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**WordInfo**"

                用於轉錄輸出的單字層級 ASR 註記。包含單字文字、選填的時間資訊，以及選填的說話者歸屬。

                **type**: required `object`

                值：`word_info`

                **text**: `string`

                轉錄出的單字。

                **start_offset**: `string`

                單字相對於音訊開頭的開始時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                **end_offset**: `string`

                單字相對於音訊開頭的結束時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                **speaker**: `string`

                選填。此單字的說話者標籤（例如 "spk_1"、"spk_2"）。在 TranscriptionConfig 中設定了 diarization_mode 時才會出現。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





    ??? note "**DecisionInstructionContent array**"

          文字內容區塊。

          **text**: required `string`

          文字內容。

          **type**: required `object`

          值：`text`



        ??? note "**annotations**: `Annotation array` 模型生成內容的引用資訊。"

              **可能的類型**： 



            ??? note "**FileCitation**"

                檔案引用註記。

                **type**: required `object`

                值：`file_citation`

                **document_uri**: `string`

                檔案的 URI。

                **file_name**: `string`

                檔案名稱。

                **source**: `string`

                這段文字所歸屬的來源。

                **custom_metadata**: `object`

                使用者提供的擷取上下文相關中繼資料。

                **page_number**: `integer`

                所引用文件的頁碼（如適用）。

                **media_id**: `string`

                圖片引用時的媒體 ID（如適用）。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**PlaceCitation**"

                  地點引用註記。

                  **type**: required `object`

                  值：`place_citation`

                  **place_id**: `string`

                  地點的 ID，格式為 `places/{place_id}`。

                  **name**: `string`

                  地點的標題。

                  **url**: `string`

                  地點的 URI 參照。



                ??? note "**review_snippets**: `ReviewSnippet array` 用來生成 Google 地圖中特定地點特色相關回答的評論片段。"

                    **title**: `string`

                    評論的標題。

                    **url**: `string`

                    對應到 Google 地圖上使用者評論的連結。

                    **review_id**: `string`

                    評論片段的 ID。



                  **start_index**: `integer`

                  回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                  **end_index**: `integer`

                  所歸屬區段的終點（不含該位置）。





            ??? note "**SpeechAnnotation**"

                文字內容的語音註記。

                **type**: required `object`

                值：`speech_metadata`

                **speaker**: `string`

                要與這個發言回合建立關聯的說話者。

                **style**: `string`

                語音合成的風格指令。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**UrlCitation**"

                URL 引用註記。

                **type**: required `object`

                值：`url_citation`

                **url**: `string`

                URL。

                **title**: `string`

                URL 的標題。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





            ??? note "**WordInfo**"

                用於轉錄輸出的單字層級 ASR 註記。包含單字文字、選填的時間資訊，以及選填的說話者歸屬。

                **type**: required `object`

                值：`word_info`

                **text**: `string`

                轉錄出的單字。

                **start_offset**: `string`

                單字相對於音訊開頭的開始時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                **end_offset**: `string`

                單字相對於音訊開頭的結束時間偏移。當 timestamp_granularities 包含 "word" 時才會出現。

                **speaker**: `string`

                選填。此單字的說話者標籤（例如 "spk_1"、"spk_2"）。在 TranscriptionConfig 中設定了 diarization_mode 時才會出現。

                **start_index**: `integer`

                回應中歸屬此來源的區段起點。索引表示區段的開始位置，以位元組為單位。

                **end_index**: `integer`

                所歸屬區段的終點（不含該位置）。





    ??? note "**string**"

        直接的字串值。



  

---


  **type**: required `object`

  值：`score`


### Answer {#Resource:Answer}

單一問題的決策答案。

**多型類型**：


??? note "**[ChoiceAnswer](/api-reference/decisions/#Resource:ChoiceAnswer)**"

      [`ChoiceQuestion`](/api-reference/decisions/#Resource:ChoiceQuestion) 的校準結果。


      **choice**: required `string`

      僅供輸出。機率最高的選項 ID。



    ---


      **probabilities**: required `object`

      僅供輸出。每個選項 ID 在 `[0, 1]` 範圍內的封閉世界正規化機率。



    ---


      **confidence**: required `number`

      僅供輸出。`[0, 1]` 範圍內的封閉世界信心分數，等於獲勝結果的校準機率：

      - [`NoulAnswer`](/api-reference/decisions/#Resource:NoulAnswer): `max(noul, 1 - noul)`
      - [`ChoiceAnswer`](/api-reference/decisions/#Resource:ChoiceAnswer)：`p_max`（`choice` 的機率）
      - [`ScoreAnswer`](/api-reference/decisions/#Resource:ScoreAnswer)：`p_max`（`probabilities` 中的最高機率）。



    ---


      **type**: required `object`

      值：`choice`



??? note "**[NoulAnswer](/api-reference/decisions/#Resource:NoulAnswer)**"

      [`NoulQuestion`](/api-reference/decisions/#Resource:NoulQuestion) 的校準結果。


      **noul**: required `number`

      僅供輸出。經過校準的機率 `P(true)`，介於 `[0.01, 0.99]` 範圍內。



    ---


      **confidence**: required `number`

      僅供輸出。`[0, 1]` 範圍內的封閉世界信心分數，等於獲勝結果的校準機率：

      - [`NoulAnswer`](/api-reference/decisions/#Resource:NoulAnswer): `max(noul, 1 - noul)`
      - [`ChoiceAnswer`](/api-reference/decisions/#Resource:ChoiceAnswer)：`p_max`（`choice` 的機率）
      - [`ScoreAnswer`](/api-reference/decisions/#Resource:ScoreAnswer)：`p_max`（`probabilities` 中的最高機率）。



    ---


      **type**: required `object`

      值：`noul`



??? note "**[ScoreAnswer](/api-reference/decisions/#Resource:ScoreAnswer)**"

      [`ScoreQuestion`](/api-reference/decisions/#Resource:ScoreQuestion) 的校準結果。


      **score**: required `number`

      僅供輸出。以機率加權的期望分數（`sum_k k * probability_k`）。



    ---


      **probabilities**: required `object`

      僅供輸出。每個以 0 為起始的等級索引在 `[0, 1]` 範圍內的封閉世界正規化機率。



    ---


      **legend**: required `object`

      僅供輸出。每個非空、以 0 為起始的等級索引的評分標準說明。



    ---


      **confidence**: required `number`

      僅供輸出。`[0, 1]` 範圍內的封閉世界信心分數，等於獲勝結果的校準機率：

      - [`NoulAnswer`](/api-reference/decisions/#Resource:NoulAnswer): `max(noul, 1 - noul)`
      - [`ChoiceAnswer`](/api-reference/decisions/#Resource:ChoiceAnswer)：`p_max`（`choice` 的機率）
      - [`ScoreAnswer`](/api-reference/decisions/#Resource:ScoreAnswer)：`p_max`（`probabilities` 中的最高機率）。



    ---


      **type**: required `object`

      值：`score`



### NoulAnswer {#Resource:NoulAnswer}

[`NoulQuestion`](/api-reference/decisions/#Resource:NoulQuestion) 的校準結果。

**屬性**：


  **noul**: required `number`

  僅供輸出。經過校準的機率 `P(true)`，介於 `[0.01, 0.99]` 範圍內。

  

---


  **confidence**: required `number`

  僅供輸出。`[0, 1]` 範圍內的封閉世界信心分數，等於獲勝結果的校準機率：

  - [`NoulAnswer`](/api-reference/decisions/#Resource:NoulAnswer): `max(noul, 1 - noul)`
  - [`ChoiceAnswer`](/api-reference/decisions/#Resource:ChoiceAnswer)：`p_max`（`choice` 的機率）
  - [`ScoreAnswer`](/api-reference/decisions/#Resource:ScoreAnswer)：`p_max`（`probabilities` 中的最高機率）。

  

---


  **type**: required `object`

  值：`noul`


### ChoiceAnswer {#Resource:ChoiceAnswer}

[`ChoiceQuestion`](/api-reference/decisions/#Resource:ChoiceQuestion) 的校準結果。

**屬性**：


  **choice**: required `string`

  僅供輸出。機率最高的選項 ID。

  

---


  **probabilities**: required `object`

  僅供輸出。每個選項 ID 在 `[0, 1]` 範圍內的封閉世界正規化機率。

  

---


  **confidence**: required `number`

  僅供輸出。`[0, 1]` 範圍內的封閉世界信心分數，等於獲勝結果的校準機率：

  - [`NoulAnswer`](/api-reference/decisions/#Resource:NoulAnswer): `max(noul, 1 - noul)`
  - [`ChoiceAnswer`](/api-reference/decisions/#Resource:ChoiceAnswer)：`p_max`（`choice` 的機率）
  - [`ScoreAnswer`](/api-reference/decisions/#Resource:ScoreAnswer)：`p_max`（`probabilities` 中的最高機率）。

  

---


  **type**: required `object`

  值：`choice`


### ScoreAnswer {#Resource:ScoreAnswer}

[`ScoreQuestion`](/api-reference/decisions/#Resource:ScoreQuestion) 的校準結果。

**屬性**：


  **score**: required `number`

  僅供輸出。以機率加權的期望分數（`sum_k k * probability_k`）。

  

---


  **probabilities**: required `object`

  僅供輸出。每個以 0 為起始的等級索引在 `[0, 1]` 範圍內的封閉世界正規化機率。

  

---


  **legend**: required `object`

  僅供輸出。每個非空、以 0 為起始的等級索引的評分標準說明。

  

---


  **confidence**: required `number`

  僅供輸出。`[0, 1]` 範圍內的封閉世界信心分數，等於獲勝結果的校準機率：

  - [`NoulAnswer`](/api-reference/decisions/#Resource:NoulAnswer): `max(noul, 1 - noul)`
  - [`ChoiceAnswer`](/api-reference/decisions/#Resource:ChoiceAnswer)：`p_max`（`choice` 的機率）
  - [`ScoreAnswer`](/api-reference/decisions/#Resource:ScoreAnswer)：`p_max`（`probabilities` 中的最高機率）。

  

---


  **type**: required `object`

  值：`score`


### PromptFeedback {#Resource:PromptFeedback}

來自輸入內容篩選器的回饋。

**屬性**：


  

??? note "**block_reason**: `string enum` 選填。若有設定，表示輸入已被封鎖，不會傳回任何答案。"

    可能的值：

    - `safety`：提示詞因安全因素遭到封鎖。
    - `other`：提示詞因不明原因遭到封鎖。
    - `blocklist`：提示詞因含有術語封鎖清單中的詞彙遭到封鎖。
    - `prohibited_content`：提示詞因含有禁止內容遭到封鎖。
    - `image_safety`：提示詞因圖片內容不安全遭到封鎖。



  

---


  **block_reason_message**: `string`

  選填。詳細說明封鎖原因的訊息（選填）。

