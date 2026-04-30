import { useMemo, useState } from 'react'
import useMainStore from '@/stores/main'
import { Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import LeadHistorySheet from '@/components/LeadHistorySheet'

export default function Calendar() {
  const { activities, opportunities, accounts } = useMainStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [detailsAccountId, setDetailsAccountId] = useState<string | null>(null)

  const scheduledEvents = useMemo(() => {
    const events: any[] = []

    activities.forEach((act) => {
      if (act.type.includes('Reunião') && act.date) {
        const acc = accounts.find((a) => a.id === act.accountId)
        events.push({
          id: act.id,
          title: `Reunião: ${acc?.name || 'Lead'}`,
          date: new Date(act.date),
          type: 'meeting',
          acc,
        })
      }
    })

    opportunities.forEach((opp) => {
      if (
        opp.nextActionDate &&
        opp.nextAction?.toLowerCase().includes('reunião')
      ) {
        const acc = accounts.find((a) => a.id === opp.accountId)
        events.push({
          id: `opp-meet-${opp.id}`,
          title: opp.nextAction,
          date: new Date(opp.nextActionDate),
          type: 'task',
          acc,
        })
      }
    })

    return events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [activities, opportunities, accounts])

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 5 }).map((_, i) =>
    addDays(weekStart, i),
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Calendário de Vendas
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Visão semanal de reuniões e compromissos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addDays(currentDate, -7))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-bold text-sm w-32 text-center">
            {format(weekStart, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addDays(currentDate, 7))}
          >
            <ChevronRight className="w-4 h-4" />
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {weekDays.map((day) => {
          const dayEvents = scheduledEvents.filter((e) =>
            isSameDay(e.date, day),
          )
          const isToday = isSameDay(day, new Date())

          return (
            <Card
              key={day.toISOString()}
              className={cn(
                'min-h-[500px] border-slate-200 bg-white',
                isToday &&
                  'ring-2 ring-orange-500 border-transparent shadow-lg shadow-orange-500/10',
              )}
            >
              <div
                className={cn(
                  'p-4 border-b text-center',
                  isToday ? 'bg-orange-50' : 'bg-slate-50',
                )}
              >
                <div
                  className={cn(
                    'text-xs font-bold uppercase tracking-wider mb-1',
                    isToday ? 'text-orange-600' : 'text-slate-500',
                  )}
                >
                  {format(day, 'EEEE', { locale: ptBR })}
                </div>
                <div
                  className={cn(
                    'text-2xl font-black',
                    isToday ? 'text-orange-600' : 'text-slate-900',
                  )}
                >
                  {format(day, 'dd')}
                </div>
              </div>
              <div className="p-3 space-y-3">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setDetailsAccountId(event.acc?.id || null)}
                    className="p-3 rounded-lg bg-blue-50 border border-blue-100 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 mb-1.5 bg-blue-100/50 w-fit px-1.5 py-0.5 rounded">
                      <Clock className="w-3 h-3" />
                      {format(event.date, 'HH:mm')}
                    </div>
                    <div className="font-bold text-sm text-slate-900 leading-tight mb-1">
                      {event.title}
                    </div>
                    <div className="text-xs text-slate-600 font-medium flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {event.acc?.name}
                    </div>
                  </div>
                ))}
                {dayEvents.length === 0 && (
                  <div className="h-20 flex items-center justify-center text-xs font-medium text-slate-400 border border-dashed border-slate-200 rounded-lg">
                    Livre
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
