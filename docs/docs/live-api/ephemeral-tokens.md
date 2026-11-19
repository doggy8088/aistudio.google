# Live API 中的短期 token


!!! note " "

      此功能目前為[預覽版](/docs/models/#preview)。


短期 token 是短效期的驗證 token，可透過 [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 存取 Gemini API。這類 token 旨在提升直接從使用者裝置連線至 API（即[用戶端到伺服器](/docs/live-api/#implementation-approach)實作方式）時的安全性。與標準 API 金鑰相同，短期 token 也可能從網頁瀏覽器或行動應用程式等用戶端應用程式中被擷取出來。不過，由於短期 token 會快速到期，且可以加上限制，因此能大幅降低正式環境中的安全風險。當你直接從用戶端應用程式存取 Live API 時，應使用短期 token 來強化 API 金鑰的安全性。


!!! note " "

      目前，短期 token 僅與 [Live API](/docs/live-api/) 相容。


## 短期 token 的運作方式 {#how-it-works}

以下是短期 token 在高層次上的運作方式：

1.  你的用戶端（例如網頁應用程式）向你的後端進行驗證。
2.  你的後端向 Gemini API 的佈建服務要求短期 token。
3.  Gemini API 核發短效期 token。
4.  你的後端將 token 傳送給用戶端，供其透過 WebSocket 連線至 Live API。你可以將 API 金鑰換成短期 token 來完成這一步。
5.  用戶端接著將 token 當作 API 金鑰使用。

![](https://www.gstatic.com/cloud-cms/e24bc6220f8251c4ac104a19e823e452.png)

這樣能提升安全性，因為即使 tokens 被擷取，也只是短效期的，不像部署在用戶端的長效期 API 金鑰那樣風險持久。由於用戶端會直接將資料傳送給 Gemini，這也能改善延遲，並免去後端代理即時資料的需要。

## 建立短期 token {#create-a-token}

以下是一個簡化的範例，說明如何從 Gemini 取得短期 token。依預設，你將有 1 分鐘的時間可以使用這次要求取得的 token 來啟動新的 Live API 工作階段（`newSessionExpireTime`），並有 30 分鐘的時間透過該連線傳送訊息（`expireTime`）。


=== "Python"

      ```python
      import datetime
      from google import genai

      now = datetime.datetime.now(tz=datetime.timezone.utc)

      client = genai.Client(http_options={"api_version": "v1beta"})

      token = client.auth_tokens.create(
          config = {
          'uses': 1, # The ephemeral token can only be used to start a single session
          'expire_time': now + datetime.timedelta(minutes=30), # Default is 30 minutes in the future
          # 'expire_time': '2025-05-17T00:00:00Z',   # Accepts isoformat.
          'new_session_expire_time': now + datetime.timedelta(minutes=1), # Default 1 minute in the future
        }
      )

      # You'll need to pass the value under token.name back to your client to use it
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });
      const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      const token = await client.authTokens.create({
          config: {
            uses: 1, // The default
            expireTime: expireTime, // Default is 30 mins
            newSessionExpireTime: new Date(Date.now() + (1 * 60 * 1000)), // Default 1 minute in the future
          },
        });
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/auth_tokens" \
        -H "x-goog-api-key: ${GEMINI_API_KEY}" \
        -H "Content-Type: application/json" \
        -d '{
          "uses": 1,
          "expireTime": "YYYY-MM-DDTHH:MM:SSZ",
          "newSessionExpireTime": "YYYY-MM-DDTHH:MM:SSZ"
        }'
      ```


關於 `expireTime` 的值限制、預設值及其他欄位規格，請參閱 [API 參考文件](/api-reference/live/#ephemeral-auth-tokens)。在 `expireTime` 的時間範圍內，你需要使用 [`sessionResumption`](/docs/live-api/session-management/#session-resumption)，每 10 分鐘重新連線一次（即使 `uses: 1`，也可以使用同一個 token 完成）。

你也可以將短期 token 鎖定為一組設定。這有助於進一步提升應用程式的安全性，並將系統指令保留在伺服器端。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      token = client.auth_tokens.create(
          config = {
          'uses': 1,
          'live_connect_constraints': {
              'model': 'gemini-3.8-live',
              'config': {
                  'session_resumption':{},
                  'response_modalities':['AUDIO']
              }
          },
          }
      )

      # You'll need to pass the value under token.name back to your client to use it
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });
      const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      const token = await client.authTokens.create({
          config: {
              uses: 1, // The default
              expireTime: expireTime,
              liveConnectConstraints: {
                  model: 'gemini-3.8-live',
                  config: {
                      sessionResumption: {},
                      responseModalities: ['AUDIO']
                  }
              },
          }
      });

      // You'll need to pass the value under token.name back to your client to use it
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/auth_tokens" \
        -H "x-goog-api-key: ${GEMINI_API_KEY}" \
        -H "Content-Type: application/json" \
        -d '{
          "uses": 1,
          "expireTime": "YYYY-MM-DDTHH:MM:SSZ",
          "liveConnectConstraints": {
            "model": "models/gemini-3.8-live",
            "config": {
              "sessionResumption": {},
              "responseModalities": ["AUDIO"]
            }
          }
        }'
      ```


你也可以只鎖定部分欄位，詳情請參閱 [SDK 文件](https://googleapis.github.io/python-genai/genai.html#genai.types.CreateAuthTokenConfig.lock_additional_fields)。

## 使用短期 token 連線至 Live API {#connect-live-api}

取得短期 token 後，你可以將它當作 API 金鑰使用（但請記住，它僅適用於 Live API，且僅適用於 API 的 `v1beta` 版本）。

短期 token 只有在部署採用[用戶端到伺服器實作方式](/docs/live-api/#implementation-approach)的應用程式時，才能發揮價值。


=== "JavaScript"

      ```javascript
      import { GoogleGenAI, Modality } from '@google/genai';

      // Use the token generated in the "Create an ephemeral token" section here
      const ai = new GoogleGenAI({
        httpOptions: { apiVersion: "v1beta" },
        apiKey: token.name
      });
      const model = 'gemini-3.8-live';
      const config = { responseModalities: [Modality.AUDIO] };

      async function main() {

        const session = await ai.live.connect({
          model: model,
          config: config,
          callbacks: { ... },
        });

        // Send content...

        session.close();
      }

      await main();
      ```


!!! note " "

      若未使用 SDK，請注意，短期 token 必須以 `access_token` 查詢參數傳入，或放在 HTTP `Authorization` 中，並以 `Token` [auth-scheme](https://datatracker.ietf.org/doc/html/rfc7235#section-2.1) 為前綴。


更多範例請參閱[開始使用 Live API](/docs/live-api/)。

## 最佳做法 {#best-practices}

*   使用 `expire_time` 參數設定較短的到期時間。
*   token 到期後，必須重新啟動佈建流程。
*   請確認你自己的後端採用安全的驗證方式。短期 token 的安全性僅與你的後端驗證方法相當。
*   一般而言，請避免將短期 token 用於後端到 Gemini 的連線，因為這條路徑通常被視為安全。

## 限制 {#limitations}

目前，短期 token 僅與 [Live API](/docs/live-api/) 相容。

## 後續步驟 {#whats-next}

*   閱讀 Live API [參考文件](/api-reference/live/#ephemeral-auth-tokens)中關於短期 token 的說明，以取得更多資訊。
