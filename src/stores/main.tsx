import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { Account, Contact, Activity, Opportunity } from '@/types/crm'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

interface MainStore {
  accounts: Account[]
  contacts: Contact[]
  activities: Activity[]
  opportunities: Opportunity[]
  addAccount: (
    acc: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<void>
  updateAccount: (id: string, acc: Partial<Account>) => Promise<void>
  addActivity: (act: Omit<Activity, 'id' | 'createdAt'>) => Promise<void>
  completeActivity: (id: string) => Promise<void>
  addContact: (
    contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<void>
  addOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt'>) => Promise<void>
  updateOpportunity: (id: string, opp: Partial<Opportunity>) => Promise<void>
}

const MainContext = createContext<MainStore | undefined>(undefined)

export function MainProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])

  useEffect(() => {
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
        if (accs.data) setAccounts(accs.data as Account[])
        if (conts.data) setContacts(conts.data as Contact[])
        if (acts.data) setActivities(acts.data as Activity[])
        if (opps.data) setOpportunities(opps.data as Opportunity[])
      })
    } else {
      setAccounts([])
      setContacts([])
      setActivities([])
      setOpportunities([])
    }
  }, [user, profile])

  const updateAccount = async (id: string, acc: Partial<Account>) => {
    const { error } = await supabase.from('accounts').update(acc).eq('id', id)
    if (!error) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, ...acc, updatedAt: new Date().toISOString() }
            : a,
        ),
      )
    }
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
      setAccounts((prev) => [data as Account, ...prev])
    }
  }

  const addActivity = async (act: Omit<Activity, 'id' | 'createdAt'>) => {
    const toInsert = { ...act, loja_id: profile?.loja_id }
    const { data, error } = await supabase
      .from('activities')
      .insert(toInsert)
      .select()
      .single()

    if (data && !error) {
      setActivities((prev) => [data as Activity, ...prev])
      await updateAccount(act.accountId, {
        lastTouchDate: new Date().toISOString(),
        ...(act.nextAction && {
          nextAction: act.nextAction,
          nextActionDate: act.nextActionDate,
        }),
      })
    }
  }

  const completeActivity = async (id: string) => {
    const { error } = await supabase
      .from('activities')
      .update({ completed: true })
      .eq('id', id)
    if (!error) {
      setActivities((prev) =>
        prev.map((a) => (a.id === id ? { ...a, completed: true } : a)),
      )
    }
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
      setContacts((prev) => [data as Contact, ...prev])
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
      setOpportunities((prev) => [data as Opportunity, ...prev])
    }
  }

  const updateOpportunity = async (id: string, opp: Partial<Opportunity>) => {
    const { error } = await supabase
      .from('opportunities')
      .update(opp)
      .eq('id', id)
    if (!error) {
      setOpportunities((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...opp } : o)),
      )
    }
  }

  return (
    <MainContext.Provider
      value={{
        accounts,
        contacts,
        activities,
        opportunities,
        addAccount,
        updateAccount,
        addActivity,
        completeActivity,
        addContact,
        addOpportunity,
        updateOpportunity,
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
