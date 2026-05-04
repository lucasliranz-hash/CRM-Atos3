import React from 'react'
import useMainStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function Activities() {
  const { opportunities, accounts, addActivity } = useMainStore()
  const { toast } = useToast()

  const tasks = React.useMemo(() => {
    const t: any[] = []
    opportunities.forEach((o) => {
      if (o.nextAction && o.nextActionDate && !o.stage.includes('Fechado')) {
        const acc = accounts.find((a) => a.id === o.accountId)
        t.push({
          id: `opp-${o.id}`,
          text: o.nextAction,
          date: o.nextActionDate,
          name: acc?.name || o.name,
          accountId: o.accountId,
          item: o,
        })
      }
    })
    accounts.forEach((a) => {
      if (a.nextAction && a.nextActionDate) {
        if (
          !t.find(
            (task) => task.accountId === a.id && task.text === a.nextAction,
          )
        ) {
          t.push({
            id: `acc-${a.id}`,
            text: a.nextAction,
            date: a.nextActionDate,
            name: a.name,
            accountId: a.id,
            item: a,
          })
        }
      }
    })
    return t.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
  }, [opportunities, accounts])

  const overdue = tasks.filter(
    (t) => new Date(t.date).getTime() < new Date().setHours(0, 0, 0, 0),
  )
  const today = tasks.filter(
    (t) => new Date(t.date).toDateString() === new Date().toDateString(),
  )
  const upcoming = tasks.filter(
    (t) => new Date(t.date).getTime() > new Date().setHours(23, 59, 59, 999),
  )

  const { updateAccount, updateOpportunity } = useMainStore()

  const handleCompleteTask = async (task: any) => {
    await addActivity({
      accountId: task.accountId,
      type: 'Mensagem',
      channel: 'WhatsApp',
      date: new Date().toISOString(),
      result: `Concluído: ${task.text}`,
      completed: true,
    } as any)

    await updateAccount(task.accountId, {
      nextAction: null as any,
      nextActionDate: null as any,
    })

    if (task.id.startsWith('opp-')) {
      const oppId = task.id.replace('opp-', '')
      await updateOpportunity(oppId, {
        nextAction: null as any,
        nextActionDate: null as any,
      })
    }

    toast({ title: 'Tarefa concluída!' })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Atividades
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Gerencie suas próximas ações e acompanhe seus leads diários.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[10px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-black text-lg text-red-600 flex items-center mb-4">
            Atrasadas
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              {overdue.length}
            </span>
          </h3>
          <div className="space-y-3">
            {overdue.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                isLate
                onComplete={handleCompleteTask}
              />
            ))}
            {overdue.length === 0 && (
              <p className="text-sm text-slate-500 font-medium">
                Nenhuma atividade atrasada.
              </p>
            )}
          </div>
        </div>

        <div className="p-6 border-b border-slate-100">
          <h3 className="font-black text-lg text-slate-900 flex items-center mb-4">
            Hoje
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {today.length}
            </span>
          </h3>
          <div className="space-y-3">
            {today.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
              />
            ))}
            {today.length === 0 && (
              <p className="text-sm text-slate-500 font-medium">
                Nenhuma atividade para hoje.
              </p>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-black text-lg text-slate-900 flex items-center mb-4">
            Próximas
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {upcoming.length}
            </span>
          </h3>
          <div className="space-y-3">
            {upcoming.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
              />
            ))}
            {upcoming.length === 0 && (
              <p className="text-sm text-slate-500 font-medium">
                Nenhuma atividade futura.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskRow({ task, isLate, onComplete }: any) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-[10px] bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 group">
      <div className="flex items-start gap-4 mb-3 sm:mb-0">
        <div
          className={cn(
            'p-2 rounded-lg shrink-0',
            isLate
              ? 'bg-red-100 text-red-600'
              : 'bg-orange-100 text-orange-600',
          )}
        >
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
            <span className="font-bold text-sm text-slate-900">
              {task.text}
            </span>
            <span className="hidden sm:inline text-xs font-bold text-slate-300">
              •
            </span>
            <span className="text-sm font-medium text-slate-600">
              {task.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
            <span
              className={cn(
                'flex items-center gap-1',
                isLate && 'text-red-600 font-bold',
              )}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              {new Date(task.date).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none font-bold text-slate-600 border-slate-200"
        >
          Reagendar
        </Button>
        <Button
          size="sm"
          onClick={() => onComplete(task)}
          className="flex-1 sm:flex-none font-bold bg-[#FF6A00] hover:bg-[#e65c00] text-white"
        >
          Concluir
        </Button>
      </div>
    </div>
  )
}
