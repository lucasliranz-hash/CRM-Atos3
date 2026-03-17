import { useMemo } from 'react'
import useMainStore from '@/stores/main'
import { isOverdue, isToday } from '@/lib/crm-utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Activity as ActivityIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Index() {
  const { activities, accounts, completeActivity } = useMainStore()

  const overdue = useMemo(
    () => activities.filter((a) => !a.completed && isOverdue(a.date)),
    [activities],
  )
  const todayActs = useMemo(
    () => activities.filter((a) => !a.completed && isToday(a.date)),
    [activities],
  )
  const noActionAccounts = useMemo(
    () => accounts.filter((a) => !a.nextActionDate),
    [accounts],
  )

  const renderActivity = (act: any, type: 'overdue' | 'today') => {
    const acc = accounts.find((a) => a.id === act.accountId)
    return (
      <div
        key={act.id}
        className="flex items-center justify-between p-3 bg-white border rounded-xl mb-2 shadow-sm transition-all hover:shadow-md"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              className={
                type === 'overdue'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }
            >
              {act.type}
            </Badge>
            <span className="text-sm font-semibold text-gray-900">
              {acc?.name}
            </span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center">
            <Clock className="w-3 h-3 mr-1" />{' '}
            {new Date(act.date).toLocaleDateString()}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => completeActivity(act.id)}
          className="rounded-full hover:bg-green-50 hover:text-green-700 hover:border-green-200"
        >
          <CheckCircle2 className="w-4 h-4 mr-1" /> Feito
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Visão "Today"</h1>
        <p className="text-muted-foreground text-lg">
          Foque na execução. Aqui estão as prioridades do dia para gerar
          oportunidades.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <Card className="border-red-200 shadow-sm bg-red-50/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center text-red-800">
                <AlertCircle className="w-5 h-5 mr-2" /> Atividades Atrasadas (
                {overdue.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 max-h-[350px] overflow-y-auto pr-2">
              {overdue.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6 bg-white/50 rounded-xl">
                  Tudo em dia!
                </p>
              ) : (
                overdue.map((a) => renderActivity(a, 'overdue'))
              )}
            </CardContent>
          </Card>

          <Card className="border-yellow-200 shadow-sm bg-yellow-50/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center text-yellow-800">
                <ActivityIcon className="w-5 h-5 mr-2" /> Para Hoje (
                {todayActs.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 max-h-[350px] overflow-y-auto pr-2">
              {todayActs.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6 bg-white/50 rounded-xl">
                  Nenhuma atividade para hoje.
                </p>
              ) : (
                todayActs.map((a) => renderActivity(a, 'today'))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 rounded-t-xl border-b border-gray-100 pb-4">
              <CardTitle className="text-lg flex items-center text-gray-800">
                <Calendar className="w-5 h-5 mr-2 text-gray-500" /> Contas sem
                Próxima Ação ({noActionAccounts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 max-h-[730px] overflow-y-auto pr-2 bg-white">
              {noActionAccounts.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  Todas as contas têm ação definida.
                </p>
              ) : (
                noActionAccounts.map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between p-4 border-b last:border-0 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-sm block mb-1 text-gray-900">
                        {a.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs text-gray-500"
                      >
                        {a.status}
                      </Badge>
                    </div>
                    <Link to={`/activities`}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full"
                      >
                        Agendar Ação
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
