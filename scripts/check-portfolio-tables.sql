-- Check if portfolio tables exist
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('portfolio_projects', 'portfolio_translations')
ORDER BY table_name, ordinal_position;

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('portfolio_projects', 'portfolio_translations');

-- Check RLS policies for portfolio tables
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
WHERE tablename IN ('portfolio_projects', 'portfolio_translations'); 