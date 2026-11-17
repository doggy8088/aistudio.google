# 使用 Lyria RealTime 即時生成音樂


!!! note " "

      Lyria RealTime 是一個[實驗版模型](/docs/models/#experimental)。


Gemini API 透過 [Lyria Realtime](https://deepmind.google/technologies/lyria/realtime/)，提供最先進的即時串流音樂生成模型。開發人員可藉此打造讓使用者能互動式創作、持續引導並演奏器樂的應用程式。

Lyria Realtime 音樂生成使用 [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)，以持久、雙向、低延遲的串流連線進行。

想親身體驗 Lyria Realtime 能打造出什麼樣的應用，可在 AI Studio 上試用 [Prompt DJ](https://aistudio.google.com/apps/bundled/promptdj) 或 [MIDI DJ](https://aistudio.google.com/apps/bundled/promptdj-midi) 應用程式。


!!! note " "

      想找非串流的音樂生成方式？請參閱[使用 Lyria 3.5 生成音樂](/docs/music-generation/)。


## 生成並控制音樂 {#generate-music}

Lyria Realtime 的運作方式與[多模態 Live API](/docs/live-api/) 類似，同樣使用 WebSocket 與模型保持即時通訊。

以下程式碼示範如何生成音樂：


=== "Python"

      此範例使用 `client.aio.live.music.connect()` 初始化 Lyria Realtime 工作階段，接著以 `session.set_weighted_prompts()` 傳送初始提示詞，並以 `session.set_music_generation_config` 傳送初始設定，再用 `session.play()` 開始生成音樂，同時設定 `receive_audio()` 來處理收到的音訊區塊。

      ```python
        import asyncio
        from google import genai
        from google.genai import types

        client = genai.Client(http_options={'api_version': 'v1beta'})

        async def main():
            async def receive_audio(session):
              """Example background task to process incoming audio."""
              while True:
                async for message in session.receive():
                  audio_data = message.server_content.audio_chunks[0].data
                  # Process audio...
                  await asyncio.sleep(10**-12)

            async with (
              client.aio.live.music.connect(model='models/lyria-realtime-exp') as session,
              asyncio.TaskGroup() as tg,
            ):
              # Set up task to receive server messages.
              tg.create_task(receive_audio(session))

              # Send initial prompts and config
              await session.set_weighted_prompts(
                prompts=[
                  types.WeightedPrompt(text='minimal techno', weight=1.0),
                ]
              )
              await session.set_music_generation_config(
                config=types.LiveMusicGenerationConfig(bpm=90, temperature=1.0)
              )

              # Start streaming music
              await session.play()
        if __name__ == "__main__":
            asyncio.run(main())
      ```

      目標：如需更完整的程式碼範例，請參閱 cookbook 存放區中的 [Lyria RealTime - Get Started](https://colab.sandbox.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_LyriaRealTime.ipynb) 檔案。

=== "JavaScript"

      此範例使用 `client.live.music.connect()` 初始化 Lyria Realtime 工作階段，接著以 `session.setWeightedPrompts()` 傳送初始提示詞，並以 `session.setMusicGenerationConfig` 傳送初始設定，再用 `session.play()` 開始生成音樂，同時設定 `onMessage` 回呼來處理收到的音訊區塊。

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import Speaker from "speaker";

      const client = new GoogleGenAI({
        apiKey: GEMINI_API_KEY,
          apiVersion: "v1beta" ,
      });

      async function main() {
        const speaker = new Speaker({
          channels: 2,       // stereo
          bitDepth: 16,      // 16-bit PCM
          sampleRate: 44100, // 44.1 kHz
        });

        const session = await client.live.music.connect({
          model: "models/lyria-realtime-exp",
          callbacks: {
            onmessage: (message) => {
              if (message.serverContent?.audioChunks) {
                for (const chunk of message.serverContent.audioChunks) {
                  if (chunk.data) {
                    const audioBuffer = Buffer.from(chunk.data, "base64");
                    speaker.write(audioBuffer);
                  }
                }
              }
            },
            onerror: (error) => console.error("music session error:", error),
            onclose: () => console.log("Lyria RealTime stream closed."),
          },
        });

        await session.setWeightedPrompts({
          weightedPrompts: [
            { text: "Minimal techno with deep bass, sparse percussion, and atmospheric synths", weight: 1.0 },
          ],
        });

        await session.setMusicGenerationConfig({
          musicGenerationConfig: {
            bpm: 90,
            temperature: 1.0,
          },
        });

        await session.play();
      }

      await main();
      ```

      目標：如需更完整的程式碼範例，可試用 AI Studio 上的 [Prompt DJ](https://aistudio.google.com/apps/bundled/promptdj) 與 [MIDI DJ](https://aistudio.google.com/apps/bundled/promptdj-midi) 應用程式

      接著你可以使用 `session.play()`、`session.pause()`、`session.stop()` 與 `session.reset_context()` 來啟動、暫停、停止或重設工作階段。


## 即時引導音樂 {#steer-music}

你可以即時傳送提示詞並更新生成參數，藉此即時引導音樂生成。

### 對 Lyria Realtime 下提示詞 {#prompting-lyria}

串流進行期間，你可以隨時傳送新的 `WeightedPrompt` 訊息來改變生成的音樂，模型會根據新的輸入平順地轉換。

提示詞需遵循正確格式，包含 `text`（實際的提示詞）與 `weight`。`weight` 可為 `0` 以外的任何值，`1.0` 通常是很好的起點。


=== "Python"

      ```python
        from google.genai import types

        await session.set_weighted_prompts(
          prompts=[
            {"text": "Piano", "weight": 2.0},
            types.WeightedPrompt(text="Meditation", weight=0.5),
            types.WeightedPrompt(text="Live Performance", weight=1.0),
          ]
        )
      ```

=== "JavaScript"

      ```javaScript
        await session.setWeightedPrompts({
          weightedPrompts: [
            { text: 'Harmonica', weight: 0.3 },
            { text: 'Afrobeat', weight: 0.7 }
          ],
        });
      ```

      請注意，大幅更換提示詞時，模型的轉換可能會有點突兀，因此建議實作某種交叉淡化（cross-fading）手法，透過向模型傳送中間權重值來平滑過渡。


### 更新設定 {#steer-config}

你可以即時更新音樂生成參數來引導音樂生成。請注意，你不能只更新單一參數，必須設定完整的設定，否則其他欄位會被重設回預設值。

由於更新 bpm 或音階對模型而言是劇烈變化，你還需要呼叫 `reset_context()` 讓模型重設其上下文，才能納入新設定。這不會停止串流，但轉換會比較生硬。其他參數則無需這麼做。


=== "Python"

      ```python
        from google.genai import types

        await session.set_music_generation_config(
          config=types.LiveMusicGenerationConfig(
            bpm=128,
            scale=types.Scale.D_MAJOR_B_MINOR,
            music_generation_mode=types.MusicGenerationMode.QUALITY
          )
        )
        await session.reset_context();
      ```

=== "JavaScript"

      ```javaScript
        await session.setMusicGenerationConfig({
          musicGenerationConfig: {
            bpm: 120,
            density: 0.75,
            musicGenerationMode: MusicGenerationMode.QUALITY
          },
        });
        await session.reset_context();
      ```


## 對 Lyria RealTime 下提示詞 {#prompting-lyria-realtime}

Lyria RealTime 使用加權提示詞，動態混搭音樂曲風、樂器與氛圍。如需探索提示詞引導策略、關鍵字標籤詞彙與完整的提示詞範例，請參閱 [Lyria 提示詞指南](/docs/lyria-prompt-guide/#realtime-prompting)。

## 最佳做法 {#best-practices-music}

* 用戶端應用程式必須實作穩健的音訊緩衝，以確保播放順暢。這有助於應對網路抖動與生成延遲的微小變化。
* 有效的提示詞技巧：
  * 具體描述。使用形容詞描繪氛圍、曲風與樂器編制。
  * 逐步迭代與引導。與其完全更換提示詞，不如嘗試新增或修改元素，讓音樂更平順地演變。
  * 嘗試調整 `WeightedPrompt` 的權重，影響新提示詞對進行中生成的影響程度。


## 技術細節 {#technical-details-music}

本節說明使用 Lyria Realtime 音樂生成的具體細節。

### 規格 {#audio-specs}

* 輸出格式：原始 16 位元 PCM 音訊
* 取樣率：48kHz
* 聲道：2（立體聲）

### 控制項 {#controls}

傳送包含下列內容的訊息，即可即時影響音樂生成：

* `WeightedPrompt`：描述音樂構想、曲風、樂器、氛圍或特色的文字字串。可以提供多個提示詞來混搭不同的影響。如需如何為 Lyria Realtime 下出最佳提示詞的詳細資訊，請參閱[上文](/docs/realtime-music-generation/#steer-music)。
* `MusicGenerationConfig`：音樂生成程序的設定，會影響輸出音訊的特性。參數包括：
  * `guidance`：（float）範圍：`[0.0, 6.0]`。預設值：`4.0`。
    控制模型遵循提示詞的嚴格程度。guidance 越高，越貼合提示詞，但轉換也會更突兀。
  * `bpm`：（int）範圍：`[60, 200]`。
    設定生成音樂所需的每分鐘節拍數（Beats Per Minute）。你需要停止／播放或重設上下文，模型才會納入新的 bpm。
  * `density`：（float）範圍：`[0.0, 1.0]`。
    控制音符／聲音的密度。值越低，音樂越稀疏；值越高，音樂越「繁忙」。
  * `brightness`：（float）範圍：`[0.0, 1.0]`。
    調整音色品質。值越高，音訊聽起來越「明亮」，通常會強調較高的頻率。
  * `scale`：（Enum）
    設定生成所用的音樂音階（調性與調式）。請使用 SDK 提供的 [`Scale` 列舉值](/docs/realtime-music-generation/#scale-enum)。你需要停止／播放或重設上下文，模型才會納入新的 scale。
  * `mute_bass`：（bool）預設值：`False`。
    控制模型是否降低輸出中的低音。
  * `mute_drums`：（bool）預設值：`False`。
    控制模型是否降低輸出中的鼓聲。
  * `only_bass_and_drums`：（bool）預設值：`False`。
    引導模型嘗試只輸出低音與鼓聲。
  * `music_generation_mode`：（Enum）
    向模型指示應著重於音樂的 `QUALITY`（預設值）還是 `DIVERSITY`。也可以設為 `VOCALIZATION`，讓模型將人聲演唱作為另一種樂器來生成（將其加入為新的提示詞）。

* `PlaybackControl`：控制播放面向的指令，例如播放、暫停、停止或重設上下文。

對於 `bpm`、`density`、`brightness` 與 `scale`，若未提供值，模型會根據你的初始提示詞自行決定最佳設定。

較經典的參數如 `temperature`（0.0 至 3.0，預設 1.1）、`top_k`（1 至 1000，預設 40）與 `seed`（0 至 2 147 483 647，預設隨機選取），也可在 `MusicGenerationConfig` 中自訂。

#### Scale 列舉值 {#scale-enum}

以下是模型可接受的所有音階值：

| 列舉值 | 音階／調性 |
| :--- | :--- |
| `C_MAJOR_A_MINOR` | C 大調／A 小調 |
| `D_FLAT_MAJOR_B_FLAT_MINOR` | D♭ 大調／B♭ 小調 |
| `D_MAJOR_B_MINOR` | D 大調／B 小調 |
| `E_FLAT_MAJOR_C_MINOR` | E♭ 大調／C 小調 |
| `E_MAJOR_D_FLAT_MINOR` | E 大調／C♯/D♭ 小調 |
| `F_MAJOR_D_MINOR` | F 大調／D 小調 |
| `G_FLAT_MAJOR_E_FLAT_MINOR` | G♭ 大調／E♭ 小調 |
| `G_MAJOR_E_MINOR` | G 大調／E 小調 |
| `A_FLAT_MAJOR_F_MINOR` | A♭ 大調／F 小調 |
| `A_MAJOR_G_FLAT_MINOR` | A 大調／F♯/G♭ 小調 |
| `B_FLAT_MAJOR_G_MINOR` | B♭ 大調／G 小調 |
| `B_MAJOR_A_FLAT_MINOR` | B 大調／G♯/A♭ 小調 |
| `SCALE_UNSPECIFIED` | 預設／由模型決定 |

模型能夠引導演奏的音符，但不區分關係調。因此每個列舉值同時對應關係大調與關係小調。例如 `C_MAJOR_A_MINOR` 對應鋼琴上的全部白鍵，而 `F_MAJOR_D_MINOR` 則是除 B♭ 以外的全部白鍵。

### 限制 {#limitations}

* 僅限器樂：模型只生成器樂音樂。
* 安全性：提示詞會經過安全篩選器檢查。觸發篩選器的提示詞將被忽略，此時輸出中的 `filtered_prompt` 欄位會寫入說明。
* 浮水印：輸出音訊一律會加上浮水印以供識別，這符合我們的[負責任 AI](https://ai.google/responsibility/principles/) 原則。

## 後續步驟 {#next-steps}

* 參閱 [Lyria 提示詞指南](/docs/lyria-prompt-guide/)，了解提示詞策略與關鍵字詞彙、
* 使用 [Lyria 3.5](/docs/music-generation/) 生成完整歌曲與人聲曲目、
* 不做音樂，改為學習如何使用 [TTS 模型](/docs/speech-generation/) 生成多講者對話、
* 探索如何生成[圖片](/docs/image-generation/)或[影片](/docs/video/)、
* 不生成音樂或音訊，改為了解 Gemini 如何[理解音訊檔案](/docs/audio/)、
* 使用[多模態 Live API](/docs/live-api/) 與 Gemini 進行即時對話。

探索 [Cookbook](https://github.com/google-gemini/cookbook)，取得更多程式碼範例與教學。
