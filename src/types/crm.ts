export type AccountStatus =
  | 'Novo'
  | 'Em pesquisa'
  | 'Pronto para contato'
  | 'Em prospecção'
  | 'Qualificado'
  | 'Aguardando retorno'
  | 'Sem fit'
  | 'Cliente'
  | 'Perdido'

export type Priority = 'A' | 'B' | 'C'

export type NivelInteresse = 'Frio' | 'Morno' | 'Quente'
export type PotencialConta = 'Baixo' | 'Médio' | 'Alto'

export interface Account {
  id: string
  name: string
  website?: string
  phone?: string
  segment?: string
  city?: string
  tags?: string[]
  fleetModel?: string
  fleetEstimate?: number
  leadSource?: string
  detailedSource?: string
  status: AccountStatus
  priority: Priority
  icpFit?: string
  interestLevel?: NivelInteresse
  accountPotential?: PotencialConta
  nextAction?: string
  nextActionDate?: string
  lastTouchDate?: string
  cadenceStage?: string
  lossReason?: string
  loja_id?: string
  createdAt: string
  updatedAt: string
}

export type ContactRole =
  | 'Decisor'
  | 'Influenciador'
  | 'Campeão'
  | 'Gatekeeper'
  | 'Financeiro'
  | 'Operações'

export interface Contact {
  id: string
  accountId: string
  name: string
  role: string
  processRole: ContactRole
  linkedin?: string
  email?: string
  whatsapp?: string
  preferredChannel?: string
  isDecisionMaker: boolean
  isInfluencer: boolean
  isChampion: boolean
  loja_id?: string
  createdAt: string
  updatedAt: string
}

export type ActivityChannel =
  | 'LinkedIn'
  | 'Telefone'
  | 'WhatsApp'
  | 'E-mail'
  | 'Presencial'

export type ActivityType =
  | 'Convite'
  | 'Mensagem'
  | 'Ligação'
  | 'E-mail'
  | 'Follow-up'
  | 'Reunião agendada'
  | 'Reunião realizada'
  | 'Diagnóstico'
  | 'Proposta enviada'
  | 'Negociação'
  | 'Pós-venda'

export type ActivityResult =
  | 'Sem resposta'
  | 'Respondeu'
  | 'Não atendeu'
  | 'Contato errado'
  | 'Pediu retorno'
  | 'Agendou reunião'
  | 'Não interessado'
  | 'Em análise'
  | 'Proposta em andamento'
  | 'Fechado Ganho'
  | 'Fechado Perdido'

export interface Activity {
  id: string
  accountId: string
  contactId?: string
  date: string
  channel: ActivityChannel
  type: ActivityType
  result?: ActivityResult
  nextAction?: string
  nextActionDate?: string
  completed: boolean
  loja_id?: string
  createdAt: string
}

export type OpportunityStage =
  | 'Leads Mapeados'
  | 'Conexão Enviada'
  | 'Primeiro Contato'
  | 'Follow-up'
  | 'Em Conversa'
  | 'Reunião'
  | 'Proposta'
  | 'Fechado Ganho'
  | 'Fechado Perdido'

export interface Opportunity {
  id: string
  accountId: string
  name: string
  stage: OpportunityStage
  mrr: number
  setup: number
  total: number
  probability: number
  lossReason?: string
  closeDate?: string
  nextAction?: string
  nextActionDate?: string
  loja_id?: string
  createdAt: string
}
