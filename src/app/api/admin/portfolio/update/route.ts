import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      slug,
      status,
      thumbnail_url,
      project_url,
      github_url,
      published_at,
      translations
    } = body || {}

    if (!id || !translations || !Array.isArray(translations)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const admin = createAdminSupabaseClient()

    const { error: updErr } = await admin
      .from('portfolio_projects')
      .update({ slug, status, thumbnail_url: thumbnail_url || null, project_url: project_url || null, github_url: github_url || null, published_at: published_at || null })
      .eq('id', id)
    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 })
    }

    const rows = translations.map((t: any) => ({
      portfolio_project_id: id,
      language_code: t.language_code,
      title: t.title || '',
      description: t.description || ''
    }))

    const { error: trErr } = await admin
      .from('portfolio_project_translations')
      .upsert(rows, { onConflict: 'portfolio_project_id,language_code' })
    if (trErr) {
      return NextResponse.json({ error: trErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}


