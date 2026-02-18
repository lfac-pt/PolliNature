-- Enable Row Level Security (good practice to re-assert)
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- 1. Policy for ADMINS to UPDATE any site
DROP POLICY IF EXISTS "Admins can update any site" ON sites;
CREATE POLICY "Admins can update any site"
ON sites FOR UPDATE
USING (
  (auth.jwt() ->> 'email') IN ('lfac.pt@gmail.com', 'jloureiro@uc.pt')
)
WITH CHECK (
  (auth.jwt() ->> 'email') IN ('lfac.pt@gmail.com', 'jloureiro@uc.pt')
);

-- 2. Policy for ADMINS to DELETE any site
DROP POLICY IF EXISTS "Admins can delete any site" ON sites;
CREATE POLICY "Admins can delete any site"
ON sites FOR DELETE
USING (
  (auth.jwt() ->> 'email') IN ('lfac.pt@gmail.com', 'jloureiro@uc.pt')
);

-- 3. Policy for ADMINS to UPDATE any image
DROP POLICY IF EXISTS "Admins can update any image" ON storage.objects;
CREATE POLICY "Admins can update any image"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site_images' AND
  (auth.jwt() ->> 'email') IN ('lfac.pt@gmail.com', 'jloureiro@uc.pt')
);

-- 4. Policy for ADMINS to DELETE any image
DROP POLICY IF EXISTS "Admins can delete any image" ON storage.objects;
CREATE POLICY "Admins can delete any image"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site_images' AND
  (auth.jwt() ->> 'email') IN ('lfac.pt@gmail.com', 'jloureiro@uc.pt')
);
