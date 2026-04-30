import { useState } from 'react'
import { Bell, Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
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

import { useLocation } from 'react-router-dom'

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
      const companyName = fd.get('companyName') as string
      const contactName = fd.get('contactName') as string
      const phone = fd.get('phone') as string
      const linkedin = fd.get('linkedin') as string
      const city = fd.get('city') as string
      const fleetEstimate = fd.get('fleetEstimate') as string
      const initialStage =
        (fd.get('initialStage') as string) || 'Leads Mapeados'

      const newAcc = await addAccount({
        name: companyName,
        phone,
        city,
        fleetEstimate: fleetEstimate ? parseInt(fleetEstimate, 10) : undefined,
        status: 'Novo',
        priority: 'B',
      } as any)

      if (newAcc) {
        if (contactName || linkedin) {
          await addContact({
            accountId: newAcc.id,
            name: contactName || 'Contato Principal',
            whatsapp: phone,
            linkedin,
          } as any)
        }
        await addOpportunity({
          accountId: newAcc.id,
          name: `Oportunidade - ${companyName}`,
          stage: initialStage as any,
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
        <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
          {getPageTitle()}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 bg-white shadow-sm border border-slate-200 w-10 h-10 relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white -translate-y-1 translate-x-1">
            3
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 bg-white shadow-sm border border-slate-200 w-10 h-10"
        >
          <Calendar className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          className="hidden sm:flex border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 bg-white font-bold h-10 px-4 rounded-md shadow-sm"
          onClick={() => navigate('/focus')}
        >
          Focus Mode
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF6A00] hover:bg-[#e65c00] text-white rounded-md font-bold shadow-md h-10 px-4 ml-2">
              <Plus className="w-4 h-4 mr-2" /> Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Lead</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateLead} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Empresa
                </label>
                <Input
                  name="companyName"
                  required
                  placeholder="Ex: Tech Solutions"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Nome do Contato
                </label>
                <Input name="contactName" placeholder="Ex: João Silva" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Telefone
                </label>
                <Input name="phone" placeholder="Ex: (11) 99999-9999" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  LinkedIn
                </label>
                <Input name="linkedin" placeholder="URL do LinkedIn" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Cidade
                  </label>
                  <Input name="city" placeholder="Ex: São Paulo" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Nº veículos
                  </label>
                  <Input
                    name="fleetEstimate"
                    type="number"
                    placeholder="Ex: 10"
                  />
                </div>
              </div>
              <div className="space-y-2 hidden">
                <label className="text-sm font-bold text-slate-700">
                  Etapa Inicial
                </label>
                <select
                  name="initialStage"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Leads Mapeados">Leads Mapeados</option>
                  <option value="Conexão Enviada">Conexão Enviada</option>
                  <option value="Primeiro Contato">Primeiro Contato</option>
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full font-bold"
                >
                  Cancelar
                </Button>
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-[#FF6A00] hover:bg-[#e65c00] text-white font-bold"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
