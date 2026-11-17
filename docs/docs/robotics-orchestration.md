# 任務編排

Gemini Robotics ER 模型可以規劃任務並推理空間關係，推斷出該採取哪些動作、該移動哪些物體，以完成目標。本頁透過自訂機器人 API 展示一個[驅動抓取與放置](/docs/robotics-orchestration/#calling-custom-robot-api)操作的範例，藉此編排將物品放入碗中的任務。本範例使用標準的 Gemini ER 2 模型；串流範例請參閱 [Gemini ER 2 串流指南](/docs/robotics-streaming/)。

完整可執行的程式碼請參閱
[Robotics cookbook](https://github.com/google-gemini/robotics-samples/blob/main/Getting%20Started/gemini_robotics_er.ipynb)。

## 使用自訂機器人 API {#calling-custom-robot-api}

本範例示範如何透過自訂機器人 API 進行任務編排，其中導入了一個專為抓取與放置操作設計的模擬 API。任務是拿起一個藍色方塊，將它放進橘色碗裡：

![](https://www.gstatic.com/cloud-cms/72b8ac1bd64a03b5aba649473997ecba.png)

本範例使用下列模擬機器人 API：


=== "Python"

      ```python
      def move(x, y, high):
        print(f"Mock Robot: Moving to coordinates: {x}, {y}, {'high above table' if high else 'down at table level'}")

      def setGripperState(opened):
        print(f"Mock Robot: {'Opening gripper' if opened else 'Closing gripper'}")

      robot_origin_y = 300
      robot_origin_x = 500

      move_function = {
          "type": "function",
          "name": "move",
          "description": "Moves the arm to the given coordinates.",
          "parameters": {
              "type": "object",
              "properties": {
                  "x": {"type": "integer", "description": "X coordinate relative to the origin"},
                  "y": {"type": "integer", "description": "Y coordinate relative to the origin"},
                  "high": {"type": "boolean", "description": "Set to True to lift the robot arm above the scene for avoiding obstacles. Set to False to place the gripper on the surface."}
              },
              "required": ["x", "y", "high"]
          }
      }

      set_gripper_state_function = {
          "type": "function",
          "name": "setGripperState",
          "description": "Opens or closes the robot's gripper.",
          "parameters": {
              "type": "object",
              "properties": {
                  "opened": {"type": "boolean", "description": "True opens the gripper, False closes the gripper."}
              },
              "required": ["opened"]
          }
      }
      ```


下列範例將提示詞與圖片連同工具定義一起傳送給模型，接著執行一個代理迴圈：在每次模型回應之後，執行模型所要求的函式呼叫（`move`、`setGripperState`），透過 `previous_interaction_id` 將結果傳回模型，並重複此流程，直到模型不再呼叫函式或達到步驟上限為止。


=== "Python"

      ```python
      prompt = (
          "You are a robotic arm with six degrees-of-freedom. "
          f"The origin point for calculating the moves is at normalized point y={robot_origin_y}, x={robot_origin_x}. "
          "Use this as the new (0,0) for calculating moves, allowing x and y to be negative.\n\n"
          "Find the blue block and the orange bowl. Calculate their coordinates relative to the origin.\n"
          "Perform a pick and place operation where you pick up the blue block and place it into the orange bowl. "
          "Call the appropriate sequence of functions to complete this operation."
      )

      # 1. Initial Interaction
      interaction = client.interactions.create(
          model=MODEL_ID,
          input=[{"type": "user_input", "content": [
              {"type": "image", "data": img_b64, "mime_type": "image/png"},
              {"type": "text", "text": prompt}
          ]}],
          tools=[move_function, set_gripper_state_function],
          generation_config={"thinking_level": "low"}
      )

      print("\n--- Executing Orchestrated Plan ---")

      max_steps = 15 # Safety limit to prevent infinite loops
      step_count = 0

      # 2. The Agentic Loop
      while step_count < max_steps:
          step_count += 1

          # Check if the model wants to call any functions
          tool_calls = [step for step in interaction.steps if step.type == "function_call"]

          if not tool_calls:
              # If no tools were called, the model is finished with the sequence
              print("Sequence complete.")
              if interaction.output_text:
                  print(f"Model Summary: {interaction.output_text}")
              break

          function_results = []

          for step in tool_calls:
              function_name = step.name
              arguments = step.arguments

              # Execute the mock function
              if function_name == "move":
                  move(**arguments)
              elif function_name == "setGripperState":
                  setGripperState(**arguments)
              else:
                  print(f"Unknown function: {function_name}")

              # 3. Create a result object to tell the model the function succeeded
              function_results.append({
                  "type": "function_result",
                  "name": step.name,
                  "call_id": step.id,
                  "result": [{"type": "text", "text": '{"status": "success"}'}]
              })

          # 4. Send the results back to the model, passing previous_interaction_id
          # so it remembers the conversation history and generates the NEXT step
          interaction = client.interactions.create(
              model=MODEL_ID,
              previous_interaction_id=interaction.id,
              tools=[move_function, set_gripper_state_function],
              input=function_results
          )
      ```


以下顯示模型根據提示詞與模擬機器人 API 可能產生的輸出，其中包含模型串連起來的機器人函式呼叫輸出。

```none
--- Executing Orchestrated Plan ---
Mock Robot: Opening gripper
Mock Robot: Moving to coordinates: 160, 440, high above table
Mock Robot: Moving to coordinates: 160, 440, down at table level
Mock Robot: Closing gripper
Mock Robot: Moving to coordinates: 160, 440, high above table
Mock Robot: Moving to coordinates: -250, 60, high above table
Mock Robot: Moving to coordinates: -250, 60, down at table level
Mock Robot: Opening gripper
Mock Robot: Moving to coordinates: -250, 60, high above table
Sequence complete.
Model Summary: I have completed the task of picking up the blue block and placing it into the orange bowl.
```

## 後續步驟 {#whats-next}

*   [串流機器人應用](/docs/robotics-streaming/) — 具備函式呼叫的即時串流（僅限 Gemini Robotics ER 2）。
*   [影片理解](/docs/robotics-video-progress/) — 從影片追蹤任務進度（僅限 ER 2）。
*   [空間推理](/docs/robotics-spatial/) — 指向、追蹤與邊界框範例。
