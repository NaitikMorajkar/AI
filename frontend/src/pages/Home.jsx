import { Link, useNavigate } from 'react-router-dom'
import ToolCard from '../components/ToolCard'

const heroTags = ['LLMs', 'Pre-commit', 'Semgrep', 'ADK', 'CLI', 'Agents']

const tagToFilter = {
  'LLMs': 'llms',
  'Pre-commit': 'code',
  'Semgrep': 'code',
  'ADK': 'agents',
  'CLI': 'code',
  'Agents': 'agents',
}

const featuredTools = ['chatgpt', 'claude', 'gemini', 'copilot', 'cursor', 'adk']

const workflowTools = [
  { name: 'Pre-commit', desc: 'Automate code quality checks before every commit', icon: '🔧', link: '/security' },
  { name: 'Semgrep', desc: 'Static analysis for security & code standards', icon: '🔍', link: '/security' },
  { name: 'agents-cli', desc: 'Google ADK command-line tool for agent management', icon: '⚡', link: '/agents' },
  { name: 'pyproject.toml', desc: 'Modern Python project configuration', icon: '📦', link: '/setup' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div>
      <section className="bg-gradient-to-br from-primary via-primary-600 to-primary-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Tools Hub</h1>
          <p className="text-lg md:text-xl text-primary-100 mb-6 max-w-2xl mx-auto">
            Your central resource for AI development tools, LLM APIs, agent frameworks, and security best practices.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {heroTags.map(tag => (
              <button
                key={tag}
                onClick={() => navigate(`/tools?filter=${tagToFilter[tag]}`)}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
          <Link to="/tools" className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors">
            Explore Tools
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Latest AI Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTools.map(id => (
            <ToolCard key={id} id={id} onClick={(toolId) => navigate(`/tools/${toolId}`)} />
          ))}
        </div>
      </section>

      <section className="bg-gray-100 dark:bg-gray-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dev Workflow Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowTools.map(tool => (
              <Link key={tool.name} to={tool.link} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">{tool.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{tool.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
