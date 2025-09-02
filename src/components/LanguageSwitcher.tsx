'use client'

import { useLanguage } from './LanguageProvider'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt' },
    { code: 'en', flag: '🇺🇸', name: 'English' }
  ]

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  const handleLanguageChange = async (newLang: 'vi' | 'en') => {
    if (newLang === language) return
    setLanguage(newLang)
    setIsOpen(false)

    // Get current pathname
    const currentPath = window.location.pathname
    
    // On homepage, just update language context in-place (no navigation)
    if (currentPath === '/' || currentPath === '/vi' || currentPath === '/en') {
      // No navigation, just update context
      return
    }

    // Handle other pages with language prefixes
    const pathSegments = currentPath.split('/')
    if (pathSegments[1] === 'vi' || pathSegments[1] === 'en') {
      // Replace language prefix
      pathSegments[1] = newLang
      const newPath = pathSegments.join('/')
      router.push(newPath)
    } else {
      // Add language prefix
      router.push('/' + newLang + currentPath)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto flex items-center justify-between min-w-[120px]"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="flex items-center space-x-2">
          <span>{currentLanguage.flag}</span>
          <span>{currentLanguage.name}</span>
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code as 'vi' | 'en')}
              className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2 ${
                language === lang.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 