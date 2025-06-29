"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={cardTextColor}>
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={cardTextColor}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Manage Categories</h1>
          <Link href="/admin/categories/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium">Add New</Link>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400">{error}</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">No categories found.</div>
        ) : (
          <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-3 text-left">Slug</th>
                <th className="p-3 text-left">Translations</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-3 font-mono">{cat.slug}</td>
                  <td className="p-3">
                    {cat.category_translations.map((tr: any) => (
                      <div key={tr.language_code} className="text-sm">
                        <span className="font-semibold">[{tr.language_code}]</span> {tr.name}
                      </div>
                    ))}
                  </td>
                  <td className="p-3 space-x-2">
                    <Link href={`/admin/categories/edit/${cat.id}`} className="text-blue-600 hover:underline">Edit</Link>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <Footer />
    </div>
  )
} 