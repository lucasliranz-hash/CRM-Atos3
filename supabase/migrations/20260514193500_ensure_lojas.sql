DO $$
DECLARE
  v_default_loja uuid;
BEGIN
  -- Insert a default loja if there are none
  IF NOT EXISTS (SELECT 1 FROM public.lojas) THEN
    INSERT INTO public.lojas (nome) VALUES ('Matriz ATOS3') RETURNING id INTO v_default_loja;
  ELSE
    SELECT id INTO v_default_loja FROM public.lojas ORDER BY created_at ASC LIMIT 1;
  END IF;

  -- Update profiles that have no loja_id
  UPDATE public.profiles SET loja_id = v_default_loja WHERE loja_id IS NULL;
END $$;
