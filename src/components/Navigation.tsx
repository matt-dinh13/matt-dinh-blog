'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo, useCallback, memo } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import SearchBar from './SearchBar'

const NAV_TEXT_COLOR = { color: 'oklch(21% .034 264.665)' }
const NAV_BORDER_BASE = 'border-2 border-transparent box-border';
const NAV_HOVER_BORDER = 'hover:border-blue-600 dark:hover:border-blue-400 hover:bg-transparent dark:hover:bg-transparent';

// Memoized menu item component
const MenuItem = memo(({ item, onClick }: { item: { name: string; href: string }; onClick?: () => void }) => (
  <Link
    href={item.href}
    style={NAV_TEXT_COLOR}
    className={`flex items-center justify-center h-10 px-3 font-medium transition-colors duration-200 rounded-md whitespace-nowrap ${NAV_BORDER_BASE} ${NAV_HOVER_BORDER}`}
    onClick={onClick}
  >
    {item.name}
  </Link>
))

MenuItem.displayName = 'MenuItem'

// Memoized mobile menu item component
const MobileMenuItem = memo(({ item, onClick }: { item: { name: string; href: string }; onClick: () => void }) => (
  <Link
    href={item.href}
    className={`block px-3 py-2 font-medium transition-colors duration-200 rounded-md ${NAV_BORDER_BASE} ${NAV_HOVER_BORDER}`}
    style={NAV_TEXT_COLOR}
    onClick={onClick}
  >
    {item.name}
  </Link>
))

MobileMenuItem.displayName = 'MobileMenuItem'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { language } = useLanguage()

  // Memoize menuItems based on language
  const menuItems = useMemo(() => [
    { name: language === 'vi' ? 'Blog' : 'Blog', href: '/blog' },
    { name: language === 'vi' ? 'Portfolio' : 'Portfolio', href: '/portfolio' },
    { name: language === 'vi' ? 'Giới thiệu' : 'About', href: '/about' },
  ], [language])

  // Memoize handlers
  const handleMenuToggle = useCallback(() => setIsMenuOpen(open => !open), [])
  const handleMenuClose = useCallback(() => setIsMenuOpen(false), [])
  const handleSearchToggle = useCallback(() => setIsSearchOpen(open => !open), [])

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Fixed width to prevent layout shifts */}
          <Link href="/" className="flex items-center space-x-3 flex-shrink-0 min-w-0">
            <Image
              src="/logo-square.jpg"
              alt="Matt Dinh Blog"
              width={40}
              height={40}
              className="rounded-lg flex-shrink-0"
            />
            <span className="text-xl font-bold truncate" style={NAV_TEXT_COLOR}>
              Matt Dinh
            </span>
          </Link>

          {/* Desktop Navigation Links + Search - Right section */}
          <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
            {/* Search button/field first */}
            {!isSearchOpen && (
              <button
                onClick={handleSearchToggle}
                className="flex items-center justify-center w-10 h-10 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 flex-shrink-0"
                aria-label="Toggle search"
              >
                <Search size={20} />
              </button>
            )}
            {isSearchOpen && (
              <div className="flex-1 max-w-xs">
                <SearchBar compact={true} />
              </div>
            )}
            {/* Then nav links in order */}
            {menuItems.map((item) => (
              <MenuItem key={item.name} item={item} />
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2 flex-shrink-0">
            {/* Search Icon - Mobile */}
            {!isSearchOpen && (
              <button
                onClick={handleSearchToggle}
                className="flex items-center justify-center w-10 h-10 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Toggle search"
              >
                <Search size={20} />
              </button>
            )}
            
            <button
              onClick={handleMenuToggle}
              className="flex items-center justify-center w-10 h-10 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
                  <SearchBar compact={true} />
                </div>
              )}
              
              {menuItems.map((item) => (
                <MobileMenuItem key={item.name} item={item} onClick={handleMenuClose} />
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 