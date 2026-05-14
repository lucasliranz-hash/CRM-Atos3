DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('company_logos', 'company_logos', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'])
  ON CONFLICT (id) DO UPDATE SET public = true;
END $$;

DROP POLICY IF EXISTS "Logos are publicly accessible." ON storage.objects;
CREATE POLICY "Logos are publicly accessible." ON storage.objects 
  FOR SELECT USING (bucket_id = 'company_logos');

DROP POLICY IF EXISTS "Users can upload logos." ON storage.objects;
CREATE POLICY "Users can upload logos." ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'company_logos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their logos." ON storage.objects;
CREATE POLICY "Users can update their logos." ON storage.objects 
  FOR UPDATE USING (bucket_id = 'company_logos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete their logos." ON storage.objects;
CREATE POLICY "Users can delete their logos." ON storage.objects 
  FOR DELETE USING (bucket_id = 'company_logos' AND auth.role() = 'authenticated');
