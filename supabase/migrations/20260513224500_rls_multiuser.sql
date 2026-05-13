-- 1. Adicionar user_id às tabelas
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Garantir que o RLS está ativado
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "accounts_all" ON public.accounts;
DROP POLICY IF EXISTS "contacts_all" ON public.contacts;
DROP POLICY IF EXISTS "activities_all" ON public.activities;
DROP POLICY IF EXISTS "opportunities_all" ON public.opportunities;
DROP POLICY IF EXISTS "proposals_all" ON public.proposals;
DROP POLICY IF EXISTS "audit_logs_read" ON public.audit_logs;

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

-- 4. Função para auto-atribuir owner na criação de conta
CREATE OR REPLACE FUNCTION public.set_account_user_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_accounts_user_id ON public.accounts;
CREATE TRIGGER set_accounts_user_id
  BEFORE INSERT ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_account_user_id();

-- 5. Função para sincronizar owner das dependências com o owner da conta
CREATE OR REPLACE FUNCTION public.set_dependent_user_id()
RETURNS trigger AS $$
DECLARE
  v_account_user_id UUID;
BEGIN
  IF NEW."accountId" IS NOT NULL THEN
    SELECT user_id INTO v_account_user_id FROM public.accounts WHERE id = NEW."accountId";
    IF v_account_user_id IS NOT NULL THEN
      NEW.user_id := v_account_user_id;
    ELSIF NEW.user_id IS NULL THEN
      NEW.user_id := auth.uid();
    END IF;
  ELSIF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_contacts_user_id ON public.contacts;
CREATE TRIGGER set_contacts_user_id BEFORE INSERT OR UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.set_dependent_user_id();

DROP TRIGGER IF EXISTS set_activities_user_id ON public.activities;
CREATE TRIGGER set_activities_user_id BEFORE INSERT OR UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.set_dependent_user_id();

DROP TRIGGER IF EXISTS set_opportunities_user_id ON public.opportunities;
CREATE TRIGGER set_opportunities_user_id BEFORE INSERT OR UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.set_dependent_user_id();

DROP TRIGGER IF EXISTS set_proposals_user_id ON public.proposals;
CREATE TRIGGER set_proposals_user_id BEFORE INSERT OR UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION public.set_dependent_user_id();

-- 6. Função para cascatear mudança de owner
CREATE OR REPLACE FUNCTION public.cascade_account_user_id()
RETURNS trigger AS $$
BEGIN
  IF OLD.user_id IS DISTINCT FROM NEW.user_id AND NEW.user_id IS NOT NULL THEN
    UPDATE public.contacts SET user_id = NEW.user_id WHERE "accountId" = NEW.id;
    UPDATE public.activities SET user_id = NEW.user_id WHERE "accountId" = NEW.id;
    UPDATE public.opportunities SET user_id = NEW.user_id WHERE "accountId" = NEW.id;
    UPDATE public.proposals SET user_id = NEW.user_id WHERE "accountId" = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS cascade_user_id_on_account_update ON public.accounts;
CREATE TRIGGER cascade_user_id_on_account_update
  AFTER UPDATE OF user_id ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.cascade_account_user_id();

-- 7. Políticas de RLS
-- ACCOUNTS
CREATE POLICY "accounts_select" ON public.accounts FOR SELECT TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
);
CREATE POLICY "accounts_insert" ON public.accounts FOR INSERT TO authenticated WITH CHECK (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR user_id IS NULL
);
CREATE POLICY "accounts_update" ON public.accounts FOR UPDATE TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
) WITH CHECK (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
);
CREATE POLICY "accounts_delete" ON public.accounts FOR DELETE TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
);

-- CONTACTS
CREATE POLICY "contacts_select" ON public.contacts FOR SELECT TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
);
CREATE POLICY "contacts_insert" ON public.contacts FOR INSERT TO authenticated WITH CHECK (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR user_id IS NULL
);
CREATE POLICY "contacts_update" ON public.contacts FOR UPDATE TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
) WITH CHECK (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
);
CREATE POLICY "contacts_delete" ON public.contacts FOR DELETE TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
);

-- ACTIVITIES
CREATE POLICY "activities_select" ON public.activities FOR SELECT TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
);
CREATE POLICY "activities_insert" ON public.activities FOR INSERT TO authenticated WITH CHECK (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR user_id IS NULL
);
CREATE POLICY "activities_update" ON public.activities FOR UPDATE TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
) WITH CHECK (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
);
CREATE POLICY "activities_delete" ON public.activities FOR DELETE TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
);

-- OPPORTUNITIES
CREATE POLICY "opportunities_select" ON public.opportunities FOR SELECT TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
);
CREATE POLICY "opportunities_insert" ON public.opportunities FOR INSERT TO authenticated WITH CHECK (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR user_id IS NULL
);
CREATE POLICY "opportunities_update" ON public.opportunities FOR UPDATE TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
) WITH CHECK (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
);
CREATE POLICY "opportunities_delete" ON public.opportunities FOR DELETE TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
);

-- PROPOSALS
CREATE POLICY "proposals_select" ON public.proposals FOR SELECT TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
);
CREATE POLICY "proposals_insert" ON public.proposals FOR INSERT TO authenticated WITH CHECK (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR user_id IS NULL
);
CREATE POLICY "proposals_update" ON public.proposals FOR UPDATE TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
) WITH CHECK (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
);
CREATE POLICY "proposals_delete" ON public.proposals FOR DELETE TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') OR user_id = auth.uid() OR (user_id IS NULL AND loja_id = get_user_loja())
);

-- AUDIT LOGS
CREATE POLICY "audit_logs_select" ON public.audit_logs FOR SELECT TO authenticated USING (
  get_user_role() IN ('admin', 'gestor') 
  OR changed_by = auth.uid()
  OR record_id IN (SELECT id FROM public.accounts WHERE user_id = auth.uid())
  OR record_id IN (SELECT id FROM public.contacts WHERE user_id = auth.uid())
  OR record_id IN (SELECT id FROM public.activities WHERE user_id = auth.uid())
  OR record_id IN (SELECT id FROM public.opportunities WHERE user_id = auth.uid())
  OR record_id IN (SELECT id FROM public.proposals WHERE user_id = auth.uid())
);
CREATE POLICY "audit_logs_insert" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (
  get_user_role() IN ('admin', 'gestor') OR changed_by = auth.uid() OR changed_by IS NULL
);

-- 8. Atribuir owner retroativamente aos leads antigos que não têm owner
DO $$
DECLARE
  r RECORD;
BEGIN
  -- Tenta achar o criador do lead no audit_logs (se houver histórico) ou vincula ao primeiro admin da loja
  FOR r IN SELECT id, loja_id FROM public.accounts WHERE user_id IS NULL LOOP
    UPDATE public.accounts
    SET user_id = (
      SELECT id FROM public.profiles 
      WHERE loja_id = r.loja_id AND role IN ('admin', 'gestor') 
      ORDER BY role ASC LIMIT 1
    )
    WHERE id = r.id;
  END LOOP;
END $$;
