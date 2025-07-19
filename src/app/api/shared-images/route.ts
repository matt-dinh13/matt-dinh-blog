import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// GET: Retrieve shared images for a blog post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const blogPostId = searchParams.get('blogPostId')
    
    if (!blogPostId) {
      return NextResponse.json({ error: 'blogPostId is required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    
    // Get shared images for this blog post using direct query instead of function
    const { data: images, error } = await supabase
      .from('shared_images')
      .select('id, image_url, original_filename, file_size, uploaded_at')
      .eq('blog_post_id', parseInt(blogPostId))
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
    const { blogPostId, imageUrl, originalFilename, fileSize } = await request.json()
    
    if (!blogPostId || !imageUrl) {
      return NextResponse.json({ error: 'blogPostId and imageUrl are required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    
    // Prepare insert data
    const insertData: any = {
      blog_post_id: blogPostId,
      image_url: imageUrl,
      original_filename: originalFilename || 'unknown',
      file_size: fileSize || 0,
      is_active: true
    }
    
    // Insert the shared image
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

// PUT: Update image captions (placeholder for future implementation)
export async function PUT(request: NextRequest) {
  try {
    const { imageId, captionVi, captionEn } = await request.json()
    
    if (!imageId) {
      return NextResponse.json({ error: 'imageId is required' }, { status: 400 })
    }

    // For now, return success without updating captions
    // This will be implemented once the database migration is complete
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

// DELETE: Remove a shared image from all language translations
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const blogPostId = searchParams.get('blogPostId')
    const imageUrl = searchParams.get('imageUrl')
    
    if (!blogPostId || !imageUrl) {
      return NextResponse.json({ error: 'blogPostId and imageUrl are required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    
    // Remove the image by setting is_active to false
    const { error } = await supabase
      .from('shared_images')
      .update({ is_active: false })
      .eq('blog_post_id', parseInt(blogPostId))
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