"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Plus, Edit, Trash2 } from 'lucide-react'

type ProjectRow = {
  id: number
  slug: string
  status: string
  published_at: string | null
  created_at: string
  updated_at: string
  thumbnail_url?: string | null
  project_url?: string | null
  github_url?: string | null
  translations?: Array<{ language_code: string, title: string }>
}

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: base, error: baseErr } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (baseErr) {
      setError('Failed to fetch portfolio projects')
      setLoading(false)
      return
    }
    const ids = (base || []).map((p: any) => p.id)
    let translationsById: Record<number, Array<{ language_code: string, title: string }>> = {}
    if (ids.length > 0) {
      const { data: trs, error: trErr } = await supabase
        .from('portfolio_project_translations')
        .select('portfolio_project_id, language_code, title')
        .in('portfolio_project_id', ids)
      if (!trErr && trs) {
        translationsById = trs.reduce((acc: any, t: any) => {
          acc[t.portfolio_project_id] ||= []
          acc[t.portfolio_project_id].push({ language_code: t.language_code, title: t.title })
          return acc
        }, {})
      }
    }
    const rows: ProjectRow[] = (base || []).map((p: any) => ({
      id: p.id,
      slug: p.slug,
      status: p.status,
      published_at: p.published_at,
      created_at: p.created_at,
      updated_at: p.updated_at,
      thumbnail_url: p.thumbnail_url || null,
      project_url: p.project_url || null,
      github_url: p.github_url || null,
      translations: translationsById[p.id] || []
    }))
    setProjects(rows)
    setLoading(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this portfolio project?')) return
    const supabase = createClient()
    const { error: delErr } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', id)
    if (delErr) {
      alert('Failed to delete project')
      return
    }
    fetchProjects()
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="Portfolio" subtitle="Manage portfolio projects">
        <div className="space-y-4">
          <div className="flex items-center justify-end">
            <Link
              href="/admin/portfolio/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              <Plus size={16} className="mr-2" />
              Add Project
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first portfolio project.</p>
              <Link href="/admin/portfolio/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                <Plus size={16} className="mr-2" /> New Project
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 w-16">ID</th>
                      <th className="px-4 py-2">Slug</th>
                      <th className="px-4 py-2 w-24">Status</th>
                      <th className="px-4 py-2 w-24">Published</th>
                      <th className="px-4 py-2 w-24">Created</th>
                      <th className="px-4 py-2 w-24">Updated</th>
                      <th className="px-4 py-2">Translations</th>
                      <th className="px-4 py-2 w-24 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-4 py-2 text-sm text-center">{p.id}</td>
                        <td className="px-4 py-2 text-sm">
                          <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono text-gray-900 dark:text-gray-100 whitespace-nowrap">{p.slug}</code>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${p.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>{p.status}</span>
                        </td>
                        <td className="px-4 py-2 text-sm">{p.published_at ? new Date(p.published_at).toLocaleDateString() : '-'}</td>
                        <td className="px-4 py-2 text-sm">{new Date(p.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-sm">{new Date(p.updated_at).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-sm align-top break-words">
                          <div className="space-y-1">
                            {(p.translations || []).map((tr) => (
                              <div key={tr.language_code} className="flex items-center text-sm">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-2">
                                  {tr.language_code.toUpperCase()}
                                </span>
                                <span className="text-gray-900 dark:text-gray-100 break-words">{tr.title}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <Link href={`/admin/portfolio/edit/${p.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 mr-3">
                            <Edit size={16} className="mr-1" /> Edit
                          </Link>
                          <button onClick={() => handleDelete(p.id)} className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors duration-200">
                            <Trash2 size={16} className="mr-1" /> Delete
                          </button>
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


