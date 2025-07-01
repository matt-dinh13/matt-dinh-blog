"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Save, X } from 'lucide-react'
import Link from 'next/link'
import { logActivity } from '@/lib/logActivity'

interface TagEditFormProps {
  id: string
}

const cardTextColor = { color: 'oklch(21% .034 264.665)' }

export default function TagEditForm({ id }: TagEditFormProps) {
  const [slug, setSlug] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [nameVi, setNameVi] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchTag()
    // eslint-disable-next-line
  }, [id])

  async function fetchTag() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('slug, tag_translations(name, language_code)')
      .eq('id', id)
      .single()
    if (tagError || !tag) {
      setError('Tag not found')
      setLoading(false)
      return
    }
    setSlug(tag.slug)
    setNameEn(tag.tag_translations.find((t: any) => t.language_code === 'en')?.name || '')
    setNameVi(tag.tag_translations.find((t: any) => t.language_code === 'vi')?.name || '')
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const supabase = createClient()
      // Update tag slug
      const { error: tagError } = await supabase
        .from('tags')
        .update({ slug })
        .eq('id', id)
      if (tagError) throw tagError
      // Update or insert translations
      for (const [lang, name] of [['en', nameEn], ['vi', nameVi]]) {
        // Try update first
        const { data: updateData, error: trUpdateError } = await supabase
          .from('tag_translations')
          .update({ name })
          .eq('tag_id', id)
          .eq('language_code', lang)
          .select('*')
        if (trUpdateError) throw trUpdateError
        if (!updateData || updateData.length === 0) {
          // Insert if not exist
          const { error: trInsertError } = await supabase
            .from('tag_translations')
            .insert({ tag_id: id, language_code: lang, name })
          if (trInsertError) throw trInsertError
        }
      }
      // Log activity
      await logActivity({
        action: 'update',
        entity: 'tag',
        entity_id: id,
        details: { slug, nameEn, nameVi },
        user_id: null,
      });
      router.push('/admin/tags')
    } catch (err: any) {
      setError(err.message || 'Failed to update tag')
    } finally {
      setSaving(false)
    }
  }

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
          href="/admin/tags" 
          className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Tags
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={cardTextColor}>Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. javascript"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">URL-friendly identifier for the tag</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={cardTextColor}>Name (English) *</label>
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
              <label className="block text-sm font-medium mb-2" style={cardTextColor}>Name (Vietnamese) *</label>
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
        </div>
      </form>
    </div>
  )
}
