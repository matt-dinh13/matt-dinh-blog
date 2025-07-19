'use client'

import { useLanguage } from './LanguageProvider'
import { useRouter } from 'next/navigation'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'vi' | 'en'
    if (newLang === language) return
    setLanguage(newLang)

    // Get current pathname
    const currentPath = window.location.pathname
    
    // Handle homepage routing
    if (currentPath === '/' || currentPath === '/vi' || currentPath === '/en') {
      // For homepage, just switch to the new language homepage
      router.push('/' + newLang)
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

  return (
    <select
      value={language}
      onChange={handleChange}
      className="bg-white text-gray-900 px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
      aria-label="Select language"
    >
      <option value="vi">🇻🇳 Tiếng Việt</option>
      <option value="en">🇺🇸 English</option>
    </select>
  )
} 