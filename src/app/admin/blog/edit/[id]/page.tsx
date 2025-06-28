'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'

const cardTextColor = { color: 'oklch(21% .034 264.665)' };

type BlogPost = {
  id: number
  title: string
  summary: string
  content: string
  status: string
}

export default function AdminBlogEditPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('draft')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchPost = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      setPost(data)
      setTitle(data.title)
      setSummary(data.summary || '')
      setContent(data.content)
      setStatus(data.status)
    } catch (err) {
      setError('Error loading blog post')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title,
          summary,
          content,
          status,
          published_at: status === 'published' ? new Date().toISOString() : null
        })
        .eq('id', params.id)

      if (error) throw error

      router.push('/admin')
    } catch (err) {
      setError('Error updating blog post')
      console.error('Error:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
          <Navigation />
          <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </main>
          <footer className="bg-gray-900 text-white">
            <Footer />
          </footer>
        </div>
      </ProtectedRoute>
    )
  }

  if (!post) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
          <Navigation />
          <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
            <div className="text-center">
              <p className="text-red-600">Blog post not found</p>
              <button
                onClick={() => router.push('/admin')}
                className="mt-4 text-blue-600 hover:underline"
              >
                ← Back to Admin
              </button>
            </div>
          </main>
          <footer className="bg-gray-900 text-white">
            <Footer />
          </footer>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold" style={cardTextColor}>Edit Blog Post</h1>
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:underline"
            >
              ← Back
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1" style={cardTextColor}>
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter blog post title"
                />
              </div>

              <div>
                <label htmlFor="summary" className="block text-sm font-medium mb-1" style={cardTextColor}>
                  Summary
                </label>
                <textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief summary of the blog post"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1" style={cardTextColor}>
                  Content *
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Write your blog post content here (supports markdown)"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1" style={cardTextColor}>
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
        <footer className="bg-gray-900 text-white">
          <Footer />
        </footer>
      </div>
    </ProtectedRoute>
  )
} 