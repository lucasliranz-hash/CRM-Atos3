DO $$
BEGIN
  ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
  ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS cover JSONB DEFAULT '{}'::jsonb;
  ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS terms JSONB DEFAULT '{}'::jsonb;
  ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS notes TEXT;
  ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS logo_url TEXT;

  DROP POLICY IF EXISTS "proposals_insert" ON public.proposals;
  CREATE POLICY "proposals_insert" ON public.proposals FOR INSERT TO authenticated WITH CHECK (true);
  
  DROP POLICY IF EXISTS "proposals_update" ON public.proposals;
  CREATE POLICY "proposals_update" ON public.proposals FOR UPDATE TO authenticated USING (true);
END $$;
