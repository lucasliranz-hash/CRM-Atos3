import { useState } from 'react'
import useMainStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  CheckCircle2,
  Plus,
  Calendar as CalendarIcon,
  Video,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

export default function Activities() {
  const { activities, accounts, addActivity, completeActivity } = useMainStore()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedType, setSelectedType] = useState('Ligação')
  const [createMeet, setCreateMeet] = useState(true)

  const handleCreate = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)
    const fd = new FormData(e.target)

    let meetLink = ''
    let googleEventId = ''

    if (createMeet && selectedType === 'Reunião agendada') {
      try {
        const { data, error } = await supabase.functions.invoke(
          'google-calendar',
          {
            body: {
              action: 'createEvent',
              payload: {
                title: `Reunião - ${accounts.find((a) => a.id === fd.get('accountId'))?.name}`,
                date: fd.get('date') as string,
              },
            },
          },
        )
        if (data?.success) {
          meetLink = data.meetLink
          googleEventId = data.eventId
          toast({ title: 'Evento criado no Google Agenda!' })
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

    addActivity({
      accountId: fd.get('accountId') as string,
      type: selectedType as any,
      channel: fd.get('channel') as any,
      result: fd.get('result') as any,
      date: (fd.get('date') as string) || new Date().toISOString(),
      completed: selectedType !== 'Reunião agendada',
      nextAction: fd.get('nextAction') as string,
      nextActionDate: fd.get('nextActionDate') as string,
      google_event_id: googleEventId,
      meet_link: meetLink,
    } as any)

    setIsOpen(false)
    setIsSubmitting(false)
    toast({
      title: 'Atividade registrada!',
      description: 'Ação salva com sucesso.',
    })
  }

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-black">Log de Atividades</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Registros de touchpoints e follow-ups
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 text-white rounded font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20">
              <Plus className="w-4 h-4 mr-2" /> Registrar Atividade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Atividade</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Conta Relacionada *
                </label>
                <select
                  name="accountId"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-black"
                >
                  <option value="">Selecione...</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Tipo *
                  </label>
                  <select
                    name="type"
                    required
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-black"
                  >
                    <option value="Ligação">Ligação</option>
                    <option value="E-mail">E-mail</option>
                    <option value="Mensagem">Mensagem</option>
                    <option value="Reunião agendada">Reunião agendada</option>
                    <option value="Reunião realizada">Reunião realizada</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Canal *
                  </label>
                  <select
                    name="channel"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-black"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Telefone">Telefone</option>
                    <option value="E-mail">E-mail</option>
                    <option value="Presencial">Presencial</option>
                  </select>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-gray-700">
                    Data e Hora *
                  </label>
                  <Input
                    name="date"
                    type="datetime-local"
                    required
                    defaultValue={new Date().toISOString().slice(0, 16)}
                    className="bg-white"
                  />
                </div>

                {selectedType === 'Reunião agendada' && (
                  <div className="col-span-2 flex items-center justify-between bg-blue-50/50 p-3 rounded-lg border border-blue-100 mt-2">
                    <div className="space-y-0.5">
                      <label className="text-sm font-bold text-blue-900">
                        Google Meet
                      </label>
                      <p className="text-xs text-blue-700/80 font-medium">
                        Criar evento na agenda com link da reunião
                      </p>
                    </div>
                    <Switch
                      checked={createMeet}
                      onCheckedChange={setCreateMeet}
                    />
                  </div>
                )}

                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-gray-700">
                    Resultado Alcançado
                  </label>
                  <select
                    name="result"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-black"
                  >
                    <option value="">Selecione...</option>
                    <option value="Sem resposta">Sem resposta</option>
                    <option value="Respondeu">Respondeu</option>
                    <option value="Agendou reunião">Agendou reunião</option>
                    <option value="Não interessado">Não interessado</option>
                    <option value="Pediu retorno">Pediu retorno</option>
                  </select>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 mt-6 space-y-4">
                <h4 className="font-black text-sm text-black">
                  Passo Seguinte
                </h4>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Ação Seguinte
                  </label>
                  <Input
                    name="nextAction"
                    placeholder="Ex: Ligar novamente para validar proposta"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Data Limite
                  </label>
                  <Input
                    name="nextActionDate"
                    type="date"
                    className="bg-white"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 text-white font-bold mt-4 hover:bg-orange-600"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Salvar Atividade
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-bold text-black">Data/Hora</TableHead>
              <TableHead className="font-bold text-black">Detalhes</TableHead>
              <TableHead className="font-bold text-black">Resultado</TableHead>
              <TableHead className="font-bold text-black text-right">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedActivities.map((act) => {
              const acc = accounts.find((a) => a.id === act.accountId)
              const dt = new Date(act.date)
              return (
                <TableRow key={act.id} className="hover:bg-gray-50/50">
                  <TableCell className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-1">
                      <span className="flex items-center">
                        <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        {dt.toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500 font-medium pl-5">
                        {dt.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-black">{acc?.name}</div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">
                      {act.type} via {act.channel}
                    </div>
                    {act.meet_link && (
                      <a
                        href={act.meet_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center mt-2 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50/80 px-2 py-1.5 rounded border border-blue-100 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5 mr-1.5" /> Entrar no Meet
                      </a>
                    )}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-gray-700">
                    {act.result || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {act.completed ? (
                      <span className="text-green-600 text-xs font-bold inline-flex items-center justify-end">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Feito
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => completeActivity(act.id)}
                        className="h-7 text-xs font-bold rounded text-black border-gray-300"
                      >
                        Concluir
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
