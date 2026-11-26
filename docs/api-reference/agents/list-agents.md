# 列出代理


!!! note " "

      此 API 為 Beta 版。端點位於 `/v1beta/`。


`GET` `https://generativelanguage.googleapis.com/v1beta/agents`

列出所有代理。


  
## 參數 {#parameters}

  
  **parent**: required `string`

  列出代理的父資源。格式： `projects/{project}/locations/{location}`

  

---


  **page_size**: `integer`

  

---


  **page_token**: `string`

  

  

  
  **範例請求** 

  

=== "REST"

      ```sh
      curl -X GET https://generativelanguage.googleapis.com/v1beta/agents \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})
      response = client.agents.list()
      for agent in response.agents or []:
        print(agent.id)
      ```

=== "JavaScript"

      ```javascript
      import {GoogleGenAI} from '@google/genai';

      const ai = new GoogleGenAI({apiVersion: 'v1beta'});
      const agents = await ai.agents.list();
      for (const agent of agents.agents ?? []) {
        console.log(agent.id);
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.agents.Agent;
      import com.google.genai.gaos.models.agents.AgentListResponse;
      import com.google.genai.gaos.models.operations.ListAgentsResponse;
      import com.google.genai.types.HttpOptions;
      import java.util.List;

      Client client =
          Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();
      ListAgentsResponse response = client.agents.list().call();
      List<Agent> agents =
          response.agentListResponse().flatMap(AgentListResponse::agents).orElse(List.of());
      for (Agent agent : agents) {
        agent.id().ifPresent(System.out::println);
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{
              HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"},
          })
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Agents.List(ctx, operations.ListAgentsRequest{})
          if err != nil {
              log.Fatal(err)
          }

          if res.AgentListResponse != nil {
              for _, agent := range res.AgentListResponse.Agents {
                  if agent.ID != nil {
                      fmt.Println(*agent.ID)
                  }
              }
          }
      }
      ```


  


  
## 回應 {#response}

  
  **agents**: [`Agent`](/api-reference/agents/list-agents/#Resource:Agent) `array`

  代理清單。

  

---


  **next_page_token**: `string`

  用於擷取下一頁結果的 token。

  

  

  
  **範例回應** 

  ```json
  {
    "agents": [
      {
        "description": "A helpful research assistant.",
        "base_agent": "antigravity-preview-09-2026",
        "id": "research-assistant-abc123",
        "system_instruction": "You are a helpful research assistant.",
        "tools": [
          {
            "type": "google_search"
          }
        ]
      }
    ]
  }
  ```

  


## 資源 {#resources}

### Agent {#Resource:Agent}

建立代理時使用的代理定義。
此訊息是以註解剖析器為基礎的 JSON 剖析目標。
新格式：

```json
{
  "id": "customer-sentinel",
  "base_agent": "",
  "system_instruction": "...",
  "base_environment": { "type": "remote", "sources": [...] },
  "tools": [ {"type": "code_execution"} ]
}
```

**屬性：**


  **id**: `string`

  代理的唯一識別碼。

  

---


  **base_agent**: `string`

  要擴充的基礎代理。

  

---


  **system_instruction**: `string`

  代理的系統指令。

  

---


  **description**: `string`

  供開發人員快速閱讀與理解的代理說明。

  

---


  

??? note "**agent_config**: `AntigravityAgentConfig` 代理的設定參數。"

    **type**: required `object`

    值： `antigravity`

    **model**: `string`

    代理推理所使用的模型。

    **max_total_tokens**: `string`

    代理執行期間的 token 總數上限。



  

---


  

??? note "**base_environment**: `EnvironmentConfig` or `string` 代理的環境設定。"

      **可能的類型：** 



    ??? note "**EnvironmentConfig**"

          自訂環境的設定。

          **type**: required `object`

          值： `remote`



        ??? note "**sources**: `Source array`"

            ??? note "**type**: `string enum`"

                可能的值：

                - `gcs`: Cloud Storage 值區。
                - `inline`: 行內內容。
                - `repository`: 一般儲存庫。來源 URL 中的通訊協定前置字元可識別提供者（例如 github://、gcs://）。



              **source**: `string`

              環境的來源。對於 Cloud Storage，這是 Cloud Storage 路徑；對於 GitHub，這是 GitHub 路徑。

              **target**: `string`

              來源在環境中應出現的位置。

              **content**: `string`

              當 `type` 為 `INLINE` 時的行內內容。

              **encoding**: `string`

              行內內容的選用編碼（例如 `base64`）。





        ??? note "**network**: `EnvironmentNetworkEgressAllowlist` or `string enum` 環境的網路設定。"

              **可能的類型：** 



            ??? note "**EnvironmentNetworkEgressAllowlist**"

                  環境的網路輸出設定。



                ??? note "**allowlist**: `EgressRule array` or `string enum` 允許的網域及其設定清單。設為 `"disabled"` 即可封鎖所有網路輸出。"

                      **可能的類型：** 



                    ??? note "**EgressRule array**"

                        單一網域允許清單規則，可選擇性注入標頭。

                        **domain**: required `string`

                        允許送出請求的網域。支援萬用字元（例如 '*.googleapis.com'）。使用 '*' 可允許所有網域。

                        **transform**: `object`

                        要注入至符合此規則之請求的標頭。鍵：標頭名稱（例如 "Authorization"）。值：標頭值（例如 "Bearer your-token"）。

                        **credential**: `string`

                        選用。透過 ID 參照由伺服器管理的 Credential 資源。





                    ??? note "**string enum**"

                        可能的值：

                        - `disabled`: 所有網路輸出皆被封鎖。





            ??? note "**string enum**"

                可能的值：

                - `disabled`: 所有網路輸出皆被封鎖。



          **environment_id**: `string`

          選用。互動的環境 ID。若有指定，請求將更新現有環境，而非建立新環境；建立時專用的欄位（`env` 和 `sources`）在恢復既有環境時無法更新。



        ??? note "**env**: `object` or `string` 要在沙箱環境中設定的環境變數。"

              **可能的類型：** 



            ??? note "**string**"

                直接的字串值。





        ??? note "**mode**: `string enum` 此環境的運算生命週期模式。"

            可能的值：

            - `on_demand`: 此環境的運算生命週期模式。
            - `self_hosted`: 此環境的運算生命週期模式。



          **custom_config**: `object`

          選用。傳遞至自行託管環境輪詢器的任意客戶自訂 JSON 設定。僅在 `mode` 為 `SELF_HOSTED` 時支援。





    ??? note "**string**"

        直接的字串值。



  

---


  

??? note "**tools**: `AgentTool array` 代理可使用的工具。"

      **可能的類型：** 



    ??? note "**CodeExecution**"

        模型可用來執行程式碼的工具。

        **type**: required `object`

        值： `code_execution`





    ??? note "**Function**"

        模型可使用的工具。

        **type**: required `object`

        值： `function`

        **name**: `string`

        函式的名稱。

        **description**: `string`

        函式的說明。

        **parameters**: `object`

        函式參數的 JSON Schema。支援 JSON Schema 的子集。 `minLength`, `maxLength`, `minProperties`, `maxProperties`, `uniqueItems`, `contains`, `minContains`, and `maxContains` 會被忽略且不強制執行。

        **defer_loading**: `boolean`

        若為 true，系統會延遲載入此函式。

        **short_description**: `string`

        函式的簡短描述；對於設定了 `defer_loading` 的函式，模型會看到這段摘要。





    ??? note "**GoogleSearch**"

          模型可用來搜尋 Google 的工具。

          **type**: required `object`

          值： `google_search`



        ??? note "**search_types**: `string enum array` 要啟用的搜尋接地類型。"

            可能的值：

            - `web_search`: 設定此欄位可啟用網路搜尋。僅傳回文字結果。
            - `image_search`: 設定此欄位可啟用圖片搜尋。傳回圖片位元組。





    ??? note "**McpServer**"

          MCPServer 是模型可呼叫以執行動作的伺服器。

          **type**: required `object`

          值： `mcp_server`

          **name**: `string`

          MCPServer 的名稱。

          **url**: `string`

          MCPServer 端點的完整 URL。範例： "https://api.example.com/mcp"

          **headers**: `object`

          選用：視需要提供驗證標頭、逾時等欄位。



        ??? note "**allowed_tools**: `AllowedTools array` 允許的工具。"

            ??? note "**mode**: `string enum` 工具選擇的模式。"

                可能的值：

                - `auto`: 自動選擇工具。
                - `any`: 任一工具選擇。
                - `none`: 不選擇工具。
                - `validated`: 經驗證的工具選擇。



              **tools**: `string array`

              允許的工具名稱。

              **defer_loading**: `boolean`

              若為 true，系統會延遲載入此 MCP 伺服器上的工具。

              **credential**: `string`

              選用。透過 ID 參照由伺服器管理的 Credential 資源。




    ??? note "**UrlContext**"

        模型可用來取得 URL 內容脈絡的工具。

        **type**: required `object`

        值： `url_context`


