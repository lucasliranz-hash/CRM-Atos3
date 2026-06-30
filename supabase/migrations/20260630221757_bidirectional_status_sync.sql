-- Bidirectional status synchronization between accounts (leads) and proposals
-- Lead → Proposal: when account status changes, update linked proposals
-- Proposal → Lead: when proposal status changes, update parent account
-- Uses a session-local flag to prevent infinite recursion

-- =============================================
-- Function: sync lead status to proposals
-- Fires AFTER UPDATE on accounts when status changes
-- =============================================
CREATE OR REPLACE FUNCTION public.sync_lead_to_proposals()
RETURNS trigger AS $$
BEGIN
  -- Only act on status changes
  IF TG_OP = 'UPDATE' AND NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;

  -- Set flag to prevent proposal→lead trigger from causing recursion
  PERFORM set_config('app.sync_skip', 'on', true);

  IF NEW.status = 'Ganho' THEN
    UPDATE public.proposals
    SET status = 'Ganha', "updatedAt" = NOW()
    WHERE "accountId" = NEW.id
      AND COALESCE(status, '') NOT IN ('Ganha', 'Recusada', 'Cancelada');
  ELSIF NEW.status = 'Perdido' THEN
    UPDATE public.proposals
    SET status = 'Perdida', "updatedAt" = NOW()
    WHERE "accountId" = NEW.id
      AND COALESCE(status, '') NOT IN ('Ganha', 'Recusada', 'Cancelada');
  ELSE
    -- Active negotiation: set proposals to "Em negociação"
    UPDATE public.proposals
    SET status = 'Em negociação', "updatedAt" = NOW()
    WHERE "accountId" = NEW.id
      AND COALESCE(status, '') NOT IN ('Ganha', 'Perdida', 'Recusada', 'Cancelada');
  END IF;

  PERFORM set_config('app.sync_skip', 'off', true);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  PERFORM set_config('app.sync_skip', 'off', true);
  RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS sync_lead_to_proposals_trigger ON public.accounts;
CREATE TRIGGER sync_lead_to_proposals_trigger
  AFTER UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.sync_lead_to_proposals();

-- =============================================
-- Function: sync proposal status to lead
-- Fires AFTER UPDATE on proposals when status changes
-- =============================================
CREATE OR REPLACE FUNCTION public.sync_proposal_to_lead()
RETURNS trigger AS $$
BEGIN
  -- Skip if triggered by lead→proposal sync (prevents recursion)
  IF current_setting('app.sync_skip', true) = 'on' THEN
    RETURN NEW;
  END IF;

  -- Only act on status changes
  IF NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;

  -- Skip orphan proposals (no linked account) — manual status management
  IF NEW."accountId" IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.status = 'Ganha' THEN
    UPDATE public.accounts
    SET status = 'Ganho', "updatedAt" = NOW()
    WHERE id = NEW."accountId"
      AND COALESCE(status, '') <> 'Ganho';
  ELSIF NEW.status = 'Perdida' THEN
    UPDATE public.accounts
    SET status = 'Perdido', "updatedAt" = NOW()
    WHERE id = NEW."accountId"
      AND COALESCE(status, '') <> 'Perdido';
  ELSIF NEW.status = 'Em negociação' THEN
    UPDATE public.accounts
    SET status = 'Em prospecção', "pipelineStage" = 'Negociação', "updatedAt" = NOW()
    WHERE id = NEW."accountId"
      AND COALESCE(status, '') NOT IN ('Ganho', 'Perdido');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS sync_proposal_to_lead_trigger ON public.proposals;
CREATE TRIGGER sync_proposal_to_lead_trigger
  AFTER UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.sync_proposal_to_lead();
