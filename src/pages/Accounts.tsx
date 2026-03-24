import { useState } from 'react'
import useMainStore from '@/stores/main'
import { getActionColor } from '@/lib/crm-utils'
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
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Download,
  FileText,
  Plus,
  Search,
  Upload,
  AlertCircle,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ProposalGeneratorDialog } from '@/components/proposal/ProposalGeneratorDialog'

export default function Accounts() {
  const { accounts, contacts, addAccount } = useMainStore()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterInterest, setFilterInterest] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [proposalAccountId, setProposalAccountId] = useState<string | null>(
    null,
  )

  const filtered = accounts.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus ? a.status === filterStatus : true
    const matchInterest = filterInterest
      ? a.interestLevel === filterInterest
      : true
    return matchSearch && matchStatus && matchInterest
  })

  const getDaysWithoutContact = (date?: string) => {
    if (!date) return 'Nunca'
    const diff = new Date().getTime() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 3600 * 24))
    return days <= 0 ? 'Hoje' : `${days} d`
  }

  const handleCreate = (e: any) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    addAccount({
      name: fd.get('name') as string,
      website: fd.get('website') as string,
      phone: fd.get('phone') as string,
      segment: fd.get('segment') as string,
      fleetModel: fd.get('fleetModel') as string,
      fleetEstimate: Number(fd.get('fleetEstimate')) || 0,
      leadSource: fd.get('leadSource') as string,
      detailedSource: fd.get('detailedSource') as string,
      status: fd.get('status') as any,
      priority: fd.get('priority') as any,
      icpFit: fd.get('icpFit') as string,
      interestLevel: fd.get('interestLevel') as any,
      accountPotential: fd.get('accountPotential') as any,
      cadenceStage: fd.get('cadenceStage') as string,
    })
    setIsOpen(false)
    toast({ title: 'Conta criada com sucesso!' })
  }

  const mockAction = (action: string) =>
    toast({
      title: action,
      description: 'Funcionalidade simulada no protótipo.',
    })

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight">
            Contas e Leads
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Gestão operacional da base de prospectos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => mockAction('Importar CSV')}
            className="rounded font-bold border-gray-200 text-black hidden sm:flex hover:bg-gray-50"
          >
            <Upload className="w-4 h-4 mr-2" /> Importar
          </Button>
          <Button
            variant="outline"
            onClick={() => mockAction('Exportar')}
            className="rounded font-bold border-gray-200 text-black hidden sm:flex hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" /> Exportar
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white rounded font-bold hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" /> Nova Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Criar Nova Conta</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-6 mt-2">
                <div className="grid grid-cols-2 gap-4 border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-700">
                      Empresa *
                    </label>
                    <Input
                      name="name"
                      required
                      placeholder="Ex: Logística Alfa"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-700">
                      Website
                    </label>
                    <Input
                      name="website"
                      placeholder="exemplo.com.br"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-700">
                      Telefone Geral
                    </label>
                    <Input
                      name="phone"
                      placeholder="(00) 0000-0000"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-700">
                      Status *
                    </label>
                    <select
                      name="status"
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-black"
                    >
                      <option value="Novo">Novo</option>
                      <option value="Em pesquisa">Em pesquisa</option>
                      <option value="Pronto para contato">
                        Pronto para contato
                      </option>
                      <option value="Em prospecção">Em prospecção</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">
                      Segmento
                    </label>
                    <Input name="segment" placeholder="Ex: Transporte" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">
                      Tam. Frota
                    </label>
                    <Input name="fleetEstimate" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">
                      Interesse
                    </label>
                    <select
                      name="interestLevel"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Desconhecido</option>
                      <option value="Frio">Frio</option>
                      <option value="Morno">Morno</option>
                      <option value="Quente">Quente</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">
                      Origem Detalhada
                    </label>
                    <Input name="detailedSource" placeholder="Ex: Google Ads" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">
                      Prioridade
                    </label>
                    <select
                      name="priority"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="B">B - Média</option>
                      <option value="A">A - Alta</option>
                      <option value="C">C - Baixa</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">
                      Cadência Atual
                    </label>
                    <Input name="cadenceStage" placeholder="Ex: Toque 1" />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black text-white font-bold"
                >
                  Salvar Conta
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4 bg-gray-50/30">
          <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-black">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              className="bg-transparent font-medium border-none outline-none text-sm w-full placeholder:text-gray-400"
              placeholder="Buscar contas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 outline-none w-full sm:w-auto"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Status: Todos</option>
              <option value="Novo">Novo</option>
              <option value="Em prospecção">Em prospecção</option>
              <option value="Qualificado">Qualificado</option>
              <option value="Aguardando retorno">Aguardando retorno</option>
            </select>
            <select
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 outline-none w-full sm:w-auto"
              value={filterInterest}
              onChange={(e) => setFilterInterest(e.target.value)}
            >
              <option value="">Interesse: Todos</option>
              <option value="Quente">Quente</option>
              <option value="Morno">Morno</option>
              <option value="Frio">Frio</option>
            </select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-bold text-black">Empresa</TableHead>
              <TableHead className="font-bold text-black">Status</TableHead>
              <TableHead className="font-bold text-black">
                Último Toque
              </TableHead>
              <TableHead className="font-bold text-black">
                Próxima Ação
              </TableHead>
              <TableHead className="font-bold text-black text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((acc) => {
              const alertNoAction = !acc.nextActionDate

              return (
                <TableRow key={acc.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="font-bold text-black text-sm">
                      {acc.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 font-medium flex items-center gap-2">
                      <span>{acc.segment || '-'}</span>
                      {acc.interestLevel && (
                        <span className="bg-gray-100 border border-gray-200 px-1.5 rounded text-gray-600">
                          {acc.interestLevel}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-gray-200 text-gray-700 font-bold rounded bg-white shadow-sm"
                      >
                        {acc.status}
                      </Badge>
                      <span className="text-xs font-bold text-gray-500">
                        Prio {acc.priority}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-gray-700">
                      {getDaysWithoutContact(acc.lastTouchDate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {alertNoAction ? (
                      <span className="text-red-600 text-xs font-bold flex items-center bg-red-50 border border-red-100 px-2 py-1 rounded w-fit">
                        <AlertCircle className="w-3 h-3 mr-1" /> Sem Ação
                      </span>
                    ) : (
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-xs font-bold text-black">
                          {acc.nextAction}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getActionColor(acc.nextActionDate)}`}
                        >
                          {new Date(acc.nextActionDate!).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setProposalAccountId(acc.id)}
                      className="h-8 text-xs font-bold rounded hover:bg-gray-100"
                    >
                      <FileText className="w-4 h-4 mr-2 text-gray-500" />
                      Proposta
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-500 font-medium"
                >
                  Nenhuma conta encontrada com estes filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ProposalGeneratorDialog
        accountId={proposalAccountId}
        open={!!proposalAccountId}
        onOpenChange={(open) => !open && setProposalAccountId(null)}
      />
    </div>
  )
}
