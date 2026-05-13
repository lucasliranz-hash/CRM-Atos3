import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useMainStore from '@/stores/main'
import { Plus, Search, FileText, Trash2, Edit2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/crm-utils'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function Proposals() {
  const { proposals, deleteProposal, addProposalToLead } = useMainStore()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredProposals = useMemo(() => {
    let list = proposals
    if (statusFilter !== 'all') {
      list = list.filter((p) => p.status === statusFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.proposalNumber?.toLowerCase().includes(q) ||
          p.companyName?.toLowerCase().includes(q) ||
          p.contactName?.toLowerCase().includes(q),
      )
    }
    return list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [proposals, search, statusFilter])

  const totalInNegotiation = useMemo(() => {
    return proposals
      .filter((p) => p.status === 'Enviada')
      .reduce(
        (acc, p) =>
          acc +
          (p.totalSetup || 0) +
          (p.totalEquipment || 0) +
          (p.totalMonthly * 12 || 0),
        0,
      )
  }, [proposals])

  const handleDuplicate = (prop: any) => {
    const dup = {
      ...prop,
      id: crypto.randomUUID(),
      proposalNumber: `PRO-${Math.floor(Math.random() * 10000)}`,
      status: 'Rascunho',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      travelFee: prop.travelFee ? { ...prop.travelFee } : undefined,
    }
    addProposalToLead(dup)
    toast({ title: 'Proposta duplicada com sucesso!' })
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta proposta?')) {
      deleteProposal(id)
      toast({ title: 'Proposta excluída.' })
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 animate-in fade-in duration-500 min-h-[calc(100vh-6rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Propostas Comerciais
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            Gerencie todas as propostas enviadas e em rascunho.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col text-right mr-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Valor em Negociação (12x)
            </span>
            <span className="text-2xl font-black text-[#FF6A00]">
              {formatCurrency(totalInNegotiation)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por Nº, Empresa ou Contato..."
            className="pl-9 h-10 border-slate-200"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px] h-10 border-slate-200 bg-slate-50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="Rascunho">Rascunho</SelectItem>
            <SelectItem value="Enviada">Enviada</SelectItem>
            <SelectItem value="Aprovada">Aprovada</SelectItem>
            <SelectItem value="Recusada">Recusada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredProposals.length === 0 ? (
        <Card className="border-dashed border-2 shadow-none border-slate-200 bg-slate-50">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">
              Nenhuma proposta encontrada
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
              Você ainda não tem propostas com os filtros selecionados ou ainda
              não criou nenhuma.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nº / Data</th>
                  <th className="px-6 py-4">Lead</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Valor Mensal</th>
                  <th className="px-6 py-4 text-right">Setup / Equip</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProposals.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">
                        {p.proposalNumber || 'PRO-000'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0D1B2A]">
                        {p.companyName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {p.contactName} • {p.vehicleQuantity || 0} veíc.
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'text-[11px] font-bold px-2.5 py-1 rounded-md border',
                          p.status === 'Enviada'
                            ? 'bg-orange-50 text-orange-600 border-orange-100'
                            : p.status === 'Aprovada'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : p.status === 'Recusada'
                                ? 'bg-red-50 text-red-600 border-red-100'
                                : 'bg-slate-100 text-slate-600 border-slate-200',
                        )}
                      >
                        {p.status || 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-[#FF6A00]">
                        {formatCurrency(p.totalMonthly || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-semibold text-slate-700">
                        {formatCurrency(
                          (p.totalSetup || 0) + (p.totalEquipment || 0),
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-[#FF6A00]"
                          onClick={() => navigate(`/proposals/${p.id}`)}
                          title="Editar/Ver"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-blue-600"
                          onClick={() => handleDuplicate(p)}
                          title="Duplicar"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(p.id)}
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
