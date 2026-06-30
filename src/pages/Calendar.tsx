import { useMemo, useState } from 'react'
import useMainStore from '@/stores/main'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { isGanhoOrCustomer, isLostLead } from '@/lib/crm-utils'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import LeadHistorySheet from '@/components/LeadHistorySheet'

export default function CalendarView() {
  const { activities, accounts, orders } = useMainStore() as any
  const [currentDate, setCurrentDate] = useState(new Date())
  const [detailsAccountId, setDetailsAccountId] = useState<string | null>(null)

  const scheduledEvents = useMemo(() => {
    const events: any[] = []

    const activeAccounts = accounts.filter(
      (a: any) => !isGanhoOrCustomer(a) && !isLostLead(a),
    )
    const activeAccountIds = new Set(activeAccounts.map((a: any) => a.id))

    activities.forEach((act) => {
      if (act.date && !act.completed && activeAccountIds.has(act.accountId)) {
        const acc = activeAccounts.find((a: any) => a.id === act.accountId)
        events.push({
          id: `act-${act.id}`,
          title: `${act.type}: ${acc?.name || 'Lead'}`,
          date: new Date(act.date),
          type: 'activity',
          color: act.type.includes('Reunião')
            ? 'bg-purple-100 text-purple-700 border-purple-200'
            : 'bg-blue-100 text-blue-700 border-blue-200',
          acc,
        })
      }
    })

    activeAccounts.forEach((acc: any) => {
      if (acc.nextActionDate) {
        events.push({
          id: `acc-next-${acc.id}`,
          title: acc.nextAction || 'Follow-up',
          date: new Date(acc.nextActionDate),
          type: 'task',
          color: 'bg-orange-100 text-orange-700 border-orange-200',
          acc,
        })
      }
    })

    orders?.forEach((ord: any) => {
      events.push({
        id: `ord-${ord.id}`,
        title: `Pedido: ${ord.order_number}`,
        date: new Date(ord.created_at),
        type: 'order',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        acc: accounts.find((a: any) => a.id === ord.account_id),
      })
    })

    return events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [activities, accounts, orders])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Calendário
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Visão mensal de reuniões e compromissos.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <span className="font-bold text-sm w-36 text-center capitalize text-slate-800">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </Button>
        </div>
      </div>

      {detailsAccountId && (
        <LeadHistorySheet
          account={accounts.find((a) => a.id === detailsAccountId) || null}
          open={!!detailsAccountId}
          onOpenChange={(open) => !open && setDetailsAccountId(null)}
        />
      )}

      <Card className="rounded-[10px] overflow-hidden bg-white shadow-sm border-slate-200">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
            <div
              key={d}
              className="p-3 text-center text-xs font-black text-slate-500 uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr">
          {calendarDays.map((day) => {
            const dayEvents = scheduledEvents.filter((e) =>
              isSameDay(e.date, day),
            )
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'min-h-[120px] p-2 border-b border-r border-slate-100 transition-colors hover:bg-slate-50',
                  !isCurrentMonth && 'bg-slate-50/50 opacity-50',
                  isToday && 'bg-orange-50/30',
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={cn(
                      'text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full',
                      isToday ? 'bg-[#FF6A00] text-white' : 'text-slate-700',
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => setDetailsAccountId(event.acc?.id || null)}
                      className={cn(
                        'text-[10px] font-bold p-1.5 rounded border truncate cursor-pointer',
                        event.color,
                      )}
                      title={event.title}
                    >
                      {format(event.date, 'HH:mm')} {event.title}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
