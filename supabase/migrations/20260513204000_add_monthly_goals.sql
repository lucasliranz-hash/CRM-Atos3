CREATE TABLE IF NOT EXISTS public.monthly_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month VARCHAR(7) NOT NULL,
  leads_goal INTEGER NOT NULL DEFAULT 100,
  meetings_goal INTEGER NOT NULL DEFAULT 15,
  proposals_goal INTEGER NOT NULL DEFAULT 8,
  sales_goal INTEGER NOT NULL DEFAULT 4,
  loja_id UUID REFERENCES public.lojas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for unique per month, loja and user
CREATE UNIQUE INDEX IF NOT EXISTS monthly_goals_month_loja_user_idx 
  ON public.monthly_goals (month, COALESCE(loja_id, '00000000-0000-0000-0000-000000000000'::uuid), COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid));

ALTER TABLE public.monthly_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "monthly_goals_all" ON public.monthly_goals;
CREATE POLICY "monthly_goals_all" ON public.monthly_goals
  FOR ALL TO public USING (
    (get_user_role() = 'admin'::text) OR (loja_id = get_user_loja())
  );
