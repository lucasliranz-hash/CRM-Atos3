import { Search, Plus, LogOut, Bell, Target } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import useMainStore from '@/stores/main'

export function Header() {
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()
  const { logoUrl } = useMainStore()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white/60 sticky top-0 z-40 backdrop-blur-xl border-b border-gray-200/50">
      <div className="flex items-center gap-6 flex-1">
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-8 w-auto max-w-[120px] object-contain drop-shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-sm">
              <span className="font-black text-[10px] uppercase tracking-tighter">
                Atos3
              </span>
            </div>
          )}
        </div>

        {/* Global Search Mock */}
        <div className="hidden md:flex items-center flex-1 max-w-md bg-white border border-gray-200 rounded-full px-4 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.06)] focus-within:border-gray-300 transition-all duration-300 group">
          <Search className="w-4 h-4 text-gray-400 mr-3 group-focus-within:text-black transition-colors" />
          <input
            type="text"
            placeholder="Buscar contas, contatos ou oportunidades..."
            className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-gray-400 text-gray-900"
          />
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold ml-2">
            <span className="px-1.5 py-0.5 rounded-md bg-gray-50 border border-gray-100">
              ⌘
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-gray-50 border border-gray-100">
              K
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="bg-orange-500 text-white rounded-full px-5 shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all duration-300 font-bold hidden sm:flex h-10">
              <Plus className="w-4 h-4 mr-1.5" strokeWidth={3} /> Novo Lead
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-56 p-2 flex flex-col gap-1 rounded-2xl shadow-xl border-gray-100"
            align="end"
          >
            <div className="px-3 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Criar Rapidamente
            </div>
            <Button
              variant="ghost"
              className="justify-start w-full text-sm h-9 font-bold rounded-xl hover:bg-gray-50 text-gray-700"
              onClick={() => navigate('/accounts')}
            >
              Conta ou Lead
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-sm h-9 font-bold rounded-xl hover:bg-gray-50 text-gray-700"
              onClick={() => navigate('/pipeline')}
            >
              Oportunidade
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-sm h-9 font-bold rounded-xl hover:bg-gray-50 text-gray-700"
              onClick={() => navigate('/activities')}
            >
              Registrar Atividade
            </Button>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-gray-400 hover:text-black hover:bg-gray-100 relative w-10 h-10 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </Button>

        <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer group p-1 pr-2 rounded-full hover:bg-white transition-colors border border-transparent hover:border-gray-100 hover:shadow-sm">
              <div className="text-right hidden sm:block group-hover:opacity-80 transition-opacity">
                <p className="text-sm font-bold text-gray-900 leading-none">
                  {profile?.nome || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 mt-1 font-semibold capitalize">
                  {profile?.role || 'B2B Exec'}
                </p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-gray-100 group-hover:ring-gray-200 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-gray-800 to-black text-white font-bold text-sm">
                  {profile?.nome?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-52 p-2 rounded-2xl shadow-xl border-gray-100"
            align="end"
          >
            <div className="px-3 py-3 border-b border-gray-50 mb-1 bg-gray-50/50 rounded-xl">
              <p className="text-sm font-black text-gray-900">
                {profile?.nome || 'Usuário'}
              </p>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">
                {profile?.role || 'B2B Exec'}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/settings')}
              className="w-full justify-start text-sm font-bold rounded-xl hover:bg-gray-50 text-gray-700 mt-1"
            >
              Configurações
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 font-bold rounded-xl mt-1"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
