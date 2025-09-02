"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Plus, Edit, Trash2, Download } from 'lucide-react'

const cardTextColor = { color: 'var(--foreground)', fontFamily: 'Inter, system-ui, sans-serif' };

export default function AdminTagsPage() {
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTags, setSelectedTags] = useState<number[]>([])

  useEffect(() => {
    fetchTags()
  }, [])

  async function fetchTags() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tags')
      .select('id, slug, tag_translations(name, language_code)')
      .order('id', { ascending: true })
    if (error) setError('Failed to fetch tags')
    setTags(data || [])
    setLoading(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this tag?')) return
    const supabase = createClient()
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)
    if (error) {
      alert('Failed to delete tag')
    } else {
      fetchTags()
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Are you sure you want to delete ${selectedTags.length} tags?`)) return
    const supabase = createClient()
    const { error } = await supabase
      .from('tags')
      .delete()
      .in('id', selectedTags)
    if (error) {
      alert('Failed to delete tags')
    } else {
      setSelectedTags([])
      fetchTags()
    }
  }

  async function handleExport() {
    const data = tags.map(tag => ({
      slug: tag.slug,
      translations: tag.tag_translations.reduce((acc: any, tr: any) => {
        acc[tr.language_code] = tr.name
        return acc
      }, {})
    }))
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tags-export.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSelectAll = () => {
    if (selectedTags.length === tags.length) {
      setSelectedTags([])
    } else {
      setSelectedTags(tags.map(tag => tag.id))
    }
  }

  const handleSelectTag = (id: number) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter(tagId => tagId !== id))
    } else {
      setSelectedTags([...selectedTags, id])
    }
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="Tag Management" subtitle="Manage your blog tags">
        <div className="space-y-4">
          {/* Actions */}
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
              >
                <Download size={16} className="mr-2" />
                Export
              </button>
              <Link 
                href="/admin/tags/new" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                <Plus size={16} className="mr-2" />
                Add Tag
              </Link>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedTags.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 dark:text-blue-200">
                  {selectedTags.length} tag(s) selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm"
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : tags.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2" style={cardTextColor}>No tags found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first tag.</p>
              <Link 
                href="/admin/tags/new" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                <Plus size={16} className="mr-2" />
                Create Tag
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="w-10 px-4 py-2 text-left">
                        <input
                          type="checkbox"
                          checked={selectedTags.length === tags.length && tags.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="w-1/3 px-4 py-2">
                        Slug
                      </th>
                      <th className="w-1/2 px-4 py-2">
                        Translations
                      </th>
                      <th className="w-1/6 px-4 py-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tags.map((tag) => (
                      <tr key={tag.id} className="transition-colors duration-200">
                        <td className="px-4 py-2 whitespace-nowrap align-top">
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag.id)}
                            onChange={() => handleSelectTag(tag.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap align-top">
                          <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono text-gray-900 dark:text-gray-100">
                            {tag.slug}
                          </code>
                        </td>
                        <td className="px-4 py-2 align-top">
                          <div className="space-y-1">
                            {tag.tag_translations.map((tr: any) => (
                              <div key={tr.language_code} className="flex items-center text-sm">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mr-2">
                                  {tr.language_code.toUpperCase()}
                                </span>
                                <span className="text-gray-900 dark:text-gray-100">{tr.name}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium align-top">
                          <div className="flex items-center space-x-3">
                            <Link 
                              href={`/admin/tags/edit/${tag.id}`}
                              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                            >
                              <Edit size={16} className="mr-1" />
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleDelete(tag.id)}
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