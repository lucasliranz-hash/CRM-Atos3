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
      count: activities.length > 0 ? accounts.length - 1 : accounts.length,
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
  const pipelineValue = opportunities.reduce((s, o) => s + o.total, 0)

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Estratégico
        </h1>
        <p className="text-muted-foreground">
          Métricas e performance da operação comercial
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-gray-500">
              Leads Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {accounts.length}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-gray-500">
              Atividades Logadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {activities.length}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-gray-500">
              Valor em Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(pipelineValue)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200 bg-green-50/50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-green-700">
              Total Ganho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {formatCurrency(wonValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-200 overflow-hidden">
        <CardHeader className="bg-gray-50 border-b pb-4">
          <CardTitle className="text-lg text-gray-800">
            Funil de Conversão (Volume)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelData}
                margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
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
                  className="fill-gray-600 font-medium"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  className="fill-gray-400"
                />
                <ChartTooltip
                  cursor={{ fill: 'transparent' }}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="count"
                  fill="#000"
                  radius={[6, 6, 0, 0]}
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
