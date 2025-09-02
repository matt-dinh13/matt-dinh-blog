"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { logActivity } from '@/lib/logActivity'

// Removed unused cardTextColor

export default function NewTagPage() {
  const [slug, setSlug] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [nameVi, setNameVi] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const supabase = createClient()
      // Insert tag
      const { data: tag, error: tagError } = await supabase
        .from('tags')
        .insert({ slug })
        .select('id')
        .single()
      if (tagError) throw tagError
      // Insert translations
      for (const [lang, name] of [['en', nameEn], ['vi', nameVi]]) {
        const { error: trError } = await supabase
          .from('tag_translations')
          .insert({ tag_id: tag.id, language_code: lang, name })
        if (trError) throw trError
      }
      // Log activity
      await logActivity({
        action: 'create',
        entity: 'tag',
        entity_id: tag.id,
        details: { slug, nameEn, nameVi },
        user_id: null,
      })
      router.push('/admin/tags')
    } catch (err: any) {
      setError(err.message || 'Failed to create tag')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="New Tag" subtitle="Create a new blog tag">
        <div className="w-full max-w-3xl">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Slug *</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g. javascript"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">URL-friendly identifier for the tag</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Name (English) *</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={e => setNameEn(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g. JavaScript"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Name (Vietnamese) *</label>
                  <input
                    type="text"
                    value={nameVi}
                    onChange={e => setNameVi(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g. JavaScript"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/admin/tags"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Tags
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Save size={16} className="mr-2" />
                {saving ? 'Creating...' : 'Create Tag'}
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
