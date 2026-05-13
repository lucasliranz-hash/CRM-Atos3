import { useState } from 'react'
import { Bell, Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import useMainStore from '@/stores/main'
import { NewLeadDialog } from '@/components/leads/NewLeadDialog'

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

  return (
    <header className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 z-40 flex items-center justify-between pointer-events-auto">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-[#0D1B2A] hidden sm:block">
          {getPageTitle()}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-slate-500 hover:text-[#0D1B2A] hover:bg-slate-100 bg-white shadow-sm border border-slate-200 w-10 h-10 relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-[#FF6A00] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white -translate-y-1 translate-x-1">
            3
          </span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-slate-500 hover:text-[#0D1B2A] hover:bg-slate-100 bg-white shadow-sm border border-slate-200 w-10 h-10"
        >
          <Calendar className="w-5 h-5" />
        </Button>
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
