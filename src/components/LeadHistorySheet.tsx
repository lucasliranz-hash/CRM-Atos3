import React, { useMemo, useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import useMainStore from '@/stores/main'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  User,
  Target,
} from 'lucide-react'
import { Account } from '@/types/crm'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LeadInteractionForm from './LeadInteractionForm'

interface Props {
  account: Account | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LeadHistorySheet({
  account,
  open,
  onOpenChange,
}: Props) {
  const { activities, opportunities, contacts } = useMainStore()
  const [activeTab, setActiveTab] = useState('history')

  useEffect(() => {
    if (open) setActiveTab('history')
  }, [open, account])

  const timeline = useMemo(() => {
    if (!account) return []

    const items: any[] = []

    // Account creation
    items.push({
      id: `acc-${account.id}`,
      type: 'account_created',
      title: 'Conta cadastrada',
      description: `Lead adicionado via ${account.leadSource || 'sistema'}.`,
      date: new Date(account.createdAt),
      icon: <Building2 className="w-3.5 h-3.5 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
    })

    // Opportunities
    const accOpps = opportunities.filter((o) => o.accountId === account.id)
    accOpps.forEach((opp) => {
      items.push({
        id: `opp-${opp.id}`,
        type: 'opportunity',
        title: 'Oportunidade criada',
        description: `Oportunidade "${opp.name}" na fase ${opp.stage}.`,
        date: new Date(opp.createdAt),
        icon: <Target className="w-3.5 h-3.5 text-purple-600" />,
        color: 'bg-purple-50 border-purple-200',
      })
    })

    // Contacts
    const accContacts = contacts.filter((c) => c.accountId === account.id)
    accContacts.forEach((contact) => {
      items.push({
        id: `contact-${contact.id}`,
        type: 'contact',
        title: 'Contato adicionado',
        description: `${contact.name} (${contact.role || contact.processRole})`,
        date: new Date(contact.createdAt),
        icon: <User className="w-3.5 h-3.5 text-emerald-600" />,
        color: 'bg-emerald-50 border-emerald-200',
      })
    })

    // Activities
    const accActivities = activities.filter((a) => a.accountId === account.id)
    accActivities.forEach((act) => {
      let icon = <Clock className="w-3.5 h-3.5 text-gray-600" />
      let color = 'bg-gray-50 border-gray-200'

      if (act.type === 'E-mail' || act.channel === 'E-mail') {
        icon = <Mail className="w-3.5 h-3.5 text-amber-600" />
        color = 'bg-amber-50 border-amber-200'
      } else if (act.type === 'Ligação' || act.channel === 'Telefone') {
        icon = <Phone className="w-3.5 h-3.5 text-teal-600" />
        color = 'bg-teal-50 border-teal-200'
      } else if (
        act.type === 'Mensagem' ||
        act.channel === 'WhatsApp' ||
        act.channel === 'LinkedIn'
      ) {
        icon = <MessageSquare className="w-3.5 h-3.5 text-green-600" />
        color = 'bg-green-50 border-green-200'
      } else if (act.type.includes('Reunião') || act.type === 'Diagnóstico') {
        icon = <Calendar className="w-3.5 h-3.5 text-indigo-600" />
        color = 'bg-indigo-50 border-indigo-200'
      } else if (act.type === 'Negociação') {
        icon = <Target className="w-3.5 h-3.5 text-blue-600" />
        color = 'bg-blue-50 border-blue-200'
      }

      items.push({
        id: `act-${act.id}`,
        type: 'activity',
        title: act.type,
        description: act.result
          ? act.result
          : 'Atividade registrada no sistema.',
        date: new Date(act.date),
        icon,
        color,
        completed: act.completed,
      })
    })

    return items.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [account, activities, opportunities, contacts])

  if (!account) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[450px] md:max-w-[500px] w-full p-0 flex flex-col bg-gray-50/30">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col h-full w-full"
        >
          <div className="p-6 pb-0 bg-white border-b border-gray-100 shrink-0">
            <SheetHeader className="mb-5">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-black text-gray-900">
                  {account.name}
                </SheetTitle>
                <Badge
                  variant="outline"
                  className="font-bold bg-white shadow-sm border-gray-200"
                >
                  {account.status}
                </Badge>
              </div>
              <SheetDescription className="font-medium text-gray-500">
                Gestão e histórico de interações do lead.
              </SheetDescription>
            </SheetHeader>

            <TabsList className="w-full bg-gray-100/70 p-1 mb-4 h-11">
              <TabsTrigger
                value="history"
                className="w-1/2 h-full text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black text-gray-500"
              >
                Histórico
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="w-1/2 h-full text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black text-gray-500"
              >
                Nova Ação
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6 relative">
            <TabsContent
              value="history"
              className="m-0 h-full animate-in fade-in duration-300"
            >
              <div className="relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gray-200 space-y-6">
                {timeline.map((item) => (
                  <div key={item.id} className="relative">
                    <div
                      className={`absolute -left-[34px] top-1 flex items-center justify-center w-7 h-7 rounded-full border-[3px] border-white shadow-sm z-10 ${item.color}`}
                    >
                      {item.icon}
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:border-gray-200 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-sm text-gray-900">
                          {item.title}
                        </h4>
                        <time className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 whitespace-nowrap">
                          {format(item.date, "dd MMM yy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </time>
                      </div>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
                        {item.description}
                      </p>
                      {item.type === 'activity' && item.completed && (
                        <div className="mt-2.5 flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 w-fit px-1.5 py-0.5 rounded-md border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Concluído
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {timeline.length === 0 && (
                  <div className="text-center py-10 text-gray-500 font-medium text-sm bg-white border border-dashed border-gray-200 rounded-xl">
                    Nenhuma interação registrada.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="new" className="m-0 h-full">
              <LeadInteractionForm
                account={account}
                onSuccess={() => setActiveTab('history')}
              />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
