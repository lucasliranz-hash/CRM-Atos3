ALTER TABLE public.accounts 
  ADD COLUMN IF NOT EXISTS "companyName" text,
  ADD COLUMN IF NOT EXISTS "contactName" text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS "pipelineStage" text DEFAULT 'Prospecção',
  ADD COLUMN IF NOT EXISTS "vehicleCount" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS notes text;

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS "companyName" text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text;

ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS title text;

CREATE TABLE IF NOT EXISTS public.proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "accountId" uuid REFERENCES public.accounts(id) ON DELETE CASCADE,
  "proposalNumber" text,
  "companyName" text,
  "contactName" text,
  "vehicleQuantity" integer,
  status text DEFAULT 'Rascunho',
  "totalSetup" numeric DEFAULT 0,
  "totalEquipment" numeric DEFAULT 0,
  "totalMonthly" numeric DEFAULT 0,
  value numeric DEFAULT 0,
  "travelFee" jsonb,
  loja_id uuid REFERENCES public.lojas(id),
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "proposals_all" ON public.proposals;
CREATE POLICY "proposals_all" ON public.proposals
  FOR ALL TO public
  USING ((get_user_role() = 'admin'::text) OR (loja_id = get_user_loja()));
