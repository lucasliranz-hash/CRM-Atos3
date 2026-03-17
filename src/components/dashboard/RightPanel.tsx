import {
  Phone,
  Mail,
  Calendar,
  Linkedin,
  MessageSquare,
  Edit2,
  ArrowUpRight,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export function RightPanel() {
  return (
    <div className="hidden xl:flex flex-col w-80 glass-panel h-[calc(100vh-2rem)] sticky top-4 rounded-[32px] p-6 ml-4 border border-white/60">
      <div className="flex justify-between mb-8">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Edit2 className="w-4 h-4 text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowUpRight className="w-4 h-4 text-gray-500" />
        </Button>
      </div>

      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4">
          <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
            <AvatarImage src="https://img.usecurling.com/ppl/medium?gender=male&seed=42" />
            <AvatarFallback>CM</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mt-2">Carlos Mendes</h2>
        <p className="text-sm text-gray-500">Diretor de Frota, LogBrasil</p>

        <div className="flex gap-2 mt-6">
          <Button
            size="icon"
            className="rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 w-10 h-10"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 w-10 h-10"
          >
            <Mail className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 w-10 h-10"
          >
            <Phone className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Separator className="bg-gray-200 mb-6" />

      <div className="space-y-6">
        <h3 className="font-bold text-gray-800 mb-4">Informações do Cliente</h3>

        <div className="flex items-center gap-4">
          <div className="w-8 flex justify-center">
            <Truck className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">Tamanho da Frota</p>
            <p className="font-medium">120 Veículos</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-8 flex justify-center">
            <Mail className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-medium text-sm truncate">
              cmendes@logbrasil.com.br
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-8 flex justify-center">
            <Phone className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">Telefone</p>
            <p className="font-medium text-sm">+55 (11) 98765-4321</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-8 flex justify-center">
            <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center text-[8px]">
              ⌘
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Fontes</p>
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <MessageSquare className="w-3 h-3" />
              </div>
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Linkedin className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-8 flex justify-center">
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">Última Reunião</p>
            <p className="font-medium text-sm">12/10/2023 - 14:30</p>
          </div>
        </div>
      </div>
    </div>
  )
}
