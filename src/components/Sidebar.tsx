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

const navItems = [
  { icon: LayoutDashboard, label: 'Hoje', path: '/' },
  { icon: Building2, label: 'Contas', path: '/accounts' },
  { icon: Users, label: 'Contatos', path: '/contacts' },
  { icon: Activity, label: 'Atividades', path: '/activities' },
  { icon: Kanban, label: 'Pipeline', path: '/pipeline' },
  { icon: BarChart, label: 'Dashboard', path: '/reports' },
  { icon: SettingsIcon, label: 'Configurações', path: '/settings' },
]

export function Sidebar() {
  const location = useLocation()
  return (
    <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2 bg-black text-white py-6 px-3 rounded-2xl shadow-xl border border-gray-800">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <Tooltip key={item.path}>
            <TooltipTrigger asChild>
              <Link
                to={item.path}
                className={cn(
                  'p-3 rounded-xl transition-all',
                  isActive
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/10',
                )}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-black text-white border-0 ml-2 shadow-lg font-medium"
            >
              {item.label}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </aside>
  )
}
