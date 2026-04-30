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

export function Header() {
  const navigate = useNavigate()
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
      const initialStage = fd.get('initialStage') as string

      const newAcc = await addAccount({
        name: companyName,
        status: 'Novo',
        priority: 'B',
      } as any)

      if (newAcc) {
        if (contactName) {
          await addContact({
            accountId: newAcc.id,
            name: contactName,
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
    <header className="absolute top-0 right-0 p-6 z-40 flex items-center gap-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3">
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
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-md font-bold shadow-md h-10 px-4 ml-2">
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
                  Nome da Empresa
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
              <Button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold mt-2"
              >
                {isSubmitting ? 'Criando...' : 'Criar Lead'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
