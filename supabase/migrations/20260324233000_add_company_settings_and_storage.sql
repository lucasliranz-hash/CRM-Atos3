DO $$ 
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('company_logos', 'company_logos', true)
    ON CONFLICT (id) DO NOTHING;
END $$;

CREATE TABLE IF NOT EXISTS public.company_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loja_id UUID REFERENCES public.lojas(id) ON DELETE CASCADE,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(loja_id)
);

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "company_settings_all" ON public.company_settings;
CREATE POLICY "company_settings_all" ON public.company_settings
    FOR ALL TO public USING (loja_id = public.get_user_loja() OR public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "Public Access Logos" ON storage.objects;
CREATE POLICY "Public Access Logos" ON storage.objects FOR SELECT USING (bucket_id = 'company_logos');

DROP POLICY IF EXISTS "Auth Insert Logos" ON storage.objects;
CREATE POLICY "Auth Insert Logos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'company_logos');

DROP POLICY IF EXISTS "Auth Update Logos" ON storage.objects;
CREATE POLICY "Auth Update Logos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'company_logos');
