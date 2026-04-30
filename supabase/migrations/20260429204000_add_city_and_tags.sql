-- Adicionar campos 'city' e 'tags' para a tabela accounts para suportar filtros e detalhes de CRM
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS tags TEXT[];
