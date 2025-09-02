import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      slug,
      status,
      thumbnail_url,
      project_url,
      github_url,
      published_at,
      translations
    } = body || {}

    if (!slug || !status || !translations || !Array.isArray(translations)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const admin = createAdminSupabaseClient()

    // Ensure unique slug by appending -n when needed
    const baseSlug = String(slug)
    let uniqueSlug = baseSlug
    {
      const { data: rows, error: slugErr } = await admin
        .from('portfolio_projects')
        .select('slug')
        .ilike('slug', `${baseSlug}%`)
      if (!slugErr && rows && rows.length > 0) {
        const existing = new Set(rows.map(r => r.slug))
        if (existing.has(baseSlug)) {
          let counter = 1
          while (existing.has(`${baseSlug}-${counter}`) && counter < 1000) counter++
          uniqueSlug = `${baseSlug}-${counter}`
        }
      }
    }

    const { data: created, error: createErr } = await admin
      .from('portfolio_projects')
      .insert({ slug: uniqueSlug, status, thumbnail_url: thumbnail_url || null, project_url: project_url || null, github_url: github_url || null, published_at: published_at || null })
      .select('id')
      .single()
    if (createErr) {
      return NextResponse.json({ error: createErr.message }, { status: 500 })
    }

    const projectId = created.id
    const rows = translations.map((t: any) => ({
      portfolio_project_id: projectId,
      language_code: t.language_code,
      title: t.title || '',
      description: t.description || ''
    }))

    const { error: trErr } = await admin
      .from('portfolio_project_translations')
      .insert(rows)
    if (trErr) {
      return NextResponse.json({ error: trErr.message }, { status: 500 })
    }

    return NextResponse.json({ id: projectId, slug: uniqueSlug }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}


