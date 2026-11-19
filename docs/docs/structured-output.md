# 結構化輸出

你可以設定 Gemini 模型，讓它產生的回應遵循你提供的
JSON Schema。這能確保結果可預測且具備型別安全，也讓從非結構化文字中
擷取結構化資料變得更簡單。

結構化輸出特別適合用於：

* **資料擷取**：從文字中提取姓名、日期等特定資訊。
* **結構化分類**：將文字歸入預先定義的類別。
* **代理工作流程**：為工具或 API 產生結構化輸入。

除了 REST API 支援 JSON Schema 之外，Google GenAI SDK 也
讓你使用下列函式庫定義結構描述：
[Pydantic](https://docs.pydantic.dev/latest/) (Python) and
[Zod](https://zod.dev/) (JavaScript).


!!! note " "

      如果你需要是／否機率、單選選項，或附帶
      校準後信賴度且不耗用輸出 tokens 的評分量表分數，請使用
      [Gemini Decision 1](/docs/models/gemini-decision-1/) 模型搭配
      [Decisions API](/docs/decisions-api/).


## 結構化輸出範例 {#structured-output-examples}

### 食譜擷取器 {#recipe}

這個範例示範如何運用基本的 JSON Schema 型別，例如 `object`、`array`、
`string` 與 `integer`，從文字中擷取結構化資料。


=== "Python"

      ```python
      from google import genai
      from pydantic import BaseModel, Field
      from typing import List, Optional

      class Ingredient(BaseModel):
          name: str = Field(description="Name of the ingredient.")
          quantity: str = Field(description="Quantity of the ingredient, including units.")

      class Recipe(BaseModel):
          recipe_name: str = Field(description="The name of the recipe.")
          prep_time_minutes: Optional[int] = Field(description="Optional time in minutes to prepare the recipe.")
          ingredients: List[Ingredient]
          instructions: List[str]

      client = genai.Client()

      prompt = """
      Please extract the recipe from the following text.
      The user wants to make delicious chocolate chip cookies.
      They need 2 and 1/4 cups of all-purpose flour, 1 teaspoon of baking soda,
      1 teaspoon of salt, 1 cup of unsalted butter (softened), 3/4 cup of granulated sugar,
      3/4 cup of packed brown sugar, 1 teaspoon of vanilla extract, and 2 large eggs.
      For the best part, they'll need 2 cups of semisweet chocolate chips.
      First, preheat the oven to 375°F (190°C). Then, in a small bowl, whisk together the flour,
      baking soda, and salt. In a large bowl, cream together the butter, granulated sugar, and brown sugar
      until light and fluffy. Beat in the vanilla and eggs, one at a time. Gradually beat in the dry
      ingredients until just combined. Finally, stir in the chocolate chips. Drop by rounded tablespoons
      onto ungreased baking sheets and bake for 9 to 11 minutes.
      """

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=prompt,
          response_format={
              "type": "text",
              "mime_type": "application/json",
              "schema": Recipe.model_json_schema()
          },
      )

      recipe = Recipe.model_validate_json(interaction.output_text)
      print(recipe)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as z from "zod";

      const recipeJsonSchema = {
        type: "object",
        properties: {
          recipe_name: {
            type: "string",
            description: "The name of the recipe."
          },
          prep_time_minutes: {
              type: "integer",
              description: "Optional time in minutes to prepare the recipe."
          },
          ingredients: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", description: "Name of the ingredient."},
                quantity: { type: "string", description: "Quantity of the ingredient, including units."}
              },
              required: ["name", "quantity"]
            }
          },
          instructions: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["recipe_name", "ingredients", "instructions"]
      };

      const recipeSchema = z.fromJSONSchema(recipeJsonSchema);

      const client = new GoogleGenAI({});

      const prompt = `
      Please extract the recipe from the following text.
      The user wants to make delicious chocolate chip cookies.
      They need 2 and 1/4 cups of all-purpose flour, 1 teaspoon of baking soda,
      1 teaspoon of salt, 1 cup of unsalted butter (softened), 3/4 cup of granulated sugar,
      3/4 cup of packed brown sugar, 1 teaspoon of vanilla extract, and 2 large eggs.
      For the best part, they'll need 2 cups of semisweet chocolate chips.
      First, preheat the oven to 375°F (190°C). Then, in a small bowl, whisk together the flour,
      baking soda, and salt. In a large bowl, cream together the butter, granulated sugar, and brown sugar
      until light and fluffy. Beat in the vanilla and eggs, one at a time. Gradually beat in the dry
      ingredients until just combined. Finally, stir in the chocolate chips. Drop by rounded tablespoons
      onto ungreased baking sheets and bake for 9 to 11 minutes.
      `;

      const interaction = await client.interactions.create({
        model: "gemini-4-hydrogen",
        input: prompt,
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: recipeJsonSchema
        },
      });

      const recipe = recipeSchema.parse(JSON.parse(interaction.output_text));
      console.log(recipe);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormatMimeType;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> ingredientProps = new HashMap<>();
      Map<String, Object> nameProp = new HashMap<>();
      nameProp.put("type", "string");
      nameProp.put("description", "Name of the ingredient.");
      ingredientProps.put("name", nameProp);

      Map<String, Object> quantityProp = new HashMap<>();
      quantityProp.put("type", "string");
      quantityProp.put("description", "Quantity of the ingredient, including units.");
      ingredientProps.put("quantity", quantityProp);

      Map<String, Object> ingredientItemSchema = new HashMap<>();
      ingredientItemSchema.put("type", "object");
      ingredientItemSchema.put("properties", ingredientProps);
      ingredientItemSchema.put("required", Arrays.asList("name", "quantity"));

      Map<String, Object> properties = new HashMap<>();

      Map<String, Object> recipeNameProp = new HashMap<>();
      recipeNameProp.put("type", "string");
      recipeNameProp.put("description", "The name of the recipe.");
      properties.put("recipe_name", recipeNameProp);

      Map<String, Object> prepTimeProp = new HashMap<>();
      prepTimeProp.put("type", "integer");
      prepTimeProp.put("description", "Optional time in minutes to prepare the recipe.");
      properties.put("prep_time_minutes", prepTimeProp);

      Map<String, Object> ingredientsProp = new HashMap<>();
      ingredientsProp.put("type", "array");
      ingredientsProp.put("items", ingredientItemSchema);
      properties.put("ingredients", ingredientsProp);

      Map<String, Object> instructionsProp = new HashMap<>();
      instructionsProp.put("type", "array");
      Map<String, Object> stringItem = new HashMap<>();
      stringItem.put("type", "string");
      instructionsProp.put("items", stringItem);
      properties.put("instructions", instructionsProp);

      Map<String, Object> recipeJsonSchema = new HashMap<>();
      recipeJsonSchema.put("type", "object");
      recipeJsonSchema.put("properties", properties);
      recipeJsonSchema.put("required", Arrays.asList("recipe_name", "ingredients", "instructions"));

      String prompt =
          "Please extract the recipe from the following text.\n"
              + "The user wants to make delicious chocolate chip cookies.\n"
              + "They need 2 and 1/4 cups of all-purpose flour, 1 teaspoon of baking soda,\n"
              + "1 teaspoon of salt, 1 cup of unsalted butter (softened), 3/4 cup of granulated sugar,\n"
              + "3/4 cup of packed brown sugar, 1 teaspoon of vanilla extract, and 2 large eggs.\n"
              + "For the best part, they'll need 2 cups of semisweet chocolate chips.\n"
              + "First, preheat the oven to 375°F (190°C). Then, in a small bowl, whisk together the flour,\n"
              + "baking soda, and salt. In a large bowl, cream together the butter, granulated sugar, and brown sugar\n"
              + "until light and fluffy. Beat in the vanilla and eggs, one at a time. Gradually beat in the dry\n"
              + "ingredients until just combined. Finally, stir in the chocolate chips. Drop by rounded tablespoons\n"
              + "onto ungreased baking sheets and bake for 9 to 11 minutes.";

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  TextResponseFormat.builder()
                      .mimeType(TextResponseFormatMimeType.APPLICATION_JSON)
                      .schema(recipeJsonSchema)
                      .build()));

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of(prompt))
              .responseFormat(format)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println(interaction.outputText().orElse(""));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          recipeJsonSchema := map[string]any{
              "type": "object",
              "properties": map[string]any{
                  "recipe_name": map[string]any{
                      "type":        "string",
                      "description": "The name of the recipe.",
                  },
                  "prep_time_minutes": map[string]any{
                      "type":        "integer",
                      "description": "Optional time in minutes to prepare the recipe.",
                  },
                  "ingredients": map[string]any{
                      "type": "array",
                      "items": map[string]any{
                          "type": "object",
                          "properties": map[string]any{
                              "name": map[string]any{
                                  "type":        "string",
                                  "description": "Name of the ingredient.",
                              },
                              "quantity": map[string]any{
                                  "type":        "string",
                                  "description": "Quantity of the ingredient, including units.",
                              },
                          },
                          "required": []string{"name", "quantity"},
                      },
                  },
                  "instructions": map[string]any{
                      "type": "array",
                      "items": map[string]any{
                          "type": "string",
                      },
                  },
              },
              "required": []string{"recipe_name", "ingredients", "instructions"},
          }

          prompt := `Please extract the recipe from the following text.
      The user wants to make delicious chocolate chip cookies.
      They need 2 and 1/4 cups of all-purpose flour, 1 teaspoon of baking soda,
      1 teaspoon of salt, 1 cup of unsalted butter (softened), 3/4 cup of granulated sugar,
      3/4 cup of packed brown sugar, 1 teaspoon of vanilla extract, and 2 large eggs.
      For the best part, they'll need 2 cups of semisweet chocolate chips.
      First, preheat the oven to 375°F (190°C). Then, in a small bowl, whisk together the flour,
      baking soda, and salt. In a large bowl, cream together the butter, granulated sugar, and brown sugar
      until light and fluffy. Beat in the vanilla and eggs, one at a time. Gradually beat in the dry
      ingredients until just combined. Finally, stir in the chocolate chips. Drop by rounded tablespoons
      onto ungreased baking sheets and bake for 9 to 11 minutes.`

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.TextResponseFormat{
                  MimeType: interactions.TextResponseFormatMimeTypeApplicationJSON.ToPointer(),
                  Schema:   recipeJsonSchema,
              }),
          )

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model:          interactions.Model("gemini-4-hydrogen"),
                      Input:          interactions.NewInteractionsInput(prompt),
                      ResponseFormat: &format,
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(resp.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -H "Api-Revision: 2026-05-20" \
          -d '{
            "model": "gemini-4-hydrogen",
            "input": "Please extract the recipe from the following text.\nThe user wants to make delicious chocolate chip cookies.\nThey need 2 and 1/4 cups of all-purpose flour, 1 teaspoon of baking soda,\n1 teaspoon of salt, 1 cup of unsalted butter (softened), 3/4 cup of granulated sugar,\n3/4 cup of packed brown sugar, 1 teaspoon of vanilla extract, and 2 large eggs.\nFor the best part, they will need 2 cups of semisweet chocolate chips.\nFirst, preheat the oven to 375°F (190°C). Then, in a small bowl, whisk together the flour,\nbaking soda, and salt. In a large bowl, cream together the butter, granulated sugar, and brown sugar\nuntil light and fluffy. Beat in the vanilla and eggs, one at a time. Gradually beat in the dry\ningredients until just combined. Finally, stir in the chocolate chips. Drop by rounded tablespoons\nonto ungreased baking sheets and bake for 9 to 11 minutes.",
            "response_format": {
              "type": "text",
              "mime_type": "application/json",
              "schema": {
                "type": "object",
                "properties": {
                  "recipe_name": {
                    "type": "string",
                    "description": "The name of the recipe."
                  },
                  "prep_time_minutes": {
                      "type": "integer",
                      "description": "Optional time in minutes to prepare the recipe."
                  },
                  "ingredients": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "name": { "type": "string", "description": "Name of the ingredient."},
                        "quantity": { "type": "string", "description": "Quantity of the ingredient, including units."}
                      },
                      "required": ["name", "quantity"]
                    }
                  },
                  "instructions": {
                    "type": "array",
                    "items": { "type": "string" }
                  }
                },
                "required": ["recipe_name", "ingredients", "instructions"]
              }
            }
            }
          }'
      ```


**範例回應**：

```json
{
  "recipe_name": "Delicious Chocolate Chip Cookies",
  "ingredients": [
    { "name": "all-purpose flour", "quantity": "2 and 1/4 cups" },
    { "name": "baking soda", "quantity": "1 teaspoon" },
    { "name": "salt", "quantity": "1 teaspoon" },
    { "name": "unsalted butter (softened)", "quantity": "1 cup" },
    { "name": "granulated sugar", "quantity": "3/4 cup" },
    { "name": "packed brown sugar", "quantity": "3/4 cup" },
    { "name": "vanilla extract", "quantity": "1 teaspoon" },
    { "name": "large eggs", "quantity": "2" },
    { "name": "semisweet chocolate chips", "quantity": "2 cups" }
  ],
  "instructions": [
    "Preheat the oven to 375°F (190°C).",
    "In a small bowl, whisk together the flour, baking soda, and salt.",
    "In a large bowl, cream together the butter, granulated sugar, and brown sugar until light and fluffy.",
    "Beat in the vanilla and eggs, one at a time.",
    "Gradually beat in the dry ingredients until just combined.",
    "Stir in the chocolate chips.",
    "Drop by rounded tablespoons onto ungreased baking sheets and bake for 9 to 11 minutes."
  ]
}
```

### 內容審核 {#feedback}

這個範例展示如何以 `anyOf` 建立條件式結構描述、以 `enum` 進行
分類，讓輸出結構能依內容而變化。


=== "Python"

      ```python
      from google import genai
      from pydantic import BaseModel, Field
      from typing import Union, Literal

      class SpamDetails(BaseModel):
          reason: str = Field(description="The reason why the content is considered spam.")
          spam_type: Literal["phishing", "scam", "unsolicited promotion", "other"] = Field(description="The type of spam.")

      class NotSpamDetails(BaseModel):
          summary: str = Field(description="A brief summary of the content.")
          is_safe: bool = Field(description="Whether the content is safe for all audiences.")

      class ModerationResult(BaseModel):
          decision: Union[SpamDetails, NotSpamDetails]

      client = genai.Client()

      prompt = """
      Please moderate the following content and provide a decision.
      Content: 'Congratulations! You''ve won a free cruise to the Bahamas. Click here to claim your prize: www.definitely-not-a-scam.com'
      """

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=prompt,
          response_format={
              "type": "text",
              "mime_type": "application/json",
              "schema": ModerationResult.model_json_schema()
          },
      )

      result = ModerationResult.model_validate_json(interaction.output_text)
      print(result)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as z from "zod";

      const moderationResultJsonSchema = {
        type: "object",
        properties: {
          decision: {
            anyOf: [
              {
                type: "object",
                title: "SpamDetails",
                description: "Details for content classified as spam.",
                properties: {
                  reason: { type: "string", description: "The reason why the content is considered spam." },
                  spam_type: { type: "string", enum: ["phishing", "scam", "unsolicited promotion", "other"], description: "The type of spam." }
                },
                required: ["reason", "spam_type"]
              },
              {
                type: "object",
                title: "NotSpamDetails",
                description: "Details for content classified as not spam.",
                properties: {
                  summary: { type: "string", description: "A brief summary of the content." },
                  is_safe: { type: "boolean", description: "Whether the content is safe for all audiences." }
                },
                required: ["summary", "is_safe"]
              }
            ]
          }
        },
        required: ["decision"]
      };

      const moderationResultSchema = z.fromJSONSchema(moderationResultJsonSchema);

      const client = new GoogleGenAI({});

      const prompt = `
      Please moderate the following content and provide a decision.
      Content: 'Congratulations! You''ve won a free cruise to the Bahamas. Click here to claim your prize: www.definitely-not-a-scam.com'
      `;

      const interaction = await client.interactions.create({
        model: "gemini-4-hydrogen",
        input: prompt,
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: moderationResultJsonSchema
        },
      });

      const result = moderationResultSchema.parse(JSON.parse(interaction.output_text));
      console.log(result);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormatMimeType;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> spamProps = new HashMap<>();
      Map<String, Object> reasonProp = new HashMap<>();
      reasonProp.put("type", "string");
      reasonProp.put("description", "The reason why the content is considered spam.");
      spamProps.put("reason", reasonProp);

      Map<String, Object> spamTypeProp = new HashMap<>();
      spamTypeProp.put("type", "string");
      spamTypeProp.put("enum", Arrays.asList("phishing", "scam", "unsolicited promotion", "other"));
      spamTypeProp.put("description", "The type of spam.");
      spamProps.put("spam_type", spamTypeProp);

      Map<String, Object> spamDetailsSchema = new HashMap<>();
      spamDetailsSchema.put("type", "object");
      spamDetailsSchema.put("title", "SpamDetails");
      spamDetailsSchema.put("properties", spamProps);
      spamDetailsSchema.put("required", Arrays.asList("reason", "spam_type"));

      Map<String, Object> notSpamProps = new HashMap<>();
      Map<String, Object> summaryProp = new HashMap<>();
      summaryProp.put("type", "string");
      summaryProp.put("description", "A brief summary of the content.");
      notSpamProps.put("summary", summaryProp);

      Map<String, Object> isSafeProp = new HashMap<>();
      isSafeProp.put("type", "boolean");
      isSafeProp.put("description", "Whether the content is safe for all audiences.");
      notSpamProps.put("is_safe", isSafeProp);

      Map<String, Object> notSpamDetailsSchema = new HashMap<>();
      notSpamDetailsSchema.put("type", "object");
      notSpamDetailsSchema.put("title", "NotSpamDetails");
      notSpamDetailsSchema.put("properties", notSpamProps);
      notSpamDetailsSchema.put("required", Arrays.asList("summary", "is_safe"));

      Map<String, Object> decisionProp = new HashMap<>();
      decisionProp.put("anyOf", Arrays.asList(spamDetailsSchema, notSpamDetailsSchema));

      Map<String, Object> properties = new HashMap<>();
      properties.put("decision", decisionProp);

      Map<String, Object> moderationResultJsonSchema = new HashMap<>();
      moderationResultJsonSchema.put("type", "object");
      moderationResultJsonSchema.put("properties", properties);
      moderationResultJsonSchema.put("required", Arrays.asList("decision"));

      String prompt =
          "Please moderate the following content and provide a decision.\n"
              + "Content: 'Congratulations! You''ve won a free cruise to the Bahamas. Click here to claim your prize: www.definitely-not-a-scam.com'";

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  TextResponseFormat.builder()
                      .mimeType(TextResponseFormatMimeType.APPLICATION_JSON)
                      .schema(moderationResultJsonSchema)
                      .build()));

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of(prompt))
              .responseFormat(format)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println(interaction.outputText().orElse(""));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          spamDetailsSchema := map[string]any{
              "type":  "object",
              "title": "SpamDetails",
              "properties": map[string]any{
                  "reason": map[string]any{
                      "type":        "string",
                      "description": "The reason why the content is considered spam.",
                  },
                  "spam_type": map[string]any{
                      "type":        "string",
                      "enum":        []string{"phishing", "scam", "unsolicited promotion", "other"},
                      "description": "The type of spam.",
                  },
              },
              "required": []string{"reason", "spam_type"},
          }

          notSpamDetailsSchema := map[string]any{
              "type":  "object",
              "title": "NotSpamDetails",
              "properties": map[string]any{
                  "summary": map[string]any{
                      "type":        "string",
                      "description": "A brief summary of the content.",
                  },
                  "is_safe": map[string]any{
                      "type":        "boolean",
                      "description": "Whether the content is safe for all audiences.",
                  },
              },
              "required": []string{"summary", "is_safe"},
          }

          moderationResultJsonSchema := map[string]any{
              "type": "object",
              "properties": map[string]any{
                  "decision": map[string]any{
                      "anyOf": []any{spamDetailsSchema, notSpamDetailsSchema},
                  },
              },
              "required": []string{"decision"},
          }

          prompt := "Please moderate the following content and provide a decision.\n" +
              "Content: 'Congratulations! You've won a free cruise to the Bahamas. Click here to claim your prize: www.definitely-not-a-scam.com'"

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.TextResponseFormat{
                  MimeType: interactions.TextResponseFormatMimeTypeApplicationJSON.ToPointer(),
                  Schema:   moderationResultJsonSchema,
              }),
          )

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model:          interactions.Model("gemini-4-hydrogen"),
                      Input:          interactions.NewInteractionsInput(prompt),
                      ResponseFormat: &format,
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(resp.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -H "Api-Revision: 2026-05-20" \
          -d '{
            "model": "gemini-4-hydrogen",
            "input": "Please moderate the following content and provide a decision.\nContent: '\''Congratulations! You have won a free cruise to the Bahamas. Click here to claim your prize: www.definitely-not-a-scam.com'\''",
            "response_format": {
              "type": "text",
              "mime_type": "application/json",
              "schema": {
                "type": "object",
                "properties": {
                  "decision": {
                    "anyOf": [
                      {
                        "type": "object",
                        "title": "SpamDetails",
                        "description": "Details for content classified as spam.",
                        "properties": {
                          "reason": { "type": "string", "description": "The reason why the content is considered spam." },
                          "spam_type": { "type": "string", "enum": ["phishing", "scam", "unsolicited promotion", "other"], "description": "The type of spam." }
                        },
                        "required": ["reason", "spam_type"]
                      },
                      {
                        "type": "object",
                        "title": "NotSpamDetails",
                        "description": "Details for content classified as not spam.",
                        "properties": {
                          "summary": { "type": "string", "description": "A brief summary of the content." },
                          "is_safe": { "type": "boolean", "description": "Whether the content is safe for all audiences." }
                        },
                        "required": ["summary", "is_safe"]
                      }
                    ]
                  }
                },
                "required": ["decision"]
              }
            }
            }
          }'
      ```


**範例回應**：

```json
{
  "decision": {
    "reason": "The content is an unsolicited prize notification attempting to trick the user into clicking a suspicious link.",
    "spam_type": "scam"
  }
}
```

### 遞迴結構 {#recursive}

這個範例說明如何定義遞迴結構描述，例如
組織架構圖。


=== "Python"

      ```python
      from google import genai
      from pydantic import BaseModel, Field
      from typing import List

      class Employee(BaseModel):
          """Represents an employee in an organization."""
          name: str
          employee_id: int
          reports: List["Employee"] = Field(
              default_factory=list,
              description="A list of employees reporting to this employee."
          )

      client = genai.Client()

      prompt = """
      Generate an organization chart for a small team.
      The manager is Alice, who manages Bob and Charlie. Bob manages David.
      """

      interaction = client.interactions.create(
          model="gemini-4-hydrogen",
          input=prompt,
          response_format={
              "type": "text",
              "mime_type": "application/json",
              "schema": Employee.model_json_schema()
          },
      )

      employee = Employee.model_validate_json(interaction.output_text)
      print(employee)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as z from "zod";

      const employeeJsonSchema = {
        type: "object",
        properties: {
          name: { type: "string" },
          employee_id: { type: "integer" },
          reports: {
            type: "array",
            description: "A list of employees reporting to this employee.",
            items: {
              "$ref": "#"
            }
          }
        },
        required: ["name", "employee_id", "reports"]
      };

      const employeeSchema = z.fromJSONSchema(employeeJsonSchema);

      const client = new GoogleGenAI({});

      const prompt = `
      Generate an organization chart for a small team.
      The manager is Alice, who manages Bob and Charlie. Bob manages David.
      `;

      const interaction = await client.interactions.create({
        model: "gemini-4-hydrogen",
        input: prompt,
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: employeeJsonSchema
        },
      });

      const employee = employeeSchema.parse(JSON.parse(interaction.output_text));
      console.log(employee);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormatMimeType;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> properties = new HashMap<>();

      Map<String, Object> nameProp = new HashMap<>();
      nameProp.put("type", "string");
      properties.put("name", nameProp);

      Map<String, Object> idProp = new HashMap<>();
      idProp.put("type", "integer");
      properties.put("employee_id", idProp);

      Map<String, Object> reportsProp = new HashMap<>();
      reportsProp.put("type", "array");
      reportsProp.put("description", "A list of employees reporting to this employee.");
      reportsProp.put("items", Collections.singletonMap("$ref", "#"));
      properties.put("reports", reportsProp);

      Map<String, Object> employeeJsonSchema = new HashMap<>();
      employeeJsonSchema.put("type", "object");
      employeeJsonSchema.put("properties", properties);
      employeeJsonSchema.put("required", Arrays.asList("name", "employee_id", "reports"));

      String prompt =
          "Generate an organization chart for a small team.\n"
              + "The manager is Alice, who manages Bob and Charlie. Bob manages David.";

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  TextResponseFormat.builder()
                      .mimeType(TextResponseFormatMimeType.APPLICATION_JSON)
                      .schema(employeeJsonSchema)
                      .build()));

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of(prompt))
              .responseFormat(format)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println(interaction.outputText().orElse(""));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          employeeJsonSchema := map[string]any{
              "type": "object",
              "properties": map[string]any{
                  "name": map[string]any{
                      "type": "string",
                  },
                  "employee_id": map[string]any{
                      "type": "integer",
                  },
                  "reports": map[string]any{
                      "type":        "array",
                      "description": "A list of employees reporting to this employee.",
                      "items": map[string]any{
                          "$ref": "#",
                      },
                  },
              },
              "required": []string{"name", "employee_id", "reports"},
          }

          prompt := "Generate an organization chart for a small team.\n" +
              "The manager is Alice, who manages Bob and Charlie. Bob manages David."

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.TextResponseFormat{
                  MimeType: interactions.TextResponseFormatMimeTypeApplicationJSON.ToPointer(),
                  Schema:   employeeJsonSchema,
              }),
          )

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model:          interactions.Model("gemini-4-hydrogen"),
                      Input:          interactions.NewInteractionsInput(prompt),
                      ResponseFormat: &format,
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(resp.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
          -H "x-goog-api-key: $GEMINI_API_KEY" \
          -H 'Content-Type: application/json' \
          -H "Api-Revision: 2026-05-20" \
          -d '{
            "model": "gemini-4-hydrogen",
            "input": "Generate an organization chart for a small team.\nThe manager is Alice, who manages Bob and Charlie. Bob manages David.",
            "response_format": {
              "type": "text",
              "mime_type": "application/json",
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "employee_id": { "type": "integer" },
                  "reports": {
                    "type": "array",
                    "description": "A list of employees reporting to this employee.",
                    "items": {
                      "$ref": "#"
                    }
                  }
                },
                "required": ["name", "employee_id", "reports"]
              }
            }
            }
          }'
      ```


**範例回應**：

```json
{
  "name": "Alice",
  "employee_id": 101,
  "reports": [
    {
      "name": "Bob",
      "employee_id": 102,
      "reports": [
        {
          "name": "David",
          "employee_id": 104,
          "reports": []
        }
      ]
    },
    {
      "name": "Charlie",
      "employee_id": 103,
      "reports": []
    }
  ]
}
```

## 串流結果 {#streaming}

你可以串流結構化輸出，在回應產生的同時就開始處理。
串流傳回的區塊是有效的部分 JSON 字串，
串接起來即可組成最終的 JSON 物件。


=== "Python"

      ```python
      from google import genai
      from pydantic import BaseModel
      from typing import Literal

      class Feedback(BaseModel):
          sentiment: Literal["positive", "neutral", "negative"]
          summary: str

      client = genai.Client()
      prompt = "The new UI is incredibly intuitive. Add a very long summary to test streaming!"

      stream = client.interactions.create(
          model="gemini-4-hydrogen",
          input=prompt,
          response_format={
              "type": "text",
              "mime_type": "application/json",
              "schema": Feedback.model_json_schema()
          },
          stream=True
      )
      for event in stream:
          if event.event_type == "step.delta" and event.delta.text:
              print(event.delta.text, end="")
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as z from "zod";

      const feedbackJsonSchema = {
        type: "object",
        properties: {
          sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
          summary: { type: "string" }
        },
        required: ["sentiment", "summary"]
      };

      const feedbackSchema = z.fromJSONSchema(feedbackJsonSchema);

      const client = new GoogleGenAI({});

      const stream = await client.interactions.create({
        model: "gemini-4-hydrogen",
        input: "The new UI is incredibly intuitive. Add a very long summary!",
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: feedbackJsonSchema
        },
        stream: true,
      });

      for await (const event of stream) {
        if (event.event_type === "step.delta" && event.delta?.type === "text") {
          process.stdout.write(event.delta.text);
        }
      }
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.InteractionSSEEvent;
      import com.google.genai.gaos.models.interactions.InteractionSSEStreamEvent;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.StepDelta;
      import com.google.genai.gaos.models.interactions.StepDeltaData;
      import com.google.genai.gaos.models.interactions.TextDelta;
      import com.google.genai.gaos.models.interactions.TextResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormatMimeType;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import com.google.genai.gaos.models.operations.CreateInteractionResponse;
      import com.google.genai.gaos.utils.EventStream;
      import java.util.Arrays;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> properties = new HashMap<>();

      Map<String, Object> sentimentProp = new HashMap<>();
      sentimentProp.put("type", "string");
      sentimentProp.put("enum", Arrays.asList("positive", "neutral", "negative"));
      properties.put("sentiment", sentimentProp);

      Map<String, Object> summaryProp = new HashMap<>();
      summaryProp.put("type", "string");
      properties.put("summary", summaryProp);

      Map<String, Object> feedbackJsonSchema = new HashMap<>();
      feedbackJsonSchema.put("type", "object");
      feedbackJsonSchema.put("properties", properties);
      feedbackJsonSchema.put("required", Arrays.asList("sentiment", "summary"));

      String prompt = "The new UI is incredibly intuitive. Add a very long summary to test streaming!";

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  TextResponseFormat.builder()
                      .mimeType(TextResponseFormatMimeType.APPLICATION_JSON)
                      .schema(feedbackJsonSchema)
                      .build()));

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-hydrogen"))
              .input(InteractionsInput.of(prompt))
              .responseFormat(format)
              .stream(true)
              .build();

      CreateInteractionResponse response =
          client.interactions.create(CreateInteractionRequestBody.of(params));

      try (EventStream<InteractionSSEStreamEvent> events = response.events()) {
        for (InteractionSSEStreamEvent streamEvent : events) {
          InteractionSSEEvent event = streamEvent.data().orElse(null);
          if (event instanceof StepDelta) {
            StepDeltaData data = ((StepDelta) event).delta().orElse(null);
            if (data instanceof TextDelta) {
              ((TextDelta) data).text().ifPresent(System.out::print);
            }
          }
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

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          feedbackJsonSchema := map[string]any{
              "type": "object",
              "properties": map[string]any{
                  "sentiment": map[string]any{
                      "type": "string",
                      "enum": []string{"positive", "neutral", "negative"},
                  },
                  "summary": map[string]any{
                      "type": "string",
                  },
              },
              "required": []string{"sentiment", "summary"},
          }

          prompt := "The new UI is incredibly intuitive. Add a very long summary to test streaming!"

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.TextResponseFormat{
                  MimeType: interactions.TextResponseFormatMimeTypeApplicationJSON.ToPointer(),
                  Schema:   feedbackJsonSchema,
              }),
          )

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model:          interactions.Model("gemini-4-hydrogen"),
                      Input:          interactions.NewInteractionsInput(prompt),
                      ResponseFormat: &format,
                      Stream:         genai.Ptr(true),
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }
          defer resp.InteractionSSEStreamEvent.Close()

          for resp.InteractionSSEStreamEvent.Next() {
              event := resp.InteractionSSEStreamEvent.Value()
              if stepDelta := event.GetDataStepDelta(); stepDelta != nil {
                  if textDelta := stepDelta.GetDeltaText(); textDelta != nil {
                      fmt.Print(textDelta.GetText())
                  }
              }
          }
      }
      ```


## 搭配工具使用結構化輸出 {#tools}


!!! note " "

      預覽：這項功能僅適用於 Gemini 4 與 Gemini 3 系列模型，
      例如 `gemini-4-carbon`、`gemini-4-argon`、`gemini-4-neon`、`gemini-4-hydrogen` 與 `gemini-3.8-flash`。


Gemini 4 與 Gemini 3 讓你能將結構化輸出與內建工具結合使用，包括
[使用 Google 搜尋接地](/docs/google-search/)、
[URL Context](/docs/url-context/)、
[程式碼執行](/docs/code-execution/)、
[File Search](/docs/file-search/#structured-output)，以及
[函式呼叫](/docs/function-calling/)。


=== "Python"

      ```python
      from google import genai
      from pydantic import BaseModel, Field
      from typing import List

      class MatchResult(BaseModel):
          winner: str = Field(description="The name of the winner.")
          final_match_score: str = Field(description="The final match score.")
          scorers: List[str] = Field(description="The name of the scorer.")

      client = genai.Client()

      interaction = client.interactions.create(
          model="gemini-4-carbon",
          input="Search for all details for the latest Euro.",
          tools=[{"type": "google_search"}, {"type": "url_context"}],
          response_format={
              "type": "text",
              "mime_type": "application/json",
              "schema": MatchResult.model_json_schema()
          },
      )

      result = MatchResult.model_validate_json(interaction.output_text)
      print(result)
      ```

=== "JavaScript"

      ```javascript
      import { GoogleGenAI } from "@google/genai";
      import * as z from "zod";

      const matchJsonSchema = {
        type: "object",
        properties: {
          winner: { type: "string" },
          final_match_score: { type: "string" },
          scorers: { type: "array", items: { type: "string" } }
        },
        required: ["winner", "final_match_score", "scorers"]
      };

      const matchSchema = z.fromJSONSchema(matchJsonSchema);

      const client = new GoogleGenAI({});

      const interaction = await client.interactions.create({
        model: "gemini-4-carbon",
        input: "Search for all details for the latest Euro.",
        tools: [{type: "google_search"}, {type: "url_context"}],
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: matchJsonSchema
        },
      });

      const match = matchSchema.parse(JSON.parse(interaction.output_text));
      console.log(match);
      ```

=== "Java"

      ```java
      import com.google.genai.Client;
      import com.google.genai.gaos.models.interactions.CreateModelInteraction;
      import com.google.genai.gaos.models.interactions.CreateModelInteractionResponseFormat;
      import com.google.genai.gaos.models.interactions.GoogleSearch;
      import com.google.genai.gaos.models.interactions.Interaction;
      import com.google.genai.gaos.models.interactions.InteractionsInput;
      import com.google.genai.gaos.models.interactions.Model;
      import com.google.genai.gaos.models.interactions.ResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormat;
      import com.google.genai.gaos.models.interactions.TextResponseFormatMimeType;
      import com.google.genai.gaos.models.interactions.URLContext;
      import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
      import java.util.Arrays;
      import java.util.Collections;
      import java.util.HashMap;
      import java.util.Map;

      Client client = new Client();

      Map<String, Object> properties = new HashMap<>();

      Map<String, Object> winnerProp = new HashMap<>();
      winnerProp.put("type", "string");
      winnerProp.put("description", "The name of the winner.");
      properties.put("winner", winnerProp);

      Map<String, Object> scoreProp = new HashMap<>();
      scoreProp.put("type", "string");
      scoreProp.put("description", "The final match score.");
      properties.put("final_match_score", scoreProp);

      Map<String, Object> scorersProp = new HashMap<>();
      scorersProp.put("type", "array");
      scorersProp.put("description", "The name of the scorer.");
      scorersProp.put("items", Collections.singletonMap("type", "string"));
      properties.put("scorers", scorersProp);

      Map<String, Object> matchJsonSchema = new HashMap<>();
      matchJsonSchema.put("type", "object");
      matchJsonSchema.put("properties", properties);
      matchJsonSchema.put("required", Arrays.asList("winner", "final_match_score", "scorers"));

      CreateModelInteractionResponseFormat format =
          CreateModelInteractionResponseFormat.of(
              ResponseFormat.of(
                  TextResponseFormat.builder()
                      .mimeType(TextResponseFormatMimeType.APPLICATION_JSON)
                      .schema(matchJsonSchema)
                      .build()));

      CreateModelInteraction params =
          CreateModelInteraction.builder()
              .model(Model.of("gemini-4-carbon"))
              .input(InteractionsInput.of("Search for all details for the latest Euro."))
              .tools(Arrays.asList(GoogleSearch.builder().build(), URLContext.builder().build()))
              .responseFormat(format)
              .build();

      Interaction interaction =
          client.interactions.create(CreateInteractionRequestBody.of(params)).interaction().get();

      System.out.println(interaction.outputText().orElse(""));
      ```

=== "Go"

      ```go
      package main

      import (
          "context"
          "fmt"
          "log"

          "google.golang.org/genai"
          "google.golang.org/genai/interactions/models/interactions"
          "google.golang.org/genai/interactions/models/operations"
      )

      func main() {
          ctx := context.Background()
          client, err := genai.NewClient(ctx, nil)
          if err != nil {
              log.Fatal(err)
          }

          matchJsonSchema := map[string]any{
              "type": "object",
              "properties": map[string]any{
                  "winner": map[string]any{
                      "type":        "string",
                      "description": "The name of the winner.",
                  },
                  "final_match_score": map[string]any{
                      "type":        "string",
                      "description": "The final match score.",
                  },
                  "scorers": map[string]any{
                      "type":        "array",
                      "description": "The name of the scorer.",
                      "items": map[string]any{
                          "type": "string",
                      },
                  },
              },
              "required": []string{"winner", "final_match_score", "scorers"},
          }

          format := interactions.NewCreateModelInteractionResponseFormat(
              interactions.NewResponseFormat(interactions.TextResponseFormat{
                  MimeType: interactions.TextResponseFormatMimeTypeApplicationJSON.ToPointer(),
                  Schema:   matchJsonSchema,
              }),
          )

          resp, err := client.Interactions.Create(ctx, operations.CreateInteractionRequest{
              Body: operations.NewCreateInteractionRequestBody(
                  interactions.CreateModelInteraction{
                      Model: interactions.Model("gemini-4-carbon"),
                      Input: interactions.NewInteractionsInput("Search for all details for the latest Euro."),
                      Tools: []interactions.Tool{
                          interactions.NewTool(interactions.GoogleSearch{}),
                          interactions.NewTool(interactions.URLContext{}),
                      },
                      ResponseFormat: &format,
                  },
              ),
          })
          if err != nil {
              log.Fatal(err)
          }

          fmt.Println(resp.Interaction.GetOutputText())
      }
      ```

=== "REST"

      ```shell
      curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
        -H "x-goog-api-key: $GEMINI_API_KEY" \
        -H 'Content-Type: application/json' \
        -H "Api-Revision: 2026-05-20" \
        -d '{
          "model": "gemini-4-carbon",
          "input": "Search for all details for the latest Euro.",
          "tools": [{"type": "google_search"}, {"type": "url_context"}],
          "response_format": {
            "type": "text",
            "mime_type": "application/json",
            "schema": {
              "type": "object",
              "properties": {
                  "winner": {"type": "string"},
                  "final_match_score": {"type": "string"},
                  "scorers": {"type": "array", "items": {"type": "string"}}
              },
              "required": ["winner", "final_match_score", "scorers"]
            }
          }
        }'
      ```


## JSON Schema 支援 {#json-schema-support}

若要產生 JSON 物件，請將 `response_format` 設定為型別 `text` 的物件（或包含
物件的陣列），並將其 `mime_type` 設為
`application/json`。結構描述應放在 `schema` 欄位中提供。

Gemini 的結構化輸出模式支援 [JSON Schema](https://json-schema.org/) 規格的
一部分子集。

以下是支援的 `type` 值：

* **`string`**：文字。
* **`number`**：浮點數。
* **`integer`**：整數。
* **`boolean`**：true 或 false 值。
* **`object`**：以鍵值對表示的結構化資料。
* **`array`**：項目清單。
* **`null`**：若要允許某個屬性為 null，請在型別陣列中加入 `"null"`
  (e.g., `{"type": ["string", "null"]}`).

下列描述性屬性有助於引導模型：

* **`title`**：屬性的簡短說明。
* **`description`**：屬性較長且較詳細的說明。

### 依類型而異的屬性 {#type-specific-properties}

**`object` 型別的值**：

* **`properties`**：一個物件，其中每個鍵是屬性名稱，每個值
  則是該屬性的結構描述。
* **`required`**：字串陣列，列出哪些屬性為必填。
* **`additionalProperties`**：控制是否允許未列在
  `properties` 中的屬性。可以是布林值或結構描述。
* **不支援的計數限制**：`minProperties` 與 `maxProperties` 在
  受限解碼期間不會強制執行，伺服器會忽略它們。
  如有需要，請在應用程式程式碼中驗證屬性數量。

**`string` 型別的值**：

* **`enum`**：列出分類任務可用的特定字串集合。
* **`format`**：指定字串的語法格式，例如 `date-time`、`date`、
  `time`.
* **不支援的長度限制**：`minLength` 與 `maxLength` 在受限解碼
  期間不會強制執行，伺服器會忽略它們。
  如有需要，請在應用程式程式碼中驗證字串長度。

**`number` 與 `integer` 型別的值**：

* **`enum`**：列出可用的特定數值集合。
* **`minimum`**：最小值（包含該值）。
* **`maximum`**：最大值（包含該值）。

**`array` 型別的值**：

* **`items`**：定義陣列中所有項目的結構描述。
* **`prefixItems`**：定義前 N 個項目的結構描述清單，可用來
  建立類似 tuple 的結構。
* **`minItems`**：陣列中的最少項目數。
* **`maxItems`**：陣列中的最多項目數。
* **不支援的陣列限制**：`uniqueItems`、`contains`、`minContains`
  與 `maxContains` 在受限解碼期間不會強制執行，伺服器會
  忽略它們。如有需要，請在應用程式程式碼中去除重複項目
  或檢查陣列內容。

## 結構化輸出與函式呼叫的比較 {#vs-function-calling}

| 功能 | 主要使用情境 |
| :--- | :--- |
| **結構化輸出** | **格式化最終回應**：當你希望模型的*回答*採用特定格式時使用。 |
| **函式呼叫** | **在對話過程中採取行動**：當模型需要先*請你*執行某項任務、再給出最終回答時使用。 |

## 最佳做法 {#best-practices}

* **清楚的說明**：使用 `description` 欄位引導模型。
* **明確的型別**：使用具體的型別（`integer`、`string`、`enum`）。
* **提示詞設計**：清楚說明你希望模型做什麼。
* **驗證**：輸出雖是語法正確的 JSON，仍應一律在應用程式中
  驗證其值。
* **錯誤處理**：針對符合結構描述但語意不正確的輸出，
  實作完善的錯誤處理。

## 限制 {#limitations}

* **結構描述子集**：並非所有 JSON Schema 功能都受支援。
* **結構描述複雜度**：過大或巢狀過深的結構描述可能會被拒絕。
* **不強制執行的限制**：`minLength`、`maxLength`、`minProperties`、
  `maxProperties`、`uniqueItems`、`contains`、`minContains` 與 `maxContains`
  （以及它們的 snake_case 變體）不會由受限解碼文法引擎
  強制執行。如果你的結構描述中含有這些關鍵字（例如
  Pydantic 的 `Field(min_length=...)` 或 Zod 的
  `.min()` 自動產生的），API 會在要求正規化期間自動將其移除並
  忽略，而不會回傳錯誤。`minItems` 與 `maxItems` 則會
  強制執行。若要強制執行其他限制，請在用戶端應用程式中驗證
  輸出（例如使用 Pydantic 的 `model_validate_json()` 或 Zod 的 `.parse()`）。

### 簡化複雜的結構描述 {#simplifying-complex-schemas}

當你要求結構化輸出時，API 會將你的 JSON Schema 編譯成
一個限制 token 產生的狀態機。這個狀態機會對總狀態數、
分支路徑與巢狀深度設下上限。如果你的結構描述
超出這些上限，API 會以
`400 INVALID_ARGUMENT` 錯誤拒絕要求。

若要修正結構描述被拒絕的錯誤，請降低結構描述的結構深度與
分支程度。你可以用以下幾種方式簡化複雜的結構描述：

* **將非結構性規則移入說明**：欄位的 `description` 屬性
  與系統指令能引導模型，又不會為輸出文法增加狀態。
  如果複雜的限制讓你的結構描述超出上限，請將這些
  規則寫成簡潔的說明，並在應用程式程式碼中驗證
  回應。
* **攤平巢狀物件並限制遞迴**：將深層巢狀的物件階層
  改為較扁平的結構。如果你在遞迴型別中使用 `$defs` 與 `$ref`，
  請將遞迴參照設為選用或可為 null。避免
  透過必填屬性，或 `minItems` 大於
  零的陣列進行遞迴。
* **減少選用欄位、列舉與聯集造成的分支**：選用
  屬性、`enum` 值與 `anyOf` 分支會讓輸出文法的分支路徑倍增。
  請盡可能將屬性標示為 `required`，並在欄位可為空時
  允許 `null` 值。精簡過大的 `enum` 清單、簡化
  `anyOf` 聯集，或將限制寫入提示詞中（例如搭配
  Pydantic 結構描述），作為較寬鬆的限制。
* **縮短屬性名稱並移除陣列或數值界限**：屬性鍵
  消耗的狀態數與其字元長度成正比。`minItems` 與 `maxItems` 等
  陣列界限會為每個計數位置複製一份項目結構描述，
  數值界限（`minimum` 與 `maximum`）也會擴大
  狀態空間。請使用簡潔的屬性名稱、移除未使用的欄位，並將
  界限寫入提示詞中（例如搭配 Pydantic 結構描述）作為
  較寬鬆的限制，或在應用程式程式碼中驗證界限。

