# Webhooks


!!! note " "

      此功能目前為[預覽版](/docs/models/#preview)。


Webhook 讓 Gemini API 能在非同步操作或長時間執行操作（LRO）完成時，將即時通知推送到您的伺服器。如此一來，您無須再輪詢 API 查詢狀態更新，可降低延遲與額外負擔。

[Batch](/docs/batch-api/) 工作、[Interactions](/docs/interactions-overview/) 與[影片生成](/docs/video/)等操作都可使用 webhook。

## 運作方式 {#how-it-works}

您無須反覆輪詢 `GET /operations` 來確認工作是否完成，只要設定 Gemini API Webhook，事件一觸發便會立即向您的監聽 URL 送出 HTTP POST 請求。

Gemini API 提供兩種設定 webhook 的方式：

* [**靜態 webhook**](/docs/webhooks/#static-webhooks)：專案層級的端點，透過 Gemini [WebhookService API](/api-reference/webhooks/) 設定。適合全域整合（例如通知 Slack、同步資料庫）。

* [**動態 webhook**](/docs/webhooks/#dynamic-webhooks)：請求層級的覆寫設定，在特定工作呼叫的設定 payload 中傳入 webhook URL。適合將特定工作導向專屬端點。


## 靜態 webhook {#static-webhooks}

靜態 webhook 會為整個[專案](/docs/api-key/#google-cloud-projects)註冊，並在任何符合的事件發生時觸發。

### 建立 webhook {#create-webhook}

您可以使用 SDK 或 REST API 建立端點。

**重要**：建立 webhook 時，API 回傳的**簽署密鑰**只會出現**一次**。請務必將它安全儲存（例如存放在環境變數中），以便日後驗證簽章。若遺失簽署密鑰，您必須將它[輪替](/docs/webhooks/#rotate-signing-secret)。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      webhook = client.webhooks.create(
          name="MyBatchWebhook",
          subscribed_events=["batch.succeeded", "batch.failed"],
          uri="https://my-api.com/gemini-callback",
      )

      # Store webhook.new_signing_secret securely
      webhook_secret = webhook.new_signing_secret
      print(f"Created webhook: {webhook.name}, {webhook.id}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      async function createWebhook() {
        const webhook = await client.webhooks.create({
          name: "MyBatchWebhook",
          subscribed_events: ["batch.succeeded", "batch.failed"],
          uri: "https://my-api.com/gemini-callback",
        });

        // Store webhook.signingSecret securely
        const webhookSecret = webhook.new_signing_secret;
        console.log(`Created webhook: ${webhook.name}, ${webhook.id}`);
      }

      await createWebhook();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.webhooks.Webhook;
      import com.google.genai.gaos.models.webhooks.WebhookInput;
      import com.google.genai.gaos.models.webhooks.WebhookSubscribedEvent;
      import java.util.Arrays;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      WebhookInput input =
          WebhookInput.builder()
              .name("MyBatchWebhook")
              .subscribedEvents(
                  Arrays.asList(
                      WebhookSubscribedEvent.BATCH_SUCCEEDED, WebhookSubscribedEvent.BATCH_FAILED))
              .uri("https://my-api.com/gemini-callback")
              .build();

      Webhook webhook = client.webhooks.create(input).webhook().get();

      // Store webhook.newSigningSecret() securely
      String webhookSecret = webhook.newSigningSecret().orElse("");
      System.out.println(
          "Created webhook: " + webhook.name().orElse("") + ", " + webhook.id().orElse(""));
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
          "google.golang.org/genai/interactions/models/webhooks"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Webhooks.Create(ctx, operations.CreateWebhookRequest{
              Body: webhooks.WebhookInput{
                  Name: genai.Ptr("MyBatchWebhook"),
                  SubscribedEvents: []webhooks.WebhookSubscribedEvent{
                      webhooks.WebhookSubscribedEventBatchSucceeded,
                      webhooks.WebhookSubscribedEventBatchFailed,
                  },
                  URI: "https://my-api.com/gemini-callback",
              },
          })
          if err != nil {
              log.Fatal(err)
          }

          webhook := res.Webhook
          // Store webhook.GetNewSigningSecret() securely
          _ = webhook.GetNewSigningSecret()
          fmt.Printf("Created webhook: %v, %v\n", webhook.GetName(), webhook.GetID())
      }
      ```

=== "REST"

      ```shell
      curl -X POST \
        "https://generativelanguage.googleapis.com/v1beta/webhooks" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
          "name": "MyBatchWebhook",
          "uri": "https://my-api.com/gemini-callback",
          "subscribed_events": ["batch.succeeded", "batch.failed"]
        }'
      ```

=== "CLI"

      ```bash
      gemini-api webhooks create \
        --name MyBatchWebhook \
        --uri https://my-api.com/gemini-callback \
        --subscribed-events '["batch.succeeded","batch.failed"]'
      ```


如需瞭解如何設定伺服器以接收資料，請參閱[處理 webhook 請求](/docs/webhooks/#handle-webhook-requests)一節。

### 取得 webhook {#get-webhook}

透過資源名稱取得特定 webhook 的詳細資訊。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      webhook = client.webhooks.get(id="")

      print(f"Webhook: {webhook.name}")
      print(f"URI: {webhook.uri}")
      print(f"Events: {webhook.subscribed_events}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } }); // Assumes process.env.GEMINI_API_KEY is set

      async function getWebhook() {
        const webhook = await client.webhooks.get("");

        console.log(`Webhook: ${webhook.name}`);
        console.log(`URI: ${webhook.uri}`);
        console.log(`Events: ${webhook.subscribed_events}`);
      }

      await getWebhook();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.webhooks.Webhook;
      import java.util.Collections;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      Webhook webhook = client.webhooks.get("<your_webhook_id>").webhook().get();

      System.out.println("Webhook: " + webhook.name().orElse(""));
      System.out.println("URI: " + webhook.uri().orElse(""));
      System.out.println("Events: " + webhook.subscribedEvents().orElse(Collections.emptyList()));
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
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Webhooks.Get(ctx, operations.GetWebhookRequest{
              ID: "<your_webhook_id>",
          })
          if err != nil {
              log.Fatal(err)
          }

          webhook := res.Webhook
          if webhook.Name != nil {
              fmt.Printf("Webhook: %s\n", *webhook.Name)
          }
          fmt.Printf("URI: %s\n", webhook.URI)
          fmt.Printf("Events: %v\n", webhook.SubscribedEvents)
      }
      ```

=== "REST"

      ```shell
      curl -X GET \
        "https://generativelanguage.googleapis.com/v1beta/webhooks/" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "CLI"

      ```bash
      gemini-api webhooks get YOUR_WEBHOOK_ID
      ```


### 列出 webhook {#list-webhooks}

列出目前專案已設定的所有 webhook，並可選擇分頁。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      webhooks = client.webhooks.list()

      for wh in webhooks:
          print(f"{wh.id}: {wh.name} -> {wh.uri}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      async function listWebhooks() {
        const webhooks = await client.webhooks.list();

        for (const wh of webhooks.webhooks || []) {
          console.log(`${wh.id}: ${wh.name} -> ${wh.uri}`);
        }
      }

      await listWebhooks();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.webhooks.Webhook;
      import com.google.genai.gaos.models.webhooks.WebhookListResponse;
      import java.util.Collections;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      WebhookListResponse response =
          client.webhooks.listDirect().webhookListResponse().orElse(new WebhookListResponse());

      for (Webhook wh : response.webhooks().orElse(Collections.emptyList())) {
        System.out.println(
            wh.id().orElse("") + ": " + wh.name().orElse("") + " -> " + wh.uri().orElse(""));
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
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Webhooks.List(ctx, operations.ListWebhooksRequest{})
          if err != nil {
              log.Fatal(err)
          }

          if res.WebhookListResponse != nil {
              for _, wh := range res.WebhookListResponse.Webhooks {
                  fmt.Printf("%v: %v -> %s\n", wh.GetID(), wh.GetName(), wh.URI)
              }
          }
      }
      ```

=== "REST"

      ```shell
      curl -X GET \
        "https://generativelanguage.googleapis.com/v1beta/webhooks" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "CLI"

      ```bash
      gemini-api webhooks list
      ```


### 更新 webhook {#update-webhook}

更新既有 webhook 的屬性，例如顯示名稱、目標 URI 或訂閱的事件。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      updated_webhook = client.webhooks.update(
          id="",
          subscribed_events=["batch.succeeded", "batch.failed", "batch.cancelled"],
      )

      print(f"Updated webhook: {updated_webhook.name}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      async function updateWebhook() {
        const updatedWebhook = await client.webhooks.update(
          "",
          {
            subscribed_events: ["batch.succeeded", "batch.failed", "batch.cancelled"],
          }
        );

        console.log(`Updated webhook: ${updatedWebhook.name}`);
      }

      await updateWebhook();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.webhooks.Webhook;
      import com.google.genai.gaos.models.webhooks.WebhookUpdate;
      import com.google.genai.gaos.models.webhooks.WebhookUpdateSubscribedEvent;
      import java.util.Arrays;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      WebhookUpdate updateBody =
          WebhookUpdate.builder()
              .subscribedEvents(
                  Arrays.asList(
                      WebhookUpdateSubscribedEvent.BATCH_SUCCEEDED,
                      WebhookUpdateSubscribedEvent.BATCH_FAILED,
                      WebhookUpdateSubscribedEvent.of("batch.cancelled")))
              .build();

      Webhook updatedWebhook =
          client.webhooks
              .update()
              .id("<your_webhook_id>")
              .updateMask("subscribed_events")
              .body(updateBody)
              .call()
              .webhook()
              .get();

      System.out.println("Updated webhook: " + updatedWebhook.name().orElse(""));
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
          "google.golang.org/genai/interactions/models/webhooks"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Webhooks.Update(ctx, operations.UpdateWebhookRequest{
              ID:         "<your_webhook_id>",
              UpdateMask: genai.Ptr("subscribed_events"),
              Body: &webhooks.WebhookUpdate{
                  SubscribedEvents: []webhooks.WebhookUpdateSubscribedEvent{
                      webhooks.WebhookUpdateSubscribedEventBatchSucceeded,
                      webhooks.WebhookUpdateSubscribedEventBatchFailed,
                      webhooks.WebhookUpdateSubscribedEvent("batch.cancelled"),
                  },
              },
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Webhook.Name != nil {
              fmt.Printf("Updated webhook: %s\n", *res.Webhook.Name)
          }
      }
      ```

=== "REST"

      ```shell
      curl -X PATCH \
        "https://generativelanguage.googleapis.com/v1beta/webhooks/" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
          "subscribed_events": ["batch.succeeded", "batch.failed", "batch.cancelled"]
        }'
      ```

=== "CLI"

      ```bash
      gemini-api webhooks update YOUR_WEBHOOK_ID \
        --subscribed-events '["batch.succeeded","batch.failed","batch.expired"]'
      ```


### 刪除 webhook {#delete-webhook}

將 webhook 端點從專案中移除，該端點之後便不再接收事件傳遞。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      client.webhooks.delete(id="")

      print("Webhook deleted.")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      async function deleteWebhook() {
        await client.webhooks.delete("");

        console.log("Webhook deleted.");
      }

      await deleteWebhook();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      client.webhooks.delete("<your_webhook_id>");

      System.out.println("Webhook deleted.");
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
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          _, err = client.Webhooks.Delete(ctx, operations.DeleteWebhookRequest{
              ID: "<your_webhook_id>",
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println("Webhook deleted.")
      }
      ```

=== "REST"

      ```shell
      curl -X DELETE \
        "https://generativelanguage.googleapis.com/v1beta/webhooks/" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```

=== "CLI"

      ```bash
      gemini-api webhooks delete YOUR_WEBHOOK_ID
      ```


### 輪替簽署密鑰 {#rotate-signing-secret}

輪替 webhook 的簽署密鑰。您可以設定先前有效的密鑰是立即撤銷，或在 24 小時寬限期後才撤銷。

**重要**：新的簽署密鑰在輪替時只會回傳**一次**。請先將它安全儲存，再更新您的驗證邏輯。


=== "Python"

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client(http_options={"api_version": "v1beta"})

      response = client.webhooks.rotate_signing_secret(
          id="",
          revocation_behavior="revoke_previous_secrets_after_h24",
      )

      # Store response.secret securely, then update your server's verification config
      print("New signing secret generated. Update your server configuration.")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      async function rotateSigningSecret() {
        const response = await client.webhooks.rotateSigningSecret(
          "",
          {
            revocation_behavior: "revoke_previous_secrets_after_h24",
          }
        );

        // Store response.secret securely, then update your server's verification config
        console.log("New signing secret generated. Update your server configuration.");
      }

      await rotateSigningSecret();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.webhooks.RevocationBehavior;
      import com.google.genai.gaos.models.webhooks.RotateSigningSecretRequest;
      import com.google.genai.gaos.models.webhooks.WebhookRotateSigningSecretResponse;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      RotateSigningSecretRequest requestBody =
          RotateSigningSecretRequest.builder()
              .revocationBehavior(RevocationBehavior.REVOKE_PREVIOUS_SECRETS_AFTER_H24)
              .build();

      WebhookRotateSigningSecretResponse response =
          client.webhooks
              .rotateSigningSecret()
              .id("<your_webhook_id>")
              .body(requestBody)
              .call()
              .webhookRotateSigningSecretResponse()
              .get();

      // Store response.secret() securely, then update your server's verification config
      String newSecret = response.secret().orElse("");
      System.out.println("New signing secret generated. Update your server configuration.");
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
          "google.golang.org/genai/interactions/models/webhooks"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Webhooks.RotateSigningSecret(ctx, operations.RotateSigningSecretRequest{
              ID: "<your_webhook_id>",
              Body: &webhooks.RotateSigningSecretRequest{
                  RevocationBehavior: webhooks.RevocationBehaviorRevokePreviousSecretsAfterH24.ToPointer(),
              },
          })
          if err != nil {
              log.Fatal(err)
          }

          // Store res.WebhookRotateSigningSecretResponse.GetSecret() securely, then update your server's verification config
          _ = res.WebhookRotateSigningSecretResponse.GetSecret()
          fmt.Println("New signing secret generated. Update your server configuration.")
      }
      ```

=== "REST"

      ```shell
      curl -X POST \
        "https://generativelanguage.googleapis.com/v1beta/webhooks//rotate_secret" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -d '{
          "revocation_behavior": "revoke_previous_secrets_after_h24"
        }'
      ```

=== "CLI"

      ```bash
      gemini-api webhooks rotate-signing-secret YOUR_WEBHOOK_ID \
        --revocation-behavior revoke_previous_secrets_after_h24
      ```


### 在伺服器上處理 webhook 請求 {#handle-webhook-requests}

當您訂閱的事件發生時，您的 webhook URL 會收到 HTTP POST 請求。您的端點必須在數秒內回應 2xx 狀態碼，以免觸發重試。為確保傳遞成功，Gemini API 會以指數退避方式，在 24 小時內自動重試失敗的請求。

Gemini 在安全標頭方面嚴格遵循 [Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks) 規格。請在伺服器上使用已簽署的標頭簽章，以及您儲存的靜態簽署密鑰來驗證 payload。payload 的相關資訊請參閱 [Webhook 信封結構](/docs/webhooks/#webhook-envelope)一節。

以下是以 Flask 作為 HTTP 監聽器的範例：


=== "Python"

      ```python
      # pip install flask standardwebhooks
      import os
      from flask import Flask, request, jsonify
      # Standard verification wrapper for Standard Webhook Headers
      from standardwebhooks.webhooks import Webhook, WebhookVerificationError

      app = Flask(__name__)

      SIGNING_SECRET = os.environ.get('WEBHOOK_SIGNING_SECRET')

      @app.route('/gemini-callback', methods=['POST'])
      def gemini_callback():
          payload = request.get_data(as_text=True)
          headers = request.headers

          try:
              wh = Webhook(SIGNING_SECRET)
              event = wh.verify(payload, headers)
          except WebhookVerificationError as e:
              return jsonify({"error": "Signature invalid"}), 400

          # Process thin payload contents
          if event.get("type") == "batch.succeeded":
              print(f"Batch completed! ID: {event['data']['id']}")
              if event["data"].get("output_file_uri"):
                  # For batch jobs with input file
                  print(f"Batch file: {event['data']['output_file_uri']}")
          elif event.get("type") == "interaction.completed":
              print(f"Interaction completed! ID: {event['data']['id']}")
          elif event.get("type") == "video.generated":
              print(f"Video generated! URI: {event['data']['output_file_uri']}")

          return jsonify({"status": "received"}), 200

      if __name__ == "__main__":
          app.run(port=8000)
      ```

=== "JavaScript"

      ```javascript
      // npm install standardwebhooks
      import { GoogleGenAI } from "@google/genai";
      import { Webhook } from "standardwebhooks";
      import express from "express";

      const app = express();
      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      // Don't use express.json() because signature verification needs the raw text body
      app.use(express.text({ type: "application/json" }));

      app.post("/gemini-callback", async (req, res) => {
        const payload = req.body;
        const headers = req.headers;

        try {
          const wh = new Webhook(process.env.WEBHOOK_SIGNING_SECRET || "");
          const event = wh.verify(payload, headers);
          console.log(`Event type: ${event.type}, data: ${JSON.stringify(event.data)}`);

                // Process thin payload contents
                if (event.type === "batch.succeeded") {
                    console.log(`Batch completed! ID: ${event.data.id}`);
                    if (event.data.output_file_uri) {
                        // For batch jobs with input file
                        console.log(`Batch file: ${event.data.output_file_uri}`);
                    }
                } else if (event.type === "interaction.completed") {
                    console.log(`Interaction completed! ID: ${event.data.id}`);
                } else if (event.type === "video.generated") {
                    console.log(`Video generated! URI: ${event.data.output_file_uri}`);
                }

                res.status(200).json({ status: "received" });
            } catch (e) {
                console.error("Webhook verification failed:", e);
                res.status(400).send("Invalid signature");
            }
      });

      app.listen(8000, () => {
        console.log("Webhook server is running on port 8000");
      });
      ```

=== "Java"

      ```java
      import com.sun.net.httpserver.HttpServer;
      import java.io.OutputStream;
      import java.net.InetSocketAddress;
      import java.nio.charset.StandardCharsets;
      import java.util.Base64;
      import java.util.regex.Matcher;
      import java.util.regex.Pattern;
      import javax.crypto.Mac;
      import javax.crypto.spec.SecretKeySpec;

      String signingSecret = System.getenv("WEBHOOK_SIGNING_SECRET");

      HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);
      server.createContext(
          "/gemini-callback",
          exchange -> {
            String payload =
                new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            String msgId = exchange.getRequestHeaders().getFirst("webhook-id");
            String msgTimestamp = exchange.getRequestHeaders().getFirst("webhook-timestamp");
            String msgSignature = exchange.getRequestHeaders().getFirst("webhook-signature");

            try {
              String toSign = msgId + "." + msgTimestamp + "." + payload;
              Mac mac = Mac.getInstance("HmacSHA256");
              byte[] secretBytes =
                  Base64.getDecoder().decode(signingSecret.replaceFirst("^whsec_", ""));
              mac.init(new SecretKeySpec(secretBytes, "HmacSHA256"));
              String expectedSig =
                  "v1,"
                      + Base64.getEncoder()
                          .encodeToString(mac.doFinal(toSign.getBytes(StandardCharsets.UTF_8)));

              if (msgSignature == null || !msgSignature.contains(expectedSig)) {
                byte[] resp = "{\"error\": \"Signature invalid\"}".getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(400, resp.length);
                try (OutputStream os = exchange.getResponseBody()) {
                  os.write(resp);
                }
                return;
              }

              Matcher typeMatcher = Pattern.compile("\"type\"\\s*:\\s*\"([^\"]+)\"").matcher(payload);
              String type = typeMatcher.find() ? typeMatcher.group(1) : "";

              Matcher idMatcher = Pattern.compile("\"id\"\\s*:\\s*\"([^\"]+)\"").matcher(payload);
              String id = idMatcher.find() ? idMatcher.group(1) : "";

              Matcher uriMatcher =
                  Pattern.compile("\"output_file_uri\"\\s*:\\s*\"([^\"]+)\"").matcher(payload);
              String outputFileUri = uriMatcher.find() ? uriMatcher.group(1) : "";

              if ("batch.succeeded".equals(type)) {
                System.out.println("Batch completed! ID: " + id);
                if (!outputFileUri.isEmpty()) {
                  System.out.println("Batch file: " + outputFileUri);
                }
              } else if ("interaction.completed".equals(type)) {
                System.out.println("Interaction completed! ID: " + id);
              } else if ("video.generated".equals(type)) {
                System.out.println("Video generated! URI: " + outputFileUri);
              }

              byte[] resp = "{\"status\": \"received\"}".getBytes(StandardCharsets.UTF_8);
              exchange.sendResponseHeaders(200, resp.length);
              try (OutputStream os = exchange.getResponseBody()) {
                os.write(resp);
              }
            } catch (Exception e) {
              exchange.sendResponseHeaders(400, -1);
            }
          });
      server.start();
      ```

=== "Go"

      ```go
      package main

      import (
          "crypto/hmac"
          "crypto/sha256"
          "encoding/base64"
          "encoding/json"
          "fmt"
          "io"
          "log"
          "net/http"
          "os"
          "strings"

      )

      func main() {
          signingSecret := os.Getenv("WEBHOOK_SIGNING_SECRET")

          http.HandleFunc("/gemini-callback", func(w http.ResponseWriter, r *http.Request) {
              payloadBytes, err := io.ReadAll(r.Body)
              if err != nil {
                  http.Error(w, `{"error": "Failed to read body"}`, http.StatusBadRequest)
                  return
              }
              payload := string(payloadBytes)
              msgID := r.Header.Get("webhook-id")
              msgTimestamp := r.Header.Get("webhook-timestamp")
              msgSignature := r.Header.Get("webhook-signature")

              secretBytes, err := base64.StdEncoding.DecodeString(strings.TrimPrefix(signingSecret, "whsec_"))
              if err != nil {
                  http.Error(w, `{"error": "Invalid secret"}`, http.StatusBadRequest)
                  return
              }

              toSign := fmt.Sprintf("%s.%s.%s", msgID, msgTimestamp, payload)
              mac := hmac.New(sha256.New, secretBytes)
              mac.Write([]byte(toSign))
              expectedSig := "v1," + base64.StdEncoding.EncodeToString(mac.Sum(nil))

              if msgSignature == "" || !strings.Contains(msgSignature, expectedSig) {
                  http.Error(w, `{"error": "Signature invalid"}`, http.StatusBadRequest)
                  return
              }

              var event struct {
                  Type string `json:"type"`
                  Data struct {
                      ID            string `json:"id"`
                      OutputFileURI string `json:"output_file_uri"`
                  } `json:"data"`
              }
              _ = json.Unmarshal(payloadBytes, &event)

              switch event.Type {
              case "batch.succeeded":
                  fmt.Printf("Batch completed! ID: %s\n", event.Data.ID)
                  if event.Data.OutputFileURI != "" {
                      fmt.Printf("Batch file: %s\n", event.Data.OutputFileURI)
                  }
              case "interaction.completed":
                  fmt.Printf("Interaction completed! ID: %s\n", event.Data.ID)
              case "video.generated":
                  fmt.Printf("Video generated! URI: %s\n", event.Data.OutputFileURI)
              }

              w.Header().Set("Content-Type", "application/json")
              w.WriteHeader(http.StatusOK)
              _, _ = w.Write([]byte(`{"status": "received"}`))
          })

          log.Fatal(http.ListenAndServe(":8000", nil))
      }
      ```


## 動態 webhook {#dynamic-webhooks}

動態 webhook 可將 webhook 端點綁定到**特定請求設定**，非常適合代理協調佇列。動態 webhook 採用非對稱公鑰 JWKS 簽章，而非對稱密鑰。

### 提交動態請求 {#submit-dynamic-request}

觸發非同步工作（例如建立 Batch）時，加入 `webhook_config`。


=== "Python"

      ```python
      # This will only work for SDK newer than 2.0.0
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      response = client.interactions.create(
          model='gemini-4-hydrogen',
          input='Tell me a short joke about programming.',
          background=True, # Required when webhook_config is specified
          webhook_config={
              'uris': ["https://my-api.com/gemini-webhook-dynamic"],
              'user_metadata': {"job_group": "nightly-eval", "priority": "high"}
          }
      )

      print(f"Interaction created! ID: {response.id}")
      print(f"Status: {response.status}")
      ```

=== "JavaScript"

      ```javascript
      // This will only work for SDK newer than 2.0.0
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      async function createInteractionWithWebhook() {
        const response = await client.interactions.create({
          model: "gemini-4-hydrogen",
          input: "Tell me a short joke about programming.",
          background: true, // Required when webhook_config is specified
          webhook_config: {
            uris: ["https://my-api.com/gemini-webhook-dynamic"],
            user_metadata: { job_group: "nightly-eval", priority: "high" },
          },
        });

        console.log(`Interaction created! ID: ${response.id}`);
        console.log(`Status: ${response.status}`);
      }

      await createInteractionWithWebhook();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.HttpOptions;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionStatus;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.WebhookConfig;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.HashMap;
      import java.util.Map;

      Client client = Client.builder().httpOptions(HttpOptions.builder().apiVersion("v1beta").build()).build();

      Map<String, Object> userMetadata = new HashMap<>();
      userMetadata.put("job_group", "nightly-eval");
      userMetadata.put("priority", "high");

      WebhookConfig webhookConfig =
          WebhookConfig.builder()
              .uris(Arrays.asList("https://my-api.com/gemini-webhook-dynamic"))
              .userMetadata(userMetadata)
              .build();

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model("gemini-4-hydrogen")
              .input(InteractionsInput.of("Tell me a short joke about programming."))
              .background(true) // Required when webhookConfig is specified
              .webhookConfig(webhookConfig)
              .build();

      Interaction response =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println("Interaction created! ID: " + response.id().orElse(""));
      System.out.println(
          "Status: " + response.status().map(InteractionStatus::value).orElse(""));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, &genai.ClientConfig{HTTPOptions: genai.HTTPOptions{APIVersion: "v1beta"}})
          if err != nil {
              log.Fatal(err)
          }

          res, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(interactions.CreateModelInteraction{
                  Model:      interactions.Model("gemini-4-hydrogen"),
                  Input:      interactions.NewInteractionsInput("Tell me a short joke about programming."),
                  Background: genai.Ptr(true), // Required when WebhookConfig is specified
                  WebhookConfig: &interactions.WebhookConfig{
                      Uris: []string{"https://my-api.com/gemini-webhook-dynamic"},
                      UserMetadata: map[string]any{
                          "job_group": "nightly-eval",
                          "priority":  "high",
                      },
                  },
              }),
          })
          if err != nil {
              log.Fatal(err)
          }

          if res.Interaction.ID != nil {
              fmt.Printf("Interaction created! ID: %s\n", *res.Interaction.ID)
          }
          fmt.Printf("Status: %s\n", res.Interaction.Status)
      }
      ```

=== "REST"

      ```shell
      # Specifies the API revision to avoid breaking changes when they become default
      curl -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "Content-Type: application/json" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-hydrogen",
          "input": "Tell me a short joke about programming.",
          "background": true,
          "webhook_config": {
            "uris": ["https://my-api.com/gemini-webhook-dynamic"],
            "user_metadata": {"job_group": "nightly-eval", "priority": "high"}
          }
        }'
      ```

=== "CLI"

      ```bash
      gemini-api agent run "Tell me a short joke about programming." \
        -m gemini-4-hydrogen \
        --background --stream=false \
        --body '{"webhook_config": {
          "uris": ["https://my-api.com/gemini-webhook-dynamic"],
          "user_metadata": {"job_group": "nightly-eval", "priority": "high"}
        }}'
      ```


### 驗證動態簽章（JWKS）{#verify-dynamic-signatures}

動態 webhook 請求會附帶 JSON Web Token（JWT）簽章。您的監聽器必須擷取該簽章，並使用 [Google 的公開憑證端點](https://www.googleapis.com/oauth2/v3/certs)加以驗證。


=== "Python"

      ```python
      import jwt
      import requests
      from flask import Flask, request, jsonify

      app = Flask(__name__)

      # Google public cert list endpoint
      JWKS_URI = "https://generativelanguage.googleapis.com/.well-known/jwks.json"

      def load_google_public_key(kid):
          response = requests.get(JWKS_URI).json()
          for key_item in response.get('keys', []):
              if key_item.get('kid') == kid:
                  # Convert JWK to Cert wrapper
                  return jwt.algorithms.RSAAlgorithm.from_jwk(key_item)
          return None

      @app.route('/gemini-webhook-dynamic', methods=['POST'])
      def dynamic_handler():
          payload = request.get_data(as_text=True)
          headers = request.headers

          token = headers.get('Webhook-Signature')
          if not token:
              return jsonify({"error": "No signature header"}), 400

          try:
              # Extract kid from JWT header
              unverified_headers = jwt.get_unverified_header(token)
              pub_key = load_google_public_key(unverified_headers.get('kid'))

              if not pub_key:
                  return jsonify({"error": "Key cert not found"}), 400

              # Verify Signature against expected audience (e.g., your project client ID)
              event = jwt.decode(
                  token,
                  pub_key,
                  algorithms=["RS256"],
                  audience="your-configured-audience"
              )
          except Exception as e:
              return jsonify({"error": "Invalid Dynamic signature", "details": str(e)}), 400

          print("Verified Dynamic payload success.")
          return jsonify({"status": "received"}), 200
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import express from "express";
      import jwt from "jsonwebtoken";
      import jwksClient from "jwks-rsa";

      const app = express();
      app.use(express.text({ type: 'application/json' }));

      const client = jwksClient({
        jwksUri: "https://generativelanguage.googleapis.com/.well-known/jwks.json"
      });

      function getKey(header = { kid: "" }, callback = (err = null, key = "") => {}) {
        client.getSigningKey(header.kid, (err, key) => {
          const signingKey = key?.getPublicKey();
          callback(null, signingKey);
        });
      }

      app.post('/gemini-webhook-dynamic', (req, res) => {
        const token = req.headers['webhook-signature'];

        if (!token) {
          res.status(400).json({ error: "No signature header" });
          return;
        }

        jwt.verify(
          token,
          getKey,
          {
            algorithms: ["RS256"],
            audience: "your-configured-audience"
          },
          (err, decoded) => {
            if (err) {
              res.status(400).json({ error: "Invalid Dynamic signature", details: err.message });
              return;
            }

            console.log("Verified Dynamic payload success.");
            res.status(200).json({ status: "received" });
          }
        );
      });
      ```

=== "Java"

      ```java
      import com.sun.net.httpserver.HttpServer;
      import java.io.InputStream;
      import java.io.OutputStream;
      import java.math.BigInteger;
      import java.net.InetSocketAddress;
      import java.net.URI;
      import java.nio.charset.StandardCharsets;
      import java.security.KeyFactory;
      import java.security.PublicKey;
      import java.security.Signature;
      import java.security.spec.RSAPublicKeySpec;
      import java.util.Base64;
      import java.util.regex.Matcher;
      import java.util.regex.Pattern;

      String jwksUri = "https://generativelanguage.googleapis.com/.well-known/jwks.json";

      HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);
      server.createContext(
          "/gemini-webhook-dynamic",
          exchange -> {
            String token = exchange.getRequestHeaders().getFirst("Webhook-Signature");
            if (token == null || token.split("\\.").length != 3) {
              byte[] resp = "{\"error\": \"No signature header\"}".getBytes(StandardCharsets.UTF_8);
              exchange.sendResponseHeaders(400, resp.length);
              try (OutputStream os = exchange.getResponseBody()) {
                os.write(resp);
              }
              return;
            }

            try {
              String[] parts = token.split("\\.");
              String headerJson =
                  new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
              Matcher kidMatcher = Pattern.compile("\"kid\"\\s*:\\s*\"([^\"]+)\"").matcher(headerJson);
              String kid = kidMatcher.find() ? kidMatcher.group(1) : "";

              PublicKey pubKey = null;
              try (InputStream in = URI.create(jwksUri).toURL().openStream()) {
                String jwksJson = new String(in.readAllBytes(), StandardCharsets.UTF_8);
                Matcher keyBlockMatcher =
                    Pattern.compile(
                            "\\{[^}]*\"kid\"\\s*:\\s*\"" + Pattern.quote(kid) + "\"[^}]*\\}")
                        .matcher(jwksJson);
                if (keyBlockMatcher.find()) {
                  String keyBlock = keyBlockMatcher.group(0);
                  Matcher nMatcher = Pattern.compile("\"n\"\\s*:\\s*\"([^\"]+)\"").matcher(keyBlock);
                  Matcher eMatcher = Pattern.compile("\"e\"\\s*:\\s*\"([^\"]+)\"").matcher(keyBlock);
                  if (nMatcher.find() && eMatcher.find()) {
                    BigInteger n =
                        new BigInteger(1, Base64.getUrlDecoder().decode(nMatcher.group(1)));
                    BigInteger e =
                        new BigInteger(1, Base64.getUrlDecoder().decode(eMatcher.group(1)));
                    pubKey =
                        KeyFactory.getInstance("RSA").generatePublic(new RSAPublicKeySpec(n, e));
                  }
                }
              }

              Signature sig = Signature.getInstance("SHA256withRSA");
              sig.initVerify(pubKey);
              sig.update((parts[0] + "." + parts[1]).getBytes(StandardCharsets.UTF_8));
              boolean verified = sig.verify(Base64.getUrlDecoder().decode(parts[2]));

              if (!verified) {
                throw new SecurityException("Signature verification failed");
              }

              System.out.println("Verified Dynamic payload success.");
              byte[] resp = "{\"status\": \"received\"}".getBytes(StandardCharsets.UTF_8);
              exchange.sendResponseHeaders(200, resp.length);
              try (OutputStream os = exchange.getResponseBody()) {
                os.write(resp);
              }
            } catch (Exception e) {
              byte[] resp =
                  ("{\"error\": \"Invalid Dynamic signature\", \"details\": \""
                          + e.getMessage()
                          + "\"}")
                      .getBytes(StandardCharsets.UTF_8);
              exchange.sendResponseHeaders(400, resp.length);
              try (OutputStream os = exchange.getResponseBody()) {
                os.write(resp);
              }
            }
          });
      server.start();
      ```

=== "Go"

      ```go
      package main

      import (
          "crypto"
          "crypto/rsa"
          "crypto/sha256"
          "encoding/base64"
          "encoding/json"
          "fmt"
          "io"
          "log"
          "math/big"
          "net/http"
          "strings"

      )

      func main() {
          jwksURI := "https://generativelanguage.googleapis.com/.well-known/jwks.json"

          http.HandleFunc("/gemini-webhook-dynamic", func(w http.ResponseWriter, r *http.Request) {
              token := r.Header.Get("Webhook-Signature")
              parts := strings.Split(token, ".")
              if len(parts) != 3 {
                  http.Error(w, `{"error": "No signature header"}`, http.StatusBadRequest)
                  return
              }

              headerBytes, err := base64.RawURLEncoding.DecodeString(parts[0])
              if err != nil {
                  http.Error(w, `{"error": "Invalid header"}`, http.StatusBadRequest)
                  return
              }
              var header struct {
                  Kid string `json:"kid"`
              }
              _ = json.Unmarshal(headerBytes, &header)

              resp, err := http.Get(jwksURI)
              if err != nil {
                  http.Error(w, `{"error": "Failed to fetch JWKS"}`, http.StatusBadRequest)
                  return
              }
              defer resp.Body.Close()
              jwksBytes, _ := io.ReadAll(resp.Body)

              var jwks struct {
                  Keys []struct {
                      Kid string `json:"kid"`
                      N   string `json:"n"`
                      E   string `json:"e"`
                  } `json:"keys"`
              }
              _ = json.Unmarshal(jwksBytes, &jwks)

              var pubKey *rsa.PublicKey
              for _, k := range jwks.Keys {
                  if k.Kid == header.Kid {
                      nBytes, _ := base64.RawURLEncoding.DecodeString(k.N)
                      eBytes, _ := base64.RawURLEncoding.DecodeString(k.E)
                      pubKey = &rsa.PublicKey{
                          N: new(big.Int).SetBytes(nBytes),
                          E: int(new(big.Int).SetBytes(eBytes).Int64()),
                      }
                      break
                  }
              }
              if pubKey == nil {
                  http.Error(w, `{"error": "Matching key not found"}`, http.StatusBadRequest)
                  return
              }

              sigBytes, _ := base64.RawURLEncoding.DecodeString(parts[2])
              hashed := sha256.Sum256([]byte(parts[0] + "." + parts[1]))
              if err := rsa.VerifyPKCS1v15(pubKey, crypto.SHA256, hashed[:], sigBytes); err != nil {
                  http.Error(w, `{"error": "Invalid Dynamic signature"}`, http.StatusBadRequest)
                  return
              }

              fmt.Println("Verified Dynamic payload success.")
              w.Header().Set("Content-Type", "application/json")
              w.WriteHeader(http.StatusOK)
              _, _ = w.Write([]byte(`{"status": "received"}`))
          })

          log.Fatal(http.ListenAndServe(":8000", nil))
      }
      ```


## Webhook 信封結構 {#webhook-envelope}

為避免頻寬壅塞，Gemini webhook 採用**精簡 payload** 模型來傳遞資料。每次傳遞會送出包含狀態詳細資訊與結果指標的快照，而不是原始輸出檔案本身。

以下是 payload 格式範例：

```json
{
  "type": "batch.succeeded",
  "version": "v1",
  "timestamp": "2026-01-22T12:00:00Z",
  "data": {
    "id": "batch_123456",
    "output_file_uri": "gs://my-bucket/results.jsonl"
  }
}
```

## 事件目錄參考 {#event-catalog}

下列事件會由支援的工作觸發：

| 事件類型 | 觸發時機 | Payload 項目（`data`） |
| :--- | :--- | :--- |
| `batch.succeeded` | 處理成功完成。 | `id`、`output_file_uri` |
| `batch.cancelled` | 使用者取消了請求 | `id` |
| `batch.expired` | 批次在 24 小時內尚未處理完成 | `id` |
| `batch.failed` | 批次工作失敗（系統或驗證錯誤）。 | `id`、`error_code`、`error_message` |
| `interaction.requires_action` | 函式呼叫，使用者需要採取行動 | `id` |
| `interaction.completed` | Interactions API 中的 LRO 成功 | `id` |
| `interaction.failed` | Interactions API 中的 LRO 失敗（系統或驗證錯誤）。 | `id`、`error_code`、`error_message` |
| `interaction.cancelled` | Interactions API 中的 LRO 已取消 | `id` |
| `video.generated` | 影片生成 LRO 完成。 | `id`、`output_file_uri`、`file_name` |

## 最佳實務 {#best-practices}

為確保運作可靠且可擴充：

* **嚴格的重放保護檢查**：所有請求都帶有 `webhook-timestamp` 標頭。請務必在伺服器設定層驗證此時間戳記，拒絕超過 **5 分鐘**的 payload（以防範重放攻擊）。

* **非同步處理**：一旦偵測到有效簽章，立即回應 `2xx OK`，並在內部將解析操作排入佇列。監聽器占用時間過長會觸發傳遞重試週期。

* **去重複處理**：Standard Webhooks 採用「至少一次」（At-least-once）傳遞。在壅塞程度較高的流程中，請使用一致的 `webhook-id` 標頭來處理可能出現的重複項目。


## 後續步驟 {#whats-next}

* [Batch API](/docs/batch-api/)：運用 webhook 將大流量端點自動化。
