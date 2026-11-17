# 上下文快取

在典型的 AI 工作流程中，你可能會反覆將相同的輸入權杖傳給模型。Gemini API 提供隱式快取，可最佳化效能與成本。


!!! note " "

      **Interactions API** 僅支援隱式快取。Interactions API 與 Gemini 4 模型不支援顯式快取（手動建立及管理快取物件）。若要在支援的 Gemini 3 與 2.5 模型上使用顯式快取，請改用 [generateContent API](/docs/caching/?generate-content=true)。


## 隱式快取 {#implicit-caching}

所有 Gemini 2.5 及更新版本的模型都預設啟用隱式快取。它同時支援[有狀態](/docs/text-generation/#multi-turn-conversations)（使用 `previous_interaction_id`）與[無狀態](/docs/text-generation/#stateless-conversations)對話模式。若你的要求命中快取，我們會自動將節省的成本回饋給你。你無需進行任何設定即可啟用。下表列出各模型的最低輸入權杖數量：

| 模型 | 最低權杖上限 |
| :--- | :--- |
| Gemini 4 Carbon | 4,096 |
| Gemini 4 Argon | 4,096 |
| Gemini 4 Hydrogen | 4,096 |
| Gemini 3.8 Flash | 4,096 |
| Gemini 3.6 Flash | 4,096 |
| Gemini 3.1 Pro Preview | 4,096 |
| Gemini 2.5 Flash | 2,048 |
| Gemini 2.5 Pro | 2,048 |

若要提高隱式快取命中的機率：

- 試著將龐大且共通的內容放在提示詞開頭
- 試著在短時間內傳送具有相似前綴的要求


!!! note " "

      **Gemini 4 上的多輪對話與代理迴圈**：只有當新要求新增至少 2,050 個權杖時，Gemini 才會快取完整的前一個要求。模型輸出、思考過程與函式結果都計入此總數。若新增量較小，Gemini 會以標準輸入費率重新處理前一個要求最後的 2,050 個權杖。大多數代理輪次都會超過此門檻。


你可以在回應物件的 `usage.total_cached_tokens`（Python 與 JavaScript）欄位中，查看命中快取的權杖數量。
