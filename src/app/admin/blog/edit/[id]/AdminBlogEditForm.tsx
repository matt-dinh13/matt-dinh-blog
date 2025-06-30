'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import RichTextEditor from '@/components/RichTextEditor'

const cardTextColor = { color: 'oklch(21% .034 264.665)' };

type BlogPost = {
  id: number
  title: string
  summary: string
  content: string
  status: string
  tags?: { id: number; slug: string; name: string }[]
}

interface BlogPostTranslation {
  id: number
  blog_post_id: number
  language_code: string
  title: string
  summary: string
  content: string
}

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
  const [language, setLanguage] = useState('en') // TODO: Replace with actual language context if available
  const [translation, setTranslation] = useState<BlogPostTranslation | null>(null)
  const [translationLang, setTranslationLang] = useState('vi') // Always prefer Vietnamese
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi')

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
      // Fetch translations (prefer VI, fallback to EN, fallback to any)
      const { data: translations } = await supabase
        .from('blog_post_translations')
        .select('*')
        .eq('blog_post_id', id)
      let tr = translations?.find((t: any) => t.language_code === 'vi')
      if (!tr) tr = translations?.find((t: any) => t.language_code === 'en')
      if (!tr && translations && translations.length > 0) tr = translations[0]
      setTranslation(tr || null)
      setTranslationLang(tr?.language_code || 'vi')
      setTitleVi(tr?.title || '')
      setTitleEn(tr?.title || '')
      setContentVi(tr?.content || '')
      setContentEn(tr?.content || '')
      setStatus(postData.status)
      setCategoryId(postData.category_id ? String(postData.category_id) : '')
    } catch (err) {
      setError('Error loading blog post')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  // Sync translation content to state
  useEffect(() => {
    if (translationLang === 'vi') {
      setContentVi(translation?.content || '')
      setTitleVi(translation?.title || '')
    } else if (translationLang === 'en') {
      setContentEn(translation?.content || '')
      setTitleEn(translation?.title || '')
    }
  }, [translation, translationLang])

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
          const translation = tag.tag_translations.find((t: any) => t.language_code === language)
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
  }, [language])

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
          const translation = tag.tag_translations.find((t: any) => t.language_code === language)
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
  }, [id, language])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const supabase = createClient()
      // Update blog post (base)
      const { error: postError } = await supabase
        .from('blog_posts')
        .update({
          status,
          published_at: status === 'published' ? new Date().toISOString() : null,
          category_id: categoryId || null
        })
        .eq('id', id)
      if (postError) throw postError
      // Upsert translations for VI and EN
      const translations = [
        { blog_post_id: id, language_code: 'vi', title: titleVi, summary: '', content: contentVi },
      ]
      if (contentEn.trim() || titleEn.trim()) {
        translations.push({ blog_post_id: id, language_code: 'en', title: titleEn, summary: '', content: contentEn })
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
      router.push('/admin')
    } catch (err) {
      setError('Error updating blog post')
      console.error('Error:', err)
    } finally {
      setSaving(false)
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

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Blog Post</h1>
        <span className="text-xs text-gray-500">Editing language: {translationLang.toUpperCase()}</span>
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1" style={cardTextColor}>
              Title *
            </label>
            <div className="flex gap-2 mb-4">
              <button type="button" className={`px-2 py-1 rounded ${activeLang === 'vi' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`} onClick={() => handleLangSwitch('vi')}>
                🇻🇳 VN
              </button>
              <button type="button" className={`px-2 py-1 rounded ${activeLang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`} onClick={() => handleLangSwitch('en')}>
                🇺🇸 EN
              </button>
            </div>
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

          <div className="mt-4">
            <label htmlFor="content" className="block text-sm font-medium mb-1" style={cardTextColor}>
              Content *
            </label>
            <RichTextEditor
              value={activeLang === 'vi' ? contentVi : contentEn}
              onChange={md => activeLang === 'vi' ? setContentVi(md) : setContentEn(md)}
              language={activeLang}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md"
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
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
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
    </>
  )
} 