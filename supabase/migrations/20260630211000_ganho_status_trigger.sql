-- Auto-set pipelineStage and nextActionStatus when status = 'Ganho'
-- Ensures data integrity: Ganho leads are always in 'Fechado' pipeline stage

CREATE OR REPLACE FUNCTION public.auto_ganho_status()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'Ganho' THEN
    NEW."pipelineStage" := 'Fechado';
    NEW."nextActionStatus" := 'Concluída';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS auto_ganho_status_trigger ON public.accounts;
CREATE TRIGGER auto_ganho_status_trigger
  BEFORE INSERT OR UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.auto_ganho_status();

-- Backfill: ensure existing Ganho accounts have correct pipelineStage
UPDATE public.accounts
SET "pipelineStage" = 'Fechado',
    "nextActionStatus" = 'Concluída'
WHERE status = 'Ganho'
  AND COALESCE("pipelineStage", '') <> 'Fechado';

-- Backfill: ensure accounts in 'Fechado' pipeline with no explicit status get 'Ganho'
UPDATE public.accounts
SET status = 'Ganho'
WHERE "pipelineStage" = 'Fechado'
  AND COALESCE(status, '') NOT IN ('Ganho', 'Perdido', 'Cliente');
