import { Bell, Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const navigate = useNavigate()

  return (
    <header className="absolute top-0 right-0 p-6 z-40 flex items-center gap-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 bg-white shadow-sm border border-slate-200 w-10 h-10 relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white -translate-y-1 translate-x-1">
            3
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 bg-white shadow-sm border border-slate-200 w-10 h-10"
        >
          <Calendar className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          className="hidden sm:flex border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 bg-white font-bold h-10 px-4 rounded-md shadow-sm"
          onClick={() => navigate('/focus')}
        >
          Focus Mode
        </Button>

        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-md font-bold shadow-md h-10 px-4 ml-2"
          onClick={() => navigate('/accounts')}
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Lead
        </Button>
      </div>
    </header>
  )
}
