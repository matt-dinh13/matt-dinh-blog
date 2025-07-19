import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  return new Response('Method Not Allowed', { status: 405 })
}

export async function POST(request: Request) {
  try {
    const { id } = await request.json()
    if (!id) {
      return Response.json({ error: 'Missing post id' }, { status: 400 })
    }
    const supabase = await createServerSupabaseClient()
    // Increment view_count atomically
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ view_count: supabase.rpc('increment', { x: 1, column: 'view_count' }) })
      .eq('id', id)
      .select('view_count')
      .single()
    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    if (!data) {
      return Response.json({ error: 'Post not found' }, { status: 404 })
    }
    return Response.json({ view_count: data.view_count })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
} 