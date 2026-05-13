import { Card, CardContent } from '@/components/ui/card'
import {
  Users,
  Target,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { formatCurrency } from '@/lib/crm-utils'

export function ReportsKPIs({ kpis }: { kpis: any }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <KPICard
        title="Total de Leads"
        value={kpis.totalLeads}
        icon={<Users />}
        color="text-blue-600"
        bg="bg-blue-50"
      />
      <KPICard
        title="Taxa de Conversão"
        value={`${kpis.conversionRate.toFixed(1)}%`}
        icon={<Target />}
        color="text-emerald-600"
        bg="bg-emerald-50"
      />
      <KPICard
        title="Propostas Enviadas"
        value={kpis.proposalsSent}
        icon={<TrendingUp />}
        color="text-orange-600"
        bg="bg-orange-50"
      />
      <KPICard
        title="Vendas Fechadas"
        value={kpis.totalSales}
        icon={<CheckCircle2 />}
        color="text-indigo-600"
        bg="bg-indigo-50"
      />
      <KPICard
        title="Ticket Médio"
        value={formatCurrency(kpis.ticketMedio)}
        icon={<DollarSign />}
        color="text-violet-600"
        bg="bg-violet-50"
      />
      <KPICard
        title="MRR Adicionado"
        value={formatCurrency(kpis.mrr)}
        icon={<DollarSign />}
        color="text-emerald-600"
        bg="bg-emerald-50"
      />
      <KPICard
        title="Reuniões Realizadas"
        value={kpis.meetings}
        icon={<Calendar />}
        color="text-pink-600"
        bg="bg-pink-50"
      />
      <KPICard
        title="Leads Atrasados"
        value={kpis.delayedLeads}
        icon={<AlertCircle />}
        color="text-red-600"
        bg="bg-red-50"
      />
    </div>
  )
}

function KPICard({ title, value, icon, color, bg }: any) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${bg} ${color}`}>{icon}</div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  )
}
