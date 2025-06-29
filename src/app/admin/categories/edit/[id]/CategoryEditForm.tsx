"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface CategoryEditFormProps {
  id: string
}

export default function CategoryEditForm({ id }: CategoryEditFormProps) {
  const [slug, setSlug] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [nameVi, setNameVi] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchCategory()
    // eslint-disable-next-line
  }, [id])

  async function fetchCategory() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: cat, error: catError } = await supabase
      .from('categories')
      .select('slug, category_translations(name, language_code)')
      .eq('id', id)
      .single()
    if (catError || !cat) {
      setError('Category not found')
      setLoading(false)
      return
    }
    setSlug(cat.slug)
    setNameEn(cat.category_translations.find((t: any) => t.language_code === 'en')?.name || '')
    setNameVi(cat.category_translations.find((t: any) => t.language_code === 'vi')?.name || '')
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const supabase = createClient()
      // Update category slug
      const { error: catError } = await supabase
        .from('categories')
        .update({ slug })
        .eq('id', id)
      if (catError) throw catError
      // Update or insert translations
      for (const [lang, name] of [['en', nameEn], ['vi', nameVi]]) {
        // Try update first
        const { data: updateData, error: trUpdateError } = await supabase
          .from('category_translations')
          .update({ name })
          .eq('category_id', id)
          .eq('language_code', lang)
          .select('*')
        if (trUpdateError) throw trUpdateError
        if (!updateData || updateData.length === 0) {
          // Insert if not exist
          const { error: trInsertError } = await supabase
            .from('category_translations')
            .insert({ category_id: id, language_code: lang, name })
          if (trInsertError) throw trInsertError
        }
      }
      router.push('/admin/categories')
    } catch (err: any) {
      setError(err.message || 'Failed to update category')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
      ) : error ? (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. programming"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name (English) *</label>
            <input
              type="text"
              value={nameEn}
              onChange={e => setNameEn(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Programming"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name (Vietnamese) *</label>
            <input
              type="text"
              value={nameVi}
              onChange={e => setNameVi(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Lập trình"
            />
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
      )}
    </>
  )
} 