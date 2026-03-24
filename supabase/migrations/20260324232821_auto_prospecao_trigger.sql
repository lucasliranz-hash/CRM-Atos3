-- Migração: Automatizar criação de Oportunidades na Prospecção e preenchimento de campos

-- 1. Função BEFORE INSERT na tabela accounts (Leads)
CREATE OR REPLACE FUNCTION public.handle_new_account_auto_pipeline()
RETURNS trigger AS $function$
BEGIN
  -- Regras Automáticas (Obrigatórias)
  -- Campos auto-preenchidos
  IF NEW."cadenceStage" IS NULL OR NEW."cadenceStage" = '' THEN NEW."cadenceStage" := '1º Toque'; END IF;
  IF NEW."interestLevel" IS NULL OR NEW."interestLevel" = '' THEN NEW."interestLevel" := 'Frio'; END IF;
  IF NEW."accountPotential" IS NULL OR NEW."accountPotential" = '' THEN NEW."accountPotential" := 'Médio'; END IF;
  IF NEW."detailedSource" IS NULL OR NEW."detailedSource" = '' THEN NEW."detailedSource" := 'Manual'; END IF;
  
  -- Próxima ação padrão
  IF NEW."nextAction" IS NULL OR NEW."nextAction" = '' THEN NEW."nextAction" := 'Contato inicial via WhatsApp'; END IF;
  IF NEW."nextActionDate" IS NULL THEN NEW."nextActionDate" := NOW(); END IF;
  
  -- Sempre "Prospecção" / "Em prospecção"
  IF NEW.status IS NULL OR NEW.status = 'Novo' THEN NEW.status := 'Em prospecção'; END IF;

  RETURN NEW;
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_account_created_auto_pipeline ON public.accounts;
CREATE TRIGGER on_account_created_auto_pipeline
  BEFORE INSERT ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_account_auto_pipeline();


-- 2. Função AFTER INSERT na tabela accounts para criar Oportunidade
CREATE OR REPLACE FUNCTION public.handle_new_account_after_insert()
RETURNS trigger AS $function$
BEGIN
  -- Etapa inicial: Sempre "Prospecção"
  INSERT INTO public.opportunities (
    "accountId", name, stage, "nextAction", "nextActionDate", loja_id, probability
  ) VALUES (
    NEW.id,
    NEW.name,
    'Prospecção',
    NEW."nextAction",
    NEW."nextActionDate",
    NEW.loja_id,
    10
  );
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_account_created_after_insert ON public.accounts;
CREATE TRIGGER on_account_created_after_insert
  AFTER INSERT ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_account_after_insert();


-- 3. Função AFTER INSERT na tabela contacts (caso o lead não tenha oportunidade)
CREATE OR REPLACE FUNCTION public.handle_new_contact_auto_pipeline()
RETURNS trigger AS $function$
DECLARE
  v_opp_exists BOOLEAN;
  v_acc_name TEXT;
BEGIN
  -- Evite repetição: Não crie atividades duplicadas
  SELECT EXISTS(
    SELECT 1 FROM public.opportunities WHERE "accountId" = NEW."accountId"
  ) INTO v_opp_exists;

  IF NOT v_opp_exists THEN
    SELECT name INTO v_acc_name FROM public.accounts WHERE id = NEW."accountId";
    
    -- Atualiza a conta com os padrões iniciais
    UPDATE public.accounts SET 
      "nextAction" = COALESCE("nextAction", 'Contato inicial via WhatsApp'),
      "nextActionDate" = COALESCE("nextActionDate", NOW()),
      "cadenceStage" = COALESCE("cadenceStage", '1º Toque'),
      "interestLevel" = COALESCE("interestLevel", 'Frio'),
      "accountPotential" = COALESCE("accountPotential", 'Médio'),
      "status" = 'Em prospecção'
    WHERE id = NEW."accountId";

    -- Cria a Oportunidade na primeira etapa
    INSERT INTO public.opportunities (
      "accountId", name, stage, "nextAction", "nextActionDate", loja_id, probability
    ) VALUES (
      NEW."accountId",
      COALESCE(v_acc_name, 'Contato ' || NEW.name),
      'Prospecção',
      'Contato inicial via WhatsApp',
      NOW(),
      NEW.loja_id,
      10
    );
  END IF;
  
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_contact_created_auto_pipeline ON public.contacts;
CREATE TRIGGER on_contact_created_auto_pipeline
  AFTER INSERT ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_contact_auto_pipeline();
