import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, FileText, Download, Copy, Trash2 } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import useMainStore from '@/stores/main'
import { exportOrderExcel } from '@/lib/export-utils'
import { formatCurrency } from '@/lib/crm-utils'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { OrderSummaryCards } from '@/components/orders/OrderSummaryCards'

const PERIODS = ['Todos', 'Hoje', 'Semana', 'Mês']

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Pedido gerado':
      return 'bg-blue-50 text-blue-600'
    case 'Em separação':
      return 'bg-yellow-50 text-yellow-600'
    case 'Entregue':
      return 'bg-emerald-50 text-emerald-600'
    case 'Cancelado':
      return 'bg-red-50 text-red-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

export default function Orders() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { orders, loading, fetchData } = useMainStore() as any
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [periodFilter, setPeriodFilter] = useState('Todos')
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({})
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  useEffect(() => {
    if (orders.length > 0) {
      fetchItemCounts()
    }
  }, [orders])

  const fetchItemCounts = async () => {
    const { data } = await supabase
      .from('order_form_items')
      .select('order_form_id')
    const counts: Record<string, number> = {}
    ;(data || []).forEach((item: any) => {
      counts[item.order_form_id] = (counts[item.order_form_id] || 0) + 1
    })
    setItemCounts(counts)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return orders.filter((o: any) => {
      const matchSearch =
        !q ||
        (o.customer_name || '').toLowerCase().includes(q) ||
        (o.contact_name || '').toLowerCase().includes(q) ||
        (o.order_number || '').toLowerCase().includes(q) ||
        (o.responsible || '').toLowerCase().includes(q) ||
        (o.created_at &&
          format(new Date(o.created_at), 'dd/MM/yyyy').includes(q))
      const matchStatus = statusFilter === 'Todos' || o.status === statusFilter
      let matchPeriod = true
      if (periodFilter !== 'Todos' && o.created_at) {
        const d = new Date(o.created_at)
        const now = new Date()
        if (periodFilter === 'Hoje')
          matchPeriod = d.toDateString() === now.toDateString()
        else if (periodFilter === 'Semana') {
          const weekAgo = new Date(now)
          weekAgo.setDate(weekAgo.getDate() - 7)
          matchPeriod = d >= weekAgo
        } else if (periodFilter === 'Mês') {
          matchPeriod =
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
        }
      }
      return matchSearch && matchStatus && matchPeriod
    })
  }, [orders, search, statusFilter, periodFilter])

  const handleDuplicate = async (order: any) => {
    try {
      const { data: newOrder, error } = await supabase
        .from('order_forms')
        .insert({
          customer_name: order.customer_name,
          customer_cnpj: order.customer_cnpj,
          contact_name: order.contact_name,
          phone: order.phone,
          email: order.email,
          city: order.city,
          state: order.state,
          address: order.address,
          responsible: order.responsible,
          status: 'Rascunho',
          notes: order.notes,
          is_manual_customer: order.is_manual_customer,
          subtotal: order.subtotal,
          discount: order.discount,
          total_amount: order.total_amount,
        })
        .select()
        .single()
      if (error) throw error

      const { data: items } = await supabase
        .from('order_form_items')
        .select('*')
        .eq('order_form_id', order.id)
      if (items && items.length > 0) {
        await supabase.from('order_form_items').insert(
          items.map((it: any) => ({
            product_name: it.product_name,
            description: it.description,
            quantity: it.quantity,
            unit: it.unit,
            unit_price: it.unit_price,
            total_price: it.total_price,
            notes: it.notes,
            order_form_id: newOrder.id,
          })),
        )
      }
      toast({ title: 'Pedido duplicado com sucesso!' })
      await fetchData()
    } catch (e: any) {
      toast({
        title: 'Erro ao duplicar',
        description: e.message,
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await supabase.from('order_forms').delete().eq('id', deleteTarget)
      toast({ title: 'Pedido excluído com sucesso.' })
      await fetchData()
    } catch (e: any) {
      toast({
        title: 'Erro ao excluir',
        description: e.message,
        variant: 'destructive',
      })
    }
    setDeleteTarget(null)
  }

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
            <Plus className="w-4 h-4 mr-2" /> Novo Pedido
          </Button>
        </Link>
      </div>

      <OrderSummaryCards orders={orders} />

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por cliente, empresa, nº, data, responsável..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <Button
              key={p}
              variant={periodFilter === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriodFilter(p)}
              className={
                periodFilter === p
                  ? 'bg-[#FF6A00] hover:bg-[#E55A00] text-white'
                  : ''
              }
            >
              {p}
            </Button>
          ))}
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
                  <th className="p-4">Data</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Empresa</th>
                  <th className="p-4 text-right">Valor Total</th>
                  <th className="p-4 text-center">Itens</th>
                  <th className="p-4">Responsável</th>
                  <th className="p-4">Últ. Alteração</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-500">
                      Carregando pedidos...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-500">
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((order: any) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 cursor-pointer"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <td className="p-4 font-medium text-slate-900">
                        {order.order_number}
                      </td>
                      <td className="p-4 text-slate-600">
                        {order.created_at
                          ? format(new Date(order.created_at), 'dd/MM/yyyy')
                          : '-'}
                      </td>
                      <td className="p-4 text-slate-700">
                        {order.contact_name || '-'}
                      </td>
                      <td className="p-4 font-medium text-slate-900">
                        {order.customer_name || 'Não informado'}
                      </td>
                      <td className="p-4 font-semibold text-slate-900">
                        {formatCurrency(Number(order.total_amount || 0))}
                      </td>
                      <td className="p-4 text-center text-slate-600">
                        {itemCounts[order.id] || 0}
                      </td>
                      <td className="p-4 text-slate-600">
                        {order.responsible || '-'}
                      </td>
                      <td className="p-4 text-xs text-slate-500">
                        {order.updated_at
                          ? format(
                              new Date(order.updated_at),
                              'dd/MM/yyyy HH:mm',
                            )
                          : '-'}
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            'px-2.5 py-1 rounded-full text-xs font-medium',
                            getStatusStyle(order.status || 'Rascunho'),
                          )}
                        >
                          {order.status || 'Rascunho'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-[#FF6A00]"
                            onClick={() =>
                              navigate(`/orders/${order.id}?preview=true`)
                            }
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-blue-600"
                            onClick={() => handleDuplicate(order)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-green-600"
                            onClick={() => exportOrderExcel(order)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteTarget(order.id)}
                          >
                            <Trash2 className="w-4 h-4" />
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

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Pedido</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este pedido? Esta ação não pode ser
              desfeita e não afetará contas ou contatos vinculados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
