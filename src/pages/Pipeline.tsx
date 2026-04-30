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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import LeadHistorySheet from '@/components/LeadHistorySheet'
import { cn } from '@/lib/utils'

const STAGES = [
  'Leads Mapeados',
  'Conexão Enviada',
  'Primeiro Contato',
  'Follow-up',
  'Em Conversa / Diagnóstico',
  'Reunião Agendada',
  'Proposta / Fechamento',
]

const COLUMNS_CONFIG = [
  { id: 'Leads Mapeados', title: '1. LEADS MAPEADOS', count: 20 },
  { id: 'Conexão Enviada', title: '2. CONEXÃO ENVIADA', count: 15 },
  { id: 'Primeiro Contato', title: '3. PRIMEIRO CONTATO', count: 18 },
  { id: 'Follow-up', title: '4. FOLLOW-UP', count: 16 },
  { id: 'Em Conversa / Diagnóstico', title: '5. EM CONVERSA', count: 8 },
  { id: 'Reunião Agendada', title: '6. REUNIÃO AGENDADA', count: 5 },
  { id: 'Proposta / Fechamento', title: '7. PROPOSTA / FECHAMENTO', count: 4 },
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

  const [search, setSearch] = useState('')
  const [filterStage, setFilterStage] = useState('all')

  const filteredOpps = opportunities.filter((o) => {
    const acc = accounts.find((a) => a.id === o.accountId)
    if (filterStage !== 'all' && o.stage !== filterStage) return false
    if (search && acc && !acc.name.toLowerCase().includes(search.toLowerCase()))
      return false
    return true
  })

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
                  {col.count}
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
                + Ver todos ({col.count})
              </Button>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10">
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <h2 className="text-xl font-black text-slate-900">Todos os Leads</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Buscar por empresa, contato ou telefone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-[300px] bg-slate-50 border-slate-200 font-medium"
              />
            </div>
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="w-44 bg-slate-50 border-slate-200 font-bold">
                <SelectValue placeholder="Todas as etapas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as etapas</SelectItem>
                {STAGES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-48 bg-slate-50 border-slate-200 font-bold hidden sm:flex">
                <SelectValue placeholder="Todos os responsáveis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os responsáveis</SelectItem>
                <SelectItem value="lucas">Lucas</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="text-slate-600 border-slate-200 font-bold shadow-sm h-10 hidden md:flex"
            >
              <Filter className="w-4 h-4 mr-2" /> Mais filtros
            </Button>
            <Button
              variant="ghost"
              className="text-slate-600 font-bold ml-auto lg:ml-0"
            >
              <Download className="w-4 h-4 mr-2" /> Exportar
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow className="bg-white hover:bg-white border-b-2 border-slate-100">
                <TableHead className="font-bold text-slate-500 text-[11px] uppercase tracking-wider py-4">
                  EMPRESA
                </TableHead>
                <TableHead className="font-bold text-slate-500 text-[11px] uppercase tracking-wider py-4">
                  CONTATO
                </TableHead>
                <TableHead className="font-bold text-slate-500 text-[11px] uppercase tracking-wider py-4">
                  ETAPA
                </TableHead>
                <TableHead className="font-bold text-slate-500 text-[11px] uppercase tracking-wider py-4">
                  ÚLTIMO CONTATO
                </TableHead>
                <TableHead className="font-bold text-slate-500 text-[11px] uppercase tracking-wider py-4">
                  PRÓXIMA AÇÃO
                </TableHead>
                <TableHead className="font-bold text-slate-500 text-[11px] uppercase tracking-wider py-4">
                  RESPONSÁVEL
                </TableHead>
                <TableHead className="font-bold text-slate-500 text-[11px] uppercase tracking-wider py-4">
                  TAGS
                </TableHead>
                <TableHead className="py-4 w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpps.map((opp) => {
                const acc = accounts.find((a) => a.id === opp.accountId)
                const contact = contacts.find(
                  (c) => c.accountId === opp.accountId,
                )
                if (!acc) return null
                const tag = getTag(opp.stage)
                return (
                  <TableRow
                    key={opp.id}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    onClick={() => setDetailsAccountId(acc.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-sm">
                          {acc.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900">
                          {acc.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-900 text-sm">
                        {contact?.name || 'Sem contato'}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {contact?.role || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-md text-[11px] font-black whitespace-nowrap',
                          tag.color,
                        )}
                      >
                        {tag.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-bold text-slate-700">
                        {acc.lastTouchDate
                          ? new Date(acc.lastTouchDate).toLocaleDateString(
                              'pt-BR',
                            )
                          : '-'}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        WhatsApp
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-green-500 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900 text-sm whitespace-nowrap">
                            {acc.nextAction || '-'}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            {acc.nextActionDate
                              ? new Date(acc.nextActionDate).toLocaleString(
                                  'pt-BR',
                                  {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  },
                                )
                              : '-'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1"
                          className="w-6 h-6 rounded-full border border-slate-200 shrink-0"
                          alt="Lucas"
                        />
                        <span className="font-bold text-sm text-slate-700">
                          Lucas
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {acc.tags?.map((t) => (
                          <span
                            key={t}
                            className={cn(
                              'px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap',
                              t.includes('Transporte')
                                ? 'bg-purple-50 text-purple-600'
                                : 'bg-blue-50 text-blue-600',
                            )}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-slate-400 hover:text-slate-900"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
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
        label: 'Conexão enviada',
        color: 'bg-purple-50 text-purple-600 border border-purple-100',
      }
    case 'Primeiro Contato':
      return {
        label: 'Mensagem enviada',
        color: 'bg-yellow-50 text-yellow-600 border border-yellow-100',
      }
    case 'Follow-up':
      return {
        label: 'Follow-up',
        color: 'bg-orange-50 text-orange-600 border border-orange-100',
      }
    case 'Em Conversa / Diagnóstico':
      return {
        label: 'Em conversa',
        color: 'bg-green-50 text-green-600 border border-green-100',
      }
    case 'Reunião Agendada':
      return {
        label: 'Reunião agendada',
        color: 'bg-blue-50 text-blue-600 border border-blue-100',
      }
    case 'Proposta / Fechamento':
      return {
        label: 'Proposta enviada',
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

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, opp.id)}
      onClick={onClick}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing group"
    >
      <h4 className="font-bold text-sm text-slate-900 leading-tight mb-1">
        {acc.name}
      </h4>
      <p className="text-xs text-slate-500 font-medium mb-4 truncate">
        {contact?.name || 'Sem contato'}{' '}
        {contact?.role ? `- ${contact.role}` : ''}
      </p>

      <div className="flex items-center justify-between">
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
          {opp.stage.includes('Contato') && (
            <MessageCircle className="w-3.5 h-3.5 text-green-500" />
          )}
          {opp.stage.includes('Conexão') && (
            <Linkedin className="w-3.5 h-3.5 text-blue-600" />
          )}
          {opp.stage.includes('Follow-up') && (
            <Phone className="w-3.5 h-3.5 text-slate-400" />
          )}
          {opp.stage.includes('Reunião') && (
            <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
          )}
          {opp.stage.includes('Proposta') && (
            <FileText className="w-3.5 h-3.5 text-slate-500" />
          )}
        </div>
      </div>
    </div>
  )
}
