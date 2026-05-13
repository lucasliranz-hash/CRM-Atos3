import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useMainStore from '@/stores/main'
import { useNavigate } from 'react-router-dom'

export function NewLeadDialog({ children }: { children?: React.ReactNode }) {
  const { addLead } = useMainStore()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const fd = new FormData(e.target as HTMLFormElement)
      const data = Object.fromEntries(fd.entries()) as Record<string, string>

      await addLead({
        companyName: data.companyName,
        contactName: data.contactName,
        phone: data.phone,
        email: data.email,
        city: data.city,
        state: data.state,
        segment: data.segment,
        vehicleCount: data.vehicleCount ? parseInt(data.vehicleCount, 10) : 0,
        source: data.source,
        notes: data.notes,
        pipelineStage: data.pipelineStage || 'Prospecção',
        status: 'Novo Lead',
      })

      toast({ title: 'Lead criado com sucesso!' })
      setIsOpen(false)
      navigate('/pipeline')
    } catch (err: any) {
      toast({
        title: 'Erro ao criar lead',
        description: err.message || 'Erro desconhecido',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-[#FF6A00] text-white hover:bg-[#e65c00] rounded-[8px] font-bold h-10 shadow-md">
            <Plus className="w-4 h-4 mr-2" /> Novo Lead
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900">
            Cadastrar Novo Lead
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Empresa *
              </label>
              <Input
                name="companyName"
                required
                placeholder="Ex: Transportes Silva"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Contato *
              </label>
              <Input name="contactName" required placeholder="Ex: João Souza" />
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
              <label className="text-sm font-bold text-slate-700">E-mail</label>
              <Input name="email" type="email" placeholder="joao@empresa.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-bold text-slate-700">Cidade</label>
              <Input name="city" placeholder="Ex: São Paulo" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Estado</label>
              <Input name="state" placeholder="Ex: SP" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Segmento
              </label>
              <Input name="segment" placeholder="Ex: Logística" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Quantidade de veículos
              </label>
              <Input name="vehicleCount" type="number" placeholder="Ex: 50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Origem do lead
              </label>
              <Input name="source" placeholder="Ex: Indicação, Site, etc." />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Etapa do Funil
              </label>
              <select
                name="pipelineStage"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]"
                defaultValue="Prospecção"
              >
                <option value="Prospecção">Prospecção</option>
                <option value="Contato realizado">Contato realizado</option>
                <option value="Reunião agendada">Reunião agendada</option>
                <option value="Proposta enviada">Proposta enviada</option>
              </select>
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
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-[#FF6A00] hover:bg-[#e65c00] text-white font-bold h-11 mt-6"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Lead'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
