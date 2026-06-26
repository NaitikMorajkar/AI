import { useState } from 'react'
import CodeBlock from './CodeBlock'

const toolDetails = {
  chatgpt: {
    name: 'ChatGPT',
    desc: 'OpenAI\'s conversational AI model with GPT-4o (backend uses Gemini)',
    badge: 'Hot',
    category: 'LLMs',
    install: 'pip install openai',
    code: `import google.generativeai as genai\n\ngenai.configure(api_key="YOUR_API_KEY")\n\nmodel = genai.GenerativeModel("gemini-2.0-flash")\nresponse = model.generate_content("Hello!")\nprint(response.text)`,
    docs: 'https://platform.openai.com/docs',
  },
  claude: {
    name: 'Claude',
    desc: 'Anthropic\'s AI assistant with advanced reasoning',
    badge: 'New',
    category: 'LLMs',
    install: 'pip install anthropic',
    code: `from anthropic import Anthropic\n\nclient = Anthropic(api_key="sk-ant-...")\n\nresponse = client.messages.create(\n  model="claude-3-opus-20240229",\n  max_tokens=1024,\n  messages=[\n    {"role": "user", "content": "Hello!"}\n  ]\n)\nprint(response.content[0].text)`,
    docs: 'https://docs.anthropic.com',
  },
  gemini: {
    name: 'Gemini',
    desc: 'Google\'s multimodal AI model',
    badge: 'Free',
    category: 'LLMs',
    install: 'pip install google-generativeai',
    code: `import google.generativeai as genai\n\ngenai.configure(api_key="YOUR_API_KEY")\n\nmodel = genai.GenerativeModel("gemini-pro")\nresponse = model.generate_content("Hello!")\nprint(response.text)`,
    docs: 'https://ai.google.dev/docs',
  },
  ollama: {
    name: 'Ollama',
    desc: 'Run LLMs locally on your machine',
    badge: 'Free',
    category: 'LLMs',
    install: 'curl -fsSL https://ollama.com/install.sh | sh',
    code: `# Pull and run a model\nollama pull llama3.2\nollama run llama3.2\n\n# Python integration\nimport requests\nresponse = requests.post(\n  "http://localhost:11434/api/generate",\n  json={"model": "llama3.2", "prompt": "Hello!"}\n)\nprint(response.json()["response"])`,
    docs: 'https://ollama.com/docs',
  },
  copilot: {
    name: 'Copilot',
    desc: 'GitHub\'s AI pair programmer',
    badge: 'Pro',
    category: 'Code',
    install: 'Install via VS Code Extensions',
    code: `// GitHub Copilot suggests code as you type\n// Example: type a function comment and Copilot generates the body\n\nfunction calculateFibonacci(n) {\n  // Copilot will suggest the implementation\n  if (n <= 1) return n;\n  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);\n}`,
    docs: 'https://docs.github.com/copilot',
  },
  cursor: {
    name: 'Cursor',
    desc: 'AI-first code editor with Chat + Composer',
    badge: 'Hot',
    category: 'Code',
    install: 'Download from cursor.com',
    code: `// Cursor AI Features:\n// Ctrl+K: Edit code with AI\n// Ctrl+L: Chat about code\n// Ctrl+I: Composer (multi-file edits)\n\n// Example: Select code and press Ctrl+K\n// "Add error handling to this function"\n\ndef fetch_data(url):\n    try:\n        response = requests.get(url)\n        response.raise_for_status()\n        return response.json()\n    except requests.RequestException as e:\n        print(f"Error: {e}")\n        return None`,
    docs: 'https://docs.cursor.com',
  },
  adk: {
    name: 'Google ADK',
    desc: 'Agent Development Kit by Google',
    badge: 'New',
    category: 'Agents',
    install: 'pip install google-adk',
    code: `from google.adk import Agent\n\nagent = Agent(\n  name="my_agent",\n  model="gemini-2.0-flash",\n  instruction="You are a helpful assistant."\n)\n\nresponse = agent.run("Hello!")\nprint(response)`,
    docs: 'https://google.adk.dev',
  },
  langchain: {
    name: 'LangChain',
    desc: 'Framework for LLM-powered applications',
    badge: 'Pro',
    category: 'Agents',
    install: 'pip install langchain langchain-openai',
    code: `from langchain_openai import ChatOpenAI\nfrom langchain.schema import HumanMessage\n\nllm = ChatOpenAI(model="gpt-4o")\n\nresponse = llm.invoke([\n  HumanMessage(content="Hello!")\n])\nprint(response.content)`,
    docs: 'https://python.langchain.com/docs',
  },
}

export default function ToolCard({ id, onSelect, onClick }) {
  const tool = toolDetails[id]
  if (!tool) return null

  const badgeColors = {
    Hot: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    New: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    Pro: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    Free: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  }

  const handleClick = () => {
    if (onClick) {
      onClick(id)
    } else {
      onSelect?.(id)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
        {tool.badge && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColors[tool.badge] || ''}`}>
            {tool.badge}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{tool.desc}</p>
      <button
        onClick={(e) => { e.stopPropagation(); onSelect?.(id) }}
        className="text-primary hover:text-primary-600 text-sm font-medium transition-colors"
      >
        View Details →
      </button>
    </div>
  )
}

export function ToolDetail({ id, onBack }) {
  const tool = toolDetails[id]
  if (!tool) return null

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="text-primary hover:text-primary-600 text-sm font-medium mb-6 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Tools
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{tool.desc}</p>

        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Installation</h3>
        <CodeBlock code={tool.install} />

        <h3 className="font-semibold text-gray-900 dark:text-white mt-6 mb-2">Quick Start</h3>
        <CodeBlock code={tool.code} />

        <a href={tool.docs} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 text-primary hover:text-primary-600 text-sm font-medium">
          View Documentation →
        </a>
      </div>
    </div>
  )
}
