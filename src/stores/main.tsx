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
    if (!user) return

    let accQuery = supabase.from('accounts').select('*')
    let contQuery = supabase.from('contacts').select('*')
    let actQuery = supabase.from('activities').select('*')
    let oppQuery = supabase.from('opportunities').select('*')
    let propQuery = supabase.from('proposals' as any).select('*')
    let settingsQuery = supabase
      .from('company_settings' as any)
      .select('*')
      .single()

    if (profile?.loja_id) {
      accQuery = accQuery.eq('loja_id', profile.loja_id)
      contQuery = contQuery.eq('loja_id', profile.loja_id)
      actQuery = actQuery.eq('loja_id', profile.loja_id)
      oppQuery = oppQuery.eq('loja_id', profile.loja_id)
      propQuery = propQuery.eq('loja_id', profile.loja_id)
      settingsQuery = supabase
        .from('company_settings' as any)
        .select('*')
        .eq('loja_id', profile.loja_id)
        .single()
    }

    const [accRes, contRes, actRes, oppRes, propRes, logoRes] =
      await Promise.all([
        accQuery,
        contQuery,
        actQuery,
        oppQuery,
        propQuery,
        profile?.loja_id
          ? settingsQuery
          : Promise.resolve({ data: null, error: null }),
      ])

    if (accRes.error) console.error('Erro ao buscar accounts:', accRes.error)
    if (contRes.error) console.error('Erro ao buscar contacts:', contRes.error)

    if (accRes.data) setAccounts(accRes.data as Account[])
    if (contRes.data) setContacts(contRes.data as Contact[])
    if (actRes.data) setActivities(actRes.data as Activity[])
    if (oppRes.data) setOpportunities(oppRes.data as Opportunity[])
    if (propRes.data) setProposals(propRes.data as Proposal[])
    if (logoRes.data?.logo_url) setLogoUrl(logoRes.data.logo_url)
  }, [user, profile?.loja_id])

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
    if (user) {
      migrateLocalToSupabase().then(() => fetchSupabaseData())
    }
  }, [user, profile?.loja_id, fetchSupabaseData, migrateLocalToSupabase])

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

      const { error } = await supabase
        .from('contacts')
        .update(payload)
        .eq('id', existing.id)
      if (error) console.error('Error updating contact:', error)
    } else {
      const newContact = {
        id: crypto.randomUUID(),
        accountId: lead.id,
        name: lead.contactName || lead.name || '',
        companyName: lead.companyName || lead.name || '',
        email: lead.email || null,
        whatsapp: lead.phone || null,
        city: lead.city || null,
        state: lead.state || null,
        role: 'Contato Principal',
        processRole: 'Decisor',
        isDecisionMaker: true,
        isInfluencer: false,
        isChampion: false,
        ...(profile?.loja_id ? { loja_id: profile.loja_id } : {}),
      }

      const { error } = await supabase.from('contacts').insert(newContact)
      if (error) console.error('Error inserting contact:', error)
    }
  }

  const deleteLeadCascade = async (id: string) => {
    const { error } = await supabase.from('accounts').delete().eq('id', id)
    if (error) {
      console.error('Error deleting lead:', error)
      throw new Error(`Erro ao excluir lead: ${error.message}`)
    }
    await fetchSupabaseData()
  }

  const addLead = async (leadData: any) => {
    const newLead = {
      id: crypto.randomUUID(),
      name: leadData.companyName || leadData.name || 'Novo Lead',
      companyName: leadData.companyName || leadData.name || '',
      contactName: leadData.contactName || null,
      phone: leadData.phone || null,
      email: leadData.email || null,
      city: leadData.city || null,
      state: leadData.state || null,
      segment: leadData.segment || null,
      vehicleCount: leadData.vehicleCount
        ? parseInt(leadData.vehicleCount, 10)
        : 0,
      fleetEstimate: leadData.vehicleCount
        ? parseInt(leadData.vehicleCount, 10)
        : 0,
      source: leadData.source || leadData.leadSource || null,
      leadSource: leadData.source || leadData.leadSource || null,
      notes: leadData.notes || null,
      pipelineStage: leadData.pipelineStage || 'Prospecção',
      status: leadData.status || 'Novo Lead',
      priority: leadData.priority || 'Média',
      ...(profile?.loja_id ? { loja_id: profile.loja_id } : {}),
    }

    const { data, error } = await supabase
      .from('accounts')
      .insert(newLead)
      .select()

    if (error) {
      console.error('Supabase Insert Error:', error)
      throw new Error(
        `Erro do Supabase: ${error.message} (Code: ${error.code})`,
      )
    }

    if (data && data[0]) {
      await syncLeadToContact(data[0] as unknown as Account)
    }

    await fetchSupabaseData()
  }

  const updateLead = async (id: string, leadData: any) => {
    const { error } = await supabase
      .from('accounts')
      .update(leadData)
      .eq('id', id)
    if (error) {
      console.error('Error updating lead:', error)
      throw new Error(`Erro ao atualizar lead: ${error.message}`)
    }

    await fetchSupabaseData()

    const acc = accounts.find((a) => a.id === id)
    if (acc) {
      const updated = { ...acc, ...leadData }
      await syncLeadToContact(updated)
    }
  }

  const moveLeadToStage = async (id: string, stage: string) => {
    const statusMap: Record<string, string> = {
      Fechado: 'Ganho',
      Perdido: 'Perdido',
    }
    const newStatus = statusMap[stage] || 'Em prospecção'
    try {
      await updateLead(id, { pipelineStage: stage, status: newStatus })
      window.dispatchEvent(new Event('lead_updated'))
    } catch (e) {
      console.error(e)
    }
  }

  const getLeadById = (id: string) => accounts.find((a) => a.id === id)
  const getLeadsByPipelineStage = (stage: string) =>
    accounts.filter((a) => a.pipelineStage === stage)

  const addProposalToLead = async (proposal: any) => {
    const newProposal = {
      ...proposal,
      id: proposal.id || crypto.randomUUID(),
      ...(profile?.loja_id ? { loja_id: profile.loja_id } : {}),
    }

    const { error } = await supabase
      .from('proposals' as any)
      .insert(newProposal)
    if (error) {
      console.error('Error inserting proposal:', error)
      throw new Error(`Erro ao salvar proposta: ${error.message}`)
    }

    if (newProposal.status === 'Enviada') {
      await moveLeadToStage(newProposal.accountId, 'Proposta enviada')
    }

    await fetchSupabaseData()
    return newProposal
  }

  const updateProposal = async (id: string, prop: any) => {
    const { error } = await supabase
      .from('proposals' as any)
      .update(prop)
      .eq('id', id)
    if (error) {
      console.error('Error updating proposal:', error)
      throw new Error(`Erro ao atualizar proposta: ${error.message}`)
    }

    if (prop.status === 'Enviada') {
      const p = proposals.find((x) => x.id === id)
      if (p) await moveLeadToStage(p.accountId, 'Proposta enviada')
    }

    await fetchSupabaseData()
    window.dispatchEvent(new Event('lead_updated'))
  }

  const deleteProposal = async (id: string) => {
    const { error } = await supabase
      .from('proposals' as any)
      .delete()
      .eq('id', id)
    if (error) {
      console.error('Error deleting proposal:', error)
      throw new Error(`Erro ao excluir proposta: ${error.message}`)
    }
    await fetchSupabaseData()
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
      name: acc.companyName || acc.name || 'Nova Conta',
      companyName: acc.companyName || acc.name || '',
      pipelineStage: acc.pipelineStage || acc.status || 'Prospecção',
      status:
        acc.status === 'Novo Lead' ? 'Novo Lead' : acc.status || 'Novo Lead',
      priority: acc.priority || 'Média',
      ...(profile?.loja_id ? { loja_id: profile.loja_id } : {}),
    }

    const { data, error } = await supabase
      .from('accounts')
      .insert(toInsert)
      .select()

    if (error) {
      console.error('Error inserting account:', error)
      throw new Error(`Erro ao salvar conta: ${error.message}`)
    }

    if (data && data[0]) {
      await syncLeadToContact(data[0] as unknown as Account)
    }

    await fetchSupabaseData()
    return (data && data[0] ? data[0] : toInsert) as Account
  }

  const addActivity = async (act: Omit<Activity, 'id' | 'createdAt'>) => {
    const newAct = {
      ...act,
      id: crypto.randomUUID(),
      ...(profile?.loja_id ? { loja_id: profile.loja_id } : {}),
    }

    const { error } = await supabase.from('activities' as any).insert(newAct)
    if (error) {
      console.error('Error inserting activity:', error)
      throw new Error(`Erro ao salvar atividade: ${error.message}`)
    }

    await updateAccount(act.accountId, {
      lastTouchDate: new Date().toISOString(),
      ...(act.nextAction && {
        nextAction: act.nextAction,
        nextActionDate: act.nextActionDate,
      }),
    })

    await fetchSupabaseData()
  }

  const completeActivity = async (id: string) => {
    const { error } = await supabase
      .from('activities')
      .update({ completed: true })
      .eq('id', id)
    if (error) {
      console.error('Error completing activity:', error)
      throw new Error(`Erro ao completar atividade: ${error.message}`)
    }
    await fetchSupabaseData()
  }

  const addContact = async (
    contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    const newContact = {
      ...contact,
      id: crypto.randomUUID(),
      ...(profile?.loja_id ? { loja_id: profile.loja_id } : {}),
    }
    const { error } = await supabase.from('contacts' as any).insert(newContact)
    if (error) {
      console.error('Error inserting contact:', error)
      throw new Error(`Erro ao salvar contato: ${error.message}`)
    }
    await fetchSupabaseData()
  }

  const updateContact = async (id: string, payload: Partial<Contact>) => {
    const { error } = await supabase
      .from('contacts' as any)
      .update(payload)
      .eq('id', id)
    if (error) {
      console.error('Error updating contact:', error)
      throw new Error(`Erro ao atualizar contato: ${error.message}`)
    }

    const existing = contacts.find((c) => c.id === id)
    const isMain = existing?.isDecisionMaker || payload.isDecisionMaker
    if (isMain && existing?.accountId) {
      await updateAccount(existing.accountId, {
        contactName: payload.name !== undefined ? payload.name : existing.name,
        email: payload.email !== undefined ? payload.email : existing.email,
        phone:
          payload.whatsapp !== undefined ? payload.whatsapp : existing.whatsapp,
        city: payload.city !== undefined ? payload.city : existing.city,
        state: payload.state !== undefined ? payload.state : existing.state,
      })
    } else {
      await fetchSupabaseData()
    }
  }

  const addOpportunity = async (opp: Omit<Opportunity, 'id' | 'createdAt'>) => {
    const newOpp = {
      ...opp,
      id: crypto.randomUUID(),
      ...(profile?.loja_id ? { loja_id: profile.loja_id } : {}),
    }
    const { error } = await supabase.from('opportunities' as any).insert(newOpp)
    if (error) {
      console.error('Error inserting opportunity:', error)
      throw new Error(`Erro ao salvar oportunidade: ${error.message}`)
    }
    await fetchSupabaseData()
  }

  const updateOpportunity = async (id: string, opp: Partial<Opportunity>) => {
    if (opp.stage === 'Fechado Ganho') opp.probability = 100
    else if (opp.stage === 'Fechado Perdido') opp.probability = 0

    const { error } = await supabase
      .from('opportunities' as any)
      .update(opp)
      .eq('id', id)
    if (error) {
      console.error('Error updating opportunity:', error)
      throw new Error(`Erro ao atualizar oportunidade: ${error.message}`)
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
      } else {
        await fetchSupabaseData()
      }
    } else {
      await fetchSupabaseData()
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
