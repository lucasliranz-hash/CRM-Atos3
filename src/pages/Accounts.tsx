import { useState } from 'react'
import useMainStore from '@/stores/main'
import { getStatusColor, getActionColor } from '@/lib/crm-utils'
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
import { Download, Plus, Search, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Accounts() {
  const { accounts, contacts, addAccount } = useMainStore()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filtered = accounts.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()),
  )

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
          <h1 className="text-3xl font-black text-black">Contas e Leads</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Gestão da base de prospectos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => mockAction('Importar CSV')}
            className="rounded font-bold border-gray-300 text-black hidden sm:flex"
          >
            <Upload className="w-4 h-4 mr-2" /> Importar
          </Button>
          <Button
            variant="outline"
            onClick={() => mockAction('Exportar')}
            className="rounded font-bold border-gray-300 text-black hidden sm:flex"
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
                      Modelo Frota
                    </label>
                    <Input name="fleetModel" placeholder="Ex: Própria" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">
                      Tam. Frota
                    </label>
                    <Input name="fleetEstimate" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">
                      Fonte do Lead
                    </label>
                    <Input name="leadSource" placeholder="Ex: Inbound" />
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
                      Potencial
                    </label>
                    <select
                      name="accountPotential"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Médio">Médio</option>
                      <option value="Alto">Alto</option>
                      <option value="Baixo">Baixo</option>
                    </select>
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
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            className="bg-transparent font-medium border-none outline-none text-sm w-full placeholder:text-gray-400"
            placeholder="Buscar contas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-bold text-black">Empresa</TableHead>
              <TableHead className="font-bold text-black">
                Status / Prioridade
              </TableHead>
              <TableHead className="font-bold text-black">Contatos</TableHead>
              <TableHead className="font-bold text-black">
                Próxima Ação
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((acc) => {
              const accContacts = contacts.filter((c) => c.accountId === acc.id)
              const alertNoContact = accContacts.length === 0
              const alertNoAction = !acc.nextActionDate

              return (
                <TableRow key={acc.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="font-bold text-black">{acc.name}</div>
                    <div className="text-xs text-gray-500 mt-1 font-medium">
                      {acc.website || acc.segment || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${getStatusColor(acc.status)} border-0 shadow-none font-bold rounded`}
                      >
                        {acc.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-gray-200 text-gray-600 font-bold rounded"
                      >
                        Prio {acc.priority}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {alertNoContact ? (
                      <span className="text-red-600 text-xs font-bold border border-red-200 bg-red-50 px-2 py-1 rounded">
                        Sem contatos
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-gray-700">
                        {accContacts.length} pessoa(s)
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {alertNoAction ? (
                      <span className="text-gray-500 text-xs font-bold italic">
                        Ação Pendente
                      </span>
                    ) : (
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-xs font-bold text-black">
                          {acc.nextAction}
                        </span>
                        <Badge
                          className={`${getActionColor(acc.nextActionDate)} border-0 shadow-none rounded font-bold text-[10px] px-1.5 py-0`}
                        >
                          {new Date(acc.nextActionDate!).toLocaleDateString()}
                        </Badge>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
