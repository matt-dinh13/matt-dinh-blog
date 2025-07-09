'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

type Language = 'vi' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isVietnamese: boolean
  isEnglish: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi')

  useEffect(() => {
    // Try to load language from localStorage
    const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null
    if (stored === 'vi' || stored === 'en') {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang)
    }
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    isVietnamese: language === 'vi',
    isEnglish: language === 'en'
  }), [language, setLanguage])

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
} 