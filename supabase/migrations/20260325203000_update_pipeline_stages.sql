DO $$
BEGIN
  UPDATE public.opportunities SET stage = 'Fechado Ganho' WHERE stage = 'Fechado ganho';
  UPDATE public.opportunities SET stage = 'Fechado Perdido' WHERE stage = 'Fechado perdido';
  
  UPDATE public.activities SET result = 'Fechado Ganho' WHERE result = 'Fechado ganho';
  UPDATE public.activities SET result = 'Fechado Perdido' WHERE result = 'Fechado perdido';
END $$;
