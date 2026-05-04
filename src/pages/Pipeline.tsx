import { useState } from 'react'
import useMainStore from '@/stores/main'
import {
  Target,
  Users,
  Calendar as CalendarIcon,
  FileText,
  TrendingUp,
  Phone,
  Linkedin,
  MoreHorizontal,
  Download,
  Filter,
  Search,
  MessageSquare,
  MessageCircle,
  MoreVertical,
} from 'lucide-react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

import LeadHistorySheet from '@/components/LeadHistorySheet'
import { cn } from '@/lib/utils'

const STAGES = [
  'Leads Mapeados',
  'Conexão Enviada',
  'Primeiro Contato',
  'Follow-up',
  'Em Conversa',
  'Reunião',
  'Proposta',
]

const COLUMNS_CONFIG = [
  { id: 'Leads Mapeados', title: '1. LEADS MAPEADOS' },
  { id: 'Conexão Enviada', title: '2. CONEXÃO ENVIADA' },
  { id: 'Primeiro Contato', title: '3. PRIMEIRO CONTATO' },
  { id: 'Follow-up', title: '4. FOLLOW-UP' },
  { id: 'Em Conversa', title: '5. EM CONVERSA' },
  { id: 'Reunião', title: '6. REUNIÃO' },
  { id: 'Proposta', title: '7. PROPOSTA' },
]

export default function Pipeline() {
  const { opportunities, accounts, contacts, updateOpportunity } =
    useMainStore()
  const [detailsAccountId, setDetailsAccountId] = useState<string | null>(null)

  const onDragStart = (e: React.DragEvent, oppId: string) => {
    e.dataTransfer.setData('oppId', oppId)
  }
  const onDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    const oppId = e.dataTransfer.getData('oppId')
    if (oppId) updateOpportunity(oppId, { stage: stage as any })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex items-center gap-4">
          <Target className="w-10 h-10 text-orange-500" />
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Pipeline de Prospecção
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Gerencie seus leads e acompanhe cada oportunidade.
            </p>
          </div>
        </div>

        <div className="flex gap-4 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
          <KpiCard
            title="LEADS MAPEADOS"
            value="132"
            variation="+18 esta semana"
            icon={Users}
            color="bg-blue-500"
          />
          <KpiCard
            title="REUNIÕES AGENDADAS"
            value="7"
            variation="+2 esta semana"
            icon={CalendarIcon}
            color="bg-green-500"
          />
          <KpiCard
            title="PROPOSTAS"
            value="4"
            variation="+1 esta semana"
            icon={FileText}
            color="bg-yellow-500"
          />
          <KpiCard
            title="VENDAS"
            value="2"
            variation="+1 esta semana"
            icon={TrendingUp}
            color="bg-purple-500"
          />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x items-start">
        {COLUMNS_CONFIG.map((col) => {
          const oppsInStage = opportunities.filter((o) => o.stage === col.id)
          return (
            <div
              key={col.id}
              className="min-w-[300px] w-[300px] snap-center flex flex-col bg-slate-50/80 rounded-2xl p-3 border border-slate-200 shadow-sm"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, col.id)}
            >
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                  {col.title}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-blue-600 border border-blue-100 shadow-sm">
                  {oppsInStage.length}
                </span>
              </div>
              <div className="space-y-3 flex-1">
                {oppsInStage.map((opp) => {
                  const acc = accounts.find((a) => a.id === opp.accountId)
                  const contact = contacts.find(
                    (c) => c.accountId === opp.accountId,
                  )
                  if (!acc) return null
                  return (
                    <KanbanCard
                      key={opp.id}
                      opp={opp}
                      acc={acc}
                      contact={contact}
                      onClick={() => setDetailsAccountId(acc.id)}
                      onDragStart={onDragStart}
                    />
                  )
                })}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-3 text-xs text-blue-600 font-bold hover:bg-blue-50"
              >
                + Ver todos ({oppsInStage.length})
              </Button>
            </div>
          )
        })}
      </div>

      {detailsAccountId && (
        <LeadHistorySheet
          account={accounts.find((a) => a.id === detailsAccountId) || null}
          open={!!detailsAccountId}
          onOpenChange={(open) => !open && setDetailsAccountId(null)}
        />
      )}
    </div>
  )
}

function KpiCard({ title, value, variation, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-w-[220px] flex items-center gap-4">
      <div
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm shrink-0',
          color,
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-0.5">
          {title}
        </p>
        <span className="text-[26px] font-black text-slate-900 leading-none">
          {value}
        </span>
        <p className="text-[11px] font-bold text-blue-600 mt-1">{variation}</p>
      </div>
    </div>
  )
}

const getTag = (stage: string) => {
  switch (stage) {
    case 'Leads Mapeados':
      return {
        label: 'Novo',
        color: 'bg-blue-50 text-blue-600 border border-blue-100',
      }
    case 'Conexão Enviada':
      return {
        label: 'Conexão',
        color: 'bg-slate-100 text-slate-700 border border-slate-200',
      }
    case 'Primeiro Contato':
      return {
        label: 'Contato',
        color: 'bg-yellow-50 text-yellow-600 border border-yellow-100',
      }
    case 'Follow-up':
      return {
        label: 'Follow-up',
        color: 'bg-orange-50 text-orange-600 border border-orange-100',
      }
    case 'Em Conversa':
      return {
        label: 'Conversa',
        color: 'bg-green-50 text-green-600 border border-green-100',
      }
    case 'Reunião':
      return {
        label: 'Reunião',
        color: 'bg-purple-50 text-purple-600 border border-purple-100',
      }
    case 'Proposta':
      return {
        label: 'Proposta',
        color: 'bg-red-50 text-red-600 border border-red-100',
      }
    default:
      return {
        label: stage,
        color: 'bg-slate-50 text-slate-600 border border-slate-200',
      }
  }
}

function KanbanCard({ opp, acc, contact, onClick, onDragStart }: any) {
  const tag = getTag(opp.stage)
  const isFollowUp = ['Follow-up', 'Reunião Agendada'].includes(opp.stage)
  const dateText =
    isFollowUp && acc.nextActionDate
      ? `Próx: ${new Date(acc.nextActionDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`
      : new Date(acc.lastTouchDate || opp.createdAt).toLocaleDateString(
          'pt-BR',
          { day: '2-digit', month: '2-digit' },
        )

  const isStalled =
    acc.lastTouchDate &&
    new Date().getTime() - new Date(acc.lastTouchDate).getTime() >
      3 * 24 * 60 * 60 * 1000
  const isMissingNextAction = !acc.nextActionDate || !acc.nextAction

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, opp.id)}
      onClick={onClick}
      className={cn(
        'bg-white p-4 rounded-xl border shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative',
        isStalled
          ? 'border-amber-300 shadow-amber-100'
          : isMissingNextAction
            ? 'border-red-300 shadow-red-100'
            : 'border-slate-200 hover:border-slate-300',
      )}
    >
      {isMissingNextAction && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm border border-white z-10 animate-pulse">
          SEM AÇÃO
        </div>
      )}
      {isStalled && !isMissingNextAction && (
        <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm border border-white z-10">
          PARADO &gt;3d
        </div>
      )}
      <h4 className="font-bold text-sm text-slate-900 leading-tight mb-1">
        {acc.name}
      </h4>
      <p className="text-xs text-slate-500 font-medium mb-4 truncate">
        {contact?.name || 'Sem contato'}{' '}
        {contact?.role ? `- ${contact.role}` : ''}
      </p>

      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            'px-2 py-0.5 rounded text-[10px] font-black',
            tag.color,
          )}
        >
          {tag.label}
        </span>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
          {dateText}
        </div>
      </div>

      <div className="flex gap-1.5 items-center">
        {contact?.whatsapp && (
          <MessageCircle className="w-3.5 h-3.5 text-green-500" />
        )}
        {contact?.linkedin && (
          <Linkedin className="w-3.5 h-3.5 text-blue-600" />
        )}
        {(contact?.whatsapp || acc?.phone) && (
          <Phone className="w-3.5 h-3.5 text-slate-500" />
        )}
      </div>

      <div className="absolute top-3 right-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-400 hover:text-slate-900 bg-white/50 backdrop-blur-sm shadow-none"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-40 p-1 flex flex-col gap-1">
            <Button
              variant="ghost"
              className="justify-start h-8 text-xs font-bold w-full"
              onClick={(e) => {
                e.stopPropagation()
                onClick()
              }}
            >
              Editar lead
            </Button>
            <Button
              variant="ghost"
              className="justify-start h-8 text-xs font-bold w-full"
              onClick={(e) => {
                e.stopPropagation()
                onClick()
              }}
            >
              Registrar contato
            </Button>
            <Button
              variant="ghost"
              className="justify-start h-8 text-xs font-bold w-full"
              onClick={(e) => {
                e.stopPropagation()
                onClick()
              }}
            >
              Agendar ação
            </Button>
            <Button
              variant="ghost"
              className="justify-start h-8 text-xs font-bold w-full"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              Mover etapa
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
