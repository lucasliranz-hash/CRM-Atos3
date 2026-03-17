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
    status: 'Em prospecção',
    priority: 'A',
    nextAction: 'Ligar para Diretor',
    nextActionDate: yesterday.toISOString(),
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
  },
  {
    id: 'a2',
    name: 'TransBeta',
    website: 'transbeta.com.br',
    status: 'Qualificado',
    priority: 'B',
    nextAction: 'Enviar Proposta',
    nextActionDate: today.toISOString(),
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
  },
  {
    id: 'a3',
    name: 'Viação Gama',
    website: 'viacaogama.com',
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
    type: 'Ligação',
    date: yesterday.toISOString(),
    completed: false,
    createdAt: today.toISOString(),
  },
  {
    id: 'act2',
    accountId: 'a2',
    type: 'E-mail enviado',
    date: today.toISOString(),
    completed: false,
    nextAction: 'Follow-up',
    nextActionDate: tomorrow.toISOString(),
    createdAt: today.toISOString(),
  },
  {
    id: 'act3',
    accountId: 'a3',
    type: 'Convite LinkedIn',
    date: tomorrow.toISOString(),
    completed: false,
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
    createdAt: today.toISOString(),
  },
  {
    id: 'o2',
    accountId: 'a1',
    name: 'Consultoria Logística',
    stage: 'Diagnóstico',
    mrr: 2000,
    setup: 0,
    total: 24000,
    probability: 20,
    createdAt: today.toISOString(),
  },
]
