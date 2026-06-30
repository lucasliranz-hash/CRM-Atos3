ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "lossDate" timestamp with time zone;
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS "clientSince" timestamp with time zone;

CREATE OR REPLACE FUNCTION public.auto_status_handler()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'Ganho' THEN
    NEW."pipelineStage" := 'Fechado';
    NEW."nextActionStatus" := 'Concluída';
    IF OLD.status IS NULL OR OLD.status <> 'Ganho' THEN
      NEW."clientSince" := NOW();
    END IF;
  ELSIF NEW.status = 'Perdido' THEN
    NEW."pipelineStage" := 'Perdido';
    IF OLD.status IS NULL OR OLD.status <> 'Perdido' THEN
      NEW."lossDate" := NOW();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS auto_ganho_status_trigger ON public.accounts;
CREATE TRIGGER auto_ganho_status_trigger
  BEFORE INSERT OR UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.auto_status_handler();

UPDATE public.accounts
SET "lossDate" = COALESCE("lossDate", "updatedAt")
WHERE status = 'Perdido' AND "lossDate" IS NULL;

UPDATE public.accounts
SET "clientSince" = COALESCE("clientSince", "updatedAt")
WHERE status = 'Ganho' AND "clientSince" IS NULL;
