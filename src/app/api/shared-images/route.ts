import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

// GET: Retrieve shared images for an entity (blog/portfolio) or empty for new items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const scope = searchParams.get('scope') // 'all' for admin list

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not configured')
      return NextResponse.json({ error: 'Server misconfiguration: missing service role key' }, { status: 500 })
    }
    const supabase = createAdminSupabaseClient()

    if (scope === 'all') {
      const entityType = searchParams.get('entityType') || undefined
      const entityIdStr = searchParams.get('entityId')
      const filename = searchParams.get('filename') || undefined
      const entityId = entityIdStr ? parseInt(entityIdStr) : undefined

      let query = supabase.from('shared_images')
        .select('id, entity_type, entity_id, image_url, original_filename, file_size, uploaded_at, is_active')
        .order('uploaded_at', { ascending: false })

      if (entityType) query = query.eq('entity_type', entityType)
      if (typeof entityId === 'number' && !Number.isNaN(entityId)) query = query.eq('entity_id', entityId)
      if (filename) query = query.ilike('original_filename', `%${filename}%`)

      const { data, error } = await query
      if (error) {
        console.error('Error fetching shared images (admin scope):', error)
        return NextResponse.json({ error: 'Failed to fetch shared images' }, { status: 500 })
      }

      const images = data || []

      // Collect distinct ids by type
      const blogIds = Array.from(new Set(images.filter(i => i.entity_type === 'blog').map(i => i.entity_id)))
      const portIds = Array.from(new Set(images.filter(i => i.entity_type === 'portfolio').map(i => i.entity_id)))

      // Fetch slugs/titles
      const blogMap: Record<number, { slug: string | null; title: string | null }> = {}
      const portMap: Record<number, { slug: string | null; title: string | null }> = {}

      if (blogIds.length > 0) {
        const { data: posts } = await supabase
          .from('blog_posts')
          .select('id, slug, title')
          .in('id', blogIds as any)
        ;(posts || []).forEach(p => { blogMap[p.id as number] = { slug: p.slug || null, title: p.title || null } })
      }
      if (portIds.length > 0) {
        const { data: projs } = await supabase
          .from('portfolio_projects')
          .select('id, slug, title')
          .in('id', portIds as any)
        ;(projs || []).forEach(p => { portMap[p.id as number] = { slug: p.slug || null, title: (p as any).title || null } })
      }

      // Enrich
      const enriched = images.map(img => {
        if (img.entity_type === 'blog') {
          const meta = blogMap[img.entity_id] || { slug: null, title: null }
          return { ...img, entity_slug: meta.slug, entity_title: meta.title, public_url: meta.slug ? `/blog/${meta.slug}` : null, admin_url: `/admin/blog/edit/${img.entity_id}` }
        }
        if (img.entity_type === 'portfolio') {
          const meta = portMap[img.entity_id] || { slug: null, title: null }
          return { ...img, entity_slug: meta.slug, entity_title: meta.title, public_url: meta.slug ? `/portfolio/${meta.slug}` : null, admin_url: `/admin/portfolio/edit/${img.entity_id}` }
        }
        return img
      })

      return NextResponse.json({ images: enriched })
    }

    const entityType = searchParams.get('entityType') // 'blog' | 'portfolio'
    const entityIdStr = searchParams.get('entityId')

    // Backward compatibility: blogPostId -> entityType=blog, entityId
    const blogPostId = searchParams.get('blogPostId')

    const effectiveEntityType = entityType || (blogPostId ? 'blog' : null)
    const effectiveEntityId = entityIdStr ? parseInt(entityIdStr) : (blogPostId ? parseInt(blogPostId) : NaN)

    if (!effectiveEntityType || Number.isNaN(effectiveEntityId)) {
      // No entity specified (new item) -> return empty
      return NextResponse.json({ images: [] })
    }

    const { data: images, error } = await supabase
      .from('shared_images')
      .select('id, image_url, original_filename, file_size, uploaded_at')
      .eq('entity_type', effectiveEntityType)
      .eq('entity_id', effectiveEntityId)
      .eq('is_active', true)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Error fetching shared images:', error)
      return NextResponse.json({ error: 'Failed to fetch shared images' }, { status: 500 })
    }

    return NextResponse.json({ images: images || [] })
  } catch (error) {
    console.error('Error in shared images GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Add a new shared image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blogPostId, imageUrl, originalFilename, fileSize, entityType, entityId } = body || {}

    // Backward compatibility mapping
    const effectiveEntityType = entityType || (blogPostId ? 'blog' : null)
    const effectiveEntityId = typeof entityId === 'number' ? entityId : (blogPostId ? Number(blogPostId) : undefined)

    if (!effectiveEntityType || !effectiveEntityId || !imageUrl) {
      return NextResponse.json({ error: 'entityType, entityId and imageUrl are required' }, { status: 400 })
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not configured')
      return NextResponse.json({ error: 'Server misconfiguration: missing service role key' }, { status: 500 })
    }

    const supabase = createAdminSupabaseClient()

    const insertData: any = {
      entity_type: effectiveEntityType,
      entity_id: effectiveEntityId,
      image_url: imageUrl,
      original_filename: originalFilename || 'unknown',
      file_size: fileSize || 0,
      is_active: true
    }

    const { data, error } = await supabase
      .from('shared_images')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error adding shared image:', error)
      return NextResponse.json({ error: 'Failed to add shared image', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, image: data })
  } catch (error) {
    console.error('Error in shared images POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT and DELETE remain unchanged
export async function PUT(request: NextRequest) {
  try {
    const { imageId, captionVi, captionEn } = await request.json()
    if (!imageId) {
      return NextResponse.json({ error: 'imageId is required' }, { status: 400 })
    }
    return NextResponse.json({ 
      success: true, 
      message: 'Caption update not yet implemented - database migration required',
      imageId,
      captionVi,
      captionEn
    })
  } catch (error) {
    console.error('Error in shared images PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entityType')
    const entityIdStr = searchParams.get('entityId')
    const imageUrl = searchParams.get('imageUrl')

    // Backward compatibility
    const blogPostId = searchParams.get('blogPostId')
    const effectiveEntityType = entityType || (blogPostId ? 'blog' : null)
    const effectiveEntityId = entityIdStr ? parseInt(entityIdStr) : (blogPostId ? parseInt(blogPostId) : NaN)

    if (!effectiveEntityType || Number.isNaN(effectiveEntityId) || !imageUrl) {
      return NextResponse.json({ error: 'entityType, entityId and imageUrl are required' }, { status: 400 })
    }

    const supabase = createAdminSupabaseClient()

    const { error } = await supabase
      .from('shared_images')
      .update({ is_active: false })
      .eq('entity_type', effectiveEntityType)
      .eq('entity_id', effectiveEntityId)
      .eq('image_url', imageUrl)

    if (error) {
      console.error('Error removing shared image:', error)
      return NextResponse.json({ error: 'Failed to remove image' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in shared images DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
