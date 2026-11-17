# 語音設計

語音設計讓您透過 Gemini API 的 Voices 端點（`POST /v1beta/voices`），以自然語言描述從零建立一個全新的持久性聲音角色。您不必受限於預建語音，也不必錄製參考音訊，只要描述角色的年齡、音色、口音與基本說話方式，就能取得一個可重複使用的 `voice_...` ID，並將其儲存到您的專案中。

設計、試聽並反覆調整自訂語音最快速的方式，是使用 [Google AI Studio](https://aistudio.google.com/generate-speech) 中互動式的 **Voice Design** 工作室。您可以從文字提示詞生成自訂角色、用範例腳本測試效果，並將產生的 `voice_...` ID 直接複製到應用程式程式碼中。

[在 Google AI Studio 中試用](https://aistudio.google.com/generate-speech)

[Gemini 3.8 Flash TTS](/docs/models/gemini-3.8-flash-tts/)（`gemini-3.8-flash-tts`）與 [Gemini 3.8 Flash-Lite TTS](/docs/models/gemini-3.8-flash-lite-tts/)（`gemini-3.8-flash-lite-tts`）皆支援語音設計。

## 建立設計語音 {#create-a-designed-voice}

使用 Google GenAI SDK（`google-genai` 2.25.0+ / `@google/genai` 2.24.0+）或 REST API，即可從文字描述建立自訂語音。對於 `"prompted"` 語音，`voices.create`（`CreateVoice`）與 `voices.get`（`GetVoice`）都會回傳一個唯讀輸出的 `sample_audio` 欄位（`mime_type: "audio/wav"`、經 base64 編碼的 `data`），讓您能立即試聽生成的語音：


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # 1. Design a custom voice persona from natural language
      created_voice = client.voices.create(
          store=True,
          voice={
              "model": "gemini-3.8-flash-tts",
              "type": "prompted",
              "display_name": "Warm British Astronomer",
              "gender": "male",
              "language_code": "en-GB",
              "prompted": {
                  "input": (
                      "A warm, thoughtful astronomer in his late 60s with a gentle"
                      " British accent, speaking with quiet wonder."
                  )
              },
          },
      )

      print(f"Created voice ID: {created_voice.id}")

      # Save the generated sample_audio preview (audio/wav) returned by CreateVoice
      if created_voice.sample_audio and created_voice.sample_audio.data:
          with open("voice_preview.wav", "wb") as f:
              f.write(base64.b64decode(created_voice.sample_audio.data))
      ```

=== "JavaScript"

      ```javascript
      import * as fs from "node:fs";
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      // 1. Design a custom voice persona from natural language
      const createdVoice = await ai.voices.create({
        store: true,
        voice: {
          model: "gemini-3.8-flash-tts",
          type: "prompted",
          display_name: "Warm British Astronomer",
          gender: "male",
          language_code: "en-GB",
          prompted: {
            input:
              "A warm, thoughtful astronomer in his late 60s with a gentle British accent, speaking with quiet wonder.",
          },
        },
      });

      console.log(`Created voice ID: ${createdVoice.id}`);

      // Save the generated sample_audio preview (audio/wav) returned by CreateVoice
      if (createdVoice.sample_audio?.data) {
        fs.writeFileSync(
          "voice_preview.wav",
          Buffer.from(createdVoice.sample_audio.data, "base64")
        );
      }
      ```

=== "REST"

      ```bash
      curl "https://generativelanguage.googleapis.com/v1beta/voices" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -X POST \
        -d '{
          "store": true,
          "voice": {
            "model": "gemini-3.8-flash-tts",
            "type": "prompted",
            "display_name": "Warm British Astronomer",
            "gender": "male",
            "language_code": "en-GB",
            "prompted": {
              "input": "A warm, thoughtful astronomer in his late 60s with a gentle British accent, speaking with quiet wonder."
            }
          }
        }' | tee created_voice.json | jq -r '.sample_audio.data' | base64 --decode > voice_preview.wav
      ```



## 語音設計的運作方式 {#how-voice-design-works}

1.  **建立 prompted 語音**：呼叫 `voices.create`（`POST /v1beta/voices`），並設定 `type="prompted"` 與 `store=True`。
2.  **取得持久性的 `voice_id` 與 `sample_audio` 預覽**：API 會生成聲音身分、將其儲存到您的專案，並回傳一個永久 ID（例如 `voice_abc123...`），以及包含該語音預覽音訊的 `sample_audio`（`mime_type: "audio/wav"`、經 base64 編碼的 `data`）。
3.  **合成語音**：在您的合成請求中，將 `voice_id` 傳入任何接受語音名稱的位置即可。

## 使用您設計的語音合成語音 {#synthesize-speech-with-your-designed-voice}

建立語音後，將其 `id`（`voice_...`）傳入 Interactions API 即可生成語音：


=== "Python"

      ```python
      import base64
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      interaction = client.interactions.create(
          model="gemini-3.8-flash-tts",
          input=[{
              "type": "user_input",
              "content": [{
                  "type": "text",
                  "text": (
                      "Look out past the rings of Saturn. Those faint photons left"
                      " their source millions of years ago."
                  ),
                  "annotations": [{
                      "type": "speech_metadata",
                      "style": "reflective and awe-inspired",
                  }],
              }],
          }],
          response_format={"type": "audio"},
          generation_config={
              "speech_config": [
                  {"voice": created_voice.id},
              ]
          },
      )

      with open("designed_voice.wav", "wb") as f:
          f.write(base64.b64decode(interaction.output_audio.data))
      ```

=== "JavaScript"

      ```javascript
      import * as fs from "node:fs";
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      const interaction = await ai.interactions.create({
        model: "gemini-3.8-flash-tts",
        input: [{
          type: "user_input",
          content: [{
            type: "text",
            text: "Look out past the rings of Saturn. Those faint photons left their source millions of years ago.",
            annotations: [{
              type: "speech_metadata",
              style: "reflective and awe-inspired",
            }],
          }],
        }],
        response_format: { type: "audio" },
        generation_config: {
          speech_config: [
            { voice: createdVoice.id },
          ],
        },
      });

      if (interaction.output_audio?.data) {
        fs.writeFileSync("designed_voice.wav", Buffer.from(interaction.output_audio.data, "base64"));
      }
      ```

=== "REST"

      ```bash
      curl "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H "Content-Type: application/json" \
        -X POST \
        -d '{
          "model": "gemini-3.8-flash-tts",
          "input": [{
            "type": "user_input",
            "content": [{
              "type": "text",
              "text": "Look out past the rings of Saturn. Those faint photons left their source millions of years ago.",
              "annotations": [{
                "type": "speech_metadata",
                "style": "reflective and awe-inspired"
              }]
            }]
          }],
          "response_format": {"type": "audio"},
          "generation_config": {
            "speech_config": [
              {"voice": "voice_YOUR_DESIGNED_VOICE_ID"}
            ]
          }
        }' | jq -r '[.steps[] | select(.type=="model_output") | .content[] | select(.type=="audio")] | last | .data' | base64 --decode > out.wav
      ```



## 管理您的語音 {#manage-your-voices}

您可以隨時使用 Voices API 列出、篩選、檢視及刪除已儲存的語音（所有篩選參數請參閱 [Extended Voice Library and filtering](/docs/speech-generation/#voice-library)）。

*   **儲存限制與 TTL**：有狀態的語音（`store=True`，prompted 與 replicated 語音共用）上限為**每個專案 200 個語音**，且 **TTL（存活時間）為 1 年**。
*   **`sample_audio` 的可用性**：`voices.create()`（`CreateVoice`）與
    `voices.get()`（`GetVoice`）會填入 `sample_audio`（`mime_type:
    "audio/wav"`、經 base64 編碼的 `data`），適用於 `"prompted"` 語音。為了讓
    清單查詢保持輕量，`voices.list()`（`ListVoices`）會省略 `sample_audio`
    （且 `sample_audio` 對於 `"replicated"` 與 `"prebuilt"` 語音為未設定狀態）。


=== "Python"

      ```python
      from google import genai

      client = genai.Client(http_options={"api_version": "v1beta"})

      # List stored prompted voices in your project filtered by language
      response = client.voices.list(
          type_=["prompted"],
          language_code=["en-US", "en-GB"],
      )
      for voice in response.voices or []:
          print(voice.id, voice.display_name, voice.type)

      # Retrieve a specific voice by ID
      voice_details = client.voices.get(id=created_voice.id)

      # Delete a stored custom voice
      client.voices.delete(id=created_voice.id)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      const ai = new GoogleGenAI({ httpOptions: { apiVersion: "v1beta" } });

      // List stored prompted voices in your project filtered by language
      const response = await ai.voices.list({
        type: ["prompted"],
        language_code: ["en-US", "en-GB"],
      });
      for (const voice of response.voices ?? []) {
        console.log(voice.id, voice.display_name, voice.type);
      }

      // Retrieve a specific voice by ID
      const voiceDetails = await ai.voices.get(createdVoice.id);

      // Delete a stored custom voice
      await ai.voices.delete(createdVoice.id);
      ```

=== "REST"

      ```bash
      # List stored prompted voices filtered by language
      curl -G "https://generativelanguage.googleapis.com/v1beta/voices" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        --data-urlencode "type=prompted" \
        --data-urlencode "language_code=en-US" \
        --data-urlencode "language_code=en-GB"

      # Retrieve a specific voice by ID
      curl "https://generativelanguage.googleapis.com/v1beta/voices/voice_YOUR_DESIGNED_VOICE_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"

      # Delete a stored custom voice
      curl -X DELETE "https://generativelanguage.googleapis.com/v1beta/voices/voice_YOUR_DESIGNED_VOICE_ID" \
        -H "x-goog-api-key: $GEMINI_API_KEY"
      ```



## 語音設計的提示詞最佳做法 {#prompting-best-practices-for-voice-design}

*   **將永久性的聲音特質放在語音設計中，而不是 `style`**：在 `voices.create` 建立語音時，定義不會改變的特徵，例如年齡、性別、音色、聲音質地與地區口音。
*   **將 `speech_metadata.style` 保留給情境情緒**：自訂語音建立完成後，使用簡短的 `style` 提示詞（例如 `"whispered urgently"` 或 `"cheerful and energetic"`），在不改變說話者核心身分的前提下，逐回合引導演出效果。
*   **具體且簡潔**：清楚的 1–2 句描述（例如 *"A crisp, energetic sports announcer in her 30s with a slight Midwestern accent"*），比互相矛盾或過於冗長的段落更能產生乾淨、一致的結果。

## 後續步驟 {#whats-next}

*   在 [Voice replication](/docs/voice-replication/) 中瞭解如何複製既有說話者的語音。
*   在 [Voice remixing](/docs/voice-remixing/) 中，以自然語言指令編輯並精修預建或自訂語音。
*   在[文字轉語音指南](/docs/speech-generation/)中探索回合層級的風格設定、行內標籤與多說話者對話。
