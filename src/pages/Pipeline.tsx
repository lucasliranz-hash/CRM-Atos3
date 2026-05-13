import { useState, useMemo, useEffect } from 'react'
import useMainStore from '@/stores/main'
import { Search, Filter, MessageCircle, Phone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LeadHistorySheet from '@/components/LeadHistorySheet'
import { cn } from '@/lib/utils'
import { isOverdue, isToday } from '@/lib/crm-utils'

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
    color: 'border-t-indigo-500',
    badgeColor: 'bg-indigo-50 text-indigo-600',
  },
  {
    id: 'Primeiro Contato',
    title: '3. Primeiro Contato',
    color: 'border-t-purple-500',
    badgeColor: 'bg-purple-50 text-purple-600',
  },
  {
    id: 'Follow-up',
    title: '4. Follow-up',
    color: 'border-t-fuchsia-500',
    badgeColor: 'bg-fuchsia-50 text-fuchsia-600',
  },
  {
    id: 'Em Conversa',
    title: '5. Em Conversa',
    color: 'border-t-pink-500',
    badgeColor: 'bg-pink-50 text-pink-600',
  },
  {
    id: 'Reunião',
    title: '6. Reunião',
    color: 'border-t-rose-500',
    badgeColor: 'bg-rose-50 text-rose-600',
  },
  {
    id: 'Proposta',
    title: '7. Proposta',
    color: 'border-t-orange-500',
    badgeColor: 'bg-orange-50 text-orange-600',
  },
]

export default function Pipeline() {
  const {
    opportunities,
    accounts,
    contacts,
    activities,
    updateOpportunity,
    kpiFilter,
    setKpiFilter,
    dateFilter,
  } = useMainStore()
  const [detailsAccountId, setDetailsAccountId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    return () => setKpiFilter(null)
  }, [setKpiFilter])

  const filteredOpps = useMemo(() => {
    let opps = opportunities

    if (dateFilter !== 'all') {
      const now = new Date()
      opps = opps.filter((o) => {
        const d = new Date(o.createdAt)
        if (dateFilter === 'today')
          return d.toDateString() === now.toDateString()
        if (dateFilter === 'week') {
          const w = new Date(now)
          w.setDate(now.getDate() - now.getDay())
          return d >= w
        }
        if (dateFilter === 'month')
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          )
        if (dateFilter === 'year') return d.getFullYear() === now.getFullYear()
        return true
      })
    }

    if (kpiFilter) {
      if (kpiFilter === 'leads') {
        // No extra filtering, base filtered opps
      } else if (kpiFilter === 'contatos') {
        const accsWithActivity = activities.map((a) => a.accountId)
        opps = opps.filter((o) => accsWithActivity.includes(o.accountId))
      } else if (kpiFilter === 'reunioes') {
        const accsWithMeetings = activities
          .filter((a) => a.type === 'Reunião agendada')
          .map((a) => a.accountId)
        opps = opps.filter((o) => accsWithMeetings.includes(o.accountId))
      } else if (kpiFilter === 'vendas') {
        opps = opps.filter((o) => o.stage === 'Fechado Ganho')
      }
    }

    if (search) {
      const q = search.toLowerCase()
      opps = opps.filter((o) => {
        const acc = accounts.find((a) => a.id === o.accountId)
        const contact = contacts.find((c) => c.accountId === o.accountId)
        return (
          o.name.toLowerCase().includes(q) ||
          acc?.name.toLowerCase().includes(q) ||
          contact?.name.toLowerCase().includes(q)
        )
      })
    }

    return opps
  }, [
    opportunities,
    kpiFilter,
    search,
    activities,
    accounts,
    contacts,
    dateFilter,
  ])

  const onDragStart = (e: React.DragEvent, oppId: string) =>
    e.dataTransfer.setData('oppId', oppId)
  const onDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    const oppId = e.dataTransfer.getData('oppId')
    if (oppId) updateOpportunity(oppId, { stage: stage as any })
  }

  const getKpiLabel = () => {
    if (kpiFilter === 'leads') return 'Filtrando: Leads Mapeados'
    if (kpiFilter === 'contatos') return 'Filtrando: Contatos Realizados'
    if (kpiFilter === 'reunioes') return 'Filtrando: Reuniões Agendadas'
    if (kpiFilter === 'vendas') return 'Filtrando: Vendas Fechadas'
    return null
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
          {kpiFilter && (
            <div className="flex items-center gap-2 bg-[#FF6A00]/10 text-[#FF6A00] px-3 py-1.5 rounded-lg text-sm font-bold border border-[#FF6A00]/20">
              {getKpiLabel()}
              <button
                onClick={() => setKpiFilter(null)}
                className="hover:bg-[#FF6A00]/20 rounded-full p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <div className="relative w-full xl:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar lead, empresa ou contato..."
              className="pl-9 h-10 bg-white border-slate-200 shadow-sm"
            />
          </div>
          <Button
            variant="outline"
            className="h-10 bg-white shadow-sm font-bold gap-2 text-slate-700 border-slate-200"
          >
            <Filter className="w-4 h-4" /> Filtros
          </Button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar items-start flex-1">
        {COLUMNS_CONFIG.map((col) => {
          const oppsInStage = filteredOpps.filter((o) => o.stage === col.id)
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

function KanbanCard({ opp, acc, contact, onClick, onDragStart }: any) {
  const isFollowUp = !!acc.nextAction
  const dateStr = acc.nextActionDate || acc.lastTouchDate || opp.createdAt
  const isLate = isOverdue(dateStr)
  const isTod = isToday(dateStr)

  const dateObj = new Date(dateStr)
  const dateText = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, opp.id)}
      onClick={onClick}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing flex flex-col gap-3 group relative overflow-hidden"
    >
      {isLate && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
      )}
      {isTod && !isLate && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6A00]" />
      )}

      <div>
        <h4 className="font-bold text-[14px] text-[#0D1B2A] leading-snug group-hover:text-[#FF6A00] transition-colors">
          {acc.name}
        </h4>
        <p className="text-[13px] text-slate-600 mt-1">
          {contact?.name || 'Sem contato'}
        </p>
      </div>

      <div className="flex items-center justify-between mt-1">
        {isFollowUp ? (
          <div className="flex items-center gap-1.5 text-[11px] font-bold bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            <span
              className={cn(
                isLate
                  ? 'text-red-600'
                  : isTod
                    ? 'text-[#FF6A00]'
                    : 'text-slate-600',
              )}
            >
              Próx: {dateText}
            </span>
            <MessageCircle
              className={cn(
                'w-3.5 h-3.5',
                isLate
                  ? 'text-red-500'
                  : isTod
                    ? 'text-[#FF6A00]'
                    : 'text-slate-400',
              )}
            />
          </div>
        ) : (
          <div className="text-[11px] font-medium text-slate-400">
            Sem ação agendada
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
            <Phone className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>
    </div>
  )
}
