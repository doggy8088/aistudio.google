# Gemini 3.5 Transcribe：開發者指南

Gemini 3.5 Transcribe 為你的語音應用程式帶來低延遲、高準確率的語音轉文字、講者分離與智慧格式化功能。

作者：[Alisa Fortin](https://x.com/alisa_fortin)、[Thor Schaeff](https://x.com/thorwebdev)

**Gemini 3.5 Transcribe** 是我們專為高準確率、低延遲與強大的多語言語音理解而設計的先進專用語音轉文字模型套件。無論你是在打造即時字幕、對話式語音代理、智慧會議摘要，還是 Podcast 典藏，Gemini 3.5 Transcribe 都為開發者提供強大且多用途的語音辨識引擎，可用於：**使用 `gemini-3.5-transcribe-live` 即時串流**：透過 WebSocket 或 Google Gen AI SDK 以 [Live API](https://ai.google.dev/gemini-api/docs/live-api/live-transcribe) 連線，實現連續、次秒級延遲的語音轉文字。**使用 `gemini-3.5-transcribe` 轉錄音訊檔案**：透過 [Audio Transcription API](https://ai.google.dev/gemini-api/docs/transcribe) 轉錄最長 1 小時的錄音，具備講者分離與逐字時間戳記。你今天就可以在 [Google AI Studio](https://aistudio.google.com/) 中試用 Gemini 3.5 Transcribe，並運用我們的快速入門資源開始打造應用。

![Gemini 3.5 Transcribe 開發者總覽](https://ytimg.googleusercontent.com/vi/PWPsZssgfDo/maxresdefault.jpg)

## 先進的準確率與效能

相較於 Chirp 等前一代模型，Gemini 3.5 Transcribe 在語音辨識效能上有大幅躍進：**基準測試準確率**：在 Artificial Analysis 的語音轉文字基準測試中，Gemini 3.5 Transcribe 達到 **3.6% 的平均詞錯誤率（WER）**，在全球並列第二，僅落後第一名 0.2%。**卓越的多語言表現**：在完整的 [FLEURS 多語言基準測試](https://deepmind.google/models/gemini-audio/ai-transcription/#performance) 中，該模型在串流模式下達到 **5.50% 的 WER**，在批次檔案模式下達到 **5.04% 的 WER**。**吵雜與特定領域語音**：在具挑戰性的對話語音、吵雜的電話通話、重疊的音訊，以及訂單編號、電話號碼、電子郵件地址等英數字序列上，都能維持極低的 WER。

## 關鍵功能

Gemini 3.5 Transcribe 帶來多項進階功能，旨在提升各種應用中的語音辨識準確率與易用性。

### 涵蓋全球語言，自動語碼轉換

Gemini 3.5 Transcribe 能自動偵測 **85 種以上語言與方言** 的語音，無需手動設定。模型能流暢地處理句內與句間的語碼轉換，當講者在句子中途切換語言時也能即時適應。

### 自訂詞彙偏置

透過在要求中傳入最多 1,000 個詞彙的 `custom_vocabulary` 清單，讓語音辨識傾向辨識特定領域術語、罕見行話、公司名稱或專有名詞。這能確保技術對話、醫療術語與品牌名稱的高精確度。

### 講者分離與時間戳記

對於預錄的音訊檔案，Gemini 3.5 Transcribe 能區分錄音中不同的聲音，為每個片段標上講者標籤（例如 `spk_1` 與 `spk_2`）。它還為每個辨識出的詞彙提供毫秒級精確的開始與結束時間偏移，讓你輕鬆產生同步字幕、可導覽的音訊播放器，以及標註講者的逐字稿。

### 智慧轉錄，產生乾淨易讀的文字

Gemini 3.5 Transcribe 導入了 **智慧轉錄模式**（`mode: {"type": "smart"}`），超越逐字照錄的語音辨識，提供精緻、可直接閱讀的逐字稿：**移除不流暢語句**：濾除對話中的贅詞（“um”、“uh”、“ like”、“you know”）、口吃與說錯後重新開頭的句子。**行內自我修正**：自然地處理口語中的改口（例如 “*Let's meet on Tuesday, actually no, Wednesday at 2*” 變成 “*Let's meet on Wednesday at 2:00 PM*”）。**結構化格式**：自動把口述清單格式化為編號項目或項目符號、格式化日期與貨幣，並套用正確的標點與句首大寫。

![比較表格，顯示口語音訊與智慧轉錄模式輸出的對照。第一列：口語的遲疑 'Um, so for the meeting, I think we should, uh, invite Alice and, wait no, Bob and Carol' 清理後變成 'For the meeting, I think we should invite Bob and Carol.'。第二列：連續語音 'First item review budget second item finalize timeline third item send recap' 被轉換成包含三個項目的格式化編號清單。](https://www.gstatic.com/aistudio-static/editorial/gemini-3-5-transcribe-developer-guide/996b394c.png)

## 為 Google 各產品的語音體驗提供動力

Gemini 3.5 Transcribe 已為 Google 生態系中的進階語音功能提供動力，包括 Android 上的 Gboard 與 macOS 上的 Gemini App，並即將登陸 Chrome 瀏覽器。在 Google Antigravity 中，它運用螢幕上下文與編輯器狀態，在檔名、終端機指令與開啟中的程式碼文件上實現精準的轉錄準確率。

## 開始用 Gemini API 打造應用

上傳一段錄音，並以講者分離、逐字時間戳記與自訂詞彙進行轉錄。

```
from google import genai

client = genai.Client()

audio_file = client.files.upload(file="path/to/sample.mp3")

interaction = client.interactions.create(
    model="gemini-3.5-transcribe",
    input=[
        {
            "type": "audio",
            "uri": audio_file.uri,
            "mime_type": audio_file.mime_type,
        }
    ],
    generation_config={
        "transcription_config": {
        "mode": "smart",
        }
    },
)

print(interaction.output_text)
```

#### 即時直播串流轉錄

透過低延遲的雙向 WebSocket 連線，使用 `gemini-3.5-transcribe-live` 串流麥克風音訊。

```
import asyncio
from google import genai
from google.genai import types

client = genai.Client()
model = "gemini-3.5-transcribe-live"

config = types.LiveConnectConfig(
    response_modalities=["TEXT"],
    input_audio_transcription=types.AudioTranscriptionConfig(
        language_codes=[],  # Automatic language detection across 85+ languages
        mode="SMART",        # Smart transcription mode with disfluency removal
    ),
)

async def main():
    async with client.aio.live.connect(model=model, config=config) as session:
        print("Connected to Live Transcription")

        # Receive streaming interim hypotheses and final transcripts
        async for response in session.receive():
            server_content = response.server_content
            if not server_content:
                continue

            # Real-time interim preview for live captions
            if server_content.interim_input_transcription:
                print(f"
[Interim] {server_content.interim_input_transcription.text}", end="", flush=True)

            # Finalized transcript
            if server_content.input_transcription:
                print(f"
[Final] {server_content.input_transcription.text}")

if __name__ == "__main__":
    asyncio.run(main())
```

## 企業版供應情況

Gemini 3.5 Transcribe 也透過 [Gemini Enterprise Agent Platform](https://console.cloud.google.com/agent-platform/studio/multimodal-live?model=gemini-3.5-transcribe-live-preview) 提供給企業客戶，並即將登陸 [Gemini Enterprise for Customer Experience](https://cloud.google.com/gemini-enterprise-cx)。

## 探索開發者資源

**Google AI Studio**：在 [AI Studio Live Playground](https://aistudio.google.com/live?model=gemini-3.5-transcribe-live) 中試用此模型。**Cookbook**：探索 [Gemini 3.5 Transcribe 快速入門筆記本](https://colab.research.google.com/drive/1py8z3YscD9SaYBshBW7k6y6V6TbcB8PF?usp=sharing)，取得端到端的實作範例。**文件**：查看 [音訊轉錄指南](https://ai.google.dev/gemini-api/docs/transcribe) 與 [即時轉錄指南](https://ai.google.dev/gemini-api/docs/live-api/live-transcribe)。**模型卡**：在 [Gemini 3.5 Transcribe 模型總覽](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-transcribe) 了解更多。
