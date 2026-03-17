import { useState } from 'react'
import useMainStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { CheckCircle2, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Activities() {
  const { activities, accounts, addActivity, completeActivity } = useMainStore()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const handleCreate = (e: any) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    addActivity({
      accountId: fd.get('accountId') as string,
      type: fd.get('type') as any,
      channel: fd.get('channel') as any,
      result: fd.get('result') as any,
      date: new Date().toISOString(),
      completed: true,
      nextAction: fd.get('nextAction') as string,
      nextActionDate: fd.get('nextActionDate') as string,
    })
    setIsOpen(false)
    toast({
      title: 'Atividade registrada!',
      description: 'Ação seguinte agendada na conta.',
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
            <Button className="bg-black text-white rounded font-bold hover:bg-gray-800">
              <Plus className="w-4 h-4 mr-2" /> Registrar Atividade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
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
                    Canal *
                  </label>
                  <select
                    name="channel"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-black"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Telefone">Telefone</option>
                    <option value="E-mail">E-mail</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Presencial">Presencial</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Tipo *
                  </label>
                  <select
                    name="type"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-black"
                  >
                    <option value="Ligação">Ligação</option>
                    <option value="E-mail">E-mail</option>
                    <option value="Mensagem">Mensagem</option>
                    <option value="Convite">Convite</option>
                    <option value="Reunião realizada">Reunião realizada</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
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
                  Passo Seguinte (Obrigatório)
                </h4>
                <p className="text-xs text-gray-500 leading-tight">
                  O sistema exige uma próxima ação para não perder o lead de
                  vista.
                </p>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Ação Seguinte *
                  </label>
                  <Input
                    name="nextAction"
                    required
                    placeholder="Ex: Ligar novamente para validar proposta"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Data Limite *
                  </label>
                  <Input
                    name="nextActionDate"
                    type="date"
                    required
                    className="bg-white"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-black text-white font-bold mt-4"
              >
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
              <TableHead className="font-bold text-black">Data</TableHead>
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
              return (
                <TableRow key={act.id} className="hover:bg-gray-50/50">
                  <TableCell className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                    {new Date(act.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-black">{acc?.name}</div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">
                      {act.type} via {act.channel}
                    </div>
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
