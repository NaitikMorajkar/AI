import CodeBlock from '../components/CodeBlock'
import StepGuide from '../components/StepGuide'

export default function Agents() {
  const scaffoldSteps = {
    title: 'Google ADK Scaffold',
    steps: [
      { text: 'Install the agents-cli tool:', code: 'pip install google-adk' },
      { text: 'Scaffold a new agent project:', code: 'agents-cli scaffold create my-agent' },
      { text: 'Navigate into the project:', code: 'cd my-agent' },
      { text: 'Run the agent locally:', code: 'agents-cli run .' },
    ],
  }

  const lintSteps = {
    title: 'agents-cli Lint Commands',
    steps: [
      { text: 'Lint your agent project:', code: 'agents-cli lint .' },
      { text: 'Auto-fix lint issues:', code: 'agents-cli lint --fix .' },
      { text: 'Check for security issues:', code: 'agents-cli lint --security .' },
    ],
  }

  const agentCode = `from google.adk import Agent

# Define a simple agent
weather_agent = Agent(
    name="weather_agent",
    model="gemini-2.0-flash",
    instruction="You are a helpful weather assistant. "
                "Provide concise weather information."
)

# Define a tool
@weather_agent.tool
def get_weather(city: str) -> str:
    """Get the current weather for a city."""
    # In production, call a weather API here
    return f"The weather in {city} is sunny, 72°F"

# Run the agent
response = weather_agent.run(
    "What's the weather in Tokyo?"
)
print(response)

# Multi-agent orchestration
from google.adk import Agent, Orchestrator

agent1 = Agent(name="researcher", model="gemini-2.0-flash",
               instruction="Research and gather information.")
agent2 = Agent(name="writer", model="gemini-2.0-flash",
               instruction="Write clear summaries based on research.")

orchestrator = Orchestrator(agents=[agent1, agent2])
result = orchestrator.run("Explain quantum computing")
print(result)
`

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Agents</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Build and manage AI agents with Google ADK and agents-cli.</p>

      <div className="space-y-8">
        <StepGuide {...scaffoldSteps} />
        <StepGuide {...lintSteps} />

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Minimal LLM Agent Loop</h3>
          <CodeBlock code={agentCode} />
        </div>
      </div>
    </div>
  )
}
