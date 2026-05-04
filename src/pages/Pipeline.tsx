import { useState } from 'react'
import useMainStore from '@/stores/main'
import { Search, Filter, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LeadHistorySheet from '@/components/LeadHistorySheet'
import { cn } from '@/lib/utils'

const COLUMNS_CONFIG = [
  {
    id: 'Leads Mapeados',
    title: '1. Leads Mapeados',
    color: 'border-t-blue-500',
    badgeColor: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'Conexão Enviada',
    title: '2. Conexão Enviada',
    color: 'border-t-purple-500',
    badgeColor: 'bg-purple-50 text-purple-600',
  },
  {
    id: 'Primeiro Contato',
    title: '3. Primeiro Contato',
    color: 'border-t-amber-500',
    badgeColor: 'bg-amber-50 text-amber-600',
  },
  {
    id: 'Follow-up',
    title: '4. Follow-up',
    color: 'border-t-orange-500',
    badgeColor: 'bg-orange-50 text-orange-600',
  },
]

export default function Pipeline() {
  const { opportunities, accounts, contacts, updateOpportunity } =
    useMainStore()
  const [detailsAccountId, setDetailsAccountId] = useState<string | null>(null)

  const onDragStart = (e: React.DragEvent, oppId: string) =>
    e.dataTransfer.setData('oppId', oppId)
  const onDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    const oppId = e.dataTransfer.getData('oppId')
    if (oppId) updateOpportunity(oppId, { stage: stage as any })
  }

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-6 animate-in fade-in duration-500 pb-2">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Pipeline
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Visão geral do seu funil de vendas
          </p>
        </div>
        <div className="flex items-center gap-4 w-full xl:w-auto">
          <div className="relative w-full xl:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar lead, empresa ou contato..."
              className="pl-9 h-10 bg-white"
            />
          </div>
          <Button
            variant="outline"
            className="h-10 bg-white shadow-sm font-bold gap-2 text-slate-700"
          >
            <Filter className="w-4 h-4" /> Filtros
          </Button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar items-start flex-1">
        {COLUMNS_CONFIG.map((col) => {
          const oppsInStage = opportunities.filter((o) => o.stage === col.id)
          return (
            <div
              key={col.id}
              className={cn(
                'min-w-[320px] w-[320px] flex flex-col bg-slate-50/50 rounded-xl p-3 border border-slate-200 shadow-sm border-t-4 h-full',
                col.color,
              )}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, col.id)}
            >
              <div className="flex justify-between items-center mb-4 px-1 shrink-0">
                <h3 className="font-bold text-[14px] text-slate-800">
                  {col.title}
                </h3>
                <span
                  className={cn(
                    'text-[12px] font-bold px-2.5 py-0.5 rounded-md',
                    col.badgeColor,
                  )}
                >
                  {oppsInStage.length}
                </span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
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
                className="w-full mt-3 text-[13px] text-blue-600 font-bold hover:bg-blue-50 shrink-0"
              >
                + Ver todos ({oppsInStage.length})
              </Button>
            </div>
          )
        })}
      </div>

      <LeadHistorySheet
        account={accounts.find((a) => a.id === detailsAccountId) || null}
        open={!!detailsAccountId}
        onOpenChange={(open) => !open && setDetailsAccountId(null)}
      />
    </div>
  )
}

const getTag = (stage: string) => {
  if (stage === 'Leads Mapeados')
    return { label: 'Novo', color: 'bg-blue-100 text-blue-700' }
  if (stage === 'Conexão Enviada')
    return { label: 'Conexão enviada', color: 'bg-purple-100 text-purple-700' }
  if (stage === 'Primeiro Contato')
    return { label: 'Mensagem enviada', color: 'bg-amber-100 text-amber-700' }
  if (stage === 'Follow-up')
    return { label: 'Follow-up', color: 'bg-orange-100 text-orange-700' }
  return { label: stage, color: 'bg-slate-100 text-slate-700' }
}

function KanbanCard({ opp, acc, contact, onClick, onDragStart }: any) {
  const tag = getTag(opp.stage)
  const isFollowUp = opp.stage === 'Follow-up'

  const dateStr = acc.nextActionDate || acc.lastTouchDate || opp.createdAt
  const dateObj = new Date(dateStr)
  const dateText = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, opp.id)}
      onClick={onClick}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing flex flex-col gap-3"
    >
      <div>
        <h4 className="font-bold text-[14px] text-slate-900 leading-snug">
          {acc.name}
        </h4>
        <p className="text-[13px] text-slate-600 mt-1">
          {contact?.name || 'Sem contato'}
        </p>
        <p className="text-[12px] text-slate-500">{contact?.role || '-'}</p>
      </div>

      <div className="flex items-center justify-between mt-1">
        <span
          className={cn('px-2 py-0.5 rounded text-[11px] font-bold', tag.color)}
        >
          {tag.label}
        </span>
        {isFollowUp && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <span>Próx: {dateText}</span>
            <MessageCircle className="w-3.5 h-3.5 text-green-500" />
          </div>
        )}
      </div>

      <div className="flex justify-between items-end mt-1">
        <div className="flex items-center gap-2">
          {contact?.linkedin && (
            <div className="bg-[#0077b5] rounded-[3px] w-4 h-4 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white leading-none tracking-tighter">
                in
              </span>
            </div>
          )}
          {(contact?.whatsapp || acc?.phone) && (
            <Phone className="w-4 h-4 text-slate-500" />
          )}
        </div>
        {!isFollowUp && (
          <span className="text-[12px] font-medium text-slate-500">
            {dateText}
          </span>
        )}
      </div>
    </div>
  )
}
