export type AccountStatus =
  | 'Prospecção'
  | 'Contato realizado'
  | 'Reunião agendada'
  | 'Proposta enviada'
  | 'Negociação'
  | 'Fechado'
  | 'Perdido'

export type Priority = 'A' | 'B' | 'C'

export type NivelInteresse = 'Frio' | 'Morno' | 'Quente'
export type PotencialConta = 'Baixo' | 'Médio' | 'Alto'

export interface Account {
  id: string
  companyName: string
  contactName?: string
  phone?: string
  email?: string
  city?: string
  state?: string
  segment?: string
  vehicleCount?: number
  source?: string
  notes?: string
  pipelineStage: string
  status: string

  // Keep for backwards compatibility
  name?: string
  website?: string
  tags?: string[]
  fleetModel?: string
  fleetEstimate?: number
  leadSource?: string
  detailedSource?: string
  priority?: Priority
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
  user_id?: string
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
  companyName?: string
  city?: string
  state?: string
  preferredChannel?: string
  isDecisionMaker: boolean
  isInfluencer: boolean
  isChampion: boolean
  loja_id?: string
  createdAt: string
  updatedAt: string
  user_id?: string
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
  title?: string
  description?: string
  dueDate?: string
  status?: string
  nextAction?: string
  nextActionDate?: string
  completed: boolean
  loja_id?: string
  createdAt: string
  updatedAt?: string
  user_id?: string
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
  user_id?: string
}

export type ProposalStatus = 'Rascunho' | 'Enviada' | 'Aprovada' | 'Recusada'

export type ProposalItemBillingType =
  | 'Único'
  | 'Mensal'
  | 'Anual'
  | 'Por Veículo'
  | 'Por KM'
export type ProposalItemCategory =
  | 'Equipamento'
  | 'Instalação'
  | 'Mensalidade'
  | 'Outros'

export interface ProposalItem {
  id: string
  name: string
  description?: string
  quantity: number
  unitPrice: number
  billingType: ProposalItemBillingType
  category: ProposalItemCategory
}

export interface ProposalTerms {
  paymentTerms: string
  contractDuration: string
  validity: string
  installationDeadline: string
  warranty: string
  notes?: string
}

export interface ProposalCover {
  title: string
  subtitle: string
  introduction: string
  logoUrl?: string
  coverImageUrl?: string
  logoImage?: string
  coverImage?: string
}

export interface ProposalTravelFee {
  enabled: boolean
  pricePerKm: number
  totalKm: number
  tolls: number
  otherExpenses: number
  notes: string
  total: number
}

export type OrderStatus =
  | 'Rascunho'
  | 'Pedido gerado'
  | 'Em separação'
  | 'Entregue'
  | 'Cancelado'

export interface OrderForm {
  id: string
  order_number: string
  account_id?: string | null
  contact_id?: string | null
  is_manual_customer: boolean
  save_customer_to_crm: boolean
  customer_name?: string
  customer_cnpj?: string
  contact_name?: string
  phone?: string
  email?: string
  city?: string
  state?: string
  address?: string
  responsible?: string
  status: OrderStatus
  notes?: string
  logo_url?: string
  subtotal: number
  discount: number
  total_amount: number
  created_by?: string
  user_id?: string
  loja_id?: string
  created_at: string
  updated_at: string
}

export interface OrderFormItem {
  id: string
  order_form_id: string
  product_name: string
  description?: string
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  notes?: string
  created_at: string
}

export interface CompanySettings {
  id: string
  loja_id?: string
  company_name?: string
  fantasy_name?: string
  cnpj?: string
  state_registration?: string
  address?: string
  number?: string
  district?: string
  city?: string
  state?: string
  zip_code?: string
  phone?: string
  whatsapp?: string
  email?: string
  website?: string
  responsible_name?: string
  responsible_role?: string
  logo_url?: string
  created_at?: string
  updated_at?: string
}

export interface Proposal {
  id: string
  accountId: string
  proposalNumber: string
  status: ProposalStatus
  companyName: string
  contactName: string
  phone: string
  email: string
  vehicleQuantity: number
  cover: ProposalCover
  items: ProposalItem[]
  terms: ProposalTerms
  totalSetup: number
  totalMonthly: number
  totalEquipment: number
  travelFee?: ProposalTravelFee
  createdAt: string
  updatedAt: string
  user_id?: string

  // Backward compatibility fields
  value?: number
  details?: string
}
