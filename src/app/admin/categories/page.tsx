"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Plus, Edit, Trash2 } from 'lucide-react'

const cardTextColor = { color: 'oklch(21% .034 264.665)', fontFamily: 'Inter, system-ui, sans-serif' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('id, slug, category_translations(name, language_code)')
      .order('id', { ascending: true })
    if (error) setError('Failed to fetch categories')
    setCategories(data || [])
    setLoading(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this category?')) return
    const supabase = createClient()
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    if (error) {
      alert('Failed to delete category')
    } else {
      fetchCategories()
    }
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="Categories" subtitle="Manage your blog categories">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={cardTextColor}>Categories</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your blog post categories</p>
            </div>
            <Link 
              href="/admin/categories/new" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              <Plus size={16} className="mr-2" />
              Add Category
            </Link>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2" style={cardTextColor}>No categories found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first category.</p>
              <Link 
                href="/admin/categories/new" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                <Plus size={16} className="mr-2" />
                Create Category
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Translations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono" style={cardTextColor}>
                            {cat.slug}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {cat.category_translations.map((tr: any) => (
                              <div key={tr.language_code} className="flex items-center text-sm">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-2">
                                  {tr.language_code.toUpperCase()}
                                </span>
                                <span style={cardTextColor}>{tr.name}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <Link 
                              href={`/admin/categories/edit/${cat.id}`}
                              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                            >
                              <Edit size={16} className="mr-1" />
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleDelete(cat.id)}
                              className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors duration-200"
                            >
                              <Trash2 size={16} className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
