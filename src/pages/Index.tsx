import { useMemo } from 'react'
import useMainStore from '@/stores/main'
import { isOverdue, isToday } from '@/lib/crm-utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Play,
  AlertTriangle,
  Building2,
  TrendingDown,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const MiniList = ({
  title,
  items,
  renderItem,
  emptyText,
  icon: Icon,
  headerColor,
}: any) => (
  <Card className="shadow-sm rounded-xl overflow-hidden border-gray-200 bg-white">
    <CardHeader className={`pb-3 ${headerColor} border-b border-gray-100`}>
      <CardTitle className="text-sm font-bold flex items-center">
        <Icon className="w-4 h-4 mr-2" /> {title} ({items.length})
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0 max-h-[250px] overflow-y-auto">
      {items.length === 0 ? (
        <div className="p-6 text-sm text-gray-500 text-center font-medium">
          {emptyText}
        </div>
      ) : (
        <div className="divide-y divide-gray-100">{items.map(renderItem)}</div>
      )}
    </CardContent>
  </Card>
)

export default function Index() {
  const { activities, accounts, completeActivity, opportunities } =
    useMainStore()

  const overdue = useMemo(
    () => activities.filter((a) => !a.completed && isOverdue(a.date)),
    [activities],
  )
  const todayActs = useMemo(
    () => activities.filter((a) => !a.completed && isToday(a.date)),
    [activities],
  )
  const priorityA = useMemo(
    () =>
      accounts.filter(
        (a) =>
          a.priority === 'A' &&
          (!a.lastTouchDate || isOverdue(a.lastTouchDate)),
      ),
    [accounts],
  )
  const newLeads = useMemo(
    () =>
      accounts.filter((a) => a.status === 'Novo' || a.status === 'Em pesquisa'),
    [accounts],
  )
  const noActionAccs = useMemo(
    () => accounts.filter((a) => !a.nextActionDate),
    [accounts],
  )
  const stalledOpps = useMemo(
    () => opportunities.filter((o) => !o.stage.includes('Fechado')),
    [opportunities],
  )

  const renderAct = (act: any) => {
    const acc = accounts.find((a) => a.id === act.accountId)
    return (
      <div
        key={act.id}
        className="p-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
      >
        <div>
          <div className="font-bold text-sm mb-1 text-black">{acc?.name}</div>
          <div className="text-xs text-gray-600 flex items-center gap-2">
            <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 font-semibold">
              {act.type}
            </span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(act.date).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => completeActivity(act.id)}
          className="h-8 w-8 p-0 rounded-full text-green-600 hover:bg-green-50"
        >
          <CheckCircle2 className="w-5 h-5" />
        </Button>
      </div>
    )
  }

  const renderAcc = (acc: any) => (
    <div
      key={acc.id}
      className="p-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
    >
      <div>
        <div className="font-bold text-sm text-black">{acc.name}</div>
        <div className="text-xs text-gray-500 mt-1 font-medium">
          {acc.status}
        </div>
      </div>
      <Link to="/activities">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs rounded font-semibold text-black border-gray-300"
        >
          Ação
        </Button>
      </Link>
    </div>
  )

  const renderOpp = (opp: any) => (
    <div
      key={opp.id}
      className="p-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
    >
      <div>
        <div className="font-bold text-sm text-black">{opp.name}</div>
        <div className="text-xs text-gray-500 mt-1 font-medium">
          Fase: {opp.stage}
        </div>
      </div>
      <Link to="/pipeline">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs rounded font-semibold text-black border-gray-300"
        >
          Ver
        </Button>
      </Link>
    </div>
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-black text-black">Visão "Hoje"</h1>
        <p className="text-gray-500 mt-1 font-medium">
          Foco na execução. Prioridades e gargalos da operação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MiniList
          title="Atrasadas (Follow-ups vencidos)"
          icon={AlertCircle}
          headerColor="bg-red-50 text-red-800"
          items={overdue}
          emptyText="Zero atrasos!"
          renderItem={renderAct}
        />
        <MiniList
          title="Para Hoje"
          icon={Play}
          headerColor="bg-yellow-50 text-yellow-800"
          items={todayActs}
          emptyText="Livre por hoje."
          renderItem={renderAct}
        />
        <MiniList
          title="Contas sem Próxima Ação"
          icon={AlertTriangle}
          headerColor="bg-gray-100 text-gray-800"
          items={noActionAccs}
          emptyText="Todas as contas têm dono."
          renderItem={renderAcc}
        />

        <MiniList
          title="Prioridade A (S/ Atividade)"
          icon={AlertTriangle}
          headerColor="bg-blue-50 text-blue-800"
          items={priorityA}
          emptyText="Prioridades A em dia."
          renderItem={renderAcc}
        />
        <MiniList
          title="Leads Novos e Pesquisa"
          icon={Building2}
          headerColor="bg-blue-50 text-blue-800"
          items={newLeads}
          emptyText="Nenhum lead novo."
          renderItem={renderAcc}
        />
        <MiniList
          title="Oportunidades Estagnadas"
          icon={TrendingDown}
          headerColor="bg-gray-100 text-gray-800"
          items={stalledOpps}
          emptyText="Pipeline fluindo."
          renderItem={renderOpp}
        />
      </div>
    </div>
  )
}
