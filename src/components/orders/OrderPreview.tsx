import { OrderForm, OrderFormItem } from '@/types/crm'
import useMainStore from '@/stores/main'
import { format } from 'date-fns'
import { forwardRef } from 'react'

interface Props {
  order: Partial<OrderForm>
  items: Partial<OrderFormItem>[]
  company?: any
}

export const OrderPreview = forwardRef<HTMLDivElement, Props>(
  ({ order, items, company }, ref) => {
    const { logoUrl: storeLogo } = useMainStore()
    const logoUrl = company?.logo_url || storeLogo

    const formatCurrency = (val: number) =>
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(val || 0)

    return (
      <div
        ref={ref}
        className="bg-white p-8 max-w-[800px] mx-auto text-sm print:p-0 print:shadow-none shadow-sm border border-slate-200 print:border-none print:max-w-none print:w-full"
      >
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-4 mb-4">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-16 object-contain max-w-[200px]"
                />
              )}
              <div>
                {company?.company_name ? (
                  <h1 className="text-xl font-black text-slate-900">
                    {company.company_name}
                  </h1>
                ) : !logoUrl ? (
                  <h1 className="text-xl font-black text-slate-900">ATOS3</h1>
                ) : null}
                {company?.fantasy_name && (
                  <p className="text-sm font-bold text-slate-700">
                    {company.fantasy_name}
                  </p>
                )}
              </div>
            </div>

            {company && (
              <div className="text-xs text-slate-500 mb-6 space-y-1">
                {company.cnpj && <p>CNPJ: {company.cnpj}</p>}
                {(company.city || company.state) && (
                  <p>
                    {company.address ? `${company.address}, ` : ''}
                    {company.number ? `${company.number} - ` : ''}
                    {company.city}/{company.state}
                  </p>
                )}
                {company.phone && (
                  <p>
                    Tel: {company.phone}{' '}
                    {company.whatsapp ? `| WhatsApp: ${company.whatsapp}` : ''}
                  </p>
                )}
                {company.email && <p>E-mail: {company.email}</p>}
              </div>
            )}

            <h2 className="text-2xl font-black text-slate-800">
              FICHA DE PEDIDO
            </h2>
            <p className="text-slate-500 mt-1 font-medium">
              Nº: {order.order_number || 'Novo'}
            </p>
          </div>
          <div className="text-right text-slate-600 space-y-1">
            <p>
              Data:{' '}
              {order.created_at
                ? format(new Date(order.created_at), 'dd/MM/yyyy')
                : format(new Date(), 'dd/MM/yyyy')}
            </p>
            <p>Status: {order.status || 'Rascunho'}</p>
            <p>Responsável: {order.responsible || '-'}</p>
          </div>
        </div>

        <div className="mb-8 bg-slate-50 p-4 rounded-lg border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">
            DADOS DO CLIENTE
          </h3>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-slate-700">
            <p>
              <b>Empresa:</b> {order.customer_name || '-'}
            </p>
            <p>
              <b>CNPJ:</b> {order.customer_cnpj || '-'}
            </p>
            <p>
              <b>Contato:</b> {order.contact_name || '-'}
            </p>
            <p>
              <b>Telefone:</b> {order.phone || '-'}
            </p>
            <p>
              <b>E-mail:</b> {order.email || '-'}
            </p>
            <p>
              <b>Cidade/UF:</b> {order.city || '-'} / {order.state || '-'}
            </p>
            <p className="col-span-2">
              <b>Endereço:</b> {order.address || '-'}
            </p>
          </div>
        </div>

        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="bg-slate-100 border border-slate-200 text-slate-700">
              <th className="p-2 text-left border border-slate-200">Produto</th>
              <th className="p-2 text-center border border-slate-200 w-16">
                Qtd
              </th>
              <th className="p-2 text-center border border-slate-200 w-24">
                Unidade
              </th>
              <th className="p-2 text-right border border-slate-200 w-28">
                V. Unit
              </th>
              <th className="p-2 text-right border border-slate-200 w-28">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx} className="border border-slate-200 text-slate-600">
                <td className="p-2 border border-slate-200">
                  <p className="font-semibold text-slate-800">
                    {it.product_name}
                  </p>
                  {it.description && (
                    <p className="text-xs mt-1 text-slate-500">
                      {it.description}
                    </p>
                  )}
                  {it.notes && (
                    <p className="text-xs mt-1 italic text-slate-400">
                      Obs: {it.notes}
                    </p>
                  )}
                </td>
                <td className="p-2 text-center border border-slate-200">
                  {it.quantity}
                </td>
                <td className="p-2 text-center border border-slate-200">
                  {it.unit}
                </td>
                <td className="p-2 text-right border border-slate-200">
                  {formatCurrency(it.unit_price || 0)}
                </td>
                <td className="p-2 text-right border border-slate-200 font-medium">
                  {formatCurrency(it.total_price || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-64 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex justify-between mb-2 text-slate-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between mb-2 text-slate-600">
              <span>Desconto:</span>
              <span className="text-red-500">
                -{formatCurrency(order.discount || 0)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg text-slate-800 border-t border-slate-200 pt-2 mt-2">
              <span>Total Geral:</span>
              <span>{formatCurrency(order.total_amount || 0)}</span>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="mb-12">
            <h3 className="font-bold text-slate-800 mb-2">
              Observações Gerais:
            </h3>
            <p className="text-slate-600 whitespace-pre-wrap">{order.notes}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 mt-16 pt-16 break-inside-avoid">
          <div className="text-center">
            <div className="border-t border-slate-400 w-3/4 mx-auto mb-2"></div>
            <p className="font-bold text-slate-800">
              {company?.fantasy_name || company?.company_name || 'ATOS3'} /
              Responsável
            </p>
            <p className="text-slate-500 text-xs">
              {order.responsible || company?.responsible_name || '-'}
            </p>
          </div>
          <div className="text-center">
            <div className="border-t border-slate-400 w-3/4 mx-auto mb-2"></div>
            <p className="font-bold text-slate-800">Cliente / Recebedor</p>
            <p className="text-slate-500 text-xs">
              {order.customer_name || 'Assinatura'}
            </p>
          </div>
        </div>
      </div>
    )
  },
)
OrderPreview.displayName = 'OrderPreview'
