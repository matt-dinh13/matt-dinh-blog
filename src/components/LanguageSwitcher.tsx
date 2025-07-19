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

    // Try to switch to the same page in the new language
    let newPath = window.location.pathname
    if (newPath.startsWith('/vi/')) {
      newPath = '/en' + newPath.slice(3)
    } else if (newPath.startsWith('/en/')) {
      newPath = '/vi' + newPath.slice(3)
    } else if (newPath === '/vi') {
      newPath = '/en'
    } else if (newPath === '/en') {
      newPath = '/vi'
    } else {
      // If not in a language path, default to new language homepage
      newPath = '/' + newLang
    }

    // Check if the new page exists (HEAD request)
    try {
      const res = await fetch(newPath, { method: 'HEAD' })
      if (res.ok) {
        router.push(newPath)
        return
      }
    } catch {}
    // Fallback to homepage in selected language
    router.push('/' + newLang)
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