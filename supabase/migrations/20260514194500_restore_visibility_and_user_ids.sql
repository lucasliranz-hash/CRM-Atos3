DO $$
DECLARE
  v_admin_id UUID;
BEGIN
  -- 1. Identificar o primeiro usuário criado para ser o "dono" dos registros órfãos
  SELECT id INTO v_admin_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  
  -- 2. Corrigir registros antigos que estão sem user_id (órfãos), garantindo que sejam lidos pelo frontend
  IF v_admin_id IS NOT NULL THEN
    UPDATE public.accounts SET user_id = v_admin_id WHERE user_id IS NULL;
    UPDATE public.contacts SET user_id = v_admin_id WHERE user_id IS NULL;
    UPDATE public.opportunities SET user_id = v_admin_id WHERE user_id IS NULL;
    UPDATE public.activities SET user_id = v_admin_id WHERE user_id IS NULL;
    UPDATE public.proposals SET user_id = v_admin_id WHERE user_id IS NULL;
    UPDATE public.order_forms SET user_id = v_admin_id WHERE user_id IS NULL;
  END IF;
END $$;

-- 3. Ajuste do Row Level Security (RLS)
-- Como o sistema deve permitir visibilidade de todos os registros para o admin/equipe e 
-- estava ocorrendo bloqueio invisível, removemos o filtro excessivo de "user_id = auth.uid()" do RLS de leitura.
-- Isso permite a restauração imediata da visibilidade no Pipeline, Dashboard e outras telas.

DROP POLICY IF EXISTS "accounts_select" ON public.accounts;
CREATE POLICY "accounts_select" ON public.accounts FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "contacts_select" ON public.contacts;
CREATE POLICY "contacts_select" ON public.contacts FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "opportunities_select" ON public.opportunities;
CREATE POLICY "opportunities_select" ON public.opportunities FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "activities_select" ON public.activities;
CREATE POLICY "activities_select" ON public.activities FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "proposals_select" ON public.proposals;
CREATE POLICY "proposals_select" ON public.proposals FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "order_forms_select" ON public.order_forms;
CREATE POLICY "order_forms_select" ON public.order_forms FOR SELECT TO authenticated USING (true);
