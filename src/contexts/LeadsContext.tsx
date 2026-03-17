import React, { createContext, useContext, useState, ReactNode } from 'react'

export type LeadStatus =
  | 'Prospect'
  | 'Contacted'
  | 'Proposal Sent'
  | 'Closed Won'
  | 'Closed Lost'

export type VehicleType = 'Bus' | 'Truck' | 'Mixed Fleet'

export interface Lead {
  id: string
  company: string
  contact: string
  email: string
  phone: string
  fleetSize: number
  vehicleType: VehicleType
  status: LeadStatus
  createdAt: Date
}

interface LeadsContextType {
  leads: Lead[]
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void
  updateLeadStatus: (id: string, status: LeadStatus) => void
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined)

const initialLeads: Lead[] = [
  {
    id: '1',
    company: 'Viação Estrela',
    contact: 'Roberto Silva',
    email: 'roberto@viacaoestrela.com.br',
    phone: '(11) 99999-1234',
    fleetSize: 120,
    vehicleType: 'Bus',
    status: 'Prospect',
    createdAt: new Date(),
  },
  {
    id: '2',
    company: 'TransCarga Logística',
    contact: 'Ana Souza',
    email: 'ana@transcarga.com.br',
    phone: '(21) 98888-5678',
    fleetSize: 45,
    vehicleType: 'Truck',
    status: 'Proposal Sent',
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: '3',
    company: 'LogMista SA',
    contact: 'Carlos Oliveira',
    email: 'carlos@logmista.com.br',
    phone: '(31) 97777-4321',
    fleetSize: 200,
    vehicleType: 'Mixed Fleet',
    status: 'Closed Won',
    createdAt: new Date(Date.now() - 86400000 * 10),
  },
  {
    id: '4',
    company: 'Rodovias do Norte',
    contact: 'Fernando Costa',
    email: 'fernando@rodoviasnorte.com',
    phone: '(41) 96666-4321',
    fleetSize: 15,
    vehicleType: 'Truck',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
]

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
    }
    setLeads((prev) => [newLead, ...prev])
  }

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
    )
  }

  return (
    <LeadsContext.Provider value={{ leads, addLead, updateLeadStatus }}>
      {children}
    </LeadsContext.Provider>
  )
}

export function useLeads() {
  const context = useContext(LeadsContext)
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider')
  }
  return context
}
