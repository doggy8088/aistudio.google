# CalCam 運用 Gemini 2.0 Flash 進行快速、準確的營養分析

Gemini API 讓開發人員能建立對終端使用者而言感覺簡單直覺的複雜應用程式。應用程式開發商 Polyverse 透過 CalCam 應用程式協助使用者追蹤營養，該應用程式使用 AI 分析圖片中的熱量攝取，並驅動營養海報與餐點評分等引人入勝的功能。透過使用 Gemini API，Polyverse 改善了回應時間、使用者滿意度評分提升 20%，並以精簡的工具強化了內部工作流程。

![CalCam 應用程式分析使用者拍攝的餐點照片，計算巨量營養素，並追蹤熱量攝取。](https://ai.google.dev/static/images/showcase/calcam/calcam-gemini-app.png)

## 更高的精確度，帶來更好的健康洞察

CalCam 使用者提供餐點照片進行分析，以追蹤自己的營養。處理照片後，[Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/flash/) 會生成結構化的 JSON 輸出，整合進 CalCam 的工作流程，計算料理的食材、重量與巨量營養素資訊。這些輸出會再對照營養知識與邏輯進行評估，以提升結果的準確度與一致性。

![CalCam 使用者可在需要時提供修正，促使 Gemini 模型重新評估並生成新的、更精煉的分析。](https://ai.google.dev/static/images/showcase/calcam/calcam-gemini-data.png)

整合 Gemini 2.0 Flash 辨識細微元素（例如醬料與調味料）的能力，並能根據回饋精煉分析，CalCam 讓使用者能以更高的精確度追蹤餐點，並就飲食與健康做出明智的決定。

## 在 Google AI Studio 的協助下精簡應用程式開發

Polyverse 強調，自訂 Gemini 模型的容易程度，是加速開發流程的關鍵。[Google AI Studio](https://aistudio.google.com/prompts/new_data) 中的結構化輸出視覺編輯器，讓 CalCam 團隊中非程式設計人員也能參與建構與編輯輸出，減少對程式設計專業的依賴。

![Google AI Studio 的結構化輸出編輯器可用於指定模型回應的 JSON 結構定義。](https://ai.google.dev/static/images/showcase/calcam/google-ai-studio-gemini-nutrition-analysis.png)

未來，Polyverse 計畫開發更具互動性與個人化的功能，例如 AI 驅動的食譜與教練服務，以實現 CalCam 讓健康生活變得有趣且容易達成的使命。透過運用 [Gemini API](/docs/) 強大的多模態推理與結構化輸出工具，應用程式功能將持續改善，對注重健康的使用者而言更有價值。下載 [CalCam](https://play.google.com/store/apps/details?id=com.ai.calcam)，開始邁向你的營養目標，並在 [Google AI Studio](https://aistudio.google.com/prompts/new_chat?model=gemini-flash-latest) 中以 Gemini 2.0 Flash 探索圖片推理。

### 作者
