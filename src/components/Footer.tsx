import LanguageSwitcher from './LanguageSwitcher'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-8 pb-4">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">Matt Dinh</span>
            <span className="font-normal text-gray-400">• Personal Blog</span>
            <LanguageSwitcher />
          </div>
          <div className="text-sm text-gray-400">© 2024 Matt Dinh. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
} 