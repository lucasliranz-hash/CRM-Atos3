import React, { useMemo } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import useMainStore from '@/stores/main'
import { format } from 'date-fns'
import {
  Building2,
  Calendar,
  Check,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Truck,
} from 'lucide-react'
import { Account } from '@/types/crm'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

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

  const mainContact =
    contacts.find((c) => c.accountId === account?.id && c.isDecisionMaker) ||
    contacts.find((c) => c.accountId === account?.id)
  const activeOpp =
    opportunities.find(
      (o) => o.accountId === account?.id && !o.stage.includes('Fechado'),
    ) || opportunities.find((o) => o.accountId === account?.id)

  const handleCompleteAction = async () => {
    if (!account) return
    await addActivity({
      accountId: account.id,
      type: 'Mensagem',
      channel: 'WhatsApp',
      date: new Date().toISOString(),
      result: `Ação "${account.nextAction}" concluída.`,
      completed: true,
    } as any)
    await updateAccount(account.id, {
      nextAction: null as any,
      nextActionDate: null as any,
    })
    if (activeOpp)
      await updateOpportunity(activeOpp.id, {
        nextAction: null as any,
        nextActionDate: null as any,
      })
    toast({ title: 'Ação concluída com sucesso!' })
  }

  const timeline = useMemo(() => {
    if (!account) return []
    const items: any[] = []
    const accActivities = activities.filter((a) => a.accountId === account.id)

    accActivities.forEach((act) => {
      let icon = <Phone className="w-4 h-4 text-slate-500" />
      if (act.type === 'E-mail' || act.channel === 'E-mail')
        icon = <Mail className="w-4 h-4 text-slate-500" />
      else if (act.channel === 'WhatsApp')
        icon = <MessageCircle className="w-4 h-4 text-green-500" />
      else if (act.channel === 'LinkedIn')
        icon = (
          <div className="bg-[#0077b5] rounded-[3px] w-4 h-4 flex items-center justify-center">
            <span className="text-[9px] font-bold text-white leading-none">
              in
            </span>
          </div>
        )
      else if (act.type.includes('Reunião'))
        icon = <Calendar className="w-4 h-4 text-slate-500" />

      items.push({
        id: `act-${act.id}`,
        date: new Date(act.date),
        description: act.result || act.type,
        icon,
        user: 'Lucas Ferreira',
      })
    })

    if (items.length === 0) {
      items.push(
        {
          id: 'm1',
          date: new Date('2025-04-30T14:30:00'),
          description: 'Mensagem enviada via WhatsApp',
          icon: <MessageCircle className="w-4 h-4 text-green-500" />,
          user: 'Lucas Ferreira',
        },
        {
          id: 'm2',
          date: new Date('2025-04-30T10:15:00'),
          description: 'Conexão aceita no LinkedIn',
          icon: (
            <div className="bg-[#0077b5] rounded-[3px] w-4 h-4 flex items-center justify-center">
              <span className="text-[9px] font-bold text-white leading-none">
                in
              </span>
            </div>
          ),
          user: 'Lucas Ferreira',
        },
        {
          id: 'm3',
          date: new Date('2025-04-29T16:45:00'),
          description: 'Ligação realizada',
          icon: <Phone className="w-4 h-4 text-slate-500" />,
          user: 'Lucas Ferreira',
        },
        {
          id: 'm4',
          date: new Date('2025-04-28T09:20:00'),
          description: 'Reunião agendada',
          icon: <Calendar className="w-4 h-4 text-slate-500" />,
          user: 'Lucas Ferreira',
        },
      )
    }
    return items.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [account, activities])

  if (!account) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[650px] md:max-w-[750px] w-full p-0 flex flex-col bg-white border-l-0 shadow-2xl">
        <div className="p-8 pb-6 border-b border-slate-100 flex justify-between items-start shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#0D1B2A] rounded-xl flex items-center justify-center shadow-sm">
              <div className="text-red-500 font-black text-2xl italic tracking-tighter">
                T
                <span className="text-white text-[10px] ml-0.5 uppercase tracking-normal font-bold">
                  TRANS
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1">
                {account.name}
              </h2>
              <p className="text-[15px] font-medium text-slate-600">
                {mainContact?.name}{' '}
                <span className="mx-1.5 text-slate-300">•</span>{' '}
                {mainContact?.role}
              </p>
            </div>
          </div>
          <Select
            value={activeOpp?.stage || 'Follow-up'}
            onValueChange={(val) =>
              activeOpp &&
              updateOpportunity(activeOpp.id, { stage: val as any })
            }
          >
            <SelectTrigger className="w-[170px] bg-orange-50 text-orange-700 border-orange-200 font-bold h-10 rounded-full shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Leads Mapeados">Leads Mapeados</SelectItem>
              <SelectItem value="Conexão Enviada">Conexão Enviada</SelectItem>
              <SelectItem value="Primeiro Contato">Primeiro Contato</SelectItem>
              <SelectItem value="Follow-up">Follow-up</SelectItem>
              <SelectItem value="Em Conversa">Em Conversa</SelectItem>
              <SelectItem value="Reunião">Reunião</SelectItem>
              <SelectItem value="Proposta">Proposta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar relative">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg text-slate-900">
                Dados do contato
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-bold text-blue-600 border-blue-200 hover:bg-blue-50 rounded-full px-4 gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" /> Editar
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-y-5 gap-x-8 text-[15px]">
              <div className="flex items-center gap-3">
                <Phone className="w-[18px] h-[18px] text-slate-400 shrink-0" />
                <span className="text-slate-700">
                  {account.phone || mainContact?.whatsapp || '(11) 99999-9999'}
                </span>
                <MessageCircle className="w-[18px] h-[18px] text-green-500 ml-auto cursor-pointer" />
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-[18px] h-[18px] text-slate-400 shrink-0" />
                <span className="text-slate-700">
                  {account.city || 'São Paulo - SP'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-[18px] h-[18px] text-slate-400 shrink-0" />
                <span className="text-slate-700 truncate">
                  {mainContact?.email || 'joao@transferrari.com.br'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-[18px] h-[18px] text-slate-400 shrink-0" />
                <span className="text-slate-700">Frota</span>
                <span className="text-slate-900 font-medium ml-auto">
                  {account.fleetEstimate || '35'} veículos
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#0077b5] rounded-sm w-[18px] h-[18px] flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-white leading-none">
                    in
                  </span>
                </div>
                <span className="text-slate-700 truncate">
                  {mainContact?.linkedin || 'linkedin.com/in/joaosilva'}
                </span>
                <div className="bg-[#0077b5] rounded-sm w-[18px] h-[18px] flex items-center justify-center ml-auto cursor-pointer">
                  <span className="text-[11px] font-bold text-white leading-none">
                    in
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-[18px] h-[18px] text-slate-400 shrink-0" />
                <span className="text-slate-700">Segmento</span>
                <span className="text-slate-900 font-medium ml-auto">
                  {account.segment || 'Transporte'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-lg text-orange-900">
                Próxima ação
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 text-base">
                  {account.nextAction || 'Follow-up WhatsApp'}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {account.nextActionDate
                    ? format(
                        new Date(account.nextActionDate),
                        "dd/MM/yyyy 'às' HH:mm",
                      )
                    : '02/05/2025 às 10:00'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleCompleteAction}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-10 px-5 rounded-full shadow-sm"
                >
                  <Check className="w-4 h-4 mr-2" /> Concluir
                </Button>
                <Button
                  variant="outline"
                  className="bg-white h-10 px-5 rounded-full font-bold text-slate-700 border-slate-200 shadow-sm"
                >
                  Editar
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-lg text-slate-900">
                Histórico de interações
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 rounded-full font-bold text-slate-700 gap-2 border-slate-200 shadow-sm bg-white"
                onClick={() =>
                  toast({
                    title: 'Adicionar interação',
                    description: 'Abrindo formulário...',
                  })
                }
              >
                <Plus className="w-4 h-4" /> Adicionar interação
              </Button>
            </div>

            <div className="relative before:absolute before:inset-y-2 before:left-[35px] before:w-px before:bg-slate-200 space-y-6">
              {timeline.map((item) => (
                <div key={item.id} className="flex items-start relative">
                  <div className="w-6 shrink-0 mt-0.5 flex justify-center">
                    {item.icon}
                  </div>
                  <div className="w-6 shrink-0 mt-1.5 flex justify-center z-10 bg-white h-full">
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-300 bg-white" />
                  </div>
                  <div className="w-32 shrink-0 text-[13px] text-slate-600 pl-3 mt-1">
                    {format(item.date, 'dd/MM/yyyy HH:mm')}
                  </div>
                  <div className="flex-1 text-[14px] text-slate-800 mt-0.5 pl-2">
                    {item.description}
                  </div>
                  <div className="w-[120px] text-right text-[13px] text-slate-500 mt-1 truncate">
                    {item.user}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg text-slate-900">Anotações</h3>
            </div>
            <Textarea
              className="min-h-[120px] bg-white border-slate-200 rounded-xl resize-none text-[14px] text-slate-700 p-4 shadow-sm mb-4 focus-visible:ring-[#FF6A00]"
              placeholder="Adicione observações importantes..."
              value={account.notes || ''}
              onChange={(e) =>
                updateAccount(account.id, { notes: e.target.value })
              }
            />
          </div>
        </div>

        <div className="absolute bottom-6 right-6 z-50">
          <Button className="w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 shadow-xl p-0 flex items-center justify-center border-4 border-white">
            <MessageSquare className="w-6 h-6 text-white" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
