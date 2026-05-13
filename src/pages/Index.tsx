import { useMemo, useState } from 'react'
import useMainStore from '@/stores/main'
import { isOverdue, isToday, formatCurrency } from '@/lib/crm-utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Clock,
  Target,
  Phone,
  Calendar,
  Briefcase,
  Users,
  Filter,
  CheckCircle2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import LeadHistorySheet from '@/components/LeadHistorySheet'

export default function Index() {
  const navigate = useNavigate()
  const {
    activities,
    accounts,
    opportunities,
    proposals,
    dateFilter,
    setDateFilter,
    setKpiFilter,
  } = useMainStore()

  const [detailsAccountId, setDetailsAccountId] = useState<string | null>(null)

  const getDashboardMetrics = () => {
    const totalLeads = accounts.length
    const newLeadsThisMonth = accounts.filter((a) => {
      const d = new Date(a.createdAt)
      const now = new Date()
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      )
    }).length

    const sentProposalsCount = proposals.length
    const pendingActivitiesCount = activities.filter((a) => !a.completed).length
    const scheduledMeetingsCount = activities.filter(
      (a) => a.type.includes('Reunião') && !a.completed,
    ).length

    const closedWon = accounts.filter(
      (a) => a.pipelineStage === 'Fechado',
    ).length
    const closedLost = accounts.filter(
      (a) => a.pipelineStage === 'Perdido',
    ).length
    const conversionRate =
      totalLeads > 0 ? ((closedWon / totalLeads) * 100).toFixed(1) : '0.0'

    const closedWonTotal = proposals
      .filter((p) => {
        const a = accounts.find((acc) => acc.id === p.accountId)
        return a?.pipelineStage === 'Fechado'
      })
      .reduce((s, p) => s + p.value, 0)

    return {
      totalLeads,
      newLeadsThisMonth,
      sentProposalsCount,
      pendingActivitiesCount,
      scheduledMeetingsCount,
      closedWon,
      closedLost,
      conversionRate,
      closedWonTotal,
    }
  }

  const metrics = useMemo(
    () => getDashboardMetrics(),
    [accounts, activities, proposals],
  )

  const chartData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - now.getDay())
    start.setHours(0, 0, 0, 0)

    return days.map((day, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const isDay = (dateStr: string) => {
        const d2 = new Date(dateStr)
        return d2.getDate() === d.getDate() && d2.getMonth() === d.getMonth()
      }
      const acts = activities.filter((a) => isDay(a.date))
      return {
        name: day,
        Contatos: acts.filter((a) =>
          ['Ligação', 'Mensagem', 'E-mail', 'Follow-up'].includes(a.type),
        ).length,
        Reuniões: acts.filter((a) => a.type.includes('Reunião')).length,
        Propostas: acts.filter((a) => a.type === 'Proposta enviada').length,
      }
    })
  }, [activities])

  const conversionData = useMemo(() => {
    return [
      { name: 'Leads', value: accounts.length || 1, fill: '#3b82f6' },
      {
        name: 'Em Conversa',
        value: accounts.filter((a) =>
          ['Contato realizado', 'Em Conversa', 'Negociação'].includes(
            a.pipelineStage,
          ),
        ).length,
        fill: '#8b5cf6',
      },
      { name: 'Propostas', value: metrics.sentProposalsCount, fill: '#f59e0b' },
      { name: 'Fechados', value: metrics.closedWon, fill: '#10b981' },
    ]
  }, [accounts, metrics])

  const tasks = useMemo(() => {
    const t: any[] = []
    activities.forEach((act) => {
      if (!act.completed && (isToday(act.date) || isOverdue(act.date))) {
        const acc = accounts.find((a) => a.id === act.accountId)
        t.push({
          id: `act-${act.id}`,
          text: `${act.type} - ${act.title || act.result || ''}`,
          date: act.date,
          name: acc?.name || 'Lead',
          accountId: act.accountId,
          item: act,
        })
      }
    })
    accounts.forEach((a) => {
      if (
        a.nextAction &&
        a.nextActionDate &&
        (isToday(a.nextActionDate) || isOverdue(a.nextActionDate))
      ) {
        if (!t.find((task) => task.accountId === a.id)) {
          t.push({
            id: `acc-${a.id}`,
            text: a.nextAction,
            date: a.nextActionDate,
            name: a.name || a.companyName,
            accountId: a.id,
            item: a,
          })
        }
      }
    })
    return t.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
  }, [activities, accounts])

  const overdue = tasks.filter((t) => isOverdue(t.date))
  const today = tasks.filter((t) => isToday(t.date))

  const handleKpiClick = (filterName: string) => {
    setKpiFilter(filterName)
    navigate('/pipeline')
  }

  const MetricCard = ({
    title,
    value,
    variance,
    icon: Icon,
    colorClass,
    kpiName,
  }: any) => (
    <Card
      className="rounded-[10px] border border-slate-100 shadow-sm bg-white overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
      onClick={() => handleKpiClick(kpiName)}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className={cn('p-2.5 rounded-xl transition-colors', colorClass)}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
            {variance}
          </span>
        </div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-black text-slate-900 group-hover:text-[#FF6A00] transition-colors">
          {value}
        </h3>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-10 animate-in fade-in duration-500 min-h-[calc(100vh-6rem)]">
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Visão Estratégica 👋
            </h1>
            <p className="text-slate-500 mt-1 font-medium text-sm">
              Acompanhe seus resultados e funil em tempo real.
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Select value={dateFilter} onValueChange={setDateFilter as any}>
              <SelectTrigger className="w-[160px] bg-white h-10 border-slate-200 font-semibold shadow-sm">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="year">Este Ano</SelectItem>
                <SelectItem value="all">Todo Período</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => navigate('/pipeline')}
              className="bg-[#FF6A00] text-white hover:bg-[#e65c00] rounded-[8px] font-bold h-10 shadow-md hidden sm:flex"
            >
              <Target className="w-4 h-4 mr-2" /> Ver Pipeline
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Leads Mapeados"
            value={metrics.totalLeads}
            variance={`+${metrics.newLeadsThisMonth} mês`}
            icon={Users}
            colorClass="bg-blue-50 text-blue-600 group-hover:bg-[#FF6A00]/10 group-hover:text-[#FF6A00]"
            kpiName="leads"
          />
          <MetricCard
            title="Ações Pendentes"
            value={metrics.pendingActivitiesCount}
            variance="Em Aberto"
            icon={Phone}
            colorClass="bg-indigo-50 text-indigo-600 group-hover:bg-[#FF6A00]/10 group-hover:text-[#FF6A00]"
            kpiName="contatos"
          />
          <MetricCard
            title="Reuniões Agendadas"
            value={metrics.scheduledMeetingsCount}
            variance="Em Aberto"
            icon={Calendar}
            colorClass="bg-purple-50 text-purple-600 group-hover:bg-[#FF6A00]/10 group-hover:text-[#FF6A00]"
            kpiName="reunioes"
          />
          <MetricCard
            title="Taxa de Conversão"
            value={`${metrics.conversionRate}%`}
            variance={`${metrics.closedWon} Vendas`}
            icon={Briefcase}
            colorClass="bg-emerald-50 text-emerald-600 group-hover:bg-[#FF6A00]/10 group-hover:text-[#FF6A00]"
            kpiName="vendas"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-[10px] shadow-sm border-slate-100 bg-white">
            <CardContent className="p-6">
              <h3 className="font-black text-slate-900 mb-6">
                Atividades da Semana
              </h3>
              <ChartContainer config={{}} className="h-[240px] w-full">
                <BarChart
                  data={chartData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar
                    dataKey="Contatos"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={12}
                  />
                  <Bar
                    dataKey="Reuniões"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    barSize={12}
                  />
                  <Bar
                    dataKey="Propostas"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    barSize={12}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="rounded-[10px] shadow-sm border-slate-100 bg-white">
            <CardContent className="p-6 flex flex-col">
              <h3 className="font-black text-slate-900 mb-6">
                Eficiência do Funil
              </h3>
              <div className="flex items-center justify-center flex-1">
                <ChartContainer
                  config={{}}
                  className="h-[200px] w-[200px] shrink-0"
                >
                  <PieChart>
                    <Pie
                      data={conversionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {conversionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="ml-6 space-y-3 w-full max-w-[140px]">
                  {conversionData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-sm font-medium text-slate-600">
                        {item.name}
                      </span>
                      <span className="text-sm font-bold text-slate-900 ml-auto">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[10px] shadow-sm border-slate-100 bg-white overflow-hidden">
          <CardContent className="p-6">
            <h3 className="font-black text-slate-900 mb-6 flex justify-between items-center">
              Funil de Vendas
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-100">
                Receita Estimada: {formatCurrency(metrics.closedWonTotal)}
              </span>
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: 'Prospecção',
                  count: accounts.filter(
                    (a) => a.pipelineStage === 'Prospecção',
                  ).length,
                  color: 'bg-blue-500',
                },
                {
                  label: 'Contato realizado',
                  count: accounts.filter(
                    (a) => a.pipelineStage === 'Contato realizado',
                  ).length,
                  color: 'bg-indigo-400',
                },
                {
                  label: 'Reunião agendada',
                  count: accounts.filter(
                    (a) => a.pipelineStage === 'Reunião agendada',
                  ).length,
                  color: 'bg-purple-400',
                },
                {
                  label: 'Proposta enviada',
                  count: accounts.filter(
                    (a) => a.pipelineStage === 'Proposta enviada',
                  ).length,
                  color: 'bg-orange-500',
                },
                {
                  label: 'Negociação',
                  count: accounts.filter(
                    (a) => a.pipelineStage === 'Negociação',
                  ).length,
                  color: 'bg-pink-400',
                },
                {
                  label: 'Fechado',
                  count: accounts.filter((a) => a.pipelineStage === 'Fechado')
                    .length,
                  color: 'bg-emerald-500',
                },
              ].map((stage) => {
                const maxCount = Math.max(accounts.length, 1)
                const width = Math.max((stage.count / maxCount) * 100, 4)
                return (
                  <div
                    key={stage.label}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-32 text-xs font-bold text-slate-600 text-right group-hover:text-slate-900 transition-colors">
                      {stage.label}
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div
                        className={cn(
                          'h-7 rounded-r-md transition-all duration-1000 ease-out',
                          stage.color,
                        )}
                        style={{ width: `${width}%` }}
                      />
                      <span className="text-sm font-black text-slate-900">
                        {stage.count}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full lg:w-[340px] shrink-0">
        <Card className="rounded-[10px] shadow-sm border-slate-100 bg-white sticky top-24 h-[calc(100vh-7rem)] flex flex-col">
          <div className="p-5 border-b border-slate-100 shrink-0">
            <h2 className="text-lg font-black text-[#0D1B2A] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#FF6A00]" /> Minhas Ações
              Hoje
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-1">
              {today.length + overdue.length} tarefas pendentes
            </p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
            {overdue.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-red-600 uppercase tracking-wider flex items-center gap-2">
                  Atrasadas{' '}
                  <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md">
                    {overdue.length}
                  </span>
                </h4>
                {overdue.map((t) => (
                  <TaskItem
                    key={t.id}
                    task={t}
                    isRed
                    onClick={() => setDetailsAccountId(t.accountId)}
                  />
                ))}
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                Hoje{' '}
                <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
                  {today.length}
                </span>
              </h4>
              {today.length === 0 ? (
                <div className="text-xs font-medium text-slate-400 p-4 border border-dashed border-slate-200 rounded-lg text-center">
                  Tudo limpo para hoje!
                </div>
              ) : (
                today.map((t) => (
                  <TaskItem
                    key={t.id}
                    task={t}
                    onClick={() => setDetailsAccountId(t.accountId)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 shrink-0">
            <Button
              variant="outline"
              className="w-full font-bold text-slate-700 h-10 shadow-sm"
              onClick={() => navigate('/activities')}
            >
              Ver todas as atividades
            </Button>
          </div>
        </Card>
      </div>

      <LeadHistorySheet
        account={accounts.find((a) => a.id === detailsAccountId) || null}
        open={!!detailsAccountId}
        onOpenChange={(open) => !open && setDetailsAccountId(null)}
      />
    </div>
  )
}

function TaskItem({ task, isRed, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 rounded-xl border cursor-pointer transition-all group',
        isRed
          ? 'bg-red-50/50 border-red-100 hover:border-red-300 hover:shadow-sm'
          : 'bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:shadow-sm',
      )}
    >
      <div className="flex justify-between items-start mb-1.5">
        <div className="font-bold text-sm text-slate-900 line-clamp-1">
          {task.name}
        </div>
        <Clock
          className={cn(
            'w-3.5 h-3.5 mt-0.5',
            isRed ? 'text-red-500' : 'text-slate-400',
          )}
        />
      </div>
      <p className="text-xs font-medium text-slate-600 line-clamp-2">
        {task.text}
      </p>
      <div
        className={cn(
          'text-[10px] font-bold mt-2',
          isRed ? 'text-red-600' : 'text-[#FF6A00]',
        )}
      >
        {new Date(task.date).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  )
}
