import { useMemo, useState } from 'react'
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
  CheckCircle2,
  RefreshCw,
  Bug,
  AlertCircle,
  FileText,
  ShoppingCart,
  TrendingUp,
  DollarSign,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
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
import { DatabaseDiagnostic } from '@/components/DatabaseDiagnostic'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function Index() {
  const navigate = useNavigate()
  const { data, loading, error, getDashboardMetrics } = useDashboardData()

  const [detailsAccountId, setDetailsAccountId] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [showNegotiationModal, setShowNegotiationModal] = useState(false)
  const [showNegotiationModal, setShowNegotiationModal] = useState(false)

  const activeProposals = useMemo(() => {
    return data.proposals.filter(
      (p: any) => p.status === 'Enviada' || p.status === 'Em negociação',
    )
  }, [data.proposals])

  const financialMetrics = useMemo(() => {
    const monthlyNegotiation = activeProposals.reduce(
      (sum: number, p: any) => sum + (p.totalMonthly || 0),
      0,
    )
    const annualNegotiation = monthlyNegotiation * 12
    const setupEquipNegotiation = activeProposals.reduce(
      (sum: number, p: any) =>
        sum + ((p.totalSetup || 0) + (p.totalEquipment || 0)),
      0,
    )

    return {
      monthlyNegotiation,
      annualNegotiation,
      setupEquipNegotiation,
    }
  }, [activeProposals])

  const metrics = useMemo(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const totalLeads = data.accounts.length
    const newLeadsMonth = data.accounts.filter(
      (a) => new Date(a.createdAt || now) >= startOfMonth,
    ).length

    const pendingActivities = data.activities.filter(
      (a) =>
        a.status === 'Pendente' ||
        (!a.completed && a.status !== 'Cancelada' && a.status !== 'Realizada'),
    ).length

    const overdueActivities = data.activities.filter((a) => {
      if (
        a.status !== 'Pendente' &&
        (a.completed || a.status === 'Cancelada' || a.status === 'Realizada')
      )
        return false
      const d = new Date(a.date)
      d.setHours(0, 0, 0, 0)
      const t = new Date()
      t.setHours(0, 0, 0, 0)
      return d < t
    }).length

    const sentProposals = data.proposals.length
    const generatedOrders = data.orders.length

    const closedSales = data.accounts.filter(
      (a) =>
        a.pipelineStage === 'Fechado' || a.pipelineStage === 'Fechado Ganho',
    ).length
    const conversionRate =
      totalLeads > 0 ? ((closedSales / totalLeads) * 100).toFixed(1) : '0.0'

    const closedWonTotal = data.proposals
      .filter((p: any) => {
        const a = data.accounts.find((acc: any) => acc.id === p.accountId)
        return a?.pipelineStage === 'Fechado' && p.status === 'Aprovada'
      })
      .reduce((s: number, p: any) => {
        const val =
          p.value || p.totalSetup + p.totalEquipment + p.totalMonthly * 12 || 0
        return s + val
      }, 0)

    const negotiationProposals = data.proposals.filter(
      (p: any) => p.status === 'Enviada' || p.status === 'Em negociação',
    )

    const monthlyRevenue = negotiationProposals.reduce(
      (sum: number, p: any) => sum + (p.totalMonthly || 0),
      0,
    )
    const annualRevenue = monthlyRevenue * 12
    const totalSetupEquipment = negotiationProposals.reduce(
      (sum: number, p: any) =>
        sum + (p.totalSetup || 0) + (p.totalEquipment || 0),
      0,
    )

    return {
      totalLeads,
      newLeadsMonth,
      pendingActivities,
      overdueActivities,
      sentProposals,
      generatedOrders,
      closedSales,
      conversionRate,
      closedWonTotal,
      negotiationProposals,
      monthlyRevenue,
      annualRevenue,
      totalSetupEquipment,
    }
  }, [data])

  const activityChartData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - now.getDay())
    start.setHours(0, 0, 0, 0)

    return days.map((day, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const isDay = (dateStr: string) => {
        if (!dateStr) return false
        const d2 = new Date(dateStr)
        return d2.getDate() === d.getDate() && d2.getMonth() === d.getMonth()
      }
      const acts = data.activities.filter((a: any) => isDay(a.date))
      return {
        name: day,
        Contatos: acts.filter((a: any) =>
          ['Ligação', 'Mensagem', 'E-mail', 'Follow-up'].includes(a.type),
        ).length,
        Reuniões: acts.filter((a: any) => a.type?.includes('Reunião')).length,
      }
    })
  }, [data.activities])

  const proposalStatusData = useMemo(() => {
    const counts = data.proposals.reduce((acc: any, p: any) => {
      const status = p.status || 'Rascunho'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})
    const colors: any = {
      Rascunho: '#94a3b8',
      Enviada: '#3b82f6',
      Aprovada: '#10b981',
      Recusada: '#ef4444',
    }
    return Object.keys(counts).map((k) => ({
      name: k,
      value: counts[k],
      fill: colors[k] || '#94a3b8',
    }))
  }, [data.proposals])

  const orderStatusData = useMemo(() => {
    const counts = data.orders.reduce((acc: any, o: any) => {
      const status = o.status || 'Rascunho'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})
    const colors: any = {
      Rascunho: '#94a3b8',
      'Pedido gerado': '#f59e0b',
      'Em separação': '#8b5cf6',
      Entregue: '#10b981',
      Cancelado: '#ef4444',
    }
    return Object.keys(counts).map((k) => ({
      name: k,
      value: counts[k],
      fill: colors[k] || '#94a3b8',
    }))
  }, [data.orders])

  const tasks = useMemo(() => {
    const t: any[] = []
    data.activities.forEach((act: any) => {
      if (!act.completed && (isToday(act.date) || isOverdue(act.date))) {
        const acc = data.accounts.find((a: any) => a.id === act.accountId)
        t.push({
          id: `act-${act.id}`,
          text: `${act.type} - ${act.title || act.result || ''}`,
          date: act.date,
          name: acc?.name || acc?.companyName || 'Lead',
          accountId: act.accountId,
          item: act,
        })
      }
    })
    data.accounts.forEach((a: any) => {
      if (
        a.nextAction &&
        a.nextActionDate &&
        (isToday(a.nextActionDate) || isOverdue(a.nextActionDate))
      ) {
        if (!t.find((task: any) => task.accountId === a.id)) {
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
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
  }, [data.activities, data.accounts])

  const overdue = tasks.filter((t: any) => isOverdue(t.date))
  const today = tasks.filter((t: any) => isToday(t.date))

  const MetricCard = ({
    title,
    value,
    variance,
    icon: Icon,
    colorClass,
    onClick,
    tooltip,
  }: any) => (
    <Card
      className={cn(
        'rounded-[10px] border border-slate-100 shadow-sm bg-white overflow-hidden cursor-pointer hover:shadow-md transition-all group',
        loading && 'opacity-60 pointer-events-none',
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className={cn('p-2.5 rounded-xl transition-colors', colorClass)}>
            <Icon className="w-5 h-5" />
          </div>
          {variance && (
            <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              {variance}
            </span>
          )}
        </div>

        {tooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <p
                className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 cursor-help border-b border-dashed border-slate-300 w-fit"
                onClick={(e) => e.stopPropagation()}
              >
                {title}
              </p>
            </TooltipTrigger>
            <TooltipContent className="max-w-[250px] text-center" side="top">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            {title}
          </p>
        )}

        <h3 className="text-2xl font-black text-slate-900 group-hover:text-[#FF6A00] transition-colors">
          {value}
        </h3>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-10 animate-in fade-in duration-500 min-h-[calc(100vh-6rem)]">
      <div className="flex-1 space-y-6">
        <DatabaseDiagnostic />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Visão Estratégica 👋
            </h1>
            <p className="text-slate-500 mt-1 font-medium text-sm">
              Métricas em tempo real atualizadas do Supabase.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'bg-white border-slate-200 text-slate-500 hover:text-slate-900 font-medium',
                showDebug && 'bg-slate-100 text-slate-900',
              )}
              onClick={() => setShowDebug(!showDebug)}
            >
              <Bug className="w-4 h-4 mr-2" />
              Ver diagnóstico
            </Button>
            <Button
              onClick={getDashboardMetrics}
              disabled={loading}
              className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-bold shadow-sm"
            >
              <RefreshCw
                className={cn('w-4 h-4 mr-2', loading && 'animate-spin')}
              />
              Atualizar Dashboard
            </Button>
          </div>
        </div>

        {showDebug && (
          <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-sm font-mono relative shadow-inner animate-in fade-in slide-in-from-top-2">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => setShowDebug(false)}
            >
              &times;
            </Button>
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Bug className="w-4 h-4 text-emerald-400" /> Diagnóstico do
              Supabase
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-xs mb-1">Accounts</div>
                <div className="text-xl font-bold text-white">
                  {data.accounts.length}
                </div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-xs mb-1">Activities</div>
                <div className="text-xl font-bold text-white">
                  {data.activities.length}
                </div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-xs mb-1">Proposals</div>
                <div className="text-xl font-bold text-white">
                  {data.proposals.length}
                </div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <div className="text-slate-400 text-xs mb-1">Order Forms</div>
                <div className="text-xl font-bold text-white">
                  {data.orders.length}
                </div>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-950/50 border border-red-900 rounded-lg text-red-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className={cn(
              'rounded-[10px] border border-slate-100 shadow-sm bg-white overflow-visible cursor-pointer hover:shadow-md transition-all group',
              loading && 'opacity-60 pointer-events-none',
            )}
            onClick={() => setShowNegotiationModal(true)}
          >
            <CardContent className="p-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full text-left outline-none">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 rounded-xl transition-colors bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      Valor em Negociação (12x)
                      <AlertCircle className="w-3 h-3 text-slate-400" />
                    </p>
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-[#FF6A00] transition-colors">
                      {formatCurrency(financialMetrics.annualNegotiation)}
                    </h3>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-[250px] text-center"
                >
                  <p>
                    Cálculo: Soma das mensalidades das propostas ativas × 12
                    meses. Setup/equipamentos não inclusos.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

          <Card
            className={cn(
              'rounded-[10px] border border-slate-100 shadow-sm bg-white',
              loading && 'opacity-60',
            )}
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl transition-colors bg-blue-50 text-blue-600">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Receita Mensal em Negociação
              </p>
              <h3 className="text-2xl font-black text-slate-900">
                {formatCurrency(financialMetrics.monthlyNegotiation)}
              </h3>
            </CardContent>
          </Card>

          <Card
            className={cn(
              'rounded-[10px] border border-slate-100 shadow-sm bg-white',
              loading && 'opacity-60',
            )}
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl transition-colors bg-purple-50 text-purple-600">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Valor Total de Setup/Equip.
              </p>
              <h3 className="text-2xl font-black text-slate-900">
                {formatCurrency(financialMetrics.setupEquipNegotiation)}
              </h3>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Valor em Negociação (12x)"
            value={formatCurrency(metrics.annualRevenue)}
            variance="Projetado"
            icon={DollarSign}
            colorClass="bg-blue-50 text-blue-600 group-hover:bg-blue-100"
            tooltip="Cálculo: Soma das mensalidades das propostas ativas × 12 meses. Setup/equipamentos não inclusos."
            onClick={() => setShowNegotiationModal(true)}
          />
          <MetricCard
            title="Total de Leads"
            value={metrics.totalLeads}
            variance="Pipeline"
            icon={Users}
            colorClass="bg-blue-50 text-blue-600 group-hover:bg-blue-100"
            onClick={() => navigate('/accounts')}
          />
          <MetricCard
            title="Novos Leads (Mês)"
            value={metrics.newLeadsMonth}
            variance="Recentes"
            icon={Target}
            colorClass="bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
            onClick={() => navigate('/accounts')}
          />
          <MetricCard
            title="Atividades Pendentes"
            value={metrics.pendingActivities}
            variance="Para fazer"
            icon={Phone}
            colorClass="bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100"
            onClick={() => navigate('/activities')}
          />
          <MetricCard
            title="Atividades Atrasadas"
            value={metrics.overdueActivities}
            variance="Atenção"
            icon={AlertCircle}
            colorClass="bg-red-50 text-red-600 group-hover:bg-red-100"
            onClick={() => navigate('/activities')}
          />
          <MetricCard
            title="Propostas"
            value={metrics.sentProposals}
            variance="Total"
            icon={FileText}
            colorClass="bg-orange-50 text-orange-600 group-hover:bg-orange-100"
            onClick={() => navigate('/proposals')}
          />
          <MetricCard
            title="Pedidos"
            value={metrics.generatedOrders}
            variance="Total"
            icon={ShoppingCart}
            colorClass="bg-purple-50 text-purple-600 group-hover:bg-purple-100"
            onClick={() => navigate('/orders')}
          />
          <MetricCard
            title="Vendas Fechadas"
            value={metrics.closedSales}
            variance="Ganhos"
            icon={Briefcase}
            colorClass="bg-teal-50 text-teal-600 group-hover:bg-teal-100"
            onClick={() => navigate('/pipeline?stage=Fechado')}
          />
          <MetricCard
            title="Conversão Geral"
            value={`${metrics.conversionRate}%`}
            variance="Performance"
            icon={TrendingUp}
            colorClass="bg-sky-50 text-sky-600 group-hover:bg-sky-100"
            onClick={() => navigate('/pipeline')}
          />
        </div>

        <h2 className="text-lg font-black text-slate-900 tracking-tight mt-2 mb-2 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-500" /> Previsão de
          Receita (Propostas Ativas)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Valor em Negociação (12x)"
            value={formatCurrency(financialMetrics.annual)}
            variance="Anual"
            icon={TrendingUp}
            colorClass="bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
            onClick={() => setShowNegotiationModal(true)}
            tooltip="Cálculo: Soma das mensalidades das propostas ativas × 12 meses. Setup/equipamentos não inclusos."
          />
          <MetricCard
            title="Receita Mensal"
            value={formatCurrency(financialMetrics.monthly)}
            variance="Em Negociação"
            icon={DollarSign}
            colorClass="bg-blue-50 text-blue-600 group-hover:bg-blue-100"
          />
          <MetricCard
            title="Receita Anual Projetada"
            value={formatCurrency(financialMetrics.annual)}
            variance="Projeção"
            icon={TrendingUp}
            colorClass="bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100"
          />
          <MetricCard
            title="Setup / Equipamentos"
            value={formatCurrency(financialMetrics.setupAndEquip)}
            variance="Taxa Única"
            icon={Briefcase}
            colorClass="bg-orange-50 text-orange-600 group-hover:bg-orange-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-[10px] shadow-sm border-slate-100 bg-white overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-black text-slate-900 mb-6 flex justify-between items-center">
                Funil de Vendas Real
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-100">
                  Receita Ganha: {formatCurrency(metrics.closedWonTotal)}
                </span>
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Prospecção', color: 'bg-blue-500' },
                  { label: 'Contato realizado', color: 'bg-indigo-400' },
                  { label: 'Reunião agendada', color: 'bg-purple-400' },
                  { label: 'Proposta enviada', color: 'bg-orange-500' },
                  { label: 'Negociação', color: 'bg-pink-400' },
                  { label: 'Fechado', color: 'bg-emerald-500' },
                ].map((stage) => {
                  const count = data.accounts.filter((a) => {
                    const st = a.pipelineStage || 'Prospecção'
                    return st === stage.label
                  }).length
                  const maxCount = Math.max(data.accounts.length, 1)
                  const width = Math.max((count / maxCount) * 100, 4)
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
                          {count}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[10px] shadow-sm border-slate-100 bg-white">
            <CardContent className="p-6">
              <h3 className="font-black text-slate-900 mb-6">
                Atividades da Semana
              </h3>
              <ChartContainer config={{}} className="h-[240px] w-full">
                <BarChart
                  data={activityChartData}
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
                    barSize={16}
                  />
                  <Bar
                    dataKey="Reuniões"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="rounded-[10px] shadow-sm border-slate-100 bg-white">
            <CardContent className="p-6 flex flex-col h-full">
              <h3 className="font-black text-slate-900 mb-2">
                Status das Propostas
              </h3>
              <div className="flex items-center justify-center flex-1">
                {proposalStatusData.length > 0 ? (
                  <>
                    <ChartContainer
                      config={{}}
                      className="h-[180px] w-[180px] shrink-0"
                    >
                      <PieChart>
                        <Pie
                          data={proposalStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {proposalStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                    <div className="ml-6 space-y-2 w-full max-w-[140px]">
                      {proposalStatusData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: item.fill }}
                            />
                            <span className="text-xs font-medium text-slate-600">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-slate-900">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-slate-400 font-medium my-auto text-center w-full">
                    Nenhuma proposta registrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[10px] shadow-sm border-slate-100 bg-white">
            <CardContent className="p-6 flex flex-col h-full">
              <h3 className="font-black text-slate-900 mb-2">
                Status dos Pedidos
              </h3>
              <div className="flex items-center justify-center flex-1">
                {orderStatusData.length > 0 ? (
                  <>
                    <ChartContainer
                      config={{}}
                      className="h-[180px] w-[180px] shrink-0"
                    >
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                    <div className="ml-6 space-y-2 w-full max-w-[140px]">
                      {orderStatusData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: item.fill }}
                            />
                            <span className="text-xs font-medium text-slate-600 line-clamp-1">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-slate-900">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-slate-400 font-medium my-auto text-center w-full">
                    Nenhum pedido gerado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-full lg:w-[340px] shrink-0">
        <Card className="rounded-[10px] shadow-sm border-slate-100 bg-white sticky top-24 h-[calc(100vh-7rem)] flex flex-col">
          <div className="p-5 border-b border-slate-100 shrink-0">
            <h2 className="text-lg font-black text-[#0D1B2A] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#FF6A00]" /> Minhas Ações
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-1">
              {loading
                ? 'Carregando ações...'
                : `${today.length + overdue.length} tarefas pendentes`}
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
              {!loading && today.length === 0 ? (
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
        account={
          data.accounts.find((a: any) => a.id === detailsAccountId) || null
        }
        open={!!detailsAccountId}
        onOpenChange={(open) => !open && setDetailsAccountId(null)}
      />

      <Dialog
        open={showNegotiationModal}
        onOpenChange={setShowNegotiationModal}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Detalhamento de Valores em Negociação</DialogTitle>
            <DialogDescription>
              Propostas com status "Enviada" ou "Em negociação".
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto custom-scrollbar border rounded-md">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 sticky top-0 shadow-sm">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Número
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Cliente
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-right">
                    Mensalidade
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-right">
                    Anual Projetado
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-right">
                    Setup/Equip.
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {activeProposals.length > 0 ? (
                  activeProposals.map((p: any) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {p.proposalNumber || '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {p.companyName || '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700">
                        {formatCurrency(p.totalMonthly || 0)}
                      </td>
                      <td className="px-4 py-3 text-right font-black text-emerald-600">
                        {formatCurrency((p.totalMonthly || 0) * 12)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700">
                        {formatCurrency(
                          (p.totalSetup || 0) + (p.totalEquipment || 0),
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider inline-block">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-slate-500 font-medium"
                    >
                      Nenhuma proposta em negociação no momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
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
