"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase'

const cardTextColor = { color: 'oklch(21% .034 264.665)', fontFamily: 'Inter, system-ui, sans-serif' };

export default function AdminCategoryNewPage() {
  const [slug, setSlug] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [nameVi, setNameVi] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      // Insert category
      const { data: cat, error: catError } = await supabase
        .from('categories')
        .insert({ slug })
        .select('id')
        .single()
      if (catError || !cat) throw catError || new Error('Failed to create category')
      // Insert translations
      const { error: trError } = await supabase
        .from('category_translations')
        .insert([
          { category_id: cat.id, language_code: 'en', name: nameEn },
          { category_id: cat.id, language_code: 'vi', name: nameVi },
        ])
      if (trError) throw trError
      router.push('/admin/categories')
    } catch (err: any) {
      setError(err.message || 'Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
      <Navigation />
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
        <h1 className="text-2xl font-bold mb-6">Add New Category</h1>
        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
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
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Category'}
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
      </main>
      <Footer />
    </div>
  )
} 