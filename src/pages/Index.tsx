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

const MiniList = ({ title, items, renderItem, emptyText, icon: Icon }: any) => (
  <Card className="shadow-sm rounded-xl overflow-hidden border-gray-200 bg-white">
    <CardHeader className="pb-3 border-b border-gray-100 bg-white">
      <CardTitle className="text-sm font-bold flex items-center text-black">
        <Icon className="w-4 h-4 mr-2 text-gray-500" /> {title}{' '}
        <span className="ml-2 text-gray-400 font-medium text-xs">
          ({items.length})
        </span>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0 max-h-[280px] overflow-y-auto">
      {items.length === 0 ? (
        <div className="p-6 text-sm text-gray-400 text-center font-medium">
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
    () =>
      opportunities.filter(
        (o) =>
          !o.stage.includes('Fechado') &&
          (!o.nextActionDate || isOverdue(o.nextActionDate)),
      ),
    [opportunities],
  )

  const renderAct = (act: any) => {
    const acc = accounts.find((a) => a.id === act.accountId)
    return (
      <div
        key={act.id}
        className="p-3 hover:bg-gray-50 flex items-center justify-between transition-colors group"
      >
        <div>
          <div className="font-bold text-sm mb-0.5 text-black">{acc?.name}</div>
          <div className="text-xs text-gray-500 flex items-center gap-2 font-medium">
            <span className="bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-gray-700">
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
          className="h-8 w-8 p-0 rounded-full text-gray-300 hover:text-black hover:bg-gray-100 transition-colors"
          title="Concluir"
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
        <div className="text-xs text-gray-500 mt-0.5 font-medium">
          {acc.status} • Prio {acc.priority}
        </div>
      </div>
      <Link to="/activities">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs rounded font-bold text-black border-gray-200 hover:bg-black hover:text-white transition-colors"
        >
          Ação
        </Button>
      </Link>
    </div>
  )

  const renderOpp = (opp: any) => {
    const acc = accounts.find((a) => a.id === opp.accountId)
    return (
      <div
        key={opp.id}
        className="p-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
      >
        <div>
          <div className="font-bold text-sm text-black">{opp.name}</div>
          <div className="text-xs text-gray-500 mt-0.5 font-medium">
            {acc?.name} • {opp.stage}
          </div>
        </div>
        <Link to="/pipeline">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs rounded font-bold text-black border-gray-200 hover:bg-black hover:text-white transition-colors"
          >
            Ação
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-black text-black tracking-tight">
          Atos3 CRM - Visão Hoje
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          Ferramenta de execução diária. Foco absoluto no follow-up e no próximo
          passo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MiniList
          title="Pendências Prioritárias"
          icon={AlertCircle}
          items={overdue}
          emptyText="Zero atrasos! Você está no controle."
          renderItem={renderAct}
        />
        <MiniList
          title="Agenda do Dia"
          icon={Play}
          items={todayActs}
          emptyText="Nenhuma ação agendada para hoje."
          renderItem={renderAct}
        />
        <MiniList
          title="Anti-Esquecimento (Sem Ação)"
          icon={AlertTriangle}
          items={noActionAccs}
          emptyText="Todas as contas possuem próxima ação definida."
          renderItem={renderAcc}
        />

        <MiniList
          title="Prioridade A (S/ Atividade)"
          icon={AlertTriangle}
          items={priorityA}
          emptyText="Prioridades A estão engajadas."
          renderItem={renderAcc}
        />
        <MiniList
          title="Novos Leads (S/ Contato)"
          icon={Building2}
          items={newLeads}
          emptyText="Nenhum lead novo pendente."
          renderItem={renderAcc}
        />
        <MiniList
          title="Oportunidades Paradas"
          icon={TrendingDown}
          items={stalledOpps}
          emptyText="Pipeline com follow-up em dia."
          renderItem={renderOpp}
        />
      </div>
    </div>
  )
}
