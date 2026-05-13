import { useState } from 'react'
import useMainStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  MapPin,
  Phone,
  Building2,
  Mail,
  Users,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'

export default function Accounts() {
  const { accounts, addLead } = useMainStore()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const handleAddLead = (e: React.FormEvent<HTMLFormElement>) => {
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
      status: 'Prospecção',
    })

    setIsOpen(false)
    toast({ title: 'Lead cadastrado e enviado para o Pipeline' })
    navigate('/pipeline')
  }

  const filtered = accounts.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.contactName?.toLowerCase().includes(search.toLowerCase()) ||
      a.phone?.includes(search),
  )

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Contas & Leads
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            Gerencie sua base de clientes e prospects
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF6A00] text-white hover:bg-[#e65c00] rounded-[8px] font-bold h-10 shadow-md">
              <Plus className="w-4 h-4 mr-2" /> Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-slate-900">
                Cadastrar Novo Lead
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddLead} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Nome da empresa *
                  </label>
                  <Input
                    name="name"
                    required
                    placeholder="Ex: Transportes Silva"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Nome do contato *
                  </label>
                  <Input
                    name="contactName"
                    required
                    placeholder="Ex: João Souza"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Telefone
                  </label>
                  <Input name="phone" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    E-mail
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="joao@empresa.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Cidade/Estado
                  </label>
                  <Input name="city" placeholder="Ex: São Paulo / SP" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Segmento
                  </label>
                  <Input name="segment" placeholder="Ex: Logística" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Quantidade de veículos
                  </label>
                  <Input
                    name="fleetEstimate"
                    type="number"
                    placeholder="Ex: 50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Origem do lead
                  </label>
                  <Input
                    name="leadSource"
                    placeholder="Ex: Indicação, Site, etc."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Observações
                </label>
                <Textarea
                  name="notes"
                  placeholder="Detalhes adicionais..."
                  className="resize-none h-20"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 mt-6"
              >
                Salvar Lead
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-[10px] border border-slate-100 shadow-sm bg-white flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 shrink-0">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por empresa, contato ou telefone..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
        </div>
        <CardContent className="p-0 overflow-y-auto flex-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center justify-center h-full">
              <Users className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-slate-500 font-medium">
                Nenhum lead encontrado.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => navigate(`/leads/${acc.id}`)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm shrink-0">
                      {acc.name?.charAt(0).toUpperCase() || 'E'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{acc.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Building2 className="w-3 h-3" />{' '}
                          {acc.segment || 'Sem segmento'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{' '}
                          {acc.city || 'Sem local'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 md:gap-8 bg-white p-3 md:p-0 rounded-lg border md:border-none border-slate-100">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Contato
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                        {acc.contactName || '-'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Telefone
                      </span>
                      <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />{' '}
                        {acc.phone || '-'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        E-mail
                      </span>
                      <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />{' '}
                        {acc.email || '-'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Estágio
                      </span>
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                        {acc.status || 'Prospecção'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
