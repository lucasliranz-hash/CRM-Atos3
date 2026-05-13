import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useMainStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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

export default function Accounts() {
  const { accounts, addLead } = useMainStore()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    const newLead = {
      name: fd.get('name'),
      contactName: fd.get('contactName'),
      phone: fd.get('phone'),
      email: fd.get('email'),
      city: fd.get('city'),
      segment: fd.get('segment'),
      fleetEstimate: Number(fd.get('fleetEstimate')) || 0,
      leadSource: fd.get('leadSource'),
      notes: fd.get('notes'),
      status: fd.get('status') || 'Prospecção',
    }

    addLead(newLead)
    setIsOpen(false)
    toast({ title: 'Lead cadastrado e enviado para o Pipeline' })
    navigate('/pipeline')
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Leads
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Gerenciamento de leads e empresas
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF6A00] text-white hover:bg-[#e65c00] rounded-[8px] font-bold shadow-md h-10">
              <Plus className="w-4 h-4 mr-2" /> Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-slate-900">
                Cadastrar Novo Lead
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-sm font-bold text-slate-700">
                    Empresa *
                  </label>
                  <Input name="name" required placeholder="Nome da empresa" />
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-sm font-bold text-slate-700">
                    Contato *
                  </label>
                  <Input
                    name="contactName"
                    required
                    placeholder="Nome do decisor"
                  />
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-sm font-bold text-slate-700">
                    Telefone *
                  </label>
                  <Input name="phone" required placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-sm font-bold text-slate-700">
                    E-mail
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="contato@empresa.com"
                  />
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-sm font-bold text-slate-700">
                    Cidade/Estado
                  </label>
                  <Input name="city" placeholder="Ex: São Paulo / SP" />
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-sm font-bold text-slate-700">
                    Segmento
                  </label>
                  <Input name="segment" placeholder="Ex: Logística" />
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-sm font-bold text-slate-700">
                    Qtd Veículos
                  </label>
                  <Input
                    name="fleetEstimate"
                    type="number"
                    placeholder="Ex: 10"
                  />
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-sm font-bold text-slate-700">
                    Origem do Lead
                  </label>
                  <Select name="leadSource" defaultValue="Inbound">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inbound">Inbound</SelectItem>
                      <SelectItem value="Outbound">Outbound</SelectItem>
                      <SelectItem value="Indicação">Indicação</SelectItem>
                      <SelectItem value="Parceiro">Parceiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-sm font-bold text-slate-700">
                    Estágio Inicial
                  </label>
                  <Select name="status" defaultValue="Prospecção">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prospecção">Prospecção</SelectItem>
                      <SelectItem value="Contato realizado">
                        Contato realizado
                      </SelectItem>
                      <SelectItem value="Reunião agendada">
                        Reunião agendada
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-sm font-bold text-slate-700">
                    Observações
                  </label>
                  <Textarea
                    name="notes"
                    placeholder="Detalhes adicionais..."
                    className="resize-none h-20"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 mt-6"
              >
                Salvar e Ir para Pipeline
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-bold text-slate-900">
                Empresa / Contato
              </TableHead>
              <TableHead className="font-bold text-slate-900">
                Telefone / E-mail
              </TableHead>
              <TableHead className="font-bold text-slate-900">
                Segmento / Cidade
              </TableHead>
              <TableHead className="font-bold text-slate-900">
                Estágio
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((acc: any) => (
              <TableRow
                key={acc.id}
                className="hover:bg-slate-50/50 cursor-pointer"
                onClick={() => navigate(`/leads/${acc.id}`)}
              >
                <TableCell>
                  <div className="font-bold text-slate-900">{acc.name}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {acc.contactName || '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-700 font-medium">
                    {acc.phone || '-'}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {acc.email || '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-700 font-medium">
                    {acc.segment || '-'}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {acc.city || '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    {acc.status || 'Prospecção'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {accounts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-slate-500 font-medium"
                >
                  Nenhum lead cadastrado ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
