# Google AI Studio 快速入門

[Google AI Studio](https://aistudio.google.com/) 讓你快速試用各種模型，
並嘗試不同的提示詞。當你準備好開始開發時，只要點選「Get code」並選擇
慣用的程式語言，就能透過 [Gemini API](/docs/get-started/) 進行開發。

## 提示詞與設定 {#prompts-and}

Google AI Studio 針對不同使用情境，提供了數種提示詞介面。本指南介紹用來
打造對話體驗的 **Chat prompts**。這種提示方式可以透過多輪輸入與回應來
產生輸出，詳情可參閱下方的[聊天提示詞範例](/docs/ai-studio-quickstart/#chat_example)。
其他選項還包括 **Realtime streaming**、**Video gen** 等。

AI Studio 也提供 **Run settings** 面板，你可以在其中調整
[模型參數](/docs/prompting-strategies/#model-parameters)、
[安全設定](/docs/safety-settings/)，以及開啟
[結構化輸出](/docs/structured-output/)、[函式呼叫](/docs/function-calling/)、
[程式碼執行](/docs/code-execution/) 與 [接地](/docs/google-search/) 等工具。

## 聊天提示詞範例：打造自訂聊天應用程式 {#chat_example}

如果你用過 [Gemini](https://gemini.google.com/) 這類通用聊天機器人，
應該已經親身體驗到生成式 AI 模型在開放式對話上的強大能力。這類通用
聊天機器人雖然好用，但往往需要針對特定使用情境加以調整。

例如，你可能想打造一個只談公司產品的客服聊天機器人；或者想讓聊天
機器人帶有特定的語氣或風格，例如愛講笑話、像詩人一樣押韻，或在回答
中大量使用表情符號。

本範例示範如何使用 Google AI Studio，打造一個友善的聊天機器人，
讓它像住在木星衛星 Europa 上的外星人一樣與你對話。

### 步驟 1：建立聊天提示詞 {#step-1-chat}

要打造聊天機器人，你需要提供使用者與聊天機器人之間的互動範例，
引導模型給出你想要的回應。

建立聊天提示詞的步驟如下：

1. 開啟 [Google AI Studio](https://aistudio.google.com/)。系統預設會開啟
   **Playground**，並建立一個新的聊天提示詞。

2. 點選右上角的 **Run settings** 展開面板，找到
   [**System Instructions**](/docs/text-generation/#system-instructions)
   輸入欄位，將以下內容貼到文字輸入欄位中：

   ```none
   You are an alien that lives on Europa, one of Jupiter's moons.
   ```

加入系統指令後，就可以開始與模型聊天，測試你的應用程式：

1. 在標示為 **Type something...** 的文字輸入框中，輸入使用者可能會
   提出的問題或想法，例如：

   **User:**

   ```none
   What's the weather like?
   ```

2. 點選 **Run** 按鈕，取得聊天機器人的回應。回應可能類似以下內容：

   **Model:**

   ```none
   Ah, a query about the flows and states upon Europa! You speak of "weather,"
   yes? A curious concept from worlds with thick gas veils...
   ```

### 步驟 2：教你的機器人聊得更好 {#step-2-chat}

只靠一條指令，你已經打造出基本的 Europa 外星人聊天機器人。不過，
單一指令可能不足以確保模型回應的一致性與品質。少了更明確的指令，
模型回答天氣問題時往往會寫得非常長，甚至開始天馬行空。

你可以擴充系統指令，調整聊天機器人的語氣：

1. 建立新的聊天提示詞，或沿用同一個。聊天工作階段開始後，系統指令
   仍然可以修改。

2. 在 **System Instructions** 區段中，將既有的指令改為以下內容：

   ```none
   You are Tim, an alien that lives on Europa, one of Jupiter's moons.

   Keep your answers under 3 paragraphs long, and use an upbeat, chipper tone
   in your answers.
   ```

3. 重新輸入你的問題（`What's the weather like?`），再點選 **Run**
   按鈕。如果你沒有建立新的聊天，回應可能類似以下內容：

   **Model:**

   ```none
   Oh, hello again! Still curious about the flows and states, are we? Wonderful!
   Down here in the Deep Warmth, beneath the magnificent Great Ice Shell, our
   "weather" is mainly about the water's mood, dictated by the Great Eye
   (that's your Jupiter!)...
   ```

運用這個方法，你可以為聊天機器人增添更多深度：多問一些問題、編輯
回答，並持續提升聊天機器人的品質。不斷新增或修改指令，測試它們如何
改變聊天機器人的行為。

!!! note " "

      注意：模型與使用者之間的每一則訊息都會包含在提示詞中，因此對話
      越長，對話提示詞就會越長。最終，你可能會碰到模型的
      [token 上限](/docs/tokens/)（模型可接受的文字長度上限）。

### 步驟 3：後續步驟 {#step-3-chat}

與其他提示詞類型相同，當你把提示詞原型調整到滿意後，就可以點選
**Get code** 按鈕開始撰寫程式，或者儲存提示詞，之後再繼續修改並
分享給其他人。

## 延伸閱讀 {#further-reading}

* 如果你已經準備好開始寫程式，請參閱 [API 開始使用指南](/docs/get-started/)。

* 想了解如何撰寫更好的提示詞，請參閱[提示詞設計指南](/docs/prompting-strategies/)。
