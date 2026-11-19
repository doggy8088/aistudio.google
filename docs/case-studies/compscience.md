# CompScience 運用隨需影像與影片分析提升工業場域安全

CompScience 的使命是運用 AI 消除職場意外，提供 Safe Work Plans、即時警報，以及由工作場域影片畫面產生的全面安全報告。CompScience 與 National Safety Council 等專業風險專家合作，服務橫跨多個產業的 100 多家工業客戶，幫助他們在風險演變成傷害之前就辨識出來。CompScience 的核心挑戰是龐大的資料量。工業場域每天產生數百小時的影片。人工以規模化方式審查這些畫面以找出潛在危害，是不可能的。為了將這個龐大的非結構化資料集轉化為簡潔、可行的安全資訊，CompScience 採用了 Gemini API。

## 以 Gemini 2.5 Pro 擴展專家安全知識

CompScience 運用 Gemini 2.5 Pro 打造其 Safe Work Plan 應用程式。當維修工人在工廠遇到計畫外的工作時，他們可以用手機拍下現場情況的照片。

![手機螢幕，讓使用者輸入工作詳情以進行快速風險預測。](https://www.gstatic.com/aistudio/case_studies/compScience/CompScience_inline_01.jpg)

2.5 Pro 處理這些影像，依據複雜的安全評估準則進行推理，並提供專家觀點的建議與指引。這些建議接著可以儲存為公司的標準安全程序，有效地將專家安全知識數位化並規模化。

## 以 Gemini 2.5 Flash 處理超過 1.5 萬小時的影片

除了靜態影像，CompScience 還需要為其 Safety Pulse 與 Safety Search 產品處理連續的影片串流。他們運用 Gemini 2.5 Flash 定期評估工作場域攝影機是否有立即的問題，並在數分鐘內快速搜尋數百小時的封存影片，以生成影響報告。CompScience 首席工程師 Daniel Walton 表示，2.5 Flash 的原生影片處理能力是關鍵的差異化因素，他指出在他們測試過的其他 AI 供應商中，「影片處理根本達不到同等水準」。為了管理影片資料的高輸送量，CompScience 運用 Files API，使用多個執行緒上傳影片並高效率地生成洞見。CompScience 最近的一項發展，是運用 Gemini 2.5 Flash 在連續影片或影像中於辨識出的危害周圍生成邊界框的能力。這種視覺接地讓他們能在報告中協助辨識不安全的行為或狀況，Walton 指出這項功能在他們的特定使用案例中「只有 Gemini 2.5 Flash 能做到」。

![CompScience SafetyPulse 介面的兩張螢幕截圖。左側畫面顯示建築工地的影片畫面，起重機周圍有綠色邊界框，旁邊有「Alert」記錄，標示出懸吊負載危害。「Take Action」彈出式選單讓使用者選擇矯正措施。右側畫面顯示「Safety Overview」儀表板，包含攝影機活動縮圖、警報摘要，以及一份列出潛在安全危害與改進建議的生成報告。](https://www.gstatic.com/aistudio/case_studies/compScience/CompScience_inline_02.jpg)

## 主動提升安全並降低危害

透過整合 Gemini 模型，CompScience 目前向數百家客戶提供影片驅動的安全報告。其 AI 驅動方法的成效，使 National Safety Council 將 CompScience Safe Work Plan 系統納入提供給其自家會員，將這些安全效益擴展到更廣大的工業受眾。

### 作者
