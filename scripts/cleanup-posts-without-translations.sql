-- Clean up posts without translations
-- This will remove posts that don't have any translations, which cause issues on the homepage

-- First, let's see what posts don't have translations
SELECT '=== POSTS WITHOUT TRANSLATIONS (WILL BE DELETED) ===' as info;
SELECT 
  bp.id,
  bp.slug,
  bp.published_at
FROM blog_posts bp
LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id
WHERE bp.status = 'published' AND bpt.id IS NULL
ORDER BY bp.published_at DESC;

-- Count how many posts will be deleted
SELECT '=== COUNT OF POSTS TO DELETE ===' as info;
SELECT COUNT(*) as posts_to_delete
FROM blog_posts bp
LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id
WHERE bp.status = 'published' AND bpt.id IS NULL;

-- Delete posts without translations
DELETE FROM blog_posts 
WHERE id IN (
  SELECT bp.id
  FROM blog_posts bp
  LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id
  WHERE bp.status = 'published' AND bpt.id IS NULL
);

-- Show final results
SELECT '=== FINAL RESULTS ===' as info;
SELECT 'Total published posts:' as metric, COUNT(*) as count FROM blog_posts WHERE status = 'published'
UNION ALL
SELECT 'Posts with translations:' as metric, COUNT(DISTINCT bp.id) as count 
FROM blog_posts bp
INNER JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id
WHERE bp.status = 'published';

-- Show the remaining posts
SELECT '=== REMAINING POSTS ===' as info;
SELECT 
  bp.slug,
  bp.published_at,
  COUNT(bpt.id) as translation_count,
  STRING_AGG(bpt.language_code, ', ') as languages
FROM blog_posts bp
LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id
WHERE bp.status = 'published'
GROUP BY bp.id, bp.slug, bp.published_at
ORDER BY bp.published_at DESC; 