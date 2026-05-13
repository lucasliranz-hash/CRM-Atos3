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
  KanbanSquare,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import useMainStore from '@/stores/main'
import { SidebarGoals } from './SidebarGoals'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Target, label: 'Focus Mode', path: '/focus' },
  { icon: KanbanSquare, label: 'Pipeline', path: '/pipeline' },
  { icon: Users, label: 'Contatos', path: '/contacts' },
  { icon: Building2, label: 'Leads', path: '/accounts' },
  { icon: FileText, label: 'Propostas', path: '/proposals' },
  { icon: Activity, label: 'Atividades', path: '/activities' },
  { icon: Calendar, label: 'Calendário', path: '/calendar' },
  { icon: BarChart, label: 'Relatórios', path: '/reports' },
  { icon: SettingsIcon, label: 'Configurações', path: '/settings' },
]

export function Sidebar() {
  const location = useLocation()
  const { logoUrl } = useMainStore()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 z-50 hidden md:flex flex-col bg-[#0D1B2A] border-r border-slate-800 text-slate-300">
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
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium',
                isActive
                  ? 'bg-white/10 text-[#FF6A00]'
                  : 'hover:bg-white/5 text-slate-400 hover:text-white',
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          )
        })}
      </div>

      <SidebarGoals />

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
