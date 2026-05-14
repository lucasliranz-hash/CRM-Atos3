import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useMainStore from '@/stores/main'
import { exportOrderExcel } from '@/lib/export-utils'
import { format } from 'date-fns'

export default function Orders() {
  const navigate = useNavigate()
  const { orders, loading } = useMainStore() as any
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')

  const filtered = orders.filter((o) => {
    const matchSearch =
      (o.customer_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.order_number || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'Todos' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Fichas de Pedido
          </h1>
          <p className="text-slate-500">
            Gerencie e acompanhe todos os pedidos emitidos.
          </p>
        </div>
        <Link to="/orders/new">
          <Button className="bg-[#FF6A00] hover:bg-[#E55A00] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Novo Pedido
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por empresa ou pedido..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os Status</SelectItem>
            <SelectItem value="Rascunho">Rascunho</SelectItem>
            <SelectItem value="Pedido gerado">Pedido gerado</SelectItem>
            <SelectItem value="Em separação">Em separação</SelectItem>
            <SelectItem value="Entregue">Entregue</SelectItem>
            <SelectItem value="Cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                  <th className="p-4">Nº Pedido</th>
                  <th className="p-4">Empresa</th>
                  <th className="p-4">Responsável</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Valor Total</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Carregando pedidos...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 cursor-pointer"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <td className="p-4 font-medium text-slate-900">
                        {order.order_number}
                      </td>
                      <td className="p-4">
                        {order.customer_name || 'Não informado'}
                      </td>
                      <td className="p-4">{order.responsible || '-'}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {format(new Date(order.created_at), 'dd/MM/yyyy')}
                      </td>
                      <td className="p-4 font-semibold text-slate-900">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(order.total_amount)}
                      </td>
                      <td className="p-4 text-right">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              navigate(`/orders/${order.id}?preview=true`)
                            }
                          >
                            <FileText className="w-4 h-4 text-slate-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => exportOrderExcel(order)}
                          >
                            <Download className="w-4 h-4 text-slate-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
