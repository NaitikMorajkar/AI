import { useState, useEffect } from 'react'

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onFinish()
    }, 1500)
    return () => clearTimeout(timer)
  }, [onFinish])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0F]">
      <img src="/logo.svg" alt="AI Tools Hub" className="w-48 h-48 md:w-64 md:h-64 animate-pulse" style={{ animationDuration: '1.5s' }} />
    </div>
  )
}
