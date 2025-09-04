"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Save, X } from 'lucide-react'
import Link from 'next/link'
import { logActivity } from '@/lib/logActivity'
import { logger } from '@/lib/logger'

interface CategoryEditFormProps {
  id: string
}

// Removed unused cardTextColor

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
      // Log activity
      await logActivity({
        action: 'update',
        entity: 'category',
        entity_id: id,
        details: { slug, nameEn, nameVi },
        user_id: null,
      });
      router.push('/admin/categories')
    } catch (err: any) {
      setError(err.message || 'Failed to update category')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;
    setSaving(true);
    setError('');
    try {
      const supabase = createClient();
      // Delete translations
      await supabase.from('category_translations').delete().eq('category_id', id);
      // Delete the category itself
      const { error: catError } = await supabase.from('categories').delete().eq('id', id);
      if (catError) throw catError;
      // Log activity
      await logActivity({
        action: 'delete',
        entity: 'category',
        entity_id: id,
        details: { slug, nameEn, nameVi },
        user_id: null,
      });
      router.push('/admin/categories');
    } catch (err) {
      setError('Error deleting category');
      logger.error('Error deleting category', {
        component: 'CategoryEditForm',
        error: err instanceof Error ? err : new Error(String(err)),
        data: { categoryId: id }
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Link 
          href="/admin/categories" 
          className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Categories
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl">
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
                placeholder="e.g. programming"
              />
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">URL-friendly identifier for the category</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Name (English) *</label>
              <input
                type="text"
                value={nameEn}
                onChange={e => setNameEn(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. Programming"
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
                placeholder="e.g. Lập trình"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            href="/admin/categories"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
          >
            <X size={16} className="mr-2" />
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Save size={16} className="mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="inline-flex items-center px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ml-4"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  )
} 