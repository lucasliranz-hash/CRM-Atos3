import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Account, Contact, Activity, Opportunity } from '@/types/crm'
import {
  mockAccounts,
  mockContacts,
  mockActivities,
  mockOpportunities,
} from '@/data/mock'

interface MainStore {
  accounts: Account[]
  contacts: Contact[]
  activities: Activity[]
  opportunities: Opportunity[]
  addAccount: (acc: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateAccount: (id: string, acc: Partial<Account>) => void
  addActivity: (act: Omit<Activity, 'id' | 'createdAt'>) => void
  completeActivity: (id: string) => void
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void
  addOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt'>) => void
  updateOpportunityStage: (
    id: string,
    stage: Opportunity['stage'],
    lossReason?: string,
  ) => void
}

const MainContext = createContext<MainStore | undefined>(undefined)

export function MainProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts)
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [opportunities, setOpportunities] =
    useState<Opportunity[]>(mockOpportunities)

  const updateAccount = (id: string, acc: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, ...acc, updatedAt: new Date().toISOString() } : a,
      ),
    )
  }

  const addAccount = (acc: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAcc: Account = {
      ...acc,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setAccounts((prev) => [newAcc, ...prev])
  }

  const addActivity = (act: Omit<Activity, 'id' | 'createdAt'>) => {
    setActivities((prev) => [
      {
        ...act,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])

    updateAccount(act.accountId, {
      lastTouchDate: new Date().toISOString(),
      ...(act.nextAction && {
        nextAction: act.nextAction,
        nextActionDate: act.nextActionDate,
      }),
    })
  }

  const completeActivity = (id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: true } : a)),
    )
  }

  const addContact = (
    contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    setContacts((prev) => [
      {
        ...contact,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  const addOpportunity = (opp: Omit<Opportunity, 'id' | 'createdAt'>) => {
    setOpportunities((prev) => [
      {
        ...opp,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  const updateOpportunityStage = (
    id: string,
    stage: Opportunity['stage'],
    lossReason?: string,
  ) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, stage, lossReason } : o)),
    )
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
        updateOpportunityStage,
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
