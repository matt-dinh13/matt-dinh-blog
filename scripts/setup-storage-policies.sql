-- Setup Storage Policies for blog-images bucket
-- Run this in your Supabase SQL Editor

-- 1. Create the bucket if it doesn't exist (this should already be done via UI)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow upload for authenticated" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;

-- 3. Create policy for authenticated users to upload to blog-images bucket
CREATE POLICY "Allow authenticated users to upload" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'blog-images' 
    AND auth.role() = 'authenticated'
  );

-- 4. Create policy for public read access to blog-images bucket
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT 
  USING (
    bucket_id = 'blog-images'
  );

-- 5. Create policy for authenticated users to update their uploads
CREATE POLICY "Allow authenticated users to update" ON storage.objects
  FOR UPDATE 
  USING (
    bucket_id = 'blog-images' 
    AND auth.role() = 'authenticated'
  );

-- 6. Create policy for authenticated users to delete their uploads
CREATE POLICY "Allow authenticated users to delete" ON storage.objects
  FOR DELETE 
  USING (
    bucket_id = 'blog-images' 
    AND auth.role() = 'authenticated'
  );

-- 7. Verify the policies were created
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND qual LIKE '%blog-images%'
ORDER BY policyname;

-- 8. Test the bucket exists
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets 
WHERE id = 'blog-images'; 