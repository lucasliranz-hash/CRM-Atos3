import { useState } from 'react'
import { Bell, Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import useMainStore from '@/stores/main'

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/focus':
        return 'Focus Mode'
      case '/pipeline':
        return 'Pipeline'
      case '/contacts':
        return 'Contatos'
      case '/accounts':
        return 'Leads'
      case '/activities':
        return 'Atividades'
      case '/calendar':
        return 'Calendário'
      case '/reports':
        return 'Relatórios'
      case '/settings':
        return 'Configurações'
      default:
        return ''
    }
  }

  const { addAccount, addOpportunity, addContact } = useMainStore()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const fd = new FormData(e.target as HTMLFormElement)
      const data = Object.fromEntries(fd.entries()) as Record<string, string>

      let nextActionDate = undefined
      if (data.nextActionDate) {
        nextActionDate = data.nextActionTime
          ? `${data.nextActionDate}T${data.nextActionTime}`
          : `${data.nextActionDate}T00:00:00`
      }

      const newAcc = await addAccount({
        name: data.companyName,
        phone: data.phone,
        city: data.city,
        segment: data.segment,
        fleetEstimate: data.fleetEstimate
          ? parseInt(data.fleetEstimate, 10)
          : undefined,
        status: 'Novo',
        priority: 'B',
        nextAction: data.nextAction || undefined,
        nextActionDate,
        notes: data.notes || undefined,
      } as any)

      if (newAcc) {
        if (data.contactName || data.linkedin || data.email) {
          await addContact({
            accountId: newAcc.id,
            name: data.contactName || 'Contato Principal',
            role: data.role,
            whatsapp: data.phone,
            email: data.email,
            linkedin: data.linkedin,
          } as any)
        }
        await addOpportunity({
          accountId: newAcc.id,
          name: `Oportunidade - ${data.companyName}`,
          stage: (data.initialStage || 'Leads Mapeados') as any,
          total: 0,
        } as any)
      }

      toast({ title: 'Lead criado com sucesso!' })
      setIsOpen(false)
    } catch (err) {
      toast({ title: 'Erro ao criar lead', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <header className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 z-40 flex items-center justify-between pointer-events-auto">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-[#0D1B2A] hidden sm:block">
          {getPageTitle()}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-slate-500 hover:text-[#0D1B2A] hover:bg-slate-100 bg-white shadow-sm border border-slate-200 w-10 h-10 relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-[#FF6A00] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white -translate-y-1 translate-x-1">
            3
          </span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-slate-500 hover:text-[#0D1B2A] hover:bg-slate-100 bg-white shadow-sm border border-slate-200 w-10 h-10"
        >
          <Calendar className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          className="hidden sm:flex border-orange-200 text-[#FF6A00] hover:bg-orange-50 hover:text-[#e65c00] bg-white font-bold h-10 px-4 rounded-[8px] shadow-sm"
          onClick={() => navigate('/focus')}
        >
          Focus Mode
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF6A00] hover:bg-[#e65c00] text-white rounded-[8px] font-bold shadow-md h-10 px-4 ml-2">
              <Plus className="w-4 h-4 mr-2" /> Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto custom-scrollbar p-0">
            <DialogHeader className="p-6 pb-4 border-b border-slate-100">
              <DialogTitle className="text-xl font-bold text-[#0D1B2A]">
                Novo Lead
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateLead} className="p-6 pt-4 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#0D1B2A]">
                    Empresa *
                  </label>
                  <Input
                    name="companyName"
                    required
                    placeholder="Nome da empresa"
                    className="rounded-[8px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#0D1B2A]">
                    Contato *
                  </label>
                  <Input
                    name="contactName"
                    required
                    placeholder="Nome do contato"
                    className="rounded-[8px]"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                  <label className="text-sm font-semibold text-[#0D1B2A]">
                    Cargo
                  </label>
                  <Input
                    name="role"
                    placeholder="Ex: Gestor de Frota"
                    className="rounded-[8px]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                  Dados do contato
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#0D1B2A]">
                      Telefone
                    </label>
                    <Input
                      name="phone"
                      placeholder="(00) 00000-0000"
                      className="rounded-[8px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#0D1B2A]">
                      E-mail
                    </label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="email@empresa.com"
                      className="rounded-[8px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#0D1B2A]">
                      LinkedIn
                    </label>
                    <Input
                      name="linkedin"
                      placeholder="URL do perfil"
                      className="rounded-[8px]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                  Dados do negócio
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#0D1B2A]">
                      Localização
                    </label>
                    <Input
                      name="city"
                      placeholder="Cidade - UF"
                      className="rounded-[8px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#0D1B2A]">
                      Frota
                    </label>
                    <Input
                      name="fleetEstimate"
                      type="number"
                      placeholder="Nº veículos"
                      className="rounded-[8px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#0D1B2A]">
                      Segmento
                    </label>
                    <Input
                      name="segment"
                      placeholder="Ex: Transporte"
                      className="rounded-[8px]"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#FFF4ED] border border-[#FFD8B3] rounded-[10px] p-5 space-y-4">
                <h3 className="text-sm font-bold text-[#FF6A00] flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Agendar Primeira Ação
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-[#0D1B2A]">
                      Descrição da Tarefa
                    </label>
                    <Input
                      name="nextAction"
                      placeholder="Ex: Follow-up WhatsApp"
                      className="bg-white rounded-[8px] border-[#FFD8B3] focus-visible:ring-[#FF6A00]"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-xs font-semibold text-[#0D1B2A]">
                      Data
                    </label>
                    <Input
                      name="nextActionDate"
                      type="date"
                      className="bg-white rounded-[8px] border-[#FFD8B3] focus-visible:ring-[#FF6A00]"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-xs font-semibold text-[#0D1B2A]">
                      Hora
                    </label>
                    <Input
                      name="nextActionTime"
                      type="time"
                      className="bg-white rounded-[8px] border-[#FFD8B3] focus-visible:ring-[#FF6A00]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#0D1B2A]">
                    Etapa do Funil
                  </label>
                  <select
                    name="initialStage"
                    className="flex h-10 w-full rounded-[8px] border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00]"
                  >
                    <option value="Leads Mapeados">Leads Mapeados</option>
                    <option value="Conexão Enviada">Conexão Enviada</option>
                    <option value="Primeiro Contato">Primeiro Contato</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#0D1B2A]">
                  Notas
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="flex w-full rounded-[8px] border border-input bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00] resize-none"
                  placeholder="Observações iniciais..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full font-bold h-11 rounded-[8px] text-[#0D1B2A]"
                >
                  Cancelar
                </Button>
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-[#FF6A00] hover:bg-[#e65c00] text-white font-bold h-11 rounded-[8px]"
                >
                  {isSubmitting ? 'Salvando...' : 'Criar Lead'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
