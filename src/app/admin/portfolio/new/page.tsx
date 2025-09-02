"use client"

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { processImageFile, validateImageFile } from '@/lib/imageUtils'
import RichTextEditor from '@/components/RichTextEditor'
import AdminLayout from '@/components/AdminLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { logActivity } from '@/lib/logActivity'

// const cardTextColor = { color: 'var(--foreground)' };

export default function AdminPortfolioNewPage() {
  const [slug, setSlug] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [titleVi, setTitleVi] = useState('')
  const [descEn, setDescEn] = useState('')
  const [descVi, setDescVi] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [thumbnailUrl] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [thumbnailError, setThumbnailError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [projectUrl, setProjectUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi')
  const router = useRouter()

  const hasEn = !!titleEn.trim()
  const hasVi = !!titleVi.trim()
  const canPublish = hasEn && hasVi

  // Generate slug from Vietnamese title (read-only)
  useEffect(() => {
    const vietnameseMap: { [key: string]: string } = {
      'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
      'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
      'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
      'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
      'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
      'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
      'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
      'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
      'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
      'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
      'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
      'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
      'đ': 'd',
      'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
      'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
      'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
      'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
      'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
      'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
      'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
      'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
      'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
      'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
      'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
      'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
      'Đ': 'D'
    }
    let s = titleVi
    for (const [v, e] of Object.entries(vietnameseMap)) {
      s = s.replace(new RegExp(v, 'g'), e)
    }
    s = s.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').trim()
    if (!s) s = 'untitled'
    if (s.length > 100) s = s.substring(0, 100)
    setSlug(s)
  }, [titleVi])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const supabase = createClient()
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
      const resp = await fetch('/api/admin/portfolio/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!resp.ok) {
        const j = await resp.json().catch(() => ({}))
        throw new Error(j?.error || `Failed to create project (${resp.status})`)
      }
      const { id: projectId, slug: finalSlug } = await resp.json()

      await logActivity({
        action: 'create',
        entity: 'portfolio_project',
        entity_id: projectId,
        details: { slug: finalSlug || slug, status, thumbnailUrl: finalThumbnailUrl, projectUrl, githubUrl },
        user_id: null,
      })

      router.push('/admin/portfolio')
    } catch (err: any) {
      setError(err.message || 'Failed to create project')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="New Project" subtitle="Create a new portfolio project">
        <div className="w-full max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

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
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Thumbnail Image</label>
                  <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3 flex items-center gap-4 bg-gray-50 dark:bg-gray-900/30">
                    <input
                      type="file"
                      accept="image/heic,image/jpeg,image/jpg,image/png"
                      onChange={async (e)=>{
                        setThumbnailError('')
                        const file = e.target.files?.[0]
                        if (!file) return
                        const validation = validateImageFile(file)
                        if (!validation.valid) { setThumbnailError(validation.error || 'Invalid file'); return }
                        const res = await processImageFile(file)
                        if (!res.success) { setThumbnailError(res.error || 'Failed to process'); return }
                        if (res.file.size > 3 * 1024 * 1024) { setThumbnailError('Image is too large after processing (max 3MB).'); return }
                        setThumbnailPreview(res.preview)
                      }}
                      disabled={saving}
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex-1"
                      ref={fileInputRef}
                    />
                    {thumbnailPreview && (
                      <div className="relative">
                        <img src={thumbnailPreview} alt="Thumbnail preview" style={{ height: 120, width: 'auto', objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }} />
                        <button type="button" onClick={()=>{ setThumbnailPreview(''); setThumbnailError(''); if (fileInputRef.current) fileInputRef.current.value=''; }} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-xs text-red-600 border border-gray-300 hover:bg-red-100" title="Remove thumbnail">×</button>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Supported: JPG, PNG, HEIC (max ~3MB after processing)</div>
                  {thumbnailError && <div className="text-xs text-red-500 mt-1">{thumbnailError}</div>}
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
                <Save size={16} className="mr-2" /> {saving ? 'Saving...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 