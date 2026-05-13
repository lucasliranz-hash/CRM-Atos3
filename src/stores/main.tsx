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
  addLead: (lead: any) => void
  updateLead: (id: string, lead: any) => void
  deleteLead: (id: string) => void
  moveLeadToStage: (id: string, stage: string) => void
  getLeadById: (id: string) => Account | undefined
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
        setAccounts(JSON.parse(localAccounts))
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
            if (prev.length === 0) return dbData
            const dbIds = new Set(dbData.map((a) => a.id))
            const onlyLocal = prev.filter((a) => !dbIds.has(a.id))
            return [...dbData, ...onlyLocal]
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
                  : [payload.new as Account, ...prev],
              )
            } else if (payload.eventType === 'UPDATE') {
              setAccounts((prev) =>
                prev.map((a) =>
                  a.id === payload.new.id ? { ...a, ...payload.new } : a,
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
      // Do not clear accounts to preserve local storage data when no backend is connected
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

  // Core Operations for Leads & Proposals
  const addLead = (lead: any) => {
    const newLead: Account = {
      ...lead,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setAccounts((prev) => [newLead, ...prev])
  }

  const updateLead = (id: string, lead: any) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, ...lead, updatedAt: new Date().toISOString() }
          : a,
      ),
    )
  }

  const deleteLead = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id))
  }

  const moveLeadToStage = (id: string, stage: string) => {
    updateLead(id, { status: stage as any })
  }

  const getLeadById = (id: string) => {
    return accounts.find((a) => a.id === id)
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
    const toInsert = { ...acc, loja_id: profile?.loja_id }
    const { data, error } = await supabase
      .from('accounts')
      .insert(toInsert)
      .select()
      .single()
    if (data && !error) {
      setAccounts((prev) =>
        prev.some((a) => a.id === data.id) ? prev : [data as Account, ...prev],
      )
      return data as Account
    }

    const fallbackAcc: Account = {
      ...acc,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
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
        accountUpdates.status = 'Cliente'
      } else if (opp.stage === 'Fechado Perdido') {
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
