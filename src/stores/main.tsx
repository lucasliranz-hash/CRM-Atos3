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
  moveLeadToStage: (id: string, stage: string) => void
  getLeadById: (id: string) => Account | undefined
  getLeadsByPipelineStage: (stage: string) => Account[]
  addProposalToLead: (proposal: any) => void
  proposals: Proposal[]
  addActivity: (act: Omit<Activity, 'id' | 'createdAt'>) => Promise<void>
  completeActivity: (id: string) => Promise<void>
  addContact: (
    contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<void>
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
    const localAccounts = localStorage.getItem('crm_accounts')
    if (localAccounts) {
      try {
        setAccounts(migrateExistingLeadsToPipeline(JSON.parse(localAccounts)))
      } catch {
        /* intentionally ignored */
      }
    }
    const localProposals = localStorage.getItem('crm_proposals')
    if (localProposals) {
      try {
        setProposals(JSON.parse(localProposals))
      } catch {
        /* intentionally ignored */
      }
    }
    setTimeout(() => setIsInitialized(true), 100)
  }, [])

  // Save to LocalStorage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('crm_accounts', JSON.stringify(accounts))
    }
  }, [accounts, isInitialized])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('crm_proposals', JSON.stringify(proposals))
    }
  }, [proposals, isInitialized])

  useEffect(() => {
    let mounted = true
    let channel: any

    if (user && profile) {
      Promise.all([
        supabase
          .from('accounts')
          .select('*')
          .order('createdAt', { ascending: false }),
        supabase
          .from('contacts')
          .select('*')
          .order('createdAt', { ascending: false }),
        supabase
          .from('activities')
          .select('*')
          .order('date', { ascending: false }),
        supabase
          .from('opportunities')
          .select('*')
          .order('createdAt', { ascending: false }),
      ]).then(([accs, conts, acts, opps]) => {
        if (!mounted) return
        if (accs.data) {
          setAccounts((prev) => {
            const dbData = accs.data as Account[]
            if (prev.length === 0) return migrateExistingLeadsToPipeline(dbData)
            const dbIds = new Set(dbData.map((a) => a.id))
            const onlyLocal = prev.filter((a) => !dbIds.has(a.id))
            return migrateExistingLeadsToPipeline([...dbData, ...onlyLocal])
          })
        }
        if (conts.data) setContacts(conts.data as Contact[])
        if (acts.data) setActivities(acts.data as Activity[])
        if (opps.data) setOpportunities(opps.data as Opportunity[])
      })

      if (profile.loja_id) {
        supabase
          .from('company_settings' as any)
          .select('logo_url')
          .eq('loja_id', profile.loja_id)
          .maybeSingle()
          .then(({ data }) => {
            if (mounted && data?.logo_url) setLogoUrl(data.logo_url)
          })
      }

      channel = supabase
        .channel('public-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'accounts' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setAccounts((prev) =>
                prev.some((a) => a.id === payload.new.id)
                  ? prev
                  : migrateExistingLeadsToPipeline([
                      payload.new as Account,
                      ...prev,
                    ]),
              )
            } else if (payload.eventType === 'UPDATE') {
              setAccounts((prev) =>
                prev.map((a) =>
                  a.id === payload.new.id
                    ? migrateExistingLeadsToPipeline([
                        { ...a, ...payload.new },
                      ])[0]
                    : a,
                ),
              )
            } else if (payload.eventType === 'DELETE') {
              setAccounts((prev) => prev.filter((a) => a.id !== payload.old.id))
            }
          },
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'contacts' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setContacts((prev) =>
                prev.some((c) => c.id === payload.new.id)
                  ? prev
                  : [payload.new as Contact, ...prev],
              )
            } else if (payload.eventType === 'UPDATE') {
              setContacts((prev) =>
                prev.map((c) =>
                  c.id === payload.new.id ? { ...c, ...payload.new } : c,
                ),
              )
            } else if (payload.eventType === 'DELETE') {
              setContacts((prev) => prev.filter((c) => c.id !== payload.old.id))
            }
          },
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'activities' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setActivities((prev) =>
                prev.some((a) => a.id === payload.new.id)
                  ? prev
                  : [payload.new as Activity, ...prev].sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                    ),
              )
            } else if (payload.eventType === 'UPDATE') {
              setActivities((prev) =>
                prev
                  .map((a) =>
                    a.id === payload.new.id ? { ...a, ...payload.new } : a,
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  ),
              )
            } else if (payload.eventType === 'DELETE') {
              setActivities((prev) =>
                prev.filter((a) => a.id !== payload.old.id),
              )
            }
          },
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'opportunities' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setOpportunities((prev) =>
                prev.some((o) => o.id === payload.new.id)
                  ? prev
                  : [payload.new as Opportunity, ...prev],
              )
            } else if (payload.eventType === 'UPDATE') {
              setOpportunities((prev) =>
                prev.map((o) =>
                  o.id === payload.new.id ? { ...o, ...payload.new } : o,
                ),
              )
            } else if (payload.eventType === 'DELETE') {
              setOpportunities((prev) =>
                prev.filter((o) => o.id !== payload.old.id),
              )
            }
          },
        )
        .subscribe()
    } else {
      setContacts([])
      setActivities([])
      setOpportunities([])
      setLogoUrl(null)
    }

    return () => {
      mounted = false
      if (channel) supabase.removeChannel(channel)
    }
  }, [user, profile])

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
      const exists = prev.some(
        (a) =>
          a.id === newLead.id ||
          (a.companyName === newLead.companyName && a.companyName),
      )
      if (exists) return prev
      return [newLead, ...prev]
    })

    if (profile?.loja_id) {
      await supabase
        .from('accounts')
        .insert({
          ...newLead,
          loja_id: profile.loja_id,
        })
        .catch(() => {})
    }
  }

  const updateLead = (id: string, leadData: any) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, ...leadData, updatedAt: new Date().toISOString() }
          : a,
      ),
    )
    if (profile?.loja_id) {
      supabase.from('accounts').update(leadData).eq('id', id).then()
    }
  }

  const deleteLead = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id))
    if (profile?.loja_id) {
      supabase.from('accounts').delete().eq('id', id).then()
    }
  }

  const moveLeadToStage = (id: string, stage: string) => {
    updateLead(id, { pipelineStage: stage })
  }

  const getLeadById = (id: string) => {
    return accounts.find((a) => a.id === id)
  }

  const getLeadsByPipelineStage = (stage: string) => {
    return accounts.filter((a) => a.pipelineStage === stage)
  }

  const addProposalToLead = (proposal: any) => {
    const newProposal: Proposal = {
      ...proposal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setProposals((prev) => [newProposal, ...prev])
  }

  const updateAccount = async (id: string, acc: Partial<Account>) => {
    await supabase.from('accounts').update(acc).eq('id', id)
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, ...acc, updatedAt: new Date().toISOString() } : a,
      ),
    )
  }

  const deleteAccount = async (id: string) => {
    await supabase.from('accounts').delete().eq('id', id)
    setAccounts((prev) => prev.filter((a) => a.id !== id))
    setOpportunities((prev) => prev.filter((o) => o.accountId !== id))
    setContacts((prev) => prev.filter((c) => c.accountId !== id))
    setActivities((prev) => prev.filter((a) => a.accountId !== id))
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
    const { data, error } = await supabase
      .from('accounts')
      .insert(toInsert)
      .select()
      .single()
    if (data && !error) {
      setAccounts((prev) =>
        prev.some((a) => a.id === data.id)
          ? prev
          : migrateExistingLeadsToPipeline([data as Account, ...prev]),
      )
      return data as Account
    }

    const fallbackAcc: Account = {
      ...toInsert,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Account
    setAccounts((prev) => [fallbackAcc, ...prev])
    return fallbackAcc
  }

  const addActivity = async (act: Omit<Activity, 'id' | 'createdAt'>) => {
    const toInsert = { ...act, loja_id: profile?.loja_id }
    const { data, error } = await supabase
      .from('activities')
      .insert(toInsert)
      .select()
      .single()

    if (data && !error) {
      setActivities((prev) =>
        prev.some((a) => a.id === data.id) ? prev : [data as Activity, ...prev],
      )
    } else {
      const fallbackAct: Activity = {
        ...act,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      setActivities((prev) => [fallbackAct, ...prev])
    }

    await updateAccount(act.accountId, {
      lastTouchDate: new Date().toISOString(),
      ...(act.nextAction && {
        nextAction: act.nextAction,
        nextActionDate: act.nextActionDate,
      }),
    })

    if (act.nextAction) {
      const linkedOpps = oppsRef.current.filter(
        (o) =>
          o.accountId === act.accountId &&
          o.stage !== 'Fechado Ganho' &&
          o.stage !== 'Fechado Perdido',
      )
      for (const opp of linkedOpps) {
        await updateOpportunity(opp.id, {
          nextAction: act.nextAction,
          nextActionDate: act.nextActionDate,
        })
      }
    }
  }

  const completeActivity = async (id: string) => {
    await supabase.from('activities').update({ completed: true }).eq('id', id)
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: true } : a)),
    )
  }

  const addContact = async (
    contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    const toInsert = { ...contact, loja_id: profile?.loja_id }
    const { data, error } = await supabase
      .from('contacts')
      .insert(toInsert)
      .select()
      .single()
    if (data && !error) {
      setContacts((prev) =>
        prev.some((c) => c.id === data.id) ? prev : [data as Contact, ...prev],
      )
    } else {
      const fallbackContact: Contact = {
        ...contact,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setContacts((prev) => [fallbackContact, ...prev])
    }
  }

  const addOpportunity = async (opp: Omit<Opportunity, 'id' | 'createdAt'>) => {
    const toInsert = { ...opp, loja_id: profile?.loja_id }
    const { data, error } = await supabase
      .from('opportunities')
      .insert(toInsert)
      .select()
      .single()
    if (data && !error) {
      setOpportunities((prev) =>
        prev.some((o) => o.id === data.id)
          ? prev
          : [data as Opportunity, ...prev],
      )
    } else {
      const fallbackOpp: Opportunity = {
        ...opp,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      setOpportunities((prev) => [fallbackOpp, ...prev])
    }

    if (opp.nextAction && opp.accountId) {
      await updateAccount(opp.accountId, {
        nextAction: opp.nextAction,
        nextActionDate: opp.nextActionDate,
      })
    }
  }

  const updateOpportunity = async (id: string, opp: Partial<Opportunity>) => {
    if (opp.stage === 'Fechado Ganho') {
      opp.probability = 100
    } else if (opp.stage === 'Fechado Perdido') {
      opp.probability = 0
    }

    await supabase.from('opportunities').update(opp).eq('id', id)

    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...opp } : o)),
    )

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

      if (Object.keys(accountUpdates).length > 0) {
        await updateAccount(existingOpp.accountId, accountUpdates)
      }
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
        deleteLead,
        moveLeadToStage,
        getLeadById,
        getLeadsByPipelineStage,
        addProposalToLead,
        addActivity,
        completeActivity,
        addContact,
        addOpportunity,
        updateOpportunity,
        deleteAccount,
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
