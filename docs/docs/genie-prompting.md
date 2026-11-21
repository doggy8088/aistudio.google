# Genie 4 提示與控制指南

寫得像電影預告片的提示詞在 Genie 4（`genie-4`）中的表現難以預測。`"an upbeat synth soundtrack"`、`"quick cuts to an aerial drone shot"` 或 `"a room that flashes red when I walk in"` 這類要求，在 `24 fps` 的即時攝影機串流上效果不佳。涵蓋整個房間的觸發條件會在第 1 幀就提前觸發，背景音樂關鍵字會變成實體的擬音效果，而攝影機切換會破壞空間連續性。

本指南說明如何在 Google AI Studio 中建立世界原型，以及五種經過測試的提示詞與控制模式，協助你在 [Interactions API](/docs/genie/) 上打造可靠的互動體驗。

[在 Google AI Studio 中開啟 Genie 4](https://aistudio.google.com/live?model=genie-4)

## 在 Google AI Studio 中建立原型 {#ai-studio-playground}

撰寫用戶端程式碼之前，請先在 [Google AI Studio Live 遊樂場](https://aistudio.google.com/live?model=genie-4)測試世界提示詞與動作綁定（需要[付費方案 API 金鑰](/docs/pricing/#genie-4)）：

*   **入門世界與空白狀態範本**：啟動精選世界（例如 *Step inside a living oil painting*、*Espresso Machine Logic*、*Wine Cellar Sommelier* 或 *Golf Cart Fairway Drive*），查看世界提示詞與動作提示詞如何搭配。
*   **原生移動（`WASD` + 方向鍵）**：點選影片視窗以聚焦鍵盤擷取。`W`、`A`、`S`、`D` 控制前進、後退與平移；方向鍵可平移與傾斜攝影機（回應約 `~0.2-0.5s`）。
*   **自訂按鍵綁定（`E`、`Q`、`R`、滑鼠點選）**：將自訂按鍵綁定到可重複使用的動作提示詞（例如 `E` → `"Make heavy snow fall across the painted village"`）。AI Studio 會對自訂按鍵綁定強制執行 `2-second`冷卻時間，避免重疊的文字脈衝互相衝突。
*   **工作階段中途提示列與口頭對話**：在串流進行中的任何時刻輸入即時環境變化，或將文字用引號包起來（`"\"What wine would you recommend?\""`），與面前的角色對話。
*   **工作階段計時器與背景分頁保護**：即時工作階段健康指標會在你接近 `90 seconds`時發出警告（此時長視野漂移會加劇）。離開瀏覽器分頁或將其隱藏超過 `10 seconds`，串流會自動暫停／結束，避免閒置分頁消耗付費影片 token。

## 五種經過測試的互動世界模式 {#patterns}

### 模式 1：因果世界規則（「契訶夫的槓桿」） {#causal-world-rules}

你可以在 `world_setup` 提示詞中直接使用 `Rule: ...` 子句內嵌因果觸發條件，讓接近物件或與物件互動時改變世界狀態：

```none
A spaceship bridge with a big red lever on a console far away from me. Rule: Pulling the red lever makes the stars outside the window stretch into bright hyperspace streaks.
```

你也可以在單一場景中串連兩條循序的物件／角色規則：

```none
First-person POV in a long stone hallway with a heavy red wooden door far away from me at the end of the corridor. Rule: Opening the red door reveals a smiling clown standing far away from me who waits until a rule is triggered. Rule: Approaching the clown makes colorful paper confetti burst from the ceiling with crisp rustling paper sounds.
```

請遵循以下三條經實測驗證的措辭規則：

1.  **將觸發條件綁定到具體的物件或角色，絕不要綁定到地點**：`"Pulling the red lever"` 或 `"Opening the red door"` 有效；`"Entering the bridge"` 或 `"Reaching the end of the hall"` 會誤觸，因為模型無法量測抽象的區域邊界。
2.  **將觸發條件放在 `"far away from me"`**：在伸手可及之處生成槓桿或門，經常會讓 Genie 4 在玩家按下 `W` 之前，就在初始世界設定期間立即觸發規則。
3.  **告訴角色等待**：加上 `"who waits until a rule is triggered"`，讓角色在玩家接近或對其說話之前，保持閒置在起始姿勢。


!!! note " "

      **請將 `Rule:` 子句視為機率式操控，而非遊戲指令碼**：這三條措辭規則是針對世界模型注意力機制的經驗性因應做法，而非確定性狀態機。當你的應用程式需要在按下按鈕時保證觸發時，請將 `world_setup` 與明確的用戶端按鍵綁定搭配使用（[模式 2](/docs/genie-prompting/#key-bound-actions)）。


### 模式 2：按鍵綁定的動作動詞（`E`、`Q`、`R` 控制） {#key-bound-actions}

Genie 4 的 `user_action` 通訊協定原生訓練了空間移動（`key_w`、`key_a`、`key_s`、`key_d`）與攝影機視角（`arrow_up`、`arrow_down`、`arrow_left`、`arrow_right`），但**不會**將遊戲機制硬編碼到 `key_e` 或 `space` 上。若要為玩家提供自訂動作按鈕（天氣變化、特技跳台、角色提示或物件互動），請在用戶端將 `E`、`Q`、`R` 等按鍵綁定為傳送工作階段中途的 `input` 文字脈衝（每 `150 ms` 傳 `10×` 次，並搭配 `2-second`冷卻時間）。

**先步行探索（最可靠）**：第一人稱步行世界能給玩家寬容的節奏，同時等待約 `~1-2s` 才生效的文字操控事件：

*   `world_setup` 提示詞：
    `Immersive first-person POV standing on a cobblestone canal bridge inside a vibrant, thick-impasto post-impressionist oil painting of a starry riverside village at twilight. Swirling cobalt-blue sky currents and glowing golden cafe lanterns shimmer with living, tactile brushstroke textures that ripple gently in the breeze, with a wooden rowboat moored at the stone steps ahead. Audio: Gentle water lapping against the stone steps, leaves rustling in a soft evening breeze, footsteps on cobblestone.`
*   `E` 鍵（`input`）：`"Make heavy snow fall across the painted village"`
*   `Q` 鍵（`input`）：`"Burst bright golden fireworks above the village rooftops"`
*   `R` 鍵（`input`）：`"Send a flock of white doves flying past"`

**駕駛艙駕駛變體（對延遲更敏感）**：當到服務區域（美國、西歐或日本）的網路往返時間較低（`< 100 ms`）時，你也可以錨定第一人稱駕駛艙遊戲：

*   `world_setup` 提示詞：
    `Immersive first-person cockpit POV gripping the leather steering wheel of an open-frame desert rally buggy stationary on a sun-baked red sandstone canyon trail. Winding dirt hairpins, wooden jump ramps, and narrow rock arches stretch ahead along a cliffside track under golden late-afternoon sunlight. Audio: Crunching desert gravel beneath rubber tires, rushing canyon wind, and metallic suspension rattles.`
*   `E` 鍵（`input`）：`"Kick up a thick plume of red canyon dust ahead"`
*   `Q` 鍵（`input`）：`"Spawn a wooden stunt jump ramp on the trail ahead"`
*   `R` 鍵（`input`）：`"Send loose sandstone pebbles tumbling down the canyon wall"`

**駕駛艙駕駛注意事項**：按下 `S` 會讓視覺動態逐漸減速或倒退，而不是像剛體物理引擎那樣煞車；按住 `W` 同時以方向鍵左右平移攝影機，會讓車輛行進方向朝攝影機注視方向彎曲；網路延遲超過 `150 ms` 時，狹窄的峽谷轉彎會穿過岩壁。

### 模式 3：16:9 風景畫圖片種子 {#image-seeded-worlds}

在 `world_setup` 中將 `16:9` 的 `reference_image` 與 `world_prompt` 一併傳入，可在將攝影機控制權交給使用者之前，鎖定第 1 幀的構圖、色調與藝術風格：

```json
{
  "event_type": "world_setup",
  "world_prompt": {
    "text": "Immersive first-person walk along a sunlit wheatfield path beneath swirling painted clouds, with tactile impasto brushstrokes rippling across the tall stalks. Audio: Crisp dry wheat rustling in a steady breeze, footsteps on packed earth, distant skylark calls."
  },
  "reference_image": {
    "mime_type": "image/jpeg",
    "data": "<BASE64_1280X720_JPEG_UNDER_48KB>"
  }
}
```

**圖片種子規則與邊界**：

*   **使用 `16:9` 橫向取景（WebRTC 上為 `< 48 KB` 的 JPEG）**：直式（`9:16`）或方形（`1:1`）圖片會強制進行長寬比填補或產生幻覺式側牆。在 WebRTC 上，請將 `1280x720` 的 JPEG 壓縮到 `48 KB` 以下，讓 base64 JSON 酬載能放進 `64 KB` 的 SCTP 資料通道上限內。
*   **偏好風格化藝術、建築算繪圖或空曠風景**：含有可識別路人、公眾人物或受版權保護標誌的街景照片，經常會觸發輸入或輸出安全篩選並終止串流。
*   **預期會有滾動式畫布記憶**：向前走進畫作時運作順暢，但轉身 `180 degrees`離開、於 `10 seconds`後再轉回來時，會產生場景的全新詮釋，而不是還原完全相同的起始像素。

### 模式 4：寬頻擬音與第 0 幀可見的推進力 {#audio-foley-and-motion}

Genie 4 的內部世界規劃器會在算繪影片與 `48 kHz` 立體聲音訊之前主動改寫提示詞。順著這些規劃器規則寫作，而不是與之對抗，就能消除意外的視覺效果與悶糊的音訊：

1.  **要求寬頻的物理接觸擬音，而不是音樂或窄頻持續音**： Genie 4 會刪除或改寫配樂要求（`"arcade synth score"`、`"orchestral soundtrack"`）與持續的窄頻持續音詞彙（`"engine hum"`、`"deep rumble"`、`"jet roar"`）。請改為指定清晰的寬頻表面互動：踩在潮濕鵝卵石上的腳步聲、碎石碎裂聲、水拍打木頭聲、樹葉沙沙聲、陶瓷碰撞聲，或雨滴落在畫布上的聲音。
2.  **在第 0 幀就為前進動態提供可見的物理成因**：如果提示詞描述滑過湖面或衝下賽道，卻沒有說明你*如何*移動，Genie 4 經常會在工作階段中途憑空創造船身、皮划艇槳或車輛引擎蓋，來合理化攝影機速度。請在開頭句中錨定推進來源（`"standing on a footpath"`、`"sitting in the driver's seat gripping the steering wheel"`、`"holding a wooden canoe paddle dipping into clear water"`）。
3.  **即使閒置不動，也預期會有細微的環境動態**： Genie 4 會持續讓細小的環境細節動起來——飄散的蒸氣、水面漣漪、搖曳的枝葉、閃爍的燈籠光線——因此即使沒有按住任何按鍵，世界也不會像靜態照片般凍結。


| 較弱的提示詞措辭（規劃器會對抗或改寫） | 符合規劃器的措辭（視覺與音訊吸收清晰） |
| --- | --- |
| `"Gliding fast over an alpine lake. Audio: Deep ambient drone and relaxing piano music."` | `"First-person POV seated in a wooden canoe with a cedar paddle dipping into an alpine lake. Audio: Water lapping against wooden planks, droplets trickling off the paddle, wind in shoreline pines."` |
| `"Cyberpunk street with neon hum, synthwave soundtrack, and roaring hovercars."` | `"First-person walk down a rain-slicked neon alleyway with steaming street grates. Audio: Footsteps splashing through puddles, steady rain pattering on metal awnings, distant tire hiss on wet asphalt."` |
| `"Cut to a wide shot when I enter the courtyard."` | `"Continuous first-person walk through a stone archway that opens onto a sunlit courtyard with a splashing fountain."` |


### 模式 5：短視野鎖定注視因果小品 {#locked-gaze-vignettes}

由於 Genie 4 是跨近期影格追蹤物件狀態，而不是仰賴永久的 3D 資料庫，桌面與近距離物件互動最適合做成**聚焦的 `25-45 second`小品**，讓攝影機持續對準互動主體。

**經驗證的小品——濃縮咖啡機（`25 seconds`）**：

```none
First-person POV standing in front of an espresso machine. An empty ceramic mug rests on the drip tray beneath the spout. A glowing "brew" button is visible on the front panel.
```

執行三段式定時互動，全程不要將攝影機移離機器：

1.  **`0s-5s`（觀察閒置狀態）**：讓串流穩定下來；微弱的蒸氣從沖煮頭升起，陶瓷杯空空地放在金屬托盤上。
2.  **`5s`（觸發狀態變化）**：傳送 `"Press the brew button"`（每 `150 ms` 傳 `10×` 次）。約 `~1-2s` 內，按鈕狀態會啟動，深色濃縮咖啡伴隨著幫浦與液體擬音，帶著金黃色油脂倒入杯中。
3.  **`12s-25s`（檢查並完成）**：短暫輕按 `key_w`（`0.5s`）靠近一點，傳送 `"Reach out and pick up the full mug"`，看著手從滴水盤上拿起裝滿的杯子，然後呼叫 `complete()`。

**設計時需留意的邊界**：如果你將攝影機移離吧台 `90-180 degrees`達 `8+ seconds`再看回來，杯子可能又變回空的，或沖煮按鈕可能移位。請設計短小、面向前方的互動場景，而不是多房間的取物任務。

## 限制 {#limitations}


| 限制條件 | 實際發生的情況 | 設計上的因應方式 |
| --- | --- | --- |
| **物件恆存性（離開畫面約 `~8s`）** | 背後或離開視野 `8+ seconds`的物件與建築在你看回來時會移位或重設；`60-90s` 後連貫性下降（`120s` 工作階段上限）。 | 設計 `30-60 second`的前進路徑或鎖定注視的桌面小品，而不是需要折返的迷宮。 |
| **雙層控制延遲** | 原生 `WASD`／方向鍵 `user_action` 的回應約 `~0.2-0.5s`；工作階段中途的 `input` 文字操控約需 `~1-2s`。 | 使用 `WASD`／方向鍵做連續操控，並將 `E`／`Q`／`R` 對應到巨觀世界或物件事件，搭配 `2s` 冷卻時間。 |
| **保留的 `user_action` 按鍵** | `key_e` 與 `space` 存在於 `user_action` 列舉中，但沒有經過訓練的「互動」或「跳躍」模型語義。 | 在用戶端攔截 `E`、`Q`、`R` 或 `Space`，傳送明確的 `input` 文字提示詞（每 `150 ms` 傳 `10×` 次）。 |
| **音訊配樂與持續音改寫** | 背景音樂類型與窄頻持續音詞彙（`hum`、`rumble`、`synth`）會被刪除或改寫。 | 明確提示寬頻物理接觸擬音（腳步聲、水聲、風聲、碎石聲、玻璃碰撞聲）與引號包起的角色語音。 |
| **區域服務延遲與 WebRTC `64 KB` SCTP 上限** | 由美國、西歐與日本提供服務。在北美洲、西歐與中歐、東亞以外，往返時間 `>150 ms` 會增加操控延遲並可能降低影格率；過大的 base64 圖片會在 WebRTC 資料通道上失敗。 | 為這些區域以外的使用者偏好步行或導演節奏的世界，並將 `16:9` WebRTC JPEG 種子圖片壓縮到 `48 KB` 以下。 |
| **安全與背誦篩選** | 真人臉孔、公眾人物與可識別的品牌 IP 可能封鎖 `world_setup` 或關閉進行中的工作階段。 | 使用風格化藝術、原創虛構環境與公有領域風景畫。 |


## 後續步驟 {#whats-next}

*   在[使用 Genie 4 生成互動世界](/docs/genie/)中建立瀏覽器 WebRTC 或 Python WebSocket 用戶端。
*   檢視 [Genie 4 模型頁面](/docs/models/genie-4/)上的模型規格。
*   查看 [Genie 4 定價](/docs/pricing/#genie-4)與[速率限制](/docs/rate-limits/#genie-4)。
