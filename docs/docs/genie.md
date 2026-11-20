# 使用 Genie 4 生成互動世界

Genie 4（`models/genie-4`）可透過 [Interactions API](/docs/interactions-overview/) 生成連續的互動式 `16:9` 世界，以 `24 fps` 播放，並搭配同步的 `48 kHz` 立體聲音訊。與使用 [Gemini Omni 1.2 Flash](/docs/omni/) 的離線片段生成不同，Genie 4 會即時回應鍵盤移動（`WASD` 與方向鍵）與你在串流中途傳送的自然語言事件，即時算繪畫面。

[在 Google AI Studio 中試用 Genie 4](https://aistudio.google.com/live?model=genie-4)


!!! note " "

      Genie 4 需要[付費方案 Gemini API 金鑰](/docs/pricing/#genie-4)，計費方式為每幀 `240` 個影片輸出 token（`24 fps` 下每秒 `5,760` 個 token，含立體聲音訊約每秒 `~$0.10/sec`）。離開本機區塊或關閉瀏覽器分頁只會中斷傳輸，不會立即停止伺服器端的生成。請務必呼叫 `complete()` 結束工作階段並停止計費。


!!! note " "

      **區域服務延遲**： Genie 4 由位於美國、西歐與日本的資料中心提供服務。在北美洲、西歐與中歐、東亞可獲得最佳回應速度（往返延遲 `< 150 ms`）。在這些區域之外，較高的延遲會拖慢即時鍵盤操控並可能降低影格率。請盡可能將後端中繼部署在服務區域附近，並在部署反應靈敏的控制功能前，先從目標區域測試瀏覽器 WebRTC 延遲。


## 快速入門：走進一幅栩栩如生的油畫 {#quickstart}

每個 Genie 4 工作階段在 `v1beta` 上都遵循四步驟生命週期：

1.  **在伺服器上建立互動**（`interactions.create`，搭配 `model: 'models/genie-4'`）。若是瀏覽器用戶端，請核發單次工作階段的暫時 token（`interactions.authTokens.create(interaction.id)`），讓長期有效的 `GEMINI_API_KEY` 絕不離開後端。
2.  **連接即時工作階段**（`interactions.connect`），透過 **WebRTC**（瀏覽器應用程式）或 **WebSocket**（Python、Node.js 或瀏覽器應用程式）。
3.  **設定並操控世界**，先傳送一個 `world_setup` 事件，再傳送 `user_action` 移動事件（`WASD`／方向鍵）或 `input` 文字事件。
4.  **完成工作階段**（完成時執行 `await session.complete()`），讓伺服器端生成與計費乾淨地終止。

請安裝最新版 `google-genai`（Python）或 `@google/genai`（JavaScript/TypeScript）SDK：


=== "JavaScript"

      WebRTC 是建議的瀏覽器傳輸方式。瀏覽器會將傳入的 Opus 音訊與視訊軌道原生解碼到 `<video autoplay playsinline>` 元素上，並以適應性抖動緩衝播放，而 JSON 控制事件則透過 SCTP 資料通道傳輸。

      **後端端點（Node.js）** — 建立互動並核發 `auth_tokens/...` 工作階段 token：

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const serverAi = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        apiVersion: 'v1beta',
      });

      export async function createWorldSession() {
        const interaction = await serverAi.interactions.create({
          model: 'models/genie-4',
          api_version: 'v1beta',
        });
        const { auth_token } = await serverAi.interactions.authTokens.create(
          interaction.id,
          { api_version: 'v1beta' }
        );
        // Return ONLY { interactionId, authToken } to the browser
        return { interactionId: interaction.id, authToken: auth_token };
      }
      ```

      **瀏覽器用戶端** — 以 `{ transport: 'webrtc' }` 連接，綁定原生 `WASD`／方向鍵移動功能，以及自訂的 `E`／`Q` 世界切換按鍵，並在結束時停止計費：

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      const WORLD_PROMPT =
        'Immersive first-person POV standing on a cobblestone canal bridge inside ' +
        'a vibrant, thick-impasto post-impressionist oil painting of a starry ' +
        'riverside village at twilight. Swirling cobalt-blue sky currents and ' +
        'glowing golden cafe lanterns shimmer with living, tactile brushstroke ' +
        'textures that ripple gently in the breeze, with a wooden rowboat moored ' +
        'at the stone steps ahead. Audio: Gentle water lapping against the stone ' +
        'steps, leaves rustling in a soft evening breeze, footsteps on cobblestone.';

      // Native movement & camera keys trained directly into Genie 4
      const NATIVE_KEY_MAP = {
        KeyW: 'key_w',
        KeyA: 'key_a',
        KeyS: 'key_s',
        KeyD: 'key_d',
        ArrowUp: 'arrow_up',
        ArrowDown: 'arrow_down',
        ArrowLeft: 'arrow_left',
        ArrowRight: 'arrow_right',
      };

      // Custom gameplay verbs mapped on the client to mid-session text inputs
      const CUSTOM_KEY_PROMPTS = {
        KeyE: 'Make heavy snow fall across the painted village',
        KeyQ: 'Burst bright golden fireworks above the village rooftops',
      };

      async function startWorld(interactionId, authToken, videoElement) {
        const clientAi = new GoogleGenAI({ apiKey: authToken, apiVersion: 'v1beta' });
        const session = await clientAi.interactions.connect(
          interactionId,
          { transport: 'webrtc', api_version: 'v1beta' },
          { timeout_ms: 30000 }
        );

        // Attach <video id="world-video" autoplay playsinline></video>
        session.transport.setVideoElement(videoElement);

        // Consume server lifecycle and error events in the background
        (async () => {
          for await (const event of session.receive()) {
            if (event.event_type === 'error') {
              console.error('Genie 4 stream error:', event.error);
            }
          }
        })();

        // Seed the world (initial generation takes ~5-9 seconds before frame 1)
        await session.send({
          event_type: 'world_setup',
          world_prompt: { text: WORLD_PROMPT },
        });

        // Helper: repeat mid-session text prompts briefly so the next world step picks them up
        function triggerWorldEvent(promptText) {
          let sent = 0;
          const timer = setInterval(() => {
            session.send(promptText).catch(() => clearInterval(timer));
            if (++sent >= 10) clearInterval(timer);
          }, 150);
        }

        window.addEventListener('keydown', (e) => {
          if (e.repeat) return;
          if (NATIVE_KEY_MAP[e.code]) {
            session.send({
              event_type: 'user_action',
              action: 'key_down',
              input: NATIVE_KEY_MAP[e.code],
            });
          } else if (CUSTOM_KEY_PROMPTS[e.code]) {
            triggerWorldEvent(CUSTOM_KEY_PROMPTS[e.code]);
          }
        });

        window.addEventListener('keyup', (e) => {
          if (NATIVE_KEY_MAP[e.code]) {
            session.send({
              event_type: 'user_action',
              action: 'key_up',
              input: NATIVE_KEY_MAP[e.code],
            });
          }
        });

        return {
          stop: async () => {
            await session.complete();
          },
        };
      }
      ```

=== "Python"

      Python SDK 透過 WebSocket 以非同步方式連接（`client.aio.interactions.connect`），並產生包含 base64 編碼 `JPEG` 視訊影格與 `48 kHz` 16 位元立體聲 PCM 音訊區塊的 `step.delta` 事件。

      ```python
      import asyncio
      import base64
      import wave
      from google import genai

      WORLD_PROMPT = (
          "Immersive first-person POV standing on a cobblestone canal bridge inside "
          "a vibrant, thick-impasto post-impressionist oil painting of a starry "
          "riverside village at twilight. Swirling cobalt-blue sky currents and "
          "glowing golden cafe lanterns shimmer with living, tactile brushstroke "
          "textures that ripple gently in the breeze, with a wooden rowboat moored "
          "at the stone steps ahead. Audio: Gentle water lapping against the stone "
          "steps, leaves rustling in a soft evening breeze, footsteps on cobblestone."
      )


      async def send_text_impulse(session, text: str, repeats: int = 10) -> None:
          """Repeat a mid-session text event across ~1.5s for reliable step uptake."""
          for _ in range(repeats):
              await session.send(text)
              await asyncio.sleep(0.15)


      async def main() -> None:
          client = genai.Client(http_options={"api_version": "v1beta"})  # Uses GEMINI_API_KEY
          interaction = await client.aio.interactions.create(
              model="models/genie-4", api_version="v1beta"
          )

          pcm_chunks: list[bytes] = []
          video_frames = 0

          async with client.aio.interactions.connect(
              interaction.id, api_version="v1beta"
          ) as session:
              await session.send(
                  {
                      "event_type": "world_setup",
                      "world_prompt": {"text": WORLD_PROMPT},
                  }
              )

              async for event in session.receive():
                  if event.event_type == "step.delta":
                      delta_type = getattr(event.delta, "type", None)
                      if delta_type == "video" and event.delta.data:
                          video_frames += 1
                          if video_frames == 1:
                              with open("oil_painting_start.jpg", "wb") as f:
                                  f.write(base64.b64decode(event.delta.data))
                              # Walk forward along the canal bridge
                              await session.send(
                                  {
                                      "event_type": "user_action",
                                      "action": "key_down",
                                      "input": "key_w",
                                  }
                              )
                          elif video_frames == 48:  # ~2s into the stream
                              asyncio.create_task(
                                  send_text_impulse(
                                      session,
                                      "Make heavy snow fall across the painted village",
                                  )
                              )
                          elif video_frames == 144:  # ~6s into the stream
                              await session.send(
                                  {
                                      "event_type": "user_action",
                                      "action": "key_up",
                                      "input": "key_w",
                                  }
                              )
                              await session.complete()
                      elif delta_type == "audio" and event.delta.data:
                          pcm_chunks.append(base64.b64decode(event.delta.data))
                  elif event.event_type == "interaction.completed":
                      break

          if pcm_chunks:
              with wave.open("oil_painting_audio.wav", "wb") as wav_file:
                  wav_file.setnchannels(2)  # Stereo
                  wav_file.setsampwidth(2)  # 16-bit signed little-endian PCM
                  wav_file.setframerate(48000)  # 48 kHz
                  wav_file.writeframes(b"".join(pcm_chunks))


      asyncio.run(main())
      ```

=== "JavaScript"

      在伺服器端 Node.js 指令碼、錄製管線，或沒有 `RTCPeerConnection` 的環境中使用 `{ transport: 'websocket' }`：

      ```javascript
      import { GoogleGenAI } from '@google/genai';
      import * as fs from 'node:fs';

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        apiVersion: 'v1beta',
      });
      const interaction = await ai.interactions.create({
        model: 'models/genie-4',
        api_version: 'v1beta',
      });

      const session = await ai.interactions.connect(
        interaction.id,
        { transport: 'websocket', api_version: 'v1beta' },
        { timeout_ms: 30000 }
      );

      await session.send({
        event_type: 'world_setup',
        world_prompt: {
          text: 'Immersive first-person POV standing on a cobblestone canal bridge inside a vibrant, thick-impasto post-impressionist oil painting of a starry riverside village at twilight. Audio: Gentle water lapping against the stone steps, leaves rustling in a soft evening breeze, footsteps on cobblestone.',
        },
      });

      let frameCount = 0;
      for await (const event of session.receive()) {
        if (event.event_type === 'step.delta' && event.delta?.type === 'video') {
          frameCount += 1;
          if (frameCount === 1 && event.delta.data) {
            fs.writeFileSync(
              'frame_001.jpg',
              Buffer.from(event.delta.data, 'base64')
            );
            await session.send({
              event_type: 'user_action',
              action: 'key_down',
              input: 'key_w',
            });
          }
          if (frameCount === 72) {
            await session.complete();
          }
        } else if (event.event_type === 'interaction.completed') {
          break;
        }
      }
      ```


**首次執行時的預期情況**：初始世界設定約需 `5-9 seconds`才會送達第一個影格。工作階段中途的文字切換（`"Make heavy snow fall..."`）約需 `~1-2 seconds`才會出現在畫面上，因為 Genie 4 會在生成步驟之間規劃環境變化。如果你轉身 `180 degrees`離開運河，再於數秒後轉回來，背景建築可能會重新排列——Genie 4 維持的是滾動式視覺視野，而非持久的 3D 網格。

## 選擇傳輸方式：WebRTC 與 WebSocket {#transports}

Genie 4 在 `interactions.connect` 上支援兩種即時傳輸方式：


| 功能 | WebRTC（`transport: 'webrtc'`） | WebSocket（`transport: 'websocket'`／Python 預設） |
| --- | --- | --- |
| **最適用於** | 互動式瀏覽器應用程式與遊戲 | Python 指令碼、Node.js 後端、影格擷取與自訂管線 |
| **SDK 支援** | `@google/genai`（瀏覽器中的 JavaScript／TypeScript） | `google-genai`（Python 非同步）與 `@google/genai`（Node.js 與瀏覽器） |
| **媒體傳遞** | 原生 RTP 視訊與 Opus 音訊軌道，由 `<video>` 直接算繪 | JSON `step.delta` 事件，含 base64 `JPEG` 影格與 `48 kHz` Int16 立體聲 PCM |
| **延遲與封包遺失** | 延遲最低；UDP 媒體搭配瀏覽器內建抖動緩衝 | 額外負擔較高（base64 約膨脹 33%）；TCP 在封包遺失時有隊頭阻塞問題 |
| **控制酬載上限** | `64 KB` SCTP 資料通道上限（`world_setup` JPEG 種子圖請保持在 `< 48 KB`） | 支援較大的 JSON 酬載，不受 SCTP 分段限制 |


## 驗證與暫時工作階段 token {#auth-tokens}

切勿將長期有效的 `GEMINI_API_KEY` 內嵌於用戶端瀏覽器程式碼中。請改為在後端建立互動並核發限定於該互動的 `auth_token`（`auth_tokens/...`），再以該 token 初始化瀏覽器的 `GoogleGenAI` 用戶端：


=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from '@google/genai';

      // Backend: mint token scoped to this single interaction ID
      const serverAi = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        apiVersion: 'v1beta',
      });
      const interaction = await serverAi.interactions.create({
        model: 'models/genie-4',
        api_version: 'v1beta',
      });
      const { auth_token } = await serverAi.interactions.authTokens.create(
        interaction.id,
        { api_version: 'v1beta' }
      );

      // Browser: pass auth_token as apiKey (works for both WebRTC and browser WebSockets)
      const browserAi = new GoogleGenAI({ apiKey: auth_token, apiVersion: 'v1beta' });
      const session = await browserAi.interactions.connect(interaction.id, {
        transport: 'webrtc',
        api_version: 'v1beta',
      });
      ```

=== "Python"

      ```python
      from google import genai

      # Backend: create interaction and mint single-session token
      server_client = genai.Client(http_options={"api_version": "v1beta"})
      interaction = await server_client.aio.interactions.create(
          model="models/genie-4", api_version="v1beta"
      )
      token_resp = await server_client.aio.interactions.auth_tokens.create(
          interaction_id=interaction.id, api_version="v1beta"
      )

      # Client worker: authenticate solely with the ephemeral session token
      scoped_client = genai.Client(
          api_key=token_resp.auth_token,
          http_options={"api_version": "v1beta"},
      )
      async with scoped_client.aio.interactions.connect(
          interaction.id, api_version="v1beta"
      ) as session:
          ...
      ```

=== "REST"

      ```bash
      # 1. Create the Genie 4 interaction
      INTERACTION_ID=$(curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: ${GEMINI_API_KEY}" \
        -H "Content-Type: application/json" \
        -d '{"model": "models/genie-4"}' | jq -r '.id')

      # 2. Mint an ephemeral auth token scoped to INTERACTION_ID
      AUTH_TOKEN=$(curl -s -X POST \
        "https://generativelanguage.googleapis.com/v1beta/interactions/${INTERACTION_ID}/auth_tokens" \
        -H "x-goog-api-key: ${GEMINI_API_KEY}" \
        -H "Content-Type: application/json" \
        -d '{}' | jq -r '.auth_token')
      ```


!!! warning " "

      **瀏覽器 WebSocket 需要 `auth_token`**：標準瀏覽器 `WebSocket` API 無法附加自訂 `x-goog-api-key` HTTP 標頭。當你在 `@google/genai` 中將 `auth_tokens/...` 字串作為 `apiKey` 傳入時，SDK 會自動使用該暫時 token 驗證瀏覽器 WebSocket 或 WebRTC 訊號請求。在瀏覽器中將原始 `AIza...` API 金鑰傳給 `{ transport: 'websocket' }` 會依設計擲出使用錯誤。


## 工作階段生命週期與事件通訊協定 {#event-protocol}

`interactions.connect()` 解析後，你可透過 `send()` 傳送 JSON 用戶端事件來驅動模擬。

### 1. 初始化世界（`world_setup`） {#world-setup}

在工作階段開始時傳送恰好一個 `world_setup` 事件，以初始化世界狀態並開始生成影格。你可以提供文字提示詞（`world_prompt`）、`16:9` 起始圖片（`reference_image`），或兩者都提供。

`reference_image` 是 `world_setup` 事件上的**頂層欄位**（與 `world_prompt` 同層），而非巢狀於 `world_prompt` 內：


=== "僅文字"

      ```json
      {
        "event_type": "world_setup",
        "world_prompt": {
          "text": "First-person POV standing in front of an espresso machine. An empty ceramic mug rests on the drip tray beneath the spout. A glowing \"brew\" button is visible on the front panel."
        }
      }
      ```

=== "文字 + 16:9 參考圖片"

      ```json
      {
        "event_type": "world_setup",
        "world_prompt": {
          "text": "First-person walk along a cliffside path painted in thick post-impressionist brushstrokes. Audio: Ocean wind through tall grass, distant gulls, gravel underfoot."
        },
        "reference_image": {
          "mime_type": "image/jpeg",
          "data": "<BASE64_ENCODED_16X9_JPEG>"
        }
      }
      ```


!!! tip " "

      **WebRTC 種子圖片請保持在 `48 KB` 以下**： WebRTC SCTP 資料通道強制執行 `65,536` 位元組（`64 KB`）的最大訊息大小。由於 base64 編碼會增加約 33% 的負擔，請先將參考圖片調整為 `1280x720`（或 `640x360`）並壓縮為 `48 KB` 以下的 `image/jpeg` 再做 base64 編碼；若要傳送較大的無損 `image/png` 種子圖，請改用 WebSocket 連接。


### 2. 移動與環顧（`user_action`） {#user-actions}

傳送 `user_action` 事件，以最低延遲操控移動與攝影機方向（在網路往返時間較低時，視覺回應約 `~0.2-0.5s`）：

```json
{
  "event_type": "user_action",
  "action": "key_down",
  "input": "key_w"
}
```

*   **`action` 值**： `"key_down"`、`"key_up"`、`"key_click"`。使用者按下按鍵時傳送 `"key_down"`（請抑制作業系統的按鍵重複事件），放開時傳送 `"key_up"`；按住的按鍵會持續作用於後續步驟，直到收到 `"key_up"` 為止。
*   **原生訓練的移動與攝影機輸入**：
    *   移動：`"key_w"`（前進）、`"key_s"`（後退）、`"key_a"`（向左平移）、`"key_d"`（向右平移）。
    *   攝影機視角：`"arrow_up"`（上仰）、`"arrow_down"`（下俯）、`"arrow_left"`（向左平移視角）、`"arrow_right"`（向右平移視角）。

*   **保留的結構描述輸入與自訂動作按鍵**：雖然線路結構描述也接受 `"key_e"` 與 `"space"`，但 Genie 4 並**不會**為這些列舉值附加內建的「跳躍」或「互動」遊戲行為。若要建立自訂控制（例如按 `E` 開門、按 `Q` 召喚天氣，或按 `R` 觸發加速），請在用戶端攔截這些按鍵，改為傳送描述性的 `input` 文字事件。請參閱[模式 2：按鍵綁定的動作動詞](/docs/genie-prompting/#key-bound-actions)。

### 3. 操控世界事件與對話（`input`） {#mid-session-input}

在串流進行中傳送工作階段中途的文字輸入，以觸發環境變化、物件狀態轉換，或與場景中的角色進行口頭對話。將純字串傳給 `send("...")` 會自動將其包裝為 `input` 事件：

```json
{
  "event_type": "input",
  "content": [
    {
      "type": "text",
      "text": "Press the brew button so dark espresso pours into the ceramic mug"
    }
  ]
}
```

*   **重複傳送短暫脈衝（`10×`，每 `150 ms` 一次）**：由於世界規劃會在步驟邊界取樣傳入的文字（`24 fps` 下每步驟 `4` 幀），將一次性動作提示詞以 `150 ms` 間隔傳送 `10` 次（約 `~1.5s`），可確保下一個規劃視窗可靠地接收到它。在觸發相互衝突的提示詞前，請強制執行約 `~2 second`的用戶端冷卻時間。
*   **角色口頭對話**：面對場景中的角色時，請將語音用引號包起來，例如 `"\"What vintage would you recommend?\""`。
*   **讓編輯留在世界內**：請描述目前視野內連續的物理變化，而不是要求攝影機硬切（`"cut to aerial view"`），以免破壞空間連續性。

### 4. 結束工作階段與中斷連線（`complete`、`cancel`、`detach`） {#ending-sessions}

了解本機中斷連線與伺服器端完成之間的差異，可避免意外的 token 費用：

*   `await session.complete()`：傳送 `interaction.complete`，停止伺服器端世界生成與 token 計費，並在 `receive()` 上發出終端 `interaction.completed` 事件。**使用者結束工作階段時，請務必呼叫 `complete()`**。
*   `await session.cancel()`：立即中止伺服器端生成（`interaction.cancel`）。
*   `session.detach()`／離開 Python 的 `async with`：傳送 `interaction.disconnect` 並關閉本機 socket，**不會**明確完成伺服器端的互動。由於 Genie 4 不支援工作階段續接，切勿依賴 `detach()` 暫停、續接或停止計費——請一律呼叫 `complete()` 或 `cancel()`。

## 解碼 WebSocket 媒體串流 {#decoding-stream}

透過 WebSocket 連接時（`Python`，或使用 `{ transport: 'websocket' }` 的 `JavaScript`），請迭代 `receive()`（每個連接只允許一個作用中的 `receive()` 迭代器）。媒體會以 `step.delta` 事件送達：

*   **視訊（`event.delta.type === "video"`）**：每個 delta 攜帶一個 base64 編碼的 `image/jpeg` 影格，影格率為 `24 fps`。在瀏覽器中，請在 delta 送達時指派遞增的本機影格計數器，以 `createImageBitmap` 解碼到 `<canvas>` 上，並捨棄計數器低於最新已算繪影格的任何影格，讓較慢的解碼永遠不會覆寫較新的影格。
*   **音訊（`event.delta.type === "audio"`）**：base64 編碼的原始有號 16 位元小端序立體聲 PCM（`audio/l16`、`48,000 Hz`、`2` 聲道，交錯排列 `[L0, R0, L1, R1, ...]`）。在瀏覽器中，請將解碼後的緩衝區以無間隙方式排程到 `48000 Hz` 的 `AudioContext` 上播放；或在 Python 中直接寫入 2 聲道、2 位元組取樣寬度、`48000 Hz` 的 WAV 容器。

```javascript
// Browser WebSocket PCM audio + JPEG canvas renderer
const audioCtx = new AudioContext({ sampleRate: 48000 });
let nextPlayTime = 0;
let videoSeq = 0;
let latestRenderedSeq = 0;

for await (const event of session.receive()) {
  if (event.event_type !== 'step.delta' || !event.delta?.data) continue;

  if (event.delta.type === 'video') {
    const seq = ++videoSeq;
    const bytes = Uint8Array.from(atob(event.delta.data), (c) =>
      c.charCodeAt(0)
    );
    createImageBitmap(new Blob([bytes], { type: 'image/jpeg' }))
      .then((bitmap) => {
        if (seq > latestRenderedSeq) {
          latestRenderedSeq = seq;
          canvasCtx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        }
        bitmap.close();
      })
      .catch(console.error);
  } else if (event.delta.type === 'audio') {
    const bytes = Uint8Array.from(atob(event.delta.data), (c) =>
      c.charCodeAt(0)
    );
    const int16 = new Int16Array(
      bytes.buffer,
      bytes.byteOffset,
      bytes.byteLength / 2
    );
    const frameCount = Math.floor(int16.length / 2);
    const buffer = audioCtx.createBuffer(2, frameCount, 48000);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);
    for (let i = 0; i < frameCount; i++) {
      left[i] = int16[i * 2] / 32768;
      right[i] = int16[i * 2 + 1] / 32768;
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    const startAt = Math.max(audioCtx.currentTime + 0.04, nextPlayTime);
    source.start(startAt);
    nextPlayTime = startAt + buffer.duration;
  }
}
```

## 選擇合適的影片或即時模型 {#choose-a-model}


| 使用情境 | 建議模型 | API 介面 |
| --- | --- | --- |
| 即時可操控的世界、可遊玩的視覺原型、互動式空間探索（`24 fps` 即時串流） | [**Genie 4**（`models/genie-4`）](/docs/models/genie-4/) | [Interactions API](/docs/genie/)（`interactions.connect`，透過 WebRTC／WebSocket） |
| 離線片段生成（`3s-15s`）、多輪影片編輯、影片延長至 `30s`、`1080p`／`4K` 升頻、最多 6 張參考圖片 | [**Gemini Omni 1.2 Flash**（`gemini-omni-1.2-flash`）](/docs/models/gemini-omni-flash/) | [Interactions API](/docs/omni/)（`interactions.create`） |
| 即時語音代理、雙向麥克風／攝影機理解、工具呼叫、Google 搜尋接地 | [**Gemini 3.8 Live**（`gemini-3.8-live`）](/docs/models/gemini-3.8-live/) | [Live API](/docs/live-api/)（`live.connect`） |


## 限制 {#limitations}

請依據 Genie 4 即時世界模型的限制來設計互動體驗：

*   **短視野物件恆存性**： Genie 4 是在滾動式時間視窗上模擬影格，而非維護持久的 3D 場景圖。移開視線（`8+ seconds`）或轉身 `360 degrees`可能導致地標、門或按鈕移位或重設，且視覺穩定性在 `60-90 seconds`後可能下降（硬性上限為 `120 seconds`）。
*   **雙速回應**：原生 `WASD` 與方向鍵動作會在 `~0.2-0.5s` 內生效，而工作階段中途的文字 `input` 提示詞需經過世界規劃，約需 `~1-2s` 才會出現在畫面上。
*   **固定的 `16:9` 輸出與區域服務範圍**：輸出串流為 `1280x720`（`720p`、`16:9`、`24 fps`），由位於美國、西歐與日本的資料中心提供服務。不支援直式長寬比（`9:16`）與可設定的影格率；北美洲、西歐與中歐、東亞以外的連接會有較高的操控延遲，影格率也可能降低。
*   **不支援即時麥克風／網路攝影機輸入或工具呼叫**： Genie 4 接受文字、單張 `16:9` 起始圖片，以及鍵盤／攝影機 `user_action` 事件。不接受即時使用者音訊或視訊串流，也不支援函式呼叫、Google 搜尋接地、結構化輸出，或跨已完成互動的工作階段續接。
*   **安全與背誦篩選**：包含可識別真人、公眾人物或受版權保護品牌 IP 的提示詞或參考圖片，可能在啟動時遭到封鎖，或使進行中的串流在中途終止。
*   **可讀文字與精確數量**：招牌、儀表與時鐘會隨時間變形，精確的物件數量也會在攝影機平移時漂移。

## 後續步驟 {#whats-next}

*   參閱 [Genie 4 提示與控制指南](/docs/genie-prompting/)，了解 5 種經過測試的世界設計模式。
*   查看 [Genie 4 模型頁面](/docs/models/genie-4/)上的規格。
*   檢視 [Genie 4 定價](/docs/pricing/#genie-4)與並行工作階段[速率限制](/docs/rate-limits/#genie-4)。
