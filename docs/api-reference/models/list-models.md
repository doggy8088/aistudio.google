# 列出模型

`GET` `https://generativelanguage.googleapis.com/v1beta/models`

列出透過 Gemini API 提供的 [`Model`s](/docs/models/)。


  
## 參數 {#parameters}

  
  **pageSize**：`integer`

  要傳回的 `Models` 數量上限（每頁）。若未指定，每頁將傳回 50 個模型。即使傳入更大的 page_size，此方法每頁最多仍只傳回 1000 個模型。

  

---


  **pageToken**：`string`

  分頁權杖，從先前的 `ListModels` 呼叫中取得。將某次請求傳回的 `page_token` 作為參數傳入下一次請求，即可擷取下一頁。進行分頁時，提供給 `ListModels` 的所有其他參數，必須與提供該分頁權杖的那次呼叫相同。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      print("List of models that support generateContent:\n")
      for m in client.models.list():
        for action in m.supported_actions:
          if action == "generateContent":
            print(m.name)

      print("List of models that support embedContent:\n")
      for m in client.models.list():
        for action in m.supported_actions:
          if action == "embedContent":
            print(m.name)
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

      // Retrieve the list of models.
      models, err := client.Models.List(ctx, &genai.ListModelsConfig{})
      if err != nil {
          log.Fatal(err)
      }

      fmt.Println("List of models that support generateContent:")
      for _, m := range models.Items {
          for _, action := range m.SupportedActions {
              if action == "generateContent" {
                  fmt.Println(m.Name)
                  break
              }
          }
      }

      fmt.Println("\nList of models that support embedContent:")
      for _, m := range models.Items {
          for _, action := range m.SupportedActions {
              if action == "embedContent" {
                  fmt.Println(m.Name)
                  break
              }
          }
      }
      ```


  


## 回應 {#response}


  **models**：[`Model`](/api-reference/models/list-models/#Resource:Model) `array`

  傳回的模型。

  

---


  **nextPageToken**：`string`

  可作為 `page_token` 傳送以擷取下一頁的權杖。若省略此欄位，表示已無更多頁面。


## 資源 {#resources}

### Model {#Resource:Model}

有關生成式語言模型的資訊。

**屬性**：


  **name**：必填 `string`

  [`Model`](/api-reference/models/list-models/#Resource:Model) 的資源名稱。所有允許的值請參閱 [模型變體](/docs/models/#model-versions)。格式：`models/{model}`，其中 `{model}` 的命名慣例為：

  - "{base_model_id}-{version}"

  範例：

  - `models/gemini-1.5-flash-001`

  

---


  **baseModelId**：必填 `string`

  基礎模型的名稱，請將此值傳入生成請求。範例：

  - `gemini-1.5-flash`

  

---


  **version**：必填 `string`

  模型的版本號，代表主要版本（`1.0` 或 `1.5`）。

  

---


  **displayName**：`string`

  模型易於閱讀的名稱，例如「Gemini 1.5 Flash」。名稱長度最多可達 128 個字元，可由任何 UTF-8 字元組成。

  

---


  **description**：`string`

  模型的簡短說明。

  

---


  **inputTokenLimit**：`integer`

  此模型允許的輸入權杖數量上限。

  

---


  **outputTokenLimit**：`integer`

  此模型可用的輸出權杖數量上限。

  

---


  **supportedGenerationMethods**：`string array`

  模型支援的生成方法。對應的 API 方法名稱以 Pascal case 字串定義，例如 `generateMessage` 與 `generateContent`。

  

---


  **temperature**：`number`

  控制輸出的隨機程度。值可介於 `[0.0,max_temperature]` 之間（含兩端）。值越高，產生的回應變化越豐富；值越接近 `0.0`，模型回應通常越不令人意外。此值指定後端呼叫模型時要使用的預設值。

  

---


  **maxTemperature**：`number`

  此模型可使用的最高 temperature。

  

---


  **topP**：`number`

  適用於 [Nucleus sampling](/docs/prompting-strategies/#model-parameters)。Nucleus sampling 會考量機率總和至少達到 `top_p` 的最小權杖集合。此值指定後端呼叫模型時要使用的預設值。

  

---


  **topK**：`integer`

  適用於 Top-k 取樣。Top-k 取樣會考量機率最高的 `top_k` 個權杖所組成的集合。此值指定後端呼叫模型時要使用的預設值。若為空值，表示模型不使用 Top-k 取樣，且不允許將 `top_k` 作為生成參數。

  

---


  **thinking**：`boolean`

  模型是否支援思考。
