DO $$
BEGIN
  -- company
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "website" TEXT;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "cnpj" TEXT;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "segment" TEXT;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "source" TEXT;
  
  -- contact
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "contactRole" TEXT;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "whatsapp" TEXT;
  
  -- location
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "address" TEXT;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "number" TEXT;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "district" TEXT;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "city" TEXT;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "state" TEXT;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "zip_code" TEXT;
  
  -- fleet
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "vehicleCount" INTEGER;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "fleetModel" TEXT;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "fleet_notes" TEXT;
  
  -- commercial
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "solutionInterest" TEXT;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "leadTemperature" TEXT;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "accountPotential" TEXT;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "nextAction" TEXT;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "nextActionDate" TIMESTAMPTZ;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "nextActionTime" TIME;
  ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "nextActionNotes" TEXT;
END $$;
