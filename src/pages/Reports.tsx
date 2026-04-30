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
import { formatCurrency, isOverdue } from '@/lib/crm-utils'

export default function Reports() {
  const { accounts, activities, opportunities } = useMainStore()

  const funnelData = [
    {
      stage: 'Prospecção',
      count: opportunities.filter((o) => o.stage === 'Prospecção').length,
    },
    {
      stage: 'Qualificação',
      count: opportunities.filter((o) => o.stage === 'Qualificação').length,
    },
    {
      stage: 'Proposta',
      count: opportunities.filter((o) => o.stage === 'Proposta').length,
    },
    {
      stage: 'Ganhos',
      count: opportunities.filter((o) => o.stage === 'Fechado Ganho').length,
    },
  ]

  const chartConfig = {
    count: { label: 'Oportunidades', color: 'hsl(var(--primary))' },
  }

  const wonValue = opportunities
    .filter((o) => o.stage === 'Fechado Ganho')
    .reduce((s, o) => s + o.total, 0)
  const pipelineValue = opportunities
    .filter((o) => !o.stage.includes('Fechado'))
    .reduce((s, o) => s + o.total, 0)

  const pendingFollowups = accounts.filter(
    (a) => !a.nextActionDate || isOverdue(a.nextActionDate),
  ).length
  const totalAccounts = accounts.length
  const followUpRate =
    totalAccounts > 0
      ? Math.round(((totalAccounts - pendingFollowups) / totalAccounts) * 100)
      : 100

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-black tracking-tight">
          Dashboard & Performance
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          Métricas focadas em execução e resultado
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="shadow-sm border-gray-200 rounded-xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Total Leads (Mapeados)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-black">
              {totalAccounts}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 rounded-xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Taxa de Conversão (Win)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-black">
              {opportunities.length > 0
                ? Math.round(
                    (opportunities.filter((o) => o.stage === 'Fechado Ganho')
                      .length /
                      opportunities.length) *
                      100,
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 rounded-xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Reuniões Agendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-black">
              {activities.filter((a) => a.type.includes('Reunião')).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-200 overflow-hidden rounded-xl bg-white">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
          <CardTitle className="text-sm font-black text-black">
            Conversão do Pipeline
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
                  className="stroke-gray-100"
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
                  allowDecimals={false}
                />
                <ChartTooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
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
