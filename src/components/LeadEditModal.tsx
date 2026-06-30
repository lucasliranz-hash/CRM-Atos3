import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Building2,
  UserCircle,
  MapPin,
  Truck,
  TrendingUp,
  Loader2,
} from 'lucide-react'
import useMainStore from '@/stores/main'

export function LeadEditModal({
  open,
  onOpenChange,
  accountId,
  onSuccess,
}: any) {
  const [formData, setFormData] = useState<any>({})
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const { fetchData } = useMainStore() as any

  useEffect(() => {
    if (open && accountId) {
      setLoading(true)
      Promise.all([
        supabase.from('accounts').select('*').eq('id', accountId).single(),
        supabase.from('profiles').select('id, nome, email'),
      ]).then(([accRes, profRes]) => {
        if (accRes.data) setFormData(accRes.data)
        if (profRes.data) setProfiles(profRes.data)
        setLoading(false)
      })
    }
  }, [open, accountId])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelect = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value === 'none' ? null : value,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    const editableFields = [
      'name',
      'cnpj',
      'segment',
      'website',
      'source',
      'status',
      'pipelineStage',
      'notes',
      'contactName',
      'contactRole',
      'phone',
      'whatsapp',
      'email',
      'address',
      'number',
      'district',
      'city',
      'state',
      'zip_code',
      'vehicleCount',
      'fleetModel',
      'fleet_notes',
      'solutionInterest',
      'leadTemperature',
      'accountPotential',
      'user_id',
      'nextAction',
      'nextActionDate',
      'nextActionTime',
      'nextActionNotes',
    ]

    const payload: any = {}
    editableFields.forEach((f) => {
      if (formData[f] !== undefined) {
        payload[f] = formData[f] === '' ? null : formData[f]
      }
    })

    if (payload.vehicleCount) {
      payload.vehicleCount = parseInt(payload.vehicleCount, 10) || 0
    }

    // If nextAction changed, reset status
    if (payload.nextAction && formData.nextActionStatus === 'Concluída') {
      payload.nextActionStatus = null
    }

    if (payload.status === 'Ganho') {
      payload.pipelineStage = 'Fechado'
      payload.nextActionStatus = 'Concluída'
    }

    const { error } = await supabase
      .from('accounts')
      .update(payload)
      .eq('id', accountId)

    setSaving(false)
    if (error) {
      toast({
        title: 'Erro ao salvar lead',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Lead atualizado com sucesso!' })
      await fetchData()
      onSuccess?.()
      onOpenChange(false)
      window.dispatchEvent(new Event('lead_updated'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[90vh] flex flex-col p-0 overflow-hidden bg-white">
        <DialogHeader className="p-6 pb-2 border-b border-slate-100 shrink-0">
          <DialogTitle className="text-xl font-black text-slate-900">
            Editar Lead Completo
          </DialogTitle>
          <DialogDescription>
            Atualize as informações corporativas, de contato e comerciais deste
            lead.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-6">
              <Tabs defaultValue="company" className="w-full">
                <TabsList className="grid grid-cols-5 bg-slate-100 h-auto p-1 rounded-lg mb-4">
                  <TabsTrigger
                    value="company"
                    className="text-[10px] sm:text-xs py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Building2 className="w-3.5 h-3.5 sm:mr-1.5 hidden sm:block" />{' '}
                    Empresa
                  </TabsTrigger>
                  <TabsTrigger
                    value="contact"
                    className="text-[10px] sm:text-xs py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <UserCircle className="w-3.5 h-3.5 sm:mr-1.5 hidden sm:block" />{' '}
                    Contato
                  </TabsTrigger>
                  <TabsTrigger
                    value="location"
                    className="text-[10px] sm:text-xs py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <MapPin className="w-3.5 h-3.5 sm:mr-1.5 hidden sm:block" />{' '}
                    Local
                  </TabsTrigger>
                  <TabsTrigger
                    value="fleet"
                    className="text-[10px] sm:text-xs py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Truck className="w-3.5 h-3.5 sm:mr-1.5 hidden sm:block" />{' '}
                    Frota
                  </TabsTrigger>
                  <TabsTrigger
                    value="commercial"
                    className="text-[10px] sm:text-xs py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <TrendingUp className="w-3.5 h-3.5 sm:mr-1.5 hidden sm:block" />{' '}
                    Comercial
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="company"
                  className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Nome da Empresa *
                      </label>
                      <Input
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        CNPJ
                      </label>
                      <Input
                        name="cnpj"
                        value={formData.cnpj || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Segmento
                      </label>
                      <Input
                        name="segment"
                        value={formData.segment || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Site
                      </label>
                      <Input
                        name="website"
                        value={formData.website || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Origem
                      </label>
                      <Input
                        name="source"
                        value={formData.source || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Status
                      </label>
                      <Select
                        value={formData.status || 'Novo Lead'}
                        onValueChange={(v) => handleSelect('status', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Novo Lead">Novo Lead</SelectItem>
                          <SelectItem value="Em prospecção">
                            Em prospecção
                          </SelectItem>
                          <SelectItem value="Qualificado">
                            Qualificado
                          </SelectItem>
                          <SelectItem value="Desqualificado">
                            Desqualificado
                          </SelectItem>
                          <SelectItem value="Ganho">Ganho (Cliente)</SelectItem>
                          <SelectItem value="Perdido">Perdido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Etapa do Pipeline
                      </label>
                      <Select
                        value={formData.pipelineStage || 'Prospecção'}
                        onValueChange={(v) => handleSelect('pipelineStage', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
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
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Observações
                      </label>
                      <Textarea
                        name="notes"
                        value={formData.notes || ''}
                        onChange={handleChange}
                        className="h-20 resize-none"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="contact"
                  className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Nome do Contato
                      </label>
                      <Input
                        name="contactName"
                        value={formData.contactName || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Cargo
                      </label>
                      <Input
                        name="contactRole"
                        value={formData.contactRole || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Telefone
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        WhatsApp
                      </label>
                      <Input
                        name="whatsapp"
                        value={formData.whatsapp || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        E-mail
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="location"
                  className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Endereço
                      </label>
                      <Input
                        name="address"
                        value={formData.address || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Número
                      </label>
                      <Input
                        name="number"
                        value={formData.number || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Bairro
                      </label>
                      <Input
                        name="district"
                        value={formData.district || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Cidade
                      </label>
                      <Input
                        name="city"
                        value={formData.city || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Estado
                      </label>
                      <Input
                        name="state"
                        value={formData.state || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        CEP
                      </label>
                      <Input
                        name="zip_code"
                        value={formData.zip_code || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="fleet"
                  className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Qtd. Veículos
                      </label>
                      <Input
                        type="number"
                        name="vehicleCount"
                        value={formData.vehicleCount || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Modelo/Tipo da Frota
                      </label>
                      <Input
                        name="fleetModel"
                        value={formData.fleetModel || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Observações da Frota
                      </label>
                      <Textarea
                        name="fleet_notes"
                        value={formData.fleet_notes || ''}
                        onChange={handleChange}
                        className="h-20 resize-none"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="commercial"
                  className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Solução de Interesse
                      </label>
                      <Input
                        name="solutionInterest"
                        value={formData.solutionInterest || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Temperatura
                      </label>
                      <Select
                        value={formData.leadTemperature || ''}
                        onValueChange={(v) =>
                          handleSelect('leadTemperature', v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Frio">Frio</SelectItem>
                          <SelectItem value="Morno">Morno</SelectItem>
                          <SelectItem value="Quente">Quente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Potencial
                      </label>
                      <Select
                        value={formData.accountPotential || ''}
                        onValueChange={(v) =>
                          handleSelect('accountPotential', v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Baixo">Baixo</SelectItem>
                          <SelectItem value="Médio">Médio</SelectItem>
                          <SelectItem value="Alto">Alto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Responsável
                      </label>
                      <Select
                        value={formData.user_id || 'none'}
                        onValueChange={(v) => handleSelect('user_id', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sem responsável</SelectItem>
                          {profiles.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.nome || p.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2 mt-2 pt-4 border-t border-slate-100">
                      <h4 className="font-bold text-slate-900 mb-1">
                        Próxima Ação
                      </h4>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Ação
                      </label>
                      <Input
                        name="nextAction"
                        value={formData.nextAction || ''}
                        onChange={handleChange}
                        placeholder="Ex: Ligar para confirmar proposta"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Data
                      </label>
                      <Input
                        type="date"
                        name="nextActionDate"
                        value={
                          formData.nextActionDate
                            ? formData.nextActionDate.split('T')[0]
                            : ''
                        }
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Horário
                      </label>
                      <Input
                        type="time"
                        name="nextActionTime"
                        value={formData.nextActionTime || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Notas da Ação
                      </label>
                      <Textarea
                        name="nextActionNotes"
                        value={formData.nextActionNotes || ''}
                        onChange={handleChange}
                        className="h-16 resize-none"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
