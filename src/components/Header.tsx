import { Crosshair, Plus, LogOut } from 'lucide-react'
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
    <header className="flex items-center justify-between px-6 py-4 bg-white mx-4 mt-4 rounded-xl border border-gray-200 shadow-sm sticky top-4 z-40">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3 group">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-8 w-auto max-w-[160px] object-contain"
            />
          ) : (
            <>
              <div className="h-8 w-8 bg-black rounded flex items-center justify-center text-white shadow-sm group-hover:bg-gray-800 transition-colors">
                <Crosshair className="w-4 h-4" />
              </div>
              <span className="font-black text-xl tracking-tight text-black hidden sm:block">
                Atos3 CRM
              </span>
            </>
          )}
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              className="bg-black text-white hover:bg-gray-800 rounded font-semibold hidden sm:flex"
            >
              <Plus className="w-4 h-4 mr-1" /> Ação Rápida
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2 flex flex-col gap-1" align="end">
            <Button
              variant="ghost"
              className="justify-start w-full text-sm h-8 font-medium"
              onClick={() => navigate('/accounts')}
            >
              Nova Conta
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-sm h-8 font-medium"
              onClick={() => navigate('/pipeline')}
            >
              Nova Oportunidade
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-sm h-8 font-medium"
              onClick={() => navigate('/activities')}
            >
              Registrar Atividade
            </Button>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-black leading-none">
              {profile?.nome || 'Usuário'}
            </p>
            <p className="text-xs text-gray-500 mt-1 font-medium capitalize">
              {profile?.role || 'B2B Exec'}
            </p>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="h-9 w-9 border border-gray-200 shadow-sm cursor-pointer hover:border-black transition-colors">
                <AvatarFallback className="bg-gray-100 text-black font-bold">
                  {profile?.nome?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1" align="end">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 font-bold"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sair
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}
