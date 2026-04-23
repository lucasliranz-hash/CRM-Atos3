import { useMemo, useState, useEffect } from 'react'
import useMainStore from '@/stores/main'
import { isOverdue, isToday, formatCurrency } from '@/lib/crm-utils'
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
  Activity as ActivityIcon,
  Briefcase,
  Target,
  ArrowRight,
  Calendar as CalendarIcon,
  RefreshCw,
  Video,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Calendar } from '@/components/ui/calendar'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const MiniList = ({
  title,
  items,
  renderItem,
  emptyText,
  icon: Icon,
  badgeColor = 'bg-gray-100 text-gray-600',
}: any) => (
  <Card className="shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 rounded-2xl overflow-hidden border-gray-100 bg-white flex flex-col h-full group">
    <CardHeader className="py-4 px-5 border-b border-gray-50/80 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <CardTitle className="text-sm font-black flex items-center justify-between text-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gray-50 text-gray-500 group-hover:bg-black group-hover:text-white transition-colors duration-300">
            <Icon className="w-4 h-4" />
          </div>
          {title}
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}`}
        >
          {items.length}
        </span>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0 flex-1 overflow-y-auto max-h-[360px] custom-scrollbar bg-white">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-sm text-gray-400 font-semibold px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6 text-gray-300" />
          </div>
          {emptyText}
        </div>
      ) : (
        <div className="divide-y divide-gray-50">{items.map(renderItem)}</div>
      )}
    </CardContent>
  </Card>
)

export default function Index() {
  const { activities, accounts, completeActivity, opportunities } =
    useMainStore()
  const { profile } = useAuth()
  const { toast } = useToast()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [syncing, setSyncing] = useState(false)
  const [notifiedActs, setNotifiedActs] = useState<Set<string>>(new Set())

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      activities.forEach((act) => {
        if (
          !act.completed &&
          (act.type.includes('Reunião') || act.type === 'Diagnóstico')
        ) {
          const actDate = new Date(act.date)
          const diffMs = actDate.getTime() - now.getTime()
          const diffMins = Math.round(diffMs / 60000)

          if (diffMins === 15 && !notifiedActs.has(act.id)) {
            const acc = accounts.find((a) => a.id === act.accountId)
            toast({
              title: '⏰ Lembrete de Reunião!',
              description: `Sua atividade com ${acc?.name || 'Cliente'} começará em 15 minutos.`,
              duration: 10000,
            })
            setNotifiedActs((prev) => new Set(prev).add(act.id))
          }
        }
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [activities, accounts, toast, notifiedActs])

  const handleSyncCalendar = async () => {
    setSyncing(true)
    try {
      const { error } = await supabase.functions.invoke('google-calendar', {
        body: { action: 'syncEvents' },
      })
      if (error) throw error
      toast({
        title: 'Agenda sincronizada!',
        description: 'Seus eventos foram atualizados com o Google Agenda.',
      })
    } catch (err: any) {
      toast({
        title: 'Erro de sincronização',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setSyncing(false)
    }
  }

  const overdue = useMemo(
    () => activities.filter((a) => !a.completed && isOverdue(a.date)),
    [activities],
  )
  const todayActs = useMemo(
    () => activities.filter((a) => !a.completed && isToday(a.date)),
    [activities],
  )
  const selectedDateActs = useMemo(() => {
    if (!selectedDate) return []
    return activities
      .filter((a) => {
        const d = new Date(a.date)
        return (
          d.getDate() === selectedDate.getDate() &&
          d.getMonth() === selectedDate.getMonth() &&
          d.getFullYear() === selectedDate.getFullYear()
        )
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [activities, selectedDate])

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
      accounts.filter(
        (a) =>
          a.status === 'Novo' ||
          a.status === 'Em pesquisa' ||
          a.status === 'Em prospecção',
      ),
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

  const pipelineTotal = useMemo(
    () =>
      opportunities
        .filter((o) => !o.stage.includes('Fechado'))
        .reduce((s, o) => s + o.total, 0),
    [opportunities],
  )

  const renderAct = (act: any) => {
    const acc = accounts.find((a) => a.id === act.accountId)
    return (
      <div
        key={act.id}
        className="p-4 hover:bg-slate-50/80 flex items-center justify-between transition-colors group relative"
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="font-bold text-sm mb-1 text-gray-900 truncate">
            {acc?.name || 'Conta Removida'}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-2 font-semibold">
            <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md text-gray-700 shadow-sm">
              {act.type}
            </span>
            <span className="flex items-center text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(act.date).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => completeActivity(act.id)}
          className="h-9 w-9 p-0 rounded-xl text-gray-400 border-gray-200 hover:text-green-600 hover:border-green-600 hover:bg-green-50 transition-all md:opacity-0 group-hover:opacity-100 shrink-0 shadow-sm"
          title="Marcar como Concluído"
        >
          <CheckCircle2 className="w-5 h-5" />
        </Button>
      </div>
    )
  }

  const renderAgendaAct = (act: any) => {
    const acc = accounts.find((a) => a.id === act.accountId)
    const timeStr = new Date(act.date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

    return (
      <div
        key={act.id}
        className={cn(
          'p-4 border-b border-gray-50 flex items-start gap-4 transition-colors hover:bg-slate-50/50 group',
          act.completed && 'opacity-60',
        )}
      >
        <div className="pt-1 text-center min-w-[60px]">
          <span className="text-sm font-black text-gray-900 block">
            {timeStr}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                act.completed
                  ? 'bg-green-100 text-green-700'
                  : isOverdue(act.date)
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700',
              )}
            >
              {act.completed
                ? 'Concluído'
                : isOverdue(act.date)
                  ? 'Atrasado'
                  : act.type}
            </span>
            {act.meet_link && (
              <a
                href={act.meet_link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs font-bold bg-blue-50 px-2 py-0.5 rounded"
              >
                <Video className="w-3 h-3" /> Meet
              </a>
            )}
          </div>
          <div className="font-bold text-sm text-gray-900 truncate">
            {acc?.name || 'Conta Removida'}
          </div>
        </div>
        {!act.completed && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => completeActivity(act.id)}
            className="h-9 w-9 p-0 rounded-xl text-gray-400 border-gray-200 hover:text-green-600 hover:border-green-600 hover:bg-green-50 transition-all shadow-sm shrink-0 md:opacity-0 group-hover:opacity-100"
            title="Marcar como Concluído"
          >
            <CheckCircle2 className="w-5 h-5" />
          </Button>
        )}
      </div>
    )
  }

  const renderAcc = (acc: any) => (
    <div
      key={acc.id}
      className="p-4 hover:bg-slate-50/80 flex items-center justify-between transition-colors group"
    >
      <div className="flex-1 min-w-0 pr-4">
        <div className="font-bold text-sm text-gray-900 truncate">
          {acc.name}
        </div>
        <div className="text-xs text-gray-500 mt-1 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
          <span className="truncate">{acc.status}</span>
          <span className="text-gray-300 shrink-0">•</span>
          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-black shrink-0 text-gray-600">
            Prio {acc.priority}
          </span>
        </div>
      </div>
      <Link to="/accounts" className="shrink-0">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 rounded-lg text-gray-400 hover:bg-black hover:text-white transition-all md:opacity-0 group-hover:opacity-100"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  )

  const renderOpp = (opp: any) => {
    const acc = accounts.find((a) => a.id === opp.accountId)
    return (
      <div
        key={opp.id}
        className="p-4 hover:bg-slate-50/80 flex items-center justify-between transition-colors group"
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="font-bold text-sm text-gray-900 truncate">
            {opp.name}
          </div>
          <div className="text-xs text-gray-500 mt-1 font-semibold flex items-center gap-1.5">
            <span className="truncate max-w-[100px]">{acc?.name}</span>
            <span className="text-gray-300 shrink-0">•</span>
            <span className="font-black text-black shrink-0">
              {formatCurrency(opp.total)}
            </span>
          </div>
        </div>
        <Link to="/pipeline" className="shrink-0">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-lg text-gray-400 hover:bg-black hover:text-white transition-all md:opacity-0 group-hover:opacity-100"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Welcome */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Olá, {profile?.nome?.split(' ')[0] || 'Líder'} 👋
          </h1>
          <p className="text-gray-500 mt-1.5 font-semibold text-sm md:text-base">
            Aqui está o resumo da sua execução diária. Foco no próximo passo!
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link to="/pipeline" className="w-full sm:w-auto">
            <Button className="w-full bg-white border border-gray-200 text-black hover:bg-gray-50 rounded-xl shadow-sm font-bold text-sm h-11 px-5">
              <Target className="w-4 h-4 mr-2" /> Ver Pipeline
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] bg-gradient-to-br from-white to-slate-50/50">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
              Pipeline Ativo
            </p>
            <h3 className="text-2xl font-black text-gray-900">
              {formatCurrency(pipelineTotal)}
            </h3>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] bg-gradient-to-br from-white to-slate-50/50 relative overflow-hidden">
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                <AlertCircle className="w-5 h-5" />
              </div>
              {overdue.length > 0 && (
                <span className="bg-red-100 text-red-700 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider animate-pulse border border-red-200">
                  Ação Necessária
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
              Atrasados
            </p>
            <h3 className="text-2xl font-black text-gray-900">
              {overdue.length}{' '}
              <span className="text-sm text-gray-400 font-semibold normal-case">
                tarefas
              </span>
            </h3>
          </CardContent>
          {overdue.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-400" />
          )}
        </Card>

        <Card className="rounded-2xl border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] bg-gradient-to-br from-white to-slate-50/50 relative overflow-hidden">
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                <ActivityIcon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
              Para Hoje
            </p>
            <h3 className="text-2xl font-black text-gray-900">
              {todayActs.length}{' '}
              <span className="text-sm text-gray-400 font-semibold normal-case">
                tarefas
              </span>
            </h3>
          </CardContent>
          {todayActs.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-400" />
          )}
        </Card>

        <Card className="rounded-2xl border-none shadow-[0_4px_20px_rgba(0,0,0,0.1)] bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.03] rounded-full blur-2xl -translate-y-10 translate-x-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full blur-xl translate-y-10 -translate-x-5" />
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-white/10 text-white rounded-xl backdrop-blur-sm border border-white/5">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
              Novos Leads
            </p>
            <h3 className="text-2xl font-black text-white">
              {newLeads.length}{' '}
              <span className="text-sm text-gray-400 font-semibold normal-case">
                na fila
              </span>
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Agenda Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-[0_2px_12px_rgba(0,0,0,0.03)] border-gray-100 rounded-2xl lg:col-span-1 bg-white">
          <CardHeader className="py-4 px-5 border-b border-gray-50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black flex items-center gap-2 text-gray-800">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <CalendarIcon className="w-4 h-4" />
              </div>
              Minha Agenda
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100"
              onClick={handleSyncCalendar}
              disabled={syncing}
              title="Sincronizar com Google Agenda"
            >
              <RefreshCw className={cn('w-4 h-4', syncing && 'animate-spin')} />
            </Button>
          </CardHeader>
          <CardContent className="p-4 flex justify-center border-b border-gray-50">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border-0 w-full flex justify-center"
            />
          </CardContent>
        </Card>

        <Card className="shadow-[0_2px_12px_rgba(0,0,0,0.03)] border-gray-100 rounded-2xl lg:col-span-2 bg-white flex flex-col h-full min-h-[420px]">
          <CardHeader className="py-4 px-5 border-b border-gray-50 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <CardTitle className="text-sm font-black text-gray-800 flex items-center justify-between">
              <span>
                Compromissos do dia:{' '}
                {selectedDate ? selectedDate.toLocaleDateString() : 'hoje'}
              </span>
              <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                {selectedDateActs.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[380px] custom-scrollbar">
            {selectedDateActs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-sm text-gray-400 font-semibold p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-300" />
                </div>
                Nenhuma atividade para este dia.
              </div>
            ) : (
              <div className="flex flex-col">
                {selectedDateActs.map(renderAgendaAct)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grid of Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <MiniList
          title="Pendências Urgentes"
          icon={AlertCircle}
          items={overdue}
          badgeColor="bg-red-100 text-red-700"
          emptyText="Zero atrasos! Você está no controle."
          renderItem={renderAct}
        />
        <MiniList
          title="Agenda do Dia"
          icon={Play}
          items={todayActs}
          badgeColor="bg-blue-100 text-blue-700"
          emptyText="Nenhuma ação agendada para hoje."
          renderItem={renderAct}
        />
        <MiniList
          title="Novos Leads (Sem Contato)"
          icon={Building2}
          items={newLeads}
          badgeColor="bg-emerald-100 text-emerald-700"
          emptyText="Nenhum lead novo pendente."
          renderItem={renderAcc}
        />
        <MiniList
          title="Anti-Esquecimento"
          icon={AlertTriangle}
          items={noActionAccs}
          badgeColor="bg-amber-100 text-amber-700"
          emptyText="Todas as contas possuem próxima ação."
          renderItem={renderAcc}
        />
        <MiniList
          title="Prioridade A (S/ Ação)"
          icon={Target}
          items={priorityA}
          badgeColor="bg-indigo-100 text-indigo-700"
          emptyText="Prioridades A estão engajadas."
          renderItem={renderAcc}
        />
        <MiniList
          title="Oportunidades Paradas"
          icon={TrendingDown}
          items={stalledOpps}
          badgeColor="bg-rose-100 text-rose-700"
          emptyText="Pipeline com follow-up em dia."
          renderItem={renderOpp}
        />
      </div>
    </div>
  )
}
