import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from 'react'
import { Account, Contact, Activity, Opportunity, Proposal } from '@/types/crm'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

interface MainStore {
  accounts: Account[]
  contacts: Contact[]
  activities: Activity[]
  opportunities: Opportunity[]
  proposals: Proposal[]
  logoUrl: string | null
  setLogoUrl: (url: string | null) => void
  addAccount: (
    acc: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<Account | undefined>
  updateAccount: (id: string, acc: Partial<Account>) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
  addLead: (lead: any) => Promise<void>
  updateLead: (id: string, lead: any) => void
  deleteLead: (id: string) => void
  deleteLeadCascade: (id: string) => Promise<void>
  moveLeadToStage: (id: string, stage: string) => void
  getLeadById: (id: string) => Account | undefined
  getLeadsByPipelineStage: (stage: string) => Account[]
  addProposalToLead: (proposal: any) => void
  addActivity: (act: Omit<Activity, 'id' | 'createdAt'>) => Promise<void>
  completeActivity: (id: string) => Promise<void>
  addContact: (
    contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<void>
  updateContact: (id: string, contact: Partial<Contact>) => Promise<void>
  addOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt'>) => Promise<void>
  updateOpportunity: (id: string, opp: Partial<Opportunity>) => Promise<void>
  dateFilter: 'all' | 'today' | 'week' | 'month' | 'year'
  setDateFilter: (filter: 'all' | 'today' | 'week' | 'month' | 'year') => void
  kpiFilter: string | null
  setKpiFilter: (filter: string | null) => void
}

const MainContext = createContext<MainStore | undefined>(undefined)

const migrateExistingLeadsToPipeline = (leads: any[]) => {
  const uniqueLeads = new Map()
  leads.forEach((lead) => {
    if (!uniqueLeads.has(lead.id)) {
      const isMissingPipelineStage = !lead.pipelineStage
      let stage = lead.pipelineStage
      if (isMissingPipelineStage) {
        if (
          [
            'Prospecção',
            'Contato realizado',
            'Reunião agendada',
            'Proposta enviada',
            'Negociação',
            'Fechado',
            'Perdido',
          ].includes(lead.status)
        ) {
          stage = lead.status
        } else {
          stage = 'Prospecção'
        }
      }

      uniqueLeads.set(lead.id, {
        ...lead,
        companyName: lead.companyName || lead.name || '',
        name: lead.name || lead.companyName || '',
        vehicleCount:
          lead.vehicleCount !== undefined
            ? lead.vehicleCount
            : lead.fleetEstimate || 0,
        fleetEstimate:
          lead.vehicleCount !== undefined
            ? lead.vehicleCount
            : lead.fleetEstimate || 0,
        source: lead.source || lead.leadSource || '',
        leadSource: lead.source || lead.leadSource || '',
        pipelineStage: stage,
        status: isMissingPipelineStage
          ? 'Novo Lead'
          : lead.status || 'Novo Lead',
      })
    }
  })
  return Array.from(uniqueLeads.values())
}

export function MainProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState<
    'all' | 'today' | 'week' | 'month' | 'year'
  >('month')
  const [kpiFilter, setKpiFilter] = useState<string | null>(null)

  const oppsRef = useRef(opportunities)
  useEffect(() => {
    oppsRef.current = opportunities
  }, [opportunities])

  const [isInitialized, setIsInitialized] = useState(false)

  // Load from LocalStorage
  useEffect(() => {
    try {
      const localAccounts =
        localStorage.getItem('leads') || localStorage.getItem('crm_accounts')
      if (localAccounts)
        setAccounts(migrateExistingLeadsToPipeline(JSON.parse(localAccounts)))

      const localContacts =
        localStorage.getItem('contacts') || localStorage.getItem('crm_contacts')
      if (localContacts) setContacts(JSON.parse(localContacts))

      const localActivities =
        localStorage.getItem('activities') ||
        localStorage.getItem('crm_activities')
      if (localActivities) setActivities(JSON.parse(localActivities))

      const localProposals =
        localStorage.getItem('proposals') ||
        localStorage.getItem('crm_proposals')
      if (localProposals) setProposals(JSON.parse(localProposals))
    } catch {
      // intentionally ignored
    }
    setTimeout(() => setIsInitialized(true), 100)
  }, [])

  // Save to LocalStorage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('leads', JSON.stringify(accounts))
      localStorage.setItem('contacts', JSON.stringify(contacts))
      localStorage.setItem('activities', JSON.stringify(activities))
      localStorage.setItem('proposals', JSON.stringify(proposals))

      // Backward compatibility
      localStorage.setItem('crm_accounts', JSON.stringify(accounts))
      localStorage.setItem('crm_proposals', JSON.stringify(proposals))
    }
  }, [accounts, contacts, activities, proposals, isInitialized])

  // Sync Logic
  const syncLeadToContact = (lead: Account) => {
    if (!lead.contactName && !lead.name) return
    setContacts((prev) => {
      const existing = prev.find(
        (c) => c.accountId === lead.id && c.isDecisionMaker,
      )
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                name: lead.contactName || lead.name || c.name,
                email: lead.email || c.email,
                whatsapp: lead.phone || c.whatsapp,
                companyName: lead.companyName || lead.name || c.companyName,
                city: lead.city || c.city,
                state: lead.state || c.state,
                updatedAt: new Date().toISOString(),
              }
            : c,
        )
      } else {
        const newContact: Contact = {
          id: crypto.randomUUID(),
          accountId: lead.id,
          name: lead.contactName || lead.name || '',
          companyName: lead.companyName || lead.name || '',
          email: lead.email,
          whatsapp: lead.phone,
          city: lead.city,
          state: lead.state,
          role: 'Contato Principal',
          processRole: 'Decisor',
          isDecisionMaker: true,
          isInfluencer: false,
          isChampion: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        return [newContact, ...prev]
      }
    })
  }

  // Deletion logic
  const deleteLeadCascade = async (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id))
    setContacts((prev) => prev.filter((c) => c.accountId !== id))
    setActivities((prev) => prev.filter((a) => a.accountId !== id))
    setOpportunities((prev) => prev.filter((o) => o.accountId !== id))
    setProposals((prev) => prev.filter((p) => p.accountId !== id))

    if (profile?.loja_id) {
      Promise.allSettled([
        supabase.from('accounts').delete().eq('id', id),
        supabase.from('contacts').delete().eq('accountId', id),
        supabase.from('activities').delete().eq('accountId', id),
        supabase.from('opportunities').delete().eq('accountId', id),
      ])
    }
  }

  const addLead = async (leadData: any) => {
    const newLead: Account = {
      ...leadData,
      id: crypto.randomUUID(),
      companyName: leadData.companyName || leadData.name || '',
      name: leadData.companyName || leadData.name || '',
      vehicleCount:
        leadData.vehicleCount !== undefined
          ? leadData.vehicleCount
          : leadData.fleetEstimate || 0,
      fleetEstimate:
        leadData.vehicleCount !== undefined
          ? leadData.vehicleCount
          : leadData.fleetEstimate || 0,
      source: leadData.source || leadData.leadSource || '',
      leadSource: leadData.source || leadData.leadSource || '',
      pipelineStage: leadData.pipelineStage || 'Prospecção',
      status: leadData.status || 'Novo Lead',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setAccounts((prev) => {
      if (prev.some((a) => a.id === newLead.id)) return prev
      return [newLead, ...prev]
    })

    syncLeadToContact(newLead)

    if (profile?.loja_id) {
      await supabase
        .from('accounts')
        .insert({ ...newLead, loja_id: profile.loja_id })
        .catch(() => {})
    }
  }

  const updateLead = (id: string, leadData: any) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = {
            ...a,
            ...leadData,
            updatedAt: new Date().toISOString(),
          }
          syncLeadToContact(updated)
          return updated
        }
        return a
      }),
    )
    if (profile?.loja_id) {
      supabase.from('accounts').update(leadData).eq('id', id).then()
    }
  }

  const moveLeadToStage = (id: string, stage: string) => {
    updateLead(id, { pipelineStage: stage })
  }

  const getLeadById = (id: string) => accounts.find((a) => a.id === id)
  const getLeadsByPipelineStage = (stage: string) =>
    accounts.filter((a) => a.pipelineStage === stage)

  const addProposalToLead = (proposal: any) => {
    const newProposal: Proposal = {
      ...proposal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setProposals((prev) => [newProposal, ...prev])
  }

  const updateAccount = async (id: string, acc: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...acc, updatedAt: new Date().toISOString() }
          syncLeadToContact(updated)
          return updated
        }
        return a
      }),
    )
    if (profile?.loja_id)
      await supabase.from('accounts').update(acc).eq('id', id)
  }

  const addAccount = async (
    acc: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    const toInsert = {
      ...acc,
      loja_id: profile?.loja_id,
      companyName: acc.companyName || acc.name || '',
      pipelineStage: acc.pipelineStage || acc.status || 'Prospecção',
      status:
        acc.status === 'Novo Lead' ? 'Novo Lead' : acc.status || 'Novo Lead',
    }

    let fallbackAcc: Account = {
      ...toInsert,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Account

    if (profile?.loja_id) {
      const { data, error } = await supabase
        .from('accounts')
        .insert(toInsert)
        .select()
        .single()
      if (data && !error) fallbackAcc = data as Account
    }

    setAccounts((prev) => [fallbackAcc, ...prev])
    syncLeadToContact(fallbackAcc)
    return fallbackAcc
  }

  const addActivity = async (act: Omit<Activity, 'id' | 'createdAt'>) => {
    let fallbackAct: Activity = {
      ...act,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    if (profile?.loja_id) {
      const { data, error } = await supabase
        .from('activities')
        .insert({ ...act, loja_id: profile.loja_id })
        .select()
        .single()
      if (data && !error) fallbackAct = data as Activity
    }

    setActivities((prev) =>
      [fallbackAct, ...prev].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    )

    await updateAccount(act.accountId, {
      lastTouchDate: new Date().toISOString(),
      ...(act.nextAction && {
        nextAction: act.nextAction,
        nextActionDate: act.nextActionDate,
      }),
    })
  }

  const completeActivity = async (id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: true } : a)),
    )
    if (profile?.loja_id)
      await supabase.from('activities').update({ completed: true }).eq('id', id)
  }

  const addContact = async (
    contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    let fallbackContact: Contact = {
      ...contact,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    if (profile?.loja_id) {
      const { data, error } = await supabase
        .from('contacts')
        .insert({ ...contact, loja_id: profile.loja_id })
        .select()
        .single()
      if (data && !error) fallbackContact = data as Contact
    }
    setContacts((prev) => [fallbackContact, ...prev])
  }

  const updateContact = async (id: string, payload: Partial<Contact>) => {
    setContacts((prev) => {
      const existing = prev.find((c) => c.id === id)
      const isMain = existing?.isDecisionMaker || payload.isDecisionMaker
      if (isMain && existing?.accountId) {
        setAccounts((accs) =>
          accs.map((a) => {
            if (a.id === existing.accountId) {
              return {
                ...a,
                contactName:
                  payload.name !== undefined ? payload.name : a.contactName,
                email: payload.email !== undefined ? payload.email : a.email,
                phone:
                  payload.whatsapp !== undefined ? payload.whatsapp : a.phone,
                city: payload.city !== undefined ? payload.city : a.city,
                state: payload.state !== undefined ? payload.state : a.state,
                updatedAt: new Date().toISOString(),
              }
            }
            return a
          }),
        )
      }
      return prev.map((c) =>
        c.id === id
          ? { ...c, ...payload, updatedAt: new Date().toISOString() }
          : c,
      )
    })
    if (profile?.loja_id)
      await supabase.from('contacts').update(payload).eq('id', id)
  }

  const addOpportunity = async (opp: Omit<Opportunity, 'id' | 'createdAt'>) => {
    let fallbackOpp: Opportunity = {
      ...opp,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    if (profile?.loja_id) {
      const { data, error } = await supabase
        .from('opportunities')
        .insert({ ...opp, loja_id: profile.loja_id })
        .select()
        .single()
      if (data && !error) fallbackOpp = data as Opportunity
    }
    setOpportunities((prev) => [fallbackOpp, ...prev])
  }

  const updateOpportunity = async (id: string, opp: Partial<Opportunity>) => {
    if (opp.stage === 'Fechado Ganho') opp.probability = 100
    else if (opp.stage === 'Fechado Perdido') opp.probability = 0

    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...opp } : o)),
    )
    if (profile?.loja_id)
      await supabase.from('opportunities').update(opp).eq('id', id)

    const existingOpp = oppsRef.current.find((o) => o.id === id)
    if (existingOpp?.accountId) {
      let accountUpdates: Partial<Account> = {}
      if (opp.nextAction !== undefined) {
        accountUpdates.nextAction = opp.nextAction
        accountUpdates.nextActionDate = opp.nextActionDate
      }
      if (opp.stage === 'Fechado Ganho') {
        accountUpdates.pipelineStage = 'Fechado'
        accountUpdates.status = 'Cliente'
      } else if (opp.stage === 'Fechado Perdido') {
        accountUpdates.pipelineStage = 'Perdido'
        accountUpdates.status = 'Perdido'
      }
      if (Object.keys(accountUpdates).length > 0)
        updateAccount(existingOpp.accountId, accountUpdates)
    }
  }

  return (
    <MainContext.Provider
      value={{
        accounts,
        contacts,
        activities,
        opportunities,
        proposals,
        logoUrl,
        setLogoUrl,
        addAccount,
        updateAccount,
        addLead,
        updateLead,
        deleteLead: deleteLeadCascade,
        deleteLeadCascade,
        deleteAccount: deleteLeadCascade,
        moveLeadToStage,
        getLeadById,
        getLeadsByPipelineStage,
        addProposalToLead,
        addActivity,
        completeActivity,
        addContact,
        updateContact,
        addOpportunity,
        updateOpportunity,
        dateFilter,
        setDateFilter,
        kpiFilter,
        setKpiFilter,
      }}
    >
      {children}
    </MainContext.Provider>
  )
}

export default function useMainStore() {
  const ctx = useContext(MainContext)
  if (!ctx) throw new Error('useMainStore must be used within MainProvider')
  return ctx
}
