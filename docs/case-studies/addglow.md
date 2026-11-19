# 從數個月到一天：以 Gemini 3 Pro Image 加速時尚照片製作

AddGlow 協助時尚品牌與零售商繞過傳統攝影的後勤瓶頸，提供專為企業級創意製作設計的零售專用儀表板。透過將 Gemini 3 Pro 整合到其高傳真成像管線中，AddGlow 為其產生的每項素材帶來毫不妥協的品質，同時提供因應現代零售環境需求所需的敏捷性。

## 維持圖片產生的製作品質

確保服裝的精確度是 AddGlow 的最高優先事項，其客戶包括 Elliatt、Mac Duggal 與 Alex Apparel 等知名品牌。團隊發現，許多 AI 模型會出現幻覺問題，竄改鈕扣樣式、領口或布料紋理等關鍵細節。這些不一致會侵蝕客戶信任，使自動化解決方案難以應用於可正式上線的工作。

![AddGlow 的姿勢目錄](https://www.gstatic.com/aistudio/case_studies/addglow/addglow_poses.webp)

AddGlow 利用 Gemini 3 Pro Image 的多模態推理能力與多張參考圖片，解決這個精確度差距。為確保數以千計的獨特 SKU 都能保持精確，AddGlow 開發了一套精密的管線，能適應不同品項的物理特性並產生高品質輸出：**自動化預先分析**：平台使用 Gemini Flash-Lite 從參考輸入中萃取必要的中繼資料，例如服裝類型、觀看角度與布料特質，並據此組織提示詞。**JSON schema 接地**：這種方法將模型輸出限制在經過驗證、可由機器讀取的資料中，免除人工介入的需要。**人工監督**：每次產生都包含人工核准步驟以驗證精確度，確保最終輸出符合品牌特定的創意標準。

> 「細節至關重要。沒有 Gemini，我們無法執行任何 GenAI 照片使用案例。它是唯一達到我們品質標準的模型。」

— Ina Herlihy，AddGlow 創辦人暨執行長

## 加速創意產出，推動營收

將服裝推向市場的一大挑戰，在於特殊影像所需的後勤工作，例如隱形人台攝影。傳統上，這需要分別進行專門的拍攝，將服裝穿在特殊的模特兒架上拍照，之後再將其修掉。這個過程昂貴、緩慢，而且往往需要數週的修圖。

AddGlow 克服了這些陷阱，讓高產量的零售商與奢華時尚品牌能從現有照片產生圖片，大幅縮短新產品上市的周轉時間。Alex Apparel Group 電子商務與行銷副總裁 Shari Hoenig 指出，AddGlow「簡化了電子商務攝影的『微型後勤』，彌合了大型廣告活動拍攝與小規模網站更新之間的差距，每個週期節省了三天的規劃與清理時間」。

![從現有的 Mac Duggal 模特兒照片產生的隱形人台圖片](https://www.gstatic.com/aistudio/case_studies/addglow/addglow_ghostmannequin.webp)

除了後勤效率，品牌還面臨著不斷需要新內容來支援多個行銷管道的壓力。過去，品牌往往被鎖定在單次拍攝中捕捉到的特定姿勢。AddGlow 讓使用者專注於拍攝核心角度，然後利用 Gemini Pro Image 產生各種獨特的姿勢與背景。「它讓我們在不同管道呈現產品時有更大的彈性，」Mac Duggal 電子商務主管 Emily Greenfield 表示。這種擴展素材建立的能力，擴大了付費媒體實驗的機會，進而提升轉換率並推動營收。ELLIATT 電子商務主管 Nicky Bennett 解釋：「即使轉換率只有小幅提升，搭配所有 SKU 更高的圖片產量，對營收也有深遠的影響。」

![ELLIATT 如何重現外景拍攝](https://www.gstatic.com/aistudio/case_studies/addglow/addglow_backgrounds.webp)

## 透過 Google AI Studio 進行細緻的控制

AddGlow 發現，Google AI Studio 提供了維持一致、生產級美學的工具，透過長寬比控制與原生 4K 解析度支援。他們的目標是將 AI 驅動的產品擴展到更複雜的任務，例如直接將設計插圖轉換為逼真的照片，承諾以更新穎的方式擴展創意製作。閱讀 Gemini API 文件，開始使用 [Gemini Pro](https://ai.google.dev/gemini-api/docs/image-generation) 打造應用。

### 作者
