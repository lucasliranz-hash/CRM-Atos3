import React, { useMemo, useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/crm-utils'

const parseLocalCurrency = (val: string) => {
  if (!val) return 0
  const str = val.toString().trim()
  if (/^(\d{1,3}(\.\d{3})*|\d+)(,\d{1,2})?$/.test(str)) {
    const clean = str.replace(/\./g, '').replace(',', '.')
    return parseFloat(clean) || 0
  }
  let clean = str.replace(/[^\d,.-]/g, '')
  if (clean.includes(',') && clean.includes('.')) {
    const lastComma = clean.lastIndexOf(',')
    const lastDot = clean.lastIndexOf('.')
    if (lastComma > lastDot) {
      clean = clean.replace(/\./g, '').replace(',', '.')
    } else {
      clean = clean.replace(/,/g, '')
    }
  } else if (clean.includes(',')) {
    clean = clean.replace(',', '.')
  }
  return parseFloat(clean) || 0
}

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
  const {
    activities,
    opportunities,
    contacts,
    updateOpportunity,
    updateAccount,
    addActivity,
  } = useMainStore()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('history')

  useEffect(() => {
    if (open) setActiveTab('history')
  }, [open, account])

  const mainContact =
    contacts.find((c) => c.accountId === account?.id && c.isDecisionMaker) ||
    contacts.find((c) => c.accountId === account?.id)

  const [quickNote, setQuickNote] = useState('')
  const handleSaveNote = async () => {
    if (!quickNote || !account) return
    await addActivity({
      accountId: account.id,
      type: 'Mensagem',
      channel: 'WhatsApp',
      date: new Date().toISOString(),
      result: `Nota: ${quickNote}`,
      completed: true,
    } as any)
    setQuickNote('')
    toast({ title: 'Nota salva no histórico!' })
  }

  const activeOpp =
    opportunities.find(
      (o) => o.accountId === account?.id && !o.stage.includes('Fechado'),
    ) || opportunities.find((o) => o.accountId === account?.id)

  const handleCompleteAction = async () => {
    if (!account) return
    await addActivity({
      accountId: account.id,
      type: 'Mensagem',
      channel: 'Presencial',
      date: new Date().toISOString(),
      result: `Ação "${account.nextAction}" foi marcada como concluída.`,
      completed: true,
    } as any)
    await updateAccount(account.id, {
      nextAction: null as any,
      nextActionDate: null as any,
    })
    if (activeOpp) {
      await updateOpportunity(activeOpp.id, {
        nextAction: null as any,
        nextActionDate: null as any,
      })
    }
    toast({ title: 'Ação concluída com sucesso!' })
  }

  const handleUpdateValue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeOpp) return
    const fd = new FormData(e.target as HTMLFormElement)
    const total = parseLocalCurrency(fd.get('total') as string)
    const stage = fd.get('stage') as string
    const oldTotal = activeOpp.total || 0

    let message = ''
    if (total !== oldTotal) {
      message += `Valor atualizado de ${formatCurrency(oldTotal)} para ${formatCurrency(total)}. `
    }
    if (stage !== activeOpp.stage) {
      message += `Fase alterada de ${activeOpp.stage} para ${stage}.`
    }

    if (message) {
      updateOpportunity(activeOpp.id, { total, stage: stage as any })
      addActivity({
        accountId: account!.id,
        type: 'Negociação',
        channel: 'Presencial',
        date: new Date().toISOString(),
        result: message,
        completed: true,
      })
      toast({ title: 'Oportunidade atualizada e log registrado!' })
    } else {
      toast({ title: 'Nenhuma alteração detectada.' })
    }
  }

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
              <SheetDescription className="font-medium text-slate-500 mt-2">
                <div className="grid grid-cols-2 gap-y-1.5 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="col-span-2">
                    <strong className="text-slate-700">Contato:</strong>{' '}
                    {mainContact?.name || '-'}{' '}
                    {mainContact?.email ? `(${mainContact.email})` : ''}
                  </div>
                  <div>
                    <strong className="text-slate-700">Telefone:</strong>{' '}
                    {account.phone || mainContact?.whatsapp ? (
                      <a
                        href={`tel:${account.phone || mainContact?.whatsapp}`}
                        className="text-blue-600 hover:underline"
                      >
                        {account.phone || mainContact?.whatsapp}
                      </a>
                    ) : (
                      '-'
                    )}
                  </div>
                  <div>
                    <strong className="text-slate-700">LinkedIn:</strong>{' '}
                    {mainContact?.linkedin ? (
                      <a
                        href={mainContact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Acessar perfil
                      </a>
                    ) : (
                      '-'
                    )}
                  </div>
                  <div>
                    <strong className="text-slate-700">Cidade:</strong>{' '}
                    {account.city || '-'}
                  </div>
                  <div>
                    <strong className="text-slate-700">Nº veículos:</strong>{' '}
                    {account.fleetEstimate || '-'}
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>

            <div className="px-6 mb-4">
              <div
                className={cn(
                  'p-3 rounded-xl border flex flex-col gap-2',
                  !account.nextActionDate ||
                    new Date(account.nextActionDate) < new Date()
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200',
                )}
              >
                <div className="flex items-center gap-2">
                  <Target
                    className={cn(
                      'w-4 h-4',
                      !account.nextActionDate ||
                        new Date(account.nextActionDate) < new Date()
                        ? 'text-red-500'
                        : 'text-yellow-600',
                    )}
                  />
                  <span
                    className={cn(
                      'font-black text-sm uppercase tracking-wider',
                      !account.nextActionDate ||
                        new Date(account.nextActionDate) < new Date()
                        ? 'text-red-700'
                        : 'text-yellow-800',
                    )}
                  >
                    Próxima Ação
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-800">
                      {account.nextAction ||
                        'Nenhuma ação definida (Risco de Perda)'}
                    </div>
                    {account.nextActionDate && (
                      <div
                        className={cn(
                          'text-xs font-bold px-2 py-1 rounded border inline-block mt-1',
                          new Date(account.nextActionDate) < new Date()
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-white/50 border-black/5 text-slate-700',
                        )}
                      >
                        {format(
                          new Date(account.nextActionDate),
                          'dd/MM HH:mm',
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {account.nextAction && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteAction()}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Concluir
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveTab('new')}
                      className="bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <TabsList className="w-full bg-slate-100 p-1 mb-4 h-11 flex">
              <TabsTrigger
                value="history"
                className="flex-1 h-full text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600 text-slate-500"
              >
                Histórico
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="flex-1 h-full text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600 text-slate-500"
              >
                Nova Ação
              </TabsTrigger>
              <TabsTrigger
                value="opp"
                className="flex-1 h-full text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600 text-slate-500"
              >
                Oportunidade
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6 relative custom-scrollbar">
            {' '}
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

              <div className="mt-6 border-t border-gray-100 pt-6">
                <h4 className="font-bold text-sm text-slate-900 mb-2">
                  Notas Rápidas
                </h4>
                <div className="flex gap-2">
                  <Input
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                    placeholder="Adicione uma observação rápida..."
                    className="bg-slate-50 border-slate-200"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveNote()}
                  />
                  <Button
                    onClick={handleSaveNote}
                    className="bg-slate-900 text-white shrink-0 font-bold"
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="new" className="m-0 h-full">
              <LeadInteractionForm
                account={account}
                onSuccess={() => setActiveTab('history')}
              />
            </TabsContent>
            <TabsContent
              value="opp"
              className="m-0 h-full animate-in fade-in duration-300"
            >
              {activeOpp ? (
                <form
                  onSubmit={handleUpdateValue}
                  className="space-y-4 bg-white p-5 border border-slate-200 rounded-xl shadow-sm"
                >
                  <h4 className="font-black text-sm text-slate-900 leading-tight">
                    Editar Projeto:
                    <br />
                    {activeOpp.name}
                  </h4>
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold text-slate-700">
                      Fase Atual
                    </label>
                    <select
                      name="stage"
                      defaultValue={activeOpp.stage}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                    >
                      {[
                        'Leads Mapeados',
                        'Conexão Enviada',
                        'Primeiro Contato',
                        'Follow-up',
                        'Em Conversa',
                        'Reunião',
                        'Proposta',
                        'Fechado Ganho',
                        'Fechado Perdido',
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Valor do Projeto (R$)
                    </label>
                    <Input
                      name="total"
                      type="text"
                      inputMode="decimal"
                      defaultValue={
                        activeOpp.total?.toString().replace('.', ',') || '0,00'
                      }
                      className="font-black text-lg h-12"
                    />
                    <p className="text-[10px] text-slate-500 font-medium">
                      Aceita decimais. Ao salvar, um log será criado no
                      histórico.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                  >
                    Atualizar Oportunidade
                  </Button>
                </form>
              ) : (
                <div className="text-center py-10 text-slate-500 font-medium text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Nenhuma oportunidade ativa.
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
