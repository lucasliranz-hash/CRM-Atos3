import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'
import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'

export const useMainStore = create((set: any, get: any) => ({
  accounts: [],
  contacts: [],
  activities: [],
  proposals: [],
  opportunities: [],
  orders: [],

  dateFilter: 'month',
  kpiFilter: 'all',
  setDateFilter: (filter: string) => set({ dateFilter: filter }),
  setKpiFilter: (filter: string) => set({ kpiFilter: filter }),
  logoUrl: '',
  loading: false,

  fetchData: async () => {
    set({ loading: true })
    try {
      const [
        { data: accountsData },
        { data: contactsData },
        { data: activitiesData },
        { data: proposalsData },
        { data: oppsData },
        { data: ordersData },
      ] = await Promise.all([
        supabase.from('accounts').select('*'),
        supabase.from('contacts').select('*'),
        supabase.from('activities').select('*'),
        supabase.from('proposals').select('*'),
        supabase.from('opportunities').select('*'),
        supabase.from('order_forms').select('*, accounts(name)'),
      ])

      const mappedAccounts = (accountsData || []).map((a: any) => ({
        ...a,
        pipelineStage:
          a.pipelineStage || a.stage || a.status_pipeline || 'Prospecção',
        status: a.status || 'Novo Lead',
      }))

      const mappedOrders = (ordersData || []).map((d: any) => ({
        ...d,
        customer_name: d.is_manual_customer
          ? d.customer_name
          : d.accounts?.name || d.customer_name,
      }))

      set({
        accounts: mappedAccounts,
        contacts: contactsData || [],
        activities: activitiesData || [],
        proposals: proposalsData || [],
        opportunities: oppsData || [],
        orders: mappedOrders,
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      set({ loading: false })
    }
  },

  getAccounts: () => get().accounts,
  getAccountById: (id: string) =>
    get().accounts.find((a: any) => a.id === id) || null,
  getContacts: () => get().contacts,
  getActivities: () => get().activities,
  getProposals: () => get().proposals,
  getOrders: () => get().orders,

  addAccount: async (acc: any) => {
    const payload = {
      ...acc,
      pipelineStage: acc.pipelineStage || 'Prospecção',
      status: acc.status || 'Novo Lead',
    }
    const { data, error } = await supabase
      .from('accounts')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    const mapped = {
      ...data,
      pipelineStage:
        data.pipelineStage ||
        data.stage ||
        data.status_pipeline ||
        'Prospecção',
    }
    set((state: any) => ({ accounts: [...state.accounts, mapped] }))
    return mapped
  },

  updateAccount: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    const mapped = {
      ...data,
      pipelineStage:
        data.pipelineStage ||
        data.stage ||
        data.status_pipeline ||
        'Prospecção',
    }
    set((state: any) => ({
      accounts: state.accounts.map((a: any) => (a.id === id ? mapped : a)),
    }))
    return mapped
  },

  deleteLeadCascade: async (id: string) => {
    await supabase.from('accounts').delete().eq('id', id)
    set((state: any) => ({
      accounts: state.accounts.filter((a: any) => a.id !== id),
      activities: state.activities.filter((a: any) => a.accountId !== id),
      proposals: state.proposals.filter((p: any) => p.accountId !== id),
      contacts: state.contacts.filter((c: any) => c.accountId !== id),
    }))
  },

  moveLeadToStage: async (id: string, stage: string) => {
    const statusMap: Record<string, string> = {
      Fechado: 'Ganho',
      Perdido: 'Perdido',
    }
    const newStatus = statusMap[stage] || stage

    const updates: any = {
      pipelineStage: stage,
      status: newStatus,
    }

    if (stage === 'Fechado') {
      updates.nextActionStatus = 'Concluída'
    }

    set((state: any) => ({
      accounts: state.accounts.map((a: any) =>
        a.id === id ? { ...a, ...updates } : a,
      ),
    }))

    const { data, error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      get().fetchData()
      throw error
    }

    const mapped = {
      ...data,
      pipelineStage: data.pipelineStage || data.stage || 'Prospecção',
      status: data.status || 'Novo Lead',
    }
    set((state: any) => ({
      accounts: state.accounts.map((a: any) => (a.id === id ? mapped : a)),
    }))
  },

  addActivity: async (act: any) => {
    const { data, error } = await supabase
      .from('activities')
      .insert(act)
      .select()
      .single()
    if (error) throw error
    set((state: any) => ({ activities: [...state.activities, data] }))
    return data
  },

  updateActivity: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('activities')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    set((state: any) => ({
      activities: state.activities.map((a: any) => (a.id === id ? data : a)),
    }))
  },

  completeActivity: async (id: string) => {
    const { data, error } = await supabase
      .from('activities')
      .update({ completed: true })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    set((state: any) => ({
      activities: state.activities.map((a: any) => (a.id === id ? data : a)),
    }))
  },

  addProposalToLead: async (prop: any) => {
    const { data, error } = await supabase
      .from('proposals')
      .insert(prop)
      .select()
      .single()
    if (error) throw error
    set((state: any) => ({ proposals: [...state.proposals, data] }))
    return data
  },

  updateProposal: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    set((state: any) => ({
      proposals: state.proposals.map((p: any) => (p.id === id ? data : p)),
    }))
  },

  deleteProposal: async (id: string) => {
    await supabase.from('proposals').delete().eq('id', id)
    set((state: any) => ({
      proposals: state.proposals.filter((p: any) => p.id !== id),
    }))
  },

  addContact: async (contact: any) => {
    const { data, error } = await supabase
      .from('contacts')
      .insert(contact)
      .select()
      .single()
    if (error) throw error
    set((state: any) => ({ contacts: [...state.contacts, data] }))
    return data
  },

  updateContact: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    set((state: any) => ({
      contacts: state.contacts.map((c: any) => (c.id === id ? data : c)),
    }))
  },
}))

export function MainProvider({ children }: { children: React.ReactNode }) {
  const fetchData = useMainStore((s: any) => s.fetchData)
  const { session } = useAuth()

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session, fetchData])

  return React.createElement(React.Fragment, null, children)
}

export default useMainStore
