import { useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import SplashScreen from './components/SplashScreen'
import Navbar from './components/Navbar'
import ChatBot from './components/ChatBot'
import Cheese from './components/Cheese'
import Home from './pages/Home'
import Tools from './pages/Tools'
import Setup from './pages/Setup'
import Agents from './pages/Agents'
import Security from './pages/Security'

function App() {
  const [loaded, setLoaded] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  const toggleDark = () => setDarkMode(prev => !prev)
  const handleSplashFinish = useCallback(() => setLoaded(true), [])

  if (!loaded) {
    return <SplashScreen onFinish={handleSplashFinish} />
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <Navbar darkMode={darkMode} toggleDark={toggleDark} onChatToggle={() => setChatOpen(prev => !prev)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/:toolId" element={<Tools />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/security" element={<Security />} />
        </Routes>
        <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        <Cheese />
      </div>
    </div>
  )
}

export default App
