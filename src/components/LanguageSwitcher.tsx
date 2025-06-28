'use client'

import { useLanguage } from './LanguageProvider'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <select
      value={language}
      onChange={e => setLanguage(e.target.value as 'vi' | 'en')}
      className="bg-white text-gray-900 px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Select language"
      style={{ minWidth: 120 }}
    >
      <option value="vi">🇻🇳 Tiếng Việt</option>
      <option value="en">🇺🇸 English</option>
    </select>
  )
} 