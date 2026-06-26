import { useState, useEffect } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import ToolCard, { ToolDetail } from '../components/ToolCard'

const toolIds = ['chatgpt', 'claude', 'gemini', 'ollama', 'copilot', 'cursor', 'adk', 'langchain']

const categories = [
  { label: 'All', filter: '' },
  { label: 'LLMs', filter: 'LLMs' },
  { label: 'Code', filter: 'Code' },
  { label: 'Agents', filter: 'Agents' },
  { label: 'Free', filter: 'Free' },
]

const urlToFilter = {
  llms: 'LLMs',
  code: 'Code',
  agents: 'Agents',
  free: 'Free',
}

const toolDetails = {
  chatgpt: { category: 'LLMs', badge: 'Hot' },
  claude: { category: 'LLMs', badge: 'New' },
  gemini: { category: 'LLMs', badge: 'Free' },
  ollama: { category: 'LLMs', badge: 'Free' },
  copilot: { category: 'Code', badge: 'Pro' },
  cursor: { category: 'Code', badge: 'Hot' },
  adk: { category: 'Agents', badge: 'New' },
  langchain: { category: 'Agents', badge: 'Pro' },
}

export default function Tools() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { toolId } = useParams()
  const [activeFilter, setActiveFilter] = useState('')
  const [selectedTool, setSelectedTool] = useState(null)

  useEffect(() => {
    const urlFilter = searchParams.get('filter')
    if (urlFilter) {
      const matched = urlToFilter[urlFilter.toLowerCase()]
      if (matched) setActiveFilter(matched)
    }
  }, [searchParams])

  useEffect(() => {
    if (toolId) {
      setSelectedTool(toolId)
    }
  }, [toolId])

  const filtered = toolIds.filter(id => {
    const info = toolDetails[id]
    if (!activeFilter) return true
    if (activeFilter === 'Free') return info.badge === 'Free'
    return info.category === activeFilter
  })

  console.log(`[Tools] activeFilter="${activeFilter}" matched=${filtered.length} tools:`, filtered.map(id => toolDetails[id]?.name || id).join(', '))

  const handleChipClick = (filter) => {
    setActiveFilter(filter)
    const urlKey = Object.entries(urlToFilter).find(([, v]) => v === filter)?.[0]
    if (urlKey) setSearchParams({ filter: urlKey }, { replace: true })
    else setSearchParams({}, { replace: true })
  }

  if (selectedTool) {
    return <div className="max-w-7xl mx-auto px-4 py-8">
      <ToolDetail id={selectedTool} onBack={() => setSelectedTool(null)} />
    </div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Tools</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Browse and explore the latest AI development tools.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat.label}
            onClick={() => handleChipClick(cat.filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === cat.filter
                ? 'bg-primary text-white shadow-md ring-2 ring-primary/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(id => (
          <ToolCard key={id} id={id} onSelect={setSelectedTool} />
        ))}
      </div>
    </div>
  )
}
