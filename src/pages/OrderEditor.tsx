import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Save, FileText, Printer, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { OrderForm, OrderFormItem } from '@/types/crm'
import { OrderCustomerForm } from '@/components/orders/OrderCustomerForm'
import { OrderItemsTable } from '@/components/orders/OrderItemsTable'
import { OrderPreview } from '@/components/orders/OrderPreview'
import { exportOrderExcel } from '@/lib/export-utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function OrderEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const showPreviewParam = searchParams.get('preview') === 'true'

  const [order, setOrder] = useState<Partial<OrderForm>>({
    is_manual_customer: true,
    status: 'Rascunho',
    subtotal: 0,
    discount: 0,
    total_amount: 0,
    save_customer_to_crm: false,
  })
  const [items, setItems] = useState<Partial<OrderFormItem>[]>([])
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(showPreviewParam)

  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (id && id !== 'new') fetchOrder()
  }, [id])

  useEffect(() => {
    const sub = items.reduce((acc, it) => acc + Number(it.total_price || 0), 0)
    const disc = Number(order.discount || 0)
    setOrder((prev) => ({ ...prev, subtotal: sub, total_amount: sub - disc }))
  }, [items, order.discount])

  const fetchOrder = async () => {
    const { data: ord, error: errOrd } = await supabase
      .from('order_forms' as any)
      .select('*')
      .eq('id', id)
      .single()
    if (ord) setOrder(ord)
    const { data: itm } = await supabase
      .from('order_form_items' as any)
      .select('*')
      .eq('order_form_id', id)
    if (itm) setItems(itm)
  }

  const saveOrder = async () => {
    setLoading(true)
    try {
      let account_id = order.account_id
      if (order.is_manual_customer && order.save_customer_to_crm) {
        const { data: acc, error: accErr } = await supabase
          .from('accounts')
          .insert({
            name: order.customer_name || 'Novo Cliente',
            companyName: order.customer_name,
            email: order.email,
            phone: order.phone,
            city: order.city,
            state: order.state,
            status: 'Prospecção',
            priority: 'B',
          })
          .select()
          .single()
        if (accErr) throw accErr
        account_id = acc.id
      }

      const payload = { ...order, account_id }
      delete payload.created_at
      delete payload.updated_at

      let newOrderId = id
      if (id === 'new' || !id) {
        const { data: ins, error: errIns } = await supabase
          .from('order_forms' as any)
          .insert(payload)
          .select()
          .single()
        if (errIns) throw errIns
        newOrderId = ins.id
        setOrder((prev) => ({
          ...prev,
          id: ins.id,
          order_number: ins.order_number,
        }))
      } else {
        const { error: errUpd } = await supabase
          .from('order_forms' as any)
          .update(payload)
          .eq('id', id)
        if (errUpd) throw errUpd
      }

      await supabase
        .from('order_form_items' as any)
        .delete()
        .eq('order_form_id', newOrderId)
      if (items.length > 0) {
        const itemsPayload = items.map((it) => ({
          ...it,
          order_form_id: newOrderId,
        }))
        itemsPayload.forEach((it) => delete it.id)
        const { error: errItm } = await supabase
          .from('order_form_items' as any)
          .insert(itemsPayload)
        if (errItm) throw errItm
      }

      toast({ title: 'Pedido salvo com sucesso!' })
      if (id === 'new') navigate(`/orders/${newOrderId}`, { replace: true })
    } catch (e: any) {
      toast({
        title: 'Erro ao salvar pedido',
        description: e.message,
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-black text-slate-900">
            {order.order_number
              ? `Pedido ${order.order_number}`
              : 'Novo Pedido'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Editar' : 'Pré-visualizar'}
          </Button>
          {showPreview && (
            <>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" /> Imprimir / PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => exportOrderExcel(order, items)}
              >
                <Download className="w-4 h-4 mr-2" /> Excel
              </Button>
            </>
          )}
          {!showPreview && (
            <Button
              className="bg-[#FF6A00] hover:bg-[#E55A00] text-white"
              onClick={saveOrder}
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" /> Salvar Pedido
            </Button>
          )}
        </div>
      </div>

      {showPreview ? (
        <div className="print:m-0 print:p-0">
          <OrderPreview order={order} items={items} ref={printRef} />
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <OrderCustomerForm
                order={order}
                onChange={(upd) => setOrder((prev) => ({ ...prev, ...upd }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <OrderItemsTable items={items} onChange={setItems} />

              <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label>Observações Gerais</Label>
                  <Input
                    value={order.notes || ''}
                    onChange={(e) =>
                      setOrder((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    placeholder="Condições de pagamento, prazos, etc..."
                  />
                </div>
                <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Subtotal:</span>
                    <span>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(order.subtotal || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Desconto (R$):</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-32 text-right bg-white"
                      value={order.discount || ''}
                      onChange={(e) =>
                        setOrder((prev) => ({
                          ...prev,
                          discount: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Geral:</span>
                    <span>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(order.total_amount || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
