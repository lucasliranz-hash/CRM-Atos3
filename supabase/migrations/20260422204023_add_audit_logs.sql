CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    loja_id UUID REFERENCES public.lojas(id)
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs_read" ON public.audit_logs;
CREATE POLICY "audit_logs_read" ON public.audit_logs
  FOR SELECT TO authenticated USING (
    (loja_id = get_user_loja()) OR (get_user_role() = 'admin')
  );

CREATE OR REPLACE FUNCTION public.log_contact_changes()
RETURNS trigger AS $function$
DECLARE
  v_user_id UUID;
  v_loja_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  IF TG_OP = 'INSERT' THEN
    v_loja_id := NEW.loja_id;
    INSERT INTO public.audit_logs (table_name, record_id, action, new_data, changed_by, loja_id)
    VALUES ('contacts', NEW.id, 'INSERT', row_to_json(NEW)::jsonb, v_user_id, v_loja_id);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    v_loja_id := NEW.loja_id;
    INSERT INTO public.audit_logs (table_name, record_id, action, old_data, new_data, changed_by, loja_id)
    VALUES ('contacts', NEW.id, 'UPDATE', row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb, v_user_id, v_loja_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    v_loja_id := OLD.loja_id;
    INSERT INTO public.audit_logs (table_name, record_id, action, old_data, changed_by, loja_id)
    VALUES ('contacts', OLD.id, 'DELETE', row_to_json(OLD)::jsonb, v_user_id, v_loja_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_contact_change ON public.contacts;
CREATE TRIGGER on_contact_change
  AFTER INSERT OR UPDATE OR DELETE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.log_contact_changes();
