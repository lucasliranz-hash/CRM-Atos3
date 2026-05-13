import React, { useState, useEffect } from 'react'
import { Account, ActivityChannel, ActivityType } from '@/types/crm'
import useMainStore from '@/stores/main'
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
import { Check } from 'lucide-react'

interface Props {
  account: Account
  onSuccess: () => void
  defaultChannel?: ActivityChannel
  defaultType?: ActivityType
}

export default function LeadInteractionForm({
  account,
  onSuccess,
  defaultChannel = 'WhatsApp',
  defaultType = 'Mensagem',
}: Props) {
  const { addActivity, updateAccount } = useMainStore()
  const { toast } = useToast()

  const [channel, setChannel] = useState<ActivityChannel>(defaultChannel)
  const [type, setType] = useState<ActivityType>(defaultType)
  const [result, setResult] = useState('')

  const [scheduleNext, setScheduleNext] = useState(true)
  const [nextAction, setNextAction] = useState('')
  const [nextActionDate, setNextActionDate] = useState<string>(
    new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16),
  )

  const [pipelineStage, setPipelineStage] = useState(account.pipelineStage)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (type === 'Proposta enviada') setPipelineStage('Proposta enviada')
    else if (type === 'Reunião agendada') setPipelineStage('Reunião agendada')
    else if (type === 'Mensagem' && account.pipelineStage === 'Prospecção')
      setPipelineStage('Contato realizado')
  }, [type, account.pipelineStage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await addActivity({
        accountId: account.id,
        date: new Date().toISOString(),
        channel,
        type,
        result: result as any,
        completed: true,
        ...(scheduleNext && nextAction
          ? {
              nextAction,
              nextActionDate: new Date(nextActionDate).toISOString(),
            }
          : {}),
      } as any)

      if (pipelineStage !== account.pipelineStage) {
        await updateAccount(account.id, {
          pipelineStage,
          status:
            pipelineStage === 'Perdido'
              ? 'Perdido'
              : pipelineStage === 'Fechado'
                ? 'Fechado'
                : 'Em andamento',
        })
      }

      toast({ title: 'Ação registrada com sucesso!' })
      onSuccess()
    } catch (error) {
      toast({ title: 'Erro ao salvar', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 p-6 animate-in fade-in duration-300"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Canal</label>
          <Select value={channel} onValueChange={(v: any) => setChannel(v)}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              <SelectItem value="Telefone">Telefone</SelectItem>
              <SelectItem value="E-mail">E-mail</SelectItem>
              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
              <SelectItem value="Presencial">Presencial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">
            Tipo de Ação
          </label>
          <Select value={type} onValueChange={(v: any) => setType(v)}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mensagem">Mensagem</SelectItem>
              <SelectItem value="Ligação">Ligação</SelectItem>
              <SelectItem value="E-mail">E-mail</SelectItem>
              <SelectItem value="Reunião agendada">Reunião agendada</SelectItem>
              <SelectItem value="Reunião realizada">
                Reunião realizada
              </SelectItem>
              <SelectItem value="Proposta enviada">Proposta enviada</SelectItem>
              <SelectItem value="Negociação">Negociação</SelectItem>
              <SelectItem value="Pós-venda">Pós-venda</SelectItem>
              <SelectItem value="Follow-up">Follow-up</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700">
          Resumo / Notas da interação *
        </label>
        <Textarea
          required
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="Ex: Cliente pediu retorno amanhã para aprovar proposta..."
          className="bg-white resize-none h-20"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700">
          Mover no Pipeline para (Opcional)
        </label>
        <Select value={pipelineStage} onValueChange={setPipelineStage}>
          <SelectTrigger className="bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Prospecção">Prospecção</SelectItem>
            <SelectItem value="Contato realizado">Contato realizado</SelectItem>
            <SelectItem value="Reunião agendada">Reunião agendada</SelectItem>
            <SelectItem value="Proposta enviada">Proposta enviada</SelectItem>
            <SelectItem value="Negociação">Negociação</SelectItem>
            <SelectItem value="Fechado">Fechado</SelectItem>
            <SelectItem value="Perdido">Perdido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-bold text-slate-900">
              Agendar Próxima Ação
            </label>
            <p className="text-xs text-slate-500 font-medium">
              Sempre saia com um follow-up agendado.
            </p>
          </div>
          <Switch checked={scheduleNext} onCheckedChange={setScheduleNext} />
        </div>

        {scheduleNext && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  O que fazer? *
                </label>
                <Input
                  required
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  placeholder="Ex: Ligar para confirmar recebimento"
                  className="bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Quando (Data/Hora)? *
                </label>
                <Input
                  type="datetime-local"
                  required
                  value={nextActionDate}
                  onChange={(e) => setNextActionDate(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={
          isSubmitting || (scheduleNext && (!nextAction || !nextActionDate))
        }
        className="w-full font-bold bg-[#FF6A00] hover:bg-[#e65c00] text-white shadow-sm mt-4"
      >
        {isSubmitting ? (
          'Salvando...'
        ) : (
          <>
            <Check className="w-4 h-4 mr-2" /> Salvar Interação e Atualizar Lead
          </>
        )}
      </Button>
    </form>
  )
}
