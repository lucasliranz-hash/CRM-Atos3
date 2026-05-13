import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
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
  addProposalToLead: (proposal: any) => Promise<any>
  updateProposal: (id: string, prop: any) => Promise<void>
  deleteProposal: (id: string) => Promise<void>
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
  backups: { type: string; timestamp: string; size: number; fullKey: string }[]
  loadBackups: () => void
  restoreBackup: (fullKey: string) => void
  exportBackup: () => void
  importBackup: (jsonStr: string) => void
}

const MainContext = createContext<MainStore | undefined>(undefined)

const getTimestamp = () => {
  const d = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
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
  const [backups, setBackups] = useState<
    { type: string; timestamp: string; size: number; fullKey: string }[]
  >([])

  const oppsRef = useRef(opportunities)
  useEffect(() => {
    oppsRef.current = opportunities
  }, [opportunities])

  const loadBackups = useCallback(() => {
    const list = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.includes('_backup_')) {
        const match = key.match(/^([a-zA-Z0-9_]+)_backup_(\d{8}_\d{6})$/)
        if (match) {
          const size = localStorage.getItem(key)?.length || 0
          list.push({ type: match[1], timestamp: match[2], size, fullKey: key })
        }
      }
    }
    list.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    setBackups(list)
  }, [])

  const restoreBackup = useCallback((fullKey: string) => {
    alert(
      'Restaurar backup do localStorage não é mais suportado. Use a importação de JSON.',
    )
  }, [])

  const exportBackup = useCallback(() => {
    const data = {
      leads: accounts,
      contacts,
      activities,
      proposals,
      opportunities,
    }
    const str = JSON.stringify(data)
    const ts = getTimestamp()
    const fullKey = `crm_backup_${ts}`
    localStorage.setItem(fullKey, str)

    const blob = new Blob([str], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fullKey}.json`
    a.click()

    loadBackups()
  }, [accounts, contacts, activities, proposals, opportunities, loadBackups])

  const fetchSupabaseData = useCallback(async () => {
    if (!profile?.loja_id) return

    const [accRes, contRes, actRes, oppRes, propRes, logoRes] =
      await Promise.all([
        supabase.from('accounts').select('*').eq('loja_id', profile.loja_id),
        supabase.from('contacts').select('*').eq('loja_id', profile.loja_id),
        supabase.from('activities').select('*').eq('loja_id', profile.loja_id),
        supabase
          .from('opportunities')
          .select('*')
          .eq('loja_id', profile.loja_id),
        supabase
          .from('proposals' as any)
          .select('*')
          .eq('loja_id', profile.loja_id),
        supabase
          .from('company_settings' as any)
          .select('*')
          .eq('loja_id', profile.loja_id)
          .single(),
      ])

    if (accRes.data) setAccounts(accRes.data as Account[])
    if (contRes.data) setContacts(contRes.data as Contact[])
    if (actRes.data) setActivities(actRes.data as Activity[])
    if (oppRes.data) setOpportunities(oppRes.data as Opportunity[])
    if (propRes.data) setProposals(propRes.data as Proposal[])
    if (logoRes.data?.logo_url) setLogoUrl(logoRes.data.logo_url)
  }, [profile?.loja_id])

  const importBackup = useCallback(
    async (jsonStr: string) => {
      try {
        const data = JSON.parse(jsonStr)
        if (profile?.loja_id) {
          if (data.leads && data.leads.length > 0) {
            const inserts = data.leads.map((l: any) => ({
              ...l,
              loja_id: profile.loja_id,
            }))
            await supabase.from('accounts' as any).upsert(inserts)
          }
          if (data.contacts && data.contacts.length > 0) {
            const inserts = data.contacts.map((c: any) => ({
              ...c,
              loja_id: profile.loja_id,
            }))
            await supabase.from('contacts' as any).upsert(inserts)
          }
          if (data.activities && data.activities.length > 0) {
            const inserts = data.activities.map((a: any) => ({
              ...a,
              loja_id: profile.loja_id,
            }))
            await supabase.from('activities' as any).upsert(inserts)
          }
          if (data.proposals && data.proposals.length > 0) {
            const inserts = data.proposals.map((p: any) => ({
              ...p,
              loja_id: profile.loja_id,
            }))
            await supabase.from('proposals' as any).upsert(inserts)
          }
          if (data.opportunities && data.opportunities.length > 0) {
            const inserts = data.opportunities.map((o: any) => ({
              ...o,
              loja_id: profile.loja_id,
            }))
            await supabase.from('opportunities' as any).upsert(inserts)
          }
          fetchSupabaseData()
        }
      } catch (e) {
        console.error('Erro ao importar backup', e)
      }
    },
    [profile?.loja_id, fetchSupabaseData],
  )

  const migrateLocalToSupabase = useCallback(async () => {
    if (!profile?.loja_id) return
    const migrated = localStorage.getItem('migrated_to_supabase_v3')
    if (migrated === 'true') return

    try {
      const localAccounts = JSON.parse(
        localStorage.getItem('leads') ||
          localStorage.getItem('crm_accounts') ||
          '[]',
      )
      if (localAccounts.length > 0) {
        const toInsert = localAccounts.map((a: any) => ({
          ...a,
          loja_id: profile.loja_id,
        }))
        await supabase
          .from('accounts' as any)
          .upsert(toInsert as any, { onConflict: 'id' })
      }

      const localContacts = JSON.parse(localStorage.getItem('contacts') || '[]')
      if (localContacts.length > 0) {
        const toInsert = localContacts.map((a: any) => ({
          ...a,
          loja_id: profile.loja_id,
        }))
        await supabase
          .from('contacts' as any)
          .upsert(toInsert as any, { onConflict: 'id' })
      }

      const localActivities = JSON.parse(
        localStorage.getItem('activities') || '[]',
      )
      if (localActivities.length > 0) {
        const toInsert = localActivities.map((a: any) => ({
          ...a,
          loja_id: profile.loja_id,
        }))
        await supabase
          .from('activities' as any)
          .upsert(toInsert as any, { onConflict: 'id' })
      }

      const localProposals = JSON.parse(
        localStorage.getItem('proposals') || '[]',
      )
      if (localProposals.length > 0) {
        const toInsert = localProposals.map((a: any) => ({
          ...a,
          loja_id: profile.loja_id,
        }))
        await supabase
          .from('proposals' as any)
          .upsert(toInsert as any, { onConflict: 'id' })
      }

      localStorage.setItem('migrated_to_supabase_v3', 'true')
    } catch (e) {
      console.error('Migration error', e)
    }
  }, [profile?.loja_id])

  useEffect(() => {
    if (profile?.loja_id) {
      migrateLocalToSupabase().then(() => fetchSupabaseData())
    }
  }, [profile?.loja_id, fetchSupabaseData, migrateLocalToSupabase])

  const syncLeadToContact = async (lead: Account) => {
    if (!lead.contactName && !lead.name) return
    const existing = contacts.find(
      (c) => c.accountId === lead.id && c.isDecisionMaker,
    )

    if (existing) {
      const payload = {
        name: lead.contactName || lead.name || existing.name,
        email: lead.email || existing.email,
        whatsapp: lead.phone || existing.whatsapp,
        companyName: lead.companyName || lead.name || existing.companyName,
        city: lead.city || existing.city,
        state: lead.state || existing.state,
        updatedAt: new Date().toISOString(),
      }
      setContacts((prev) =>
        prev.map((c) => (c.id === existing.id ? { ...c, ...payload } : c)),
      )
      if (profile?.loja_id)
        await supabase
          .from('contacts' as any)
          .update(payload)
          .eq('id', existing.id)
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
      setContacts((prev) => [newContact, ...prev])
      if (profile?.loja_id)
        await supabase
          .from('contacts' as any)
          .insert({ ...newContact, loja_id: profile.loja_id })
    }
  }

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
        supabase
          .from('proposals' as any)
          .delete()
          .eq('accountId', id),
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

    if (profile?.loja_id) {
      await supabase
        .from('accounts' as any)
        .insert({ ...newLead, loja_id: profile.loja_id })
    }

    await syncLeadToContact(newLead)
  }

  const updateLead = async (id: string, leadData: any) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...leadData, updatedAt: new Date().toISOString() }
        }
        return a
      }),
    )

    if (profile?.loja_id) {
      await supabase
        .from('accounts' as any)
        .update(leadData)
        .eq('id', id)
    }

    const acc = accounts.find((a) => a.id === id)
    if (acc) {
      const updated = { ...acc, ...leadData }
      await syncLeadToContact(updated)
    }
  }

  const moveLeadToStage = async (id: string, stage: string) => {
    await updateLead(id, { pipelineStage: stage })
  }

  const getLeadById = (id: string) => accounts.find((a) => a.id === id)
  const getLeadsByPipelineStage = (stage: string) =>
    accounts.filter((a) => a.pipelineStage === stage)

  const addProposalToLead = async (proposal: any) => {
    const newProposal: Proposal = {
      ...proposal,
      id: proposal.id || crypto.randomUUID(),
      createdAt: proposal.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setProposals((prev) => [newProposal, ...prev])

    if (newProposal.status === 'Enviada') {
      await moveLeadToStage(newProposal.accountId, 'Proposta enviada')
    }

    if (profile?.loja_id) {
      await supabase
        .from('proposals' as any)
        .insert({ ...newProposal, loja_id: profile.loja_id })
    }
    return newProposal
  }

  const updateProposal = async (id: string, prop: any) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...prop, updatedAt: new Date().toISOString() }
          : p,
      ),
    )

    if (prop.status === 'Enviada') {
      const p = proposals.find((x) => x.id === id)
      if (p) await moveLeadToStage(p.accountId, 'Proposta enviada')
    }

    if (profile?.loja_id) {
      await supabase
        .from('proposals' as any)
        .update(prop)
        .eq('id', id)
    }
  }

  const deleteProposal = async (id: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== id))
    if (profile?.loja_id) {
      await supabase
        .from('proposals' as any)
        .delete()
        .eq('id', id)
    }
  }

  const updateAccount = async (id: string, acc: Partial<Account>) => {
    await updateLead(id, acc)
  }

  const addAccount = async (
    acc: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    const toInsert = {
      ...acc,
      id: crypto.randomUUID(),
      companyName: acc.companyName || acc.name || '',
      pipelineStage: acc.pipelineStage || acc.status || 'Prospecção',
      status:
        acc.status === 'Novo Lead' ? 'Novo Lead' : acc.status || 'Novo Lead',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setAccounts((prev) => [toInsert as Account, ...prev])

    if (profile?.loja_id) {
      await supabase
        .from('accounts' as any)
        .insert({ ...toInsert, loja_id: profile.loja_id })
    }

    await syncLeadToContact(toInsert as Account)
    return toInsert as Account
  }

  const addActivity = async (act: Omit<Activity, 'id' | 'createdAt'>) => {
    let newAct: Activity = {
      ...act,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    setActivities((prev) =>
      [newAct, ...prev].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    )

    if (profile?.loja_id) {
      await supabase
        .from('activities' as any)
        .insert({ ...newAct, loja_id: profile.loja_id })
    }

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
    if (profile?.loja_id) {
      await supabase.from('activities').update({ completed: true }).eq('id', id)
    }
  }

  const addContact = async (
    contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    let newContact: Contact = {
      ...contact,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setContacts((prev) => [newContact, ...prev])
    if (profile?.loja_id) {
      await supabase
        .from('contacts' as any)
        .insert({ ...newContact, loja_id: profile.loja_id })
    }
  }

  const updateContact = async (id: string, payload: Partial<Contact>) => {
    setContacts((prev) => {
      const existing = prev.find((c) => c.id === id)
      const isMain = existing?.isDecisionMaker || payload.isDecisionMaker
      if (isMain && existing?.accountId) {
        updateAccount(existing.accountId, {
          contactName:
            payload.name !== undefined ? payload.name : existing.name,
          email: payload.email !== undefined ? payload.email : existing.email,
          phone:
            payload.whatsapp !== undefined
              ? payload.whatsapp
              : existing.whatsapp,
          city: payload.city !== undefined ? payload.city : existing.city,
          state: payload.state !== undefined ? payload.state : existing.state,
        })
      }
      return prev.map((c) =>
        c.id === id
          ? { ...c, ...payload, updatedAt: new Date().toISOString() }
          : c,
      )
    })

    if (profile?.loja_id) {
      await supabase
        .from('contacts' as any)
        .update(payload)
        .eq('id', id)
    }
  }

  const addOpportunity = async (opp: Omit<Opportunity, 'id' | 'createdAt'>) => {
    let newOpp: Opportunity = {
      ...opp,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setOpportunities((prev) => [newOpp, ...prev])
    if (profile?.loja_id) {
      await supabase
        .from('opportunities' as any)
        .insert({ ...newOpp, loja_id: profile.loja_id })
    }
  }

  const updateOpportunity = async (id: string, opp: Partial<Opportunity>) => {
    if (opp.stage === 'Fechado Ganho') opp.probability = 100
    else if (opp.stage === 'Fechado Perdido') opp.probability = 0

    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...opp } : o)),
    )

    if (profile?.loja_id) {
      await supabase
        .from('opportunities' as any)
        .update(opp)
        .eq('id', id)
    }

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
        deleteLead: deleteLeadCascade,
        deleteLeadCascade,
        deleteAccount: deleteLeadCascade,
        moveLeadToStage,
        getLeadById,
        getLeadsByPipelineStage,
        addProposalToLead,
        updateProposal,
        deleteProposal,
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
        backups,
        loadBackups,
        restoreBackup,
        exportBackup,
        importBackup,
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
