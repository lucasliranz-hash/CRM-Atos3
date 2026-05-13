import { useState, useMemo } from 'react'
import useMainStore from '@/stores/main'
import { Search, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const COLUMNS_CONFIG = [
  {
    id: 'Prospecção',
    title: 'Prospecção',
    color: 'border-t-blue-500',
    badgeColor: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'Contato realizado',
    title: 'Contato realizado',
    color: 'border-t-indigo-500',
    badgeColor: 'bg-indigo-50 text-indigo-600',
  },
  {
    id: 'Reunião agendada',
    title: 'Reunião agendada',
    color: 'border-t-purple-500',
    badgeColor: 'bg-purple-50 text-purple-600',
  },
  {
    id: 'Proposta enviada',
    title: 'Proposta enviada',
    color: 'border-t-orange-500',
    badgeColor: 'bg-orange-50 text-orange-600',
  },
  {
    id: 'Negociação',
    title: 'Negociação',
    color: 'border-t-pink-500',
    badgeColor: 'bg-pink-50 text-pink-600',
  },
  {
    id: 'Fechado',
    title: 'Fechado',
    color: 'border-t-emerald-500',
    badgeColor: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 'Perdido',
    title: 'Perdido',
    color: 'border-t-red-500',
    badgeColor: 'bg-red-50 text-red-600',
  },
]

export default function Pipeline() {
  const { accounts, moveLeadToStage } = useMainStore()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [segmentFilter, setSegmentFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')

  const uniqueSegments = useMemo(
    () =>
      Array.from(new Set(accounts.map((a: any) => a.segment).filter(Boolean))),
    [accounts],
  )
  const uniqueCities = useMemo(
    () => Array.from(new Set(accounts.map((a: any) => a.city).filter(Boolean))),
    [accounts],
  )

  const filteredLeads = useMemo(() => {
    let leads = accounts

    if (segmentFilter !== 'all') {
      leads = leads.filter((a: any) => a.segment === segmentFilter)
    }

    if (cityFilter !== 'all') {
      leads = leads.filter((a: any) => a.city === cityFilter)
    }

    if (search) {
      const q = search.toLowerCase()
      leads = leads.filter(
        (a: any) =>
          a.name?.toLowerCase().includes(q) ||
          a.contactName?.toLowerCase().includes(q) ||
          a.phone?.toLowerCase().includes(q),
      )
    }

    return leads
  }, [accounts, search, segmentFilter, cityFilter])

  const onDragStart = (e: React.DragEvent, leadId: string) =>
    e.dataTransfer.setData('leadId', leadId)

  const onDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('leadId')
    if (leadId) moveLeadToStage(leadId, stage)
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
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-[160px] bg-white h-10 border-slate-200">
              <SelectValue placeholder="Segmento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Segmentos</SelectItem>
              {uniqueSegments.map((s: any) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-[160px] bg-white h-10 border-slate-200">
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Cidades</SelectItem>
              {uniqueCities.map((c: any) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full xl:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Empresa, contato ou telefone..."
              className="pl-9 h-10 bg-white border-slate-200 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar items-start flex-1">
        {COLUMNS_CONFIG.map((col) => {
          const leadsInStage = filteredLeads.filter(
            (a: any) =>
              a.status === col.id ||
              (!a.status && col.id === 'Prospecção') ||
              (a.status === 'Novo' && col.id === 'Prospecção'),
          )
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
                  {leadsInStage.length}
                </span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
                {leadsInStage.map((lead: any) => (
                  <KanbanCard
                    key={lead.id}
                    lead={lead}
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    onDragStart={onDragStart}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KanbanCard({ lead, onClick, onDragStart }: any) {
  const dateStr = lead.updatedAt || lead.createdAt
  const dateObj = new Date(dateStr)
  const timeText = dateObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const dateText = dateObj.toLocaleDateString('pt-BR')

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      onClick={onClick}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing flex flex-col gap-3 group relative overflow-hidden"
    >
      <div>
        <h4 className="font-bold text-[14px] text-[#0D1B2A] leading-snug group-hover:text-[#FF6A00] transition-colors">
          {lead.name}
        </h4>
        <p className="text-[13px] text-slate-600 mt-1">
          {lead.contactName || 'Sem contato'}
        </p>
      </div>

      <div className="flex items-center justify-between mt-1 text-[12px] text-slate-500">
        <div className="flex items-center gap-1">
          <Phone className="w-3.5 h-3.5" /> {lead.phone || '-'}
        </div>
        <div className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          Frota: {lead.fleetEstimate || 0}
        </div>
      </div>

      <div className="pt-2 mt-1 border-t border-slate-100 flex justify-between items-center gap-2">
        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded whitespace-nowrap overflow-hidden text-ellipsis">
          {lead.status || 'Prospecção'}
        </span>
        <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
          {dateText} {timeText}
        </div>
      </div>
    </div>
  )
}
