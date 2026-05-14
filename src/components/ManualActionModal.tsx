import React, { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
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
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Check } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  accountId: string
  onSuccess: () => void
}

export function ManualActionModal({
  open,
  onOpenChange,
  accountId,
  onSuccess,
}: Props) {
  const [type, setType] = useState('Ligação')
  const [customType, setCustomType] = useState('')
  const [description, setDescription] = useState('')
  const [result, setResult] = useState('')

  const now = new Date()
  const [actionDate, setActionDate] = useState(now.toISOString().split('T')[0])
  const [actionTime, setActionTime] = useState(now.toTimeString().slice(0, 5))

  const [status, setStatus] = useState('Concluída')

  const [createNext, setCreateNext] = useState(false)
  const [nextActionType, setNextActionType] = useState('')
  const [nextActionDate, setNextActionDate] = useState('')
  const [nextActionTime, setNextActionTime] = useState('')
  const [nextActionNotes, setNextActionNotes] = useState('')

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData?.user?.id

      const dateTime = new Date(`${actionDate}T${actionTime}:00`).toISOString()

      let finalNextActionDate = null
      if (createNext && nextActionDate && nextActionTime) {
        finalNextActionDate = new Date(
          `${nextActionDate}T${nextActionTime}:00`,
        ).toISOString()
      }

      let finalNextAction = nextActionType
      if (createNext && nextActionNotes) {
        finalNextAction = `${nextActionType} - ${nextActionNotes}`
      }

      const activityPayload = {
        accountId,
        type,
        custom_type: type === 'Outro' ? customType : null,
        description,
        result,
        date: dateTime,
        status,
        completed: status === 'Concluída' || status === 'Cancelada',
        nextAction: createNext ? finalNextAction : null,
        nextActionDate: finalNextActionDate,
        user_id: userId,
      }

      const { error } = await supabase
        .from('activities')
        .insert(activityPayload as any)
      if (error) throw error

      if (createNext) {
        await supabase
          .from('accounts')
          .update({
            nextAction: finalNextAction,
            nextActionDate: finalNextActionDate,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', accountId)
      }

      toast({ title: 'Ação registrada com sucesso!' })
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar ação',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-slate-200 rounded-2xl bg-white">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-black text-slate-900">
            Adicionar Ação Manual
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSave}
          className="space-y-5 p-6 pt-2 animate-in fade-in duration-300 max-h-[80vh] overflow-y-auto custom-scrollbar"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                Tipo de Ação *
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ligação">Ligação</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="E-mail">E-mail</SelectItem>
                  <SelectItem value="Reunião">Reunião</SelectItem>
                  <SelectItem value="Proposta">Proposta</SelectItem>
                  <SelectItem value="Visita">Visita</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Negociação">Negociação</SelectItem>
                  <SelectItem value="Suporte">Suporte</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {type === 'Outro' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Nome da ação *
                </label>
                <Input
                  required
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className="bg-white"
                  placeholder="Ex: Envio de brinde"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                Status *
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Atrasada">Atrasada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">
              Descrição da ação
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes do que foi feito ou será feito..."
              className="bg-white resize-none h-16"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Resultado</label>
            <Textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="Ex: Cliente atendeu e pediu retorno amanhã..."
              className="bg-white resize-none h-16"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                Data da ação *
              </label>
              <Input
                type="date"
                required
                value={actionDate}
                onChange={(e) => setActionDate(e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                Horário da ação *
              </label>
              <Input
                type="time"
                required
                value={actionTime}
                onChange={(e) => setActionTime(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4 mt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-bold text-slate-900">
                  Criar próxima ação
                </label>
                <p className="text-xs text-slate-500 font-medium">
                  Agendar o próximo passo com este lead.
                </p>
              </div>
              <Switch checked={createNext} onCheckedChange={setCreateNext} />
            </div>

            {createNext && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Tipo da próxima ação *
                  </label>
                  <Input
                    required
                    value={nextActionType}
                    onChange={(e) => setNextActionType(e.target.value)}
                    placeholder="Ex: Ligar para follow-up"
                    className="bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Data *
                    </label>
                    <Input
                      type="date"
                      required
                      value={nextActionDate}
                      onChange={(e) => setNextActionDate(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Horário *
                    </label>
                    <Input
                      type="time"
                      required
                      value={nextActionTime}
                      onChange={(e) => setNextActionTime(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Observação
                  </label>
                  <Textarea
                    value={nextActionNotes}
                    onChange={(e) => setNextActionNotes(e.target.value)}
                    placeholder="Lembrar de falar sobre..."
                    className="bg-white resize-none h-16"
                  />
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full font-bold bg-[#FF6A00] hover:bg-[#e65c00] text-white shadow-sm mt-4"
          >
            {loading ? (
              'Salvando...'
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" /> Salvar Ação
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
