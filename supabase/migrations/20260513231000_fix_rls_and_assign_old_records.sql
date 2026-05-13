DO $$
DECLARE
  v_admin_id UUID;
BEGIN
  -- Try to find an admin profile (prioritizing the oldest one)
  SELECT id INTO v_admin_id FROM public.profiles WHERE role IN ('admin', 'gerente', 'gestor') ORDER BY created_at ASC LIMIT 1;
  
  -- If no admin profile, just pick the first profile
  IF v_admin_id IS NULL THEN
    SELECT id INTO v_admin_id FROM public.profiles ORDER BY created_at ASC LIMIT 1;
  END IF;
  
  -- Fallback to first user in auth.users if no profiles exist
  IF v_admin_id IS NULL THEN
    SELECT id INTO v_admin_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  END IF;

  IF v_admin_id IS NOT NULL THEN
    -- Assign owner to old records where user_id is null
    UPDATE public.accounts SET user_id = v_admin_id WHERE user_id IS NULL;
    UPDATE public.contacts SET user_id = v_admin_id WHERE user_id IS NULL;
    UPDATE public.opportunities SET user_id = v_admin_id WHERE user_id IS NULL;
    UPDATE public.activities SET user_id = v_admin_id WHERE user_id IS NULL;
    UPDATE public.proposals SET user_id = v_admin_id WHERE user_id IS NULL;
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "accounts_select" ON public.accounts;
DROP POLICY IF EXISTS "accounts_insert" ON public.accounts;
DROP POLICY IF EXISTS "accounts_update" ON public.accounts;
DROP POLICY IF EXISTS "accounts_delete" ON public.accounts;

DROP POLICY IF EXISTS "contacts_select" ON public.contacts;
DROP POLICY IF EXISTS "contacts_insert" ON public.contacts;
DROP POLICY IF EXISTS "contacts_update" ON public.contacts;
DROP POLICY IF EXISTS "contacts_delete" ON public.contacts;

DROP POLICY IF EXISTS "activities_select" ON public.activities;
DROP POLICY IF EXISTS "activities_insert" ON public.activities;
DROP POLICY IF EXISTS "activities_update" ON public.activities;
DROP POLICY IF EXISTS "activities_delete" ON public.activities;

DROP POLICY IF EXISTS "opportunities_select" ON public.opportunities;
DROP POLICY IF EXISTS "opportunities_insert" ON public.opportunities;
DROP POLICY IF EXISTS "opportunities_update" ON public.opportunities;
DROP POLICY IF EXISTS "opportunities_delete" ON public.opportunities;

DROP POLICY IF EXISTS "proposals_select" ON public.proposals;
DROP POLICY IF EXISTS "proposals_insert" ON public.proposals;
DROP POLICY IF EXISTS "proposals_update" ON public.proposals;
DROP POLICY IF EXISTS "proposals_delete" ON public.proposals;

-- Recreate policies with 'admin', 'gerente', and 'gestor'
-- ACCOUNTS
CREATE POLICY "accounts_select" ON public.accounts FOR SELECT TO authenticated USING (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
);
CREATE POLICY "accounts_insert" ON public.accounts FOR INSERT TO authenticated WITH CHECK (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR user_id IS NULL
);
CREATE POLICY "accounts_update" ON public.accounts FOR UPDATE TO authenticated USING (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
) WITH CHECK (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
);
CREATE POLICY "accounts_delete" ON public.accounts FOR DELETE TO authenticated USING (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
);

-- CONTACTS
CREATE POLICY "contacts_select" ON public.contacts FOR SELECT TO authenticated USING (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
);
CREATE POLICY "contacts_insert" ON public.contacts FOR INSERT TO authenticated WITH CHECK (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR user_id IS NULL
);
CREATE POLICY "contacts_update" ON public.contacts FOR UPDATE TO authenticated USING (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
) WITH CHECK (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
);
CREATE POLICY "contacts_delete" ON public.contacts FOR DELETE TO authenticated USING (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
);

-- ACTIVITIES
CREATE POLICY "activities_select" ON public.activities FOR SELECT TO authenticated USING (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
);
CREATE POLICY "activities_insert" ON public.activities FOR INSERT TO authenticated WITH CHECK (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR user_id IS NULL
);
CREATE POLICY "activities_update" ON public.activities FOR UPDATE TO authenticated USING (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
) WITH CHECK (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
);
CREATE POLICY "activities_delete" ON public.activities FOR DELETE TO authenticated USING (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
);

-- OPPORTUNITIES
CREATE POLICY "opportunities_select" ON public.opportunities FOR SELECT TO authenticated USING (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
);
CREATE POLICY "opportunities_insert" ON public.opportunities FOR INSERT TO authenticated WITH CHECK (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR user_id IS NULL
);
CREATE POLICY "opportunities_update" ON public.opportunities FOR UPDATE TO authenticated USING (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
) WITH CHECK (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
);
CREATE POLICY "opportunities_delete" ON public.opportunities FOR DELETE TO authenticated USING (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
);

-- PROPOSALS
CREATE POLICY "proposals_select" ON public.proposals FOR SELECT TO authenticated USING (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
);
CREATE POLICY "proposals_insert" ON public.proposals FOR INSERT TO authenticated WITH CHECK (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR user_id IS NULL
);
CREATE POLICY "proposals_update" ON public.proposals FOR UPDATE TO authenticated USING (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
) WITH CHECK (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
);
CREATE POLICY "proposals_delete" ON public.proposals FOR DELETE TO authenticated USING (
  get_user_role() IN ('admin', 'gerente', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL)
);
