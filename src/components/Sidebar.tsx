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
  ClipboardList,
  Store,
  UserCheck,
  UserX,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import useMainStore from '@/stores/main'
import { SidebarGoals } from './SidebarGoals'
import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { LogOut } from 'lucide-react'
import { ProfileModal } from './ProfileModal'
import { Button } from '@/components/ui/button'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Target, label: 'Focus Mode', path: '/focus' },
  { icon: KanbanSquare, label: 'Pipeline', path: '/pipeline' },
  { icon: Users, label: 'Contatos', path: '/contacts' },
  { icon: Building2, label: 'Leads', path: '/accounts' },
  { icon: FileText, label: 'Propostas', path: '/proposals' },
  { icon: ClipboardList, label: 'Pedidos', path: '/orders' },
  { icon: Activity, label: 'Atividades', path: '/activities' },
  { icon: Calendar, label: 'Calendário', path: '/calendar' },
  { icon: BarChart, label: 'Relatórios', path: '/reports' },
  { icon: SettingsIcon, label: 'Configurações', path: '/settings' },
  { icon: Store, label: 'Empresa Emitente', path: '/settings/company' },
  { icon: UserCheck, label: 'Clientes', path: '/clients' },
  { icon: UserX, label: 'Leads Perdidos', path: '/lost-leads' },
]

export function Sidebar() {
  const location = useLocation()
  const { logoUrl } = useMainStore()
  const { profile, signOut } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 z-50 hidden md:flex flex-col bg-[#0D1B2A] border-r border-slate-800 text-slate-300 print:hidden">
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

      <div className="p-4 border-t border-white/10 flex items-center justify-between gap-3 bg-slate-900/50">
        <div
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setProfileOpen(true)}
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {profile?.nome?.substring(0, 2).toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {profile?.nome || 'Usuário'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {profile?.role || 'Cargo'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-white hover:bg-white/10 shrink-0"
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4" />
        </Button>
        <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
      </div>
    </aside>
  )
}
