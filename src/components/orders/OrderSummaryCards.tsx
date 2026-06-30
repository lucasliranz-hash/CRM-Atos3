import { Card, CardContent } from '@/components/ui/card'
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  CalendarDays,
  Clock,
  Package,
} from 'lucide-react'
import { formatCurrency } from '@/lib/crm-utils'
import { format } from 'date-fns'

interface Props {
  orders: any[]
}

export function OrderSummaryCards({ orders }: Props) {
  const total = orders.length
  const totalValue = orders.reduce(
    (acc, o) => acc + Number(o.total_amount || 0),
    0,
  )
  const avgTicket = total > 0 ? totalValue / total : 0
  const now = new Date()

  const monthCount = orders.filter((o) => {
    if (!o.created_at) return false
    const d = new Date(o.created_at)
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    )
  }).length

  const todayCount = orders.filter((o) => {
    if (!o.created_at) return false
    return new Date(o.created_at).toDateString() === now.toDateString()
  }).length

  const lastOrder = [...orders]
    .filter((o) => o.created_at)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )[0]

  const cards = [
    {
      label: 'Total de Pedidos',
      value: total.toString(),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Valor Total',
      value: formatCurrency(totalValue),
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Ticket Médio',
      value: formatCurrency(avgTicket),
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Pedidos este mês',
      value: monthCount.toString(),
      icon: CalendarDays,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Pedidos hoje',
      value: todayCount.toString(),
      icon: Clock,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
    },
    {
      label: 'Último pedido',
      value: lastOrder
        ? `${lastOrder.order_number} • ${format(new Date(lastOrder.created_at), 'dd/MM')}`
        : 'Nenhum',
      icon: Package,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => (
        <Card key={card.label} className="border-slate-200 shadow-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-md ${card.bg}`}>
                <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
              </div>
            </div>
            <p className="text-lg font-black text-slate-900 truncate">
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
