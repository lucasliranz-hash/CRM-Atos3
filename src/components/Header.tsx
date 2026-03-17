import { Bell, Mail, Search, Crosshair } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Today', href: '/' },
  { name: 'Contas', href: '/accounts' },
  { name: 'Pipeline', href: '/pipeline' },
]

export function Header() {
  const location = useLocation()

  return (
    <header className="flex items-center justify-between px-6 py-4 md:px-10 bg-white/80 backdrop-blur-md mx-4 mt-4 rounded-full sticky top-4 z-40 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white group-hover:bg-gray-800 transition-colors">
            <Crosshair className="w-4 h-4" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block text-gray-900">
            Outbound CRM
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-black',
                location.pathname === link.href
                  ? 'text-black font-semibold'
                  : 'text-gray-500',
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-gray-100/50 rounded-full px-4 py-2 border border-transparent focus-within:border-gray-300 transition-colors">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Buscar global..."
            className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all placeholder:text-gray-400"
          />
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
          <Mail className="w-5 h-5 text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>

        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
          <div className="text-right hidden xl:block">
            <p className="text-sm font-bold leading-none">Vendedor Solo</p>
            <p className="text-xs text-muted-foreground">B2B Sales</p>
          </div>
          <Avatar className="h-9 w-9 border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform">
            <AvatarImage
              src="https://img.usecurling.com/ppl/medium?gender=male&seed=42"
              alt="Avatar"
            />
            <AvatarFallback>VS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
