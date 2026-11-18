# 嵌入向量

Gemini API 提供嵌入模型，可為文字、圖片、影片及其他內容產生嵌入向量。產生的嵌入向量可用於語意搜尋、分類與分群等任務，相比關鍵字方法，能提供更準確、更能感知上下文的結果。

最新模型 `gemini-embedding-2` 是 Gemini API 中第一個多模態嵌入模型。它將文字、圖片、影片、音訊與文件對映到統一的嵌入空間，支援 100 多種語言的跨模態搜尋、分類與分群。詳情請參閱[多模態嵌入向量](/docs/embeddings/#multimodal)章節。若只需處理文字，`gemini-embedding-001` 仍可使用。

建構檢索增強生成（RAG）系統是 AI 產品的常見應用情境，嵌入向量在其中扮演關鍵角色，能大幅提升模型輸出的事實準確性、連貫性與上下文豐富度。若你偏好使用代管的 RAG 解決方案，我們打造了 [File Search](/docs/file-search/) 工具，讓 RAG 更容易管理、更具成本效益。

## 產生嵌入向量 {#generate-embeddings}

使用 `embedContent` 方法產生文字嵌入向量：


=== "Python"

      ```python
      from google import genai

      client = genai.Client()

      result = client.models.embed_content(
              model="gemini-embedding-2",
              contents="What is the meaning of life?"
      )

      print(result.embeddings)
      ```

=== "JavaScript"

      ```js
      import { GoogleGenAI } from "@google/genai";

      async function main() {

          const ai = new GoogleGenAI({});

          const response = await ai.models.embedContent({
              model: 'gemini-embedding-2',
              contents: 'What is the meaning of life?',
          });

          console.log(response.embeddings);
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.EmbedContentResponse;

      Client client = new Client();

      EmbedContentResponse response =
          client.models.embedContent("gemini-embedding-2", "What is the meaning of life?", null);

      System.out.println(response.embeddings().orElse(null));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "encoding/json"
          "fmt"
          "log"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          contents := []*genai.Content{
              genai.NewContentFromText("What is the meaning of life?", genai.RoleUser),
          }
          result, err := client.Models.EmbedContent(ctx,
              "gemini-embedding-2",
              contents,
              nil,
          )
          if err != nil {
              log.Fatal(err)
          }

          embeddings, err := json.MarshalIndent(result.Embeddings, "", " ")
          if err != nil {
              log.Fatal(err)
          }
          fmt.Println(string(embeddings))
      }
      ```

=== "REST"

      ```shell
      curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent" \
          -H "Content-Type: application/json" \
          -H "x-goog-api-key: ${GEMINI_API_KEY}" \
          -d '{
              "model": "models/gemini-embedding-2",
              "content": {
              "parts": [{
                  "text": "What is the meaning of life?"
              }]
              }
          }'
      ```


!!! note " "

      雖然 `gemini-embedding-001` 可為字串清單中的每個字串產生個別的嵌入向量，Gemini Embedding 2 則會為多個輸入產生單一彙整後的嵌入向量。更多資訊請參閱[嵌入向量彙整](/docs/embeddings/#embedding-aggregation)，若想一次產生多個嵌入向量，也可以使用 [Batch API](/docs/batch-api/#batch-embedding)。


## 指定任務類型以提升效能 {#task-types}

嵌入向量可用於分類、文件搜尋等各式各樣的任務。指定正確的任務類型，有助於針對預期的關聯性最佳化嵌入向量，最大化準確性與效率。

### Embeddings 2 的任務類型 {#task-types-embeddings-2}

對於使用 `gemini-embedding-2` 的純文字任務，我們強烈建議在提示詞中加入任務指令。做法是使用正確的任務前綴來格式化查詢與文件。

產生[以多模態輸入為基礎的單一嵌入向量](/docs/embeddings/#embedding-aggregation)時，一般不建議在輸入的文字部分加上任務指令前綴。某些情況下這樣做能提升效能，某些情況下反而會降低效能。

下表以 `gemini-embedding-2` 模型為例，說明對稱與非對稱使用情境下查詢與文件的格式化方式。

**檢索使用情境**（非對稱格式）

在非對稱使用情境中，將任務前綴加到查詢上，並對要嵌入與檢索的內容套用文件結構。


| 使用情境 | 查詢結構 | 文件結構 |
| --- | --- | --- |
| 搜尋查詢 | `task: search result | query: {content}` | `title: {title} | text: {content}` 若沒有標題，請使用 `title: none`。 |
| 問答 | `task: question answering | query: {content}` | `title: {title} | text: {content}` |
| 事實查核 | `task: fact checking | query: {content}` | `title: {title} | text: {content}` |
| 程式碼檢索 | `task: code retrieval | query: {content}` | `title: {title} | text: {content}` |


**使用範例**


=== "Python"

      ```python
      def prepare_query(query):
          return f"task: search result | query: {query}"

      def prepare_document(content, title=None):
          if title is None:
              title = "none"
          return f"title: {title} | text: {content}"
      ```

=== "Java"

      ```java
      // Generate embedding for a task's query. Use your correct task here:
      String query = "What is the capital of France?";
      String formattedQuery = "task: search result | query: " + query;

      // Generate embedding for document of an asymmetric retrieval task:
      String title = "France";
      String content = "Paris is the capital and most populous city of France.";
      String formattedDocument = "title: " + (title != null ? title : "none") + " | text: " + content;
      ```


**單一輸入使用情境**（對稱格式）

在對稱使用情境中，同一個任務的查詢與文件應使用相同的格式。


| 使用情境 | 輸入結構 |
| --- | --- |
| 分類 | `task: classification | query: {content}` |
| 分群 | `task: clustering | query: {content}` |
| 語意相似度 | `task: sentence similarity | query: {content}` 請勿用於搜尋或檢索；此格式用於語意文字相似度。 |


**使用範例**


=== "Python"

      ```python
      def prepare_query_and_document(content):
          return f'task: classification | query: {content}'
      ```

=== "Java"

      ```java
      // Generate embedding for query & document of your task.
      String content = "This movie was fantastic!";
      String formattedContent = "task: classification | query: " + content;
      ```


任務的使用方式必須保持一致，這一點很重要。例如，若文件以 `f'task: classification | query: {content}'` 格式嵌入，查詢也應依此任務格式嵌入。

### Embeddings 1 的任務類型 {#task-types-embeddings-1}

使用 `gemini-embedding-001` 時，你可以指定 `task_type`（透過 `embedContent` 方法）。支援的任務類型完整清單請參閱[支援的任務類型](/docs/embeddings/#supported-task-types)表格。


!!! note " "

      你無法將 `task_type` 欄位用於 `gemini-embedding-2` 模型。請改為在提示詞中以指令形式加入任務，詳見[上方章節](/docs/embeddings/#task-types-embeddings-2)。


以下範例示範如何使用 `SEMANTIC_SIMILARITY` 檢查多段文字在語意上的相似程度。


=== "Python"

      ```python
      from google import genai
      from google.genai import types
      import pandas as pd
      from sklearn.metrics.pairwise import cosine_similarity

      client = genai.Client()

      texts = [
          "What is the meaning of life?",
          "What is the purpose of existence?",
          "How do I bake a cake?",
      ]

      result = client.models.embed_content(
          model="gemini-embedding-001",
          contents=texts,
          config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY")
      )

      df = pd.DataFrame(
          cosine_similarity([e.values for e in result.embeddings]),
          index=texts,
          columns=texts,
      )

      print(df)
      ```

=== "JavaScript"

      ```js
      import { GoogleGenAI } from "@google/genai";
      // npm i compute-cosine-similarity
      import * as cosineSimilarity from "compute-cosine-similarity";

      async function main() {
          const ai = new GoogleGenAI({});

          const texts = [
              "What is the meaning of life?",
              "What is the purpose of existence?",
              "How do I bake a cake?",
          ];

          const response = await ai.models.embedContent({
              model: 'gemini-embedding-001',
              contents: texts,
              config: { taskType: 'SEMANTIC_SIMILARITY' },
          });

          const embeddings = response.embeddings?.map(e => e.values || []) || [];

          for (let i = 0; i < texts.length; i++) {
              for (let j = i + 1; j < texts.length; j++) {
                  const text1 = texts[i];
                  const text2 = texts[j];
                  const similarity = cosineSimilarity(embeddings[i], embeddings[j]);
                  console.log(`Similarity between '${text1}' and '${text2}': ${similarity.toFixed(4)}`);
              }
          }
      }

      await main();
      ```

=== "Java"

      ```java
      import java.util.Arrays;
      import com.google.genai.Client;
      import com.google.genai.types.ContentEmbedding;
      import com.google.genai.types.EmbedContentConfig;
      import com.google.genai.types.EmbedContentResponse;
      import java.util.List;

      Client client = new Client();

      List<String> texts =
          Arrays.asList(
              "What is the meaning of life?",
              "What is the purpose of existence?",
              "How do I bake a cake?");

      EmbedContentConfig config =
          EmbedContentConfig.builder().taskType("SEMANTIC_SIMILARITY").build();

      EmbedContentResponse response =
          client.models.embedContent("gemini-embedding-001", texts, config);

      List<ContentEmbedding> embeddings = response.embeddings().get();

      for (int i = 0; i < texts.size(); i++) {
        for (int j = i + 1; j < texts.size(); j++) {
          List<Float> v1 = embeddings.get(i).values().get();
          List<Float> v2 = embeddings.get(j).values().get();
          double dotProduct = 0.0;
          double normA = 0.0;
          double normB = 0.0;
          for (int k = 0; k < v1.size(); k++) {
            dotProduct += v1.get(k) * v2.get(k);
            normA += v1.get(k) * v1.get(k);
            normB += v2.get(k) * v2.get(k);
          }
          double similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
          System.out.printf(
              "Similarity between '%s' and '%s': %.4f%n", texts.get(i), texts.get(j), similarity);
        }
      }
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"
          "math"

          "google.golang.org/genai"
      )

      // cosineSimilarity calculates the similarity between two vectors.
      func cosineSimilarity(a, b []float32) (float64, error) {
          if len(a) != len(b) {
              return 0, fmt.Errorf("vectors must have the same length")
          }

          var dotProduct, aMagnitude, bMagnitude float64
          for i := 0; i < len(a); i++ {
              dotProduct += float64(a[i] * b[i])
              aMagnitude += float64(a[i] * a[i])
              bMagnitude += float64(b[i] * b[i])
          }

          if aMagnitude == 0 || bMagnitude == 0 {
              return 0, nil
          }

          return dotProduct / (math.Sqrt(aMagnitude) * math.Sqrt(bMagnitude)), nil
      }

      func main() {
          ctx := context.Background()
          client, _ := genai.NewClient(ctx, nil)
          defer client.Close()

          texts := []string{
              "What is the meaning of life?",
              "What is the purpose of existence?",
              "How do I bake a cake?",
          }

          var contents []*genai.Content
          for _, text := range texts {
              contents = append(contents, genai.NewContentFromText(text, genai.RoleUser))
          }

          result, _ := client.Models.EmbedContent(ctx,
              "gemini-embedding-001",
              contents,
              &genai.EmbedContentRequest{TaskType: genai.TaskTypeSemanticSimilarity},
          )

          embeddings := result.Embeddings

          for i := 0; i < len(texts); i++ {
              for j := i + 1; j < len(texts); j++ {
                  similarity, _ := cosineSimilarity(embeddings[i].Values, embeddings[j].Values)
                  fmt.Printf("Similarity between '%s' and '%s': %.4f\n", texts[i], texts[j], similarity)
              }
          }
      }
      ```

=== "REST"

      ```shell
      curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent" \
          -H "Content-Type: application/json" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -d '{
          "taskType": "SEMANTIC_SIMILARITY",
          "content": {
              "parts": [
              {
                  "text": "What is the meaning of life?"
              },
              {
                  "text": "How much wood would a woodchuck chuck?"
              },
              {
                  "text": "How does the brain work?"
              }
              ]
          }
          }'
      ```


執行這些程式碼片段後，即可看出各段文字彼此之間的相似程度。


!!! note " "

      餘弦相似度是很好的距離度量方式，因為它著重於方向而非大小，能更準確地反映概念上的接近程度。其值介於 -1（完全相反）到 1（最相似）之間。


#### 支援的任務類型 {#supported-task-types}

`gemini-embedding-001` 支援的任務類型如下：


| **SEMANTIC_SIMILARITY** | 針對評估文字相似度最佳化的嵌入向量。 | 推薦系統、重複內容偵測 |
| --- | --- | --- |
| **CLASSIFICATION** | 針對依預設標籤將文字分類最佳化的嵌入向量。 | 情感分析、垃圾訊息偵測 |
| **CLUSTERING** | 針對依相似度將文字分群最佳化的嵌入向量。 | 文件組織、市場研究、異常偵測 |
| **RETRIEVAL_DOCUMENT** | 針對文件搜尋最佳化的嵌入向量。 | 為文章、書籍或網頁建立索引以供搜尋。 |
| **RETRIEVAL_QUERY** | 針對一般搜尋查詢最佳化的嵌入向量。查詢請使用 `RETRIEVAL_QUERY`；要檢索的文件請使用 `RETRIEVAL_DOCUMENT`。 | 自訂搜尋 |
| **CODE_RETRIEVAL_QUERY** | 針對依自然語言查詢檢索程式碼區塊最佳化的嵌入向量。查詢請使用 `CODE_RETRIEVAL_QUERY`；要檢索的程式碼區塊請使用 `RETRIEVAL_DOCUMENT`。 | 程式碼建議與搜尋 |
| **QUESTION_ANSWERING** | 問答系統中問題的嵌入向量，針對找出能回答問題的文件最佳化。問題請使用 `QUESTION_ANSWERING`；要檢索的文件請使用 `RETRIEVAL_DOCUMENT`。 | 聊天機器人 |
| **FACT_VERIFICATION** | 針對需查證的陳述最佳化的嵌入向量，用於檢索含有支持或反駁該陳述之證據的文件。目標文字請使用 `FACT_VERIFICATION`；要檢索的文件請使用 `RETRIEVAL_DOCUMENT`。 | 自動化事實查核系統 |


## 控制嵌入向量大小 {#control-embedding-size}

`gemini-embedding-001` 與 `gemini-embedding-2` 都是以 Matryoshka Representation Learning (MRL) 技術訓練而成；這項技術讓模型學會產生高維度嵌入向量，其開頭片段（或前綴）本身也是同一份資料可用且更簡單的版本。

使用 `output_dimensionality` 參數可控制輸出嵌入向量的大小。選擇較小的輸出維度能節省儲存空間，並提升下游應用的運算效率，品質損失甚微。兩個模型的預設輸出都是 3072 維嵌入向量，但你可以將其截斷為較小的尺寸以節省儲存空間，品質幾乎不受影響。建議使用 768、1536 或 3072 的輸出維度。


=== "Python"

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client()

      result = client.models.embed_content(
          model="gemini-embedding-2",
          contents="What is the meaning of life?",
          config=types.EmbedContentConfig(output_dimensionality=768)
      )

      [embedding_obj] = result.embeddings
      embedding_length = len(embedding_obj.values)

      print(f"Length of embedding: {embedding_length}")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";

      async function main() {
          const ai = new GoogleGenAI({});

          const response = await ai.models.embedContent({
              model: 'gemini-embedding-2',
              contents: 'What is the meaning of life?',
              config: { outputDimensionality: 768 },
          });

          const embeddingLength = response.embeddings?.[0]?.values?.length || 0;
          console.log(`Length of embedding: ${embeddingLength}`);
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.ContentEmbedding;
      import com.google.genai.types.EmbedContentConfig;
      import com.google.genai.types.EmbedContentResponse;

      Client client = new Client();

      EmbedContentConfig config =
          EmbedContentConfig.builder().outputDimensionality(768).build();

      EmbedContentResponse response =
          client.models.embedContent("gemini-embedding-2", "What is the meaning of life?", config);

      ContentEmbedding embeddingObj = response.embeddings().get().get(0);
      int embeddingLength = embeddingObj.values().get().size();

      System.out.println("Length of embedding: " + embeddingLength);
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
      )

      func main() {
          ctx := context.Background()
          // The client uses Application Default Credentials.
          // Authenticate with 'gcloud auth application-default login'.
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }
          defer client.Close()

          contents := []*genai.Content{
              genai.NewContentFromText("What is the meaning of life?", genai.RoleUser),
          }

          result, err := client.Models.EmbedContent(ctx,
              "gemini-embedding-2",
              contents,
              &genai.EmbedContentRequest{OutputDimensionality: 768},
          )
          if err != nil {
              log.Fatal(err)
          }

          embedding := result.Embeddings[0]
          embeddingLength := len(embedding.Values)
          fmt.Printf("Length of embedding: %d\n", embeddingLength)
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent" \
          -H 'Content-Type: application/json' \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -d '{
              "content": {"parts":[{ "text": "What is the meaning of life?"}]},
              "output_dimensionality": 768
          }'
      ```


程式碼片段的輸出範例：

```none
Length of embedding: 768
```

## 確保較小維度的品質 {#quality-for-smaller-dimensions}


!!! note " "

      `gemini-embedding-2` 針對非預設維度引入了自動重新正規化功能。


預設的 3072 維嵌入向量一律經過正規化，而 Gemini Embedding 2 也會自動正規化截斷後的維度（例如 768、1536）。這確保語意相似度是以向量方向而非大小計算，開箱即用就能得到更準確的結果。

**舊版模型**：若你使用的是 `gemini-embedding-001`，必須依下列方式手動正規化非 3072 的維度：


=== "Python"

      ```python
      import numpy as np
      from numpy.linalg import norm

      embedding_values_np = np.array(embedding_obj.values)
      normed_embedding = embedding_values_np / np.linalg.norm(embedding_values_np)

      print(f"Normed embedding length: {len(normed_embedding)}")
      print(f"Norm of normed embedding: {np.linalg.norm(normed_embedding):.6f}") # Should be very close to 1
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.ContentEmbedding;
      import com.google.genai.types.EmbedContentConfig;
      import com.google.genai.types.EmbedContentResponse;
      import java.util.ArrayList;
      import java.util.List;

      Client client = new Client();

      EmbedContentConfig config =
          EmbedContentConfig.builder().outputDimensionality(768).build();

      EmbedContentResponse response =
          client.models.embedContent("gemini-embedding-2", "What is the meaning of life?", config);

      ContentEmbedding embeddingObj = response.embeddings().get().get(0);
      List<Float> values = embeddingObj.values().get();

      double norm = 0.0;
      for (float v : values) {
        norm += v * v;
      }
      norm = Math.sqrt(norm);

      List<Double> normedEmbedding = new ArrayList<>();
      double newNorm = 0.0;
      for (float v : values) {
        double normedVal = v / norm;
        normedEmbedding.add(normedVal);
        newNorm += normedVal * normedVal;
      }
      newNorm = Math.sqrt(newNorm);

      System.out.println("Normed embedding length: " + normedEmbedding.size());
      System.out.printf("Norm of normed embedding: %.6f%n", newNorm); // Should be very close to 1
      ```


此程式碼片段的輸出範例：

```none
Normed embedding length: 768
Norm of normed embedding: 1.000000
```

下表列出不同維度下的 MTEB 分數；MTEB 是嵌入向量常用的基準測試。值得注意的是，結果顯示效能與嵌入維度大小並非嚴格相關，較低維度也能達到與較高維度相當的分數。


| 2048 | 68.16 |
| --- | --- |
| 1536 | 68.17 |
| 768 | 67.99 |
| 512 | 67.55 |
| 256 | 66.19 |
| 128 | 63.31 |


## 多模態嵌入向量 {#multimodal}

`gemini-embedding-2` 模型支援多模態輸入，可將圖片、影片、音訊與文件內容連同文字一起嵌入。所有模態都會對映到同一個嵌入空間，實現跨模態搜尋與比較。

### 支援的模態與限制 {#supported-modalities}

輸入權杖總數上限為 8192 個權杖。


| **文字** | 最多支援 8,192 個權杖。 |
| --- | --- |
| **圖片** | 每個要求最多 6 張圖片。支援格式：PNG、JPEG。 |
| **音訊** | 最長 180 秒。支援格式：MP3、WAV。 |
| **影片** | 最長 120 秒。支援格式：MP4、MOV。支援的編解碼器：H264、H265、AV1、VP9。系統每部影片最多處理 32 個影格：短影片（≤32 秒）以 1 fps 取樣，較長的影片則均勻取樣至 32 個影格。影片檔案中的音軌不會被處理。 |
| **文件**（PDF） | 每個要求最多 1 個檔案，最多 6 頁。 |


### 嵌入圖片 {#embed-images}

以下範例示範如何使用 `gemini-embedding-2` 嵌入圖片。

圖片可以行內資料形式提供，也可以透過 [Files API](/docs/files/) 以已上傳檔案的形式提供。


=== "Python"

      ```python
      from google import genai
      from google.genai import types

      with open('example.png', 'rb') as f:
          image_bytes = f.read()

      client = genai.Client()

      result = client.models.embed_content(
          model='gemini-embedding-2',
          contents=[
              types.Part.from_bytes(
                  data=image_bytes,
                  mime_type='image/png',
              ),
          ]
      )

      print(result.embeddings)
      ```

=== "JavaScript"

      ```js
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
          const ai = new GoogleGenAI({});

          const imgBase64 = fs.readFileSync("example.png", { encoding: "base64" });

          const response = await ai.models.embedContent({
              model: 'gemini-embedding-2',
              contents: [{
                  inlineData: {
                      mimeType: 'image/png',
                      data: imgBase64,
                  },
              }],
          });

          console.log(response.embeddings);
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.Content;
      import com.google.genai.types.EmbedContentResponse;
      import com.google.genai.types.Part;
      import java.nio.file.Files;
      import java.nio.file.Paths;

      Client client = new Client();

      byte[] imageBytes = Files.readAllBytes(Paths.get("example.png"));

      Content content = Content.fromParts(Part.fromBytes(imageBytes, "image/png"));

      EmbedContentResponse response =
          client.models.embedContent("gemini-embedding-2", content, null);

      System.out.println(response.embeddings().orElse(null));
      ```

=== "REST"

      ```sh
      IMG_PATH="/path/to/your/image.png"
      IMG_BASE64=$(base64 -w0 "${IMG_PATH}")

      curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent" \
          -H "Content-Type: application/json" \
          -H "x-goog-api-key: ${GEMINI_API_KEY}" \
          -d '{
              "content": {
                  "parts": [{
                      "inline_data": {
                          "mime_type": "image/png",
                          "data": "'"${IMG_BASE64}"'"
                      }
                  }]
              }
          }'
      ```


### 嵌入向量彙整 {#embedding-aggregation}

處理多模態內容時，輸入的結構方式會影響嵌入向量的輸出：

* **多個部分（彙整）**：將多個輸入直接加入 `contents` 參數，會為所有輸入產生一個彙整後的嵌入向量。

* **多個 `Content` 物件（個別）**：將每個輸入包裝在 `Content` 物件中並傳入 `contents` 參數，會為每個項目回傳個別的嵌入向量。

* **貼文層級表示法**：對於社群媒體貼文這類含有多個媒體項目的複雜物件，建議將個別的嵌入向量彙整（例如取平均），建立一致的貼文層級表示法。


以下範例示範如何為文字與圖片輸入建立一個彙整後的嵌入向量。只要將多個輸入加入 `contents` 參數即可：


=== "Python"

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client()

      with open('dog.png', 'rb') as f:
          image_bytes = f.read()

      result = client.models.embed_content(
          model='gemini-embedding-2',
          contents=[
              "An image of a dog",
              types.Part.from_bytes(
                  data=image_bytes,
                  mime_type='image/png',
              ),
          ]
      )

      for embedding in result.embeddings:
          print(embedding.values)
      ```

=== "JavaScript"

      ```js
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
          const ai = new GoogleGenAI({});

          const imgBase64 = fs.readFileSync("dog.png", { encoding: "base64" });

          const response = await ai.models.embedContent({
              model: 'gemini-embedding-2',
              contents: [
                  'An image of a dog',
                  {
                      inlineData: {
                          mimeType: 'image/png',
                          data: imgBase64,
                      },
                  },
              ],
          });

          // This produces one embedding
          for (const embedding of response.embeddings || []) {
              console.log(embedding.values);
          }
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.Content;
      import com.google.genai.types.ContentEmbedding;
      import com.google.genai.types.EmbedContentResponse;
      import com.google.genai.types.Part;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Collections;

      Client client = new Client();

      byte[] imageBytes = Files.readAllBytes(Paths.get("dog.png"));

      Content content =
          Content.fromParts(
              Part.fromText("An image of a dog"),
              Part.fromBytes(imageBytes, "image/png"));

      EmbedContentResponse response =
          client.models.embedContent("gemini-embedding-2", content, null);

      // This produces one embedding
      for (ContentEmbedding embedding : response.embeddings().orElse(Collections.emptyList())) {
        System.out.println(embedding.values().orElse(Collections.emptyList()));
      }
      ```

=== "REST"

      ```sh
      IMG_PATH="/path/to/your/dog.png"
      IMG_BASE64=$(base64 -w0 "${IMG_PATH}")

      curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent" \
          -H "Content-Type: application/json" \
          -H "x-goog-api-key: ${GEMINI_API_KEY}" \
          -d '{
              "content": {
                  "parts": [
                      {"text": "An image of a dog"},
                      {
                          "inline_data": {
                              "mime_type": "image/png",
                              "data": "'"${IMG_BASE64}"'"
                          }
                      }
                  ]
              }
          }'
      ```


!!! note " "

      多模態輸入的文字部分不應包含任務類型資訊。


另一方面，若你使用 `Content` 物件（置於 `contents` 參數內），則會回傳個別的嵌入向量。以下範例在一次嵌入呼叫中建立多個嵌入向量：


=== "Python"

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client()

      with open('dog.png', 'rb') as f:
          image_bytes = f.read()

      result = client.models.embed_content(
          model="gemini-embedding-2",
          contents=[
              types.Content(parts=[types.Part.from_text(text="task: classification | query: An image of a dog")]),
              types.Content(
                  parts=[
                      types.Part.from_bytes(
                          data=image_bytes,
                          mime_type="image/png",
                      ),
                  ]
              ),
          ],
      )

      for embedding in result.embeddings:
          print(embedding.values)
      ```

=== "JavaScript"

      ```js
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
          const ai = new GoogleGenAI({});

          const imgBase64 = fs.readFileSync("dog.png", { encoding: "base64" });

          const response = await ai.models.embedContent({
              model: 'gemini-embedding-2',
              contents: [
                  { parts: [{ text: 'task: classification | query: An image of a dog' }] },
                  {
                      parts: [{
                          inlineData: {
                              mimeType: 'image/png',
                              data: imgBase64,
                          },
                      }],
                  },
              ],
          });

          // This produces two embeddings
          for (const embedding of response.embeddings || []) {
              console.log(embedding.values);
          }
      }

      await main();
      ```

=== "Java"

      ```java
      import java.util.Arrays;
      import com.google.genai.Client;
      import com.google.genai.types.Content;
      import com.google.genai.types.ContentEmbedding;
      import com.google.genai.types.EmbedContentResponse;
      import com.google.genai.types.Part;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Collections;
      import java.util.List;

      Client client = new Client();

      byte[] imageBytes = Files.readAllBytes(Paths.get("dog.png"));

      List<Content> contents =
          Arrays.asList(
              Content.fromParts(Part.fromText("task: classification | query: An image of a dog")),
              Content.fromParts(Part.fromBytes(imageBytes, "image/png")));

      // Embed each Content object separately to produce separate embeddings
      for (Content content : contents) {
        EmbedContentResponse response =
            client.models.embedContent("gemini-embedding-2", content, null);
        for (ContentEmbedding embedding : response.embeddings().orElse(Collections.emptyList())) {
          System.out.println(embedding.values().orElse(Collections.emptyList()));
        }
      }
      ```

=== "REST"

      ```sh
      IMG_PATH="/path/to/your/dog.png"
      IMG_BASE64=$(base64 -w0 "${IMG_PATH}")

      curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:batchEmbedContents" \
          -H "Content-Type: application/json" \
          -H "x-goog-api-key: ${GEMINI_API_KEY}" \
          -d '{
              "requests": [
                  {
                      "model": "models/gemini-embedding-2",
                      "content": {"parts": [{"text": "task: classification | query: An image of a dog"}]}
                  },
                  {
                      "model": "models/gemini-embedding-2",
                      "content": {"parts": [{"inline_data": {"mime_type": "image/png", "data": "'"${IMG_BASE64}"'"}}]}
                  }
              ]
          }'
      ```


### 嵌入音訊 {#embed-audio}

以下範例示範如何使用 `gemini-embedding-2` 嵌入音訊檔案。

音訊檔案可以行內資料形式提供，也可以透過 [Files API](/docs/files/) 以已上傳檔案的形式提供。


=== "Python"

      ```python
      from google import genai
      from google.genai import types

      with open('example.mp3', 'rb') as f:
          audio_bytes = f.read()

      client = genai.Client()

      result = client.models.embed_content(
          model='gemini-embedding-2',
          contents=[
              types.Part.from_bytes(
                  data=audio_bytes,
                  mime_type='audio/mpeg',
              ),
          ]
      )

      print(result.embeddings)
      ```

=== "JavaScript"

      ```js
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
          const ai = new GoogleGenAI({});

          const audioBase64 = fs.readFileSync("example.mp3", { encoding: "base64" });

          const response = await ai.models.embedContent({
              model: 'gemini-embedding-2',
              contents: [{
                  inlineData: {
                      mimeType: 'audio/mpeg',
                      data: audioBase64,
                  },
              }],
          });

          console.log(response.embeddings);
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.Content;
      import com.google.genai.types.EmbedContentResponse;
      import com.google.genai.types.Part;
      import java.nio.file.Files;
      import java.nio.file.Paths;

      Client client = new Client();

      byte[] audioBytes = Files.readAllBytes(Paths.get("example.mp3"));

      Content content = Content.fromParts(Part.fromBytes(audioBytes, "audio/mpeg"));

      EmbedContentResponse response =
          client.models.embedContent("gemini-embedding-2", content, null);

      System.out.println(response.embeddings().orElse(null));
      ```

=== "REST"

      ```sh
      AUDIO_PATH="/path/to/your/example.mp3"
      AUDIO_BASE64=$(base64 -w0 "${AUDIO_PATH}")

      curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent" \
          -H "Content-Type: application/json" \
          -H "x-goog-api-key: ${GEMINI_API_KEY}" \
          -d '{
              "content": {
                  "parts": [{
                      "inline_data": {
                          "mime_type": "audio/mpeg",
                          "data": "'"${AUDIO_BASE64}"'"
                      }
                  }]
              }
          }'
      ```


### 嵌入影片 {#embed-video}

以下範例示範如何使用 `gemini-embedding-2` 嵌入影片。

影片可以行內資料形式提供，也可以透過 [Files API](/docs/files/) 以已上傳檔案的形式提供。


=== "Python"

      ```python
      from google import genai
      from google.genai import types

      client = genai.Client()

      with open('example.mp4', 'rb') as f:
          video_bytes = f.read()

      result = client.models.embed_content(
          model='gemini-embedding-2',
          contents=[
              types.Part.from_bytes(
                  data=video_bytes,
                  mime_type='video/mp4',
              ),
          ]
      )

      print(result.embeddings[0].values)
      ```

=== "JavaScript"

      ```js
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
          const ai = new GoogleGenAI({});

          const videoBase64 = fs.readFileSync("example.mp4", { encoding: "base64" });

          const response = await ai.models.embedContent({
              model: 'gemini-embedding-2',
              contents: [{
                  inlineData: {
                      mimeType: 'video/mp4',
                      data: videoBase64,
                  },
              }],
          });

          console.log(response.embeddings);
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.Content;
      import com.google.genai.types.EmbedContentResponse;
      import com.google.genai.types.Part;
      import java.nio.file.Files;
      import java.nio.file.Paths;
      import java.util.Collections;

      Client client = new Client();

      byte[] videoBytes = Files.readAllBytes(Paths.get("example.mp4"));

      Content content = Content.fromParts(Part.fromBytes(videoBytes, "video/mp4"));

      EmbedContentResponse response =
          client.models.embedContent("gemini-embedding-2", content, null);

      System.out.println(
          response.embeddings().get().get(0).values().orElse(Collections.emptyList()));
      ```

=== "REST"

      ```sh
      VIDEO_PATH="/path/to/your/video.mp4"
      VIDEO_BASE64=$(base64 -w0 "${VIDEO_PATH}")

      curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent" \
          -H "Content-Type: application/json" \
          -H "x-goog-api-key: ${GEMINI_API_KEY}" \
          -d '{
              "content": {
                  "parts": [{
                      "inline_data": {
                          "mime_type": "video/mp4",
                          "data": "'"${VIDEO_BASE64}"'"
                      }
                  }]
              }
          }'
      ```


若需要嵌入超過 120 秒的影片，可將影片切成重疊的片段，再逐一嵌入這些片段。

### 嵌入文件 {#embed-documents}

PDF 格式的文件可以直接嵌入。模型會處理每一頁的視覺與文字內容。

PDF 可以行內資料形式提供，也可以透過 [Files API](/docs/files/) 以已上傳檔案的形式提供。

#### 模型如何處理 PDF {#pdf-processing}

嵌入 PDF 時，模型會同時運用視覺與文字特徵來處理文件：

* **視覺表示**：模型將每一頁渲染為圖片，每頁消耗 **258 個權杖**。
* **文字擷取**：模型會從文件中擷取文字。對於**原生 PDF**（含有數位文字），模型會直接擷取文字；對於**掃描 PDF**（含有文字圖片），模型會自動執行光學字元辨識（OCR）來擷取文字。

計算 PDF 的權杖總數時，將視覺權杖（每頁 258 個）加上文字權杖即可。輸入必須符合模型的 **8,192 個權杖上限**（由所有模態共用）。超過此上限的輸入會被系統無聲截斷。


!!! note " "

      Gemini Developer API 一律為 PDF 啟用 OCR，且不支援停用（`document_ocr` 參數僅在 Vertex AI 中提供）。


#### PDF 限制 {#pdf-limits}

* **每個要求的檔案數**：最多可提交 1 個 PDF 檔案。
* **頁數上限**：每個檔案最多可提交 6 頁。為獲得最佳品質，強烈建議每個 PDF 只放 1 頁。

以下範例示範如何使用 `gemini-embedding-2` 嵌入 PDF：


=== "Python"

      ```python
      from google import genai
      from google.genai import types

      with open('example.pdf', 'rb') as f:
          pdf_bytes = f.read()

      client = genai.Client()

      result = client.models.embed_content(
          model='gemini-embedding-2',
          contents=[
              types.Part.from_bytes(
                  data=pdf_bytes,
                  mime_type='application/pdf',
              ),
          ]
      )

      print(result.embeddings)
      ```

=== "JavaScript"

      ```js
      import { GoogleGenAI } from "@google/genai";
      import * as fs from "node:fs";

      async function main() {
          const ai = new GoogleGenAI({});

          const pdfBase64 = fs.readFileSync("example.pdf", { encoding: "base64" });

          const response = await ai.models.embedContent({
              model: 'gemini-embedding-2',
              contents: [{
                  inlineData: {
                      mimeType: 'application/pdf',
                      data: pdfBase64,
                  },
              }],
          });

          console.log(response.embeddings);
      }

      await main();
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.types.Content;
      import com.google.genai.types.EmbedContentResponse;
      import com.google.genai.types.Part;
      import java.nio.file.Files;
      import java.nio.file.Paths;

      Client client = new Client();

      byte[] pdfBytes = Files.readAllBytes(Paths.get("example.pdf"));

      Content content = Content.fromParts(Part.fromBytes(pdfBytes, "application/pdf"));

      EmbedContentResponse response =
          client.models.embedContent("gemini-embedding-2", content, null);

      System.out.println(response.embeddings().orElse(null));
      ```

=== "REST"

      ```sh
      PDF_PATH="/path/to/your/example.pdf"
      PDF_BASE64=$(base64 -w0 "${PDF_PATH}")

      curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent" \
          -H "Content-Type: application/json" \
          -H "x-goog-api-key: ${GEMINI_API_KEY}" \
          -d '{
              "content": {
                  "parts": [{
                      "inline_data": {
                          "mime_type": "application/pdf",
                          "data": "'"${PDF_BASE64}"'"
                      }
                  }]
              }
          }'
      ```


## 使用情境 {#common-use-cases}

文字嵌入向量對許多常見的 AI 使用情境至關重要，例如：

* **檢索增強生成（RAG）**：嵌入向量透過檢索相關資訊並將其納入模型的上下文，提升生成文字的品質。

* **資訊檢索**：根據一段輸入文字，搜尋語意上最相似的文字或文件。

  [文件搜尋教學](https://github.com/google-gemini/cookbook/blob/main/examples/Talk_to_documents_with_embeddings.ipynb)

* **搜尋重新排名**：對照查詢，以語意方式為初步結果評分，優先呈現最相關的項目。

  [搜尋重新排名教學](https://github.com/google-gemini/cookbook/blob/main/examples/Search_reranking_using_embeddings.ipynb)

* **異常偵測**：比較多組嵌入向量，有助於找出隱藏的趨勢或異常值。

  [異常偵測教學](https://github.com/google-gemini/cookbook/blob/main/examples/Anomaly_detection_with_embeddings.ipynb)

* **分類**：依內容自動將文字分類，例如情感分析或垃圾訊息偵測

  [分類教學](https://github.com/google-gemini/cookbook/blob/main/examples/Classify_text_with_embeddings.ipynb)

* **分群**：為嵌入向量建立分群與視覺化呈現，有效掌握複雜的關聯。

  [分群視覺化教學](https://github.com/google-gemini/cookbook/blob/main/examples/clustering_with_embeddings.ipynb)


## 儲存嵌入向量 {#store-embeddings}

當你將嵌入向量投入正式環境時，通常會使用**向量資料庫**來有效儲存、索引與檢索高維度嵌入向量。Google Cloud 提供可用於此目的的代管資料服務，包括
[Gemini Enterprise Agent Platform Vector Search 2.0](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/vector-search-2/overview)、
[BigQuery](https://cloud.google.com/bigquery/docs/introduction)、
[AlloyDB](https://cloud.google.com/alloydb/docs/overview) 與
[Cloud SQL](https://cloud.google.com/sql/docs/postgres/introduction)。

以下教學示範如何將其他第三方向量資料庫與 Gemini Embedding 搭配使用。

* [ChromaDB 教學](https://docs.trychroma.com/integrations/embedding-models/google-gemini)
* [QDrant 教學](https://qdrant.tech/documentation/embeddings/gemini/)
* [Weaviate 教學](https://docs.weaviate.io/weaviate/model-providers/google)
* [Pinecone 教學](https://github.com/google-gemini/cookbook/blob/main/examples/langchain/Gemini_LangChain_QA_Pinecone_WebLoad.ipynb)

## 模型版本 {#model-versions}


=== "Gemini Embedding 2"


    | 屬性 | 說明 |
    | --- | --- |
    | 模型代碼 | **Gemini API** `gemini-embedding-2` |
    | 支援的資料類型 | **輸入** 文字、圖片、影片、音訊、PDF **輸出** 文字嵌入向量 |
    | 權杖上限[[*]](/docs/tokens/) | **輸入權杖上限** 8,192 **輸出維度大小** 彈性，支援：128 - 3072，建議：768、1536、3072 |
    | 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。穩定版：`gemini-embedding-2` |
    | 最近更新 | 2026 年 4 月 |
    | 定價 | [定價](/docs/pricing/#gemini-embedding-2) |

=== "Gemini Embedding"


    | 屬性 | 說明 |
    | --- | --- |
    | 模型代碼 | **Gemini API** `gemini-embedding-001` |
    | 支援的資料類型 | **輸入** 文字 **輸出** 文字嵌入向量 |
    | 權杖上限[[*]](/docs/tokens/) | **輸入權杖上限** 2,048 **輸出維度大小** 彈性，支援：128 - 3072，建議：768、1536、3072 |
    | 版本 | 詳情請參閱[模型版本模式](/docs/models/#model-versions)。穩定版：`gemini-embedding-001` |
    | 最近更新 | 2025 年 6 月 |
    | 定價 | [定價](/docs/pricing/#gemini-embedding) |


已淘汰的 Embeddings 模型，請參閱[淘汰](/docs/deprecations/)頁面

## 從 gemini-embedding-001 遷移 {#migration}

`gemini-embedding-001` 與 `gemini-embedding-2` 的嵌入空間**互不相容**。這表示你無法直接比較其中一個模型產生的嵌入向量與另一個模型產生的嵌入向量。若要升級至 `gemini-embedding-2`，必須將所有現有資料重新嵌入。

除了不相容之外，兩個模型還有幾項值得注意的差異：

* **任務類型指定方式**：使用 `gemini-embedding-001` 時，透過 `task_type` 參數指定任務類型（例如 `SEMANTIC_SIMILARITY`、`RETRIEVAL_DOCUMENT`）。`gemini-embedding-2` 不支援 `task_type` 參數；純文字任務應改為將任務指令直接寫入提示詞。不同使用情境下提示詞的格式化方式，詳見[Embeddings 2 的任務類型](/docs/embeddings/#task-types-embeddings-2)。

* **嵌入向量彙整**：`gemini-embedding-001` 會為輸入清單中的每個字串產生個別的嵌入向量。相較之下，當多個輸入（例如文字與圖片）直接在同一個要求中提供時，`gemini-embedding-2` 會產生單一彙整後的嵌入向量。若要為個別輸入產生各自的嵌入向量，請將每個輸入包裝在 `Content` 物件中，或使用 [Batch API](/docs/batch-api/#batch-embedding)。更多資訊請參閱[嵌入向量彙整](/docs/embeddings/#embedding-aggregation)。

* **正規化**：若使用 `output_dimensionality` 要求低於 3072 維的嵌入向量，`gemini-embedding-2` 會自動正規化這些截斷後的嵌入向量；`gemini-embedding-001` 則需要針對 3072 以外的維度手動正規化。詳情請參閱[確保較小維度的品質](/docs/embeddings/#quality-for-smaller-dimensions)。


## 批次嵌入向量 {#batch-embedding}

若延遲不是考量重點，可將 Gemini Embeddings 模型與 [Batch API](/docs/batch-api/#batch-embedding) 搭配使用。這樣能以預設 Embedding 價格的 50% 達到更高的輸送量。開始使用的範例請參閱 [Batch API cookbook](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Batch_mode.ipynb)。

## 負責任使用聲明 {#responsible-use-notice}

與會產生新內容的生成式 AI 模型不同，Gemini Embedding 模型僅用於將輸入資料的格式轉換為數值表示。Google 負責提供將輸入資料格式轉換為所要求數值格式的嵌入模型，但使用者仍須對其輸入的資料及產生的嵌入向量負全部責任。使用 Gemini Embedding 模型即表示你確認你對上傳的任何內容擁有必要的權利。請勿產生侵犯他人智慧財產權或隱私權的內容。你對本服務的使用須遵守我們的[禁止使用政策](https://policies.google.com/terms/generative-ai/use-policy)與 [Google 服務條款](/docs/terms/)。

## 開始使用嵌入向量建構 {#start-building}

查看[嵌入向量快速入門 notebook](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Embeddings.ipynb)，探索模型功能，並學習如何自訂與視覺化你的嵌入向量。
