import { useMemo } from 'react'
import useMainStore from '@/stores/main'
import { isOverdue, isToday, formatCurrency } from '@/lib/crm-utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Clock,
  Building2,
  TrendingUp,
  Target,
  Phone,
  Calendar,
  Briefcase,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

const getVariance = (items: any[], dateField = 'createdAt') => {
  const now = new Date()
  const thisWeekStart = new Date(now)
  thisWeekStart.setDate(thisWeekStart.getDate() - 7)
  const lastWeekStart = new Date(thisWeekStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)

  const thisWeek = items.filter(
    (i: any) => new Date(i[dateField]) >= thisWeekStart,
  ).length
  const lastWeek = items.filter((i: any) => {
    const d = new Date(i[dateField])
    return d >= lastWeekStart && d < thisWeekStart
  }).length

  const diff = thisWeek - lastWeek
  return diff >= 0 ? `+${diff}` : `${diff}`
}

export default function Index() {
  const { activities, accounts, opportunities } = useMainStore()
  const { profile } = useAuth()

  // Top Metrics
  const closedWonTotal = useMemo(
    () =>
      opportunities
        .filter((o) => o.stage === 'Fechado Ganho')
        .reduce((s, o) => s + o.total, 0),
    [opportunities],
  )

  const mappedLeads = useMemo(() => accounts.length, [accounts])
  const mappedLeadsVar = useMemo(() => getVariance(accounts), [accounts])

  const contactsMade = useMemo(
    () =>
      activities.filter(
        (a) =>
          a.completed &&
          ['Ligação', 'Mensagem', 'E-mail', 'Follow-up'].includes(a.type),
      ).length,
    [activities],
  )
  const contactsMadeVar = useMemo(
    () =>
      getVariance(
        activities.filter(
          (a) =>
            a.completed &&
            ['Ligação', 'Mensagem', 'E-mail', 'Follow-up'].includes(a.type),
        ),
        'date',
      ),
    [activities],
  )

  const meetingsScheduled = useMemo(
    () => activities.filter((a) => a.type === 'Reunião agendada').length,
    [activities],
  )
  const meetingsScheduledVar = useMemo(
    () =>
      getVariance(
        activities.filter((a) => a.type === 'Reunião agendada'),
        'date',
      ),
    [activities],
  )

  const proposalsSent = useMemo(
    () => opportunities.filter((o) => o.stage === 'Proposta').length,
    [opportunities],
  )
  const proposalsSentVar = useMemo(
    () => getVariance(opportunities.filter((o) => o.stage === 'Proposta')),
    [opportunities],
  )

  const salesClosed = useMemo(
    () => opportunities.filter((o) => o.stage === 'Fechado Ganho').length,
    [opportunities],
  )
  const salesClosedVar = useMemo(
    () => getVariance(opportunities.filter((o) => o.stage === 'Fechado Ganho')),
    [opportunities],
  )

  // Tasks Dashboard System
  const tasks = useMemo(() => {
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
            (task) =>
              task.text === a.nextAction &&
              task.date === a.nextActionDate &&
              task.name === a.name,
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

  const { addActivity, updateAccount, updateOpportunity } = useMainStore()
  const { toast } = useToast()

  const handleCompleteTask = async (task: any) => {
    await addActivity({
      accountId: task.accountId,
      type: 'Mensagem',
      channel: 'Presencial',
      date: new Date().toISOString(),
      result: `Ação concluída via Dashboard: ${task.text}`,
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

  const overdue = tasks.filter((t) => isOverdue(t.date))
  const today = tasks.filter((t) => isToday(t.date))
  const upcoming = tasks.filter((t) => !isOverdue(t.date) && !isToday(t.date))

  const MetricCard = ({
    title,
    value,
    variance,
    icon: Icon,
    colorClass,
  }: any) => (
    <Card className="rounded-2xl border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] bg-white overflow-hidden">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2.5 rounded-xl ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            {variance} esta semana
          </span>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-black text-slate-900">{value}</h3>
      </CardContent>
    </Card>
  )

  const TaskList = ({ title, items, emptyText, isRed }: any) => (
    <div className="flex flex-col h-full">
      <h3
        className={`font-black text-sm uppercase tracking-wider mb-4 flex items-center ${isRed ? 'text-red-600' : 'text-slate-800'}`}
      >
        {title}
        <span
          className={`ml-2 text-[10px] px-2 py-0.5 rounded-full ${isRed ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}
        >
          {items.length}
        </span>
      </h3>
      <div className="space-y-3 flex-1">
        {items.length === 0 ? (
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 bg-slate-50/50">
            {emptyText}
          </div>
        ) : (
          items.map((task: any) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border ${isRed ? 'bg-red-50/50 border-red-100' : 'bg-white border-slate-200 shadow-sm'} group`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-sm text-slate-900">
                  {task.name}
                </div>
                <div
                  className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${isRed ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}
                >
                  <Clock className="w-3 h-3" />
                  {new Date(task.date).toLocaleDateString()}
                </div>
              </div>
              <p className="text-xs font-medium text-slate-600 mb-3">
                {task.text}
              </p>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => handleCompleteTask(task)}
                  className={`h-7 text-[10px] font-bold ${isRed ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} shadow-none`}
                >
                  Concluir
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Olá, {profile?.nome?.split(' ')[0] || 'Líder'} 👋
          </h1>
          <p className="text-slate-500 mt-1.5 font-semibold text-sm md:text-base">
            Aqui está o resumo da sua execução diária no Atos3 CRM.
          </p>
        </div>
        <Link to="/pipeline" className="w-full sm:w-auto">
          <Button className="w-full bg-orange-500 text-white hover:bg-orange-600 rounded-xl shadow-lg shadow-orange-500/20 font-bold text-sm h-11 px-6">
            <Target className="w-4 h-4 mr-2" /> Ver Pipeline
          </Button>
        </Link>
      </div>

      {/* Revenue Card & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="col-span-1 sm:col-span-2 lg:col-span-2 rounded-2xl border-none shadow-[0_4px_20px_rgba(0,0,0,0.06)] bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -translate-y-10 translate-x-10" />
          <CardContent className="p-6 relative z-10 h-full flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/10 text-white rounded-xl backdrop-blur-sm border border-white/10">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <p className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-1">
              Receita Total (Ganhos)
            </p>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              {formatCurrency(closedWonTotal)}
            </h3>
          </CardContent>
        </Card>

        <MetricCard
          title="Leads Mapeados"
          value={mappedLeads}
          variance={mappedLeadsVar}
          icon={Building2}
          colorClass="bg-blue-50 text-blue-600"
        />
        <MetricCard
          title="Contatos Realizados"
          value={contactsMade}
          variance={contactsMadeVar}
          icon={Phone}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <MetricCard
          title="Reuniões Agendadas"
          value={meetingsScheduled}
          variance={meetingsScheduledVar}
          icon={Calendar}
          colorClass="bg-yellow-50 text-yellow-600"
        />
        <MetricCard
          title="Vendas Fechadas"
          value={salesClosed}
          variance={salesClosedVar}
          icon={Briefcase}
          colorClass="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Funnel */}
      <div className="bg-white rounded-[10px] p-6 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xl font-black text-slate-900 mb-6">
          Funil de Vendas
        </h2>
        <div className="space-y-3 max-w-2xl">
          {[
            {
              label: 'Leads Mapeados',
              count: mappedLeads,
              color: 'bg-blue-500',
            },
            {
              label: 'Conexão Enviada',
              count: opportunities.filter((o) => o.stage === 'Conexão Enviada')
                .length,
              color: 'bg-blue-400',
            },
            {
              label: 'Primeiro Contato',
              count: opportunities.filter((o) => o.stage === 'Primeiro Contato')
                .length,
              color: 'bg-emerald-400',
            },
            {
              label: 'Follow-up',
              count: opportunities.filter((o) => o.stage === 'Follow-up')
                .length,
              color: 'bg-yellow-400',
            },
            {
              label: 'Em Conversa',
              count: opportunities.filter((o) => o.stage === 'Em Conversa')
                .length,
              color: 'bg-orange-400',
            },
            {
              label: 'Reunião',
              count: opportunities.filter((o) => o.stage === 'Reunião').length,
              color: 'bg-purple-500',
            },
            { label: 'Proposta', count: proposalsSent, color: 'bg-red-500' },
          ].map((stage) => {
            const maxCount = Math.max(mappedLeads, 1)
            const width = Math.max((stage.count / maxCount) * 100, 5)
            return (
              <div key={stage.label} className="flex items-center gap-4">
                <div className="w-32 text-xs font-bold text-slate-600 text-right">
                  {stage.label}
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <div
                    className={cn(
                      'h-6 rounded-r-md transition-all duration-1000 ease-out',
                      stage.color,
                    )}
                    style={{ width: `${width}%` }}
                  ></div>
                  <span className="text-sm font-black text-slate-900">
                    {stage.count}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tasks System */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100">
        <div className="mb-6">
          <h2 className="text-xl font-black text-slate-900">
            Minhas ações do dia
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Gestão de tarefas baseada nas próximas ações definidas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TaskList
            title="Atrasados"
            items={overdue}
            emptyText="Nenhum atraso. Mandou bem!"
            isRed={true}
          />
          <TaskList
            title="Hoje"
            items={today}
            emptyText="Tudo limpo para hoje."
          />
          <TaskList
            title="Próximos"
            items={upcoming}
            emptyText="Nenhuma ação futura."
          />
        </div>
      </div>
    </div>
  )
}
