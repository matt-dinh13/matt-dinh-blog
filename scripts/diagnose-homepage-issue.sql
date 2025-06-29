-- Diagnostic script to understand homepage pagination issue
-- Run this in your Supabase SQL editor

-- 1. Check total published posts
SELECT '=== TOTAL PUBLISHED POSTS ===' as section;
SELECT COUNT(*) as total_published_posts FROM blog_posts WHERE status = 'published';

-- 2. Check posts with translations
SELECT '=== POSTS WITH TRANSLATIONS ===' as section;
SELECT 
  bp.id,
  bp.slug,
  bp.status,
  bp.published_at,
  COUNT(bpt.id) as translation_count,
  STRING_AGG(bpt.language_code, ', ') as languages
FROM blog_posts bp
LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id
WHERE bp.status = 'published'
GROUP BY bp.id, bp.slug, bp.status, bp.published_at
ORDER BY bp.published_at DESC;

-- 3. Check posts without translations
SELECT '=== POSTS WITHOUT TRANSLATIONS ===' as section;
SELECT 
  bp.id,
  bp.slug,
  bp.published_at
FROM blog_posts bp
LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id
WHERE bp.status = 'published' AND bpt.id IS NULL;

-- 4. Check total translations
SELECT '=== TOTAL TRANSLATIONS ===' as section;
SELECT 
  language_code,
  COUNT(*) as count
FROM blog_post_translations
GROUP BY language_code;

-- 5. Show the first 6 posts that should appear on homepage
SELECT '=== FIRST 6 POSTS FOR HOMEPAGE ===' as section;
SELECT 
  bp.id,
  bp.slug,
  bp.published_at,
  bpt.language_code,
  bpt.title
FROM blog_posts bp
LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id
WHERE bp.status = 'published'
ORDER BY bp.published_at DESC
LIMIT 12;

-- 6. Check if we need to add more posts
SELECT '=== RECOMMENDATION ===' as section;
SELECT 
  CASE 
    WHEN COUNT(*) >= 6 THEN '✅ Enough posts for homepage (6+ posts with translations)'
    ELSE '❌ Need more posts - only ' || COUNT(*) || ' posts with translations'
  END as status
FROM blog_posts bp
INNER JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id
WHERE bp.status = 'published'; 