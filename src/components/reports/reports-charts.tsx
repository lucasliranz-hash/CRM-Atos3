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
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Inbox } from 'lucide-react'

const COLORS = [
  '#0D1B2A',
  '#1B263B',
  '#415A77',
  '#778DA9',
  '#FF6A00',
  '#FF8C33',
]

export function ReportsCharts({ charts }: { charts: any }) {
  const chartConfig = {
    count: { label: 'Quantidade', color: 'hsl(var(--primary))' },
  }

  const hasFunnelData = charts.funnelData.some((d: any) => d.count > 0)
  const hasSourceData = charts.sourceData.some((d: any) => d.value > 0)
  const hasPerfData = charts.performanceData.some((d: any) => d.value > 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="rounded-xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-sm font-black text-slate-800">
            Funil Comercial (Etapas)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!hasFunnelData ? (
            <div className="h-[260px] flex flex-col items-center justify-center text-slate-400">
              <Inbox className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm font-medium">
                Não há leads no período selecionado
              </p>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={charts.funnelData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 40, bottom: 0 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    strokeDasharray="3 3"
                    className="stroke-slate-100"
                  />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="stage"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    className="font-bold fill-slate-600"
                    width={100}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#FF6A00"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-sm font-black text-slate-800">
            Origem dos Leads
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!hasSourceData ? (
            <div className="h-[260px] flex flex-col items-center justify-center text-slate-400">
              <Inbox className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm font-medium">Não há origens para exibir</p>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {charts.sourceData.map((_: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 rounded-xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-sm font-black text-slate-800">
            Performance Comercial (Atividades)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!hasPerfData ? (
            <div className="h-[260px] flex flex-col items-center justify-center text-slate-400">
              <Inbox className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm font-medium">
                Sem atividades registradas no período
              </p>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={charts.performanceData}
                  margin={{ top: 0, right: 20, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    className="stroke-slate-100"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    className="font-bold fill-slate-600"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    fontSize={12}
                    className="font-bold fill-slate-400"
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#0D1B2A"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
