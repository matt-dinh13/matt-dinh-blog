'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Tags,
  Briefcase, 
  User,
  Settings, 
  Menu,
  X,
  LogOut,
  ChevronRight,
  Search,
  Activity,
  Images
} from 'lucide-react'

const cardTextColor = { color: 'var(--foreground)' }

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Post Management', href: '/admin/posts', icon: FileText },
  { name: 'Category Management', href: '/admin/categories', icon: FolderOpen },
  { name: 'Tag Management', href: '/admin/tags', icon: Tags },
  { name: 'Portfolio Management', href: '/admin/portfolio', icon: Briefcase },
  { name: 'Shared Images', href: '/admin/shared-images', icon: Images },
  { name: 'About Me', href: '/admin/about-me', icon: User },
  { name: 'User Management', href: '/admin/users', icon: User },
  { name: 'Activity Log', href: '/admin/activity-log', icon: Activity },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

const SIDEBAR_WIDTH_EXPANDED = 'w-64';
const SIDEBAR_WIDTH_COLLAPSED = 'w-20';

export default function AdminLayout({ children, title = 'Admin Panel', subtitle }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  const { signOut } = useAuth()
  const router = useRouter()

  // Handle hydration safely
  useEffect(() => {
    setIsClient(true)
    const stored = localStorage.getItem('sidebarCollapsed')
    if (stored === 'true') {
      setSidebarCollapsed(true)
    } else if (stored === 'false') {
      setSidebarCollapsed(false)
    }
  }, [])

  const handleSidebarToggle = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebarCollapsed', String(next))
      }
      return next
    })
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col h-screen
        ${isClient && sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED}`}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between h-16 px-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 ${isClient && sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className={`flex items-center ${isClient && sidebarCollapsed ? 'justify-center w-full' : 'space-x-3'}`}>
            {!(isClient && sidebarCollapsed) && (
              <img
                src="/logo-square.jpg"
                alt="Logo"
                className="rounded w-8 h-8"
              />
            )}
            {!(isClient && sidebarCollapsed) && (
              <span className="text-xl font-bold" style={cardTextColor}>Admin</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Collapse/Expand button (desktop only) */}
            <button
              onClick={handleSidebarToggle}
              className="hidden lg:inline-flex p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            {/* Close button (mobile only) */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-1 py-6 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive =
                (item.href === '/admin' && pathname === '/admin') ||
                (item.href !== '/admin' && (pathname === item.href || pathname.startsWith(item.href + '/')))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center ${isClient && sidebarCollapsed ? 'justify-center' : ''} px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                  title={isClient && sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon 
                    size={20} 
                    className={`mr-3 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'} ${isClient && sidebarCollapsed ? 'mr-0' : ''}`}
                  />
                  {!(isClient && sidebarCollapsed) && item.name}
                  {isActive && !(isClient && sidebarCollapsed) && <ChevronRight size={16} className="ml-auto" />}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User section */}
        <div className={`p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 ${isClient && sidebarCollapsed ? 'justify-center' : ''}`}>
          <button
            onClick={handleSignOut}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 ${isClient && sidebarCollapsed ? 'justify-center' : ''}`}
            title={isClient && sidebarCollapsed ? 'Sign Out' : undefined}
          >
            <LogOut size={20} className={`mr-3 text-gray-400 ${isClient && sidebarCollapsed ? 'mr-0' : ''}`} />
            {!(isClient && sidebarCollapsed) && 'Sign Out'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu size={20} />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-xl font-semibold" style={cardTextColor}>{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                )}
              </div>
            </div>
            {/* Search bar */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Breadcrumbs */}
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex" aria-label="Breadcrumb" data-testid="admin-breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/admin" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    Dashboard
                  </Link>
                </li>
                {isClient && pathname !== '/admin' && pathname !== '/' && (
                  <>
                    <li>
                      <ChevronRight size={16} className="text-gray-400" />
                    </li>
                    <li>
                      <span className="text-gray-500 dark:text-gray-400">
                        {(() => {
                          const currentNavItem = navigation.find(item => 
                            item.href !== '/admin' && pathname.startsWith(item.href)
                          );
                          return currentNavItem?.name || title;
                        })()}
                      </span>
                    </li>
                  </>
                )}
              </ol>
            </nav>
          </div>
        </div>
        {/* Page content */}
        <main className="flex-1 p-2 sm:p-3 lg:p-4">
          {children}
        </main>
      </div>
    </div>
  )
} 