import { Crosshair, Plus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Header() {
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white mx-4 mt-4 rounded-xl border border-gray-200 shadow-sm sticky top-4 z-40">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-8 w-8 bg-black rounded flex items-center justify-center text-white shadow-sm">
            <Crosshair className="w-4 h-4" />
          </div>
          <span className="font-black text-xl tracking-tight text-black">
            Atos3 CRM
          </span>
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
              className="justify-start w-full text-sm h-8"
              onClick={() => navigate('/accounts')}
            >
              Nova Conta
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-sm h-8"
              onClick={() => navigate('/contacts')}
            >
              Novo Contato
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-sm h-8"
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
              Sales Solo
            </p>
            <p className="text-xs text-gray-500 mt-1">B2B Exec</p>
          </div>
          <Avatar className="h-9 w-9 border border-gray-200">
            <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1" />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
