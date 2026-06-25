import { useState, useRef, useEffect, useCallback } from 'react'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

const SYSTEM_PROMPT = `You are Cheese, a warm and friendly voice AI assistant inside AI Tools Hub. You talk like a real human — not a robot. Be conversational, use natural language, and sound like you're genuinely having a chat. Keep responses concise (2-4 sentences) since they're spoken out loud, but make them feel human: use contractions, vary your tone, and avoid robotic phrasing. You have deep knowledge of AI tools, LLMs, agents, pre-commit, Semgrep, ADK, CLI tools, API keys, and developer workflows. Be helpful, slightly playful, and always accurate. Never start responses with phrases like "As an AI" or "I'm here to" — just answer naturally.`

const API_URL = 'http://localhost:8000/api/chat'
const MAX_HISTORY = 10

function playActivationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(880, ctx.currentTime)
    gain1.gain.setValueAtTime(0.15, ctx.currentTime)
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    osc1.start(ctx.currentTime)
    osc1.stop(ctx.currentTime + 0.15)

    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1108, ctx.currentTime + 0.15)
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
    osc2.start(ctx.currentTime + 0.15)
    osc2.stop(ctx.currentTime + 0.35)
  } catch {}
}

export default function Cheese() {
  const [status, setStatus] = useState('idle')
  const [transcript, setTranscript] = useState('')
  const [reply, setReply] = useState('')
  const [error, setError] = useState('')
  const [dark, setDark] = useState(false)
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false)

  const recognitionRef = useRef(null)
  const utteranceRef = useRef(null)
  const statusRef = useRef('idle')
  const historyRef = useRef([])
  const synth = window.speechSynthesis
  const silenceTimerRef = useRef(null)

  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains('dark'))
    check()
    const o = new MutationObserver(check)
    o.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => o.disconnect()
  }, [])

  useEffect(() => {
    if ('speechSynthesis' in window) speechSynthesis.getVoices()
    requestMicIfNeeded()
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault()
        handleTap()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    return () => {
      stopRecognition()
      synth.cancel()
      clearTimeout(silenceTimerRef.current)
    }
  }, [])

  const requestMicIfNeeded = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' })
      if (result.state === 'prompt') setShowPermissionPrompt(true)
    } catch {
      setShowPermissionPrompt(true)
    }
  }

  const requestMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      })
      stream.getTracks().forEach(t => t.stop())
      setShowPermissionPrompt(false)
    } catch {
      setShowPermissionPrompt(false)
    }
  }

  const stopRecognition = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch {}
      try { recognitionRef.current.stop() } catch {}
      recognitionRef.current = null
    }
    clearTimeout(silenceTimerRef.current)
  }

  const handleTap = useCallback(() => {
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.')
      return
    }

    if (statusRef.current === 'speaking') {
      synth.cancel()
      resetToIdle()
      return
    }

    if (statusRef.current === 'listening' || statusRef.current === 'thinking') return

    startListening()
  }, [])

  const resetToIdle = () => {
    statusRef.current = 'idle'
    setStatus('idle')
    setTranscript('')
    setReply('')
    setError('')
  }

  const startListening = () => {
    stopRecognition()

    playActivationSound()
    setError('')
    setTranscript('')
    setReply('')
    statusRef.current = 'listening'
    setStatus('listening')

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    recognitionRef.current = recognition

    let finalTranscript = ''

    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        } else {
          interim += event.results[i][0].transcript
        }
      }
      setTranscript(finalTranscript + interim || 'Listening...')

      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = setTimeout(() => {
        if (finalTranscript.trim().length > 0) {
          recognition.stop()
        }
      }, 1500)
    }

    recognition.onerror = (e) => {
      if (e.error === 'aborted' || e.error === 'no-speech') {
        resetToIdle()
        return
      }
      setError(`Mic error: ${e.error}`)
      resetToIdle()
    }

    recognition.onend = () => {
      clearTimeout(silenceTimerRef.current)
      if (statusRef.current !== 'listening') return
      if (finalTranscript.trim().length > 0) {
        sendToBackend(finalTranscript.trim())
      } else {
        resetToIdle()
      }
    }

    try {
      recognition.start()
    } catch (e) {
      setError('Could not start microphone.')
      resetToIdle()
    }
  }

  const sendToBackend = async (text) => {
    if (!text || text.trim().length < 2) {
      resetToIdle()
      return
    }

    statusRef.current = 'thinking'
    setStatus('thinking')

    const userMsg = { role: 'user', content: text }
    const currentHistory = historyRef.current
    const updatedHistory = [...currentHistory, userMsg].slice(-MAX_HISTORY)
    historyRef.current = updatedHistory

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: updatedHistory.map(m => ({ role: m.role, content: m.content })),
          system_prompt: SYSTEM_PROMPT,
        }),
      })
      const data = await res.json()
      const replyText = data.reply || 'Sorry, I got an empty response.'
      historyRef.current = [...updatedHistory, { role: 'assistant', content: replyText }]
      speakText(replyText)
    } catch {
      const err = 'Sorry, I could not reach the server. Make sure the backend is running!'
      speakText(err)
    }
  }

  const speakText = (text) => {
    synth.cancel()
    setReply(text)
    statusRef.current = 'speaking'
    setStatus('speaking')

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1.1

    const voices = synth.getVoices()
    const preferred = voices.find(v => /female/i.test(v.name) && v.lang.startsWith('en'))
      || voices.find(v => v.lang.startsWith('en'))
      || voices[0]
    if (preferred) utterance.voice = preferred

    utterance.onend = () => resetToIdle()
    utterance.onerror = () => resetToIdle()

    utteranceRef.current = utterance
    synth.speak(utterance)
  }

  const statusLabel = {
    idle: 'Tap to ask Cheese 🧀',
    listening: 'Listening...',
    thinking: 'Thinking...',
    speaking: 'Speaking...',
  }[status] || 'Tap to ask Cheese 🧀'

  const buttonColor = status === 'listening' ? '#EF4444' :
    status === 'thinking' ? '#3B82F6' :
    status === 'speaking' ? '#10B981' :
    '#8B5CF6'

  if (showPermissionPrompt) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm mx-4 text-center shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4">🧀</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Hi! I'm Cheese</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            I need microphone access to hear your questions.
          </p>
          <button
            onClick={requestMicrophone}
            className="w-full py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors shadow-lg"
          >
            Allow Microphone
          </button>
          <button
            onClick={() => setShowPermissionPrompt(false)}
            className="mt-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2">
      {(status === 'listening' || status === 'thinking' || status === 'speaking') && (
        <div className={`px-4 py-2 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-slideUp ${
          dark ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">🧀</span>
            <span className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>Cheese</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              status === 'speaking' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
              status === 'thinking' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
              'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
            }`}>
              {status === 'speaking' ? 'Speaking' : status === 'thinking' ? 'Thinking' : 'Listening'}
            </span>
            {status === 'speaking' && (
              <button
                onClick={handleTap}
                className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                Stop
              </button>
            )}
          </div>
          {(transcript || reply) && (
            <p className={`text-sm mt-1 max-w-xs ${dark ? 'text-gray-200' : 'text-gray-700'}`}>
              {status === 'speaking' ? reply : transcript}
            </p>
          )}
        </div>
      )}

      <div className="relative flex flex-col items-center">
        <div className="absolute inset-0 rounded-full animate-pulse-ring" style={{ borderColor: buttonColor }} />
        <button
          onClick={handleTap}
          className="relative w-15 h-15 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-90 hover:shadow-xl hover:scale-105"
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: dark ? '#374151' : '#ffffff',
            border: `2.5px solid ${buttonColor}`,
          }}
          aria-label="Cheese voice assistant"
        >
          {status === 'listening' && (
            <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: '#EF444420' }} />
          )}
          {status === 'thinking' && (
            <span className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#3B82F6', borderTopColor: 'transparent' }} />
          )}
          {status === 'speaking' && (
            <span className="absolute inset-0 rounded-full animate-pulse" style={{ backgroundColor: '#10B98130' }} />
          )}
          <span className="text-2xl md:text-3xl relative z-10 select-none">🧀</span>
        </button>
        <span className={`text-xs mt-1.5 whitespace-nowrap font-medium ${
          dark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {statusLabel}
        </span>
        {error && (
          <span className="text-xs mt-1 text-red-500 max-w-[160px] text-center">{error}</span>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.6; }
        }
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
