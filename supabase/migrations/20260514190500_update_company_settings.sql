DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('company-assets', 'company-assets', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'])
  ON CONFLICT (id) DO UPDATE SET public = true;
END $$;

DROP POLICY IF EXISTS "Assets are publicly accessible." ON storage.objects;
CREATE POLICY "Assets are publicly accessible." ON storage.objects 
  FOR SELECT USING (bucket_id = 'company-assets');

DROP POLICY IF EXISTS "Users can upload assets." ON storage.objects;
CREATE POLICY "Users can upload assets." ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'company-assets' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their assets." ON storage.objects;
CREATE POLICY "Users can update their assets." ON storage.objects 
  FOR UPDATE USING (bucket_id = 'company-assets' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete their assets." ON storage.objects;
CREATE POLICY "Users can delete their assets." ON storage.objects 
  FOR DELETE USING (bucket_id = 'company-assets' AND auth.role() = 'authenticated');

ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
