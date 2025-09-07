"use client"

import { use, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import AdminLayout from '@/components/AdminLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { logActivity } from '@/lib/logActivity'
import RichTextEditor from '@/components/RichTextEditor'
import { processImageFile, validateImageFile } from '@/lib/imageUtils'

type Props = { params: Promise<{ id: string }> }

export default function AdminPortfolioEditPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [slug, setSlug] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [titleVi, setTitleVi] = useState('')
  const [descEn, setDescEn] = useState('')
  const [descVi, setDescVi] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [thumbnailError, setThumbnailError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [projectUrl, setProjectUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi')

  useEffect(() => {
    async function load() {
      setError('')
      setLoading(true)
      try {
        const { data: project, error: pErr } = await supabase
          .from('portfolio_projects')
          .select('id, slug, status, thumbnail_url, project_url, github_url, portfolio_project_translations ( language_code, title, description )')
          .eq('id', id)
          .single()
        if (pErr) throw pErr
        setSlug(project.slug || '')
        setStatus((project.status as any) || 'draft')
        setThumbnailUrl(project.thumbnail_url || '')
        setProjectUrl(project.project_url || '')
        setGithubUrl(project.github_url || '')
        const en = project.portfolio_project_translations?.find((t: any) => t.language_code==='en')
        const vi = project.portfolio_project_translations?.find((t: any) => t.language_code==='vi')
        setTitleEn(en?.title || '')
        setDescEn(en?.description || '')
        setTitleVi(vi?.title || '')
        setDescVi(vi?.description || '')
      } catch (e: any) {
        setError(e?.message || 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const canPublish = !!titleVi.trim() && !!titleEn.trim()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailError('')
    const file = e.target.files?.[0]
    if (!file) return
    const validation = validateImageFile(file)
    if (!validation.valid) { setThumbnailError(validation.error || 'Invalid file'); return }
    const res = await processImageFile(file)
    if (!res.success) { setThumbnailError(res.error || 'Failed to process'); return }
    if (res.file.size > 3 * 1024 * 1024) { setThumbnailError('Image is too large after processing (max 3MB).'); return }
    setThumbnailPreview(res.preview)
  }

  const handleRemoveThumbnail = () => {
    setThumbnailPreview('')
    setThumbnailError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      let finalThumbnailUrl = thumbnailUrl
      if (thumbnailPreview) {
        const response = await fetch(thumbnailPreview)
        const blob = await response.blob()
        const file = new File([blob], `portfolio-thumb-${Date.now()}.jpg`, { type: 'image/jpeg' })
        const path = `thumbnails/${Date.now()}-${file.name}`
        const { error: uploadErr } = await supabase.storage.from('blog-images').upload(path, file, { upsert: true })
        if (uploadErr) throw uploadErr
        const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(path)
        finalThumbnailUrl = urlData?.publicUrl || ''
      }

      const payload = {
        id: Number(id),
        slug,
        status,
        thumbnail_url: finalThumbnailUrl || null,
        project_url: projectUrl || null,
        github_url: githubUrl || null,
        published_at: status === 'published' ? new Date().toISOString() : null,
        translations: [
          { language_code: 'en', title: titleEn, description: descEn },
          { language_code: 'vi', title: titleVi, description: descVi },
        ]
      }
      const resp = await fetch('/api/admin/portfolio/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!resp.ok) {
        const j = await resp.json().catch(() => ({}))
        throw new Error(j?.error || `Failed to update project (${resp.status})`)
      }

      await logActivity({
        action: 'update',
        entity: 'portfolio_project',
        entity_id: String(id),
        details: { slug, status, projectUrl, githubUrl },
        user_id: null,
      })
      router.push('/admin/portfolio')
    } catch (err: any) {
      setError(err?.message || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <ProtectedRoute>
      <AdminLayout title="Edit Project" subtitle={`Update portfolio project #${id}`}>
        <div className="w-full max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-gray-600 dark:text-gray-300">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-[1900px] mx-auto px-3 sm:px-4 lg:px-6 py-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex gap-2 mb-6">
                  <button type="button" className={`px-3 py-2 rounded-md font-medium transition-colors ${activeLang === 'vi' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`} onClick={() => setActiveLang('vi')}>
                    🇻🇳 VN
                  </button>
                  <button type="button" className={`px-3 py-2 rounded-md font-medium transition-colors ${activeLang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`} onClick={() => setActiveLang('en')}>
                    🇺🇸 EN
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Title *</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" value={activeLang === 'vi' ? titleVi : titleEn} onChange={e=> activeLang==='vi' ? setTitleVi(e.target.value) : setTitleEn(e.target.value)} required />
                      {titleVi && (
                        <div className="mt-1 text-xs text-gray-500">URL preview (VI): <span className="font-mono">/portfolio/{slug}</span></div>
                      )}
                      {titleEn && (
                        <div className="mt-1 text-xs text-gray-500">URL preview (EN): <span className="font-mono">/portfolio/{titleEn.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').trim() || 'untitled'}</span></div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Thumbnail</label>
                      <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3 flex items-center gap-4 bg-gray-50 dark:bg-gray-900/30">
                        <input type="file" accept="image/heic,image/jpeg,image/jpg,image/png" onChange={handleFileChange} disabled={saving} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex-1" ref={fileInputRef} />
                        {(thumbnailPreview || thumbnailUrl) && (
                          <div className="relative">
                            <img src={thumbnailPreview || thumbnailUrl} alt="Thumbnail preview" style={{ height: 120, width: 'auto', objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }} />
                            {thumbnailPreview && (
                              <button type="button" onClick={handleRemoveThumbnail} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-xs text-red-600 border border-gray-300 hover:bg-red-100" title="Remove thumbnail">×</button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Supported: JPG, PNG, HEIC (max ~3MB after processing)</div>
                      {thumbnailError && <div className="text-xs text-red-500 mt-1">{thumbnailError}</div>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100 text-center">Description ({activeLang.toUpperCase()})</label>
                    <div className="max-w-6xl mx-auto">
                      <RichTextEditor
                        value={activeLang === 'vi' ? descVi : descEn}
                        onChange={md => activeLang === 'vi' ? setDescVi(md) : setDescEn(md)}
                        language={activeLang}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md min-h-[500px]"
                        enableSharedImages={true}
                        showSharedImagesLibrary={true}
                        entityType="portfolio"
                        entityId={Number(id)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Project URL</label>
                      <input type="url" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" value={projectUrl} onChange={e=>setProjectUrl(e.target.value)} placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">GitHub URL</label>
                      <input type="url" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" value={githubUrl} onChange={e=>setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Status</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" value={status} onChange={e=>setStatus(e.target.value as any)}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                    {status === 'published' && !canPublish && (
                      <div className="mt-2 text-sm text-red-600 font-semibold">Please provide titles in both EN and VI before publishing.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/admin/portfolio" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200">
                  <ArrowLeft size={16} className="mr-2" /> Cancel
                </Link>
                <button type="submit" disabled={saving || (status==='published' && !canPublish)} className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                  <Save size={16} className="mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 