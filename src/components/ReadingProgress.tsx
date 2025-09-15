"use client"

import { useEffect, useState } from 'react'

interface ReadingProgressProps {
  height?: number
  color?: string
}

export default function ReadingProgress({ height = 3, color = '#3b82f6' }: ReadingProgressProps) {
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const percent = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0
      setProgress(percent)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div style={{ position: 'sticky', top: 0, left: 0, right: 0, zIndex: 60 }}>
      <div style={{ width: `${progress}%`, height, backgroundColor: color, transition: 'width 80ms linear' }} />
    </div>
  )
} 