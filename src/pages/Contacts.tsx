import useMainStore from '@/stores/main'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, User, Building2 } from 'lucide-react'

export default function Contacts() {
  const { contacts, accounts } = useMainStore()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contatos</h1>
          <p className="text-muted-foreground">
            Pessoas e decisores vinculados às contas
          </p>
        </div>
        <Button className="bg-black text-white rounded-full px-6 shadow-lg">
          <Plus className="w-4 h-4 mr-2" /> Novo Contato
        </Button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700">
                  Nome
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Conta Relacionada
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Cargo
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Papel no Processo
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">
                  Decisor?
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhum contato cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((c) => {
                  const acc = accounts.find((a) => a.id === c.accountId)
                  return (
                    <TableRow
                      key={c.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="font-medium flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        {c.name}
                      </TableCell>
                      <TableCell className="text-gray-600 flex items-center gap-2 mt-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {acc?.name}
                      </TableCell>
                      <TableCell className="text-gray-800">{c.role}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0"
                        >
                          {c.processRole}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {c.isDecisionMaker ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">
                            Sim
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">Não</span>
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
