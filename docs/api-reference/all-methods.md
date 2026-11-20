# 所有方法

Gemini API 的所有 REST 方法，依參考頁面分組。
以下所有路徑皆相對於 `https://generativelanguage.googleapis.com`。

## Gemini Interactions API {#interactions-api}

要求與回應的詳細資訊，請參閱 [Gemini Interactions API 參考文件](/api-reference/interactions-api/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [建立互動](/api-reference/interactions-api/create-interaction/) | `POST` `/v1beta/interactions` 建立新的互動。 |
| [取消互動](/api-reference/interactions-api/cancel-interaction-by-id/) | `POST` `/v1beta/interactions/{id}/cancel` 依 id 取消互動。 |
| [取得互動](/api-reference/interactions-api/get-interaction-by-id/) | `GET` `/v1beta/interactions/{id}` 依 `Interaction.id` 擷取單一互動的完整詳細資訊。 |
| [刪除互動](/api-reference/interactions-api/delete-interaction/) | `DELETE` `/v1beta/interactions/{id}` 依 id 刪除互動。 |


## Gemini Agents API {#agents}

要求與回應的詳細資訊，請參閱 [Gemini Agents API 參考文件](/api-reference/agents/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [建立代理](/api-reference/agents/create-agent/) | `POST` `/v1beta/agents` 建立新的代理（SDK 的具型別版本）。 |
| [列出代理](/api-reference/agents/list-agents/) | `GET` `/v1beta/agents` 列出所有代理。 |
| [取得代理](/api-reference/agents/get-agent/) | `GET` `/v1beta/agents/{agentsId}` 取得特定的代理。 |
| [刪除代理](/api-reference/agents/delete-agent/) | `DELETE` `/v1beta/agents/{agentsId}` 刪除代理。 |


## Gemini Webhooks API {#webhooks}

要求與回應的詳細資訊，請參閱 [Gemini Webhooks API 參考文件](/api-reference/webhooks/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [建立 webhook](/api-reference/webhooks/create-webhook/) | `POST` `/v1beta/webhooks` 建立新的 Webhook。 |
| [Ping webhook](/api-reference/webhooks/ping-webhook/) | `POST` `/v1beta/webhooks/{id}:ping` 將 ping 事件傳送至 Webhook。 |
| [輪換 webhook 簽章密鑰](/api-reference/webhooks/rotate-signing-secret/) | `POST` `/v1beta/webhooks/{id}:rotateSigningSecret` 為 Webhook 產生新的簽署密鑰。 |
| [列出 webhook](/api-reference/webhooks/list-webhooks/) | `GET` `/v1beta/webhooks` 列出所有 Webhook。 |
| [取得 webhook](/api-reference/webhooks/get-webhook/) | `GET` `/v1beta/webhooks/{id}` 取得特定的 Webhook。 |
| [更新 webhook](/api-reference/webhooks/update-webhook/) | `PATCH` `/v1beta/webhooks/{id}` 更新現有的 Webhook。 |
| [刪除 webhook](/api-reference/webhooks/delete-webhook/) | `DELETE` `/v1beta/webhooks/{id}` 刪除 Webhook。 |


## Gemini Triggers API {#triggers}

要求與回應的詳細資訊，請參閱 [Gemini Triggers API 參考文件](/api-reference/triggers/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [建立觸發器](/api-reference/triggers/create-trigger/) | `POST` `/v1beta/triggers` 建立新的觸發條件，依指定的 cron 排程叫用指定的代理。 |
| [執行觸發器](/api-reference/triggers/run-trigger/) | `POST` `/v1beta/triggers/{triggerId}/executions` 立即執行觸發條件。 |
| [列出觸發器](/api-reference/triggers/list-triggers/) | `GET` `/v1beta/triggers` 列出專案的觸發條件。 |
| [取得觸發器](/api-reference/triggers/get-trigger/) | `GET` `/v1beta/triggers/{id}` 取得單一觸發條件的詳細資訊。 |
| [列出觸發器的執行記錄](/api-reference/triggers/list-trigger-executions/) | `GET` `/v1beta/triggers/{triggerId}/executions` 列出觸發條件的執行紀錄。 |
| [更新觸發器](/api-reference/triggers/update-trigger/) | `PATCH` `/v1beta/triggers/{id}` 更新觸發條件。 |
| [刪除觸發器](/api-reference/triggers/delete-trigger/) | `DELETE` `/v1beta/triggers/{id}` 刪除觸發條件。 |


## Gemini Environments API {#environments}

要求與回應的詳細資訊，請參閱 [Gemini Environments API 參考文件](/api-reference/environments/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [建立環境](/api-reference/environments/create-environment/) | `POST` `/v1beta/environments` 建立環境。 |
| [列出環境](/api-reference/environments/list-environments/) | `GET` `/v1beta/environments` 列出環境。 |
| [取得環境檔案](/api-reference/environments/get-environment-files/) | `GET` `/v1beta/environments/{environment}/files/{path}` 從環境的快照擷取檔案中繼資料或目錄內容。 |
| [取得環境](/api-reference/environments/get-environment/) | `GET` `/v1beta/environments/{id}` 取得環境。 |
| [上傳環境檔案](/api-reference/environments/start-environment-file-upload/) | `PUT` `/upload/v1beta/environments/{environment}/files/{path}` 為環境工作區中的檔案啟動可續傳的上傳工作階段。 |
| [刪除環境](/api-reference/environments/delete-environment/) | `DELETE` `/v1beta/environments/{id}` 刪除環境。 |


## Gemini Voices API {#voices}

要求與回應的詳細資訊，請參閱 [Gemini Voices API 參考文件](/api-reference/voices/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [建立語音](/api-reference/voices/create-voice/) | `POST` `/v1beta/voices` 從自然語言提示詞（`VOICE_TYPE_PROMPTED`）或參考與同意音訊錄音（`VOICE_TYPE_REPLICATED`）建立自訂語音。 |
| [列出語音](/api-reference/voices/list-voices/) | `GET` `/v1beta/voices` 列出呼叫者擁有的自訂已儲存語音（由新至舊排序），其後接著 Google 語音目錄中的預建系統語音。 |
| [取得語音](/api-reference/voices/get-voice/) | `GET` `/v1beta/voices/{voicesId}` 依資源名稱取得自訂已儲存語音（`store = true`）。 |
| [刪除語音](/api-reference/voices/delete-voice/) | `DELETE` `/v1beta/voices/{voicesId}` 依資源名稱刪除自訂已儲存語音（`store = true`）。 |


## Gemini Credentials API {#credentials}

要求與回應的詳細資訊，請參閱 [Gemini Credentials API 參考文件](/api-reference/credentials/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [建立憑證](/api-reference/credentials/create-credential/) | `POST` `/v1beta/credentials` 建立新的憑證。 |
| [列出憑證](/api-reference/credentials/list-credentials/) | `GET` `/v1beta/credentials` 列出憑證。 |
| [取得憑證](/api-reference/credentials/get-credential/) | `GET` `/v1beta/credentials/{id}` 依 ID 取得憑證。 |
| [更新憑證](/api-reference/credentials/update-credential/) | `PATCH` `/v1beta/credentials/{id}` 更新憑證。 |
| [刪除憑證](/api-reference/credentials/delete-credential/) | `DELETE` `/v1beta/credentials/{id}` 刪除憑證。 |


## Gemini Decisions API {#decisions}

要求與回應的詳細資訊，請參閱 [Gemini Decisions API 參考文件](/api-reference/decisions/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [建立決策](/api-reference/decisions/create-decision/) | `POST` `/v1beta/decisions` 針對共用輸入評估一批結構化決策問題。 |


## 產生內容 {#generate-content}

要求與回應的詳細資訊，請參閱 [產生內容參考文件](/api-reference/generate-content/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [產生內容](/api-reference/generate-content/generate-content/) | `POST` `/v1beta/models/{model}:generateContent` 依輸入的 `GenerateContentRequest` 產生模型回應。 |
| [串流生成內容](/api-reference/generate-content/stream-generate-content/) | `POST` `/v1beta/models/{model}:streamGenerateContent` 依輸入的 `GenerateContentRequest` 從模型產生[串流回應](/docs/text-generation/#streaming-responses)。 |
| [建立臨時驗證 token](/api-reference/generate-content/create-token/) | `POST` `/v1beta/auth_tokens` 建立可用於限制 BidiGenerateContent 工作階段行為的 token。 |


## 模型 {#models}

要求與回應的詳細資訊，請參閱 [Models 參考文件](/api-reference/models/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [取得模型](/api-reference/models/get-model/) | `GET` `/v1beta/models/{model}` 取得特定 `Model` 的資訊，例如其版本號碼、token 上限、[參數](/docs/prompting-strategies/#model-parameters) 與其他中繼資料。 |
| [列出模型](/api-reference/models/list-models/) | `GET` `/v1beta/models` 列出可透過 Gemini API 使用的 [`Model`](/docs/models/)。 |


## Batch API {#batch-api}

要求與回應的詳細資訊，請參閱 [Batch API 參考文件](/api-reference/batch-api/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [建立內容生成批次](/api-reference/batch-api/batch-generate-content/) | `POST` `/v1beta/models/{model}:batchGenerateContent` 將一批 `GenerateContent` 要求排入佇列，進行批次處理。 |
| [建立嵌入批次](/api-reference/batch-api/async-batch-embed-content/) | `POST` `/v1beta/models/{model}:asyncBatchEmbedContent` 將一批 `EmbedContent` 要求排入佇列，進行批次處理。 |
| [取得批次](/api-reference/batch-api/get-batch/) | `GET` `/v1beta/batches/{generateContentBatch}` 取得長時間執行作業的最新狀態。 |
| [列出批次](/api-reference/batch-api/list-batches/) | `GET` `/v1beta/batches` 列出符合要求中所指定篩選條件的作業。 |
| [取消批次](/api-reference/batch-api/cancel-batch/) | `POST` `/v1beta/batches/{generateContentBatch}:cancel` 開始非同步取消長時間執行作業。 |
| [刪除批次](/api-reference/batch-api/delete-batch/) | `DELETE` `/v1beta/batches/{generateContentBatch}` 刪除長時間執行作業。 |
| [更新內容生成批次](/api-reference/batch-api/update-generate-content-batch/) | `PATCH` `/v1beta/batches/{generateContentBatch}:updateGenerateContentBatch` 更新一批用於批次處理的 GenerateContent 要求。 |
| [更新嵌入批次](/api-reference/batch-api/update-embed-content-batch/) | `PATCH` `/v1beta/batches/{generateContentBatch}:updateEmbedContentBatch` 更新一批用於批次處理的 EmbedContent 要求。 |


## 使用檔案 {#files}

要求與回應的詳細資訊，請參閱 [使用檔案參考文件](/api-reference/files/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [取得檔案](/api-reference/files/get-file/) | `GET` `/v1beta/files/{file}` 取得指定 `File` 的中繼資料。 |
| [列出檔案](/api-reference/files/list-files/) | `GET` `/v1beta/files` 列出提出要求的專案所擁有之 `File` 的中繼資料。 |
| [刪除檔案](/api-reference/files/delete-file/) | `DELETE` `/v1beta/files/{file}` 刪除 `File`。 |
| [註冊檔案](/api-reference/files/register-files/) | `POST` `/v1beta/files:register` 向 FileService 註冊 Google Cloud Storage 檔案。 |
| [建立檔案](/api-reference/files/create-file/) | `POST` `/v1beta/files` 建立 `File`。 |


## 計算 token 數 {#tokens}

要求與回應的詳細資訊，請參閱 [計算 token 數參考文件](/api-reference/tokens/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [計算 token 數](/api-reference/tokens/count-tokens/) | `POST` `/v1beta/models/{model}:countTokens` 對輸入的 `Content` 執行模型的 tokenizer，並傳回 token 數量。 |


## Caching {#caching}

要求與回應的詳細資訊，請參閱 [Caching 參考文件](/api-reference/caching/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [建立快取內容](/api-reference/caching/create-cached-content/) | `POST` `/v1beta/cachedContents` 建立 CachedContent 資源。 |
| [列出快取內容](/api-reference/caching/list-cached-contents/) | `GET` `/v1beta/cachedContents` 列出 CachedContent。 |
| [取得快取內容](/api-reference/caching/get-cached-content/) | `GET` `/v1beta/cachedContents/{id}` 讀取 CachedContent 資源。 |
| [更新快取內容](/api-reference/caching/update-cached-content/) | `PATCH` `/v1beta/cachedContents/{id}` 更新 CachedContent 資源（僅到期時間可更新）。 |
| [刪除快取內容](/api-reference/caching/delete-cached-content/) | `DELETE` `/v1beta/cachedContents/{id}` 刪除 CachedContent 資源。 |


## Embeddings {#embeddings}

要求與回應的詳細資訊，請參閱 [Embeddings 參考文件](/api-reference/embeddings/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [嵌入內容](/api-reference/embeddings/embed-content/) | `POST` `/v1beta/models/{model}:embedContent` 使用指定的 [Gemini Embedding 模型](/docs/models/#specialized-task-models)，從輸入的 `Content` 產生文字嵌入向量。 |
| [批次嵌入多份內容](/api-reference/embeddings/batch-embed-contents/) | `POST` `/v1beta/models/{model}:batchEmbedContents` 從輸入的 `Content` 產生多個嵌入向量；其內容由一批以 `EmbedContentRequest` 物件表示的字串組成。 |
| [建立嵌入批次](/api-reference/embeddings/async-batch-embed-content/) | `POST` `/v1beta/models/{model}:asyncBatchEmbedContent` 將一批 `EmbedContent` 要求排入佇列，進行批次處理。 |


## File Search Stores {#file-search-file-search-stores}

要求與回應的詳細資訊，請參閱 [File Search Stores 參考文件](/api-reference/file-search/file-search-stores/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [建立 file search store](/api-reference/file-search/file-search-stores/create-file-search-store/) | `POST` `/v1beta/fileSearchStores` 建立空的 `FileSearchStore`。 |
| [刪除 file search store](/api-reference/file-search/file-search-stores/delete-file-search-store/) | `DELETE` `/v1beta/fileSearchStores/{fileSearchStore}` 刪除 `FileSearchStore`。 |
| [取得 file search store](/api-reference/file-search/file-search-stores/get-file-search-store/) | `GET` `/v1beta/fileSearchStores/{fileSearchStore}` 取得特定 `FileSearchStore` 的資訊。 |
| [列出檔案搜尋儲存庫](/api-reference/file-search/file-search-stores/list-file-search-stores/) | `GET` `/v1beta/fileSearchStores` 列出使用者擁有的所有 `FileSearchStores`。 |
| [匯入檔案](/api-reference/file-search/file-search-stores/import-file/) | `POST` `/v1beta/fileSearchStores/{fileSearchStore}:importFile` 將 `File` 從 File Service 匯入 `FileSearchStore`。 |
| [取得作業](/api-reference/file-search/file-search-stores/get-file-search-store-operation/) | `GET` `/v1beta/fileSearchStores/{fileSearchStore}/operations/{operation}` 取得長時間執行作業的最新狀態。 |
| [取得上傳作業](/api-reference/file-search/file-search-stores/get-file-search-store-upload-operation/) | `GET` `/v1beta/fileSearchStores/{fileSearchStoresId}/upload/operations/{operationsId}` 取得長時間執行作業的最新狀態。 |
| [上傳至檔案搜尋儲存庫](/api-reference/file-search/file-search-stores/upload-to-file-search-store/) | `POST` `/v1beta/fileSearchStores/{fileSearchStore}:uploadToFileSearchStore` 將資料上傳至 FileSearchStore，預先處理並分塊後，儲存至 FileSearchStore Document。 |


## 文件 {#file-search-documents}

要求與回應的詳細資訊，請參閱 [文件參考文件](/api-reference/file-search/documents/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [刪除文件](/api-reference/file-search/documents/delete-document/) | `DELETE` `/v1beta/fileSearchStores/{fileSearchStore}/documents/{document}` 刪除 `Document`。 |
| [取得文件](/api-reference/file-search/documents/get-document/) | `GET` `/v1beta/fileSearchStores/{fileSearchStore}/documents/{document}` 取得特定 `Document` 的資訊。 |
| [列出文件](/api-reference/file-search/documents/list-documents/) | `GET` `/v1beta/fileSearchStores/{fileSearchStore}/documents` 列出所有 `Document`（位於 `Corpus` 中）。 |


