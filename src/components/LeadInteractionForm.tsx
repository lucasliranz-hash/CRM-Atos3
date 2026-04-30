import React, { useState } from 'react'
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
}

export default function LeadInteractionForm({ account, onSuccess }: Props) {
  const { addActivity } = useMainStore()
  const { toast } = useToast()

  const [channel, setChannel] = useState<ActivityChannel>('WhatsApp')
  const [type, setType] = useState<ActivityType>('Mensagem')
  const [result, setResult] = useState('')

  const [scheduleNext, setScheduleNext] = useState(true)
  const [nextAction, setNextAction] = useState('')
  const [nextActionDate, setNextActionDate] = useState<string>(
    new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16),
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      className="space-y-5 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300 bg-slate-50/50 h-full"
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
              <SelectItem value="Reunião realizada">
                Reunião realizada
              </SelectItem>
              <SelectItem value="Diagnóstico">Diagnóstico</SelectItem>
              <SelectItem value="Proposta enviada">Proposta enviada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700">
          Resumo / Notas da interação
        </label>
        <Textarea
          required
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="Descreva como foi a interação com o lead..."
          className="bg-white resize-none h-24"
        />
      </div>

      <div className="border border-orange-200 rounded-xl p-4 bg-orange-50/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-bold text-slate-900">
              Próxima ação (Obrigatório)
            </label>
            <p className="text-xs text-slate-500 font-medium">
              Sempre saia com um follow-up agendado.
            </p>
          </div>
          <Switch checked={scheduleNext} onCheckedChange={() => {}} disabled />
        </div>

        {scheduleNext && (
          <div className="space-y-4 pt-4 border-t border-orange-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  O que fazer? *
                </label>
                <Input
                  required
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  placeholder="Ex: Reunião de apresentação"
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
        disabled={isSubmitting || !nextAction || !nextActionDate}
        className="w-full font-bold bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 mt-4"
      >
        {isSubmitting ? (
          'Salvando...'
        ) : (
          <>
            <Check className="w-4 h-4 mr-2" /> Salvar Interação
          </>
        )}
      </Button>
    </form>
  )
}
