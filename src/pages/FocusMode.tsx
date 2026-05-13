import { useMemo, useState } from 'react'
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { FocusModals } from '@/components/FocusModals'

export default function FocusMode() {
  const { accounts, activities, proposals, completeActivity, addActivity } =
    useMainStore()
  const { toast } = useToast()
  const [modalState, setModalState] = useState<{
    type: 'call' | 'email' | 'resolve' | 'whatsapp'
    task: any
    account: any
  } | null>(null)

  const focusTasks = useMemo(() => {
    const t: any[] = []

    activities.forEach((act) => {
      if (!act.completed && (isToday(act.date) || isOverdue(act.date))) {
        const acc = accounts.find((a) => a.id === act.accountId)
        if (acc) {
          t.push({
            id: `act-${act.id}`,
            text: `${act.type} - ${act.title || act.result || ''}`,
            date: act.date,
            name: acc.companyName || acc.name,
            accountId: act.accountId,
            type: 'activity',
            item: act,
            account: acc,
          })
        }
      }
    })

    accounts.forEach((a) => {
      if (
        !a.nextActionDate &&
        !['Fechado', 'Perdido'].includes(a.pipelineStage)
      ) {
        if (!t.find((task) => task.accountId === a.id)) {
          t.push({
            id: `acc-nofollow-${a.id}`,
            text: 'Nenhuma próxima ação agendada',
            date: new Date().toISOString(),
            name: a.companyName || a.name,
            accountId: a.id,
            type: 'account_no_action',
            item: a,
            account: a,
          })
        }
      } else if (a.nextAction && a.nextActionDate) {
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
              name: a.companyName || a.name,
              accountId: a.id,
              type: 'account',
              item: a,
              account: a,
            })
          }
        }
      }

      const leadProposals = proposals.filter(
        (p) => p.accountId === a.id && p.status === 'Rascunho',
      )
      if (leadProposals.length > 0) {
        if (
          !t.find(
            (task) => task.accountId === a.id && task.type === 'draft_proposal',
          )
        ) {
          t.push({
            id: `acc-draft-${a.id}`,
            text: `Você tem ${leadProposals.length} proposta(s) em rascunho para finalizar.`,
            date: new Date().toISOString(),
            name: a.companyName || a.name,
            accountId: a.id,
            type: 'draft_proposal',
            item: a,
            account: a,
          })
        }
      }

      const lastUpdate = new Date(a.updatedAt || a.createdAt).getTime()
      const daysStuck = (new Date().getTime() - lastUpdate) / (1000 * 3600 * 24)
      if (
        daysStuck > 7 &&
        !['Fechado', 'Perdido'].includes(a.pipelineStage) &&
        leadProposals.length === 0
      ) {
        if (!t.find((task) => task.accountId === a.id)) {
          t.push({
            id: `acc-stuck-${a.id}`,
            text: `Estagnado há ${Math.floor(daysStuck)} dias na fase ${a.pipelineStage}`,
            date: new Date().toISOString(),
            name: a.companyName || a.name,
            accountId: a.id,
            type: 'account_stuck',
            item: a,
            account: a,
          })
        }
      }
    })
    return t.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
  }, [activities, accounts, proposals])

  const handleWhatsApp = (task: any, account: any) => {
    if (!account.phone)
      return toast({ title: 'Telefone não cadastrado', variant: 'destructive' })
    setModalState({ type: 'whatsapp', task, account })
  }

  const handleCall = (task: any, account: any) => {
    if (!account.phone)
      return toast({ title: 'Telefone não cadastrado', variant: 'destructive' })
    window.open(`tel:${account.phone.replace(/\D/g, '')}`, '_self')
    setModalState({ type: 'call', task, account })
  }

  const handleEmail = (task: any, account: any) => {
    if (!account.email)
      return toast({ title: 'E-mail não cadastrado', variant: 'destructive' })
    setModalState({ type: 'email', task, account })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 animate-in fade-in duration-500">
      <FocusModals
        modalState={modalState}
        onClose={() => setModalState(null)}
      />

      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4">
          <Target className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Focus Mode
        </h1>
        <p className="text-slate-500 mt-2 font-medium max-w-lg">
          Zero distrações. Apenas os leads que precisam da sua atenção hoje,
          estão atrasados ou estagnados.
        </p>
      </div>

      {focusTasks.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4" />
            <h2 className="text-xl font-bold text-slate-700">Tudo limpo!</h2>
            <p className="text-slate-500">
              Você não tem ações pendentes na sua fila de foco.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {focusTasks.map((task) => {
            const overdue = isOverdue(task.date) || task.type.includes('stuck')
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
                            <AlertCircle className="w-3 h-3 mr-1" /> Requer
                            Atenção
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-block">
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={!task.account.phone}
                              onClick={() => handleWhatsApp(task, task.account)}
                              className="w-10 h-10 rounded-full text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 disabled:opacity-50"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </TooltipTrigger>
                        {!task.account.phone && (
                          <TooltipContent>
                            Telefone não cadastrado
                          </TooltipContent>
                        )}
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-block">
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={!task.account.phone}
                              onClick={() => handleCall(task, task.account)}
                              className="w-10 h-10 rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 disabled:opacity-50"
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                          </div>
                        </TooltipTrigger>
                        {!task.account.phone && (
                          <TooltipContent>
                            Telefone não cadastrado
                          </TooltipContent>
                        )}
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-block">
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={!task.account.email}
                              onClick={() => handleEmail(task, task.account)}
                              className="w-10 h-10 rounded-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200 disabled:opacity-50"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          </div>
                        </TooltipTrigger>
                        {!task.account.email && (
                          <TooltipContent>E-mail não cadastrado</TooltipContent>
                        )}
                      </Tooltip>

                      <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />

                      <Button
                        onClick={() =>
                          setModalState({
                            type: 'resolve',
                            task,
                            account: task.account,
                          })
                        }
                        className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full px-6"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Resolver
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
