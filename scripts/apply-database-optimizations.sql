-- Apply Database Optimizations for Matt Dinh Blog
-- Run this in your Supabase SQL Editor to optimize your database

-- 1. Add missing indexes for better performance
SELECT '=== ADDING PERFORMANCE INDEXES ===' as step;

-- Index for blog posts by published date (for homepage)
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at_desc 
ON public.blog_posts(published_at DESC NULLS LAST);

-- Composite index for blog post translations
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_post_lang 
ON public.blog_post_translations(blog_post_id, language_code);

-- Index for portfolio project translations
CREATE INDEX IF NOT EXISTS idx_portfolio_project_translations_project_lang 
ON public.portfolio_project_translations(portfolio_project_id, language_code);

-- Index for tag translations
CREATE INDEX IF NOT EXISTS idx_tag_translations_tag_lang 
ON public.tag_translations(tag_id, language_code);

-- Index for blog post tags junction table
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post_id 
ON public.blog_post_tags(blog_post_id);

CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag_id 
ON public.blog_post_tags(tag_id);

-- 2. Add full-text search indexes for content search
SELECT '=== ADDING FULL-TEXT SEARCH INDEXES ===' as step;

-- Add full-text search index for blog post content
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_content_fts 
ON public.blog_post_translations USING gin(to_tsvector('english', content));

-- Add full-text search index for blog post titles
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_title_fts 
ON public.blog_post_translations USING gin(to_tsvector('english', title));

-- Add full-text search index for portfolio project content
CREATE INDEX IF NOT EXISTS idx_portfolio_project_translations_content_fts 
ON public.portfolio_project_translations USING gin(to_tsvector('english', content));

-- 3. Add partial indexes for common queries
SELECT '=== ADDING PARTIAL INDEXES ===' as step;

-- Index for published blog posts only
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_only 
ON public.blog_posts(published_at DESC) 
WHERE status = 'published';

-- Index for published portfolio projects only
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_published_only 
ON public.portfolio_projects(created_at DESC) 
WHERE status = 'published';

-- 4. Add indexes for admin queries
SELECT '=== ADDING ADMIN QUERY INDEXES ===' as step;

-- Index for admin dashboard queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_created 
ON public.blog_posts(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_status_created 
ON public.portfolio_projects(status, created_at DESC);

-- 5. Add indexes for language-specific queries
SELECT '=== ADDING LANGUAGE-SPECIFIC INDEXES ===' as step;

-- Index for Vietnamese content
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_vi 
ON public.blog_post_translations(blog_post_id) 
WHERE language_code = 'vi';

-- Index for English content
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_en 
ON public.blog_post_translations(blog_post_id) 
WHERE language_code = 'en';

-- 6. Add indexes for slug lookups
SELECT '=== ADDING SLUG LOOKUP INDEXES ===' as step;

-- Ensure slug indexes are optimized
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug_lower 
ON public.blog_posts(LOWER(slug));

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_slug_lower 
ON public.portfolio_projects(LOWER(slug));

CREATE INDEX IF NOT EXISTS idx_tags_slug_lower 
ON public.tags(LOWER(slug));

-- 7. Add indexes for view count tracking
SELECT '=== ADDING VIEW COUNT INDEXES ===' as step;

-- Index for popular posts by view count
CREATE INDEX IF NOT EXISTS idx_blog_posts_view_count 
ON public.blog_posts(view_count DESC NULLS LAST) 
WHERE status = 'published';

-- 8. Add indexes for date range queries
SELECT '=== ADDING DATE RANGE INDEXES ===' as step;

-- Index for date range queries on blog posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_date_range 
ON public.blog_posts(published_at, status) 
WHERE status = 'published';

-- 9. Add indexes for category and tag queries
SELECT '=== ADDING CATEGORY AND TAG INDEXES ===' as step;

-- Index for blog post categories (if categories table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_post_categories') THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_blog_post_categories_post_id ON public.blog_post_categories(blog_post_id)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_blog_post_categories_category_id ON public.blog_post_categories(category_id)';
    END IF;
END $$;

-- 10. Add indexes for activity logging
SELECT '=== ADDING ACTIVITY LOG INDEXES ===' as step;

-- Index for activity logs by user and time
CREATE INDEX IF NOT EXISTS idx_activity_log_user_time 
ON public.activity_log(user_id, timestamp DESC);

-- Index for activity logs by action type
CREATE INDEX IF NOT EXISTS idx_activity_log_action 
ON public.activity_log(action, timestamp DESC);

-- 11. Add indexes for about me content
SELECT '=== ADDING ABOUT ME INDEXES ===' as step;

-- Index for about me translations
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'about_me_translations') THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_about_me_translations_language ON public.about_me_translations(language_code)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_about_me_translations_about_id_lang ON public.about_me_translations(about_me_id, language_code)';
    END IF;
END $$;

-- 12. Add indexes for page views tracking
SELECT '=== ADDING PAGE VIEW INDEXES ===' as step;

-- Index for page views by URL and time
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'page_views') THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_page_views_url_time ON public.page_views(page_url, created_at DESC)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC)';
    END IF;
END $$;

-- 13. Add indexes for search functionality
SELECT '=== ADDING SEARCH INDEXES ===' as step;

-- Index for search by title and content
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_search 
ON public.blog_post_translations USING gin(
    to_tsvector('english', title || ' ' || COALESCE(summary, '') || ' ' || content)
);

-- 14. Add indexes for meta data queries
SELECT '=== ADDING META DATA INDEXES ===' as step;

-- Index for meta title and description
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_meta 
ON public.blog_post_translations(meta_title, meta_description) 
WHERE meta_title IS NOT NULL OR meta_description IS NOT NULL;

-- 15. Add indexes for portfolio project URLs
SELECT '=== ADDING PORTFOLIO URL INDEXES ===' as step;

-- Index for portfolio project URLs
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_urls 
ON public.portfolio_projects(project_url, github_url) 
WHERE project_url IS NOT NULL OR github_url IS NOT NULL;

-- 16. Add indexes for technology tags
SELECT '=== ADDING TECHNOLOGY INDEXES ===' as step;

-- Index for portfolio project technologies array
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_technologies 
ON public.portfolio_projects USING gin(technologies);

-- 17. Add indexes for user-related queries
SELECT '=== ADDING USER INDEXES ===' as step;

-- Index for user email lookups
CREATE INDEX IF NOT EXISTS idx_users_email_lower 
ON public.users(LOWER(email));

-- Index for user creation date
CREATE INDEX IF NOT EXISTS idx_users_created_at 
ON public.users(created_at DESC);

-- 18. Add indexes for language queries
SELECT '=== ADDING LANGUAGE INDEXES ===' as step;

-- Index for default language
CREATE INDEX IF NOT EXISTS idx_languages_default 
ON public.languages(is_default) 
WHERE is_default = true;

-- Index for language codes
CREATE INDEX IF NOT EXISTS idx_languages_code 
ON public.languages(code);

-- 19. Add indexes for thumbnail URLs
SELECT '=== ADDING THUMBNAIL INDEXES ===' as step;

-- Index for blog post thumbnails
CREATE INDEX IF NOT EXISTS idx_blog_posts_thumbnail 
ON public.blog_posts(thumbnail_url) 
WHERE thumbnail_url IS NOT NULL;

-- Index for portfolio project thumbnails
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_thumbnail 
ON public.portfolio_projects(thumbnail_url) 
WHERE thumbnail_url IS NOT NULL;

-- 20. Add indexes for status-based queries
SELECT '=== ADDING STATUS INDEXES ===' as step;

-- Index for draft posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_draft 
ON public.blog_posts(created_at DESC) 
WHERE status = 'draft';

-- Index for archived posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_archived 
ON public.blog_posts(updated_at DESC) 
WHERE status = 'archived';

-- 21. Add indexes for author queries
SELECT '=== ADDING AUTHOR INDEXES ===' as step;

-- Index for posts by author
CREATE INDEX IF NOT EXISTS idx_blog_posts_author 
ON public.blog_posts(author_id, published_at DESC) 
WHERE author_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_author 
ON public.portfolio_projects(author_id, created_at DESC) 
WHERE author_id IS NOT NULL;

-- 22. Add indexes for updated_at queries
SELECT '=== ADDING UPDATED AT INDEXES ===' as step;

-- Index for recently updated content
CREATE INDEX IF NOT EXISTS idx_blog_posts_updated_at 
ON public.blog_posts(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_post_translations_updated_at 
ON public.blog_post_translations(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_updated_at 
ON public.portfolio_projects(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_portfolio_project_translations_updated_at 
ON public.portfolio_project_translations(updated_at DESC);

-- 23. Add indexes for content length queries
SELECT '=== ADDING CONTENT LENGTH INDEXES ===' as step;

-- Index for long content (for performance analysis)
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_content_length 
ON public.blog_post_translations(LENGTH(content)) 
WHERE LENGTH(content) > 10000;

-- 24. Add indexes for summary queries
SELECT '=== ADDING SUMMARY INDEXES ===' as step;

-- Index for posts with summaries
CREATE INDEX IF NOT EXISTS idx_blog_post_translations_has_summary 
ON public.blog_post_translations(blog_post_id) 
WHERE summary IS NOT NULL AND LENGTH(summary) > 0;

-- 25. Add indexes for description queries
SELECT '=== ADDING DESCRIPTION INDEXES ===' as step;

-- Index for portfolio projects with descriptions
CREATE INDEX IF NOT EXISTS idx_portfolio_project_translations_has_description 
ON public.portfolio_project_translations(portfolio_project_id) 
WHERE description IS NOT NULL AND LENGTH(description) > 0;

-- 26. Final optimization: Update table statistics
SELECT '=== UPDATING TABLE STATISTICS ===' as step;

-- Update statistics for all tables
ANALYZE public.blog_posts;
ANALYZE public.blog_post_translations;
ANALYZE public.portfolio_projects;
ANALYZE public.portfolio_project_translations;
ANALYZE public.tags;
ANALYZE public.tag_translations;
ANALYZE public.blog_post_tags;
ANALYZE public.languages;
ANALYZE public.users;

-- Check if activity_log table exists and analyze it
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'activity_log') THEN
        EXECUTE 'ANALYZE public.activity_log';
    END IF;
END $$;

-- Check if about_me tables exist and analyze them
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'about_me') THEN
        EXECUTE 'ANALYZE public.about_me';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'about_me_translations') THEN
        EXECUTE 'ANALYZE public.about_me_translations';
    END IF;
END $$;

-- Check if page_views table exists and analyze it
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'page_views') THEN
        EXECUTE 'ANALYZE public.page_views';
    END IF;
END $$;

-- Check if blog_post_categories table exists and analyze it
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_post_categories') THEN
        EXECUTE 'ANALYZE public.blog_post_categories';
    END IF;
END $$;

SELECT '=== OPTIMIZATION COMPLETE ===' as status;
SELECT 'All performance indexes have been added to your database.' as message;
SELECT 'Run the database-optimization-analysis.sql script to see the improvements.' as next_step; 