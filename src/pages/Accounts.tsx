import { useState } from 'react'
import useMainStore from '@/stores/main'
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  MessageSquare,
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

export default function Accounts() {
  const { accounts, contacts, opportunities } = useMainStore()
  const [detailsAccountId, setDetailsAccountId] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [filterStage, setFilterStage] = useState('all')
  const [filterCity, setFilterCity] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const STAGES = [
    'Leads Mapeados',
    'Conexão Enviada',
    'Primeiro Contato',
    'Follow-up',
    'Em Conversa',
    'Reunião',
    'Proposta',
  ]

  const uniqueCities = Array.from(
    new Set(accounts.map((a) => a.city).filter(Boolean)),
  ) as string[]

  const filteredAccounts = accounts.filter((acc) => {
    const opp = opportunities.find((o) => o.accountId === acc.id)
    const contact = contacts.find((c) => c.accountId === acc.id)

    if (filterStage !== 'all' && opp?.stage !== filterStage) return false
    if (filterCity !== 'all' && acc.city !== filterCity) return false
    if (filterStatus !== 'all' && acc.status !== filterStatus) return false

    if (search) {
      const s = search.toLowerCase()
      if (
        !acc.name.toLowerCase().includes(s) &&
        !contact?.name?.toLowerCase().includes(s)
      ) {
        return false
      }
    }
    return true
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Lista de Leads
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Todos os leads cadastrados no sistema.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[10px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-[300px]">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Buscar lead..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 font-bold"
              />
            </div>
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="w-[160px] bg-slate-50 border-slate-200 font-bold text-slate-600">
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
            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200 font-bold text-slate-600">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas cidades</SelectItem>
                {uniqueCities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="font-bold border-slate-200 text-slate-600"
            >
              <Filter className="w-4 h-4 mr-2" /> Filtros
            </Button>
            <Button variant="ghost" className="font-bold text-slate-600">
              <Download className="w-4 h-4 mr-2" /> Exportar
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 border-b-2 border-slate-100">
                <TableHead className="font-bold text-slate-500 text-[11px] uppercase tracking-wider py-4">
                  Empresa
                </TableHead>
                <TableHead className="font-bold text-slate-500 text-[11px] uppercase tracking-wider py-4">
                  Contato
                </TableHead>
                <TableHead className="font-bold text-slate-500 text-[11px] uppercase tracking-wider py-4">
                  Etapa
                </TableHead>
                <TableHead className="font-bold text-slate-500 text-[11px] uppercase tracking-wider py-4">
                  Último Contato
                </TableHead>
                <TableHead className="font-bold text-slate-500 text-[11px] uppercase tracking-wider py-4">
                  Próxima Ação
                </TableHead>
                <TableHead className="w-10 py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((acc) => {
                const contact = contacts.find((c) => c.accountId === acc.id)
                const opp = opportunities.find((o) => o.accountId === acc.id)

                return (
                  <TableRow
                    key={acc.id}
                    onClick={() => setDetailsAccountId(acc.id)}
                    className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-sm">
                          {acc.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-sm text-slate-900">
                          {acc.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-800 text-sm">
                        {contact?.name || '-'}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {contact?.role || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap bg-slate-100 text-slate-700">
                        {opp?.stage || 'Sem Oportunidade'}
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
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#FF6A00]" />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {acc.nextAction || '-'}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            {acc.nextActionDate
                              ? new Date(acc.nextActionDate).toLocaleString(
                                  'pt-BR',
                                  {
                                    day: '2-digit',
                                    month: '2-digit',
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
