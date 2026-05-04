import { useState } from 'react'
import useMainStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Building2, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import LeadHistorySheet from '@/components/LeadHistorySheet'
import { cn } from '@/lib/utils'

export default function Accounts() {
  const { accounts, contacts } = useMainStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  )

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.tags?.some((t) =>
        t.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      acc.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Leads
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Gerencie todas as empresas em prospecção.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white border-slate-200"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[10px] shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold text-slate-700">
                Empresa
              </TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="font-bold text-slate-700">
                Contato Principal
              </TableHead>
              <TableHead className="font-bold text-slate-700">
                Próxima Ação
              </TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-slate-500 font-medium"
                >
                  Nenhum lead encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredAccounts.map((acc) => {
                const mainContact =
                  contacts.find(
                    (c) => c.accountId === acc.id && c.isDecisionMaker,
                  ) || contacts.find((c) => c.accountId === acc.id)
                const isOverdue =
                  acc.nextActionDate &&
                  new Date(acc.nextActionDate) < new Date()

                return (
                  <TableRow
                    key={acc.id}
                    className="hover:bg-slate-50/50 cursor-pointer"
                    onClick={() => setSelectedAccountId(acc.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">
                            {acc.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {acc.city || '-'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-bold bg-slate-100 text-slate-700"
                      >
                        {acc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-slate-900">
                        {mainContact?.name || '-'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {mainContact?.processRole || ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          'text-sm font-bold',
                          isOverdue ? 'text-red-600' : 'text-slate-700',
                        )}
                      >
                        {acc.nextAction || '-'}
                      </div>
                      {acc.nextActionDate && (
                        <div
                          className={cn(
                            'text-xs',
                            isOverdue ? 'text-red-500' : 'text-slate-500',
                          )}
                        >
                          {new Date(acc.nextActionDate).toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-blue-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {selectedAccountId && (
        <LeadHistorySheet
          account={accounts.find((a) => a.id === selectedAccountId) || null}
          open={!!selectedAccountId}
          onOpenChange={(open) => !open && setSelectedAccountId(null)}
        />
      )}
    </div>
  )
}
