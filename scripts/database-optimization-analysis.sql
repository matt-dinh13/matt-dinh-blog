-- Database Optimization Analysis for Matt Dinh Blog
-- Run this in your Supabase SQL Editor to analyze your database

-- 1. Check current database size and table statistics
SELECT '=== DATABASE SIZE ANALYSIS ===' as analysis;

SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation,
    most_common_vals,
    most_common_freqs
FROM pg_stats 
WHERE schemaname = 'public' 
AND tablename IN ('blog_posts', 'blog_post_translations', 'portfolio_projects', 'portfolio_project_translations', 'tags', 'tag_translations')
ORDER BY tablename, attname;

-- 2. Check table sizes
SELECT '=== TABLE SIZES ===' as analysis;

SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 3. Check existing indexes
SELECT '=== EXISTING INDEXES ===' as analysis;

SELECT 
    t.tablename,
    i.indexname,
    i.indexdef
FROM pg_indexes i
JOIN pg_tables t ON i.tablename = t.tablename
WHERE i.schemaname = 'public' 
AND t.schemaname = 'public'
ORDER BY t.tablename, i.indexname;

-- 4. Check for missing indexes on foreign keys
SELECT '=== MISSING FOREIGN KEY INDEXES ===' as analysis;

SELECT 
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    CASE 
        WHEN idx.indexname IS NULL THEN 'MISSING INDEX'
        ELSE 'INDEX EXISTS'
    END as index_status
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
    LEFT JOIN pg_indexes idx ON 
        idx.tablename = tc.table_name 
        AND idx.indexdef LIKE '%' || kcu.column_name || '%'
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- 5. Check for unused indexes
SELECT '=== POTENTIALLY UNUSED INDEXES ===' as analysis;

SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
AND idx_scan = 0
ORDER BY tablename, indexname;

-- 6. Check table statistics and vacuum status
SELECT '=== TABLE STATISTICS ===' as analysis;

SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_tuples,
    n_dead_tup as dead_tuples,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY n_dead_tup DESC;

-- 7. Check for large content fields that might need optimization
SELECT '=== CONTENT SIZE ANALYSIS ===' as analysis;

SELECT 
    'blog_post_translations' as table_name,
    COUNT(*) as total_records,
    AVG(LENGTH(content)) as avg_content_length,
    MAX(LENGTH(content)) as max_content_length,
    SUM(LENGTH(content)) as total_content_size
FROM public.blog_post_translations
UNION ALL
SELECT 
    'portfolio_project_translations' as table_name,
    COUNT(*) as total_records,
    AVG(LENGTH(content)) as avg_content_length,
    MAX(LENGTH(content)) as max_content_length,
    SUM(LENGTH(content)) as total_content_size
FROM public.portfolio_project_translations;

-- 8. Check for duplicate or redundant data
SELECT '=== DUPLICATE DATA CHECK ===' as analysis;

-- Check for duplicate slugs
SELECT 'Duplicate slugs in blog_posts:' as check_type;
SELECT slug, COUNT(*) as count
FROM public.blog_posts 
GROUP BY slug 
HAVING COUNT(*) > 1;

-- Check for duplicate slugs in portfolio
SELECT 'Duplicate slugs in portfolio_projects:' as check_type;
SELECT slug, COUNT(*) as count
FROM public.portfolio_projects 
GROUP BY slug 
HAVING COUNT(*) > 1;

-- 9. Check RLS policy performance
SELECT '=== RLS POLICY ANALYSIS ===' as analysis;

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 10. Check for potential query performance issues
SELECT '=== QUERY PERFORMANCE ANALYSIS ===' as analysis;

-- Check for slow queries (if available)
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
WHERE query LIKE '%blog_posts%' 
   OR query LIKE '%blog_post_translations%'
   OR query LIKE '%portfolio%'
ORDER BY mean_time DESC
LIMIT 10;

-- 11. Recommendations based on analysis
SELECT '=== OPTIMIZATION RECOMMENDATIONS ===' as analysis;

-- Create a summary of recommendations
WITH recommendations AS (
    SELECT 'Add index on blog_post_translations(blog_post_id, language_code)' as recommendation
    WHERE NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'blog_post_translations' 
        AND indexdef LIKE '%blog_post_id%language_code%'
    )
    UNION ALL
    SELECT 'Add index on portfolio_project_translations(portfolio_project_id, language_code)' as recommendation
    WHERE NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'portfolio_project_translations' 
        AND indexdef LIKE '%portfolio_project_id%language_code%'
    )
    UNION ALL
    SELECT 'Consider partitioning blog_post_translations by language_code for large datasets' as recommendation
    WHERE (SELECT COUNT(*) FROM public.blog_post_translations) > 10000
    UNION ALL
    SELECT 'Add index on blog_posts(published_at DESC) for better homepage performance' as recommendation
    WHERE NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'blog_posts' 
        AND indexdef LIKE '%published_at%'
    )
    UNION ALL
    SELECT 'Consider adding full-text search index on blog_post_translations(content)' as recommendation
    WHERE NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'blog_post_translations' 
        AND indexdef LIKE '%to_tsvector%'
    )
)
SELECT recommendation FROM recommendations;

-- 12. Check for storage optimization opportunities
SELECT '=== STORAGE OPTIMIZATION ===' as analysis;

-- Check for large text fields that could be compressed
SELECT 
    'blog_post_translations.content' as field_name,
    COUNT(*) as records,
    AVG(LENGTH(content)) as avg_size,
    SUM(LENGTH(content)) as total_size
FROM public.blog_post_translations
WHERE LENGTH(content) > 10000;

-- 13. Check connection and performance stats
SELECT '=== PERFORMANCE STATS ===' as analysis;

SELECT 
    datname,
    numbackends as active_connections,
    xact_commit as commits,
    xact_rollback as rollbacks,
    blks_read,
    blks_hit,
    tup_returned,
    tup_fetched,
    tup_inserted,
    tup_updated,
    tup_deleted
FROM pg_stat_database 
WHERE datname = current_database(); 