-- Debug portfolio tables
SELECT 'Portfolio Projects Table' as table_name;
SELECT COUNT(*) as project_count FROM public.portfolio_projects;

SELECT 'Portfolio Translations Table' as table_name;
SELECT COUNT(*) as translation_count FROM public.portfolio_project_translations;

SELECT 'Sample Portfolio Data' as info;
SELECT 
    pp.id,
    pp.slug,
    pp.status,
    pp.thumbnail_url,
    ppt.language_code,
    ppt.title
FROM public.portfolio_projects pp
LEFT JOIN public.portfolio_project_translations ppt ON pp.id = ppt.portfolio_project_id
ORDER BY pp.id, ppt.language_code; 