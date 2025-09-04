'use client'

import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { logger } from '@/lib/logger'

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, slug, status, published_at, created_at, updated_at')
        .order('created_at', { ascending: false })
      if (error) setError(error.message)
      else setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <AdminLayout title="Post Management" subtitle="Manage all blog posts here.">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">All Blog Posts</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={async () => {
              if (selectedIds.length === 0) return
              try {
                setExporting(true)
                const res = await fetch('/api/export-posts', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ids: selectedIds })
                })
                if (!res.ok) throw new Error('Failed to export')
                const blob = await res.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                const now = new Date()
                const utc7 = new Date(now.getTime() + 7 * 60 * 60 * 1000)
                const y = utc7.getUTCFullYear()
                const m = String(utc7.getUTCMonth() + 1).padStart(2, '0')
                const d = String(utc7.getUTCDate()).padStart(2, '0')
                a.href = url
                a.download = `${y}${m}${d}.zip`
                document.body.appendChild(a)
                a.click()
                a.remove()
                window.URL.revokeObjectURL(url)
              } catch (e) {
                logger.error('Export failed', {
                  component: 'AdminPostsPage',
                  error: e instanceof Error ? e : new Error(String(e))
                })
                alert('Export failed')
              } finally {
                setExporting(false)
              }
            }}
            disabled={selectedIds.length === 0 || exporting}
            className={`inline-flex items-center px-4 py-2 rounded-md transition ${selectedIds.length === 0 || exporting ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
            title="Export selected posts to Markdown (ZIP)"
          >
            <Download size={16} className="mr-2" /> {exporting ? 'Exporting...' : 'Export Selected'}
          </button>
          <Link href="/admin/blog/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">+ New Post</Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 w-10">
                <input
                  type="checkbox"
                  aria-label="Select all on page"
                  checked={posts.length > 0 && selectedIds.length === posts.length}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedIds(posts.map((p) => p.id))
                    else setSelectedIds([])
                  }}
                />
              </th>
              <th className="px-4 py-2 w-14">ID</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2 w-28">Status</th>
              <th className="px-4 py-2 w-28">Published</th>
              <th className="px-4 py-2 w-28">Created</th>
              <th className="px-4 py-2 w-28">Updated</th>
              <th className="px-4 py-2 w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-4 py-2 text-sm">
                    <input
                      type="checkbox"
                      aria-label={`Select post ${post.id}`}
                      checked={selectedIds.includes(post.id)}
                      onChange={(e) => {
                        setSelectedIds((prev) =>
                          e.target.checked ? Array.from(new Set([...prev, post.id])) : prev.filter((id) => id !== post.id)
                        )
                      }}
                    />
                  </td>
                  <td className="px-4 py-2 text-sm force-dark w-14 text-center whitespace-nowrap">{post.id}</td>
                  <td className="px-4 py-2 text-sm whitespace-nowrap">
                    <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      <Link href={`/blog/${post.slug}`} target="_blank" className="hover:underline">{post.slug}</Link>
                    </code>
                  </td>
                  <td className="px-4 py-2 text-sm whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${post.status === 'published' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>{post.status}</span>
                  </td>
                  <td className="px-4 py-2 text-sm force-dark whitespace-nowrap">{post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2 text-sm force-dark whitespace-nowrap">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-sm force-dark whitespace-nowrap">{new Date(post.updated_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <Link href={`/admin/blog/edit/${post.id}`} className="text-blue-600 hover:underline mr-2">Edit</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">No blog posts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {error && <div className="text-red-500 mt-4">Error loading posts: {error}</div>}
    </AdminLayout>
  )
} 