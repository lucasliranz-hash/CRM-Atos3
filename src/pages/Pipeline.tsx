import { useState, useMemo } from 'react'
import useMainStore from '@/stores/main'
import { formatCurrency, isOverdue } from '@/lib/crm-utils'
import {
  Building2,
  List,
  Trello,
  Plus,
  AlertTriangle,
  ArrowUpDown,
  Clock,
  User,
  Phone,
  Linkedin,
  MessageSquare,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import LeadHistorySheet from '@/components/LeadHistorySheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

const STAGES = [
  'Leads Mapeados',
  'Conexão Enviada',
  'Primeiro Contato',
  'Follow-up',
  'Em Conversa / Diagnóstico',
  'Reunião Agendada',
  'Proposta / Fechamento',
]

const getTagForStage = (stage: string) => {
  switch (stage) {
    case 'Leads Mapeados':
      return (
        <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
          Novo
        </span>
      )
    case 'Conexão Enviada':
    case 'Primeiro Contato':
      return (
        <span className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
          Contato
        </span>
      )
    case 'Follow-up':
      return (
        <span className="bg-orange-100 text-orange-800 text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
          Follow-up
        </span>
      )
    case 'Em Conversa / Diagnóstico':
      return (
        <span className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
          Conversa
        </span>
      )
    case 'Reunião Agendada':
      return (
        <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
          Reunião
        </span>
      )
    case 'Proposta / Fechamento':
      return (
        <span className="bg-red-100 text-red-800 text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
          Proposta
        </span>
      )
    default:
      return (
        <span className="bg-slate-100 text-slate-800 text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
          {stage}
        </span>
      )
  }
}

export default function Pipeline() {
  const {
    opportunities,
    accounts,
    contacts,
    updateOpportunity,
    addOpportunity,
  } = useMainStore()
  const { toast } = useToast()
  const [view, setView] = useState<'kanban' | 'table'>('kanban')
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [detailsAccountId, setDetailsAccountId] = useState<string | null>(null)

  // Table filters
  const [filterStage, setFilterStage] = useState('all')
  const [filterCity, setFilterCity] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const sortedAndFilteredOpportunities = useMemo(() => {
    return opportunities
      .filter((o) => {
        const acc = accounts.find((a) => a.id === o.accountId)
        if (filterStage !== 'all' && o.stage !== filterStage) return false
        if (filterStatus !== 'all' && acc?.status !== filterStatus) return false
        if (
          filterCity &&
          !acc?.city?.toLowerCase().includes(filterCity.toLowerCase())
        )
          return false
        return true
      })
      .sort((a, b) => {
        const valA = a.total || 0
        const valB = b.total || 0
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
  }, [
    opportunities,
    accounts,
    sortOrder,
    filterStage,
    filterCity,
    filterStatus,
  ])

  const toggleSort = () => setSortOrder((p) => (p === 'desc' ? 'asc' : 'desc'))

  const handleCreateOpp = (e: any) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    addOpportunity({
      accountId: fd.get('accountId') as string,
      name: fd.get('name') as string,
      stage: fd.get('stage') as any,
      mrr: parseLocalCurrency(fd.get('mrr') as string),
      setup: parseLocalCurrency(fd.get('setup') as string),
      total: parseLocalCurrency(fd.get('total') as string),
      probability: Number(fd.get('probability')) || 0,
      nextAction: fd.get('nextAction') as string,
      nextActionDate: fd.get('nextActionDate') as string,
    })
    setIsNewOpen(false)
    toast({ title: 'Oportunidade criada com sucesso!' })
  }

  const onDragStart = (e: React.DragEvent, oppId: string) => {
    e.dataTransfer.setData('oppId', oppId)
  }

  const onDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    const oppId = e.dataTransfer.getData('oppId')
    if (oppId) {
      updateOpportunity(oppId, { stage: stage as any })
    }
  }

  return (
    <div className="space-y-6 h-full flex flex-col max-w-[1400px] mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Pipeline de Vendas
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Gestão visual de negociações
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm mr-2 hidden sm:flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('kanban')}
              className={`rounded font-bold h-8 px-4 ${view === 'kanban' ? 'bg-slate-900 text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Trello className="w-4 h-4 mr-2" /> Kanban
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('table')}
              className={`rounded font-bold h-8 px-4 ${view === 'table' ? 'bg-slate-900 text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <List className="w-4 h-4 mr-2" /> Lista / Aba Extra
            </Button>
          </div>
          <Button
            onClick={() => setIsNewOpen(true)}
            className="bg-orange-500 text-white rounded font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4 mr-2" /> Nova Oportunidade
          </Button>
        </div>
      </div>

      {view === 'table' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end mb-4">
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-slate-700">
              Filtro por Etapa
            </label>
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="Todas as etapas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as etapas</SelectItem>
                {STAGES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
                <SelectItem value="Fechado Ganho">Fechado Ganho</SelectItem>
                <SelectItem value="Fechado Perdido">Fechado Perdido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-slate-700">
              Filtro por Status da Conta
            </label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Em prospecção">Em prospecção</SelectItem>
                <SelectItem value="Qualificado">Qualificado</SelectItem>
                <SelectItem value="Cliente">Cliente</SelectItem>
                <SelectItem value="Perdido">Perdido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-slate-700">
              Filtro por Cidade
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Filtrar por cidade..."
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {view === 'kanban' ? (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 pt-2">
          {STAGES.map((stage) => {
            const opps = sortedAndFilteredOpportunities.filter(
              (o) => o.stage === stage,
            )
            const stageTotal = opps.reduce((sum, o) => sum + o.total, 0)
            return (
              <div
                key={stage}
                className="min-w-[320px] w-[320px] flex flex-col bg-slate-50/80 rounded-xl p-3 border border-slate-200"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, stage)}
              >
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="font-black text-[13px] text-slate-800 uppercase tracking-wider flex items-center">
                    {stage}
                    <span className="ml-2 bg-white text-slate-500 text-[10px] px-2 py-0.5 rounded-full border border-slate-200">
                      {opps.length}
                    </span>
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    {formatCurrency(stageTotal)}
                  </span>
                </div>
                <div className="space-y-3">
                  {opps.map((opp) => {
                    const acc = accounts.find((a) => a.id === opp.accountId)
                    const contact =
                      contacts.find(
                        (c) =>
                          c.accountId === opp.accountId && c.isDecisionMaker,
                      ) || contacts.find((c) => c.accountId === opp.accountId)
                    const isStalled = acc?.lastTouchDate
                      ? new Date().getTime() -
                          new Date(acc.lastTouchDate).getTime() >
                        14 * 24 * 60 * 60 * 1000
                      : true
                    const needsAction = !opp.nextAction

                    return (
                      <div
                        key={opp.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, opp.id)}
                        onClick={() => setDetailsAccountId(opp.accountId)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:border-slate-400 hover:shadow-md transition-all group relative"
                      >
                        <h4 className="font-black text-base text-slate-900 mb-1 leading-tight">
                          {acc?.name}
                        </h4>
                        {contact && (
                          <div className="text-xs text-slate-600 mb-2 flex items-center gap-1.5 truncate">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">
                              {contact.name}{' '}
                              <span className="text-slate-300 mx-0.5">•</span>{' '}
                              {contact.role || contact.processRole}
                            </span>
                          </div>
                        )}
                        <div className="text-[11px] font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Últ. contato:{' '}
                          {acc?.lastTouchDate
                            ? new Date(acc.lastTouchDate).toLocaleDateString()
                            : 'Nenhum'}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {getTagForStage(opp.stage)}
                          {(isStalled || needsAction) && (
                            <span
                              className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded font-black uppercase flex items-center gap-1"
                              title="Sem interação recente ou sem próxima ação"
                            >
                              <AlertTriangle className="w-3 h-3" />{' '}
                              {needsAction ? 'Sem Ação' : 'Parado'}
                            </span>
                          )}
                        </div>
                        <div className="font-black text-slate-900 text-sm mb-1">
                          {formatCurrency(opp.total)}
                        </div>

                        <div className="absolute bottom-4 right-4 flex gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                          {contact?.whatsapp && (
                            <MessageSquare
                              className="w-3.5 h-3.5 text-green-500"
                              title="WhatsApp"
                            />
                          )}
                          {contact?.linkedin && (
                            <Linkedin
                              className="w-3.5 h-3.5 text-blue-500"
                              title="LinkedIn"
                            />
                          )}
                          {acc?.phone && (
                            <Phone
                              className="w-3.5 h-3.5 text-slate-500"
                              title="Telefone"
                            />
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {opps.length === 0 && (
                    <div className="h-20 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs font-bold text-slate-400 bg-white/50">
                      Solte aqui
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-bold text-slate-900">
                  Empresa / Oportunidade
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Contato / Responsável
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Etapa
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Último Contato
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Próxima Ação
                </TableHead>
                <TableHead
                  className="font-bold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                  onClick={toggleSort}
                >
                  <div className="flex items-center gap-1">
                    Valor do Projeto{' '}
                    <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-900" />
                  </div>
                </TableHead>
                <TableHead className="font-bold text-slate-900 text-right">
                  Ação
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredOpportunities.map((opp) => {
                const acc = accounts.find((a) => a.id === opp.accountId)
                const contact =
                  contacts.find(
                    (c) => c.accountId === opp.accountId && c.isDecisionMaker,
                  ) || contacts.find((c) => c.accountId === opp.accountId)
                const overdue = opp.nextActionDate
                  ? isOverdue(opp.nextActionDate)
                  : true

                return (
                  <TableRow
                    key={opp.id}
                    className="hover:bg-slate-50/50 cursor-pointer"
                    onClick={() => setDetailsAccountId(opp.accountId)}
                  >
                    <TableCell>
                      <div className="font-bold text-sm text-slate-900">
                        {acc?.name}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {opp.name}
                      </div>
                      {(acc?.city || acc?.tags?.length) && (
                        <div className="flex items-center gap-2 mt-1">
                          {acc.city && (
                            <span className="text-[10px] text-slate-400 border border-slate-200 px-1 rounded">
                              {acc.city}
                            </span>
                          )}
                          {acc.tags?.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] text-slate-400 border border-slate-200 px-1 rounded"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-semibold text-slate-700">
                        {contact?.name || '-'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {contact?.role || contact?.processRole}
                      </div>
                    </TableCell>
                    <TableCell>{getTagForStage(opp.stage)}</TableCell>
                    <TableCell className="text-sm font-medium text-slate-600">
                      {acc?.lastTouchDate
                        ? new Date(acc.lastTouchDate).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`text-xs font-bold ${overdue ? 'text-red-600' : 'text-slate-600'}`}
                      >
                        {opp.nextAction || 'Pendente'}
                      </div>
                      {opp.nextActionDate && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(opp.nextActionDate).toLocaleDateString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-black text-slate-900">
                      {formatCurrency(opp.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDetailsAccountId(opp.accountId)
                        }}
                        className="h-8 text-xs font-bold rounded hover:bg-slate-100 text-slate-600"
                      >
                        Abrir Painel
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {sortedAndFilteredOpportunities.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-slate-500 font-medium"
                  >
                    Nenhuma oportunidade encontrada com os filtros atuais.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {detailsAccountId && (
        <LeadHistorySheet
          account={accounts.find((a) => a.id === detailsAccountId) || null}
          open={!!detailsAccountId}
          onOpenChange={(open) => !open && setDetailsAccountId(null)}
        />
      )}

      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Oportunidade</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateOpp} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Conta *
              </label>
              <select
                name="accountId"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Selecione...</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Nome do Projeto/Oportunidade *
              </label>
              <Input
                name="name"
                required
                placeholder="Ex: Expansão 50 veículos"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Fase *
                </label>
                <select
                  name="stage"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                  <option value="Fechado Ganho">Fechado Ganho</option>
                  <option value="Fechado Perdido">Fechado Perdido</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Valor do Projeto (R$)
                </label>
                <Input
                  name="total"
                  type="text"
                  inputMode="decimal"
                  defaultValue="0,00"
                  placeholder="0,00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Próxima Ação *
                </label>
                <Input
                  name="nextAction"
                  required
                  placeholder="Ex: Enviar proposta"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Data Ação *
                </label>
                <Input name="nextActionDate" type="date" required />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 text-white font-bold mt-4 hover:bg-orange-600"
            >
              Criar Oportunidade
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
