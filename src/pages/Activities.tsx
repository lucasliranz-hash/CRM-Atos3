import React from 'react'
import useMainStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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
    <div className="space-y-8 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Atividades & Tarefas
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Gerencie suas próximas ações e acompanhe seus leads diários.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="font-black text-sm uppercase tracking-wider text-red-600 flex items-center">
            Atrasados
            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              {overdue.length}
            </span>
          </h3>
          {overdue.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-xl bg-red-50/50 border border-red-100 shadow-sm group"
            >
              <div className="font-bold text-sm text-slate-900 mb-1">
                {task.name}
              </div>
              <p className="text-xs font-medium text-slate-600 mb-3">
                {task.text}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 bg-red-100 text-red-700">
                  <CalendarIcon className="w-3 h-3" />
                  {new Date(task.date).toLocaleDateString('pt-BR')}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px] font-bold border-slate-200"
                  >
                    Reagendar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleCompleteTask(task)}
                    className="h-7 text-[10px] font-bold bg-emerald-500 text-white hover:bg-emerald-600 border-none"
                  >
                    Concluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {overdue.length === 0 && (
            <div className="text-xs font-medium text-slate-400 p-4 border border-dashed rounded-xl text-center">
              Nenhum atraso.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-sm uppercase tracking-wider text-orange-600 flex items-center">
            Hoje
            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
              {today.length}
            </span>
          </h3>
          {today.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-xl bg-orange-50/30 border border-orange-100 shadow-sm group"
            >
              <div className="font-bold text-sm text-slate-900 mb-1">
                {task.name}
              </div>
              <p className="text-xs font-medium text-slate-600 mb-3">
                {task.text}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 bg-orange-100 text-orange-700">
                  <CalendarIcon className="w-3 h-3" />
                  {new Date(task.date).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px] font-bold border-slate-200"
                  >
                    Reagendar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleCompleteTask(task)}
                    className="h-7 text-[10px] font-bold bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
                  >
                    Concluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {today.length === 0 && (
            <div className="text-xs font-medium text-slate-400 p-4 border border-dashed rounded-xl text-center">
              Nenhuma ação para hoje.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-sm uppercase tracking-wider text-slate-600 flex items-center">
            Próximos
            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {upcoming.length}
            </span>
          </h3>
          {upcoming.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm group"
            >
              <div className="font-bold text-sm text-slate-900 mb-1">
                {task.name}
              </div>
              <p className="text-xs font-medium text-slate-600 mb-3">
                {task.text}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 bg-slate-100 text-slate-600">
                  <CalendarIcon className="w-3 h-3" />
                  {new Date(task.date).toLocaleDateString('pt-BR')}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px] font-bold border-slate-200"
                  >
                    Reagendar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleCompleteTask(task)}
                    className="h-7 text-[10px] font-bold bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm border-none"
                  >
                    Concluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {upcoming.length === 0 && (
            <div className="text-xs font-medium text-slate-400 p-4 border border-dashed rounded-xl text-center">
              Nenhuma ação futura.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
