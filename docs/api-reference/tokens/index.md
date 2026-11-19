# 計算 token 數

如需了解如何使用 Gemini API 計算 token 數的詳細指南，包括圖片、音訊與影片的計算方式，請參閱[token 計算指南](/docs/tokens/)與隨附的 [Cookbook recipe](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Counting_Tokens.ipynb)。

## 方法 {#methods}


| 方法 | HTTP 請求 |
| --- | --- |
| [計算 token 數](/api-reference/tokens/count-tokens/) | `POST` `/v1beta/models/{model}:countTokens` 在輸入的 `Content` 上執行模型的 tokenizer，並傳回 token 數量。 |
