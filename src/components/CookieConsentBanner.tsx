'use client'
import { useEffect, useState } from 'react'

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookieConsentAccepted')
    if (!accepted) setVisible(true)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsentAccepted', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white px-4 py-3 flex items-center justify-between shadow-lg">
      <span>By accessing this page you agree with the cookie rules.</span>
      <button
        onClick={handleAccept}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
      >
        OK
      </button>
    </div>
  )
} 