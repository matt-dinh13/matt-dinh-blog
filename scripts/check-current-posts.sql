-- Check current posts in the database
SELECT 'Current Posts Count:' as info;
SELECT COUNT(*) as total_posts FROM blog_posts WHERE status = 'published';

SELECT 'Posts with translations:' as info;
SELECT 
  bp.id,
  bp.slug,
  bp.status,
  bp.published_at,
  COUNT(bpt.id) as translation_count
FROM blog_posts bp
LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id
WHERE bp.status = 'published'
GROUP BY bp.id, bp.slug, bp.status, bp.published_at
ORDER BY bp.published_at DESC;

SELECT 'Total translations:' as info;
SELECT COUNT(*) as total_translations FROM blog_post_translations;

SELECT 'Sample of recent posts:' as info;
SELECT 
  bp.slug,
  bp.published_at,
  bpt.language_code,
  bpt.title
FROM blog_posts bp
LEFT JOIN blog_post_translations bpt ON bp.id = bpt.blog_post_id
WHERE bp.status = 'published'
ORDER BY bp.published_at DESC
LIMIT 10; 