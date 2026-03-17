import { useState } from 'react'
import useMainStore from '@/stores/main'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Contacts() {
  const { contacts, accounts, addContact } = useMainStore()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const handleCreate = (e: any) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    addContact({
      accountId: fd.get('accountId') as string,
      name: fd.get('name') as string,
      role: fd.get('role') as string,
      processRole: fd.get('processRole') as any,
      email: fd.get('email') as string,
      whatsapp: fd.get('whatsapp') as string,
      linkedin: fd.get('linkedin') as string,
      isDecisionMaker: fd.get('processRole') === 'Decisor',
      isInfluencer: fd.get('processRole') === 'Influenciador',
      isChampion: fd.get('processRole') === 'Campeão',
    })
    setIsOpen(false)
    toast({ title: 'Contato adicionado com sucesso!' })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-black">Contatos</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Pessoas e decisores vinculados às contas
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white rounded font-bold hover:bg-gray-800">
              <Plus className="w-4 h-4 mr-2" /> Novo Contato
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Contato</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-gray-700">
                    Conta *
                  </label>
                  <select
                    name="accountId"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-black"
                  >
                    <option value="">Selecione...</option>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-gray-700">
                    Papel no Processo *
                  </label>
                  <select
                    name="processRole"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-black"
                  >
                    <option value="Decisor">Decisor</option>
                    <option value="Influenciador">Influenciador</option>
                    <option value="Campeão">Campeão</option>
                    <option value="Gatekeeper">Gatekeeper</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Operações">Operações</option>
                  </select>
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-gray-700">
                    Nome *
                  </label>
                  <Input name="name" required placeholder="Nome completo" />
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-gray-700">
                    Cargo
                  </label>
                  <Input name="role" placeholder="Ex: CEO" />
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-gray-700">
                    E-mail
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="contato@empresa.com"
                  />
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-gray-700">
                    WhatsApp
                  </label>
                  <Input name="whatsapp" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-gray-700">
                    LinkedIn URL
                  </label>
                  <Input
                    name="linkedin"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-black text-white font-bold mt-2"
              >
                Salvar Contato
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-bold text-black">
                Nome / Cargo
              </TableHead>
              <TableHead className="font-bold text-black">Conta</TableHead>
              <TableHead className="font-bold text-black">Papel</TableHead>
              <TableHead className="font-bold text-black">Contato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((c) => {
              const acc = accounts.find((a) => a.id === c.accountId)
              return (
                <TableRow key={c.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="font-bold text-black">{c.name}</div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">
                      {c.role || '-'}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-gray-700">
                    {acc?.name}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${c.isDecisionMaker ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {c.processRole}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-gray-600 space-y-1">
                      {c.email && <div>{c.email}</div>}
                      {c.whatsapp && <div>{c.whatsapp}</div>}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {contacts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  Nenhum contato cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
