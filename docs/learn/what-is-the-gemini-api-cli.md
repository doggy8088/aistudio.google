# 什麼是 Gemini API CLI？（以及何時使用它）

這個新的 CLI 是什麼、它的設計用途，以及為什麼給你的代理一個專用的媒體工具，能節省 85% 的 token 並讓速度提升近 2 倍。

![Jack Wotherspoon](https://www.gstatic.com/aistudio-static/editorial/page-msrgq2u0/jack-wotherspoon.webp)

## 什麼是 Gemini API CLI？

為什麼還需要另一個 CLI？簡言之：為了讓媒體生成對程式設計代理來說既快速又節省 token。[Gemini API CLI（`gemini-api`）](/learn/introducing-the-gemini-api-cli/?e=0)最近以預覽版形式推出。本文將說明這個新的 CLI 是什麼、它的設計用途，以及更重要的一點——它不是什麼：**它不是另一個程式設計代理**。雖然名稱中有「CLI」可能會讓人這樣想，但它實際上是 Gemini API 的包裝，讓人類與代理能更有效率地運用 Gemini 執行特定任務。它的定位是交給你選擇的代理（Antigravity、Codex、Hermes、Claude Code 等）使用的工具，用來生成圖片、影片、音訊等，而不是取代該代理。📹 **想在 Codex 中生成影片？** → 安裝 Gemini API CLI，現在你就有了 Omni 或 Veo。🖼️ **想在 Hermes 中建立圖片？** → 安裝 Gemini API CLI，現在你就有了 Nano Banana 🍌。在一個無相依性的二進位檔中，取得 Gemini API 能做的一切。

## 有什麼不同？

難道我以前不能直接請代理*「用 Gemini 的 Nano Banana 建立一張狗的圖片」*嗎？可以，但如果你在 Claude Code 中這樣做，它大概會做這些事：**上網搜尋 → 閱讀文件 → 撰寫 Python 指令碼 → 執行程式碼 → 得到一張圖片 🖼️**上述每一步都會消耗計入配額的 token，也會花費時間。這還是最好的情況——它可能不會搜尋文件，也不知道 Nano Banana 2.1 已經發布，結果用了過時的模型字串，或需要除錯錯誤。（[`gemini-api-dev`](https://github.com/google-gemini/gemini-skills/tree/main/skills/gemini-api-dev) 技能可以用來避免這種情況）。新的 CLI 是為代理工作流程而打造的，代理本來就很擅長使用 CLI。只要安裝 Gemini API CLI，並在 `AGENTS.md` 中加上一句簡單的 *「Use the gemini-api CLI for all media generation (images, video, audio)」*，流程就變成：

```
# Step 1: Discover top-level commands locally (0 network calls, compact help)
gemini-api --help || which gemini-api

# Step 2: Inspect flags for `image`
gemini-api image --help

# Step 3: Generate image directly to disk
gemini-api image "a cute dog" --out dog.jpg
```

## 實際測試

這既節省時間也節省 token。Gemini API CLI 還會為最新模型設定合理的預設值，同時提供旗標讓你完全掌控。為了測試對 token 與延遲的實際影響，我使用 [Gemini Managed Agents](/docs/custom-agents/) 快速建立了一個基準測試。*注意：同樣的測試可以在任何代理中進行。我選擇受管理代理，是因為它們能快速又輕鬆地在各自獨立的環境中啟動 Antigravity  harness。*我使用了兩個版本的基礎代理，預設模型皆為 `gemini-3.8-flash`：**代理 1（Gemini API CLI）：** 在環境中預先安裝 Gemini API CLI，並在 `AGENTS.md` 中加上一行：*「Use the gemini-api CLI for all media generation (images, video, audio)」*。**代理 2（技能＋Python SDK）：** 加入 [`gemini-api-dev`](https://github.com/google-gemini/gemini-skills/tree/main/skills/gemini-api-dev) 技能，讓代理在撰寫 Python 指令碼時擁有最新的文件與模型字串。我讓每個代理在全新的沙箱中，用相同的提示詞各執行 10 次：*「Generate me an image of a dog and save it to dog.jpg」*。兩個代理在每次執行中都選了 Nano Banana 2.1，讓底層的圖片生成呼叫保持一致。（如果我沒有提供技能，情況可能就不一樣了）。在全部 10 次執行中，Gemini API CLI 每次都勝出，平均使用的 token **減少 85.8%**（50.5k 對 355.9k），速度**提升近 2 倍**（64.9 秒對 126.1 秒）：

![受管理代理執行的總 token 數（CLI 對 SDK）](https://www.gstatic.com/aistudio-static/editorial/what-is-the-gemini-api-cli/a644d68b.png)

![受管理代理執行的花費時間（CLI 對 SDK）](https://www.gstatic.com/aistudio-static/editorial/what-is-the-gemini-api-cli/3c491625.png)

### Token 與延遲明細

代理使用 CLI 時，不必閱讀技能檔案、透過網路擷取文件、安裝 pillow 等相依性，也不必在每次執行時撰寫一次性的 Python 指令碼；它只需在本機查看 `gemini-api --help`，接著用一個指令生成 `dog.jpg`。*注意：如果你用不同的代理 harness 執行同樣的測試，兩者之間的差距可能略有不同。由於沙箱中沒有安裝 pillow 等相依性，代理必須先去安裝，而你本機代理的環境可能已經安裝了。*以下是 20 次試驗中生成的所有 20 隻狗，讓你可以看到輸出品質相同（看來 Nano Banana 真的很喜歡黃金獵犬）：

![20 次試驗中生成的所有 20 隻狗](https://www.gstatic.com/aistudio-static/editorial/what-is-the-gemini-api-cli/33ac1dc0.png)

## 何時使用 SDK、何時使用 CLI？

何時使用 [Google GenAI SDK](/docs/libraries/?e=0)、何時使用 [Gemini API CLI](https://github.com/google-gemini/gemini-api-cli)，取決於手邊的任務。如果你正在 Gemini API 之上建構軟體、把 Gemini 整合進你的產品或應用程式，請使用 SDK。如果你只是想讓代理為影片快速生成一段配樂，或為部落格文章建立一張主視覺圖片，請使用 CLI。Gemini API CLI 的使用情境：🎮 — *「為我遊戲中的 Boss 戰加入一段配樂」*📊 — *「為本週的電子報建立一張封面圖片」*📹 — *「為登陸頁面製作一段 10 秒主視覺影片」*希望這能幫助你理解 Gemini API CLI 帶來的價值。它的目的是透過更有效率地運用 Gemini 提供的所有模型與多模態優勢，來強化你的代理工作流程。我們非常歡迎任何回饋，因為我們目前仍處於預覽階段。試試 [Gemini API CLI](https://github.com/google-gemini/gemini-api-cli)，並告訴我們你的想法。我們期待持續改進它，讓它對使用者更有用。
