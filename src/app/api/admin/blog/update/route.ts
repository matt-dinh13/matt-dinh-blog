import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      status,
      thumbnail_url,
      published_at,
      category_id,
      translations
    } = body || {}

    if (!id || !translations || !Array.isArray(translations)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const admin = createAdminSupabaseClient()

    // Update blog post (base)
    const { error: postError } = await admin
      .from('blog_posts')
      .update({ 
        status, 
        thumbnail_url: thumbnail_url || null, 
        published_at: published_at || null,
        category_id: category_id || null
      })
      .eq('id', id)

    if (postError) {
      return NextResponse.json({ error: postError.message }, { status: 500 })
    }

    // Update translations
    const translationRows = translations.map((t: any) => ({
      blog_post_id: id,
      language_code: t.language_code,
      title: t.title || '',
      summary: t.summary || '',
      content: t.content || ''
    }))

    const { error: transError } = await admin
      .from('blog_post_translations')
      .upsert(translationRows, { onConflict: 'blog_post_id,language_code' })

    if (transError) {
      return NextResponse.json({ error: transError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
