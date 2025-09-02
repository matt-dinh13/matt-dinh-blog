'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const cardTextColor = { color: 'var(--foreground)' };

type BlogPost = {
  id: number
  title: string
  status: string
  created_at: string
  published_at?: string
  slug: string
  updated_at?: string
}

type PortfolioProject = {
  id: number
  title: string
  status: string
  created_at: string
}

export default function AdminContent() {
  const { signOut } = useAuth()
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()
    
    // Fetch blog posts
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('id, title, status, created_at, published_at, slug, updated_at')
      .order('created_at', { ascending: false })

    // Fetch portfolio projects
    const { data: projects } = await supabase
      .from('portfolio_projects')
      .select('id, title, status, created_at')
      .order('created_at', { ascending: false })

    setBlogPosts(posts || [])
    setPortfolioProjects(projects || [])
    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const handleDelete = async (type: 'blog' | 'portfolio', id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    const supabase = createClient()
    const table = type === 'blog' ? 'blog_posts' : 'portfolio_projects'
    
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting item:', error)
        alert(`Error deleting item: ${error.message}`)
      } else {
        alert('Item deleted successfully')
        fetchData() // Refresh the data
      }
    } catch (err) {
      console.error('Error in delete operation:', err)
      alert('Error deleting item')
    }
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold" style={cardTextColor}>Admin Panel</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Sign Out
        </button>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={cardTextColor}>Blog Posts</h2>
          <Link href="/admin/blog/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium">Add New</Link>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-2 text-left font-medium force-dark font-mono">ID</th>
                <th className="px-4 py-2 text-left font-medium" style={cardTextColor}>Title</th>
                <th className="px-4 py-2 text-left font-medium" style={cardTextColor}>Status</th>
                <th className="px-4 py-2 text-left font-medium force-dark">Published</th>
                <th className="px-4 py-2 text-left font-medium force-dark">Created</th>
                <th className="px-4 py-2 text-left font-medium force-dark">Updated</th>
                <th className="px-4 py-2 text-left font-medium" style={cardTextColor}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center text-gray-500" style={cardTextColor}>
                    No blog posts found
                  </td>
                </tr>
              ) : (
                blogPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-4 py-2 text-sm force-dark font-mono">
                      {post.id}
                    </td>
                    <td className="px-4 py-2" style={cardTextColor}>{post.title}</td>
                    <td className="px-4 py-2" style={cardTextColor}>
                      <span className={`px-2 py-1 rounded text-xs ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm force-dark">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-2 text-sm force-dark">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm force-dark">
                      {post.updated_at ? new Date(post.updated_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-2">
                      <Link href={`/admin/blog/edit/${post.id}`} className="text-blue-600 hover:underline mr-2">Edit</Link>
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline mr-2"
                      >
                        View
                      </a>
                      <button 
                        onClick={() => handleDelete('blog', post.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={cardTextColor}>Portfolio Projects</h2>
          <Link href="/admin/portfolio/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium">Add New</Link>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-2 text-left font-medium" style={cardTextColor}>Project</th>
                <th className="px-4 py-2 text-left font-medium" style={cardTextColor}>Status</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-white">Created</th>
                <th className="px-4 py-2 text-left font-medium" style={cardTextColor}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolioProjects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center text-gray-500" style={cardTextColor}>
                    No portfolio projects found
                  </td>
                </tr>
              ) : (
                portfolioProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-4 py-2" style={cardTextColor}>{project.title}</td>
                    <td className="px-4 py-2" style={cardTextColor}>
                      <span className={`px-2 py-1 rounded text-xs ${
                        project.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      {new Date(project.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <Link href={`/admin/portfolio/edit/${project.id}`} className="text-blue-600 hover:underline mr-2">Edit</Link>
                      <button 
                        onClick={() => handleDelete('portfolio', project.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
} 