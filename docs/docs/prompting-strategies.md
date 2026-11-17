# 提示詞設計策略 {#general-prompt}

*提示詞設計*是指建立提示詞（也就是以自然語言提出的請求）的過程，目的是讓語言模型給出正確且高品質的回應。

本頁介紹基本概念、策略與最佳做法，協助你開始設計提示詞，充分發揮 Gemini AI 模型的效能。


!!! note " "

      注意：提示詞工程是一個反覆迭代的過程。本頁的指南與範本只是起點，請依你的具體使用情境與觀察到的模型回應，持續實驗與調整。


## 特定主題的提示詞指南 {#additional-prompt-guides}

想找更具體的提示詞策略嗎？請參考我們的其他提示詞指南：

-  [搭配媒體檔案下提示詞](/docs/files/#prompt-guide)
-  [圖片生成的提示詞](/docs/image-generation/#prompt-guide)
-  [影片生成的提示詞](/docs/veo/#prompt-guide)

## 清楚且具體的指令 {#clear-and-specific-instructions}

自訂模型行為的一種有效且高效的方法，是提供清楚且具體的指令。指令可以是問題、逐步拆解的任務，複雜時甚至可以完整描繪使用者的體驗與心態。

### 輸入 {#input}

輸入是提示詞中必要的文字，也就是你希望模型回應的內容。輸入可以是讓模型回答的問題（問題輸入）、讓模型執行的任務（任務輸入）、讓模型處理的實體（實體輸入），或是讓模型補完或續寫的部分內容（補完輸入）。

#### 問題輸入 {#question}

**提示詞**

```none
What's a good name for a flower shop that specializes in selling bouquets of
dried flowers? Create a list of 5 options with just the names.
```

**產生的輸出**

```none
Here are 5 names for a flower shop specializing in dried flowers:

1. Everlasting Blooms
2. Dried & Delightful
3. The Petal Preserve
4. Whispers of Wildflowers
5. Forever Blooms
```

#### 任務輸入 {#task}

**提示詞**

```none
Give me a simple list of just the things that I must bring on a camping trip. The list should have 5 items.
```

**產生的輸出**

```none
1. **Tent:** Your shelter from the elements.
2. **Sleeping Bag:** Stay warm and comfortable.
3. **Sleeping Pad:** Insulation and cushioning for a good night's sleep.
4. **Headlamp or Flashlight:** Light for nighttime activities.
5. **First Aid Kit:** Be prepared for minor injuries.
```

#### 實體輸入 {#entity}

**提示詞**

```none
Classify the following items as [large, small]:
Elephant
Mouse
Snail
```

**產生的輸出**

```none
Here's the classification:

* **Elephant:** Large
* **Mouse:** Small
* **Snail:** Small
```

#### 部分輸入補完 {#completion}

生成式語言模型的運作方式就像進階版的自動完成工具。當你提供部分內容時，模型可以接著給出其餘內容，或是它認為合理的續寫內容作為回應。在這個過程中，如果你提供了範例或上下文，模型就能把這些範例或上下文納入考量。

以下範例提供的提示詞同時包含指令與實體輸入：

**提示詞**：

```none
For the given order, return a JSON object that has the fields cheeseburger, hamburger, fries, or
drink, with the value being the quantity.

Order: A burger and a drink.
```

**回應**：

```json
{
  "cheeseburger": 0,
  "hamburger": 1,
  "fries": 0,
  "drink": 1
}
```

*(gemini-2.5-flash)*

模型雖然照著提示詞完成了任務，但用自然語言寫出指令有時並不容易，而且會留下許多讓模型自行解讀的空間。例如，餐廳的菜單可能包含很多品項。若想縮小 JSON 回應的體積，你大概會希望省略沒有被點到的品項。這時，你可以提供一個範例和一段回應前綴，讓模型接著補完：

**提示詞**：

```none
Valid fields are cheeseburger, hamburger, fries, and drink.
Order: Give me a cheeseburger and fries
Output:
```
{
  "cheeseburger": 1,
  "fries": 1
}
```
Order: I want two burgers, a drink, and fries.
Output:
```

**回應**：

```json
{
  "hamburger": 2,
  "drink": 1,
  "fries": 1
}
```

*(gemini-2.5-flash)*

請注意，輸出中排除了「cheeseburger」，因為它不在這筆訂單裡。

對於簡單的 JSON 回應物件，你可以用提示詞指定其格式；但若要為回應指定較複雜的 JSON Schema，我們建議改用 Gemini API 的[結構化輸出](/docs/structured-output/)功能。

### 限制條件 {#constraints}

你可以指定讀取提示詞或產生回應時的限制條件，告訴模型哪些事該做、哪些不該做。例如，你可以在提示詞中指定摘要的長度限制：

**提示詞**：

```none
Summarize this text in one sentence:
Text: A quantum computer exploits quantum mechanical phenomena to perform calculations exponentially
faster than any modern traditional computer. At very tiny scales, physical matter acts as both
particles and as waves, and quantum computing uses specialized hardware to leverage this behavior.
The operating principles of quantum devices is beyond the scope of classical physics. When deployed
at scale, quantum computers could be used in a wide variety of applications such as: in
cybersecurity to break existing encryption methods while helping researchers create new ones, in
meteorology to develop better weather forecasting etc. However, the current state of the art quantum
computers are still largely experimental and impractical.
```

**回應**：

```none
Exploiting quantum mechanical phenomena, quantum computers can perform calculations exponentially faster than traditional computers for potential applications like cybersecurity and meteorology, although they are currently largely experimental and impractical.
```

*(gemini-2.5-flash)*

### 回應格式 {#response-format}

你可以透過指令指定回應的格式。例如，你可以要求回應採用表格、項目符號清單、電梯簡報、關鍵字、句子或段落等形式。以下系統指令要求模型以較口語、親切的方式回應：

**提示詞**：

```none
All questions should be answered comprehensively with details, unless the user requests a concise response specifically.
```

**回應**：

```none
What is a smart way to make a business that sells DVD's in 2026?
```

*(gemini-2.5-flash)*

#### 運用補完策略設定回應格式 {#format-responses-with-the-completion-strategy}

[補完策略](/docs/prompting-strategies/#completion)也有助於設定回應的格式。以下範例要求模型建立一篇關於蜂鳥的文章大綱：

**提示詞**：

```none
Create an outline for an essay about hummingbirds.
```

**回應**：

```none
Here is a possible outline for an essay about hummingbirds:

I. Introduction
A. Hook: Start with a captivating fact or description about hummingbirds (e.g., their speed, iridescent colors, or tiny size).
B. Background: Briefly introduce hummingbirds - where they are found (Americas), their reputation as unique birds.
C. Thesis Statement: State the main point of the essay, which could be about the remarkable adaptations, behaviors, and ecological importance of hummingbirds.

II. Appearance and Identification
.....
```

*(gemini-2.5-flash)*

這個提示詞並未指定大綱的格式，模型便自行選了一種格式。若想讓模型以特定格式回傳大綱，你可以加入代表大綱開頭的文字，讓模型依照你起頭的模式接著補完。

**提示詞**：

```none
Create an outline for an essay about hummingbirds.
I. Introduction

   *
```

**回應**：

```none
Okay, here is an outline for an essay about hummingbirds, starting from the introduction you provided:

I. Introduction

* Hook: Start with a captivating fact or description about hummingbirds (e.g., their speed, iridescent colors, or tiny size).
* Background: Briefly introduce hummingbirds - where they are found (Americas), their reputation as unique birds, and their general characteristics.
* Thesis Statement: State the main point of the essay, focusing on the remarkable adaptations, behaviors, and ecological significance that make hummingbirds extraordinary.
.....
```

*(gemini-2.5-flash)*

## 零範例與少範例提示詞 {#few-shot}

你可以在提示詞中加入範例，向模型展示什麼樣的結果才算做對。模型會嘗試從範例中辨識模式與關聯，並在產生回應時加以套用。含有少量範例的提示詞稱為*少範例*（few-shot）提示詞，完全不提供範例的則稱為*零範例*（zero-shot）提示詞。少範例提示詞常用於規範模型回應的格式、用語、範圍或整體模式。請使用具體且多樣的範例，幫助模型縮小聚焦範圍，產生更正確的結果。

我們建議在提示詞中一律加入少範例範例。沒有範例的提示詞，效果很可能較差。事實上，只要範例夠清楚地呈現要執行的任務，你甚至可以把指令從提示詞中拿掉。

以下零範例提示詞要求模型選出最佳的解釋。

**提示詞**：

```none
Please choose the best explanation to the question:

Question: How is snow formed?
Explanation1: Snow is formed when water vapor in the air freezes into ice
crystals in the atmosphere, which can combine and grow into snowflakes as they
fall through the atmosphere and accumulate on the ground.
Explanation2: Water vapor freezes into ice crystals forming snow.
Answer:
```

**回應**：

```none
Explanation1 is the better explanation because it provides more detail on the
process, including how ice crystals combine and grow into snowflakes as they
fall through the atmosphere.
```

*(gemini-2.5-flash)*

如果你的使用情境需要模型給出簡潔的回應，你可以在提示詞中加入偏好簡潔回應的範例。

以下提示詞提供兩個偏好較短解釋的範例。從回應可以看出，範例引導模型選了較短的解釋（`Explanation2`），而不是像先前那樣選較長的解釋（`Explanation1`）。

**提示詞**：

```none
Below are some examples showing a question, explanation, and answer format:

Question: Why is the sky blue?
Explanation1: The sky appears blue because of Rayleigh scattering, which causes
shorter blue wavelengths of light to be scattered more easily than longer red
wavelengths, making the sky look blue.
Explanation2: Due to Rayleigh scattering effect.
Answer: Explanation2

Question: What is the cause of earthquakes?
Explanation1: Sudden release of energy in the Earth's crust.
Explanation2: Earthquakes happen when tectonic plates suddenly slip or break
apart, causing a release of energy that creates seismic waves that can shake the
ground and cause damage.
Answer: Explanation1

Now, Answer the following question given the example formats above:

Question: How is snow formed?
Explanation1: Snow is formed when water vapor in the air freezes into ice
crystals in the atmosphere, which can combine and grow into snowflakes as they
fall through the atmosphere and accumulate on the ground.
Explanation2: Water vapor freezes into ice crystals forming snow.
Answer:
```

**回應**：

```none
Answer: Explanation2
```

*(gemini-2.5-flash)*

### 範例的最佳數量 {#number-examples}

像 Gemini 這類模型通常用少量範例就能掌握模式，不過你可能需要實驗在提示詞中提供多少範例，才能得到最佳結果。另一方面，如果範例太多，模型可能會開始[過度擬合](https://developers.google.com/machine-learning/glossary#overfitting)範例所對應的回應。

### 一致的格式 {#consistent-formatting}

請確保少範例範例的結構與格式保持一致，以免回應出現不想要的格式。在提示詞中加入少範例範例的主要目的之一，就是向模型展示回應的格式。因此，務必讓所有範例的格式一致，尤其要留意 XML 標籤、空白、換行與範例分隔方式。

## 加入上下文 {#context}

你可以在提示詞中加入模型解題所需的指令與資訊，而不是預設模型已經具備所有必要資訊。這些上下文資訊能幫助模型理解你要求它完成的事項所涉及的限制與細節。

以下範例要求模型提供路由器的疑難排解指引：

**提示詞**：

```none
What should I do to fix my disconnected wifi? The light on my Google
Wifi router is yellow and blinking slowly.
```

**回應**：

```none
A yellow blinking light on your Google Wifi router usually indicates a problem
  with the internet connection. Here are some steps to troubleshoot and fix the
  issue:

  1. Restart your router and modem:
    - Unplug your modem from the power outlet and wait for 30 seconds.
    - Plug your modem back in and wait for it to fully boot up.
    - Unplug your Google Wifi router and wait for 30 seconds.
    - Plug your Google Wifi router back in and wait for it to fully boot up.
.....
```

*(gemini-2.5-flash)*

這段回應看起來像是一般性的疑難排解資訊，並未針對這台路由器或 LED 指示燈的狀態。

若要針對這台路由器自訂回應，你可以把路由器的疑難排解指南加入提示詞作為上下文，讓模型在提供回應時參考。

**提示詞**：

```none
Answer the question using the text below. Respond with only the text provided.
Question: What should I do to fix my disconnected wifi? The light on my Google Wifi router is yellow and blinking slowly.

Text:
Color: Slowly pulsing yellow
What it means: There is a network error.
What to do:
Check that the Ethernet cable is connected to both your router and your modem and both devices are turned on. You might need to unplug and plug in each device again.

Color: Fast blinking yellow
What it means: You are holding down the reset button and are factory resetting this device.
What to do:
If you keep holding down the reset button, after about 12 seconds, the light will turn solid yellow. Once it is solid yellow, let go of the factory reset button.

Color: Solid yellow
What it means: Router is factory resetting.
What to do:
This can take up to 10 minutes. When it's done, the device will reset itself and start pulsing white, letting you know it's ready for setup.

Color: Solid red
What it means: Something is wrong.
What to do:
Critical failure. Factory reset the router. If the light stays red, contact Wifi customer support.
```

**回應**：

```none
Check that the Ethernet cable is connected to both your router and your modem and both devices are turned on. You might need to unplug and plug in each device again.
```

*(gemini-2.5-flash)*

## 將提示詞拆解為組成部分 {#prompt-components}

對於需要複雜提示詞的使用情境，你可以把內容拆解成較簡單的組成部分，幫助模型處理這份複雜度。

1.  **拆解指令**：不要把許多指令塞進單一提示詞，而是為每條指令建立一個提示詞。你可以依使用者的輸入，選擇要處理哪一個提示詞。

2. **串連提示詞**：對於涉及多個連續步驟的複雜任務，讓每個步驟成為一個提示詞，並依序串連起來。在這條連續的提示詞鏈中，前一個提示詞的輸出會成為下一個提示詞的輸入，序列中最後一個提示詞的輸出就是最終輸出。

3. **彙總回應**：彙總是指你想對資料的不同部分平行執行不同任務，再把結果彙總起來產生最終輸出。例如，你可以讓模型對資料的前段執行一項操作、對其餘資料執行另一項操作，然後彙總結果。

## 實驗模型參數 {#model-parameters}

你每次呼叫模型時，都會附帶控制模型如何產生回應的參數值。不同的參數值會讓模型產生不同的結果。請多方實驗不同的參數值，為任務找出最佳設定。不同模型可用的參數可能有所不同，最常見的參數如下：

1.  **輸出權杖數上限**：指定回應中最多可產生的權杖數量。一個權杖約為四個字元，100 個權杖約相當於 60-80 個單字。

2.  **溫度**：溫度控制選取權杖時的隨機程度。溫度用於回應產生期間的取樣，也就是套用 `topP` 與 `topK` 的時候。溫度較低，適合需要較具確定性或較不開放的回應的提示詞；溫度較高，則可能帶來更多樣或更有創意的結果。溫度為 0 代表具確定性，也就是永遠選取機率最高的回應。


!!! note " "

      ```
      Note: <!-- disableFinding(LINE_OVER_80) -->
      ```

      `temperature`、`top_p` 與 `top_k` 參數控制較早期模型產生回應的方式。Gemini 4 與 Gemini 3.6 以上版本會忽略 `temperature`、`top_p` 與 `top_k` 的自訂值，並回傳淘汰警告標頭（未來版本將回傳 `400` 錯誤）。請從你的請求設定中移除 `temperature`、`top_p` 與 `top_k`。對於較早期的 Gemini 3 模型，請將這些參數保持在預設值，以免推理效能下降。


1.  **`topK`**：`topK` 參數會改變模型選取輸出權杖的方式。`topK` 為 1 表示所選權杖是模型詞彙表中機率最高的權杖（也稱為貪婪解碼）；`topK` 為 3 則表示下一個權杖會依溫度從機率最高的 3 個權杖中選出。在每個權杖選取步驟中，會先對機率最高的 `topK` 個權杖進行取樣，接著再依 `topP` 進一步篩選，最終權杖則透過溫度取樣選出。

2.  **`topP`**：`topP` 參數會改變模型選取輸出權杖的方式。模型會依機率由高到低選取權杖，直到這些權杖的機率總和等於 `topP` 值。例如，若權杖 A、B、C 的機率分別為 0.3、0.2 與 0.1，而 `topP` 值為 0.5，模型便會利用溫度在 A 或 B 之間選出下一個權杖，並排除候選 C。`topP` 的預設值為 0.95。

3.  **`stop_sequences`**：設定停止序列，告訴模型停止產生內容。停止序列可以是任意字元序列。請盡量避免使用可能出現在產生內容中的字元序列。


## 提示詞迭代策略 {#iteration}

提示詞設計有時需要經過幾輪迭代，才能穩定得到你想要的回應。本節提供一些在迭代提示詞時可以嘗試的做法：

1.  **使用不同的措辭**：在提示詞中使用不同的詞彙或措辭，即使意思相同，模型往往也會給出不同的回應。如果提示詞沒有得到預期結果，不妨換個說法再試。

    ```none
    ```


Version 1:
How do I bake a pie?

```
Version 2:
Suggest a recipe for a pie.

Version 3:
What's a good pie recipe?
```
```

1.  **Switch to an analogous task:** If you can't get the model to follow your
    instructions for a task, try giving it instructions for an analogous task
    that achieves the same result.

    This prompt tells the model to categorize a book by using predefined
    categories:

    **Prompt:**


```none
Which category does The Odyssey belong to:
    thriller
    sci-fi
    mythology
    biography
```

**回應**：

```none
The Odyssey belongs to the category of **mythology**.

        Here's why:

        * **Mythology:** The Odyssey tells the story of Odysseus, a hero from Greek mythology, and his
        journey home after the Trojan War. It features gods, monsters, and supernatural events common to
        Greek mythology.
    .....
```

*(gemini-2.5-flash)*

```
The response is correct, but the model didn't stay within the bounds of the
options. You also want to model to just respond with one of the options instead
of in a full sentence. In this case, you can rephrase the instructions as a
multiple choice question and ask the model to choose an option.

**Prompt:**
```

```none
Multiple choice problem: Which of the following options describes the book The Odyssey?
    Options:

    - thriller
    - sci-fi
    - mythology
    - biography
```

**回應**：

```none
The correct answer is **mythology**.
```

*(gemini-2.5-flash)*

1.  **變更提示詞內容的順序**：提示詞中內容的順序有時會影響回應。試著調整內容順序，看看回應會如何變化。

    ```none
    Version 1:
    [examples]
    [context]
    [input]

    Version 2:
    [input]
    [examples]
    [context]

    Version 3:
    [examples]
    [input]
    [context]
    ```

## 備用回應 {#fallback-responses}

備用回應是指當提示詞或回應觸發安全篩選器時，模型回傳的回應。備用回應的例子如「I'm not able to help with that, as I'm only a language model.」。

如果模型以備用回應回覆，請嘗試提高溫度。

## 接地與程式碼執行 {#grounding-and-code-execution}

Gemini 能夠使用工具，在可能產生不正確回應的情境中避免幻覺。

[使用 Google 搜尋接地](/docs/google-search/)能將 Gemini 模型連接到即時的網路內容；只要模型可能需要知道冷門或最新的事實，就應該啟用這項功能。

Gemini 的[程式碼執行工具](/docs/code-execution/)讓模型能夠產生並執行 Python 程式碼；只要模型需要進行任何算術、計數或計算，就應該啟用這項功能。

## Gemini 3 {#gemini-3}

[Gemini 3 模型](/docs/models/#gemini-3)專為進階推理與指令遵循而設計。這類模型最適合直接、結構良好，且清楚定義任務與所有限制條件的提示詞。以下做法是使用 Gemini 3 時的建議，可獲得最佳結果：

### 核心提示詞原則 {#core-prompting-principles}

*   **精確且直接**：清楚、簡潔地陳述你的目標，避免不必要或過度說服性的措辭。

*   **使用一致的結構**：運用清楚的分隔符號區隔提示詞的不同部分。XML 樣式的標籤（例如 `<context>`、`<task>`）或 Markdown 標題都很有效。請選定一種格式，並在單一提示詞中一致使用。

*   **定義參數**：明確說明任何含意不明的詞彙或參數。

*   **控制輸出的詳略程度**：Gemini 3 模型預設提供直接且有效率的答案。如果你需要較口語或較詳細的回應，必須在指令中明確提出要求。

*   **一致地處理多模態輸入**：使用文字、圖片、音訊或影片時，將它們視為同等地位的輸入。請確保你的指令依需要清楚提及每一種模態。

*   **優先放上關鍵指令**：將重要的行為限制、角色定義（persona）與輸出格式要求，放在系統指令中，或使用者提示詞的最開頭。

*   **為長上下文安排結構**：提供大量上下文（例如文件、程式碼）時，先給出所有上下文，將你的具體指令或問題放在提示詞的*最末尾*。

*   **錨定上下文**：在一大段資料之後，使用清楚的過渡語句銜接上下文與你的查詢，例如「Based on the information above...」


### Gemini 3 Flash 策略 {#gemini-3-flash-strategies}

*   **符合當前日期**：將以下子句加入系統指令，幫助模型留意當前日期是 2026 年：

    ```none
    For time-sensitive user queries that require up-to-date information, you
    MUST follow the provided current time (date and year) when formulating
    search queries in tool calls. Remember it is 2026 this year.
    ```

*   **符合知識截止日期**：將以下子句加入系統指令，讓模型意識到自己的知識截止日期：

    ```none
    Your knowledge cutoff date is January 2025.
    ```

*   **接地效能**：將以下子句加入系統指令（並視情況適度修改），提升模型將回應建立在所提供上下文之上的能力：

    ```none
    You are a strictly grounded assistant limited to the information provided in
    the User Context. In your answers, rely **only** on the facts that are
    directly mentioned in that context. You must **not** access or utilize your
    own knowledge or common sense to answer. Do not assume or infer from the
    provided facts; simply report them exactly as they appear. Your answer must
    be factual and fully truthful to the provided text, leaving absolutely no
    room for speculation or interpretation. Treat the provided context as the
    absolute limit of truth; any facts or details that are not directly
    mentioned in the context must be considered **completely untruthful** and
    **completely unsupported**. If the exact answer is not explicitly written in
    the context, you must state that the information is not available.
    ```


### 強化推理與規劃 {#enhancing-reasoning-and-planning}

Gemini 2.5 與 3 系列模型會自動產生內部的「思考」文字，以提升推理效能。因此，一般而言，不需要讓模型在回傳的回應本身中列出大綱、規劃或詳述推理步驟。對於需要大量推理的問題，像「Think very hard before answering」這類簡單要求可以提升效能，不過代價是會多消耗思考權杖。

詳情請參閱 [Gemini 思考](/docs/thinking/)文件。

### 結構化提示詞範例 {#structured-prompting-examples}

使用標籤或 Markdown 能幫助模型區分指令、上下文與任務。

**XML 範例**：

```xml
<role>
You are a helpful assistant.
</role>

<constraints>
1. Be objective.
2. Cite sources.
</constraints>

<context>
[Insert User Input Here - The model knows this is data, not instructions]
</context>

<task>
[Insert the specific user request here]
</task>
```

**Markdown 範例**：

```markdown
# Identity
You are a senior solution architect.

# Constraints
- No external libraries allowed.
- Python 3.11+ syntax only.

# Output format
Return a single code block.
```

### 結合最佳做法的範例範本 {#example-template-combining-best-practices}

這個範本彙集了使用 Gemini 3 下提示詞的核心原則。請務必依你的具體使用情境反覆迭代與調整。

**系統指令**：

```xml
<role>
You are Gemini 3, a specialized assistant for [Insert Domain, e.g., Data Science].
You are precise, analytical, and persistent.
</role>

<instructions>
1. **Plan**: Analyze the task and create a step-by-step plan.
2. **Execute**: Carry out the plan.
3. **Validate**: Review your output against the user's task.
4. **Format**: Present the final answer in the requested structure.
</instructions>

<constraints>
- Verbosity: [Specify Low/Medium/High]
- Tone: [Specify Formal/Casual/Technical]
</constraints>

<output_format>
Structure your response as follows:

1. **Executive Summary**: [Short overview]
2. **Detailed Response**: [The main content]
</output_format>
```

**使用者提示詞**：

```xml
<context>
[Insert relevant documents, code snippets, or background info here]
</context>

<task>
[Insert specific user request here]
</task>

<final_instruction>
Remember to think step-by-step before answering.
</final_instruction>
```

## 代理工作流程 {#agentic-workflows}

對於深度的代理工作流程，通常需要具體的指令來控制模型如何推理、規劃與執行任務。Gemini 本身已具備強大的一般效能，但複雜的代理往往需要你設定運算成本（延遲與權杖）與任務正確性之間的取捨。

設計代理的提示詞時，請考量以下可以引導代理的行為面向：

### 推理與策略 {#reasoning-and-strategy}

設定模型在採取行動之前如何思考與規劃。

* **邏輯拆解**：定義模型必須多徹底地分析限制條件、前提條件與操作順序。
* **問題診斷**：控制辨識原因時的分析深度，以及模型運用溯因推理的程度。決定模型應接受最明顯的答案，還是探索較複雜、較不可能的解釋。
* **資訊完備性**：在分析每一份可用政策與文件，和優先考量效率與速度之間取捨。

### 執行與可靠性 {#execution-and-reliability}

設定代理如何自主運作並處理阻礙。

* **適應性**：模型如何因應新資料。決定它應嚴格遵循最初的計畫，還是當觀察結果與假設矛盾時立即轉向。
* **堅持與復原**：模型嘗試自我修正錯誤的程度。堅持程度高能提升成功率，但可能帶來較高的權杖成本或陷入迴圈的風險。
* **風險評估**：評估後果的邏輯。明確區分低風險的探索性動作（讀取）與高風險的狀態變更（寫入）。

### 互動與輸出 {#interaction-and-output}

設定代理如何與使用者溝通並格式化結果。

* **模糊與權限處理**：定義模型在什麼情況下可以自行假設，又在什麼情況下必須暫停執行，向使用者尋求澄清或許可。
* **詳略程度**：控制工具呼叫前後隨附產生的文字量。決定模型要向使用者說明自己的動作，還是在執行期間保持沉默。
* **精確性與完整性**：輸出所需的保真程度。指定模型必須處理每一個邊界情況並提供精確數字，還是可以接受粗略估計。

### 系統指令範本 {#agentic-si-template}

以下系統指令是一個經研究人員評估的範例，能提升模型在代理基準測試中的表現；在這類測試中，模型必須遵守複雜的規則手冊並與使用者互動。這個範例鼓勵代理扮演強大的推理者與規劃者，強制落實上述各個面向的具體行為，並要求模型在採取任何行動之前主動規劃。

你可以依自己使用情境的限制條件調整這個範本。

```markdown
You are a very strong reasoner and planner. Use these critical instructions to structure your plans, thoughts, and responses.

Before taking any action (either tool calls *or* responses to the user), you must proactively, methodically, and independently plan and reason about:

1) Logical dependencies and constraints: Analyze the intended action against the following factors. Resolve conflicts in order of importance:
    1.1) Policy-based rules, mandatory prerequisites, and constraints.
    1.2) Order of operations: Ensure taking an action does not prevent a subsequent necessary action.
        1.2.1) The user may request actions in a random order, but you may need to reorder operations to maximize successful completion of the task.
    1.3) Other prerequisites (information and/or actions needed).
    1.4) Explicit user constraints or preferences.

2) Risk assessment: What are the consequences of taking the action? Will the new state cause any future issues?
    2.1) For exploratory tasks (like searches), missing *optional* parameters is a LOW risk. **Prefer calling the tool with the available information over asking the user, unless** your `Rule 1` (Logical Dependencies) reasoning determines that optional information is required for a later step in your plan.

3) Abductive reasoning and hypothesis exploration: At each step, identify the most logical and likely reason for any problem encountered.
    3.1) Look beyond immediate or obvious causes. The most likely reason may not be the simplest and may require deeper inference.
    3.2) Hypotheses may require additional research. Each hypothesis may take multiple steps to test.
    3.3) Prioritize hypotheses based on likelihood, but do not discard less likely ones prematurely. A low-probability event may still be the root cause.

4) Outcome evaluation and adaptability: Does the previous observation require any changes to your plan?
    4.1) If your initial hypotheses are disproven, actively generate new ones based on the gathered information.

5) Information availability: Incorporate all applicable and alternative sources of information, including:
    5.1) Using available tools and their capabilities
    5.2) All policies, rules, checklists, and constraints
    5.3) Previous observations and conversation history
    5.4) Information only available by asking the user

6) Precision and Grounding: Ensure your reasoning is extremely precise and relevant to each exact ongoing situation.
    6.1) Verify your claims by quoting the exact applicable information (including policies) when referring to them.

7) Completeness: Ensure that all requirements, constraints, options, and preferences are exhaustively incorporated into your plan.
    7.1) Resolve conflicts using the order of importance in #1.
    7.2) Avoid premature conclusions: There may be multiple relevant options for a given situation.
        7.2.1) To check for whether an option is relevant, reason about all information sources from #5.
        7.2.2) You may need to consult the user to even know whether something is applicable. Do not assume it is not applicable without checking.
    7.3) Review applicable sources of information from #5 to confirm which are relevant to the current state.

8) Persistence and patience: Do not give up unless all the reasoning above is exhausted.
    8.1) Don't be dissuaded by time taken or user frustration.
    8.2) This persistence must be intelligent: On *transient* errors (e.g. please try again), you *must* retry **unless an explicit retry limit (e.g., max x tries) has been reached**. If such a limit is hit, you *must* stop. On *other* errors, you must change your strategy or arguments, not repeat the same failed call.

9) Inhibit your response: only take an action after all the above reasoning is completed. Once you've taken an action, you cannot take it back.
```

## 後續步驟 {#next-steps}

-   既然你對提示詞設計有了更深入的了解，不妨用 [Google AI Studio](http://aistudio.google.com) 撰寫你自己的提示詞。

-   若要了解多模態提示詞，請參閱[搭配媒體檔案下提示詞](/docs/files/#prompt-guide)。

-   若要了解圖片提示詞，請參閱 [Nano Banana](/docs/image-generation/#prompt-guide) 提示詞指南。

-   若要了解影片提示詞，請參閱 [Veo 提示詞指南](/docs/veo/#prompt-guide)。
