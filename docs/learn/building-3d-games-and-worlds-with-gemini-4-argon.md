# 使用 Gemini 4 Argon 打造 3D 遊戲與程序化世界

如何挑選合適的 3D 工具、使用 Gemini 4 Argon 建立 3D 場景的六大核心工作流程，以及 Desk Racer 的幕後直擊。

![Geneviève Huskens](https://www.gstatic.com/aistudio-static/editorial/page-msrgq2u0/genevieve-huskens.webp)

在過去幾週裡，Google 各地的工程師與創意技術專家在數百個 3D 作品上全力運用 **Gemini 4 Argon**——從歷史建築重建、物理解謎遊戲到即時 WebGPU 著色器。Argon 之所以擅長 3D，歸結於三件事：**長時間自主運作**：憑藉 100 萬 tokens 的上下文視窗與輸出視窗，Argon 能自主規劃、撰寫大型多檔案 3D 程式碼庫，並長時間迭代而不迷失整體架構。**原生多模態**：如同先前的 Gemini 模型，Argon 能看懂你的照片、粗略草圖、概念稿，以及它自己渲染的截圖，從而理解 3D 空間、光線與比例。**強大的空間與數學推理能力**：你負責提供創意方向與視覺品味，Argon 則在幕後處理 3D 座標運算、物理、鏡頭光學與網格幾何。我們撰寫這份指南，是**同時寫給人類與代理看的**——你可以自己照著這些步驟做，也可以直接把這份指南的連結傳給你的程式設計代理，請它遵循這些最佳實務。下文將說明如何挑選合適的工具、我們在各個作品中採用的六大核心工作流程，並幕後直擊我如何運用這些方法打造 *Desk Racer*。

## 挑選你的 Gemini 工具

在開始下提示詞之前，先為你要打造的內容挑選合適的環境與 3D 技術組合：

| 環境 | 最適合 | 典型技術組合 |
| --- | --- | --- |
| **Google AI Studio**（Build Mode） | 自成一體的 3D 網頁遊戲、程序化場景、互動式 WebGPU 著色器，以及直接在瀏覽器中快速製作原型。 | Three.js（WebGLRenderer 或 WebGPURenderer）、React Three Fiber，或原生 WebGPU。 |
| **Antigravity 或你自己的代理式 IDE** | 多檔案 3D 遊戲、長時間執行的 /goal 迴圈、平行子代理、自動化瀏覽器截圖檢查，以及本機 Blender 流程。 | Vite + Three.js + Headless Blender MCP + 無頭瀏覽器截圖。 |
| **Gemini API** | 自訂多代理框架、自動化 3D 資產流程，以及遊戲中的動態工作流程。 | gemini-4-argon 搭配工具呼叫，並結合 Nano Banana 與 Lyria 等其他生成媒體模型。 |

### 挑選你的 3D 工具：Three.js vs. Headless Blender MCP

**只用 Three.js**：大多數瀏覽器遊戲、程序化地景、風格化或低多邊形世界、建築場景，以及著色器密集的視覺效果（如水、粒子或生物發光生物），都可以完全跳過 Blender。Argon 能純粹以 Three.js 程式碼，生成出乎意料豐富的程序化幾何、光線與物理效果。**Three.js 搭配 Headless Blender MCP**：當你的場景需要量身打造的高細節主角模型時——例如雕塑感的車輛、精細的建築雕刻或自訂物件——只用瀏覽器基本形狀拼湊會顯得太過方塊感，這時就該引入 Blender。你不需要自己會用 Blender：Argon 可以撰寫 Python 腳本，在無頭 Blender 中為這些主角物件建模、匯出 .glb 檔案，再直接載入你的 Three.js 場景，用於即時遊戲玩法與光線呈現。

### 1. 先對齊創意方向

Gemini 4 Argon 聰明到不需要正式計畫就能打造出可運作的 3D 場景。然而，正因為 Argon 能長時間自主運行並以高細節執行，花幾分鐘先對齊創意方向，能確保這些長時間的努力都用在實現你腦海中*確切的*創意願景上。**提供 Argon 視覺參考，請它生成 Nano Banana 概念圖**：由於 Argon 原生支援多模態，你可以先丟入手機拍攝的真實場景照片、餐巾紙上的草圖，或一段 15 秒的實物環繞影片。如果你手邊沒有這些素材，甚至可以請 Argon 自己研究你想渲染的物件——例如彙整歷史遺跡的詳細報告與參考圖片。接著，請 Argon 使用 **Nano Banana** 生成場景與關鍵物件的概念渲染圖範例，並在對話中展示給你審閱。一起檢視 2D 概念稿，是在 Argon 動手寫複雜 3D 程式碼之前，最快鎖定光線、比例與氛圍的方法。你可以在 AI Studio Playground 中進行，或直接在 Antigravity 裡做。**使用 `/grill-me` 對齊計畫**：在 Antigravity 這類代理式 IDE 中，`/grill-me` 會讓 Argon 以釐清問題訪談你，在寫任何程式碼之前鎖定你的目標與理想做法。這能幫助你在碰程式碼之前，先釐清鏡頭視角、比例與遊戲機制等構想。在 AI Studio Build 中，我們正在推出讓 Gemini 主動向你提問釐清問題的功能——你也可以主動下提示詞：「先問我一些關於計畫的問題」。**請 Argon 草擬你的 `/goal` 指令**：在 Antigravity 中，`/goal` 讓 Argon 就一項可衡量的任務長時間自主工作而不偏離方向。與其自己寫 `/goal` 提示詞，不如在對齊計畫後請 Argon 幫你草擬 `/goal` 指令。這也是告訴 Argon 使用 Nano Banana 生成無縫紋理（如天然木紋、拉絲金屬、瀝青或自訂標籤）的好時機，讓你的 3D 表面看起來不像平滑的塑膠。**提示詞**：

/grill-me We're going to build a 3D miniature racing game set on top of an office desk using these photos of my desk. Do NOT write any 3D code yet:

1. Ask me clarifying questions about the gameplay mechanics, lighting, and how we should handle the objects.
2. Use Nano Banana to generate sample concept renders of the scene so we can lock in the visual style (and plan to use Nano Banana to generate textures for specific items). Your aim will be to replicate these renders in 3D, as accurately as possible. Show me these renders in a chat response or .md file for my review, don't proceed until I've signed off.
3. Once I approve the concept renders and have answered your questions, write a comprehensive PLAN.md with clear milestones and give me a ready-to-run `/goal` command I can set to keep you running for a long time.

### 2. 請 Argon 協調平行子代理

![預留位置：插入工作流程 2 圖片（請 Argon 協調平行子代理）](https://www.gstatic.com/aistudio-static/editorial/building-3d-games-and-worlds-with-gemini-4-argon/f75fe594.gif)

3D 世界由許多不同的部分組成——地形、建築、植被、道具、光線與物理。與其讓單一代理在一個巨大檔案裡逐一打造每個部分，在 Antigravity 中，你可以請 Argon 協調平行子代理。這能加快任務速度，並幫助你獲得更好的成果。Argon 知道如何乾淨俐落地拆分架構、讓子代理在共享座標上對齊，並將它們的工作成果合併回來。**提示詞**：

### 3. 告訴 Argon 召喚對抗式評論家子代理

告訴 AI 模型*「一直迭代到 3D 場景看起來很棒為止」*，效果往往不如預期——許多模型在第二輪後就會停下來，自鳴得意地宣布大功告成。若要充分發揮 Argon 長時間運行的潛力，請告訴 Argon 在每一輪結束時召喚一個獨立的**對抗式評論家子代理**。評論家子代理能以中立的一方給予徹底的批判性回饋——從多個鏡頭角度檢視渲染截圖、為場景評分，並將它退回修正，直到跨過高標準（例如 9/10 分以上）。如果你改用 Google AI Studio Build，也可以把場景截圖丟進對話，請 Gemini 批判性地評估場景並指出關鍵的改進之處。**提示詞**：

Build this 3D scene over iterative rounds by invoking a strict Art Director Critic subagent after each round. At the end of every round, render 4 screenshots of the scene:

1. A 3/4 overview showing the overall composition
2. A close-up showing surface details and textures
3. A low angle checking that objects sit cleanly on the ground without floating
4. A wireframe view proving clean 3D geometry to check for collisions

Have the Adversarial Critic subagent inspect all 4 screenshots to give thorough critical feedback—listing at least 3 specific visual flaws to fix (such as boxy shapes, floating parts, clipped shadows, or flat materials) and rating the scene out of 10. Keep iterating until the Critic rates the scene 9/10 or higher.

### 4. 讓 Argon 打造工具，讓你穩坐藝術總監的位置

![預留位置：插入工作流程 4 圖片（讓 Argon 打造工具，讓你穩坐藝術總監的位置）](https://www.gstatic.com/aistudio-static/editorial/building-3d-games-and-worlds-with-gemini-4-argon/57248b7e.webp)

對抗式評論家子代理很擅長抓出技術缺陷並提升幾何細節，但診斷截圖與即時控制項能讓你親自回饋子代理可能沒注意到的個人創意願景。兩個輕量工具能讓人類藝術指導變得非常容易：**即時截圖藝廊（`progress.html`）**：請 Argon 在每個里程碑後把截圖存入一個簡單的 HTML 頁面，讓你檢視場景的演變過程，並在發現想調整之處時隨時微調創意方向。**光線、紋理與鏡頭角度的自訂控制項**：我們發現請 Argon 打造精確的螢幕控制項（如太陽角度、光線強度、材質粗糙度與鏡頭距離的滑桿）非常有幫助。這些控制項讓你即時快速微調視覺效果，找出你最理想的偏好。接著你可以把偏好的設定複製為 JSON（或截圖下來），請 Argon 將它們寫死進場景，並在發布成果前移除這些控制項。**提示詞**：

1. After each milestone, save screenshots from our main camera angles into a `progress.html` gallery so I can review the creative direction and give feedback. Clearly title all images and versions.
2. Build an on-screen control panel with sliders for the lighting, textures, and camera angles—plus a "Copy Settings as JSON" button—so I can tweak the look interactively. Once I paste back the JSON of my preferred settings, bake those values in as the permanent defaults. We'll remove the control panel in a subsequent step.

### 5. 使用 Nano Banana 提升 3D 渲染品質

![使用 Nano Banana 作為參考目標渲染圖之前與之後的 3D 場景](https://www.gstatic.com/aistudio-static/editorial/building-3d-games-and-worlds-with-gemini-4-argon/6b0b2e50.gif)

在黑暗中摸索著調整光線與材質數值，把現有 3D 場景推向寫實主義，可能會陷入停滯，因為模型缺乏與你確切鏡頭取景相符的具體視覺目標。要解決這個問題，你可以用 **Nano Banana** 為目前的場景建立寫實的目標版本，再讓 Argon 升級 3D 程式碼以與之相符。**1. 用 Nano Banana 生成寫實的目標渲染圖**：請 Argon 從幾個關鍵鏡頭角度截取目前 3D 場景的乾淨截圖——務必先隱藏所有 UI 按鈕、滑桿與 HUD 文字，以免圖片模型把它們誤認為漂浮在 3D 世界中的招牌。將每張截圖傳給 Nano Banana，生成 2K 寫實版本，升級光線、表面紋理、水與氛圍，同時保持你確切的鏡頭角度與版面配置不變：

Hide all UI controls and HUD overlays, then capture clean screenshots of our 3D scene from 3–5 key camera viewpoints. Pass each screenshot to Nano Banana at 2K resolution with this prompt:

"Transform this 3D viewport screenshot into a photorealistic render with natural lighting, realistic surface textures, and atmospheric depth. Keep the exact same camera angle, composition, and architectural layout so it can be used as a 1:1 visual reference target."

**2. 請 Argon 在 3D 程式碼中重現目標渲染圖**：將那些 Nano Banana 渲染圖連同你目前的 3D 截圖一起餵給 Argon。請 Argon 並排比較兩者、找出視覺差異，並反覆升級真實的 3D 幾何、材質與光線，直到即時場景與目標渲染圖相符。提示詞：

### 6. 對於最複雜的作品，先用 2D 平面圖奠定比例基礎

![預留位置：插入工作流程 6 圖片（先用 2D 平面圖奠定比例基礎）](https://www.gstatic.com/aistudio-static/editorial/building-3d-games-and-worlds-with-gemini-4-argon/b76f7b2e.webp)

最後——大多數 3D 專案不需要這一步。然而，如果你想以高精度渲染真實世界的主題，或打造空間上非常難以執行的作品，請 Argon 在建立 3D 形狀之前先建立 2D 空間指南，可以防止比例漂移。**適用於多房間室內空間與複雜建築**：請 Argon 先生成附公尺測量值的俯視 2D 平面圖（例如 `.svg` 檔案），確認房間、柱子與通道的配置符合你的想法，再從該平面圖拉伸出 3D 世界。**適用於寫實渲染**：請 Argon 撰寫一個快速腳本，在你的參考照片上疊加編號的 `X/Y` 網格，讓它在建模前讀取確切的比例與特徵對齊。**適用於在 3D 中重現確切的照片**：請 Argon 先從照片計算鏡頭角度與地平線，讓 3D 場景在觀者飛入其中之前，就與原始取景 1:1 對齊。**提示詞**：

## 全部整合起來：我如何打造 Desk Racer

在正式發表前測試 Gemini 4 Argon 時，它的空間推理能力立刻脫穎而出——於是我好奇，能不能把自己的書桌變成一個可玩的卡丁車遊戲。以下是我得到成果的過程：**以書桌照片、Nano Banana 概念圖與 /grill-me 對齊**：我上傳了書桌的照片並執行 /grill-me，請 Argon 訪談我、用 Nano Banana 模擬賽道設計與物品紋理，並輸出附 /goal 指令的計畫。早期的概念圖幫助我把視覺方向引導向戲劇性的光線、有紋理的賽道與超大尺寸的書桌物件，讓玩家感覺自己變得渺小。提示詞：

Hi! I’d like you to build a 3D racing game on top of my desk. Here are pictures of my desk.

I want you to use whichever 3D tools are most suitable to create a playable go-cart track that swerves around the items on my desk.

- you should use nano banana to render mocks of the track design, pass them back to me in a chat response or .md file, and wait for my approval
- you may use nano banana to render textures for specific items
- you should launch subagents to help with the project
- you should first make a very comprehensive plan with tasks and milestones

/grill-me ask me questions, then when you're done, give me a plan that I can review and a /goal I can set to keep you running for a long time.

**以 `/goal` 與子代理執行**：創意渲染圖看起來不錯之後，我執行了 Argon 草擬的 `/goal` 指令。它協調平行子代理，跨 Blender MCP 與 [Three.js](https://threejs.org/) 工作——甚至執行數學交集檢查，讓全部 68 根雲霄飛車支柱都與我的書桌及道具齊平貼合、不穿透表面。**朝更高的企圖心迭代**：第一個可玩版本完成後，我不斷設定更具企圖心的目標——推進駕駛物理、物件精細度、電玩級光線，甚至擴展場景，把書桌周圍其餘的臥室空間也渲染出來。Argon 在將每一輪迭代交回給我之前，都以自動化截圖驗證。**從截圖檢查點微調比例**：看著早期截圖，我意識到最初的 `1:87` 比例讓卡丁車在 Argon 設計的賽道上感覺很侷促。我在一個提示詞中請 Argon 改為 **`1:150` 比例**，同時把追蹤鏡頭拉近——讓卡丁車在螢幕上保持完全相同的大小，卻讓路面感覺幾乎寬了一倍，書桌物件也在頭頂高聳。Argon 一次就完美地執行了這項變更。

## 可用性與後續步驟

你今天就能在 Google 的開發者平台上開始使用 **Gemini 4 Argon** 打造作品：**Google AI Studio**：在 [Playground](https://aistudio.google.com/) 中測試提示詞，或在 [Google AI Studio Build](https://aistudio.google.com/build) 中打造全端應用程式（開放給擁有 Google AI Ultra 方案或付費 Gemini API 金鑰的開發者）。**Gemini API**：在 [Interactions API](/docs/) 中使用 `gemini-4-argon`，`google-genai` SDK 上市首日即支援，也可在 [Managed Agents](https://ai.google.dev/gemini-api/docs/custom-agents) 中使用。**Google Antigravity**：對於 Google AI Ultra 訂閱者，在 [Google Antigravity](https://antigravity.google/) 中選取 **Gemini 4 Argon**（`gemini-4-argon`）作為你的使用中模型，用於複雜規劃、`/goal` 執行與多代理協調。**開發者文件與發表應用程式**：閱讀 [Gemini 4 Argon：開發者指南](/learn/gemini-4-argon-developer-guide/) 與 [Gemini 4 Argon 文件](/docs/latest-model/)，或試玩並混搭我們的[互動式 3D 發表應用程式](/learn/gemini-4-argon-showcase/)。**Gemini API 技能**：在你的程式設計代理中安裝 [`gemini-api-dev` 技能](/docs/coding-agents/#gemini-api-dev)，並請它把你的程式碼庫遷移到 `gemini-4-argon`。
