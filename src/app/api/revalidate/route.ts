import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

// Expected payload from Supabase Webhooks
// {
//   type: 'INSERT' | 'UPDATE' | 'DELETE',
//   table: string,
//   record: any,
//   old_record?: any
// }

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  const token = req.headers.get('x-webhook-secret') || new URL(req.url).searchParams.get('secret')

  if (!secret || token !== secret) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  let payload: any
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const { type, table, record, old_record } = payload || {}

  try {
    const pathsToRevalidate = new Set<string>()

    // Always refresh homepages and blog listing (cheap and safe)
    pathsToRevalidate.add('/')
    pathsToRevalidate.add('/vi')
    pathsToRevalidate.add('/en')
    pathsToRevalidate.add('/blog')

    // Helper to add post detail paths for both routing styles
    const addPostPaths = (slug?: string, langs?: string[]) => {
      if (!slug) return
      // Non-lang route version (current codebase serves /blog/[slug])
      pathsToRevalidate.add(`/blog/${slug}`)
      // Language-scoped route, if used
      for (const l of langs || ['vi', 'en']) {
        pathsToRevalidate.add(`/${l}/blog/${slug}`)
      }
    }

    // Helper to add category/tag index paths
    const addCategoryPath = (slug?: string, langs?: string[]) => {
      if (!slug) return
      for (const l of langs || ['vi', 'en']) {
        pathsToRevalidate.add(`/${l}/blog/category/${slug}`)
      }
    }
    const addTagPath = (slug?: string, langs?: string[]) => {
      if (!slug) return
      for (const l of langs || ['vi', 'en']) {
        pathsToRevalidate.add(`/tag/${slug}`)
        // If there is a language-scoped tag route in the future, add it similarly
      }
    }

    const supabase = await createAdminSupabaseClient()

    if (table === 'blog_posts') {
      const slug = record?.slug || old_record?.slug
      addPostPaths(slug)
      // Revalidate category page if category changed
      if (record?.category_id) {
        const { data: cat } = await supabase
          .from('categories')
          .select('slug')
          .eq('id', record.category_id)
          .single()
        addCategoryPath(cat?.slug)
      }
      if (old_record?.category_id && old_record?.category_id !== record?.category_id) {
        const { data: oldCat } = await supabase
          .from('categories')
          .select('slug')
          .eq('id', old_record.category_id)
          .single()
        addCategoryPath(oldCat?.slug)
      }
    }

    if (table === 'blog_post_translations') {
      const lang = record?.language_code || old_record?.language_code
      // find slug via post id
      const postId = record?.blog_post_id || old_record?.blog_post_id
      if (postId) {
        const { data: post } = await supabase
          .from('blog_posts')
          .select('slug')
          .eq('id', postId)
          .single()
        if (post?.slug) {
          addPostPaths(post.slug, lang ? [lang] : undefined)
        }
      }
      if (lang === 'vi' || lang === 'en') {
        pathsToRevalidate.add(`/${lang}`)
      }
    }

    if (table === 'categories') {
      const slug = record?.slug || old_record?.slug
      addCategoryPath(slug)
    }

    if (table === 'tags' || table === 'blog_post_tags' || table === 'tag_translations') {
      // Tags impact listing and possibly post pages; refresh tag index root
      pathsToRevalidate.add('/tag')
      const slug = record?.slug || old_record?.slug
      addTagPath(slug)
    }

    // Execute revalidation
    for (const p of pathsToRevalidate) {
      try {
        revalidatePath(p)
        logger.info('Revalidated path', { component: 'api-revalidate', data: { path: p } })
      } catch (e) {
        logger.warn('Revalidate failed for path', { component: 'api-revalidate', error: e as any, data: { path: p } })
      }
    }

    return NextResponse.json({ ok: true, revalidated: Array.from(pathsToRevalidate), type, table })
  } catch (error) {
    logger.error('Revalidate endpoint error', { component: 'api-revalidate', error: error as any })
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
} 