import { useState, useEffect } from 'react'
import {
  Bell,
  Calendar,
  Plus,
  Clock,
  Calendar as CalendarIcon,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate, useLocation } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { NewLeadDialog } from '@/components/leads/NewLeadDialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/focus':
        return 'Focus Mode'
      case '/pipeline':
        return 'Pipeline'
      case '/contacts':
        return 'Contatos'
      case '/accounts':
        return 'Leads'
      case '/activities':
        return 'Atividades'
      case '/calendar':
        return 'Calendário'
      case '/reports':
        return 'Relatórios'
      case '/settings':
        return 'Configurações'
      default:
        return ''
    }
  }

  const { toast } = useToast()

  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const [agenda, setAgenda] = useState<any[]>([])

  useEffect(() => {
    fetchNotifications()
    fetchAgenda()

    const handleEvent = () => {
      fetchNotifications()
      fetchAgenda()
    }
    window.addEventListener('lead_updated', handleEvent)
    window.addEventListener('lead_added', handleEvent)
    return () => {
      window.removeEventListener('lead_updated', handleEvent)
      window.removeEventListener('lead_added', handleEvent)
    }
  }, [])

  const fetchNotifications = async () => {
    try {
      const [notifRes, accRes] = await Promise.all([
        supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('accounts')
          .select('id, name, nextAction, nextActionDate, nextActionStatus')
          .not('nextAction', 'is', null)
          .neq('nextActionStatus', 'Concluída'),
      ])

      let allNotifs = notifRes.data || []

      if (accRes.data) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const taskNotifs = accRes.data
          .filter((a) => {
            if (!a.nextActionDate) return false
            const d = new Date(a.nextActionDate)
            d.setHours(0, 0, 0, 0)
            return d <= today
          })
          .map((a) => {
            const d = new Date(a.nextActionDate)
            d.setHours(0, 0, 0, 0)
            const isOverdue = d < today
            return {
              id: `task-${a.id}`,
              title: isOverdue ? 'Tarefa Atrasada' : 'Tarefa do Dia',
              message: `${a.name}: ${a.nextAction}`,
              read: false,
              related_id: a.id,
              related_type: 'account',
              created_at: a.nextActionDate,
              isTask: true,
            }
          })

        allNotifs = [...taskNotifs, ...allNotifs].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
      }

      setNotifications(allNotifs)
      setUnreadCount(allNotifs.filter((n) => !n.read).length)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchAgenda = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('activities')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(10)

      if (data) {
        setAgenda(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const markAsRead = async (id: string, isTask?: boolean) => {
    try {
      if (!isTask) {
        await supabase.from('notifications').update({ read: true }).eq('id', id)
      }
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (e) {
      console.error(e)
    }
  }

  const handleNotificationClick = (n: any) => {
    markAsRead(n.id, n.isTask)
    if (n.related_id) {
      if (n.related_type === 'account' || n.related_type === 'lead') {
        navigate(`/leads/${n.related_id}`)
      } else if (n.related_type === 'proposal') {
        navigate(`/proposals/${n.related_id}`)
      }
    }
  }

  const handleAgendaClick = (act: any) => {
    if (act.accountId) {
      navigate(`/leads/${act.accountId}`)
    }
  }

  return (
    <header className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 z-40 flex items-center justify-between pointer-events-auto">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-[#0D1B2A] hidden sm:block">
          {getPageTitle()}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-slate-500 hover:text-[#0D1B2A] hover:bg-slate-100 bg-white shadow-sm border border-slate-200 w-10 h-10 relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#FF6A00] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white -translate-y-1 translate-x-1">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-0 mr-4 mt-2 border-slate-200 shadow-xl rounded-xl"
            align="end"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-xl">
              <h3 className="font-black text-slate-900">Notificações</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold text-[#FF6A00] bg-orange-100 px-2 py-0.5 rounded-full">
                  {unreadCount} não lidas
                </span>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm font-medium">
                  Nenhuma notificação no momento.
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={cn(
                        'p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors',
                        !n.read && 'bg-orange-50/30',
                        n.title === 'Tarefa Atrasada' && 'bg-red-50/30',
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4
                          className={cn(
                            'text-sm font-bold',
                            !n.read ? 'text-slate-900' : 'text-slate-600',
                          )}
                        >
                          {n.title}
                        </h4>
                        {!n.read && (
                          <div className="w-2 h-2 rounded-full bg-[#FF6A00] mt-1.5 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {new Date(n.created_at).toLocaleDateString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-slate-500 hover:text-[#0D1B2A] hover:bg-slate-100 bg-white shadow-sm border border-slate-200 w-10 h-10"
            >
              <Calendar className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-0 mr-4 mt-2 border-slate-200 shadow-xl rounded-xl"
            align="end"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
              <h3 className="font-black text-slate-900">Agenda Rápida</h3>
              <p className="text-xs text-slate-500 font-medium">
                Seus próximos compromissos
              </p>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 bg-white custom-scrollbar">
              {agenda.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm font-medium">
                  Nenhum compromisso agendado.
                </div>
              ) : (
                agenda.map((act) => (
                  <div
                    key={act.id}
                    onClick={() => handleAgendaClick(act)}
                    className="p-3 rounded-lg border border-slate-100 hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer bg-white group flex gap-3"
                  >
                    <div className="mt-0.5">
                      {act.type?.includes('Reunião') ? (
                        <CalendarIcon className="w-4 h-4 text-purple-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#FF6A00] transition-colors">
                        {act.title || act.type}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {new Date(act.date).toLocaleDateString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                  </div>
                ))
              )}
            </div>
            <div className="p-2 border-t border-slate-100 bg-slate-50 rounded-b-xl flex gap-2">
              <Button
                onClick={() => navigate('/activities')}
                className="w-full text-xs font-bold h-8 bg-[#FF6A00] hover:bg-[#e65c00]"
              >
                Nova atividade
              </Button>
              <Button
                onClick={() => navigate('/calendar')}
                variant="outline"
                className="w-full text-xs font-bold h-8"
              >
                Ver calendário completo
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          className="hidden sm:flex border-orange-200 text-[#FF6A00] hover:bg-orange-50 hover:text-[#e65c00] bg-white font-bold h-10 px-4 rounded-[8px] shadow-sm"
          onClick={() => navigate('/focus')}
        >
          Focus Mode
        </Button>

        <NewLeadDialog>
          <Button className="bg-[#FF6A00] hover:bg-[#e65c00] text-white rounded-[8px] font-bold shadow-md h-10 px-4 ml-2">
            <Plus className="w-4 h-4 mr-2" /> Novo Lead
          </Button>
        </NewLeadDialog>
      </div>
    </header>
  )
}
