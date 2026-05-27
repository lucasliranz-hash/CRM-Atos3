DO $$
BEGIN
  UPDATE public.accounts 
  SET "pipelineStage" = 'Prospecção' 
  WHERE "pipelineStage" IS NULL OR "pipelineStage" = '';

  UPDATE public.accounts 
  SET status = 'Novo Lead' 
  WHERE status IS NULL OR status = '';
END $$;
