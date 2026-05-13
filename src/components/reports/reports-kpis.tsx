import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/crm-utils'
import {
  ArrowUpRight,
  TrendingUp,
  Users,
  Target,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
} from 'lucide-react'

export function ReportsKPIs({ kpis }: { kpis: any }) {
  const items = [
    {
      title: 'Total de Leads',
      value: kpis.totalLeads,
      icon: Users,
      desc: 'No período filtrado',
    },
    {
      title: 'Taxa de Conversão',
      value: `${kpis.conversionRate.toFixed(1)}%`,
      icon: Target,
      desc: 'Win rate geral',
    },
    {
      title: 'Propostas Enviadas',
      value: kpis.proposalsSent,
      icon: FileText,
      desc: 'No período filtrado',
    },
    {
      title: 'Vendas Fechadas',
      value: kpis.totalSales,
      icon: CheckCircle,
      desc: 'Negócios ganhos',
    },
    {
      title: 'Receita (MRR)',
      value: formatCurrency(kpis.mrr),
      icon: TrendingUp,
      desc: 'Adicionado no período',
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(kpis.ticketMedio),
      icon: DollarSign,
      desc: 'Por cliente fechado',
    },
    {
      title: 'Reuniões Realizadas',
      value: kpis.meetings,
      icon: Clock,
      desc: 'No período filtrado',
    },
    {
      title: 'Leads Atrasados',
      value: kpis.delayedLeads,
      icon: AlertCircle,
      desc: 'Base geral sem ação',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <Card
          key={i}
          className="bg-white border-slate-200 hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-black text-slate-900">
              {item.value}
            </div>
            <p className="text-xs font-medium text-slate-500 mt-2 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              {item.desc}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
