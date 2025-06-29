'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo, useCallback } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import SearchBar from './SearchBar'

const NAV_TEXT_COLOR = { color: 'oklch(21% .034 264.665)' }

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { language } = useLanguage()

  // Memoize menuItems based on language
  const menuItems = useMemo(() => [
    { name: language === 'vi' ? 'Blog' : 'Blog', href: '/blog' },
    { name: language === 'vi' ? 'Portfolio' : 'Portfolio', href: '/portfolio' },
    { name: language === 'vi' ? 'Giới thiệu' : 'About', href: '/about' },
    { name: language === 'vi' ? 'Quản trị' : 'Admin', href: '/admin' },
  ], [language])

  // Memoize handlers
  const handleMenuToggle = useCallback(() => setIsMenuOpen(open => !open), [])
  const handleMenuClose = useCallback(() => setIsMenuOpen(false), [])
  const handleSearchToggle = useCallback(() => setIsSearchOpen(open => !open), [])

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
            <span className="text-xl font-bold" style={NAV_TEXT_COLOR}>
              Matt Dinh
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Search Icon - Desktop */}
            {!isSearchOpen && (
              <button
                onClick={handleSearchToggle}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Toggle search"
              >
                <Search size={20} />
              </button>
            )}
            
            {/* Inline Search Field - Desktop */}
            {isSearchOpen && (
              <div className="w-64">
                <SearchBar />
              </div>
            )}
            
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                style={NAV_TEXT_COLOR}
                className="font-medium transition-colors duration-200 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Search Icon - Mobile */}
            {!isSearchOpen && (
              <button
                onClick={handleSearchToggle}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Toggle search"
              >
                <Search size={20} />
              </button>
            )}
            
            <button
              onClick={handleMenuToggle}
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
              {/* Inline Search Field - Mobile */}
              {isSearchOpen && (
                <div className="px-3 py-2">
                  <SearchBar />
                </div>
              )}
              
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 font-medium transition-colors duration-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={handleMenuClose}
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