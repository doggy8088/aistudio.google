# 使用 Gemini 與 LlamaIndex 打造研究代理

LlamaIndex 是一個框架，可運用連接到你資料的 LLM 來打造知識代理。本範例將示範如何為研究代理建立多代理工作流程。在 LlamaIndex 中，[`Workflows`](https://docs.llamaindex.ai/en/stable/module_guides/workflow/) 是代理與多代理系統的建構基礎。

你需要一組 Gemini API 金鑰。如果你還沒有，可以[在 Google AI Studio 中取得](https://aistudio.google.com/apikey)。首先，安裝所有必要的 LlamaIndex 程式庫。LlamaIndex 在底層使用 `google-genai` 套件。

```posix-terminal
pip install llama-index llama-index-utils-workflow llama-index-llms-google-genai llama-index-tools-google
```

## 在 LlamaIndex 中設定 Gemini {#setup}

任何 LlamaIndex 代理的核心都是一個 LLM，負責推理與文字處理。本範例使用 Gemini 3 Flash。請務必[將你的 API 金鑰設定為環境變數](/docs/api-key/)。

```python
import os
from llama_index.llms.google_genai import GoogleGenAI

# Set your API key in the environment elsewhere, or with os.environ['GEMINI_API_KEY'] = '...'
assert 'GEMINI_API_KEY' in os.environ

llm = GoogleGenAI(model="gemini-4-hydrogen")
```

## 建立工具 {#tools}

代理會使用工具與外部世界互動，例如搜尋網路或儲存資訊。[LlamaIndex 中的工具](https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/tools/)可以是一般的 Python 函式，也可以從既有的 `ToolSpecs` 匯入。Gemini 內建了使用 Google 搜尋的工具，本範例即採用此工具。

```python
from google.genai import types

google_search_tool = types.Tool(
    google_search=types.GoogleSearch()
)

llm_with_search = GoogleGenAI(
    model="gemini-4-hydrogen",
    generation_config=types.GenerateContentConfig(tools=[google_search_tool])
)
```

現在，用一個需要搜尋的查詢來測試這個 LLM 執行個體。本指南假設已有一個正在執行的事件迴圈（例如 `python -m asyncio` 或 Google Colab）。

```python
response = await llm_with_search.acomplete("What's the weather like today in Biarritz?")
print(response)
```

研究代理將使用 Python 函式作為工具。完成這項任務的系統建構方式有很多種。在本範例中，你將使用以下工具：

1. `search_web` 使用搭配 Google 搜尋的 Gemini，在網路上搜尋指定主題的資訊。
2. `record_notes` 將在網路上找到的研究內容儲存到狀態中，供其他工具使用。
3. `write_report` 使用 `ResearchAgent` 找到的資訊撰寫報告
4. `review_report` 審閱報告並提供回饋。

`Context` 類別會在代理／工具之間傳遞狀態，每個代理都能存取系統的目前狀態。

```python
from llama_index.core.workflow import Context

async def search_web(ctx: Context, query: str) -> str:
    """Useful for searching the web about a specific query or topic"""
    response = await llm_with_search.acomplete(f"""Please research given this query or topic,
    and return the result\n<query_or_topic>{query}</query_or_topic>""")
    return response

async def record_notes(ctx: Context, notes: str, notes_title: str) -> str:
    """Useful for recording notes on a given topic."""
    current_state = await ctx.store.get("state")
    if "research_notes" not in current_state:
        current_state["research_notes"] = {}
    current_state["research_notes"][notes_title] = notes
    await ctx.store.set("state", current_state)
    return "Notes recorded."

async def write_report(ctx: Context, report_content: str) -> str:
    """Useful for writing a report on a given topic."""
    current_state = await ctx.store.get("state")
    current_state["report_content"] = report_content
    await ctx.store.set("state", current_state)
    return "Report written."

async def review_report(ctx: Context, review: str) -> str:
    """Useful for reviewing a report and providing feedback."""
    current_state = await ctx.store.get("state")
    current_state["review"] = review
    await ctx.store.set("state", current_state)
    return "Report reviewed."
```

## 建立多代理助理 {#multiagent}

若要建立多代理系統，你需要定義各個代理以及它們之間的互動方式。你的系統將包含三個代理：

1. `ResearchAgent` 在網路上搜尋指定主題的資訊。
2. `WriteAgent` 使用 `ResearchAgent` 找到的資訊撰寫報告。
3. `ReviewAgent` 審閱報告並提供回饋。

本範例使用 `AgentWorkflow` 類別建立多代理系統，並依序執行這些代理。每個代理都會接收一個 `system_prompt`，說明它應該做什麼，並建議如何與其他代理協作。

你可以選擇性地透過 `can_handoff_to` 指定每個代理可以與哪些其他代理溝通，協助多代理系統運作（若未指定，系統會自行判斷）。

```python
from llama_index.core.agent.workflow import (
    AgentInput,
    AgentOutput,
    ToolCall,
    ToolCallResult,
    AgentStream,
)
from llama_index.core.agent.workflow import FunctionAgent, ReActAgent

research_agent = FunctionAgent(
    name="ResearchAgent",
    description="Useful for searching the web for information on a given topic and recording notes on the topic.",
    system_prompt=(
        "You are the ResearchAgent that can search the web for information on a given topic and record notes on the topic. "
        "Once notes are recorded and you are satisfied, you should hand off control to the WriteAgent to write a report on the topic."
    ),
    llm=llm,
    tools=[search_web, record_notes],
    can_handoff_to=["WriteAgent"],
)

write_agent = FunctionAgent(
    name="WriteAgent",
    description="Useful for writing a report on a given topic.",
    system_prompt=(
        "You are the WriteAgent that can write a report on a given topic. "
        "Your report should be in a markdown format. The content should be grounded in the research notes. "
        "Once the report is written, you should get feedback at least once from the ReviewAgent."
    ),
    llm=llm,
    tools=[write_report],
    can_handoff_to=["ReviewAgent", "ResearchAgent"],
)

review_agent = FunctionAgent(
    name="ReviewAgent",
    description="Useful for reviewing a report and providing feedback.",
    system_prompt=(
        "You are the ReviewAgent that can review a report and provide feedback. "
        "Your feedback should either approve the current report or request changes for the WriteAgent to implement."
    ),
    llm=llm,
    tools=[review_report],
    can_handoff_to=["ResearchAgent","WriteAgent"],
)
```

代理已定義完成，現在你可以建立 `AgentWorkflow` 並執行它。

```python
from llama_index.core.agent.workflow import AgentWorkflow

agent_workflow = AgentWorkflow(
    agents=[research_agent, write_agent, review_agent],
    root_agent=research_agent.name,
    initial_state={
        "research_notes": {},
        "report_content": "Not written yet.",
        "review": "Review required.",
    },
)
```

在工作流程執行期間，你可以將事件、工具呼叫與更新串流輸出到主控台。

```python
from llama_index.core.agent.workflow import (
    AgentInput,
    AgentOutput,
    ToolCall,
    ToolCallResult,
    AgentStream,
)

research_topic = """Write me a report on the history of the web.
Briefly describe the history of the world wide web, including
the development of the internet and the development of the web,
including 21st century developments"""

handler = agent_workflow.run(
    user_msg=research_topic
)

current_agent = None
current_tool_calls = ""
async for event in handler.stream_events():
    if (
        hasattr(event, "current_agent_name")
        and event.current_agent_name != current_agent
    ):
        current_agent = event.current_agent_name
        print(f"\n{'='*50}")
        print(f"🤖 Agent: {current_agent}")
        print(f"{'='*50}\n")
    elif isinstance(event, AgentOutput):
        if event.response.content:
            print("📤 Output:", event.response.content)
        if event.tool_calls:
            print(
                "🛠️ Planning to use tools:",
                [call.tool_name for call in event.tool_calls],
            )
    elif isinstance(event, ToolCallResult):
        print(f"🔧 Tool Result ({event.tool_name}):")
        print(f" Arguments: {event.tool_kwargs}")
        print(f" Output: {event.tool_output}")
    elif isinstance(event, ToolCall):
        print(f"🔨 Calling Tool: {event.tool_name}")
        print(f" With arguments: {event.tool_kwargs}")
```

工作流程完成後，你可以列印報告的最終輸出，以及審閱代理的最終審閱狀態。

```python
state = await handler.ctx.store.get("state")
print("Report Content:\n", state["report_content"])
print("\n------------\nFinal Review:\n", state["review"])
```

## 透過自訂工作流程更進一步 {#go-further-with-custom-workflows}

`AgentWorkflow` 是開始使用多代理系統的好方法。但如果你需要更多的控制權呢？你可以從頭建立工作流程。以下是你可能想建立自訂工作流程的幾個原因：

* **對流程有更多控制：** 你可以決定代理採取的確切路徑，包括建立迴圈、在特定節點做決策，或讓代理平行處理不同任務。

* **使用複雜資料：** 不再局限於純文字。自訂工作流程讓你能使用更結構化的資料，例如 JSON 物件或自訂類別，作為輸入與輸出。

* **處理不同媒體：** 打造不僅能理解與處理文字，也能處理圖片、音訊與影片的代理。

* **更聰明的規劃：** 你可以設計一個工作流程，先建立詳細計畫，再讓代理開始工作。這對於需要多個步驟的複雜任務特別有用。

* **啟用自我修正：** 建立能審閱自身工作的代理。如果輸出不夠好，代理可以再試一次，形成持續改進的迴圈，直到結果完善為止。


若要進一步了解 LlamaIndex Workflows，請參閱 [LlamaIndex Workflows 文件](https://docs.llamaindex.ai/en/stable/module_guides/workflow/)。
