# 從零開始以 Gemini 與 LangGraph 打造 ReAct 代理

LangGraph 是一個用來建構有狀態 LLM 應用程式的框架，很適合用來打造 ReAct（Reasoning and Acting）代理。

ReAct 代理結合 LLM 推理與動作執行，會反覆思考、使用工具，並根據觀察結果採取行動以達成使用者目標，動態調整做法。這個模式出自 2023 年的論文 [「ReAct: Synergizing Reasoning and Acting in Language Models」](https://arxiv.org/abs/2210.03629)，試圖以類似人類、具彈性的問題解決方式，取代僵化的工作流程。

LangGraph 提供預先建構的 ReAct 代理（[`create_react_agent`](https://langchain-ai.github.io/langgraph/reference/prebuilt/#langgraph.prebuilt.chat_agent_executor.create_react_agent)），當你的 ReAct 實作需要更多控制與自訂時，它就能發揮優勢。本指南將示範一個簡化版本。

LangGraph 以三個關鍵元件將代理建模為圖形：

* `State`：共用資料結構（通常是 `TypedDict` 或 `Pydantic BaseModel`），代表應用程式目前的快照。
* `Nodes`：負責編寫代理的邏輯。它們接收目前的 State 作為輸入，執行運算或副作用，並回傳更新後的 State，例如 LLM 呼叫或工具呼叫。
* `Edges`：定義下一個要執行的 `Node`，其判斷依據是目前的 `State`，支援條件邏輯與固定轉換。

如果你還沒有 API 金鑰，可以從 [Google AI Studio](https://aistudio.google.com/apikey) 取得。

```bash
pip install langgraph langchain-google-genai geopy requests
```

將你的 API 金鑰設定在環境變數 `GEMINI_API_KEY` 中。

```python
import os

# Read your API key from the environment variable or set it manually
api_key = os.getenv("GEMINI_API_KEY")
```

為了更清楚瞭解如何使用 LangGraph 實作 ReAct 代理，本指南將透過一個實作範例逐步說明。你將建立一個代理，其目標是使用工具查詢指定地點目前的天氣。

對於這個天氣代理，`State` 會保存進行中的對話歷程（以訊息清單表示）以及已執行步數的計數器（以整數表示），後者僅供說明之用。

LangGraph 提供了一個輔助函式 `add_messages`，用來更新 state 中的訊息清單。它扮演 [reducer](https://langchain-ai.github.io/langgraph/concepts/low_level/#reducers) 的角色，接收目前的清單與新訊息，並回傳合併後的清單。它會依訊息 ID 處理更新，對於新的、未曾出現的訊息，則預設採「僅附加」行為。


!!! note " "

      注意：由於在 state 中保存訊息清單相當常見，因此有一個預先建構的 state 叫作 `MessagesState`，可以作為基底類別使用。本範例會明確列出訊息。


```python
from typing import Annotated,Sequence, TypedDict

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages # helper function to add messages to the state

class AgentState(TypedDict):
    """The state of the agent."""
    messages: Annotated[Sequence[BaseMessage], add_messages]
    number_of_steps: int
```

接著，定義你的天氣工具。

```python
from langchain_core.tools import tool
from geopy.geocoders import Nominatim
from pydantic import BaseModel, Field
import requests

geolocator = Nominatim(user_agent="weather-app")

class SearchInput(BaseModel):
    location:str = Field(description="The city and state, e.g., San Francisco")
    date:str = Field(description="the forecasting date for when to get the weather format (yyyy-mm-dd)")

@tool("get_weather_forecast", args_schema=SearchInput, return_direct=True)
def get_weather_forecast(location: str, date: str):
    """Retrieves the weather using Open-Meteo API.

    Takes a given location (city) and a date (yyyy-mm-dd).

    Returns:
        A dict with the time and temperature for each hour.
    """
    # Note that Colab may experience rate limiting on this service. If this
    # happens, use a machine to which you have exclusive access.
    location = geolocator.geocode(location)
    if location:
        try:
            response = requests.get(f"https://api.open-meteo.com/v1/forecast?latitude={location.latitude}&longitude={location.longitude}&hourly=temperature_2m&start_date={date}&end_date={date}")
            data = response.json()
            return dict(zip(data["hourly"]["time"], data["hourly"]["temperature_2m"]))
        except Exception as e:
            return {"error": str(e)}
    else:
        return {"error": "Location not found"}

tools = [get_weather_forecast]
```

現在初始化模型，並將工具綁定到模型。

```python
from datetime import datetime
from langchain_google_genai import ChatGoogleGenerativeAI

# Create LLM class
llm = ChatGoogleGenerativeAI(
    model="gemini-4-hydrogen",
    max_retries=2,
    google_api_key=api_key,
)

# Bind tools to the model
model = llm.bind_tools([get_weather_forecast])

# Test the model with tools
res=model.invoke(f"What is the weather in Berlin on {datetime.today()}?")

print(res)
```

在執行代理之前，最後一步是定義節點與邊。本範例有兩個節點與一條邊。

- `call_tool` 節點負責執行你的工具方法。LangGraph 為此提供了一個預先建構的節點，叫作 [ToolNode](https://langchain-ai.github.io/langgraph/how-tos/tool-calling/)。

- `call_model` 節點使用 `model_with_tools` 呼叫模型。

- `should_continue` 邊負責決定要呼叫工具還是模型。


節點與邊的數量並不固定，你可以依需求在圖形中加入任意數量的節點與邊。例如，你可以加入一個節點來新增結構化輸出，或加入自我驗證／反思節點，在呼叫工具或模型之前先檢查模型輸出。

```python
from langchain_core.messages import ToolMessage
from langchain_core.runnables import RunnableConfig

tools_by_name = {tool.name: tool for tool in tools}

# Define our tool node
def call_tool(state: AgentState):
    outputs = []
    # Iterate over the tool calls in the last message
    for tool_call in state["messages"][-1].tool_calls:
        # Get the tool by name
        tool_result = tools_by_name[tool_call["name"]].invoke(tool_call["args"])
        outputs.append(
            ToolMessage(
                content=tool_result,
                name=tool_call["name"],
                tool_call_id=tool_call["id"],
            )
        )
    return {"messages": outputs}

def call_model(
    state: AgentState,
    config: RunnableConfig,
):
    # Invoke the model with the system prompt and the messages
    response = model.invoke(state["messages"], config)
    # This returns a list, which combines with the existing messages state
    # using the add_messages reducer.
    return {"messages": [response]}

# Define the conditional edge that determines whether to continue or not
def should_continue(state: AgentState):
    messages = state["messages"]
    # If the last message is not a tool call, then finish
    if not messages[-1].tool_calls:
        return "end"
    # default to continue
    return "continue"
```

代理的所有元件都準備好之後，現在可以將它們組裝起來。

```python
from langgraph.graph import StateGraph, END

# Define a new graph with our state
workflow = StateGraph(AgentState)

# 1. Add the nodes
workflow.add_node("llm", call_model)
workflow.add_node("tools", call_tool)
# 2. Set the entrypoint as `agent`, this is the first node called
workflow.set_entry_point("llm")
# 3. Add a conditional edge after the `llm` node is called.
workflow.add_conditional_edges(
    # Edge is used after the `llm` node is called.
    "llm",
    # The function that will determine which node is called next.
    should_continue,
    # Mapping for where to go next, keys are strings from the function return,
    # and the values are other nodes.
    # END is a special node marking that the graph is finish.
    {
        # If `tools`, then we call the tool node.
        "continue": "tools",
        # Otherwise we finish.
        "end": END,
    },
)
# 4. Add a normal edge after `tools` is called, `llm` node is called next.
workflow.add_edge("tools", "llm")

# Now we can compile and visualize our graph
graph = workflow.compile()
```

你可以使用 `draw_mermaid_png` 方法將圖形視覺化。

```python
from IPython.display import Image, display

display(Image(graph.get_graph().draw_mermaid_png()))
```

![](https://www.gstatic.com/cloud-cms/bc67bbee1b3ed11d67da9302ba9f3be4.png)

現在執行代理。

```python
from datetime import datetime
# Create our initial message dictionary
inputs = {"messages": [("user", f"What is the weather in Berlin on {datetime.today()}?")]}

# call our graph with streaming to see the steps
for state in graph.stream(inputs, stream_mode="values"):
    last_message = state["messages"][-1]
    last_message.pretty_print()
```

現在你可以延續對話，詢問另一個城市的天氣，或要求進行比較。

```python
state["messages"].append(("user", "Would it be warmer in Munich?"))

for state in graph.stream(state, stream_mode="values"):
    last_message = state["messages"][-1]
    last_message.pretty_print()
```
