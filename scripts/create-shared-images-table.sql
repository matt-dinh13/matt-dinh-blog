-- Create Shared Images Table for Cross-Language Image Management
-- This allows images to be uploaded once and reused across all language translations

-- 1. Create shared_images table
CREATE TABLE IF NOT EXISTS public.shared_images (
    id SERIAL PRIMARY KEY,
    blog_post_id INTEGER NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    original_filename TEXT,
    file_size INTEGER,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(blog_post_id, image_url)
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shared_images_blog_post_id ON public.shared_images(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_shared_images_active ON public.shared_images(is_active);

-- 3. Enable Row Level Security
ALTER TABLE public.shared_images ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
DROP POLICY IF EXISTS "Anyone can view shared images" ON public.shared_images;
CREATE POLICY "Anyone can view shared images" ON public.shared_images
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage shared images" ON public.shared_images;
CREATE POLICY "Authenticated users can manage shared images" ON public.shared_images
    FOR ALL USING (auth.role() = 'authenticated');

-- 5. Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_shared_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.uploaded_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_shared_images_updated_at ON public.shared_images;
CREATE TRIGGER update_shared_images_updated_at
    BEFORE UPDATE ON public.shared_images
    FOR EACH ROW EXECUTE FUNCTION public.update_shared_images_updated_at();

-- 6. Create function to sync images across translations
CREATE OR REPLACE FUNCTION sync_images_across_translations(
    p_blog_post_id INTEGER,
    p_image_url TEXT,
    p_original_filename TEXT DEFAULT NULL,
    p_file_size INTEGER DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_image_id INTEGER;
    v_language_code TEXT;
    v_current_content TEXT;
    v_new_content TEXT;
    v_image_markdown TEXT;
BEGIN
    -- Insert or update the shared image record
    INSERT INTO public.shared_images (blog_post_id, image_url, original_filename, file_size, uploaded_by)
    VALUES (p_blog_post_id, p_image_url, p_original_filename, p_file_size, auth.uid())
    ON CONFLICT (blog_post_id, image_url) DO UPDATE SET
        uploaded_at = NOW(),
        uploaded_by = auth.uid()
    RETURNING id INTO v_image_id;
    
    -- Create the markdown image syntax
    v_image_markdown := '![](' || p_image_url || ')';
    
    -- Get all language translations for this blog post
    FOR v_language_code IN 
        SELECT DISTINCT language_code 
        FROM public.blog_post_translations 
        WHERE blog_post_id = p_blog_post_id
    LOOP
        -- Get current content for this language
        SELECT content INTO v_current_content
        FROM public.blog_post_translations
        WHERE blog_post_id = p_blog_post_id AND language_code = v_language_code;
        
        -- Add the image to the content if it's not already there
        IF v_current_content IS NULL THEN
            v_new_content := v_image_markdown;
        ELSIF v_current_content NOT LIKE '%' || p_image_url || '%' THEN
            v_new_content := v_current_content || E'\n\n' || v_image_markdown;
        ELSE
            v_new_content := v_current_content;
        END IF;
        
        -- Update the translation content
        UPDATE public.blog_post_translations
        SET content = v_new_content,
            updated_at = NOW()
        WHERE blog_post_id = p_blog_post_id AND language_code = v_language_code;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create function to get shared images for a blog post
CREATE OR REPLACE FUNCTION get_shared_images(p_blog_post_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    image_url TEXT,
    original_filename TEXT,
    file_size INTEGER,
    uploaded_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        si.id,
        si.image_url,
        si.original_filename,
        si.file_size,
        si.uploaded_at
    FROM public.shared_images si
    WHERE si.blog_post_id = p_blog_post_id
    AND si.is_active = TRUE
    ORDER BY si.uploaded_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create function to remove shared image from all translations
CREATE OR REPLACE FUNCTION remove_shared_image(
    p_blog_post_id INTEGER,
    p_image_url TEXT
)
RETURNS VOID AS $$
DECLARE
    v_language_code TEXT;
    v_current_content TEXT;
    v_new_content TEXT;
BEGIN
    -- Mark the shared image as inactive
    UPDATE public.shared_images
    SET is_active = FALSE
    WHERE blog_post_id = p_blog_post_id AND image_url = p_image_url;
    
    -- Remove the image from all language translations
    FOR v_language_code IN 
        SELECT DISTINCT language_code 
        FROM public.blog_post_translations 
        WHERE blog_post_id = p_blog_post_id
    LOOP
        -- Get current content for this language
        SELECT content INTO v_current_content
        FROM public.blog_post_translations
        WHERE blog_post_id = p_blog_post_id AND language_code = v_language_code;
        
        -- Remove the image markdown from content
        IF v_current_content IS NOT NULL THEN
            v_new_content := regexp_replace(v_current_content, '!\[([^\]]*)\]\(' || p_image_url || '\)', '', 'g');
            v_new_content := regexp_replace(v_new_content, '\n\s*\n\s*\n', '\n\n', 'g'); -- Clean up extra newlines
            
            -- Update the translation content
            UPDATE public.blog_post_translations
            SET content = v_new_content,
                updated_at = NOW()
            WHERE blog_post_id = p_blog_post_id AND language_code = v_language_code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant necessary permissions
GRANT EXECUTE ON FUNCTION sync_images_across_translations(INTEGER, TEXT, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_shared_images(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_shared_image(INTEGER, TEXT) TO authenticated;

-- 10. Add comments for documentation
COMMENT ON TABLE public.shared_images IS 'Stores images that are shared across all language translations of a blog post';
COMMENT ON FUNCTION sync_images_across_translations IS 'Adds an image to all language translations of a blog post';
COMMENT ON FUNCTION get_shared_images IS 'Retrieves all shared images for a specific blog post';
COMMENT ON FUNCTION remove_shared_image IS 'Removes an image from all language translations of a blog post'; 