'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

const navTextColor = { color: 'oklch(21% .034 264.665)' };

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { language } = useLanguage()

  const menuItems = [
    { 
      name: language === 'vi' ? 'Blog' : 'Blog', 
      href: '/blog' 
    },
    { 
      name: language === 'vi' ? 'Portfolio' : 'Portfolio', 
      href: '/portfolio' 
    },
    { 
      name: language === 'vi' ? 'Giới thiệu' : 'About', 
      href: '/about' 
    },
    { 
      name: language === 'vi' ? 'Quản trị' : 'Admin', 
      href: '/admin' 
    },
  ]

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo-square.jpg"
              alt="Matt Dinh Blog"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-xl font-bold" style={navTextColor}>
              Matt Dinh
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                style={navTextColor}
                className="font-medium transition-colors duration-200 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 font-medium transition-colors duration-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 