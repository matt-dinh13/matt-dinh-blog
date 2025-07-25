'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import RichTextEditor from '@/components/RichTextEditor'
import { logActivity } from '@/lib/logActivity'
import { processImageFile, validateImageFile } from '@/lib/imageUtils'
import { useUnsavedChangesWarning } from '@/components/hooks/useUnsavedChangesWarning'

// Force dynamic rendering to prevent static generation issues with Supabase
export const dynamic = 'force-dynamic'

const cardTextColor = { color: 'oklch(21% .034 264.665)' };

export default function AdminBlogNewPage() {
  const [titleVi, setTitleVi] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [contentVi, setContentVi] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [status, setStatus] = useState('draft')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const router = useRouter()
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<{ id: number; slug: string; name: string }[]>([])
  const [selectedTags, setSelectedTags] = useState<{ id?: number; slug: string; name: string }[]>([])
  const [tagInput, setTagInput] = useState('')
  const [tagSuggestions, setTagSuggestions] = useState<{ id: number; slug: string; name: string }[]>([])
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi')
  const [success, setSuccess] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
  const [thumbnailError, setThumbnailError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const initialValuesRef = useRef({
    titleVi: '',
    titleEn: '',
    contentVi: '',
    contentEn: '',
    status: 'draft',
    categoryId: '',
    selectedTags: [],
    thumbnailPreview: ''
  })

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(
      titleVi !== initialValuesRef.current.titleVi ||
      titleEn !== initialValuesRef.current.titleEn ||
      contentVi !== initialValuesRef.current.contentVi ||
      contentEn !== initialValuesRef.current.contentEn ||
      status !== initialValuesRef.current.status ||
      categoryId !== initialValuesRef.current.categoryId ||
      thumbnailPreview !== initialValuesRef.current.thumbnailPreview ||
      JSON.stringify(selectedTags) !== JSON.stringify(initialValuesRef.current.selectedTags)
    )
  }, [titleVi, titleEn, contentVi, contentEn, status, categoryId, thumbnailPreview, selectedTags])

  useUnsavedChangesWarning(hasUnsavedChanges)

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

  const generateSlug = (title: string) => {
    // Vietnamese character mapping to English equivalents
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

    let slug = title
    
    // Replace Vietnamese characters with English equivalents
    for (const [vietnamese, english] of Object.entries(vietnameseMap)) {
      slug = slug.replace(new RegExp(vietnamese, 'g'), english)
    }
    
    // Convert to lowercase and clean up
    slug = slug
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove any remaining special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .trim()
    
    // Handle edge cases
    if (!slug) {
      slug = 'untitled'
    }
    
    // Ensure slug is not too long (max 100 characters)
    if (slug.length > 100) {
      slug = slug.substring(0, 100)
    }
    
    return slug
  }

  // Generate unique slug that doesn't conflict with existing ones
  const generateUniqueSlug = async (title: string) => {
    const baseSlug = generateSlug(title)
    let slug = baseSlug
    let counter = 1
    
    const supabase = createClient()
    
    // Keep checking until we find a unique slug
    while (true) {
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .single()
      
      if (!existingPost) {
        // Slug is unique, return it
        return slug
      }
      
      // Slug exists, try with counter suffix
      slug = `${baseSlug}-${counter}`
      counter++
      
      // Prevent infinite loop (shouldn't happen in practice)
      if (counter > 100) {
        // Fallback: add timestamp to make it unique
        slug = `${baseSlug}-${Date.now()}`
        break
      }
    }
    
    return slug
  }

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
      console.log('Image processed successfully:', {
        originalName: file.name,
        processedName: result.file.name,
        originalSize: file.size,
        processedSize: result.file.size,
        type: result.file.type
      });
      
    } catch (err: any) {
      console.error('Image processing error:', err);
      setThumbnailError(`Failed to process image: ${err.message || 'Unknown error'}`);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailPreview('');
    setThumbnailError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    setThumbnailError('')
    let uploadedThumbnailUrl = ''
    try {
      if (!titleVi.trim()) {
        setError('Vietnamese title is required.')
        setLoading(false)
        return
      }
      
      if (!thumbnailPreview) {
        setThumbnailError('Thumbnail is required.')
        setLoading(false)
        return
      }
      // Upload thumbnail to Supabase
      const supabase = createClient()
      
      // Convert data URL back to File object for upload
      const response = await fetch(thumbnailPreview);
      const blob = await response.blob();
      const file = new File([blob], `thumbnail-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      console.log('Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      
      const fileName = `thumbnails/${Date.now()}-${file.name}`
      console.log('Uploading to path:', fileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, file, { upsert: true })
      
      console.log('Upload response:', { data: uploadData, error: uploadError });
      
      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message} (${uploadError.statusCode})`);
      }
      
      const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName)
      uploadedThumbnailUrl = urlData?.publicUrl
      if (!uploadedThumbnailUrl) throw new Error('Failed to get public URL for thumbnail.')
      
      // Generate unique slug
      const slug = await generateUniqueSlug(titleVi)
      console.log('Generated unique slug:', slug)
      
      // Insert base post
      const { data: postData, error } = await supabase
        .from('blog_posts')
        .insert({
          title: titleVi,
          slug,
          summary: '',
          content: contentVi, // for backward compatibility
          status,
          author_id: user?.id,
          published_at: status === 'published' ? new Date().toISOString() : null,
          category_id: categoryId || null,
          thumbnail_url: uploadedThumbnailUrl
        })
        .select('id')
        .single()
      if (error) {
        console.error('Post creation error:', error)
        if (error.code === '23505' && error.message.includes('blog_posts_slug_key')) {
          throw new Error('A blog post with this title already exists. Please use a different title.')
        }
        throw new Error(`Database error: ${error.message}`)
      }
      const postId = postData.id
      // Upsert translations for VI and EN
      const translations = [
        { blog_post_id: postId, language_code: 'vi', title: titleVi, summary: '', content: contentVi },
      ]
      if (contentEn.trim()) {
        translations.push({ blog_post_id: postId, language_code: 'en', title: titleEn, summary: '', content: contentEn })
      }
      for (const tr of translations) {
        await supabase
          .from('blog_post_translations')
          .upsert(tr, { onConflict: 'blog_post_id,language_code' })
      }
      // Upsert tags and translations
      for (const tag of selectedTags) {
        let tagId = tag.id
        if (!tagId) {
          // Insert tag
          const { data: tagData, error: tagError } = await supabase
            .from('tags')
            .upsert({ slug: tag.slug }, { onConflict: 'slug' })
            .select('id')
            .single()
          if (tagError) throw tagError
          tagId = tagData.id
          // Upsert translations for both EN and VI
          const translations = [
            { tag_id: tagId, language_code: 'en', name: tag.name },
            { tag_id: tagId, language_code: 'vi', name: tag.name }, // TODO: Optionally prompt for VI name
          ]
          for (const tr of translations) {
            await supabase
              .from('tag_translations')
              .upsert(tr, { onConflict: 'tag_id,language_code' })
          }
        }
        // Upsert blog_post_tags
        await supabase
          .from('blog_post_tags')
          .upsert({ blog_post_id: postId, tag_id: tagId }, { onConflict: 'blog_post_id,tag_id' })
      }
      // Log activity
      await logActivity({
        action: 'create',
        entity: 'blog_post',
        entity_id: postId,
        details: {
          titleVi,
          titleEn,
          status,
          categoryId,
          tags: selectedTags.map(t => t.slug),
        },
        user_id: user?.id || null,
      });
      setSuccess('Article created successfully! Redirecting to edit page...')
      setThumbnailPreview('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      
      // Redirect to edit page after a short delay
      setTimeout(() => {
        router.push(`/admin/blog/edit/${postId}`)
      }, 1500)
    } catch (err: any) {
      setError('Error creating blog post')
      setThumbnailError(err?.message || 'Unknown error')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="Add New Blog Post">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12" style={cardTextColor}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Blog Post</h1>
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:underline"
            >
              ← Back
            </button>
          </div>

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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 w-full max-w-[1574px] mx-auto">
            {/* Language Switcher - Moved to top */}
            <div className="flex gap-2 mb-6">
              <button type="button" className={`px-3 py-2 rounded-md font-medium transition-colors ${activeLang === 'vi' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`} onClick={() => setActiveLang('vi')}>
                🇻🇳 VN
              </button>
              <button type="button" className={`px-3 py-2 rounded-md font-medium transition-colors ${activeLang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`} onClick={() => setActiveLang('en')}>
                🇺🇸 EN
              </button>
            </div>

            <div>
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
              {titleVi && (
                <div className="mt-1 text-xs text-gray-500">
                  URL preview: <span className="font-mono">/blog/{generateSlug(titleVi)}</span>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-900" htmlFor="thumbnail">Thumbnail Image <span className="text-red-500">*</span></label>
              <div className="border-2 border-gray-300 rounded-lg p-3 flex items-center gap-4 bg-gray-50">
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/heic,image/jpeg,image/jpg,image/png"
                  onChange={handleThumbnailSelect}
                  disabled={loading}
                  className="bg-white text-gray-900 flex-1"
                  ref={fileInputRef}
                />
                {thumbnailPreview && (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      style={{ height: 120, width: 'auto', objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }}
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mt-4">
                <label htmlFor="content" className="block text-sm font-medium mb-1" style={cardTextColor}>
                  Content *
                </label>
                <div className="w-full">
                  <RichTextEditor
                    value={activeLang === 'vi' ? contentVi : contentEn}
                    onChange={md => activeLang === 'vi' ? setContentVi(md) : setContentEn(md)}
                    language={activeLang}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md"
                    enableSharedImages={false}
                    showSharedImagesLibrary={false}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1" style={cardTextColor}>
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Post'}
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
          </div>
      </div>
      </AdminLayout>
    </ProtectedRoute>
  )
} 