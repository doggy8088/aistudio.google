# Gemini API 程式庫

使用 Gemini API 進行開發時，我們建議使用 **Google GenAI SDK**。
這些是我們為最受歡迎的程式語言開發與維護的官方程式庫，已可供正式環境使用。
目前處於[正式推出](/docs/libraries/#new-libraries)階段，我們所有官方
文件與範例皆使用這些程式庫。


!!! note " "

      注意：如果您使用的是舊版程式庫，我們強烈建議您
      [遷移](/docs/migrate/)至 Google GenAI SDK。請參閱
      [舊版程式庫](/docs/libraries/#previous-sdks)一節以瞭解更多
      資訊。如果您使用 AI 程式設計助理，請安裝
      [Gemini API 開發技能](/docs/coding-agents/)，讓您的
      代理能存取最新文件與最佳做法。


如果您是 Gemini API 的新手，請依照我們的[開始使用指南](/docs/get-started/)入門。

## 語言支援與安裝 {#install}

Google GenAI SDK 提供 Python、JavaScript/TypeScript、Go 與
Java 等語言版本。您可以透過套件管理工具安裝各語言的程式庫，
或造訪各自的 GitHub 存放區進一步參與：


=== "Python"

      * 程式庫：[`google-genai`](https://pypi.org/project/google-genai)

      * GitHub 存放區：[googleapis/python-genai](https://github.com/googleapis/python-genai)

      * 安裝方式：`pip install google-genai`

=== "JavaScript"

      * 程式庫：[`@google/genai`](https://www.npmjs.com/package/@google/genai)

      * GitHub 存放區：[googleapis/js-genai](https://github.com/googleapis/js-genai)

      * 安裝方式：`npm install @google/genai`

=== "Go"

      * 程式庫：[`google.golang.org/genai`](https://pkg.go.dev/google.golang.org/genai)

      * GitHub 存放區：[googleapis/go-genai](https://github.com/googleapis/go-genai)

      * 安裝方式：`go get google.golang.org/genai`

=== "Java"

      * 程式庫：`google-genai`

      * GitHub 存放區：[googleapis/java-genai](https://github.com/googleapis/java-genai)

      * 安裝方式：如果您使用 Maven，請將下列內容加入相依性設定：

        ```xml
        <dependencies>
          <dependency>
            <groupId>com.google.genai</groupId>
            <artifactId>google-genai</artifactId>
            <version>1.0.0</version>
          </dependency>
        </dependencies>
        ```

=== "C#"

      * 程式庫：`Google.GenAI`

      * GitHub 存放區：[googleapis/dotnet-genai](https://googleapis.github.io/dotnet-genai/)

      * 安裝方式：`dotnet add package Google.GenAI`


## 正式推出 {#new-libraries}

截至 2025 年 5 月，Google GenAI SDK 已在所有支援平台達到正式推出（GA）
階段，是存取 Gemini API 的建議程式庫。這些程式庫穩定、完整支援正式環境使用，且
持續積極維護。它們提供最新功能的存取，並在搭配 Gemini 使用時
帶來最佳效能。

如果您使用的是舊版程式庫，
我們強烈建議您進行遷移，以便存取最新功能並
在搭配 Gemini 使用時獲得最佳效能。請參閱[舊版程式庫](/docs/libraries/#previous-sdks)一節以瞭解更多資訊。

## 舊版程式庫與遷移 {#previous-sdks}

如果您使用的是舊版程式庫，我們建議您
[遷移至新程式庫](/docs/migrate/)。

舊版程式庫無法存取近期功能（例如
[Live API](/docs/live-api/) 與 [Veo](/docs/video/)），且
已於 2025 年 11 月 30 日淘汰。

各舊版程式庫的支援狀態不一，詳見下表：

| 語言 | 舊版程式庫 | 支援狀態 | 建議程式庫 |
| :--- | :--- | :--- | :--- |
| **Python** | [`google-generativeai`](https://github.com/google-gemini/deprecated-generative-ai-python) | 不再積極維護 | [`google-genai`](https://github.com/googleapis/python-genai) |
| **JavaScript/TypeScript** | [`@google/generativeai`](https://github.com/google-gemini/generative-ai-js) | 不再積極維護 | [`@google/genai`](https://github.com/googleapis/js-genai) |
| **Go** | [`google.golang.org/generative-ai`](https://github.com/google/generative-ai-go) | 不再積極維護 | [`google.golang.org/genai`](https://github.com/googleapis/go-genai) |
| **Dart and Flutter** | [`google_generative_ai`](https://pub.dev/packages/google_generative_ai/install) | 不再積極維護 | 使用 [Genkit Dart](https://genkit.dev/docs/dart/get-started/) 或 [Firebase AI Logic](https://pub.dev/packages/firebase_ai) |
| **Swift** | [`generative-ai-swift`](https://github.com/google/generative-ai-swift) | 不再積極維護 | 使用 [Firebase AI Logic](https://firebase.google.com/products/firebase-ai-logic) |
| **Android** | [`generative-ai-android`](https://github.com/google-gemini/generative-ai-android) | 不再積極維護 | 使用 [Firebase AI Logic](https://firebase.google.com/products/firebase-ai-logic) |

**Java 開發者注意事項**：Gemini API 先前並無 Google 提供的舊版 Java SDK，
因此無需從先前的 Google 程式庫遷移。您可以直接從
[語言支援與安裝](/docs/libraries/#install)一節的新程式庫開始使用。
