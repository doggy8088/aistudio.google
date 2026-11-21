# Genie 4

Genie 4（`genie-4`）是 [Interactions API](/docs/interactions-overview/) 上的即時互動世界生成模型。從文字提示詞、16:9 參考圖片或兩者一起為世界播下種子，再使用鍵盤移動控制（`WASD` 與方向鍵）與工作階段中途的文字事件，即時探索並操控 24 fps 影片與 48 kHz 立體聲音訊串流。

若要進行離線、固定時長的片段生成、多輪影片編輯與最高 4K 的升頻，請改用 [Gemini Omni 1.2 Flash](/docs/models/gemini-omni-flash/)。

[在 Google AI Studio 中試用 Genie 4](https://aistudio.google.com/live?model=genie-4)

## 文件 {#documentation}

*   [使用 Genie 4 生成互動世界](/docs/genie/)：搭配 `@google/genai`（WebRTC 與 WebSocket）與 `google-genai`（非同步 WebSocket）的端到端設定、暫時工作階段 token、事件通訊協定與媒體串流解碼。
*   [Genie 4 提示與控制指南](/docs/genie-prompting/)：針對因果物件規則、自訂按鍵綁定動作動詞、16:9 風景畫種子、寬頻擬音，以及 Google AI Studio Live 遊樂場控制，經過測試的提示詞模式。

## genie-4 {#genie-4}


| 屬性 | 說明 |
| --- | --- |
| 模型代碼 | `genie-4` |
| 支援的資料類型 | **輸入** 文字（`world_setup` 與工作階段中途的 `input` 操控）、16:9 參考圖片（`world_setup`）、鍵盤與攝影機控制（`user_action`） **輸出** 串流影片（16:9、24 fps）與同步的 48 kHz 立體聲音訊 |
| 串流與工作階段上限 | **輸出影片** 1280x720（720p、16:9、24 fps），每幀 240 個影片輸出 token（每秒 5,760 個 token） **工作階段最長時長** 每個工作階段最長 120 seconds（視覺連貫性與物件恆存性在前 45-90 seconds 最強） **輸出音訊** 48 kHz 立體聲（WebSocket 上為 16-bit PCM；WebRTC 上為 Opus），計入影片輸出 token **參考圖片** `world_setup` 中的單張 16:9 圖片（WebRTC 上請將壓縮後的 JPEG 保持在 48 KB 以下，讓 base64 JSON 事件維持在 64 KB SCTP 資料通道上限內） **服務區域** 美國、西歐與日本（北美洲、西歐與中歐、東亞的往返時間 < 150 ms；這些區域以外的延遲較高，會拖慢操控並可能降低影格率） |
| 功能 | [**互動世界生成**](/docs/genie/) 支援 [**音訊生成**](/docs/genie/) 支援 [**程式碼執行**](/docs/code-execution/) 不支援 [**上下文快取**](/docs/caching/) 不支援 [**檔案搜尋**](/docs/file-search/) 不支援 [**函式呼叫**](/docs/function-calling/) 不支援 [**使用 Google Maps 接地**](/docs/maps-grounding/) 不支援 [**使用 Google 搜尋接地**](/docs/google-search/) 不支援 [**圖片生成**](/docs/image-generation/) 不支援 [**Live API**](/docs/live-api/) 不支援 [**結構化輸出**](/docs/structured-output/) 不支援 [**URL 上下文**](/docs/url-context/) 不支援 |
| 使用選項 | [**Batch API**](/docs/batch-api/) 不支援 [**Flex 推論**](/docs/flex-inference/) 不支援 [**優先推論**](/docs/priority-inference/) 不支援 |
| 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。 | 穩定版：`genie-4` |
| 最近更新 | 2026 年 11 月 |
| 定價 | [定價](/docs/pricing/#genie-4) |
| 速率限制 | [速率限制](/docs/rate-limits/#genie-4) |
