'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { 
  FileText, 
  FolderOpen, 
  Briefcase, 
  Eye, 
  Calendar,
  Plus,
  Edit,
  ExternalLink
} from 'lucide-react'

const cardTextColor = { color: 'oklch(21% .034 264.665)' }

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: string
  href?: string
}

function StatCard({ title, value, icon, color, href }: StatCardProps) {
  const content = (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1" style={cardTextColor}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href} className="block hover:shadow-md transition-shadow duration-200">{content}</Link>
  }

  return content
}

interface RecentPost {
  id: number
  title: string
  status: string
  created_at: string
  slug: string
  translations?: { language_code: string }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalCategories: 0,
    totalProjects: 0,
    totalViews: 0
  })
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
  const [loading, setLoading] = useState(true)
  const [translationFilter, setTranslationFilter] = useState<'all' | 'missingEN' | 'missingVI' | 'missingBoth'>('all')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const supabase = createClient()
    
    try {
      // Fetch blog posts stats
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id, status, view_count')
      
      // Fetch categories count
      const { data: categories } = await supabase
        .from('categories')
        .select('id')
      
      // Fetch portfolio projects count
      const { data: projects } = await supabase
        .from('portfolio_projects')
        .select('id')
      
      // Fetch recent posts
      const { data: recent } = await supabase
        .from('blog_posts')
        .select(`
          id, 
          slug, 
          status, 
          created_at,
          blog_post_translations(language_code)
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      const totalViews = posts?.reduce((sum: number, post: any) => sum + (post.view_count || 0), 0) || 0
      const publishedPosts = posts?.filter((post: any) => post.status === 'published').length || 0

      setStats({
        totalPosts: posts?.length || 0,
        publishedPosts,
        totalCategories: categories?.length || 0,
        totalProjects: projects?.length || 0,
        totalViews
      })

      // Process recent posts
      const processedPosts = recent?.map((post: any) => ({
        id: post.id,
        title: post.blog_post_translations?.[0]?.title || 'Untitled',
        status: post.status,
        created_at: post.created_at,
        slug: post.slug,
        translations: post.blog_post_translations || []
      })) || []

      setRecentPosts(processedPosts)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter logic
  const filteredPosts = recentPosts.filter(post => {
    const langs = post.translations?.map(t => t.language_code) || []
    if (translationFilter === 'missingEN') return !langs.includes('en')
    if (translationFilter === 'missingVI') return !langs.includes('vi')
    if (translationFilter === 'missingBoth') return !langs.includes('en') && !langs.includes('vi')
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const QUICK_ACTION_BORDER_BASE = 'border-2 border-transparent box-border';
  const QUICK_ACTION_HOVER_BORDER = 'hover:border-blue-600 dark:hover:border-blue-400 hover:bg-transparent dark:hover:bg-transparent';

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to your Admin Dashboard</h2>
        <p className="text-blue-100">Manage your blog posts, categories, and portfolio projects from here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          icon={<FileText size={24} className="text-white" />}
          color="bg-blue-500"
          href="/admin/blog"
        />
        <StatCard
          title="Published Posts"
          value={stats.publishedPosts}
          icon={<Eye size={24} className="text-white" />}
          color="bg-green-500"
          href="/admin/blog"
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon={<FolderOpen size={24} className="text-white" />}
          color="bg-purple-500"
          href="/admin/categories"
        />
        <StatCard
          title="Portfolio Projects"
          value={stats.totalProjects}
          icon={<Briefcase size={24} className="text-white" />}
          color="bg-orange-500"
          href="/admin/portfolio"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4" style={cardTextColor}>Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/blog/new"
            className={`flex items-center p-4 border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-200 ${QUICK_ACTION_BORDER_BASE} ${QUICK_ACTION_HOVER_BORDER}`}
          >
            <Plus size={20} className="text-blue-500 mr-3" />
            <div>
              <p className="font-medium" style={cardTextColor}>New Blog Post</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create a new article</p>
            </div>
          </Link>
          <Link
            href="/admin/categories/new"
            className={`flex items-center p-4 border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-200 ${QUICK_ACTION_BORDER_BASE} ${QUICK_ACTION_HOVER_BORDER}`}
          >
            <FolderOpen size={20} className="text-purple-500 mr-3" />
            <div>
              <p className="font-medium" style={cardTextColor}>New Category</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add a category</p>
            </div>
          </Link>
          <Link
            href="/admin/portfolio/new"
            className={`flex items-center p-4 border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-200 ${QUICK_ACTION_BORDER_BASE} ${QUICK_ACTION_HOVER_BORDER}`}
          >
            <Briefcase size={20} className="text-orange-500 mr-3" />
            <div>
              <p className="font-medium" style={cardTextColor}>New Project</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add portfolio project</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={cardTextColor}>Recent Posts</h3>
          <div className="flex items-center gap-2">
            <select
              value={translationFilter}
              onChange={e => setTranslationFilter(e.target.value as any)}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white dark:bg-gray-900"
            >
              <option value="all">All</option>
              <option value="missingEN">Missing EN</option>
              <option value="missingVI">Missing VI</option>
              <option value="missingBoth">Missing Both</option>
            </select>
            <Link href="/admin/blog" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </Link>
          </div>
        </div>
        {filteredPosts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No posts yet</p>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium" style={cardTextColor}>{post.title}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/blog/edit/${post.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Edit size={16} />
                  </Link>
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                  >
                    <ExternalLink size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={cardTextColor}>Analytics Overview</h3>
          <Link href="/admin/analytics" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View detailed analytics
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalViews}</div>
            <p className="text-gray-600 dark:text-gray-400">Total Views</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.publishedPosts}</div>
            <p className="text-gray-600 dark:text-gray-400">Published Content</p>
          </div>
        </div>
      </div>
    </div>
  )
} 