import { Account, Contact, Activity, Opportunity } from '@/types/crm'

const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

export const mockAccounts: Account[] = [
  {
    id: 'a1',
    name: 'Logística Alfa',
    website: 'logisticaalfa.com',
    phone: '11999999999',
    segment: 'Transporte',
    fleetModel: 'Própria',
    fleetEstimate: 50,
    leadSource: 'Inbound',
    detailedSource: 'Google Ads',
    status: 'Em prospecção',
    priority: 'A',
    icpFit: 'Alto',
    interestLevel: 'Quente',
    accountPotential: 'Alto',
    nextAction: 'Ligar para Diretor',
    nextActionDate: yesterday.toISOString(),
    lastTouchDate: yesterday.toISOString(),
    cadenceStage: 'Toque 2',
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
  },
  {
    id: 'a2',
    name: 'TransBeta',
    website: 'transbeta.com.br',
    status: 'Qualificado',
    priority: 'B',
    accountPotential: 'Médio',
    interestLevel: 'Morno',
    nextAction: 'Enviar Proposta',
    nextActionDate: today.toISOString(),
    lastTouchDate: today.toISOString(),
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
  },
  {
    id: 'a3',
    name: 'Viação Gama',
    status: 'Novo',
    priority: 'C',
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
  },
]

export const mockContacts: Contact[] = [
  {
    id: 'c1',
    accountId: 'a1',
    name: 'João Silva',
    role: 'Diretor de Frota',
    processRole: 'Decisor',
    email: 'joao@alfa.com',
    isDecisionMaker: true,
    isInfluencer: false,
    isChampion: true,
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
  },
]

export const mockActivities: Activity[] = [
  {
    id: 'act1',
    accountId: 'a1',
    contactId: 'c1',
    channel: 'Telefone',
    type: 'Ligação',
    result: 'Agendou reunião',
    date: yesterday.toISOString(),
    completed: true,
    nextAction: 'Reunião',
    nextActionDate: today.toISOString(),
    createdAt: today.toISOString(),
  },
  {
    id: 'act2',
    accountId: 'a2',
    channel: 'E-mail',
    type: 'E-mail',
    date: today.toISOString(),
    completed: false,
    nextAction: 'Follow-up',
    nextActionDate: tomorrow.toISOString(),
    createdAt: today.toISOString(),
  },
]

export const mockOpportunities: Opportunity[] = [
  {
    id: 'o1',
    accountId: 'a2',
    name: 'Projeto Renovação Frota',
    stage: 'Proposta',
    mrr: 5000,
    setup: 1500,
    total: 60500,
    probability: 60,
    nextAction: 'Reunião de fechamento',
    nextActionDate: tomorrow.toISOString(),
    createdAt: today.toISOString(),
  },
]
