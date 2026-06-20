import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { name: 'Home', path: '/' },
  { name: 'Tools', path: '/tools' },
  { name: 'Setup', path: '/setup' },
  { name: 'Agents', path: '/agents' },
  { name: 'Security', path: '/security' },
]

export default function Navbar({ darkMode, toggleDark, onChatToggle }) {
  const location = useLocation()

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="AI Tools Hub" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">AI Tools Hub</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {tabs.map(tab => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === tab.path
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleDark} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Toggle dark mode">
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            <button onClick={onChatToggle} className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              Ask AI
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto px-4 py-2 gap-1">
          {tabs.map(tab => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                location.pathname === tab.path
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
