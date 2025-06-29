-- Add thumbnails to existing blog posts that don't have them
-- Run this in your Supabase SQL Editor

-- Update existing posts with thumbnails based on their content
UPDATE public.blog_posts 
SET thumbnail_url = CASE 
    WHEN slug LIKE '%nextjs%' OR slug LIKE '%typescript%' OR slug LIKE '%web%' OR slug LIKE '%performance%' THEN
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop'
    WHEN slug LIKE '%food%' OR slug LIKE '%pho%' OR slug LIKE '%coffee%' OR slug LIKE '%vietnamese%' THEN
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop'
    WHEN slug LIKE '%travel%' OR slug LIKE '%hanoi%' OR slug LIKE '%saigon%' OR slug LIKE '%city%' THEN
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop'
    WHEN slug LIKE '%design%' OR slug LIKE '%responsive%' OR slug LIKE '%css%' THEN
        'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=400&fit=crop'
    WHEN slug LIKE '%auth%' OR slug LIKE '%supabase%' OR slug LIKE '%database%' THEN
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop'
    ELSE
        'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop'
END
WHERE thumbnail_url IS NULL OR thumbnail_url = '';

-- Verify the updates
SELECT 'Posts updated with thumbnails:' as info, COUNT(*) as count 
FROM public.blog_posts 
WHERE thumbnail_url IS NOT NULL AND thumbnail_url != '';

SELECT 'Posts still without thumbnails:' as info, COUNT(*) as count 
FROM public.blog_posts 
WHERE thumbnail_url IS NULL OR thumbnail_url = '';

-- Show all posts with their thumbnails
SELECT 'All posts with thumbnails:' as info, slug, thumbnail_url 
FROM public.blog_posts 
ORDER BY created_at DESC; 