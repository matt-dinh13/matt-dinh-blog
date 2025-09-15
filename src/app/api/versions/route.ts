import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('postId')
    
    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    
    const { data: versions, error } = await supabase
      .from('blog_post_versions')
      .select(`
        id,
        version_number,
        title_vi,
        title_en,
        content_vi,
        content_en,
        summary_vi,
        summary_en,
        status,
        category_id,
        thumbnail_url,
        created_at,
        change_summary,
        is_auto_save
      `)
      .eq('blog_post_id', postId)
      .order('version_number', { ascending: false })

    if (error) {
      logger.error('Failed to fetch versions', { component: 'api-versions', error })
      return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 })
    }

    return NextResponse.json({ versions: versions || [] })
  } catch (error) {
    logger.error('Versions API error', { component: 'api-versions', error: error as any })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { postId, changeSummary } = await req.json()
    
    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    
    const { data: versionId, error } = await supabase
      .rpc('create_manual_version', {
        post_id: postId,
        change_desc: changeSummary || null
      })

    if (error) {
      logger.error('Failed to create version', { component: 'api-versions', error })
      return NextResponse.json({ error: 'Failed to create version' }, { status: 500 })
    }

    return NextResponse.json({ versionId })
  } catch (error) {
    logger.error('Create version API error', { component: 'api-versions', error: error as any })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
