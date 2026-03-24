-- Setup Core Tables for Atos3 CRM with RLS

DO $$
BEGIN
  -- Lojas (Stores)
  CREATE TABLE IF NOT EXISTS public.lojas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Profiles linked to auth.users
  CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nome TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'gerente', 'vendedor')) DEFAULT 'vendedor',
    loja_id UUID REFERENCES public.lojas(id),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Accounts (Leads)
  CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    website TEXT,
    phone TEXT,
    segment TEXT,
    "fleetModel" TEXT,
    "fleetEstimate" INT,
    "leadSource" TEXT,
    "detailedSource" TEXT,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    "icpFit" TEXT,
    "interestLevel" TEXT,
    "accountPotential" TEXT,
    "nextAction" TEXT,
    "nextActionDate" TIMESTAMPTZ,
    "lastTouchDate" TIMESTAMPTZ,
    "cadenceStage" TEXT,
    "lossReason" TEXT,
    loja_id UUID REFERENCES public.lojas(id),
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
  );

  -- Contacts
  CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "accountId" UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT,
    "processRole" TEXT,
    linkedin TEXT,
    email TEXT,
    whatsapp TEXT,
    "preferredChannel" TEXT,
    "isDecisionMaker" BOOLEAN DEFAULT false,
    "isInfluencer" BOOLEAN DEFAULT false,
    "isChampion" BOOLEAN DEFAULT false,
    loja_id UUID REFERENCES public.lojas(id),
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
  );

  -- Activities
  CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "accountId" UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    "contactId" UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    date TIMESTAMPTZ NOT NULL,
    channel TEXT,
    type TEXT NOT NULL,
    result TEXT,
    "nextAction" TEXT,
    "nextActionDate" TIMESTAMPTZ,
    completed BOOLEAN DEFAULT false,
    loja_id UUID REFERENCES public.lojas(id),
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
  );

  -- Opportunities
  CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "accountId" UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    stage TEXT NOT NULL,
    mrr NUMERIC DEFAULT 0,
    setup NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    probability INT DEFAULT 0,
    "lossReason" TEXT,
    "closeDate" TIMESTAMPTZ,
    "nextAction" TEXT,
    "nextActionDate" TIMESTAMPTZ,
    loja_id UUID REFERENCES public.lojas(id),
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
  );
END $$;

-- Trigger to create profile automatically on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, role, loja_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'vendedor'),
    NULLIF(NEW.raw_user_meta_data->>'loja_id', '')::uuid
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE public.lojas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Security helper functions
CREATE OR REPLACE FUNCTION public.get_user_role() RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_loja() RETURNS UUID AS $$
  SELECT loja_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Policies for Lojas
DROP POLICY IF EXISTS "lojas_read" ON public.lojas;
CREATE POLICY "lojas_read" ON public.lojas FOR SELECT USING (true);

-- Policies for Profiles
DROP POLICY IF EXISTS "profiles_read" ON public.profiles;
CREATE POLICY "profiles_read" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.get_user_role() = 'admin');

DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.get_user_role() = 'admin');

-- Policies for Accounts
DROP POLICY IF EXISTS "accounts_all" ON public.accounts;
CREATE POLICY "accounts_all" ON public.accounts FOR ALL USING (
  public.get_user_role() = 'admin' OR loja_id = public.get_user_loja()
);

-- Policies for Contacts
DROP POLICY IF EXISTS "contacts_all" ON public.contacts;
CREATE POLICY "contacts_all" ON public.contacts FOR ALL USING (
  public.get_user_role() = 'admin' OR loja_id = public.get_user_loja()
);

-- Policies for Activities
DROP POLICY IF EXISTS "activities_all" ON public.activities;
CREATE POLICY "activities_all" ON public.activities FOR ALL USING (
  public.get_user_role() = 'admin' OR loja_id = public.get_user_loja()
);

-- Policies for Opportunities
DROP POLICY IF EXISTS "opportunities_all" ON public.opportunities;
CREATE POLICY "opportunities_all" ON public.opportunities FOR ALL USING (
  public.get_user_role() = 'admin' OR loja_id = public.get_user_loja()
);

-- Seed Data (Users and Store)
DO $seed$
DECLARE
  v_loja1_id uuid := '11111111-1111-1111-1111-111111111111';
  v_admin_id uuid;
  v_seller_id uuid;
  v_lucas_id uuid;
BEGIN
  -- Default Store
  INSERT INTO public.lojas (id, nome) VALUES (v_loja1_id, 'Matriz São Paulo') ON CONFLICT (id) DO NOTHING;

  -- Admin User
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@atos3.com') THEN
    v_admin_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token)
    VALUES (v_admin_id, '00000000-0000-0000-0000-000000000000', 'admin@atos3.com', crypt('senha123', gen_salt('bf')), NOW(), jsonb_build_object('nome', 'Admin Demo', 'role', 'admin', 'loja_id', v_loja1_id), '', '', '', '', '', NULL, '', '');
  END IF;

  -- Seller User
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'vendedor@loja1.com') THEN
    v_seller_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token)
    VALUES (v_seller_id, '00000000-0000-0000-0000-000000000000', 'vendedor@loja1.com', crypt('senha123', gen_salt('bf')), NOW(), jsonb_build_object('nome', 'Vendedor Demo', 'role', 'vendedor', 'loja_id', v_loja1_id), '', '', '', '', '', NULL, '', '');
  END IF;

  -- Lucas Liranzo (Admin)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'lucasliranz@gmail.com') THEN
    v_lucas_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token)
    VALUES (v_lucas_id, '00000000-0000-0000-0000-000000000000', 'lucasliranz@gmail.com', crypt('securepassword123', gen_salt('bf')), NOW(), jsonb_build_object('nome', 'Lucas Liranzo', 'role', 'admin', 'loja_id', v_loja1_id), '', '', '', '', '', NULL, '', '');
  END IF;
END $seed$;
