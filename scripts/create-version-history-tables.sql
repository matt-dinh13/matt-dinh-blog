-- Create blog_post_versions table for version history
CREATE TABLE IF NOT EXISTS blog_post_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title_vi TEXT,
  title_en TEXT,
  content_vi TEXT,
  content_en TEXT,
  summary_vi TEXT,
  summary_en TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  category_id UUID REFERENCES categories(id),
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  change_summary TEXT,
  is_auto_save BOOLEAN DEFAULT false
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_blog_post_versions_post_id ON blog_post_versions(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_versions_version ON blog_post_versions(blog_post_id, version_number);
CREATE INDEX IF NOT EXISTS idx_blog_post_versions_created_at ON blog_post_versions(created_at);

-- Create unique constraint to prevent duplicate versions
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_post_versions_unique 
ON blog_post_versions(blog_post_id, version_number);

-- Enable RLS
ALTER TABLE blog_post_versions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view versions of their own posts" ON blog_post_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM blog_posts 
      WHERE id = blog_post_versions.blog_post_id 
      AND author_id = auth.uid()
    )
  );

CREATE POLICY "Users can create versions of their own posts" ON blog_post_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM blog_posts 
      WHERE id = blog_post_versions.blog_post_id 
      AND author_id = auth.uid()
    )
  );

CREATE POLICY "Users can update versions of their own posts" ON blog_post_versions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM blog_posts 
      WHERE id = blog_post_versions.blog_post_id 
      AND author_id = auth.uid()
    )
  );

-- Create function to automatically create version when post is updated
CREATE OR REPLACE FUNCTION create_blog_post_version()
RETURNS TRIGGER AS $$
DECLARE
  next_version INTEGER;
  current_user_id UUID;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1 
  INTO next_version
  FROM blog_post_versions 
  WHERE blog_post_id = NEW.id;
  
  -- Create version record
  INSERT INTO blog_post_versions (
    blog_post_id,
    version_number,
    title_vi,
    title_en,
    content_vi,
    content_en,
    summary_vi,
    summary_en,
    status,
    category_id,
    thumbnail_url,
    created_by,
    change_summary,
    is_auto_save
  ) VALUES (
    NEW.id,
    next_version,
    OLD.title_vi,
    OLD.title_en,
    OLD.content_vi,
    OLD.content_en,
    OLD.summary_vi,
    OLD.summary_en,
    OLD.status,
    OLD.category_id,
    OLD.thumbnail_url,
    current_user_id,
    'Auto-saved version',
    true
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic version creation
DROP TRIGGER IF EXISTS trigger_create_blog_post_version ON blog_posts;
CREATE TRIGGER trigger_create_blog_post_version
  AFTER UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION create_blog_post_version();

-- Create function to manually create version
CREATE OR REPLACE FUNCTION create_manual_version(
  post_id UUID,
  change_desc TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  next_version INTEGER;
  version_id UUID;
  current_user_id UUID;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if user owns the post
  IF NOT EXISTS (
    SELECT 1 FROM blog_posts 
    WHERE id = post_id AND author_id = current_user_id
  ) THEN
    RAISE EXCEPTION 'You can only create versions for your own posts';
  END IF;
  
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1 
  INTO next_version
  FROM blog_post_versions 
  WHERE blog_post_id = post_id;
  
  -- Create version record
  INSERT INTO blog_post_versions (
    blog_post_id,
    version_number,
    title_vi,
    title_en,
    content_vi,
    content_en,
    summary_vi,
    summary_en,
    status,
    category_id,
    thumbnail_url,
    created_by,
    change_summary,
    is_auto_save
  ) 
  SELECT 
    post_id,
    next_version,
    title_vi,
    title_en,
    content_vi,
    content_en,
    summary_vi,
    summary_en,
    status,
    category_id,
    thumbnail_url,
    current_user_id,
    COALESCE(change_desc, 'Manual version'),
    false
  FROM blog_posts 
  WHERE id = post_id;
  
  -- Get the created version ID
  SELECT id INTO version_id
  FROM blog_post_versions 
  WHERE blog_post_id = post_id AND version_number = next_version;
  
  RETURN version_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON blog_post_versions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_manual_version TO anon, authenticated;
