# 所有方法

Gemini API 的所有 REST 方法，依參考頁面分組。
以下所有路徑皆相對於 `https://generativelanguage.googleapis.com`。

## Gemini Interactions API {#interactions-api}

要求與回應的詳細資訊，請參閱 [Gemini Interactions API 參考文件](/api-reference/interactions-api/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`CreateInteraction`](/api-reference/interactions-api/create-interaction/) | `POST` `/v1beta/interactions` 建立新的互動。 |
| [`cancelInteractionById`](/api-reference/interactions-api/cancel-interaction-by-id/) | `POST` `/v1beta/interactions/{id}/cancel` 依 id 取消互動。 |
| [`getInteractionById`](/api-reference/interactions-api/get-interaction-by-id/) | `GET` `/v1beta/interactions/{id}` 依 `Interaction.id` 擷取單一互動的完整詳細資訊。 |
| [`deleteInteraction`](/api-reference/interactions-api/delete-interaction/) | `DELETE` `/v1beta/interactions/{id}` 依 id 刪除互動。 |


## Gemini Agents API {#agents}

要求與回應的詳細資訊，請參閱 [Gemini Agents API 參考文件](/api-reference/agents/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`CreateAgent`](/api-reference/agents/create-agent/) | `POST` `/v1beta/agents` 建立新的代理（SDK 的具型別版本）。 |
| [`ListAgents`](/api-reference/agents/list-agents/) | `GET` `/v1beta/agents` 列出所有代理。 |
| [`GetAgent`](/api-reference/agents/get-agent/) | `GET` `/v1beta/agents/{agentsId}` 取得特定的代理。 |
| [`DeleteAgent`](/api-reference/agents/delete-agent/) | `DELETE` `/v1beta/agents/{agentsId}` 刪除代理。 |


## Gemini Webhooks API {#webhooks}

要求與回應的詳細資訊，請參閱 [Gemini Webhooks API 參考文件](/api-reference/webhooks/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`CreateWebhook`](/api-reference/webhooks/create-webhook/) | `POST` `/v1beta/webhooks` 建立新的 Webhook。 |
| [`PingWebhook`](/api-reference/webhooks/ping-webhook/) | `POST` `/v1beta/webhooks/{id}:ping` 將 ping 事件傳送至 Webhook。 |
| [`RotateSigningSecret`](/api-reference/webhooks/rotate-signing-secret/) | `POST` `/v1beta/webhooks/{id}:rotateSigningSecret` 為 Webhook 產生新的簽署密鑰。 |
| [`ListWebhooks`](/api-reference/webhooks/list-webhooks/) | `GET` `/v1beta/webhooks` 列出所有 Webhook。 |
| [`GetWebhook`](/api-reference/webhooks/get-webhook/) | `GET` `/v1beta/webhooks/{id}` 取得特定的 Webhook。 |
| [`UpdateWebhook`](/api-reference/webhooks/update-webhook/) | `PATCH` `/v1beta/webhooks/{id}` 更新現有的 Webhook。 |
| [`DeleteWebhook`](/api-reference/webhooks/delete-webhook/) | `DELETE` `/v1beta/webhooks/{id}` 刪除 Webhook。 |


## Gemini Triggers API {#triggers}

要求與回應的詳細資訊，請參閱 [Gemini Triggers API 參考文件](/api-reference/triggers/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`CreateTrigger`](/api-reference/triggers/create-trigger/) | `POST` `/v1beta/triggers` 建立新的觸發條件，依指定的 cron 排程叫用指定的代理。 |
| [`RunTrigger`](/api-reference/triggers/run-trigger/) | `POST` `/v1beta/triggers/{triggerId}/executions` 立即執行觸發條件。 |
| [`ListTriggers`](/api-reference/triggers/list-triggers/) | `GET` `/v1beta/triggers` 列出專案的觸發條件。 |
| [`GetTrigger`](/api-reference/triggers/get-trigger/) | `GET` `/v1beta/triggers/{id}` 取得單一觸發條件的詳細資訊。 |
| [`ListTriggerExecutions`](/api-reference/triggers/list-trigger-executions/) | `GET` `/v1beta/triggers/{triggerId}/executions` 列出觸發條件的執行紀錄。 |
| [`UpdateTrigger`](/api-reference/triggers/update-trigger/) | `PATCH` `/v1beta/triggers/{id}` 更新觸發條件。 |
| [`DeleteTrigger`](/api-reference/triggers/delete-trigger/) | `DELETE` `/v1beta/triggers/{id}` 刪除觸發條件。 |


## Gemini Environments API {#environments}

要求與回應的詳細資訊，請參閱 [Gemini Environments API 參考文件](/api-reference/environments/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`CreateEnvironment`](/api-reference/environments/create-environment/) | `POST` `/v1beta/environments` 建立環境。 |
| [`ListEnvironments`](/api-reference/environments/list-environments/) | `GET` `/v1beta/environments` 列出環境。 |
| [`GetEnvironmentFiles`](/api-reference/environments/get-environment-files/) | `GET` `/v1beta/environments/{environment}/files/{path}` 從環境的快照擷取檔案中繼資料或目錄內容。 |
| [`GetEnvironment`](/api-reference/environments/get-environment/) | `GET` `/v1beta/environments/{id}` 取得環境。 |
| [`StartEnvironmentFileUpload`](/api-reference/environments/start-environment-file-upload/) | `PUT` `/upload/v1beta/environments/{environment}/files/{path}` 為環境工作區中的檔案啟動可續傳的上傳工作階段。 |
| [`DeleteEnvironment`](/api-reference/environments/delete-environment/) | `DELETE` `/v1beta/environments/{id}` 刪除環境。 |


## Gemini Voices API {#voices}

要求與回應的詳細資訊，請參閱 [Gemini Voices API 參考文件](/api-reference/voices/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`CreateVoice`](/api-reference/voices/create-voice/) | `POST` `/v1beta/voices` 從自然語言提示詞（`VOICE_TYPE_PROMPTED`）或參考與同意音訊錄音（`VOICE_TYPE_REPLICATED`）建立自訂語音。 |
| [`ListVoices`](/api-reference/voices/list-voices/) | `GET` `/v1beta/voices` 列出呼叫者擁有的自訂已儲存語音（由新至舊排序），其後接著 Google 語音目錄中的預建系統語音。 |
| [`GetVoice`](/api-reference/voices/get-voice/) | `GET` `/v1beta/voices/{voicesId}` 依資源名稱取得自訂已儲存語音（`store = true`）。 |
| [`DeleteVoice`](/api-reference/voices/delete-voice/) | `DELETE` `/v1beta/voices/{voicesId}` 依資源名稱刪除自訂已儲存語音（`store = true`）。 |


## Gemini Credentials API {#credentials}

要求與回應的詳細資訊，請參閱 [Gemini Credentials API 參考文件](/api-reference/credentials/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`CreateCredential`](/api-reference/credentials/create-credential/) | `POST` `/v1beta/credentials` 建立新的憑證。 |
| [`ListCredentials`](/api-reference/credentials/list-credentials/) | `GET` `/v1beta/credentials` 列出憑證。 |
| [`GetCredential`](/api-reference/credentials/get-credential/) | `GET` `/v1beta/credentials/{id}` 依 ID 取得憑證。 |
| [`UpdateCredential`](/api-reference/credentials/update-credential/) | `PATCH` `/v1beta/credentials/{id}` 更新憑證。 |
| [`DeleteCredential`](/api-reference/credentials/delete-credential/) | `DELETE` `/v1beta/credentials/{id}` 刪除憑證。 |


## Gemini Decisions API {#decisions}

要求與回應的詳細資訊，請參閱 [Gemini Decisions API 參考文件](/api-reference/decisions/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`CreateDecision`](/api-reference/decisions/create-decision/) | `POST` `/v1beta/decisions` 針對共用輸入評估一批結構化決策問題。 |


## 產生內容 {#generate-content}

要求與回應的詳細資訊，請參閱 [產生內容參考文件](/api-reference/generate-content/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`GenerateContent`](/api-reference/generate-content/generate-content/) | `POST` `/v1beta/models/{model}:generateContent` 依輸入的 `GenerateContentRequest` 產生模型回應。 |
| [`StreamGenerateContent`](/api-reference/generate-content/stream-generate-content/) | `POST` `/v1beta/models/{model}:streamGenerateContent` 依輸入的 `GenerateContentRequest` 從模型產生[串流回應](/docs/text-generation/#streaming-responses)。 |
| [`CreateToken`](/api-reference/generate-content/create-token/) | `POST` `/v1beta/auth_tokens` 建立可用於限制 BidiGenerateContent 工作階段行為的權杖。 |


## 模型 {#models}

要求與回應的詳細資訊，請參閱 [Models 參考文件](/api-reference/models/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`GetModel`](/api-reference/models/get-model/) | `GET` `/v1beta/models/{model}` 取得特定 `Model` 的資訊，例如其版本號碼、權杖上限、[參數](/docs/prompting-strategies/#model-parameters) 與其他中繼資料。 |
| [`ListModels`](/api-reference/models/list-models/) | `GET` `/v1beta/models` 列出可透過 Gemini API 使用的 [`Model`](/docs/models/)。 |


## Batch API {#batch-api}

要求與回應的詳細資訊，請參閱 [Batch API 參考文件](/api-reference/batch-api/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`BatchGenerateContent`](/api-reference/batch-api/batch-generate-content/) | `POST` `/v1beta/models/{model}:batchGenerateContent` 將一批 `GenerateContent` 要求排入佇列，進行批次處理。 |
| [`AsyncBatchEmbedContent`](/api-reference/batch-api/async-batch-embed-content/) | `POST` `/v1beta/models/{model}:asyncBatchEmbedContent` 將一批 `EmbedContent` 要求排入佇列，進行批次處理。 |
| [`GetBatch`](/api-reference/batch-api/get-batch/) | `GET` `/v1beta/batches/{generateContentBatch}` 取得長時間執行作業的最新狀態。 |
| [`ListBatches`](/api-reference/batch-api/list-batches/) | `GET` `/v1beta/batches` 列出符合要求中所指定篩選條件的作業。 |
| [`CancelBatch`](/api-reference/batch-api/cancel-batch/) | `POST` `/v1beta/batches/{generateContentBatch}:cancel` 開始非同步取消長時間執行作業。 |
| [`DeleteBatch`](/api-reference/batch-api/delete-batch/) | `DELETE` `/v1beta/batches/{generateContentBatch}` 刪除長時間執行作業。 |
| [`UpdateGenerateContentBatch`](/api-reference/batch-api/update-generate-content-batch/) | `PATCH` `/v1beta/batches/{generateContentBatch}:updateGenerateContentBatch` 更新一批用於批次處理的 GenerateContent 要求。 |
| [`UpdateEmbedContentBatch`](/api-reference/batch-api/update-embed-content-batch/) | `PATCH` `/v1beta/batches/{generateContentBatch}:updateEmbedContentBatch` 更新一批用於批次處理的 EmbedContent 要求。 |


## 使用檔案 {#files}

要求與回應的詳細資訊，請參閱 [使用檔案參考文件](/api-reference/files/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`GetFile`](/api-reference/files/get-file/) | `GET` `/v1beta/files/{file}` 取得指定 `File` 的中繼資料。 |
| [`ListFiles`](/api-reference/files/list-files/) | `GET` `/v1beta/files` 列出提出要求的專案所擁有之 `File` 的中繼資料。 |
| [`DeleteFile`](/api-reference/files/delete-file/) | `DELETE` `/v1beta/files/{file}` 刪除 `File`。 |
| [`RegisterFiles`](/api-reference/files/register-files/) | `POST` `/v1beta/files:register` 向 FileService 註冊 Google Cloud Storage 檔案。 |
| [`CreateFile`](/api-reference/files/create-file/) | `POST` `/v1beta/files` 建立 `File`。 |


## 計算權杖數 {#tokens}

要求與回應的詳細資訊，請參閱 [計算權杖數參考文件](/api-reference/tokens/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`CountTokens`](/api-reference/tokens/count-tokens/) | `POST` `/v1beta/models/{model}:countTokens` 對輸入的 `Content` 執行模型的 tokenizer，並傳回權杖數量。 |


## Caching {#caching}

要求與回應的詳細資訊，請參閱 [Caching 參考文件](/api-reference/caching/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`CreateCachedContent`](/api-reference/caching/create-cached-content/) | `POST` `/v1beta/cachedContents` 建立 CachedContent 資源。 |
| [`ListCachedContents`](/api-reference/caching/list-cached-contents/) | `GET` `/v1beta/cachedContents` 列出 CachedContent。 |
| [`GetCachedContent`](/api-reference/caching/get-cached-content/) | `GET` `/v1beta/cachedContents/{id}` 讀取 CachedContent 資源。 |
| [`UpdateCachedContent`](/api-reference/caching/update-cached-content/) | `PATCH` `/v1beta/cachedContents/{id}` 更新 CachedContent 資源（僅到期時間可更新）。 |
| [`DeleteCachedContent`](/api-reference/caching/delete-cached-content/) | `DELETE` `/v1beta/cachedContents/{id}` 刪除 CachedContent 資源。 |


## Embeddings {#embeddings}

要求與回應的詳細資訊，請參閱 [Embeddings 參考文件](/api-reference/embeddings/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`EmbedContent`](/api-reference/embeddings/embed-content/) | `POST` `/v1beta/models/{model}:embedContent` 使用指定的 [Gemini Embedding 模型](/docs/models/#specialized-task-models)，從輸入的 `Content` 產生文字嵌入向量。 |
| [`BatchEmbedContents`](/api-reference/embeddings/batch-embed-contents/) | `POST` `/v1beta/models/{model}:batchEmbedContents` 從輸入的 `Content` 產生多個嵌入向量；其內容由一批以 `EmbedContentRequest` 物件表示的字串組成。 |
| [`AsyncBatchEmbedContent`](/api-reference/embeddings/async-batch-embed-content/) | `POST` `/v1beta/models/{model}:asyncBatchEmbedContent` 將一批 `EmbedContent` 要求排入佇列，進行批次處理。 |


## File Search Stores {#file-search-file-search-stores}

要求與回應的詳細資訊，請參閱 [File Search Stores 參考文件](/api-reference/file-search/file-search-stores/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`CreateFileSearchStore`](/api-reference/file-search/file-search-stores/create-file-search-store/) | `POST` `/v1beta/fileSearchStores` 建立空的 `FileSearchStore`。 |
| [`DeleteFileSearchStore`](/api-reference/file-search/file-search-stores/delete-file-search-store/) | `DELETE` `/v1beta/fileSearchStores/{fileSearchStore}` 刪除 `FileSearchStore`。 |
| [`GetFileSearchStore`](/api-reference/file-search/file-search-stores/get-file-search-store/) | `GET` `/v1beta/fileSearchStores/{fileSearchStore}` 取得特定 `FileSearchStore` 的資訊。 |
| [`ListFileSearchStores`](/api-reference/file-search/file-search-stores/list-file-search-stores/) | `GET` `/v1beta/fileSearchStores` 列出使用者擁有的所有 `FileSearchStores`。 |
| [`ImportFile`](/api-reference/file-search/file-search-stores/import-file/) | `POST` `/v1beta/fileSearchStores/{fileSearchStore}:importFile` 將 `File` 從 File Service 匯入 `FileSearchStore`。 |
| [`GetFileSearchStoreOperation`](/api-reference/file-search/file-search-stores/get-file-search-store-operation/) | `GET` `/v1beta/fileSearchStores/{fileSearchStore}/operations/{operation}` 取得長時間執行作業的最新狀態。 |
| [`GetFileSearchStoreUploadOperation`](/api-reference/file-search/file-search-stores/get-file-search-store-upload-operation/) | `GET` `/v1beta/fileSearchStores/{fileSearchStoresId}/upload/operations/{operationsId}` 取得長時間執行作業的最新狀態。 |
| [`UploadToFileSearchStore`](/api-reference/file-search/file-search-stores/upload-to-file-search-store/) | `POST` `/v1beta/fileSearchStores/{fileSearchStore}:uploadToFileSearchStore` 將資料上傳至 FileSearchStore，預先處理並分塊後，儲存至 FileSearchStore Document。 |


## 文件 {#file-search-documents}

要求與回應的詳細資訊，請參閱 [文件參考文件](/api-reference/file-search/documents/)。


| 方法 | HTTP 要求 |
| --- | --- |
| [`DeleteDocument`](/api-reference/file-search/documents/delete-document/) | `DELETE` `/v1beta/fileSearchStores/{fileSearchStore}/documents/{document}` 刪除 `Document`。 |
| [`GetDocument`](/api-reference/file-search/documents/get-document/) | `GET` `/v1beta/fileSearchStores/{fileSearchStore}/documents/{document}` 取得特定 `Document` 的資訊。 |
| [`ListDocuments`](/api-reference/file-search/documents/list-documents/) | `GET` `/v1beta/fileSearchStores/{fileSearchStore}/documents` 列出所有 `Document`（位於 `Corpus` 中）。 |


