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
  AreaChart,
  Area,
} from 'recharts'

export default function Reports() {
  const { accounts, activities, opportunities } = useMainStore()

  const funnelData = [
    {
      stage: 'Prospecção',
      count: opportunities.filter((o) =>
        ['Leads Mapeados', 'Conexão Enviada'].includes(o.stage),
      ).length,
    },
    {
      stage: 'Contato',
      count: opportunities.filter((o) =>
        ['Primeiro Contato', 'Follow-up', 'Em Conversa'].includes(o.stage),
      ).length,
    },
    {
      stage: 'Reunião',
      count: opportunities.filter((o) => o.stage === 'Reunião').length,
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

  const weeklyMeetings = [
    { day: 'Seg', meetings: 2 },
    { day: 'Ter', meetings: 4 },
    { day: 'Qua', meetings: 6 },
    { day: 'Qui', meetings: 4 },
    { day: 'Sex', meetings: 3 },
    { day: 'Sáb', meetings: 1 },
    { day: 'Dom', meetings: 0 },
  ]

  const chartConfig = {
    count: { label: 'Oportunidades', color: 'hsl(var(--primary))' },
    meetings: { label: 'Reuniões', color: 'hsl(var(--primary))' },
  }

  const totalAccounts = accounts.length
  const wonOpps = opportunities.filter(
    (o) => o.stage === 'Fechado Ganho',
  ).length
  const winRate =
    opportunities.length > 0
      ? Math.round((wonOpps / opportunities.length) * 100)
      : 0

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Dashboard & Performance
        </h1>
        <p className="text-slate-500 mt-1 font-medium">
          Métricas focadas em execução e resultado
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="shadow-sm border-slate-200 rounded-[10px] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Total Leads (Mapeados)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">
              {totalAccounts}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 rounded-[10px] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Taxa de Conversão (Win)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{winRate}%</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 rounded-[10px] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Reuniões Agendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">
              {activities.filter((a) => a.type.includes('Reunião')).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200 overflow-hidden rounded-[10px] bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="text-sm font-black text-slate-900">
              Leads por Etapa (Funil)
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
                    className="stroke-slate-100"
                  />
                  <XAxis
                    dataKey="stage"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={12}
                    className="fill-slate-600 font-bold"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    className="fill-slate-400 font-bold"
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    content={<ChartTooltipContent />}
                  />
                  <Bar
                    dataKey="count"
                    fill="#0D1B2A"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 overflow-hidden rounded-[10px] bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="text-sm font-black text-slate-900">
              Reuniões Agendadas (Semanal)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 pb-4">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyMeetings}
                  margin={{ top: 0, right: 20, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorMeetings"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF6A00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    className="stroke-slate-100"
                  />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={12}
                    className="fill-slate-600 font-bold"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    className="fill-slate-400 font-bold"
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="meetings"
                    stroke="#FF6A00"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorMeetings)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
