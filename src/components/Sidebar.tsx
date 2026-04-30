import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  Activity,
  Calendar,
  BarChart,
  Settings as SettingsIcon,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import useMainStore from '@/stores/main'

const navItems = [
  { icon: LayoutDashboard, label: 'Pipeline', path: '/pipeline' },
  { icon: Users, label: 'Leads', path: '/leads' },
  { icon: Users, label: 'Contatos', path: '/contacts' },
  { icon: Building2, label: 'Empresas', path: '/accounts' },
  { icon: Activity, label: 'Atividades', path: '/activities' },
  { icon: Calendar, label: 'Calendário', path: '/calendar' },
  { icon: BarChart, label: 'Relatórios', path: '/reports' },
  { icon: SettingsIcon, label: 'Configurações', path: '/settings' },
]

export function Sidebar() {
  const location = useLocation()
  const { logoUrl } = useMainStore()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 z-50 hidden md:flex flex-col bg-[#0A1128] border-r border-slate-800 text-slate-300">
      <div className="p-6 pb-8 flex items-center gap-3">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
        ) : (
          <div className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter">
            ATOS<span className="text-orange-500">3</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 px-4 flex-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive =
            location.pathname.startsWith(item.path) ||
            (item.path === '/pipeline' && location.pathname === '/')
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium',
                isActive
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'hover:bg-white/5 hover:text-white',
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          )
        })}
      </div>

      <div className="px-6 py-6 border-t border-white/10 space-y-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex justify-between">
          Metas do Mês <span className="text-slate-400">Abril/2025</span>
        </h4>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="flex items-center gap-2 text-slate-300">
              <Users className="w-3.5 h-3.5 text-blue-400" /> Leads Novos
            </span>
            <span className="text-white font-bold">62 / 100</span>
          </div>
          <Progress
            value={62}
            className="h-1.5 bg-white/10 [&>div]:bg-blue-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-green-400" /> Reuniões
            </span>
            <span className="text-white font-bold">8 / 15</span>
          </div>
          <Progress
            value={53}
            className="h-1.5 bg-white/10 [&>div]:bg-green-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="flex items-center gap-2 text-slate-300">
              <Target className="w-3.5 h-3.5 text-yellow-400" /> Propostas
            </span>
            <span className="text-white font-bold">3 / 8</span>
          </div>
          <Progress
            value={37}
            className="h-1.5 bg-white/10 [&>div]:bg-yellow-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="flex items-center gap-2 text-slate-300">
              <BarChart className="w-3.5 h-3.5 text-purple-400" /> Vendas
            </span>
            <span className="text-white font-bold">1 / 4</span>
          </div>
          <Progress
            value={25}
            className="h-1.5 bg-white/10 [&>div]:bg-purple-500"
          />
        </div>
      </div>

      <div className="p-4 border-t border-white/10 flex items-center gap-3">
        <img
          src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1"
          alt="User"
          className="w-10 h-10 rounded-full border-2 border-slate-700"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">Lucas</p>
          <p className="text-xs text-slate-400 truncate">Atos3</p>
        </div>
      </div>
    </aside>
  )
}
