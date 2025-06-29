'use client'

import { useLanguage } from './LanguageProvider'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <select
      value={language}
      onChange={e => setLanguage(e.target.value as 'vi' | 'en')}
      className="bg-white text-gray-900 px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
      aria-label="Select language"
    >
      <option value="vi">🇻🇳 Tiếng Việt</option>
      <option value="en">🇺🇸 English</option>
    </select>
  )
} 