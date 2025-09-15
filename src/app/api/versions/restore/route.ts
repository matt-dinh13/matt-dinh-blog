import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  try {
    const { versionId } = await req.json()
    
    if (!versionId) {
      return NextResponse.json({ error: 'versionId is required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    
    // Get the version details
    const { data: version, error: versionError } = await supabase
      .from('blog_post_versions')
      .select(`
        id,
        blog_post_id,
        title_vi,
        title_en,
        content_vi,
        content_en,
        summary_vi,
        summary_en,
        status,
        category_id,
        thumbnail_url
      `)
      .eq('id', versionId)
      .single()

    if (versionError || !version) {
      logger.error('Version not found', { component: 'api-versions-restore', error: versionError })
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    // Update the blog post with version data
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({
        title_vi: version.title_vi,
        title_en: version.title_en,
        content_vi: version.content_vi,
        content_en: version.content_en,
        summary_vi: version.summary_vi,
        summary_en: version.summary_en,
        status: version.status,
        category_id: version.category_id,
        thumbnail_url: version.thumbnail_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', version.blog_post_id)

    if (updateError) {
      logger.error('Failed to restore version', { component: 'api-versions-restore', error: updateError })
      return NextResponse.json({ error: 'Failed to restore version' }, { status: 500 })
    }

    // Create a new version to track the restoration
    const { error: createVersionError } = await supabase
      .rpc('create_manual_version', {
        post_id: version.blog_post_id,
        change_desc: `Restored from version ${(version as any).version_number}`
      })

    if (createVersionError) {
      logger.warn('Failed to create restoration version', { component: 'api-versions-restore', error: createVersionError })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Restore version API error', { component: 'api-versions-restore', error: error as any })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
