# 語音混音

語音混音讓您使用自然語言指令修改既有語音，建立一個全新的、獨立儲存的語音。

實作時，請使用 `POST /v1beta/voices` 搭配 `gemini-3.8-flash-tts`，生成新的 `voice_...` ID。之後您便可使用這個 ID，透過 [Gemini 3.8 Flash TTS](/docs/models/gemini-3.8-flash-tts/)（`gemini-3.8-flash-tts`）與 [Gemini 3.8 Flash-Lite TTS](/docs/models/gemini-3.8-flash-lite-tts/)（`gemini-3.8-flash-lite-tts`）合成語音。

您不必從零設計聲音角色，而是提供一個 `base_voice`（例如預建的錄音室語音、[Extended Voice Library](/docs/speech-generation/#voice-library) 語音，或自訂的 [Voice design](/docs/voice-design/) 角色），並在 `input` 中以相對提示描述要做的變更（例如調整年齡、音高、能量、音色或口音）。您可以在 [Google AI Studio](https://aistudio.google.com/generate-speech) 中互動式混音，也可以使用 `POST /v1beta/voices` 以程式方式進行。

[在 Google AI Studio 中試用](https://aistudio.google.com/generate-speech)

## 開始使用 {#get-started}

以下範例將預建的 `"Puck"` 語音混音成一個新的已儲存語音（`voice_...`），儲存生成的 `sample_audio` WAV 預覽，並使用混音後的語音合成語音：


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # 1. Remix an existing base voice into a new stored custom voice
      remixed_voice = client.voices.create(
          store=True,
          voice={
              "model": "gemini-3.8-flash-tts",
              "type": "prompted",
              "prompted": {
                  "base_voice": "Puck",
                  "input": (
                      "Make the voice sound slightly older and more grounded, with a"
                      " warm British accent and measured audiobook narration pacing."
                  ),
              },
          },
      )

      print(f"Created remixed voice ID: {remixed_voice.id}")  # e.g., "voice_abc123..."

      # Optional: Save the sample audio preview (24kHz WAV) returned by CreateVoice
      if remixed_voice.sample_audio and remixed_voice.sample_audio.data:
          with open("remixed_voice_preview.wav", "wb") as f:
              f.write(base64.b64decode(remixed_voice.sample_audio.data))

      # 2. Synthesize speech using the remixed voice ID
      interaction = client.interactions.create(
          model="gemini-3.8-flash-tts",
          input=[{
              "type": "user_input",
              "content": [{
                  "type": "text",
                  "text": "Chapter One. The fog rolled quietly across the harbor at dawn.",
                  "annotations": [{
                      "type": "speech_metadata",
                      "style": "calm and reflective",
                  }],
              }],
          }],
          response_format={"type": "audio"},
          generation_config={
              "speech_config": [
                  {"voice": remixed_voice.id},
              ]
          },
      )

      with open("remixed_voice_output.wav", "wb") as f:
          f.write(base64.b64decode(interaction.output_audio.data))
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      // 1. Remix an existing base voice into a new stored custom voice
      const remixedVoice = await client.voices.create({
        store: true,
        voice: {
          model: "gemini-3.8-flash-tts",
          type: "prompted",
          prompted: {
            base_voice: "Puck",
            input:
              "Make the voice sound slightly older and more grounded, with a warm British accent and measured audiobook narration pacing.",
          },
        },
      });

      console.log(`Created remixed voice ID: ${remixedVoice.id}`); // e.g., "voice_abc123..."

      // Optional: Save the sample audio preview (24kHz WAV) returned by CreateVoice
      if (remixedVoice.sample_audio?.data) {
        fs.writeFileSync(
          "remixed_voice_preview.wav",
          Buffer.from(remixedVoice.sample_audio.data, "base64")
        );
      }

      // 2. Synthesize speech using the remixed voice ID
      const interaction = await client.interactions.create({
        model: "gemini-3.8-flash-tts",
        input: [{
          type: "user_input",
          content: [{
            type: "text",
            text: "Chapter One. The fog rolled quietly across the harbor at dawn.",
            annotations: [{
              type: "speech_metadata",
              style: "calm and reflective",
            }],
          }],
        }],
        response_format: { type: "audio" },
        generation_config: {
          speech_config: [
            { voice: remixedVoice.id },
          ],
        },
      });

      const audioBuffer = Buffer.from(interaction.output_audio.data, "base64");
      fs.writeFileSync("remixed_voice_output.wav", audioBuffer);
      ```

=== "REST"

      ```bash
      # 1. Remix an existing base voice into a new stored custom voice
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/voices" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "store": true,
          "voice": {
            "model": "gemini-3.8-flash-tts",
            "type": "prompted",
            "prompted": {
              "base_voice": "Puck",
              "input": "Make the voice sound slightly older and more grounded, with a warm British accent and measured audiobook narration pacing."
            }
          }
        }'

      # The response returns "id": "voice_abc123...", "prompted": {"base_voice": "Puck", ...},
      # and "sample_audio": {"mime_type": "audio/wav", "data": "<base64-wav>"}

      # 2. Synthesize speech using the returned voice_... ID
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "model": "gemini-3.8-flash-tts",
          "input": [{
            "type": "user_input",
            "content": [{
              "type": "text",
              "text": "Chapter One. The fog rolled quietly across the harbor at dawn.",
              "annotations": [{
                "type": "speech_metadata",
                "style": "calm and reflective"
              }]
            }]
          }],
          "response_format": {
            "type": "audio"
          },
          "generation_config": {
            "speech_config": [
              { "voice": "voice_abc123..." }
            ]
          }
        }' | jq -r '[.steps[] | select(.type=="model_output") | .content[] | select(.type=="audio")] | last | .data' | base64 --decode > remixed_voice_output.wav
      ```



## 語音混音的運作方式 {#how-voice-remixing-works}

語音混音使用與 [Voice design](/docs/voice-design/) 相同的 `POST /v1beta/voices` 端點（`type="prompted"`、`store=True`），並新增 `prompted.base_voice` 欄位，讓生成過程以既有語音為錨點：

1.  **選取基礎語音並描述相對編輯**：呼叫 `client.voices.create()`（`POST /v1beta/voices`），設定 `type="prompted"`、`store=True`，將 `prompted.base_voice` 設為既有語音的名稱或 ID，並以 `prompted.input` 描述如何修改該語音。
2.  **生成並儲存新的獨立語音（`voice_...`）**：模型會將您的相對指令套用到 `base_voice` 的聲學特徵上，在您的專案中儲存一個新的自訂語音資源（不會變更原始的 `base_voice`），並回傳其 `id`（`voice_...`）以及 24kHz WAV 的 `sample_audio` 預覽（`mime_type: "audio/wav"`）。
3.  **合成語音或進一步反覆調整**：將新的 `voice_...` ID 傳入 `speech_config` 進行單一說話者合成，或在後續呼叫中將它作為 `base_voice` 傳入 `CreateVoice`，逐步精修語音。

| 參數 | 類型 | 說明 |
| :--- | :--- | :--- |
| `store` | `bool` | 必填（須設為 `True`，適用於 `"prompted"` 語音）。將混音後的語音儲存到您的專案，並回傳 `voice_...` ID。 |
| `voice.model` | `str` | 選填。語音建立模型：`"gemini-3.8-flash-tts"`（省略時為預設值）。產生的已儲存 `voice_...` ID 可同時用於 `gemini-3.8-flash-tts` 與 `gemini-3.8-flash-lite-tts` 的語音合成。 |
| `voice.type` | `str` | 必填。設為 `"prompted"`。 |
| `voice.prompted.base_voice` | `str` | 混音時必填。要混音的來源語音名稱或 ID（預建語音名稱、Extended Voice Library ID，或已儲存的 prompted `voice_...` ID）。 |
| `voice.prompted.input` | `str` | 必填。以自然語言指令描述要套用到 `base_voice` 的相對修改。 |

## 支援的基礎語音 {#supported-base-voices}

您可以在 `prompted.base_voice` 中傳入以下任何語音識別碼：

*   **預建與 Extended Voice Library 語音**：傳入 30 個預建錄音室語音名稱中的任何一個（例如 `"Puck"`、`"Kore"` 或 `"Zephyr"`），或 `client.voices.list()`（`GET /v1beta/voices`）回傳的任何目錄語音 ID。
*   **設計或先前混音的語音（`voice_...`）**：傳入 `id`（屬於專案擁有的任何已儲存 `"prompted"` 語音），即可微調自訂角色，不必從零重新生成。


!!! note " "

      混音永遠會建立一個全新的、獨立的 `voice_...` 資源。它絕不會修改或覆寫原始的 `base_voice`，日後刪除 `base_voice` 也不會影響任何由它混音而成的語音。


## 跨自訂語音的反覆混音 {#iterative-remixing}

由於每個混音語音本身都是已儲存的 `voice_...` 資源，您可以跨自訂語音串連混音，從設計或先前混音的語音出發，逐步精修特定的聲音特質：


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # Start from an existing prompted voice ID (designed or previously remixed)
      source_voice_id = "voice_abc123..."

      # Create a new variation while preserving the core vocal identity
      remixed_variation = client.voices.create(
          store=True,
          voice={
              "model": "gemini-3.8-flash-tts",
              "type": "prompted",
              "prompted": {
                  "base_voice": source_voice_id,
                  "input": (
                      "Keep the same speaker identity and accent, but make the"
                      " delivery calmer, softer, and slightly lower in pitch."
                  ),
              },
          },
      )

      print(f"New voice ID: {remixed_variation.id}")
      print(f"Remixed from: {remixed_variation.prompted.base_voice}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      // Start from an existing prompted voice ID (designed or previously remixed)
      const sourceVoiceId = "voice_abc123...";

      // Create a new variation while preserving the core vocal identity
      const remixedVariation = await client.voices.create({
        store: true,
        voice: {
          model: "gemini-3.8-flash-tts",
          type: "prompted",
          prompted: {
            base_voice: sourceVoiceId,
            input:
              "Keep the same speaker identity and accent, but make the delivery calmer, softer, and slightly lower in pitch.",
          },
        },
      });

      console.log(`New voice ID: ${remixedVariation.id}`);
      console.log(`Remixed from: ${remixedVariation.prompted?.base_voice}`);
      ```

=== "REST"

      ```bash
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/voices" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
          "store": true,
          "voice": {
            "model": "gemini-3.8-flash-tts",
            "type": "prompted",
            "prompted": {
              "base_voice": "voice_abc123...",
              "input": "Keep the same speaker identity and accent, but make the delivery calmer, softer, and slightly lower in pitch."
            }
          }
        }'
      ```



## 管理與檢視混音語音 {#manage-remixed-voices}

混音語音會以 `type="prompted"` 儲存在您的專案中。當您擷取或列出自訂語音時，混音語音會同時包含 `voice.prompted.base_voice` 與 `voice.prompted.input`，讓您能在語音庫中追蹤其來源脈絡。呼叫 `GetVoice` 也會回傳 `sample_audio`（`audio/wav`），讓您隨時重播預覽音訊。

*   **配額層級要求**：語音混音需要 **Paid Tier（Tier 1 或更高層級）** 的 Gemini API 專案（請參閱[速率限制](/docs/rate-limits/)）。
*   **專案配額**：**每個專案最多 200 個有狀態語音（`store=True`）**，由設計、混音與已儲存的複製語音共用。
*   **保留期限（TTL）**：**自上次使用起 1 年（`expire_time`）**。每當您使用已儲存的語音合成語音，或在新的混音請求中將它作為 `base_voice` 引用，其 1 年到期視窗就會自動重設。


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # List all custom prompted voices (both designed and remixed)
      response = client.voices.list(type_=["prompted"])
      for v in response.voices or []:
          base = v.prompted.base_voice if v.prompted else None
          prompt = v.prompted.input if v.prompted else None
          print(f"{v.id} | base_voice={base} | expires={v.expire_time} | prompt={prompt}")

      # Retrieve a specific remixed voice (including its sample_audio WAV preview)
      voice_info = client.voices.get(id="voice_abc123...")
      if voice_info.sample_audio and voice_info.sample_audio.data:
          with open("fetched_remix_preview.wav", "wb") as f:
              f.write(base64.b64decode(voice_info.sample_audio.data))

      # Delete a remixed voice when no longer needed
      client.voices.delete(id="voice_abc123...")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      const client = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      // List all custom prompted voices (both designed and remixed)
      const response = await client.voices.list({ type: ["prompted"] });
      for (const v of response.voices ?? []) {
        console.log(
          `${v.id} | base_voice=${v.prompted?.base_voice ?? "none"} | expires=${v.expire_time} | prompt=${v.prompted?.input}`
        );
      }

      // Retrieve a specific remixed voice (including its sample_audio WAV preview)
      const voiceInfo = await client.voices.get("voice_abc123...");
      if (voiceInfo.sample_audio?.data) {
        fs.writeFileSync(
          "fetched_remix_preview.wav",
          Buffer.from(voiceInfo.sample_audio.data, "base64")
        );
      }

      // Delete a remixed voice when no longer needed
      await client.voices.delete("voice_abc123...");
      ```

=== "REST"

      ```bash
      # List all custom prompted voices (both designed and remixed)
      curl -G "https://generativelanguage.googleapis.com/v1beta/voices" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        --data-urlencode "type=prompted"

      # Get metadata and sample_audio preview for a specific remixed voice
      curl "https://generativelanguage.googleapis.com/v1beta/voices/voice_abc123..." \
        -H "x-goog-api-key: $GEMINI_API_KEY"

      # Delete a remixed voice
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/voices/voice_abc123..." \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```



## 語音混音的提示詞最佳做法 {#prompting-best-practices}

*   **描述相對調整，而不是重複完整的角色設定**：由於模型會以 `base_voice` 的聲學特徵為錨點，請讓 `prompted.input` 專注於您想改變的特定特質，例如年齡、音色、音高、節奏或聲音能量。
*   **仰賴預設的語言與口音保留**：相對混音提示詞會保留 `base_voice` 的基本語言與地區口音，除非您在 `prompted.input` 中明確指定新的語言或口音。
*   **串連混音時，每一步只修改一到兩個特質**：跨多次反覆精修語音時，每次呼叫只調整一組聚焦的屬性，並在串連下一次編輯前先試聽 `sample_audio` 預覽。
*   **將語音混音用於永久性的聲音特質，將 `speech_metadata.style` 用於回合層級的演出**：使用語音混音永久改變角色的基準聲音（例如年齡、口音、音高或預設角色）。在 TTS 合成時使用 `speech_metadata.style` 提供暫時性的逐回合說話提示（例如 `"whispering"` 或 `"excited"`）。

| 混音目標 | 範例 `base_voice` | 範例 `prompted.input` |
| :--- | :--- | :--- |
| **年齡與音色調整** | `"Puck"` | `"Make the voice sound 20 years older with a deeper, slightly gravelly baritone timbre while keeping the friendly warmth."` |
| **地區口音調整** | `"Kore"` | `"Change the accent to Australian English while preserving the clear, confident studio delivery."` |
| **領域與節奏調整** | `"voice_abc123..."`（設計語音） | `"Adapt this voice for late-night meditation narration: lower the vocal projection, slow the pacing, and soften the tone."` |
| **能量與投射調整** | `"voice_def456..."`（混音語音） | `"Increase vocal energy and projection so the speaker sounds like an upbeat live event announcer."` |

## 後續步驟 {#whats-next}

*   在 [Voice design](/docs/voice-design/) 中從零建立自訂聲音角色。
*   在 [Voice replication](/docs/voice-replication/) 中從參考音訊複製說話者的語音。
*   在[文字轉語音指南](/docs/speech-generation/)中探索回合層級的風格設定、行內聲音標籤與多說話者對話。
*   在 [Gemini 3.8 Flash TTS](/docs/models/gemini-3.8-flash-tts/) 與 [Gemini 3.8 Flash-Lite TTS](/docs/models/gemini-3.8-flash-lite-tts/) 模型頁面比較模型規格。
