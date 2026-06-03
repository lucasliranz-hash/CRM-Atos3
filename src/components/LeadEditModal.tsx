import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import useMainStore from '@/stores/main'

export function LeadEditModal({
  open,
  onOpenChange,
  accountId,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  accountId: string
  onSuccess: () => void
}) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<any>({})
  const [originalData, setOriginalData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profiles, setProfiles] = useState<any[]>([])

  const updateAccount = useMainStore((s: any) => s.updateAccount)
  const fetchData = useMainStore((s: any) => s.fetchData)

  useEffect(() => {
    if (open && accountId) {
      loadData()
    }
  }, [open, accountId])

  const loadData = async () => {
    setLoading(true)
    try {
      const [accRes, profRes] = await Promise.all([
        supabase.from('accounts').select('*').eq('id', accountId).single(),
        supabase.from('profiles').select('id, nome'),
      ])

      if (accRes.error) throw accRes.error
      setOriginalData(accRes.data)
      setFormData(accRes.data)

      if (profRes.data) {
        setProfiles(profRes.data)
      }
    } catch (e: any) {
      toast({
        title: 'Erro ao carregar dados',
        description: e.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates: any = {}
      for (const key in formData) {
        if (formData[key] !== originalData[key]) {
          updates[key] = formData[key]
        }
      }

      if (Object.keys(updates).length > 0) {
        await updateAccount(accountId, updates)
        await fetchData()
      }

      toast({ title: 'Lead atualizado com sucesso!' })
      onSuccess()
      onOpenChange(false)
    } catch (e: any) {
      toast({
        title: 'Erro ao salvar',
        description: e.message,
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] border-none shadow-2xl">
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">
              Carregando dados do lead...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 bg-white border-slate-200 shadow-2xl rounded-xl custom-scrollbar">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-20">
          <DialogTitle className="text-xl font-black text-slate-900">
            Editar Lead Completo
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-10">
          {/* DADOS DA EMPRESA */}
          <section>
            <h3 className="text-xs font-black text-slate-400 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider">
              Dados da Empresa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Nome da Empresa
                </label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">CNPJ</label>
                <Input
                  value={formData.cnpj || ''}
                  onChange={(e) => handleChange('cnpj', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Segmento
                </label>
                <Input
                  value={formData.segment || ''}
                  onChange={(e) => handleChange('segment', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Site</label>
                <Input
                  value={formData.website || ''}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Origem do Lead
                </label>
                <Input
                  value={formData.leadSource || ''}
                  onChange={(e) => handleChange('leadSource', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Status
                </label>
                <Input
                  value={formData.status || ''}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Etapa do Pipeline
                </label>
                <Input
                  value={formData.pipelineStage || ''}
                  onChange={(e) =>
                    handleChange('pipelineStage', e.target.value)
                  }
                  className="h-9 shadow-sm"
                />
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Observações da Empresa
              </label>
              <Textarea
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="min-h-[80px] shadow-sm resize-y"
              />
            </div>
          </section>

          {/* DADOS DO CONTATO */}
          <section>
            <h3 className="text-xs font-black text-slate-400 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider">
              Dados do Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Nome do Contato
                </label>
                <Input
                  value={formData.contactName || ''}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Cargo
                </label>
                <Input
                  value={formData.contactRole || ''}
                  onChange={(e) => handleChange('contactRole', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Telefone
                </label>
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  WhatsApp
                </label>
                <Input
                  value={formData.whatsapp || ''}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  E-mail
                </label>
                <Input
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
            </div>
          </section>

          {/* LOCALIZAÇÃO */}
          <section>
            <h3 className="text-xs font-black text-slate-400 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider">
              Localização
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Endereço
                </label>
                <Input
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Número
                </label>
                <Input
                  value={formData.number || ''}
                  onChange={(e) => handleChange('number', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Bairro
                </label>
                <Input
                  value={formData.district || ''}
                  onChange={(e) => handleChange('district', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Cidade
                </label>
                <Input
                  value={formData.city || ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Estado (UF)
                </label>
                <Input
                  value={formData.state || ''}
                  onChange={(e) => handleChange('state', e.target.value)}
                  maxLength={2}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">CEP</label>
                <Input
                  value={formData.zip_code || ''}
                  onChange={(e) => handleChange('zip_code', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
            </div>
          </section>

          {/* FROTA */}
          <section>
            <h3 className="text-xs font-black text-slate-400 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider">
              Frota
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Quantidade de Veículos
                </label>
                <Input
                  type="number"
                  value={formData.vehicleCount || ''}
                  onChange={(e) =>
                    handleChange('vehicleCount', parseInt(e.target.value) || 0)
                  }
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Tipo/Modelo da Frota
                </label>
                <Input
                  value={formData.fleetModel || ''}
                  onChange={(e) => handleChange('fleetModel', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Observações sobre a Frota
              </label>
              <Textarea
                value={formData.fleet_notes || ''}
                onChange={(e) => handleChange('fleet_notes', e.target.value)}
                className="min-h-[80px] shadow-sm"
              />
            </div>
          </section>

          {/* COMERCIAL */}
          <section>
            <h3 className="text-xs font-black text-slate-400 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider">
              Comercial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Solução de Interesse
                </label>
                <Input
                  value={formData.solutionInterest || ''}
                  onChange={(e) =>
                    handleChange('solutionInterest', e.target.value)
                  }
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Temperatura do Lead
                </label>
                <Select
                  value={formData.leadTemperature || undefined}
                  onValueChange={(v) => handleChange('leadTemperature', v)}
                >
                  <SelectTrigger className="h-9 shadow-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Frio">Frio</SelectItem>
                    <SelectItem value="Morno">Morno</SelectItem>
                    <SelectItem value="Quente">Quente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Potencial do Cliente
                </label>
                <Select
                  value={formData.accountPotential || undefined}
                  onValueChange={(v) => handleChange('accountPotential', v)}
                >
                  <SelectTrigger className="h-9 shadow-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baixo">Baixo</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Alto">Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Responsável
                </label>
                <Select
                  value={formData.user_id || undefined}
                  onValueChange={(v) => handleChange('user_id', v)}
                >
                  <SelectTrigger className="h-9 shadow-sm">
                    <SelectValue placeholder="Selecione um responsável..." />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Próxima Ação
                </label>
                <Input
                  value={formData.nextAction || ''}
                  onChange={(e) => handleChange('nextAction', e.target.value)}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Data da Próxima Ação
                </label>
                <Input
                  type="date"
                  value={
                    formData.nextActionDate
                      ? formData.nextActionDate.split('T')[0]
                      : ''
                  }
                  onChange={(e) => {
                    const dateStr = e.target.value
                    if (dateStr) {
                      const d = new Date(dateStr + 'T12:00:00')
                      handleChange('nextActionDate', d.toISOString())
                    } else {
                      handleChange('nextActionDate', null)
                    }
                  }}
                  className="h-9 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Horário da Próxima Ação
                </label>
                <Input
                  type="time"
                  value={formData.nextActionTime || ''}
                  onChange={(e) =>
                    handleChange('nextActionTime', e.target.value)
                  }
                  className="h-9 shadow-sm"
                />
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Observações da Próxima Ação
              </label>
              <Textarea
                value={formData.nextActionNotes || ''}
                onChange={(e) =>
                  handleChange('nextActionNotes', e.target.value)
                }
                className="min-h-[80px] shadow-sm"
              />
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur z-20">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-bold"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
