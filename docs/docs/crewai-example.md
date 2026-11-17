# 運用 Gemini 與 CrewAI 進行客戶支援分析

[CrewAI](https://docs.crewai.com/introduction) 是一個用於編排自主 AI 代理的框架，讓多個代理協作達成複雜目標。你可以透過指定角色、目標與背景故事來定義代理，再為它們定義任務。

本範例示範如何運用 Gemini 3 Flash 建立一個多代理系統，分析客戶支援資料、找出問題並提出流程改善建議，最終產出一份供營運長（COO）閱讀的報告。

本指南將示範如何建立一個 AI 代理「crew」，完成下列任務：

1. 擷取並分析客戶支援資料（本範例以模擬資料代替）。
2. 找出反覆出現的問題與流程瓶頸。
3. 提出可行的改善建議。
4. 將研究結果彙整成一份精簡且適合 COO 閱讀的報告。

你需要一組 Gemini API 金鑰。若你還沒有，可以在 [Google AI Studio 取得](https://aistudio.google.com/apikey)。

```posix-terminal
pip install "crewai[tools]"
```

將 Gemini API 金鑰設定為名為 `GEMINI_API_KEY` 的環境變數，接著設定 CrewAI 使用 Gemini 模型。

```python
import os
from crewai import LLM

gemini_api_key = os.getenv("GEMINI_API_KEY")

gemini_llm = LLM(
    model='gemini/gemini-4-hydrogen',
    api_key=gemini_api_key,
)
```

## 定義元件 {#components}

CrewAI 應用程式是由 **Tools**、**Agents**、**Tasks** 以及 **Crew** 本身所組成。以下各節將逐一說明這些元件。

### Tools {#tools}

工具是代理可用來與外部世界互動或執行特定動作的能力。在此，你將定義一個佔位工具，用來模擬擷取客戶支援資料。在實際應用中，你會連接到資料庫、API 或檔案系統。更多工具相關資訊，請參閱 [CrewAI 工具指南](https://docs.crewai.com/concepts/tools)。

```python
from crewai.tools import BaseTool

# Placeholder tool for fetching customer support data
class CustomerSupportDataTool(BaseTool):
    name: str = "Customer Support Data Fetcher"
    description: str = (
      "Fetches recent customer support interactions, tickets, and feedback. "
      "Returns a summary string.")

    def _run(self, argument: str) -> str:
        # In a real scenario, this would query a database or API.
        # For this example, return simulated data.
        print(f"--- Fetching data for query: {argument} ---")
        return (
            """Recent Support Data Summary:

- 50 tickets related to 'login issues'. High resolution time (avg 48h).
- 30 tickets about 'billing discrepancies'. Mostly resolved within 12h.
- 20 tickets on 'feature requests'. Often closed without resolution.
- Frequent feedback mentions 'confusing user interface' for password reset.
- High volume of calls related to 'account verification process'.
- Sentiment analysis shows growing frustration with 'login issues' resolution time.
- Support agent notes indicate difficulty reproducing 'login issues'."""
        )

support_data_tool = CustomerSupportDataTool()
```

### Agents {#agents}

代理是 crew 中的個別 AI 工作者。每個代理都具有特定的 `role`、`goal`、`backstory`、指派的 `llm`，以及選用的 `tools`。更多代理相關資訊，請參閱 [CrewAI 代理指南](https://docs.crewai.com/concepts/agents)。

```python
from crewai import Agent

# Agent 1: Data analyst
data_analyst = Agent(
    role='Customer Support Data Analyst',
    goal='Analyze customer support data to identify trends, recurring issues, and key pain points.',
    backstory=(
        """You are an expert data analyst specializing in customer support operations.
        Your strength lies in identifying patterns and quantifying problems from raw support data."""
    ),
    verbose=True,
    allow_delegation=False, # This agent focuses on its specific task
    tools=[support_data_tool], # Assign the data fetching tool
    llm=gemini_llm # Use the configured Gemini LLM
)

# Agent 2: Process optimizer
process_optimizer = Agent(
    role='Process Optimization Specialist',
    goal='Identify bottlenecks and inefficiencies in current support processes based on the data analysis. Propose actionable improvements.',
    backstory=(
        """You are a specialist in optimizing business processes, particularly in customer support.
        You excel at pinpointing root causes of delays and inefficiencies and suggesting concrete solutions."""
    ),
    verbose=True,
    allow_delegation=False,
    # No tools needed, this agent relies on the context provided by data_analyst.
    llm=gemini_llm
)

# Agent 3: Report writer
report_writer = Agent(
    role='Executive Report Writer',
    goal='Compile the analysis and improvement suggestions into a concise, clear, and actionable report for the COO.',
    backstory=(
        """You are a skilled writer adept at creating executive summaries and reports.
        You focus on clarity, conciseness, and highlighting the most critical information and recommendations for senior leadership."""
    ),
    verbose=True,
    allow_delegation=False,
    llm=gemini_llm
)
```

### Tasks {#tasks}

任務定義了代理的具體工作指派。每個任務都具有 `description`、`expected_output`，並指派給一個 `agent`。任務預設依序執行，並包含前一個任務的上下文。更多任務相關資訊，請參閱 [CrewAI 任務指南](https://docs.crewai.com/concepts/tasks)。

```python
from crewai import Task

# Task 1: Analyze data
analysis_task = Task(
    description=(
        """Fetch and analyze the latest customer support interaction data (tickets, feedback, call logs)
        focusing on the last quarter. Identify the top 3-5 recurring issues, quantify their frequency
        and impact (e.g., resolution time, customer sentiment). Use the Customer Support Data Fetcher tool."""
    ),
    expected_output=(
        """A summary report detailing the key findings from the customer support data analysis, including:

- Top 3-5 recurring issues with frequency.
- Average resolution times for these issues.
- Key customer pain points mentioned in feedback.
- Any notable trends in sentiment or support agent observations."""
    ),
    agent=data_analyst # Assign task to the data_analyst agent
)

# Task 2: Identify bottlenecks and suggest improvements
optimization_task = Task(
    description=(
        """Based on the data analysis report provided by the Data Analyst, identify the primary bottlenecks
        in the support processes contributing to the identified issues (especially the top recurring ones).
        Propose 2-3 concrete, actionable process improvements to address these bottlenecks.
        Consider potential impact and ease of implementation."""
    ),
    expected_output=(
        """A concise list identifying the main process bottlenecks (e.g., lack of documentation for agents,
        complex escalation path, UI issues) linked to the key problems.
A list of 2-3 specific, actionable recommendations for process improvement
(e.g., update agent knowledge base, simplify password reset UI, implement proactive monitoring)."""
    ),
    agent=process_optimizer # Assign task to the process_optimizer agent
    # This task implicitly uses the output of analysis_task as context
)

# Task 3: Compile COO report
report_task = Task(
    description=(
        """Compile the findings from the Data Analyst and the recommendations from the Process Optimization Specialist
        into a single, concise executive report for the COO. The report should clearly state:

1. The most critical customer support issues identified (with brief data points).
2. The key process bottlenecks causing these issues.
3. The recommended process improvements.
Ensure the report is easy to understand, focuses on actionable insights, and is formatted professionally."""
    ),
    expected_output=(
        """A well-structured executive report (max 1 page) summarizing the critical support issues,
        underlying process bottlenecks, and clear, actionable recommendations for the COO.
        Use clear headings and bullet points."""
    ),
    agent=report_writer # Assign task to the report_writer agent
)
```

### Crew {#crew}

`Crew` 將代理與任務結合在一起，並定義工作流程的執行方式（例如「sequential」）。

```python
from crewai import Crew, Process

support_analysis_crew = Crew(
    agents=[data_analyst, process_optimizer, report_writer],
    tasks=[analysis_task, optimization_task, report_task],
    process=Process.sequential, # Tasks will run sequentially in the order defined
    verbose=True
)
```

## 執行 crew {#run-crew}

最後，帶入任何必要的輸入，啟動 crew 執行。

```python
# Start the crew's work
print("--- Starting Customer Support Analysis Crew ---")
# The 'inputs' dictionary provides initial context if needed by the first task.
# In this case, the tool simulates data fetching regardless of the input.
result = support_analysis_crew.kickoff(inputs={'data_query': 'last quarter support data'})

print("--- Crew Execution Finished ---")
print("--- Final Report for COO ---")
print(result)
```

腳本隨即開始執行。`Data Analyst` 會使用工具，`Process
Optimizer` 會分析研究結果，`Report Writer` 則將最終報告彙整完成，隨後輸出到主控台。`verbose=True` 設定會顯示每個代理的詳細思考過程與動作。

如需進一步了解 CrewAI，請參閱 [CrewAI 介紹](https://docs.crewai.com/introduction)。
