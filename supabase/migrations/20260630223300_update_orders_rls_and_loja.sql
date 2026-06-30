CREATE OR REPLACE FUNCTION public.set_order_forms_defaults()
RETURNS trigger AS $$
DECLARE
  v_loja_id UUID;
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  IF NEW.loja_id IS NULL THEN
    SELECT loja_id INTO v_loja_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
    IF v_loja_id IS NOT NULL THEN
      NEW.loja_id := v_loja_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_order_forms_user_id ON public.order_forms;
CREATE TRIGGER set_order_forms_user_id
  BEFORE INSERT ON public.order_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_forms_defaults();

DROP POLICY IF EXISTS "order_forms_select" ON public.order_forms;
CREATE POLICY "order_forms_select" ON public.order_forms
  FOR SELECT TO authenticated USING (
    (public.get_user_role() IN ('admin', 'gerente', 'gestor')) OR 
    (user_id = auth.uid()) OR 
    (user_id IS NULL) OR
    (loja_id = public.get_user_loja())
  );

DROP POLICY IF EXISTS "order_forms_insert" ON public.order_forms;
CREATE POLICY "order_forms_insert" ON public.order_forms
  FOR INSERT TO authenticated WITH CHECK (
    (public.get_user_role() IN ('admin', 'gerente', 'gestor')) OR 
    (user_id = auth.uid()) OR 
    (user_id IS NULL) OR
    (loja_id = public.get_user_loja())
  );

DROP POLICY IF EXISTS "order_forms_update" ON public.order_forms;
CREATE POLICY "order_forms_update" ON public.order_forms
  FOR UPDATE TO authenticated USING (
    (public.get_user_role() IN ('admin', 'gerente', 'gestor')) OR 
    (user_id = auth.uid()) OR 
    (user_id IS NULL) OR
    (loja_id = public.get_user_loja())
  ) WITH CHECK (
    (public.get_user_role() IN ('admin', 'gerente', 'gestor')) OR 
    (user_id = auth.uid()) OR 
    (user_id IS NULL) OR
    (loja_id = public.get_user_loja())
  );

DROP POLICY IF EXISTS "order_forms_delete" ON public.order_forms;
CREATE POLICY "order_forms_delete" ON public.order_forms
  FOR DELETE TO authenticated USING (
    (public.get_user_role() IN ('admin', 'gerente', 'gestor')) OR 
    (user_id = auth.uid()) OR 
    (user_id IS NULL) OR
    (loja_id = public.get_user_loja())
  );

DO $$
DECLARE
  new_user_id uuid;
  v_loja_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'lucasliranz@gmail.com') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'lucasliranz@gmail.com',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Lucas"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    INSERT INTO public.profiles (id, nome, role, ativo)
    VALUES (new_user_id, 'Lucas', 'admin', true)
    ON CONFLICT (id) DO NOTHING;

    SELECT id INTO v_loja_id FROM public.lojas LIMIT 1;
    IF v_loja_id IS NULL THEN
      INSERT INTO public.lojas (nome) VALUES ('Matriz') RETURNING id INTO v_loja_id;
    END IF;

    UPDATE public.profiles SET loja_id = v_loja_id WHERE id = new_user_id;
  END IF;
END $$;
