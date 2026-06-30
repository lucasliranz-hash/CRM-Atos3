import { useState, useMemo } from 'react'
import useMainStore from '@/stores/main'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, FileText, ShoppingCart, Pencil, History } from 'lucide-react'
import { LeadEditModal } from '@/components/LeadEditModal'
import { LeadHistorySheet } from '@/components/LeadHistorySheet'
import { formatCurrency } from '@/lib/crm-utils'
import { format } from 'date-fns'

export default function Clients() {
  const navigate = useNavigate()
  const { accounts, proposals, fetchData } = useMainStore() as any
  const [search, setSearch] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [historyId, setHistoryId] = useState<string | null>(null)

  const clients = useMemo(
    () =>
      accounts.filter((a: any) => {
        const status = (a.status || '').toLowerCase().trim()
        return (
          status === 'ganho' || status === 'cliente' || status === 'customer'
        )
      }),
    [accounts],
  )

  const filtered = clients.filter((a: any) => {
    const q = search.toLowerCase()
    return (
      (a.companyName || a.name || '').toLowerCase().includes(q) ||
      (a.contactName || '').toLowerCase().includes(q) ||
      (a.phone || '').includes(q)
    )
  })

  const getClientValue = (accountId: string) => {
    const clientProposals = proposals.filter(
      (p: any) => p.accountId === accountId,
    )
    return clientProposals.reduce(
      (sum: number, p: any) =>
        sum +
        (p.totalSetup || 0) +
        (p.totalEquipment || 0) +
        (p.totalMonthly || 0) * 12,
      0,
    )
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Clientes
        </h1>
        <p className="text-slate-500 mt-1 font-medium text-sm">
          Leads convertidos com sucesso.
        </p>
      </div>
      <Card className="rounded-[10px] border border-slate-100 shadow-sm bg-white">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
        </div>
        <CardContent className="p-0 overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-slate-500 font-medium">
                Nenhum cliente encontrado.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Empresa</th>
                  <th className="p-3">Contato</th>
                  <th className="p-3">Telefone</th>
                  <th className="p-3">Cidade/UF</th>
                  <th className="p-3">Veículos</th>
                  <th className="p-3">Venda</th>
                  <th className="p-3">Valor</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a: any) => (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">
                      {a.companyName || a.name}
                    </td>
                    <td className="p-3 text-slate-600">
                      {a.contactName || '-'}
                    </td>
                    <td className="p-3 text-slate-600">{a.phone || '-'}</td>
                    <td className="p-3 text-slate-600">
                      {a.city ? `${a.city}/${a.state || ''}` : '-'}
                    </td>
                    <td className="p-3 text-slate-600">
                      {a.vehicleCount ?? '-'}
                    </td>
                    <td className="p-3 text-slate-500 text-xs">
                      {a.clientSince || a.updatedAt
                        ? format(
                            new Date(a.clientSince || a.updatedAt),
                            'dd/MM/yyyy',
                          )
                        : '-'}
                    </td>
                    <td className="p-3 font-bold text-emerald-600">
                      {formatCurrency(getClientValue(a.id))}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/leads/${a.id}`)}
                          title="Abrir"
                        >
                          <FileText className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setHistoryId(a.id)}
                          title="Histórico"
                        >
                          <History className="w-4 h-4 text-purple-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/orders/new?leadId=${a.id}`)}
                          title="Novo Pedido"
                        >
                          <ShoppingCart className="w-4 h-4 text-orange-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditId(a.id)}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4 text-blue-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      {editId && (
        <LeadEditModal
          open={!!editId}
          onOpenChange={(o: boolean) => !o && setEditId(null)}
          accountId={editId}
          onSuccess={() => fetchData()}
        />
      )}
      {historyId && (
        <LeadHistorySheet
          account={accounts.find((a: any) => a.id === historyId) || null}
          open={!!historyId}
          onOpenChange={(o: boolean) => !o && setHistoryId(null)}
        />
      )}
    </div>
  )
}
