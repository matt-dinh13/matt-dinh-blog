import type { MetadataRoute } from 'next'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/portfolio`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/about`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  try {
    const supabase = createAdminSupabaseClient()
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at, status')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (posts && posts.length > 0) {
      for (const p of posts) {
        const lastMod = p.updated_at || p.published_at || null
        urls.push({
          url: `${BASE_URL}/blog/${p.slug}`,
          lastModified: lastMod ? new Date(lastMod) : undefined,
          changeFrequency: 'monthly',
          priority: 0.8,
        })
        // Language-prefixed routes (vi/en)
        urls.push({
          url: `${BASE_URL}/vi/blog/${p.slug}`,
          lastModified: lastMod ? new Date(lastMod) : undefined,
          changeFrequency: 'monthly',
          priority: 0.8,
        })
        urls.push({
          url: `${BASE_URL}/en/blog/${p.slug}`,
          lastModified: lastMod ? new Date(lastMod) : undefined,
          changeFrequency: 'monthly',
          priority: 0.8,
        })
      }
    }
  } catch {
    // Best-effort; sitemap should still render static routes
  }

  return urls
}


