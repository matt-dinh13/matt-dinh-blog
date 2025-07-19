'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import Cookies from 'js-cookie'

export type Language = 'vi' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isVietnamese: boolean
  isEnglish: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Helper to get language from cookie (SSR/CSR)
export function getLanguageFromCookie(): Language {
  if (typeof window === 'undefined') {
    // SSR: fallback to default
    return 'vi'
  } else {
    // CSR
    const lang = Cookies.get('lang')
    return lang === 'en' ? 'en' : 'vi'
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const lang = Cookies.get('lang')
      return lang === 'en' ? 'en' : 'vi'
    }
    return 'vi'
  })

  useEffect(() => {
    // On mount, sync language from cookie
    const lang = Cookies.get('lang')
    if (lang === 'en' || lang === 'vi') {
      setLanguageState(lang)
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    Cookies.set('lang', lang, { expires: 365 }) // 1 year
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
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 