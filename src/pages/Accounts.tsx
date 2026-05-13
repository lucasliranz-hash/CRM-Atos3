import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useMainStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Plus, Search, Building2, Phone, Mail } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Accounts() {
  const { accounts, addLead } = useMainStore()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const filteredAccounts = useMemo(() => {
    if (!search) return accounts
    const q = search.toLowerCase()
    return accounts.filter(
      (a: any) =>
        a.name?.toLowerCase().includes(q) ||
        a.contactName?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q),
    )
  }, [accounts, search])

  const handleCreateLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    addLead({
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
      priority: 'B',
    })

    setIsCreateOpen(false)
    toast({
      title: 'Sucesso',
      description: 'Lead cadastrado e enviado para o Pipeline',
    })
    navigate('/pipeline')
  }

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Leads & Contas
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Gerencie sua base de contatos e empresas
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF6A00] hover:bg-[#e65c00] text-white font-bold h-10 px-4">
              <Plus className="w-4 h-4 mr-2" /> Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-slate-900">
                Cadastrar Novo Lead
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateLead} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Empresa *
                  </label>
                  <Input name="name" required placeholder="Nome da empresa" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Contato *
                  </label>
                  <Input
                    name="contactName"
                    required
                    placeholder="Nome do contato"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Telefone *
                  </label>
                  <Input name="phone" required placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    E-mail *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    required
                    placeholder="contato@empresa.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Cidade/Estado *
                  </label>
                  <Input
                    name="city"
                    required
                    placeholder="Ex: São Paulo - SP"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Segmento *
                  </label>
                  <Input name="segment" required placeholder="Ex: Logística" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Qtd Veículos *
                  </label>
                  <Input
                    name="fleetEstimate"
                    type="number"
                    required
                    placeholder="Ex: 50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Origem do Lead
                  </label>
                  <Input
                    name="leadSource"
                    placeholder="Ex: Indicação, Site, LinkedIn"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">
                    Estágio no Pipeline
                  </label>
                  <Select name="status" defaultValue="Prospecção">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estágio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prospecção">Prospecção</SelectItem>
                      <SelectItem value="Contato realizado">
                        Contato realizado
                      </SelectItem>
                      <SelectItem value="Reunião agendada">
                        Reunião agendada
                      </SelectItem>
                      <SelectItem value="Proposta enviada">
                        Proposta enviada
                      </SelectItem>
                      <SelectItem value="Negociação">Negociação</SelectItem>
                      <SelectItem value="Fechado">Fechado</SelectItem>
                      <SelectItem value="Perdido">Perdido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">
                    Observações
                  </label>
                  <Textarea
                    name="notes"
                    placeholder="Detalhes adicionais..."
                    className="h-20 resize-none"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold w-full md:w-auto"
                >
                  Salvar e ir para Pipeline
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por empresa, contato ou email..."
            className="pl-9 h-10 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 overflow-y-auto content-start custom-scrollbar">
        {filteredAccounts.map((acc: any) => (
          <div
            key={acc.id}
            onClick={() => navigate(`/leads/${acc.id}`)}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#FF6A00]/50 transition-all cursor-pointer flex flex-col gap-3 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#FF6A00] transition-colors">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-[15px] leading-tight group-hover:text-[#FF6A00] transition-colors line-clamp-1">
                    {acc.name}
                  </h3>
                  <span className="text-xs font-medium text-slate-500">
                    {acc.segment || 'Sem segmento'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm mt-1">
              {acc.contactName && (
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-medium">{acc.contactName}</span>
                </div>
              )}
              {acc.phone && (
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-xs">{acc.phone}</span>
                </div>
              )}
              {acc.email && (
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="text-xs truncate">{acc.email}</span>
                </div>
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                {acc.status || 'Prospecção'}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Frota: {acc.fleetEstimate || 0}
              </span>
            </div>
          </div>
        ))}

        {filteredAccounts.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
            <Building2 className="w-12 h-12 mb-3 text-slate-300" />
            <p className="font-medium">Nenhum lead encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}
