'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import RichTextEditor from '@/components/RichTextEditor'
import { logActivity } from '@/lib/logActivity'
import { processImageFile, validateImageFile, cleanupOldThumbnail } from '@/lib/imageUtils'
import { useUnsavedChangesWarning } from '@/components/hooks/useUnsavedChangesWarning'
import { logger } from '@/lib/logger'
// import Breadcrumbs from '@/components/Breadcrumbs'
import { useAutosaveDraft } from '@/components/hooks/useAutosaveDraft'

const cardTextColor = { color: 'oklch(21% .034 264.665)' };

type BlogPost = {
  id: number
  title: string
  summary: string
  content: string
  status: string
  tags?: { id: number; slug: string; name: string }[]
  thumbnail_url?: string
}

// interface BlogPostTranslation {
//   id: number
//   blog_post_id: number
//   language_code: string
//   title: string
//   summary: string
//   content: string
// }

interface AdminBlogEditFormProps {
  id: string
}

export default function AdminBlogEditForm({ id }: AdminBlogEditFormProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [titleVi, setTitleVi] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [contentVi, setContentVi] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [status, setStatus] = useState('draft')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<{ id: number; slug: string; name: string }[]>([])
  const [selectedTags, setSelectedTags] = useState<{ id?: number; slug: string; name: string }[]>([])
  const [tagInput, setTagInput] = useState('')
  const [tagSuggestions, setTagSuggestions] = useState<{ id: number; slug: string; name: string }[]>([])
  // const [translation, setTranslation] = useState<BlogPostTranslation | null>(null)
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi')
  const [success, setSuccess] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
  const [thumbnailError, setThumbnailError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Track initial values for unsaved changes detection
  const initialValuesRef = useRef({
    titleVi: '',
    titleEn: '',
    contentVi: '',
    contentEn: '',
    status: '',
    categoryId: '',
    selectedTags: [] as any[],
    thumbnailPreview: ''
  })

  // Autosave draft (per post id)
  useAutosaveDraft({
    key: `draft:admin-blog-edit:${id}`,
    data: { titleVi, titleEn, contentVi, contentEn, status, categoryId, selectedTags, thumbnailPreview },
    onRestore: (d: any) => {
      setTitleVi(d.titleVi ?? '')
      setTitleEn(d.titleEn ?? '')
      setContentVi(d.contentVi ?? '')
      setContentEn(d.contentEn ?? '')
      setStatus(d.status ?? 'draft')
      setCategoryId(d.categoryId ?? '')
      setSelectedTags(Array.isArray(d.selectedTags) ? d.selectedTags : [])
      setThumbnailPreview(d.thumbnailPreview ?? '')
    },
    debounceMs: 1200,
  })

  const fetchPost = useCallback(async () => {
    try {
      const supabase = createClient()
      // Fetch base post
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()
      if (postError) throw postError
      setPost(postData)
      
      // Fetch all translations
      const { data: translations } = await supabase
        .from('blog_post_translations')
        .select('*')
        .eq('blog_post_id', id)
      
      if (translations) {
        // Find VIE translation
        const vieTranslation = translations.find((t: any) => t.language_code === 'vi')
        // Find ENG translation
        const engTranslation = translations.find((t: any) => t.language_code === 'en')
        
        // Set VIE content
        if (vieTranslation) {
          setTitleVi(vieTranslation.title || '')
          setContentVi(vieTranslation.content || '')
        }
        
        // Set ENG content
        if (engTranslation) {
          setTitleEn(engTranslation.title || '')
          setContentEn(engTranslation.content || '')
        }
        
        // setTranslation(defaultTranslation || null) // This line was commented out in the original file
      }
      
      setStatus(postData.status)
      setCategoryId(postData.category_id ? String(postData.category_id) : '')
    } catch (err) {
      setError('Error loading blog post')
      logger.error('Error loading blog post', {
        component: 'AdminBlogEditForm',
        error: err instanceof Error ? err : new Error(String(err)),
        data: { postId: id }
      })
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  // After loading post, set initial values
  useEffect(() => {
    if (!loading && post) {
      initialValuesRef.current = {
        titleVi,
        titleEn,
        contentVi,
        contentEn,
        status,
        categoryId,
        selectedTags,
        thumbnailPreview
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  // Detect unsaved changes
  const hasUnsavedChanges =
    titleVi !== initialValuesRef.current.titleVi ||
    titleEn !== initialValuesRef.current.titleEn ||
    contentVi !== initialValuesRef.current.contentVi ||
    contentEn !== initialValuesRef.current.contentEn ||
    status !== initialValuesRef.current.status ||
    categoryId !== initialValuesRef.current.categoryId ||
    thumbnailPreview !== initialValuesRef.current.thumbnailPreview ||
    JSON.stringify(selectedTags) !== JSON.stringify(initialValuesRef.current.selectedTags)

  // Use the robust unsaved changes warning hook
  useUnsavedChangesWarning(hasUnsavedChanges)

  // Breadcrumb navigate handler removed; breadcrumbs handled by layout

  // When switching language, update content fields
  const handleLangSwitch = (lang: 'vi' | 'en') => {
    setActiveLang(lang)
  }

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient()
      const { data } = await supabase
        .from('categories')
        .select('id, slug, category_translations(name, language_code)')
        .order('id', { ascending: true })
      setCategories(data || [])
    }
    fetchCategories()
  }, [])

  // Fetch tags with translations
  useEffect(() => {
    async function fetchTags() {
      const supabase = createClient()
      const { data } = await supabase
        .from('tags')
        .select('id, slug, tag_translations(name, language_code)')
      if (data) {
        // Pick translation for current language
        const tagList = data.map((tag: any) => {
          const translation = tag.tag_translations.find((t: any) => t.language_code === 'en')
          return {
            id: tag.id,
            slug: tag.slug,
            name: translation ? translation.name : tag.slug,
          }
        })
        setTags(tagList)
      }
    }
    fetchTags()
  }, [])

  // Fetch post's tags on load
  useEffect(() => {
    async function fetchPostTags() {
      const supabase = createClient()
      const { data } = await supabase
        .from('blog_post_tags')
        .select('tag:tags(id, slug, tag_translations(name, language_code))')
        .eq('blog_post_id', id)
      if (data) {
        const tagList = data.map((row: any) => {
          const tag = row.tag
          const translation = tag.tag_translations.find((t: any) => t.language_code === 'en')
          return {
            id: tag.id,
            slug: tag.slug,
            name: translation ? translation.name : tag.slug,
          }
        })
        setSelectedTags(tagList)
      }
    }
    fetchPostTags()
  }, [id])

  // Tag input suggestions
  useEffect(() => {
    if (!tagInput) {
      setTagSuggestions([])
      return
    }
    const input = tagInput.toLowerCase()
    setTagSuggestions(
      tags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(input) &&
          !selectedTags.some((t) => t.slug === tag.slug)
      ).slice(0, 5)
    )
  }, [tagInput, tags, selectedTags])

  // Add tag
  const handleAddTag = (tag: { id?: number; slug: string; name: string }) => {
    if (selectedTags.length >= 3) return
    setSelectedTags([...selectedTags, tag])
    setTagInput('')
    setTagSuggestions([])
  }

  // Remove tag
  const handleRemoveTag = (slug: string) => {
    setSelectedTags(selectedTags.filter((t) => t.slug !== slug))
  }

  // Handle free text enter
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (selectedTags.length >= 3) return
      // Check if tag exists
      const existing = tags.find(
        (tag) => tag.name.toLowerCase() === tagInput.trim().toLowerCase()
      )
      if (existing) {
        handleAddTag(existing)
      } else {
        // New tag (no id yet)
        handleAddTag({ slug: tagInput.trim().toLowerCase().replace(/\s+/g, '-'), name: tagInput.trim() })
      }
    }
  }

  // On load, set preview if thumbnail_url exists
  useEffect(() => {
    if (post?.thumbnail_url) setThumbnailPreview(post.thumbnail_url);
  }, [post]);

  // Handle thumbnail select (not upload)
  const handleThumbnailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setThumbnailError(validation.error || 'Invalid file');
      return;
    }

    try {
      // Process the image (convert HEIC to JPG, compress, etc.)
      const result = await processImageFile(file);
      
      if (!result.success) {
        setThumbnailError(result.error || 'Failed to process image');
        return;
      }

      // Check final file size
      if (result.file.size > 3 * 1024 * 1024) {
        setThumbnailError('Image is too large after processing (max 3MB).');
        return;
      }

      setThumbnailPreview(result.preview);
      logger.imageUpload('Image processed successfully for blog edit', {
        component: 'AdminBlogEditForm',
        data: {
          originalName: file.name,
          processedName: result.file.name,
          originalSize: file.size,
          processedSize: result.file.size,
          type: result.file.type
        }
      });
      
    } catch (err: unknown) {
      logger.error('Image processing error', {
        component: 'AdminBlogEditForm',
        error: err instanceof Error ? err : new Error(String(err))
      });
              setThumbnailError(`Failed to process image: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailPreview('');
    setThumbnailError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Helper to check if both languages are present
  const hasVi = !!titleVi.trim() && !!contentVi.trim()
  const hasEn = !!titleEn.trim() && !!contentEn.trim()
  const canPublish = hasVi && hasEn

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    setThumbnailError('')
    let uploadedThumbnailUrl = thumbnailPreview; // fallback to existing if not changed
    try {
      if (status === 'published' && !canPublish) {
        setError('Cannot publish: both EN and VI are required.')
        setSaving(false)
        return
      }
      if (thumbnailPreview) {
        // Upload thumbnail to Supabase
        const supabase = createClient()
        
        // Convert data URL back to File object for upload
        const response = await fetch(thumbnailPreview);
        const blob = await response.blob();
        const file = new File([blob], `thumbnail-${Date.now()}.jpg`, { type: 'image/jpeg' });
        
              logger.imageUpload('Uploading thumbnail file to storage', {
        component: 'AdminBlogEditForm',
        data: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        }
      });
      
      const fileName = `thumbnails/${Date.now()}-${file.name}`
      logger.debug('Uploading to storage path', {
        component: 'AdminBlogEditForm',
        data: { fileName }
      });
      
      const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, file, { upsert: true })
      
      if (uploadError) {
        logger.error('Storage upload failed', {
          component: 'AdminBlogEditForm',
          error: uploadError,
          data: { fileName }
        });
          throw new Error(`Storage upload failed: ${uploadError.message} (${uploadError.statusCode})`);
        }
        
        const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName)
        uploadedThumbnailUrl = urlData?.publicUrl
        if (!uploadedThumbnailUrl) throw new Error('Failed to get public URL for thumbnail.')
        
        // Clean up old thumbnail if it exists and is different from the new one
        if (post?.thumbnail_url && post.thumbnail_url !== uploadedThumbnailUrl) {
          logger.imageUpload('Cleaning up old thumbnail', {
            component: 'AdminBlogEditForm',
            data: { oldThumbnailUrl: post.thumbnail_url, newThumbnailUrl: uploadedThumbnailUrl }
          });
          await cleanupOldThumbnail(post.thumbnail_url, supabase);
        }
      }
      if (!uploadedThumbnailUrl) {
        setThumbnailError('Thumbnail is required.')
        setSaving(false)
        return
      }
      // Prepare translations for API call
      const translations = [
        { language_code: 'vi', title: titleVi, summary: '', content: contentVi },
      ]
      if (contentEn.trim() || titleEn.trim()) {
        translations.push({ language_code: 'en', title: titleEn, summary: '', content: contentEn })
      }

      // Call API to update blog post
      const response = await fetch('/api/admin/blog/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: parseInt(id),
          status,
          thumbnail_url: uploadedThumbnailUrl,
          published_at: status === 'published' ? new Date().toISOString() : null,
          category_id: categoryId || null,
          translations
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to update blog post (${response.status})`)
      }

      const supabase = createClient()
      // Upsert tags and translations
      for (const tag of selectedTags) {
        let tagId = tag.id
        if (!tagId) {
          const { data: tagData, error: tagError } = await supabase
            .from('tags')
            .upsert({ slug: tag.slug }, { onConflict: 'slug' })
            .select('id')
            .single()
          if (tagError) throw tagError
          tagId = tagData.id
          const translations = [
            { tag_id: tagId, language_code: 'en', name: tag.name },
            { tag_id: tagId, language_code: 'vi', name: tag.name },
          ]
          for (const tr of translations) {
            await supabase
              .from('tag_translations')
              .upsert(tr, { onConflict: 'tag_id,language_code' })
          }
        }
        await supabase
          .from('blog_post_tags')
          .upsert({ blog_post_id: id, tag_id: tagId }, { onConflict: 'blog_post_id,tag_id' })
      }
      const tagIds = selectedTags.map((t) => t.id).filter(Boolean)
      await supabase
        .from('blog_post_tags')
        .delete()
        .eq('blog_post_id', id)
        .not('tag_id', 'in', `(${tagIds.join(',')})`)
      // Log activity
      await logActivity({
        action: 'update',
        entity: 'blog_post',
        entity_id: id,
        details: {
          titleVi,
          titleEn,
          status,
          categoryId,
          tags: selectedTags.map(t => t.slug),
        },
      });
      setSuccess('Article saved successfully!')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err: any) {
      setError('Error updating blog post')
      setThumbnailError(err?.message || 'Unknown error')
      logger.error('Error updating blog post', {
        component: 'AdminBlogEditForm',
        error: err instanceof Error ? err : new Error(String(err)),
        data: { postId: id }
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) return;
    setSaving(true);
    setError('');
    try {
      const supabase = createClient();
      
      // Clean up thumbnail file if it exists
      if (post?.thumbnail_url) {
        logger.imageUpload('Cleaning up thumbnail for deleted post', {
          component: 'AdminBlogEditForm',
          data: { thumbnailUrl: post.thumbnail_url, postId: id }
        });
        await cleanupOldThumbnail(post.thumbnail_url, supabase);
      }
      
      // Delete translations
      await supabase.from('blog_post_translations').delete().eq('blog_post_id', id);
      // Delete tags relation
      await supabase.from('blog_post_tags').delete().eq('blog_post_id', id);
      // Delete the post itself
      const { error: postError } = await supabase.from('blog_posts').delete().eq('id', id);
      if (postError) throw postError;
      // Log activity
      await logActivity({
        action: 'delete',
        entity: 'blog_post',
        entity_id: id,
        details: { titleVi, titleEn },
      });
      router.push('/admin/posts');
    } catch (err) {
      setError('Error deleting blog post');
      logger.error('Error updating blog post', {
        component: 'AdminBlogEditForm',
        error: err instanceof Error ? err : new Error(String(err)),
        data: { postId: id }
      });
    } finally {
      setSaving(false);
    }
  };

  // Helper to wrap navigation with unsaved changes check
  const confirmAndNavigate = (callback: () => void) => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave this page?')) {
        callback()
      }
    } else {
      callback()
    }
  }

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center">
        <p className="text-red-600">Blog post not found</p>
        <button
          onClick={() => router.push('/admin')}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Back to Admin
        </button>
      </div>
    )
  }

  // Breadcrumbs data removed; handled by AdminLayout

  return (
    <>
      {/* Breadcrumbs and duplicated title removed (shown by AdminLayout header) */}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 w-full max-w-[1900px] mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex gap-2 mb-4">
              <button type="button" className={`px-2 py-1 rounded ${activeLang === 'vi' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`} onClick={() => handleLangSwitch('vi')}>
                🇻🇳 VN
              </button>
              <button type="button" className={`px-2 py-1 rounded ${activeLang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`} onClick={() => handleLangSwitch('en')}>
                🇺🇸 EN
              </button>
            </div>
            <label htmlFor="title" className="block text-sm font-medium mb-1" style={cardTextColor}>
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={activeLang === 'vi' ? titleVi : titleEn}
              onChange={e => activeLang === 'vi' ? setTitleVi(e.target.value) : setTitleEn(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              placeholder={activeLang === 'vi' ? 'Tiêu đề bài viết (VN)' : 'Blog post title (EN)'}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-900" htmlFor="thumbnail">Thumbnail Image <span className="text-red-500">*</span></label>
            <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center gap-4 bg-gray-50">
              <input
                type="file"
                id="thumbnail"
                accept="image/heic,image/jpeg,image/jpg,image/png"
                onChange={handleThumbnailSelect}
                disabled={saving}
                className="bg-white text-gray-900 flex-1"
                ref={fileInputRef}
              />
              {thumbnailPreview && (
                <div className="relative">
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    width={200}
                    height={120}
                    style={{ height: 120, width: 'auto', objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }}
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-xs text-red-600 border border-gray-300 hover:bg-red-100"
                    title="Remove thumbnail"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Supported formats: JPG, PNG, HEIC (some HEIC files may not be supported - convert to JPG/PNG if needed)
            </div>
            {thumbnailError && <div className="text-xs text-red-500 mt-1">{thumbnailError}</div>}
          </div>

          <div className="mt-4">
            <label htmlFor="content" className="block text-sm font-medium mb-1" style={cardTextColor}>
              Content *
            </label>
            <RichTextEditor
              value={activeLang === 'vi' ? contentVi : contentEn}
              onChange={md => activeLang === 'vi' ? setContentVi(md) : setContentEn(md)}
              language={activeLang}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md"
              blogPostId={parseInt(id)}
              enableSharedImages={true}
              showSharedImagesLibrary={true} // Show for both languages
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1" style={cardTextColor}>
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1" style={cardTextColor}>
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_translations.find((t: any) => t.language_code === 'en')?.name || cat.slug}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="hashtags" className="block text-sm font-medium mb-1" style={cardTextColor}>
              Hashtags (max 3)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tag) => (
                <span key={tag.slug} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                  #{tag.name}
                  <button type="button" className="ml-1 text-red-500" onClick={() => handleRemoveTag(tag.slug)}>&times;</button>
                </span>
              ))}
            </div>
            <input
              id="hashtags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              placeholder="Add a hashtag (press Enter)"
              disabled={selectedTags.length >= 3}
            />
            {tagSuggestions.length > 0 && (
              <ul className="border border-gray-200 rounded mt-1 bg-white z-10 absolute">
                {tagSuggestions.map((tag) => (
                  <li
                    key={tag.slug}
                    className="px-3 py-1 cursor-pointer hover:bg-blue-100"
                    onClick={() => handleAddTag(tag)}
                  >
                    #{tag.name}
                  </li>
                ))}
              </ul>
            )}
            {selectedTags.length >= 3 && (
              <div className="text-xs text-red-500 mt-1">You can only add up to 3 hashtags.</div>
            )}
          </div>

          <div className="flex gap-4 pt-4 items-center">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={e => {
                if (status === 'published' && !canPublish) {
                  e.preventDefault()
                }
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {/* Warning if trying to publish without both languages */}
            {status === 'published' && !canPublish && (
              <div className="ml-4 text-sm text-red-600 font-semibold">
                {!hasEn && !hasVi
                  ? 'Bài viết này chưa có cả tiếng Anh và tiếng Việt.'
                  : !hasEn
                  ? 'Bài viết này không có tiếng Anh.'
                  : 'The article does not have VN version.'}
              </div>
            )}
            <button
              type="button"
              onClick={() => confirmAndNavigate(() => router.back())}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              {saving ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
} 