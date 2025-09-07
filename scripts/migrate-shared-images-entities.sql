-- Add entity columns if not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shared_images' AND column_name = 'entity_type'
  ) THEN
    ALTER TABLE shared_images ADD COLUMN entity_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shared_images' AND column_name = 'entity_id'
  ) THEN
    ALTER TABLE shared_images ADD COLUMN entity_id integer;
  END IF;
END $$;

-- Backfill for existing blog rows (one-time)
UPDATE shared_images
SET entity_type = 'blog',
    entity_id   = COALESCE(entity_id, blog_post_id)
WHERE entity_type IS NULL;

-- Make future rows require entity fields
ALTER TABLE shared_images
  ALTER COLUMN entity_type SET DEFAULT 'blog';

-- Optional: keep blog_post_id for backward compatibility; remove later if desired
-- CREATE INDEXES
CREATE INDEX IF NOT EXISTS idx_shared_images_entity ON shared_images (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_shared_images_uploaded_at ON shared_images (uploaded_at DESC); 