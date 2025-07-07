'use client'

import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
        <Link href="/admin/blog/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">+ New Post</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-4 py-2 text-sm force-dark">{post.id}</td>
                  <td className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400">
                    <Link href={`/blog/${post.slug}`} target="_blank" className="hover:underline">{post.slug}</Link>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{post.status}</span>
                  </td>
                  <td className="px-4 py-2 text-sm force-dark">{post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2 text-sm force-dark">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-sm force-dark">{new Date(post.updated_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right">
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