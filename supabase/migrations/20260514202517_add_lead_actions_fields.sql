DO $$
BEGIN
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS custom_type text;
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS description text;
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS status text DEFAULT 'Pendente';
END $$;
