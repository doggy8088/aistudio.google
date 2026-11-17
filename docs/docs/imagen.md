# 使用 Imagen 產生圖片


!!! warning " "

      Imagen 模型已停止運作。產生圖片請改用 Nano Banana。


Imagen 是 Google 的舊版圖片生成模型，現已停止運作，不再於 Gemini API 中提供。

## 遷移至 Nano Banana {#migrate-to-nano-banana}

產生圖片請遷移至 Nano Banana：

- **模型名稱**：使用 `gemini-2.5-flash-image`（或 Nano Banana 2 模型，例如 `gemini-3.1-flash-image`），不要再使用 Imagen 模型名稱。
- **方法**：使用 `client.models.generate_content`，而非 `client.models.generate_images`。
- **回應處理**：Nano Banana 傳回的內容部分包含圖片資料，而非特定的圖片回應物件。

詳情與範例請參閱[圖片生成指南](/docs/image-generation/)。
