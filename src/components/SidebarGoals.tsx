import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Calendar,
  Target,
  BarChart,
  Settings as SettingsIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import useMainStore from '@/stores/main'
import { useMonthlyGoals } from '@/hooks/use-monthly-goals'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SidebarGoals() {
  const { accounts, activities, proposals, opportunities } = useMainStore()
  const { goals, updateGoal } = useMonthlyGoals()
  const navigate = useNavigate()

  const [currentDate, setCurrentDate] = useState(new Date())

  const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
  const monthName = currentDate.toLocaleString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })

  const prevMonth = () => {
    const d = new Date(currentDate)
    d.setMonth(d.getMonth() - 1)
    setCurrentDate(d)
  }

  const nextMonth = () => {
    const d = new Date(currentDate)
    d.setMonth(d.getMonth() + 1)
    setCurrentDate(d)
  }

  const activeGoal = goals.find((g) => g.month === monthKey) || {
    leadsGoal: 100,
    meetingsGoal: 15,
    proposalsGoal: 8,
    salesGoal: 4,
  }

  const actuals = useMemo(() => {
    const start = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    ).getTime()
    const end = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
    ).getTime()

    const isInMonth = (dateStr?: string | null) => {
      if (!dateStr) return false
      const t = new Date(dateStr).getTime()
      return t >= start && t <= end
    }

    const leadsCount = accounts.filter((a) => isInMonth(a.createdAt)).length

    const meetingsCount = activities.filter(
      (a) =>
        isInMonth(a.date) &&
        a.completed &&
        (a.type === 'Reunião realizada' ||
          a.type === 'Reunião agendada' ||
          a.type === 'Visita' ||
          a.type.toLowerCase().includes('reunião')),
    ).length

    const proposalsCount = proposals.filter(
      (p) =>
        isInMonth(p.createdAt) &&
        (p.status === 'Enviada' || p.status === 'Aprovada'),
    ).length

    const salesCount =
      opportunities.filter(
        (o) =>
          isInMonth(o.closeDate || o.createdAt) && o.stage === 'Fechado Ganho',
      ).length +
      accounts.filter(
        (a) =>
          isInMonth(a.updatedAt) &&
          (a.pipelineStage === 'Fechado' ||
            a.status === 'Cliente' ||
            a.status === 'Fechado'),
      ).length

    return {
      leads: leadsCount,
      meetings: meetingsCount,
      proposals: proposalsCount,
      sales: salesCount,
    }
  }, [accounts, activities, proposals, opportunities, currentDate])

  const [editGoals, setEditGoals] = useState({
    leads: activeGoal.leadsGoal,
    meetings: activeGoal.meetingsGoal,
    proposals: activeGoal.proposalsGoal,
    sales: activeGoal.salesGoal,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSave = () => {
    updateGoal(monthKey, {
      leadsGoal: editGoals.leads,
      meetingsGoal: editGoals.meetings,
      proposalsGoal: editGoals.proposals,
      salesGoal: editGoals.sales,
    })
    setIsModalOpen(false)
  }

  const renderMetric = (
    icon: React.ReactNode,
    label: string,
    value: number,
    goal: number,
    onClick: () => void,
  ) => {
    const pct = goal > 0 ? Math.min(100, Math.round((value / goal) * 100)) : 100

    let barColor = '[&>div]:bg-green-500'
    let badgeColor = 'bg-green-500/20 text-green-400'

    if (pct < 70) {
      barColor = '[&>div]:bg-red-500'
      badgeColor = 'bg-red-500/20 text-red-400'
    } else if (pct < 100) {
      barColor = '[&>div]:bg-yellow-500'
      badgeColor = 'bg-yellow-500/20 text-yellow-400'
    }

    const isComplete = pct >= 100

    return (
      <div
        className="space-y-1.5 p-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors group"
        onClick={onClick}
      >
        <div className="flex justify-between text-xs font-medium items-center">
          <span className="flex items-center gap-2 text-slate-300 group-hover:text-white transition-colors">
            {icon} {label}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-bold">
              {value} / {goal}
            </span>
            <span className={cn('text-[10px] px-1 rounded-sm', badgeColor)}>
              {pct}%
            </span>
            {isComplete && (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            )}
          </div>
        </div>
        <Progress value={pct} className={cn('h-1.5 bg-white/10', barColor)} />
        {!isComplete && (
          <p className="text-[10px] text-slate-500 pt-0.5">
            Faltam {goal - value} para atingir a meta
          </p>
        )}
      </div>
    )
  }

  const getInsights = () => {
    const insights = []
    if (actuals.sales >= activeGoal.salesGoal && activeGoal.salesGoal > 0) {
      insights.push('🚀 Meta de vendas batida!')
    } else if (
      activeGoal.salesGoal - actuals.sales <= 2 &&
      activeGoal.salesGoal > 0
    ) {
      insights.push(
        `Faltam apenas ${activeGoal.salesGoal - actuals.sales} vendas para atingir o objetivo do mês!`,
      )
    }

    const dayOfMonth = new Date().getDate()
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate()
    const timeProgress = (dayOfMonth / daysInMonth) * 100

    const leadsPct =
      activeGoal.leadsGoal > 0
        ? (actuals.leads / activeGoal.leadsGoal) * 100
        : 100
    if (leadsPct < timeProgress - 20) {
      insights.push('Seu ritmo de leads está abaixo da meta.')
    }

    const proposalsPct =
      activeGoal.proposalsGoal > 0
        ? (actuals.proposals / activeGoal.proposalsGoal) * 100
        : 100
    if (proposalsPct > timeProgress + 20) {
      insights.push('Você está acima da meta de propostas. Excelente trabalho!')
    }

    if (insights.length === 0)
      insights.push('Acompanhe seus resultados diários.')

    return insights[0]
  }

  return (
    <div className="px-4 py-6 border-t border-white/10 space-y-3 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Metas do Mês
        </h4>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => {
                setEditGoals({
                  leads: activeGoal.leadsGoal,
                  meetings: activeGoal.meetingsGoal,
                  proposals: activeGoal.proposalsGoal,
                  sales: activeGoal.salesGoal,
                })
              }}
              title="Editar Metas"
            >
              <SettingsIcon size={14} />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-[#0D1B2A] text-white border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-xl capitalize">
                Configurar Metas - {monthName}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="leads" className="text-right text-slate-300">
                  Leads Novos
                </Label>
                <Input
                  id="leads"
                  type="number"
                  value={editGoals.leads}
                  onChange={(e) =>
                    setEditGoals({
                      ...editGoals,
                      leads: Number(e.target.value),
                    })
                  }
                  className="col-span-3 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="meetings" className="text-right text-slate-300">
                  Reuniões
                </Label>
                <Input
                  id="meetings"
                  type="number"
                  value={editGoals.meetings}
                  onChange={(e) =>
                    setEditGoals({
                      ...editGoals,
                      meetings: Number(e.target.value),
                    })
                  }
                  className="col-span-3 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="proposals"
                  className="text-right text-slate-300"
                >
                  Propostas
                </Label>
                <Input
                  id="proposals"
                  type="number"
                  value={editGoals.proposals}
                  onChange={(e) =>
                    setEditGoals({
                      ...editGoals,
                      proposals: Number(e.target.value),
                    })
                  }
                  className="col-span-3 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sales" className="text-right text-slate-300">
                  Vendas
                </Label>
                <Input
                  id="sales"
                  type="number"
                  value={editGoals.sales}
                  onChange={(e) =>
                    setEditGoals({
                      ...editGoals,
                      sales: Number(e.target.value),
                    })
                  }
                  className="col-span-3 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Salvar Metas
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between bg-white/5 rounded-md p-1.5 mb-2">
        <button
          onClick={prevMonth}
          className="text-slate-400 hover:text-white p-1"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-xs font-semibold text-slate-200 capitalize">
          {monthName}
        </span>
        <button
          onClick={nextMonth}
          className="text-slate-400 hover:text-white p-1"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="space-y-1 -mx-2">
        {renderMetric(
          <Users className="w-3.5 h-3.5 text-blue-400" />,
          'Leads Novos',
          actuals.leads,
          activeGoal.leadsGoal,
          () => navigate('/accounts'),
        )}

        {renderMetric(
          <Calendar className="w-3.5 h-3.5 text-green-400" />,
          'Reuniões',
          actuals.meetings,
          activeGoal.meetingsGoal,
          () => navigate('/activities'),
        )}

        {renderMetric(
          <Target className="w-3.5 h-3.5 text-yellow-400" />,
          'Propostas',
          actuals.proposals,
          activeGoal.proposalsGoal,
          () => navigate('/proposals'),
        )}

        {renderMetric(
          <BarChart className="w-3.5 h-3.5 text-purple-400" />,
          'Vendas',
          actuals.sales,
          activeGoal.salesGoal,
          () => navigate('/pipeline'),
        )}
      </div>

      <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs text-slate-300 flex items-start gap-2">
          <span className="text-orange-400 text-base leading-none">💡</span>
          <span>{getInsights()}</span>
        </p>
      </div>
    </div>
  )
}
