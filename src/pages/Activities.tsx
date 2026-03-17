import { useState } from 'react'
import useMainStore from '@/stores/main'
import { getActionColor } from '@/lib/crm-utils'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  CheckCircle2,
  Phone,
  Mail,
  Linkedin,
  Calendar,
  MessageSquare,
} from 'lucide-react'

const iconMap: Record<string, any> = {
  Ligação: Phone,
  'E-mail enviado': Mail,
  'Convite LinkedIn': Linkedin,
  'Mensagem LinkedIn': Linkedin,
  'WhatsApp enviado': MessageSquare,
  'Reunião agendada': Calendar,
  'Reunião realizada': Calendar,
}

export default function Activities() {
  const { activities, accounts, completeActivity } = useMainStore()
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Registro de Atividades
          </h1>
          <p className="text-muted-foreground">
            Acompanhe todos os touchpoints com seus leads
          </p>
        </div>
        <Button className="bg-black text-white rounded-full px-6 shadow-lg">
          <Plus className="w-4 h-4 mr-2" /> Nova Atividade
        </Button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700">
                  Data
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Tipo
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Conta
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Resultado
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Status
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-700">
                  Ação
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedActivities.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhuma atividade registrada.
                  </TableCell>
                </TableRow>
              ) : (
                sortedActivities.map((act) => {
                  const acc = accounts.find((a) => a.id === act.accountId)
                  const Icon = iconMap[act.type] || Activity
                  return (
                    <TableRow
                      key={act.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="text-gray-600 font-medium">
                        {new Date(act.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gray-100 rounded-md">
                            <Icon className="w-3.5 h-3.5 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium">
                            {act.type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        {acc?.name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {act.result || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getActionColor(act.date, act.completed)}
                        >
                          {act.completed ? 'Concluída' : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {!act.completed ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => completeActivity(act.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400 italic pr-4">
                            Feito
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
