export type AccountStatus =
  | 'Novo'
  | 'Em pesquisa'
  | 'Pronto para contato'
  | 'Em prospecção'
  | 'Qualificado'
  | 'Sem fit'
  | 'Perdido'
export type Priority = 'A' | 'B' | 'C'
export type ContactRole =
  | 'Decisor'
  | 'Influenciador'
  | 'Campeão'
  | 'Gatekeeper'
  | 'Financeiro'
  | 'Operações'
export type ActivityType =
  | 'Convite LinkedIn'
  | 'Mensagem LinkedIn'
  | 'Ligação'
  | 'E-mail enviado'
  | 'WhatsApp enviado'
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
  | 'Fechado ganho'
  | 'Fechado perdido'
export type OpportunityStage =
  | 'Diagnóstico'
  | 'Reunião agendada'
  | 'Reunião realizada'
  | 'Piloto'
  | 'Proposta'
  | 'Negociação'
  | 'Fechado ganho'
  | 'Fechado perdido'

export interface Account {
  id: string
  name: string
  website?: string
  linkedin?: string
  phone?: string
  city?: string
  state?: string
  segment?: string
  niche?: string
  fleetEstimate?: number
  source?: string
  status: AccountStatus
  priority: Priority
  nextAction?: string
  nextActionDate?: string
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  accountId: string
  name: string
  role: string
  processRole: ContactRole
  linkedin?: string
  email?: string
  phone?: string
  isDecisionMaker: boolean
  isInfluencer: boolean
  isChampion: boolean
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  accountId: string
  contactId?: string
  date: string
  type: ActivityType
  result?: ActivityResult
  nextAction?: string
  nextActionDate?: string
  completed: boolean
  createdAt: string
}

export interface Opportunity {
  id: string
  accountId: string
  name: string
  stage: OpportunityStage
  mrr: number
  setup: number
  total: number
  probability: number
  closeDate?: string
  createdAt: string
}
