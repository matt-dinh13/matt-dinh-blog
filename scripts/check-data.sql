-- Check Database Data and Relationships
-- Run this in your Supabase SQL Editor to see what's in your database

-- 1. Check what tables exist
SELECT 'Tables in database:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Check languages data
SELECT 'Languages data:' as info;
SELECT * FROM public.languages;

-- 3. Check blog posts data
SELECT 'Blog posts data:' as info;
SELECT id, slug, status, published_at, created_at FROM public.blog_posts;

-- 4. Check translations data
SELECT 'Translations data:' as info;
SELECT 
  bpt.id,
  bpt.blog_post_id,
  bpt.language_code,
  bpt.title,
  bp.slug,
  bp.status
FROM public.blog_post_translations bpt
JOIN public.blog_posts bp ON bpt.blog_post_id = bp.id;

-- 5. Test the exact query that's failing
SELECT 'Testing the exact query from the app:' as info;
SELECT 
  bp.id,
  bp.slug,
  bp.status,
  bp.published_at,
  bp.created_at,
  bpt.language_code,
  bpt.title,
  bpt.summary
FROM public.blog_posts bp
LEFT JOIN public.blog_post_translations bpt ON bp.id = bpt.blog_post_id
WHERE bp.status = 'published'
ORDER BY bp.published_at DESC
LIMIT 5;

-- 6. Check foreign key relationships
SELECT 'Foreign key relationships:' as info;
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('blog_post_translations', 'blog_posts', 'languages');

-- 7. Check RLS policies
SELECT 'RLS policies:' as info;
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('blog_posts', 'blog_post_translations', 'languages'); 