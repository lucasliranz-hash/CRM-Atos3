import { useMemo } from 'react'
import useMainStore from '@/stores/main'
import { isToday, isOverdue } from '@/lib/crm-utils'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Mail,
  Target,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function FocusMode() {
  const {
    accounts,
    opportunities,
    addActivity,
    updateAccount,
    updateOpportunity,
  } = useMainStore()
  const { toast } = useToast()

  const focusTasks = useMemo(() => {
    const t: any[] = []
    opportunities.forEach((o) => {
      if (o.nextAction && o.nextActionDate && !o.stage.includes('Fechado')) {
        const acc = accounts.find((a) => a.id === o.accountId)
        if (isToday(o.nextActionDate) || isOverdue(o.nextActionDate)) {
          t.push({
            id: `opp-${o.id}`,
            text: o.nextAction,
            date: o.nextActionDate,
            name: acc?.name || o.name,
            accountId: o.accountId,
            type: 'opportunity',
            item: o,
          })
        }
      }
    })
    accounts.forEach((a) => {
      if (a.nextAction && a.nextActionDate) {
        if (isToday(a.nextActionDate) || isOverdue(a.nextActionDate)) {
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
              type: 'account',
              item: a,
            })
          }
        }
      }
    })
    return t.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
  }, [opportunities, accounts])

  const handleComplete = async (task: any) => {
    await addActivity({
      accountId: task.accountId,
      type: 'Mensagem',
      channel: 'WhatsApp',
      date: new Date().toISOString(),
      result: `Ação concluída via Focus Mode: ${task.text}`,
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

    toast({ title: 'Ação concluída com sucesso!' })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4">
          <Target className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Focus Mode
        </h1>
        <p className="text-slate-500 mt-2 font-medium max-w-lg">
          Zero distrações. Apenas os leads que precisam da sua atenção hoje ou
          que estão atrasados.
        </p>
      </div>

      {focusTasks.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4" />
            <h2 className="text-xl font-bold text-slate-700">Tudo limpo!</h2>
            <p className="text-slate-500">
              Você não tem ações pendentes para hoje.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {focusTasks.map((task) => {
            const overdue = isOverdue(task.date)
            return (
              <Card
                key={task.id}
                className={`overflow-hidden transition-all hover:shadow-md ${overdue ? 'border-red-200 shadow-sm shadow-red-100' : 'border-slate-200'}`}
              >
                <div className="flex flex-col sm:flex-row">
                  <div
                    className={`w-2 ${overdue ? 'bg-red-500' : 'bg-orange-500'}`}
                  />
                  <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900">
                          {task.name}
                        </h3>
                        {overdue && (
                          <span className="flex items-center text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                            <AlertCircle className="w-3 h-3 mr-1" /> Atrasado
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 font-medium">{task.text}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs font-bold text-slate-400">
                        <span className="flex items-center text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {new Date(task.date).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 rounded-full text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 rounded-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />
                      <Button
                        onClick={() => handleComplete(task)}
                        className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full px-6"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Concluir
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
