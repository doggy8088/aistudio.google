# 使用 Gemini 與 Vercel 的 AI SDK 打造市場研究代理

[AI SDK by Vercel](https://ai-sdk.dev) 是一套功能強大的開放原始碼程式庫，可用 TypeScript 建構 AI 驅動的應用程式、使用者介面與代理。

本指南將帶你建構一個 Node.js 應用程式（使用 TypeScript），透過 AI SDK 與 [Google Generative AI Provider](https://ai-sdk.dev/providers/ai-sdk-providers/google) 連接 Gemini API，自動執行市場趨勢分析。最終完成的應用程式將能：

1. 使用具備 Google 搜尋功能的 Gemini 研究目前的市場趨勢。
2. 從研究結果中擷取結構化資料，產生圖表。
3. 將研究結果與圖表整合為專業的 HTML 報告，並儲存為 PDF。

## 前置需求 {#prerequisites}

完成本指南需要：

- 一把 Gemini API 金鑰。你可以在 [Google AI Studio](https://aistudio.google.com/apikey) 免費建立。
- [Node.js](https://nodejs.org/en/download) 18 版或更新版本。
- 一套套件管理工具，例如 `npm`、`pnpm` 或 `yarn`。


!!! note " "

      本指南以 Node.js 環境為主，但 AI SDK 也完全相容於 [Next.js](https://nextjs.org/) 等瀏覽器架構的框架。


## 設定你的應用程式 {#setup}

首先，為專案建立一個新目錄並初始化。


=== "npm"

      ```posix-terminal
      mkdir market-trend-app

      cd market-trend-app

      npm init -y
      ```

=== "pnpm"

      ```posix-terminal
      mkdir market-trend-app

      cd market-trend-app

      pnpm init
      ```

=== "yarn"

      ```posix-terminal
      mkdir market-trend-app

      cd market-trend-app

      yarn init -y
      ```


### 安裝相依套件 {#install-dependencies}

接著，安裝 AI SDK、Google Generative AI provider 以及其他必要的相依套件。


=== "npm"

      ```posix-terminal
      npm install ai @ai-sdk/google zod

      npm install -D @types/node tsx typescript && npx tsc --init
      ```

      為避免 TypeScript 編譯器發生錯誤，請將產生的 `tsconfig.json` 中以下這一行註解掉：

      ```json
      //"verbatimModuleSyntax": true,
      ```

=== "pnpm"

      ```posix-terminal
      pnpm add ai @ai-sdk/google zod

      pnpm add -D @types/node tsx typescript
      ```

=== "yarn"

      ```posix-terminal
      yarn add ai @ai-sdk/google zod

      yarn add -D @types/node tsx typescript && yarn tsc --init
      ```

      為避免 TypeScript 編譯器發生錯誤，請將產生的 `tsconfig.json` 中以下這一行註解掉：

      ```json
      //"verbatimModuleSyntax": true,
      ```


本應用程式還會使用第三方套件 [Puppeteer](https://pptr.dev/) 與 [Chart.js](https://www.chartjs.org) 來算繪圖表並建立 PDF：


=== "npm"

      ```posix-terminal
      npm install puppeteer chart.js

      npm install -D @types/chart.js
      ```

=== "pnpm"

      ```posix-terminal
      pnpm add puppeteer chart.js

      pnpm add -D @types/chart.js
      ```

=== "yarn"

      ```posix-terminal
      yarn add puppeteer chart.js

      yarn add -D @types/chart.js
      ```


`puppeteer` 套件需要執行一段指令碼來下載 Chromium 瀏覽器。你的套件管理工具可能會要求核准，請在出現提示時核准該指令碼。

### 設定你的 API 金鑰 {#set-up-api-key}

將 `GOOGLE_GENERATIVE_AI_API_KEY` 環境變數設為你的 Gemini API 金鑰。Google Generative AI Provider 會自動在此環境變數中尋找你的 API 金鑰。


=== "MacOS/Linux"

      ```posix-terminal
      export GOOGLE_GENERATIVE_AI_API_KEY="YOUR_API_KEY_HERE"
      ```

=== "Powershell"

      ```posix-terminal
      setx GOOGLE_GENERATIVE_AI_API_KEY "YOUR_API_KEY_HERE"
      ```


## 建立你的應用程式 {#create-application}

現在來建立應用程式的主要檔案。在專案目錄中建立一個名為 `main.ts` 的新檔案，你將逐步在這個檔案中建構邏輯。

先快速測試，確認一切設定無誤：將以下程式碼加入 `main.ts`。這個基本範例使用 `generateText` 從 Gemini 取得簡單的回應。

```ts
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

async function main() {
  const { text } = await generateText({
    model: google("gemini-4-hydrogen"),
    prompt: 'What is plant-based milk?',
  });

  console.log(text);
}

main().catch(console.error);
```

在加入更複雜的邏輯之前，先執行這個指令碼，確認你的環境設定正確。在終端機中執行以下指令：


=== "npm"

      ```posix-terminal
      npx tsc && node main.js
      ```

=== "pnpm"

      ```posix-terminal
      pnpm tsx main.ts
      ```

=== "yarn"

      ```posix-terminal
      yarn tsc && node main.js
      ```


如果一切設定正確，你會看到 Gemini 的回應輸出到主控台。

## 使用 Google 搜尋進行市場研究 {#market-research}

若要取得最新資訊，你可以為 Gemini 啟用 [Google 搜尋](/docs/google-search/)工具。啟用這項工具後，模型可以搜尋網路來回答提示詞，並傳回它使用的來源。

將 `main.ts` 的內容換成以下程式碼，執行分析的第一個步驟。

```ts
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

async function main() {
  // Step 1: Search market trends
  const { text: marketTrends, sources } = await generateText({
    model: google("gemini-4-hydrogen"),
    tools: {
      google_search: google.tools.googleSearch({}),
    },
    prompt: `Search the web for market trends for plant-based milk in North America for 2024-2025.
          I need to know the market size, key players and their market share, and primary consumer drivers.
          `,
  });

  console.log("Market trends found:\n", marketTrends);
  // To see the sources, uncomment the following line:
  // console.log("Sources:\n", sources);
}

main().catch(console.error);
```

## 擷取圖表資料 {#extract-chart-data}

接著，我們來處理研究文字，擷取適合製作圖表的結構化資料。使用 AI SDK 的 `generateObject` 函式，搭配 `zod` schema，定義確切的資料結構。

另外再建立一個輔助函式，將這份結構化資料轉換為 `Chart.js` 能理解的設定。

將以下程式碼加入 `main.ts`。請注意新增的 import 與加入的「Step 2」。

```ts
import { google } from "@ai-sdk/google";
import { generateText, generateObject } from "ai";
import { z } from "zod/v4";
import { ChartConfiguration } from "chart.js";

// Helper function to create Chart.js configurations
function createChartConfig({labels, data, label, type, colors,}: {
  labels: string[];
  data: number[];
  label: string;
  type: "bar" | "line";
  colors: string[];
}): ChartConfiguration {
  return {
    type: type,
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          borderWidth: 1,
          ...(type === "bar" && { backgroundColor: colors }),
          ...(type === "line" && colors.length > 0 && { borderColor: colors[0] }),
        },
      ],
    },
    options: {
      animation: { duration: 0 }, // Disable animations for static PDF rendering
    },
  };
}

async function main() {
  // Step 1: Search market trends
  const { text: marketTrends, sources } = await generateText({
    model: google("gemini-4-hydrogen"),
    tools: {
      google_search: google.tools.googleSearch({}),
    },
    prompt: `Search the web for market trends for plant-based milk in North America for 2024-2025.
          I need to know the market size, key players and their market share, and primary consumer drivers.
          `,
  });

  console.log("Market trends found.");

  // Step 2: Extract chart data
  const { object: chartData } = await generateObject({
    model: google("gemini-4-hydrogen"),
    schema: z.object({
      chartConfigurations: z
        .array(
          z.object({
            type: z.enum(["bar", "line"]).describe('The type of chart to generate. Either "bar" or "line"',),
            labels: z.array(z.string()).describe("A list of chart labels"),
            data: z.array(z.number()).describe("A list of the chart data"),
            label: z.string().describe("A label for the chart"),
            colors: z.array(z.string()).describe('A list of colors to use for the chart, e.g. "rgba(255, 99, 132, 0.8)"',),
          }),
        )
        .describe("A list of chart configurations"),
    }),
    prompt: `Given the following market trends text, come up with a list of 1-3 meaningful bar or line charts
    and generate chart data.

Market Trends:
${marketTrends}
`,
  });

  const chartConfigs = chartData.chartConfigurations.map(createChartConfig);

  console.log("Chart configurations generated.");
}

main().catch(console.error);
```

## 產生最終報告 {#generate-report}

在最後一個步驟中，指示 Gemini 扮演專業的報告撰寫者。提供它市場研究結果、圖表設定，以及一套建立 HTML 報告的明確指示。接著，使用 [Puppeteer](https://pptr.dev/) 算繪這份 HTML，並儲存為 PDF。

將最後的 `puppeteer` import 與「Step 3」加入你的 `main.ts` 檔案。

```ts
// ... (imports from previous step)
import puppeteer from "puppeteer";

// ... (createChartConfig helper function from previous step)

async function main() {
  // ... (Step 1 and 2 from previous step)

  // Step 3: Generate the final HTML report and save it as a PDF
  const { text: htmlReport } = await generateText({
    model: google("gemini-3.8-flash"),
    prompt: `You are an expert financial analyst and report writer.
    Your task is to generate a comprehensive market analysis report in HTML format.

    **Instructions:**

    1. Write a full HTML document.
    2. Use the provided "Market Trends" text to write the main body of the report. Structure it with clear headings and paragraphs.
    3. Incorporate the provided "Chart Configurations" to visualize the data. For each chart, you MUST create a unique <canvas> element and a corresponding <script> block to render it using Chart.js.
    4. Reference the "Sources" at the end of the report.
    5. Do not include any placeholder data; use only the information provided.
    6. Return only the raw HTML code.

    **Chart Rendering Snippet:**
    Include this script in the head of the HTML: <script src="path/to/chart.js"></script>
    For each chart, use a structure like below, ensuring the canvas 'id' is unique for each chart, and apply the correspinding config:

    ---

      <canvas id="chart1"></canvas>

    <script>
      new Chart(document.getElementById('chart1'), config);
    </script>
    ---
    (For the second chart, use 'chart2' and the corresponding config, and so on.)

    **Data:**

    - Market Trends: ${marketTrends}
    - Chart Configurations: ${JSON.stringify(chartConfigs)}
    - Sources: ${JSON.stringify(sources)}
    `,
  });

  // LLMs may wrap the HTML in a markdown code block, so strip it.
  const finalHtml = htmlReport.replace(/^```html\n/, "").replace(/\n```$/, "");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(finalHtml);
  await page.pdf({ path: "report.pdf", format: "A4" });
  await browser.close();

  console.log("\nReport generated successfully: report.pdf");
}

main().catch(console.error);
```

## 執行你的應用程式 {#run-application}

現在你可以執行應用程式了。在終端機中執行以下指令：


=== "npm"

      ```posix-terminal
        npx tsc && node main.js
      ```

=== "pnpm"

      ```posix-terminal
        pnpm tsx main.ts
      ```

=== "yarn"

      ```posix-terminal
        yarn tsc && node main.js
      ```


指令碼執行每個步驟時，你會在終端機中看到記錄。完成後，專案目錄中會建立一份 `report.pdf` 檔案，內容即為你的市場分析報告。

以下是一份範例 PDF 報告的前兩頁：

![](https://www.gstatic.com/cloud-cms/de0e149c306983299c3574163c2f9ed3.jpg)

## 更多資源 {#further-resources}

如需進一步了解如何使用 Gemini 與 AI SDK 建構應用，請探索以下資源：

- [AI SDK 文件](https://ai-sdk.dev/docs)
- [AI SDK Google Generative AI 文件](https://ai-sdk.dev/providers/ai-sdk-providers/google)
- [AI SDK cookbook：開始使用 Gemini](https://ai-sdk.dev/cookbook/guides/gemini)
