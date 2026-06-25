import { useState, useRef, useEffect } from 'react'

const quickReplies = [
  'What is agents-cli?',
  'How do I set up pre-commit?',
  'Explain Google ADK',
  'Best API key practices',
  'Compare ChatGPT vs Claude',
  'What is Semgrep?',
]

export default function ChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)
  const timerRef = useRef(null)
  const panelRef = useRef(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const sendMessage = async (text) => {
    const userMsg = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setTyping(true)

    timerRef.current = setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Cheese is thinking... please wait 🧀' }])
    }, 15000)

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      clearTimeout(timerRef.current)
      setMessages(prev => {
        const filtered = prev.filter(m => m.content !== 'Cheese is thinking... please wait 🧀')
        return [...filtered, { role: 'assistant', content: data.reply }]
      })
    } catch {
      clearTimeout(timerRef.current)
      setMessages(prev => {
        const filtered = prev.filter(m => m.content !== 'Cheese is thinking... please wait 🧀')
        return [...filtered, { role: 'assistant', content: 'Sorry, I could not reach the server. Make sure the backend is running on port 8000.' }]
      })
    } finally {
      setTyping(false)
    }
  }

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const desktopTransform = isOpen
    ? 'translateX(0)'
    : 'translateX(calc(100% + 20px))'

  const mobileTransform = isOpen
    ? 'translateY(0)'
    : 'translateY(100%)'

  const transform = isMobile ? mobileTransform : desktopTransform

  return (
    <>
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      )}
      <div
        ref={panelRef}
        className="fixed z-50"
        style={{
          bottom: isMobile ? 0 : '1rem',
          right: isMobile ? 0 : '1rem',
          width: isMobile ? '100%' : '380px',
          height: isMobile ? '100%' : '500px',
          maxHeight: isMobile ? '100vh' : undefined,
          transform,
          transition: 'transform 0.3s ease',
          borderRadius: isMobile ? '16px 16px 0 0' : undefined,
        }}
      >
        <div className="bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden" style={{ borderRadius: 'inherit' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">AI</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">Aiden</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                  Online
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 dark:text-gray-500 text-sm mt-4">
                <p className="font-medium mb-2">Hi! I'm Aiden. Ask me anything about AI tools.</p>
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                  {quickReplies.map((qr, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(qr)}
                      className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full transition-colors border border-gray-200 dark:border-gray-600"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-500 text-white rounded-br-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-md'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Aiden..."
                className="flex-1 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-primary hover:bg-primary-600 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
