# 取得模型

`GET` `https://generativelanguage.googleapis.com/v1beta/models/{model}`

取得特定 [`Model`](/api-reference/models/#Resource:Model) 的資訊，例如其版本號、token 上限、[參數](/docs/prompting-strategies/#model-parameters) 與其他中繼資料。詳細的模型資訊請參閱 [Gemini 模型指南](/docs/models/)。


  
## 參數 {#parameters}

  
  **model**：必填 `string`

  模型 ID，例如 `gemini-2.5-flash`。組成的資源名稱為 `models/{model}`。

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash?key=$GEMINI_API_KEY
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client()
      model_info = client.models.get(model="gemini-3.8-flash")
      print(model_info)
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

      modelInfo, err := client.Models.Get(ctx, "gemini-3.8-flash", nil)
      if err != nil {
          log.Fatal(err)
      }

      fmt.Println(modelInfo)
      ```


  


## 回應 {#response}


  **name**：必填 `string`

  [`Model`](/api-reference/models/#Resource:Model) 的資源名稱。所有允許的值請參閱 [模型變體](/docs/models/#model-versions)。格式：`models/{model}`，其中 `{model}` 的命名慣例為：

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

  此模型允許的輸入 token 數量上限。

  

---


  **outputTokenLimit**：`integer`

  此模型可用的輸出 token 數量上限。

  

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

  適用於 [Nucleus sampling](/docs/prompting-strategies/#model-parameters)。Nucleus sampling 會考量機率總和至少達到 `top_p` 的最小 token 集合。此值指定後端呼叫模型時要使用的預設值。

  

---


  **topK**：`integer`

  適用於 Top-k 取樣。Top-k 取樣會考量機率最高的 `top_k` 個 token 所組成的集合。此值指定後端呼叫模型時要使用的預設值。若為空值，表示模型不使用 Top-k 取樣，且不允許將 `top_k` 作為生成參數。

  

---


  **thinking**：`boolean`

  模型是否支援思考。
