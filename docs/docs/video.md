# Gemini API 中的影片生成

在 Gemini API 中進行影片生成與對話式影片編輯時，請使用 [Gemini Omni Flash](/docs/omni/)（`gemini-omni-1.2-flash`）作為模型。它可生成最長 15 秒的影片，並具備原生音訊、多輸入推理（支援文字、圖片與影片輸入）、最多 6 張參考圖片之間的角色一致性，以及多輪對話式編輯與延伸功能。

Gemini API 中的 Veo 3.1 Preview 已停止服務。

## Gemini Omni Flash {#omni-flash}

Gemini Omni Flash（`gemini-omni-1.2-flash`）是一款速度快的多模態模型，專為影片生成與對話式影片編輯而設計。它擅長將文字提示詞與參考圖片轉換為 3 至 15 秒、附原生音訊的影片，並能透過 Interactions API 在多個回合之間精修或延伸成果。

[開始使用 Gemini Omni Flash →](/docs/omni/)

## Veo 3.1 {#veo}


!!! warning " "

       Veo 3.1 Preview (`veo-3.1-generate-preview`、
      `veo-3.1-fast-generate-preview` 與 `veo-3.1-lite-generate-preview`) 在
      Gemini API 中已於 **October 22, 2026** [停止服務](/docs/deprecations/)；請遷移
      至 [Gemini Omni Flash](/docs/omni/)（`gemini-omni-1.2-flash`）或透過
      [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate) 提供的 GA 模型，
      以避免服務中斷。


## 影片理解 {#understanding}

如果您需要匯入並分析既有的影片內容，而不是生成新影片，請參閱[影片理解指南](/docs/video-understanding/)。
