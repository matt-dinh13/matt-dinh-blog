import JSZip from 'jszip'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

type ExportRequest = {
  ids: number[]
}

function toUtcPlus7String(dateIso: string | null): string {
  if (!dateIso) return ''
  const date = new Date(dateIso)
  const shifted = new Date(date.getTime() + 7 * 60 * 60 * 1000)
  const y = shifted.getUTCFullYear()
  const m = String(shifted.getUTCMonth() + 1).padStart(2, '0')
  const d = String(shifted.getUTCDate()).padStart(2, '0')
  const hh = String(shifted.getUTCHours()).padStart(2, '0')
  const mm = String(shifted.getUTCMinutes()).padStart(2, '0')
  const ss = String(shifted.getUTCSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss} +07:00`
}

function sanitizeFileSegment(input: string): string {
  return input.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

async function downloadThumbnail(url: string | null): Promise<{ data: ArrayBuffer | null, ext: string }>{
  if (!url) return { data: null, ext: '' }
  try {
    const res = await fetch(url)
    if (!res.ok) return { data: null, ext: '' }
    const contentType = res.headers.get('content-type') || ''
    const ext = contentType.includes('png') ? '.png' : contentType.includes('webp') ? '.webp' : '.jpg'
    const buffer = await res.arrayBuffer()
    return { data: buffer, ext }
  } catch {
    return { data: null, ext: '' }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ExportRequest
    const ids = Array.isArray(body.ids) ? body.ids : []
    if (ids.length === 0) {
      return NextResponse.json({ error: 'No ids provided' }, { status: 400 })
    }

    const supabase = createAdminSupabaseClient()

    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        id, slug, published_at, thumbnail_url,
        blog_post_translations ( language_code, title, summary, content )
      `)
      .in('id', ids)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const zip = new JSZip()

    for (const post of posts || []) {
      const id: number = post.id
      const slug: string = post.slug
      const publishedAt: string | null = post.published_at
      const publishedAtStr = toUtcPlus7String(publishedAt)

      // Build a map by language
      const translations: Record<string, any> = {}
      for (const tr of (post.blog_post_translations || [])) {
        translations[tr.language_code] = tr
      }

      const langs = ['en', 'vi']
      for (const lang of langs) {
        const tr = translations[lang]
        if (!tr) continue

        const safeSlug = sanitizeFileSegment(slug)
        const fileName = `${id}-${lang}-${safeSlug}.md`

        const thumb = await downloadThumbnail(post.thumbnail_url || null)
        let thumbName = ''
        if (thumb.data) {
          thumbName = `${id}-${lang}-${safeSlug}-thumbnail${thumb.ext}`
          zip.file(thumbName, thumb.data)
        }

        const frontmatter = [
          '---',
          `id: ${id}`,
          `slug: ${slug}`,
          `language: ${lang}`,
          `title: ${tr.title || ''}`,
          `summary: ${tr.summary || ''}`,
          `published_at_utc_plus7: "${publishedAtStr}"`,
          thumbName ? `thumbnail: ./${thumbName}` : undefined,
          '---'
        ].filter(Boolean).join('\n')

        const thumbnailMd = thumbName ? `\n\n![thumbnail](./${thumbName})\n` : ''
        const content = typeof tr.content === 'string' ? tr.content : ''
        const md = `${frontmatter}${thumbnailMd}\n\n${content}\n`

        zip.file(fileName, md)
      }
    }

    const now = new Date()
    const utc7 = new Date(now.getTime() + 7 * 60 * 60 * 1000)
    const y = utc7.getUTCFullYear()
    const m = String(utc7.getUTCMonth() + 1).padStart(2, '0')
    const d = String(utc7.getUTCDate()).padStart(2, '0')
    const zipName = `${y}${m}${d}.zip`

    const blob = await zip.generateAsync({ type: 'nodebuffer' })
    return new NextResponse(blob as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipName}"`
      }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}


