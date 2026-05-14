CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START 1000;

CREATE TABLE IF NOT EXISTS public.order_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL DEFAULT ('PED-' || nextval('public.order_number_seq')::TEXT),
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  is_manual_customer BOOLEAN DEFAULT false,
  save_customer_to_crm BOOLEAN DEFAULT false,
  customer_name TEXT,
  customer_cnpj TEXT,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  city TEXT,
  state TEXT,
  address TEXT,
  responsible TEXT,
  status TEXT DEFAULT 'Rascunho',
  notes TEXT,
  logo_url TEXT,
  subtotal NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  user_id UUID REFERENCES auth.users(id),
  loja_id UUID REFERENCES public.lojas(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_form_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_form_id UUID REFERENCES public.order_forms(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  description TEXT,
  quantity NUMERIC DEFAULT 1,
  unit TEXT DEFAULT 'Unidade',
  unit_price NUMERIC DEFAULT 0,
  total_price NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_form_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_forms_select" ON public.order_forms;
CREATE POLICY "order_forms_select" ON public.order_forms
  FOR SELECT TO authenticated USING (
    (public.get_user_role() = ANY (ARRAY['admin', 'gerente', 'gestor'])) OR 
    (user_id = auth.uid()) OR 
    (user_id IS NULL)
  );

DROP POLICY IF EXISTS "order_forms_insert" ON public.order_forms;
CREATE POLICY "order_forms_insert" ON public.order_forms
  FOR INSERT TO authenticated WITH CHECK (
    (public.get_user_role() = ANY (ARRAY['admin', 'gerente', 'gestor'])) OR 
    (user_id = auth.uid()) OR 
    (user_id IS NULL)
  );

DROP POLICY IF EXISTS "order_forms_update" ON public.order_forms;
CREATE POLICY "order_forms_update" ON public.order_forms
  FOR UPDATE TO authenticated USING (
    (public.get_user_role() = ANY (ARRAY['admin', 'gerente', 'gestor'])) OR 
    (user_id = auth.uid()) OR 
    (user_id IS NULL)
  );

DROP POLICY IF EXISTS "order_forms_delete" ON public.order_forms;
CREATE POLICY "order_forms_delete" ON public.order_forms
  FOR DELETE TO authenticated USING (
    (public.get_user_role() = ANY (ARRAY['admin', 'gerente', 'gestor'])) OR 
    (user_id = auth.uid()) OR 
    (user_id IS NULL)
  );

DROP POLICY IF EXISTS "order_form_items_all" ON public.order_form_items;
CREATE POLICY "order_form_items_all" ON public.order_form_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_forms_updated_at ON public.order_forms;
CREATE TRIGGER set_order_forms_updated_at
  BEFORE UPDATE ON public.order_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS set_order_forms_user_id ON public.order_forms;
CREATE TRIGGER set_order_forms_user_id
  BEFORE INSERT ON public.order_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.set_account_user_id();
