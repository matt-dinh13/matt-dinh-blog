'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminLayout from '@/components/AdminLayout'

interface SharedImageItem {
  id: number
  entity_type: 'blog' | 'portfolio'
  entity_id: number
  image_url: string
  original_filename: string
  file_size: number
  uploaded_at: string
  is_active: boolean
  entity_slug?: string | null
  entity_title?: string | null
  public_url?: string | null
  admin_url?: string | null
}

export default function AdminSharedImagesPage() {
  const [items, setItems] = useState<SharedImageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [entityType, setEntityType] = useState<string>('')
  const [entityId, setEntityId] = useState<string>('')
  const [filename, setFilename] = useState<string>('')

  const fetchImages = async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      params.set('scope', 'all')
      if (entityType) params.set('entityType', entityType)
      if (entityId) params.set('entityId', entityId)
      if (filename) params.set('filename', filename)
      const res = await fetch(`/api/shared-images?${params.toString()}`)
      if (!res.ok) throw new Error(`Failed to fetch images (${res.status})`)
      const data = await res.json()
      setItems(data.images || [])
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch images')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (image: SharedImageItem) => {
    if (!confirm('Remove this image from the shared library?')) return
    try {
      const params = new URLSearchParams()
      params.set('entityType', image.entity_type)
      params.set('entityId', String(image.entity_id))
      params.set('imageUrl', image.image_url)
      const res = await fetch(`/api/shared-images?${params.toString()}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to remove image')
      await fetchImages()
    } catch (e: any) {
      alert(e?.message || 'Failed to remove image')
    }
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="Shared Images" subtitle="Manage images used across content.">
        <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Entity Type</label>
                <select className="w-full border rounded px-2 py-1" value={entityType} onChange={e=>setEntityType(e.target.value)}>
                  <option value="">All</option>
                  <option value="blog">Blog</option>
                  <option value="portfolio">Portfolio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Entity ID</label>
                <input className="w-full border rounded px-2 py-1" value={entityId} onChange={e=>setEntityId(e.target.value)} placeholder="e.g. 44" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Filename</label>
                <input className="w-full border rounded px-2 py-1" value={filename} onChange={e=>setFilename(e.target.value)} placeholder="search..." />
              </div>
              <div className="flex items-end">
                <button onClick={fetchImages} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Filter</button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : items.length === 0 ? (
              <div className="text-gray-500">No images found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(img => (
                  <div key={img.id} className="border rounded overflow-hidden bg-white dark:bg-gray-900">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <img src={img.image_url} alt={img.original_filename} className="max-h-40 object-contain" />
                    </div>
                    <div className="p-3 text-sm">
                      <div className="font-mono break-all">{img.original_filename}</div>
                      <div className="text-gray-500">{img.entity_type} #{img.entity_id}</div>
                      {img.entity_slug ? (
                        <div className="text-gray-600 space-x-2">
                          {img.public_url && <a href={img.public_url} target="_blank" className="underline">View</a>}
                          {img.admin_url && <a href={img.admin_url} className="underline">Edit</a>}
                          <span className="text-gray-400">({img.entity_title || img.entity_slug})</span>
                        </div>
                      ) : (
                        <div className="text-gray-400">(unlinked)</div>
                      )}
                      <div className="text-gray-500">{(img.file_size/1024).toFixed(0)} KB</div>
                      <div className="text-gray-500">{new Date(img.uploaded_at).toLocaleString()}</div>
                      <div className="mt-2 flex gap-2">
                        <a href={img.image_url} target="_blank" className="px-3 py-1 border rounded">Open</a>
                        <button onClick={()=>handleDelete(img)} className="px-3 py-1 border rounded text-red-600">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 