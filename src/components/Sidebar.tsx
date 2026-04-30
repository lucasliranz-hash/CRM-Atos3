import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  Activity,
  Kanban,
  BarChart,
  Settings as SettingsIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import useMainStore from '@/stores/main'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Building2, label: 'Contas & Leads', path: '/accounts' },
  { icon: Users, label: 'Contatos', path: '/contacts' },
  { icon: Activity, label: 'Atividades', path: '/activities' },
  { icon: Kanban, label: 'Pipeline', path: '/pipeline' },
  { icon: BarChart, label: 'Relatórios', path: '/reports' },
]

export function Sidebar() {
  const location = useLocation()
  const { logoUrl } = useMainStore()

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 z-50 hidden md:flex flex-col items-center py-6 bg-slate-900 border-r border-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.1)]">
      <div className="mb-8 px-2">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo"
            className="w-10 h-10 object-contain drop-shadow-sm"
          />
        ) : (
          <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-md">
            <span className="font-black text-[10px] uppercase tracking-tighter">
              Atos3
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 flex-1 w-full px-3">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path))
          return (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  className={cn(
                    'p-3.5 rounded-xl transition-all duration-300 flex items-center justify-center relative group w-full',
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80',
                  )}
                >
                  <item.icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={cn(
                      'transition-transform duration-300 group-hover:scale-110',
                      isActive && 'scale-110',
                    )}
                  />
                  {isActive && (
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-orange-500 rounded-r-full" />
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-gray-900 text-white border-0 ml-4 shadow-xl font-bold px-3 py-1.5 text-xs rounded-lg"
              >
                {item.label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      <div className="mt-auto px-3 w-full pb-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/settings"
              className={cn(
                'p-3.5 rounded-xl transition-all duration-300 flex items-center justify-center relative group w-full',
                location.pathname === '/settings'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80',
              )}
            >
              <SettingsIcon
                size={22}
                strokeWidth={location.pathname === '/settings' ? 2.5 : 2}
                className="transition-transform duration-500 group-hover:rotate-45"
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-gray-900 text-white border-0 ml-4 shadow-xl font-bold px-3 py-1.5 text-xs rounded-lg"
          >
            Configurações
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  )
}
