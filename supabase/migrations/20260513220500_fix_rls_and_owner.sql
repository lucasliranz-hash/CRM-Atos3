DO $$
DECLARE
  v_admin_id uuid;
BEGIN
  -- 1. Encontrar o ID do Admin (ou o primeiro usuario se nao houver)
  SELECT id INTO v_admin_id FROM public.profiles WHERE lower(role) IN ('admin', 'gerente', 'gestor') LIMIT 1;
  IF v_admin_id IS NULL THEN
    SELECT id INTO v_admin_id FROM auth.users LIMIT 1;
  END IF;

  -- 2. Atualizar todos os registros antigos sem dono para o admin
  IF v_admin_id IS NOT NULL THEN
    UPDATE public.accounts SET user_id = v_admin_id WHERE user_id IS NULL;
    UPDATE public.contacts SET user_id = v_admin_id WHERE user_id IS NULL;
    UPDATE public.opportunities SET user_id = v_admin_id WHERE user_id IS NULL;
    UPDATE public.activities SET user_id = v_admin_id WHERE user_id IS NULL;
    UPDATE public.proposals SET user_id = v_admin_id WHERE user_id IS NULL;
  END IF;
END $$;

-- 3. Função melhorada para role com tolerância a maiúsculas/minúsculas
CREATE OR REPLACE FUNCTION public.get_user_role()
 RETURNS text
 LANGUAGE sql
 SECURITY DEFINER
AS $$
  SELECT lower(role) FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 4. Ajustar as policies de SELECT para todas as tabelas principais
-- Garantir que Admin pode ver TUDO e Dono pode ver os seus (ou registros null).
DROP POLICY IF EXISTS "accounts_select" ON public.accounts;
CREATE POLICY "accounts_select" ON public.accounts
  FOR SELECT TO authenticated
  USING (
    public.get_user_role() IN ('admin', 'gerente', 'gestor') 
    OR user_id = auth.uid()
    OR user_id IS NULL
  );

DROP POLICY IF EXISTS "contacts_select" ON public.contacts;
CREATE POLICY "contacts_select" ON public.contacts
  FOR SELECT TO authenticated
  USING (
    public.get_user_role() IN ('admin', 'gerente', 'gestor') 
    OR user_id = auth.uid()
    OR user_id IS NULL
  );

DROP POLICY IF EXISTS "opportunities_select" ON public.opportunities;
CREATE POLICY "opportunities_select" ON public.opportunities
  FOR SELECT TO authenticated
  USING (
    public.get_user_role() IN ('admin', 'gerente', 'gestor') 
    OR user_id = auth.uid()
    OR user_id IS NULL
  );

DROP POLICY IF EXISTS "activities_select" ON public.activities;
CREATE POLICY "activities_select" ON public.activities
  FOR SELECT TO authenticated
  USING (
    public.get_user_role() IN ('admin', 'gerente', 'gestor') 
    OR user_id = auth.uid()
    OR user_id IS NULL
  );

DROP POLICY IF EXISTS "proposals_select" ON public.proposals;
CREATE POLICY "proposals_select" ON public.proposals
  FOR SELECT TO authenticated
  USING (
    public.get_user_role() IN ('admin', 'gerente', 'gestor') 
    OR user_id = auth.uid()
    OR user_id IS NULL
  );
