import useMainStore from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/crm-utils'

export default function Reports() {
  const { accounts, activities, opportunities } = useMainStore()

  const funnelData = [
    { stage: 'Total Contas', count: accounts.length },
    {
      stage: 'Contatados',
      count:
        activities.length > 0
          ? accounts.length - (accounts.length > 1 ? 1 : 0)
          : accounts.length,
    },
    { stage: 'Oportunidades', count: opportunities.length },
    {
      stage: 'Ganhos',
      count: opportunities.filter((o) => o.stage === 'Fechado ganho').length,
    },
  ]

  const chartConfig = {
    count: { label: 'Volume', color: 'hsl(var(--primary))' },
  }

  const wonValue = opportunities
    .filter((o) => o.stage === 'Fechado ganho')
    .reduce((s, o) => s + o.total, 0)
  const pipelineValue = opportunities
    .filter((o) => !o.stage.includes('Fechado'))
    .reduce((s, o) => s + o.total, 0)

  const leadsThisMonth = accounts.length // mock assuming all are this month for prototype

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-black">Dashboard & KPIs</h1>
        <p className="text-gray-500 mt-1 font-medium">
          Métricas e performance da operação comercial
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="shadow-sm border-gray-200 rounded-xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Leads no Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-black">
              {leadsThisMonth}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 rounded-xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Volume de Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-black">
              {activities.length}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 rounded-xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Pipeline Ativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-black">
              {formatCurrency(pipelineValue)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 rounded-xl bg-black text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Total Ganho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">
              {formatCurrency(wonValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-200 overflow-hidden rounded-xl bg-white">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
          <CardTitle className="text-sm font-black text-black">
            Funil de Conversão (Volume)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8 pb-4">
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelData}
                margin={{ top: 0, right: 20, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-gray-200"
                />
                <XAxis
                  dataKey="stage"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  fontSize={12}
                  className="fill-gray-600 font-bold"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  className="fill-gray-400 font-bold"
                />
                <ChartTooltip
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="count"
                  fill="#000"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
