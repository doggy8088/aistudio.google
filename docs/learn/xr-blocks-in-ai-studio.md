# AI Studio 中的 XR Blocks：用 Gemini 把想法變成擴增實境（XR）

用單一提示詞設計 3D 場景、想像空間互動，並建立具備物理感知的 Android XR 體驗

作者：[Ruofei Du](https://x.com/DuRuofei)、[Asier Ríos](https://x.com/asierrios)、[Mike Taylor-Cai](https://aistudio.google.com/)
發布於 2026 年 10 月 28 日
閱讀時間 10 分鐘

為擴增實境（XR）開發，一向意味著在測試簡單的捏合手勢互動之前，必須先串接沉重的 3D 遊戲引擎、低階感知管線與裝置專屬 SDK。今年稍早，我們推出 [Vibe Coding XR](https://research.google/blog/vibe-coding-xr-accelerating-ai-xr-prototyping-with-xr-blocks-and-gemini/)，展示大型語言模型如何將自然語言直接轉換為一次到位的互動式空間體驗。今天，配合 XREAL [AURA](https://www.xreal.com/us/aura) 的發表，我們把榮獲 [Auggie 獎](https://www.awexr.com/blog/auggie-Award-Winners-at-AWE-USA-2026)的框架 [XR Blocks](https://xrblocks.github.io/) 帶進 **Google AI Studio Build**。在 Gemini 的驅動下，你現在可以用單一提示詞即興編寫（vibe-code）完整、具備物理感知的 WebXR 應用程式，無論是直接在有線 XR 眼鏡或 Android XR 驅動的 XR 頭戴式裝置（例如 XREAL [AURA](https://www.xreal.com/us/aura) 與 Samsung [Galaxy XR](https://www.samsung.com/us/xr/galaxy-xr/galaxy-xr/)）上的 Chrome 瀏覽器中，或直接在電腦上使用 XR Blocks 內建的桌面模擬器。

本指南將說明 AI Studio 中的 XR Blocks 框架如何運作、分享組織空間提示詞的最佳做法，並帶你走訪可即時試玩、可混搭（remix）的 XR 應用程式，包含建立它們時使用的確切提示詞與空間互動模式。

## 在 AI Studio Build 中選取 XR Blocks 框架

你可以從[這裡](https://aistudio.google.com/apps?features=build_xr_blocks_app)開始，在 Google AI Studio 中選取 **「Build an XR Blocks app」** 晶片，或在 Settings 中選擇 **XR Blocks** 框架。接著，你的工作區會自動預先設定最新的 XR Blocks SDK、空間 UI 與全息圖技能，以及相容於 Android XR 的人體工學預設值。在 **Settings** 中，你可以根據 3D 世界的複雜程度，順暢切換不同的 Gemini 模型。

![undefined](https://ytimg.googleusercontent.com/vi/ZzmWNUtVHB8/maxresdefault.jpg)

## 組織 XR 提示詞：場景、互動與回饋

與平面的 2D 網頁應用程式不同，XR 體驗存在於使用者的實體房間內，並回應 6DoF 頭部移動、手部射線與真實世界表面。在 Google AI Studio 中，XR Blocks 引擎會在幕後管理 [WebXR](https://immersiveweb.dev/) 工作階段生命週期、[three.js](https://threejs.org/) 渲染迴圈、[Rapier 3D physics](https://threejs.org/docs/#RapierPhysics) 與 [LiteRT.js](https://ai.google.dev/edge/litert/web) 裝置端機器學習程式庫。為了獲得最可靠的結果，請把空間提示詞拆成三個清楚的部分：**設定 XR 應用程式的場景與目標。** 定義房間裡有什麼、它們生成在哪裡。例如：*「建立一個桌面骨牌玩具」*。**指定互動與控制方式。** 詳細說明手部射線、手勢與虛擬物件如何與世界互動。例如：*「Spatial Dominoes 讓使用者以手部射線，在感測到的房間表面上放置直立的骨牌。每次射線點按，都會在網格命中處產生一張具備物理特性的骨牌。骨牌一開始穩定直立，接著在使用者的手碰到它時自然反應。」***設計空間 UI 與使用者旅程。** 描述引導使用者的浮動空間介面，以及使用者互動如何運作。例如：*「一開始沒有任何骨牌，也沒有放置預覽。在有效的水平世界網格表面上點按射線，會以底座靠近射線命中處的方式放置一張骨牌。任一隻使用者的手直接接觸，都必須施加物理衝量，讓骨牌移動並可能倒下。」*

## 場景、互動與回饋

把空間提示詞組織成三個模組化層級，讓 Gemini 乾淨地串接場景幾何、物理碰撞與浮動空間 UI。

### 設定場景與目標

定義實體房間裡有什麼、它們生成在哪裡（例如感測到的桌面、垂直牆面，或懸浮於視線高度）。

### 描述空間機制

詳細說明手部射線、捏合、雙手縮放，或直接手部碰撞如何對虛擬物件施加物理作用力。

### 設計空間 UI 與 HUD

指定浮動空間卡片、爆炸圖層標示、化學方程式、即時計分板與重設控制項。

此外，你也可以描述引導使用者的浮動抬頭顯示器（HUD）或教學卡片，例如即時計數器、化學方程式、機率徽章與重設控制項。你可以試試我們在 [Vibe Coding XR](https://research.google/blog/vibe-coding-xr-accelerating-ai-xr-prototyping-with-xr-blocks-and-gemini/) 與 GenXR-Bench 中的範例提示詞，從中獲得靈感。

## 今天就能試玩與混搭的即興編寫 XR 應用程式

以下每個應用程式，都是在 Google AI Studio 中使用 XR Blocks 框架生成的。點按任一卡片上的 **Launch** 或 **Remix**，即可立即在桌面瀏覽器中試玩（WASD 移動、滑鼠瞄準、按右鍵環顧四周），或在 Android XR 裝置上的 Chrome 中開啟連結並捏合 **「Enter XR」**。

### Spatial Dominoes

### Wall Dart Game

### XR Chemistry Lab

### Solar systems

### Voxel Garden

### Hologram Museum

建立一個互動式「Hologram Museum: Ancient Royal Treasury」空間展覽，展示兩座 360 度全息圖，訪客可以在其中切換並從各個角度檢視：

展品 1 — 法老的金面具：古埃及法老的金色葬禮面具與皇家條紋頭飾，鑲嵌深藍色青金石、紅玉髓與黑曜石，面具背面刻有精細凸起的象形文字。

展品 2 — 帝王龍鳳花瓶：華麗的明代青花白瓷禮儀花瓶，正面環繞一條雕塑金龍，配有鍍金青銅鳳凰把手，背面則有皇家印章銘文。

讓啟用的 360 度全息圖懸浮在空中，不加其他效果。在左側加入一張空間策展人說明卡，訪客可以在此切換展品 1 與展品 2，並閱讀每件文物正反面工藝的歷史說明；右側則是 360 度全息圖控制卡，可調整色度鍵閾值、去溢色、影格混合與自動旋轉。

### Hologram Memories

### Schrödinger's Cat

## XR Blocks 中的全息圖技能

在 XR Blocks 框架中，你可以直接從輸入的文字提示詞或附加的參考圖片，生成 3D 全息圖（360 度轉盤全息素材），以便在空中從任何角度進行高傳真空間檢視。只要以 `“Generate a 3D hologram for …”` 提示，或如上方 [Hologram Museum](https://ai.studio/apps/b528d1a4-65a4-4f92-bdec-e36936f5c281) 與 [Hologram Memories](https://ai.studio/apps/73e6014f-f8f3-4fbc-a69b-80dad64b2192) 所示附加參考照片即可。

## 準備好把想法變成擴增實境了嗎？

你今天就可以在 [Google AI Studio](https://aistudio.google.com/apps?features=build_xr_blocks_app) 中開始即興編寫自己的 WebXR 體驗、混搭上方八款精選應用程式，或深入探索開放原始碼的 [XR Blocks GitHub 存放庫](https://github.com/google/xrblocks)、[互動式範例圖庫](https://xrblocks.github.io/docs/samples/)與 [Android XR 開發人員文件](https://d.android.com/xr)，進一步了解裝置端 LiteRT.js 感知、深度感測與 Android XR 開發。
