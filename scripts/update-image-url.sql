-- Update the blog post content to use the new image URL
UPDATE blog_post_translations 
SET content = REPLACE(
  content, 
  'https://jpejuoyhuuwlgqvtwtrm.supabase.co/storage/v1/object/public/blog-images/1752856746040-u0wxus.JPG',
  'https://jpejuoyhuuwlgqvtwtrm.supabase.co/storage/v1/object/public/blog-images/1752892073688-cje795.jpg'
)
WHERE blog_post_id = 36 
AND language_code = 'en';

-- Also update the Vietnamese version if it has the same image
UPDATE blog_post_translations 
SET content = REPLACE(
  content, 
  'https://jpejuoyhuuwlgqvtwtrm.supabase.co/storage/v1/object/public/blog-images/1752856746040-u0wxus.JPG',
  'https://jpejuoyhuuwlgqvtwtrm.supabase.co/storage/v1/object/public/blog-images/1752892073688-cje795.jpg'
)
WHERE blog_post_id = 36 
AND language_code = 'vi'; 