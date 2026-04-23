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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'

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

  const [scheduleNext, setScheduleNext] = useState(false)
  const [nextAction, setNextAction] = useState('')
  const [nextActionDate, setNextActionDate] = useState<Date | undefined>(
    new Date(),
  )
  const [createMeet, setCreateMeet] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    let meetLink = ''
    let googleEventId = ''

    if (scheduleNext && createMeet && nextAction) {
      try {
        const { data, error } = await supabase.functions.invoke(
          'google-calendar',
          {
            body: {
              action: 'createEvent',
              payload: {
                title: `${nextAction} - ${account.name}`,
                date: nextActionDate?.toISOString() || new Date().toISOString(),
              },
            },
          },
        )
        if (data?.success) {
          meetLink = data.meetLink
          googleEventId = data.eventId
          toast({ title: 'Google Meet gerado com sucesso!' })
        } else {
          toast({
            title: 'Aviso Google Agenda',
            description: error?.message || data?.error,
            variant: 'destructive',
          })
        }
      } catch (err) {
        console.error(err)
      }
    }

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
              nextActionDate: nextActionDate?.toISOString(),
            }
          : {}),
        google_event_id: googleEventId,
        meet_link: meetLink,
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
      className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300"
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

      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label
              className="text-sm font-bold text-gray-900 cursor-pointer"
              onClick={() => setScheduleNext(!scheduleNext)}
            >
              Agendar próxima ação?
            </label>
            <p className="text-xs text-gray-500 font-medium">
              Defina um follow-up para este lead.
            </p>
          </div>
          <Switch checked={scheduleNext} onCheckedChange={setScheduleNext} />
        </div>

        {scheduleNext && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
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
                  Quando? *
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-medium bg-white',
                        !nextActionDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {nextActionDate
                        ? format(nextActionDate, 'dd/MM/yyyy', { locale: ptBR })
                        : 'Selecionar data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={nextActionDate}
                      onSelect={setNextActionDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex items-center justify-between bg-blue-50/50 p-3 rounded-lg border border-blue-100">
              <div className="space-y-0.5">
                <label className="text-sm font-bold text-blue-900">
                  Gerar link do Google Meet
                </label>
                <p className="text-xs text-blue-700/80 font-medium">
                  Cria o evento na agenda e anexa o link.
                </p>
              </div>
              <Switch checked={createMeet} onCheckedChange={setCreateMeet} />
            </div>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full font-bold bg-black text-white hover:bg-gray-800"
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
