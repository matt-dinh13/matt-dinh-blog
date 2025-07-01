-- Fix RLS policy to allow authenticated users to delete blog posts
-- This allows deletion even when author_id is null

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can delete their own blog posts" ON public.blog_posts;

-- Create a new policy that allows authenticated users to delete blog posts
CREATE POLICY "Authenticated users can delete blog posts" ON public.blog_posts
  FOR DELETE USING (auth.role() = 'authenticated');

-- Also fix the portfolio projects delete policy
DROP POLICY IF EXISTS "Users can delete their own portfolio projects" ON public.portfolio_projects;

CREATE POLICY "Authenticated users can delete portfolio projects" ON public.portfolio_projects
  FOR DELETE USING (auth.role() = 'authenticated');

-- Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('blog_posts', 'portfolio_projects') 
  AND cmd = 'DELETE'; 