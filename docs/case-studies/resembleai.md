# 以 Gemini 3 Flash 提供即時深偽情報

[Resemble AI](http://resemble.ai/) 是生成式語音與深偽偵測領域的領導者。隨著深偽技術日益精密，受監管產業的企業客戶需要的，不只是一個二元的「真實」或「偽造」標籤——他們需要即時理解內容為何被標記。為了彌合技術鑑識與人類理解之間的鴻溝，Resemble AI 將 [Gemini 3 Flash](http://ai.google.dev/gemini-api/docs/models#gemini-3.0-flash) 整合進「Resemble Intelligence」，這套系統能把複雜的偵測資料轉化為自然語言說明，同時不犧牲即時效能。

## 速度就是一切：從像素層級分析到高層次推理

無論是試圖查證爆紅影片的一般消費者，還是以語音代理驗證來電者身分的銀行，與詐騙內容的競賽都以秒計。延遲可能打斷關鍵互動的流暢度。傳統上，偵測模型輸出的是技術性的熱力圖或機率分數，雖然準確，卻無法回答使用者最迫切的問題：「這為什麼可疑？」為了在近乎即時的情況下提供這層不可或缺的可解釋性，Resemble AI 打造了一條無縫的流程，將其專有的 [DETECT-3B Omni](https://www.resemble.ai/detect-3b-omni) 模型（用於辨識特定的操縱痕跡）與 Gemini 3 Flash（用於生成富含上下文的說明）配對。這項整合的多模態分析速度比 2.5 Pro 快 4 倍，能分析原始的技術輸出，同時不拖慢關鍵工作流程。

Resemble AI 也將 Gemini 3 Flash 與其最新的開源文字轉語音模型 [Chatterbox](https://www.resemble.ai/chatterbox/) 配對，用於回應時間不到一秒的互動式語音 AI 代理。

## 以接地為本的情報：優先維護鑑識完整性

Resemble AI 運用 Gemini 3 Flash 的先進推理，達到更高的鑑識完整性標準。這套系統生成的虛構痕跡比先前版本減少 25%，確保每一份自動生成的說明都嚴格以鑑識資料為依據。這種準確度對需要遵守監管要求的企業至關重要。為了協助企業因應 EU AI Act 等全球透明度法規，Resemble AI 運用 Gemini 3 Flash 協助驗證專有浮水印，並提供清晰、可行的情報。對於經驗證的語音代理，偵測會即時進行。若一通電話被標記，Gemini 3 Flash 會立即生成摘要，說明其中涉及的具體風險因素。這讓「人工接手」得以順暢進行，確保接手的客服人員掌握完整上下文，而不是兩眼一抹黑。

Resemble AI 的實作證明，安全與速度不必二選一。透過在其偵測報告中加入一層可解釋性，他們協助企業獲得因應深偽所需的情報，而不只是偵測到深偽。想開始以 Gemini 模型打造產品，請閱讀我們的 [API 文件](https://ai.google.dev/docs)，或在 [Google AI Studio](https://aistudio.google.com/) 中試用這個模型。

### 作者
